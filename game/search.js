/* ミナ先生の ページの 🔍 さがす（11/19 ユーザー「英語を 入れると それに 関する ことが 出てくる。 単語カードや 文法など。 まだ 手に 入れて ない カードも」）
   英語でも 日本語でも。 カード（もっていない カードも）・文法ノート・ミニ授業 を いっしょに さがす。
   カードは タップで 📖くわしく（CG.detail）、 文法は 文法ノート、 授業は その授業へ。 ミナ先生の セリフは この ファイルの さいご */
(()=>{
const H=window.HE;if(!H)return;
const esc=H.esc,$=id=>document.getElementById(id),sf=k=>{try{SFX[k]()}catch(e){}};
const SAVE='hoshi_search';
const SR=(()=>{try{return JSON.parse(localStorage.getItem(SAVE)||'{}')}catch(e){return {}}})();
SR.n=SR.n|0;SR.q=SR.q||[];
const save=()=>{try{localStorage.setItem(SAVE,JSON.stringify(SR))}catch(e){}};

/* ことばを そろえる（大文字小文字・全角・カタカナ→ひらがな・記号を 消す） */
const kata=s=>s.replace(/[ァ-ヶ]/g,c=>String.fromCharCode(c.charCodeAt(0)-0x60));
const norm=s=>kata(String(s||'').normalize('NFKC').toLowerCase()).replace(/[\s〜~・、。,.'’!?！？()（）「」『』\-_/]/g,'');
const isEn=q=>/^[a-z0-9 '’\-.,!?]+$/i.test(q.trim());
const words=s=>String(s||'').toLowerCase().match(/[a-z']+/g)||[];
const strip=s=>String(s||'').replace(/<[^>]+>/g,' ');

/* ================================================================ さがす もの */
let IDX=null;
function index(){if(IDX)return IDX;IDX={cards:[],gram:[],les:[]};
  /* カード: ブックの 分け方（宝・小中高ハイ・パーツと文）の ぜんぶ。 もっていない カードも */
  try{const B=window.CBOOK,C=window.CG;if(B&&C)B.SEC.forEach(s=>B.list(s.k).forEach(id=>{const I=C.info(id);if(!I)return;
    IDX.cards.push({id,sec:s.n,k:I.k,en:I.en,ja:I.ja,ne:norm(I.en),nj:norm(I.ja),ws:new Set(words(I.en))})}))}catch(e){}
  /* 文法ノート */
  try{if(typeof GRAMMAR!=='undefined')Object.keys(GRAMMAR).forEach(lv=>(GRAMMAR[lv].notes||[]).forEach((n,i)=>{
    const en=[...(n.ex||[]).map(e=>e[0]),...(n.q||[]).map(q=>String(q[0]).replace('___',(q[1]||[])[q[2]]||''))].join(' ');
    const ja=[n.t,...(n.r||[]),...(n.ex||[]).map(e=>e[1])].join(' ');
    IDX.gram.push({lv,i,id:n.id,t:n.t,ico:GRAMMAR[lv].ico||'',ws:new Set(words(en+' '+n.t+' '+(n.r||[]).join(' '))),nt:norm(n.t),nj:norm(ja),en})}))}catch(e){}
  /* ミニ授業 */
  try{if(typeof LESSONS!=='undefined')LESSONS.forEach(l=>{
    const txt=[...(l.steps||[]).map(s=>strip(s[2])+' '+strip(s[3]||'')),...(l.quiz||[]).map(q=>strip(q.q)+' '+(q.o||q.c||[]).map(strip).join(' '))].join(' ');
    IDX.les.push({id:l.id,lv:l.lv,t:l.t,ws:new Set(words(txt+' '+(l.key||[]).join(' '))),nt:norm(l.t),nk:norm((l.key||[]).join(' ')),nj:norm(txt)})})}catch(e){}
  return IDX}

/* 点数: 小さいほど 上 */
function find(q){q=String(q||'').trim();const n=norm(q);if(!n)return {cards:[],gram:[],les:[]};const I=index(),en=isEn(q),qw=words(q);
  /* 英語の 1語なら 語の かたち（swim → swims / swimming / swam）も 見る */
  const w1=en&&qw.length===1?qw[0]:'',stem=w1.length>=4?w1.replace(/(ing|ed|es|s)$/,''):w1;
  const hasW=ws=>{if(!w1)return qw.length>1&&qw.every(w=>ws.has(w));if(ws.has(w1))return true;if(stem.length<3)return false;for(const w of ws)if(w.startsWith(stem)&&w.length-stem.length<=4)return true;return false};
  const cards=[];I.cards.forEach(c=>{let r=-1;
    if(c.ne===n||c.ne.split(',')[0]===n)r=0;else if(c.ne.startsWith(n))r=1;else if(w1&&c.ws.has(w1))r=1.5;else if(c.ne.includes(n))r=2;
    else if(c.nj.startsWith(n))r=en?-1:1;else if(c.nj.includes(n))r=en?-1:2.5;
    if(r>=0)cards.push([r+(c.k==='s'?.5:0),c.ne.length,c])});
  cards.sort((a,b)=>a[0]-b[0]||a[1]-b[1]);const seen=new Set();
  const uniq=cards.filter(x=>{const key=x[2].sec+'|'+x[2].ne.split(',')[0]+'|'+x[2].nj;if(seen.has(key))return false;seen.add(key);return true});
  const gram=[];I.gram.forEach(g=>{let r=-1;if(g.nt.includes(n))r=0;else if(en&&hasW(g.ws))r=1;else if(!en&&g.nj.includes(n))r=1.5;if(r>=0)gram.push([r,g])});
  gram.sort((a,b)=>a[0]-b[0]);
  const les=[];I.les.forEach(l=>{let r=-1;if(l.nt.includes(n)||l.nk.includes(n))r=0;else if(en&&hasW(l.ws))r=1;else if(!en&&n.length>=2&&l.nj.includes(n))r=1.5;if(r>=0)les.push([r,l])});
  les.sort((a,b)=>a[0]-b[0]);
  return {cards:uniq.map(x=>x[2]),gram:gram.map(x=>x[1]),les:les.map(x=>x[1])}}

/* ================================================================ がめん */
const LVN={es:'小',jh:'中',hs:'高',adv:'ハイ'};
const ML=(k,v)=>{try{return MINA.line(k,v||{})}catch(e){return ['smile','']}};
const mface=ex=>{try{return MINA.face('m',ex)}catch(e){return ''}};
let shown=12,lastQ='';
function open(q){q=q==null?(SR.last||''):q;shown=12;sf('pop');
  H.show('msearch',`<section class="pnl msrch">
    <div class="qtop"><button class="x" id="msx" aria-label="もどる">←</button><b>🔍 さがす</b><span></span></div>
    <div class="msin"><span>🔍</span><input id="msq" type="text" enterkeyhint="search" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="swim ／ およぐ ／ 過去形" value="${esc(q)}"><button id="msqx" class="sub" ${q?'':'hidden'} aria-label="けす">✕</button></div>
    <div class="msmina" id="msm"></div>
    <div id="msr" class="msr"></div>
  </section>`);
  const inp=$('msq');let t=0;
  inp.oninput=()=>{$('msqx').hidden=!inp.value;clearTimeout(t);t=setTimeout(()=>{shown=12;draw(inp.value)},220)};
  inp.onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();clearTimeout(t);shown=12;draw(inp.value,1);inp.blur()}};
  $('msqx').onclick=()=>{inp.value='';$('msqx').hidden=true;shown=12;draw('');inp.focus()};
  $('msx').onclick=()=>{sf('back');MINA.open()};
  draw(q);if(!q)setTimeout(()=>{try{inp.focus()}catch(e){}},80)}
function minaSay(k,v){const [ex,tx]=ML(k,v);$('msm').innerHTML=`<span class="msf">${mface(ex)}</span><p>${tx}</p>`}
function draw(q,enter){const box=$('msr');if(!box)return;q=String(q||'').trim();
  if(!q){lastQ='';box.innerHTML=SR.q.length?`<p class="mshd">さいきん さがした ことば</p><div class="msrec">${SR.q.map(x=>`<button data-q="${esc(x)}">${esc(x)}</button>`).join('')}</div>`:'';
    box.querySelectorAll('[data-q]').forEach(b=>b.onclick=()=>{sf('tap');$('msq').value=b.dataset.q;$('msqx').hidden=false;draw(b.dataset.q,1)});
    minaSay(SR.n?'ms_open':'ms_first');return}
  const R=find(q),C=window.CG,nc=R.cards.length,tot=nc+R.gram.length+R.les.length;
  const own=c=>{try{return C.count(c.id)>0}catch(e){return false}};
  const row=c=>{const o=own(c);return `<button class="mscard${o?' own':''}" data-id="${esc(c.id)}"><span class="msb">${esc(c.sec)}</span><span class="mst"><b>${esc(c.en)}</b><small>${esc(c.ja)}</small></span><i>${o?'✅':'まだ'}</i></button>`};
  let h='';
  if(nc)h+=`<p class="mshd">🃏 カード <small>${nc}</small></p><div class="mslist">${R.cards.slice(0,shown).map(row).join('')}</div>${nc>shown?`<button class="sub msmore" id="msmore">もっと 見る（のこり ${nc-shown}）</button>`:''}`;
  if(R.gram.length)h+=`<p class="mshd">📚 文法ノート <small>${R.gram.length}</small></p><div class="mslist">${R.gram.slice(0,8).map(g=>`<button class="msg" data-g="${g.lv}:${g.i}"><span class="msb">${esc(LVN[g.lv]||g.lv)}</span><span class="mst"><b>${esc(g.t)}</b>${exOf(g,q)}</span><i>▶</i></button>`).join('')}</div>`;
  if(R.les.length)h+=`<p class="mshd">📖 ミニ授業 <small>${R.les.length}</small></p><div class="mslist">${R.les.slice(0,6).map(l=>`<button class="msl" data-l="${esc(l.id)}"><span class="msb">${esc(LVN[l.lv]||'')}</span><span class="mst"><b>${esc(l.t)}</b></span><i>▶</i></button>`).join('')}</div>`;
  if(!tot)h=`<p class="msnone">見つからなかったよ</p>`;
  box.innerHTML=h;
  box.querySelectorAll('.mscard').forEach(b=>b.onclick=()=>{const id=b.dataset.id;remember(q);SR.seen=(SR.seen|0)+1;save();sf('step');
    C.detail(id,null,{from:'search'});if(!own({id}))try{const I=C.info(id);H.toast(`まだ もっていない カード<small>${I&&I.k==='t'?'⛏️ 鉱山の 深い ところで 見つかるかも':'⛏️ 鉱山で ほりだそう'}</small>`)}catch(e){}});
  box.querySelectorAll('.msg').forEach(b=>b.onclick=()=>{const [lv,i]=b.dataset.g.split(':');remember(q);sf('step');H.gramFrom(lv,()=>open(q));H.gramNote(lv,+i);const gx=$('gx');if(gx)gx.onclick=()=>{sf('back');open(q)}});
  box.querySelectorAll('.msl').forEach(b=>b.onclick=()=>{remember(q);sf('step');LESSON.open(b.dataset.l,()=>open(q))});
  const m=$('msmore');if(m)m.onclick=()=>{sf('tap');shown+=24;draw(q)};
  if(q!==lastQ){lastQ=q;SR.n++;save();
    const notOwn=R.cards.filter(c=>!own(c)).length;
    if(!tot)minaSay('ms_none',{q});
    else if(nc&&R.gram.length)minaSay('ms_both',{q,c:nc,g:R.gram.length});
    else if(nc&&notOwn&&notOwn===nc)minaSay('ms_notOwn',{q});
    else if(nc)minaSay('ms_cards',{q,c:nc});
    else minaSay('ms_gram',{q})}
  if(enter&&tot)remember(q)}
/* 文法ノートの 中で その ことばが 出てくる 例文を 1つ */
function exOf(g,q){const w=words(q)[0];if(!w)return '';const s=g.en.split(/(?<=[.?!])\s+/).find(x=>words(x).some(y=>y===w||(w.length>=4&&y.startsWith(w.replace(/(ing|ed|es|s)$/,'')))));return s?`<small>${esc(s)}</small>`:''}
function remember(q){q=String(q||'').trim();if(!q)return;SR.last=q;SR.q=[q,...SR.q.filter(x=>x!==q)].slice(0,8);save()}

/* 入口は ミナ先生の ページ（mina.js の #msgo、 習う・ふくしゅう・話す の 下） */
window.MSEARCH={open,find,rec:()=>SR};

/* ================================================================ ミナ先生の セリフ */
Object.assign(MINA_LINES,{
 ms_first:[['happy','知りたい 英語を 入れてみて。 カードも 文法も、 まだ もっていない カードも 出てくるよ'],['smile','英語でも 日本語でも さがせるよ。 たとえば swim とか 過去形 とか']],
 ms_open:[['smile','なにを さがす？ 英語でも 日本語でも いいよ'],['happy','気に なった ことば、 すぐ しらべるの えらいね'],['think','さっきの 授業で 気に なった ことばは ある？']],
 ms_cards:[['happy','「{q}」は カードが {c}まい 見つかったよ。 タップで くわしく 見られるよ'],['smile','「{q}」の カード、 {c}まい あったよ。 例文も 読んでみてね']],
 ms_both:[['wow','「{q}」は カード {c}まいと、 文法ノート {g}こに 出てくるよ。 いっしょに 見ると 覚えやすいの'],['proud','「{q}」、 カードも 文法も あるよ。 使い方まで わかると 強いね']],
 ms_gram:[['think','「{q}」は 文法ノートに 出てくるよ。 ルールと 例文を 見てみよう'],['smile','「{q}」の ことは 文法ノートと 授業に あるよ']],
 ms_notOwn:[['happy','「{q}」の カードは まだ もっていないね。 ⛏️ 鉱山で ほりだせるかも'],['smile','まだ 手に 入れて いない カードでも、 中身は 先に 見ておけるよ']],
 ms_none:[['think','「{q}」は 見つからなかった… つづりを たしかめるか、 日本語でも ためしてみて'],['worry','うーん、 「{q}」は のって いないみたい。 みじかく してみると 出てくるかも']],
 ms_new:[['wow','お知らせ！ わたしの ページに 🔍「英語で さがす」が できたよ。 カードも 文法も、 まだ もっていない カードも しらべられるの'],
  ['happy','わからない 英語が あったら、 わたしの ページの 🔍 で さがしてみて。 カードと 文法が いっしょに 出てくるよ']],
 cg_lookFrom_search:[['smile','しらべた 「{w}」、 声に 出して 読んでみよう。 まだ もっていなくても 中身は 見られるよ'],['happy','「{w}」の 例文、 いいでしょ？ 使い方ごと 覚えちゃおう']],
 x_msTry:[['smile','気に なる 英語は、 わたしの ページの 🔍 で さがせるよ'],['think','あの ことば、 なんだっけ？って 思ったら 🔍 さがすで しらべてみよう']],
 x_msLast:[['happy','この前 「{q}」を しらべてたね。 もう 覚えた？'],['smile','「{q}」、 しらべた あとに 声に 出して 言ってみると わすれにくいよ']]});
const goSearch=()=>['🔍 さがす',()=>open('')];
if(window.MINA_SENSE&&MINA_SENSE._rules)MINA_SENSE._rules.push(
 ['x_msTry',1,()=>SR.n<3?{}:null,goSearch],
 ['x_msLast',2,()=>SR.last&&SR.n>=1?{q:SR.last}:null,()=>['🔍 さがす',()=>open(SR.last)]]);
/* 新しく できたことを 1回だけ */
setTimeout(function first(){if(SR.told)return;const m=window.MINA;if(!m||!m.canAnnounce||!m.canAnnounce())return setTimeout(first,20000);
  SR.told=1;save();const [ex,tx]=ML('ms_new');m.say('m',ex,tx,10000,null,goSearch())},52000);
})();
