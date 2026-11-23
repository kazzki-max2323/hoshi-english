/* ⛏️ 鉱山の ドット絵（11/23 ユーザー「鉱山の 画面 もっと 作りこんで」）
   - 深さで 景色が かわる（ZONES）: 土の 坑道 → 岩の 坑道 → 水晶の 洞くつ → 地底湖 → 溶岩の 道 → 古代の 遺跡 → 星の 底
   - 道（分かれ道）で 色あいが かわる。 鉱夫が つるはしを ふる・岩に ひびが 入る・くだける・火花・水の しずく・たいまつの ゆらぎ
   - DGART.mount(el,{f,path,pet}) で キャンバスを 入れる。 hit()=ふる / crack(n)=ひび(0〜3) / breakRock() / miss()
   - 画面に ないときと スリープ中（document.hidden）は 描かない */
(()=>{
const W=192,Hh=64;
const ZONES=[
 {to:30,n:'土の 坑道',ico:'🟫',sky:['#2a1c12','#4a3220'],wall:'#5a3e26',wall2:'#6e4c2e',rock:['#8a6a48','#6a5038','#a8865a'],deco:'roots',light:'#ffc870'},
 {to:60,n:'岩の 坑道',ico:'🪨',sky:['#1c1c24','#34343e'],wall:'#44444e',wall2:'#56565f',rock:['#7a7a86','#5a5a66','#9a9aa6'],deco:'torch',light:'#ffb050'},
 {to:100,n:'水晶の 洞くつ',ico:'💎',sky:['#1a1030','#2e1e4e'],wall:'#3a2a5a',wall2:'#4a3670',rock:['#6a5a8a','#4e406e','#8a7aaa'],deco:'crystal',light:'#c8a0ff'},
 {to:150,n:'地底湖',ico:'💧',sky:['#0c1a2a','#163048'],wall:'#1e3a52',wall2:'#284a66',rock:['#4a6a82','#3a5468','#6a8aa2'],deco:'lake',light:'#80d0ff'},
 {to:200,n:'溶岩の 道',ico:'🌋',sky:['#2a0c08','#481a10'],wall:'#3a1a14',wall2:'#52241a',rock:['#5a3a32','#42282a','#7a4a3a'],deco:'lava',light:'#ff7a30'},
 {to:300,n:'古代の 遺跡',ico:'🏛️',sky:['#1a1a10','#33301c'],wall:'#4a4430',wall2:'#5e5638',rock:['#8a8060','#6a6248','#aaa078'],deco:'ruin',light:'#ffe28a'},
 {to:1e9,n:'星の 底',ico:'🌌',sky:['#05051a','#101038'],wall:'#16163a',wall2:'#22224e',rock:['#3a3a6a','#2a2a52','#5a5a8a'],deco:'stars',light:'#b8c8ff'}];
const zoneI=f=>{for(let i=0;i<ZONES.length;i++)if(f<=ZONES[i].to)return i;return ZONES.length-1};
const zone=f=>ZONES[zoneI(f)];
const TINT={dark:'#00000070',water:'#2060a030',glow:'#a040ff28',bright:'#ffe0a018',rail:'#80502018',door:'#ffc04020',secret:'#ff802030',vault:'#ffd04030',boss:'#ff000020'};
let S=null,raf=0;
/* 階ごとに きまった でこぼこ（同じ 階なら 同じ 形） */
const rnd=seed=>{let x=seed*9301+49297;return()=>(x=(x*9301+49297)%233280)/233280};
function mount(el,o){if(!el)return;const c=document.createElement('canvas');c.width=W;c.height=Hh;c.className='dgcv';el.prepend(c);
  const r=rnd(o.f*7+3),top=[],bot=[];for(let x=0;x<W;x+=4){top.push(3+r()*7|0);bot.push(3+r()*5|0)}
  const deco=[];for(let i=0;i<9;i++)deco.push({x:r()*W|0,y:r(),s:r()});
  S={c,g:c.getContext('2d'),o,z:zone(o.f),top,bot,deco,t:0,hitT:-99,crack:o.crack||0,broke:-99,miss:-99,parts:[],drips:[],rockN:0};
  if(o.fresh){S.broke=0;setTimeout(()=>burst(16,[...S.z.rock,'#ffe080']),0)}
  cancelAnimationFrame(raf);raf=requestAnimationFrame(loop)}
function loop(ts){if(!S||!S.c.isConnected){S=null;return}raf=requestAnimationFrame(loop);if(document.hidden)return;
  if(S.last&&ts-S.last<45)return;S.last=ts;S.t++;draw()}
const px=(x,y,w,h,col)=>{S.g.fillStyle=col;S.g.fillRect(x|0,y|0,w|0,h|0)};
function draw(){const {g,z,t}=S;
  /* 空（おく）の グラデーション（4段） */
  for(let i=0;i<4;i++){px(0,i*16,W,16,i<2?z.sky[0]:z.sky[1])}
  /* おくの かべの もよう */
  for(let x=0;x<W;x+=12)for(let y=10;y<Hh-10;y+=10){if(((x*7+y*3)%5)===0)px(x+((y/10|0)%2)*6,y,6,3,z.wall)}
  decoBack();
  /* 天井と 床の でこぼこ */
  S.top.forEach((h,i)=>{px(i*4,0,4,h,z.wall2);px(i*4,h,4,1,z.wall)});
  S.bot.forEach((h,i)=>{px(i*4,Hh-h-6,4,h+6,z.wall2);px(i*4,Hh-h-6,4,1,z.rock[2])});
  decoFront();
  rock();miner();pet();
  /* しずく */
  if(t%9===0&&S.drips.length<3)S.drips.push({x:20+Math.random()*(W-40),y:8,v:0});
  S.drips=S.drips.filter(d=>{d.v+=.35;d.y+=d.v;px(d.x,d.y,1,2,'#9fd8ff');return d.y<Hh-8});
  /* 火花・かけら */
  S.parts=S.parts.filter(p=>{p.x+=p.vx;p.y+=p.vy;p.vy+=.25;p.l--;px(p.x,p.y,p.s,p.s,p.c);return p.l>0});
  /* 道の 色あい・まちがえた ときの 赤 */
  const tn=TINT[S.o.path];if(tn)px(0,0,W,Hh,tn);
  if(t-S.miss<4)px(0,0,W,Hh,'#ff304040');
  /* 鉱夫の ライトの 光 */
  const lg=g.createRadialGradient(70,40,4,70,40,70);lg.addColorStop(0,z.light+'30');lg.addColorStop(1,'#0000');g.fillStyle=lg;g.fillRect(0,0,W,Hh)}
function decoBack(){const {z,t,deco}=S;
  if(z.deco==='roots')deco.slice(0,5).forEach(d=>{for(let i=0;i<4+d.s*6;i++)px(d.x+Math.sin(i*.8+d.s*5)*2,6+i*2,1,2,'#7a5a30')});
  if(z.deco==='torch')[30,150].forEach((x,i)=>{px(x,22,2,8,'#5a3a1a');const fl=(t+i*3)%6<3;px(x-1,17,4,5,fl?'#ffb030':'#ff8020');px(x,15+(fl?0:1),2,3,'#ffe080')});
  if(z.deco==='crystal')deco.forEach((d,i)=>{const x=d.x,h=4+d.s*8|0,y=d.y<.5?8:Hh-12-h,gl=(Math.sin(t*.15+i)+1)/2;const col=['#b080ff','#80c0ff','#ff90e0'][i%3];for(let k=0;k<h;k++)px(x+k/3,y+(d.y<.5?k:h-k),Math.max(1,3-k/3),1,col);if(gl>.8)px(x+1,y+(d.y<.5?1:h-2),1,1,'#fff')});
  if(z.deco==='ruin')[24,96,168].forEach((x,i)=>{px(x,10,8,Hh-22,'#6a6248');px(x-2,10,12,3,'#8a8060');px(x-2,Hh-15,12,3,'#8a8060');if(i===1)for(let k=0;k<4;k++)px(x+2,18+k*7,4,2,(t+k*4)%24<12?'#ffe28a':'#a89a68')});
  if(z.deco==='stars')deco.forEach((d,i)=>{const tw=(t+i*5)%20<10;px(d.x,6+d.y*40,1,1,tw?'#fff':'#8890c0');if(i%3===0&&tw)px(d.x-1,6+d.y*40,3,1,'#c8d0ff80')})}
function decoFront(){const {z,t}=S;
  if(z.deco==='lake'){for(let x=0;x<W;x+=2){const y=Hh-9+Math.sin(x*.15+t*.25)*1.2;px(x,y,2,9,'#2a6a9a');if((x+t)%14<2)px(x,y,2,1,'#a8e0ff')}}
  if(z.deco==='lava'){for(let x=0;x<W;x+=2){const y=Hh-6+Math.sin(x*.2+t*.2);const hot=(x*3+t*2)%40<20;px(x,y,2,6,hot?'#ff6a20':'#d0401a');if((x+t*3)%50<1)px(x,y-2,1,1,'#ffd060')}}}
/* 鉱夫（黄色い ヘルメット・ライト）。 hit の あと 4コマ つるはしを ふる */
function miner(){const t=S.t,dt=t-S.hitT,x=64,y=Hh-26,bob=Math.sin(t*.3)>0?0:1;
  px(x+2,y+18,3,4,'#3a3050');px(x+7,y+18,3,4,'#3a3050');           // あし
  px(x+1,y+9+bob,10,9,'#3f6fbf');px(x+1,y+15+bob,10,2,'#2a4a8a');  // ふく
  px(x+3,y+3+bob,7,6,'#f2c8a0');px(x+8,y+5+bob,1,1,'#2a1a10');     // かお
  px(x+2,y+bob,9,4,'#f0c020');px(x+10,y+1+bob,2,2,'#fff8c0');      // ヘルメット・ライト
  /* つるはし: ふだん=かまえ・hit=ふりおろし */
  const sw=dt>=0&&dt<5?[0,1,2,2,1][dt]:0,hx=x+10,hy=y+10+bob;
  const ang=[-1.1,-.3,.6][sw];const ex=hx+Math.cos(ang)*14,ey=hy+Math.sin(ang)*14;
  for(let i=0;i<=10;i++){px(hx+(ex-hx)*i/10,hy+(ey-hy)*i/10,1.5,1.5,'#8a5a2a')}
  px(ex-3,ey-1,7,2,'#c8c8d0');px(ex+3,ey,1,2,'#e8e8f0')}
/* 岩: ひび 0〜3。 くだけると かけらが とんで 新しい 岩が 下から せり上がる */
function rock(){const z=S.z,t=S.t,db=t-S.broke;if(db>=0&&db<6)return;
  const rise=db>=6&&db<12?(12-db)*2:0,shake=t-S.hitT<3?((t%2)?1:-1):0,x=108+shake,y=Hh-34+rise,col=z.rock;
  const sh=[[6,0,18],[2,4,26],[0,8,30],[0,12,30],[1,18,28],[3,24,24]];sh.forEach(([dx,dy,w])=>px(x+dx,y+dy,w,6,col[0]));
  px(x+8,y+2,8,3,col[2]);px(x+4,y+9,4,3,col[2]);px(x+2,y+24,26,3,col[1]);
  /* 宝石の つぶ */
  const gem=['#ff5a7a','#5ad0ff','#7aff8a','#ffd84a'][S.o.f%4];px(x+20,y+12,2,2,gem);if(t%16<8)px(x+20,y+12,1,1,'#fff');
  const c=S.crack;if(c>=1){px(x+14,y+4,1,6,'#201810');px(x+15,y+9,1,4,'#201810')}if(c>=2){px(x+16,y+12,5,1,'#201810');px(x+8,y+14,6,1,'#201810');px(x+20,y+13,1,5,'#201810')}if(c>=3){px(x+6,y+20,8,1,'#201810');px(x+22,y+18,1,7,'#201810');px(x+11,y+15,1,7,'#201810')}}
function pet(){if(!S.o.pet)return;const t=S.t,x=36+(Math.sin(t*.05)*6|0),y=Hh-15,b=(t>>2)%2;
  px(x,y+2,8,5,'#e8a050');px(x+6,y,4,4,'#e8a050');px(x+6,y-1,1,1,'#e8a050');px(x+9,y-1,1,1,'#e8a050');px(x+8,y+1,1,1,'#201810');px(x-2,y+1-b,2,2,'#e8a050');px(x+1,y+7,1,1+b,'#c07a30');px(x+6,y+7,1,2-b,'#c07a30')}
function burst(n,cols,x=118,y=Hh-24){if(!S)return;for(let i=0;i<n;i++)S.parts.push({x,y,vx:(Math.random()-.4)*3,vy:-Math.random()*3-1,l:8+Math.random()*8|0,s:Math.random()<.3?2:1,c:pickC(cols)})}
const pickC=a=>a[Math.random()*a.length|0];
function hit(){if(!S)return;S.hitT=S.t;setTimeout(()=>burst(7,['#ffe080','#fff','#ffb040']),120)}
function crack(n){if(S)S.crack=n}
function breakRock(){if(!S)return;S.broke=S.t;S.crack=0;burst(16,[...S.z.rock,'#ffe080'])}
function miss(){if(S)S.miss=S.t}
function setPet(p){if(S)S.o.pet=p}
window.DGART={mount,hit,crack,breakRock,miss,setPet,zone,zoneI,ZONES};
})();
