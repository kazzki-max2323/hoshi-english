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
function bindRows(back){H.panel.querySelectorAll('[data-les]').forEach(b=>b.onclick=()=>{SFX.vopen();open(b.dataset.les,back)})}

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
    log.appendChild(d);SFX.pop();d.scrollIntoView({block:'end',behavior:'smooth'});
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
    const fb=(ok,ans)=>{if(!ok)miss++;SFX[ok?'coin':'tie']();
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
  const finish=()=>{const D=done(),first=!D[l.id];D[l.id]=1;save();const pay=first?PAY[l.lv]:0,nx=suggest(4).filter(x=>x.id!==l.id)[0],bon=window.BONUS&&BONUS.claim(l);
    H.show('lesson',`<section class="pnl lsn">
      <div class="lsay by-m big"><span class="lface">${MINA.face('m','proud')}</span><div class="lbody"><p>「${esc(l.t)}」 おつかれさま！ ${miss?`${l.quiz.length-miss}/${l.quiz.length} せいかい。 また ふくしゅう しようね`:'ぜんもん せいかい！'}${pay?`<br>ごほうびに 🪙<b>${pay}</b>まい`:''}</p></div></div>
      ${bon?bon.html:''}
      ${nx?`<p class="note">つぎの おすすめ</p>${row(nx)}`:''}
      <div class="row"><button id="lagain" class="sub">もう一度</button><button id="lback">ミナ先生へ</button></div>
    </section>`);
    SFX.fanfare(1);if(pay){const r=H.panel.getBoundingClientRect();setTimeout(()=>H.coinBurst(r.left+r.width/2,r.top+70,pay),300)}
    $('lagain').onclick=()=>{SFX.pop();open(l.id,back)};$('lback').onclick=()=>{SFX.pop();MINA.open()};bindRows(back);if(bon)bon.after()};
  ask()}

window.LESSON={suggest,list,open,row,bindRows,PAY,count:()=>[LESSONS.filter(l=>done()[l.id]).length,LESSONS.length]};
})();
