/* 📝 ミオと 英語で おしゃべり: 毎回 ちがう、 いまの レベルに あった 3つの 話（中身は game/mio-study-data.js）
   - えらび方は リクの バイト（game/tutor.js）と 同じ: 苦手な 文法 → いまの レベルまで。 いちど 出た 話は 一巡するまで 出ない
   - ミオが 「英語で どう 言う？」と 聞く → えらぶ。 まちがえても 失敗に ならない（ミオが ためしに 言ってみて 大わらい → ヒント → えらびなおし）
   - 正しいと 解説。 ときどき ミオが 授業で ならった ことを 教えてくれる（意味を あてる）
   - おわりに まとめ（一発で ⭕）。 ♥ と コインは 1日 2回まで。 ノートに のこる
   データは SHOP.rec().mio.st = {seen:[],ok:{},n,d,dn} */
(()=>{
const {S:ST,sfx:SFX}=BEACH;
const H=HE,esc=H.esc,$=id=>document.getElementById(id);
const pickL=a=>a[Math.random()*a.length|0];
const sf=k=>{try{SFX[k]&&SFX[k]()}catch(e){}};
const shuffle=a=>H.shuffle(a.slice());
const LV=['es','jh','hs','adv'],NQ=3,PER_DAY=2,PAY=8;
const T=MIO_STUDY,TK=MIO_STUDY_TALK;
const today=()=>{try{return CG.today()}catch(e){return new Date().toDateString()}};
const save=()=>{try{CG.save()}catch(e){}};
const speak=en=>{try{MIO.say(en)}catch(e){}};
const myLv=()=>{try{return MINA.level()}catch(e){return 'es'}};
const SR=()=>{const M=MIOC.rec();return M.st||(M.st={seen:[],ok:{},n:0,d:'',dn:0})};
const POSE={wave:'wave',peace:'peace',thumb:'thumb',guts:'guts'};

/* ---------- えらぶ: 苦手 → いまの レベルまで ---------- */
function weakG(){const W=new Set();
  try{Object.entries(MINA.rec().g||{}).forEach(([id,e])=>{if(e.m>0&&(e.k||0)<3)W.add(id)})}catch(e){}
  try{SENSEI.weak().forEach(id=>W.add(id))}catch(e){}return W}
function pick3(){const S=SR(),me=Math.max(0,LV.indexOf(myLv())),W=weakG();
  let pool=T.filter(q=>LV.indexOf(q.lv)<=me||(q.g&&W.has(q.g)&&LV.indexOf(q.lv)<=me+1));
  if(pool.length<NQ)pool=T.slice();
  let fresh=pool.filter(q=>!S.seen.includes(q.id));
  if(fresh.length<NQ){S.seen=S.seen.filter(id=>!pool.some(q=>q.id===id));fresh=pool.slice()}
  const weak=shuffle(fresh.filter(q=>q.g&&W.has(q.g))),mine=shuffle(fresh.filter(q=>q.lv===LV[me])),rest=shuffle(fresh);
  const out=[];const add=q=>{if(q&&out.length<NQ&&!out.includes(q))out.push(q)};
  add(weak[0]);add(mine[0]);add(mine[1]);rest.forEach(add);
  out.forEach(q=>S.seen.push(q.id));save();return shuffle(out)}

/* ---------- 画面 ---------- */
let P=null;
const live=()=>P&&$('mslog');
const hush=()=>{try{speechSynthesis.cancel()}catch(e){}};
const jaOn=()=>{try{return MINA.level()==='es'}catch(e){return true}};
function scrollLog(){const l=$('mslog');if(l)l.scrollTo({top:l.scrollHeight,behavior:'smooth'})}
function them(line,ex='smile',pose=''){if(!live())return;const [en,ja]=line,on=jaOn(),d=document.createElement('div');
  d.className='lsay kth'+(ex==='oops'?' k-oops':ex==='laugh'?' k-good':'');
  d.innerHTML=`<span class="lface kf mcf">${MIO.face(ex,POSE[pose]||'')}</span><div class="lbody"><p class="ken">${esc(en)}<button class="ksay" aria-label="もう一度 きく">🔊</button></p><small class="kja ${on?'on':''}">${esc(ja)}</small>${on?'':'<button class="kjab">訳を 見る</button>'}</div>`;
  $('mslog').appendChild(d);
  d.querySelector('.ksay').onclick=e=>{e.stopPropagation();speak(en)};
  const jb=d.querySelector('.kjab');if(jb)jb.onclick=()=>{sf('tap');jb.remove();d.querySelector('.kja').classList.add('on');scrollLog()};
  speak(en);scrollLog()}
function you(en){if(!live())return;const d=document.createElement('div');d.className='lsay by-h kyou-b';
  d.innerHTML=`<span class="lface kf you">⭐</span><div class="lbody"><p>${esc(en)}</p></div>`;$('mslog').appendChild(d);scrollLog()}
function note(h,cls=''){if(!live())return;const d=document.createElement('div');d.className='msbox '+cls;d.innerHTML=h;$('mslog').appendChild(d);scrollLog()}
function opts(list,fn){if(!live())return;const A=$('msans');
  A.innerHTML=`<div class="lopts kopts">${list.map(([t,k])=>`<button data-k="${k}">${esc(t)}</button>`).join('')}</div>`;
  A.querySelectorAll('[data-k]').forEach(b=>b.onclick=()=>{A.innerHTML='';fn(+b.dataset.k)});scrollLog()}
const later=(fn,ms)=>setTimeout(()=>{if(live())fn()},ms);

function start(back){hush();back=back||(()=>MIOC.open());
  const qs=pick3();P={qs,i:0,back,first:{},taught:0};
  H.show('cg',`<section class="pnl lsn kw zk shp mc" data-stay>
    <div class="qtop"><button class="x" id="msx" aria-label="やめる">←</button><b>📝 英語で おしゃべり</b><span class="qn" id="msq">1/${NQ}</span></div>
    <div class="lslog kwlog" id="mslog"></div>
    <div id="msans" class="kans"></div>
  </section>`);
  $('msx').onclick=()=>{sf('back');hush();const b=P.back;P=null;b()};
  later(()=>{them(pickL(TK.hi),'laugh','wave');later(ask,1300)},300)}

function ask(){const q=P.qs[P.i];$('msq').textContent=`${P.i+1}/${NQ}`;P.left=q.o.map((o,i)=>i);P.tries=0;
  note(`<span class="mstag">${q.sc} ${esc(q.t)}</span>`,'mshd');
  them(q.m,'smile');later(choose,900)}
function choose(){const q=P.qs[P.i];opts(shuffle(P.left).map(i=>[q.o[i][0],i]),pick)}
function pick(i){const q=P.qs[P.i],o=q.o[i];sf('tap');you(o[0]);
  if(o[1]){P.first[q.id]=!P.tries;later(right,600);return}
  P.tries++;P.left=P.left.filter(x=>x!==i);
  later(()=>{them(o[2]||pickL(TK.wrong),'oops');sf('tease');
    later(()=>{note(`💡 <b>ヒント</b>　${esc(q.hint)}`,'mshint');later(choose,500)},900)},600)}
function right(){const q=P.qs[P.i],S=SR();sf('correct');
  them(q.ok,'laugh',pickL(['peace','thumb','guts']));S.ok[q.id]=(S.ok[q.id]||0)+1;save();
  later(()=>{note(`<b>${P.first[q.id]?'⭕ 一発で せいかい！':'⭕ せいかい！'}</b><p>${esc(q.pt)}</p>`,'msexp');
    if(q.b&&(!P.taught||Math.random()<.4)&&Math.random()<.7)later(teach,900);else later(next,700)},900)}
/* ミオが 教えてくれる 番 */
function teach(){const q=P.qs[P.i],b=q.b;P.taught=1;
  them(pickL(TK.teach),'wink','peace');
  later(()=>{them(b.m,'smile');let left=b.o.map((x,i)=>i);
    const go=()=>opts(shuffle(left).map(i=>[b.o[i][0],i]),i=>{you(b.o[i][0]);
      if(b.o[i][1]){later(()=>{sf('correct');them(["Yes! That's it! You're quick, boss.","そう！ それです！ 店長、 さすが。"],'laugh','thumb');later(()=>{note(`<b>📒 ミオの 授業メモ</b><p>${esc(b.pt)}</p>`,'msexp');later(next,700)},800)},500)}
      else{left=left.filter(x=>x!==i);later(()=>{sf('tease');them(["Ha ha, close! Try again!","あはは、 おしい！ もう一回！"],'laugh');later(go,700)},500)}});
    later(go,800)},1200)}
function next(){P.i++;const A=$('msans');if(!A)return;
  if(P.i>=NQ)return A.innerHTML=`<button class="big" id="msend">まとめを 見る ▶</button>`,$('msend').onclick=()=>{sf('step');A.innerHTML='';finish()};
  A.innerHTML=`<button class="big" id="msnx">つぎの 話 ▶</button>`;
  $('msnx').onclick=()=>{sf('step');A.innerHTML='';them(pickL(TK.mid),'smile');later(ask,1100)}}

function finish(){if(!live()||P.done)return;P.done=1;const S=SR(),d=today();if(S.d!==d){S.d=d;S.dn=0}
  const paid=S.dn<PER_DAY;S.dn++;S.n++;try{RECENT.add('mio',{id:'study',how:'study',topics:P.qs.map(q=>q.id)})}catch(e){}
  const ones=P.qs.filter(q=>P.first[q.id]).length;
  const heart=paid&&window.MIOC?MIOC.gain(ones+1,'study'):'';
  const coins=paid?PAY:0;save();
  them(pickL(TK.bye),'laugh','wave');
  const k=S.n===1?'ms_first':ones===NQ?'ms_all':ones?'ms_some':'ms_none';
  let mk=['smile',''];try{mk=MINA.line(k,{n:ones})}catch(e){}
  later(()=>{$('msq').textContent='🏁';
    $('msans').innerHTML=`<div class="kres">
      <p class="kend good">📝 きょうの おしゃべり <small>一発 ${ones}/${NQ}</small></p>
      <div class="mssum">${P.qs.map(q=>`<p><b>${P.first[q.id]?'⭕':'🔁'} ${q.sc} ${esc(q.t)}</b><small>${esc(q.pt)}</small></p>`).join('')}</div>
      ${heart?`<p class="zkheart">${heart}</p>`:''}
      ${coins?`<p class="kpay">🪙 <b>${coins}まい</b> <small>きょう あと ${Math.max(0,PER_DAY-S.dn)}回</small></p>`:'<p class="kendn">♥ と コインは 1日 2回まで。 練習は 何回でも できるよ</p>'}
      <div class="kmina"><span class="lface">${MINA.face('m',mk[0])}</span><p>${mk[1]}</p></div>
      <div class="row"><button id="msagain" class="sub">🔁 もう一回</button><button id="msok" data-back>もどる</button></div>
    </div>`;
    if(coins){const r=$('msans').getBoundingClientRect();H.coinBurst(r.left+r.width/2,r.top+20,coins)}
    ones===NQ?sf('done'):sf('pop');
    const b=P.back;
    $('msok').onclick=()=>{sf('back');hush();P=null;b()};
    $('msagain').onclick=()=>{sf('step');start(b)};
    setTimeout(()=>{const a=$('msans');if(a)a.scrollIntoView({behavior:'smooth',block:'end'})},100)},1400)}

/* ---------- 📒 ノート ---------- */
function book(back){hush();const S=SR(),L=T.filter(q=>S.ok[q.id]);const LVN={es:'小',jh:'中',hs:'高',adv:'ハイ'};
  H.show('cg',`<section class="pnl cgp shp mc">
    <div class="qtop"><button class="x" id="msbx" aria-label="もどる">←</button><b>📒 ミオと まなんだ こと</b><span class="qn">${L.length}/${T.length}</span></div>
    ${L.length?`<div class="mssum">${L.map(q=>`<p><b>${q.sc} ${esc(q.t)} <i>${LVN[q.lv]}</i></b><small>${esc(q.pt)}</small>${q.b&&S.ok[q.id]?'':''}</p>`).join('')}</div>`:'<p class="note">まだ ないよ。 ミオと おしゃべり してみよう</p>'}
  </section>`);
  $('msbx').onclick=()=>{sf('back');back()}}

/* ================================================================ ミナ先生の セリフ */
Object.assign(MINA_LINES,{
 ms_first:[['happy','ミオさんと 英語で おしゃべり できたね！ 毎回 ちがう 話が 出るよ。 苦手な ところも まぜて くれるんだ'],['smile','教え合うと 自分も わかるように なるんだよ。 ミオさんと いい コンビだね']],
 ms_all:[['wow','3つとも 一発！ ミオさん、 たよりに してるね'],['proud','ぜんぶ 一発で せいかい。 説明も 読んで おくと もっと 強く なるよ']],
 ms_some:[['smile','一発 {n}つ！ まちがえた ところは ヒントで わかったね。 それが いちばん 身に つくんだよ'],['happy','いい おしゃべり だったね。 ノートに のこってるから あとで 見なおしてみて']],
 ms_none:[['smile','まちがえても だいじょうぶ。 ミオさんも 笑ってたでしょ？ ヒントで わかったのが 大事だよ'],['think','むずかしかった？ ノートの 説明を 読んでから もう一回 やってみよう']],
 x_mioStudy:[['smile','ミオさんが 英語の 質問を ためて まってるみたい。 おしゃべり してみたら？'],['happy','ミオさんとの 英語の おしゃべり、 毎回 ちがう 話が 出るんだって']]
});
if(window.MINA_SENSE&&MINA_SENSE._rules)MINA_SENSE._rules.push(
 ['x_mioStudy',3,()=>{try{const S=SR();return SHOP.rec().met&&(S.d!==today()||S.dn<PER_DAY)?{}:null}catch(e){return null}},()=>['📝 おしゃべり',()=>start()]]);

H.on('home',()=>{P=null});
window.MIOS={start,book,pick3,rec:SR};
})();
