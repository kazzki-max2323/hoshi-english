/* ⚡ 練習（PRAC）と 🤔 教えて（11/21 ミナ先生まわり 作りなおし 2回目）
   ユーザー: 「テストの 問題が わからなくて 学びたかったのに、 ヒントと 答え選びだけで 正解して 終わった」
   - ⚡ 練習: 習った 時間（単元 game/unit.js の おわった 時間）の 問題から 10問。 まちがえた 形・ふくしゅうの 日が 来た 形が 多め
       1回目の まちがいで 💡ヒント → 2回目で 📘解説（苦手とっくんと 同じ）。 最後まで まちがえた 問題は 4問あとに もう一回
       おわりは 「よくできた」＋ 結果 1行 ＋ つぎの 1つ（ごほうびは 小さく）
   - 🤔 教えて: どの 問題でも（答える 前・正解の あと・まちがいの あと）。 正しい 文 → 見る ところ → なぜ この 答え → ほかの 答えは なぜ ちがう（game/teach-why.js）
       → 📘 その 時間の 授業カードを その場で 見る → ← で 問題に もどる。 重ね #prteach（問題は うしろで そのまま）
   - 「身についた」: その 時間の 問題を 3問 ヒントなしで 正解・なおっていない まちがい なし（learned）。 一度に 増やさない（mina-plan.js gate）で 使う
   セリフ pr_ ・ te_ は この ファイルの さいご。 きろくは localStorage 'hoshi_prac' */
(()=>{
const {S:ST,sfx:SFX}=BEACH;
const H=HE,esc=H.esc,$=id=>document.getElementById(id);
const snd=k=>{try{SFX[k]&&SFX[k]()}catch(e){}};
const talk=en=>{try{speechSynthesis.cancel();window.SENSEI&&SENSEI.talk(en)}catch(e){}},hush=()=>{try{speechSynthesis.cancel()}catch(e){}};
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.random()*(i+1)|0;[a[i],a[j]]=[a[j],a[i]]}return a};
const pickL=a=>a[Math.random()*a.length|0];
const isEn=t=>/^[A-Za-z]/.test(String(t||''));
const face=(ex,tx)=>{try{return MINA.face('m',ex,MINA.poseFor?MINA.poseFor(ex,tx||''):undefined)}catch(e){return ''}};
const ML=(k,v)=>{try{return MINA.line(k,v||{})}catch(e){return ['smile','']}};
const KEY='hoshi_prac',N=10,DAY=864e5;
const R=(()=>{try{const s=JSON.parse(localStorage.getItem(KEY)||'null');if(s&&typeof s==='object')return s}catch(e){}return {}})();
R.q=R.q||{};R.ch=R.ch||{};
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(R))}catch(e){}};
const dk=d=>{d=d||new Date();return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate()};
const minaBox=(ex,tx)=>`<div class="mdsay"><span class="lface">${face(ex,tx)}</span><p>${tx}</p></div>`;
const enBtn=(en,ja)=>`<button class="mden" data-say="${esc(en)}"><span>🔊 ${esc(en)}</span>${ja?`<small>${esc(ja)}</small>`:''}</button>`;
const bindSay=el=>el.querySelectorAll('[data-say]').forEach(b=>b.onclick=e=>{e.stopPropagation();snd('pop');talk(b.dataset.say)});
const fullOf=q=>q.s?q.s.replace('___',q.o[0]):isEn(q.o[0])?q.o[0]:'';
const qText=q=>q.s||q.p;
const keyOf=(u,q)=>u.id+'|'+qText(q)+'|'+q.o[0];
const chKey=(u,ci)=>u.id+'|'+ci;

/* ---------- 問題の あつまり: おわった 時間の 問題 ---------- */
function items(only){const out=[];(window.UNIT?UNIT.list:[]).forEach(u=>{if(only&&u.id!==only)return;const r=u.rec(),CH=u.D.CH;
  const done=ci=>!!(r.ch&&r.ch[ci]&&r.ch[ci].d);
  CH.forEach((c,ci)=>{if(done(ci))c.q.forEach(q=>out.push({u,q,ci}))});
  (u.D.MIX||[]).forEach(q=>{if(q.c!=null&&done(q.c))out.push({u,q,ci:q.c})})});return out}
const has=only=>items(only).length>0;
/* どれだけ 出したいか: まちがえて まだ なおっていない ＞ ふくしゅうの 日が 来た ＞ その 時間に まちがいが ある ＞ ほか */
const GAPS=[1,3,7,14,30];
function weight(it,ci){const r=R.q[keyOf(it.u,it.q)],um=(it.u.rec().miss||{})[it.ci]||0;let w=Math.random();
  if(r){if(r.m&&(r.k||0)<2)w+=4;else if(r.due&&Date.now()>=r.due)w+=2;else w-=.5}else w+=1;
  if(um)w+=1.5;if(ci!=null&&it.ci===ci)w+=5;return w}
function choose(only,n,focus){const all=items(only);if(!all.length)return [];
  const sorted=all.map(it=>[weight(it,focus),it]).sort((a,b)=>b[0]-a[0]).map(x=>x[1]),out=[],seen=new Set();
  for(const it of sorted){const k=qText(it.q);if(seen.has(k))continue;seen.add(k);out.push(it);if(out.length>=n)break}
  /* 少なければ くりかえして 埋める（同じ 問題が ならばない ように） */
  while(out.length<Math.min(n,Math.max(5,all.length))){const it=pickL(all);if(out[out.length-1]!==it)out.push(it)}
  return out}
/* 答えの きろく。 first = ヒントなしで 正解 */
function rec(it,ok,first){const k=keyOf(it.u,it.q),r=R.q[k]=R.q[k]||{m:0,k:0,n:0};r.t=Date.now();
  if(first){r.k=(r.k||0)+1;r.n=Math.min((r.n||0)+1,GAPS.length-1);r.due=Date.now()+GAPS[r.n]*DAY;
    const c=R.ch[chKey(it.u,it.ci)]=R.ch[chKey(it.u,it.ci)]||{d:[]};const d=dk();if(!c.d.includes(d)){c.d.push(d);if(c.d.length>6)c.d.shift()}
    const ur=it.u.rec();if(ur.miss&&ur.miss[it.ci]){ur.miss[it.ci]--;if(ur.miss[it.ci]<=0)delete ur.miss[it.ci];try{it.u.save()}catch(e){}}}
  else{if(!ok){r.m++;const ur=it.u.rec();ur.miss=ur.miss||{};ur.miss[it.ci]=(ur.miss[it.ci]||0)+1;try{it.u.save()}catch(e){}}
    r.k=0;r.n=0;r.due=Date.now()+DAY}
  save()}
/* その 時間は 身についた？（11/22 ゆるめた: 前は 「ちがう 日に 2回」だけで、 1回 ノーミスでも ひらかなかった）
   - その 時間の 問題を 3問 ヒントなしで 正解（練習の いちばん 新しい 答え、 または 授業の ✏️たしかめ）して、 まだ なおっていない まちがいが ない
   - または ちがう 日に 2回 ヒントなしで 正解（前の しくみ）
   いまの 記録（R.q）から 数えるので、 前に やった 練習も そのまま 数える */
const LEARN_N=3;
function chState(u,ci){const qs=u.D.CH[ci]?u.D.CH[ci].q.slice():[];(u.D.MIX||[]).forEach(q=>{if(q.c===ci)qs.push(q)});
  let ok=0,bad=0;const seen=new Set();qs.forEach(q=>{const k=keyOf(u,q);if(seen.has(k))return;seen.add(k);const r=R.q[k];if(!r)return;
    if((r.k||0)>=1)ok++;else if(r.m)bad++});
  const need=Math.min(LEARN_N,seen.size||LEARN_N);
  /* 授業の ✏️たしかめ（3問）で 1回で せいかい した 数も 数える（11/22 ユーザー: たしかめで 3問 1回で せいかい したのに 0/3）。
     qk が ない 前の 記録は、 その 時間で まちがえて いなければ 身についた あつかい */
  try{const uc=(u.rec().ch||{})[ci],um=(u.rec().miss||{})[ci]||0;if(uc&&uc.d){const lk=uc.qk!=null?uc.qk:(um?0:need);if(lk>ok){ok=Math.min(lk,need);if(!um)bad=0}}}catch(e){}
  return {ok,bad,need}}
const learned=(u,ci)=>{const c=R.ch[chKey(u,ci)];if(c&&c.d.length>=2)return true;const s=chState(u,ci);return s.ok>=s.need&&!s.bad};

/* ---------- 重ね（授業と 同じ #dpov） ---------- */
let G=null;
function close(){const o=$('dpov');if(o)o.remove();G=null;hush();closeTeach(true)}
function shell(){let o=$('dpov');if(o)o.remove();try{window.DEEP&&DEEP.close()}catch(e){}
  o=document.createElement('div');o.id='dpov';document.body.appendChild(o);
  o.innerHTML=`<section class="pnl dpp mdp prp" role="dialog" aria-label="練習">
    <div class="qtop"><button class="x" id="prx" aria-label="やめる">✕</button><b>${esc(G.title)}</b><span class="qn" id="prn"></span></div>
    <div class="mdbox" id="mdbox"><div id="prq"></div></div></section>`;
  $('prx').onclick=()=>{snd('back');G&&G.i>0&&!G.done?end(true):close()};
  o.onclick=e=>{if(e.target===o){snd('back');G&&G.i>0&&!G.done?end(true):close()}}}
const live=g=>G===g&&$('prq');

/* ---------- はじめる ---------- */
function start(o){o=o||{};const list=choose(o.u,o.n||N,o.ci);if(!list.length)return false;
  const u=o.u&&UNIT.get(o.u);
  let g0=null;try{g0=window.MPLAN&&MPLAN.gate()}catch(e){}
  G={list,i:0,st:{ok:0,hint:0,miss:0},bad:[],again:new Set(),title:u?`⚡ 練習：${u.D.title}`:'⚡ 練習',o,g0};
  shell();const [ex,tx]=ML(o.u?'pr_startU':'pr_start',{u:u?u.D.title:'',n:list.length});
  $('prq').innerHTML=minaBox(ex,tx);snd('lesson');const g=G;setTimeout(()=>{if(live(g))ask()},900);return true}

function ask(){const g=G;if(!live(g))return;const it=g.list[g.i];if(!it)return end();const q=it.q;
  g.tries=0;$('prn').textContent=`${g.i+1}/${g.list.length}`;
  const order=shuffle(q.o.map((x,i)=>i)),[a,b]=q.s?q.s.split('___'):['',''];
  const hd=q.s?`<p class="mdqs">${esc(a)}<u>　？　</u>${esc(b||'')}</p>${q.ja?`<small class="mdja">${esc(q.ja)}</small>`:''}`:`<p class="mdqp">${esc(q.p)}</p>`;
  $('prq').innerHTML=`<div class="mdcard mdqc"><p class="mdqn">${it.u.D.ico} ${esc(it.u.D.CH[it.ci].short||'')}${q.s?'　___ に 入るのは？':''}</p>${hd}<div id="mdhint"></div>
    <div class="mdopts">${order.map(i=>`<button data-o="${i}" class="${isEn(q.o[i])?'en':''}">${esc(q.o[i])}</button>`).join('')}</div>
    <button class="mddunno prteachb" id="prtb">🤔 教えて</button><div id="mdafter"></div></div>`;
  $('prtb').onclick=()=>{hush();teach(q,it.u,it.ci)};
  $('prq').querySelectorAll('[data-o]').forEach(bt=>bt.onclick=()=>{if(bt.disabled||G!==g)return;hush();const k=+bt.dataset.o;
    if(k===0){bt.classList.add('right');$('prq').querySelectorAll('[data-o]').forEach(x=>x.disabled=true);got(it)}
    else{bt.classList.add('wrong');bt.disabled=true;g.tries++;missed(it,k)}})}
const showEl=id=>setTimeout(()=>{const e=$(id);if(e)e.scrollIntoView({block:'nearest',behavior:'smooth'})},60);
function got(it){const g=G,q=it.q,first=!g.tries;snd('correct');
  if(first)g.st.ok++;else g.st.hint++;rec(it,true,first);if(!first)g.bad.push(it);
  const [ex,tx]=ML(first?'pr_ok':'pr_okHint'),f=fullOf(q);
  $('mdafter').innerHTML=`${minaBox(ex,tx)}${f?`<div class="mdens">${enBtn(f,q.ja||'')}</div>`:''}`;bindSay($('mdafter'));showEl('mdafter');
  if(f)talk(f);
  const go=()=>{if(G!==g)return;if($('prteach')){onTeachClose=go;return}g.i++;ask()};
  (H.afterTalk?H.afterTalk(go,500,1500,()=>G===g):setTimeout(go,1700))}
function missed(it,k){const g=G,q=it.q,left=document.querySelectorAll('#prq [data-o]:not(:disabled)').length;
  if(g.tries===1&&left>1){snd('pickup');const [,tx]=ML('pr_hint');
    $('mdhint').innerHTML=`<div class="mdhint">💡 <b>ヒント</b>　${esc(q.h)}<small>${esc(tx.replace(/<[^>]+>/g,''))}</small></div>`;showEl('mdhint');return}
  snd('wrong');g.st.miss++;g.bad.push(it);rec(it,false,false);
  /* 4問 あとに もう一回（1つの 問題は 1回だけ） */
  const kk=qText(q);if(!g.again.has(kk)){g.again.add(kk);g.list.splice(Math.min(g.i+5,g.list.length),0,it)}
  document.querySelectorAll('#prq [data-o]').forEach(x=>{x.disabled=true;if(+x.dataset.o===0)x.classList.add('right')});
  const [ex,tx]=ML('pr_explain'),bad=q.s?q.s.replace('___',q.o[k]):q.o[k],good=q.s?fullOf(q):q.o[0],why=whyOf(q,q.o[k]);
  $('mdhint').innerHTML='';
  $('mdafter').innerHTML=`${minaBox(ex,tx)}<div class="mdexp"><p class="mdfix"><s>${esc(bad)}</s><br>⭕ <b>${esc(good)}</b></p><p>${esc(q.e)}</p>${why?`<p class="prwhy">✗ ${esc(q.o[k])} … ${esc(why)}</p>`:''}</div>
    <div class="mdnav"><button id="mdnx">わかった！ つぎへ ▶</button></div>`;
  $('prtb').textContent='🤔 もっと くわしく 教えて';
  showEl('mdafter');if(isEn(good))talk(good);
  $('mdnx').onclick=()=>{snd('step');hush();g.i++;ask()}}

/* ---------- おわり: よくできた ＋ 結果 1行 ＋ つぎの 1つ ---------- */
function end(quit){const g=G;if(!g||g.done)return;g.done=1;hush();closeTeach(true);
  const N=g.st.ok+g.st.hint+g.st.miss;if(!N){close();return}
  R.n=(R.n||0)+1;R.t=Date.now();save();
  try{const P=MPLAN.rec();if(P.day){P.day.pr=1;localStorage.setItem('hoshi_plan',JSON.stringify(P))}}catch(e){}
  try{RECENT.add('practice',{n:N,miss:g.st.miss})}catch(e){}
  const perfect=!g.st.miss&&!g.st.hint,coin=Math.min(10,Math.ceil((g.st.ok+g.st.hint)/2));
  /* 🔒 だった つぎの 授業が この 練習で ひらいた？ / まだなら あと 何問 */
  let open=null,gw=null;try{const g1=MPLAN.gate();if(g.g0&&!g1)open=g.g0;else if(g1)gw=g1}catch(e){}
  let [ex,tx]=ML(quit?'pr_quit':perfect?'pr_perfect':g.st.miss?'pr_miss':'pr_good',{n:g.st.ok,N});
  if(open)[ex,tx]=ML('pr_unlock',{t:open.c.short});
  else if(gw){const s=chState(gw.u,gw.ci);[ex,tx]=ML(s.bad?'pr_gateBad':'pr_gateLeft',{t:gw.c.short,n:Math.max(1,s.need-s.ok)})}
  const bad=[];g.bad.forEach(it=>{if(!bad.includes(it))bad.push(it)});
  const nx=open?['📘 つぎの 授業へ ▶',()=>MPLAN.today()]:gw?[`🌱 「${esc(gw.c.short)}」を もう少し ▶`,()=>start({u:gw.u.id,ci:gw.ci})]:nextOne();
  $('prn').textContent='';
  $('mdbox').innerHTML=`<div class="kres mdres"><p class="kend good">${open?'🔓 つぎの 授業が ひらいたよ！':perfect?'🌟 よくできた！':quit?'✋ ここまで':'✔ 練習 おわり'}</p>
    <div class="snscore"><span>⭕ 1回で <b>${g.st.ok}</b></span><span>💡 ヒントで <b>${g.st.hint}</b></span><span>📘 解説 <b>${g.st.miss}</b></span></div>
    ${coin?`<p class="kpay sm">🪙 ${coin}まい</p>`:''}${minaBox(ex,tx)}
    ${bad.length?`<p class="mdnote2">🔁 つぎも 出すね（タップで 🤔 教えて）</p><div class="prbad">${bad.slice(0,6).map((it,i)=>`<button data-b="${i}">${esc(fullOf(it.q)||it.q.o[0])}</button>`).join('')}</div>`:''}
    ${nx?`<div class="mdnav"><button id="prnx">${nx[0]}</button></div>`:''}
    <div class="mdnav"><button class="sub" id="pragain">⚡ もう ${N} 問</button><button class="sub" id="prc">✖ とじる</button></div></div>`;
  if(open)try{RECENT.add('unlock',{t:open.c.short})}catch(e){}
  perfect||open?snd('done'):snd('pop');
  if(coin)setTimeout(()=>{try{const b=$('mdbox').getBoundingClientRect();H.coinBurst(b.left+b.width/2,Math.min(b.top+60,innerHeight-60),coin)}catch(e){ST.coins+=coin}},400);
  bindSay($('mdbox'));
  $('mdbox').querySelectorAll('[data-b]').forEach(b=>b.onclick=()=>{const it=bad[+b.dataset.b];snd('book');teach(it.q,it.u,it.ci)});
  const n=$('prnx');if(n)n.onclick=()=>{snd('step');close();nx[1]()};
  $('pragain').onclick=()=>{snd('lesson');start(g.o)};
  $('prc').onclick=()=>{snd('back');close();try{MINA.open()}catch(e){}}}
function nextOne(){try{const T=MPLAN.pickToday();if(T.k==='les')return ['📘 つぎの 授業へ ▶',()=>MPLAN.today()];
    return ['☕ ミナ先生と ひと休み ▶',()=>MPLAN.chatPage()]}catch(e){return null}}

/* ================================================================ 🤔 教えて */
let onTeachClose=null;
const whyOf=(q,o)=>{if(q.w&&q.w[o])return q.w[o];const W=window.TEACH_WHY||{},w=W[qText(q)];return w&&w[o]||''};
function closeTeach(silent){const t=$('prteach');if(t)t.remove();hush();const f=onTeachClose;onTeachClose=null;if(f&&!silent)setTimeout(f,300)}
function layer(title){let t=$('prteach');if(t)t.remove();t=document.createElement('div');t.id='prteach';document.body.appendChild(t);
  t.innerHTML=`<section class="pnl dpp mdp prt" role="dialog" aria-label="教えて"><div class="qtop"><button class="x" id="prtx" aria-label="問題に もどる">←</button><b>${title}</b><span></span></div><div class="mdbox" id="prtbox"></div></section>`;
  $('prtx').onclick=()=>{snd('back');closeTeach()};
  t.onclick=e=>{if(e.target===t){snd('back');closeTeach()}};return $('prtbox')}
/* q = 単元の 問題（o[0] が 正解）、 u = 単元、 ci = 時間 */
function teach(q,u,ci){if(ci==null)ci=q.c;const box=layer('🤔 教えて'),good=q.o[0],f=fullOf(q),c=u&&u.D.CH[ci];
  R.te=(R.te||0)+1;save();try{RECENT.add('teach',{u:u&&u.id,ci,t:c&&c.short})}catch(e){}
  const [ex,tx]=ML(c?'te_open':'te_open0',{t:c?c.short:''});
  const others=q.o.slice(1).map(o=>{const w=whyOf(q,o),bad=q.s?q.s.replace('___',o):o;
    return `<li><s>${esc(q.s?bad:o)}</s><span>${w?esc(w):'これは 使えない 形。 上の ルールと くらべてみてね'}</span></li>`}).join('');
  box.innerHTML=`${minaBox(ex,tx)}
    <div class="mdcard prtc"><p class="prth">⭕ 正しい 答え</p>${f?enBtn(f,q.ja||''):`<p class="prtgood">${esc(good)}</p>`}${q.p?`<small class="mdja">${esc(q.p)}</small>`:''}</div>
    <div class="mdcard prtc"><p class="prth">👀 見る ところ</p><p>${esc(q.h)}</p></div>
    <div class="mdcard prtc"><p class="prth">📘 なぜ 「${esc(good)}」？</p><p>${esc(q.e)}</p></div>
    <div class="mdcard prtc"><p class="prth">🙅 ほかの 答えは なぜ ちがう？</p><ul class="prtno">${others}</ul></div>
    ${c?`<div class="mdnav"><button id="prtles">📘 ${ci+1}時間目「${esc(c.t)}」の 授業を 見る</button></div>`:''}
    <div class="mdnav"><button class="sub" id="prtbk">← 問題に もどる</button>${window.MINAQA?'<button class="sub" id="prtqa">🙋 ほかの 「なんで？」</button>':''}</div>`;
  bindSay(box);box.scrollTop=0;
  const qa=$('prtqa');if(qa)qa.onclick=()=>{snd('talk');qaList()};
  $('prtbk').onclick=()=>{snd('step');closeTeach()};
  const l=$('prtles');if(l)l.onclick=()=>{snd('book');lesson(q,u,ci)}}
/* その 時間の 授業カードを その場で（単元の 「カードを 見る」と 同じ 見た目） */
function lesson(q,u,ci){const c=u.D.CH[ci],box=layer(`📘 ${ci+1}時間目　${esc(c.t)}`),[ex,tx]=ML('te_les',{t:c.short});
  box.innerHTML=`<div class="mdjump">${minaBox(ex,tx)}</div>`+c.cards.map(k=>`<div class="mdcard">${minaBox(k.x||'smile',k.say)}${k.f?`<div class="mdfig">${k.f}</div>`:''}${k.ex?`<div class="mdens">${k.ex.map(e=>enBtn(e[0],e[1])).join('')}</div>`:''}</div>`).join('')+
    `<div class="mdnav"><button class="sub" id="prtback">🤔 説明に もどる</button><button id="prtbk">✏️ 問題に もどる</button></div>`;
  bindSay(box);box.scrollTop=0;
  $('prtback').onclick=()=>{snd('pop');teach(q,u,ci)};
  $('prtbk').onclick=()=>{snd('step');closeTeach()}}

/* 🙋 しつもんコーナーを 教えての 重ねの 中で（問題は うしろで そのまま） */
function qaList(){const box=layer('🙋 ミナ先生に しつもん'),[ex,tx]=ML('qa_list');const Q=MINAQA.all;
  box.innerHTML=minaBox(ex,tx)+`<div class="qalist">${Q.map((x,i)=>`<button data-q="${i}"><i>${x.ico}</i><span>${esc(x.q)}</span></button>`).join('')}</div><div class="mdnav"><button class="sub" id="prtbk">← 問題に もどる</button></div>`;
  box.querySelectorAll('[data-q]').forEach(b=>b.onclick=()=>{snd('talk');qaOne(Q[+b.dataset.q])});$('prtbk').onclick=()=>{snd('step');closeTeach()}}
function qaOne(x){const box=layer('🙋 '+esc(x.q));try{RECENT.add('qa',{t:x.q})}catch(e){}
  box.innerHTML=`<div class="mdcard qaq"><p class="qaqt">🙋 ${esc(x.q)}</p></div>`+x.cards.map(k=>`<div class="mdcard">${minaBox(k.x||'smile',k.say)}${k.f?`<div class="mdfig">${k.f}</div>`:''}${k.ex?`<div class="mdens">${k.ex.map(e=>enBtn(e[0],e[1])).join('')}</div>`:''}</div>`).join('')+
    `<div class="mdnav"><button class="sub" id="prtqa">🙋 ほかの 質問</button><button id="prtbk">✏️ 問題に もどる</button></div>`;
  bindSay(box);box.scrollTop=0;$('prtqa').onclick=()=>{snd('pop');qaList()};$('prtbk').onclick=()=>{snd('step');closeTeach()}}
window.PRAC={start,has,teach,closeTeach,learned,chState,items,rec:()=>R,onClose:f=>{onTeachClose=f},_close:close};

/* ---------- セリフ ---------- */
Object.assign(MINA_LINES,{
 pr_start:[['smile','練習 {n}問 いくよ。 まちがえた ところが 多めに 出るからね'],['happy','さあ、 手に なじませよう！ わからなかったら いつでも 🤔 を おしてね'],['think','習った ことを 思い出す 練習だよ。 ゆっくりで いいからね']],
 pr_startU:[['smile','「{u}」だけで {n}問 いくよ'],['happy','「{u}」を かためよう！ わからない ときは 🤔 教えて']],
 pr_ok:[['happy','せいかい！'],['love','そう！ ばっちり'],['proud','いいね、 手が 覚えてきた'],['smile','うん、 それ！']],
 pr_okHint:[['smile','せいかい！ ヒントで 気づけたね'],['happy','そう、 それ！ 見る ところ、 つかめてきたね']],
 pr_hint:[['think','おしい。 ヒントを 見て もう一回'],['smile','あと ちょっと！']],
 pr_explain:[['smile','ここは こう なるの。 わからなかったら 🤔 で くわしく 話すね'],['think','だいじょうぶ、 この 形は あとで また 出すよ']],
 pr_perfect:[['proud','ぜんぶ 1回で せいかい！ もう 身に ついてきてるね'],['love','すごい、 ノーミス！ わたしも うれしい']],
 pr_good:[['happy','よく できました！ ヒントで 気づけたのも ちゃんと 力に なってるよ'],['smile','おつかれさま。 どんどん 手に なじんでるね']],
 pr_miss:[['smile','おつかれさま！ まちがえた 形は つぎの 練習で また 出すね。 そこが のびしろ だよ'],['love','まちがえた ところが わかったのが いちばんの 収穫。 🤔 で 見なおしても いいよ']],
 pr_unlock:[['proud','「{t}」、 もう 身に ついたね！ つぎの 授業が ひらいたよ'],['love','やったね！ 「{t}」は もう だいじょうぶ。 つぎの 授業へ 行こう']],
 pr_gateLeft:[['smile','いい 調子！ 「{t}」を あと {n}問 1回で せいかい したら、 つぎの 授業が ひらくよ'],['happy','もう ちょっと！ 「{t}」を あと {n}問 ヒントなしで 答えられたら つぎへ 進もう']],
 pr_gateBad:[['smile','おつかれさま！ 「{t}」で まちがえた 問題を 1回で 答えられたら、 つぎの 授業が ひらくよ'],['love','まちがえた 形を もう一回 やろう。 そこが できたら つぎの 授業へ 進めるよ']],
 pr_quit:[['smile','ここまでで OK！ やった ぶんは ちゃんと 記録したよ'],['love','とちゅうでも だいじょうぶ。 また やろうね']],
 te_open:[['smile','「{t}」の ところだね。 いっしょに 1つずつ 見よう'],['think','どこで まよったか、 ゆっくり 見ていこう。 「{t}」の 話だよ'],['love','聞いてくれて うれしい！ 「{t}」、 ていねいに 話すね']],
 te_les:[['smile','「{t}」の 授業の カードだよ。 見おわったら 問題に もどろう'],['happy','授業を ちょっと 見かえそう。 下の ボタンで 問題に もどれるよ']]
});
/* ホームの ひとこと（game/mina-react.js）: さっき 練習した・🤔 で 聞いた */
window.MINA_REACT_EXT=window.MINA_REACT_EXT||{};
MINA_REACT_EXT.practice={act:e=>[e.miss?'r_prMiss':'r_prOk',{n:e.n||0},null],desc:e=>`練習を ${e.n||0}問 した`};
MINA_REACT_EXT.unlock={act:e=>['r_unlock',{t:e.t||''},null],desc:e=>`練習で 「${e.t||''}」が 身について つぎの 授業が ひらいた`};
MINA_REACT_EXT.teach={act:e=>['r_teach',{t:e.t||''},null],desc:e=>`「${e.t||''}」を 🤔 教えて で 聞いた`};
Object.assign(MINA_LINES,{
 r_prOk:[['proud','さっきの 練習、 いい 調子だったね'],['happy','練習 おつかれさま。 手が 覚えてきてるよ']],
 r_prMiss:[['smile','さっきの 練習で まちがえた 形、 つぎも 出すから 安心してね'],['love','まちがえても いいの。 練習は そのための 場所だよ']],
 r_unlock:[['proud','「{t}」、 練習で ちゃんと 身に ついたね。 つぎの 授業、 いっしょに やろう'],['love','つぎの 授業が ひらいたね！ 「{t}」が できたから、 きっと 楽に わかるよ']],
 r_teach:[['love','さっき 「{t}」を 聞いてくれたね。 わからない ことを 聞けるのが いちばん えらいよ'],['smile','「{t}」、 すっきり した？ また いつでも 🤔 を おしてね']]
});
})();
