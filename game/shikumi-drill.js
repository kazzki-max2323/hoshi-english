/* ⚡ 特別練習（SKDRILL）: 「英語のしくみ」の そばに ある 連発ドリル
   11/20 ユーザー「教わった 直後なら ゆっくり 考えれば わかる。 とっさに 出てこない」「動詞と 様子、 do、 疑問、 否定、 手伝い役を 連発で 50問くらい。 途中でも やめれる」
   - 1問 3〜5びょうの テンポ。 2択（ことばを えらぶ か 正しい 文を えらぶ）。 入力なし
   - 同じ 型を 主語・動詞を 言いかえて 3〜4問 つづけて 出す → つぎの 型へ
   - まちがえた 問題は 4問あとに そのまま、 8問あとに 同じ 型の 言いかえで もう一回
   - 正解は すぐ つぎへ。 まちがいは 正しい 文と ひとこと理由 → タップで つぎへ。 ✋ で いつでも おわれる
   入口: ミナ先生の ページの 💪特別授業 の 横（game/mina-plan.js）・英語のしくみの 時間の 一覧（unit.js opt.extra）
   セリフ kd_・x_kd は この ファイルの さいご。 きろくは localStorage 'hoshi_skdrill' */
(()=>{
const H=HE,esc=H.esc,$=id=>document.getElementById(id);
const {S:ST,sfx:SFX}=BEACH;const snd=k=>{try{SFX[k]&&SFX[k]()}catch(e){}};
const talk=en=>{try{speechSynthesis.cancel();window.SENSEI&&SENSEI.talk(en)}catch(e){}},hush=()=>{try{speechSynthesis.cancel()}catch(e){}};
const pick=a=>a[Math.random()*a.length|0];
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.random()*(i+1)|0;[a[i],a[j]]=[a[j],a[i]]}return a};
const face=(ex,tx)=>{try{return MINA.face('m',ex,MINA.poseFor?MINA.poseFor(ex,tx||''):undefined)}catch(e){return ''}};
const ML=(k,v)=>{try{return MINA.line(k,v||{})}catch(e){return ['smile','']}};
const KEY='hoshi_skdrill';
const R=(()=>{try{const s=JSON.parse(localStorage.getItem(KEY)||'null');if(s&&typeof s==='object')return s}catch(e){}return {}})();
R.miss=R.miss||{};
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(R))}catch(e){}};
const N=50;

/* ================================================================ ことばの 材料 */
/* 主語: [英語, 日本語, 人] 人 = 1(I) 2(you) 3(he・she) p(we・they) */
const SUBJ=[['I','わたし','1'],['You','あなた','2'],['He','彼','3'],['She','彼女','3'],['We','わたしたち','p'],['They','彼ら','p'],['Ken','ケン','3'],['My mother','母','3'],['Tom and Amy','トムと エイミー','p'],['My brother','兄','3']];
const is3=s=>s[2]==='3';
const beNow=s=>s[2]==='1'?'am':is3(s)?'is':'are',bePast=s=>s[2]==='1'||is3(s)?'was':'were';
const lowS=s=>s[0]==='I'?'I':s[0].replace(/^(He|She|You|We|They|My)\b/,m=>m.toLowerCase());
/* 動詞: v 原形, s 3単現, p 過去, ing, o うしろ, j = [する, しない, した, しなかった, する？, した？, するだろう, できる, している]（null は その 形では 出さない） */
const VERB=[
 {v:'play',s:'plays',p:'played',ing:'playing',o:'tennis',j:['テニスを する','テニスを しない','テニスを した','テニスを しなかった','テニスを する？','テニスを した？','テニスを するだろう','テニスが できる','テニスを している'],cat:0},
 {v:'like',s:'likes',p:'liked',ing:null,o:'dogs',j:['犬が すき','犬が すきじゃない',null,null,'犬が すき？',null,null,null,null],cat:0},
 {v:'go',s:'goes',p:'went',ing:'going',o:'to school',j:['学校へ 行く','学校へ 行かない','学校へ 行った','学校へ 行かなかった','学校へ 行く？','学校へ 行った？','学校へ 行くだろう','学校へ 行ける','学校へ 向かっている'],cat:0},
 {v:'eat',s:'eats',p:'ate',ing:'eating',o:'breakfast',j:['朝ごはんを 食べる','朝ごはんを 食べない','朝ごはんを 食べた','朝ごはんを 食べなかった','朝ごはんを 食べる？','朝ごはんを 食べた？','朝ごはんを 食べるだろう','朝ごはんを 食べられる','朝ごはんを 食べている'],cat:1},
 {v:'watch',s:'watches',p:'watched',ing:'watching',o:'TV',j:['テレビを 見る','テレビを 見ない','テレビを 見た','テレビを 見なかった','テレビを 見る？','テレビを 見た？','テレビを 見るだろう','テレビを 見られる','テレビを 見ている'],cat:0},
 {v:'study',s:'studies',p:'studied',ing:'studying',o:'English',j:['英語を 勉強する','英語を 勉強しない','英語を 勉強した','英語を 勉強しなかった','英語を 勉強する？','英語を 勉強した？','英語を 勉強するだろう','英語を 勉強できる','英語を 勉強している'],cat:0},
 {v:'have',s:'has',p:'had',ing:null,o:'a dog',j:['犬を かっている','犬を かっていない','犬を かっていた','犬を かっていなかった','犬を かっている？','犬を かっていた？',null,'犬を かえる',null],cat:0},
 {v:'cook',s:'cooks',p:'cooked',ing:'cooking',o:'dinner',j:['夕ごはんを 作る','夕ごはんを 作らない','夕ごはんを 作った','夕ごはんを 作らなかった','夕ごはんを 作る？','夕ごはんを 作った？','夕ごはんを 作るだろう','夕ごはんを 作れる','夕ごはんを 作っている'],cat:1},
 {v:'swim',s:'swims',p:'swam',ing:'swimming',o:'in the sea',j:['海で およぐ','海で およがない','海で およいだ','海で およがなかった','海で およぐ？','海で およいだ？','海で およぐだろう','海で およげる','海で およいでいる'],cat:1},
 {v:'drink',s:'drinks',p:'drank',ing:'drinking',o:'coffee',j:['コーヒーを 飲む','コーヒーを 飲まない','コーヒーを 飲んだ','コーヒーを 飲まなかった','コーヒーを 飲む？','コーヒーを 飲んだ？','コーヒーを 飲むだろう','コーヒーを 飲める','コーヒーを 飲んでいる'],cat:1},
];
/* 様子の ことば: a 英語, j = [いま, いまの 否定, 過去, 質問, will] */
const ADJ=[
 {a:'hungry',j:['おなかが すいている','おなかが すいていない','おなかが すいていた','おなかが すいている？','おなかが すくだろう']},
 {a:'tired',j:['つかれている','つかれていない','つかれていた','つかれている？','つかれるだろう']},
 {a:'busy',j:['いそがしい','いそがしくない','いそがしかった','いそがしい？','いそがしいだろう']},
 {a:'sleepy',j:['ねむい','ねむくない','ねむかった','ねむい？','ねむくなるだろう']},
 {a:'happy',j:['うれしい','うれしくない','うれしかった','うれしい？','よろこぶだろう']},
 {a:'sick',j:['具合が わるい','具合は わるくない','具合が わるかった','具合が わるい？','具合が わるく なるだろう']},
];
const jaS=(s,t)=>`${s[1]}は ${t}`;
const vOK=(i)=>VERB.filter(v=>v.j[i]);
/* ================================================================ 問題の 型
   1問 = {k: 型, ja, s: ___ の 文（なければ 文を えらぶ）, o: [正解, まちがい], why} */
const T={
 /* 3単現の -s */
 s3:()=>{const s=pick(SUBJ),v=pick(vOK(0)),ok=is3(s)?v.s:v.v,ng=is3(s)?v.v:v.s;
   return {ja:jaS(s,v.j[0]),s:`${s[0]} ___ ${v.o}.`,o:[ok,ng],why:is3(s)?`${s[0]} は he・she の なかま → -s`:`${s[0]} には -s は つかない`}},
 /* Do / Does の 質問 */
 doQ:()=>{const s=pick(SUBJ.filter(x=>x[0]!=='I')),v=pick(vOK(4)),ok=is3(s)?'Does':'Do',ng=Math.random()<.5?(is3(s)?'Do':'Does'):(beNow(s)[0].toUpperCase()+beNow(s).slice(1));
   return {ja:jaS(s,v.j[4]),s:`___ ${lowS(s)} ${v.v} ${v.o}?`,o:[ok,ng],why:ng.match(/^(Is|Are|Am)$/)?`${v.v} は 動詞 → be じゃなくて ${ok}`:is3(s)?'he・she の 質問は Does':`${s[0]} の 質問は Do`}},
 /* does の あとは 原形 */
 doesV:()=>{const s=pick(SUBJ.filter(is3)),v=pick(vOK(4));
   return {ja:jaS(s,v.j[4]),s:`Does ${lowS(s)} ___ ${v.o}?`,o:[v.v,v.s],why:'-s は does が もっていく → 原形'}},
 /* don't / doesn't */
 doNeg:()=>{const s=pick(SUBJ),v=pick(vOK(1)),ok=is3(s)?"doesn't":"don't",ng=Math.random()<.5?(is3(s)?"don't":"doesn't"):(s[2]==='1'?"am not":is3(s)?"isn't":"aren't");
   return {ja:jaS(s,v.j[1]),s:`${s[0]} ___ ${v.v} ${v.o}.`,o:[ok,ng],why:!/^do/.test(ng)?`${v.v} は 動詞 → 否定は ${ok}`:is3(s)?"he・she は doesn't":`${s[0]} は don't`}},
 /* doesn't の あとは 原形 */
 doesntV:()=>{const s=pick(SUBJ.filter(is3)),v=pick(vOK(1));
   return {ja:jaS(s,v.j[1]),s:`${s[0]} doesn't ___ ${v.o}.`,o:[v.v,v.s],why:"-s は doesn't が もっていく → 原形"}},
 /* didn't / Did の あとは 原形 */
 didV:()=>{const q=Math.random()<.5,s=pick(q?SUBJ.filter(x=>x[0]!=='I'):SUBJ),v=pick(vOK(3));
   return q?{ja:jaS(s,v.j[5]),s:`Did ${lowS(s)} ___ ${v.o}?`,o:[v.v,v.p],why:'過去の しるしは did が もっていく → 原形'}
     :{ja:jaS(s,v.j[3]),s:`${s[0]} didn't ___ ${v.o}.`,o:[v.v,v.p],why:"過去の しるしは didn't が もっていく → 原形"}},
 /* 過去の ふつうの 文は ひとりで 過去形 */
 past:()=>{const s=pick(SUBJ),v=pick(vOK(2));
   return {ja:jaS(s,'きのう '+v.j[2]),s:`${s[0]} ___ ${v.o} yesterday.`,o:[v.p,v.v],why:'手伝い役が いない → 動詞が 自分で 過去形'}},
 /* be の 質問（do は つかわない） */
 beQ:()=>{const s=pick(SUBJ.filter(x=>x[0]!=='I')),a=pick(ADJ),b=beNow(s),ok=b[0].toUpperCase()+b.slice(1),ng=is3(s)?'Does':'Do';
   return {ja:jaS(s,a.j[3]),s:`___ ${lowS(s)} ${a.a}?`,o:[ok,ng],why:`${a.a} は 様子の ことば → be の 文。 do は つかわない`}},
 /* be の 否定 */
 beNeg:()=>{const s=pick(SUBJ),a=pick(ADJ),b=beNow(s),ok=b==='am'?'am not':b+"n't",ng=is3(s)?"doesn't":"don't";
   return {ja:jaS(s,a.j[1]),s:`${s[0]} ___ ${a.a}.`,o:[ok,ng],why:`${a.a} は 動詞じゃない → be に not`}},
 /* 過去の be の 質問 */
 beQp:()=>{const s=pick(SUBJ.filter(x=>x[0]!=='I')),a=pick(ADJ),b=bePast(s),ok=b[0].toUpperCase()+b.slice(1);
   return {ja:jaS(s,'きのう '+a.j[2].replace(/た$/,'た？')),s:`___ ${lowS(s)} ${a.a} yesterday?`,o:[ok,'Did'],why:`様子の ことば → be の 過去 ${ok}。 did は つかわない`}},
 /* 様子の ことばには be（文を えらぶ） */
 beAdj:()=>{const s=pick(SUBJ),a=pick(ADJ),b=beNow(s);
   return {ja:jaS(s,a.j[0]),o:[`${s[0]} ${b} ${a.a}.`,`${s[0]} ${a.a}.`],why:`${a.a} は 動詞じゃない → be で うめる`}},
 /* 動詞は 1つ（文を えらぶ） */
 one:()=>{const s=pick(SUBJ),v=pick(vOK(0)),b=beNow(s),vv=is3(s)?v.s:v.v;
   return {ja:jaS(s,v.j[0]),o:[`${s[0]} ${vv} ${v.o}.`,`${s[0]} ${b} ${v.v} ${v.o}.`],why:`${v.v} が 動詞 → be は いらない（動詞は 1つ）`}},
 /* will ＋ be ＋ 様子（文を えらぶ） */
 willBe:()=>{const s=pick(SUBJ),a=pick(ADJ),r=Math.random();
   const ng=r<.5?`${s[0]} will ${a.a}.`:`${s[0]} will ${beNow(s)} ${a.a}.`;
   return {ja:jaS(s,a.j[4]),o:[`${s[0]} will be ${a.a}.`,ng],why:r<.5?`様子の ことばには be。 will の あとは 原形 be`:`will の あとは 原形 → be`}},
 /* will・can の あとは 原形 */
 modV:()=>{const s=pick(SUBJ.filter(is3)),c=Math.random()<.5,v=pick(vOK(c?7:6));
   return {ja:jaS(s,v.j[c?7:6]),s:`${s[0]} ${c?'can':'will'} ___ ${v.o}.`,o:[v.v,v.s],why:`${c?'can':'will'} の あとは 原形（-s は つかない）`}},
 /* be ＋ -ing（している） */
 ing:()=>{const s=pick(SUBJ),v=pick(vOK(8).filter(v=>v.ing)),b=beNow(s);
   return Math.random()<.5?{ja:jaS(s,'今 '+v.j[8]),s:`${s[0]} ${b} ___ ${v.o} now.`,o:[v.ing,v.v],why:'be の あとは -ing で 「している」'}
     :{ja:jaS(s,'今 '+v.j[8]),o:[`${s[0]} ${b} ${v.ing} ${v.o} now.`,`${s[0]} ${v.ing} ${v.o} now.`],why:'-ing は 様子の ことば → be が いる'}},
};
const KN={s3:'-s',doQ:'Do/Does の 質問',doesV:'does → 原形',doNeg:"don't / doesn't",doesntV:"doesn't → 原形",didV:'did → 原形',past:'過去形',beQ:'be の 質問',beNeg:'be の 否定',beQp:'was / were の 質問',beAdj:'様子には be',one:'動詞は 1つ',willBe:'will be ＋ 様子',modV:'will・can → 原形',ing:'be ＋ -ing'};
const KS=Object.keys(T);
function make(k){for(let n=0;n<20;n++){try{const q=T[k]();if(q&&q.o[0]!==q.o[1]){q.k=k;return q}}catch(e){}}return null}
/* 型を 3〜4問ずつ。 まちがいの 多い 型を 先に 多めに */
function plan(){const w=KS.slice().sort((a,b)=>(R.miss[b]||0)-(R.miss[a]||0)),top=w.filter(k=>R.miss[k]).slice(0,3);
  const order=top.concat(shuffle(KS.filter(k=>!top.includes(k))));const L=[];
  while(L.length<N+20)order.forEach(k=>{const m=2+(Math.random()*2|0)+(top.includes(k)?1:0);for(let i=0;i<m;i++){const q=make(k);if(q)L.push(q)}});
  return L}

/* ================================================================ がめん */
let G=null;
function close(){const o=$('dpov');if(o)o.remove();G=null;hush()}
function shell(){let o=$('dpov');if(o)o.remove();try{window.DEEP&&DEEP.close()}catch(e){}
  o=document.createElement('div');o.id='dpov';document.body.appendChild(o);
  o.innerHTML=`<section class="pnl dpp mdp kdp" role="dialog" aria-label="特別練習">
    <div class="qtop"><button class="x" id="kdx" aria-label="やめる">✋</button><b>⚡ 特別練習</b><span class="qn" id="kdn"></span></div>
    <div class="kdbar"><i id="kdbar"></i></div>
    <div class="mdbox" id="kdbox"></div></section>`;
  $('kdx').onclick=()=>{snd('back');G&&G.i>0?finish(1):close()};
  o.onclick=e=>{if(e.target===o){snd('back');G&&G.i>0?finish(1):close()}};
  return $('kdbox')}
const minaBox=(ex,tx)=>`<div class="mdsay"><span class="lface">${face(ex,tx)}</span><p>${tx}</p></div>`;
function open(back){R.n=(R.n||0)+1;save();const box=shell();G=null;$('kdn').textContent='';
  const [ex,tx]=ML(R.n<=1?'kd_first':'kd_start',{n:N});
  box.innerHTML=`${minaBox(ex,tx)}<div class="kdhow"><p>🇯🇵 日本語を 見て、 正しい ほうを <b>すぐ</b> タップ</p><p>⏱ 3びょう いないなら <b>はやい！</b></p><p>❌ まちがえた 形は 少し あとで また 出るよ</p><p>✋ で いつでも おわれる</p></div>
    <div class="mdnav"><button id="kdgo">⚡ スタート（${N}問）</button></div>`;
  $('kdgo').onclick=()=>{snd('lesson');start(back)}}
function start(back){G={L:plan(),i:0,ok:0,fast:0,streak:0,best:0,miss:{},seen:0,back};ask()}
function ask(){const g=G;if(!g||!$('kdbox'))return;if(g.i>=N)return finish();
  const q=g.L[g.i]||make(pick(KS));g.L[g.i]=q;g.t0=performance.now();g.lock=0;
  $('kdn').textContent=`${g.i+1}/${N}`;$('kdbar').style.width=(g.i/N*100)+'%';
  const [a,b]=q.s?q.s.split('___'):['',''],ord=Math.random()<.5?[0,1]:[1,0];
  $('kdbox').innerHTML=`<div class="kdq">
      <p class="kdja">${esc(q.ja)}</p>
      ${q.s?`<p class="kden">${esc(a)}<u>　？　</u>${esc(b)}</p>`:`<p class="kden kdpick">正しい 文は？</p>`}
      <div class="kdopts${q.s?'':' full'}">${ord.map(i=>`<button data-o="${i}">${esc(q.o[i])}</button>`).join('')}</div>
      <div class="kdfb" id="kdfb">${g.streak>=3?`<span class="kdst">🔥 ${g.streak} れんぞく</span>`:''}</div></div>`;
  $('kdbox').querySelectorAll('[data-o]').forEach(bt=>bt.onclick=()=>answer(+bt.dataset.o,bt))}
const full=q=>q.s?q.s.replace('___',q.o[0]):q.o[0];
function answer(k,bt){const g=G;if(!g||g.lock)return;g.lock=1;const q=g.L[g.i],dt=(performance.now()-g.t0)/1000;
  $('kdbox').querySelectorAll('[data-o]').forEach(x=>{x.disabled=true;if(+x.dataset.o===0)x.classList.add('right')});
  if(k===0){g.ok++;g.streak++;g.best=Math.max(g.best,g.streak);const fast=dt<=3;if(fast)g.fast++;snd('correct');
    const sp=g.streak>0&&g.streak%10===0?ML('kd_streak',{n:g.streak})[1]:'';
    $('kdfb').innerHTML=`<span class="kdok">⭕ ${fast?'<b>はやい！</b>':''}</span>${sp?`<span class="kdsp">${esc(sp)}</span>`:''}`;
    talk(full(q));g.i++;setTimeout(()=>{if(G===g)ask()},sp?1500:fast?650:900);return}
  bt.classList.add('wrong');snd('wrong');g.streak=0;g.miss[q.k]=(g.miss[q.k]||0)+1;R.miss[q.k]=(R.miss[q.k]||0)+1;save();
  try{window.SENSEI&&SENSEI.gram(/^be|one|willBe|ing/.test(q.k)?'jh_be':q.k==='s3'?'jh_3s':'jh_do',0)}catch(e){}
  /* 4問あとに そのまま、 8問あとに 同じ 型の 言いかえ */
  g.L.splice(g.i+4,0,Object.assign({},q,{again:1}));const v=make(q.k);if(v)g.L.splice(g.i+9,0,v);
  $('kdfb').innerHTML=`<div class="kdfix"><p>⭕ <b>${esc(full(q))}</b></p><small>💡 ${esc(q.why)}</small></div><div class="mdnav"><button id="kdnx">つぎへ ▶</button></div>`;
  talk(full(q));g.i++;$('kdnx').onclick=()=>{snd('step');hush();ask()}}
function finish(quit){const g=G;if(!g)return close();const n=g.i,ok=g.ok;G=null;hush();
  R.tot=(R.tot||0)+n;R.ok=(R.ok||0)+ok;if(!quit)R.full=(R.full||0)+1;const rate=n?ok/n:0;
  if(!quit&&(!R.best||ok>R.best))R.best=ok;R.t=Date.now();save();
  try{RECENT.add('skdrill',{n,ok,fast:g.fast})}catch(e){}
  const weak=Object.keys(g.miss).sort((a,b)=>g.miss[b]-g.miss[a]).slice(0,3);
  const coin=Math.round(ok/5)+(n>=N&&rate>=.9?5:0);
  const key=!n?'kd_quit0':quit?'kd_quit':rate>=.95?'kd_perfect':rate>=.8?'kd_good':'kd_more';
  const [ex,tx]=ML(key,{n,ok,f:g.fast});
  $('kdn').textContent='';$('kdbar').style.width=(n/N*100)+'%';
  $('kdbox').innerHTML=`<div class="kres mdres"><p class="kend good">${quit?'✋ ここまで！':'⚡ 50問 おわり！'}</p>
    <div class="snscore"><span>⭕ <b>${ok}</b>/${n}</span><span>⏱ はやい <b>${g.fast}</b></span><span>🔥 さいこう <b>${g.best}</b>れんぞく</span></div>
    ${coin?`<p class="kpay">🪙 <b>${coin}まい</b></p>`:''}${minaBox(ex,tx)}
    ${weak.length?`<p class="mdnote2">📘 まちがえた 型</p><div class="kdweak">${weak.map(k=>`<span>${esc(KN[k]||k)} ×${g.miss[k]}</span>`).join('')}</div>`:''}
    <div class="mdnav"><button id="kdag">⚡ もう一回</button>${window.SHIKUMI?'<button class="sub" id="kdsh">🧩 英語のしくみ</button>':''}<button class="sub" id="kdc">✖ とじる</button></div></div>`;
  if(coin)setTimeout(()=>{try{const b=$('kdbox').getBoundingClientRect();H.coinBurst(b.left+b.width/2,Math.min(b.top+60,innerHeight-60),coin)}catch(e){ST.coins+=coin}},400);
  quit?snd('pop'):snd('done');
  $('kdag').onclick=()=>{snd('lesson');R.n++;save();shell();start()};
  const sh=$('kdsh');if(sh)sh.onclick=()=>{snd('book');close();SHIKUMI.open()};
  $('kdc').onclick=()=>{snd('back');close()}}

window.SKDRILL={open,close,rec:()=>R,make,T,KN};

/* ================================================================ ミナ先生の セリフ */
Object.assign(MINA_LINES,{
 kd_first:[['happy','特別練習へ ようこそ！ 考えなくても 口から 出るように、 {n}問 連発で いくよ。 まちがえても すぐ また 出すから 大丈夫'],['proud','わかるのと、 とっさに 出るのは べつの 力。 きょうは その 「とっさ」を きたえよう']],
 kd_start:[['smile','{n}問 連発！ ゆっくり 考えず、 ぱっと えらんでね'],['happy','きょうも 手伝い役の 練習、 いこう！ 「前の ことばで 後ろが きまる」だよ'],['think','do？ be？ 原形？ ぱっと 見て えらべるかな']],
 kd_streak:[['wow','{n}問 れんぞく！ もう 体が 覚えてきたね'],['proud','{n}れんぞく！ その 調子']],
 kd_perfect:[['wow','{n}問で {ok}問 正解！ もう とっさに 出てるね。 これは 自分の ものだよ'],['love','ほとんど 1回で 正解… すごいよ。 はやいのも {f}問 あったね']],
 kd_good:[['proud','{n}問で {ok}問 正解！ まちがえた 型を あと 何回か やれば 完ぺき'],['happy','いい テンポだったよ。 まちがえた ところは 下に 出してあるね']],
 kd_more:[['smile','{n}問で {ok}問 正解。 大丈夫、 連発は くりかえすほど 速く なるの'],['love','まちがえた 型は 次も 多めに 出すね。 何回か やると すっと 出るように なるよ']],
 kd_quit:[['smile','{n}問 やったね。 ちょっとずつでも 毎日 やると とっさに 出るように なるよ'],['happy','ここまで {ok}問 正解！ また 続きを やろう']],
 kd_quit0:[['smile','また やりたく なったら いつでも 来てね']],
 x_kdTry:[['happy','💪特別授業の 横に ⚡特別練習を 作ったよ。 do や be を 連発で とっさに 出す 練習！'],['think','わかってるのに とっさに 出ない ときは、 ⚡特別練習で 連発しよう']],
 x_kdAgain:[['smile','⚡特別練習、 きのうより 速く なってるかも。 ためしてみる？'],['proud','この前の 特別練習、 {ok}問 正解だったね。 また 連発しよう']],
});
try{const RL=MINA_SENSE._rules,go=()=>['⚡ 特別練習',()=>open()];
  RL.push(['x_kdTry',3,()=>!R.n&&window.SHIKUMI&&SHIKUMI.doneN()>0?{}:null,go]);
  RL.push(['x_kdAgain',2,()=>R.n&&R.t&&Date.now()-R.t>864e5?{ok:R.best||0}:null,go]);
}catch(e){}
})();
