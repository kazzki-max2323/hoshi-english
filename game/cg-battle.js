/* ことばカードの 対戦（じっくり 10分）。カードの しくみは game/cg.js
   - デッキ 20まい・手札 5まい（さいだい 7）・ほし（ライフ）。 先に 相手の ほしを 0に したら 勝ち
   - ことだま（✨）: 毎ターン ふえる 力。 カードの コストの 合計まで 出せる（小1・中2・高3・H4）
   - カードを 出すと その単語の ミニ問題（いみ・英語で・つづり・聞きとり・あなうめ）。 正解で フルパワー、 ヒントで 3/4、 まちがいで 半分
     苦手カードで 正解すると「逆転」2ばい、 わすれかけカードで 正解すると 1.5ばい
   - ことばコンボ: 英語として 自然な 組み合わせを いっしょに 出すと、 コンボ問題に 正解で 2ばい。 3まいで つながると「連鎖」
     まちがいコンボ（strong rain など）は 不発で、 正しい 言い方を 教えてくれる
   - 段位で ひらく ルール: 相手の 単語を 読む（ダメージ半分）／反対語カウンター／なかまガード／変身（動詞の 過去形）／語源パーツ／文カード（ならべかえ）
   - 浜辺の みんなは テーマデッキと 得意技を もっていて、 勝つと カードと 段位ポイントが もらえる */
(()=>{
const {S:ST,sfx:SFX}=BEACH;
const H=HE,esc=H.esc,$=id=>document.getElementById(id);
const C=CG,pickL=C.pickL;
const sf=k=>{try{SFX[k]&&SFX[k]()}catch(e){}};
const wait=ms=>new Promise(r=>setTimeout(r,ms));
const FOES=CG_FOES,foe=id=>FOES.find(f=>f.id===id);
const HP_ME=40,HAND0=5,HAND_MAX=7,TIDE_MAX=8;
const ML=(k,v)=>{try{return MINA.line(k,v||{})}catch(e){return ['','']}};

/* ================================================================ the opponent's deck */
function foeDeck(F){const lv=F.lv,pool=C.W.filter(c=>lv.includes(c.lv)&&(!F.at.length||F.at.includes(c.a))),all=C.W.filter(c=>lv.includes(c.lv));
  const ids=[],cs=C.COMBO.filter(c=>{const a=C.cardOfHead(c.a),b=C.cardOfHead(c.b);return lv.includes(a.lv)&&lv.includes(b.lv)});
  const fav=cs.filter(c=>!F.at.length||F.at.includes(C.cardOfHead(c.a).a)||F.at.includes(C.cardOfHead(c.b).a));
  H.shuffle(fav.length>=4?fav:cs).slice(0,F.mina?8:F.id==='nagi'?3:5).forEach(c=>ids.push(C.cardOfHead(c.a).id,C.cardOfHead(c.b).id));
  while(ids.length<20){const c=pickL(pool.length>10?pool:all);if(!ids.includes(c.id))ids.push(c.id)}
  return H.shuffle(ids)}
/* how strong their cards are: stronger people have grown cards */
const foeStar=F=>F.mina?3:Math.max(0,Math.round((F.p-.6)*8));
/* every win makes that person stronger next time (Lv1〜6) */
const foeLv=F=>Math.min(5,(C.rec().win[F.id]||0));
const foeHp=(F,lv)=>Math.round(F.hp*(1.3+lv*.08*(F.id==='nagi'?.5:1)));
const foePow=(c,I)=>{let p=I.pow+(I.k==='w'||I.k==='t'?foeStar(B.F)+B.bonus:0);if(B.rage)p+=2;return p};

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
function spot(side){const el=H.panel&&H.panel.querySelector(side==='field'?'.bfield':'.bside.'+side+' .bfi');if(!el)return null;const r=el.getBoundingClientRect();return [r.left+r.width/2,r.top+r.height/2]}
function burst(side,col,n=14){const xy=spot(side);if(!xy||calm())return;
  for(let i=0;i<n;i++){const a=Math.random()*Math.PI*2,d=30+Math.random()*80,e=fxEl('fxp','',800);e.style.cssText=`left:${xy[0]}px;top:${xy[1]}px;--dx:${Math.cos(a)*d}px;--dy:${Math.sin(a)*d}px;background:${col||'#ffd36a'};width:${4+Math.random()*6}px`}}
function cutin(big,small,cls,ms=1100){fxEl('fxcut '+(cls||''),`<div><b>${big}</b>${small?`<small>${small}</small>`:''}</div>`,ms+250);return wait(ms)}
function flyCards(cs){const f=H.panel&&H.panel.querySelector('.bfield');if(!f||calm())return;const r=f.getBoundingClientRect();
  cs.forEach((c,i)=>{const e=fxEl('fxfly',C.face(c.id,{mini:1,pw:cardPow(c),nm:cardName(c)}),1000);e.style.left=(r.left+r.width/2+(i-(cs.length-1)/2)*50)+'px';e.style.top=(r.top+r.height/2)+'px';e.firstChild.style.animationDelay=i*70+'ms'})}
function confetti(){if(calm())return;for(let i=0;i<70;i++){const e=fxEl('fxconf','',3600);e.style.cssText=`left:${Math.random()*100}vw;background:hsl(${Math.random()*360|0} 90% 62%);animation-delay:${(Math.random()*.9).toFixed(2)}s;--r:${Math.random()*900-450|0}deg;--dx:${Math.random()*90-45|0}px`}}
/* the hit itself: sound, shake, sparks, number */
function strike(side,n){const big=n>=15;if(side==='ai'){snd(big?'boom':'slash');burst('ai',big?'#ff9a3a':'#ffd36a',big?22:12);if(big)flash('rgba(255,240,200,.55)')}
  else{snd('hurt');burst('me','#ff5a7a',big?18:10);flash('rgba(255,40,70,.35)')}
  quake(big);const f=H.panel&&H.panel.querySelector('.bside.'+side+' .bfi');if(f){f.classList.remove('hurt');void f.offsetWidth;f.classList.add('hurt')}}

/* ================================================================ state */
let B=null,uid=0;
const inst=id=>({u:++uid,id,m:null});
function draw(side,n=1){for(let i=0;i<n;i++){if(side.hand.length>=HAND_MAX)return;if(!side.deck.length){if(!side.disc.length)return;side.deck=H.shuffle(side.disc);side.disc=[]}side.hand.push(side.deck.pop())}}
/* each turn: 2 cards, or up to 4 when the hand is low */
const refill=s=>Math.max(2,4-s.hand.length);
/* first you pick 3 cards; the other 17 come at random (gently balanced) */
function start(id,opt={}){const F=foe(id);if(!F)return;sf('card');C.pick3(F,d=>begin(F,opt,d),opt.pickBack||opt.back||(()=>menu()))}
function begin(F,opt,deck){
  const myDeck=H.shuffle(deck.map(inst)),aiDeck=foeDeck(F).map(inst);
  const lv=foeLv(F),ahp=foeHp(F,lv);
  B={F,opt,lv,bonus:Math.floor(lv*(F.id==='nagi'?.25:.5))+(F.mina?1:0),rage:false,spN:lv>=2?2:1,shown:{ai:1,me:1},turn:0,me:{hp:HP_ME,max:HP_ME,deck:myDeck,hand:[],disc:[]},ai:{hp:ahp,max:ahp,deck:aiDeck,hand:[],disc:[]},tide:0,used:0,sel:[],busy:false,
    fx:{},spDone:false,morphT:0,lastAi:0,lastCombo:0,log:[],res:{q:[],combos:[],newCombo:[],wrong:[],stars:[],read:0},qtype:null};
  draw(B.me,HAND0);draw(B.ai,HAND0);
  if(F.sp.k==='easy'){B.fx.easy=2;B.spDone=true}
  sf('card');intro()}
function intro(){const F=B.F;
  C.ov(`<div class="cgvs"><div class="vsf">${F.ico}</div><b>${esc(F.n)}</b><p class="en">${esc(F.hi[0])}</p><p class="ja">${esc(F.hi[1])}</p>
    <p class="vslv">${'★'.repeat(B.lv+1)}<small>Lv${B.lv+1}${B.lv?' ・ 勝つたびに 強くなる':''}</small></p><p class="vssp">得意技 <b>${esc(F.sp.n)}</b><small>${esc(F.sp.d)}${B.spN>1?'（2回 くる！）':''}</small></p><button id="vsgo">⚔️ 勝負！</button></div>`,'vs').dataset.stay=1;
  C.speak(F.hi[0]);snd('charge');$('vsgo').onclick=()=>{C.closeOv();snd('boom');flash('rgba(255,255,255,.5)');myTurn()}}

/* ================================================================ screen */
const tideOf=t=>Math.min(TIDE_MAX,t+2);
function cardPow(c){let p=C.power(c.id);if(c.m)p+=3;return p}
function cardName(c){const I=C.info(c.id);return c.m||I.en.split(',')[0]}
function render(msg){if(!B)return;const F=B.F,me=B.me,ai=B.ai,left=B.tide-B.used;
  const sel=B.sel.map(u=>me.hand.find(c=>c.u===u)).filter(Boolean),cost=sel.reduce((a,c)=>a+C.info(c.id).cost,0);
  H.show('cgb',`<section class="pnl cgbt" data-stay>
    <div class="qtop"><button class="x" id="bx" aria-label="やめる">←</button><b>⚔️ ${esc(F.n)} <small class="blv">Lv${B.lv+1}</small></b><span class="qn">ターン ${B.turn}</span></div>
    <div class="bside ai ${B.rage?'rage':''}"><span class="bfi">${F.ico}</span>${hpBar(ai,'ai')}<span class="bcnt">🂠${ai.hand.length}</span></div>
    <div class="bfield" id="bfield"><span>${msg||B.log.slice(-1)[0]||''}</span></div>
    <div class="bside me"><span class="bfi">🫵</span>${hpBar(me,'me')}<span class="btide" title="ことだま">${'✨'.repeat(Math.max(0,left))}<small>${left}/${B.tide}</small></span></div>
    <div class="bhand">${me.hand.map(c=>{const I=C.info(c.id),can=I.cost<=left;return face(c,{sel:B.sel.includes(c.u),cls:can?'':'dim'})}).join('')||'<p class="note">手札が ないよ</p>'}</div>
    <div class="bsel" id="bsel">${selInfo(sel,cost,left)}</div>
    <div class="row"><button id="bplay" ${sel.length&&cost<=left&&!B.busy?'':'disabled'}>出す ▶</button><button id="bend" class="sub" ${B.busy?'disabled':''}>ターン おわり</button></div>
  </section>`);
  ['ai','me'].forEach(k=>{const s=B[k],r=Math.max(0,s.hp)/s.max,el=H.panel.querySelector('.bside.'+k+' .bhp');if(!el||B.shown[k]===r)return;B.shown[k]=r;
    requestAnimationFrame(()=>requestAnimationFrame(()=>{el.querySelector('i').style.width=r*100+'%';el.querySelector('u').style.width=r*100+'%'}))});
  $('bx').onclick=quit;
  H.panel.querySelectorAll('.bhand .cgc').forEach(el=>el.onclick=()=>{if(B.busy)return;const u=+el.dataset.u;const i=B.sel.indexOf(u);if(i>=0)B.sel.splice(i,1);else B.sel.push(u);sf('tap');render()});
  $('bplay').onclick=()=>{if(B.busy)return;play()};$('bend').onclick=()=>{if(B.busy)return;sf('step');aiTurn()};
  const mb=$('bmorph');if(mb)mb.onclick=()=>{if(!B.busy)morph(sel[0])}}
const face=(c,o)=>C.face(c.id,Object.assign({mini:1,pw:cardPow(c),nm:cardName(c)},o)).replace('data-id=',`data-u="${c.u}" data-id=`);
function hpBar(s,k){const r=Math.max(0,s.hp)/s.max,w=B.shown[k]*100;return `<div class="bhp ${r<.3?'low':''}"><u style="width:${w}%"></u><i style="width:${w}%"></i><span>⭐ ${Math.max(0,s.hp)}/${s.max}</span></div>`}
/* what happens if you play the chosen cards (combos you know show their name; new ones only sparkle) */
function selInfo(sel,cost,left){if(!sel.length)return `<span class="note">カードを えらんで 「出す」。 コスト ${left} まで</span>`;
  const I=sel.map(c=>C.info(c.id)),out=[`コスト ${cost}/${left}`];if(cost>left)out.push('<b class="ng">ことだまが たりない</b>');
  const ws=I.filter(x=>x.k==='w'||x.k==='t');
  for(let i=0;i<ws.length;i++)for(let j=i+1;j<ws.length;j++){const c=C.comboOf(ws[i].h,ws[j].h);if(c)out.push(C.rec().combo[c.k]?`🔗 <b>${esc(c.p)}</b>`:'✨ なにか おきそう…')}
  if(C.ruleOn('parts'))I.filter(x=>x.k==='p').forEach(p=>{if(ws.some(w=>C.derivOf(p.part,w.h)))out.push('🧩 合体 できそう！')});
  let btn='';if(sel.length===1&&C.ruleOn('morph')&&C.formsOf(I[0])&&!sel[0].m&&B.morphT!==B.turn)btn=` <button id="bmorph" class="sub">🔄 変身</button>`;
  return out.join('　')+btn}
function say(html){B.log.push(html);const f=$('bfield');if(f){f.innerHTML='<span>'+html+'</span>';f.classList.remove('pop');void f.offsetWidth;f.classList.add('pop')}}
/* damage numbers on a side */
function hit(side,n,heal){const el=H.panel.querySelector('.bside.'+side);if(!el)return;const d=document.createElement('span');d.className='bdmg'+(heal?' heal':'');d.textContent=(heal?'+':'-')+n;el.appendChild(d);
  if(n>=15&&!heal)d.classList.add('big');el.classList.remove('shake');void el.offsetWidth;if(!heal){el.classList.add('shake');strike(side,n)}else{snd('heal');burst(side,'#55e0b4',10)}setTimeout(()=>d.remove(),1200)}
function quit(){if(B.busy)return;C.ov(`<div class="cgbuy"><b>対戦を やめる？</b><p class="note">やめると 負けに なるよ</p><button id="qy" class="sub">やめる</button><button id="qn">つづける</button></div>`,'by');
  $('qn').onclick=()=>{sf('step');C.closeOv()};$('qy').onclick=()=>{C.closeOv();end(false,true)}}

/* ================================================================ quizzes */
/* ask on a card (shown big); resolves {ok,hint} */
/* the card is shown with its picture covered (the picture would give the meaning away), and its name too unless the question shows it */
function askCard(I,q,opt={}){return new Promise(res=>{const o=C.ov(`<div class="cgbq">${opt.top||''}${opt.card===false?'':C.face(I.id,{big:1,marks:true,nm:q.t==='mean'||q.t==='form'?opt.nm:'？？？',pw:opt.pw,cls:'qz'})}<div id="bqz"></div></div>`,'bq');o.dataset.stay=1;
  C.ask($('bqz'),q,r=>{const c=o.querySelector('.cgc.qz');if(c){c.classList.remove('qz');const n=c.querySelector('.cgn b');if(n)n.textContent=opt.nm||I.en.split(',')[0]}setTimeout(()=>{C.closeOv();res(r)},r.ok?250:0)},{noHint:B&&B.fx.hardNow,tag:opt.tag,fast:opt.fast})})}
function qFor(I,opt={}){const q=C.quiz(I,{avoid:B.qtype,n:B.fx.hardNow?5:4,type:opt.type});B.qtype=q.t;return q}
/* put words in order (sentence cards) */
function order(I){return new Promise(res=>{const ws=C.sentWords(I.s),mix=H.shuffle(ws.map((w,i)=>[w,i]));let got=[],hint=false;
  const o=C.ov(`<div class="cgbq"><div class="cgq"><div class="cgqt">📜 文カード <em>ならべかえ</em></div><div class="cgqq"><span class="qja">${esc(I.ja)}</span></div>
    <div class="cgord" id="ordA"></div><div class="cgordc" id="ordB">${mix.map(([w,i],k)=>`<button data-k="${k}">${esc(w)}</button>`).join('')}</div>
    <div class="cgqf"><button class="sub" id="ordH">💡 ヒント</button><button class="sub" id="ordU">↩ もどす</button></div><div class="cgqx" hidden></div></div></div>`,'bq');o.dataset.stay=1;
  const A=$('ordA');const draw=()=>{A.innerHTML=got.map(k=>`<span>${esc(mix[k][0])}</span>`).join(' ')||'<small>ここに ならぶよ</small>';o.querySelectorAll('#ordB button').forEach(b=>b.disabled=got.includes(+b.dataset.k))};draw();
  $('ordU').onclick=()=>{got.pop();sf('back');draw()};
  $('ordH').onclick=()=>{if(hint)return;hint=true;sf('pickup');const k=mix.findIndex(m=>m[1]===0);got=[k];draw();$('ordH').disabled=true};
  o.querySelectorAll('#ordB button').forEach(b=>b.onclick=()=>{const k=+b.dataset.k;if(got.includes(k))return;got.push(k);sf('tap');draw();
    if(got.length===ws.length){const ok=got.map(k=>mix[k][0]).join(' ')===ws.join(' ');
      if(ok){sf('correct');C.speak(I.en);setTimeout(()=>{C.closeOv();res({ok:true,hint})},900)}
      else{sf('wrong');const x=o.querySelector('.cgqx');x.hidden=false;x.innerHTML=`<p>正しい 文: <b>${esc(I.en)}</b><br><small>${esc(I.ja)}</small></p><button class="nx">つぎへ ▶</button>`;C.speak(I.en);
        o.querySelectorAll('#ordB button,#ordH,#ordU').forEach(b=>b.disabled=true);x.querySelector('.nx').onclick=()=>{C.closeOv();res({ok:false,hint})}}}})})}
/* a combo question: what does the pair mean? */
function comboQ(c){const ws=H.shuffle(C.COMBO.filter(x=>x.k!==c.k&&x.j!==c.j)).slice(0,3).map(x=>x.j),ch=H.shuffle([c.j,...ws]);
  return {t:'combo',I:{en:c.p},q:`<span class="qen">${esc(c.p)}</span>`,ch,ans:ch.indexOf(c.j),hint:`${esc(c.a)} ＋ ${esc(c.b)}。 ことばを 1つずつ 思いうかべて`,tip:`<b>${esc(c.p)}</b> ＝ ${esc(c.j)}`,say:['',c.p]}}
function askCombo(c,tag){return new Promise(res=>{const q=comboQ(c);const o=C.ov(`<div class="cgbq"><div class="cgcmb">🔗 ${esc(c.a)} ＋ ${esc(c.b)}</div><div id="bqz"></div></div>`,'bq');o.dataset.stay=1;
  C.ask($('bqz'),Object.assign(q,{say:null}),r=>{C.closeOv();res(r)},{tag,noHint:B.fx.hardNow});
  o.querySelectorAll('.cgqc button').forEach(b=>b.addEventListener('click',()=>C.speak(c.p),{once:true}))})}
/* a note that waits for a tap */
function note(html,btn='OK'){return new Promise(res=>{const o=C.ov(`<div class="cgbuy cgnote">${html}<button id="ntok">${btn}</button></div>`,'by');o.dataset.stay=1;$('ntok').onclick=()=>{sf('step');C.closeOv();res()}})}

/* ================================================================ your turn */
function myTurn(){if(!B)return;B.turn++;B.tide=Math.max(1,tideOf(B.turn)-(B.fx.freeze||0));B.fx.freeze=0;B.used=0;B.sel=[];
  B.fx.hardNow=!!B.fx.hard;B.fx.hard=0;
  if(B.fx.nodraw){B.fx.nodraw=0;say(`🧳 より道で カードが 引けなかった…`)}else{draw(B.me,refill(B.me));say(`あなたの ターン！ ✨ことだま ${B.tide}`)}
  B.busy=false;render();snd('turn');fxEl('fxturn me','<b>YOUR TURN</b>',1100);
  const hs=H.panel.querySelectorAll('.bhand .cgc');hs.forEach((c,i)=>{c.style.animationDelay=i*45+'ms';c.classList.add('deal')})}
async function morph(c){const I=C.info(c.id),q=C.formQuiz(I);if(!q)return;B.busy=true;B.morphT=B.turn;
  const r=await askCard(I,q,{tag:'🔄 変身'});C.record(c.id,r.ok);B.res.q.push({id:c.id,ok:r.ok});
  if(r.ok){c.m=q.past;sf('done');burst('field','#9fe8ff',16);say(`🔄 <b>${esc(I.en.split(',')[0])}</b> が <b>${esc(q.past)}</b> に 変身！ パワー +3`)}else say('🔄 変身 しっぱい… また つぎの ターン');
  B.busy=false;render()}
async function play(){const me=B.me,sel=B.sel.map(u=>me.hand.find(c=>c.u===u)).filter(Boolean);if(!sel.length)return;
  const cost=sel.reduce((a,c)=>a+C.info(c.id).cost,0);if(cost>B.tide-B.used)return;
  B.busy=true;B.used+=cost;flyCards(sel);snd('toss');await wait(calm()?0:420);me.hand=me.hand.filter(c=>!sel.includes(c));me.disc.push(...sel);B.sel=[];render('');
  let total=0;const parts=sel.filter(c=>C.info(c.id).k==='p'),sents=sel.filter(c=>C.info(c.id).k==='s');let ns=sel.filter(c=>{const k=C.info(c.id).k;return k==='w'||k==='t'});
  const done=[];   // [{h,pw,I}] resolved word cards for combos
  /* 🧩 word parts */
  for(const p of parts){const P=C.info(p.id);const base=ns.find(c=>{const I=C.info(c.id);return I.k==='w'&&C.derivOf(P.part,I.h)});
    if(!base||!C.ruleOn('parts')){const ex=C.DERIV.filter(d=>d.p===P.part).slice(0,2).map(d=>`${d.b} → ${d.d}`).join('、 ');await note(`<b>🧩 ${esc(P.en)}（${esc(P.ja)}）</b><p>いっしょに 合体できる 単語が なかった…</p><small>れい: ${esc(ex)}</small>`);continue}
    ns=ns.filter(c=>c!==base);const BI=C.info(base.id),d=C.derivOf(P.part,BI.h),DI=C.cardOfHead(d.d),DIi=C.info(DI.id);
    const r=await askCard(DIi,qFor(DIi,{type:'mean'}),{tag:`🧩 ${esc(P.en)} ＋ ${esc(BI.h)}`,top:`<div class="cgcmb">🧩 ${esc(BI.h)} ＋ ${esc(P.en)} ＝ <b>${esc(d.d)}</b></div>`});
    C.record(DI.id,r.ok);B.res.q.push({id:DI.id,ok:r.ok});const pw=r.ok?cardPow(base)*2+3:cardPow(base);total+=pw;done.push({h:d.d,pw,I:DIi});
    if(r.ok){const nw=!C.owns(DI.id);if(nw){C.give(DI.id);C.save()}say(`🧩 語源合体！ <b>${esc(d.d)}</b>（${esc(DIi.ja)}） ⚔${pw}${nw?'　<em>NEW カード！</em>':''}`)}else say(`🧩 ${esc(d.d)} ⚔${pw}`);await wait(700)}
  /* 📜 sentences */
  for(const s of sents){const I=C.info(s.id);if(!C.ruleOn('sent')){await note('📜 文カードは まだ 使えない（4級から）');continue}
    const r=await order(I);const pw=r.ok?(r.hint?Math.ceil(I.pow*.75):I.pow):Math.ceil(I.pow/2);total+=pw;B.res.q.push({id:s.id,ok:r.ok,en:I.en,ja:I.ja});
    say(`📜 <b>${esc(I.en)}</b> ⚔${pw}`);if(r.ok)sf('fanfare');await wait(800)}
  /* the cards */
  for(const c of ns){const I=C.info(c.id);const r=await askCard(I,qFor(I),{nm:cardName(c),pw:cardPow(c)});
    const before=C.weak(c.id),fg=C.forgot(c.id),up=C.record(c.id,r.ok);B.res.q.push({id:c.id,ok:r.ok});if(up)B.res.stars.push([c.id,up]);
    let pw=cardPow(c),tag='';if(!r.ok)pw=Math.ceil(pw/2);else if(r.hint)pw=Math.ceil(pw*.75);
    if(r.ok&&before){pw*=2;tag=' <em class="rev">😣→😤 逆転！ ×2</em>'}else if(r.ok&&fg){pw=Math.ceil(pw*1.5);tag=' <em class="fg">💤 わすれかけボーナス ×1.5</em>'}
    total+=pw;done.push({h:c.m?C.info(c.id).h:I.h,pw,I});say(`${r.ok?'⭕':'❌'} <b>${esc(cardName(c))}</b> ⚔${pw}${tag}`);if(r.ok){burst('field',tag?'#ff9ad5':'#ffd36a',tag?18:8);if(tag){snd('charge');flash('rgba(255,154,213,.3)')}}await wait(650)}
  /* 🔗 combos (2 at most per play) and mistakes */
  const pairs=[],wrongs=[];for(let i=0;i<done.length;i++)for(let j=i+1;j<done.length;j++){const c=C.comboOf(done[i].h,done[j].h);if(c)pairs.push([c,i,j]);const w=C.wrongOf(done[i].h,done[j].h);if(w)wrongs.push(w)}
  let comboDmg=0;const used=new Set();
  for(const [c,i,j] of pairs.slice(0,2)){const r=await askCombo(c,'コンボ！');let b=done[i].pw+done[j].pw;if(!r.ok)b=Math.ceil(b/2);
    if(B.fx.combo3Me){b*=2}used.add(i);used.add(j);comboDmg+=b;B.res.combos.push(c.k);
    const nw=r.ok&&C.foundCombo(c);if(nw){B.res.newCombo.push(c.k);H.addCoins(10)}
    if(r.ok){snd('combo');flash('rgba(255,225,74,.35)');await cutin('🔗 COMBO!',`${esc(c.p)}<br>${esc(c.j)}`,'combo')}else sf('pop');say(`🔗 <b>${esc(c.p)}</b>（${esc(c.j)}） +${b}${nw?'　<em>新コンボ発見！ 🪙10</em>':''}`);C.speak(c.p);await wait(900)}
  /* 連鎖: three cards tied by two combos */
  if(C.ruleOn('sent')&&pairs.length>=2&&used.size>=3){const b=[...used].reduce((a,i)=>a+done[i].pw,0);comboDmg+=b;snd('chain');flash('rgba(160,230,255,.45)');await cutin('⛓️ CHAIN!!','3まいが つながった','chain');say(`⛓️ 連鎖！ 3まいが つながった +${b}`);await wait(900)}
  for(const w of wrongs.slice(0,1)){C.metWrong(w);B.res.wrong.push(w.k);await note(`<b>⚠️ まちがいコンボ</b><p><s>${esc(w.a)} ${esc(w.b)}</s> → <b>${esc(w.ok)}</b></p><small>${esc(w.why)}</small>`,'なるほど')}
  /* そろい: same kind of word */
  const at={};done.forEach(d=>{if(d.I.a&&d.I.k==='w')at[d.I.a]=(at[d.I.a]||0)+1});const sor=Object.values(at).filter(n=>n>=2).reduce((a,n)=>a+n,0);
  if(sor){total+=sor;say(`${C.ATTR[Object.keys(at).find(k=>at[k]>=2)][1]} そろいボーナス +${sor}`);await wait(500)}
  total+=comboDmg;B.lastCombo=comboDmg||B.lastCombo;
  /* the opponent's guard (なかま) or counter (反対語), now and then */
  if(total>0&&done.length&&C.ruleOn('guard')){const t=await aiDefend(done);total=Math.max(0,total-t)}
  if(total>0){B.ai.hp-=total;say(`💥 ${esc(B.F.n)}に <b>${total}</b> ダメージ！`);render();hit('ai',total)}
  await wait(900);if(B.ai.hp<=0)return end(true);await rageCheck();B.busy=false;render()}
/* low on stars, they get serious: their cards hit harder */
async function rageCheck(){if(!B||B.rage||B.ai.hp>B.ai.max*.3||B.F.id==='nagi')return;B.rage=true;snd('rage');flash('rgba(255,60,60,.4)');quake(true);
  await cutin(`🔥 ${esc(B.F.n)} 本気モード！`,'カードの 力 +2','rage',1300);render()}
/* the opponent blocks with a word of the same meaning, or hits back with an opposite: it shows you the pair */
async function aiDefend(done){const ai=B.ai;if(Math.random()>.5)return 0;
  for(const d of done){for(const c of ai.hand){const I=C.info(c.id);
    if(C.syn(d.h).includes(I.h)){ai.hand=ai.hand.filter(x=>x!==c);ai.disc.push(c);snd('shield');await note(`<b>🛡️ ${esc(B.F.n)}の なかまガード！</b><p><b>${esc(I.en)}</b> で <b>${esc(d.h)}</b> を ふせいだ</p><small>${esc(d.h)} と ${esc(I.h)} は にた 意味（${esc(I.ja)}）</small>`);return d.pw}
    if(C.ruleOn('counter')&&C.anto(d.h).includes(I.h)){ai.hand=ai.hand.filter(x=>x!==c);ai.disc.push(c);snd('slash');flash('rgba(255,255,120,.4)');await note(`<b>⚡ ${esc(B.F.n)}の 反対語カウンター！</b><p><b>${esc(d.h)}</b> ⇔ <b>${esc(I.en)}</b></p><small>${esc(I.en)} は「${esc(I.ja)}」。 反対の 意味だよ</small>`);return Math.ceil(d.pw/2)}}}
  return 0}

/* ================================================================ their turn */
function aiChoose(tide){const h=B.ai.hand,out=[];let left=tide;const I=c=>C.info(c.id);
  /* the best combo pair that fits */
  let best=null;for(let i=0;i<h.length;i++)for(let j=i+1;j<h.length;j++){const c=C.comboOf(I(h[i]).h,I(h[j]).h),cost=I(h[i]).cost+I(h[j]).cost;if(c&&cost<=left){const v=C.power(h[i].id)+C.power(h[j].id);if(!best||v>best[2])best=[h[i],h[j],v]}}
  if(best&&(Math.random()<B.F.p+.15+B.lv*.06)){out.push(best[0],best[1]);left-=I(best[0]).cost+I(best[1]).cost}
  h.filter(c=>!out.includes(c)).sort((a,b)=>C.power(b.id)-C.power(a.id)).forEach(c=>{if(I(c).cost<=left&&out.length<(B.lv>=4||B.F.mina?5:4)){out.push(c);left-=I(c).cost}});
  return out}
async function aiTurn(){if(!B)return;B.busy=true;B.sel=[];const F=B.F,ai=B.ai;render(`${F.ico} ${esc(F.n)}の ターン…`);snd('foeTurn');fxEl('fxturn ai',`<b>${esc(F.n)}の ターン</b>`,1100);await wait(900);
  let tide=tideOf(B.turn)+(F.p>=.8?1:0);draw(ai,refill(ai));let special=null;
  const spU=B.spU||0;if(spU<B.spN&&ai.hp<=ai.max*(spU?.25:B.spN>1?.6:.5)&&!(F.sp.k==='easy'&&spU)){B.spU=spU+1;B.spDone=true;special=F.sp}
  if(special){snd('charge');flash('rgba(255,140,80,.35)');await cutin(`${F.ico} 得意技！`,esc(special.n),'foe',1000);await note(`<div class="vsf">${F.ico}</div><b>得意技「${esc(special.n)}」！</b><p class="en">${esc(F.spl[0])}</p><small>${esc(F.spl[1])}<br>${esc(special.d)}</small>`,'くるぞ…');C.speak(F.spl[0])}
  let extra=[];let combo3=false,warp=false;
  if(special){const k=special.k;
    if(k==='heal'){ai.hp=Math.min(ai.max,ai.hp+special.v);render();hit('ai',special.v,true)}
    else if(k==='again'){draw(ai,2);tide+=2}
    else if(k==='freeze')B.fx.freeze=special.v;
    else if(k==='combo3')combo3=true;
    else if(k==='nodraw')B.fx.nodraw=1;
    else if(k==='steal'&&B.me.hand.length){const c=pickL(B.me.hand);B.me.hand=B.me.hand.filter(x=>x!==c);extra.push(c);say(`🎣 <b>${esc(cardName(c))}</b> を つりあげられた！`);await wait(900)}
    else if(k==='warp')warp=true;
    else if(k==='hard')B.fx.hard=1;
    else if(k==='lesson'){tide+=3;combo3=true}}
  const play=[...aiChoose(tide),...extra];ai.hand=ai.hand.filter(c=>!play.includes(c));ai.disc.push(...play.filter(c=>!extra.includes(c)));B.me.disc.push(...extra);
  let total=0;const done=[];
  for(const c of play){const I=C.info(c.id);let pw=foePow(c,I);const ok=Math.random()<Math.min(.97,F.p+B.lv*.03);if(!ok)pw=Math.ceil(pw/2);if(B.fx.easy)pw=Math.ceil(pw/2);
    const r=await react(c,I,pw,ok,warp);done.push({h:I.h,pw:r.raw,I});total+=r.dmg}
  /* their combos: you see the natural pair */
  const pairs=[];for(let i=0;i<done.length;i++)for(let j=i+1;j<done.length;j++){const c=C.comboOf(done[i].h,done[j].h);if(c)pairs.push([c,i,j])}
  for(const [c,i,j] of pairs.slice(0,F.mina||B.lv>=5?2:1)){let b=done[i].pw+done[j].pw;if(combo3)b*=2;if(B.fx.easy)b=Math.ceil(b/2);total+=b;snd('combo');await cutin(`${F.ico} COMBO!`,esc(c.p),'foe',900);C.speak(c.p);
    await note(`<b>🔗 ${esc(F.n)}の ことばコンボ！</b><p class="cgcmbp">${esc(c.p)}</p><small>${esc(c.j)}</small><p>+${b}</p>`,'うっ…')}
  if(special&&special.k==='pinch'){total+=special.v*2;say(`🦀 よこばさみ！ ${special.v}×2`)}
  if(special&&special.k==='encore'&&B.lastAi){const b=Math.ceil(B.lastAi/2);total+=b;say(`🎸 アンコール！ +${b}`)}
  if(special&&special.k==='mimic'&&B.lastCombo){total+=B.lastCombo;say(`🦜 ピップの ものまね！ +${B.lastCombo}`)}
  if(B.fx.easy)B.fx.easy--;
  total=Math.min(total,18+B.lv+(F.mina?4:0));   // one turn never takes more than about half your stars
  B.lastAi=total;
  if(total>0){B.me.hp-=total;render(`💥 あなたは <b>${total}</b> ダメージ`);hit('me',total)}else render(`${F.ico} ${esc(F.n)}の こうげきを ふせいだ！`);
  await wait(1000);if(B.me.hp<=0)return end(false);myTurn()}
/* one of their cards comes at you: read it, counter it, guard it, or take it */
function react(c,I,pw,ok,warp){return new Promise(async res=>{const me=B.me;
  const anti=C.ruleOn('counter')&&!warp?me.hand.filter(x=>{const X=C.info(x.id);return (X.k==='w'||X.k==='t')&&C.anto(I.h).includes(X.h)}):[];
  const fr=C.ruleOn('guard')&&!warp?me.hand.filter(x=>{const X=C.info(x.id);return (X.k==='w'||X.k==='t')&&C.syn(I.h).includes(X.h)}):[];
  const canRead=C.ruleOn('read')&&!warp;
  const o=C.ov(`<div class="cgbq"><div class="cgfoe">${B.F.ico} ${esc(B.F.n)}の カード ${ok?'':'<em>（まちがえて 半分の 力）</em>'}</div>${C.face(I.id,{big:1,marks:false,pw,cls:canRead?'qz':''})}
    <div class="cgrx">${canRead?'<button data-r="read">📖 意味を 読む<small>正解で ダメージ半分</small></button>':''}
      ${anti.map(x=>`<button data-r="anti" data-u="${x.u}">⚡ ${esc(cardName(x))} で カウンター</button>`).join('')}
      ${fr.map(x=>`<button data-r="guard" data-u="${x.u}">🛡️ ${esc(cardName(x))} で ガード</button>`).join('')}
      <button data-r="take" class="sub">${canRead||anti.length||fr.length?'うける':'OK'}</button></div></div>`,'bq');o.dataset.stay=1;
  try{H.say(I.lv,I.en)}catch(e){}
  if(warp)o.querySelector('.cgfoe').insertAdjacentHTML('beforeend',' <em>👽 ワープ！</em>');
  o.querySelectorAll('[data-r]').forEach(b=>b.onclick=async()=>{const k=b.dataset.r;C.closeOv();sf('step');
    if(k==='take'){snd('slash');burst('me','#ff8a9a',6);return res({dmg:pw,raw:pw})}
    if(k==='read'){const r=await askCard(I,qFor(I,{type:'mean'}),{tag:'📖 読む',pw});C.record(I.id,r.ok);B.res.q.push({id:I.id,ok:r.ok,foe:1});
      if(r.ok){B.res.read++;say(`📖 <b>${esc(I.en)}</b> を 読んだ！ ダメージ半分`);return res({dmg:Math.ceil(pw/2),raw:pw})}say(`📖 読めなかった…`);return res({dmg:pw,raw:pw})}
    const x=me.hand.find(y=>y.u===+b.dataset.u),X=C.info(x.id);const r=await askCard(X,qFor(X,{type:'mean'}),{tag:k==='anti'?'⚡ カウンター':'🛡️ ガード',nm:cardName(x),pw:cardPow(x)});
    C.record(x.id,r.ok);B.res.q.push({id:x.id,ok:r.ok});
    if(!r.ok){say(`${k==='anti'?'⚡':'🛡️'} しっぱい…`);return res({dmg:pw,raw:pw})}
    me.hand=me.hand.filter(y=>y!==x);me.disc.push(x);
    if(k==='guard'){say(`🛡️ なかまガード！ <b>${esc(I.h)}</b> ≒ <b>${esc(X.h)}</b> で ふせいだ`);snd('shield');burst('me','#9fe8ff',14);return res({dmg:0,raw:pw})}
    const back=cardPow(x);B.ai.hp-=back;say(`⚡ 反対語カウンター！ <b>${esc(I.h)}</b> ⇔ <b>${esc(X.h)}</b>　${esc(B.F.n)}に ${back}`);flash('rgba(255,255,120,.4)');render();hit('ai',back);await wait(500);
    if(B.ai.hp<=0){end(true);return}res({dmg:0,raw:pw})})})}

/* ================================================================ the end */
const RW=C;
function end(win,gaveUp){if(!B)return;const foeLvBefore=B.lv;const F=B.F,R=C.rec(),res=B.res,before=C.rank();R.games=(R.games||0)+1;
  let coins=win?F.coin+res.newCombo.length*5:gaveUp?0:Math.round(F.coin/4),gift=null;
  if(win){R.win[F.id]=(R.win[F.id]||0)+1;R.rp=(R.rp||0)+F.pt+(R.win[F.id]===1&&F.pt?1:0);
    const pool=foeDeck(F);gift=pickL(pool);C.give(gift)}else if(!gaveUp)R.lose[F.id]=(R.lose[F.id]||0)+1;
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
    <div class="cgsum"><span>⭕ ${ok}/${res.q.length}</span>${res.combos.length?`<span>🔗 ${res.combos.length}</span>`:''}${coins?`<span>🪙+${coins}</span>`:''}${win&&F.pt?`<span>🎖️+${F.pt}</span>`:''}</div>
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
  const rules=[['基本',0,'カードを 出すと ミニ問題。 正解で フルパワー'],['ことばコンボ',0,'自然な 組み合わせで 2ばい'],['😣 逆転・💤 わすれかけ',0,'苦手・わすれかけカードで 正解すると ボーナス'],['⭐ 相手の レベル',0,'勝つたびに 相手が 強くなる（Lv6まで）。 ほしが へると 本気モード'],
    ['📖 相手の 単語を 読む',CG_RULE_AT.read,'相手の カードの 意味が わかれば ダメージ半分'],['⚡ 反対語カウンター',CG_RULE_AT.counter,'反対の 意味の カードで はねかえす'],
    ['🛡️ なかまガード',CG_RULE_AT.guard,'にた 意味の カードで ふせぐ'],['🔄 変身',CG_RULE_AT.morph,'動詞の 過去形を 答えると パワー+3'],['🧩 語源パーツ',CG_RULE_AT.parts,'un-・re-・-ful などで 新しい 単語を 作る'],['📜 文カード・⛓️ 連鎖',CG_RULE_AT.sent,'ならべかえで 大技。 3まいの コンボで 連鎖']];
  H.show('cg',`<section class="pnl cgp">
    <div class="qtop"><button class="x" id="cgb" aria-label="もどる">←</button><b>⚔️ 対戦</b><span class="qn">${esc(CG_RANKS[r][0])}</span></div>
    <div class="cgrk"><b>🎖️ ${esc(CG_RANKS[r][0])}</b>${nx?`<i><u style="width:${Math.min(100,(rp-CG_RANKS[r][1])/(nx[1]-CG_RANKS[r][1])*100)}%"></u></i><small>つぎ ${esc(nx[0])}: ${esc(nx[2])}</small>`:'<small>最高段位！</small>'}</div>
    <div class="cgfoes">${FOES.map(F=>{const lock=r<F.need;const w=R.win[F.id]||0;return `<button data-f="${F.id}" class="${lock?'lk':''} ${F.mina?'mina':''}"><span class="fi">${lock?'🔒':F.ico}</span><span class="fn"><b>${esc(F.n)}</b><small>${lock?esc(CG_RANKS[F.need][0])+'から':esc(F.d)}</small></span>${w?`<em>🏆${w}<small>Lv${Math.min(5,w)+1}</small></em>`:''}</button>`}).join('')}</div>
    <p class="note">デッキは 毎回 ランダム。 3まいだけ 自分で えらべるよ</p>
    <details class="cgfold"><summary>📘 ルール</summary>${rules.map(([n,at,d])=>`<p class="${r>=at?'':'lk'}">${r>=at?'':'🔒 '}<b>${n}</b><br><small>${r>=at?d:esc(CG_RANKS[at][0])+'で ひらく'}</small></p>`).join('')}
      <p><b>✨ ことだま</b><br><small>毎ターン ふえる。 出せる カードの コストの 合計</small></p></details>
  </section>`);
  $('cgb').onclick=()=>{sf('back');(menuBack||C.open)()};
  H.panel.querySelectorAll('[data-f]').forEach(b=>b.onclick=()=>{const F=foe(b.dataset.f);if(r<F.need){H.toast(`🔒 ${esc(F.n)}とは <b>${esc(CG_RANKS[F.need][0])}</b> から 対戦できるよ`);return}sf('step');start(F.id,{back:()=>menu()})})}

window.CGB={start,menu,foes:FOES,foe,foeDeck,_state:()=>B,_render:()=>render()};
})();
