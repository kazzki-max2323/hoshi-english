/* 浜辺の 会話: 浜辺の キャラ（ゲンじい・ソラ・ポチ・旅行者の エマ…）と 英語で おしゃべり。
   - 相手の 話に 答える（えらぶ / 自分で 書く / 声で 言う）。こっちから 質問する 番も ある
   - まちがえても 相手が 困ったり 笑ったり して、そのまま 話が すすむ（やり直しは さいしょから）。その 反応は「おもしろ反応 図鑑」に たまって コインも もらえる
   - ながい 会話（game/kaiwa-story.js）は 答えで 話が 分かれ、エンドが いくつも ある。★の エンドを めざして 何度も 話す
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
/* grammar (game/gram-see.js): grammar lights up in the lines; every 文法の 答え is open (the notes are all free now) */
const GS=()=>window.GRAMSEE,gOwn=id=>true /* 文法ノートは ぜんぶ ひらいている */;

/* ---------- the record ---------- */
const KD=(()=>{try{const s=JSON.parse(localStorage.getItem(SAVE_KEY)||'{}').kaiwa;if(s&&s.done)return s}catch(e){}return {done:{},heart:{},fun:{},free:0,ask:0,n:0,last:0,ja:0}})();
KD.end=KD.end||{};   // endings found: 'scene:ending'
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
/* Japanese names read the English way sound wrong (Gen = "jen", Mike = "maik"): spelled for the voice only, the text stays as it is */
const SAYAS={Gen:'Ghen',Tome:'Toh-meh',Mike:'Mee-keh',Kanio:'Kah-nee-oh',Pochi:'Poh-chee',Kamekichi:'Kah-meh-kee-chee',Mina:'Meena',Hana:'Hahna'};
const sayAs=t=>t.replace(new RegExp('\\b('+Object.keys(SAYAS).join('|')+')\\b','g'),m=>SAYAS[m]);
function talk(en,c){if(!ST.sound||!window.speechSynthesis)return;
  try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(sayAs(String(en)).replace(/\.\.\.\s*/g,' ').replace(/\*[^*]*\*/g,''));u.lang='en-US';if(enVoice)u.voice=enVoice;
    u.pitch=c?c.p:1;u.rate=(ST.slow?.72:.92)*(c?c.r:1);u.volume=Math.min(1,(ST.vol&&ST.vol.voice!=null)?ST.vol.voice:1);
    const id=++talkId;talkOn=true;talkMax=Date.now()+3000+String(en).length*(ST.slow?140:100)/(c?c.r:1);u.onend=u.onerror=()=>{if(id===talkId)talkOn=false};speechSynthesis.speak(u)}catch(e){talkOn=false}}
/* the next line waits until this one has been read out (or would have been read, when the sound is off) */
let talkOn=false,talkId=0,talkMax=0;
function afterTalk(fn,gap=700,minMs=1200){const t0=Date.now();
  const wait=()=>{if(!live())return;const busy=ST.sound&&window.speechSynthesis&&(talkOn||speechSynthesis.speaking||speechSynthesis.pending)&&Date.now()<talkMax;
    if(busy||Date.now()-t0<minMs){setTimeout(wait,150);return}setTimeout(fn,gap)};setTimeout(wait,150)}

/* ---------- every talk as nodes ----------
   ながい 会話（game/kaiwa-story.js）は ノードを もつ。みじかい 会話（turns）は 1本道の ノード '0','1',… と さいごの 'end' に する。
   どの 答えを えらんでも 話は すすむ（まちがえても やり直さない）。エンドは 答えしだい */
const NODES={};
function nodesOf(s){if(s.nodes)return s.nodes;if(NODES[s.id])return NODES[s.id];const n={};
  s.turns.forEach((t,i)=>n[i]=Object.assign({},t,{nx:i+1<s.turns.length?String(i+1):'end'}));n.end={end:1,auto:1};return NODES[s.id]=n}
const startOf=s=>s.start||'0';
/* the endings of a talk: [key, good, title] */
const endsOf=s=>s.nodes?Object.entries(s.nodes).filter(([,n])=>n.end).map(([k,n])=>[k,!!n.good,n.t]):[['ok',true,'ばっちり 会話'],['fun',false,'ちょっと へんな 会話']];
const endsGot=s=>endsOf(s).filter(e=>KD.end[s.id+':'+e[0]]).length;
const endsAll=()=>SC.reduce((a,s)=>a+endsOf(s).length,0),endsN=()=>Object.keys(KD.end).length;

/* ---------- counts ---------- */
let FT=0;const funTotal=()=>FT||(FT=SC.reduce((a,s)=>a+Object.values(nodesOf(s)).filter(n=>n.o).reduce((b,n)=>b+val(n.o,facts()).filter(o=>!o[1]).length,0),0));
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
function minaLine(){const lv=myLv(),todo=SC.filter(s=>s.lv===lv&&!KD.done[s.id]),story=todo.find(s=>s.story);let k,v={};
  if(!KD.n)k='k_intro';else if(KD.n<3&&Math.random()<.5)k='k_tips';
  else if(story&&Math.random()<.5){k='k_story';v={t:'「'+story.t+'」',c:CH[story.c].n}}
  else if(todo.length&&Math.random()<.4){k='k_list';v={t:'「'+todo[0].t+'」',c:CH[todo[0].c].n}}
  else if(endsN()&&Math.random()<.5){k='k_endsList';v={n:endsN(),tot:endsAll()}}
  else if(funN()&&Math.random()<.5){k='k_funList';v={n:funN(),tot:funTotal()}}else k='k_tips';
  return MINA.line(k,Object.assign({lvn:LVN[lv]},v))}

/* ---------- the list: the long talks first ---------- */
let listLv=null;
function list(){listLv=listLv||myLv();const [ex,tx]=minaLine(),S=SC.filter(s=>s.lv===listLv).sort((a,b)=>(b.story?1:0)-(a.story?1:0));
  H.show('kaiwa',`<section class="pnl kwp">
    <div class="qtop"><button class="x" id="kx" aria-label="もどる">←</button><b>💬 浜辺の 会話</b><span class="qn">🏁 ${endsN()}/${endsAll()}　😂 ${funN()}/${funTotal()}</span></div>
    <div class="kmina"><span class="lface">${MINA.face('m',ex,MINA.poseFor(ex,tx))}</span><p>${tx}</p></div>
    <div class="seg">${LV.map(k=>`<button data-l="${k}" class="${k===listLv?'on':''}">${LVN[k]}</button>`).join('')}</div>
    <div class="lslist klist">${S.map(row).join('')}</div>
    <div class="row"><button id="kgo">🎲 おまかせで 話す</button><button id="kfun" class="sub">😂 おもしろ図鑑</button></div>
    <label class="kjat"><input type="checkbox" id="kja" ${KD.ja?'checked':''}> 日本語訳を いつも 出す <small>（小学生は いつも 出るよ）</small></label>
  </section>`);
  $('kx').onclick=()=>{SFX.pop();H.home()};
  H.panel.querySelectorAll('[data-l]').forEach(b=>b.onclick=()=>{SFX.pop();listLv=b.dataset.l;list()});
  H.panel.querySelectorAll('[data-k]').forEach(b=>b.onclick=()=>{SFX.talk();play(b.dataset.k)});
  $('kgo').onclick=()=>{SFX.talk();const a=S.filter(s=>!KD.done[s.id]);play(pickL(a.length?a:S).id)};
  $('kfun').onclick=()=>{SFX.book();funBook()};
  $('kja').onchange=e=>{KD.ja=e.target.checked?1:0;save()}}
const row=s=>{const c=CH[s.c],n=KD.done[s.id]||0,g=endsGot(s),t=endsOf(s).length,star=endsOf(s).some(e=>e[1]&&KD.end[s.id+':'+e[0]]);
  return `<button class="lsrow krow ${n?'clear':''} ${s.story?'kstory':''}" data-k="${s.id}"><span class="ci">${c.ico}</span><span class="lt"><b>${s.story?'📖 ':''}${esc(s.t)}</b><small>${s.story?'ながい 会話・エンド '+t+'こ・':''}${esc(c.n)}・${esc(c.d)}</small></span><span class="lp">${n?`${star?'★':'🏁'}${g}/${t}`:'🪙'+PAY[s.lv]*2}</span></button>`};

/* ---------- the funny-reaction book ---------- */
function funBook(){const items=[],F=facts();SC.forEach(s=>Object.entries(nodesOf(s)).forEach(([nk,n])=>{if(!n.o)return;val(n.o,F).forEach((x,oi)=>{if(KD.fun[s.id+':'+nk+':'+oi])items.push([s,x])})}));
  const [ex,tx]=MINA.line(items.length?'k_funBook':'k_funNone',{n:items.length,tot:funTotal()});
  H.show('kaiwa',`<section class="pnl kwp">
    <div class="qtop"><button class="x" id="kx" aria-label="もどる">←</button><b>😂 おもしろ反応 図鑑</b><span class="qn">${items.length}/${funTotal()}</span></div>
    <div class="kmina"><span class="lface">${MINA.face('m',ex,MINA.poseFor(ex,tx))}</span><p>${tx}</p></div>
    <div class="kfunl">${items.map(([s,x])=>`<div class="kfi"><span class="ki">${CH[s.c].ico}</span><div><p class="kyou">「${esc(x[0])}」</p><p class="kre">${esc(x[3])} <i>${x[4]||''}</i></p></div></div>`).join('')||'<p class="note">会話で わざと へんな 答えを えらぶと、ここに たまるよ</p>'}</div>
    ${window.TUTOR&&TUTOR.funList().length?`<p class="tusys">👦 リクの へんな英文（家庭教師の バイト）</p><div class="kfunl">${TUTOR.funList().map(f=>`<div class="kfi"><span class="ki">👦</span><div><p class="kyou">「${esc(f.en)}」</p><p class="kre">⭕ ${esc(f.ok)}</p></div></div>`).join('')}</div>`:''}
  </section>`);
  $('kx').onclick=()=>{SFX.pop();list()}}

/* ---------- one conversation ---------- */
let P=null;   // the talk going on: scene, node, counts
function play(id,from){const s=sceneOf(id);if(!s)return list();const c=CH[s.c];
  P={s,c,from,at:startOf(s),step:0,lock:[],lockSeen:new Set(),fun:0,newFun:0,free:0,freeCoins:0,miss:0,asked:0,lines:[],F:facts()};
  H.show('kaiwa',`<section class="pnl lsn kw">
    <div class="qtop"><button class="x" id="kx" aria-label="会話を やめる">←</button><b>${c.ico} ${esc(c.n)}</b><span class="qn" id="kq"></span></div>
    <div class="lslog kwlog" id="klog"></div>
    <div id="kans" class="kans"></div>
  </section>`);
  $('kx').onclick=()=>{SFX.pop();try{speechSynthesis.cancel()}catch(e){}const f=P&&P.from;P=null;f==='visit'?H.home():list()};
  setTimeout(turn,250)}
const live=()=>P&&$('klog');
function scrollLog(){const l=$('klog');if(l)l.scrollTo({top:l.scrollHeight,behavior:'smooth'})}
function them(en,ja,fx,cls=''){if(!live())return;const d=document.createElement('div'),show=jaOn(P.s.lv);d.className='lsay kth '+cls;
  d.innerHTML=`<span class="lface kf">${P.c.ico}${fx?`<i class="kfx">${fx}</i>`:''}</span><div class="lbody"><p class="ken">${GS()?GS().mark(en):esc(en)}<button class="ksay" aria-label="もう一度 きく">🔊</button></p>${ja?`<small class="kja ${show?'on':''}">${esc(ja)}</small>${show?'':'<button class="kjab">訳を 見る</button>'}`:''}</div>`;
  $('klog').appendChild(d);P.lines.push(en);if(GS()){GS().record(en);GS().bind(d)}
  d.querySelector('.ksay').onclick=e=>{e.stopPropagation();talk(en,P&&P.c)};
  const jb=d.querySelector('.kjab');if(jb)jb.onclick=()=>{SFX.pop();jb.remove();d.querySelector('.kja').classList.add('on');scrollLog()};
  talk(en,P.c);scrollLog()}
function you(en,typed){if(!live())return;const d=document.createElement('div');d.className='lsay by-h kyou-b';
  d.innerHTML=`<span class="lface kf you">⭐</span><div class="lbody"><p>${esc(en)}${typed?'<small class="kty">✍️</small>':''}</p></div>`;$('klog').appendChild(d);P.lines.push(en);scrollLog()}
function note(html){if(!live())return;const d=document.createElement('p');d.className='knote';d.innerHTML=html;$('klog').appendChild(d);scrollLog()}

function turn(){if(!live())return;const N=nodesOf(P.s)[P.at];if(!N)return;if(N.end)return end(N);
  P.step++;P.N=N;const all=val(N.o,P.F)||[];P.opts=all.filter(o=>!o.g||gOwn(o.g));P.lock=all.filter(o=>o.g&&!gOwn(o.g));P.order=null;
  P.lock.forEach(o=>P.lockSeen.add(o.g));
  $('kq').textContent=P.s.story?`💬 ${P.step}`:`${P.step}/${P.s.turns.length}`;
  if(N.ask){note(`❓ こんどは あなたの 番！ <b>${esc(N.ask)}</b>`);answers()}
  else{them(val(N.s,P.F),val(N.j,P.F));setTimeout(answers,350)}}
/* the choices, and a box to write (or say) your own */
function answers(hint){if(!live())return;const N=P.N,order=P.order&&P.order.length===P.opts.length?P.order:H.shuffle(P.opts.map((o,i)=>i));P.order=order;
  const mic=window.SpeechRecognition||window.webkitSpeechRecognition;
  $('kans').innerHTML=`${hint?`<p class="khint">💡 たとえば：<b>${esc(hint)}</b></p>`:''}
    <div class="lopts kopts">${order.map(i=>`<button data-o="${i}" class="${P.opts[i].g?'kgram':''}">${P.opts[i].g?'📘 ':''}${esc(P.opts[i][0])}</button>`).join('')}</div>
    <div class="kfree"><input id="kin" type="text" placeholder="${N.ask?'質問を 書いてもOK':'英語を 書いてもOK'}" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" enterkeyhint="send">${mic?'<button id="kmic" class="sub" aria-label="声で 言う">🎤</button>':''}<button id="ksend" aria-label="送る">▶</button></div>`;
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
/* any answer moves the talk on: a funny one takes it somewhere funny */
function pick(i,typedText,near){if(!live())return;const N=P.N,o=P.opts[i];$('kans').innerHTML='';
  you(typedText||o[0],!!typedText);
  if(typedText&&o[1]){P.free++;KD.free++;if(P.freeCoins<3){P.freeCoins++;setTimeout(()=>{const r=$('klog')&&$('klog').getBoundingClientRect();if(r)H.coinBurst(r.right-40,r.bottom-30,1)},400)}}
  if(N.ask)P.asked++;
  setTimeout(()=>{if(!live())return;
    if(!o[1]){funny(i);them(o[2],o[3],o[4]||'😅','k-oops')}
    else{/* written words close to an answer but not the same: a plain "I see" so the reply does not talk about what was not said */
      const g=near&&!N.ask&&!P.s.story?pickL(P.c.ok||[["Oh, I see! Thank you.","へえ、なるほど！ ありがとう"]]):[o[2],o[3]];
      them(g[0],g[1],o[4]||'😊','k-good');SFX.heart?SFX.heart():SFX.chime()}
    P.at=o[6]||N.nx||'end';afterTalk(turn)},650)}
/* a funny answer: counted for the book (new ones give 2 coins) */
function funny(i){P.fun++;SFX.tease&&SFX.tease();const k=P.s.id+':'+P.at+':'+i;
  if(!KD.fun[k]){KD.fun[k]=1;P.newFun++;save();setTimeout(()=>{H.toast(`😂 おもしろ反応 はっけん！<small>図鑑 ${funN()}/${funTotal()}　+2まい</small>`,2600);const r=$('klog')&&$('klog').getBoundingClientRect();if(r)H.coinBurst(r.left+60,r.top+40,2)},900)}}

/* ---------- the end: the last line, which ending, coins, Mina's word ---------- */
function end(N){if(!live())return;const s=P.s,c=P.c,first=!KD.done[s.id];
  let key,good,title,ln;
  if(N.auto){good=!P.fun;key=good?'ok':'fun';title=good?'ばっちり 会話':'ちょっと へんな 会話';ln=[s.bye[0],s.bye[1],good?'👋':'😅']}
  else{key=P.at;good=!!N.good;title=N.t;ln=[N.s,N.j,N.fx||(good?'🌟':'😂')]}
  them(ln[0],ln[1],ln[2],good?'k-good':'k-oops');
  const ek=s.id+':'+key,newEnd=!KD.end[ek];KD.end[ek]=1;
  const bonus=newEnd&&s.story?(good?6:3):0,pay=(first?PAY[s.lv]*2:Math.max(2,PAY[s.lv]/2|0))+bonus;
  KD.done[s.id]=(KD.done[s.id]||0)+1;const firstMeet=!KD.heart[s.c];KD.heart[s.c]=(KD.heart[s.c]||0)+1;KD.n++;KD.ask=(KD.ask||0)+P.asked;KD.last=Date.now();save();
  const E=endsOf(s),got=endsGot(s),tot=E.length,starGot=E.some(e=>e[1]&&KD.end[s.id+':'+e[0]]);
  /* what Mina says about it */
  let k='k_endGood',v={c:c.n,n:P.fun,free:P.free,h:KD.heart[s.c],t:title,got,tot};
  if(KD.n===1)k='k_endFirst';
  else if(got===tot)k='k_endAll';
  else if(s.story)k=good?'k_endTrue':'k_endBad';
  else if(P.free>=2)k='k_endFree';else if(P.fun>=2)k='k_endFunny';else if(P.miss>=2)k='k_endHuh';else if(!P.fun&&!P.miss)k='k_endClean';
  if(KD.heart[s.c]===3||KD.heart[s.c]===5||KD.heart[s.c]===10)k='k_endFriend';
  /* grammar: an ending opened by a grammar answer, or a grammar answer you could not pick */
  const LK=[...P.lockSeen].map(id=>GS()&&GS().byId(id)).filter(Boolean);
  if(N.gram){k='k_endGram';v.g='「'+(GS()&&GS().byId(N.gram)?GS().byId(N.gram).n.t:'')+'」'}
  const GL=GS()?GS().inLines(P.lines):[];
  const [ex,tx]=MINA.line(k,v),words=bookWords(P.lines).slice(0,10),wgot=words.filter(w=>w.got).length;
  setTimeout(()=>{if(!live())return;$('kq').textContent=good?'★':'🏁';
    $('kans').innerHTML=`<div class="kres">
      <p class="kend ${good?'good':'fun'}">${good?'★':'😂'} エンド「${esc(title)}」${newEnd?' <small>NEW!</small>':''}</p>
      <div class="kends">${E.map(e=>KD.end[s.id+':'+e[0]]?`<span class="${e[1]?'g':''} ${e[0]===key?'now':''}">${e[1]?'★':'😂'} ${esc(e[2])}</span>`:`<span class="no">${e[1]?'★':'？'} ？？？</span>`).join('')}</div>
      <p class="kendn">🏁 見つけた エンド ${got}/${tot}${good?'':starGot?'　ほかの 道も ためしてみて':'　<b>★の エンドは べつの 道の 先に あるよ</b>'}</p>
      <p class="kpay">🪙 <b>${pay}まい</b>${first?' <small>はじめての 会話は 2ばい！</small>':''}${bonus?` <small>新しい エンド +${bonus}</small>`:''}</p>
      <div class="kstat"><span>😂 おもしろ反応 <b>${P.fun}</b>${P.newFun?` <small>（新しく ${P.newFun}）</small>`:''}</span><span>✍️ 自分で 言えた <b>${P.free}</b></span><span>${c.ico} なかよし <b>${'♥'.repeat(Math.min(5,KD.heart[s.c]))}</b>${KD.heart[s.c]>5?'+':''}</span></div>
      ${firstMeet?`<p class="knew">${c.ico} <b>${esc(c.n)}</b>と ともだちに なった！</p>`:''}
      <div class="kmina"><span class="lface">${MINA.face('m',ex,MINA.poseFor(ex,tx))}</span><p>${tx}</p></div>
      ${GL.length||LK.length?`<div class="kwords kgl"><small>📘 この 会話に 出てきた 文法</small><div>${GL.map(g=>`<button data-kg="${g.id}" class="got">📘 ${esc(g.n.t)}<small>ノートを ひらく</small></button>`).join('')}</div></div>`:''}
      ${words.length?`<div class="kwords"><small>会話に 出てきた 単語帳の ことば（✓ おぼえた ${wgot}/${words.length}）</small><div>${words.map(w=>`<button data-w="${esc(w.en)}" data-lv="${w.lv}" class="${w.got?'got':''}">${w.got?'✓ ':''}${esc(w.en)}<small>${esc(w.ja)}</small></button>`).join('')}</div></div>`:''}
      <div class="row"><button id="kagain" class="${good?'sub':''}">🔁 さいしょから</button><button id="kmore" class="${good?'':'sub'}">${P.from==='visit'?'🏖️ 浜辺に もどる':'💬 ほかの 人と 話す'}</button></div>
    </div>`;
    const r=$('kans').getBoundingClientRect();H.coinBurst(r.left+r.width/2,r.top+20,pay);good?SFX.done():(SFX.tease?SFX.tease():SFX.pop());
    $('kans').querySelectorAll('[data-w]').forEach(b=>b.onclick=()=>H.say(b.dataset.lv,b.dataset.w));
    $('kans').querySelectorAll('[data-kg]').forEach(b=>b.onclick=()=>{const g=GS().byId(b.dataset.kg),back=()=>{const f=P&&P.from;P=null;f==='visit'?H.home():list()};SFX.book();try{speechSynthesis.cancel()}catch(e){}
      H.gramNote(g.lv,g.i)});
    const from=P.from;$('kagain').onclick=()=>{SFX.step();play(s.id,from)};$('kmore').onclick=()=>{SFX.back();from==='visit'?H.home():list()};
    setTimeout(()=>$('kans').scrollIntoView({behavior:'smooth',block:'end'}),100)},1600)}

/* ---------- someone comes by: about once in 10 minutes on the home screen, a beach friend walks up and talks to you ----------
   the long talks (with endings) come more often; talks not done yet, or without a ★ ending yet, too. They wait 2 minutes, then go home */
let visitAt=0,visitGap=(3+Math.random()*2)*60000,lastV=performance.now(),VIS=null,lastId=null;
function visitPick(){const i=Math.max(0,LV.indexOf(myLv())),pool=SC.filter(s=>{const j=LV.indexOf(s.lv);return j<=i&&j>=i-1&&s.id!==lastId});const A=pool.length?pool:SC;
  const star=s=>endsOf(s).some(e=>e[1]&&KD.end[s.id+':'+e[0]]);
  const w=s=>(s.story?4:1)*(s.lv===LV[i]?2:1)*(!KD.done[s.id]?3:star(s)?.5:1.5);
  let t=A.reduce((a,s)=>a+w(s),0)*Math.random();for(const s of A){t-=w(s);if(t<=0)return s}return A[0]}
function visit(){const s=visitPick();if(!s)return;lastId=s.id;const c=CH[s.c],N=nodesOf(s)[startOf(s)];
  const hi=String(val(N.s||'Hi!',facts())).split(/(?<=[.!?])\s+/).reduce((a,x)=>!a||a.length+x.length<46?(a?a+' ':'')+x:a,'');
  VIS={id:s.id,until:Date.now()+120000};
  const b=document.createElement('button');b.id='kvisit';b.className='kvisit';b.setAttribute('aria-label',c.n+'が 話しかけてきた。タップで 話す');
  b.innerHTML=`<span class="kvi">${c.ico}</span><span class="kvt"><b>${esc(hi)}</b><small>${esc(c.n)}が 話しかけてきた！ タップで 話す</small></span>`;
  const go=()=>{leave(true);play(s.id,'visit')};
  b.onclick=e=>{e.stopPropagation();SFX.talk();go()};document.body.appendChild(b);place();SFX.knock();
  if(window.MINA&&MINA.canAnnounce&&MINA.canAnnounce()){const [ex,tx]=MINA.line(s.story?'k_visitStory':'k_visit',{c:c.n,ico:c.ico,t:s.t});MINA.say('m',ex,tx,8000,null,['💬 話す',go])}}
/* sit just above the home panel (its height changes with what Mina says) */
function place(){const b=$('kvisit');if(!b||b.hidden)return;const top=H.panel.firstElementChild?H.panel.firstElementChild.getBoundingClientRect().top:innerHeight-260;b.style.bottom=Math.max(80,innerHeight-top+16)+'px'}
function leave(now){const b=$('kvisit');VIS=null;if(!b)return;if(now){b.remove();return}b.classList.add('bye');setTimeout(()=>b.remove(),700)}
setInterval(()=>{const t=performance.now(),dt=t-lastV;lastV=t;if(document.hidden)return;
  const home=H.screen==='home';
  if(VIS){const b=$('kvisit');if(b){b.hidden=!home;place()}if(Date.now()>VIS.until)leave();return}
  if(!home)return;visitAt+=dt;if(visitAt<visitGap)return;
  if(window.MINA&&MINA.busy&&MINA.busy())return;   // not while Mina or Hamako is talking
  visitAt=0;visitGap=(8+Math.random()*4)*60000;visit()},1500);

/* every 文法の 答え in the talks: [{s, id}] (Mina tells about the ones you cannot pick yet) */
const gramOpts=()=>{const out=[];SC.forEach(s=>s.nodes&&Object.values(s.nodes).forEach(n=>{if(Array.isArray(n.o))n.o.forEach(o=>{if(o.g)out.push({s,id:o.g})})}));return out};
window.KAIWA={open:list,play,gramOpts,visit,rec:()=>KD,scenes:SC,chars:CH,funN,funTotal,endsN,endsAll,endsOf,endsGot,met,match,_facts:facts};
})();
