/* 💑 ミオと デート（コインの 使い道）
   - 入口: 💬 ミオと 話す（game/mio-chat.js）の 「💑 デート」ボタン。 ミオとの 関係が 「なかよし」から
     こいびと（MIOC.rec().lover で ミオを えらばなかった M.alt でない）の ときは 「デート」、 それまでは 「おでかけ」（セリフも 友だちの 形 fr）
   - 🍽️ しおかぜ食堂で ふたりで ごはん（300まい・1日1回）: DATE_DINNER を まだ 見ていない 順に
   - 🚃 遠出（800〜2500まい・何回でも）: DATE_TRIPS。 新しい エンドで ♥（答えの 合計）、 見た エンドは ♥1
   - 🎁 おそろいの 品（400〜2500まい・1つ 1回）: DATE_PAIRS。 浜辺の 家（game/house.js）に かざれる
   - 会話の 画面は mio-chat.js の play を 使う（t.who='date' で ♥ と コインは ここで 決める）
   データは localStorage SAVE_KEY の date = {n, day, dn:{id:回数}, tr:{id:回数}, pairs:{id:日}, last} */
(()=>{
const {S:ST,sfx:SFX}=BEACH;
const H=HE,esc=H.esc,$=id=>document.getElementById(id);
const pickL=a=>a[Math.random()*a.length|0];
const sf=k=>{try{SFX[k]&&SFX[k]()}catch(e){}};
const today=()=>{const d=new Date();return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate()};
const DINNER_P=300;

const D=(()=>{try{const s=JSON.parse(localStorage.getItem(SAVE_KEY)||'{}').date;if(s&&s.dn)return s}catch(e){}return {n:0,day:'',dn:{},tr:{},pairs:{},last:''}})();
_saveHooks.push(()=>{const s=JSON.parse(localStorage.getItem(SAVE_KEY)||'{}');s.date=D;localStorage.setItem(SAVE_KEY,JSON.stringify(s))});

const MR=()=>{try{return MIOC.rec()}catch(e){return {}}};
const stage=()=>{try{return MIOC.stage()}catch(e){return 0}};
/* こいびと？（ミオを えらばなかった ときは 「いちばんの なかま」なので おでかけ） */
const romantic=()=>{const M=MR();return !!(M.lover&&!M.alt)};
const ok=()=>{try{return SHOP.rec().met&&stage()>=2}catch(e){return false}};
const word=()=>romantic()?'デート':'おでかけ';
const minaBox=(k,v)=>{try{const [ex,tx]=MINA.line(k,v||{});return `<div class="kmina"><span class="lface">${MINA.face('m',ex)}</span><p>${tx}</p></div>`}catch(e){return ''}};
const top=(t,id)=>`<div class="qtop"><button class="x" id="${id}" aria-label="もどる">←</button><b>${t}</b><span class="qn">🪙 ${ST.coins.toLocaleString()}</span></div>`;

/* ---------- 会話を mio-chat の 形に（こいびと かどうかで fr を えらぶ） ---------- */
function conv(src,kind,price){const r=romantic(),nodes={};
  Object.keys(src.nodes).forEach(k=>{const n=Object.assign({},src.nodes[k]);if(!r&&n.fr)n.m=n.fr;delete n.fr;
    if(n.o)n.o=n.o.map(o=>{const x=(!r&&o[5])?o[5]:o;return [x[0],x[1],o[2],o[3]||0]});nodes[k]=n});
  return {id:'dt_'+src.id,ico:src.ico,t:src.t||src.n,who:'date',nodes,okL:`${word()}の メニューへ`,
    fin:(n,k,newEnd,pts)=>after(src,kind,n,newEnd,pts,price),
    bind:box=>{const a=box.querySelector('#mcagain');if(a)a.remove()}}}
/* おわった あと: ♥・きろく・ミナ先生 */
function after(src,kind,n,newEnd,pts,price){
  const heart=kind==='pair'?2:newEnd?Math.max(2,pts):1;let hs='';try{hs=MIOC.gain(heart,'talk')}catch(e){}
  D.n++;D.last=kind;if(kind==='dinner'){D.day=today();D.dn[src.id]=(D.dn[src.id]||0)+1}
  if(kind==='trip')D.tr[src.id]=(D.tr[src.id]||0)+1;if(kind==='pair')D.pairs[src.id]=today();save();
  try{RECENT.add('date',{kind,id:src.id,ja:src.t||src.n,ico:src.ico,end:n.end})}catch(e){}
  const mk=kind==='pair'?'dt_pair':kind==='dinner'?'dt_dinner':n.end==='fun'?'dt_tripFun':'dt_trip';
  return `${hs?`<p class="zkheart">${hs}</p>`:''}${kind==='pair'?`<p class="kpay">${src.ico} <b>${esc(src.n)}</b> を 手に 入れた！<small>${window.HOUSE&&HOUSE.built()?'浜辺の 家に かざれるよ':'浜辺に 家を 建てたら かざれるよ'}</small></p>`:''}
    ${minaBox(mk,{n:src.t||src.n,w:word()})}`}

/* ---------- お金を はらって はじめる ---------- */
function pay(p,label,go){if(ST.coins<p){sf('no');H.toast(`🪙 コインが たりないよ <small>${label}は ${p.toLocaleString()}まい（あと ${(p-ST.coins).toLocaleString()}まい）</small>`,3000);return}
  H.show('cg',`<section class="pnl cgp shp mc dt">
    ${top(`💑 ${word()}`,'dtx')}
    <div class="dtpay"><p>${label}</p><b>🪙 ${p.toLocaleString()}まい</b><small>のこり ${(ST.coins-p).toLocaleString()}まい</small></div>
    <div class="row"><button id="dtgo">💑 行く</button><button id="dtno" class="sub" data-back>やめる</button></div></section>`);
  $('dtx').onclick=$('dtno').onclick=()=>{sf('back');open()};
  $('dtgo').onclick=()=>{H.addCoins(-p);sf('coin');go()}}
const back=()=>open();
const playIt=(src,kind,p)=>{try{MIOC.play(conv(src,kind,p),back)}catch(e){open()}};

function dinnerNext(){const r=romantic(),L=DATE_DINNER.filter(t=>!t.if||t.if(r));
  return L.slice().sort((a,b)=>(D.dn[a.id]||0)-(D.dn[b.id]||0))[0]}
const dinnerOk=()=>D.day!==today();
const tripOk=t=>t.st<=stage()&&(t.st<5||romantic());
const endsOf=t=>Object.keys(t.nodes).filter(k=>t.nodes[k].end);
const gotN=t=>{const E=MR().ends||{};return endsOf(t).filter(k=>E['dt_'+t.id+':'+k]).length};

/* ================================================================ デートの メニュー */
let BACK=null;
function open(back){if(back)BACK=back;if(!ok()){H.toast('💑 ミオと もっと なかよく なると いっしょに 出かけられるよ',2600);return (BACK||H.home)()}
  const r=romantic(),dn=dinnerNext();
  const hi=r?pickL(DATE_HI.lover):pickL(DATE_HI.friend);
  const trips=DATE_TRIPS.map(t=>tripOk(t)?`<button data-tr="${t.id}"><span>${t.ico}</span><b>${esc(t.t)}<small>${esc(t.d)}</small></b><i>🪙${t.p.toLocaleString()}<br>${gotN(t)}/${endsOf(t).length}</i></button>`:`<button disabled><span>？</span><b>？？？<small>もっと なかよく なると…</small></b><i></i></button>`).join('');
  const pairs=DATE_PAIRS.map(p=>D.pairs[p.id]?`<button disabled class="dtown"><span>${p.ico}</span><b>${esc(p.n)}<small>✓ もってる</small></b><i></i></button>`:`<button data-pr="${p.id}"><span>${p.ico}</span><b>${esc(p.n)}<small>${esc(p.en)}</small></b><i>🪙${p.p.toLocaleString()}</i></button>`).join('');
  const own=DATE_PAIRS.filter(p=>D.pairs[p.id]).length;
  H.show('cg',`<section class="pnl cgp shp mc dt">
    ${top(`💑 ミオと ${word()}`,'dtx')}
    <div class="cgnagi shm"><span class="cgnf cgm">${MIO.face(r?'wink':'laugh',r?'peace':'wave')}</span><div class="cgnb"><b>ミオ</b><p class="en">${esc(hi[0])}</p><p class="ja">${esc(hi[1])}</p></div></div>
    <button id="dtdin" class="mcstudy dtdin" ${dinnerOk()?'':'disabled'}><span>🍽️</span><b>しおかぜ食堂で ふたりで ごはん<small>${dinnerOk()?`「${esc(dn.t)}」・🪙${DINNER_P}まい（2人分）`:'きょうは もう 行ったよ。 また あした'}</small></b>${dinnerOk()?'<i class="dot"></i>':''}</button>
    <p class="mchd">🚃 遠出 <small>お金を はらえば 何回でも。 答えで エンドが かわる</small></p>
    <div class="mcls dtls">${trips}</div>
    <details class="shmore"${own<DATE_PAIRS.length&&own<2?' open':''}><summary>🎁 雑貨屋で おそろいの 品 <small>${own}/${DATE_PAIRS.length}</small></summary><div class="mcls dtls">${pairs}</div></details>
    ${D.n?`<details class="shmore"><summary>💞 ${word()}の 思い出 ${D.n}回</summary><div class="dtmem">${memo()}</div></details>`:''}
  </section>`);
  $('dtx').onclick=()=>{sf('back');(BACK||H.home)()};
  $('dtdin').onclick=()=>{if(!dinnerOk())return;sf('step');pay(DINNER_P,`🍽️ しおかぜ食堂で ふたりで ごはん「${esc(dn.t)}」`,()=>playIt(dn,'dinner',DINNER_P))};
  H.panel.querySelectorAll('[data-tr]').forEach(b=>b.onclick=()=>{const t=DATE_TRIPS.find(x=>x.id===b.dataset.tr);sf('step');pay(t.p,`${t.ico} ${esc(t.t)}へ ${word()}`,()=>playIt(t,'trip',t.p))});
  H.panel.querySelectorAll('[data-pr]').forEach(b=>b.onclick=()=>{const p=DATE_PAIRS.find(x=>x.id===b.dataset.pr);sf('step');pay(p.p,`🏚️ 雑貨屋で ${p.ico} ${esc(p.n)}（2つ）を 買う`,()=>playIt(p,'pair',p.p))});
  H.panel.querySelector('.shm .cgnb').onclick=e=>{const j=e.currentTarget.querySelector('.ja');j.hidden=!j.hidden;try{MIO.say(hi[0])}catch(er){}};
  try{MIO.say(hi[0])}catch(e){}}
function memo(){const E=MR().ends||{},row=(t,kind)=>{const n=kind==='trip'?D.tr[t.id]:D.dn[t.id];if(!n)return '';return `<span>${t.ico} ${esc(t.t)} <small>${n}回・エンド ${gotN(t)}/${endsOf(t).length}</small></span>`};
  return DATE_TRIPS.map(t=>row(t,'trip')).concat(DATE_DINNER.map(t=>row(t,'dinner'))).filter(Boolean).join('')||'<span>まだ ないよ</span>'}

/* ---------- ミオの ページに 出す ボタン（game/mio-chat.js） ---------- */
function btn(){if(!ok())return '';const r=romantic();
  return `<button id="dtbtn" class="mcstudy dtbtn"><span>${r?'💑':'🚶'}</span><b>ミオと ${word()}<small>食堂で ごはん・遠出・おそろいの 品（コインを つかう）</small></b>${dinnerOk()?'<i class="dot"></i>':''}</button>`}
function bind(back){const b=$('dtbtn');if(b)b.onclick=()=>{sf('step');open(back)}}

/* ---------- ミオの あいさつ ---------- */
const DATE_HI={
 lover:[["Where should we go today? Anywhere is fine… as long as it's with you.","きょうは どこに 行く？ どこでも いいよ… 店長と いっしょ なら。"],
  ["A date? Yes! Wait, let me fix my hair first!","デート？ 行く！ まって、 先に 髪 なおさせて！"],
  ["I put on my favorite dress today. … Just in case you asked me out. Ha ha.","きょう、 お気に入りの 服 着てきたの。 … さそって くれる かもって 思って。 あはは。"],
  ["Boss, today you choose. I'll follow you anywhere!","店長、 きょうは 店長が きめて。 どこでも ついていく！"]],
 friend:[["Day off? Let's go somewhere! I need a break from cards. Ha ha.","休み？ どこか 行きましょう！ カードから ちょっと はなれたい。 あはは。"],
  ["Boss, are you free today? I heard about a fun place!","店長、 きょう ひま ですか？ 楽しい ところ 聞いたんです！"],
  ["Team outing! Where should we go? Your treat, right? Ha ha, just kidding… or not!","チームで おでかけ！ どこ 行きます？ 店長の おごり ですよね？ あはは、 じょうだん… かも！"]]};

/* ================================================================ ミナ先生の セリフ */
Object.assign(MINA_LINES,{
 dt_dinner:[['happy','「{n}」、 楽しそう だったね。 お店で 「A table for two, please.」が 言えれば もう だいじょうぶ'],['smile','ごはんの 英語は 毎日 つかえるよ。 「Want to share?」 「It\'s delicious!」 おぼえておいてね'],['wink','マルコさんの お店で {w}… ふふ、 いいなあ。 英語も ごちそうさま']],
 dt_trip:[['happy','「{n}」に {w}だったね。 出かけた 先の 英語は いちばん おぼえやすいよ'],['wow','すてきな {w}！ ミオさんの 英語、 どんどん しぜんに なってるね'],['smile','思い出と いっしょに おぼえた 英語は わすれないよ。 きょうの 英語を ひとつ、 声に 出して みよう']],
 dt_tripFun:[['laugh','あはは、 にぎやかな {w}だったね。 わらった ときの 英語も 大事な 英語だよ'],['happy','おもしろ エンド！ べつの 答えだと どうなるかな']],
 dt_pair:[['smile','「{n}」、 おそろい なんだね。 英語では matching って 言うよ'],['happy','おそろいの 品… ふふ。 「We match!」って 言うと かわいいよ'],['wink','ノラさんの お店の おそろい、 いいね。 だいじに してね']],
 r_date:[['smile','さっき ミオさんと {n}に 行ったんだね。 どうだった？'],['happy','{n}、 楽しかった？ 英語で 話した こと、 おぼえてる？'],['wink','ミオさんと {n}… ふふ、 いい 顔 してる']],
 x_dateIdea:[['smile','コインが たまってるね。 ミオさんを {w}に さそって みたら？ 英語の 会話も できるよ'],['happy','ミオさんと 食堂で ごはん なんて どう？ 「A table for two, please.」の 練習に なるよ']],
 x_datePair:[['smile','ミオさんとの 「{n}」、 だいじに してる？ おそろいは matching だよ'],['happy','{c}この おそろい！ ミオさんと なかよし だね']]
});
if(window.MINA_SENSE&&MINA_SENSE._rules)MINA_SENSE._rules.push(
 ['x_dateIdea',1,F=>ok()&&F.coins>=1000&&dinnerOk()?{w:word()}:null,()=>[`💑 ミオと ${word()}`,()=>open(()=>MINA.open())]],
 ['x_datePair',1,()=>{const L=DATE_PAIRS.filter(p=>D.pairs[p.id]);return L.length?{n:pickL(L).n,c:L.length}:null},null]);
(window.MINA_REACT_EXT=window.MINA_REACT_EXT||{}).date={act:e=>['r_date',{n:e.ja||word()}],desc:e=>`ミオと ${e.ja||'おでかけ'}に 行った`};

window.DATE={open,btn,bind,romantic,word,rec:()=>D,pairs:()=>DATE_PAIRS.filter(p=>D.pairs[p.id])};
})();
