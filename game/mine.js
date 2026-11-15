/* ⛏️ 単語の 鉱山: 5まいの 単語カードを 左から じゅんばんに 練習して ほりすすむ（カードを えらんだり 持ちかえたり しない）
   - 練習の 形は コースで きまっている（どれも 1周ずつで つぎの 形へ）: 和訳 → スペルの ならべかえ → 英語で → 聞きとり → 正しい つづり → ならべかえ → ぬけた 文字 → 例文 あなうめ → 書く → 聞いて 書く → そのあとは まぜて ずっと
     1周 = 5まいを 左から 1回ずつ。 まちがえた カードは その 周の さいごに もう一回 出る（苦手ほど たくさん 練習）
   - 体力（❤）が あるのは 自分だけ。 1問で 1 へる。 0に なっても 見つけた 物は ぜんぶ 持ち帰れる
     体力は 鉱山の 外でも のこり、 時間で 少しずつ もどる。 食べると たくさん もどる（game/food.js の FOOD）
   - 正解で 1m ほれる。 深い 層ほど 宝石が 高く、 見つかる カードも むずかしく なる
   - 見つかる 物: 宝石（コイン）・イベント・ごく たまに 単語カード や 🎁宝カード（見つけた ときは 大きな お祝い）
   データは game/shop-data.js（MINE_LAYERS / MINE_EVENT / MINE_GEM） */
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
const P_EVENT=.04,P_WORD=.018,P_TREASURE=.008,P_GEM=.2;

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
function autoHand(){const all=tools();
  const score=id=>(C.weak(id)?100:0)+(C.forgot(id)?50:0)+(6-C.star(id))*10+Math.random()*12;
  return all.sort((a,b)=>score(b)-score(a)).slice(0,HAND)}
let hand=null;
function open(){const M=MN();if(!hand||hand.some(id=>!C.owns(id)))hand=autoHand();
  const [ex,tx]=ML(myHp()<20&&window.FOOD?'fd_tired':'mn_course');
  H.show('cg',`<section class="pnl cgp shp mnp">
    <div class="qtop"><button class="x" id="mnb" aria-label="もどる">←</button><b>⛏️ 単語の 鉱山</b><span class="qn">${M.best?`最高 ${M.best}m`:''}</span></div>
    <div class="kmina"><span class="lface">${MINA.face('m',ex)}</span><p>${tx}</p></div>
    ${window.FOOD?FOOD.mineBox():''}
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
  const M=MN();M.dives++;C.save();
  D={hand:cards,st:0,lap:0,queue:[],redo:[],redone:{},cur:-1,depth:0,hp:myHp(),q:0,ok:0,got:[],coins:0,events:[],words:{},crack:0,luck:0,alive:true,f:0,parts:[],pop:null,swing:0,loot:{}};
  startLap();
  H.show('cg',`<section class="pnl cgp mnp mnd" data-stay>
    <div class="qtop"><button class="x" id="mnx" aria-label="もちかえる">←</button><b id="mnl">⛏️ 0m</b><span class="qn" id="mnh"></span></div>
    <div class="mnstage"><canvas id="mncv" width="160" height="80"></canvas><div class="mngot" id="mngot"></div></div>
    <p class="mnloot" id="mnloot"></p>
    <p class="mnst" id="mnst"></p>
    <div class="mnhand sm" id="mnhd"></div>
    <div id="mnq"></div>
    <button id="mnhome" class="sub">🎒 ここで もちかえる</button></section>`);
  $('mnx').onclick=$('mnhome').onclick=()=>{sf('back');finish('home')};
  const cv=$('mncv'),c=cv.getContext('2d');c.imageSmoothingEnabled=false;let last=0;
  const tick=now=>{if(!D||!D.alive||!cv.isConnected){if(D)D.alive=false;return}requestAnimationFrame(tick);if(now-last<90)return;last=now;D.f++;draw(c)};
  requestAnimationFrame(tick);
  next()}
function startLap(){D.queue=D.hand.map((_,i)=>i);D.redo=[];D.redone={}}
function hud(){if(!D)return;const L=layerOf(D.depth),S=stageOf(D.st);$('mnl').textContent=`⛏️ ${D.depth}m ・ ${L.n}`;
  $('mnh').innerHTML=`<span class="mnme"><b style="width:${D.hp/ME_HP*100}%"></b></span> ❤${D.hp}`;
  const lo=Object.entries(D.loot).map(([ico,n])=>`${ico}${n>1?`×${n}`:''}`).join(' '),cd=D.got.length;
  $('mnloot').innerHTML=D.coins||cd||lo?`🎒 <b>${D.coins}枚</b>${lo?` <span>${lo}</span>`:''}${cd?` <span>🎴×${cd}</span>`:''}`:'🎒 まだ なにも ない';
  $('mnst').innerHTML=`${S.ico} <b>${esc(S.n)}</b>${D.inRedo?' <em>もう一回</em>':''}`;
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
  if(ok){D.ok++;D.swing=6;sf('tap');setTimeout(()=>{if(!D)return;D.crack=0;D.depth++;burst();sf('knock');const big=find();C.save();hud();if(!big)setTimeout(()=>next(),D.pop?650:450)},420);}
  else{D.swing=6;D.crack=Math.min(2,D.crack+1);setTimeout(()=>{sf('tap')},300);C.save();hud();setTimeout(()=>next(),200)}}
/* what you find. カードは めったに 出ない（出たら 大きな お祝い）。 true を かえすと お祝いの あとで つぎへ */
function find(){const L=layerOf(D.depth),r=Math.random(),lk=D.luck>0?.12:0;if(D.luck>0)D.luck--;
  const deep=Math.min(.012,D.depth/5000);   // 深いほど 少しだけ 出やすい
  if(r<P_TREASURE+deep/2&&window.CARDS&&CARDS.find1){const g=CARDS.find1();const id='t:'+g.c.e;D.got.push({id,isNew:g.isNew});return celebrate(id,g.isNew,true)}
  if(r<P_TREASURE+P_WORD+deep){const lv=pickL(L.lv),pool=C.W.filter(c=>c.lv===lv),fresh=pool.filter(c=>!C.owns(c.id));const c=pickL(fresh.length&&Math.random()<.85?fresh:pool);
    const isNew=!C.owns(c.id);C.give(c.id);D.got.push({id:c.id,isNew});return celebrate(c.id,isNew,false)}
  if(r<P_TREASURE+P_WORD+deep+P_EVENT){const E=pickL(MINE_EVENT);D.events.push(E);
    if(E.hp){D.hp=Math.min(ME_HP,D.hp+E.hp);keepHp(D.hp)}if(E.deep)D.depth+=E.deep;if(E.luck)D.luck+=E.luck;if(E.coin)D.coins+=E.coin;
    D.pop={ico:E.ico,t:0,big:1};gotTag(E.ico,E.n,E.coin?`+${E.coin}枚`:'');sf('hey');H.toast(`${E.ico} <b>${esc(E.n)}</b><small>${esc(E.t)}</small>`,3600);return false}
  if(r<P_TREASURE+P_WORD+deep+P_EVENT+P_GEM+lk){const gi=Math.min(MINE_GEM.length-1,Math.floor(Math.random()*(2+D.depth/12))),G=MINE_GEM[gi];const v=G[2]+Math.floor(D.depth/5);
    D.coins+=v;D.loot[G[0]]=(D.loot[G[0]]||0)+1;D.pop={ico:G[0],t:0};gotTag(G[0],G[1],`+${v}枚`);sf('coinIn');return false}
  D.pop=null;return false}
/* 手に 入れた 物を ドット絵の 上に はっきり 出す（すぐ 消える） */
function gotTag(ico,name,val){const el=$('mngot');if(!el)return;const t=document.createElement('div');t.className='mngt';
  t.innerHTML=`<span class="gi">${ico}</span><span class="gn">${esc(name)}</span>${val?`<b>${esc(val)}</b>`:''}`;
  el.appendChild(t);while(el.children.length>2)el.firstChild.remove();setTimeout(()=>t.remove(),1800)}
/* カードを 見つけた！（めったに ない ので 大きな お祝い） */
function celebrate(id,isNew,treasure){const M=MN();M.cards=(M.cards||0)+1;C.save();D.pop={ico:treasure?'🎁':'🎴',t:0,big:1};
  try{SFX.fanfare(treasure?3:2)}catch(e){sf('done')}
  try{const r=$('mncv').getBoundingClientRect();[0,350,700].forEach(t=>setTimeout(()=>FX.firework(r.left+r.width*(.3+Math.random()*.4),r.top+r.height*.4),t))}catch(e){}
  const I=C.info(id),[ex,tx]=ML(treasure?'mn_treasure':'mn_card',{w:I?head1(I):''});
  const o=C.ov(`<div class="mnfind"><p class="mnfh">✨ ${treasure?'🎁 宝カードを 見つけた！':'カードを 見つけた！'}</p>
    <div class="mnfc">${C.face(id,{big:1,ja:1})}</div>${isNew?'<p class="mnnew">NEW!</p>':''}<p class="mntap">🔊 カードを タップすると 読むよ</p>
    <div class="kmina"><span class="lface">${MINA.face('m',ex)}</span><p>${tx}</p></div>
    ${I&&C.moreClosed?`<div class="mnwi">${C.moreClosed(I)}</div>`:''}
    <button class="big" id="mnyay">やった！ ほりつづける</button></div>`,'by');
  o.dataset.stay=1;if(C.bindMore)C.bindMore(o);
  o.querySelector('#mnyay').onclick=()=>{sf('step');C.closeOv();if(D)next()};
  return true}

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
  if(D.pop){const p=D.pop;p.t++;const yy=40-Math.min(18,p.t*2);if(p.big&&p.t%4<2){PR(c,92,yy-14,1,1,'#fff');PR(c,107,yy-10,1,1,'#fff')}if(p.t>22)D.pop=null}
  c.fillStyle='#fff';c.font='bold 7px monospace';c.fillText(D.depth+'m',134,10)}
function burst(){const L=layerOf(D.depth);for(let i=0;i<14;i++)D.parts.push({x:96,y:44,vx:(Math.random()-.3)*3.2,vy:-Math.random()*3.5,l:12+Math.random()*8,c:pickL(L.col)})}

/* ================================================================ back home */
function finish(why){if(!D)return;const d=D;D.alive=false;D=null;keepHp(d.hp);const M=MN(),S=(()=>{try{return SHOP.rec()}catch(e){return {}}})();
  try{C.closeOv()}catch(e){}
  const pb=M.best||0;
  if(d.depth>M.best)M.best=d.depth;if(d.depth>(S.best||0))S.best=d.depth;S.mined=(S.mined||0)+1;
  let mapN=null;try{if(d.depth>=8&&window.ADV&&!ADV.has()&&Math.random()<.2)mapN=ADV.give()}catch(e){}
  if(d.coins)H.addCoins(d.coins);C.save();
  try{RECENT.add('mine',{depth:d.depth,best:pb,ok:d.ok,q:d.q,cards:d.got.map(x=>x.id),rare:d.got.some(x=>/^t:/.test(x.id)),coins:d.coins,hp:why==='hp'?'hp':''})}catch(e){}
  hand=null;   // つぎは また 苦手から えらびなおす
  const head=why==='hp'?'⛏️ つかれたので 帰ってきた':'🎒 もちかえった';
  const ws=Object.entries(d.words),S2=stageOf(d.st);
  H.show('cg',`<section class="pnl cgp mnp">
    <div class="qtop"><button class="x" id="mnb" aria-label="もどる">←</button><b>${head}</b><span class="qn">${d.depth}m</span></div>
    <div class="mnres"><p><b>${d.depth}m</b> まで ほった ・ ${d.q}問中 <b>${d.ok}</b>問 正解</p>
      <p>${S2.ico} 「${esc(S2.n)}」まで すすんだ</p>
      <p>${d.coins?`🪙 +${d.coins}（宝石）`:''} ${d.got.length?`✨ カード ${d.got.length}まい`:''} ${d.events.map(e=>e.ico).join('')}</p>${mapN?`<p class="mnmap">🗺️ 岩の すきまに 古い 宝の地図！「${esc(mapN)}」 <button id="mnmapgo" class="sub">宝探しに 行く</button></p>`:''}</div>
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
 mn_card:[['wow','すごい！ 「{w}」の カードを 見つけたね！ めったに 出ないんだよ'],['love','カードが 出た！ 練習を がんばった ごほうびだね'],['smile','カードを タップすると 「{w}」って 読むよ。 声に 出して まねしてみてね']],
 mn_treasure:[['wow','🎁 宝カード！？ 鉱山の 奥で 見つかるなんて… すごい 運だね！'],['love','宝カードだ！ カードブックに 入れられるよ。 ダブったら お店で 売れるからね']],
 x_mnType:[['think','鉱山の 「つづりを 書く」は むずかしい？ ヒントで さいしょの 字が わかるよ'],['smile','聞いて 書けたら、 もう その 単語は きみの もの']]
});
if(window.MINA_SENSE&&MINA_SENSE._rules)MINA_SENSE._rules.push(
 ['x_mnType',1,()=>{try{return SHOP.rec().met&&MN().dives>0?{}:null}catch(e){return null}},()=>['⛏️ 鉱山へ',()=>{CG.open();setTimeout(open,60)}]]);

window.MINE={open,rec:MN,course,skip:n=>{if(D){D.st=n;D.lap=0;startLap()}}};
})();
