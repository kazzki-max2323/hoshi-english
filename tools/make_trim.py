"""さいごの 息が 長く のびて ちがう 音に 聞こえる 単語（pron.TRIM）を 作りなおして audio/trim.mp3 / trim.json に まとめ、
元の 音声の .json からは その言葉を 消す（game.js の SPRITES では trim を いちばん 前に）。

  python tools/make_trim.py audio
  （kokoro.onnx と voices.bin は make_audio.py と同じ。 声は 単語カードと 同じ af_heart）

11/18 park が「パーツ」に 聞こえた: k の あとの 息（4kHz より 高い 音）が 110ms も のびていた → 30ms に みじかく する
"""
import glob, json, os, subprocess, sys
import numpy as np, soundfile as sf
from kokoro_onnx import Kokoro
sys.path.insert(0, os.path.dirname(__file__))
import pron

out = sys.argv[1]
k = Kokoro("kokoro.onnx", "voices.bin")
SR = 24000


def gen(text):
    ph = pron.phonemes(text, k.tokenizer)
    s, _ = k.create(ph or text, voice='af_heart', speed=0.9, lang="en-us", is_phonemes=bool(ph))
    s = s.astype(np.float32)
    nz = np.where(np.abs(s) > 0.01)[0]
    return s[max(0, nz[0] - 480):nz[-1] + 1200]


def trim_tail(s, keep=3):
    """声の あとの 息を keep×10ms だけ のこして、 10ms で 消す"""
    w = int(SR * .01)
    fr = np.fft.rfftfreq(w, 1 / SR)
    amp, hi = [], []
    for i in range(0, len(s) - w, w):
        F = np.abs(np.fft.rfft(s[i:i + w])) ** 2
        amp.append(np.abs(s[i:i + w]).max())
        hi.append(F[fr > 4000].sum() / (F.sum() + 1e-9))
    v = max((i for i in range(len(amp)) if amp[i] > .1 and hi[i] < .3), default=None)
    b = None if v is None else next((i for i in range(v + 1, len(amp)) if amp[i] > .02 and hi[i] > .5), None)
    if b is None:
        return s
    cut, f = (b + keep) * w, int(SR * .01)
    o = s[:cut + f].copy()
    o[b * w:] *= .75
    o[cut:] *= np.linspace(1, 0, len(o) - cut)
    return np.concatenate([o, np.zeros(int(SR * .05), dtype=np.float32)])


for f in sorted(glob.glob(f"{out}/*.json")):
    sp = os.path.basename(f)[:-5]
    if sp in ('trim', 'fix'):
        continue
    m = json.load(open(f))
    hit = [t for t in m if t in pron.TRIM]
    if hit:
        for t in hit:
            del m[t]
        json.dump(m, open(f, "w"), ensure_ascii=False, separators=(',', ':'))
        print(sp, hit, file=sys.stderr)

GAP = np.zeros(int(SR * .25), dtype=np.float32)
parts, idx, pos = [], {}, 0
for t in sorted(pron.TRIM):
    s = trim_tail(gen(t))
    idx[t] = [round(pos / SR, 3), round(len(s) / SR, 3)]
    parts += [s, GAP]
    pos += len(s) + len(GAP)
wav = "/tmp/trim.wav"
sf.write(wav, np.concatenate(parts), SR)
subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-i", wav, "-ac", "1", "-c:a", "libmp3lame", "-b:a", "40k",
                f"{out}/trim.mp3"], check=True)
json.dump(idx, open(f"{out}/trim.json", "w"), ensure_ascii=False, separators=(',', ':'))
print('trim', idx, file=sys.stderr)
