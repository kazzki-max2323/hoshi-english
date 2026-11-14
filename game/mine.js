/* ⛏️ 単語の 鉱山: 単語カードを 道具に して ほりすすむ。 同じ 単語を 何度も 使って おぼえる。
   - カードの ❤HP = 1回の 鉱山で 使える 回数。 苦手ほど 多く、 おぼえるほど（★が 育つほど） 少ない。 0に なると 💤 つかれて、 時間で 回復（5分で 1）
   - 問題: 和訳・英語で・聞きとり・つづり ならべかえ・コンボ あなうめ・例文 あなうめ。 深い 層ほど むずかしい 形と 単語
   - 自分の ❤ は 1回 30（5〜10分）。 0に なっても 見つけた 物は ぜんぶ 持ち帰れる
   - 見つかる 物: カード・宝石（コイン）・イベント。 ほっている あいだは ドット絵
   データは game/shop-data.js（MINE_LAYERS / MINE_EVENT / MINE_GEM） */
(()=>{
const {S:ST,sfx:SFX}=BEACH;
const H=HE,esc=H.esc,$=id=>document.getElementById(id);
const C=CG,R=()=>C.rec(),pickL=a=>a[Math.random()*a.length|0];
const sf=k=>{try{SFX[k]&&SFX[k]()}catch(e){}};
const ML=(k,v)=>{try{return MINA.line(k,v||{})}catch(e){return ['smile','']}};
const MN=()=>{const r=R();return r.mn||(r.mn={u:{},dives:0,best:0,q:0,ok:0})};
const PER=5*6e4,ME_HP=30,HAND=5;

/* ================================================================ card HP */
function hpMax(id){const I=C.info(id);if(!I||!(I.k==='w'||I.k==='t'))return 0;
  const s=C.star(id),lv=I.k==='t'?1:({es:-1,jh:0,hs:1,adv:2})[I.lv]||0;
  let h=9-(s-1)*1.6+lv+(I.k==='w'&&C.weak(id)?3:0)+(C.forgot(id)?1:0);
  return Math.max(2,Math.min(12,Math.round(h)))}
function hpNow(id){const m=hpMax(id),u=MN().u[id];if(!u)return m;const back=Math.floor((Date.now()-u[1])/PER);return Math.max(0,Math.min(m,m-u[0]+back))}
function use(id,n=1){const m=hpMax(id),now=hpNow(id),M=MN();M.u[id]=[m-Math.max(0,now-n),Date.now()];if(M.u[id][0]<=0)delete M.u[id]}
const tired=id=>!!MN().u[id]&&hpNow(id)<=0;
function restMin(id){const u=MN().u[id];if(!u)return 0;return Math.max(1,Math.ceil((PER-((Date.now()-u[1])%PER))/6e4))}
const tools=()=>{try{return SHOP.allCards().filter(id=>{const I=C.info(id);return I&&(I.k==='w'||I.k==='t')})}catch(e){return []}};
const tiredN=()=>tools().filter(tired).length;

/* ================================================================ choose the tools */
let pickSel=[];
function open(){const all=tools(),M=MN();
  const ok=all.filter(id=>hpNow(id)>0);
  /* おまかせ: 苦手・わすれかけ・★の 低い 順 */
  const score=id=>(C.weak(id)?100:0)+(C.forgot(id)?50:0)+(6-C.star(id))*8+hpNow(id)+Math.random()*6;
  pickSel=pickSel.filter(id=>ok.includes(id));
  if(!pickSel.length)pickSel=ok.slice().sort((a,b)=>score(b)-score(a)).slice(0,HAND);
  const list=ok.slice().sort((a,b)=>score(b)-score(a)).slice(0,90);
  H.show('cg',`<section class="pnl cgp shp mnp">
    <div class="qtop"><button class="x" id="mnb" aria-label="もどる">←</button><b>⛏️ 単語の 鉱山</b><span class="qn">${M.best?`最高 ${M.best}m`:''}</span></div>
    <p class="note">道具に する カードを ${HAND}まいまで えらぶ。 ❤が 0に なった カードは 💤 休けい（5分で ❤1 もどる）</p>
    <div class="mnhand">${pickSel.map(id=>`<div class="mnt" data-id="${esc(id)}">${C.face(id,{mini:1,marks:false})}<i>❤${hpNow(id)}</i></div>`).join('')}${'<div class="mnt empty"></div>'.repeat(Math.max(0,HAND-pickSel.length))}</div>
    <button id="mngo" class="big" ${pickSel.length?'':'disabled'}>⛏️ ほりに いく</button>
    <details class="shmore"><summary>カードを えらびなおす（${ok.length}まい つかえる${all.length-ok.length?` ・ 💤${all.length-ok.length}`:''}）</summary>
      <div class="shgrid">${list.map(id=>`<div class="shcell ${pickSel.includes(id)?'sel':''}" data-c="${esc(id)}">${C.face(id,{mini:1})}<span>❤${hpNow(id)}/${hpMax(id)}</span></div>`).join('')||'<p class="note">つかえる カードが ないよ。 少し 休ませてね</p>'}</div></details>
  </section>`);
  $('mnb').onclick=()=>{sf('back');SHOP.open()};
  H.panel.querySelectorAll('[data-c]').forEach(b=>b.onclick=()=>{const id=b.dataset.c,i=pickSel.indexOf(id);if(i>=0)pickSel.splice(i,1);else if(pickSel.length<HAND)pickSel.push(id);else{H.toast(`${HAND}まいまでだよ`);return}sf('tap');
    const op=H.panel.querySelector('.shmore').open;open();H.panel.querySelector('.shmore').open=op});
  H.panel.querySelectorAll('.mnt[data-id]').forEach(b=>b.onclick=()=>{sf('card');C.detail(b.dataset.id)});
  $('mngo').onclick=()=>{if(!pickSel.length)return;sf('open');dive(pickSel.slice())}}

/* ================================================================ the dive */
let D=null;
const layerOf=d=>{let L=MINE_LAYERS[0];MINE_LAYERS.forEach(x=>{if(d>=x.at)L=x});return L};
function dive(hand){try{SHOP.leave()}catch(e){}
  const M=MN();M.dives++;C.save();
  D={hand,cur:0,depth:0,hp:ME_HP,q:0,ok:0,got:[],coins:0,events:[],words:{},last:'',crack:0,anim:null,luck:0,alive:true,f:0,parts:[],pop:null,swing:0};
  H.show('cg',`<section class="pnl cgp mnp mnd" data-stay>
    <div class="qtop"><button class="x" id="mnx" aria-label="もちかえる">←</button><b id="mnl">⛏️ 0m</b><span class="qn" id="mnh"></span></div>
    <div class="mnstage"><canvas id="mncv" width="160" height="80"></canvas></div>
    <div class="mnhand sm" id="mnhd"></div>
    <div id="mnq"></div>
    <button id="mnhome" class="sub">🎒 ここで もちかえる</button></section>`);
  $('mnx').onclick=$('mnhome').onclick=()=>{sf('back');finish('home')};
  const cv=$('mncv'),c=cv.getContext('2d');c.imageSmoothingEnabled=false;let last=0;
  const tick=now=>{if(!D||!D.alive||!cv.isConnected){if(D)D.alive=false;return}requestAnimationFrame(tick);if(now-last<90)return;last=now;D.f++;draw(c)};
  requestAnimationFrame(tick);
  hud();next()}
function hud(){if(!D)return;const L=layerOf(D.depth);$('mnl').textContent=`⛏️ ${D.depth}m ・ ${L.n}`;
  $('mnh').innerHTML=`<span class="mnme"><b style="width:${D.hp/ME_HP*100}%"></b></span> ❤${D.hp}`;
  $('mnhd').innerHTML=D.hand.map((id,i)=>{const h=hpNow(id);return `<div class="mnt ${i===D.cur?'on':''} ${h<=0?'tired':''}" data-i="${i}">${C.face(id,{mini:1,marks:false})}<i>${h<=0?'💤':'❤'+h}</i></div>`}).join('');
  $('mnhd').querySelectorAll('.mnt').forEach(b=>b.onclick=()=>{const i=+b.dataset.i;if(hpNow(D.hand[i])<=0){H.toast('💤 その カードは つかれてるよ');return}if(i===D.cur||D.busy)return;D.cur=i;sf('pickCard'in SFX?'pickCard':'tap');hud();next(true)})}
/* the question for the card in hand */
function next(swap){if(!D)return;
  if(D.hp<=0)return finish('hp');
  if(hpNow(D.hand[D.cur])<=0){const j=D.hand.findIndex(id=>hpNow(id)>0);if(j<0)return finish('tired');D.cur=j;hud()}
  const id=D.hand[D.cur],I=C.info(id),L=layerOf(D.depth);
  let types=L.types.slice();if(!ST.sound)types=types.filter(t=>t!=='listen');if(!types.length)types=['mean'];
  let t=pickL(types);for(let k=0;k<4&&t===D.last;k++)t=pickL(types);D.last=t;
  const box=$('mnq');D.busy=false;
  const done=r=>after(id,r.ok);
  if(t==='scramble'){const q=scramble(I);if(q)return q(box,done)}
  if(t==='sent'){const q=sentQ(I);if(q){C.ask(box,q,done);return}t='fill'}
  const q=C.quiz(id,{type:t==='fill'?'fill':t==='listen'?'listen':t==='rev'?'rev':'mean'});
  C.ask(box,q,done,{tag:L.n})}
/* つづりの ならべかえ */
function scramble(I){const w=I.h;if(I.k!=='w'||!/^[a-z]{3,10}$/.test(w))return null;
  return (box,done)=>{let ls=H.shuffle([...w].map((ch,i)=>({ch,i})));if(ls.map(x=>x.ch).join('')===w)ls=ls.reverse();let got='',hint=false,over=false;
    const say=()=>{try{H.say(I.lv,I.en)}catch(e){}};
    const draw=()=>{box.innerHTML=`<div class="cgq"><div class="cgqt">つづりを ならべて</div><div class="cgqq"><span class="qja">${esc(I.ja)}</span></div>
      <div class="mnw">${[...w].map((_,i)=>`<b>${got[i]||(hint&&i===0?`<u>${w[0]}</u>`:'')}</b>`).join('')}</div>
      <div class="mnls">${ls.map((x,k)=>`<button data-k="${k}" ${x.used?'disabled':''}>${x.ch}</button>`).join('')}</div>
      <div class="cgqf"><button class="sub" data-h="1" ${hint?'disabled':''}>💡 ヒント</button><button class="sub" data-u="1">⌫ もどす</button></div><div class="cgqx" hidden></div></div>`;
      box.querySelector('[data-h]').onclick=()=>{if(hint||over)return;hint=true;sf('pickup');draw()};
      box.querySelector('[data-u]').onclick=()=>{if(over||!got.length)return;const x=ls.find(y=>y.used===got.length);if(x)x.used=0;got=got.slice(0,-1);sf('tap');draw()};
      box.querySelectorAll('[data-k]').forEach(b=>b.onclick=()=>{if(over)return;const x=ls[+b.dataset.k];if(x.used)return;got+=x.ch;x.used=got.length;sf('tap');
        if(got.length<w.length)return draw();over=true;const ok=got===w;draw();box.querySelectorAll('button').forEach(y=>y.disabled=true);
        if(ok){sf('correct');say();box.querySelector('.mnw').classList.add('ok');setTimeout(()=>done({ok:true}),750)}
        else{sf('wrong');box.querySelector('.mnw').classList.add('ng');const e=box.querySelector('.cgqx');e.hidden=false;
          e.innerHTML=`<p>正しくは <b>${esc(w)}</b>（${esc(I.ja)}）<br><small>${esc(w.split('').join(' - '))} と 声に 出して おぼえよう</small></p><button class="nx">つぎへ ▶</button>`;say();
          e.querySelector('.nx').onclick=()=>{sf('step');done({ok:false})}}})};
    draw()}}
/* 例文の あなうめ（文カードの 例文から） */
function sentQ(I){if(I.k!=='w')return null;const h=I.h;if(!/^[a-z]+$/.test(h))return null;const re=new RegExp('\\b'+h+'\\b','i');
  const ss=C.SENT.filter(s=>re.test(s.en));if(!ss.length)return null;const s=pickL(ss);
  const blank=s.en.replace(re,'＿＿＿');const ws=H.shuffle(C.W.filter(c=>c.lv===I.lv&&c.h!==h&&/^[a-z]+$/.test(c.h))).slice(0,3).map(c=>c.h);
  const ch=H.shuffle([h,...ws]);
  return {t:'fill',I,q:`<span class="qen">${esc(blank)}</span><span class="qja">${esc(s.ja)}</span>`,ch,ans:ch.indexOf(h),hint:`いみは「${esc(I.ja)}」`,
    tip:`<b>${esc(s.en)}</b><br>${esc(s.ja)}<br><small>${esc(I.en)} ＝ ${esc(I.ja)}。 文ごと 声に 出すと おぼえやすいよ</small>`,say:[s.lv,s.en]}}
/* after an answer */
function after(id,ok){if(!D)return;D.busy=true;D.q++;D.hp--;use(id);const st=C.record(id,ok);const w=D.words[id]||(D.words[id]=[0,0]);w[ok?0:1]++;
  const M=MN();M.q++;if(ok)M.ok++;
  if(ok){D.ok++;D.swing=6;sf('tap');setTimeout(()=>{if(!D)return;D.crack=0;D.depth++;burst();sf('knock');find();C.save();hud();setTimeout(()=>next(),D.pop&&D.pop.big?1100:500)},420);
    if(st)setTimeout(()=>H.toast(`⭐ ${esc(C.info(id).en.split(',')[0])} が ★${st} に！ ❤が へったよ（おぼえてきた しるし）`,2600),600);
    const r=R();r.rpq=(r.rpq||0)+1;if(r.rpq%6===0){const b=C.rank();r.rp=(r.rp||0)+1;if(C.rank()>b)setTimeout(()=>{sf('done');H.toast(`🎖️ 段位が <b>${esc(C.rankName())}</b> に 上がった！`,3200)},900)}}
  else{D.swing=6;D.crack=Math.min(2,D.crack+1);setTimeout(()=>{sf('tap')},300);C.save();hud();setTimeout(()=>next(),200)}
  if(hpNow(id)<=0)setTimeout(()=>{H.toast(`💤 ${esc(C.info(id).en.split(',')[0])} は つかれちゃった。 べつの カードに もちかえよう`,2600)},700)}
/* what you find */
function find(){const L=layerOf(D.depth),r=Math.random(),lk=D.luck>0?.18:0;if(D.luck>0)D.luck--;
  if(r<.06){const E=pickL(MINE_EVENT);D.events.push(E);let tx=E.t;
    if(E.hp)D.hp=Math.min(ME_HP,D.hp+E.hp);if(E.deep)D.depth+=E.deep;if(E.luck)D.luck+=E.luck;if(E.coin){D.coins+=E.coin}
    if(E.rest){const z=D.hand.find(id=>hpNow(id)<hpMax(id));if(z)delete MN().u[z]}
    D.pop={ico:E.ico,t:0,big:1};sf('hey');H.toast(`${E.ico} <b>${esc(E.n)}</b><small>${esc(tx)}</small>`,3600);return}
  if(r<.06+.22+lk){/* a card from this layer */
    const lv=pickL(L.lv),pool=C.W.filter(c=>c.lv===lv),fresh=pool.filter(c=>!C.owns(c.id));const c=pickL(fresh.length&&Math.random()<.75?fresh:pool);
    const isNew=!C.owns(c.id);C.give(c.id);D.got.push({id:c.id,isNew});D.pop={ico:'🎴',t:0,big:isNew};sf(isNew?'card':'pickup');
    H.toast(`🎴 カード 「${esc(c.en.split(',')[0])}」${isNew?' <b>NEW!</b>':''}`,2000);return}
  if(r<.06+.22+.25+lk){const gi=Math.min(MINE_GEM.length-1,Math.floor(Math.random()*(2+D.depth/12))),G=MINE_GEM[gi];const v=G[2]+Math.floor(D.depth/5);
    D.coins+=v;D.pop={ico:G[0],t:0};sf('coinIn');return}
  D.pop=null}

/* ================================================================ pixel art */
const PR=(c,x,y,w,h,col)=>{c.fillStyle=col;c.fillRect(x,y,w,h)};
function hsh(n){n=Math.imul(n^n>>>16,0x45d9f3b);n=Math.imul(n^n>>>16,0x45d9f3b);return (n^n>>>16)>>>0}
function draw(c){const L=layerOf(D.depth),[a,b,k]=L.col;
  /* tunnel: walls scroll as you go down */
  PR(c,0,0,160,80,k);PR(c,0,12,160,56,a);
  for(let i=0;i<60;i++){const h=hsh(i*977+D.depth*31),x=h%160,y=12+(h>>>8)%56;PR(c,x,y,2,1,b)}
  for(let i=0;i<14;i++){const h=hsh(i*131+D.depth*7);PR(c,h%160,(h>>>8)%12,3,2,b);PR(c,(h>>>3)%160,68+(h>>>11)%12,3,2,b)}
  /* deep layers sparkle */
  if(D.depth>=45)for(let i=0;i<6;i++){const h=hsh(i*53+D.depth);if((D.f+i*3)%10<6)PR(c,h%160,14+(h>>>9)%50,1,1,'#bfe9ff')}
  PR(c,0,62,160,6,b);PR(c,0,68,160,12,k);
  /* rails */
  PR(c,0,66,58,1,'#8a8a8a');for(let x=2;x<58;x+=6)PR(c,x,67,3,1,'#6a4a2a');
  /* lamp glow */
  const g=c.createRadialGradient(44,34,0,44,34,46);g.addColorStop(0,'rgba(255,230,160,.35)');g.addColorStop(1,'rgba(255,230,160,0)');c.fillStyle=g;c.fillRect(0,0,160,80);
  /* the rock in front */
  const rx=84;PR(c,rx,24,30,40,b);PR(c,rx+3,20,24,4,b);PR(c,rx+2,26,26,36,'#00000018');PR(c,rx+4,28,6,4,'#ffffff22');
  if(D.crack>=1){PR(c,rx+10,30,1,10,k);PR(c,rx+11,40,1,6,k);PR(c,rx+12,46,4,1,k)}
  if(D.crack>=2){PR(c,rx+18,26,1,12,k);PR(c,rx+17,38,1,8,k);PR(c,rx+6,48,8,1,k)}
  /* the miner */
  const sw=D.swing>0;if(D.swing>0)D.swing--;const x=52,y=34,dn=sw&&D.swing<3;
  PR(c,x+3,y+20,8,5,'#4a5a7a');PR(c,x+4,y+25,2,5,'#4a5a7a');PR(c,x+8,y+25,2,5,'#4a5a7a');PR(c,x+3,y+30,3,2,'#5a3a22');PR(c,x+8,y+30,3,2,'#5a3a22');
  PR(c,x+3,y+11,8,9,'#e86a4a');PR(c,x+4,y+13,6,1,'#ffd23f');PR(c,x+6,y+10,2,1,'#ffe0cc');PR(c,x+3,y+2,8,8,'#ffe0cc');
  PR(c,x+8,y+5,1,2,'#2a2340');PR(c,x+10,y+5,1,2,'#2a2340');PR(c,x+9,y+8,2,1,'#c06060');
  PR(c,x+2,y,10,3,'#ffd23f');PR(c,x+3,y-1,8,1,'#ffd23f');PR(c,x+11,y+1,2,2,'#fff8c0');PR(c,x+2,y+3,1,4,'#6a3a2a');
  /* pickaxe */
  if(dn){PR(c,x+10,y+14,3,2,'#e86a4a');PR(c,x+12,y+15,2,2,'#ffe0cc');for(let i=0;i<10;i++)PR(c,x+13+i,y+16+Math.floor(i/3),1,1,'#a8743e');PR(c,x+22,y+12,2,10,'#9aa0b0');PR(c,x+21,y+11,4,2,'#9aa0b0')}
  else{PR(c,x+10,y+8,3,5,'#e86a4a');PR(c,x+10,y+6,2,2,'#ffe0cc');for(let i=0;i<10;i++)PR(c,x+10-Math.floor(i/4),y+5-i,1,1,'#a8743e');PR(c,x+3,y-6,10,2,'#9aa0b0');PR(c,x+2,y-5,2,2,'#9aa0b0')}
  if(sw&&D.swing===2){PR(c,rx-2,40,2,2,'#fff8c0');PR(c,rx-4,36,1,1,'#fff8c0');PR(c,rx-1,46,1,1,'#fff8c0')}
  /* broken bits */
  D.parts=D.parts.filter(p=>{p.x+=p.vx;p.y+=p.vy;p.vy+=.5;p.l--;PR(c,p.x,p.y,2,2,p.c);return p.l>0});
  /* what popped out */
  if(D.pop){const p=D.pop;p.t++;const yy=40-Math.min(18,p.t*2);c.font='12px sans-serif';c.textAlign='center';c.fillText(p.ico,99,yy);c.textAlign='left';if(p.big&&p.t%4<2){PR(c,92,yy-14,1,1,'#fff');PR(c,107,yy-10,1,1,'#fff')}if(p.t>22)D.pop=null}
  /* the depth marker */
  c.fillStyle='#fff';c.font='bold 7px monospace';c.fillText(D.depth+'m',134,10)}
function burst(){const L=layerOf(D.depth);for(let i=0;i<14;i++)D.parts.push({x:96,y:44,vx:(Math.random()-.3)*3.2,vy:-Math.random()*3.5,l:12+Math.random()*8,c:pickL(L.col)})}

/* ================================================================ back home */
function finish(why){if(!D)return;const d=D;D.alive=false;D=null;const M=MN(),S=(()=>{try{return SHOP.rec()}catch(e){return {}}})();
  if(d.depth>M.best)M.best=d.depth;if(d.depth>(S.best||0))S.best=d.depth;S.mined=(S.mined||0)+1;
  let mapN=null;try{if(d.depth>=8&&window.ADV&&!ADV.has()&&Math.random()<.2)mapN=ADV.give()}catch(e){}
  if(d.coins)H.addCoins(d.coins);C.save();
  const head=why==='hp'?'⛏️ つかれたので 帰ってきた':why==='tired'?'💤 カードが みんな つかれた':'🎒 もちかえった';
  const ws=Object.entries(d.words);
  const show=()=>{H.show('cg',`<section class="pnl cgp mnp">
    <div class="qtop"><button class="x" id="mnb" aria-label="もどる">←</button><b>${head}</b><span class="qn">${d.depth}m</span></div>
    <div class="mnres"><p><b>${d.depth}m</b> まで ほった ・ ${d.q}問中 <b>${d.ok}</b>問 正解</p>
      <p>${d.coins?`🪙 +${d.coins}（宝石）`:''} ${d.got.length?`🎴 カード ${d.got.length}まい`:''} ${d.events.map(e=>e.ico).join('')}</p>${mapN?`<p class="mnmap">🗺️ 岩の すきまに 古い 宝の地図！「${esc(mapN)}」 <button id="mnmapgo" class="sub">宝探しに 行く</button></p>`:''}</div>
    <p class="note">使った 単語（○＝正解 ×＝まちがい）。 タップで カード</p>
    <div class="mnws">${ws.map(([id,w])=>{const I=C.info(id);return `<button data-id="${esc(id)}"><b>${esc(I.en.split(',')[0])}</b> ${esc(I.ja)} <span>${'○'.repeat(w[0])}${'×'.repeat(w[1])}</span> <i>❤${hpNow(id)}/${hpMax(id)}</i></button>`}).join('')}</div>
    <div class="row"><button id="mnshop" class="big">🃏 お店に もどる</button></div></section>`);
    sf(d.depth>=10||d.got.some(g=>g.isNew)?'done':'step');
    $('mnb').onclick=$('mnshop').onclick=()=>{sf('step');SHOP.open()};
    if($('mnmapgo'))$('mnmapgo').onclick=()=>{try{SFX.map()}catch(e){}ADV.open()};
    H.panel.querySelectorAll('.mnws [data-id]').forEach(b=>b.onclick=()=>{sf('card');C.detail(b.dataset.id)});
    setTimeout(()=>{try{if(window.MINA&&MINA.canAnnounce&&MINA.canAnnounce()){const [ex,tx]=ML('sh_mineEnd',{n:d.q,d:d.depth});MINA.say('m',ex,tx,7000)}}catch(e){}},900)};
  if(d.got.length)C.reveal(d.got,'鉱山で 見つけた カード',show);else show()}
H.on('home',()=>{if(D){D.alive=false;if(D.coins)H.addCoins(D.coins);D=null;C.save()}});

window.MINE={open,hpMax,hpNow,tired,restMin,tiredN,rec:MN};
})();
