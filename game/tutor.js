/* 家庭教師の バイト: 浜辺の 近所の 子 リク（👦 8さい・ずっと 子どものまま）に 英語を 教える。
   - 浜辺の 左がわの パラソル（#window の 中の 小さな 絵）を タップすると ひらく。質問が ある ときは 「？」が ゆれる
   - 1回の バイト = リクの 質問 3つ。これまでに ならった 授業・文法・まちがいノートの ところから えらぶ（にがて → ならった → いまの レベル）。
     いちど 出た 質問は ぜんぶ 一巡するまで 出ない
   - 教え方を えらぶ。正しいと リクが 「わかった！」と 英語を 言ってみて、ときどき 「じゃあ 〜は？」と つづきを 聞く
   - まちがえても 失敗には ならない。かわりに 3つの どれかが おきる:
       リクの 助け舟（「でも 教科書には…」→ えらびなおし）/ ミナ先生が まどの 外から こっそり ヒント /
       リクが その 教え方で へんな 英文を 言って 大わらい → 「ほんとは？」で 正しい 文を えらぶと 「ありがとう！」と おまけ
   - 教えた あとに: 📒 リクの ノートの みだしを えらぶ（ノートは たまって 見かえせる）・📝 宿題プリント（ならべかえ・穴うめ）
   - べつの 日に リクが 教えた 英語を 自分で つかってくる（あってる？ ちがう？ → ちがえば 直す。まちがえても 失敗なし）
   - 👩‍🏫 参観日: ミナ先生が うしろで 見学して、1問ごとに ほめる・アドバイス。おわりに 参観ノート
   - リクの へんな 英文は その場で わらって 直すだけ（図鑑は ない。memFun で たまに 思い出す）
   - 🤔 わからない: どの 選択肢にも 「わからない」が ある。失敗には ならず、リクと いっしょに ミナ先生の 本で しらべて 答えと 短い 解説。
     しらべた 質問は つぎの 回から 「この前 いっしょに しらべた」で もう一度 出る（教えられたら 卒業）
   - バイト代は まちがえても へらない。1日 3回まで コイン＋お礼の 品（ながれぎ雑貨店で 売れる）。4回目からも 教えられる
   中身: game/tutor-data.js。ミナ先生の セリフは この ファイルの さいごに ある */
(()=>{
const {S:ST,sfx:SFX}=BEACH;
const H=HE,esc=H.esc,$=id=>document.getElementById(id);
const TQ=TUTOR_Q,TG=TUTOR_GIFTS,K=TUTOR_KID,TX=typeof TUTOR_TEACH!=='undefined'?TUTOR_TEACH:{},KEN=typeof TUTOR_KEN!=='undefined'?TUTOR_KEN:{n:'ケン',ico:'🧒',v:{p:1.32,r:1.04}},CH=typeof TUTOR_CHATS!=='undefined'?TUTOR_CHATS:[];
const pickL=a=>a[Math.random()*a.length|0];
/* the faces: Riku (brown hair with a cowlick, yellow T-shirt) and Ken (blue cap, tan, a big grin) — drawn so they never look the same */
const FACE={
 riku:`<svg class="tuface" viewBox="0 0 40 40" aria-label="リク"><rect width="40" height="40" fill="#ffe9b8"/><path d="M7 40 Q8 33 20 33 Q32 33 33 40Z" fill="#ffcf4a"/><path d="M17 33.4 L20 36 L23 33.4" fill="none" stroke="#e0a92e" stroke-width=".9"/>
  <circle cx="8.6" cy="22.6" r="2.3" fill="#f3c9a0"/><circle cx="31.4" cy="22.6" r="2.3" fill="#f3c9a0"/><circle cx="20" cy="22" r="11.4" fill="#f3c9a0"/>
  <path d="M8.4 21.4 Q7.4 9.2 20 9.4 Q32.6 9.2 31.6 21.4 Q29 15.4 24 16.6 Q21.6 13.8 17.4 16.2 Q12.4 15.2 8.4 21.4Z" fill="#6b4425"/><path d="M19.4 9.8 Q18.6 4.8 23.8 4.4 Q21 7.2 22.2 9.8Z" fill="#6b4425"/>
  <ellipse cx="15.8" cy="23" rx="1.45" ry="1.95" fill="#2a1c10"/><ellipse cx="24.2" cy="23" rx="1.45" ry="1.95" fill="#2a1c10"/><circle cx="16.3" cy="22.3" r=".55" fill="#fff"/><circle cx="24.7" cy="22.3" r=".55" fill="#fff"/>
  <ellipse cx="12.6" cy="27" rx="2.2" ry="1.25" fill="#ff9a8a" opacity=".6"/><ellipse cx="27.4" cy="27" rx="2.2" ry="1.25" fill="#ff9a8a" opacity=".6"/>
  <path d="M17.4 28.2 Q20 30.8 22.6 28.2" fill="none" stroke="#a05a3a" stroke-width="1" stroke-linecap="round"/></svg>`,
 ken:`<svg class="tuface" viewBox="0 0 40 40" aria-label="ケン"><rect width="40" height="40" fill="#cfe8ff"/><path d="M7 40 Q8 33 20 33 Q32 33 33 40Z" fill="#4cbf7a"/><path d="M14 33.6 L14 40 M26 33.6 L26 40" stroke="#2f9a5c" stroke-width="1.4"/>
  <circle cx="8.6" cy="22.6" r="2.3" fill="#d9a273"/><circle cx="31.4" cy="22.6" r="2.3" fill="#d9a273"/><circle cx="20" cy="22" r="11.4" fill="#d9a273"/>
  <path d="M8.8 20 L9.6 16.4 L11.2 19 L12 15.8 M31.2 20 L30.4 16.4 L28.8 19" fill="#1d1a1a" stroke="#1d1a1a" stroke-width="1.6" stroke-linejoin="round"/>
  <path d="M8.2 17.4 Q8.6 7.4 20 7.2 Q31.4 7.4 31.8 17.4Z" fill="#2f6fd6"/><path d="M8.2 17.4 Q20 15.4 31.8 17.4 L37.6 18.6 Q37 20.6 31 19.6 Q20 18 8.2 19.4Z" fill="#1f4fa8"/><circle cx="20" cy="7.6" r="1.2" fill="#1f4fa8"/><path d="M17 11 Q20 9.6 23 11" stroke="#ffd23f" stroke-width="1.4" fill="none"/>
  <path d="M14.2 23.4 Q15.8 21.6 17.4 23.4 M22.6 23.4 Q24.2 21.6 25.8 23.4" fill="none" stroke="#2a1c10" stroke-width="1.3" stroke-linecap="round"/>
  <rect x="25.6" y="25.4" width="4.6" height="2" rx=".9" fill="#f6dcb4" transform="rotate(-24 27.9 26.4)"/>
  <path d="M15.6 27.4 Q20 33 24.4 27.4Z" fill="#7a2e22"/><rect x="18.4" y="27.4" width="3.2" height="1.6" fill="#fff"/></svg>`};
const shuffle=a=>H.shuffle?H.shuffle(a.slice()):a.slice().sort(()=>Math.random()-.5);
const LV=['es','jh','hs','adv'];
const PAY=10,PER_DAY=3,NQ=3;
const KID={p:1.22,r:1},MINAV={p:1.25,r:.95};
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
function pick3(NQ=3,mode=''){const st=studied(),me=LV.indexOf(myLv());
  let pool=TQ.filter(q=>LV.indexOf(q.lv)<=Math.max(0,me)||tagOf(q,st));
  if(pool.length<NQ)pool=TQ.slice();
  let fresh=pool.filter(q=>!TD.seen.includes(q.id));
  if(fresh.length<NQ){TD.seen=TD.seen.filter(id=>!pool.some(q=>q.id===id));fresh=pool.slice()}
  const by=t=>shuffle(fresh.filter(q=>tagOf(q,st)===t));
  const W=by('weak'),D=by('did'),O=by('');
  const out=[];const add=q=>{if(q&&out.length<NQ&&!out.includes(q))out.push(q)};
  /* homework day: Riku's homework sheets first */
  if(mode==='hw')shuffle(fresh.filter(q=>q.k==='check')).concat(shuffle(pool.filter(q=>q.k==='check'))).slice(0,2).forEach(add);
  add(W[0]);D.forEach(add);W.slice(1).forEach(add);O.forEach(add);
  out.forEach(q=>TD.seen.push(q.id));save();
  const res=(mode==='hw'?out.slice(0,1).concat(shuffle(out.slice(1))):shuffle(out)).map(q=>({q,tag:tagOf(q,st)}));
  /* "I forgot…": now and then one thing you taught a while ago comes back (spaced review) */
  if(mode!=='hw'&&Math.random()<.45){const old=shuffle(TQ.filter(q=>TD.taught[q.id]&&!out.includes(q)&&Date.now()-((TD.when||{})[q.id]||0)>20*3600e3));
    if(old.length){res[res.length-1]={q:old[0],tag:tagOf(old[0],st),again:1}}}
  /* 🔎 the ones you looked up together come back on a later visit (the oldest first) */
  const dk=Object.entries(TD.dunno||{}).filter(([id,t])=>Date.now()-t>15*60e3&&qById(id)&&!res.some(x=>x.q.id===id)).sort((a,b)=>a[1]-b[1]);
  if(mode!=='hw'&&dk.length){const q=qById(dk[0][0]);res[res.length-1]={q,tag:tagOf(q,st),again:'dk'}}
  return res}

/* ---------- voice: Riku high and bright (only the English is read) ---------- */
/* a real child's voice if the device has one (Microsoft Ana / Apple Junior); otherwise a soft voice that is not Mio's, only a little higher (very high pitch sounded strange) */
let enVoice=null,kenVoice=null,kidReal=0,kenReal=0;
function pickVoice(){if(!window.speechSynthesis)return;const vs=speechSynthesis.getVoices().filter(v=>/^en[-_]/i.test(v.lang));if(!vs.length)return;
  const kidV=['Ana','Junior','Ivy','Justin','Kevin'].map(n=>vs.find(v=>new RegExp('\\b'+n+'\\b').test(v.name))).filter(Boolean);
  const mio=(()=>{try{return MIO.voice()}catch(e){return null}})();
  const soft=vs.filter(v=>v!==mio&&/en[-_]US/i.test(v.lang)&&/Natural|Online|Neural|Google|Aria|Jenny|Samantha|Allison|Ava|Zira/i.test(v.name)&&!/Male|Guy|Davis|Tony|Jason|Fred|Alex\b|Daniel|Rishi/i.test(v.name));
  const any=vs.filter(v=>v!==mio&&/en[-_]US/i.test(v.lang));
  enVoice=kidV[0]||soft[0]||any[0]||vs[0];kidReal=kidV[0]?1:0;
  kenVoice=kidV[1]||(kidV[0]&&kidV[0]!==enVoice?kidV[0]:null)||soft.find(v=>v!==enVoice)||any.find(v=>v!==enVoice)||enVoice;kenReal=kidV.includes(kenVoice)?1:0}
if(window.speechSynthesis){pickVoice();speechSynthesis.addEventListener&&speechSynthesis.addEventListener('voiceschanged',pickVoice)}
let talkOn=false,talkId=0,talkMax=0;
function talk(en,c){if(!ST.sound||!window.speechSynthesis||!en)return;
  try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(sayNames(en).replace(/\.\.\.\s*/g,' '));u.lang='en-US';const isKen=c&&c===KEN.v,vv=isKen?kenVoice:enVoice,real=isKen?kenReal:kidReal;if(vv)u.voice=vv;
    u.pitch=Math.max(.5,Math.min(2,real?1+((c||KID).p-1.3)*.4:(c||KID).p));u.rate=(ST.slow?.74:.95)*(c||KID).r;u.volume=Math.min(1,(ST.vol&&ST.vol.voice!=null)?ST.vol.voice:1);
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
  <g class="tuLantern"><path d="M41 17.4 V20.4" stroke="#6b4a2a" stroke-width=".4"/><path d="M39.8 20.4 H42.2 L42.6 21.2 V24.4 L42 25 H40 L39.4 24.4 V21.2 Z" fill="#c9952a" stroke="#6b4a2a" stroke-width=".35"/><rect x="40" y="21.4" width="2" height="2.8" rx=".4" fill="#f4e6c4"/></g>
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
/* the night light: a little lantern under the parasol, drawn outside the darkening filter (opacity follows --dk) */
const SPOT_GLOW=`<svg viewBox="0 0 72 60" aria-hidden="true">
  <defs><radialGradient id="tuGlow"><stop offset="0" stop-color="rgba(255,210,140,.7)"/><stop offset="1" stop-color="rgba(255,210,140,0)"/></radialGradient></defs>
  <ellipse cx="36" cy="53" rx="24" ry="5" fill="url(#tuGlow)" opacity=".5"/>
  <ellipse cx="38" cy="34" rx="20" ry="17" fill="url(#tuGlow)" opacity=".75"/>
  <g class="tuFlame"><circle cx="41" cy="22.8" r="6" fill="url(#tuGlow)"/><rect x="40" y="21.4" width="2" height="2.8" rx=".4" fill="#fff0c0"/></g>
</svg>`;
function spot(){let b=$('tuSpot');const w=$('window');if(!w)return;
  if(!b){b=document.createElement('button');b.id='tuSpot';b.setAttribute('aria-label','家庭教師の バイト（リクの パラソル）');b.innerHTML=`<span class="tuBody">${SPOT}</span><span class="tuGlow">${SPOT_GLOW}</span>`;w.appendChild(b);
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
  return `<div class="lsay kth tukid ${cls}"><span class="lface kf">${FACE.riku}</span><div class="lbody"><p class="${en?'tusay':''}">${esc(ja)}${en?`<button class="ksay" data-say="${esc(en)}" aria-label="もう一度 きく">🔊</button>`:''}</p></div></div>`}
function bindSay(root){root.querySelectorAll('[data-say]').forEach(b=>b.onclick=e=>{e.stopPropagation();talk(b.dataset.say)})}
function open(){if(!TD.met){TD.met=1;save();return top(K.hello[0])}top()}
function memT(){const T=TQ.filter(q=>TD.taught[q.id]);return T.length?pickL(T):null}
function top(first){hush();const left=paidLeft(),mq=memT();
  const line=first||(mq&&K.topMem&&Math.random()<.3?pickL(K.topMem).replace('{t}',mq.t):pickL(left?K.top:K.topDone));
  H.show('tutor',`<section class="pnl tu">
    <div class="qtop"><button class="x" id="tux" aria-label="もどる">←</button><b>👦 家庭教師の バイト</b>${window.GIFT?GIFT.btn('riku','tugv'):'<span class="qn"></span>'}</div>
    <div id="tuhi">${kidLine(line)}</div>
    <button id="tugo" class="tubig"><b>📒 リクに 教える</b><small>${left?`きょうの バイト代 あと ${left}回`:'きょうの バイト代は おしまい・教えるのは できるよ'}</small></button>
    <div class="row tur"><button id="tunote" class="sub">📒 リクの ノート ${taughtN()?`<small>${taughtN()}</small>`:''}</button><button id="tugift" class="sub">🎁 お礼 ${giftN()?`<small>${giftN()}</small>`:''}</button></div>
    ${first?minaBox('tu_hello'):''}
    <details class="mfold"><summary>📊 きろく</summary><div class="zkrec"><span>📒 教えた こと <b>${taughtN()}/${TQ.length}</b></span><span>💡 直して あげた <b>${TD.fix}</b>回</span><span>🧑‍🏫 バイト <b>${TD.n}</b>回${nextLetter()?`（あと ${nextLetter()-TD.n}回で 手紙？）`:''}</span><span>✉️ 手紙 <b>${(TD.letters||[]).length}/${(K.letters||[]).length}</b></span><span>☕ おしゃべり <b>${Object.keys(TD.talks||{}).filter(id=>CH.some(c=>c.id===id)).length}/${CH.length}</b></span>${TD.quizN?`<span>🎤 リクの クイズ <b>${TD.quizOk||0}/${TD.quizN}</b>もん せいかい</span>`:''}${TD.kenN?`<span>🧢 ケンにも 教えた <b>${TD.kenN}</b>回</span>`:''}</div></details>
  </section>`);
  bindSay($('tuhi'));
  $('tux').onclick=()=>{SFX.back();hush();H.home()};
  $('tugo').onclick=()=>{SFX.lesson?SFX.lesson():SFX.step();play()};
  $('tunote').onclick=()=>{SFX.book();notebook(top)};
  $('tugift').onclick=()=>{SFX.open();gifts(top)};
  if(window.GIFT)GIFT.bindBtn('riku','tugv',()=>top())}

/* ================================================================ one visit */
let P=null;
const live=()=>P&&$('tulog');
/* what kind of day it is (most days are ordinary) */
function pickDay(){if(TD.n<2)return 'normal';
  const w=[['normal',50],['ken',13],['hw',10],['short',8],['pochi',9]];if(TD.n>=3)w.push(['visit',10]);if(taughtN()>=4)w.push(['quiz',12]);
  if(TD.lastDay&&TD.lastDay!=='normal')w.forEach(x=>{if(x[0]===TD.lastDay)x[1]=0});
  let r=Math.random()*w.reduce((a,x)=>a+x[1],0);return w.find(x=>(r-=x[1])<0)[0]}
function play(){const day=(window.TUTOR&&TUTOR._force)||pickDay();TD.lastDay=day;
  const qs=pick3(day==='short'||day==='quiz'?(day==='quiz'?1:2):3,day);
  P={qs,i:0,day,firstOk:0,fix:0,newFun:[],funs:[],taught:[],tries:{},paid:paidLeft()>0,quiz:null,ken:0,talk:null,again:[],dunno:[],dunnoBack:[],res:{},notes:[],prints:0,uses:null,visit:[]};
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
  d.innerHTML=`<span class="lface kf">${FACE.riku}${fx?`<i class="kfx">${fx}</i>`:''}</span><div class="lbody"><p class="${en?'tusay':''}">${esc(ja)}${en?'<button class="ksay" aria-label="もう一度 きく">🔊</button>':''}</p></div>`;
  $('tulog').appendChild(d);const b=d.querySelector('.ksay');if(b)b.onclick=e=>{e.stopPropagation();talk(en)};
  if(en)talk(en);scrollLog()}
/* Riku tries the English: a big English line */
function kidEn(en,fx,cls=''){if(!live())return;const d=document.createElement('div');d.className='lsay kth tukid tuen '+cls;
  d.innerHTML=`<span class="lface kf">${FACE.riku}${fx?`<i class="kfx">${fx}</i>`:''}</span><div class="lbody"><p class="ken">${esc(en)}<button class="ksay" aria-label="もう一度 きく">🔊</button></p></div>`;
  $('tulog').appendChild(d);d.querySelector('.ksay').onclick=e=>{e.stopPropagation();talk(en)};talk(en);scrollLog()}
/* Ken (Riku's friend), Mom (far away), Pochi (the dog) */
function ken(ja,fx,en){if(!live())return;const d=document.createElement('div');en=en===undefined?enOf(ja):String(en).trim();d.className='lsay kth tukid tuken';
  d.innerHTML=`<span class="lface kf">${FACE.ken}${fx?`<i class="kfx">${fx}</i>`:''}</span><div class="lbody"><small>${KEN.n}</small><p class="${en?'tusay':''}">${esc(ja)}${en?'<button class="ksay" aria-label="もう一度 きく">🔊</button>':''}</p></div>`;
  $('tulog').appendChild(d);const b=d.querySelector('.ksay');if(b)b.onclick=e=>{e.stopPropagation();talk(en,KEN.v)};if(en)talk(en,KEN.v);scrollLog()}
function kenEn(en,fx,cls=''){if(!live())return;const d=document.createElement('div');d.className='lsay kth tukid tuken tuen '+cls;
  d.innerHTML=`<span class="lface kf">${FACE.ken}${fx?`<i class="kfx">${fx}</i>`:''}</span><div class="lbody"><small>${KEN.n}</small><p class="ken">${esc(en)}<button class="ksay" aria-label="もう一度 きく">🔊</button></p></div>`;
  $('tulog').appendChild(d);d.querySelector('.ksay').onclick=e=>{e.stopPropagation();talk(en,KEN.v)};talk(en,KEN.v);scrollLog()}
function far(ico,name,t){if(!live())return;const d=document.createElement('div');d.className='lsay kth tufar';
  d.innerHTML=`<span class="lface kf">${ico}</span><div class="lbody"><small>${name}</small><p>${esc(t)}</p></div>`;$('tulog').appendChild(d);scrollLog()}
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
/* dk: "🤔 わからない" — saying you don't know is never a failure */
function choices(list,fn,cls='',dk){if(!live())return;
  $('tuans').innerHTML=`<div class="lopts kopts tuopts ${cls}">${list.map((o,i)=>`<button data-o="${i}">${esc(o[0])}${o[1]?`<small>${esc(o[1])}</small>`:''}</button>`).join('')}${dk?'<button class="tudk" data-dk="1">🤔 わからない</button>':''}</div>`;
  $('tuans').querySelectorAll('[data-o]').forEach(b=>b.onclick=()=>{$('tuans').innerHTML='';fn(+b.dataset.o)});
  const d=$('tuans').querySelector('[data-dk]');if(d)d.onclick=()=>{$('tuans').innerHTML='';dk()};
  setTimeout(()=>{const a=$('tuans');if(a)a.scrollIntoView({block:'nearest',behavior:'smooth'})},80)}

function partOfDay(){const h=(typeof GH==='function'?GH():new Date().getHours());return h<5?'night':h<11?'morning':h<16?'day':h<19?'evening':'night'}
function hiLine(){const T=(K.hiTime||{})[partOfDay()];return T&&Math.random()<.4?pickL(T):pickL(K.hi)}
const DAYNAME={get visit(){return MICO()+' きょうは ミナ先生の 参観日'},quiz:'🎤 きょうは リクの クイズの日',ken:'🧢 きょうは ケンも いっしょ',hw:'✏️ きょうは 宿題の日',short:'🏃 きょうは ちょっとだけ',pochi:'🐕 きょうは ポチも いっしょ'};
function intro(){const d=P.day;if(DAYNAME[d])sys(DAYNAME[d]);
  const greet=then=>{const ops=shuffle(K.open).slice(0,3);
    afterTalk(()=>choices(ops.map(o=>[o[0]]),i=>{you(ops[i][0]);SFX.step();setTimeout(()=>{kid(ops[i][1],'😊');afterTalk(then)},500)}),300,600)};
  if(d==='short'){kid(pickL(K.shortHi),'🏃');return afterTalk(ask,300,600)}
  kid(hiLine(),'👋');
  if(d==='quiz')return afterTalk(()=>{kid(pickL(K.quizHi),'🎤');afterTalk(quiz,300,500)},300,500);
  if(d==='hw')return afterTalk(()=>{kid(pickL(K.hwHi),'✏️');afterTalk(ask,300,600)},300,500);
  if(d==='ken')return afterTalk(()=>{kid(pickL(K.kenIntro),'😊');afterTalk(()=>{ken(pickL(K.kenHi),'👋');
    afterTalk(()=>choices([['よろしくね、 ケン'],['Nice to meet you, Ken!'],['2人とも よろしく']],i=>{you(['よろしくね、 ケン','Nice to meet you, Ken!','2人とも よろしく'][i]);
      setTimeout(()=>{ken(['よろしく！ ぼくにも 教えてね！','ナイス トゥ ミート ユー トゥー！ …って 言うんだよね？','よろしく〜！ リク、 さっそく 質問 しなよ'][i],'😆');afterTalk(ask,300,500)},500)}),300,500)},300,500)},300,500);
  if(d==='visit')return afterTalk(()=>{kid(pickL(K.visitHi),'😳');afterTalk(()=>{mina(mline('tu_visitHi')[1]);afterTalk(()=>memory(ask),300,1600)},300,500)},300,500);
  if(d==='pochi')return afterTalk(()=>{kid(pickL(K.pochiHi),'🐕');setTimeout(()=>{far('🐕','ポチ','ワン！');setTimeout(()=>greet(ask),600)},900)},300,500);
  greet(()=>memory(ask))}

/* ---------- Riku remembers: something you taught before, or a funny line he once said ---------- */
function memory(fn){const T=TQ.filter(q=>TD.taught[q.id]),F=funList();
  if(T.length&&Math.random()<.45){const old=T.filter(q=>!P.qs.some(x=>x.q===q));if(old.length)return useCheck(pickL(old),fn)}
  if(T.length<2||Math.random()>.4)return fn();
  if(F.length&&Math.random()<.35){const f=pickL(F),ops=K.memFunRe;
    kid(pickL(K.memFun).replace('{e}',f.en),'😆','',' ');
    return afterTalk(()=>choices(ops.map(o=>[o[0]]),i=>{const o=ops[i];you(o[0]);SFX.step();
      setTimeout(()=>{kid(o[1].replace('{e}',f.en).replace('{ok}',f.ok),'😆','',' ');if(o[2])afterTalk(()=>{kidEn(f.ok,'🗣️','k-good');afterTalk(fn,300,500)},300,400);else afterTalk(fn,300,600)},500)}),300,500)}
  const q=pickL(T),ops=shuffle(K.memUsedRe).slice(0,3);
  kid(pickL(K.memUsed).replace('{t}',q.t),'😄','',' ');
  afterTalk(()=>{kidEn(q.ok[1],'🗣️','k-good');
    afterTalk(()=>choices(ops.map(o=>[o[0]]),i=>{const o=ops[i];you(o[0]);SFX.step();
      setTimeout(()=>{const t=o[1].includes('{en}')?o[1].replace('{en}',q.ok[1]):o[1];kid(t,'🥰','',o[1].includes('{en}')?q.ok[1]:' ');P.mem=q;afterTalk(fn,300,600)},500)}),300,500)},300,500)}

/* ---------- 🎤 quiz day: Riku quizzes you on what you taught him ---------- */
function quiz(){const T=shuffle(TQ.filter(q=>TD.taught[q.id]&&!P.qs.some(x=>x.q===q))).sort((a,b)=>((TD.when||{})[a.id]||0)-((TD.when||{})[b.id]||0)).slice(0,3);
  P.quiz={n:T.length,ok:0};let i=0;
  const one=()=>{if(!live())return;if(i>=T.length)return done();const q=T[i++];
    $('tuq').textContent=`🎤 ${i}/${T.length}`;
    const bad=q.o.filter(o=>o[2]).map(o=>o[2]);const opts=shuffle([q.ok[1]].concat(shuffle(bad).slice(0,2)));
    kid(pickL(K.quizQ).replace('{t}',q.t),'🎤','',' ');
    afterTalk(()=>choices(opts.map(t=>[t]),k=>{const t=opts[k];you(t);
      setTimeout(()=>{if(t===q.ok[1]){SFX.correct();P.quiz.ok++;kid(pickL(K.quizRight),'😲','k-good',' ');afterTalk(one,300,500)}
        else{try{SFX.tease?SFX.tease():SFX.pop()}catch(e){}kid(pickL(K.quizWrong),'😆','',' ');
          afterTalk(()=>{kid(pickL(K.quizAns),'🙋','',' ');afterTalk(()=>{kidEn(q.ok[1],'💡','k-good');afterTalk(one,300,500)},200,300)},300,500)}},500)},'tufix',
      ()=>{you(pickL(K.dunnoSay));SFX.step();setTimeout(()=>{kid(pickL(K.quizDunno),'😏','',' ');
        afterTalk(()=>{kid(pickL(K.quizAns),'🙋','',' ');afterTalk(()=>{kidEn(q.ok[1],'💡','k-good');afterTalk(()=>{kid(pickL(K.quizDunnoPt).replace('{p}',q.pt),'☝️','',' ');afterTalk(one,300,500)},300,400)},200,300)},300,500)},500)}),300,500)};
  const done=()=>{TD.quizN=(TD.quizN||0)+P.quiz.n;TD.quizOk=(TD.quizOk||0)+P.quiz.ok;save();
    kid(pickL(K.quizEnd).replace('{n}',P.quiz.ok),'🏆','',' ');afterTalk(()=>{kid(pickL(K.quizThen),'🙋','',' ');afterTalk(ask,300,500)},300,500)};
  one()}

/* ---------- a question ---------- */
/* this time's wording of each way to teach (right ones and wrong ones come in several lengths, so the long one is not always right) */
function labels(q){const x=TX[q.id]||{};return q.o.map((o,i)=>pickL([o[0]].concat(o[1]?(x.c||[]):((x.w||{})[i]||[]))))}
/* "I got it!" — not always the same word */
function gotLine(t){t=String(t);return /^わかった！/.test(t)&&Math.random()<.7?t.replace(/^わかった！/,pickL(K.got)):t}
function ask(){if(!live())return;const {q,tag}=P.qs[P.i];P.tries[q.id]=0;P.avail=shuffle(q.o.map((o,i)=>i));P.wr=0;P.peek=0;P.lab=labels(q);
  $('tuq').textContent=`❓ ${P.i+1}/${P.qs.length}`;
  const ag=P.qs[P.i].again;
  sys(`${ag==='dk'?'🔎 この前 いっしょに しらべた':ag?'🔁 わすれちゃった':KIND[q.k||'why']}${!ag&&tag?'・'+TAG[tag]:''}<br>${esc(q.t)}`);
  if(ag){kid(pickL(ag==='dk'?K.dunnoBack:K.again).replace('{t}',q.t),ag==='dk'?'😄':'😅','',' ');return afterTalk(()=>{kid(q.q,'🤔');afterTalk(()=>teach(),300,700)},300,500)}
  kid(q.q,'🤔');
  afterTalk(()=>teach(),300,700)}
function teach(){const {q}=P.qs[P.i];
  choices(P.avail.map(i=>[P.lab[i]]),k=>{const oi=P.avail[k],o=q.o[oi];you(P.lab[oi]);
    setTimeout(()=>o[1]?good():wrong(oi),550)},'tuteach',()=>dunno(q))}

/* 🤔 "I don't know" — no failing: you and Riku look it up together in Mina's book, then he says it.
   It comes back on a later visit (🔎 この前 いっしょに しらべた) until you can teach it */
function dunno(q,fromFix){you(pickL(K.dunnoSay));SFX.step();P.res[q.id]='dunno';
  TD.dunno=TD.dunno||{};TD.dunno[q.id]=Date.now();TD.dunnoN=(TD.dunnoN||0)+1;if(!P.dunno.includes(q))P.dunno.push(q);save();
  setTimeout(()=>{kid(pickL(fromFix?K.dunnoFix:K.dunnoRe),'😲','',' ');
    afterTalk(()=>{lookup(q);
      setTimeout(()=>{if(!live())return;kid(gotLine(q.ok[0]),'💡','k-good',' ');
        afterTalk(()=>{kidEn(q.ok[1],'🗣️','k-good');markTaught(q);
          afterTalk(()=>{kid(pickL(K.dunnoAfter),'😊','',' ');afterTalk(next,300,500)},300,500)},300,500)},1800)},300,600)},500)}
/* the page of Mina's book: the right way to teach and the point */
function lookup(q){if(!live())return;const ok=q.o.find(o=>o[1]),[ex,tx]=mline('tu_dunnoBook');
  const d=document.createElement('div');d.className='lsay tuwh tubook';
  d.innerHTML=`<span class="lface">${MINA.face('m',ex||'smile')}</span><div class="lbody"><small>📖 ミナ先生の 本を いっしょに めくると…</small>
    <p><b>${esc(q.pt)}</b></p>${ok?`<p class="tubk">${esc(ok[0])}</p>`:''}<p class="tubm">${esc(tx||'')}</p></div>`;
  $('tulog').appendChild(d);try{SFX.book?SFX.book():SFX.pickup()}catch(e){}scrollLog()}

/* a right way to teach: Riku gets it and tries the English */
function good(){const {q}=P.qs[P.i],first=!P.tries[q.id];SFX.correct();P.res[q.id]=P.res[q.id]||(first?'ok':'retry');
  if(first){P.firstOk++;TD.first[q.id]=(TD.first[q.id]||0)+1}
  markTaught(q);
  const ag=P.qs[P.i].again;
  if(ag==='dk'){delete (TD.dunno||{})[q.id];save();if(!P.dunnoBack.includes(q))P.dunnoBack.push(q)}
  else if(ag&&!P.again.includes(q))P.again.push(q);
  kid(ag==='dk'?pickL(K.dunnoBackGot):ag?pickL(K.againGot):gotLine(q.ok[0]),'💡','k-good',' ');
  afterTalk(()=>{kidEn(q.ok[1],'🗣️','k-good');afterTalk(()=>{
    if(P.day==='ken'&&(!P.ken||Math.random()<.5)&&q.o.some(o=>o[2]))kenTry(q);else if(q.m&&Math.random()<.8)more();else next()},400)},300,500)}
function markTaught(q){TD.taught[q.id]=(TD.taught[q.id]||0)+1;TD.when=TD.when||{};TD.when[q.id]=Date.now();if(!P.taught.includes(q))P.taught.push(q);save()}

/* 🧒 Ken tries it too, with one of the wrong rules: you teach Ken */
function kenTry(q){P.ken++;TD.kenN=(TD.kenN||0)+1;save();
  const W=q.o.map((o,i)=>[o,i]).filter(x=>x[0][2]),[wo,wi]=pickL(W),bad=wo[2];
  ken(pickL(K.kenTry),'😤','',' ');
  afterTalk(()=>{kenEn(bad,'😂','k-oops');recFun(q.id+':'+wi);
    afterTalk(()=>{kid(pickL(K.rikuToKen),'🤣','',' ');sys(esc(K.kenAsk));
      let opts=shuffle([q.ok[1],bad]);
      const go=()=>choices(opts.map(t=>[t]),k=>{const t=opts[k];you(t);
        setTimeout(()=>{if(t===q.ok[1]){SFX.correct();kenEn(q.ok[1],'💡','k-good');afterTalk(()=>{ken(pickL(K.kenGot),'😆','',' ');afterTalk(next,300,500)},300,500)}
          else{SFX.wrong();opts=opts.filter(x=>x!==t);kid(pickL(K.kenMiss),'😆','',' ');afterTalk(go,200,400)}},500)},'tufix');
      afterTalk(go,200,400)},300,500)},300,500)}

/* a wrong way to teach: no failing. Riku helps, Mina whispers, or Riku says something funny and laughs */
function wrong(oi){const {q}=P.qs[P.i],o=q.o[oi];P.tries[q.id]++;P.avail=P.avail.filter(i=>i!==oi);P.wr++;
  try{SFX.tease?SFX.tease():SFX.pop()}catch(e){}
  let mode;
  if(P.wr>=2)mode='mina';
  else{const w=[['help',1],['mina',1]];if(o[2])w.push(['fun',2.2]);let r=Math.random()*w.reduce((a,x)=>a+x[1],0);mode=w.find(x=>(r-=x[1])<0)[0]}
  if(mode==='fun')return funny(q,oi);
  if(mode==='help'){kid(q.help,'🤔');afterTalk(()=>{kid(pickL(K.retry));afterTalk(teach,200,300)},300,600);return}
  /* Mina at the window */
  setTimeout(()=>{whisper(peekText(q));setTimeout(()=>{kid(pickL(K.whisperHuh),'👀');afterTalk(teach,300,500)},1400)},300)}
/* Mina's whisper: the first time her hint, the next time a plainer one (never the same words twice in a row) */
const PEEK2=['もう ひとこと… 「{p}」 だよ','ないしょで 答えに 近い ヒント。 「{p}」','こっそり ノートを 見せるね… 「{p}」','がんばれ〜。 ポイントは 「{p}」'];
function peekText(q){const n=P.peek++;return n?pickL(PEEK2).replace('{p}',q.pt):q.mina}

/* Riku uses the wrong rule as it is: a funny English line, laughter, then "what is the right way?" */
function funny(q,oi){const o=q.o[oi];
  kid(pickL(K.lead),'🤓');
  afterTalk(()=>{kidEn(o[2],'😂','k-oops');recFun(q.id+':'+oi);
    afterTalk(()=>{kid(pickL(K.laugh),'🤣','',' ');if(o[3])sys(`😂 ${esc(o[3])}`);
      afterTalk(()=>fix(q,o[2]),300,700)},300,500)},300,500)}
function fix(q,bad){kid(pickL(K.fixQ),'🙋');
  const others=q.o.filter(x=>x[2]&&x[2]!==bad).map(x=>x[2]);
  let opts=shuffle([q.ok[1],bad,...(others.length?[pickL(others)]:[])]);
  const go=()=>choices(opts.map(t=>[t]),k=>{const t=opts[k];you(t);
    setTimeout(()=>{if(t===q.ok[1]){SFX.correct();P.fix++;TD.fix++;P.res[q.id]='fix';
        markTaught(q);
        kidEn(q.ok[1],'💡','k-good');afterTalk(()=>{kid(pickL(K.fixed)+(P.paid?' （おまけ +1まい）':''),'🥰');afterTalk(next,300)},300)}
      else{SFX.wrong();opts=opts.filter(x=>x!==t);
        const then=()=>{if(opts.length>1)afterTalk(go,200,400);else afterTalk(()=>{whisper(peekText(q));setTimeout(go,1200)},200,400)};
        if(t===bad){kid(pickL(K.fixSame),'😆','',' ');then()}
        else{const oi=q.o.findIndex(x=>x[2]===t);kidEn(t,'😂','k-oops');if(oi>=0)recFun(q.id+':'+oi);afterTalk(()=>{kid(pickL(K.fixOther),'🤣','',' ');then()},300,500)}}},500)},'tufix',()=>dunno(q,1));
  afterTalk(go,200,400)}

/* the follow-up: "then what about …?" */
function more(){const {q}=P.qs[P.i],m=q.m;let av=shuffle(m.o.map((o,i)=>i));
  kid(m.q,'🙋');
  const go=()=>choices(av.map(i=>[m.o[i][0]]),k=>{const oi=av[k],o=m.o[oi];you(o[0]);
    setTimeout(()=>{if(o[1]){SFX.correct();kid(gotLine(m.ok[0]),'😆','k-good',' ');afterTalk(()=>{kidEn(m.ok[1],'🗣️','k-good');afterTalk(next,400)},300,400)}
      else{SFX.tease?SFX.tease():SFX.pop();av=av.filter(i=>i!==oi);
        if(o[2]){const [fe,fj]=splitF(o[2]);kidEn(fe,'😂','k-oops');recFun(q.id+':m'+oi);afterTalk(()=>{kid(fj?fj+'！ あはは':pickL(K.laugh),'🤣','',' ');afterTalk(()=>{kid(pickL(K.moreRetry),'🙋','',' ');afterTalk(go,200,300)},300,500)},300,500)}
        else{kid(pickL(K.moreMiss),'🤔');afterTalk(go,200,400)}}},500)},'tufix',()=>{you(pickL(K.dunnoSay));SFX.step();
      setTimeout(()=>{kid(pickL(K.moreDunno),'🙋','',' ');afterTalk(()=>{kid(gotLine(m.ok[0]),'💡','k-good',' ');afterTalk(()=>{kidEn(m.ok[1],'🗣️','k-good');afterTalk(next,400)},300,400)},300,500)},500)});
  afterTalk(go,200,500)}
function recFun(k){if(!P.funs.includes(k))P.funs.push(k);if(!TD.fun[k]){TD.fun[k]=1;P.newFun.push(k);save();
}}
/* a little chat between the questions now and then */
/* ☕ a long chat with branches (most of the time), or a short one */
function chatLong(fn){const seen=TD.talks||{},nt=partOfDay()==='night',CT=CH.filter(c=>!c.night||nt);const fresh=CT.filter(c=>!seen[c.id]);const c=pickL(fresh.length?fresh:CT);if(!c)return fn();
  P.talk=c;sys(`☕ ひとやすみ・${esc(c.t)}`);let node=c.n.s,first=1;
  const step=()=>{if(!live())return;kid(node.r,first?'😄':'🙂');first=0;
    afterTalk(()=>choices(node.o.map(o=>[o[0]]),i=>{const o=node.o[i];you(o[0]);SFX.step();
      setTimeout(()=>{kid(o[1],'😆');if(o[2]&&c.n[o[2]]){node=c.n[o[2]];afterTalk(step,300,600)}
        else{TD.talks=TD.talks||{};TD.talks[c.id]=(TD.talks[c.id]||0)+1;save();afterTalk(fn,300,600)}},500)}),300,600)};
  step()}
function chat(fn){if(CH.length&&Math.random()<.65)return chatLong(fn);const C=K.chat||[];const left=C.filter(c=>!(TD.chat||[]).includes(c[0]));const c=pickL(left.length?left:C);if(!c)return fn();
  TD.chat=(TD.chat||[]).filter(x=>x!==c[0]).concat([c[0]]).slice(-Math.max(1,C.length-2));save();
  sys('☕ ひとやすみ');kid(c[0],'😄');
  afterTalk(()=>choices(c[1].map(o=>[o[0]]),i=>{you(c[1][i][0]);SFX.step();setTimeout(()=>{kid(c[1][i][1],'😆');afterTalk(fn,300,600)},500)}),300,600)}
function pochiEv(fn){const e=pickL(K.pochiEv),o=e.o;far('🐕','ポチ',e.p);
  setTimeout(()=>{kid(e.r,'😵');afterTalk(()=>choices(o.map(x=>[x[0]]),i=>{you(o[i][0]);SFX.step();setTimeout(()=>{kid(o[i][1],'😆');afterTalk(fn,300,600)},500)}),300,500)},900)}
function next(){if(!live())return;const cur=P.qs[P.i];if(cur&&!cur.post){cur.post=1;return afterQ(cur.q,next)}P.i++;if(P.i<P.qs.length){
  if(P.day==='pochi'&&!P.pochi){P.pochi=1;return pochiEv(()=>{kid(pickL(K.backToQ),'✋');afterTalk(ask,300,500)})}
  if(!P.chatted&&P.day!=='short'&&Math.random()<(P.day==='normal'?.6:.4)){P.chatted=1;return chat(()=>{kid(pickL(K.backToQ),'✋');afterTalk(ask,300,500)})}
  kid(pickL(P.i===P.qs.length-1&&Math.random()<.5?K.lastQ:K.nextQ),'✋');afterTalk(ask,300,500)}else bye()}

/* ================================================================ after each question */
function afterQ(q,fn){const st=[];const taught=P.taught.includes(q);
  if(taught&&P.dunno.includes(q)){TD.note=TD.note||{};if(!TD.note[q.id]){TD.note[q.id]=Date.now();save()}}
  else if(taught&&P.day!=='short'&&!(TD.note||{})[q.id]&&(P.day==='visit'||Math.random()<.6))st.push(noteStep);
  if(taught&&P.day!=='short'&&(P.day==='hw'||Math.random()<.22)&&printable(q))st.push(printStep);
  if(P.day==='visit')st.push(visitNote);
  const go=()=>{if(!live())return;const f=st.shift();if(!f)return fn();f(q,()=>afterTalk(go,300,400))};go()}

/* Mina speaks in the room (the visiting day) */
function mina(t,lab){if(!live())return;const d=document.createElement('div');d.className='lsay tuwh tuvis';const [ex]=mline('tu_visitHi');
  d.innerHTML=`<span class="lface">${MINA.face('m',ex||'smile')}</span><div class="lbody"><small>${lab||MICO()+' ミナ先生（うしろで 見学中）'}</small><p>${esc(t)}</p></div>`;
  $('tulog').appendChild(d);scrollLog()}

/* 📒 Riku's notebook: which heading should he write? */
function noteStep(q,fn){const oth=shuffle(TQ.filter(x=>x!==q&&x.pt!==q.pt)).sort((a,b)=>(b.k===q.k)-(a.k===q.k)||(!!TD.taught[b.id])-(!!TD.taught[a.id]));
  let opts=shuffle([q.pt].concat(oth.slice(0,2).map(x=>x.pt))),miss=0;
  kid(pickL(K.noteAsk),'📒','',' ');
  const done=how=>{TD.note=TD.note||{};TD.note[q.id]=Date.now();TD.noteN=(TD.noteN||0)+1;P.notes.push(q);save();
    sys(`📒 リクの ノートに <b>「${esc(q.pt)}」</b>`);try{SFX.pickup()}catch(e){}
    afterTalk(()=>{kid(pickL(how==='dk'?K.noteBook:K.noteDone),'✏️','',' ');afterTalk(fn,300,500)},300,700)};
  const go=()=>choices(opts.map(t=>[t]),k=>{const t=opts[k];you(t);
    setTimeout(()=>{if(t===q.pt){SFX.correct();done()}
      else{try{SFX.tease?SFX.tease():SFX.pop()}catch(e){}opts=opts.filter(x=>x!==t);miss++;
        kid(pickL(K.noteMiss),'🤔','',' ');afterTalk(()=>{if(miss>=1&&opts.length>1&&Math.random()<.5)whisper(q.mina);afterTalk(go,200,400)},300,500)}},500)},'tunote',
    ()=>{you(pickL(K.dunnoSay));SFX.step();setTimeout(()=>{lookup(q);setTimeout(()=>done('dk'),1600)},500)});
  afterTalk(go,200,400)}

/* 📝 the homework sheet: put the words in order, or fill the gap */
const GROUPS=[['a','an','the'],['is','are','am','was','were'],['do','does','did'],['in','on','at','to'],['he','she','it','they'],['this','that','these','those'],['can','will','must','should'],['have','has','had'],['some','any'],['much','many'],['who','what','where','when','why','how'],['my','your','his','her','our','their'],['me','him','her','us','them']];
const bare=w=>w.toLowerCase().replace(/[^a-z']/g,'');
function sentOf(q){const c=[q.ok[1]].concat(q.m&&q.m.ok?[q.m.ok[1]]:[]).filter(t=>{const n=String(t).trim().split(/\s+/).length;return n>=3&&n<=9&&/^[A-Za-z0-9 ,.'!?’-]+$/.test(t)});return c.length?pickL(c):null}
const printable=q=>!!sentOf(q);
function keyOf(q,words){const pt=(q.pt+' '+q.t).toLowerCase(),L=words.map(bare);
  let i=L.findIndex(w=>w.length>=1&&GROUPS.some(g=>g.includes(w))&&new RegExp('(^|[^a-z])'+w+'([^a-z]|$)').test(pt));
  if(i<0)i=L.findIndex(w=>w.length>=2&&new RegExp('(^|[^a-z])'+w+'([^a-z]|$)').test(pt));
  if(i<0)i=L.findIndex(w=>GROUPS.some(g=>g.includes(w)));return i}
function printStep(q,fn){const S=sentOf(q);if(!S)return fn();const W=S.trim().split(/\s+/),ki=keyOf(q,W);
  const type=ki>=0&&(W.length<4||Math.random()<.5)?'fill':'order';P.prints++;TD.printN=(TD.printN||0)+1;save();
  kid(pickL(type==='fill'?K.printFill:K.printOrder),'📝','',' ');sys(`📝 リクの 宿題プリント・${type==='fill'?'あなうめ':'ならべかえ'}<br>${esc(q.t)}`);
  const fin=()=>{SFX.correct();kidEn(S,'💯','k-good');afterTalk(()=>{kid(pickL(K.printDone),'😆','',' ');afterTalk(fn,300,500)},300,500)};
  if(type==='fill'){const w=W[ki],bw=bare(w),g=GROUPS.find(g=>g.includes(bw));
    let pool=(g||[]).filter(x=>x!==bw);if(pool.length<2){const o=shuffle(TQ.map(sentOf).filter(Boolean).join(' ').split(/\s+/).map(bare).filter(x=>x.length>=2&&x!==bw));pool=pool.concat([...new Set(o)])}
    const keep=t=>w.replace(/[A-Za-z']+/,m=>m[0]===m[0].toUpperCase()&&m[0]!==m[0].toLowerCase()?t[0].toUpperCase()+t.slice(1):t);
    let opts=shuffle([w].concat(shuffle(pool).slice(0,2).map(keep)));
    const line=W.map((x,i)=>i===ki?'＿＿＿':x).join(' ');
    const go=()=>{if(!live())return;$('tuans').innerHTML='';sys(`<span class="tupr">${esc(line)}</span>`);
      choices(opts.map(t=>[t]),k=>{const t=opts[k];you(t);
        setTimeout(()=>{if(t===w)fin();else{try{SFX.tease?SFX.tease():SFX.pop()}catch(e){}opts=opts.filter(x=>x!==t);kid(pickL(K.printMiss),'🤔','',' ');afterTalk(()=>opts.length>1?go():fin(),200,400)}},500)},'tufix',
        ()=>{you(pickL(K.dunnoSay));SFX.step();setTimeout(()=>{lookup(q);setTimeout(fin,1500)},500)})};
    return afterTalk(go,200,400)}
  /* put in order */
  let got=0;const toks=W.map((t,i)=>({t,i}));let pile=shuffle(toks);if(pile.every((x,i)=>x.i===i))pile=pile.slice(1).concat(pile[0]);
  const draw=()=>{if(!live())return;
    $('tuans').innerHTML=`<div class="tuord"><p class="tuline">${W.map((t,i)=>i<got?`<b>${esc(t)}</b>`:'<i>＿</i>').join(' ')}</p>
      <div class="tutok">${pile.map((x,k)=>`<button data-k="${k}">${esc(x.t)}</button>`).join('')}</div>
      <button class="tudk" data-dk="1">🤔 わからない（つぎの ことばを 見る）</button></div>`;
    $('tuans').querySelectorAll('[data-k]').forEach(b=>b.onclick=()=>{const x=pile[+b.dataset.k];
      if(bare(x.t)===bare(W[got])&&x.t===W[got]||x.i===got){SFX.step();pile.splice(+b.dataset.k,1);got++;if(got>=W.length){$('tuans').innerHTML='';you(S);return setTimeout(fin,500)}draw()}
      else{try{SFX.tease?SFX.tease():SFX.pop()}catch(e){}b.classList.add('tushake');setTimeout(()=>b.classList.remove('tushake'),450);if(Math.random()<.5)kid(pickL(K.printMiss),'🤔','',' ')}});
    $('tuans').querySelector('[data-dk]').onclick=()=>{SFX.step();const k=pile.findIndex(x=>x.t===W[got]);if(k>=0){pile.splice(k,1);got++}
      if(got===1)kid(pickL(K.printHint),'🙋','',' ');if(got>=W.length){$('tuans').innerHTML='';you(S);return setTimeout(fin,500)}draw()};
    setTimeout(()=>{const a=$('tuans');if(a)a.scrollIntoView({block:'nearest',behavior:'smooth'})},80)};
  afterTalk(draw,200,400)}

/* 👩‍🏫 the visiting day: one comment from Mina after each question */
function visitNote(q,fn){const r=P.res[q.id]||'ok',key={ok:'tu_vGood',retry:'tu_vRetry',fix:'tu_vFix',dunno:'tu_vDunno'}[r]||'tu_vGood';
  const t=mline(key,{t:q.t,p:q.pt})[1];mina(t);P.visit.push([q.t,t]);afterTalk(fn,300,1500)}

/* ---------- Riku uses what you taught, on another day: right or wrong? ---------- */
function useCheck(q,fn){const R=[q.ok[1]].concat(q.m&&q.m.ok?[q.m.ok[1]]:[]),Wr=q.o.filter(o=>o[2]).map(o=>o[2]).concat(q.m?q.m.o.filter(o=>o[2]).map(o=>splitF(o[2])[0]):[]);
  const right=!Wr.length||Math.random()<.45,X=right?pickL(R):pickL(Wr),ok=right?X:q.ok[1];
  P.uses={q,ok:0};TD.useN=(TD.useN||0)+1;save();
  kid(pickL(K.useSay).replace('{t}',q.t),'😄','',' ');
  const fixIt=()=>{const others=Wr.filter(x=>x!==X);let opts=shuffle([ok,X].concat(others.length?[pickL(others)]:[]));
    const go=()=>choices(opts.map(t=>[t]),k=>{const t=opts[k];you(t);
      setTimeout(()=>{if(t===ok){SFX.correct();P.uses.ok=0;P.uses.fixed=1;TD.useFix=(TD.useFix||0)+1;save();kidEn(ok,'💡','k-good');afterTalk(()=>{kid(pickL(K.fixed),'🥰','',' ');afterTalk(fn,300,500)},300,500)}
        else{try{SFX.tease?SFX.tease():SFX.pop()}catch(e){}opts=opts.filter(x=>x!==t);kid(pickL(K.fixSame),'😆','',' ');
          afterTalk(()=>{if(opts.length<=2)whisper(peekText(q));afterTalk(go,200,400)},200,400)}},500)},'tufix',
      ()=>{you(pickL(K.dunnoSay));SFX.step();setTimeout(()=>{lookup(q);setTimeout(()=>{kidEn(ok,'💡','k-good');afterTalk(()=>{kid(pickL(K.dunnoAfter),'😊','',' ');afterTalk(fn,300,500)},300,500)},1600)},500)});
    afterTalk(go,200,400)};
  afterTalk(()=>{kidEn(X,'🗣️',right?'':'');
    afterTalk(()=>{kid(pickL(K.useAsk),'🤔','',' ');
      afterTalk(()=>choices([['⭕ あってるよ！'],['🤏 ちょっと ちがうかも']],i=>{you(i?'ちょっと ちがうかも':'あってるよ！');SFX.step();
        setTimeout(()=>{
          if(right&&!i){SFX.correct();P.uses.ok=1;TD.useOk=(TD.useOk||0)+1;save();kid(pickL(K.useYay),'🥳','',' ');afterTalk(fn,300,600)}
          else if(right&&i){kid(pickL(K.useHuh),'😲','',' ');afterTalk(()=>{lookup(q);setTimeout(()=>{if(!live())return;P.uses.ok=1;kid(pickL(K.useRightAfter),'😆','',' ');afterTalk(fn,300,600)},1600)},300,500)}
          else if(!right&&i){kid(pickL(K.useOops),'😅','',' ');afterTalk(fixIt,300,500)}
          else{kid(pickL(K.useKen),'😅','',' ');afterTalk(fixIt,300,500)}},500)},'',
        ()=>{you(pickL(K.dunnoSay));SFX.step();setTimeout(()=>{lookup(q);setTimeout(()=>{if(!live())return;
          if(right){P.uses.ok=1;kid(pickL(K.useRightAfter),'😆','',' ');afterTalk(fn,300,600)}else{kid(pickL(K.useOops),'😅','',' ');afterTalk(fixIt,300,500)}},1600)},500)}),300,500)},300,500)},300,500)}

/* ---------- the end ---------- */
function bye(){$('tuq').textContent='🏁';const ops=shuffle(K.bye).slice(0,3);
  const d=P.day;
  if(d==='short'){far('👩','ママ（とおくから）',pickL(K.momCall));setTimeout(()=>{kidEn("I'm coming!",'🏃');afterTalk(()=>{kid(pickL(K.momRe),'👋','',' ');afterTalk(finish,300,500)},300,500)},1100);return}
  if(d==='normal'&&Math.random()<.25){kid(pickL(K.byeQuick),'👋','',' ');return afterTalk(finish,300,500)}
  if(d==='ken')ken(pickL(K.kenBye),'👋');
  kid(pickL(d==='hw'?K.hwBye:K.byeHi),'😊');
  afterTalk(()=>choices(ops.map(o=>[o[0]]),i=>{you(ops[i][0]);SFX.step();setTimeout(()=>{kid(ops[i][1],ops[i][2]);afterTalk(finish,300,500)},500)}),300,500)}
function rollGift(){const w=TG.map(g=>[g,g[7]===1?6:g[7]===2?3:1]);let r=Math.random()*w.reduce((a,x)=>a+x[1],0);return w.find(x=>(r-=x[1])<0)[0]}
function finish(){if(!live())return;
  const paid=P.paid&&paidLeft()>0;let coins=0,gift=null;
  if(paid){TD.day={d:dk(),n:paidToday()+1};coins=PAY+Math.min(3,P.fix);gift=rollGift();TD.gifts[gift[0]]=(TD.gifts[gift[0]]||0)+1;TD.got[gift[0]]=(TD.got[gift[0]]||0)+1}
  TD.n++;TD.last=Date.now();try{RECENT.add('tutor',{n:TD.n,day:P.day||'',taught:P.taught.length,ok:P.firstOk,tot:P.qs.length,t:(P.taught[0]||{}).t||'',fun:P.funs.length})}catch(e){}const letter=(K.letters||[]).find(l=>l[0]===TD.n);if(letter){TD.letters=(TD.letters||[]).concat([letter[0]])}save();
  if(paid&&P.day==='pochi'){far('🐕','ポチ','ワン！ （お礼を くわえて 走っていく）');kid(K.pochiGift,'😱');setTimeout(()=>{if(live())kid(K.pochiGift2,'😅','',' ')},1600)}
  else if(P.day==='short'){if(paid)sys('🎁 リクが 走りながら お礼を おいていった')}
  else kid(pickL(paid?K.thanksL:K.thanksFreeL),paid?'🎁':'👋');
  /* Mina */
  let k='tu_end',v={n:P.taught.length};
  if(P.firstOk===P.qs.length)k='tu_endPerfect';else if(P.fix)k='tu_endFix';else if(P.funs.length)k='tu_endFun';
  if(!paid)k=P.firstOk===P.qs.length?'tu_endPerfect':'tu_endFree';
  if(Math.random()<.35){const kd=P.qs.map(x=>x.q.k).find(x=>x&&x!=='why');if(kd)k='tu_end_'+kd}
  const weak=P.qs.find(x=>x.tag==='weak');if(weak&&Math.random()<.6){k='tu_endWeak';v.t=weak.q.t}
  /* the special things of this visit come first */
  if(P.talk&&Math.random()<.35){k='tu_endChat';v.c=P.talk.t.replace(/^\S+\s/,'')}
  if(P.again.length&&Math.random()<.6){k='tu_endAgain';v.t=P.again[0].t}
  if(P.dunno.length&&Math.random()<.7){k='tu_endDunno';v.t=P.dunno[0].t}
  if(P.dunnoBack.length&&Math.random()<.8){k='tu_endDunnoBack';v.t=P.dunnoBack[0].t}
  if(P.notes.length&&Math.random()<.3){k='tu_endNote';v.t=P.notes[0].t}
  if(P.prints&&Math.random()<.35)k='tu_endPrint';
  if(P.uses&&Math.random()<.5){k=P.uses.ok?'tu_endUseOk':'tu_endUseFix';v.t=P.uses.q.t}
  const DK={visit:'tu_endVisit',quiz:'tu_endQuiz',ken:'tu_endKen',hw:'tu_endHw',short:'tu_endShort',pochi:'tu_endPochi'};
  if(DK[P.day]&&Math.random()<.7){k=DK[P.day];if(P.quiz)v.n=P.quiz.ok}
  const rows=P.taught.map(q=>{const L=lesFor(q);return `<div class="tutr"><span><b>${P.dunno.includes(q)?'🔎 ':''}${esc(q.t)}</b><small>${esc(q.pt)}</small></span>${L?`<button class="sub" data-les="${L.id}" aria-label="授業を みなおす">📖</button>`:''}</div>`}).join('');
  setTimeout(()=>{if(!live())return;
    $('tuans').innerHTML=`<div class="kres">
      <p class="kend good">🧑‍🏫 教えた！ ${'⭐'.repeat(P.firstOk)}${'🔎'.repeat(Math.min(P.dunno.length,P.qs.length-P.firstOk))}${'☆'.repeat(Math.max(0,P.qs.length-P.firstOk-P.dunno.length))} <small>一発で ${P.firstOk}/${P.qs.length}</small></p>
      ${paid?`<p class="zkres">🪙 バイト代 <b>${PAY}まい</b>${P.fix?` ＋ おまけ <b>${Math.min(3,P.fix)}まい</b>`:''}</p>
        <p class="zkres tugot">${gift[1]} <b>${esc(gift[2])}</b> を もらった <small>ながれぎ雑貨店で 売れるよ</small></p>`
        :`<p class="zkres"><small>きょうの バイト代は おしまい（1日 ${PER_DAY}回まで）。 教えた ことは のこるよ</small></p>`}
      <details class="mfold" open><summary>📒 きょう 教えた こと</summary><div class="tutl">${rows}</div></details>
      ${P.quiz?`<p class="tusys">🎤 リクの クイズ ${P.quiz.ok}/${P.quiz.n}もん せいかい</p>`:''}${P.ken?`<p class="tusys">🧢 ケンにも ${P.ken}回 教えた</p>`:''}
      ${P.visit.length?`<details class="mfold" open><summary>${MICO()} ミナ先生の 参観ノート</summary><div class="tutl">${P.visit.map(v=>`<div class="tutr tuvn"><span><b>${esc(v[0])}</b><small>${esc(v[1])}</small></span></div>`).join('')}</div></details>`:''}
      ${P.notes.length||P.prints?`<p class="tusys">${P.notes.length?`📒 ノートに ${P.notes.length}ページ`:''}${P.notes.length&&P.prints?'・':''}${P.prints?`📝 宿題プリント ${P.prints}もん`:''}</p>`:''}
      ${P.dunno.length?`<p class="tusys">🔎 いっしょに しらべた ${P.dunno.length}こ（また こんど リクが 聞きに くるよ）</p>`:''}
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
function notebook(back){const N=TD.note||{},T=TQ.filter(q=>TD.taught[q.id]).sort((a,b)=>((N[b.id]||(TD.when||{})[b.id]||0)-(N[a.id]||(TD.when||{})[a.id]||0)));const nN=T.filter(q=>N[q.id]).length;
  H.show('tutor',`<section class="pnl tu">
    <div class="qtop"><button class="x" id="tux" aria-label="もどる">←</button><b>📒 リクの ノート</b><span class="qn">${T.length}/${TQ.length}</span></div>
    ${minaBox(T.length?'tu_note':'tu_noteNone',{n:T.length,w:nN})}
    <div class="tunb">${T.map(q=>{const L=lesFor(q);return `<div class="tupg${N[q.id]?' w':''}"><span><b>${esc(q.t)}</b>${N[q.id]?`<i>✏️ ${esc(q.pt)}</i>`:`<small>${esc(q.pt)}</small>`}<button class="tuex" data-say="${esc(q.ok[1])}">🔊 ${esc(q.ok[1])}</button></span>${L?`<button class="sub" data-les="${L.id}" aria-label="授業を みなおす">📖</button>`:''}</div>`}).join('')||'<p class="note">リクに 教えた ことが ここに たまるよ</p>'}</div>
  </section>`);
  bindSay(H.panel);
  H.panel.querySelectorAll('[data-les]').forEach(b=>b.onclick=()=>{SFX.lesson();LESSON.open(b.dataset.les,()=>notebook(back))});
  $('tux').onclick=()=>{SFX.back();back()}}
function funText(k){const [id,x]=k.split(':'),q=qById(id);if(!q)return '';if(x[0]==='m'){const o=q.m.o[+x.slice(1)];return o?splitF(o[2])[0]:''}const o=q.o[+x];return o?o[2]:''}
function funList(){return Object.keys(TD.fun).map(k=>{const [id,x]=k.split(':'),q=qById(id);if(!q)return null;
  if(x[0]==='m'){const o=q.m.o[+x.slice(1)];if(!o)return null;const [en,why]=splitF(o[2]);return {en,why,q,ok:q.m.ok[1]}}const o=q.o[+x];return o&&{en:o[2],why:o[3]||'',q,ok:q.ok[1]}}).filter(Boolean)}
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
    <div class="zkcard tuletter"><span class="zcp tuzf">${FACE.riku}</span><p class="bmEn">${esc(l[1])}</p><p class="bmJa" hidden>${esc(l[2])}</p>
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
/* セリフを ふやす（同じ ことばかり 言わないように） */
[['tu_hello',[['wink','教え方は 何通りも あるよ。 長い 説明が いつも 正しい とは かぎらないから、 よく 読んでね'],['smile','リクくん、 先生が 来るのを 毎日 たのしみに してるんだって']]],
 ['tu_end',[['happy','教えると、 自分が どこまで わかってるか よく 見えるよね'],['smile','リクくんの 「わかった！」の 顔、 よかったね'],['proud','きょうの {n}つ、 もう 人に 説明できる ことに なったね']]],
 ['tu_endPerfect',[['wow','一発で ぜんぶ！ 説明の 言い方が かわっても ちゃんと 見ぬけたね'],['love','まよわず 教えられるって、 ほんとに わかってる しょうこ。 かっこよかったよ']]],
 ['tu_endFix',[['proud','へんな 英文と 正しい 英文、 ならべて くらべると 一生 わすれないよ'],['happy','「ほんとは？」に すぐ 答えられたね。 それが いちばんの ふくしゅう']]],
 ['tu_endFun',[['happy','リクくんの わらい声、 まどの 外まで 聞こえてたよ'],['wink','へんな 英文で わらった ぶん、 正しい 形が 頭に のこるんだ']]],
 ['tu_endFree',[['smile','バイト代が なくても 来てくれるって、 リクくん よろこぶよ'],['happy','教えた ぶんだけ、 あなたの 英語も きたえられてるよ']]],
 ['tu_hello',[['smile','わからない ときは 「🤔 わからない」で いいんだよ。 リクくんと いっしょに しらべれば、 それも 勉強']]],
 ['tu_note',[['happy','📒 リクくんの ノート、 {n}ページ。 ✏️ の ついた みだしは 2人で えらんだ ことば だよ'],['smile','🔊 で リクくんの 英文を 聞きなおすと、 自分の ふくしゅうにも なるよ']]],
 ['tu_hello',[['happy','ときどき わたしも 見学に 行くね。 参観日、 たのしみに してて']]],
 ['tu_endWeak',[['proud','前は つまずいた 「{t}」を、 こんどは 教える がわ。 すごい ことだよ']]],
].forEach(([k,L])=>{MINA_LINES[k]=(MINA_LINES[k]||[]).concat(L)});
Object.assign(MINA_LINES,{
 tu_endQuiz:[['wow','リクくんの クイズ、 {n}もん せいかい！ 出題 される がわも いい ふくしゅうに なるね'],['happy','ひっかけ問題、 リクくん うれしそう だったね。 へんな 英文を 見ぬく 目が ついてるよ'],['smile','教えた ことが クイズに なって もどってくる。 いい 先生の しょうこだよ']],
 tu_endKen:[['happy','ケンくんにも 教えちゃったね。 2人に 教えたら 2ばい おぼえるよ'],['wow','ケンくん、 また 来たいって。 人気の 先生だね'],['smile','同じ ことを 2回 説明すると、 自分の ことばに なっていくんだよ']],
 tu_endHw:[['proud','宿題チェック、 おつかれさま。 まちがいを 見つける 目は 自分の 英語にも つかえるよ'],['happy','リクくんの 宿題、 はなまる もらえると いいね']],
 tu_endShort:[['smile','きょうは みじかかったね。 「I\'m coming!」、 前に 教えた ことが 出たね'],['happy','ちょっと だけでも、 毎日 ふれるのが いちばん だよ']],
 tu_endPochi:[['happy','ポチ、 にぎやか だったね。 犬に 言う 英語も ふえたね'],['smile','Good boy! Drop it! 英語って 生活の 中に いっぱい あるね']],
 tu_endAgain:[['proud','「{t}」、 リクくん わすれてたね。 2回 教えると 自分も もっと おぼえるよ'],['smile','わすれた ころに もう一回。 それが いちばん 頭に のこる ふくしゅう なんだ']],
 tu_visitHi:[['smile','きょうは うしろで 見学させてね。 いつもどおりで だいじょうぶ'],['happy','参観日だよ。 リクくんの 先生ぶり、 見せて もらうね'],['wink','わたしは いない ことに して。 …ふふ、 リクくん かたまってる']],
 tu_vGood:[['proud','「{t}」、 まよわず 一発。 ポイントを さいしょに 言えてたね'],['happy','いまの 教え方、 リクくんの 顔が ぱっと 明るく なったよ'],['wow','「{t}」は もう 自分の ことばで 説明できるね。 かんぺき']],
 tu_vRetry:[['smile','「{t}」は 1回 まよったけど、 えらびなおせたのが 大事。 「{p}」を 先に 思いだすと 早いよ'],['think','アドバイス: こまったら 「{p}」。 これを 合言葉に しておこう'],['happy','まちがえた 教え方を 見て、 正しい ほうに 気づけたね。 それも 力だよ']],
 tu_vFix:[['proud','へんな 英文を 直して あげたね。 まちがいを 見て 「どこが へんか」 わかるのは 本物の 力'],['smile','リクくん、 わらった あとで ちゃんと 正しい 文を 言えてた。 いい ながれだね'],['think','アドバイス: 直す ときは 「{p}」と いっしょに 言うと、 リクくんも 自分で 直せるように なるよ']],
 tu_vDunno:[['happy','「わからない」って 言えたの、 いいね。 先生が しらべる すがたを 見せるのも 教え方の 1つだよ'],['smile','しらべて わかった ことは 「{p}」。 つぎの 回に もう一度 出るから、 そのとき 教えてね'],['love','知ったかぶり しない 先生、 リクくんは きっと 信じて くれるよ']],
 tu_endVisit:[['proud','参観日、 おつかれさま。 ちゃんと 先生の 顔に なってたよ'],['happy','見学してて たのしかった！ 参観ノート、 あとで 見かえしてね'],['love','リクくんが あなたを 見る 目、 すっかり 先生を 見る 目だったよ']],
 tu_endNote:[['happy','リクくんの ノートに 「{t}」が ふえたね。 みだしを えらぶと、 何を 教えたか 頭が せいりされるよ'],['smile','📒 リクの ノート、 たまってきたね。 ときどき 見かえすと ふくしゅうに なるよ']],
 tu_endPrint:[['happy','宿題プリント、 いっしょに といたね。 ならべかえは 英語の じゅんばんの 練習に ぴったり'],['smile','あなうめ、 リクくん うれしそう だったね。 1文 まるごと 言えると 自信に なるよ']],
 tu_endUseOk:[['proud','リクくん、 「{t}」を 自分で つかえてたね。 教えた ことが 生きてる しょうこだよ'],['happy','前に 教えた 「{t}」が ちゃんと リクくんの ものに なってた。 うれしいね']],
 tu_endUseFix:[['smile','リクくんの 「{t}」、 ちょっと ずれてたのを 直して あげたね。 つかって まちがえて 直すのが いちばん おぼえるんだ'],['proud','「あってる？」に すぐ 気づけたね。 人の 英語を 見る 目が ついてきたよ']],
 tu_dunnoBook:[['smile','「わからない」って 言えるのは、 いい 先生の しょうこ。 ここを いっしょに 読もう'],['happy','わからない ときは しらべれば いいの。 リクくんと いっしょに おぼえちゃおう'],['wink','先生だって ぜんぶ 知ってる わけじゃ ないよ。 ポイントは ここ'],['think','知ったかぶり するより ずっと いい。 さあ、 この 1行だけ おぼえて帰ろう']],
 tu_endDunno:[['smile','「{t}」、 わからないって 正直に 言えたね。 いっしょに しらべた ことは、 ふつうより よく のこるよ'],['happy','リクくん、 せんせいと しらべるの たのしかった みたい。 「{t}」、 こんど また 聞きに くるって'],['proud','わからない ことを わからないって 言えるの、 じつは いちばん 大事な 力なんだよ']],
 tu_endDunnoBack:[['proud','この前 しらべた 「{t}」、 こんどは ちゃんと 教えられたね！ もう 自分の ものだよ'],['wow','「{t}」、 前は わからなかったのに！ 1回 しらべて、 1回 教える。 それで ばっちり'],['love','リクくん、 「せんせい おぼえてた！」って うれしそう だったね']],
 x_tuDunno:[['smile','この前 リクくんと いっしょに しらべた 「{t}」、 こんどは 教えられそう？ リクくん また 聞きたいって'],['happy','「{t}」、 しらべた ままに なってるよ。 リクくんに 教えに 行くと しっかり おぼえるよ']],
 tu_endChat:[['happy','リクくんと 「{c}」の 話、 たのしそう だったね'],['smile','リクくんの ☕ ひとやすみ、 話の たねが ふえたよ。 ポチの ボールさがしや すなの お城の 話も あるんだって'],['smile','おしゃべりの 中の 英語も、 ちゃんと 勉強に なってるよ']],
 x_tuQuiz:[['wink','リクくん、 先生に 出す クイズを こっそり 作ってる みたい。 教えた こと、 おぼえてる？'],['smile','リクくんの クイズの日、 あたったら たのしいよ。 前に 教えた ことが 出るんだって']],
 x_tuTalk:[['happy','リクくん、 せんせいと おしゃべり するのを たのしみに してるんだって'],['smile','リクくんが 「せんせいに 話したい こと ある」って 言ってたよ']],
});
const goTu=()=>['👦 リクの ところへ',open];
if(window.MINA_SENSE&&MINA_SENSE._rules)MINA_SENSE._rules.push(
 ['x_tuNone',4,()=>!TD.met?{}:null,goTu],
 ['x_tuWeak',3,()=>{if(!TD.met||!paidLeft())return null;const st=studied(),q=TQ.find(q=>tagOf(q,st)==='weak');return q?{t:q.t}:null},goTu],
 ['x_tuToday',2,()=>TD.met&&paidLeft()&&Date.now()-TD.last>3*3600e3?{n:paidLeft()}:null,goTu],
 ['x_tuGift',2,()=>{const G=sellable();return G.length?{n:giftN(),g:G[0].n}:null},()=>window.ZAKKA?['🏚️ 雑貨店へ',()=>ZAKKA.play('sell')]:goTu()],
 ['x_tuLetter',1,()=>{const nl=nextLetter();return TD.met&&nl&&nl-TD.n<=2?{n:nl-TD.n}:null},goTu],
 ['x_tuQuiz',1,()=>TD.met&&paidLeft()&&taughtN()>=4?{}:null,goTu],
 ['x_tuTalk',1,()=>TD.met&&paidLeft()&&Object.keys(TD.talks||{}).length<CH.length?{}:null,goTu],
 ['x_tuNote',1,()=>{const n=Object.keys(TD.note||{}).filter(qById).length;return TD.met&&n>=3?{n}:null},()=>['📒 ノートを 見る',()=>notebook(H.home)]],
 ['x_tuDunno',3,()=>{if(!TD.met||!paidLeft())return null;const id=Object.keys(TD.dunno||{}).find(qById);return id?{t:qById(id).t}:null},goTu],
 ['x_tuFunNone',0,()=>null,goTu]);
/* the first time: Mina points at the parasol once */
setTimeout(function first(){if(TD.met||TD.told)return;const m=window.MINA;if(!m||!m.canAnnounce||!m.canAnnounce())return setTimeout(first,20000);
  TD.told=1;save();const [ex,tx]=mline('tu_first');m.say('m',ex,tx,9000,null,['👦 行ってみる',open])},70000);

window.TUTOR={open,top,play,notebook,gifts,rec:()=>TD,sellable,take,funList,funN,funAll,qs:TQ,_spot:spot,_pick:pick3};
})();
