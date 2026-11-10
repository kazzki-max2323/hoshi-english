/* ながれぎ雑貨店: 浜辺の 右はしに ひっそり ある 小さな 雑貨屋。店主の ノラさん（👩‍🦳）と オウムの ピップ（🦜）。
   - 浜辺の 小屋（#window の 中の 小さな 絵）を タップすると ひらく。景色に なじむように 小さく、夜は 窓に あかりが ともる
   - たなの 品物を タップ → 英語で 買いもの 会話（値段・色・サイズ・試着・ねぎる・プレゼント包装・はらい方・レシート・ふくろ）
     ほかに おすすめを きく / 売りに 来た（からの びん・絵本）/ 返品・交換（レシートが あるかで 分かれる）
   - 会話は 答えで 分かれ、エンドが いくつも ある。まちがえた 答えでも 話は すすむ（ピップが まねを する）
   - 品物は ここでしか 買えない: 絵本・絵はがき・おみくじ・プレゼント・フレーズ手帳（game/zakka-data.js）
   - 言った フレーズは 記録され、📒 フレーズ手帳で 見かえせて、クイズも できる
   中身: game/zakka-data.js（品物）と game/zakka-talk.js（会話）。ミナ先生の セリフは この ファイルの さいごに ある */
(()=>{
const {S:ST,sfx:SFX}=BEACH;
const H=HE,esc=H.esc,$=id=>document.getElementById(id);
const IT=ZAKKA_ITEMS,PCS=ZAKKA_CARDS,FTS=ZAKKA_FORTUNES,PH=ZAKKA_PHRASES,PHK=Object.keys(PH);
const item=id=>IT.find(i=>i.id===id);
const pickL=a=>a[Math.random()*a.length|0];
const val=(x,c)=>typeof x==='function'?x(c):x;
const LV=['es','jh','hs','adv'];
const NORA={n:'ノラさん',ico:'👩‍🦳',p:1.05,r:.92},PIP={ico:'🦜',p:1.9,r:1.15};

/* ---------- the record ---------- */
const ZD=(()=>{try{const s=JSON.parse(localStorage.getItem(SAVE_KEY)||'{}').zakka;if(s&&s.own)return s}catch(e){}
  return {v:0,own:{},pc:[],fort:[],fortN:0,gift:[],ph:{},end:{},rcpt:{},paid:{},hold:null,bsold:0,gave:{},read:{},quiz:{n:0,best:0},talks:0,ja:0,said:0}})();
_saveHooks.push(()=>{const s=JSON.parse(localStorage.getItem(SAVE_KEY)||'{}');s.zakka=ZD;localStorage.setItem(SAVE_KEY,JSON.stringify(s))});

const myLv=()=>{try{return MINA.level()}catch(e){return 'es'}};
const jaOn=()=>myLv()==='es'||!!ZD.ja;
const books=()=>IT.filter(i=>i.k==='book');
const ownBooks=()=>books().filter(b=>ZD.own[b.id]);
const pcDone=()=>ZD.pc.length>=PCS.length;
const bottles=()=>{try{return Math.max(0,(BOTTLE.rec().n||0)-(ZD.bsold||0))}catch(e){return 0}};
const half=it=>Math.floor(it.p/2);
const paid=id=>ZD.paid[id]||item(id).p;
const UNIQ=['book','note','crystal','map'];
const sellable=()=>IT.filter(i=>(i.k==='book'||i.k==='note')&&ZD.own[i.id]);

/* the tools the talks use (game/zakka-talk.js) */
const Z={item,coins:()=>ST.coins,visits:()=>ZD.v||0,tgs:()=>{try{return window.TUTOR?TUTOR.sellable():[]}catch(e){return []}},held:()=>ZD.hold,own:id=>!!ZD.own[id],pcDone,bottles,half,paid,sellable,returnable:sellable,
  price:c=>Math.max(1,Math.round(c.it.p*(1-(c.disc||0)))),
  part:()=>{const h=new Date().getHours();return h>=5&&h<12?'morning':h>=12&&h<18?'afternoon':'evening'},
  partJ:()=>{const h=new Date().getHours();return h>=5&&h<12?'おはよう':h>=12&&h<18?'こんにちは':'こんばんは'},
  recBook:()=>{const i=LV.indexOf(myLv()),a=books().filter(b=>!ZD.own[b.id]);return a.find(b=>LV.indexOf(b.lv)===i)||a.find(b=>LV.indexOf(b.lv)<i)||a[0]||null},
  altGift:id=>{const g=IT.filter(i=>i.k==='gift');return g[(g.findIndex(i=>i.id===id)+1)%g.length]},
  bonusW:()=>pcDone()?'fortune cookie':'postcard',bonusJ:()=>pcDone()?'おみくじ クッキー':'絵はがき',
  rcpt:id=>!!ZD.rcpt[id],
  exList:c=>books().filter(b=>!ZD.own[b.id]&&b.id!==c.it.id),
  diff:c=>Math.max(0,c.to2.p-paid(c.it.id))};
const SC=ZAKKA_TALK(Z);

/* ---------- voice: the device's reader (Nora a little low and slow, Pip high and quick) ---------- */
let enVoice=null;
function pickVoice(){if(!window.speechSynthesis)return;const vs=speechSynthesis.getVoices().filter(v=>/^en[-_]/i.test(v.lang));
  enVoice=vs.find(v=>/en[-_]US/i.test(v.lang)&&/Samantha|Google|Natural/i.test(v.name))||vs.find(v=>/en[-_]US/i.test(v.lang))||vs[0]||null}
if(window.speechSynthesis){pickVoice();speechSynthesis.addEventListener&&speechSynthesis.addEventListener('voiceschanged',pickVoice)}
let talkOn=false,talkId=0,talkMax=0;
function talk(en,c){if(!ST.sound||!window.speechSynthesis)return;
  try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(String(en).replace(/Nora/g,'Norah').replace(/\.\.\.\s*/g,' '));u.lang='en-US';if(enVoice)u.voice=enVoice;
    u.pitch=c?c.p:1;u.rate=(ST.slow?.72:.92)*(c?c.r:1);u.volume=Math.min(1,(ST.vol&&ST.vol.voice!=null)?ST.vol.voice:1);
    const id=++talkId;talkOn=true;talkMax=Date.now()+3000+String(en).length*(ST.slow?140:100)/(c?c.r:1);u.onend=u.onerror=()=>{if(id===talkId)talkOn=false};speechSynthesis.speak(u)}catch(e){talkOn=false}}
const hush=()=>{try{speechSynthesis.cancel()}catch(e){}};

/* ---------- Mina ---------- */
const mline=(k,v)=>MINA.line(k,v||{});
const minaBox=(k,v)=>{const [ex,tx]=mline(k,v);return `<div class="kmina"><span class="lface">${MINA.face('m',ex)}</span><p>${tx}</p></div>`};

/* ================================================================ the hut on the beach */
const HUT=`<svg viewBox="0 0 60 52" aria-hidden="true">
  <ellipse cx="30" cy="50" rx="27" ry="2.4" fill="rgba(0,0,0,.28)"/>
  <rect x="9" y="22" width="40" height="27" rx="1" fill="#8a6a4a"/>
  <g stroke="#6e5238" stroke-width=".7"><line x1="9" y1="28" x2="49" y2="28"/><line x1="9" y1="34" x2="49" y2="34"/><line x1="9" y1="40" x2="49" y2="40"/><line x1="9" y1="46" x2="49" y2="46"/></g>
  <path d="M4 24 L29 9 L55 24 Z" fill="#6b5a46"/><path d="M4 24 L29 9 L55 24" fill="none" stroke="#a48a66" stroke-width="1.2"/>
  <rect class="zkWin" x="14" y="29" width="11" height="9" rx="1" fill="#2b2a3a"/><line x1="19.5" y1="29" x2="19.5" y2="38" stroke="#6e5238" stroke-width=".8"/>
  <rect x="32" y="30" width="10" height="19" rx="1" fill="#5a4330"/><circle cx="40" cy="40" r=".9" fill="#d8b878"/>
  <line x1="45" y1="16" x2="45" y2="21" stroke="#4a3a2a" stroke-width=".6"/><rect x="40" y="20" width="12" height="5" rx="1" fill="#c9b08a"/>
  <text x="46" y="24" font-size="3.6" text-anchor="middle" fill="#5a4330" font-family="Georgia,serif">SHOP</text>
  <g class="zkLamp"><circle cx="29" cy="20" r="5" fill="url(#zkg)"/><circle cx="29" cy="20" r="1.3" fill="#ffe7a8"/></g>
  <defs><radialGradient id="zkg"><stop offset="0" stop-color="rgba(255,210,130,.9)"/><stop offset="1" stop-color="rgba(255,210,130,0)"/></radialGradient></defs>
</svg>`;
function hut(){let b=$('zkHut');const w=$('window');if(!w)return;
  if(!b){b=document.createElement('button');b.id='zkHut';b.setAttribute('aria-label','浜辺の 雑貨屋');b.innerHTML=HUT;w.appendChild(b);
    b.onclick=e=>{e.stopPropagation();if(H.screen!=='home')return;SFX.shop();open()}}
  let d;try{d=SCENE.dbg()}catch(e){return}
  const k=d.k,wd=Math.round(44*k);b.style.width=wd+'px';
  b.style.left=Math.round(d.WW*.9-wd/2)+'px';b.style.top=Math.round(d.shore-d.WT+34*k-wd*52/60)+'px';
  const dk=Math.max(0,Math.min(1,d.dark||0));b.style.setProperty('--dk',dk.toFixed(2));
  b.classList.toggle('off',H.screen!=='home')}
setTimeout(hut,500);addEventListener('resize',()=>setTimeout(hut,200));setInterval(hut,2500);
H.on('home',()=>setTimeout(hut,50));

/* ================================================================ the shop */
function greet(){
  const g=[["Welcome to Driftwood Goods! Take a look around.","ながれぎ雑貨店へ ようこそ！ ゆっくり 見ていってね。"],
    ["Hello again! Everything on this shelf has a story.","また 来てくれたのね！ この たなの ものには みんな 物語が あるの。"],
    [`Good ${Z.part()}! Pip has been waiting for you.`,`${Z.partJ()}！ ピップが 待ってたわよ。`],
    ["Tap anything on the shelf. Then let's talk in English!","たなの ものを タップしてね。 そしたら 英語で 話しましょう！"]];
  if(ZD.hold&&item(ZD.hold))g.push([`I'm still keeping the ${item(ZD.hold).w} for you.`,`${item(ZD.hold).n}、 まだ とっておいてるわよ。`]);
  {const lx=IT.filter(i=>i.lux&&!ZD.own[i.id]&&ST.coins>=i.p);if(lx.length){const x=pickL(lx);g.push([`Would you like to see the glass case? The ${x.w} is something special.`,`ガラスケース、 見てみる？ ${x.n}は とくべつよ。`])}}
  if(ZD.gift.length)g.push(["Did you give your present yet? I'm sure they'll love it.","プレゼント、 もう わたした？ きっと よろこぶわ。"]);
  if(Z.tgs().length)g.push(["Did Riku give you something nice? I'd love to see it.","リクから なにか すてきな もの もらった？ 見てみたいわ。"]);
  if(bottles()>0)g.push(["If you find empty bottles, bring them to me. I buy them!","からの びんが あったら もってきてね。 買いとるわよ！"]);
  if(new Date().getHours()>=21||new Date().getHours()<5)g.push(["It's late! I'm almost closing, but come in.","おそい 時間ね！ もうすぐ 閉店だけど、 どうぞ。"]);
  return pickL(g)}
function noraLine(en,ja){const on=jaOn();
  return `<div class="lsay kth zkhi"><span class="lface kf">${NORA.ico}</span><div class="lbody"><p class="ken">${esc(en)}<button class="ksay" data-say="${esc(en)}" aria-label="もう一度 きく">🔊</button></p><small class="kja ${on?'on':''}">${esc(ja)}</small>${on?'':'<button class="kjab">訳を 見る</button>'}</div></div>`}
function bindLine(root){root.querySelectorAll('[data-say]').forEach(b=>b.onclick=e=>{e.stopPropagation();talk(b.dataset.say,NORA)});
  root.querySelectorAll('.kjab').forEach(b=>b.onclick=()=>{SFX.pop();const j=b.parentNode.querySelector('.kja');if(j)j.classList.add('on');b.remove()})}
const endsAll=()=>Object.values(SC).reduce((a,s)=>a+Object.values(s.nodes).filter(n=>n.end).length,0);
const endsN=()=>Object.keys(ZD.end).length;
const phN=()=>Object.keys(ZD.ph).filter(k=>PH[k]).length;
const bagN=()=>ownBooks().length+ZD.pc.length+ZD.fortN+ZD.gift.length+(ZD.own.note?1:0)+(ZD.own.crystal?1:0)+(ZD.own.moonmap?1:0);

function open(){if(!ZD.v){ZD.v=1;save();return play('hello')}
  ZD.v++;save();shop()}
function shop(){hush();const [en,ja]=greet();
  const tile=it=>{const own=UNIQ.includes(it.k)?ZD.own[it.id]:0,out=it.k==='pc'&&pcDone(),held=ZD.hold===it.id;
    return `<button class="zkit ${own?'own':''} ${out?'out':''}" data-i="${it.id}"><span class="zi">${it.ico}</span><span class="zn">${esc(it.n.replace(/^絵本/,''))}</span><span class="zp">${own?'✓ もってる':out?'うりきれ':held?'🔖 とりおき':'🪙'+it.p}</span></button>`};
  H.show('zakka',`<section class="pnl zk">
    <div class="qtop"><button class="x" id="zkx" aria-label="もどる">←</button><b>🏚️ ながれぎ雑貨店</b><span class="qn"></span></div>
    <div id="zkhi">${noraLine(en,ja)}</div>
    <div class="zkshelf">${IT.filter(i=>!i.lux).map(tile).join('')}</div>
    <div class="zkcase"><small>🔒 ガラスケース</small><div>${IT.filter(i=>i.lux).map(tile).join('')}</div></div>
    <div class="row zkrow"><button id="zkrec" class="sub">💬 おすすめ</button><button id="zksell" class="sub">💰 売る</button><button id="zkret" class="sub" ${sellable().length?'':'disabled'}>↩️ 返品</button></div>
    <div class="row zkrow"><button id="zkbag" class="sub">🎒 もちもの ${bagN()?`<small>${bagN()}</small>`:''}</button>${ZD.own.note?'<button id="zknote" class="sub">📒 フレーズ手帳</button>':''}</div>
    <details class="mfold"><summary>📊 きろく</summary><div class="zkrec"><span>🏁 見つけた エンド <b>${endsN()}/${endsAll()}</b></span><span>📒 言えた フレーズ <b>${phN()}/${PHK.length}</b></span><span>📮 絵はがき <b>${ZD.pc.length}/${PCS.length}</b></span>
      <label class="kjat"><input type="checkbox" id="zkja" ${ZD.ja?'checked':''}> 日本語訳を いつも 出す</label></div></details>
  </section>`);
  bindLine($('zkhi'));talk(en,NORA);
  $('zkx').onclick=()=>{SFX.back();hush();H.home()};
  H.panel.querySelectorAll('[data-i]').forEach(b=>b.onclick=()=>{const it=item(b.dataset.i);
    if(ZD.own[it.id]&&it.k==='book'){SFX.book();return reader(it.id,shop)}
    if(ZD.own[it.id]&&it.k==='note'){SFX.book();return notebook(shop)}
    if(ZD.own[it.id]&&it.k==='crystal'){return crystal(shop)}
    if(ZD.own[it.id]&&it.k==='map'){SFX.talk();return play('moon')}
    if(it.k==='pc'&&pcDone()){SFX.wrong();return H.toast('📮 絵はがきは ぜんぶ そろったよ！ <small>🎒 もちもの から 見られるよ</small>')}
    SFX.talk();play('buy',{it})});
  $('zkrec').onclick=()=>{SFX.talk();play('rec')};
  $('zksell').onclick=()=>{SFX.talk();play('sell')};
  $('zkret').onclick=()=>{SFX.talk();play('ret')};
  $('zkbag').onclick=()=>{SFX.open();bag()};
  const nb=$('zknote');if(nb)nb.onclick=()=>{SFX.book();notebook(shop)};
  $('zkja').onchange=e=>{ZD.ja=e.target.checked?1:0;save()}}

/* ================================================================ one talk */
let P=null;
const live=()=>P&&$('zklog');
function play(sid,init){const s=SC[sid];if(!s)return shop();
  P={sid,s,at:s.start,step:0,c:Object.assign({seed:Math.random()*1e6|0},init||{}),fun:0,newPh:[],usedPh:[],typed:0};
  H.show('zakka',`<section class="pnl lsn kw zk">
    <div class="qtop"><button class="x" id="zkx" aria-label="会話を やめる">←</button><b>${NORA.ico} ノラさんの お店</b><span class="qn" id="zkq"></span></div>
    <div class="lslog kwlog" id="zklog"></div>
    <div id="zkans" class="kans"></div>
  </section>`);
  $('zkx').onclick=()=>{SFX.back();hush();P=null;shop()};
  ZD.talks++;save();setTimeout(turn,250)}
function scrollLog(){const l=$('zklog');if(l)l.scrollTo({top:l.scrollHeight,behavior:'smooth'})}
function them(en,ja,fx,cls='',who=NORA){if(!live())return;const d=document.createElement('div'),on=jaOn();d.className='lsay kth '+cls+(who===PIP?' zkpip':'');
  d.innerHTML=`<span class="lface kf">${who.ico}${fx?`<i class="kfx">${fx}</i>`:''}</span><div class="lbody"><p class="ken">${esc(en)}<button class="ksay" aria-label="もう一度 きく">🔊</button></p>${ja?`<small class="kja ${on?'on':''}">${esc(ja)}</small>${on?'':'<button class="kjab">訳を 見る</button>'}`:''}</div>`;
  $('zklog').appendChild(d);
  d.querySelector('.ksay').onclick=e=>{e.stopPropagation();talk(en,who)};
  const jb=d.querySelector('.kjab');if(jb)jb.onclick=()=>{SFX.pop();jb.remove();d.querySelector('.kja').classList.add('on');scrollLog()};
  talk(en,who);scrollLog()}
function you(en,typed){if(!live())return;const d=document.createElement('div');d.className='lsay by-h kyou-b';
  d.innerHTML=`<span class="lface kf you">⭐</span><div class="lbody"><p>${esc(en)}${typed?'<small class="kty">✍️</small>':''}</p></div>`;$('zklog').appendChild(d);scrollLog()}
function afterTalk(fn,gap=600,minMs=1000){const t0=Date.now();
  const wait=()=>{if(!live())return;const busy=ST.sound&&window.speechSynthesis&&(talkOn||speechSynthesis.speaking||speechSynthesis.pending)&&Date.now()<talkMax;
    if(busy||Date.now()-t0<minMs){setTimeout(wait,150);return}setTimeout(fn,gap)};setTimeout(wait,150)}

/* move to a node (or to another scene with '@scene:node') */
function goTo(nx){if(!nx)return;if(nx[0]==='@'){const [sid,at]=nx.slice(1).split(':');P.sid=sid;P.s=SC[sid];P.at=at||P.s.start}else P.at=nx}
function turn(){if(!live())return;let N=P.s.nodes[P.at],guard=0;
  while(N&&N.go&&guard++<8){goTo(N.go(P.c));N=P.s.nodes[P.at]}
  if(!N)return shop();if(N.enter)N.enter(P.c);if(N.end)return end(N);
  P.step++;P.N=N;$('zkq').textContent=`💬 ${P.step}`;
  P.opts=(val(N.o,P.c)||[]).filter(o=>!o.if||o.if(P.c));
  them(val(N.s,P.c),val(N.j,P.c));
  if(N.pip)setTimeout(()=>{them(N.pip,'',null,'',PIP);setTimeout(answers,500)},900);else setTimeout(answers,350)}
function answers(hint){if(!live())return;const on=jaOn(),mic=window.SpeechRecognition||window.webkitSpeechRecognition;
  $('zkans').innerHTML=`${hint?`<p class="khint">💡 たとえば：<b>${esc(hint)}</b></p>`:''}
    <div class="lopts kopts zkopts">${P.opts.map((o,i)=>`<button data-o="${i}">${esc(val(o.e,P.c))}${on&&o.j?`<small>${esc(val(o.j,P.c))}</small>`:''}</button>`).join('')}</div>
    <div class="kfree"><input id="zkin" type="text" placeholder="英語を 書いてもOK" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" enterkeyhint="send">${mic?'<button id="zkmic" class="sub" aria-label="声で 言う">🎤</button>':''}<button id="zksend" aria-label="送る">▶</button></div>`;
  $('zkans').querySelectorAll('[data-o]').forEach(b=>b.onclick=()=>pick(+b.dataset.o));
  const inp=$('zkin'),send=()=>{const v=inp.value.trim();if(v)typed(v)};
  $('zksend').onclick=send;inp.onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();send()}};
  const mb=$('zkmic');if(mb)mb.onclick=()=>{try{const r=new mic();r.lang='en-US';r.interimResults=false;mb.classList.add('on');
    r.onresult=e=>{const t=e.results[0][0].transcript;inp.value=t;mb.classList.remove('on');typed(t)};r.onerror=r.onend=()=>mb.classList.remove('on');r.start()}catch(e){mb.classList.remove('on');H.toast('🎤 この 端末では 声の 入力が つかえないみたい')}}}
/* what the player wrote: the closest answer (the same reading as 浜辺の 会話), or Nora does not understand */
function typed(v){if(!live())return;const opts=P.opts.map(o=>[val(o.e,P.c),o.ok,0,0,0,null]);const [i]=KAIWA.match(v,opts);
  if(i<0){you(v,true);$('zkans').innerHTML='';
    setTimeout(()=>{const h=pickL([["Sorry? Could you say that again?","ごめんなさい、 もう一度 言って くれる？"],["Hmm, I'm not sure what you mean, dear.","うーん、 どういう いみかしら。"],["Pardon? Pip, did you understand?","なんて？ ピップ、 わかった？"]]);them(h[0],h[1],'❓','k-huh');
      const good=P.opts.filter(o=>o.ok);setTimeout(()=>answers(val(pickL(good.length?good:P.opts).e,P.c)),500)},600);return}
  P.typed++;pick(i,v)}
function pick(i,typedText){if(!live())return;const o=P.opts[i],c=P.c;$('zkans').innerHTML='';
  you(typedText||val(o.e,c),!!typedText);
  if(o.act)o.act(c);
  if(o.ok&&o.ph&&PH[o.ph]){if(!ZD.ph[o.ph])P.newPh.push(o.ph);ZD.ph[o.ph]=(ZD.ph[o.ph]||0)+1;if(!P.usedPh.includes(o.ph))P.usedPh.push(o.ph);save()}
  const nx=val(o.nx,c);
  setTimeout(()=>{if(!live())return;const r=val(o.r,c);
    if(!o.ok){P.fun++;SFX.tease&&SFX.tease()}else SFX.step();
    const next=()=>{goTo(nx);afterTalk(turn)};
    if(r){them(r,val(o.rj,c),o.fx||(o.ok?'😊':'😅'),o.ok?'k-good':'k-oops');
      /* Pip copies a phrase now and then (or after a funny answer) */
      const pip=o.pip||(o.ok&&o.ph&&Math.random()<.22?PH[o.ph][0].replace(/[.!?]$/,'')+'! '+PH[o.ph][0].split(' ').slice(-2).join(' '):null);
      if(pip)afterTalk(()=>{them(pip,'',null,'',PIP);next()},300,600);else next()}
    else{if(o.pip)them(o.pip,'',null,'',PIP);next()}},550)}

/* ================================================================ the end of a talk: the deal happens here */
function addCoins(n){if(n<=0)return;const r=$('zkans')&&$('zkans').getBoundingClientRect();if(r)H.coinBurst(r.left+r.width/2,r.top+20,n);else H.addCoins(n)}
function pay(n){ST.coins=Math.max(0,ST.coins-n);save();H.head();try{SFX.buy()}catch(e){}}
function newPc(){const left=PCS.map((x,i)=>i).filter(i=>!ZD.pc.includes(i));if(!left.length)return -1;const i=pickL(left);ZD.pc.push(i);return i}
function deal(N){const c=P.c,it=c.it,R={};
  switch(N.act){
  case 'buy':{const p=Z.price(c);if(ST.coins<p){R.short=1;break}pay(p);R.paid=p;R.it=it;
    if(UNIQ.includes(it.k)){ZD.own[it.id]=1;ZD.paid[it.id]=p;if(c.rcpt)ZD.rcpt[it.id]=1;else delete ZD.rcpt[it.id]}
    else if(it.k==='pc')R.pc=newPc();
    else if(it.k==='fortune')ZD.fortN++;
    else if(it.k==='gift')ZD.gift.push({id:it.id,w:c.wrap||'',r:c.rib?1:0,col:c.color||'',sz:c.size||''});
    if(c.bonus){if(pcDone())ZD.fortN++;else R.bonusPc=newPc()}
    if(ZD.hold===it.id)ZD.hold=null;break}
  case 'hold':ZD.hold=it.id;break;
  case 'sellBottles':{const n=bottles(),got=n*(c.per||2);ZD.bsold=(ZD.bsold||0)+n;R.got=got;R.sold=`🍾 からの びん ${n}本`;break}
  case 'sellTg':{R.got=c.sellP||it.p;R.sold=it.ico+' '+it.n;try{TUTOR.take(it.tg)}catch(e){}break}
  case 'sell':{R.got=c.sellP||half(it);R.sold=it.ico+' '+it.n;forget(it.id);break}
  case 'refund':{R.got=paid(it.id);R.sold=it.ico+' '+it.n;R.ret=1;forget(it.id);break}
  case 'buyback':{R.got=half(it);R.sold=it.ico+' '+it.n;R.ret=1;forget(it.id);break}
  case 'exch':{const d=Z.diff(c),pd=paid(it.id),rc=ZD.rcpt[it.id];if(d)pay(d);forget(it.id);ZD.own[c.to2.id]=1;ZD.paid[c.to2.id]=pd+d;if(rc)ZD.rcpt[c.to2.id]=1;R.ex=c.to2;break}}
  save();return R}
function forget(id){delete ZD.own[id];delete ZD.rcpt[id];delete ZD.paid[id];delete ZD.read[id]}

function end(N){if(!live())return;const c=P.c,sid=P.sid,key=sid+':'+P.at,good=!!N.good,newEnd=!ZD.end[key];
  them(val(N.s,c),val(N.j,c),N.fx||(good?'🌟':'😂'),good?'k-good':'k-oops');
  ZD.end[key]=1;const R=N.act?deal(N):{};if(sid==='hello')ZD.met=1;ZD.last=Date.now();save();
  const E=Object.entries(P.s.nodes).filter(([,n])=>n.end),got=E.filter(([k])=>ZD.end[sid+':'+k]).length;
  /* what happened */
  let res='',more='';
  if(R.short)res='🪙 コインが たりなかった…';
  else if(R.it){res=`🛍️ ${R.it.ico} <b>${esc(R.it.n)}</b> を <b>${R.paid}まい</b>で 買った${R.paid<R.it.p?` <small>（${R.it.p-R.paid}まい おトク）</small>`:''}`;
    if(R.it.k==='book')more+=`<button data-go="read">📖 いますぐ 読む</button>`;
    if(R.pc!=null&&R.pc>=0)more+=`<button data-go="pc" data-n="${R.pc}">📮 絵はがきを 見る</button>`;
    if(R.it.k==='fortune')more+=`<button data-go="fort">🥠 わってみる</button>`;
    if(R.it.k==='gift')more+=`<button data-go="give">🎁 いますぐ わたしに 行く</button>`;
    if(R.it.k==='crystal')more+=`<button data-go="crystal">🔮 のぞいてみる</button>`;
    if(R.it.k==='map')more+=`<button data-go="moon">🌕 お話を 聞く</button>`;
    if(R.it.k==='note')more+=`<button data-go="note">📒 ひらいてみる</button>`;
    if(R.bonusPc!=null&&R.bonusPc>=0)more+=`<button data-go="pc" data-n="${R.bonusPc}">📮 おまけの 絵はがき</button>`}
  else if(R.got)res=`💰 ${esc(R.sold)} を ${R.ret?'返して':'売って'} <b>${R.got}まい</b> もらった`;
  else if(R.ex)res=`🔄 ${R.ex.ico} <b>${esc(R.ex.n)}</b> に 交換した`;
  else if(N.act==='hold')res=`🔖 ${c.it.ico} ${esc(c.it.n)} を とっておいて もらった`;
  /* Mina */
  let k='zk_endTalk',v={t:N.t};
  if(sid==='hello')k='zk_endHello';
  else if(sid==='moon')k='zk_endMoon';
  else if(R.it&&R.it.lux){k='zk_endLux';v.t=R.it.n}
  else if(R.it)k=c.disc>=.2?'zk_endHaggle':c.disc?'zk_endDeal':R.it.k==='gift'?'zk_endGift':R.it.k==='book'?'zk_endBook':'zk_endBuy';
  else if(R.got&&R.ret)k='zk_endReturn';else if(R.got)k='zk_endSell';else if(R.ex)k='zk_endReturn';
  else if(N.act==='hold')k='zk_endHold';else if(!good)k='zk_endFun';
  if(N.act==='sellTg'){k='tu_sold';v.g=c.it.n}
  if(P.newPh.length&&Math.random()<.5){k='zk_endPhrase';v.p=PH[P.newPh[0]][0];v.pj=PH[P.newPh[0]][1]}
  if(P.typed>=2)k='zk_endTyped';
  const phs=P.usedPh.map(id=>`<button data-ph="${id}" class="${P.newPh.includes(id)?'new':''}">${P.newPh.includes(id)?'<i>NEW</i>':''}${esc(PH[id][0])}<small>${esc(PH[id][1])}</small></button>`).join('');
  setTimeout(()=>{if(!live())return;$('zkq').textContent=good?'★':'🏁';
    $('zkans').innerHTML=`<div class="kres">
      <p class="kend ${good?'good':'fun'}">${good?'★':'😂'} エンド「${esc(N.t)}」${newEnd?' <small>NEW!</small>':''}</p>
      ${res?`<p class="zkres">${res}</p>`:''}
      ${more?`<div class="row zkmore">${more}</div>`:''}
      ${phs?`<details class="mfold zkphf"><summary>📒 言えた フレーズ ${P.usedPh.length}こ${P.newPh.length?` <i class="zknew">NEW ${P.newPh.length}</i>`:''}</summary><div class="kwords zkph"><div>${phs}</div>${ZD.own.note?'':'<p class="zknote">📒 フレーズ手帳を 買うと、 言った フレーズを いつでも 見かえせるよ</p>'}</div></details>`:''}
      <div class="kends">${E.map(([k2,n])=>ZD.end[sid+':'+k2]?`<span class="${n.good?'g':''} ${k2===P.at?'now':''}">${n.good?'★':'😂'} ${esc(n.t)}</span>`:`<span class="no">${n.good?'★':'？'} ？？？</span>`).join('')}</div>
      <p class="kendn">🏁 ${esc(P.s.t)}の エンド ${got}/${E.length}</p>
      ${minaBox(k,v)}
      <div class="row"><button id="zkagain" class="sub">🔁 もう一度</button><button id="zkback">🏚️ お店に もどる</button></div>
    </div>`;
    good?SFX.done():(SFX.tease?SFX.tease():SFX.pop());if(R.got)addCoins(R.got);
    $('zkans').querySelectorAll('[data-ph]').forEach(b=>b.onclick=()=>talk(PH[b.dataset.ph][0],NORA));
    $('zkans').querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>{const g=b.dataset.go;hush();P=null;
      if(g==='read'){SFX.book();reader(R.it.id,shop)}else if(g==='pc'){SFX.book();postcard(+b.dataset.n,shop)}else if(g==='fort'){fortune(shop)}else if(g==='give'){give(ZD.gift.length-1,shop)}else if(g==='note'){SFX.book();notebook(shop)}else if(g==='crystal'){crystal(shop)}else if(g==='moon'){SFX.talk();play('moon')}});
    const sid0=sid==='buy'&&c.it?['buy',{it:c.it}]:[sid==='hello'?'rec':sid==='moon'?'moon':sid];
    $('zkagain').onclick=()=>{SFX.step();play(...sid0)};
    $('zkback').onclick=()=>{SFX.back();hush();P=null;shop()};
    setTimeout(()=>$('zkans').scrollIntoView({behavior:'smooth',block:'end'}),100)},1500)}

/* ================================================================ もちもの */
function bag(){hush();const B=ownBooks(),G=ZD.gift,fs=ZD.fort.length;
  const row=(ico,t,sub,btn)=>`<div class="ritem zkbi"><span class="ri">${ico}</span><span class="rn"><b>${t}</b>${sub?`<small>${sub}</small>`:''}</span><span class="rbtn">${btn}</span></div>`;
  const rows=[
    ...B.map(b=>row(b.ico,esc(b.title),esc(b.n)+(ZD.read[b.id]?'・✓ 読んだ':''),`<button data-rd="${b.id}">読む</button>`)),
    ZD.pc.length?row('📮','世界の 絵はがき',`${ZD.pc.length}/${PCS.length}まい`,`<button data-al="1">見る</button>`):'',
    ZD.fortN||fs?row('🥠','英語おみくじ',`まだ わっていない ${ZD.fortN}こ・出た ことば ${new Set(ZD.fort).size}/${FTS.length}`,ZD.fortN?`<button data-ft="1">わる</button>`:`<button data-fl="1" class="sub">見る</button>`):'',
    ...G.map((g,i)=>{const it=item(g.id);return row(it.ico,esc(it.n)+(g.w?' 🎀':''),`${it.to==='mina'?'ミナ先生':(KAIWA.chars[it.to]||{}).n||''}に わたせるよ`,`<button data-gv="${i}">わたす</button>`)}),
    ZD.own.crystal?row('🔮','水晶玉',`出た 言いまわし ${idiomSeen().length}/${ZAKKA_IDIOMS.length}`,`<button data-cr="1">${idiomToday()?'見る':'のぞく'}</button>`):'',
    ZD.own.moonmap?row('🗺️','月の 市場への 地図','ノラさんの ひみつの お話',`<button data-mm="1">聞く</button>`):'',
    Z.tgs().length?row('👦','リクからの お礼',Z.tgs().map(t=>t.ico).join(' ')+'・ノラさんが 買いとって くれる',`<button data-tg="1">売る</button>`):'',
    ZD.own.note?row('📒','買いもの フレーズ手帳',`言えた フレーズ ${phN()}/${PHK.length}`,`<button data-nt="1">ひらく</button>`):''].filter(Boolean);
  H.show('zakka',`<section class="pnl zk">
    <div class="qtop"><button class="x" id="zkx" aria-label="もどる">←</button><b>🎒 もちもの</b><span class="qn"></span></div>
    ${minaBox(rows.length?'zk_bag':'zk_bagNone',{})}
    <div class="zkbag">${rows.join('')||'<p class="note">雑貨屋で 買った ものが ここに ならぶよ</p>'}</div>
  </section>`);
  $('zkx').onclick=()=>{SFX.back();shop()};
  H.panel.querySelectorAll('[data-rd]').forEach(b=>b.onclick=()=>{SFX.book();reader(b.dataset.rd,bag)});
  H.panel.querySelectorAll('[data-al]').forEach(b=>b.onclick=()=>{SFX.book();album(bag)});
  H.panel.querySelectorAll('[data-ft]').forEach(b=>b.onclick=()=>fortune(bag));
  H.panel.querySelectorAll('[data-fl]').forEach(b=>b.onclick=()=>{SFX.book();fortList(bag)});
  H.panel.querySelectorAll('[data-gv]').forEach(b=>b.onclick=()=>give(+b.dataset.gv,bag));
  H.panel.querySelectorAll('[data-cr]').forEach(b=>b.onclick=()=>crystal(bag));
  H.panel.querySelectorAll('[data-mm]').forEach(b=>b.onclick=()=>{SFX.talk();play('moon')});
  H.panel.querySelectorAll('[data-tg]').forEach(b=>b.onclick=()=>{SFX.talk();play('sell')});
  H.panel.querySelectorAll('[data-nt]').forEach(b=>b.onclick=()=>{SFX.book();notebook(bag)})}

/* ---------- 📖 a picture book: line by line, 🔊 and Japanese on a tap ---------- */
function reader(id,back){hush();const b=item(id);if(!b||!ZD.own[id])return back();
  H.show('zakka',`<section class="pnl zk zkbook">
    <div class="qtop"><button class="x" id="zkx" aria-label="もどる">←</button><b>${b.ico} ${esc(b.title)}</b><span class="qn"></span></div>
    <div class="zkpage">${b.lines.map((l,i)=>`<div class="zkl" data-l="${i}"><p>${esc(l[0])}</p><small>${esc(l[1])}</small></div>`).join('')}</div>
    <p class="note">文を タップすると 🔊 と 日本語</p>
    <div class="kwords"><small>この お話の ことば</small><div>${b.words.map(w=>`<button data-w="${esc(w[0])}">${esc(w[0])}<small>${esc(w[1])}</small></button>`).join('')}</div></div>
    <div class="row"><button id="zkall" class="sub">▶ ぜんぶ 聞く</button><button id="zkdone">${ZD.read[id]?'📕 とじる':'✓ 読みおわった'}</button></div>
  </section>`);
  const L=[...H.panel.querySelectorAll('.zkl')];
  L.forEach(d=>d.onclick=()=>{SFX.tap&&SFX.tap();d.classList.add('ja');L.forEach(x=>x.classList.remove('now'));d.classList.add('now');talk(b.lines[+d.dataset.l][0],NORA)});
  H.panel.querySelectorAll('[data-w]').forEach(x=>x.onclick=()=>talk(x.dataset.w,NORA));
  let run=0;$('zkall').onclick=()=>{const my=++run;let i=0;const go=()=>{if(my!==run||!L[i]||!document.body.contains(L[i]))return;L.forEach(x=>x.classList.remove('now'));L[i].classList.add('now');L[i].scrollIntoView({block:'nearest',behavior:'smooth'});talk(b.lines[i][0],NORA);i++;
      const t0=Date.now(),w=()=>{if(my!==run)return;if((talkOn&&Date.now()<talkMax)||Date.now()-t0<900)return setTimeout(w,150);setTimeout(go,500)};setTimeout(w,200)};go()};
  $('zkx').onclick=()=>{run++;SFX.back();hush();back()};
  $('zkdone').onclick=()=>{run++;hush();const first=!ZD.read[id];ZD.read[id]=1;save();
    if(first){SFX.done();const n=Object.keys(ZD.read).length;const [ex,tx]=mline(n===books().length?'zk_readAll':'zk_read',{t:b.title,w:b.words[0][0],wj:b.words[0][1],n});H.toast(`<b>ミナ先生</b> ${tx}`,4600)}else SFX.back();back()}}

/* ---------- 📮 postcards ---------- */
function postcard(i,back){const p=PCS[i];if(!p)return back();
  H.show('zakka',`<section class="pnl zk">
    <div class="qtop"><button class="x" id="zkx" aria-label="もどる">←</button><b>📮 ${esc(p[1])}から</b><span class="qn">${ZD.pc.length}/${PCS.length}</span></div>
    <div class="zkcard"><span class="zcp">${p[0]}</span><p class="bmEn">${esc(p[2])}</p><p class="bmJa" hidden>${esc(p[3])}</p>
      <div class="bmBtns"><button id="zks" class="sub">🔊 きく</button><button id="zkj" class="sub">日本語を 見る</button></div></div>
    ${minaBox('zk_pc',{w:p[4],ja:p[5],pl:p[1]})}
    <div class="row"><button id="zkok">${back===shop?'🏚️ お店に もどる':'もどる'}</button></div>
  </section>`);
  talk(p[2],NORA);$('zks').onclick=()=>talk(p[2],NORA);
  $('zkj').onclick=e=>{SFX.pop();H.panel.querySelector('.bmJa').hidden=false;e.target.remove()};
  $('zkx').onclick=$('zkok').onclick=()=>{SFX.back();hush();back()}}
function album(back){
  H.show('zakka',`<section class="pnl zk">
    <div class="qtop"><button class="x" id="zkx" aria-label="もどる">←</button><b>📮 絵はがき</b><span class="qn">${ZD.pc.length}/${PCS.length}</span></div>
    <div class="zkalb">${PCS.map((p,i)=>ZD.pc.includes(i)?`<button data-p="${i}"><span>${p[0]}</span><small>${esc(p[1])}</small></button>`:`<button class="no" disabled><span>？</span><small>？？？</small></button>`).join('')}</div>
    ${pcDone()?'':'<p class="note">雑貨屋で 1まい 10コイン。 まだ ない 絵はがきが 出るよ</p>'}
  </section>`);
  $('zkx').onclick=()=>{SFX.back();back()};
  H.panel.querySelectorAll('[data-p]').forEach(b=>b.onclick=()=>{SFX.book();postcard(+b.dataset.p,()=>album(back))})}

/* ---------- 🥠 fortune cookies ---------- */
function fortune(back){if(!ZD.fortN)return back();ZD.fortN--;const left=FTS.map((x,i)=>i).filter(i=>!ZD.fort.includes(i)),i=pickL(left.length?left:FTS.map((x,j)=>j)),f=FTS[i];ZD.fort.push(i);save();
  try{SFX.pickup()}catch(e){}
  H.show('zakka',`<section class="pnl zk">
    <div class="qtop"><button class="x" id="zkx" aria-label="もどる">←</button><b>🥠 英語おみくじ</b><span class="qn">${new Set(ZD.fort).size}/${FTS.length}</span></div>
    <div class="zkfort"><span class="zfc">🥠</span><div class="zfs"><p class="bmEn">${esc(f[0])}</p><p class="bmJa" hidden>${esc(f[1])}</p>
      <div class="bmBtns"><button id="zks" class="sub">🔊 きく</button><button id="zkj" class="sub">日本語を 見る</button></div></div></div>
    ${minaBox('zk_fort',{w:f[2],ja:f[3]})}
    <div class="row">${ZD.fortN?`<button id="zkmore" class="sub">🥠 もう1つ わる（のこり ${ZD.fortN}）</button>`:''}<button id="zkok">もどる</button></div>
  </section>`);
  setTimeout(()=>talk(f[0],NORA),700);$('zks').onclick=()=>talk(f[0],NORA);
  $('zkj').onclick=e=>{SFX.pop();H.panel.querySelector('.bmJa').hidden=false;e.target.remove()};
  const m=$('zkmore');if(m)m.onclick=()=>fortune(back);
  $('zkx').onclick=$('zkok').onclick=()=>{SFX.back();hush();back()}}
function fortList(back){const seen=[...new Set(ZD.fort)];
  H.show('zakka',`<section class="pnl zk">
    <div class="qtop"><button class="x" id="zkx" aria-label="もどる">←</button><b>🥠 出た ことば</b><span class="qn">${seen.length}/${FTS.length}</span></div>
    <div class="zkbag">${seen.map(i=>`<button class="zkfl" data-f="${i}"><b>${esc(FTS[i][0])}</b><small>${esc(FTS[i][1])}</small></button>`).join('')}</div>
  </section>`);
  $('zkx').onclick=()=>{SFX.back();back()};
  H.panel.querySelectorAll('[data-f]').forEach(b=>b.onclick=()=>talk(FTS[+b.dataset.f][0],NORA))}

/* ---------- 🎁 give a present: the friend says thank you in English ---------- */
function give(gi,back){const g=ZD.gift[gi];if(!g)return back();const it=item(g.id),to=it.to,T=ZAKKA_THANKS[to],line=pickL(Array.isArray(T)?T:T[g.id]);
  ZD.gift.splice(gi,1);ZD.gave[to]=(ZD.gave[to]||0)+1;
  let who,face;if(to==='mina'){who='ミナ先生';face=MINA.face('m','love')}else{const ch=KAIWA.chars[to];who=ch.n;face=`<span class="zkcf">${ch.ico}</span>`;try{const R=KAIWA.rec();R.heart[to]=(R.heart[to]||0)+1}catch(e){}}
  save();SFX.done();
  const wrapped=g.w?`<p class="zkwr">${g.w==='blue'?'💙 星の 青い 紙':'💗 貝がらの ピンクの 紙'}${g.r?'・🎀 リボン':''}で つつんだ ${it.ico}</p>`:'';
  H.show('zakka',`<section class="pnl zk">
    <div class="qtop"><button class="x" id="zkx" aria-label="もどる">←</button><b>🎁 ${esc(who)}に わたした</b><span class="qn"></span></div>
    ${wrapped}
    <div class="lsay kth k-good"><span class="lface kf">${face}</span><div class="lbody"><p class="ken">${esc(line[0])}${g.w?' The wrapping is beautiful, too!':''}<button class="ksay" aria-label="もう一度 きく">🔊</button></p><small class="kja on">${esc(line[1])}${g.w?' つつみ紙も すてき！':''}</small></div></div>
    ${to!=='mina'?`<p class="zkheart">${KAIWA.chars[to].ico} ${esc(who)}と もっと なかよく なった！ ♥</p>`:''}
    ${minaBox(to==='mina'?'zk_giveMina':'zk_give',{c:who,e:line[0].split(/[.!?]/)[0]})}
    <div class="row"><button id="zkok">もどる</button></div>
  </section>`);
  const say=()=>{const u=line[0]+(g.w?' The wrapping is beautiful, too!':'');if(to==='mina'){talk(u,{p:1.25,r:.95})}else{const ch=KAIWA.chars[to];talk(u,{p:ch.p,r:ch.r})}};
  setTimeout(say,400);H.panel.querySelector('.ksay').onclick=say;
  $('zkx').onclick=$('zkok').onclick=()=>{SFX.back();hush();back()}}

/* ---------- 🔮 the crystal ball: one English expression a day ---------- */
const dayKey=()=>{const d=new Date();return d.getFullYear()*1000+Math.floor((d-new Date(d.getFullYear(),0,0))/864e5)};
const idiomSeen=()=>(ZD.idi&&ZD.idi.seen)||[];
const idiomToday=()=>ZD.idi&&ZD.idi.day===dayKey();
function crystal(back){hush();ZD.idi=ZD.idi||{day:0,i:-1,seen:[]};let fresh=false;
  if(ZD.idi.day!==dayKey()){const left=ZAKKA_IDIOMS.map((x,i)=>i).filter(i=>!ZD.idi.seen.includes(i));ZD.idi.i=pickL(left.length?left:ZAKKA_IDIOMS.map((x,i)=>i));ZD.idi.day=dayKey();if(!ZD.idi.seen.includes(ZD.idi.i))ZD.idi.seen.push(ZD.idi.i);save();fresh=true}
  const d=ZAKKA_IDIOMS[ZD.idi.i];try{fresh?SFX.pickup():SFX.open()}catch(e){}
  H.show('zakka',`<section class="pnl zk">
    <div class="qtop"><button class="x" id="zkx" aria-label="もどる">←</button><b>🔮 水晶玉</b><span class="qn">${idiomSeen().length}/${ZAKKA_IDIOMS.length}</span></div>
    <div class="zkorb ${fresh?'fresh':''}"><span>🔮</span><p class="bmEn">${esc(d[0])}</p><small>${esc(d[1])}</small></div>
    <div class="lsay kth"><span class="lface kf">${NORA.ico}</span><div class="lbody"><p class="ken">${esc(d[2])}<button class="ksay" aria-label="きく">🔊</button></p><small class="kja on">${esc(d[3])}</small></div></div>
    ${minaBox(fresh?'zk_crystal':'zk_crystalAgain',{w:d[0],ja:d[1]})}
    ${idiomSeen().length>1?`<details class="mfold"><summary>📜 これまでの 言いまわし <small>${idiomSeen().length}こ</small></summary><div class="zkbag" style="padding:0 8px 8px">${idiomSeen().map(i=>`<button class="zkfl" data-id="${i}"><b>${esc(ZAKKA_IDIOMS[i][0])}</b><small>${esc(ZAKKA_IDIOMS[i][1])}</small></button>`).join('')}</div></details>`:''}
    <div class="row"><button id="zkok">もどる</button></div>
  </section>`);
  setTimeout(()=>talk(d[2],NORA),500);H.panel.querySelector('.ksay').onclick=()=>talk(d[2],NORA);
  H.panel.querySelectorAll('[data-id]').forEach(b=>b.onclick=()=>talk(ZAKKA_IDIOMS[+b.dataset.id][2],NORA));
  $('zkx').onclick=$('zkok').onclick=()=>{SFX.back();hush();back()}}

/* ---------- 📒 the phrase notebook and its quiz ---------- */
function notebook(back){hush();if(!ZD.own.note)return back();const got=PHK.filter(k=>ZD.ph[k]);
  H.show('zakka',`<section class="pnl zk">
    <div class="qtop"><button class="x" id="zkx" aria-label="もどる">←</button><b>📒 フレーズ手帳</b><span class="qn">${got.length}/${PHK.length}</span></div>
    ${minaBox(got.length>=4?'zk_note':'zk_noteFew',{n:got.length,tot:PHK.length})}
    <div class="zkbag zknb">${PHK.map(k=>ZD.ph[k]?`<button class="zkfl" data-p="${k}"><b>${esc(PH[k][0])}</b><small>${esc(PH[k][1])}　<i>${esc(PH[k][2])}</i></small></button>`:`<div class="zkfl no"><b>？？？</b><small>${esc(PH[k][2])}</small></div>`).join('')}</div>
    <div class="row"><button id="zkq5" ${got.length>=4?'':'disabled'}>🎯 フレーズ クイズ 5問</button></div>
  </section>`);
  $('zkx').onclick=()=>{SFX.back();back()};
  H.panel.querySelectorAll('[data-p]').forEach(b=>b.onclick=()=>talk(PH[b.dataset.p][0],NORA));
  $('zkq5').onclick=()=>{SFX.lesson?SFX.lesson():SFX.step();quiz(back)}}
function quiz(back){const got=PHK.filter(k=>ZD.ph[k]),Q=H.shuffle(got.slice()).slice(0,5);let qi=0,score=0,coins=0,miss=0;
  const ask=()=>{if(qi>=Q.length)return done();const k=Q[qi],wrong=H.shuffle(PHK.filter(x=>x!==k)).slice(0,2),ch=H.shuffle([k,...wrong]);miss=0;
    H.show('zakka',`<section class="pnl zk">
      <div class="qtop"><button class="x" id="zkx" aria-label="やめる">←</button><b>🎯 フレーズ クイズ</b><span class="qn">${qi+1}/${Q.length}</span></div>
      <div class="zkqq"><small>${esc(PH[k][2])}</small><p>「${esc(PH[k][1])}」</p><small>英語で 言うと？</small></div>
      <div class="lopts kopts zkopts" id="zkqo">${ch.map(x=>`<button data-c="${x}">${esc(PH[x][0])}</button>`).join('')}</div>
      <div id="zkqh"></div>
    </section>`);
    $('zkx').onclick=()=>{SFX.back();notebook(back)};
    H.panel.querySelectorAll('[data-c]').forEach(b=>b.onclick=()=>{if(b.disabled)return;const ok=b.dataset.c===k;
      if(ok){SFX.correct();b.classList.add('ok');talk(PH[k][0],NORA);if(!miss){score++;coins++}
        H.panel.querySelectorAll('[data-c]').forEach(x=>x.disabled=true);
        $('zkqh').innerHTML=`<p class="zkok">⭕ ${miss?'できた！':'せいかい！'} <b>${esc(PH[k][0])}</b></p><div class="row"><button id="zkn">つぎへ ▶</button></div>`;$('zkn').onclick=()=>{qi++;SFX.step();ask()};return}
      SFX.wrong();b.disabled=true;b.classList.add('tried');miss++;
      if(miss===1)$('zkqh').innerHTML=`<p class="khint">💡 ヒント： 「${esc(PH[k][0].split(' ').slice(0,2).join(' '))} …」で はじまるよ</p>`;
      else{H.panel.querySelectorAll('[data-c]').forEach(x=>{x.disabled=true;if(x.dataset.c===k)x.classList.add('ok')});talk(PH[k][0],NORA);
        $('zkqh').innerHTML=`<p class="zkex">📝 <b>${esc(PH[k][0])}</b> ＝ ${esc(PH[k][1])}<br><small>${esc(PH[k][2])}に つかうよ。 「${esc(PH[b.dataset.c][0])}」は 「${esc(PH[b.dataset.c][1])}」の いみ</small></p><div class="row"><button id="zkn">つぎへ ▶</button></div>`;$('zkn').onclick=()=>{qi++;SFX.step();ask()}}})};
  const done=()=>{ZD.quiz.n++;ZD.quiz.best=Math.max(ZD.quiz.best||0,score);save();const star=score>=5?3:score>=3?2:1;
    H.show('zakka',`<section class="pnl zk">
      <div class="qtop"><button class="x" id="zkx" aria-label="もどる">←</button><b>🎯 フレーズ クイズ</b><span class="qn">${'★'.repeat(star)}</span></div>
      <p class="kend good">${'★'.repeat(star)}${'☆'.repeat(3-star)}　${score}/${Q.length} 問 一発で せいかい</p>
      <div class="kwords zkph"><small>きょうの フレーズ（タップで 🔊）</small><div>${Q.map(k=>`<button data-ph="${k}">${esc(PH[k][0])}<small>${esc(PH[k][1])}</small></button>`).join('')}</div></div>
      ${coins?`<p class="kpay">🪙 <b>${coins}まい</b></p>`:''}
      ${minaBox(score>=5?'zk_quizAll':score>=3?'zk_quizGood':'zk_quizLow',{n:score})}
      <div class="row"><button id="zkagain" class="sub">🔁 もう一度</button><button id="zkok">📒 手帳に もどる</button></div>
    </section>`);
    H.panel.querySelectorAll('[data-ph]').forEach(b=>b.onclick=()=>talk(PH[b.dataset.ph][0],NORA));
    if(coins){const r=H.panel.querySelector('.kpay').getBoundingClientRect();H.coinBurst(r.left+r.width/2,r.top,coins)}
    score>=3?SFX.done():SFX.pop();
    $('zkx').onclick=$('zkok').onclick=()=>{SFX.back();notebook(back)};$('zkagain').onclick=()=>{SFX.step();quiz(back)}};
  ask()}

/* ================================================================ Mina */
Object.assign(MINA_LINES,{
 zk_first:[['wow','あれっ、 浜辺の 右はしに 小さな 小屋が できてる。 雑貨屋さん みたい。 タップして のぞいてみて'],['think','ねえ、 浜辺の はっこに あかりの ついた 小屋、 気づいた？ 英語で 買いものが できる お店なんだって']],
 zk_endHello:[['happy','ノラさんと ピップに 会えたね！ たなの 品物を タップすると、 英語で 買いものが できるよ'],['smile','あの お店、 ぜんぶ 英語なんだ。 まずは 「How much is this?」から ためしてみよう']],
 zk_endBuy:[['happy','英語で 買いもの できたね！ お店の 人と 話せるって、 外国でも つかえる 力だよ'],['proud','「I\'ll take it.」が すっと 言えたら、 もう 買いもの 名人だよ'],['smile','いい 買いもの だったね。 レシートを もらっておくと、 返品の ときに こまらないよ']],
 zk_endBook:[['wow','絵本を 買ったんだね！ 1行ずつ 🔊で 聞いて、 まねして 読んでみて'],['happy','英語の お話を 1さつ 読みきると、 すごく 自信が つくよ。 たのしんでね']],
 zk_endGift:[['love','プレゼントを 英語で 買ったの？ すてき。 「It\'s a present for 〜.」は ほんとに よく つかうよ'],['happy','つつんで もらったんだね。 「Could you gift-wrap it?」、 ていねいで いい 言い方だよ']],
 zk_endDeal:[['wow','ねぎれたね！ 「Can you give me a discount?」は ていねいに 言うのが コツだよ'],['smile','おトクに 買えたね。 外国の 市場では ねぎるのも たのしみの ひとつなんだ']],
 zk_endHaggle:[['wow','2わり びき！ 「How about 〜 coins?」で 自分から 値段を 言えたのが すごい'],['proud','ノラさんに 勝っちゃったね。 ねぎりの 英語、 もう ばっちりだよ']],
 zk_endSell:[['happy','売るのも 英語で できたね。 「Could you pay a little more?」は つかえる 言い方だよ'],['smile','「That sounds fair.」は 「それで いいですよ」って いみ。 大人っぽい 言い方だね']],
 zk_endReturn:[['think','返品も 英語で できたね。 「I\'d like to return this.」、 いざと いう ときに 役に 立つよ'],['smile','レシートが あるか ないかで 話が かわったでしょ？ ほんとの お店でも そうなんだ']],
 zk_endHold:[['smile','「Could you put it aside for me?」で とっておいて もらえたね。 コインが たまったら 行こう'],['happy','とりおき、 ちゃんと 英語で たのめたね。 えらい！']],
 zk_endFun:[['happy','ノラさん、 わらってたね。 へんな 答えでも 会話が つづくのが 英語の たのしい ところ'],['think','ピップに まねされちゃったね。 こんどは べつの 答えで ★の エンドを めざそう']],
 zk_endTalk:[['smile','エンド「{t}」だね。 ほかの 答えを えらぶと、 ちがう エンドに 行けるよ'],['happy','ノラさんと たくさん 話せたね。 買いものの 英語って、 パターンを おぼえると ぐっと らくに なるよ']],
 zk_endPhrase:[['proud','「{p}」、 はじめて 言えたね！ 「{pj}」って いみだよ'],['happy','新しい フレーズ 「{p}」 ゲット！ 声に 出して もう一回 言ってみよう']],
 zk_endTyped:[['wow','自分で 英語を 書いて 買いもの したの？ それ、 いちばん 力が つく やり方だよ'],['proud','えらぶ だけじゃなくて 自分で 言えたね。 ほんとの お店でも だいじょうぶ！']],
 zk_endLux:[['wow','ガラスケースの {t}？！ 大きな 買いもの だったね。 「Is it worth it?」って 聞けたかな'],['proud','高い 品物の 英語、 「Can I take a closer look?」「Does it come with a warranty?」も つかえたね'],['love','ごほうびの 買いもの、 たいせつに してね。 英語で 値段の 交渉が できるって すごいことだよ']],
 zk_endMoon:[['wow','ノラさんの ひみつ、 聞いちゃったね… ピップって 月の 市場から 来たんだ！'],['think','「思い出を 1つ」… ノラさん、 どの 答えに なっても やさしかったね。 ほかの 答えも ためしてみて']],
 zk_crystal:[['wow','きょうの 言いまわしは 「{w}」。 「{ja}」って いみだよ。 きょう 1回 つかってみよう'],['smile','「{w}」＝「{ja}」。 ことばの まま 訳すと へんだけど、 ネイティブは よく つかうんだ'],['happy','水晶玉、 毎日 1つずつ。 1年で 365こ ふえるよ']],
 zk_crystalAgain:[['smile','きょうの 「{w}」、 おぼえた？ あしたは 新しいのが 見えるよ'],['think','「{w}」は 「{ja}」。 声に 出して 3回 言ってみよう']],
 zk_bag:[['smile','買った ものは ここに あるよ。 絵本は 毎日 1さつ、 声に 出して 読むと いいよ'],['happy','プレゼントは わたすと、 相手が 英語で お礼を 言ってくれるよ']],
 zk_bagNone:[['smile','まだ なにも ないね。 雑貨屋で 気に なる ものを 見つけてみて']],
 zk_read:[['proud','「{t}」を 読みおわったね！ 「{w}」は 「{wj}」って いみだよ'],['happy','英語の 絵本 {n}さつ目 読破！ どんどん 読めるように なってるね']],
 zk_readAll:[['wow','雑貨屋の 絵本、 ぜんぶ 読んだの？！ ほんとに すごい。 英語の 本が 友だちに なったね']],
 zk_pc:[['smile','{pl}からの 絵はがきだね。 「{w}」は 「{ja}」って いみ'],['wow','世界の どこかから 英語の 一言。 「{w}」＝「{ja}」 だよ']],
 zk_fort:[['happy','いい ことばが 出たね。 「{w}」は 「{ja}」だよ'],['smile','おみくじの 英語、 ことわざが 多いんだ。 「{w}」＝「{ja}」 おぼえておこう']],
 zk_giveMina:[['love','わあ、 ほんとに ありがとう！ 「{e}」って 言ったの、 聞きとれた？'],['love','うれしい…！ 英語で お礼を 言われたら 「You\'re welcome.」って かえしてね']],
 zk_give:[['happy','{c}、 とっても よろこんでたね。 「{e}」って 言ってたよ'],['smile','プレゼントって、 英語でも 気持ちが つたわるね。 {c}と もっと なかよく なれたよ']],
 zk_note:[['proud','フレーズ {n}こ あつまったね。 クイズで ためしてみよう'],['smile','手帳の フレーズを 🔊で 聞いて、 まねして 言うと すぐ おぼえられるよ']],
 zk_noteFew:[['smile','フレーズが 4こ たまると クイズが できるよ。 ノラさんと たくさん 話してみて']],
 zk_quizAll:[['wow','5問 ぜんぶ 一発で せいかい！ 買いもの 英語、 かんぺきだね'],['proud','もう どこの 国の お店でも 買いもの できちゃうね！']],
 zk_quizGood:[['happy','{n}問 せいかい！ まちがえた フレーズは お店で 言ってみると おぼえるよ'],['smile','いい 調子。 もう一回 やると もっと のこるよ']],
 zk_quizLow:[['smile','{n}問 せいかい。 だいじょうぶ、 ノラさんと 話すたびに おぼえていくよ'],['think','むずかしかった？ 手帳で 🔊を 聞いてから もう一回 やってみよう']],
 /* ホーム・ミナ先生の ページで（game/mina-sense.js の ルール） */
 x_zkNone:[['think','浜辺の 右はしに ある 小さな 小屋、 気づいた？ 英語で 買いものが できる 雑貨屋さん なんだ'],['wow','ねえ、 海の そばの 小屋に あかりが ついてるよ。 タップしてみて']],
 x_zkPhrase:[['smile','雑貨屋で 言った 「{p}」、 おぼえてる？ 「{pj}」って いみだよ'],['happy','「{p}」は 外国の お店でも そのまま つかえるよ。 ほんとに 便利']],
 x_zkBook:[['smile','買った 絵本 「{t}」、 まだ 読みおわって ないよね。 1行ずつで いいから 読んでみよう'],['happy','「{t}」の つづき、 気に ならない？ 🎒 もちもの から 読めるよ']],
 x_zkGift:[['wow','{c}への プレゼント、 まだ もってるよね？ わたしてあげたら よろこぶよ'],['smile','🎁 {c}に わたすと、 英語で お礼を 言ってくれるよ']],
 x_zkBottle:[['think','ボトルメールの からの びん、 {n}本 あるでしょ？ 雑貨屋の ノラさんが 買いとって くれるよ'],['smile','「I\'d like to sell this.」で びんを 売ってみよう。 英語の 練習にも なるよ']],
 x_zkEnds:[['happy','雑貨屋の 会話、 エンドは {n}/{tot} 見つけたね。 ねぎったり、 ピップを からかったりすると…？'],['think','ノラさんとの 会話、 答えを かえると ちがう エンドに なるよ。 いま {n}/{tot}']],
 x_zkPc:[['smile','絵はがき {n}まい 集まったね。 世界中から 英語の 一言が とどくって すてき'],['happy','絵はがきは あと {left}まい。 どんな 国の はがきが 出るかな']],
 x_zkLux:[['wow','コイン、 たくさん たまったね。 雑貨屋の ガラスケースに 「{t}」が あるよ'],['think','ノラさんの ガラスケース、 のぞいてみた？ 「{t}」は とくべつな 品物なんだって']],
 x_zkCrystal:[['smile','水晶玉、 きょうは もう のぞいた？ 新しい 言いまわしが 見えるよ'],['happy','🔮 きょうの 英語の 言いまわし、 まだ 見てないよ']],
 x_zkMoon:[['wow','月の 市場の 地図、 もってるよね？ ノラさんの お話、 ほかの 答えも 聞いてみよう']],
 x_zkHold:[['smile','ノラさんが {t}を とっておいて くれてるよ。 コインは たりてる？']],
});
/* the rules Mina reads on the home screen and on her page */
const goShop=()=>['🏚️ 雑貨屋へ',open];
if(window.MINA_SENSE&&MINA_SENSE._rules)MINA_SENSE._rules.push(
 ['x_zkNone',4,()=>!ZD.met?{}:null,goShop],
 ['x_zkPhrase',2,()=>{const a=PHK.filter(k=>ZD.ph[k]);if(!a.length)return null;const k=pickL(a);return {p:PH[k][0],pj:PH[k][1]}},goShop],
 ['x_zkBook',3,()=>{const b=ownBooks().find(b=>!ZD.read[b.id]);return b?{t:b.title,_id:b.id}:null},v=>['📖 読む',()=>reader(v._id,H.home)]],
 ['x_zkGift',4,()=>{const g=ZD.gift[0];if(!g)return null;const to=item(g.id).to;return {c:to==='mina'?'わたし':KAIWA.chars[to].n}},()=>['🎁 わたす',()=>give(0,H.home)]],
 ['x_zkBottle',2,()=>ZD.met&&bottles()>=2?{n:bottles()}:null,()=>['💰 売りに 行く',()=>play('sell')]],
 ['x_zkEnds',1,()=>ZD.met&&endsN()?{n:endsN(),tot:endsAll()}:null,goShop],
 ['x_zkPc',1,()=>ZD.pc.length?{n:ZD.pc.length,left:PCS.length-ZD.pc.length}:null,()=>['📮 見る',()=>album(H.home)]],
 ['x_zkLux',3,()=>{const a=IT.filter(i=>i.lux&&!ZD.own[i.id]&&ST.coins>=i.p);return a.length?{t:pickL(a).n}:null},goShop],
 ['x_zkCrystal',4,()=>ZD.own.crystal&&!idiomToday()?{}:null,()=>['🔮 のぞく',()=>crystal(H.home)]],
 ['x_zkMoon',1,()=>ZD.own.moonmap&&Object.keys(ZD.end).filter(k=>k.startsWith('moon:')).length<4?{}:null,()=>['🌕 お話を 聞く',()=>play('moon')]],
 ['x_zkHold',3,()=>ZD.hold&&item(ZD.hold)?{t:item(ZD.hold).n}:null,goShop]);
/* the first time: Mina points at the hut once */
setTimeout(function first(){if(ZD.met||ZD.told)return;const m=window.MINA;if(!m||!m.canAnnounce||!m.canAnnounce())return setTimeout(first,20000);
  ZD.told=1;save();const [ex,tx]=mline('zk_first');m.say('m',ex,tx,9000,null,['🏚️ のぞいてみる',open])},45000);

window.ZAKKA={open,shop,play,bag,reader,notebook,rec:()=>ZD,items:IT,scenes:SC,endsN,endsAll,_hut:hut};
})();
