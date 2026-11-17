/* 💞 ミオとの 恋の つづき（しくみ）。 中身は game/mio-love-data.js、 会話の 画面は game/mio-chat.js
   - こいびとの あと、 章（M.c）で すすむ: 0 こいびと → 1 遠距離 → 2 ふたりの 毎日 → 3 共同経営者 → 4 婚約 → 5 夫婦
   - ✉️ 遠距離の 間は 1日 1通 手紙が とどく。 赤ペンで まちがいを なおして（ヒント → 解説）、 返事を えらぶ
   - 💌 恋の 英語メモ: 会話の 中の あまい 言い方・さそい方・照れかくしを あつめる（M.nt）
   - 🌠 決心の 夜（WED）: 結婚できるのは ミナ先生か ミオの ひとりだけ。 もう ひとりとも 恋の 途中なら、 プロポーズの 前に えらぶ。 かえられない
     えらばなかった 人の 段階は それ以上 すすまない（これまでの 話・思い出は そのまま）。 その人の 「その後」の 話が 出る
     すでに ミナ先生と 婚約・結婚している セーブは ミナ先生を えらんだ ことに なる（ミオの こいびとまでの 話は そのまま 見られる）
   データは SHOP.rec().mio に 足す: c（章）・alt（えらばれなかった）・wp（えらんだ 人）・lt（手紙）・ltd・nt・nd・engD */
(()=>{
const {sfx:SFX}=BEACH;
const H=HE,esc=H.esc,$=id=>document.getElementById(id);
const pickL=a=>a[Math.random()*a.length|0];
const sf=k=>{try{SFX[k]&&SFX[k]()}catch(e){}};
const today=()=>{try{return CG.today()}catch(e){return new Date().toDateString()}};
const keep=()=>{try{CG.save()}catch(e){}try{save()}catch(e){}};
const MR=()=>{const M=MIOC.rec();M.nt=M.nt||{};M.nd=M.nd||{};M.lt=M.lt||[];return M};
const speak=en=>{try{MIO.say(en)}catch(e){}};
const jaOn=()=>{try{return MINA.level()==='es'}catch(e){return true}};
const LV=()=>{try{return LOVE.rec()}catch(e){return {st:0}}};
const minaBox=(k,v)=>{try{const [ex,tx]=MINA.line(k,v||{});return `<div class="kmina"><span class="lface">${MINA.face('m',ex)}</span><p>${tx}</p></div>`}catch(e){return ''}};
const top=(t,right,id)=>`<div class="qtop"><button class="x" id="${id}" aria-label="もどる">←</button><b>${t}</b><span class="qn">${right}</span></div>`;

/* ================================================================ 章 */
const chap=()=>{const M=MR();return M.lover&&!M.alt?(M.c||0):-1};
function head(){const M=MR();if(M.alt)return {ico:MIO_ALT.ico,n:MIO_ALT.n,hint:''};if(!M.lover)return null;const c=M.c||0;
  return {ico:MIO_CH[c].ico,n:MIO_CH[c].n,hint:letterDue()?'✉️ 手紙が とどいてるよ':MIO_CH_HINT[c]}}
const ringOk=()=>{try{return !!ZAKKA.rec().own.g_ring}catch(e){return false}};
/* 雑貨店の ガラスケースに 指輪が ならぶ・ミオへ わたせる */
const ringFor=()=>chap()>=3&&chap()<5&&WED.who()!=='mina';
const lettersDone=()=>MR().lt.length>=MIO_LETTERS.length;
const letterDue=()=>chap()===1&&!lettersDone()&&MR().ltd!==today();
const dayAfter=id=>{const d=MR().nd[id];return !!d&&d!==today()};
const wedOk=()=>MR().engD!==today();
/* 会話の あいさつ（章ごと） */
const HI=[null,
 ["(The shop feels quiet. Mio is studying abroad in the snow country.)","（お店が しずか。 ミオは 雪の 国に 留学中…）"],
 ["You're here! I still can't believe I'm home. …Or that you're my boyfriend. Ha ha. What should we talk about?","来た！ まだ 帰ってきた 実感が ない。 …あなたが かれしって ことも。 あはは。 なに 話す？"],
 ["Good morning, co-owner! Today's sales goal: a lot! Today's love goal: even more!","おはよう、 共同経営者さん！ きょうの 売り上げ目標： たくさん！ きょうの 愛の 目標： もっと たくさん！"],
 ["I keep looking at my ring. I almost sold it to a customer by mistake. Just kidding!","指輪ばっかり 見ちゃう。 まちがえて お客さんに 売りそうに なった。 じょうだん！"],
 ["Welcome home, honey. …I still get shy saying that. Ha ha.","おかえり、 ハニー。 …まだ 言うと 照れちゃう。 あはは。"]];
const ALT_HI=["Boss! Your number one partner is here! What's up?","店長！ いちばんの なかま、 参上！ どうしました？"];
function hi(){const M=MR();if(M.alt)return ALT_HI;const c=chap();return c>0?HI[c]:null}

/* 会話の さいごに（game/mio-chat.js の finish から）。 ミナ先生の セリフの キーを かえす */
function onEnd(t,n){const M=MR();let mk=null;if(!M.nd[t.id])M.nd[t.id]=today();
  if(n.ch!=null&&M.lover&&!M.alt&&(M.c||0)<n.ch){M.c=n.ch;if(n.ch===4)M.engD=today();if(n.ch===5)M.wedD=today();mk='mc_ch'+n.ch;chUp(n.ch)}
  if(n.alt&&!M.alt){M.alt=1;mk='mc_alt'}
  if(n.fx==='minaBye'){try{LOVE.rec().bye=1}catch(e){}}
  keep();return mk}
function chUp(c){const g=MIO_CH[c];setTimeout(()=>{
  if(c>=4){try{SFX.fanfare(3)}catch(e){}try{[0,500,1000].forEach(t=>setTimeout(()=>FX.firework(innerWidth*(.2+Math.random()*.6),innerHeight*.25),t))}catch(e){}}else sf('done');
  H.toast(`${g.ico} ミオとの 関係が 「<b>${esc(g.n)}</b>」に なった！`,4200)},900)}

/* 💌 ことばメモ（会話の 中で 出た ときに たまる） */
function noteHTML(n){if(!n.nt)return '';const M=MR();n.nt.forEach(([en,ja])=>{if(!M.nt[en])M.nt[en]=ja});keep();
  return `<details class="mlnt"><summary>💌 ことばメモ</summary>${n.nt.map(([en,ja])=>`<p><b>${esc(en)}</b><small>${esc(ja)}</small></p>`).join('')}</details>`}

/* ================================================================ ミオの ページに 足す ところ */
function block(){const M=MR();let h='';
  if(chap()===1){const n=M.lt.length,due=letterDue();
    h+=`<button id="mlletter" class="mcstudy mlletter"><span>✉️</span><b>${due?'ミオから 手紙が とどいた！':lettersDone()?'手紙は ぜんぶ とどいた':'つぎの 手紙は あした'}<small>留学中の 手紙 ${n}/${MIO_LETTERS.length}通・赤ペンで なおして 返事を 書こう</small></b>${due?'<i class="dot"></i>':''}</button>`}
  const bt=[];if(M.lt.length)bt.push(`<button id="mlbox" class="sub">📮 手紙の 箱 <small>${M.lt.length}</small></button>`);
  const nn=Object.keys(M.nt).length;if(nn)bt.push(`<button id="mlnotes" class="sub">💌 恋の 英語メモ <small>${nn}</small></button>`);
  return h+(bt.length?`<div class="row">${bt.join('')}</div>`:'')}
function bind(back){const b=$('mlletter');if(b)b.onclick=()=>{sf('step');letterDue()?letter(back):box(back)};
  const x=$('mlbox');if(x)x.onclick=()=>{sf('book');box(back)};
  const nb=$('mlnotes');if(nb)nb.onclick=()=>{sf('book');notes(back)}}

/* ================================================================ ✉️ 手紙 */
let L=null;
const hush=()=>{try{speechSynthesis.cancel()}catch(e){}};
const shuf=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.random()*(i+1)|0;[a[i],a[j]]=[a[j],a[i]]}return a};
function paper(x,fixed,mark){return `<div class="mlpaper">${x.s.map(([en,ja],i)=>{const t=i===x.bad&&fixed?x.fix[0]:en;
  return `<p class="mlln${i===x.bad&&mark?' bad':''}${i===x.bad&&fixed?' fixed':''}" data-l="${i}"><span class="en">${i===x.bad&&fixed?`<s>${esc(en)}</s> `:''}${esc(t)}</span><small class="ja" ${jaOn()?'':'hidden'}>${esc(ja)}</small></p>`}).join('')}</div>`}
function letter(back){const M=MR(),i=M.lt.length,x=MIO_LETTERS[i];if(!x)return box(back);hush();
  L={i,x,back,tries:0,ftries:0,pts:0,r:[]};
  H.show('cg',`<section class="pnl shp mc mll" data-stay>
    ${top(`✉️ ${esc(x.w)}「${esc(x.t)}」`,`${i+1}/${MIO_LETTERS.length}`,'mlx')}
    <div id="mlp">${paper(x)}</div>
    ${jaOn()?'':'<button class="kjab" id="mlja">訳を 見る</button>'}
    <div id="mlans"></div>
  </section>`);
  $('mlx').onclick=()=>{sf('back');hush();L=null;MIOC.open(back)};
  const jb=$('mlja');if(jb)jb.onclick=()=>{sf('tap');jb.remove();H.panel.querySelectorAll('.mlpaper .ja').forEach(e=>e.hidden=false)};
  speak(x.s.slice(1,3).map(s=>s[0]).join(' '));find()}
function find(){const x=L.x;$('mlans').innerHTML=`<p class="mlq">✏️ 赤ペンの 時間！ まちがいが 1つ ある 文を タップしよう</p><p class="mlh" id="mlh"></p>`;
  H.panel.querySelectorAll('.mlln').forEach(p=>p.onclick=()=>{if(!L||L.step)return;const i=+p.dataset.l;
    if(i===x.bad){sf('ok');p.classList.add('bad');fix()}
    else{L.tries++;sf('ng');p.classList.add('nope');setTimeout(()=>p.classList.remove('nope'),500);
      if(L.tries===1)$('mlh').innerHTML=`💡 ヒント： ${esc(x.h)}`;
      else{H.panel.querySelector(`.mlln[data-l="${x.bad}"]`).classList.add('bad');$('mlh').innerHTML=`👉 まちがいは この 文。 ${esc(x.h)}`;setTimeout(fix,900)}}})}
function fix(){if(!L||L.step)return;L.step='fix';const x=L.x,o=shuf(x.fix.map((f,i)=>[f,i]));
  $('mlans').innerHTML=`<p class="mlq">🖍️ 正しく なおすと？</p><div class="lopts kopts">${o.map(([f,i])=>`<button data-f="${i}">${esc(f)}</button>`).join('')}</div><p class="mlh" id="mlh"></p>`;
  $('mlans').querySelectorAll('[data-f]').forEach(b=>b.onclick=()=>{if(L.step!=='fix')return;const i=+b.dataset.f;
    if(i===0){sf('ok');L.step='fixed';if(!L.tries&&!L.ftries)L.pts++;$('mlp').innerHTML=paper(x,1);
      $('mlans').innerHTML=`<p class="mlok">⭕ ${esc(x.fix[0])}</p><p class="mlx">📝 ${esc(x.x)}</p><button id="mlnext">✍️ 返事を 書く</button>`;speak(x.fix[0]);
      $('mlnext').onclick=()=>{sf('step');reply(0)};scrollEnd()}
    else{L.ftries++;sf('ng');b.disabled=true;$('mlh').innerHTML=L.ftries===1?`💡 ヒント： ${esc(x.h)}`:`📝 解説： ${esc(x.x)}`}});scrollEnd()}
function reply(k){if(!L)return;L.step='rep'+k;const x=L.x,o=shuf(x.rep[k].map((r,i)=>[r,i]));
  $('mlans').innerHTML=`<p class="mlq">✍️ 返事 ${k+1}/2： どれを 書く？</p><div class="lopts kopts">${o.map(([r,i])=>`<button data-r="${i}">${esc(r[0])}<small class="mcja" ${jaOn()?'':'hidden'}>${esc(r[1])}</small></button>`).join('')}</div>`;
  $('mlans').querySelectorAll('[data-r]').forEach(b=>b.onclick=()=>{sf('tap');const i=+b.dataset.r;L.r.push(i);L.pts+=x.rep[k][i][2];k?done():reply(1)});scrollEnd()}
function done(){const M=MR(),x=L.x,back=L.back;M.lt.push({r:L.r,d:today()});M.ltd=today();
  const [en,ja]=x.nt;if(!M.nt[en])M.nt[en]=ja;
  try{RECENT.add('mio',{id:'letter'+L.i,how:'letter'})}catch(e){}
  const heart=MIOC.gain(Math.max(1,L.pts),'talk');keep();
  const last=lettersDone();
  $('mlans').innerHTML=`<div class="kres">
    <div class="mlpaper mlrep"><p>Dear Mio,</p>${L.r.map((i,k)=>`<p>${esc(x.rep[k][i][0])}</p>`).join('')}<p>Love,<br>（あなたの 名前）</p></div>
    <p class="kend good">📮 返事を 出した！</p>
    ${heart?`<p class="zkheart">${heart}</p>`:''}
    <details class="mlnt" open><summary>💌 ことばメモ</summary><p><b>${esc(en)}</b><small>${esc(ja)}</small></p></details>
    ${minaBox(last?'mc_letterLast':'mc_letter',{n:M.lt.length})}
    <div class="row"><button id="mlok" data-back>${last?'🛬 ミオが 帰ってくる…':'もどる'}</button></div>
  </div>`;
  sf('heart');L=null;
  $('mlok').onclick=()=>{sf('back');MIOC.open(back)};scrollEnd()}
function scrollEnd(){setTimeout(()=>{const a=$('mlans');if(a)a.scrollIntoView({behavior:'smooth',block:'end'})},80)}
/* 📮 手紙の 箱（読みかえす） */
function box(back){hush();const M=MR();
  H.show('cg',`<section class="pnl shp mc mll">
    ${top('📮 手紙の 箱',`${M.lt.length}通`,'mlx')}
    ${M.lt.length?M.lt.map((r,i)=>{const x=MIO_LETTERS[i];return `<details class="mfold"><summary>${x.ico} ${esc(x.w)}「${esc(x.t)}」</summary><div class="mfbody">${paper(x,1)}
      <div class="mlpaper mlrep"><p>Dear Mio,</p>${r.r.map((j,k)=>`<p>${esc(x.rep[k][j][0])}</p>`).join('')}</div></div></details>`}).join(''):'<p class="note">まだ 手紙は ないよ</p>'}
  </section>`);
  H.panel.querySelectorAll('.mlpaper .ja').forEach(e=>e.hidden=false);
  $('mlx').onclick=()=>{sf('back');MIOC.open(back)}}
/* 💌 恋の 英語メモ */
function notes(back){hush();const M=MR(),E=Object.entries(M.nt);
  H.show('cg',`<section class="pnl shp mc">
    ${top('💌 恋の 英語メモ',`${E.length}こ`,'mlx')}
    ${minaBox('mc_notes',{n:E.length})}
    <div class="mlnotes">${E.map(([en,ja])=>`<button data-say="${esc(en)}"><b>${esc(en)}</b><small>${esc(ja)}</small></button>`).join('')}</div>
  </section>`);
  H.panel.querySelectorAll('[data-say]').forEach(b=>b.onclick=()=>{sf('tap');speak(b.dataset.say)});
  $('mlx').onclick=()=>{sf('back');MIOC.open(back)}}

/* ================================================================ 🌠 決心の 夜（結婚できるのは ひとり） */
function who(){const M=MR();if(M.wp)return M.wp;if((LV().st||0)>=4)return 'mina';if(M.lover&&!M.alt&&(M.c||0)>=4)return 'mio';return null}
const romantic=x=>x==='mina'?(LV().st||0)>=1:(()=>{try{return MIOC.stage()>=4&&!MR().alt}catch(e){return false}})();
/* プロポーズの 前に よぶ。 go: そのまま すすむ、 back: もどる */
function ask(target,go,back){const w=who();if(w===target)return go();if(w)return back();
  if(!romantic(target==='mio'?'mina':'mio'))return go();choose(target,go,back)}
const WHO={mina:{n:'ミナ先生',face:()=>{try{return MINA.face('m','love','chest')}catch(e){return ''}},st:()=>{try{const s=LOVE_STAGES[LV().st];return s.ico+' '+s.n}catch(e){return ''}},
   mem:'星の 下で 英語を 教えてくれた 人。 いつも となりで 「よく できたね」と 笑ってくれた',
   yes:["…You chose me? …Of course I'm happy. I'm the happiest teacher in the world. Let's walk together, from now on.","…わたしを えらんでくれたの？ …うれしいに きまってる。 世界で いちばん しあわせな 先生だよ。 これからは ずっと いっしょに 歩こうね。"]},
 mio:{n:'ミオ',face:()=>{try{return MIO.face('smile','')}catch(e){return ''}},st:()=>{const h=head();return h?h.ico+' '+h.n:'💓 気になる ふたり'},
   mem:'カードショップの 看板娘。 おっちょこちょいで、 いつも 笑顔で、 英語を いっしょに 学んできた 人',
   yes:["Me? Really? …Ha ha, I'm crying and laughing again. Yes. Let's be together. Forever, partner.","わたし？ ほんとに？ …あはは、 また 泣きながら 笑ってる。 うん。 ずっと いっしょに いよう。 パートナー。"]}};
function choose(target,go,back){hush();sf('step');
  const card=k=>{const P=WHO[k];return `<button class="wdcard" data-w="${k}"><span class="wdf ${k==='mio'?'mcf':''}">${P.face()}</span><b>${P.n}</b><small class="wdst">${esc(P.st())}</small><small>${esc(P.mem)}</small></button>`};
  H.show('cg',`<section class="pnl shp mc wdp" data-stay>
    ${top('🌠 決心の 夜','','wdx')}
    <p class="wdin">流れ星の ふる 夜。 ポケットの 中に、 星の 指輪。<br>心に うかぶのは、 ふたりの 顔…</p>
    <div class="wdpair">${card('mina')}${card('mio')}</div>
    <p class="note">💍 結婚できるのは ひとりだけ。 えらぶと、 もう ひとりとの 関係は いまの まま。 これまでの 思い出は 消えないよ</p>
    <div id="wdans"></div>
  </section>`);
  $('wdx').onclick=()=>{sf('back');back()};
  H.panel.querySelectorAll('[data-w]').forEach(b=>b.onclick=()=>{const k=b.dataset.w,P=WHO[k];sf('tap');
    H.panel.querySelectorAll('.wdcard').forEach(c=>c.classList.toggle('on',c===b));
    $('wdans').innerHTML=`<div class="kres"><p class="mlq">💍 <b>${P.n}</b>と 生きていく 道を えらぶ？<br><small>この 決心は あとから かえられないよ</small></p>
      <div class="row"><button id="wdyes">💍 ${P.n}を えらぶ</button><button id="wdno" class="sub">もう少し 考える</button></div></div>`;
    $('wdno').onclick=()=>{sf('back');$('wdans').innerHTML='';H.panel.querySelectorAll('.wdcard').forEach(c=>c.classList.remove('on'))};
    $('wdyes').onclick=()=>decide(k,target,go,back);
    $('wdans').scrollIntoView({behavior:'smooth',block:'end'})})}
function decide(k,target,go,back){const M=MR();M.wp=k;keep();try{RECENT.add('mio',{id:'wed_'+k,how:'choice'})}catch(e){}
  const P=WHO[k];sf('heart');
  $('wdans').innerHTML=`<div class="kres">
    <div class="lsay kth"><span class="lface kf ${k==='mio'?'mcf':''}">${P.face()}</span><div class="lbody"><p class="ken">${esc(P.yes[0])}</p><small class="kja on">${esc(P.yes[1])}</small></div></div>
    <p class="kend good">🌠 ${P.n}と 生きていく 道を えらんだ</p>
    ${k==='mina'?minaBox('wd_mina'):minaBox('wd_mio')}
    <div class="row"><button id="wdgo">${k===target?'💍 プロポーズへ':k==='mina'?'💗 ミナ先生の ところへ':'💬 ミオの ところへ'}</button></div></div>`;
  if(k==='mio')speak(P.yes[0]);else try{say(P.yes[0])}catch(e){}
  $('wdgo').onclick=()=>{sf('step');if(k===target)go();else if(k==='mina')LOVE.open(H.home);else MIOC.open()};
  $('wdans').scrollIntoView({behavior:'smooth',block:'end'})}
/* ミナ先生の 声（ミナ先生の 会話の とき） */
let enV=null;function say(en){if(!BEACH.S.sound||!window.speechSynthesis)return;try{speechSynthesis.cancel();if(!enV){const vs=speechSynthesis.getVoices().filter(v=>/^en[-_]/i.test(v.lang));enV=vs.find(v=>/en[-_]US/i.test(v.lang))||vs[0]||null}
  const u=new SpeechSynthesisUtterance(String(en).replace(/\([^)]*\)/g,' '));u.lang='en-US';if(enV)u.voice=enV;u.pitch=1.25;u.rate=.88;speechSynthesis.speak(u)}catch(e){}}

/* ================================================================ ミナ先生の セリフ */
Object.assign(MINA_LINES,{
 mc_ch1:[['smile','ミオさん、 留学に 行ったんだね。 手紙の まちがいを なおして あげるのは、 いい 英語の 練習に なるよ'],['love','はなれていても、 ことばが あれば つながってるよ。 手紙、 たのしみだね']],
 mc_ch2:[['happy','おかえり、 ミオさん！ ふたりの 毎日の はじまりだね。 「I missed you.」は 会えた ときの ことば'],['love','再会、 よかったね。 ふたりとも、 ちょっと 大人の 顔に なった']],
 mc_ch3:[['proud','共同経営者！ business partner、 profit、 split… ビジネスの 英語も ばっちりだね'],['happy','卒業 おめでとう、 ミオさん。 お店が もっと にぎやかに なるね']],
 mc_ch4:[['love','…おめでとう。 「Will you marry me?」 いちばん まっすぐで、 いちばん 勇気の いる 英語だね'],['happy','婚約 おめでとう！ 結婚式、 先生も 呼んでね']],
 mc_ch5:[['love','結婚 おめでとう。 「I do.」…ふたりの 声、 浜辺じゅうに ひびいてたよ'],['happy','司会、 ちゃんと できたかな。 ふたりとも、 ずっと しあわせにね']],
 mc_alt:[['smile','ミオさん、 つよいね。 「bounce back」…ちゃんと 立ちなおれる 人の ことばだよ'],['think','いちばんの なかま って、 すてきな 関係だと 思う。 大事に してね']],
 mc_letter:[['smile','赤ペン、 おつかれさま。 まちがいに 気づけるのは、 自分も わかってる しょうこだよ'],['love','{n}通め の 返事、 ミオさん よろこぶね。 手紙の 英語は 気持ちが のこるから すてき']],
 mc_letterLast:[['love','さいごの 手紙… もうすぐ 帰ってくるね。 港まで むかえに 行って あげて'],['happy','手紙 ぜんぶ 読んだね！ つぎは 港で 「Welcome home!」']],
 mc_notes:[['smile','恋の 英語メモ。 甘い ことばも、 照れかくしも、 ぜんぶ 生きた 英語だよ'],['think','「stay over」とか 「Is that an invitation?」とか… ふふ、 大人の 英語も 勉強に なるね']],
 wd_mina:[['love','…わたし？ …ありがとう。 これからも、 となりで 英語を 教えさせてね'],['love','…ふふ。 ちゃんと 顔を 見て、 もう一回 言って？']],
 wd_mio:[['smile','…そっか。 ミオさんを えらんだんだね。 おめでとう。 先生は ずっと、 きみの 先生だよ'],['smile','ミオさん、 きっと 泣きながら 笑ってるね。 …しあわせにね']],
 lv_hiAlt:[['smile','きょうも 英語の 時間だよ。 先生は いつでも きみの 先生だからね'],['happy','来たね。 ミオさんは 元気？ さあ、 きょうも おしゃべり しよう'],['smile','ふたりの お店、 うまく いってる？ 先生、 ときどき のぞきに 行くからね']],
 lv_doneAlt:[['smile','きょうは ここまで。 ミオさんに よろしくね'],['happy','また あした。 宿題は… ミオさんと 英語で 話す こと！']],
 x_mioLetter:[['love','ミオさんから 手紙が とどいてるみたい。 赤ペン、 用意して！'],['smile','雪の 国から 手紙だよ。 まちがい さがし、 できるかな？']],
 x_mioRing:[['love','ミオさんと… 雑貨店の ガラスケースに、 星の 指輪が あったよ'],['think','共同経営者の つぎは… ふふ、 先生からは 言わないでおくね']],
 x_mioWife:[['happy','ミオさん、 けさ お店の 前で 鼻歌 うたってたよ。 しあわせそう'],['smile','ふたりの お店、 浜辺で いちばん にぎやかだね']],
 x_wedBye:[['smile','…ねえ。 ちょっとだけ、 話したい ことが あるの。 時間 ある？'],['smile','授業の あと、 少し いいかな']]});
if(window.MINA_SENSE&&MINA_SENSE._rules)MINA_SENSE._rules.push(
 ['x_mioLetter',4,()=>letterDue()?{}:null,()=>['✉️ 手紙を 読む',()=>MIOC.open()]],
 ['x_mioRing',2,()=>{const M=MR();return chap()===3&&M.n&&M.n.partner&&M.n.parents&&!ringOk()&&who()!=='mina'?{}:null},()=>['🏚️ 雑貨屋へ 行く',()=>ZAKKA.open()]],
 ['x_mioWife',1,()=>chap()===5?{}:null,()=>['💬 ミオと 話す',()=>MIOC.open()]],
 ['x_wedBye',4,()=>who()==='mio'&&(LV().st||0)>=1&&!LV().bye?{}:null,()=>['💗 ミナ先生と 話す',()=>LOVE.open(H.home)]]);

/* 「気になる ふたり」の 告白は、 ミナ先生を えらんだ あとは 出ない（かわりに 「言わない 気持ち」） */
{const h=MIO_TALKS.find(t=>t.id==='heart');if(h)h.if=()=>who()!=='mina'}

window.MIOL={chap,head,hi,block,bind,onEnd,noteHTML,ringOk,ringFor,lettersDone,letterDue,dayAfter,wedOk,letter,box,notes};
window.WED={who,ask,choose,romantic,say,byeTalk:()=>WED_MINA_BYE};
})();
