/* 🏠 ミオの 2階（11/22 カードショップ 作りなおし 第3弾）: ミオは お店の 2階で 暮らしている（20さいの 大学生・大人）
   - 2階を のぞく: 浜辺の 時計で ミオの ようすが かわる（9〜21時 お店 ／ 21〜24時 自分の へやで 英語の 勉強 ／ 0〜6時 ねている ／ 6〜9時 開店じゅんび）
   - 💬 話しかける（起きている とき）: 時間と 仲の よさで かわる ひとこと。 1日 1回 ♥
   - 🌙 となりの へやに 泊まる（21〜5時）: 夜中に できごと（ホラー・恋・おしゃべり・なにも ない夜）→ 朝 7時に なる
     恋の できごとは こいびと（MIOC.stage()>=5）で ミナ先生を えらんでいない ときだけ。 その前は 友だちとしての 夜
   - 単語の 作業台の じゃまは しない（ここに 来た ときだけ）
   記録は SHOP.rec().home = {st:泊まった 回数, seen:{id:1}, td:話した 日, last:さいごに 泊まった 日} */
(()=>{
const {S:ST,sfx:SFX}=BEACH;
const H=HE,esc=H.esc,$=id=>document.getElementById(id),pickL=a=>a[Math.random()*a.length|0];
const sf=k=>{try{SFX[k]&&SFX[k]()}catch(e){}};
const ML=(k,v)=>{try{return MINA.line(k,v||{})}catch(e){return ['smile','']}};
const gh=()=>{try{return GH()}catch(e){return new Date().getHours()}};
const HR=()=>{const S=SHOP.rec();if(!S.home||typeof S.home!=='object')S.home={st:0,seen:{}};S.home.seen=S.home.seen||{};return S.home};
const save=()=>CG.save();
const speak=en=>{try{MIO.say(en)}catch(e){}};
const stage=()=>{try{return MIOC.stage()}catch(e){return 0}};
const lover=()=>{try{const M=MIOC.rec();return stage()>=5&&!M.alt}catch(e){return false}};
/* いまの ミオ */
const state=()=>{const h=gh();return h>=9&&h<21?'shop':h>=21?'free':h<6?'sleep':'morning'};
const canStay=()=>{const h=gh();return h>=21||h<5};

/* ================================================================ 2階の へや（ドット絵 200x116） */
const W=200,HH=116;
const PR=(c,x,y,w,h,col)=>{c.fillStyle=col;c.fillRect(x,y,w,h)};
function room(c,s,f){const h=gh(),nt=h>=19||h<5,dusk=h>=17&&h<19,dark=s==='sleep';
  PR(c,0,0,W,HH,'#f3e6d0');PR(c,0,0,W,4,'#d8c4a4');for(let x=0;x<W;x+=16)PR(c,x,4,1,72,'#ead8bc');
  PR(c,0,76,W,40,'#b98a5a');for(let y=80;y<HH;y+=8)PR(c,0,y,W,1,'#a87a4c');
  /* まど（空は 時間で） */
  PR(c,84,14,40,30,'#8a6a4a');const sky=nt?'#1a2350':dusk?'#f0a070':'#9fd8ff';PR(c,86,16,36,26,sky);
  if(nt){for(const [sx,sy] of [[90,20],[101,24],[114,19],[118,30],[95,33]])if((f+sx)%5)PR(c,sx,sy,1,1,'#fff6c0');PR(c,110,22,5,5,'#fff3b0');PR(c,112,22,3,3,sky)}
  else{PR(c,86,34,36,8,'#4ab0e0');PR(c,92,20,8,3,'#fff')}
  PR(c,103,16,2,26,'#8a6a4a');PR(c,86,28,36,1,'#8a6a4a');PR(c,82,13,4,34,'#f6a5b5');PR(c,122,13,4,34,'#f6a5b5');
  /* つくえと ランプと 本 */
  PR(c,14,60,46,4,'#8a5a32');PR(c,16,64,3,14,'#7a4a28');PR(c,55,64,3,14,'#7a4a28');PR(c,20,54,6,6,'#5ab4ff');PR(c,26,55,5,5,'#ff8a7a');PR(c,31,53,4,7,'#ffd23f');
  PR(c,46,50,2,10,'#6a5a4a');PR(c,42,46,10,5,s==='free'?'#ffe08a':'#d8c49a');
  /* かべの カードと ポスター */
  PR(c,20,18,26,18,'#fff');PR(c,22,20,22,14,'#7ad0e8');PR(c,24,30,18,2,'#2a6fc0');PR(c,136,22,6,8,'#fff');PR(c,138,24,2,4,'#ff7a8a');PR(c,144,22,6,8,'#fff');PR(c,146,24,2,4,'#5ab4ff');PR(c,152,22,6,8,'#fff');PR(c,154,24,2,4,'#ffd23f');
  /* ベッド */
  PR(c,140,62,54,6,'#fff');PR(c,140,68,54,14,'#7ab4e8');PR(c,140,68,54,2,'#9ac8f0');PR(c,140,82,54,3,'#5a8ac0');PR(c,140,58,6,26,'#a87a4c');PR(c,190,62,4,22,'#a87a4c');
  PR(c,146,60,14,6,'#fffdf4');
  /* ラグと 植木 */
  PR(c,70,90,58,14,'#f0b8c8');PR(c,72,92,54,10,'#f8d0dc');PR(c,4,62,8,14,'#c07a4a');PR(c,2,52,12,10,'#5aa85a');PR(c,5,48,6,6,'#7ac87a');
  if(dark){c.fillStyle='rgba(10,14,40,.55)';c.fillRect(0,0,W,HH)}
  else if(nt&&s!=='shop'){const g=c.createRadialGradient(47,50,0,47,50,50);g.addColorStop(0,'rgba(255,214,140,.35)');g.addColorStop(1,'rgba(255,214,140,0)');c.fillStyle=g;c.fillRect(0,0,W,HH)}}
function mioIn(c,s,f){
  if(s==='free'){MIO.draw(c,30,30,f%40<30?'stand':'wave',f>>1);return}
  if(s==='morning'){MIO.draw(c,100,46,f%30<20?'stand':'cheer',f>>1);return}
  if(s==='sleep'){/* ねている: まくらの 上に 頭、 ふとんが ゆっくり 上下 */
    PR(c,147,58,10,8,'#a8663a');PR(c,149,61,7,5,'#ffe0cc');PR(c,151,63,2,1,'#3a2a2a');PR(c,154,63,2,1,'#3a2a2a');PR(c,145,56,3,3,'#ffd23f');
    const b=(f>>3)%2;PR(c,152,66-b,36,4,'#9ac8f0');c.fillStyle='#cfe3ff';c.font='6px monospace';c.fillText((f>>2)%3?'z':'Z',162,54-((f>>2)%3)*2);return}
  /* shop: つくえに メモ */
  PR(c,34,58,8,3,'#fffdf4');PR(c,35,59,5,1,'#5a5070')}

/* ================================================================ 画面 */
let anim=null;
function open(back){back=back||(()=>SHOP.open());const s=state(),M=HR();
  const st={shop:'ミオは 下の お店で レジに 立ってるよ。 へやは からっぽ（つくえに メモが ある）',free:'ミオは つくえで 英語の 勉強中',sleep:'しーっ… ミオは ぐっすり ねてる',morning:'ミオは 開店の じゅんび中'}[s];
  const talked=M.td===CG.today();
  H.show('cg',`<section class="pnl cgp shp mhp">
    <div class="qtop"><button class="x" id="mhx" aria-label="もどる">←</button><b>🏠 2階（ミオの へや）</b><span class="qn">${pad(gh())}</span></div>
    <div class="shstage"><canvas id="mhcv" width="${W}" height="${HH}"></canvas></div>
    <p class="shst">${st}</p>
    <div id="mhbox"></div>
    <div class="row mhbtn">${s==='free'||s==='morning'?`<button id="mhtalk">💬 話しかける${talked?'':'<i class="dot"></i>'}</button>`:''}${s==='shop'?'<button id="mhnote" class="sub">📝 メモを 見る</button>':''}${canStay()?`<button id="mhstay">🌙 となりの へやに 泊まる</button>`:''}</div>
    ${canStay()?'':'<p class="note">🌙 夜 9時から 朝 5時までは となりの へやに 泊まれるよ</p>'}
  </section>`);
  $('mhx').onclick=()=>{sf('back');stop();back()};
  const cv=$('mhcv'),c=cv.getContext('2d');c.imageSmoothingEnabled=false;let f=0,last=0;stop();
  const a=anim={on:true};const tick=now=>{if(!a.on||!cv.isConnected)return;requestAnimationFrame(tick);if(now-last<160)return;last=now;f++;const s2=state();room(c,s2,f);mioIn(c,s2,f)};requestAnimationFrame(tick);
  if($('mhtalk'))$('mhtalk').onclick=()=>{sf('step');talk(s,back)};
  if($('mhnote'))$('mhnote').onclick=()=>{sf('flip');const n=pickL(NOTES);box(`<div class="mhnote"><p class="en">${esc(n[0])}</p><p class="ja">${esc(n[1])}</p><small>– Mio</small></div>`);speak(n[0])};
  if($('mhstay'))$('mhstay').onclick=()=>{sf('step');stop();stay(back)};
  if(s==='sleep')mina('mh_sleep',.4);else if(!M.seen.v){M.seen.v=1;save();mina('mh_new',1)}}
const pad=h=>`${String(Math.floor(h)).padStart(2,'0')}:${String(Math.floor((h%1)*60)).padStart(2,'0')}`;
const stop=()=>{if(anim)anim.on=false};
const box=html=>{const b=$('mhbox');if(b){b.innerHTML=html;b.querySelectorAll('[data-en]').forEach(x=>x.onclick=()=>speak(x.dataset.en))}};
const say=(L,ex='smile',pose='')=>`<div class="cgnagi shm" data-en="${esc(L[0])}"><span class="cgnf cgm">${MIO.face(ex,pose)}</span><div class="cgnb"><b>ミオ</b><p class="en">${esc(L[0])}</p><p class="ja">${esc(L[1])}</p></div></div>`;
const tier=()=>lover()?'love':stage()>=2?'close':'friend';

/* 💬 話しかける */
function talk(s,back){const T=TALK[s==='morning'?'morning':'free'],pool=T[tier()]||T.friend,x=pickL(pool);
  box(`${say(x.m,'smile','wave')}<div class="mhch">${x.o.map((o,i)=>`<button data-i="${i}" class="sub">${esc(o[0])}<small>${esc(o[1])}</small></button>`).join('')}</div>`);speak(x.m[0]);
  $('mhbox').querySelectorAll('[data-i]').forEach(b=>b.onclick=()=>{const o=x.o[+b.dataset.i];sf('tap');const M=HR();let hh='';
    if(M.td!==CG.today()){M.td=CG.today();save();try{hh=MIOC.gain(1,'home')||''}catch(e){}}
    box(`${say(o[2],o[3]||'laugh','')}${hh?`<p class="note">${hh}</p>`:''}`);speak(o[2][0]);
    const d=H.panel.querySelector('#mhtalk .dot');if(d)d.remove()})}

/* 🌙 泊まる → 夜の できごと → 朝 7時 */
function stay(back){const M=HR(),gn=pickL(NIGHT_HI[tier()]);
  H.show('cg',`<section class="pnl cgp shp mhp mhnight" data-stay>
    <div class="qtop"><span></span><b>🌙 おやすみ</b><span class="qn"></span></div>
    ${say(gn,'sleepy','')}
    <p class="note">となりの 小さな へやの ふとんで ねる…</p>
    <button id="mhgo" class="big">💤 ねる</button></section>`);speak(gn[0]);
  $('mhgo').onclick=()=>{sf('step');night(back)}}
function pickNight(){const M=HR(),t=tier(),seen=M.seen,r=Math.random();
  const pools=[[LOVE_N,t==='love'?.45:0],[HORROR_N,.3],[FRIEND_N,t==='love'?.1:.45],[QUIET_N,.15]];
  let tot=pools.reduce((a,p)=>a+p[1],0),x=r*tot,pool=QUIET_N;for(const [p,w] of pools){if(x<w){pool=p;break}x-=w}
  const fresh=pool.filter(e=>!seen[e.id]);return pickL(fresh.length?fresh:pool)}
function night(back){const E=pickNight(),M=HR();let i=0;
  const draw=()=>{const L=E.l[i];
    if(!L)return morning(E,back);
    if(L.ch){H.show('cg',`<section class="pnl cgp shp mhp mhnight" data-stay><div class="qtop"><span></span><b>${E.ico} ${esc(E.t)}</b><span class="qn"></span></div>
        ${say(L.m,L.ex||'smile','')}<div class="mhch">${L.ch.map((o,k)=>`<button data-k="${k}" class="sub">${esc(o[0])}<small>${esc(o[1])}</small></button>`).join('')}</div></section>`);speak(L.m[0]);
      H.panel.querySelectorAll('[data-k]').forEach(b=>b.onclick=()=>{sf('tap');const o=L.ch[+b.dataset.k];E.l.splice(i+1,0,{m:o[2],ex:o[3]||'smile'});i++;draw()});return}
    H.show('cg',`<section class="pnl cgp shp mhp mhnight" data-stay><div class="qtop"><span></span><b>${E.ico} ${esc(E.t)}</b><span class="qn"></span></div>
      ${L.n?`<p class="mhnar">${esc(L.n)}</p>`:say(L.m,L.ex||'smile','')}<button id="mhnx" class="big">つぎへ ▶</button></section>`);
    if(L.m)speak(L.m[0]);if(L.s)sf(L.s);
    $('mhnx').onclick=()=>{sf('step');i++;draw()}};
  E.l=E.l.map(x=>({...x}));M.seen[E.id]=1;M.st=(M.st||0)+1;M.last=CG.today();save();draw()}
function morning(E,back){/* 朝 7時に なる（日を またいだら 日づけを すすめる） */
  try{const g=ST.gameMin||0;if(g>=7*60)ST.gday=(ST.gday||0)+1;ST.gameMin=7*60;H.head&&H.head()}catch(e){}
  const L=pickL(MORNING[tier()]);let hh='';try{hh=MIOC.gain(E.k==='love'?2:1,'stay')||''}catch(e){}
  try{RECENT.add('stay',{ti:E.t,kind:E.k})}catch(e){}
  H.show('cg',`<section class="pnl cgp shp mhp"><div class="qtop"><span></span><b>☀️ おはよう</b><span class="qn">07:00</span></div>
    ${say(L,'laugh','wave')}${hh?`<p class="note">${hh}</p>`:''}<button id="mhok" class="big">🃏 お店へ（9時 開店）</button></section>`);speak(L[0]);sf('chime');
  $('mhok').onclick=()=>{sf('step');back()};
  mina(E.k==='horror'?'mh_afterHorror':E.k==='love'?'mh_afterLove':'mh_after',.6)}
function mina(k,p){try{if(window.MINA&&MINA.canAnnounce&&MINA.canAnnounce()&&Math.random()<p){const [ex,tx]=ML(k);if(tx)setTimeout(()=>MINA.say('m',ex,tx,6500),1500)}}catch(e){}}

/* ================================================================ ことば */
const NOTES=[["I'm at the register! Snacks are in the second drawer. Help yourself.","レジに いまーす！ おやつは 2番目の 引き出し。 どうぞ。"],
 ["Today's word: \"cozy\" = いごこちが いい. My room is cozy, right?","きょうの ことば: cozy ＝ いごこちが いい。 わたしの へや、 cozy でしょ？"],
 ["Don't read my diary! …Just kidding. I don't have one.","日記は 読まないでね！ …うそ。 日記なんて ないです。"],
 ["Water the plant, please! Its name is Leafy.","植木に 水を おねがい！ 名前は リーフィーです。"]];
const TALK={
 free:{friend:[{m:["Oh, boss! I'm doing my English homework. Do you know the word \"tidy\"?","あ、 店長！ 英語の 宿題ちゅう。 tidy って ことば、 知ってます？"],o:[["It means きれいに 片づいた.","きれいに 片づいた って 意味。",["Right! Like my room… sort of. Ha ha.","正解！ わたしの へやみたいに… たぶん。 あはは。"]],["I don't know.","わからない。",["Me neither! Let's look it up together. …Ah, きれいに 片づいた!","わたしも！ いっしょに しらべよう。 …あ、 きれいに 片づいた！",'oops']]]},
   {m:["Welcome to my room! It's small, but I love it.","わたしの へやへ ようこそ！ せまいけど、 大好きなんです。"],o:[["It's cozy.","いごこちが いいね。",["Cozy! That's the perfect word. Thank you!","cozy！ ぴったりの ことば。 ありがとう！"]],["Nice posters!","ポスター いいね！",["That's the sea in Hawaii. Someday I'll go there!","ハワイの 海なんです。 いつか 行くんだ！"]]]}],
  close:[{m:["You came up again. …I'm happy. My room feels warmer.","また 来てくれた。 …うれしい。 へやが あったかく 感じます。"],o:[["I like talking with you.","ミオと 話すの、 好きだよ。",["…Me too. A lot.","…わたしも。 すごく。",'wink']],["What are you studying?","なに 勉強してるの？",["Phrasal verbs. \"Look forward to\"… I look forward to tomorrow!","句動詞です。 look forward to… あしたが たのしみ！"]]]}],
  love:[{m:["There you are. I saved you a seat. …Right here, next to me.","来た来た。 席、 とっておきました。 …ここ、 となり。"],o:[["Thanks.","ありがとう。",["Let's study together. If I get sleepy, I'll lean on you, OK?","いっしょに 勉強しよう。 ねむくなったら もたれても いい？",'wink']],["You look cute tonight.","今夜の ミオ、 かわいい。",["W-what? Don't say that so suddenly! …Say it again later.","な、 なに？ いきなり 言わないで！ …あとで もう一回 言って。",'oops']]]}]},
 morning:{friend:[{m:["Good morning! I'm getting ready to open. Want some toast?","おはようございます！ 開店じゅんび中。 トースト 食べます？"],o:[["Yes, please!","おねがい！",["Butter or jam? …Both! Of course.","バター？ ジャム？ …両方！ もちろん。",'laugh']],["I'm OK, thanks.","だいじょうぶ、 ありがとう。",["Then I'll eat two. Ha ha!","じゃあ わたしが 2まい 食べちゃお。 あはは！",'laugh']]]}],
  close:[{m:["Morning! I did my hair three times today. …No reason.","おはよう！ きょう 3回 髪を やりなおしたんです。 …理由は ないです。"],o:[["It looks nice.","にあってるよ。",["Really? Then it was worth it!","ほんと？ じゃあ やりなおした かいが あった！",'laugh']],["Big day?","大事な 日？",["Every day is a big day at Shiosai!","しおさいでは 毎日が 大事な 日です！"]]]}],
  love:[{m:["Good morning, sleepyhead. I made coffee for two.","おはよう、 おねぼうさん。 コーヒー、 ふたり分 いれたよ。"],o:[["You're the best.","ミオ、 最高。",["I know. …Just kidding. Drink it before it gets cold.","知ってる。 …なんてね。 さめないうちに どうぞ。",'wink']],["Good morning, Mio.","おはよう、 ミオ。",["Saying good morning to you is my favorite part of the day.","店長に おはようって 言うのが、 1日で いちばん 好きな 時間。",'smile']]]}]}};
const NIGHT_HI={friend:[["Good night, boss! The futon in the next room is all yours.","おやすみなさい、 店長！ となりの へやの ふとん、 どうぞ。"],["Sleep well! If you hear strange sounds… it's just the wind. Probably.","よく ねてね！ へんな 音が しても… 風です。 たぶん。"]],
 close:[["Good night. …It's kind of nice, having you next door.","おやすみなさい。 …となりに いてくれるの、 ちょっと いいですね。"]],
 love:[["Good night. The wall is thin, so… knock twice if you can't sleep.","おやすみ。 かべ うすいから… ねむれなかったら 2回 ノックしてね。"]]};
const MORNING={friend:[["Good morning! Did you sleep well? Breakfast is toast and sea salt eggs!","おはよう！ よく ねむれた？ 朝ごはんは トーストと 塩たまご！"],["Morning, boss! Let's open the shop together today.","おはよう、 店長！ きょうも いっしょに お店を あけましょう。"]],
 close:[["Good morning. Your hair is a mess. …It's cute.","おはよう。 髪、 ぼさぼさ。 …かわいいけど。"]],
 love:[["Good morning. Waking up and seeing you… I could get used to this.","おはよう。 起きて 店長が いるの… なれちゃいそう。"]]};
/* 夜の できごと: l = [{m:[en,ja],ex} | {n:'ナレーション'} | {m,ch:[[en,ja,[返事en,ja],ex]]}] */
const HORROR_N=[
 {id:'h_bell',k:'horror',ico:'🔔',t:'夜中の ベル',l:[{n:'夜中の 2時。 下の お店から 「チリン」と ドアの ベルの 音…',s:'knock'},{m:["Boss… did you hear that? The bell. The shop is closed…","店長… いまの 聞こえた？ ベル。 お店、 閉まってるのに…"],ex:'oops'},
  {m:["Let's go down together. Don't let go of my sleeve, OK?","いっしょに 下りよう。 わたしの そで、 はなさないでね？"],ex:'oops',ch:[["I'll go first.","先に 行くよ。",["…Thank you. You're braver than you look.","…ありがとう。 見た目より ゆうかんですね。"]],["Hold my hand.","手を つなごう。",["O-OK. Just for safety. Only for safety!","う、 うん。 安全のため。 あくまで 安全のため！",'oops']]]},
  {n:'お店は まっくら。 ドアは しまっている。 でも カウンターの 上に… 見たことの ない カードが 1まい。'},{m:["This card says \"Thank you for the good shop.\" …Who left it?","カードに 「いい お店を ありがとう」って。 …だれが 置いたの？"],ex:'oops'},{m:["Maybe a ghost who likes cards. A polite ghost. That's not scary… right?","カード好きの おばけかも。 礼儀ただしい おばけ。 こわく… ないよね？"],ex:'smile'}]},
 {id:'h_steps',k:'horror',ico:'👣',t:'階段の 足音',l:[{n:'ぎし… ぎし… 階段を だれかが のぼってくる 音。 ミオの へやの ドアが ひらいた。'},{m:["Boss? Are you awake? Someone is walking on the stairs… and it's not you.","店長？ 起きてる？ 階段を だれか 歩いてる… 店長じゃ ないよね。"],ex:'oops'},
  {m:["Wait. Listen. One, two… it stopped on the seventh step. The old step that squeaks.","まって。 聞いて。 いち、 に… 7段目で 止まった。 きしむ 古い 段。"],ex:'oops',ch:[["Who's there?","だれ？",["…No answer. Only the waves. Brrr.","…返事なし。 波の 音だけ。 ぶるぶる。",'oops']],["It's just the old house.","古い 家だからだよ。",["You're right. Wood moves at night. …I'll sleep with the light on, though.","そうですね。 夜は 木が 動くから。 …でも 電気 つけて ねます。",'smile']]]},
  {n:'朝、 7段目には 小さな 砂の 足あと。 海の ほうへ つづいていた。'}]},
 {id:'h_radio',k:'horror',ico:'📻',t:'ひとりでに つく ラジオ',l:[{n:'夜中の 3時。 下の レコードプレーヤーが ひとりでに まわりはじめた。'},{m:["The record player… I turned it off. I'm sure!","レコードプレーヤー… ちゃんと 止めたのに。 ぜったい！"],ex:'oops'},
  {m:["The song is… an old English song. \"Goodnight, sweetheart.\" Who's playing it?","曲は… 古い 英語の 歌。 「Goodnight, sweetheart」。 だれが かけたの？"],ex:'oops',ch:[["Let's turn it off.","止めよう。",["…It stopped by itself, right when you touched it. OK, bed. Now.","…さわった とたん 止まった。 はい、 ねよう。 いますぐ。",'oops']],["Let's listen.","聞いてみよう。",["It's a pretty song, actually. Maybe someone just wanted to dance.","じつは きれいな 歌。 だれか おどりたかっただけ かもね。",'smile']]]}]},
 {id:'h_mirror',k:'horror',ico:'🪞',t:'かがみの 中の 文字',l:[{n:'のどが かわいて 起きた。 洗面所の かがみが くもっていて、 英語の 文字が うかんでいる…'},{m:["Boss? What are you looking at? …\"See you soon.\" Did you write that?","店長？ なに 見てるの？ …「See you soon.」 店長が 書いた？"],ex:'oops'},
  {m:["Not me either. …\"See you soon\" means また すぐ 会おう. Soon?! How soon?!","わたしも ちがう。 …See you soon は 「また すぐ 会おう」。 すぐ？！ どのくらい すぐ？！"],ex:'oops',ch:[["Maybe it's a friendly ghost.","やさしい おばけかも。",["A friendly ghost who studies English… We have so much in common.","英語を 勉強してる やさしい おばけ… わたしと 気が 合いそう。",'smile']],["Let's wipe it off.","ふいちゃおう。",["Good idea! …Huh? It says \"Thank you\" now. I'm going back to bed!","いい考え！ …え？ こんどは 「Thank you」って。 ねる！ もう ねる！",'oops']]]}]}];
const LOVE_N=[
 {id:'l_roof',k:'love',ico:'🌌',t:'屋根の 上の 星',l:[{n:'コン、 コン。 かべを 2回 ノックする 音。'},{m:["Are you awake? I can't sleep. Want to see the stars from the roof?","起きてる？ ねむれなくて。 屋根から 星、 見ない？"],ex:'wink'},{n:'まどから 屋根に 出ると、 浜辺の 空いっぱいの 星。'},
  {m:["In English, a falling star is \"a shooting star.\" If we see one… what will you wish for?","流れ星は 英語で shooting star。 見えたら… なにを ねがう？"],ex:'smile',ch:[["To be with you.","ミオと いっしょに いられますように。",["…You can't say that out loud! Then it won't come true. …But I'll wish for the same thing.","…声に 出したら かなわないよ！ …でも わたしも 同じこと ねがう。",'oops']],["It's a secret.","ひみつ。",["Then mine is a secret too. …But I think they're the same.","じゃあ わたしも ひみつ。 …でも たぶん 同じだと 思う。",'wink']]]}]},
 {id:'l_tea',k:'love',ico:'🍵',t:'夜中の お茶',l:[{n:'台所に 明かり。 ミオが パジャマに カーディガンで お湯を わかしていた。'},{m:["Oh, you're up too? I'm making chamomile tea. It helps you sleep.","店長も 起きちゃった？ カモミールティー いれてるの。 よく ねむれるんだって。"],ex:'smile'},
  {m:["Can I tell you something? Sometimes I'm scared the shop will close someday. But when you're here, I'm not scared.","ねえ、 言っても いい？ いつか お店が なくなったらって こわくなる ときが ある。 でも 店長が いると こわくない。"],ex:'smile',ch:[["I'll always be here.","ずっと いるよ。",["…Promise? Pinky promise. In English, \"pinky swear.\"","…約束？ ゆびきり。 英語だと pinky swear。",'wink']],["We'll protect it together.","いっしょに 守ろう。",["Together. That's my favorite English word now.","together。 いま いちばん 好きな 英語。",'laugh']]]}]},
 {id:'l_sleepwalk',k:'love',ico:'🌙',t:'ねぼけた ミオ',l:[{n:'ドアが そっと ひらいて、 ねぼけた ミオが まくらを かかえて 立っていた。'},{m:["…Mm? Where's the register… Thank you for coming… zzz","…んー？ レジ どこ… ありがとうございましたー… zzz"],ex:'sleepy'},
  {m:["…Huh?! Boss?! Why am I in your room?! I— I was sleepwalking! Forget everything!","…え？！ 店長？！ なんで 店長の へやに？！ ね、 ねぼけてたの！ ぜんぶ わすれて！"],ex:'oops',ch:[["You said \"Thank you\" in your sleep.","ねごとで Thank you って 言ってたよ。",["Even in my dreams I'm working… Good night!! (door closes)","夢の 中でも はたらいてる… おやすみ！！（バタン）",'oops']],["Good night, Mio.","おやすみ、 ミオ。",["…Good night. And, um… thank you for not laughing.","…おやすみ。 それと… わらわないで くれて ありがとう。",'smile']]]}]},
 {id:'l_letter',k:'love',ico:'💌',t:'ドアの すきまの 手紙',l:[{n:'ねる前、 ドアの すきまから 小さな 紙が すっと 入ってきた。'},{m:["(on the paper) \"I'm glad you're next door tonight. Sweet dreams. – M\"","（紙に）「今夜 となりに いてくれて うれしい。 いい夢を。 – M」"],ex:'wink'},
  {m:["(through the wall) …Did you read it? Don't answer! I'll die of embarrassment.","（かべの 向こうから）…読んだ？ 返事しないで！ はずかしくて しんじゃう。"],ex:'oops',ch:[["Sweet dreams, Mio.","いい夢を、 ミオ。",["…(a little laugh through the wall) Sweet dreams.","…（かべの 向こうで 小さく わらう）いい夢を。",'smile']],["Knock twice.","2回 ノックする。",["(knock, knock) …I'll keep this paper forever. No, wait, you keep it.","（コン、 コン）…この 紙 ずっと とっておく。 あ、 ちがう、 店長が もってて。",'laugh']]]}]}];
const FRIEND_N=[
 {id:'f_snack',k:'friend',ico:'🍪',t:'夜中の おやつ',l:[{n:'夜中に 台所で ゴソゴソ… ミオが クッキーの 箱を もっていた。'},{m:["Ah! You caught me. This is a \"midnight snack.\" Want one?","あっ！ 見つかった。 これは midnight snack（夜食）。 1こ いる？"],ex:'oops'},
  {m:["It's our secret, OK? Nora-san says cookies at night are \"dangerous.\"","ふたりの ひみつね？ ノラさんが 夜の クッキーは キケンだって。"],ex:'wink',ch:[["Our secret.","ひみつだね。",["Partners in crime! …That means 共犯者. Ha ha.","partners in crime！ …共犯者って 意味。 あはは。",'laugh']],["Just one.","1こだけ。",["Just one… OK, two. Two is still \"just a few.\"","1こだけ… じゃあ 2こ。 2こは まだ 「ちょっと」だよね。",'laugh']]]}]},
 {id:'f_study',k:'friend',ico:'📚',t:'夜ふかしの 宿題',l:[{n:'となりの へやから ぶつぶつ 英語が 聞こえる。'},{m:["\"I have been… I had been… I would have been…\" Aaah, my head!","「I have been… I had been… I would have been…」 あー、 頭が！"],ex:'oops'},
  {m:["Boss, can you help? Which is right: \"I have lived here for a year\" or \"I live here for a year\"?","店長、 たすけて。 どっちが 正しい？ I have lived here for a year か I live here for a year か。"],ex:'oops',ch:[["\"I have lived here\".","I have lived here。",["Yes! Since a year ago until now… have lived! Thank you, teacher!","そう！ 1年前から いままで… have lived！ ありがとう、 先生！",'laugh']],["Let's think together.","いっしょに 考えよう。",["From a year ago… to now. A line from then to now. …have lived! We did it!","1年前から… いままで。 むかしから いまに つづく 線。 …have lived！ できた！",'laugh']]]}]},
 {id:'f_storm',k:'friend',ico:'⛈️',t:'嵐の 夜',l:[{n:'外は 強い 風。 まどが ガタガタ ゆれる。',s:'knock'},{m:["Boss… are you awake? The wind is so loud. Can I sit here for a bit?","店長… 起きてる？ 風が すごくて。 ちょっと ここに いても いい？"],ex:'oops'},
  {m:["In English we say \"It's raining cats and dogs.\" Cats and dogs! Why?!","英語で It's raining cats and dogs（どしゃぶり）って 言うの。 ねこと 犬！ なんで？！"],ex:'smile',ch:[["Funny English.","おもしろい 英語だね。",["Right? Thinking about cats and dogs, I'm not scared anymore. Thanks!","でしょ？ ねこと 犬の こと 考えてたら こわく なくなった。 ありがとう！",'laugh']],["Stay until it stops.","やむまで いていいよ。",["…Thank you. You're a good boss. And a good… friend.","…ありがとう。 いい 店長。 それに いい… ともだち。",'smile']]]}]}];
const QUIET_N=[{id:'q_waves',k:'quiet',ico:'🌊',t:'しずかな 夜',l:[{n:'波の 音だけが 聞こえる、 しずかな 夜。 となりの へやから 小さな ねいき。'},{n:'ぐっすり ねむった。'}]},
 {id:'q_moon',k:'quiet',ico:'🌕',t:'月の 明かり',l:[{n:'まどから 月の 光。 浜辺が 銀色に 光っている。'},{n:'いつのまにか ねむっていた。'}]}];

/* ================================================================ ミナ先生 */
Object.assign(MINA_LINES,{
 mh_new:[['wow','ミオちゃん、 お店の 2階で 暮らしてるんだって！ 夜は つくえで 英語の 勉強してるみたい'],['smile','2階は ミオちゃんの へや。 夜 9時からは となりの へやに 泊まれるよ。 夜中に なにか 起きるかも…']],
 mh_sleep:[['think','しーっ。 ミオちゃん ねてるね。 起こさないように そっと もどろう'],['smile','ねている 人を 見たら 英語で "Sweet dreams."（いい夢を）']],
 mh_after:[['happy','泊まったんだね。 ミオちゃんと 夜の おしゃべり、 たのしかった？'],['smile','お泊まり おつかれさま。 夜に 覚えた 英語は よく のこるんだよ']],
 mh_afterHorror:[['think','夜中に ふしぎな こと… こわかった？ でも ミオちゃんと いっしょなら だいじょうぶ'],['smile','"See you soon." ＝ また すぐ 会おう。 おばけも 英語を 勉強してるのかな']],
 mh_afterLove:[['smile','…なんだか しあわせそうな 顔してるね。 先生は なにも 聞かないでおくね'],['happy','すてきな 夜だった みたいだね。 英語の あまい ことば、 ちゃんと 覚えておいてね']],
 r_stay:[['smile','きのうは ミオちゃんの ところに 泊まったんだね。 「{t}」… どんな 夜だった？'],['happy','お泊まりの 夜の 話、 こんど 先生にも 聞かせてね']]});
try{(window.MINA_REACT_EXT=window.MINA_REACT_EXT||{}).stay={act:e=>['r_stay',{t:e.ti||''},['🏠 2階へ',()=>{CG.open();setTimeout(()=>open(),60)}]],desc:e=>`ミオの 2階に 泊まった（${e.ti||''}）`}}catch(e){}

window.MIOHOME={open,state,canStay,rec:HR};
})();
