/* 🔎 ミナ先生の とことん授業。「もっと くわしく 知りたい」に とことん つきあう。
   - 文法 1つを 先生と 1対1で：ひとことで → 図 → ルール。そのあと 「知りたい こと」を えらぶ たびに 先生が 答える
     （なんで？・図・例文・よく ある まちがい・にてる 文法との ちがい・覚え方・よく ある 疑問・授業へ）
   - 「わかった！」で 5問の たしかめ（苦手とっくんと 同じ：ヒント → 解説・同じ 問題は ひとめぐり するまで 出ない）。
     ★（わかった度）・コイン・まちがえた ところへ もどる 道
   - 日本語で 自由に 質問しても OK。ことばの にかたで 近い 答えを さがす（ほかの 文法の 話なら そっちへ 案内）
   - 画面の 上に かさねて ひらく ので、会話の とちゅうでも 話は そのまま
   - 入口：会話の 📘解説・会話と とっくんの おわり・文法カルテ・文法ノート・「ミナ先生と 英語で 話す」・ホームの ミナ先生
   中身は game/deep-data.js（DEEP_DATA）と 文法ノート・ミニ授業の 図・SENSEI_ERR / SENSEI_DRILL。
   セリフは game/mina-talk.js の dp_ と x_dp で はじまる 場面 */
(()=>{
const {S:ST,sfx:SFX}=BEACH;
const H=HE,esc=H.esc,$=id=>document.getElementById(id);
const DD=typeof DEEP_DATA!=='undefined'?DEEP_DATA:{},ERR=typeof SENSEI_ERR!=='undefined'?SENSEI_ERR:{},DR=typeof SENSEI_DRILL!=='undefined'?SENSEI_DRILL:{};
const GS=()=>window.GRAMSEE,gById=id=>GS()&&GS().byId(id);
const owned=id=>(ST.gram.owned||[]).includes(id);
const LVI={es:'🐣 小学生',jh:'🎒 中学生',hs:'📐 高校生'};
const pickL=a=>a[Math.random()*a.length|0];
const shuffle=a=>H.shuffle?H.shuffle(a.slice()):a.slice().sort(()=>Math.random()-.5);
const ML=(k,v)=>MINA.line(k,v);
const snd=k=>{try{SFX[k]&&SFX[k]()}catch(e){}};
const S=()=>window.SENSEI;
const talk=en=>{try{S()&&S().talk(en)}catch(e){}},hush=()=>{try{speechSynthesis.cancel()}catch(e){}};
/* what was asked, per grammar: {n: times opened, k: questions asked, t: last time} (saved with the talks) */
const rec=()=>{const r=S()?S().rec():{};return r.deep=r.deep||{}};
const allIds=()=>Object.keys(typeof GRAMMAR!=='undefined'?GRAMMAR:{}).flatMap(lv=>GRAMMAR[lv].notes.map(n=>n.id));

/* ---------- words → how alike (Japanese: pairs of letters; English: whole words) ---------- */
const kata=s=>s.replace(/[ァ-ヶ]/g,c=>String.fromCharCode(c.charCodeAt(0)-96));
const norm=s=>kata(String(s||'').toLowerCase().replace(/<[^>]+>/g,'')).replace(/[\s　、。！？!?.,「」『』（）()〜~・:：'’"]/g,'');
const bi=s=>{const t=norm(s),o=new Set();for(let i=0;i<t.length-1;i++)o.add(t.slice(i,i+2));return o};
const alike=(a,b)=>{const A=bi(a),B=bi(b);if(!A.size||!B.size)return 0;let n=0;A.forEach(x=>{if(B.has(x))n++});return 2*n/(A.size+B.size)};
const enW=s=>(String(s).toLowerCase().match(/[a-z][a-z']*/g)||[]).filter(w=>w.length>1||w==='a');
const hasW=(text,ws)=>{const t=' '+String(text).toLowerCase().replace(/<[^>]+>/g,' ').replace(/[^a-z']+/g,' ')+' ';return ws.filter(w=>t.includes(' '+w+' ')).length};

/* ---------- the lesson pictures that go with a grammar (game/lessons via game/gram-link.js) ---------- */
function lesFigs(id){const out=[];try{(window.GRAMLINK?GRAMLINK.lessonsFor(id):[]).forEach(l=>l.steps.forEach((s,i)=>{if(s[3])out.push({t:s[2],fig:s[3],l})}))}catch(e){}return out}
/* example sentences: the note's, the ones found on the beach, the ones from the talks */
function examples(id,n){const out=n.ex.map(e=>({en:e[0],ja:e[1]}));
  try{(GS()?GS().seenOf(id):[]).slice(-4).forEach(en=>{if(!out.some(x=>x.en===en))out.push({en,ja:'',seen:1})})}catch(e){}
  try{(DR[id]||[]).forEach(d=>d.good.forEach(g=>{const en=S().fill(g,{});if(en&&!/\{/.test(en)&&!out.some(x=>x.en===en))out.push({en,ja:''})}))}catch(e){}
  return out}
/* mistakes: Mina's word on each kind, with a wrong → right pair from the talks when there is one */
function mistakes(id){const keys=Object.keys(ERR).filter(k=>ERR[k][0]===id),out=[];
  keys.forEach(k=>{let pair=null;
    (DR[id]||[]).some(d=>{const b=(d.bad||[]).find(x=>x[1]===k);if(!b)return false;
      try{const V={},bad=S().fill(b[0],V),good=d.good.map(g=>S().fill(g,V)).sort((x,y)=>hasW(y,enW(bad))-hasW(x,enW(bad)))[0];if(bad&&good&&!/\{/.test(bad+good))pair=[bad,good]}catch(e){}
      return !!pair});
    out.push({k,hint:ERR[k][1],exp:ERR[k][2],pair})});
  return out}

/* ---------- the overlay: it sits on top of whatever is open, so a talk with Mina goes on after ---------- */
let C=null;
function shell(){let o=$('dpov');if(!o){o=document.createElement('div');o.id='dpov';document.body.appendChild(o)}return o}
function close(){const o=$('dpov');if(o)o.remove();C=null;hush()}
const live=()=>C&&$('dplog');
function scroll(){const l=$('dplog');if(l)setTimeout(()=>l.scrollTo({top:l.scrollHeight,behavior:'smooth'}),30)}
/* Mina says (Japanese, maybe a picture, maybe English lines to hear) */
function mina(html,ex='smile',more){if(!live())return null;const d=document.createElement('div');d.className='lsay dpm';
  d.innerHTML=`<span class="lface">${MINA.face('m',ex)}</span><div class="lbody"><p>${html}</p>${more||''}</div>`;
  $('dplog').appendChild(d);d.querySelectorAll('[data-say]').forEach(b=>b.onclick=e=>{e.stopPropagation();snd('pop');talk(b.dataset.say)});
  if(GS())try{GS().bind(d)}catch(e){}scroll();return d}
function you(t){if(!live())return;const d=document.createElement('div');d.className='lsay by-h dpy';
  d.innerHTML=`<span class="lface kf you">⭐</span><div class="lbody"><p>${esc(t)}</p></div>`;$('dplog').appendChild(d);scroll()}
const fz=h=>h?`<div class="fz">${h}</div>`:'';
const enRow=e=>`<button class="dpen" data-say="${esc(e.en)}"><span>🔊 ${GS()?GS().mark(e.en):esc(e.en)}</span>${e.ja?`<small>${esc(e.ja)}</small>`:e.seen?'<small>🌊 浜辺で 見つけた 英文</small>':''}</button>`;
const nudge=()=>{const [ex,tx]=ML('dp_more',{g:C.g});return [ex,tx]};

/* ---------- the things you can ask about ---------- */
function topics(){const c=C,d=c.d,out=[];
  d.qa.forEach((q,i)=>{if(!c.asked.has('q'+i))out.push(['q'+i,'❓ '+q[0]])});
  if(d.why&&!c.asked.has('why'))out.push(['why','🤔 なんで そうなるの？']);
  if(c.figs.length>c.figI)out.push(['fig','🖼️ 図で 見たい']);
  if(c.ex.length>c.exI)out.push(['ex',c.exI?'📝 例文を もっと':'📝 例文を 見たい']);
  if(c.err.length>c.errI)out.push(['err',c.errI?'⚠️ ほかの まちがいも':'⚠️ よく ある まちがい']);
  if(d.vs&&!c.asked.has('vs')&&gById(d.vs[0]))out.push(['vs','🔀 「'+gById(d.vs[0]).n.t+'」との ちがい']);
  if(d.tip&&!c.asked.has('tip'))out.push(['tip','💡 覚え方']);
  if(c.n.r.length>2&&!c.asked.has('rules'))out.push(['rules','📜 ルールを ぜんぶ']);
  if(c.les&&!c.asked.has('les'))out.push(['les','📖 授業で 見る']);
  return out}
function chips(){if(!live())return;const t=topics(),box=$('dpchips'),open=C.open;
  const main=t.filter(x=>x[0][0]==='q').slice(0,2).concat(t.filter(x=>x[0][0]!=='q')).slice(0,open?99:5),rest=open?[]:t.filter(x=>!main.includes(x));
  box.innerHTML=main.map(x=>`<button data-k="${x[0]}">${esc(x[1])}</button>`).join('')+(rest.length?`<button class="sub" data-more="1">ほかの 質問 ▾ ${rest.length}</button>`:'')+`<button class="dpok" data-k="ok">✅ わかった！ ✏️ 5問で たしかめる</button>`;
  box.querySelectorAll('[data-k]').forEach(b=>b.onclick=()=>{snd('step');ask(b.dataset.k,b.textContent)});
  const m=box.querySelector('[data-more]');if(m)m.onclick=()=>{snd('pop');C.open=1;chips()}}
function ask(k,label){if(!live())return;hush();const c=C,d=c.d;if(label)you(label.replace(/^\S+\s/,''));c.asked.add(k);c.open=0;
  const r=rec()[c.id]=rec()[c.id]||{n:0,k:0,t:0};r.k++;r.t=Date.now();save();
  const after=(ms=600)=>setTimeout(()=>{if(!live())return;chips()},ms);
  if(k[0]==='q'&&k!=='ok'){const q=d.qa[+k.slice(1)];if(q){mina(q[1],'think',fz(q[2]));after();return}}
  if(k==='why'){const [ex,tx]=ML('dp_why',{g:c.g});mina(`${tx}<br><b>${d.why}</b>`,ex);after();return}
  if(k==='fig'){const f=c.figs[c.figI++];if(f){mina(`${f.t}<small class="dpsrc">📖 授業「${esc(f.l.t)}」より</small>`,'think',fz(f.fig))}after();return}
  if(k==='ex'){const a=c.ex.slice(c.exI,c.exI+3);c.exI+=3;const [ex,tx]=ML('dp_ex',{g:c.g});mina(tx,ex,`<div class="dpens">${a.map(enRow).join('')}</div>`);if(a[0])talk(a[0].en);after();return}
  if(k==='err'){const a=c.err.slice(c.errI,c.errI+2);c.errI+=2;const [ex,tx]=ML('dp_err',{g:c.g});
    mina(tx,ex,a.map(e=>`<div class="dperr">${e.pair?`<span class="snfix"><s>${esc(e.pair[0])}</s><br>⭕ <b class="snen">${esc(e.pair[1])}</b></span>`:''}<span>${e.exp}</span></div>`).join(''));after();return}
  if(k==='vs'){const g2=gById(d.vs[0]);mina(`「${esc(g2.n.t)}」との ちがいは こう！<br>${d.vs[1]}`,'think',fz(d.vs[2])+`<span class="snbtns"><button class="sub" data-go="${d.vs[0]}">🔎 「${esc(g2.n.t)}」も くわしく</button></span>`);
    const b=$('dplog').lastChild.querySelector('[data-go]');if(b)b.onclick=()=>{snd('step');open(b.dataset.go)};after();return}
  if(k==='tip'){const [ex,tx]=ML('dp_tip',{g:c.g});mina(tx,ex,fz(`<div class="fz-tip">${d.tip}</div>`));after();return}
  if(k==='rules'){mina(`「${esc(c.n.t)}」の ルール、ぜんぶ だよ`,'smile',`<ul class="dprules">${c.n.r.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`);after();return}
  if(k==='try'){check();return}
  if(k==='les'){const l=c.les;close();snd('lesson');LESSON.open(l.id,()=>{MINA.open()});return}
  if(k==='ok'){r.n++;save();check();return}
  after()}
/* ---------- ✏️ たしかめ 5問：苦手とっくんと 同じ ように、まちがえたら ヒント → もう一回 まちがえたら 解説 ----------
   問題は 文法ノートの 空らん（＋ DEEP_DATA の qz）と、ミナ先生の 質問への 正しい 答え（SENSEI_DRILL）。
   ひとめぐり するまで 同じ 問題は 出さない（rec()[id].qs）。おわりに ★（わかった度）・コイン・つぎの 一歩 */
const PAY={es:8,jh:10,hs:12};
const cap=t=>t&&t.charAt(0).toUpperCase()+t.slice(1);
function qPool(id){const g=gById(id);if(!g)return [];const d=DD[id]||{},out=[];
  (g.n.q||[]).forEach((q,i)=>out.push({k:'n'+i,q}));(d.qz||[]).forEach((q,i)=>out.push({k:'x'+i,q}));
  if(S())(DR[id]||[]).forEach((x,i)=>{if(x.bad&&x.bad.length)out.push({k:'d'+i,x})});
  return out}
/* questions not asked yet first; when all were asked, a new round starts */
function pickQs(id,n){const P=qPool(id),r=rec()[id],seen=new Set(r.qs||[]);
  const take=shuffle(P.filter(p=>!seen.has(p.k))).slice(0,n);
  if(take.length<n){take.push(...shuffle(P.filter(p=>seen.has(p.k))).slice(0,n-take.length));r.qs=take.map(p=>p.k)}
  else r.qs=[...seen,...take.map(p=>p.k)];
  return take}
/* the grammar's mistake (SENSEI_ERR) and rule closest to a sentence */
function errFor(id,text){const ks=Object.keys(ERR).filter(k=>ERR[k][0]===id);if(!ks.length)return null;const ws=enW(text);
  return ks.map(k=>[k,hasW(ERR[k][1]+' '+ERR[k][2],ws)+alike(text,ERR[k][2])]).sort((a,b)=>b[1]-a[1])[0][0]}
function ruleFor(n,text){const ws=enW(text);return n.r.map(r=>[r,hasW(r,ws)*2+alike(text,r)]).sort((a,b)=>b[1]-a[1])[0][0]}
function makeQ(id,p){const n=gById(id).n;
  if(p.q){const q=p.q,ans=q[1][q[2]],full=q[0].replace('___',ans),ek=errFor(id,full),rule=ruleFor(n,full);
    return {kind:'fill',sent:q[0],ja:q[3]||'',opts:q[1].map((o,i)=>({t:o,ok:i===q[2]})),full,rule,
      hint:q[4]||(ek?ERR[ek][1]:`ルールを 思いだして：${esc(rule)}`),exp:q[5]||(ek?ERR[ek][2]:'')}}
  const x=p.x,V={},F=t=>cap(S().fill(t,V)),s=F(x.s),ja=S().fill(x.j,V),good=F(pickL(x.good)),bad=shuffle(x.bad).slice(0,2);
  return {kind:'talk',s,ja,full:good,rule:ruleFor(n,good),opts:[{t:good,ok:1},...bad.map(b=>({t:F(b[0]),ok:0,ek:b[1]||null,h:b[2]||null}))]}}

function bar(){const q=document.querySelector('#dpov .qn');if(!q||!C)return;const T=C.T;q.textContent=T?`✏️ ${Math.min(T.i+1,T.qs.length)}/${T.qs.length}`:LVI[C.lv]||''}
const starH=n=>`${'★'.repeat(n)}<i>${'★'.repeat(3-n)}</i>`;
function best(){const t=$('dpbest'),b=(rec()[C.id]||{}).best||0;if(t)t.innerHTML=b?starH(b):''}
function check(again){const c=C;if(!live())return;hush();
  const qs=pickQs(c.id,5).map(p=>{try{return makeQ(c.id,p)}catch(e){return null}}).filter(q=>q&&!/\{/.test(q.full+(q.s||'')+q.opts.map(o=>o.t).join('')));
  if(!qs.length){chips();return}
  c.T={qs,i:0,st:{ok:0,hint:0,miss:0},row:0,miss:[]};save();
  $('dpchips').innerHTML='';$('dpask').hidden=true;
  const [ex,tx]=ML(again?'dp_cAgain':c.asked.size>=3?'dp_cStartMany':'dp_cStart',{g:c.g,n:qs.length,k:c.asked.size});mina(tx,ex);snd('step');
  setTimeout(askQ,700)}
function askQ(){if(!live()||!C.T)return;const T=C.T,q=T.qs[T.i];if(!q)return result();T.tries=0;bar();
  if(T.i===T.qs.length-1&&T.qs.length>2){const [ex,tx]=ML('dp_cLast',{g:C.g});mina(tx,ex)}
  const order=shuffle(q.opts.map((o,i)=>i)),[b,a]=q.kind==='fill'?q.sent.split('___'):['',''];
  const head=q.kind==='fill'?`<b>Q${T.i+1}.</b> この ___ に 入るのは？<b class="dpq">${esc(b)}<u>　？　</u>${esc(a||'')}</b>${q.ja?`<small>${esc(q.ja)}</small>`:''}`
    :`<b>Q${T.i+1}.</b> わたしの 質問に、正しく 答えて いるのは？`;
  const d=mina(head,'smile',(q.kind==='talk'?`<div class="dpens">${enRow({en:q.s,ja:q.ja})}</div>`:'')+
    `<span class="snbtns dpopts ${q.kind==='talk'?'dpcol':''}">${order.map(i=>`<button class="sub" data-o="${i}">${esc(q.opts[i].t)}</button>`).join('')}</span>`);
  if(q.kind==='talk')talk(q.s);
  d.querySelectorAll('[data-o]').forEach(bt=>bt.onclick=()=>{if(bt.disabled||!C||!C.T)return;hush();const o=q.opts[+bt.dataset.o];
    if(o.ok){bt.classList.add('right');d.querySelectorAll('[data-o]').forEach(x=>x.disabled=true);got(q)}
    else{bt.classList.add('wrong');bt.disabled=true;T.tries++;missed(q,o,d)}})}
function got(q){const T=C.T,first=!T.tries;snd('correct');
  if(first){T.st.ok++;T.row++}else{T.st.hint++;T.row=0}
  try{S()&&S().gram(C.id,first?2:1)}catch(e){}
  const k=!first?'dp_cOkHint':T.row>=3&&T.row%2===1?'dp_cStreak':'dp_cOk',[ex,tx]=ML(k,{g:C.g,n:T.row});
  setTimeout(()=>{if(!live())return;mina(tx,ex,q.kind==='fill'?`<div class="dpens">${enRow({en:q.full,ja:q.ja})}</div>`:'');if(q.kind==='fill')talk(q.full);
    T.i++;setTimeout(askQ,q.kind==='fill'?1300:800)},450)}
function missed(q,o,d){const T=C.T,left=d.querySelectorAll('[data-o]:not(:disabled)').length;
  /* 1回目：ヒント（問題の 中に 出す ので、えらびなおしやすい） */
  if(T.tries===1&&left>1){snd('pickup');const h=o.h||(o.ek&&ERR[o.ek]?ERR[o.ek][1]:'')||(q.kind==='fill'?q.hint:'質問を もう一度 よく 見て。 だれの こと？ いつの こと？ なにを きかれてる？');
    const [,tx]=ML('dp_cHint',{g:C.g}),el=document.createElement('div');el.className='dphint';el.innerHTML=`💡 <b>ヒント</b>　${h}<small>${tx}</small>`;
    d.querySelector('.lbody').insertBefore(el,d.querySelector('.dpopts'));scroll();return}
  /* 2回目：解説 */
  snd('wrong');d.querySelectorAll('[data-o]').forEach(x=>{x.disabled=true;if(q.opts[+x.dataset.o].ok)x.classList.add('right')});
  T.st.miss++;T.row=0;T.miss.push(q);try{S()&&S().gram(C.id,0)}catch(e){}
  const exp=q.kind==='fill'?q.exp:(o.ek&&ERR[o.ek]?ERR[o.ek][2]:'答えの 意味が 質問と ずれて いたよ。 わたしが なにを きいたか、 もう一度 よく 見てね');
  const bad=q.kind==='fill'?q.sent.replace('___',o.t):o.t,[ex,tx]=ML('dp_cExplain',{g:C.g});
  setTimeout(()=>{if(!live())return;
    const e=mina(tx,ex,`<div class="dperr"><span class="snfix"><s>${esc(bad)}</s><br>⭕ <b class="snen">${esc(q.full)}</b></span>${exp?`<span>${exp}</span>`:''}<span class="snrule">・${esc(q.rule)}</span></div>
      <span class="snbtns"><button data-n="1">わかった！ つぎへ ▶</button>${C.d.why?'<button class="sub" data-w="1">🤔 なんで？</button>':''}</span>`);
    talk(q.full);
    e.querySelector('[data-n]').onclick=()=>{snd('step');hush();const bt=e.querySelector('.snbtns');if(bt)bt.remove();T.i++;askQ()};
    const w=e.querySelector('[data-w]');if(w)w.onclick=()=>{snd('pop');w.remove();const p=document.createElement('div');p.className='dpwhy';p.innerHTML='🤔 '+C.d.why;e.querySelector('.lbody').insertBefore(p,e.querySelector('.snbtns'));scroll()}},500)}
/* the end of the 5: ★, coins, Mina's word, what next */
function result(){const c=C,T=c.T,st=T.st,N=T.qs.length,r=rec()[c.id];
  const perfect=st.ok===N,stars=perfect?3:st.miss<=1?2:1,firstChk=!r.cn,new3=stars===3&&(r.best||0)<3;
  r.cn=(r.cn||0)+1;r.best=Math.max(r.best||0,stars);r.last=stars;r.ct=Date.now();
  const P=PAY[c.lv]||8,pay=(firstChk?P:Math.max(3,P/2|0))+(perfect?5:0)+(new3?5:0);save();
  const k=new3?'dp_cMaster':perfect?'dp_cPerfect':stars===2?'dp_cGood':'dp_cMiss',[ex,tx]=ML(k,{g:c.g,n:st.ok,N,m:st.miss});
  c.T=null;bar();best();
  const d=document.createElement('div');d.className='kres dpres';
  d.innerHTML=`<p class="kend good">✏️ たしかめ おわり！</p>
    <p class="dpstar">${starH(stars)}<small>わかった度</small></p>
    <div class="snscore"><span>⭕ 1回で <b>${st.ok}</b></span><span>💡 ヒントで <b>${st.hint}</b></span><span>📘 解説 <b>${st.miss}</b></span></div>
    <p class="kpay">🪙 <b>${pay}まい</b>${firstChk?' <small>はじめての たしかめ</small>':''}${perfect?' <small>ノーミス +5</small>':''}${new3?' <small>★3 はじめて +5</small>':''}</p>
    <div class="kmina"><span class="lface">${MINA.face('m',ex)}</span><p>${tx}</p></div>
    ${T.miss.length?`<details class="dpmiss"><summary>📘 解説を きいた 問題 ${T.miss.length}</summary><div class="dpens">${T.miss.map(q=>enRow({en:q.full,ja:q.kind==='fill'?q.ja:''})).join('')}</div></details>`:''}
    <div class="row">${perfect?'':'<button data-e="back">🔎 もう少し くわしく</button>'}<button data-e="again" class="${perfect?'':'sub'}">🔁 もう一回 5問</button></div>
    <div class="snbtns dpnext"><button class="sub" data-e="tk">🎯 とっくん</button><button class="sub" data-e="gn">${owned(c.id)?'📚 ノート':'🔍 ノート'}</button>${c.les?'<button class="sub" data-e="ls">📖 授業</button>':''}<button class="sub" data-e="x">✖ とじる</button></div>`;
  $('dplog').appendChild(d);d.querySelectorAll('[data-say]').forEach(b=>b.onclick=e=>{e.stopPropagation();snd('pop');talk(b.dataset.say)});scroll();
  new3?snd('fanfare'):snd('done');
  setTimeout(()=>{try{const b=d.getBoundingClientRect();H.coinBurst(b.left+b.width/2,Math.min(b.top+40,innerHeight-60),pay)}catch(e){}},400);
  d.querySelectorAll('[data-e]').forEach(b=>b.onclick=()=>{const e=b.dataset.e,id=c.id;
    if(e==='back'||e==='again'){d.querySelectorAll('.row,.dpnext').forEach(x=>x.remove());
      if(e==='again'){check(1);return}
      snd('step');$('dpask').hidden=false;[...c.asked].forEach(x=>{if(x[0]!=='q')c.asked.delete(x)});c.errI=0;c.exI=0;c.figI=c.d.fig?0:1;
      const [e2,t2]=ML('dp_cReview',{g:c.g});mina(t2,e2);chips();return}
    close();
    if(e==='tk'){snd('step');S()&&S().tokkun([id])}
    else if(e==='gn'){snd('book');const g=gById(id);owned(id)?H.gramNote(g.lv,g.i):H.gramTry(g.lv,g.i,()=>MINA.open())}
    else if(e==='ls'){snd('lesson');LESSON.open(c.les.id,()=>{MINA.open()})}
    else snd('back')})}

/* ---------- a question in your own words ---------- */
const INTENT=[[/なんで|なぜ|どうして|理由|りゆう|わけ/,'why'],[/例文|れいぶん|例|れい|使い方|つかいかた/,'ex'],[/ちがい|違い|ちがう|違う|差|区別|見分け|みわけ|くらべ|比べ/,'vs'],
  [/まちが|間違|ミス|よくある|気をつけ|注意/,'err'],[/図|絵|イメージ|見たい|みたい/,'fig'],[/覚え|おぼえ|コツ|こつ|暗記/,'tip'],
  [/問題|もんだい|練習|れんしゅう|ためし|テスト|クイズ/,'try'],[/授業|じゅぎょう/,'les'],[/ルール|まとめ|ぜんぶ|全部/,'rules']];
/* every grammar as a bag of letter pairs and English words; rare ones count more */
let IDX=null;
const bag=t=>({b:bi(t.replace(/[a-z']+/gi,' ')),w:new Set(enW(t))});
function index(){if(IDX)return IDX;const docs={},tits={},df={},wf={};
  allIds().forEach(id=>{const g=gById(id);if(!g)return;const d=DD[id]||{};
    docs[id]=bag([g.n.t,g.n.r.join(' '),d.one||'',d.why||'',d.tip||'',(d.qa||[]).map(q=>q[0]).join(' ')].join(' '));tits[id]=bag(g.n.t)});
  Object.values(docs).forEach(d=>{d.b.forEach(x=>df[x]=(df[x]||0)+1);d.w.forEach(x=>wf[x]=(wf[x]||0)+1)});
  return IDX={docs,tits,df,wf,N:Object.keys(docs).length}}
/* how much of the question a bag covers (0..1). Pairs of only hiragana count a little,
   but a question in only hiragana（もし〜なら）still finds its place */
function coverD(text,D){const I=index();if(!D)return 0;let have=0,all=0,strong=0,kn=0;
  bi(text.replace(/[a-z']+/gi,' ')).forEach(b=>{const n=I.df[b];if(!n)return;const kana=/^[ぁ-ゖー]+$/.test(b),w=Math.log(1+I.N/n)*(kana?.25:1);all+=w;if(kana)kn++;if(D.b.has(b)){have+=w;if(!kana)strong++}});
  enW(text).forEach(x=>{const n=I.wf[x];if(!n)return;const w=Math.log(1+I.N/n)*1.4;all+=w;if(D.w.has(x)){have+=w;strong++}});
  if(!all)return 0;const r=have/all;return strong?r:(kn>=3&&r>=.75?r*.7:0)}
/* words every question has: they say nothing about which grammar */
const STOP=/使い方|使いかた|つかいかた|使い分け|ちがい|違い|ちがう|違う|意味|いみ|ってなに|って何|ってなん|とは|わからない|分からない|わかんない|教えて|おしえて|について|どういう|どうやって|見分け方|見分け|みわけ|作り方|つくりかた|作りかた|なんで|なぜ|どうして|知りたい|しりたい|ですか|かな/g;
const cover=(text,id)=>{const I=index();text=String(text).replace(STOP,' ');return .75*coverD(text,I.docs[id])+.25*coverD(text,I.tits[id])};
/* the best place for a question: [score, grammar id, a known question of it or null] */
function find(text,cur){const best=[];
  allIds().forEach(id=>{const d=DD[id];if(!gById(id))return;let s=cover(text,id),what=null,qa=0;
    const I=index(),ws=enW(text).filter(w=>(I.wf[w]||0)<I.N/4);(d?d.qa:[]).forEach((q,i)=>{const a=alike(text,q[0])+(ws.length?Math.min(.36,hasW(q[0],ws)*.26):0);if(a>qa){qa=a;what='q'+i}});
    if(qa<.34)what=null;s=Math.max(s,qa);if(id===cur)s+=.12;best.push([s,id,what])});
  return best.sort((a,b)=>b[0]-a[0])}
function free(text){if(!live())return;text=String(text||'').trim();if(!text)return;hush();you(text);const c=C;
  const it=INTENT.find(x=>x[0].test(text)),f=find(text,c.id),top=f[0],mine=f.find(x=>x[1]===c.id);
  setTimeout(()=>{if(!live())return;
    /* a known question of this grammar */
    if(mine&&mine[2]&&mine[0]>=.34){ask(mine[2]);return}
    /* about another grammar → offer to go there */
    if(top&&top[1]!==c.id&&top[0]>=(it?.8:.45)&&(!mine||top[0]>mine[0]+.15)){const g2=gById(top[1]),[ex,tx]=ML('dp_jump',{g:'「'+g2.n.t+'」'});
      const d=mina(tx,ex,`<span class="snbtns"><button class="sub" data-go="1">🔎 「${esc(g2.n.t)}」を ひらく</button></span>`);
      d.querySelector('[data-go]').onclick=()=>{snd('step');open(top[1],{q:top[2]})};chips();return}
    /* what kind of question it is */
    if(it){const k=it[1],ok=topics().some(x=>x[0]===k)||k==='rules'||(k==='try'&&qPool(c.id).length)||(k==='why'&&c.d.why);
      if(ok){ask(k);return}
      const [ex,tx]=ML('dp_noMore',{g:c.g});mina(tx,ex);chips();return}
    /* rules that share words with the question */
    const ws=enW(text),rs=c.n.r.filter(r=>(ws.length&&hasW(r,ws))||alike(text,r)>.22);
    if(rs.length){mina(`ルールの ここが ヒントに なるかも`,'think',`<ul class="dprules">${rs.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`);chips();return}
    const [ex,tx]=ML('dp_unknown',{g:c.g});mina(tx,ex);chips()},450)}

/* ---------- open: one grammar ---------- */
function open(id,opt){const g=gById(id);if(!g)return;opt=opt||{};hush();
  const n=g.n,d=DD[id]||{one:n.r[0],why:'',tip:'',qa:[]},figs=lesFigs(id),les=(window.GRAMLINK&&window.LESSON?GRAMLINK.lessonsFor(id):[])[0]||null;
  C={id,lv:g.lv,g:'「'+n.t+'」',n,d,figs,figI:d.fig?0:1,ex:examples(id,n),exI:0,err:mistakes(id),errI:0,les,asked:new Set(),open:0};
  const r=rec()[id]=rec()[id]||{n:0,k:0,t:0};r.t=Date.now();save();
  shell().innerHTML=`<section class="pnl dpp" role="dialog" aria-label="とことん授業">
    <div class="qtop"><button class="x" id="dpx" aria-label="とじる">✕</button><b>🔎 とことん授業</b><span class="qn">${LVI[g.lv]||''}</span></div>
    <p class="dpt">${esc(n.t)} <span id="dpbest" class="dpbest"></span></p>
    <div class="lslog dplog" id="dplog"></div>
    <div class="dpchips" id="dpchips"></div>
    <form class="dpask" id="dpask"><input id="dpin" type="text" autocomplete="off" placeholder="ほかに 知りたい ことを 書いてね（日本語で OK）"><button>きく</button></form>
  </section>`;
  $('dpx').onclick=()=>{snd('back');close()};$('dpov').onclick=e=>{if(e.target.id==='dpov'){snd('back');close()}};
  $('dpask').onsubmit=e=>{e.preventDefault();const v=$('dpin').value;$('dpin').value='';free(v)};
  snd('book');best();
  const [ex,tx]=ML(r.n?'dp_again':'dp_hello',{g:C.g});
  mina(tx,ex);
  if(opt.chk){setTimeout(()=>{if(live())check(1)},700);return}
  setTimeout(()=>{if(!live())return;const f=d.fig||(figs[0]&&figs[0].fig);
    mina(`<b>ひとことで 言うと：</b>${d.one}`,'smile',fz(f));
    setTimeout(()=>{if(!live())return;
      mina(`ルールは この ${Math.min(3,n.r.length)}つ`,'think',`<ul class="dprules">${n.r.slice(0,3).map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`);if(n.r.length<=3)C.asked.add('rules');
      if(opt.q){ask(opt.q);return}
      setTimeout(()=>{if(!live())return;const [e2,t2]=nudge();mina(t2,e2,'');chips()},500)},500)},500)}

/* ---------- open with no grammar yet: "what do you want to know?" ---------- */
function pick(){hush();C=null;const w=(S()?S().weak():[]).filter(gById).slice(0,3),lv=(()=>{try{const l=MINA.level();return l==='adv'?'hs':l}catch(e){return 'es'}})();
  const mine=(GRAMMAR[lv]||GRAMMAR.es).notes;const [ex,tx]=ML(w[0]?'dp_pickWeak':'dp_pick',{g:w[0]?'「'+gById(w[0]).n.t+'」':''});
  shell().innerHTML=`<section class="pnl dpp" role="dialog" aria-label="とことん授業">
    <div class="qtop"><button class="x" id="dpx" aria-label="とじる">✕</button><b>🔎 とことん授業</b><span class="qn"></span></div>
    <div class="kmina"><span class="lface">${MINA.face('m',ex)}</span><p>${tx}</p></div>
    <form class="dpask" id="dpask"><input id="dpin" type="text" autocomplete="off" placeholder="れい：have と has の ちがいは？"><button>きく</button></form>
    <div id="dpfound"></div>
    ${w.length?`<p class="note">🔥 苦手な 文法から</p><div class="dpchips">${w.map(id=>`<button data-g="${id}">${esc(gById(id).n.t)}</button>`).join('')}</div>`:''}
    <details class="dplist"><summary>📚 文法を えらぶ（${LVI[lv]||''}）${(()=>{const m=mine.filter(n=>((rec()[n.id]||{}).best||0)>=3).length;return m?`　★3 ${m}/${mine.length}`:''})()}</summary><div class="dpchips">${mine.map(n=>{const b=(rec()[n.id]||{}).best||0;return `<button data-g="${n.id}">${esc(n.t)}${b?` <span class="dpbest">${starH(b)}</span>`:''}</button>`}).join('')}</div></details>
  </section>`;
  $('dpx').onclick=()=>{snd('back');close()};$('dpov').onclick=e=>{if(e.target.id==='dpov'){snd('back');close()}};
  const bind=()=>$('dpov').querySelectorAll('[data-g]').forEach(b=>b.onclick=()=>{snd('step');open(b.dataset.g,{q:b.dataset.q||null})});bind();
  $('dpask').onsubmit=e=>{e.preventDefault();const v=$('dpin').value.trim();if(!v)return;const f=find(v,null).filter(x=>x[0]>=.2).slice(0,3);snd('pop');
    if(f[0]&&f[0][0]>=.5&&(!f[1]||f[0][0]-f[1][0]>.12)){open(f[0][1],{q:f[0][2]});return}
    const [e2,t2]=ML(f.length?'dp_found':'dp_unknown',{g:''});
    $('dpfound').innerHTML=`<div class="kmina"><span class="lface">${MINA.face('m',e2)}</span><p>${t2}</p></div>${f.length?`<div class="dpchips">${f.map(x=>`<button data-g="${x[1]}" ${x[2]?`data-q="${x[2]}"`:''}>${esc(x[2]?DD[x[1]].qa[+x[2].slice(1)][0]:gById(x[1]).n.t)}</button>`).join('')}</div>`:''}`;bind()}}

/* ---------- 文法ノートの ページに 「とことん」ボタン ---------- */
H.on('gramView',(lv,i,n)=>setTimeout(()=>{const row=H.panel.querySelector('.gview .row');if(!row||row.querySelector('#gdp'))return;
  row.insertAdjacentHTML('beforeend','<button id="gdp" class="sub">🔎 とことん</button>');$('gdp').onclick=()=>{snd('step');open(n.id)}},0));

window.DEEP={open,pick,close,has:id=>!!DD[id],rec,find,_c:()=>C,_qs:id=>qPool(id).map(p=>{try{return makeQ(id,p)}catch(e){return {err:e.message}}})};
})();
