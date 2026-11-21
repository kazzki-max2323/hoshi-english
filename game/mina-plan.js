/* 👩‍🏫 ミナ先生が えらんで はじめる しくみ（MPLAN）
   ユーザーの 希望（2026-11-20）: 「何分？」は なし。 えらぶのは ミナ先生。 全部で いくつ・のこり いくつは 見せない
   - 🔥 きょうの授業（大きく。 自動では はじまらない: ユーザーの 希望 11/20）: ちょっと ふくしゅう 2問 → いまの 単元の つぎの 1時間 → おまけ（音・ことば・勉強の コツの ミニ授業）
       はじめての 単元は さいしょに 1問ずつ 聞いて、 わかる 時間は とばす（UNIT.probe）
   - 💪 特別授業: 苦手が いちばん 多い 単元を、 まちがえた 時間から 通しで
   - 📖 勉強: きょうの授業とは べつの 単元の 1時間（なければ 音・ことばの ミニ授業）
   - 📚 復習: 単元の まちがい → ミニ授業の まちがいノート → 苦手とっくん → 習った 単元 を じゅんばんに
   - ☕ おしゃべり: 先生役の 会話 か 長い おしゃべり
   単元の じゅんばんは ORDER（先に 習うと あとが 楽に なる じゅん。 まだ ない 単元は とばす）
   セリフは game/unit-lines.js（mp_ ・ x_mp）。 きろくは localStorage 'hoshi_plan' */
(()=>{
const {S:ST,sfx:SFX}=BEACH;
const H=HE,esc=H.esc,$=id=>document.getElementById(id);
const pickL=a=>a[Math.random()*a.length|0];
const ML=(k,v)=>{try{return MINA.line(k,v||{})}catch(e){return ['smile','']}};
const KEY='hoshi_plan';
const MP=(()=>{try{const s=JSON.parse(localStorage.getItem(KEY)||'null');if(s&&typeof s==='object')return s}catch(e){}return {}})();
const keep=()=>{try{localStorage.setItem(KEY,JSON.stringify(MP))}catch(e){}};
const dk=d=>{d=d||new Date();return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate()};
const day=()=>{if(!MP.day||MP.day.d!==dk())MP.day={d:dk(),done:0,n:0};return MP.day};

/* ---------- 単元の じゅんばん ---------- */
const ORDER=['basic','past','future','count','ask','modal','perfect','toing','comp','passive','prep','form','rel','conj','subj','speech','adv'];
const units=()=>{const L=UNIT.list.slice();return ORDER.map(id=>L.find(u=>u.id===id)).filter(Boolean).concat(L.filter(u=>!ORDER.includes(u.id)))};
/* いまの 単元: まだ おわっていない（全部の 時間＋まとめテスト）さいしょの もの。 ぜんぶ おわったら ★が いちばん 少ない もの */
function cur(){const L=units();return L.find(u=>!u.done())||L.slice().sort((a,b)=>(a.rec().best||0)-(b.rec().best||0)||(a.rec().t||0)-(b.rec().t||0))[0]}
const chOf=u=>{const i=u.nextCh();return i==null?null:u.D.CH[i]};
/* いま 何を するか（ページの 表示と 同じ もの） */
function todayInfo(){const u=cur();if(!u)return null;const c=chOf(u),fresh=!u.started();
  return {u,c,fresh,test:!c,t:c?c.short:'まとめテスト'}}

/* ---------- おまけ: 音・ことば・勉強の コツの ミニ授業（文法の ミニ授業は 単元に 入った） ---------- */
const lesDone=id=>!!((MINA.rec().les||{})[id]);
function omake(){if(typeof LESSONS==='undefined')return null;let lv='jh';try{lv=MINA.level()}catch(e){}
  const tip=Math.random()<.3,cats=tip?['yarikata','kagaku']:['oto','kotsu','hama'];
  const ok=l=>cats.includes(l.cat)&&!lesDone(l.id),same=LESSONS.filter(l=>ok(l)&&l.lv===lv),any=LESSONS.filter(ok);
  return pickL(same.length?same:any)||null}
function omakeBtn(){const l=omake();if(!l)return ['👩‍🏫 ミナ先生に ほうこく ▶',()=>MINA.open()];
  return [`🎁 おまけ：${esc(l.t)} ▶`,()=>{try{LESSON.open(l.id,MINA.open)}catch(e){MINA.open()}}]}

/* ---------- 🔥 きょうの授業 ---------- */
function warmFrom(u){/* ほかの 単元（まちがいが ある もの 優先）か この 単元の おわった 時間から 2問 */
  const L=units().filter(x=>x.doneN()>0),w=L.filter(x=>x.missOf()>0),src=pickL(w.length?w:L);if(!src)return null;
  const qs=src.warmQs(2);return qs.length?{src,qs}:null}
function today(){const D=day(),I=todayInfo();if(!I)return;const u=I.u,label='🔥 きょうの 授業';
  const P={label,then:()=>D.done?null:omakeBtn(),done:()=>{D.done=1;D.n++;keep();try{RECENT.add('plan',{k:'today',u:u.id})}catch(e){}}};
  if(D.done){/* もう1時間: ふくしゅう・おまけ なし */P.then=null;u.go(P);return}
  if(I.fresh&&u.D.CH.length>2&&!u.rec().pr){u.probe(P);return}
  const W=warmFrom(u),start=()=>u.go(Object.assign({},P,{test:I.test}));
  if(W)W.src.warmRun(W.qs,label,start);else start()}

/* ---------- 💪 特別授業: 苦手が 多い 単元を まちがえた 時間から ---------- */
function weakUnit(){/* 新しく 作った 特別授業（D.sp: 英語のしくみ）は おわるまで それを */const sp=units().find(u=>u.D.sp&&!u.done());if(sp)return sp;
  const L=units().filter(u=>u.started()),m=L.filter(u=>u.missOf()>0).sort((a,b)=>b.missOf()-a.missOf());if(m.length)return m[0];
  let w=[];try{w=SENSEI.weak()}catch(e){}const g=L.find(u=>u.gids().some(id=>w.includes(id)));if(g)return g;
  return L.find(u=>(u.rec().best||0)<3)||cur()}
function special(){const u=weakUnit();if(!u)return;const R=u.rec(),CH=u.D.CH;
  const miss=Object.keys(R.miss).map(Number).filter(i=>CH[i]).sort((a,b)=>R.miss[b]-R.miss[a]);
  const label=`💪 特別授業：${esc(u.D.title)}`;
  /* 通しで: その 時間の あと → つぎの まちがえた 時間 → まだの 時間 → まとめテスト */
  const queue=miss.length?miss:CH.map((c,i)=>i).filter(i=>!(R.ch[i]&&R.ch[i].d));
  const step=k=>{const ci=queue[k];if(ci==null){u.go({label,test:1,then:null});return}
    u.go({label,ci,then:()=>[queue[k+1]!=null?`▶ つぎ：${esc(CH[queue[k+1]].short)}`:'📝 まとめテストへ ▶',()=>step(k+1)]})};
  if(!queue.length){u.go({label,test:1});return}
  step(0)}
function specialName(){const u=weakUnit();return u?u.D.title:''}

/* ---------- 📖 勉強: べつの 単元の 1時間 ---------- */
function study(){const c=cur(),L=units().filter(u=>u!==c&&!u.done()),u=L.find(u=>u.started())||L[0];
  if(!u){const l=omake();if(l){SFX.lesson();LESSON.open(l.id,MINA.open)}else today();return}
  const P={label:'📖 勉強',then:()=>omakeBtn()};
  if(!u.started()&&u.D.CH.length>2&&!u.rec().pr){u.probe(P);return}
  u.go(Object.assign(P,{test:u.nextCh()==null}))}

/* ---------- 📚 復習: いろいろな ところから じゅんばんに 1つ ---------- */
function review(){const opts=[];
  const um=units().filter(u=>u.missOf()>0);if(um.length)opts.push(()=>um[0].review({label:'⚡ 練習'}));
  try{if(REVIEW.missN()>0)opts.push(()=>{SFX.lesson();REVIEW.drill('miss',MINA.open,5)})}catch(e){}
  try{if(REVIEW.dueIds().length)opts.push(()=>{SFX.lesson();REVIEW.drill('today',MINA.open)})}catch(e){}
  try{const w=SENSEI.weak();if(w.length)opts.push(()=>{SFX.step();SENSEI.tokkun(w.slice(0,3),0,'mina')})}catch(e){}
  const ud=units().filter(u=>u.doneN()>0);if(ud.length)opts.push(()=>pickL(ud).review({label:'⚡ 練習'}));
  if(!opts.length){const [ex,tx]=ML('mp_none');try{MINA.say(ex,tx,5000)}catch(e){}today();return}
  MP.rv=(MP.rv||0)+1;keep();opts[(MP.rv-1)%opts.length]()}

/* ---------- ☕ おしゃべり ---------- */
function chat(){let lv='es';try{lv=MINA.level();if(lv==='adv')lv='hs'}catch(e){}
  const sc=(window.SENSEI?SENSEI.scenes:[]).filter(s=>s.lv===lv),done=(window.SENSEI&&SENSEI.rec().done)||{};
  const fresh=sc.filter(s=>!done[s.id]),scene=pickL(fresh.length?fresh:sc);
  MP.ct=(MP.ct||0)+1;keep();
  if(scene&&(MP.ct%2||!window.MCHAT)){SFX.talk();SENSEI.play(scene.id,'mina');return}
  if(window.MCHAT){SFX.talk();MCHAT.open(null,MINA.open);return}
  if(window.SENSEI)SENSEI.open()}

/* ---------- 「きょうは これ」: ミナ先生が 1つだけ えらぶ（11/21 作りなおし） ----------
   1. まちがえた ところが あって、 きょうの 練習が まだ → ⚡ 練習
   2. きょうの 授業が まだ → 📘 つぎの 授業
   3. 練習が まだ（習った ところが ある）→ ⚡ 練習
   4. ぜんぶ おわった → ☕ おしゃべり */
function prSrc(){/* 練習で いちばん 先に かためたい ところ（なければ null） */
  const um=units().filter(u=>u.missOf()>0).sort((a,b)=>b.missOf()-a.missOf());if(um.length)return {miss:1,t:um[0].D.title};
  try{if(REVIEW.missN()>0)return {miss:1,t:'まちがいノート'}}catch(e){}
  try{if(SENSEI.weak().length)return {miss:1,t:'苦手な 文法'}}catch(e){}
  const ud=units().filter(u=>u.doneN()>0);if(ud.length)return {miss:0,t:ud.map(u=>u.D.title).slice(0,2).join('・')};
  return null}
function pickToday(){const D=day(),I=todayInfo(),pr=prSrc();
  if(pr&&pr.miss&&!D.pr)return {k:'pr',ico:'⚡',tag:'きょうは まず 練習',t:pr.t,line:['mp_tPr',{u:pr.t}]};
  if(I&&!D.done)return {k:'les',ico:'📘',tag:'きょうの 授業',t:I.u.D.title+'　'+I.t,
    line:I.fresh?['mp_new',{u:I.u.D.title}]:I.test?['mp_test',{u:I.u.D.title}]:['mp_hello',{u:I.u.D.title,t:I.t}]};
  if(pr&&!D.pr)return {k:'pr',ico:'⚡',tag:'きょうの 練習',t:pr.t,line:['mp_tPr2',{u:pr.t}]};
  return {k:'ct',ico:'☕',tag:'きょうは おしゃべり',t:'ミナ先生と ひと休み',line:['mp_tCt',{}]}}
function runToday(p){p=p||pickToday();if(p.k==='pr'){practice();return}if(p.k==='les'){today();return}chat()}
/* 練習: いまは まちがいを 先に（ミナ先生が えらぶ） */
function practice(){const D=day();D.pr=1;keep();try{RECENT.add('plan',{k:'practice'})}catch(e){}review()}

/* ---------- ミナ先生の ページの 上の ぶぶん（game/mina.js）: 「きょうは これ」＋ 📘授業・⚡練習・☕おしゃべり の 3つ ---------- */
let cdT=null,snooze=0;
/* まだ 聞いていない ミナ先生の うんちく（game/unchiku-data.js の UNK_MINA）。 きょうの うんちく（ほかも やる の 中）とは べつの もの */
function unkPick(p){if(typeof UNK_MINA==='undefined'||!window.UNK||Math.random()>p)return null;let td=-1;try{td=UNK.todayIdx()}catch(e){}
  const L=UNK_MINA.map((t,i)=>i).filter(i=>i!==td&&!UNK.heard('mina',i));if(!L.length)return null;const i=pickL(L);UNK.hear('mina',i);return {i,t:UNK_MINA[i]}}
function page(from){const D=day(),T=pickToday();let [ex,say]=ML(T.line[0],T.line[1]);
  /* たまに うんちく（ユーザーが うんちく好き）: おしゃべりの 日は 半分、 ふだんは 3回に 1回くらい */
  const U=unkPick(T.k==='ct'?.5:.33);if(U){[ex,say]=ML('mp_unk',{t:esc(U.t[0]),ja:esc(U.t[2])});say+=` <button class="ksay mpunk" id="mpunk" data-en="${esc(U.t[1])}" aria-label="英語で 聞く">🔊</button>`}
  return {auto:false,T,html:`<div class="mpcard" id="mpcard">
    <div class="stsay"><span class="lface">${MINA.face('m',ex)}</span><p>${say}</p></div>
    <button class="mpgo k${T.k}" id="mpgo"><span class="mpico">${T.ico}</span><span class="mptx"><small>${T.tag}</small><b>${esc(T.t)}</b></span><span class="mpplay"><i>▶</i></span></button>
  </div>
  <div class="st3 mp3"><button id="mpls"><span>📘</span><b>授業</b></button><button id="mppr"><span>⚡</span><b>練習</b></button><button id="mpct"><span>☕</span><b>おしゃべり</b></button></div>`}}
function stopCd(){if(cdT){clearInterval(cdT);cdT=null}}
function bind(info){const g=$('mpgo');if(!g)return;
  g.onclick=()=>{SFX.lesson();runToday(info.T)};
  $('mpls').onclick=()=>{SFX.book();lessonsPage()};
  $('mppr').onclick=()=>{SFX.book();practicePage()};
  $('mpct').onclick=()=>{SFX.pop();chatPage()};
  const uk=$('mpunk');if(uk)uk.onclick=e=>{e.stopPropagation();SFX.pop();try{SENSEI.talk(uk.dataset.en)}catch(er){}}}

/* ---------- 3つの ページ（ミナ先生の ページの 中。 ← で もどる） ---------- */
function sub(title,ex,tx,body){H.show('mina',`<section class="pnl minap mpsub">
    <div class="qtop"><button class="x" id="mpbk" aria-label="ミナ先生に もどる">←</button><b>${title}</b><span></span></div>
    <div class="stsay"><span class="lface">${MINA.face('m',ex)}</span><p>${tx}</p></div>${body}</section>`);
  $('mpbk').onclick=()=>{SFX.pop();MINA.open()}}
const rowB=(id,ico,b,s,cls)=>`<button class="mprow ${cls||''}" ${id}><span>${ico}</span><b>${b}</b>${s?`<small>${s}</small>`:''}</button>`;

/* 📘 授業: つぎの 授業（大きく）・ 習っている／おわった 単元（見かえせる）・ 💡コツの たな */
const COTS=[['kotsu','💡','覚え方の コツ'],['oto','👄','音と 発音'],['yarikata','📝','勉強の やり方'],['kagaku','🧠','学び方の 科学'],['hama','🍬','ハマ子の 語呂'],['zu','🖼️','図で わかる 文法']];
function lessonsPage(){const I=todayInfo(),D=day(),L=units().filter(u=>u.started()),[ex,tx]=ML(L.length?'mp_les':'mp_les0');
  const body=`${I?rowB('id="mplgo"','📘',esc(I.u.D.title)+'　'+esc(I.t),D.done?'もう 1時間':'つぎの 授業 ▶','big'):''}
    ${L.length?`<h4 class="sth">📚 習っている 授業</h4><div class="mplist">${L.map(u=>rowB(`data-u="${u.id}"`,u.D.ico,esc(u.D.title),u.done()?'おわった・見かえす':'つづき')).join('')}</div>`:''}
    <details class="mfold mpcot"><summary>💡 コツの たな<small>音・覚え方・勉強の やり方</small></summary><div class="mfbody" id="mpcotb"></div></details>`;
  sub('📘 授業',ex,tx,body);
  const g=$('mplgo');if(g)g.onclick=()=>{SFX.lesson();today()};
  H.panel.querySelectorAll('[data-u]').forEach(b=>b.onclick=()=>{SFX.lesson();const u=UNIT.get(b.dataset.u);if(u)u.open()});
  const f=H.panel.querySelector('.mpcot');f.ontoggle=()=>{if(!f.open||$('mpcotb').children.length)return;SFX.pop();
    if(typeof LESSONS==='undefined')return;
    $('mpcotb').innerHTML=COTS.map(([c,ico,n])=>{const ls=LESSONS.filter(l=>l.cat===c);return ls.length?`<details class="mfold"><summary>${ico} ${n}<small>${ls.length}</small></summary><div class="mfbody">${ls.map(LESSON.row).join('')}</div></details>`:''}).join('');
    LESSON.bindRows(lessonsPage)}}

/* ⚡ 練習: きょうの 練習（ミナ先生が えらぶ）・ ⚡れんぱつ・ 📝まとめテスト */
function practicePage(){const pr=prSrc(),L=units().filter(u=>u.doneN()>0),[ex,tx]=ML(pr?'mp_pr':'mp_pr0');let tk=[];try{tk=SENSEI.weak()}catch(e){}
  const body=`${pr?rowB('id="mppgo"','⚡','きょうの 練習',esc(pr.t)+' ▶','big'):''}
    ${window.SKDRILL?rowB('id="mppkd"','🔁','れんぱつ 練習','英語の しくみ・50問まで'):''}
    ${tk.length?rowB('id="mpptk"','🎯','苦手 とっくん','5問'):''}
    ${L.length?`<h4 class="sth">📝 まとめテスト</h4><div class="mplist">${L.map(u=>rowB(`data-t="${u.id}"`,u.D.ico,esc(u.D.title),u.stars?u.stars(u.rec().best||0):'')).join('')}</div>`:''}`;
  sub('⚡ 練習',ex,tx,body);
  const g=$('mppgo');if(g)g.onclick=()=>{SFX.lesson();practice()};
  const kd=$('mppkd');if(kd)kd.onclick=()=>{SFX.lesson();day().pr=1;keep();SKDRILL.open()};
  const t=$('mpptk');if(t)t.onclick=()=>{SFX.step();day().pr=1;keep();SENSEI.tokkun(tk.slice(0,3),0,'mina')};
  H.panel.querySelectorAll('[data-t]').forEach(b=>b.onclick=()=>{SFX.lesson();const u=UNIT.get(b.dataset.t);if(u){u.open();u.test()}})}

/* ☕ おしゃべり: 長い おしゃべり・ 英語で 話す */
function chatPage(){const [ex,tx]=ML('mp_ct');
  const body=`${window.MCHAT?rowB('id="mpcl"','☕','ミナ先生と おしゃべり','日本語で のんびり','big'):''}
    ${window.SENSEI?rowB('id="mpce"','🗣️','英語で 話す','ミナ先生が 先生役'):''}
    ${window.SENSEI?rowB('id="mpcs"','🎬','場面を えらぶ','会話の 一覧'):''}`;
  sub('☕ おしゃべり',ex,tx,body);
  const a=$('mpcl');if(a)a.onclick=()=>{SFX.talk();MCHAT.open(null,MINA.open)};
  const b=$('mpce');if(b)b.onclick=()=>{SFX.talk();MP.ct=0;chatScene()};
  const c=$('mpcs');if(c)c.onclick=()=>{SFX.pop();SENSEI.open()}}
function chatScene(){let lv='es';try{lv=MINA.level();if(lv==='adv')lv='hs'}catch(e){}
  const sc=(window.SENSEI?SENSEI.scenes:[]).filter(s=>s.lv===lv),done=(window.SENSEI&&SENSEI.rec().done)||{};
  const fresh=sc.filter(s=>!done[s.id]),scene=pickL(fresh.length?fresh:sc);if(scene)SENSEI.play(scene.id,'mina');else SENSEI.open()}

/* ---------- ホームの 「きょうは これ」カード ---------- */
function homeCard(){const v=H.panel.querySelector('.home .row');if(!v)return;const o=$('lcard');if(o)o.remove();const T=pickToday();
  v.insertAdjacentHTML('beforebegin',`<div class="lcard2 k${T.k}" id="lcard"><button class="lcgo" id="mphome"><span class="lcico">${T.ico}</span>
    <span class="lctx"><small>${T.tag}</small><b>${esc(T.t)}</b></span><span class="lcplay">はじめる ▶</span></button></div>`);
  $('mphome').onclick=()=>{SFX.lesson();runToday(T)}}
H.on('home',()=>setTimeout(homeCard,0));if(H.screen==='home')setTimeout(homeCard,0);

/* ---------- ホームの ミナ先生の ひとこと: 「何分？」と ミニ授業の きょうの1本 は やめて、 こっちに ---------- */
try{const RL=MINA_SENSE._rules,drop=['x_stAsk','x_stNext','x_lesToday','x_lesStreakKeep','x_lesMore','x_lesStreakLost','x_dpWeak','x_dpCurious','x_dpCheck','x_dpMaster'];
  for(let i=RL.length-1;i>=0;i--)if(drop.includes(RL[i][0]))RL.splice(i,1);
  const go=()=>['🔥 きょうの 授業',()=>today()];
  RL.push(['x_mpToday',6,F=>{const D=day(),I=todayInfo();return !D.done&&I&&!I.fresh?{u:I.u.D.title,t:I.t}:null},go]);
  RL.push(['x_mpNew',4,F=>{const D=day(),I=todayInfo();return !D.done&&I&&I.fresh?{u:I.u.D.title}:null},go]);
  RL.push(['x_mpWeak',3,F=>{const u=units().find(u=>u.missOf()>=2);return u?{u:u.D.title}:null},()=>['💪 特別授業',()=>special()]]);
  RL.push(['x_mpRev',2,F=>units().some(u=>u.doneN()>0&&u.rec().t&&Date.now()-u.rec().t>2*864e5)?{}:null,()=>['📚 復習',()=>review()]]);
}catch(e){console.error(e)}

window.MPLAN={page,bind,today,special,study,review,chat,practice,pickToday,runToday,lessonsPage,practicePage,chatPage,cur,todayInfo,units,doneToday:()=>!!day().done,rec:()=>MP,_stop:stopCd};
})();
