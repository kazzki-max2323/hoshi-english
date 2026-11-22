/* 🏕️ 鉱山の 休憩所: 5まい ほりだして 床が くずれた あと、 下の 階に ある 小さな たき火と ランタンの 休憩所（game/mine.js の rest から）
   - ❤ が ゆっくり もどる（ここに いる 間 10びょうで 1・🪵たきぎで 5びょう。 11/18 ユーザー「回復は もっと ゆっくり」で 4→10）・🍙 もちものの 食べ物を 食べる
   - 📻 単語ラジオ: 📖カードブックの ことばを ランダムに 英語 → 日本語で ゆっくり 流す（オン/オフ。 11/18 ユーザー。 ブックが 少ない ときは きょう ほった ことば）
   - 📡 トランシーバーで ミオと 話す（game/mine-walkie.js）
   - たき火の そばに さっきの 5まいが ふわっと うかぶ。 タップで 読み上げ、 もう一回で 📖 くわしく（ながめるだけの 復習）
   - 深い 階・夜（SCENE.dark）ほど まわりが 暗く、 灯りが きれいに 見える。 ミオの 声も しっとりめ */
(()=>{
const {sfx:SFX}=BEACH;
const H=HE,esc=H.esc,$=id=>document.getElementById(id);
const C=CG,pickL=a=>a[Math.random()*a.length|0];
const sf=k=>{try{SFX[k]&&SFX[k]()}catch(e){}};
const ML=(k,v)=>{try{return MINA.line(k,v||{})}catch(e){return ['smile','']}};
const head1=I=>I.en.split(',')[0].trim();
const night=()=>{try{return SCENE.dark()}catch(e){return 0}};
let A=null,T=null,RAD=null,tick=0;
/* しっとり度 0〜1: 深い 階と 夜 */
const mood=fl=>Math.min(1,Math.max(night(),(fl-1)/8));
function stop(){clearInterval(T);T=null;radioOff();A=null}

function open(api){stop();A=api;A.m=mood(api.floor);A.f=0;A.tap={};
  const M=CG.rec().mn||{};M.rests=(M.rests||0)+1;C.save();
  const k=!M.restTold?'mn_restFirst':!M.slowTold?'mn_restSlow':A.m>.6?'mn_restNight':'mn_rest';if(!M.restTold){M.restTold=1;C.save()}else if(!M.slowTold){M.slowTold=1;C.save()}
  const [ex,tx]=ML(k,{f:api.floor});
  H.show('cg',`<section class="pnl cgp mnp mnrest ${A.m>.6?'dim':''}" data-stay>
    <div class="qtop"><span></span><b>🏕️ 地下${api.floor}階の 休憩所</b><span class="qn" id="mrhp"></span></div>
    <div class="mrstage"><canvas id="mrcv" width="160" height="90"></canvas><div class="mrfl" id="mrfl"></div><div class="mrcap" id="mrcap" hidden></div></div>
    <p class="mrnote" id="mrnote">🔥 たき火に あたると ❤が ゆっくり もどるよ</p>
    <div class="kmina"><span class="lface">${MINA.face('m',ex)}</span><p>${tx}</p></div>
    <div class="mrbtns"><button id="mreat">🍙 食べる</button><button id="mrrad">📻 単語ラジオ</button><button id="mrwk">📡 ミオと 無線${window.MINE_WALKIE&&MINE_WALKIE.fresh()?'<i class="dot"></i>':''}</button></div>
    <div class="mrtl" id="mrtl"></div>
    <button class="big" id="mrgo">⛏️ 地下${api.floor}階を ほる</button>
    <div class="row"><button class="sub" id="mrhome">🏠 ここで 帰る</button></div></section>`);
  $('mrgo').onclick=()=>{sf('step');const a=A;stop();a.dig()};
  $('mrhome').onclick=()=>{sf('back');const a=A;stop();a.home()};
  $('mreat').onclick=()=>{sf('open');eat()};
  $('mrrad').onclick=()=>{sf('tap');RAD?radioOff():radioOn()};
  $('mrwk').onclick=()=>{sf('open');if(window.MINE_WALKIE)MINE_WALKIE.open({floor:A.floor,ids:A.ids,trip:A.trip,m:A.m,hp:A.hp,setHp:A.setHp})};
  floats();hpShow();tools();
  const cv=$('mrcv'),c=cv.getContext('2d');c.imageSmoothingEnabled=false;let last=0;
  const loop=now=>{if(!A||!cv.isConnected)return;requestAnimationFrame(loop);if(now-last<110)return;last=now;A.f++;draw(c)};requestAnimationFrame(loop);
  /* ❤ が もどる */
  T=setInterval(()=>{if(!A||!$('mrcv')){stop();return}tick++;if(tick%(A.wood?5:10))return;const h=A.hp();if(h<A.max){A.setHp(h+1);hpShow(true)}},1000)}
function hpShow(up){const el=$('mrhp');if(!el||!A)return;const h=A.hp();el.innerHTML=`<span class="mnme"><b style="width:${h/A.max*100}%"></b></span> ❤${h}`;
  if(up){el.classList.remove('mrup');void el.offsetWidth;el.classList.add('mrup')}
  const n=$('mrnote');if(n)n.textContent=h>=A.max?'❤ まんたん！ いつでも ほりに 行けるよ':A.wood?'🪵 火が 大きい！ ❤が いつもの 2ばいで もどるよ':'🔥 たき火に あたると ❤が ゆっくり もどるよ'}

/* 🏕️ 休憩所で つかう 道具（雑貨屋の ⛏️ たな）: 🪵 たきぎ・🔋 ラジオの 電池・🗺️ 坑道の 地図 */
const tN=id=>{try{return MINE.toolN(id)}catch(e){return 0}};
function tools(){const el=$('mrtl');if(!el||!A)return;const L=[['wood','🪵 たきぎを くべる',!A.wood],['batt','🔋 ラジオに 電池',!A.batt],['map','🗺️ 地図を ひらく',!A.mapd]].filter(t=>tN(t[0])>0||!t[2]);
  el.innerHTML=L.map(t=>t[2]?`<button class="sub" data-tl="${t[0]}">${t[1]} <small>×${tN(t[0])}</small></button>`:`<span class="mron">${t[1].split(' ')[0]} ${t[0]==='wood'?'火が 大きい':t[0]==='batt'?'ふくしゅう チャンネル':'つぎは えらべる'}</span>`).join('');
  el.querySelectorAll('[data-tl]').forEach(b=>b.onclick=()=>{const k=b.dataset.tl;if(!A||!MINE.takeTool(k))return;A.used&&A.used(MINE_TOOLS[k].ico);
    if(k==='wood'){A.wood=1;sf('knock');hpShow()}else if(k==='batt'){A.batt=1;A.batN=0;sf('pickup');if(RAD)radioOff();radioOn()}else{A.mapd=1;A.map&&A.map();sf('open')}
    const [,tx]=ML('mn_rest_'+k);if(tx)H.toast(`${MINE_TOOLS[k].ico} <b>${esc(MINE_TOOLS[k].n)}</b><small>${MICO()} ${esc(tx)}</small>`,3400);tools()})}

/* たき火の そばに うかぶ 5まい: タップで 📖 くわしく */
function floats(){const el=$('mrfl');if(!el)return;const P=[[3,4],[22,15],[41,3],[60,15],[79,4]];
  el.innerHTML=A.ids.map((id,i)=>{const I=C.info(id);if(!I)return '';const p=P[i%P.length];return `<button class="mrfc" data-id="${esc(id)}" style="left:${p[0]}%;top:${p[1]}%;--d:${(i*.7).toFixed(1)}s"><b>${esc(head1(I))}</b><small>${esc(I.ja)}</small></button>`}).join('');
  el.querySelectorAll('.mrfc').forEach(b=>b.onclick=()=>{const id=b.dataset.id,I=C.info(id);if(!I)return;
    /* 11/18 ユーザー「タップしたら この画面に」: 1回目から くわしく 画面（ひらくと 読む） */
    A.tap[id]=1;b.classList.add('lit');C.peek(id,{from:'mine'});
    const M=CG.rec().mn||{};if(!M.floatTold){M.floatTold=1;C.save();setTimeout(()=>{const [,tx]=ML('mn_float');if(tx)H.toast(`${MICO()} <b>ミナ先生</b><small>${esc(tx)}</small>`,3600)},800)}})}

/* 🍙 食べる */
function eat(){const L=window.FOOD?FOOD.bagList():[],bag=window.FOOD?FOOD.rec().bag:{};
  const o=C.ov(`<div class="mnlo"><p class="mnlon">🍙 なにを 食べる？ <small class="mnhp">❤ ${A.hp()}/${A.max}</small></p>
    <div class="mnlol">${L.length?L.map(s=>`<button class="mnlor mnuse" data-f="${esc(s.id)}" ${A.hp()>=A.max?'disabled':''}><span class="gi">${s.ico}</span><span><b>${esc(s.n)}</b> <b class="n">×${bag[s.id]}</b><small>❤+${s.hp}${A.hp()>=A.max?'（いまは まんたん）':''}</small></span></button>`).join(''):'<p class="mnlod">食べものが ないよ。 ながれぎ雑貨店の 🥪 食べ物の たなで 買えるよ。 たき火に あたっているだけでも ❤は もどるからね</p>'}</div>
    <button class="mnlob" data-x>🔥 たき火に もどる</button></div>`,'mnlov');
  o.querySelector('[data-x]').onclick=()=>{sf('back');C.closeOv()};
  o.querySelectorAll('[data-f]').forEach(b=>b.onclick=()=>{const id=b.dataset.f;if(!A||!FOOD.take(id))return;const s=FOOD_SNACKS[id],a=A.hp();A.setHp(a+(s.hp||0));A.used&&A.used(s.ico);
    try{RECENT.add('snack',{id,en:s.en,ja:s.n,ico:s.ico,mine:1})}catch(e){}
    sf('eat');setTimeout(()=>sf('gulp'in SFX?'gulp':'pop'),450);C.closeOv();hpShow(true);
    const [,tx]=ML('mn_restEat',{t:s.n});H.toast(`${s.ico} <b>${esc(s.n)}</b> ❤ ${a} → <b>${A.hp()}</b><small>${MICO()} ${esc(tx)}</small>`,3200)})}

/* 📻 単語ラジオ: 英語 → 少し まって 日本語の 字幕。 きょう ほった ことば（たりなければ 同じ レベルから） */
function bookWords(){try{return window.STOCK?STOCK.bookIds().filter(id=>{const I=C.info(id);return I&&(I.k==='w'||I.k==='t')}):[]}catch(e){return []}}
function radioList(){const bk=bookWords();A.rsrc=bk.length>=5?'book':'trip';if(A.rsrc==='book')return H.shuffle(bk).slice(0,60);
  let ids=(A.trip||[]).slice();if(ids.length<5){const lv=(C.info(A.ids[0])||{}).lv||'es';ids=ids.concat(H.shuffle(C.W.filter(c=>c.lv===lv&&C.owns(c.id))).slice(0,5-ids.length).map(c=>c.id))}
  /* （ブックが まだ 少ない とき）🔋 電池: お店の チャンネル＝📖ブックの ことばも 流れる */
  if(A.batt){let bk=[];try{bk=H.shuffle(Object.keys(SHOP.bookRec()).filter(id=>{const I=C.info(id);return I&&(I.k==='w'||I.k==='t')&&!ids.includes(id)})).slice(0,5)}catch(e){}ids=ids.concat(bk);return H.shuffle(ids)}
  return H.shuffle(ids)}
function radioOn(){if(!A)return;const list=radioList();if(!list.length){H.toast('📻 まだ 流せる ことばが ないよ');return}
  RAD={list,i:0,alive:true};const R0=RAD;const b=$('mrrad');if(b){b.classList.add('on');b.innerHTML='📻 ラジオ <b>オン</b>'}
  const M=CG.rec().mn||{};M.radio=(M.radio||0)+1;C.save();
  if(!M.radioTold){M.radioTold=1;C.save();setTimeout(()=>{const [,tx]=ML('mn_radio');if(tx)H.toast(`${MICO()} <b>ミナ先生</b><small>${esc(tx)}</small>`,3800)},600)}
  else if(A.rsrc==='book'&&!M.radioBookTold){M.radioBookTold=1;C.save();setTimeout(()=>{const [,tx]=ML('mn_radioBook');if(tx)H.toast(`${MICO()} <b>ミナ先生</b><small>${esc(tx)}</small>`,4000)},600)}
  else if(A.rsrc==='trip'&&Math.random()<.5)setTimeout(()=>{const [,tx]=ML('mn_radioFew');if(tx)H.toast(`${MICO()} <b>ミナ先生</b><small>${esc(tx)}</small>`,3800)},600);
  /* ミオの ラジオ DJ（ときどき。 声は MIO.say） */
  const dj=window.MIO&&(M.radio===1||Math.random()<.35);
  const step=()=>{if(!R0.alive||RAD!==R0||!$('mrcap'))return;const id=R0.list[R0.i%R0.list.length],I=C.info(id);R0.i++;
    const cap=$('mrcap');if(!I||!cap)return setTimeout(step,300);cap.hidden=false;cap.innerHTML=`📻${A&&A.rsrc==='book'?'📖':''} <b>${esc(head1(I))}</b> <span class="ja"></span>`;
    let fin=false;const nx=()=>{if(fin)return;fin=true;setTimeout(()=>{if(!R0.alive)return;const j=cap.querySelector('.ja');if(j)j.textContent=I.ja;
      if(A&&A.batt&&(A.batN||0)<3&&window.STOCK&&STOCK.credit(id,'bat')){A.batN=(A.batN||0)+1;if(j)j.textContent=I.ja+'　📦 仕入れ！'}setTimeout(()=>{if(!R0.alive)return;try{H.say(I.lv,I.en)}catch(e){}setTimeout(step,2600)},1500)},900)};
    try{H.say(I.lv,I.en,nx)}catch(e){}setTimeout(nx,3500)};
  if(!dj)return step();
  /* さいしょに ミオが DJ の ひとこと → 読みおわってから ことばを 流す */
  const L=pickL(MIO_RADIO),cap=$('mrcap');if(cap){cap.hidden=false;cap.innerHTML=`📻 <b>DJ ミオ</b> <span class="ja">${esc(L[1])}</span>`}
  try{MIO.say(L[0],{soft:A.m>.6})}catch(e){}H.afterTalk(step,700,2600,()=>R0.alive&&RAD===R0)}
function radioOff(){if(RAD)RAD.alive=false;RAD=null;const b=$('mrrad');if(b){b.classList.remove('on');b.innerHTML='📻 単語ラジオ'}const c=$('mrcap');if(c)c.hidden=true}

/* ================================================================ ドット絵（11/18 描きなおし）: 石づみの 部屋・はしらと はり・テント・トロッコの 坑道・
   石で かこんだ たき火と やかん・丸太に すわる 自分・木箱の ラジオ・ランタン。 たき火の まわりだけ 明るい */
const PR=(c,x,y,w,h,col)=>{c.fillStyle=col;c.fillRect(x,y,w,h)};
function hsh(n){n=Math.imul(n^n>>>16,0x45d9f3b);n=Math.imul(n^n>>>16,0x45d9f3b);return (n^n>>>16)>>>0}
const shd=(hex,f)=>{const n=parseInt(hex.slice(1),16);let r=n>>16,g=n>>8&255,b=n&255;const t=f<0?0:255,p=Math.min(1,Math.abs(f));return `rgb(${Math.round(r+(t-r)*p)},${Math.round(g+(t-g)*p)},${Math.round(b+(t-b)*p)})`};
function glow(c,x,y,r,col,a){c.globalCompositeOperation='lighter';const g=c.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,`rgba(${col},${a})`);g.addColorStop(1,`rgba(${col},0)`);c.fillStyle=g;c.fillRect(x-r,y-r,r*2,r*2);c.globalCompositeOperation='source-over'}
function stones(c,x0,y0,w,h,col,seed){PR(c,x0,y0,w,h,shd(col,-.5));let y=y0,row=0;
  while(y<y0+h){const rh=5+hsh(seed+row*7)%3;let x=x0-hsh(seed+row*13)%10,i=0;
    while(x<x0+w){const bw=7+hsh(seed+row*31+i*17)%9,v=(hsh(seed+row*5+i*3)%100)/100*.18-.09,bx=Math.max(x0,x+1),be=Math.min(x0+w,x+bw),by=y+1,bh=Math.min(rh-1,y0+h-by);
      if(be>bx&&bh>0){PR(c,bx,by,be-bx,bh,shd(col,v));PR(c,bx,by,be-bx,1,shd(col,v+.16));PR(c,bx,by+bh-1,be-bx,1,shd(col,v-.2));PR(c,be-1,by,1,bh,shd(col,v-.14));
        if(hsh(i*99+row+seed)%3===0&&be-bx>4)PR(c,bx+2+hsh(i+row*3)%(be-bx-3),by+2,1,1,shd(col,v-.28))}
      x+=bw;i++}y+=rh;row++}}
function beamV(c,x,y,w,h){PR(c,x,y,w,h,'#6a4426');PR(c,x,y,1,h,'#8e5e34');PR(c,x+w-1,y,1,h,'#3e2614');for(let j=y+5;j<y+h;j+=9)PR(c,x+1,j,w-2,1,'#563620')}
function beamH(c,x,y,w,h){PR(c,x,y,w,h,'#6a4426');PR(c,x,y,w,1,'#8e5e34');PR(c,x,y+h-1,w,1,'#3e2614');for(let i=x+4;i<x+w;i+=11)PR(c,i,y+1+(i%2),3,1,'#563620')}
const FX=80,FY=73;
let BG=null,BGK='';
function restBg(L,fl){const cv=document.createElement('canvas');cv.width=160;cv.height=90;const c=cv.getContext('2d');const [a,b,k]=L.col;
  PR(c,0,0,160,90,k);stones(c,0,0,160,67,a,fl*97+3);
  for(let x=0;x<160;x++){const d=(x-74)/80,ch=Math.round(3+d*d*14+hsh(x*7+fl)%2);PR(c,x,0,1,ch,shd(k,-.35));PR(c,x,ch,1,1,shd(a,-.4))}
  for(let i=0;i<7;i++){const h=hsh(i*41+fl*3),x=10+h%140,l=3+(h>>>8)%5,top=Math.round(3+((x-74)/80)**2*14);for(let j=0;j<l;j++){const w=Math.max(1,3-Math.floor(j*3/l));PR(c,x+Math.floor((3-w)/2),top+j,w,1,shd(k,-.05))}}
  /* 右おくの 坑道（トロッコの レール） */
  const tx=138,tw=12;for(let y=36;y<67;y++){const dy=y-36,hf=dy<tw?Math.round(Math.sqrt(tw*tw-(tw-dy)**2)):tw;PR(c,tx-hf,y,hf*2,1,'#0a0712')}
  for(let i=0;i<=10;i++){const t=Math.PI*i/10,x=Math.round(tx-Math.cos(t)*(tw+1)),y=Math.round(48-Math.sin(t)*(tw+1));PR(c,x-1,y-1,3,2,shd(a,.14))}
  for(let y=50;y<67;y+=4){PR(c,tx-tw-2,y,2,3,shd(a,.1));PR(c,tx+tw,y,2,3,shd(a,.1))}
  /* ゆか */
  PR(c,0,66,160,24,b);PR(c,0,66,160,2,shd(b,-.35));
  for(let i=0;i<70;i++){const h=hsh(i*313+fl*11);PR(c,h%160,69+(h>>>8)%21,(h>>>16)%3+1,1,(h>>>20)%2?shd(b,.15):shd(b,-.2))}
  for(let y=67;y<90;y++){const t=(y-67)/23,l=Math.round(tx-6-t*10),r=Math.round(tx+6+t*9);if((y-67)%4===1)PR(c,l-1,y,r-l+3,1,'#4a3020');PR(c,l,y,1,1,'#a8aeb8');PR(c,r,y,1,1,'#a8aeb8')}
  /* トロッコ */
  const mx=127;PR(c,mx,57,22,8,'#4e5260');PR(c,mx,57,22,1,'#a0a6b4');PR(c,mx+1,58,20,1,'#6a6e7c');PR(c,mx,64,22,1,'#2e3038');for(let i=mx+5;i<mx+22;i+=6)PR(c,i,58,1,6,'#3e4250');
  for(let i=0;i<9;i++){const h=hsh(i*17+fl);PR(c,mx+1+i*2,54+(i%3===1?-1:i%2),3,3,shd(b,(h%24)/100-.04))}
  PR(c,mx+6,54,1,1,'#7ad8ff');PR(c,mx+12,53,1,1,'#ffd23f');PR(c,mx+17,55,1,1,'#ff9ab0');
  [mx+2,mx+15].forEach(x=>{PR(c,x,64,5,3,'#1e1e24');PR(c,x+1,65,3,1,'#6a6a74')});
  /* はしらと はり */
  beamV(c,2,8,4,59);beamV(c,116,8,4,59);beamH(c,0,5,124,4);PR(c,2,9,4,1,'#3e2614');PR(c,116,9,4,1,'#3e2614');PR(c,3,6,1,1,'#c8c8d0');PR(c,117,6,1,1,'#c8c8d0');
  /* つるはしと スコップ（右の はしらに 立てかける） */
  for(let i=0;i<18;i++)PR(c,113-Math.floor(i/3),49+i,1,1,i%5?'#a8743e':'#7a5028');PR(c,108,46,10,2,'#9aa0b0');PR(c,108,46,10,1,'#c8ccd8');PR(c,107,47,2,2,'#9aa0b0');
  /* テント */
  for(let y=44;y<67;y++){const hw=Math.round((y-44)*15/23);PR(c,27-hw,y,hw*2+1,1,'#c8b088');PR(c,27-hw,y,1,1,'#ead6aa');PR(c,27+hw,y,1,1,'#9a8460');if(y%5===0)PR(c,27-hw+2,y,hw*2-3,1,'#bca47c')}
  for(let y=53;y<67;y++){const hw=Math.round((y-53)*5/14);PR(c,27-hw,y,hw*2+1,1,'#2a1e18')}
  PR(c,27,41,1,4,'#6a4426');PR(c,25,40,4,2,'#e86a4a');for(let i=0;i<10;i++)PR(c,42+i,52+Math.round(i*1.4),1,1,'#8a7656');PR(c,12,66,31,1,'#7a6648');
  /* リュック */
  PR(c,44,59,8,8,'#6a5a3a');PR(c,45,58,6,2,'#7e6c46');PR(c,45,61,6,1,'#4e4228');PR(c,46,63,4,2,'#8a7650');PR(c,47,63,2,1,'#d8b040');
  /* すわる 丸太 */
  PR(c,49,68,16,4,'#6a4426');PR(c,49,68,16,1,'#8e5e34');PR(c,49,71,16,1,'#3e2614');PR(c,48,68,2,4,'#b88a52');PR(c,48,69,1,2,'#8a5a32');
  /* 木箱 */
  PR(c,95,61,14,7,'#8a5a32');PR(c,95,61,14,1,'#b07a44');PR(c,95,64,14,1,'#6a4426');PR(c,95,67,14,1,'#4a2e18');PR(c,95,61,1,7,'#6a4426');PR(c,108,61,1,7,'#4a2e18');
  return cv}
/* たき火の ほのお（列ごとに ゆらぐ） */
function flame(c,f,big){const W=big?7:5,Hh=big?17:12;
  for(let dx=-W;dx<=W;dx++){const e=1-Math.abs(dx)/(W+1),n=hsh(f*7+dx*13+99)%4,h=Math.max(1,Math.round(Hh*Math.pow(e,1.4))+n-1),x=FX+dx;
    PR(c,x,FY-h,1,h,'#d8341a');if(h>2)PR(c,x,FY-Math.round(h*.78),1,Math.round(h*.78),'#ff7a1e');if(Math.abs(dx)<W*.65&&h>3)PR(c,x,FY-Math.round(h*.52),1,Math.round(h*.52),'#ffc23a');if(Math.abs(dx)<2&&h>4)PR(c,x,FY-Math.round(h*.28),1,Math.round(h*.28),'#fff4c0');
    if(n===3&&Math.abs(dx)<W-1)PR(c,x,FY-h-2-(f%3),1,1,'#ff9a2a')}}
function draw(c){if(!A)return;const L=A.layer(),m=A.m,f=A.f,big=!!A.wood,key=L.n+'|'+A.floor;
  if(!BG||BGK!==key){BG=restBg(L,A.floor);BGK=key}c.drawImage(BG,0,0);
  /* 深い 階の 水晶 */
  if(A.floor>=5)for(let i=0;i<7;i++){const h=hsh(i*53+A.floor*7),x=8+h%104,y=22+(h>>>9)%34,cc=A.floor>=12?'#c49aff':'#7ad8ff';PR(c,x,y,1,4,cc);PR(c,x+1,y+1,1,3,'#e8f8ff');PR(c,x-1,y+2,1,2,cc);if((f+i*3)%14<4)PR(c,x,y-1,1,1,'#fff')}
  /* 📻 ラジオ（木箱の 上）と 📡 トランシーバー */
  const on=!!RAD;PR(c,97,54,9,7,'#c0462e');PR(c,97,54,9,1,'#e8745a');PR(c,98,56,4,4,'#5a2418');for(let i=0;i<4;i+=2)for(let j=0;j<4;j+=2)PR(c,98+i,56+j,1,1,'#2a1410');PR(c,103,56,2,2,on&&f%4<2?'#7aff7a':'#ffd23f');PR(c,103,59,2,1,'#e8e8e8');
  for(let i=0;i<6;i++)PR(c,98-Math.floor(i/2),53-i,1,1,'#b0b0b8');
  PR(c,106,56,3,5,'#3a3a4a');PR(c,107,53,1,3,'#3a3a4a');PR(c,106,57,3,1,'#5a5a6a');if(window.MINE_WALKIE&&MINE_WALKIE.fresh()&&f%8<4)PR(c,107,58,1,1,'#7aff7a');
  /* 石の わ・まき（おく） */
  [[-10,-1],[-6,-2],[6,-2],[10,-1]].forEach(([dx,dy])=>{PR(c,FX+dx-2,FY+dy,4,3,'#6e6a72');PR(c,FX+dx-2,FY+dy,4,1,'#9a96a0')});
  PR(c,FX-7,FY-1,14,2,'#5a3418');PR(c,FX-7,FY-1,14,1,'#7a4a24');PR(c,FX-5,FY-3,3,3,'#4a2a12');PR(c,FX+3,FY-3,3,3,'#4a2a12');
  /* 丸太に すわる 自分（たき火に 手を かざす） */
  const ox=50,br=f%30<15?0:1,bk=f%52<2;
  PR(c,ox+4,64,9,3,'#3e5684');PR(c,ox+11,64,3,6,'#3e5684');PR(c,ox+11,70,5,2,'#5a3a22');PR(c,ox+3,66,4,2,'#3e5684');
  PR(c,ox+3,55+br,7,10-br,'#e86a4a');PR(c,ox+3,55+br,1,10-br,'#c04a32');PR(c,ox+4,58+br,5,1,'#ffd23f');PR(c,ox+3,63,7,1,'#6a4426');
  PR(c,ox+8,57+br,6,2,'#e86a4a');PR(c,ox+14,56+br,2,3,'#ffe0cc');
  PR(c,ox+3,47+br,8,8,'#ffe0cc');PR(c,ox+3,48+br,2,6,'#7a4a2a');PR(c,ox+9,50+br,1,bk?1:2,'#2a2340');PR(c,ox+8,53+br,2,1,'#ff9a9a');
  PR(c,ox+2,45+br,10,3,'#ffd23f');PR(c,ox+3,44+br,8,1,'#ffd23f');PR(c,ox+4,44+br,3,1,'#fff2a0');PR(c,ox+2,47+br,11,1,'#d8a820');PR(c,ox+11,45+br,2,2,'#fff8c0');
  /* 暗さ: たき火の まわりだけ 明るい（深い 階・夜ほど 暗い） */
  const fk=(Math.sin(f*.9)+Math.sin(f*2.3))*1.5;
  const g=c.createRadialGradient(FX,FY-8,16+(big?6:0)+fk,FX,FY-8,128);g.addColorStop(0,'rgba(8,5,20,0)');g.addColorStop(.5,`rgba(8,5,20,${(.22+m*.3).toFixed(2)})`);g.addColorStop(1,`rgba(8,5,20,${(.55+m*.32).toFixed(2)})`);c.fillStyle=g;c.fillRect(0,0,160,90);
  /* ほのおと 前の 石・三きゃくの やかん */
  flame(c,f,big);
  PR(c,FX-4,FY,8,1,'#ff5a1a');
  [[-12,1],[-8,3],[-3,4],[3,4],[8,3],[12,1]].forEach(([dx,dy])=>{PR(c,FX+dx-2,FY+dy,4,3,'#7a7680');PR(c,FX+dx-2,FY+dy,4,1,'#b8a8a0');PR(c,FX+dx-2,FY+dy+2,4,1,'#4e4a54')});
  for(let i=0;i<22;i++){PR(c,FX-10+Math.round(i*10/22),FY+1-i,1,1,'#3a2a1a');PR(c,FX+10-Math.round(i*10/22),FY+1-i,1,1,'#3a2a1a')}
  PR(c,FX,FY-21,1,3,'#5a5a64');PR(c,FX-4,FY-18-(big?3:0),9,6,'#3e3e48');PR(c,FX-4,FY-18-(big?3:0),9,1,'#7a7a88');PR(c,FX-3,FY-17-(big?3:0),2,3,'#5a5a68');PR(c,FX+5,FY-16-(big?3:0),2,1,'#3e3e48');
  if(f%7===0)A.st=(A.st||[]).concat([{x:FX+6,y:FY-18-(big?3:0),l:14}]);
  A.st=(A.st||[]).filter(s=>{s.y-=.6;s.x+=Math.sin(s.l/2)*.3;s.l--;c.fillStyle=`rgba(235,235,245,${(s.l/30).toFixed(2)})`;c.fillRect(s.x,s.y,2,1);return s.l>0});
  /* 火の粉 */
  if(f%4===0)A.sp=(A.sp||[]).concat([{x:FX-3+Math.random()*6,y:FY-12,l:12}]);A.sp=(A.sp||[]).filter(s=>{s.y-=1.1;s.x+=Math.sin(s.y/2)*.5;s.l--;PR(c,s.x,s.y,1,1,s.l>6?'#ffd23f':'#ff8a3a');return s.l>0});
  /* ランタン（左の はしらの かぎ） */
  const lx=11,ly=34,sw=Math.round(Math.sin(f/9));PR(c,6,31,6,1,'#3a2a1a');PR(c,lx+sw,31,1,3,'#3a2a1a');
  PR(c,lx-3+sw,34,7,2,'#3a2a1a');PR(c,lx-3+sw,36,7,7,'#ffd98a');PR(c,lx-2+sw,37,5,5,f%6<3?'#fff2c0':'#ffe8a0');PR(c,lx-3+sw,43,7,2,'#3a2a1a');
  glow(c,lx+sw,39,24+m*10,'255,200,120',.28+m*.2);
  /* 灯り */
  glow(c,FX,FY-8,40+m*14+fk*2+(big?10:0),'255,130,50',.36+m*.26);glow(c,FX,FY+4,26,'255,170,80',.22);glow(c,FX,FY-4,9,'255,230,160',.35);
  /* ラジオの 音符 */
  if(on){if(f%9===0)A.nt=(A.nt||[]).concat([{x:100,y:51,l:18}]);}
  A.nt=(A.nt||[]).filter(s=>{s.y-=.5;s.x+=Math.sin(s.l/3)*.4;s.l--;const x=Math.round(s.x),y=Math.round(s.y);PR(c,x+1,y,1,3,'#ffe14a');PR(c,x,y+2,2,1,'#ffe14a');PR(c,x+2,y,1,1,'#ffe14a');return s.l>0});
  /* 夜の ほたる */
  if(m>.5)for(let i=0;i<6;i++){const h=hsh(i*97+3),x=(h%150+f*.3*(i%2?1:-1)+300)%150+5,y=30+(h>>>8)%30+Math.round(Math.sin((f+i*7)/6)*2);if((f+i*5)%16<10)PR(c,x,y,1,1,'#f8f0a0')}}

/* ミナ先生の セリフ */
Object.assign(MINA_LINES,{
 mn_restFirst:[['smile','ここは 休憩所。 たき火に あたると ❤が ゆっくり もどるよ。 さっきの 5まいが ふわっと うかんでるでしょ？ タップすると 読むの'],['point','休憩所では 食べたり、 単語ラジオを 流したり、 📡 トランシーバーで ミオちゃんと 話したり できるよ']],
 mn_rest:[['smile','ひと休みしよう。 うかんでいる カードを ながめるだけでも 復習に なるんだよ'],['happy','たき火、 あったかいね。 ❤が まんたんに なったら また ほりに 行こう'],['wink','ミオちゃんが 無線で まってるかもよ？ 📡 で よんでみたら？'],['point','📻 単語ラジオを つけると、 📖カードブックの ことばを ランダムに 流してくれるよ']],
 mn_restNight:[['smile','…しずかだね。 灯りが きれい。 こういう 時間に 聞いた ことばって、 ふしぎと おぼえてるの'],['love','深い ところの たき火って、 なんだか ほっと するね。 ゆっくり 休んでね'],['think','夜の 鉱山は ちょっと こわいけど… ランタンの 灯りが あるから だいじょうぶ']],
 mn_float:[['smile','うかんでる カードを タップすると 📖 くわしく 見られるよ。 例文も 聞いてみて'],['happy','ながめて、 聞いて、 それだけで いいの。 ふわっと 頭に のこるからね']],
 mn_radio:[['smile','単語ラジオは 📖カードブックの ことばを ランダムに 流すよ。 英語の あとに 日本語が 出るから、 その 前に いみを 思いだせるかな？'],['point','聞きながし でも いいの。 前に ほった ことばに また 会えると、 わすれかけた ことばが よみがえるよ']],
 mn_radioBook:[['happy','ラジオ、 📖カードブックの 中から ランダムに 流れるように なったよ。 なつかしい ことばに 会えるかも'],['point','前に ほった ことばを ときどき 聞きなおすと、 ずっと わすれないの。 "spaced review" って いうんだよ']],
 mn_radioFew:[['smile','📖カードブックの カードが まだ 少ないから、 きょう ほった ことばを 流すね。 ブックが ふえると いろんな ことばが 流れるよ']],
 mn_restSlow:[['smile','たき火の 回復は ゆっくりだよ。 いそぐ ときは 🍙 食べ物を 食べると すぐ 元気に なるの'],['think','ゆっくり 休む あいだに ラジオを 聞いたり、 カードを ながめたり。 休み時間も 勉強時間に なるね']],
 mn_restEat:[['happy','{t}、 おいしそう！ たき火で 食べると ひときわ おいしいよね'],['smile','{t}で 元気 回復！ よく かんで 食べてね']]});
/* 📻 ミオの ラジオ DJ（英語 → 日本語） */
const MIO_RADIO=[
 ["Good evening, deep down there! This is DJ Mio, playing words from our card book.","地下の みなさん こんばんは！ DJミオです。 カードブックの ことばを 流しますね。"],
 ["Here comes a random word. Can you guess the meaning before the Japanese?","ランダムな ことばが 来ますよ。 日本語の 前に いみ、 わかるかな？"],
 ["Boss, I picked these words from our book. Some old friends, maybe?","店長、 ブックから ことばを えらびました。 なつかしい 友だちも いるかも？"],
 ["Relax by the fire and just listen. Your ears are learning too.","たき火の そばで のんびり 聞いてください。 耳も ちゃんと 勉強してますよ。"],
 ["Station Mio, on the air! Repeat after the radio if you like.","ミオ放送局、 オンエア中！ よかったら ラジオの あとに 言ってみて。"],
 ["Do you remember where you dug this one? I do. …Just kidding!","この ことば、 どこで ほったか おぼえてます？ わたしは おぼえて… うそです！"]];
window.MINE_REST={open,stop};
})();

Object.assign(MINA_LINES,{
 mn_rest_wood:[['happy','たき火が 大きく なったね！ ❤が 2ばいの 速さで もどるよ。 英語で "The fire is roaring."'],['smile','あったかいね。 firewood（たきぎ）は 数えられない ことば。 a piece of firewood って 言うよ']],
 mn_rest_batt:[['wow','ラジオに ふくしゅうの チャンネルが 入ったよ！ 📖ブックに 記録した ことばも 流れるの'],['point','電池の あいだは、 前に 仕上げた カードの ことばも ラジオで 聞けるよ']],
 mn_rest_map:[['happy','地図を ひらいたね。 つぎの 階は 8まいの 中から おぼえたい 5まいを えらべるよ'],['think','えらぶ ときは「ほんとに 使いたい ことば」を。 それが いちばん おぼえるよ']]});
