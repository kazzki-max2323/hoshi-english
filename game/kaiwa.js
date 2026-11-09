/* 浜辺の 会話: 浜辺の キャラ（ゲンじい・ソラ・ポチ・旅行者の エマ…）と 英語で おしゃべり。
   - 相手の 話に 答える（えらぶ / 自分で 書く / 声で 言う）。こっちから 質問する 番も ある
   - まちがえても 相手が 困ったり 笑ったり するだけ。その 反応は「おもしろ反応 図鑑」に たまって コインも もらえる
   - レベルは ミナ先生の 見る「いまの 力」（MINA.level）。小学生は 日本語訳が いつも 出る
   - 自分で 書いた 英語は、えらぶ 答えの どれに いちばん 近いかを ことばの 重なりで 判定する（外部の AIは つかわない）
   - 声は 端末の 読み上げ（キャラごとに 高さと 速さを かえる）
   中身は game/kaiwa-data.js（KAIWA_CHARS / KAIWA_SCENES）。ミナ先生の セリフは game/mina-talk.js の k_ / x_kw で はじまる 場面 */
(()=>{
const {S:ST,sfx:SFX}=BEACH;
const H=HE,esc=H.esc,$=id=>document.getElementById(id);
const LV=['es','jh','hs','adv'],LVN={es:'小学生',jh:'中学生',hs:'高校生',adv:'ハイレベル'};
const PAY={es:6,jh:8,hs:10,adv:12};   // coins for a conversation (double the first time)
const pickL=a=>a[Math.random()*a.length|0];
const CH=KAIWA_CHARS,SC=KAIWA_SCENES;
const sceneOf=id=>SC.find(s=>s.id===id);

/* ---------- the record ---------- */
const KD=(()=>{try{const s=JSON.parse(localStorage.getItem(SAVE_KEY)||'{}').kaiwa;if(s&&s.done)return s}catch(e){}return {done:{},heart:{},fun:{},free:0,ask:0,n:0,last:0,ja:0}})();
_saveHooks.push(()=>{const s=JSON.parse(localStorage.getItem(SAVE_KEY)||'{}');s.kaiwa=KD;localStorage.setItem(SAVE_KEY,JSON.stringify(s))});

/* ---------- now (for the time and greeting scenes) ---------- */
const NUMW=['twelve','one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve'];
function facts(){const d=new Date(),h24=d.getHours(),m=d.getMinutes(),h=h24%12||12,wh=(h+5)%12||12;
  const part=h24>=5&&h24<12?'morning':h24>=12&&h24<18?'afternoon':'evening',mo=part==='morning';
  return {h,m,mm:String(m).padStart(2,'0'),hw:NUMW[h],wh,part,partJ:{morning:'朝',afternoon:'昼',evening:'夜'}[part],
    greet:'Good '+part,greetJ:{morning:'おはよう',afternoon:'こんにちは',evening:'こんばんは'}[part],
    wrong:mo?'Good evening':'Good morning',wrongJ:mo?'こんばんは':'おはよう',wrongKey:mo?'evening':'morning'}}
const val=(x,F)=>typeof x==='function'?x(F):x;

/* ---------- reading what the player wrote ---------- */
const NUM={zero:0,one:1,two:2,three:3,four:4,five:5,six:6,seven:7,eight:8,nine:9,ten:10,eleven:11,twelve:12,thirteen:13,fourteen:14,fifteen:15,sixteen:16,seventeen:17,eighteen:18,nineteen:19,twenty:20,thirty:30,forty:40,fifty:50,sixty:60,hundred:100};
const STOP=new Set('a an the is am are was were be it i you he she we they my your his her its our to of in on at and or so um uh oh well that this do does did me us'.split(' '));
const NEG=new Set(['not','no','never']);
function tokens(s){s=String(s).toLowerCase().replace(/[’‘]/g,"'").replace(/\bcan't\b|\bcannot\b/g,'can not').replace(/\bwon't\b/g,'will not')
    .replace(/n't\b/g,' not').replace(/'m\b/g,' am').replace(/'re\b/g,' are').replace(/'ll\b/g,' will').replace(/'d\b/g,' would').replace(/'ve\b/g,' have').replace(/'s\b/g,' is');
  return s.replace(/[^a-z0-9 ]/g,' ').split(/\s+/).filter(Boolean).map(w=>NUM[w]!=null?String(NUM[w]):w)}
const stem=w=>w.length>3&&/s$/.test(w)&&!/ss$/.test(w)?w.slice(0,-1):w;
const content=s=>tokens(s).filter(w=>!STOP.has(w)).map(stem);
/* which answer the typed line is closest to: [index, score]. Full overlap wins; the answer's hint words help */
function match(input,opts){const A=new Set(content(input)),neg=[...A].some(w=>NEG.has(w));if(!A.size)return [-1,0];
  let best=-1,bs=0;
  opts.forEach((o,i)=>{const B=content(o[0]);if(!B.length)return;let s=B.filter(w=>A.has(w)).length/B.length;
    if(neg!==B.some(w=>NEG.has(w)))s*=.6;
    if(s>=.99)s=2;
    else if((o[5]||[]).some(k=>k==='#n'?[...A].some(w=>/^\d+$/.test(w)):content(k).every(w=>A.has(w))))s+=.6;
    if(s>bs){bs=s;best=i}});
  return bs>=.5?[best,bs]:[-1,bs]}

/* ---------- voice: the device's reader, a different pitch and speed for each person ---------- */
let enVoice=null;
function pickVoice(){if(!window.speechSynthesis)return;const vs=speechSynthesis.getVoices().filter(v=>/^en[-_]/i.test(v.lang));
  enVoice=vs.find(v=>/en[-_]US/i.test(v.lang)&&/Samantha|Google|Natural/i.test(v.name))||vs.find(v=>/en[-_]US/i.test(v.lang))||vs[0]||null}
if(window.speechSynthesis){pickVoice();speechSynthesis.addEventListener&&speechSynthesis.addEventListener('voiceschanged',pickVoice)}
function talk(en,c){if(!ST.sound||!window.speechSynthesis)return;
  try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(String(en).replace(/\.\.\.\s*/g,' ').replace(/\*[^*]*\*/g,''));u.lang='en-US';if(enVoice)u.voice=enVoice;
    u.pitch=c?c.p:1;u.rate=(ST.slow?.72:.92)*(c?c.r:1);u.volume=Math.min(1,(ST.vol&&ST.vol.voice!=null)?ST.vol.voice:1);
    const id=++talkId;talkOn=true;talkMax=Date.now()+3000+String(en).length*(ST.slow?140:100)/(c?c.r:1);u.onend=u.onerror=()=>{if(id===talkId)talkOn=false};speechSynthesis.speak(u)}catch(e){talkOn=false}}
/* the next line waits until this one has been read out (or would have been read, when the sound is off) */
let talkOn=false,talkId=0,talkMax=0;
function afterTalk(fn,gap=700,minMs=1200){const t0=Date.now();
  const wait=()=>{if(!live())return;const busy=ST.sound&&window.speechSynthesis&&(talkOn||speechSynthesis.speaking||speechSynthesis.pending)&&Date.now()<talkMax;
    if(busy||Date.now()-t0<minMs){setTimeout(wait,150);return}setTimeout(fn,gap)};setTimeout(wait,150)}

/* ---------- counts ---------- */
let FT=0;const funTotal=()=>FT||(FT=SC.reduce((a,s)=>a+s.turns.reduce((b,t)=>b+val(t.o,facts()).filter(o=>!o[1]).length,0),0));
const funN=()=>Object.keys(KD.fun).length;
const met=()=>Object.keys(KD.heart).filter(k=>KD.heart[k]>0);
const myLv=()=>{try{return MINA.level()}catch(e){return 'es'}};
const jaOn=lv=>lv==='es'||!!KD.ja;

/* the book words that came up in a talk (from the word books), learned ones marked */
let WMAP=null;
function wordMap(){if(WMAP)return WMAP;WMAP={};LV.forEach(lv=>LEVELS[lv].books.forEach(b=>b.w.forEach(w=>{const k=String(w[0]).toLowerCase();if(/^[a-z]+$/.test(k)&&k.length>2&&!WMAP[k])WMAP[k]={lv,en:w[0],ja:w[1]}})));return WMAP}
function bookWords(lines){const M=wordMap(),seen={},out=[];
  lines.forEach(l=>String(l).toLowerCase().replace(/[^a-z' ]/g,' ').split(/\s+/).forEach(w=>{const e=M[w];if(e&&!seen[w]&&!STOP.has(w)){seen[w]=1;out.push(Object.assign({got:!!ST.learned[e.lv+':'+e.en]},e))}}));
  return out}

/* ---------- Mina's line at the top of the list ---------- */
function minaLine(){const lv=myLv(),todo=SC.filter(s=>s.lv===lv&&!KD.done[s.id]);let k,v={};
  if(!KD.n)k='k_intro';else if(KD.n<3&&Math.random()<.5)k='k_tips';
  else if(todo.length&&Math.random()<.5){k='k_list';v={t:'「'+todo[0].t+'」',c:CH[todo[0].c].n}}
  else if(funN()&&Math.random()<.5){k='k_funList';v={n:funN(),tot:funTotal()}}else k='k_tips';
  return MINA.line(k,Object.assign({lvn:LVN[lv]},v))}

/* ---------- the list ---------- */
let listLv=null;
function list(){listLv=listLv||myLv();const [ex,tx]=minaLine(),S=SC.filter(s=>s.lv===listLv);
  H.show('kaiwa',`<section class="pnl kwp">
    <div class="qtop"><button class="x" id="kx" aria-label="もどる">←</button><b>💬 浜辺の 会話</b><span class="qn">😂 ${funN()}/${funTotal()}</span></div>
    <div class="kmina"><span class="lface">${MINA.face('m',ex)}</span><p>${tx}</p></div>
    <div class="seg">${LV.map(k=>`<button data-l="${k}" class="${k===listLv?'on':''}">${LVN[k]}</button>`).join('')}</div>
    <div class="lslist klist">${S.map(row).join('')}</div>
    <div class="row"><button id="kgo">🎲 おまかせで 話す</button><button id="kfun" class="sub">😂 おもしろ図鑑</button></div>
    <label class="kjat"><input type="checkbox" id="kja" ${KD.ja?'checked':''}> 日本語訳を いつも 出す <small>（小学生は いつも 出るよ）</small></label>
  </section>`);
  $('kx').onclick=()=>{SFX.pop();H.home()};
  H.panel.querySelectorAll('[data-l]').forEach(b=>b.onclick=()=>{SFX.pop();listLv=b.dataset.l;list()});
  H.panel.querySelectorAll('[data-k]').forEach(b=>b.onclick=()=>{SFX.vopen();play(b.dataset.k)});
  $('kgo').onclick=()=>{SFX.vopen();const a=S.filter(s=>!KD.done[s.id]);play(pickL(a.length?a:S).id)};
  $('kfun').onclick=()=>{SFX.vopen();funBook()};
  $('kja').onchange=e=>{KD.ja=e.target.checked?1:0;save()}}
const row=s=>{const c=CH[s.c],n=KD.done[s.id]||0;
  return `<button class="lsrow krow ${n?'clear':''}" data-k="${s.id}"><span class="ci">${c.ico}</span><span class="lt"><b>${esc(s.t)}</b><small>${esc(c.n)}・${esc(c.d)}</small></span><span class="lp">${n?'💬'+n+'回':'🪙'+PAY[s.lv]*2}</span></button>`};

/* ---------- the funny-reaction book ---------- */
function funBook(){const items=[];SC.forEach(s=>s.turns.forEach((t,ti)=>{const F=facts(),o=val(t.o,F);o.forEach((x,oi)=>{const k=s.id+':'+ti+':'+oi;if(KD.fun[k])items.push([s,x])})}));
  const [ex,tx]=MINA.line(items.length?'k_funBook':'k_funNone',{n:items.length,tot:funTotal()});
  H.show('kaiwa',`<section class="pnl kwp">
    <div class="qtop"><button class="x" id="kx" aria-label="もどる">←</button><b>😂 おもしろ反応 図鑑</b><span class="qn">${items.length}/${funTotal()}</span></div>
    <div class="kmina"><span class="lface">${MINA.face('m',ex)}</span><p>${tx}</p></div>
    <div class="kfunl">${items.map(([s,x])=>`<div class="kfi"><span class="ki">${CH[s.c].ico}</span><div><p class="kyou">「${esc(x[0])}」</p><p class="kre">${esc(x[3])} <i>${x[4]||''}</i></p></div></div>`).join('')||'<p class="note">会話で わざと へんな 答えを えらぶと、ここに たまるよ</p>'}</div>
  </section>`);
  $('kx').onclick=()=>{SFX.pop();list()}}

/* ---------- one conversation ---------- */
let P=null;   // the talk going on: scene, turn, counts
function play(id){const s=sceneOf(id);if(!s)return list();const c=CH[s.c];
  P={s,c,ti:0,fun:0,newFun:0,free:0,freeCoins:0,miss:0,asked:0,lines:[],tried:{},F:facts()};
  H.show('kaiwa',`<section class="pnl lsn kw">
    <div class="qtop"><button class="x" id="kx" aria-label="会話を やめる">←</button><b>${c.ico} ${esc(c.n)}</b><span class="qn" id="kq"></span></div>
    <div class="lslog kwlog" id="klog"></div>
    <div id="kans" class="kans"></div>
  </section>`);
  $('kx').onclick=()=>{SFX.pop();try{speechSynthesis.cancel()}catch(e){}P=null;list()};
  setTimeout(turn,250)}
const live=()=>P&&$('klog');
function scrollLog(){const l=$('klog');if(l)l.scrollTo({top:l.scrollHeight,behavior:'smooth'})}
function them(en,ja,fx,cls=''){if(!live())return;const d=document.createElement('div'),show=jaOn(P.s.lv);d.className='lsay kth '+cls;
  d.innerHTML=`<span class="lface kf">${P.c.ico}${fx?`<i class="kfx">${fx}</i>`:''}</span><div class="lbody"><p class="ken">${esc(en)}<button class="ksay" aria-label="もう一度 きく">🔊</button></p>${ja?`<small class="kja ${show?'on':''}">${esc(ja)}</small>${show?'':'<button class="kjab">訳を 見る</button>'}`:''}</div>`;
  $('klog').appendChild(d);P.lines.push(en);
  d.querySelector('.ksay').onclick=e=>{e.stopPropagation();talk(en,P&&P.c)};
  const jb=d.querySelector('.kjab');if(jb)jb.onclick=()=>{SFX.pop();jb.remove();d.querySelector('.kja').classList.add('on');scrollLog()};
  talk(en,P.c);scrollLog()}
function you(en,typed){if(!live())return;const d=document.createElement('div');d.className='lsay by-h kyou-b';
  d.innerHTML=`<span class="lface kf you">⭐</span><div class="lbody"><p>${esc(en)}${typed?'<small class="kty">✍️</small>':''}</p></div>`;$('klog').appendChild(d);P.lines.push(en);scrollLog()}
function note(html){if(!live())return;const d=document.createElement('p');d.className='knote';d.innerHTML=html;$('klog').appendChild(d);scrollLog()}

function turn(){if(!live())return;const T=P.s.turns[P.ti];if(!T)return end();
  $('kq').textContent=`${P.ti+1}/${P.s.turns.length}`;
  P.opts=val(T.o,P.F);P.tried={};
  if(T.ask){note(`❓ こんどは あなたの 番！ <b>${esc(T.ask)}</b>`);answers()}
  else{them(val(T.s,P.F),val(T.j,P.F));setTimeout(answers,350)}}
/* the choices, and a box to write (or say) your own */
function answers(hint){if(!live())return;const T=P.s.turns[P.ti],order=P.order&&P.order.length===P.opts.length?P.order:H.shuffle(P.opts.map((o,i)=>i));P.order=order;
  const mic=window.SpeechRecognition||window.webkitSpeechRecognition;
  $('kans').innerHTML=`${hint?`<p class="khint">💡 たとえば：<b>${esc(hint)}</b></p>`:''}
    <div class="lopts kopts">${order.map(i=>{const o=P.opts[i],t=P.tried[i];return `<button data-o="${i}" ${t?'disabled class="tried"':''}>${esc(o[0])}${t?' <i>'+(o[4]||'😂')+'</i>':''}</button>`}).join('')}</div>
    <div class="kfree"><input id="kin" type="text" placeholder="${T.ask?'質問を 書いてもOK':'英語を 書いてもOK'}" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" enterkeyhint="send">${mic?'<button id="kmic" class="sub" aria-label="声で 言う">🎤</button>':''}<button id="ksend" aria-label="送る">▶</button></div>`;
  $('kans').querySelectorAll('[data-o]').forEach(b=>b.onclick=()=>pick(+b.dataset.o));
  const inp=$('kin'),send=()=>{const v=inp.value.trim();if(!v)return;typed(v)};
  $('ksend').onclick=send;inp.onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();send()}};
  const mb=$('kmic');if(mb)mb.onclick=()=>listen(mic,inp,mb)}
function listen(R,inp,mb){try{const r=new R();r.lang='en-US';r.interimResults=false;r.maxAlternatives=1;mb.classList.add('on');
  r.onresult=e=>{const t=e.results[0][0].transcript;inp.value=t;mb.classList.remove('on');typed(t)};
  r.onerror=r.onend=()=>mb.classList.remove('on');r.start()}catch(e){mb.classList.remove('on');H.toast('🎤 この 端末では 声の 入力が つかえないみたい')}}
/* the player wrote something: the closest answer, or the person doesn't understand */
function typed(v){if(!live())return;const [i,sc]=match(v,P.opts);
  if(i<0){you(v,true);$('kans').innerHTML='';P.miss++;
    setTimeout(()=>{const h=pickL(P.c.huh);them(h[0],h[1],'❓','k-huh');SFX.tease&&SFX.tease();
      const good=P.opts.filter(o=>o[1]);setTimeout(()=>answers((pickL(good.length?good:P.opts))[0]),500)},600);return}
  pick(i,v,sc<2)}
function pick(i,typedText,near){if(!live())return;const T=P.s.turns[P.ti],o=P.opts[i];$('kans').innerHTML='';
  you(typedText||o[0],!!typedText);
  if(typedText&&o[1]){P.free++;KD.free++;if(P.freeCoins<3){P.freeCoins++;setTimeout(()=>{const r=$('klog')&&$('klog').getBoundingClientRect();if(r)H.coinBurst(r.right-40,r.bottom-30,1)},400)}}
  if(T.ask)P.asked++;
  setTimeout(()=>{if(!live())return;
    if(!o[1]){funny(i);them(o[2],o[3],o[4]||'😅','k-oops');if(T.ask){next();return}P.tried[i]=1;setTimeout(()=>{note(pickL(OOPS));answers()},700);return}
    /* written words close to an answer but not the same: a plain "I see" so the reply does not talk about what was not said */
    const g=near&&!T.ask?pickL(P.c.ok||[["Oh, I see! Thank you.","へえ、なるほど！ ありがとう"]]):[o[2],o[3]];
    them(g[0],g[1],o[4]||'😊','k-good');SFX.heart?SFX.heart():SFX.chime();next()},650)}
function next(){P.ti++;P.order=null;afterTalk(turn)}
const OOPS=['😂 おもしろい 反応！ ほかの 答えでも 話してみよう','🤣 ウケた！ じゃあ こんどは ちがう 答えで','😆 へんな 答えも 大かんげい。もう一度 どうぞ','😝 相手、こまってるね。ほかの 答えも ためしてみて'];
/* a funny answer: counted for the book (new ones give 2 coins) */
function funny(i){P.fun++;SFX.tease&&SFX.tease();const k=P.s.id+':'+P.ti+':'+i;
  if(!KD.fun[k]){KD.fun[k]=1;P.newFun++;save();setTimeout(()=>{H.toast(`😂 おもしろ反応 はっけん！<small>図鑑 ${funN()}/${funTotal()}　+2まい</small>`,2600);const r=$('klog')&&$('klog').getBoundingClientRect();if(r)H.coinBurst(r.left+60,r.top+40,2)},900)}}

/* ---------- the end: goodbye, coins, Mina's word ---------- */
function end(){if(!live())return;const s=P.s,c=P.c,first=!KD.done[s.id],pay=first?PAY[s.lv]*2:Math.max(2,PAY[s.lv]/2|0);
  them(s.bye[0],s.bye[1],'👋','k-good');
  KD.done[s.id]=(KD.done[s.id]||0)+1;const firstMeet=!KD.heart[s.c];KD.heart[s.c]=(KD.heart[s.c]||0)+1;KD.n++;KD.ask=(KD.ask||0)+P.asked;KD.last=Date.now();save();
  /* what Mina says about it */
  let k='k_endGood',v={c:c.n,n:P.fun,free:P.free,h:KD.heart[s.c]};
  if(KD.n===1)k='k_endFirst';else if(P.free>=2)k='k_endFree';else if(P.fun>=2)k='k_endFunny';else if(P.miss>=2)k='k_endHuh';else if(!P.fun&&!P.miss)k='k_endClean';
  if(KD.heart[s.c]===3||KD.heart[s.c]===5||KD.heart[s.c]===10)k='k_endFriend';
  const [ex,tx]=MINA.line(k,v),words=bookWords(P.lines).slice(0,10),got=words.filter(w=>w.got).length;
  setTimeout(()=>{if(!live())return;$('kq').textContent='🎉';
    $('kans').innerHTML=`<div class="kres">
      <p class="kpay">🪙 <b>${pay}まい</b>${first?' <small>はじめての 会話は 2ばい！</small>':''}</p>
      <div class="kstat"><span>😂 おもしろ反応 <b>${P.fun}</b>${P.newFun?` <small>（新しく ${P.newFun}）</small>`:''}</span><span>✍️ 自分で 言えた <b>${P.free}</b></span><span>${c.ico} なかよし <b>${'♥'.repeat(Math.min(5,KD.heart[s.c]))}</b>${KD.heart[s.c]>5?'+':''}</span></div>
      ${firstMeet?`<p class="knew">${c.ico} <b>${esc(c.n)}</b>と ともだちに なった！</p>`:''}
      <div class="kmina"><span class="lface">${MINA.face('m',ex)}</span><p>${tx}</p></div>
      ${words.length?`<div class="kwords"><small>会話に 出てきた 単語帳の ことば（✓ おぼえた ${got}/${words.length}）</small><div>${words.map(w=>`<button data-w="${esc(w.en)}" data-lv="${w.lv}" class="${w.got?'got':''}">${w.got?'✓ ':''}${esc(w.en)}<small>${esc(w.ja)}</small></button>`).join('')}</div></div>`:''}
      <div class="row"><button id="kagain" class="sub">🔁 もう一度</button><button id="kmore">💬 ほかの 人と 話す</button></div>
    </div>`;
    const r=$('kans').getBoundingClientRect();H.coinBurst(r.left+r.width/2,r.top+20,pay);SFX.fanfare?SFX.fanfare(1):SFX.chime();
    $('kans').querySelectorAll('[data-w]').forEach(b=>b.onclick=()=>H.say(b.dataset.lv,b.dataset.w));
    $('kagain').onclick=()=>{SFX.vopen();play(s.id)};$('kmore').onclick=()=>{SFX.vopen();list()};
    setTimeout(()=>$('kans').scrollIntoView({behavior:'smooth',block:'end'}),100)},1600)}

window.KAIWA={open:list,play,rec:()=>KD,scenes:SC,chars:CH,funN,funTotal,met,match,_facts:facts};
})();
