/* 星降るイングリッシュ: 浜辺でめくる単語帳と、つぶやくラジオ。
   ラジオの問題に正解するとコインがもらえ、コインでラジオや浜辺のかざりを買う。 */
(()=>{
const {scene:SC,sfx:SFX,S:ST}=BEACH;
const panel=$('panel');
/* decorations sold in the shop: names must match the beach scene's ITEMS */
const DECOS=[['ランタン',100,'🏮'],['ロッキングチェア',200,'🪑'],['ヤシの木',350,'🌴'],['テント',500,'⛺'],['ライトのガーランド',800,'💡'],['ヨット',1200,'⛵'],
 ['ハンモック',1800,'🛏️'],['サーフボード',2500,'🏄'],['ビーチパラソル',3500,'⛱️'],['気球',5000,'🎈'],['豪華クルーザー',7500,'🛳️'],['星の門',10000,'🌟']];
const START_COINS=150;

/* ---------- save ---------- */
try{const s=JSON.parse(localStorage.getItem(SAVE_KEY)||'{}');ST.radios=s.radios||[];ST.radioGap=s.radioGap||5;ST.bookPos=s.bookPos||{};
  if(!s.started){ST.coins=Math.max(ST.coins,START_COINS);ST.started=1}else ST.started=1}catch(e){ST.radios=[];ST.radioGap=5;ST.bookPos={};ST.started=1}
_saveHooks.push(()=>{const s=JSON.parse(localStorage.getItem(SAVE_KEY)||'{}');Object.assign(s,{radios:ST.radios,radioGap:ST.radioGap,bookPos:ST.bookPos,started:1});localStorage.setItem(SAVE_KEY,JSON.stringify(s))});

const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.random()*(i+1)|0;[a[i],a[j]]=[a[j],a[i]]}return a};
const allWords=lv=>LEVELS[lv].books.flatMap(b=>b.w);

/* ---------- voice ---------- */
let voice=null;
function pickVoice(){const vs=speechSynthesis.getVoices().filter(v=>/^en[-_]/i.test(v.lang));voice=vs.find(v=>/en[-_]US/i.test(v.lang)&&/Samantha|Google|Natural/i.test(v.name))||vs.find(v=>/en[-_]US/i.test(v.lang))||vs[0]||null}
if(window.speechSynthesis){pickVoice();speechSynthesis.onvoiceschanged=pickVoice}
/* speaks and calls done() once the line has finished (or right away when it can't speak) */
function speak(t,{slow=false,done}={}){let fin=false;const end=()=>{if(!fin){fin=true;done&&done()}};
  if(!window.speechSynthesis||!ST.sound){setTimeout(end,1200);return}
  try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(t);u.lang='en-US';if(voice)u.voice=voice;u.rate=slow?.6:.85;u.onend=end;u.onerror=end;speechSynthesis.speak(u);setTimeout(end,600+t.length*160)}catch(e){end()}}

/* ---------- toast ---------- */
function toast(html,ms=2600){const el=$('toast');el.innerHTML=html;el.classList.add('on');clearTimeout(el._t);el._t=setTimeout(()=>el.classList.remove('on'),ms)}
BEACH.on('toast',h=>toast(h));
$('toast').addEventListener('click',()=>$('toast').classList.remove('on'));

/* ---------- header ---------- */
function head(){$('coins').textContent=ST.coins.toLocaleString();const ph=phaseOf(GH());$('clock').textContent=ph[2]+' '+clockStr();$('snd').textContent=ST.sound?'🔊':'🔇'}
setInterval(head,1000);
$('snd').onclick=()=>{ST.sound=!ST.sound;ST.waves=ST.sound;ambient();if(!ST.sound){try{stopMusic(true)}catch(e){}window.speechSynthesis&&speechSynthesis.cancel()}else SFX.snd();save();head()};
function addCoins(n){ST.coins+=n;save();head();const c=document.querySelector('.coin');c.classList.remove('bump');void c.offsetWidth;c.classList.add('bump')}
function flyCoin(x,y,n){const d=document.createElement('div');d.className='fly';d.textContent='+'+n;d.style.left=x+'px';d.style.top=y+'px';document.body.appendChild(d);setTimeout(()=>d.remove(),1000)}

/* ---------- screens ---------- */
let screen='home';
function show(name,html){screen=name;panel.innerHTML=html;if(name!=='home')radioQuiet()}

function home(){
  show('home',`<section class="pnl home">
    <div id="rq" class="rq"></div>
    <div class="lvs">${LV_ORDER.map(k=>{const L=LEVELS[k];return `<button class="lv lv-${k}" data-lv="${k}"><span class="li">${L.ico}</span><b>${L.name}</b><small>${L.books.length}さつ</small></button>`}).join('')}</div>
    <div class="row">
      <button id="shopOpen" class="sub">🛍️ ショップ</button>
      <button id="mini" class="sub">🎮 ミニゲーム</button>
    </div>
    ${ST.radios.length?`<label class="gap"><span>📻 つぶやき</span><input id="gapR" type="range" min="3" max="30" step="1" value="${ST.radioGap}"><output id="gapV">${ST.radioGap}秒ごと</output></label>`:''}
  </section>`);
  panel.querySelectorAll('[data-lv]').forEach(b=>b.onclick=()=>{SFX.vopen();books(b.dataset.lv)});
  $('shopOpen').onclick=()=>{SFX.vopen();shop('radio')};
  $('mini').onclick=()=>{SFX.pop();toast('🎮 <b>ミニゲーム</b><small>じゅんびちゅう だよ</small>')};
  const g=$('gapR');if(g)g.oninput=()=>{ST.radioGap=+g.value;$('gapV').textContent=g.value+'秒ごと';save();if(nextAt>performance.now()+ST.radioGap*1000)nextAt=performance.now()+ST.radioGap*1000};
  rqIdle();radioWake();
}

/* ---------- word books ---------- */
function books(lv){
  const L=LEVELS[lv];
  show('books',`<section class="pnl books">
    <div class="qtop"><button class="x" id="bx" aria-label="もどる">←</button><b>${L.ico} ${L.name}の たんごちょう</b><span class="qn">${L.books.length}さつ</span></div>
    <div class="shelf">${L.books.map((b,i)=>{const p=ST.bookPos[lv+':'+i]||0;return `<button class="book" data-i="${i}"><span class="bn">${i+1}</span><span class="bt">${esc(b.t)}</span><span class="bp">${p?`${p+1} / ${b.w.length}`:`${b.w.length}ご`}</span></button>`}).join('')}</div>
  </section>`);
  $('bx').onclick=()=>{SFX.pop();home()};
  panel.querySelectorAll('.book').forEach(b=>b.onclick=()=>{SFX.flip();cards(lv,+b.dataset.i)});
}

function cards(lv,bi){
  const L=LEVELS[lv],B=L.books[bi],key=lv+':'+bi;let i=Math.min(ST.bookPos[key]||0,B.w.length-1);
  show('cards',`<section class="pnl wb">
    <div class="qtop"><button class="x" id="cx" aria-label="たんごちょうを とじる">←</button><b>${bi+1}. ${esc(B.t)}</b><span class="qn" id="cn"></span></div>
    <div class="deck" id="deck"><div class="fc" id="fc" tabindex="0" role="button" aria-label="カードを めくる"><div class="cface cfront" id="ff"></div><div class="cface cback" id="fb"></div></div></div>
    <div class="ctl"><button id="cp" aria-label="まえの カード">◀</button><button id="cs" class="say" aria-label="はつおんを きく">🔊</button><button id="cnx" aria-label="つぎの カード">▶</button></div>
    <p class="note">タップで うら・おもて　よこに スワイプで めくる</p>
  </section>`);
  const fc=$('fc');
  function draw(){const w=B.w[i];fc.classList.remove('flip');
    $('ff').innerHTML=`${w[2]?`<span class="ce">${w[2]}</span>`:''}<span class="cw">${esc(w[0])}</span>`;
    $('fb').innerHTML=`<span class="cj">${esc(w[1])}</span><span class="cw2">${esc(w[0])}</span>`;
    $('cn').textContent=`${i+1} / ${B.w.length}`;ST.bookPos[key]=i;save()}
  function go(d){const n=i+d;
    if(n<0){fc.classList.add('nudge');setTimeout(()=>fc.classList.remove('nudge'),250);return}
    if(n>=B.w.length){done();return}
    fc.style.transition='transform .18s ease-in,opacity .18s';fc.style.transform=`translateX(${d>0?-120:120}%) rotate(${d>0?-8:8}deg)`;fc.style.opacity='0';SFX.flip();
    setTimeout(()=>{i=n;draw();fc.style.transition='none';fc.style.transform=`translateX(${d>0?120:-120}%)`;void fc.offsetWidth;fc.style.transition='transform .2s ease-out,opacity .2s';fc.style.transform='';fc.style.opacity='1'},180)}
  function done(){ST.bookPos[key]=0;save();SFX.fanfare(1);const r=$('deck').getBoundingClientRect();FX.firework(r.left+r.width/2,r.top+r.height/2);
    const nx=bi+1<L.books.length;
    $('deck').innerHTML=`<div class="fin"><b>🎉 ${B.w.length}ご ぜんぶ めくったよ！</b><div class="row"><button id="again" class="sub">もういちど</button>${nx?'<button id="nextB">つぎの たんごちょう ▶</button>':''}</div></div>`;
    panel.querySelector('.ctl').hidden=true;panel.querySelector('.wb .note').hidden=true;
    $('again').onclick=()=>cards(lv,bi);if(nx)$('nextB').onclick=()=>{SFX.flip();cards(lv,bi+1)}}
  /* swipe: drag the card sideways; a short tap flips it */
  let sx=null,sy=0,dx=0;
  fc.addEventListener('pointerdown',e=>{sx=e.clientX;sy=e.clientY;dx=0;fc.setPointerCapture(e.pointerId);fc.style.transition='none'});
  fc.addEventListener('pointermove',e=>{if(sx==null)return;dx=e.clientX-sx;if(Math.abs(dx)>6)fc.style.transform=`translateX(${dx}px) rotate(${dx/30}deg)`});
  const up=e=>{if(sx==null)return;const moved=Math.abs(dx),vy=Math.abs(e.clientY-sy);sx=null;fc.style.transition='transform .2s';
    if(moved>60&&moved>vy)go(dx<0?1:-1);else{fc.style.transform='';if(moved<8&&vy<8){fc.classList.toggle('flip');SFX.pop()}}};
  fc.addEventListener('pointerup',up);fc.addEventListener('pointercancel',()=>{sx=null;fc.style.transform=''});
  fc.addEventListener('keydown',e=>{if(e.key===' '||e.key==='Enter'){e.preventDefault();fc.classList.toggle('flip')}});
  $('cp').onclick=()=>go(-1);$('cnx').onclick=()=>go(1);
  $('cs').onclick=e=>{e.stopPropagation();const b=$('cs');b._n=(b._n||0)+1;speak(B.w[i][0],{slow:b._n%2===0})};
  $('cx').onclick=()=>{SFX.pop();books(lv)};
  cardKeys=e=>{if(e.key==='ArrowRight')go(1);if(e.key==='ArrowLeft')go(-1)};
  draw();
}
let cardKeys=null;
document.addEventListener('keydown',e=>{if(screen==='cards'&&cardKeys)cardKeys(e)});

/* ---------- radios on the beach ---------- */
const layer=document.createElement('div');layer.id='radios';$('window').appendChild(layer);
function freeSpot(){const xs=ST.radios.map(r=>r.x);for(let t=0;t<40;t++){const x=.08+Math.random()*.84;if(xs.every(v=>Math.abs(v-x)>.09))return x}return .08+Math.random()*.84}
function drawRadios(){layer.innerHTML=ST.radios.map((r,i)=>`<button class="radio ${r.on?'on':''}" data-i="${i}" style="left:${r.x*100}%;top:${r.y*100}%" aria-label="${LEVELS[r.lv].name}ラジオ ${r.on?'オン':'オフ'}"><span class="rb">📻</span><b class="lv-${r.lv}">${LEVELS[r.lv].short}</b></button>`).join('');
  layer.querySelectorAll('.radio').forEach(b=>b.onclick=()=>{const r=ST.radios[+b.dataset.i];r.on=!r.on;save();drawRadios();SFX.beep(r.on?880:440);toast(`📻 ${LEVELS[r.lv].name}ラジオ <b>${r.on?'オン':'オフ'}</b>`,1400);if(screen==='home'){rqIdle();radioWake()}})}
ST.radios.forEach(r=>{if(r.y==null)r.y=.68+Math.random()*.14});

let nextAt=0,talking=false,lastRadio=-1,cur=null;
function radioQuiet(){talking=false;cur=null;window.speechSynthesis&&speechSynthesis.cancel();layer.querySelectorAll('.talk').forEach(b=>b.classList.remove('talk'))}
function radioWake(){nextAt=Math.min(nextAt||Infinity,performance.now()+1500)}
function rqIdle(){const el=$('rq');if(!el||cur)return;const on=ST.radios.filter(r=>r.on).length;
  el.className='rq idle';el.innerHTML=!ST.radios.length?'📻 ショップで ラジオを かうと、浜辺で 英語を つぶやくよ。<br>こたえを タップして コインを ためよう！':on?'📻 ラジオに 耳を すませて…':'📻 ラジオが ぜんぶ オフだよ。浜辺の ラジオを タップすると オンになるよ'}
/* distractors must not share a meaning with the answer (e.g. 提案 / 提案する) */
const overlap=(a,b)=>{a=a.replace(/[〜（）・、。？！ ]/g,'');b=b.replace(/[〜（）・、。？！ ]/g,'');for(let i=0;i<a.length-1;i++)if(b.includes(a.slice(i,i+2)))return true;return false};
function makeLine(lv){const L=LEVELS[lv],useTalk=Math.random()<.5&&L.talk.length,pool=useTalk?L.talk:allWords(lv);
  const ans=pick(pool),n=L.choices;
  const others=shuffle(pool.filter(o=>o!==ans&&o[0]!==ans[0]&&o[1]!==ans[1]&&!overlap(o[1],ans[1]))).slice(0,n-1);
  return {lv,en:ans[0],ja:ans[1],opts:shuffle([ans[1],...others.map(o=>o[1])])}}
function tick(){
  if(screen!=='home'||talking||document.hidden||performance.now()<nextAt)return;
  const on=ST.radios.map((r,i)=>[r,i]).filter(([r])=>r.on);if(!on.length)return;
  let pickd=pick(on);if(on.length>1)while(pickd[1]===lastRadio)pickd=pick(on);
  const [r,ri]=pickd;lastRadio=ri;cur=makeLine(r.lv);cur.ri=ri;talking=true;
  const btn=layer.querySelector(`[data-i="${ri}"]`);btn&&btn.classList.add('talk');
  SFX.tick();drawLine();
  setTimeout(()=>speak(cur?cur.en:'',{done:()=>{talking=false;btn&&btn.classList.remove('talk');nextAt=performance.now()+ST.radioGap*1000}}),200);
}
setInterval(tick,250);
function drawLine(){const el=$('rq');if(!el||!cur)return;const L=LEVELS[cur.lv],c=cur;
  el.className='rq live';
  el.innerHTML=`<div class="rl"><span class="rt lv-${c.lv}">📻 ${L.short}</span><span class="re">${esc(c.en)}</span><button class="ragain" aria-label="もういちど きく">🔁</button></div>
    <div class="ro n${c.opts.length}">${c.opts.map((o,i)=>`<button data-o="${i}">${esc(o)}</button>`).join('')}</div>`;
  el.querySelector('.ragain').onclick=()=>speak(c.en,{slow:true});
  el.querySelectorAll('[data-o]').forEach(b=>b.onclick=()=>{if(c!==cur||c.done)return;c.done=1;const ok=c.opts[+b.dataset.o]===c.ja;
    el.querySelectorAll('[data-o]').forEach((x,j)=>{x.disabled=true;if(c.opts[j]===c.ja)x.classList.add('right')});
    const rc=b.getBoundingClientRect();
    if(ok){const got=L.reward;addCoins(got);SFX.coin();FX.ring(rc.left+rc.width/2,rc.top+rc.height/2,'#ffd23f');flyCoin(rc.left+rc.width/2,rc.top,got)}
    else{b.classList.add('wrong');SFX.tie()}
    setTimeout(()=>{if(cur===c){cur=null;rqIdle()}},ok?1200:2200)})}

/* ---------- shop ---------- */
function shop(tab){
  const radioRows=LV_ORDER.map(k=>{const L=LEVELS[k],n=ST.radios.filter(r=>r.lv===k).length;return `<div class="ritem">
      <span class="ri">📻<b class="lv-${k}">${L.short}</b></span>
      <span class="rn"><b>${L.name}ラジオ</b><small>${L.choices}たく・せいかい +${L.reward}　もっている ${n}だい</small></span>
      <span class="rbtn"><button class="buy" data-k="${k}" ${ST.coins<L.price?'disabled':''}>かう 🪙${L.price.toLocaleString()}</button><button class="sell sub" data-k="${k}" ${n?'':'disabled'}>うる +${L.price/2|0}</button></span>
    </div>`}).join('');
  const decoGrid=`<div class="goods">${DECOS.map(([n,c,ico])=>{const has=hasDeco(n);return `<button class="good ${has?'has':''}" data-n="${n}" data-c="${c}" ${has||ST.coins<c?'disabled':''}><span class="gi">${ico}</span><span class="gn">${n}</span><span class="gc">${has?'かざり中':'🪙 '+c.toLocaleString()}</span></button>`}).join('')}</div>`;
  show('shop',`<section class="pnl shop">
    <div class="qtop"><button class="x" id="sx" aria-label="ショップを とじる">←</button><b>🛍️ ショップ</b><span></span></div>
    <div class="seg"><button data-t="radio" class="${tab==='radio'?'on':''}">📻 ラジオ</button><button data-t="deco" class="${tab==='deco'?'on':''}">✨ かざり</button></div>
    ${tab==='radio'?`<div class="rlist">${radioRows}</div><p class="note">ラジオは 何台でも おけるよ。うると かった ねだんの はんぶん もどってくる</p>`:decoGrid}
  </section>`);
  $('sx').onclick=()=>{SFX.pop();home()};
  panel.querySelectorAll('[data-t]').forEach(b=>b.onclick=()=>{SFX.pop();shop(b.dataset.t)});
  panel.querySelectorAll('.buy').forEach(b=>b.onclick=()=>{const k=b.dataset.k,L=LEVELS[k];if(ST.coins<L.price)return;
    ST.coins-=L.price;ST.radios.push({lv:k,on:true,x:freeSpot(),y:.68+Math.random()*.14});save();head();drawRadios();SFX.save();toast(`📻 <b>${L.name}ラジオ</b> を 浜辺に おいた！`);shop('radio')});
  panel.querySelectorAll('.sell').forEach(b=>b.onclick=()=>{const k=b.dataset.k,L=LEVELS[k];let idx=-1;ST.radios.forEach((r,i)=>{if(r.lv===k)idx=i});if(idx<0)return;
    ST.radios.splice(idx,1);addCoins(L.price/2|0);drawRadios();SFX.coin();toast(`📻 ${L.name}ラジオを うった`);shop('radio')});
  panel.querySelectorAll('.good').forEach(b=>b.onclick=()=>{const n=b.dataset.n,c=+b.dataset.c;if(ST.coins<c||hasDeco(n))return;
    ST.coins-=c;ST.deco[n]=true;save();head();SC.update(ST.coins);SFX.save();const r=b.getBoundingClientRect();FX.firework(r.left+r.width/2,r.top);toast(`✨ <b>${n}</b> を かざった！`);shop('deco')});
}

save();head();drawRadios();home();SC.update(ST.coins);
})();
