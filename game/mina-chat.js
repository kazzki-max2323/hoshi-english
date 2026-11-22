/* ☕ ミナ先生との 長い おしゃべり（分かれ道つき）。 中身は game/mina-chat-data.js（MINA_CHATS）
   - さっきの できごと（RECENT）・空・雨・時間帯・体力に あう おしゃべりを えらぶ。 まだ 話していない ものが 先
   - 入口: ミナ先生の ページの 「☕ おしゃべり」、 ホームで さっきの ことに 反応した あとの ボタン
   - さいごに きょうの フレーズ。 はじめての おしゃべりは なかよし +1
   - 📖 話した おしゃべり（11/22）: えらばれ方は そのまま。 一度 話した ものは ミナ先生の ページの 「ほかも やる」の 中から もう一度 見られる
   声は なし（ミナ先生の 決まり） */
(()=>{
const {S:ST,sfx:SFX}=BEACH;
const H=HE,esc=H.esc,$=id=>document.getElementById(id);
const CH=typeof MINA_CHATS!=='undefined'?MINA_CHATS:[];
const pickL=a=>a[Math.random()*a.length|0];
const MD=()=>{const m=MINA.rec();m.mc=m.mc||{n:{},ph:[]};m.mc.x=m.mc.x||{};m.mc.o=m.mc.o||[];return m.mc};
const ks=k=>Array.isArray(k)?k:[k];
const skyOf=()=>{const g=((ST.gameMin||0)/60)%24;return g>=4.5&&g<6.5?'dawn':g>=6.5&&g<17?'day':g>=17&&g<19.5?'sunset':'night'};
const partOf=()=>{const h=(typeof GH==='function'?GH():new Date().getHours());return h>=5&&h<10?'morning':h<16?'noon':h<19?'evening':'night'};
/* できごとの 名前（{x} に 入る） */
function xOf(e){if(!e)return '';try{switch(e.k){case 'meal':case 'snack':return e.ja;case 'gift':return e.toN||'だれか';
  case 'kaiwa':return KAIWA.chars[e.c].n;case 'mio':return 'ミオちゃん';case 'tokkun':return e.g?'「'+e.g+'」の とっくん':'とっくん';
  case 'deep':return e.g?'「'+e.g+'」の とことん授業':'とことん授業';case 'sensei':return '英語の 会話'}}catch(er){}return ''}
/* いま 話せる おしゃべり: [chat, できごと] */
function fits(){const out=[],R=window.RECENT;let hpLow=false,rain=0;try{hpLow=FOOD.hp()/FOOD.MAX<=.35}catch(e){}try{rain=RECENT.now().rain|0}catch(e){}
  CH.forEach(c=>{const w=c.when||{};let e=null,ok=true;
    if(w.k){e=R&&R.last(ks(w.k),40*60000);ok=!!e}
    if(w.sky&&skyOf()!==w.sky)ok=false;if(w.part&&partOf()!==w.part)ok=false;if(w.rain&&!rain)ok=false;if(w.hpLow&&!hpLow)ok=false;
    if(ok)out.push([c,e,Object.keys(w).length?2:1])});return out}
/* いちばん いい 1つ（場面に あう もの・まだ 話してない もの を 先に）。 なければ null */
function best(){const f=fits(),N=MD().n;if(!f.length)return null;
  const sc=([c,,w])=>w*3-(N[c.id]||0)*2+Math.random();return f.sort((a,b)=>sc(b)-sc(a))[0]}
const avail=()=>!!best();
/* さっきの できごと e に あう おしゃべりの id（ホームの 反応の あとに つかう） */
function forEvent(e){const c=CH.find(c=>c.when&&c.when.k&&ks(c.when.k).includes(e.k));return c&&!(MD().n[c.id]>=2)?c.id:null}

/* ---------- 画面 ---------- */
let P=null;const live=()=>P&&$('mclog');
function scroll(){const l=$('mclog');if(l)l.scrollTo({top:l.scrollHeight,behavior:'smooth'})}
function mina(ex,t){if(!live())return;const d=document.createElement('div');d.className='lsay by-m mcm';
  d.innerHTML=`<span class="lface">${MINA.face('m',ex,MINA.poseFor(ex,t))}</span><div class="lbody"><p>${esc(t)}</p></div>`;$('mclog').appendChild(d);scroll();try{SFX.pop()}catch(e){}}
function you(t){if(!live())return;const d=document.createElement('div');d.className='lsay by-h kyou-b';
  d.innerHTML=`<span class="lface kf you">⭐</span><div class="lbody"><p>${esc(t)}</p></div>`;$('mclog').appendChild(d);scroll()}
const fx=t=>String(t).replace(/\{x\}/g,P&&P.x?P.x:'さっきの こと');
function node(k){if(!live())return;const n=P.c.n[k];if(!n)return end();mina(n.r[0],fx(n.r[1]));
  setTimeout(()=>{if(!live())return;const o=n.o.map((x,i)=>[x,i]).sort(()=>Math.random()-.5);
    $('mcans').innerHTML=`<div class="lopts kopts">${o.map(([x,i])=>`<button data-o="${i}">${esc(fx(x[0]))}</button>`).join('')}</div>`;
    $('mcans').querySelectorAll('[data-o]').forEach(b=>b.onclick=()=>{const x=n.o[+b.dataset.o];$('mcans').innerHTML='';you(fx(x[0]));try{SFX.step()}catch(e){}
      setTimeout(()=>{mina(x[1][0],fx(x[1][1]));setTimeout(()=>x[2]?node(x[2]):end(),Math.max(1400,x[1][1].length*55))},600)});scroll()},700)}
function end(){if(!live())return;const c=P.c,M=MD(),first=!M.n[c.id];M.n[c.id]=(M.n[c.id]||0)+1;
  if(P.x)M.x[c.id]=P.x;M.o=M.o.filter(i=>i!==c.id);M.o.unshift(c.id);
  if(c.ph&&!M.ph.includes(c.ph[0])){M.ph.push(c.ph[0]);if(M.ph.length>60)M.ph.shift()}
  if(first){try{MOTI.gain(1)}catch(e){}}try{H.rest&&H.rest(3000)}catch(e){}try{save()}catch(e){}
  const [ex,tx]=MINA.line(P.again?'mc_again':'mc_end',{t:c.t.replace(/^\S+\s*/,'')});
  $('mcans').innerHTML=`<div class="kres">${c.ph?`<p class="mcph"><small>📝 きょうの フレーズ</small><b>${esc(c.ph[0])}</b><span>${esc(c.ph[1])}</span></p>`:''}
    ${first?'<p class="kendn">❤️ ミナ先生と なかよし +1</p>':''}
    <div class="kmina"><span class="lface">${MINA.face('m',ex,MINA.poseFor(ex,tx))}</span><p>${esc(tx)}</p></div>
    <div class="row">${avail()?'<button id="mcmore" class="sub">☕ もっと 話す</button>':''}${P.again?'<button id="mclist" class="sub">📖 ほかの おしゃべり</button>':''}<button id="mcback">${MICO()} もどる</button></div></div>`;
  try{SFX.done()}catch(e){}scroll();
  const mm=$('mcmore');if(mm)mm.onclick=()=>{SFX.step();open()};$('mcback').onclick=()=>{SFX.back();const b=P.back;P=null;b()};
  const ml=$('mclist');if(ml)ml.onclick=()=>{SFX.book();const b=P.back;P=null;list(b)}}
/* ひらく（id を わたすと その おしゃべり） */
function open(id,back,again){let c=null,e=null;
  if(id){c=CH.find(x=>x.id===id);const w=c&&c.when||{};if(w.k)e=window.RECENT&&RECENT.last(ks(w.k),3*3600e3)}
  else{const b=best();if(b){c=b[0];e=b[1]}}
  if(!c){c=pickL(CH.filter(x=>!x.when||!Object.keys(x.when).length))}if(!c)return;
  back=typeof back==='function'?back:(P&&P.back)||(()=>MINA.open());
  P={c,x:xOf(e)||(again&&MD().x[c.id])||'',back,again:!!again};
  H.show('mchat',`<section class="pnl lsn kw mc" data-stay>
    <div class="qtop"><button class="x" id="mcx" aria-label="もどる">←</button><b>☕ ${esc(c.t)}</b><span class="qn"></span></div>
    <div class="lslog kwlog" id="mclog"></div><div id="mcans" class="kans"></div></section>`);
  $('mcx').onclick=()=>{SFX.back();const b=P.back;P=null;b()};setTimeout(()=>node('s'),300)}

/* ---------- 📖 話した おしゃべり（もう一度 見る） ---------- */
const heard=()=>{const M=MD(),o=M.o.filter(id=>M.n[id]);Object.keys(M.n).forEach(id=>{if(M.n[id]&&!o.includes(id))o.push(id)});return o.map(id=>CH.find(c=>c.id===id)).filter(Boolean)};
/* ミナ先生の ページ（ほかも やる の 中）に 置く たたみ */
function minaBox(){const h=heard();if(!h.length)return '';
  return `<details class="mfold mcfold"><summary>☕ 話した おしゃべり <small>もう一度 見る</small></summary><div class="mcl" id="mcl"></div></details>`}
function rows(h){return h.map(c=>`<button class="mcli" data-mc="${esc(c.id)}">${esc(c.t)}</button>`).join('')}
function minaBind(back){const f=H.panel&&H.panel.querySelector('.mcfold');if(!f)return;let said=false;
  f.ontoggle=()=>{if(!f.open||said)return;said=true;try{SFX.pop()}catch(e){}const h=heard(),[ex,tx]=MINA.line(h.length<3?'mc_listFew':'mc_list',{});
    $('mcl').innerHTML=`<p class="mclm">${MICO()} ${esc(tx)}</p>${rows(h)}`;
    $('mcl').querySelectorAll('[data-mc]').forEach(b=>b.onclick=()=>{SFX.talk();open(b.dataset.mc,back,1)})}}
/* 1まいの 画面（おしゃべりの おわりの 「ほかの おしゃべり」から） */
function list(back){const h=heard(),[ex,tx]=MINA.line('mc_list',{});
  H.show('mchat',`<section class="pnl lsn mc">
    <div class="qtop"><button class="x" id="mcx" aria-label="もどる">←</button><b>☕ 話した おしゃべり</b><span></span></div>
    <div class="kmina"><span class="lface">${MINA.face('m',ex,MINA.poseFor(ex,tx))}</span><p>${esc(tx)}</p></div>
    <div class="mcl">${rows(h)}</div></section>`);
  $('mcx').onclick=()=>{SFX.back();back()};
  H.panel.querySelectorAll('[data-mc]').forEach(b=>b.onclick=()=>{SFX.talk();open(b.dataset.mc,back,1)})}

Object.assign(MINA_LINES,{
 mc_list:[['smile','どれを もう一度 話す？ 気に入った おしゃべり、 何回でも いいよ'],['happy','いままで 話したこと、 ぜんぶ 覚えてるよ。 どれに する？'],['love','また 聞きたいって 言ってもらえるの、 うれしいな']],
 mc_listFew:[['smile','まだ すこし だけど、 話した ことは ここに のこるよ'],['happy','おしゃべりが ふえると、 ここも ふえていくよ']],
 mc_again:[['love','「{t}」、 また 聞いてくれて ありがとう。 先生も この 話 好きなんだ'],['happy','2回目だと、 前より スッと 入ってきた でしょ？'],['smile','何回 話しても いいからね。 気に なったら また どうぞ'],['proud','もう 一度 聞くの、 いい 勉強の しかた だよ']],

 mc_end:[['love','おしゃべり、 楽しかった。 また 話そうね'],['happy','きょうの フレーズ、 だれかに 使ってみてね'],['smile','話してたら 先生も 元気 出たよ。 ありがとう'],
  ['proud','英語の 話も まざって、 いい 時間だったね'],['love','また こうやって ゆっくり 話そう。 See you later!'],['happy','ふふ、 ついつい 話しこんじゃった']],
});
window.MCHAT={open,avail,best,forEvent,rec:MD,chats:CH,list,heard,minaBox,minaBind};
})();
