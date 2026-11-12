/* カード対決: 集めた カード図鑑の カードで 住人と たたかう。
   - 所持カード（しゅるい）が 6しゅるい ないと あそべない（ミナの 貸し出しは なし。たりない ときは その ことを 見せる）
   - レベル（小・中・高）は 出る 単語と あいての つよさ・正解率にだけ きく。出す カードは 所持カードから 自由に えらべる
   - 3まいずつ 出して、カード同士の 勝ち負けで 攻撃力が きまる → 30秒の 単語クイズで「正解数 × 攻撃力」の ダメージ
   - 出題は 半々：場の カードの 単語 ／ その レベルの 単語帳（苦手な 単語を 先に）。まだ 覚えていない 単語も ふつうに 出る
   - 形式は タップだけ：和訳（英→日）・英訳（日→英）・スペル並べ替え。声に 出す ものは なし
   - 正誤は いつもの 'answer' の 記録に 流す（苦手な 単語・卒業カウントと 合流する）
   - 勝つと あいての デッキ（ぜんぶ）から ランダムで 1まい もらえる。負けても 没収は なし
   - カードの 能力（回復・サポート・邪魔）は 第2版で。コイン報酬は なし */
(()=>{
const {S:ST,sfx:SFX}=BEACH;
const H=HE,esc=H.esc,$=id=>document.getElementById(id);
const shuffle=a=>H.shuffle(a),pickL=a=>a[Math.random()*a.length|0];
const NEED=6,MAXHP=100,PHASE_MS=30000,MAXTURN=10;
const ATK={1:1,2:2,3:3,4:4,5:6};   // attack by rarity: N R SR SSR UR
const LVS=[['es','🐣 小学生'],['jh','🎒 中学生'],['hs','📐 高校生']];
const FOES=[
 {id:'pip',ico:'🦜',n:'ピップ',d:'ノラさんの オウム。ものまね じょうず',star:'★☆☆☆',acc:{es:.45,jh:.36,hs:.28},wr:[70,25,5,0,0],spd:6,
  hi:['ピップだよ！ まけないよ！','カード バトル！ たのしい！'],think:['えーと、えーと…','ピップ、かんがえちゅう…'],win:['ピップの かち！ つよい！'],lose:['まけた… まけた…','つぎは まけない！']},
 {id:'kanio',ico:'🦀',n:'カニオ',d:'すうがくが すきな カニ',star:'★★☆☆',acc:{es:.58,jh:.5,hs:.42},wr:[55,32,10,3,0],spd:7,
  hi:['チョキッ！ かちに きたよ','けいさん ばっちり。まけないよ'],think:['ふむふむ…','チョキ、チョキ…'],win:['けいさん どおりの かち！'],lose:['けいさん ちがい…？']},
 {id:'gen',ico:'👴',n:'ゲンじい',d:'浜辺の つりびと。ゆっくり、でも つよい',star:'★★★☆',acc:{es:.7,jh:.62,hs:.54},wr:[40,35,18,6,1],spd:7,
  hi:['ほう、勝負かね。わしは つよいぞ','ゆっくり たのしもうぞ'],think:['うーむ…','耳が 遠くてのう…'],win:['ほっほ、わしの かちじゃ'],lose:['やるのう… まけたわい']},
 {id:'mina',ico:'👩‍🏫',n:'ミナ先生',d:'せんせい。いちばん てごわい',star:'★★★★',acc:{es:.85,jh:.78,hs:.7},wr:[25,35,25,12,3],spd:9,
  hi:['まかせて。せんせい、ほんき だよ','単語を よく 知ってる 人が 勝つよ'],think:['うーん、これは…','ふふ、知ってる知ってる'],win:['おつかれさま。よく できてたよ'],lose:['まけた…！ すごい、せいしゅん してる！']},
];
const ovl=(a,b)=>{a=String(a).replace(/[〜（）・、。？！ ]/g,'');b=String(b).replace(/[〜（）・、。？！ ]/g,'');if(a===b)return true;
  for(let i=0;i<a.length-1;i++)if(b.includes(a.slice(i,i+2)))return true;return false};

let M=null,seq=0,setupLv=null;
const live=()=>!!(M&&M.id===seq&&H.screen==='duel'&&$('duRoot'));
const owned=()=>window.CARDS?CARDS.book.filter(c=>CARDS.has(c)):[];
const myLvKey=()=>{try{const l=MINA.level();return l==='jh'||l==='hs'?l:'es'}catch(e){return 'es'}};

/* ---------- entry ---------- */
function open(){M=null;
  if(!window.CARDS){H.home();return}
  const n=CARDS.count()[0];
  if(n<NEED){H.show('duel',`<section class="pnl duel" id="duRoot">
    <div class="qtop"><button class="x" id="dux" aria-label="もどる">←</button><b>⚔️ カード対決</b><span class="qn"></span></div>
    <p class="duBig">🃏 カードが たりなくて、まだ 対決できないよ。</p>
    <p>いま <b>${n}</b> しゅるい。あと <b>${NEED-n}</b> しゅるい あつめると あそべるよ！</p>
    <p class="note">カードは 🃏 カード図鑑の 宝箱くじで あつまるよ。まいにち 1回 むりょうで 引けるよ</p>
    <div class="row"><button id="duToCards">🃏 カード図鑑へ</button><button id="duBack" class="sub">もどる</button></div>
  </section>`);
    $('dux').onclick=$('duBack').onclick=()=>{SFX.back();H.home()};
    $('duToCards').onclick=()=>{SFX.card();CARDS.open()};
    return}
  setupLv=setupLv||myLvKey();
  H.show('duel',`<section class="pnl duel" id="duRoot">
    <div class="qtop"><button class="x" id="dux" aria-label="もどる">←</button><b>⚔️ カード対決</b><span class="qn">🃏 ${n} しゅるい</span></div>
    <p class="note">カードを 3まい 出して、単語クイズで ダメージ！ 勝つと あいての カードが 1まい もらえるよ。知ってる 単語が 多いほど ゆうり！</p>
    <div class="seg lvseg">${LVS.map(([k,t])=>`<button data-lv="${k}" class="${k===setupLv?'on':''}">${t}</button>`).join('')}</div>
    <div class="duFoes">${FOES.map((f,i)=>`<button class="duFoeBtn" data-f="${i}"><span class="duFoeIco">${f.ico}</span><span class="duFoeTx"><b>${esc(f.n)}</b><small>${esc(f.d)}</small></span><span class="duFoeStar">${f.star}</span></button>`).join('')}</div>
  </section>`);
  $('dux').onclick=()=>{SFX.back();H.home()};
  H.panel.querySelectorAll('[data-lv]').forEach(b=>b.onclick=()=>{SFX.pop();setupLv=b.dataset.lv;open()});
  H.panel.querySelectorAll('[data-f]').forEach(b=>b.onclick=()=>{SFX.card();startMatch(FOES[+b.dataset.f])});
}

/* ---------- match setup ---------- */
function rollR(wr){let x=Math.random()*100;for(let r=1;r<=5;r++){x-=wr[r-1];if(x<0)return r}return 1}
function foeDeck(foe){const byR=[[],[],[],[],[],[]];CARDS.book.forEach(c=>byR[c.r].push(c));
  const out=[],used=new Set();
  for(let i=0;i<9;i++){let c,tries=0;do{c=pickL(byR[rollR(foe.wr)]);tries++}while(used.has(c.e)&&tries<10);used.add(c.e);out.push(c)}return out}
function startMatch(foe){const id=++seq;
  M={id,lv:setupLv,foe,turn:1,php:MAXHP,ohp:MAXHP,foeDeck:foeDeck(foe),myField:[],foeField:[],myAtk:0,foeAtk:0,sel:[],phase:'field',timer:0};
  fieldPhase(true)}

/* ---------- shared chrome ---------- */
function hpHtml(who,hp){const p=Math.max(0,hp);return `<div class="duHpRow"><span>${who}</span><div class="duHp"><i style="width:${p}%"></i></div><b>${p}</b></div>`}
function fieldHtml(cards,marks,back){return `<div class="duField">${cards.map((c,i)=>`<div class="dw">${CARDS.face(c,{show:1})}${marks&&marks[i]?`<em class="duMark ${marks[i]}">${marks[i]==='w'?'⭕':marks[i]==='l'?'✖':'△'}</em>`:''}<span class="duAtk">⚔${ATK[c.r]}</span></div>`).join('')||(back?'<div class="dw back"><span>？</span></div>':'<div class="dw empty"><span>・</span></div>').repeat(3)}</div>`}
function chrome(midHtml,mainHtml){H.show('duel',`<section class="pnl duel" id="duRoot">
  <div class="qtop"><button class="x" id="dux" aria-label="やめる">←</button><b>⚔️ カード対決</b><span class="qn">${M.turn}ターン目</span></div>
  <div class="duSide foe">${hpHtml(`${M.foe.ico} ${esc(M.foe.n)}`,M.ohp)}${fieldHtml(M.foeField,M.marks?M.marks.map(m=>m[1]):null,true)}</div>
  <div class="duMid" id="duMid">${midHtml}</div>
  <div class="duSide me">${fieldHtml(M.myField,M.marks?M.marks.map(m=>m[0]):null,false)}${hpHtml('⭐ あなた',M.php)}</div>
  <div id="duMain">${mainHtml}</div>
</section>`);
  $('dux').onclick=()=>{SFX.back();stopTimer();M=null;open()}}

/* ---------- fielding ---------- */
function fieldPhase(first){M.phase='field';M.myField=[];M.foeField=[];M.marks=null;M.sel=[];
  const mine=owned();
  chrome(first?`<p class="duSay">${M.foe.ico}「${esc(pickL(M.foe.hi))}」</p>`:`<p>${M.turn}ターン目。カードを 3まい えらんでね</p>`,
   `<p class="duPickTx">あなたの カード（<b id="duSelN">0</b>/3まい）　タップで えらぶ・はずす</p>
    <div class="duGrid">${mine.map(c=>`<div class="dw pick" data-e="${esc(c.e)}">${CARDS.face(c,{show:1})}<span class="duAtk">⚔${ATK[c.r]}</span><em class="duSelB" hidden></em></div>`).join('')}</div>
    <button id="duGo" class="duGoBtn" disabled>この 3まいで たたかう！</button>`);
  H.panel.querySelectorAll('.dw.pick').forEach(el=>el.onclick=()=>{const c=mine.find(x=>x.e===el.dataset.e);toggleSel(c,el)});
  $('duGo').onclick=()=>{SFX.card();reveal()}}
function toggleSel(c,el){const i=M.sel.indexOf(c);
  if(i>=0){M.sel.splice(i,1)}else{if(M.sel.length>=3){SFX.wrong();return}
    if(M.sel.filter(x=>x.e===c.e).length>=(CARDS.n(c)||1)){SFX.wrong();return}M.sel.push(c)}
  SFX.flip();
  const n=M.sel.filter(x=>x.e===c.e).length;
  el.classList.toggle('sel',n>0);const b=el.querySelector('.duSelB');b.hidden=!n;if(n)b.textContent='✓'+(n>1?'×'+n:'');
  $('duSelN').textContent=M.sel.length;$('duGo').disabled=M.sel.length!==3}

/* ---------- the card battle: lanes decide attack power ---------- */
function reveal(){M.phase='reveal';M.myField=M.sel.slice();M.foeField=shuffle(M.foeDeck).slice(0,3);
  let my=0,fo=0;M.marks=M.myField.map((c,i)=>{const f=M.foeField[i],a=ATK[c.r],b=ATK[f.r];
    if(a>b){my+=a;return ['w','l']}if(a<b){fo+=b;return ['l','w']}const h=Math.ceil(a/2);my+=h;fo+=h;return ['t','t']});
  M.myAtk=Math.max(1,my);M.foeAtk=Math.max(1,fo);
  chrome(`<p class="duVs">⚔ あなたの 攻撃力 <b>${M.myAtk}</b>　／　${esc(M.foe.n)} <b>${M.foeAtk}</b></p>
    <p class="note">カードの 勝った レーンの ぶんだけ 攻撃力が つくよ（引き分けは 半分）</p>`,
   `<button id="duStart" class="duGoBtn">⏱️ もんだい スタート！（30秒）</button>`);
  $('duStart').onclick=()=>{SFX.step();myQuiz()}}

/* ---------- questions ---------- */
function buildGens(){const lv=M.lv;
  const words=H.allWords(lv).map(w=>({en:w[0],ja:w[1],em:w[2]}));
  const byEn={};words.forEach(w=>byEn[w.en]=w);
  const weak=(window.MINA?MINA.weakWords(lv,'w'):[]).map(w=>byEn[w.en]||{en:w.en,ja:w.ja,em:''});
  const rest=shuffle(words.filter(w=>!weak.some(x=>x.en===w.en)));
  M.poolB=[...shuffle(weak),...rest];
  M.poolA=shuffle(M.myField.concat(M.foeField).map(c=>({en:c.en,ja:c.ja,em:c.e})));
  M.dist=[...M.poolA,...words];M.ai=0;M.bi=0;M.qn=0}
function nextWord(){M.qn++;if(M.qn%2===1)return M.poolA[M.ai++%M.poolA.length];return M.poolB[M.bi++%M.poolB.length]}
function choicesFor(w,field){const n=LEVELS[M.lv].choices||3,out=[];const seen=new Set([field==='ja'?w.ja:w.en]);
  for(const c of shuffle(M.dist)){if(c===w)continue;const v=field==='ja'?c.ja:c.en;
    if(seen.has(v))continue;if(field==='ja'&&ovl(v,w.ja))continue;seen.add(v);out.push(v);if(out.length>=n-1)break}
  return shuffle([field==='ja'?w.ja:w.en,...out])}
const report=(w,ok,ms)=>{try{H.emit('answer',{lv:M.lv,en:w.en,ja:w.ja,kind:'w'},ok,ms)}catch(e){}};

function myQuiz(){M.phase='quiz';M.correct=0;buildGens();
  chrome(`<div class="duTimer"><i id="duTBar"></i></div><p class="duScore">⏱ <b id="duTLeft">30</b>秒　⭕ <b id="duCor">0</b>もん × ⚔${M.myAtk} ＝ 💥<b id="duDmg">0</b></p>`,
   `<div id="duQ"></div>`);
  M.endAt=Date.now()+PHASE_MS;
  stopTimer();M.timer=setInterval(()=>{if(!live()){stopTimer();return}
    const left=Math.max(0,M.endAt-Date.now());const b=$('duTBar'),t=$('duTLeft');
    if(b)b.style.width=(left/PHASE_MS*100)+'%';if(t)t.textContent=Math.ceil(left/1000);
    if(left<=0){stopTimer();endMyQuiz()}},100);
  askQ()}
function stopTimer(){if(M&&M.timer){clearInterval(M.timer);M.timer=0}}
function askQ(){if(!live()||M.phase!=='quiz')return;const w=nextWord();M.cur=w;M.qT0=Date.now();M.busy=false;
  const canSpell=/^[A-Za-z]{3,9}$/.test(w.en),r=Math.random();
  const fmt=canSpell&&r<.3?'spell':r<.65?'ja':'en';M.fmt=fmt;
  const box=$('duQ');if(!box)return;
  if(fmt==='spell'){const letters=shuffle(w.en.split(''));
    box.innerHTML=`<div class="duq"><small>スペルを ならべて</small><b>${esc(w.ja)}</b><span class="duem">${esc(w.em||'')}</span></div>
      <div class="duSpell" id="duSpell">${w.en.split('').map(()=>'<span class="duSlot"></span>').join('')}</div>
      <div class="duTiles">${letters.map((L,i)=>`<button data-t="${i}" data-l="${esc(L)}">${esc(L)}</button>`).join('')}</div>`;
    M.spGot='';box.querySelectorAll('[data-t]').forEach(b=>b.onclick=()=>spellTap(b,w));return}
  const opts=choicesFor(w,fmt);
  box.innerHTML=fmt==='ja'
    ?`<div class="duq"><span class="duem">${esc(w.em||'')}</span><b>${esc(w.en)}</b><button id="duSay" class="sub">🔊</button></div>
      <div class="duOpts">${opts.map(o=>`<button data-o="${esc(o)}">${esc(o)}</button>`).join('')}</div>`
    :`<div class="duq"><b>${esc(w.ja)}</b></div>
      <div class="duOpts">${opts.map(o=>`<button data-o="${esc(o)}">${esc(o)}</button>`).join('')}</div>`;
  if(fmt==='ja'){H.say(M.lv,w.en);const s=$('duSay');if(s)s.onclick=()=>H.say(M.lv,w.en)}
  box.querySelectorAll('[data-o]').forEach(b=>b.onclick=()=>answerQ(b,w,b.dataset.o===(fmt==='ja'?w.ja:w.en)))}
function answerQ(btn,w,ok){if(M.busy||M.phase!=='quiz')return;M.busy=true;report(w,ok,Date.now()-M.qT0);
  const box=$('duQ');box.querySelectorAll('[data-o]').forEach(b=>{const good=b.dataset.o===(M.fmt==='ja'?w.ja:w.en);
    if(good)b.classList.add('right');else if(b===btn)b.classList.add('wrong');b.disabled=true});
  if(ok){SFX.correct();M.correct++;const c=$('duCor'),d=$('duDmg');if(c)c.textContent=M.correct;if(d)d.textContent=M.correct*M.myAtk}
  else SFX.wrong();
  setTimeout(()=>{if(live()&&M.phase==='quiz'&&Date.now()<M.endAt)askQ()},ok?260:650)}
function spellTap(b,w){if(M.busy||M.phase!=='quiz'||b.disabled)return;const L=b.dataset.l,need=w.en[M.spGot.length];
  if(L.toLowerCase()!==need.toLowerCase()){M.busy=true;report(w,false,Date.now()-M.qT0);SFX.wrong();b.classList.add('wrong');
    const slots=$('duSpell').children;w.en.split('').forEach((ch,i)=>{slots[i].textContent=ch;slots[i].classList.add('show')});
    setTimeout(()=>{if(live()&&M.phase==='quiz'&&Date.now()<M.endAt)askQ()},800);return}
  b.disabled=true;M.spGot+=L;const slots=$('duSpell').children;slots[M.spGot.length-1].textContent=need;slots[M.spGot.length-1].classList.add('on');
  SFX.tap();
  if(M.spGot.length===w.en.length){M.busy=true;report(w,true,Date.now()-M.qT0);SFX.correct();M.correct++;
    const c=$('duCor'),d=$('duDmg');if(c)c.textContent=M.correct;if(d)d.textContent=M.correct*M.myAtk;
    setTimeout(()=>{if(live()&&M.phase==='quiz'&&Date.now()<M.endAt)askQ()},300)}}
function endMyQuiz(){if(!live()||M.phase!=='quiz')return;M.phase='dmg';const dmg=M.correct*M.myAtk;M.ohp=Math.max(0,M.ohp-dmg);
  chrome(`<p class="duSay">💥 ${esc(M.foe.n)} に <b>${dmg}</b> ダメージ！（⭕ ${M.correct}もん × ⚔${M.myAtk}）</p>`,
   `<p class="note">${M.ohp<=0?'やった！':'つぎは '+esc(M.foe.n)+' の ばん…'}</p>`);
  SFX.hit?SFX.hit():SFX.done();
  setTimeout(()=>{if(!live())return;if(M.ohp<=0)finish(true);else foeQuiz()},1500)}

/* ---------- the foe's turn: simulated with their accuracy ---------- */
function foeQuiz(){M.phase='foe';const foe=M.foe,acc=foe.acc[M.lv]||.5;
  const attempts=foe.spd+(Math.random()*3|0);let correct=0;const res=[];
  for(let i=0;i<attempts;i++){const ok=Math.random()<acc;if(ok)correct++;res.push(ok)}
  const sample=shuffle(M.poolB.slice()).slice(0,3);
  chrome(`<p class="duSay">${foe.ico}「${esc(pickL(foe.think))}」</p><div class="duLog" id="duLog"></div>`,
   `<p class="note">${esc(foe.n)} が こたえている…</p>`);
  sample.forEach((w,i)=>setTimeout(()=>{if(!live())return;const log=$('duLog');if(!log)return;
    const p=document.createElement('p');p.innerHTML=`「${esc(w.en)}」→ ${res[i]?'<b class="ok">⭕</b>':'<b class="ng">✖</b>'}`;log.appendChild(p);res[i]?SFX.pop():SFX.wrong()},700+i*800));
  setTimeout(()=>{if(!live())return;const dmg=correct*M.foeAtk;M.php=Math.max(0,M.php-dmg);M.phase='dmg';
    chrome(`<p class="duSay">💥 あなたに <b>${dmg}</b> ダメージ！（${esc(foe.n)} は ⭕ ${correct}もん × ⚔${M.foeAtk}）</p>`,
     `<p class="note">${M.php<=0?'いたい…！':'まだまだ！ つぎの ターン'}</p>`);
    setTimeout(()=>{if(!live())return;
      if(M.php<=0)return finish(false);
      if(M.turn>=MAXTURN)return finish(M.php===M.ohp?null:M.php>M.ohp);
      M.turn++;fieldPhase(false)},1500)},700+sample.length*800+500)}

/* ---------- the end ---------- */
function finish(won){M.phase='over';stopTimer();const foe=M.foe;let prizeHtml='';
  if(won){const prize=pickL(M.foeDeck);const isNew=CARDS.gain(prize);SFX.fanfare(2);
    prizeHtml=`<div class="duPrize"><p>🎁 <b>${esc(foe.n)}</b> の カードを 1まい もらった！</p>
      <div class="dw big">${CARDS.face(prize,{show:1})}</div>
      <p>${isNew?'<b class="duNew">NEW!</b> はじめての カード！':`ダブりは ✦ 星のかけら +${CARDS.rar[prize.r].sh} に なったよ`}</p></div>`}
  else if(won===false)SFX.wrong();
  chrome(`<p class="duSay">${foe.ico}「${esc(won===null?'いい 勝負だった！':pickL(won?foe.lose:foe.win))}」</p>`,
   `${won?'<p class="duResult win">🏆 あなたの 勝ち！</p>':won===false?'<p class="duResult lose">💦 まけた… もう一度 ちょうせん！</p>':'<p class="duResult">🤝 引き分け！</p>'}
    ${prizeHtml}
    <div class="row"><button id="duAgain">🔁 もう一度 たたかう</button><button id="duSetup" class="sub">あいてを 変える</button><button id="duHome" class="sub">ホームへ</button></div>`);
  $('duAgain').onclick=()=>{SFX.card();startMatch(foe)};
  $('duSetup').onclick=()=>{SFX.pop();M=null;open()};
  $('duHome').onclick=()=>{SFX.back();M=null;H.home()}}

/* ---------- home entry (its own row under the home buttons) ---------- */
H.on('home',()=>{const row=H.panel.querySelector('.home .row');if(!row||$('duelGo'))return;
  const r2=document.createElement('div');r2.className='row duelrow';
  r2.innerHTML=`<button id="duelGo" class="sub"><span>⚔️</span>カード対決</button>`;row.after(r2);
  $('duelGo').onclick=()=>{SFX.card();open()}});
if(H.screen==='home')H.home();   // the button also shows on the very first home

window.DUEL={open};
})();
