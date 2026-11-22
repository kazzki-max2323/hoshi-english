/* 🏠 ミオの へやの 中身（ドット絵と 小物）。 11/22 「もっと 作りこめる？」で 作りこみ。 画面は game/mio-home.js
   - MIOROOM.draw(c,s,f,o): へやを かく。 s = shop/free/sleep/morning（ミオの ようす）、 o = {stg:仲, love:こいびと, gifts:[], seen:{}, hl:光らせる id}
     夜は スタンドの あたたかい 灯り・ 仲が よくなると 写真立て(なかよし)・ 光る ガーランド(たよれる なかま)・ おそろいの マグ(こいびと) が ふえる
     季節と 行事で まどの 外と 右下の かざりが かわる（SHDECO の season/eventNow を つかう）
     21〜24時は いすに すわって 英語の 勉強（23時すぎは ときどき うとうと）、 6〜9時は へやの まん中で 開店じゅんび
   - MIOROOM.hit(x,y,s,o): タップした 物の id
   - MIOROOM.obj(id): {en,ja,ico, ...} 物の 名前と ミオの ことば（いる とき）・ 説明（いない とき）
   - MIOROOM.gifts(): ミオに あげた 物（GIFT.rec().seen.mio の 雑貨と リクの お礼）→ かざりだなに ならぶ */
(()=>{
const W=200,HH=116;
const PR=(c,x,y,w,h,col)=>{c.fillStyle=col;c.fillRect(x,y,w,h)};
const gh=()=>{try{return GH()}catch(e){return new Date().getHours()}};
const season=()=>{try{return SHDECO.season()}catch(e){const m=new Date().getMonth()+1;return m>=3&&m<=5?'spring':m>=6&&m<=8?'summer':m>=9&&m<=11?'autumn':'winter'}};
const evNow=()=>{try{return SHDECO.eventNow()}catch(e){return null}};
/* 行事の かざりが ある もの（ほかの 行事の ときは 季節の かざり） */
const EVD=['newyear','setsubun','valentine','hina','kodomo','tanabata','matsuri','tsukimi','halloween','xmas'];
const deco=()=>{const e=evNow();return e&&EVD.includes(e)?e:season()};

/* ---------- ミオに あげた 物 ---------- */
function gifts(){const out=[];try{const sn=(GIFT.rec().seen||{}).mio||{};
  for(const k in sn){const t=sn[k];if(k.startsWith('z:')){const it=ZAKKA.items.find(i=>i.id===k.slice(2));if(it)out.push({k,ico:it.ico,n:it.n,w:it.w||it.n,t})}
    else if(k.startsWith('t:')&&typeof TUTOR_GIFTS!=='undefined'){const g=TUTOR_GIFTS.find(x=>x[0]===k.slice(2));if(g)out.push({k,ico:g[1],n:g[2],w:g[3],t})}}}catch(e){}
  return out.sort((a,b)=>b.t-a.t)}
const hsh=s=>{let h=0;for(const ch of s)h=(h*31+ch.charCodeAt(0))|0;return Math.abs(h)};

/* ================================================================ うしろ（かべ・家具） */
function back(c,s,f,o){const h=gh(),nt=h>=19||h<5,dusk=h>=17&&h<19,sea=season(),dc=deco();
  /* かべと ゆか */
  PR(c,0,0,W,HH,'#f3e6d0');for(let x=0;x<W;x+=16)PR(c,x,0,1,72,'#ead8bc');PR(c,0,72,W,4,'#d8c4a4');PR(c,0,75,W,1,'#c4ae8c');
  PR(c,0,76,W,40,'#b98a5a');for(let y=76,i=0;y<HH;y+=8,i++){PR(c,0,y,W,1,'#a87a4c');for(let x=(i%2)*20+6;x<W;x+=40)PR(c,x,y+1,1,7,'#a87a4c')}
  /* ✨ ガーランド（たよれる なかま から） */
  if(o.stg>=3){for(let x=0;x<W;x++){PR(c,x,4+Math.round(Math.sin(x/10)*2),1,1,'#8a7a6a')}
    const cols=['#ffd23f','#ff8fa3','#7ad0e8','#9aea8a'];for(let i=0,x=5;x<W;x+=10,i++){const y=5+Math.round(Math.sin(x/10)*2),on=!nt||((f>>2)+i)%4;PR(c,x,y,2,2,on?cols[i%4]:'#9a8a7a')}}
  /* 本だな（左）と 植木 リーフィー */
  PR(c,2,18,24,58,'#8a5a32');PR(c,4,20,20,54,'#5e3a20');
  const BK=['#5ab4ff','#ff8a7a','#ffd23f','#7ac87a','#b48aff','#ff9ab0','#fffdf4','#4a78b0','#e8b84a'];
  [20,34,48].forEach((sy,n)=>{let x=5;for(let i=0;x<23;i++){const w=2+((i+n)%2),hg=8+((i*3+n*2)%5);if(x+w>23)break;PR(c,x,sy+13-hg,w,hg,BK[(i*2+n*3)%9]);PR(c,x,sy+14-hg,w,1,'#fff6');x+=w+(i%3===2?1:0)}PR(c,4,sy+13,20,1,'#8a5a32')});
  PR(c,5,66,8,8,'#e8c86a');PR(c,6,68,6,1,'#a8803a');PR(c,14,65,9,9,'#5ab4ff');PR(c,15,67,7,1,'#2a6fc0');PR(c,17,70,3,2,'#fff');
  PR(c,9,13,8,5,'#c07a4a');PR(c,9,13,8,1,'#a8603a');PR(c,7,8,12,5,'#5aa85a');PR(c,10,4,6,4,'#7ac87a');PR(c,12,2,2,2,'#9ada8a');
  /* コルクボード（英語の メモ） */
  PR(c,28,12,30,22,'#a87a4c');PR(c,29,13,28,20,'#d8a868');
  [[31,15,'#fffdf4'],[40,14,'#fff3a0'],[49,16,'#ffd0dc'],[33,24,'#cfefff'],[43,24,'#fffdf4']].forEach(([x,y,col],i)=>{PR(c,x,y,7,7,col);PR(c,x+1,y+2,5,1,'#8a7a6a');PR(c,x+1,y+4,4,1,'#8a7a6a');PR(c,x+3,y,1,1,['#e04a4a','#3a7ae0','#3aa04a'][i%3])});
  if(o.stg>=2){PR(c,52,25,4,6,'#7ad0e8');PR(c,53,26,2,2,'#ffe0cc')}   // 店長と とった 写真（小さな）
  /* まど（空は 時間と 季節で） */
  PR(c,84,12,40,30,'#8a6a4a');const sky=nt?'#1a2350':dusk?'#f0a070':h<7?'#b8c8f0':'#9fd8ff';PR(c,86,14,36,26,sky);
  if(nt){for(const [sx,sy] of [[90,18],[101,22],[114,17],[118,28],[95,31],[108,33]])if((f+sx)%6)PR(c,sx,sy,1,1,'#fff6c0');PR(c,110,19,5,5,'#fff3b0');PR(c,112,19,3,3,sky)}
  else{PR(c,86,32,36,8,dusk?'#e07a5a':'#4ab0e0');PR(c,86,32,36,1,'#fff8');if(dusk){PR(c,100,27,8,5,'#ffd27a')}else{PR(c,90,18,9,3,'#fff');PR(c,92,17,5,1,'#fff');PR(c,110,22,7,2,'#fff')}}
  if(sea==='winter')for(let i=0;i<7;i++){const sx=87+((i*11+f)%34),sy=15+((i*7+f*2)%24);PR(c,sx,sy,1,1,'#fff')}
  else if(sea==='spring')for(let i=0;i<5;i++){const sx=87+((i*13+f)%34),sy=15+((i*9+f)%24);PR(c,sx,sy,1,1,'#ffb8cc')}
  PR(c,103,14,2,26,'#8a6a4a');PR(c,86,26,36,1,'#8a6a4a');PR(c,82,42,44,2,'#a87a4c');
  const cl=s==='sleep';PR(c,80,11,cl?10:5,33,'#f6a5b5');PR(c,cl?118:123,11,cl?10:5,33,'#f6a5b5');PR(c,80,11,48,2,'#e88aa0');
  if(dc==='autumn')PR(c,118,40,3,2,'#e0702a');if(dc==='kodomo'){PR(c,90,16,12,3,'#e04a4a');PR(c,90,20,10,3,'#3a7ae0');PR(c,102,16,1,8,'#8a6a4a')}
  /* かべ時計（浜辺の 時計と 同じ 時間） */
  PR(c,130,9,10,12,'#8a5a32');PR(c,129,10,12,10,'#8a5a32');PR(c,131,10,8,10,'#fffdf4');PR(c,130,11,10,8,'#fffdf4');
  const cx=135,cy=15,mn=(h%1)*60,ha=((h%12)+mn/60)/12*Math.PI*2,ma=mn/60*Math.PI*2;
  for(let i=1;i<=2;i++)PR(c,cx+Math.round(Math.sin(ha)*i),cy-Math.round(Math.cos(ha)*i),1,1,'#2a1a1a');
  for(let i=1;i<=4;i++)PR(c,cx+Math.round(Math.sin(ma)*i),cy-Math.round(Math.cos(ma)*i),1,1,'#e04a4a');PR(c,cx,cy,1,1,'#2a1a1a');
  /* ポスター（世界地図） */
  PR(c,146,7,22,18,'#fffdf4');PR(c,147,8,20,16,'#7ac0e8');PR(c,149,10,5,4,'#7ac87a');PR(c,150,14,3,5,'#7ac87a');PR(c,156,9,6,5,'#7ac87a');PR(c,158,14,3,3,'#7ac87a');PR(c,163,16,3,3,'#7ac87a');PR(c,152,11,1,1,'#e04a4a');
  /* かざりだな（ミオに あげた 物） */
  PR(c,128,36,44,2,'#8a5a32');PR(c,130,38,2,3,'#7a4a28');PR(c,168,38,2,3,'#7a4a28');
  const G=o.gifts||[];if(!G.length){PR(c,147,31,4,5,'#cfefff');PR(c,148,29,2,2,'#cfefff')}
  G.slice(0,6).forEach((g,i)=>{const x=130+i*7,col=['#ff8a7a','#5ab4ff','#ffd23f','#b48aff','#7ac87a','#ff9ab0','#e8b84a'][hsh(g.k)%7],sh=hsh(g.k+'s')%5;
    if(sh===0){PR(c,x,31,5,5,col);PR(c,x+2,31,1,5,'#fff');PR(c,x,33,5,1,'#fff')}
    else if(sh===1){PR(c,x+1,30,3,1,'#8a6a4a');PR(c,x,31,5,5,col);PR(c,x+1,32,1,2,'#fff8')}
    else if(sh===2){PR(c,x+2,29,1,1,col);PR(c,x+1,30,3,3,col);PR(c,x,31,5,1,col);PR(c,x+1,33,1,3,col);PR(c,x+3,33,1,3,col)}
    else if(sh===3){PR(c,x,30,5,6,'#e8b84a');PR(c,x+1,31,3,4,col)}
    else{PR(c,x+1,32,3,4,'#c07a4a');PR(c,x,29,5,3,col);PR(c,x+2,28,1,1,'#fff')}
    if(g.t>=3&&(f+i*3)%12<2)PR(c,x+4,29,1,1,'#fff')});
  /* 服かけ（バンダナは 店に 出る 時間は 頭の 上） */
  PR(c,127,42,10,1,'#6a4a2a');PR(c,131,42,1,32,'#6a4a2a');PR(c,128,73,8,1,'#6a4a2a');
  PR(c,128,44,7,12,o.love?'#ffb0c0':'#e87a6a');PR(c,131,44,1,12,'#fff6');PR(c,128,56,7,1,'#c85a4a');
  if(s==='sleep'){PR(c,133,58,4,2,'#ffc93c');PR(c,134,60,2,2,'#ffc93c')}
  /* 小さな たなと レコードプレーヤー（まどの 下） */
  PR(c,96,60,28,16,'#c89a6a');PR(c,96,60,28,1,'#dab07a');PR(c,97,67,26,1,'#a87a4c');PR(c,108,63,4,1,'#6a4a2a');PR(c,108,70,4,1,'#6a4a2a');
  PR(c,99,55,16,5,'#5a3a2a');PR(c,101,55,10,3,'#1d1a26');const sp=s==='free'?(f%4):0;PR(c,105,56,2,1,'#ff8a7a');PR(c,102+sp*2,56,1,1,'#666');PR(c,112,54,1,3,'#ccc');
  PR(c,117,52,6,8,'#4a78b0');PR(c,118,54,4,4,'#ffd23f');
  /* ベッドと ぬいぐるみ（あざらしの モモ） */
  PR(c,140,62,54,6,'#fff');PR(c,140,68,54,14,o.love?'#f0a8c0':'#7ab4e8');PR(c,140,68,54,2,o.love?'#f8c8d8':'#9ac8f0');PR(c,140,82,54,3,o.love?'#c87898':'#5a8ac0');PR(c,140,58,6,27,'#a87a4c');PR(c,190,62,4,23,'#a87a4c');
  PR(c,147,60,14,6,'#fffdf4');
  PR(c,177,58,9,5,'#e8eef4');PR(c,176,60,1,3,'#e8eef4');PR(c,186,61,2,2,'#e8eef4');PR(c,179,59,1,1,'#2a1a1a');PR(c,182,59,1,1,'#2a1a1a');PR(c,180,61,2,1,'#ffaab8');
  if(o.love){PR(c,167,59,7,4,'#ffd0dc');PR(c,168,60,1,1,'#2a1a1a');PR(c,171,60,1,1,'#2a1a1a')}   // おそろいの もう1ぴき
  /* ラグと カードの 箱 */
  PR(c,64,90,60,14,'#f0b8c8');PR(c,66,92,56,10,'#f8d0dc');for(let x=68;x<120;x+=6)PR(c,x,96,3,1,'#f0b8c8');
  PR(c,28,86,14,8,'#c8a064');PR(c,28,86,14,1,'#a8804a');PR(c,30,83,3,4,'#5ab4ff');PR(c,34,82,3,5,'#ff8a7a');PR(c,38,84,3,3,'#ffd23f');
  /* いす（つくえの 向こう） */
  PR(c,44,44,20,3,'#8a5a32');PR(c,44,47,2,11,'#8a5a32');PR(c,62,47,2,11,'#8a5a32');PR(c,46,47,16,2,'#e8a0b0')}

/* ================================================================ 前（つくえ・きせつの かざり） */
function front(c,s,f,o){const h=gh(),lamp=s==='free'||(s==='morning'&&h<7),dc=deco();
  /* つくえ（こちら向き） */
  PR(c,30,58,50,3,'#9a6a3a');PR(c,30,58,50,1,'#b88a5a');PR(c,30,61,50,1,'#6a4224');PR(c,31,62,48,14,'#8a5a32');PR(c,58,64,18,6,'#9a6a3a');PR(c,66,66,3,2,'#ffd23f');PR(c,33,64,20,1,'#7a4a28');
  /* スタンド */
  PR(c,34,56,8,2,'#6a5a4a');PR(c,37,48,2,8,'#6a5a4a');PR(c,33,43,9,5,lamp?'#ffe08a':'#d8c49a');PR(c,33,47,9,1,lamp?'#fff4c0':'#c8b48a');
  /* ひらいた 教科書と ノート */
  PR(c,48,55,7,3,'#fffdf4');PR(c,55,55,7,3,'#f4f0e4');PR(c,55,55,1,3,'#c8b89a');PR(c,49,56,4,1,'#8a9ac0');PR(c,56,56,4,1,'#8a9ac0');
  if(s!=='free'){PR(c,44,56,3,2,'#5ab4ff')}
  /* マグ（こいびとなら おそろいで 2つ） */
  PR(c,66,53,4,5,'#ff8a7a');PR(c,70,54,1,2,'#ff8a7a');if(lamp&&f%6<3){PR(c,67,50,1,2,'#fff8');PR(c,68,49,1,2,'#fff8')}
  if(o.love){PR(c,71,54,3,4,'#5ab4ff');PR(c,74,55,1,2,'#5ab4ff')}
  /* 写真立て（なかよし から） */
  if(o.stg>=2){const x=o.love?75:73;PR(c,x,50,5,8,'#e8b84a');PR(c,x+1,51,3,6,'#9fd8ff');PR(c,x+1,53,1,2,'#a8663a');PR(c,x+2,53,1,2,'#2a1a1a');if(o.love)PR(c,x+2,51,1,1,'#ff5a7a')}
  /* きせつ・行事の かざり（右下） */
  const X=172,Y=88;
  if(dc==='xmas'){PR(c,X+8,Y-2,2,2,'#ffd23f');for(let i=0;i<6;i++)PR(c,X+9-i*1.5|0,Y+i*3,3+i*3,3,'#3a8a4a');PR(c,X+8,Y+18,3,4,'#7a4a28');[[X+6,Y+6,'#ff5a5a'],[X+11,Y+10,'#5ab4ff'],[X+5,Y+14,'#ffd23f'],[X+13,Y+15,'#ff8fa3']].forEach(([x,y,col],i)=>PR(c,x,y,1,1,(f+i)%3?col:'#fff'))}
  else if(dc==='halloween'){PR(c,X+2,Y+10,14,10,'#f08a2a');PR(c,X+1,Y+12,16,6,'#f08a2a');PR(c,X+8,Y+7,2,3,'#5a8a3a');PR(c,X+5,Y+13,2,2,'#3a1a0a');PR(c,X+11,Y+13,2,2,'#3a1a0a');PR(c,X+6,Y+17,6,1,'#3a1a0a');if(f%8<4)PR(c,X+5,Y+13,1,1,'#ffe066')}
  else if(dc==='newyear'){PR(c,X+2,Y+16,14,4,'#c8a064');PR(c,X+3,Y+11,12,5,'#fffdf4');PR(c,X+5,Y+7,8,4,'#fffdf4');PR(c,X+7,Y+4,4,3,'#ff9a2a');PR(c,X+9,Y+3,2,1,'#5a8a3a')}
  else if(dc==='tanabata'){PR(c,X+9,Y-6,2,28,'#5aa85a');for(let i=0;i<4;i++)PR(c,X+3+i*4,Y-2+i*4,6,1,'#7ac87a');[[X+4,Y,'#ff8a7a'],[X+13,Y+4,'#ffd23f'],[X+5,Y+8,'#5ab4ff'],[X+14,Y+12,'#b48aff']].forEach(([x,y,col])=>PR(c,x,y,2,4,col))}
  else if(dc==='tsukimi'){PR(c,X+3,Y+18,12,2,'#c8a064');[[X+4,Y+14],[X+8,Y+14],[X+12,Y+14],[X+6,Y+10],[X+10,Y+10],[X+8,Y+6]].forEach(([x,y])=>PR(c,x,y,4,4,'#fffdf4'));PR(c,X+16,Y-4,1,22,'#c8b070');PR(c,X+15,Y-5,3,4,'#e8d8a0')}
  else if(dc==='valentine'){PR(c,X+3,Y+12,12,8,'#c8304a');PR(c,X+8,Y+12,2,8,'#ffd23f');PR(c,X+3,Y+15,12,2,'#ffd23f');PR(c,X+6,Y+9,2,3,'#ffd23f');PR(c,X+10,Y+9,2,3,'#ffd23f')}
  else if(dc==='hina'||dc==='setsubun'||dc==='kodomo'||dc==='matsuri'||dc==='spring'){/* 花びん（さくら） */PR(c,X+6,Y+12,6,8,'#7ac0e8');PR(c,X+7,Y+11,4,1,'#5aa0c8');PR(c,X+8,Y+2,1,9,'#7a5a3a');PR(c,X+5,Y+4,1,6,'#7a5a3a');PR(c,X+12,Y+5,1,6,'#7a5a3a');[[X+6,Y],[X+9,Y+2],[X+3,Y+3],[X+11,Y+3],[X+13,Y+6],[X+4,Y+7]].forEach(([x,y])=>{PR(c,x,y,3,2,'#ffc0d0');PR(c,x+1,y,1,1,'#fff')})}
  else if(dc==='summer'){/* 貝がらの びんと うちわ */PR(c,X+3,Y+10,8,10,'#cfefff');PR(c,X+3,Y+9,8,1,'#a8d8f0');PR(c,X+4,Y+15,2,2,'#ffb8a0');PR(c,X+7,Y+17,3,2,'#fff3c0');PR(c,X+5,Y+18,1,1,'#ff8a7a');PR(c,X+13,Y+6,6,6,'#5ab4ff');PR(c,X+14,Y+7,4,4,'#fff');PR(c,X+15,Y+12,1,8,'#c8a064')}
  else if(dc==='autumn'){/* くりと 落ち葉の かご */PR(c,X+2,Y+14,14,6,'#c8a064');PR(c,X+2,Y+14,14,1,'#a8804a');PR(c,X+4,Y+11,4,3,'#8a4a2a');PR(c,X+9,Y+12,4,3,'#e0702a');PR(c,X+12,Y+10,3,3,'#e8b84a');PR(c,X+6,Y+10,2,1,'#c8a064')}
  else{/* 冬: ゆきだるまと マフラー */PR(c,X+5,Y+12,10,8,'#fffdf4');PR(c,X+6,Y+5,8,7,'#fffdf4');PR(c,X+6,Y+11,8,2,'#e04a4a');PR(c,X+12,Y+12,2,4,'#e04a4a');PR(c,X+8,Y+7,1,1,'#2a1a1a');PR(c,X+11,Y+7,1,1,'#2a1a1a');PR(c,X+9,Y+9,2,1,'#f08a2a');PR(c,X+7,Y+3,6,2,'#3a7ae0')}}

/* ================================================================ ミオ */
function mio(c,s,f){const h=gh();
  if(s==='free'){/* いすに すわって 勉強（足は つくえの 向こう） */
    const late=h>=23||h<1,doze=late&&f%70>52,tap=o=>o&&o.until>Date.now();
    MIO.draw(c,48,36,doze?'doze':tap(mio.talk)?'wave':'stand',f>>1);
    if(!doze&&!tap(mio.talk)){PR(c,60+((f>>1)%3),51,1,4,'#ffd23f');PR(c,60+((f>>1)%3),55,1,1,'#3a2a2a')}
    return}
  if(s==='morning'){MIO.draw(c,90,58,f%30<20?'stand':'cheer',f>>1);return}
  if(s==='sleep'){/* ねている: まくらの 上に 頭、 ふとんが ゆっくり 上下 */
    PR(c,147,58,10,8,'#a8663a');PR(c,149,61,7,5,'#ffe0cc');PR(c,151,63,2,1,'#3a2a2a');PR(c,154,63,2,1,'#3a2a2a');
    const b=(f>>3)%2;PR(c,152,66-b,36,4,'#9ac8f0');c.fillStyle='#cfe3ff';c.font='6px monospace';c.fillText((f>>2)%3?'z':'Z',162,54-((f>>2)%3)*2)}}
mio.talk=null;

/* ================================================================ 光 */
function light(c,s,f,o){const h=gh(),nt=h>=19||h<5,dusk=h>=17&&h<19;
  if(s==='sleep'){c.fillStyle='rgba(10,14,40,.58)';c.fillRect(0,0,W,HH);
    c.fillStyle='rgba(200,220,255,.10)';c.beginPath();c.moveTo(90,42);c.lineTo(122,42);c.lineTo(140,HH);c.lineTo(84,HH);c.closePath();c.fill();return}
  if(dusk){c.fillStyle='rgba(255,140,70,.12)';c.fillRect(0,0,W,HH)}
  if(nt||h<6){c.fillStyle=s==='free'?'rgba(20,20,60,.32)':'rgba(16,18,50,.45)';c.fillRect(0,0,W,HH);
    if(s==='free'||(s==='morning'&&h<7)){const g=c.createRadialGradient(38,50,0,38,50,62);g.addColorStop(0,'rgba(255,206,130,.55)');g.addColorStop(.5,'rgba(255,190,110,.2)');g.addColorStop(1,'rgba(255,190,110,0)');c.fillStyle=g;c.fillRect(0,0,W,HH);PR(c,33,48,9,1,'#fff4c0')}
    if(o.stg>=3){const cols=['#ffd23f','#ff8fa3','#7ad0e8','#9aea8a'];for(let i=0,x=5;x<W;x+=10,i++){if(!(((f>>2)+i)%4))continue;const y=5+Math.round(Math.sin(x/10)*2);c.fillStyle=cols[i%4]+'55';c.fillRect(x-1,y-1,4,4);PR(c,x,y,2,2,cols[i%4])}}}}

/* ================================================================ タップできる 物 */
/* b = [x,y,w,h]（キャンバスの 中）。 上ほど 先に あたる */
const BOX=[
 ['clock',[128,8,14,14]],['poster',[145,6,24,20]],['gifts',[127,26,46,16]],['photo',[72,48,9,11],o=>o.stg>=2],['cork',[27,11,32,24]],['lamp',[32,42,11,16]],
 ['book',[46,53,18,6]],['mug',[64,48,12,11]],['mio',[44,34,22,22],(o,s)=>s==='free'],['mio',[88,56,18,34],(o,s)=>s==='morning'],
 ['plant',[6,1,14,18]],['shelf',[2,18,24,58]],['window',[80,11,48,33]],['rec',[96,51,28,25]],['hanger',[126,41,13,34]],['plush',[164,55,25,10]],
 ['bed',[140,56,56,30]],['deco',[166,80,30,34]],['cards',[27,81,17,14]],['lights',[0,0,200,10],o=>o.stg>=3],['desk',[30,58,50,18]],['rug',[64,88,60,16]]];
function hit(x,y,s,o){for(const [id,b,ok] of BOX){if(ok&&!ok(o,s))continue;if(x>=b[0]&&x<b[0]+b[2]&&y>=b[1]&&y<b[1]+b[3])return id}return null}
const boxOf=(id,s,o)=>{for(const [i,b,ok] of BOX)if(i===id&&(!ok||ok(o,s)))return b;return null};
const ids=o=>[...new Set(BOX.filter(([id,b,ok])=>id!=='mio'&&(!ok||ok(o,'shop'))).map(x=>x[0]))];
/* 光らせる（タップした 物）と まだ 見ていない 物の キラッ */
function marks(c,s,f,o){
  if(o.hl&&o.hl.until>Date.now()){const b=boxOf(o.hl.id,s,o);if(b){c.strokeStyle=f%2?'#fff':'#ffe14a';c.lineWidth=1;c.strokeRect(b[0]+.5,b[1]+.5,b[2]-1,b[3]-1)}}
  if(s==='sleep')return;
  ids(o).forEach((id,i)=>{if(o.seen[id])return;if((f+i*5)%24>2)return;const b=boxOf(id,s,o);if(!b)return;const x=b[0]+b[2]-3,y=b[1]+2;PR(c,x,y-1,1,3,'#fff');PR(c,x-1,y,3,1,'#fff')})}
function draw(c,s,f,o){back(c,s,f,o);mio(c,s,f);front(c,s,f,o);light(c,s,f,o);marks(c,s,f,o)}

/* ================================================================ 物の ことば
   L: ミオが いる ときの ことば（tier: friend/close/love。 なければ friend）、 n: いない ときの 説明 */
const O={
 clock:{ico:'🕰️',en:'clock',ja:'かべ時計'},
 window:{ico:'🪟',en:'window',ja:'まど'},
 gifts:{ico:'🎁',en:'display shelf',ja:'かざりだな'},
 cork:{ico:'📌',en:'corkboard',ja:'コルクボード'},
 shelf:{ico:'📚',en:'bookshelf',ja:'本だな'},
 book:{ico:'📖',en:'textbook',ja:'教科書と ノート',
  L:{friend:[["I'm reading about the present perfect. \"I have been to Tokyo.\" …I haven't, actually.","いま 現在完了を 勉強中。 I have been to Tokyo。 …ほんとは 行ったこと ないけど。"],
    ["My teacher says, \"Read it out loud three times.\" So… I'm whispering it three times.","先生が 「3回 声に 出して 読みなさい」って。 だから… 小声で 3回。"],
    ["New words today: \"receipt,\" \"refund,\" \"exchange.\" All shop words! I know them already. Ha ha.","きょうの 新しい 単語: receipt・refund・exchange。 ぜんぶ お店の ことば！ もう 知ってる。 あはは。"]],
   close:[["Can you check my homework? …Be gentle. Red pen makes me sad.","宿題 見てもらえます？ …やさしくね。 赤ペン、 かなしく なるので。"]],
   love:[["I wrote \"we\" in my example sentence, not \"I.\" …Did you notice? \"We run a shop by the sea.\"","例文に 「I」じゃなくて 「we」って 書いたの。 …気づいた？ We run a shop by the sea.（わたしたちは 海辺で お店を やっている）"]]},
  n:'ひらいた ままの 教科書。 ノートに 「receipt = レシート」と 3回 書いてある。'},
 lamp:{ico:'💡',en:'desk lamp',ja:'スタンド',
  L:{friend:[["This lamp is my study buddy. When it's on, my brain is on.","この スタンドは 勉強の あいぼう。 これが つくと、 頭も オンに なるんです。"],["Warm light is good for night study. White light makes me feel like I'm at school.","夜の 勉強は あったかい 光が いいの。 白い 光だと 学校に いる 気分に なっちゃう。"]],
   love:[["When I see your shadow next to mine under this lamp… I study better. Weird, right?","この 灯りの 下で わたしの かげの となりに 店長の かげが あると… はかどるの。 へんでしょ？"]]},
  n:'あたたかい 色の スタンド。 夜に なると ここだけ ぽっと 明るく なる。'},
 mug:{ico:'☕',en:'mug',ja:'マグカップ',
  L:{friend:[["Hot cocoa. In English, \"cocoa,\" not \"kokoa.\" The first \"o\" is long: co-coa.","ホットココア。 英語では cocoa。 さいしょの o を のばして コウコウ。"],["This mug says \"World's Okayest Student.\" Okayest! It's a joke word. My friend gave it to me.","この マグ、 World's Okayest Student（世界一 まあまあな 学生）って 書いてあるの。 okayest は じょうだんの ことば。 友だちに もらいました。"]],
   love:[["The blue one is yours. Nobody else uses it. …Nobody.","青いのは 店長の。 ほかの 人は つかわない。 …だれも。"]]},
  n:'赤い マグカップ。 底に ココアの あとが ちょっと のこっている。'},
 photo:{ico:'🖼️',en:'photo frame',ja:'写真立て',
  L:{friend:[["That's the day the shop got its new sign. You look so serious! Ha ha.","お店に 新しい 看板が ついた 日の 写真。 店長、 まじめな 顔！ あはは。"]],
   close:[["I put it where I can see it when I study. It helps me keep going.","勉強してる とき 見える ところに 置いてるの。 がんばれるから。"]],
   love:[["I changed the photo. This one is from our day at the beach. …Don't look too closely. My eyes are closed.","写真、 かえたの。 ふたりで 浜辺に 行った 日の。 …あんまり 見ないで。 わたし 目 つぶってるから。"]]},
  n:'お店の 前で とった 写真。 ミオと 店長が ならんで わらっている。'},
 plant:{ico:'🪴',en:'plant',ja:'植木',
  L:{friend:[["This is Leafy. Say hi! …In English, plants \"grow,\" and I \"grow\" too. Slowly.","この子は リーフィー。 あいさつして！ …英語で 植物は grow（そだつ）。 わたしも grow 中。 ゆっくり。"],["I talk to Leafy in English. It never laughs at my mistakes.","リーフィーには 英語で 話しかけるの。 まちがえても ぜったい 笑わないから。"]],
   close:[["Leafy got a new leaf! I think it likes it when you visit.","リーフィーに 新しい 葉っぱ！ 店長が 来ると うれしいのかも。"]]},
  n:'本だなの 上の 小さな 植木。 鉢に 「Leafy」と 書いてある。'},
 rec:{ico:'💿',en:'record player',ja:'レコードプレーヤー',
  L:{friend:[["I play slow songs when I study. Fast songs make me sing, and then I stop studying.","勉強の ときは ゆっくりの 曲。 速い 曲だと 歌っちゃって 勉強が とまるの。"],["English songs are great teachers. I learned \"gonna\" and \"wanna\" from songs, not from school!","英語の 歌は いい 先生。 gonna と wanna は 学校じゃなくて 歌で 覚えました！"]],
   love:[["This record… it's the song from our first date. I play it when I miss you. Even if you're downstairs.","この レコード… はじめての デートの 曲。 さみしいと かけるの。 店長が 下に いても。"]]},
  n:'レコードプレーヤー。 となりに 古い 英語の 歌の レコードが 立てかけてある。'},
 hanger:{ico:'🧥',en:'clothes rack',ja:'服かけ',
  L:{friend:[["My cardigan and my bandana live here. The bandana is my \"work switch.\" On = work mode!","カーディガンと バンダナの おうち。 バンダナは 「仕事スイッチ」。 つけたら 仕事モード！"],["In English, this is a \"hanger\" and this is a \"rack.\" Hang, hanger… easy!","英語で これは hanger（ハンガー）、 これは rack。 hang（かける）から hanger… かんたん！"]],
   love:[["The pink cardigan? I bought it because you said pink looks good on me. …Don't make that face.","ピンクの カーディガン？ 店長が ピンク にあうって 言ったから 買ったの。 …そんな 顔しないで。"]]},
  n:'服かけ。 カーディガンが かかっている。 バンダナは ミオと いっしょに お店へ。'},
 plush:{ico:'🦭',en:'stuffed seal',ja:'あざらしの ぬいぐるみ',
  L:{friend:[["This is Momo! A seal. In English, \"seal\" is also a stamp. Momo is a cute stamp.","モモです！ あざらし。 英語の seal は ハンコの 意味も ある。 モモは かわいい ハンコ。"],["Momo listens to me practice. Momo's English is perfect. Momo never says anything wrong.","モモは わたしの 練習を 聞いてくれるの。 モモの 英語は 完ぺき。 まちがった こと 一度も 言わないもん。"]],
   love:[["Momo has a friend now. Pink one. …You won it for me at the festival, remember?","モモに おともだちが できたの。 ピンクの。 …お祭りで 店長が とってくれたの、 覚えてる？"]]},
  n:'まくらの となりに あざらしの ぬいぐるみ。 名前は 「モモ」らしい。'},
 bed:{ico:'🛏️',en:'bed',ja:'ベッド',
  L:{friend:[["My bed is my best friend. Every morning we have a long fight. The bed usually wins.","ベッドは 大親友。 毎朝 長い たたかいが あるの。 たいてい ベッドの 勝ち。"],["\"Make the bed\" means ベッドを ととのえる. Not 作る! I learned that the hard way.","make the bed は 「ベッドを ととのえる」。 作るじゃ ないの！ まちがえて 覚えました。"]]},
  n:'ふわふわの ベッド。 ちゃんと make the bed（ととのえて）ある。'},
 cards:{ico:'🃏',en:'card box',ja:'カードの 箱',
  L:{friend:[["My own card collection. The first card I ever got was \"umbrella.\" I don't know why I love it so much.","わたしの カード。 さいしょに 手に 入れたのは umbrella。 なんで こんなに 好きなのか わからない。"],["I keep cards with hard words here. I look at one before bed. It's like a lullaby.","むずかしい 単語の カードは ここ。 ねる前に 1まい 見るの。 子もり歌みたいに。"]],
   close:[["I put a card you finished in here. …Is that OK? It reminds me of you working hard.","店長が 仕上げた カードも 1まい 入れてるの。 …いい？ がんばってる 店長を 思い出すから。"]]},
  n:'カードが ぎっしりの 箱。 いちばん 上は umbrella（かさ）の カード。'},
 desk:{ico:'🪑',en:'desk',ja:'つくえ',
  L:{friend:[["I found this desk at Nora-san's shop. It was \"secondhand,\" which means 中古. It has lots of stories.","この つくえ、 ノラさんの お店で 見つけたの。 secondhand（中古）。 お話が いっぱい つまってる。"]]},
  n:'つくえと いす。 引き出しに 「ENGLISH ONLY!」の シール。'},
 rug:{ico:'🧶',en:'rug',ja:'ラグ',
  L:{friend:[["A \"rug\" is small, a \"carpet\" is big. This one is a rug. A cozy rug.","rug は 小さいの、 carpet は 大きいの。 これは rug。 ふかふかの rug。"]]},
  n:'ピンクの ラグ。 ふかふか。'},
 lights:{ico:'✨',en:'string lights',ja:'ガーランド',
  L:{friend:[["I put these up after our shop did well. In English, \"string lights\" or \"fairy lights.\" Fairy! Cute, right?","お店が うまく いったから かざったの。 英語で string lights とか fairy lights。 fairy（ようせい）！ かわいいでしょ？"]],
   love:[["At night they blink like stars. …Like the night on the roof.","夜に なると 星みたいに 光るの。 …屋根の 上の 夜みたいに。"]]},
  n:'かべに ちいさな 電球の ガーランド。 夜は ぽつぽつ 光る。'},
 poster:{ico:'🗺️',en:'world map',ja:'世界地図の ポスター',
  L:{friend:[["The red dot is London. Someday I want to go there and say, \"A cup of tea, please.\"","赤い 点は ロンドン。 いつか 行って 「A cup of tea, please.」って 言いたいの。"],["English is spoken in so many countries! Look: here, here, and here. It's like a key to the world.","英語って こんなに たくさんの 国で 話されてるの！ ここも、 ここも。 世界の カギみたい。"]],
   love:[["I drew a tiny heart next to London. …For our honeymoon. Kidding! …Half kidding.","ロンドンの となりに 小さな ハート かいちゃった。 …新婚旅行用。 うそ！ …半分 うそ。"]]},
  n:'世界地図の ポスター。 ロンドンに 赤い しるし。'},
 deco:{ico:'🎐',en:'',ja:''},
 mio:{ico:'',en:'Mio',ja:'ミオ'}};

/* ---------- その場で かわる もの ---------- */
const NUM=['twelve','one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve'];
function clockLine(){const h=gh(),hh=Math.floor(h),mm=Math.floor((h%1)*60),r=Math.round(mm/5)*5%60,H12=NUM[(hh+(mm>=58?1:0))%12],J=`${hh}時${mm?mm+'分':''}`;
  const en=r===0?`It's ${H12} o'clock.`:r===30?`It's ${NUM[hh%12]} thirty.`:r===15?`It's a quarter past ${NUM[hh%12]}.`:r===45?`It's a quarter to ${NUM[(hh+1)%12]}.`:`It's ${NUM[hh%12]} ${['','five','ten','fifteen','twenty','twenty-five','thirty','thirty-five','forty','forty-five','fifty','fifty-five'][r/5]}.`;
  const tip=r===15||r===45?'（a quarter ＝ 4分の1 ＝ 15分）':r===30?'（〜thirty ＝ 〜時半）':r===0?"（o'clock ＝ ちょうど）":'';
  return [en,`いまは だいたい ${J}。${tip}`]}
function windowLine(s){const h=gh(),sea=season(),nt=h>=19||h<5;
  const A=nt?[["Look, the moon! In English, a round moon is \"a full moon.\" Half is \"a half moon.\"","見て、 月！ まるい 月は full moon、 半分は half moon。"],["The sea is so quiet at night. Listen… shh… \"Shh\" is the same in English!","夜の 海、 しずか。 聞いて… しーっ… 「Shh」は 英語でも 同じ！"]]
   :h<17?[["Nice weather! \"It's sunny\" — sunny, from \"sun.\" Easy!","いい 天気！ It's sunny。 sun から sunny。 かんたん！"],["I can see the beach from here. Sometimes I watch you walking there. …Not in a creepy way!","ここから 浜辺が 見えるの。 ときどき 店長が 歩いてるの 見えるよ。 …へんな 意味じゃなく！"]]
   :[["Sunset! In English, \"The sun is setting.\" The sky is orange… no, \"peach.\"","夕日！ 英語で The sun is setting.（日が しずんでいく）。 空は オレンジ… ううん、 peach（もも色）。"]];
  const S={winter:["Snow! \"It's snowing.\" The beach looks like a cake.","雪！ It's snowing。 浜辺が ケーキみたい。"],spring:["Cherry petals are flying in. \"Petal\" means 花びら. Pretty word, right?","さくらの 花びらが とんでくる。 petal ＝ 花びら。 きれいな ことばでしょ？"],summer:["Summer sea! \"The sea is sparkling.\" Sparkle, sparkle!","夏の 海！ The sea is sparkling.（きらきら 光ってる）"],autumn:["A red leaf on the windowsill. \"Leaf\" — and two are \"leaves.\" F becomes V!","まどに 赤い 葉っぱ。 leaf、 2まいだと leaves。 f が v に なるの！"]};
  return Math.random()<.35?S[sea]:A[Math.random()*A.length|0]}
const DECO={
 xmas:['🎄','Christmas tree','クリスマスツリー',["I decorated a tiny tree. \"Merry Christmas\" — \"merry\" means たのしい. Old but nice word.","小さな ツリーを かざったの。 Merry Christmas の merry は 「たのしい」。 古いけど いい ことば。"]],
 halloween:['🎃','jack-o\'-lantern','ジャック・オー・ランタン',["I carved a pumpkin! It's called a \"jack-o'-lantern.\" Trick or treat!","かぼちゃ ほったの！ jack-o'-lantern って 言うの。 Trick or treat!"]],
 newyear:['🍊','kagami mochi','かがみもち',["Happy New Year! In English, we make \"New Year's resolutions.\" Mine: 100 new words!","あけまして おめでとう！ 英語では New Year's resolution（新年の 目標）を 立てるの。 わたしのは 新しい 単語 100こ！"]],
 tanabata:['🎋','bamboo with wishes','七夕の ささ',["I wrote my wish in English: \"I wish I could speak English like a native.\" Big wish!","ねがいごと、 英語で 書いたよ。 I wish I could speak English like a native. 大きな ねがい！"]],
 tsukimi:['🍡','moon-viewing dumplings','お月見だんご',["Moon-viewing dumplings! There's no word for 月見 in English. \"Moon viewing\" is the closest.","お月見だんご！ 月見に ぴったりの 英語は ないの。 moon viewing が いちばん 近いかな。"]],
 valentine:['🍫','chocolate box','チョコの 箱',["Chocolate for… everyone at the shop! Friends' chocolate. In English, \"friend chocolate\" isn't a thing. Ha ha.","お店の みんなに チョコ！ 友チョコ。 英語には friend chocolate って ことばは ないの。 あはは。"]],
 spring:['🌸','cherry blossoms','さくらの 花びん',["Cherry blossoms in a vase. In English, \"blossom\" is a flower on a tree. Pretty, right?","花びんに さくら。 blossom は 木に さく 花の こと。 きれいでしょ？"]],
 summer:['🐚','shell jar','貝がらの びん',["Shells from the beach. \"She sells seashells by the seashore.\" Try saying it fast!","浜辺の 貝がら。 She sells seashells by the seashore. 速く 言ってみて！"]],
 autumn:['🌰','basket of chestnuts','くりの かご',["Chestnuts! In English, \"chestnut.\" Chest + nut. Funny, right? Autumn is \"fall\" in American English.","くり！ chestnut。 chest（むね）＋ nut。 おもしろいでしょ？ 秋は アメリカ英語で fall。"]],
 winter:['⛄','snowman','ゆきだるま',["A tiny snowman! I gave him my old scarf. \"Snowman\" — snow plus man. English is sometimes easy!","小さな ゆきだるま！ 古い マフラー あげたの。 snow ＋ man。 英語って ときどき かんたん！"]]};
const decoInfo=()=>{const d=DECO[deco()]||DECO[season()];return {ico:d[0],en:d[1],ja:d[2],L:{friend:[d[3]]},n:`${d[2]}が かざってある。 ミオの 季節の かざり。`}};
const BOOKS=[["English Grammar in 30 Days","30日で 英文法"],["The Little Card Shop","小さな カード屋さん（英語の 絵本）"],["1000 Words for the Sea","海の 英単語 1000"],["How to Talk to Customers","お客さんとの 話し方"],["Mystery at the Lighthouse","とうだいの なぞ（英語の 小説）"],["Easy English Cooking","かんたん 英語で 料理"],["Phrasal Verbs Are Friends","句動詞は ともだち"],["My First English Diary","はじめての 英語日記"]];
const MEMOS=[["\"Take your time\" = ゆっくりで いいよ. Say it to slow customers.","Take your time ＝ ゆっくりで いいよ。 まよっている お客さんに。"],["\"Could you…?\" is softer than \"Can you…?\"","Could you…? は Can you…? より やわらかい。"],["a few = 少し ある / few = ほとんど ない. The \"a\" is hope!","a few ＝ 少し ある、 few ＝ ほとんど ない。 a は 希望！"],["\"I'm on it!\" = まかせて！ すぐ やります！","I'm on it! ＝ まかせて！ すぐ やります！"],["Don't say \"I'm boring\" when you mean \"I'm bored\"! (たいくつな 人 ≠ たいくつしている)","I'm boring（わたしは たいくつな 人）じゃなくて I'm bored（たいくつ）！"],["\"See you later\" — even if it's tomorrow. OK!","See you later は あしたでも OK！"],["Shop words: receipt / change / bag / total","お店の ことば: receipt（レシート）・change（おつり）・bag・total（合計）"],["\"It's on the house\" = サービスです（ただ）","It's on the house ＝ サービスです（お店の おごり）"],["Goal: talk to 3 customers in English today!","目標: きょう お客さん 3人と 英語で 話す！"],["\"How's it going?\" = 調子 どう？ Answer: \"Not bad!\"","How's it going? ＝ 調子 どう？ 答えは Not bad!"],["Practice: th = 舌を 歯に ちょっと はさむ. think, thank, three!","練習: th は 舌を 歯で かるく はさむ。 think・thank・three！"],["I can do it! (I can't do it… yet.)","わたしは できる！（まだ できない… だけ）"]];
const LOVE_MEMO=["\"You mean a lot to me.\" …Practice only! Not for anyone. Really.","You mean a lot to me.（あなたは わたしに とって 大切）…練習だけ！ だれにでも ないの。 ほんと。"];

/* いまの 物の じょうほう */
function obj(id,s,o){const t=o.love?'love':o.stg>=2?'close':'friend',pk=a=>a[Math.random()*a.length|0];
  const b=id==='deco'?decoInfo():O[id];if(!b)return null;const r={id,ico:b.ico,en:b.en,ja:b.ja,n:b.n||''};
  const pool=b.L?[...(b.L.friend||[]),...(t!=='friend'&&b.L.close||[]),...(t==='love'&&b.L.love||[])]:[];
  /* ほしい ときは ミオらしい ことばを（いない ときは 説明） */
  if(id==='clock'){r.line=clockLine();r.n=`かべ時計。 ${r.line[1]}`}
  else if(id==='window'){r.line=windowLine(s);r.n=s==='sleep'?'カーテンの すきまから 月の 光。':'まどから 浜辺と 海が 見える。'}
  else if(id==='shelf'){const bk=pk(BOOKS);r.book=bk;r.line=pk([[`This one is "${bk[0]}." It's my favorite right now!`,`これは 「${bk[1]}」。 いま いちばん お気に入り！`],[`Want to borrow "${bk[0]}"? Bring it back by Sunday, OK?`,`「${bk[1]}」、 かりてく？ 日曜までに かえしてね？`],["I buy one English book every month. I read half of them. …Maybe a third.","毎月 英語の 本を 1さつ 買うの。 半分は 読んでる。 …3分の1かも。"]]);r.n=`英語の 本が ぎっしり。 1さつ 手に とると… 「${bk[1]}」（${bk[0]}）。`}
  else if(id==='cork'){const ms=[];const pool2=MEMOS.slice();while(ms.length<3&&pool2.length)ms.push(pool2.splice(Math.random()*pool2.length|0,1)[0]);if(t==='love'&&Math.random()<.4)ms[2]=LOVE_MEMO;r.memos=ms;
    r.line=pk([["These are my English memos. One a day! If I forget, I write two the next day.","わたしの 英語メモ。 1日 1まい！ わすれたら つぎの 日 2まい。"],["Read them if you want. …Not the one in the corner. That one is secret.","読んで いいよ。 …すみっこのは だめ。 ひみつ。"]]);r.n='コルクボードに ミオの 英語メモが ぴっしり。'}
  else if(id==='gifts'){const G=o.gifts||[];r.list=G;
    r.line=!G.length?["This shelf is for special things. It's empty now… Hint, hint.","この たなは とくべつな 物 用。 いまは からっぽ… ヒント、 ヒント。"]
     :G.length<3?["Your presents are here! I dust them every morning.","店長からの プレゼント、 ここに かざってるの！ 毎朝 ほこりを はらってます。"]
     :t==='love'?["The shelf is full of you. …I mean, full of your presents! Same thing.","たなが 店長で いっぱい。 …じゃなくて、 プレゼントで いっぱい！ 同じ ことか。"]:["Look how many! I might need a bigger shelf.","こんなに たくさん！ もっと 大きい たなが いるかも。"];
    r.n=G.length?`ミオの かざりだな。 店長が あげた 物が ${G.length}こ ならんでいる。`:'ミオの かざりだな。 まだ からっぽ。 🎁 プレゼントすると ここに かざられる。'}
  else r.line=pool.length?pk(pool):null;
  return r}
/* かざりだなの 品に ついて */
function giftLine(g,love){const w=g.w,n=g.n;
  return g.t>=3?(love?[`The ${w}. I look at it every night before I sleep. …It's my treasure.`,`${n}。 毎晩 ねる前に 見てるの。 …宝物。`]:[`The ${w}! It's my treasure. Thank you, really.`,`${n}！ わたしの 宝物。 ほんとうに ありがとう。`])
   :g.t===2?[`I put the ${w} here so I can see it when I study.`,`${n}は 勉強中に 見える ところに 置いてるの。`]
   :g.t===1?[`The ${w} makes my shelf a little brighter.`,`${n}で たなが ちょっと 明るく なったよ。`]
   :[`The ${w}… I kept it! It's the thought that counts. (気持ちが 大事)`,`${n}… ちゃんと とってあるよ！ 気持ちが 大事、 だもん。`]}

window.MIOROOM={W,HH,draw,hit,obj,gifts,giftLine,ids,mioTalk:o=>{mio.talk=o}};
})();
