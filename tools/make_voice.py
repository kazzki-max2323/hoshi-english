"""ふだんの声（af_heart）だと 頭に「エ」「ア」が 入ったり にごったり する 単語を、 ほかの 声（pron.VOICE）で 録りなおす。
もとの 音声ごとに audio/v_<もとの名前>.mp3 / .json に まとめ、 もとの .json からは その単語を 消す（game.js の SPRITES に v_ も 入れる）。

  python tools/make_voice.py audio [v_es v_jh ...]   （名前を書くと その v_ だけ 作る）
  （kokoro.onnx と voices.bin は make_audio.py と同じ int8 版）

11/20 ユーザー「音声が変」（カード Vietnam が「エ・ヴィエトナム」に 聞こえた）。 全部の 単語を 音声認識で しらべて、
af_heart で 聞きとれず af_bella なら 聞きとれる 単語を pron.VOICE に 入れた。
もう v_ に ある 単語も 作り直す。
"""
import glob, json, os, subprocess, sys
import numpy as np, soundfile as sf
from kokoro_onnx import Kokoro
sys.path.insert(0, os.path.dirname(__file__))
import pron

out = sys.argv[1]
k = Kokoro("kokoro.onnx", "voices.bin")
SR = 24000
GAP = np.zeros(int(SR * .25), dtype=np.float32)


def gen(text, voice):
    ph = pron.phonemes(text, k.tokenizer)
    s, _ = k.create(ph or text, voice=voice, speed=0.9, lang="en-us", is_phonemes=bool(ph))
    s = s.astype(np.float32)
    nz = np.where(np.abs(s) > 0.01)[0]
    return s[max(0, nz[0] - 480):nz[-1] + 1200]


todo = {}  # v_ の 名前 -> 単語の list
for f in sorted(glob.glob(f"{out}/*.json")):
    sp = os.path.basename(f)[:-5]
    if sp in ('fix', 'trim'):
        continue
    m = json.load(open(f))
    if sp.startswith('v_'):
        todo.setdefault(sp, []).extend(t for t in m if t in pron.VOICE)
        continue
    hit = [t for t in m if t in pron.VOICE]
    if hit:
        for t in hit:
            del m[t]
        json.dump(m, open(f, "w"), ensure_ascii=False, separators=(',', ':'))
        todo.setdefault('v_' + sp, []).extend(hit)

only = set(sys.argv[2:])
for vs, words in sorted(todo.items()):
    if only and vs not in only:
        continue
    parts, idx, pos = [], {}, 0
    for t in sorted(set(words)):
        s = gen(t, pron.VOICE[t])
        idx[t] = [round(pos / SR, 3), round(len(s) / SR, 3)]
        parts += [s, GAP]
        pos += len(s) + len(GAP)
    wav = f"/tmp/{vs}.wav"
    sf.write(wav, np.concatenate(parts), SR)
    subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-i", wav, "-ac", "1", "-c:a", "libmp3lame", "-b:a", "40k",
                    f"{out}/{vs}.mp3"], check=True)
    json.dump(idx, open(f"{out}/{vs}.json", "w"), ensure_ascii=False, separators=(',', ':'))
    print(vs, len(idx), file=sys.stderr)
print("game.js の SPRITES に:", ",".join(f"'{v}'" for v in sorted(todo)), file=sys.stderr)
