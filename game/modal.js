/* 💪 ミナ先生の 特別授業「助動詞」（MODAL）
   - 5つの 章。 章は カード（1まい = 1つの ポイント、 ◀ ▶ で めくる）→ たしかめ 3問
   - さいごに まとめテスト 8問（5つの 章 ＋ まとめ用の 問題から まぜる）
   - 問題は 苦手とっくんと 同じ: 1回目の まちがいで ヒント → 2回目で 解説。 同じ 問題は ひとめぐり するまで 出ない
   - まちがいは 苦手とっくん（SENSEI.gram('jh_modal',0)）へ。 章を ぜんぶ おえたら 4ステップの 「授業」、テストで 「とっくん」に ✔
   - 入口: ミナ先生の ページの 💪ボタン・とことん授業の チップ・文法ノート「助動詞」・とっくんの おわり・ミナ先生の ひとこと（x_md）
   中身と セリフは game/modal-data.js。 きろくは localStorage 'hoshi_modal' */
(()=>{
const {S:ST,sfx:SFX}=BEACH;
const H=HE,esc=H.esc,$=id=>document.getElementById(id);
const D=window.MODAL_DATA,CH=D.CH,GID=D.gid;
const KEY='hoshi_modal';
const R=(()=>{try{const s=JSON.parse(localStorage.getItem(KEY)||'null');if(s&&typeof s==='object')return s}catch(e){}return {}})();
R.ch=R.ch||{};R.qs=R.qs||[];R.miss=R.miss||{};
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(R))}catch(e){}};
const ML=(k,v)=>{try{return MINA.line(k,v||{})}catch(e){return ['smile','']}};
const snd=k=>{try{SFX[k]&&SFX[k]()}catch(e){}};
const talk=en=>{try{window.SENSEI&&SENSEI.talk(en)}catch(e){}},hush=()=>{try{speechSynthesis.cancel()}catch(e){}};
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.random()*(i+1)|0;[a[i],a[j]]=[a[j],a[i]]}return a};
const isEn=t=>/^[A-Za-z]/.test(String(t||''));
const face=(ex,tx)=>{try{return MINA.face('m',ex,MINA.poseFor?MINA.poseFor(ex,tx||''):undefined)}catch(e){return ''}};
const chDone=i=>!!(R.ch[i]&&R.ch[i].d);
const doneN=()=>CH.filter((c,i)=>chDone(i)).length;
const nextCh=()=>{const i=CH.findIndex((c,i)=>!chDone(i));return i<0?null:i};
const gram=(n)=>{try{window.SENSEI&&SENSEI.gram(GID,n)}catch(e){}};
/* 4ステップの 道（game/study.js）にも のこす */
function study(step){try{if(!window.STUDY)return;const SD=STUDY.rec();SD.p=SD.p||{};const r=SD.p[GID]=SD.p[GID]||{};if(r[step])return;r[step]=1;localStorage.setItem('hoshi_study',JSON.stringify(SD))}catch(e){}}

/* ---------- the overlay（とことん授業と 同じ 重ね方。 外を タップで とじる） ---------- */
let C=null;
function close(){const o=$('dpov');if(o)o.remove();C=null;hush()}
const live=()=>C&&$('mdbox');
function shell(title,back){let o=$('dpov');if(o)o.remove();try{window.DEEP&&DEEP.close()}catch(e){}
  o=document.createElement('div');o.id='dpov';document.body.appendChild(o);
  o.innerHTML=`<section class="pnl dpp mdp" role="dialog" aria-label="特別授業 助動詞">
    <div class="qtop"><button class="x" id="mdx" aria-label="${back?'もどる':'とじる'}">${back?'←':'✕'}</button><b>💪 特別授業：${esc(D.title)}</b><span class="qn" id="mdn"></span></div>
    ${title?`<p class="mdt">${title}</p>`:''}
    <div class="mdbox" id="mdbox"></div>
  </section>`;
  $('mdx').onclick=()=>{snd('back');hush();back?back():close()};
  o.onclick=e=>{if(e.target===o){snd('back');close()}};
  return $('mdbox')}
const minaBox=(ex,tx)=>`<div class="mdsay"><span class="lface">${face(ex,tx)}</span><p>${tx}</p></div>`;
const enBtn=(en,ja)=>`<button class="mden" data-say="${esc(en)}"><span>🔊 ${esc(en)}</span>${ja?`<small>${esc(ja)}</small>`:''}</button>`;
const bindSay=el=>el.querySelectorAll('[data-say]').forEach(b=>b.onclick=e=>{e.stopPropagation();snd('pop');talk(b.dataset.say)});

/* ---------- メニュー: 5つの 章 と まとめテスト ---------- */
function open(opt){opt=opt||{};C={m:'menu'};R.n=(R.n||0)+1;R.t=Date.now();save();
  if(opt.ch!=null)return chapter(opt.ch,0);
  menu(R.n<=1?'md_hello':null)}
function menu(key){C={m:'menu'};hush();const box=shell('',null),nx=nextCh(),all=nx==null;
  const k=key||(R.best>=3?'md_master':all?'md_allDone':'md_again'),[ex,tx]=ML(k);
  $('mdn').textContent=`${doneN()}/${CH.length}`;
  box.innerHTML=`${minaBox(ex,tx)}
    <div class="mdchs">${CH.map((c,i)=>`<button data-ch="${i}" class="${chDone(i)?'done':''}${i===nx?' now':''}"><i>${chDone(i)?'✔':c.ico}</i><span><small>${i+1}時間目</small>${esc(c.t)}</span></button>`).join('')}</div>
    <div class="mdgo2">${nx!=null?`<button id="mdstart">${nx?'▶ つづきから（'+(nx+1)+'時間目）':'▶ はじめる'}</button>`:''}
      <button id="mdtest" class="${all?'':'sub'}">📝 まとめテスト ${R.best?`<span class="mdstar">${'★'.repeat(R.best)}<i>${'★'.repeat(3-R.best)}</i></span>`:''}</button></div>`;
  box.querySelectorAll('[data-ch]').forEach(b=>b.onclick=()=>{snd('step');chapter(+b.dataset.ch,0)});
  const s=$('mdstart');if(s)s.onclick=()=>{snd('lesson');chapter(nx,0)};
  $('mdtest').onclick=()=>{snd('step');test()}}

/* ---------- 章の カード ---------- */
function chapter(ci,i){const c=CH[ci];if(!c)return menu();C={m:'card',ci,i};hush();
  const box=shell(`${c.ico} ${ci+1}時間目　${esc(c.t)}`,menu),k=c.cards[i],N=c.cards.length;
  $('mdn').textContent=`${i+1}/${N}`;
  box.innerHTML=`<div class="mdcard">
      ${minaBox(k.x||'smile',k.say)}
      ${k.f?`<div class="mdfig">${k.f}</div>`:''}
      ${k.ex?`<div class="mdens">${k.ex.map(e=>enBtn(e[0],e[1])).join('')}</div>`:''}
    </div>
    <div class="mddots">${c.cards.map((x,j)=>`<i class="${j===i?'on':j<i?'past':''}"></i>`).join('')}<i class="q">✏️</i></div>
    <div class="mdnav"><button id="mdprev" class="sub" ${i?'':'disabled'}>◀ もどる</button><button id="mdnext">${i<N-1?'つぎへ ▶':'✏️ たしかめ 3問'}</button></div>`;
  bindSay(box);if(k.ex&&k.ex[0])setTimeout(()=>{if(live()&&C.m==='card'&&C.ci===ci&&C.i===i)talk(k.ex[0][0])},500);
  $('mdprev').onclick=()=>{snd('back');chapter(ci,i-1)};
  $('mdnext').onclick=()=>{snd('step');i<N-1?chapter(ci,i+1):chQuiz(ci)}}

/* ---------- 問題を えらぶ（ひとめぐり するまで 同じ ものは 出さない） ---------- */
const keyOf=q=>q.c!=null&&q.mix==null?'c'+q.c+'_'+CH[q.c].q.indexOf(q):'x'+D.MIX.indexOf(q);
D.MIX.forEach(q=>q.mix=1);
function pick(pool,n){const seen=new Set(R.qs),fresh=shuffle(pool.filter(q=>!seen.has(keyOf(q)))),old=shuffle(pool.filter(q=>seen.has(keyOf(q))));
  const take=fresh.slice(0,n);if(take.length<n){take.push(...old.slice(0,n-take.length));const ks=new Set(pool.map(keyOf));R.qs=R.qs.filter(k=>!ks.has(k))}
  take.forEach(q=>R.qs.push(keyOf(q)));save();return take}
function chQuiz(ci){const qs=pick(CH[ci].q,3);run(qs,{ci,title:`${CH[ci].ico} ${ci+1}時間目　たしかめ`,start:'md_qStart',end:st=>chEnd(ci,st)})}
function test(){const all=CH.flatMap(c=>c.q).concat(D.MIX);
  /* 5つの 章から 1問ずつ ＋ のこりは まぜて */
  let qs=[];CH.forEach((c,ci)=>{qs.push(...pick(all.filter(q=>q.c===ci&&!qs.includes(q)),1))});
  qs.push(...pick(all.filter(q=>!qs.includes(q)),8-qs.length));
  run(shuffle(qs),{test:1,title:'📝 まとめテスト',start:'md_testStart',end:testEnd})}

/* ---------- 問題を 1つずつ: まちがえたら ヒント → もう一回 まちがえたら 解説 ---------- */
function run(qs,o){C={m:'q',qs,o,i:0,st:{ok:0,hint:0,miss:0},bad:[]};const T=C;
  const box=shell(o.title,menu),[ex,tx]=ML(o.start,{n:qs.length});
  box.innerHTML=`${minaBox(ex,tx)}<div id="mdq"></div>`;
  setTimeout(()=>{if(C===T)ask()},600)}
function ask(){const T=C;if(!live()||T.m!=='q')return;const q=T.qs[T.i];if(!q)return T.o.end(T.st,T.bad);
  T.tries=0;$('mdn').textContent=`✏️ ${T.i+1}/${T.qs.length}`;
  const order=shuffle(q.o.map((x,i)=>i)),[a,b]=q.s?q.s.split('___'):['',''];
  const head=q.s?`<p class="mdqs">${esc(a)}<u>　？　</u>${esc(b||'')}</p>${q.ja?`<small class="mdja">${esc(q.ja)}</small>`:''}`:`<p class="mdqp">${esc(q.p)}</p>`;
  const el=$('mdq');el.innerHTML=`<div class="mdcard mdqc"><p class="mdqn">Q${T.i+1}.${q.s?' ___ に 入るのは？':''}</p>${head}<div id="mdhint"></div>
    <div class="mdopts">${order.map(i=>`<button data-o="${i}" class="${isEn(q.o[i])?'en':''}">${esc(q.o[i])}</button>`).join('')}</div><div id="mdafter"></div></div>`;
  el.querySelectorAll('[data-o]').forEach(bt=>bt.onclick=()=>{if(bt.disabled||C!==T)return;hush();const k=+bt.dataset.o;
    if(k===0){bt.classList.add('right');el.querySelectorAll('[data-o]').forEach(x=>x.disabled=true);got(q)}
    else{bt.classList.add('wrong');bt.disabled=true;T.tries++;missed(q,k)}})}
const show=id=>setTimeout(()=>{const e=$(id);if(e)e.scrollIntoView({block:'nearest',behavior:'smooth'})},60);
const fullOf=q=>q.s?q.s.replace('___',q.o[0]):isEn(q.o[0])?q.o[0]:'';
function got(q){const T=C,first=!T.tries;snd('correct');
  if(first)T.st.ok++;else T.st.hint++;gram(first?2:1);
  const [ex,tx]=ML(first?'md_ok':'md_okHint'),f=fullOf(q);
  $('mdafter').innerHTML=`${minaBox(ex,tx)}${f?`<div class="mdens">${enBtn(f,q.ja||q.p||'')}</div>`:''}`;bindSay($('mdafter'));show('mdafter');
  if(f)talk(f);
  const go=()=>{if(C!==T)return;T.i++;ask()};
  (H.afterTalk?H.afterTalk(go,500,1300,()=>C===T):setTimeout(go,1600))}
function missed(q,k){const T=C,left=document.querySelectorAll('#mdq [data-o]:not(:disabled)').length;
  if(T.tries===1&&left>1){snd('pickup');const [ex,tx]=ML('md_hint');
    $('mdhint').innerHTML=`<div class="mdhint">💡 <b>ヒント</b>　${esc(q.h)}<small>${esc(tx.replace(/<[^>]+>/g,''))}</small></div>`;show('mdhint');return}
  snd('wrong');T.st.miss++;T.bad.push(q);gram(0);R.miss[q.c]=(R.miss[q.c]||0)+1;save();
  document.querySelectorAll('#mdq [data-o]').forEach(x=>{x.disabled=true;if(+x.dataset.o===0)x.classList.add('right')});
  const [ex,tx]=ML('md_explain'),bad=q.s?q.s.replace('___',q.o[k]):q.o[k],good=q.s?fullOf(q):q.o[0];
  $('mdhint').innerHTML='';
  $('mdafter').innerHTML=`${minaBox(ex,tx)}<div class="mdexp"><p class="mdfix"><s>${esc(bad)}</s><br>⭕ <b>${esc(good)}</b></p><p>${esc(q.e)}</p></div>
    <div class="mdnav"><button class="sub" id="mdsee">📖 ${q.c+1}時間目を 見る</button><button id="mdnx">わかった！ つぎへ ▶</button></div>`;
  show('mdafter');if(isEn(good))talk(good);
  $('mdnx').onclick=()=>{snd('step');hush();T.i++;ask()};
  /* カードを 見に 行っても、 もどったら つぎの 問題から */
  $('mdsee').onclick=()=>{snd('book');peek(q.c,()=>{C=T;const box=shell(T.o.title,menu);box.innerHTML='<div id="mdq"></div>';T.i++;ask()})}}
/* 問題の とちゅうで 章の カードを ぜんぶ ならべて 見る */
function peek(ci,back){const c=CH[ci];C={m:'peek'};hush();const box=shell(`${c.ico} ${ci+1}時間目　${esc(c.t)}`,back);$('mdn').textContent='';
  box.innerHTML=c.cards.map(k=>`<div class="mdcard">${minaBox(k.x||'smile',k.say)}${k.f?`<div class="mdfig">${k.f}</div>`:''}${k.ex?`<div class="mdens">${k.ex.map(e=>enBtn(e[0],e[1])).join('')}</div>`:''}</div>`).join('')+
    `<div class="mdnav"><button id="mdbk">✏️ 問題に もどる ▶</button></div>`;
  bindSay(box);$('mdbk').onclick=()=>{snd('step');back()}}

/* ---------- おわり ---------- */
const stars=n=>`<span class="mdstar">${'★'.repeat(n)}<i>${'★'.repeat(3-n)}</i></span>`;
function score(st){return `<div class="snscore"><span>⭕ 1回で <b>${st.ok}</b></span><span>💡 ヒントで <b>${st.hint}</b></span><span>📘 解説 <b>${st.miss}</b></span></div>`}
function pay(n){setTimeout(()=>{try{const b=$('mdbox').getBoundingClientRect();H.coinBurst(b.left+b.width/2,Math.min(b.top+60,innerHeight-60),n)}catch(e){ST.coins+=n}},400)}
function chEnd(ci,st,bad){const c=CH[ci],first=!chDone(ci);R.ch[ci]=R.ch[ci]||{};R.ch[ci].d=1;R.ch[ci].c=(R.ch[ci].c||0)+1;save();
  if(doneN()===CH.length)study('l');
  const coin=first?5:2,[ex,tx]=ML(st.miss?'md_chMiss':'md_chDone',{t:c.short}),nx=nextCh(),nxt=ci+1<CH.length?ci+1:nx;
  C={m:'end'};$('mdn').textContent='✔';
  $('mdbox').innerHTML=`<div class="kres mdres"><p class="kend good">✔ ${ci+1}時間目 おわり！</p>${score(st)}
    <p class="kpay">🪙 <b>${coin}まい</b>${first?' <small>はじめて</small>':''}</p>${minaBox(ex,tx)}
    <div class="mdnav">${st.miss?`<button class="sub" id="mdre">🔁 カードを もう一回</button>`:''}${nxt!=null?`<button id="mdnc">▶ ${nxt+1}時間目へ</button>`:`<button id="mdt">📝 まとめテストへ</button>`}</div>
    <div class="mdnav"><button class="sub" id="mdm">☰ 章の 一覧</button></div></div>`;
  snd('done');pay(coin);
  const re=$('mdre');if(re)re.onclick=()=>{snd('step');chapter(ci,0)};
  const nc=$('mdnc');if(nc)nc.onclick=()=>{snd('lesson');chapter(nxt,0)};
  const t=$('mdt');if(t)t.onclick=()=>{snd('step');test()};
  $('mdm').onclick=()=>{snd('pop');menu()}}
function testEnd(st,bad){const N=st.ok+st.hint+st.miss,perfect=st.ok===N,s=perfect?3:st.miss<=1?2:1,first=!R.tn,new3=s===3&&(R.best||0)<3;
  R.tn=(R.tn||0)+1;R.best=Math.max(R.best||0,s);R.last=s;save();study('t');
  try{const tk=SENSEI.rec();tk.tk=tk.tk||{};tk.tk[GID]=1}catch(e){}
  const coin=(first?15:6)+(perfect?5:0)+(new3?5:0),[ex,tx]=ML(perfect?'md_perfect':s===2?'md_good':'md_miss',{n:st.ok+st.hint,N});
  const weak=[...new Set(bad.map(q=>q.c))].sort();
  C={m:'end'};$('mdn').textContent='';
  $('mdbox').innerHTML=`<div class="kres mdres"><p class="kend good">📝 まとめテスト おわり！</p>
    <p class="dpstar">${stars(s)}<small>わかった度</small></p>${score(st)}
    <p class="kpay">🪙 <b>${coin}まい</b>${first?' <small>はじめての テスト</small>':''}${perfect?' <small>ノーミス +5</small>':''}${new3?' <small>★3 はじめて +5</small>':''}</p>
    ${minaBox(ex,tx)}
    ${weak.length?`<p class="mdnote2">📘 見なおすと いい ところ</p><div class="mdchs">${weak.map(i=>`<button data-ch="${i}"><i>${CH[i].ico}</i><span><small>${i+1}時間目</small>${esc(CH[i].t)}</span></button>`).join('')}</div>`:''}
    <div class="mdnav"><button id="mdag" class="${perfect?'':'sub'}">🔁 もう一回 テスト</button>${weak.length&&window.SENSEI?'<button id="mdtk">🎯 苦手とっくん</button>':''}</div>
    <div class="mdnav"><button class="sub" id="mdm">☰ 章の 一覧</button><button class="sub" id="mdc">✖ とじる</button></div></div>`;
  new3||perfect?snd('done'):snd('pop');pay(coin);
  $('mdbox').querySelectorAll('[data-ch]').forEach(b=>b.onclick=()=>{snd('step');chapter(+b.dataset.ch,0)});
  $('mdag').onclick=()=>{snd('step');test()};
  const tk=$('mdtk');if(tk)tk.onclick=()=>{snd('step');close();SENSEI.tokkun([GID])};
  $('mdm').onclick=()=>{snd('pop');menu()};$('mdc').onclick=()=>{snd('back');close()}}

/* ---------- 入口 ---------- */
/* ミナ先生の ページの ボタン（game/mina.js） */
function btn(){const n=doneN(),all=n===CH.length;
  return `<button id="mdgo" class="msgo mdgo"><span>💪</span><b>特別授業：${esc(D.title)}</b><small>${R.best?stars(R.best):all?'まとめテストへ':n?`${n}/${CH.length}`:'NEW'}</small></button>`}
function bindBtn(){const b=$('mdgo');if(b)b.onclick=()=>{snd('lesson');open()}}
/* 文法ノート「助動詞」の ページ */
H.on('gramView',(lv,i,n)=>setTimeout(()=>{if(!n||n.id!==GID)return;const row=H.panel.querySelector('.gview .row');if(!row||row.querySelector('#gmd'))return;
  row.insertAdjacentHTML('beforeend','<button id="gmd" class="sub">💪 特別授業</button>');$('gmd').onclick=()=>{snd('lesson');open()}},0));
/* ミナ先生の ひとこと（game/mina-sense.js の ルールに 足す） */
try{const RL=MINA_SENSE._rules,go=ci=>['💪 特別授業へ',()=>open(ci!=null?{ch:ci}:null)];
  RL.push(['x_mdNew',4,F=>R.n?null:{},()=>go()]);
  RL.push(['x_mdNext',3,F=>{if(!R.n)return null;const i=nextCh();return i==null||i===0&&!doneN()?null:{t:CH[i].short,_i:i}},v=>go(v._i)]);
  RL.push(['x_mdTest',3,F=>nextCh()==null&&!R.tn?{}:null,()=>['📝 まとめテストへ',()=>{open();test()}]]);
  RL.push(['x_mdWeak',3,F=>{let w=false;try{w=SENSEI.weak().includes(GID)}catch(e){}if(!w||!R.n)return null;
    const ci=Object.keys(R.miss).sort((a,b)=>R.miss[b]-R.miss[a])[0];return {t:ci!=null&&CH[ci]?'「'+CH[ci].short+'」':'助動詞',_i:ci!=null&&CH[ci]?+ci:null}},v=>go(v._i)]);
}catch(e){}

window.MODAL={open,close,menu,chapter,test,btn,bindBtn,rec:()=>R,doneN,_c:()=>C};
})();
