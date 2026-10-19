"""単語とセリフの発音を、レベルごとに1つの mp3 にまとめる。

  pip install kokoro-onnx soundfile
  # kokoro-v1.0.int8.onnx と voices-v1.0.bin を
  # https://github.com/thewh1teagle/kokoro-onnx/releases から取得
  node tools/list_texts.js /tmp/texts
  python tools/make_audio.py <レベル> /tmp/texts audio  (es / jh / hs / adv)

audio/<レベル>.json には {英語: [開始秒, 長さ秒]} が入る。ffmpeg が必要。
"""
import json, subprocess, sys
import numpy as np, soundfile as sf
from kokoro_onnx import Kokoro

lv, texts_dir, out = sys.argv[1], sys.argv[2], sys.argv[3]
k = Kokoro("kokoro.onnx", "voices.bin")
texts = json.load(open(f"{texts_dir}/{lv}.texts.json"))
SR = 24000
GAP = np.zeros(int(SR * .25), dtype=np.float32)  # 単語のあいだの無音
parts, idx, pos = [], {}, 0
for i, (t, voice) in enumerate(texts):
    s, _ = k.create(t, voice=voice, speed=0.9, lang="en-us")
    s = s.astype(np.float32)
    nz = np.where(np.abs(s) > 0.01)[0]  # 前後の無音を切る
    if len(nz):
        s = s[max(0, nz[0] - 480):nz[-1] + 1200]
    idx[t] = [round(pos / SR, 3), round(len(s) / SR, 3)]
    parts += [s, GAP]
    pos += len(s) + len(GAP)
    if i % 100 == 0:
        print(lv, i, len(texts), file=sys.stderr)
sf.write(f"{texts_dir}/{lv}.wav", np.concatenate(parts), SR)
subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-i", f"{texts_dir}/{lv}.wav", "-ac", "1",
                "-c:a", "libmp3lame", "-b:a", "40k", f"{out}/{lv}.mp3"], check=True)
json.dump(idx, open(f"{out}/{lv}.json", "w"), ensure_ascii=False, separators=(',', ':'))
