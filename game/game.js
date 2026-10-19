/* 星降るイングリッシュ: a word quiz on the beach. Correct answers earn coins,
   coins buy decorations that appear on the beach. */
(()=>{
const {scene:SC,sfx:SFX,S:ST}=BEACH;
const panel=$('panel');
const QN=10;
/* decorations sold in the shop: names must match the beach scene's ITEMS */
const DECOS=[['ランタン',100,'🏮'],['ロッキングチェア',200,'🪑'],['ヤシの木',350,'🌴'],['テント',500,'⛺'],['ライトのガーランド',800,'💡'],['ヨット',1200,'⛵'],
 ['ハンモック',1800,'🛏️'],['サーフボード',2500,'🏄'],['ビーチパラソル',3500,'⛱️'],['気球',5000,'🎈'],['豪華クルーザー',7500,'🛳️'],['星の門',10000,'🌟']];
const MODES={
 en2ja:{name:'いみを えらぶ',sub:'えいご → にほんご',ico:'🔤'},
 ja2en:{name:'えいごを えらぶ',sub:'にほんご → えいご',ico:'✏️'},
 listen:{name:'ききとり',sub:'おとを きいて えらぶ',ico:'👂'},
 weak:{name:'にがてを ふくしゅう',sub:'まちがえた ことば',ico:'📒'},
};
ST.course=ST.course||'kids';ST.weak=ST.weak||{};ST.learned=ST.learned||{};
try{const s=JSON.parse(localStorage.getItem(SAVE_KEY)||'{}');['course','weak','learned','best'].forEach(k=>{if(s[k]!=null)ST[k]=s[k]})}catch(e){}
_saveHooks.push(()=>{const s=JSON.parse(localStorage.getItem(SAVE_KEY)||'{}');Object.assign(s,{course:ST.course,weak:ST.weak,learned:ST.learned,best:ST.best||0});localStorage.setItem(SAVE_KEY,JSON.stringify(s))});

const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.random()*(i+1)|0;[a[i],a[j]]=[a[j],a[i]]}return a};
const list=()=>WORDS[ST.course].list;
const kids=()=>ST.course==='kids';

/* ---------- voice ---------- */
let voice=null;
function pickVoice(){const vs=speechSynthesis.getVoices().filter(v=>/^en[-_]/i.test(v.lang));voice=vs.find(v=>/en[-_]US/i.test(v.lang)&&/Samantha|Google|Natural/i.test(v.name))||vs.find(v=>/en[-_]US/i.test(v.lang))||vs[0]||null}
if(window.speechSynthesis){pickVoice();speechSynthesis.onvoiceschanged=pickVoice}
function speak(t,slow){if(!window.speechSynthesis||!ST.sound)return;try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(t);u.lang='en-US';if(voice)u.voice=voice;u.rate=slow?.6:(kids()?.8:.9);speechSynthesis.speak(u)}catch(e){}}

/* ---------- toast (beach events and rewards) ---------- */
function toast(html,ms=3000){const el=$('toast');el.innerHTML=html;el.classList.add('on');clearTimeout(el._t);el._t=setTimeout(()=>el.classList.remove('on'),ms)}
BEACH.on('toast',h=>toast(h));
$('toast').addEventListener('click',()=>$('toast').classList.remove('on'));

/* ---------- header ---------- */
function head(){$('coins').textContent=ST.coins.toLocaleString();const ph=phaseOf(GH());$('clock').textContent=ph[2]+' '+clockStr();$('snd').textContent=ST.sound?'🔊':'🔇'}
setInterval(head,1000);
$('snd').onclick=()=>{ST.sound=!ST.sound;ST.waves=ST.sound;ambient();if(!ST.sound){try{stopMusic(true)}catch(e){}speechSynthesis&&speechSynthesis.cancel()}else SFX.snd();save();head()};
function addCoins(n){ST.coins+=n;save();head();const c=document.querySelector('.coin');c.classList.remove('bump');void c.offsetWidth;c.classList.add('bump')}

/* ---------- home ---------- */
function weakWords(){return list().filter(w=>ST.weak[ST.course+':'+w[0]])}
function home(){
  const wk=weakWords().length;
  panel.innerHTML=`<section class="card home">
    <div class="seg" role="tablist">${Object.entries(WORDS).map(([k,v])=>`<button data-c="${k}" class="${ST.course===k?'on':''}">${v.ico} ${v.name}</button>`).join('')}</div>
    <div class="modes">${Object.entries(MODES).map(([k,m])=>`<button class="mode" data-m="${k}" ${k==='weak'&&wk<4?'disabled':''}><b>${m.ico} ${m.name}</b><small>${k==='weak'?(wk<4?'まちがえた ことばが 4つ たまると あそべるよ':wk+'こ'):m.sub}</small></button>`).join('')}</div>
    <div class="row"><button id="shopOpen" class="sub">🛍️ 浜辺の かざり</button><span class="note">おぼえた ことば ${Object.keys(ST.learned).filter(k=>k.startsWith(ST.course+':')).length} / ${list().length}</span></div>
  </section>`;
  panel.querySelectorAll('[data-c]').forEach(b=>b.onclick=()=>{ST.course=b.dataset.c;save();SFX.pop();home()});
  panel.querySelectorAll('[data-m]').forEach(b=>b.onclick=()=>{SFX.deal();start(b.dataset.m)});
  $('shopOpen').onclick=()=>{SFX.vopen();shop()};
}

/* ---------- quiz ---------- */
let Q=null;
function start(mode){
  const pool=mode==='weak'?weakWords():list();
  const qs=shuffle(pool).slice(0,Math.min(QN,pool.length));
  const kind=mode==='weak'?null:mode;
  Q={mode,i:0,ok:0,combo:0,maxCombo:0,earned:0,miss:[],qs:qs.map(w=>({w,kind:kind||pick(['en2ja','ja2en','listen'])}))};
  ask();
}
/* distractors must not share a meaning with the answer (e.g. 提案 / 提案する) */
const overlap=(a,b)=>{for(let i=0;i<a.length-1;i++)if(b.includes(a.slice(i,i+2)))return true;return false};
function choices(w){
  const others=shuffle(list().filter(o=>o[0]!==w[0]&&o[1]!==w[1]&&!overlap(o[1],w[1])));
  return shuffle([w,...others.slice(0,3)]);
}
function ask(){
  const q=Q.qs[Q.i],w=q.w,k=q.kind,ch=choices(w);q.ch=ch;
  const showEmoji=kids()&&w[2];
  let prompt;
  if(k==='en2ja')prompt=`<div class="big en">${esc(w[0])}</div>`;
  else if(k==='ja2en')prompt=`${showEmoji?`<div class="emo">${w[2]}</div>`:''}<div class="big ja">${esc(w[1])}</div>`;
  else prompt=`<button class="hear" id="hear" aria-label="もういちど きく">🔊</button><div class="hint">${kids()?'おとを きいてね':'音声を 聞いて 意味を 選ぼう'}</div>`;
  const label=o=>k==='ja2en'?esc(o[0]):`${kids()&&o[2]?`<span class="oe">${o[2]}</span>`:''}${esc(o[1])}`;
  panel.innerHTML=`<section class="card quiz">
    <div class="qtop"><button class="x" id="quit" aria-label="やめる">✕</button><div class="prog"><i style="width:${Q.i/Q.qs.length*100}%"></i></div><span class="qn">${Q.i+1}/${Q.qs.length}</span></div>
    <div class="prompt">${prompt}${k==='en2ja'?'<button class="say" id="hear" aria-label="きく">🔊</button>':''}</div>
    <div class="combo ${Q.combo>=2?'on':''}">🔥 ${Q.combo} れんぞく</div>
    <div class="opts">${ch.map((o,i)=>`<button class="opt" data-i="${i}">${label(o)}</button>`).join('')}</div>
  </section>`;
  if(k!=='ja2en'){const h=$('hear');let n=0;h.onclick=()=>speak(w[0],++n%2===0);setTimeout(()=>speak(w[0]),250)}
  $('quit').onclick=()=>{SFX.pop();home()};
  panel.querySelectorAll('.opt').forEach(b=>b.onclick=()=>answer(+b.dataset.i,b));
}
function answer(i,btn){
  const q=Q.qs[Q.i],w=q.w,right=q.ch[i]===w,key=ST.course+':'+w[0];
  panel.querySelectorAll('.opt').forEach((b,j)=>{b.disabled=true;if(q.ch[j]===w)b.classList.add('right')});
  const r=btn.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2;
  if(right){
    Q.ok++;Q.combo++;Q.maxCombo=Math.max(Q.maxCombo,Q.combo);
    const got=10+Math.min(Q.combo-1,10)*2;Q.earned+=got;addCoins(got);
    ST.learned[key]=1;if(ST.weak[key]&&--ST.weak[key]<=0)delete ST.weak[key];
    SFX.coin();SFX.hold();FX.ring(cx,cy,'#ffd23f');flyCoin(cx,cy,got);
    if(Q.combo%5===0){setTimeout(()=>{SFX.win();FX.firework(innerWidth/2,innerHeight*.3)},250)}
  }else{
    Q.combo=0;btn.classList.add('wrong');ST.weak[key]=(ST.weak[key]||0)+2;Q.miss.push(w);
    SFX.tie();
  }
  save();
  if(q.kind==='ja2en'||!right)setTimeout(()=>speak(w[0]),right?0:350);
  const foot=document.createElement('div');foot.className='next '+(right?'ok':'ng');
  foot.innerHTML=`<span>${right?(kids()?'せいかい！':'正解！'):(kids()?'ざんねん…':'おしい…')} <b>${esc(w[0])}</b> = ${esc(w[1])}</span><button id="go">${Q.i+1<Q.qs.length?'つぎへ ▶':'けっか ▶'}</button>`;
  panel.querySelector('.quiz').appendChild(foot);
  $('go').onclick=()=>{SFX.flip();Q.i++;Q.i<Q.qs.length?ask():result()};
  $('go').focus();
}
function flyCoin(x,y,n){const d=document.createElement('div');d.className='fly';d.textContent='+'+n;d.style.left=x+'px';d.style.top=y+'px';document.body.appendChild(d);setTimeout(()=>d.remove(),1000)}

/* ---------- result ---------- */
const BEACH_TREATS=['dolphins','whale','rainbow','meteors','turtle','lanterns','biolum','birds'];
function result(){
  const n=Q.qs.length,perfect=Q.ok===n;let bonus=0;
  if(perfect){bonus=50;addCoins(bonus);Q.earned+=bonus}
  ST.best=Math.max(ST.best||0,Q.maxCombo);save();
  const stars=Q.ok>=n?3:Q.ok>=n*.7?2:Q.ok>=n*.4?1:0;
  panel.innerHTML=`<section class="card result">
    <div class="stars">${'★'.repeat(stars)}<i>${'★'.repeat(3-stars)}</i></div>
    <div class="score">${Q.ok} / ${n}</div>
    <div class="earn">🪙 +${Q.earned}${perfect?' <small>(ぜんもん せいかい +50)</small>':''}</div>
    ${Q.miss.length?`<div class="miss"><b>${kids()?'まちがえた ことば':'間違えた単語'}</b>${Q.miss.map(w=>`<button class="mw" data-w="${esc(w[0])}">🔊 ${esc(w[0])} <small>${esc(w[1])}</small></button>`).join('')}</div>`:''}
    <div class="row"><button id="again">もういちど</button><button id="back" class="sub">もどる</button></div>
  </section>`;
  panel.querySelectorAll('.mw').forEach(b=>b.onclick=()=>speak(b.dataset.w));
  $('again').onclick=()=>{SFX.deal();start(Q.mode)};$('back').onclick=()=>{SFX.pop();home()};
  if(perfect){SFX.fanfare(2);FX.meteor();const ev=pick(BEACH_TREATS.filter(e=>SC.names.includes(e)));if(ev)setTimeout(()=>{try{SC.play(ev)}catch(e){}},1200);toast('🌟 <b>ぜんもん せいかい！</b><small>浜辺に なにか やってきた…？</small>',3600)}
  else if(stars>=2)SFX.win();else SFX.chime();
}

/* ---------- shop: beach decorations ---------- */
function shop(){
  panel.innerHTML=`<section class="card shop">
    <div class="qtop"><button class="x" id="sx" aria-label="とじる">✕</button><b>🛍️ 浜辺の かざり</b><span></span></div>
    <p class="note">かったものは 浜辺に かざられるよ</p>
    <div class="goods">${DECOS.map(([n,c,ico])=>{const has=hasDeco(n);return `<button class="good ${has?'has':''}" data-n="${n}" data-c="${c}" ${has||ST.coins<c?'disabled':''}><span class="gi">${ico}</span><span class="gn">${n}</span><span class="gc">${has?'かざり中':'🪙 '+c.toLocaleString()}</span></button>`}).join('')}</div>
  </section>`;
  $('sx').onclick=()=>{SFX.pop();home()};
  panel.querySelectorAll('.good').forEach(b=>b.onclick=()=>{const n=b.dataset.n,c=+b.dataset.c;if(ST.coins<c||hasDeco(n))return;
    ST.coins-=c;ST.deco[n]=true;save();head();SC.update(ST.coins);SFX.save();const r=b.getBoundingClientRect();FX.firework(r.left+r.width/2,r.top);toast(`✨ <b>${n}</b> を かざった！`);shop()});
}

head();home();SC.update(ST.coins);
document.addEventListener('keydown',e=>{const n='1234'.indexOf(e.key);if(n>=0){const b=panel.querySelectorAll('.opt')[n];if(b&&!b.disabled)b.click()}if(e.key==='Enter'){const g=$('go');if(g)g.click()}});
})();
