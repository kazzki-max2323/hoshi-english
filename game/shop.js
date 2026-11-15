/* カードショップ「しおさい」: きみが 店長。 看板娘の ミオ（game/mio.js）と いっしょに お店を まわす。
   - 入口: カウンターに 立つ ／ 鉱山へ（game/mine.js） ／ 売り場（10まい） ／ 倉庫（ぜんぶの カード）
   - カウンター: 白い 海の家の 店内を ドット絵で ながめる（昼・夕方・夜）。 お客は 1〜2分に 1人。 売るのは ボタンで かるく、 5回に 1回くらい 英語の 会話
   - 鉱山に 行っている あいだは ミオが 店番。 もどると 売り上げの 報告と 英語の メモ
   データは game/shop-data.js。 カードの しくみは game/cg.js */
(()=>{
const {S:ST,sfx:SFX}=BEACH;
const H=HE,esc=H.esc,$=id=>document.getElementById(id);
const C=CG,R=()=>C.rec(),pickL=a=>a[Math.random()*a.length|0];
const sf=k=>{try{SFX[k]&&SFX[k]()}catch(e){}};
const ML=(k,v)=>{try{return MINA.line(k,v||{})}catch(e){return ['smile','']}};
const FLOOR_N=10;
/* お店の 記録は r.shop（r.sh は 交換の かけらの 数。 前の 版で まちがえて r.sh に 入れていたら うつす） */
const SH=()=>{const r=R();if(r.sh&&typeof r.sh==='object'){if(!r.shop)r.shop=r.sh;r.sh=0}if(typeof r.shop!=='object'||!r.shop||!Array.isArray(r.shop.floor))r.shop=null;return r.shop||(r.shop={floor:[],sold:0,earn:0,guests:0,talk:0,met:0,away:0,best:0,mined:0,tday:'',tearn:0,memo:null})};
const save=()=>C.save();

/* ================================================================ prices（覚えた 度合いでは 変えない） */
const PRICE={es:12,jh:20,hs:32,adv:48},TPRICE=[0,15,25,45,80,150];
function price(id){const I=C.info(id);if(!I)return 0;if(I.k==='t')return TPRICE[I.r]||20;if(I.k==='p')return 10;if(I.k==='s')return 30;return PRICE[I.lv]||12}
const rare=id=>{const I=C.info(id);return !!I&&(I.k==='t'&&I.r>=3||I.k==='w'&&I.lv==='adv'||C.kira(id))};

/* ================================================================ every card you have */
function allCards(){const r=R(),out=Object.keys(r.c).filter(id=>r.c[id]>0&&C.BY[id]);
  try{CARDS.book.forEach(t=>{if(CARDS.n(t)>0)out.push('t:'+t.e)})}catch(e){}
  Object.keys(r.pt||{}).forEach(k=>{if(r.pt[k]>0)out.push('p:'+k)});Object.keys(r.st||{}).forEach(k=>{if(r.st[k]>0)out.push('s:'+k)});return out}
/* the floor only keeps cards you still have */
/* 📖 カードブック（game/cbook.js）: 入れた カードは 1まい ブックに とっておく（売り場には 出せない） */
const BOOKR=()=>{const S=SH();if(!S.book||typeof S.book!=='object'||Array.isArray(S.book))S.book={};return S.book};
const inBook=id=>BOOKR()[id]&&C.count(id)>0?1:0;
function cleanFloor(){const S=SH(),need={};S.floor=S.floor.filter(id=>{need[id]=(need[id]??inBook(id))+1;return C.info(id)&&C.count(id)>=need[id]})}
const onFloor=id=>SH().floor.filter(x=>x===id).length;
/* 売り場に 出せる まい数（ブックの 1まいと 売り場の 分を のぞく） */
const free=id=>C.count(id)-onFloor(id)-inBook(id);
/* 倉庫に ある まい数（ブックに 入れた 1まいは 倉庫から 出ていく。 鉱山の 練習には allCards() で そのまま つかえる） */
const stock=id=>C.count(id)-inBook(id);
const storeCards=()=>allCards().filter(id=>stock(id)>0);
function sell(id,p,fly){const S=SH(),i=S.floor.indexOf(id);if(i<0)return false;S.floor.splice(i,1);C.take(id);S.sold++;S.earn+=p;
  const d=C.today();if(S.tday!==d){S.tday=d;S.tearn=0}S.tearn+=p;if(!fly)H.addCoins(p);save();return true}

/* ================================================================ the Mio bubble */
let jaOn=true;
function speak(en){try{MIO.say(en)}catch(e){}}
const gspeak=en=>{try{C.speak(en)}catch(e){}};
function bubble(en,ja,ex='smile',pose=''){return `<div class="cgnagi shm"><span class="cgnf cgm">${MIO.face(ex,pose)}</span><div class="cgnb"><b>ミオ</b><p class="en">${esc(en)}</p><p class="ja" ${jaOn?'':'hidden'}>${esc(ja)}</p></div></div>`}
function bindBubble(root=H.panel){root.querySelectorAll('.shm .cgnb').forEach(b=>b.onclick=()=>{jaOn=!jaOn;b.querySelector('.ja').hidden=!jaOn;speak(b.querySelector('.en').textContent)})}
const night=()=>{try{return SCENE.dark()}catch(e){return 0}};

/* ================================================================ the shop front */
const top=(t,right='',id='shb')=>`<div class="qtop"><button class="x" id="${id}" aria-label="もどる">←</button><b>${t}</b><span class="qn">${right}</span></div>`;
function open(){cleanFloor();const S=SH(),first=!S.met;
  if(first)return intro();
  if(S.away)return report();
  const g=night()>.6?pickL(MIO_NIGHT):pickL(MIO_HI),ex=pickL(['smile','laugh','wink']),pose=pickL(['wave','peace','','thumb']);
    H.show('cg',`<section class="pnl cgp shp">
    ${top('🃏 カードショップ しおさい','','cgx')}
    ${bubble(g[0],g[1],ex,pose)}
    <div class="shbig">
      <button data-t="counter" class="c1"><span>🧑‍💼</span>カウンターに 立つ<small>お客さんを まつ</small></button>
      <button data-t="mine" class="c2"><span>⛏️</span>鉱山へ<small>5まいを じゅんばんに 練習</small></button>
      <button data-t="floor" class="c3"><span>🏷️</span>売り場<small>${S.floor.length}/${FLOOR_N}まい</small>${S.floor.length?'':'<i class="dot"></i>'}</button>
      <button data-t="store" class="c4"><span>📦</span>倉庫<small>${storeCards().length}しゅるい</small></button>
    </div>
    ${window.CBOOK?(()=>{const [g,t]=CBOOK.stat();return `<button data-t="book" class="shbook"><span>📖</span><b>カードブック</b><small>${g} / ${t}</small></button>`})():''}
    <button data-g="pack" class="shpack"><span>🎁</span><b>仕入れ</b><small>${C.buyLeft()?`きょう あと ${C.buyLeft()}回`:'また あした'}</small>${R().free!==C.today()?'<i class="dot"></i>':''}</button>
    <div class="row shmio"><button id="shtalk">💬 ミオと 話す${window.MIOC&&MIOC.newN()?'<i class="dot"></i>':''}</button><button id="shgift" class="sub">🎁 プレゼント</button></div>
    ${bgmBtn()}
    <p class="shsum">これまでに ${S.sold}まい 売れた・ 売り上げ 🪙${S.earn}${S.best?` ・ 鉱山 最高 ${S.best}m`:''}</p>
  </section>`);
  $('cgx').onclick=()=>{sf('back');H.home()};
  bindBubble();speak(g[0]);
  $('shtalk').onclick=()=>{sf('step');MIOC.open(open)};
  $('shgift').onclick=()=>{sf('step');GIFT.pick({to:'mio',back:open})};
  $('shbgm').onclick=()=>{sf('step');bgm()};
  H.panel.querySelectorAll('[data-t]').forEach(b=>b.onclick=()=>{sf('step');({counter,mine:()=>MINE.open(),floor,store,book:()=>CBOOK.open()})[b.dataset.t]()});
  H.panel.querySelectorAll('[data-g]').forEach(b=>b.onclick=()=>{sf('step');C.go(b.dataset.g)})}

/* ================================================================ 🎵 お店の BGM（レコードは お店の 中だけで ながれる。 game/game.js の musAt） */
const songs=()=>(ST.music||[]).filter(id=>typeof TRACKS!=='undefined'&&TRACKS[id]);
const songName=id=>{const n=(TRACKS[id]||{}).name||id,m=n.match(/「(.+)」/);return m?m[1]:n};
function bgmBtn(){const id=H.shopSongId;return `<button id="shbgm" class="shbgm sub"><span>🎵</span><b>${id?esc(songName(id)):'BGM なし'}</b><small>${songs().length?'えらぶ':'レコードは 雑貨店で'}</small></button>`}
const MIO_BGM={
  none:[["Want some music in the shop, boss? Records from Nora's shop play right here.","お店に 音楽、 かけませんか？ ノラさんの お店の レコードが ここで ながせますよ。"]],
  empty:[["We don't have any records yet. Nora's shop on the beach sells them!","まだ レコードが ないですね。 浜辺の ノラさんの お店で 売ってますよ！"]],
  on:[["Good choice! Music makes the shop feel cozy.","いい えらび方！ 音楽が あると お店が ほっこりしますね。"],["I love this song. I might start dancing behind the counter!","この曲 大好き。 カウンターの うしろで おどっちゃうかも！"],["Customers stay longer when there's music. Maybe!","音楽が あると お客さんが 長く いてくれるんです。 たぶん！"]],
  off:[["Quiet is nice too. I can hear the waves.","しずかなのも いいですね。 波の 音が 聞こえる。"]]};
function bgm(say){const own=songs(),cur=H.shopSongId,ln=say||pickL(MIO_BGM[!own.length?'empty':cur?'on':'none']);
  H.show('cg',`<section class="pnl cgp shp shbg">${top('🎵 お店の BGM',own.length?`${own.length}曲`:'')}
    ${bubble(ln[0],ln[1],cur?'laugh':'smile',cur?'peace':'')}
    ${own.length?`<div class="zkbag">${own.map(id=>{const m=CATALOG.music.find(x=>x[0]===id)||[id,0,'🎵'],on=cur===id;
      return `<div class="ritem ${on?'has':''}"><span class="ri">${m[2]}</span><span class="rn"><b>${esc(songName(id))}</b>${on?'<small>🎵 いま ながれているよ</small>':''}</span><span class="rbtn"><button class="play ${on?'on':''}" data-bg="${on?'':id}">${on?'■ とめる':'▶ ながす'}</button></span></div>`}).join('')}</div>`
      :`<p class="note">🎵 レコードは 浜辺の 右はしの ながれぎ雑貨店で 買えるよ</p>`}
    <p class="note">レコードは お店の 中だけで ながれるよ（鉱山や 浜辺では とまる）</p>
  </section>`);
  bindBubble();speak(ln[0]);$('shb').onclick=()=>{sf('back');open()};
  H.panel.querySelectorAll('[data-bg]').forEach(b=>b.onclick=()=>{const id=b.dataset.bg||null;sf('pop');H.shopSong(id);bgm(pickL(MIO_BGM[id?'on':'off']))})}

/* the first visit: Mio says hello, and the starter cards */
function intro(){const S=SH();let i=0;
  const step=()=>{const t=MIO_FIRST[i];
    H.show('cg',`<section class="pnl cgp shp" data-stay>${top('🃏 カードショップ しおさい','','cgx')}
      <div class="shintro">${MIO.face(i===0?'laugh':i===1?'wink':'smile',i===0?'wave':i===1?'peace':'thumb')}</div>
      ${bubble(t[0],t[1],'smile')}<button id="shnx" class="big">${i<MIO_FIRST.length-1?'つぎへ ▶':'よろしくね！'}</button></section>`);
    H.panel.querySelector('.shm .cgnf').hidden=true;
    bindBubble();speak(t[0]);$('cgx').onclick=()=>{sf('back');H.home()};
    $('shnx').onclick=()=>{sf('step');i++;if(i<MIO_FIRST.length)return step();
      S.met=1;save();const had=R().met;if(!had){const ids=C.starter();C.reveal(ids.slice(0,5).map(id=>({id,isNew:true})),'はじめの カード（15まい）',open)}else open()}};
  step()}

/* ================================================================ back from the mine: Mio's report */
function awaySales(min){const S=SH(),n=Math.min(12,Math.floor(min/1.5)),sold=[];let guests=0;
  for(let k=0;k<n;k++){guests++;if(!S.floor.length)continue;if(Math.random()<.55){const id=pickL(S.floor),p=price(id);if(sell(id,p))sold.push([id,p])}}
  S.guests+=guests;return {guests,sold}}
function report(){const S=SH(),min=Math.max(0,(Date.now()-S.away)/6e4);S.away=0;save();
  const r=awaySales(min),coins=r.sold.reduce((a,x)=>a+x[1],0);
  const wd=id=>{const I=C.info(id);return I&&I.en?String(I.en).split(',')[0].trim():''};
  const M=window.MIOMEMO?MIOMEMO.make(r,wd):{lines:[r.sold.length?pickL(MIO_MEMO):pickL(MIO_MEMO_QUIET)],ph:null,sign:['– Mio','ミオ']};
  const memo=M.lines;S.memo=M;save();const memoEn=memo.map(x=>x[0]).join(' ');
  const ex=r.sold.length?'laugh':r.guests?'smile':'oops',pose=r.sold.length?'peace':'';
  H.show('cg',`<section class="pnl cgp shp">${top('📋 るすばんの 報告','','shb')}
    <div class="shrep"><div class="shrf">${MIO.face(ex,pose)}</div>
      <div><p class="shrn">お客さん <b>${r.guests}</b>人 ・ 売れた カード <b>${r.sold.length}</b>まい</p>
      ${r.sold.length?`<div class="shsold">${r.sold.map(([id])=>C.face(id,{mini:1,marks:false})).join('')}</div><p class="shcoin">🪙 +${coins}</p>`:''}</div></div>
    <div class="shmemo"><b>📝 ミオの メモ</b>${memo.map((x,i)=>`<p class="en${i?' ps':''}">${esc(x[0])}</p><p class="ja">${esc(x[1])}</p>`).join('')}
      ${M.ph?`<div class="wd"><p class="en">📌 Today's phrase: <b>${esc(M.ph[0])}</b> ＝ ${esc(M.ph[1])}</p><p class="ja">${esc(M.ph[2])}</p></div>`:''}
      <p class="sg">${esc(M.sign[0])}</p><button class="sub" id="shsay">🔊 読む</button></div>
    <button id="shok" class="big">お店に もどる</button></section>`);
  if(r.sold.length){sf('coinIn');setTimeout(()=>sf('buy'),300)}else sf('talk');
  $('shsay').onclick=()=>speak(memoEn+(M.ph?' '+M.ph[2]:''));$('shb').onclick=$('shok').onclick=()=>{sf('step');open()}}
/* the mine calls this when you leave for it */
function leave(){SH().away=Date.now();save()}

/* ================================================================ 📦 the storeroom */
let stF='all';
function store(f){if(typeof f==='string')stF=f;const F=[['all','ぜんぶ'],['es','小'],['jh','中'],['hs','高'],['adv','H'],['t','宝'],['weak','😣苦手'],...(window.UNK?[['unk','📜']]:[])];
  let ids=storeCards().filter(id=>{const I=C.info(id);if(!I)return false;if(stF==='all')return true;if(stF==='t')return I.k==='t';if(stF==='weak')return I.k==='w'&&C.weak(id);if(stF==='unk')return UNK.cardHas(I);
return I.k==='w'&&I.lv===stF});
  ids.sort((a,b)=>(C.info(a).lv||'').localeCompare(C.info(b).lv||'')||C.star(a)-C.star(b));
  /* 📖 ブックに まだ 入っていない カードは 「📖＋」で そのまま 入れられる */
  const BK=window.CBOOK,canN=BK?BK.addable().length:0;
  const shown=ids.slice(0,240);
  H.show('cg',`<section class="pnl cgp shp">${top('📦 倉庫',`${ids.length}しゅるい`)}
    <div class="shf">${F.map(([k,n])=>`<button data-f="${k}" class="${stF===k?'on':''}">${n}</button>`).join('')}</div>
    ${canN?`<button class="shtobk" id="shtobk">📖 ブックに 入れられる カード ${canN}まい ▶</button>`:''}
    <div class="shgrid">${shown.map(id=>{
      return `<div class="shcell" data-id="${esc(id)}">${C.face(id,{mini:1,n:stock(id)})}${onFloor(id)?'<u>🏷️</u>':''}${BK&&BK.canIn(id)?'<button class="shbk" data-bk="1">📖＋</button>':''}</div>`}).join('')||'<p class="note">カードが ないよ</p>'}</div>
    ${Object.keys(BOOKR()).length?'<p class="note">📖 ブックに 入れた カードは カードブックで 見てね</p>':''}
    ${ids.length>shown.length?`<p class="note">ほか ${ids.length-shown.length}しゅるい（しぼりこんで 見てね）</p>`:''}</section>`);
  $('shb').onclick=()=>{sf('back');open()};
  H.panel.querySelectorAll('[data-f]').forEach(b=>b.onclick=()=>{stF=b.dataset.f;sf('tap');store()});
  H.panel.querySelectorAll('.shcell').forEach(c=>c.onclick=e=>{const id=c.dataset.id;
    if(e.target.closest('[data-bk]')){const at=BK.putOne(id);if(!at)return;sf('card');const w=BK.nm(C.info(id));
      store();H.toast(`📖 ${esc(w)} を ブックへ<small>${esc(at)}ばんの ポケットに 入ったよ</small>`,1800);BK.mina('sh_bookIn1',{w,p:at},.25);return}
    sf('card');C.detail(id)});
  if($('shtobk'))$('shtobk').onclick=()=>{sf('step');BK.open(null,'can')}}

/* ================================================================ 🏷️ the sales floor */
function floor(){cleanFloor();const S=SH();
  H.show('cg',`<section class="pnl cgp shp">${top('🏷️ 売り場',`${S.floor.length}/${FLOOR_N}`)}
    <p class="note">ならべた カードを お客さんが 買っていくよ（るすの あいだは ミオが 売る）。 タップで 入れかえ</p>
    <div class="shfloor">${Array.from({length:FLOOR_N},(_,i)=>{const id=S.floor[i];return id?`<div class="shslot" data-i="${i}">${C.face(id,{mini:1,marks:false})}<span>🪙${price(id)}</span>${C.count(id)-onFloor(id)<=0&&C.count(id)<=1?'<em>さいごの 1まい</em>':''}</div>`:`<div class="shslot empty" data-i="${i}"><b>＋</b></div>`}).join('')}</div>
    <div class="row"><button id="shauto">🃏 ダブりで おまかせ</button><button id="shclr" class="sub">ぜんぶ 下げる</button></div></section>`);
  $('shb').onclick=()=>{sf('back');open()};
  H.panel.querySelectorAll('.shslot').forEach(s=>s.onclick=()=>{const i=+s.dataset.i;if(S.floor[i]){S.floor.splice(i,1);save();sf('back');floor()}else pick()});
  $('shauto').onclick=()=>{const dup=allCards().filter(id=>free(id)>=(inBook(id)?1:2)).sort((a,b)=>C.count(b)-C.count(a));let n=0;
    for(const id of dup){if(S.floor.length>=FLOOR_N)break;S.floor.push(id);n++}save();if(n){sf('card');H.toast(`🏷️ ${n}まい ならべたよ`)}else H.toast('ダブった カードが ないよ。 ＋から えらんでね');floor()};
  $('shclr').onclick=()=>{S.floor=[];save();sf('back');floor()}}
/* choose a card to put out */
function pick(){const S=SH();const ids=allCards().filter(id=>free(id)>0).sort((a,b)=>C.count(b)-C.count(a)||price(b)-price(a)).slice(0,120);
  const o=C.ov(`<div class="shpick"><b>どの カードを ならべる？</b><p class="note">ダブっている カードが 上。 🎁宝カードも 売れるよ（📖ブックに 入れた 1まいは 出せないよ）</p>
    <div class="shgrid">${ids.map(id=>`<div class="shcell" data-id="${esc(id)}">${C.face(id,{mini:1,n:free(id),marks:false})}<span>🪙${price(id)}</span></div>`).join('')||'<p class="note">ならべられる カードが ないよ</p>'}</div>
    <button class="sub" id="shpx">やめる</button></div>`,'by');
  o.querySelector('#shpx').onclick=()=>{sf('back');C.closeOv()};
  o.querySelectorAll('.shcell').forEach(c=>c.onclick=()=>{const id=c.dataset.id;if(S.floor.length>=FLOOR_N)return;S.floor.push(id);save();sf('card');C.closeOv();floor()})}

/* ================================================================ 🧑‍💼 the counter */
const W=200,HH=116,FL=60;
const PR=(c,x,y,w,h,col)=>{c.fillStyle=col;c.fillRect(x,y,w,h)};
const CC=['#ff7a8a','#5ab4ff','#ffd23f','#7ad37a','#c79ad6','#ff9a4a'];
function glow(c,x,y,r,a){const g=c.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,`rgba(255,214,140,${a})`);g.addColorStop(1,'rgba(255,214,140,0)');c.fillStyle=g;c.fillRect(x-r,y-r,r*2,r*2)}
function card(c,x,y,col){PR(c,x,y,4,5,'#fff');PR(c,x+1,y+1,2,3,col)}
function sky(c,x,y,w,h,sea,t,f){if(t==='day'){PR(c,x,y,w,sea-y,'#bfe8ff');PR(c,x,sea,w,y+h-sea,'#4ab0e0');PR(c,x,sea,w,1,'#8fd8ff');const wx=(f>>1)%w;PR(c,x+(wx+4)%w,sea+4,Math.min(5,w-(wx+4)%w),1,'#fff');return}
  if(t==='dusk'){const g=c.createLinearGradient(0,y,0,sea);g.addColorStop(0,'#7a6ab0');g.addColorStop(.6,'#f0a07a');g.addColorStop(1,'#ffd08a');c.fillStyle=g;c.fillRect(x,y,w,sea-y);PR(c,x,sea,w,y+h-sea,'#6a5a9a');PR(c,x+w*.5,sea+2,8,1,'#ffd08a');return}
  PR(c,x,y,w,sea-y,'#141a44');PR(c,x,sea,w,y+h-sea,'#1c2c5a');[[.15,.2],[.4,.1],[.7,.35],[.3,.55],[.85,.15]].forEach(([a,b],i)=>{if((f+i*3)%9)PR(c,Math.round(x+w*a),Math.round(y+(sea-y)*b),1,1,'#fff')});PR(c,x+w*.6,sea+2,7,1,'#8fb0e0')}
/* the white beach house (② on the picture we chose) */
function room(c,t,f){
  for(let y=0,r=0;y<FL;y+=5,r++){PR(c,0,y,W,5,r%2?'#efebe2':'#f6f3ec');PR(c,0,y+4,W,1,'#dcd6ca');for(let x=(r*17)%53;x<W;x+=53)PR(c,x,y,1,4,'#dcd6ca')}
  PR(c,0,FL,W,HH-FL,'#dfe7ea');for(let y=FL+6;y<HH;y+=7)PR(c,0,y,W,1,'#c6d2d8');PR(c,0,FL-3,W,3,'#3a7ac0');
  for(let x=0;x<W;x+=10){PR(c,x,0,5,8,'#3a7ac0');PR(c,x+5,0,5,8,'#fff');PR(c,x,8,5,2,'#3a7ac0');PR(c,x+5,8,5,2,'#e8eef4')}
  /* door and windows */
  sky(c,8,20,24,26,38,t,f);PR(c,8,46,24,FL-46,t==='night'?'#6a6a8a':'#fbeccc');PR(c,6,18,28,2,'#3a7ac0');PR(c,6,18,2,FL-18,'#3a7ac0');PR(c,32,18,2,FL-18,'#3a7ac0');
  sky(c,118,14,27,30,32,t,f);sky(c,147,14,27,30,32,t,f+5);
  if(t==='day'){const bx=118+((f*.5|0)%70);if(bx<170){PR(c,bx+2,22,1,8,'#888');PR(c,bx,24,3,6,'#fff');PR(c,bx-1,30,7,1,'#a06a3a')}}
  if(t==='night'){PR(c,161,17,3,1,'#fff2b0');PR(c,160,18,2,4,'#fff2b0');PR(c,161,22,3,1,'#fff2b0');PR(c,159,19,1,2,'#fff2b0')}
  PR(c,116,12,60,2,'#fff');PR(c,116,44,60,3,'#fff');PR(c,116,12,2,34,'#fff');PR(c,174,12,2,34,'#fff');PR(c,145,14,2,30,'#fff');
  /* life ring, shelf, plant */
  PR(c,182,20,12,12,'#ff6a5a');PR(c,185,23,6,6,'#f6f3ec');PR(c,182,25,3,2,'#fff');PR(c,191,25,3,2,'#fff');PR(c,187,20,2,3,'#fff');PR(c,187,29,2,3,'#fff');
  for(let i=0;i<3;i++){const sy=18+i*13;for(let k=0;k<11;k++){if((k*7+i*3)%9===4)continue;card(c,44+k*6,sy+3,CC[(k+i*2)%6])}PR(c,42,sy+8,68,2,'#fff');PR(c,42,sy+10,68,1,'#9ab4c8')}
  PR(c,42,16,2,40,'#9ab4c8');PR(c,108,16,2,40,'#9ab4c8');
  PR(c,112,50,6,8,'#e0a070');PR(c,111,42,2,8,'#5ab05a');PR(c,114,40,2,10,'#4a9a4a');PR(c,117,43,2,7,'#5ab05a')}
/* the sales table: the real cards on the floor */
function table(c,n){PR(c,70,80,58,9,'#fff');PR(c,70,89,58,2,'#cfdbe4');PR(c,73,91,3,10,'#9ab4c8');PR(c,122,91,3,10,'#9ab4c8');
  for(let i=0;i<n;i++)card(c,75+(i%5)*10+(i>4?3:0),80+(i>4?4:0),CC[(i*5)%6])}
function desk(c){PR(c,138,68,60,4,'#fff');PR(c,138,72,60,20,'#e8eef4');PR(c,138,72,60,1,'#9ab4c8');PR(c,138,91,60,1,'#9ab4c8');for(let x=138;x<198;x+=12)PR(c,x,78,6,3,'#3a7ac0');
  PR(c,182,64,6,3,'#ffcf4a');PR(c,184,63,2,1,'#ffcf4a');PR(c,181,67,8,1,'#b08a3a');PR(c,146,62,12,6,'#a8784a');PR(c,147,63,10,2,'#fff2c8')}
function lights(c,t){if(t==='day')return;c.fillStyle=t==='dusk'?'rgba(120,60,90,.22)':'rgba(16,22,60,.55)';c.fillRect(0,0,W,HH);
  sky(c,118,14,27,30,32,t,0);sky(c,147,14,27,30,32,t,5);if(t==='night'){PR(c,161,17,3,1,'#fff2b0');PR(c,160,18,2,4,'#fff2b0');PR(c,161,22,3,1,'#fff2b0')}
  const a=t==='night'?1:.6;for(let x=5;x<W;x+=10){PR(c,x,11,2,2,'#ffe2a0');glow(c,x+1,12,6,.3*a)}
  PR(c,92,0,1,12,'#555');PR(c,88,12,9,3,'#3a7ac0');PR(c,90,15,5,3,'#ffe2a0');glow(c,92,18,26,.32*a);
  PR(c,186,58,5,6,'#ffe2a0');PR(c,185,57,7,1,'#3a5a8a');glow(c,188,61,20,.35*a);PR(c,74,74,4,6,'#bfe8ff');PR(c,75,76,2,2,'#ffe2a0');glow(c,76,77,14,.3*a)}
/* a guest (grown-ups of the beach) */
function guest(c,x,y,L,pose,f){x=Math.round(x);y=Math.round(y);const s=L.skin,st=pose==='walk'?f%2:0;
  if(L.pants){PR(c,x+3,y+20,8,5,L.low);PR(c,x+4,y+25,2,5-st,L.low);PR(c,x+8,y+25,2,5-(1-st),L.low)}else{PR(c,x+3,y+20,8,4,L.low);PR(c,x+2,y+23,10,3,L.low);PR(c,x+4,y+26,2,4-st,s);PR(c,x+8,y+26,2,4-(1-st),s)}
  PR(c,x+3,y+30-st,3,2,L.shoe);PR(c,x+8,y+30-(1-st),3,2,L.shoe);
  PR(c,x+3,y+11,8,9,L.coat||L.shirt);if(L.coat)PR(c,x+6,y+11,2,9,L.shirt);if(L.bag)PR(c,x+10,y+12,2,8,L.bag);
  const arm=L.coat||L.shirt;
  if(pose==='think'){PR(c,x+1,y+11,2,7,arm);PR(c,x+1,y+18,2,2,s);PR(c,x+9,y+12,3,2,arm);PR(c,x+8,y+9,2,3,arm);PR(c,x+8,y+8,2,2,s)}
  else if(pose==='happy'){PR(c,x+1,y+7,2,5,arm);PR(c,x+1,y+5,2,2,s);PR(c,x+11,y+7,2,5,arm);PR(c,x+11,y+5,2,2,s)}
  else{PR(c,x+1+st,y+11,2,7,arm);PR(c,x+1+st,y+18,2,2,s);PR(c,x+11-(1-st),y+11,2,7,arm);PR(c,x+11-(1-st),y+18,2,2,s)}
  PR(c,x+6,y+10,2,1,s);PR(c,x+3,y+2,8,8,s);
  if(pose==='happy'){PR(c,x+4,y+6,1,1,'#333');PR(c,x+5,y+5,1,1,'#333');PR(c,x+8,y+5,1,1,'#333');PR(c,x+9,y+6,1,1,'#333');PR(c,x+5,y+8,4,1,'#a8304a')}
  else{PR(c,x+5,y+5,1,2,'#333');PR(c,x+8,y+5,1,2,'#333');PR(c,x+6,y+8,2,1,'#c06060')}
  const h=L.hair;
  if(L.style==='cap'){PR(c,x+3,y+1,8,3,L.acc);PR(c,x+2,y+3,11,1,L.acc);PR(c,x+2,y+4,1,4,h);PR(c,x+11,y+4,1,4,h);if(L.beard){PR(c,x+3,y+8,8,2,L.beard);PR(c,x+4,y+10,6,1,L.beard);PR(c,x+6,y+8,2,1,'#c06060')}}
  else if(L.style==='hat'){PR(c,x+3,y+1,8,3,h);PR(c,x+2,y+3,1,5,h);PR(c,x+11,y+3,1,7,h);PR(c,x+4,y-1,6,2,'#f0d27a');PR(c,x,y+1,14,2,'#e8c86a');PR(c,x+4,y+1,6,1,L.acc);if(L.shades){PR(c,x+3,y+5,3,2,'#222');PR(c,x+8,y+5,3,2,'#222');PR(c,x+6,y+5,2,1,'#222')}}
  else if(L.style==='bun'){PR(c,x+3,y+1,8,3,h);PR(c,x+5,y-2,4,3,h);PR(c,x+2,y+2,1,5,h);PR(c,x+11,y+2,1,5,h);if(L.glass){PR(c,x+3,y+4,3,1,'#888');PR(c,x+8,y+4,3,1,'#888')}}
  else if(L.style==='long'){PR(c,x+3,y+1,8,3,h);PR(c,x+4,y,6,1,h);PR(c,x+2,y+2,2,12,h);PR(c,x+10,y+2,2,12,h)}
  else{PR(c,x+3,y+1,8,2,h);PR(c,x+4,y,6,1,h);PR(c,x+2,y+2,1,4,h);PR(c,x+11,y+2,1,4,h);PR(c,x+3,y+3,3,1,h)}}
function bub(c,x,y,t){PR(c,x,y,9,8,'#fff');PR(c,x+1,y-1,7,1,'#fff');PR(c,x+1,y+8,7,1,'#fff');PR(c,x+2,y+9,2,1,'#fff');c.fillStyle='#2a2340';c.font='bold 7px monospace';c.fillText(t,x+2,y+7)}

/* the little speech bubbles: Mio and the guests mutter in English（データは game/shop-mutter.js）。 1つずつ 順番に 出す */
const MU=()=>typeof SHOP_MUTTER!=='undefined'?SHOP_MUTTER:{};
/* a line from a pool, not the same one as last time */
function ML2(k){const a=MU()[k];if(!a||!a.length)return null;const L=ML2.last||(ML2.last={});let x,n=0;do{x=pickL(a)}while(a.length>1&&L[k]===x&&++n<6);L[k]=x;return x}
/* a guest's line: sometimes their own（GUESTS と 同じ じゅんばんの who） */
function gLine(g,k,own){const i=GUESTS.indexOf(g.G),w=(MU().who||[])[i];if(w&&w.length&&Math.random()<own){let x,n=0;do{x=pickL(w)}while(w.length>1&&g.said===x&&++n<6);g.said=x;return x}return ML2(k)}
function mut(T,who,line,ms,free){if(!line||!T.mu)return;const m=T.mu;if(m.until>Date.now()){if(!free&&m.q.length<2)m.q.push([who,line,ms]);return}
  m.who=who;m.line=line;m.until=Date.now()+(ms||Math.max(3200,1800+line[0].length*90));const e=$('shmut');if(!e)return;
  e.querySelector('.en').textContent=line[0];e.querySelector('.ja').textContent=line[1];e.className='shmut '+(who==='m'?'mio':'gst');e.hidden=false;e.style.animation='none';e.offsetWidth;e.style.animation=''}
/* every frame: follow the speaker, end the bubble, and let Mio mutter when the shop is quiet */
function mutTick(T,t){const m=T.mu,e=$('shmut'),now=Date.now();if(!e)return;
  if(m.who&&now>=m.until){m.who='';e.hidden=true;m.next=Math.max(m.next,now+1200);const n=m.q.shift();if(n){m.next=0;setTimeout(()=>{if(T.alive)mut(T,...n)},450)}}
  if(m.who){const sp=m.who==='m'?T.mio:T.g;if(!sp){m.until=0;return}
    const st=e.parentNode,sx=st.clientWidth/W,sy=st.clientHeight/HH,bw=e.offsetWidth,cx=(sp.x+7)*sx;
    const left=Math.max(4,Math.min(st.clientWidth-bw-4,cx-bw/2));e.style.left=left+'px';e.style.bottom=Math.round((HH-sp.y+2)*sy)+'px';e.style.setProperty('--tx',Math.round(cx-left)+'px');return}
  /* Mio, by herself: every 15〜25 s when no guest and no question is open */
  if(T.g||m.q.length||now<m.next)return;const box=$('shact');if(box&&box.innerHTML)return;
  m.next=now+15000+Math.random()*10000;
  const S=SH(),r=Math.random(),mp=T.mio.pose;let k;
  if(mp==='doze')k='doze';else if(!S.floor.length&&r<.45)k='empty';else if(S.floor.length&&S.floor.length<3&&r<.3)k='few';else if(mp==='sweep'&&r<.5)k='sweep';else k=r<.55?t:'any';
  mut(T,'m',ML2(k))}

let CT=null;   // the counter's state while it is open
function counter(){if(CT)CT.alive=false;const S=SH();cleanFloor();
  H.show('cg',`<section class="pnl cgp shp shctr">${top('🧑‍💼 カウンター',`きょう 🪙${S.tday===C.today()?S.tearn:0}`)}
    <div class="shstage"><canvas id="shcv" width="${W}" height="${HH}"></canvas><div class="shmut" id="shmut" hidden><b class="en"></b><small class="ja"></small></div></div>
    <p class="shst" id="shst">お店を あけたよ。 お客さんを まとう</p>
    <div id="shact" class="shact"></div>
    <div class="row"><button id="shcall" class="sub">📣 よびこみ</button><button id="shfl" class="sub">🏷️ 売り場（${S.floor.length}）</button></div></section>`);
  const cv=$('shcv'),c=cv.getContext('2d');c.imageSmoothingEnabled=false;
  const T=CT={alive:true,f:0,g:null,next:Date.now()+4000+Math.random()*4000,mio:{x:150,y:44,pose:'stand',until:0,walk:null},visits:0,busy:false,mu:{who:'',until:0,q:[],next:Date.now()+2500,last:{}}};
  $('shmut').onclick=()=>{const m=T.mu;if(!m.who||!m.line)return;(m.who==='m'?speak:gspeak)(m.line[0])};
  $('shb').onclick=()=>{T.alive=false;sf('back');open()};
  $('shfl').onclick=()=>{T.alive=false;sf('step');floor()};
  $('shcall').onclick=()=>{if(T.g||Date.now()<T.callOk){H.toast(T.g?'いまは お客さんが いるよ':'少し まってから よびこもう');return}T.next=Date.now()+1500;T.callOk=Date.now()+20000;sf('hey');
    status('📣 「いらっしゃいませー！」 ミオと いっしょに よびこみ');T.mio.pose='wave';T.mio.until=Date.now()+2500};
  const status=t=>{const e=$('shst');if(e)e.innerHTML=t};T.status=status;
  let last=0;
  const tick=now=>{if(!T.alive||!cv.isConnected){T.alive=false;return}requestAnimationFrame(tick);if(now-last<140)return;last=now;T.f++;step(T);
    const d=night(),t=d>.6?'night':d>.25?'dusk':'day';
    room(c,t,T.f);table(c,SH().floor.length);
    /* Mio: behind the counter, or out on the floor sweeping */
    const m=T.mio;if(m.walk){const dx=m.walk-m.x;if(Math.abs(dx)<1){m.x=m.walk;m.walk=null}else m.x+=Math.sign(dx)}
    const behind=m.y<60;
    const g=T.g;if(g&&g.y+32<=m.y+32){guest(c,g.x,g.y,g.L,g.pose,T.f>>1)}
    if(behind){MIO.draw(c,m.x,m.y,m.walk?'walk':m.pose,T.f>>1);desk(c)}else{desk(c);MIO.draw(c,m.x,m.y,m.walk?'walk':m.pose,T.f>>1)}
    if(g&&g.y+32>m.y+32)guest(c,g.x,g.y,g.L,g.pose,T.f>>1);
    if(g&&g.bub&&!(T.mu.who==='g'&&T.mu.until>Date.now()))bub(c,g.x+11,g.y-9,g.bub);
    lights(c,t);mutTick(T,t)};
  requestAnimationFrame(tick);
  if(!S.floor.length)setTimeout(()=>status('🏷️ 売り場が からっぽ… お客さんが 来ても 買えないよ。 カードを ならべよう'),1200)}
/* Mio's little life between guests */
function mioIdle(T){const m=T.mio,now=Date.now();if(now<m.until||m.walk)return;const d=night();
  const r=Math.random();
  if(d>.6&&r<.5){m.pose='doze';m.until=now+6000;return}
  if(r<.35){m.walk=pickL([142,152,164,172]);m.pose=pickL(['sweep','stand']);m.until=now+5000}
  else{m.pose=pickL(['stand','stand','sweep','wave']);m.until=now+3000+Math.random()*4000}}
/* the guest walks: door → shelf → table → (counter) → door */
function step(T){const now=Date.now();mioIdle(T);
  if(!T.g){if(now>=T.next&&!T.busy){const G=pickL(GUESTS);T.g={G,L:GUEST_LOOK[G.l],x:14,y:32,pose:'walk',path:[[14,46],[56,46],[56,46,'look',2500],[92,58],[92,58,'think',2600]],bub:'',st:0,wait:0};
      T.status(`🔔 ${esc(T.g.G.n)}が 来た！`);sf('knock');setTimeout(()=>{if(T.g)T.g.bub=''},1500);T.g.bub='!';
      if(T.mio.y<60){T.mio.pose='wave';T.mio.until=now+2500}
      const nt=night()>.6;if(Math.random()<.5)mut(T,'m',ML2(nt?'helloNight':'hello'),2600);mut(T,'g',gLine(T.g,nt?'g_enterNight':'g_enter',.3))}return}
  const g=T.g;if(g.hold)return;
  if(g.wait){if(now<g.wait)return;g.wait=0;g.bub='';g.path.shift();if(!g.path.length)return decide(T)}
  const p=g.path[0];if(!p)return;
  const dx=p[0]-g.x,dy=p[1]-g.y;
  if(Math.abs(dx)<1.2&&Math.abs(dy)<1.2){g.x=p[0];g.y=p[1];if(p[2]){g.pose=p[2]==='look'?'stand':'think';g.bub=p[2]==='think'?'?':'';g.wait=now+p[3];
      if(Math.random()<.75)mut(T,'g',gLine(g,p[2]==='look'?'g_shelf':'g_table',.45),p[3]+600,1);return}
    g.path.shift();if(!g.path.length)return decide(T);return}
  g.pose='walk';if(Math.abs(dx)>=1)g.x+=Math.sign(dx)*1.5;if(Math.abs(dy)>=1)g.y+=Math.sign(dy)*1.5}
/* buy, or leave */
function decide(T){const g=T.g,S=SH();
  if(g.st===0){g.st=1;
    if(!S.floor.length){g.bub='…';T.status(`${esc(g.G.n)}は 帰っていった`);mut(T,'g',ML2('g_none'));mut(T,'m',ML2('sorry'));return out(T,1600)}
    /* the card they want: their favorite kind, if it's there */
    const fav=S.floor.filter(id=>{const I=C.info(id);return I&&g.G.a.includes(I.a)});
    const id=fav.length&&Math.random()<.7?pickL(fav):pickL(S.floor);
    if(Math.random()<(fav.includes(id)?.85:.6)){g.want=id;g.path=[[120,62]];g.bub='♪';T.status(`${esc(g.G.n)}が カードを もって レジへ`);mut(T,'g',ML2('g_buy'),2200)}
    else{g.bub='…';T.status(`${esc(g.G.n)}は 見ていくだけ みたい`);mut(T,'g',ML2('g_leave'));mut(T,'m',ML2('bye'));return out(T,1200)}
    return}
  if(g.st===1){g.st=2;g.hold=1;g.pose='stand';atCounter(T)}}
function out(T,ms){const g=T.g;g.hold=1;setTimeout(()=>{if(!T.alive||T.g!==g)return;g.hold=0;g.st=9;g.path=[[g.x,46],[14,46],[14,32]];g.bub='';
  const fin=()=>{if(T.g===g&&!g.path.length){T.g=null;T.next=Date.now()+60000+Math.random()*60000;T.status('お客さんを まとう…（📣 よびこみも できるよ）');SH().guests++;save()}};
  const iv=setInterval(()=>{if(!T.alive){clearInterval(iv);return}if(T.g!==g||!g.path.length){clearInterval(iv);fin()}},300)},ms)}
/* at the register: a button, or (about 1 in 5) English */
function atCounter(T){const g=T.g,S=SH(),id=g.want,I=C.info(id),p=price(id),box=$('shact');if(!box)return;
  T.visits++;S.talk=(S.talk||0)+1;save();
  const nm=I.k==='w'?I.en.split(',')[0]:I.en;
  const done=(sold,pp)=>{box.innerHTML='';if(sold){if(sell(id,pp,true)){g.pose='happy';g.bub='♥';sf('coinIn');T.status(`🪙 +${pp}　「${esc(nm)}」が 売れた！`);T.mio.pose='cheer';T.mio.until=Date.now()+2500;T.mu.q=[];T.mu.until=0;mut(T,'g',gLine(g,'g_happy',.2));mut(T,'m',ML2(night()>.6&&Math.random()<.6?'thanksNight':'thanks'));T.soldAt=Date.now();
        const r=cv0();try{if(r)H.coinBurst(r.x,r.y,pp,true);else H.addCoins(pp)}catch(e){H.addCoins(pp)}}
      else T.status('あれ？ その カードは もう ないみたい')}else{g.bub='…';T.status(`${esc(g.G.n)}は 帰っていった`)}
    out(T,sold?1200:600)};
  if(S.talk%5===0)return talk(T,id,p,done);
  box.innerHTML=`<div class="shask">${C.face(id,{mini:1,marks:false})}<div><p><b>${esc(g.G.n)}</b>「${esc(pickL(GUEST_SAY.buy))}」</p><p class="ja">「${esc(nm)}」を 🪙${p}で ください</p>
    <div class="row"><button id="shsell">🪙 売る</button><button id="shno" class="sub">売らない</button></div></div></div>`;
  sf('talk');
  $('shsell').onclick=()=>{sf('buy');done(true,p)};$('shno').onclick=()=>{sf('back');done(false)}}
const cv0=()=>{const e=$('shcv');if(!e)return null;const r=e.getBoundingClientRect();return {x:r.left+r.width*.6,y:r.top+r.height*.6}};
/* the English talk at the counter */
function talk(T,id,p,done){const g=T.g,I=C.info(id),box=$('shact');const lv=({es:'es',jh:'jh',hs:'hs',adv:'hs'})[C.myLv()]||'es';
  const kinds=['want','deal','rumor'];if(rare(id))kinds.push('rare','rare');if(C.count(id)<=1)kinds.push('only','only');
  const k=pickL(kinds),x=pickL(SHOP_TALK[k][lv]);const nm=I.k==='w'?I.en.split(',')[0]:I.en;
  const pp=k==='deal'?Math.max(1,Math.round(p*.85)):k==='rare'||k==='only'?Math.round(p*1.2):p;
  const fill=s=>s.replace(/\{w\}/g,nm).replace(/\{p\}/g,pp);
  const ch=H.shuffle(x[2].map((s,j)=>[fill(s),j]));
  box.innerHTML=`<div class="shtalk"><p class="en"><b>${esc(g.G.n)}</b> 🗣️ ${esc(fill(x[0]))} <button class="sub" id="shsay">🔊</button></p><p class="ja">${esc(fill(x[1]))}</p>
    <p class="shq">店長の 答えは？</p><div class="cgtc">${ch.map(([s,j])=>`<button data-j="${j}">${esc(s)}</button>`).join('')}</div><div class="cgtx" hidden></div></div>`;
  sf('hey');gspeak(fill(x[0]));$('shsay').onclick=()=>gspeak(fill(x[0]));
  box.querySelectorAll('[data-j]').forEach(b=>b.onclick=()=>{const ok=b.dataset.j==='0';box.querySelectorAll('[data-j]').forEach(y=>{y.disabled=true;if(y.dataset.j==='0')y.classList.add('ok')});
    if(ok){b.classList.add('ok');sf('correct');gspeak(fill(x[2][0]))}else{b.classList.add('ng');sf('wrong')}
    const tip=ok&&k!=='deal'?Math.max(2,Math.round(pp*.2)):0;const hh=ok&&window.MIOC?MIOC.gain(1,'ctr'):'';
    const e=box.querySelector('.cgtx');e.hidden=false;e.innerHTML=`<p>${ok?'⭕ ':'💡 '}${esc(x[3])}</p>${tip?`<p class="shtip">お客さんが よろこんで チップ 🪙${tip}！</p>`:''}${hh?`<p class="shq">${hh} <small>ミオ「Nice English, boss!」</small></p>`:''}<button class="nx">${k==='rumor'?'うわさを 聞いて 売る ▶':'売る ▶'}</button>`;
    e.querySelector('.nx').onclick=()=>{sf('step');if(tip)H.addCoins(tip);done(true,pp);
      try{if(window.MINA&&MINA.canAnnounce&&MINA.canAnnounce()&&Math.random()<.4){const [ex,tx]=ML(ok?'sh_talkGood':'sh_talkMiss');MINA.say('m',ex,tx,6000)}}catch(er){}}})}

/* ================================================================ Ms. Mina points the way */
const goBgm=()=>['🎵 お店の BGMへ',()=>{CG.open();setTimeout(()=>{if(SH().met&&!SH().away)bgm()},60)}];
const goShop=t=>()=>['🃏 カードショップへ',()=>{CG.open();if(t)setTimeout(()=>({counter,floor,store,mine:()=>MINE.open()})[t](),60)}];
if(window.MINA_SENSE&&MINA_SENSE._rules)MINA_SENSE._rules.push(
 ['x_shMine',4,()=>SH().met?{}:null,goShop('mine')],
 ['x_shDeep',2,()=>{const b=SH().best||0;return b>=5?{d:b}:null},goShop('mine')],
 ['x_shShelf',3,()=>SH().met&&!SH().floor.length?{}:null,goShop('floor')],
 ['x_shCounter',2,()=>SH().met?{}:null,goShop('counter')],
 ['x_shReport',2,()=>SH().sold?{n:SH().sold}:null,goShop()],
 ['x_shMio',1,()=>SH().met?{}:null,goShop()],
 ['x_shMutter',2,()=>SH().met&&MU().day?{}:null,goShop('counter')],
 ['x_shBgm',2,()=>songs().length&&!H.shopSongId?{}:null,goBgm],
 ['x_shBgmOn',1,()=>H.shopSongId?{song:songName(H.shopSongId)}:null,goBgm]);
/* 🎵 お店の BGM の ミナ先生の セリフ */
Object.assign(MINA_LINES,{
 x_shBgm:[['smile','レコード、 もってるよね。 カードショップの 🎵 BGMで えらぶと、 お店の 中で ながれるよ'],['happy','お店で 曲を ながすと、 ミオさんも ごきげんに なるんだって']],
 x_shBgmOn:[['happy','カードショップで 「{song}」を ながしてるんだね。 店長さんの センス、 いいね'],['smile','「{song}」は お店に 入ると ながれるよ。 浜辺では 波の 音を 聞こうね']],
 sh_bgmNew:[['wow','お知らせ！ レコードは カードショップの 中だけで ながれるように なったよ。 お店の 🎵 BGMで 曲を えらんでね'],['smile','曲は カードショップの 中だけで ながれるように なったんだ。 浜辺に 出ると 止まって、 お店に もどると また ながれるよ']]});
/* the shop changed: Mina tells you once */
setTimeout(function first(){const S=SH();if(S.told)return;const m=window.MINA;if(!m||!m.canAnnounce||!m.canAnnounce())return setTimeout(first,15000);
  S.told=1;save();const [ex,tx]=ML('sh_first');m.say('m',ex,tx,10000,null,['🃏 お店へ',()=>CG.open()])},12000);

/* records play only in the shop now: Mina tells you once（レコードを もっている 人だけ） */
setTimeout(function first4(){const S=SH();if(S.bgmTold||!songs().length)return;const m=window.MINA;if(!m||!m.canAnnounce||!m.canAnnounce())return setTimeout(first4,20000);
  S.bgmTold=1;save();const [ex,tx]=ML('sh_bgmNew');m.say('m',ex,tx,10000,null,goBgm())},26000);

/* the bubbles are new: Mina tells you once（もう お店を 知っている 人だけ） */
setTimeout(function first3(){const S=SH();if(S.mutTold||!S.met||!MU().day)return;const m=window.MINA;if(!m||!m.canAnnounce||!m.canAnnounce())return setTimeout(first3,20000);
  S.mutTold=1;save();const [ex,tx]=ML('sh_mutNew');m.say('m',ex,tx,10000,null,goShop('counter')())},34000);

H.on('home',()=>{if(CT)CT.alive=false});
window.SHOP={open,leave,price,allCards,counter,floor,store,rec:SH,inBook,free,stock,storeCards,bookRec:BOOKR,cleanFloor,rare};
})();
