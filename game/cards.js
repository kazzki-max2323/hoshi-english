/* カード図鑑: コインで「宝箱くじ」を引いて、1000種類のカードを集める。
   カードは英単語つき（タップで発音）。ダブったカードは「星のかけら」になり、かけらで まだ持っていないカードと交換できる。
   1日1回は むりょうで引ける。データは game/cards-data.js（CARDS_DATA） */
(()=>{
const {S:ST,sfx:SFX,scene:SC}=BEACH;
const H=HE,esc=H.esc;
const $=id=>document.getElementById(id);

const SERIES=[['sea','🐠','海の生きもの','#1e88c8'],['land','🦁','陸の動物','#c98a3c'],['bird','🐦','鳥','#3fa7cf'],['bug','🐞','虫・小さな生きもの','#6aa83a'],
 ['plant','🌸','花と植物','#d9468f'],['fruit','🍓','くだもの・やさい','#d8433f'],['food','🍣','ごはん・料理','#e67e22'],['sweet','🍰','おかし・のみもの','#e57fa8'],
 ['ride','🚀','乗りもの','#3f6ad8'],['place','🏰','建物・名所','#8d6e63'],['sky','🌙','空と宇宙・天気','#3949ab'],['play','⚽','スポーツ・遊び','#2e9e4f'],
 ['music','🎸','音楽・アート','#8e44ad'],['item','🔧','道具・くらし','#5f7d8c'],['wear','👑','服・アクセサリー','#c9a227'],['job','🧑‍🚀','仕事','#00897b'],
 ['myth','🐉','ふしぎな仲間','#6a1b9a'],['flag','🎌','世界の国と地域','#c0392b'],['lesson','📖','ミナの授業','#0f766e']];
const SER=Object.fromEntries(SERIES.map(s=>[s[0],s]));
/* rarity: name, draw weight (%), shards for a duplicate, shards to trade for one */
const RAR=[null,{k:'N',n:'ノーマル',w:60,sh:1,cost:15},{k:'R',n:'レア',w:27,sh:3,cost:45},{k:'SR',n:'スーパーレア',w:9.5,sh:10,cost:150},
 {k:'SSR',n:'ダブル スーパーレア',w:3,sh:40,cost:500},{k:'UR',n:'ウルトラレア',w:.5,sh:150,cost:1500}];
const PRICE1=80,PRICE10=720;   // one draw / ten draws (ten draws always include an SR or better)

/* cards in album order: by series, then rarity high→low; a card's number is its place in this order */
/* 「ミナの授業」: one card for each mini lesson (game/lessons/*.js), made here, so a new lesson brings its own card.
   It is never in the chest: clearing the lesson always gives it. A lesson may set its own picture with ico:'🦉' */
/* each kind of lesson has its own colour and corner mark; the picture comes from game/lessons/icons.js (LESSON_ICO),
   and a lesson not listed there gets one from its kind's set, picked by its id so it stays the same */
const LES_KIND={zu:'図解',kotsu:'覚え方',yarikata:'やり方',oto:'音',hama:'ハマ子',kagaku:'学び方'};
const LES_CAT={zu:['🖼️','#2f6fd6',['📐','🧭','🗺️','📊','🔷','🧱']],kotsu:['💡','#d89a1e',['🗝️','🌟','🍀','🎁','🧠','🪄']],yarikata:['📝','#2e9e6a',['✏️','📒','🏃','🎒','🪴','⏳']],
 oto:['👄','#d0457a',['🎵','🔔','🎙️','🎺','📻','🎹']],hama:['🍬','#e2683c',['🍭','🍡','🎐','🧁','🐙','🍊']],kagaku:['🧠','#7b4fd0',['🔬','🧪','🧬','🔭','⚗️','🛰️']]};
const LES_R={es:1,jh:2,hs:3,adv:4},LES_LV={es:'小学生',jh:'中学生',hs:'高校生',adv:'ハイレベル'};
const hashPick=(id,a)=>a[[...id].reduce((h,ch)=>(h*31+ch.charCodeAt(0))>>>0,7)%a.length];
const LES=(typeof LESSONS!=='undefined'?LESSONS:[]).map(l=>{const K=LES_CAT[l.cat]||['📖','#0f766e',['📖']];
  return {e:'les:'+l.id,ico:l.ico||(typeof LESSON_ICO!=='undefined'&&LESSON_ICO[l.id])||hashPick(l.id,K[2]),mark:K[0],col:K[1],kind:LES_KIND[l.cat]||'授業',en:l.t,ja:LES_LV[l.lv]||'',s:'lesson',r:LES_R[l.lv]||1,les:l.id}});
const ALL=CARDS_DATA.map(([e,en,ja,s,r])=>({e,en,ja,s,r})).concat(LES).sort((a,b)=>SERIES.findIndex(x=>x[0]===a.s)-SERIES.findIndex(x=>x[0]===b.s)||(a.les?a.r-b.r:b.r-a.r));
/* the chest's album and Mina's lesson album are kept apart: each numbers its own cards */
const BOOK=ALL.filter(c=>!c.les),TABS=SERIES.filter(s=>s[0]!=='lesson');
BOOK.forEach((c,i)=>c.no=i+1);LES.forEach((c,i)=>c.no=i+1);
const BY_R=[[],[],[],[],[],[]];ALL.forEach(c=>{if(!c.les)BY_R[c.r].push(c)});

/* saved state: owned counts by emoji (stable even if the album order changes), shards, last free day, "next is new" per rarity */
const CD=(()=>{try{const s=JSON.parse(localStorage.getItem(SAVE_KEY)||'{}').cards;if(s&&s.own)return s}catch(e){}return {own:{},shards:0,free:'',pity:{}}})();
_saveHooks.push(()=>{const s=JSON.parse(localStorage.getItem(SAVE_KEY)||'{}');s.cards=CD;localStorage.setItem(SAVE_KEY,JSON.stringify(s))});
const has=c=>(CD.own[c.e]||0)>0,ownedN=()=>BOOK.filter(has).length;
const today=()=>{const d=new Date();return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate()};
const freeOk=()=>CD.free!==today();

/* a lesson card draws its picture on Mina's blackboard, so it never looks like a chest card even with the same emoji */
const lesBoard=(c,lock)=>`<div class="lboard"><span class="lbk">${esc(c.kind)}</span><span class="tce">${c.ico}</span>${!lock&&window.MINA?`<span class="lbm">${MINA.face('m','smile')}</span>`:''}<i class="lchalk"></i></div>`;
/* one card face */
function face(c,opt={}){const S=SER[c.s],R=RAR[c.r],lock=!opt.show&&!has(c);
  return `<div class="tc r${c.r} ${lock?'lock':''} ${opt.big?'big':''} ${c.les?'les':''}" style="--sc:${c.col||S[3]}" data-e="${esc(c.e)}">
    <div class="tcin"><div class="tctop"><span class="tcno">No.${String(c.no).padStart(4,'0')}</span><span class="tcr">${R.k}</span></div>
    <div class="tcart">${c.les?lesBoard(c,lock):`<span class="tce">${c.ico||c.e}</span>`}</div>
    <div class="tcname">${lock?'？？？':`<b>${esc(c.en)}</b><small>${esc(c.ja)}</small>`}</div>
    <div class="tcser">${c.mark||S[1]}</div></div><i class="tcholo"></i></div>`}

/* ---------- album ---------- */
let tab='sea',filt='all';
function open(t){if(t==='lesson'){lesBack=0;return openLes()}if(t)tab=t;
  const list=BOOK.filter(c=>tab==='all'||c.s===tab).filter(c=>filt==='all'||(filt==='have'?has(c):!has(c)));
  const sc=s=>{const a=BOOK.filter(c=>s==='all'||c.s===s);return [a.filter(has).length,a.length]};
  H.show('cards',`<section class="pnl cardsp">
    <div class="qtop"><button class="x" id="kx" aria-label="もどる">←</button><b>🃏 カード図鑑</b><span class="qn">${ownedN()}/${BOOK.length}</span></div>
    <div class="kbar"><button id="kdraw" class="kdraw">🎁 宝箱くじ${freeOk()?' <em>きょうの むりょう！</em>':''}</button><span class="kshard">✦ かけら ${CD.shards}</span><button id="kles2" class="sub kles2">📖 授業<br>カード</button></div>
    <div class="kser">${[['all','🃏','ぜんぶ'],...TABS].map(s=>{const [h,n]=sc(s[0]);return `<button data-s="${s[0]}" class="${s[0]===tab?'on':''} ${h===n?'done':''}"><span>${s[1]}</span><small>${h}/${n}</small></button>`}).join('')}</div>
    <div class="khead"><b>${tab==='all'?'🃏 ぜんぶの カード':SER[tab][1]+' '+SER[tab][2]}</b><div class="seg kf">${[['all','ぜんぶ'],['have','もってる'],['not','まだ']].map(([k,n])=>`<button data-f="${k}" class="${filt===k?'on':''}">${n}</button>`).join('')}</div></div>
    <div class="kgrid">${list.map(c=>face(c)).join('')||'<p class="note">ここには まだ ないよ</p>'}</div>
  </section>`);
  $('kx').onclick=()=>{SFX.pop();H.home()};
  $('kdraw').onclick=()=>{SFX.card();drawMenu()};$('kles2').onclick=()=>{SFX.book();lesBack=1;openLes()};
  H.panel.querySelectorAll('[data-s]').forEach(b=>b.onclick=()=>{SFX.pop();tab=b.dataset.s;open()});
  H.panel.querySelectorAll('[data-f]').forEach(b=>b.onclick=()=>{SFX.pop();filt=b.dataset.f;open()});
  H.panel.querySelectorAll('.kgrid .tc').forEach(el=>el.onclick=()=>{SFX.flip();view(ALL.find(c=>c.e===el.dataset.e))});
  const on=H.panel.querySelector('.kser .on');if(on)on.scrollIntoView({inline:'center',block:'nearest'});
}

/* ---------- Mina's lesson album: one card per mini lesson, opened from Mina's page ---------- */
let lesLv='all',lesF='all',lesBack=0;/* lesBack: 図鑑から 来たら 図鑑へ もどる */
function openLes(){const LV=[['all','ぜんぶ'],['es','小'],['jh','中'],['hs','高'],['adv','ハイ']],LVL={es:'小学生',jh:'中学生',hs:'高校生',adv:'ハイレベル'},lvOf=c=>(LESSONS.find(l=>l.id===c.les)||{}).lv;
  const list=LES.filter(c=>lesLv==='all'||lvOf(c)===lesLv).filter(c=>lesF==='all'||(lesF==='have'?has(c):!has(c)));
  H.show('cards',`<section class="pnl cardsp lesbook">
    <div class="qtop"><button class="x" id="kx" aria-label="ミナ先生に もどる">←</button><b>📖 ミナ先生の 授業カード</b><span class="qn">${LES.filter(has).length}/${LES.length}</span></div>
    <p class="note">授業を クリアすると かならず 1まい もらえるよ。カードを タップすると その授業を ひらけるよ</p>
    <div class="seg">${LV.map(([k,n])=>`<button data-lv="${k}" class="${k===lesLv?'on':''}">${n}</button>`).join('')}</div>
    <div class="khead"><b>${lesLv==='all'?'📖 ぜんぶの 授業':'📖 '+LVL[lesLv]+'の 授業'}</b><div class="seg kf">${[['all','ぜんぶ'],['have','もってる'],['not','まだ']].map(([k,n])=>`<button data-f="${k}" class="${lesF===k?'on':''}">${n}</button>`).join('')}</div></div>
    <div class="kgrid">${list.map(c=>face(c)).join('')||'<p class="note">ここには まだ ないよ</p>'}</div>
  </section>`);
  $('kx').onclick=()=>{SFX.pop();lesBack?(lesBack=0,open()):window.MINA?MINA.open():H.home()};
  H.panel.querySelectorAll('[data-lv]').forEach(b=>b.onclick=()=>{SFX.pop();lesLv=b.dataset.lv;openLes()});
  H.panel.querySelectorAll('[data-f]').forEach(b=>b.onclick=()=>{SFX.pop();lesF=b.dataset.f;openLes()});
  H.panel.querySelectorAll('.kgrid .tc').forEach(el=>el.onclick=()=>{SFX.flip();view(ALL.find(c=>c.e===el.dataset.e))})}

/* ---------- overlay (big card / draw results); it lives outside the panel so the panel stays put ---------- */
function overlay(html,cls=''){closeOv();const o=document.createElement('div');o.id='cardOv';o.className=cls;o.innerHTML=html;document.body.appendChild(o);
  o.addEventListener('click',e=>{if(e.target===o){SFX.pop();closeOv()}});return o}
function closeOv(){const o=$('cardOv');if(o)o.remove()}
/* the big card tilts toward the finger, and its shine follows */
function tilt(el){const set=(x,y)=>{el.style.setProperty('--rx',(y-.5)*-18+'deg');el.style.setProperty('--ry',(x-.5)*22+'deg');el.style.setProperty('--mx',x*100+'%');el.style.setProperty('--my',y*100+'%')};
  el.addEventListener('pointermove',e=>{const r=el.getBoundingClientRect();set((e.clientX-r.left)/r.width,(e.clientY-r.top)/r.height)});
  el.addEventListener('pointerleave',()=>set(.5,.5));
  let t=0;const idle=()=>{if(!el.isConnected)return;if(!el.matches(':hover')){t+=.012;set(.5+Math.sin(t)*.25,.5+Math.cos(t*.8)*.18)}requestAnimationFrame(idle)};idle()}

function view(c){if(c.les)return viewLes(c);const own=has(c),R=RAR[c.r];
  const o=overlay(`<div class="kview">${face(c,{big:1,show:own})}
    <div class="kvinfo">${own?`<b class="rk r${c.r}">${R.k}　${R.n}</b><span>もっている数 ×${CD.own[c.e]}</span>
      ${c.r>=3?`<span class="khint">✨ 絵を タップすると 動くよ</span>`:''}
      <button id="ksay" class="kbtn">🔊 ${esc(c.en)}</button>
      ${c.r>=4?`<button id="kspecial" class="kbtn gold">💫 タップ</button>`:''}
      ${c.r>=3&&summonOf(c)?`<button id="ksummon" class="kbtn">${summonOk(c)?`🏖️ 浜辺に よぶ：${summonOf(c).n}`:'🏖️ きょうは もう よんだよ（あしたまた）'}</button>`:''}`
    :`<b class="rk r${c.r}">${R.k}　${R.n}</b><span>まだ もっていない</span>
      <button id="ktrade" class="kbtn" ${CD.shards<R.cost?'disabled':''}>✦ かけら ${R.cost}こ で こうかん（いま ${CD.shards}こ）</button>`}
    <button id="kclose" class="kbtn sub">とじる</button></div></div>`,'kv');
  tilt(o.querySelector('.tc'));o.querySelector('.tc').classList.add('live');
  $('kclose').onclick=()=>{SFX.pop();closeOv()};
  if(own){$('ksay').onclick=()=>H.say('es',c.en);H.say('es',c.en);
    if(c.r>=3){const art=o.querySelector('.tcart');art.style.cursor='pointer';art.onclick=e=>{e.stopPropagation();move(c,o)}}
    if($('kspecial'))$('kspecial').onclick=()=>special(c);
    if($('ksummon'))$('ksummon').onclick=()=>summon(c)}
  else $('ktrade').onclick=()=>{if(CD.shards<R.cost)return;CD.shards-=R.cost;CD.own[c.e]=1;save();SFX.buy();closeOv();open();view(c);H.toast(`✦ <b>${esc(c.ja)}</b> と こうかん！`);checkSeries([c])};
}

/* a lesson card: no voice or trade; it opens its lesson */
function viewLes(c){const own=has(c),R=RAR[c.r];
  const o=overlay(`<div class="kview">${face(c,{big:1,show:own})}
    <div class="kvinfo"><b class="rk r${c.r}">📖 ミナの授業・${esc(c.ja)}</b>
      <span>${own?'授業を クリアして もらった カード':`「${esc(c.en)}」を クリアすると かならず もらえるよ`}</span>
      ${window.LESSON?`<button id="kles" class="kbtn ${own?'':'gold'}">📖 授業を ${own?'もう一度 ':''}ひらく</button>`:''}
      <button id="kclose" class="kbtn sub">とじる</button></div></div>`,'kv');
  tilt(o.querySelector('.tc'));o.querySelector('.tc').classList.add('live');
  $('kclose').onclick=()=>{SFX.pop();closeOv()};
  const b=$('kles');if(b)b.onclick=()=>{SFX.lesson();closeOv();LESSON.open(c.les,openLes)}}
/* clearing a lesson gives its card (once). Returns the card when it is new */
const lesCard=id=>ALL.find(c=>c.les===id);
function lessonGet(id,quiet){const c=lesCard(id);if(!c||has(c))return null;CD.own[c.e]=1;save();if(!quiet)setTimeout(()=>checkSeries([c]),2500);return c}

/* ---------- SR and up: cards that do something ---------- */
/* tap the picture: it moves in its own way and little things burst out */
const MOVES={sea:'kswim',land:'khop',bird:'kfly',bug:'khop',plant:'ksway',fruit:'kmunch',food:'kmunch',sweet:'kmunch',ride:'kzoom',place:'kglow',sky:'kspin2',
 play:'kbounce',music:'kbounce',item:'kwiggle',wear:'kglow',job:'kbounce',myth:'kmagic',flag:'kwave'};
const BITS={sea:['💧','✨'],land:['💨','⭐'],bird:['🪶','✨'],bug:['🍃','✨'],plant:['🌸','🍃'],fruit:['💕','✨'],food:['💕','⭐'],sweet:['💕','🍬'],ride:['💨','⭐'],
 place:['✨','⭐'],sky:['⭐','✨'],play:['⭐','🎉'],music:['🎵','🎶'],item:['✨','💡'],wear:['💎','✨'],job:['⭐','👍'],myth:['✨','🔮'],flag:['🎉','🎊']};
function move(c,o){const e=o.querySelector('.tce'),m=MOVES[c.s]||'kbounce';
  /* set inline so it wins over the UR card's floating animation */
  e.style.animation='none';void e.offsetWidth;e.className='tce '+m;e.style.animation=`${m} 1s ease-in-out`;
  clearTimeout(e._t);e._t=setTimeout(()=>{e.style.animation='';e.className='tce'},1050);SFX.pop();
  const r=e.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2,b=BITS[c.s]||['✨'],n=c.r>=5?16:c.r>=4?12:8;
  for(let i=0;i<n;i++){const p=document.createElement('span');p.className='kbit';p.textContent=b[i%b.length];const a=Math.random()*Math.PI*2,d=70+Math.random()*90;
    p.style.cssText=`left:${cx}px;top:${cy}px;--dx:${Math.cos(a)*d}px;--dy:${Math.sin(a)*d-30}px;--rot:${Math.random()*360-180}deg;animation-delay:${Math.random()*.08}s`;
    o.appendChild(p);setTimeout(()=>p.remove(),1100)}
  setTimeout(()=>H.say('es',c.en),250)}
/* SSR and up: a special move — the card's picture rains across the whole screen */
function special(c){if($('krain'))return;const L=document.createElement('div');L.id='krain';if(c.r>=5)L.className='ur';document.body.appendChild(L);
  const n=c.r>=5?42:28;for(let i=0;i<n;i++){const p=document.createElement('span');p.textContent=c.e;
    p.style.cssText=`left:${Math.random()*100}%;font-size:${28+Math.random()*44}px;animation-duration:${1.6+Math.random()*1.4}s;animation-delay:${Math.random()*1.2}s;--rot:${Math.random()*720-360}deg`;L.appendChild(p)}
  SFX.fanfare(c.r>=5?3:2);[200,700,1200].forEach(t=>setTimeout(()=>FX.firework(innerWidth*(.2+Math.random()*.6),innerHeight*(.15+Math.random()*.3)),t));
  setTimeout(()=>H.say('es',c.en),400);setTimeout(()=>L.remove(),3400)}
/* some SR+ cards can call their scene onto the beach, once a day each */
const SUMMON={'🐬':'dolphins','🐋':'whale','🐳':'whale','🐢':'turtle','🚀':'rocket','✈️':'plane','🛩️':'seaplane','🚁':'heli','⛵':'ship','🛸':'ufo','🧜':'mermaid','🧜‍♀️':'mermaid','🧜‍♂️':'mermaid',
 '🌈':'rainbow','🎆':'fireworks','🎇':'fireworks','🌠':'meteors','🌸':'sakura','🎈':'balloons','🛰️':'iss','🏄':'surfer','🪁':'kite','🐟':'flyfish','🕊️':'gull','🏮':'lanterns',
 '🔥':'bigfire','🪂':'parasail','🚤':'fishboat','🏰':'sandcastle','🌌':'aurora','✨':'fireflies','🏴‍☠️':'pirate','🐠':'flyfish','🎑':'lanterns','🌙':'moonbow','🎐':'gull'};
const summonOf=c=>{const id=SUMMON[c.e];return id&&CATALOG.event.find(x=>x.id===id)};
const summonOk=c=>(CD.summon||{})[c.e]!==today();
function summon(c){const it=summonOf(c);if(!it||!summonOk(c))return;
  if(!H.onSale(it)){H.toast(`${it.ico} <b>${it.n}</b> は ${H.timeBadge(it.t)}<small>その時間に また よんでね</small>`,3000);return}
  CD.summon=CD.summon||{};CD.summon[c.e]=today();save();closeOv();SFX.whoosh();H.home();H.radioWake&&H.radioWake();H.toast(`${c.e} <b>${esc(c.ja)}</b> が ${it.ico} ${it.n} を よんだ！`,2600);
  setTimeout(()=>{try{it.k==='show'?SC.show(it.id,it.sec):SC.play(it.id)}catch(e){}},600)}

/* ---------- draw ---------- */
function drawMenu(){const fr=freeOk();
  overlay(`<div class="kmenu"><div class="kchest">🎁</div><b>宝箱くじ</b>
    ${fr?`<button id="kd0" class="kbtn gold">🎁 きょうの むりょう 1回</button>`:''}
    <button id="kd1" class="kbtn" ${ST.coins<PRICE1?'disabled':''}>1回 🪙${PRICE1}</button>
    <button id="kd10" class="kbtn" ${ST.coins<PRICE10?'disabled':''}>10回 🪙${PRICE10}<small>SR以上 1まい かくてい</small></button>
    <p class="kodds">${RAR.slice(1).map(r=>`<span class="rk">${r.k}</span> ${r.w}%`).join('　')}</p>
    <p class="note">ダブったカードは 星のかけらに なるよ。ダブったら、つぎの 同じレアは かならず 新しいカード</p>
    <button id="kclose" class="kbtn sub">とじる</button></div>`,'kv');
  $('kclose').onclick=()=>{SFX.pop();closeOv()};
  if(fr)$('kd0').onclick=()=>{CD.free=today();save();draw(1)};
  $('kd1').onclick=()=>{if(ST.coins<PRICE1)return;ST.coins-=PRICE1;save();H.head();draw(1)};
  $('kd10').onclick=()=>{if(ST.coins<PRICE10)return;ST.coins-=PRICE10;save();H.head();draw(10)}}

function roll(min=1){let x=Math.random()*100,r=5;for(let k=1;k<=5;k++){x-=RAR[k].w;if(x<0){r=k;break}}return Math.max(r,min)}
function pick(r){const pool=BY_R[r],fresh=pool.filter(c=>!has(c));
  if(CD.pity[r]&&fresh.length){CD.pity[r]=0;return fresh[Math.random()*fresh.length|0]}
  const c=pool[Math.random()*pool.length|0];if(has(c))CD.pity[r]=1;return c}
function draw(n,min=1){const got=[];for(let i=0;i<n;i++){const r=roll(Math.max(min,n===10&&i===n-1&&!got.some(g=>g.c.r>=3)?3:1));const c=pick(r),isNew=!has(c);
    if(isNew)CD.own[c.e]=1;else{CD.own[c.e]++;CD.shards+=RAR[r].sh}got.push({c,isNew})}
  save();const best=Math.max(...got.map(g=>g.c.r));
  /* the chest shakes, then glows in the colour of the best card inside */
  const o=overlay(`<div class="kopen b${best}"><div class="kchest shake">🎁</div><p>${n===10?'10まい':'1まい'}</p></div>`,'kv');
  SFX.deal&&SFX.deal();
  setTimeout(()=>{if(!o.isConnected)return;if(best>=4){SFX.fanfare(best-2)}else SFX.done();o.querySelector('.kopen').classList.add('burst')},900);
  setTimeout(()=>{if(o.isConnected)reveal(got)},1600)}
function reveal(got){
  const o=overlay(`<div class="kres ${got.length>1?'ten':'one'}">${got.map((g,i)=>`<div class="kslot" data-i="${i}"><div class="kback b${g.c.r}">✦</div>${face(g.c,{show:1,big:got.length===1})}${g.isNew?'<em class="knew">NEW!</em>':`<em class="kdup">✦+${RAR[g.c.r].sh}</em>`}</div>`).join('')}</div>
    <div class="kresb"><button id="kall" class="kbtn">ぜんぶ めくる</button><button id="kok" class="kbtn sub" hidden>図鑑へ</button></div>`,'kv kr');
  const slots=[...o.querySelectorAll('.kslot')];let left=slots.length;
  const flip=s=>{if(s.classList.contains('open'))return;s.classList.add('open');const g=got[+s.dataset.i];
    if(g.c.r>=3){const r=s.getBoundingClientRect();FX.ring(r.left+r.width/2,r.top+r.height/2,g.c.r>=5?'#ff6ad5':g.c.r>=4?'#9fe8ff':'#ffd23f');if(g.c.r>=4)FX.firework(r.left+r.width/2,r.top+r.height/2)}
    SFX.flip();s.querySelector('.tc').classList.add('live');
    if(--left===0){$('kall').hidden=true;$('kok').hidden=false;checkSeries(got.filter(g=>g.isNew).map(g=>g.c))}};
  slots.forEach(s=>s.onclick=()=>{if(s.classList.contains('open')){const g=got[+s.dataset.i];H.say('es',g.c.en)}else flip(s)});
  $('kall').onclick=()=>slots.forEach((s,i)=>setTimeout(()=>flip(s),i*110));
  $('kok').onclick=()=>{SFX.pop();closeOv();open(got.slice().sort((a,b)=>b.c.r-a.c.r)[0].c.s)};
  if(got.length===1)setTimeout(()=>flip(slots[0]),350)}

/* finishing a series is celebrated once */
function checkSeries(newCards){const done=[...new Set(newCards.map(c=>c.s))].filter(s=>ALL.filter(c=>c.s===s).every(has));
  done.forEach((s,i)=>setTimeout(()=>{SFX.fanfare(3);H.toast(`🏆 <b>${SER[s][1]} ${SER[s][2]}</b> コンプリート！`,3600)},800+i*1600))}

/* a free draw given as a reward (Mina's lesson time): n cards, each at least rarity min */
window.CARDS={open,openLes:()=>{lesBack=0;openLes()},count:()=>[ownedN(),BOOK.length],freeOk,gift:(n=1,min=1)=>draw(n,min),face,lessonGet,lesCard,has,lesCount:()=>[LES.filter(has).length,LES.length],book:BOOK,les:LES,series:TABS,rar:RAR,shards:()=>CD.shards,n:c=>CD.own[c.e]||0};
if(H.screen==='home')H.home();   // show the free-draw dot on the home button
})();
