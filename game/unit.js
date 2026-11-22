/* 📘 ミナ先生の 「単元」（UNIT）。 助動詞の 特別授業（PR#207）の 形を どの 文法でも つかえるように した しくみ
   - 単元 = いくつかの 「時間」。 1時間 = カード（1まい 1ポイント）→ たしかめ 3問。 さいごに まとめテスト 8問・📄まとめ 1まい
   - 問題は 苦手とっくんと 同じ: 1回目の まちがいで ヒント → 2回目で 解説。 ひとめぐり するまで 同じ 問題は 出ない
   - UNIT.make(D,opt) で 1つの 単元を 作る。 D = {id,title,ico,gid,CH,MIX}（CH[i] = {ico,t,short,g?,lv?,cards,q,sum?}）
   - opt.key = localStorage の キー、 opt.lk = セリフの 頭（md_ など。 なければ u_ の ふつうの セリフ）
   - ミナ先生が えらんで はじめる ときは U.go({ci,warm,then,label})（game/mina-plan.js）。 then は その 時間が おわった あとの ボタン
   - まちがいは 苦手とっくん（SENSEI.gram）と 4ステップの 道（STUDY）にも のこす
   ふつうの セリフ（u_）は game/unit-lines.js。 中身は game/unit-*.js と game/modal-data.js */
(()=>{
const {S:ST,sfx:SFX}=BEACH;
const H=HE,esc=H.esc,$=id=>document.getElementById(id);
const snd=k=>{try{SFX[k]&&SFX[k]()}catch(e){}};
const talk=en=>{try{window.SENSEI&&SENSEI.talk(en)}catch(e){}},hush=()=>{try{speechSynthesis.cancel()}catch(e){}};
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.random()*(i+1)|0;[a[i],a[j]]=[a[j],a[i]]}return a};
const isEn=t=>/^[A-Za-z]/.test(String(t||''));
const face=(ex,tx)=>{try{return MINA.face('m',ex,MINA.poseFor?MINA.poseFor(ex,tx||''):undefined)}catch(e){return ''}};
const LIST=[];

function make(D,opt){opt=opt||{};
const CH=D.CH,GID=D.gid,KEY=opt.key||('hoshi_unit_'+D.id),LK=opt.lk||'u_';
const R=(()=>{try{const s=JSON.parse(localStorage.getItem(KEY)||'null');if(s&&typeof s==='object')return s}catch(e){}return {}})();
R.ch=R.ch||{};R.qs=R.qs||[];R.miss=R.miss||{};
/* 「まず ちょっと 聞かせて」で とばした（sk）だけの 時間は やっていない あつかいに もどす（11/22 ユーザー: やっていないのに ✔） */
Object.keys(R.ch).forEach(k=>{const c=R.ch[k];if(c&&c.sk&&!c.c)delete R.ch[k]});
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(R))}catch(e){}};
/* セリフ: md_ などの その 単元だけの セリフが あれば それ、 なければ ふつうの u_ */
const ML=(k,v)=>{v=Object.assign({u:D.title,N:CH.length},v||{});
  try{const own=LK+k;if(LK!=='u_'&&MINA_LINES[own])return MINA.line(own,v);return MINA.line('u_'+k,v)}catch(e){return ['smile','']}};
const chDone=i=>!!(R.ch[i]&&R.ch[i].d);
/* はじめの 「ちょっと 聞かせて」で 正解して とばした 時間（まだ 授業は うけていない）。 ✔ とは 分けて 見せる（11/22 ユーザー） */
const chSkip=i=>!!(R.ch[i]&&R.ch[i].sk&&!R.ch[i].c);
const doneN=()=>CH.filter((c,i)=>chDone(i)).length;
const nextCh=()=>{const i=CH.findIndex((c,i)=>!chDone(i));return i<0?null:i};
const gidOf=ci=>(CH[ci]&&CH[ci].g)||GID;
const gram=(ci,n)=>{try{window.SENSEI&&SENSEI.gram(gidOf(ci),n)}catch(e){}};
const missOf=()=>Object.values(R.miss).reduce((a,b)=>a+b,0);
/* 4ステップの 道（game/study.js）にも のこす */
function study(step,ids){try{if(!window.STUDY)return;const SD=STUDY.rec();SD.p=SD.p||{};
  (ids||[GID]).forEach(g=>{if(!g)return;const r=SD.p[g]=SD.p[g]||{};r[step]=1});localStorage.setItem('hoshi_study',JSON.stringify(SD))}catch(e){}}
const allG=()=>[...new Set([GID].concat(CH.map(c=>c.g)).filter(Boolean))];

/* ---------- 重ね（とことん授業と 同じ #dpov。 外を タップで とじる） ---------- */
let C=null,P=null;   // P = ミナ先生が えらんで はじめた とき の 予定（きょうの授業・勉強 など）
function close(){const o=$('dpov');if(o)o.remove();C=null;P=null;hush()}
const live=()=>C&&$('mdbox');
const head=()=>P&&P.label?P.label:opt.head?opt.head:`${D.ico} ${esc(D.title)}`;
function shell(title,back){let o=$('dpov');if(o)o.remove();try{window.DEEP&&DEEP.close()}catch(e){}
  o=document.createElement('div');o.id='dpov';document.body.appendChild(o);
  o.innerHTML=`<section class="pnl dpp mdp" role="dialog" aria-label="${esc(D.title)}">
    <div class="qtop"><button class="x" id="mdx" aria-label="${back?'もどる':'とじる'}">${back?'←':'✕'}</button><b>${head()}</b><span class="qn" id="mdn"></span></div>
    ${title?`<p class="mdt">${title}</p>`:''}
    <div class="mdbox" id="mdbox"></div>
  </section>`;
  $('mdx').onclick=()=>{snd('back');hush();back?back():close()};
  o.onclick=e=>{if(e.target===o){snd('back');close()}};
  return $('mdbox')}
const minaBox=(ex,tx)=>`<div class="mdsay"><span class="lface">${face(ex,tx)}</span><p>${tx}</p></div>`;
const enBtn=(en,ja)=>`<button class="mden" data-say="${esc(en)}"><span>🔊 ${esc(en)}</span>${ja?`<small>${esc(ja)}</small>`:''}</button>`;
const bindSay=el=>el.querySelectorAll('[data-say]').forEach(b=>b.onclick=e=>{e.stopPropagation();snd('pop');talk(b.dataset.say)});
const chT=ci=>`${CH[ci].ico} ${ci+1}時間目　${esc(CH[ci].t)}`;

/* ---------- メニュー: 時間の 一覧 と まとめテスト（数は 出さない） ---------- */
function open(o){o=o||{};P=null;C={m:'menu'};R.n=(R.n||0)+1;R.t=Date.now();save();
  if(o.ch!=null)return chapter(o.ch,0);
  menu(R.n<=1?'hello':null)}
function menu(key){C={m:'menu'};P=null;hush();const box=shell('',null),nx=nextCh(),all=nx==null,G0=(()=>{try{return window.MPLAN&&MPLAN.gate?MPLAN.gate():null}catch(e){return null}})(),ld=lastDone(),lk=i=>!!G0&&!chDone(i)&&i>ld;
  const skN=CH.filter((c,i)=>chSkip(i)).length,k=key||(R.best>=3?'master':all?'allDone':skN?'skipped':'again'),[ex,tx]=ML(k,{k:skN});
  /* ▶ つづきから は 見出しの すぐ下に 大きく（11/22 ユーザー「上のほうに」） */
  box.innerHTML=`${nx!=null?`<button id="mdstart" class="mdgo">${nx?'▶ つづきから（'+(nx+1)+'時間目）':'▶ はじめる'}<small>${esc(CH[nx].t)}</small></button>`:''}
    ${minaBox(ex,tx)}
    ${doneN()?'<div class="mdrs"><button id="mdreset" class="sub">🔄 さいしょから やりなおす</button></div>':''}
    <div class="mdchs">${CH.map((c,i)=>`<button data-ch="${i}" class="${chSkip(i)?'skip':chDone(i)?'done':''}${i===nx?' now':''}${lk(i)?' lock':''}"><i>${chSkip(i)?'⏭':chDone(i)?'✔':lk(i)?'🔒':c.ico}</i><span><small>${i+1}時間目${chSkip(i)?'<em class="mdskip">とばした</em>':''}</small>${esc(c.t)}</span></button>`).join('')}</div>
    ${skN?'<p class="mdskipn">「とばした」は さいしょの 1問に 正解した 時間。 タップすれば いつでも 授業が うけられるよ</p>':''}
    <div class="mdgo2">${opt.extra?`<button id="mdex" class="sub">${opt.extra[0]}</button>`:''}<button id="mdsum" class="sub">📄 まとめ 1まいで 見る</button>
      <button id="mdtest" class="${all?'':'sub'}">📝 まとめテスト ${R.best?stars(R.best):''}</button></div>`;
  box.querySelectorAll('[data-ch]').forEach(b=>b.onclick=()=>{snd('step');chapter(+b.dataset.ch,0)});
  const s=$('mdstart');if(s)s.onclick=()=>{snd('lesson');chapter(nx,0)};
  $('mdtest').onclick=()=>{snd('step');test()};
  $('mdsum').onclick=()=>{snd('book');sheet(menu)};
  /* 🔄 さいしょから: ✔ も とばした も けして 1時間目から（11/22 ユーザー）。 2回 おして たしかめる */
  const rs=$('mdreset');if(rs)rs.onclick=()=>{if(!rs.dataset.ok){snd('pop');rs.dataset.ok=1;rs.textContent='もう一度 おすと ✔を けして 1時間目から';return}
    snd('lesson');R.ch={};R.miss={};R.qs=[];delete R.best;delete R.tn;R.pr=1;save();
    try{RECENT.add('unitReset',{id:D.id})}catch(e){}
    fresh=1;chapter(0,0,ML('reset'));fresh=0};
  const xb=$('mdex');if(xb)xb.onclick=()=>{snd('lesson');close();opt.extra[1]()}}
const back=()=>P?close():menu();

/* ---------- 1時間の カード ---------- */
/* 一度に 増やさない（game/mina-plan.js gate）: いちばん 新しく おわった 時間が 練習で 身につくまで、 まだの 時間は 🔒 */
/* 🔒は 「まだ 先の 時間」だけ: この 単元で いちばん うしろの おわった 時間より 前の 時間（飛ばした 時間）は しめない（11/21 ユーザー） */
const lastDone=()=>{let m=-1;CH.forEach((c,i)=>{if(chDone(i)&&!chSkip(i))m=i});return m};
let fresh=0;   // 🔄 さいしょから の 直後の 1時間目は 🔒に しない
const lockOf=ci=>{if(fresh&&ci===0)return null;if(chDone(ci)||ci<lastDone()||!window.MPLAN||!MPLAN.gate)return null;try{return MPLAN.gate()}catch(e){return null}};
function locked(G,ci){C={m:'lock'};hush();const box=shell(chT(ci),P?null:menu),[ex,tx]=MINA.line('mp_gateLes',{t:G.c.short});$('mdn').textContent='🔒';
  let st=null;try{st=PRAC.chState(G.u,G.ci)}catch(e){}
  /* どこまで できたか（行き止まりに しない: あと 何問 ＋ 練習ボタン） */
  const meter=st?`<div class="mdcard mdlkm"><p class="prth">🌱 「${esc(G.c.short)}」の 練習</p><p class="mdlkdots">${Array.from({length:st.need},(x,i)=>i<st.ok?'⭕':'⚪').join(' ')}</p><p>${st.ok>=st.need&&st.bad?`まちがえた 問題が ${st.bad}問 のこってるよ。 練習で 1回で 答えられたら ひらくよ`:`1回で せいかいした 問題 <b>${Math.min(st.ok,st.need)}</b> / ${st.need}　あと <b>${Math.max(0,st.need-st.ok)}問</b> で ひらくよ`}</p></div>`:'';
  box.innerHTML=`${minaBox(ex,tx)}${meter}<div class="mdnav"><button id="mdlk">🌱 「${esc(G.c.short)}」を 練習する ▶</button></div><div class="mdnav"><button class="sub" id="mdlkb">☰ 時間の 一覧</button></div>`;
  $('mdlk').onclick=()=>{snd('lesson');close();PRAC.start({u:G.u.id,ci:G.ci})};$('mdlkb').onclick=()=>{snd('pop');menu()}}
function chapter(ci,i,pre){const c=CH[ci];if(!c)return menu();if(!i){const G=lockOf(ci);if(G)return locked(G,ci)}C={m:'card',ci,i};hush();
  const box=shell(chT(ci),P?null:menu),k=c.cards[i],N=c.cards.length;
  box.innerHTML=`${pre&&!i?`<div class="mdjump">${minaBox(pre[0],pre[1])}</div>`:''}<div class="mdcard">
      ${minaBox(k.x||'smile',k.say)}
      ${k.f?`<div class="mdfig">${k.f}</div>`:''}
      ${k.ex?`<div class="mdens">${k.ex.map(e=>enBtn(e[0],e[1])).join('')}</div>`:''}
    </div>
    <div class="mddots">${c.cards.map((x,j)=>`<i class="${j===i?'on':j<i?'past':''}"></i>`).join('')}<i class="q">✏️</i></div>
    <div class="mdnav"><button id="mdprev" class="sub" ${i?'':'disabled'}>◀ もどる</button><button id="mdnext">${i<N-1?'つぎへ ▶':'✏️ たしかめ 3問'}</button></div>`;
  if(k.jpc)try{UNIT.jpSeen(k.jk)}catch(e){}
  bindSay(box);if(k.ex&&k.ex[0])setTimeout(()=>{if(live()&&C.m==='card'&&C.ci===ci&&C.i===i)talk(k.ex[0][0])},500);
  $('mdprev').onclick=()=>{snd('back');chapter(ci,i-1)};
  $('mdnext').onclick=()=>{snd('step');i<N-1?chapter(ci,i+1):chQuiz(ci)}}

/* ---------- 問題を えらぶ（ひとめぐり するまで 同じ ものは 出さない） ---------- */
D.MIX=D.MIX||[];D.MIX.forEach(q=>q.mix=1);CH.forEach((c,ci)=>c.q.forEach(q=>q.c=ci));
const keyOf=q=>q.mix?'x'+D.MIX.indexOf(q):'c'+q.c+'_'+CH[q.c].q.indexOf(q);
function pick(pool,n){const seen=new Set(R.qs),fresh=shuffle(pool.filter(q=>!seen.has(keyOf(q)))),old=shuffle(pool.filter(q=>seen.has(keyOf(q))));
  const take=fresh.slice(0,n);if(take.length<n){take.push(...old.slice(0,n-take.length));const ks=new Set(pool.map(keyOf));R.qs=R.qs.filter(k=>!ks.has(k))}
  take.forEach(q=>R.qs.push(keyOf(q)));save();return take}
function chQuiz(ci){const qs=pick(CH[ci].q,3);run(qs,{ci,title:`${CH[ci].ico} ${ci+1}時間目　たしかめ`,start:'qStart',end:(st,bad)=>chEnd(ci,st,bad)})}
function test(){const all=CH.flatMap(c=>c.q).concat(D.MIX);
  let qs=[];CH.forEach((c,ci)=>{if(qs.length<8)qs.push(...pick(all.filter(q=>q.c===ci&&!qs.includes(q)),1))});
  qs.push(...pick(all.filter(q=>!qs.includes(q)),Math.max(0,8-qs.length)));
  run(shuffle(qs),{test:1,title:'📝 まとめテスト',start:doneN()?'testStart':'testStartNew',end:testEnd})}

/* ---------- 問題を 1つずつ ---------- */
function run(qs,o){C={m:'q',qs,o,i:0,st:{ok:0,hint:0,miss:0},bad:[]};const T=C;
  const box=shell(o.title,P?null:menu),[ex,tx]=o.say||ML(o.start,{n:qs.length});
  box.innerHTML=`${minaBox(ex,tx)}<div id="mdq"></div>`;
  setTimeout(()=>{if(C===T)ask()},600)}
function ask(){const T=C;if(!live()||T.m!=='q')return;const q=T.qs[T.i];if(!q)return T.o.end(T.st,T.bad);
  T.tries=0;$('mdn').textContent=`✏️ ${T.i+1}/${T.qs.length}`;
  const order=shuffle(q.o.map((x,i)=>i)),[a,b]=q.s?q.s.split('___'):['',''];
  const hd=q.s?`<p class="mdqs">${esc(a)}<u>　？　</u>${esc(b||'')}</p>${q.ja?`<small class="mdja">${esc(q.ja)}</small>`:''}`:`<p class="mdqp">${esc(q.p)}</p>`;
  const el=$('mdq');el.innerHTML=`<div class="mdcard mdqc"><p class="mdqn">Q${T.i+1}.${q.s?' ___ に 入るのは？':''}</p>${hd}<div id="mdhint"></div>
    <div class="mdopts">${order.map(i=>`<button data-o="${i}" class="${isEn(q.o[i])?'en':''}">${esc(q.o[i])}</button>`).join('')}</div>
    ${q.c!=null?(T.o.probe||!window.PRAC?`<button class="mddunno" id="mddunno">🤔 わからない → ${T.o.probe?'授業へ':'カードを 見る'}</button>`:`<button class="mddunno" id="mdteach">🤔 教えて</button>`):''}<div id="mdafter"></div></div>`;
  const dn=$('mddunno');if(dn)dn.onclick=()=>{if(C!==T||dn.disabled)return;hush();dunno(q)};
  /* 🤔 教えて（game/practice.js）: 答える 前でも あとでも。 問題は うしろで そのまま */
  const tb=$('mdteach');if(tb)tb.onclick=()=>{if(C!==T)return;hush();PRAC.teach(q,U,q.c)};
  el.querySelectorAll('[data-o]').forEach(bt=>bt.onclick=()=>{if(bt.disabled||C!==T)return;hush();const k=+bt.dataset.o;
    if(k===0){bt.classList.add('right');el.querySelectorAll('[data-o],#mddunno').forEach(x=>x.disabled=true);got(q)}
    else{bt.classList.add('wrong');bt.disabled=true;T.tries++;missed(q,k)}})}
const show=id=>setTimeout(()=>{const e=$(id);if(e)e.scrollIntoView({block:'nearest',behavior:'smooth'})},60);
const fullOf=q=>q.s?q.s.replace('___',q.o[0]):isEn(q.o[0])?q.o[0]:'';
function got(q){const T=C,first=!T.tries;snd('correct');
  if(first)T.st.ok++;else{T.st.hint++;T.bad2=(T.bad2||[]).concat([q])}gram(q.c,first?2:1);
  const [ex,tx]=ML(first?'ok':'okHint'),f=fullOf(q);
  $('mdafter').innerHTML=`${minaBox(ex,tx)}${f?`<div class="mdens">${enBtn(f,q.ja||q.p||'')}</div>`:''}`;bindSay($('mdafter'));show('mdafter');
  if(f)talk(f);
  const go=()=>{if(C!==T)return;if($('prteach')&&window.PRAC){PRAC.onClose(go);return}T.i++;ask()};
  (H.afterTalk?H.afterTalk(go,500,1300,()=>C===T):setTimeout(go,1600))}
function missed(q,k){const T=C,left=document.querySelectorAll('#mdq [data-o]:not(:disabled)').length;
  if(T.tries===1&&left>1){snd('pickup');const [ex,tx]=ML('hint');
    $('mdhint').innerHTML=`<div class="mdhint">💡 <b>ヒント</b>　${esc(q.h)}<small>${esc(tx.replace(/<[^>]+>/g,''))}</small></div>`;show('mdhint');return}
  snd('wrong');T.st.miss++;T.bad.push(q);gram(q.c,0);if(!T.o.check&&q.c!=null){R.miss[q.c]=(R.miss[q.c]||0)+1;save()}
  const dn=$('mddunno');if(dn)dn.remove();
  document.querySelectorAll('#mdq [data-o]').forEach(x=>{x.disabled=true;if(+x.dataset.o===0)x.classList.add('right')});
  const [ex,tx]=ML('explain'),bad=q.s?q.s.replace('___',q.o[k]):q.o[k],good=q.s?fullOf(q):q.o[0];
  $('mdhint').innerHTML='';
  $('mdafter').innerHTML=`${minaBox(ex,tx)}<div class="mdexp"><p class="mdfix"><s>${esc(bad)}</s><br>⭕ <b>${esc(good)}</b></p><p>${esc(q.e)}</p></div>
    <div class="mdnav">${q.c!=null&&!T.o.check?`<button class="sub" id="mdsee">📖 カードを 見る</button>`:''}<button id="mdnx">わかった！ つぎへ ▶</button></div>`;
  show('mdafter');if(isEn(good))talk(good);
  $('mdnx').onclick=()=>{snd('step');hush();T.i++;ask()};
  const see=$('mdsee');if(see)see.onclick=()=>{snd('book');peek(q.c,()=>{C=T;const box=shell(T.o.title,P?null:menu);box.innerHTML='<div id="mdq"></div>';T.i++;ask()})}}
/* 🤔 わからない: 答え合わせは しないで、 その 時間の 授業へ（さいしょの 「聞かせて」）／ カードを 見て つぎの 問題へ（ほかの 問題） */
function dunno(q){const T=C;snd('book');
  if(T.o.probe)return T.o.jump(q,T);
  T.st.miss++;T.bad.push(q);gram(q.c,0);if(!T.o.check){R.miss[q.c]=(R.miss[q.c]||0)+1;save()}
  try{RECENT.add('unitDunno',{id:D.id,ci:q.c,t:CH[q.c].short})}catch(e){}
  peek(q.c,()=>{C=T;const box=shell(T.o.title,P?null:menu);box.innerHTML='<div id="mdq"></div>';T.i++;ask()},ML('dunnoPeek',{t:CH[q.c].short}))}
function peek(ci,bk,pre){const c=CH[ci];C={m:'peek'};hush();const box=shell(chT(ci),bk);$('mdn').textContent='';
  box.innerHTML=(pre?`<div class="mdjump">${minaBox(pre[0],pre[1])}</div>`:'')+c.cards.map(k=>`<div class="mdcard">${minaBox(k.x||'smile',k.say)}${k.f?`<div class="mdfig">${k.f}</div>`:''}${k.ex?`<div class="mdens">${k.ex.map(e=>enBtn(e[0],e[1])).join('')}</div>`:''}</div>`).join('')+
    `<div class="mdnav"><button id="mdbk">✏️ 問題に もどる ▶</button></div>`;
  bindSay(box);$('mdbk').onclick=()=>{snd('step');bk()}}

/* ---------- 📄 まとめ 1まい ---------- */
function sheet(bk){C={m:'sheet'};hush();const box=shell('📄 まとめ 1まい',bk||menu),[ex,tx]=ML('sheet');$('mdn').textContent='';
  box.innerHTML=`${minaBox(ex,tx)}<div class="mdsheet">${CH.map((c,i)=>c.sum?`<div class="mdsec">
      <button class="mdsh" data-ch="${i}"><i>${c.ico}</i><span><small>${i+1}時間目</small>${esc(c.t)}</span><em>授業 ▶</em></button>
      <p class="mdpt">${c.sum.pt}</p><div class="mdfig">${c.sum.f}</div>${c.sum.memo?`<p class="mdmemo">💡 ${c.sum.memo}</p>`:''}${c.jp?`<p class="mdmemo mdjpm">🇯🇵 ${c.jp.d}</p>`:''}</div>`:'').join('')}</div>
    <div class="mdnav"><button id="mdst">📝 まとめテスト</button></div>`;
  box.querySelectorAll('[data-ch]').forEach(b=>b.onclick=()=>{snd('step');P=null;chapter(+b.dataset.ch,0)});
  $('mdst').onclick=()=>{snd('step');P=null;test()};
  try{R.sh=(R.sh||0)+1;save()}catch(e){}}

/* ---------- おわり ---------- */
const stars=n=>`<span class="mdstar">${'★'.repeat(n)}<i>${'★'.repeat(3-n)}</i></span>`;
function score(st){return `<div class="snscore"><span>⭕ 1回で <b>${st.ok}</b></span><span>💡 ヒントで <b>${st.hint}</b></span><span>📘 解説 <b>${st.miss}</b></span></div>`}
function pay(n){setTimeout(()=>{try{const b=$('mdbox').getBoundingClientRect();H.coinBurst(b.left+b.width/2,Math.min(b.top+60,innerHeight-60),n)}catch(e){ST.coins+=n}},400)}
function chEnd(ci,st,bad){const c=CH[ci],first=!chDone(ci);R.ch[ci]=R.ch[ci]||{};R.ch[ci].d=1;R.ch[ci].qk=Math.max(R.ch[ci].qk||0,st.ok);/* たしかめで 1回で せいかい した 数（身についた に 数える、practice.js chState） */R.ch[ci].c=(R.ch[ci].c||0)+1;R.ch[ci].t=Date.now();save();
  study('l',[gidOf(ci)]);
  try{RECENT.add('unit',{id:D.id,ci,t:c.short,miss:st.miss})}catch(e){}
  const coin=first?5:2,[ex,tx]=ML(st.miss?'chMiss':'chDone',{t:c.short}),nx=nextCh(),nxt=ci+1<CH.length?ci+1:nx,Pl=P;
  C={m:'end'};$('mdn').textContent='✔';
  const then=Pl&&Pl.then?Pl.then(st):null,stop=!!(Pl&&Pl.stop),
    /* 11/22: おまけの ミニ授業は やめて、 ミナ先生が ふきだしで コツを ひとこと（game/mina-kotsu.js） */
    tip=Pl&&Pl.tip?(()=>{try{return Pl.tip(st)||''}catch(e){return ''}})():'',
    /* スタンプ・なかよし（game/motivate.js）。 前は ミニ授業だけ だった */
    stp=window.MOTI&&MOTI.unitDone?MOTI.unitDone(D.id+':'+ci,st):'';
  $('mdbox').innerHTML=`<div class="kres mdres"><p class="kend good">${st.miss?'✔':'🌟 よくできた！'} ${ci+1}時間目 おわり</p>${score(st)}
    <p class="kpay sm">🪙 ${coin}まい${stp?`　<small class="mdstp">${stp}</small>`:''}</p>${minaBox(ex,tx+(tip?`<span class="mdkotsu">💡 ${tip}</span>`:''))}
    ${then?`<div class="mdnav"><button id="mdthen">${then[0]}</button></div>`:''}
    <div class="mdnav">${st.miss?`<button class="sub" id="mdre">🔁 カードを もう一回</button>`:''}${then||stop?'':nxt!=null?`<button id="mdnc">▶ ${nxt+1}時間目へ</button>`:`<button id="mdt">📝 まとめテストへ</button>`}</div>
    ${then||stop?`<div class="mdnav"><button class="sub" id="mdc">✖ きょうは ここまで</button></div>`:`<div class="mdnav"><button class="sub" id="mdm">☰ 時間の 一覧</button></div>`}</div>`;
  snd('done');pay(coin);
  if(Pl&&Pl.done)try{Pl.done(st)}catch(e){console.error(e)}
  const re=$('mdre');if(re)re.onclick=()=>{snd('step');P=Pl;chapter(ci,0)};
  const nc=$('mdnc');if(nc)nc.onclick=()=>{snd('lesson');chapter(nxt,0)};
  const t=$('mdt');if(t)t.onclick=()=>{snd('step');test()};
  const th=$('mdthen');if(th)th.onclick=()=>{snd('step');close();then[1]()};
  const cl=$('mdc');if(cl)cl.onclick=()=>{snd('back');close();try{MINA.open()}catch(e){}};
  const m=$('mdm');if(m)m.onclick=()=>{snd('pop');menu()}}
function testEnd(st,bad){const N=st.ok+st.hint+st.miss,perfect=st.ok===N,s=perfect?3:st.miss<=1?2:1,first=!R.tn,new3=s===3&&(R.best||0)<3,Pl=P;
  R.tn=(R.tn||0)+1;R.best=Math.max(R.best||0,s);R.last=s;save();study('t',allG());
  try{const tk=SENSEI.rec();tk.tk=tk.tk||{};allG().forEach(g=>tk.tk[g]=1)}catch(e){}
  const coin=(first?15:6)+(perfect?5:0)+(new3?5:0),[ex,tx]=ML(perfect?'perfect':s===2?'good':'miss',{n:st.ok+st.hint,N});
  const weak=[...new Set(bad.filter(q=>q.c!=null).map(q=>q.c))].sort();
  C={m:'end'};$('mdn').textContent='';
  const then=Pl&&Pl.then?Pl.then(st):null;
  $('mdbox').innerHTML=`<div class="kres mdres"><p class="kend good">${perfect?'🌟 よくできた！':'📝'} まとめテスト おわり</p>
    <p class="dpstar">${stars(s)}<small>わかった度</small></p>${score(st)}
    <p class="kpay sm">🪙 ${coin}まい</p>
    ${minaBox(ex,tx)}
    ${then?`<div class="mdnav"><button id="mdthen">${then[0]}</button></div>`:''}
    ${weak.length?`<p class="mdnote2">📘 見なおすと いい ところ</p><div class="mdchs">${weak.map(i=>`<button data-ch="${i}"><i>${CH[i].ico}</i><span><small>${i+1}時間目</small>${esc(CH[i].t)}</span></button>`).join('')}</div>`:''}
    <div class="mdnav"><button id="mdag" class="sub">🔁 もう一回 テスト</button><button class="sub" id="mds2">📄 まとめ</button><button class="sub" id="mdc">✖ とじる</button></div></div>`;
  new3||perfect?snd('done'):snd('pop');pay(coin);
  if(Pl&&Pl.done)try{Pl.done(st,1)}catch(e){console.error(e)}
  $('mdbox').querySelectorAll('[data-ch]').forEach(b=>b.onclick=()=>{snd('step');P=null;chapter(+b.dataset.ch,0)});
  $('mdag').onclick=()=>{snd('step');P=null;test()};
  const th=$('mdthen');if(th)th.onclick=()=>{snd('step');close();then[1]()};
  $('mds2').onclick=()=>{snd('book');P=null;sheet(menu)};
  $('mdc').onclick=()=>{snd('back');close()}}

/* ---------- ミナ先生が えらんで はじめる（game/mina-plan.js） ---------- */
/* p = {ci: 時間（なければ つぎ）, warm: さいしょの ちょっと ふくしゅう（問題の 配列）, label, then(st)→[ボタン, fn], done(st,isTest), stop: おわりは 「きょうは ここまで」だけ, tip(st)→ミナ先生の ひとこと コツ（html）} */
function go(p){p=p||{};P=p;R.n=(R.n||0)+1;R.t=Date.now();save();
  const ci=p.ci!=null?p.ci:nextCh();
  if(p.test||ci==null){return run0(()=>test())}
  run0(()=>chapter(ci,0));
  function run0(f){if(p.warm&&p.warm.length){const W=p.warm;
      run(W,{title:'🔁 ちょっと ふくしゅう',say:ML('warm',{n:W.length}),check:1,end:()=>{P=p;f()}})}
    else f()}}
/* 1問だけ ちょっと 聞いて、 わかっている 時間を とばす（はじめての 単元） */
function probe(p){P=p;const qs=CH.map((c,ci)=>{const q=shuffle(c.q)[0];return q}).filter(Boolean);
  run(qs,{title:'🧭 まず ちょっと 聞かせて',say:ML('probe',{n:qs.length}),check:1,probe:1,
  /* 🤔 わからない: それまでに 1回で 正解した 時間は とばして、 この 問題の 時間を すぐ はじめる */
  jump:(q,T)=>{const ok=new Set(T.qs.slice(0,T.i).filter(x=>!T.bad.includes(x)&&!(T.bad2||[]).includes(x)).map(x=>x.c));
    R.pr=1;save();
    try{RECENT.add('unitDunno',{id:D.id,ci:q.c,t:CH[q.c].short,probe:1})}catch(e){}
    P=p;R.n=(R.n||0)+1;R.t=Date.now();save();chapter(q.c,0,ML('dunnoGo',{t:CH[q.c].short}))},
  end:(st,bad)=>{
    const miss=new Set(bad.concat(C.bad2||[]).map(q=>q.c));let sk=0;
    /* さいしょの 時間は かならず やる。 1回で 正解した 時間だけ 「もう わかる」に */
    /* 11/22: とばさない（やっていない 時間に ✔ が つくので）。 聞くだけ */
    R.pr=1;save();
    const [ex,tx]=ML(sk?'probeSkip':'probeAll',{k:sk});
    C={m:'end'};$('mdbox').innerHTML=`${minaBox(ex,tx)}<div class="mdnav"><button id="mdpr">▶ はじめよう</button></div>`;
    $('mdpr').onclick=()=>{snd('lesson');P=p;go(Object.assign({},p,{warm:null}))}}})}
/* ほかの 単元の 「ちょっと ふくしゅう」に つかう 問題（おわった 時間から） */
function warmQs(n){const d=CH.map((c,ci)=>ci).filter(ci=>chDone(ci)&&!(R.ch[ci]||{}).sk);if(!d.length)return [];
  const pool=d.flatMap(ci=>CH[ci].q),w=d.filter(ci=>R.miss[ci]);
  const first=w.length?pick(pool.filter(q=>w.includes(q.c)),1):[];
  return first.concat(pick(pool.filter(q=>!first.includes(q)),n-first.length))}
/* ふくしゅう: まちがえた 時間 → おわった 時間 から 5問 */
function review(p){const d=CH.map((c,ci)=>ci).filter(chDone);if(!d.length)return false;P=p||null;
  const w=d.filter(ci=>R.miss[ci]),pool=(w.length?w:d).flatMap(ci=>CH[ci].q),qs=pick(pool,Math.min(5,pool.length));
  run(qs,{title:'📚 ふくしゅう',say:ML('rev',{n:qs.length}),end:(st,bad)=>{
    if(!bad.length)w.forEach(ci=>{delete R.miss[ci]});save();
    const [ex,tx]=ML(bad.length?'revMiss':'revOk',{n:st.ok+st.hint,N:qs.length}),Pl=P;C={m:'end'};
    $('mdbox').innerHTML=`<div class="kres mdres"><p class="kend good">📚 ふくしゅう おわり！</p>${score(st)}${minaBox(ex,tx)}
      <div class="mdnav"><button id="mdsh" class="sub">📄 まとめ 1まい</button><button id="mdc">✖ とじる</button></div></div>`;
    snd('done');pay(st.ok+st.hint);if(Pl&&Pl.done)try{Pl.done(st)}catch(e){}
    $('mdsh').onclick=()=>{snd('book');P=null;sheet(close)};$('mdc').onclick=()=>{snd('back');close();try{MINA.open()}catch(e){}}}});return true}

/* ほかの 単元の 授業の 前に、 この 単元の 問題で 「ちょっと ふくしゅう」 → then() */
function warmRun(qs,label,then){P={label};run(qs,{title:'🔁 ちょっと ふくしゅう',say:ML('warm',{n:qs.length}),end:()=>{P=null;then()}})}
const U={id:D.id,D,save,open,go,probe,warmRun,close,menu,chapter,test,sheet,review,warmQs,rec:()=>R,doneN,nextCh,missOf,stars,
  started:()=>!!(R.n||doneN()),done:()=>nextCh()==null&&!!R.tn,gids:allG,_c:()=>C};
if(!LIST.includes(U))LIST.push(U);return U}

/* 図の 道具（modal-data.js と 同じ 見た目）: ブロック s=主語 m=助動詞など v=動詞 o=ほか x=まちがい ／ ⭕❌の ならび ／ 2つ くらべる ／ メーター ／ 時間の 線 */
const F={B:(t,c)=>`<span class="mdb ${c||'o'}">${t}</span>`,
  row:(a,mark)=>`<div class="mdrow${mark==='x'?' bad':''}">${mark?`<i>${mark==='x'?'❌':'⭕'}</i>`:''}${a.join('')}</div>`,
  arrow:'<div class="mdarr">⬇</div>',note:t=>`<p class="mdnote">${t}</p>`,
  two:(a,b)=>`<div class="mdtwo"><div class="${a[2]||''}"><b>${a[0]}</b><span>${a[1]}</span></div><div class="${b[2]||''}"><b>${b[0]}</b><span>${b[1]}</span></div></div>`,
  meter:a=>`<div class="mdmeter">${a.map(([w,ja,p,c])=>`<div><b class="mdb m">${w}</b><span class="mdbar"><i class="${c||''}" style="width:${p}%"></i></span><small>${ja}</small></div>`).join('')}</div>`,
  tbl:a=>`<div class="mdtbl">${a.map(([x,y])=>`<span>${x}</span><b>${y}</b>`).join('')}</div>`,
  /* 時間の 線: 左=過去・まん中=今・右=未来。 a = [[はじめ%, おわり%, 色, ことば]]、 dots = [[位置%, ことば]] */
  tl:(a,dots)=>`<div class="utl"><div class="utlbar">${(a||[]).map(([x,y,c,t])=>`<i class="${c||''}" style="left:${x}%;width:${Math.max(2,y-x)}%">${t?`<em>${t}</em>`:''}</i>`).join('')}${(dots||[]).map(([x,t])=>`<b style="left:${x}%"><em>${t||''}</em></b>`).join('')}<u style="left:66%"></u></div><div class="utllab"><span>むかし</span><span style="left:66%">いま</span><span>これから</span></div></div>`};
window.UNIT={make,list:LIST,get:id=>LIST.find(u=>u.id===id),F};
})();
