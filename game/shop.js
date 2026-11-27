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
/* 💎 めずらしい 文・パーツの カード（11/18 ユーザー案）: お客さんが ときどき 売りに 来る。 1500〜5000コイン。 コインを ためる 目標に。
   買うと 自動で 📖ブックへ。 値切りなし・売り値も 同じ（もうけは 出ない） */
const premium=id=>/^[sp]:/.test(id)&&C.hash('pm'+id)%5===0;
const premP=id=>1500+(C.hash('pp'+id)%8)*500;
const premList=()=>{const L=[];try{(C.SENT||[]).forEach(x=>{const id='s:'+x.i;if(premium(id))L.push(id)});Object.keys(CG_PARTS).forEach(k=>{if(premium('p:'+k))L.push('p:'+k)})}catch(e){}return L};
/* ためている カード（コインが たりなくて 買えなかった 💎）。 SH().want={id,p,n:断った 回数} */
const wantRec=()=>{const w=SH().want;return w&&C.info(w.id)&&!C.owns(w.id)?w:null};
function price(id){const I=C.info(id);if(!I)return 0;if(premium(id))return premP(id);if(I.k==='t')return TPRICE[I.r]||20;if(I.k==='p')return 10;if(I.k==='s')return 30;return PRICE[I.lv]||12}
const rare=id=>{const I=C.info(id);return !!I&&(I.k==='t'&&I.r>=3||I.k==='w'&&I.lv==='adv'||premium(id)||C.kira(id))};

/* ================================================================ every card you have */
function allCards(){const r=R(),out=Object.keys(r.c).filter(id=>r.c[id]>0&&C.BY[id]);
  try{CARDS.book.forEach(t=>{if(CARDS.n(t)>0)out.push('t:'+t.e)})}catch(e){}
  Object.keys(r.pt||{}).forEach(k=>{if(r.pt[k]>0)out.push('p:'+k)});Object.keys(r.st||{}).forEach(k=>{if(r.st[k]>0)out.push('s:'+k)});return out}
/* the floor only keeps cards you still have */
/* 📖 カードブック（game/cbook.js）: 入れた カードは 1まい ブックに とっておく（売り場には 出せない） */
const BOOKR=()=>{const S=SH();if(!S.book||typeof S.book!=='object'||Array.isArray(S.book))S.book={};return S.book};
/* 11/22〜 ブックは 記録（図鑑）だけ。 カードは 減らない・ブックから 出せない。 inBook は 「記録ずみ」 */
const inBook=id=>BOOKR()[id]?1:0;
/* 🖼️ かざりだな（カウンターの ガラスケース、 3まい）: 飾った 1まいは 売り場に 出せない・倉庫から 出ていく（ブックと 同じ）。 持っている カードなので 鉱山には 出ない */
const CASE_N=3;
const CASER=()=>{const S=SH();if(!Array.isArray(S.cs))S.cs=[null,null,null];while(S.cs.length<CASE_N)S.cs.push(null);return S.cs};
const inCase=id=>CASER().includes(id)&&C.count(id)>0?1:0;
const caseN=()=>CASER().filter(Boolean).length;
/* もう もっていない カードは ケースから 下ろす（ブックの 1まいが 先） */
function cleanCase(){const cs=CASER();let ch=0;cs.forEach((id,i)=>{if(id&&(!C.info(id)||C.count(id)<1)){cs[i]=null;ch=1}});if(ch)save()}
function cleanFloor(){cleanCase();const S=SH(),need={};S.floor=S.floor.filter(id=>{need[id]=(need[id]??inCase(id))+1;return C.info(id)&&C.count(id)>=need[id]})}
const onFloor=id=>SH().floor.filter(x=>x===id).length;
/* 売り場に 出せる まい数（ブックの 1まいと 売り場の 分を のぞく） */
const free=id=>C.count(id)-onFloor(id)-inCase(id);
/* 倉庫に ある まい数（ブックに 入れた 1まい・ケースの 1まい・売り場に ならべた 分は 倉庫から 出ていく） */
const stock=id=>Math.max(0,C.count(id)-inCase(id)-onFloor(id));
const storeCards=()=>allCards().filter(id=>stock(id)>0);
function sell(id,p,fly){const S=SH(),i=S.floor.indexOf(id);if(i<0)return false;S.floor.splice(i,1);C.take(id);S.sold++;S.earn+=p;
  const d=C.today();if(S.tday!==d){S.tday=d;S.tearn=0}S.tearn+=p;if(!fly)H.addCoins(p);save();return true}

/* ================================================================ the Mio bubble */
let jaOn=true;
function speak(en){try{MIO.say(en)}catch(e){}}
/* お客さんの 声: その 人の 女の人・男の人の 声で（GUESTS の v）。 デバイスに その 声が なければ 高さで 近づける */
const gspeak=en=>{try{const G=CT&&CT.g&&CT.g.G,v=G&&G.v;if(!v||!window.speechSynthesis)return C.speak(en);if(!ST.sound||!en)return;
  speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(sayNames(String(en)));u.lang='en-US';
  const pv=window.MIO&&MIO.vpick?MIO.vpick(v.s,G.anon?G.seed:GUESTS.indexOf(G)>>1):null;if(pv)u.voice=pv;
  u.pitch=Math.max(.1,Math.min(2,pv?v.p:v.p+(v.s==='m'?-.3:.35)));u.rate=(ST.slow?.75:.95)*(v.r||1);
  u.volume=Math.min(1,(ST.vol&&ST.vol.voice!=null)?ST.vol.voice:1);speechSynthesis.speak(u)}catch(e){}};
function bubble(en,ja,ex='smile',pose=''){return `<div class="cgnagi shm"><span class="cgnf cgm">${MIO.face(ex,pose)}</span><div class="cgnb"><b>ミオ</b><p class="en">${esc(en)}</p><p class="ja" ${jaOn?'':'hidden'}>${esc(ja)}</p></div></div>`}
function bindBubble(root=H.panel){root.querySelectorAll('.shm .cgnb').forEach(b=>b.onclick=()=>{jaOn=!jaOn;b.querySelector('.ja').hidden=!jaOn;speak(b.querySelector('.en').textContent)})}
const night=()=>{try{return SCENE.dark()}catch(e){return 0}};

/* ================================================================ the shop front */
const top=(t,right='',id='shb')=>`<div class="qtop"><button class="x" id="${id}" aria-label="もどる">←</button><b>${t}</b><span class="qn">${right}</span></div>`;
/* 11/22 作りなおし: 入口の メニューは なくして、 いつも 店の 画面（上＝お店・下＝🪨原石の 作業台。 game/ore.js） */
function open(){cleanFloor();const S=SH();
  if(!S.met)return intro();
  if(S.away)return report();
  counter(true)}

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
    <p class="note">レコードは お店の 中で ながれるよ（浜辺では とまる。 鉱山では 鉱山の 🎵 ボタンで えらべる）。 カウンターの 🎶 レコードプレイヤーを タップしても オン・オフ できるよ</p>
  </section>`);
  bindBubble();speak(ln[0]);$('shb').onclick=()=>{sf('back');open()};
  H.panel.querySelectorAll('[data-bg]').forEach(b=>b.onclick=()=>{const id=b.dataset.bg||null;sf('pop');H.shopSong(id);try{RECENT.add('bgm',{id,ja:id?songName(id):''})}catch(e){}bgm(pickL(MIO_BGM[id?'on':'off']))})}

/* the first visit: Mio says hello, and the starter cards */
function intro(){const S=SH();let i=0;
  const step=()=>{const t=MIO_FIRST[i];
    H.show('cg',`<section class="pnl cgp shp" data-stay>${top('🃏 カードショップ しおさい','','cgx')}
      <div class="shintro">${MIO.face(i===0?'laugh':i===1?'wink':'smile',i===0?'wave':i===1?'peace':'thumb')}</div>
      ${bubble(t[0],t[1],'smile')}<button id="shnx" class="big">${i<MIO_FIRST.length-1?'つぎへ ▶':'よろしくね！'}</button></section>`);
    H.panel.querySelector('.shm .cgnf').hidden=true;
    bindBubble();speak(t[0]);$('cgx').onclick=()=>{sf('back');H.home()};
    $('shnx').onclick=()=>{sf('step');i++;if(i<MIO_FIRST.length)return step();
      S.met=1;save();if(!R().met){R().met=1;C.save()}open()}};   // 11/18: はじめの 15まいは くばらない（カードは 鉱山で ほって ゲット）
  step()}

/* ================================================================ back from the mine: Mio's report */
/* 11/24 閉店中（浜辺の 時計で 21〜9時）は お店も 閉まっている。 るすの あいだ 開いていた 時間だけ 数える。
   ゲームの 時計は 画面が 見えている ときだけ 進むので、 3びょうごとに 「いま 開いている？」を 見て 時間を 足していく（hoshi_shAway） */
const AWK='hoshi_shAway';
const awRd=()=>{try{const o=JSON.parse(localStorage.getItem(AWK)||'null');return o&&typeof o==='object'?o:null}catch(e){return null}};
const awWr=o=>{try{localStorage.setItem(AWK,JSON.stringify(o))}catch(e){}};
const cgOpen=()=>{try{return !window.HOURS||HOURS.isOpen('cg')}catch(e){return true}};
function awTick(){const S=SH();if(!S.away)return null;const now=Date.now();let o=awRd();
  if(!o||o.a!==S.away)o={a:S.away,o:0,c:0,t:S.away,old:1};   // 前の 版で 出かけた ときは そのまま 開いていた あつかい
  const d=Math.max(0,now-(o.t||now));if(o.old||cgOpen())o.o+=d;else o.c+=d;o.t=now;awWr(o);return o}
setInterval(()=>{try{awTick()}catch(e){}},3000);
function awaySales(min){const S=SH(),n=Math.min(12,Math.floor(min/1.5)),sold=[];let guests=0;
  for(let k=0;k<n;k++){guests++;if(!S.floor.length)continue;if(Math.random()<.55){const id=pickL(S.floor),p=price(id);if(sell(id,p))sold.push([id,p])}}
  S.guests+=guests;return {guests,sold}}
function report(){const S=SH(),all=Math.max(0,(Date.now()-S.away)/6e4),aw=awTick()||{o:all*6e4,c:0};S.away=0;save();try{localStorage.removeItem(AWK)}catch(e){}
  const opn=Math.min(all,aw.o/6e4),cls=Math.min(all,aw.c/6e4);
  const r=awaySales(opn),coins=r.sold.reduce((a,x)=>a+x[1],0);
  r.closed=cls>=1?1:0;r.allClosed=r.closed&&opn<1.5?1:0;r.cmin=Math.round(cls);
  try{RECENT.add('away',{sold:r.sold.length,guests:r.guests,coins,closed:r.closed,allClosed:r.allClosed})}catch(e){}
  const wd=id=>{const I=C.info(id);return I&&I.en?String(I.en).split(',')[0].trim():''};
  const M=window.MIOMEMO?MIOMEMO.make(r,wd):{lines:[r.sold.length?pickL(MIO_MEMO):pickL(MIO_MEMO_QUIET)],ph:null,sign:['– Mio','ミオ']};
  const memo=M.lines;S.memo=M;save();const memoEn=memo.map(x=>x[0]).join(' ');
  const ex=r.sold.length?'laugh':r.guests?'smile':r.allClosed?'smile':'oops',pose=r.sold.length?'peace':'';
  H.show('cg',`<section class="pnl cgp shp">${top('📋 るすばんの 報告','','shb')}
    <div class="shrep"><div class="shrf">${MIO.face(ex,pose)}</div>
      <div>${r.allClosed?`<p class="shrn">🌙 閉店中 だったので、 お店も おやすみ</p><p class="shrcl">お客さんは 来ないよ（カードショップは 9〜21時）</p>`:`<p class="shrn">お客さん <b>${r.guests}</b>人 ・ 売れた カード <b>${r.sold.length}</b>まい</p>${r.closed?`<p class="shrcl">🌙 閉店中の 時間は お店も おやすみ</p>`:''}`}
      ${r.sold.length?`<div class="shsold">${r.sold.map(([id])=>C.face(id,{mini:1,marks:false})).join('')}</div><p class="shcoin">🪙 +${coins}</p>`:''}</div></div>
    <div class="shmemo"><b>📝 ミオの メモ</b>${memo.map((x,i)=>`<p class="en${i?' ps':''}">${esc(x[0])}</p><p class="ja">${esc(x[1])}</p>`).join('')}
      ${M.ph?`<div class="wd"><p class="en">📌 Today's phrase: <b>${esc(M.ph[0])}</b> ＝ ${esc(M.ph[1])}</p><p class="ja">${esc(M.ph[2])}</p></div>`:''}
      <p class="sg">${esc(M.sign[0])}</p><button class="sub" id="shsay">🔊 読む</button></div>
    <button id="shok" class="big">お店に もどる</button></section>`);
  if(r.sold.length){sf('coinIn');setTimeout(()=>sf('buy'),300)}else sf('talk');
  if(r.closed)try{if(window.MINA&&MINA.canAnnounce&&MINA.canAnnounce()&&Math.random()<.6){const [ex2,tx2]=ML(r.allClosed?'sh_awayClosed':'sh_awayPart');if(tx2)setTimeout(()=>MINA.say('m',ex2,tx2,6000),2200)}}catch(e){}
  C.peekIn(H.panel.querySelector('.shsold'),{from:'report'});
  $('shsay').onclick=()=>speak(memoEn+(M.ph?' '+M.ph[2]:''));$('shb').onclick=$('shok').onclick=()=>{sf('step');open()}}
/* the mine calls this when you leave for it */
function leave(){const t=Date.now();SH().away=t;awWr({a:t,o:0,c:0,t});if(CT)CT.paused=0;save()}

/* ================================================================ 📦 the storeroom */
let stF='all';
function store(f){cleanFloor();if(typeof f==='string')stF=f;const F=[['all','ぜんぶ'],['es','小'],['jh','中'],['hs','高'],['adv','H'],['t','宝'],['weak','😣苦手'],...(window.UNK?[['unk','📜']]:[])];
  let ids=storeCards().filter(id=>{const I=C.info(id);if(!I)return false;if(stF==='all')return true;if(stF==='t')return I.k==='t';if(stF==='weak')return I.k==='w'&&C.weak(id);if(stF==='unk')return UNK.cardHas(I);
return I.k==='w'&&I.lv===stF});
  ids.sort((a,b)=>(C.info(a).lv||'').localeCompare(C.info(b).lv||'')||C.star(a)-C.star(b));
  const shown=ids.slice(0,240);
  H.show('cg',`<section class="pnl cgp shp">${top('📦 倉庫',`${ids.length}しゅるい`)}
    <div class="shf">${F.map(([k,n])=>`<button data-f="${k}" class="${stF===k?'on':''}">${n}</button>`).join('')}</div>
    <div class="shgrid">${shown.map(id=>{
      return `<div class="shcell" data-id="${esc(id)}">${C.face(id,{mini:1,n:stock(id)})}${onFloor(id)?`<u title="売り場にも ${onFloor(id)}まい">🏷️</u>`:''}</div>`}).join('')||'<p class="note">カードが ないよ</p>'}</div>
    ${SH().floor.length?'<p class="note">🏷️ 売り場に ならべた カードは 売り場で 見てね（🏷️は 売り場にも ある しるし）</p>':''}
    ${ids.length>shown.length?`<p class="note">ほか ${ids.length-shown.length}しゅるい（しぼりこんで 見てね）</p>`:''}</section>`);
  $('shb').onclick=()=>{sf('back');open()};
  H.panel.querySelectorAll('[data-f]').forEach(b=>b.onclick=()=>{stF=b.dataset.f;sf('tap');store()});
  H.panel.querySelectorAll('.shcell').forEach(c=>c.onclick=()=>{sf('card');C.detail(c.dataset.id,null,{from:'store'})})}

/* ================================================================ 🏷️ the sales floor */
function floor(){cleanFloor();const S=SH();
  H.show('cg',`<section class="pnl cgp shp">${top('🏷️ 売り場',`${S.floor.length}/${FLOOR_N}`)}
    <p class="note">ならべた カードを お客さんが 買っていくよ（るすの あいだは ミオが 売る）。 カードを タップで くわしく・下げる</p>
    <div class="shfloor">${Array.from({length:FLOOR_N},(_,i)=>{const id=S.floor[i];return id?`<div class="shslot" data-i="${i}">${C.face(id,{mini:1,marks:false})}<span>🪙${price(id)}</span>${C.count(id)-onFloor(id)<=0&&C.count(id)<=1?'<em>さいごの 1まい</em>':''}</div>`:`<div class="shslot empty" data-i="${i}"><b>＋</b></div>`}).join('')}</div>
    <div class="row"><button id="shauto">🃏 ダブりで おまかせ</button><button id="shclr" class="sub">ぜんぶ 下げる</button></div>
    <button id="shtoc" class="shtoc">🧑‍💼 カウンターへ</button></section>`);
  $('shb').onclick=()=>{sf('back');open()};
  /* 🧑‍💼 カウンターへ: カウンターから 来たときは さっきの つづき（お客さん・ミオの 会話）から */
  $('shtoc').onclick=()=>{sf('step');counter(true)};
  /* ならべた カードは タップで くわしく 画面（その 下に 「下げる」「かえる」） */
  H.panel.querySelectorAll('.shslot').forEach(s=>s.onclick=()=>{const i=+s.dataset.i,id=S.floor[i];if(!id)return pick();
    const off=()=>{const j=S.floor.indexOf(id);if(j>=0)S.floor.splice(j,1);save()};
    sf('card');C.detail(id,null,{from:'floor',btns:[['🏷️ 売り場から 下げる',()=>{off();sf('back');floor()},'sub'],['🔁 ほかの カードに かえる',()=>{off();floor();pick()},'sub']]})});
  $('shauto').onclick=()=>{const dup=allCards().filter(id=>free(id)>=(inCase(id)?1:2)).sort((a,b)=>C.count(b)-C.count(a));let n=0;
    for(const id of dup){if(S.floor.length>=FLOOR_N)break;S.floor.push(id);n++}save();if(n){sf('card');H.toast(`🏷️ ${n}まい ならべたよ`)}else H.toast('ダブった カードが ないよ。 ＋から えらんでね');floor()};
  $('shclr').onclick=()=>{S.floor=[];save();sf('back');floor()}}
/* choose a card to put out */
function pick(){const S=SH();const ids=allCards().filter(id=>free(id)>0).sort((a,b)=>C.count(b)-C.count(a)||price(b)-price(a)).slice(0,120);
  const o=C.ov(`<div class="shpick"><b>どの カードを ならべる？</b><p class="note">ダブっている カードが 上。 🎁宝カードも 売れるよ</p>
    <div class="shgrid">${ids.map(id=>`<div class="shcell" data-id="${esc(id)}">${C.face(id,{mini:1,n:free(id),marks:false})}<span>🪙${price(id)}</span></div>`).join('')||'<p class="note">ならべられる カードが ないよ</p>'}</div>
    <button class="sub" id="shpx">やめる</button></div>`,'by');
  o.querySelector('#shpx').onclick=()=>{sf('back');C.closeOv()};
  o.querySelectorAll('.shcell').forEach(c=>c.onclick=()=>{const id=c.dataset.id;if(S.floor.length>=FLOOR_N)return;S.floor.push(id);save();sf('card');C.closeOv();floor()})}

/* ================================================================ 🖼️ かざりだな（ガラスケースに 3まい） */
const MIO_CASE={
  hi:[["Our treasures! Which card is the star today?","うちの お宝！ きょうの 主役は どの カード？"],["Customers stop and look at the case every day.","お客さん、 毎日 ケースの 前で 立ちどまるんですよ。"],["I polished the glass this morning. Shiny!","けさ ガラスを みがいたんです。 ピカピカ！"]],
  empty:[["Let's put three special cards in the glass case!","ガラスケースに とっておきの 3まいを かざりましょう！"],["An empty showcase is sad. Show off your best cards, boss!","からっぽの ケースは さみしい。 いちばんの カードを 見せちゃいましょう、 店長！"]],
  put:[["{w}! It looks great in the case.","「{w}」！ ケースに 入ると かっこいい！"],["Nice! {w} is shining now.","いいですね！ 「{w}」が キラキラしてる。"],["Good choice. I'll keep {w} safe.","いい えらび方。 「{w}」は わたしが 守ります。"]],
  rare:[["A {r} card?! Customers will be amazed!","{r}の カード！？ お客さん、 びっくりしますよ！"],["Wow… I can't stop looking at it.","わあ… ずっと 見ちゃう。"]],
  off:[["Back to the storeroom. Good job, card!","倉庫に おかえり。 おつかれさま、 カードさん！"],["Okay! Who's next in the case?","はーい！ つぎは だれを かざります？"]],
  none:[["We need more cards… Rare ones are in the mine!","カードが たりない… レアな カードは 鉱山に あるんです！"]]};
const cnm=I=>I.k==='w'?String(I.en).split(',')[0].trim():I.en;
const caseLine=(k,v={})=>{const x=pickL(MIO_CASE[k]);return x.map(t=>t.replace(/\{w\}/g,v.w||'').replace(/\{r\}/g,v.r||''))};
/* レアな ほど 上に（UR→SSR→SR→ハイレベル→…） */
function rank(id){const I=C.info(id);if(!I)return 0;if(I.k==='t')return I.r>=3?10+I.r:5+I.r;return {adv:9,hs:4,jh:3,es:1}[I.lv]||(I.k==='s'?2:0)}
function caseScreen(back,ln){cleanFloor();back=back||open;const cs=CASER();
  const say=ln||caseLine(caseN()?'hi':'empty');
  H.show('cg',`<section class="pnl cgp shp shcs">${top('🖼️ かざりだな',`${caseN()}/${CASE_N}`)}
    ${bubble(say[0],say[1],caseN()?'laugh':'smile',caseN()?'peace':'')}
    <div class="shcsg">${cs.map((id,i)=>id?`<div class="shcsl" data-i="${i}">${C.face(id,{ja:1,marks:false})}<div class="row"><button data-ch="${i}" class="sub">かえる</button><button data-off="${i}" class="sub">下げる</button></div></div>`
      :`<div class="shcsl empty" data-i="${i}"><button data-ch="${i}"><b>＋</b>かざる</button></div>`).join('')}</div>
    <p class="note">かざった カードは 売りものに ならないよ（倉庫から ケースへ おひっこし）</p></section>`);
  bindBubble();speak(say[0]);$('shb').onclick=()=>{sf('back');back()};
  C.peekIn(H.panel.querySelector('.shcsg'),{from:'case'});
  H.panel.querySelectorAll('[data-off]').forEach(b=>b.onclick=()=>{cs[+b.dataset.off]=null;save();sf('back');caseScreen(back,caseLine('off'))});
  H.panel.querySelectorAll('[data-ch]').forEach(b=>b.onclick=()=>{sf('step');casePick(+b.dataset.ch,back)})}
function casePick(i,back){const cs=CASER(),cur=cs[i];
  const ids=allCards().filter(id=>id!==cur&&!cs.includes(id)&&free(id)>0).sort((a,b)=>rank(b)-rank(a)||price(b)-price(a)).slice(0,120);
  if(!ids.length){sf('talk');return caseScreen(back,caseLine('none'))}
  const o=C.ov(`<div class="shpick"><b>どの カードを かざる？</b><p class="note">レアな カードが 上だよ</p>
    <div class="shgrid">${ids.map(id=>`<div class="shcell" data-id="${esc(id)}">${C.face(id,{mini:1,marks:false})}</div>`).join('')}</div>
    <button class="sub" id="shpx">やめる</button></div>`,'by');
  o.querySelector('#shpx').onclick=()=>{sf('back');C.closeOv()};
  o.querySelectorAll('.shcell').forEach(c=>c.onclick=()=>{const id=c.dataset.id,I=C.info(id);cs[i]=id;save();C.closeOv();
    const w=cnm(I),big=I.k==='t'&&I.r>=4;try{big?SFX.fanfare(1):sf('card')}catch(e){sf('card')}
    caseScreen(back,big?caseLine('rare',{r:['','N','R','SR','SSR','UR'][I.r]}):caseLine('put',{w}));
    try{if(window.MINA&&MINA.canAnnounce&&MINA.canAnnounce()&&Math.random()<.3){const [ex,tx]=ML('sh_casePut',{w,ja:I.ja||''});MINA.say('m',ex,tx,6000)}}catch(e){}})}

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
function table(c,n,t){PR(c,70,80,58,9,'#fff');PR(c,70,89,58,2,'#cfdbe4');PR(c,73,91,3,10,'#9ab4c8');PR(c,122,91,3,10,'#9ab4c8');
  /* 台の 左はしの 小さな ランタン（夜は 灯る。 光の にじみは lights()） */
  PR(c,73,77,1,1,'#5a6a7a');PR(c,72,78,1,1,'#5a6a7a');PR(c,74,78,1,1,'#5a6a7a');PR(c,71,79,5,1,'#3a5a8a');PR(c,71,80,5,5,'#d8eef8');PR(c,71,80,1,1,'#3a5a8a');PR(c,75,80,1,1,'#3a5a8a');PR(c,71,84,1,1,'#3a5a8a');PR(c,75,84,1,1,'#3a5a8a');PR(c,72,81,3,3,t&&t!=='day'?'#ffe2a0':'#f4ead2');PR(c,70,85,7,1,'#3a5a8a');PR(c,70,86,7,1,'#cfdbe4');
  for(let i=0;i<n;i++)card(c,79+(i%5)*10+(i>4?3:0),80+(i>4?4:0),CC[(i*5)%6])}
function desk(c){PR(c,138,68,60,4,'#fff');PR(c,138,72,60,20,'#e8eef4');PR(c,138,72,60,1,'#9ab4c8');PR(c,138,91,60,1,'#9ab4c8');for(let x=138;x<198;x+=12)PR(c,x,78,6,3,'#3a7ac0');
  PR(c,182,64,6,3,'#ffcf4a');PR(c,184,63,2,1,'#ffcf4a');PR(c,181,67,8,1,'#b08a3a');PR(c,146,62,12,6,'#a8784a');PR(c,147,63,10,2,'#fff2c8')}
function lights(c,t){if(t==='day')return;c.fillStyle=t==='dusk'?'rgba(120,60,90,.22)':'rgba(16,22,60,.55)';c.fillRect(0,0,W,HH);
  sky(c,118,14,27,30,32,t,0);sky(c,147,14,27,30,32,t,5);if(t==='night'){PR(c,161,17,3,1,'#fff2b0');PR(c,160,18,2,4,'#fff2b0');PR(c,161,22,3,1,'#fff2b0')}
  const a=t==='night'?1:.6;for(let x=5;x<W;x+=10){PR(c,x,11,2,2,'#ffe2a0');glow(c,x+1,12,6,.3*a)}
  PR(c,92,0,1,12,'#555');PR(c,88,12,9,3,'#3a7ac0');PR(c,90,15,5,3,'#ffe2a0');glow(c,92,18,26,.32*a);
  PR(c,186,58,5,6,'#ffe2a0');PR(c,185,57,7,1,'#3a5a8a');glow(c,188,61,20,.35*a);
  if(caseN()){PR(c,11,87,50,1,'#ffe2a0');glow(c,36,94,24,.3*a)}glow(c,73,82,14,.3*a)}
/* 🖼️ the glass showcase on the floor, front left（中の カードの 絵は DOMで くっきり。 caseArt） */
const CX=[14,30,46],CY=89,CPX=[8,83,64,116];   // カードの 位置 ／ タップできる ところ（x1,y1,x2,y2）
const TCOL=['','#9aa8bc','#c0c8d8','#ffd23f','#9fe8ff','#ff6ad5'];
function rcol(id){const I=C.info(id);if(!I)return '#ccc';if(I.k==='t')return TCOL[I.r]||'#ccc';if(I.k==='w')return (C.LV[I.lv]||{}).col||'#9ab4c8';return I.k==='s'?'#ffcf7a':'#9fe8e0'}
function showcase(c,f){const cs=CASER();
  PR(c,11,111,2,5,'#9ab4c8');PR(c,59,111,2,5,'#9ab4c8');
  PR(c,10,103,52,8,'#fff');PR(c,10,110,52,1,'#cfdbe4');PR(c,10,103,52,1,'#9ab4c8');PR(c,32,105,8,3,'#e8c86a');PR(c,33,106,6,1,'#fff2c8');
  PR(c,11,87,50,16,'#7a2a48');PR(c,11,101,50,2,'#5a1a34');
  cs.forEach((id,i)=>{const x=CX[i];if(!id){PR(c,x+4,CY+11,4,2,'#9a4a68');return}
    PR(c,x,CY,12,13,rcol(id));PR(c,x+1,CY+1,10,11,'#fffdf6');PR(c,x+4,CY+13,4,1,'#c8a050');
    if((f+i*8)%24<3){PR(c,x+11,CY-1,1,3,'#fff');PR(c,x+10,CY,3,1,'#fff')}});
  c.fillStyle='rgba(200,235,255,.16)';c.fillRect(11,87,50,16);
  PR(c,12,88,1,13,'rgba(255,255,255,.4)');PR(c,28,88,1,4,'rgba(255,255,255,.3)');PR(c,59,88,1,13,'rgba(255,255,255,.25)');PR(c,11,101,50,1,'rgba(255,255,255,.3)')
  PR(c,10,86,52,1,'#fff');PR(c,10,86,1,17,'#fff');PR(c,61,86,1,17,'#fff')}
/* 絵（絵文字）は キャンバスの 上に DOMで 重ねる */
function caseArt(){const box=$('shcase');if(!box)return;const st=box.parentNode,k=st.clientWidth/W,cs=CASER(),key=cs.join('|')+'@'+Math.round(k*10);
  if(box.dataset.k===key)return;box.dataset.k=key;
  box.innerHTML=cs.map((id,i)=>{if(!id)return '';const I=C.info(id);if(!I)return '';const m=C.art(I)[0];
    return `<i style="left:${(CX[i]+6)*k}px;top:${(CY+6.5)*k}px;font-size:${Math.max(9,8*k)}px">${esc(m)}</i>`}).join('')}
/* a guest (grown-ups of the beach) */
function guest(c,x,y,L,pose,f){if(window.MIOPX&&MIOPX.guest)return MIOPX.guest(c,x,y,L,pose,f);   // ミオと 同じ 絵柄（game/mio-pix.js）
  x=Math.round(x);y=Math.round(y);const s=L.skin,st=pose==='walk'?f%2:0;
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

/* 🎶 the record player on the floor, in front of the counter（タップで お店の BGMを オン・オフ） */
const PX=[170,86,199,116];   // タップできる ところ（x1,y1,x2,y2）
const DISC=[[181,92],[184,92],[186,93],[187,94],[186,95],[183,96],[180,96],[177,95],[176,94],[177,93],[179,92]];
function player(c,on,f){
  /* the low wooden cabinet, with records inside */
  PR(c,170,99,27,14,'#b07a4a');PR(c,170,99,27,1,'#d09a62');PR(c,171,113,2,3,'#7a4e2a');PR(c,194,113,2,3,'#7a4e2a');PR(c,170,112,27,1,'#8a5a32');
  PR(c,172,101,23,10,'#6a4428');['#ff7a8a','#5ab4ff','#ffd23f','#7ad37a','#c79ad6','#ff9a4a','#fff','#5ab4ff','#ff7a8a'].forEach((col,i)=>PR(c,173+i*2+(i>5?3:0),102+(i%3===1?1:0),1,9-(i%3===1?1:0),col));
  PR(c,186,103,1,8,'#e8c86a');PR(c,187,104,1,7,'#3a7ac0');
  /* the turntable */
  PR(c,171,89,25,8,'#4a3a5a');PR(c,171,89,25,1,'#6a5a7a');PR(c,171,96,25,3,'#2e2438');
  PR(c,177,91,9,1,'#1a1420');PR(c,175,92,13,1,'#1a1420');PR(c,174,93,15,2,'#1a1420');PR(c,175,95,13,1,'#1a1420');PR(c,177,96,9,1,'#1a1420');
  PR(c,180,93,3,2,on?'#ff6a5a':'#c04a4a');PR(c,181,93,1,1,'#fff2c8');
  if(on){const a=DISC[f%DISC.length],b=DISC[(f+5)%DISC.length];PR(c,a[0],a[1],1,1,'#8a7aa0');PR(c,b[0],b[1],1,1,'#5a4a70')}else PR(c,178,92,2,1,'#5a4a70');
  /* the tonearm: on the record when it plays */
  PR(c,192,90,2,2,'#c8ccd8');if(on){PR(c,190,92,2,1,'#c8ccd8');PR(c,188,93,2,1,'#c8ccd8');PR(c,187,94,1,1,'#fff')}else{PR(c,193,92,1,3,'#c8ccd8');PR(c,192,95,2,1,'#fff')}
  PR(c,173,97,2,1,on?'#7aff9a':'#5a4a3a');PR(c,190,97,3,1,'#8a7aa0')}
/* 音符（♪）は DOMで ふわっと のぼらせる（キャンバスより なめらか） */
function note(){const box=$('shnotes');if(!box)return;const st=box.parentNode,k=st.clientWidth/W,e=document.createElement('i');
  e.textContent=pickL(['♪','♫','♪','♬']);e.style.left=((176+Math.random()*12)*k)+'px';e.style.top=(80*k)+'px';e.style.fontSize=Math.max(16,12*k)+'px';
  e.style.color=pickL(night()>.25?['#ffd23f','#ff9ab0','#8fd8ff','#a8f0a0','#fff2c8']:['#ff6a8a','#3a9ae0','#f0a020','#4ab04a','#a070d0']);e.style.setProperty('--sx',(Math.random()<.5?-1:1)*(6+Math.random()*8)*k/2+'px');
  e.style.setProperty('--up',(26+Math.random()*10)*k+'px');e.onanimationend=()=>e.remove();box.appendChild(e);while(box.children.length>8)box.firstChild.remove()}
const MIO_REC={
  on:[["Ooh, good pick, boss! I love this one.","おっ、 「{song}」！ いい えらび方ですね、 店長。"],["The record is spinning! I love that little crackle.","レコードが 回ってる！ あの パチパチって 音が 好きなんです。"],["Music on! Let's sell some cards with a beat.","音楽 オン！ リズムに のって カードを 売りましょう。"],["This song makes the shop feel like summer.","この曲で お店が 夏っぽく なりますね。 「{song}」！"]],
  off:[["Music off. Now I can hear the waves again.","音楽 オフ。 また 波の 音が 聞こえますね。"],["Taking a break, Mr. Record? Good job today.","レコードさんも ひと休み？ きょうも おつかれさま。"],["Shh… the shop is quiet now.","しーっ… お店が しずかに なりました。"]],
  wake:[["Huh?! I wasn't sleeping! …Nice song, though.","はっ！？ ねてません！ …でも いい曲ですね。"]],
  empty:[["We have a record player, but no records yet! Nora's shop on the beach sells them.","プレイヤーは あるけど、 レコードが まだ ないんです！ 浜辺の ノラさんの お店で 売ってますよ。"],["The player is hungry for records. Let's buy one at Nora's shop!","プレイヤーが レコードを まってます。 ノラさんの お店で 買いましょう！"]],
  mute:[["The record is spinning, but the sound is off. Try the speaker button at the top!","レコードは 回ってるけど、 音が オフみたい。 右上の 🔊 ボタンを 見てみて！"]],
  play:[["La la la… Oh! Did you hear me singing?","ラララ♪ …あっ！ 歌ってるの 聞こえました？"],["I tap my foot when I work. It's the music's fault!","仕事しながら 足で リズムを とっちゃう。 音楽の せいです！"],["Customers walk slower when music plays. I think they like it.","音楽が かかってると、 お客さんが ゆっくり 歩くんです。 気に入ってるのかな。"],["This part is my favorite! Listen!","ここの ところが いちばん 好き！ 聞いて！"],["When I study English, I listen to songs too. The words stay in my head!","英語の 勉強の ときも 歌を 聞くんです。 ことばが 頭に のこるの！"],["Again? I'm not tired of this song. Not at all!","また 「{song}」？ あきてませんよ。 ぜんぜん！"]]};
/* スローな ローファイ（game/music-lofi.js）を かけた ときの ミオの ひとこと。 曲ごとに ちがう */
const MIO_SONG={
  lofi_nap:[["I can hear the waves in the song AND outside. Double waves!","曲の 中にも 外にも 波の 音。 波が 2ばいです！"],["This one makes me want to nap behind the counter… just kidding!","これ、 カウンターの うしろで おひるね したくなる… じょうだんです！"]],
  lofi_cat:[["A music box and a guitar. It sounds like a cat stretching in the sun.","オルゴールと ギター。 日なたで のびを する ねこみたいな 音。"],["Did you hear the little birds? Tweet tweet!","小鳥、 聞こえました？ チュンチュン！"]],
  lofi_moon:[["It goes one-two-three, one-two-three. A lullaby for the cards.","いち・に・さん、 いち・に・さん。 カードたちの 子守歌ですね。"],["Shh… the cards are falling asleep.","しーっ… カードたちが ねむっちゃう。"]],
  lofi_rain:[["Rain sounds plus hot cocoa. I'd buy that combo!","雨の 音に ホットココア。 その セット、 買います！"],["It's sunny outside, but it's raining in the shop. Cozy!","外は 晴れなのに、 お店の 中は 雨。 ぬくぬく！"]],
  lofi_tape:[["The piano is wobbling! Is the tape okay? …Oh, it's on purpose.","ピアノが ゆれてる！ テープ 大丈夫？ …あ、 わざとなんだ。"],["My dad had a box full of cassette tapes. This smells like that box.","父が カセットテープを 箱いっぱい もってたんです。 これ、 あの 箱の においが する。"]],
  lofi_train:[["Clickety-clack, clickety-clack. Next stop, card shop!","ガタン ゴトン、 ガタン ゴトン。 つぎは カードショップ駅〜！"],["I like trains at night. Everyone is quiet and the windows glow.","夜の 汽車って 好き。 みんな しずかで、 窓が 光ってて。"]],
  lofi_lamp:[["Was that a foghorn? Bwooo… Ships, be careful!","いまの 霧笛？ ボーッ… 船の みなさん、 気を つけて！"],["Guitar and waves… it feels like the shop is a little lighthouse.","ギターと 波… お店が 小さな 灯台に なったみたい。"]],
  lofi_snow:[["Snow? On our beach? Only in the song, but I'll take it.","雪？ この 浜辺に？ 曲の 中だけでも うれしい。"],["The wind sounds cold, but the piano feels warm. Nice mix.","風は 冷たそうなのに、 ピアノは あったかい。 いい 組み合わせ。"]],
  lofi_library:[["Did someone just turn a page? It sounds like a library in here.","いま だれか ページ めくった？ お店が 図書館みたい。"],["I study English best with this one. Walking bass, walking words!","英語の 勉強は これが いちばん はかどるんです。 ベースも ことばも てくてく！"]],
  lofi_tide:[["This is the slowest song we have. Even my breathing slowed down.","うちで いちばん ゆっくりな 曲。 わたしの 息まで ゆっくりに なりました。"],["Slow… slow… like the tide coming in. Ahh, peaceful.","ゆっくり… ゆっくり… 満ちてくる 潮みたい。 はぁ、 おだやか。"]]};
const recLine=k=>{const id=H.shopSongId,n=id?songName(id):'';if((k==='on'||k==='play')&&MIO_SONG[id]&&Math.random()<.6)return pickL(MIO_SONG[id]).slice();const x=pickL(MIO_REC[k]);return [x[0],x[1].replace('{song}',n)]};
/* タップ: オンなら とめる、 オフなら 前に えらんだ 曲（なければ もっている 曲から 1つ） */
function recTap(T){const own=songs();
  if(!own.length){sf('tap');T.mut(recLine('empty'));T.status('🎶 レコードは 浜辺の 右はしの ながれぎ雑貨店で 買えるよ');return}
  const cur=H.shopSongId;
  if(cur){sf('back');H.shopSong(null);try{RECENT.add('bgm',{id:null,ja:''})}catch(e){}T.mio.pose='stand';T.mio.until=Date.now()+1500;T.mut(recLine('off'));T.status('🎶 音楽を とめたよ');return}
  const id=own.includes(ST.shopLast)?ST.shopLast:pickL(own);sf('pop');H.shopSong(id);try{RECENT.add('bgm',{id,ja:songName(id)})}catch(e){}
  const dz=T.mio.pose==='doze';T.mio.pose='cheer';T.mio.until=Date.now()+2500;
  T.mut(recLine(!ST.sound?'mute':dz?'wake':'on'));T.status(`🎶 「${esc(songName(id))}」を かけたよ${ST.sound?'':'（いまは 音が オフ）'}`);T.noteAt=0;
  try{if(window.MINA&&MINA.canAnnounce&&MINA.canAnnounce()&&ST.sound&&Math.random()<.2){const [ex,tx]=ML('sh_recOn',{song:songName(id)});MINA.say('m',ex,tx,6000)}}catch(e){}}

/* the little speech bubbles: Mio and the guests mutter in English（データは game/shop-mutter.js）。 1つずつ 順番に 出す */
const MU=()=>typeof SHOP_MUTTER!=='undefined'?SHOP_MUTTER:{};
/* a line from a pool, not the same one as last time */
function ML2(k){const a=MU()[k];if(!a||!a.length)return null;const L=ML2.last||(ML2.last={});let x,n=0;do{x=pickL(a)}while(a.length>1&&L[k]===x&&++n<6);L[k]=x;return x}
/* a guest's line: sometimes their own（GUESTS と 同じ じゅんばんの who） */
function gLine(g,k,own){const i=GUESTS.indexOf(g.G),w=(MU().who||[])[i];if(w&&w.length&&Math.random()<own){let x,n=0;do{x=pickL(w)}while(w.length>1&&g.said===x&&++n<6);g.said=x;return x}return ML2(k)}
function mut(T,who,line,ms,free){if(!line||!T.mu)return;if(who==='m'&&mioUp(T))return;   // 2階に いる ミオは しゃべらない
  const m=T.mu;if(m.until>Date.now()){if(!free&&m.q.length<2)m.q.push([who,line,ms]);return}
  m.who=who;m.line=line;m.until=Date.now()+(ms||Math.max(3200,1800+line[0].length*90));floatUp(T,who,line,m.until-Date.now())}
/* 11/22: ふきだしは 浜辺の ラジオのように 話した 人の 上から ゆっくり 浮かんで 消える（タップで 読む）
   見出し（← カードショップ）の 枠の 上まで 上がって 消える。 ふきだし どうしは 重ならない（あたらしいのが 下から 押し上げる） */
const BUB=[];let flbRaf=0;
/* 11/24 ふきだしは パネルの スクロールで 切れないように、 body の 上の 重ね（#shflTop, fixed）に 出して ステージに 合わせて 動かす。
   お店の 枠を 飛びこえて 画面の 上の ほうまで のぼれる */
function flbLayer(st){let L=document.getElementById('shflTop');if(!L){L=document.createElement('div');L.id='shflTop';L.className='shfls shflTop';document.body.appendChild(L)}
  if(st){const r=st.getBoundingClientRect();L.style.left=r.left+'px';L.style.top=r.top+'px';L.style.width=r.width+'px';L.style.height=r.height+'px'}return L}
function floatUp(T,who,line,ms){const anc=$('shfls');if(!anc)return;const sp=who==='m'?T.mio:who==='h'?T.hrSp:T.g;if(!sp)return;
  const st=anc.parentNode,box=flbLayer(st),sx=st.clientWidth/W,sy=st.clientHeight/HH,e=document.createElement('div');
  e.className='shmut fl '+(who==='m'?'mio':'gst');e.innerHTML=`<b class="en">${esc(line[0])}</b><small class="ja">${esc(line[1]||'')}</small>`;
  box.appendChild(e);const bw=e.offsetWidth,bh=e.offsetHeight,cx=(sp.x+7)*sx,left=Math.max(4,Math.min(st.clientWidth-bw-4,cx-bw/2));
  const y0=Math.round((sp.y-(window.MIOPX&&who!=='h'?18:2))*sy)-bh;   // ミオと お客さんは 背が 高い（48）   // ふきだしの 上の はし（ステージの 中の 位置）
  e.style.left=left+'px';e.style.top=y0+'px';
  e.onclick=ev=>{ev.stopPropagation();who==='h'?H.say('hs',line[0]):(who==='m'?speak:gspeak)(line[0])};
  /* 上の はしまでの きょりを ms+5秒で のぼる */
  const lim=flbLim(st),dur=ms+5000;BUB.push({e,x:left,w:bw,h:bh,y0,y:y0,dur,t0:performance.now(),v:Math.max(.006,(y0-lim)/dur)});
  while(BUB.length>6){BUB.shift().e.remove()}
  if(!flbRaf)flbRaf=requestAnimationFrame(flbTick)}
/* 見出しの 枠の 上（パネルの 上の はし）が ステージから 見て どこか */
/* 11/24: 枠の 上で 消さず、 画面の 上の はし（ステータスバーの すぐ下）まで のぼる */
function flbLim(st){const r=st.getBoundingClientRect();return 4-r.top}
function flbTick(now){flbRaf=0;const anc=$('shfls');if(!anc){BUB.length=0;const L=document.getElementById('shflTop');if(L)L.innerHTML='';return}
  for(let i=BUB.length-1;i>=0;i--)if(!BUB[i].e.isConnected)BUB.splice(i,1);
  const st=anc.parentNode;flbLayer(st);const lim=flbLim(st),RM=matchMedia('(prefers-reduced-motion:reduce)').matches;
  /* あたらしい ものから 順に。 横が かさなる 新しい ふきだしの 上に 6px あけて のる */
  for(let i=BUB.length-1;i>=0;i--){const b=BUB[i];let y=RM?b.y0:b.y0-(now-b.t0)*b.v;
    for(let j=i+1;j<BUB.length;j++){const n=BUB[j];if(b.x<n.x+n.w&&n.x<b.x+b.w)y=Math.min(y,n.y-6-b.h)}
    b.y=Math.min(b.y,y);   // 下には もどらない
    const age=now-b.t0,inA=Math.min(1,age/400),span=b.y0-lim,left=b.y-lim,outA=span>0?Math.min(1,left/(span*.3)):1;
    b.e.style.top=Math.round(b.y)+'px';b.e.style.opacity=Math.max(0,Math.min(inA,outA)).toFixed(2);
    if(b.y<=lim||(RM&&age>b.dur)){b.e.remove();BUB.splice(i,1)}}
  if(BUB.length)flbRaf=requestAnimationFrame(flbTick)}
/* every frame: follow the speaker, end the bubble, and let Mio mutter when the shop is quiet */
function mutTick(T,t){const m=T.mu,now=Date.now();if(!$('shfls'))return;
  if(m.who&&now>=m.until){m.who='';m.next=Math.max(m.next,now+1200);const n=m.q.shift();if(n){m.next=0;setTimeout(()=>{if(T.alive)mut(T,...n)},450)}}
  if(m.who)return;
  /* Mio, by herself: every 15〜25 s when no guest and no question is open */
  if(T.g||m.q.length||now<m.next||mioUp(T))return;   // 2階に いる 夜は しずかconst box=$('shact');if(box&&box.innerHTML&&!box.querySelector('.svx'))return;
  m.next=now+25000+Math.random()*20000;
  if(H.playing&&T.mio.pose!=='doze'&&Math.random()<.3){mut(T,'m',recLine('play'));return}
  if(window.MIOCT&&T.mio.pose!=='doze'&&Math.random()<.6){const rx=MIOCT.mutter();if(rx){mut(T,'m',rx);return}}
  if(window.SHDECO&&T.mio.pose!=='doze'&&(T.decoSay||Math.random()<.1)){T.decoSay=0;mut(T,'m',SHDECO.idle());return}
  if(T.mio.pose!=='doze'&&Math.random()<.12&&MU().caseIdle){mut(T,'m',ML2(caseN()?'caseIdle':'caseEmpty'));return}
  const S=SH(),r=Math.random(),mp=T.mio.pose;let k;
  if(mp==='doze')k='doze';else if(!S.floor.length&&r<.45)k='empty';else if(S.floor.length&&S.floor.length<3&&r<.3)k='few';else if(mp==='sweep'&&r<.5)k='sweep';else k=r<.55?t:'any';
  mut(T,'m',ML2(k))}

let CT=null;   // the counter's state while it is open
/* カウンターから 売り場へ: カウンターは 止めて おいて、 「カウンターへ」で つづきから（15分 まで） */
function pause(T){if(!T)return;const box=$('shact');T.alive=false;T.paused=Date.now();T.keep=null;
  /* ミオとの 会話が 返事を まっている ところなら その まま とっておく。 とちゅうなら おわりに */
  if(T.talk&&T.talk.alive&&box&&box.querySelector('button'))T.keep=box;else if(T.talk){T.talk.alive=false;T.talk=null}}
function toFloor(){pause(CT);floor()}
function counter(again){const old=again===true&&CT&&CT.paused&&Date.now()-CT.paused<15*6e4?CT:null;if(CT){CT.alive=false;if(!old&&CT.talk){CT.talk.alive=false;CT.talk=null}}const S=SH();cleanFloor();
  const hrO=window.HOURS?HOURS.isOpen('cg'):true,hrP=window.HOURS&&HOURS.isPrep('cg');
  H.show('cg',`<section class="pnl cgp shp shctr shmain">${top('🃏 カードショップ',`きょう 🪙${S.tday===C.today()?S.tearn:0}`,'cgx')}
    <div class="shstage"><canvas id="shcv" width="${W*4}" height="${HH*4}"></canvas><div class="shcase" id="shcase"></div><div class="shnotes" id="shnotes"></div><div class="shfls" id="shfls"></div></div>
    <div class="shnav">${navBtns()}</div>
    <p class="shst" id="shst">${hrO?'🔔 開店中。 レジは ミオに まかせて、 原石を みがこう':hrP?'🧹 開店 じゅんび中（9時 開店）。 原石の 作業は いつでも できるよ':'🌙 閉店中（9時〜21時）。 ミオは 2階に いるよ。 原石の 作業は いつでも できるよ'}</p>
    <div id="shact" class="shact"></div>
    <div id="orebox" class="orebox"></div></section>`);
  const cv=$('shcv'),c=cv.getContext('2d');c.imageSmoothingEnabled=false;
  const T=CT=old||{alive:true,f:0,g:null,next:Date.now()+5000+Math.random()*5000,mio:{x:150,y:44,pose:'stand',until:0,walk:null},visits:0,busy:false,mu:{who:'',until:0,q:[],next:Date.now()+2500,last:{}}};
  T.alive=true;T.paused=0;
  /* 🪴 もようがえ（ミオが 2〜4日ごとに かえる。 game/shop-deco.js） */
  const dc=!old&&window.SHDECO?SHDECO.pick(S):null;if(dc){save();if(dc.changed)setTimeout(()=>{if(!T.alive)return;T.mu.until=0;mut(T,'m',SHDECO.hello(),4600,1);T.mio.pose='wave';T.mio.until=Date.now()+2600;const e=$('shst');if(e)e.innerHTML=`🪴 ミオが お店を もようがえ！ きょうは 「${esc(SHDECO.name())}」`},1600);else if(Math.random()<.3)T.mu.next=Date.now()+1500,T.decoSay=1}
  $('cgx').onclick=()=>{T.alive=false;sf('back');H.home()};
  bindNav(T);
  const status=t=>{const e=$('shst');if(e)e.innerHTML=t};T.status=status;
  /* 💬 ミオを タップ（または ボタン）で 話しかける（game/mio-ctr.js） */
  T.mut=line=>mut(T,'m',line,3200,1);
  const tapMio=()=>{if(window.MIODOKI&&MIODOKI.shopRoll(T))return MIODOKI.shop(T,$('shact'));MIOCT.tap(T,$('shact'))};   // 💓 めったに ない ドキッと（game/mio-doki.js）
  cv.onclick=ev=>{const r=cv.getBoundingClientRect(),x=(ev.clientX-r.left)/r.width*W,y=(ev.clientY-r.top)/r.height*HH,m=T.mio;
    if(x>=PX[0]&&x<=PX[2]&&y>=PX[1]&&y<=PX[3])return recTap(T);
    if(x>=CPX[0]&&x<=CPX[2]&&y>=CPX[1]&&y<=CPX[3]){sf('step');pause(T);return caseScreen(()=>counter(true))}
    if(window.MIOCT&&!mioUp(T)&&x>m.x-8&&x<m.x+22&&y>m.y-20&&y<m.y+36){sf('tap');tapMio()}};
  cv.style.cursor='pointer'
  let last=0;
  const tick=now=>{if(!T.alive||!cv.isConnected){T.alive=false;return}requestAnimationFrame(tick);if(now-last<140)return;last=now;T.f++;step(T);c.setTransform(4,0,0,4,0,0);c.imageSmoothingEnabled=false;   // 2倍の こまかさ（ミオの ドット絵は game/mio-pix.js）
    const d=night(),t=d>.6?'night':d>.25?'dusk':'day';
    room(c,t,T.f);if(window.SHDECO)SHDECO.back(c,t,T.f);table(c,SH().floor.length,t);
    /* Mio: behind the counter, or out on the floor sweeping */
    const m=T.mio;if(m.walk){const dx=m.walk-m.x;if(Math.abs(dx)<1){m.x=m.walk;m.walk=null}else m.x+=Math.sign(dx)}
    const behind=m.y<60;
    const g=T.g;if(g&&g.y+32<=m.y+32){guest(c,g.x,g.y,g.L,g.pose,T.f>>1)}
    const mo={night:!!T.down};if(mioUp(T))desk(c);else if(behind){MIO.draw(c,m.x,m.y,m.walk?'walk':m.pose,T.f>>1,mo);desk(c)}else{desk(c);MIO.draw(c,m.x,m.y,m.walk?'walk':m.pose,T.f>>1,mo)}
    if(g&&g.y+32>m.y+32)guest(c,g.x,g.y,g.L,g.pose,T.f>>1);
    showcase(c,T.f);const on=!!H.shopSongId;player(c,on,T.f);if(window.SHDECO)SHDECO.front(c,t,T.f);
    if(g&&g.bub&&!(T.mu.who==='g'&&T.mu.until>Date.now()))bub(c,g.x+11,g.y-(window.MIOPX?25:9),g.bub);
    lights(c,t);if(t!=='day'&&!(g&&g.x<75&&g.x+14>72&&g.y<84&&g.y+32>81))PR(c,72,81,3,3,'#ffe2a0');if(window.SHDECO)SHDECO.lit(c,t,T.f);if(window.HORROR)HORROR.draw(c,T,t);if(t!=='day'){if(on)glow(c,182,93,12,t==='night'?.28:.18);PR(c,173,97,2,1,on?'#7aff9a':'#5a4a3a')}
    if(H.playing&&now>=(T.noteAt||0)){T.noteAt=now+500+Math.random()*400;note()}
    caseArt();mutTick(T,t)};
  requestAnimationFrame(tick);
  if(window.HORROR)HORROR.open(T,!!old);
  if(old)resume(T);
  /* 🪨 下の 作業台（game/ore.js）。 仕上がったら ミオが よろこぶ・売り場へ／倉庫へ */
  if(window.ORE)ORE.bench($('orebox'),{
    done:id=>{T.mio.pose='cheer';T.mio.until=Date.now()+3000;const I=C.info(id);status(`✨ 「${esc(I?cnm(I):'')}」の カードが できた！`);mut(T,'m',pickL(ORE_MIO_OK),4200,1)},
    toFloor:id=>{const s=SH();if(s.floor.length>=FLOOR_N)return 'full';s.floor.push(id);save();refreshNav(T);return 'ok'}});
  T.wasOpen=hrO;
  /* 👗 きょうの 服（日替わり。 game/mio-pix.js）: その日 はじめて 会った とき ひとこと */
  if(!old&&hrO&&window.MIOPX&&MIOPX.hello&&!mioUp(T))setTimeout(()=>{if(!T.alive||mioUp(T))return;const l=MIOPX.hello();if(l){mut(T,'m',l,4600);T.mio.pose='wave';T.mio.until=Date.now()+2400}},2600);
  if(!hrO&&!old&&window.HOURS&&!mioUp(T))setTimeout(()=>{if(T.alive)mut(T,'m',pickL(hrP?MIO_PREP:MIO_CLOSED),4800,1)},1400);
  else if(!S.floor.length)setTimeout(()=>status('🏷️ 売り場が からっぽ… 🏷️から カードを ならべよう'),1200)}
/* 店の 画面の 小さな ボタンの 列 */
/* 🏠 夜（21〜6時）の ミオは 2階の 自分の へや（game/mio-home.js） */
/* T.down: 深夜の 物音で ミオが 2階から おりてきて いる あいだ（game/horror.js） */
const mioUp=T=>{if(T&&T.down)return false;try{const s=MIOHOME.state();return s==='free'||s==='sleep'}catch(e){return false}};
const refreshNav=T=>{const nv=H.panel.querySelector('.shnav');if(nv&&T.alive){nv.innerHTML=navBtns();bindNav(T)}};
function navBtns(){const S=SH(),n=window.MIOC&&MIOC.newN&&MIOC.newN();
  return `<button data-n="floor"><span>🏷️</span>売り場<small>${S.floor.length}/${FLOOR_N}</small></button><button data-n="store"><span>📦</span>倉庫</button><button data-n="book"><span>📖</span>ブック</button><button data-n="mine"><span>⛏️</span>鉱山</button><button data-n="talk"><span>💬</span>ミオ${n?'<i class="dot"></i>':''}</button>${window.MIOHOME?'<button data-n="home"><span>🏠</span>2階</button>':''}<button data-n="gift"><span>🎁</span>あげる</button><button data-n="bgm"><span>🎵</span>BGM</button>${window.HORROR?HORROR.frontBtn():''}`}
function bindNav(T){const P=()=>pause(T);
  const A={floor:()=>{P();floor()},store:()=>{P();store()},book:()=>{P();CBOOK.open()},mine:()=>{T.alive=false;MINE.open()},talk:()=>{P();MIOC.open(open)},gift:()=>{P();GIFT.pick({to:'mio',back:open})},bgm:()=>{P();bgm()},home:()=>{P();MIOHOME.open(open)}};
  H.panel.querySelectorAll('[data-n]').forEach(b=>b.onclick=()=>{sf('step');A[b.dataset.n]()});
  if(window.HORROR){const hb=$('hrbk');if(hb){HORROR.frontBind(open);const g=hb.onclick;hb.onclick=()=>{P();g&&g()}}}}
const hrMina=k=>{try{if(window.MINA&&MINA.canAnnounce&&MINA.canAnnounce()&&Math.random()<.35){const [ex,tx]=ML(k);if(tx)setTimeout(()=>MINA.say('m',ex,tx,6000),2500)}}catch(e){}};
const MIO_OPEN=[["We're open! Welcome to Shiosai!","開店でーす！ しおさいへ ようこそ！"],["Open sign, on! Let's have a nice day, boss.","OPENの 札、 よし！ いい 1日に しましょう、 店長。"]];
const MIO_CLOSE=[["Closing time! Good work today, boss.","閉店の 時間！ きょうも おつかれさまでした、 店長。"],["I'll turn the sign to CLOSED. You can keep polishing, OK?","札を CLOSEDに しますね。 原石は そのまま みがいて いいですよ。"]];
const MIO_PREP=[["Good morning! We open at nine. Did you pick up stones on the beach?","おはようございます！ 9時に 開店です。 浜辺で 原石、 ひろってきました？"],["Getting ready… I'll wipe the counter. You can polish stones!","開店じゅんび… わたしは カウンターを ふきますね。 店長は 原石を どうぞ！"]];
const MIO_CLOSED=[["We're closed, but the workbench is always open for you.","閉店中だけど、 作業台は いつでも あいてますよ。"],["It's quiet after closing. Perfect for polishing stones.","閉店後は しずか。 原石みがきに ぴったりですね。"]];
const ORE_MIO_OK=[["A new card! Nice work, boss!","新しい カード！ おつかれさま、 店長！"],["Wow, shiny! I'll make room on the shelf.","わあ、 ぴかぴか！ 売り場、 あけておきますね。"],["You did it! That one looks great.","やったね！ その カード、 すてき。"]];
/* 売り場から もどったとき: さっきの つづき */
function resume(T){if(T.keep){const k=T.keep;T.keep=null;if(T.talk&&T.talk.alive)$('shact').replaceWith(k);else T.talk=null}
  const g=T.g;if(!g)return T.status('お店に もどったよ。 お客さんを まとう');
  if(g.out){if(g.st===9)watchOut(T,g);else out(T,300);return}
  if(g.caseWant&&g.st===2){T.status(`${esc(g.G.n)}が レジで まってるよ`);setTimeout(()=>{if(T.alive&&T.g===g)caseAsk(T)},400);return}
  if(g.st===2)mioSell(T)}
/* 11/22: レジは いつも ミオ（基本は ミオが レジ係）。 会話なしで すっと 売れて、 ふきだしが 浮かぶだけ */
function mioSell(T){const g=T.g,S=SH();g.st=2;g.hold=1;g.pose='stand';const id=g.want;T.mio.pose='wave';T.mio.until=Date.now()+2000;
  setTimeout(()=>{if(!T.alive||T.g!==g)return;const I=C.info(id),pp=id?price(id):0,nm=I?(window.SHSV?SHSV.word(I):cnm(I)):'';
    if(id&&sell(id,pp)){g.pose='happy';g.bub='♥';T.mio.pose='cheer';T.mio.until=Date.now()+2500;T.soldAt=Date.now();sf('coin');S.byMio=(S.byMio||0)+1;save();refreshNav(T);
      try{RECENT.add('sell',{id,en:nm,ja:window.SHSV?SHSV.jaOf(I):'',p:pp,by:'mio',kind:'quick',miss:0,tip:0,guest:g.G.n})}catch(e){}
      T.status(`🔔 お客さんが 「${esc(nm)}」を 買っていったよ（ミオが レジ） 🪙+${pp}`);
      mut(T,'m',ML2(night()>.6&&Math.random()<.6?'thanksNight':'thanks'));mut(T,'g',gLine(g,'g_happy',.3));out(T,1600)}
    else{g.bub='…';T.status(`${esc(g.G.n)}は 帰っていった`);out(T,600)}},2200)}
/* お客さんが カウンターに 来たら、 おわった ミオとの 会話（もっと 話す／とじる）は とじる */
function endTalk(T){const k=T.talk;if(!k)return;if(k.close)k.close();k.alive=false;T.talk=null}
/* Mio's little life between guests */
function mioIdle(T){const m=T.mio,now=Date.now();if(now<m.until||m.walk)return;if(T.talk&&!T.talk.done){m.pose='stand';m.until=now+2000;return}const d=night();
  const r=Math.random();
  if(d>.6&&r<.5){m.pose='doze';m.until=now+6000;return}
  if(r<.35){m.walk=pickL([142,152,164,172]);m.pose=pickL(['sweep','stand']);m.until=now+5000}
  else{m.pose=pickL(['stand','stand','sweep','wave']);m.until=now+3000+Math.random()*4000}}
/* the guest walks: door → shelf → table → (counter) → door
   台（x70〜128・y80〜101）の 上に 乗って 見えないように: 台では 向こう側（足 y78）に 立ち、
   レジへは 台と カウンターの すきま（x126）を 通って 足 y96 へ（その下は 花だんなどの かざり） */
const TO_CTR=[[126,46],[126,64]];
function step(T){const now=Date.now();mioIdle(T);
  if(!T.g&&window.HORROR&&HORROR.step(T,now))return;
  /* 🕘 開店・閉店（game/hours.js）: 閉まっている あいだは お客さんが 来ない */
  const op=window.HOURS?HOURS.isOpen('cg'):true;if(op!==T.wasOpen){T.wasOpen=op;if(op){T.next=Math.min(T.next,now+6000);T.status('🔔 開店！ レジは ミオに まかせて、 原石を みがこう');mut(T,'m',pickL(MIO_OPEN),4200,1);hrMina('hr_cgOpen')}else{T.status('🌙 閉店の 時間。 原石の 作業は いつでも できるよ');mut(T,'m',pickL(MIO_CLOSE),4200,1);hrMina('hr_cgClosed')}}
  if(!T.g&&!op){T.next=Math.max(T.next,now+5000);return}
  if(!T.g){const tk=T.talk&&!T.talk.done;if(tk)T.next=Math.max(T.next,now+8000);if(now>=T.next&&!T.busy&&!tk){const PG=window.MIOPX&&MIOPX.pickGuest?MIOPX.pickGuest():null,G=PG?PG.G:pickL(GUESTS),GL=PG?PG.L:GUEST_LOOK[G.l];   // 👗 見た目は 組み合わせ（game/look-mix.js）
      /* 4〜5人に 1人くらいは カードを 売りに 来る お客さん（続けては 来ない。 そのあとの お客さんは 早めに 来る） */
      const seller=false;   // 11/22: 仕入れ・買い取りは なし（カードは 原石から だけ）T.lastSeller=seller;
      const offer=seller?SHSV.offer(G):null;
      /* 🖼️ たまーに ケースの カードが ほしい お客さん（続けては 来ない） */
      const cw=null;   // 11/22: 作業の じゃまを しない（ケースを ほしがる お客は 来ない）T.lastCase=!!cw;
      T.g=cw?{G,L:GL,x:14,y:32,pose:'walk',path:[[14,46],[34,56],[34,56,'case',3400],[34,46],...TO_CTR],bub:'',st:0,wait:0,caseWant:cw}
        :offer?{G,L:GL,x:14,y:32,pose:'walk',path:[[14,46],[92,46],...TO_CTR],bub:'',st:0,wait:0,seller:1,offer}
        :{G,L:GL,x:14,y:32,pose:'walk',path:[[14,46],...(caseN()&&Math.random()<.45?[[34,56],[34,56,'case',2800],[34,46]]:[]),[56,46],[56,46,'look',2500],[92,46],[92,46,'think',2600]],bub:'',st:0,wait:0};
      T.status(offer?`🔔 ${esc(T.g.G.n)}が カードを もって 来た！`:`🔔 ${esc(T.g.G.n)}が 来た！`);sf('knock');setTimeout(()=>{if(T.g)T.g.bub=offer?'🎴':''},1500);T.g.bub='!';
      if(T.mio.y<60){T.mio.pose='wave';T.mio.until=now+2500}
      const nt=night()>.6;if(offer){if(Math.random()<.5)mut(T,'m',ML2('sellInMio'),2600);mut(T,'g',ML2('g_sellIn'))}
      else{if(Math.random()<.5)mut(T,'m',ML2(nt?'helloNight':'hello'),2600);mut(T,'g',gLine(T.g,nt?'g_enterNight':'g_enter',.3))}}return}
  const g=T.g;if(g.hold)return;
  if(g.wait){if(now<g.wait)return;g.wait=0;g.bub='';g.path.shift();if(!g.path.length)return decide(T)}
  const p=g.path[0];if(!p)return;
  const dx=p[0]-g.x,dy=p[1]-g.y;
  if(Math.abs(dx)<1.2&&Math.abs(dy)<1.2){g.x=p[0];g.y=p[1];
    if(p[2]==='case'&&g.caseWant){g.pose='happy';g.bub='♥';g.wait=now+p[3];const I=C.info(g.caseWant);mut(T,'g',fillW(pickL(CW_LINES.look),I),p[3],1);T.status(`👀 ${esc(g.G.n)}が ケースの 「${esc(I?cnm(I):'')}」を じっと 見てる…`);return}
    if(p[2]==='case'){g.pose='stand';g.bub='!';g.wait=now+p[3];mut(T,'g',ML2('g_case'),p[3],1);if(Math.random()<.7)mut(T,'m',ML2('caseMio'));return}
    if(p[2]){g.pose=p[2]==='look'?'stand':'think';g.bub=p[2]==='think'?'?':'';g.wait=now+p[3];
      if(Math.random()<.75)mut(T,'g',gLine(g,p[2]==='look'?'g_shelf':'g_table',.45),p[3]+600,1);return}
    g.path.shift();if(!g.path.length)return decide(T);return}
  g.pose='walk';if(Math.abs(dx)>=1)g.x+=Math.sign(dx)*1.5;if(Math.abs(dy)>=1)g.y+=Math.sign(dy)*1.5}
/* buy, or leave（やりとりの 形は game/shop-serve.js の SHSV.plan で ここで きめる） */
function decide(T){const g=T.g,S=SH();
  /* カードを 売りに 来た お客さんは まっすぐ レジへ */
  if(g.seller&&g.st<2){g.st=2;g.hold=1;g.pose='stand';T.status(`${esc(g.G.n)}が カードを 売りに 来たよ`);return atCounter(T)}
  if(g.caseWant&&g.st<2){g.st=2;g.hold=1;g.pose='stand';return caseAsk(T)}
  if(g.st===0){g.st=1;
    if(!S.floor.length){g.bub='…';T.status(`${esc(g.G.n)}は 帰っていった`);mut(T,'g',ML2('g_none'));mut(T,'m',ML2('sorry'));return out(T,1600)}
    g.plan={k:'quick'};
    /* the card they want: their favorite kind, if it's there */
    const fav=S.floor.filter(id=>{const I=C.info(id);return I&&g.G.a.includes(I.a)});
    const id=fav.length&&Math.random()<.7?pickL(fav):pickL(S.floor);
    if(Math.random()<(fav.includes(id)?.85:.6)){g.want=id;g.path=TO_CTR.slice();g.bub='♪';const I=C.info(id);
      T.status(`${esc(g.G.n)}が 「<b>${esc(SHSV?SHSV.word(I):I.en)}</b>」${SHSV&&SHSV.jaOf(I)&&g.plan.k!=='mean'?`（${esc(SHSV.jaOf(I))}）`:''}を もって レジへ`);mut(T,'g',ML2('g_buy'),2200)}
    else{g.bub='…';T.status(`${esc(g.G.n)}は 見ていくだけ みたい`);mut(T,'g',ML2('g_leave'));mut(T,'m',ML2('bye'));return out(T,1200)}
    return}
  if(g.st===1)mioSell(T)}
function out(T,ms){const g=T.g;g.hold=1;g.out=1;setTimeout(()=>{if(!T.alive||T.g!==g)return;g.hold=0;g.st=9;g.path=[...(g.y>50?[[126,46]]:[[g.x,46]]),[14,46],[14,32]];g.bub='';watchOut(T,g)},ms)}
function watchOut(T,g){
  const fin=()=>{if(T.g===g&&!g.path.length){T.g=null;T.next=Date.now()+90000+Math.random()*90000;T.status('🧑‍💼 ミオが レジで お客さんを まってるよ');SH().guests++;save()}};
  const iv=setInterval(()=>{if(!T.alive){clearInterval(iv);return}if(T.g!==g||!g.path.length){clearInterval(iv);fin()}},300)}
/* at the register: 自分で 対応 か ミオに まかせる（game/shop-serve.js） */
function atCounter(T,again){const g=T.g,S=SH(),box=$('shact');if(!box)return;endTalk(T);
  if(!again){T.visits++;S.talk=(S.talk||0)+1;save()}T.mu.q=[];T.mu.until=0;
  const minaSay=(k,pr)=>{try{if(window.MINA&&MINA.canAnnounce&&MINA.canAnnounce()&&Math.random()<pr){const [ex,tx]=ML(k);MINA.say('m',ex,tx,6000)}}catch(er){}};
  const finish=(id,sold,pp,R)=>{R=R||{};const nm=id?SHSV.word(C.info(id)):'';
    if(sold&&id&&sell(id,pp,true)){g.pose='happy';g.bub='♥';sf('coinIn');T.mio.pose='cheer';T.mio.until=Date.now()+2500;T.soldAt=Date.now();
      const r=cv0();try{if(r)H.coinBurst(r.x,r.y,pp,true);else H.addCoins(pp)}catch(e){H.addCoins(pp)}
      if(R.tip)setTimeout(()=>{H.addCoins(R.tip);sf('coin')},700);
      try{const I=C.info(id);RECENT.add('sell',{id,en:nm,ja:SHSV.jaOf(I),p:pp,by:R.mode||'me',kind:R.k||'',miss:R.miss||0,tip:R.tip||0,guest:g.G.n})}catch(e){}
      let hh='';if(R.mode==='me'&&R.talked&&!R.miss&&window.MIOC)hh=MIOC.gain(1,'ctr');
      T.status(`🪙 +${pp}${R.tip?` ＋チップ ${R.tip}`:''}　「${esc(nm)}」が 売れた！${R.mode==='mio'?'（ミオが 対応）':''}${hh?`<br><small>${hh}</small>`:''}`);
      if(R.mode==='mio'){S.byMio=(S.byMio||0)+1;mut(T,'m',pickL(SV_MIO.done),4200,1);minaSay('sh_mioDone',.25)}
      else{S.bySelf=(S.bySelf||0)+1;mut(T,'g',gLine(g,'g_happy',.2));mut(T,'m',ML2(night()>.6&&Math.random()<.6?'thanksNight':'thanks'));
        if(R.k==='mean')minaSay(R.miss?'sh_meanMiss':'sh_meanOk',.4);else if(R.k==='quiz')minaSay(R.miss?'sh_talkMiss':'sh_talkGood',.4);else if(R.talked)minaSay('sh_selfGood',.3)}
      save();if(R.close)R.close();else box.innerHTML='';out(T,1600)}
    else{if(sold)T.status('あれ？ その カードは もう ないみたい');else{g.bub='…';T.status(`${esc(g.G.n)}は 帰っていった`)}setTimeout(()=>{if(box.isConnected)box.innerHTML=''},1500);out(T,600)}};
  if(!window.SHSV){/* 予備: ボタンだけ */const id=g.want;if(!id)return finish(null,false,0);const p=price(id);
    box.innerHTML=`<div class="shask">${C.face(id,{mini:1,marks:false})}<div><p><b>${esc(g.G.n)}</b>「${esc(pickL(GUEST_SAY.buy))}」</p><div class="row"><button id="shsell">🪙 ${p} で 売る</button><button id="shno" class="sub">売らない</button></div></div></div>`;
    C.peekIn(box,{from:'guest'});$('shsell').onclick=()=>finish(id,true,p);$('shno').onclick=()=>finish(id,false,0);return}
  /* カードを 売りに 来た お客さん: 買い取ると コインを はらって カードが 倉庫へ */
  const bought=(id,ok,pp,R)=>{R=R||{};const I=C.info(id),nm=I?SHSV.word(I):'';
    if(ok&&I&&ST.coins>=pp){ST.coins-=pp;H.head();sf('buy');
      let isNew=!C.owns(id);if(id.startsWith('t:')){try{isNew=CARDS.give1(id.slice(2))}catch(e){}}else C.give(id);
      S.buyIn=(S.buyIn||0)+1;S.buySpent=(S.buySpent||0)+pp;
      if(premium(id)){if(S.want&&S.want.id===id)delete S.want;try{if(isNew&&CBOOK.canIn(id))BOOKR()[id]=1}catch(e){}S.prem=(S.prem||0)+1}
      save();
      g.pose='happy';g.bub='♥';T.mio.pose='cheer';T.mio.until=Date.now()+2500;
      try{RECENT.add('buyin',{id,en:nm,ja:SHSV.jaOf(I),p:pp,by:R.mode||'me',kind:R.k||'',miss:R.miss||0,isNew,guest:g.G.n})}catch(e){}
      let hh='';if(R.mode==='me'&&R.talked&&!R.miss&&window.MIOC)hh=MIOC.gain(1,'ctr');
      T.status(`🎴 「${esc(nm)}」を 🪙${pp}で 買い取った！${isNew?' <b>NEW!</b>':''}${R.mode==='mio'?'（ミオが 対応）':''}${hh?`<br><small>${hh}</small>`:''}`);
      if(R.mode==='mio'){S.byMio=(S.byMio||0)+1;mut(T,'m',pickL(SB_MIO.done),4200,1)}else mut(T,'m',ML2('thanks'));
      if(R.close)R.close();else box.innerHTML='';out(T,1600);
      setTimeout(()=>gotCard(id,isNew,R),R.mode==='mio'?900:500)}
    else{if(R.poor&&premium(id)){const w=S.want&&S.want.id===id?S.want:{id,p:pp,n:0};w.p=pp;w.n=(w.n||0)+1;S.want=w;save();setTimeout(()=>{try{const [ex,tx]=ML('sh_premSave',{w:SHSV.word(C.info(id)),p:pp,n:Math.max(0,pp-ST.coins)});if(tx)H.toast(`👩‍🏫 <b>ミナ先生</b><small>${esc(tx)}</small>`,5200)}catch(e){}},1800)}
      g.bub=R.poor?'👋':'…';T.status(R.poor?`${esc(g.G.n)}は 「また 来るね」と 帰っていった`:`${esc(g.G.n)}は カードを もって 帰っていった`);
      if(R.close)R.close();else setTimeout(()=>{if(box.isConnected)box.innerHTML=''},1500);out(T,900)}};
  if(g.seller)return SHSV.serve({T,g,box,id:g.offer,price,rare,buy:1,offer:SHSV.offer,floor:()=>SH().floor.slice(),bought,mio:speak,gs:gspeak});
  SHSV.serve({T,g,box,id:g.want,price,rare,floor:()=>SH().floor.slice(),finish,mio:speak,gs:gspeak})}
/* 🖼️ ケースの カードが ほしい お客さん: ゆずる（ふつうの 3ばい）か ことわる。 {w}=カードの 名前 {p}=値段 */
const CW_LINES={
  look:[["That {w} card… I love it!","あの 「{w}」の カード… すてき！"],["Wow, {w}! I've been looking for that!","わあ、 「{w}」！ ずっと さがしてたの！"]],
  ask:[["I know it's not for sale, but… could you sell me the {w} card? I'll pay {p} coins!","売りものじゃ ないのは わかってる。 でも… 「{w}」の カード、 ゆずって もらえない？ {p}コイン はらうよ！"],
    ["Please! I really want the {w} card in the glass case. How about {p} coins?","おねがい！ ガラスケースの 「{w}」が どうしても ほしいの。 {p}コインで どう？"],
    ["My little sister loves {w}. Would you sell it to me for {p} coins?","妹が 「{w}」が 大すきなんだ。 {p}コインで 売って くれない？"],
    ["I came back again for the {w} card. {p} coins… is that okay?","「{w}」の カードの ために また 来ちゃった。 {p}コイン… だめかな？"]],
  yes:[["Really?! Thank you! I'll take good care of it!","ほんとに！？ ありがとう！ 大切に するね！"],["Yay! This is the best day ever!","やったー！ さいこうの 一日だ！"]],
  no:[["I understand. It's your treasure. I'll come just to look!","わかった。 お店の お宝だもんね。 また 見に 来るね！"],["Okay… I'll find my own someday!","そっか… いつか 自分で 見つけるぞ！"]],
  mioYes:[["Bye-bye, {w}! Be happy in your new home!","バイバイ、 「{w}」！ 新しい おうちで しあわせにね！"],["Wow, {p} coins! Boss, you're a great seller!","{p}コイン！ 店長、 商売 じょうず！"]],
  mioNo:[["Sorry! That card is the face of our shop.","ごめんなさい！ あの カードは うちの お店の 顔なんです。"],["You can look at it anytime. Looking is free!","いつでも 見に 来てくださいね。 見るのは タダです！"]],
  gone:[["Huh? The {w} card isn't in the case anymore…","あれ？ 「{w}」、 もう ケースに ない…"]]};
const fillW=(x,I,p)=>x.map(t=>t.replace(/\{w\}/g,I?cnm(I):'').replace(/\{p\}/g,p||''));
const casePrice=id=>Math.max(60,price(id)*3);
function caseAsk(T){const g=T.g,S=SH(),box=$('shact'),id=g.caseWant,I=C.info(id);if(!box)return;endTalk(T);T.mu.q=[];T.mu.until=0;
  const minaSay=(k,pr)=>{try{if(window.MINA&&MINA.canAnnounce&&MINA.canAnnounce()&&Math.random()<pr){const [ex,tx]=ML(k,{w:cnm(I),ja:I.ja||''});MINA.say('m',ex,tx,6000)}}catch(er){}};
  const slot=CASER().indexOf(id);
  if(!I||slot<0||C.count(id)<1){mut(T,'g',fillW(pickL(CW_LINES.gone),I));g.bub='…';T.status(`${esc(g.G.n)}は 帰っていった`);return out(T,1400)}
  const pp=casePrice(id),ln=fillW(pickL(CW_LINES.ask),I,pp);
  box.innerHTML=`<div class="shask shcw">${C.face(id,{mini:1,marks:false})}<div><p class="en"><b>${esc(g.G.n)}</b>「${esc(ln[0])}」</p><p class="ja">${esc(ln[1])}</p>
    <div class="row"><button id="shcwy">🪙 ${pp} で ゆずる</button><button id="shcwn" class="sub">ことわる</button></div></div></div>`;
  T.status(`🖼️ ${esc(g.G.n)}が ケースの カードを ほしがってる！`);sf('knock');gspeak(ln[0]);
  box.querySelector('.en').onclick=()=>gspeak(ln[0]);C.peekIn(box,{from:'guest'});
  $('shcwy').onclick=()=>{const i=CASER().indexOf(id);if(i<0||C.count(id)<1){box.innerHTML='';return caseAsk(T)}
    CASER()[i]=null;C.take(id);S.sold++;S.earn+=pp;S.caseSold=(S.caseSold||0)+1;const d=C.today();if(S.tday!==d){S.tday=d;S.tearn=0}S.tearn+=pp;cleanFloor();save();
    g.pose='happy';g.bub='♥';sf('coinIn');T.mio.pose='cheer';T.mio.until=Date.now()+2500;
    const r=cv0();try{if(r)H.coinBurst(r.x,r.y,pp,true);else H.addCoins(pp)}catch(e){H.addCoins(pp)}
    try{RECENT.add('sell',{id,en:cnm(I),ja:I.ja||'',p:pp,by:'me',kind:'case',miss:0,tip:0,guest:g.G.n})}catch(e){}
    T.status(`🪙 +${pp}　ケースの 「${esc(cnm(I))}」を ゆずったよ`);box.innerHTML='';
    mut(T,'g',pickL(CW_LINES.yes));mut(T,'m',fillW(pickL(CW_LINES.mioYes),I,pp));minaSay('sh_caseSold',.4);out(T,1800)};
  $('shcwn').onclick=()=>{sf('step');g.bub='👋';box.innerHTML='';S.caseKeep=(S.caseKeep||0)+1;save();
    T.status(`${esc(g.G.n)}は 「また 見に 来るね」と 帰っていった`);
    mut(T,'m',pickL(CW_LINES.mioNo));mut(T,'g',pickL(CW_LINES.no));minaSay('sh_caseKeep',.3);out(T,1600)}}
/* 買い取った カード: 「カードを 見つけた！」と 同じ 見せかた（タップで 読む・📖 くわしく） */
function gotCard(id,isNew,R){const I=C.info(id);if(!I)return;
  const w=SHSV.word(I),ja=SHSV.jaOf(I);let ex='happy',tx='';
  try{const k=R.mode==='mio'&&Math.random()<.5?'sh_buyMio':premium(id)?'sh_buyInPrem':I.k==='p'?'sh_buyInPart':I.k==='s'?'sh_buyInSent':isNew?'sh_buyInNew':'sh_buyIn';[ex,tx]=ML(k,{w,ja})}catch(e){}
  if(isNew){try{SFX.fanfare(1)}catch(e){sf('done')}}else sf('card');
  const o=C.ov(`<div class="mnfind"><p class="mnfh">🎴 カードを 買い取った！</p>
    <div class="mnfc" id="shbic">${C.face(id,{big:1,ja:1})}</div>${isNew?'<p class="mnnew">NEW!</p>':''}${premium(id)?'<p class="mnnew">💎 めずらしい カード ・ 📖 ブックへ</p>':''}<p class="mntap">👆 カードを タップすると くわしく 見られるよ</p>
    ${tx?`<div class="kmina"><span class="lface">${MINA.face('m',ex)}</span><p>${tx}</p></div>`:''}
    ${C.moreClosed?`<div class="mnwi">${C.moreClosed(I)}</div>`:''}
    <button class="big" id="shbiok">OK</button></div>`,'by');
  if(C.bindMore)C.bindMore(o);
  setTimeout(()=>{try{C.sayCard(id)}catch(e){}},400);
  o.querySelector('#shbiok').onclick=()=>{sf('step');C.closeOv()}}
const cv0=()=>{const e=$('shcv');if(!e)return null;const r=e.getBoundingClientRect();return {x:r.left+r.width*.6,y:r.top+r.height*.6}};

/* ================================================================ Ms. Mina points the way */
const goBgm=()=>['🎵 お店の BGMへ',()=>{CG.open();setTimeout(()=>{if(SH().met&&!SH().away)bgm()},60)}];
const goShop=t=>()=>['🃏 カードショップへ',()=>{CG.open();if(t)setTimeout(()=>({counter,floor,store,mine:()=>MINE.open(),case:()=>caseScreen(open)})[t](),60)}];
if(window.MINA_SENSE&&MINA_SENSE._rules)MINA_SENSE._rules.push(
 ['x_shMine',4,()=>SH().met?{}:null,goShop('mine')],
 ['x_shDeep',2,()=>{const b=SH().best||0;return b>=5?{d:b}:null},goShop('mine')],
 ['x_shShelf',3,()=>SH().met&&!SH().floor.length?{}:null,goShop('floor')],
 ['x_shCounter',2,()=>SH().met?{}:null,goShop('counter')],
 ['x_shReport',2,()=>SH().sold?{n:SH().sold}:null,goShop()],
 ['x_shMio',1,()=>SH().met?{}:null,goShop()],
 ['x_shMutter',2,()=>SH().met&&MU().day?{}:null,goShop('counter')],
 ['x_shBgm',2,()=>songs().length&&!H.shopSongId?{}:null,goBgm],
 ['x_shBgmOn',1,()=>H.shopSongId?{song:songName(H.shopSongId)}:null,goBgm],
 ['x_shRec',2,()=>SH().met&&songs().length?{}:null,goShop('counter')],
 ['x_shServe',3,()=>SH().met&&window.SHSV?{}:null,goShop('counter')],
 ['x_shCase',3,()=>SH().met&&!caseN()&&allCards().some(id=>rank(id)>=9&&free(id)>0)?{}:null,goShop('case')],
 ['x_shEvent',4,()=>window.SHDECO&&SH().met&&SHDECO.eventNow()?{ev:SHDECO.events[SHDECO.eventNow()][0]}:null,goShop('counter')],
 ['x_shDeco',2,()=>SH().met&&SH().deco&&window.SHDECO?{deco:SHDECO.name()}:null,goShop('counter')],
 ['x_shCaseOn',2,()=>{const a=CASER().filter(Boolean);if(!a.length)return null;const I=C.info(pickL(a));return I?{w:cnm(I),ja:I.ja||''}:null},goShop('counter')],
 ['x_shWant',2,()=>{const w=wantRec();if(!w||!SH().met)return null;const n=w.p-ST.coins;return n>0?{w:SHSV.word(C.info(w.id)),p:w.p,n}:null},goShop('counter')],
 ['x_shWantOk',4,()=>{const w=wantRec();if(!w||!SH().met)return null;return ST.coins>=w.p?{w:SHSV.word(C.info(w.id)),p:w.p}:null},goShop('counter')],
 ['x_shBuy',3,()=>SH().met&&window.SHSV&&SHSV.offer?{}:null,goShop('counter')],
 /* スローな ローファイ（game/music-lofi.js） */
 ['x_lfBuy',2,()=>{const a=LF_NEW.filter(id=>TRACKS[id]&&!ST.music.includes(id));return a.length>=LF_NEW.length-2?{n:a.length}:null},()=>['🏚️ 雑貨屋の レコードへ',()=>{window.ZAKKA?ZAKKA.open('music'):H.home()}]],
 ['x_lfOwn',2,()=>{const a=LF_NEW.filter(id=>ST.music.includes(id));return a.length?{song:songName(pickL(a))}:null},goBgm],
 ['x_lfOn',3,()=>{const id=H.shopSongId;return LF_SAY[id]?{say:pickL(LF_SAY[id])}:null},null]);
/* 曲ごとに ミナ先生が ひとこと（お店で ながれて いるとき） */
const LF_NEW=['lofi_nap','lofi_cat','lofi_moon','lofi_rain','lofi_tape','lofi_train','lofi_lamp','lofi_snow','lofi_library','lofi_tide'];
const LF_SAY={
 lofi_nap:['「おひるねビーチ」、 波の 音が 入ってるの。 聞いてると まぶたが おもく なるね…ふぁ','ゆっくりな 曲は 頭を 休ませてくれるよ。 休んだ あとの 単語は よく 入るんだ'],
 lofi_cat:['「ねこと ひなたぼっこ」、 小鳥の 声が ときどき 聞こえるの、 気づいた？','cat の 「ひなたぼっこ」は 英語で sunbathe って いうんだよ。 sun（太陽）＋ bathe（あびる）'],
 lofi_moon:['「おやすみ お月さま」は 3拍子なんだ。 いち・に・さん…子守歌の リズムだね','英語の 子守歌は lullaby。 「ララバイ」って 聞いた ことあるかな？'],
 lofi_rain:['雨の 音って 集中できるよね。 「雨音と ホットココア」で 単語、 もう 1つ いこう','rain の ほかに drizzle（こぬか雨）、 downpour（どしゃぶり）も あるよ。 雨にも いろいろ'],
 lofi_tape:['「古い カセットテープ」は わざと 音を ゆらしてるの。 なつかしい 感じが するね','rewind は 「巻きもどす」。 授業の ふくしゅうも rewind だね'],
 lofi_train:['ガタン ゴトン… 「夜行列車の 窓」、 どこかへ 旅してる 気分に なるね','英語では 汽車の 音を clickety-clack って いうんだよ。 おもしろいでしょ'],
 lofi_lamp:['「灯台の あかり」の 霧笛、 聞こえた？ 英語で foghorn って いうの','lighthouse は light（光）＋ house（家）。 光の 家って すてきな ことばだね'],
 lofi_snow:['「しずかな 雪の 夜」、 風の 音まで 入ってるの。 あったかく して 聞いてね','雪の 結晶は snowflake。 flake は 「うすい かけら」って いみだよ'],
 lofi_library:['「図書館の 窓ぎわ」は ページを めくる 音が 入ってるんだ。 わたしも 本を 読みたく なっちゃう','library は ラテン語の liber（本）から。 本が たくさん ある 場所、 だね'],
 lofi_tide:['「満ち潮の ゆりかご」は いちばん ゆっくりな 曲。 深呼吸して、 ゆっくり いこう','満ち潮は high tide、 引き潮は low tide。 月が 海を 引っぱってるんだよ']};
/* 🎵 お店の BGM の ミナ先生の セリフ */
Object.assign(MINA_LINES,{
 sh_awayClosed:[['smile','閉店中に 鉱山へ 行ってたから、 お店も おやすみ だったね。 お客さんは 9時から 21時のあいだに 来るよ'],['think','"We were closed." … 閉まっていたら 売り上げは ゼロ。 開店中に 鉱山へ 行くと ミオさんが 売ってくれるよ'],['happy','夜の あいだ ミオさんは 2階で ゆっくり できたね。 "Take it easy." だね']],
 sh_awayPart:[['smile','るすの とちゅうで 閉店の 時間に なったね。 開いていた あいだの 分だけ ミオさんが 売ってくれたよ'],['point','"while the shop was open" … 「お店が 開いていた あいだ」。 閉店中の 時間は お客さんは 来ないよ']],
 sh_caseNew:[['wow','お知らせ！ カードショップの 店内に ガラスの かざりだなが できたよ。 カウンターの 左下の ケースを タップして、 とっておきの カードを 3まい かざってね'],['happy','カードショップに かざりだなが 来たよ。 レアな カードを かざると、 お客さんが 立ちどまって 見てくれるんだって']],
 x_shCase:[['smile','レアな カード、 もってるよね。 カードショップの かざりだなに かざってみない？ お客さんが よろこぶよ'],['happy','「かざる」は 英語で display。 お店の ガラスケースは display case って いうんだよ。 3まい かざれるよ']],
 x_shCaseOn:[['happy','かざりだなの 「{w}」、 お客さんが 見とれてたって。 ミオさんが 言ってたよ'],['smile','「{w}」は 「{ja}」。 かざって おくと、 見るたびに おぼえられるね'],['wow','お店の ケースの 「{w}」、 キラッて 光ってたよ。 店長さん、 いい センスだね']],
 sh_decoNew:[['wow','お知らせ！ カードショップの 店内を ミオさんが もようがえ するように なったよ。 カフェ風・ギャラリー・海の家・季節の かざり…2〜4日ごとに かわるんだって'],['happy','ミオさんが ときどき お店を もようがえ するんだって。 英語で もようがえは redecorate。 re（もう一度）＋ decorate（かざる）だよ']],
 x_shEvent:[['happy','カードショップが {ev}の かざりに なってるよ。 ミオさん、 はりきってたって'],['wow','いまの 時期は お店も {ev}！ 行事の かざりは その 期間だけだから、 見に 行ってね'],['smile','{ev}の かざり、 夜に 見ると 灯りが きれいだよ。 ミオさんに 英語で 聞いてみよう']],
 x_shDeco:[['smile','いまの カードショップは 「{deco}」。 ミオさん、 センス いいよね'],['happy','カードショップの もよう、 いまは 「{deco}」なんだって。 英語で かざりは decoration。 見に 行こう'],['wow','お店の 「{deco}」、 夜に 行くと 灯りが きれいなんだよ']],
 sh_caseSold:[['wow','ケースの 「{w}」、 お客さんに ゆずったんだね。 その お客さん、 きっと 大切に してくれるよ'],['smile','「ゆずる」は 英語で let someone have it。 Sure, you can have it! って 言えたら かっこいいね']],
 sh_caseKeep:[['happy','「{w}」は ゆずらなかったんだね。 お店の 宝物だもん。 No, sorry. It’s not for sale. で ことわれるよ'],['smile','ことわるのも 大事。 not for sale（売りものじゃない）って おぼえておこうね']],
 sh_casePut:[['happy','「{w}」を かざったんだね。 英語で show off は 「見せびらかす」。 ちょっとだけ 自まんしちゃおう'],['smile','「{w}」＝「{ja}」。 かざった カードは 毎日 目に 入るから、 自然に おぼえちゃうよ']],
 x_shBgm:[['smile','レコード、 もってるよね。 カードショップの 🎵 BGMで えらぶと、 お店の 中で ながれるよ'],['happy','お店で 曲を ながすと、 ミオさんも ごきげんに なるんだって']],
 x_shBgmOn:[['happy','カードショップで 「{song}」を ながしてるんだね。 店長さんの センス、 いいね'],['smile','「{song}」は お店に 入ると ながれるよ。 浜辺では 波の 音を 聞こうね']],
 x_shRec:[['smile','カードショップの カウンターの 前に レコードプレイヤーが あるよ。 タップすると 曲が かかって、 音符が ふわふわ 出てくるんだ'],['happy','ミオさん、 レコードプレイヤーで 曲を かけると ごきげんに なるんだって。 カウンターで ためしてみてね']],
 sh_recOn:[['happy','あ、 お店から 「{song}」が 聞こえる。 いい曲だね'],['smile','レコードの 音って あったかいよね。 お仕事 がんばってね、 店長さん']],
 sh_recNew:[['wow','お知らせ！ カードショップの カウンターの 前に レコードプレイヤーを おいたよ。 タップで 音楽の オン・オフが できて、 曲が ながれると 音符が ふわふわ 出てくるよ'],['smile','カウンターに レコードプレイヤーが 来たよ。 タップすると 曲が かかるんだ。 ミオさんも よろこんでたよ']],
 x_lfBuy:[['smile','ノラさんの 雑貨屋に スローな ローファイの レコードが 入ったよ。 まだ {n}まい 残ってるみたい'],['happy','勉強の BGMには ゆっくりな ローファイが おすすめ。 雑貨屋の レコードの たなを 見てみてね']],
 x_lfOwn:[['smile','「{song}」、 もってるよね。 お店の 🎵 BGMで かけると、 ゆったり 勉強できるよ'],['happy','ゆっくりな 曲を 聞くと、 気持ちが おちついて 集中しやすく なるんだって。 「{song}」 どうかな']],
 x_lfOn:[['smile','{say}']],
 sh_lofiNew:[['wow','お知らせ！ ノラさんの 雑貨屋に スローな ローファイの レコードが 10まい 入ったよ。 雨・波・雪・汽車の 音が 入った、 ゆっくりな 曲ばかり。 たなは 毎日 かわるから のぞいてみてね'],['happy','新しい レコードの お知らせ！ ゆっくりな ローファイが 10まい ふえたよ。 小・中・高の どの マークも あるから、 雑貨屋で 英語で 買ってみてね']],
 sh_bgmNew:[['wow','お知らせ！ レコードは カードショップの 中だけで ながれるように なったよ。 お店の 🎵 BGMで 曲を えらんでね'],['smile','曲は カードショップの 中だけで ながれるように なったんだ。 浜辺に 出ると 止まって、 お店に もどると また ながれるよ']]});
/* the shop changed: Mina tells you once */
setTimeout(function first(){const S=SH();if(S.told)return;const m=window.MINA;if(!m||!m.canAnnounce||!m.canAnnounce())return setTimeout(first,15000);
  S.told=1;save();const [ex,tx]=ML('sh_first');m.say('m',ex,tx,10000,null,['🃏 お店へ',()=>CG.open()])},12000);

/* records play only in the shop now: Mina tells you once（レコードを もっている 人だけ） */
setTimeout(function first4(){const S=SH();if(S.bgmTold||!songs().length)return;const m=window.MINA;if(!m||!m.canAnnounce||!m.canAnnounce())return setTimeout(first4,20000);
  S.bgmTold=1;save();const [ex,tx]=ML('sh_bgmNew');m.say('m',ex,tx,10000,null,goBgm())},26000);

/* the record player is new: Mina tells you once（もう お店を 知っている 人だけ） */
setTimeout(function first5(){const S=SH();if(S.recTold||!S.met)return;const m=window.MINA;if(!m||!m.canAnnounce||!m.canAnnounce())return setTimeout(first5,20000);
  S.recTold=1;save();const [ex,tx]=ML('sh_recNew');m.say('m',ex,tx,10000,null,goShop('counter')())},40000);

/* slow lo-fi records are new（2026-11-15）: Mina tells you once */
setTimeout(function first6(){const S=SH();if(S.lofiTold||!(S.met||ST.music.length))return;const m=window.MINA;if(!m||!m.canAnnounce||!m.canAnnounce())return setTimeout(first6,20000);
  S.lofiTold=1;save();const [ex,tx]=ML('sh_lofiNew');m.say('m',ex,tx,11000,null,['🏚️ 雑貨屋の レコードへ',()=>{window.ZAKKA?ZAKKA.open('music'):H.home()}])},52000);

/* the bubbles are new: Mina tells you once（もう お店を 知っている 人だけ） */
setTimeout(function first3(){const S=SH();if(S.mutTold||!S.met||!MU().day)return;const m=window.MINA;if(!m||!m.canAnnounce||!m.canAnnounce())return setTimeout(first3,20000);
  S.mutTold=1;save();const [ex,tx]=ML('sh_mutNew');m.say('m',ex,tx,10000,null,goShop('counter')())},34000);

/* the counter talk is new: Mina tells you once */
setTimeout(function first5(){const S=SH();if(S.svTold||!S.met||!window.SHSV)return;const m=window.MINA;if(!m||!m.canAnnounce||!m.canAnnounce())return setTimeout(first5,20000);
  S.svTold=1;save();const [ex,tx]=ML('sh_serveNew');m.say('m',ex,tx,10000,null,goShop('counter')())},26000);

/* カードを 売りに 来る お客さんが 来るように なった: Mina tells you once */
setTimeout(function first6(){const S=SH();if(S.buyTold||!S.met||!window.SHSV||!SHSV.offer)return;const m=window.MINA;if(!m||!m.canAnnounce||!m.canAnnounce())return setTimeout(first6,20000);
  S.buyTold=1;save();const [ex,tx]=ML('sh_buyNew');m.say('m',ex,tx,10000,null,goShop('counter')())},30000);

/* 🖼️ かざりだなが できた（2026-11-16）: Mina tells you once（もう お店を 知っている 人だけ） */
setTimeout(function first8(){const S=SH();if(S.decoTold||!S.met||!window.SHDECO)return;const m=window.MINA;if(!m||!m.canAnnounce||!m.canAnnounce())return setTimeout(first8,20000);
  S.decoTold=1;save();const [ex,tx]=ML('sh_decoNew');m.say('m',ex,tx,10000,null,goShop('counter')())},50000);
setTimeout(function first7(){const S=SH();if(S.caseTold||!S.met)return;const m=window.MINA;if(!m||!m.canAnnounce||!m.canAnnounce())return setTimeout(first7,20000);
  S.caseTold=1;save();const [ex,tx]=ML('sh_caseNew');m.say('m',ex,tx,10000,null,goShop('case')())},44000);

/* 👗 ミオの 服が 組み合わせに・お客さんが ふえた（2026-11-27）: Mina tells you once */
setTimeout(function first9(){const S=SH();if(S.lookTold||!S.met||!window.MIOPX||!MIOPX.pickGuest)return;const m=window.MINA;if(!m||!m.canAnnounce||!m.canAnnounce())return setTimeout(first9,20000);
  S.lookTold=1;save();const [ex,tx]=ML('sh_lookNew');m.say('m',ex,tx,10000,null,goShop('counter')())},58000);

H.on('home',()=>{if(CT){CT.alive=false;CT.paused=0}});
window.SHOP={mioUp:T=>mioUp(T),premium,premList,wantRec,mut:(T,who,line,ms,free)=>mut(T,who,line,ms,free),ct:()=>CT,open,leave,price,allCards,counter,floor,toFloor,pause:()=>pause(CT),store,rec:SH,inBook,free,stock,storeCards,bookRec:BOOKR,cleanFloor,rare,inCase,caseRec:CASER,caseScreen};
})();
