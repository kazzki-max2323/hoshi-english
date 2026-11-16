/* ⛏️ 単語の 鉱山: 5まいの 単語カードを 左から じゅんばんに 練習して ほりすすむ（カードを えらんだり 持ちかえたり しない）
   - 練習の 形は コースで きまっている（どれも 1周ずつで つぎの 形へ）: 和訳 → スペルの ならべかえ → 英語で → 聞きとり → 正しい つづり → ならべかえ → ぬけた 文字 → 例文 あなうめ → 書く → 聞いて 書く → そのあとは まぜて ずっと
     1周 = 5まいを 左から 1回ずつ。 まちがえた カードは その 周の さいごに もう一回 出る（苦手ほど たくさん 練習）
   - 体力（❤）が あるのは 自分だけ。 1問で 1 へる。 0に なっても 見つけた 物は ぜんぶ 持ち帰れる
     体力は 鉱山の 外でも のこり、 時間で 少しずつ もどる。 食べると たくさん もどる（game/food.js の FOOD）
   - 正解で 1m ほれる。 深い 層ほど 宝石が 高く、 見つかる カードも むずかしく なる
   - 見つかる 物: 宝石（コイン）・イベント・単語カード（1回で 平均 5まい くらい。 ほりながら 上に 小さく 出て、 タップで 📖）・🎁宝カード（大きな お祝い）
   - いい カード（🎁宝カード・ハイレベルの 単語）は 鉱山でしか 見つからない。 仕入れの パックには 入らない（11/16）
     宝カードは 深いほど R・SR・SSR・UR が 出やすい（CARDS.find1(深さ)）
   - 🎒 つかう: ほっている とちゅうに もちものの 食べ物（❤回復）と 鉱山の 道具（雑貨屋の ⛏️ たなで 買う）を つかえる
   - 📦 宝箱: たまに 出る。 🗝️ かぎ か 英語の 合言葉（いまの 5まいの 単語）で あける。 まちがえても 少しは 入っている
   - 悪い できごと: 8m より 深いと たまに（落石・かたい 岩盤・コウモリ…）。 もどされたり ほれなく なるだけで、 見つけた 物は 取られない。 ⛑️ ヘルメットで 1回 ふせげる
   - 🔀 入れかえ: とちゅうで 5まいを ぜんぶ 入れかえられる（新しい 5まいは コースの はじめ＝和訳から）
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
const P_EVENT=.04,P_WORD=.029,P_TREASURE=.015,P_GEM=.2,P_CHEST=.016;
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
  return L.map(t=>row(t.ico,`${esc(t.n)} <small>×${toolN(t.id)}</small>`,`⛏️ 鉱山で つかう・${esc(t.s)}`,'<button data-mine="1">⛏️ 鉱山へ</button>'))}
const goMine=()=>{try{CG.open();setTimeout(open,60)}catch(e){}};   // 11/15 に 3倍 → 11/16 に 下げて 元の 約1.7倍（平均 2.9→8.5→約5まい/回）。 宝カードは 鉱山だけなので 少し 多め

/* ================================================================ コース（練習の 形の じゅんばん） */
const COURSE=[
 {t:'mean',n:'和訳',ico:'🇯🇵',laps:1},
 {t:'scramble',n:'ならべかえ',ico:'🧩',laps:1},
 {t:'rev',n:'英語で',ico:'🔤',laps:1},
 {t:'listen',n:'聞きとり',ico:'👂',laps:1,snd:1},
 {t:'spell',n:'正しい つづり',ico:'🔍',laps:1},
 {t:'scramble',n:'ならべかえ',ico:'🧩',laps:1},
 {t:'miss',n:'ぬけた 文字',ico:'🕳️',laps:1},
 {t:'fill',n:'例文 あなうめ',ico:'📝',laps:1},
 {t:'type',n:'つづりを 書く',ico:'✍️',laps:1},
 {t:'dict',n:'聞いて 書く',ico:'🎧',laps:1,snd:1}];
const MIX={t:'mix',n:'まぜて 復習',ico:'🌀',laps:99};
/* 書く 問題（打ちこむ 形）は 出さない ことも できる（スマホで 打つのが 大変な とき。 MN().noType に 覚える） */
const TYPING=['type','dict'];
const noType=()=>!!MN().noType;
const course=()=>COURSE.filter(s=>(!s.snd||ST.sound)&&!(noType()&&TYPING.includes(s.t)));
const QN={mean:'いみは？',rev:'英語で いうと？',listen:'聞こえた ことばは？',spell:'正しい つづりは？',scramble:'つづりを ならべて',miss:'ぬけた 文字は？',fill:'あなうめ',type:'つづりを 書こう',dict:'聞こえた 単語を 書こう'};

/* ================================================================ 5まいを えらぶ（自動）: 苦手 → わすれかけ → まだ おぼえていない */
const tools=()=>{try{return SHOP.allCards().filter(id=>{const I=C.info(id);return I&&I.k==='w'})}catch(e){return []}};
/* 11/16 ユーザー「5まいが 同じのばかり」: 苦手の 点を 小さく・くじ運を 大きく、 さいきん 鉱山で 使った カードは 出にくく、 苦手は 5まい中 2まいまで */
const usedRecently=()=>{const M=MN();return M.hands||(M.hands=[])};
function noteHand(h){const L=usedRecently();L.unshift(h.slice());L.splice(6);C.save()}
function pickHand(all,extraNot=[]){const L=usedRecently(),pen=id=>{const i=L.findIndex(h=>h.includes(id));return i<0?0:i<2?90:i<4?50:25};
  const score=id=>(C.weak(id)?30:0)+(C.forgot(id)?20:0)+(6-C.star(id))*4+Math.random()*60-pen(id)-(extraNot.includes(id)?200:0);
  const sorted=all.slice().sort((a,b)=>score(b)-score(a)),out=[];let wk=0;
  for(const id of sorted){if(out.length>=HAND)break;const w=C.weak(id);if(w&&wk>=2)continue;if(w)wk++;out.push(id)}
  for(const id of sorted){if(out.length>=HAND)break;if(!out.includes(id))out.push(id)}
  return out}
function autoHand(){return pickHand(tools())}
let hand=null;
function open(){const M=MN();if(!hand||hand.some(id=>!C.owns(id)))hand=autoHand();
  const TLs=toolList();let mk=myHp()<20&&window.FOOD?'fd_tired':'mn_course';
  if(mk==='mn_course'){if(!M.itemTold){M.itemTold=1;C.save();mk='mn_itemsNew'}else if(Math.random()<.35)mk=TLs.length?'mn_tools':'mn_noTools'}
  const [ex,tx]=ML(mk);
  H.show('cg',`<section class="pnl cgp shp mnp">
    <div class="qtop"><button class="x" id="mnb" aria-label="もどる">←</button><b>⛏️ 単語の 鉱山</b><span class="qn">${M.best?`最高 ${M.best}m`:''}</span></div>
    <div class="kmina"><span class="lface">${MINA.face('m',ex)}</span><p>${tx}</p></div>
    ${window.FOOD?FOOD.mineBox():''}
    ${TLs.length?`<p class="mntl">🎒 ${TLs.map(t=>`${t.ico}<b>×${toolN(t.id)}</b>`).join(' ')} <small>ほっている とちゅうに つかえる</small></p>`:''}
    <p class="mnlbl">きょうの 5まい（左から じゅんばん）</p>
    <div class="mnhand">${hand.map(id=>`<div class="mnt" data-id="${esc(id)}">${C.face(id,{mini:1,marks:false})}</div>`).join('')}${'<div class="mnt empty"></div>'.repeat(Math.max(0,HAND-hand.length))}</div>
    <button id="mnre" class="sub">🔀 ほかの 5まいに する</button>
    <button id="mnty" class="sub">✍️ 書く 問題: <b>${noType()?'出さない':'出す'}</b></button>
    <details class="shmore"><summary>練習の コース（${course().length}つの 形）</summary>
      <ol class="mncs">${course().map(s=>`<li>${s.ico} ${esc(s.n)}</li>`).join('')}<li>${MIX.ico} ${MIX.n}<small>ずっと</small></li></ol>
      <p class="note">1周 ＝ 5まいを 左から 1回ずつ。 1周ごとに つぎの 形へ。 まちがえた カードは その 周の さいごに もう一回。 ❤は 最大 ${ME_HP}（1問で 1 へる・2分で 1 もどる・食べると たくさん もどる）</p></details>
    <button id="mngo" class="big" ${hand.length&&myHp()>0?'':'disabled'}>⛏️ ほりに いく${myHp()<ME_HP?` <small>❤${myHp()}</small>`:''}</button>
  </section>`);
  $('mnb').onclick=()=>{sf('back');SHOP.open()};
  $('mnty').onclick=()=>{sf('tap');const M=MN();M.noType=!M.noType;C.save();H.toast(M.noType?'✍️ 書く 問題は 出さないよ<small>また 書きたく なったら ここで もどせるよ</small>':'✍️ 書く 問題も 出すよ',2400);open()};
  $('mnre').onclick=()=>{sf('flip'in SFX?'flip':'tap');const old=hand.slice();let k=0;do{hand=autoHand()}while(k++<5&&hand.join()===old.join());open()};
  H.panel.querySelectorAll('.mnt[data-id]').forEach(b=>b.onclick=()=>{sf('card');C.detail(b.dataset.id)});
  if(window.FOOD)FOOD.mineBind(open);
  $('mngo').onclick=()=>{if(!hand.length||myHp()<1)return;sf('open');dive(hand.slice())}}

/* ================================================================ the dive */
let D=null;
const layerOf=d=>{let L=MINE_LAYERS[0];MINE_LAYERS.forEach(x=>{if(d>=x.at)L=x});return L};
const stageOf=i=>course()[i]||MIX;
function dive(cards){try{SHOP.leave()}catch(e){}
  const M=MN();M.dives++;noteHand(cards);C.save();
  D={hand:cards,st:0,lap:0,queue:[],redo:[],redone:{},cur:-1,depth:0,hp:myHp(),q:0,ok:0,got:[],coins:0,events:[],words:{},crack:0,luck:0,alive:true,f:0,parts:[],pop:null,swing:0,loot:{},lootV:{},
    fx:{mag:0,comp:0,gold:0,guard:0},hard:0,dark:0,chests:0,bads:[],used:[],swaps:0,lowTold:0,badTold:0};
  startLap();
  H.show('cg',`<section class="pnl cgp mnp mnd" data-stay>
    <div class="qtop"><button class="x" id="mnx" aria-label="もちかえる">←</button><b id="mnl">⛏️ 0m</b><span class="qn" id="mnh"></span></div>
    <div class="mnstage"><canvas id="mncv" width="160" height="80"></canvas><span class="mndep" id="mndep">0m</span><div class="mngot" id="mngot"></div><div class="mncard" id="mncard"></div></div>
    <div class="mnloot" id="mnloot"></div>
    <p class="mnst" id="mnst"></p>
    <div class="mnhand sm" id="mnhd"></div>
    <div id="mnq"></div>
    <div class="row mndrow"><button id="mnuse" class="sub">🎒 つかう</button><button id="mnswap" class="sub">🔀 入れかえ</button><button id="mnhome" class="sub">🏠 もちかえる</button></div></section>`);
  $('mnx').onclick=$('mnhome').onclick=()=>{sf('back');finish('home')};
  $('mnuse').onclick=()=>{sf('open');useMenu()};
  $('mnswap').onclick=()=>{sf('open');swapAsk()};
  const cv=$('mncv'),c=cv.getContext('2d');c.imageSmoothingEnabled=false;let last=0;
  const tick=now=>{if(!D||!D.alive||!cv.isConnected){if(D)D.alive=false;return}requestAnimationFrame(tick);if(now-last<90)return;last=now;D.f++;draw(c)};
  requestAnimationFrame(tick);
  next()}
function startLap(){D.queue=D.hand.map((_,i)=>i);D.redo=[];D.redone={}}
function hud(){if(!D)return;const L=layerOf(D.depth),S=stageOf(D.st);$('mnl').textContent=`⛏️ ${D.depth}m ・ ${L.n}`;
  $('mnh').innerHTML=`<span class="mnme"><b style="width:${D.hp/ME_HP*100}%"></b></span> ❤${D.hp}`;
  const lo=Object.entries(D.loot).map(([ico,n])=>`${ico}${n>1?`×${n}`:''}`).join(' '),cd=D.got.length;
  const dp=$('mndep');if(dp)dp.textContent=D.depth+'m';void lo;
  const lb=$('mnloot');lb.innerHTML=D.coins||cd||D.events.length||Object.keys(D.loot).length?`<button data-lo="coin">🎒 <b>${D.coins}枚</b></button>${Object.entries(D.loot).map(([ico,n])=>`<button data-lo="g" data-ico="${ico}">${ico}${n>1?`<b>×${n}</b>`:''}</button>`).join('')}${cd?`<button data-lo="cards">🎴<b>×${cd}</b></button>`:''}${D.events.length?`<button data-lo="ev">✨<b>×${D.events.length}</b></button>`:''}`:'<span class="mnnone">🎒 まだ なにも ない</span>';
  lb.querySelectorAll('[data-lo]').forEach(b=>b.onclick=()=>lootInfo(b.dataset.lo,b.dataset.ico));
  if(lb.querySelector('[data-lo]')&&!MN().lootTold){MN().lootTold=1;C.save();setTimeout(()=>{const [,tx]=ML('mn_lootTap');H.toast(`👩‍🏫 <b>ミナ先生</b><small>${esc(tx)}</small>`,4200)},2200)}
  const fx=[[D.luck>0,'🔦',D.luck],[D.fx.mag>0,'🔍',D.fx.mag],[D.fx.comp>0,'🧭',D.fx.comp],[D.fx.gold>0,'⛏️',D.fx.gold],[D.fx.guard>0,'⛑️',D.fx.guard],[D.hard>0,'🧱',D.hard],[D.dark>0,'🌑',D.dark]].filter(x=>x[0]);
  $('mnst').innerHTML=`${S.ico} <b>${esc(S.n)}</b>${D.inRedo?' <em>もう一回</em>':''}${fx.length?`<span class="mnfx">${fx.map(x=>`<i>${x[1]}${x[2]}</i>`).join('')}</span>`:''}`;
  const ub=$('mnuse');if(ub)ub.innerHTML=`🎒 つかう${useN()?` <small>${useN()}</small>`:''}`;
  $('mnhd').innerHTML=D.hand.map((id,i)=>`<div class="mnt ${i===D.cur?'on':''} ${D.queue.includes(i)||D.redo.includes(i)||i===D.cur?'':'done'}">${C.face(id,{mini:1,marks:false})}</div>`).join('')}
/* つぎの 問題: 左から じゅんばん → まちがえた カード → つぎの 周 → つぎの 形 */
function next(){if(!D)return;
  if(D.hp<=0)return finish('hp');
  D.inRedo=false;
  if(!D.queue.length&&D.redo.length){D.queue=D.redo.slice();D.redo=[];D.queue.forEach(i=>D.redone[i]=1)}
  if(!D.queue.length){D.lap++;const S=stageOf(D.st);
    if(D.lap>=S.laps){D.st++;D.lap=0;const N=stageOf(D.st);
      setTimeout(()=>{if(!D)return;sf('chime'in SFX?'chime':'pop');H.toast(`${N.ico} つぎは <b>${esc(N.n)}</b>${N===MIX?'（ここからは まぜて 復習）':''}`,2400)},150)}
    startLap()}
  D.cur=D.queue.shift();D.inRedo=!!D.redone[D.cur];
  const id=D.hand[D.cur],I=C.info(id),S=stageOf(D.st),L=layerOf(D.depth);
  let t=S.t;if(t==='mix'){const all=course().map(s=>s.t);t=pickL(all.filter(x=>x!==D.lastT))||'mean'}D.lastT=t;
  hud();
  const box=$('mnq');D.busy=false;
  const done=r=>after(id,r.ok);const tag=`${S.ico} ${S.n}`;
  const q=make(t,I);
  if(typeof q==='function')return q(box,done,tag);
  C.ask(box,q,done,{tag})}
/* 形ごとの 問題を つくる（できない 単語は にた 形に） */
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
      e.innerHTML=`<p>正しくは <b>${esc(w)}</b>（${esc(I.ja)}）<br><small>きみの 答え: ${esc(v)}　/　${esc(w.split('').join(' - '))}</small></p><button class="nx">つぎへ ▶</button>`;sayW(I);
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
        if(ok){sf('correct');sayW(I);box.querySelector('.mnw').classList.add('ok');setTimeout(()=>done({ok:true}),750)}
        else{sf('wrong');box.querySelector('.mnw').classList.add('ng');const e=box.querySelector('.cgqx');e.hidden=false;
          e.innerHTML=`<p>正しくは <b>${esc(w)}</b>（${esc(I.ja)}）<br><small>${esc(w.split('').join(' - '))} と 声に 出して おぼえよう</small></p><button class="nx">つぎへ ▶</button>`;sayW(I);
          e.querySelector('.nx').onclick=()=>{sf('step');done({ok:false})}}})};
    draw()}}
/* 例文の あなうめ（文カードの 例文から） */
function sentQ(I){const h=I.h;if(!/^[a-z]+$/.test(h))return null;const re=new RegExp('\\b'+h+'\\b','i');
  const ss=C.SENT.filter(s=>re.test(s.en));if(!ss.length)return null;const s=pickL(ss);
  const blank=s.en.replace(re,'＿＿＿');const ws=H.shuffle(C.W.filter(c=>c.lv===I.lv&&c.h!==h&&/^[a-z]+$/.test(c.h))).slice(0,3).map(c=>c.h);
  const ch=H.shuffle([h,...ws]);
  return {t:'fill',I,q:`<span class="qen">${esc(blank)}</span><span class="qja">${esc(s.ja)}</span>`,ch,ans:ch.indexOf(h),hint:`いみは「${esc(I.ja)}」`,
    tip:`<b>${esc(s.en)}</b><br>${esc(s.ja)}<br><small>${esc(I.en)} ＝ ${esc(I.ja)}。 文ごと 声に 出すと おぼえやすいよ</small>`,say:[s.lv,s.en]}}
/* after an answer */
/* 書く 問題を とばす: 体力も へらさず、 まちがいにも しない。 all なら このあとも 出さない */
function skip(all){if(!D||D.busy)return;D.busy=true;sf('step');
  if(all){const M=MN();M.noType=true;C.save();D.lap=0;startLap();H.toast('✍️ 書く 問題は 出さないよ<small>鉱山の 入口で もどせるよ</small>',2600)}
  setTimeout(()=>next(),150)}
function after(id,ok){if(!D||D.busy)return;D.busy=true;D.q++;D.hp--;keepHp(D.hp);C.record(id,ok);const w=D.words[id]||(D.words[id]=[0,0]);w[ok?0:1]++;
  const M=MN();M.q++;if(ok)M.ok++;
  if(!ok&&!D.redone[D.cur]&&!D.redo.includes(D.cur))D.redo.push(D.cur);
  ['mag','comp'].forEach(k=>{if(D.fx[k]>0)D.fx[k]--});
  if(D.hp>0&&D.hp<=12&&!D.lowTold&&window.FOOD&&FOOD.bagList().length){D.lowTold=1;setTimeout(()=>{if(!D)return;const [,tx]=ML('mn_lowHp');H.toast(`👩‍🏫 <b>ミナ先生</b><small>${esc(tx)}</small>`,4200)},900)}
  if(ok){D.ok++;D.swing=6;sf('tap');setTimeout(()=>{if(!D)return;D.crack=0;
      if(D.hard>0){D.hard--;D.crack=2;sf('knock');gotTag('🧱','カチン！ ほれない',D.hard?`あと ${D.hard}`:'')}
      else{const g=D.fx.gold>0;if(g)D.fx.gold--;D.depth+=g?2:1;burst();sf('knock')}
      const big=find();C.save();hud();if(!big)setTimeout(()=>next(),D.pop?650:450)},420);}
  else{D.swing=6;D.crack=Math.min(2,D.crack+1);setTimeout(()=>{sf('tap')},300);C.save();hud();setTimeout(()=>next(),200)}}
/* what you find. カードは めったに 出ない（出たら 大きな お祝い）。 true を かえすと お祝いの あとで つぎへ */
function find(){const L=layerOf(D.depth),r=Math.random(),lk=D.luck>0?.12:0;if(D.luck>0)D.luck--;const dk=D.dark>0;if(dk)D.dark--;
  /* 📦 宝箱（🧭で 出やすい）と 悪い できごと（深いほど）は 先に きめる */
  if(Math.random()<P_CHEST+(D.fx.comp>0?.035:0))return chest();
  if(Math.random()<pBad(D.depth))return bad();
  const deep=Math.min(.02,D.depth*1.7/5000);   // 深いほど 少しだけ 出やすい
  if(r<P_TREASURE+deep/2&&window.CARDS&&CARDS.find1){const g=CARDS.find1(D.depth);const id='t:'+g.c.e;D.got.push({id,isNew:g.isNew});return celebrate(id,g.isNew,true)}
  const mg=D.fx.mag>0?P_WORD*1.5:0;   // 🔍 虫めがね: カードが 2.5倍
  if(r<P_TREASURE+P_WORD+deep+mg){const lv=pickL(L.lv),pool=C.W.filter(c=>c.lv===lv),fresh=pool.filter(c=>!C.owns(c.id));const c=pickL(fresh.length&&Math.random()<.85?fresh:pool);
    const isNew=!C.owns(c.id);C.give(c.id);D.got.push({id:c.id,isNew});cardTag(c.id,isNew);return false}
  if(r<P_TREASURE+P_WORD+deep+mg+P_EVENT+(D.fx.comp>0?.02:0)){const E=pickL(MINE_EVENT);D.events.push(E);
    if(E.hp){D.hp=Math.min(ME_HP,D.hp+E.hp);keepHp(D.hp)}if(E.deep)D.depth+=E.deep;if(E.luck)D.luck+=E.luck;if(E.coin)D.coins+=E.coin;
    let tx=E.t;if(E.tool){const id=pickL(['lamp','lamp','rope','rope','helmet','mag','comp']);addTool(id);tx+=` ${MINE_TOOLS[id].ico} ${MINE_TOOLS[id].n}`}
    D.pop={ico:E.ico,t:0,big:1};fly(E.ico);gotTag(E.ico,E.n,E.coin?`+${E.coin}枚`:'');sf('hey');H.toast(`${E.ico} <b>${esc(E.n)}</b><small>${esc(tx)}</small>`,3600);hud();return false}
  if(!dk&&r<P_TREASURE+P_WORD+deep+mg+P_EVENT+P_GEM+lk){const gi=Math.min(MINE_GEM.length-1,Math.floor(Math.random()*(2+D.depth/12))),G=MINE_GEM[gi];const v=G[2]+Math.floor(D.depth/5);
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
      ${I[3]?`<p class="mnlot"><b>${I[2]==='Mio'?'🧑‍🎓 ミオ':'👩‍🏫 ミナ先生'}</b> ${esc(I[3])}</p>`:''}${back}</div>`}
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
  o.querySelectorAll('.mnloci').forEach(b=>b.onclick=()=>{sf('card');C.detail(b.dataset.id,()=>lootInfo('cards'))})}
/* 手に 入れた 物を ドット絵の 上に はっきり 出す（すぐ 消える） */
function gotTag(ico,name,val){const el=$('mngot');if(!el)return;const t=document.createElement('div');t.className='mngt';
  t.innerHTML=`<span class="gi">${ico}</span><span class="gn">${esc(name)}</span>${val?`<b>${esc(val)}</b>`:''}`;
  el.appendChild(t);while(el.children.length>2)el.firstChild.remove();setTimeout(()=>t.remove(),1800)}
/* 単語カードを 見つけた: よく 出るので ほる テンポを 止めない。 ドット絵の 上に カードの 札（タップで 📖 くわしく＋読む）。
   ほりつづけても 🎒🎴 から あとで 見られる。 さいしょの 1まいの あとで 1回だけ ミナ先生が 教えてくれる（札に かさならないよう 札が 消えてから） */
function cardTag(id,isNew){const M=MN();M.cards=(M.cards||0)+1;C.save();D.pop={ico:'🎴',t:0,big:1};fly('🎴','big');
  try{SFX.fanfare(1)}catch(e){sf('done')}
  try{const r=$('mncv').getBoundingClientRect();FX.firework(r.left+r.width*(.3+Math.random()*.4),r.top+r.height*.4)}catch(e){}
  const el=$('mncard');if(!el)return;const I=C.info(id);if(!I)return;
  el.innerHTML=`<button class="mncd" data-id="${esc(id)}"><span class="gi">🎴</span><span class="cn"><small>カードを 見つけた！${isNew?' <em>NEW</em>':''}</small><b>${esc(head1(I))}</b><i>${esc(I.ja)}</i></span><span class="tp">📖</span></button>`;
  const b=el.firstChild;b.onclick=()=>{sf('card');C.detail(id)};
  clearTimeout(el._t);el._t=setTimeout(()=>{if(b.isConnected)b.classList.add('out');setTimeout(()=>{if(b.isConnected)b.remove()},400)},6500);
  if(!MN().cardTold){MN().cardTold=1;C.save();setTimeout(()=>{if(!D)return;try{const [,tx]=ML('mn_card',{w:head1(I)});H.toast(`👩‍🏫 <b>ミナ先生</b><small>${esc(tx)}</small>`,4200)}catch(e){}},7200)}}
/* 宝カードを 見つけた！（めったに ない ので 大きな お祝い） */
function celebrate(id,isNew,treasure){const M=MN();M.cards=(M.cards||0)+1;C.save();D.pop={ico:treasure?'🎁':'🎴',t:0,big:1};
  try{SFX.fanfare(treasure?3:2)}catch(e){sf('done')}
  try{const r=$('mncv').getBoundingClientRect();[0,350,700].forEach(t=>setTimeout(()=>FX.firework(r.left+r.width*(.3+Math.random()*.4),r.top+r.height*.4),t))}catch(e){}
  fly(treasure?'🎁':'🎴','big');setTimeout(()=>{if(D)celebrateOv(id,isNew,treasure)},950);return true}
function celebrateOv(id,isNew,treasure){
  const I=C.info(id),[ex,tx]=ML(treasure?'mn_treasure':'mn_card',{w:I?head1(I):''});
  const o=C.ov(`<div class="mnfind"><p class="mnfh">✨ ${treasure?'🎁 宝カードを 見つけた！':'カードを 見つけた！'}</p>
    <div class="mnfc">${C.face(id,{big:1,ja:1})}</div>${isNew?'<p class="mnnew">NEW!</p>':''}<p class="mntap">🔊 カードを タップすると 読むよ</p>
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
const useN=()=>foods().reduce((a,s)=>a+(FOOD.rec().bag[s.id]||0),0)+toolList().filter(t=>t.ef!=='key').reduce((a,t)=>a+toolN(t.id),0);
function useMenu(){if(!D)return;const F=foods(),T=toolList(),bag=window.FOOD?FOOD.rec().bag:{};const mo=pickL(MINE_MIO);
  const row=(k,id,ico,name,n,sub,off)=>`<button class="mnlor mnuse" data-${k}="${id}" ${off?'disabled':''}><span class="gi">${ico}</span><span><b>${esc(name)}</b> <b class="n">×${n}</b><small>${sub}</small></span></button>`;
  const o=C.ov(`<div class="mnlo"><p class="mnlon">🎒 なにを つかう？ <small class="mnhp">❤ ${D.hp}/${ME_HP}</small></p>
    ${window.MIO?`<div class="kmina mnmio" data-say="${esc(mo[0])}"><span class="lface">${MIO.face('smile')}</span><p>${esc(mo[0])}<small>${esc(mo[1])}</small></p></div>`:''}
    <div class="mnlol">${F.length?`<p class="mnuh">🍪 食べもの</p>${F.map(s=>row('f',s.id,s.ico,s.n,bag[s.id],`❤+${s.hp}${D.hp>=ME_HP?'（いまは まんたん）':''}`,D.hp>=ME_HP)).join('')}`:''}
      ${T.length?`<p class="mnuh">⛏️ 道具</p>${T.map(t=>row('t',t.id,t.ico,t.n,toolN(t.id),esc(t.s)+(t.ef==='key'?'・宝箱が 出たら つかえる':''),t.ef==='key')).join('')}`:''}
      ${!F.length&&!T.length?'<p class="mnlod">まだ なにも ないよ。 食べ物と 道具は ながれぎ雑貨店で 買えるよ（🥪 食べ物・⛏️ 鉱山 の たな）</p>':''}</div>
    <button class="mnlob" data-x>⛏️ つづきを ほる</button></div>`,'mnlov');
  o.querySelectorAll('[data-x]').forEach(b=>b.onclick=()=>{sf('back');C.closeOv()});
  const mb=o.querySelector('.mnmio');if(mb)mb.onclick=()=>{try{MIO.say(mb.dataset.say)}catch(e){}};
  o.querySelectorAll('[data-f]').forEach(b=>b.onclick=()=>eatNow(b.dataset.f));
  o.querySelectorAll('[data-t]').forEach(b=>b.onclick=()=>useTool(b.dataset.t))}
function eatNow(id){if(!D||!FOOD.take(id))return;const s=FOOD_SNACKS[id];const a=D.hp;D.hp=Math.min(ME_HP,D.hp+(s.hp||0));keepHp(D.hp);D.used.push(s.ico);
  try{RECENT.add('snack',{id,en:s.en,ja:s.n,ico:s.ico,mine:1})}catch(e){}
  sf('eat');setTimeout(()=>sf('gulp'in SFX?'gulp':'pop'),450);C.closeOv();gotTag(s.ico,'もぐもぐ',`❤+${D.hp-a}`);
  const [,tx]=ML('mn_useFood',{t:s.n});H.toast(`${s.ico} <b>${esc(s.n)}</b> ❤ ${a} → <b>${D.hp}</b><small>👩‍🏫 ${esc(tx)}</small>`,3200);hud()}
function useTool(id){const t=MINE_TOOLS[id];if(!D||!t||t.ef==='key'||!takeTool(id))return;D.used.push(t.ico);C.closeOv();
  if(t.ef==='lamp')D.luck+=t.v;else if(t.ef==='rope'){D.depth+=t.v;burst()}else if(t.ef==='guard')D.fx.guard+=t.v;else D.fx[t.ef]=(D.fx[t.ef]||0)+t.v;
  if(t.ef==='lamp'&&D.dark){D.dark=0}
  sf(t.ef==='rope'?'knock':'pickup');gotTag(t.ico,t.n,t.ef==='rope'?`+${t.v}m`:'');
  const [,tx]=ML('mn_useTool',{t:t.n,en:t.en});H.toast(`${t.ico} <b>${esc(t.n)}</b><small>${esc(t.s)}<br>👩‍🏫 ${esc(tx)}</small>`,3400);hud()}

/* ================================================================ 🔀 5まいを ぜんぶ 入れかえる */
function freshHand(not){return pickHand(tools(),not)}
function swapAsk(nh){if(!D)return;nh=nh||freshHand(D.hand);
  const o=C.ov(`<div class="mnlo"><p class="mnlon">🔀 5まいを ぜんぶ 入れかえる？</p>
    <p class="mnlod">いまの 5まい</p><div class="mnhand sm mnsw old">${D.hand.map(id=>`<div class="mnt">${C.face(id,{mini:1,marks:false})}</div>`).join('')}</div>
    <p class="mnlod">⬇ あたらしい 5まい（タップで 📖）</p><div class="mnhand sm mnsw">${nh.map(id=>`<div class="mnt" data-id="${esc(id)}">${C.face(id,{mini:1,marks:false})}</div>`).join('')}</div>
    <p class="mnlod"><small>新しい 5まいは 和訳から はじめるよ。 ほった 深さと 見つけた 物は そのまま</small></p>
    <button class="big" data-ok>🔀 これに する</button><div class="row"><button class="sub" data-re>🔀 ほかの 5まい</button><button class="sub" data-x>やめる</button></div></div>`,'mnlov');
  o.querySelectorAll('.mnsw [data-id]').forEach(b=>b.onclick=()=>{sf('card');C.detail(b.dataset.id,()=>swapAsk(nh))});
  o.querySelector('[data-re]').onclick=()=>{sf('flip'in SFX?'flip':'tap');swapAsk(freshHand(D.hand.concat(nh)))};
  o.querySelector('[data-x]').onclick=()=>{sf('back');C.closeOv()};
  o.querySelector('[data-ok]').onclick=()=>{if(!D)return;sf('flip'in SFX?'flip':'card');C.closeOv();D.hand=nh;hand=nh.slice();D.swaps++;noteHand(nh);D.st=0;D.lap=0;startLap();D.cur=-1;
    const [,tx]=ML('mn_swap');H.toast(`🔀 <b>5まい 入れかえた！</b><small>👩‍🏫 ${esc(tx)}</small>`,3000);if(D.busy)hud();else next()}}

/* ================================================================ 📦 宝箱 */
const SNACK_POOL=()=>typeof FOOD_SNACKS==='undefined'?[]:Object.keys(FOOD_SNACKS).filter(id=>FOOD_SNACKS[id].lv!=='hs');
function chest(){D.chests++;D.pop={ico:'📦',t:0,big:1};sf('hey');try{SFX.fanfare(1)}catch(e){}
  fly('📦','big');setTimeout(()=>{if(D)chestOv()},950);return true}
function chestOv(){
  const id=pickL(D.hand),I=C.info(id),keyN=toolN('key'),[ex,tx]=ML('mn_chest');
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
  if(tier===2||(tier===1&&Math.random()<.25)){const t=pickL(tier===2?['lamp','helmet','mag','comp','gold','rope']:['lamp','rope','helmet','mag']);addTool(t);got.push([MINE_TOOLS[t].ico,MINE_TOOLS[t].n])}
  if(tier===2&&Math.random()<.25){const L=layerOf(dp),lv=pickL(L.lv),pool=C.W.filter(c=>c.lv===lv),c=pickL(pool);if(c){const isNew=!C.owns(c.id);C.give(c.id);D.got.push({id:c.id,isNew});got.push(['🎴',`カード「${head1(C.info(c.id)||c)}」${isNew?' NEW':''}`])}}
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
    const [,tx]=ML('mn_badGuard');H.toast(`⛑️ <b>ヘルメットで ふせいだ！</b><small>${B.ico} ${esc(B.n)}… でも へっちゃら！<br>👩‍🏫 ${esc(tx)}</small>`,3400);hud();return false}
  D.bads.push(B.id);D.events.push({ico:B.ico,n:B.n,t:B.t});
  if(B.back)D.depth=Math.max(0,D.depth-B.back);
  if(B.hard)D.hard+=B.hard;
  if(B.dark){D.dark=Math.max(D.dark,B.dark);D.luck=0}
  if(B.hp){D.hp=Math.max(1,D.hp-B.hp);keepHp(D.hp)}
  D.pop={ico:B.ico,t:0,big:1};D.crack=2;sf('wrong');fly(B.ico,'bad');gotTag(B.ico,B.n,B.back?`-${B.back}m`:B.hp?`❤-${B.hp}`:'');
  try{H.say('jh',B.en)}catch(e){}
  H.toast(`${B.ico} <b>${esc(B.n)}</b><small>「${esc(B.en)}」 ${esc(B.ja)}<br>${esc(B.t)}</small>`,4200);
  const M=MN();if(!D.badTold&&(M.badTold||0)<4){D.badTold=1;M.badTold=(M.badTold||0)+1;C.save();setTimeout(()=>{if(!D)return;const [,tx]=ML('mn_bad',{t:B.n});H.toast(`👩‍🏫 <b>ミナ先生</b><small>${esc(tx)}</small>`,4200)},4600)}
  hud();return false}

/* ================================================================ pixel art */
const PR=(c,x,y,w,h,col)=>{c.fillStyle=col;c.fillRect(x,y,w,h)};
function hsh(n){n=Math.imul(n^n>>>16,0x45d9f3b);n=Math.imul(n^n>>>16,0x45d9f3b);return (n^n>>>16)>>>0}
function draw(c){const L=layerOf(D.depth),[a,b,k]=L.col;
  PR(c,0,0,160,80,k);PR(c,0,12,160,56,a);
  for(let i=0;i<60;i++){const h=hsh(i*977+D.depth*31),x=h%160,y=12+(h>>>8)%56;PR(c,x,y,2,1,b)}
  for(let i=0;i<14;i++){const h=hsh(i*131+D.depth*7);PR(c,h%160,(h>>>8)%12,3,2,b);PR(c,(h>>>3)%160,68+(h>>>11)%12,3,2,b)}
  if(D.depth>=45)for(let i=0;i<6;i++){const h=hsh(i*53+D.depth);if((D.f+i*3)%10<6)PR(c,h%160,14+(h>>>9)%50,1,1,'#bfe9ff')}
  PR(c,0,62,160,6,b);PR(c,0,68,160,12,k);
  PR(c,0,66,58,1,'#8a8a8a');for(let x=2;x<58;x+=6)PR(c,x,67,3,1,'#6a4a2a');
  const g=c.createRadialGradient(44,34,0,44,34,46);g.addColorStop(0,'rgba(255,230,160,.35)');g.addColorStop(1,'rgba(255,230,160,0)');c.fillStyle=g;c.fillRect(0,0,160,80);
  const rx=84;PR(c,rx,24,30,40,b);PR(c,rx+3,20,24,4,b);PR(c,rx+2,26,26,36,'#00000018');PR(c,rx+4,28,6,4,'#ffffff22');
  if(D.crack>=1){PR(c,rx+10,30,1,10,k);PR(c,rx+11,40,1,6,k);PR(c,rx+12,46,4,1,k)}
  if(D.crack>=2){PR(c,rx+18,26,1,12,k);PR(c,rx+17,38,1,8,k);PR(c,rx+6,48,8,1,k)}
  const sw=D.swing>0;if(D.swing>0)D.swing--;const x=52,y=34,dn=sw&&D.swing<3;
  PR(c,x+3,y+20,8,5,'#4a5a7a');PR(c,x+4,y+25,2,5,'#4a5a7a');PR(c,x+8,y+25,2,5,'#4a5a7a');PR(c,x+3,y+30,3,2,'#5a3a22');PR(c,x+8,y+30,3,2,'#5a3a22');
  PR(c,x+3,y+11,8,9,'#e86a4a');PR(c,x+4,y+13,6,1,'#ffd23f');PR(c,x+6,y+10,2,1,'#ffe0cc');PR(c,x+3,y+2,8,8,'#ffe0cc');
  PR(c,x+8,y+5,1,2,'#2a2340');PR(c,x+10,y+5,1,2,'#2a2340');PR(c,x+9,y+8,2,1,'#c06060');
  PR(c,x+2,y,10,3,'#ffd23f');PR(c,x+3,y-1,8,1,'#ffd23f');PR(c,x+11,y+1,2,2,'#fff8c0');PR(c,x+2,y+3,1,4,'#6a3a2a');
  if(dn){PR(c,x+10,y+14,3,2,'#e86a4a');PR(c,x+12,y+15,2,2,'#ffe0cc');for(let i=0;i<10;i++)PR(c,x+13+i,y+16+Math.floor(i/3),1,1,'#a8743e');PR(c,x+22,y+12,2,10,'#9aa0b0');PR(c,x+21,y+11,4,2,'#9aa0b0')}
  else{PR(c,x+10,y+8,3,5,'#e86a4a');PR(c,x+10,y+6,2,2,'#ffe0cc');for(let i=0;i<10;i++)PR(c,x+10-Math.floor(i/4),y+5-i,1,1,'#a8743e');PR(c,x+3,y-6,10,2,'#9aa0b0');PR(c,x+2,y-5,2,2,'#9aa0b0')}
  if(sw&&D.swing===2){PR(c,rx-2,40,2,2,'#fff8c0');PR(c,rx-4,36,1,1,'#fff8c0');PR(c,rx-1,46,1,1,'#fff8c0')}
  D.parts=D.parts.filter(p=>{p.x+=p.vx;p.y+=p.vy;p.vy+=.5;p.l--;PR(c,p.x,p.y,2,2,p.c);return p.l>0});
  if(D.flash>0){c.fillStyle=`rgba(255,246,200,${(D.flash*.09).toFixed(2)})`;c.fillRect(0,0,160,80);D.flash--}
  if(D.pop){const p=D.pop;p.t++;const yy=40-Math.min(18,p.t*2);if(p.big&&p.t%4<2){PR(c,92,yy-14,1,1,'#fff');PR(c,107,yy-10,1,1,'#fff')}if(p.t>22)D.pop=null}
}
function burst(){const L=layerOf(D.depth);for(let i=0;i<14;i++)D.parts.push({x:96,y:44,vx:(Math.random()-.3)*3.2,vy:-Math.random()*3.5,l:12+Math.random()*8,c:pickL(L.col)})}

/* ================================================================ back home */
function finish(why){if(!D)return;const d=D;D.alive=false;D=null;keepHp(d.hp);const M=MN(),S=(()=>{try{return SHOP.rec()}catch(e){return {}}})();
  try{C.closeOv()}catch(e){}
  const pb=M.best||0;
  if(d.depth>M.best)M.best=d.depth;if(d.depth>(S.best||0))S.best=d.depth;S.mined=(S.mined||0)+1;
  let mapN=null;try{if(d.depth>=8&&window.ADV&&!ADV.has()&&Math.random()<.2)mapN=ADV.give()}catch(e){}
  if(d.coins)H.addCoins(d.coins);C.save();
  try{RECENT.add('mine',{depth:d.depth,best:pb,ok:d.ok,q:d.q,cards:d.got.map(x=>x.id),rare:d.got.some(x=>/^t:/.test(x.id)),coins:d.coins,hp:why==='hp'?'hp':'',chest:d.chests,bad:d.bads.length,badN:d.bads[0]||'',used:d.used.slice(0,4),swap:d.swaps})}catch(e){}
  hand=null;   // つぎは また 苦手から えらびなおす
  const head=why==='hp'?'⛏️ つかれたので 帰ってきた':'🎒 もちかえった';
  const ws=Object.entries(d.words),S2=stageOf(d.st);
  H.show('cg',`<section class="pnl cgp mnp">
    <div class="qtop"><button class="x" id="mnb" aria-label="もどる">←</button><b>${head}</b><span class="qn">${d.depth}m</span></div>
    <div class="mnres"><p><b>${d.depth}m</b> まで ほった ・ ${d.q}問中 <b>${d.ok}</b>問 正解</p>
      <p>${S2.ico} 「${esc(S2.n)}」まで すすんだ</p>
      <p>${d.coins?`🪙 +${d.coins}`:''} ${d.got.length?`✨ カード ${d.got.length}まい`:''} ${d.events.map(e=>e.ico).join('')}</p>${mapN?`<p class="mnmap">🗺️ 岩の すきまに 古い 宝の地図！「${esc(mapN)}」 <button id="mnmapgo" class="sub">宝探しに 行く</button></p>`:''}</div>
    <p class="note">練習した 単語（○＝正解 ×＝まちがい）。 タップで カード</p>
    <div class="mnws">${ws.map(([id,w])=>{const I=C.info(id);return `<button data-id="${esc(id)}"><b>${esc(head1(I))}</b> ${esc(I.ja)} <span>${'○'.repeat(w[0])}${'×'.repeat(w[1])}</span></button>`}).join('')}</div>
    ${why==='hp'&&window.FOOD?`<p class="note">❤は 2分で 1 もどるよ。 🍽️ しおかぜ食堂か 🥪 もちものの 食べ物で いっきに 回復！</p><div class="row"><button id="mndin" class="sub">🍽️ 食堂へ</button></div>`:''}
    <div class="row"><button id="mnshop" class="big">🃏 お店に もどる</button></div></section>`);
  if($('mndin'))$('mndin').onclick=()=>{sf('open');FOOD.open()};
  sf(d.depth>=20?'done':'step');
  $('mnb').onclick=$('mnshop').onclick=()=>{sf('step');SHOP.open()};
  if($('mnmapgo'))$('mnmapgo').onclick=()=>{try{SFX.map()}catch(e){}ADV.open()};
  H.panel.querySelectorAll('.mnws [data-id]').forEach(b=>b.onclick=()=>{sf('card');C.detail(b.dataset.id)});
  setTimeout(()=>{try{if(window.MINA&&MINA.canAnnounce&&MINA.canAnnounce()){const [ex,tx]=ML('sh_mineEnd',{n:d.q,d:d.depth});MINA.say('m',ex,tx,7000)}}catch(e){}},900)}
H.on('home',()=>{if(D){D.alive=false;keepHp(D.hp);if(D.coins)H.addCoins(D.coins);D=null;C.save()}});

/* ================================================================ ミナ先生の セリフ */
Object.assign(MINA_LINES,{
 mn_course:[['smile','5まいを 左から じゅんばんに 練習するよ。 さいしょは 和訳、 2周目は スペルの ならべかえ、 つぎは 英語で… と 1周ごとに 形が かわるの'],['point','まちがえた カードは その 周の さいごに もう一回 出るよ。 苦手な 単語ほど たくさん 練習できるんだ'],['smile','スマホで 打つのが 大変な ときは 「書く 問題」を 出さない ように できるよ。 つづりは ならべかえでも しっかり 練習できるから'],['happy','同じ 5まいを 形を かえて 何回も。 さいごには 聞いて 書けるように なってるはず！']],
 mn_card:[['wow','「{w}」の カード、 見つけたね！ 見つけた カードは 🎒の 🎴に たまるから、 タップで 読んで くわしく 見てね'],['smile','カードが 出たら 上に 札が 出るよ。 タップすると 「{w}」を 読んで くわしく 見られるの。 見のがしても 🎒の 🎴から 見られるからね']],
 mn_treasure:[['wow','🎁 宝カード！？ 鉱山の 奥で 見つかるなんて… すごい 運だね！'],['proud','宝カードは 仕入れでは 手に 入らない、 鉱山だけの 宝もの。 深く ほるほど いい カードが 出やすいよ'],['love','宝カードだ！ カードブックに 入れられるよ。 ダブったら お店で 売れるからね']],
 mn_lootTap:[['smile','🎒の ところに ならんだ 物は、 タップすると くわしく 見られるよ。 宝石の 英語の 名前も わかるの'],['happy','手に 入れた 石や カードは、 タップで くわしく！ ほっている とちゅうでも だいじょうぶ']],
 x_mnType:[['think','鉱山の 「つづりを 書く」は むずかしい？ ヒントで さいしょの 字が わかるよ'],['smile','聞いて 書けたら、 もう その 単語は きみの もの']]
});
if(window.MINA_SENSE&&MINA_SENSE._rules)MINA_SENSE._rules.push(
 ['x_mnType',1,()=>{try{return SHOP.rec().met&&MN().dives>0?{}:null}catch(e){return null}},()=>['⛏️ 鉱山へ',()=>{CG.open();setTimeout(open,60)}]],
 ['x_mnTool',1,()=>{try{return MN().dives>1&&!MN().toolBuy&&!toolList().length&&window.ZAKKA?{}:null}catch(e){return null}},()=>['🏚️ 雑貨屋へ',()=>ZAKKA.open('tool')]]);

window.MINE={open,rec:MN,course,addTool,toolN,toolList,bagRows,goMine,tools:MINE_TOOLS,skip:n=>{if(D){D.st=n;D.lap=0;startLap()}}};
})();
