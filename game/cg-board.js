/* 🏝️ ことば島めぐり: すごろく ＋ ことばカード（カードショップ しおさい の 対戦。 カードの しくみは game/cg.js）
   - あなた ＋ 浜辺の みんな 2人。 サイコロで 島の 20マスを まわる
   - 空き地に 単語カードを 置くと 自分の 土地。 相手が 止まると 通行料（ことだま✨）が 入る
   - 🔗 ことばコンボ: となりの 自分の 土地と 自然な 組み合わせ（heavy ＋ rain）なら 通行料 2ばい
   - 🎨 色: 島の 1辺ごとに 色（なかま）が ある。 同じ 色の 単語を 置くと 守り+3。 同じ 色の 土地が ふえるほど 通行料アップ
   - ⚔ 勝負は 1回きり: 相手の 土地で 手札 1まいを 出して、 ⚔ が 土地の ❤＋守り を こえれば うばう。 数字は 先に 見せる
   - クイズは ここぞだけ: 置くとき（正解で 💪げんき ❤+4）・うばうとき（自分の カード。 まちがいで ⚔半分）・守るとき（相手の カード。 正解で 🛡が きく）
   - 自分の 土地に 止まったら レベルアップ／カードの 入れかえ。 🗼見はり台を 通って スタートに もどると 1周ボーナス
   - サポートカード: 単語カードとは 別わくで 3まいまで。 1回 使うと なくなる。 🎁マスで 3まいから 1まい えらぶ
   - デッキ: 自分で えらぶ 5まい ＋ のこりは 手持ちから ランダム（コンボの 組を 入れて 少し バランス）。 手札 4まい・毎ターン 1まい 引く
   - 勝ち: 合計（ことだま＋土地の ねうち）が 目標を こえて スタートを 通る。 ラウンドの 上限で いちばん 多い 人 */
(()=>{
const {S:ST,sfx:SFX}=BEACH;
const H=HE,esc=H.esc,$=id=>document.getElementById(id);
const C=CG,pickL=C.pickL;
const sf=k=>{try{SFX[k]&&SFX[k]()}catch(e){}};
const wait=ms=>new Promise(r=>setTimeout(r,ms));
const FOES=CG_FOES,foe=id=>FOES.find(f=>f.id===id);
const W_=x=>x.en.split(',')[0];
const ATTR={};CG_ATTR.forEach(a=>ATTR[a[0]]=a);
const ML=(k,v)=>{try{return MINA.line(k,v||{})}catch(e){return ['smile','']}};
const mface=ex=>{try{return MINA.face('m',ex)}catch(e){return '👩‍🏫'}};

/* ================================================================ numbers (自動対戦で 調整) */
const N=20,START_CASH=120,GOAL=320,LAP=50,MAX_ROUND=24,HAND_MAX=6,SUP_MAX=3,PICK_N=5,DECK_N=20;
const TOLL=[0,10,24,42,64],UP=[0,0,30,45,65],COLOR_X=[0,1,1.4,1.8,2.4];
const SPECIAL={0:'start',5:'gift',10:'tower',15:'gift'};
const PCOL=['#4fd1a5','#ff8a5a','#b98aff'];
const costOf=id=>{const I=C.info(id);return Math.max(6,(I.cost||1)*8)};

/* ================================================================ sounds & motion */
const SND={
  dice:()=>{for(let i=0;i<5;i++)noise(.05,{v:.05,f:2500,f2:900,q:2,delay:i*.07})},
  step:()=>{tone(740+Math.random()*120,.05,'square',.025)},
  place:()=>{tone(392,.08,'triangle',.06);tone(587,.1,'triangle',.06,.07);noise(.15,{v:.04,type:'lowpass',f:900,delay:.02})},
  coin:n=>{for(let i=0;i<Math.min(8,n);i++)tone(1318+Math.random()*300,.07,'square',.025,i*.06)},
  pay:()=>{tone(523,.08,'square',.04);tone(392,.12,'square',.04,.09)},
  combo:()=>{[0,4,7,12,16].forEach((n,i)=>tone(523*Math.pow(2,n/12),.14,'square',.045,i*.06));noise(.4,{v:.04,type:'highpass',f:6000,delay:.3})},
  clash:()=>{noise(.2,{v:.1,f:4000,f2:500,q:.8});tone(880,.14,'sawtooth',.025,0,180)},
  boom:()=>{noise(.55,{v:.14,type:'lowpass',f:1200,f2:70,q:.7});tone(120,.45,'sine',.1,0,38)},
  fail:()=>{tone(330,.12,'square',.04);tone(247,.25,'square',.04,.12)},
  shield:()=>{tone(1400,.35,'triangle',.05,0,1300);tone(2100,.25,'sine',.03,.02)},
  up:()=>{[0,4,7,12].forEach((n,i)=>tone(523*Math.pow(2,n/12),.12,'triangle',.05,i*.07))},
  sup:()=>{tone(880,.08,'sine',.05);tone(1320,.14,'sine',.05,.08);noise(.2,{v:.03,type:'highpass',f:5000,delay:.1})},
  lap:()=>{[0,4,7,12,7,12].forEach((n,i)=>tone(659*Math.pow(2,n/12),.12,'square',.035,i*.08))},
  turn:()=>{tone(660,.08,'square',.04);tone(990,.12,'square',.04,.09)},
  foe:()=>{tone(330,.08,'square',.03);tone(262,.12,'square',.03,.09)}};
const snd=(k,a)=>{try{if(typeof tone==='function')SND[k](a)}catch(e){}};
const calm=()=>window.matchMedia&&matchMedia('(prefers-reduced-motion:reduce)').matches;
function fxLayer(){let l=$('cgfx');if(!l){l=document.createElement('div');l.id='cgfx';document.body.appendChild(l)}return l}
function fxEl(cls,html,ms){const e=document.createElement('div');e.className=cls;e.innerHTML=html||'';fxLayer().appendChild(e);setTimeout(()=>e.remove(),ms||1200);return e}
function flash(col){if(calm())return;const e=fxEl('fxflash','',450);e.style.background=col||'#fff'}
function cutin(big,small,cls,ms=1000){if(G&&G.fast)return Promise.resolve();fxEl('fxcut '+(cls||''),`<div><b>${big}</b>${small?`<small>${small}</small>`:''}</div>`,ms+250);return wait(ms)}
const cellEl=i=>document.querySelector(`.kc[data-i="${i}"]`);
function centerOf(el){const r=el.getBoundingClientRect();return [r.left+r.width/2,r.top+r.height/2]}
function burst(el,col,n=12){if(!el||calm())return;const xy=centerOf(el);
  for(let i=0;i<n;i++){const a=Math.random()*Math.PI*2,d=24+Math.random()*50,e=fxEl('fxp','',800);e.style.cssText=`left:${xy[0]}px;top:${xy[1]}px;--dx:${Math.cos(a)*d}px;--dy:${Math.sin(a)*d}px;background:${col||'#ffd36a'};width:${4+Math.random()*5}px`}}
function floatTxt(i,txt,col){const el=cellEl(i);if(!el)return;const d=document.createElement('span');d.className='kfl';d.style.color=col||'#ffe14a';d.textContent=txt;el.appendChild(d);setTimeout(()=>d.remove(),1300)}
function confetti(){if(calm())return;for(let i=0;i<70;i++){const e=fxEl('fxconf','',3600);e.style.cssText=`left:${Math.random()*100}vw;background:hsl(${Math.random()*360|0} 90% 62%);animation-delay:${(Math.random()*.9).toFixed(2)}s;--r:${Math.random()*900-450|0}deg;--dx:${Math.random()*90-45|0}px`}}

/* ================================================================ 🎁 support cards (1回だけ) */
/* [アイコン, 名前, 1行の せつめい, いつ使う: turn=サイコロの まえ / roll=サイコロの かわり / atk=うばう 勝負 / def=守る 勝負 / both=勝負 どちらでも] */
const SP={
  dice:['🎲','えらべるサイコロ','サイコロの 目を 1〜6から えらぶ','roll'],
  dbl:['👟','ダブルサイコロ','サイコロを 2つ ふって 足す','roll'],
  warp:['🌀','ワープ','すきな マスへ とんで 止まる','roll'],
  draw:['🃏','ドロー','単語カードを 2まい 引く','turn'],
  swap:['🔁','引きなおし','手札を ぜんぶ 入れかえる','turn'],
  build:['🏗️','ふしん','自分の 土地 1つを ただで レベル+1','turn'],
  well:['⛲','ことだまの泉','ことだま ✨+40','turn'],
  free:['🎫','通行料パス','つぎに 払う 通行料が 0','turn'],
  tax:['📈','ねあげ','つぎに もらう 通行料が 2ばい','turn'],
  steal:['🦝','いたずら','相手の サポートを 1まい もらう','turn'],
  pow:['⚔️','パワー','うばう 勝負で ⚔+6','atk'],
  crit:['💥','会心','うばう 勝負で ⚔×1.5','atk'],
  pierce:['🦅','つらぬく','土地の 守り（⭐🎨💪🔗）を むし','atk'],
  wall:['🛡️','かべ','守る 勝負で ❤+8','def'],
  mirror:['🪞','はねかえし','守る 勝負で 相手の ⚔が 半分','def'],
  retry:['🔄','もう1問','勝負の 問題を まちがえたら もう1問','both'],
  cancel:['🙅','うちけし','勝負で 相手の サポートを けす','both']};
const SPK=Object.keys(SP);
/* each person's favorite (from their 得意技) */
const FAV={easy:'well',heal:'wall',again:'dbl',pinch:'tax',freeze:'cancel',combo3:'build',nodraw:'steal',steal:'steal',encore:'dice',warp:'pierce',mimic:'mirror',hard:'crit',lesson:'pow'};
const spLine=k=>`${SP[k][0]} ${SP[k][1]}: ${SP[k][2]}`;

/* ================================================================ state */
let G=null;
const me=()=>G.P[0];
const landOf=i=>G.sq[i];
const isLand=i=>G.sq[i].kind==='land';
const sideOf=i=>Math.floor(i/5);
function rc(i){if(i<=5)return [0,i];if(i<=10)return [i-5,5];if(i<=15)return [5,15-i];return [20-i,0]}
const nbrs=i=>[i-1,i+1].filter(j=>j>=0&&j<N&&isLand(j)&&sideOf(j)===sideOf(i));
/* a card's numbers on the island: ⚔ from the card's attack, ❤ and 🛡 as they are (★ grows them) */
function bs(id,P){const S=C.cstat(id,P&&P.k==='ai'?P.star:undefined);if(!S)return {a:4,h:8,d:0};return {a:S.a*2+4+(P&&P.k==='ai'?P.atkUp:0),h:S.h,d:S.d}}
const hc=(a,b)=>C.comboOf(a.h,b.h)||C.comboOf(b.h,a.h);
/* the combos a land makes with its owner's lands next to it */
function combosAt(i){const s=landOf(i);if(s.o<0)return [];const I=C.info(s.id);
  return nbrs(i).map(j=>{const t=landOf(j);if(t.o!==s.o)return null;const c=hc(I,C.info(t.id));return c?{j,c}:null}).filter(Boolean)}
const sameColor=(o,at)=>G.sq.filter(s=>s.kind==='land'&&s.o===o&&s.at===at).length;
function tollOf(i){const s=landOf(i);if(s.o<0)return 0;const cb=combosAt(i).length;
  return Math.round(TOLL[s.lv]*COLOR_X[Math.min(4,sameColor(s.o,s.at))]*(cb>=2&&C.ruleOn('sent')?3:cb?2:1))}
function guardOf(i){const s=landOf(i),I=C.info(s.id),g=[];
  if(s.lv>1)g.push(['⭐',(s.lv-1)*3]);if(I.a===s.at)g.push(['🎨',3]);if(s.hb)g.push(['💪',s.hb]);
  if(combosAt(i).length)g.push(['🔗',3]);
  if(C.ruleOn('guard')&&nbrs(i).some(j=>{const t=landOf(j);return t.o===s.o&&C.syn(I.h).includes(C.info(t.id).h)}))g.push(['🛡️',3]);
  return g}
const gsum=g=>g.reduce((a,x)=>a+x[1],0);
const worth_=(P,g)=>P.cash+g.sq.filter(s=>s.kind==='land'&&s.o===P.i).reduce((a,s)=>a+s.val,0);
const worth=P=>P.cash+G.sq.filter(s=>s.kind==='land'&&s.o===P.i).reduce((a,s)=>a+s.val,0);

/* ================================================================ decks */
function myCards(){const R=C.rec();return Object.keys(R.c).filter(id=>R.c[id]>0&&C.BY[id])}
/* your 5 + the rest from your cards: a few combo pairs, not too many strong ones */
function buildDeck(picked){const own=H.shuffle(myCards()),out=picked.slice(0,PICK_N);const add=id=>{if(out.length<DECK_N&&id&&!out.includes(id))out.push(id)};
  const hs={};own.forEach(id=>{const I=C.info(id);(hs[I.h]=hs[I.h]||[]).push(id)});
  /* partners for the ones you picked first, then other pairs */
  out.slice().forEach(id=>{const I=C.info(id);const c=C.combosWith(I.h).find(c=>hs[c.a===I.h?c.b:c.a]);if(c)add(hs[c.a===I.h?c.b:c.a][0])});
  let pairs=0;for(const c of H.shuffle(C.COMBO.slice())){if(pairs>=3)break;if(hs[c.a]&&hs[c.b]&&!out.includes(hs[c.a][0])){add(hs[c.a][0]);add(hs[c.b][0]);pairs++}}
  const lvN=id=>({es:0,jh:1,hs:2,adv:3})[C.info(id).lv]||0;
  const hi=own.filter(id=>lvN(id)>=2);hi.slice(0,4).forEach(add);
  own.forEach(add);
  while(out.length<12&&out.length)out.push(pickL(out));
  return H.shuffle(out)}
function foeDeck(F,n){n=n||DECK_N;const lv=F.lv,pool=C.W.filter(c=>lv.includes(c.lv)&&(!F.at.length||F.at.includes(c.a))),all=C.W.filter(c=>lv.includes(c.lv));
  const ids=[],cs=C.COMBO.filter(c=>{const a=C.cardOfHead(c.a),b=C.cardOfHead(c.b);return a&&b&&lv.includes(a.lv)&&lv.includes(b.lv)});
  const fav=cs.filter(c=>!F.at.length||F.at.includes(C.cardOfHead(c.a).a)||F.at.includes(C.cardOfHead(c.b).a));
  H.shuffle((fav.length>=4?fav:cs).slice()).slice(0,Math.max(1,Math.round(n/5))).forEach(c=>{const a=C.cardOfHead(c.a).id,b=C.cardOfHead(c.b).id;if(!ids.includes(a)&&!ids.includes(b))ids.push(a,b)});
  let guard=0;while(ids.length<n&&guard++<500){const c=pickL(pool.length>10?pool:all);if(!ids.includes(c.id))ids.push(c.id)}
  return H.shuffle(ids.slice(0,n))}
const foeStar=F=>F.mina?2:Math.max(0,Math.round((F.p-.6)*8));
const foeLv=F=>Math.min(5,(C.rec().win[F.id]||0));
function draw(P,n=1){for(let k=0;k<n;k++){if(P.hand.length>=HAND_MAX)return;if(!P.deck.length){P.deck=H.shuffle(P.disc);P.disc=[]}if(!P.deck.length)return;P.hand.push(P.deck.shift())}}
function giveSup(P,k){if(P.sup.length>=SUP_MAX)return false;P.sup.push(k);return true}

/* ================================================================ start */
/* the second opponent: someone near the first one's strength */
function partnerOf(F){const r=C.rank();const ok=FOES.filter(x=>x.id!==F.id&&!x.mina&&r>=x.need&&x.id!=='nagi');
  if(!ok.length)return FOES.find(x=>x.id!==F.id&&!x.mina);
  return ok.slice().sort((a,b)=>Math.abs(a.p-F.p)-Math.abs(b.p-F.p)).slice(0,3)[Math.floor(Math.random()*Math.min(3,ok.length))]}
function start(id,opt={}){const F=foe(id);if(!F)return;const F2=opt.with?foe(opt.with):partnerOf(F);
  pickScreen(F,F2,picked=>begin(F,F2,opt,picked),opt.pickBack||opt.back||(()=>menu()))}
function mkFoe(F,i){const lv=foeLv(F);const P={i,k:'ai',F,n:F.n,ico:F.ico,pos:0,cash:START_CASH,deck:foeDeck(F),hand:[],disc:[],sup:[],cp:false,
    star:Math.min(5,1+foeStar(F)+(lv>=3?1:0)),atkUp:Math.floor(lv/2)+(F.mina?2:0),p:Math.min(.97,F.p+lv*.03),lv,flag:{}};
  giveSup(P,FAV[F.sp.k]||pickL(SPK));giveSup(P,pickL(SPK));draw(P,4);return P}
function begin(F,F2,opt,picked){
  const meP={i:0,k:'me',n:'あなた',ico:'🫵',pos:0,cash:START_CASH,deck:buildDeck(picked),hand:[],disc:[],sup:[],cp:false,flag:{}};
  if(opt.sim)Object.assign(meP,{k:'ai',F,p:opt.sim,atkUp:0,star:undefined});   // 自動対戦（バランス調整用）: あなたも 自動で うごく
  /* lands: 4 colors, one for each side of the island (your kinds and theirs) */
  const cnt={};meP.deck.forEach(id=>{const a=C.info(id).a;if(ATTR[a])cnt[a]=(cnt[a]||0)+1});
  const ats=[];const add=a=>{if(a&&ATTR[a]&&!ats.includes(a)&&ats.length<4)ats.push(a)};
  Object.keys(cnt).sort((a,b)=>cnt[b]-cnt[a]).slice(0,2).forEach(add);add(F.at[0]);add(F2.at[0]);add(F.at[1]);H.shuffle(CG_ATTR.map(a=>a[0])).forEach(add);
  const sideAt=H.shuffle(ats);
  const sq=[];for(let i=0;i<N;i++)sq.push(SPECIAL[i]?{i,kind:SPECIAL[i]}:{i,kind:'land',at:sideAt[sideOf(i)],o:-1,id:null,lv:0,val:0,hb:0});
  G={F,F2,opt,sq,P:[meP,mkFoe(F,1),mkFoe(F2,2)],turn:0,round:1,busy:true,msg:'',fast:!!opt.fast,
    res:{q:[],combos:[],newCombo:[],wrong:[],stars:[],took:0,lost:0,placed:0,toll:0}};
  giveSup(meP,pickL(['dice','pow','wall','draw']));giveSup(meP,pickL(SPK));draw(meP,4);
  G.st={fights:0,took:0,tolls:0,toll:0,placed:0,ups:0};
  if(opt.sim){G.fast=true;return myTurn()}
  sf('card');intro()}

function intro(){const [F,F2]=[G.F,G.F2];
  const o=C.ov(`<div class="cgvs kintro"><div class="kvs"><span>${F.ico}</span><span>${F2.ico}</span></div><b>${esc(F.n)} と ${esc(F2.n)}</b>
    <p class="en">${esc(F.hi[0])}</p><p class="ja">${esc(F.hi[1])}</p>
    ${C.rec().isl?'':`<div class="khow1"><p>🏠 空き地に カードを 置く → 止まった 相手から 通行料</p><p>🔗 となりの 土地と コンボで 通行料 2ばい</p><p>⚔ 相手の 土地では 払うか 1回きりの 勝負</p></div>`}
    <p class="kgoal">🏆 ことだま ＋ 土地の ねうちで <b>✨${GOAL}</b> を こえて スタートに もどったら 勝ち</p>
    <button id="vsgo">🎲 しゅっぱつ！</button></div>`,'vs');o.dataset.stay=1;
  C.speak(F.hi[0]);snd('lap');$('vsgo').onclick=()=>{C.closeOv();flash('rgba(255,255,255,.4)');H.show('cgb',shell());bindShell();myTurn()}}

/* ================================================================ screen */
function shell(){return `<section class="pnl cgp kb" data-stay>
  <div class="qtop"><button class="x" id="kbx" aria-label="やめる">←</button><b>🏝️ ことば島めぐり</b><span class="qn" id="kround"></span></div>
  <div class="kbd" id="kbd"></div><div class="kbot" id="kbot"></div></section>`}
function bindShell(){$('kbx').onclick=()=>{if(G.busy&&!G.waitRoll)return;sf('pop');const o=C.ov(`<div class="cgbuy cgnote"><b>島めぐりを やめる？</b><p><small>やめると 負けに なるよ</small></p><div class="row"><button id="kq1" class="sub">つづける</button><button id="kq2">やめる</button></div></div>`,'by');o.dataset.stay=1;
  $('kq1').onclick=()=>{sf('step');C.closeOv()};$('kq2').onclick=()=>{C.closeOv();end(false,true)}}}
function cellHtml(s){const [r,c]=rc(s.i);const here=G.P.filter(P=>P.pos===s.i).map(P=>`<i class="ktk p${P.i}${G.P[G.turn]===P?' now':''}">${P.ico}</i>`).join('');
  const pos=`grid-row:${r+1};grid-column:${c+1}`;
  if(s.kind!=='land'){const ic={start:'🏁',gift:'🎁',tower:'🗼'}[s.kind],nm={start:'スタート',gift:'サポート',tower:'見はり台'}[s.kind];
    return `<div class="kc ksp k-${s.kind}" data-i="${s.i}" style="${pos}"><span class="kic">${ic}</span><small>${nm}</small><span class="ktks">${here}</span></div>`}
  const A=ATTR[s.at],cb=s.o>=0&&combosAt(s.i).length;
  if(s.o<0)return `<div class="kc kland" data-i="${s.i}" style="${pos};--c:${A[3]}"><span class="kat">${A[1]}</span><span class="ktks">${here}</span></div>`;
  const I=C.info(s.id),art=C.art(I)[0];
  return `<div class="kc kland own o${s.o}${cb?' kcb':''}" data-i="${s.i}" style="${pos};--c:${A[3]};--o:${PCOL[s.o]}"><span class="kart">${art}</span><span class="kw">${esc(W_(I))}</span>
    <span class="klv">${'⭐'.repeat(s.lv-1)}${cb?'🔗':''}</span><span class="ktl">✨${tollOf(s.i)}</span><span class="ktks">${here}</span></div>`}
function center(){return `<div class="kcen"><div class="kps">${G.P.map(P=>{const w=worth(P);return `<div class="kp p${P.i}${G.P[G.turn]===P?' now':''}" style="--o:${PCOL[P.i]}"><span class="kpi">${P.ico}</span><span class="kpn"><b>✨${P.cash}</b><i><u style="width:${Math.min(100,w/GOAL*100)}%"></u></i><small>${w}/${GOAL}${P.cp?' 🗼':''}</small></span></div>`}).join('')}</div>
  <div class="kmsg" id="kmsg">${G.msg||''}</div><div class="kdice" id="kdice"></div></div>`}
function render(msg){if(!G)return;if(msg!=null)G.msg=msg;const b=$('kbd');if(!b)return;
  b.innerHTML=G.sq.map(cellHtml).join('')+center();$('kround').textContent=`R${G.round}/${MAX_ROUND}`;
  b.querySelectorAll('.kc').forEach(el=>el.onclick=()=>tapCell(+el.dataset.i));renderBot()}
function say(msg){G.msg=msg;const m=$('kmsg');if(m)m.innerHTML=msg}
function cardChip(id,P,o={}){const I=C.info(id),S=bs(id,P),A=ATTR[I.a]||['','🎁','宝','#c9a227'];
  return `<button class="khc${o.cls?' '+o.cls:''}" data-h="${esc(id)}" style="--c:${A[3]}" ${o.dis?'disabled':''}><span class="ka">${C.art(I)[0]}</span><b>${esc(W_(I))}</b><small>⚔${o.atk||S.a} ❤${S.h}</small>${o.tag?`<em>${o.tag}</em>`:`<em>✨${costOf(id)}</em>`}</button>`}
function renderBot(){const el=$('kbot');if(!el)return;const P=me(),my=G.turn===0&&G.waitRoll;
  el.innerHTML=`<div class="khand">${P.hand.map(id=>cardChip(id,P)).join('')||'<small class="note">手札なし</small>'}</div>
  <div class="ksup">${P.sup.map((k,i)=>`<button class="ksc" data-s="${i}" title="${esc(SP[k][1])}">${SP[k][0]}</button>`).join('')}${'<span class="ksc e"></span>'.repeat(Math.max(0,SUP_MAX-P.sup.length))}
    ${my?'<button id="kroll" class="kroll">🎲 サイコロ</button>':'<span class="kwait">…</span>'}</div>`;
  el.querySelectorAll('.khc').forEach(b=>b.onclick=()=>{const I=C.info(b.dataset.h),S=bs(b.dataset.h,P);sf('tap');
    H.toast(`<b>${esc(I.en)}</b>（${esc(I.ja)}）<small>⚔${S.a} ❤${S.h} 🛡${S.d}　置くのに ✨${costOf(b.dataset.h)}　${(ATTR[I.a]||['','',''])[1]}${(ATTR[I.a]||['','','宝'])[2]}</small>`,2600)});
  el.querySelectorAll('.ksc[data-s]').forEach(b=>b.onclick=()=>supTap(+b.dataset.s));
  const r=$('kroll');if(r)r.onclick=()=>{if(!G.waitRoll)return;G.waitRoll=false;roll()}}

/* ================================================================ tapping things */
let pickCell=null;
function tapCell(i){if(pickCell){const f=pickCell;pickCell=null;f(i);return}const s=landOf(i);
  if(s.kind!=='land'){H.toast({start:'🏁 スタート: 🗼を 通って もどると 1周ボーナス',gift:'🎁 サポートカードを 3まいから 1まい もらえる',tower:'🗼 見はり台: 通ると 単語カードを 1まい 引く'}[s.kind]);return}
  const A=ATTR[s.at];if(s.o<0){H.toast(`${A[1]} ${esc(A[2])}の 空き地<small>同じ なかまの 単語を 置くと 🎨守り+3</small>`);return}
  const I=C.info(s.id),S=bs(s.id,G.P[s.o]),g=guardOf(i),cb=combosAt(i);
  H.toast(`${G.P[s.o].ico} <b>${esc(I.en)}</b>（${esc(I.ja)}） 通行料 ✨${tollOf(i)}<small>❤${S.h}${g.length?' ＋守り '+g.map(x=>x[0]+x[1]).join(' '):''}　🛡${S.d}${cb.length?'<br>🔗 '+cb.map(x=>esc(x.c.p)).join('、 '):''}</small>`,3000)}
function supTap(n){const P=me(),k=P.sup[n];if(!k)return;const t=SP[k][3],now=G.turn===0&&G.waitRoll&&(t==='turn'||t==='roll');sf('tap');
  const o=C.ov(`<div class="cgbuy cgnote ksup1"><b>${SP[k][0]} ${esc(SP[k][1])}</b><p>${esc(SP[k][2])}</p><small>${t==='turn'||t==='roll'?'自分の ターン、 サイコロの まえに 使う':t==='atk'?'相手の 土地で 勝負する ときに 使う':t==='def'?'自分の 土地が ねらわれた ときに 使う':'勝負の ときに 使う'}</small>
    <div class="row"><button id="ks1" class="sub">とじる</button>${now?'<button id="ks2">使う</button>':''}</div></div>`,'by');
  $('ks1').onclick=()=>{sf('back');C.closeOv()};if(now)$('ks2').onclick=()=>{C.closeOv();useTurnSup(P,n)}}
async function useTurnSup(P,n){const k=P.sup[n];if(!k)return;
  if(k==='build'&&!G.sq.some(s=>s.kind==='land'&&s.o===P.i&&s.lv<4)){if(P.k==='me')H.toast('レベルを 上げられる 土地が ないよ');return}
  if(k==='steal'&&!G.P.some(Q=>Q!==P&&Q.sup.length)){if(P.k==='me')H.toast('相手は サポートを もっていないよ');return}
  P.sup.splice(n,1);snd('sup');const nm=`${SP[k][0]} ${SP[k][1]}`;
  if(k==='draw'){draw(P,2);say(`${P.ico} ${nm}！ カードを 2まい 引いた`)}
  else if(k==='swap'){P.disc.push(...P.hand);const n2=P.hand.length;P.hand=[];draw(P,Math.max(4,n2));say(`${P.ico} ${nm}！ 手札を 入れかえた`)}
  else if(k==='well'){P.cash+=40;say(`${P.ico} ${nm}！ ✨+40`);snd('coin',5)}
  else if(k==='free'){P.flag.free=1;say(`${P.ico} ${nm}！ つぎの 通行料は 0`)}
  else if(k==='tax'){P.flag.tax=1;say(`${P.ico} ${nm}！ つぎの 通行料が 2ばい`)}
  else if(k==='build'){const ls=G.sq.filter(s=>s.kind==='land'&&s.o===P.i&&s.lv<4);let s;
    if(P.k==='me'&&ls.length>1){render(`🏗️ レベルを 上げる 土地を タップ`);s=await new Promise(res=>{pickCell=function f(i){const t=landOf(i);if(t.kind==='land'&&t.o===P.i&&t.lv<4)res(t);else{H.toast('自分の 土地を えらんでね');pickCell=f}}})}
    else s=ls.sort((a,b)=>tollOf(b.i)-tollOf(a.i))[0];
    s.lv++;s.val+=Math.round(UP[s.lv]/2);snd('up');render();burst(cellEl(s.i),'#ffe14a');say(`${P.ico} ${nm}！ ${esc(W_(C.info(s.id)))} が ⭐${s.lv}に`)}
  else if(k==='steal'){const Q=G.P.filter(Q=>Q!==P&&Q.sup.length).sort((a,b)=>b.sup.length-a.sup.length)[0];const j=Math.floor(Math.random()*Q.sup.length),got=Q.sup.splice(j,1)[0];
    if(!giveSup(P,got))P.sup[0]=got;say(`${P.ico} ${nm}！ ${Q.ico}の ${SP[got][0]}${esc(SP[got][1])} を もらった`)}
  else if(k==='dice'||k==='dbl'||k==='warp'){P.flag.roll=k;say(`${P.ico} ${nm}！`)}
  render();if(P.k==='me'&&G.waitRoll!==false)renderBot();
  if(P.k==='me'&&(k==='dice'||k==='dbl'||k==='warp')){G.waitRoll=false;roll()}}

/* ================================================================ turns */
function myTurn(){if(!G)return;G.turn=0;const P=me();if(G.opt.sim)return aiTurn(P);draw(P,1);G.busy=false;G.waitRoll=true;render('あなたの ターン！ 🎲 を ふろう');snd('turn');
  if(!G.fast)fxEl('fxturn me','<b>YOUR TURN</b>',1000)}
async function roll(){const P=G.P[G.turn];G.busy=true;renderBot();let n;const k=P.flag.roll;P.flag.roll=null;
  if(k==='warp'){let to;if(P.k==='me'){render('🌀 とびたい マスを タップ');to=await new Promise(res=>{pickCell=i=>res(i)})}else to=aiWarp(P);
    P.pos=to;sf('flip');render();burst(cellEl(to),'#9fe8ff');await wait(400);return arrive(P,false)}
  if(k==='dice'&&P.k==='me'){n=await new Promise(res=>{const o=C.ov(`<div class="cgbuy cgnote"><b>🎲 目を えらぶ</b><div class="row kdc">${[1,2,3,4,5,6].map(v=>`<button data-v="${v}">${v}</button>`).join('')}</div></div>`,'by');o.dataset.stay=1;
      o.querySelectorAll('[data-v]').forEach(b=>b.onclick=()=>{C.closeOv();res(+b.dataset.v)})})}
  else if(k==='dice')n=aiDice(P);
  else{n=1+Math.floor(Math.random()*6);if(k==='dbl')n+=1+Math.floor(Math.random()*6)}
  snd('dice');const d=$('kdice');if(d&&!G.fast){for(let t=0;t<6;t++){d.textContent='🎲'+(1+Math.floor(Math.random()*6));await wait(55)}}
  if($('kdice'))$('kdice').innerHTML=`<b>${n}</b>`;await wait(G.fast?0:P.k==='me'?350:200);
  for(let s=0;s<n;s++){P.pos=(P.pos+1)%N;render();snd('step');await wait(G.fast?0:P.k==='me'?150:90);
    const q=landOf(P.pos);
    if(q.kind==='tower'&&!P.cp){P.cp=true;draw(P,1);floatTxt(P.pos,'🗼','#bff3ff');if(P.k==='me')say('🗼 見はり台！ カードを 1まい 引いた')}
    if(q.kind==='start'){if(await passStart(P))return}}
  arrive(P,true)}
/* passing the start: lap bonus with 🗼, and the win check */
async function passStart(P){if(P.cp){const b=LAP+G.sq.filter(s=>s.kind==='land'&&s.o===P.i).length*5;P.cash+=b;P.cp=false;snd('lap');floatTxt(0,'+'+b);say(`${P.ico} 1周！ ✨+${b}`);render();await wait(G.fast?0:500)}
  if(worth(P)>=GOAL){end(P===G.P[0],false,P);return true}return false}
async function arrive(P,moved){const s=landOf(P.pos);
  if(s.kind==='gift')await giftSq(P);
  else if(s.kind==='land'){if(s.o<0)await (P.k==='me'?placeMe(s):aiPlace(P,s));else if(s.o===P.i)await (P.k==='me'?ownMe(s):aiOwn(P,s));else await (P.k==='me'?foeLandMe(s):aiFoeLand(P,s))}
  if(!G)return;render();await wait(G.fast?0:P.k==='me'?250:350);nextTurn()}
function nextTurn(){if(!G)return;G.turn=(G.turn+1)%3;if(G.turn===0){G.round++;if(G.round>MAX_ROUND){const best=G.P.slice().sort((a,b)=>worth(b)-worth(a))[0];return end(best===G.P[0],false,best,true)}myTurn()}else aiTurn(G.P[G.turn])}

/* ================================================================ 🎁 supports */
async function giftSq(P){const three=H.shuffle(SPK.slice()).slice(0,3);
  if(P.k!=='me'){const k=pickL(three);if(!giveSup(P,k)){P.sup.shift();P.sup.push(k)}say(`${P.ico} 🎁 サポートを もらった`);floatTxt(P.pos,'🎁');return}
  snd('sup');await new Promise(res=>{const o=C.ov(`<div class="cgbuy cgnote kgift"><b>🎁 サポートを 1まい えらぶ</b>${P.sup.length>=SUP_MAX?'<small>3まい もっているので、 えらぶと いちばん 古い ものと 入れかわる</small>':''}
      <div class="kgs">${three.map(k=>`<button data-k="${k}"><span>${SP[k][0]}</span><b>${esc(SP[k][1])}</b><small>${esc(SP[k][2])}</small></button>`).join('')}</div><button id="kgn" class="sub">いらない</button></div>`,'by');o.dataset.stay=1;
    o.querySelectorAll('[data-k]').forEach(b=>b.onclick=()=>{const k=b.dataset.k;if(!giveSup(P,k)){P.sup.shift();P.sup.push(k)}sf('pickup');C.closeOv();say(`🎁 ${SP[k][0]} ${esc(SP[k][1])} を もらった`);res()});
    $('kgn').onclick=()=>{sf('back');C.closeOv();res()}})}

/* ================================================================ your land actions */
/* an empty land: which card? (cost / 🎨 same color / 🔗 combo with a land next to it) */
function tagsFor(id,s,P){const I=C.info(id),t=[];if(I.a===s.at)t.push('🎨');
  if(nbrs(s.i).some(j=>{const u=landOf(j);return u.o===P.i&&hc(I,C.info(u.id))}))t.push('🔗');return t}
async function placeMe(s){const P=me(),A=ATTR[s.at];
  const id=await new Promise(res=>{const o=C.ov(`<div class="cgbuy kplace"><b>${A[1]} ${esc(A[2])}の 空き地</b><small>カードを 置くと 自分の 土地。 🎨同じ なかま＝守り+3・🔗となりと コンボ＝通行料2ばい</small>
      <div class="khand big">${P.hand.map(id=>{const t=tagsFor(id,s,P),c=costOf(id);return cardChip(id,P,{dis:c>P.cash,tag:`${t.join('')} ✨${c}`,cls:t.length?'hot':''})}).join('')}</div>
      <button id="kpn" class="sub">置かない</button></div>`,'by');o.dataset.stay=1;
    o.querySelectorAll('.khc').forEach(b=>b.onclick=()=>{C.closeOv();res(b.dataset.h)});$('kpn').onclick=()=>{sf('back');C.closeOv();res(null)}});
  if(!id)return;await putCard(P,s,id,true)}
/* putting a card down: a question on it (正解で 💪げんき) */
async function putCard(P,s,id,quiz){const I=C.info(id),c=costOf(id);P.cash-=c;P.hand.splice(P.hand.indexOf(id),1);
  let ok=Math.random()<(P.p||0);
  if(P.k==='me'&&quiz){const r=await askOn(I,{tag:'🏠 置く',top:`<div class="kqtop">正解で <b>💪げんき（❤+4）</b></div>`});ok=r.ok&&!r.hint;rec(id,r.ok);G.res.placed++}
  G.st.placed++;s.o=P.i;s.id=id;s.lv=1;s.val=c;s.hb=ok?4:0;snd('place');render();burst(cellEl(s.i),PCOL[P.i]);
  const cb=combosAt(s.i);
  if(cb.length){const c0=cb[0].c;snd('combo');render();glow([s.i,...cb.map(x=>x.j)]);
    if(P.k==='me'){G.res.combos.push(c0.k);const nw=C.foundCombo(c0);if(nw){G.res.newCombo.push(c0.k);H.addCoins(10)}C.speak(c0.p);await cutin('🔗 コンボ！',`${esc(c0.p)}<br>${esc(c0.j)}`,'combo',1100);say(`🔗 <b>${esc(c0.p)}</b>（${esc(c0.j)}） 通行料が 2ばい！${nw?' <em>新コンボ発見 🪙10</em>':''}`)}
    else say(`${P.ico} 🔗 <b>${esc(c0.p)}</b> の コンボ土地を つくった！`)}
  else{const w=P.k==='me'&&nbrs(s.i).map(j=>{const u=landOf(j);if(u.o!==P.i)return null;const J=C.info(u.id);return C.wrongOf(I.h,J.h)||C.wrongOf(J.h,I.h)}).find(Boolean);
    if(w){C.metWrong(w);G.res.wrong.push(w.k);await note(`<b>⚠️ まちがいコンボ</b><p><s>${esc(w.a)} ${esc(w.b)}</s> → <b>${esc(w.ok)}</b></p><small>${esc(w.why)}</small>`,'なるほど');C.speak(w.ok)}
    say(`${P.ico} <b>${esc(W_(I))}</b> を 置いた${ok&&P.k==='me'?' 💪げんき！':''}`)}
  await wait(G.fast?0:300)}
function glow(is){is.forEach(i=>{const el=cellEl(i);if(el){el.classList.add('kglow');burst(el,'#ffe14a',8)}})}
async function ownMe(s){const P=me(),up=s.lv<4?UP[s.lv+1]:0,I=C.info(s.id);
  const a=await new Promise(res=>{const o=C.ov(`<div class="cgbuy kplace"><b>🏠 自分の 土地: ${esc(W_(I))} ${'⭐'.repeat(s.lv)}</b><small>通行料 ✨${tollOf(s.i)}</small>
    <div class="row">${up?`<button id="kup" ${P.cash<up?'disabled':''}>⭐ レベルアップ ✨${up}</button>`:''}<button id="ksw" class="sub" ${P.hand.length?'':'disabled'}>🔁 カード入れかえ</button></div><button id="kno" class="sub">そのまま</button></div>`,'by');o.dataset.stay=1;
    if($('kup'))$('kup').onclick=()=>{C.closeOv();res('up')};$('ksw').onclick=()=>{C.closeOv();res('sw')};$('kno').onclick=()=>{sf('back');C.closeOv();res(null)}});
  if(a==='up')levelUp(P,s);
  else if(a==='sw'){const id=await new Promise(res=>{const o=C.ov(`<div class="cgbuy kplace"><b>🔁 どの カードと 入れかえる？</b><small>${esc(W_(I))} は 手札に もどる（レベルは そのまま。 ✨は いらない）</small><div class="khand big">${P.hand.map(id=>cardChip(id,P,{tag:tagsFor(id,s,P).join('')||' '})).join('')}</div><button id="kpn" class="sub">やめる</button></div>`,'by');o.dataset.stay=1;
      o.querySelectorAll('.khc').forEach(b=>b.onclick=()=>{C.closeOv();res(b.dataset.h)});$('kpn').onclick=()=>{C.closeOv();res(null)}});
    if(id){P.hand.splice(P.hand.indexOf(id),1);P.hand.push(s.id);s.id=id;s.hb=0;snd('place');render();burst(cellEl(s.i),PCOL[0]);const cb=combosAt(s.i);
      if(cb.length){const c0=cb[0].c;snd('combo');glow([s.i,...cb.map(x=>x.j)]);G.res.combos.push(c0.k);const nw=C.foundCombo(c0);if(nw){G.res.newCombo.push(c0.k);H.addCoins(10)}C.speak(c0.p);await cutin('🔗 コンボ！',`${esc(c0.p)}<br>${esc(c0.j)}`,'combo',1100)}
      say(`🔁 <b>${esc(W_(C.info(id)))}</b> に 入れかえた`)}}}
function levelUp(P,s){const up=UP[s.lv+1];if(!up||P.cash<up)return false;G.st.ups++;P.cash-=up;s.lv++;s.val+=up;snd('up');render();burst(cellEl(s.i),'#ffe14a');floatTxt(s.i,'⭐'+s.lv);say(`${P.ico} ${esc(W_(C.info(s.id)))} が ⭐${s.lv}！ 通行料 ✨${tollOf(s.i)}`);return true}

/* ================================================================ paying */
async function pay(P,s){const Q=G.P[s.o];let t=tollOf(s.i);const cb=combosAt(s.i);
  if(Q.flag.tax){t*=2;Q.flag.tax=0}
  if(P.flag.free){P.flag.free=0;say(`${P.ico} 🎫 通行料パス！`);floatTxt(s.i,'🎫');await wait(G.fast?0:600);return}
  if(cb.length&&!G.fast){const c0=cb[0].c;glow([s.i,...cb.map(x=>x.j)]);snd('combo');C.speak(c0.p);await cutin(`🔗 ${esc(c0.p)}`,`${esc(c0.j)}　通行料 2ばい！`,Q.k==='me'?'combo':'foe',1000)}
  /* not enough? sell the cheapest lands */
  while(P.cash<t){const ls=G.sq.filter(x=>x.kind==='land'&&x.o===P.i).sort((a,b)=>a.val-b.val);if(!ls.length)break;const x=ls[0];P.cash+=Math.round(x.val*.7);P.disc.push(x.id);x.o=-1;x.id=null;x.lv=0;x.val=0;x.hb=0;say(`${P.ico} ✨が たりなくて 土地を 手ばなした…`);render();await wait(G.fast?0:500)}
  const paid=Math.min(t,P.cash);P.cash-=paid;Q.cash+=paid;G.st.tolls++;G.st.toll+=paid;
  if(Q.k==='me'){G.res.toll+=paid;snd('coin',Math.ceil(paid/8))}else if(P.k==='me')snd('pay');else snd('coin',2);
  floatTxt(s.i,(Q.k==='me'?'+':'')+paid+'✨',Q.k==='me'?'#ffe14a':'#ff9a9a');render();
  say(`${P.ico} → ${Q.ico} 通行料 <b>✨${paid}</b>${cb.length?' 🔗':''}`);await wait(G.fast?0:Q.k==='me'?700:500)}

/* ================================================================ ⚔ the one-time battle */
/* the numbers before the question: what you need */
function battleNums(P,id,s,sups){const D=G.P[s.o],I=C.info(id),S=bs(id,P),T=C.info(s.id),TS=bs(s.id,D);let a=S.a;const why=[];
  if(sups.includes('pow')){a+=6;why.push('⚔️+6')}if(sups.includes('crit')){a=Math.round(a*1.5);why.push('💥×1.5')}
  if(C.ruleOn('counter')&&C.anto(I.h).includes(T.h)){a=Math.round(a*1.5);why.push('⚡反対語×1.5')}
  const g=sups.includes('pierce')?[]:guardOf(s.i);return {a,why,h:TS.h,g,gs:gsum(g),d:TS.d,base:TS.h+gsum(g)}}
async function foeLandMe(s){const P=me(),D=G.P[s.o],T=C.info(s.id),t=tollOf(s.i)*(D.flag.tax?2:1);
  const atkSup=P.sup.map((k,i)=>[k,i]).filter(([k])=>SP[k][3]==='atk'||SP[k][3]==='both');let use=[];
  const choose=()=>new Promise(res=>{const draw_=()=>{const rows=P.hand.map(id=>{const n=battleNums(P,id,s,use);const sure=n.a>=n.base+n.d,maybe=n.a>=n.base;
        return cardChip(id,P,{tag:sure?'⭕ 勝てる':maybe?'🔺 五分':'✖ むり',cls:sure?'hot':maybe?'mid':'cold',atk:n.a})}).join('');
      const g=guardOf(s.i),TS=bs(s.id,D);
      const o=C.ov(`<div class="cgbuy kfight"><div class="kfoe">${C.face(s.id,{mini:1,ja:1,st:{a:TS.a,d:TS.d}})}<div><b>${D.ico} ${esc(D.n)}の 土地</b><p>❤${TS.h}${use.includes('pierce')||!g.length?'':' ＋守り '+g.map(x=>x[0]+x[1]).join(' ')}<br><small>🛡${TS.d}（相手が 正解すると くわわる）</small></p><p class="ktoll">通行料 ✨${t}${P.flag.free?' → 🎫0':''}</p></div></div>
        <small class="khow">手札で 勝負: ⚔ が ❤＋守り に とどいたら うばえる。 正解すれば… ⭕勝てる 🔺相手が まちがえたら 勝てる</small>
        <div class="khand big">${rows}</div>
        ${atkSup.length?`<div class="kusesup">${atkSup.map(([k,i])=>`<button data-u="${i}" class="${use.includes(k)?'on':''}">${SP[k][0]} ${esc(SP[k][1])}</button>`).join('')}</div>`:''}
        <button id="kpay" class="sub">💰 通行料を 払う</button></div>`,'by');o.dataset.stay=1;
      o.querySelectorAll('.khc').forEach(b=>b.onclick=()=>{C.closeOv();res(b.dataset.h)});
      o.querySelectorAll('[data-u]').forEach(b=>b.onclick=()=>{const k=P.sup[+b.dataset.u];const j=use.indexOf(k);if(j>=0)use.splice(j,1);else use.push(k);sf('tap');H.toast(spLine(k),1800);draw_()});
      $('kpay').onclick=()=>{C.closeOv();res(null)}};draw_()});
  const id=await choose();if(!id)return pay(P,s);
  use.forEach(k=>{const j=P.sup.indexOf(k);if(j>=0)P.sup.splice(j,1)});await fight(P,id,s,use)}
/* AI on defense picks a support when it would lose */
function aiDefSup(D,n,atkSups){const out=[];if(D.sup.includes('cancel')&&atkSups.length&&Math.random()<.8)out.push('cancel');
  if(n.a>=n.base+n.d){if(D.sup.includes('wall')&&n.a<=n.base+n.d+8)out.push('wall');else if(D.sup.includes('mirror')&&n.a/2<=n.base+n.d)out.push('mirror')}
  if(D.sup.includes('retry')&&Math.random()<.5)out.push('retry');out.forEach(k=>D.sup.splice(D.sup.indexOf(k),1));return out}
/* the fight itself: P attacks land s with card id */
async function fight(P,id,s,atkSup){G.st.fights++;const D=G.P[s.o],I=C.info(id),T=C.info(s.id);G.busy=true;
  let defSup=[];
  if(D.k==='me'){defSup=await myDefSup(P,id,s,atkSup)}else defSup=aiDefSup(D,battleNums(P,id,s,atkSup),atkSup);
  if(defSup.includes('cancel')){atkSup=[]}if(atkSup.includes('cancel')){defSup=defSup.filter(k=>k==='cancel')}
  const n=battleNums(P,id,s,atkSup);if(defSup.includes('wall'))n.base+=8;
  snd('clash');if(!G.fast){flash('rgba(255,255,255,.35)');await cutin('⚔️ 勝負！',`${esc(W_(I))} ⚔${n.a}　vs　${esc(W_(T))} ❤${n.base}`,P.k==='me'?'combo':'foe',900)}
  /* attacker's question (your card) */
  let am=1;
  if(P.k==='me'){let r=await askOn(I,{tag:'⚔ うばう',top:`<div class="kqtop">正解で ⚔${n.a}・まちがいで 半分</div>`});rec(id,r.ok);
      if(!r.ok&&atkSup.includes('retry')){r=await askOn(I,{tag:'🔄 もう1問'});rec(id,r.ok)}am=r.ok?(r.hint?.85:1):.5}
  else am=Math.random()<P.p?1:.5;
  /* defender's question (on the attacking card): 🛡 works if right (fast = 2ばい) */
  let gd=0;
  if(D.k==='me'){let r=await askOn(I,{tag:'🛡️ 守る',top:`<div class="kqtop">${P.ico} の カードの 問題。 正解で 🛡${n.d}（はやいと 2ばい）</div>`});G.res.q.push({id,ok:r.ok,foe:1});C.record(id,r.ok);
      if(!r.ok&&defSup.includes('retry')){r=await askOn(I,{tag:'🔄 もう1問'});C.record(id,r.ok)}gd=r.ok?(r.ms<4500&&!r.hint?2:1):0}
  else gd=Math.random()<D.p?1:0;
  let atk=Math.round(n.a*am);if(defSup.includes('mirror'))atk=Math.round(atk/2);
  const def=n.base+n.d*gd,win=atk>=def;
  render();
  /* the show: numbers clash */
  if(!G.fast){const o=C.ov(`<div class="kclash ${win?'win':'lose'}"><div class="kcs a"><span>${C.art(I)[0]}</span><b>⚔${atk}</b><small>${esc(W_(I))}${am<1?' （まちがいで 半分）':''}</small></div><div class="kvs2">VS</div>
      <div class="kcs d"><span>${C.art(T)[0]}</span><b>❤${def}</b><small>${esc(W_(T))}${gd?` 🛡${gd===2?'×2':''}`:''}${defSup.length?' '+defSup.map(k=>SP[k][0]).join(''):''}</small></div>
      <p class="kres">${win?`${P.ico} うばった！`:`${D.ico} 守った！`}</p></div>`,'kcl');o.dataset.stay=1;
    snd(win?'boom':'shield');if(win)flash(P.k==='me'?'rgba(255,225,74,.4)':'rgba(255,80,80,.35)');await wait(1500);C.closeOv()}
  P.disc.push(id);
  if(win){G.st.took++;D.disc.push(s.id);s.o=P.i;s.id=id;s.hb=0;P.hand.splice(P.hand.indexOf(id),1);P.disc.splice(P.disc.lastIndexOf(id),1);
    if(P.k==='me')G.res.took++;if(D.k==='me')G.res.lost++;render();burst(cellEl(s.i),PCOL[P.i],18);say(`${P.ico} ⚔ <b>${esc(W_(I))}</b> が ${esc(W_(T))} の 土地を うばった！`);await wait(G.fast?0:500)}
  else{P.hand.splice(P.hand.indexOf(id),1);say(`${D.ico} ${esc(W_(T))} が 守った！`);snd('fail');await wait(G.fast?0:400);await pay(P,s)}}
/* your defense: maybe a support first */
function myDefSup(P,id,s,atkSup){const D=me(),ds=D.sup.map((k,i)=>[k,i]).filter(([k])=>SP[k][3]==='def'||SP[k][3]==='both');
  const n=battleNums(P,id,s,atkSup),I=C.info(id),T=C.info(s.id);
  return new Promise(res=>{let use=[];const draw_=()=>{const o=C.ov(`<div class="cgbuy kfight"><b>${P.ico} ${esc(P.n)}が 勝負に きた！</b>
      <div class="kvsr"><span>${C.art(I)[0]} <b>${esc(W_(I))}</b><br>⚔${n.a}${atkSup.length?' '+atkSup.map(k=>SP[k][0]).join(''):''}</span><span>VS</span><span>${C.art(T)[0]} <b>${esc(W_(T))}</b><br>❤${n.base+(use.includes('wall')?8:0)} ＋🛡${n.d}</span></div>
      <small class="khow">${esc(W_(I))} の 問題に 正解すると 🛡${n.d} が きく（はやいと 2ばい）</small>
      ${ds.length?`<div class="kusesup">${ds.map(([k,i])=>`<button data-u="${i}" class="${use.includes(k)?'on':''}">${SP[k][0]} ${esc(SP[k][1])}</button>`).join('')}</div>`:''}
      <button id="kdgo">🛡️ 守る！</button></div>`,'by');o.dataset.stay=1;
    o.querySelectorAll('[data-u]').forEach(b=>b.onclick=()=>{const k=D.sup[+b.dataset.u];const j=use.indexOf(k);if(j>=0)use.splice(j,1);else use.push(k);sf('tap');H.toast(spLine(k),1800);draw_()});
    $('kdgo').onclick=()=>{C.closeOv();use.forEach(k=>{const j=D.sup.indexOf(k);if(j>=0)D.sup.splice(j,1)});res(use)}};draw_()})}

/* ================================================================ the others */
async function aiTurn(P){G.busy=true;G.waitRoll=false;draw(P,1);render(`${P.ico} ${esc(P.n)}の ターン`);snd('foe');await wait(G.fast?0:450);
  /* supports before the dice */
  for(let n=P.sup.length-1;n>=0;n--){const k=P.sup[n],t=SP[k][3];
    if(t==='turn'&&(k==='well'&&P.cash<60||k==='draw'&&P.hand.length<3||k==='build'&&P.cash<200&&G.sq.some(s=>s.kind==='land'&&s.o===P.i&&s.lv<4)||k==='free'&&Math.random()<.4||k==='tax'&&G.sq.filter(s=>s.kind==='land'&&s.o===P.i).length>=3&&Math.random()<.5||k==='steal'&&Math.random()<.5||k==='swap'&&P.hand.every(id=>costOf(id)>P.cash)))
      {await useTurnSup(P,n);await wait(G.fast?0:500)}}
  const rk=P.sup.findIndex(k=>SP[k][3]==='roll');if(rk>=0&&Math.random()<.35)await useTurnSup(P,rk);
  roll()}
/* where to go with the chosen dice: an empty land or own land; warp: the best empty land */
function aiDice(P){let best=1,sc=-99;for(let v=1;v<=6;v++){const s=landOf((P.pos+v)%N);const x=s.kind!=='land'?(s.kind==='gift'?2:0):s.o<0?5:s.o===P.i?3:-tollOf(s.i)/10;if(x>sc){sc=x;best=v}}return best}
function aiWarp(P){const e=G.sq.filter(s=>s.kind==='land'&&s.o<0);return e.length?pickL(e).i:5}
async function aiPlace(P,s){const can=P.hand.filter(id=>costOf(id)<=P.cash-10);if(!can.length||Math.random()<(1-P.p)*.6)return;
  const smart=Math.random()<P.p;const sc=id=>(smart?tagsFor(id,s,P).length*10:0)+bs(id,P).h+bs(id,P).a/2;const id=can.sort((a,b)=>sc(b)-sc(a))[0];await putCard(P,s,id,false)}
async function aiOwn(P,s){if(s.lv<4&&P.cash>UP[s.lv+1]+40&&Math.random()<.8)levelUp(P,s);await wait(G.fast?0:300)}
async function aiFoeLand(P,s){const D=G.P[s.o];if(G.F.sp.k==='easy'&&D.k==='me'&&G.round<=3)return pay(P,s);
  const sups=P.sup.filter(k=>SP[k][3]==='atk');let best=null;
  for(const id of P.hand){for(const use of [[],...sups.map(k=>[k])]){const n=battleNums(P,id,s,use);const need=n.base+n.d*.7;if(n.a>=need&&(!best||use.length<best.use.length||n.a-need>best.m))best={id,use,m:n.a-need}}}
  if(best&&(tollOf(s.i)>=10||Math.random()<.5)){best.use.forEach(k=>P.sup.splice(P.sup.indexOf(k),1));if(best.use.length){snd('sup');say(`${P.ico} ${best.use.map(k=>SP[k][0]+SP[k][1]).join('・')}！`);await wait(G.fast?0:500)}
    return fight(P,best.id,s,best.use)}
  return pay(P,s)}

/* ================================================================ quiz helpers */
let qtype=null;
function askOn(I,opt={}){return new Promise(res=>{const t0=Date.now();const q=C.quiz(I,{avoid:qtype,n:4});qtype=q.t;
  const o=C.ov(`<div class="cgbq">${opt.top||''}<div id="bqz"></div></div>`,'bq');o.dataset.stay=1;
  C.ask($('bqz'),q,r=>{r.ms=Date.now()-t0;C.closeOv();res(r)},{tag:opt.tag,fast:true})})}
function rec(id,ok){const up=C.record(id,ok);G.res.q.push({id,ok});if(up)G.res.stars.push([id,up])}
function note(html,btn='OK'){return new Promise(res=>{const o=C.ov(`<div class="cgbuy cgnote">${html}<button id="ntok">${btn}</button></div>`,'by');o.dataset.stay=1;$('ntok').onclick=()=>{sf('step');C.closeOv();res()}})}

/* ================================================================ 🎴 your 5 cards */
let pkLv='all',pkPage=0;
function pickScreen(F,F2,go,back){const own=myCards().filter(id=>C.info(id));let sel=[];const LVS=['es','jh','hs','adv'].filter(l=>own.some(id=>C.info(id).lv===l));
  const draw_=()=>{const list=own.filter(id=>pkLv==='all'||C.info(id).lv===pkLv).sort((a,b)=>{const A=bs(a),B=bs(b);return (B.a+B.h)-(A.a+A.h)});const per=24,pages=Math.max(1,Math.ceil(list.length/per));if(pkPage>=pages)pkPage=0;
    let tip='';for(let i=0;i<sel.length;i++)for(let j=i+1;j<sel.length;j++){const c=hc(C.info(sel[i]),C.info(sel[j]));if(c)tip=C.rec().combo[c.k]?`🔗 <b>${esc(c.p)}</b>`:'✨ なにか おきそう…'}
    H.show('cg',`<section class="pnl cgp kpick"><div class="qtop"><button class="x" id="cgb" aria-label="もどる">←</button><b>🎴 デッキ</b><span class="qn">${sel.length}/${PICK_N}</span></div>
      <div class="kvsl">${F.ico}${F2.ico} <b>${esc(F.n)}・${esc(F2.n)}</b> と 島めぐり</div>
      <p class="pktip">すきな カードを ${PICK_N}まいまで えらぶ。 のこり ${DECK_N-PICK_N}まいは 手持ちから ランダム${tip?'<br>'+tip:''}</p>
      <div class="kchosen">${[0,1,2,3,4].map(i=>sel[i]?cardChip(sel[i],me_(),{tag:'✕'}):'<span class="kslot"></span>').join('')}</div>
      <div class="seg cgsg">${['all',...LVS].map(l=>`<button data-l="${l}" class="${pkLv===l?'on':''}">${l==='all'?'ぜんぶ':C.LV[l].k}</button>`).join('')}</div>
      <div class="khand pool">${list.slice(pkPage*per,pkPage*per+per).map(id=>cardChip(id,me_(),{cls:sel.includes(id)?'on':'',tag:sel.includes(id)?'✔':' '})).join('')}</div>
      ${pages>1?`<div class="row cgpg"><button class="sub" data-p="-1" ${pkPage?'':'disabled'}>◀</button><span>${pkPage+1}/${pages}</span><button class="sub" data-p="1" ${pkPage<pages-1?'':'disabled'}>▶</button></div>`:''}
      <button id="pkgo" class="pkgo">⛵ ${sel.length?'これで':'おまかせで'} しゅっぱつ</button></section>`);
    $('cgb').onclick=()=>{sf('back');back()};
    H.panel.querySelectorAll('[data-l]').forEach(b=>b.onclick=()=>{pkLv=b.dataset.l;pkPage=0;sf('tap');draw_()});
    H.panel.querySelectorAll('[data-p]').forEach(b=>b.onclick=()=>{pkPage+=+b.dataset.p;sf('tap');draw_()});
    H.panel.querySelectorAll('.kchosen .khc').forEach(b=>b.onclick=()=>{sel.splice(sel.indexOf(b.dataset.h),1);sf('back');draw_()});
    H.panel.querySelectorAll('.pool .khc').forEach(b=>b.onclick=()=>{const id=b.dataset.h,i=sel.indexOf(id);if(i>=0)sel.splice(i,1);else if(sel.length<PICK_N)sel.push(id);else{H.toast(`${PICK_N}まいまでだよ`);return}sf('tap');draw_()});
    $('pkgo').onclick=()=>{sf('step');go(sel.slice())}};
  draw_()}
const me_=()=>({k:'me'});

/* ================================================================ the end */
function end(win,gaveUp,who,byRound){if(!G)return;if(G.opt.sim){const G0=G,P=G.P;G=null;const rank=P.slice().sort((a,b)=>worth_(b,G0)-worth_(a,G0));window._kbEnd={win,rank:rank.map(x=>x===P[0]?'me':x.F.id),w:rank.map(x=>worth_(x,G0)),byRound,round:G0.round,st:G0.st};return}const F=G.F,R=C.rec(),res=G.res,before=C.rank(),foeLvBefore=foeLv(F);R.games=(R.games||0)+1;R.isl=(R.isl||0)+1;
  const rank=G.P.slice().sort((a,b)=>worth(b)-worth(a));
  let coins=win?F.coin+Math.round(G.F2.coin/2)+res.newCombo.length*5:gaveUp?0:Math.round(F.coin/3),gift=null;
  if(win){R.win[F.id]=(R.win[F.id]||0)+1;R.rp=(R.rp||0)+F.pt+(R.win[F.id]===1&&F.pt?1:0);gift=pickL(foeDeck(F,8));C.give(gift)}else if(!gaveUp)R.lose[F.id]=(R.lose[F.id]||0)+1;
  C.save();if(coins)H.addCoins(coins);const after=C.rank();
  const ok=res.q.filter(x=>x.ok).length,miss=[...new Set(res.q.filter(x=>!x.ok).map(x=>x.id))];
  const cb=G.opt.onEnd,back=G.opt.back,fid=F.id,P=G.P,G0=G;G=null;pickCell=null;C.closeOv();
  const nlv=win?foeLv(F):0,lvUp=win&&nlv>foeLvBefore;
  let mapN=null;try{if(win&&!cb&&window.ADV&&!ADV.has()&&Math.random()<.2)mapN=ADV.give()}catch(e){}
  if(win){snd('lap');setTimeout(()=>sf('fanfare'),500);confetti();try{const r=H.panel.getBoundingClientRect();FX.firework(r.left+r.width/2,r.top+80)}catch(e){}}else{sf('done');flash('rgba(0,0,30,.5)')}
  const lines=win?F.win:F.lose;
  H.show('cgb',`<section class="pnl cgp cgend ${win?'won':'lost'}">
    <div class="qtop"><span></span><b>${win?'🏆 かち！':gaveUp?'🏳️ やめた':'🌙 まけ…'}</b><span></span></div>
    <div class="cgvs mini"><div class="vsf">${F.ico}</div><p class="en">${esc(lines[0])}</p><p class="ja">${esc(lines[1])}</p></div>
    <div class="krank">${rank.map((x,i)=>`<p class="${x.k==='me'?'me':''}"><b>${['🥇','🥈','🥉'][i]}</b> ${x.ico} ${esc(x.n)}</p>`).join('')}${byRound?'<small>ラウンドの 上限で 決着</small>':''}</div>
    <div class="cgsum"><span>⭕ ${ok}/${res.q.length}</span>${res.combos.length?`<span>🔗 ${res.combos.length}</span>`:''}${res.took?`<span>⚔ うばった ${res.took}</span>`:''}${res.toll?`<span>✨通行料 ${res.toll}</span>`:''}${coins?`<span>🪙+${coins}</span>`:''}${win&&F.pt?`<span>🎖️+${F.pt}</span>`:''}</div>
    ${after>before?`<div class="cgrank">🎖️ 段位アップ！ <b>${esc(CG_RANKS[after][0])}</b><small>${esc(CG_RANKS[after][2])} が ひらいた！</small></div>`:''}
    ${lvUp?`<p class="cglvup">${F.ico} ${esc(F.n)}が <b>Lv${nlv+1}</b> に パワーアップ！</p>`:''}
    ${mapN?`<div class="cgmap"><p>🗺️ ${esc(F.n)}から 宝の地図「${esc(mapN)}」を もらった！</p><button id="egoMap" class="sub">宝探しに 行く</button></div>`:''}
    ${gift?`<div class="cggift">${C.face(gift,{ja:1})}<p>${esc(F.n)}から カードを もらった！</p></div>`:''}
    ${res.newCombo.length?`<p class="cgnc">✨ 新コンボ: ${res.newCombo.map(k=>esc(C.COMBO.find(c=>c.k===k).p)).join('、 ')}</p>`:''}
    ${miss.length?`<details class="cgfold"><summary>📒 まちがえた 単語（${miss.length}）</summary><div class="cgsr">${miss.map(id=>{const I=C.info(id);return I?`<div class="cgrow"><span class="ri">${C.art(I)[0]}</span><span class="rn"><b>${esc(I.en)}</b><small>${esc(I.ja)}</small></span><button class="sub" data-say="${esc(id)}">🔊</button></div>`:''}).join('')}</div></details>`:''}
    <div class="row"><button id="eagain" class="sub">もう 1回</button><button id="eback" data-back>${cb?'つぎへ':'もどる'}</button></div>
  </section>`);
  H.panel.querySelectorAll('[data-say]').forEach(b=>b.onclick=()=>{const I=C.info(b.dataset.say);try{H.say(I.k==='t'?'cards':I.lv,I.en)}catch(e){}});
  $('eagain').onclick=()=>{sf('step');start(fid,{onEnd:cb,back})};$('eback').onclick=()=>{sf('back');cb?cb(win):back?back():menu()};
  if(cb)$('eagain').hidden=true;
  if($('egoMap'))$('egoMap').onclick=()=>{try{SFX.map()}catch(e){}ADV.open()};
  try{window.CGM&&CGM.afterGame&&CGM.afterGame(fid,win,{ok,n:res.q.length,combos:res.combos.length,newCombo:res.newCombo.length,rankUp:after>before})}catch(e){}
  if(win&&F.mina)try{CGM.minaWin&&CGM.minaWin()}catch(e){}}

/* ================================================================ the menu */
let menuBack=null;
const RULES=[['🎲 すすむ',0,'サイコロで 島を まわる。 あなた ＋ 相手 2人'],['🏠 置く',0,'空き地に 単語カードを 置くと 自分の 土地。 相手が 止まると 通行料。 置くときの 問題に 正解で 💪げんき'],
  ['🔗 ことばコンボ',0,'となりの 自分の 土地と 自然な 組み合わせ（heavy ＋ rain）なら 通行料 2ばい'],['🎨 色',0,'島の 1辺ごとに 色が ある。 同じ なかまの 単語は 守り+3。 同じ 色の 土地が ふえるほど 通行料アップ'],
  ['⚔ 勝負',0,'相手の 土地で 手札を 1まい 出す。 ⚔が ❤＋守りに とどいたら うばえる。 自分の カードの 問題を まちがえると ⚔半分'],['🛡️ 守る',0,'ねらわれたら 相手の カードの 問題。 正解で 🛡が きく（はやいと 2ばい）'],
  ['🎁 サポート',0,'1回 使うと なくなる 特別な カード。 3まいまで。 🎁マスで もらえる'],['⭐ レベル',0,'自分の 土地に 止まると レベルアップ。 通行料と 守りが 上がる'],
  ['🏁 勝ち',0,`ことだま＋土地の ねうちが ✨${GOAL}を こえて スタートに もどる。 🗼を 通って もどると 1周ボーナス`],
  ['⚡ 反対語',CG_RULE_AT.counter,'反対の 意味の 土地を ねらうと ⚔×1.5'],['🛡️ なかまガード',CG_RULE_AT.guard,'にた 意味の 自分の 土地が となりに あると 守り+3'],['⛓️ 3つながり',CG_RULE_AT.sent,'両どなりと コンボで つながった 土地は 通行料 3ばい']];
function menu(back){if(back)menuBack=back;const R=C.rec(),r=C.rank(),nx=CG_RANKS[r+1],rp=R.rp||0;
  H.show('cg',`<section class="pnl cgp">
    <div class="qtop"><button class="x" id="cgb" aria-label="もどる">←</button><b>🏝️ ことば島めぐり</b><span class="qn">${esc(CG_RANKS[r][0])}</span></div>
    <div class="cgrk"><b>🎖️ ${esc(CG_RANKS[r][0])}</b>${nx?`<i><u style="width:${Math.min(100,(rp-CG_RANKS[r][1])/(nx[1]-CG_RANKS[r][1])*100)}%"></u></i><small>つぎ ${esc(nx[0])}: ${esc(nx[2])}</small>`:'<small>最高段位！</small>'}</div>
    <p class="note">いっしょに まわる 相手を えらぼう（もう 1人は おまかせ）</p>
    <div class="cgfoes">${FOES.map(F=>{const lock=r<F.need;const w=R.win[F.id]||0;return `<button data-f="${F.id}" class="${lock?'lk':''} ${F.mina?'mina':''}"><span class="fi">${lock?'🔒':F.ico}</span><span class="fn"><b>${esc(F.n)}</b><small>${lock?esc(CG_RANKS[F.need][0])+'から':esc(F.d)}</small></span>${w?`<em>🏆${w}<small>Lv${Math.min(5,w)+1}</small></em>`:''}</button>`}).join('')}</div>
    <details class="cgfold"><summary>📘 ルール</summary>${RULES.map(([n,at,d])=>`<p class="${r>=at?'':'lk'}">${r>=at?'':'🔒 '}<b>${n}</b><br><small>${r>=at?d:esc(CG_RANKS[at][0])+'で ひらく'}</small></p>`).join('')}</details>
  </section>`);
  $('cgb').onclick=()=>{sf('back');(menuBack||C.open)()};
  H.panel.querySelectorAll('[data-f]').forEach(b=>b.onclick=()=>{const F=foe(b.dataset.f);if(r<F.need){H.toast(`🔒 ${esc(F.n)}とは <b>${esc(CG_RANKS[F.need][0])}</b> から`);return}sf('step');start(F.id,{back:()=>menu()})})}

window.CGB={start,menu,foes:FOES,foe,foeDeck,_state:()=>G,_begin:(id,id2,picked,opt)=>begin(foe(id),foe(id2),opt||{},picked||[]),GOAL,SP};
})();
