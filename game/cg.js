/* ことばカード: 単語帳の 単語が ぜんぶ カードに なる。 浜辺の カードショップ「しおさい」（店長は きみ。 game/shop.js）と 単語の 鉱山（game/mine.js）で 使う。
   - カード: 単語帳の 6000語あまり（小・中・高・ハイレベル）＋ 宝箱の カード（宝カード）＋ 語源パーツ ＋ 文カード
   - 絵: 単語の 意味の 絵（2つの 絵の 組み合わせも）。 属性と レベルで 背景と わくが かわり、 もようは 単語ごとに ちがう（同じ 見た目の カードは ない）
   - おぼえた 度合い（正解で 育つ。 画面には 出さない）は 鉱山の カードの えらび方に つかう。 苦手（まちがいが 多い・まちがいノートの 単語）と わすれかけ（しばらく 見ていない）の しるし
   - 新しい カードは ⛏️鉱山で ほりだす。 📦仕入れは コインを 使わず、 📖カードブックに 入れた カードを 仕入れ画面の 問題で 仕入れる（11/18。 game/stock.js）
     前の パック（packCards・packList）は もう 売っていない。 段位（級）は ない
   ほかの 機能との 連動・ミナ先生の セリフは game/cg-more.js。 データは game/cg-data.js */
(()=>{
const {S:ST,sfx:SFX}=BEACH;
const H=HE,esc=H.esc,$=id=>document.getElementById(id);
const pickL=a=>a[Math.random()*a.length|0];
const sf=k=>{try{SFX[k]&&SFX[k]()}catch(e){}};
const LVK=['es','jh','hs','adv'],LV=CG_LV;
const ATTR=Object.fromEntries(CG_ATTR.map(a=>[a[0],a]));
const lines=s=>s.trim().split('\n').map(l=>l.split('|').map(x=>x.trim()));
const head=e=>String(e).split(',')[0].trim().toLowerCase().replace(/[.!?]$/,'');
function hash(s){let h=2166136261;for(let i=0;i<s.length;i++)h=Math.imul(h^s.charCodeAt(i),16777619);h=Math.imul(h^h>>>15,h|1);h^=h+Math.imul(h^h>>>7,h|61);return (h^h>>>14)>>>0}
const today=()=>{const d=new Date();return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate()};
const dnum=()=>Math.floor((Date.now()-new Date().getTimezoneOffset()*6e4)/864e5);

/* ================================================================ the cards */
/* word cards: id = "lv:english" (stable even if the books are reordered) */
const W=[],BY={},BYH={};
function attrOf(bt,ja){for(const [k,re] of CG_ATTR_RULE){if(!re.test(bt))continue;
    if(k==='learn'||k==='act'||k==='look'){if(/動詞/.test(bt))return 'act';if(/形容詞|副詞/.test(bt))return 'look';
      if(/(する|る|う|く|す|つ|む|ぶ|ぐ|ぬ)$/.test(ja.replace(/（.*?）/g,'')))return 'act';if(/(な|い|の|的な)$/.test(ja.replace(/（.*?）/g,'')))return 'look'}
    return k}return 'learn'}
H.LV_ORDER.forEach(lv=>LEVELS[lv].books.forEach((b,bi)=>b.w.forEach(w=>{const id=lv+':'+w[0];if(BY[id])return;
  const c={id,k:'w',lv,en:w[0],h:head(w[0]),ja:w[1],e:w[2]||'',bt:b.t,bi,a:attrOf(b.t,w[1])};W.push(c);BY[id]=c;(BYH[c.h]=BYH[c.h]||[]).push(c)})));
const hasHead=h=>!!BYH[h];
/* the lowest level card of a word */
const cardOfHead=h=>(BYH[h]||[])[0]||null;

/* combos / mistakes / opposites / friends / word parts / sentences: only words that are in the books */
const COMBO=lines(CG_COMBO_SRC).filter(([a,b])=>hasHead(a.toLowerCase())&&hasHead(b.toLowerCase())).map(([a,b,p,j])=>({a:a.toLowerCase(),b:b.toLowerCase(),p,j,k:a.toLowerCase()+'+'+b.toLowerCase()}));
const CMB={};COMBO.forEach(c=>{CMB[c.a+'|'+c.b]=c;CMB[c.b+'|'+c.a]=c});
const comboOf=(h1,h2)=>CMB[h1+'|'+h2]||null;
const combosWith=h=>COMBO.filter(c=>c.a===h||c.b===h);
const WRONG=lines(CG_WRONG_SRC).filter(([a,b])=>hasHead(a.toLowerCase())&&hasHead(b.toLowerCase())).map(([a,b,ok,why])=>({a:a.toLowerCase(),b:b.toLowerCase(),ok,why,k:a.toLowerCase()+'+'+b.toLowerCase()}));
const WRG={};WRONG.forEach(c=>{WRG[c.a+'|'+c.b]=c;WRG[c.b+'|'+c.a]=c});
const ANTO={};lines(CG_ANTO_SRC).forEach(([a,b])=>{if(hasHead(a)&&hasHead(b)){(ANTO[a]=ANTO[a]||new Set()).add(b);(ANTO[b]=ANTO[b]||new Set()).add(a)}});
const SYN={};lines(CG_SYN_SRC).forEach(g=>{g=g.filter(hasHead);if(g.length<2)return;g.forEach(x=>{SYN[x]=SYN[x]||new Set();g.forEach(y=>{if(y!==x)SYN[x].add(y)})})});
const DERIV=lines(CG_DERIV_SRC).filter(([p,b,d])=>CG_PARTS[p]&&hasHead(b)&&hasHead(d)).map(([p,b,d])=>({p,b,d}));
const derivOf=(p,b)=>DERIV.find(x=>x.p===p&&x.b===b)||null;
const SENT=lines(CG_SENT_SRC).map(([lv,en,ja],i)=>({i,lv,en,ja}));
/* the word list of a sentence card: what you put in order */
const sentWords=s=>s.en.split(/\s+/);

/* treasure cards (game/cards.js) */
const TR=()=>window.CARDS&&CARDS.book||[];
const TPOW=[0,3,4,6,8,11],TCOST=[0,1,1,2,3,4];
/* every card's facts: {id,k,lv,en,ja,h,a,cost,pow,...} */
function info(id){if(!id)return null;
  if(id.startsWith('t:')){const t=TR().find(c=>c.e===id.slice(2));if(!t)return null;return {id,k:'t',lv:'tr',en:t.en,h:head(t.en),ja:t.ja,e:t.e,r:t.r,a:'tr',cost:TCOST[t.r],pow:TPOW[t.r],sv:'cards'}}
  if(id.startsWith('p:')){const k=id.slice(2),P=CG_PARTS[k];if(!P)return null;return {id,k:'p',lv:'pt',part:k,en:P[0],ja:P[1],h:k,a:'part',cost:1,pow:0}}
  if(id.startsWith('s:')){const s=SENT[+id.slice(2)];if(!s)return null;return {id,k:'s',lv:s.lv,en:s.en,ja:s.ja,h:'',a:'sent',cost:3,pow:s.lv==='es'?10:s.lv==='jh'?13:16,s}}
  const c=BY[id];if(!c)return null;const L=LV[c.lv];return Object.assign({cost:L.c,pow:L.p},c)}

/* ================================================================ the record */
const CG=(()=>{try{const s=JSON.parse(localStorage.getItem(SAVE_KEY)||'{}').cg;if(s&&s.c)return s}catch(e){}
  return {v:1,c:{},x:{},pt:{},st:{},deck:[],sh:0,rp:0,win:{},lose:{},games:0,combo:{},wrong:{},d:'',bought:[],snipe:'',free:'',met:0,talk:0}})();
_saveHooks.push(()=>{const s=JSON.parse(localStorage.getItem(SAVE_KEY)||'{}');s.cg=CG;localStorage.setItem(SAVE_KEY,JSON.stringify(s))});
/* how many you have */
function count(id){if(id.startsWith('t:')){const t=TR().find(c=>c.e===id.slice(2));return t&&window.CARDS?CARDS.n(t):0}
  if(id.startsWith('p:'))return CG.pt[id.slice(2)]||0;if(id.startsWith('s:'))return CG.st[id.slice(2)]||0;return CG.c[id]||0}
const owns=id=>count(id)>0;
function give(id,n=1){if(id.startsWith('t:'))return;if(id.startsWith('p:'))CG.pt[id.slice(2)]=(CG.pt[id.slice(2)]||0)+n;else if(id.startsWith('s:'))CG.st[id.slice(2)]=(CG.st[id.slice(2)]||0)+n;else CG.c[id]=(CG.c[id]||0)+n}
function take(id,n=1){if(id.startsWith('t:')){try{for(let k=0;k<n;k++)CARDS.take(id.slice(2))}catch(e){}return}if(id.startsWith('p:'))CG.pt[id.slice(2)]=Math.max(0,(CG.pt[id.slice(2)]||0)-n);else if(id.startsWith('s:'))CG.st[id.slice(2)]=Math.max(0,(CG.st[id.slice(2)]||0)-n);else{CG.c[id]=Math.max(0,(CG.c[id]||0)-n);if(!CG.c[id])delete CG.c[id]}}
const ownedWords=()=>Object.keys(CG.c).filter(id=>CG.c[id]>0&&BY[id]);

/* おぼえた 度合い: xp 0,3,8,15,25 → 1..5（表示は しない。 鉱山で どの カードを 先に 練習するかに つかう） */
const STEP=[0,3,8,15,25];
const xs=id=>CG.x[id]||(CG.x[id]=[0,0,0,0]);   // [xp, last day seen, right, wrong]
const stat=id=>CG.x[id]||[0,0,0,0];
function star(id){const x=stat(id)[0];let s=1;STEP.forEach((t,i)=>{if(x>=t)s=i+1});return s}
const kira=id=>false;   // ★の 表示・きらきら版は なくした
let weakSet=null,weakAt=0;
function weakHeads(){if(weakSet&&performance.now()-weakAt<20000)return weakSet;weakAt=performance.now();weakSet=new Set();
  try{MINA.weakWords().forEach(w=>weakSet.add(head(w.en)))}catch(e){}return weakSet}
/* 苦手: missed more than answered (2回以上), or in the mistake notes */
function weak(id){const x=stat(id);if(x[3]>=2&&x[3]>x[2])return true;const c=BY[id];return !!(c&&weakHeads().has(c.h))}
/* わすれかけ: seen before, but not for 3 days */
const forgot=id=>{const x=stat(id);return x[1]>0&&dnum()-x[1]>=3};
/* after a quiz on a card */
function record(id,ok){if(!id||id.startsWith('p:')||id.startsWith('s:'))return 0;const x=xs(id),before=star(id);x[1]=dnum();if(ok){x[0]++;x[2]++}else x[3]++;save();return star(id)>before?star(id):0}
/* the card's power */
const power=id=>{const I=info(id);if(!I)return 0;return I.pow};

/* ⚔ 攻撃力・🛡 防御力・❤ HP: むずかしい 単語ほど 強い。 種類で すこし 個性 */
const ST_LV={es:[4,1,9],jh:[5,2,11],hs:[6,2,13],adv:[8,3,15]},ST_TR=[[4,1,9],[4,1,9],[5,1,10],[6,2,12],[7,2,14],[9,3,16]];
const TILT={act:[1,0,-1],heart:[1,0,-1],ani:[1,0,-1],food:[0,0,2],nat:[0,0,2],life:[0,1,0],look:[0,1,0],word:[0,1,0],learn:[0,0,1],tr:[0,0,0]};
function cstat(id,st){const I=typeof id==='string'?info(id):id;if(!I||!(I.k==='w'||I.k==='t'))return null;
  const b=I.k==='t'?ST_TR[I.r]||ST_TR[1]:ST_LV[I.lv],t=TILT[I.a]||[0,0,0];let a=b[0]+t[0],d=b[1]+t[1],h=b[2]+t[2];
  const v=hash('st'+I.id)%5;if(v===0)a++;else if(v===1)h+=2;else if(v===2)d++;
  const s=0;a+=Math.ceil(s/2);d+=Math.floor(s/3);h+=s*2;
  return {a:Math.max(1,a),d:Math.max(0,d),h:Math.max(5,h)}}

/* 🏷️ one mark per card (the same card always has the same one):
   小・中の カードは 1回だけの サポート、 高・H・レアの カードは ⏳チャージ / 🔋エネルギー / 🃏切り札 の どれか */
const SUP={heal:['💚','なおす','味方 1まいの ❤を 8 回復'],guard:['🛡️','まもる','つぎの 相手の 攻撃を 0に'],cheer:['⚡','おうえん','味方 ぜんぶの ⏳を なくして ✨+1'],idea:['💡','ひらめき','つぎの 攻撃が かならず クリティカル']};
const SUP_AT={food:'heal',nat:'heal',tr:'heal',life:'guard',look:'guard',word:'guard',act:'cheer',heart:'cheer',ani:'cheer',learn:'idea'};
function trait(id){const I=typeof id==='string'?info(id):id;if(!I||!(I.k==='w'||I.k==='t'))return null;
  const n=I.k==='t'?Math.max(0,I.r-2):({es:0,jh:1,hs:2,adv:3})[I.lv]||0,h=hash('tr'+I.id)%10,sup={k:'sup',s:SUP_AT[I.a]||'heal'};
  if(n===0)return sup;if(n===1)return h<6?sup:{k:'cd',n:1};
  return h<4?{k:'cd',n}:h<7?{k:'en',n}:{k:'ace'}}
const traitIco=T=>!T?'':T.k==='sup'?SUP[T.s][0]:T.k==='cd'?'⏳'+T.n:T.k==='en'?'🔋'+T.n:'🃏';
const traitTxt=T=>!T?'':T.k==='sup'?`${SUP[T.s][0]} ${SUP[T.s][1]}: ${SUP[T.s][2]}（1回だけ）`:T.k==='cd'?`⏳ チャージ: 攻撃の あと ${T.n}ターン 休む`:T.k==='en'?`🔋 エネルギー: 攻撃に ✨を ${T.n} 使う`:'🃏 切り札: 1回だけ 大技（2ばい・防御むし）。 そのあとは 守りだけ';

/* ================================================================ the picture */
const ART=CG_ART_SRC.trim().split(/\s+/).map(x=>{const i=x.indexOf(':');return [x.slice(0,i),x.slice(i+1)]}).sort((a,b)=>b[0].length-a[0].length);
let EN=null;
function enDict(){if(EN)return EN;EN={};W.forEach(c=>{if(c.e&&!EN[c.h])EN[c.h]=c.e});TR().forEach(t=>{const k=t.en.toLowerCase();if(!EN[k])EN[k]=t.e});return EN}
const FALL={ani:['🐾','🐚','🦋','🌿'],food:['🍽️','🧺','🥄'],nat:['🌿','🌊','⛅','🌏'],heart:['💗','💭','🫶','✨'],act:['🏃','👣','🙌','💨'],look:['🎨','🔍','✨','🪞'],
 life:['🏠','🎒','🧺','🛋️'],learn:['📚','🔎','📝','🏛️'],word:['💬','🗨️','🔤','📣'],tr:['🎁'],part:['🧩'],sent:['📜']};
const artMemo={};
/* [main picture, second picture or ''] */
function art(I){if(artMemo[I.id])return artMemo[I.id];let r;
  if(I.k==='t')r=[I.e,''];else if(I.k==='p')r=['🧩',''];else if(I.k==='s')r=['📜',''];
  else{const D=enDict();let main=I.e||D[I.h]||'';const ms=[];let s=I.ja.replace(/〜/g,'');
    for(const [k,e] of ART){if(ms.length>=3)break;const i=s.indexOf(k);if(i>=0){ms.push([i,e]);s=s.slice(0,i)+'＿'.repeat(k.length)+s.slice(i+k.length)}}
    ms.sort((a,b)=>a[0]-b[0]);const es=[...new Set(ms.map(x=>x[1]))].filter(e=>e!==main);
    /* a phrase: the pictures of its words */
    if(!main&&/ /.test(I.h)){const ws=I.h.split(' ').map(x=>D[x]).filter(Boolean);if(ws.length){main=ws[0];if(ws[1]&&ws[1]!==main)es.unshift(ws[1])}}
    if(!main)main=es.shift()||'';const f=FALL[I.a]||FALL.learn,hh=hash(I.id);
    if(!main)main=f[hh%f.length];
    r=[main,es[0]||(I.e?'':f[(hh>>4)%f.length]===main?'':(es.length?'':(hh%3?'':f[(hh>>4)%f.length])))]}
  return artMemo[I.id]=r}
/* the background pattern: every card is a little different */
function pat(I){const h=hash(I.id+'#'),r=n=>(h>>>n)%100;
  const kind=h%5,x1=r(3),y1=r(9)%60,x2=r(15),y2=40+r(21)%55,s1=8+r(4)%16,s2=6+r(12)%12,ang=(h>>>7)%180,w=3+(h>>>17)%6;
  const a=`radial-gradient(circle at ${x1}% ${y1}%,rgba(255,255,255,.32) 0 ${s1}%,transparent ${s1+1}%)`,b=`radial-gradient(circle at ${x2}% ${y2}%,rgba(255,255,255,.18) 0 ${s2}%,transparent ${s2+1}%)`;
  const t=[`repeating-linear-gradient(${ang}deg,rgba(255,255,255,.07) 0 ${w}px,transparent ${w}px ${w*2}px)`,
    `repeating-radial-gradient(circle at ${x2}% ${y1}%,rgba(255,255,255,.08) 0 ${w}px,transparent ${w}px ${w*3}px)`,
    `radial-gradient(rgba(255,255,255,.12) 1px,transparent 1.5px) 0 0/${w+6}px ${w+6}px`,
    `repeating-conic-gradient(from ${ang}deg at ${x1}% ${y2}%,rgba(255,255,255,.07) 0 ${w*2}deg,transparent ${w*2}deg ${w*5}deg)`,
    `repeating-linear-gradient(${ang}deg,rgba(255,255,255,.06) 0 1px,transparent 1px ${w*2}px),repeating-linear-gradient(${ang+90}deg,rgba(255,255,255,.06) 0 1px,transparent 1px ${w*2}px)`][kind];
  return `${a},${b},${t}`}
const colOf=I=>I.k==='t'?'#c9a227':I.k==='p'?'#4c9aa8':I.k==='s'?'#b5564f':(ATTR[I.a]||ATTR.learn)[3];
const lvCol=I=>I.k==='w'?LV[I.lv].col:I.k==='t'?['','#9aa8bc','#c0c8d8','#ffd23f','#9fe8ff','#ff6ad5'][I.r]:I.k==='s'?'#ffcf7a':'#9fe8e0';
const lvTag=I=>I.k==='w'?LV[I.lv].k:I.k==='t'?['','N','R','SR','SSR','UR'][I.r]:I.k==='p'?'パーツ':'文';
const attrIco=I=>I.k==='t'?'🎁':I.k==='p'?'🧩':I.k==='s'?'📜':(ATTR[I.a]||ATTR.learn)[1];

/* one card. opt: {ja:show the meaning, lock:silhouette, big, mini, n:count, sel, pw:power override, nm:name override} */
function face(id,opt={}){const I=typeof id==='string'?info(id):id;if(!I)return '';const [m,s]=art(I),st=(I.k==='w'||I.k==='t')&&!opt.lock?star(I.id):0;
  const lock=opt.lock,pw=opt.pw!=null?opt.pw:power(I.id),nm=opt.nm||(I.k==='w'?head(I.en)===I.en.toLowerCase()?I.en:I.en.split(',')[0]:I.en);
  return `<div class="cgc ${I.k} ${lock?'lock':''} ${opt.big?'big':''} ${opt.mini?'mini':''} ${!lock&&kira(I.id)&&st?'kira':''} ${opt.sel?'sel':''} ${opt.cls||''}" data-id="${esc(I.id)}" style="--ac:${colOf(I)};--lc:${lvCol(I)};background-image:${lock?'none':pat(I)},linear-gradient(160deg,color-mix(in srgb,var(--ac) 45%,#fff) ,var(--ac) 62%,color-mix(in srgb,var(--ac) 60%,#000))">
    <div class="cgt"><span class="cgcost">${I.cost}</span><span class="cglv">${lvTag(I)}</span></div>
    <div class="cgart"><span class="cgm">${m}</span>${s?`<span class="cgs">${s}</span>`:''}</div>
    <div class="cgn"><b>${lock?'？？？':esc(nm)}</b>${opt.ja&&!lock?`<small>${esc(I.ja)}</small>`:''}</div>
    <div class="cgb"><span>${attrIco(I)}</span>${I.k==='p'||I.k==='w'||I.k==='t'?'':`<span class="cgpw">⚔${pw}</span>`}</div>
    ${!lock&&opt.marks!==false&&I.k==='w'&&weak(I.id)?'<i class="cgmk wk" title="苦手">😣</i>':''}${!lock&&opt.marks!==false&&I.k!=='p'&&forgot(I.id)?'<i class="cgmk fg" title="わすれかけ">💤</i>':''}
    ${opt.n>1?`<i class="cgcnt">×${opt.n}</i>`:''}</div>`}

/* ================================================================ quiz (used by the battle and the dojo) */
/* other cards to mix in as wrong choices: same level, the same kind of word if possible */
function others(I,n,key){const pool=I.k==='t'?TR().map(t=>({en:t.en,ja:t.ja,h:head(t.en),a:t.s})):W.filter(c=>c.lv===I.lv);
  const out=[],seen=new Set([I[key==='ja'?'ja':'h']]),sameA=pool.filter(c=>c.a===I.a);
  const take=src=>{for(let t=0;t<60&&out.length<n;t++){const c=pickL(src);const v=key==='ja'?c.ja:c.h;if(!c||seen.has(v)||c.ja===I.ja)continue;seen.add(v);out.push(c)}};
  take(sameA.length>8?sameA:pool);take(pool);return out}
/* misspellings that look real */
function misspell(w){const out=new Set(),V='aeiou';const tries=[
  ()=>{const i=1+Math.random()*(w.length-2)|0;return w.slice(0,i)+w[i+1]+w[i]+w.slice(i+2)},
  ()=>{const i=[...w].findIndex((c,j)=>c===w[j+1]);return i>=0?w.slice(0,i)+w.slice(i+1):w.replace(/([bcdfglmnprst])/,'$1$1')},
  ()=>{const i=[...w].map((c,j)=>V.includes(c)?j:-1).filter(j=>j>0);if(!i.length)return w+'e';const j=pickL(i);return w.slice(0,j)+pickL([...V].filter(v=>v!==w[j]))+w.slice(j+1)},
  ()=>w.length>4?w.slice(0,-1)+(w.endsWith('e')?'':'e'):w+'e',
  ()=>w.replace(/(ph|f|ck|k|c)/,m=>({ph:'f',f:'ph',ck:'k',k:'ck',c:'k'})[m])];
  for(let t=0;t<40&&out.size<3;t++){const x=pickL(tries)();if(x&&x!==w&&!hasHead(x)&&/^[a-z-]+$/.test(x))out.add(x)}return [...out]}
const QT={tf:'あってる？',miss:'ぬけた 文字は？',mean:'いみは？',rev:'英語で いうと？',spell:'ただしい つづりは？',listen:'聞こえた ことばは？',fill:'あなうめ',form:'変身！',combo:'ことばコンボ',read:'相手の 単語を 読もう'};
/* a question about a card. opt.n = choices (4), opt.type to force a kind */
function quiz(id,opt={}){const I=typeof id==='string'?info(id):id;const n=opt.n||4,h=I.h;let types=opt.type?[opt.type]:null;
  if(!types){types=['mean','mean','mean','rev','rev'];
    if(I.k==='w'&&/^[a-z]{3,}$/.test(h))types.push('spell','spell');
    if(ST.sound)types.push('listen','listen');
    if(I.k==='w'&&combosWith(h).length)types.push('fill','fill')}
  let t=pickL(types);if(opt.avoid&&types.some(x=>x!==opt.avoid))while(t===opt.avoid)t=pickL(types);
  const say=I.k==='t'?['cards',I.en]:[I.lv,I.en];
  const tip=explain(I);
  if(t==='spell'){const wr=misspell(h);if(wr.length>=Math.min(3,n-1)){const ch=H.shuffle([h,...wr.slice(0,n-1)]);
    return {t,I,q:`<span class="qja">${esc(I.ja)}</span>`,ch,ans:ch.indexOf(h),hint:`さいしょは <b>${esc(h[0])}</b>、 ${h.length}文字`,tip,say}}t='mean'}
  if(t==='fill'){const c=pickL(combosWith(h)),other=c.a===h?c.b:c.a;const blank=c.p.replace(new RegExp('\\b'+h.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'\\b','i'),'＿＿＿');
    if(blank!==c.p){const ws=others(I,n-1,'h').map(x=>x.h);const ch=H.shuffle([h,...ws]);
      return {t,I,q:`<span class="qen">${esc(blank)}</span><span class="qja">${esc(c.j)}</span>`,ch,ans:ch.indexOf(h),hint:`${esc(other)} と いっしょに よく 使う ことば。 いみは「${esc(I.ja)}」`,tip:`<b>${esc(c.p)}</b> ＝ ${esc(c.j)}<br>`+tip,say,combo:c}}t='mean'}
  if(t==='listen'){const ws=others(I,n-1,'h');const ch=H.shuffle([I.en,...ws.map(x=>x.en)]);
    return {t,I,q:`<button class="qplay" data-play="1">🔊 もう いちど</button>`,ch,ans:ch.indexOf(I.en),hint:`いみは「${esc(I.ja)}」`,tip,say,auto:1}}
  if(t==='rev'){const ws=others(I,n-1,'h');const ch=H.shuffle([I.en,...ws.map(x=>x.en)]);
    return {t,I,q:`<span class="qja">${esc(I.ja)}</span>`,ch,ans:ch.indexOf(I.en),hint:`さいしょは <b>${esc(I.en[0])}</b>`,tip,say}}
  const ws=others(I,n-1,'ja');const ch=H.shuffle([I.ja,...ws.map(x=>x.ja)]);
  return {t:'mean',I,q:`<span class="qen">${esc(I.en)}</span>`,ch,ans:ch.indexOf(I.ja),hint:`${(ATTR[I.a]||[0,'🎁','宝'])[1]} ${(ATTR[I.a]||[0,0,'宝カード'])[2]}の ことば。 さいしょの 字は「${esc(I.ja[0])}」`,tip,say}}
/* a word's little lesson (shown after a miss) */
function explain(I){const h=I.h,out=[];
  if(I.k==='w'&&/,/.test(I.en))out.push(`変化: <b>${esc(I.en)}</b>`);
  const cs=combosWith(h);if(cs.length){const c=pickL(cs);out.push(`🔗 <b>${esc(c.p)}</b>（${esc(c.j)}）`)}
  if(ANTO[h])out.push(`⚡ 反対: <b>${esc([...ANTO[h]][0])}</b>`);if(SYN[h])out.push(`🛡️ なかま: <b>${esc([...SYN[h]].slice(0,2).join(', '))}</b>`);
  return `<b>${esc(I.en)}</b> ＝ ${esc(I.ja)}${out.length?'<br><small>'+out.slice(0,2).join('　')+'</small>':''}`}
/* the irregular forms of a verb card: "teach, taught, taught" → ["teach","taught","taught"] */
const formsOf=I=>I&&I.k==='w'&&/^[a-z]+, [a-z/]+, [a-z/]+$/i.test(I.en)?I.en.split(', '):null;
/* a question on the past form (変身) */
function formQuiz(I){const f=formsOf(I);if(!f)return null;const base=f[0],past=f[1].split('/')[0];
  const fake=new Set([base+(base.endsWith('e')?'d':'ed'),past.replace(/ght$/,'te'),base.replace(/([aeiou])([^aeiou]*)$/,'o$2'),base+'en',past+'ed',base.replace(/i/,'a')]);
  fake.delete(past);fake.delete(base);const ch=H.shuffle([past,...H.shuffle([...fake].filter(x=>x&&x!==past)).slice(0,3)]);
  return {t:'form',I,q:`<span class="qen">${esc(base)}</span><span class="qja">${esc(I.ja)} → 過去形は？</span>`,ch,ans:ch.indexOf(past),hint:`3つの 形は ${esc(base)} / ？ / ${esc(f[2])}`,tip:`<b>${esc(f.join(' – '))}</b>（${esc(I.ja)}）<br><small>不規則に かわる 動詞は 3つ セットで 声に 出して おぼえよう</small>`,say:[I.lv,I.en],past}}
/* show a quiz in an element; done({ok,hint}) */
function ask(box,q,done,opt={}){let hint=false,over=false;const nh=opt.noHint;box._q=q;
  box.innerHTML=`<div class="cgq"><div class="cgqt">${QT[q.t]||''}${opt.tag?`<em>${opt.tag}</em>`:''}</div>
    <div class="cgqq">${q.q}</div><div class="cgqh" hidden></div>
    <div class="cgqc">${q.ch.map((c,i)=>`<button data-i="${i}">${esc(c)}</button>`).join('')}</div>
    <div class="cgqf">${nh?'':'<button class="sub" data-h="1">💡 ヒント</button>'}</div><div class="cgqx" hidden></div></div>`;
  const sayIt=()=>{try{H.say(q.say[0],q.say[1])}catch(e){}};
  if(q.auto)setTimeout(sayIt,250);   // only the listening question speaks first; every other question speaks once, after the answer
  box.querySelectorAll('[data-play]').forEach(b=>b.onclick=e=>{e.stopPropagation();sayIt()});
  const hb=box.querySelector('[data-h]');if(hb)hb.onclick=()=>{if(over||hint)return;hint=true;sf('pickup');const el=box.querySelector('.cgqh');el.hidden=false;el.innerHTML='💡 '+q.hint;hb.disabled=true;opt.onHint&&opt.onHint()};
  box.querySelectorAll('.cgqc button').forEach(b=>b.onclick=()=>{if(over)return;over=true;const i=+b.dataset.i,ok=i===q.ans;
    box.querySelectorAll('.cgqc button').forEach(x=>{x.disabled=true;if(+x.dataset.i===q.ans)x.classList.add('ok')});
    if(ok){b.classList.add('ok');sf('correct');if(!q.auto&&!opt.quiet)sayIt();setTimeout(()=>done({ok:true,hint}),opt.fast?450:750)}
    else{b.classList.add('ng');sf('wrong');const x=box.querySelector('.cgqx');x.hidden=false;
      x.innerHTML=`<p>${q.tip}</p><button class="nx">つぎへ ▶</button>`;if(!opt.quiet)sayIt();
      if(opt.onWrong)try{opt.onWrong(x,q)}catch(e){}
      x.querySelector('.nx').onclick=()=>{sf('step');done({ok:false,hint})};
      setTimeout(()=>x.scrollIntoView({block:'nearest',behavior:'smooth'}),50)}})}

/* ================================================================ overlay */
function ov(html,cls=''){closeOv();const o=document.createElement('div');o.id='cardOv';o.className='cgov '+cls;o.innerHTML=html;document.body.appendChild(o);
  o.addEventListener('click',e=>{if(e.target===o&&!o.dataset.stay){sf('back');closeOv()}});return o}
function closeOv(){const o=$('cardOv');if(o)o.remove()}

/* 📖 くわしく: その ことばの 説明・例文・形の かわり方・いっしょに 使う ことば・ワンポイント（データと 規則は game/winfo.js） */
function more(I){const h=I.h,WI=window.WI,out=[];
  if(I.k==='p')return `<details class="cgfold wif" open><summary>📖 くわしく</summary><p class="wid">${esc(I.en)} は「${esc(I.ja)}」を あらわす 部品。 ほかの ことばに くっついて 意味を かえるよ</p>
    <p>🧩 できる 単語: ${DERIV.filter(d=>d.p===I.part).slice(0,12).map(d=>`<b>${esc(d.d)}</b>`).join(', ')}</p></details>`;
  if(I.k==='s')return `<details class="cgfold wif" open><summary>📖 くわしく</summary><div class="wiex"><p class="en">${esc(I.en)} <button class="wisay" data-wisay="${esc(I.en)}" aria-label="英語を 聞く">🔊</button></p><p class="ja">${esc(I.ja)}</p></div>
    <p class="witip">💡 声に 出して 3回 読むと、 文の リズムが 体に 入るよ</p></details>`;
  if(!WI)return '';
  const x=Object.assign({},WI.get(h,I.k)||{}),f=WI.forms(I),pn=WI.POSN[f.p]||'',ex=WI.exOf(h,I.k);
  const jn=t=>String(t||'').replace(/[（）()・、\s]/g,'');if(x.d&&(jn(x.d)===jn(I.ja)||jn(I.ja).includes(jn(x.d))))x.d='';
  if(x.d||pn)out.push(`<p class="wid">${pn?`<i class="wipos">${pn}</i>`:''}${x.d?esc(x.d):''}</p>`);
  if(ex)out.push(`<div class="wiex"><p class="en">${esc(ex[0])} <button class="wisay" data-wisay="${esc(ex[0])}" aria-label="例文を 聞く">🔊</button></p><p class="ja">${esc(ex[1])}</p></div>`);
  if(f.rows.length)out.push(`<div class="wifm">${f.rows.map(r=>`<span><b>${esc(r[0])}</b><small>${esc(r[1])}</small></span>`).join('')}</div>`);
  if(x.tip&&/数え/.test(x.tip))f.unc=0;
  if(f.unc)out.push(`<p class="wisub">🫗 数えられない 名詞: a を つけず、 s も つけない（${/^(water|milk|juice|tea|coffee)$/.test(h)?'a glass of '+h:/^(bread|cake|cheese|meat|paper)$/.test(h)?'a piece of '+h:/^(rice|sugar|salt|flour)$/.test(h)?'a bowl of / a lot of '+h:'much '+h+' / a lot of '+h}）</p>`);
  const cs=I.k==='w'||I.k==='t'?combosWith(h):[];
  if(cs.length)out.push(`<p>🔗 いっしょに: ${cs.slice(0,3).map(c=>`<b>${esc(c.p)}</b>（${esc(c.j)}）`).join('、 ')}</p>`);
  const ant=ANTO[h]?[...ANTO[h]].slice(0,3):[],syn=SYN[h]?[...SYN[h]].slice(0,4):[];
  if(ant.length||syn.length)out.push(`<p>${ant.length?`⚡ 反対: <b>${esc(ant.join(', '))}</b>`:''}${ant.length&&syn.length?'　':''}${syn.length?`🛡️ にた ことば: ${esc(syn.join(', '))}`:''}</p>`);
  /* 🧩 なりたち: 部品 → なぜ その 意味に なるか → おなじ 根っこの なかま（データは game/winfo-roots*.js） */
  const rt=WI.root?WI.root(h,hasHead):null,dv=DERIV.find(d=>d.d===h),fam=DERIV.filter(d=>d.b===h).slice(0,4);
  if(rt){const ml=rootMina(rt);
    out.push(`<div class="wirt"><p>🧩 なりたち: ${WI.rootHtml(rt.parts,esc)}</p>${rt.story?`<p class="wirs">${esc(rt.story)}</p>`:''}${rt.fam.length?`<p class="wirf">🌱 おなじ 根っこ: ${rt.fam.slice(0,5).map(w=>`<b>${esc(w)}</b>`).join(', ')}</p>`:''}${ml?`<p class="wirm">👩‍🏫 ${esc(ml)}</p>`:''}</div>`);
    if(x.tip){const t=x.tip.split('。').map(z=>z.trim()).filter(z=>z&&!(/＋/.test(z)&&/^[a-z@]/i.test(z))).join('。 ');x.tip=t}}
  else if(dv){const P=CG_PARTS[dv.p],bc=cardOfHead(dv.b),bj=bc?String(bc.ja).split(/[・、,，（(]/)[0].trim():'',pre=!/^-/.test(P[0]);
    const bp=`<b>${esc(dv.b)}</b>${bj?`（${esc(bj)}）`:''}`,pp=`<b>${esc(P[0])}</b>（${esc(P[1])}）`;
    out.push(`<div class="wirt"><p>🧩 なりたち: ${pre?pp+' ＋ '+bp:bp+' ＋ '+pp}</p><p class="wirs">${esc(bj||dv.b)} ＋ 「${esc(P[1])}」 → ${esc(I.ja)}</p></div>`)}
  else if(fam.length)out.push(`<p>🧩 なかまの ことば: ${fam.map(d=>`<b>${esc(d.d)}</b>`).join(', ')}</p>`);
  const tips=[];if(x.tip)tips.push(esc(x.tip));
  const wr=WRONG.find(w=>w.a===h||w.b===h);if(wr&&tips.length<2)tips.push(`×「${esc(wr.a)} ${esc(wr.b)}」→ ⭕「${esc(wr.ok)}」 ${esc(wr.why)}`);
  if(x.tip&&(f.p==='np'||f.rows.some(r=>x.tip.includes(String(r[0]).split(/[ /]/).pop()))))f.tips=[];
  f.tips.slice(0,x.tip?1:2).slice(0,Math.max(0,3-tips.length)).forEach(t=>tips.push(t));
  if(tips.length)out.push(`<div class="witip">${tips.map(t=>`<p>💡 ${t}</p>`).join('')}</div>`);
  if(!out.length)return '';
  return `<details class="cgfold wif" open><summary>📖 くわしく</summary>${out.join('')}</details>`}
/* なりたちの 下の ミナ先生の ひとこと（おなじ 根っこの なかまが いれば その 話） */
function rootMina(rt){try{if(!window.MINA||!MINA.line)return '';const f=rt.fam;
  /* 名前から・日本語から・言い回し・数の ことばは ときどき その 話 */
  const kind=/日本語から/.test(rt.story+rt.parts)?'wi_rootLoan':/^(teen|ty|lif)$/.test(rt.keys[0]||'')?'wi_rootNum':/：[^）]*名前|地名/.test(rt.parts)?'wi_rootName':/ /.test(rt.h)&&!f.length?'wi_rootPhrase':'';
  if(kind&&Math.random()<.6){const [,k]=MINA.line(kind,{w:rt.h});if(k)return k}
  const [,tx]=f.length>=2&&Math.random()<.6?MINA.line('wi_rootFam',{w:rt.h,f:f[0],g:f[1]}):f.length===1&&Math.random()<.5?MINA.line('wi_rootFam1',{w:rt.h,f:f[0]}):MINA.line('wi_root',{w:rt.h});return tx||''}catch(e){return ''}}
/* くわしくの 中の 🔊 と、 ひらいた 回数 */
function bindMore(o){o.querySelectorAll('[data-wisay]').forEach(b=>b.onclick=e=>{e.stopPropagation();sf('pickup');window.WI?WI.speak(b.dataset.wisay):speak(b.dataset.wisay)});
  o.querySelectorAll('.wif').forEach(fd=>fd.addEventListener('toggle',()=>{if(fd.open){CG.wiSeen=(CG.wiSeen||0)+1;save()}}))}
/* ほかの 画面（鉱山で 見つけた・仕入れ）に うめこむ くわしく: さいしょは とじておき、 タップで ひらく */
const moreClosed=I=>more(I).replace('<details class="cgfold wif" open>','<details class="cgfold wif">');
/* the big card: tap 🔊, its combos, friends and opposites
   11/18 ユーザー「タップしたら この画面に」: カードを タップする 所は ぜんぶ この 画面（倉庫・売り場・ブック・仕入れ・鉱山・お客さんの 帯 など）。
   opt.top: ほかの 画面（見つけた！ など）の 上に 重ねて ひらく（#cardTop。 とじると 下の 画面に もどる）
   opt.btns: [[ラベル, fn]] その 場所での ボタン（売り場から 下げる・ブックから 出す・仕入れる など）。 押すと この 画面を とじてから fn
   外側を タップ・とじる → back */
function detail(id,back,opt={}){const I=info(id);if(!I)return;const n=count(id),own=n>0,x=stat(id),h=I.h;
  const cs=I.k==='w'?combosWith(h):[],known=cs.filter(c=>CG.combo[c.k]);const top=!!opt.top;
  const html=`<div class="cgdv">${face(id,{big:1,ja:own})}
    <div class="cgdi">
      <button class="cgsay" data-dv="say">🔊 ${esc(I.en)}</button>
      <p class="cgdj">${esc(I.ja)}</p>
      ${window.UNK?UNK.cardBox(I,own):''}
      ${I.k==='w'||I.k==='t'?`<p class="cgds">${own?`もっている かず ×${n}`:'まだ もっていない'}</p>`:''}
      ${more(I)}
      ${(opt.btns||[]).filter(Boolean).map((b,i)=>`<button data-dvb="${i}" class="${b[2]||''}">${b[0]}</button>`).join('')}
      <button class="sub" data-dv="close">とじる</button></div></div>`;
  let o;if(top){closeTop();o=document.createElement('div');o.id='cardTop';o.className='cgov dv';o.innerHTML=html;document.body.appendChild(o)}else o=ov(html,'dv');
  const shut=()=>{if(top)o.remove();else closeOv()};
  o.addEventListener('click',e=>{if(e.target!==o)return;if(top){sf('back');o.remove()}back&&back()});
  const say=()=>{try{H.say(I.k==='t'?'cards':I.k==='p'?'es':I.lv,I.en)}catch(e){}};say();
  if(window.UNK)UNK.bind(o);
  bindMore(o);
  if(I.k!=='p'&&I.k!=='s'&&window.WI&&WI.root&&WI.root(h)){CG.rootSeen=(CG.rootSeen||0)+1}
  /* 見た 回数と さいきん 見た カード（ミナ先生の ひとこと 用） */
  const L=CG.look=CG.look||{n:0,ids:[]};L.n++;L.at=Date.now();L.ids=[id,...L.ids.filter(x=>x!==id)].slice(0,12);save();
  o.querySelector('[data-dv="say"]').onclick=say;
  o.querySelector('[data-dv="close"]').onclick=()=>{sf('back');shut();back&&back()};
  o.querySelectorAll('[data-dvb]').forEach(b=>b.onclick=()=>{const B=opt.btns.filter(Boolean)[+b.dataset.dvb];shut();B[1]()});
  lookTalk(I,opt.from);
  return o}
function closeTop(){const o=$('cardTop');if(o)o.remove()}
/* どこからでも: いまの 画面の 上に くわしく 画面を 重ねる（下に ポップアップが あれば その 上に） */
function peek(id,opt={}){if(!info(id))return;sf('card');return detail(id,opt.back||null,{...opt,top:!!$('cardOv')})}
/* root の 中の カードを タップで くわしく */
function peekIn(root,opt={}){if(!root)return;root.querySelectorAll('.cgc[data-id]').forEach(c=>{if(c.classList.contains('lock'))return;c.style.cursor='pointer';
  c.onclick=e=>{e.stopPropagation();peek(c.dataset.id,opt)}})}
/* ミナ先生の ひとこと: はじめて・10・50・100・300まい目… と、 なりたち／ワンポイントが ある カードを ときどき */
function lookTalk(I,from){const L=CG.look;let k='',v={w:(I.en||'').split(',')[0],ja:(I.ja||'').split(/[、,]/)[0],n:L.n};
  if(!CG.lookTold){CG.lookTold=1;save();k='cg_lookFirst'}
  else if([10,30,50,100,200,300,500,1000].includes(L.n))k='cg_lookN';
  else if(from&&Math.random()<.12)k='cg_lookFrom_'+from;
  else if(Math.random()<.04)k='cg_lookAny';
  if(!k)return;setTimeout(()=>{try{const [,tx]=MINA.line(k,v);if(tx&&!/^cg_look/.test(tx))H.toast(`👩‍🏫 <b>ミナ先生</b><small>${esc(tx)}</small>`,4200)}catch(e){}},900)}

/* ================================================================ combos in a list of cards */
const DECK_N=15;
function cleanDeck(){}
function deckCombos(ids){const hs=[...new Set(ids.map(id=>(info(id)||{}).h).filter(Boolean))],out=[];
  for(let i=0;i<hs.length;i++)for(let j=i+1;j<hs.length;j++){const c=comboOf(hs[i],hs[j]);if(c)out.push(c)}return out}

/* 段位（級）は なくした: どの レベルも さいしょから ひらいている */
const lvOpen=()=>true;

/* ================================================================ getting cards */
let fx=null;
/* 1パック 10まい前後（9〜11まい） */
const packN=()=>9+Math.floor(Math.random()*3);
/* パックに 入る 単語（ハイレベルは 入れない） */
let PW=null;const packW=()=>PW||(PW=W.filter(c=>c.lv!=='adv'));
const packHead=h=>{const c=cardOfHead(h);return c&&c.lv!=='adv'?c:null};
function packCards(kind,arg){const out=[],N=packN();if(arg==='adv')arg='hs';
  const W=packW(),cardOfHead=packHead;   // ハイレベルは 鉱山だけ
  const fresh=list=>{const f=list.filter(c=>!owns(c.id));return f.length&&Math.random()<.65?pickL(f):pickL(list)};
  if(kind==='lv'){const pool=W.filter(c=>c.lv===arg);
    const wk=H.shuffle([...weakHeads()].map(cardOfHead).filter(c=>c&&c.lv===arg));wk.slice(0,2).forEach(c=>out.push(c.id));
    /* a pair or two that make a combo */
    const cs=COMBO.filter(c=>cardOfHead(c.a)&&cardOfHead(c.b)&&(cardOfHead(c.a).lv===arg||cardOfHead(c.b).lv===arg));
    for(let k=0;k<2;k++)if(cs.length&&Math.random()<.6){const c=pickL(cs);out.push(cardOfHead(c.a).id,cardOfHead(c.b).id)}
    while(out.length<N)out.push(fresh(pool).id)}
  else if(kind==='at'){let pool=W.filter(c=>c.a===arg);if(!pool.length)pool=W;while(out.length<N)out.push(fresh(pool).id)}
  else if(kind==='part'){const ks=Object.keys(CG_PARTS);for(let i=0;i<5;i++){const k=pickL(ks);out.push('p:'+k);
      const ds=DERIV.filter(d=>d.p===k&&cardOfHead(d.b));if(ds.length&&i<4)out.push(cardOfHead(pickL(ds).b).id)}
    while(out.length<N)out.push(fresh(W).id)}
  else if(kind==='sent'){for(let k=0;k<2;k++){const nw=SENT.filter(s=>!owns('s:'+s.i)&&!out.includes('s:'+s.i)),s=pickL(nw.length?nw:SENT);out.push('s:'+s.i);
      sentWords(s).map(w=>cardOfHead(w.toLowerCase().replace(/[^a-z'-]/g,''))).filter(Boolean).slice(0,3).forEach(c=>out.push(c.id))}
    const lv=info(out[0]).lv,sp=W.filter(c=>c.lv===lv);while(out.length<N)out.push(fresh(sp.length?sp:W).id)}
  return out.slice(0,N)}
/* 💎 きらきら宝パック（もう 売っていない。 いい カードは 鉱山だけ） */
function kiraCards(n){if(!window.CARDS||!CARDS.pull)return [];return CARDS.pull(n,2).map(g=>({id:'t:'+g.c.e,isNew:g.isNew}))}
/* 📖 パックから そのまま カードブックへ（まだ ブックに ない 分だけ） */
function bookBtn(got){const B=window.CBOOK,b=$('cgbk');if(!B||!b)return;const ids=[...new Set(got.map(g=>g.id))].filter(B.canIn);if(!ids.length)return;
  b.hidden=false;b.textContent=`📖 ブックに 入れる（${ids.length}）`;
  b.onclick=()=>{const n=ids.filter(id=>B.putOne(id)).length;b.hidden=true;sf('card');H.toast(`📖 ${n}まい ブックに 入れたよ<small>カードショップの カードブックで 見られるよ</small>`,2200);B.mina('sh_bookIn1',{w:B.nm(info(ids[0])),p:B.label(ids[0])},.2)}}
/* put the cards in; returns [{id,isNew}] */
function receive(ids){return ids.map(id=>{const isNew=!owns(id);give(id);return {id,isNew}})}
/* open a pack on screen */
function reveal(got,title,back){save();cleanDeck();
  const o=ov(`<div class="cgopen"><div class="cgpk shake">🎴</div><p>${esc(title)}</p></div>`,'op');o.dataset.stay=1;sf('card');
  setTimeout(()=>{if(!o.isConnected)return;sf('done');o.querySelector('.cgopen').classList.add('burst')},800);
  setTimeout(()=>{if(!o.isConnected)return;
    o.innerHTML=`<div class="cgres">${got.map((g,i)=>`<div class="cgslot" data-i="${i}"><div class="cgback">✦</div>${face(g.id,{ja:1})}${g.isNew?'<em class="cgnew">NEW!</em>':''}</div>`).join('')}</div>
      <div class="cgwi" id="cgwi"></div><p class="cgwit" id="cgwit" hidden>📖 めくった カードを タップすると くわしく 見られるよ</p>
      <div class="cgresb"><button id="cgall">ぜんぶ めくる</button><button id="cgbk" class="cgbk" hidden></button><button id="cgok" class="sub" hidden>OK</button></div>`;
    const slots=[...o.querySelectorAll('.cgslot')];let left=slots.length;
    const flip=s=>{if(s.classList.contains('open'))return;s.classList.add('open');const g=got[+s.dataset.i],I=info(g.id);sf('flip');
      if(I.k==='w')setTimeout(()=>{try{H.say(I.lv,I.en)}catch(e){}},150);
      if(--left===0){$('cgall').hidden=true;$('cgok').hidden=false;bookBtn(got);if(window.WI&&$('cgwit'))$('cgwit').hidden=false;
        const np=got.filter(g=>g.isNew).map(g=>info(g.id)).filter(I=>I.k==='w');const cs=deckCombos(Object.keys(CG.c)).filter(c=>np.some(I=>I.h===c.a||I.h===c.b)&&!CG.combo[c.k]);
        if(cs.length)H.toast(`✨ コンボの なかまが そろったかも…？<small>鉱山の あなうめで 見つかるよ</small>`,3200)}};
    const showMore=I=>{const w=$('cgwi');if(!w||!I)return;const m=more(I);w.innerHTML=m?`<p class="cgwih"><b>${esc(I.en)}</b> ${esc(I.ja)}</p>`+m:'';bindMore(w)};
    slots.forEach(s=>s.onclick=()=>{if(s.classList.contains('open')){const I=info(got[+s.dataset.i].id);try{H.say(I.k==='t'?'cards':I.lv,I.en)}catch(e){}
      slots.forEach(x=>x.classList.toggle('sel',x===s));showMore(I)}else flip(s)});
    $('cgall').onclick=()=>slots.forEach((s,i)=>setTimeout(()=>flip(s),i*140));
    $('cgok').onclick=()=>{sf('back');closeOv();back&&back()};
    setTimeout(()=>slots[0]&&flip(slots[0]),300)},1400)}

/* ================================================================ the hut on the beach */
const HUT=`<svg viewBox="0 0 72 64" aria-hidden="true">
  <ellipse cx="36" cy="60.6" rx="34" ry="2.8" fill="rgba(0,0,0,.26)"/>
  <rect x="9" y="24" width="54" height="34" fill="#f7e3b8" stroke="#6b4a2a" stroke-width="1.2"/>
  <path d="M18 24 V58 M27 24 V58 M36 24 V58 M45 24 V58 M54 24 V58" stroke="#e6c891" stroke-width=".7"/>
  <rect x="5" y="57" width="62" height="3.4" rx="1" fill="#b68a5a" stroke="#6b4a2a" stroke-width=".6"/>
  <path d="M2 26.6 L36 7 L70 26.6 Z" fill="#2fa7a0" stroke="#0c3b3f" stroke-width="1.3" stroke-linejoin="round"/>
  <path d="M7 25 L36 8.6 L65 25" fill="none" stroke="#e8fff8" stroke-width="1" stroke-dasharray="3 3"/>
  <rect x="21" y="14.6" width="30" height="8.6" rx="2.2" fill="#fff6dd" stroke="#6b4a2a" stroke-width=".8"/>
  <text x="36" y="21" text-anchor="middle" font-size="6" font-weight="800" fill="#0c3b3f" font-family="sans-serif" letter-spacing=".3">CARDS</text>
  <path d="M36 7 L36 0.6" stroke="#6b4a2a" stroke-width=".8"/><path d="M36 .6 L43 2.6 L36 4.6 Z" fill="#ff6a8a"/>
  <rect x="13" y="34" width="26" height="15" rx="1" fill="var(--win,#3d4a6b)" stroke="#6b4a2a" stroke-width="1"/>
  <g transform="rotate(-14 21 44)"><rect x="17" y="37" width="7.4" height="10.4" rx="1" fill="#ff8a5a" stroke="#fff" stroke-width=".8"/><text x="20.7" y="44" font-size="4" text-anchor="middle" fill="#fff">★</text></g>
  <g><rect x="22.4" y="36" width="7.4" height="10.4" rx="1" fill="#ffcf4a" stroke="#fff" stroke-width=".8"/><text x="26.1" y="43" font-size="4" text-anchor="middle" fill="#fff">A</text></g>
  <g transform="rotate(14 31 44)"><rect x="28.2" y="37" width="7.4" height="10.4" rx="1" fill="#5ab4ff" stroke="#fff" stroke-width=".8"/><text x="31.9" y="44" font-size="4" text-anchor="middle" fill="#fff">♥</text></g>
  <rect x="12" y="48.6" width="28" height="2" rx=".6" fill="#c49462"/>
  <path d="M12 30 L17 30 L17 34 Q14.5 36.6 12 34 Z" fill="#2fa7a0"/><path d="M17 30 L22 30 L22 34 Q19.5 36.6 17 34 Z" fill="#f4fffb"/><path d="M22 30 L27 30 L27 34 Q24.5 36.6 22 34 Z" fill="#2fa7a0"/><path d="M27 30 L32 30 L32 34 Q29.5 36.6 27 34 Z" fill="#f4fffb"/><path d="M32 30 L37 30 L37 34 Q34.5 36.6 32 34 Z" fill="#2fa7a0"/><path d="M37 30 L42 30 L42 34 Q39.5 36.6 37 34 Z" fill="#f4fffb"/>
  <rect x="44" y="34" width="14" height="23" rx="1.4" fill="#9c6b3d" stroke="#6b4a2a"/><rect x="46" y="36.4" width="10" height="7" rx=".8" fill="var(--win,#3d4a6b)" opacity=".85"/>
  <circle cx="55.6" cy="47" r=".9" fill="#ffd27a"/>
  <path d="M48.4 44.6 L51 42.6 L53.6 44.6" stroke="#6b4a2a" stroke-width=".4" fill="none"/><rect x="47" y="44.6" width="8" height="3.6" rx=".6" fill="#fff"/>
  <text x="51" y="47.4" font-size="2.6" text-anchor="middle" fill="#2fa7a0" font-weight="bold" font-family="sans-serif">OPEN</text>
  <g class="cgPlant"><path d="M61 52 L67 52 L66.2 57.6 L61.8 57.6 Z" fill="#e8863e"/><path d="M64 52 Q60 46 61.6 44 M64 52 Q64 45 66 43 M64 52 Q68 47 69.4 47.6" stroke="#3f9a4f" stroke-width="1.6" fill="none" stroke-linecap="round"/></g>
  <g class="cgStand" transform="rotate(-8 5 50)"><path d="M3 58 L5 52" stroke="#6b4a2a" stroke-width=".8"/><rect x="0.4" y="40" width="9.2" height="13" rx="1.2" fill="#fff" stroke="#0c3b3f" stroke-width=".6"/><rect x="1.6" y="41.2" width="6.8" height="10.6" rx=".8" fill="#ff6a8a"/><text x="5" y="48.6" font-size="5" text-anchor="middle" fill="#fff">★</text></g>
  <g class="cgL"><circle cx="4.0" cy="27.4" r="1.1" fill="#ffd27a"/><circle cx="12.0" cy="22.9" r="1.1" fill="#ff9ab0"/><circle cx="20.0" cy="18.4" r="1.1" fill="#9ae6ff"/><circle cx="28.0" cy="13.9" r="1.1" fill="#ffd27a"/><circle cx="36.0" cy="9.4" r="1.1" fill="#ff9ab0"/><circle cx="44.0" cy="13.9" r="1.1" fill="#9ae6ff"/><circle cx="52.0" cy="18.4" r="1.1" fill="#ffd27a"/><circle cx="60.0" cy="22.9" r="1.1" fill="#ff9ab0"/><circle cx="68.0" cy="27.4" r="1.1" fill="#9ae6ff"/></g>
</svg>`;
/* the night light: drawn on top of the hut, outside its darkening filter. A soft warm window and the roof's little bulbs (opacity follows --dk) */
const HUT_GLOW=`<svg viewBox="0 0 72 64" aria-hidden="true">
  <defs><radialGradient id="cgGlow"><stop offset="0" stop-color="rgba(255,206,130,.7)"/><stop offset="1" stop-color="rgba(255,206,130,0)"/></radialGradient></defs>
  <ellipse cx="36" cy="60" rx="30" ry="4.4" fill="url(#cgGlow)" opacity=".45"/>
  <ellipse cx="26" cy="42" rx="22" ry="14" fill="url(#cgGlow)" opacity=".75"/>
  <rect x="13.5" y="34.5" width="25" height="14" rx=".8" fill="#ffd690" opacity=".45"/><rect x="46" y="36.4" width="10" height="7" rx=".8" fill="#ffd690" opacity=".8"/>
  <g class="cgLg"><circle cx="4.0" cy="27.4" r="2.6" fill="#ffd27a" opacity=".3"/><circle cx="4.0" cy="27.4" r="1" fill="#ffd27a"/><circle cx="12.0" cy="22.9" r="2.6" fill="#ff9ab0" opacity=".3"/><circle cx="12.0" cy="22.9" r="1" fill="#ff9ab0"/><circle cx="20.0" cy="18.4" r="2.6" fill="#9ae6ff" opacity=".3"/><circle cx="20.0" cy="18.4" r="1" fill="#9ae6ff"/><circle cx="28.0" cy="13.9" r="2.6" fill="#ffd27a" opacity=".3"/><circle cx="28.0" cy="13.9" r="1" fill="#ffd27a"/><circle cx="36.0" cy="9.4" r="2.6" fill="#ff9ab0" opacity=".3"/><circle cx="36.0" cy="9.4" r="1" fill="#ff9ab0"/><circle cx="44.0" cy="13.9" r="2.6" fill="#9ae6ff" opacity=".3"/><circle cx="44.0" cy="13.9" r="1" fill="#9ae6ff"/><circle cx="52.0" cy="18.4" r="2.6" fill="#ffd27a" opacity=".3"/><circle cx="52.0" cy="18.4" r="1" fill="#ffd27a"/><circle cx="60.0" cy="22.9" r="2.6" fill="#ff9ab0" opacity=".3"/><circle cx="60.0" cy="22.9" r="1" fill="#ff9ab0"/><circle cx="68.0" cy="27.4" r="2.6" fill="#9ae6ff" opacity=".3"/><circle cx="68.0" cy="27.4" r="1" fill="#9ae6ff"/></g>
</svg>`;
function hut(){let b=$('cgHut');const w=$('window');if(!w)return;
  if(!b){b=document.createElement('button');b.id='cgHut';b.setAttribute('aria-label','カードショップ しおさい');b.innerHTML=`<span class="cgBody">${HUT}</span><span class="cgGlow">${HUT_GLOW}</span>`;w.appendChild(b);
    b.onclick=e=>{e.stopPropagation();if(H.screen!=='home')return;sf('shop');open()}}
  let d;try{d=SCENE.dbg()}catch(e){return}
  /* right side of the sand, just left of the zakka hut (moved from .66 in v123). game.js sandSpots() keeps radios off this box */
  const k=d.k,wd=Math.round(54*k);b.style.width=wd+'px';
  b.style.left=Math.round(Math.min(d.WW*.74,d.WW*.9-25*k-wd/2-4)-wd/2)+'px';b.style.top=Math.round(d.shore-d.WT+42*k-wd*60.6/72)+'px';
  const dk=Math.max(0,Math.min(1,d.dark||0));b.style.setProperty('--dk',dk.toFixed(2));
  b.classList.toggle('off',H.screen!=='home')}
setTimeout(hut,600);addEventListener('resize',()=>setTimeout(hut,200));setInterval(hut,2500);
H.on('home',()=>setTimeout(hut,60));

/* ================================================================ the shop */
const NAGI={n:'ミオ',ico:'🙋‍♀️'};
let jaOn=true;
function bubble(en,ja){return `<div class="cgnagi"><span class="cgnf cgm">${window.MIO?MIO.face('smile'):NAGI.ico}</span><div class="cgnb"><b>${NAGI.n}</b><p class="en">${esc(en)}</p><p class="ja" ${jaOn?'':'hidden'}>${esc(ja)}</p></div></div>`}
function speak(en){try{if(!ST.sound||!window.speechSynthesis)return;speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(sayNames(en));u.lang='en-US';u.rate=ST.slow?.75:.95;u.pitch=1.05;speechSynthesis.speak(u)}catch(e){}}
function starter(){const pool=W.filter(c=>c.lv==='es');const ids=[];
  H.shuffle(COMBO.filter(c=>cardOfHead(c.a).lv==='es'&&cardOfHead(c.b).lv==='es')).slice(0,5).forEach(c=>ids.push(cardOfHead(c.a).id,cardOfHead(c.b).id));
  while(ids.length<15){const c=pickL(pool);if(!ids.includes(c.id))ids.push(c.id)}
  receive(ids);CG.deck=ids.slice();CG.met=1;save();return ids}
/* the shop's front is game/shop.js */
function open(){if(window.SHOP)return SHOP.open();H.home()}
/* 仕入れ と 鉱山 だけ（ほかの 売り場・図鑑・道場は なくした。 古い 呼び出しは お店の 入口へ） */
function go(t){({pack:()=>window.STOCK?STOCK.open():open(),mine:()=>window.MINE?MINE.open():open()}[t]||open)()}
const top=(t,right='')=>`<div class="qtop"><button class="x" id="cgb" aria-label="もどる">←</button><b>${t}</b><span class="qn">${right}</span></div>`;
const coinTxt=n=>`🪙${n}`;
function pay(n){if(ST.coins<n){H.toast('🪙 コインが たりないよ');sf('wrong');return false}ST.coins-=n;save();H.head();sf('buy');return true}

/* 🎁 仕入れ（パック）: ぜんぶ さいしょから 買える */
const PACK_P={part:350,sent:450,kira:1200,at:300};
function packList(){const L=[];LVK.filter(lv=>lv!=='adv').forEach(lv=>L.push({k:'lv',arg:lv,ico:'🎴',n:`${LV[lv].n}パック`,p:LV[lv].pack,lv}));
  CG_ATTR.forEach(a=>L.push({k:'at',arg:a[0],ico:a[1],n:`${a[2]}パック`,p:PACK_P.at}));
  L.push({k:'part',ico:'🧩',n:'語源パーツパック',p:PACK_P.part});
  L.push({k:'sent',ico:'📜',n:'文カードパック',p:PACK_P.sent});return L}   // 💎きらきら宝パック・ハイレベルパックは なくした（いい カードは 鉱山だけ）
/* 仕入れは 何回でも（11/16）。 CG.buy は きょう 何パック あけたか だけ 数える（ミオの 会話用） */
const BUY_N=Infinity;
const buyLeft=()=>1;
const buyToday=()=>CG.buy&&CG.buy.d===today()?CG.buy.n:0;
function packs(){if(window.STOCK)return STOCK.open();const L=packList(),free=CG.free!==today();
  H.show('cg',`<section class="pnl cgp">${top('🎁 仕入れ',coinTxt(ST.coins))}
    ${free?`<button class="cgfree" id="cgfree">🎁 きょうの むりょうパック（3まい）</button>`:''}
    <p class="cgleft">仕入れは 何回でも OK</p>
    <div class="cgpl">${L.map((p,i)=>`<button data-i="${i}"><span class="pi">${p.ico}</span><span class="pn">${esc(p.n)}</span><span class="pp">${coinTxt(p.p)}</span></button>`).join('')}</div>
    <p class="note">1パック 10まい前後。 まだ もっていない カードが 出やすいよ。<br>🎁宝カードと ハイレベルの 単語は ⛏️鉱山でしか 見つからないよ</p></section>`);
  $('cgb').onclick=()=>{sf('back');open()};
  if(free)$('cgfree').onclick=()=>{CG.free=today();const ids=packCards('lv',myLv()).slice(0,3);reveal(receive(ids),'きょうの むりょうパック',packs)};
  H.panel.querySelectorAll('[data-i]').forEach(b=>b.onclick=()=>buyAsk(L[+b.dataset.i]))}
const myLv=()=>{try{return MINA.level()}catch(e){return 'es'}};
/* buy: 買う / やめる だけ（会話なし） */
function buyAsk(p){
  if(ST.coins<p.p){H.toast('🪙 コインが たりないよ');sf('wrong');return}
  const o=ov(`<div class="cgbuy"><b>${p.ico} ${esc(p.n)}　${coinTxt(p.p)}</b>
    <button id="cgqk">🎁 仕入れる</button><button id="cgno" class="sub">やめる</button></div>`,'by');
  $('cgno').onclick=()=>{sf('back');closeOv()};
  $('cgqk').onclick=()=>{closeOv();if(!pay(p.p))return;const d=today();CG.buy=CG.buy&&CG.buy.d===d?CG.buy:{d,n:0};CG.buy.n++;save();deliver(p)}}
function deliver(p){try{RECENT.add('pack',{en:p.en||'',ja:p.n,ico:p.ico})}catch(e){}
  reveal(receive(packCards(p.k,p.arg)),p.n,packs)}

/* ♻️ 交換（かけら）は なくした。 ダブった カードは カードショップの 売り場で 売る。 前の かけらは コインに かえる */
function trade(){try{SHOP.floor()}catch(e){open()}}
setTimeout(function cash(){if(!(CG.sh>0)||typeof CG.sh!=='number')return;if(!H.addCoins)return setTimeout(cash,3000);const v=CG.sh*3;CG.sh=0;save();H.addCoins(v);H.toast(`🔹 かけらは なくなったので、 コイン 🪙${v} に かえたよ`,4200)},7000);

/* 🎴 no deck building: each battle shows 8 cards from your collection (gently balanced), you pick 4.
   today's wind (きょうの風) gives one kind of word ⚔+1 */
const ownAll=()=>[...ownedWords(),...TR().filter(t=>window.CARDS&&CARDS.has(t)).map(t=>'t:'+t.e)];
const BATTLE_N=4,CAND_N=8;
const wind=()=>CG_ATTR[hash('wind'+today())%CG_ATTR.length];
const strong=id=>{const T=trait(id);return T&&T.k!=='sup'};
/* the balance: a combo pair if you have one, at most 3 strong cards, one weak or sleepy card to practice, the rest at random */
function cands(){const own=H.shuffle(ownAll().filter(id=>info(id))),out=[];const add=id=>{if(out.length<CAND_N&&!out.includes(id)&&!(strong(id)&&out.filter(strong).length>=3))out.push(id)};
  const hs={};own.forEach(id=>{const I=info(id);(hs[I.h]=hs[I.h]||[]).push(id)});
  for(const c of H.shuffle(COMBO.slice()))if(hs[c.a]&&hs[c.b]){add(hs[c.a][0]);add(hs[c.b][0]);break}
  own.filter(id=>weak(id)||forgot(id)).slice(0,1).forEach(add);
  own.filter(strong).slice(0,2).forEach(add);
  own.forEach(add);return H.shuffle(out)}
function pickBattle(F,go,back){let cand=cands(),sel=[],rr=false,last=null;const need=Math.min(BATTLE_N,cand.length),W0=wind();
  const draw=()=>{const I=sel.map(info);let tip='';
    for(let i=0;i<I.length;i++)for(let j=i+1;j<I.length;j++){const c=comboOf(I[i].h,I[j].h)||comboOf(I[j].h,I[i].h);if(c)tip=CG.combo[c.k]?`🔗 <b>${esc(c.p)}</b> コンボ！`:'✨ なにか おきそう…'}
    const L=last&&info(last);
    H.show('cg',`<section class="pnl cgp cgpick">${top(`⚔️ ${esc(F.n)}`,`<b>${sel.length}</b>/${need}`)}
    <div class="pkhd"><b>🎴 ${need}まい えらぼう</b><small>🌬️ きょうの風: ${W0[1]} ${esc(W0[2])} は ⚔+1</small></div>
    <div class="cggrid g4 pkgrid">${cand.map((id,i)=>`<div class="dkw" style="animation-delay:${i*40}ms">${face(id,{ja:1,sel:sel.includes(id)})}${sel.includes(id)?`<i class="pkn">${sel.indexOf(id)+1}</i>`:''}</div>`).join('')}</div>
    <p class="pktip">${L?`<b>${esc(L.en.split(',')[0])}</b> ${esc(traitTxt(trait(L)))}`:'カードを タップすると 印の 説明が 出るよ'}${tip?'<br>'+tip:''}</p>
    <div class="row"><button id="pkrr" class="sub" ${rr?'disabled':''}>🎲 引きなおす${rr?'':'（1回）'}</button><button id="pkau" class="sub">🪄 おまかせ</button></div>
    <button id="pkgo" class="pkgo" ${sel.length===need&&need?'':'disabled'}>⚔️ これで 勝負！</button></section>`);
    $('cgb').onclick=()=>{sf('back');back?back():open()};
    H.panel.querySelectorAll('.pkgrid .cgc').forEach(c=>c.onclick=()=>{const id=c.dataset.id,i=sel.indexOf(id);last=id;if(i>=0)sel.splice(i,1);else if(sel.length<need)sel.push(id);else{sel.shift();sel.push(id)}sf('tap');draw()});
    $('pkrr').onclick=()=>{if(rr)return;rr=true;cand=cands();sel=[];last=null;sf('flip');draw()};
    $('pkau').onclick=()=>{sel=H.shuffle(cand.slice()).slice(0,need);sf('step');draw()};
    $('pkgo').onclick=()=>{if(sel.length<need)return;go(sel.slice())}};
  draw()}

/* a combo is found (battle / dojo): coins the first time */
function foundCombo(c){if(CG.combo[c.k])return false;CG.combo[c.k]=dnum();save();return true}
function metWrong(w){if(CG.wrong[w.k])return false;CG.wrong[w.k]=dnum();save();return true}

/* 大きな カードを タップすると その 英語を 読む（鉱山で 見つけた・くわしく 見る・カードブック など） */
function sayCard(id){const I=info(id);if(!I||!I.en)return;try{H.say(I.k==='t'?'cards':I.k==='p'?'es':I.lv,I.en)}catch(e){}}
/* 大きな カード: くわしく 画面の 中では タップで 読む。 ほかの 画面（見つけた！・買い取った！ など）では くわしく 画面を 上に ひらく */
document.addEventListener('click',e=>{const c=e.target.closest&&e.target.closest('.cgc.big');if(!c||c.classList.contains('lock')||!c.dataset.id)return;
  if(!c.closest('.cgdv')||c.closest('.cbmenu'))return peek(c.dataset.id,{from:'big'});
  sayCard(c.dataset.id);c.classList.remove('tapsay');void c.offsetWidth;c.classList.add('tapsay')});
window.CG={more,moreClosed,bindMore,open,sayCard,go,starter,info,face,art,quiz,formQuiz,formsOf,ask,ov,closeOv,detail,peek,peekIn,closeTop,count,owns,give,take,receive,reveal,record,star,kira,weak,forgot,power,
  lvOpen,deckCombos,cleanDeck,comboOf,combosWith,wrongOf:(a,b)=>WRG[a+'|'+b]||null,anto:h=>ANTO[h]?[...ANTO[h]]:[],syn:h=>SYN[h]?[...SYN[h]]:[],
  derivOf,sentWords,cardOfHead,foundCombo,metWrong,pickL,hash,dnum,today,speak,bubble,
  W,BY,COMBO,WRONG,DERIV,SENT,LV,ATTR,DECK_N,rec:()=>CG,save:()=>save(),pay,myLv,hut,
  cstat,trait,traitTxt,traitIco,SUP,wind,pickBattle,BATTLE_N,packs,buyLeft,buyToday,BUY_N,trade};
})();
