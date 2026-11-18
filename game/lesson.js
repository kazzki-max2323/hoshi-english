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
function card(where){const l=today();if(!l)return '';const c=CAT[l.cat]||CAT.zu,dt=doneToday(),B=where==='home'&&window.BONUS&&BONUS.now?BONUS.now():null;
  /* 🔥 れんぞく日数は カードに 出さない（ユーザーの 希望。れんぞくの ごほうびと セリフは そのまま） */
  return `<div class="lcard2${dt?' done':''}${B?' hot':''}" id="lcard">
    ${B?`<p class="lchot">⏰ 授業タイム <b class="bcount">${B.left}</b><span>🎁 ${B.label}</span></p>`:''}
    <button class="lcgo" data-les="${l.id}"><span class="lcico">${c[0]}</span>
      <span class="lctx"><small>${dt?'✅ クリア！ つぎは':'📖 きょうの 授業'}</small><b>${esc(l.t)}</b></span>
      <span class="lcplay">${dt?'もう1つ':'はじめる'} ▶</span></button>
  </div>`}
function bindCard(back){const c=$('lcard');if(!c)return;c.querySelector('.lcgo').onclick=()=>{SFX.lesson();open(c.querySelector('.lcgo').dataset.les,back)};
  const a=$('lcall');if(a)a.onclick=()=>{SFX.lesson();list()}}
/* on the home screen it sits right above the buttons (単語帳・カード…) */
function onHome(){const v=H.panel.querySelector('.home .row');if(!v)return;const o=$('lcard');if(o)o.remove();v.insertAdjacentHTML('beforebegin',card('home'));bindCard(H.home)}
H.on('home',onHome);if(H.screen==='home')setTimeout(onHome,0);
const refresh=()=>{if(H.screen==='home')onHome()};

/* ---------- the list of all lessons ---------- */
let listLv=null;
function list(){listLv=listLv||MINA.level();const D=done(),L=LESSONS.filter(l=>l.lv===listLv);
  H.show('lessons',`<section class="pnl lsnp">
    <div class="qtop"><button class="x" id="lx" aria-label="ミナ先生に もどる">←</button><b>📖 ミナの ミニ授業</b><span></span></div>
    <div class="seg">${LV.map(k=>`<button data-l="${k}" class="${k===listLv?'on':''}">${LVN[k]}</button>`).join('')}</div>
    <div class="lslist">${L.map(row).join('')||'<p class="note">まだ ないよ</p>'}</div>
  </section>`);
  $('lx').onclick=()=>{SFX.pop();MINA.open()};
  H.panel.querySelectorAll('[data-l]').forEach(b=>b.onclick=()=>{SFX.pop();listLv=b.dataset.l;list()});
  bindRows(list)}
const row=l=>{const D=done(),c=CAT[l.cat]||CAT.zu;return `<button class="lsrow ${D[l.id]?'clear':''}" data-les="${l.id}"><span class="ci">${D[l.id]?'✅':c[0]}</span><span class="lt"><b>${esc(l.t)}</b><small>${c[1]}・${LVN[l.lv]}</small></span><span class="lp">${D[l.id]?'クリア':'🪙'+PAY[l.lv]}</span></button>`};
function bindRows(back){H.panel.querySelectorAll('[data-les]').forEach(b=>b.onclick=()=>{SFX.lesson();open(b.dataset.les,back)})}

/* ---------- one lesson ----------
   さいしょに 説明なしで 1問（できたら 説明を とばせる・まちがえたら 説明から）
   → 説明は 1画面 1まいの カードを めくる（前に 習った 文法と くらべる カードから 入る ことも）。 「？」で もっと やさしく
   → れんしゅう（「？」で ヒント・まちがえたら 「それは 〜と 思ったからかな？」）。 しくみの 道具は game/study.js */
const S=()=>window.STUDY;
function open(id,back){const l=LESSONS.find(x=>x.id===id);if(!l)return;back=back||MINA.open;
  const st={help:0,stg:S()?S().stage(l):0};
  if(S()&&l.quiz.length>=2&&!l.quiz[0].order)return pre(l,back,st);
  cards(l,back,st,null)}
const head=(l,right)=>`<div class="qtop"><button class="x" id="lx" aria-label="もどる">←</button><b>${(CAT[l.cat]||CAT.zu)[0]} ${esc(l.t)}</b><span class="qn">${right}</span></div>`;
const mSay=(ex,html,cls)=>`<div class="lsay by-m ${cls||''}"><span class="lface">${MINA.face('m',ex)}</span><div class="lbody"><p>${html}</p></div></div>`;

/* 説明なしで 1問 */
function pre(l,back,st){const q=l.quiz[0];
  H.show('lesson',`<section class="pnl lsn lpre">${head(l,'いきなり 1問')}
    ${mSay('wow',S().en('pre',st.stg))}
    ${mSay('smile',esc(q.q))}
    <div class="lopts">${q.o.map((o,i)=>`<button data-o="${i}">${esc(o)}</button>`).join('')}</div>
    <div id="lfb"></div>
    <div class="row"><button id="lskip" class="sub">わからない → 説明を 見る</button></div>
  </section>`);
  $('lx').onclick=()=>{SFX.pop();back()};
  $('lskip').onclick=()=>{SFX.pop();cards(l,back,st,null)};
  H.panel.querySelectorAll('[data-o]').forEach(b=>b.onclick=()=>{const i=+b.dataset.o,ok=i===q.a;H.panel.querySelectorAll('[data-o]').forEach(x=>x.disabled=true);
    H.panel.querySelector(`[data-o="${q.a}"]`).classList.add('right');if(!ok)b.classList.add('wrong');SFX[ok?'correct':'wrong']();$('lskip').parentNode.remove();
    $('lfb').innerHTML=ok?`${mSay('love',S().en('preOk',st.stg))}<div class="row"><button id="lcard" class="sub">説明も 見る</button><button id="lgo">れんしゅうへ ▶</button></div>`
      :`${S().whyBox(q.q,q.o[i],q.o[q.a],{l})}${mSay('smile',S().en('preNg',st.stg))}<div class="row"><button id="lgo">説明へ ▶</button></div>`;
    $('lfb').scrollIntoView({block:'nearest',behavior:'smooth'});
    $('lgo').onclick=()=>{SFX.step();ok?quiz(l,back,st,l.quiz.map((x,j)=>j).slice(1)):cards(l,back,st,null)};
    const c=$('lcard');if(c)c.onclick=()=>{SFX.pop();cards(l,back,st,l.quiz.map((x,j)=>j).slice(1))}})}

/* 説明: 1画面に 1まい。 タップ・スワイプ・つぎへ で めくる */
function cards(l,back,st,qs){const C=[],cmp=S()?S().cmpCard(l):null;
  if(cmp)C.push({cmp});l.steps.forEach(s=>C.push({s}));let k=0,help=0;
  H.show('lesson',`<section class="pnl lsn lcards">${head(l,`<span id="lcn"></span>`)}
    <div class="lcdots" id="lcdots">${C.map(()=>'<i></i>').join('')}</div>
    <div class="lcd" id="lcd"></div>
    <div class="lhelp" id="lhelp"></div>
    <div class="row lcnav"><button id="lprev" class="sub" aria-label="まえの カード">◀</button><button id="lq" class="lqbtn" aria-label="もっと かんたんに">？</button><button id="lnext">つぎへ ▶</button></div>
  </section>`);
  $('lx').onclick=()=>{SFX.pop();back()};
  const draw=()=>{const c=C[k],d=$('lcd');help=0;$('lhelp').innerHTML='';
    if(c.cmp)d.innerHTML=`<div class="lsay by-m big lcmp"><span class="lface">${MINA.face('m','smile')}</span><div class="lbody">${c.cmp.html}</div></div>`;
    else{const [who,ex,tx,fig]=c.s,first=k===(cmp?1:0),last=k===C.length-1,E=S()&&st.stg&&(first||last)?S().en(last?'end':'card',st.stg):'';
      d.innerHTML=`<div class="lsay by-${who} big"><span class="lface">${MINA.face(who,ex,MINA.poseFor(ex,tx))}</span><div class="lbody">${E&&who==='m'?`<p class="lcen">${E}</p>`:''}<p>${tx}</p>${fig?`<div class="fz">${fig}</div>`:''}</div></div>`}
    d.classList.remove('lflip');void d.offsetWidth;d.classList.add('lflip');
    $('lcn').textContent=`${k+1}/${C.length}`;$('lcdots').querySelectorAll('i').forEach((x,i)=>x.className=i<k?'ok':i===k?'now':'');
    $('lprev').disabled=!k;$('lnext').textContent=k>=C.length-1?'れんしゅう ✏️':'つぎへ ▶';$('lq').hidden=!!c.cmp||!S()};
  const go=d=>{if(d<0&&!k)return;if(d>0&&k>=C.length-1){quiz(l,back,st,qs||l.quiz.map((x,j)=>j));return}k+=d;SFX.flip?SFX.flip():SFX.pop();draw()};
  $('lnext').onclick=()=>go(1);$('lprev').onclick=()=>go(-1);
  /* 「？」: おすたびに もっと やさしく */
  $('lq').onclick=()=>{SFX.pop();const c=C[k];if(!c.s)return;st.help++;$('lhelp').innerHTML=S().easy(l,c.s,help);help=Math.min(help+1,3);$('lhelp').scrollIntoView({block:'nearest',behavior:'smooth'})};
  const cd=$('lcd');let x0=null;
  cd.onpointerdown=e=>{x0=e.clientX};
  cd.onpointerup=e=>{if(x0==null)return;const dx=e.clientX-x0;x0=null;if(Math.abs(dx)>40)go(dx<0?1:-1);else if(!e.target.closest('button,a'))go(1)};
  draw()}

/* れんしゅう（qs = 出す 問題の 番号） */
function quiz(l,back,st,qs){st=st||{help:0,stg:0};qs=qs&&qs.length?qs:l.quiz.map((x,j)=>j);let n=0,miss=0;
  const ask=()=>{const k=qs[n],q=l.quiz[k];let hint=0,hinted=false;
    H.show('lesson',`<section class="pnl lsn">${head(l,`✏️ ${n+1}/${qs.length}`)}
      ${mSay('smile',esc(q.q))}
      ${q.order?`<div class="lans" id="lans"></div><div class="lchips">${shuffle(q.order.map((c,i)=>[c,i])).map(([c,i])=>`<button data-c="${i}">${esc(c)}</button>`).join('')}</div>
        <div class="row"><button id="lreset" class="sub">もどす</button></div>`
      :`<div class="lopts">${q.o.map((o,i)=>`<button data-o="${i}">${esc(o)}</button>`).join('')}</div>`}
      <div id="lhint"></div>
      <div id="lfb"></div>
      ${S()?`<div class="row lqrow"><button id="lq" class="lqbtn" aria-label="ヒント">？</button></div>`:''}
    </section>`);
    $('lx').onclick=()=>{SFX.pop();back()};
    /* 「？」: 1. ちがう ものを 1つ 消す 2. 授業の その ところを 見せる 3. こたえを いっしょに 見る */
    const lq=$('lq');if(lq)lq.onclick=()=>{SFX.pop();st.help++;hinted=true;const L=MINA_LINES.st_qHint||[],h=Math.min(hint,2),line=L[h]||['smile',''];let extra='';
      if(h===0&&!q.order){const w=shuffle(q.o.map((o,i)=>i).filter(i=>i!==q.a)).find(i=>{const b=H.panel.querySelector(`[data-o="${i}"]`);return b&&!b.disabled});if(w!=null){const b=H.panel.querySelector(`[data-o="${w}"]`);b.disabled=true;b.classList.add('gone')}}
      else if(h<=1){const ans=q.order?q.order.join(' '):q.o[q.a],stp=l.steps.find(x=>String(x[2]).toLowerCase().includes(String(ans).toLowerCase()))||l.steps.find(x=>x[3])||l.steps[0];extra=`<p class="steb">${stp[2]}</p>${stp[3]?`<div class="fz">${stp[3]}</div>`:''}`}
      else{extra=`<p class="steb">こたえは <b>${esc(q.order?q.order.join(' '):q.o[q.a])}</b>。 いっしょに 声に 出して みよう</p>`}
      hint++;$('lhint').innerHTML=`<div class="steasy"><span class="lface">${MINA.face('m',line[0])}</span><div><p>${esc(line[1])}</p>${extra}</div></div>`;$('lhint').scrollIntoView({block:'nearest',behavior:'smooth'})};
    const fb=(ok,ans,ch)=>{if(!ok)miss++;SFX[ok?'correct':'wrong']();if(lq)lq.parentNode.remove();(window.LESSON_ANS||[]).forEach(f=>{try{f(l,k,ok,'lesson')}catch(e){console.error(e)}});
      const E=S()?S().en(ok?'ok':'ng',st.stg):'';
      $('lfb').innerHTML=(ok?mSay('happy',E||MINA.pick(['せいかい！ ばっちり','そう！ よく できたね','すごい、 その とおり']))
        :mSay('worry',`${E?E+'<br>':''}こたえは <b>${esc(ans)}</b> だよ`)+(S()?S().whyBox(q.q,ch,ans,{l,order:!!q.order}):''))
        +`<div class="row"><button id="lgo">${n+1<qs.length?'つぎの もんだい ▶':'おわり 🎉'}</button></div>`;
      $('lfb').scrollIntoView({block:'nearest',behavior:'smooth'});
      $('lgo').onclick=()=>{n++;n<qs.length?ask():finish()}};
    if(q.order){const picked=[];const ans=$('lans');
      const draw=()=>{ans.innerHTML=picked.map(i=>`<span>${esc(q.order[i])}</span>`).join(' ')||'<em>ことばを じゅんばんに タップ</em>'};draw();
      H.panel.querySelectorAll('[data-c]').forEach(b=>b.onclick=()=>{if(b.disabled)return;b.disabled=true;picked.push(+b.dataset.c);draw();SFX.pop();
        if(picked.length===q.order.length){const ok=picked.every((v,i)=>q.order[v]===q.order[i]);H.panel.querySelectorAll('[data-c],#lreset').forEach(x=>x.disabled=true);
          ans.classList.add(ok?'ok':'ng');fb(ok,q.order.join(' '),picked.map(i=>q.order[i]).join(' '))}});
      $('lreset').onclick=()=>{picked.length=0;H.panel.querySelectorAll('[data-c]').forEach(x=>x.disabled=false);draw()}}
    else H.panel.querySelectorAll('[data-o]').forEach(b=>b.onclick=()=>{const i=+b.dataset.o,ok=i===q.a;H.panel.querySelectorAll('[data-o]').forEach(x=>x.disabled=true);
      H.panel.querySelector(`[data-o="${q.a}"]`).classList.add('right');if(!ok)b.classList.add('wrong');fb(ok,q.o[q.a],q.o[i])})};
  const finish=()=>{const D=done(),first=!D[l.id];D[l.id]=1;save();const sk=mark(),pay=first?PAY[l.lv]:0,nx=suggest(4).filter(x=>x.id!==l.id)[0],N=qs.length;
    /* extra prizes from game/bonus.js and game/motivate.js: each gives {html, after} or nothing */
    const info={first,miss,n:N,pay,sk},ext=LESSON_AFTER.map(f=>{try{return f(l,info)}catch(e){console.error(e);return null}}).filter(Boolean);
    /* この授業の 文法を 文法テストで ためす（game/gram-link.js） */
    let gk=null;try{gk=window.GRAMLINK&&GRAMLINK.afterLesson(l)}catch(e){console.error(e)}
    /* 数字より できるように なった こと（game/study.js）。 まちがいが あれば とっくん、 「？」を たくさん おしたら とことん授業を さそう */
    const can=S()?S().lessonCan(l):'',gid=S()?S().gidOf(l):null,E=S()&&st.stg?S().en('end',st.stg):'';
    const msg=can&&!miss?`${E?E+'<br>':''}「${esc(l.t)}」 クリア！ ${can}`:MINA_LINES.les_endP?MINA.line(miss?'les_endM':'les_endP',{t:l.t,ok:N-miss,n:N})[1]:`「${esc(l.t)}」 おつかれさま！`;
    const sug=gid&&miss&&window.SENSEI?['st_tokSug','🎯 5問 とっくん',()=>SENSEI.tokkun([gid],0,'mina')]:gid&&st.help>=3&&window.DEEP?['st_qDeep','🔎 とことん授業で 見る',()=>DEEP.open(gid)]:null;
    H.show('lesson',`<section class="pnl lsn">
      <div class="lsay by-m big"><span class="lface">${MINA.face('m','proud')}</span><div class="lbody"><p>${msg}${pay?`<br>ごほうびに 🪙<b>${pay}</b>まい`:''}</p></div></div>
      ${sug?`<div class="lsay by-m lsug"><span class="lface">${MINA.face('m','think')}</span><div class="lbody"><p>${MINA.line(sug[0])[1]}</p><button id="lsug" class="sub">${sug[1]}</button></div></div>`:''}
      ${gk?gk.html:''}
      ${ext.length?`<div class="bwin"><b class="bt">🎁 ごほうび</b>${ext.map(x=>`<div class="brow">${x.html}</div>`).join('')}</div>`:''}
      ${nx?`<p class="note">つぎの 授業も やってみる？</p>${row(nx)}`:''}
      <div class="row"><button id="lagain" class="sub">もう一度</button><button id="lback" data-back>${back===H.home?'ホームへ':'ミナ先生へ'}</button></div>
    </section>`);
    SFX.done();if(pay){const r=H.panel.getBoundingClientRect();setTimeout(()=>H.coinBurst(r.left+r.width/2,r.top+70,pay),300)}
    const ls=$('lsug');if(ls)ls.onclick=()=>{SFX.step();sug[2]()};
    $('lagain').onclick=()=>{SFX.pop();open(l.id,back)};$('lback').onclick=()=>{SFX.pop();back===H.home?H.home():MINA.open()};bindRows(back);if(gk)gk.bind();ext.forEach(x=>{try{x.after&&x.after()}catch(e){console.error(e)}})};
  ask()}

window.LESSON_AFTER=window.LESSON_AFTER||[];
/* the first lesson of the day: days in a row, and coins on 3・7・14・21・30 days */
LESSON_AFTER.push((l,info)=>{const n=info.sk;if(!n)return null;const c=stkPay(n),[,tx]=MINA.line(c?'les_streakGift':n>=2?'les_streak':'les_streak1',{n,n1:n+1,c});
  if(c){window.MOTI?MOTI.coins(c):setTimeout(()=>H.addCoins(c),700)}
  return {html:`<span class="lstk">🔥 授業 <b>${n}日</b> れんぞく${c?`　🪙<b>${c}</b>まい`:''}<small>${tx}</small></span>`}});
window.LESSON={suggest,list,open,row,bindRows,PAY,today,card,bindCard,refresh,streak,doneToday,count:()=>[LESSONS.filter(l=>done()[l.id]).length,LESSONS.length]};
})();
