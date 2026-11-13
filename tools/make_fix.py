"""読みまちがいを直した音声を audio/fix.mp3 / fix.json にまとめ、元の音声の .json からは その言葉を消す。

  python tools/make_fix.py audio
  （kokoro.onnx と voices.bin は make_audio.py と同じ。読みは tools/pron.py）

声は もとの録音と同じ声を さがして使う（同じ声・同じ速さなら 長さが ぴったり同じになる）。
もう fix.json にある言葉も 作り直す。
"""
import glob, json, os, subprocess, sys
import numpy as np, soundfile as sf
from kokoro_onnx import Kokoro
sys.path.insert(0, os.path.dirname(__file__))
import pron

out = sys.argv[1]
k = Kokoro("kokoro.onnx", "voices.bin")
SR = 24000
VOICES = ['af_heart', 'am_michael', 'bm_george', 'af_bella', 'am_puck', 'af_sky', 'af_nicole', 'bm_lewis']


def gen(text, voice, ph=None):
    s, _ = k.create(ph or text, voice=voice, speed=0.9, lang="en-us", is_phonemes=bool(ph))
    s = s.astype(np.float32)
    nz = np.where(np.abs(s) > 0.01)[0]
    return s[max(0, nz[0] - 480):nz[-1] + 1200]


old = json.load(open(f"{out}/fix.json")) if os.path.exists(f"{out}/fix.json") else {}
VF = os.path.join(os.path.dirname(__file__), 'fix-voices.json')
voices = json.load(open(VF)) if os.path.exists(VF) else {}
todo = {}  # text -> もとの長さ
sprites = {}
for f in sorted(glob.glob(f"{out}/*.json")):
    sp = os.path.basename(f)[:-5]
    if sp == 'fix':
        continue
    m = json.load(open(f))
    hit = [t for t in m if pron.phonemes(t, k.tokenizer)]
    for t in hit:
        todo.setdefault(t, set()).add(m[t][1])
        del m[t]
    if hit:
        sprites[sp] = m
        print(sp, len(hit), file=sys.stderr)
for t in old:
    todo.setdefault(t, set())

GAP = np.zeros(int(SR * .25), dtype=np.float32)
parts, idx, pos = [], {}, 0
for t in sorted(todo):
    v = voices.get(t)
    if not v:
        v = next((v for v in VOICES if round(len(gen(t, v)) / SR, 3) in todo[t]), None)
        if not v:
            v = 'af_heart' if ' ' not in t.strip() else 'am_michael'
            print('声が わからない:', t, '→', v, file=sys.stderr)
        voices[t] = v
    s = gen(t, v, pron.phonemes(t, k.tokenizer))
    idx[t] = [round(pos / SR, 3), round(len(s) / SR, 3)]
    parts += [s, GAP]
    pos += len(s) + len(GAP)

for sp, m in sprites.items():
    json.dump(m, open(f"{out}/{sp}.json", "w"), ensure_ascii=False, separators=(',', ':'))
wav = "/tmp/fix.wav"
sf.write(wav, np.concatenate(parts), SR)
subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-i", wav, "-ac", "1", "-c:a", "libmp3lame", "-b:a", "40k",
                f"{out}/fix.mp3"], check=True)
json.dump(voices, open(VF, 'w'), ensure_ascii=False, indent=0)
json.dump(idx, open(f"{out}/fix.json", "w"), ensure_ascii=False, separators=(',', ':'))
print('fix', len(idx), file=sys.stderr)
