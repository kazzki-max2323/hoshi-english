/* ミナ先生の ミニ授業: 図解・覚え方・勉強のやり方・音・ハマ子の語呂。ミナ先生の ページから ひらく。
   いまの力（レベル）と 苦手から おすすめを えらぶ。説明 → 小さな れんしゅう → 初めての クリアで コイン少し。
   中身は game/lessons/*.js（LESSONS） */
(()=>{
const {S:ST,sfx:SFX}=BEACH;
const H=HE,esc=H.esc,$=id=>document.getElementById(id);
const LV=['es','jh','hs','adv'],LVN={es:'小学生',jh:'中学生',hs:'高校生',adv:'ハイレベル'};
const CAT={zu:['🖼️','図解で 分かる'],kotsu:['💡','覚え方の コツ'],yarikata:['📝','勉強の やり方'],oto:['👄','音と 発音'],hama:['🍬','ハマ子の 語呂'],kagaku:['🧠','学び方の 科学']};
const PAY={es:10,jh:15,hs:20,adv:20};   // coins for the first clear of a lesson

/* cleared lessons live in the tutor's record */
const done=()=>{const m=MINA.rec();return m.les=m.les||{}};
const shuffle=H.shuffle;

/* what to suggest: lessons for the player's level (and one below), matching weak points first */
function suggest(n=3){const est=LV.indexOf(MINA.level()),weak=MINA.weakKeys(),D=done();
  const sc=l=>{const i=LV.indexOf(l.lv);let s=Math.random();if(i===est)s+=3;else if(i===est-1)s+=1.5;else if(i===est+1)s+=.5;else s-=3;
    if((l.key||[]).some(k=>weak.some(w=>w&&(w.includes(k)||k.includes(w)))))s+=5;if(D[l.id])s-=6;return s};
  return LESSONS.slice().sort((a,b)=>sc(b)-sc(a)).slice(0,n)}

/* ---------- きょうの 授業: 1日 1つ。ホームと ミナ先生の ページで 同じ 授業を 大きく 見せる ---------- */
const dk=d=>{d=d||new Date();return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate()};
const yest=()=>{const d=new Date();d.setDate(d.getDate()-1);return dk(d)};
const lesOf=id=>LESSONS.find(l=>l.id===id);
/* the pick stays for the day; once it is cleared, the next one comes (lt.c = it was already cleared when picked) */
function today(){const m=MINA.rec(),D=done(),t=dk(),lt=m.lt;
  if(lt&&lt.d===t&&lesOf(lt.id)&&(!D[lt.id]||lt.c))return lesOf(lt.id);
  const s=suggest(8),l=s.find(x=>!D[x.id])||s[0];if(!l)return null;m.lt={d:t,id:l.id,c:D[l.id]?1:0};save();return l}
/* lesson days in a row: ls = {d: the last day with a lesson, n: days in a row, best} */
const doneToday=()=>(MINA.rec().ls||{}).d===dk();
function streak(){const s=MINA.rec().ls;return s&&(s.d===dk()||s.d===yest())?s.n:0}
function mark(){const m=MINA.rec(),s=m.ls||{d:'',n:0,best:0},t=dk();if(s.d===t)return 0;const n=s.d===yest()?s.n+1:1;m.ls={d:t,n,best:Math.max(n,s.best||0)};save();return n}
const STK={3:30,7:70,14:140,21:210,30:300};   // coins for days in a row
const stkPay=n=>STK[n]||(n>30&&n%30===0?300:0);
/* the big card: tap = the lesson right away */
function card(where){const l=today();if(!l)return '';const c=CAT[l.cat]||CAT.zu,sk=streak(),dt=doneToday(),B=where==='home'&&window.BONUS&&BONUS.now?BONUS.now():null;
  /* 🔥 れんぞくは 小さな ラベルに。ホームを 低く たもって 浜辺（たき火）が 見えるように */
  const fire=sk?`<span class="lcfire">🔥 ${sk}日${dt?'':` → ${sk+1}日`}</span>`:'';
  return `<div class="lcard2${dt?' done':''}${B?' hot':''}" id="lcard">
    ${B?`<p class="lchot">⏰ 授業タイム <b class="bcount">${B.left}</b><span>🎁 ${B.label}</span></p>`:''}
    <button class="lcgo" data-les="${l.id}"><span class="lcico">${c[0]}</span>
      <span class="lctx"><small>${dt?'✅ クリア！ つぎは':'📖 きょうの 授業'}${fire}</small><b>${esc(l.t)}</b></span>
      <span class="lcplay">${dt?'もう1つ':'はじめる'} ▶</span></button>
  </div>`}
function bindCard(back){const c=$('lcard');if(!c)return;c.querySelector('.lcgo').onclick=()=>{SFX.lesson();open(c.querySelector('.lcgo').dataset.les,back)};
  const a=$('lcall');if(a)a.onclick=()=>{SFX.lesson();list()}}
/* on the home screen it sits right above the buttons (単語帳・ショップ…) */
function onHome(){const v=H.panel.querySelector('.home .row');if(!v)return;const o=$('lcard');if(o)o.remove();v.insertAdjacentHTML('beforebegin',card('home'));bindCard(H.home)}
H.on('home',onHome);if(H.screen==='home')setTimeout(onHome,0);
const refresh=()=>{if(H.screen==='home')onHome()};

/* ---------- the list of all lessons ---------- */
let listLv=null;
function list(){listLv=listLv||MINA.level();const D=done(),L=LESSONS.filter(l=>l.lv===listLv);
  H.show('lessons',`<section class="pnl lsnp">
    <div class="qtop"><button class="x" id="lx" aria-label="ミナ先生に もどる">←</button><b>📖 ミナの ミニ授業</b><span class="qn">✅ ${LESSONS.filter(l=>D[l.id]).length}/${LESSONS.length}</span></div>
    <div class="seg">${LV.map(k=>`<button data-l="${k}" class="${k===listLv?'on':''}">${LVN[k]}</button>`).join('')}</div>
    <div class="lslist">${L.map(row).join('')||'<p class="note">まだ ないよ</p>'}</div>
  </section>`);
  $('lx').onclick=()=>{SFX.pop();MINA.open()};
  H.panel.querySelectorAll('[data-l]').forEach(b=>b.onclick=()=>{SFX.pop();listLv=b.dataset.l;list()});
  bindRows(list)}
const row=l=>{const D=done(),c=CAT[l.cat]||CAT.zu;return `<button class="lsrow ${D[l.id]?'clear':''}" data-les="${l.id}"><span class="ci">${D[l.id]?'✅':c[0]}</span><span class="lt"><b>${esc(l.t)}</b><small>${c[1]}・${LVN[l.lv]}</small></span><span class="lp">${D[l.id]?'クリア':'🪙'+PAY[l.lv]}</span></button>`};
function bindRows(back){H.panel.querySelectorAll('[data-les]').forEach(b=>b.onclick=()=>{SFX.lesson();open(b.dataset.les,back)})}

/* ---------- one lesson: the talk, then a little practice ---------- */
function open(id,back){const l=LESSONS.find(x=>x.id===id);if(!l)return;back=back||MINA.open;let k=0;
  H.show('lesson',`<section class="pnl lsn">
    <div class="qtop"><button class="x" id="lx" aria-label="もどる">←</button><b>${(CAT[l.cat]||CAT.zu)[0]} ${esc(l.t)}</b><span class="qn">${LVN[l.lv]}</span></div>
    <div class="lslog" id="llog"></div>
    <div class="row"><button id="lnext">つぎへ ▶</button></div>
  </section>`);
  $('lx').onclick=()=>{SFX.pop();back()};
  const log=$('llog');
  const step=()=>{if(k>=l.steps.length){quiz(l,back);return}const [who,ex,tx,fig]=l.steps[k++];
    const d=document.createElement('div');d.className='lsay by-'+who;
    d.innerHTML=`<span class="lface">${MINA.face(who,ex)}</span><div class="lbody"><p>${tx}</p>${fig?`<div class="fz">${fig}</div>`:''}</div>`;
    log.appendChild(d);SFX.pop();log.scrollTo({top:log.scrollHeight,behavior:'smooth'});
    $('lnext').textContent=k>=l.steps.length?'れんしゅう ✏️':'つぎへ ▶'};
  $('lnext').onclick=step;log.onclick=step;step()}

function quiz(l,back){let k=0,miss=0;
  const ask=()=>{const q=l.quiz[k];
    H.show('lesson',`<section class="pnl lsn">
      <div class="qtop"><button class="x" id="lx" aria-label="もどる">←</button><b>✏️ ${esc(l.t)}</b><span class="qn">${k+1}/${l.quiz.length}</span></div>
      <div class="lsay by-m"><span class="lface">${MINA.face('m','smile')}</span><div class="lbody"><p>${esc(q.q)}</p></div></div>
      ${q.order?`<div class="lans" id="lans"></div><div class="lchips">${shuffle(q.order.map((c,i)=>[c,i])).map(([c,i])=>`<button data-c="${i}">${esc(c)}</button>`).join('')}</div>
        <div class="row"><button id="lreset" class="sub">もどす</button></div>`
      :`<div class="lopts">${q.o.map((o,i)=>`<button data-o="${i}">${esc(o)}</button>`).join('')}</div>`}
      <div id="lfb"></div>
    </section>`);
    $('lx').onclick=()=>{SFX.pop();back()};
    const fb=(ok,ans)=>{if(!ok)miss++;SFX[ok?'correct':'wrong']();(window.LESSON_ANS||[]).forEach(f=>{try{f(l,k,ok,'lesson')}catch(e){console.error(e)}});
      $('lfb').innerHTML=`<div class="lsay by-m"><span class="lface">${MINA.face('m',ok?'happy':'worry')}</span><div class="lbody"><p>${ok?MINA.pick(['せいかい！ ばっちり','そう！ よく できたね','すごい、 その とおり']):'おしい！ こたえは <b>'+esc(ans)+'</b> だよ'}</p></div></div>
        <div class="row"><button id="lgo">${k+1<l.quiz.length?'つぎの もんだい ▶':'おわり 🎉'}</button></div>`;
      $('lgo').onclick=()=>{k++;k<l.quiz.length?ask():finish()}};
    if(q.order){const picked=[];const ans=$('lans');
      const draw=()=>{ans.innerHTML=picked.map(i=>`<span>${esc(q.order[i])}</span>`).join(' ')||'<em>ことばを じゅんばんに タップ</em>'};draw();
      H.panel.querySelectorAll('[data-c]').forEach(b=>b.onclick=()=>{if(b.disabled)return;b.disabled=true;picked.push(+b.dataset.c);draw();SFX.pop();
        if(picked.length===q.order.length){const ok=picked.every((v,i)=>q.order[v]===q.order[i]);H.panel.querySelectorAll('[data-c],#lreset').forEach(x=>x.disabled=true);
          ans.classList.add(ok?'ok':'ng');fb(ok,q.order.join(' '))}});
      $('lreset').onclick=()=>{picked.length=0;H.panel.querySelectorAll('[data-c]').forEach(x=>x.disabled=false);draw()}}
    else H.panel.querySelectorAll('[data-o]').forEach(b=>b.onclick=()=>{const i=+b.dataset.o,ok=i===q.a;H.panel.querySelectorAll('[data-o]').forEach(x=>x.disabled=true);
      H.panel.querySelector(`[data-o="${q.a}"]`).classList.add('right');if(!ok)b.classList.add('wrong');fb(ok,q.o[q.a])})};
  const finish=()=>{const D=done(),first=!D[l.id];D[l.id]=1;save();const sk=mark(),pay=first?PAY[l.lv]:0,nx=suggest(4).filter(x=>x.id!==l.id)[0];
    /* extra prizes from game/bonus.js and game/motivate.js: each gives {html, after} or nothing */
    const info={first,miss,n:l.quiz.length,pay,sk},ext=LESSON_AFTER.map(f=>{try{return f(l,info)}catch(e){console.error(e);return null}}).filter(Boolean);
    /* この授業の 文法を 文法テストで ためす（game/gram-link.js） */
    let gk=null;try{gk=window.GRAMLINK&&GRAMLINK.afterLesson(l)}catch(e){console.error(e)}
    H.show('lesson',`<section class="pnl lsn">
      <div class="lsay by-m big"><span class="lface">${MINA.face('m','proud')}</span><div class="lbody"><p>「${esc(l.t)}」 おつかれさま！ ${miss?`${l.quiz.length-miss}/${l.quiz.length} せいかい。 また ふくしゅう しようね`:'ぜんもん せいかい！'}${pay?`<br>ごほうびに 🪙<b>${pay}</b>まい`:''}</p></div></div>
      ${gk?gk.html:''}
      ${ext.length?`<div class="bwin"><b class="bt">🎁 ごほうび</b>${ext.map(x=>`<div class="brow">${x.html}</div>`).join('')}</div>`:''}
      ${nx?`<p class="note">つぎの 授業も やってみる？</p>${row(nx)}`:''}
      <div class="row"><button id="lagain" class="sub">もう一度</button><button id="lback">${back===H.home?'ホームへ':'ミナ先生へ'}</button></div>
    </section>`);
    SFX.done();if(pay){const r=H.panel.getBoundingClientRect();setTimeout(()=>H.coinBurst(r.left+r.width/2,r.top+70,pay),300)}
    $('lagain').onclick=()=>{SFX.pop();open(l.id,back)};$('lback').onclick=()=>{SFX.pop();back===H.home?H.home():MINA.open()};bindRows(back);if(gk)gk.bind();ext.forEach(x=>{try{x.after&&x.after()}catch(e){console.error(e)}})};
  ask()}

window.LESSON_AFTER=window.LESSON_AFTER||[];
/* the first lesson of the day: days in a row, and coins on 3・7・14・21・30 days */
LESSON_AFTER.push((l,info)=>{const n=info.sk;if(!n)return null;const c=stkPay(n),[,tx]=MINA.line(c?'les_streakGift':n>=2?'les_streak':'les_streak1',{n,n1:n+1,c});
  if(c){window.MOTI?MOTI.coins(c):setTimeout(()=>H.addCoins(c),700)}
  return {html:`<span class="lstk">🔥 授業 <b>${n}日</b> れんぞく${c?`　🪙<b>${c}</b>まい`:''}<small>${tx}</small></span>`}});
window.LESSON={suggest,list,open,row,bindRows,PAY,today,card,bindCard,refresh,streak,doneToday,count:()=>[LESSONS.filter(l=>done()[l.id]).length,LESSONS.length]};
})();
