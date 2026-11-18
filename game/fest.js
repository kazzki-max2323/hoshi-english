/* 🏮 浜辺の お祭り（寄付 ＝ コインの 使い道）
   - 浜辺の 右の 手前に 「お祭りの 掲示板」。 タップ → お祭り実行委員会（委員長は ノラさん）
   - コインを 寄付すると、 その日（きょう 1日）だけ お祭り（FEST_LIST）が ひらかれる。 1日 1つ
     ・ホームの 浜辺で ショーが ときどき 見られる（夜と 昼で ちがう。 beach/scene.js SCENE.show）
     ・だれかと すごす 英語の 会話（ミナ先生・ミオ・リク…）・🏮 夏祭りは 屋台 4つ・🕯️ 灯ろう流しは ねがいを 英語で
   - 寄付の 合計で 称号（FEST_TITLES）。 屋台の おみやげは 図鑑に のこる（金魚は 浜辺の 家に）
   - 浜辺の 位置は game/game.js の sandSpots() にも 入れてある（ラジオよけ）
   データは localStorage SAVE_KEY の fest = {day, id, total, cnt:{id:回数}, done:{talk/stall id: 日}, sv:{id:数}, wish:[[英語,日本語]], seen:{talk:回数}} */
(()=>{
const {S:ST,sfx:SFX}=BEACH;
const H=HE,esc=H.esc,$=id=>document.getElementById(id);
const pickL=a=>a[Math.random()*a.length|0];
const sf=k=>{try{SFX[k]&&SFX[k]()}catch(e){}};
const today=()=>{const d=new Date();return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate()};
const FL=FEST_LIST,fest=id=>FL.find(f=>f.id===id);

const FS=(()=>{try{const s=JSON.parse(localStorage.getItem(SAVE_KEY)||'{}').fest;if(s&&s.cnt)return s}catch(e){}return {day:'',id:'',total:0,cnt:{},done:{},sv:{},wish:[],seen:{}}})();
_saveHooks.push(()=>{const s=JSON.parse(localStorage.getItem(SAVE_KEY)||'{}');s.fest=FS;localStorage.setItem(SAVE_KEY,JSON.stringify(s))});
const now=()=>FS.day===today()?fest(FS.id):null;
const done=k=>FS.done[k]===today();
const mark=k=>{FS.done[k]=today();save()};
const title=()=>{let t=null;FEST_TITLES.forEach(x=>{if(FS.total>=x[0]&&FS.total>0)t=x});return t};
const nextTitle=()=>FEST_TITLES.find(x=>x[0]>FS.total);
const minaBox=(k,v)=>{try{const [ex,tx]=MINA.line(k,v||{});return `<div class="kmina"><span class="lface">${MINA.face('m',ex)}</span><p>${tx}</p></div>`}catch(e){return ''}};
const top=(t,id)=>`<div class="qtop"><button class="x" id="${id}" aria-label="もどる">←</button><b>${t}</b><span class="qn">🪙 ${ST.coins.toLocaleString()}</span></div>`;
const say=en=>{try{H.say('jh',en)}catch(e){}};
const mioOk=()=>{try{return SHOP.rec().met&&MIOC.stage()>=1}catch(e){return false}};

/* ================================================================ 浜辺の 掲示板 */
const BOARD=`<svg viewBox="0 0 48 52" aria-hidden="true"><ellipse cx="24" cy="49" rx="18" ry="2.4" fill="#0003"/>
 <rect x="8" y="18" width="3" height="31" fill="#7a5534"/><rect x="37" y="18" width="3" height="31" fill="#7a5534"/>
 <path d="M4 16 L24 7 L44 16 Z" fill="#b8423a"/><rect x="6" y="16" width="36" height="20" rx="1.2" fill="#d9b27a" stroke="#7a5534" stroke-width="1.2"/>
 <rect x="10" y="19" width="12" height="14" fill="#fff6e0"/><rect x="25" y="19" width="13" height="9" fill="#fff6e0"/><g stroke="#c94a3a" stroke-width=".8"><line x1="12" y1="22" x2="20" y2="22"/><line x1="12" y1="25" x2="19" y2="25"/><line x1="12" y1="28" x2="20" y2="28"/><line x1="27" y1="22" x2="36" y2="22"/><line x1="27" y1="25" x2="34" y2="25"/></g>
 <g class="fsL"><line x1="9.5" y1="36" x2="9.5" y2="38.6" stroke="#333" stroke-width=".5"/><ellipse cx="9.5" cy="42" rx="3.2" ry="3.8" fill="var(--lan)"/><line x1="38.5" y1="36" x2="38.5" y2="38.6" stroke="#333" stroke-width=".5"/><ellipse cx="38.5" cy="42" rx="3.2" ry="3.8" fill="var(--lan)"/></g>
 <g class="fsFlag"><path d="M24 7 V0.6" stroke="#555" stroke-width=".7"/><path d="M24 1 L31 2.6 L24 4.4Z" fill="#ffcf4a"/></g></svg>`;
const GLOW=`<svg viewBox="0 0 48 52" aria-hidden="true"><defs><radialGradient id="fsg"><stop offset="0" stop-color="rgba(255,150,90,.85)"/><stop offset="1" stop-color="rgba(255,150,90,0)"/></radialGradient></defs><circle cx="9.5" cy="42" r="8" fill="url(#fsg)"/><circle cx="38.5" cy="42" r="8" fill="url(#fsg)"/></svg>`;
/* 浜辺の 右の 手前。 game.js sandSpots() と いっしょに なおす */
const BOX=d=>{const k=d.k,w=Math.round(34*k);return {w,x:Math.round(d.WW*.8-w/2),y:Math.round(d.shore-d.WT+92*k-w*50/48)}};
function board(){let b=$('fsBoard');const w=$('window');if(!w)return;
  if(!b){b=document.createElement('button');b.id='fsBoard';b.setAttribute('aria-label','お祭りの 掲示板');b.innerHTML=`<span class="fsBody">${BOARD}</span><span class="fsGlow">${GLOW}</span>`;w.appendChild(b);
    b.onclick=e=>{e.stopPropagation();if(H.screen!=='home')return;sf('step');open()}}
  let d;try{d=SCENE.dbg()}catch(e){return}
  const o=BOX(d);b.style.width=o.w+'px';b.style.left=o.x+'px';b.style.top=o.y+'px';
  const dk=Math.max(0,Math.min(1,d.dark||0));b.style.setProperty('--dk',dk.toFixed(2));
  b.classList.toggle('on',!!now());b.classList.toggle('off',H.screen!=='home')}
setTimeout(board,750);addEventListener('resize',()=>setTimeout(board,200));setInterval(board,2500);

/* ================================================================ ホームの ショー（お祭りの 日だけ） */
let nextShow=0;
function showNow(){const f=now();if(!f)return false;let d;try{d=SCENE.dbg()}catch(e){return false}
  const night=(d.dark||0)>.45,L=night?f.night:f.day;
  try{L.forEach((n,i)=>setTimeout(()=>SCENE.show(n,/^fw|grandfw/.test(n)?45:70),i*1500));if(!night&&f.ev)SCENE.play(f.ev)}catch(e){}
  try{RECENT.add('bev',{name:L[0],ico:f.ico,ja:f.n,cat:'show'})}catch(e){}
  nextShow=performance.now()+150000+Math.random()*90000;return true}
setInterval(()=>{if(!now()||document.hidden||H.screen!=='home')return;if(performance.now()>=nextShow)showNow()},10000);
H.on('home',()=>{setTimeout(board,90);if(now()&&performance.now()>nextShow-120000)nextShow=performance.now()+6000});

/* ================================================================ 画面 */
function open(){return now()?today_():menu()}
/* 寄付の メニュー */
function menu(){const t=title(),nt=nextTitle(),hd=FS.day===today()&&now();
  H.show('fest',`<section class="pnl fs">
    ${top('🏮 お祭り実行委員会','fsx')}
    <div class="kwnpc fsnora"><span class="fsico">👩‍🦳</span><p><b>ノラさん（委員長）</b>"Help us hold a festival on the beach! If you donate, the festival will be held today."<small>浜辺で お祭りを ひらく お手伝いを して！ 寄付して くれたら きょう ひらくよ</small></p></div>
    <p class="mchd">きょう ひらく お祭りを えらぶ <small>1日 1つ・その日 だけ</small></p>
    <div class="mcls fsls">${FL.map(f=>`<button data-f="${f.id}"><span>${f.ico}</span><b>${esc(f.n)}<small>${esc(f.d)}</small></b><i>🪙${f.p.toLocaleString()}${FS.cnt[f.id]?`<br>${FS.cnt[f.id]}回`:''}</i></button>`).join('')}</div>
    ${FS.total?`<div class="fsrec"><span>${t[1]}</span><div><b>${esc(t[2])}</b><small>寄付の 合計 🪙${FS.total.toLocaleString()}${nt?`・つぎは ？？？（あと ${(nt[0]-FS.total).toLocaleString()}）`:''}</small></div></div>`:''}
    ${souv()}
    ${minaBox(FS.total?'fs_menu':'fs_first',{})}
  </section>`);
  $('fsx').onclick=()=>{sf('back');H.home()};
  H.panel.querySelector('.fsnora').onclick=()=>say('Help us hold a festival on the beach! If you donate, the festival will be held today.');
  H.panel.querySelectorAll('[data-f]').forEach(b=>b.onclick=()=>{sf('step');confirm_(fest(b.dataset.f))})}
function souv(){const L=FEST_STALLS.filter(s=>FS.sv[s.id]);const W=FS.wish.length;if(!L.length&&!W)return '';
  return `<details class="shmore"><summary>🎐 お祭りの 思い出</summary><div class="fsmem">${L.map(s=>`<span>${s.sv.ico} ${esc(s.sv.n)} <small>${esc(s.sv.en)} ×${FS.sv[s.id]}</small></span>`).join('')}${FS.wish.slice(-5).reverse().map(w=>`<span>🕯️ ${esc(w[0])} <small>${esc(w[1])}</small></span>`).join('')}</div></details>`}
function confirm_(f){if(ST.coins<f.p){sf('no');H.toast(`🪙 コインが たりないよ <small>${esc(f.n)}は ${f.p.toLocaleString()}まい（あと ${(f.p-ST.coins).toLocaleString()}まい）</small>`,3000);return}
  H.show('fest',`<section class="pnl fs">
    ${top('🏮 寄付','fsx')}
    <div class="dtpay"><p>${f.ico} きょう 「${esc(f.n)}」を ひらく<br><small>${esc(f.en)}</small></p><b>🪙 ${f.p.toLocaleString()}まい</b><small>のこり ${(ST.coins-f.p).toLocaleString()}まい・あしたに なると おわるよ</small></div>
    <div class="row"><button id="fsgo">🏮 寄付する</button><button id="fsno" class="sub" data-back>やめる</button></div></section>`);
  $('fsx').onclick=$('fsno').onclick=()=>{sf('back');menu()};
  $('fsgo').onclick=()=>{H.addCoins(-f.p);FS.day=today();FS.id=f.id;FS.total+=f.p;FS.cnt[f.id]=(FS.cnt[f.id]||0)+1;save();board();
    try{RECENT.add('fest',{kind:'give',id:f.id,ja:f.n,ico:f.ico,p:f.p})}catch(e){}
    try{SFX.fanfare(2)}catch(e){sf('done')}
    H.toast(`${f.ico} きょうは <b>${esc(f.n)}</b>！ <small>浜辺に ショーが 出るよ</small>`,3600);
    today_(true)}}

/* きょうの お祭り */
function today_(fresh){const f=now();if(!f)return menu();
  const T=f.talks.map(id=>FEST_TALKS.find(t=>t.id===id)).filter(t=>t&&(t.who==='mina'||t.id==='ft_kite'||mioOk()));
  const who=t=>t.who==='mina'?'ミナ先生と':t.id==='ft_kite'?'リクくんと':'ミオと';
  const face=t=>t.who==='mina'?MINA.face('m','happy'):t.id==='ft_kite'?'<i>👦</i>':MIO.face('laugh','wave');
  H.show('fest',`<section class="pnl fs">
    ${top(`${f.ico} きょうは ${esc(f.n)}`,'fsx')}
    <div class="fshero"><span>${f.ico}</span><b>${esc(f.n)}</b><small>${esc(f.en)}・きょう いちにち</small></div>
    <button id="fssee" class="mcstudy fssee"><span>👀</span><b>浜辺で 見る<small>${f.night.length&&f.day.length?'夜と 昼で ショーが かわるよ':''}</small></b></button>
    <p class="mchd">💬 だれと すごす？</p>
    <div class="mcls fsls">${T.map(t=>`<button data-t="${t.id}" ${done(t.id)?'disabled':''}><span class="fsf">${face(t)}</span><b>${who(t)} ${esc(t.t.replace(/^.*?と /,''))}<small>${done(t.id)?'きょうは もう すごしたよ':'英語の 会話'}</small></b><i>${FS.seen[t.id]?'★':'NEW'}</i></button>`).join('')}</div>
    ${f.stalls?`<p class="mchd">🏮 屋台</p><div class="fsst">${FEST_STALLS.map(s=>`<button data-s="${s.id}" ${done(s.id)?'disabled':''}><span>${s.ico}</span><b>${esc(s.n)}</b>${done(s.id)?'<small>✓</small>':''}</button>`).join('')}</div>`:''}
    ${f.wish?`<button id="fswish" class="mcstudy fswish" ${done('wish')?'disabled':''}><span>🕯️</span><b>灯ろうに ねがいを 書く<small>${done('wish')?'きょうは もう 流したよ':'英語で ねがいごと'}</small></b></button>`:''}
    ${minaBox(fresh?'fs_start':'fs_today',{n:f.n})}
    <div class="row"><button id="fsmenu" class="sub">🏮 実行委員会</button></div>
  </section>`);
  $('fsx').onclick=()=>{sf('back');H.home()};
  $('fsmenu').onclick=()=>{sf('step');menu()};
  $('fssee').onclick=()=>{sf('step');H.home();setTimeout(showNow,400)};
  H.panel.querySelectorAll('[data-t]').forEach(b=>b.onclick=()=>{if(b.disabled)return;sf('step');talk(FEST_TALKS.find(t=>t.id===b.dataset.t))});
  H.panel.querySelectorAll('[data-s]').forEach(b=>b.onclick=()=>{if(b.disabled)return;sf('step');stall(FEST_STALLS.find(s=>s.id===b.dataset.s))});
  const w=$('fswish');if(w)w.onclick=()=>{if(w.disabled)return;sf('step');wish()}}

/* ---------- 会話（mio-chat.js の play を つかう） ---------- */
const rom=t=>{try{if(t.who==='mina')return WED.romantic('mina')&&WED.who()!=='mio';return !!(window.DATE&&DATE.romantic())}catch(e){return false}};
function talk(src,wishTxt){const r=rom(src),nodes={};
  Object.keys(src.nodes).forEach(k=>{const n=Object.assign({},src.nodes[k]);let m=r?(n.lv||n.m):(n.fr||n.m);
    if(wishTxt)m=m.map(x=>x.replace('{wish}',wishTxt));n.m=m;delete n.lv;delete n.fr;
    if(n.o)n.o=n.o.map(o=>{const x=(!r&&o[5])?o[5]:o;return [x[0],x[1],o[2],o[3]||0]});nodes[k]=n});
  /* 灯ろう: ねがいを 書いていない ときは 「ひみつ」の 道だけ */
  if(src.id==='ft_toro'&&!wishTxt)nodes.s.o=nodes.s.o.filter(o=>o[2]!=='a');
  mark(src.id);
  const t={id:src.id,ico:src.ico,t:src.t,who:src.who==='mina'?'mina':'fest',nodes,okL:'お祭りに もどる',
    fin:(n,k,newEnd,pts)=>{FS.seen[src.id]=(FS.seen[src.id]||0)+1;save();let hs='';
      if(src.who!=='mina'&&src.id!=='ft_kite')try{hs=MIOC.gain(newEnd?Math.max(2,pts):1,'talk')}catch(e){}
      try{RECENT.add('fest',{kind:'talk',id:src.id,ja:src.t,ico:src.ico,end:n.end})}catch(e){}
      return `${hs?`<p class="zkheart">${hs}</p>`:''}${src.who==='mina'?'':minaBox(n.end==='fun'?'fs_talkFun':'fs_talk',{t:src.t})}`},
    bind:box=>{const a=box.querySelector('#mcagain');if(a)a.remove()}};
  try{MIOC.play(t,()=>today_())}catch(e){today_()}}

/* ---------- 🏮 屋台 ---------- */
function stall(s){const on=(()=>{try{return MINA.level()==='es'}catch(e){return true}})();
  H.show('fest',`<section class="pnl fs">
    ${top(`${s.ico} ${esc(s.n)}`,'fsx')}
    <div class="lsay kth"><span class="lface kf">${s.who}</span><div class="lbody"><p class="ken">${esc(s.q[0])}<button class="ksay" aria-label="もう一度 きく">🔊</button></p><small class="kja on">${esc(s.q[1])}</small></div></div>
    <div class="lopts kopts" id="fsop">${H.shuffle(s.o.map((o,i)=>[o,i])).map(([o,i])=>`<button data-i="${i}">${esc(o[0])}<small class="mcja" ${on?'':'hidden'}>${esc(o[1])}</small></button>`).join('')}</div>
    <div id="fsres"></div></section>`);
  say(s.q[0]);H.panel.querySelector('.ksay').onclick=()=>say(s.q[0]);
  $('fsx').onclick=()=>{sf('back');today_()};
  H.panel.querySelectorAll('#fsop [data-i]').forEach(b=>b.onclick=()=>{const o=s.o[+b.dataset.i],ok=o[2];sf(ok?'good':'pop');
    H.panel.querySelectorAll('#fsop button').forEach(x=>{x.disabled=true;if(s.o[+x.dataset.i][2])x.classList.add('ok')});if(!ok)b.classList.add('ng');
    const a=ok?s.ok:s.ng;mark(s.id);FS.sv[s.id]=(FS.sv[s.id]||0)+1;
    let extra='';if(s.sv.fish&&window.HOUSE&&HOUSE.built()){const R=HOUSE.rec();if(!R.own.p_fish){R.own.p_fish=1;if(!R.put.pet&&R.lv>=2)R.put.pet='p_fish';extra='<small>浜辺の 家に 金魚ばちが ふえたよ</small>'}}
    save();try{RECENT.add('fest',{kind:'stall',id:s.id,ja:s.n,ico:s.ico})}catch(e){}
    $('fsres').innerHTML=`<div class="lsay kth"><span class="lface kf">${s.who}</span><div class="lbody"><p class="ken">${esc(a[0])}</p><small class="kja on">${esc(a[1])}</small></div></div>
      <p class="kpay">${s.sv.ico} <b>${esc(s.sv.n)}</b>（${esc(s.sv.en)}）を もらった！${extra}</p>
      ${minaBox(ok?'fs_stallOk':'fs_stallNg',{a:s.o.find(x=>x[2])[0]})}
      <div class="row"><button id="fsback" data-back>屋台に もどる</button></div>`;
    say(a[0]);$('fsback').onclick=()=>{sf('back');today_()}})}

/* ---------- 🕯️ 灯ろうの ねがい ---------- */
function wish(){const L=H.shuffle(FEST_WISHES.slice()).slice(0,4);
  H.show('fest',`<section class="pnl fs">
    ${top('🕯️ 灯ろうに ねがいを','fsx')}
    <p class="hsen">"Write your wish on the lantern, and let it float out to sea."<small>灯ろうに ねがいを 書いて、 海に 流そう</small></p>
    <p class="note">I hope 〜 = 〜だと いいな（かないそうな こと）／ I wish 〜 = 〜だったら いいのに（むずかしい こと）</p>
    <div class="mcls fsls">${L.map((w,i)=>`<button data-w="${i}"><span>🕯️</span><b>${esc(w[0])}<small>${esc(w[1])}</small></b></button>`).join('')}</div></section>`);
  $('fsx').onclick=()=>{sf('back');today_()};
  H.panel.querySelectorAll('[data-w]').forEach(b=>b.onclick=()=>{const w=L[+b.dataset.w];sf('magic');mark('wish');FS.wish.push(w);if(FS.wish.length>40)FS.wish.shift();save();say(w[0]);
    try{RECENT.add('fest',{kind:'wish',ja:w[1],en:w[0],ico:'🕯️'})}catch(e){}
    talk(FEST_TALKS.find(t=>t.id==='ft_toro'),w[0])})}

/* ================================================================ ミナ先生の セリフ */
Object.assign(MINA_LINES,{
 fs_first:[['smile','お祭りに 寄付すると、 きょう いちにち 浜辺が お祭りに なるんだって。 「donate」は 寄付する'],['happy','花火・夏祭り・灯ろう流し… どれも 英語の 会話つき。 どれに する？']],
 fs_menu:[['smile','きょうは どの お祭りに する？ 「festival」は お祭り、 「fireworks」は 花火'],['happy','寄付の おかげで 浜辺が にぎやかに なるね']],
 fs_start:[['wow','きょうは 「{n}」！ 浜辺に もどると ショーが 見られるよ'],['happy','「{n}」の はじまり！ だれと すごすか えらんでね']],
 fs_today:[['smile','「{n}」、 楽しんでる？ 夜と 昼で 浜辺の ショーが かわるよ'],['happy','お祭りの 英語、 いくつ おぼえた？']],
 fs_talk:[['smile','「{t}」、 いい 時間 だったね'],['happy','お祭りの 会話、 しぜんな 英語 だったよ']],
 fs_talkFun:[['laugh','あはは、 にぎやかな お祭りだね'],['happy','おもしろ エンド！ お祭りは 笑ってなんぼ']],
 fs_stallOk:[['proud','かんぺき！ 屋台でも ちゃんと つたわる 英語だね'],['happy','その 言い方で ばっちり。 お祭りの 英語 マスター！']],
 fs_stallNg:[['think','おしい！ ここは 「{a}」が ぴったりだよ'],['smile','屋台の 人、 やさしかったね。 正解は 「{a}」']],
 r_fest:[['happy','きょうの 「{n}」、 楽しかった？'],['smile','浜辺が お祭りに なってるね。 「{n}」だよ']],
 r_festWish:[['smile','灯ろうに 「{en}」って 書いたんだね。 かなうと いいね'],['happy','「{en}」… すてきな ねがい']],
 x_festIdea:[['smile','コインが {c}まい！ お祭りに 寄付したら、 きょうは 浜辺が お祭りに なるよ'],['think','浜辺の 右の 掲示板、 見た？ 花火大会も ひらけるんだって']],
 x_festToday:[['happy','きょうは 「{n}」の 日！ 浜辺の 掲示板から 会いに 行こう'],['wow','「{n}」、 まだ だれとも すごしてないよ？']]
});
if(window.MINA_SENSE&&MINA_SENSE._rules)MINA_SENSE._rules.push(
 ['x_festIdea',1,F=>!now()&&F.coins>=2500?{c:F.coins.toLocaleString()}:null,()=>['🏮 お祭りの 掲示板',()=>open()]],
 ['x_festToday',3,()=>{const f=now();return f&&f.talks.some(id=>!done(id))?{n:f.n}:null},()=>['🏮 お祭りへ',()=>open()]]);
(window.MINA_REACT_EXT=window.MINA_REACT_EXT||{}).fest={
 act:e=>e.kind==='wish'?['r_festWish',{en:e.en||''}]:e.kind==='give'?['r_fest',{n:e.ja}]:null,
 desc:e=>e.kind==='give'?`「${e.ja}」に 寄付した`:e.kind==='wish'?'灯ろうに ねがいを 書いた':e.kind==='stall'?`屋台で ${e.ja}を した`:'お祭りで すごした'};

window.FEST={open,now,rec:()=>FS,show:showNow};
})();
