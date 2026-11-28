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
def seg(a,box,thr=60,legs=False):
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
  inner=ok&fg&legs;inner[:int(H*0.62)]=False
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
