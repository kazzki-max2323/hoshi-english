#!/usr/bin/env python3
"""Gemini などで 作った ミオの GIF を、 ゲームで 使える コマ（横ならびの PNG＋JSON）に する。

つかいかた（くわしくは tools/mio_gif/README.md）:
  python3 tools/mio_gif/mio_gif.py <GIF> <服>_<髪> --split stand:0-2,blink:3-4,wave:6-26
  python3 tools/mio_gif/mio_gif.py <GIF> <服>_<髪> --split walk:0-29 --face right

やること:
  1. 背景を ぬく（行ごとの 背景の 色を はかって、 外がわから 塗りつぶし。 黒い 線で 止まる）
  2. コマを とりだす（--split で 動きごとに わける）
  3. 大きさを そろえる（立った 高さが --height ドット。 ゲームの 1マス＝4ドット）
  4. 足もとと 体の まん中を そろえる（ちょっとの ずれは 中央値で なくす）
  5. 色を へらした 横ならび PNG と、 足の 位置・コマの 時間の JSON を 書く
  6. assets/mio/index.json に その 見た目と 動きを のせる
"""
import sys, os, re, json, argparse
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import numpy as np
from PIL import Image, ImageSequence
from seg import seg, comps, tmask

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
OUT = os.path.join(ROOT, 'assets', 'mio')
ID = re.compile(r'^[a-z0-9]+_[a-z0-9]+$')
MOTIONS = ('stand', 'blink', 'wave', 'walk', 'cheer', 'sweep', 'doze', 'hold', 'shy', 'oops')


def load(f, key=False):
    if f.lower().endswith(('.mp4', '.mov', '.webm')):   # 動画（Dreamina など）は 10コマ/秒・640x360 の GIF に してから
        import subprocess, tempfile
        g = os.path.join(tempfile.mkdtemp(), 'v.gif')
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', f, '-vf', 'fps=10,scale=640:360', g], check=True)
        f = g
    im = Image.open(f)
    fr, ms = [], []
    for x in ImageSequence.Iterator(im):
        a = np.array(x.copy().convert('RGB')).astype(int)
        if key:   # 動画の 背景は ざらざらの 緑 → 緑っぽい 所を 1色に そろえる
            r, g, b = a[..., 0], a[..., 1], a[..., 2]
            a[(g > r + 18) & (g > b + 10) & (g > 170)] = (200, 235, 200)
        fr.append(a)
        ms.append(x.info.get('duration', 100) or 100)
    return fr, int(np.median(ms))


def autobox(F, pad=28):
    """キャラの いる 横の はんい。 左右の はしの 色を 背景と みなして、 ちがう 列を さがす"""
    H, W, _ = F[0].shape
    cnt = np.zeros(W); col = np.zeros(W, bool)
    for a in F[::max(1, len(F) // 6)]:
        side = np.concatenate([a[:, :40], a[:, -40:]], 1)
        med = np.median(side, 1)
        d = np.sqrt(((a - med[:, None]) ** 2).sum(2))
        c1 = (d > 70).sum(0); cnt += c1; col |= c1 > H * 0.04
    xs = np.where(col)[0]
    xs = xs[(xs > 40) & (xs < W - 40)]
    if not len(xs):
        sys.exit('キャラが 見つからない。 --box で 横の はんいを 指定してね')
    # いちばん 長い つながりを キャラと する
    runs, s = [], xs[0]
    for p, q in zip(xs, xs[1:]):
        if q - p > 12:
            runs.append((s, p)); s = q
    runs.append((s, xs[-1]))
    s, e = max(runs, key=lambda r: cnt[r[0]:r[1] + 1].sum())   # いちばん 中身の 多い かたまり
    return max(130, s - pad), min(W - 130, e + pad)


def cut(a, m):
    o = np.zeros(a.shape[:2] + (4,), np.uint8)
    o[..., :3] = a; o[..., 3] = m * 255
    return o


def scale(o, sc):
    """色が にじまない ように（アルファを かけてから 縮めて、 半とうめいは なくす）"""
    H, W = o.shape[:2]
    a = o.astype(float); a[..., :3] *= a[..., 3:4] / 255
    r = np.array(Image.fromarray(a.astype(np.uint8)).resize((max(1, round(W * sc)), max(1, round(H * sc))), Image.LANCZOS)).astype(float)
    al = r[..., 3]
    rgb = np.where(al[..., None] > 0, r[..., :3] * 255 / np.maximum(al[..., None], 1), 0).clip(0, 255)
    out = np.zeros(r.shape, np.uint8); out[..., :3] = rgb; out[..., 3] = np.where(al >= 110, 255, 0)
    return out


def anchor(o):
    """足の 裏（いちばん 下の 行）と 体の まん中（こしの あたりの 横の まん中）"""
    al = o[..., 3] > 0
    ys = np.where(al.any(1))[0]
    top, bot = ys[0], ys[-1]
    h = bot - top
    band = al[top + int(h * .58): top + int(h * .72)]
    xs = np.where(band)[1]
    cx = float(np.median(xs)) if len(xs) else al.shape[1] / 2
    return cx, bot, top


def rng(s):
    a, b = (s.split('-') + [s])[:2]
    return list(range(int(a), int(b) + 1))


def main():
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument('gif')
    p.add_argument('look', help='<服>_<髪>（小文字と 数字だけ。 例: tankdenim_longwave）')
    p.add_argument('--split', default='', help='動き:はじめ-おわり,... （例 stand:0-2,blink:3-4,wave:6-26）。 なしなら 全コマ stand')
    p.add_argument('--face', default='front', choices=['front', 'right', 'left'], help='向き（歩きは right か left。 ゲームが 反対向きは 左右反転する）')
    p.add_argument('--height', type=int, default=192, help='立った 高さ（ドット）。 ゲームの 1マス=4ドット で 48マス')
    p.add_argument('--ms', type=int, default=0, help='1コマの 時間（ミリ秒）。 0なら GIF の まま')
    p.add_argument('--box', default='', help='キャラの いる 横の はんい x0,x1（自動で だめな とき）')
    p.add_argument('--thr', type=int, default=60, help='背景と みなす 色の ちがい（ぬけすぎ→小さく・のこる→大きく）')
    p.add_argument('--bg', default='auto', choices=['auto', 'row', 'time'], help='背景の はかり方（auto: 歩きは time＝全コマの 中央値・ほかは row＝行ごと）')
    p.add_argument('--sea', action='store_true', help='背景に 海が ある とき。 足もとの 青い 波・白い あわを けす（青い 服の ときは 使わない）')
    p.add_argument('--key', action='store_true', help='背景の 緑が ざらざらの とき（動画）。 緑っぽい 所を 1色に して から ぬく')
    p.add_argument('--holes', action='store_true', help='正面でも 足の あいだに のこった 背景を ぬく（白い 服でも 使える）')
    p.add_argument('--base', action='store_true', help='この 見た目を いつもの ミオ（index.json の base）に する')
    p.add_argument('--align-y', default='ground', choices=['ground', 'frame'], help='たての そろえ方（ground: GIF の 地面の まま・ジャンプも 出る／frame: コマごとに 足の 裏を 下に）')
    p.add_argument('--name', default='', help='見た目の 日本語名（index.json 用）')
    p.add_argument('--format', default='png', choices=['png', 'webp'], help='png（色を へらす・いちばん かるい）か webp（色そのまま・3倍 重い）')
    p.add_argument('--pix', default='', help='服の 名前・ひとことに 使う game/mio-pix.js の 服の id（例 tank）')
    p.add_argument('--colors', type=int, default=96, help='PNG の 色の 数')
    p.add_argument('--preview', action='store_true', help='見本の PNG も 書く（_preview.png）')
    A = p.parse_args()
    if not ID.match(A.look):
        sys.exit('見た目の 名前は <服>_<髪>（小文字と 数字、 _ は 1つ）。 例: tankdenim_longwave')
    F, ms = load(A.gif, A.key)
    ms = A.ms or ms
    parts = []
    for s in (A.split.split(',') if A.split else ['stand:0-%d' % (len(F) - 1)]):
        k, r = s.split(':')
        if k not in MOTIONS:
            sys.exit(f'動きの 名前は {", ".join(MOTIONS)} から')
        idx = [i for i in rng(r) if i < len(F)]
        parts.append((k, idx))
    box = tuple(map(int, A.box.split(','))) if A.box else autobox(F)
    walk = A.face != 'front'
    print(f'{len(F)}コマ {ms}ms  はんい x={box}')
    used = sorted({i for _, ix in parts for i in ix})
    if A.bg == 'time' or (A.bg == 'auto' and walk):
        # 歩きは コマで 背景が 見えたり かくれたり する ので、 全コマの 中央値を 背景に して 下半分を ぬく
        B = np.median(np.stack(F), 0)
        cuts = {i: cut(F[i], tmask(F[i], B, box, thr=A.thr, sea=A.sea)) for i in used}
    else:
        cuts = {i: cut(F[i], seg(F[i], box, thr=A.thr, legs=walk, holes=A.holes)) for i in used}
    # 大きさ: 立った 高さの 中央値を --height に
    hs = [anchor(cuts[i])[1] - anchor(cuts[i])[2] + 1 for i in used]
    sc = A.height / float(np.median(hs))
    print(f'高さ {int(np.median(hs))} → {A.height}（x{sc:.3f}）')
    small = {i: scale(cuts[i], sc) for i in used}
    d = os.path.join(OUT, A.look)
    os.makedirs(d, exist_ok=True)
    made = []
    for k, ix in parts:
        an = [anchor(small[i]) for i in ix]
        cx = [a[0] for a in an]; by = [a[1] for a in an]
        # ちょっとの ずれ（手ぶれ）は 中央値で そろえる・ 大きく 動く ときだけ コマごと
        if max(cx) - min(cx) < 6: cx = [float(np.median(cx))] * len(ix)
        # たては カメラ 固定 なので 地面の 高さ（足の 中央値）で そろえる（ジャンプが 消えない ように）
        if A.align_y == 'ground' or max(by) - min(by) < 6: by = [int(np.median(by))] * len(ix)
        # 体の まん中を そろえて 置いてから、 ぜんぶの コマで あいている はしを けずる
        L = max(int(np.ceil(c)) + 2 for c in cx)
        R = max(small[i].shape[1] - int(c) + 2 for i, c in zip(ix, cx))
        tp = [a[2] for a in an]
        fy = max(A.height + 6, max(int(b) - int(t) for b, t in zip(by, tp)) + 2)   # ジャンプで 頭が 切れない 高さ
        W0, H = L + R, fy + 2
        sheet = Image.new('RGBA', (W0 * len(ix), H), (0, 0, 0, 0))
        for n, (i, c, b) in enumerate(zip(ix, cx, by)):
            im = Image.fromarray(small[i])
            sheet.paste(im, (n * W0 + L - int(round(c)), fy - int(b)), im)
        al = np.array(sheet)[..., 3].reshape(H, len(ix), W0).any(0).any(0)
        xs = np.where(al)[0]; x0, x1 = max(0, xs[0] - 1), min(W0, xs[-1] + 2)
        W = x1 - x0
        sh2 = Image.new('RGBA', (W * len(ix), H), (0, 0, 0, 0))
        for n in range(len(ix)):
            sh2.paste(sheet.crop((n * W0 + x0, 0, n * W0 + x1, H)), (n * W, 0))
        sheet, half = sh2, L - x0
        fmt = A.format
        name = k + '.' + fmt
        if fmt == 'webp':
            sheet.save(os.path.join(d, name), 'WEBP', lossless=True, quality=100, method=6)
        else:
            q = sheet.quantize(colors=A.colors, method=Image.Quantize.FASTOCTREE, dither=Image.Dither.NONE)
            q.save(os.path.join(d, name), optimize=True)
        meta = {'n': len(ix), 'w': int(W), 'h': int(H), 'fx': int(half), 'fy': int(fy), 'ms': ms, 'face': A.face, 'img': name, 'src': os.path.basename(A.gif), 'frames': ix}
        json.dump(meta, open(os.path.join(d, k + '.json'), 'w'), ensure_ascii=False)
        kb = os.path.getsize(os.path.join(d, name)) / 1024
        print(f'  {A.look}/{name}  {len(ix)}コマ {W}x{H}  {kb:.0f}KB')
        made.append(k)
        if A.preview:   # 見本は GIF の よこに（assets には 入れない）
            bg = Image.new('RGBA', sheet.size, (196, 226, 196, 255)); bg.alpha_composite(sheet)
            px = bg.load()
            for n in range(len(ix)):
                for y in range(0, H, 4): px[n * W + half, y] = (255, 0, 0, 255)
                for x in range(W): px[n * W + x, fy] = (255, 0, 0, 255)
            bg.save(os.path.splitext(A.gif)[0] + '_' + A.look + '_' + k + '_preview.png')
    # 見た目の 一覧
    ip = os.path.join(OUT, 'index.json')
    ind = json.load(open(ip)) if os.path.exists(ip) else {'looks': {}}
    L = ind['looks'].setdefault(A.look, {'name': A.name or A.look, 'motions': []})
    if A.name: L['name'] = A.name
    if A.pix: L['pix'] = A.pix
    if A.base: ind['base'] = A.look
    L['motions'] = sorted(set(L['motions']) | set(made), key=MOTIONS.index)
    json.dump(ind, open(ip, 'w'), ensure_ascii=False, indent=1)
    print('index.json:', A.look, L['motions'])


if __name__ == '__main__':
    main()
