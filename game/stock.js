/* 📦 カードショップの 仕入れ（11/18 作りなおし）: コインは 使わない。 勉強すると 📖カードブックに 入っている カードが とどく
   - 仕入れられるのは 📖カードブックに 入っている カードだけ（新しい カードは ⛏️鉱山で ほりだす → ブックに 入れる → 勉強で 仕入れる）
   - その ことばを 勉強すると、 その カードが 1まい 倉庫に とどく（すぐに 在庫に 入る）:
       📗 単語帳で「おぼえた！」・📻 浜辺の 単語クイズで 正解・⛏️ 鉱山の 問題で 正解・📗 単語帳の おしゃべり
   - ことばが きまっていない 勉強（授業・とっくん・とことん授業・ふくしゅう・先生と 会話・文法テスト・リクの 家庭教師・浜辺の 会話）は
     授業に 出てきた ブックの ことば（なければ 在庫が すくない ブックの カード）が とどく
   - ✏️ 仕入れ練習: 仕入れ画面で ブックの カードを えらんで 3問。 2問 正解で 1まい とどく
   - 何まいでも とどく（1日の 上限は 11/18 に なくした）。 とどいた カードは 仕入れ画面の 「📦 とどいた カード」に 出る（見たら 消える。 在庫は そのまま）
   保存は CG.rec().stk = {d:日付, day:{id:きょう とどいた 数}, src:{みなもと:きょうの 数}, nw:{id:まだ 見ていない 数}, all:ぜんぶの 数}
   ミオの セリフは この ファイル、 ミナ先生の セリフも さいご */
(()=>{
const {S:ST,sfx:SFX}=BEACH;
const H=HE,esc=H.esc,$=id=>document.getElementById(id);
const C=CG,pickL=a=>a[Math.random()*a.length|0];
const sf=k=>{try{SFX[k]&&SFX[k]()}catch(e){}};
const ML=(k,v)=>{try{return MINA.line(k,v||{})}catch(e){return ['smile','']}};
const SHOWN=60;
const head1=I=>I.k==='s'?I.en:String(I.en).split(',')[0].trim();
const headOf=e=>String(e||'').split(',')[0].trim().toLowerCase().replace(/[.!?]$/,'');
const SRC={tango:['📗','単語帳'],radio:['📻','浜辺の クイズ'],mine:['⛏️','鉱山'],talk:['💬','単語帳の おしゃべり'],lesson:['👩‍🏫','授業'],tokkun:['💪','苦手とっくん'],
  deep:['🔎','とことん授業'],review:['📝','ふくしゅう'],sensei:['🗣️','先生と 会話'],gram:['📘','文法テスト'],tutor:['🧒','家庭教師'],kaiwa:['🏖️','浜辺の 会話'],drill:['✏️','仕入れ練習'],bat:['🔋','鉱山の ラジオ']};

/* ================================================================ record */
function K(){const r=C.rec();const k=r.stk||(r.stk={d:'',day:{},src:{},nw:{},all:0});const d=C.today();if(k.d!==d){k.d=d;k.day={};k.src={}}if(!k.nw)k.nw={};return k}
const inBook=id=>{try{return !!SHOP.inBook(id)}catch(e){return false}};
const bookIds=()=>{try{return Object.keys(SHOP.bookRec()).filter(inBook)}catch(e){return []}};
const stockOf=id=>{try{return SHOP.stock(id)}catch(e){return C.count(id)}};
const left=id=>1;   // 1日の 上限は なし（11/18 ユーザー決定）。 前の 呼び出しの ため のこす
const newN=()=>Object.values(K().nw).reduce((a,n)=>a+n,0);
const todayN=()=>Object.values(K().day).reduce((a,n)=>a+n,0);
/* ことば → ブックの カード */
function byHead(h){h=headOf(h);if(!h)return [];return bookIds().filter(id=>{const I=C.info(id);return I&&(I.k==='w'||I.k==='t')&&I.h===h})}

/* 1まい とどける。 とどいたら true */
function credit(id,src){if(!id||!inBook(id)||!left(id))return false;const k=K();
  C.give(id);k.day[id]=(k.day[id]||0)+1;const hh=k.h||(k.h={});hh[k.d]=(hh[k.d]||0)+1;{const ks=Object.keys(hh);if(ks.length>14)ks.sort((a,b)=>new Date(a)-new Date(b)).slice(0,ks.length-14).forEach(x=>delete hh[x])}k.src[src]=(k.src[src]||0)+1;k.nw[id]=(k.nw[id]||0)+1;k.all=(k.all||0)+1;C.save();
  try{badge()}catch(e){}return true}
function creditHead(h,src){for(const id of byHead(h))if(credit(id,src))return id;return null}
/* ことばが きまっていない 勉強: 在庫が すくない・苦手・きょう まだ とどいていない カードから */
function pick(n,not=[]){const ids=bookIds().filter(id=>left(id)>0&&!not.includes(id));
  const sc=id=>stockOf(id)*2-(C.weak&&C.weak(id)?3:0)+(K().day[id]||0)*2+Math.random()*3;
  return ids.map(id=>[sc(id),id]).sort((a,b)=>a[0]-b[0]).slice(0,n).map(x=>x[1])}
/* 文の 中の ことば（ブックに ある ものだけ） */
function wordsIn(text,max){const hs=new Set(String(text||'').toLowerCase().match(/[a-z][a-z'-]+/g)||[]),out=[];
  if(!hs.size)return out;const book=bookIds();
  for(const id of H.shuffle(book.slice())){const I=C.info(id);if(I&&(I.k==='w'||I.k==='t')&&hs.has(I.h)&&left(id)>0)out.push(id);if(out.length>=max)break}
  return out}
/* n まい とどける（text の ことばを 先に）。 とどいた id の 配列 */
function creditSome(n,src,text){const got=[];
  wordsIn(text,n).forEach(id=>{if(got.length<n&&credit(id,src))got.push(id)});
  if(got.length<n)pick(n-got.length,got).forEach(id=>{if(credit(id,src))got.push(id)});
  return got}
const names=ids=>ids.map(id=>{const I=C.info(id);return I?head1(I):''}).filter(Boolean);
/* 勉強の あとの 小さな お知らせ（さいごの 画面が 出てから） */
function tell(ids,src){if(!ids.length)return;const s=SRC[src]||['📦',''],w=names(ids);
  setTimeout(()=>H.toast(`📦 カードショップに 入荷 <b>${esc(w[0])}</b>${w.length>1?` ほか ${w.length-1}まい`:''}<small>${s[0]} ${esc(s[1])}で 勉強した ぶん</small>`,3200),1600)}

/* ================================================================ つながり（勉強 → 仕入れ） */
/* 単語帳で「おぼえた！」 */
H.on('learned',(lv,bi,w)=>{try{creditHead(w[0],'tango')}catch(e){}});
/* 浜辺の 単語クイズ（ラジオ・流れてくる 単語）で 正解 */
H.on('answer',(c,ok)=>{try{if(ok&&c&&c.en&&!/\s/.test(String(c.en).split(',')[0].trim()))creditHead(c.en,'radio')}catch(e){}});
/* 鉱山・宝箱の 合言葉など、 カードの 問題で 正解（CG.record） */
let quiet=false;
(()=>{const rec=C.record;C.record=function(id,ok){const r=rec.apply(this,arguments);try{if(ok&&!quiet)credit(id,window.MINE&&MINE.floor&&MINE.floor()?'mine':'drill')}catch(e){}return r}})();
/* 授業: 授業に 出てきた ことば（さいごの 画面に 1行） */
window.LESSON_AFTER=window.LESSON_AFTER||[];
LESSON_AFTER.push((l,info)=>{let txt='';try{txt=JSON.stringify(l)}catch(e){}
  const got=creditSome(info&&info.miss>2?1:2,'lesson',txt);if(!got.length)return null;const w=names(got);
  const [,tx]=ML('stk_lesson',{w:w[0]});
  return {html:`<span class="lstk">📦 入荷 <b>${esc(w.join('・'))}</b><small>${esc(tx)}</small></span>`}});
/* そのほかの 勉強（RECENT の 記録から） */
const AFTER={tokkun:[2],sensei:[2],deep:[2],review:[2],gram:[1],tutor:[2],kaiwa:[1]};
if(window.RECENT&&RECENT.on){
  RECENT.on('*',e=>{try{const a=AFTER[e.k];if(a){if(e.k==='gram'&&!e.ok)return;tell(creditSome(a[0],e.k,(e.en||'')+' '+(e.g||'')+' '+(e.t||'')),e.k);return}
    if(e.k==='tango'&&e.en)creditHead(e.en,'talk')}catch(err){}})}

/* ================================================================ badge（お店の メニューの 仕入れボタン） */
function badge(){const b=document.querySelector('.shpack small');if(b){const n=newN();b.textContent=n?`とどいた ${n}まい`:'勉強で とどく';b.parentElement.classList.toggle('stkhas',n>0)}}

/* ================================================================ Mio */
let jaOn=true;
const say=en=>{try{MIO.say(en)}catch(e){}};
const mio=(L,ex='smile',pose='')=>`<div class="cgnagi shm stkm"><span class="cgnf cgm">${MIO.face(ex,pose)}</span><div class="cgnb"><b>ミオ</b><p class="en">${esc(L[0])}</p><p class="ja" ${jaOn?'':'hidden'}>${esc(L[1])}</p></div></div>`;
function bindMio(root){root.querySelectorAll('.stkm .cgnb').forEach(b=>b.onclick=()=>{jaOn=!jaOn;b.querySelector('.ja').hidden=!jaOn;say(b.querySelector('.en').textContent)})}
const MIO_STK={
 got:[["Boss, a delivery came! These are the words you studied. Thank you for working hard!","店長、 荷物が とどきました！ 店長が 勉強した ことばの カードです。 おつかれさまです！"],
  ["New stock! I can tell you studied today. The boxes smell like effort.","入荷です！ きょう 勉強したの、 わかりますよ。 箱から がんばりの においが します。"],
  ["Look at all these! Every card here is a word you practiced. That's our special shop.","見てください！ ここの カードは ぜんぶ 店長が 練習した ことば。 それが うちの お店の とくべつな ところ。"],
  ["Delivery for the shop! Let's put them on the shelves. Customers will be happy.","お店に 荷物でーす！ たなに ならべましょう。 お客さん、 よろこびますよ。"]],
 none:[["No boxes yet today. When you study a word from the card book, its card comes here!","きょうは まだ 荷物が ないです。 カードブックの ことばを 勉強すると、 その カードが ここに とどきますよ！"],
  ["It's quiet today. Want to try a quick practice? Three questions, and a card arrives.","きょうは しずかですね。 さっと 練習 してみます？ 3問で カードが 1まい とどきます。"],
  ["The delivery truck runs on studying. Funny truck, right?","うちの トラックは 勉強で 走るんです。 おもしろい トラックでしょ？"]],
 nobook:[["Our supplier only sends cards that are in the card book. Let's put some cards in the book first!","うちの 仕入れ先は カードブックに ある カードしか 送ってくれないんです。 まず ブックに カードを 入れましょう！"],
  ["The card book is empty… Dig cards in the mine. They go straight into the book. Then study. That's the route!","カードブックが からっぽ… 鉱山で ほると、 そのまま ブックに 入ります。 あとは 勉強！ それが 仕入れの 道です！"]],
 ok:[["Perfect! One more card is on its way. Thank you, boss!","かんぺき！ カードが 1まい とどきますよ。 ありがとう、 店長！"],["Nice! That's how we stock up here. Study, then sell!","いいですね！ うちの 仕入れは これ。 勉強して、 売る！"]],
 miss:[["So close! Want to try again? The truck is waiting.","おしい！ もう一回 やります？ トラックが 待ってますよ。"],["It's OK, boss. Mistakes are part of the job. One more time!","だいじょうぶ、 店長。 まちがいも しごとの うち。 もう一回！"]],
};

/* ================================================================ 📦 仕入れの 画面 */
let sort='low',shown=SHOWN,back0=null;
function open(back){if(back)back0=back;shown=SHOWN;draw()}
function goBack(){sf('back');const b=back0;back0=null;b?b():SHOP.open()}
function list(){let ids=bookIds();
  if(sort==='weak')ids=ids.filter(id=>C.weak&&C.weak(id));
  return ids.map(id=>[stockOf(id),id]).sort((a,b)=>a[0]-b[0]||(C.info(a[1]).en<C.info(b[1]).en?-1:1)).map(x=>x[1])}
function draw(say0){const k=K(),nw=Object.keys(k.nw).filter(id=>C.info(id)),book=bookIds(),tn=todayN();
  const L=say0||(!book.length?pickL(MIO_STK.nobook):nw.length?pickL(MIO_STK.got):pickL(MIO_STK.none));
  const ids=list(),src=Object.entries(k.src).filter(x=>x[1]>0);
  H.show('cg',`<section class="pnl cgp shp stk">
    <div class="qtop"><button class="x" id="stb" aria-label="もどる">←</button><b>📦 仕入れ</b><span class="qn">${tn?`きょう ${tn}まい`:''}</span></div>
    ${mio(L,nw.length?'laugh':'smile',nw.length?'peace':'')}
    ${nw.length?`<div class="stkin"><p class="stkh">📦 とどいた カード <b>${nw.reduce((a,id)=>a+k.nw[id],0)}</b>まい</p>
      <div class="stkg">${nw.map(id=>`<button class="stkc" data-id="${esc(id)}">${C.face(id,{mini:1,marks:false})}${k.nw[id]>1?`<em>×${k.nw[id]}</em>`:''}</button>`).join('')}</div>
      <div class="row"><button id="stok">✓ 倉庫に しまう</button><button id="stfl" class="sub">🏷️ 売り場へ</button></div></div>`
     :book.length?`<p class="stkempty">📭 まだ とどいていないよ。 ブックの ことばを 勉強すると とどくよ</p>`:''}
    ${graph(k,src)}
    ${book.length?`<div class="stkhd"><b>📖 ブックの カード <small>${book.length}</small></b>
        <span class="stkseg"><button data-s="low" class="${sort==='low'?'on':''}">在庫 すくない順</button><button data-s="weak" class="${sort==='weak'?'on':''}">苦手</button></span></div>
      <p class="stkt">タップすると ✏️ 3問で 1まい 仕入れられるよ</p>
      <div class="stkg stkbk">${ids.slice(0,shown).map(id=>`<button class="stkc" data-b="${esc(id)}">${C.face(id,{mini:1,marks:false})}<em class="${stockOf(id)?'':'zero'}">在庫 ${stockOf(id)}</em></button>`).join('')||'<p class="stkempty">苦手な カードは ないよ</p>'}</div>
      ${ids.length>shown?`<button class="sub" id="stmore">もっと 見る（のこり ${ids.length-shown}）</button>`:''}`
     :`<div class="row">${(()=>{try{return CBOOK.addable().length}catch(e){return 0}})()?'<button class="big" id="stbook">📖 カードブックへ</button>':''}<button class="big" id="stmine">⛏️ 鉱山で ほる</button></div>`}
    <details class="shmore"><summary>仕入れの しくみ</summary>
      <ul class="stkhow"><li>📖 仕入れられるのは カードブックに 入れた カードだけ。 コインは いらない</li>
        <li>📗 単語帳で「おぼえた！」・📻 浜辺の クイズ・⛏️ 鉱山で 正解すると、 その ことばの カードが とどく</li>
        <li>👩‍🏫 授業・💪 とっくん・📘 テスト などの あとは、 出てきた ことばや 在庫が すくない カードが とどく</li>
        <li>✏️ ここで カードを えらんで 3問。 2問 正解で 1まい</li><li>1日の 上限は なし。 勉強した ぶんだけ とどくよ</li><li>新しい カードは ⛏️ 鉱山で ほりだそう（ほった カードは 自動で ブックに 入るよ）</li></ul></details>
  </section>`);
  bindMio(H.panel);say(L[0]);
  $('stb').onclick=goBack;
  const seen=()=>{const k=K();if(!Object.keys(k.nw).length)return;
    const ids=Object.keys(k.nw),n=ids.reduce((a,id)=>a+k.nw[id],0),I=C.info(ids[0]);
    try{RECENT.add('pack',{en:I?head1(I):'',ja:I?I.ja:'',ico:'📦',n,p:'とどいた カード'})}catch(e){}k.nw={};C.save();badge()};
  if($('stok'))$('stok').onclick=()=>{sf('card');seen();H.toast('📦 倉庫に しまったよ<small>売り場に ならべると お客さんが 買っていくよ</small>',2400);draw(pickL(MIO_STK.ok))};
  if($('stfl'))$('stfl').onclick=()=>{sf('step');seen();try{SHOP.floor()}catch(e){SHOP.open()}};
  if($('stbook'))$('stbook').onclick=()=>{sf('step');CBOOK.open(null,null,()=>open())};
  if($('stmine'))$('stmine').onclick=()=>{sf('step');try{MINE.open()}catch(e){SHOP.open()}};
  if($('stmore'))$('stmore').onclick=()=>{sf('tap');shown+=SHOWN;draw(L)};
  H.panel.querySelectorAll('[data-s]').forEach(b=>b.onclick=()=>{sf('tap');sort=b.dataset.s;shown=SHOWN;draw(L)});
  H.panel.querySelectorAll('.stkc[data-id]').forEach(b=>b.onclick=()=>{sf('card');C.detail(b.dataset.id)});
  H.panel.querySelectorAll('.stkc[data-b]').forEach(b=>b.onclick=()=>{sf('card');card(b.dataset.b)});
  if(!C.rec().stkTold){C.rec().stkTold=1;C.save();setTimeout(()=>{const [,tx]=ML('stk_first');if(tx)H.toast(`👩‍🏫 <b>ミナ先生</b><small>${esc(tx)}</small>`,4600)},1200)}}

/* 📊 きょう 勉強して とどいた 数（7日の 棒 ＋ きょうの 内わけ）。 文字は DOM で くっきり */
function graph(k,src){const days=[],now=new Date();
  for(let i=6;i>=0;i--){const d=new Date(now);d.setDate(now.getDate()-i);const key=i?ymd(d):k.d;days.push([key,i?(k.h&&k.h[key])||0:todayN(),i?['日','月','火','水','木','金','土'][d.getDay()]:'きょう'])}
  if(!days.some(x=>x[1])&&!src.length)return '';
  const mx=Math.max(1,...days.map(x=>x[1])),sm=Math.max(1,...src.map(x=>x[1]));
  return `<div class="stkgr"><p class="stkgh">📊 勉強で とどいた カード</p>
    <div class="stkwk">${days.map(([,n,l],i)=>`<div class="${i===6?'td':''}"><b>${n||''}</b><i style="height:${Math.round(n/mx*100)}%"></i><small>${l}</small></div>`).join('')}</div>
    ${src.length?`<div class="stkby">${src.sort((a,b)=>b[1]-a[1]).map(([s0,n])=>`<p><span>${(SRC[s0]||['📦'])[0]} ${esc((SRC[s0]||['','その他'])[1])}</span><i><em style="width:${Math.round(n/sm*100)}%"></em></i><b>${n}</b></p>`).join('')}</div>`:''}</div>`}
const ymd=d=>d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate();   // CG.today() と 同じ 形
/* 1まい えらんだ: ✏️ 3問 / 📖 くわしく */
function card(id){const I=C.info(id);if(!I)return;
  const o=C.ov(`<div class="cgbuy stkov">${C.face(id,{big:1,ja:1})}
    <p class="stkn">在庫 <b>${stockOf(id)}</b>まい</p>
    <button id="stdr" class="big">✏️ 3問で 仕入れる</button>
    <div class="row"><button id="stdt" class="sub">📖 くわしく</button><button id="stx" class="sub">とじる</button></div></div>`,'by');
  $('stx').onclick=()=>{sf('back');C.closeOv()};
  $('stdt').onclick=()=>{sf('card');C.closeOv();C.detail(id,()=>open())};
  if($('stdr'))$('stdr').onclick=()=>{sf('open');drill(id)}}
function drill(id){const I=C.info(id);let i=0,ok=0,last=null;
  const o=C.ov(`<div class="cgbuy stkdr"><p class="stkdh">✏️ 仕入れ練習 <b id="stdn">1 / 3</b></p><div id="stq"></div></div>`,'by');o.dataset.stay=1;
  const nx=()=>{if(i>=3)return end();$('stdn').textContent=`${i+1} / 3`;const q=C.quiz(id,{avoid:last});last=q.t;
    C.ask($('stq'),q,r=>{rec0(id,r.ok);if(r.ok)ok++;i++;nx()},{tag:'📦 仕入れ'})};
  const end=()=>{const got=ok>=2&&credit(id,'drill');const L=pickL(got?MIO_STK.ok:MIO_STK.miss);
    const [ex,tx]=ML(got?'stk_drillOk':'stk_drillMiss',{w:head1(I)});
    o.querySelector('.stkdr').innerHTML=`<p class="stkdh">${got?'📦 入荷！':'✏️ おしい！'} <b>${ok} / 3</b></p>
      ${got?C.face(id,{mini:1,marks:false}):''}${mio(L,got?'laugh':'smile',got?'peace':'')}
      <div class="kmina"><span class="lface">${MINA.face('m',ex)}</span><p>${tx}</p></div>
      <div class="row"><button id="stag">${got?'✏️ もう 1まい':'もう一回'}</button><button id="stend" class="sub">仕入れに もどる</button></div>`;
    bindMio(o);say(L[0]);if(got){sf('done');try{SFX.fanfare(1)}catch(e){}}else sf('step');
    const ag=o.querySelector('#stag');if(ag)ag.onclick=()=>{sf('open');C.closeOv();drill(id)};
    o.querySelector('#stend').onclick=()=>{sf('back');C.closeOv();draw(L)}};
  nx()}
/* 練習の 1問ずつは 仕入れに しない（さいごに まとめて 1まい） */
function rec0(id,ok){quiet=true;try{C.record(id,ok)}finally{quiet=false}}

/* ================================================================ ミナ先生 */
Object.assign(MINA_LINES,{
 stk_new:[['wow','カードショップの 仕入れが かわったよ！ コインは いらなくて、 カードブックの ことばを 勉強すると その カードが とどくの'],['happy','おしらせ！ 単語帳や 授業で 勉強すると、 カードブックの カードが お店に 入荷するように なったよ']],
 stk_first:[['point','📖 ブックに 入れた ことばを 勉強すると、 ここに カードが とどくよ。 1日の 上限は ないから、 勉強した ぶんだけ ふえるの'],['smile','勉強が そのまま お店の 仕入れに なるの。 すてきな お店でしょ']],
 stk_noCap:[['wow','おしらせ！ 仕入れの「1日 3まいまで」が なくなったよ。 勉強した ぶんだけ、 何まいでも お店に とどくの'],['happy','鉱山で ほった カードは 自動で 📖ブックに 入るように なったよ。 あとは 勉強すれば どんどん 入荷！']],
 stk_lesson:[['happy','授業に 出てきた「{w}」の カードが お店に とどいたよ'],['smile','勉強した ぶん、 お店の たなも うまっていくね'],['proud','授業の あとは 入荷の 時間。 ミオさんが よろこぶよ']],
 stk_drillOk:[['proud','「{w}」 3問 クリア！ 仕入れ かんりょう'],['happy','ちゃんと わかってるね。 「{w}」の カード、 倉庫に 入ったよ'],['smile','英語で "in stock"（在庫あり）。 お店の ことばも おぼえちゃおう']],
 stk_drillMiss:[['smile','おしい！ まちがえた ところは 📖 くわしくで 見てから もう一回'],['think','「{w}」、 いみと つづりを 声に 出して 言ってみて。 つぎは いけるよ']],
 x_stkWeek:[['proud','さいきん 勉強して とどいた カード、 {n}まい！ 📦 仕入れの グラフで 見てみて'],['happy','仕入れの 画面の 📊 グラフ、 きょうの 棒が のびてるよ。 勉強した ぶんだけ 高く なるの']],
 x_stkNew:[['happy','カードショップに カードが {n}まい とどいてるよ。 勉強した ことばの カードだね'],['smile','📦 入荷した カード、 売り場に ならべてみたら？']],
 x_stkBook:[['point','カードブックに カードを 入れると、 その ことばを 勉強した ときに お店に 仕入れられるよ'],['think','鉱山で ほった カード、 ブックに 入れてみて。 勉強が 仕入れに なるよ']],
 x_stkDrill:[['smile','仕入れの 画面で カードを えらぶと、 3問で 1まい 仕入れられるよ'],['point','在庫が 0の カードが あるみたい。 ✏️ 仕入れ練習で ふやせるよ']]});
const goStk=()=>['📦 仕入れへ',()=>{SHOP.open();setTimeout(()=>open(),60)}];
if(window.MINA_SENSE&&MINA_SENSE._rules)MINA_SENSE._rules.push(
 ['x_stkNew',3,()=>{try{const n=newN();return SHOP.rec().met&&n>=3?{n}:null}catch(e){return null}},goStk],
 ['x_stkBook',2,()=>{try{return SHOP.rec().met&&!bookIds().length&&CBOOK.addable().length?{}:null}catch(e){return null}},()=>['📖 カードブックへ',()=>{SHOP.open();setTimeout(()=>CBOOK.open(),60)}]],
 ['x_stkWeek',1,()=>{try{const h=K().h||{};const n=Object.values(h).reduce((a,b)=>a+b,0);return SHOP.rec().met&&n>=10?{n}:null}catch(e){return null}},goStk],
 ['x_stkDrill',1,()=>{try{return SHOP.rec().met&&bookIds().some(id=>!stockOf(id)&&left(id))?{}:null}catch(e){return null}},goStk]);
/* 1回だけ: 仕入れが かわった お知らせ */
setTimeout(function first(){const r=C.rec();if(!r.met||r.stkNew)return;const m=window.MINA;if(!m||!m.canAnnounce||!m.canAnnounce())return setTimeout(first,20000);
  r.stkNew=1;r.stkNoCap=1;C.save();const [ex,tx]=ML('stk_new');m.say('m',ex,tx,10000,null,goStk())},16000);
/* 1回だけ: 1日の 上限が なくなった お知らせ（前の しくみを 知っている 人に） */
setTimeout(function noCap(){const r=C.rec();if(!r.met||!r.stkNew||r.stkNoCap)return;const m=window.MINA;if(!m||!m.canAnnounce||!m.canAnnounce())return setTimeout(noCap,20000);
  r.stkNoCap=1;C.save();const [ex,tx]=ML('stk_noCap');m.say('m',ex,tx,10000,null,goStk())},22000);

window.STOCK={open,credit,creditHead,creditSome,newN,todayN,left,bookIds,pick};
})();
