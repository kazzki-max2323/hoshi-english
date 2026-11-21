/* どこでも 英単語を タップ → その 単語の カード（📖くわしく）（11/21 ユーザー「全ての 場面で 単語を タップしたら 単語カードを 開きたい。 戻るボタンで また 元の 画面に 戻れる」）
   - ふつうの 文（ふきだし・説明・例文 など）: 英単語を タップ
   - ボタン（会話の 選択肢 など）: 英単語の 上を 長押し（ふつうに 押すと いつもどおり えらぶ）
   - カードは いまの 画面の 上に 重ねて ひらく（#cardTop.wtcard）。 ←・右下の ←・外側タップ で とじると 下の 画面は そのまま。
     ひらいている 間は 会話の 「読み上げ待ち」（HE.talkBusy）も 止まるので、 会話が 先に 進んで しまわない
   - 活用形（plays / went / been / children / better …）は 原形に よせて さがす。 カードに ない ことばは なにも しない
   - クイズの 答える 前は 答えが わかって しまう ところ（英語→日本語の 問題文・単語の 選択肢）では ひらかない
   ミナ先生の セリフは この ファイルの さいご */
(()=>{
const H=window.HE,C=window.CG;if(!H||!C)return;
const esc=H.esc,$=id=>document.getElementById(id),sf=k=>{try{SFX[k]()}catch(e){}};
const SAVE='hoshi_wtap';
const WT=(()=>{try{return JSON.parse(localStorage.getItem(SAVE)||'{}')}catch(e){return {}}})();
WT.n=WT.n|0;
const save=()=>{try{localStorage.setItem(SAVE,JSON.stringify(WT))}catch(e){}};
const ML=(k,v)=>{try{return MINA.line(k,v||{})}catch(e){return ['smile','']}};

/* ================================================================ ことば → カード */
let ONE=null,PHR=null;
const clean=s=>String(s||'').toLowerCase().replace(/’/g,"'").replace(/[（(][^）)]*[）)]/g,' ').replace(/[~〜]/g,' ').replace(/[.!?]+$/,'').replace(/\s+/g,' ').trim();
function index(){if(ONE)return;ONE=new Map();PHR=new Map();
  const put=(k,id)=>{k=clean(k);if(!k||/[^a-z' \-]/.test(k))return;const M=k.includes(' ')?PHR:ONE;if(!M.has(k))M.set(k,id)};
  /* 単語カード（小→中→高→ハイ の 順。 同じ 語は 低い レベルの カード） */
  (C.W||[]).forEach(c=>String(c.en).split(/[,/]/).forEach(p=>put(p,c.id)));
  /* 宝カード（単語カードに ない ことばだけ） */
  try{(CARDS.book||[]).forEach(t=>String(t.en).split(/[,/]/).forEach(p=>put(p,'t:'+t.e)))}catch(e){}}

/* 形を もどす: 不規則（動詞・名詞・比べる形）と 語尾 */
let REV=null;
function rev(){if(REV)return REV;REV={};
  try{Object.entries(WI.IRR).forEach(([b,[p,pp]])=>[p,pp].forEach(f=>String(f).split('/').forEach(x=>{if(x&&x!==b&&!REV[x])REV[x]=b})))}catch(e){}
  Object.assign(REV,{children:'child',men:'man',women:'woman',people:'person',feet:'foot',teeth:'tooth',geese:'goose',mice:'mouse',
    better:'good',best:'good',worse:'bad',worst:'bad',farther:'far',farthest:'far',further:'far',less:'little',least:'little',more:'many',most:'many',
    is:'be',am:'be',are:'be',was:'be',were:'be',been:'be',being:'be',has:'have',does:'do',an:'a',
    me:'I',my:'I',mine:'I',him:'he',his:'he',her:'she',hers:'she',us:'we',our:'we',ours:'we',them:'they',their:'they',theirs:'they',your:'you',yours:'you',its:'it'});
  return REV}
const CT={"can't":'can',"cannot":'can',"won't":'will',"shan't":'shall',"i'm":'I',"let's":'let'};
function cands(w0){let w=clean(w0).replace(/^['\-]+|['\-]+$/g,'');if(!w)return [];
  const out=[w];if(CT[w])out.push(CT[w]);
  const m=w.match(/^(.+?)(n't|'s|'re|'ll|'ve|'d|'m)$/);if(m){w=m[1];out.push(w)}
  const R=rev();if(R[w])out.push(R[w]);
  const V='aeiou',add=x=>{if(x&&x.length>=2)out.push(x,R[x]||'')};
  const dbl=s=>s.length>=3&&s[s.length-1]===s[s.length-2]&&!V.includes(s[s.length-1])&&!/(ll|ss|ff|zz)$/.test(s)?s.slice(0,-1):'';
  let b;
  if((b=w.match(/^(.+)ies$/)))add(b[1]+'y');
  if((b=w.match(/^(.+)ves$/))){add(b[1]+'f');add(b[1]+'fe')}
  if((b=w.match(/^(.+(?:s|x|z|ch|sh|o))es$/)))add(b[1]);
  if((b=w.match(/^(.+[^s])s$/)))add(b[1]);
  if((b=w.match(/^(.+)ied$/)))add(b[1]+'y');
  if((b=w.match(/^(.+)ed$/))){add(b[1]);add(b[1]+'e');add(dbl(b[1]))}
  if((b=w.match(/^(.+)ing$/))){add(b[1]);add(b[1]+'e');add(dbl(b[1]));if(b[1].endsWith('y'))add(b[1].slice(0,-1)+'ie')}
  if((b=w.match(/^(.+)i(er|est)$/)))add(b[1]+'y');
  if((b=w.match(/^(.+)(er|est)$/))){add(b[1]);add(b[1]+'e');add(dbl(b[1]))}
  if((b=w.match(/^(.+)ily$/)))add(b[1]+'y');
  if((b=w.match(/^(.+)ly$/))){add(b[1]);add(b[1]+'le')}
  if(w.includes('-'))add(w.split('-')[0]);
  return [...new Set(out.filter(Boolean))]}
/* 1語 → カードの id（なければ 前後の ことばと 合わせた 熟語） */
function lookup(w,before,after){index();
  for(const c of cands(w)){const id=ONE.get(c)||ONE.get(c.toLowerCase());if(id&&C.info(id))return id}
  /* 熟語（look at / a lot of など）: 前後 2語まで */
  const ws=[...before.slice(-2),w,...after.slice(0,2)].map(x=>clean(x)),i=Math.min(2,before.length);
  for(let len=4;len>=2;len--)for(let s=Math.max(0,i-len+1);s<=i&&s+len<=ws.length;s++){
    const ph=ws.slice(s,s+len),tries=[ph.join(' ')];cands(ph[0]).forEach(c=>tries.push([c,...ph.slice(1)].join(' ')));
    for(const t of tries){const id=PHR.get(t);if(id&&C.info(id))return id}}
  /* 1語の カードが なく、 その 語で はじまる 熟語だけ ある（look → look at） */
  for(const c of cands(w)){if(FUNC.has(c))continue;let best=null;
    for(const [k,id] of PHR)if(k.startsWith(c+' ')&&C.info(id)&&(!best||k.length<best[0].length))best=[k,id];
    if(best)return best[1]}
  return null}
const FUNC=new Set('a an the be am is are was were been being to of in on at for with by from and or but i you he she it we they my your do does did have has had not no so as if this that'.split(' '));

/* ================================================================ タップした ところの 英単語 */
const WRE=/[A-Za-z]+(?:['’\-][A-Za-z]+)*/g;
const near=(r,x,y,p)=>x>=r.left-p&&x<=r.right+p&&y>=r.top-p&&y<=r.bottom+p;
function wordAt(el,x,y){if(!el)return null;
  const tw=document.createTreeWalker(el,NodeFilter.SHOW_TEXT);let node,cnt=0;
  while((node=tw.nextNode())&&cnt<600){const t=node.data;if(!/[A-Za-z]/.test(t))continue;
    const pe=node.parentElement;if(!pe||pe.closest('script,style,[hidden],[data-notap]'))continue;
    const rg=document.createRange();rg.selectNodeContents(node);const box=rg.getBoundingClientRect();if(!near(box,x,y,4))continue;
    WRE.lastIndex=0;let m;const all=[];while((m=WRE.exec(t)))all.push(m);
    for(let k=0;k<all.length;k++){cnt++;const a=all[k];rg.setStart(node,a.index);rg.setEnd(node,a.index+a[0].length);
      if([...rg.getClientRects()].some(r=>near(r,x,y,3)))return {w:a[0],before:all.slice(Math.max(0,k-2),k).map(z=>z[0]),after:all.slice(k+1,k+3).map(z=>z[0])}}}
  return null}

/* ================================================================ どこで タップしたか */
const OFF='input,textarea,select,[contenteditable],canvas,svg,header,.qtop,.cgc,.cgdvback,.backfab,#cardOv,#cardTop,#ccRain,#cgfx,#toast,#deck,[data-notap],.ab.opt,.ab.line,#ar';
const BTN='button,a,[role="button"],label,summary';
const hasEn=s=>/[A-Za-z]/.test(s);
const answered=bs=>bs.some(b=>b.disabled||/\b(ok|ng|on|sel|picked)\b/.test(b.className));
/* 近くの 選択肢（2つ以上 ならんだ ボタン） */
function choicesNear(el){let a=el;for(let i=0;i<6&&a&&a!==document.body;i++,a=a.parentElement){
    const bs=[...a.querySelectorAll('button')].filter(b=>b.offsetParent&&!b.closest('.qtop,header,.sub')&&!b.classList.contains('sub')&&b.parentElement.querySelectorAll(':scope>button').length>=2);
    if(bs.length>=2)return bs;if(a.matches('#panel,#dpov,section,[id$="Pop"]'))break}return null}
/* 答える 前の クイズで 答えが わかって しまう ところ */
function quizLock(el,isBtn){
  if(isBtn){const bs=[...el.parentElement.querySelectorAll(':scope>button')].filter(b=>!b.classList.contains('sub'));
    if(bs.length<2||answered(bs))return false;
    /* 単語の 選択肢（1〜2語）が ならんでいる = 単語・つづり・文法の 問題 */
    return bs.every(b=>{const t=b.textContent.trim();return hasEn(t)&&t.split(/\s+/).length<=2})}
  const bs=choicesNear(el);if(!bs||answered(bs))return false;
  /* 英語の 問題文に 日本語の 選択肢 = 意味の 問題 */
  return bs.every(b=>!hasEn(b.textContent))}

/* ================================================================ ひらく */
function tip(x,y,tx){const old=document.querySelector('.wttip');if(old)old.remove();
  const d=document.createElement('div');d.className='wttip';d.textContent=tx;document.body.appendChild(d);
  const w=d.offsetWidth;d.style.left=Math.max(8,Math.min(innerWidth-w-8,x-w/2))+'px';d.style.top=Math.max(8,y-52)+'px';
  setTimeout(()=>d.classList.add('go'),1300);setTimeout(()=>d.remove(),1700)}
function open(id,w){sf('card');
  const bk0=/^(es|jh|hs):/.test(id)&&BASIC.has(id);const o=C.detail(id,null,{top:true,from:bk0&&Math.random()<.5?'basic':'wtap'});if(!o)return;o.classList.add('wtcard');
  const bk=document.querySelector('.cgdvback');if(bk)bk.classList.add('wtback');
  WT.n++;WT.last=(C.info(id)||{}).en||w;WT.at=Date.now();save();
  /* はじめての ときは ミナ先生が つかいかたを ひとこと */
  if(!WT.first){WT.first=1;save();setTimeout(()=>{const [,tx]=ML('wt_first');if(tx)H.toast(`👩‍🏫 <b>ミナ先生</b><small>${esc(tx)}</small>`,6000)},1100)}
  else if(WT.n===5||WT.n===30||WT.n===100){setTimeout(()=>{const [,tx]=ML('wt_count',{n:WT.n});if(tx)H.toast(`👩‍🏫 <b>ミナ先生</b><small>${esc(tx)}</small>`,4500)},1100)}}
function tryOpen(el,x,y,isBtn){if(!el||el.closest(OFF))return false;
  const s=getSelection&&getSelection();if(s&&!s.isCollapsed&&String(s).trim())return false;
  const hit=wordAt(isBtn?el.closest(BTN):el,x,y);if(!hit)return false;
  const id=lookup(hit.w,hit.before,hit.after);
  /* カードに ない ことば: 長めの 語だけ 小さく 知らせる（その タップは いつもどおり） */
  if(!id){if(hit.w.length>=4&&!/^[A-Z]/.test(hit.w)||hit.w.length>=4&&isBtn)tip(x,y,`${hit.w} は まだ カードに ない ことば`);return false}
  if(quizLock(isBtn?el.closest(BTN):el,isBtn)){sf('back');tip(x,y,'答えたら しらべられるよ');if(!WT.lockTold){WT.lockTold=1;save();
    setTimeout(()=>{const [,tx]=ML('wt_lock');if(tx)H.toast(`👩‍🏫 <b>ミナ先生</b><small>${esc(tx)}</small>`,4500)},400)}return 'lock'}
  open(id,hit.w);return true}

/* ふつうの 文: タップ */
document.addEventListener('click',e=>{if(!e.isTrusted||e.button>0)return;const t=e.target;if(!(t instanceof Element))return;
  if(t.closest(BTN))return;   // ボタンは 長押し
  if(performance.now()<eatUntil)return;
  const r=tryOpen(t,e.clientX,e.clientY,false);if(r===true){e.preventDefault();e.stopImmediatePropagation()}},true);

/* ボタンの 英語: 長押し（0.45秒）。 そのあとの 「押した」は なかった ことに する */
let lp=null,eatUntil=0;
document.addEventListener('pointerdown',e=>{if(e.button>0)return;const t=e.target instanceof Element?e.target:null;const b=t&&t.closest(BTN);
  if(!b||b.closest(OFF)||!hasEn(b.textContent))return;
  const x=e.clientX,y=e.clientY;clearTimeout(lp&&lp.tm);
  lp={x,y,b,tm:setTimeout(()=>{lp=null;const r=tryOpen(t,x,y,true);if(r===true){eatUntil=performance.now()+900;b.classList.add('wtheld');setTimeout(()=>b.classList.remove('wtheld'),400)}},450)}},true);
const lpStop=()=>{if(lp){clearTimeout(lp.tm);lp=null}};
document.addEventListener('pointermove',e=>{if(lp&&Math.hypot(e.clientX-lp.x,e.clientY-lp.y)>10)lpStop()},true);
['pointerup','pointercancel','scroll'].forEach(k=>document.addEventListener(k,lpStop,true));
document.addEventListener('click',e=>{if(performance.now()<eatUntil&&e.target instanceof Element&&e.target.closest(BTN)){eatUntil=0;e.preventDefault();e.stopImmediatePropagation()}},true);
document.addEventListener('contextmenu',e=>{if(performance.now()<eatUntil||lp)e.preventDefault()},true);

/* 11/21 に 足した 単語（基本の ことばの 本）: ミナ先生の ひとこと 用 */
const BASIC=new Set();try{['es','jh','hs'].forEach(lv=>LEVELS[lv].books.filter(b=>/^きほんの ことば/.test(b.t)).forEach(b=>b.w.forEach(w=>BASIC.add(lv+':'+w[0]))))}catch(e){}
window.WTAP={lookup,cands,rec:()=>WT,open:w=>{const id=lookup(w,[],[]);if(id)open(id,w);return !!id}};

/* ================================================================ ミナ先生の セリフ */
Object.assign(MINA_LINES,{
 wt_first:[['happy','気に なる 英単語は タップすると カードが 開くよ。 ← で もとの 画面に もどれるからね。 ボタンの 英語は 長押しだよ'],
  ['smile','その 調子！ どの 画面でも 英単語を タップで しらべられるの。 えらぶ ボタンの 中の 英語は、 ゆびを 少し 長めに おいてね']],
 wt_count:[['wow','もう {n}回 しらべたね。 気に なったら すぐ しらべる くせ、 英語が のびる 人の くせだよ'],['proud','{n}回 目の 「しらべる」！ わからない ままに しないの、 えらいね']],
 wt_lock:[['smile','クイズの 答えに なる ことばは、 答えた あとで しらべてね。 まちがえても カードで すぐ 確認できるよ'],['think','いまは 問題の 答えが わかっちゃうから、 答えて からね']],
 wt_new:[['wow','お知らせ！ どの 画面でも、 英単語を タップすると その 単語の カードが 開くように なったよ。 ← で もとの 場所に もどれるの'],
  ['happy','会話や 授業で わからない 英単語が あったら、 その 単語を タップしてみて。 えらぶ ボタンの 英語は 長押しだよ']],
 cg_lookFrom_wtap:[['happy','「{w}」、 文の 中で 出会うと 覚えやすいよね。 例文も 声に 出してみよう'],['smile','その 場で しらべるの、 いちばん 身に つくよ。 「{w}」は もう だいじょうぶ？'],
  ['think','「{w}」の 形が かわって いても、 もとの 形の カードが 出るよ。 くらべてみてね']],
 wt_newWords:[['wow','お知らせ！ the・you・is・can みたいな いちばん 基本の ことばと、 浜辺で よく 出てくる ことば、 ぜんぶで 240語の カードが ふえたよ。 単語帳の さいごにも 入ってるの'],
  ['happy','英文の 中の the や is も、 タップすると カードが 開くように なったよ。 使い方の 説明つきだから のぞいてみてね']],
 cg_lookFrom_basic:[['smile','「{w}」みたいな 小さな ことばほど、 よく 使うんだよ。 例文ごと 声に 出してみよう'],['think','「{w}」は 意味より 使い方が だいじな ことば。 ワンポイントも 読んでみてね']],
 x_wtTry:[['smile','会話の 中の 英単語、 タップすると カードが 見られるよ。 試してみて'],['think','知らない 英単語は 飛ばさないで、 タップで しらべてみよう']],
 x_wtLast:[['happy','この前 タップで しらべた 「{w}」、 覚えてる？'],['smile','「{w}」、 しらべた ことばは 次に 出てきた とき 気づけると うれしいよね']]});
if(window.MINA_SENSE&&MINA_SENSE._rules)MINA_SENSE._rules.push(
 ['x_wtTry',1,()=>WT.n<3?{}:null,null],
 ['x_wtLast',2,()=>WT.last&&WT.n>=2?{w:WT.last.split(',')[0]}:null,()=>['📖 カード',()=>WTAP.open(WT.last.split(',')[0])]]);
/* 11/21 足した 単語（levels/basic-add.js）の お知らせも 1回だけ */
setTimeout(function nw(){if(WT.toldWords)return;if(!WT.told)return setTimeout(nw,60000);const m=window.MINA;if(!m||!m.canAnnounce||!m.canAnnounce())return setTimeout(nw,30000);
  WT.toldWords=1;save();const [ex,tx]=ML('wt_newWords');m.say('m',ex,tx,10000)},240000);
/* 新しく できたことを 1回だけ */
setTimeout(function first(){if(WT.told)return;const m=window.MINA;if(!m||!m.canAnnounce||!m.canAnnounce())return setTimeout(first,20000);
  WT.told=1;save();const [ex,tx]=ML('wt_new');m.say('m',ex,tx,10000)},70000);
})();
