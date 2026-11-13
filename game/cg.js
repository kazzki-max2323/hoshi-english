/* ことばカード: 単語帳の 単語が ぜんぶ カードに なる 対戦カードゲームと、 浜辺の カードショップ「しおさい」。
   - カード: 単語帳の 6000語あまり（小・中・高・ハイレベル）＋ 宝箱の カード（宝カード）＋ 語源パーツ ＋ 文カード
   - 絵: 単語の 意味の 絵（2つの 絵の 組み合わせも）。 属性と レベルで 背景と わくが かわり、 もようは 単語ごとに ちがう（同じ 見た目の カードは ない）
   - ★: 問題に 正解すると 育つ。 ★5で きらきら版。 苦手（まちがいが 多い・まちがいノートの 単語）と わすれかけ（しばらく 見ていない）の しるし
   - ショップ: パック（レベル・テーマ・パーツ・文）、 きょうの 1まい売り、 ねらいうち注文（1日1まい）、 ダブりの かけら・合成・交換、 デッキ、 図鑑、 コンボ図鑑
   - 店長の ナギと 英語で 買うと おまけが つく
   対戦は game/cg-battle.js、 大会・道場・診断・ほかの 機能との 連動・ミナ先生の セリフは game/cg-more.js。 データは game/cg-data.js */
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
function give(id,n=1){if(id.startsWith('p:'))CG.pt[id.slice(2)]=(CG.pt[id.slice(2)]||0)+n;else if(id.startsWith('s:'))CG.st[id.slice(2)]=(CG.st[id.slice(2)]||0)+n;else CG.c[id]=(CG.c[id]||0)+n}
function take(id,n=1){if(id.startsWith('p:'))CG.pt[id.slice(2)]=Math.max(0,(CG.pt[id.slice(2)]||0)-n);else if(id.startsWith('s:'))CG.st[id.slice(2)]=Math.max(0,(CG.st[id.slice(2)]||0)-n);else{CG.c[id]=Math.max(0,(CG.c[id]||0)-n);if(!CG.c[id])delete CG.c[id]}}
const ownedWords=()=>Object.keys(CG.c).filter(id=>CG.c[id]>0&&BY[id]);

/* ★ grows with right answers: xp 0,3,8,15,25 → ★1..5 */
const STEP=[0,3,8,15,25];
const xs=id=>CG.x[id]||(CG.x[id]=[0,0,0,0]);   // [xp, last day seen, right, wrong]
const stat=id=>CG.x[id]||[0,0,0,0];
function star(id){const x=stat(id)[0];let s=1;STEP.forEach((t,i)=>{if(x>=t)s=i+1});return s}
const kira=id=>star(id)>=5;
let weakSet=null,weakAt=0;
function weakHeads(){if(weakSet&&performance.now()-weakAt<20000)return weakSet;weakAt=performance.now();weakSet=new Set();
  try{MINA.weakWords().forEach(w=>weakSet.add(head(w.en)))}catch(e){}return weakSet}
/* 苦手: missed more than answered (2回以上), or in the mistake notes */
function weak(id){const x=stat(id);if(x[3]>=2&&x[3]>x[2])return true;const c=BY[id];return !!(c&&weakHeads().has(c.h))}
/* わすれかけ: seen before, but not for 3 days */
const forgot=id=>{const x=stat(id);return x[1]>0&&dnum()-x[1]>=3};
/* after a quiz on a card */
function record(id,ok){if(!id||id.startsWith('p:')||id.startsWith('s:'))return 0;const x=xs(id),before=star(id);x[1]=dnum();if(ok){x[0]++;x[2]++}else x[3]++;save();return star(id)>before?star(id):0}
/* the card's power right now (★ adds to it) */
const power=id=>{const I=info(id);if(!I)return 0;return I.pow+(I.k==='w'||I.k==='t'?star(id)-1:0)};

/* ⚔ 攻撃力・🛡 防御力・❤ HP: むずかしい 単語ほど 強い。 種類で すこし 個性、 ★で 育つ */
const ST_LV={es:[4,1,9],jh:[5,2,11],hs:[6,2,13],adv:[8,3,15]},ST_TR=[[4,1,9],[4,1,9],[5,1,10],[6,2,12],[7,2,14],[9,3,16]];
const TILT={act:[1,0,-1],heart:[1,0,-1],ani:[1,0,-1],food:[0,0,2],nat:[0,0,2],life:[0,1,0],look:[0,1,0],word:[0,1,0],learn:[0,0,1],tr:[0,0,0]};
function cstat(id,st){const I=typeof id==='string'?info(id):id;if(!I||!(I.k==='w'||I.k==='t'))return null;
  const b=I.k==='t'?ST_TR[I.r]||ST_TR[1]:ST_LV[I.lv],t=TILT[I.a]||[0,0,0];let a=b[0]+t[0],d=b[1]+t[1],h=b[2]+t[2];
  const v=hash('st'+I.id)%5;if(v===0)a++;else if(v===1)h+=2;else if(v===2)d++;
  const s=(st!=null?st:star(I.id))-1;a+=Math.ceil(s/2);d+=Math.floor(s/3);h+=s*2;
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
    <div class="cgart"><span class="cgm">${m}</span>${s?`<span class="cgs">${s}</span>`:''}${!lock&&!opt.noTr&&(I.k==='w'||I.k==='t')?`<span class="cgtr">${traitIco(trait(I))}</span>`:''}</div>
    <div class="cgn"><b>${lock?'？？？':esc(nm)}</b>${opt.ja&&!lock?`<small>${esc(I.ja)}</small>`:''}</div>
    <div class="cgb"><span>${attrIco(I)}</span>${I.k==='p'?'':(I.k==='w'||I.k==='t')&&!lock&&!opt.noStat?(()=>{const S=opt.st||cstat(I,opt.star);return `<span class="cgpw">⚔${S.a} 🛡${S.d}${opt.mini?'':` ❤${S.h}`}</span>`})():`<span class="cgpw">⚔${pw}</span>`}${st&&!opt.mini?`<span class="cgst">${'★'.repeat(st)}</span>`:''}</div>
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
const QT={mean:'いみは？',rev:'英語で いうと？',spell:'ただしい つづりは？',listen:'聞こえた ことばは？',fill:'あなうめ',form:'変身！',combo:'ことばコンボ',read:'相手の 単語を 読もう'};
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
      x.querySelector('.nx').onclick=()=>{sf('step');done({ok:false,hint})};
      setTimeout(()=>x.scrollIntoView({block:'nearest',behavior:'smooth'}),50)}})}

/* ================================================================ overlay */
function ov(html,cls=''){closeOv();const o=document.createElement('div');o.id='cardOv';o.className='cgov '+cls;o.innerHTML=html;document.body.appendChild(o);
  o.addEventListener('click',e=>{if(e.target===o&&!o.dataset.stay){sf('back');closeOv()}});return o}
function closeOv(){const o=$('cardOv');if(o)o.remove()}

/* the big card: tap 🔊, its combos, friends and opposites */
function detail(id,back){const I=info(id);if(!I)return;const n=count(id),own=n>0,x=stat(id),h=I.h;
  const cs=I.k==='w'?combosWith(h):[],known=cs.filter(c=>CG.combo[c.k]);
  const R=rank();
  const o=ov(`<div class="cgdv">${face(id,{big:1,ja:own})}
    <div class="cgdi">
      <button class="cgsay" id="cgsay">🔊 ${esc(I.en)}</button>
      <p class="cgdj">${esc(I.ja)}</p>
      ${I.k==='w'||I.k==='t'?`<p class="cgds">${'★'.repeat(star(id))}${'☆'.repeat(5-star(id))}${kira(id)?' ✨きらきら':''}${own?`　×${n}`:'　まだ もっていない'}</p>`:''}
      <details class="cgfold"><summary>くわしく</summary>
        ${I.k==='w'?`<p>📕 ${esc(LV[I.lv].n)}「${esc(I.bt)}」　${ATTR[I.a][1]} ${ATTR[I.a][2]}</p>`:''}
        ${trait(id)?`<p class="cgtrx">${esc(traitTxt(trait(id)))}</p>`:''}<p>コスト ${I.cost}${cstat(id)?`　⚔${cstat(id).a} 🛡${cstat(id).d} ❤${cstat(id).h}`:`　パワー ${power(id)}`}${x[2]+x[3]?`　⭕${x[2]} ❌${x[3]}`:''}</p>
        ${weak(id)?'<p>😣 苦手カード: 対戦で 正解すると「逆転」の 大ダメージ！</p>':''}${forgot(id)?'<p>💤 わすれかけ: 対戦で 正解すると ボーナス！</p>':''}
        ${cs.length?`<p>🔗 コンボ ${known.length}/${cs.length}: ${cs.map(c=>CG.combo[c.k]?`<b>${esc(c.p)}</b>`:'？？？').join('、 ')}</p>`:''}
        ${R>=CG_RULE_AT.counter&&ANTO[h]?`<p>⚡ 反対語: ${esc([...ANTO[h]].join(', '))}</p>`:''}
        ${R>=CG_RULE_AT.guard&&SYN[h]?`<p>🛡️ なかま: ${esc([...SYN[h]].join(', '))}</p>`:''}
        ${R>=CG_RULE_AT.morph&&formsOf(I)?`<p>🔄 変身: ${esc(I.en)}</p>`:''}
        ${I.k==='p'?`<p>🧩 できる 単語: ${DERIV.filter(d=>d.p===I.part).slice(0,12).map(d=>esc(d.d)).join(', ')}…</p>`:''}
        ${I.k==='s'?`<p>📜 対戦で ならべかえると 大技！</p>`:''}
      </details>
      <div class="cgdb">${own&&n>=2&&(I.k==='w')?`<button id="cgfuse">✨ 合成（★を 育てる）</button>`:''}</div>
      <button class="sub" id="cgclose">とじる</button></div></div>`,'dv');
  const say=()=>{try{H.say(I.k==='t'?'cards':I.lv,I.k==='s'?I.en:I.en)}catch(e){}};say();
  $('cgsay').onclick=say;$('cgclose').onclick=()=>{sf('back');closeOv();back&&back()};
  if($('cgfuse'))$('cgfuse').onclick=()=>{fuse(id);closeOv();detail(id,back)};
}

/* ================================================================ combos in a list of cards */
const DECK_N=15;
function cleanDeck(){}
function deckCombos(ids){const hs=[...new Set(ids.map(id=>(info(id)||{}).h).filter(Boolean))],out=[];
  for(let i=0;i<hs.length;i++)for(let j=i+1;j<hs.length;j++){const c=comboOf(hs[i],hs[j]);if(c)out.push(c)}return out}

/* ================================================================ rank */
function rank(){let r=0;CG_RANKS.forEach((x,i)=>{if((CG.rp||0)>=x[1])r=i});return r}
const rankName=(r=rank())=>CG_RANKS[r][0];
const ruleOn=k=>rank()>=CG_RULE_AT[k];
/* the pack levels you can buy */
const lvOpen=lv=>rank()>=({es:0,jh:1,hs:4,adv:6})[lv];

/* ================================================================ getting cards */
let fx=null;
function packCards(kind,arg){const R=rank(),out=[];const lvs=LVK.filter(lvOpen);
  const fresh=list=>{const f=list.filter(c=>!owns(c.id));return f.length&&Math.random()<.65?pickL(f):pickL(list)};
  if(kind==='lv'){const pool=W.filter(c=>c.lv===arg);
    const wk=[...weakHeads()].map(cardOfHead).filter(c=>c&&c.lv===arg);if(wk.length)out.push(pickL(wk).id);
    /* one pair that makes a combo, now and then */
    if(Math.random()<.6){const cs=COMBO.filter(c=>cardOfHead(c.a).lv===arg||cardOfHead(c.b).lv===arg);const c=cs.length&&pickL(cs);if(c){out.push(cardOfHead(c.a).id,cardOfHead(c.b).id)}}
    while(out.length<5)out.push(fresh(pool).id)}
  else if(kind==='at'){const pool=W.filter(c=>c.a===arg&&lvs.includes(c.lv));while(out.length<5)out.push(fresh(pool).id)}
  else if(kind==='part'){const ks=Object.keys(CG_PARTS);for(let i=0;i<3;i++){const k=pickL(ks);out.push('p:'+k);
      const ds=DERIV.filter(d=>d.p===k&&lvs.includes(cardOfHead(d.b).lv));if(ds.length&&i<2)out.push(cardOfHead(pickL(ds).b).id)}
    while(out.length<5)out.push(fresh(W.filter(c=>lvs.includes(c.lv))).id)}
  else if(kind==='sent'){const ss=SENT.filter(s=>lvs.includes(s.lv));const s=pickL(ss.filter(s=>!owns('s:'+s.i)).length?ss.filter(s=>!owns('s:'+s.i)):ss);out.push('s:'+s.i);
    sentWords(s).map(w=>cardOfHead(w.toLowerCase())).filter(Boolean).slice(0,4).forEach(c=>out.push(c.id));
    while(out.length<5)out.push(fresh(W.filter(c=>c.lv===s.lv)).id)}
  return out.slice(0,5)}
/* put the cards in; returns [{id,isNew}] */
function receive(ids){return ids.map(id=>{const isNew=!owns(id);give(id);return {id,isNew}})}
/* open a pack on screen */
function reveal(got,title,back){save();cleanDeck();
  const o=ov(`<div class="cgopen"><div class="cgpk shake">🎴</div><p>${esc(title)}</p></div>`,'op');o.dataset.stay=1;sf('card');
  setTimeout(()=>{if(!o.isConnected)return;sf('done');o.querySelector('.cgopen').classList.add('burst')},800);
  setTimeout(()=>{if(!o.isConnected)return;
    o.innerHTML=`<div class="cgres">${got.map((g,i)=>`<div class="cgslot" data-i="${i}"><div class="cgback">✦</div>${face(g.id,{ja:1})}${g.isNew?'<em class="cgnew">NEW!</em>':''}</div>`).join('')}</div>
      <div class="cgresb"><button id="cgall">ぜんぶ めくる</button><button id="cgok" class="sub" hidden>OK</button></div>`;
    const slots=[...o.querySelectorAll('.cgslot')];let left=slots.length;
    const flip=s=>{if(s.classList.contains('open'))return;s.classList.add('open');const g=got[+s.dataset.i],I=info(g.id);sf('flip');
      if(I.k==='w')setTimeout(()=>{try{H.say(I.lv,I.en)}catch(e){}},150);
      if(--left===0){$('cgall').hidden=true;$('cgok').hidden=false;
        const np=got.filter(g=>g.isNew).map(g=>info(g.id)).filter(I=>I.k==='w');const cs=deckCombos(Object.keys(CG.c)).filter(c=>np.some(I=>I.h===c.a||I.h===c.b)&&!CG.combo[c.k]);
        if(cs.length)H.toast(`✨ コンボの なかまが そろったかも…？<small>対戦で いっしょに 出してみよう</small>`,3200)}};
    slots.forEach(s=>s.onclick=()=>{if(s.classList.contains('open')){const I=info(got[+s.dataset.i].id);try{H.say(I.k==='t'?'cards':I.lv,I.en)}catch(e){}}else flip(s)});
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
const NAGI={n:'ナギ',ico:'🧑‍🦱'};
let jaOn=true;
function bubble(en,ja){return `<div class="cgnagi"><span class="cgnf">${NAGI.ico}</span><div class="cgnb"><b>${NAGI.n}</b><p class="en">${esc(en)}</p><p class="ja" ${jaOn?'':'hidden'}>${esc(ja)}</p></div></div>`}
function speak(en){try{if(!ST.sound||!window.speechSynthesis)return;speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(sayNames(en));u.lang='en-US';u.rate=ST.slow?.75:.95;u.pitch=1.05;speechSynthesis.speak(u)}catch(e){}}
function starter(){const pool=W.filter(c=>c.lv==='es');const ids=[];
  H.shuffle(COMBO.filter(c=>cardOfHead(c.a).lv==='es'&&cardOfHead(c.b).lv==='es')).slice(0,5).forEach(c=>ids.push(cardOfHead(c.a).id,cardOfHead(c.b).id));
  while(ids.length<15){const c=pickL(pool);if(!ids.includes(c.id))ids.push(c.id)}
  receive(ids);CG.deck=ids.slice();CG.met=1;save();return ids}
/* the shop's front: big tiles */
function open(){cleanDeck();const first=!CG.met;
  const g=first?CG_NAGI.first[0]:pickL(CG_NAGI.hi);
  const tiles=[['battle','⚔️','対戦'],['pack','🎁','パック'],['one','🃏','1まい売り'],['snipe','🎯','ねらいうち'],['trade','♻️','交換・合成'],['book','📖','カード図鑑'],['combo','🔗','コンボ図鑑'],
    ['dojo','🥋','コンボ道場'],['tour','🏆','カード大会'],['treasure','🎁','宝箱くじ']];
  H.show('cg',`<section class="pnl cgp">
    <div class="qtop"><button class="x" id="cgx" aria-label="もどる">←</button><b>🃏 カードショップ しおさい</b><span class="qn">${esc(rankName())}</span></div>
    ${bubble(g[0],g[1])}
    <div class="cgtiles">${tiles.map(([k,i,n])=>{const lock=k==='tour'&&!ruleOn('tour');const dot=k==='one'&&CG.d!==today()||k==='snipe'&&CG.snipe!==today()&&CG.met||k==='treasure'&&window.CARDS&&CARDS.freeOk();
      return `<button data-t="${k}" class="${k==='battle'?'big':''} ${lock?'lk':''}"><span>${lock?'🔒':i}</span>${n}${dot?'<i class="dot"></i>':''}</button>`}).join('')}</div>
  </section>`);
  $('cgx').onclick=()=>{sf('back');H.home()};
  bindBubble();speak(g[0]);
  H.panel.querySelectorAll('[data-t]').forEach(b=>b.onclick=()=>{sf('step');go(b.dataset.t)});
  if(first)setTimeout(()=>{const ids=starter();reveal(ids.slice(0,5).map(id=>({id,isNew:true})),'スターターデッキ（15まい）',()=>{H.toast(`🗂️ ${esc(CG_NAGI.first[1])}`,3600);open()})},700)}
function bindBubble(){const b=H.panel.querySelector('.cgnb');if(b)b.onclick=()=>{jaOn=!jaOn;b.querySelector('.ja').hidden=!jaOn;speak(b.querySelector('.en').textContent)}}
function go(t){({battle:()=>window.CGB&&CGB.menu(open),pack:packs,one:single,snipe,trade,book:()=>book(),combo:comboBook,
  dojo:()=>window.CGM&&CGM.dojo(open),tour:()=>{if(!ruleOn('tour')){H.toast(`🔒 カード大会は <b>${CG_RANKS[CG_RULE_AT.tour][0]}</b> から`);return}window.CGM&&CGM.tour(open)},
  treasure:()=>window.CARDS&&CARDS.open(null,open)})[t]()}
const top=(t,right='')=>`<div class="qtop"><button class="x" id="cgb" aria-label="もどる">←</button><b>${t}</b><span class="qn">${right}</span></div>`;
const coinTxt=n=>`🪙${n}`;
function pay(n){if(ST.coins<n){H.toast('🪙 コインが たりないよ');sf('wrong');return false}ST.coins-=n;save();H.head();sf('buy');return true}

/* 🎁 packs */
function packList(){const L=[];LVK.forEach(lv=>L.push({k:'lv',arg:lv,ico:'🎴',n:`${LV[lv].n}パック`,p:LV[lv].pack,open:lvOpen(lv),need:({es:0,jh:1,hs:4,adv:6})[lv],lv}));
  CG_ATTR.forEach(a=>L.push({k:'at',arg:a[0],ico:a[1],n:`${a[2]}パック`,p:120,open:ruleOn('counter'),need:CG_RULE_AT.counter}));
  L.push({k:'part',ico:'🧩',n:'語源パーツパック',p:160,open:ruleOn('parts'),need:CG_RULE_AT.parts});
  L.push({k:'sent',ico:'📜',n:'文カードパック',p:200,open:ruleOn('sent'),need:CG_RULE_AT.sent});
  L.push({k:'kira',ico:'💎',n:'きらきら宝パック',p:400,open:rank()>=8,need:8});return L}
function packs(){const L=packList(),free=CG.free!==today();
  H.show('cg',`<section class="pnl cgp">${top('🎁 パック',coinTxt(ST.coins))}
    ${free?`<button class="cgfree" id="cgfree">🎁 きょうの むりょうパック（3まい）</button>`:''}
    <div class="cgpl">${L.map((p,i)=>`<button data-i="${i}" class="${p.open?'':'lk'}"><span class="pi">${p.open?p.ico:'🔒'}</span><span class="pn">${esc(p.n)}</span><span class="pp">${p.open?coinTxt(p.p):esc(CG_RANKS[p.need][0])+'〜'}</span></button>`).join('')}</div>
    <p class="note">1パック 5まい。 まだ もっていない カードが 出やすいよ</p></section>`);
  $('cgb').onclick=()=>{sf('back');open()};
  if(free)$('cgfree').onclick=()=>{CG.free=today();const lv=LVK.filter(lvOpen).includes(myLv())?myLv():'es';const ids=packCards('lv',lv).slice(0,3);reveal(receive(ids),'きょうの むりょうパック',packs)};
  H.panel.querySelectorAll('[data-i]').forEach(b=>b.onclick=()=>{const p=L[+b.dataset.i];if(!p.open){H.toast(`🔒 ${esc(p.n)}は <b>${esc(CG_RANKS[p.need][0])}</b> から<small>対戦で 勝って 段位を 上げよう</small>`);return}buyAsk(p)})}
const myLv=()=>{try{return MINA.level()}catch(e){return 'es'}};
/* buy: quickly, or in English (a bonus card) */
function buyAsk(p){if(ST.coins<p.p){H.toast('🪙 コインが たりないよ');sf('wrong');return}
  const o=ov(`<div class="cgbuy"><b>${p.ico} ${esc(p.n)}　${coinTxt(p.p)}</b>
    <button id="cgen">🗣️ 英語で 買う<small>ぜんぶ 正しいと おまけ 1まい</small></button><button id="cgqk" class="sub">すぐ 買う</button><button id="cgno" class="sub">やめる</button></div>`,'by');
  $('cgno').onclick=()=>{sf('back');closeOv()};
  $('cgqk').onclick=()=>{closeOv();if(!pay(p.p))return;deliver(p,false)};
  $('cgen').onclick=()=>{closeOv();if(!pay(p.p))return;talkBuy(p,ok=>deliver(p,ok))}}
function deliver(p,bonus){if(p.k==='kira'){if(window.CARDS)CARDS.gift(3,2);return}
  let ids=packCards(p.k,p.arg);if(bonus){const lv=p.lv||LVK.filter(lvOpen).pop();ids.push(pickL(W.filter(c=>c.lv===lv&&!owns(c.id))).id)}
  CG.talk=(CG.talk||0)+(bonus?1:0);reveal(receive(ids),p.n+(bonus?'＋おまけ':''),packs)}
/* the English talk with Nagi: two lines at your level */
function talkBuy(p,done){const lv=({es:'es',jh:'jh',hs:'hs',adv:'hs'})[myLv()]||'es';const T=H.shuffle(CG_BUY_TALK[lv]).slice(0,2);let i=0,good=0;
  const step=()=>{const t=T[i];const ch=H.shuffle(t[1].map((x,j)=>[x,j]));
    const o=ov(`<div class="cgtalk">${bubble(t[0][0],t[0][1])}<div class="cgtc">${ch.map(([x,j])=>`<button data-j="${j}">${esc(x)}</button>`).join('')}</div><div class="cgtx" hidden></div></div>`,'tk');o.dataset.stay=1;
    speak(t[0][0]);o.querySelector('.cgnb').onclick=()=>{jaOn=!jaOn;o.querySelector('.ja').hidden=!jaOn;speak(t[0][0])};
    o.querySelectorAll('[data-j]').forEach(b=>b.onclick=()=>{const ok=b.dataset.j==='0';o.querySelectorAll('[data-j]').forEach(x=>{x.disabled=true;if(x.dataset.j==='0')x.classList.add('ok')});
      if(ok){good++;b.classList.add('ok');sf('correct');speak(t[1][0])}else{b.classList.add('ng');sf('wrong')}
      const x=o.querySelector('.cgtx');x.hidden=false;x.innerHTML=`<p>${ok?'⭕ ':'💡 '}${esc(t[2])}</p><button class="nx">つぎへ ▶</button>`;
      x.querySelector('.nx').onclick=()=>{sf('step');i++;if(i<T.length)step();else{closeOv();
        const end=good===T.length?["Perfect English! Here's a little bonus card for you.","かんぺきな 英語！ おまけの カードを どうぞ。"]:["Thanks! Your English is getting better.","ありがとう！ 英語、 上手に なってるよ。"];
        H.toast(`${NAGI.ico} 「${esc(end[0])}」<small>${esc(end[1])}</small>`,3200);speak(end[0]);done(good===T.length)}}})};
  step()}

/* 🃏 today's single cards: 6, the same all day */
function todays(){const d=today(),lvs=LVK.filter(lvOpen),out=[];let s=hash('one'+d);
  const pool=W.filter(c=>lvs.includes(c.lv));
  for(let i=0;out.length<6&&i<50;i++){s=hash(s+':'+i);const c=pool[s%pool.length];if(!out.includes(c.id))out.push(c.id)}
  /* one card that makes a combo with something you have */
  const mine=new Set(ownedWords().map(id=>BY[id].h));const cs=COMBO.filter(c=>mine.has(c.a)!==mine.has(c.b));
  if(cs.length){const c=cs[hash('cmb'+d)%cs.length],h=mine.has(c.a)?c.b:c.a,cc=cardOfHead(h);if(cc&&lvs.includes(cc.lv))out[5]=cc.id}
  return out}
function single(){if(CG.d!==today()){CG.d=today();CG.bought=[];save()}const T=todays();
  H.show('cg',`<section class="pnl cgp">${top('🃏 きょうの 1まい売り',coinTxt(ST.coins))}
    ${bubble(...CG_NAGI.hi[2])}
    <div class="cggrid g3">${T.map(id=>{const I=info(id),sold=CG.bought.includes(id);return `<div class="cgsale ${sold?'sold':''}">${face(id,{ja:1})}<button data-b="${esc(id)}" ${sold?'disabled':''}>${sold?'うりきれ':coinTxt(LV[I.lv].one)}</button></div>`}).join('')}</div>
    <p class="note">あしたに なると 入れかわるよ</p></section>`);
  $('cgb').onclick=()=>{sf('back');open()};bindBubble();
  H.panel.querySelectorAll('.cgsale .cgc').forEach(el=>el.onclick=()=>{const I=info(el.dataset.id);try{H.say(I.lv,I.en)}catch(e){}});
  H.panel.querySelectorAll('[data-b]').forEach(b=>b.onclick=()=>{const id=b.dataset.b,I=info(id);if(!pay(LV[I.lv].one))return;CG.bought.push(id);const r=receive([id]);save();
    H.toast(`🃏 <b>${esc(I.en)}</b>（${esc(I.ja)}）${r[0].isNew?' NEW!':''}`);try{H.say(I.lv,I.en)}catch(e){}single()})}

/* a search box over all word cards: returns matches */
function search(q,lvs,limit=30){q=q.trim().toLowerCase();if(!q)return [];const out=[];
  for(const c of W){if(lvs&&!lvs.includes(c.lv))continue;if(c.h.startsWith(q)||c.ja.includes(q))out.push(c);if(out.length>=limit*3)break}
  return out.sort((a,b)=>(a.h.startsWith(q)?0:1)-(b.h.startsWith(q)?0:1)||a.h.length-b.h.length).slice(0,limit)}
/* 🎯 order any one card, once a day */
function snipe(){const used=CG.snipe===today(),lvs=LVK.filter(lvOpen);
  const sug=[];[...weakHeads()].map(cardOfHead).filter(c=>c&&lvs.includes(c.lv)&&!owns(c.id)).slice(0,3).forEach(c=>sug.push([c.id,'😣 まちがいノートの 単語']));
  const mine=new Set(ownedWords().map(id=>BY[id].h));COMBO.filter(c=>mine.has(c.a)!==mine.has(c.b)).slice(0,40).forEach(c=>{const h=mine.has(c.a)?c.b:c.a,cc=cardOfHead(h);if(cc&&lvs.includes(cc.lv)&&sug.length<6&&!sug.some(s=>s[0]===cc.id))sug.push([cc.id,`🔗 ${mine.has(c.a)?c.a:c.b} の コンボなかま`])});
  H.show('cg',`<section class="pnl cgp">${top('🎯 ねらいうち注文',coinTxt(ST.coins))}
    ${bubble(...CG_NAGI.snipe)}
    ${used?'<p class="note">きょうの 注文は おわり。 また あしたね</p>':`<input id="cgq" class="cgin" placeholder="英語か 日本語で さがす" autocomplete="off">
    <div id="cgsr" class="cgsr">${sug.map(([id,why])=>row(id,why)).join('')}</div>
    <p class="note">ねだんは 1まい売りの 2ばい</p>`}</section>`);
  $('cgb').onclick=()=>{sf('back');open()};bindBubble();if(used)return;
  const q=$('cgq'),bind=()=>H.panel.querySelectorAll('[data-sn]').forEach(b=>b.onclick=()=>{const id=b.dataset.sn,I=info(id);
    if(!pay(LV[I.lv].one*2))return;CG.snipe=today();const r=receive([id]);save();reveal(r,'ねらいうち注文',open)});
  q.oninput=()=>{$('cgsr').innerHTML=search(q.value,lvs).map(c=>row(c.id)).join('')||'<p class="note">みつからないよ</p>';bind()};bind();
  function row(id,why){const I=info(id);return `<div class="cgrow"><span class="ri">${art(I)[0]}</span><span class="rn"><b>${esc(I.en)}</b><small>${esc(I.ja)}${why?'　'+why:''}</small></span><span class="rl">${LV[I.lv].k}</span><button data-sn="${esc(id)}">${owns(id)?'もってる ':''}${coinTxt(LV[I.lv].one*2)}</button></div>`}}

/* ♻️ duplicates: break into shards, fuse for ★, trade shards for a card */
function fuse(id){if(count(id)<2)return false;take(id);const x=xs(id),b=star(id);x[0]+=5;save();const a=star(id);sf('done');
  H.toast(`✨ <b>${esc(info(id).en)}</b> を 合成！${a>b?` ★${a} に なった！`:' 経験 +5'}${a>=5&&b<5?'<small>きらきら版に なったよ！</small>':''}`,3000);return true}
function trade(){const dup=ownedWords().filter(id=>CG.c[id]>=2).sort((a,b)=>CG.c[b]-CG.c[a]);
  H.show('cg',`<section class="pnl cgp">${top('♻️ 交換・合成',`🔹${CG.sh||0}`)}
    ${bubble(...CG_NAGI.dup)}
    ${dup.length?`<button id="cgall" class="sub">🔹 ダブりを ぜんぶ かけらに（1まいずつ のこす）</button>
    <div class="cgsr">${dup.map(id=>{const I=info(id);return `<div class="cgrow"><span class="ri">${art(I)[0]}</span><span class="rn"><b>${esc(I.en)}</b><small>×${CG.c[id]}　${'★'.repeat(star(id))}</small></span>
      <button data-f="${esc(id)}">✨合成</button><button data-s="${esc(id)}" class="sub">🔹+${LV[I.lv].sh}</button></div>`}).join('')}</div>`:'<p class="note">ダブった カードは まだ ないよ</p>'}
    <details class="cgfold"><summary>🔹 かけらで カードと 交換する</summary>
      <input id="cgq" class="cgin" placeholder="ほしい 単語を さがす" autocomplete="off"><div id="cgsr" class="cgsr"></div>
      <p class="note">小 ${LV.es.tr}・中 ${LV.jh.tr}・高 ${LV.hs.tr}・H ${LV.adv.tr} かけら</p></details>
  </section>`);
  $('cgb').onclick=()=>{sf('back');open()};bindBubble();
  const shard=id=>{take(id);CG.sh=(CG.sh||0)+LV[info(id).lv].sh};
  if($('cgall'))$('cgall').onclick=()=>{let n=0;dup.forEach(id=>{while(CG.c[id]>1){shard(id);n++}});save();sf('buy');H.toast(`🔹 ${n}まいを かけらに したよ`);trade()};
  H.panel.querySelectorAll('[data-f]').forEach(b=>b.onclick=()=>{fuse(b.dataset.f);trade()});
  H.panel.querySelectorAll('[data-s]').forEach(b=>b.onclick=()=>{shard(b.dataset.s);save();sf('coinIn');trade()});
  const q=$('cgq'),lvs=LVK.filter(lvOpen);q.oninput=()=>{$('cgsr').innerHTML=search(q.value,lvs).map(c=>`<div class="cgrow"><span class="ri">${art(c)[0]}</span><span class="rn"><b>${esc(c.en)}</b><small>${esc(c.ja)}</small></span><span class="rl">${LV[c.lv].k}</span><button data-tr="${esc(c.id)}" ${(CG.sh||0)<LV[c.lv].tr?'disabled':''}>🔹${LV[c.lv].tr}</button></div>`).join('');
    H.panel.querySelectorAll('[data-tr]').forEach(b=>b.onclick=()=>{const id=b.dataset.tr,c=BY[id];if((CG.sh||0)<LV[c.lv].tr)return;CG.sh-=LV[c.lv].tr;const r=receive([id]);save();sf('buy');reveal(r,'かけらで 交換',trade)})}}

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

/* 📖 the card book: by level (and treasure / parts / sentences), 60 at a time */
let bkLv='es',bkA='all',bkPage=0;
function book(lv){if(lv){bkLv=lv;bkPage=0}
  const tabs=[...LVK.map(l=>[l,LV[l].k]),['pt','🧩'],['st','📜'],['tr','🎁']];
  let list;if(bkLv==='pt')list=Object.keys(CG_PARTS).map(k=>'p:'+k);else if(bkLv==='st')list=SENT.map(s=>'s:'+s.i);else if(bkLv==='tr')list=TR().map(t=>'t:'+t.e);
  else list=W.filter(c=>c.lv===bkLv&&(bkA==='all'||c.a===bkA)).map(c=>c.id);
  const got=list.filter(owns).length,per=60,pages=Math.ceil(list.length/per);if(bkPage>=pages)bkPage=0;const shown=list.slice(bkPage*per,bkPage*per+per);
  H.show('cg',`<section class="pnl cgp">${top('📖 カード図鑑',`${got}/${list.length}`)}
    <div class="seg cgsg">${tabs.map(([k,n])=>`<button data-l="${k}" class="${bkLv===k?'on':''}">${n}</button>`).join('')}</div>
    ${LVK.includes(bkLv)?`<div class="cgchips">${[['all','ぜんぶ'],...CG_ATTR.map(a=>[a[0],a[1]])].map(([k,n])=>`<button data-a="${k}" class="${bkA===k?'on':''}">${n}</button>`).join('')}</div>`:''}
    ${bkLv==='tr'?'<button id="cgtr" class="sub">🎁 宝箱くじ・宝カード図鑑を ひらく</button>':''}
    <div class="cggrid g4">${shown.map(id=>face(id,{ja:owns(id),lock:!owns(id),n:count(id),marks:owns(id)})).join('')}</div>
    ${pages>1?`<div class="row cgpg"><button class="sub" data-p="-1" ${bkPage?'':'disabled'}>◀</button><span>${bkPage+1}/${pages}</span><button class="sub" data-p="1" ${bkPage<pages-1?'':'disabled'}>▶</button></div>`:''}
  </section>`);
  $('cgb').onclick=()=>{sf('back');open()};
  H.panel.querySelectorAll('[data-l]').forEach(b=>b.onclick=()=>{bkLv=b.dataset.l;bkPage=0;sf('step');book()});
  H.panel.querySelectorAll('[data-a]').forEach(b=>b.onclick=()=>{bkA=b.dataset.a;bkPage=0;sf('step');book()});
  H.panel.querySelectorAll('[data-p]').forEach(b=>b.onclick=()=>{bkPage+=+b.dataset.p;sf('flip');book();H.panel.scrollTop=0});
  if($('cgtr'))$('cgtr').onclick=()=>{sf('card');CARDS.open(null,()=>book())};
  H.panel.querySelectorAll('.cggrid .cgc').forEach(el=>el.onclick=()=>{const id=el.dataset.id;if(!owns(id)){const I=info(id);sf('pop');H.toast(`まだ もっていない カード<small>${I.k==='w'?esc(LV[I.lv].n)+'「'+esc(I.bt)+'」の 単語':'パックで 出るよ'}</small>`);return}sf('flip');detail(id,book)})}

/* 🔗 the combo book: found ones, ??? for the rest; the mistakes you met */
let cbLv='es';
function comboBook(){const lvOf=c=>{const a=cardOfHead(c.a).lv,b=cardOfHead(c.b).lv;return LVK[Math.max(LVK.indexOf(a),LVK.indexOf(b))]};
  const list=COMBO.filter(c=>lvOf(c)===cbLv),found=COMBO.filter(c=>CG.combo[c.k]).length,mine=new Set(ownedWords().map(id=>BY[id].h));
  const wr=WRONG.filter(w=>CG.wrong[w.k]);
  H.show('cg',`<section class="pnl cgp">${top('🔗 コンボ図鑑',`${found}/${COMBO.length}`)}
    <div class="seg cgsg">${LVK.map(l=>`<button data-l="${l}" class="${cbLv===l?'on':''}">${LV[l].k} ${COMBO.filter(c=>lvOf(c)===l&&CG.combo[c.k]).length}/${COMBO.filter(c=>lvOf(c)===l).length}</button>`).join('')}</div>
    <div class="cgsr">${list.map(c=>CG.combo[c.k]?`<div class="cgrow cb"><span class="rn"><b>${esc(c.p)}</b><small>${esc(c.j)}</small></span><button data-say="${esc(c.p)}" class="sub">🔊</button></div>`
      :`<div class="cgrow cb lk"><span class="rn"><b>${mine.has(c.a)?esc(c.a):'？？？'} ＋ ${mine.has(c.b)?esc(c.b):'？？？'}</b><small>${mine.has(c.a)||mine.has(c.b)?'ヒント: '+esc(c.j.replace(/[ぁ-ん]/g,'○').slice(0,8)):'まだ 見つけていない'}</small></span></div>`).join('')}</div>
    ${wr.length?`<details class="cgfold"><summary>⚠️ まちがいコンボ ノート（${wr.length}）</summary>${wr.map(w=>`<p class="cgwr"><s>${esc(w.a)} ${esc(w.b)}</s> → <b>${esc(w.ok)}</b><br><small>${esc(w.why)}</small></p>`).join('')}</details>`:''}
    <p class="note">対戦で いっしょに 出したり、 🥋 コンボ道場で 見つけると のるよ</p></section>`);
  $('cgb').onclick=()=>{sf('back');open()};
  H.panel.querySelectorAll('[data-l]').forEach(b=>b.onclick=()=>{cbLv=b.dataset.l;sf('step');comboBook()});
  H.panel.querySelectorAll('[data-say]').forEach(b=>b.onclick=()=>speak(b.dataset.say))}
/* a combo is found (battle / dojo): coins the first time */
function foundCombo(c){if(CG.combo[c.k])return false;CG.combo[c.k]=dnum();save();return true}
function metWrong(w){if(CG.wrong[w.k])return false;CG.wrong[w.k]=dnum();save();return true}

window.CG={open,go,info,face,art,quiz,formQuiz,formsOf,ask,ov,closeOv,detail,count,owns,give,take,receive,reveal,record,star,kira,weak,forgot,power,
  rank,rankName,ruleOn,lvOpen,deckCombos,cleanDeck,comboOf,combosWith,wrongOf:(a,b)=>WRG[a+'|'+b]||null,anto:h=>ANTO[h]?[...ANTO[h]]:[],syn:h=>SYN[h]?[...SYN[h]]:[],
  derivOf,sentWords,cardOfHead,foundCombo,metWrong,pickL,hash,dnum,today,speak,bubble,
  W,BY,COMBO,WRONG,DERIV,SENT,LV,ATTR,DECK_N,rec:()=>CG,save:()=>save(),pay,myLv,hut,
  cstat,trait,traitTxt,traitIco,SUP,wind,pickBattle,BATTLE_N,packs,book,comboBook,single,snipe,trade};
})();
