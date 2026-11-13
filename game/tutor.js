/* 家庭教師の バイト: 浜辺の 近所の 子 リク（👦 8さい・ずっと 子どものまま）に 英語を 教える。
   - 浜辺の 左がわの パラソル（#window の 中の 小さな 絵）を タップすると ひらく。質問が ある ときは 「？」が ゆれる
   - 1回の バイト = リクの 質問 3つ。これまでに ならった 授業・文法・まちがいノートの ところから えらぶ（にがて → ならった → いまの レベル）。
     いちど 出た 質問は ぜんぶ 一巡するまで 出ない
   - 教え方を えらぶ。正しいと リクが 「わかった！」と 英語を 言ってみて、ときどき 「じゃあ 〜は？」と つづきを 聞く
   - まちがえても 失敗には ならない。かわりに 3つの どれかが おきる:
       リクの 助け舟（「でも 教科書には…」→ えらびなおし）/ ミナ先生が まどの 外から こっそり ヒント /
       リクが その 教え方で へんな 英文を 言って 大わらい → 「ほんとは？」で 正しい 文を えらぶと 「ありがとう！」と おまけ
   - へんな 英文は 「へんな英文 図鑑」（と 浜辺の 会話の おもしろ反応 図鑑）に のこる
   - バイト代は まちがえても へらない。1日 3回まで コイン＋お礼の 品（ながれぎ雑貨店で 売れる）。4回目からも 教えられる
   中身: game/tutor-data.js。ミナ先生の セリフは この ファイルの さいごに ある */
(()=>{
const {S:ST,sfx:SFX}=BEACH;
const H=HE,esc=H.esc,$=id=>document.getElementById(id);
const TQ=TUTOR_Q,TG=TUTOR_GIFTS,K=TUTOR_KID;
const pickL=a=>a[Math.random()*a.length|0];
const shuffle=a=>H.shuffle?H.shuffle(a.slice()):a.slice().sort(()=>Math.random()-.5);
const LV=['es','jh','hs','adv'];
const PAY=10,PER_DAY=3,NQ=3;
const KID={p:1.55,r:1},MINAV={p:1.25,r:.95};
const qById=id=>TQ.find(q=>q.id===id);
const gById=id=>TG.find(g=>g[0]===id);
const dk=()=>{const d=new Date();return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate()};

/* ---------- the record ---------- */
const TD=(()=>{try{const s=JSON.parse(localStorage.getItem(SAVE_KEY)||'{}').tutor;if(s&&s.taught)return s}catch(e){}
  return {met:0,n:0,seen:[],taught:{},first:{},fun:{},fix:0,gifts:{},got:{},day:{d:'',n:0},told:0,last:0}})();
_saveHooks.push(()=>{const s=JSON.parse(localStorage.getItem(SAVE_KEY)||'{}');s.tutor=TD;localStorage.setItem(SAVE_KEY,JSON.stringify(s))});
const paidToday=()=>TD.day.d===dk()?TD.day.n:0;
const paidLeft=()=>Math.max(0,PER_DAY-paidToday());
const giftN=()=>Object.values(TD.gifts).reduce((a,b)=>a+b,0);
const funAll=()=>TQ.reduce((a,q)=>a+q.o.filter(o=>o[2]).length+(q.m?q.m.o.filter(o=>o[2]).length:0),0);
const funN=()=>Object.keys(TD.fun).length;
const taughtN=()=>Object.keys(TD.taught).filter(qById).length;
const nextLetter=()=>{const l=(K.letters||[]).find(x=>x[0]>TD.n);return l?l[0]:0};
const myLv=()=>{try{return MINA.level()}catch(e){return 'es'}};

/* ---------- what the player has studied (lessons, grammar notes, the mistake notebook) ---------- */
function studied(){const S=new Set(),W=new Set(),L=new Set(),WL=new Set();
  try{Object.keys(MINA.rec().les||{}).forEach(id=>L.add(id))}catch(e){}
  try{(ST.gram.owned||[]).concat(ST.gram.cleared||[]).forEach(id=>S.add(id))}catch(e){}
  try{Object.entries(MINA.rec().g||{}).forEach(([id,e])=>{S.add(id);if(e.m>0&&(e.k||0)<3)W.add(id)})}catch(e){}
  try{SENSEI.weak().forEach(id=>W.add(id));Object.keys(SENSEI.rec().g||{}).forEach(id=>S.add(id))}catch(e){}
  try{Object.keys(MOTI.rec().ms||{}).forEach(id=>WL.add(id))}catch(e){}
  return {S,W,L,WL}}
function tagOf(q,st){st=st||studied();
  if((q.g&&st.W.has(q.g))||q.les.some(l=>st.WL.has(l)))return 'weak';
  if((q.g&&st.S.has(q.g))||q.les.some(l=>st.L.has(l)))return 'did';
  return ''}
const KIND={why:'🤔 なんで？',word:'🗣️ 英語で なんて いう？',check:'✏️ 宿題チェック',sound:'👄 発音'};
const TAG={weak:'❗ まちがいノートの ところ',did:'📖 ならった ところ'};
/* three questions: one from the weak spots, then the studied ones, then the ones at your level. Asked ones wait until all have come round */
function pick3(){const st=studied(),me=LV.indexOf(myLv());
  let pool=TQ.filter(q=>LV.indexOf(q.lv)<=Math.max(0,me)||tagOf(q,st));
  if(pool.length<NQ)pool=TQ.slice();
  let fresh=pool.filter(q=>!TD.seen.includes(q.id));
  if(fresh.length<NQ){TD.seen=TD.seen.filter(id=>!pool.some(q=>q.id===id));fresh=pool.slice()}
  const by=t=>shuffle(fresh.filter(q=>tagOf(q,st)===t));
  const W=by('weak'),D=by('did'),O=by('');
  const out=[];const add=q=>{if(q&&out.length<NQ&&!out.includes(q))out.push(q)};
  add(W[0]);D.forEach(add);W.slice(1).forEach(add);O.forEach(add);
  out.forEach(q=>TD.seen.push(q.id));save();
  return shuffle(out).map(q=>({q,tag:tagOf(q,st)}))}

/* ---------- voice: Riku high and bright (only the English is read) ---------- */
let enVoice=null;
function pickVoice(){if(!window.speechSynthesis)return;const vs=speechSynthesis.getVoices().filter(v=>/^en[-_]/i.test(v.lang));
  enVoice=vs.find(v=>/en[-_]US/i.test(v.lang)&&/Samantha|Google|Natural/i.test(v.name))||vs.find(v=>/en[-_]US/i.test(v.lang))||vs[0]||null}
if(window.speechSynthesis){pickVoice();speechSynthesis.addEventListener&&speechSynthesis.addEventListener('voiceschanged',pickVoice)}
let talkOn=false,talkId=0,talkMax=0;
function talk(en,c){if(!ST.sound||!window.speechSynthesis||!en)return;
  try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(sayNames(en).replace(/\.\.\.\s*/g,' '));u.lang='en-US';if(enVoice)u.voice=enVoice;
    u.pitch=(c||KID).p;u.rate=(ST.slow?.72:.92)*(c||KID).r;u.volume=Math.min(1,(ST.vol&&ST.vol.voice!=null)?ST.vol.voice:1);
    const id=++talkId;talkOn=true;talkMax=Date.now()+3000+String(en).length*(ST.slow?140:100);u.onend=u.onerror=()=>{if(id===talkId)talkOn=false};speechSynthesis.speak(u)}catch(e){talkOn=false}}
const hush=()=>{try{speechSynthesis.cancel()}catch(e){}};
/* only the English part of a line, if there is one */
/* a funny line can carry Riku's own comment after " …": [English, comment] */
const splitF=t=>{const i=String(t).indexOf(' …');return i<0?[t,'']:[t.slice(0,i),t.slice(i+2)]};
const enOf=t=>{const m=String(t).match(/[A-Za-z][A-Za-z ,.'!?’-]{2,}/g);return m?m.filter(x=>/[a-z]{2}/.test(x)).join(' '):''};

/* ---------- Mina ---------- */
const mline=(k,v)=>MINA.line(k,v||{});
const minaBox=(k,v)=>{const [ex,tx]=mline(k,v);return `<div class="kmina"><span class="lface">${MINA.face('m',ex)}</span><p>${tx}</p></div>`};

/* ================================================================ the parasol on the beach */
const SPOT=`<svg viewBox="0 0 72 60" aria-hidden="true">
  <ellipse cx="36" cy="57.4" rx="33" ry="2.6" fill="rgba(0,0,0,.26)"/>
  <path d="M9 56 L52 56 L59 49.6 L17 49.6 Z" fill="#5ab4ff"/><path d="M14.4 56 L21.6 49.6 M24 56 L31 49.6 M33.6 56 L40.6 49.6 M43.2 56 L50.2 49.6" stroke="#fff" stroke-width="2.2" opacity=".85"/>
  <g class="tuToys"><path d="M4.6 49 L12.4 49 L11.4 56 L5.6 56 Z" fill="#ffcf4a" stroke="#c9952a" stroke-width=".5"/><path d="M5 49 Q8.5 44.6 12 49" fill="none" stroke="#c9952a" stroke-width=".6"/>
   <path d="M13.6 47 L15.6 55.4" stroke="#9a734a" stroke-width=".9"/><path d="M14.6 54 Q15 57.6 17 56.6 Q17.6 54.6 16.2 53.4 Z" fill="#5ab4ff"/>
   <path d="M2.6 57 Q4 55 6 56 Q5 57.6 2.6 57 Z" fill="#ff9a8a"/></g>
  <line x1="25" y1="4" x2="29" y2="56" stroke="#e9e2d6" stroke-width="1.6"/>
  <path d="M25 3 L1 19 Q5.0 22.2 9 16.6 Z" fill="#e8463e"/><path d="M25 3 L9 16.6 Q13.0 19.8 17 15.4 Z" fill="#fbf6ec"/><path d="M25 3 L17 15.4 Q21.0 18.6 25 15 Z" fill="#e8463e"/><path d="M25 3 L25 15 Q29.0 18.6 33 15.4 Z" fill="#fbf6ec"/><path d="M25 3 L33 15.4 Q37.0 19.8 41 16.6 Z" fill="#e8463e"/><path d="M25 3 L41 16.6 Q45.0 22.2 49 19 Z" fill="#fbf6ec"/>
  <path d="M1 19 Q5 22.2 9 16.6 Q13 19.6 17 15.4 Q21 18.6 25 15 Q29 18.6 33 15.4 Q37 19.6 41 16.6 Q45 22.2 49 19" fill="none" stroke="rgba(120,30,30,.35)" stroke-width=".5"/>
  <circle cx="25" cy="2.8" r="1.6" fill="#ffcf4a"/>
  <g class="tuTable"><rect x="40" y="43" width="21" height="2.6" rx="1" fill="#c49462"/><rect x="42" y="45.6" width="1.8" height="9.6" fill="#9a734a"/><rect x="57.2" y="45.6" width="1.8" height="9.6" fill="#9a734a"/>
   <path d="M41.6 42.8 L46 40.4 L50.4 42.2 L54.8 40.4 L54.8 42.8 L50.4 43.6 L46 42.8 Z" fill="#fff"/><path d="M50.4 42.2 L50.4 43.6" stroke="#bbb" stroke-width=".4"/>
   <path d="M43 41.6 L48.6 41.6 M43.4 40.8 L48 40.8 M52 41.4 L54 41" stroke="#8aa" stroke-width=".35"/>
   <circle cx="58.6" cy="41.2" r="1.8" fill="#e8463e"/><path d="M58.6 39.4 L59 38.4" stroke="#6b4a2a" stroke-width=".4"/><path d="M59 38.8 Q60.4 38 60.8 38.8 Q59.8 39.4 59 38.8 Z" fill="#5ab65a"/></g>
  <g class="tuKid">
   <path d="M21.4 55.6 Q21 51 24.6 50.4 L34 50.4 Q37.4 51 37 55.6 Z" fill="#3f6fd8"/>
   <ellipse cx="22.4" cy="55.8" rx="2.2" ry="1.2" fill="#f3c9a0"/><ellipse cx="36" cy="55.8" rx="2.2" ry="1.2" fill="#f3c9a0"/>
   <path d="M23.4 51 L24 41.4 Q29.4 38.4 34.8 41.4 L35.4 51 Z" fill="#ffcf4a"/>
   <path d="M29.4 44 L30.1 45.5 L31.7 45.6 L30.5 46.6 L30.9 48.2 L29.4 47.3 L27.9 48.2 L28.3 46.6 L27.1 45.6 L28.7 45.5 Z" fill="#fff6dd"/>
   <path d="M24.2 43 Q22.4 47 25.4 49.2" stroke="#ffcf4a" stroke-width="2.4" fill="none" stroke-linecap="round"/>
   <path d="M34 42.6 Q38 43 42.4 41.4" stroke="#ffcf4a" stroke-width="2.4" fill="none" stroke-linecap="round"/><circle cx="43" cy="41.2" r="1.3" fill="#f3c9a0"/>
   <path d="M43.4 41 L46.4 37.4" stroke="#ff8a5a" stroke-width=".9" stroke-linecap="round"/>
   <circle cx="29.2" cy="33.6" r="6.4" fill="#f3c9a0"/><circle cx="22.9" cy="34.4" r="1.2" fill="#f3c9a0"/><circle cx="35.5" cy="34.4" r="1.2" fill="#f3c9a0"/>
   <path d="M22.6 33 Q22 26 29.2 26.2 Q36.4 26 35.8 33 Q34 29.6 31 30.4 Q30 28.6 27.4 30.2 Q24.6 29.6 22.6 33 Z" fill="#4a3220"/>
   <path d="M29 26.4 Q28.6 23.4 31.4 23 Q29.8 24.6 30.4 26.4 Z" fill="#4a3220"/>
   <ellipse cx="26.8" cy="34.4" rx=".95" ry="1.25" fill="#2a1c10"/><ellipse cx="31.6" cy="34.4" rx=".95" ry="1.25" fill="#2a1c10"/>
   <circle cx="27.1" cy="34" r=".35" fill="#fff"/><circle cx="31.9" cy="34" r=".35" fill="#fff"/>
   <ellipse cx="25.2" cy="36.4" rx="1.3" ry=".8" fill="#ff9a8a" opacity=".6"/><ellipse cx="33.2" cy="36.4" rx="1.3" ry=".8" fill="#ff9a8a" opacity=".6"/>
   <path d="M27.8 37 Q29.2 38.4 30.6 37" stroke="#a05a3a" stroke-width=".65" fill="none" stroke-linecap="round"/></g>
  <g class="tuSign"><path d="M66 41 L66 56.4" stroke="#9a734a" stroke-width="1.2"/><rect x="60.4" y="33.6" width="11.2" height="7.6" rx="1.2" fill="#fff6dd" stroke="#9a734a" stroke-width=".7"/>
   <text x="66" y="39" font-size="4.4" text-anchor="middle" fill="#e8463e" font-weight="bold" font-family="sans-serif">ABC</text></g>
  <g class="tuQ"><circle cx="11" cy="29" r="5.8" fill="#fff"/><path d="M14 33 L16.6 35.6 L12.6 34 Z" fill="#fff"/><text x="11" y="31.8" font-size="8" text-anchor="middle" fill="#e8463e" font-weight="bold" font-family="sans-serif">?</text></g>
</svg>`;
function spot(){let b=$('tuSpot');const w=$('window');if(!w)return;
  if(!b){b=document.createElement('button');b.id='tuSpot';b.setAttribute('aria-label','家庭教師の バイト（リクの パラソル）');b.innerHTML=SPOT;w.appendChild(b);
    b.onclick=e=>{e.stopPropagation();if(H.screen!=='home')return;SFX.talk();open()}}
  let d;try{d=SCENE.dbg()}catch(e){return}
  /* left end of the sand (moved from .24 in v123, so the radios have room). game.js sandSpots() keeps radios off this box */
  const k=d.k,wd=Math.round(60*k),x=Math.max(d.WW*.11,wd/2+4);b.style.width=wd+'px';
  b.style.left=Math.round(x-wd/2)+'px';b.style.top=Math.round(d.shore-d.WT+62*k-wd*57.4/72)+'px';
  const dk2=Math.max(0,Math.min(1,d.dark||0));b.style.setProperty('--dk',dk2.toFixed(2));
  b.classList.toggle('ask',paidLeft()>0);b.classList.toggle('off',H.screen!=='home')}
setTimeout(spot,600);addEventListener('resize',()=>setTimeout(spot,200));setInterval(spot,2500);
H.on('home',()=>setTimeout(spot,60));

/* ================================================================ the top: Riku under the parasol */
function kidLine(ja,cls=''){const en=enOf(ja);
  return `<div class="lsay kth tukid ${cls}"><span class="lface kf">${K.ico}</span><div class="lbody"><p class="${en?'tusay':''}">${esc(ja)}${en?`<button class="ksay" data-say="${esc(en)}" aria-label="もう一度 きく">🔊</button>`:''}</p></div></div>`}
function bindSay(root){root.querySelectorAll('[data-say]').forEach(b=>b.onclick=e=>{e.stopPropagation();talk(b.dataset.say)})}
function open(){if(!TD.met){TD.met=1;save();return top(K.hello[0])}top()}
function top(first){hush();const left=paidLeft(),line=first||pickL(left?K.top:K.topDone);
  H.show('tutor',`<section class="pnl tu">
    <div class="qtop"><button class="x" id="tux" aria-label="もどる">←</button><b>👦 家庭教師の バイト</b><span class="qn"></span></div>
    <div id="tuhi">${kidLine(line)}</div>
    <button id="tugo" class="tubig"><b>📒 リクに 教える</b><small>${left?`質問 ${NQ}つ・きょうの バイト代 あと ${left}回`:'きょうの バイト代は おしまい・教えるのは できるよ'}</small></button>
    <div class="row tur"><button id="tunote" class="sub">📒 教えた こと ${taughtN()?`<small>${taughtN()}</small>`:''}</button><button id="tufun" class="sub">😂 へんな英文 ${funN()?`<small>${funN()}</small>`:''}</button><button id="tugift" class="sub">🎁 お礼 ${giftN()?`<small>${giftN()}</small>`:''}</button></div>
    ${first?minaBox('tu_hello'):''}
    <details class="mfold"><summary>📊 きろく</summary><div class="zkrec"><span>📒 教えた こと <b>${taughtN()}/${TQ.length}</b></span><span>😂 へんな英文 <b>${funN()}/${funAll()}</b></span><span>💡 直して あげた <b>${TD.fix}</b>回</span><span>🧑‍🏫 バイト <b>${TD.n}</b>回${nextLetter()?`（あと ${nextLetter()-TD.n}回で 手紙？）`:''}</span><span>✉️ 手紙 <b>${(TD.letters||[]).length}/${(K.letters||[]).length}</b></span></div></details>
  </section>`);
  bindSay($('tuhi'));
  $('tux').onclick=()=>{SFX.back();hush();H.home()};
  $('tugo').onclick=()=>{SFX.lesson?SFX.lesson():SFX.step();play()};
  $('tunote').onclick=()=>{SFX.book();notebook(top)};
  $('tufun').onclick=()=>{SFX.book();funBook(top)};
  $('tugift').onclick=()=>{SFX.open();gifts(top)}}

/* ================================================================ one visit */
let P=null;
const live=()=>P&&$('tulog');
function play(){const qs=pick3();
  P={qs,i:0,firstOk:0,fix:0,newFun:[],funs:[],taught:[],tries:{},paid:paidLeft()>0};
  H.show('tutor',`<section class="pnl lsn kw tu" data-stay>
    <div class="qtop"><button class="x" id="tux" aria-label="やめる">←</button><b>👦 リクに 教える</b><span class="qn" id="tuq"></span></div>
    <div class="lslog kwlog" id="tulog"></div>
    <div id="tuans" class="kans"></div>
  </section>`);
  $('tux').onclick=()=>{SFX.back();hush();P=null;top()};
  setTimeout(intro,250)}
function scrollLog(){const l=$('tulog');if(l)l.scrollTo({top:l.scrollHeight,behavior:'smooth'})}
/* Riku says something (Japanese, with any English read aloud) */
function kid(ja,fx,cls='',en){if(!live())return;const d=document.createElement('div');en=en===undefined?enOf(ja):String(en).trim();
  d.className='lsay kth tukid '+cls;
  d.innerHTML=`<span class="lface kf">${K.ico}${fx?`<i class="kfx">${fx}</i>`:''}</span><div class="lbody"><p class="${en?'tusay':''}">${esc(ja)}${en?'<button class="ksay" aria-label="もう一度 きく">🔊</button>':''}</p></div>`;
  $('tulog').appendChild(d);const b=d.querySelector('.ksay');if(b)b.onclick=e=>{e.stopPropagation();talk(en)};
  if(en)talk(en);scrollLog()}
/* Riku tries the English: a big English line */
function kidEn(en,fx,cls=''){if(!live())return;const d=document.createElement('div');d.className='lsay kth tukid tuen '+cls;
  d.innerHTML=`<span class="lface kf">${K.ico}${fx?`<i class="kfx">${fx}</i>`:''}</span><div class="lbody"><p class="ken">${esc(en)}<button class="ksay" aria-label="もう一度 きく">🔊</button></p></div>`;
  $('tulog').appendChild(d);d.querySelector('.ksay').onclick=e=>{e.stopPropagation();talk(en)};talk(en);scrollLog()}
function you(t){if(!live())return;const d=document.createElement('div');d.className='lsay by-h kyou-b';
  d.innerHTML=`<span class="lface kf you">⭐</span><div class="lbody"><p>${esc(t)}</p></div>`;$('tulog').appendChild(d);scrollLog()}
function sys(h){if(!live())return;const d=document.createElement('p');d.className='tusys';d.innerHTML=h;$('tulog').appendChild(d);scrollLog()}
function whisper(t){if(!live())return;const d=document.createElement('div');d.className='lsay tuwh';const [ex]=mline('tu_peek');
  d.innerHTML=`<span class="lface">${MINA.face('m',ex||'think')}</span><div class="lbody"><small>🪟 まどの 外から こっそり…</small><p>${esc(t)}</p></div>`;
  $('tulog').appendChild(d);try{SFX.pickup()}catch(e){}scrollLog()}
function afterTalk(fn,gap=500,minMs=900){const t0=Date.now();
  const wait=()=>{if(!live())return;const busy=ST.sound&&window.speechSynthesis&&(talkOn||speechSynthesis.speaking||speechSynthesis.pending)&&Date.now()<talkMax;
    if(busy||Date.now()-t0<minMs){setTimeout(wait,150);return}setTimeout(fn,gap)};setTimeout(wait,150)}
/* the choices: [[label, sub?]…] → fn(index) */
function choices(list,fn,cls=''){if(!live())return;
  $('tuans').innerHTML=`<div class="lopts kopts tuopts ${cls}">${list.map((o,i)=>`<button data-o="${i}">${esc(o[0])}${o[1]?`<small>${esc(o[1])}</small>`:''}</button>`).join('')}</div>`;
  $('tuans').querySelectorAll('[data-o]').forEach(b=>b.onclick=()=>{$('tuans').innerHTML='';fn(+b.dataset.o)});
  setTimeout(()=>{const a=$('tuans');if(a)a.scrollIntoView({block:'nearest',behavior:'smooth'})},80)}

function intro(){const ops=shuffle(K.open).slice(0,3);
  kid(pickL(['せんせい、 来てくれた！','あ、 せんせい！ まってたよ','せんせい、 こっち こっち！']),'👋');
  afterTalk(()=>choices(ops.map(o=>[o[0]]),i=>{you(ops[i][0]);SFX.step();setTimeout(()=>{kid(ops[i][1],'😊');afterTalk(()=>ask())},500)}),300,600)}

/* ---------- a question ---------- */
function ask(){if(!live())return;const {q,tag}=P.qs[P.i];P.tries[q.id]=0;P.avail=shuffle(q.o.map((o,i)=>i));P.wr=0;
  $('tuq').textContent=`❓ ${P.i+1}/${P.qs.length}`;
  sys(`${KIND[q.k||'why']}${tag?'・'+TAG[tag]:''}<br>${esc(q.t)}`);
  kid(q.q,'🤔');
  afterTalk(()=>teach(),300,700)}
function teach(){const {q}=P.qs[P.i];
  choices(P.avail.map(i=>[q.o[i][0]]),k=>{const oi=P.avail[k],o=q.o[oi];you(o[0]);
    setTimeout(()=>o[1]?good():wrong(oi),550)},'tuteach')}

/* a right way to teach: Riku gets it and tries the English */
function good(){const {q}=P.qs[P.i],first=!P.tries[q.id];SFX.correct();
  if(first){P.firstOk++;TD.first[q.id]=(TD.first[q.id]||0)+1}
  TD.taught[q.id]=(TD.taught[q.id]||0)+1;if(!P.taught.includes(q))P.taught.push(q);save();
  kid(q.ok[0],'💡','k-good',' ');
  afterTalk(()=>{kidEn(q.ok[1],'🗣️','k-good');afterTalk(()=>{if(q.m&&Math.random()<.8)more();else next()},400)},300,500)}

/* a wrong way to teach: no failing. Riku helps, Mina whispers, or Riku says something funny and laughs */
function wrong(oi){const {q}=P.qs[P.i],o=q.o[oi];P.tries[q.id]++;P.avail=P.avail.filter(i=>i!==oi);P.wr++;
  try{SFX.tease?SFX.tease():SFX.pop()}catch(e){}
  let mode;
  if(P.wr>=2)mode='mina';
  else{const w=[['help',1],['mina',1]];if(o[2])w.push(['fun',2.2]);let r=Math.random()*w.reduce((a,x)=>a+x[1],0);mode=w.find(x=>(r-=x[1])<0)[0]}
  if(mode==='fun')return funny(q,oi);
  if(mode==='help'){kid(q.help,'🤔');afterTalk(()=>{kid(pickL(K.retry));afterTalk(teach,200,300)},300,600);return}
  /* Mina at the window */
  setTimeout(()=>{whisper(q.mina);setTimeout(()=>{kid(pickL(K.whisperHuh),'👀');afterTalk(teach,300,500)},1400)},300)}

/* Riku uses the wrong rule as it is: a funny English line, laughter, then "what is the right way?" */
function funny(q,oi){const o=q.o[oi];
  kid('じゃあ…','🤓');
  afterTalk(()=>{kidEn(o[2],'😂','k-oops');recFun(q.id+':'+oi);
    afterTalk(()=>{kid(pickL(K.laugh),'🤣','',' ');if(o[3])sys(`😂 ${esc(o[3])}`);
      afterTalk(()=>fix(q,o[2]),300,700)},300,500)},300,500)}
function fix(q,bad){kid(pickL(K.fixQ),'🙋');
  const others=q.o.filter(x=>x[2]&&x[2]!==bad).map(x=>x[2]);
  let opts=shuffle([q.ok[1],bad,...(others.length?[pickL(others)]:[])]);
  const go=()=>choices(opts.map(t=>[t]),k=>{const t=opts[k];you(t);
    setTimeout(()=>{if(t===q.ok[1]){SFX.correct();P.fix++;TD.fix++;
        TD.taught[q.id]=(TD.taught[q.id]||0)+1;if(!P.taught.includes(q))P.taught.push(q);save();
        kidEn(q.ok[1],'💡','k-good');afterTalk(()=>{kid(pickL(K.fixed)+(P.paid?' （おまけ +1まい）':''),'🥰');afterTalk(next,300)},300)}
      else{SFX.wrong();opts=opts.filter(x=>x!==t);kid(pickL(K.fixMiss),'🤔');
        if(opts.length>1)afterTalk(go,200,400);else afterTalk(()=>{whisper(q.mina);setTimeout(go,1200)},200,400)}},500)},'tufix');
  afterTalk(go,200,400)}

/* the follow-up: "then what about …?" */
function more(){const {q}=P.qs[P.i],m=q.m;let av=shuffle(m.o.map((o,i)=>i));
  kid(m.q,'🙋');
  const go=()=>choices(av.map(i=>[m.o[i][0]]),k=>{const oi=av[k],o=m.o[oi];you(o[0]);
    setTimeout(()=>{if(o[1]){SFX.correct();kid(m.ok[0],'😆','k-good',' ');afterTalk(()=>{kidEn(m.ok[1],'🗣️','k-good');afterTalk(next,400)},300,400)}
      else{SFX.tease?SFX.tease():SFX.pop();av=av.filter(i=>i!==oi);
        if(o[2]){const [fe,fj]=splitF(o[2]);kidEn(fe,'😂','k-oops');recFun(q.id+':m'+oi);afterTalk(()=>{kid((fj?fj+' ':'')+pickL(K.laugh)+' '+pickL(K.retry),'🤣','',' ');afterTalk(go,200,400)},300,500)}
        else{kid(pickL(K.moreMiss),'🤔');afterTalk(go,200,400)}}},500)},'tufix');
  afterTalk(go,200,500)}
function recFun(k){if(!P.funs.includes(k))P.funs.push(k);if(!TD.fun[k]){TD.fun[k]=1;P.newFun.push(k);save();
  setTimeout(()=>H.toast(`😂 へんな英文 はっけん！<small>図鑑 ${funN()}/${funAll()}</small>`,2200),700)}}
/* a little chat between the questions now and then */
function chat(fn){const C=K.chat||[];const left=C.filter(c=>!(TD.chat||[]).includes(c[0]));const c=pickL(left.length?left:C);if(!c)return fn();
  TD.chat=(TD.chat||[]).filter(x=>x!==c[0]).concat([c[0]]).slice(-Math.max(1,C.length-2));save();
  sys('☕ ひとやすみ');kid(c[0],'😄');
  afterTalk(()=>choices(c[1].map(o=>[o[0]]),i=>{you(c[1][i][0]);SFX.step();setTimeout(()=>{kid(c[1][i][1],'😆');afterTalk(fn,300,600)},500)}),300,600)}
function next(){if(!live())return;P.i++;if(P.i<P.qs.length){if(!P.chatted&&P.i<P.qs.length&&Math.random()<.55){P.chatted=1;return chat(()=>{kid('じゃあ つぎの 質問！','✋');afterTalk(ask,300,500)})}
  kid(pickL(['あと もう1つ！','つぎの 質問 いい？','ねえねえ、 もう1つ！']),'✋');afterTalk(ask,300,500)}else bye()}

/* ---------- the end ---------- */
function bye(){$('tuq').textContent='🏁';const ops=shuffle(K.bye).slice(0,3);
  kid('きょうは ここまで！ せんせい、 ありがとう！','😊');
  afterTalk(()=>choices(ops.map(o=>[o[0]]),i=>{you(ops[i][0]);SFX.step();setTimeout(()=>{kid(ops[i][1],ops[i][2]);afterTalk(finish,300,500)},500)}),300,500)}
function rollGift(){const w=TG.map(g=>[g,g[7]===1?6:g[7]===2?3:1]);let r=Math.random()*w.reduce((a,x)=>a+x[1],0);return w.find(x=>(r-=x[1])<0)[0]}
function finish(){if(!live())return;
  const paid=P.paid&&paidLeft()>0;let coins=0,gift=null;
  if(paid){TD.day={d:dk(),n:paidToday()+1};coins=PAY+Math.min(3,P.fix);gift=rollGift();TD.gifts[gift[0]]=(TD.gifts[gift[0]]||0)+1;TD.got[gift[0]]=(TD.got[gift[0]]||0)+1}
  TD.n++;TD.last=Date.now();const letter=(K.letters||[]).find(l=>l[0]===TD.n);if(letter){TD.letters=(TD.letters||[]).concat([letter[0]])}save();
  kid(paid?K.thanks:K.thanksFree,paid?'🎁':'👋');
  /* Mina */
  let k='tu_end',v={n:P.taught.length};
  if(P.firstOk===P.qs.length)k='tu_endPerfect';else if(P.fix)k='tu_endFix';else if(P.funs.length)k='tu_endFun';
  if(!paid)k=P.firstOk===P.qs.length?'tu_endPerfect':'tu_endFree';
  if(P.newFun.length&&Math.random()<.4){k='tu_endNewFun';v.e=funText(P.newFun[0])}
  if(Math.random()<.35){const kd=P.qs.map(x=>x.q.k).find(x=>x&&x!=='why');if(kd)k='tu_end_'+kd}
  const weak=P.qs.find(x=>x.tag==='weak');if(weak&&Math.random()<.6){k='tu_endWeak';v.t=weak.q.t}
  const rows=P.taught.map(q=>{const L=lesFor(q);return `<div class="tutr"><span><b>${esc(q.t)}</b><small>${esc(q.pt)}</small></span>${L?`<button class="sub" data-les="${L.id}" aria-label="授業を みなおす">📖</button>`:''}</div>`}).join('');
  setTimeout(()=>{if(!live())return;
    $('tuans').innerHTML=`<div class="kres">
      <p class="kend good">🧑‍🏫 教えた！ ${'⭐'.repeat(P.firstOk)}${'☆'.repeat(P.qs.length-P.firstOk)} <small>一発で ${P.firstOk}/${P.qs.length}</small></p>
      ${paid?`<p class="zkres">🪙 バイト代 <b>${PAY}まい</b>${P.fix?` ＋ おまけ <b>${Math.min(3,P.fix)}まい</b>`:''}</p>
        <p class="zkres tugot">${gift[1]} <b>${esc(gift[2])}</b> を もらった <small>ながれぎ雑貨店で 売れるよ</small></p>`
        :`<p class="zkres"><small>きょうの バイト代は おしまい（1日 ${PER_DAY}回まで）。 教えた ことは のこるよ</small></p>`}
      <details class="mfold" open><summary>📒 きょう 教えた こと</summary><div class="tutl">${rows}</div></details>
      ${P.funs.length?`<p class="tusys">😂 へんな英文 ${P.funs.length}こ${P.newFun.length?` <i class="zknew">NEW ${P.newFun.length}</i>`:''}</p>`:''}
      ${letter?`<button id="tulet" class="tulb">✉️ リクから 手紙も もらった！ <small>ひらく</small></button>`:''}
      ${minaBox(letter?'tu_letter':k,v)}
      <div class="row"><button id="tuagain" class="sub">🔁 もう一度</button><button id="tuback">👦 もどる</button></div>
    </div>`;
    SFX.done();if(coins){const r=$('tuans').getBoundingClientRect();H.coinBurst(r.left+r.width/2,r.top+30,coins)}
    $('tuans').querySelectorAll('[data-les]').forEach(b=>b.onclick=()=>{hush();P=null;SFX.lesson();LESSON.open(b.dataset.les,()=>top())});
    $('tuagain').onclick=()=>{SFX.step();play()};
    const lb=$('tulet');if(lb)lb.onclick=()=>{hush();P=null;SFX.book();readLetter(letter[0],()=>top())};
    $('tuback').onclick=()=>{SFX.back();hush();P=null;top()};
    setTimeout(()=>{const a=$('tuans');if(a)a.scrollIntoView({behavior:'smooth',block:'end'})},100)},900)}
function lesFor(q){try{return q.les.map(id=>LESSONS.find(l=>l.id===id)).find(Boolean)||null}catch(e){return null}}

/* ================================================================ 📒 what you taught / 😂 the funny English / 🎁 the presents */
function notebook(back){const T=TQ.filter(q=>TD.taught[q.id]);
  H.show('tutor',`<section class="pnl tu">
    <div class="qtop"><button class="x" id="tux" aria-label="もどる">←</button><b>📒 教えた こと</b><span class="qn">${T.length}/${TQ.length}</span></div>
    ${minaBox(T.length?'tu_note':'tu_noteNone',{n:T.length})}
    <div class="zkbag">${T.map(q=>{const L=lesFor(q);return `<div class="tutr"><span><b>${esc(q.t)}</b><small>${esc(q.pt)}</small><button class="tuex" data-say="${esc(q.ok[1])}">🔊 ${esc(q.ok[1])}</button></span>${L?`<button class="sub" data-les="${L.id}" aria-label="授業を みなおす">📖</button>`:''}</div>`}).join('')||'<p class="note">リクに 教えた ことが ここに たまるよ</p>'}</div>
  </section>`);
  bindSay(H.panel);
  H.panel.querySelectorAll('[data-les]').forEach(b=>b.onclick=()=>{SFX.lesson();LESSON.open(b.dataset.les,()=>notebook(back))});
  $('tux').onclick=()=>{SFX.back();back()}}
function funText(k){const [id,x]=k.split(':'),q=qById(id);if(!q)return '';if(x[0]==='m'){const o=q.m.o[+x.slice(1)];return o?splitF(o[2])[0]:''}const o=q.o[+x];return o?o[2]:''}
function funList(){return Object.keys(TD.fun).map(k=>{const [id,x]=k.split(':'),q=qById(id);if(!q)return null;
  if(x[0]==='m'){const o=q.m.o[+x.slice(1)];if(!o)return null;const [en,why]=splitF(o[2]);return {en,why,q,ok:q.m.ok[1]}}const o=q.o[+x];return o&&{en:o[2],why:o[3]||'',q,ok:q.ok[1]}}).filter(Boolean)}
function funBook(back){const F=funList();
  H.show('tutor',`<section class="pnl tu">
    <div class="qtop"><button class="x" id="tux" aria-label="もどる">←</button><b>😂 へんな英文 図鑑</b><span class="qn">${F.length}/${funAll()}</span></div>
    ${minaBox(F.length?'tu_fun':'tu_funNone',{n:F.length})}
    <div class="kfunl">${F.map(f=>`<div class="kfi"><span class="ki">${K.ico}</span><div><p class="kyou"><button class="tuex" data-say="${esc(f.en)}">「${esc(f.en)}」</button></p><p class="kre">${esc(f.why||f.q.t)} → <button class="tuex ok" data-say="${esc(f.ok)}">⭕ ${esc(f.ok)}</button></p></div></div>`).join('')||'<p class="note">わざと ちがう 教え方を すると、 リクが へんな 英文を 言って ここに たまるよ</p>'}</div>
  </section>`);
  bindSay(H.panel);$('tux').onclick=()=>{SFX.back();back()}}
function gifts(back){const G=TG.filter(g=>TD.gifts[g[0]]>0);
  H.show('tutor',`<section class="pnl tu">
    <div class="qtop"><button class="x" id="tux" aria-label="もどる">←</button><b>🎁 リクからの お礼</b><span class="qn">${giftN()}</span></div>
    ${minaBox(G.length?'tu_gifts':'tu_giftsNone',{})}
    <div class="zkbag">${G.map(g=>`<div class="ritem zkbi"><span class="ri">${g[1]}</span><span class="rn"><b>${esc(g[2])}</b><small>${TD.gifts[g[0]]}こ・雑貨店で 🪙${g[4]}くらい</small></span></div>`).join('')||'<p class="note">バイトの おわりに リクが くれるよ</p>'}</div>
    <div class="zkalb tual">${TG.map(g=>TD.got[g[0]]?`<button disabled><span>${g[1]}</span><small>${esc(g[2])}</small></button>`:`<button class="no" disabled><span>？</span><small>？？？</small></button>`).join('')}</div>
    ${G.length&&(window.ZAKKA||window.GIFT)?`<div class="row">${window.GIFT?'<button id="tugive">🎁 だれかに あげる</button>':''}${window.ZAKKA?'<button id="tusell" class="sub">🏚️ 雑貨店で 売る</button>':''}</div>`:''}
    ${(TD.letters||[]).length?`<details class="mfold" open><summary>✉️ リクからの 手紙 ${TD.letters.length}</summary><div class="tutl">${TD.letters.map(n=>`<button class="tuex" data-let="${n}">✉️ ${n}回目の 手紙</button>`).join('')}</div></details>`:''}
  </section>`);
  $('tux').onclick=()=>{SFX.back();back()};
  H.panel.querySelectorAll('[data-let]').forEach(b=>b.onclick=()=>{SFX.book();readLetter(+b.dataset.let,()=>gifts(back))});
  const s=$('tusell');if(s)s.onclick=()=>{SFX.shop();ZAKKA.play('sell')};
  const gv=$('tugive');if(gv)gv.onclick=()=>{SFX.open();GIFT.pick({back:()=>gifts(back)})}}

/* ✉️ a letter from Riku */
function readLetter(n,back){const l=(K.letters||[]).find(x=>x[0]===n);if(!l)return back();
  H.show('tutor',`<section class="pnl tu">
    <div class="qtop"><button class="x" id="tux" aria-label="もどる">←</button><b>✉️ リクからの 手紙</b><span class="qn">${n}回目</span></div>
    <div class="zkcard tuletter"><span class="zcp">👦</span><p class="bmEn">${esc(l[1])}</p><p class="bmJa" hidden>${esc(l[2])}</p>
      <div class="bmBtns"><button id="tus" class="sub">🔊 きく</button><button id="tuj" class="sub">日本語を 見る</button></div></div>
    ${minaBox('tu_letterRead',{})}
    <div class="row"><button id="tuok">もどる</button></div>
  </section>`);
  const say=()=>talk(l[1].replace(/Dear Sensei,/,'Dear Sensei.'));setTimeout(say,500);$('tus').onclick=say;
  $('tuj').onclick=e=>{SFX.pop();H.panel.querySelector('.bmJa').hidden=false;e.target.remove()};
  $('tux').onclick=$('tuok').onclick=()=>{SFX.back();hush();back()}}

/* ---------- for ながれぎ雑貨店: the presents can be sold to Nora ---------- */
const sellable=()=>TG.filter(g=>TD.gifts[g[0]]>0).map(g=>({id:'tu_'+g[0],tg:g[0],k:'tutor',ico:g[1],n:g[2],w:g[3],p:g[4],a:[g[5],g[6]]}));
function take(tg){if(TD.gifts[tg]>0){TD.gifts[tg]--;if(!TD.gifts[tg])delete TD.gifts[tg];save()}}

/* ================================================================ Mina */
Object.assign(MINA_LINES,{
 tu_first:[['wow','浜辺の 左の パラソル、 気づいた？ 近所の リクくんが 英語の 「なんで？」を かかえて まってるよ'],['smile','ねえ、 パラソルの 下に 男の子が いるでしょ？ 英語を 教えて あげると お礼が もらえるみたい']],
 tu_hello:[['happy','リクくん、 なんでも 「なんで？」って 聞く 子なの。 教える がわに なると いちばん おぼえるよ'],['smile','まちがえた 教え方でも だいじょうぶ。 わたしが まどの 外から こっそり 助けるね']],
 tu_peek:[['think','…'],['happy','…']],
 tu_end:[['happy','{n}つ 教えたね。 人に 教えると、 自分の 頭の 中も すっきり するでしょ'],['smile','リクくん、 うれしそう だったね。 教えた ことは 📒 に のこってるよ']],
 tu_endPerfect:[['wow','ぜんぶ 一発で 教えられたね！ もう りっぱな 先生だよ'],['proud','3つとも まよわず 教えられた。 ちゃんと 自分の ものに なってる しょうこだね']],
 tu_endFix:[['happy','へんな 英文から 正しい 文に 直して あげられたね。 まちがいを 直せるのは ほんとに わかってる 人だけだよ'],['smile','リクくん、 「ありがとう」って 言ってたね。 直す のも 立派な 教え方だよ']],
 tu_endFun:[['happy','リクくん、 大わらい してたね。 へんな 英文って、 正しい 形を おぼえる いちばんの 近道なんだ'],['think','わらった ところは 忘れにくいよ。 「どこが へんだったか」 思いだしてみて']],
 tu_endNewFun:[['happy','「{e}」 は わらったね！ 😂 図鑑に のこしておいたよ'],['happy','「{e}」…ふふっ。 へんな 英文 図鑑、 どんどん ふえてくね']],
 tu_endWeak:[['proud','「{t}」、 まえに まちがえた ところ だったよね。 いまは 人に 教えられるように なってる！'],['happy','まちがいノートの 「{t}」、 リクくんに 教えて ふくしゅう できたね']],
 tu_endFree:[['smile','きょうの バイト代は もう ないのに 教えて あげたの？ やさしいね。 ふくしゅうにも なってるよ'],['happy','お礼が なくても、 教えた ぶん だけ 力に なってるよ']],
 tu_note:[['smile','{n}こ 教えたね。 🔊で リクくんの 英文を 聞きなおすと ふくしゅうに なるよ'],['happy','📖 を おすと、 その 授業を みなおせるよ']],
 tu_noteNone:[['smile','リクくんに 教えた ことが ここに たまるよ']],
 tu_fun:[['happy','へんな 英文 {n}こ！ ⭕の 文と くらべて 読むと、 どこが ちがうか よく わかるよ'],['happy','どれも まちがい だけど、 ちょっと かわいいよね']],
 tu_funNone:[['smile','わざと ちがう 教え方を えらぶと、 リクくんが へんな 英文を 言うよ。 ためして みて']],
 tu_gifts:[['smile','リクくんの 手作り、 かわいいね。 ながれぎ雑貨店の ノラさんが 買いとって くれるよ'],['happy','リクくんの お礼、 だれかに プレゼント しても いいんだよ。 好きな 人が いるかも'],['happy','売る ときは 英語で。 「I\'d like to sell this.」 だよ']],
 tu_giftsNone:[['smile','バイトの おわりに リクくんが お礼を くれるよ']],
 tu_sold:[['happy','リクくんの {g}、 ノラさんが 大事に かざって くれるって'],['smile','売る 英語も ばっちり！ リクくんも よろこぶね']],
 tu_end_check:[['proud','リクくんの 宿題、 ちゃんと 直せたね。 人の まちがいに 気づけるのは、 自分が わかってる しょうこ'],['happy','宿題チェック、 先生みたい だったよ。 自分の 英語も 同じ 目で 見なおしてみてね']],
 tu_end_sound:[['smile','発音を 教えたね。 自分でも 声に 出して、 舌の いちを たしかめてみて'],['happy','音の ちがいって、 人に 説明すると 自分の 口も よく うごくように なるよ']],
 tu_end_word:[['happy','ことばの なりたちを 教えたね。 rain＋bow みたいに 分けると わすれにくいよ'],['smile','「英語で なんて いう？」に 答えられると、 たのしいよね']],
 tu_letter:[['love','リクくんから 手紙！？ よかったね。 英語で 書いて あるよ、 読んでみて'],['wow','手紙 もらったの？ リクくん、 せんせいの こと 大すき なんだね']],
 tu_letterRead:[['smile','リクくんの 英語、 教えた ことが ちゃんと 入ってるね。 🔊で 聞いてみて'],['love','手紙って うれしいね。 「Dear 〜,」で はじまって 「From 〜」で おわるのが 英語の 手紙の 形だよ']],
 x_tuLetter:[['smile','リクくんから 手紙が とどくかも。 あと {n}回 バイトしたら…？'],['happy','リクくん、 なにか 書いてる みたいだったよ。 あと {n}回で わかるかも']],
 /* ホーム・ミナ先生の ページで（game/mina-sense.js の ルール） */
 x_tuNone:[['think','浜辺の 左の パラソルに、 リクくんって 男の子が いるよ。 英語を 教えて あげて'],['wow','パラソルの 「？」、 見えた？ だれかが 質問を もって まってるよ']],
 x_tuWeak:[['think','リクくんが 「{t}」の ことで こまってる みたい。 まちがいノートの ところ だから、 教えたら ふくしゅうに なるよ'],['smile','「{t}」、 リクくんに 教えて あげたら 自分も 忘れなく なるよ']],
 x_tuToday:[['smile','リクくん、 きょうも 「なんで？」を ためて まってるよ。 バイト代は あと {n}回'],['happy','教える がわに まわると、 ならった ことが いちばん しっかり のこるんだ。 リクくんの ところ 行ってみる？']],
 x_tuGift:[['smile','リクくんの お礼が {n}こ あるね。 ノラさんの 雑貨店で 売れるよ'],['happy','{g}、 雑貨店に もっていくと 英語で 売れるよ']],
 x_tuFun:[['happy','へんな英文 図鑑、 {n}こ たまったね。 「{e}」 は わらったなあ'],['happy','リクくんの へんな 英文、 また 聞きたいな。 「{e}」 とか']],
});
const goTu=()=>['👦 リクの ところへ',open];
if(window.MINA_SENSE&&MINA_SENSE._rules)MINA_SENSE._rules.push(
 ['x_tuNone',4,()=>!TD.met?{}:null,goTu],
 ['x_tuWeak',3,()=>{if(!TD.met||!paidLeft())return null;const st=studied(),q=TQ.find(q=>tagOf(q,st)==='weak');return q?{t:q.t}:null},goTu],
 ['x_tuToday',2,()=>TD.met&&paidLeft()&&Date.now()-TD.last>3*3600e3?{n:paidLeft()}:null,goTu],
 ['x_tuGift',2,()=>{const G=sellable();return G.length?{n:giftN(),g:G[0].n}:null},()=>window.ZAKKA?['🏚️ 雑貨店へ',()=>ZAKKA.play('sell')]:goTu()],
 ['x_tuLetter',1,()=>{const nl=nextLetter();return TD.met&&nl&&nl-TD.n<=2?{n:nl-TD.n}:null},goTu],
 ['x_tuFun',1,()=>{const F=funList();if(!F.length)return null;return {n:F.length,e:pickL(F).en}},()=>['😂 図鑑を 見る',()=>funBook(H.home)]]);
/* the first time: Mina points at the parasol once */
setTimeout(function first(){if(TD.met||TD.told)return;const m=window.MINA;if(!m||!m.canAnnounce||!m.canAnnounce())return setTimeout(first,20000);
  TD.told=1;save();const [ex,tx]=mline('tu_first');m.say('m',ex,tx,9000,null,['👦 行ってみる',open])},70000);

window.TUTOR={open,top,play,notebook,funBook,gifts,rec:()=>TD,sellable,take,funList,funN,funAll,qs:TQ,_spot:spot,_pick:pick3};
})();
