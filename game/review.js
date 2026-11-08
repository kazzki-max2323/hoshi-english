/* ミナ先生の 授業の ふくしゅう: 授業の 中身を しっかり おぼえるための しくみ
   - 授業の れんしゅう・思い出しクイズで まちがえた 問題は 「まちがいノート」に 入る。ふくしゅうで 正解すると へっていく
     （2回 まちがえた 問題は 2回 正解するまで のこる）
   - クリアした 授業は 1日・3日・7日・14日・30日 あけて ふくしゅうの 日が くる（思い出しクイズと 同じ 記録 MOTI.rec().qz.rv）
   - 「きょうの ふくしゅう」: まちがえた 問題 → ふくしゅうの 日が きた 授業 の じゅんに、8問まで まとめて 出す。
     まちがえたら こたえと、その授業の ポイント（図）を 見せる。1日 2回まで コインと なかよし度
   - 「授業の ふくしゅう」リスト: クリアした 授業ごとに おぼえ度（★）・つぎの ふくしゅう日・まちがい数。タップで 授業を 見なおす
   - 入り口: ホームの チップ、ミナ先生の ページ、ミニ授業の 一覧。ときどき ミナ先生が 声を かける */
(()=>{
const {sfx:SFX}=BEACH;
const H=HE,esc=H.esc,$=id=>document.getElementById(id);
const today=()=>{const d=new Date();return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate()};
const dayN=t=>{const d=new Date(t);return Math.floor(Date.UTC(d.getFullYear(),d.getMonth(),d.getDate())/864e5)};
const GAPS=[1,3,7,14,30],MAXQ=8,PER=3,PERFECT=10,PAID_DAY=2;
const lesOf=id=>LESSONS.find(l=>l.id===id),cleared=()=>MINA.rec().les||{};
const shuffle=H.shuffle;

/* ---------- the record: the mistake notebook lives next to the recall quiz in MOTI's record ---------- */
const MV=()=>{const m=MOTI.rec();m.ms=m.ms||{};m.rd=m.rd||{d:'',n:0,ann:''};return m};
const miss=()=>MV().ms;
const missN=()=>Object.values(miss()).reduce((a,o)=>a+Object.keys(o).length,0);
function note(l,qi,ok){if(!l||!l.quiz[qi])return;const M=miss(),o=M[l.id]=M[l.id]||{};
  if(!ok)o[qi]={c:Math.min(3,((o[qi]||{}).c||0)+1),t:Date.now()};
  else if(o[qi]&&--o[qi].c<=0)delete o[qi];
  if(!Object.keys(o).length)delete M[l.id];save()}
/* every answer in a lesson's practice (game/lesson.js) and in the recall quiz (game/motivate.js) comes here */
(window.LESSON_ANS=window.LESSON_ANS||[]).push((l,qi,ok)=>note(l,qi,ok));

/* ---------- when each lesson is due ---------- */
const rvOf=id=>{const q=MV().qz;return q.rv[id]||{n:0,t:q.ct[id]||0}};
function nextDay(id){const r=rvOf(id);return dayN(r.t)+GAPS[Math.min(r.n,GAPS.length-1)]}
const isDue=id=>nextDay(id)<=dayN(Date.now());
const ids=()=>Object.keys(cleared()).filter(lesOf);
const dueIds=()=>ids().filter(isDue);
/* how many questions today's review has */
const todayN=()=>Math.min(MAXQ,missN()+dueIds().filter(id=>!miss()[id]).length*2);
const stars=id=>{const r=rvOf(id);return Math.min(5,r.n)};

/* ---------- build a drill ---------- */
function build(mode){const out=[],seen=new Set(),add=(id,qi)=>{const k=id+'#'+qi;if(seen.has(k)||out.length>=MAXQ)return;const l=lesOf(id);if(!l||!l.quiz[qi])return;seen.add(k);out.push({l,qi})};
  /* 1. the mistakes, the ones missed most first */
  Object.entries(miss()).flatMap(([id,o])=>Object.entries(o).map(([qi,v])=>[id,+qi,v.c+Math.random()*.5])).sort((a,b)=>b[2]-a[2]).forEach(([id,qi])=>add(id,qi));
  if(mode==='miss')return out;
  /* 2. lessons whose day has come: two questions each, the most overdue first */
  const now=dayN(Date.now());
  dueIds().sort((a,b)=>(nextDay(a)-now)-(nextDay(b)-now)+Math.random()-.5).forEach(id=>shuffle(lesOf(id).quiz.map((q,i)=>i)).slice(0,2).forEach(qi=>add(id,qi)));
  /* 3. "もっと れんしゅう": any cleared lesson, the least known first */
  if(mode==='more'||!out.length)shuffle(ids()).sort((a,b)=>stars(a)-stars(b)).forEach(id=>add(id,Math.random()*lesOf(id).quiz.length|0));
  return shuffle(out)}

/* the lesson's point: the first step with a figure (or Mina's last line), shown after a wrong answer */
function point(l){const s=l.steps.find(x=>x[3])||l.steps.filter(x=>x[0]==='m').pop();if(!s)return '';
  return `<div class="rvpt"><b>💡 授業の ポイント</b><p>${s[2]}</p>${s[3]?`<div class="fz">${s[3]}</div>`:''}</div>`}

/* ---------- the drill ---------- */
function drill(mode,back){back=back||list;const Q=build(mode);if(!Q.length){H.toast('📚 いまは ふくしゅうする 授業が ないよ<small>ミニ授業を クリアすると ふえるよ</small>');return}
  let k=0,okN=0;const res={};   // lesson id -> all right?
  const ask=()=>{const {l,qi}=Q[k],q=l.quiz[qi],wasMiss=!!(miss()[l.id]||{})[qi];
    const order=q.order?null:shuffle(q.o.map((o,i)=>i));
    H.show('review',`<section class="pnl lsn rvq">
      <div class="qtop"><button class="x" id="rx" aria-label="もどる">←</button><b>📚 ふくしゅう</b><span class="qn">${k+1}/${Q.length}</span></div>
      <i class="rvbar"><i style="width:${k/Q.length*100}%"></i></i>
      <p class="rvfrom">${wasMiss?'<span class="rvtag">❗ まえに まちがえた</span>':''}📖 ${esc(l.t)}</p>
      <div class="lsay by-m"><span class="lface">${MINA.face('m',wasMiss?'think':'smile')}</span><div class="lbody"><p>${esc(q.q)}</p></div></div>
      ${q.order?`<div class="lans" id="lans"></div><div class="lchips">${shuffle(q.order.map((c,i)=>[c,i])).map(([c,i])=>`<button data-c="${i}">${esc(c)}</button>`).join('')}</div>
        <div class="row"><button id="lreset" class="sub">もどす</button></div>`
      :`<div class="lopts">${order.map(i=>`<button data-o="${i}">${esc(q.o[i])}</button>`).join('')}</div>`}
      <div id="rfb"></div></section>`);
    $('rx').onclick=()=>{SFX.pop();back()};
    const fb=(ok,ans)=>{note(l,qi,ok);if(ok)okN++;res[l.id]=(res[l.id]!==false)&&ok;SFX[ok?'coin':'tie']();
      const left=(miss()[l.id]||{})[qi];
      $('rfb').innerHTML=`<div class="lsay by-m"><span class="lface">${MINA.face('m',ok?'happy':'worry')}</span><div class="lbody"><p>${ok
          ?(wasMiss?(left?'せいかい！ もう 1回 正解したら まちがいノート から きえるよ':'せいかい！ にがてを 1つ やっつけたね ✨'):MINA.pick(['せいかい！ ちゃんと おぼえてるね','そう！ ばっちり','その とおり！']))
          :'おしい！ こたえは <b>'+esc(ans)+'</b>。 まちがいノートに 入れておくね'}</p></div></div>
        ${ok?'':point(l)}
        <div class="row">${ok?'':`<button id="rles" class="sub">📖 授業を みなおす</button>`}<button id="rgo">${k+1<Q.length?'つぎ ▶':'おわり 🎉'}</button></div>`;
      $('rfb').scrollIntoView({block:'nearest',behavior:'smooth'});
      $('rgo').onclick=()=>{SFX.pop();k++;k<Q.length?ask():finish()};
      const rl=$('rles');if(rl)rl.onclick=()=>{SFX.vopen();LESSON.open(l.id,()=>{k++;k<Q.length?ask():finish()})}};
    if(q.order){const picked=[],ans=$('lans');
      const draw=()=>{ans.innerHTML=picked.map(i=>`<span>${esc(q.order[i])}</span>`).join(' ')||'<em>ことばを じゅんばんに タップ</em>'};draw();
      H.panel.querySelectorAll('[data-c]').forEach(b=>b.onclick=()=>{if(b.disabled)return;b.disabled=true;picked.push(+b.dataset.c);draw();SFX.pop();
        if(picked.length===q.order.length){const ok=picked.every((v,i)=>q.order[v]===q.order[i]);H.panel.querySelectorAll('[data-c],#lreset').forEach(x=>x.disabled=true);
          ans.classList.add(ok?'ok':'ng');fb(ok,q.order.join(' '))}});
      $('lreset').onclick=()=>{picked.length=0;H.panel.querySelectorAll('[data-c]').forEach(x=>x.disabled=false);draw()}}
    else H.panel.querySelectorAll('[data-o]').forEach(b=>b.onclick=()=>{const i=+b.dataset.o,ok=i===q.a;H.panel.querySelectorAll('[data-o]').forEach(x=>x.disabled=true);
      H.panel.querySelector(`[data-o="${q.a}"]`).classList.add('right');if(!ok)b.classList.add('wrong');fb(ok,q.o[q.a])})};
  const finish=()=>{const R=MV(),now=Date.now(),D=dayN(now);
    /* the spacing: a lesson whose day had come moves on a step if all its answers were right; any miss starts it over */
    Object.entries(res).forEach(([id,ok])=>{const r=rvOf(id);if(!ok)R.qz.rv[id]={n:0,t:now};else if(nextDay(id)<=D)R.qz.rv[id]={n:r.n+1,t:now}});
    if(R.rd.d!==today()){R.rd.d=today();R.rd.n=0}const paid=R.rd.n<PAID_DAY;R.rd.n++;save();
    const all=okN===Q.length,coin=paid?okN*PER+(all?PERFECT:0):0,mn=missN();
    H.show('review',`<section class="pnl lsn">
      <div class="lsay by-m big"><span class="lface">${MINA.face('m',all?'love':'proud')}</span><div class="lbody"><p>ふくしゅう おつかれさま！ <b>${okN}/${Q.length}</b> せいかい${all?'。 ぜんぶ おぼえてたね！':'。 まちがえた 問題は また 出すね'}
        ${coin?`<br>🪙<b>${coin}</b>まい${all?`（ぜんもん 正解 ボーナス +${PERFECT}）`:''}`:paid?'':'<br><small>きょうの ごほうびは おわり。 でも ふくしゅうは なんかいでも OK！</small>'}</p></div></div>
      <div class="rvsum">${Object.entries(res).map(([id,ok])=>{const l=lesOf(id);return `<span class="${ok?'ok':'ng'}">${ok?'⭕':'❌'} ${esc(l.t)} <small>${'★'.repeat(stars(id))}${'☆'.repeat(5-stars(id))}・つぎは ${when(id)}</small></span>`}).join('')}</div>
      ${mn?`<p class="note">❗ まちがいノート のこり ${mn}問</p>`:''}
      <div class="row">${mn?`<button id="rmiss" class="sub">❗ まちがいだけ もう一度</button>`:''}<button id="rlist">📚 ふくしゅう リスト</button></div>
    </section>`);
    SFX.fanfare(all?2:1);
    if(coin){const r=H.panel.getBoundingClientRect();setTimeout(()=>H.coinBurst(r.left+r.width/2,r.top+70,coin),300)}
    if(paid)setTimeout(()=>MOTI.gain(all?4:2),1200);
    $('rlist').onclick=()=>{SFX.pop();list()};const rm=$('rmiss');if(rm)rm.onclick=()=>{SFX.vopen();drill('miss',back)};
    chips()};
  ask()}

const when=id=>{const d=nextDay(id)-dayN(Date.now());return d<=0?'きょう':d===1?'あした':`${d}日後`};

/* ---------- the list of lessons taken ---------- */
function list(){const I=ids(),now=dayN(Date.now()),M=miss(),due=dueIds(),mn=missN(),n=todayN();
  const sorted=I.slice().sort((a,b)=>((M[b]?1:0)-(M[a]?1:0))||((nextDay(a)-now)-(nextDay(b)-now)));
  H.show('review',`<section class="pnl lsnp rvl">
    <div class="qtop"><button class="x" id="rx" aria-label="ミナ先生に もどる">←</button><b>📚 授業の ふくしゅう</b><span class="qn">${I.length}授業</span></div>
    <div class="rvhead">
      <p>${I.length?`まちがえた 問題と、ふくしゅうの 日が きた 授業を まとめて 出すよ。 1日・3日・7日・14日・30日 と あけて くりかえすと しっかり おぼえられるんだ`:'ミニ授業を クリアすると、ここで ふくしゅう できるように なるよ'}</p>
      ${I.length?`<button id="rgo" class="rvbig ${n?'':'sub'}">${n?`✏️ きょうの ふくしゅう <b>${n}問</b>`:'✨ きょうの ふくしゅうは ばっちり！ もっと れんしゅう する'}</button>
      ${mn?`<button id="rmiss" class="sub">❗ まちがいノート だけ（${mn}問）</button>`:''}`:''}
    </div>
    <div class="lslist">${sorted.map(id=>{const l=lesOf(id),s=stars(id),m=Object.keys(M[id]||{}).length,d=due.includes(id);
      return `<button class="lsrow rvrow ${d?'due':''}" data-rv="${id}"><span class="ci">${(typeof LESSON_ICO!=='undefined'&&LESSON_ICO[id])||'📖'}</span><span class="lt"><b>${esc(l.t)}</b><small><i class="rvst">${'★'.repeat(s)}${'☆'.repeat(5-s)}</i> つぎは ${when(id)}</small></span><span class="lp">${m?`<em class="rvm">❗${m}</em>`:''}${d?'<em class="rvd">ふくしゅう</em>':''}</span></button>`}).join('')}</div>
  </section>`);
  $('rx').onclick=()=>{SFX.pop();MINA.open()};
  const g=$('rgo');if(g)g.onclick=()=>{SFX.vopen();drill(n?'today':'more',list)};
  const m=$('rmiss');if(m)m.onclick=()=>{SFX.vopen();drill('miss',list)};
  H.panel.querySelectorAll('[data-rv]').forEach(b=>b.onclick=()=>{SFX.vopen();LESSON.open(b.dataset.rv,list)})}

/* ---------- the doors: Mina's page, the lesson list, the end of a lesson, the home chip ---------- */
new MutationObserver(()=>{
  const box=H.panel.querySelector('.minap .mvbox');
  if(box&&!box.querySelector('[data-rvo]')){const n=todayN(),b=document.createElement('button');b.className='mvc rv';b.dataset.rvo=1;
    b.innerHTML=`<span>📚 授業の ふくしゅう</span><b>${n?`きょう ${n}問`:'ばっちり ✨'}</b>`;b.onclick=()=>{SFX.vopen();list()};
    const c=box.querySelector('[data-v="cards"]');c?c.before(b):box.appendChild(b)}
  const lp=H.panel.querySelector('.lsnp:not(.rvl)');
  if(lp&&!lp.querySelector('.rvopen')&&ids().length){const n=todayN(),b=document.createElement('button');b.className='rvopen sub';
    b.innerHTML=`📚 授業の ふくしゅう ${n?`<b>きょう ${n}問</b>`:'（ばっちり ✨）'}`;b.onclick=()=>{SFX.vopen();list()};const s=lp.querySelector('.seg');s?s.before(b):lp.appendChild(b)}
}).observe(H.panel,{childList:true});
/* the lesson's prize box: say where the missed questions went */
LESSON_AFTER.push((l,info)=>{if(!info.miss)return null;const m=Object.keys(miss()[l.id]||{}).length;if(!m)return null;
  return {html:`<span>📚 まちがえた ${m}問は 「まちがいノート」に 入れたよ。 ふくしゅうで また 出すね</span>`}});
/* a chip on the home screen when something is waiting (shown with the other chips of game/motivate.js) */
(window.MOTI_CHIPS=window.MOTI_CHIPS||[]).push(()=>{const n=todayN(),R=MV();if(!n||R.rd.d===today()&&R.rd.n)return null;
  return {cls:'rv',a:'📚 授業の ふくしゅう',b:`${n}問${missN()?`（❗${missN()}）`:''}`,go:()=>drill('today',H.home)}});
const chips=()=>{if(H.screen==='home'&&window.MOTI&&MOTI.chips)MOTI.chips()};

/* now and then Mina calls for it: once a day, when there is enough to review */
let homeT=0,lastT=performance.now(),callAt=(9+Math.random()*5)*60000;
setInterval(()=>{const now=performance.now(),dt=now-lastT;lastT=now;if(document.hidden||H.screen!=='home')return;homeT+=dt;
  if(homeT<callAt)return;const R=MV();if(R.rd.ann===today()||R.rd.d===today()&&R.rd.n){callAt=homeT+30*60000;return}
  if(!MINA.canAnnounce()||MINA.sinceAnn()<90000||(window.BONUS&&BONUS.active()))return;const n=todayN();callAt=homeT+20*60000;if(n<3)return;
  R.rd.ann=today();save();const mn=missN();
  MINA.announce('think',mn?`📚 ふくしゅうの 時間だよ。 まえに まちがえた 問題が <b>${mn}問</b> あるの。 いっしょに やっつけよう！ わたしの 顔を タップしてね`
    :`📚 そろそろ ふくしゅうの 日の 授業が あるよ。 <b>${n}問</b>だけ、 思い出してみよう！ わたしの 顔を タップしてね`,10000,()=>drill('today',H.home))},1000);

window.REVIEW={list,drill,todayN,missN,dueIds,stars,nextDay,dayN,_test:{due:id=>{const R=MV();R.qz.rv[id]={n:0,t:Date.now()-864e5*2};save()},call:()=>{callAt=homeT}}};
})();
