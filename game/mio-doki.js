/* ============================================================
   💓 ミオの ドキッと できごと（game/mio-doki.js）
   - お店: めったに 起きない ハプニング（海風・つまずく・しゃがむ）。 カウンターで ミオを タップした とき、
     その日 はじめての タップで 6%・前回から 21日 あける（年に 数回）。 見えた ものは 書かない・
     絵は スカートを おさえる てれ顔だけ・店長は 見ない／目を そらす／教えて あげる。
   - 2階: 「見られて はずかしい」（ねぐせ・顔パック・ひとりで 歌う・くまに 英語・肩に もたれて ねる）。
     2階に 来た とき 1日 1回 35%、 まだ 見ていない ものから。
   記録は localStorage hoshi_doki
   ============================================================ */
(()=>{
const H=HE,esc=H.esc,pickL=a=>a[Math.random()*a.length|0];
const sf=k=>{try{BEACH.sfx[k]&&BEACH.sfx[k]()}catch(e){}};
const speak=en=>{try{MIO.say(en)}catch(e){}};
const KEY='hoshi_doki';
const R=()=>{let r;try{r=JSON.parse(localStorage.getItem(KEY)||'{}')}catch(e){}r=r&&typeof r==='object'?r:{};r.seen=r.seen||{};return r};
const save=r=>{try{localStorage.setItem(KEY,JSON.stringify(r))}catch(e){}};
const today=()=>new Date().toDateString();
const stage=()=>{try{return MIOC.stage()}catch(e){return 0}};
/* ミナ先生を えらんだ あとは ミオの ドキッとは 出さない（game/doki.js と 同じ） */
const mioOk=()=>{try{if(MIOC.rec().alt)return false}catch(e){}try{return WED.who()!=='mina'}catch(e){return true}};
const say=(L,ex)=>`<div class="cgnagi shm" data-en="${esc(L[0])}"><span class="cgnf cgm">${MIO.face(ex||'smile','')}</span><div class="cgnb"><b>ミオ</b><p class="en">${esc(L[0])}</p><p class="ja">${esc(L[1])}</p></div></div>`;

/* ================================================================ お店 */
const SHOP_D=[
 {id:'d_wind',ico:'🌬️',t:'海風の いたずら',w:['gust of wind','突風（いきなり ふく 強い 風）'],l:[
  {n:'お店の 入口で ミオが 看板を ふいていると、 ビューッと 強い 海風が ふきこんだ。',p:'sweep'},
  {n:'スカートが ふわっと あおられて、 ミオは あわてて 両手で おさえた。',p:'hold',s:'whoosh'},
  {m:["Kyaa! This wind! …B-Boss, you didn't see anything, right?!","きゃっ！ この 風！ …て、 店長、 なにも 見てないよね？！"],ex:'oops',p:'hold',ch:[
   ["I was looking at the sea!","海を 見てたよ！",["…The sea. Right. The sea is very pretty today. …Thank you.","…海。 そうだよね。 きょうの 海、 きれいだもんね。 …ありがと。",'smile']],
   ["Strong wind today, huh.","きょうは 風が 強いね。",["Y-yes! A \"gust of wind\"! That means 突風… I'm wearing a long skirt tomorrow!","そ、 そう！ gust of wind！ 突風って 意味… あしたは ロングスカートに する！",'oops']]]}]},
 {id:'d_trip',ico:'📦',t:'ドテッ！',w:['trip over','つまずく（I tripped over the box. ＝ 箱に つまずいた）'],l:[
  {n:'ミオが カードの 箱を かかえて 歩いてきて… 床の でっぱりに つまずいた。 ドテッ！',p:'oops',s:'pop'},
  {n:'カードが ぱらぱら ちらばる。 ミオは まっ赤に なって、 スカートを おさえながら すわりこんでいる。',p:'hold'},
  {m:["Ow ow ow… W-wait, don't look!","いたた… ま、 まって、 見ないで！"],ex:'oops',p:'hold',ch:[
   ["I'm looking away!","あっち 向いてる！",["…OK, I'm up. Thank you. You're really kind, Boss.","…よし、 立てた。 ありがと。 店長って ほんとに やさしいね。",'smile']],
   ["Are you hurt? (pick up the cards)","けがは？（カードの ほうを 見て ひろう）",["I'm fine… Thanks for picking them up. And for… looking at the cards.","だいじょうぶ… ひろって くれて ありがと。 それと… カードの ほう 見てて くれて。",'smile']]]}]},
 {id:'d_crouch',ico:'🃏',t:'しゃがんだ ミオ',w:['Thank you for telling me.','教えて くれて ありがとう'],l:[
  {n:'ミオが 床に しゃがみこんで、 たなの 下に 落ちた カードを さがしている。',p:'stand'},
  {n:'…きょうの スカートは 短め。 ミオは ぜんぜん 気づいていない。'},
  {m:["Hmm… where did it go? It was right here…","うーん… どこ いったかな？ ここに あったのに…"],ex:'smile',ch:[
   ["Um, Mio… your skirt.","あの、 ミオ… スカート。",["…!! (stands up fast, face red) Th-thank you for telling me… I'll be careful.","…っ！！（まっ赤で ぱっと 立つ） お、 教えて くれて ありがと… 気をつける。",'oops']],
   ["I'll look for it. You stand up.","さがすよ。 ミオは 立ってて。",["Huh? Why…? …Ah. …AH! (holds her skirt) …Boss, you're so sweet.","え？ なんで…？ …あ。 …あっ！（スカートを おさえる） …店長って、 やさしい。",'oops']]]}]}];

/* カウンターで ミオを タップした とき: きょう 起こす？ */
function shopRoll(T){if(!mioOk()||!T||T.g||T.busy||(T.talk&&!T.talk.done))return false;
  try{if(window.HOURS&&!HOURS.isOpen('cg'))return false}catch(e){}
  const r=R(),d=today();if(r.day===d)return false;r.day=d;save(r);
  if(r.last&&Date.now()-r.last<21*864e5)return false;
  return Math.random()<.06}
function shop(T,box,force){const r=R(),fresh=SHOP_D.filter(e=>!r.seen[e.id]),E=force?SHOP_D.find(e=>e.id===force)||SHOP_D[0]:pickL(fresh.length?fresh:SHOP_D);
  r.last=Date.now();r.seen[E.id]=(r.seen[E.id]||0)+1;save(r);
  /* ミオは カウンターの 前に 出てくる。 その あいだ お客さんと ひとりごとは お休み */
  const m=T&&T.mio,y0=m?m.y:44,hush=()=>{if(!T)return;const t=Date.now()+60000;T.next=Math.max(T.next||0,t);if(T.mu)T.mu.next=Math.max(T.mu.next||0,t)};
  if(m){m.walk=null;m.y=70;m.x=Math.min(Math.max(m.x,100),128)}hush();
  const pose=(p,ms)=>{hush();if(p&&m){m.walk=null;m.pose=p;m.until=Date.now()+(ms||60000)}};
  run(E,box,{pose,done:()=>{pose('hold',2200);setTimeout(()=>{if(!m)return;m.pose='stand';m.until=0;m.y=y0;if(T){T.next=Date.now()+8000;if(T.mu)T.mu.next=Date.now()+5000}},2300)},where:'shop'})}

/* ================================================================ 2階 */
const HOME_D=[
 {id:'h_hair',ico:'💇',t:'ねぐせ 全開',when:'morning',w:['bed head','ねぐせ'],l:[
  {n:'朝。 2階に 上がると、 ミオが 洗面所から ちょうど 出てきた。 …髪が 大変な ことに なっている。'},
  {m:["Good morning, Bo— …WAIT. Don't look! My hair is a disaster!","おはよう、 てんちょ— …まって！ 見ないで！ 髪が 大変な ことに！"],ex:'oops',ch:[
   ["It's cute.","かわいいよ。",["C-cute?! This is \"bed head\"! …Give me five minutes!","か、 かわいい？！ これ bed head（ねぐせ）だよ！ …5分 ちょうだい！",'oops']],
   ["I'll wait downstairs.","下で まってるね。",["Thank you!! (door closes) …Bed head is ねぐせ. Remember the word, forget what you saw!","ありがと！！（バタン）…ねぐせは bed head。 ことばは 覚えて、 この すがたは わすれて！",'oops']]]}]},
 {id:'h_mask',ico:'🧖',t:'顔パックの まま',when:'free',w:['face mask','顔パック（sheet mask とも 言う）'],l:[
  {n:'ノックして ドアを あけると、 ミオが 白い 顔パックを したまま ふりむいた。'},
  {m:["Oh, welcome… (very calm voice)","あ、 いらっしゃい…（すごく おちついた 声）"],ex:'smile'},
  {m:["…Wait. My face. …AAAH! I forgot I'm wearing a face mask!","…まって。 顔。 …わあああ！ 顔パック してるの わすれてた！"],ex:'oops',ch:[
   ["You look like a ghost.","おばけ みたい。",["Rude! …But true. Give me ten minutes to become human again.","しつれいな！ …でも そのとおり。 10分で 人間に もどるから。",'oops']],
   ["Is it good for your skin?","はだに いいの？",["Very! It's a \"sheet mask.\" …But please don't tell anyone you saw me like this.","すごく！ sheet mask って いうの。 …でも この すがた、 だれにも 言わないでね。",'wink']]]}]},
 {id:'h_sing',ico:'🎤',t:'ひとりで ライブ',when:'free',w:['How long have you been 〜?','いつから 〜して いたの？（いままで つづいている ことを 聞く）'],l:[
  {n:'階段を 上がると、 ドアの 向こうから 大きな 歌声。 英語の 歌を ノリノリで 歌っている。'},
  {m:["♪ Baby, you're my sunshine~ Oh oh oh~ ♪","♪ ベイビー、 あなたは わたしの 太陽～ オー オー オー～ ♪"],ex:'laugh'},
  {n:'…目が 合った。 ミオの 動きが ぴたっと 止まる。'},
  {m:["…How long have you been standing there?","…いつから そこに いたの？"],ex:'oops',ch:[
   ["Since \"Baby\".","「ベイビー」から。",["From the BEGINNING?! …I practice English with songs. It's good for pronunciation! …That's my excuse.","最初から？！ …歌で 英語の 練習してるの。 発音に いいんだよ！ …って ことに しといて。",'oops']],
   ["Encore!","アンコール！",["No encore!! …Well, maybe one more. Just one. And you sing too!","アンコール なし！！ …まあ、 1曲だけ なら。 店長も 歌うんだよ！",'laugh']]]}]},
 {id:'h_bear',ico:'🧸',t:'くまさんと 英語',when:'free',w:['best friend','親友（いちばんの ともだち）'],l:[
  {n:'ドアが 少し あいている。 中から ミオの 小さな 声。'},
  {m:["You're my best friend, Mr. Bear. …Today the boss said \"good job\" to me. I was so happy…","Mr. Bear、 あなたは わたしの 親友だよ。 …きょうね、 店長が good job って 言って くれたの。 すごく うれしかった…"],ex:'smile'},
  {n:'くまの ぬいぐるみを ひざに のせて、 英語で 話しかけている。 …ミオが こっちに 気づいた。'},
  {m:["…! H-how much did you hear?!","…っ！ ど、 どこから 聞いてたの？！"],ex:'oops',ch:[
   ["Nothing! I just got here.","なにも！ いま 来た ところ。",["…Really? …Mr. Bear says you're a bad liar. But thank you.","…ほんと？ …Mr. Bear が 店長は うそが へたって 言ってる。 でも ありがと。",'smile']],
   ["Good job, Mio.","よく やったね、 ミオ。",["You heard EVERYTHING! …Mr. Bear, hide me. (hides her face in the bear)","ぜんぶ 聞いてた！ …Mr. Bear、 かくまって。（くまに 顔を うずめる）",'oops']]]}]},
 {id:'h_shoulder',ico:'💤',t:'肩に もたれて',when:'free',st:2,w:['fall asleep','ねむって しまう（I fell asleep. ＝ ねちゃった）'],l:[
  {n:'ミオと ならんで すわって、 単語帳を いっしょに 見ていた。 …しばらくして、 肩が ふっと 重く なる。'},
  {m:["…zzz… apple… banana… boss…","…zzz… apple… banana… てんちょ…"],ex:'sleepy'},
  {n:'ミオが 肩に もたれて ねている。 …5分後、 ミオが はっと 目を さました。'},
  {m:["…Huh? …HUH?! I fell asleep on your shoulder?! For how long?!","…え？ …ええ？！ 店長の 肩で ねちゃってた？！ どのくらい？！"],ex:'oops',ch:[
   ["Just a little.","ちょっとだけ。",["Just a little… OK. …Your shoulder was warm. W-wait, forget I said that!","ちょっとだけ… そっか。 …店長の 肩、 あったかかった。 ま、 まって、 いまの なし！",'oops']],
   ["You said \"boss\" in your sleep.","ねごとで 「てんちょ」って 言ってたよ。",["I did NOT! …Did I? …That's because I was studying the word \"boss\"! Yes!","言ってない！ …言った？ …それは boss って 単語を 勉強してたから！ そう！",'oops']]]}]}];
const homeList=s=>HOME_D.filter(e=>e.when===s&&(!e.st||stage()>=e.st));
/* 2階に 来た とき: きょう 起こす？（1日 1回） */
function homeRoll(s){const L=homeList(s);if(!L.length||!mioOk())return false;const r=R(),d=today();if(r.hday===d)return false;
  r.hday=d;save(r);return Math.random()<.35}
function home(s,box,force){const r=R(),L=homeList(s),pool=L.length?L:HOME_D,fresh=pool.filter(e=>!r.seen[e.id]),E=force?HOME_D.find(e=>e.id===force)||pool[0]:pickL(fresh.length?fresh:pool);
  r.seen[E.id]=(r.seen[E.id]||0)+1;save(r);
  const talk=()=>{try{MIOROOM.mioTalk({until:Date.now()+2600})}catch(e){}};
  run(E,box,{pose:()=>{},line:talk,where:'home'})}

/* ================================================================ 1つの できごとを 見せる（box の 中で） */
function run(E,box,o){if(!box)return;let i=0;const L=E.l.map(x=>({...x}));
  const bind=()=>box.querySelectorAll('[data-en]').forEach(x=>x.onclick=()=>speak(x.dataset.en));
  const head=`<p class="dkhd">${E.ico} ${esc(E.t)}</p>`;
  const draw=()=>{if(!box.isConnected)return;const l=L[i];if(!l)return end();
    if(l.p)o.pose(l.p);if(l.s)sf(l.s);
    if(l.ch){box.innerHTML=`<div class="dkbox">${head}${say(l.m,l.ex)}<div class="mhch">${l.ch.map((c,k)=>`<button data-k="${k}" class="sub">${esc(c[0])}<small>${esc(c[1])}</small></button>`).join('')}</div></div>`;
      speak(l.m[0]);o.line&&o.line();bind();
      box.querySelectorAll('[data-k]').forEach(b=>b.onclick=ev=>{ev.stopPropagation();sf('tap');const c=l.ch[+b.dataset.k];L.splice(i+1,0,{m:c[2],ex:c[3]||'smile',p:E.l[i].p});i++;draw()});return}
    box.innerHTML=`<div class="dkbox">${head}${l.n?`<p class="mhnar2">${esc(l.n)}</p>`:say(l.m,l.ex)}<div class="row"><button class="sub dknx">つぎへ ▶</button></div></div>`;
    if(l.m){speak(l.m[0]);o.line&&o.line()}bind();
    box.querySelector('.dknx').onclick=ev=>{ev.stopPropagation();sf('step');i++;draw()}};
  const end=()=>{sf('heart');let hh='';try{hh=MIOC.gain(1,'doki')||''}catch(e){}
    try{RECENT.add('doki',{ti:E.t,w:E.w[0]})}catch(e){}
    box.innerHTML=`<div class="dkbox">${head}<p class="dkw">📝 <b data-en="${esc(E.w[0])}">${esc(E.w[0])}</b> ＝ ${esc(E.w[1])}</p>${hh?`<p class="note">${hh}</p>`:''}<div class="row"><button class="sub dkok">とじる</button></div></div>`;bind();
    box.querySelector('.dkok').onclick=ev=>{ev.stopPropagation();sf('back');box.innerHTML=''};o.done&&o.done();
    mina(o.where==='shop'?'dk_shop':'dk_home',{w:E.w[0],t:E.t})};
  sf('pop');draw()}
function mina(k,v){try{if(window.MINA&&MINA.canAnnounce&&MINA.canAnnounce()&&Math.random()<.6){const [ex,tx]=MINA.line(k,v);if(tx)setTimeout(()=>MINA.say('m',ex,tx,6500),2500)}}catch(e){}}

/* ================================================================ ミナ先生 */
if(window.MINA_LINES){Object.assign(MINA_LINES,{
 dk_shop:[['think','ミオちゃん、 さっき 顔が まっ赤だったけど… なにか あった？ …ううん、 聞かないで おくね'],
  ['smile','「{w}」、 ちゃんと 覚えた？ はずかしい 場面の 英語って ふしぎと わすれないんだよね'],
  ['wink','相手が こまってる とき、 そっと 目を そらすのも やさしさだよ。 店長、 えらい']],
 dk_home:[['laugh','ミオちゃんの へやで なにか あったの？ 店長、 にやにや してるよ'],
  ['smile','「{w}」… 2階で 覚えた 英語？ 毎日の くらしの ことばは すぐ 使えるよ'],
  ['happy','見られて はずかしい すがたを 見せられるって、 それだけ なかよしって ことだよね']],
 r_doki:[['think','ミオちゃん、 「{t}」の こと 思い出して また 赤く なってたよ。 ふふ'],
  ['smile','「{t}」で 出てきた 「{w}」、 おぼえてる？ 思い出と いっしょだと 英語は のこるよ']]});
 try{(window.MINA_REACT_EXT=window.MINA_REACT_EXT||{}).doki={act:e=>['r_doki',{t:e.ti||'',w:e.w||''}],desc:e=>`ミオの ドキッと できごと（${e.ti||''}）`}}catch(e){}}

window.MIODOKI={shopRoll,shop,homeRoll,home,_SHOP:SHOP_D,_HOME:HOME_D};
})();
