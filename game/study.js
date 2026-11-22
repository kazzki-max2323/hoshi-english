/* ミナ先生の 勉強を 「シンプル → くわしく」「自動で はじまる」 形に する しくみ（STUDY）
   - ミナ先生の ページ: 「きょうの 1本」だけ 大きく。 ひらくと 先生が 話しかけて 3びょうで 自動スタート（「あとで」で とめる）
   - 「きょうは 何分？」（5・10・15・30分）で 授業＋ふくしゅう＋会話を 自動で 組む。 まちがいが あれば 「きのう まちがえた ○○、 もう1回 やろう？」から
   - 文法ごとの 4ステップの 道（授業 → とっくん → 会話 → ノート）。 入口は 「習う・ふくしゅう・話す」の 3つ
   - 3つ すすむごとに 1分の ひと休み（雑談・うんちく）
   - 数字の かわりに 「もう 過去形の 文が 読めるね」と できるように なった ことを ことばで
   - 授業の 中で つかう 道具: まちがえた 理由を 当てる why()・「？」で やさしく 言いなおす easy()・なれた 文法ほど 英語が ふえる en()
   中身（ことば・くらべる 文法・ひと休みの 話）は game/study-data.js。 きろくは localStorage 'hoshi_study' */
(()=>{
const {S:ST,sfx:SFX}=BEACH;
const H=HE,esc=H.esc,$=id=>document.getElementById(id);
const pickL=a=>a[Math.random()*a.length|0];
const KEY='hoshi_study';
const SD=(()=>{try{const s=JSON.parse(localStorage.getItem(KEY)||'null');if(s&&typeof s==='object')return s}catch(e){}return {}})();
SD.p=SD.p||{};SD.can=SD.can||[];
const keep=()=>{try{localStorage.setItem(KEY,JSON.stringify(SD))}catch(e){}};
const dk=d=>{d=d||new Date();return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate()};
const ML=(k,v)=>{try{return MINA.line(k,v||{})}catch(e){return ['smile','']}};

/* ---------- 文法と 授業 ---------- */
const GLV=['es','jh','hs'];
const hasG=()=>typeof GRAMMAR!=='undefined';
const notes=()=>hasG()?GLV.flatMap(lv=>(GRAMMAR[lv]?GRAMMAR[lv].notes:[]).map((n,i)=>({lv,i,n}))):[];
const gOf=id=>notes().find(g=>g.n.id===id);
const gName=id=>{const g=gOf(id);return g?g.n.t.replace(/（.*?）/g,'').trim():''};
const LES=id=>typeof LESSONS!=='undefined'?LESSONS.find(l=>l.id===id):null;
const lesFor=id=>(typeof GRAM_LES!=='undefined'&&GRAM_LES[id]||[]).map(LES).filter(Boolean);
const lesDone=id=>!!((MINA.rec().les||{})[id]);
const noteOk=id=>(ST.gram&&ST.gram.cleared||[]).includes(id);
const scenes=()=>window.SENSEI?SENSEI.scenes:[];
const snDone=id=>!!(window.SENSEI&&(SENSEI.rec().done||{})[id]);
const scenesFor=id=>scenes().filter(s=>(s.g||[]).includes(id));
/* the grammar a lesson teaches（同じ レベルの ノートを 先に） */
function gidOf(l){if(!l)return null;try{const a=window.GRAMLINK&&GRAMLINK.notesFor(l.id);return a&&a[0]?a[0].n.id:null}catch(e){return null}}
const lvNow=()=>{let l='es';try{l=MINA.level()}catch(e){}return l==='adv'?'hs':l};

/* ---------- 4ステップの 道: 授業 → とっくん → 会話 → ノート ---------- */
const STEPS=[['l','授業','📖'],['t','とっくん','🎯'],['k','会話','🗣️'],['n','ノート','📝']];
function pathOf(id){const r=SD.p[id]||{},L=lesFor(id);let dp=false;try{dp=!!(window.DEEP&&DEEP.rec()[id])}catch(e){}
  /* 🎯: この 道から やった とっくん・ほかの 入口から やった とっくん（SENSEI の tk）・とことん授業の 5問 たしかめ（ドリルの ない 文法の とっくん） */
  let tk=false;try{tk=!!((SENSEI.rec().tk||{})[id]||((DEEP.rec()[id]||{}).cn))}catch(e){}
  return {l:!!(r.l||L.some(l=>lesDone(l.id))||(!L.length&&dp)),t:!!(r.t||tk),k:!!(r.k||scenesFor(id).some(s=>snDone(s.id))),n:!!(r.n||noteOk(id))}}
const pathN=id=>{const p=pathOf(id);return STEPS.filter(s=>p[s[0]]).length};
const nextStep=id=>{const p=pathOf(id),s=STEPS.find(s=>!p[s[0]]);return s?s[0]:null};
/* いま 習っている 文法: とちゅうの もの → まだの もの（レベルの じゅん） */
function curG(lv){const N=notes().filter(g=>g.lv===(lv||lvNow()));if(!N.length)return null;
  const mid=N.find(g=>{const n=pathN(g.n.id);return n>0&&n<4});return (mid||N.find(g=>pathN(g.n.id)<4)||N[N.length-1]).n.id}
/* what to open for one step of one grammar */
function stepItem(id,s){const it=stepItem0(id,s);if(it)it.st=s;return it}
function stepItem0(id,s){const t=gName(id);
  if(s==='l'){const L=lesFor(id),l=L.find(x=>!lesDone(x.id))||L[0];return l?{k:'les',id:l.id,g:id,t:l.t}:{k:'deep',id,g:id,t:`「${t}」の なんで？`}}
  if(s==='t')return typeof SENSEI_DRILL!=='undefined'&&!SENSEI_DRILL[id]&&window.DEEP?{k:'deep',id,g:id,chk:1,t:`「${t}」の とっくん`}:{k:'tok',id,g:id,t:`「${t}」の とっくん`};
  if(s==='k'){const g=gOf(id),S=scenesFor(id),lvS=scenes().filter(x=>x.lv===(g?g.lv:'es')),sc=S.find(x=>!snDone(x.id))||S[0]||lvS.find(x=>!snDone(x.id))||lvS[0];
    return sc?{k:'talk',id:sc.id,g:id,t:sc.t}:{k:'tok',id,g:id,t:`「${t}」の とっくん`}}
  return {k:'note',id,g:id,t:`「${t}」の ノート`}}

/* ---------- きょうの 予定 ---------- */
const ICO={miss:'❗',tok:'🎯',les:'📖',rev:'📚',talk:'🗣️',note:'📝',deep:'🔎'};
const MIN={miss:2,tok:3,les:4,rev:3,talk:5,note:2,deep:5};
const MINS=[5,10,15,30];
const day=()=>{if(!SD.day||SD.day.d!==dk())SD.day={d:dk(),min:0,plan:[],i:0,steps:0,brk:0};return SD.day};
const whenOf=t=>{const a=new Date(t),b=new Date();a.setHours(0,0,0,0);b.setHours(0,0,0,0);const n=Math.round((b-a)/864e5);return n<=0?'さっき':n===1?'きのう':'この前'};
function build(min){const out=[],used=new Set();let left=min;
  const add=it=>{if(!it||left<=1&&out.length)return;const k=it.k+':'+it.id;if(used.has(k))return;used.add(k);out.push(it);left-=MIN[it.k]||3};
  /* 1. まちがえた ところから（なければ 苦手な 文法の とっくん） */
  let lm=null;try{lm=window.REVIEW&&REVIEW.lastMiss&&REVIEW.lastMiss()}catch(e){}
  if(lm&&LES(lm.id))add({k:'miss',id:lm.id,t:LES(lm.id).t,when:whenOf(lm.t)});
  else{let w=null;try{w=window.SENSEI&&SENSEI.weak().find(id=>gOf(id))}catch(e){}if(w)add({k:'tok',id:w,g:w,t:`「${gName(w)}」の とっくん`,weak:1})}
  /* 2. 文法の 道の つぎ。 3. ふくしゅうの 日が きた 授業。 4. また 道の つぎ… */
  const lv=lvNow(),N=notes().filter(g=>g.lv===lv),c=curG(lv),ci=Math.max(0,N.findIndex(g=>g.n.id===c)),todo=[];
  N.slice(ci).concat(N.slice(0,ci)).forEach(g=>{const p=pathOf(g.n.id);STEPS.forEach(s=>{if(!p[s[0]])todo.push([g.n.id,s[0]])})});
  if(todo.length)add(stepItem(...todo.shift()));
  let due=0;try{due=window.REVIEW&&REVIEW.dueIds().length}catch(e){}
  if(due)add({k:'rev',id:'today',t:'ふくしゅうの 日が きた 授業'});
  while(left>1&&todo.length&&out.length<6)add(stepItem(...todo.shift()));
  if(!out.length){const l=window.LESSON&&LESSON.today();if(l)out.push({k:'les',id:l.id,t:l.t})}
  return out}
function setMin(m){const D=day();D.min=m;D.plan=build(m);D.i=0;SD.min=m;keep()}
const curItem=()=>{const D=day();return D.plan[D.i]||null};
const planDone=()=>{const D=day();return D.min&&D.i>=D.plan.length};

/* ---------- 開く ---------- */
let pend=null,justDone=false,cdT=null,snoozeUntil=0;
function start(it,fromPlan){if(!it)return;stopCd();const D=day();
  /* 3つ すすむごとに ひと休み（1分の 雑談） */
  if(D.steps-D.brk>=3){D.brk=D.steps;keep();rest(()=>start(it,fromPlan),it);return}
  pend={k:it.k,id:it.id,g:it.g||null,st:it.st||null,plan:!!fromPlan};
  try{switch(it.k){
    case 'miss':SFX.lesson();REVIEW.drill('miss',MINA.open,5);break;
    case 'rev':SFX.lesson();REVIEW.drill('today',MINA.open);break;
    case 'les':SFX.lesson();LESSON.open(it.id,MINA.open);break;
    case 'tok':SFX.step();window.GGO?GGO.prac(it.id):SENSEI.tokkun([it.id],0,'mina');break;
    case 'talk':SFX.talk();SENSEI.play(it.id,'mina');break;
    case 'note':{const g=gOf(it.id);if(!g)break;SFX.lesson();if(window.GGO&&GGO.at(it.id)){GGO.lesson(it.id);break}H.gramFrom(g.lv,MINA.open);H.gramNote(g.lv,g.i);break}
    case 'deep':SFX.step();window.GGO&&GGO.at(it.id)?GGO.lesson(it.id):DEEP.open(it.id,it.chk?{chk:1}:undefined);break}}catch(e){console.error(e)}}
function startStep(id,s){start(stepItem(id,s),false)}

/* ---------- おわったら: 道の しるし・予定を すすめる・「つぎへ」ボタン ---------- */
const DONE_K={lesson:'les',review:['miss','rev'],tokkun:'tok',sensei:'talk',deep:'deep',gram:'note'};
function onDone(e){const want=DONE_K[e.k];if(!want)return;const ks=[].concat(want),D=day();
  D.steps++;
  const before=new Set(notes().filter(g=>pathN(g.n.id)===4).map(g=>g.n.id));
  /* 道の しるし（ほかの 入口から やっても つく） */
  const P=pend&&ks.includes(pend.k)&&(pend.k==='rev'||pend.k==='miss'||pend.k==='tok'||String(e.name)===String(pend.id))?pend:null;
  if(P&&P.g){const r=SD.p[P.g]=SD.p[P.g]||{};if(P.st&&P.st!=='n')r[P.st]=1;else if(!P.st){if(P.k==='tok')r.t=1;if(P.k==='talk')r.k=1;if(P.k==='deep'||P.k==='les')r.l=1}}
  if(e.k==='gram'&&e.ok){const r=SD.p[e.name]=SD.p[e.name]||{};r.n=1}
  if(e.k==='sensei'){scenes().filter(s=>s.id===e.name).forEach(s=>(s.g||[]).forEach(g=>{if(pend&&pend.g===g){const r=SD.p[g]=SD.p[g]||{};r.k=1}}))}
  /* 予定の 1本が おわった */
  const it=curItem();
  if(it&&P&&P.plan&&it.k===P.k&&String(it.id)===String(P.id)){D.i++;justDone=true}
  pend=null;
  /* 4つ そろった 文法 → できるように なった ことを ことばで */
  const nowDone=notes().filter(g=>pathN(g.n.id)===4&&!before.has(g.n.id)).map(g=>g.n.id);
  const g=nowDone[0]||(e.k==='gram'&&e.ok?e.name:null);
  if(g&&typeof STUDY_CAN!=='undefined'&&STUDY_CAN[g]&&!SD.can.includes(g)){SD.can.push(g);SD.say={g,full:pathN(g)===4}}
  keep();
  if(justDone)setTimeout(nextBtn,1900)}
function nextBtn(){if(H.screen==='mina')return;const host=$('dpov')||H.panel.querySelector('section');if(!host||host.querySelector('.stnext'))return;
  const it=curItem(),b=document.createElement('div');b.className='stnext';
  b.innerHTML=`<button>${it?`👩‍🏫 つぎへ：${ICO[it.k]||''} ${esc(it.t)} ▶`:'👩‍🏫 ミナ先生に ほうこく ▶'}</button>`;
  b.querySelector('button').onclick=()=>{SFX.step();try{window.DEEP&&$('dpov')&&DEEP.close()}catch(e){}MINA.open()};
  const top=host.querySelector(':scope>.lsay.big,:scope>.box+.ct');if(top)top.after(b);else host.appendChild(b);setTimeout(()=>{try{b.scrollIntoView({block:'nearest',behavior:'smooth'})}catch(e){}},50)}
if(window.RECENT)RECENT.on('*',e=>{try{onDone(e)}catch(er){console.error(er)}});

/* ---------- 3つ すすむごとの ひと休み ---------- */
function rest(then,it){const U=typeof UNK_MINA!=='undefined'&&Math.random()<.4?pickL(UNK_MINA):null,B=pickL(STUDY_BREAK);
  const top=U?`ちょっと ひと休み☕ きょうの うんちく 「${U[0]}」`:B[0],en=U?U[1]:B[1],ja=U?U[2]:B[2];
  H.show('lesson',`<section class="pnl lsn stbrk">
    <div class="qtop"><button class="x" id="sbx" aria-label="ミナ先生に もどる">←</button><b>☕ ひと休み</b><span class="qn">1分</span></div>
    <div class="lsay by-m big"><span class="lface">${MINA.face('m','happy')}</span><div class="lbody"><p>${esc(top)}</p></div></div>
    <div class="stbrkcard"><p class="sten">${esc(en)} <button class="ksay" id="sbs" aria-label="きく">🔊</button></p><small>${esc(ja)}</small></div>
    <div class="row"><button id="sbgo">つづける：${ICO[it.k]||''} ${esc(it.t)} ▶</button></div>
  </section>`);
  SFX.pop();$('sbx').onclick=()=>{SFX.pop();MINA.open()};
  $('sbs').onclick=()=>{try{SENSEI.talk(en)}catch(e){}};
  $('sbgo').onclick=()=>{SFX.step();then()}}

/* ---------- ミナ先生の ページの 「きょうの 1本」 ---------- */
const tname=it=>it.g&&['tok','note','deep'].includes(it.k)?gName(it.g):it.t;
function lineFor(it){const v={t:it.t.replace(/^「|」.*$/g,''),when:it.when||''};
  const k=it.k==='miss'?'st_miss':it.k==='tok'?'st_tok':it.k==='les'?'st_les':it.k==='rev'?'st_rev':it.k==='talk'?'st_talk':it.k==='note'?'st_note':'st_deep';
  if(it.k==='tok'||it.k==='note'||it.k==='deep')v.t=gName(it.g||it.id);return ML(k,v)}
function canWord(g){return typeof STUDY_CAN!=='undefined'?STUDY_CAN[g]:''}
/* 最近 できるように なった ことを 1つ（数字の かわり） */
function recentCan(){const L=SD.can.slice().reverse().filter(canWord);if(L.length)return canWord(L[0]);
  const c=notes().filter(g=>noteOk(g.n.id)).pop();return c?canWord(c.n.id):''}
const canSay=c=>ML('st_can',{c})[1];
function page(from){const D=day(),auto=(from==='home'||justDone)&&Date.now()>snoozeUntil;justDone=false;
  let say='',ex='smile',main='',btn='',cnt=false;
  if(SD.say){const g=SD.say.g,c=canWord(g);[ex,say]=SD.say.full?ML('st_pathDone',{t:gName(g),c}):['proud',canSay(c)];SD.say=null;keep()}
  if(!D.min&&!SD.min){const [e2,t2]=ML('st_ask');ex=say?ex:e2;say=say||t2}
  else{if(!D.min)setMin(SD.min);
    const it=curItem();
    if(!it){const c=recentCan(),[e2,t2]=c?ML('st_done',{m:D.min,can:canSay(c)}):ML('st_doneNo',{m:D.min});if(!say){ex=e2;say=t2}
      main=`<button class="stgo done" id="stgo"><span class="stico">🌟</span><span class="sttx"><small>きょうの ${D.min}分</small><b>ぜんぶ おわり！</b></span><span class="stplay sub">もう5分 ▶</span></button>`}
    else{const [e2,t2]=from==='home'||!pend&&!D.i?lineFor(it):D.i?ML('st_next',{t:tname(it)}):ML('st_resume');if(!say){ex=e2;say=t2}
      cnt=auto;
      main=`<button class="stgo" id="stgo"><span class="stico">${ICO[it.k]||'📖'}</span><span class="sttx"><small>${D.i?'つぎの 1本':'きょうの 1本'}</small><b>${esc(it.t)}</b></span><span class="stplay"><i id="stcd">${cnt?3:'▶'}</i></span></button>`;
      btn=cnt?`<button id="stlater" class="sub stlater">あとで</button>`:''}}
  const plan=D.min&&D.plan.length>1?`<div class="stplan">${D.plan.map((x,i)=>`<i class="${i<D.i?'ok':i===D.i?'now':''}">${i<D.i?'✓':ICO[x.k]}</i>`).join('<b>›</b>')}</div>`:'';
  return {cnt,html:`<div class="stcard${cnt?' cd':''}" id="stcard">
    <div class="stsay"><span class="lface">${MINA.face('m',ex)}</span><p>${say}</p></div>
    ${main}
    ${plan||btn?`<div class="stsub">${plan}${btn}</div>`:''}
    <div class="stmin${D.min||SD.min?'':' big'}">${D.min||SD.min?'<span>⏱</span>':''}${MINS.map(m=>`<button data-min="${m}" class="${D.min===m?'on':''}">${m}分</button>`).join('')}</div>
  </div>`}}
function stopCd(){if(cdT){clearInterval(cdT);cdT=null}const c=$('stcard');if(c){c.classList.remove('cd');const i=$('stcd');if(i)i.textContent='▶';const l=$('stlater');if(l)l.remove()}}
function bind(info){const c=$('stcard');if(!c)return;const D=day();
  const go=$('stgo');if(go)go.onclick=()=>{stopCd();if(planDone()){D.plan=D.plan.concat(build(5));keep();MINA.open();return}const it=curItem();if(it)start(it,true)};
  c.querySelectorAll('[data-min]').forEach(b=>b.onclick=()=>{SFX.pop();stopCd();setMin(+b.dataset.min);justDone=false;const r=page('home');c.outerHTML=r.html;bind(r)});
  const lt=$('stlater');if(lt)lt.onclick=e=>{e.stopPropagation();SFX.pop();stopCd();snoozeUntil=Date.now()+30*60000;const [,t]=ML('st_later');const p=c.querySelector('.stsay p');if(p)p.textContent=t};
  if(!info.cnt)return;
  /* 3びょうで 自動スタート。 ほかの ところを さわったら とまる */
  let n=3;cdT=setInterval(()=>{const i=$('stcd');if(!i||H.screen!=='mina'){stopCd();return}n--;if(n>0){i.textContent=n;return}
    stopCd();const it=curItem();if(it)start(it,true)},1000);
  const stop=e=>{if(e.target.closest('#stgo,[data-min],#stlater'))return;stopCd();H.panel.removeEventListener('pointerdown',stop,true)};
  H.panel.addEventListener('pointerdown',stop,true)}

/* ---------- 習う: 文法ごとの 4ステップの 道 ---------- */
let pathLv=null,focus=null;
const LVN={es:'小学生',jh:'中学生',hs:'高校生'};
function dots(id,big){const p=pathOf(id),nx=nextStep(id);
  return `<span class="stdots${big?' big':''}">${STEPS.map(([k,n,ic],i)=>`${i&&big?'<b class="star">›</b>':''}<i class="${p[k]?'ok':k===nx?'now':''}" ${big?`data-st="${k}"`:''}>${p[k]?'✓':ic}${big?`<small>${n}</small>`:''}</i>`).join('')}</span>`}
function path(lv){pathLv=lv||pathLv||lvNow();const N=notes().filter(g=>g.lv===pathLv);
  if(!focus||!N.some(g=>g.n.id===focus))focus=curG(pathLv);const f=focus,nx=nextStep(f),n=pathN(f);
  const [ex,tx]=n===4?ML('st_pathDone',{t:gName(f),c:canWord(f)}):n?ML('st_path',{t:gName(f),s:(STEPS.find(s=>s[0]===nx)||[])[1]||'',n:4-n}):ML('st_learn',{t:gName(f)});
  let cmp='';const C=typeof STUDY_CMP!=='undefined'&&STUDY_CMP[f];if(C&&!n&&gOf(C[0]))cmp=`<p class="stcmp">🔗 ${esc(ML('st_cmp',{p:gName(C[0])})[1])}</p>`;
  H.show('lessons',`<section class="pnl lsnp stpath">
    <div class="qtop"><button class="x" id="spx" aria-label="ミナ先生に もどる">←</button><b>📖 習う</b><span></span></div>
    <div class="seg">${GLV.map(k=>`<button data-l="${k}" class="${k===pathLv?'on':''}">${LVN[k]}</button>`).join('')}</div>
    <div class="stfocus">
      <div class="kmina"><span class="lface">${MINA.face('m',ex)}</span><p>${tx}</p></div>
      <b class="stft">${esc(gOf(f).n.t)}</b>${cmp}
      ${dots(f,true)}
      ${nx?`<button id="spgo" class="stgo2">${(STEPS.find(s=>s[0]===nx)||[])[2]} つぎは ${(STEPS.find(s=>s[0]===nx)||[])[1]} ▶</button>`:`<p class="stcan1">🌱 もう ${esc(canWord(f)||'')}</p>`}
    </div>
    <div class="lslist stglist">${N.map(g=>`<button class="lsrow stgrow ${g.n.id===f?'on':''} ${pathN(g.n.id)===4?'clear':''}" data-g="${g.n.id}"><span class="lt"><b>${esc(g.n.t)}</b></span>${dots(g.n.id)}</button>`).join('')}</div>
    <button id="spall" class="sub stall">🖼️ 文法 いがいの 授業（図解・覚え方・発音）</button>
  </section>`);
  $('spx').onclick=()=>{SFX.pop();MINA.open()};
  H.panel.querySelectorAll('[data-l]').forEach(b=>b.onclick=()=>{SFX.pop();pathLv=b.dataset.l;focus=null;path()});
  H.panel.querySelectorAll('[data-g]').forEach(b=>b.onclick=()=>{SFX.pop();focus=b.dataset.g;path();H.panel.querySelector('.lsnp').scrollTo({top:0,behavior:'smooth'})});
  H.panel.querySelectorAll('[data-st]').forEach(b=>b.onclick=()=>startStep(f,b.dataset.st));
  const g=$('spgo');if(g)g.onclick=()=>startStep(f,nx);
  $('spall').onclick=()=>{SFX.lesson();LESSON.list()}}

/* ---------- できるように なった こと（きろくの 画面で） ---------- */
function canList(){const out=[];notes().forEach(g=>{const id=g.n.id,c=canWord(id);if(!c)return;const n=pathN(id),ok=noteOk(id)||n===4||lesFor(id).some(l=>lesDone(l.id));if(ok)out.push({id,c,full:n===4})});return out}

/* ================================================================ 授業の 中の 道具 */
/* なれ具合 0〜3: なれた 文法ほど 英語が ふえる */
function stage(l){let f=0;if(!l)return 0;if(lesDone(l.id))f++;try{f+=window.REVIEW?REVIEW.stars(l.id):0}catch(e){}const g=gidOf(l);if(g&&noteOk(g))f++;if(g&&pathN(g)===4)f++;return f>=6?3:f>=3?2:f>=1?1:0}
function en(key,stg){const L=typeof STUDY_EN!=='undefined'&&STUDY_EN[key];if(!L)return '';const [e,j]=pickL(L);
  if(stg<=0)return esc(j);if(stg===1)return `${esc(j)} <small class="sten">${esc(e)}</small>`;
  if(stg===2)return `<span class="sten">${esc(e)}</span> <small class="stja">${esc(j)}</small>`;
  return `<span class="sten">${esc(e)}</span> <small class="stja">（${esc(j)}）</small>`}

/* まちがえた 理由を 当てる: {x: 「〜と 思ったからかな？」の 〜, fix: そこだけの 説明} */
const BE=['am','is','are','was','were','be','been',"isn't","aren't","wasn't","weren't","i'm"];
const DO=['do','does','did',"don't","doesn't","didn't"];
const PRON=[['I','my','me','mine'],['he','his','him','his'],['she','her','her','hers'],['we','our','us','ours'],['they','their','them','theirs'],['you','your','you','yours'],['it','its','it','']];
const ROLE=['「〜は」（主語）','「〜の」','「〜を・〜に」','「〜の もの」'];
const strip=s=>String(s||'').replace(/<[^>]+>/g,'');
function why(qText,ch,ans,o){o=o||{};ch=String(ch||'').trim();ans=String(ans||'').trim();const c=ch.toLowerCase(),a=ans.toLowerCase(),q=strip(qText);
  if(o.order)return {x:'日本語の じゅんばんの まま ならべれば いい',fix:'英語は 「だれが → どうする → なにを → どこで → いつ」の じゅん。 動詞を 2番目に 置くのが コツだよ'};
  if(!c||c===a)return null;
  const asc=/[a-z]/i.test(ch)&&/[a-z]/i.test(ans);
  if(asc){
    if(c==='a'&&a==='an')return {x:'ふつうに a で いい',fix:'つぎの ことばが ア・イ・ウ・エ・オの 音で はじまる ときは an に なるよ（an apple、 an hour）'};
    if(c==='an'&&a==='a')return {x:'アイウエオの 文字だから an',fix:'an に なるのは 「音」が アイウエオで はじまる とき。 ここは ちがう 音で はじまるから a だよ'};
    if((c==='the'||c==='a'||c==='an')&&(a==='the'||a==='a'||a==='an'))return {x:a==='the'?'はじめて 出てくる もの':'もう わかっている もの',fix:a==='the'?'もう 話に 出た もの・1つしか ない ものは the だよ':'はじめて 話に 出す 1つの ものは a / an だよ'};
    if(BE.includes(c)&&BE.includes(a)){const fx=/^(am|i'm)$/.test(a)?'主語が I の ときは am':/^(is|isn't)$/.test(a)?'主語が 1人・1つ（he / she / it / this）の ときは is':/^(are|aren't)$/.test(a)?'主語が you や 2つ いじょうの ときは are':/^(was|wasn't)$/.test(a)?'すぎた ことで、 主語が I や 1人・1つ なら was':/^(were|weren't)$/.test(a)?'すぎた ことで、 主語が you や 2つ いじょう なら were':'ここは '+ans;
      return {x:`主語に ${ch} が あう`,fix:fx+' だよ'}}
    if(DO.includes(c)&&DO.includes(a)){const fx=/^(does|doesn't)$/.test(a)?'he / she / it や 1人の 文は does':/^(did|didn't)$/.test(a)?'すぎた ことは だれでも did':'I / you / 2人いじょうの 文は do';return {x:`${ch} で いい`,fix:fx+' を つかうよ'}}
    if(DO.includes(c)&&BE.includes(a))return {x:'うごきの 文だ',fix:'ここは 「〜です・〜に いる」の 文。 be動詞（am / is / are）を つかうよ'};
    if(BE.includes(c)&&DO.includes(a))return {x:'「〜です」の 文だ',fix:'ここは うごきの ことば（一般動詞）の 文。 だから do / does / did を つかうよ'};
    const base=/\b(does|doesn't|did|didn't|can|will|must|should|may|to)\s*_{2,}/i.test(q);
    const beB=/\b(am|is|are|was|were|be|been|being)\s*_{2,}/i.test(q),haveB=/\b(have|has|had)\s+(\w+\s+){0,2}_{2,}/i.test(q),num=/\b(two|three|four|five|six|many|some|these|those|several|\d+)\s*_{2,}/i.test(q);
    const isPast=w=>typeof STUDY_IRR!=='undefined'&&!!STUDY_IRR[w]||/(ed|en|built|done|gone|made|sold|heard|held|kept|left|lost|paid|sent|spent|taught|told|thought|bought|brought|caught|found|met|read|put|cut|set|hit|run|come|become|sung|swum|drunk)$/.test(w);
    const tw0=(q.match(/\b(yesterday|last \w+|ago|in \d{4})\b/i)||[])[0];
    if(num&&(a===c+'s'||a===c+'es'||a.endsWith('ies')||/^an? /.test(c)))return {x:'1つの 形で いい',fix:'数が 2つ いじょう だから、 名詞を 複数形（-s / -es）に するよ'};
    if(haveB&&!/ing$/.test(a)&&a!==c&&!BE.includes(a))return {x:`${ch} の 形で いい`,fix:`have / has / had の あとは 過去分詞（${ans}）だよ`};
    if(beB&&c.endsWith('ing')&&!a.endsWith('ing')&&isPast(a)||beB&&/en$/.test(a)&&!a.endsWith('ing')&&c.endsWith('ing'))return {x:'「〜している」の 文',fix:`ここは 「〜される」の 文。 be動詞 ＋ 過去分詞（${ans}）だよ`};
    if(tw0&&isPast(a)&&!isPast(c))return {x:'いまの こと',fix:`「${tw0}」が あるから すぎた こと。 ${ans} を つかうよ`};
    if(a===c+'s'||a===c+'es'||(c.endsWith('y')&&a===c.slice(0,-1)+'ies')||(c==='have'&&a==='has'))return {x:'s は いらない',fix:'主語が 1人・1つ（he / she / it）で いまの ことだから、 動詞に s が つくよ'};
    if(c===a+'s'||c===a+'es'||(a.endsWith('y')&&c===a.slice(0,-1)+'ies')||(a==='have'&&c==='has'))return {x:'主語が 1人だから s が いる',fix:base?'does / did / can / will / to の あとは 動詞の もとの 形に もどるよ':'主語が I / you / 2人いじょう の ときは s を つけないよ'};
    const tw=(q.match(/\b(yesterday|last \w+|ago|then|in \d{4}|this morning)\b/i)||[])[0];
    const pastOf=(b,p)=>typeof STUDY_IRR!=='undefined'&&STUDY_IRR[p]===b||p===b+'ed'||p===b+'d'||(b.endsWith('y')&&p===b.slice(0,-1)+'ied')||p===b+b.slice(-1)+'ed';
    if(pastOf(c,a))return {x:'いまの こと',fix:`${tw?`「${tw}」が あるから `:''}すぎた ことだよ。 ${ans}（${ch} の 過去形）を つかうよ`};
    if(pastOf(a,c))return {x:'すぎた こと',fix:base?'did / can / will / to の あとは 動詞の もとの 形。 だから '+ans:'ここは いまや これからの こと。 もとの 形の '+ans+' だよ'};
    if(a.endsWith('ing')&&!c.endsWith('ing'))return {x:`${ch} の 形で いい`,fix:beB?'be動詞の あとで 「〜している」なら 〜ing の 形だよ':/\b(enjoy|finish|mind|stop|about|of|in|at|for|without|before|after|like|love)\s*_{2,}/i.test(q)?'enjoy / finish / mind や 前置詞の あとは 〜ing の 形だよ':'ここは 〜ing の 形が 入るよ（「〜している」「〜すること」の 意味）'};
    if(a.startsWith('to ')&&!c.startsWith('to '))return {x:`${ch} で いい`,fix:'want / hope / decide の あとや 「〜するために」は to ＋動詞の もとの 形だよ'};
    if(c.endsWith('ing')&&!a.endsWith('ing'))return {x:'〜ing の 形が いい',fix:base?'can / will / to などの あとは 動詞の もとの 形だよ':'ここは 〜ing では なく '+ans+' の 形だよ'};
    if(typeof STUDY_PREP!=='undefined'&&STUDY_PREP[c]&&STUDY_PREP[a])return {x:`「${STUDY_PREP[c]}」の ${ch} が あう`,fix:`ここは 「${STUDY_PREP[a]}」の ${ans} が ぴったり`};
    const sup=w=>/est$|^most /.test(w),cmp=w=>/er$|^more /.test(w)&&!/^(never|ever|over|after|under)$/.test(w);
    if(cmp(a)&&sup(c))return {x:'「いちばん」の 文',fix:'than が あるから 2つを くらべる 文。 〜er / more 〜 を つかうよ'};
    if(sup(a)&&cmp(c))return {x:'2つを くらべる 文',fix:'of 〜 / in 〜 が あって 「いちばん」の 文。 the 〜est / the most 〜 だよ'};
    for(const P of PRON){const i=P.findIndex(x=>x.toLowerCase()===c),j=P.findIndex(x=>x.toLowerCase()===a);if(i>=0&&j>=0)return {x:`${ROLE[i]}の ${ch} で いい`,fix:`ここは ${ROLE[j]}の 形だから ${ans}`}}
    if(/^(will|be going to|can|must|should|may|have to|might|could|would)\b/.test(a)&&/^(will|be going to|can|must|should|may|have to|might|could|would)\b/.test(c))return {x:`${ch} の 意味が あう`,fix:`ここは ${ans} の 気もち。 文の 意味から えらぼう`};
    return {x:`${ch} で いい`,fix:''}}
  return {x:`「${ch}」が 正しい`,fix:''}}
/* the lesson step that talks about the answer（理由が わからない ときに そこだけ 見せる） */
function stepFor(l,ans,qText){if(!l)return null;const A=String(ans||'').toLowerCase(),W=strip(qText).toLowerCase().split(/[^a-zぁ-んァ-ン一-龥]+/).filter(w=>w.length>1);
  const S=l.steps.filter(s=>s[0]==='m'||s[0]==='h');
  return S.find(s=>A&&strip(s[2]).toLowerCase().includes(A))||S.find(s=>W.some(w=>strip(s[2]).toLowerCase().includes(w))&&s[3])||l.steps.find(s=>s[3])||null}
/* 「それは 〜と 思ったからかな？」の 箱 */
function whyBox(qText,ch,ans,o){const w=why(qText,ch,ans,o);if(!w)return '';const [ex,tx]=ML('st_why',{x:w.x});
  let fix=w.fix;if(!fix&&o&&o.l){const s=stepFor(o.l,ans,qText);if(s)fix=`ここを もう一度：${s[2]}${s[3]?`<div class="fz">${s[3]}</div>`:''}`}
  return `<div class="stwhy"><span class="lface">${MINA.face('m',ex)}</span><div><p>${tx}</p>${fix?`<p class="stfix">💡 ${fix}</p>`:''}</div></div>`}

/* 「？」: おすたびに もっと やさしく（0: ひとことで / 1: たとえば / 2: ここだけ / 3: いまは だいじょうぶ） */
function easy(l,step,h){const g=gidOf(l),D=typeof DEEP_DATA!=='undefined'&&g?DEEP_DATA[g]:null,txt=strip(step&&step[2]);
  const lines=MINA_LINES.st_q||[],L=lines[Math.min(h,lines.length-1)]||['smile',''];let body='';
  if(h===0){const parts=txt.split(/(?<=[。！？])/).filter(Boolean),short=txt.length>45&&parts.length>1?parts[0]:'';
    body=`<b>ひとことで いうと</b>${esc(short||(D&&strip(D.one))||(l.tip?strip(l.tip):'')||txt)}`}
  else if(h===1){const re=/[A-Za-z][A-Za-z' ,.!?-]{1,}[A-Za-z.!?]/g,m=(txt.match(re)||[]).concat(...l.steps.map(x=>strip(x[2]).match(re)||[])),gn=g&&gOf(g),e=m.find(x=>/\s/.test(x.trim()))||m.find(x=>x.length>=3),ex=e?[e.trim(),'']:gn?gn.n.ex[0]:null;
    body=ex?`<b>たとえば</b><span class="sten">${esc(ex[0])}</span>${ex[1]?`<small>${esc(ex[1])}</small>`:''}`:`<b>たとえば</b>${esc(l.t)}`}
  else if(h===2)body=`<b>ここだけ おぼえよう</b>${esc(l.t)}${(l.key||[]).length?`<small>キーワード：${esc(l.key.join('・'))}</small>`:''}${D&&D.tip?`<small>💡 ${strip(D.tip)}</small>`:''}`;
  else body=`<b>だいじょうぶ</b>つぎへ 進んで、 れんしゅうで たしかめよう`;
  return `<div class="steasy"><span class="lface">${MINA.face('m',L[0])}</span><div><p>${esc(L[1])}</p><p class="steb">${body}</p></div></div>`}

/* 新しい 文法の さいしょに: 前に 習った 文法と くらべる カード（なければ null） */
function cmpCard(l){if(!l||lesDone(l.id))return null;const g=gidOf(l),C=typeof STUDY_CMP!=='undefined'&&g&&STUDY_CMP[g];if(!C)return null;
  const p=C[0],known=noteOk(p)||pathN(p)>0||lesFor(p).some(x=>lesDone(x.id));if(!known)return null;
  return {p,g,html:`<p>${esc(ML('st_cmp',{p:gName(p)})[1])}</p><p class="stcmpt">${esc(C[1])}</p>
    <div class="stcmpx"><span><small>まえに 習った</small><b>${esc(C[2])}</b></span><i>➜</i><span class="now"><small>きょう</small><b>${esc(C[3])}</b></span></div>`}}

/* 授業の おわり: 数字の かわりに できるように なった こと */
function lessonCan(l){const g=gidOf(l);if(!g)return '';const c=canWord(g);return c?canSay(c):''}

/* ホームの ミナ先生も さそう（game/mina-sense.js の ルール） */
if(window.MINA_SENSE&&MINA_SENSE._rules)MINA_SENSE._rules.push(
 ['x_stAsk',2,()=>day().min||SD.min?null:{},()=>['👩‍🏫 ミナ先生の ページへ',()=>MINA.open()]],
 ['x_stNext',3,()=>{if(!day().min)return null;const it=curItem();return it?{t:tname(it)}:null},()=>['▶ はじめる',()=>MINA.open()]],
 ['x_stCan',1,()=>{const c=recentCan();return c?{c}:null},()=>['📊 きろくを 見る',()=>MINA.recOpen()]]);
window.STUDY={page,bind,path,start,startStep,build,setMin,day,pathOf,pathN,curG,canList,canWord,stage,en,why,whyBox,easy,cmpCard,gidOf,lessonCan,gName,rest,rec:()=>SD,
  _test:{done:onDone,steps:n=>{day().steps=n;keep()}}};
})();
