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
const GAP0=10;
try{const s=JSON.parse(localStorage.getItem(SAVE_KEY)||'{}');ST.radios=s.radios||[];ST.radioGap=s.gapV>=2?s.radioGap:GAP0;ST.bookPos=s.bookPos||{};
  if(!s.started)ST.coins=Math.max(ST.coins,START_COINS);ST.started=1}catch(e){ST.radios=[];ST.radioGap=GAP0;ST.bookPos={};ST.started=1}
_saveHooks.push(()=>{const s=JSON.parse(localStorage.getItem(SAVE_KEY)||'{}');Object.assign(s,{radios:ST.radios,radioGap:ST.radioGap,gapV:2,bookPos:ST.bookPos,started:1});localStorage.setItem(SAVE_KEY,JSON.stringify(s))});

const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.random()*(i+1)|0;[a[i],a[j]]=[a[j],a[i]]}return a};
const allWords=lv=>LEVELS[lv].books.flatMap(b=>b.w);

/* ---------- voice ----------
   every word and line is pre-recorded into one mp3 per level (audio/<lv>.mp3 + .json offsets),
   played through Web Audio so it also works inside app web views without speech synthesis */
const AUD={};
function loadAud(lv){if(AUD[lv])return AUD[lv].p;const a=AUD[lv]={};
  a.p=Promise.all([fetch(`audio/${lv}.json`).then(r=>r.json()),fetch(`audio/${lv}.mp3`).then(r=>r.arrayBuffer())])
    .then(([m,ab])=>{a.map=m;return new Promise((res,rej)=>A().decodeAudioData(ab,res,rej))}).then(b=>{a.buf=b}).catch(e=>{a.err=e});return a.p}
let voiceOut=null,clip=null;
function stopClip(){if(clip){try{clip.onended=null;clip.stop()}catch(e){}clip=null}window.speechSynthesis&&speechSynthesis.cancel()}
function say(lv,t,done){let fin=false;const end=()=>{if(!fin){fin=true;done&&done()}};
  if(!ST.sound){setTimeout(end,1500);return}
  const a=AUD[lv];
  if(!a||(!a.buf&&!a.err)){loadAud(lv).then(()=>say(lv,t,done));return}
  const seg=a.buf&&a.map[t];if(!seg){speak(t,{done:end});return}
  try{A();if(ac.state==='suspended')ac.resume();if(!voiceOut){voiceOut=ac.createGain();voiceOut.gain.value=1.5;voiceOut.connect(master)}
    stopClip();const s=ac.createBufferSource();s.buffer=a.buf;s.connect(voiceOut);s.onended=()=>{if(clip===s)clip=null;end()};s.start(0,seg[0],seg[1]);clip=s}catch(e){speak(t,{done:end})}}
document.addEventListener('pointerdown',()=>{try{A()}catch(e){}loadAud('es')},{once:true});
let voice=null;
function pickVoice(){const vs=speechSynthesis.getVoices().filter(v=>/^en[-_]/i.test(v.lang));voice=vs.find(v=>/en[-_]US/i.test(v.lang)&&/Samantha|Google|Natural/i.test(v.name))||vs.find(v=>/en[-_]US/i.test(v.lang))||vs[0]||null}
if(window.speechSynthesis){pickVoice();speechSynthesis.onvoiceschanged=pickVoice}
/* speaks and calls done() once the line has finished (or right away when it can't speak) */
function speak(t,{done}={}){let fin=false;const end=()=>{if(!fin){fin=true;done&&done()}};
  if(!window.speechSynthesis||!ST.sound){setTimeout(end,1200);return}
  try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(t);u.lang='en-US';if(voice)u.voice=voice;u.rate=.85;u.onend=end;u.onerror=end;speechSynthesis.speak(u);setTimeout(end,600+t.length*160)}catch(e){end()}}

/* ---------- toast ---------- */
function toast(html,ms=2600){const el=$('toast');el.innerHTML=html;el.classList.add('on');clearTimeout(el._t);el._t=setTimeout(()=>el.classList.remove('on'),ms)}
BEACH.on('toast',h=>toast(h));
$('toast').addEventListener('click',()=>$('toast').classList.remove('on'));

/* ---------- header ---------- */
function head(){$('coins').textContent=ST.coins.toLocaleString();const ph=phaseOf(GH());$('clock').textContent=ph[2]+' '+clockStr();$('snd').textContent=ST.sound?'🔊':'🔇'}
setInterval(head,1000);
$('snd').onclick=()=>{ST.sound=!ST.sound;ST.waves=ST.sound;ambient();if(!ST.sound){try{stopMusic(true)}catch(e){}stopClip()}else SFX.snd();save();head()};
function addCoins(n){ST.coins+=n;save();head();const c=document.querySelector('.coin');c.classList.remove('bump');void c.offsetWidth;c.classList.add('bump')}
function flyCoin(x,y,n,quick){const d=document.createElement('div');d.className='fly'+(quick?' quick':'');d.innerHTML=(quick?'<small>はやい！</small>':'')+'+'+n;d.style.left=x+'px';d.style.top=y+'px';document.body.appendChild(d);setTimeout(()=>d.remove(),1000)}

/* ---------- screens ---------- */
let screen='home';
function show(name,html){screen=name;panel.innerHTML=html;if(name!=='home')radioQuiet()}

function home(){
  show('home',`<section class="pnl home">
    <p id="rq" class="note"></p>
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
  $('cs').onclick=e=>{e.stopPropagation();say(lv,B.w[i][0])};
  loadAud(lv);
  $('cx').onclick=()=>{SFX.pop();books(lv)};
  cardKeys=e=>{if(e.key==='ArrowRight')go(1);if(e.key==='ArrowLeft')go(-1)};
  draw();
}
let cardKeys=null;
/* tapping anywhere outside the shop panel closes the shop (and that tap does nothing else) */
document.addEventListener('pointerdown',e=>{if(screen!=='shop'||e.target.closest('#panel,#toast,header'))return;
  e.preventDefault();e.stopPropagation();const eat=ev=>{ev.stopPropagation();ev.preventDefault()};document.addEventListener('click',eat,{capture:true,once:true});setTimeout(()=>document.removeEventListener('click',eat,true),400);
  SFX.pop();home()},true);
document.addEventListener('keydown',e=>{if(screen==='cards'&&cardKeys)cardKeys(e)});

/* ---------- radios on the beach ---------- */
const layer=document.createElement('div');layer.id='radios';$('window').appendChild(layer);
const bub=document.createElement('div');bub.id='abubs';$('window').appendChild(bub);
/* where the campfire sits, as fractions of the beach window, so radios keep clear of it */
function fireSpot(){try{const d=SC.dbg(),[fx,fy]=d.fire;return [(fx-d.WL)/d.WW,(fy-d.WT)/d.WH]}catch(e){return [.42,.8]}}
function clearOfFire(x,y){const [fx,fy]=fireSpot();return Math.abs(x-fx)>.17||Math.abs(y-fy)>.12}
function freeSpot(skip){const others=ST.radios.filter(r=>r!==skip);
  for(let t=0;t<80;t++){const x=.07+Math.random()*.86,y=.66+Math.random()*.1;if(clearOfFire(x,y)&&others.every(o=>Math.abs(o.x-x)>.1||Math.abs(o.y-y)>.06))return [x,y]}
  return [Math.random()<.5?.1:.9,.7]}
function placeRadios(){ST.radios.forEach(r=>{if(r.y==null||r.y>.78||!clearOfFire(r.x,r.y)){[r.x,r.y]=freeSpot(r)}})}
function drawRadios(){layer.innerHTML=ST.radios.map((r,i)=>`<button class="radio ${r.on?'on':''}" data-i="${i}" style="left:${r.x*100}%;top:${r.y*100}%" aria-label="${LEVELS[r.lv].name}ラジオ ${r.on?'オン':'オフ'}"><span class="rb">📻</span><b class="lv-${r.lv}">${LEVELS[r.lv].short}</b></button>`).join('');
  layer.querySelectorAll('.radio').forEach(b=>b.onclick=()=>{const r=ST.radios[+b.dataset.i];r.on=!r.on;save();drawRadios();SFX.beep(r.on?880:440);toast(`📻 ${LEVELS[r.lv].name}ラジオ <b>${r.on?'オン':'オフ'}</b>`,1400);if(screen==='home'){rqIdle();radioWake()}})}

let nextAt=0,talking=false,lastRadio=-1,cur=null;
function clearBubbles(){bub.querySelectorAll('.bubble').forEach(b=>{b.classList.add('gone');setTimeout(()=>b.remove(),260)})}
function radioQuiet(){talking=false;cur=null;stopClip();clearBubbles();layer.querySelectorAll('.talk').forEach(b=>b.classList.remove('talk'))}
function radioWake(){nextAt=Math.min(nextAt||Infinity,performance.now()+1500)}
function rqIdle(){const el=$('rq');if(!el)return;const on=ST.radios.filter(r=>r.on).length;
  el.textContent=!ST.radios.length?'📻 ショップで 小学生ラジオを もらおう（むりょう）。浜辺で 英語を つぶやくよ':on?'📻 ラジオの こたえが 浜辺に うかぶよ。タップして コインを もらおう':'📻 ラジオが ぜんぶ オフだよ。浜辺の ラジオを タップすると オンになるよ'}
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
  const [r,ri]=pickd;lastRadio=ri;cur=makeLine(r.lv);cur.ri=ri;cur.t0=performance.now();talking=true;
  const btn=layer.querySelector(`[data-i="${ri}"]`);btn&&btn.classList.add('talk');
  SFX.tick();drawLine(r);
  const c=cur;setTimeout(()=>{if(cur!==c){talking=false;return}say(c.lv,c.en,()=>{talking=false;btn&&btn.classList.remove('talk');nextAt=performance.now()+ST.radioGap*1000})},250);
}
setInterval(tick,250);
const BC=['#ffe066','#ff9ec4','#8ff0c8','#9fd3ff','#d4b8ff','#ffc078'];
const RISE=9,FAST_MS=5000;
/* the radio's line pops up above it; the answers rise from the sand one by one, like the poker mumbles */
function bubbleEl(html,cls){const b=document.createElement('div');b.className='bubble ab '+cls;
  b.innerHTML=`<span class="in" style="--bc:${pick(BC)};--tilt:${(Math.random()*8-4).toFixed(1)}deg">${html}${Math.random()<.35?'<i class="sp a">✦</i><i class="sp b">✦</i>':''}</span>`;bub.appendChild(b);return b}
function clampX(b,W){const w=b.offsetWidth,l=parseFloat(b.style.left);b.style.left=Math.max(6,Math.min(W.width-6-w,l))+'px'}
function drawLine(r){const c=cur;clearBubbles();const W=bub.getBoundingClientRect();
  /* the radio's English line sits at the top of the sky, in front of everything, so answers never cover it */
  const line=bubbleEl(`📻<b class="lvt lv-${c.lv}">${LEVELS[c.lv].short}</b> ${esc(c.en)} <i class="again">🔁</i>`,'line');
  line.style.left=(W.width/2-line.offsetWidth/2)+'px';line.style.top='10px';clampX(line,W);
  line.onclick=()=>say(c.lv,c.en);
  /* answers are born on the sand and float up like balloons until they press against the line */
  const lw=line.offsetWidth,lh=line.offsetHeight,lx=parseFloat(line.style.left)+lw/2,ly=10+lh/2;
  const room={w:W.width,floor:W.height*.86,fixed:[{x:lx,y:ly,r:lh/2,a:Math.max(0,lw/2-lh/2),im:0,vx:0,vy:0}]};
  shuffle(c.opts.map((o,i)=>i)).forEach((i,k)=>setTimeout(()=>{if(cur!==c)return;
    const b=bubbleEl(esc(c.opts[i]),'opt');b.dataset.o=i;b.onclick=()=>answer(c,i,b);
    const w=b.offsetWidth,h=b.offsetHeight,x=w/2+8+Math.random()*(room.w-w-16);
    addBody({el:b,w,h,x,y:room.floor-h/2,vx:Math.random()*30-15,vy:-40-Math.random()*30,born:performance.now(),room,c});SFX.pop()},350+k*520));
  /* nobody answered: the question drifts away with its bubbles */
  setTimeout(()=>{if(cur===c&&!c.done)cur=null},350+c.opts.length*520+RISE*1000)}
/* ---------- bubble physics ----------
   each bubble is a horizontal capsule (a pill: segment of half-length a, radius r) with mass from its area.
   Buoyancy lifts it, air drag slows it, and contacts are solved with impulses (restitution + friction).
   The hit also feeds a spring that squashes the bubble along the contact normal, so it wobbles back. */
const BUOY=230,DRAG=1.7,REST=.45,FRIC=.25,SQ_K=380,SQ_C=11,SUB=3;
let bodies=[],phys=0,lastT=0;
function addBody(o){Object.assign(o,{r:o.h/2,a:Math.max(0,o.w/2-o.h/2),d:0,dv:0,nx:0,ny:1,tilt:0});o.im=1/(o.w*o.h/1000);
  o.el.style.left='0';o.el.style.top='0';bodies.push(o);place(o);if(!phys){lastT=performance.now();phys=requestAnimationFrame(step)}}
function place(o){const th=Math.atan2(o.ny,o.nx),d=Math.max(-.16,Math.min(.22,o.d));
  o.el.style.transform=`translate(${(o.x-o.w/2).toFixed(1)}px,${(o.y-o.h/2).toFixed(1)}px) rotate(${o.tilt.toFixed(2)}deg) rotate(${th}rad) scale(${(1-d).toFixed(3)},${(1+d*.8).toFixed(3)}) rotate(${-th}rad)`}
/* a hit squashes the bubble along the normal; harder hits squash more */
function squash(o,nx,ny,dv){if(!o.el||o.frozen)return;const k=Math.min(.9,dv*.0045);if(k<.02)return;
  if(Math.abs(o.d)<.03){o.nx=nx;o.ny=ny}o.dv+=k*6}
/* closest approach of two horizontal capsules */
function contact(A,B){const dx=B.x-A.x,gap=Math.abs(dx)-(A.a+B.a),cx=gap>0?Math.sign(dx)*gap:0,cy=B.y-A.y;
  let len=Math.hypot(cx,cy);const pen=A.r+B.r+3-len;if(pen<=0)return null;
  if(len<1e-3)return {nx:0,ny:-1,pen};return {nx:cx/len,ny:cy/len,pen}}
function solve(A,B){const n=contact(A,B);if(!n)return;const ia=A.frozen?0:A.im,ib=B.frozen?0:B.im,is=ia+ib;if(!is)return;
  const rvx=B.vx-A.vx,rvy=B.vy-A.vy,vn=rvx*n.nx+rvy*n.ny;
  if(vn<0){const j=-(1+REST)*vn/is;A.vx-=j*ia*n.nx;A.vy-=j*ia*n.ny;B.vx+=j*ib*n.nx;B.vy+=j*ib*n.ny;
    const tx=-n.ny,ty=n.nx,vt=rvx*tx+rvy*ty,jt=Math.max(-FRIC*j,Math.min(FRIC*j,-vt/is));A.vx-=jt*ia*tx;A.vy-=jt*ia*ty;B.vx+=jt*ib*tx;B.vy+=jt*ib*ty;
    squash(A,n.nx,n.ny,-vn*ia/is*2);squash(B,n.nx,n.ny,-vn*ib/is*2)}
  const corr=Math.max(0,n.pen-.5)*.6/is;A.x-=n.nx*corr*ia;A.y-=n.ny*corr*ia;B.x+=n.nx*corr*ib;B.y+=n.ny*corr*ib}
function walls(o){const R=o.room,L=o.a+o.r;
  if(o.x-L<6){o.x=6+L;if(o.vx<0){squash(o,1,0,-o.vx);o.vx=-o.vx*REST}}
  if(o.x+L>R.w-6){o.x=R.w-6-L;if(o.vx>0){squash(o,-1,0,o.vx);o.vx=-o.vx*REST}}
  if(o.y-o.r<4){o.y=4+o.r;if(o.vy<0){squash(o,0,1,-o.vy);o.vy=-o.vy*REST}}}
function step(now){const DT=Math.min(.05,(now-lastT)/1000);lastT=now;const dt=DT/SUB;
  for(let s=0;s<SUB;s++){
    for(const o of bodies){if(o.frozen||o.fading)continue;
      o.vy-=BUOY*dt;o.vx+=Math.sin(now/900+o.born)*10*dt;                 // buoyancy and a light breeze
      const drag=Math.exp(-DRAG*dt);o.vx*=drag;o.vy*=drag;o.x+=o.vx*dt;o.y+=o.vy*dt}
    const live=bodies.filter(o=>!o.fading);
    for(let i=0;i<live.length;i++){for(let j=i+1;j<live.length;j++)solve(live[i],live[j]);for(const f of live[i].room.fixed)solve(f,live[i])}
    live.forEach(o=>{if(!o.frozen)walls(o)})}
  for(const o of bodies){
    o.dv+=(-SQ_K*o.d-SQ_C*o.dv)*DT;o.d+=o.dv*DT;                             // squash spring
    o.tilt+=((Math.max(-9,Math.min(9,o.vx*.06)))-o.tilt)*Math.min(1,DT*5);
    if(now-o.born>RISE*1000&&!o.fading){o.fading=1;o.el.classList.add('gone')}}
  bodies=bodies.filter(o=>{if(o.fading&&now-o.born>RISE*1000+400){o.el.remove();return false}return o.el.isConnected});
  bodies.forEach(place);
  phys=bodies.length?requestAnimationFrame(step):0}
/* keep the line bubble inside the beach window when the screen size changes */
function fitBubbles(){const W=bub.getBoundingClientRect();bub.querySelectorAll('.bubble.line').forEach(b=>clampX(b,W));bodies.forEach(o=>o.room.w=W.width)}
function answer(c,i,b){if(c!==cur||c.done)return;c.done=1;const ok=c.opts[i]===c.ja,L=LEVELS[c.lv];
  bodies.forEach(o=>{if(o.c===c){o.frozen=1;o.vx=o.vy=0}});
  bub.querySelectorAll('.opt').forEach(x=>{if(c.opts[+x.dataset.o]===c.ja)x.classList.add('right');else if(x!==b)x.classList.add('gone')});
  const rc=b.getBoundingClientRect(),cx=rc.left+rc.width/2,cy=rc.top+rc.height/2;
  /* a quick answer (within FAST_MS of the line starting) earns the level's fast reward */
  const quick=L.fast&&performance.now()-c.t0<=FAST_MS,amt=quick?L.fast:L.reward;
  if(ok){coinBurst(cx,cy,amt,quick);FX.ring(cx,cy,'#ffd23f');FX.firework(cx,cy-10);SFX.chime()}
  else{b.classList.add('wrong');SFX.tie()}
  setTimeout(()=>{if(cur===c){cur=null;clearBubbles()}},ok?1500:2400)}
/* coins burst out of the bubble and fly into the coin counter, ringing as each one lands */
function coinBurst(x,y,amt,quick){const tg=document.querySelector('.coin i').getBoundingClientRect(),tx=tg.left+tg.width/2,ty=tg.top+tg.height/2;
  const n=Math.min(12,Math.max(3,amt*2));let left=amt;flyCoin(x,y-18,amt,quick);
  for(let k=0;k<n;k++){const share=k===n-1?left:Math.floor(amt/n);left-=share;
    const d=document.createElement('i');d.className='cfly';document.body.appendChild(d);
    const a=Math.random()*Math.PI*2,sp=36+Math.random()*46,mx=x+Math.cos(a)*sp,my=y+Math.sin(a)*sp-24;
    const an=d.animate([{transform:`translate(${x}px,${y}px) scale(.3)`,opacity:1},{transform:`translate(${mx}px,${my}px) scale(1.15)`,opacity:1,offset:.32},{transform:`translate(${tx}px,${ty}px) scale(.6)`,opacity:.9}],
      {duration:760+k*70,easing:'cubic-bezier(.45,0,.55,1)',fill:'forwards'});
    an.onfinish=()=>{d.remove();if(share)addCoins(share);SFX.coin()}}}

/* ---------- shop ---------- */
function shop(tab){
  const radioRows=LV_ORDER.map(k=>{const L=LEVELS[k],n=ST.radios.filter(r=>r.lv===k).length;return `<div class="ritem">
      <span class="ri">📻<b class="lv-${k}">${L.short}</b></span>
      <span class="rn"><b>${L.name}ラジオ</b><small>${L.choices}たく・せいかい +${L.reward}${L.fast?`（${FAST_MS/1000}びょう いないなら +${L.fast}）`:''}　もっている ${n}だい</small></span>
      <span class="rbtn"><button class="buy" data-k="${k}" ${ST.coins<L.price?'disabled':''}>${L.price?'かう 🪙'+L.price.toLocaleString():'もらう（むりょう）'}</button><button class="sell sub" data-k="${k}" ${n?'':'disabled'}>${L.price?'うる +'+(L.price/2|0):'てばなす'}</button></span>
    </div>`}).join('');
  const decoGrid=`<div class="goods">${DECOS.map(([n,c,ico])=>{const has=hasDeco(n);return `<button class="good ${has?'has':''}" data-n="${n}" data-c="${c}" ${has||ST.coins<c?'disabled':''}><span class="gi">${ico}</span><span class="gn">${n}</span><span class="gc">${has?'かざり中':'🪙 '+c.toLocaleString()}</span></button>`}).join('')}</div>`;
  show('shop',`<section class="pnl shop">
    <div class="qtop"><button class="x" id="sx" aria-label="ショップを とじる">←</button><b>🛍️ ショップ</b><span></span></div>
    <div class="seg"><button data-t="radio" class="${tab==='radio'?'on':''}">📻 ラジオ</button><button data-t="deco" class="${tab==='deco'?'on':''}">✨ かざり</button></div>
    ${tab==='radio'?`<div class="rlist">${radioRows}</div><p class="note">ラジオは 何台でも おけるよ。うると かった ねだんの はんぶんが もどってくる（小学生ラジオは むりょう）</p>`:decoGrid}
  </section>`);
  $('sx').onclick=()=>{SFX.pop();home()};
  panel.querySelectorAll('[data-t]').forEach(b=>b.onclick=()=>{SFX.pop();shop(b.dataset.t)});
  panel.querySelectorAll('.buy').forEach(b=>b.onclick=()=>{const k=b.dataset.k,L=LEVELS[k];if(ST.coins<L.price)return;
    ST.coins-=L.price;const [x,y]=freeSpot();ST.radios.push({lv:k,on:true,x,y});save();head();drawRadios();SFX.save();toast(`📻 <b>${L.name}ラジオ</b> を 浜辺に おいた！`);shop('radio')});
  panel.querySelectorAll('.sell').forEach(b=>b.onclick=()=>{const k=b.dataset.k,L=LEVELS[k];let idx=-1;ST.radios.forEach((r,i)=>{if(r.lv===k)idx=i});if(idx<0)return;
    ST.radios.splice(idx,1);if(L.price)addCoins(L.price/2|0);drawRadios();SFX.coin();toast(`📻 ${L.name}ラジオを ${L.price?'うった':'てばなした'}`);shop('radio')});
  panel.querySelectorAll('.good').forEach(b=>b.onclick=()=>{const n=b.dataset.n,c=+b.dataset.c;if(ST.coins<c||hasDeco(n))return;
    ST.coins-=c;ST.deco[n]=true;save();head();SC.update(ST.coins);SFX.save();const r=b.getBoundingClientRect();FX.firework(r.left+r.width/2,r.top);toast(`✨ <b>${n}</b> を かざった！`);shop('deco')});
}

save();head();setTimeout(()=>{placeRadios();save();drawRadios()},300);home();SC.update(ST.coins);
addEventListener('resize',()=>{if(cur)fitBubbles()});
})();
