/* 💗 ミナ先生との 時間（ラブストーリーの 土台）。中身は game/love-data.js
   - 1日 1回、 ミナ先生と 英語の 短い 会話（3つの やりとり）。 まちがえたら 1回めは ヒント、 2回めは 解説（苦手とっくんと おなじ 形）
   - ハートは 少しずつ（1日 最大 5 ＋ 流れ星の 運）。 放っておいても 下がらない。 下がるのは 仲直りに 失敗した ときだけ
   - 段階: 先生と 生徒 → 気になる 人 → 友だち 以上 → 恋人（→ 婚約 → 結婚 は つぎの 物語）
     段階アップ ＝ ハートが いっぱい ＋ 英語の 条件（授業・フレーズ・単語）＋ 特別な 日の 会話に 成功（失敗したら 後日 もう一度）
   - 機嫌は 毎朝 かわる（表情と ポーズで わかる）。 合う 話題を えらぶと ハートが 多め。 🔮 機嫌うらないで ヒント
   - たまに けんか。 英語で あやまって 気持ちを 伝えて 仲直り。 うまく いくと 前より なかよく なる
   - 正しく 言えた 英語は 📔 恋の フレーズ帳に 場面べつに たまる
   ミナ先生の セリフは この ファイルの さいご（lv_* は この 画面、 x_lv* は ホーム） */
(()=>{
const {S:ST,sfx:SFX}=BEACH;
const H=HE,esc=H.esc,$=id=>document.getElementById(id);
const STG=LOVE_STAGES,MOODS=LOVE_MOODS,TOP=LOVE_TOPICS,CATS=LOVE_CATS;
const pickL=a=>a[Math.random()*a.length|0];
const sf=(k,...a)=>{try{SFX[k]&&SFX[k](...a)}catch(e){}};
const dk=d=>{d=d||new Date();return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate()};
const shuffle=a=>{for(let i=a.length-1;i>0;i--){const j=Math.random()*(i+1)|0;[a[i],a[j]]=[a[j],a[i]]}return a};
/* その日に きまる 運（開きなおしても かわらない） */
const hash=s=>{let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0};
const seeded=s=>{let a=hash(s);return ()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}};
const DAY_MAX=5;

/* ---------- the record ---------- */
const LV=(()=>{try{const s=JSON.parse(localStorage.getItem(SAVE_KEY)||'{}').love;if(s&&s.ph)return s}catch(e){}
  return {st:0,h:0,day:'',n:0,ph:{},fight:null,rd:'',ev:0,deep:0,fights:0,made:0,talks:{},hist:[]}})();
LV.talks=LV.talks||{};LV.hist=LV.hist||[];LV.ends=LV.ends||{};LV.sea=LV.sea||{};
_saveHooks.push(()=>{const s=JSON.parse(localStorage.getItem(SAVE_KEY)||'{}');s.love=LV;localStorage.setItem(SAVE_KEY,JSON.stringify(s))});

/* ---------- what is true today ---------- */
const doneToday=()=>LV.day===dk();
const mood=()=>{const r=seeded(dk()+'|mood');return MOODS[r()*MOODS.length|0]};
const moodOf=id=>MOODS.find(m=>m[0]===id);
/* the 3 topics she offers today: one she likes, most days */
function topicsToday(){const r=seeded(dk()+'|topic'),M=mood(),all=Object.keys(TOP);let pool=all.slice().sort(()=>r()-.5);
  let out=pool.slice(0,3);if(!out.some(t=>M[4].includes(t))&&r()<.7)out[r()*3|0]=M[4][r()*M[4].length|0];return [...new Set(out)].concat(pool.filter(t=>!out.includes(t))).slice(0,3)}
const fitOf=t=>{const M=mood();return M[4].includes(t)?2:M[5].includes(t)?0:1};
/* a fight now and then (from 気になる 人 on), decided once a day */
function roll(){const d=dk();if(LV.rd===d)return;LV.rd=d;
  if(!LV.fight&&LV.st>=1&&LV.st<=3&&LV.day!==d&&!ready()&&LV.n>=3&&Math.random()<.08){LV.fight={i:Math.random()*LOVE_FIGHTS.length|0,d,tries:0}}save()}
/* the English it takes to go up a stage */
const lesDone=()=>{try{return LESSON.count()[0]}catch(e){return 0}};
const words=lv=>Object.keys(ST.learned||{}).filter(k=>k.startsWith(lv+':')).length;
const phN=()=>Object.keys(LV.ph).length;
const LVN={es:'小学生',jh:'中学生',hs:'高校生',adv:'ハイレベル'};
function conds(st=LV.st){const c=STG[st]&&STG[st].cond;if(!c)return [];const out=[];
  if(c.les)out.push({t:'📖 ミニ授業',have:lesDone(),need:c.les});
  if(c.ph)out.push({t:'📔 恋の フレーズ',have:phN(),need:c.ph});
  if(c.w)out.push({t:`📕 ${LVN[c.w[0]]}の 単語を おぼえる`,have:words(c.w[0]),need:c.w[1]});
  out.forEach(o=>o.ok=o.have>=o.need);return out}
const heartFull=()=>STG[LV.st].need>0&&LV.h>=STG[LV.st].need;
const ready=()=>LV.st<3&&heartFull()&&conds().every(c=>c.ok);
/* what today's button does */
/* やきもち: ほかの 人に プレゼントを あげると、 つぎの ふたりの 時間に すねる（気になる 人 から） */
function othersGiven(){try{const g=GIFT.rec().gave;return Object.keys(g).filter(k=>k!=='mina').reduce((a,k)=>a+g[k],0)}catch(e){return 0}}
function checkJeal(){const og=othersGiven();if(LV.og==null){LV.og=og;return}if(og>LV.og){if(LV.st>=1&&!LV.fight)LV.jeal=1;LV.og=og;save()}}
/* 季節の イベント（その 時期に 1回）と、 ときどきの ランダムイベント */
function seasonDue(){const d=new Date(),m=d.getMonth()+1,dd=d.getDate(),y=d.getFullYear();
  return LOVE_SEASON.find(S=>S.when[0]===m&&dd>=S.when[1]&&dd<=S.when[2]&&LV.st>=S.min&&!LV.sea[S.id+y])||null}
function randToday(){const r=seeded(dk()+'|rand');if(r()>.22)return null;const L=LOVE_RANDOM.filter(S=>LV.st>=S.min);return L.length?L[r()*L.length|0]:null}
function todo(){checkJeal();roll();if(doneToday())return 'done';if(LV.fight)return 'fight';if(ready())return 'event';return 'day'}

/* ---------- voice ---------- */
let enVoice=null;
function pickVoice(){if(!window.speechSynthesis)return;const vs=speechSynthesis.getVoices().filter(v=>/^en[-_]/i.test(v.lang));
  enVoice=vs.find(v=>/en[-_]US/i.test(v.lang)&&/Samantha|Google|Natural/i.test(v.name))||vs.find(v=>/en[-_]US/i.test(v.lang))||vs[0]||null}
if(window.speechSynthesis){pickVoice();speechSynthesis.addEventListener&&speechSynthesis.addEventListener('voiceschanged',pickVoice)}
let talkOn=false,talkId=0,talkMax=0;
function speak(en){if(!ST.sound||!window.speechSynthesis)return;
  try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(String(en).replace(/\.\.\.\s*/g,' '));u.lang='en-US';if(enVoice)u.voice=enVoice;
    u.pitch=1.25;u.rate=(ST.slow?.72:.92)*.95;u.volume=Math.min(1,(ST.vol&&ST.vol.voice!=null)?ST.vol.voice:1);
    const id=++talkId;talkOn=true;talkMax=Date.now()+3000+String(en).length*(ST.slow?140:100);u.onend=u.onerror=()=>{if(id===talkId)talkOn=false};speechSynthesis.speak(u)}catch(e){talkOn=false}}
const hush=()=>{try{speechSynthesis.cancel()}catch(e){}};
const jaOn=()=>{try{return MINA.level()==='es'}catch(e){return true}};

/* ---------- Mina's words ---------- */
const ML=(k,v)=>MINA.line(k,v||{});
const face=(ex,tx,pose)=>MINA.face('m',ex,pose!==undefined?pose:MINA.poseFor(ex,tx));

/* ================================================================ the top: 💗 ミナ先生との 時間 */
let backTo=null;
function open(back){hush();if(back)backTo=back;const B=backTo||(()=>MINA.open());roll();
  const S=STG[LV.st],M=mood(),t=todo(),F=LV.fight&&LOVE_FIGHTS[LV.fight.i];
  /* what she says first */
  let k,v={},ex=M[2],pose=M[3];
  if(t==='fight'){k='lv_fight';v={why:F.why};ex='worry';pose='cross'}
  else if(t==='event'){k='lv_ready'+LV.st;ex='love';pose='chest'}
  else if(t==='done'){k='lv_done'+Math.min(LV.st,3)}
  else k='lv_hi'+Math.min(LV.st,3)+(Math.random()<.5?'':'_'+M[0]);
  if(!MINA_LINES[k])k='lv_hi'+Math.min(LV.st,3);
  const [e2,tx]=ML(k,v);if(t!=='day')ex=ex||e2;
  const need=S.need,hp=need?Math.min(1,LV.h/need):1,cs=conds();
  const btn=t==='fight'?`🙏 仲直りの 話を する<small>${esc(F.t)}</small>`:t==='event'?`✨ 特別な 日：${esc(LOVE_EVENTS[LV.st].t)}<small>${LV.ev?'もう一度 ちょうせん':'段階アップの チャンス'}</small>`:t==='done'?`🌙 きょうは もう 会えたよ<small>また あした</small>`:`💗 きょうの 時間を すごす<small>${LV.n?`ふたりの 時間 ${LV.n}日め`:'英語で ちょっと おしゃべり'}</small>`;
  H.show('love',`<section class="pnl lvp">
    <div class="qtop"><button class="x" id="lvx" aria-label="もどる">←</button><b>💗 ミナ先生との 時間</b><span class="qn">${S.ico}</span></div>
    <div class="mtalk"><span class="mbig lvbig">${face(ex,tx,pose)}</span><p class="mline">${tx}</p></div>
    <p class="lvmood">きょうの ミナ先生：<b>${t==='fight'?'😤 ちょっと すねてる':esc(M[1])}</b></p>
    <button id="lvgo" class="msensei lvgo ${t}" ${t==='done'?'disabled':''}>${btn}</button>
    <div class="row">${LV.st>=2&&t==='day'?'<button id="lvdate" class="sub">🌅 デートに さそう</button>':''}<button id="lvph" class="sub">📔 恋の フレーズ帳<small>${phN()}</small></button></div>
    <details class="mfold"><summary>${S.ico} ふたりの ようす<small>${esc(S.n)}</small></summary><div class="mfbody lvbody">
      <div class="lvladder">${STG.map((s,i)=>`<span class="${i<LV.st?'past':i===LV.st?'now':''}">${i<=LV.st?s.ico:'？'}<small>${i<=LV.st?esc(s.n):'？？？'}</small></span>`).join('')}</div>
      ${need?`<p class="lvhrow"><span>💗</span><span class="lvbar"><i style="width:${Math.round(hp*100)}%"></i></span><b>${Math.min(LV.h,need)}/${need}</b></p>`:''}
      ${cs.length?`<div class="lvconds"><small>つぎの 段階へ（英語の 力）</small>${cs.map(c=>`<span class="${c.ok?'ok':''}">${c.ok?'✅':'⬜'} ${c.t} <b>${Math.min(c.have,c.need)}/${c.need}</b></span>`).join('')}${heartFull()&&!cs.every(c=>c.ok)?'<p class="note">ハートは いっぱい！ あとは 英語の 力だよ</p>':''}</div>`:LV.st>=3?'<p class="note">💍 この 先の 物語は もうすぐ…</p>':''}
      <p class="note">ふたりの 時間 ${LV.n}日 ・ 仲直り ${LV.deep}回</p>
    </div></details>
    ${memN()?`<details class="mfold"><summary>📸 ふたりの 思い出<small>${memN()}/${memAll()}</small></summary><div class="mfbody lvbody">${memories()}</div></details>`:''}
    <details class="mfold"><summary>🔮 きょうの 機嫌うらない<small>${esc(M[1])}</small></summary><div class="mfbody lvbody">${fortune()}</div></details>
  </section>`);
  setTimeout(()=>{const b=H.panel.querySelector('.mbig');if(b)b.classList.add('mnew')},10);
  $('lvx').onclick=()=>{sf('back');hush();backTo=null;B()};
  $('lvph').onclick=()=>{sf('book');phrases()};
  H.panel.querySelectorAll('.mfold').forEach(f=>f.ontoggle=()=>{if(f.open)sf('pop')});
  $('lvgo').onclick=()=>{if(t==='done')return;sf('talk');t==='fight'?fight():t==='event'?event():dayStart()};
  const db=$('lvdate');if(db)db.onclick=()=>{sf('step');datePick()}}
/* きょうの 時間の はじまり: やきもち → 季節の イベント → ときどき ランダムイベント → ふつうの 会話 */
function dayStart(){if(LV.jeal)return story(LOVE_JEALOUS,'jeal');const se=seasonDue();if(se)return story(se,'season');const r=randToday();if(r)return story(r,'rand');pickTopic()}
/* 📸 思い出（デート・イベントの エンド） */
const MEM=()=>[...LOVE_DATES,...LOVE_RANDOM,...LOVE_SEASON,LOVE_JEALOUS];
const memN=()=>Object.keys(LV.ends).length;
const memAll=()=>MEM().length*3;
function memories(){return MEM().filter(S=>['good','ok','fun'].some(k=>LV.ends[S.id+':'+k])).map(S=>`<p class="lvmem"><b>${S.ico} ${esc(S.t)}</b><span class="kends">${['good','ok','fun'].map(k=>LV.ends[S.id+':'+k]?`<span class="${k==='good'?'g':''}">${esc(S.ends[k][0])}</span>`:'<span class="no">？？？</span>').join('')}</span></p>`).join('')}
/* 🌅 デートの 場所を えらぶ */
function datePick(){stage('デートに さそう','🌅');P={kind:'pick',newPh:[]};const [ex,tx]=ML('lv_datePick',{});minaJa(ex,tx);
  mina("A date? ...Where do you want to go?","デート？ …どこに 行きたい？",'love');
  $('lvans').innerHTML=`<div class="lvtopics lvdates">${LOVE_DATES.map((S,i)=>{const g=['good','ok','fun'].filter(k=>LV.ends[S.id+':'+k]).length;return `<button data-d="${i}"><span>${S.ico}</span>${esc(S.t)}<small>${g?'⭐'.repeat(g):''}</small></button>`}).join('')}</div>`;
  $('lvans').querySelectorAll('[data-d]').forEach(b=>b.onclick=()=>{sf('step');story(LOVE_DATES[+b.dataset.d],'date')})}
/* 🔮 the day's fortune: her mood, a lucky topic, a word */
function fortune(){const M=mood(),r=seeded(dk()+'|luck'),lt=M[4][r()*M[4].length|0],bt=M[5][0],L=MINA_LINES.lv_luck||[['smile','']];
  const luck=['大吉','中吉','小吉','吉'][r()*4|0],w=L[r()*L.length|0][1];
  return `<p class="lvfort"><span class="lvff">${face(M[2],'',M[3])}</span><span><b>${esc(M[1])}</b><small>${esc(M[6])}</small></span></p>
    <p class="lvluck">🍀 ラッキーな 話題：<b>${TOP[lt][0]} ${TOP[lt][1]}</b><br>💦 にがてな 話題：${TOP[bt][0]} ${TOP[bt][1]}<br>🔮 恋の 運：<b>${luck}</b></p>
    ${w?`<p class="note">${w}</p>`:''}`}

/* ================================================================ the talk (shared) */
let P=null;
const live=()=>P&&$('lvlog');
function stage(title,ico){H.show('love',`<section class="pnl lsn kw snw lvw" data-stay>
    <div class="qtop"><button class="x" id="lvx" aria-label="やめる">←</button><b>${ico} ${esc(title)}</b><span class="qn" id="lvq"></span></div>
    <div class="lslog kwlog snlog" id="lvlog"></div>
    <div id="lvans" class="kans"></div>
  </section>`);
  $('lvx').onclick=()=>{sf('back');hush();P=null;open()}}
function scrollLog(){const l=$('lvlog');if(l)l.scrollTo({top:l.scrollHeight,behavior:'smooth'})}
function mina(en,ja,ex='smile',cls='',who){if(!live())return;const d=document.createElement('div'),on=jaOn();d.className='lsay snm kth '+cls+(who?' lvwho-'+who:'');P.last=en;
  const fc=who==='h'?MINA.face('h',ex):who==='n'?'<span class="lvnora">👩‍🦳</span>':face(ex,'');
  d.innerHTML=`<span class="lface">${fc}</span><div class="lbody"><p class="ken">${esc(en)}<button class="ksay" aria-label="もう一度 きく">🔊</button></p>${ja?`<small class="kja ${on?'on':''}">${esc(ja)}</small>${on?'':'<button class="kjab">訳を 見る</button>'}`:''}</div>`;
  $('lvlog').appendChild(d);
  d.querySelector('.ksay').onclick=e=>{e.stopPropagation();speak(en)};
  const jb=d.querySelector('.kjab');if(jb)jb.onclick=()=>{sf('tap');jb.remove();d.querySelector('.kja').classList.add('on');scrollLog()};
  speak(en);scrollLog()}
function minaJa(ex,html,cls='',btns){if(!live())return;const d=document.createElement('div');d.className='lsay snm snjp '+cls;
  d.innerHTML=`<span class="lface">${face(ex,html)}</span><div class="lbody"><p>${html}</p>${btns?`<span class="snbtns">${btns.map((b,i)=>`<button class="sub" data-bi="${i}">${b[0]}</button>`).join('')}</span>`:''}</div>`;
  $('lvlog').appendChild(d);if(btns)d.querySelectorAll('[data-bi]').forEach(b=>b.onclick=()=>{sf('step');hush();btns[+b.dataset.bi][1]()});scrollLog();return d}
function you(en,cls=''){if(!live())return;const d=document.createElement('div');d.className='lsay by-h kyou-b '+cls;
  d.innerHTML=`<span class="lface kf you">⭐</span><div class="lbody"><p>${esc(en)}</p></div>`;$('lvlog').appendChild(d);scrollLog()}
function note(html){if(!live())return;const d=document.createElement('p');d.className='knote';d.innerHTML=html;$('lvlog').appendChild(d);scrollLog()}
function afterTalk(fn,gap=500,minMs=900){const t0=Date.now();
  const wait=()=>{if(!live())return;const busy=ST.sound&&window.speechSynthesis&&(talkOn||speechSynthesis.speaking||speechSynthesis.pending)&&Date.now()<talkMax;
    if(busy||Date.now()-t0<minMs){setTimeout(wait,150);return}setTimeout(fn,gap)};setTimeout(wait,150)}
/* the choices, with a 訳 button when Japanese is hidden */
function opts(list,onPick,tried){const on=jaOn();
  $('lvans').innerHTML=`<div class="lopts kopts">${list.map((o,i)=>`<button data-o="${i}" class="${tried&&tried.has(i)?'tried':''}">${esc(o.e)}${o.j?`<small class="lvj ${on?'on':''}">${esc(o.j)}</small>`:''}</button>`).join('')}</div>
    ${on||!list.some(o=>o.j)?'':'<button id="lvjb" class="sub lvjb">訳を 見る</button>'}`;
  $('lvans').querySelectorAll('[data-o]').forEach(b=>b.onclick=()=>{if(b.classList.contains('tried'))return;onPick(+b.dataset.o)});
  const jb=$('lvjb');if(jb)jb.onclick=()=>{sf('tap');jb.remove();$('lvans').querySelectorAll('.lvj').forEach(s=>s.classList.add('on'))};scrollLog()}
/* a phrase for the book */
function addPh(en,ja,cat){if(!en||LV.ph[en])return false;LV.ph[en]={j:ja,c:cat||'talk',t:Date.now()};P&&P.newPh.push(en);return true}

/* ================================================================ 1. きょうの 時間 */
function pickTopic(){const L=topicsToday();stage('ミナ先生との 時間','💗');P={kind:'pick',newPh:[]};
  const [ex,tx]=ML('lv_topic',{});minaJa(ex,tx);
  mina(pickL([["What shall we talk about today?","きょうは なんの 話を しようか？"],["What do you want to talk about?","なんの 話が したい？"],["Any topic is fine. What do you feel like?","どんな 話でも いいよ。 なにが いい？"]])[0],'',mood()[2]);
  $('lvans').innerHTML=`<div class="lvtopics">${L.map(t=>`<button data-t="${t}"><span>${TOP[t][0]}</span>${TOP[t][1]}</button>`).join('')}</div>`;
  $('lvans').querySelectorAll('[data-t]').forEach(b=>b.onclick=()=>{sf('step');day(b.dataset.t)})}
function day(topic){const st=Math.min(LV.st,3),turns=(LOVE_TALKS[st][topic]||LOVE_TALKS[st].star);
  P={kind:'day',topic,turns,i:0,tries:0,score:[],newPh:[],last:'',tried:new Set()};
  you(`${TOP[topic][0]} ${TOP[topic][1]}の 話が したいな`);
  const f=fitOf(topic);setTimeout(()=>{if(!live())return;
    const [ex,tx]=ML(f===2?'lv_fit':f===0?'lv_unfit':'lv_fitSo',{t:TOP[topic][1]});minaJa(f===2?'happy':f===0?'worry':'smile',tx,'snsmall');
    setTimeout(turn,700)},400)}
function turn(){if(!live())return;const T=P.turns[P.i];if(!T)return dayEnd();P.tries=0;P.tried=new Set();$('lvq').textContent=`💬 ${P.i+1}/${P.turns.length}`;
  if(T.m[0]!==P.last)mina(T.m[0],T.m[1],T.ex||'smile');
  afterTalk(()=>T.w?order(T):choose(T),250,600)}
function choose(T){if(!live())return;if(!P.list){const ok=T.ok.slice(0,2).map(o=>({e:o[0],j:o[1],c:o[2],ok:1})),ng=shuffle(T.ng.slice()).slice(0,2).map(o=>({e:o[0],j:o[1],h:o[2],x:o[3],ok:0}));P.list=shuffle(ok.concat(ng))}
  opts(P.list,i=>{const o=P.list[i];$('lvans').innerHTML='';if(o.ok)right(o.e,o.j,o.c);else{P.tried.add(i);wrong(o.e,o.h,o.x,()=>choose(T),()=>{const g=P.list.find(x=>x.ok);return [g.e,g.j,g.c]})}},P.tried)}
/* 単語を ならべて 言う */
function order(T){if(!live())return;const words=T.w.replace(/[.,!?]/g,'').split(/\s+/).filter(Boolean);
  if(!P.tiles)P.tiles=shuffle(words.map((w,i)=>({w,i})));if(P.tiles.every((t,k)=>t.w===words[k]))P.tiles.push(P.tiles.shift());
  const picked=[];
  const draw=()=>{$('lvans').innerHTML=`<p class="lvord">🧩 ならべて 言おう${jaOn()||P.tries?`：<b>${esc(T.wj)}</b>`:''}</p>
    <div class="lvsent">${picked.length?picked.map(k=>`<button data-u="${k}">${esc(P.tiles[k].w)}</button>`).join(''):'<small>下の ことばを タップ</small>'}</div>
    <div class="lvtiles">${P.tiles.map((t,k)=>`<button data-k="${k}" ${picked.includes(k)?'disabled':''}>${esc(t.w)}</button>`).join('')}</div>
    <div class="row"><button id="lvclr" class="sub">↩ やりなおす</button><button id="lvsay" ${picked.length===words.length?'':'disabled'}>💬 これで 言う</button></div>`;
    $('lvans').querySelectorAll('[data-k]').forEach(b=>b.onclick=()=>{sf('tap');picked.push(+b.dataset.k);draw()});
    $('lvans').querySelectorAll('[data-u]').forEach(b=>b.onclick=()=>{sf('tap');picked.splice(picked.indexOf(+b.dataset.u),1);draw()});
    $('lvclr').onclick=()=>{sf('back');picked.length=0;draw()};
    $('lvsay').onclick=()=>{if(picked.length!==words.length)return;const said=picked.map(k=>P.tiles[k].w),okk=said.join(' ')===words.join(' ');$('lvans').innerHTML='';
      if(okk)right(T.w,T.wj,T.cat);else wrong(said.join(' ')+'.',T.h,T.e,()=>order(T),()=>[T.w,T.wj,T.cat])};scrollLog()};
  draw()}
const OOPS=[["Hmm, almost!","おしい！"],["Close! One more try.","あと ちょっと！"],["Hmm? Say that again?","ん？ もう一回？"],["Oh? That sounds a little strange.","ん？ ちょっと へんかも"]];
function right(en,ja,cat){const T=P.turns[P.i];you(en);P.score.push(P.tries===0?2:1);addPh(en,ja,cat);
  sf(P.tries===0?'correct':'step');
  setTimeout(()=>{if(!live())return;mina(T.r[0],T.r[1],P.tries===0?'love':'happy','k-good');
    if(P.tries)setTimeout(()=>{const [ex,tx]=ML('lv_okHint',{});minaJa(ex,tx,'snsmall')},400);
    next()},550)}
function next(){P.i++;P.list=null;P.tiles=null;afterTalk(turn,400,900)}
/* 1回め ヒント、 2回め 解説（そのあと 正しい 英語で 話は つづく） */
function wrong(en,hint,expl,again,good){P.tries++;you(en,'snx');sf('tease');
  setTimeout(()=>{if(!live())return;
    if(P.tries===1){const r=pickL(OOPS);mina(r[0],r[1],'wow','k-oops');
      setTimeout(()=>{minaJa('think',`💡 <b>ヒント</b>　${hint}`,'snhint');setTimeout(again,350)},500);return}
    const [ge,gj,gc]=good();P.score.push(0);
    const d=minaJa('smile',`<b>💡 ここが ポイント</b><span class="snfix"><s>${esc(en)}</s><br>⭕ <b class="snen">${esc(ge)}</b></span><span class="snwhy">${expl}</span>`,'snexp',
      [['わかった！ つづける ▶',()=>{const b=d.querySelector('.snbtns');if(b)b.remove();
        you(ge,'snfixed');addPh(ge,gj,gc);setTimeout(()=>{if(!live())return;const T=P.turns[P.i];mina(T.r[0],T.r[1],'smile','k-good');next()},500)}]]);
    const [ex,tx]=ML('lv_explain',{});setTimeout(()=>{if(live())minaJa(ex,tx,'snsmall')},300)},600)}
function dayEnd(){if(!live())return;$('lvans').innerHTML='';$('lvq').textContent='🏁';
  const s=P.score.reduce((a,b)=>a+b,0),base=[0,1,1,2,2,3,3][Math.min(6,s)],fit=fitOf(P.topic),need=STG[LV.st].need;
  let gain=Math.min(DAY_MAX,base+fit);const star=Math.random()<.12;if(star)gain++;
  const before=LV.h;LV.h=need?Math.min(need,LV.h+gain):LV.h+gain;const got=LV.h-before;
  LV.day=dk();LV.n++;LV.talks[Math.min(LV.st,3)+':'+P.topic]=(LV.talks[Math.min(LV.st,3)+':'+P.topic]||0)+1;const an=anniv();save();
  const perfect=P.score.every(x=>x===2),nowReady=ready();
  let k=perfect?'lv_endPerfect':s>=3?'lv_endGood':'lv_endLow';if(fit===2&&Math.random()<.5)k='lv_endFit';if(LV.n===1)k='lv_endFirst';if(nowReady)k='lv_endReady';
  const [ex,tx]=ML(k,{n:LV.n,t:TOP[P.topic][1]});
  const bye=pickL(LV.st>=3?[["See you tomorrow. I'll miss you.","また あした。 さびしく なるな。"],["Sweet dreams. Think of me, okay?","いい ゆめを。 わたしの こと 考えてね？"]]:LV.st>=1?[["That was fun. Same time tomorrow?","楽しかった。 あしたも この 時間に？"],["Thanks for today. I enjoyed it.","きょうは ありがとう。 楽しかった。"]]:[["Good job today! See you tomorrow.","きょうも よく がんばったね！ また あした。"],["Nice talking with you. Bye!","話せて よかった。 またね！"]]);
  mina(bye[0],bye[1],perfect?'love':'happy','k-good');
  afterTalk(()=>{if(!live())return;
    if(star){note('🌠 流れ星が 流れた… <b>ハート +1</b>');try{H.meteorSoon(true)}catch(e){}}
    if(an)note(`🎉 ふたりの 時間 ${an}日め！ <b>記念日 ハート +2</b>`);
    $('lvans').innerHTML=`<div class="kres">
      <p class="kend good">💗 ハート +${got}${got<gain?' <small>いっぱい！</small>':''}</p>
      ${need?`<p class="lvhrow"><span>💗</span><span class="lvbar"><i style="width:${Math.round(Math.min(1,LV.h/need)*100)}%"></i></span><b>${LV.h}/${need}</b></p>`:''}
      <p class="snscore"><span>⭕ 1回で <b>${P.score.filter(x=>x===2).length}</b></span><span>💡 ヒントで <b>${P.score.filter(x=>x===1).length}</b></span><span>📘 解説 <b>${P.score.filter(x=>x===0).length}</b></span></p>
      <p class="note">${fit===2?'🍀 ミナ先生の 好きな 話題だった！':fit===0?'💦 きょうの 気分じゃない 話題 だったかも':'🙂 ふつうの 話題'}${P.newPh.length?`　📔 フレーズ +${P.newPh.length}`:''}</p>
      <div class="kmina"><span class="lface">${face(ex,tx)}</span><p>${tx}</p></div>
      <div class="row"><button id="lvok" data-back>もどる</button></div></div>`;
    sf(nowReady?'done':'heart');
    $('lvok').onclick=()=>{sf('back');hush();P=null;open()};scrollLog();
    setTimeout(()=>$('lvans').scrollIntoView({behavior:'smooth',block:'end'}),100)},300,800)}

/* ================================================================ 2. 特別な 日 と 仲直り（分かれ道の 会話） */
function story(S,kind){P={kind,S,at:'a',pts:0,newPh:[],last:'',rain:kind==='date'&&Math.random()<.2};
  stage(kind==='fight'?'仲直り：'+S.t:S.t,kind==='fight'?'🙏':S.ico);
  note(kind==='fight'?'😤 '+S.why:S.intro);
  if(P.rain)note('☔ 雨が ふってきた… ひとつの かさに ふたりで 入る ことに');
  const [ex,tx]=ML({event:'lv_evIntro',fight:'lv_fightIntro',date:'lv_dateIntro',season:'lv_seaIntro',rand:'lv_randIntro',jeal:'lv_jealIntro'}[kind],{});setTimeout(()=>{minaJa(ex,tx,'snsmall');setTimeout(node,600)},500)}
function node(){if(!live())return;const N=P.S.nodes[P.at];if(!N)return storyEnd();
  mina(N.s[0],N.s[1],N.ex||'smile','',N.who);
  afterTalk(()=>{const L=shuffle(N.o.map(o=>({e:o[0],j:o[1],o})));
    opts(L,i=>{const o=L[i].o;$('lvans').innerHTML='';you(o[0]);P.pts+=o[2];
      if(o[2]===2)addPh(o[0],o[1],P.kind==='fight'?'sorry':P.kind==='date'&&P.at==='a'?'invite':'feel');if(P.S.dream&&o[7])LV.dream=o[7];
      sf(o[2]===2?'step':o[2]===1?'tap':'tease');
      setTimeout(()=>{if(!live())return;if(o[4])mina(o[4],o[5]||'',o[2]===2?'love':o[2]===1?'smile':'worry',o[2]?'k-good':'k-oops',N.who);
        if(!o[2]&&o[6])setTimeout(()=>{if(live())minaJa('think',`💡 ${o[6]}`,'snhint')},o[4]?500:0);
        P.at=o[3];afterTalk(node,o[2]?400:900,o[4]?900:300)},550)})},250,600)}
function storyEnd(){if(!live())return;if(P.S.ends)return softEnd();const S=P.S,ok=P.pts>=S.need;$('lvans').innerHTML='';$('lvq').textContent=ok?'★':'🏁';
  LV.day=dk();if(P.kind==='event'){if(ok){LV.st++;LV.h=0;LV.ev=0;LV.hist.push({k:'st',st:LV.st,d:dk()})}else LV.ev++}
  else{LV.fights++;if(ok){LV.fight=null;LV.deep++;const need=STG[LV.st].need;LV.h=need?Math.min(need,LV.h+6):LV.h+6;LV.hist.push({k:'deep',d:dk()})}
    else{LV.fight.tries++;LV.h=Math.max(0,LV.h-5)}}
  LV.n++;save();
  const L=ok?S.ok:S.ng;mina(L[0],L[1],ok?(L[2]||'love'):(L[2]||'worry'),ok?'k-good':'');
  afterTalk(()=>{if(!live())return;let head,sub,k;
    if(P.kind==='event'){const N=STG[LV.st];
      if(ok){head=`${N.ico} 「${N.n}」に なった！`;sub='💗 ふたりの 段階が 上がったよ';k='lv_evOk'+LV.st;sf('fanfare',2);try{BEACH.scene.play('rn_heart')}catch(e){}}
      else{head='🌙 また こんど…';sub=`もう少しで とどきそう（${P.pts}/${S.need}）。 あした また ちょうせん できるよ`;k='lv_evNg';sf('pop')}}
    else{if(ok){head='💞 仲直り できた！';sub='💗 ハート +6 ・ 前より なかよく なった';k='lv_fightOk';sf('done')}
      else{head='💔 仲直り できなかった…';sub='💗 ハート −5 ・ あした もう一度 話そう';k='lv_fightNg';sf('pop')}}
    const [ex,tx]=ML(k,{n:STG[LV.st].n});
    $('lvans').innerHTML=`<div class="kres">
      <p class="kend ${ok?'good':'fun'}">${head}</p><p class="note">${sub}</p>
      <div class="kmina"><span class="lface">${face(ex,tx)}</span><p>${tx}</p></div>
      <div class="row"><button id="lvok" data-back>もどる</button></div></div>`;
    $('lvok').onclick=()=>{sf('back');hush();P=null;open()};
    setTimeout(()=>$('lvans').scrollIntoView({behavior:'smooth',block:'end'}),100)},300,900)}
/* デート・ランダム・季節・やきもちの おわり: エンドを 集める。 ハートは 下がらない */
const HEARTS={date:[4,2,1],rand:[3,2,1],season:[4,3,1],jeal:[2,1,0]};
function softEnd(){const S=P.S,kind=P.kind,k=P.pts>=S.need?'good':P.pts>=S.need/2?'ok':'fun',E=S.ends[k],ek=S.id+':'+k,isNew=!LV.ends[ek];$('lvans').innerHTML='';$('lvq').textContent=k==='good'?'★':'🏁';
  const lastWho=(S.nodes.b||S.nodes.a).who;
  LV.ends[ek]=1;let gain=HEARTS[kind][['good','ok','fun'].indexOf(k)]+(P.rain&&k!=='fun'?1:0);const need=STG[LV.st].need,before=LV.h;LV.h=need?Math.min(need,LV.h+gain):LV.h+gain;gain=LV.h-before;
  if(kind==='season')LV.sea[S.id+new Date().getFullYear()]=1;if(kind==='jeal')LV.jeal=0;
  LV.day=dk();LV.n++;const an=anniv();save();
  mina(E[1],E[2],k==='good'?'love':k==='ok'?'happy':'wow',k==='good'?'k-good':'',lastWho);
  afterTalk(()=>{if(!live())return;
    if(an)note(`🎉 ふたりの 時間 ${an}日め！ <b>記念日 ハート +2</b>`);
    const coins=isNew?(k==='good'?5:3):0;
    const [ex,tx]=ML('lv_'+kind+'End'+(k==='good'?'':k==='ok'?'Ok':'Fun'),{t:S.t});
    let hint='';if(S.hint){const M=mood(),c=conds().find(c=>!c.ok);hint=`<p class="lvhint">💡 ミナ先生は きょう「${esc(M[1])}」。 ${TOP[M[4][0]][0]} ${TOP[M[4][0]][1]}の 話が 好きそう${c?`<br>📌 つぎの 段階には ${esc(c.t)}（${Math.min(c.have,c.need)}/${c.need}）`:''}</p>`}
    $('lvans').innerHTML=`<div class="kres">
      <p class="kend ${k==='good'?'good':'fun'}">${S.ico} 「${esc(E[0])}」${isNew?' <small>NEW!</small>':''}</p>
      <p class="note">💗 ハート +${gain}${P.rain&&k!=='fun'?'（☔ 相合傘 +1）':''}</p>
      ${coins?`<p class="kpay">🪙 <b>${coins}まい</b> <small>新しい 思い出</small></p>`:''}
      ${hint}
      <div class="kmina"><span class="lface">${face(ex,tx)}</span><p>${tx}</p></div>
      <div class="row"><button id="lvok" data-back>もどる</button></div></div>`;
    if(coins){const r=$('lvans').getBoundingClientRect();H.coinBurst(r.left+r.width/2,r.top+20,coins)}
    k==='good'?sf('done'):sf('heart');
    $('lvok').onclick=()=>{sf('back');hush();P=null;open()};
    setTimeout(()=>$('lvans').scrollIntoView({behavior:'smooth',block:'end'}),100)},300,900)}
/* 🎉 記念日（ふたりの 時間の 日数） */
function anniv(){const n=LV.n;if(![7,30,50,100,200,365].includes(n)||LV.ann===n)return 0;LV.ann=n;const need=STG[LV.st].need;LV.h=need?Math.min(need,LV.h+2):LV.h+2;LV.hist.push({k:'ann',n,d:dk()});return n}
/* 🎁 プレゼントを あげたとき（game/gift.js）: ハートが 上がる（1日 1回） */
function gift(t,it){if(LV.gd===dk())return '';LV.gd=dk();const love=it&&/z:g_(choco|bouquet|pendant)/.test(it.key||'');
  const add=Math.max(0,[0,1,2,3][t]+(love?2:0)+(it&&it.lux?2:0)),need=STG[LV.st].need,before=LV.h;LV.h=need?Math.min(need,LV.h+add):LV.h+add;save();
  return LV.h>before?`💗 ハート +${LV.h-before}`:''}
function event(){story(LOVE_EVENTS[LV.st],'event')}
function fight(){if(!LV.fight)return open();story(LOVE_FIGHTS[LV.fight.i],'fight')}

/* ================================================================ 📔 恋の フレーズ帳 */
function phrases(){hush();const by={};Object.entries(LV.ph).forEach(([en,p])=>{(by[p.c]=by[p.c]||[]).push([en,p])});
  const [ex,tx]=ML(phN()?'lv_book':'lv_bookEmpty',{n:phN()});
  H.show('love',`<section class="pnl lvp">
    <div class="qtop"><button class="x" id="lvx" aria-label="もどる">←</button><b>📔 恋の フレーズ帳</b><span class="qn">${phN()}</span></div>
    <div class="kmina"><span class="lface">${face(ex,tx)}</span><p>${tx}</p></div>
    <div class="lvbook">${Object.entries(CATS).map(([c,[ico,n]])=>{const L=(by[c]||[]).sort((a,b)=>a[1].t-b[1].t);
      return `<details class="mfold${L.length?'':' lvlock'}"><summary>${ico} ${n}<small>${L.length?L.length+'こ':c==='propose'?'？？？':'まだ'}</small></summary><div class="mfbody lvphl">
        ${L.length?L.map(([en,p])=>`<button data-say="${esc(en)}"><span class="en">${esc(en)}</span><span class="ja">${esc(p.j||'')}</span></button>`).join(''):`<p class="note">${c==='propose'?'💍 いつか きっと…':'ミナ先生との 会話で 正しく 言えると たまるよ'}</p>`}</div></details>`}).join('')}</div>
  </section>`);
  $('lvx').onclick=()=>{sf('back');open()};
  H.panel.querySelectorAll('.mfold').forEach(f=>f.ontoggle=()=>{if(f.open)sf('pop')});
  H.panel.querySelectorAll('[data-say]').forEach(b=>b.onclick=()=>{sf('tap');speak(b.dataset.say)})}

/* ================================================================ ミナ先生の ページの ボタン */
function btn(){roll();const t=todo();return `<button id="mlove" class="msensei mlove">💗 ミナ先生との 時間${t==='day'||t==='event'||t==='fight'?'<i class="dot"></i>':''}</button>`}
function bind(back){const b=$('mlove');if(b)b.onclick=()=>{sf('talk');open(back)}}
/* あいさつ（ホームで あけた とき）: 段階で 呼び方・口調が かわる */
function greet(h){if(!LV.n)return null;const st=Math.min(LV.st,3),k=h>=5&&h<11?'lv_morning'+st:h>=19||h<4?'lv_night'+st:null;
  if(!k||!MINA_LINES[k])return null;const [ex,tx]=ML(k,{});const t=todo();return [ex,tx,t!=='done'?['💗 ふたりの 時間へ',()=>open(H.home)]:null]}

/* ================================================================ ミナ先生の セリフ */
Object.assign(MINA_LINES,{
 /* この 画面の さいしょ（段階・機嫌） */
 lv_hi0:[['smile','きょうも 英語で ちょっと おしゃべり しよっか。 先生、 この 時間 けっこう 好きなんだ'],['happy','来てくれたね。 きょうは なんの 話を しようか'],['smile','1日 1回の ふたりの 英会話。 まちがえても だいじょうぶ、 ヒントを 出すからね']],
 lv_hi1:[['happy','あ… 来てくれたんだ。 えへへ、 ちょうど 話したいと 思ってたの'],['smile','きょうも 会えて うれしいな。 …なんて、 先生が 言っちゃ だめかな'],['love','待ってたよ。 …べ、 べつに ずっと 待ってた わけじゃ ないけど']],
 lv_hi2:[['love','おそいよー。 …うそ。 来てくれるって わかってた'],['happy','きょうは どんな 話、 してくれるの？ たのしみに してたんだ'],['smile','あなたと 話してると、 時間が あっという間なの']],
 lv_hi3:[['love','会いたかった。 …きょうは 何回 そう 思ったか わからない'],['love','おかえり。 ふたりの 時間、 はじめよっか'],['happy','きょうも いちばんに あなたの 顔が 見たかったんだ']],
 lv_hi0_genki:[['happy','きょうは なんだか ごきげんなの！ 海とか 音楽の 話、 したいな']],
 lv_hi0_shonbori:[['worry','…あ、 ごめん。 ちょっと ぼーっと してた。 だいじょうぶ、 話そっか']],
 lv_hi1_waku:[['wow','ねえ ねえ、 きょうは わくわく してるの！ 星の 話とか どう？']],
 lv_hi1_nemui:[['think','ふあ… ごめん、 ちょっと ねむくて。 でも あなたとは 話したい']],
 lv_hi2_kangae:[['think','ちょっと 考えごと してたの。 …あなたの こと、 じゃないよ？ たぶん']],
 lv_hi2_nonbiri:[['smile','ココア いれたの。 いっしょに のんびり 話そ']],
 lv_hi3_genki:[['happy','きょうは 最高の 気分！ だって あなたに 会えたから']],
 lv_hi3_shonbori:[['worry','…ちょっとだけ 元気 ないの。 そばに いて くれる？']],
 lv_done0:[['smile','きょうの 時間は おしまい。 また あした ね。 授業も 待ってるよ'],['happy','きょうは よく がんばったね。 あしたも 話そう']],
 lv_done1:[['love','また あした。 …あしたが 来るのが ちょっと 楽しみ'],['smile','きょうは ありがとう。 あしたも 来てくれる？']],
 lv_done2:[['love','もう 会えちゃったから、 あしたまで 待ってね。 …わたしも 待つから'],['happy','あした、 また いっしょに 話そうね']],
 lv_done3:[['love','あしたも、 そのつぎも、 ずっと 会えるよね'],['love','さっき 会った ばかりなのに、 もう 会いたい']],
 lv_fight:[['worry','…{why} ちょっと 話が あるの'],['worry','…ねえ。 わかってるよね？ {why}']],
 lv_ready0:[['love','ねえ… きょう、 授業の あと 少し 時間 ある？'],['love','なんだか きょうは、 いつもと ちがう 話が したい 気分']],
 lv_ready1:[['love','こんどの 日曜、 ひま？ …いっしょに 行きたい ところが あるの'],['love','あのね、 岬の 灯台… いっしょに 行って みない？']],
 lv_ready2:[['love','今夜は 流星群なんだって。 …ふたりで 見に 行かない？'],['love','きょうは… なにか 大事な 話が ありそうな 顔 してるね']],
 lv_topic:[['smile','好きな 話題を えらんでね。 わたしの きょうの 気分に あうと、 もっと もりあがるかも'],['think','🔮 機嫌うらないで ラッキーな 話題が わかるよ'],['happy','どの 話に する？ わたしの 顔を 見て 決めてもいいよ']],
 lv_fit:[['happy','{t}の 話！ ちょうど その 話が したかったの'],['love','わあ、 {t}？ きょうの 気分に ぴったり']],
 lv_fitSo:[['smile','{t}の 話ね。 いいよ'],['smile','{t}か。 うん、 話そう']],
 lv_unfit:[['worry','{t}… うん、 いいよ。 （きょうは ちょっと ちがう 気分 だったかも）'],['think','{t}ね。 …ちょっと 気分じゃ ないけど、 がんばる']],
 lv_okHint:[['proud','ヒントで 言えたね。 ちゃんと 伝わったよ'],['happy','そう、 それ！ 言いなおせるのも 大事な 力']],
 lv_explain:[['smile','まちがえても だいじょうぶ。 ちゃんと 意味は 伝わってたよ'],['think','いまの 言い方、 フレーズ帳に 入れておくね。 つぎは 言えるよ']],
 lv_endPerfect:[['love','ぜんぶ 1回で 言えたね。 …なんだか、 ドキッと しちゃった'],['proud','カンペキ！ その 英語、 ほんとに 伝わってたよ']],
 lv_endGood:[['happy','楽しかった！ ちゃんと 会話に なってたね'],['smile','いい 時間だった。 フレーズ帳も 見てみてね']],
 lv_endLow:[['smile','むずかしかった？ でも ヒントで ちゃんと たどりついたね'],['think','解説した 言い方、 フレーズ帳に 入ってるよ。 あした また 使ってみて']],
 lv_endFit:[['love','{t}の 話、 ほんとに 楽しかった。 わたしの 気分、 わかるの？'],['happy','きょうの 気分に ぴったりの 話題 だったよ。 ありがとう']],
 lv_endFirst:[['love','はじめての ふたりの 時間、 どうだった？ これから 毎日 少しずつ 話そうね'],['happy','1日 1回、 こうして 英語で 話そう。 ハートは 少しずつ たまるよ']],
 lv_endReady:[['love','…ねえ。 つぎに 会う とき、 ちょっと 特別な 日に したいな'],['love','ハートが いっぱいに なったね。 …あした、 なにか おきるかも']],
 lv_evIntro:[['love','きょうは 特別な 日。 気持ちを こめて 英語を えらんでね'],['think','分かれ道が ある 会話だよ。 わたしの 気持ちを 考えて 答えてみて']],
 lv_fightIntro:[['worry','あやまる ときは 「I\'m sorry.」の あとに、 どう 思ったか・ これから どうするかも 言えると いいよ'],['think','仲直りの 英語、 だいじだよ。 相手の 気持ちを 受けとめる ことばを えらんでね']],
 lv_evOk1:[['love','きょうから あなたは… 気になる 人。 …言っちゃった'],['love','先生と 生徒、 だけじゃ なくなったね']],
 lv_evOk2:[['love','ミナって よんで くれる？ …うん、 その ほうが いい'],['love','友だち 以上… って、 なんだか くすぐったいね']],
 lv_evOk3:[['love','わたしたち、 恋人… なんだね。 これから よろしくね'],['love','ずっと この 日を 待ってた。 大好きだよ']],
 lv_evNg:[['smile','まだ 早かった かもね。 でも 気持ちは うれしかったよ。 また こんど'],['think','分かれ道で ちがう 答えを えらんだら、 ちがう 話に なるよ。 あした もう一度']],
 lv_fightOk:[['love','けんかの あとって、 前より なかよく なれるんだね'],['happy','ちゃんと 英語で あやまれたね。 「I should have ～」、 おぼえておいて']],
 lv_fightNg:[['think','あやまる ときは まず「I\'m sorry.」、 それから 相手の 気持ちを 受けとめる ことば。 あした また 話して みて'],['worry','ハートが 少し 下がっちゃった。 でも 仲直りが できたら、 前より なかよく なれるよ']],
 lv_book:[['smile','いままで 言えた フレーズが {n}こ。 タップすると 声で 聞けるよ'],['love','この ノート、 わたしたちの 思い出 みたいだね'],['think','場面ごとに 分けて あるよ。 あやまる ことばも だいじ']],
 lv_bookEmpty:[['smile','まだ からっぽ。 ふたりの 時間で 正しく 言えた 英語が ここに たまるよ']],
 lv_luck:[['smile','好きな 話題を えらぶと、 ミナ先生の ハートが 多めに 上がるよ'],['smile','流れ星は 運しだい。 見られたら ハートが おまけ'],['smile','けんか しても だいじょうぶ。 ちゃんと あやまれば 前より なかよく なれる'],['smile','放っておいても ハートは 下がらないよ。 ゆっくりで いいからね'],['smile','段階が 上がると、 会話の 英語も 少し むずかしく なるよ']],
 /* おはよう・おやすみ（段階で 呼び方・口調が かわる） */
 lv_morning0:[['smile','おはよう！ きょうも 1日 英語 がんばろうね'],['happy','Good morning! きょうの ふたりの 時間、 待ってるよ']],
 lv_morning1:[['happy','おはよ… あ、 おはよう！ きょうも 会えて うれしい'],['love','Good morning. …きのうの 話、 まだ 思い出してた']],
 lv_morning2:[['love','おはよう。 ねえ、 きょうも いっしょに いて くれる？'],['happy','Morning! ミナって よんで くれた？ ふふ']],
 lv_morning3:[['love','おはよう、 だいすきな 人。 Good morning, sweetheart.'],['love','起きて いちばんに あなたの こと 考えちゃった']],
 lv_night0:[['smile','こんばんは。 夜の 勉強、 えらいね。 むりは しないでね'],['smile','Good evening. ねる 前に ちょっとだけ 話そっか']],
 lv_night1:[['love','こんばんは。 …夜に 会えると、 なんだか ドキドキするね'],['smile','Good night の 前に、 ちょっと 話そ？']],
 lv_night2:[['love','今夜は 星が きれいだよ。 いっしょに 見たいな'],['love','おやすみ… の 前に、 もう少し だけ いっしょに いて']],
 lv_night3:[['love','おやすみ、 大好きな 人。 Sweet dreams.'],['love','今夜も ゆめで 会えたら いいな。 Good night, my dear.']],
 /* ホーム（mina-sense の ルール） */
 x_lvToday0:[['smile','きょうの 「ミナ先生との 時間」、 まだ だよ。 英語で ちょっと おしゃべり しよう'],['happy','1日 1回の ふたりの 英会話。 わたしの 顔を タップして 来てね']],
 x_lvToday1:[['love','ねえ… きょう、 まだ 話して ないよね？ ちょっと だけ 待ってるね'],['happy','きょうの 時間、 あいてる？ 話したい ことが あるんだ']],
 x_lvToday2:[['love','きょうは まだ 会えて ない。 …さびしいな、 なんて'],['happy','ふたりの 時間、 そろそろ どう？']],
 x_lvToday3:[['love','会いたいな。 ふたりの 時間に 来てくれる？'],['love','きょうも あなたの 英語、 いちばん 近くで 聞きたい']],
 x_lvFight:[['worry','…ねえ。 まだ ちゃんと 仲直り して ないよ'],['worry','あやまる 英語、 ちゃんと 言えたら ゆるして あげる… かも']],
 x_lvReady:[['love','あのね… 大事な 話が あるの。 ふたりの 時間に 来て'],['love','きょうは ちょっと 特別な 日に なりそう']],
 x_lvNear:[['think','つぎの 段階まで あと 英語の 力が 少し。 {c}が もう少しだよ'],['smile','ハートは いっぱい！ あとは {c}。 がんばって']],
 x_lvBook:[['smile','恋の フレーズ帳、 {n}こ たまったね。 声に 出して 言ってみて'],['love','フレーズ帳の 「{p}」、 おぼえてる？']],
 x_lvMood:[['smile','きょうの わたしの 機嫌、 わかる？ 🔮 うらないで こっそり 見てもいいよ'],['think','きょうは {m} 気分。 合う 話題、 なにか わかるかな']]
});
if(window.MINA_SENSE&&MINA_SENSE._rules)MINA_SENSE._rules.push(
 [F=>'x_lvToday'+Math.min(LV.st,3),3,()=>todo()==='day'?{}:null,()=>['💗 ふたりの 時間へ',()=>open(H.home)]],
 ['x_lvFight',6,()=>todo()==='fight'?{}:null,()=>['🙏 仲直りしに 行く',()=>open(H.home)]],
 ['x_lvReady',6,()=>todo()==='event'?{}:null,()=>['✨ 会いに 行く',()=>open(H.home)]],
 ['x_lvNear',2,()=>{if(LV.st>=3||!heartFull())return null;const c=conds().find(c=>!c.ok);return c?{c:c.t.replace(/^\S+\s/,'')}:null},null],
 ['x_lvBook',1,()=>{const k=Object.keys(LV.ph);return k.length>=3?{n:k.length,p:pickL(k)}:null},()=>['📔 フレーズ帳',()=>{open(H.home);phrases()}]],
 ['x_lvMood',1,()=>LV.n&&!LV.fight?{m:mood()[1]}:null,()=>['💗 ふたりの 時間へ',()=>open(H.home)]]);

/* ---------- 第2弾: デート・ランダム・季節・やきもち・プレゼント の セリフ ---------- */
Object.assign(MINA_LINES,{
 lv_datePick:[['love','デートの 場所、 えらんでね。 場所ごとに ちがう 思い出が できるよ'],['happy','どこでも うれしいけど… ⭐が ついてる 場所は もう 行った ところだよ']],
 lv_dateIntro:[['love','デートの 英語は、 さそう・ほめる・気持ちを 伝える の 3つが だいじだよ'],['happy','分かれ道で エンドが かわるよ。 いろんな 思い出を 集めてね']],
 lv_seaIntro:[['happy','季節の イベントは 1年に 1回だけ。 その 季節の 英語を 楽しもう'],['love','とくべつな 日の 英語、 フレーズ帳に のこそうね']],
 lv_randIntro:[['smile','きょうは いつもと ちょっと ちがう 時間に なりそう'],['happy','たまには こんな 日も あるよね']],
 lv_jealIntro:[['worry','…べつに すねてないよ。 ほんとだよ'],['worry','やきもちの ときは、 相手が とくべつだって 伝える ことばが 効くよ… なんてね']],
 lv_dateEnd:[['love','「{t}」、 さいこうの デートだった。 また さそってね'],['love','きょうの デート、 思い出に 入れておくね']],
 lv_dateEndOk:[['happy','楽しかった！ ちがう 答えを えらぶと、 もっと とくべつな エンドも あるかも'],['smile','いい デートだったね。 また 来よう']],
 lv_dateEndFun:[['happy','あはは、 へんな デートに なっちゃった。 でも これも 思い出'],['think','つぎは もうちょっと ロマンチックに… ね？']],
 lv_randEnd:[['love','ふふ、 いい 時間だったね'],['happy','たまには こういう 日も いいね']],
 lv_randEndOk:[['smile','きょうは きょうで 楽しかったよ'],['happy','また こういう 日が あると いいな']],
 lv_randEndFun:[['happy','あはは！ ずっと わらっちゃった'],['think','…まあ、 あなたらしいけどね']],
 lv_seasonEnd:[['love','「{t}」、 一生の 思い出に なりそう'],['love','来年の {t}も、 いっしょに すごそうね']],
 lv_seasonEndOk:[['happy','{t}、 楽しかったね！'],['smile','季節の 英語、 ひとつ おぼえたね']],
 lv_seasonEndFun:[['happy','{t}なのに～！ あはは'],['think','来年は もっと ロマンチックに… ね？']],
 lv_jealEnd:[['love','…とくべつって 言われたら、 ゆるすしか ないよね'],['love','もう すねない。 …たぶん']],
 lv_jealEndOk:[['worry','ちょっと すねた だけ。 気に しないで'],['smile','…わかってるよ。 みんなに やさしいのが あなたの いい ところ']],
 lv_jealEndFun:[['worry','…ふんっ。 あしたには なおってる… かも'],['think','「とくべつ」の 伝え方、 フレーズ帳で 見てみて']],
 x_lvDate:[['love','ねえ… こんど、 どこか 行かない？ ふたりの 時間で 「デートに さそう」を おしてね'],['happy','夕日の 浜辺、 岬、 雑貨店、 星の 夜… デートの 場所は 4つ あるよ']],
 x_lvSeason:[['wow','きょうは とくべつな 季節の 日！ ふたりの 時間に 来て'],['love','ねえ、 きょうが なんの 日か 知ってる？']],
 x_lvJeal:[['worry','…べつに。 だれに プレゼント あげても いいけど'],['worry','ふーん。 楽しそう だったね。 …なんでもない']],
 x_lvMem:[['love','📸 ふたりの 思い出、 {n}こ たまったよ'],['smile','デートの エンド、 まだ ？？？の ものが あるよ']],
 x_lvAnniv:[['love','ふたりの 時間、 もう {n}日 だね。 …ありがとう'],['happy','{n}日も いっしょに 英語を 話したんだよ。 すごいね']],
 x_lvGiftLove:[['love','雑貨店に {n}が 入ったって。 …べつに ほしい わけじゃ ないよ？'],['happy','プレゼントを くれると、 ハートが 少し 上がるかも… なんてね']]
});
if(window.MINA_SENSE&&MINA_SENSE._rules)MINA_SENSE._rules.push(
 ['x_lvDate',2,()=>LV.st>=2&&todo()==='day'?{}:null,()=>['🌅 デートに さそう',()=>{open(H.home);datePick()}]],
 ['x_lvSeason',6,()=>todo()==='day'&&seasonDue()?{}:null,()=>['💗 ふたりの 時間へ',()=>open(H.home)]],
 ['x_lvJeal',5,()=>LV.jeal&&todo()==='day'?{}:null,()=>['💗 ふたりの 時間へ',()=>open(H.home)]],
 ['x_lvMem',1,()=>memN()>=2?{n:memN()}:null,()=>['💗 ふたりの 時間へ',()=>open(H.home)]],
 ['x_lvAnniv',1,()=>LV.n>=7?{n:LV.n}:null,null],
 ['x_lvGiftLove',2,()=>{try{const L=ZAKKA.items.filter(i=>i.love&&LV.st>=i.love);return L.length?{n:pickL(L).n}:null}catch(e){return null}},()=>['🏚️ 雑貨屋へ 行く',()=>ZAKKA.open()]]);

window.LOVE={open,btn,bind,greet,phrases,todo,mood,ready,conds,gift,rec:()=>LV,
  _test:{set:o=>{Object.assign(LV,o);save()},reset:()=>{LV.day='';LV.rd='';save()},fight:i=>{LV.fight={i:i||0,d:dk(),tries:0};LV.day='';save()},story:(S,k)=>story(S,k)}};
})();
