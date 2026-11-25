/* ミオの 新しい ドット絵（40x96 の 絵を お店の 中では 20x48 の 大きさで 出す。 2倍の キャンバスで くっきり）
   MIOPX.draw(ctx,x,y,pose,frame,opt): x,y は 前の 14x32 の 左上と 同じ 場所（足もと = x+7, y+32）。 pose = stand / walk / wave / cheer / sweep / doze
     opt.night: 夜の 部屋着、 opt.dy: 下へ ずらす（2階の つくえ など）
   MIOPX.look(night): きょうの 服・髪型（日替わり。 夏は 夏服も、 夜は 部屋着）→ {id,n,en,ja,acc,hair,o}
   絵の 作り: 多角形を ドットに して 3段の かげ＋となりの 色を 暗くした ふちどり。 顔は ミナ先生と おなじ まる顔・きらきら目
   下着姿・見えた系の 絵は 作らない（ミオは 20さいの 大人。 絵が 幼く 見えるので） */
(()=>{
const W=40,H=96;
const pip=(pts)=>(x,y)=>{let c=false;for(let i=0,j=pts.length-1;i<pts.length;j=i++){const[xi,yi]=pts[i],[xj,yj]=pts[j];if(((yi>y)!=(yj>y))&&(x<(xj-xi)*(y-yi)/(yj-yi)+xi))c=!c}return c};
const ell=(cx,cy,rx,ry)=>(x,y)=>((x-cx)/rx)**2+((y-cy)/ry)**2<=1;
const or=(...f)=>(x,y)=>f.some(g=>g(x,y));
const and=(a,b)=>(x,y)=>a(x,y)&&b(x,y);
const not=(a)=>(x,y)=>!a(x,y);
const mir=(pts)=>pts.map(([x,y])=>[40-x,y]);
// 色: [ハイライト, 基本, かげ, こいかげ]
const C={
 skirt:['#d88c6c','#b8664a','#984e38','#783a28'],sock:['#ffffff','#f4f0ea','#dcd4c8','#c0b6a8'],
 skin:['#fff0e4','#ffdcc6','#f0b89e','#d8967e'],
 hair:['#d49a64','#a8663a','#84492a','#5e301c'],
 shirt:['#ffffff','#fbf3e2','#e2d4b8','#c4b294'],
 apron:['#6f9ad0','#4a78b0','#355d8f','#26466e'],
 pants:['#9a7658','#7a5a42','#5e4432','#46301f'],
 shoe:['#7a5236','#5a3a22','#44291a','#2e1a10'],
 band:['#ffe27a','#ffc93c','#e0a420','#b87e10'],
 straw:['#fbe8b0','#ecc878','#c89a48','#9a7230'],red:['#ff8a8a','#e85a5a','#c03a3a','#902a2a'],
 pink:['#ffc4d4','#f497b4','#d4708e','#a8506a'],navy:['#5a6a9a','#3a4a7a','#2a365e','#1c2444'],tee:['#ffffff','#f6f6f2','#dadad4','#bcbcb4'],mint:['#c8f4e4','#98e0c8','#6ec0a8','#4a9a84'],sky:['#d4ecff','#a8d4f4','#7cb0dc','#5a8cbc'],lav:['#f6f0ff','#e6dcf8','#c8b8e4','#a898c8'],coral:['#ffb8a0','#f88a6a','#d86a4c','#a84a34'],denim:['#7aa0d0','#5a80b8','#40649a','#2c4a78'],cream:['#fffaf0','#f8eedc','#e4d4b8','#c4b090'],black:['#5a5462','#3a3442','#2a2432','#1a1622'],gray:['#c8c8d0','#a8a8b4','#8a8a98','#6a6a78'],pinkS:['#ffd4e0','#ffaac4','#e088a4','#b86884'],
 towel:['#ffffff','#f6f2f4','#ddd4dc','#bdb0bc'],pj:['#e0f0ff','#b8daf6','#8cb8e0','#6a94c0'],pjp:['#ffe4ee','#ffc8da','#e8a0b8','#c07a94'],plaid:['#e88a7a','#c8584a','#a04236','#7a3028'],olive:['#b8b878','#94945a','#747444','#565632'],
 sand:['#f0d0a0','#d8a870','#b88850','#8e6634'],sun:['#fff0a0','#ffd84a','#e8b020','#b88410'],red2:['#ff9a8a','#ff6a5a','#d84a3a','#a8342a'],
 night:['#5a6aa8','#3a4880','#2a3562','#1c2446'],knit:['#fff4ea','#f2e2d0','#d8c2a8','#b49a7e'],
 wood:['#d8a868','#b07a3a','#8a5a28','#6a421c'],
 cuff:['#6f9ad0','#4a78b0','#355d8f','#26466e'],
};
function build(opt){const AP=opt.arm||'down',stp=opt.step|0;const R=[];const add=(n,f,c,o={})=>R.push(Object.assign({n,f,c},o));
const HS=opt.hair||'bob';
const BOB=pip([[8,17],[32,17],[32.4,29],[30.5,32],[27,31],[13,31],[9.5,32],[7.6,29]]);
const HB={bob:BOB,
 flip:pip([[8,17],[32,17],[32.6,27],[35.4,30.6],[31.6,31.8],[27,30],[13,30],[8.4,31.8],[4.6,30.6],[7.4,27]]),
 inner:pip([[8,17],[32,17],[32.2,28],[30,31.8],[26.6,31],[13.4,31],[10,31.8],[7.8,28]]),
 twin:pip([[8,17],[32,17],[31.6,24],[8.4,24]]),
 wavy:or(BOB,ell(7.6,21,1.6,2.2),ell(7.2,26.6,1.8,2.4),ell(32.4,21,1.6,2.2),ell(32.8,26.6,1.8,2.4),ell(10.6,31.4,2.2,1.6),ell(29.4,31.4,2.2,1.6))}[HS]||BOB;
const extra=[];
if(HS==='halfup')extra.push(ell(20,4.2,3.4,2.8));
if(HS==='buns')extra.push(ell(10.6,6.4,3.6,3.4),ell(29.4,6.4,3.6,3.4));
if(HS==='twin')extra.push(pip([[9,18],[5.4,21],[3.4,27],[5,32.6],[7.6,27.6],[9.6,22]]),pip(mir([[9,18],[5.4,21],[3.4,27],[5,32.6],[7.6,27.6],[9.6,22]])));
if(HS==='side')extra.push(pip([[29,14],[33,22],[33.8,30],[31.4,33],[30,27]]));
add('hairB',or(ell(20,17,12,12.5),HB,...extra),C.hair);
add('neck',pip([[18,28],[22,28],[22.3,33.5],[17.7,33.5]]),C.skin);
const O=Object.assign({top:'shirt',sl:'long',apron:'apron',sk:'skirt',hem:69.5,socks:1,shoe:'shoe',cuff:'cuff',neck:'v'},opt.o||{});
const T=C[O.top];const hem=O.hem;
const LG=[[14.6,hem-1.5],[19.3,hem-1.5],[19,80],[18.5,89],[15.6,89],[15,80]];
const LGu=LG.map(([x,y])=>[x,y>80?y-1.6:y]);add('legL',pip(stp===1?LGu:LG),C.skin);add('legR',pip(mir(stp===2?LGu:LG)),C.skin);
if(O.socks){const SK=[[15.3,85],[18.7,85],[18.6,89.5],[15.5,89.5]];const up=(p,k)=>p.map(([x,y])=>[x,y-(k?1.6:0)]);add('sockL',pip(up(SK,stp===1)),C.sock);add('sockR',pip(mir(up(SK,stp===2))),C.sock);}
const SH=O.shoe==='slip'?[[14.6,90],[19.2,90],[19.4,94.5],[13,95],[13.2,92]]:[[14.8,89],[19,89],[19.2,94.5],[12.6,95],[13,92]];
const upS=(p,k)=>p.map(([x,y])=>[x,y-(k?1.6:0)]);add('shoeL',pip(upS(SH,stp===1)),O.shoe==='slip'?C.pinkS:C[O.shoe]);add('shoeR',pip(mir(upS(SH,stp===2))),O.shoe==='slip'?C.pinkS:C[O.shoe]);
const STY=O.style;
if(STY&&STY!=='long')add('shoulder',pip([[12.6,32.6],[27.4,32.6],[28.4,38],[28,52],[12,52],[11.6,38]]),C.skin);
const STP={cami:[[13.2,35.6],[26.8,35.6],[27.6,38],[27,50],[13,50],[12.4,38]],
 crop:[[13.8,32.5],[26.2,32.5],[28,35],[27.6,43.6],[12.4,43.6],[12,35]],
 swim:[[13.6,35.4],[26.4,35.4],[27.4,38],[27,50],[26.2,52.4],[22,54.6],[18,54.6],[13.8,52.4],[13,50],[12.6,38]],
 bikini:[[13.2,36.4],[26.8,36.4],[27.4,38],[26.8,40.4],[13.2,40.4],[12.6,38]],
 long:[[13.8,32.5],[26.2,32.5],[28,35],[27.6,50],[28.6,60.4],[11.4,60.4],[12.4,50],[12,35]],
 offknit:[[11.6,35.4],[28.4,35.4],[28.6,44],[28.8,58.4],[11.2,58.4],[11.4,44]],
 halter:[[13.6,35.6],[26.4,35.6],[27.4,38],[27,50],[13,50],[12.6,38]]};
if(O.towel)add('shoulder',pip([[12.6,32.6],[27.4,32.6],[28.4,38],[11.6,38]]),C.skin);
if(O.sl==='off')add('shoulder',pip([[12.6,32.6],[27.4,32.6],[28.4,36.5],[11.6,36.5]]),C.skin);
add('torso',pip(STY?STP[STY]:O.towel?[[11.8,36.2],[28.2,36.2],[28.6,44],[28.8,63],[11.2,63],[11.4,44]]:O.sl==='off'?[[11.8,35.6],[28.2,35.6],[28,38],[27,50],[13,50],[12,38]]:O.sl==='none'?[[14.6,32.5],[25.4,32.5],[27.4,35],[27,50],[13,50],[12.6,35]]:opt.bust?[[13.8,32.5],[26.2,32.5],[28,35],[28.5,38.6],[27.6,42],[26.7,46],[27,50],[13,50],[13.3,46],[12.4,42],[11.5,38.6],[12,35]]:[[13.8,32.5],[26.2,32.5],[28,35],[27,50],[13,50],[12,35]]),T);
if(O.shorts)add('skirt',pip([[13.2,48],[26.8,48],[27.8,59],[20.6,59.6],[20,55],[19.4,59.6],[12.2,59]]),C[O.sk]);
else if(O.pants){const PL=[[13,47.5],[20.2,47.5],[19.8,88],[14.8,88],[14.2,70]];add('skirt',or(pip(PL),pip(mir(PL)),pip([[13,47.5],[27,47.5],[27,52],[13,52]])),C[O.sk]);}
else if(O.noSk){}
else if(STY==='bikini'){add('skirt',pip([[13,48],[27,48],[26.6,51.6],[22,54],[18,54],[13.4,51.6]]),C[O.sk]);if(O.pareo)add('pareo',pip([[14.6,49.6],[27.2,47.8],[29.8,61.4],[22,63.6],[16.6,58],[14,53]]),C[O.pareo]);}
else{const f={pleat:.13,check:.13,flare:.3,tight:.015,tier:.2,maxi:.12,button:.08,wrap:.15}[O.skt||'pleat'];
 let pts=[[13.2,48],[26.8,48],[27.6+(hem-48)*f,hem],[12.4-(hem-48)*f,hem]];
 if(O.skt==='flare'){const L0=12.4-(hem-48)*f,R0=27.6+(hem-48)*f;pts=[[13.2,48],[26.8,48],[R0,hem-1]];for(let i=6;i>=0;i--){const x=L0+(R0-L0)*i/6;pts.push([x,i%2?hem-1.2:hem+.4])}pts.push([L0,hem-1])}
 if(O.skt==='tier'){pts=[[13.2,48],[26.8,48],[27.8,55],[29,55.2],[29.6,61],[31,61.2],[31.6,hem],[8.4,hem],[9,61.2],[10.4,61],[11,55.2],[12.2,55]]}
 if(O.skt==='wrap'){pts=[[13.2,48],[26.8,48],[27.6+(hem-48)*f,hem-2.5],[12.4-(hem-48)*f,hem+.4]]}
 add('skirt',pip(pts),C[O.sk]);}
if(O.apron){const ST=[[15.4,37.5],[16.8,37.5],[16.2,32.5],[14.8,32.5]];
add('apron',or(pip([[15.6,37],[24.4,37],[24.6,46],[27,48.5],[27.8,Math.min(60,hem-4)],[12.2,Math.min(60,hem-4)],[13,48.5],[15.4,46]]),pip(ST),pip(mir(ST))),C[O.apron]);}
if(O.belt)add('belt',pip([[12.4,46],[27.6,46],[27.6,48.4],[12.4,48.4]]),C[O.belt]);if(O.robe)add('knotR',pip([[23,47],[26,48],[25.4,55],[23.6,54]]),C[O.belt]);
const AR=[[11.6,33.4],[14.2,34.4],[14,43],[14.7,55],[11.7,55],[10.2,45],[10.4,37]];

/* うでの 形: かた→ひじ→手 の 線に はばを つける */
const chain=(pts,w)=>{const Lf=[],Rt=[];pts.forEach((p,i)=>{const a=pts[Math.max(0,i-1)],b=pts[Math.min(pts.length-1,i+1)];let dx=b[0]-a[0],dy=b[1]-a[1];const d=Math.hypot(dx,dy)||1;const nx=-dy/d*w/2,ny=dx/d*w/2;Lf.push([p[0]+nx,p[1]+ny]);Rt.push([p[0]-nx,p[1]-ny])});return pip(Lf.concat(Rt.reverse()))};
const lerp=(a,b,t)=>[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t];
const ARMP={wave:[[26.6,34.8],[32,30.4],[33.4,22.6]],cheerL:[[13.4,34.8],[8,30.4],[6.6,22.6]],
 sweepR:[[26.6,34.8],[26,44],[19.8,52]],sweepL:[[13.4,34.8],[12.4,41.4],[16.8,45]]};
const bent=(n,P3)=>{const sl=O.sl,col=sl==='long'?T:C.skin;add(n,chain(P3,3.2),col);
  if(sl==='short'||sl==='off')add(n+'s',chain([P3[0],lerp(P3[0],P3[1],.55)],3.9),T);
  if(sl==='long')add(n+'c',chain([lerp(P3[1],P3[2],.72),lerp(P3[1],P3[2],.9)],3.6),C[O.cuff]);
  add(n+'h',ell(P3[2][0]+(P3[2][0]>20?.2:-.2),P3[2][1]-(P3[2][1]<30?1:0),1.9,2.2),C.skin)};
const dn=(side)=>{const sh=stp&&((stp===1)===(side==='L'))?-1:stp?1:0,A=AR.map(([x,y])=>[x,y>44?y+sh:y]),poly=side==='L'?A:mir(A);
  if(O.sl==='long'){add('arm'+side,pip(poly),T);const CF=[[10.8,52.5+sh],[14.6,52.5+sh],[14.8,55.3+sh],[11.5,55.3+sh]];add('cuff'+side,pip(side==='L'?CF:mir(CF)),C[O.cuff])}
  else{add('arm'+side,pip(poly),C.skin);if(O.sl==='short'||O.sl==='off'){const y0=O.sl==='off'?35.4:33.2,SL=[[11.2,y0],[14.6,y0+.6],[14.6,40.4],[10,41],[9.8,37]];add('sl'+side,pip(side==='L'?SL:mir(SL)),T)}}
  add('hand'+side,side==='L'?ell(13.2,57.4+sh,1.9,2.4):ell(26.8,57.4+sh,1.9,2.4),C.skin)};
if(AP==='sweep'){add('broom',chain([[13.6,35],[29.4,84]],1.5),C.wood);add('brush',pip([[26.6,82],[31.6,81],[36.4,95],[25.4,95.4]]),C.straw);bent('armR',ARMP.sweepR);bent('armL',ARMP.sweepL);}
else{ if(AP==='cheer')bent('armL',ARMP.cheerL);else dn('L');
  if(AP==='wave'||AP==='cheer')bent('armR',ARMP.wave);else dn('R');}

add('ear',or(ell(10.4,21.5,1.5,2.1),ell(29.6,21.5,1.5,2.1)),C.skin);
add('face',or(ell(20,19.4,9.3,8.8),pip([[11.2,21],[28.8,21],[26.4,26.8],[22.4,29.6],[17.6,29.6],[13.6,26.8]])),C.skin,{noHi:1});
const LKS={bob:[[8.8,13],[12.6,13],[12.8,22],[12.2,27.5],[11.2,31.6],[8.4,29.4]],
 flip:[[8.8,13],[12.6,13],[12.8,22],[12,27],[9.4,30.4],[6,30.6],[8.2,28]],
 inner:[[8.8,13],[12.6,13],[12.8,22],[13.2,28],[13.8,31.2],[10.4,31.8],[8.6,28.6]],
 twin:[[8.8,13],[12.6,13],[12.8,20],[12.2,24],[9.4,24]]};
const LK=LKS[HS]||LKS.bob;
add('lockL',pip(LK),C.hair);if(HS!=='tuck')add('lockR',pip(mir(LK)),C.hair);
const BG={center:or(pip([[10.2,15],[11.5,9.5],[15,6],[19.6,5],[20.2,7],[18.4,9.2],[15.6,12.2],[13.2,16.4],[11.4,17.4]]),pip(mir([[10.2,15],[11.5,9.5],[15,6],[19.6,5],[20.2,7],[18.4,9.2],[15.6,12.2],[13.2,16.4],[11.4,17.4]])),pip([[15,6],[25,6],[22,7.6],[18,7.6]])),
 side:pip([[10.2,15],[11.5,9.5],[15,6],[20,5],[25,6],[28.5,9.5],[29.8,13.6],[27.6,12],[24.2,11.4],[20.4,12],[17,13.6],[13.8,16.8],[11.2,17.6]]),
 tuck:pip([[10.2,15],[11.5,9.5],[15,6],[20,5],[25,6],[28.5,9.5],[29,12.4],[27.4,11.2],[25.4,14.2],[23,11.4],[20.6,13.8],[17.4,11.6],[14.4,15],[12,16]])};
add('bang',BG[HS]||pip([[10.2,15],[11.5,9.5],[15,6],[20,5],[25,6],[28.5,9.5],[29.8,16.4],[28.4,13.4],[26.6,11.6],[25.4,14.8],[23,11.4],[20.6,13.8],[17.4,11.6],[14.4,15],[12,16]]),C.hair);
if(opt.acc==='band')add('band',pip([[8.2,14.4],[9.8,8.6],[14,5],[20,3.4],[26,5],[30.2,8.6],[31.8,14.4],[29.4,11.8],[25,9.4],[20,8.8],[15,9.4],[10.6,11.8]]),C.band);
if(opt.acc==='band')add('knot',or(pip([[30,8.6],[36,6],[35,11.8]]),pip([[30.6,11],[35.4,14.8],[31.6,15.6]])),C.band);
if(opt.acc==='kachu')add('band',pip([[9,14.6],[10.2,9.4],[14.2,5.8],[20,4.4],[25.8,5.8],[29.8,9.4],[31,14.6],[29.6,13.6],[28.2,10.2],[25,7.6],[20,6.4],[15,7.6],[11.8,10.2],[10.4,13.6]]),C.band);
if(opt.acc==='ribbon')add('band',or(pip([[26.4,7.6],[31.6,2.4],[33.4,7],[29.6,9.6]]),pip([[25.6,8.6],[23,2.6],[27.4,3.6],[28.4,7.6]]),ell(27.8,7.6,1.8,1.6),pip([[27,8.6],[25.6,13.6],[27.4,12.8]]),pip([[28.6,8.6],[31.2,13.4],[29.4,13]])),C.red);
if(opt.acc==='hat'){add('band',and(ell(20,6.6,9.2,6.2),(x,y)=>y<9.8),C.straw);add('brim',and(ell(20,10.2,16,3.4),(x,y)=>true),C.straw,{noHi:1});add('hb',and(ell(20,6.6,9.2,6.2),(x,y)=>y>=7.4&&y<9.8),C.red)}
// ラスタライズ
const own=[];const img=[];for(let y=0;y<H;y++){own.push(Array(W).fill(-1));img.push(Array(W).fill(null))}
R.forEach((r,i)=>{for(let y=0;y<H;y++)for(let x=0;x<W;x++)if(r.f(x+.5,y+.5))own[y][x]=i});
for(let y=0;y<H;y++)for(let x=0;x<W;x++){const i=own[y][x];if(i<0)continue;const r=R[i],f=r.f,inn=(a,b)=>f(a+.5,b+.5);
  let k=1;
  if(!inn(x+1,y))k=3;else if(!inn(x+2,y))k=2;
  else if(!r.noHi&&(!inn(x-1,y)||!inn(x,y-1)))k=0;
  // 下の面はかげ
  if(k<2&&!inn(x,y+1)&&r.n!=='band'&&r.n!=='brim')k=2;
  img[y][x]=r.c[k];}
const P=(x,y,c)=>{x=Math.floor(x);y=Math.floor(y);if(y>=0&&y<H&&x>=0&&x<W)img[y][x]=c};
const is=(x,y,n)=>own[y]&&own[y][x]>=0&&R[own[y][x]].n===n;
// かげ
for(let x=12;x<29;x++){for(let y=12;y<20;y++)if(is(x,y,'face')&&!is(x,y-1,'face')){P(x,y,C.skin[2]);break}}
for(let x=17;x<=23;x++){P(x,30,C.skin[3]);P(x,31,C.skin[2])}
for(let x=8;x<32;x++){if(is(x,Math.floor(hem)-1,'skirt'))P(x,Math.floor(hem)-1,C[O.sk][3]);if(is(x,Math.floor(hem)-2,'skirt'))P(x,Math.floor(hem)-2,C[O.sk][2])}
for(let x=12;x<29;x++)if(is(x,Math.ceil(hem),'legL')||is(x,Math.ceil(hem),'legR')){P(x,Math.ceil(hem),C.skin[3]);P(x,Math.ceil(hem)+1,C.skin[2])}
if(!O.shorts&&!O.flow&&!O.pants&&!O.noSk&&(!O.skt||O.skt==='pleat'||O.skt==='check'))for(let y=Math.min(60,hem-4)+1;y<hem-2;y++){const t=(y-48)*.13;P(Math.round(12.6-t),y,C[O.sk][2]);P(16,y,C[O.sk][3]);P(23,y,C[O.sk][2]);P(Math.round(27.4+t),y,C[O.sk][3])}
if(O.flow)for(let y=56;y<hem-2;y+=1){if((y>>1)%3===0){P(15,y,C[O.sk][2]);P(24,y,C[O.sk][3])}}
if(O.skt==='check'){for(let y=49;y<hem;y++)for(let x=8;x<32;x++)if(is(x,y,'skirt')){if(y%5===2)P(x,y,'#f6e0c0');else if(x%5===2)P(x,y,C[O.sk][2])}}
if(O.skt==='tier'){[55,61].forEach(y=>{for(let x=8;x<32;x++)if(is(x,y,'skirt'))P(x,y,C[O.sk][2])});for(let x=8;x<32;x++)if(is(x,Math.floor(hem)-1,'skirt')&&x%2)P(x,Math.floor(hem)-1,'#ffffff')}
if(O.skt==='button'){for(let y=50;y<hem-3;y+=3)P(20,y,'#e8c070');for(let y=hem-4;y<hem;y++)P(20,y,C[O.sk][3]);for(let x=13;x<=27;x++)if(is(x,49,'skirt'))P(x,49,C[O.sk][2])}
if(O.skt==='wrap'){for(let y=48;y<hem;y++){const x=Math.round(25.5-(y-48)*.45);if(is(x,y,'skirt'))P(x,y,C[O.sk][3]);if(is(x+1,y,'skirt'))P(x+1,y,C[O.sk][0])}}
if(O.skt==='tight'){for(let y=hem-5;y<hem;y++)P(25,y,C[O.sk][3]);for(let x=13;x<=27;x++)if(is(x,49,'skirt'))P(x,49,C[O.sk][2])}
if(O.skt==='flare'){for(let y=56;y<hem-2;y++){P(15,y,C[O.sk][2]);P(20,y,C[O.sk][2]);P(25,y,C[O.sk][3])}}
if(O.pants){for(let y=60;y<88;y++){P(19,y,C[O.sk][3]);P(20,y,C[O.sk][3])}for(let x=13;x<28;x++)if(is(x,86,'skirt'))P(x,86,C[O.sk][2])}
if(O.dots){const D=O.dots;for(let y=34;y<88;y++)for(let x=8;x<32;x++){if(!((x+(y%8<4?0:2))%4===0&&y%4===1))continue;const n=own[y][x]>=0?R[own[y][x]].n:'';if(['torso','armL','armR','skirt'].includes(n))P(x,y,D)}}
if(O.towel){for(let x=11;x<29;x++){if(is(x,37,'torso'))P(x,37,T[2]);if(is(x,38,'torso'))P(x,38,T[0])}for(let y=37;y<62;y++){const x=Math.round(24+(y-37)*.12);if(is(x,y,'torso'))P(x,y,T[2])}for(let y=40;y<62;y+=4)for(let x=12;x<28;x+=3)if(is(x,y,'torso'))P(x,y,T[0]);[[24,38],[25,39],[23,39]].forEach(([x,y])=>P(x,y,T[3]))}
if(O.frill)for(let x=8;x<32;x++)if(is(x,Math.floor(hem)-1,'skirt')&&x%2)P(x,Math.floor(hem)-1,'#ffffff');
if(AP==='down')for(let y=36;y<47;y++){if(is(14,y,'torso'))P(14,y,T[2]);if(is(25,y,'torso'))P(25,y,T[2])}
if(hem<80)[[16,77],[17,78],[22,77],[23,78]].forEach(([x,y])=>P(x,y,C.skin[2]));
// 髪のつや（天使の輪）とすじ
if(opt.acc!=='hat'){[[14,10],[15,9],[16,9],[17,8],[18,8],[19,8]].forEach(([x,y])=>P(x,y,C.hair[0]));P(20,8,C.hair[0]);}
if(opt.acc==='pin'){[[26,10],[25,11],[26,11],[27,11],[26,12],[28,13],[27,14],[28,14],[29,14],[28,15]].forEach(([x,y],i)=>P(x,y,i===2||i===7?'#fff6c0':'#ffc93c'));}
if(opt.acc==='none'||opt.acc==='pin'){[[19,5],[20,6],[20,7]].forEach(([x,y])=>P(x,y,C.hair[3]))}
if(opt.acc==='hat'){for(let x=5;x<36;x+=3)if(is(x,10,'brim'))P(x,10,C.straw[2]);for(let x=12;x<29;x+=3)if(is(x,5,'band'))P(x,5,C.straw[2]);}
(opt.acc==='hat'?[]:[[16,9],[22,8],[26,10]]).forEach(([x,y])=>{P(x,y,C.hair[2]);P(x+1,y+1,C.hair[2])});
for(let y=17;y<29;y++){P(10,y,C.hair[2]);if(HS!=='tuck')P(29,y,C.hair[2])}
if(HS==='halfup'){[[18,6],[19,6],[20,6],[21,6],[22,6]].forEach(([x,y])=>P(x,y,'#ffc93c'));P(20,3,C.hair[0]);P(19,3,C.hair[0]);}
if(HS==='buns'){[[9,9],[10,10],[11,10],[12,10],[28,10],[29,10],[30,10],[31,9]].forEach(([x,y])=>P(x,y,'#ffc93c'));P(9,5,C.hair[0]);P(10,4,C.hair[0]);P(28,4,C.hair[0]);P(29,4,C.hair[0]);}
if(HS==='twin'){[[8,19],[9,19],[9,20],[31,19],[30,19],[30,20]].forEach(([x,y])=>P(x,y,'#ffc93c'));for(let y=23;y<31;y+=2){P(5,y,C.hair[2]);P(34,y,C.hair[2])}}
if(HS==='tuck'){[[27,13],[28,14],[27,15],[28,16]].forEach(([x,y])=>P(x,y,'#ffc93c'));P(29,21,C.skin[2]);}
if(HS==='braid'){for(let x=10;x<31;x++){const y=Math.round(10.6-Math.sqrt(Math.max(0,1-((x-20)/10.6)**2))*5.4);P(x,y,x%3===0?C.hair[3]:C.hair[0]);P(x,y+1,x%3===1?C.hair[3]:C.hair[1]);}}
if(HS==='wavy'){[[9,20],[10,22],[9,24],[30,20],[29,22],[30,24],[12,28],[27,28]].forEach(([x,y])=>P(x,y,C.hair[0]))}
if(HS==='flip'){P(6,30,C.hair[0]);P(33,30,C.hair[0]);}
if(HS==='inner'){for(let x=11;x<29;x++)if(is(x,30,'hairB'))P(x,30,C.hair[3]);}
// バンダナの水玉
if(opt.acc==='band'){[[13,8],[17,6],[20,5],[23,6],[27,8],[15,8],[25,8]].forEach(([x,y],i)=>P(x,y,i<5?'#fffbe8':'#fff0b8'));P(31,10,C.band[3]);P(30,10,C.band[3]);}
// 目（ミナ先生の顔と同じ作り: 大きい・きらきら・まつげ）
const ink='#2a2340',ex=opt.ex||'smile';
const EC={L:ink,D:'#1f4a2c',W:'#ffffff',G:'#3fae5a',g:'#8adb96',l:'#b8f0a8',w:'#f4eeee'};
const PAT={open:['LLLLL','LDWDD','.DWGD','.GGGD','.GllG','..gg.'],
 aside:['LLLLL','LDDWw','LGGDw','.GGGw','.gll.','.....'],
 wide:['.LLL.','LwwwL','LwDwL','LwGwL','.www.','.....'],
 half:['.....','.....','LLLLL','LDGGD','.GllG','..gg.']};
const EYE=(m,p)=>PAT[p].forEach((r,j)=>[...r].forEach((c,i)=>{if(c==='.')return;const x=m?39-(12+i):12+i;P(x,18+j,EC[c])}));
const PX=(m,list,c)=>list.forEach(([x,y])=>P(m?39-x:x,y,c));
const happy=m=>PX(m,[[12,22],[13,21],[14,20],[15,20],[16,21],[17,22],[13,20]],ink);
const closed=m=>PX(m,[[12,20],[13,21],[14,21],[15,21],[16,21],[17,20],[11,19]],ink);
const gt=m=>PX(m,[[13,19],[14,20],[15,21],[16,21],[15,22],[14,23],[13,23]],ink);
if(ex==='smile'||ex==='pout'||ex==='sad'){EYE(0,'open');EYE(1,'open');P(11,17,ink);P(28,17,ink)}
if(ex==='laugh'){happy(0);happy(1)}
if(ex==='wink'){EYE(0,'open');P(11,17,ink);happy(1)}
if(ex==='wow'){EYE(0,'wide');EYE(1,'wide')}
if(ex==='shy'){EYE(0,'aside');EYE(1,'aside');P(11,17,ink);P(28,17,ink)}
if(ex==='oops'){gt(0);gt(1)}
if(ex==='sleepy'){EYE(0,'half');EYE(1,'half')}
if(ex==='sleep'){closed(0);closed(1)}
// まゆ（気もちが出る表情だけ）
if(ex==='sad'||ex==='oops'){PX(0,[[13,16],[14,15],[15,15]],C.hair[3]);PX(1,[[13,16],[14,15],[15,15]],C.hair[3])}
if(ex==='pout'){PX(0,[[13,15],[14,15],[15,16],[16,16]],C.hair[3]);PX(1,[[13,15],[14,15],[15,16],[16,16]],C.hair[3])}
if(ex==='wow'){PX(0,[[13,15],[14,14],[15,14]],C.hair[3]);PX(1,[[13,15],[14,14],[15,14]],C.hair[3])}
if(ex!=='wow'&&ex!=='sleep'&&ex!=='laugh'&&ex!=='oops'){P(13,24,C.skin[2]);P(26,24,C.skin[2])}
// ほお
const bl=ex==='shy'||ex==='pout'||ex==='oops'?['#ff8ea0','#ff7890']:['#ffb0bc','#ffa0b0'];
[[12,25,0],[13,25,1],[14,25,0],[25,25,0],[26,25,1],[27,25,0]].forEach(([x,y,k])=>P(x,y,bl[k]));P(13,26,'#ffd0d4');P(26,26,'#ffd0d4');
if(ex==='shy'||ex==='pout'){[[12,24],[14,24],[25,24],[27,24]].forEach(([x,y])=>P(x,y,'#ff7890'))}else{P(12,24,'#ffffff');P(25,24,'#ffffff')}
P(20,23,C.skin[2]);
// 口
const M={smile:[[18,25,'#c0505e'],[19,25,'#8a2038'],[20,25,'#8a2038'],[21,25,'#8a2038'],[22,25,'#c0505e'],[19,26,'#b4294a'],[20,26,'#ff8fa3'],[21,26,'#b4294a']],
 laugh:[[17,25,'#8a2038'],[18,25,'#8a2038'],[19,25,'#8a2038'],[20,25,'#8a2038'],[21,25,'#8a2038'],[22,25,'#8a2038'],[23,25,'#8a2038'],[18,26,'#b4294a'],[19,26,'#ff8fa3'],[20,26,'#ff8fa3'],[21,26,'#ff8fa3'],[22,26,'#b4294a'],[19,27,'#b4294a'],[20,27,'#b4294a'],[21,27,'#b4294a']],
 small:[[18,25,'#c0505e'],[19,26,'#c0505e'],[20,26,'#c0505e'],[21,26,'#c0505e'],[22,25,'#c0505e']],
 o:[[19,25,'#8a2038'],[20,25,'#8a2038'],[21,25,'#8a2038'],[19,26,'#8a2038'],[20,26,'#ff8fa3'],[21,26,'#8a2038'],[20,27,'#8a2038']],
 wavy:[[17,26,'#b4294a'],[18,25,'#b4294a'],[19,26,'#b4294a'],[20,25,'#b4294a'],[21,26,'#b4294a'],[22,25,'#b4294a'],[23,26,'#b4294a']],
 flat:[[18,26,'#b4294a'],[19,26,'#b4294a'],[20,26,'#b4294a'],[21,26,'#b4294a'],[22,26,'#b4294a'],[20,25,'#d8808a']],
 sad:[[18,26,'#b4294a'],[19,25,'#b4294a'],[20,25,'#b4294a'],[21,25,'#b4294a'],[22,26,'#b4294a']],
 sleep:[[19,25,'#b4294a'],[20,25,'#b4294a'],[20,26,'#d8808a']]};
const mk={smile:'smile',laugh:'laugh',wink:'smile',wow:'o',shy:'small',oops:'wavy',sleepy:'small',sleep:'sleep',sad:'sad',pout:'flat'}[ex];
M[mk].forEach(([x,y,c])=>P(x,y,c));
if(ex==='pout'){P(10,24,C.skin[1]);P(29,24,C.skin[1])}
if(ex==='oops'){[[31,15],[31,16],[30,17],[31,17],[32,17],[31,18]].forEach(([x,y])=>P(x,y,'#8fd3ff'))}
if(ex==='sad'){[[17,24],[17,25],[16,26]].forEach(([x,y])=>P(x,y,'#8fd3ff'))}
// えり・むね
if(O.neck==='v'){P(19,32,C.skin[2]);P(20,32,C.skin[2]);P(21,32,C.skin[2]);P(20,33,C.skin[2]);P(18,32,T[2]);P(22,32,T[2]);P(19,33,T[3]);P(21,33,T[3]);}
if(O.neck==='collar'){[[16,32],[17,33],[18,34],[19,35],[24,32],[23,33],[22,34],[21,35]].forEach(([x,y])=>P(x,y,'#ffffff'));[[18,33],[19,34],[20,35],[21,34],[22,33],[19,33],[20,33],[21,33],[20,34]].forEach(([x,y])=>P(x,y,C.skin[1]));P(20,34,C.skin[2]);}
if(O.neck==='round'){for(let x=18;x<=22;x++)P(x,33,T[2]);P(19,32,C.skin[2]);P(20,32,C.skin[2]);P(21,32,C.skin[2]);}
if(O.neck==='scoop'){for(let x=17;x<=23;x++){P(x,32,C.skin[1]);P(x,33,C.skin[x===17||x===23?2:1])}for(let x=18;x<=22;x++)P(x,34,C.skin[2]);P(16,33,T[2]);P(24,33,T[2]);}
if(STY==='cami'||STY==='swim'){[[15,33],[15,34],[15,35],[24,33],[24,34],[24,35]].forEach(([x,y])=>P(x,y,T[2]));}
if(STY==='halter'){[[16,35],[17,34],[18,33],[19,32],[23,35],[22,34],[21,33],[20,32]].forEach(([x,y])=>P(x,y,T[2]));}
if(STY==='bikini'){[[15,33],[15,34],[15,35],[24,33],[24,34],[24,35]].forEach(([x,y])=>P(x,y,T[2]));P(20,37,T[3]);P(20,38,T[3]);}
if(STY==='crop'||STY==='bikini'){P(20,46,C.skin[3]);for(let x=13;x<28;x++)if(is(x,STY==='crop'?44:41,'shoulder'))P(x,STY==='crop'?44:41,C.skin[2]);}
if(STY==='offknit'){for(let y=37;y<57;y++)for(let x=12;x<29;x+=3)if(is(x,y,'torso'))P(x,y,T[2]);for(let x=11;x<29;x++){if(is(x,57,'torso'))P(x,57,T[3]);if(is(x,36,'torso'))P(x,36,T[0])}[[19,33],[20,33],[21,34],[16,35],[24,35]].forEach(([x,y])=>P(x,y,C.skin[2]));}
if(O.sheen){[[16,40],[17,41],[17,52],[18,55],[18,58],[23,44],[24,50]].forEach(([x,y])=>{if(own[y][x]>=0)P(x,y,T[0])})}
if(O.robe){for(let y=33;y<46;y++){const d=Math.round((y-33)*.35);P(19-d+3,y,T[2]);}for(let y=47;y<60;y++)P(22,y,T[2]);[[18,33],[19,34],[20,35],[21,36],[19,33],[20,34],[20,33]].forEach(([x,y])=>P(x,y,C.skin[1]));P(19,35,C.skin[2]);}
if(O.pareo){[[14,49],[13,50],[15,50],[14,51],[13,52]].forEach(([x,y])=>P(x,y,C[O.pareo][2]));for(let y=52;y<62;y+=3)P(Math.round(17+(y-52)*.5),y,C[O.pareo][2]);}
if(STY&&STY!=='crop'){P(18,34,C.skin[2]);P(21,34,C.skin[2]);P(20,33,C.skin[2]);}
if(O.sl==='off'){for(let x=12;x<=27;x++)if(x%2)P(x,36,'#ffffff');P(19,33,C.skin[2]);P(20,33,C.skin[2]);P(16,34,C.skin[2]);P(24,34,C.skin[2]);}
if(O.print==='border'){for(let y=35;y<48;y+=3)for(let x=8;x<32;x++)if(is(x,y,'torso')||is(x,y,'armL')||is(x,y,'armR'))P(x,y,C.navy[1])}
if(O.print==='star'){[[20,39],[19,40],[20,40],[21,40],[20,41],[18,40],[22,40],[19,42],[21,42]].forEach(([x,y])=>P(x,y,'#ffc93c'))}
if(O.print==='wave'){[[16,41],[17,40],[18,41],[19,40],[20,41],[21,40],[22,41],[23,40]].forEach(([x,y])=>P(x,y,'#4a9ad8'))}
if(O.print==='moon'){[[20,39],[19,40],[19,41],[20,42],[21,42]].forEach(([x,y])=>P(x,y,'#ffe27a'))}
if(O.ribbonW){for(let x=13;x<=27;x++)if(is(x,48,'skirt')||is(x,48,'torso'))P(x,48,C[O.ribbonW][1]);P(20,47,C[O.ribbonW][2]);P(19,49,C[O.ribbonW][1]);P(21,49,C[O.ribbonW][1]);}
if(O.btn)[37,40,43,46].forEach(y=>P(20,y,T[3]));
// エプロン
if(O.apron){const A=C[O.apron],ab=Math.min(60,hem-4);
for(let x=17;x<=23;x++){P(x,51,A[2]);P(x,Math.min(56,ab-3),A[3])}for(let y=51;y<=Math.min(56,ab-3);y++){P(17,y,A[2]);P(23,y,A[3])}
for(let x=18;x<=22;x+=2)P(x,52,O.apron==='apron'?'#c8d8f0':A[0]);
for(let x=13;x<=27;x+=2)P(x,ab-2,O.apron==='apron'?'#a8c0e0':A[0]);for(let y=50;y<ab-2;y+=2){P(13,y,A[2]);P(26,y,A[3])}
P(18,40,A[2]);P(19,40,A[2]);P(20,40,A[2]);P(18,41,A[2]);P(19,41,'#ffd23f');P(19,42,'#ff7a7a');
P(13,48,A[3]);P(26,48,A[3]);}
if(AP==='down'&&!stp){P(12,59,C.skin[2]);P(13,59,C.skin[2]);P(26,59,C.skin[2]);P(27,59,C.skin[2]);}
if(O.shoe!=='slip'){P(13,93,C.shoe[0]);P(14,92,C.shoe[0]);P(25,92,C.shoe[0]);P(26,93,C.shoe[0]);}
if(O.socks){P(15,85,C.sock[2]);P(24,85,C.sock[2]);}
// アウトライン（となりの色を暗くする）
const dk=(h,a)=>{const n=parseInt(h.slice(1),16);const f=v=>Math.round(v*a);return `rgb(${f(n>>16)},${f((n>>8)&255)},${f(n&255)})`};
const out=img.map(r=>r.slice());
for(let y=0;y<H;y++)for(let x=0;x<W;x++){if(img[y][x])continue;
  for(const[dx,dy]of[[0,1],[1,0],[-1,0],[0,-1]]){const yy=y+dy,xx=x+dx;if(img[yy]&&img[yy][xx]){const c=img[yy][xx];out[y][x]=c.startsWith('#')?dk(c,.42):'#3a2a2a';break}}}
return out}
/* ================================================================ 服と 髪型 */
const OUT=[
 {id:'usual',n:'いつもの',en:"Denim apron, as always!",ja:'いつもの デニムの エプロン！',acc:'band',o:{},w:4},
 {id:'pink',n:'ピンクの エプロン',en:"Pink apron today. Cute, right?",ja:'きょうは ピンクの エプロン。 かわいいでしょ？',acc:'kachu',o:{apron:'pink',sk:'navy',cuff:'pink'},w:2},
 {id:'border',n:'ボーダーの日',en:"Stripes day! I feel like a sailor.",ja:'ボーダーの日！ 船乗りの 気分。',acc:'kachu',o:{top:'tee',sl:'long',cuff:'navy',apron:'apron',sk:'cream',neck:'round',print:'border'},w:2},
 {id:'noapron',n:'エプロンなし',en:"No apron today. I washed it!",ja:'きょうは エプロン なし。 洗濯 しちゃった！',acc:'pin',o:{apron:null,sk:'navy',btn:1,belt:'shoe'},w:2},
 {id:'mini',n:'ミニスカートの日',en:"A little short today… too short?",ja:'きょうは ちょっと 短め… 短すぎ？',acc:'band',o:{top:'mint',sl:'short',apron:null,sk:'coral',hem:60,neck:'round',belt:'cream'},w:1},
 {id:'off',n:'オフショルダー',en:"Off-shoulder top! Do I look grown-up?",ja:'オフショルダー！ 大人っぽく 見える？',acc:'none',o:{top:'pink',sl:'off',apron:null,sk:'black',hem:61,neck:'none',socks:0},w:1},
 {id:'check',n:'チェックの スカート',en:"Plaid skirt. Very autumn, very me.",ja:'チェックの スカート。 秋っぽくて わたしっぽい。',acc:'pin',o:{top:'tee',sl:'short',apron:'apron',sk:'plaid',skt:'check',hem:66,neck:'round'},w:1},
 {id:'flare',n:'フレアスカート',en:"This skirt spins when I turn! Look!",ja:'この スカート、 回ると ふわって なるの！ 見て！',acc:'ribbon',o:{top:'tee',sl:'short',apron:null,sk:'coral',skt:'flare',hem:68,neck:'round'},w:1},
 {id:'long',n:'ロングスカート',en:"Long skirt today. Feeling calm.",ja:'きょうは ロングスカート。 おちついた 気分。',acc:'pin',o:{top:'tee',sl:'short',apron:'apron',sk:'mint',skt:'maxi',hem:86,flow:1,socks:0,neck:'round'},w:1},
 {id:'tight',n:'タイトスカート',en:"Tight skirt. I'm a serious shop clerk today.",ja:'タイトスカート。 きょうは まじめな 店員さん。',acc:'none',o:{top:'shirt',sl:'long',apron:null,sk:'black',skt:'tight',hem:63,btn:1},w:1},
];
const SUMMER=[
 {id:'tee',n:'夏の Tシャツ',en:"T-shirt weather! Summer is here!",ja:'Tシャツの 季節！ 夏が きた！',acc:'hat',o:{top:'tee',sl:'short',apron:null,sk:'denim',hem:64,neck:'round',print:'wave'},w:2},
 {id:'dress',n:'水色の ワンピース',en:"A light blue dress, like the sea!",ja:'水色の ワンピース。 海みたいでしょ！',acc:'ribbon',o:{top:'sky',sl:'none',apron:null,sk:'sky',hem:72,neck:'scoop',ribbonW:'cream',flow:1,socks:0},w:2},
 {id:'cami',n:'キャミソール',en:"It's so hot… camisole and shorts!",ja:'暑すぎて… キャミと ショートパンツ！',acc:'pin',hair:'flip',o:{style:'cami',top:'cream',sl:'none',apron:null,sk:'denim',shorts:1,hem:60,neck:'none',socks:0,shoe:'slip'},w:1},
 {id:'crop',n:'へそ出しの 日',en:"Crop top day. Don't stare, Boss!",ja:'へそ出しの 日。 じっと 見ないでね、 店長！',acc:'kachu',hair:'halfup',o:{style:'crop',top:'tee',sl:'short',apron:null,sk:'plaid',skt:'check',hem:58,neck:'round',print:'star',socks:0},w:1},
 {id:'halter',n:'赤い ミニワンピ',en:"Red dress! I'm the flower of the beach.",ja:'赤い ワンピ！ 浜辺の 花 です。',acc:'ribbon',hair:'inner',o:{style:'halter',top:'red2',sl:'none',apron:null,sk:'red2',hem:62,neck:'none',flow:1,socks:0,shoe:'slip'},w:1},
 {id:'swim',n:'水着（ワンピース）',en:"Swimsuit day! I'll swim after work!",ja:'水着の 日！ 仕事の あと 泳ぐんだ！',acc:'hat',o:{style:'swim',top:'sky',sl:'none',apron:null,noSk:1,hem:53.6,neck:'none',dots:'#ffffff',socks:0,shoe:'slip'},w:.5},
 {id:'bikini',n:'水着（パレオ）',en:"Beach style! The pareo is new.",ja:'浜辺スタイル！ パレオは 新しいの。',acc:'none',hair:'buns',o:{style:'bikini',top:'sun',sl:'none',apron:null,sk:'sun',pareo:'pinkS',hem:53.6,neck:'none',socks:0,shoe:'slip'},w:.5},
];
const NIGHT=[
 {id:'ntee',n:'夜の Tシャツ',acc:'none',o:{top:'gray',sl:'short',apron:null,sk:'navy',shorts:1,hem:60,neck:'round',print:'moon',socks:0,shoe:'slip'},w:2},
 {id:'pj',n:'水玉の パジャマ',acc:'none',o:{top:'pj',sl:'long',cuff:'pj',apron:null,sk:'pj',pants:1,hem:50,neck:'collar',btn:1,dots:'#ffffff',socks:0,shoe:'slip'},w:2},
 {id:'pjp',n:'ピンクの パジャマ',acc:'none',o:{top:'pjp',sl:'long',cuff:'pjp',apron:null,sk:'pjp',pants:1,hem:50,neck:'collar',btn:1,dots:'#ffffff',socks:0,shoe:'slip'},w:2},
 {id:'pjs',n:'半そでの パジャマ',acc:'none',o:{top:'pj',sl:'short',apron:null,sk:'pj',shorts:1,hem:60,neck:'collar',btn:1,dots:'#ffffff',socks:0,shoe:'slip'},w:1},
 {id:'gown',n:'ネグリジェ',acc:'none',o:{top:'lav',sl:'short',apron:null,sk:'lav',hem:87,neck:'scoop',flow:1,frill:1,socks:0,shoe:'slip',ribbonW:'pink'},w:1},
 {id:'shirt',n:'大きめシャツ',acc:'none',hair:'tuck',o:{style:'long',top:'tee',sl:'long',cuff:'tee',apron:null,noSk:1,hem:60.4,neck:'v',btn:1,socks:0,shoe:'slip'},w:1},
 {id:'knit',n:'ゆるニット',acc:'none',hair:'wavy',o:{style:'offknit',top:'knit',sl:'long',cuff:'knit',apron:null,noSk:1,hem:58.4,neck:'none',socks:0,shoe:'slip'},w:1},
 {id:'satin',n:'サテンの キャミワンピ',acc:'none',o:{style:'cami',top:'night',sl:'none',apron:null,sk:'night',hem:63,flow:1,neck:'none',sheen:1,socks:0,shoe:'slip'},w:1},
 {id:'room',n:'ふわふわ ルームウェア',acc:'pin',o:{style:'cami',top:'lav',sl:'none',apron:null,sk:'lav',shorts:1,hem:60,neck:'none',dots:'#ffffff',socks:0,shoe:'slip'},w:1},
 {id:'robe',n:'ガウン',acc:'none',o:{style:'long',top:'towel',sl:'long',cuff:'towel',apron:null,noSk:1,hem:62,neck:'none',robe:1,belt:'pinkS',socks:0,shoe:'slip'},w:1},
];
const HAIRS=[['bob','いつもの ボブ',4],['flip','外はね',1],['inner','内まき',1],['wavy','ゆるふわ',1],['halfup','ハーフアップ',1],['buns','おだんご 2つ',1],['twin','ちょこんと ツイン',1],['center','センターわけ',1],['side','ななめ 前髪',1],['tuck','かたほう 耳かけ',1],['braid','あみこみ',1]];
/* 日付から きまる 数（同じ 日は 同じ 服） */
const dayKey=()=>{const d=new Date();return d.getFullYear()*1000+d.getMonth()*40+d.getDate()};
const rnd=s=>{s=Math.imul(s^0x9e3779b9,0x85ebca6b);s^=s>>>13;s=Math.imul(s,0xc2b2ae35);s^=s>>>16;return (s>>>0)/4294967296};
const wpick=(L,r)=>{const t=L.reduce((a,x)=>a+(x.w!=null?x.w:x[2]),0);let v=r*t;for(const x of L){v-=(x.w!=null?x.w:x[2]);if(v<=0)return x}return L[L.length-1]};
const summer=()=>{const m=new Date().getMonth();return m>=5&&m<=8};
function look(night){const k=dayKey(),L=night?NIGHT:summer()?OUT.concat(SUMMER):OUT,f=wpick(L,rnd(k+(night?7:0)));
  const h=f.hair||wpick(HAIRS,rnd(k*3+1))[0];
  return Object.assign({},f,{hair:h,hairN:(HAIRS.find(x=>x[0]===h)||HAIRS[0])[1]})}

/* ================================================================ 絵に する */
const CACHE=new Map();
function sprite(o){const k=JSON.stringify(o);let c=CACHE.get(k);if(c)return c;
  const out=build(o);c=document.createElement('canvas');c.width=W;c.height=H;const s=c.getContext('2d');
  for(let y=0;y<H;y++)for(let x=0;x<W;x++)if(out[y][x]){s.fillStyle=out[y][x];s.fillRect(x,y,1,1)}
  if(CACHE.size>80)CACHE.delete(CACHE.keys().next().value);CACHE.set(k,c);return c}
function draw(c,x,y,pose='stand',f=0,opt={}){const L=look(!!opt.night);
  let arm='down',ex='smile',step=0,bx=0;
  if(pose==='walk'){step=f%2?1:2}
  else if(pose==='wave'){arm='wave';ex=f%4<2?'laugh':'smile'}
  else if(pose==='cheer'){arm='cheer';ex='laugh'}
  else if(pose==='sweep'){arm='sweep';bx=f%2?1:-1}
  else if(pose==='doze'){ex='sleep'}
  if(ex==='smile'&&(f*7+3)%23===0)ex='sleep';   // ときどき まばたき
  const sp=sprite({acc:L.acc,hair:L.hair,ex,arm,step,o:L.o});
  const t=c.getTransform(),k=t.a||1,fx=x+7,fy=y+32+(opt.dy||0);
  c.save();c.setTransform(1,0,0,1,0,0);c.imageSmoothingEnabled=false;
  c.drawImage(sp,Math.round(t.e+(fx-10)*k)+bx,Math.round(t.f+(fy-48)*k)-(step?1:0),20*k,48*k);c.restore();
  if(pose==='doze'){c.fillStyle='#cfe3ff';c.font='5px monospace';c.fillText(f%2?'z':'Z',x+16,y-12-(f%2)*2)}}
window.MIOPX={draw,look,sprite,OUT,SUMMER,NIGHT,HAIRS};
})();
/* お店・2階の MIO.draw を 新しい 絵に（前の 14x32 は MIO.draw0 に のこす） */
if(window.MIO&&window.MIOPX&&!MIO.draw0){MIO.draw0=MIO.draw;MIO.draw=(c,x,y,p,f,o)=>MIOPX.draw(c,x,y,p,f,o||{})}
/* ================================================================ ミナ先生の ひとこと（ミオの きょうの 服） */
(()=>{if(!window.MINA_LINES)return;
Object.assign(MINA_LINES,{
 r_mioLook:[['smile','きょうの ミオさん、 「{n}」 だったね。 英語で 「You look nice today!」って 言って あげると よろこぶよ'],
  ['happy','ミオさんの 「{n}」、 見た？ 服を ほめる ときは 「I like your 〜.」が かんたんで しぜんだよ'],
  ['wink','「{n}」… ミオさん、 毎日 服を かえてるんだね。 「What a cute outfit!」も つかえるよ'],
  ['smile','服の 英語、 ミオさんで おぼえちゃおう。 スカートは skirt、 エプロンは apron、 ワンピースは dress だよ']],
 x_mioLook:[['smile','きょうの ミオさんは 「{n}」 らしいよ。 お店で 会ったら 「Nice {w}!」って 言って みて'],
  ['happy','ミオさん、 きょうは 「{n}」 なんだって。 服の ほめ方、 英語で ためして みたら？']]});
const W1={usual:'apron',pink:'apron',border:'stripes',noapron:'shirt',mini:'skirt',off:'top',check:'skirt',flare:'skirt',long:'skirt',tight:'skirt',tee:'T-shirt',dress:'dress',cami:'shorts',crop:'top',halter:'dress',swim:'swimsuit',bikini:'pareo'};
if(window.MINA_SENSE&&MINA_SENSE._rules)MINA_SENSE._rules.push(['x_mioLook',1,()=>{let h=12;try{h=GH()}catch(e){}if(h<9||h>=21)return null;const L=MIOPX.look(false);return {n:L.n,w:W1[L.id]||'outfit'}},()=>window.SHOP&&SHOP.open?['🃏 ミオに 会いに',()=>SHOP.open()]:null]);
(window.MINA_REACT_EXT=window.MINA_REACT_EXT||{}).mioLook={act:e=>['r_mioLook',{n:e.ja||'いつもの'}],desc:e=>`ミオの きょうの 服（${e.ja||''}）を 見た`};
/* お店で その日 はじめて 会った とき、 ミオが 服の ことを ひとこと（1日 1回） */
window.MIOPX.hello=()=>{const L=MIOPX.look(false),d=new Date().toDateString();let k='';try{k=localStorage.getItem('hoshi_mioLook')||''}catch(e){}
  if(k===d||!L.en)return null;try{localStorage.setItem('hoshi_mioLook',d)}catch(e){}
  try{RECENT.add('mioLook',{ja:L.n})}catch(e){}return [L.en,L.ja]};
})();
