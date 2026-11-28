from PIL import Image, ImageSequence
import numpy as np
from collections import deque
def frames(f):return [np.array(x.copy().convert('RGB')).astype(int) for x in ImageSequence.Iterator(Image.open(f))]
def er(m,n=1):
  for _ in range(n):m=m&np.roll(m,1,0)&np.roll(m,-1,0)&np.roll(m,1,1)&np.roll(m,-1,1)
  return m
def di(m,n=1):
  for _ in range(n):m=m|np.roll(m,1,0)|np.roll(m,-1,0)|np.roll(m,1,1)|np.roll(m,-1,1)
  return m
def comps(fg,x0,x1):
  H=fg.shape[0];seen=np.zeros_like(fg);out=[]
  for y in range(H):
    for x in range(x0,x1):
      if fg[y,x] and not seen[y,x]:
        q=deque([(y,x)]);seen[y,x]=True;p=[]
        while q:
          cy,cx=q.popleft();p.append((cy,cx))
          for dy,dx in((1,0),(-1,0),(0,1),(0,-1)):
            yy,xx=cy+dy,cx+dx
            if 0<=yy<H and x0<=xx<x1 and fg[yy,xx] and not seen[yy,xx]:seen[yy,xx]=True;q.append((yy,xx))
        out.append(p)
  return out
def seg(a,box,thr=60,legs=False,holes=False):
  H,W,_=a.shape;x0,x1=box
  side=np.concatenate([a[:,max(0,x0-120):x0],a[:,x1:x1+120]],1)
  med=np.median(side,1);sd=np.sqrt(((side-med[:,None])**2).sum(2)).mean(1)
  r,g,b=a[...,0],a[...,1],a[...,2];mr,mg,mb=med[:,0][:,None],med[:,1][:,None],med[:,2][:,None]
  # 色あい（r-g, g-b）の ちがいを 重く
  d=np.sqrt((r-mr)**2+(g-mg)**2+(b-mb)**2+2.5*(((r-g)-(mr-mg))**2+((g-b)-(mg-mb))**2))
  lum=r*.3+g*.59+b*.11
  ok=(d<thr+sd[:,None]*1.5)&(lum>95)          # 背景として 通れる
  bgm=np.zeros((H,W),bool);q=deque()
  for y in range(H):
    for x in (x0,x1-1):
      if ok[y,x]:bgm[y,x]=True;q.append((y,x))
  for x in range(x0,x1):
    for y in (0,H-1):
      if ok[y,x] and not bgm[y,x]:bgm[y,x]=True;q.append((y,x))
  while q:
    cy,cx=q.popleft()
    for dy,dx in((1,0),(-1,0),(0,1),(0,-1)):
      yy,xx=cy+dy,cx+dx
      if 0<=yy<H and x0<=xx<x1 and ok[yy,xx] and not bgm[yy,xx]:bgm[yy,xx]=True;q.append((yy,xx))
  fg=~bgm;fg[:, :x0]=False;fg[:,x1:]=False
  # 足の あいだなど とじこめられた 背景も ぬく
  inner=ok&fg&(legs or holes);inner[:int(H*0.62)]=False
  for c in comps(inner,x0,x1):
    if len(c)>30:
      for q in c:fg[q]=False
  core=er(fg,1);cs=comps(core,x0,x1);best=max(len(c) for c in cs)
  m=np.zeros_like(fg)
  for c in cs:
    if len(c)>best*0.03:
      for q in c:m[q]=True
  m=di(m,1)&fg
  if legs:
    foam=(lum>165)&((b>r+5)|((np.abs(r-b)<25)&(lum>200)));foam[:int(H*0.6)]=False
    m&=~foam
    lo=int(H*0.45);v=m[lo:]&np.roll(m,1,0)[lo:]&np.roll(m,-1,0)[lo:]
    v=v|np.roll(v,1,0)|np.roll(v,-1,0);m[lo:]&=v
    cs=comps(m,x0,x1);big=max(len(c) for c in cs);m2=np.zeros_like(m)
    for c in cs:
      if len(c)>big*0.03:
        for q in c:m2[q]=True
    m=m2
  return m


def hdist(a, B):
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    R, G, Bb = B[..., 0], B[..., 1], B[..., 2]
    return np.sqrt((r - R) ** 2 + (g - G) ** 2 + (b - Bb) ** 2 + 2.5 * (((r - g) - (R - G)) ** 2 + ((g - b) - (G - Bb)) ** 2))


def fillholes(m, x0, x1, mx=40):
    """とじこめられた 小さい 穴（スカートの すき間 など）を うめる"""
    h = ~m; h[:, :x0] = False; h[:, x1:] = False
    H = m.shape[0]
    for c in comps(h, x0, x1):
        if len(c) <= mx and all(0 < y < H - 1 and x0 < x < x1 - 1 for y, x in c):
            for q in c: m[q] = True
    return m


def tmask(a, B, box, thr=60, sea=False):
    """上半分は 行ごとの 背景（seg）、 腰から 下は 全コマの 中央値 B との ちがいで ぬく"""
    H, W, _ = a.shape; x0, x1 = box
    up = seg(a, box, thr=thr, legs=False)
    side = np.concatenate([a[:, max(0, x0 - 120):x0], a[:, x1:x1 + 120]], 1)
    rowm = np.broadcast_to(np.median(side, 1)[:, None, :], a.shape)
    d = hdist(a, B)
    dr = hdist(a, rowm)
    lo = (d > thr * 0.6) & (dr > thr * 0.25); lo[:, :x0] = False; lo[:, x1:] = False
    # 波の 白い すじ（よこに 細い 線）を けす: たてに 3ドット ない ものは ぬく
    v = lo & np.roll(lo, 1, 0) & np.roll(lo, -1, 0); lo = v | np.roll(v, 1, 0) | np.roll(v, -1, 0)
    covered = hdist(B, rowm) > thr          # どの コマでも キャラが いる 所（スカートの まん中 など）
    ys = np.where((up | lo).any(1))[0]
    top, bot = ys[0], ys[-1]
    cut = top + int((bot - top) * 0.55)
    m = up.copy()
    m[cut:] = lo[cut:] | (up[cut:] & ((d[cut:] > thr * 0.3) | covered[cut:]))
    h = bot - top
    # スカートより 下の 青っぽい・白い 点（波の あわ・海）は ぬく（はだ・サンダル・りんかくは 赤みが 強い）
    hem = top + int(h * 0.71)
    r, b = a[..., 0], a[..., 2]
    if sea:   # 海の 背景の とき だけ（青い 服・白い くつしたも 消える ので ふだんは しない）
        m[hem:] &= ~(b[hem:] > r[hem:] - 12)
        mx, mn = a.max(2), a.min(2); lum = a @ np.array([.3, .59, .11])
        m[hem:] &= ~((mx[hem:] - mn[hem:] < 28) & (lum[hem:] > 165))   # 白い あわ
        # よこに 細長い すじ（たてに 6ドット ない もの）は 波
        lo2 = cut - 10; k = m[lo2:].copy(); v = k.copy()
        for sh in range(1, 6): v &= np.roll(k, sh, 0)
        o = v.copy()
        for sh in range(1, 6): o |= np.roll(v, -sh, 0)
        m[lo2:] = k & o
        g = a[..., 1]
        m[cut:] &= ~((b[cut:] > r[cut:] + 25) & (b[cut:] > g[cut:]))      # はっきり 青い 所（海）
    # はしっこの 1ドットの かけらを けずって 小さい かたまりを すてる
    k = m[cut:]; n = k.astype(int)
    nb = np.roll(n, 1, 0) + np.roll(n, -1, 0) + np.roll(n, 1, 1) + np.roll(n, -1, 1)
    m[cut:] = k & (nb >= 2)
    # 足の 下の 砂の かげ: いちばん 下の 6% で 砂の 色に 近い 所は ぬく
    ft = top + int(h * 0.94)
    m[ft:] &= ~(dr[ft:] < thr * 0.8)
    cs = comps(m, x0, x1); big = max(len(c) for c in cs)
    m2 = np.zeros_like(m)
    for c in cs:
        if len(c) > big * 0.03 or (len(c) > 60 and min(y for y, x in c) < cut):
            for q in c: m2[q] = True
    return fillholes(m2, x0, x1)
