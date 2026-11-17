/* 💬 ミオと 話す: 会話の 画面・なかよし度（♥）・関係の 段階（会話の 中身は game/mio-talk.js）
   - 話せる 会話は 段階で ふえる。 まだの 段階の 名前は 「？？？」で かくす
   - ♥ は 会話の 答え・プレゼント（game/gift.js）・カウンターの 英語（1日3回まで）で 上がる。 下がる ことは ない
   - 会話は 新しい エンドで ♥（答えの 合計）と コイン。 同じ エンドは 1日1回だけ ♥1
   - 「気になる ふたり」の 会話で 気持ちに こたえると 「こいびと」（？？？）に なる
   データは SHOP.rec().mio = {h,lover,ends,n,day,cday,cn} */
(()=>{
const {S:ST,sfx:SFX}=BEACH;
const H=HE,esc=H.esc,$=id=>document.getElementById(id);
const pickL=a=>a[Math.random()*a.length|0];
const sf=k=>{try{SFX[k]&&SFX[k]()}catch(e){}};
const today=()=>{try{return CG.today()}catch(e){return new Date().toDateString()}};
const save=()=>{try{CG.save()}catch(e){}};
const speak=en=>{try{C&&C.t&&C.t.who==='mina'?WED.say(en):MIO.say(en)}catch(e){}};
const MR=()=>{const S=SHOP.rec();return S.mio||(S.mio={h:0,lover:0,ends:{},n:{},day:{},cday:'',cn:0})};
const POSE={wave:'wave',peace:'peace',thumb:'thumb',guts:'guts',point:'thumb',there:'wave',look:'wave',pencil:'peace'};
const face=(ex,p)=>C&&C.t&&C.t.who==='mina'?MINA.face('m',ex||'smile',p||undefined):MIO.face(ex||'smile',POSE[p]||'');

/* ================================================================ 段階 */
function stage(){const M=MR();if(M.lover)return 5;let s=0;for(let i=0;i<5;i++)if(M.h>=MIO_STG[i].need)s=i;return s}
function up(a){const g=MIO_STG[a];setTimeout(()=>{
  if(a===5){try{SFX.fanfare(3)}catch(e){}try{[0,500,1000].forEach(t=>setTimeout(()=>FX.firework(innerWidth*(.2+Math.random()*.6),innerHeight*.25),t))}catch(e){}}else sf('done');
  H.toast(`${g.ico} ミオとの 関係が 「<b>${esc(g.n)}</b>」に なった！`,4200)},900)}
/* ♥ を ふやす（why: 'gift' / 'ctr' / 'talk'）。 ふえた ときの ことばを かえす */
function gain(n,why){if(!(n>0))return '';const M=MR(),b=stage();
  if(why==='ctr'){const d=today();if(M.cday!==d){M.cday=d;M.cn=0}if(M.cn>=3)return '';M.cn++}
  M.h+=n;save();const a=stage();if(a>b)up(a);
  return `🙋‍♀️ ミオと なかよし ${'♥'.repeat(Math.min(n,6))}`}
function setLover(){const M=MR();if(M.lover)return;M.lover=1;save();up(5)}

/* ================================================================ 会話の リスト */
const ifOk=t=>{try{return !t.if||t.if(MR())}catch(e){return false}};
const open_=()=>MIO_TALKS.filter(t=>t.st<=stage()&&ifOk(t));
const endsOf=t=>Object.keys(t.nodes).filter(k=>t.nodes[k].end);
const gotN=t=>endsOf(t).filter(k=>MR().ends[t.id+':'+k]).length;
const isNew=t=>!MR().n[t.id];
const newN=()=>{try{return SHOP.rec().met?open_().filter(isNew).length:0}catch(e){return 0}};
const minaBox=(k,v)=>{try{const [ex,tx]=MINA.line(k,v||{});return `<div class="kmina"><span class="lface">${MINA.face('m',ex)}</span><p>${tx}</p></div>`}catch(e){return ''}};
const top=(t,right,id)=>`<div class="qtop"><button class="x" id="${id}" aria-label="もどる">←</button><b>${t}</b><span class="qn">${right}</span></div>`;

function open(back){back=back||SHOP.open;hush();const M=MR(),s=stage(),g=MIO_STG[s],L=open_();
  const nx=s<4?MIO_STG[s+1]:null,base=g.need===999?0:g.need,pct=nx?Math.min(100,Math.round((M.h-base)/(nx.need-base)*100)):100;
  const hi=(window.MIOL&&MIOL.hi())||MIO_CHAT_HI[s],hd=window.MIOL&&MIOL.head();
  const lock=MIO_TALKS.filter(t=>t.st>s&&t.st<5&&ifOk(t)).length;
  const cc=window.MIOL?MIOL.chap():-1,cur=t=>t.c!=null&&t.c===cc||t.top;
  const now=(L.length>8?L.filter(t=>isNew(t)||gotN(t)<endsOf(t).length||cur(t)):L).slice().sort((a,b)=>(cur(b)?1:0)-(cur(a)?1:0)),old=L.filter(t=>!now.includes(t));
  const li=t=>{const e=endsOf(t).length,n=gotN(t);return `<button data-k="${t.id}"><span>${t.ico}</span><b>${esc(t.t)}</b><i>${n>=e?'★':`${n}/${e}`}</i>${isNew(t)?'<u>NEW</u>':''}</button>`};
  H.show('cg',`<section class="pnl cgp shp mc">
    ${top('💬 ミオと 話す',`♥ ${M.h}`,'mcx')}
    <div class="cgnagi shm"><span class="cgnf cgm">${face(s>=4?'wink':'laugh',s>=5?'peace':'wave')}</span><div class="cgnb"><b>ミオ</b><p class="en">${esc(hi[0])}</p><p class="ja">${esc(hi[1])}</p></div></div>
    ${hd?`<div class="mcst"><span>${hd.ico}</span><div><b>${esc(hd.n)}</b><small>${hd.hint?esc(hd.hint):'💞'}</small></div></div>`:`<div class="mcst"><span>${g.ico}</span><div><b>${esc(g.n)}</b>${nx?`<span class="mcbar"><b style="width:${pct}%"></b></span><small>つぎ ？？？</small>`:s===4?'<small>つぎは… ？？？</small>':'<small>💞</small>'}</div></div>`}
    ${window.MIOL?MIOL.block():''}
    ${window.MIOS?`<button id="mcstudy" class="mcstudy"><span>📝</span><b>英語で おしゃべり<small>毎回 ちがう 話・いまの レベルで</small></b>${MIOS.rec().d!==CG.today()?'<i class="dot"></i>':''}</button>`:''}
    <p class="mchd">💬 ミオの 話</p>
    <div class="mcls">${now.map(li).join('')}</div>
    ${old.length?`<details class="shmore"><summary>見おわった 話 ${old.length}</summary><div class="mcls">${old.map(li).join('')}</div></details>`:''}
    ${lock?`<p class="note">♥ が ふえると 話せる ことが ふえるよ（あと ${lock}こ）</p>`:''}
    <details class="shmore"><summary>ふたりの 関係</summary><div class="mcstg">${MIO_STG.slice(0,5).concat(window.MIO_CH&&MR().lover?(MR().alt?[MIO_ALT]:MIO_CH.slice(0,(MR().c||0)+1)):[MIO_STG[5]]).map((x,i)=>i<=s||i>5||MR().alt?`<span class="on">${x.ico} ${esc(x.n)}</span>`:'<span>？ ？？？</span>').join('')}${MR().lover&&!MR().alt&&window.MIO_CH&&(MR().c||0)<5?'<span>？ ？？？</span>':''}</div></details>
    <div class="row"><button id="mcgift" class="sub">🎁 プレゼント</button>${window.MIOS&&Object.keys(MIOS.rec().ok).length?'<button id="mcbook" class="sub">📒 まなんだ こと</button>':''}${(window.GIFT&&GIFT.rec().n)?'<button id="mcnote" class="sub">📔 好きな物ノート</button>':''}</div>
  </section>`);
  $('mcx').onclick=()=>{sf('back');hush();back()};
  H.panel.querySelector('.shm .cgnb').onclick=e=>{const j=e.currentTarget.querySelector('.ja');j.hidden=!j.hidden;speak(hi[0])};
  H.panel.querySelectorAll('[data-k]').forEach(b=>b.onclick=()=>{sf('step');const t=MIO_TALKS.find(t=>t.id===b.dataset.k);t.pre?t.pre(()=>play(t,back),()=>open(back)):play(t,back)});
  if(window.MIOL)MIOL.bind(back);
  $('mcgift').onclick=()=>{sf('step');GIFT.pick({to:'mio',back:()=>open(back)})};
  const st=$('mcstudy');if(st)st.onclick=()=>{sf('step');MIOS.start(()=>open(back))};
  const bk=$('mcbook');if(bk)bk.onclick=()=>{sf('book');MIOS.book(()=>open(back))};
  const nb=$('mcnote');if(nb)nb.onclick=()=>{sf('book');GIFT.note(()=>open(back))};
  speak(hi[0])}

/* ================================================================ 会話 */
let C=null;
const live=()=>C&&$('mclog');
const hush=()=>{try{speechSynthesis.cancel()}catch(e){}};
const jaOn=()=>{try{return MINA.level()==='es'}catch(e){return true}};
function scrollLog(){const l=$('mclog');if(l)l.scrollTo({top:l.scrollHeight,behavior:'smooth'})}
function them(n){if(!live())return;const [en,ja]=n.m,on=jaOn(),d=document.createElement('div');
  d.className='lsay kth'+(n.ex==='oops'?' k-oops':n.ex==='laugh'?' k-good':'');
  d.innerHTML=`<span class="lface kf mcf">${face(n.ex,n.p)}</span><div class="lbody"><p class="ken">${esc(en)}<button class="ksay" aria-label="もう一度 きく">🔊</button></p><small class="kja ${on?'on':''}">${esc(ja)}</small>${on?'':'<button class="kjab">訳を 見る</button>'}</div>`;
  $('mclog').appendChild(d);
  if(n.nt&&window.MIOL)d.querySelector('.lbody').insertAdjacentHTML('beforeend',MIOL.noteHTML(n));
  d.querySelector('.ksay').onclick=e=>{e.stopPropagation();speak(en)};
  const jb=d.querySelector('.kjab');if(jb)jb.onclick=()=>{sf('tap');jb.remove();d.querySelector('.kja').classList.add('on');scrollLog()};
  speak(en);scrollLog()}
function you(en){if(!live())return;const d=document.createElement('div');d.className='lsay by-h kyou-b';
  d.innerHTML=`<span class="lface kf you">⭐</span><div class="lbody"><p>${esc(en)}</p></div>`;$('mclog').appendChild(d);scrollLog()}

function play(t,back){if(!t)return open(back);hush();
  C={t,back,pts:0};
  H.show('cg',`<section class="pnl lsn kw zk shp mc" data-stay>
    ${top(`${t.ico} ${esc(t.t)}`,'','mcx')}
    <div class="lslog kwlog" id="mclog"></div>
    <div id="mcans" class="kans"></div>
  </section>`);
  $('mcx').onclick=()=>{sf('back');hush();C=null;t.who?back():open(back)};
  setTimeout(()=>node('s'),300)}
function node(k){if(!live())return;const n=C.t.nodes[k];if(!n)return;
  them(n);$('mcans').innerHTML='';
  if(n.end)return setTimeout(()=>finish(n,k),1400);
  setTimeout(()=>{if(!live())return;const on=jaOn();
    $('mcans').innerHTML=`<div class="lopts kopts">${H.shuffle(n.o.map((o,i)=>[o,i])).map(([o,i])=>`<button data-i="${i}">${esc(o[0])}<small class="mcja" ${on?'':'hidden'}>${esc(o[1])}</small></button>`).join('')}</div>
      ${on?'':'<button class="kjab" id="mcja">答えの 訳を 見る</button>'}`;
    const jb=$('mcja');if(jb)jb.onclick=()=>{sf('tap');jb.remove();$('mcans').querySelectorAll('.mcja').forEach(x=>x.hidden=false)};
    $('mcans').querySelectorAll('[data-i]').forEach(b=>b.onclick=()=>{const o=n.o[+b.dataset.i];sf('tap');$('mcans').innerHTML='';
      C.pts+=o[3]||0;you(o[0]);setTimeout(()=>node(o[2]),700)});
    scrollLog()},700)}

const ENDN={good:['★','いい エンド','g'],ok:['🙂','ふつうの エンド',''],fun:['😂','おもしろ エンド','']};
function finish(n,k){if(!live())return;const M=MR(),t=C.t,ek=t.id+':'+k,newEnd=!M.ends[ek],d=today(),s0=stage();
  M.ends[ek]=1;M.n[t.id]=(M.n[t.id]||0)+1;if(!t.who)try{RECENT.add('mio',{id:t.id,end:k,kind:n.end,how:'talk'})}catch(e){}
  const add=t.who?0:newEnd?Math.max(1,C.pts):M.day[t.id]!==d?1:0;M.day[t.id]=d;
  const heart=gain(add,'talk'),mk2=window.MIOL?MIOL.onEnd(t,n):null;
  if(n.lover)setLover();
  const coins=newEnd?(n.end==='fun'?3:5):0;save();
  const E=ENDN[n.end]||ENDN.ok,all=endsOf(t),got=gotN(t),s=stage();
  let mk=n.lover?'mc_lover':s>s0?'mc_up':['mc_good','mc_ok','mc_fun'][['good','ok','fun'].indexOf(n.end)]||'mc_ok';
  if(t.mk)mk=t.mk;if(Object.keys(M.ends).length===1)mk='mc_first';if(mk2)mk=mk2;
  $('mcans').innerHTML=`<div class="kres">
    <p class="kend ${n.end==='fun'?'fun':'good'}">${E[0]} 「${esc(E[1])}」${newEnd?' <small>NEW!</small>':''}</p>
    ${t.who?'':heart?`<p class="zkheart">${heart}</p>`:'<p class="kendn">きょうの ♥ は もう もらったよ</p>'}
    ${coins?`<p class="kpay">🪙 <b>${coins}まい</b> <small>新しい エンド</small></p>`:''}
    <details class="mfold"><summary>${t.ico} この 会話の エンド <small>${got}/${all.length}</small></summary><div class="kends" style="padding:0 10px 10px">${all.map(e=>{const x=t.nodes[e],N=ENDN[x.end]||ENDN.ok;return M.ends[t.id+':'+e]?`<span class="${N[2]} ${e===k?'now':''}">${N[0]} ${esc(N[1])}</span>`:'<span class="no">？ ？？？</span>'}).join('')}</div></details>
    ${t.who?'':minaBox(mk,{s:MIO_STG[s].n})}
    <div class="row"><button id="mcagain" class="sub">🔁 もう一度</button><button id="mcok" data-back>ほかの 話</button></div>
  </div>`;
  if(coins){const r=$('mcans').getBoundingClientRect();H.coinBurst(r.left+r.width/2,r.top+20,coins)}
  if(!n.lover)n.end==='fun'?sf('pop'):sf('heart');
  const b=C.back;
  $('mcok').onclick=()=>{sf('back');hush();C=null;t.who?b():open(b)};
  $('mcagain').onclick=()=>{sf('step');play(t,b)};
  setTimeout(()=>{const a=$('mcans');if(a)a.scrollIntoView({behavior:'smooth',block:'end'})},100)}

/* ================================================================ ミオの あいさつ（段階ごと） */
const MIO_CHAT_HI=[
 ["Boss! Do you have time to talk? I want to practice my English!","店長！ 話す 時間 ありますか？ 英語の 練習が したいんです！"],
 ["Break time! What should we talk about today, boss?","休けい 時間！ きょうは なにを 話しましょうか、 店長？"],
 ["Hey, boss! I was waiting for you. I have so many things to tell you!","あ、 店長！ 待ってました。 話したい こと いっぱい あるんです！"],
 ["Boss, you're here! Talking with you is the best part of my day.","店長、 来てくれた！ 店長と 話すのが 一日で いちばんの 楽しみです。"],
 ["Oh… boss. Hi. Um… I'm not nervous. Not at all. Ha ha…","あ… 店長。 こんにちは。 えっと… きんちょう してません。 ぜんぜん。 あはは…"],
 ["There you are! I missed you… even though it's only been a day. Ha ha.","来た！ 会いたかったです… 1日 しか たってないのに。 あはは。"]];

/* ================================================================ ミナ先生の セリフ */
Object.assign(MINA_LINES,{
 mc_first:[['happy','ミオさんと 英語で 話せたね！ 答えで 会話が かわるから、 ほかの 答えも ためしてみて'],['smile','はじめての エンド！ 「？？？」の ところは べつの 答えで 見られるよ']],
 mc_good:[['happy','いい 会話だったね。 相手の 話に 「That\'s great!」って かえすと、 会話が はずむよ'],['proud','ミオさん、 うれしそうだったね。 気持ちを 英語で つたえられたね'],['smile','「How about you?」みたいに 聞きかえすと、 もっと なかよく なれるよ']],
 mc_ok:[['smile','ふつうの エンドも 大事な 会話だよ。 べつの 答えも ためしてみよう'],['think','もう少し 相手の 気持ちに よりそう 答えだと、 ちがう エンドに なるかも']],
 mc_fun:[['happy','あはは、 ミオさん 笑ってたね。 じょうだんが 言えるのは 英語が わかってる しょうこだよ'],['think','おもしろ エンド！ でも つぎは ちゃんと した 答えも ためしてね']],
 mc_up:[['wow','ミオさんとの 関係が 「{s}」に なったね！ 話せる ことが ふえたよ'],['happy','「{s}」だって！ 英語で たくさん 話した からだね']],
 mc_lover:[['love','…ふふ、 おめでとう。 気持ちを 英語で つたえるって、 すごく 勇気が いるんだよ'],['happy','「I like you.」…いちばん シンプルで、 いちばん つたわる 英語だね']],
 x_mioTalk:[['smile','カードショップの ミオさん、 話したい ことが あるみたい。 英語で 話してみたら？'],['happy','ミオさんと 新しい 話が できるよ。 {n}こ まってるって']],
 x_mioHeart:[['smile','ミオさんとは 「{s}」なんだね。 ミオさんは あまい ものと かわいい ものが 好きみたい'],['think','ミオさんに プレゼント してみたら？ 「This is for you.」で わたせるよ']]
});
if(window.MINA_SENSE&&MINA_SENSE._rules)MINA_SENSE._rules.push(
 ['x_mioTalk',3,()=>{const n=newN();return n?{n}:null},()=>['💬 ミオと 話す',()=>open()]],
 ['x_mioHeart',1,()=>{try{return SHOP.rec().met&&MR().h>0&&!MR().lover?{s:MIO_STG[stage()].n}:null}catch(e){return null}},()=>['💬 ミオと 話す',()=>open()]]);

H.on('home',()=>{C=null});
window.MIOC={open,play,gain,stage,newN,rec:MR};
})();
