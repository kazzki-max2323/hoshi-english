/* 🏕️ 鉱山の 休憩所: 5まい ほりだして 床が くずれた あと、 下の 階に ある 小さな たき火と ランタンの 休憩所（game/mine.js の rest から）
   - ❤ が すこしずつ もどる（ここに いる 間 4びょうで 1）・🍙 もちものの 食べ物を 食べる
   - 📻 単語ラジオ: きょう ほりだした ことばを 英語 → 日本語で ゆっくり 流す（オン/オフ）
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
  const k=!M.restTold?'mn_restFirst':A.m>.6?'mn_restNight':'mn_rest';if(!M.restTold){M.restTold=1;C.save()}
  const [ex,tx]=ML(k,{f:api.floor});
  H.show('cg',`<section class="pnl cgp mnp mnrest ${A.m>.6?'dim':''}" data-stay>
    <div class="qtop"><span></span><b>🏕️ 地下${api.floor}階の 休憩所</b><span class="qn" id="mrhp"></span></div>
    <div class="mrstage"><canvas id="mrcv" width="160" height="90"></canvas><div class="mrfl" id="mrfl"></div><div class="mrcap" id="mrcap" hidden></div></div>
    <p class="mrnote" id="mrnote">🔥 たき火に あたると ❤が すこしずつ もどるよ</p>
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
  T=setInterval(()=>{if(!A||!$('mrcv')){stop();return}tick++;if(tick%(A.wood?2:4))return;const h=A.hp();if(h<A.max){A.setHp(h+1);hpShow(true)}},1000)}
function hpShow(up){const el=$('mrhp');if(!el||!A)return;const h=A.hp();el.innerHTML=`<span class="mnme"><b style="width:${h/A.max*100}%"></b></span> ❤${h}`;
  if(up){el.classList.remove('mrup');void el.offsetWidth;el.classList.add('mrup')}
  const n=$('mrnote');if(n)n.textContent=h>=A.max?'❤ まんたん！ いつでも ほりに 行けるよ':'🔥 たき火に あたると ❤が すこしずつ もどるよ'}

/* 🏕️ 休憩所で つかう 道具（雑貨屋の ⛏️ たな）: 🪵 たきぎ・🔋 ラジオの 電池・🗺️ 坑道の 地図 */
const tN=id=>{try{return MINE.toolN(id)}catch(e){return 0}};
function tools(){const el=$('mrtl');if(!el||!A)return;const L=[['wood','🪵 たきぎを くべる',!A.wood],['batt','🔋 ラジオに 電池',!A.batt],['map','🗺️ 地図を ひらく',!A.mapd]].filter(t=>tN(t[0])>0||!t[2]);
  el.innerHTML=L.map(t=>t[2]?`<button class="sub" data-tl="${t[0]}">${t[1]} <small>×${tN(t[0])}</small></button>`:`<span class="mron">${t[1].split(' ')[0]} ${t[0]==='wood'?'火が 大きい':t[0]==='batt'?'お店の チャンネル':'つぎは えらべる'}</span>`).join('');
  el.querySelectorAll('[data-tl]').forEach(b=>b.onclick=()=>{const k=b.dataset.tl;if(!A||!MINE.takeTool(k))return;A.used&&A.used(MINE_TOOLS[k].ico);
    if(k==='wood'){A.wood=1;sf('knock')}else if(k==='batt'){A.batt=1;A.batN=0;sf('pickup');if(RAD)radioOff();radioOn()}else{A.mapd=1;A.map&&A.map();sf('open')}
    const [,tx]=ML('mn_rest_'+k);if(tx)H.toast(`${MINE_TOOLS[k].ico} <b>${esc(MINE_TOOLS[k].n)}</b><small>👩‍🏫 ${esc(tx)}</small>`,3400);tools()})}

/* たき火の そばに うかぶ 5まい: 1回目 タップで 読む・2回目で 📖 */
function floats(){const el=$('mrfl');if(!el)return;const P=[[14,30],[30,9],[46,2],[62,9],[78,30]];
  el.innerHTML=A.ids.map((id,i)=>{const I=C.info(id);if(!I)return '';const p=P[i%P.length];return `<button class="mrfc" data-id="${esc(id)}" style="left:${p[0]}%;top:${p[1]}%;--d:${(i*.7).toFixed(1)}s"><b>${esc(head1(I))}</b><small>${esc(I.ja)}</small></button>`}).join('');
  el.querySelectorAll('.mrfc').forEach(b=>b.onclick=()=>{const id=b.dataset.id,I=C.info(id);if(!I)return;
    if(A.tap[id]){sf('card');C.detail(id);return}
    A.tap[id]=1;sf('tap');b.classList.add('lit');try{H.say(I.lv,I.en)}catch(e){}
    const M=CG.rec().mn||{};if(!M.floatTold){M.floatTold=1;C.save();setTimeout(()=>{const [,tx]=ML('mn_float');if(tx)H.toast(`👩‍🏫 <b>ミナ先生</b><small>${esc(tx)}</small>`,3600)},800)}})}

/* 🍙 食べる */
function eat(){const L=window.FOOD?FOOD.bagList():[],bag=window.FOOD?FOOD.rec().bag:{};
  const o=C.ov(`<div class="mnlo"><p class="mnlon">🍙 なにを 食べる？ <small class="mnhp">❤ ${A.hp()}/${A.max}</small></p>
    <div class="mnlol">${L.length?L.map(s=>`<button class="mnlor mnuse" data-f="${esc(s.id)}" ${A.hp()>=A.max?'disabled':''}><span class="gi">${s.ico}</span><span><b>${esc(s.n)}</b> <b class="n">×${bag[s.id]}</b><small>❤+${s.hp}${A.hp()>=A.max?'（いまは まんたん）':''}</small></span></button>`).join(''):'<p class="mnlod">食べものが ないよ。 ながれぎ雑貨店の 🥪 食べ物の たなで 買えるよ。 たき火に あたっているだけでも ❤は もどるからね</p>'}</div>
    <button class="mnlob" data-x>🔥 たき火に もどる</button></div>`,'mnlov');
  o.querySelector('[data-x]').onclick=()=>{sf('back');C.closeOv()};
  o.querySelectorAll('[data-f]').forEach(b=>b.onclick=()=>{const id=b.dataset.f;if(!A||!FOOD.take(id))return;const s=FOOD_SNACKS[id],a=A.hp();A.setHp(a+(s.hp||0));A.used&&A.used(s.ico);
    try{RECENT.add('snack',{id,en:s.en,ja:s.n,ico:s.ico,mine:1})}catch(e){}
    sf('eat');setTimeout(()=>sf('gulp'in SFX?'gulp':'pop'),450);C.closeOv();hpShow(true);
    const [,tx]=ML('mn_restEat',{t:s.n});H.toast(`${s.ico} <b>${esc(s.n)}</b> ❤ ${a} → <b>${A.hp()}</b><small>👩‍🏫 ${esc(tx)}</small>`,3200)})}

/* 📻 単語ラジオ: 英語 → 少し まって 日本語の 字幕。 きょう ほった ことば（たりなければ 同じ レベルから） */
function radioList(){let ids=(A.trip||[]).slice();if(ids.length<5){const lv=(C.info(A.ids[0])||{}).lv||'es';ids=ids.concat(H.shuffle(C.W.filter(c=>c.lv===lv&&C.owns(c.id))).slice(0,5-ids.length).map(c=>c.id))}
  /* 🔋 電池: お店の チャンネル＝📖ブックの ことばも 流れる */
  if(A.batt&&window.STOCK){const bk=STOCK.pick(5,ids).filter(id=>{const I=C.info(id);return I&&(I.k==='w'||I.k==='t')});ids=ids.concat(bk);return H.shuffle(ids)}
  return H.shuffle(ids)}
function radioOn(){if(!A)return;const list=radioList();if(!list.length){H.toast('📻 まだ 流せる ことばが ないよ');return}
  RAD={list,i:0,alive:true};const b=$('mrrad');if(b){b.classList.add('on');b.innerHTML='📻 ラジオ <b>オン</b>'}
  const M=CG.rec().mn||{};M.radio=(M.radio||0)+1;C.save();
  if(!M.radioTold){M.radioTold=1;C.save();setTimeout(()=>{const [,tx]=ML('mn_radio');if(tx)H.toast(`👩‍🏫 <b>ミナ先生</b><small>${esc(tx)}</small>`,3800)},600)}
  const R0=RAD;const step=()=>{if(!R0.alive||RAD!==R0||!$('mrcap'))return;const id=R0.list[R0.i%R0.list.length],I=C.info(id);R0.i++;
    const cap=$('mrcap');if(!I||!cap)return setTimeout(step,300);cap.hidden=false;cap.innerHTML=`📻 <b>${esc(head1(I))}</b> <span class="ja"></span>`;
    let fin=false;const nx=()=>{if(fin)return;fin=true;setTimeout(()=>{if(!R0.alive)return;const j=cap.querySelector('.ja');if(j)j.textContent=I.ja;
      if(A&&A.batt&&(A.batN||0)<3&&window.STOCK&&STOCK.credit(id,'bat')){A.batN=(A.batN||0)+1;if(j)j.textContent=I.ja+'　📦 仕入れ！'}setTimeout(()=>{if(!R0.alive)return;try{H.say(I.lv,I.en)}catch(e){}setTimeout(step,2600)},1500)},900)};
    try{H.say(I.lv,I.en,nx)}catch(e){}setTimeout(nx,3500)};
  step()}
function radioOff(){if(RAD)RAD.alive=false;RAD=null;const b=$('mrrad');if(b){b.classList.remove('on');b.innerHTML='📻 単語ラジオ'}const c=$('mrcap');if(c)c.hidden=true}

/* ================================================================ ドット絵: 岩の 部屋・たき火・ランタン・すわっている 自分 */
const PR=(c,x,y,w,h,col)=>{c.fillStyle=col;c.fillRect(x,y,w,h)};
function hsh(n){n=Math.imul(n^n>>>16,0x45d9f3b);n=Math.imul(n^n>>>16,0x45d9f3b);return (n^n>>>16)>>>0}
function glow(c,x,y,r,col,a){c.globalCompositeOperation='lighter';const g=c.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,`rgba(${col},${a})`);g.addColorStop(1,`rgba(${col},0)`);c.fillStyle=g;c.fillRect(x-r,y-r,r*2,r*2);c.globalCompositeOperation='source-over'}
function draw(c){if(!A)return;const L=A.layer(),[a,b,k]=L.col,m=A.m,f=A.f;
  PR(c,0,0,160,90,k);PR(c,0,8,160,64,a);
  for(let i=0;i<70;i++){const h=hsh(i*977+A.floor*31),x=h%160,y=8+(h>>>8)%60;PR(c,x,y,2,1,b)}
  PR(c,0,70,160,20,b);for(let i=0;i<20;i++){const h=hsh(i*313+A.floor);PR(c,h%160,72+(h>>>8)%16,3,1,k)}
  /* 暗さ（深い・夜ほど） */
  c.fillStyle=`rgba(6,4,20,${(.2+m*.42).toFixed(2)})`;c.fillRect(0,0,160,90);
  /* 深い 階の 水晶・夜の ほたる */
  if(A.floor>=8||m>.5)for(let i=0;i<10;i++){const h=hsh(i*53+A.floor*7);if((f+i*3)%12<7)PR(c,h%160,10+(h>>>9)%55,1,1,A.floor>=8?'#bfe9ff':'#f8f0a0')}
  /* ランタン（左上の くぎに つるす） */
  const lx=10,ly=20,sw=Math.round(Math.sin(f/9));
  glow(c,lx+sw,ly+8,26+m*12,'255,200,120',.3+m*.25);
  PR(c,lx,6,1,8,'#5a4a3a');PR(c,lx-3+sw,14,7,2,'#3a2a1a');PR(c,lx-3+sw,16,7,8,'#ffd98a');PR(c,lx-2+sw,17,5,6,f%6<3?'#fff2c0':'#ffe8a0');PR(c,lx-3+sw,24,7,2,'#3a2a1a');
  /* たき火 */
  const fx=86,fy=70;glow(c,fx,fy-6,38+m*16+(f%4),'255,130,50',.38+m*.3);
  PR(c,fx-9,fy,18,3,'#6a3a1a');PR(c,fx-7,fy-2,14,2,'#8a5a2a');PR(c,fx-10,fy+2,4,2,'#5a5a5a');PR(c,fx+6,fy+2,4,2,'#5a5a5a');
  const fl=[0,1,2,1][f%4];
  PR(c,fx-5,fy-6+fl,10,5,'#ff6a1a');PR(c,fx-3,fy-10+fl,7,5,'#ff9a2a');PR(c,fx-2,fy-13+(f%3),4,4,'#ffd23f');PR(c,fx-1,fy-15+(f%2),2,2,'#fff2a0');
  if(f%5===0)A.sp=(A.sp||[]).concat([{x:fx-2+Math.random()*4,y:fy-14,l:10}]);A.sp=(A.sp||[]).filter(s=>{s.y-=1.2;s.x+=Math.sin(s.y)*.4;s.l--;PR(c,s.x,s.y,1,1,s.l>5?'#ffd23f':'#ff8a3a');return s.l>0});
  /* すわっている 自分（たき火の 左） */
  const x=58,y=56;PR(c,x+2,y+8,9,6,'#4a5a7a');PR(c,x+2,y,8,9,'#e86a4a');PR(c,x+3,y+2,6,1,'#ffd23f');PR(c,x+2,y-8,8,8,'#ffe0cc');
  PR(c,x+7,y-5,1,2,'#2a2340');PR(c,x+9,y-5,1,2,'#2a2340');PR(c,x+1,y-10,10,3,'#ffd23f');PR(c,x+10,y-9,2,2,'#fff8c0');
  PR(c,x+9,y+2,5,2,'#ffe0cc');
  /* つるはしと リュック（たき火の 右） */
  for(let i=0;i<10;i++)PR(c,118+i,60-Math.floor(i/2),1,1,'#a8743e');PR(c,126,52,2,10,'#9aa0b0');
  PR(c,104,62,9,9,'#7a5a3a');PR(c,105,63,7,2,'#9a7a4a');
  /* 📡 トランシーバー（リュックの 上。 話した ことが なければ ちかちか） */
  PR(c,107,57,3,5,'#3a3a4a');PR(c,108,55,1,2,'#3a3a4a');if(window.MINE_WALKIE&&MINE_WALKIE.fresh()&&f%8<4)PR(c,108,58,1,1,'#7aff7a')}

/* ミナ先生の セリフ */
Object.assign(MINA_LINES,{
 mn_restFirst:[['smile','ここは 休憩所。 たき火に あたると ❤が もどるよ。 さっきの 5まいが ふわっと うかんでるでしょ？ タップすると 読むの'],['point','休憩所では 食べたり、 単語ラジオを 流したり、 📡 トランシーバーで ミオちゃんと 話したり できるよ']],
 mn_rest:[['smile','ひと休みしよう。 うかんでいる カードを ながめるだけでも 復習に なるんだよ'],['happy','たき火、 あったかいね。 ❤が まんたんに なったら また ほりに 行こう'],['wink','ミオちゃんが 無線で まってるかもよ？ 📡 で よんでみたら？'],['point','📻 単語ラジオを つけると、 きょう ほった ことばを 流してくれるよ']],
 mn_restNight:[['smile','…しずかだね。 灯りが きれい。 こういう 時間に 聞いた ことばって、 ふしぎと おぼえてるの'],['love','深い ところの たき火って、 なんだか ほっと するね。 ゆっくり 休んでね'],['think','夜の 鉱山は ちょっと こわいけど… ランタンの 灯りが あるから だいじょうぶ']],
 mn_float:[['smile','もう一回 タップすると 📖 くわしく 見られるよ。 例文も 聞いてみて'],['happy','ながめて、 聞いて、 それだけで いいの。 ふわっと 頭に のこるからね']],
 mn_radio:[['smile','単語ラジオ、 英語の あとに 日本語が 出るよ。 日本語が 出る 前に いみを 思いだせるかな？'],['point','聞きながし でも いいの。 耳が ことばに なれていくよ']],
 mn_restEat:[['happy','{t}、 おいしそう！ たき火で 食べると ひときわ おいしいよね'],['smile','{t}で 元気 回復！ よく かんで 食べてね']]});
window.MINE_REST={open,stop};
})();

Object.assign(MINA_LINES,{
 mn_rest_wood:[['happy','たき火が 大きく なったね！ ❤が 2ばいの 速さで もどるよ。 英語で "The fire is roaring."'],['smile','あったかいね。 firewood（たきぎ）は 数えられない ことば。 a piece of firewood って 言うよ']],
 mn_rest_batt:[['wow','ラジオに お店の チャンネルが 入ったよ！ 📖ブックの ことばを 聞くと、 その カードが お店に とどくの'],['point','電池の あいだは ブックの ことばも 流れるよ。 聞いた カード 3まいが 仕入れに なるんだ']],
 mn_rest_map:[['happy','地図を ひらいたね。 つぎの 階は 8まいの 中から おぼえたい 5まいを えらべるよ'],['think','えらぶ ときは「ほんとに 使いたい ことば」を。 それが いちばん おぼえるよ']]});
