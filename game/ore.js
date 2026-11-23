/* 🪨 原石の 作業台（11/22 カードショップ 作りなおし 第1弾）
   - 原石 = まだ 📖ブックに 記録されていない 単語の カード。 店の 下の 作業台で 1つずつ 練習して 仕上げると カードに なる
   - 1まい 12問くらい（約5分）。 アルファベットの ならべかえが 中心で、 あいだに 意味・聞きとり・英語で・つづり の 4択
   - まちがえたり 🤔わからない を つかうと、 さいごに ならべかえが 1問 ふえる（3問まで。 失敗は なし）
   - 仕上がった カードは 📖ブックに 自動で 記録（ブックは 図鑑。 カードは 減らない・ブックから 出せない）。 カードは 🏷️売り場へ か 📦倉庫へ
   - 原石は 浜辺・波うちぎわで 1日 5こ（タップで ひろう）と ⛏️鉱山で 見つかる 分
   - 練習の あいだは イベントも ミオの わりこみも なし（単語の 習得 いちばん）
   保存は CG の 記録 C.rec().ore = {q:[{id,p,x,src,at}], day, done} */
(()=>{
const {S:ST,sfx:SFX}=BEACH;
const H=HE,esc=H.esc,C=CG,pickL=a=>a[Math.random()*a.length|0];
const sf=k=>{try{SFX[k]&&SFX[k]()}catch(e){}};
const ML=(k,v)=>{try{return MINA.line(k,v||{})}catch(e){return ['smile','']}};
const LVK=['es','jh','hs','adv'];
const DAY_N=5,HOLD_MAX=12,EXTRA_MAX=3;
const R=()=>{const r=C.rec();if(!r.ore||typeof r.ore!=='object'||!Array.isArray(r.ore.q))r.ore={q:[],day:'',done:0};return r.ore};
const save=()=>C.save();
const word=I=>String(I.en).split(',')[0].trim();
const okWord=c=>{const w=word(c);return /^[A-Za-z]{3,12}$/.test(w)&&!!c.ja};
const recd=id=>{try{return !!SHOP.bookRec()[id]}catch(e){return false}};
const has=id=>R().q.some(o=>o.id===id);
const list=()=>R().q.filter(o=>C.info(o.id));

/* ================================================================ どの 単語が 原石に なるか: 自分の レベルが 中心（7わり）・1つ下（2わり）・1つ上（1わり） */
function pickNew(lv){const my=Math.max(0,LVK.indexOf(lv||C.myLv())),r=Math.random();
  let li=r<.7?my:r<.9?Math.max(0,my-1):Math.min(3,my+1);
  const heads=new Set(R().q.map(o=>(C.info(o.id)||{}).h));
  for(const d of [0,-1,1,-2,2,3,-3]){const j=li+d;if(j<0||j>3)continue;
    const pool=C.W.filter(c=>c.lv===LVK[j]&&!recd(c.id)&&!has(c.id)&&!heads.has(c.h)&&okWord(c));if(pool.length)return pickL(pool).id}
  return null}
function add(id,src){if(!id||has(id)||!C.info(id))return false;R().q.push({id,p:0,x:0,src:src||'',at:Date.now()});save();return true}
/* 鉱山で 見つかった 原石（game/mine.js）。 単語カードは ここに 来る */
const fromMine=id=>{const I=C.info(id);if(!I||I.k!=='w'||!okWord(I)||recd(id))return false;return add(id,'mine')};
/* ================================================================ 🏖️ 浜辺と 海の 原石（1日 5こ。 砂の 上に 3こ・波うちぎわに 2こ。 タップで ひろう）
   その日の 置き場所は O.bs（[{x,y,sea}]、 浜辺の 窓の 中の わりあい）。 ひろったら 消える */
function shoreY(){try{const d=SCENE.dbg();return (d.shore-d.WT)/d.WH}catch(e){return .6}}
function makeSpots(){const out=[],far=(x,y)=>out.every(o=>Math.abs(o.x-x)>.1||Math.abs(o.y-y)>.06)&&(ST.radios||[]).every(r=>r.x==null||Math.abs(r.x-x)>.07||Math.abs(r.y-y)>.06);
  for(let t=0;t<400&&out.length<3;t++){const x=.06+Math.random()*.88,y=.68+Math.random()*.2;let ok=true;try{ok=H.okSpot(x,y)}catch(e){}if(ok&&far(x,y))out.push({x:+x.toFixed(3),y:+y.toFixed(3),sea:0})}
  for(let t=0;t<200&&out.length<DAY_N;t++){const x=.08+Math.random()*.84,dy=.012+Math.random()*.02;if(far(x,shoreY()-dy))out.push({x:+x.toFixed(3),y:dy,sea:1})}
  return out}
function spots(){const O=R(),d=C.today();if(O.bday!==d){O.bday=d;O.bs=makeSpots();save()}return Array.isArray(O.bs)?O.bs:(O.bs=[])}
let layer=null;
function beach(){const w=document.getElementById('window');if(!w)return;
  if(!layer||!layer.isConnected){layer=document.createElement('div');layer.id='oreBeach';w.appendChild(layer)}
  let met=false;try{met=!!SHOP.rec().met}catch(e){}
  const L=met?spots():[],sy=shoreY(),home=H.screen==='home';layer.classList.toggle('off',!home);
  const key=L.map(o=>o.x+','+o.y).join('|')+'@'+sy.toFixed(3);if(layer._k===key)return;layer._k=key;
  layer.innerHTML=L.map((o,i)=>`<button class="orebs ${o.sea?'sea':''}" data-i="${i}" style="left:${o.x*100}%;top:${((o.sea?sy-o.y:o.y)*100).toFixed(2)}%" aria-label="原石"><i></i></button>`).join('');
  layer.querySelectorAll('.orebs').forEach(b=>b.onclick=e=>{e.stopPropagation();if(H.screen!=='home')return;pick(+b.dataset.i,b)})}
function pick(i,b){const L=spots(),o=L[i];if(!o)return;
  if(R().q.length>=HOLD_MAX){sf('pop');H.toast('🪨 作業台が いっぱい<small>カードショップで みがいてから また ひろおう</small>');return}
  const id=pickNew();if(!id){H.toast('🪨 もう 原石に なる ことばが ないみたい');return}
  L.splice(i,1);add(id,o.sea?'sea':'beach');save();sf('pickup');
  b.classList.add('got');setTimeout(()=>{layer._k='';beach()},450);
  const left=L.length;H.toast(`🪨 ${o.sea?'波うちぎわで ':''}原石を ひろった！<small>${left?`きょうは あと ${left}こ ・ `:'きょうの 分は ぜんぶ ・ '}🃏 お店の 作業台で みがこう</small>`,2600);
  const O=R();O.picked=(O.picked||0)+1;save();
  if(O.picked===1)mina('ore_beach',{},1);else if(!left)mina('ore_beachAll',{},.6)}
setInterval(beach,2500);setTimeout(beach,1200);try{H.on('home',()=>setTimeout(beach,0))}catch(e){}

/* ================================================================ 12問の ならび（ならべかえが 中心） */
const STEPS=['see','arr','mean','arr','listen','arr2','rev','arr2','spell','arr3','ear','arr3'];
const total=o=>STEPS.length+(o.x||0);
const stepOf=o=>o.p<STEPS.length?STEPS[o.p]:'arr2';
const stage=o=>{const f=o.p/total(o);return f<.4?0:f<.8?1:2};
const STAGE=['けずる','みがく','仕上げ'];
const left=o=>Math.max(1,Math.round((total(o)-o.p)*25/60));   // 1問 25びょうくらい

let cur=null,X=null;   // いま えらんでいる 原石の id ／ 作業台の まわり（el, ctx）
const say=I=>{try{H.say(I.lv,word(I))}catch(e){}};

function bench(el,ctx){X={el,ctx:ctx||{}};const L=list();if(!L.find(o=>o.id===cur))cur=L.length?L[0].id:null;draw()}
const alive=()=>X&&X.el&&X.el.isConnected;
function stones(){const L=list();if(!L.length)return '';const sh=L.slice(0,7);
  return `<span class="orest">${sh.map(o=>`<button class="orestn ${o.id===cur?'on':''} ${o.p?'wk':''}" data-o="${esc(o.id)}" aria-label="原石"><i style="--p:${Math.round(o.p/total(o)*100)}%"></i></button>`).join('')}${L.length>sh.length?`<small>+${L.length-sh.length}</small>`:''}<b>${L.length}</b></span>`}
function draw(){if(!alive())return;const el=X.el,o=list().find(x=>x.id===cur);
  if(!o){el.innerHTML=`<div class="orebn"><div class="orehd"><b>🪨 原石の 作業台</b></div>
      <div class="oreempty"><span>🪨</span><p>原石は いま ないよ</p><small>${esc(pickL(EMPTY))}</small></div></div>`;return}
  const I=C.info(o.id),pc=Math.round(o.p/total(o)*100),sg=stage(o);
  el.innerHTML=`<div class="orebn">
    <div class="orehd"><b>🪨 原石の 作業台</b>${stones()}</div>
    <div class="oretop"><div class="orecd" style="--p:${pc/100}">${C.face(o.id,{lock:1,mini:1,marks:false})}<i class="orerock"></i></div>
      <div class="oreinfo"><small>原石 → カード（1まい 約5分）</small><div class="orebar"><i style="width:${Math.max(4,pc)}%"></i></div>
        <div class="orelab">${STAGE.map((t,i)=>`<span class="${i===sg?'on':''}">${t}</span>`).join('')}</div>
        <p>あと ${left(o)}分くらい ・ ${o.p+1}/${total(o)}問目</p></div></div>
    <div class="oreq" id="oreq"></div></div>`;
  el.querySelectorAll('[data-o]').forEach(b=>b.onclick=()=>{if(b.dataset.o===cur)return;sf('tap');cur=b.dataset.o;draw()});
  ask(o,I)}

/* ================================================================ 1問 */
function ask(o,I){const box=X.el.querySelector('#oreq'),k=stepOf(o);
  if(k==='see')return see(o,I,box);
  if(k.startsWith('arr')||k==='ear')return arrange(o,I,box,k==='ear'?'arr3':k);
  let t=k;if(t==='listen')t='mean';if(t==='spell'&&!/^[a-z]{3,}$/.test(I.h))t='rev';
  const q=C.quiz(o.id,{type:t});C.ask(box,q,r=>next(o,r.ok&&!r.hint),{tag:'原石',quiet:1})}
/* はじめの 1問: その ことばを 見て・聞いて 読む */
function see(o,I,box){const ex=exOf(I);
  box.innerHTML=`<div class="oresee"><p class="oreqt">まずは この ことばを 見て 聞こう</p>
    <div class="orew"><b>${esc(word(I))}</b><button class="sub" data-say aria-label="読む">🔊</button></div>
    <p class="orewj">${esc(I.ja)}</p>${ex?`<p class="oreex"><span>${esc(ex[0])}</span><small>${esc(ex[1]||'')}</small></p>`:''}
    <div class="row"><button class="sub" id="oremore">📖 くわしく</button><button id="orego">▶ はじめる</button></div></div>`;
  box.querySelector('[data-say]').onclick=()=>{sf('pickup');say(I)};
  box.querySelector('#oremore').onclick=()=>{sf('card');C.peek(o.id,{from:'ore'})};
  box.querySelector('#orego').onclick=()=>{sf('step');next(o,true,1)};
  setTimeout(()=>{if(box.isConnected)say(I)},350)}
const exOf=I=>{try{const w=window.WI;if(!w||!w.exOf)return null;const e=w.exOf(I.h);return Array.isArray(e)&&typeof e[0]==='string'&&e[0].length<90?e:null}catch(e){return null}};

/* 🔤 アルファベットの ならべかえ。 arr=そのまま ／ arr2=よけいな 文字 1つ ／ arr3=よけいな 文字 2つ・自動で 読まない ／ ear=聞いて ならべる（意味は あとで） */
const ABC='abcdefghijklmnopqrstuvwxyz';
function arrange(o,I,box,k){return arrangeQ(I,box,k,ok=>next(o,ok),{quiet:1})}
/* ほかの 画面（⛏️鉱山）でも つかう: cb(ok) */
/* opt.quiet: 自動で 読まない（原石の 作業中は 最初と 仕上がりだけ 読む。🔊は おせば 読む） */
function arrangeQ(I,box,k,cb,opt={}){const w=word(I),need=[...w],extra=k==='arr'?0:k==='arr3'?2:1;
  let tiles=need.map(c=>({c,u:0}));for(let i=0;i<extra;i++){let c;do{c=pickL([...ABC])}while(need.includes(c)&&Math.random()<.7);tiles.push({c,u:0})}
  for(let t=0;t<8;t++){tiles=H.shuffle(tiles);if(tiles.slice(0,need.length).map(x=>x.c).join('')!==w)break}
  const put=[];let miss=false,over=false;const ear=k==='ear';
  box.innerHTML=`<div class="orear ${ear?'ear':''}">
    <div class="oremean">${ear?`<span>🔊</span><b>聞いて ならべよう</b>`:`<span>いみ</span><b>${esc(I.ja)}</b>`}<button class="sub" data-say aria-label="読む">🔊</button></div>
    <p class="oreqt">文字を ならべて 英語に しよう${extra?`<small>（つかわない 文字が ${extra}つ まざってるよ）</small>`:''}</p>
    <div class="oreslots" data-notap>${need.map((_,i)=>`<span class="oreslot" data-s="${i}"></span>`).join('')}</div>
    <div class="oretiles" data-notap>${tiles.map((t,i)=>`<button class="oretile" data-t="${i}">${esc(t.c)}</button>`).join('')}</div>
    <div class="row orebtns"><button class="sub" id="oredk">🤔 わからない</button><button class="sub" id="oreun">↩ もどす</button></div></div>`;
  const S=[...box.querySelectorAll('.oreslot')],T=[...box.querySelectorAll('.oretile')];
  const paint=()=>{S.forEach((s,i)=>{const t=put[i];s.textContent=t!=null?tiles[t].c:'';s.classList.toggle('in',t!=null);s.classList.toggle('nx',i===put.length)});
    T.forEach((b,i)=>b.classList.toggle('used',!!tiles[i].u))};
  const done=()=>{over=true;S.forEach(s=>s.classList.add('ok'));sf('correct');if(!opt.quiet)say(I);
    if(ear){const m=box.querySelector('.oremean b');if(m)m.textContent=I.ja}
    setTimeout(()=>cb(!miss),1100)};
  const check=()=>{if(put.map(i=>tiles[i].c).join('')===w)return done();
    /* まちがい: 正しい ところまで のこして、 ちがう 文字から あとは もどす */
    miss=true;sf('wrong');let f=put.findIndex((t,i)=>tiles[t].c!==need[i]);if(f<0)f=0;
    for(let i=f;i<put.length;i++)S[i].classList.add('ng');
    over=true;setTimeout(()=>{if(!box.isConnected)return;S.forEach(s=>s.classList.remove('ng'));while(put.length>f)tiles[put.pop()].u=0;over=false;paint()},750)};
  const place=i=>{if(over||tiles[i].u||put.length>=need.length)return;tiles[i].u=1;put.push(i);sf('tap');paint();if(put.length===need.length)check()};
  T.forEach((b,i)=>b.onclick=()=>place(i));
  S.forEach((s,i)=>s.onclick=()=>{if(over||i>=put.length)return;while(put.length>i)tiles[put.pop()].u=0;sf('back');paint()});
  box.querySelector('#oreun').onclick=()=>{if(over||!put.length)return;tiles[put.pop()].u=0;sf('back');paint()};
  /* 🤔 わからない: つぎの 正しい 文字を 1つ おいてあげる（さいごに 1問 ふえる） */
  box.querySelector('#oredk').onclick=()=>{if(over)return;let f=put.findIndex((t,i)=>tiles[t].c!==need[i]);if(f>=0)while(put.length>f)tiles[put.pop()].u=0;
    const i=tiles.findIndex(t=>!t.u&&t.c===need[put.length]);if(i<0)return;miss=true;sf('pickup');
    const b=T[i];b.classList.add('hint');setTimeout(()=>{b.classList.remove('hint');place(i)},420)};
  box.querySelector('[data-say]').onclick=()=>{sf('pickup');say(I)};
  paint();if(k!=='arr3'&&!opt.quiet)setTimeout(()=>{if(box.isConnected)say(I)},300)}

/* ================================================================ つぎへ・仕上げ */
function next(o,ok,noRec){if(!has(o.id))return;if(!noRec)try{C.record(o.id,ok)}catch(e){}
  if(!ok&&(o.x||0)<EXTRA_MAX)o.x=(o.x||0)+1;o.p++;save();
  if(o.p>=total(o))return finish(o);
  if(alive())draw()}
function finish(o){const O=R(),id=o.id,I=C.info(id);O.q=O.q.filter(x=>x.id!==id);O.done=(O.done||0)+1;
  C.give(id);try{SHOP.bookRec()[id]=1}catch(e){}save();
  try{RECENT.add('ore',{id,en:word(I),ja:String(I.ja).split(/[、,]/)[0]})}catch(e){}
  try{SFX.fanfare(1)}catch(e){sf('done')}
  const ctx=X&&X.ctx||{};if(ctx.done)try{ctx.done(id)}catch(e){}
  if(!alive())return;
  const L=pickL(DONE),nx=list().length;
  X.el.innerHTML=`<div class="orebn oredn"><div class="orehd"><b>✨ 仕上がった！</b>${stones()}</div>
    <div class="oredc">${C.face(id,{big:1,ja:1,marks:false})}</div>
    <p class="orebk">📖 カードブックに 記録したよ</p>
    <p class="oremio">${MIO.face('laugh','peace')}<span><b>${esc(L[0])}</b><small>${esc(L[1])}</small></span></p>
    <p class="oreqt">できた カードは どうする？</p>
    <div class="row"><button id="orefl">🏷️ 売り場へ</button><button id="orest" class="sub">📦 倉庫へ</button></div></div>`;
  C.peekIn(X.el.querySelector('.oredc'),{from:'ore'});setTimeout(()=>{if(alive())say(I)},400);setTimeout(()=>{if(alive())try{MIO.say(L[0])}catch(e){}},1900)
  const go=fl=>{sf('step');let r='';if(fl){r=ctx.toFloor?ctx.toFloor(id):'';if(r==='full')H.toast('🏷️ 売り場が いっぱい<small>倉庫に 入れておいたよ</small>');else H.toast(`🏷️ 「${esc(word(I))}」を 売り場に ならべたよ`,1800)}
    else H.toast(`📦 「${esc(word(I))}」を 倉庫に 入れたよ`,1800);
    cur=nx?list()[0].id:null;draw();
    mina(O.done===1?'ore_first':!nx?'ore_allDone':'ore_done',{w:word(I),n:O.done},O.done===1?1:.3)};
  X.el.querySelector('#orefl').onclick=()=>go(1);X.el.querySelector('#orest').onclick=()=>go(0)}
function mina(k,v,p){try{if(window.MINA&&MINA.canAnnounce&&MINA.canAnnounce()&&Math.random()<p){const [ex,tx]=ML(k,v);if(tx)setTimeout(()=>MINA.say('m',ex,tx,6500),1200)}}catch(e){}}

/* ================================================================ ミオ */
const DONE=[["It's finished! Look how it shines, boss!","できた！ 見て、 店長。 ぴかぴか！"],
 ["A brand-new card! You polished it so well.","まっさらな カード！ じょうずに みがけましたね。"],
 ["Wow, it came out so pretty. Say the word one more time!","わあ、 きれいに できた。 もう一回 その ことば、 言ってみて！"],
 ["Done! I'm sure you'll never forget this word now.","完成！ この ことば、 もう ぜったい わすれませんね。"],
 ["Beautiful! This one goes in the book, right?","きれい！ これも ブックに 記録ですね。"],
 ["You made a card from a stone. That's real magic, boss.","石から カードを つくっちゃった。 店長、 まほう使いみたい。"]];
const EMPTY=['🏖️ 浜辺や 波うちぎわで 光っている 原石を ひろってこよう（1日 5こ）','⛏️ 鉱山でも 原石が 見つかるよ','いまは お店の ようすを ながめて ひとやすみ'];

/* ================================================================ ミナ先生 */
Object.assign(MINA_LINES,{
 ore_new:[['wow','カードショップが 新しく なったよ！ お店の 下が 🪨原石の 作業台。 ならべかえで みがいて カードに するの'],['point','原石は まだ 覚えていない ことば。 1つ 5分くらい 練習すると、 ぴかぴかの カードに なって 📖ブックに 記録されるよ']],
 ore_first:[['proud','はじめての カード、 仕上がったね！ 「{w}」は もう きみの ことば'],['happy','原石が カードに なった！ 「{w}」、 声に 出して 言えるかな？']],
 ore_done:[['happy','「{w}」も 仕上がったね。 これで {n}まい目'],['smile','ならべかえで つづりを 手で 覚えるの、 いいでしょ？ 「{w}」、 もう 書けるね'],['proud','{n}まい目の カード！ 少しずつ、 でも 確かに ふえてるよ']],
 ore_allDone:[['proud','きょうの 原石、 ぜんぶ 仕上がったね！ よく がんばりました'],['happy','原石 ぜんぶ カードに なった！ あとは お店を ながめて ひとやすみしよう']],
 ore_beach:[['wow','原石を ひろったね！ 浜辺と 波うちぎわに 1日 5こ 光ってるよ。 カードショップの 作業台で みがいてね'],['point','ひろった 原石は お店の 作業台へ。 開店前に ひろって、 開店したら みがく。 店長の 1日だね']],
 ore_beachAll:[['happy','きょうの 原石、 ぜんぶ ひろったね！ あとは お店で ゆっくり みがこう'],['smile','5こ ぜんぶ ひろえたね。 あしたの 朝も また 光ってるよ']],
 ore_mine:[['wow','鉱山で 原石を 見つけたね！ お店の 作業台で みがくと カードに なるよ'],['smile','ほった 原石は お店の 作業台へ。 ならべかえで みがいてね']],
 x_ore:[['smile','カードショップに 原石が {n}こ まってるよ。 1つ みがきに 行く？'],['think','作業台の 原石、 1つだけでも みがいてみない？ 5分くらいで カードに なるよ']]});
const goBench=()=>['🪨 作業台へ',()=>CG.open()];
if(window.MINA_SENSE&&MINA_SENSE._rules)MINA_SENSE._rules.push(
 ['x_ore',3,()=>{try{if(!SHOP.rec().met)return null}catch(e){return null}const n=list().length;return n?{n}:null},goBench]);

/* さっきの こと（ミナ先生の 反応。 game/mina-react.js） */
Object.assign(MINA_LINES,{r_ore:[['proud','さっき 原石を みがいて 「{w}」の カードに したね。 「{ja}」、 もう 書けるかな？'],['happy','「{w}」の カード、 できたね！ つづりを 手で 覚えると わすれにくいよ'],['smile','作業台で 「{w}」を 仕上げたね。 ゆっくり 1つずつで いいからね']]});
try{(window.MINA_REACT_EXT=window.MINA_REACT_EXT||{}).ore={act:e=>e.en?['r_ore',{w:e.en,ja:e.ja||''},goBench()]:null,desc:e=>`原石を みがいて 「${e.en||''}」の カードに した`}}catch(e){}

window.ORE={arrangeQ,okWord,bench,list,add,has,spots,fromMine,pickNew,rec:R,word,recd,total,STEPS};
})();
