/* 📜 うんちく（へえ！と なる 本当の 話）を アプリの あちこちで 聞いて、 図鑑に ためる
   - 🍽️ しおかぜ食堂: マルコさん（しくみは game/food.js の まま。 記録も food の tri）
   - 🏚️ ながれぎ雑貨店: 品物・おかし・イベント・レコードを 買うと、 ノラさんが 1つ 話してくれる（game/zakka.js の end）
   - 🃏 ことばカード: うんちくの ある カードを 大きく ひらくと、 ミオが 語源を 話す（game/cg.js の detail）。 倉庫の 📜 で さがせる
   - 👩‍🏫 ミナ先生: ページに 「きょうの うんちく」が 1日 1つ（英語と いう ことばの ひみつ）
   - 📜 うんちく図鑑: 場所ごとに わけて 読みかえせる。 🔊 で 英語を 聞ける
   データは game/unchiku-data.js。 ミナ先生の セリフは この ファイルの さいご */
(()=>{
const {S:ST,sfx:SFX}=BEACH;
const H=HE,esc=H.esc,$=id=>document.getElementById(id);
const pickL=a=>a[Math.random()*a.length|0];
const sf=k=>{try{SFX[k]&&SFX[k]()}catch(e){}};
const ML=(k,v)=>{try{return MINA.line(k,v||{})}catch(e){return ['smile','']}};
const today=()=>{const d=new Date();return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate()};

/* ---------- the record: h['z:pc']=1 （z 雑貨店 / w ことば / m ミナ先生） ---------- */
const UK=(()=>{try{const s=JSON.parse(localStorage.getItem(SAVE_KEY)||'{}').unk;if(s&&s.h)return s}catch(e){}
  return {h:{},v:0,md:'',mi:-1}})();
_saveHooks.push(()=>{const s=JSON.parse(localStorage.getItem(SAVE_KEY)||'{}');s.unk=UK;localStorage.setItem(SAVE_KEY,JSON.stringify(s))});

const PL={
 food:{ico:'🍽️',n:'しおかぜ食堂',who:'マルコさん'},
 zakka:{ico:'🏚️',n:'ながれぎ雑貨店',who:'ノラさん',c:'z'},
 word:{ico:'🃏',n:'ことばカード',who:'ミオ',c:'w'},
 mina:{ico:'👩‍🏫',n:'ミナ先生',who:'ミナ先生',c:'m'}};
/* [英語, 日本語] or null */
function get(pl,id){if(pl==='zakka'){const t=UNK_ZAKKA[id];return t||null}
  if(pl==='word'){const t=UNK_WORD[String(id).toLowerCase()];return t||null}
  if(pl==='mina'){const t=UNK_MINA[+id];return t?[t[1],t[2],t[0]]:null}return null}
const key=(pl,id)=>PL[pl].c+':'+(pl==='word'?String(id).toLowerCase():id);
const heard=(pl,id)=>!!UK.h[key(pl,id)];
/* true when it is new */
function hear(pl,id){if(!get(pl,id))return false;const k=key(pl,id);if(UK.h[k])return false;UK.h[k]=Date.now();save();return true}

/* who says it */
function say(pl,en){try{if(pl==='word'&&window.MIO)return MIO.say(en);if(pl==='zakka'&&window.ZAKKA&&ZAKKA.talk)return ZAKKA.talk(en);H.say('es',en)}catch(e){}}

/* a fold with the story. opt: {title, open, isNew, hearOnOpen} */
function box(pl,id,opt={}){const t=get(pl,id);if(!t)return '';const nw=opt.isNew!=null?opt.isNew:!heard(pl,id);
  return `<details class="mfold unkf" data-unk="${pl}|${esc(String(id))}" ${opt.open?'open':''}><summary>📜 ${opt.title||'うんちく'} ${nw?'<i class="zknew">NEW</i>':''}</summary>
    <div class="fdtri unkt">${t[2]?`<b>${esc(t[2])}</b>`:''}<p>${esc(t[0])}<button class="ksay" data-unksay aria-label="英語を 聞く">🔊</button></p><small>${esc(t[1])}</small></div></details>`}
function bind(root){if(!root)return;root.querySelectorAll('[data-unk]').forEach(d=>{const [pl,id]=d.dataset.unk.split('|');
  d.ontoggle=()=>{if(!d.open)return;sf('pop');if(hear(pl,id)){const n=d.querySelector('.zknew');if(n)setTimeout(()=>n.remove(),1200)}say(pl,get(pl,id)[0])};
  const b=d.querySelector('[data-unksay]');if(b)b.onclick=e=>{e.preventDefault();e.stopPropagation();say(pl,get(pl,id)[0])}})}

/* ================================================================ 🃏 ことばカード */
const cardHead=I=>I&&(I.k==='w'||I.k==='t')?String(I.h||'').toLowerCase():'';
const cardHas=I=>!!get('word',cardHead(I));
function cardBox(I,own){const h=cardHead(I);if(!own||!get('word',h))return '';return box('word',h,{title:'ミオの うんちく'})}

/* ================================================================ 👩‍🏫 ミナ先生の きょうの うんちく */
function todayIdx(){const d=today();if(UK.md===d&&UNK_MINA[UK.mi])return UK.mi;
  const left=UNK_MINA.map((x,i)=>i).filter(i=>!UK.h['m:'+i]);UK.mi=pickL(left.length?left:UNK_MINA.map((x,i)=>i));UK.md=d;save();return UK.mi}
function minaBox(){const i=todayIdx(),t=UNK_MINA[i],nw=!heard('mina',i);
  return `<details class="mfold unkf mina-unk" data-unk="mina|${i}"><summary>📜 きょうの うんちく <small>${nw?'<i class="zknew">NEW</i>':esc(t[0])}</small></summary>
    <div class="fdtri unkt"><b>${esc(t[0])}</b><p>${esc(t[1])}<button class="ksay" data-unksay aria-label="英語を 聞く">🔊</button></p><small>${esc(t[2])}</small>
    <div class="row"><button class="sub" data-unkbook>📜 うんちく図鑑</button></div></div></details>`}
function minaBind(back){const r=H.panel;bind(r);const b=r.querySelector('[data-unkbook]');if(b)b.onclick=()=>{sf('book');book(back)}}

/* ================================================================ 📜 うんちく図鑑 */
function zakkaList(){const G=[['🧺','雑貨',[]],['🍪','おかし',[]],['🎆','イベント',[]],['🎵','レコード',[]]];
  Object.keys(UNK_ZAKKA).forEach(id=>{let it=null,g=0;
    try{if(id.startsWith('f:')){g=1;it=ZAKKA.good('food',id.slice(2))}else if(id.startsWith('ev:')){g=2;it=ZAKKA.good('event',id.slice(3))}else if(id.startsWith('mu:')){g=3;it=ZAKKA.good('music',id.slice(3))}else it=ZAKKA.items.find(x=>x.id===id)}catch(e){}
    if(it)G[g][2].push({id,ico:it.ico,n:it.n})});return G}
function counts(pl){if(pl==='food'){try{const D=FOOD.dishes,T=FOOD.rec().tri||{};return [D.reduce((a,d)=>a+(T[d.id]||[]).filter(Boolean).length,0),D.length*2]}catch(e){return [0,0]}}
  const all=pl==='zakka'?zakkaList().reduce((a,g)=>a+g[2].length,0):pl==='word'?Object.keys(UNK_WORD).length:UNK_MINA.length;
  return [Object.keys(UK.h).filter(k=>k[0]===PL[pl].c&&get(pl,k.slice(2))).length,all]}
const ORDER=['food','zakka','word','mina'];
function book(back){back=typeof back==='function'?back:H.home;if(!UK.v){UK.v=1;save()}
  const C={};ORDER.forEach(p=>C[p]=counts(p));const got=ORDER.reduce((a,p)=>a+C[p][0],0),all=ORDER.reduce((a,p)=>a+C[p][1],0);
  const [ex,tx]=ML(got?'un_book':'un_bookNone',{n:got});
  H.show('unk',`<section class="pnl fd unk">
    <div class="qtop"><button class="x" id="unx" aria-label="もどる">←</button><b>📜 うんちく図鑑</b><span class="qn">${got}/${all}</span></div>
    <div class="kmina"><span class="lface">${MINA.face('m',ex)}</span><p>${tx}</p></div>
    <div class="unkpl">${ORDER.map(p=>`<button data-pl="${p}"><span>${PL[p].ico}</span><b>${PL[p].n}</b><small>${PL[p].who} ・ ${C[p][0]}/${C[p][1]}</small></button>`).join('')}</div>
    <p class="note">📜 聞いた うんちくが ここに たまるよ。 タップで 読みかえせる</p></section>`);
  $('unx').onclick=()=>{sf('back');back()};
  H.panel.querySelectorAll('[data-pl]').forEach(b=>b.onclick=()=>{sf('book');const p=b.dataset.pl,me=()=>book(back);
    if(p==='food'){try{return FOOD.book(me)}catch(e){return}}list(p,me)})}
const row=(pl,id,ico,name,sub)=>{const t=get(pl,id);if(!heard(pl,id))return `<div class="zkfl no"><b>${ico?ico+' ':''}？？？</b>${sub?`<small>${esc(sub)}</small>`:''}</div>`;
  return `<details class="unkr" data-unk="${pl}|${esc(String(id))}"><summary>${ico?ico+' ':''}<b>${esc(name)}</b></summary><div class="fdtri unkt"><p>${esc(t[0])}<button class="ksay" data-unksay aria-label="英語を 聞く">🔊</button></p><small>${esc(t[1])}</small></div></details>`};
function list(pl,back){const P=PL[pl];let body='',hint='';
  if(pl==='zakka'){body=zakkaList().map(([ico,n,L])=>{const g=L.filter(x=>heard('zakka',x.id)).length;
      const no=L.filter(x=>!heard('zakka',x.id));
      return `<details class="mfold"><summary>${ico} ${n} <small>${g}/${L.length}</small></summary><div class="unkls">${L.filter(x=>heard('zakka',x.id)).map(x=>row('zakka',x.id,x.ico,x.n,'')).join('')}${no.length?`<p class="unkno" title="まだ 聞いていない">${no.map(x=>`<span>${x.ico}</span>`).join('')}<small>まだ ${no.length}こ</small></p>`:''}</div></details>`}).join('');
    hint='ノラさんの お店で 買いものを すると、 品物の うんちくを 話してくれるよ'}
  else if(pl==='word'){const ks=Object.keys(UNK_WORD).sort(),got=ks.filter(k=>heard('word',k));
    body=got.length?`<div class="unkls">${got.map(k=>row('word',k,'',k,'')).join('')}</div>`:'';
    hint=`まだ ${ks.length-got.length}こ。 カードショップの 📦 倉庫で 「📜」を えらぶと、 うんちくの ある カードが 見つかるよ`}
  else if(pl==='mina'){const got=UNK_MINA.map((t,i)=>i).filter(i=>heard('mina',i));body=got.length?`<div class="unkls">${got.map(i=>row('mina',i,'',UNK_MINA[i][0],'')).join('')}</div>`:'';
    hint=`まだ ${UNK_MINA.length-got.length}こ。 ミナ先生の ページで、 1日 1つ 「きょうの うんちく」が 聞けるよ`}
  H.show('unk',`<section class="pnl fd unk">
    <div class="qtop"><button class="x" id="unx" aria-label="もどる">←</button><b>${P.ico} ${P.n}の うんちく</b><span class="qn">${counts(pl).join('/')}</span></div>
    ${body}<p class="note">${hint}</p></section>`);
  $('unx').onclick=()=>{sf('back');back()};bind(H.panel)}

/* ================================================================ ミナ先生の セリフ */
Object.assign(MINA_LINES,{
 un_book:[['smile','うんちく、 {n}こ 集まったね。 だれかに 「Did you know ～?」って 話してみて'],['point','うんちくの 英語は 🔊で 聞けるよ。 ことばの 由来を 知ると、 単語が わすれにくく なるの'],['happy','{n}こも！ うんちく 名人に なってきたね']],
 un_bookNone:[['smile','まだ うんちくは ないみたい。 食堂、 雑貨屋、 カード… いろんな 所で 聞けるよ'],['happy','わたしの ページにも 「きょうの うんちく」が あるよ。 のぞいてみて']],
 zk_endUnchiku:[['wow','ノラさんの うんちく、 へえ〜って なったね。 {t}にも そんな 話が あるんだ'],['smile','{t}、 いい 買いもの だったね。 ノラさんの うんちくは 📜 うんちく図鑑に のこってるよ'],['point','うんちくの 英語、 声に 出して 読んでみて。 「Did you know ～?」から はじめると 会話の ネタに なるよ']],
 x_triNew:[['wow','うんちく、 食堂だけじゃ ないんだよ。 ノラさんも ミオちゃんも 物知りなんだって'],['happy','雑貨屋で 買いものを すると ノラさんが、 カードを ひらくと ミオちゃんが うんちくを 話してくれるよ']],
 x_triToday:[['smile','きょうの うんちく、 もう 聞いた？ わたしの ページの 📜 だよ'],['think','ねえ、 「{t}」の 話、 聞きたくない？ きょうの うんちくだよ']],
 x_triWord:[['think','{w}の 語源、 おぼえてる？ 「{j}」'],['smile','ミオちゃんに 聞いた {w}の 話、 おもしろかったね']],
 x_triZakka:[['smile','ノラさんの うんちく、 おぼえてる？ 「{j}」'],['happy','ノラさんって 本当に 物知りだよね。 {n}の 話、 へえ〜だった']],
 x_triCard:[['point','カードショップの 倉庫で 「📜」を えらぶと、 うんちくの ある カードが わかるよ'],['smile','単語には 由来が あるんだよ。 breakfast は 「断食を やぶる」。 ミオちゃんが くわしいよ']]});
const shortJ=s=>{s=String(s);return s.length>46?s.slice(0,44)+'…':s};
const PLC={z:'zakka',w:'word',m:'mina'};
const heardOf=c=>Object.keys(UK.h).filter(k=>k[0]===c&&get(PLC[c],k.slice(2))).map(k=>k.slice(2));
const toBook=()=>['📜 うんちく図鑑',()=>book(H.home)];
const toStore=()=>['📦 倉庫を 見る',()=>{try{CG.open();setTimeout(()=>SHOP.store('unk'),60)}catch(e){}}];
if(window.MINA_SENSE&&MINA_SENSE._rules)MINA_SENSE._rules.push(
 ['x_triNew',3,()=>!UK.v&&Object.keys(UK.h).length<3?{}:null,toBook],
 ['x_triToday',2,()=>{const i=todayIdx();return heard('mina',i)?null:{t:UNK_MINA[i][0]}},()=>['👩‍🏫 きょうの うんちく',()=>MINA.open()]],
 ['x_triWord',1,()=>{const a=heardOf('w');if(!a.length)return null;const w=pickL(a);return {w,j:shortJ(get('word',w)[1])}},toBook],
 ['x_triZakka',1,()=>{const a=heardOf('z');if(!a.length)return null;const id=pickL(a),it=zakkaList().flatMap(g=>g[2]).find(x=>x.id===id);return it?{n:it.n,j:shortJ(get('zakka',id)[1])}:null},toBook],
 ['x_triCard',1,()=>{try{return SHOP.rec().met&&heardOf('w').length<3?{}:null}catch(e){return null}},toStore]);

window.UNK={get,hear,heard,box,bind,say,book,list,cardBox,cardHas,minaBox,minaBind,todayIdx,rec:()=>UK};
})();
