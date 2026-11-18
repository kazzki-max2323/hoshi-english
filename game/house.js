/* 🏠 浜辺の 家（コインの 使い道）
   - 浜辺の 砂の 上（左の 手前）に 「売り地」の 看板。 タップ → コインで 家を 建てる（HOUSE_LV: 小屋 → テラスつき → 2かいだて）
   - へやの 中: 家具・かべがみ・ゆか・ペット を 🛋️ 家具カタログ（ノラさんの 店の とりよせ）で 買って おく。 タップすると 英語の 名前を 読む
   - 🔔 まねく: ミナ先生・ミオが 遊びに 来る（1日 1回ずつ・英語の 会話。 はじめての 日は 新築祝いを くれる）
   - 💑 デートで 買った おそろいの 品（game/date.js）は 窓の 下の たなに ならぶ
   - 📒 家の 英語: もっている 家具の 英語と 例文
   - 浜辺の 位置は game/game.js の sandSpots() にも 入れてある（ラジオよけ）。 いっしょに なおすこと
   データは localStorage SAVE_KEY の house = {lv, own:{id:1}, put:{slot:id}, vis:{mina:日,mio:日}, seen:{talk:回数}, n} */
(()=>{
const {S:ST,sfx:SFX}=BEACH;
const H=HE,esc=H.esc,$=id=>document.getElementById(id);
const pickL=a=>a[Math.random()*a.length|0];
const sf=k=>{try{SFX[k]&&SFX[k]()}catch(e){}};
const today=()=>{const d=new Date();return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate()};
const IT=HOUSE_ITEMS,item=id=>IT.find(i=>i.id===id);

const HS=(()=>{try{const s=JSON.parse(localStorage.getItem(SAVE_KEY)||'{}').house;if(s&&s.own)return s}catch(e){}
  return {lv:0,own:{w_white:1,fl_wood:1},put:{wall:'w_white',floor:'fl_wood'},vis:{},seen:{},n:0}})();
_saveHooks.push(()=>{const s=JSON.parse(localStorage.getItem(SAVE_KEY)||'{}');s.house=HS;localStorage.setItem(SAVE_KEY,JSON.stringify(s))});
const built=()=>HS.lv>=1;
const slotLv=s=>s==='wall'||s==='floor'||s==='rug'?1:(HOUSE_SLOTS[s]||[0,0,0,0,1])[4];
const putOf=s=>HS.put[s]?item(HS.put[s]):null;
const ownN=()=>Object.keys(HS.own).filter(id=>item(id)&&item(id).p>0||item(id)&&item(id).gift).length;
const bare=en=>String(en).replace(/^(a|an|the) /,'');
const minaBox=(k,v)=>{try{const [ex,tx]=MINA.line(k,v||{});return `<div class="kmina"><span class="lface">${MINA.face('m',ex)}</span><p>${tx}</p></div>`}catch(e){return ''}};
const top=(t,id)=>`<div class="qtop"><button class="x" id="${id}" aria-label="もどる">←</button><b>${t}</b><span class="qn">🪙 ${ST.coins.toLocaleString()}</span></div>`;
const say=en=>{try{H.say('jh',en)}catch(e){}};

/* ================================================================ 浜辺の 絵 */
const WINF='fill="var(--win)"';
const ART=[
/* 0 売り地: 木の 看板と ロープの くい */
`<svg viewBox="0 0 72 64" aria-hidden="true"><ellipse cx="36" cy="60" rx="26" ry="2.6" fill="#0003"/>
 <g stroke="#7a5534" stroke-width="1.6"><line x1="12" y1="52" x2="12" y2="60"/><line x1="60" y1="52" x2="60" y2="60"/><line x1="24" y1="54" x2="24" y2="60"/><line x1="48" y1="54" x2="48" y2="60"/></g>
 <path d="M12 53 Q18 56 24 55 Q36 58 48 55 Q54 56 60 53" fill="none" stroke="#e8d6a8" stroke-width=".8"/>
 <rect x="34.6" y="34" width="2.8" height="26" fill="#8a5a36"/><rect x="22" y="26" width="28" height="15" rx="1.4" fill="#e9c98a" stroke="#7a5534" stroke-width="1.2"/>
 <text x="36" y="32.4" font-size="5.2" text-anchor="middle" fill="#7a3a22" font-family="sans-serif" font-weight="700">FOR SALE</text><text x="36" y="38.6" font-size="4.6" text-anchor="middle" fill="#5a3a22" font-family="sans-serif">売り地</text></svg>`,
/* 1 小さな 小屋 */
`<svg viewBox="0 0 72 64" aria-hidden="true"><ellipse cx="36" cy="60" rx="27" ry="2.8" fill="#0003"/>
 <rect x="45" y="13" width="5" height="12" fill="#8a6a5a"/><rect x="44" y="11.6" width="7" height="2.4" fill="#6a4a3a"/>
 <path d="M10 31 L36 12 L62 31 Z" fill="#c4553f"/><path d="M10 31 L36 12 L62 31" fill="none" stroke="#8a3424" stroke-width="1.4"/>
 <rect x="15" y="30" width="42" height="29" fill="#e8c592"/><g stroke="#c9a06c" stroke-width=".6">${[35,40,45,50,55].map(y=>`<line x1="15" y1="${y}" x2="57" y2="${y}"/>`).join('')}</g>
 <rect x="20" y="37" width="11" height="10" rx="1" ${WINF}/><path d="M25.5 37 V47 M20 42 H31" stroke="#6a4a3a" stroke-width="1"/><rect x="19" y="36" width="13" height="12" rx="1.4" fill="none" stroke="#6a4a3a" stroke-width="1.2"/>
 <rect x="39" y="40" width="11" height="19" rx="1" fill="#7a4a30"/><circle cx="47.6" cy="50" r=".9" fill="#ffd27a"/>
 <rect x="35" y="56.6" width="19" height="2.4" fill="#b08458"/></svg>`,
/* 2 テラスつきの 家 */
`<svg viewBox="0 0 72 64" aria-hidden="true"><ellipse cx="36" cy="60" rx="33" ry="3" fill="#0003"/>
 <rect x="47" y="9" width="5" height="12" fill="#8a6a5a"/><rect x="46" y="7.6" width="7" height="2.4" fill="#6a4a3a"/>
 <path d="M8 28 L34 10 L60 28 Z" fill="#3f7fb5"/><path d="M8 28 L34 10 L60 28" fill="none" stroke="#24507a" stroke-width="1.4"/>
 <rect x="12" y="27" width="44" height="27" fill="#f4eee0"/>
 <rect x="16" y="33" width="10" height="9" rx="1" ${WINF}/><rect x="15" y="32" width="12" height="11" rx="1.4" fill="none" stroke="#24507a" stroke-width="1.2"/><path d="M21 33 V42" stroke="#24507a" stroke-width=".9"/>
 <rect x="42" y="33" width="10" height="9" rx="1" ${WINF}/><rect x="41" y="32" width="12" height="11" rx="1.4" fill="none" stroke="#24507a" stroke-width="1.2"/><path d="M47 33 V42" stroke="#24507a" stroke-width=".9"/>
 <rect x="29" y="37" width="10" height="17" rx="1" fill="#24507a"/><circle cx="37" cy="46" r=".9" fill="#ffd27a"/>
 <rect x="4" y="54" width="64" height="4" fill="#b08458"/><g stroke="#8a6040" stroke-width="1"><line x1="4" y1="48" x2="68" y2="48"/>${[4,10,16,56,62,68].map(x=>`<line x1="${x}" y1="48" x2="${x}" y2="54"/>`).join('')}</g>
 <circle cx="61" cy="45" r="3" fill="#4fae5a"/><rect x="59.4" y="46" width="3.2" height="3" fill="#c46a3a"/><circle cx="8" cy="45.6" r="2.4" fill="#ff8aa8"/><rect x="6.6" y="46.4" width="2.8" height="2.6" fill="#c46a3a"/></svg>`,
/* 3 2かいだての 家 */
`<svg viewBox="0 0 72 64" aria-hidden="true"><ellipse cx="36" cy="60" rx="33" ry="3" fill="#0003"/>
 <line x1="34" y1="1" x2="34" y2="8" stroke="#555" stroke-width=".8"/><path d="M34 1.4 L40 3 L34 4.6Z" fill="#ffcf4a"/>
 <path d="M12 21 L34 6 L56 21 Z" fill="#3f8a5a"/><path d="M12 21 L34 6 L56 21" fill="none" stroke="#24603a" stroke-width="1.3"/>
 <rect x="15" y="20" width="38" height="16" fill="#fbf3e2"/><circle cx="34" cy="27.6" r="4.6" ${WINF}/><circle cx="34" cy="27.6" r="5.2" fill="none" stroke="#24603a" stroke-width="1.2"/><path d="M34 23 V32.2 M29.4 27.6 H38.6" stroke="#24603a" stroke-width=".8"/>
 <path d="M8 37 L34 31 L60 37 Z" fill="#3f8a5a"/><rect x="11" y="36" width="46" height="18" fill="#f4eee0"/>
 <rect x="15" y="40" width="9" height="8" rx="1" ${WINF}/><rect x="14" y="39" width="11" height="10" rx="1.4" fill="none" stroke="#24603a" stroke-width="1.1"/>
 <rect x="44" y="40" width="9" height="8" rx="1" ${WINF}/><rect x="43" y="39" width="11" height="10" rx="1.4" fill="none" stroke="#24603a" stroke-width="1.1"/>
 <rect x="29" y="41" width="10" height="13" rx="1" fill="#24603a"/><circle cx="37" cy="48" r=".9" fill="#ffd27a"/>
 <rect x="4" y="54" width="64" height="4" fill="#b08458"/><g stroke="#8a6040" stroke-width="1"><line x1="4" y1="49" x2="68" y2="49"/>${[4,10,16,56,62,68].map(x=>`<line x1="${x}" y1="49" x2="${x}" y2="54"/>`).join('')}</g>
 <circle cx="62" cy="46" r="3" fill="#4fae5a"/><rect x="60.4" y="47" width="3.2" height="2.6" fill="#c46a3a"/></svg>`];
const GLOW=`<svg viewBox="0 0 72 64" aria-hidden="true"><defs><radialGradient id="hsg"><stop offset="0" stop-color="rgba(255,200,120,.7)"/><stop offset="1" stop-color="rgba(255,200,120,0)"/></radialGradient></defs>
 <ellipse cx="36" cy="60" rx="30" ry="4" fill="url(#hsg)" opacity=".4"/><ellipse cx="36" cy="40" rx="24" ry="16" fill="url(#hsg)" opacity=".55"/></svg>`;
/* 浜辺の 左の 手前（リクの 下・たき火の 左）。 game.js sandSpots() と いっしょに なおす */
const BOX=d=>{const k=d.k,w=Math.round((HS.lv>=2?60:HS.lv===1?52:40)*k);return {w,x:Math.round(d.WW*.22-w/2),y:Math.round(d.shore-d.WT+96*k-w*60/72)}};
function hut(){let b=$('hsHut');const w=$('window');if(!w)return;
  if(!b){b=document.createElement('button');b.id='hsHut';w.appendChild(b);
    b.onclick=e=>{e.stopPropagation();if(H.screen!=='home')return;sf('step');open()}}
  if(b.dataset.lv!==String(HS.lv)){b.dataset.lv=HS.lv;b.setAttribute('aria-label',built()?'わたしの 家':'売り地');b.innerHTML=`<span class="hsBody">${ART[HS.lv]}</span>${built()?`<span class="hsGlow">${GLOW}</span>`:''}`}
  let d;try{d=SCENE.dbg()}catch(e){return}
  const o=BOX(d);b.style.width=o.w+'px';b.style.left=o.x+'px';b.style.top=o.y+'px';
  const dk=Math.max(0,Math.min(1,d.dark||0));b.style.setProperty('--dk',dk.toFixed(2));
  b.classList.toggle('off',H.screen!=='home')}
setTimeout(hut,700);addEventListener('resize',()=>setTimeout(hut,200));setInterval(hut,2500);
H.on('home',()=>setTimeout(hut,80));

/* ================================================================ へや */
function roomHtml(){const wall=putOf('wall')||item('w_white'),fl=putOf('floor')||item('fl_wood'),rug=putOf('rug');
  let dark=0;try{dark=SCENE.dbg().dark||0}catch(e){}
  const wallBg=wall.stars?`radial-gradient(circle at 20% 30%,#fff 0 1px,transparent 1.5px),radial-gradient(circle at 70% 15%,#fff 0 1px,transparent 1.5px),radial-gradient(circle at 85% 45%,#ffe 0 1px,transparent 1.5px),radial-gradient(circle at 40% 50%,#fff 0 .8px,transparent 1.3px),${wall.c}`:wall.stripe?`repeating-linear-gradient(90deg,${wall.c} 0 18px,#b8875a 18px 19px)`:wall.c;
  const flBg=fl.tatami?`repeating-linear-gradient(90deg,${fl.c} 0 38px,#a8a060 38px 40px)`:fl.check?`repeating-conic-gradient(#2a2a2a 0 25%,#e8e4dc 0 50%) 0 0/24px 24px`:`repeating-linear-gradient(90deg,${fl.c} 0 30px,#8a5a2e 30px 31px)`;
  const sky=dark>.6?'linear-gradient(#0b1030,#25306a)':dark>.25?'linear-gradient(#ff9a6a,#6a5aa8)':'linear-gradient(#8fd3ff,#d8f2ff)';
  const pairs=window.DATE?DATE.pairs():[];
  const things=Object.keys(HOUSE_SLOTS).filter(s=>HS.lv>=slotLv(s)).map(s=>{const it=putOf(s);if(!it)return '';const [x,y,z,zi]=HOUSE_SLOTS[s];
    return `${s==='table'?`<span class="hstable" style="left:${x}%;top:${y+7}%"></span>`:''}<button class="hsit" data-it="${it.id}" style="left:${x}%;top:${y}%;--s:${z};z-index:${zi}" aria-label="${esc(it.n)}">${it.ico}</button>`}).join('');
  return `<div class="hsroom lv${HS.lv}" style="--wall:${wall.c}">
    <div class="hswall" style="background:${wallBg}"></div><div class="hsfloor" style="background:${flBg}"></div>
    <div class="hswin" style="background:${sky}">${dark>.6?'<i class="hsmoon"></i>':'<i class="hssea"></i>'}</div>
    ${pairs.length?`<div class="hspair">${pairs.map(p=>`<button data-pr="${p.id}" aria-label="${esc(p.n)}">${p.ico}</button>`).join('')}</div>`:''}
    ${HS.lv>=3?'<span class="hsladder">🪜</span><span class="hsloft"></span>':''}
    ${rug?`<span class="hsrug" style="background:${rug.c==='rainbow'?'conic-gradient(#ff5c8a,#ffd23f,#55e0b4,#7aa2ff,#c58cff,#ff5c8a)':rug.c}"></span>`:''}
    ${things}<div class="hsbub" id="hsbub" hidden></div></div>`}
function fitRoom(){const r=H.panel.querySelector('.hsroom');if(r)r.style.setProperty('--rw',r.clientWidth+'px')}
function bindRoom(){fitRoom();const bub=$('hsbub');
  const pop=(el,ico,en,ja)=>{if(!bub)return;bub.innerHTML=`<b>${ico} ${esc(en)}</b><small>${esc(ja)}</small>`;bub.hidden=false;
    const r=el.getBoundingClientRect(),R=bub.parentNode.getBoundingClientRect();bub.style.left=Math.max(4,Math.min(R.width-150,r.left-R.left+r.width/2-75))+'px';bub.style.top=Math.max(4,r.top-R.top-46)+'px';
    clearTimeout(pop.t);pop.t=setTimeout(()=>{bub.hidden=true},3200);say(en)};
  H.panel.querySelectorAll('.hsit').forEach(b=>b.onclick=e=>{e.stopPropagation();const it=item(b.dataset.it);sf('tap');b.classList.remove('hop');void b.offsetWidth;b.classList.add('hop');pop(b,it.ico,it.en,it.n)});
  H.panel.querySelectorAll('.hspair [data-pr]').forEach(b=>b.onclick=e=>{e.stopPropagation();const p=DATE_PAIRS.find(x=>x.id===b.dataset.pr);sf('tap');pop(b,p.ico,p.en,p.n+'（ミオと おそろい）')})}

/* ================================================================ 家の 画面 */
function open(){if(!built())return lot();
  const L=HOUSE_LV[HS.lv],nx=HOUSE_LV[HS.lv+1],mOk=mioOk(),vm=HS.vis.mina!==today(),vo=mOk&&HS.vis.mio!==today();
  const mk=!ownN()?'hs_empty':vm||vo?'hs_invite':nx&&ST.coins>=nx.p?'hs_grow':'hs_room';
  H.show('house',`<section class="pnl hs">
    ${top(`${L.ico} わたしの 家`,'hsx')}
    ${roomHtml()}
    <p class="hstip">家具を タップすると 英語の 名前が きけるよ</p>
    <div class="hsmenu">
      <button id="hscat"><span>🛋️</span><b>家具カタログ</b></button>
      <button id="hsmina" ${vm?'':'disabled'}><span class="hsf">${MINA.face('m','smile')}</span><b>ミナ先生を まねく<small>${vm?'1日 1回':'また あした'}</small></b></button>
      ${mOk?`<button id="hsmio" ${vo?'':'disabled'}><span class="hsf">${MIO.face('smile','')}</span><b>ミオを まねく<small>${vo?'1日 1回':'また あした'}</small></b></button>`:''}
      <button id="hsword"><span>📒</span><b>家の 英語<small>${ownN()}こ</small></b></button>
    </div>
    ${nx?`<button id="hsup" class="hsup"><span>🔨</span><b>${nx.ico} ${esc(nx.n)}に する<small>${esc(nx.d)}</small></b><i>🪙${nx.p.toLocaleString()}</i></button>`:''}
    ${minaBox(mk,{n:L.n,nx:nx?nx.n:''})}
  </section>`);
  bindRoom();
  $('hsx').onclick=()=>{sf('back');H.home()};
  $('hscat').onclick=()=>{sf('book');catalog()};
  $('hsword').onclick=()=>{sf('book');words()};
  const bm=$('hsmina');if(bm)bm.onclick=()=>{if(bm.disabled)return;sf('step');visit('mina')};
  const bo=$('hsmio');if(bo)bo.onclick=()=>{if(bo.disabled)return;sf('step');visit('mio')};
  const up=$('hsup');if(up)up.onclick=()=>{sf('step');grow()}}

/* ---------- 売り地 → 建てる ---------- */
function lot(){const L=HOUSE_LV[1];
  H.show('house',`<section class="pnl hs">
    ${top('🪧 浜辺の 売り地','hsx')}
    <div class="hslot">${ART[0]}<p><b>FOR SALE</b><small>海が 見える 小さな 土地</small></p></div>
    <p class="hsen">"This land is for sale. Build your own little house by the sea!"<small>「この 土地 売ります。 海の そばに 自分の 小さな 家を 建てよう！」</small></p>
    <button id="hsbuild" class="hsup"><span>🔨</span><b>${L.ico} ${esc(L.n)}を 建てる<small>${esc(L.d)}・ミナ先生や ミオが 遊びに 来る</small></b><i>🪙${L.p.toLocaleString()}</i></button>
    ${minaBox(ST.coins>=L.p?'hs_lotOk':'hs_lot',{p:L.p.toLocaleString(),r:Math.max(0,L.p-ST.coins).toLocaleString()})}
  </section>`);
  $('hsx').onclick=()=>{sf('back');H.home()};
  $('hsbuild').onclick=()=>grow()}
function grow(){const nx=HOUSE_LV[HS.lv+1];if(!nx)return;
  if(ST.coins<nx.p){sf('no');H.toast(`🪙 コインが たりないよ <small>${esc(nx.n)}は ${nx.p.toLocaleString()}まい（あと ${(nx.p-ST.coins).toLocaleString()}まい）</small>`,3000);return}
  H.addCoins(-nx.p);HS.lv++;save();hut();
  try{RECENT.add('house',{kind:'build',lv:HS.lv,ja:nx.n,ico:nx.ico})}catch(e){}
  try{SFX.fanfare(2)}catch(e){sf('done')}
  try{[0,400,800].forEach(t=>setTimeout(()=>FX.firework(innerWidth*(.25+Math.random()*.5),innerHeight*.3),t))}catch(e){}
  H.show('house',`<section class="pnl hs hsdone">
    ${top(`${nx.ico} ${esc(nx.n)}`,'hsx')}
    <div class="hsbig">${ART[HS.lv]}</div>
    <p class="hsen">"${esc(HS.lv===1?'Welcome home!':'Your house got bigger!')}"<small>${HS.lv===1?'「おかえりなさい！」 自分の 家が できた！':'家が 大きく なった！'}</small></p>
    <p class="kpay">🔨 ${esc(nx.n)}（${esc(nx.en)}）が できた！</p>
    ${minaBox('hs_built'+HS.lv,{n:nx.n})}
    <div class="row"><button id="hsin">🚪 中に 入る</button></div></section>`);
  say(HS.lv===1?'Welcome home!':'Your house got bigger!');
  $('hsx').onclick=$('hsin').onclick=()=>{sf('step');open()}}

/* ---------- 🛋️ 家具カタログ ---------- */
const SLOT_ORDER=['wall','floor','rug','bed','chair','table','shelf','lamp','plant','music','pic','clock','sill','pet','loft'];
function catalog(open1){
  const grp=SLOT_ORDER.map(s=>{const L=IT.filter(i=>i.slot===s&&(i.p>0||HS.own[i.id])),need=slotLv(s),lock=HS.lv<need;
    const cur=HS.put[s];
    const rows=lock?`<p class="note">🔒 ${HOUSE_LV[need].ico} ${esc(HOUSE_LV[need].n)}に すると おけるよ</p>`:L.map(i=>{const own=HS.own[i.id],on=cur===i.id;
      return `<div class="ritem"><span class="ri">${i.ico}</span><span class="rn"><b>${esc(i.n)}</b><small>${esc(i.en)}</small></span><span class="rbtn">${on?(s==='wall'||s==='floor'?'<i class="hson">おいてる</i>':`<button class="sub" data-off="${s}">しまう</button>`):own?`<button data-put="${i.id}">おく</button>`:`<button data-buy="${i.id}">🪙${i.p.toLocaleString()}</button>`}</span></div>`}).join('');
    const ic=cur&&item(cur)?item(cur).ico:'';
    return `<details class="shmore hscg"${open1===s?' open':''}><summary>${esc(HOUSE_SLOT_N[s])} ${lock?'🔒':ic}</summary><div class="zkbag">${rows}</div></details>`}).join('');
  H.show('house',`<section class="pnl hs">
    ${top('🛋️ 家具カタログ','hsx')}
    <p class="hsen">"Nora's mail order. Anything you buy will be delivered right away!"<small>ノラさんの お店の とりよせ。 買うと すぐ とどくよ</small></p>
    ${grp}
  </section>`);
  $('hsx').onclick=()=>{sf('back');open()};
  H.panel.querySelectorAll('[data-buy]').forEach(b=>b.onclick=()=>buy(b.dataset.buy));
  H.panel.querySelectorAll('[data-put]').forEach(b=>b.onclick=()=>{const it=item(b.dataset.put);HS.put[it.slot]=it.id;save();sf('pop');H.toast(`${it.ico} ${esc(it.n)}を おいたよ`,1600);catalog(it.slot)});
  H.panel.querySelectorAll('[data-off]').forEach(b=>b.onclick=()=>{const s=b.dataset.off;delete HS.put[s];save();sf('back');catalog(s)})}
function buy(id){const it=item(id);if(!it||HS.own[id])return;
  if(ST.coins<it.p){sf('no');H.toast(`🪙 コインが たりないよ <small>あと ${(it.p-ST.coins).toLocaleString()}まい</small>`,2600);return}
  H.addCoins(-it.p);HS.own[id]=1;HS.put[it.slot]=id;HS.n++;save();sf('coin');
  try{RECENT.add('house',{kind:'buy',id,en:it.en,ja:it.n,ico:it.ico})}catch(e){}
  H.show('house',`<section class="pnl hs">
    ${top(`${it.ico} とどいた！`,'hsx')}
    ${roomHtml()}
    <div class="hsgot"><b>${it.ico} ${esc(it.en)}</b><small>${esc(it.n)}</small><p>"${esc(it.ph[0])}"<button class="ksay" aria-label="きく">🔊</button><small>${esc(it.ph[1])}</small></p></div>
    ${minaBox(it.slot==='pet'?'hs_pet':it.slot==='wall'||it.slot==='floor'?'hs_wall':'hs_buy',{n:it.n,en:it.en})}
    <div class="row"><button id="hsmore" class="sub">🛋️ カタログに もどる</button><button id="hsok" data-back>へやへ</button></div></section>`);
  bindRoom();say(it.en);
  H.panel.querySelector('.hsgot .ksay').onclick=()=>say(it.ph[0]);
  setTimeout(()=>{const b=H.panel.querySelector(`.hsit[data-it="${id}"]`);if(b)b.classList.add('hop')},200);
  $('hsx').onclick=$('hsok').onclick=()=>{sf('back');open()};
  $('hsmore').onclick=()=>{sf('book');catalog(it.slot)}}

/* ---------- 📒 家の 英語 ---------- */
function words(){const L=IT.filter(i=>HS.own[i.id]&&(i.p>0||i.gift));
  H.show('house',`<section class="pnl hs">
    ${top(`📒 家の 英語 ${L.length}`,'hsx')}
    ${L.length?`<div class="zkbag">${L.map(i=>`<div class="ritem hswd" data-en="${esc(i.ph[0])}"><span class="ri">${i.ico}</span><span class="rn"><b>${esc(i.en)} <small>${esc(i.n)}</small></b><small>${esc(i.ph[0])}<br>${esc(i.ph[1])}</small></span><span class="rbtn"><button class="sub" aria-label="きく">🔊</button></span></div>`).join('')}</div>`:'<p class="note">まだ 家具が ないよ。 🛋️ 家具カタログで 買ってみよう</p>'}
    ${minaBox('hs_words',{c:L.length})}
  </section>`);
  $('hsx').onclick=()=>{sf('back');open()};
  H.panel.querySelectorAll('.hswd').forEach(r=>r.querySelector('button').onclick=()=>say(r.dataset.en))}

/* ================================================================ 🔔 遊びに 来る */
const mioOk=()=>{try{return SHOP.rec().met&&MIOC.stage()>=2}catch(e){return false}};
const romOf=w=>{try{if(w==='mio')return !!(window.DATE&&DATE.romantic());return WED.romantic('mina')&&WED.who()!=='mio'}catch(e){return false}};
const KNOCK={mina:[["Knock, knock! It's me, Mina. Are you home?","コンコン！ ミナです。 いる？"],["Hello? It's Mina. I was walking on the beach and saw your house!","こんにちは？ ミナです。 浜辺を 歩いてたら 家が 見えたから！"]],
 mio:[["Knock, knock! Boss, it's Mio! Open up!","コンコン！ 店長、 ミオです！ あけて〜！"],["Boss? Are you there? It's me! I came to play!","店長？ いますか？ わたしです！ 遊びに 来ました！"]]};
const LOOK={mina:[["Oh, {en}! Nice. Do you know how to say it? '{bare}'. Say it with me!","あ、 {n}！ いいね。 英語で 言える？ 「{bare}」。 いっしょに 言ってみて！"],["I like your {bare}. It really suits this room.","{n}、 いいね。 この へやに すごく にあってる。"],["Is that {en}? You have good taste!","それ、 {n}？ センスが いいね！"]],
 mio:[["Wait, is that {en}?! So cute! When did you get it?","まって、 それ {n}！？ かわいい！ いつ 買ったの？"],["Ooh, {en}! Boss, you have good taste. I'm a little jealous!","おー、 {n}！ 店長、 センス いい。 ちょっと うらやましい！"],["I love your {bare}! Can I touch it? … Ha ha, I already touched it.","{n}、 いいなあ！ さわっても いい？ … あはは、 もう さわっちゃった。"]]};
function visitTalk(w){const L=HOUSE_VISIT[w].filter(t=>!t.first||!HS.seen[t.id]),first=L.find(t=>t.first);
  return first||L.slice().sort((a,b)=>(HS.seen[a.id]||0)-(HS.seen[b.id]||0)||Math.random()-.5)[0]}
function conv(w,src){const r=romOf(w),nodes={};
  Object.keys(src.nodes).forEach(k=>{const n=Object.assign({},src.nodes[k]);n.m=r?(n.lv||n.m):(n.fr||n.m);delete n.lv;delete n.fr;
    if(n.o)n.o=n.o.map(o=>{const x=(!r&&o[5])?o[5]:o;return [x[0],x[1],o[2],o[3]||0]});nodes[k]=n});
  const kn=pickL(KNOCK[w]),fx=w==='mina'?{}:{p:'wave'};
  const things=Object.keys(HOUSE_SLOTS).map(s=>HS.lv>=slotLv(s)&&putOf(s)).filter(Boolean);
  const look=!src.first&&things.length?pickL(things):null;
  nodes.s=Object.assign({m:kn,ex:'smile',o:[["Come in!","どうぞ、 入って！",look?'k':'a',1],["Hi! Welcome!","いらっしゃい！",look?'k':'a',1]]},fx);
  if(look){const t=pickL(LOOK[w]),f=s=>s.replace(/\{en\}/g,look.en).replace(/\{bare\}/g,bare(look.en)).replace(/\{n\}/g,look.n);
    nodes.k={m:[f(t[0]),f(t[1])],ex:w==='mina'?'happy':'laugh',nt:[[look.en,`${look.n}。 ${look.ph[0]}（${look.ph[1]}）`]],o:[["Thank you!","ありがとう！",'a',1],["I just got it.","買った ばかり なんだ。",'a',1]]}}
  return {id:src.id,ico:src.ico,t:src.t,who:w==='mina'?'mina':'house',nodes,okL:'へやに もどる',
    fin:(n,k,newEnd,pts)=>visitEnd(w,src,n,newEnd,pts),bind:box=>{const a=box.querySelector('#mcagain');if(a)a.remove()}}}
function visit(w){const src=visitTalk(w);if(!src)return;HS.vis[w]=today();save();
  try{MIOC.play(conv(w,src),open)}catch(e){open()}}
function visitEnd(w,src,n,newEnd,pts){HS.seen[src.id]=(HS.seen[src.id]||0)+1;let got='';
  if(src.first){const g=IT.find(i=>i.gift===w);if(g&&!HS.own[g.id]){HS.own[g.id]=1;if(!HS.put[g.slot])HS.put[g.slot]=g.id;got=`<p class="kpay">${g.ico} <b>${esc(g.n)}</b>を もらった！<small>${esc(g.en)}・${HS.put[g.slot]===g.id?'へやに おいたよ':'🛋️ カタログで おけるよ'}</small></p>`}}
  save();let hs='';if(w==='mio')try{hs=MIOC.gain(newEnd?Math.max(2,pts):1,'talk')}catch(e){}
  try{RECENT.add('house',{kind:'visit',who:w,ja:src.t,ico:src.ico,end:n.end})}catch(e){}
  return `${hs?`<p class="zkheart">${hs}</p>`:''}${got}${w==='mio'?minaBox(n.end==='fun'?'hs_visFun':'hs_visMio',{t:src.t}):''}`}

/* ================================================================ ミナ先生の セリフ */
Object.assign(MINA_LINES,{
 hs_lot:[['smile','浜辺の 売り地… 自分の 家を 建てられるんだって。 {p}まい あれば 小屋が できるよ（あと {r}まい）'],['think','「for sale」は 「売り物」って いみ。 コインを ためて、 海の 見える 家に 住んでみない？']],
 hs_lotOk:[['wow','{p}まい、 たまってるね！ 自分の 家、 建てちゃう？ 遊びに 行っても いい？'],['happy','海の そばの 家… すてき！ できたら いちばんに まねいてね']],
 hs_built1:[['wow','おめでとう！ 「Welcome home!」は 「おかえり」。 これから 毎日 言えるね'],['happy','自分の 家！ 家具を おいて、 英語の 名前も おぼえよう']],
 hs_built2:[['wow','テラスつきの 家！ 「deck」は 家の そとの 木の ゆかの ことだよ'],['happy','広く なったね！ ペットも かえるよ。 「pet」は 英語でも ペット']],
 hs_built3:[['wow','2かいだて！ 「two-story house」。 story は 「お話」の ほかに 「〜階」の いみも あるの'],['love','屋根うら べや… 「attic」って いうの。 星を 見る 道具を おいたら すてきだよ']],
 hs_empty:[['smile','まだ へやが からっぽ だね。 🛋️ 家具カタログで 「a bed」から はじめよう'],['think','家具の 英語は 毎日 つかうよ。 bed・chair・lamp… 1つずつ ふやそう']],
 hs_invite:[['happy','だれか まねいて みたら？ 「Come in!」 「Make yourself at home.」が つかえるよ'],['smile','わたしも 遊びに 行っていい？ 🔔 で よんでね']],
 hs_grow:[['wow','コインが たまったね。 「{nx}」に できるよ！'],['think','家を 広げると おける 物が ふえるよ']],
 hs_room:[['smile','いい へや。 家具を タップして 英語の 名前を きいてみて'],['happy','「{n}」、 いごこち よさそう。 へやの 英語、 いくつ 言える？'],['think','「There is a bed in my room.」… へやを 英語で せつめい してみよう']],
 hs_buy:[['happy','{n}！ 英語では 「{en}」。 声に 出して 言ってみて'],['smile','「{en}」が へやに ふえたね。 例文も おぼえちゃおう'],['wow','すてきな {n}！ 物の 名前は a / an を つけて おぼえると いいよ']],
 hs_wall:[['happy','へやの ふんいきが かわったね！ 「wallpaper」は かべがみ、 「floor」は ゆか'],['smile','{n}、 にあってる。 色の 英語も いっしょに おぼえよう']],
 hs_pet:[['love','{n}！ かわいい！ 名前は なんて つける？ 「What\'s its name?」'],['happy','ペットが いると 家が にぎやかに なるね。 「{en}」']],
 hs_words:[['proud','家の 英語が {c}こ！ 自分の 物の 名前は いちばん おぼえやすいよ'],['smile','例文を 🔊で きいて、 まねして 言ってみよう']],
 hs_visMio:[['smile','ミオさん、 楽しそう だったね。 「{t}」… ふふ'],['happy','お客さんを むかえる 英語、 じょうずに なったね']],
 hs_visFun:[['laugh','あはは、 にぎやか！ ミオさんと いると たいくつ しないね'],['happy','おもしろい 答えも 英語が わかってる しょうこだよ']],
 r_house:[['smile','さっき 家に {n}を おいたんだね。 英語で なんて 言うか おぼえてる？'],['happy','家づくり、 楽しそう！ {n}、 いいね']],
 r_houseBuild:[['wow','家が 「{n}」に なったね！ こんど 遊びに 行かせてね'],['happy','「{n}」！ 自分の 家が あるって いいね']],
 r_houseVisit:[['smile','さっき {w}が 家に 来たんだね。 「Make yourself at home.」 言えた？'],['happy','おきゃくさんを むかえるって、 英語の いい 練習だよね']],
 x_houseLot:[['smile','浜辺の 左の 「FOR SALE」の 看板、 見た？ コインで 自分の 家が 建てられるよ'],['think','コインが {c}まい あるね。 浜辺の 売り地に 家を 建てる のは どう？']],
 x_houseRoom:[['smile','あなたの 家の {n}、 英語で 言える？ 「{en}」だよ'],['happy','家具が {c}こ に なったね。 へやの 英語 マスターだ']],
 x_houseVisit:[['smile','きょうは まだ 家に だれも 来てないね。 わたしを まねいても いいよ？'],['happy','家に ミオさんを まねいて みたら？ 英語で おもてなし しよう']]
});
if(window.MINA_SENSE&&MINA_SENSE._rules)MINA_SENSE._rules.push(
 ['x_houseLot',2,F=>!built()&&F.coins>=1500?{c:F.coins.toLocaleString()}:null,()=>['🪧 売り地を 見る',()=>open()]],
 ['x_houseRoom',1,()=>{const L=IT.filter(i=>HS.own[i.id]&&i.p>0);return built()&&L.length?(i=>({n:i.n,en:i.en,c:L.length}))(pickL(L)):null},()=>['🏠 家へ 行く',()=>open()]],
 ['x_houseVisit',1,()=>built()&&HS.vis.mina!==today()?{}:null,()=>['🏠 家へ 行く',()=>open()]]);
(window.MINA_REACT_EXT=window.MINA_REACT_EXT||{}).house={
 act:e=>e.kind==='build'?['r_houseBuild',{n:e.ja}]:e.kind==='visit'?['r_houseVisit',{w:e.who==='mio'?'ミオさん':'わたし'}]:['r_house',{n:e.ja}],
 desc:e=>e.kind==='build'?`家を ${e.ja}に した`:e.kind==='visit'?(e.who==='mio'?'家に ミオさんを まねいた':'わたしが 家に 遊びに 行った'):`家に ${e.ja}を おいた`};

window.HOUSE={open,built,rec:()=>HS,_hut:hut};
})();
