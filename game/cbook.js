/* 📖 カードブック（カードショップ「しおさい」の コレクション）
   - カードごとに 入る ポケットが 決まっている（図鑑のように 番号つき。 まだの ところは 空き）
   - ページは 9ポケット。 🎁おたから（UR・SSR・SR・R・N）と 🔤単語（小・中・高・ハイ）と 🧩📜 で 分かれる
   - 入れた カードは 1まい 倉庫から ブックへ うつる（倉庫の 一覧・しゅるいの 数に 入らない・売り場に 出せない）。 出すと 倉庫に もどって また 売れる。 鉱山の 練習には そのまま つかえる
   - 「ぜんぶ 入れる」: もっていて まだ ブックに ない カードを 1まいずつ（売り場に 出ている 分は 動かさない）
   保存は SHOP.rec().book（{id:1}）。 game/shop.js の inBook / free と いっしょに つかう */
(()=>{
const {sfx:SFX}=BEACH;
const H=HE,esc=H.esc,$=id=>document.getElementById(id);
const C=CG,pickL=a=>a[Math.random()*a.length|0];
const sf=k=>{try{SFX[k]&&SFX[k]()}catch(e){}};
const ML=(k,v)=>{try{return MINA.line(k,v||{})}catch(e){return ['smile','']}};
const PER=9;
const B=()=>SHOP.bookRec(),save=()=>C.save();
const has=id=>!!B()[id]&&C.count(id)>0;

/* ================================================================ sections（ポケットの 順番は いつも 同じ） */
const TRL=r=>{try{return CARDS.book.filter(t=>t.r===r).map(t=>'t:'+t.e)}catch(e){return []}};
const EXL=()=>[...(typeof CG_PARTS!=='undefined'?Object.keys(CG_PARTS).map(k=>'p:'+k):[]),...(C.SENT||[]).map(s=>'s:'+s.i)];
const WL=lv=>C.W.filter(c=>c.lv===lv).map(c=>c.id);
const SEC=[
 {k:'t5',g:'tr',n:'UR',t:'ウルトラレア',l:()=>TRL(5)},
 {k:'t4',g:'tr',n:'SSR',t:'ダブル スーパーレア',l:()=>TRL(4)},
 {k:'t3',g:'tr',n:'SR',t:'スーパーレア',l:()=>TRL(3)},
 {k:'t2',g:'tr',n:'R',t:'レア',l:()=>TRL(2)},
 {k:'t1',g:'tr',n:'N',t:'ノーマル',l:()=>TRL(1)},
 {k:'es',g:'w',n:'小',t:'小学校の 単語',l:()=>WL('es')},
 {k:'jh',g:'w',n:'中',t:'中学校の 単語',l:()=>WL('jh')},
 {k:'hs',g:'w',n:'高',t:'高校の 単語',l:()=>WL('hs')},
 {k:'adv',g:'w',n:'ハイ',t:'ハイレベルの 単語',l:()=>WL('adv')},
 {k:'ex',g:'w',n:'🧩📜',t:'パーツと 文の カード',l:EXL}];
const SK=Object.fromEntries(SEC.map(s=>[s.k,s]));
const memo={};const list=k=>memo[k]&&memo[k].length?memo[k]:(memo[k]=SK[k].l().filter(id=>C.info(id)));
const all=()=>SEC.flatMap(s=>list(s.k));

/* ブックに 入れられる カード（もっていて、 まだ 入っていなくて、 売り場に 出ていない 1まいが ある） */
const canIn=id=>!has(id)&&C.count(id)>0&&SHOP.free(id)>0;
function addable(){let out=[];try{out=SHOP.allCards().filter(id=>C.info(id)&&canIn(id))}catch(e){}return [...new Set(out)]}
function stat(){try{const a=all();return [a.filter(has).length,a.length]}catch(e){return [0,0]}}
/* もう もっていない カードは ブックからも 外す */
function prune(){const b=B();let ch=0;Object.keys(b).forEach(id=>{if(!C.info(id)||C.count(id)<=0){delete b[id];ch=1}});if(ch)save()}

/* ================================================================ Mio */
let jaOn=true;
const say=en=>{try{MIO.say(en)}catch(e){}};
const mio=(L,ex='smile',pose='')=>`<div class="cgnagi shm cbm"><span class="cgnf cgm">${MIO.face(ex,pose)}</span><div class="cgnb"><b>ミオ</b><p class="en">${esc(L[0])}</p><p class="ja" ${jaOn?'':'hidden'}>${esc(L[1])}</p></div></div>`;
function bindMio(root){root.querySelectorAll('.cbm .cgnb').forEach(b=>b.onclick=()=>{jaOn=!jaOn;b.querySelector('.ja').hidden=!jaOn;say(b.querySelector('.en').textContent)})}

/* ================================================================ さがす（英語でも 日本語でも。 カタカナは ひらがなと 同じ あつかい） */
const kata=s=>s.replace(/[ァ-ヶ]/g,c=>String.fromCharCode(c.charCodeAt(0)-0x60));
const norm=s=>kata(String(s||'').normalize('NFKC').toLowerCase()).replace(/[\s〜~・、。,.'’!?！？()（）-]/g,'');
let IDX=null;const WHERE={};
function idx(){if(IDX)return IDX;IDX=[];SEC.forEach(s=>list(s.k).forEach((id,i)=>{const I=C.info(id);WHERE[id]=[s.k,i];IDX.push({id,k:s.k,i,en:norm(I.en),ja:norm(I.ja),t:I.k==='t'})}));return IDX}
const where=id=>{idx();return WHERE[id]};
const label=id=>{const w=where(id);return w?`${SK[w[0]].n} ${w[1]+1}`:''};
function find(q){const n=norm(q);if(!n)return [];const out=[];
  for(const e of idx()){if(e.t&&C.count(e.id)<=0)continue;/* まだ 見ていない 宝カードは ないしょ */
    const r=e.en.startsWith(n)?0:e.en.includes(n)?1:e.ja.startsWith(n)?2:e.ja.includes(n)?3:-1;if(r>=0)out.push([r,e])}
  return out.sort((a,b)=>a[0]-b[0]||a[1].en.length-b[1].en.length).map(x=>x[1].id)}
const nm=I=>I.k==='s'?I.en:I.en.split(',')[0];
const abc=(a,b)=>norm(C.info(a).en).localeCompare(norm(C.info(b).en));
const ord=(a,b)=>{const A=where(a),B=where(b);return SEC.findIndex(s=>s.k===A[0])-SEC.findIndex(s=>s.k===B[0])||A[1]-B[1]};

/* ================================================================ the book */
let cur='t5',pg={},greet=true,flash='',hl='',mode='page',q='',sortAbc=false,cap=60,addSet=new Set();
function pocket(id,i){const no=i+1,cls=`${flash===id?'pop':''} ${hl===id?'hl':''}`;
  if(has(id))return `<div class="cbp in ${cls}" data-id="${esc(id)}">${C.face(id,{mini:1,marks:false})}</div>`;
  const own=C.count(id)>0,ok=own&&SHOP.free(id)>0,I=C.info(id);
  /* まだ もっていない 宝カードは ないしょ。 単語は うすく 書いておく（さがしやすく） */
  const w=I.k==='t'&&!own?'':`<span class="cbw ${I.k==='s'?'s':''}">${esc(nm(I))}${I.k==='w'?`<small>${esc(I.ja.split(/[、，,；;]/)[0])}</small>`:''}</span>`;
  if(!own)return `<div class="cbp none ${cls}" data-id="${esc(id)}"><span class="cbno">${no}</span>${w}</div>`;
  /* もっている カードは 色つきの カードの まま 見せて、 ＋（入れられる）か 🏷️（売り場）の しるしを つける */
  return `<div class="cbp ${ok?'can':'fl'} ${cls}" data-id="${esc(id)}">${C.face(id,{mini:1,marks:false})}<b>${ok?'＋':'🏷️'}</b></div>`}
function pageFull(k,p){const l=list(k).slice(p*PER,p*PER+PER);return l.length&&l.every(has)}
/* その分けの 中で、 いまの ページの つぎに 入れられる カードが ある ページ（なければ 前に もどって さがす） */
function nextCan(k,p){const L=list(k);let f=L.findIndex((id,i)=>i>=(p+1)*PER&&addSet.has(id));if(f<0)f=L.findIndex(id=>addSet.has(id));const np=f<0?-1:Math.floor(f/PER);return np===p?-1:np}
/* 結果や 一覧の 1まい（下の 📍 で その ポケットの ページへ） */
const cell=id=>{const w=where(id);return w?`<div class="cbcell">${pocket(id,w[1])}<button class="cbgo" data-go="${esc(id)}">📍 ${esc(label(id))}</button></div>`:''};

/* そとから 開くとき: 入れられる カードが ある ページから 見せる */
function enter(k,m){prune();addSet=new Set(addable());mode=m||'page';q='';hl='';cap=60;
  if(k&&SK[k])cur=k;else if(!list(cur).some(id=>addSet.has(id))){const s=SEC.find(s=>list(s.k).some(id=>addSet.has(id)))||SEC.find(s=>list(s.k).some(has));if(s)cur=s.k}
  if(!k&&addSet.size&&!list(cur).slice((pg[cur]||0)*PER,(pg[cur]||0)*PER+PER).some(id=>addSet.has(id))){const f=list(cur).findIndex(id=>addSet.has(id));if(f>=0)pg[cur]=Math.floor(f/PER)}
  open()}

function open(k){if(k&&SK[k])cur=k;prune();SHOP.cleanFloor();addSet=new Set(addable());
  const [ag,at]=stat(),inN=all().filter(has).length;
  let line=null;if(greet){greet=false;line=!ag?pickL(CB_MIO.empty):addSet.size>=3?pickL(CB_MIO.many):pickL(CB_MIO.hi)}
  const chip=(m,t,n)=>`<button data-m="${m}" class="${mode===m&&!q?'on':''}">${t}${n!=null?`<b>${n}</b>`:''}</button>`;
  H.show('cg',`<section class="pnl cgp shp cbk">
    <div class="qtop"><button class="x" id="cbx" aria-label="もどる">←</button><b>📖 カードブック</b><span class="qn">${ag}/${at}</span></div>
    ${line?mio(line,pickL(['smile','laugh','wink']),pickL(['wave','','peace'])):''}
    <div class="cbfind"><span>🔍</span><input id="cbq" type="search" enterkeyhint="search" autocomplete="off" placeholder="さがす（apple ／ りんご）" value="${esc(q)}"><button id="cbqx" class="sub" ${q?'':'hidden'} aria-label="けす">✕</button></div>
    <div class="cbmode">${chip('page','📖 ページ')}${chip('can','＋ 入れられる',addSet.size)}${chip('in','✅ 入っている',inN)}</div>
    <div id="cbbody"></div>
    <button id="cball" class="cbin" ${addSet.size?'':'disabled'}>📥 まだの カードを ぜんぶ 入れる${addSet.size?`<b>${addSet.size}</b>`:''}</button>
  </section>`);
  $('cbx').onclick=()=>{sf('back');SHOP.open()};
  bindMio(H.panel);if(line)say(line[0]);
  const qi=$('cbq');let tm=0;
  qi.oninput=()=>{clearTimeout(tm);tm=setTimeout(()=>{q=qi.value.trim();cap=60;$('cbqx').hidden=!q;H.panel.querySelectorAll('.cbmode button').forEach(b=>b.classList.toggle('on',!q&&b.dataset.m===mode));body()},180)};
  qi.onkeydown=e=>{if(e.key==='Enter')qi.blur()};
  $('cbqx').onclick=()=>{q='';qi.value='';sf('back');open()};
  H.panel.querySelectorAll('[data-m]').forEach(b=>b.onclick=()=>{mode=b.dataset.m;q='';cap=60;hl='';sf('tap');open()});
  $('cball').onclick=putAll;
  body()}

/* まんなか（ページ／さがした 結果／一覧） */
function body(){const el=$('cbbody');if(!el)return;
  if(q||mode!=='page'){
    let ids,head,none='';
    if(q){ids=find(q);head=`「${esc(q)}」 ${ids.length}けん`;none=pickL(CB_MIO.noHit)}
    else if(mode==='can'){ids=[...addSet].filter(where);head='＋ タップで 入れる';none=pickL(CB_MIO.noCan)}
    else{ids=all().filter(has);head='✅ ブックの カード';none=pickL(CB_MIO.noIn)}
    if(!q)ids.sort(sortAbc?abc:ord);
    const more=ids.length>cap;
    el.innerHTML=`<div class="cbbind cbls">
      <div class="cbhd"><b>${head}</b>${q?'':`<button class="cbsort sub" id="cbsort">${sortAbc?'🔤 ABC順':'🔢 ばんごう順'}</button>`}</div>
      ${ids.length?`<div class="cbpage cblist">${ids.slice(0,cap).map(cell).join('')}</div>`:mio(none,'think','')}
      ${more?`<button class="cbjump sub" id="cbmore">もっと 見る（あと ${ids.length-cap}）</button>`:''}</div>`;
    if(!ids.length)bindMio(el);
    if($('cbsort'))$('cbsort').onclick=()=>{sortAbc=!sortAbc;sf('tap');body()};
    if($('cbmore'))$('cbmore').onclick=()=>{cap+=60;sf('tap');body()};
    el.querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>{const id=b.dataset.go,was=q;sf('flip');go(id);if(was)mina('sh_bookFound',{w:nm(C.info(id))},.35)});
  }else{
    const L=list(cur),pages=Math.max(1,Math.ceil(L.length/PER));let p=Math.min(pages-1,Math.max(0,pg[cur]||0));pg[cur]=p;
    const shown=L.slice(p*PER,p*PER+PER),got=L.filter(has).length;
    const tab=s=>{const l=list(s.k),g=l.filter(has).length,c=l.filter(id=>addSet.has(id)).length;return `<button data-k="${s.k}" class="cbt ${s.k} ${s.k===cur?'on':''} ${l.length&&g===l.length?'done':''}"><span>${s.n}</span>${c?`<em>${c>99?'99+':c}</em>`:''}<i style="--p:${l.length?Math.round(g/l.length*100):0}%"></i></button>`};
    const jump=nextCan(cur,p);
    el.innerHTML=`<div class="cbtabs"><div><small>🎁</small>${SEC.filter(s=>s.g==='tr').map(tab).join('')}</div><div><small>🔤</small>${SEC.filter(s=>s.g==='w').map(tab).join('')}</div></div>
    <div class="cbbind ${cur}">
      <div class="cbhd"><b>${esc(SK[cur].t)}</b><span>${got}/${L.length}</span></div>
      <div class="cbpage ${pageFull(cur,p)?'full':''}">${shown.map((id,i)=>pocket(id,p*PER+i)).join('')}${Array.from({length:PER-shown.length},()=>'<div class="cbp blank"></div>').join('')}</div>
      ${pages>1?`<div class="cbnav"><button class="sub" data-p="-1" ${p?'':'disabled'}>◀</button><input type="range" id="cbr" min="1" max="${pages}" value="${p+1}" aria-label="ページ"><span id="cbpn">${p+1}/${pages}</span><button class="sub" data-p="1" ${p<pages-1?'':'disabled'}>▶</button></div>`:''}
      ${jump>=0?`<button class="cbjump sub" id="cbj">＋ つぎの 入れられる ページへ</button>`:''}
    </div>`;
    el.querySelectorAll('.cbt').forEach(b=>b.onclick=()=>{sf('tap');hl='';cur=b.dataset.k;
      /* 入れられる カードが ある 分けなら、 そこの ページを 開く */
      const l=list(cur),pp=pg[cur]||0;if(!l.slice(pp*PER,pp*PER+PER).some(id=>addSet.has(id))){const f=l.findIndex(id=>addSet.has(id));if(f>=0)pg[cur]=Math.floor(f/PER)}
      body()});
    el.querySelectorAll('[data-p]').forEach(b=>b.onclick=()=>{pg[cur]=p+ +b.dataset.p;hl='';sf('flip');body()});
    const r=$('cbr');if(r){r.oninput=()=>{$('cbpn').textContent=`${r.value}/${pages}`};r.onchange=()=>{pg[cur]=r.value-1;hl='';sf('flip');body()}}
    if($('cbj'))$('cbj').onclick=()=>{pg[cur]=jump;hl='';sf('flip');body()};
  }
  flash='';
  el.querySelectorAll('.cbp[data-id]').forEach(p=>p.onclick=()=>tap(p.dataset.id,p.classList))}

/* その カードの ポケットが ある ページへ */
function go(id){const w=where(id);if(!w)return;cur=w[0];pg[cur]=Math.floor(w[1]/PER);mode='page';q='';hl=id;open();
  const p=H.panel.querySelector('.cbp.hl');if(p)p.scrollIntoView({block:'center',behavior:'smooth'})}

function tap(id,cl){const I=C.info(id);
  if(cl.contains('in'))return menu(id);
  if(cl.contains('can'))return put(id);
  if(cl.contains('fl')){sf('pop');H.toast('🏷️ 売り場に 出ている カードだよ<small>売り場から 下げると 入れられるよ</small>');return}
  sf('pop');H.toast(`まだ もっていない カード<small>${I.k==='t'?'⛏️ 鉱山の 奥や 💎きらきら宝パックで 見つかるよ':I.k==='w'?'⛏️ 鉱山や 仕入れで 見つかるよ':'仕入れの パックで 出るよ'}</small>`)}

function put(id){if(!canIn(id))return;const w=where(id);B()[id]=1;save();flash=id;sf('card');
  if(mode!=='page'||q){open();H.toast(`📖 ${esc(nm(C.info(id)))} を 入れたよ<small>${esc(SK[w[0]].t)} の ${w[1]+1}ばん</small>`,1800);
    const k=w[0],p=Math.floor(w[1]/PER);if(pageFull(k,p))mina(list(k).every(has)?'sh_bookDone':'sh_bookPage',{t:SK[k].t},.5);return}
  const p=pg[cur]||0,full=pageFull(cur,p),done=list(cur).every(has);open();
  if(full)cheer(done)}
/* 倉庫や パックから 1まい 入れる（入れた 場所を かえす） */
function putOne(id){if(!canIn(id))return '';B()[id]=1;save();return label(id)}
/* ページが うまった！ */
function cheer(done){const el=H.panel.querySelector('.cbpage');if(el){el.classList.add('shine');setTimeout(()=>el.classList.remove('shine'),1600)}
  try{SFX.fanfare(done?2:0)}catch(e){sf('chime')}
  const L=done?pickL(CB_MIO.secDone):pickL(CB_MIO.page);H.toast(done?`🏆 「${esc(SK[cur].t)}」 コンプリート！`:'✨ この ページが うまった！',2600);
  setTimeout(()=>{const m=H.panel.querySelector('.cbm');if(m)m.remove();const b=H.panel.querySelector('.cbfind');if(b){b.insertAdjacentHTML('beforebegin',mio(L,'laugh','guts'));bindMio(H.panel);say(L[0])}},400);
  mina(done?'sh_bookDone':'sh_bookPage',{t:SK[cur].t},.5)}

function menu(id){const away=mode!=='page'||q;
  const o=C.ov(`<div class="cgdv cbmenu">${C.face(id,{big:1,ja:1})}
    <button id="cbout">📤 ブックから 出す</button>${away?`<button id="cbpg" class="sub">📍 ブックの ページを 見る（${esc(label(id))}）</button>`:''}<button id="cbdet" class="sub">🔍 くわしく 見る</button><button id="cbcl" class="sub">とじる</button></div>`,'by');
  sf('flip');
  o.querySelector('#cbout').onclick=()=>{delete B()[id];save();sf('back');C.closeOv();open();H.toast('📤 倉庫に もどしたよ<small>また 売り場に 出せるよ</small>')};
  if(away)o.querySelector('#cbpg').onclick=()=>{sf('flip');C.closeOv();go(id)};
  o.querySelector('#cbdet').onclick=()=>{sf('step');C.closeOv();C.detail(id,()=>open())};
  o.querySelector('#cbcl').onclick=()=>{sf('back');C.closeOv()}}

function putAll(){const ids=addable();if(!ids.length)return;
  const before=new Set(SEC.flatMap(s=>{const l=list(s.k),n=Math.ceil(l.length/PER),f=[];for(let p=0;p<n;p++)if(pageFull(s.k,p))f.push(s.k+p);return f}));
  ids.forEach(id=>{B()[id]=1});save();
  let pages=0,secs=[];SEC.forEach(s=>{const l=list(s.k),n=Math.ceil(l.length/PER);for(let p=0;p<n;p++)if(pageFull(s.k,p)&&!before.has(s.k+p))pages++;if(l.length&&l.every(has)&&ids.some(id=>l.includes(id)))secs.push(s.t)});
  /* いちばん レアな ものから 見せる */
  const rk=id=>{const I=C.info(id);return I.k==='t'?10-I.r:I.k==='w'?20-['es','jh','hs','adv'].indexOf(I.lv):30};
  const top=[...ids].sort((a,b)=>rk(a)-rk(b)).slice(0,7);
  const L=secs.length?pickL(CB_MIO.secDone):pickL(CB_MIO.all);
  sf('card');setTimeout(()=>{try{SFX.fanfare(secs.length?2:1)}catch(e){}},250);
  const o=C.ov(`<div class="cbdone"><p class="cbdh">📥 ${ids.length}まい 入れたよ！</p>
    <div class="cbfan">${top.map((id,i)=>`<div style="--i:${i};--n:${top.length}">${C.face(id,{mini:1,marks:false})}</div>`).join('')}</div>
    ${pages?`<p class="cbdp">✨ うまった ページ ${pages}</p>`:''}${secs.map(t=>`<p class="cbdp">🏆 ${esc(t)} コンプリート！</p>`).join('')}
    ${mio(L,'laugh','guts')}<button id="cbok">やったー！</button></div>`,'by');
  o.dataset.stay=1;bindMio(o);say(L[0]);
  o.querySelector('#cbok').onclick=()=>{sf('step');C.closeOv();open()};
  mina(secs.length?'sh_bookDone':Math.random()<.5?'sh_bookMove':'sh_bookAll',{n:ids.length,t:secs[0]||''},.6)}

function mina(k,v,p){try{if(window.MINA&&MINA.canAnnounce&&MINA.canAnnounce()&&Math.random()<p){const [ex,tx]=ML(k,v);setTimeout(()=>MINA.say('m',ex,tx,6000),1800)}}catch(e){}}

/* ================================================================ lines */
const CB_MIO={
 hi:[["Our card book! Every card has its own pocket.","わたしたちの カードブック！ カードごとに 自分の ポケットが あるんです。"],
  ["I love flipping through the pages. Each one is a little memory.","ページを めくるの、 大好き。 1まい 1まいが 小さな 思い出なんです。"],
  ["Let's fill the empty pockets, boss!","空いてる ポケット、 うめちゃいましょう、 店長！"],
  ["Look! The rare pages are so shiny.","見て！ レアの ページ、 すっごく キラキラ。"],
  ["Tap a card to see it up close. You can say the word out loud, too!","カードを タップすると 近くで 見られます。 声に 出して 言ってみても いいですよ！"],
  ["Looking for a word? Type it in the search box. English or Japanese is OK!","単語を さがしてる？ 🔍に 打ってみて。 英語でも 日本語でも いいですよ！"],
  ["The yellow numbers on the tabs show where new cards can go.","タブの 黄色い 数字は、 入れられる カードが ある ところ。 そこから 見ると 早いですよ。"]],
 noHit:[["Hmm, I can't find that word in the book. Try another spelling?","うーん、 その 単語は ブックに 見つからないです。 つづりを かえて みます？"],["No luck… Maybe try typing just the beginning of the word.","見つからない… 単語の はじめの 何文字かだけ 打つと 出るかも。"]],
 noCan:[["Every card you have is already in the book. Perfect!","もっている カードは ぜんぶ ブックに 入ってます。 かんぺき！"],["Nothing to put in right now. Let's find new cards in the mine!","いまは 入れる カードが ないです。 鉱山で 新しい カードを 見つけましょう！"]],
 noIn:[["The book is still empty. Tap \"+ Can put in\" to start!","ブックは まだ からっぽ。 「＋ 入れられる」から はじめましょう！"]],
 empty:[["It's still empty… but that means we can fill it together!","まだ からっぽ… でも、 これから いっしょに うめられるって ことですね！"],
  ["A brand-new book! Tap the glowing pockets to put cards in.","まっさらな ブック！ 光ってる ポケットを タップして カードを 入れてください。"]],
 many:[["You have some cards that aren't in the book yet. Want to put them all in?","まだ ブックに 入ってない カードが ありますよ。 ぜんぶ 入れちゃいます？"],
  ["Oh, new cards! The pockets are waiting for them.","あ、 新しい カード！ ポケットが 待ってますよ。"]],
 page:[["Yay! This page is complete!","やったー！ この ページ、 コンプリート！"],["A full page! It looks so neat.","ページが うまった！ すっごく きれい。"],["Nine cards in a row… perfect!","9まい そろった… かんぺき！"]],
 secDone:[["No way… You completed the whole section! Amazing!","うそ… ぜんぶ そろっちゃった！ すごすぎます！"],["Complete! I'm going to show this to all the customers!","コンプリート！ お客さん みんなに 見せちゃおう！"]],
 all:[["All in! The book got heavier.","ぜんぶ 入りました！ ブックが ずっしり。"],
  ["All in! The storeroom looks so tidy now. Only the extras are left.","ぜんぶ 入りました！ 倉庫が すっきり。 のこってるのは あまりの カードだけです。"],["Wow, so many new cards! Let's look at them later.","わあ、 新しい カードが いっぱい！ あとで ゆっくり 見ましょう。"],["Done! Each pocket has its card now.","できた！ どの カードも 自分の ポケットに おさまりました。"]]};

Object.assign(MINA_LINES,{
 sh_bookNew:[['wow','カードショップに 📖カードブックが できたよ！ カードごとに 入る ポケットが 決まってて、 図鑑みたいに うめていけるの'],['happy','お店の カードブック、 見た？ 🎁おたからは レアごと、 単語は 小・中・高で ページが 分かれてるよ']],
 sh_bookPage:[['happy','ページが うまったね！ その ページの 単語、 ぜんぶ 言えるかな？'],['proud','9まい そろった！ ならべて 見ると、 覚えた 単語が 目で わかるね']],
 sh_bookDone:[['wow','「{t}」が コンプリート！ ほんとに すごいよ'],['proud','{t}、 ぜんぶ そろったね。 先生も うれしい！']],
 sh_bookMove:[['smile','ブックに 入れた カードは 倉庫から ブックへ おひっこし。 でも 鉱山の 練習には ちゃんと 使えるよ'],['think','倉庫に のこっているのは、 ブックに 入れていない あまりの カード。 売り場に 出すなら そこから えらんでね']],
 sh_bookAll:[['happy','{n}まい ブックに 入ったね。 タップすると 例文も 見られるよ'],['smile','ブックが にぎやかに なったね。 知らない 単語が あったら 鉱山で 練習しよう']],
 x_shBook:[['smile','まだ ブックに 入れていない カードが {n}まい あるよ。 「ぜんぶ 入れる」で 一気に 入るよ'],['think','カードブック、 空いてる ポケットが 光ってるよ。 入れに 行こう？'],['smile','ブックの 「＋ 入れられる」を 押すと、 入れられる カードだけ ならぶよ。 タップで 1まいずつ 入れられるの']],
 sh_bookFind:[['wow','カードブックで 単語を さがせるように なったよ！ 🔍に 英語か 日本語を 打ってね。 📍を 押すと その ポケットの ページに とぶよ'],['happy','カードブックが 使いやすく なったよ。 タブの 黄色い 数字は 入れられる カードの 数。 倉庫や パックから そのまま 入れることも できるよ']],
 sh_bookFound:[['smile','「{w}」、 見つかったね。 さがした 単語は 声に 出して 1回 読んでみよう'],['think','さがした 単語は 覚えたい 単語。 鉱山で 何回か 使うと しっかり 覚えられるよ']],
 sh_bookIn1:[['happy','{w}、 ブックに 入れたね。 {p}ばんの ポケットだよ'],['smile','倉庫から そのまま 入れられて 便利でしょ？ 入れた カードも 鉱山では 使えるからね']],
 x_shBookGot:[['proud','カードブック、 もう {n}まい！ 1まい ずつが きみの 覚えた しるしだね'],['happy','ブックの {n}まい、 ときどき めくって 声に 出して 読んでみてね']]});

const goBook=(m)=>['📖 カードブックへ',()=>{CG.open();setTimeout(()=>{if(!SHOP.rec().away&&SHOP.rec().met)enter(null,m)},60)}];
if(window.MINA_SENSE&&MINA_SENSE._rules)MINA_SENSE._rules.push(
 ['x_shBook',2,()=>{if(!SHOP.rec().met)return null;const n=addable().length;return n>=5?{n}:null},()=>goBook('can')],
 ['x_shBookGot',1,()=>{const [g]=stat();return g>=10?{n:g}:null},goBook]);
/* 新しく できたことを 1回だけ */
setTimeout(function first(){const S=SHOP.rec();if(S.bookTold||!S.met)return;const m=window.MINA;if(!m||!m.canAnnounce||!m.canAnnounce())return setTimeout(first,20000);
  S.bookTold=1;save();const [ex,tx]=ML('sh_bookNew');m.say('m',ex,tx,10000,null,goBook())},26000);

/* もう 1回: 新しく できた「さがす・入れやすく」を 1回だけ */
setTimeout(function first2(){const S=SH2();if(!S||S.bookTold2||!S.bookTold)return;const m=window.MINA;if(!m||!m.canAnnounce||!m.canAnnounce())return setTimeout(first2,20000);
  S.bookTold2=1;save();const [ex,tx]=ML('sh_bookFind');m.say('m',ex,tx,10000,null,goBook())},30000);
function SH2(){try{return SHOP.rec()}catch(e){return null}}

window.CBOOK={open:enter,stat,addable,list,SEC,canIn,putOne,label,mina,nm};
})();
