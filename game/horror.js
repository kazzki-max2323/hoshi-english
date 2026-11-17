/* 🌙 深夜の ホラーイベント（中身は game/horror-data.js）
   - 浜辺の 時計で 0:00〜3:59 が 深夜。 2:00〜2:29 は 丑三つ時（the witching hour）
   - 🃏 カードショップの カウンター: 深夜に 立っていると、 1〜2分に 1回 店内で ふしぎな ことが 起きる（ドット絵）。
     「🫣 ようすを 見る」で ミオとの 長い 会話へ（こわい・ドキドキ・うんちく・おもしろ）。 その あいだ お客は 来ない
   - ⛏️ 鉱山: 深夜は ほるたびに 少し、 🕯️ ろうそくを つかうと もっと、 ふしぎな できごとに 会う
   - 🛒 道具（ながれぎ雑貨店の ⛏️ たなで 英語で 買う。 MINE_TOOLS に 足す）:
       🧿 お守り＝ 鉱山の こわい 結果を 1回 ふせぐ・お店の 会話で かざせる ／ 🕯️ ろうそく＝ 鉱山で つかう・お店で 夜に ともす ／ 📷 使いきりカメラ＝ 会話の あとで 心霊写真を 1まい
   - 🌙 深夜の きろく（カードショップの 入口）: 見た 会話の もう一度・ミナ先生の 夜の 話・鉱山の できごと・写真・夜の 英語うんちく
   - 背景の 帯の お知らせは 出さない（お店の 中は 下の 文字と ふきだしだけ）
   記録は CG.rec().hr = {seen, mine, sg, ph, n} ・ 会話の エンドは ミオの 記録（MIOC.rec().ends）に */
(()=>{
const {S:ST,sfx:SFX}=BEACH;
const H=HE,esc=H.esc,$=id=>document.getElementById(id);
const pickL=a=>a[Math.random()*a.length|0];
const sf=k=>{try{SFX[k]&&SFX[k]()}catch(e){}};
const ML=(k,v)=>{try{return MINA.line(k,v||{})}catch(e){return ['smile','']}};
const GH=()=>((ST.gameMin||0)/60)%24;
const deep=()=>GH()<4;
const ushi=()=>{const h=GH();return h>=2&&h<2.5};
const night=()=>{try{return SCENE.dark()>.6}catch(e){return false}};
const REC=()=>{const r=CG.rec();return r.hr||(r.hr={seen:{},mine:{},sg:{},ph:[],n:0})};
const save=()=>{try{CG.save()}catch(e){}};
const today=()=>{try{return CG.today()}catch(e){return new Date().toDateString()}};
const W=()=>{try{return WED.who()}catch(e){return null}};
const mioSt=()=>{try{return MIOC.stage()}catch(e){return 0}};
const mioOk=()=>{try{return !MIOC.rec().alt&&W()!=='mina'}catch(e){return true}};
const lvSt=()=>{try{return LOVE.rec().st||0}catch(e){return 0}};
const tN=id=>{try{return MINE.toolN(id)}catch(e){return 0}};
const minaBox=(k,v)=>{const [ex,tx]=ML(k,v);return tx?`<div class="kmina"><span class="lface">${MINA.face('m',ex)}</span><p>${tx}</p></div>`:''};
const hhmm=()=>{const m=Math.floor(ST.gameMin||0);return (m/60|0)+':'+String(m%60).padStart(2,'0')};

/* ================================================================ 🛒 道具（雑貨屋の ⛏️ たな） */
Object.assign(MINE_TOOLS,{
 charm:{lv:'es',ico:'🧿',n:'お守り',en:'lucky charm',p:40,ef:'charm',auto:1,hr:1,v:1,s:'深夜の こわい ことを 1回 ふせぐ',
  d:["This is a lucky charm. It keeps scary things away at night.","これは お守り。 夜の こわい ものを 遠ざけて くれるの。"],
  q:["Does it really work?","ほんとに きくの？","Pip has one on his perch. Pip has never seen a ghost!","ピップの とまり木にも 1つ ついてるの。 ピップは おばけを 見たこと ないわ！"],
  f:["Can it help me on my test?","テストにも きく？","It keeps ghosts away. Not bad grades!","おばけは 遠ざけるわ。 わるい 点数は むりよ！","Study! Study!"],
  e:["Keep it with you after midnight.","夜中の 12時を すぎたら もっていてね。"]},
 candle:{lv:'jh',ico:'🕯️',n:'ろうそく',en:'candle',p:30,ef:'candle',hr:1,v:10,s:'鉱山で 10回 ふしぎな ことが 起きやすい・お店で 夜に ともせる',
  d:["This is a white candle. People say strange things happen around its flame.","これは 白い ろうそく。 炎の まわりで ふしぎな ことが 起きるって 言われてるの。"],
  q:["What kind of strange things?","どんな ふしぎな こと？","Light it in the mine, or in the shop at night, and you'll see. I'd rather not say.","鉱山か、 夜の お店で ともせば わかるわ。 わたしの 口からは ちょっとね。"],
  f:["Can I put it on a birthday cake?","誕生日ケーキに さしても いい？","You could… but I wouldn't make a wish on it.","さしても いいけど… これで 願いごとは しないほうが いいわ。","Spooky! Spooky!"],
  e:["Don't blow it out alone. Just a feeling.","ひとりで ふき消さないでね。 なんとなくよ。"]},
 camera:{lv:'hs',ico:'📷',n:'使いきりカメラ',en:'disposable camera',p:60,ef:'camera',auto:1,hr:1,v:1,s:'深夜の お店の できごとの あとに 1まい 写真を とる',
  d:["This is a disposable camera. One shot only. Take it to the card shop late at night and see what turns up in the picture.","これは 使いきりカメラ。 1まいだけ とれるの。 夜おそくに カードショップへ もっていって、 写真に なにが うつるか 見てごらんなさい。"],
  q:["Will I really catch a ghost on film?","ほんとに おばけが うつるの？","Sometimes you get a ghost. Sometimes you get a blurry photo of Mio. Both are precious.","おばけが うつる ときも あるし、 ブレた ミオちゃんが うつる ときも ある。 どっちも 宝物よ。"],
  f:["Can I take a selfie with a ghost?","おばけと 自撮り できる？","Only if the ghost agrees. Ask nicely.","おばけが いいって 言ったらね。 ていねいに たのんで。"],
  x:["My grandfather took a photo in this shop forty years ago. There was a man in a hat behind him who wasn't there when he took it.","わたしの 祖父が 40年前、 この 店で 写真を とったの。 うしろに 帽子の 男の人が うつってた。 とった ときは いなかったのに。"],
  e:["One shot. Make it count.","1まい だけよ。 だいじに ね。"]}});
if(typeof UNK_ZAKKA!=='undefined')Object.assign(UNK_ZAKKA,{
 'to:charm':["In Japan, people usually take an old omamori back to the shrine after about a year and get a new one. Throwing one in the trash is thought to be bad luck.","日本では お守りは 1年くらいで 神社に かえして、 新しいのを うけるのが ふつう。 ごみ箱に すてるのは えんぎが わるいと 言われているの。"],
 'to:candle':["Before clocks were common, some people used candle clocks: candles marked with lines, each line burning for about one hour.","時計が ふつうに なる 前は、 ろうそく時計を 使う 人も いたの。 線が ひいてあって、 1本ぶん もえると だいたい 1時間。"],
 'to:camera':["Fujifilm's \"Utsurundesu,\" first sold in 1986, made disposable cameras popular around the world. In English it was called the QuickSnap.","1986年に 発売された 富士フイルムの 「写ルンです」が、 使いきりカメラを 世界中に 広めたの。 英語では QuickSnap って よばれたわ。"]});
const has=k=>tN(k)>0;
const use=k=>{try{return MINE.takeTool(k)}catch(e){return false}};

/* お守りを かざす 答え（もっている ときだけ 出る） */
(()=>{const T=id=>HR_TALKS.find(t=>t.id===id);
 const mr=T('hr_mirror');if(mr){mr.nodes.three.o.push(["(Hold up the lucky charm.)","（お守りを かざす）",'charm',3,'charm']);
  mr.nodes.charm={m:["(The charm glows softly. In the glass, the third person bows… and fades away.) …It worked! Boss, where did you get that?! Nora's shop? I'm buying ten.","（お守りが ぼうっと 光る。 ガラスの 中の 3人目が おじぎして… すうっと 消えた） …きいた！ 店長、 それ どこで？！ ノラさんの お店？ 10こ 買う。"],ex:'laugh',
   nt:[["It worked!","「きいた！・うまく いった！」"]],end:'good'}}
 const dl=T('hr_doll');if(dl){dl.nodes.a.o.push(["(Hold up the lucky charm.)","（お守りを かざす）",'charmd',3,'charm']);
  dl.nodes.charmd={m:["(The charm glows warm. The doll's face softens… and it slowly turns toward the cape.) …She wants to go home. I'll take her to the shrine tomorrow. Promise.","（お守りが あたたかく 光る。 人形の 顔が やわらいで… ゆっくり 岬の ほうを 向いた） …おうちに 帰りたいんだね。 あした ほこらに つれていくね。 約束。"],ex:'smile',end:'good'}}
 const ph=T('hr_phone');if(ph){ph.nodes.c.o.push(["(Hold up the lucky charm.)","（お守りを かざす）",'charmp',3,'charm']);
  ph.nodes.charmp={m:["(The charm glows. Behind you, something squawks and flaps away through the window.) …Was that a ghost or a bird? …Either way, your charm works on both!","（お守りが 光る。 うしろで なにかが ギャッと 鳴いて、 窓から バタバタ 出ていった） …いまの おばけ？ 鳥？ …どっちにしても、 お守り 両方に きくんだね！"],ex:'laugh',end:'fun'}}})();

/* ================================================================ 会話（mio-chat.js の 画面を つかう） */
const CATN=HR_CAT;
function deco(t,mina){if(t._d)return t;t._d=1;t.who=mina?'mina':'hr';t.mk='hr_end_'+t.cat;t.okL='もどる';
  t.fin=(n,k,newEnd,pts)=>{const R=REC();if(!R.seen[t.id]){R.seen[t.id]=today();R.n++}save();
    let h='';if(!mina&&newEnd){try{const x=MIOC.gain(Math.max(1,Math.round(pts/2)),'talk');if(x)h+=`<p class="zkheart">${x}</p>`}catch(e){}}
    try{RECENT.add('mio',{id:t.id,end:k,kind:n.end,how:'horror'})}catch(e){}
    h+=minaBox(t.mk);
    if(!mina&&t.ph&&has('camera'))h+=`<button class="hrcam" id="hrcam">📷 写真を とる <small>使いきりカメラ のこり ${tN('camera')}</small></button><div id="hrpic"></div>`;
    return h};
  t.bind=box=>{const b=box&&box.querySelector('#hrcam');if(b)b.onclick=()=>{if(!use('camera'))return;b.remove();photo(t,box.querySelector('#hrpic'))}};
  return t}
HR_TALKS.forEach(t=>deco(t,false));HR_MINA.forEach(t=>deco(t,true));
const shopOk=t=>(!t.dk||mioOk())&&t.st<=mioSt();
const minaOk=t=>!t.dk||(W()!=='mio'&&lvSt()>=Math.max(1,t.st));
const endsOf=t=>Object.keys(t.nodes).filter(k=>t.nodes[k].end);
const gotN=t=>{let E={};try{E=MIOC.rec().ends}catch(e){}return endsOf(t).filter(k=>E[t.id+':'+k]).length};

/* 📷 心霊写真: 6わりで なにか うつる */
function photo(t,box){const R=REC(),ok=Math.random()<.6;R.ph.push({id:t.id,ok:ok?1:0,d:today()});if(R.ph.length>60)R.ph.shift();save();
  sf('pickup');try{FX.flash&&FX.flash(.8)}catch(e){}
  if(box)box.innerHTML=photoCard({id:t.id,ok})+minaBox(ok?'hr_photoOk':'hr_photoNo');}
function photoCard(p){const t=HR_TALKS.find(x=>x.id===p.id);if(!t||!t.ph)return '';
  return `<div class="hrpho ${p.ok?'ok':'no'}"><div class="hrpimg"><span>${p.ok?t.ph[0]:'🌫️'}</span>${p.ok?'<i>👻</i>':''}</div><b>${esc(p.ok?t.ph[1]:'Just a blur.')}</b><small>${esc(p.ok?t.ph[2]:'ブレて なにも うつってない… すみに 白い もや？')}</small></div>`}

/* ================================================================ 🔊 夜の 音（scene.js の tone / noise） */
const snd={
 drone:()=>{try{tone(55,2.4,'sine',.05,0,49);tone(82,2,'sine',.025,.2,78)}catch(e){}},
 chime:()=>{try{[0,1.3].forEach(d=>{tone(196,1.8,'sine',.06,d,194);tone(392,1.2,'sine',.02,d,390)})}catch(e){}},
 ring:()=>{try{[0,1.1].forEach(b=>{for(let i=0;i<6;i++)tone(1250,.06,'square',.012,b+i*.08)})}catch(e){}},
 creak:()=>{try{tone(170,.6,'sawtooth',.012,0,110);tone(140,.5,'sawtooth',.01,.7,95)}catch(e){}},
 hiss:()=>{try{noise(1.4,{v:.03,f:3200,q:2,attack:.4})}catch(e){}},
 off:()=>{try{tone(90,.25,'square',.03,0,40)}catch(e){}},
 tap:()=>{sf('knock');setTimeout(()=>sf('knock'),500)}};
const SGSND={flicker:'off',window:'drone',ghostin:'creak',phone:'ring',doll:'drone',cardfall:'card',bell:'chime',yawn:'',sheet:'hiss',blackout:'off',steps:'creak',doze:'',knock:'tap',candle:'drone',cat:'',whisper:'hiss',record:'drone'};
const play=k=>{if(!k)return;snd[k]?snd[k]():sf(k)};

/* ================================================================ 🃏 カウンター */
function open(T,again){const now=Date.now();
  if(again){endSign(T,1)}else{T.hr=null;T.hrNext=now+15000+Math.random()*15000}
  const row=document.querySelector('.shcrow');
  if(row&&night()&&has('candle')&&!$('hrcdl')){row.insertAdjacentHTML('beforeend','<button id="hrcdl" class="sub">🕯️ ともす</button>');
    $('hrcdl').onclick=()=>{if(T.hr||T.g){H.toast(T.g?'いまは お客さんが いるよ':'いまは それどころじゃ ない…');return}
      const t=HR_TALKS.find(x=>x.cdl);if(!use('candle'))return;$('hrcdl').remove();start(T,'candle',t)}}}
function choose(){const L=HR_TALKS.filter(t=>!t.cdl&&shopOk(t)),R=REC(),seenN=Object.keys(R.seen).length;
  const ok=L.filter(t=>!t.ushi||ushi()||(seenN>=6&&Math.random()<.35));
  const fresh=ok.filter(t=>!R.seen[t.id]);
  if(ushi()){const u=fresh.find(t=>t.ushi);if(u)return u}
  if(!fresh.length&&Math.random()<.35)return null;   // ぜんぶ 見たら ときどき 会話の ない できごと
  if(fresh.length&&Math.random()<.12)return null;
  return pickL(fresh.length?fresh:ok)}
function step(T,now){
  if(T.hr){const e=T.hr;
    if(e.ask&&!$('hrgo'))return endSign(T),false;     // ほかの ことで 下の 画面が かわった
    if(now>=e.until){if(e.t&&!e.ask)ask(T);else if(!e.t||now>=e.until)endSign(T)}
    return !!T.hr}
  if(!deep()||now<(T.hrNext||0))return false;
  if(T.talk&&!T.talk.done){T.hrNext=now+8000;return false}
  const box=$('shact');if(box&&box.innerHTML.trim()){T.hrNext=now+6000;return false}
  const t=choose();start(T,t?t.sg:pickL(HR_AMBIENT),t);return true}
function start(T,k,t){const S=HR_SIGNS[k],now=Date.now();if(!S)return;
  T.hr={k,t,t0:now,until:now+(t?4200:5200),ask:0,parts:[]};
  const R=REC();R.sg[k]=(R.sg[k]||0)+1;save();
  play(SGSND[k]);if(k==='bell')setTimeout(()=>play('chime'),2600);
  T.status&&T.status(S.st);
  const m=T.mio;
  if(k==='sheet'||k==='ghostin'){T.hrSp={x:14,y:k==='sheet'?34:30};if(k==='sheet'){T.hrMx=m.x;m.walk=null;m.x=-60;m.pose='stand';m.until=now+6e4}}
  if(k==='doze'||k==='yawn'){m.walk=null;m.pose='doze';m.until=now+(k==='doze'?3800:5200)}
  else if(k!=='sheet'){m.pose='stand';m.until=now+5000}
  if(k==='cardfall')for(let i=0;i<9;i++)T.hr.parts.push({x:46+Math.random()*60,y:20+Math.random()*28,vy:.4+Math.random()*.8,c:['#ff6a5a','#3a7ac0','#ffcf4a','#5ab05a','#c06ad0'][i%5]});
  if(T.mu){T.mu.q=[];T.mu.next=now+40000}
  setTimeout(()=>{if(!T.alive||!T.hr||T.hr.k!==k)return;if(T.mu)T.mu.until=0;
    if(S.g)SHOP.mut(T,'h',S.g,3000,1);
    if(S.m){if(S.g&&T.mu)T.mu.until=0;if(k==='doze'){m.pose='stand';m.until=Date.now()+4000}SHOP.mut(T,'m',S.m,3200,1)}},k==='doze'?1800:900)}
/* 「ようすを 見る」 */
function ask(T){const e=T.hr,box=$('shact');if(!box||!e)return;e.ask=1;e.until=Date.now()+25000;const S=HR_SIGNS[e.k],c=CATN[e.t.cat];
  box.innerHTML=`<div class="hrask"><p><span>${S.ico}</span>${REC().seen[e.t.id]?`${esc(e.t.t)} <small>${c[0]} もう一度</small>`:'…いまの、 なに？'}</p><div class="row"><button id="hrgo">🫣 ようすを 見る</button><button id="hrno" class="sub">気に しない</button></div></div>`;
  $('hrgo').onclick=()=>{sf('step');const t=e.t;restore(T);box.innerHTML='';SHOP.pause();MIOC.play(t,()=>SHOP.counter(true))};
  $('hrno').onclick=()=>{sf('back');endSign(T)}}
function restore(T){if(T.hrMx!=null){T.mio.x=T.hrMx;T.hrMx=null;T.mio.until=0}T.hrSp=null}
function endSign(T,quiet){const e=T.hr;restore(T);T.hr=null;T.hrNext=Date.now()+60000+Math.random()*60000;
  const box=$('shact');if(box&&box.querySelector('.hrask'))box.innerHTML='';
  if(e&&!quiet){T.status&&T.status('…しずかに なった。 お客さんを まとう');if(Math.random()<.6)SHOP.mut(T,'m',pickL(PHEW),2800,1)}}
const PHEW=[["…Phew. Let's pretend that didn't happen.","…ふう。 なかった ことに しよう。"],["Is it over? …I think it's over.","おわった？ …おわった よね。"],["I'm not scared. My hands are just cold.","こわくないよ。 手が つめたい だけ。"],["Boss, stay close tonight, OK?","店長、 今夜は そばに いてね？"]];

/* ---------------------------------------------------------------- ドット絵 */
const PR=(c,x,y,w,h,col)=>{c.fillStyle=col;c.fillRect(Math.round(x),Math.round(y),w,h)};
function glow(c,x,y,r,col,a){const g=c.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,`rgba(${col},${a})`);g.addColorStop(1,`rgba(${col},0)`);c.fillStyle=g;c.fillRect(x-r,y-r,r*2,r*2)}
function ghostMan(c,x,y,f){const b=Math.round(Math.sin(f/3)*1.5);y+=b;c.save();c.globalAlpha=.55+.15*Math.sin(f/5);
  glow(c,x+7,y+14,18,'170,200,255',.35);
  PR(c,x+3,y+11,8,13,'#b8c8e8');PR(c,x+6,y+11,2,9,'#e8f0ff');PR(c,x+4,y+24,6,3,'#b8c8e8');PR(c,x+5,y+27,4,2,'#b8c8e8');
  PR(c,x+1,y+12,2,8,'#a8b8d8');PR(c,x+11,y+12,2,8,'#a8b8d8');
  PR(c,x+3,y+2,8,8,'#e8f0ff');PR(c,x+5,y+5,1,2,'#2a3050');PR(c,x+8,y+5,1,2,'#2a3050');PR(c,x+6,y+8,2,1,'#8090b0');
  PR(c,x+1,y+1,12,2,'#3a4058');PR(c,x+4,y-4,6,5,'#3a4058');PR(c,x+4,y-1,6,1,'#7a6a9a');
  c.restore()}
function sheetGhost(c,x,y,f){const b=Math.round(Math.sin(f/2));y+=b;
  PR(c,x+3,y,8,2,'#fff');PR(c,x+1,y+2,12,4,'#fff');PR(c,x,y+6,14,20,'#fff');
  for(let i=0;i<14;i+=4)PR(c,x+i,y+26,2,2,'#fff');PR(c,x+2,y+26,2,1,'#eee');
  PR(c,x+4,y+8,2,3,'#222');PR(c,x+8,y+8,2,3,'#222');PR(c,x+5,y+14,4,2,'#333');
  PR(c,x+1,y+11,1,8,'#e4e4ee');
  PR(c,x+3,y+28,3,2,'#e05050');PR(c,x+8,y+28,3,2,'#e05050')}   // スニーカー（ミオの）
function doll(c,x,y,f){PR(c,x,y+5,7,7,'#c02030');PR(c,x+1,y+6,5,1,'#ffcf4a');PR(c,x+1,y,5,5,'#f6e6da');PR(c,x,y-1,7,2,'#111');PR(c,x,y,1,4,'#111');PR(c,x+6,y,1,4,'#111');
  const bl=(f%40)<2;PR(c,x+2,y+2,1,bl?0:1,'#111');PR(c,x+4,y+2,1,bl?0:1,'#111');PR(c,x+3,y+4,1,1,'#c03030')}
function draw(c,T,t){const e=T.hr;if(!e)return;const f=T.f,el=Date.now()-e.t0,k=e.k;
  if(k==='flicker'){if(el<3800){if((f*7+3)%5<2){c.fillStyle='rgba(0,0,10,.78)';c.fillRect(0,0,200,116)}}else{c.fillStyle='rgba(0,0,20,.25)';c.fillRect(0,0,200,116)}}
  if(k==='window'&&el<4200&&(f%9)>1){c.save();c.globalAlpha=Math.min(1,el/900)*.85;glow(c,154,27,10,'220,235,255',.35);PR(c,150,21,8,10,'#e6eef4');PR(c,151,20,6,1,'#e6eef4');PR(c,151,24,2,2,'#111');PR(c,155,24,2,2,'#111');PR(c,153,28,2,1,'#333');PR(c,149,22,1,9,'#222');PR(c,158,22,1,9,'#222');c.restore()}
  if(k==='ghostin'||k==='sheet'){const p=T.hrSp;if(p){const tx=k==='sheet'?124:104,ty=k==='sheet'?40:48;if(Math.abs(p.x-tx)>1)p.x+=Math.sign(tx-p.x)*1.4;if(Math.abs(p.y-ty)>1)p.y+=Math.sign(ty-p.y)*1;
    k==='sheet'?sheetGhost(c,p.x,p.y,f):ghostMan(c,p.x,p.y,f)}}
  if(k==='phone'){const sh=el<4000&&(f%4<2)?1:0;PR(c,165+sh,59,9,5,'#2a2a2a');PR(c,164+sh,57,11,2,'#3a3a3a');PR(c,167+sh,60,5,2,'#7a7a7a');if(el<4000&&f%6<3){c.fillStyle='#ffe2a0';c.font='bold 7px monospace';c.fillText('♪',176,56)}}
  if(k==='doll')doll(c,99,14,f);
  if(k==='cardfall')e.parts.forEach(p=>{if(p.y<58){p.y+=p.vy;p.x+=Math.sin((p.y+p.x)/4)*.5}PR(c,p.x,p.y,4,5,'#fff');PR(c,p.x+1,p.y+1,2,3,p.c)});
  if(k==='bell'){const ph=el%2600;if(ph<500){c.fillStyle=`rgba(0,0,30,${.35*(1-ph/500)})`;c.fillRect(0,0,200,116)}}
  if(k==='blackout'){c.fillStyle=`rgba(0,0,6,${el<300?.6:.9})`;c.fillRect(0,0,200,116);glow(c,146,29,22,'150,170,255',.18);
    if(el>1500){PR(c,T.mio.x+5,T.mio.y+5,1,1,'#fff');PR(c,T.mio.x+9,T.mio.y+5,1,1,'#fff')}}
  if(k==='steps'){const sx=(el/18)%220-10;if(f%3===0)e.parts.push({x:sx+Math.random()*4,y:0,vy:.6+Math.random()*.6});e.parts=e.parts.filter(p=>p.y<60);e.parts.forEach(p=>{p.y+=p.vy;PR(c,p.x,p.y,1,1,'#b8a890')})}
  if(k==='knock'){const n=Math.min(5,Math.floor(el/700));for(let i=0;i<n;i++){const hx=121+i*10+(i%2)*2,hy=24+(i%2)*6;c.save();c.globalAlpha=.55;PR(c,hx,hy,4,4,'#e8eef8');for(let j=0;j<4;j++)PR(c,hx+j,hy-3,1,3,'#e8eef8');PR(c,hx-1,hy+1,1,2,'#e8eef8');c.restore()}}
  if(k==='candle'){c.fillStyle='rgba(0,0,12,.45)';c.fillRect(0,0,200,116);const fl=(f%4<2)?1:0;glow(c,174,52,26+fl*2,'255,190,110',.45);PR(c,172,55,4,7,'#fff6e0');PR(c,173,52-fl,2,3,'#ffd060');PR(c,173,51-fl,1,1,'#fff2b0')}
  if(k==='cat'&&el<5000){const bl=(f%25)<2;if(!bl){PR(c,16,37,2,1,'#ffe060');PR(c,22,37,2,1,'#ffe060');glow(c,20,37,6,'255,230,100',.25)}}
  if(k==='whisper'){c.fillStyle=`rgba(160,190,255,${.08+.05*Math.sin(f/3)})`;c.fillRect(0,0,200,116)}
  if(k==='record'&&el<5000){PR(c,173,97,2,1,'#7aff9a');if(f%5<3){c.fillStyle='rgba(190,215,255,.85)';c.font='bold 7px monospace';c.fillText('♪',180,84-(el/200)%14)}}}

/* ================================================================ ⛏️ 鉱山 */
function mine(D,api){const cd=D.fx&&D.fx.candle>0;if(cd)D.fx.candle--;
  let p=deep()?.03:0;if(cd)p=Math.max(p,.09);
  if(!p||Math.random()>=p)return null;
  const R=REC(),fresh=HR_MINE.filter(x=>!R.mine[x.id]),E=pickL(fresh.length&&Math.random()<.75?fresh:HR_MINE);
  R.mine[E.id]=(R.mine[E.id]||0)+1;save();
  D.pop={ico:E.ico,t:0,big:1};api.fly(E.ico,'big');play('drone');
  setTimeout(()=>{if(D.alive)mineOv(D,api,E)},900);return true}
function mineOv(D,api,E){const o=CG.ov(`<div class="hrmn"><p class="hrmh">🌙 ${E.ico} ${esc(E.n)}</p>
    <div class="hrml"><span class="hrfc">${E.f}</span><div><p class="en">${esc(E.m[0])} <button class="ksay" data-s>🔊</button></p><p class="ja">${esc(E.m[1])}</p></div></div>
    <div class="hrmo">${E.o.map((x,i)=>`<button data-i="${i}">${esc(x[0])}<small>${esc(x[1])}</small></button>`).join('')}</div></div>`,'by hrov');
  o.dataset.stay=1;const say=en=>{try{H.say('hs',en)}catch(e){}};say(E.m[0]);
  o.querySelector('[data-s]').onclick=()=>say(E.m[0]);
  o.querySelectorAll('[data-i]').forEach(b=>b.onclick=()=>{sf('tap');const x=E.o[+b.dataset.i],r=x[2],got=[];let rep=r.r,charm=false;
    if(r.bad&&has('charm')&&use('charm')){charm=true;D.used.push('🧿');D.coins+=10;got.push('🧿 お守りが 光って、 こわい ものは 消えた！ +10枚');rep=["(Your lucky charm glows. Whatever it was… it's gone.)","（お守りが ぼうっと 光った。 なにかは… もう いない）"]}
    else{if(r.coin){D.coins+=r.coin;got.push(`🪙 +${r.coin}枚`)}
      if(r.deep){D.depth+=r.deep;api.burst();got.push(`⛏️ ${r.deep}m 進んだ`)}
      if(r.luck){D.luck+=r.luck;got.push('✨ しばらく 宝石が 出やすい')}
      if(r.back){D.depth=Math.max(0,D.depth-r.back);got.push(`↩️ ${r.back}m もどった`)}
      if(r.hp){D.hp=Math.max(1,D.hp-r.hp);api.keepHp(D.hp);got.push(`❤ -${r.hp}`)}
      if(r.tool){api.addTool(r.tool);const T=MINE_TOOLS[r.tool];got.push(`${T.ico} ${T.n}`)}}
    D.events.push({ico:E.ico,n:E.n,t:rep[1]});api.gotTag(E.ico,E.n,r.coin&&!charm?`+${r.coin}枚`:'');
    if(r.bad&&!charm)sf('wrong');else sf('coinIn');
    try{RECENT.add('mine',{kind:'horror',id:E.id,ico:E.ico,n:E.n})}catch(e){}
    o.querySelector('.hrmo').outerHTML=`<p class="hryou">⭐ ${esc(x[0])}</p>
      <div class="hrml"><span class="hrfc">${charm?'🧿':E.f}</span><div><p class="en">${esc(rep[0])}</p><p class="ja">${esc(rep[1])}</p></div></div>
      ${got.length?`<div class="hrgot">${got.map(g=>`<span>${esc(g)}</span>`).join('')}</div>`:''}
      ${E.nt?`<div class="hrnt"><b>💌 ことばメモ</b>${E.nt.map(n=>`<p><b>${esc(n[0])}</b> ${esc(n[1])}</p>`).join('')}</div>`:''}
      ${minaBox(charm?'hr_charm':r.bad?'hr_mineBad':'hr_mine')}
      <button class="big" id="hrgoon">⛏️ つづきを ほる</button>`;
    say(rep[0]);
    o.querySelector('#hrgoon').onclick=()=>{sf('step');CG.closeOv();api.hud();api.next()}})}

/* ================================================================ 🌙 深夜の きろく（カードショップの 入口から） */
const seenN=()=>Object.keys(REC().seen).length;
const allN=()=>HR_TALKS.length+HR_MINA.length;
function frontBtn(){if(!deep()&&!seenN()&&!Object.keys(REC().mine).length)return '';
  return `<button id="hrbk" class="shbgm sub hrfront"><span>🌙</span><b>深夜の きろく</b><small>${deep()?(ushi()?'いま 丑三つ時…':'いま 深夜…'):`${seenN()} / ${allN()}`}</small></button>`}
function frontBind(back){const b=$('hrbk');if(b)b.onclick=()=>{sf('book');book(back)}}
function hint(t){if(t.cdl)return '🕯️ ろうそくを ともすと';if(t.ushi)return '🕑 丑三つ時（2:00〜2:29）に';if(t.dk&&!mioOk())return '';if(t.st>mioSt())return '♥ ミオと もっと なかよく なると';return '🌙 深夜の カウンターで'}
function book(back){back=back||(()=>SHOP.open());try{speechSynthesis.cancel()}catch(e){}
  const R=REC(),M=HR_MINA.filter(minaOk),canM=night()||deep();
  const li=(t,mina)=>{const s=R.seen[t.id],c=CATN[t.cat],e=endsOf(t),n=gotN(t);
    if(s||mina&&canM)return `<button data-k="${t.id}"><span>${t.ico}</span><b>${esc(t.t)}<small>${c[0]} ${c[1]}</small></b><i>${n>=e.length?'★':`${n}/${e.length}`}</i>${s?'':'<u>NEW</u>'}</button>`;
    const h=mina?'🌙 夜（20時〜）に なると':hint(t);if(!h)return '';
    return `<button disabled><span>？</span><b>？？？<small>${h}</small></b><i></i></button>`};
  const shop=HR_TALKS.filter(t=>!t.dk||mioOk()),ms=HR_MINE.filter(x=>R.mine[x.id]);
  const unl=Math.min(HR_UNK.length,2+seenN()+Object.keys(R.mine).length);
  const tools=['charm','candle','camera'].map(id=>Object.assign({id},MINE_TOOLS[id]));
  H.show('cg',`<section class="pnl cgp shp hrbook">
    <div class="qtop"><button class="x" id="hrbx" aria-label="もどる">←</button><b>🌙 深夜の きろく</b><span class="qn">${seenN()}/${allN()}</span></div>
    ${minaBox(deep()?(ushi()?'hr_bookUshi':'hr_bookNow'):'hr_book',{t:hhmm()})}
    <p class="hrnow">${deep()?`🕐 いま ${hhmm()} ・ <b>${ushi()?'丑三つ時':'深夜'}</b>。 カウンターで なにか 起きるかも…`:`🕐 いま ${hhmm()} ・ 浜辺の 時計で <b>0:00〜3:59</b> が 深夜（2:00〜2:29 は 丑三つ時）`}</p>
    ${deep()?'<button class="big" id="hrctr">🧑‍💼 カウンターに 立つ</button>':''}
    <p class="mchd">🃏 お店の できごと</p>
    <div class="mcls hrls">${shop.map(t=>li(t,false)).join('')}</div>
    <p class="mchd">👩‍🏫 ミナ先生の 夜の 話</p>
    <div class="mcls hrls">${M.map(t=>li(t,true)).join('')}</div>
    <details class="mfold"><summary>⛏️ 鉱山の できごと <small>${ms.length}/${HR_MINE.length}</small></summary><div class="hrmine">${HR_MINE.map(x=>R.mine[x.id]?`<span title="${esc(x.n)}">${x.ico} ${esc(x.n)}</span>`:'<span class="no">？ ？？？</span>').join('')}</div><p class="note">深夜に 鉱山で ほると たまに。 🕯️ ろうそくで 出やすく なるよ</p></details>
    <details class="mfold"><summary>📷 心霊写真 <small>${R.ph.length}まい</small></summary>${R.ph.length?`<div class="hrphs">${R.ph.slice().reverse().map(photoCard).join('')}</div>`:'<p class="note">📷 使いきりカメラを もって 深夜の お店の 会話を おえると とれるよ</p>'}</details>
    <details class="mfold"><summary>📜 夜と おばけの 英語うんちく <small>${unl}/${HR_UNK.length}</small></summary><div class="hrunk">${HR_UNK.map((u,i)=>i<unl?`<details><summary>${esc(u[0])}</summary><p class="en">${esc(u[1])} <button class="ksay" data-u="${i}">🔊</button></p><p class="ja">${esc(u[2])}</p></details>`:'<p class="no">？ ？？？</p>').join('')}</div><p class="note">ふしぎな できごとに 会うたびに ふえるよ</p></details>
    <details class="mfold"><summary>🛒 夜の 道具</summary><div class="hrtools">${tools.map(t=>`<div><span>${t.ico}</span><b>${esc(t.n)} <small>${tN(t.id)?`×${tN(t.id)}`:''}</small></b><small>${esc(t.s)}</small></div>`).join('')}</div><p class="note">ながれぎ雑貨店の ⛏️ 鉱山の たなで 英語で 買えるよ</p></details>
  </section>`);
  $('hrbx').onclick=()=>{sf('back');back()};
  const c=$('hrctr');if(c)c.onclick=()=>{sf('step');SHOP.counter()};
  H.panel.querySelectorAll('[data-u]').forEach(b=>b.onclick=e=>{e.preventDefault();try{H.say('hs',HR_UNK[+b.dataset.u][1])}catch(x){}});
  H.panel.querySelectorAll('[data-k]').forEach(b=>b.onclick=()=>{sf('step');const t=HR_TALKS.find(x=>x.id===b.dataset.k)||HR_MINA.find(x=>x.id===b.dataset.k);if(t)MIOC.play(t,()=>book(back))})}

/* ================================================================ 👩‍🏫 ミナ先生の セリフ */
Object.assign(MINA_LINES,{
 hr_end_kowai:[['worry','…こ、 こわかったね。 「I got goosebumps.」（とりはだが 立った）って、 こういう ときに 使うんだよ'],['think','こわい 話の 英語って、 短い 文が 多いの。 「Don\'t turn around.」 みたいに。 だから 耳に のこるんだ'],['smile','ふふ、 こわい 話は 英語の 練習に ぴったり。 ドキドキすると ことばを おぼえやすいんだよ']],
 hr_end_doki:[['love','…ふーん。 くらやみで ドキドキ、 ね。 「My heart is pounding.」…先生は べつに 気に してないよ'],['think','こわい ときの ドキドキと、 好きな 人の ドキドキ。 英語でも 体は 同じ 反応なんだって'],['smile','💌 ことばメモ、 見てみて。 照れかくしの 英語、 ミオさん 上手だね']],
 hr_end_unk:[['proud','いい うんちくだったね！ ことばの 歴史を 知ると、 単語が 物語に なるよ'],['happy','the witching hour、 graveyard shift… 夜の 英語って 物語が いっぱい あるの'],['think','うんちくは 🌙 深夜の きろくにも たまっていくよ。 寝る 前に 読んでみて']],
 hr_end_fun:[['happy','あはは！ 「Boo!」も 「scaredy-cat」も、 英語の 子どもが ほんとに 使う ことばだよ'],['smile','こわいけど 楽しい。 英語では spooky って 言うの。 ちょうど いまの 感じ']],
 hr_mine:[['worry','…地の底で 英語が 聞こえるなんて。 でも 答えられたね、 えらい'],['think','鉱山の 怪談は 世界中に あるの。 イギリスの 鉱夫も コンコンの 音を 信じてたんだよ'],['smile','こわい ものにも 英語で 話しかけられたね。 それって すごい ことだよ']],
 hr_mineBad:[['worry','だいじょうぶ？！ …見つけた 物は ちゃんと のこってるからね。 🧿 お守りが あると ふせげるよ'],['think','こわい 目に あったね… 雑貨屋の 🧿 お守り、 もっていくと いいかも']],
 hr_charm:[['wow','お守りが 光った！ 「lucky charm」、 ちゃんと きいたね'],['happy','ふふ、 ノラさんの お守り、 ほんものだったね']],
 hr_photoOk:[['wow','…う、 うつってる…！ 心霊写真は 英語で ghost photo。 …先生には 見せなくて いいからね'],['worry','この 写真… ミオさんには 見せた？ …見せない ほうが いいかも']],
 hr_photoNo:[['smile','ブレちゃったね。 「It\'s just a blur.」 …でも すみの もや、 ちょっと 気に なるね'],['think','なにも うつってない… ほんとうに？ もう一度 よく 見て… な、 なんでもない']],
 hr_book:[['smile','深夜の きろく。 浜辺の 時計で 0時〜4時に なると、 カードショップで ふしぎな ことが 起きるみたい'],['think','夜の 英語は 物語が いっぱい。 こわいけど… 先生も ちょっと 気に なる']],
 hr_bookNow:[['worry','いま {t}… こんな 時間まで 起きてるの？ …カウンター、 行ってみる？'],['think','{t}。 夜中だね。 お店の 電気、 ちゃんと ついてると いいけど']],
 hr_bookUshi:[['worry','{t}… 丑三つ時だよ。 英語では the witching hour。 …先生、 ちょっと こわい'],['think','丑三つ時。 シェイクスピアも 「the very witching time of night」って 書いてるの']],
 x_hrNight:[['worry','もう {t}… 深夜だね。 こんな 時間の カードショップは、 ふしぎな ことが 起きるって うわさだよ'],['think','{t}。 夜ふかしは night owl って 言うの。 …カードショップ、 まだ あいてるかな'],['smile','深夜の お店、 行ってみる？ こわい 話も 英語の 練習に なるよ']],
 x_hrUshi:[['worry','{t}… 丑三つ時だよ。 英語では the witching hour。 カードショップに 足音の しない お客さんが 来るって…'],['think','いまは the witching hour。 「魔女の 時間」。 …先生は べつに こわくないけど']],
 x_hrMina:[['love','…まだ 起きてるの？ じゃあ 先生が こわい 話、 してあげようか'],['smile','夜の ミニ授業、 する？ イギリスの こわい 話が あるの']],
 x_hrItem:[['think','夜の お店で こわい ことが あったら… 雑貨屋の 🧿 お守りや 🕯️ ろうそくが 役に 立つかも'],['smile','📷 使いきりカメラ、 知ってる？ 深夜に とると… ふふ、 なにが うつるかな']],
 hr_first:[['worry','…ねえ、 知ってる？ 浜辺の 時計で 夜中の 0時を すぎると、 カードショップで ふしぎな ことが 起きるんだって。 こわい 話も 英語の 練習に なるよ']]});
if(window.MINA_SENSE&&MINA_SENSE._rules){const met=()=>{try{return SHOP.rec().met}catch(e){return 0}};
  const goCtr=()=>['🧑‍💼 カウンターへ',()=>{try{CG.open();setTimeout(()=>SHOP.counter(),60)}catch(e){}}];
  MINA_SENSE._rules.push(
   ['x_hrUshi',4,()=>met()&&ushi()?{t:hhmm()}:null,goCtr],
   ['x_hrNight',3,()=>met()&&deep()&&!ushi()?{t:hhmm()}:null,goCtr],
   ['x_hrMina',2,()=>(night()||deep())&&HR_MINA.some(t=>minaOk(t)&&!REC().seen[t.id])?{}:null,()=>['🌙 深夜の きろく',()=>{try{CG.open();setTimeout(()=>book(),60)}catch(e){}}]],
   ['x_hrItem',1,()=>met()&&Object.keys(REC().sg).length&&!has('charm')&&!has('candle')&&!has('camera')?{}:null,()=>['🏚️ 雑貨屋へ',()=>{try{ZAKKA.open('tool')}catch(e){}}]])}
/* はじめての 深夜: ミナ先生が 1回だけ 教える */
setTimeout(function first(){const R=REC();if(R.told)return;let met=0;try{met=SHOP.rec().met}catch(e){}
  if(!met||!deep())return setTimeout(first,30000);const m=window.MINA;if(!m||!m.canAnnounce||!m.canAnnounce())return setTimeout(first,20000);
  R.told=1;save();const [ex,tx]=ML('hr_first');m.say('m',ex,tx,10000,null,()=>{try{CG.open();setTimeout(()=>SHOP.counter(),60)}catch(e){}})},40000);

window.HORROR={open,step,draw,mine,has,use,book,frontBtn,frontBind,deep,ushi,rec:REC,start};
})();
