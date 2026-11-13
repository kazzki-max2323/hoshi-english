/* ことばカードの 対戦。 カードの しくみは game/cg.js
   - カードには ⚔攻撃力・🛡防御力・❤HP。 むずかしい 単語ほど 数字が 高い（問題も むずかしい）。 ★で 育つ
   - デッキ（15まいまで）から 4まいが ランダムで 出る。 場に 3まい、 のこりは ひかえ。 HPが 0に なると たおれて ひかえが 出る
   - 相手の カードを ぜんぶ たおしたら 勝ち
   - 攻撃: その カードの 問題に 正解で ⚔そのまま、 はやく 正解で クリティカル（1.5ばい）、 まちがいで 半分
     苦手カードで 正解すると 逆転（2ばい）、 わすれかけカードは 1.5ばい
   - 防御: 攻撃してきた 相手の カードの 問題に 正解で 🛡が きく（はやいと 2ばい）。 まちがいで そのまま うける
     （相手の デッキの いろんな 単語に 出会える。 自分の 強い カードばかりの 問題に ならない）
   - ⏳ チャージ: 強い カードほど、 攻撃した あと 休む ターンが 長い（小0・中1・高2・H3。宝カードは レア度で）。
     強い カードは ここぞの 一撃、 そのあいだは ほかの カードで 戦う
   - ことばコンボ: 場の 2まいが 自然な 組み合わせ（heavy + rain）なら 合体攻撃＝⚔の 合計×1.5で 防御むし。
     英語で 言わない 組み合わせ（strong rain）は 不発で、 正しい 言い方を 教えてくれる
   - 段位で ひらく: ⚡ 反対語アタック（2ばい）／🛡️ なかまガード（同じ なかまが ならぶと 🛡+2）／⛓️ 必殺（3まいが コンボで つながると 相手の 場 ぜんぶに 攻撃）
   - 浜辺の みんなは テーマデッキと 得意技を もっていて、 勝つたびに 強くなる */
(()=>{
const {S:ST,sfx:SFX}=BEACH;
const H=HE,esc=H.esc,$=id=>document.getElementById(id);
const C=CG,pickL=C.pickL;
const sf=k=>{try{SFX[k]&&SFX[k]()}catch(e){}};
const wait=ms=>new Promise(r=>setTimeout(r,ms));
const FOES=CG_FOES,foe=id=>FOES.find(f=>f.id===id);
const ML=(k,v)=>{try{return MINA.line(k,v||{})}catch(e){return ['','']}};
const W_=x=>x.en.split(',')[0];

/* ================================================================ the opponent */
/* their deck: their kind of words, with a combo pair or two */
function foeDeck(F,n){n=n||(F.mina?5:4);const lv=F.lv,pool=C.W.filter(c=>lv.includes(c.lv)&&(!F.at.length||F.at.includes(c.a))),all=C.W.filter(c=>lv.includes(c.lv));
  const ids=[],cs=C.COMBO.filter(c=>{const a=C.cardOfHead(c.a),b=C.cardOfHead(c.b);return lv.includes(a.lv)&&lv.includes(b.lv)});
  const fav=cs.filter(c=>!F.at.length||F.at.includes(C.cardOfHead(c.a).a)||F.at.includes(C.cardOfHead(c.b).a));
  H.shuffle((fav.length>=4?fav:cs).slice()).slice(0,F.mina?2:1).forEach(c=>{const a=C.cardOfHead(c.a).id,b=C.cardOfHead(c.b).id;if(!ids.includes(a)&&!ids.includes(b))ids.push(a,b)});
  while(ids.length<n){const c=pickL(pool.length>10?pool:all);if(!ids.includes(c.id))ids.push(c.id)}
  return H.shuffle(ids.slice(0,n))}
/* stronger people have grown cards; every win makes that person stronger next time (Lv1〜6) */
const foeStar=F=>F.mina?2:Math.max(0,Math.round((F.p-.6)*8));
const foeLv=F=>Math.min(5,(C.rec().win[F.id]||0));

/* ================================================================ sound & motion */
const SND={
  toss:()=>{noise(.16,{v:.06,f:1200,f2:4200,q:1.5})},
  slash:()=>{noise(.2,{v:.1,f:4000,f2:500,q:.8});tone(880,.14,'sawtooth',.025,0,180)},
  boom:()=>{noise(.55,{v:.14,type:'lowpass',f:1200,f2:70,q:.7});tone(120,.45,'sine',.1,0,38)},
  hurt:()=>{noise(.3,{v:.1,type:'lowpass',f:700,f2:120});tone(260,.28,'square',.035,0,90)},
  combo:()=>{[0,4,7,12,16].forEach((n,i)=>tone(523*Math.pow(2,n/12),.14,'square',.045,i*.06));noise(.4,{v:.04,type:'highpass',f:6000,delay:.3})},
  chain:()=>{SND.combo();[0,3,7,10,12,15,19,24].forEach((n,i)=>tone(392*Math.pow(2,n/12),.12,'sawtooth',.03,.35+i*.05))},
  charge:()=>{tone(180,.6,'sawtooth',.03,0,1200);noise(.6,{v:.04,f:400,f2:5000,q:3})},
  heal:()=>{[0,4,7,12].forEach((n,i)=>tone(660*Math.pow(2,n/12),.3,'sine',.05,i*.08))},
  shield:()=>{tone(1400,.35,'triangle',.05,0,1300);tone(2100,.25,'sine',.03,.02);noise(.2,{v:.05,type:'highpass',f:5000})},
  turn:()=>{tone(660,.08,'square',.04);tone(990,.12,'square',.04,.09)},
  foeTurn:()=>{tone(330,.1,'square',.04);tone(247,.16,'square',.04,.11)},
  rage:()=>{tone(90,.8,'sawtooth',.05,0,60);tone(95,.8,'sawtooth',.04,0,63);noise(.8,{v:.05,type:'lowpass',f:400})},
  ko:()=>{SND.boom();[784,659,523,392,784].forEach((f,i)=>tone(f,.18,'square',.04,.25+i*.1))}};
const snd=k=>{try{if(typeof tone==='function')SND[k]()}catch(e){}};
const calm=()=>window.matchMedia&&matchMedia('(prefers-reduced-motion:reduce)').matches;
function fxLayer(){let l=$('cgfx');if(!l){l=document.createElement('div');l.id='cgfx';document.body.appendChild(l)}return l}
function fxEl(cls,html,ms){const e=document.createElement('div');e.className=cls;e.innerHTML=html||'';fxLayer().appendChild(e);setTimeout(()=>e.remove(),ms||1200);return e}
function flash(col){if(calm())return;const e=fxEl('fxflash','',450);e.style.background=col||'#fff'}
function quake(big){const p=H.panel;if(!p||calm())return;p.classList.remove('quake','quake2');void p.offsetWidth;p.classList.add(big?'quake2':'quake')}
function cutin(big,small,cls,ms=1100){fxEl('fxcut '+(cls||''),`<div><b>${big}</b>${small?`<small>${small}</small>`:''}</div>`,ms+250);return wait(ms)}
function confetti(){if(calm())return;for(let i=0;i<70;i++){const e=fxEl('fxconf','',3600);e.style.cssText=`left:${Math.random()*100}vw;background:hsl(${Math.random()*360|0} 90% 62%);animation-delay:${(Math.random()*.9).toFixed(2)}s;--r:${Math.random()*900-450|0}deg;--dx:${Math.random()*90-45|0}px`}}

/* ================================================================ the cards on the field */
let B=null,uid=0;
const side=k=>B[k];
/* one card in battle: its numbers come from the card (and ★); today's wind adds ⚔1 */
function unit(id,k){const I=C.info(id),F=B.F;let S;
  if(k==='me'){S=C.cstat(id);if(I.a===C.wind()[0])S=Object.assign({},S,{a:S.a+1,w:1})}
  else{S=Object.assign({},C.cstat(id,Math.min(5,1+foeStar(F))));S.a+=Math.floor(B.lv/3)+(F.mina?1:0);S.h=Math.round(S.h*(1+B.lv*.07))}
  return {u:++uid,id,k,I,a:S.a,d:S.d,hp:S.h,max:S.h,w:S.w||0}}
const alive=k=>side(k).field.length+side(k).bench.length;
const hpSum=k=>[...side(k).field,...side(k).bench].reduce((a,x)=>a+Math.max(0,x.hp),0);
/* the same kind (なかま) side by side: 🛡+2 */
function buddy(x){if(!C.ruleOn('guard'))return false;const f=side(x.k).field;return f.some(y=>y!==x&&C.syn(x.I.h).includes(y.I.h))}
const defOf=x=>x.d+(buddy(x)?2:0);
const atkOf=x=>x.a+(x.k==='ai'&&B.rage?2:0)+(x.k==='ai'&&B.fx.boost?2:0);
/* ⏳ after attacking, strong cards rest (charge) for a few of their side's turns */
const chargeOf=x=>x.I.k==='t'?[0,0,0,1,2,3][x.I.r]||0:({es:0,jh:1,hs:2,adv:3})[x.I.lv]||0;
const nowOf=k=>k==='me'?B.turn:(B.aiN||0);
const wait_=x=>Math.max(0,(x.ready||0)-nowOf(x.k));
const ready=x=>!wait_(x);
function used(x){x.ready=nowOf(x.k)+chargeOf(x)+1}
const anti=(x,y)=>C.ruleOn('counter')&&C.anto(x.I.h).includes(y.I.h);
/* the combo between two cards on the field, either way round */
const comboOf=(x,y)=>(x.I.k==='w'||x.I.k==='t')&&(y.I.k==='w'||y.I.k==='t')?C.comboOf(x.I.h,y.I.h)||C.comboOf(y.I.h,x.I.h):null;
const wrongOf=(x,y)=>C.wrongOf(x.I.h,y.I.h)||C.wrongOf(y.I.h,x.I.h);
/* three cards tied by two combos */
function chainOf(us){if(us.length!==3)return null;const ps=[];for(let i=0;i<3;i++)for(let j=i+1;j<3;j++){const c=comboOf(us[i],us[j]);if(c)ps.push(c)}return ps.length>=2?ps.slice(0,2):null}

function start(id,opt={}){const F=foe(id);if(!F)return;
  if(!C.deckOk()){C.autoDeck();H.toast('🗂️ デッキを おまかせで 組んだよ<small>ショップの 「デッキ」で 入れかえられるよ</small>',3200)}
  const lv=foeLv(F);B={F,opt,lv,turn:0,me:{field:[],bench:[]},ai:{field:[],bench:[]},sel:[],busy:true,rage:false,spU:0,spN:lv>=2?2:1,fx:{},lastCombo:0,qtype:null,
    res:{q:[],combos:[],newCombo:[],wrong:[],stars:[],crit:0,anti:0}};
  const mine=C.battleDraw().map(id=>unit(id,'me')),theirs=foeDeck(F).map(id=>unit(id,'ai'));B.aiMax=theirs.reduce((a,x)=>a+x.hp,0);
  B.me.field=mine.slice(0,3);B.me.bench=mine.slice(3);B.ai.field=theirs.slice(0,3);B.ai.bench=theirs.slice(3);
  if(F.sp.k==='easy'){B.fx.easy=2;B.spU=9}
  sf('card');intro()}
function intro(){const F=B.F;
  C.ov(`<div class="cgvs"><div class="vsf">${F.ico}</div><b>${esc(F.n)}</b><p class="en">${esc(F.hi[0])}</p><p class="ja">${esc(F.hi[1])}</p>
    <p class="vslv">${'★'.repeat(B.lv+1)}<small>Lv${B.lv+1}${B.lv?' ・ 勝つたびに 強くなる':''}</small></p><p class="vssp">得意技 <b>${esc(F.sp.n)}</b><small>${esc(F.sp.d)}${B.spN>1&&F.sp.k!=='easy'?'（2回 くる！）':''}</small></p>
    <div class="vsdeal">${B.me.field.concat(B.me.bench).map(x=>C.face(x.id,{mini:1})).join('')}</div><small class="vsdn">きょうの メンバー（デッキから ランダム）</small><button id="vsgo">⚔️ 勝負！</button></div>`,'vs').dataset.stay=1;
  C.speak(F.hi[0]);snd('charge');$('vsgo').onclick=()=>{C.closeOv();snd('boom');flash('rgba(255,255,255,.5)');myTurn()}}

/* ================================================================ screen */
function unitHtml(x,o={}){const r=Math.max(0,x.hp)/x.max,cw=Math.min(chargeOf(x),x.k==='me'?Math.max(0,(x.ready||0)-B.turn-(B.aiPhase?1:0)):Math.max(0,(x.ready||0)-(B.aiN||0)-(B.aiPhase?0:1)));
  return `<div class="bu ${x.k} ${cw?'cd':''} ${o.sel?'sel':''} ${o.tgt?'tgt':''} ${o.enter?'enter':''}" data-u="${x.u}">${C.face(x.id,{mini:1,st:{a:atkOf(x),d:defOf(x)},marks:x.k==='me'})}
    ${cw?`<div class="bucd">⏳<b>${cw}</b></div>`:''}<div class="buhp ${r<.35?'low':''}"><i style="width:${r*100}%"></i><span>❤${Math.max(0,x.hp)}</span></div>
    <div class="bubf">${buddy(x)?'<i title="なかまガード">🛡️</i>':''}${x.w?'<i title="きょうの風">🌬️</i>':''}${o.anti?'<i class="ba">⚡</i>':''}</div></div>`}
function render(msg){if(!B)return;const F=B.F,me=B.me,ai=B.ai,sel=B.sel.map(u=>me.field.find(x=>x.u===u)).filter(Boolean),ent=B.enter||[];B.enter=[];
  H.show('cgb',`<section class="pnl cgbt" data-stay>
    <div class="qtop"><button class="x" id="bx" aria-label="やめる">←</button><b>⚔️ ${esc(F.n)} <small class="blv">Lv${B.lv+1}</small></b><span class="qn">ターン ${B.turn}</span></div>
    <div class="bside ai ${B.rage?'rage':''}"><span class="bfi">${F.ico}</span><span class="bben">${ai.bench.map(()=>'🂠').join('')}<small>${alive('ai')}まい</small></span>${B.rage?'<em class="brg">🔥 本気</em>':''}</div>
    <div class="bfrow ai">${ai.field.map(x=>unitHtml(x,{tgt:sel.length&&!B.busy,anti:sel.length===1&&anti(sel[0],x),enter:ent.includes(x.u)})).join('')}</div>
    <div class="bfield" id="bfield"><span>${msg||''}</span></div>
    <div class="bfrow me">${me.field.map(x=>unitHtml(x,{sel:B.sel.includes(x.u),enter:ent.includes(x.u)})).join('')}</div>
    <div class="bside me"><span class="bfi">🫵</span><span class="bben">${me.bench.map(()=>'🂠').join('')}<small>${alive('me')}まい</small></span></div>
    <div class="bsel" id="bsel">${selInfo(sel)}</div>
  </section>`);
  $('bx').onclick=quit;
  const pb=$('bpass');if(pb)pb.onclick=async()=>{if(B.busy)return;B.busy=true;sf('step');say('⏳ チャージ…');await wait(500);aiTurn()};
  H.panel.querySelectorAll('.bu.me').forEach(el=>el.onclick=()=>{if(B.busy)return;const u=+el.dataset.u,i=B.sel.indexOf(u);const x=B.me.field.find(y=>y.u===u);if(i<0&&x&&!ready(x)){sf('pop');H.toast(`⏳ ${esc(W_(x.I))} は チャージ中<small>あと ${wait_(x)}ターンで 使えるよ</small>`);return}if(i>=0)B.sel.splice(i,1);else B.sel.push(u);sf('tap');render(B.msg)});
  H.panel.querySelectorAll('.bu.ai').forEach(el=>el.onclick=()=>{if(B.busy)return;if(!B.sel.length){sf('pop');H.toast('さきに 自分の カードを えらんでね');return}act(ai.field.find(x=>x.u===+el.dataset.u))});
  const hb=$('bhis');if(hb)hb.onclick=()=>{if(!B.busy)act(null)}}
/* what happens with the chosen cards (combos you know show their name; new ones only sparkle) */
function selInfo(sel){if(B.busy)return '<span class="note">…</span>';
  if(!sel.length){const f=B.me.field;if(f.length&&!f.some(ready))return '<button id="bpass">⏳ みんな チャージ中… ためる（パス）</button>';let hint='';for(let i=0;i<f.length;i++)for(let j=i+1;j<f.length;j++)if(comboOf(f[i],f[j]))hint='<br><em>✨ 場に コンボが ありそう…</em>';
    return `<span class="note">自分の カードを えらんで、 相手の カードを タップ！${hint}</span>`}
  if(sel.length===1){const c=chargeOf(sel[0]);return `⚔ <b>${esc(W_(sel[0].I))}</b> で 攻撃 → 相手を タップ${c?`<br><em>⏳ 攻撃の あと ${c}ターン チャージ</em>`:''}`}
  if(sel.length===2){const c=comboOf(sel[0],sel[1]);return c?(C.rec().combo[c.k]?`🔗 <b>${esc(c.p)}</b> 合体攻撃！ → 相手を タップ`:'✨ なにか おきそう… → 相手を タップ'):'🔗 2まいで 合体… できるかな？ → 相手を タップ'}
  const ch=chainOf(sel);if(!C.ruleOn('sent'))return `⛓️ 必殺は <b>${esc(CG_RANKS[CG_RULE_AT.sent][0])}</b> から`;
  return ch?`<button id="bhis">⛓️ 必殺！ 相手の 場 ぜんぶに 攻撃</button>`:'⛓️ 3まいが コンボで つながらない…'}
function say(html){B.msg=html;const f=$('bfield');if(f){f.innerHTML='<span>'+html+'</span>';f.classList.remove('pop');void f.offsetWidth;f.classList.add('pop')}}
function quit(){if(B.busy)return;C.ov(`<div class="cgbuy"><b>対戦を やめる？</b><p class="note">やめると 負けに なるよ</p><button id="qy" class="sub">やめる</button><button id="qn">つづける</button></div>`,'by');
  $('qn').onclick=()=>{sf('step');C.closeOv()};$('qy').onclick=()=>{C.closeOv();end(false,true)}}

/* ================================================================ motion on the cards */
const elOf=x=>H.panel&&H.panel.querySelector(`.bu[data-u="${x.u}"]`);
function centerOf(el){const r=el.getBoundingClientRect();return [r.left+r.width/2,r.top+r.height/2]}
function burst(el,col,n=14){if(!el||calm())return;const xy=centerOf(el);
  for(let i=0;i<n;i++){const a=Math.random()*Math.PI*2,d=30+Math.random()*70,e=fxEl('fxp','',800);e.style.cssText=`left:${xy[0]}px;top:${xy[1]}px;--dx:${Math.cos(a)*d}px;--dy:${Math.sin(a)*d}px;background:${col||'#ffd36a'};width:${4+Math.random()*6}px`}}
/* the attacker jumps at the target */
async function lunge(x,t){const a=elOf(x),b=elOf(t);if(!a||!b||calm()||!a.animate)return;const [x1,y1]=centerOf(a),[x2,y2]=centerOf(b);
  a.style.zIndex=5;a.animate([{transform:'none'},{transform:`translate(${(x2-x1)*.75}px,${(y2-y1)*.75}px) scale(1.18) rotate(${x.k==='me'?-6:6}deg)`,offset:.45},{transform:'none'}],{duration:480,easing:'cubic-bezier(.3,.7,.4,1)'});
  await wait(220);a.style.zIndex=''}
/* damage on a card: number, sparks, shake, its HP bar */
function hurt(t,n,o={}){t.hp=Math.max(0,t.hp-n);const el=elOf(t);if(!el)return;const big=n>=10;
  const d=document.createElement('span');d.className='bdmg'+(big?' big':'')+(o.crit?' crit':'');d.textContent=(o.crit?'💥':'')+'-'+n;el.appendChild(d);setTimeout(()=>d.remove(),1200);
  if(t.k==='ai'){snd(big?'boom':'slash');burst(el,o.col||(big?'#ff9a3a':'#ffd36a'),big?20:11);if(big)flash('rgba(255,240,200,.45)')}else{snd('hurt');burst(el,'#ff5a7a',big?16:9);flash('rgba(255,40,70,.3)')}
  quake(big);el.classList.remove('hit');void el.offsetWidth;el.classList.add('hit');
  const r=t.hp/t.max,bar=el.querySelector('.buhp');bar.querySelector('i').style.width=r*100+'%';bar.querySelector('span').textContent='❤'+t.hp;bar.classList.toggle('low',r<.35)}
function heal(t,n){t.hp=Math.min(t.max,t.hp+n);const el=elOf(t);if(!el)return;const d=document.createElement('span');d.className='bdmg heal';d.textContent='+'+n;el.appendChild(d);setTimeout(()=>d.remove(),1200);
  burst(el,'#55e0b4',8);const bar=el.querySelector('.buhp');bar.querySelector('i').style.width=t.hp/t.max*100+'%';bar.querySelector('span').textContent='❤'+t.hp}
function guardFx(t,perfect){const el=elOf(t);if(!el)return;snd('shield');burst(el,'#9fe8ff',perfect?16:8);const g=document.createElement('span');g.className='bgd';g.textContent=perfect?'🛡️✨':'🛡️';el.appendChild(g);setTimeout(()=>g.remove(),900)}
/* fallen cards leave; the bench comes in */
async function sweep(){let any=false;for(const k of ['ai','me']){const S=side(k);for(const x of S.field.filter(y=>y.hp<=0)){any=true;const el=elOf(x);if(el)el.classList.add('ko');
      say(`${k==='ai'?'💫':'😵'} <b>${esc(W_(x.I))}</b> が たおれた！`);if(k==='ai')snd('ko')}}
  if(!any)return;await wait(650);
  B.enter=[];for(const k of ['ai','me']){const S=side(k);S.field=S.field.filter(y=>y.hp>0);while(S.field.length<3&&S.bench.length){const n=S.bench.shift();S.field.push(n);B.enter.push(n.u)}}
  B.sel=B.sel.filter(u=>B.me.field.some(x=>x.u===u));
  if(!B.rage&&B.F.id!=='nagi'&&alive('ai')===1&&B.ai.field.length){B.rage=true;render(B.msg);snd('rage');flash('rgba(255,60,60,.4)');quake(true);await cutin(`🔥 ${esc(B.F.n)} 本気モード！`,'さいごの 1まい ⚔+2','rage',1300)}
  render(B.msg)}

/* ================================================================ quizzes */
/* ask on a card (shown big); resolves {ok,hint} */
/* the card is shown with its picture covered (the picture would give the meaning away), and its name too unless the question shows it */
function askCard(I,q,opt={}){return new Promise(res=>{const t0=Date.now();const o=C.ov(`<div class="cgbq">${opt.top||''}${opt.card===false?'':C.face(I.id,{big:1,marks:true,nm:q.t==='mean'||q.t==='form'?opt.nm:'？？？',st:opt.st,cls:'qz'})}<div id="bqz"></div></div>`,'bq');o.dataset.stay=1;
  C.ask($('bqz'),q,r=>{const c=o.querySelector('.cgc.qz');if(c){c.classList.remove('qz');const n=c.querySelector('.cgn b');if(n)n.textContent=opt.nm||I.en.split(',')[0]}r.ms=Date.now()-t0;setTimeout(()=>{C.closeOv();res(r)},r.ok?250:0)},{noHint:B&&B.fx.hardNow,tag:opt.tag,fast:true})})}
function qFor(I,opt={}){const q=C.quiz(I,{avoid:B.qtype,n:B.fx.hardNow?5:4,type:opt.type});B.qtype=q.t;return q}
/* a combo question: what does the pair mean? */
function comboQ(c){const ws=H.shuffle(C.COMBO.filter(x=>x.k!==c.k&&x.j!==c.j)).slice(0,3).map(x=>x.j),ch=H.shuffle([c.j,...ws]);
  return {t:'combo',I:{en:c.p},q:`<span class="qen">${esc(c.p)}</span>`,ch,ans:ch.indexOf(c.j),hint:`${esc(c.a)} ＋ ${esc(c.b)}。 ことばを 1つずつ 思いうかべて`,tip:`<b>${esc(c.p)}</b> ＝ ${esc(c.j)}`,say:['',c.p]}}
function askCombo(c,tag){return new Promise(res=>{const q=comboQ(c);const o=C.ov(`<div class="cgbq"><div class="cgcmb">🔗 ${esc(c.a)} ＋ ${esc(c.b)}</div><div id="bqz"></div></div>`,'bq');o.dataset.stay=1;
  C.ask($('bqz'),Object.assign(q,{say:null}),r=>{C.closeOv();res(r)},{tag,noHint:B.fx.hardNow,fast:true});
  o.querySelectorAll('.cgqc button').forEach(b=>b.addEventListener('click',()=>C.speak(c.p),{once:true}))})}
/* a note that waits for a tap */
function note(html,btn='OK'){return new Promise(res=>{const o=C.ov(`<div class="cgbuy cgnote">${html}<button id="ntok">${btn}</button></div>`,'by');o.dataset.stay=1;$('ntok').onclick=()=>{sf('step');C.closeOv();res()}})}


/* ================================================================ your turn */
function myTurn(){if(!B)return;B.turn++;B.aiPhase=false;B.sel=[];B.fx.hardNow=!!B.fx.hard;B.fx.hard=0;B.busy=false;
  render('あなたの ターン！');snd('turn');fxEl('fxturn me','<b>YOUR TURN</b>',1100)}
/* what the chosen cards do to the target */
async function act(t){const sel=B.sel.map(u=>B.me.field.find(x=>x.u===u)).filter(Boolean);if(!sel.length)return;
  if(sel.length===3){const ch=chainOf(sel);if(!C.ruleOn('sent')){H.toast(`⛓️ 必殺は ${esc(CG_RANKS[CG_RULE_AT.sent][0])} から`);return}if(!ch){sf('pop');H.toast('3まいが コンボで つながらないよ<small>2まいか 1まいに してね</small>');return}
    B.busy=true;render(B.msg);await special3(sel,ch)}
  else{if(!t)return;B.busy=true;B.sel=[];render(B.msg);if(sel.length===2)await pair(sel[0],sel[1],t);else await strike(sel[0],t)}
  B.sel=[];await sweep();if(!alive('ai'))return end(true);await wait(350);aiTurn()}
/* one card attacks: a question on that card */
async function strike(x,t,o={}){const I=x.I;
  const r=await askCard(I,qFor(I),{nm:W_(I),st:{a:atkOf(x),d:defOf(x),h:x.hp},tag:o.tag||`⚔ ${esc(W_(I))} の 攻撃`});
  const wk=C.weak(x.id),fg=C.forgot(x.id),up=C.record(x.id,r.ok);B.res.q.push({id:x.id,ok:r.ok});if(up)B.res.stars.push([x.id,up]);
  let m=r.ok?(r.hint?.75:1):.5,tags=[];const crit=r.ok&&!r.hint&&r.ms<4500;
  used(x);
  if(crit){m*=1.5;tags.push('<em class="cr">💥 クリティカル！</em>');B.res.crit++}
  if(r.ok&&wk){m*=2;tags.push('<em class="rev">😣→😤 逆転 ×2</em>')}else if(r.ok&&fg){m*=1.5;tags.push('<em class="fg">💤 思い出した ×1.5</em>')}
  const an=anti(x,t);if(an){m*=2;tags.push('<em>⚡ 反対語 ×2</em>');B.res.anti++}
  if(B.fx.weak){m*=.5;B.fx.weak=0;tags.push('<em>（得意技で 半分）</em>')}
  const raw=Math.max(1,Math.round(x.a*m)),gd=Math.random()<B.F.p,dmg=Math.max(1,raw-(gd?defOf(t):0));
  render();if(an){snd('charge');await cutin('⚡ 反対語アタック！',`${esc(x.I.h)} ⇔ ${esc(t.I.h)}`,'combo',900)}else if(crit){snd('charge');await cutin('💥 CRITICAL!','','combo',650)}
  await lunge(x,t);hurt(t,dmg,{crit});if(gd&&raw>dmg)guardFx(t);
  say(`${r.ok?'⭕':'❌'} <b>${esc(W_(I))}</b> → ${esc(W_(t.I))} に <b>${dmg}</b>${gd&&raw>dmg?' <small>（🛡 ガード）</small>':''}${tags.length?'<br>'+tags.join(' '):''}`);await wait(800)}
/* two cards together: a natural combo hits hard and skips the guard; a wrong one teaches the right words */
async function pair(x,y,t){const c=comboOf(x,y);
  if(!c){const w=wrongOf(x,y);
    if(w){C.metWrong(w);B.res.wrong.push(w.k);sf('pop');await note(`<b>⚠️ 不発！ まちがいコンボ</b><p><s>${esc(w.a)} ${esc(w.b)}</s> → <b>${esc(w.ok)}</b></p><small>${esc(w.why)}</small>`,'なるほど');C.speak(w.ok);say('⚠️ 不発… 英語では そう 言わないんだ');return}
    sf('pop');say(`🔗 <b>${esc(W_(x.I))}</b> ＋ <b>${esc(W_(y.I))}</b> は コンボに ならなかった… ${esc(W_(x.I))} で 攻撃`);await wait(900);return strike(x,t)}
  const r=await askCombo(c,'🔗 合体攻撃！');B.res.combos.push(c.k);const sum=atkOf(x)+atkOf(y);used(x);used(y);
  if(r.ok){const nw=C.foundCombo(c);if(nw){B.res.newCombo.push(c.k);H.addCoins(10)}const dmg=Math.round(sum*1.5*(B.fx.weak?.5:1));B.fx.weak=0;B.lastCombo=dmg;
    snd('combo');flash('rgba(255,225,74,.35)');await cutin('🔗 COMBO!',`${esc(c.p)}<br>${esc(c.j)}`,'combo');C.speak(c.p);
    lunge(y,t);await lunge(x,t);hurt(t,dmg,{col:'#ffe14a'});say(`🔗 <b>${esc(c.p)}</b>（${esc(c.j)}） 防御むしで <b>${dmg}</b>！${nw?'　<em>新コンボ発見！ 🪙10</em>':''}`)}
  else{const dmg=Math.max(1,Math.round(sum*.5)-defOf(t));await lunge(x,t);hurt(t,dmg);say(`🔗 ${esc(c.p)}… 意味を まちがえて 力が 半分 <b>${dmg}</b>`)}
  await wait(900)}
/* ⛓️ three cards tied by two combos: hits every card on their side */
async function special3(us,ch){us.forEach(used);let ok=0;for(const c of ch){const r=await askCombo(c,'⛓️ 必殺！');if(r.ok){ok++;C.foundCombo(c)&&(B.res.newCombo.push(c.k),H.addCoins(10))}B.res.combos.push(c.k)}
  const sum=us.reduce((a,x)=>a+atkOf(x),0),each=Math.max(1,Math.round(sum*(ok===2?.6:ok?.4:.2)));
  snd('chain');flash('rgba(160,230,255,.5)');await cutin('⛓️ 必殺！',ch.map(c=>esc(c.p)).join(' ＋ '),'chain',1300);ch.forEach(c=>C.speak(c.p));
  for(const t of B.ai.field.slice()){hurt(t,each,{col:'#9fe8ff'});await wait(180)}say(`⛓️ 必殺！ 相手の 場 ぜんぶに <b>${each}</b>`);await wait(900)}

/* ================================================================ their turn */
async function aiTurn(){if(!B)return;const F=B.F;B.busy=true;B.aiN=(B.aiN||0)+1;B.aiPhase=true;render(`${F.ico} ${esc(F.n)}の ターン…`);snd('foeTurn');fxEl('fxturn ai',`<b>${esc(F.n)}の ターン</b>`,1100);await wait(900);
  let times=1;const sp=special();if(sp){times+=await doSpecial(sp)}
  for(let i=0;i<times&&alive('me')&&alive('ai');i++){await aiAct();await sweep()}
  if(B.fx.easy)B.fx.easy--;
  if(!alive('me'))return end(false);await wait(300);myTurn()}
function special(){const sp=B.F.sp;if(sp.k==='easy'||B.spU>=B.spN)return null;const r=hpSum('ai')/Math.max(1,B.aiMax||(B.aiMax=hpSum('ai')));
  if(r<=(B.spU?.25:B.spN>1?.6:.5)){B.spU++;return sp}return null}
/* returns extra actions */
async function doSpecial(sp){const F=B.F;snd('charge');flash('rgba(255,140,80,.35)');await cutin(`${F.ico} 得意技！`,esc(sp.n),'foe',1000);
  await note(`<div class="vsf">${F.ico}</div><b>得意技「${esc(sp.n)}」！</b><p class="en">${esc(F.spl[0])}</p><small>${esc(F.spl[1])}<br>${esc(sp.d)}</small>`,'くるぞ…');C.speak(F.spl[0]);
  const k=sp.k,v=sp.v||0;render();
  if(k==='heal'){B.ai.field.forEach(x=>heal(x,v));snd('heal');await wait(700)}
  else if(k==='again'||k==='encore')return 1;
  else if(k==='freeze'||k==='nodraw')B.fx.weak=1;
  else if(k==='combo3')B.fx.combo2=1;
  else if(k==='steal'){const x=B.me.field.slice().sort((a,b)=>b.a-a.a)[0];if(x){x.a=Math.max(1,x.a-2);B.fx.boost=1;render();burst(elOf(x),'#8ab4ff',10);say(`🎣 <b>${esc(W_(x.I))}</b> の ⚔を 2 つりあげられた！`);await wait(900)}}
  else if(k==='warp')B.fx.pierce=1;
  else if(k==='hard')B.fx.hard=1;
  else if(k==='pinch'){for(const x of B.me.field.slice()){hurt(x,v);await wait(200)}say(`🦀 よこばさみ！ 場の ぜんぶに ${v}`);await wait(700)}
  else if(k==='mimic'){const x=pickL(B.me.field),n=Math.max(4,B.lastCombo||0);if(x){hurt(x,n);say(`🦜 ピップの ものまね！ ${esc(W_(x.I))} に ${n}`);await wait(800)}}
  else if(k==='lesson'){B.fx.combo2=1;return 1}
  return 0}
/* one action: a combo if they have one, or their strongest card at your weakest */
async function aiAct(){const F=B.F,ai=B.ai.field.filter(ready),me=B.me.field;if(!B.ai.field.length||!me.length)return;
  if(!ai.length){say(`⏳ ${esc(F.n)}の カードは みんな チャージ中…`);await wait(900);return}
  const ok=Math.random()<Math.min(.97,F.p+B.lv*.03);let pr=null;
  for(let i=0;i<ai.length&&!pr;i++)for(let j=i+1;j<ai.length;j++){const c=comboOf(ai[i],ai[j]);if(c){pr=[ai[i],ai[j],c];break}}
  const t=Math.random()<.65?me.slice().sort((a,b)=>a.hp-b.hp)[0]:pickL(me);
  if(pr&&(B.fx.combo2||Math.random()<F.p+.1+B.lv*.05)){const [x,y,c]=pr;used(x);used(y);let dmg=Math.round((atkOf(x)+atkOf(y))*1.5*(ok?1:.5)*(B.fx.combo2?1.5:1)*(B.fx.easy?.5:1));B.fx.combo2=0;
    snd('combo');await cutin(`${F.ico} COMBO!`,esc(c.p),'foe',900);C.speak(c.p);
    const r=await askCombo(c,'📖 相手の コンボ！ いみが わかれば ダメージ半分');B.res.q.push({id:C.cardOfHead(c.a).id,ok:r.ok,foe:1});
    if(r.ok)dmg=Math.ceil(dmg/2);render();lunge(y,t);await lunge(x,t);hurt(t,dmg);
    say(`🔗 ${esc(F.n)}の <b>${esc(c.p)}</b>（${esc(c.j)}） → ${esc(W_(t.I))} に <b>${dmg}</b>${r.ok?' <small>（読んで 半分）</small>':''}`);await wait(900);return}
  const x=ai.slice().sort((a,b)=>atkOf(b)-atkOf(a))[0];used(x);let raw=Math.round(atkOf(x)*(ok?1:.5)*(B.fx.easy?.5:1));const an=anti(x,t);if(an)raw*=2;
  const pierce=B.fx.pierce;B.fx.pierce=0;
  /* your guard: a question on THEIR card that is coming at you (you meet their words, not only yours) */
  let dmg=raw,gd=0;
  if(!pierce){render();const r=await askCard(x.I,qFor(x.I),{nm:W_(x.I),st:{a:atkOf(x),d:x.d,h:x.hp},tag:'🛡️ ガード',
      top:`<div class="cgfoe">${F.ico} の カードが ${esc(W_(t.I))} に 攻撃！ ⚔${raw}${an?' ⚡反対語':''}<br><small>この カードの 問題に 正解で 🛡${defOf(t)} が きく（はやいと 2ばい）</small></div>`});
    C.record(x.id,r.ok);B.res.q.push({id:x.id,ok:r.ok,foe:1});if(r.ok){gd=r.ms<4500&&!r.hint?2:1;dmg=Math.max(1,raw-defOf(t)*gd)}}
  render();if(an){await cutin('⚡ 反対語アタック！',`${esc(x.I.h)} ⇔ ${esc(t.I.h)}`,'foe',800)}
  await lunge(x,t);hurt(t,dmg);if(gd)guardFx(t,gd===2);
  say(`${F.ico} <b>${esc(W_(x.I))}</b> → ${esc(W_(t.I))} に <b>${dmg}</b>${gd?` <small>（${gd===2?'パーフェクト':''}ガード）</small>`:pierce?' <small>（👽 ガードできない）</small>':''}`);await wait(900)}

/* ================================================================ the end */
const RW=C;
function end(win,gaveUp){if(!B)return;const foeLvBefore=B.lv;const F=B.F,R=C.rec(),res=B.res,before=C.rank();R.games=(R.games||0)+1;
  let coins=win?F.coin+res.newCombo.length*5:gaveUp?0:Math.round(F.coin/4),gift=null;
  if(win){R.win[F.id]=(R.win[F.id]||0)+1;R.rp=(R.rp||0)+F.pt+(R.win[F.id]===1&&F.pt?1:0);
    const pool=foeDeck(F,8);gift=pickL(pool);C.give(gift)}else if(!gaveUp)R.lose[F.id]=(R.lose[F.id]||0)+1;
  C.save();if(coins)H.addCoins(coins);const after=C.rank();
  const ok=res.q.filter(x=>x.ok).length,miss=[...new Set(res.q.filter(x=>!x.ok).map(x=>x.id))];
  const cb=B.opt.onEnd;const back=B.opt.back;const fid=F.id;B=null;
  const nlv=win?foeLv(F):0,lvUp=win&&nlv>foeLvBefore;
  /* 🗺️ a win now and then brings a treasure map (game/adventure.js) */
  let mapN=null;try{if(win&&!cb&&window.ADV&&!ADV.has()&&Math.random()<.2)mapN=ADV.give()}catch(e){}
  if(win){snd('ko');setTimeout(()=>sf('fanfare'),600);confetti();try{const r=H.panel.getBoundingClientRect();FX.firework(r.left+r.width/2,r.top+80)}catch(e){}}else{sf('done');flash('rgba(0,0,30,.5)')}
  const lines=win?F.win:F.lose;
  H.show('cgb',`<section class="pnl cgp cgend ${win?'won':'lost'}">
    <div class="qtop"><span></span><b>${win?'🏆 かち！':'🌙 まけ…'}</b><span></span></div>
    <div class="cgvs mini"><div class="vsf">${F.ico}</div><p class="en">${esc(lines[0])}</p><p class="ja">${esc(lines[1])}</p></div>
    <div class="cgsum"><span>⭕ ${ok}/${res.q.length}</span>${res.crit?`<span>💥 ${res.crit}</span>`:''}${res.combos.length?`<span>🔗 ${res.combos.length}</span>`:''}${coins?`<span>🪙+${coins}</span>`:''}${win&&F.pt?`<span>🎖️+${F.pt}</span>`:''}</div>
    ${after>before?`<div class="cgrank">🎖️ 段位アップ！ <b>${esc(CG_RANKS[after][0])}</b><small>${esc(CG_RANKS[after][2])} が ひらいた！</small></div>`:''}
    ${lvUp?`<p class="cglvup">${F.ico} ${esc(F.n)}が <b>Lv${nlv+1}</b> に パワーアップ！ <small>つぎは もっと 強いよ</small></p>`:''}
    ${mapN?`<div class="cgmap"><p>🗺️ ${esc(F.n)}から 宝の地図「${esc(mapN)}」を もらった！</p><button id="egoMap" class="sub">宝探しに 行く</button></div>`:''}
    ${gift?`<div class="cggift">${C.face(gift,{ja:1})}<p>${esc(F.n)}から カードを もらった！</p></div>`:''}
    ${res.newCombo.length?`<p class="cgnc">✨ 新コンボ: ${res.newCombo.map(k=>esc(C.COMBO.find(c=>c.k===k).p)).join('、 ')}</p>`:''}
    ${miss.length?`<details class="cgfold" open><summary>📒 まちがえた 単語（${miss.length}）</summary><div class="cgsr">${miss.map(id=>{const I=C.info(id);return I?`<div class="cgrow"><span class="ri">${C.art(I)[0]}</span><span class="rn"><b>${esc(I.en)}</b><small>${esc(I.ja)}</small></span><button class="sub" data-say="${esc(id)}">🔊</button></div>`:''}).join('')}</div></details>`:''}
    ${res.stars.length?`<p class="note">★ ${res.stars.map(([id,s])=>esc(C.info(id).en.split(',')[0])+' ★'+s).join('、 ')}</p>`:''}
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
function menu(back){if(back)menuBack=back;const R=C.rec(),r=C.rank(),nx=CG_RANKS[r+1],rp=R.rp||0;
  const rules=[['基本',0,'カードには ⚔攻撃力・🛡防御力・❤HP。 場に 3まい。 相手の カードを ぜんぶ たおしたら 勝ち'],['⚔ 攻撃',0,'自分の カードを えらんで 相手を タップ。 問題に 正解で ⚔そのまま、 はやいと 💥クリティカル、 まちがいで 半分'],
    ['🛡 防御',0,'攻撃してきた 相手の カードの 問題に 正解で 🛡が きく（はやいと 2ばい）'],['⏳ チャージ',0,'強い カードほど 攻撃の あと 休む（小0・中1・高2・H3ターン）。 ここぞで 使って、 そのあいだは ほかの カードで'],['🔗 ことばコンボ',0,'自然な 組み合わせの 2まいで 合体攻撃。 ⚔の 合計×1.5で 防御むし。 相手の コンボも 意味が わかれば 半分'],
    ['😣 逆転・💤 思い出し',0,'苦手カードで 正解すると 2ばい、 わすれかけカードは 1.5ばい'],['🗂️ デッキ',0,'15まいまで・コストの 上限あり。 対戦では 4まいが ランダム。 前に 出た カードは ☕おやすみで 出にくい。 🌬️きょうの風の 種類は ⚔+1'],
    ['⭐ 相手の レベル',0,'勝つたびに 相手が 強くなる（Lv6まで）。 さいごの 1まいは 本気モード'],
    ['⚡ 反対語アタック',CG_RULE_AT.counter,'反対の 意味の カードを ねらうと 2ばい'],['🛡️ なかまガード',CG_RULE_AT.guard,'にた 意味の カードが 場に ならぶと 🛡+2'],['⛓️ 必殺',CG_RULE_AT.sent,'3まいが コンボで つながると 相手の 場 ぜんぶに 攻撃']];
  H.show('cg',`<section class="pnl cgp">
    <div class="qtop"><button class="x" id="cgb" aria-label="もどる">←</button><b>⚔️ 対戦</b><span class="qn">${esc(CG_RANKS[r][0])}</span></div>
    <div class="cgrk"><b>🎖️ ${esc(CG_RANKS[r][0])}</b>${nx?`<i><u style="width:${Math.min(100,(rp-CG_RANKS[r][1])/(nx[1]-CG_RANKS[r][1])*100)}%"></u></i><small>つぎ ${esc(nx[0])}: ${esc(nx[2])}</small>`:'<small>最高段位！</small>'}</div>
    <div class="cgfoes">${FOES.map(F=>{const lock=r<F.need;const w=R.win[F.id]||0;return `<button data-f="${F.id}" class="${lock?'lk':''} ${F.mina?'mina':''}"><span class="fi">${lock?'🔒':F.ico}</span><span class="fn"><b>${esc(F.n)}</b><small>${lock?esc(CG_RANKS[F.need][0])+'から':esc(F.d)}</small></span>${w?`<em>🏆${w}<small>Lv${Math.min(5,w)+1}</small></em>`:''}</button>`}).join('')}</div>
    <div class="row"><button id="cgdk" class="sub">🗂️ デッキ（${C.rec().deck.length}/${C.DECK_N}）</button></div>
    <details class="cgfold"><summary>📘 ルール</summary>${rules.map(([n,at,d])=>`<p class="${r>=at?'':'lk'}">${r>=at?'':'🔒 '}<b>${n}</b><br><small>${r>=at?d:esc(CG_RANKS[at][0])+'で ひらく'}</small></p>`).join('')}</details>
  </section>`);
  $('cgb').onclick=()=>{sf('back');(menuBack||C.open)()};$('cgdk').onclick=()=>{sf('step');C.deck(()=>menu())};
  H.panel.querySelectorAll('[data-f]').forEach(b=>b.onclick=()=>{const F=foe(b.dataset.f);if(r<F.need){H.toast(`🔒 ${esc(F.n)}とは <b>${esc(CG_RANKS[F.need][0])}</b> から 対戦できるよ`);return}sf('step');start(F.id,{back:()=>menu()})})}

window.CGB={start,menu,foes:FOES,foe,foeDeck,_state:()=>B,_render:()=>render(),_act:act};
})();
