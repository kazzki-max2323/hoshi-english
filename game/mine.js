/* ⛏️ 単語の 鉱山（11/18 作りなおし）: 岩の 中に ねむる まだ 持っていない カード 5まいを ほりだして、 一階ずつ 下りていく
   - 5まいは ランダム。 小学生（まだ ない カードが ある いちばん 下の レベル）から はじめて、 1〜2まいは 一つ上。 深い 階ほど 上の レベルが まざる（pickFloor）
   - 1まいずつ 左から じゅんばんに 問題。 正解で 岩が けずれて、 何回か 正解すると ほりだせて 自分の ものに なる
     いる 回数は おぼえぐあいで かわる（よく おぼえている 3回・はじめて 5回・苦手 6回・まちがえると +1）。 画面には 出さない（needOf）
     はじめての ことばは さいしょに 1回 見せて 読む（intro）。 問題の 形は その カードを ほった 回数で すすむ（和訳 → 英語で → 🧩ならべかえ → 聞きとり …。 ならべかえは 3問目）
   - 5まい ほりだしたら: 📜 5つの ことばの 小さな お話（game/mine-story.js。 読めたら ボーナス）→ 床が くずれて 一つ 下の 階 → 🏕️ 休憩所（game/mine-rest.js）
     休憩所で 食べる・単語ラジオ・❤回復・📡 トランシーバーで ミオと 話す（game/mine-walkie.js）・ほった 5まいを ながめる。 そこから つぎの 5まい か 帰る
   - ほりだした カードは そのまま 📖カードブックへ（toBook。 11/18: ブックに 入れずに 売ると「持っていない」に もどって また 鉱山に 出るのを ふせぐ。
     ブックの カードは 鉱山に 出ない・📦仕入れの 問題で お店に 入荷する = game/stock.js）
   - 帰ると ミオが ほった ことばを 見て ひとこと（MINE_MIO_SEE）
   - 体力（❤）は 1問で 1 へる。 0に なっても 見つけた 物は ぜんぶ 持ち帰れる（失敗なし）。 体力は game/food.js（鉱山の 外でも のこる・時間で もどる）
   - カードは 岩の 5まいを ほって ゲットする だけ（11/18 ユーザー。 とちゅうで 見つかる・宝箱から 出る しくみは なし）。 特別な 🎁宝カードは お話を 読めた ごほうびで たまに
   - ほかに 見つかる 物: 宝石（コイン）・イベント・📦宝箱（コイン・食べ物・道具）・悪い できごと（取られない）・🌙深夜の ふしぎ（game/horror.js）
   - 🎒 つかう: ほっている とちゅうに もちものの 食べ物（❤回復）と 鉱山の 道具（雑貨屋の ⛏️ たなで 買う）
   記録: MN().bestF（いちばん 深い 階）・floors（ほりきった 階の 数）・best（m。 前の 版から）
   データは game/shop-data.js（MINE_LAYERS / MINE_EVENT / MINE_GEM）と game/mine-items.js（MINE_TOOLS / MINE_BAD / MINE_MIO・セリフ） */
(()=>{
const {S:ST,sfx:SFX}=BEACH;
const H=HE,esc=H.esc,$=id=>document.getElementById(id);
const C=CG,R=()=>C.rec(),pickL=a=>a[Math.random()*a.length|0];
const sf=k=>{try{SFX[k]&&SFX[k]()}catch(e){}};
const ML=(k,v)=>{try{return MINA.line(k,v||{})}catch(e){return ['smile','']}};
const MN=()=>{const r=R();const m=r.mn||(r.mn={dives:0,best:0,q:0,ok:0,cards:0});delete m.u;return m};
const ME_HP=80,HAND=5;
/* 体力は game/food.js（鉱山の 外でも のこる・時間で もどる）。 ない ときは 毎回 まんたん */
const myHp=()=>window.FOOD?FOOD.hp():ME_HP;
const keepHp=n=>{try{if(window.FOOD)FOOD.setHp(n)}catch(e){}};
/* 見つかる 確率（正解 1回ごと） */
const P_EVENT=.04,P_GEM=.2,P_CHEST=.016;
/* 悪い できごと: 8m から。 深いほど 少し ふえる（最大 約3%） */
const pBad=d=>d<8?0:Math.min(.03,.008+d*.0003);

/* ================================================================ 🎒 鉱山の 道具（雑貨屋で 買う。 MINE_TOOLS は game/mine-items.js） */
const TL=()=>{const M=MN();return M.tools||(M.tools={})};
const toolN=id=>TL()[id]||0;
const toolList=()=>Object.keys(MINE_TOOLS).filter(id=>toolN(id)>0).map(id=>Object.assign({id},MINE_TOOLS[id]));
function addTool(id,n=1){if(!MINE_TOOLS[id])return;TL()[id]=toolN(id)+n;C.save()}
function takeTool(id){if(!toolN(id))return false;TL()[id]--;if(TL()[id]<=0)delete TL()[id];C.save();return true}
/* rows for the 🎒 もちもの screen (game/zakka.js bag()) */
function bagRows(row){const L=toolList();if(!L.length)return [];
  return L.map(t=>row(t.ico,`${esc(t.n)} <small>×${toolN(t.id)}</small>`,`${t.hr?'🌙':'⛏️ 鉱山で つかう・'}${esc(t.s)}`,'<button data-mine="1">⛏️ 鉱山へ</button>'))}
const goMine=()=>{try{CG.open();setTimeout(open,60)}catch(e){}};   // 11/15 に 3倍 → 11/16 に 下げて 元の 約1.7倍（平均 2.9→8.5→約5まい/回）。 宝カードは 鉱山だけなので 少し 多め

/* ================================================================ 練習の 形（カードごとに ほった 回数で すすむ） */
const QN={mean:'いみは？',rev:'英語で いうと？',listen:'聞こえた ことばは？',spell:'正しい つづりは？',scramble:'つづりを ならべて',miss:'ぬけた 文字は？',fill:'あなうめ',type:'つづりを 書こう',dict:'聞こえた 単語を 書こう'};
const QICO={mean:'🇯🇵 和訳',rev:'🔤 英語で',listen:'👂 聞きとり',spell:'🔍 つづり',scramble:'🧩 ならべかえ',miss:'🕳️ ぬけた 文字',fill:'📝 あなうめ',type:'✍️ 書く',dict:'🎧 聞いて 書く'};
/* 書く 問題（打ちこむ 形）は 出さない ことも できる（スマホで 打つのが 大変な とき。 MN().noType に 覚える） */
const TYPING=['type','dict'];
const noType=()=>!!MN().noType;
/* 11/18 ユーザー「並べかえが かなり 覚える。 3番目くらいに ほしい」: 3問目は かならず 🧩 ならべかえ。 そのあとも ときどき 出る */
const SEQ=['mean','rev','scramble','listen','miss','scramble','fill','spell','type','scramble','dict','rev','fill'];
const seq=()=>SEQ.filter(t=>(ST.sound||!['listen','dict'].includes(t))&&!(noType()&&TYPING.includes(t)));
const course=()=>seq().map(t=>({t,n:QICO[t]}));

/* ================================================================ 5まいを えらぶ: まだ 持っていない カードから。
   小学生（まだ ない カードが ある いちばん 下の レベル）から はじめて、 1〜2まいは 一つ上。 深い 層ほど 上の レベルが まざる */
const LVK=['es','jh','hs','adv'];
/* 📖 カードブックに 入っている カードは 鉱山で 出さない（11/18） */
const inBook=id=>{try{return !!SHOP.inBook(id)}catch(e){return false}};
const trNot=c=>inBook('t:'+c.e);
/* ほりだした 1まいを 📖カードブックへ（まだ 入っていなくて 入れられる とき）。 入れたら true */
function toBook(id){try{if(!inBook(id)&&window.CBOOK&&CBOOK.canIn(id)){SHOP.bookRec()[id]=1;C.save();return true}}catch(e){}return false}
const learned=id=>{try{return !!(ST.learned&&ST.learned[id])}catch(e){return false}};
const baseLv=()=>{for(let i=0;i<LVK.length;i++)if(C.W.some(c=>c.lv===LVK[i]&&!C.owns(c.id)))return i;return 0};
function lvMix(fl){const b=baseLv(),up=fl<=2?1+(Math.random()<.4?1:0):fl<=5?2:fl<=9?2+(Math.random()<.5?1:0):3,
    two=fl>=12?2:fl>=6?1:0,out=[];
  for(let i=0;i<HAND;i++){const k=i<HAND-up?0:i<HAND-two?1:2;out.push(Math.min(LVK.length-1,b+k))}return out}
function pickFloor(fl,not=[]){const out=[],used=new Set(not);
  lvMix(fl).forEach(li=>{let id=null;
    for(const d of [0,1,-1,2,-2,3,-3]){const j=li+d;if(j<0||j>=LVK.length)continue;
      const pool=C.W.filter(c=>c.lv===LVK[j]&&!C.owns(c.id)&&!used.has(c.id)&&!used.has('h:'+c.h));if(pool.length){id=pickL(pool).id;break}}
    if(!id){const pool=C.W.filter(c=>c.lv===LVK[li]&&!inBook(c.id)&&!used.has(c.id)&&!used.has('h:'+c.h));if(pool.length){pool.sort((a,b)=>(C.weak(b.id)?1:0)-(C.weak(a.id)?1:0)||C.star(a.id)-C.star(b.id)+Math.random()-.5);id=pool[0].id}}
    if(id){used.add(id);used.add('h:'+C.info(id).h);out.push(id)}});
  return out}
/* 発掘に いる 回数（画面には 出さない）: よく おぼえている ことばは 3回、 はじめては 5回、 苦手は 6回。 まちがえると 1回 ふえる
   11/18 ユーザー「単語クイズは もっと 多く やりたい」で 1回ずつ ふやした（前は 2/3/4/5） */
const fresh=id=>{const s=C.star(id);return s<=1&&!learned(id)&&!(R().x&&R().x[id])};
function needOf(id){if(C.weak(id))return 6;const s=C.star(id);if(learned(id)||s>=4)return 3;if(s>=2)return 4;return fresh(id)?5:4}

function open(){const M=MN();
  const TLs=toolList();let mk=myHp()<20&&window.FOOD?'fd_tired':!M.v2?'mn_v2':!M.digOnly?'mn_digOnly':!M.moreQ?'mn_moreQ':'mn_open';if(mk==='mn_digOnly'){M.digOnly=1;C.save()}if(mk==='mn_moreQ'){M.moreQ=1;C.save()}
  if(mk==='mn_open'&&Math.random()<.35)mk=TLs.length?'mn_tools':'mn_noTools';
  const [ex,tx]=ML(mk,{f:M.bestF||0});
  const lv=LVK[baseLv()],nx=LVK[Math.min(3,baseLv()+1)];
  H.show('cg',`<section class="pnl cgp shp mnp">
    <div class="qtop"><button class="x" id="mnb" aria-label="もどる">←</button><b>⛏️ 単語の 鉱山</b><span class="qn">${M.bestF?`最高 地下${M.bestF}階`:''}</span></div>
    <div class="kmina"><span class="lface">${MINA.face('m',ex)}</span><p>${tx}</p></div>
    ${window.FOOD?FOOD.mineBox():''}
    <div class="mnhand mnrocks">${'<div class="mnt"><span class="mnrock">🪨<b>？</b></span></div>'.repeat(HAND)}</div>
    <p class="mnlbl">岩の 中に まだ 持っていない カードが 5まい ねむっているよ</p>
    <button id="mngo" class="mngo" ${myHp()>0?'':'disabled'}><span class="mngoi">⛏️</span><span class="mngot2">地下1階から ほる</span>${myHp()<ME_HP?`<small>❤${myHp()}</small>`:''}</button>
    ${TLs.length?`<p class="mntl">🎒 ${TLs.map(t=>`${t.ico}<b>×${toolN(t.id)}</b>`).join(' ')} <small>ほっている とちゅうに つかえる</small></p>`:''}
    <details class="shmore"><summary>鉱山の しくみ</summary>
      <ol class="mncs"><li>⛏️ 問題に 正解すると 岩が けずれて、 カードが 1まいずつ 自分の ものに なる</li><li>🪜 5まい ほりだすと 床が くずれて 一つ 下の 階へ。 下の 階ほど 上の レベルの ことばが まざる</li><li>📜 5まいの ことばの 小さな お話を 読むと ボーナス</li><li>🏠 いつ 帰っても 見つけた 物は ぜんぶ 持ち帰れる</li></ol>
      <p class="note">いまは ${CG_LV[lv]?CG_LV[lv].n:''}の ことばが 中心${nx!==lv&&CG_LV[nx]?`、 ${CG_LV[nx].n}も 少し`:''}。 ❤は 最大 ${ME_HP}（1問で 1 へる・2分で 1 もどる・食べると たくさん もどる）</p></details>
    <button id="mnty" class="sub mnty">✍️ 書く 問題: <b>${noType()?'出さない':'出す'}</b></button>
  </section>`);
  $('mnb').onclick=()=>{sf('back');SHOP.open()};
  $('mnty').onclick=()=>{sf('tap');const M=MN();M.noType=!M.noType;C.save();H.toast(M.noType?'✍️ 書く 問題は 出さないよ<small>また 書きたく なったら ここで もどせるよ</small>':'✍️ 書く 問題も 出すよ',2400);open()};
  if(window.FOOD)FOOD.mineBind(open);
  $('mngo').onclick=()=>{if(myHp()<1)return;if(!M.v2){M.v2=1;C.save()}sf('open');dive()}}

/* ================================================================ the dive */
let D=null;
const LAYER_AT=[1,3,5,8,12];
const layerOf=()=>{const f=D?D.floor:1;let i=0;LAYER_AT.forEach((a,k)=>{if(f>=a)i=k});return MINE_LAYERS[Math.min(MINE_LAYERS.length-1,i)]};
function dive(){try{SHOP.leave()}catch(e){}
  const M=MN();M.dives++;C.save();
  D={bestF0:M.bestF||0,floor:0,hand:[],cards:[],trip:[],cur:-1,depth:0,hp:myHp(),q:0,ok:0,got:[],coins:0,events:[],words:{},crack:0,luck:0,alive:true,f:0,parts:[],pop:null,swing:0,loot:{},lootV:{},
    fx:{mag:0,comp:0,gold:0,guard:0},hard:0,dark:0,chests:0,bads:[],used:[],swaps:0,lowTold:0,badTold:0,stories:0,fall:0};
  diveScreen();
  newFloor();
  if(!MN().handTold){MN().handTold=1;C.save();setTimeout(()=>{if(!D)return;const [,tx]=ML('mn_handTap');H.toast(`${MICO()} <b>ミナ先生</b><small>${esc(tx)}</small>`,4200)},1600)}}
function diveScreen(){if(!D)return;D.alive=true;
  H.show('cg',`<section class="pnl cgp mnp mnd" data-stay>
    <div class="qtop"><button class="x" id="mnx" aria-label="もちかえる">←</button><b id="mnl">⛏️ 地下1階</b><span class="qn" id="mnh"></span></div>
    <div class="mnstage"><canvas id="mncv" width="160" height="80"></canvas><span class="mndep" id="mndep">B1</span><div class="mngot" id="mngot"></div><div class="mncard" id="mncard"></div></div>
    <div class="mnloot" id="mnloot"></div>
    <div class="mnhand sm mnrocks" id="mnhd"></div>
    <p class="mnst" id="mnst"></p>
    <div id="mnq"></div>
    <div class="row mndrow"><button id="mnuse" class="sub">🎒 つかう</button><button id="mnhome" class="sub">🏠 もちかえる</button></div></section>`);
  $('mnx').onclick=$('mnhome').onclick=()=>{sf('back');finish('home')};
  $('mnuse').onclick=()=>{sf('open');useMenu()};
  const cv=$('mncv'),c=cv.getContext('2d');c.imageSmoothingEnabled=false;let last=0;
  const tick=now=>{if(!D||!D.alive||!cv.isConnected)return;requestAnimationFrame(tick);if(now-last<90)return;last=now;D.f++;draw(c)};
  requestAnimationFrame(tick);
}
/* あたらしい 階: 5まいを えらんで 岩に うめる */
function newFloor(){D.floor++;if(D.mapNext){D.mapNext=0;const a=pickFloor(D.floor,D.trip),b=pickFloor(D.floor,D.trip.concat(a)).slice(0,3),all=a.concat(b);if(all.length>HAND)return mapPick(all)}
  floorWith(pickFloor(D.floor,D.trip))}
/* 🗺️ 坑道の 地図: 8まいから ほる 5まいを えらぶ */
function mapPick(all){const sel=new Set();const [ex,tx]=ML('mn_map');
  const draw=()=>{H.show('cg',`<section class="pnl cgp mnp" data-stay>
    <div class="qtop"><span></span><b>🗺️ 地下${D.floor}階の 地図</b><span class="qn">${sel.size} / ${HAND}</span></div>
    <div class="kmina"><span class="lface">${MINA.face('m',ex)}</span><p>${tx}</p></div>
    <p class="mnlbl">ほりたい カードを ${HAND}まい えらんでね</p>
    <div class="mnhand mnmap">${all.map((id,i)=>`<button class="mnt ${sel.has(id)?'on':''}" data-i="${i}">${C.face(id,{mini:1,marks:false})}${sel.has(id)?'<em class="mngotb">✓</em>':''}</button>`).join('')}</div>
    <button class="big" id="mnmpgo" ${sel.size===HAND?'':'disabled'}>⛏️ この ${HAND}まいを ほる</button></section>`);
    H.panel.querySelectorAll('[data-i]').forEach(b=>b.onclick=()=>{const id=all[+b.dataset.i];sf('tap');if(sel.has(id))sel.delete(id);else if(sel.size<HAND){sel.add(id);try{const I=C.info(id);H.say(I.lv,I.en)}catch(e){}}draw()});
    $('mnmpgo').onclick=()=>{if(sel.size!==HAND)return;sf('open');D.used.push('🗺️');diveScreen();floorWith([...sel])}};
  draw()}
function floorWith(ids){D.trip.push(...ids);D.hand=ids;
  D.cards=ids.map(id=>({id,need:needOf(id),hits:0,tries:0,met:false,dug:false,miss:0}));D.cur=-1;D.inFloor=0;
  const M=MN();if(D.floor>(M.bestF||0)){M.bestF=D.floor;C.save()}
  hud();
  if(!ids.length){finish('home');return}
  next()}
function hud(){if(!D||!$("mnl"))return;const L=layerOf(),dug=D.cards.filter(x=>x.dug).length;$('mnl').textContent=`⛏️ 地下${D.floor}階 ・ ${L.n}`;
  $('mnh').innerHTML=`<span class="mnme"><b style="width:${D.hp/ME_HP*100}%"></b></span> ❤${D.hp}`;
  const cd=D.got.length,dp=$('mndep');if(dp)dp.textContent='B'+D.floor;
  const lb=$('mnloot');lb.innerHTML=D.coins||cd||D.events.length||Object.keys(D.loot).length?`<button data-lo="coin">🎒 <b>${D.coins}枚</b></button>${Object.entries(D.loot).map(([ico,n])=>`<button data-lo="g" data-ico="${ico}">${ico}${n>1?`<b>×${n}</b>`:''}</button>`).join('')}${cd?`<button data-lo="cards">🎴<b>×${cd}</b></button>`:''}${D.events.length?`<button data-lo="ev">✨<b>×${D.events.length}</b></button>`:''}`:'<span class="mnnone">🎒 まだ なにも ない</span>';
  lb.querySelectorAll('[data-lo]').forEach(b=>b.onclick=()=>lootInfo(b.dataset.lo,b.dataset.ico));
  if(lb.querySelector('[data-lo]')&&!MN().lootTold){MN().lootTold=1;C.save();setTimeout(()=>{const [,tx]=ML('mn_lootTap');H.toast(`${MICO()} <b>ミナ先生</b><small>${esc(tx)}</small>`,4200)},2200)}
  const fx=[[D.luck>0,'🔦',D.luck],[D.fx.mag>0,'🔍',D.fx.mag],[D.fx.comp>0,'🧭',D.fx.comp],[D.fx.gold>0,'⛏️',D.fx.gold],[D.fx.guard>0,'⛑️',D.fx.guard],[D.hard>0,'🧱',D.hard],[D.dark>0,'🌑',D.dark]].filter(x=>x[0]);
  $('mnst').innerHTML=`🎴 <b>${dug}</b> / ${HAND}まい ほりだした${D.inRedo?' <em>もう一回</em>':''}${fx.length?`<span class="mnfx">${fx.map(x=>`<i>${x[1]}${x[2]}</i>`).join('')}</span>`:''}`;
  const ub=$('mnuse');if(ub)ub.innerHTML=`🎒 つかう${useN()?` <small>${useN()}</small>`:''}`;
  /* 岩の 中の カード: まだ 会っていない＝？、 会った＝うっすら 見える（ひびは 正解の 数。 のこりの 回数は 見せない）、 ほりだした＝ぴかぴか */
  $('mnhd').innerHTML=D.cards.map((x,i)=>`<div class="mnt ${i===D.cur?'on':''} ${x.dug?'dug':x.met?'met':'hid'}" data-i="${i}">${x.met||x.dug?C.face(x.id,{mini:1,marks:false}):'<span class="mnrock">🪨<b>？</b></span>'}${x.dug?'<em class="mngotb">GET</em>':x.met?`<span class="mncrk c${Math.min(3,x.hits)}"></span>`:''}</div>`).join('');
  $('mnhd').querySelectorAll('[data-i]').forEach(b=>b.onclick=()=>handLook(+b.dataset.i))}
/* 📖 手もちの カードを タップで くわしく。 いま 出ている 問題の カードは 答えてから（答えが わかっちゃうから） */
function answered(){const b=$("mnq");return !b||D.busy||!!b.querySelector(".mnintro")||!!b.querySelector('.cgqx:not([hidden]),.cgqc button.ok,.mnw.ok,.mnw.ng,.mnty input.ok,.mnty input.ng')}
function handLook(i){if(!D)return;const id=D.hand[i];if(!id)return;
  const x=D.cards[i];if(x&&!x.met&&!x.dug){sf('knock');gotTag('🪨','まだ 岩の 中…','');return}
  if(i===D.cur&&!answered()){sf('tap');const [,tx]=ML('mn_handWait');H.toast(`${MICO()} <b>ミナ先生</b><small>${esc(tx)}</small>`,3000);return}
  sf('card');C.detail(id,null,{from:'mine'});const M=MN();M.looks=(M.looks||0)+1;C.save();
  if(M.looks===3||(M.looks>3&&Math.random()<.08))setTimeout(()=>{const [,tx]=ML('mn_handLook',{w:head1(C.info(id))});if(tx)H.toast(`${MICO()} <b>ミナ先生</b><small>${esc(tx)}</small>`,3600)},600)}
/* まちがえた あとの 「📖 しらべる」: 答えの カードと、 えらんだ・ならんでいた ことば */
function lookIds(q,I){const out=[I.id];if(!q||q.t==='miss'||!q.ch)return out;
  q.ch.forEach((s,i)=>{if(i===q.ans)return;const c=C.W.find(c=>c.lv===I.lv&&(c.en===s||c.h===s||c.ja===s))||C.W.find(c=>c.en===s||c.h===s);if(c&&!out.includes(c.id))out.push(c.id)});return out}
function lookRow(x,ids){if(!x||!ids.length)return;const r=document.createElement('div');r.className='mnlook';
  r.innerHTML=`<span>📖 しらべる</span>${ids.map(id=>{const I=C.info(id);return I?`<button data-look="${esc(id)}">${esc(head1(I))}</button>`:''}).join('')}`;
  const nx=x.querySelector('.nx');x.insertBefore(r,nx||null);
  r.querySelectorAll('[data-look]').forEach(b=>b.onclick=()=>{sf('card');C.detail(b.dataset.look,null,{from:'mine'})});
  const M=MN();if(!M.lookTold){M.lookTold=1;C.save();setTimeout(()=>{const [,tx]=ML('mn_lookRow');if(tx)H.toast(`${MICO()} <b>ミナ先生</b><small>${esc(tx)}</small>`,4000)},700)}}
/* つぎの 問題: 左から じゅんばん → まちがえた カード → つぎの 周 → つぎの 形 */
/* つぎの 問題: まだ ほりだして いない カードを 左から じゅんばんに。 はじめての ことばは さいしょに 1回 見せてから */
function next(){if(!D||D.falling)return;
  if(D.hp<=0)return finish('hp');
  const left=D.cards.map((x,i)=>i).filter(i=>!D.cards[i].dug);
  if(!left.length)return floorClear();
  let i=left.find(k=>k>D.cur);if(i==null)i=left[0];
  D.cur=i;const x=D.cards[i],I=C.info(x.id);D.inRedo=x.miss>0&&x.tries>0;
  const first=!x.met;x.met=true;
  const S=seq();let t=S[Math.min(S.length-1,x.tries+(x.need<=3?1:0))];if(x.tries>=S.length)t=pickL(S.filter(y=>y!==D.lastT))||'mean';D.lastT=t;
  hud();
  const box=$('mnq');D.busy=false;
  /* 11/18 ユーザー: はじめての ことばは 1周目は 見て おぼえるだけ（ほらずに つぎの ことばへ）。 2周目から 問題で ほる */
  if(first&&fresh(x.id))return intro(box,x,I,()=>{if(!D)return;sf('flip'in SFX?'flip':'tap');next()});
  if(first){sf('knock');gotTag('🪨','岩の 中に カード！',head1(I))}
  ask(t,x,I)}
function ask(t,x,I){const box=$('mnq');if(!D||!box)return;
  const done=r=>after(x.id,r.ok);const tag=QICO[t]||'';
  const q=make(t,I);
  if(typeof q==='function')return q(box,done,tag);
  C.ask(box,q,done,{tag,onWrong:y=>lookRow(y,lookIds(q,I))})}
/* はじめて 会う ことば: 岩の すきまから 見えた カードを 1回 読んで おぼえてから ほる */
function intro(box,x,I,go){const lv=CG_LV[I.lv];
  box.innerHTML=`<div class="cgq mnintro"><div class="cgqt">✨ はじめての ことば<em>${lv?esc(lv.n):''}</em></div>
    <button class="mnin" id="mnsay"><b>${esc(I.en)}</b><span>${esc(I.ja)}</span><small>🔊 タップで もう一回</small></button>
    <div class="row"><button class="sub" id="mnmore">📖 くわしく</button><button class="big" id="mngo2">👀 おぼえた！ つぎへ</button></div><p class="mnin2">はじめての ことばは 見て おぼえるだけ。 2周目から ほるよ</p></div>`;
  setTimeout(()=>sayW(I),300);
  $('mnsay').onclick=()=>{sf('tap');sayW(I)};
  $('mnmore').onclick=()=>{sf('card');C.detail(I.id,null,{from:'mine'})};
  $('mngo2').onclick=()=>{sf('step');go()};
  const M=MN();if(!M.introTold){M.introTold=1;C.save();setTimeout(()=>{if(!D)return;const [,tx]=ML('mn_intro',{w:head1(I)});if(tx)H.toast(`${MICO()} <b>ミナ先生</b><small>${esc(tx)}</small>`,4200)},900)}}
function make(t,I){const h=I.h,plain=/^[a-z]{3,12}$/.test(h);
  if(t==='scramble'&&plain)return scramble(I);
  if(t==='miss'&&plain&&h.length>=4)return missQ(I);
  if((t==='type'||t==='dict')&&plain)return typeQ(I,t==='dict');
  if(t==='fill'){const q=sentQ(I);if(q)return q;try{const c=C.quiz(I.id,{type:'fill'});if(c.t==='fill')return c}catch(e){}return C.quiz(I.id,{type:'rev'})}
  if(t==='spell'){const q=C.quiz(I.id,{type:'spell'});if(q.t==='spell')return q;return C.quiz(I.id,{type:'rev'})}
  if(t==='listen')return C.quiz(I.id,{type:'listen'});
  if(t==='mean')return C.quiz(I.id,{type:'mean'});
  return C.quiz(I.id,{type:'rev'})}
const sayW=I=>{try{H.say(I.lv,I.en)}catch(e){}};
const head1=I=>I.en.split(',')[0];
/* ぬけた 文字: 1〜2文字 ぬけた つづりの ぬけた 所を えらぶ */
function missQ(I){const w=I.h,n=w.length>=7?2:1;const at=1+Math.floor(Math.random()*(w.length-n-1));const ans=w.slice(at,at+n);
  const AB='abcdefghijklmnopqrstuvwxyz',V='aeiou';const wr=new Set();
  for(let k=0;k<40&&wr.size<3;k++){let x='';for(let j=0;j<n;j++){const s=V.includes(ans[j])&&Math.random()<.7?V:AB;x+=s[Math.random()*s.length|0]}if(x!==ans)wr.add(x)}
  const ch=H.shuffle([ans,...wr]);const shown=w.slice(0,at)+'＿'.repeat(n)+w.slice(at+n);
  return {t:'miss',I,q:`<span class="qen mnms">${esc(shown)}</span><span class="qja">${esc(I.ja)}</span>`,ch,ans:ch.indexOf(ans),hint:`${w.length}文字。 声に 出して 読んでみよう`,
    tip:`<b>${esc(w)}</b>（${esc(I.ja)}）<br><small>${esc(w.split('').join(' - '))}</small>`,say:[I.lv,I.en]}}
/* 書く: 日本語（または 音）から つづりを 入力 */
function typeQ(I,dict){const w=I.h;return (box,done,tag)=>{let hint=0,over=false;
  box.innerHTML=`<div class="cgq"><div class="cgqt">${QN[dict?'dict':'type']}<em>${esc(tag)}</em></div>
    <div class="cgqq">${dict?'<button class="qplay" id="mnpl">🔊 もう いちど</button>':`<span class="qja">${esc(I.ja)}</span>`}</div><div class="cgqh" hidden></div>
    <div class="mnty"><input id="mnin" autocomplete="off" autocapitalize="off" spellcheck="false" inputmode="latin" placeholder="${'＿'.repeat(w.length)}（${w.length}文字）"><button id="mnok">OK</button></div>
    <div class="cgqf"><button class="sub" data-h="1">💡 ヒント</button><button class="sub" data-sk="1">⏭️ とばす</button><button class="sub" data-sk="all">✍️ もう 出さない</button></div><div class="cgqx" hidden></div></div>`;
  const inp=$('mnin');if(dict){setTimeout(()=>sayW(I),250);$('mnpl').onclick=()=>sayW(I)}
  setTimeout(()=>{try{inp.focus({preventScroll:true})}catch(e){}},300);
  box.querySelector('[data-h]').onclick=()=>{if(over)return;hint++;sf('pickup');const el=box.querySelector('.cgqh');el.hidden=false;
    el.innerHTML=hint===1?`💡 さいしょは <b>${esc(w[0])}</b>${dict?`、 いみは「${esc(I.ja)}」`:''}`:`💡 <b>${esc(w.slice(0,Math.ceil(w.length/2)))}</b>…`;if(hint>=2)box.querySelector('[data-h]').disabled=true};
  box.querySelectorAll('[data-sk]').forEach(b=>b.onclick=()=>{if(over)return;over=true;skip(b.dataset.sk==='all')});
  const check=()=>{if(over)return;const v=inp.value.trim().toLowerCase();if(!v)return;over=true;inp.disabled=true;$('mnok').disabled=true;
    if(v===w){inp.classList.add('ok');sf('correct');sayW(I);setTimeout(()=>done({ok:true}),750)}
    else{inp.classList.add('ng');sf('wrong');const e=box.querySelector('.cgqx');e.hidden=false;
      e.innerHTML=`<p>正しくは <b>${esc(w)}</b>（${esc(I.ja)}）<br><small>きみの 答え: ${esc(v)}　/　${esc(w.split('').join(' - '))}</small></p><button class="nx">つぎへ ▶</button>`;sayW(I);lookRow(e,[I.id]);
      e.querySelector('.nx').onclick=()=>{sf('step');done({ok:false})}}};
  $('mnok').onclick=check;inp.onkeydown=e=>{if(e.key==='Enter')check()}}}
/* つづりの ならべかえ */
function scramble(I){const w=I.h;
  return (box,done,tag)=>{let ls=H.shuffle([...w].map((ch,i)=>({ch,i})));if(ls.map(x=>x.ch).join('')===w)ls=ls.reverse();let got='',hint=false,over=false;
    const draw=()=>{box.innerHTML=`<div class="cgq"><div class="cgqt">${QN.scramble}<em>${esc(tag)}</em></div><div class="cgqq"><span class="qja">${esc(I.ja)}</span></div>
      <div class="mnw">${[...w].map((_,i)=>`<b>${got[i]||(hint&&i===0?`<u>${w[0]}</u>`:'')}</b>`).join('')}</div>
      <div class="mnls">${ls.map((x,k)=>`<button data-k="${k}" ${x.used?'disabled':''}>${x.ch}</button>`).join('')}</div>
      <div class="cgqf"><button class="sub" data-h="1" ${hint?'disabled':''}>💡 ヒント</button><button class="sub" data-u="1">⌫ もどす</button></div><div class="cgqx" hidden></div></div>`;
      box.querySelector('[data-h]').onclick=()=>{if(hint||over)return;hint=true;sf('pickup');draw()};
      box.querySelector('[data-u]').onclick=()=>{if(over||!got.length)return;const x=ls.find(y=>y.used===got.length);if(x)x.used=0;got=got.slice(0,-1);sf('tap');draw()};
      box.querySelectorAll('[data-k]').forEach(b=>b.onclick=()=>{if(over)return;const x=ls[+b.dataset.k];if(x.used)return;got+=x.ch;x.used=got.length;sf('tap');
        if(got.length<w.length)return draw();over=true;const ok=got===w;draw();box.querySelectorAll('button').forEach(y=>y.disabled=true);
        if(ok){sf('correct');sayW(I);box.querySelector('.mnw').classList.add('ok');setTimeout(()=>done({ok:true}),750);
          const M=MN();M.scrOk=(M.scrOk||0)+1;if(M.scrOk===5||M.scrOk%40===0)setTimeout(()=>{const [,tx]=ML('mn_scrOk',{w:w});if(tx)H.toast(`${MICO()} <b>ミナ先生</b><small>${esc(tx)}</small>`,3600)},900)}
        else{sf('wrong');box.querySelector('.mnw').classList.add('ng');const e=box.querySelector('.cgqx');e.hidden=false;
          e.innerHTML=`<p>正しくは <b>${esc(w)}</b>（${esc(I.ja)}）<br><small>${esc(w.split('').join(' - '))} と 声に 出して おぼえよう</small></p><button class="nx">つぎへ ▶</button>`;sayW(I);lookRow(e,[I.id]);
          e.querySelector('.nx').onclick=()=>{sf('step');done({ok:false})}}})};
    draw();
    const M=MN();if(!M.scrTold){M.scrTold=1;C.save();setTimeout(()=>{const [,tx]=ML('mn_scramble');if(tx)H.toast(`${MICO()} <b>ミナ先生</b><small>${esc(tx)}</small>`,4400)},700)}}}
/* 例文の あなうめ（文カードの 例文から） */
function sentQ(I){const h=I.h;if(!/^[a-z]+$/.test(h))return null;const re=new RegExp('\\b'+h+'\\b','i');
  const ss=C.SENT.filter(s=>re.test(s.en));if(!ss.length)return null;const s=pickL(ss);
  const blank=s.en.replace(re,'＿＿＿');const ws=H.shuffle(C.W.filter(c=>c.lv===I.lv&&c.h!==h&&/^[a-z]+$/.test(c.h))).slice(0,3).map(c=>c.h);
  const ch=H.shuffle([h,...ws]);
  return {t:'fill',I,q:`<span class="qen">${esc(blank)}</span><span class="qja">${esc(s.ja)}</span>`,ch,ans:ch.indexOf(h),hint:`いみは「${esc(I.ja)}」`,
    tip:`<b>${esc(s.en)}</b><br>${esc(s.ja)}<br><small>${esc(I.en)} ＝ ${esc(I.ja)}。 文ごと 声に 出すと おぼえやすいよ</small>`,say:[s.lv,s.en]}}
/* after an answer */
/* 書く 問題を とばす: 体力も へらさず、 まちがいにも しない。 all なら このあとも 出さない */
/* 書く 問題を とばす: 体力も へらさず、 まちがいにも しない。 all なら このあとも 出さない */
function skip(all){if(!D||D.busy)return;D.busy=true;sf('step');
  if(all){const M=MN();M.noType=true;C.save();H.toast('✍️ 書く 問題は 出さないよ<small>鉱山の 入口で もどせるよ</small>',2600)}
  const x=D.cards[D.cur];if(x)x.tries++;
  setTimeout(()=>next(),150)}
function after(id,ok){if(!D||D.busy)return;D.busy=true;D.q++;D.hp--;keepHp(D.hp);C.record(id,ok);const w=D.words[id]||(D.words[id]=[0,0]);w[ok?0:1]++;
  const M=MN();M.q++;if(ok)M.ok++;
  const x=D.cards[D.cur];if(x&&x.id===id){x.tries++;if(ok)x.hits++;else{x.miss++;x.need=Math.min(8,x.need+1)}}
  ['mag','comp'].forEach(k=>{if(D.fx[k]>0)D.fx[k]--});
  if(D.hp>0&&D.hp<=12&&!D.lowTold&&window.FOOD&&FOOD.bagList().length){D.lowTold=1;setTimeout(()=>{if(!D)return;const [,tx]=ML('mn_lowHp');H.toast(`${MICO()} <b>ミナ先生</b><small>${esc(tx)}</small>`,4200)},900)}
  if(ok){D.ok++;D.swing=6;sf('tap');setTimeout(()=>{if(!D)return;D.crack=0;
      if(D.hard>0){D.hard--;D.crack=2;sf('knock');gotTag('🧱','カチン！ かたい 岩',D.hard?`あと ${D.hard}`:'');if(x&&x.hits>0)x.hits--}
      else{const g=D.fx.gold>0;if(g)D.fx.gold--;D.depth+=g?2:1;burst();sf('knock');if(g&&x&&!x.dug)x.hits++}
      const won=x&&!x.dug&&x.hits>=x.need;if(won)dug(x);
      const big=won?false:find();C.save();hud();if(!big)setTimeout(()=>next(),won?1500:D.pop?650:450)},420);}
  else{D.swing=6;D.crack=Math.min(2,D.crack+1);setTimeout(()=>{sf('tap')},300);C.save();hud();setTimeout(()=>next(),200)}}
/* 1まい ほりだした！ 自分の ものに なる */
function dug(x){x.dug=true;const isNew=!C.owns(x.id);C.give(x.id);const bk=toBook(x.id);D.got.push({id:x.id,isNew,bk});cardTag(x.id,isNew,true,bk);
  const n=D.cards.filter(y=>y.dug).length;if(n<HAND&&!MN().dugTold){MN().dugTold=1;C.save();setTimeout(()=>{if(!D)return;const [,tx]=ML('mn_dug',{w:head1(C.info(x.id))});if(tx)H.toast(`${MICO()} <b>ミナ先生</b><small>${esc(tx)}</small>`,4200)},7000)}}
/* what you find. カードは めったに 出ない（出たら 大きな お祝い）。 true を かえすと お祝いの あとで つぎへ */
function find(){const L=layerOf(D.depth),r=Math.random(),lk=D.luck>0?.12:0;if(D.luck>0)D.luck--;const dk=D.dark>0;if(dk)D.dark--;
  /* 📦 宝箱（🧭で 出やすい）と 悪い できごと（深いほど）は 先に きめる */
  /* 🌙 深夜（0〜4時）や 🕯️ ろうそくの とき: ふしぎな できごと（game/horror.js） */
  if(window.HORROR){const h=HORROR.mine(D,{hud,next,addTool,burst,gotTag,fly,keepHp});if(h!=null)return h}
  if(Math.random()<P_CHEST+(D.fx.comp>0?.035:0))return chest();
  if(Math.random()<pBad(D.depth))return bad();
  const deep=Math.min(.02,D.depth*1.7/5000);   // 深いほど 少しだけ 出やすい
  /* 11/18 ユーザー「掘っていても カードは 見つけない。 掘って ゲットしたい」: とちゅうで カードが 見つかる しくみは なくした（カードは 岩の 5まいと お話の ごほうびだけ） */
  if(r<deep+P_EVENT+(D.fx.comp>0?.02:0)){const E=pickL(MINE_EVENT);D.events.push(E);
    if(E.hp){D.hp=Math.min(ME_HP,D.hp+E.hp);keepHp(D.hp)}if(E.deep)D.depth+=E.deep;if(E.luck)D.luck+=E.luck;if(E.coin)D.coins+=E.coin;
    let tx=E.t;if(E.tool){const id=pickL(['lamp','lamp','wood','wood','helmet','mag','batt']);addTool(id);tx+=` ${MINE_TOOLS[id].ico} ${MINE_TOOLS[id].n}`}
    D.pop={ico:E.ico,t:0,big:1};fly(E.ico);gotTag(E.ico,E.n,E.coin?`+${E.coin}枚`:'');sf('hey');H.toast(`${E.ico} <b>${esc(E.n)}</b><small>${esc(tx)}</small>`,3600);hud();return false}
  if(!dk&&r<deep+P_EVENT+P_GEM+lk){const gi=Math.min(MINE_GEM.length-1,Math.floor(Math.random()*(2+D.depth/12))),G=MINE_GEM[gi];const v=Math.round((G[2]+Math.floor(D.depth/5))*(D.fx.mag>0?1.5:1));
    D.coins+=v;D.loot[G[0]]=(D.loot[G[0]]||0)+1;D.lootV[G[0]]=(D.lootV[G[0]]||0)+v;D.pop={ico:G[0],t:0};fly(G[0],v>=40?'big':'');gotTag(G[0],G[1],`+${v}枚`);sf('coinIn');return false}
  D.pop=null;return false}
/* 🎒 手に 入れた 物を タップすると くわしく（鉱山の つづきは そのまま。 閉じると もどる） */
const GEM_INFO={'🪨':['a pretty stone','川や 鉱山で ひろえる、 つるつるの 石。 ながめるだけで 落ちつくよ','Mio','「きれいな 石、 お店の レジの よこに かざりたいな〜」'],
 '🔶':['amber','大むかしの 木の やにが 固まった 石。 中に 虫が 入っていることも あるよ','Mina','amber は「こはく色」という 色の 名前にも なるの。 信号の 黄色も amber って いうんだよ'],
 '💎':['diamond','いちばん かたい 石。 光を あてると にじ色に キラキラ','Mina','diamond は トランプの ♦（ダイヤ）も 同じ ことばだよ'],
 '🔮':['crystal','すきとおった 水晶。 のぞくと 向こうが ふしぎに 見える','Mio','「crystal clear（すごく はっきり）って 言い方、 授業で ならいました！」'],
 '🌠':['meteorite','空から 落ちてきた 流れ星の 石。 宇宙を 旅してきたんだね','Mina','meteor が 流れ星、 meteorite が 地面に 落ちた 石。 -ite は「石」の しるしだよ'],
 '🪙':['an old gold coin','むかしの 人が 使っていた 金貨。 どんな 買い物を したのかな','Mio','「coin は 1まい、 coins は 2まい いじょう。 店長、 お会計の 英語で 使えますね！」']};
function lootInfo(kind,ico){if(!D)return;sf('card');const back='<button class="mnlob" data-x>⛏️ つづきを ほる</button>';let h='';
  const gemRow=([i,n])=>{const G=MINE_GEM.find(g=>g[0]===i)||[i,'?'];return `<button class="mnlor" data-ico="${i}"><span class="gi">${i}</span><span>${esc(G[1])} <b>×${n}</b></span><b class="v">+${D.lootV[i]||0}枚</b></button>`};
  if(kind==='g'){const G=MINE_GEM.find(g=>g[0]===ico),I=GEM_INFO[ico]||['','','',''],n=D.loot[ico]||0;if(!G)return;
    h=`<div class="mnlo"><div class="mnlobig">${ico}</div><p class="mnlon">${esc(G[1])} <b>×${n}</b></p>${I[0]?`<p class="mnloen">${esc(I[0])}</p>`:''}
      <p class="mnlod">${esc(I[1])}</p><p class="mnlov">💰 <b>+${D.lootV[ico]||0}枚</b><small>（1こ ${G[2]}枚＋深さ ぶん）</small></p>
      ${I[3]?`<p class="mnlot"><b>${I[2]==='Mio'?'🧑‍🎓 ミオ':MICO()+' ミナ先生'}</b> ${esc(I[3])}</p>`:''}${back}</div>`}
  else if(kind==='coin'){const ev=D.events.reduce((a,e)=>a+(e.coin||0),0);
    h=`<div class="mnlo"><p class="mnlon">🎒 もちかえる コイン <b>${D.coins}枚</b></p>
      <div class="mnlol">${Object.entries(D.loot).map(gemRow).join('')||'<p class="mnlod">石や 宝石は まだ ないよ</p>'}
      ${ev?`<div class="mnlor"><span class="gi">✨</span><span>できごと</span><b class="v">+${ev}枚</b></div>`:''}</div>
      <p class="mnlod">もちかえると ぜんぶ もらえるよ（❤が 0でも だいじょうぶ）。 石を タップすると くわしく 見られるよ</p>${back}</div>`}
  else if(kind==='cards'){h=`<div class="mnlo"><p class="mnlon">🎴 見つけた カード <b>${D.got.length}まい</b></p>
      <div class="mnloc">${D.got.map(g=>`<button class="mnloci" data-id="${esc(g.id)}">${C.face(g.id,{mini:1,marks:false})}${g.isNew?'<em>NEW</em>':''}</button>`).join('')}</div>
      <p class="mnlod">カードを タップすると 📖 くわしく 見られるよ</p>${back}</div>`}
  else if(kind==='ev'){h=`<div class="mnlo"><p class="mnlon">✨ 鉱山の できごと <b>${D.events.length}</b></p>
      <div class="mnlol">${D.events.map(e=>`<div class="mnlor"><span class="gi">${e.ico}</span><span><b>${esc(e.n)}</b><small>${esc(e.t)}</small></span></div>`).join('')}</div>${back}</div>`}
  const o=C.ov(h,'mnlov');
  o.querySelectorAll('[data-x]').forEach(b=>b.onclick=()=>{sf('back');C.closeOv()});
  o.querySelectorAll('.mnlor[data-ico]').forEach(b=>b.onclick=()=>lootInfo('g',b.dataset.ico));
  o.querySelectorAll('.mnloci').forEach(b=>b.onclick=()=>{sf('card');C.detail(b.dataset.id,()=>lootInfo('cards'),{from:'mine'})})}
/* 手に 入れた 物を ドット絵の 上に はっきり 出す（すぐ 消える） */
function gotTag(ico,name,val){const el=$('mngot');if(!el)return;const t=document.createElement('div');t.className='mngt';
  t.innerHTML=`<span class="gi">${ico}</span><span class="gn">${esc(name)}</span>${val?`<b>${esc(val)}</b>`:''}`;
  el.appendChild(t);while(el.children.length>2)el.firstChild.remove();setTimeout(()=>t.remove(),1800)}
/* 単語カードを 見つけた: よく 出るので ほる テンポを 止めない。 ドット絵の 上に カードの 札（タップで 📖 くわしく＋読む）。
   ほりつづけても 🎒🎴 から あとで 見られる。 さいしょの 1まいの あとで 1回だけ ミナ先生が 教えてくれる（札に かさならないよう 札が 消えてから） */
function cardTag(id,isNew,dg,bk){const M=MN();M.cards=(M.cards||0)+1;C.save();D.pop={ico:'🎴',t:0,big:1};fly('🎴','big');
  try{SFX.fanfare(1)}catch(e){sf('done')}
  try{const r=$('mncv').getBoundingClientRect();FX.firework(r.left+r.width*(.3+Math.random()*.4),r.top+r.height*.4)}catch(e){}
  const el=$('mncard');if(!el)return;const I=C.info(id);if(!I)return;
  el.innerHTML=`<button class="mncd" data-id="${esc(id)}"><span class="gi">🎴</span><span class="cn"><small>${dg?'ほりだした！':'カードを 見つけた！'}${isNew?' <em>NEW</em>':''}${bk?' 📖ブックへ':''}</small><b>${esc(head1(I))}</b><i>${esc(I.ja)}</i></span><span class="tp">📖</span></button>`;
  const b=el.firstChild;b.onclick=()=>{sf('card');C.detail(id,null,{from:'mine'})};
  clearTimeout(el._t);el._t=setTimeout(()=>{if(b.isConnected)b.classList.add('out');setTimeout(()=>{if(b.isConnected)b.remove()},400)},6500);
  if(!MN().cardTold){MN().cardTold=1;C.save();setTimeout(()=>{if(!D)return;try{const [,tx]=ML('mn_card',{w:head1(I)});H.toast(`${MICO()} <b>ミナ先生</b><small>${esc(tx)}</small>`,4200)}catch(e){}},7200)}}
/* 宝カードを 見つけた！（めったに ない ので 大きな お祝い） */
function celebrate(id,isNew,treasure){const M=MN();M.cards=(M.cards||0)+1;C.save();D.pop={ico:treasure?'🎁':'🎴',t:0,big:1};
  try{SFX.fanfare(treasure?3:2)}catch(e){sf('done')}
  try{const r=$('mncv').getBoundingClientRect();[0,350,700].forEach(t=>setTimeout(()=>FX.firework(r.left+r.width*(.3+Math.random()*.4),r.top+r.height*.4),t))}catch(e){}
  fly(treasure?'🎁':'🎴','big');setTimeout(()=>{if(D)celebrateOv(id,isNew,treasure)},950);return true}
function celebrateOv(id,isNew,treasure){
  const I=C.info(id),[ex,tx]=ML(treasure?'mn_treasure':'mn_card',{w:I?head1(I):''});
  const o=C.ov(`<div class="mnfind"><p class="mnfh">✨ ${treasure?'🎁 宝カードを 見つけた！':'カードを 見つけた！'}</p>
    <div class="mnfc">${C.face(id,{big:1,ja:1})}</div>${isNew?'<p class="mnnew">NEW!</p>':''}<p class="mntap">👆 カードを タップすると くわしく 見られるよ</p>
    <div class="kmina"><span class="lface">${MINA.face('m',ex)}</span><p>${tx}</p></div>
    ${I&&C.moreClosed?`<div class="mnwi">${C.moreClosed(I)}</div>`:''}
    <button class="big" id="mnyay">やった！ ほりつづける</button></div>`,'by');
  o.dataset.stay=1;if(C.bindMore)C.bindMore(o);
  o.querySelector('#mnyay').onclick=()=>{sf('step');C.closeOv();if(D)next()}}

/* ================================================================ ✨ 見つけた ときの アニメーション（11/16 ユーザー「何か見つけた時は アニメーションが ほしい」）
   岩から 物が ポンと とび出して 光り、 はねてから 🎒 へ 入る。 big＝カード・宝箱（大きく 金色に 光る）/ bad＝悪い できごと（赤く ゆれる） */
function fly(ico,kind=''){const st=document.querySelector('.mnstage');if(!st||!D)return;D.flash=kind==='bad'?0:kind==='big'?5:3;
  const el=document.createElement('div');el.className='mnfly '+kind;el.setAttribute('aria-hidden','true');
  el.innerHTML=`<b class="glow"></b>${kind==='bad'?'':Array.from({length:kind==='big'?12:8},(_,i)=>`<i style="--a:${i*(360/(kind==='big'?12:8))+Math.random()*15}deg;--d:${kind==='big'?62:44}px"></i>`).join('')}<span>${ico}</span>`;
  st.appendChild(el);
  if(kind==='bad'){st.classList.remove('mnshake');void st.offsetWidth;st.classList.add('mnshake')}
  else{const bag=$('mnloot');if(bag){setTimeout(()=>{bag.classList.remove('mnbump');void bag.offsetWidth;bag.classList.add('mnbump')},kind==='big'?1250:900)}}
  setTimeout(()=>el.remove(),kind==='big'?1500:1200)}

/* ================================================================ 🎒 とちゅうで つかう（食べ物・道具） */
const foods=()=>window.FOOD?FOOD.bagList():[];
const useN=()=>foods().reduce((a,s)=>a+(FOOD.rec().bag[s.id]||0),0)+toolList().filter(t=>t.ef!=='key'&&!t.rest&&!t.auto).reduce((a,t)=>a+toolN(t.id),0);
function useMenu(){if(!D)return;const F=foods(),T=toolList(),bag=window.FOOD?FOOD.rec().bag:{};const mo=pickL(MINE_MIO);
  const row=(k,id,ico,name,n,sub,off)=>`<button class="mnlor mnuse" data-${k}="${id}" ${off?'disabled':''}><span class="gi">${ico}</span><span><b>${esc(name)}</b> <b class="n">×${n}</b><small>${sub}</small></span></button>`;
  const o=C.ov(`<div class="mnlo"><p class="mnlon">🎒 なにを つかう？ <small class="mnhp">❤ ${D.hp}/${ME_HP}</small></p>
    ${window.MIO?`<div class="kmina mnmio" data-say="${esc(mo[0])}"><span class="lface">${MIO.face('smile')}</span><p>${esc(mo[0])}<small>${esc(mo[1])}</small></p></div>`:''}
    <div class="mnlol">${F.length?`<p class="mnuh">🍪 食べもの</p>${F.map(s=>row('f',s.id,s.ico,s.n,bag[s.id],`❤+${s.hp}${D.hp>=ME_HP?'（いまは まんたん）':''}`,D.hp>=ME_HP)).join('')}`:''}
      ${T.length?`<p class="mnuh">⛏️ 道具</p>${T.map(t=>row('t',t.id,t.ico,t.n,toolN(t.id),esc(t.s)+(t.ef==='key'?'・宝箱が 出たら つかえる':t.rest?'（🏕️ 休憩所で つかう）':''),t.ef==='key'||t.auto||t.rest)).join('')}`:''}
      ${!F.length&&!T.length?'<p class="mnlod">まだ なにも ないよ。 食べ物と 道具は ながれぎ雑貨店で 買えるよ（🥪 食べ物・⛏️ 鉱山 の たな）</p>':''}</div>
    <button class="mnlob" data-x>⛏️ つづきを ほる</button></div>`,'mnlov');
  o.querySelectorAll('[data-x]').forEach(b=>b.onclick=()=>{sf('back');C.closeOv()});
  const mb=o.querySelector('.mnmio');if(mb)mb.onclick=()=>{try{MIO.say(mb.dataset.say)}catch(e){}};
  o.querySelectorAll('[data-f]').forEach(b=>b.onclick=()=>eatNow(b.dataset.f));
  o.querySelectorAll('[data-t]').forEach(b=>b.onclick=()=>useTool(b.dataset.t))}
function eatNow(id){if(!D||!FOOD.take(id))return;const s=FOOD_SNACKS[id];const a=D.hp;D.hp=Math.min(ME_HP,D.hp+(s.hp||0));keepHp(D.hp);D.used.push(s.ico);
  try{RECENT.add('snack',{id,en:s.en,ja:s.n,ico:s.ico,mine:1})}catch(e){}
  sf('eat');setTimeout(()=>sf('gulp'in SFX?'gulp':'pop'),450);C.closeOv();gotTag(s.ico,'もぐもぐ',`❤+${D.hp-a}`);
  const [,tx]=ML('mn_useFood',{t:s.n});H.toast(`${s.ico} <b>${esc(s.n)}</b> ❤ ${a} → <b>${D.hp}</b><small>${MICO()} ${esc(tx)}</small>`,3200);hud()}
function useTool(id){const t=MINE_TOOLS[id];if(!D||!t||t.ef==='key'||t.auto||t.rest||!takeTool(id))return;D.used.push(t.ico);C.closeOv();
  if(t.ef==='lamp')D.luck+=t.v;else if(t.ef==='rope'){D.depth+=t.v;burst()}else if(t.ef==='guard')D.fx.guard+=t.v;else D.fx[t.ef]=(D.fx[t.ef]||0)+t.v;
  if(t.ef==='lamp'&&D.dark){D.dark=0}
  sf(t.ef==='rope'?'knock':'pickup');gotTag(t.ico,t.n,t.ef==='rope'?`+${t.v}m`:'');
  const [,tx]=ML('mn_useTool',{t:t.n,en:t.en});H.toast(`${t.ico} <b>${esc(t.n)}</b><small>${esc(t.s)}<br>${MICO()} ${esc(tx)}</small>`,3400);hud()}

/* ================================================================ 📦 宝箱 */
const SNACK_POOL=()=>typeof FOOD_SNACKS==='undefined'?[]:Object.keys(FOOD_SNACKS).filter(id=>FOOD_SNACKS[id].lv!=='hs');
function chest(){D.chests++;D.pop={ico:'📦',t:0,big:1};sf('hey');try{SFX.fanfare(1)}catch(e){}
  fly('📦','big');setTimeout(()=>{if(D)chestOv()},950);return true}
function chestOv(){
  const met=D.cards.filter(x=>x.met||x.dug).map(x=>x.id),id=pickL(met.length?met:D.hand),I=C.info(id),keyN=toolN('key'),[ex,tx]=ML('mn_chest');
  const o=C.ov(`<div class="mnfind mnchest"><p class="mnfh">📦 宝箱を 見つけた！</p><div class="mnchb">📦</div>
    <div class="kmina"><span class="lface">${MINA.face('m',ex)}</span><p>${tx}</p></div>
    <div class="mnchq" id="mnchq"></div>
    <div class="mnchbtn">${keyN?`<button class="big" data-k>🗝️ かぎで あける <small>×${keyN}</small></button>`:''}<button class="${keyN?'sub':'big'}" data-pw>🔤 合言葉で あける</button></div></div>`,'by');
  o.dataset.stay=1;
  const kb=o.querySelector('[data-k]');if(kb)kb.onclick=()=>{if(!takeTool('key'))return;D.used.push('🗝️');sf('pickup');reveal(o,2,I)};
  o.querySelector('[data-pw]').onclick=()=>{o.querySelector('.mnchbtn').remove();const q=C.quiz(id,{type:'rev'});
    C.ask(o.querySelector('#mnchq'),q,r=>{C.record(id,r.ok);reveal(o,r.ok?1:0,I)},{tag:'🔒 合言葉'})}}
function reveal(o,tier,I){if(!D)return;const dp=D.depth,got=[];
  const coin=tier===2?60+dp*2:tier===1?25+dp:10+Math.floor(dp/3);D.coins+=coin;got.push(['🪙',`コイン ${coin}枚`]);
  const sp=SNACK_POOL();
  if(window.FOOD&&sp.length&&Math.random()<(tier===2?.6:tier===1?.45:.15)){const f=pickL(sp);FOOD.add(f);got.push([FOOD_SNACKS[f].ico,FOOD_SNACKS[f].n])}
  if(tier===2||(tier===1&&Math.random()<.25)){const t=pickL(tier===2?['lamp','helmet','mag','note','map','batt']:['lamp','wood','helmet','mag']);addTool(t);got.push([MINE_TOOLS[t].ico,MINE_TOOLS[t].n])}
  D.events.push({ico:'📦',n:tier===2?'宝箱（かぎ）':tier===1?'宝箱（合言葉）':'宝箱（少しだけ）',t:got.map(g=>g[0]+' '+g[1]).join('・'),coin});
  try{SFX.fanfare(tier===2?3:tier===1?2:1)}catch(e){sf('coinIn')}
  try{const r=o.querySelector('.mnchb').getBoundingClientRect();FX.firework(r.left+r.width/2,r.top+r.height/2)}catch(e){}
  const [ex,tx]=ML(tier===2?'mn_chestKey':tier===1?'mn_chestOk':'mn_chestMiss',{w:I?head1(I):''});
  o.querySelector('.mnfind').innerHTML=`<p class="mnfh">${tier?'✨ 宝箱が あいた！':'📦 少しだけ あいた'}</p><div class="mnchb open">${tier===2?'🗝️':'📦'}</div>
    <div class="mnlol">${got.map(g=>`<div class="mnlor"><span class="gi">${g[0]}</span><span><b>${esc(g[1])}</b></span></div>`).join('')}</div>
    <div class="kmina"><span class="lface">${MINA.face('m',ex)}</span><p>${tx}</p></div>
    <button class="big" id="mnyay">やった！ ほりつづける</button>`;
  o.querySelector('#mnyay').onclick=()=>{sf('step');C.closeOv();if(D){hud();next()}}}

/* ================================================================ 悪い できごと（見つけた 物は 取られない） */
function bad(){const ok=MINE_BAD.filter(b=>!b.min||D.depth>=b.min),B=pickL(ok);
  if(D.fx.guard>0){D.fx.guard--;D.bads.push('guard');sf('knock');gotTag('⛑️','ふせいだ！','');
    const [,tx]=ML('mn_badGuard');H.toast(`⛑️ <b>ヘルメットで ふせいだ！</b><small>${B.ico} ${esc(B.n)}… でも へっちゃら！<br>${MICO()} ${esc(tx)}</small>`,3400);hud();return false}
  D.bads.push(B.id);D.events.push({ico:B.ico,n:B.n,t:B.t});
  if(B.back)D.depth=Math.max(0,D.depth-B.back);
  if(B.hard)D.hard+=B.hard;
  if(B.dark){D.dark=Math.max(D.dark,B.dark);D.luck=0}
  if(B.hp){D.hp=Math.max(1,D.hp-B.hp);keepHp(D.hp)}
  D.pop={ico:B.ico,t:0,big:1};D.crack=2;sf('wrong');fly(B.ico,'bad');gotTag(B.ico,B.n,B.back?`-${B.back}m`:B.hp?`❤-${B.hp}`:'');
  try{H.say('jh',B.en)}catch(e){}
  H.toast(`${B.ico} <b>${esc(B.n)}</b><small>「${esc(B.en)}」 ${esc(B.ja)}<br>${esc(B.t)}</small>`,4200);
  const M=MN();if(!D.badTold&&(M.badTold||0)<4){D.badTold=1;M.badTold=(M.badTold||0)+1;C.save();setTimeout(()=>{if(!D)return;const [,tx]=ML('mn_bad',{t:B.n});H.toast(`${MICO()} <b>ミナ先生</b><small>${esc(tx)}</small>`,4200)},4600)}
  hud();return false}

/* ================================================================ pixel art（11/18 描きなおし: 石づみの 坑道・はしらと はり・ランタン・トロッコ・大きな 岩・ヘッドランプ） */
const PR=(c,x,y,w,h,col)=>{c.fillStyle=col;c.fillRect(x,y,w,h)};
function hsh(n){n=Math.imul(n^n>>>16,0x45d9f3b);n=Math.imul(n^n>>>16,0x45d9f3b);return (n^n>>>16)>>>0}
const shd=(hex,f)=>{const n=parseInt(hex.slice(1),16);let r=n>>16,g=n>>8&255,b=n&255;const t=f<0?0:255,p=Math.min(1,Math.abs(f));return `rgb(${Math.round(r+(t-r)*p)},${Math.round(g+(t-g)*p)},${Math.round(b+(t-b)*p)})`};
function glow(c,x,y,r,col,a){c.globalCompositeOperation='lighter';const g=c.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,`rgba(${col},${a})`);g.addColorStop(1,`rgba(${col},0)`);c.fillStyle=g;c.fillRect(x-r,y-r,r*2,r*2);c.globalCompositeOperation='source-over'}
/* 石づみの 壁（でこぼこの 石・上は 明るく 下は かげ） */
function stones(c,x0,y0,w,h,col,seed){PR(c,x0,y0,w,h,shd(col,-.5));let y=y0,row=0;
  while(y<y0+h){const rh=5+hsh(seed+row*7)%3;let x=x0-hsh(seed+row*13)%10,i=0;
    while(x<x0+w){const bw=7+hsh(seed+row*31+i*17)%9,v=(hsh(seed+row*5+i*3)%100)/100*.18-.09,bx=Math.max(x0,x+1),be=Math.min(x0+w,x+bw),by=y+1,bh=Math.min(rh-1,y0+h-by);
      if(be>bx&&bh>0){PR(c,bx,by,be-bx,bh,shd(col,v));PR(c,bx,by,be-bx,1,shd(col,v+.16));PR(c,bx,by+bh-1,be-bx,1,shd(col,v-.2));PR(c,be-1,by,1,bh,shd(col,v-.14));
        if(hsh(i*99+row+seed)%3===0&&be-bx>4)PR(c,bx+2+hsh(i+row*3)%(be-bx-3),by+2,1,1,shd(col,v-.28))}
      x+=bw;i++}y+=rh;row++}}
function beamV(c,x,y,w,h){PR(c,x,y,w,h,'#6a4426');PR(c,x,y,1,h,'#8e5e34');PR(c,x+w-1,y,1,h,'#3e2614');for(let j=y+5;j<y+h;j+=9)PR(c,x+1,j,w-2,1,'#563620')}
function beamH(c,x,y,w,h){PR(c,x,y,w,h,'#6a4426');PR(c,x,y,w,1,'#8e5e34');PR(c,x,y+h-1,w,1,'#3e2614');for(let i=x+4;i<x+w;i+=11)PR(c,i,y+1+(i%2),3,1,'#563620')}
const ORE=['#ffd23f','#e8e8f0','#7ad8ff','#c49aff','#fff6b0'];
let BG=null,BGK='';
function digBg(L,li){const cv=document.createElement('canvas');cv.width=160;cv.height=80;const c=cv.getContext('2d');const [a,b,k]=L.col;
  PR(c,0,0,160,80,k);stones(c,0,0,160,66,a,li*131+7);
  /* 天井の かげと つらら石 */
  for(let x=0;x<160;x++){const d=(x-80)/80,ch=Math.round(2+d*d*12+hsh(x*7+li)%2);PR(c,x,0,1,ch,shd(k,-.35));PR(c,x,ch,1,1,shd(a,-.4))}
  for(let i=0;i<6;i++){const h=hsh(i*41+li*3),x=14+h%132,l=3+(h>>>8)%4,top=Math.round(2+((x-80)/80)**2*12);for(let j=0;j<l;j++){const w=Math.max(1,3-Math.floor(j*3/l));PR(c,x+Math.floor((3-w)/2),top+j,w,1,shd(k,-.05))}}
  /* ゆか */
  PR(c,0,64,160,16,b);PR(c,0,64,160,2,shd(b,-.35));
  for(let i=0;i<50;i++){const h=hsh(i*313+li*11);PR(c,h%160,67+(h>>>8)%13,(h>>>16)%3+1,1,(h>>>20)%2?shd(b,.15):shd(b,-.2))}
  /* レールと まくら木（左） */
  for(let x=0;x<50;x+=5)PR(c,x,71,3,2,'#4a3020');PR(c,0,70,50,1,'#a8aeb8');PR(c,0,71,50,1,'#5a5e68');
  /* トロッコ（ほった 石で いっぱい） */
  const mx=8;PR(c,mx,59,24,9,'#4e5260');PR(c,mx,59,24,1,'#a0a6b4');PR(c,mx+1,60,22,1,'#6a6e7c');PR(c,mx,67,24,1,'#2e3038');for(let i=mx+5;i<mx+24;i+=6)PR(c,i,60,1,7,'#3e4250');
  for(let i=0;i<10;i++){const h=hsh(i*17+li);PR(c,mx+1+i*2,56+(i%3===1?-1:i%2),3,3,shd(b,(h%24)/100-.04))}
  PR(c,mx+6,56,1,1,ORE[li]||'#fff');PR(c,mx+14,55,1,1,ORE[li]||'#fff');PR(c,mx+19,57,1,1,'#ff9ab0');
  [mx+3,mx+16].forEach(x=>{PR(c,x,67,5,4,'#1e1e24');PR(c,x+1,68,3,2,'#6a6a74');PR(c,x+2,68,1,1,'#aaa')});
  /* はしらと はり */
  beamV(c,40,6,4,58);beamV(c,148,6,4,58);beamH(c,36,4,120,4);PR(c,40,8,4,1,'#3e2614');PR(c,148,8,4,1,'#3e2614');
  [[41,5],[149,5]].forEach(p=>PR(c,p[0],p[1],1,1,'#c8c8d0'));
  /* かべに 立てかけた スコップ */
  for(let i=0;i<16;i++)PR(c,138-Math.floor(i/4),48+i,1,1,'#8a5a32');PR(c,133,62,4,3,'#8a8e9a');PR(c,133,62,4,1,'#c0c4cc');
  return cv}
/* 大きな 岩: ほった カードが すこしずつ 見えてくる */
function rock(c,L,li,cx,f){const [a,b,k]=L.col,base=shd(b,-.12),hi=shd(b,.18),lo=shd(b,-.34),dk=k;
  for(let y=18;y<65;y++){const t=(y-41)/24,w=Math.round(19*Math.sqrt(Math.max(0,1-t*t*(t<0?1:.25)))+(hsh(y*5)%2));if(w<=0)continue;
    PR(c,cx-w,y,w*2,1,base);PR(c,cx-w,y,2,1,hi);PR(c,cx+w-3,y,3,1,lo);if(y>50)PR(c,cx-w+2,y,w*2-5,1,shd(b,-.2));PR(c,cx-w-1,y,2,1,dk);PR(c,cx+w,y,2,1,dk)}
  PR(c,cx-8,17,16,1,dk);
  PR(c,cx-12,20,16,1,hi);PR(c,cx-16,24,4,6,hi);PR(c,cx+6,30,8,1,lo);PR(c,cx-4,46,12,1,lo);PR(c,cx-14,38,6,1,lo);PR(c,cx+10,52,6,1,lo);
  /* 鉱石の すじ */
  const oc=ORE[li]||'#fff';for(let i=0;i<9;i++){const h=hsh(i*71+li*5),x=cx-12+h%24,y=24+(h>>>8)%36;PR(c,x,y,1,1,(f+i*4)%14<2?'#fff':oc);if(i%3===0)PR(c,x+1,y+1,1,1,shd(oc.length===7?oc:'#ffffff',-.35))}
  PR(c,cx-19,63,38,2,shd(b,-.4))}
function draw(c){const L=layerOf(D.depth),li=Math.max(0,MINE_LAYERS.indexOf(L)),f=D.f,key=L.n;
  if(!BG||BGK!==key){BG=digBg(L,li);BGK=key}c.drawImage(BG,0,0);
  /* 深い 層の 水晶 */
  if(li>=3)for(let i=0;i<8;i++){const h=hsh(i*53+li*7),x=48+h%96,y=14+(h>>>9)%40;PR(c,x,y,1,3,li>=4?'#c49aff':'#7ad8ff');PR(c,x+1,y+1,1,2,'#e8f8ff');if((f+i*3)%12<5)PR(c,x,y-1,1,1,'#fff')}
  const sw=D.swing>0;if(D.swing>0)D.swing--;const shake=sw&&D.swing>=2&&D.swing<=3?(f%2?1:-1):0;
  const cx=99+shake,x=52,y=34,dn=sw&&D.swing<3;
  rock(c,L,li,cx,f);
  /* 岩の 中の カード: 正解の 数だけ 見えてくる */
  const cu=D.cards&&D.cards[D.cur],hv=cu&&cu.met&&!cu.dug?Math.min(3,cu.hits):0;
  if(hv){const w=[0,3,5,7][hv],h=[0,4,7,10][hv],px=cx-2-Math.floor(w/2),py=40-Math.floor(h/2);PR(c,px-1,py-1,w+2,h+2,shd(L.col[2],-.3));PR(c,px,py,w,h,'#ffe9a8');PR(c,px+1,py+1,Math.max(1,w-2),Math.max(1,h-2),'#ffd23f');if(hv>=3){PR(c,px+2,py+3,3,1,'#c08a20');PR(c,px+2,py+5,3,1,'#c08a20')}
    if(f%10<5)PR(c,px+w-1,py,1,1,'#fff')}
  /* ひび（正解で ふえる・まちがいで 一瞬） */
  const k=L.col[2],cr=Math.max(D.crack,hv);
  if(cr>=1){PR(c,cx-10,28,1,8,k);PR(c,cx-9,36,1,6,k);PR(c,cx-8,42,4,1,k)}
  if(cr>=2){PR(c,cx+6,24,1,10,k);PR(c,cx+5,34,1,8,k);PR(c,cx-6,50,8,1,k);PR(c,cx+7,42,4,1,k)}
  if(cr>=3){PR(c,cx-14,46,1,8,k);PR(c,cx+12,32,1,7,k);PR(c,cx-2,24,1,6,k)}
  /* ほる 人（ヘルメットに ランプ） */
  PR(c,x+1,y+33,14,2,'rgba(0,0,0,.35)');
  PR(c,x+3,y+20,8,5,'#3e5684');PR(c,x+4,y+25,2,5,'#3e5684');PR(c,x+8,y+25,2,5,'#3e5684');PR(c,x+3,y+30,3,2,'#5a3a22');PR(c,x+8,y+30,4,2,'#5a3a22');
  PR(c,x+3,y+11,8,9,'#e86a4a');PR(c,x+3,y+11,1,9,'#c04a32');PR(c,x+4,y+13,6,1,'#ffd23f');PR(c,x+3,y+19,8,1,'#6a4426');PR(c,x+6,y+19,2,1,'#d8b040');
  PR(c,x+6,y+10,2,1,'#f0c8b0');PR(c,x+3,y+2,8,8,'#ffe0cc');PR(c,x+3,y+2,2,6,'#7a4a2a');
  const blink=f%46<2;PR(c,x+8,y+5,1,blink?1:2,'#2a2340');PR(c,x+10,y+5,1,blink?1:2,'#2a2340');PR(c,x+9,y+8,2,1,'#c06060');PR(c,x+7,y+7,1,1,'#ffb0a0');
  PR(c,x+2,y,10,3,'#ffd23f');PR(c,x+3,y-1,8,1,'#ffd23f');PR(c,x+4,y-1,3,1,'#fff2a0');PR(c,x+2,y+2,11,1,'#d8a820');PR(c,x+11,y,2,2,'#fff8c0');
  if(dn){PR(c,x+10,y+14,3,2,'#e86a4a');PR(c,x+12,y+15,2,2,'#ffe0cc');for(let i=0;i<11;i++)PR(c,x+13+i,y+16+Math.floor(i/3),1,1,i%4?'#a8743e':'#7a5028');PR(c,x+23,y+11,2,11,'#9aa0b0');PR(c,x+22,y+10,4,2,'#c8ccd8');PR(c,x+23,y+21,2,1,'#6a6e7c')}
  else{PR(c,x+10,y+8,3,5,'#e86a4a');PR(c,x+10,y+6,2,2,'#ffe0cc');for(let i=0;i<11;i++)PR(c,x+10-Math.floor(i/4),y+5-i,1,1,i%4?'#a8743e':'#7a5028');PR(c,x+3,y-7,10,2,'#9aa0b0');PR(c,x+3,y-7,10,1,'#c8ccd8');PR(c,x+2,y-6,2,2,'#9aa0b0')}
  /* 暗さ（深い 層ほど）: ランタンと ヘッドランプの まわりだけ 明るい */
  const dk=.22+li*.09,g=c.createRadialGradient(78,40,16,78,40,108);g.addColorStop(0,'rgba(8,5,20,0)');g.addColorStop(1,`rgba(8,5,20,${dk.toFixed(2)})`);c.fillStyle=g;c.fillRect(0,0,160,80);
  /* ランタン（はりに つるす） */
  const lx=30,sw2=Math.round(Math.sin(f/10));PR(c,lx+sw2,8,1,6,'#3a2a1a');PR(c,lx-3+sw2,14,7,2,'#3a2a1a');PR(c,lx-3+sw2,16,7,7,'#ffd98a');PR(c,lx-2+sw2,17,5,5,f%7<3?'#fff2c0':'#ffe8a0');PR(c,lx-3+sw2,23,7,2,'#3a2a1a');
  glow(c,lx+sw2,19,30+(f%5),'255,200,120',.32);
  /* ヘッドランプの 光が 岩を てらす */
  c.globalCompositeOperation='lighter';c.fillStyle='rgba(255,240,180,.06)';c.beginPath();c.moveTo(x+13,y+1);c.lineTo(cx-14,22);c.lineTo(cx-10,58);c.closePath();c.fill();c.globalCompositeOperation='source-over';
  glow(c,cx-12,40,14,'255,240,180',.1);glow(c,x+12,y+1,5,'255,250,210',.5);
  if(sw&&D.swing===2){PR(c,cx-21,40,2,2,'#fff8c0');PR(c,cx-23,36,1,1,'#fff8c0');PR(c,cx-20,46,1,1,'#fff8c0');PR(c,cx-24,43,1,1,'#ffd23f')}
  D.parts=D.parts.filter(p=>{p.x+=p.vx;p.y+=p.vy;p.vy+=.5;p.l--;PR(c,p.x,p.y,2,2,p.c);return p.l>0});
  /* ほこり */
  if(sw&&D.swing===3)for(let i=0;i<3;i++)D.parts.push({x:cx-16,y:40+i*4,vx:-Math.random()*.8,vy:-.4-Math.random()*.4,l:8,c:'rgba(230,220,200,.5)'});
  if(D.flash>0){c.fillStyle=`rgba(255,246,200,${(D.flash*.09).toFixed(2)})`;c.fillRect(0,0,160,80);D.flash--}
  if(D.pop){const p=D.pop;p.t++;const yy=40-Math.min(18,p.t*2);if(p.big&&p.t%4<2){PR(c,92,yy-14,1,1,'#fff');PR(c,107,yy-10,1,1,'#fff')}if(p.t>22)D.pop=null}
}
function burst(){const L=layerOf(D.depth);for(let i=0;i<14;i++)D.parts.push({x:84,y:42,vx:(Math.random()-.4)*3.2,vy:-Math.random()*3.5,l:12+Math.random()*8,c:pickL(L.col.slice(0,2).concat(['#e8dcc0']))})}

/* ================================================================ 🪜 5まい ほりだした → 📜 お話 → ボーナス → 床が くずれて 休憩所へ */
function floorClear(){if(!D||D.falling)return;D.falling=1;const ids=D.hand.slice(),fl=D.floor;
  try{SFX.fanfare(2)}catch(e){sf('done')}
  try{const r=$('mncv').getBoundingClientRect();[0,300,600].forEach(t=>setTimeout(()=>FX.firework(r.left+r.width*(.25+Math.random()*.5),r.top+r.height*.4),t))}catch(e){}
  gotTag('🎴',`${HAND}まい ぜんぶ ほりだした！`,'');
  const M=MN();M.floors=(M.floors||0)+1;C.save();
  setTimeout(()=>{if(!D)return;
    if(window.MINE_STORY)MINE_STORY.run(ids,fl,(ok,S)=>bonus(ok,ids));else bonus(-1,ids)},1700)}
/* 📜🧩 お話の おまけ: ほった ことばに かんけいする 文の カード か パーツの カード（まだ ない ものを 先に）。 11/18 */
function storyCard(ids){const hs=ids.map(id=>(C.info(id)||{}).h).filter(h=>h&&/^[a-z]+$/.test(h));
  const P=[...new Set(C.DERIV.filter(d=>hs.includes(d.d)||hs.includes(d.b)).map(d=>'p:'+d.p))];
  const S=C.SENT.filter(x=>hs.some(h=>new RegExp('\\b'+h+'\\b','i').test(x.en))).map(x=>'s:'+x.i);
  const lv=(C.info(ids[0])||{}).lv||'es',pm=id=>{try{return SHOP.premium(id)}catch(e){return false}},nw=a=>a.filter(id=>!C.owns(id)&&!pm(id));
  const anyS=C.SENT.filter(x=>x.lv===lv).map(x=>'s:'+x.i),anyP=Object.keys(CG_PARTS).map(k=>'p:'+k);
  const wantP=Math.random()<.45;
  const np=a=>a.filter(id=>!pm(id));   // 💎 めずらしい カードは お客さんだけ（コインを ためる 目標）
  const tries=wantP?[nw(P),nw(S),nw(anyP),nw(anyS),np(P),np(S)]:[nw(S),nw(P),nw(anyS),nw(anyP),np(S),np(P)];
  const L=tries.find(a=>a.length);if(!L)return null;const id=pickL(L),isNew=!C.owns(id);C.give(id);const bk=isNew&&toBook(id);return {id,isNew,bk}}
function bonus(ok,ids){if(!D)return;const fl=D.floor,got=[];D.stories++;
  const M=MN();if(ok>=0){M.story=(M.story||0)+1;if(ok>=2)M.storyOk=(M.storyOk||0)+1}
  const nb=ok>=0&&toolN('note')>0&&takeTool('note');if(nb){D.used.push('📒');got.push(['📒','鉱夫の 手帳で ボーナス 2ばい！'])}
  const coin=(ok>=2?30+fl*10:ok===1?20+fl*5:10+fl*2)*(nb?2:1);D.coins+=coin;got.push(['🪙',`コイン ${coin}枚`]);
  if(ok>=1){const gi=Math.min(MINE_GEM.length-1,Math.floor(Math.random()*(1+fl/2))+(ok>=2?1:0)),G=MINE_GEM[gi],v=(G[2]+fl*3)*(nb?2:1);
    D.coins+=v;D.loot[G[0]]=(D.loot[G[0]]||0)+1;D.lootV[G[0]]=(D.lootV[G[0]]||0)+v;got.push([G[0],`${G[1]} +${v}枚`])}
  let tr=null;if(window.CARDS&&CARDS.find1&&Math.random()<(ok>=2?.4:ok===1?.15:0)){const g=CARDS.find1(D.depth+fl*6,trNot);tr={id:'t:'+g.c.e,isNew:g.isNew};tr.bk=toBook(tr.id);D.got.push(tr);M.cards=(M.cards||0)+1;got.push(['🎁','宝カード！'])}
  const xc=ok>=1&&Math.random()<(ok>=2?.5:.25)?storyCard(ids):null;
  if(xc){D.got.push(xc);M.cards=(M.cards||0)+1;got.push([xc.id[0]==='s'?'📜':'🧩',xc.id[0]==='s'?'文の カード！':'パーツの カード！'])}
  C.save();
  const [ex,tx]=ML(nb?'mn_note':xc&&!M.scTold&&(M.scTold=1)?'mn_storyCard':ok>=2?'mn_storyOk':ok===1?'mn_storyHalf':'mn_storyMiss',{f:fl});
  H.show('cg',`<section class="pnl cgp mnp" data-stay>
    <div class="qtop"><span></span><b>${ok>=2?'✨ ぜんぶ 読めた！':ok===1?'📜 だいたい 読めた！':'📜 お話の ボーナス'}</b><span class="qn">地下${fl}階</span></div>
    <div class="mnlol">${got.map(g=>`<div class="mnlor"><span class="gi">${g[0]}</span><span><b>${esc(g[1])}</b></span></div>`).join('')}</div>
    ${xc?`<div class="mnfc">${C.face(xc.id,{big:1,ja:1})}</div>${xc.isNew?'<p class="mnnew">NEW!</p>':''}<p class="mnbk">${xc.id[0]==='s'?'📜 お話から 文が こぼれおちた':'🧩 ことばの パーツが 見つかった'}${xc.bk?' ・ 📖 ブックへ':''}</p>`:''}
    ${tr?`<div class="mnfc" id="mntr">${C.face(tr.id,{big:1,ja:1})}</div>${tr.isNew?'<p class="mnnew">NEW!</p>':''}${tr.bk?'<p class="mnbk">📖 カードブックに 入れたよ</p>':''}`:''}
    <div class="kmina"><span class="lface">${MINA.face('m',ex)}</span><p>${tx}</p></div>
    <p class="mnlbl">ほりだした 5まい（タップで 📖）</p>
    <div class="mnhand sm">${ids.map(id=>`<div class="mnt" data-id="${esc(id)}">${C.face(id,{mini:1,marks:false})}</div>`).join('')}</div>
    <p class="mnfall">ゴゴゴ… 足もとの 床が ゆれている！</p>
    <button class="big" id="mndown">🪜 下の 階へ（休憩所で ひと休み）</button>
    <div class="row"><button class="sub" id="mnhm2">🏠 ここで 帰る</button></div></section>`);
  try{SFX.fanfare(ok>=2?3:1)}catch(e){}
  if(tr)try{const r=$('mntr').getBoundingClientRect();FX.firework(r.left+r.width/2,r.top+r.height/2)}catch(e){}
  H.panel.querySelectorAll('.mnt[data-id]').forEach(b=>b.onclick=()=>{sf('card');C.detail(b.dataset.id,null,{from:'mine'})});
  $('mnhm2').onclick=()=>{sf('back');finish('home')};
  $('mndown').onclick=()=>{sf('knock');fall(()=>{D.depth+=3;rest(ids)})}}
/* 床が くずれる 演出 */
function fall(go){const p=H.panel&&H.panel.querySelector('section');if(p){p.classList.remove('mnshake');void p.offsetWidth;p.classList.add('mnshake','mnfalling')}
  try{SFX.knock&&SFX.knock();setTimeout(()=>sf('knock'),260);setTimeout(()=>sf('pop'),620)}catch(e){}
  setTimeout(go,900)}
/* 🏕️ 休憩所（game/mine-rest.js）。 つぎの 5まいへ・帰る */
function rest(ids){if(!D)return;D.falling=0;const nf=D.floor+1;const M=MN();if(nf>(M.bestF||0)){M.bestF=nf;C.save()}
  const api={floor:nf,ids,trip:D.got.filter(g=>!/^[tsp]:/.test(g.id)).map(g=>g.id),hp:()=>D.hp,setHp:n=>{D.hp=Math.max(0,Math.min(ME_HP,n));keepHp(D.hp)},max:ME_HP,layer:()=>{const f=D.floor;D.floor=nf;const L=layerOf();D.floor=f;return L},
    dig:()=>{if(!D)return;diveScreen();newFloor();const [,tx]=ML('mn_newFloor',{f:D.floor});setTimeout(()=>{if(D&&tx)H.toast(`🪜 <b>地下${D.floor}階</b><small>${MICO()} ${esc(tx)}</small>`,3200)},500)},
    home:()=>{if(!D)return;D.floor=nf;finish('home')},used:ico=>D.used.push(ico),map:()=>{if(D)D.mapNext=1}};
  if(window.MINE_REST)MINE_REST.open(api);else api.dig()}
/* ================================================================ back home: ミオが ほった ことばを 見て ひとこと（ほった カードは もう 📖ブックに 入っている） */
function finish(why){if(!D)return;const d=D;D.alive=false;D=null;keepHp(d.hp);const M=MN(),S=(()=>{try{return SHOP.rec()}catch(e){return {}}})();
  try{C.closeOv()}catch(e){}try{if(window.MINE_REST)MINE_REST.stop()}catch(e){}
  const pb=M.best||0,pf=d.bestF0||0;
  if(d.depth>M.best)M.best=d.depth;if(d.depth>(S.best||0))S.best=d.depth;S.mined=(S.mined||0)+1;
  let mapN=null;try{if(d.floor>=2&&window.ADV&&!ADV.has()&&Math.random()<.2)mapN=ADV.give()}catch(e){}
  if(d.coins)H.addCoins(d.coins);C.save();
  const words=d.got.filter(g=>!/^[tsp]:/.test(g.id)).map(g=>g.id),extra=d.got.filter(g=>/^[sp]:/.test(g.id));
  try{RECENT.add('mine',{depth:d.depth,best:pb,fl:d.floor,bestF:pf,ok:d.ok,q:d.q,cards:d.got.map(x=>x.id),rare:d.got.some(x=>/^t:/.test(x.id)),coins:d.coins,hp:why==='hp'?'hp':'',chest:d.chests,bad:d.bads.length,badN:d.bads[0]||'',used:d.used.slice(0,4),story:d.stories})}catch(e){}
  const head=why==='hp'?'⛏️ つかれたので 帰ってきた':'🎒 もちかえった';
  const mio=window.MIO&&window.MINE_MIO_SEE;
  const bkN=d.got.filter(g=>g.bk).length;
  d.seed=Math.random()*1e6|0;
  const draw=()=>{H.show('cg',`<section class="pnl cgp mnp">
    <div class="qtop"><button class="x" id="mnb" aria-label="もどる">←</button><b>${head}</b><span class="qn">地下${d.floor}階</span></div>
    <div class="mnres"><p>🪜 <b>地下${d.floor}階</b> まで${d.floor>pf?' <em class="mnbest">最高記録！</em>':''} ・ ${d.q}問中 <b>${d.ok}</b>問 正解</p>
      <p>${d.coins?`🪙 +${d.coins}`:''} ${d.got.length?`🎴 カード ${d.got.length}まい`:''} ${d.events.map(e=>e.ico).join('')}</p>${mapN?`<p class="mnmap">🗺️ 岩の すきまに 古い 宝の地図！「${esc(mapN)}」 <button id="mnmapgo" class="sub">宝探しに 行く</button></p>`:''}</div>
    ${mio&&words.length?`<div class="kmina mnmio"><span class="lface">${MIO.face('smile')}</span><p>${esc(MINE_MIO_SEE.hi(words.length))}${bkN?`<br>${esc(MINE_MIO_SEE.bk(bkN))}`:''}</p></div>`:''}
    ${words.length?`<div class="mnsee">${words.map((id,wi)=>{const I=C.info(id),g=d.got.find(x=>x.id===id)||{};return `<div class="mnseer ${g.bk?'on':''}"><button class="mnseec" data-id="${esc(id)}">${C.face(id,{mini:1,marks:false})}</button>
      <div class="mnseet">${mio?`<p class="mnmio1" data-en="${esc(I.en)}">🧑‍🎓 ${esc(MINE_MIO_SEE.line(I,d.seed+wi))}</p>`:''}<small class="mnbkt">${g.bk?'📖 カードブックに 入れたよ':'🗃️ 倉庫に 入れたよ（もう ブックに あるので 売れるよ）'}</small></div></div>`}).join('')}</div>
      ${extra.length?`<p class="mnlbl">📜🧩 お話の おまけ</p><div class="mnhand sm">${extra.map(g=>`<div class="mnt" data-id="${esc(g.id)}">${C.face(g.id,{mini:1,marks:false})}</div>`).join('')}</div>`:''}
      ${bkN?'<p class="note">📖 ブックに 入った カードは 📦仕入れで 問題に 答えると お店に 入荷するよ</p>':''}`:'<p class="note">きょうは カードを ほりだせなかったね。 つぎは きっと！</p>'}
    ${why==='hp'&&window.FOOD?`<p class="note">❤は 2分で 1 もどるよ。 🍽️ しおかぜ食堂か 🥪 もちものの 食べ物で いっきに 回復！</p><div class="row"><button id="mndin" class="sub">🍽️ 食堂へ</button></div>`:''}
    <div class="row">${bkN?'<button id="mnbook" class="sub">📖 ブックで 見る</button>':''}<button id="mnshop" class="big">🃏 お店に もどる</button></div></section>`);
    if($('mndin'))$('mndin').onclick=()=>{sf('open');FOOD.open()};
    $('mnb').onclick=$('mnshop').onclick=()=>{sf('step');SHOP.open()};
    if($('mnbook'))$('mnbook').onclick=()=>{sf('flip');try{CBOOK.open(null,null,()=>SHOP.open())}catch(e){SHOP.open()}};
    if($('mnmapgo'))$('mnmapgo').onclick=()=>{try{SFX.map()}catch(e){}ADV.open()};
    H.panel.querySelectorAll('.mnseec,.mnt[data-id]').forEach(b=>b.onclick=()=>{sf('card');C.detail(b.dataset.id,null,{from:'mine'})});
    H.panel.querySelectorAll('.mnmio1').forEach(b=>b.onclick=()=>{try{MIO.say(b.dataset.en)}catch(e){}})};
  draw();
  sf(d.floor>pf&&d.floor>=2?'done':'step');
  setTimeout(()=>{try{if(window.MINA&&MINA.canAnnounce&&MINA.canAnnounce()){const bt=bkN&&!M.bkTold;if(bt){M.bkTold=1;C.save()}const [ex,tx]=ML(bt?'mn_autoBook':d.floor>pf&&d.floor>=2?'mn_bestFloor':'sh_mineEnd',{n:d.q,d:d.depth,f:d.floor});MINA.say('m',ex,tx,7000)}}catch(e){}},900)}
H.on('home',()=>{if(D){D.alive=false;keepHp(D.hp);if(D.coins)H.addCoins(D.coins);D=null;C.save()}try{if(window.MINE_REST)MINE_REST.stop()}catch(e){}});
/* ================================================================ ミナ先生の セリフ */
Object.assign(MINA_LINES,{
 mn_v2:[['wow','鉱山が 新しく なったよ！ 岩の 中に まだ 持っていない カードが 5まい ねむってるの。 ぜんぶ ほりだしたら 床が くずれて 下の 階へ！'],['point','こんどの 鉱山は 一階ずつ 下りていくの。 5まい ほりだすと 小さな お話が 出てきて、 下の 階には 休憩所も あるよ']],
 mn_open:[['smile','岩の 中の 5まいは ランダムだよ。 どんな ことばに 会えるかな？'],['point','知っている ことばは すぐ ほれるし、 むずかしい ことばは 何回か かかるの。 あせらないでね'],['happy','下の 階ほど 上の レベルの ことばが まざるよ。 最高は 地下{f}階。 きょうは どこまで 行けるかな？'],['wink','まちがえても だいじょうぶ。 ほりだすまで 何回でも 出てくるから、 そのたびに おぼえられるよ'],['smile','5まい ほりだしたら 休憩所で ひと休み できるよ。 たき火、 あったかいんだ']],
 mn_digOnly:[['point','カードは ここで ほって ゲットする ものに なったよ。 授業や 単語帳では もう くばらないの。 そのぶん ほりだした 1まいは とくべつだよ'],['smile','カードが ほしく なったら 鉱山へ！ 岩の 中の 5まいを ほりだすと、 ちゃんと きみの ものに なるよ']],
 mn_intro:[['smile','はじめての ことばは、 1周目は 見て おぼえるだけで いいよ。 ほるのは 2周目から！'],['happy','まずは 5まいと あいさつ。 声に 出して 読んで おぼえたら つぎへ。 もう一度 会ったら 問題で ほるよ'],['point','「{w}」は はじめて？ 🔊で 聞いて、 まねして 言ってみて。 それから ほりはじめよう']],
 mn_dug:[['wow','「{w}」 ほりだした！ もう きみの カードだよ。 そのまま 📖カードブックに 入るの'],['happy','1まい ゲット！ のこりも この ちょうしで。 ほりだした カードは タップで 📖 くわしく 見られるよ']],
 mn_story:[['smile','岩の 奥から 文が 出てきたよ。 太字が さっき ほりだした ことば。 1行ずつ タップすると 読むね'],['point','わからない 行は 🇯🇵 で 日本語も 見ていいよ。 さっきの ことばが 文の 中で どう 使われてるか 見てみて'],['happy','ほりだした ことばが ぜんぶ 入った お話。 読めたら ボーナスだよ！']],
 mn_storyOk:[['proud','ぜんぶ 読めたね！ ことばを 文の 中で わかるのが ほんとうの 力だよ'],['wow','すごい！ さっき ほった ことばで もう 英文が 読めるなんて。 Great reading!'],['love','読めた！ 単語だけじゃなく 文で わかると、 ぐっと わすれにくく なるの']],
 mn_storyHalf:[['smile','だいたい 読めたね！ まちがえた 文は もう一回 声に 出して 読んでみよう'],['happy','半分 読めたら 十分！ つぎの お話は もっと 読めるよ']],
 mn_storyMiss:[['smile','むずかしかったね。 でも 読もうと した だけで ちゃんと 力に なってるよ。 ボーナスも 少し あるからね'],['wink','お話は ちょっと 背のびでも いいの。 さっきの 解説の 文を 声に 出して 読むと いいよ']],
 mn_newFloor:[['point','地下{f}階！ 新しい 5まいが 岩の 中に ねむってるよ'],['smile','下の 階に 来たね。 少し むずかしい ことばも まざってくるよ'],['wow','ここは 地下{f}階。 深く なるほど 宝石も 高く なるよ！']],
 mn_storyCard:[['wow','お話の おまけで カードが 出たね！ 📜 文の カードは 英文まるごと、 🧩 パーツの カードは ことばの 部品だよ'],['point','🧩 パーツの カードは un- や -ful みたいな 部品。 知っていると はじめての 単語も 意味が 読めるの'],['smile','📜 文の カードは 声に 出して 読んでみて。 ほった ことばが 文の 中で 生きてるよ']],
 mn_autoBook:[['point','ほりだした カードは、 自動で 📖カードブックに 入るように なったよ。 ブックの カードは 📦仕入れの 問題で お店に とどくの'],['happy','鉱山で ほる → ブックに 入る → 仕入れの 問題で 入荷 → お店で 売る。 これが カードショップの 道だよ']],
 mn_bestFloor:[['wow','おかえり！ 地下{f}階まで 下りたの！？ 最高記録だね！'],['proud','地下{f}階！ 一階ずつ ことばを ほりだして ここまで。 ほんとに えらいよ'],['love','おかえり。 地下{f}階まで 行けたんだね。 ほりだした カード、 あとで いっしょに 見ようね']],
 sh_mineEnd:[['happy','おかえり！ {n}問 ほって、 地下{f}階まで 行ったんだね'],['smile','おつかれさま。 ほりだした カードは 📖カードブックに 入ってるよ。 📦仕入れの 問題で お店に 入荷するからね'],['proud','{n}問 がんばったね。 ミオちゃんに ほった カード、 見せてあげた？']],
 mn_card:[['wow','「{w}」の カード、 見つけたね！ 見つけた カードは 🎒の 🎴に たまるから、 タップで 読んで くわしく 見てね'],['smile','カードが 出たら 上に 札が 出るよ。 タップすると 「{w}」を 読んで くわしく 見られるの。 見のがしても 🎒の 🎴から 見られるからね']],
 mn_treasure:[['wow','🎁 宝カード！？ 鉱山の 奥で 見つかるなんて… すごい 運だね！'],['proud','宝カードは 仕入れでは 手に 入らない、 鉱山だけの 宝もの。 深く 下りるほど いい カードが 出やすいよ'],['love','宝カードだ！ はじめての 1まいは カードブックへ。 ダブったら お店で 売れるからね']],
 mn_lootTap:[['smile','🎒の ところに ならんだ 物は、 タップすると くわしく 見られるよ。 宝石の 英語の 名前も わかるの'],['happy','手に 入れた 石や カードは、 タップで くわしく！ ほっている とちゅうでも だいじょうぶ']],
 mn_handTap:[['point','ならんだ 岩の カードは、 会った ことばなら タップで 📖 くわしく 見られるよ。 いみ・例文・形の かわり方も！'],['smile','わからない ことばが あったら、 岩の カードを タップしてね。 いま 出ている 問題の カードは 答えてからね']],
 mn_handWait:[['wink','その カードは いま 問題に 出ているの。 答えてから 見ようね'],['smile','あっ、 それを 見たら 答えが わかっちゃう！ 答えたら すぐ 📖 で 見られるよ'],['think','まずは 自分で 考えて みよう。 まちがえても だいじょうぶ、 あとで くわしく 見られるから']],
 mn_handLook:[['happy','「{w}」を くわしく 見たんだね。 例文を 声に 出すと もっと おぼえるよ'],['proud','気に なったら すぐ しらべる。 それ、 英語が のびる 人の くせなの'],['smile','📖 の 例文は 🔊 で 聞けるよ。 まねして 言ってみてね']],
 mn_lookRow:[['point','まちがえた ときは 「📖 しらべる」で、 答えの ことばも まよった ことばも くわしく 見られるよ'],['smile','まちがえた ことばこそ チャンス！ 📖 で なかまの ことばや 例文も 見てみよう']],
 x_mnType:[['think','鉱山の 「つづりを 書く」は むずかしい？ ヒントで さいしょの 字が わかるよ'],['smile','聞いて 書けたら、 もう その 単語は きみの もの']]
});
if(window.MINA_SENSE&&MINA_SENSE._rules)MINA_SENSE._rules.push(
 ['x_mnType',1,()=>{try{return SHOP.rec().met&&MN().dives>0?{}:null}catch(e){return null}},()=>['⛏️ 鉱山へ',()=>{CG.open();setTimeout(open,60)}]],
 ['x_mnTool',1,()=>{try{return MN().dives>1&&!MN().toolBuy&&!toolList().length&&window.ZAKKA?{}:null}catch(e){return null}},()=>['🏚️ 雑貨屋へ',()=>ZAKKA.open('tool')]]);

window.MINE={pick:pickFloor,need:needOf,takeTool,open,rec:MN,course,addTool,toolN,toolList,bagRows,goMine,tools:MINE_TOOLS,floor:()=>D?D.floor:0};
})();

/* 11/18 ほる 問題を ふやした・3問目は 🧩 ならべかえ */
Object.assign(MINA_LINES,{
 mn_moreQ:[['point','鉱山の 問題を 少し ふやしたよ。 1まいの カードと たくさん 会えるほど、 ちゃんと 頭に のこるの。 3問目は 🧩 ならべかえだよ'],['happy','おしらせ！ ほる 問題が ふえたよ。 和訳 → 英語で → 🧩 ならべかえ の じゅんばん。 ならべかえは いちばん つづりが 手に のこるんだ']],
 mn_scramble:[['point','🧩 ならべかえ だよ。 声に 出しながら 1文字ずつ ならべると、 つづりと 音が いっしょに おぼえられるの'],['smile','ならべかえは 「音 → 文字」を 自分で 組み立てるから よく おぼえるんだよ。 こまったら 💡 で 1文字目が 見えるよ']],
 mn_scrOk:[['proud','「{w}」 ならべられたね！ 自分で 組み立てた つづりは なかなか わすれないよ'],['happy','ならべかえ、 どんどん はやく なってるね。 "Practice makes perfect!"'],['wow','つづり、 ばっちり！ 指が おぼえてきたね']]});
