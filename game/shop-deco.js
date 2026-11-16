/* カードショップ店内の もようがえ（ミオが 2〜4日ごとに かえる）
   A 植物と 灯りの カフェ風 ／ B カードの ギャラリー ／ C 海の家らしさ ／ D 季節で かわる（春夏秋冬）
   game/shop.js の カウンターから: SHDECO.pick(S) → back（壁・床、 room の あと）／ front（手前、 player の あと）／ lit（夜の 灯り、 lights の あと）
   ドット絵の 場所: 床は カウンター前 x130〜168・y95〜116 だけ（お客の 通り道・ケース・プレイヤーを よける）。 壁は ドアと たなの あいだ x34〜42、 右かべ x176〜198、 まど下 x118〜138 */
(()=>{
const W=200,HH=116,FL=60;
const PR=(c,x,y,w,h,col)=>{c.fillStyle=col;c.fillRect(x,y,w,h)};
const CC=['#ff7a8a','#5ab4ff','#ffd23f','#7ad37a','#c79ad6','#ff9a4a'];
const P2=(c,x,y,col)=>PR(c,x,y,1,1,col);
const hash=n=>{n=Math.sin(n*127.1)*43758.5;return n-Math.floor(n)};
function sag(x0,x1,y0,d,fn){for(let x=x0;x<=x1;x++){const u=(x-x0)/(x1-x0);fn(x,Math.round(y0+d*4*u*(1-u)))}}
function softGlow(c,x,y,r,a,rgb='255,214,140'){const g=c.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,`rgba(${rgb},${a})`);g.addColorStop(1,`rgba(${rgb},0)`);c.fillStyle=g;c.fillRect(x-r,y-r,r*2,r*2)}

/* ---------- A 植物と 灯り（カフェ風） ---------- */
const GA='#5ab05a',GB='#3e8e4a',GC='#7ccf6a';
function vine(c,x,y,n,s){for(let i=0;i<n;i++){const yy=y+i*2,xx=x+((i+s)%3===0?-1:(i+s)%3===1?1:0);P2(c,xx,yy,'#4a8a3a');if(i%2===0){PR(c,xx-1,yy,2,2,i%4?GA:GC)}}}
const GARL=['#ffd27a','#ff9aa8','#9fe0ff','#c8f08a','#ffd27a'];
function A_back(c,t,f){
  /* 天井から つるした プランター（ドアと たなの あいだ） */
  PR(c,38,10,1,13,'#c8a878');PR(c,36,22,5,1,'#c8a878');
  PR(c,35,23,7,5,'#d8865a');PR(c,35,23,7,1,'#e8a070');PR(c,36,27,5,1,'#b06a42');
  PR(c,34,21,3,2,GA);PR(c,40,20,3,3,GC);PR(c,37,20,3,2,GB);
  vine(c,35,28,7,0);vine(c,41,28,9,1);vine(c,38,28,4,2);
  /* たなの 上を はう つた */
  for(let x=42;x<110;x+=3){const h=hash(x);PR(c,x,14+(h>.5?1:0),2,2,h>.7?GC:GA)}
  [[50,5],[66,3],[83,6],[99,4]].forEach(([x,n],i)=>vine(c,x,16,n,i));
  /* まどの 上の ガーランド */
  const bul=(x0,x1,y0,d)=>{sag(x0,x1,y0,d,(x,y)=>P2(c,x,y,'#6a6a6a'));for(let x=x0+3,i=0;x<x1;x+=6,i++){const u=(x-x0)/(x1-x0),y=Math.round(y0+d*4*u*(1-u));PR(c,x,y+1,2,2,t==='day'?'#f6eedc':GARL[i%5])}};
  bul(116,176,13,5);bul(6,34,17,3);
  /* 右の かべの 小さな たな＋多肉 */
  PR(c,177,46,20,2,'#c8a878');PR(c,178,48,1,2,'#a8885a');PR(c,195,48,1,2,'#a8885a');
  [[179,'#e8a070'],[185,'#ffffff'],[191,'#8ac0e0']].forEach(([x,col],i)=>{PR(c,x,42,5,4,col);PR(c,x,42,5,1,'#0002');
    if(i===0){PR(c,x+1,39,3,3,GA);P2(c,x+2,38,GC)}else if(i===1){PR(c,x+2,36,1,6,GB);PR(c,x+1,38,1,2,GB);PR(c,x+3,37,1,2,GB)}else{PR(c,x,40,2,2,GC);PR(c,x+3,40,2,2,GA);PR(c,x+1,39,3,2,GA)}});
  /* 床の ラグ（売り場の 台の 下） */
  PR(c,62,93,76,12,'#e9e2c8');PR(c,64,95,72,8,'#9fc89a');PR(c,66,97,68,4,'#e9e2c8');for(let x=68;x<132;x+=6)PR(c,x,98,3,2,'#d88a6a');
  for(let x=63;x<138;x+=2){P2(c,x,92,'#d8d0b0');P2(c,x,105,'#d8d0b0')}
  /* カウンターの 上の 小さな はち */
  PR(c,140,64,5,4,'#d8865a');PR(c,140,61,2,3,GA);PR(c,143,60,2,4,GC)}
function A_front(c,t,f){
  /* カウンターの 前の 花だん */
  PR(c,130,107,38,9,'#b98a5a');PR(c,130,107,38,1,'#d8aa72');for(let x=132;x<168;x+=6)PR(c,x,109,1,7,'#9a6e44');
  for(let x=131;x<167;x+=2){const h=hash(x*3);PR(c,x,101+Math.round(h*3),2,6-Math.round(h*3),h>.5?GA:GB)}
  [[134,'#ff9aa8'],[141,'#fff4a8'],[148,'#ff9aa8'],[155,'#ffffff'],[162,'#ffd27a']].forEach(([x,col],i)=>{const y=99+(i%2);PR(c,x,y,3,3,col);P2(c,x+1,y+1,'#ffcf4a')});
  /* ドアの 外に 大きな はち */
  }
function A_lit(c,t){if(t==='day')return;const a=t==='night'?1:.6;
  const pts=[];for(let x=119,i=0;x<176;x+=6,i++){const u=(x-116)/60;pts.push([x,Math.round(13+20*u*(1-u))+1,i])}for(let x=9,i=0;x<34;x+=6,i++){const u=(x-6)/28;pts.push([x,Math.round(17+12*u*(1-u))+1,i])}
  pts.forEach(([x,y,i])=>{PR(c,x,y,2,2,GARL[i%5]);softGlow(c,x+1,y+1,6,.22*a)});
  softGlow(c,149,108,16,.12*a)}

/* ---------- B カードの ギャラリー ---------- */
function frame(c,x,y,w,h,gold){PR(c,x,y,w,h,gold?'#d8a83a':'#8a5a3a');PR(c,x,y,w,1,gold?'#ffe08a':'#b07a4a');PR(c,x+1,y+1,w-2,h-2,gold?'#a87a22':'#6a4428')}
function bigCard(c,x,y,w,h,col,art){PR(c,x,y,w,h,col);PR(c,x+1,y+1,w-2,h-2,'#fffdf6');PR(c,x+2,y+2,w-4,Math.round(h*.55),art);PR(c,x+2,y+h-5,w-4,1,'#c8c0b0');PR(c,x+2,y+h-3,Math.round((w-4)*.6),1,'#c8c0b0')}
function star(c,x,y,col){PR(c,x+2,y,1,5,col);PR(c,x,y+2,5,1,col);PR(c,x+1,y+1,3,3,col)}
function B_back(c,t,f){
  /* カードの 旗（ペナント） */
  const flags=(x0,x1,y0,d,o)=>{sag(x0,x1,y0,d,(x,y)=>P2(c,x,y,'#8a8a9a'));for(let x=x0+2,i=0;x<x1-3;x+=7,i++){const u=(x-x0)/(x1-x0),y=Math.round(y0+d*4*u*(1-u))+1;const col=CC[(i+o)%6];
    PR(c,x,y,5,2,col);PR(c,x+1,y+2,3,2,col);P2(c,x+2,y+4,col);P2(c,x+2,y+1,'#fff')}};
  flags(0,42,12,3,0);flags(110,200,12,4,3);
  /* たての ポスター（ドアと たなの あいだ）: 今月の レア */
  frame(c,34,20,8,30,1);PR(c,35,21,6,28,'#3a2a6a');star(c,36,24,'#ffe066');PR(c,36,32,4,6,'#fffdf6');PR(c,37,33,2,4,'#ff6ad5');for(let i=0;i<3;i++)PR(c,36,41+i*2,4,1,'#9a8ad0');
  if((f>>1)%6===0){P2(c,40,23,'#fff');P2(c,35,29,'#fff')}
  /* 右の かべ: 大きな レアカードの 額 */
  frame(c,177,34,20,22,1);bigCard(c,179,36,16,18,'#ff6ad5','#bfe8ff');star(c,184,38,'#ffd23f');
  if((f>>1)%5===1){P2(c,193,37,'#fff');PR(c,192,38,3,1,'#fff');P2(c,193,39,'#fff')}
  /* まどの 下の コルクボード（お客さんの おすすめ） */
  PR(c,120,48,18,9,'#c89a62');PR(c,121,49,16,7,'#e0b47a');
  [[122,'#5ab4ff',0],[127,'#ff7a8a',1],[132,'#7ad37a',0]].forEach(([x,col,o])=>{PR(c,x,50+o,4,5,'#fff');PR(c,x+1,51+o,2,2,col);P2(c,x+1,50+o,'#e04a4a')});
  /* たなに ねふだ・NEW */
  for(let i=0;i<3;i++){const sy=18+i*13;[0,4,8].forEach(k=>{PR(c,46+k*6,sy+10,4,2,'#fff');P2(c,46+k*6,sy+10,'#e04a4a')})}
  PR(c,44,17,7,3,'#e04a4a');PR(c,45,18,5,1,'#fff');
  /* 天井の スポット */
  [60,80,100].forEach(x=>{PR(c,x,10,3,2,'#3a3a4a');P2(c,x+1,12,'#c8ccd8')})}
function rack(c,f){/* くるくる まわる カードラック */
  const x=144,y=82;PR(c,x+7,y,2,30,'#8a8a9a');PR(c,x+2,y+30,12,2,'#6a6a7a');PR(c,x+4,y-2,8,2,'#3a7ac0');
  for(let r=0;r<3;r++){const yy=y+3+r*9;PR(c,x,yy+6,16,1,'#c8ccd8');for(let k=0;k<3;k++){const o=((f>>2)+k+r)%4;const xx=x+1+k*5+(o===3?1:0);const col=CC[(k*2+r+(f>>3))%6];
    PR(c,xx,yy,4,6,o===3?'#e8eef4':'#fff');PR(c,xx+1,yy+1,2,3,col)}}}
function B_front(c,t,f){rack(c,f)}
function B_lit(c,t){if(t==='day')return;const a=t==='night'?1:.6;
  /* 額を てらす 小さな ライト */
  PR(c,185,31,4,2,'#c8a050');softGlow(c,187,44,13,.26*a);
  PR(c,36,18,4,1,'#c8a050');softGlow(c,38,32,11,.22*a);
  [60,80,100].forEach(x=>{P2(c,x+1,12,'#ffe2a0');softGlow(c,x+1,22,9,.14*a)});
  softGlow(c,152,95,12,.12*a)}

/* ---------- C 海の家らしさ ---------- */
function C_floor(c){PR(c,0,FL,W,HH-FL,'#ecdcbc');for(let y=FL,r=0;y<HH;y+=6,r++){PR(c,0,y+5,W,1,'#d6c09a');for(let x=(r*23)%41;x<W;x+=41)PR(c,x,y,1,5,'#d6c09a')}
  for(let i=0;i<40;i++){P2(c,Math.floor(hash(i)*W),FL+2+Math.floor(hash(i+50)*(HH-FL-3)),'#d8c4a0')}PR(c,0,FL-3,W,3,'#3a7ac0')}
function C_back(c,t,f){
  /* サーフボード（ドアと たなの あいだ） */
  PR(c,36,16,5,40,'#ff9a6a');PR(c,37,15,3,1,'#ff9a6a');PR(c,37,56,3,2,'#ff9a6a');PR(c,38,16,1,40,'#fff');PR(c,36,30,5,2,'#3a7ac0');PR(c,35,16,1,40,'#e07a4a');
  /* ドアの 貝の のれん（風で ゆれる） */
  for(let i=0;i<6;i++){const x=10+i*4,sw=((f>>1)+i)%4===0?1:0;PR(c,x+sw,20,1,6+(i%2)*2,'#c8a878');PR(c,x-1+sw,26+(i%2)*2,3,2,i%3?'#fff4e8':'#ffc8c8')}
  /* まどに ヤシの葉 */
  const pal=(x,y,o)=>{for(let i=0;i<8;i++){PR(c,x+i*o,y+Math.floor(i*i/10),1,2,'#3e9a4a');if(i%2)P2(c,x+i*o,y+2+Math.floor(i*i/10),'#5ab05a')}};
  pal(173,15,-1);pal(173,18,-1);pal(119,15,1);
  /* つるした ガラスの うき（ブイ） */
  [[125,18,'#7ad3c4'],[136,22,'#5ab4ff'],[158,19,'#9fe8a0'],[168,24,'#7ad3c4']].forEach(([x,y,col])=>{PR(c,x+2,10,1,y-10,'#c8a878');PR(c,x,y,5,5,col);PR(c,x+1,y-1,3,1,col);PR(c,x+1,y+5,3,1,col);P2(c,x+1,y+1,'#fff');PR(c,x,y+2,5,1,'#c8a87888')});
  /* 右の かべの あみ・ヒトデ・貝 */
  for(let i=0;i<22;i++){P2(c,177+i,34+Math.floor(i*.9),'#c8a878');P2(c,177+i,54-Math.floor(i*.9),'#c8a878')}
  for(let k=0;k<4;k++)for(let i=0;i<20;i++){P2(c,178+k*5+Math.floor(i/4),34+i,'#d8c09a88')}
  PR(c,181,40,5,1,'#ff8a4a');PR(c,183,38,1,5,'#ff8a4a');P2(c,182,42,'#ff8a4a');P2(c,184,42,'#ff8a4a');
  PR(c,190,46,5,3,'#fff4e8');PR(c,191,45,3,1,'#ffd0c8');P2(c,192,47,'#e8c8b8');
  PR(c,186,50,3,3,'#ffd0e0');P2(c,187,49,'#ffd0e0');
  /* カウンターに ココナツの のみもの */
  PR(c,140,63,6,5,'#8a5a32');PR(c,140,63,6,1,'#fff4e8');PR(c,144,58,1,5,'#ff6a8a');PR(c,141,61,2,2,'#ffcf4a')}
function C_front(c,t,f){
  /* 砂の バケツ・スコップ・ビーチボール */
  PR(c,134,104,10,10,'#ff6a5a');PR(c,133,103,12,2,'#ff8a7a');PR(c,135,105,1,8,'#ffa89a');PR(c,134,114,10,1,'#c04a3a');PR(c,135,100,8,1,'#888');P2(c,134,101,'#888');P2(c,143,101,'#888');PR(c,135,102,8,1,'#e8c86a');
  PR(c,147,98,1,12,'#ffd23f');PR(c,145,109,5,4,'#3a7ac0');
  const bx=155,by=104;PR(c,bx+1,by,8,10,'#fff');PR(c,bx,by+1,10,8,'#fff');PR(c,bx+1,by+1,3,8,'#ff6a5a');PR(c,bx+6,by+1,3,8,'#3a7ac0');PR(c,bx+4,by,2,10,'#ffd23f');P2(c,bx+2,by+2,'#fff');
  PR(c,130,114,40,2,'#e4cfa4')}
function C_lit(c,t){if(t==='day')return;const a=t==='night'?1:.6;
  /* うきの 中に 小さな 灯り（海の ランタン） */
  [[127,20],[138,24],[160,21],[170,26]].forEach(([x,y],i)=>{P2(c,x,y,'#fff6c8');softGlow(c,x,y,6,.2*a,i%2?'180,230,255':'200,255,230')});
  /* ドアの 横の ランタン */
  PR(c,2,30,3,5,'#3a3a4a');PR(c,2,31,3,3,'#ffe2a0');softGlow(c,3,33,11,.28*a)}

/* ---------- D 季節で かわる ---------- */
function petals(c,f,cols,n,box){const [x0,y0,w,h]=box;for(let i=0;i<n;i++){const sp=.6+hash(i)*.6,x=x0+Math.floor((hash(i+9)*w+f*.7*sp+Math.sin((f+i*7)/5)*2)%w),y=y0+Math.floor((hash(i+3)*h+f*sp)%h);P2(c,x,y,cols[i%cols.length])}}
function garland(c,cols,shape){const g=(x0,x1,y0,d,o)=>{sag(x0,x1,y0,d,(x,y)=>P2(c,x,y,'#9a8a7a'));for(let x=x0+2,i=0;x<x1-2;x+=5,i++){const u=(x-x0)/(x1-x0),y=Math.round(y0+d*4*u*(1-u))+1;shape(x,y,cols[(i+o)%cols.length],i)}};g(0,42,12,3,0);g(110,200,12,4,2)}
function D_back(c,t,f,s){
  if(s==='spring'){
    garland(c,['#ffc8d8','#ffffff','#ffb0c8'],(x,y,col)=>{PR(c,x,y,3,3,col);P2(c,x+1,y+1,'#ffe066')});
    /* さくらの 枝の 花びん（カウンター） */
    PR(c,140,60,5,8,'#bfe8ff');PR(c,140,60,5,1,'#e8f6ff');PR(c,142,48,1,12,'#7a5a42');PR(c,139,51,3,1,'#7a5a42');PR(c,143,50,2,1,'#7a5a42');
    [[137,49],[140,46],[143,45],[145,48],[139,53],[144,52]].forEach(([x,y])=>{PR(c,x,y,2,2,'#ffb8cc');P2(c,x,y,'#fff')});
    /* たなの すみに ひよこ */
    PR(c,36,48,5,4,'#ffe066');P2(c,40,49,'#ff9a4a');P2(c,37,49,'#333');
    PR(c,34,40,8,1,'#c8a878');PR(c,35,36,2,4,'#ff9aa8');PR(c,38,37,2,3,'#fff4a8');PR(c,35,41,1,2,'#c8a878');PR(c,40,41,1,2,'#c8a878');
  }
  if(s==='summer'){
    /* ふうりん */
    const sw=(f>>1)%4<2?0:1;PR(c,146,14,1,4,'#888');PR(c,143,18,7,5,'#bfe8ff');PR(c,144,17,5,1,'#bfe8ff');PR(c,144,19,2,2,'#ff6a8a');PR(c,146,23,1,3,'#888');PR(c,145+sw,26,3,6,'#ff9aa8');
    /* うちわ・すいか */
    PR(c,36,28,6,6,'#5ab4ff');PR(c,37,29,4,4,'#fff');PR(c,38,30,2,2,'#ff6a5a');PR(c,38,34,2,8,'#c8a878');
    PR(c,139,64,9,4,'#3a9a4a');PR(c,140,64,7,3,'#ff5a6a');P2(c,142,65,'#222');P2(c,145,65,'#222');
    garland(c,['#ff6a5a','#ffd23f','#5ab4ff','#7ad37a'],(x,y,col,i)=>{PR(c,x,y,4,2,col);PR(c,x+1,y+2,2,1,col)});
    /* うきわを ハイビスカスで */
    PR(c,186,20,3,3,'#ff3a6a');P2(c,187,21,'#ffe066');
  }
  if(s==='autumn'){
    garland(c,['#e8602a','#ffb02a','#c03a2a','#d88a2a'],(x,y,col)=>{PR(c,x,y,3,3,col);P2(c,x+1,y-1,col);P2(c,x-1,y+1,col);P2(c,x+3,y+1,col);P2(c,x+1,y+3,'#7a4a2a')});
    /* どんぐりの かご（カウンター） */
    PR(c,139,64,9,4,'#c8a060');PR(c,139,64,9,1,'#e0c080');[[140,62],[143,61],[145,62]].forEach(([x,y])=>{PR(c,x,y,2,2,'#a86a3a');PR(c,x,y,2,1,'#6a4a2a')});
    /* かべに 紅葉の リース */
    const wx=38,wy=32;for(let a=0;a<12;a++){const x=Math.round(wx+Math.cos(a/12*6.28)*3.5),y=Math.round(wy+Math.sin(a/12*6.28)*3.5);PR(c,x-1,y-1,2,2,['#e8602a','#ffb02a','#c03a2a'][a%3])}PR(c,37,36,3,2,'#c03a2a');
  }
  if(s==='winter'){
    garland(c,['#ffffff','#bfe8ff'],(x,y,col,i)=>{P2(c,x+1,y,col);PR(c,x,y+1,3,1,col);P2(c,x+1,y+2,col);if(i%2)P2(c,x+1,y+1,'#9ac8f0')});
    /* まどの したに 雪 */
    PR(c,118,41,27,3,'#fff');PR(c,147,41,27,3,'#fff');PR(c,8,43,24,3,'#fff');
    /* うきわに マフラー */
    PR(c,181,30,14,3,'#e04a4a');PR(c,189,33,3,6,'#e04a4a');for(let x=182;x<195;x+=3)P2(c,x,31,'#fff');
    /* ココア（湯気） */
    PR(c,140,63,5,5,'#fff');PR(c,145,64,1,2,'#fff');PR(c,141,63,3,1,'#8a5a3a');const st=(f>>1)%3;P2(c,141+st%2,61-st%2,'#ffffffaa');P2(c,142,59-st%2,'#ffffff88');
    /* 手ぶくろ */
    PR(c,35,40,3,5,'#3a7ac0');PR(c,39,40,3,5,'#e04a4a');PR(c,34,38,9,1,'#c8a878');
  }}
function sky2(c,f,s){/* まどの 外で 舞うもの */
  if(s==='spring')petals(c,f,['#ffc8d8','#fff'],10,[118,14,56,28]);
  if(s==='autumn')petals(c,f,['#e8602a','#ffb02a','#c03a2a'],7,[118,14,56,28]);
  if(s==='winter'){petals(c,f,['#fff','#e8f4ff'],16,[118,14,56,28]);petals(c,f+3,['#fff'],6,[8,20,24,24])}}
function D_front(c,t,f,s){
  if(s==='spring'){PR(c,130,107,38,9,'#fff');PR(c,130,107,38,1,'#e8eef4');[[133,'#ff7a8a'],[139,'#ffd23f'],[145,'#c79ad6'],[151,'#ff7a8a'],[157,'#fff4a8'],[163,'#ff9aa8']].forEach(([x,col])=>{PR(c,x+1,101,1,6,'#4a9a4a');PR(c,x,98,3,3,col);P2(c,x+1,97,col);P2(c,x+2,103,'#5ab05a')});
    petals(c,f,['#ffc8d8','#ffe0ea'],8,[60,20,110,70])}
  if(s==='summer'){PR(c,130,107,38,9,'#3a7ac0');PR(c,130,107,38,1,'#5a9ae0');[[135,0],[148,2],[160,1]].forEach(([x,o])=>{PR(c,x+2,92+o,1,15-o,'#4a9a4a');PR(c,x+3,100,2,1,'#5ab05a');PR(c,x,88+o,5,5,'#ffd23f');PR(c,x+1,89+o,3,3,'#8a5a2a');P2(c,x+2,87+o,'#ffd23f');P2(c,x-1,90+o,'#ffd23f');P2(c,x+5,90+o,'#ffd23f');P2(c,x+2,93+o,'#ffd23f')})}
  if(s==='autumn'){/* かぼちゃ */
    const pk=(x,y,w,h)=>{PR(c,x,y+1,w,h-2,'#ff8a2a');PR(c,x+1,y,w-2,h,'#ff8a2a');PR(c,x+Math.floor(w/3),y,1,h,'#e06a1a');PR(c,x+Math.floor(w*2/3),y,1,h,'#e06a1a');PR(c,x+Math.floor(w/2),y-2,2,2,'#6a8a3a');P2(c,x+2,y+1,'#ffb06a')};
    pk(134,104,11,9);pk(146,107,8,7);pk(156,102,10,11);PR(c,132,113,38,2,'#c8a878');
    [[66,108],[100,111],[124,104],[150,96]].forEach(([x,y],i)=>{PR(c,x,y,2,2,['#e8602a','#ffb02a','#c03a2a','#d88a2a'][i]);P2(c,x+2,y+1,'#7a4a2a')})}
  if(s==='winter'){/* 小さな もみの木 */
    const x=146,y=82;PR(c,x+6,y+28,4,4,'#8a5a32');for(let r=0;r<5;r++){const w=4+r*3;PR(c,x+8-w/2,y+4+r*5,w,6,r%2?'#2e7a4a':'#3a8a5a')}star(c,x+6,y-1,'#ffd23f');
    [[x+6,y+10,'#ff6a5a'],[x+10,y+15,'#5ab4ff'],[x+4,y+20,'#ffd23f'],[x+11,y+24,'#ff6a5a'],[x+2,y+27,'#fff'],[x+8,y+21,'#c79ad6']].forEach(([a,b,col])=>P2(c,a,b,col));
    PR(c,140,110,6,5,'#e04a4a');PR(c,142,110,1,5,'#ffd23f');PR(c,162,111,6,4,'#5ab4ff');PR(c,164,111,1,4,'#fff')}}
function D_lit(c,t,f,s){if(t==='day')return;const a=t==='night'?1:.6;
  if(s==='winter'){[[152,92],[156,97],[150,102],[157,106],[148,109]].forEach(([x,y],i)=>{P2(c,x,y,['#ffe2a0','#ffb0a0','#bfe8ff'][i%3]);softGlow(c,x,y,5,.22*a)});softGlow(c,154,82,9,.25*a)}
  if(s==='autumn'){PR(c,149,108,3,2,'#ffe2a0');softGlow(c,150,109,10,.25*a)}
  if(s==='summer'){/* ほたるの ような 小さな ひかり */[[60,70],[120,40],[30,90]].forEach(([x,y],i)=>{if((f+i*3)%6<4){P2(c,x,y,'#e8ffa0');softGlow(c,x,y,4,.25*a,'220,255,160')}})}
  if(s==='spring'){PR(c,141,57,3,3,'#ffe2a0');softGlow(c,142,54,10,.18*a,'255,200,220')}}

/* ================================================================ どの もようか（ミオが ときどき かえる） */
const KEYS=['A','B','C','D'];
const NAME={A:'植物と 灯りの カフェ',B:'カードの ギャラリー',C:'海の家',D:'季節の かざり'};
const SNAME={spring:'春',summer:'夏',autumn:'秋',winter:'冬'};
const season=()=>{const m=new Date().getMonth()+1;return m>=3&&m<=5?'spring':m>=6&&m<=8?'summer':m>=9&&m<=11?'autumn':'winter'};
const DAY=864e5;
let K='A';
/* S = お店の 記録（SHOP.rec()）。 もどり値: いまの もよう と かわったか */
function pick(S){const now=Date.now();let d=S.deco;
  if(!d||!KEYS.includes(d.k)){d=S.deco={k:'A',until:now+2*DAY+Math.random()*2*DAY,seen:0,n:0};K=d.k;return {k:K,changed:false,first:true}}
  if(now>=d.until){const o=KEYS.filter(k=>k!==d.k);d.k=o[Math.random()*o.length|0];d.until=now+2*DAY+Math.random()*2*DAY;d.seen=0;d.n=(d.n||0)+1}
  K=d.k;const changed=!d.seen;d.seen=1;return {k:K,changed:changed&&d.n>0,first:false}}
const X={
 A:{back:A_back,front:A_front,lit:A_lit},
 B:{back:B_back,front:B_front,lit:B_lit},
 C:{floor:C_floor,back:C_back,front:C_front,lit:C_lit},
 D:{back:(c,t,f,s)=>{sky2(c,f,s);D_back(c,t,f,s)},front:D_front,lit:D_lit}};
function back(c,t,f){const x=X[K];if(x.floor)x.floor(c);x.back(c,t,f,season())}
function front(c,t,f){X[K].front(c,t,f,season())}
/* 夜と 夕方: lights() が まどの 空を かきなおすので、 まどに かかる かざりを 少し くらくして 重ねなおしてから 灯りを たす */
const WINS=[[118,14,56,30],[8,20,24,26]],DARK={dusk:'rgba(120,60,90,.22)',night:'rgba(16,22,60,.55)'};
let OC=null;
function lit(c,t,f){if(t==='day')return;const x=X[K],s=season();
  if(!OC){OC=document.createElement('canvas');OC.width=W;OC.height=HH}
  const o=OC.getContext('2d');o.globalCompositeOperation='source-over';o.clearRect(0,0,W,HH);x.back(o,t,f,s);
  o.globalCompositeOperation='source-atop';o.fillStyle=DARK[t];o.fillRect(0,0,W,HH);
  c.save();c.beginPath();WINS.forEach(r=>c.rect(...r));c.clip();if(K==='D')sky2(c,f,s);c.drawImage(OC,0,0);c.restore();
  x.lit(c,t,f,s)}

/* ミオの ひとこと（[英語, 日本語]） */
const NEW={
 A:[["I redecorated! Plants and little lights. Cozy, right?","もようがえ しました！ グリーンと 小さな 灯り。 ほっこり でしょ？"],["New look! I hung a plant by the door.","新しい お店です！ ドアの 横に 植物を つるしました。"]],
 B:[["Gallery style! Look at the rare card poster.","ギャラリー風です！ レアカードの ポスター、 見て！"],["I put up card flags. Very card-shop, right?","カードの 旗を かざりました。 カード屋さんっぽい でしょ？"]],
 C:[["Beach house style! I found these glass floats on the beach.","海の家風です！ この ガラスの うき、 浜辺で ひろったんです。"],["I brought my surfboard. Don't tell anyone!","サーフボード、 持ってきちゃいました。 ないしょですよ！"]],
 spring:[["Spring decorations! The cherry blossoms are here.","春の かざりです！ さくらが 来ましたよ。"]],
 summer:[["Summer style! Listen to the wind chime.","夏の かざりです！ ふうりんの 音、 聞いて。"]],
 autumn:[["Autumn decorations! Pumpkins and red leaves.","秋の かざりです！ かぼちゃと 紅葉。"]],
 winter:[["Winter style! A little tree with lights.","冬の かざりです！ 灯りの ついた 小さな 木。"]]};
const IDLE={
 A:[["I watered the plants this morning.","けさ 植物に 水を あげました。"],["The little lights make me happy.","小さな 灯りを 見ると うれしく なるんです。"],["This plant is growing so fast!","この 植物、 ぐんぐん のびてる！"]],
 B:[["Which card should be on the poster next?","つぎの ポスターは どの カードに しよう？"],["The card rack spins round and round.","カードラックが くるくる 回ってる。"],["A gallery is a room for showing art.","gallery は 作品を 見せる 部屋の こと。"]],
 C:[["I can smell the sea from here.","ここまで 海の においが する。"],["Sand on the floor again… oh well!","また 床に 砂が… まあ いっか！"],["A starfish has five arms.","ヒトデの うでは 5本。"]],
 spring:[["Cherry blossoms are 'sakura' in English too!","さくらは 英語でも sakura で 通じるんです！"],["Spring is a good time to start something new.","春は 何か 始めるのに いい 季節。"]],
 summer:[["The wind chime sounds so cool.","ふうりんの 音、 すずしい〜。"],["Sunflowers always face the sun.","ひまわりは いつも 太陽の ほうを 向くんです。"]],
 autumn:[["Fall is another word for autumn.","fall も 「秋」って いみなんですよ。"],["These pumpkins are heavy!","この かぼちゃ、 おもい！"]],
 winter:[["It's cold, but the shop is warm.","さむいけど、 お店の 中は あったかい。"],["Hot cocoa is the best in winter.","冬は ホットココアが いちばん。"]]};
const pk=a=>a[Math.random()*a.length|0];
const key=()=>K==='D'?season():K;
window.SHDECO={pick,back,front,lit,keys:KEYS,
  cur:()=>K,name:()=>K==='D'?SNAME[season()]+'の かざり':NAME[K],season,
  hello:()=>pk(NEW[key()]),idle:()=>pk(IDLE[key()])};
})();
