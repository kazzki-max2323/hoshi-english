/* 浜辺の 会話: だれかが 自分から 話しかけに 来る（2026-11-18 ユーザー「自分からは できない。自動で 始まるように」）
   - ホームの 「💬 浜辺の 会話」ボタンは なくした。かわりに 浜辺の キャラが 砂の 上を 歩いて きて、ふきだしで 声を かける
   - いつ: 単語帳・お店・鉱山・授業などから 浜辺に もどった とき（ときどき）と、浜辺で しばらく すごした とき
   - 来たら 6びょうで 自動で 会話が はじまる（「あとで」で ことわれる・キャラを タップで すぐ 始まる）
   - 会話は いまの 力（MINA.level）の もの。まだの ながい 会話 → まだの 会話 → ★の エンドが 残っている 会話 の 順に えらぶ
   - ミナ先生の 「👋 呼んでくる」（game/mina-sense.js）も ここの call(id) を つかう
   セリフは game/mina-talk.js の kv_ で はじまる 場面 */
(()=>{
const {S:ST,sfx:SFX}=BEACH;
const H=HE,esc=H.esc,$=id=>document.getElementById(id);
const K=()=>window.KAIWA;
const LV=['es','jh','hs','adv'],LVI=lv=>LV.indexOf(lv);
const pickL=a=>a[Math.random()*a.length|0];
const GAP=7*60e3,LATER=15*60e3,FIRST_WAIT=90e3,IDLE=[6*60e3,10*60e3],WAIT=6;   // ms between visits, after「あとで」, after opening the app, at home; seconds before the talk starts

/* the first thing each person says when they walk up: [英, 日] */
const HELLO={
  gen:["Oi! Got a minute, young one?","おーい！ ちょっと いいかね？"],
  sora:["Hi hi! Can I talk to you?","ねえねえ！ お話 しよう？"],
  pochi:["Woof! Hey! Hey! Talk to me!","ワン！ ねえ！ ねえ！ お話 しよ！"],
  kanio:["Snip snip! Excuse me, one minute?","チョキチョキ！ ちょっと いいかな？"],
  hana:["Hi there! Are you busy?","こんにちは！ いま いそがしい？"],
  baba:["Oh, there you are, dear!","あら、ここに いたのね！"],
  neko:["Human. I have something to say.","人間。 話が ある"],
  emma:["Excuse me! Can you help me?","すみません！ ちょっと いいですか？"],
  taku:["Hey! Do you have a sec?","よう！ ちょっと いい？"],
  kame:["Hello... there... Do you... have... time...?","こんにち… は… 時間… ある…？"],
  iruka:["Splash! Hi! Let's talk!","バシャーン！ やあ！ 話そう！"],
  zuzu:["Beep! Earthling! Please talk with me!","ピピッ！ 地球人！ お話 してください！"],
  leo:["Hey. Got a minute? Let's chat.","やあ。 ちょっと 話さない？"],
  fuku:["Hoo. Good evening. May I have a word?","ホウ。 こんばんは。 少し いいかな？"]};
const hello=c=>HELLO[c]||["Hi! Can we talk?","やあ！ ちょっと 話せる？"];

/* when they last came (kept in the save with the talks) */
const R=()=>{const D=K().rec();return D.v||(D.v={at:0,last:'',n:0})};
const t0=Date.now();
let V=null,homeMs=0,idleAt=IDLE[0]+Math.random()*(IDLE[1]-IDLE[0]),tm=0,nextOk=0;

/* which talk: your level (and one below), the ones you have not had first, a long one first, not the same as last time */
function pickScene(id){const SC=K().scenes;if(id){const s=SC.find(x=>x.id===id);if(s)return s}
  const D=K().rec(),lv=(()=>{try{return MINA.level()}catch(e){return 'es'}})(),i=LVI(lv);
  const ok=SC.filter(s=>LVI(s.lv)<=i&&LVI(s.lv)>=i-1&&s.id!==R().last),mine=ok.filter(s=>s.lv===lv);
  const story=mine.filter(s=>s.story&&!D.done[s.id]),fresh=mine.filter(s=>!D.done[s.id]),lower=ok.filter(s=>!D.done[s.id]);
  const star=ok.filter(s=>s.story&&D.done[s.id]&&!K().endsOf(s).some(e=>e[1]&&D.end[s.id+':'+e[0]]));
  const ends=ok.filter(s=>s.story&&K().endsGot(s)<K().endsOf(s).length);
  for(const [a,p] of [[story,.6],[fresh,1],[lower,1],[star,1],[ends,1]])if(a.length&&Math.random()<p)return pickL(a);
  return ok.length?pickL(ok):pickL(SC)}

/* nothing else is open over the beach */
const calm=()=>H.screen==='home'&&!document.hidden&&!K().live()&&!$('cardOv')&&!$('cardTop')&&!$('dpov')&&!$('bmPop')&&!$('minaPop')&&!document.querySelector('.ttov')&&!(window.HORROR&&HORROR.busy&&HORROR.busy());
const due=()=>Date.now()-t0>FIRST_WAIT&&Date.now()>nextOk&&Date.now()-Math.max(R().at,K().rec().last||0)>GAP;

/* ---------- someone walks up ---------- */
function come(id,fast){if(V||!window.KAIWA||!calm())return false;const w=$('window');if(!w)return false;
  const s=pickScene(id),c=K().chars[s.c],W=w.clientWidth||360,Hh=w.clientHeight||300,left=Math.random()<.5;
  const x=Math.round(W*(left?.27:.66)),y=Math.round(Hh*(.82+Math.random()*.06));
  const el=document.createElement('div');el.id='kvVis';el.className=left?'fromL':'fromR';
  el.innerHTML=`<button class="kvMan" aria-label="${esc(c.n)}と 話す"><span class="kvIco">${c.ico}</span></button>
    <div class="kvBub" hidden><small class="kvWho">${c.ico} ${esc(c.n)}</small><p class="kvEn">${esc(hello(s.c)[0])}</p><p class="kvJa">${esc(hello(s.c)[1])}</p>
      <div class="kvBtns"><button class="kvGo">▶ 話す <small class="kvSec">${WAIT}</small></button><button class="kvNo sub">あとで</button></div><i class="kvBar"></i></div>`;
  el.style.left=(left?-40:W+40)+'px';el.style.top=y+'px';w.appendChild(el);
  V={s,c,el,x,y,left,cnt:WAIT,paused:false};R().at=Date.now();R().last=s.id;R().n++;save();
  el.addEventListener('pointerdown',e=>e.stopPropagation());
  el.querySelector('.kvMan').onclick=e=>{e.stopPropagation();start()};
  el.querySelector('.kvGo').onclick=e=>{e.stopPropagation();start()};
  el.querySelector('.kvNo').onclick=e=>{e.stopPropagation();later()};
  requestAnimationFrame(()=>requestAnimationFrame(()=>{el.style.transition=`left ${fast?1.2:2.6}s linear`;el.style.left=x+'px';el.classList.add('walk')}));
  setTimeout(()=>arrive(),fast?1300:2700);return true}
function arrive(){if(!V)return;const {el,c,s}=V;el.classList.remove('walk');el.classList.add('here');
  const b=el.querySelector('.kvBub');b.hidden=false;
  /* keep the bubble inside the beach */
  const w=$('window'),W=w.clientWidth,bw=b.offsetWidth||220,cx=V.x;b.style.left=Math.round(Math.max(6-cx,Math.min(W-6-cx-bw,-bw/2)))+'px';
  try{SFX.talk()}catch(e){}try{K().say(hello(s.c)[0],c)}catch(e){}
  const first=!K().rec().n;minaSay(first?'kv_first':'kv_come',{c:c.n,ico:c.ico});
  el.querySelector('.kvBar').style.animationDuration=WAIT+'s';el.classList.add('count');
  V.cnt=WAIT;clearInterval(tm);tm=setInterval(tick,1000)}
function tick(){if(!V){clearInterval(tm);return}
  if(H.screen!=='home'){leave();return}
  if(document.hidden){V.el.classList.add('pause');return}V.el.classList.remove('pause');
  V.cnt--;const n=V.el.querySelector('.kvSec');if(n)n.textContent=Math.max(0,V.cnt);
  if(V.cnt<=0)start()}
/* the talk begins (game/kaiwa.js play) */
function start(){if(!V)return;const id=V.s.id;clearInterval(tm);V.el.remove();V=null;try{SFX.talk()}catch(e){}if(H.screen!=='home')return;K().play(id,'visit')}
/* 「あとで」: they wave and walk off; nobody comes for a while */
function later(){if(!V)return;nextOk=Date.now()+LATER;try{SFX.pop()}catch(e){}const c=V.c;
  try{K().say(c.p<.9?"Alright, alright. Later then.":"OK! See you later!",c)}catch(e){}leave();minaSay('kv_later',{c:c.n})}
function leave(){if(!V)return;clearInterval(tm);const {el,left}=V,w=$('window');V=null;el.classList.remove('count','here');el.querySelector('.kvBub').hidden=true;el.classList.add('walk');
  el.style.transition='left 2.2s linear,opacity .6s 1.8s';el.style.left=(left?-40:(w?w.clientWidth:400)+40)+'px';el.style.opacity='0';setTimeout(()=>el.remove(),2600)}
function minaSay(k,v){try{const m=window.MINA;if(!m||!m.canAnnounce||!m.canAnnounce())return;const [ex,tx]=m.line(k,v);m.say('m',ex,tx,6000)}catch(e){}}

/* ---------- when: back on the beach after doing something, or a while on the beach ---------- */
H.on('home',back=>{homeMs=0;if(V&&!document.body.contains(V.el)){clearInterval(tm);V=null}
  if(!back||!window.KAIWA)return;
  /* the first talk comes the first time you come back; after that about 1 in 3 */
  const p=K().rec().n?.35:1;if(!due()||Math.random()>p)return;
  setTimeout(()=>{if(calm()&&due())come()},5000+Math.random()*3000)});
let lastT=performance.now();
setInterval(()=>{const now=performance.now(),dt=now-lastT;lastT=now;if(H.screen!=='home'||document.hidden||V)return;homeMs+=Math.min(dt,5000);
  if(homeMs>idleAt&&due()&&calm()){homeMs=0;idleAt=IDLE[0]+Math.random()*(IDLE[1]-IDLE[0]);come()}},3000);
addEventListener('resize',()=>{if(V&&V.el.classList.contains('here')){const w=$('window');if(w&&V.x>w.clientWidth-20)leave()}});

/* ミナ先生が 呼んでくる: go home and they come right away */
function call(id){if(V){start();return}const go=()=>{if(!come(id,true)){try{K().play(pickScene(id).id,'visit')}catch(e){}}};
  if(H.screen!=='home'){H.home();setTimeout(go,700)}else go()}
Object.assign(window.KAIWA||{},{call,visiting:()=>!!V,_come:come});
})();
