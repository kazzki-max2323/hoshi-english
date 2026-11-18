/* ⛏️ 単語の 鉱山の 道具・宝箱・できごと（しくみは game/mine.js）
   - 道具は ながれぎ雑貨店の 「⛏️ 鉱山」の たなで 英語で 買う（会話は game/zakka-goods-talk.js。 ZAKKA_GOODS.tool）。 1回 つかうと なくなる
     11/18 新しい 鉱山（5まい発掘・休憩所・たき火・トランシーバー）に あわせて 作りなおし:
     ほる とき（🎒）: lamp=宝石が 出やすい・まっくらを けす / mag=宝カードが 出やすい / guard=悪い できごとを 1回 ふせぐ / key=宝箱を かぎで あける
     休憩所（rest:1。 game/mine-rest.js）: wood=たき火で ❤が 2ばいの 速さ / batt=単語ラジオに 📖ブックの ことば・聞いた カード 3まいが 仕入れに / map=つぎの 階の 8まいから 5まい えらぶ
     お話（auto）: note=📜 お話の ボーナス 2ばい
   - 宝箱（📦）: ほっていると たまに 出る。 かぎ か 英語の 合言葉（いまの 5まいの 単語）で あける。 まちがえても 少しは 入っている（失敗なし）
   - 悪い できごと: 8m より 深いと たまに。 深いほど 少し ふえる。 もどされる・ほれない・まっくら・つめたい 風。 見つけた 物は 取られない
     どれも 英語の 札や さけび声つき（en / ja）
   うんちくは game/unchiku-data.js の 'to:'+id */
const MINE_TOOLS={
 lamp:{lv:'es',ico:'🔦',n:'ヘッドランプ',en:'headlamp',p:30,ef:'lamp',v:10,s:'ほる とき: 10問 宝石が 出やすい・まっくらを 明るく',
  d:["This is a headlamp. You wear it on your head, so both hands are free to dig!","これは ヘッドランプ。 頭に つけるから、 両手で ほれるのよ！"],
  q:["How long does it last?","どれくらい もつの？","About ten questions. Then the battery gets sleepy.","10問 くらいよ。 そのあと 電池が ねむくなるの。"],
  f:["Can I read in bed with it?","ベッドで 本を 読める？","Yes, but your mom will see the light!","読めるわ。 でも ママに 明かりで ばれちゃう！","Busted! Busted!"],
  e:["Turn it on in the dark. Good luck!","くらい ところで つけてね。 がんばって！"]},
 wood:{lv:'es',ico:'🪵',n:'たきぎ',en:'firewood',p:25,ef:'wood',v:1,rest:1,s:'休憩所: たき火に くべると ❤が 2ばいの 速さで もどる',
  d:["This is dry firewood. Put it on the campfire in the mine's rest area, and the fire gets big and warm.","これは かわいた たきぎ。 鉱山の 休憩所の たき火に くべると、 火が 大きく あたたかく なるの。"],
  q:["Why does a bigger fire help?","火が 大きいと なにが いいの？","You warm up faster, so your energy comes back twice as fast.","はやく あたたまるから、 元気が 2ばいの 速さで もどるのよ。"],
  f:["Can I roast marshmallows?","マシュマロ やける？","Of course! Just don't drop them on your cards.","もちろん！ カードの 上に 落とさないでね。","Sticky! Sticky!"],
  e:["Stay warm down there.","下で あたたかくしてね。"]},
 helmet:{lv:'es',ico:'⛑️',n:'ヘルメット',en:'helmet',p:40,ef:'guard',v:1,s:'ほる とき: 悪い できごとを 1回 ふせぐ',
  d:["This is a hard helmet. If rocks fall on you, it will protect your head.","これは かたい ヘルメット。 石が 落ちてきても、 頭を 守ってくれるの。"],
  q:["Does it protect me from everything?","なんでも 守ってくれる？","It stops one bad thing. After that, it's too dented to use again.","悪い ことを 1回 止めるの。 そのあとは へこんで もう 使えないわ。"],
  f:["Will it make me smarter?","かぶると 頭が よくなる？","It protects your head. Making it smarter is your job!","頭を 守るだけ。 かしこく するのは あなたの しごとよ！","Smart! Smart!"],
  e:["Safety first! Come back safe.","安全 第一！ ぶじに 帰ってきてね。"]},
 batt:{lv:'jh',ico:'🔋',n:'ラジオの 電池',en:'radio batteries',p:40,ef:'batt',v:3,rest:1,s:'休憩所: 単語ラジオで 📖ブックの ことばも 流れて、 聞いた カードが 3まい 仕入れに なる',
  d:["These are batteries for the little radio in the mine. With fresh batteries, it picks up the shop's channel too.","これは 鉱山の 小さな ラジオの 電池。 新しい 電池だと、 お店の チャンネルも 入るのよ。"],
  q:["What's on the shop's channel?","お店の チャンネルって なにが 流れるの？","Words from your card book. Listen to them, and Mio orders those cards for the shop.","あなたの カードブックの ことば。 聞いていると、 ミオちゃんが その カードを お店に 注文してくれるの。"],
  f:["Can I listen to music on it?","音楽も 聞ける？","Only words. It's a very serious radio.","ことばだけ。 とても まじめな ラジオなの。","Boring! Boring!"],
  e:["Listen well. Your shop is listening too.","よく 聞いてね。 お店も 聞いてるわ。"]},
 mag:{lv:'jh',ico:'🔍',n:'虫めがね',en:'magnifying glass',p:60,ef:'mag',v:10,s:'ほる とき: 10問 宝カードが 見つかりやすい',
  d:["This is a magnifying glass. It helps you notice small things, like cards hidden in the rocks.","これは 虫めがね。 岩に かくれた カードみたいな 小さな ものに 気づけるの。"],
  q:["Have you ever found anything with it?","これで なにか 見つけたこと ある？","Once I found Pip's lost feather under the shelf. He was so happy.","一度、 たなの 下で ピップの なくした 羽を 見つけたわ。 すごく よろこんでた。"],
  f:["Can I burn ants with it?","アリを やけちゃう？","No! Be kind to the ants. They work harder than all of us.","だめ！ アリには やさしくね。 わたしたちより よく はたらいてるのよ。","Poor ants! Poor ants!"],
  e:["Look closely. Treasure loves to hide.","よーく 見てね。 宝ものは かくれるのが 好きなの。"]},
 note:{lv:'jh',ico:'📒',n:'鉱夫の 手帳',en:"miner's notebook",p:50,ef:'note',v:1,auto:1,s:'📜 お話の ボーナスが 2ばい（お話の ときに 自動で つかう）',
  d:["This is an old miner's notebook. He wrote little stories about the words he found underground.","これは 古い 鉱夫の 手帳。 地下で 見つけた ことばの 小さな お話が 書いてあるの。"],
  q:["How does it help me?","どう 役に たつの？","When you read the story after digging five cards, the bonus doubles. Reading pays!","5まい ほったあとの お話を 読むと、 ボーナスが 2ばいに なるの。 読むって お得でしょ！"],
  f:["Is there a love story in it?","恋の お話も ある？","Page twelve. But I didn't read it. …Maybe I did.","12ページ。 でも 読んでないわ。 …ちょっとだけ 読んだかも。","Romance! Romance!"],
  x:["The last page says, \"Every word I dug up made me a little richer. Not in gold.\"","さいごの ページには 「ほりだした ことば ひとつひとつが 少しずつ わたしを ゆたかにした。 金では なくて」って。"],
  e:["Read the stories out loud. Miners like that.","お話は 声に 出して 読んでね。 鉱夫さんは それが 好きなの。"]},
 map:{lv:'hs',ico:'🗺️',n:'坑道の 地図',en:'tunnel map',p:70,ef:'map',v:1,rest:1,s:'休憩所: つぎの 階の 8まいの 中から ほる 5まいを えらべる',
  d:["This is a map of the tunnels. It shows which cards are sleeping in the rocks on the next floor.","これは 坑道の 地図。 つぎの 階の 岩に どんな カードが ねむっているか 書いてあるの。"],
  q:["Can I choose which cards to dig?","ほる カードを えらべるの？","Yes. The map shows eight. You pick the five you want to learn most.","ええ。 地図には 8まい。 いちばん おぼえたい 5まいを えらぶのよ。"],
  f:["Does it show where the snacks are?","おやつの 場所も のってる？","Sadly, no. Miners kept that secret.","ざんねん、 のってないわ。 鉱夫さんたちの ひみつよ。","Secret! Secret!"],
  x:["The map is drawn on the back of an old menu from Marco's grandfather's restaurant.","この 地図、 マルコさんの おじいさんの お店の 古い メニューの うらに かいてあるの。"],
  e:["Choose words you really want. That's the trick.","ほんとに おぼえたい ことばを えらんでね。 それが コツよ。"]},
 key:{lv:'hs',ico:'🗝️',n:'古い かぎ',en:'old key',p:80,ef:'key',v:1,s:'宝箱を かぎで あける（中身が ごうか）',
  d:["This is an old key. They say it opens any treasure chest in the mine, and the best things are always at the bottom.","これは 古い かぎ。 鉱山の どの 宝箱も あけられるって 言われてるの。 いい ものは いつも 底に あるのよ。"],
  q:["Why does one key open every chest?","どうして 1本で ぜんぶの 宝箱が あくの？","The miner who made those chests was lazy. He used the same lock for all of them!","宝箱を 作った 鉱夫さんが めんどくさがりで、 ぜんぶ 同じ かぎあなに したのよ！"],
  f:["Does it open the door to your secret room?","あなたの ひみつの 部屋の ドアも あく？","I don't have a secret room. …Pip, stop looking at me like that.","ひみつの 部屋なんて ないわ。 …ピップ、 そんな 目で 見ないで。","Secret! Secret!"],
  x:["I found it in a box of old tools. It was wrapped in a note that said, \"For someone who keeps digging.\"","古い 道具箱の 中で 見つけたの。 「ほりつづける 人へ」って 書いた 紙に つつんであったわ。"],
  e:["Use it on a chest. I'd love to hear what was inside.","宝箱に 使ってね。 中に なにが あったか 聞かせて。"]}};
/* 前の 道具（11/18 まで）: ロープ → たきぎ・方位磁石 → 鉱夫の 手帳・金の つるはし → 坑道の 地図 に かえる */
const MINE_TOOL_OLD={rope:'wood',comp:'note',gold:'map'};
setTimeout(function swapOld(){if(!window.MINE||!MINE.rec)return setTimeout(swapOld,2000);try{const T=MINE.rec().tools||{};let n=0;
  Object.keys(MINE_TOOL_OLD).forEach(o=>{if(T[o]>0){T[MINE_TOOL_OLD[o]]=(T[MINE_TOOL_OLD[o]]||0)+T[o];n+=T[o]}delete T[o]});
  if(n){CG.save();HE.toast(`⛏️ 鉱山の 道具が 新しく なったよ<small>前の 道具 ${n}こは 🪵たきぎ・📒手帳・🗺️地図 に かえたよ</small>`,4200)}}catch(e){}},5000);
if(typeof ZAKKA_GOODS!=='undefined')ZAKKA_GOODS.tool=MINE_TOOLS;

/* ふえた いい できごと（MINE_EVENT は game/shop-data.js） */
if(typeof MINE_EVENT!=='undefined')MINE_EVENT.push(
 {ico:'🧓',n:'鉱夫の おじいさん',t:'「Take this. You\'ll need it.」 おじいさんが 道具を くれた！',tool:1},
 {ico:'🐈‍⬛',n:'鉱山の ネコ',t:'ネコに ついていったら 近道を 見つけた！ 2m 進んだ',deep:2},
 {ico:'🍄',n:'光る キノコ',t:'あたりが ぼんやり 明るい。 しばらく 宝石が 出やすい',luck:5},
 {ico:'📜',n:'かべの 落書き',t:'「Never give up. — a miner」 （あきらめるな ― ある 鉱夫） むかしの 人の 英語！ +10枚',coin:10});

/* 悪い できごと（8m より 深いと たまに）。 back=もどる m / hard=正解しても ほれない 問題数 / dark=宝石が 出ない 問題数 / hp=体力（1より 下には しない）/ min=この 深さから */
const MINE_BAD=[
 {id:'rock',ico:'🪨',n:'落石',en:'Watch out! Falling rocks!',ja:'あぶない！ 落石だ！',t:'道が ふさがって 2m もどった',back:2},
 {id:'sign',ico:'🚧',n:'立入禁止の 札',en:'DANGER — KEEP OUT',ja:'きけん ― 立入禁止',t:'こわくなって 2m もどった',back:2},
 {id:'hard',ico:'🧱',n:'かたい 岩盤',en:'This rock is too hard!',ja:'この 岩、 かたすぎる！',t:'つぎの 3問は 正解しても ほれない',hard:3},
 {id:'bats',ico:'🦇',n:'コウモリの むれ',en:'Bats! Hundreds of them!',ja:'コウモリ！ 何百匹も！',t:'明かりが 消えて まっくら。 しばらく 宝石が 見つからない',dark:6},
 {id:'wind',ico:'💨',n:'つめたい 風',en:'Brr… It\'s freezing down here.',ja:'ぶるる… ここは こおりそう。',t:'体が ひえて ❤-6',hp:6},
 {id:'flood',ico:'🌊',n:'地下水が あふれた',en:'The water is rising! Go back!',ja:'水が ふえてる！ もどれ！',t:'水に おされて 3m もどった',back:3,min:20},
 {id:'rumble',ico:'🌋',n:'地ひびき',en:'The ground is shaking…',ja:'地面が ゆれている…',t:'ゆれが おさまるまで つぎの 2問は ほれない',hard:2,min:30}];

/* ミオの ひとこと（🎒 つかう の 画面。 英語は MIO.say で 読む） */
const MINE_MIO=[
 ["Boss, don't forget to eat! An empty stomach makes words hard to remember.","店長、 食べるのを わすれずに！ おなかが すくと 単語も おぼえにくいですよ。"],
 ["It's dark down there, right? A lamp makes everything shine — even the gems!","下は くらいでしょう？ ランプが あると ぜんぶ キラキラ。 宝石も！"],
 ["If you see a chest, try the password! The words you're practicing are the keys.","宝箱を 見つけたら 合言葉を ためして！ 練習している 単語が かぎなんです。"],
 ["Falling rocks? Bats? Don't worry, boss. Everything you found is still yours!","落石？ コウモリ？ だいじょうぶ、 店長。 見つけた 物は ぜんぶ 店長の ものです！"],
 ["Tired of these five cards? You can change them all at once. Fresh words, fresh start!","この 5まいに あきました？ いっぺんに 入れかえられますよ。 新しい 単語で 新しい スタート！"],
 ["A helmet looks good on you, boss. …I mean, it looks safe! Very safe!","ヘルメット、 にあってますよ 店長。 …あ、 安全そうって いみです！ とっても 安全！"],
 ["Got batteries for the radio? Then I can send words from our card book down to you!","ラジオの 電池、 もってます？ そしたら カードブックの ことばを 下まで 送れますよ！"],
 ["If you have firewood, put it on the fire at the rest area. I'll be warm just thinking about it.","たきぎが あったら 休憩所の たき火に くべてくださいね。 想像するだけで あったかい。"]];

/* ミナ先生の セリフ */
Object.assign(MINA_LINES,{
 mn_itemsNew:[['wow','鉱山が 新しく なったよ！ ほっている とちゅうに 🎒で 食べ物や 道具が つかえるの。 宝箱や、 ちょっと こまった できごとも あるから 気を つけてね'],['happy','おしらせ！ 鉱山の とちゅうで 🔀 5まいを ぜんぶ 入れかえたり、 🎒で 食べたり できるように なったよ']],
 mn_tools:[['smile','道具を もってるね。 ほっている とちゅうは 🎒から、 🪵🔋🗺️ は 休憩所で つかえるよ'],['point','⛑️ ヘルメットが あると、 落石や コウモリも こわくないよ'],['happy','📒 鉱夫の 手帳が あると、 お話の ボーナスが 2ばいに なるよ'],['think','🗺️ 坑道の 地図を 休憩所で ひらくと、 つぎの 階の カードを えらべるの']],
 mn_noTools:[['smile','雑貨屋の 「⛏️ 鉱山」の たなで 道具が 買えるよ。 英語で 買ってみてね'],['think','休憩所で 🪵 たきぎを くべると ❤が はやく もどるよ。 雑貨屋で 売ってるよ'],['point','🔋 ラジオの 電池が あると、 休憩所の ラジオで ブックの ことばを 聞いて 仕入れが できるよ']],
 mn_useFood:[['happy','{t}で 元気 回復！ 英語で "I feel much better!"'],['smile','{t}、 おいしかった？ ひとやすみしたら また ほろう']],
 mn_useTool:[['happy','{t}を つかったね！ 英語では {en} だよ'],['point','{en}（{t}）、 いい 道具だね。 つかい どころが うまい！']],
 mn_chest:[['wow','宝箱だ！ かぎあなに 英語が 書いてあるよ。 合言葉で あけてみよう'],['happy','📦 宝箱！ 合言葉は いま 練習している 5まいの 中に あるよ']],
 mn_chestKey:[['wow','かぎで あいた！ 底の ほうに いい ものが 入ってたね'],['proud','古い かぎ、 ぴったりだったね。 英語で "It fits!"（ぴったり！）']],
 mn_chestOk:[['proud','合言葉 正解！ 練習した 単語が かぎに なったね'],['happy','せいかい！ ことばで ひらく 宝箱、 すてきでしょ']],
 mn_chestMiss:[['smile','少しだけ あいたね。 合言葉は 「{w}」だったよ。 つぎは きっと あく！'],['think','おしい！ 「{w}」、 声に 出して おぼえよう。 中身は ちゃんと もらえたよ']],
 mn_bad:[['worry','{t}！ だいじょうぶ？ 見つけた 物は ぜんぶ ぶじだよ'],['think','深い ところは きびしいね。 でも ゆっくりで いいよ。 "Take it easy."'],['smile','こまった ときは ⛑️ ヘルメットが あると あんしんだよ']],
 mn_badGuard:[['proud','⛑️ ヘルメットで ふせいだね！ 英語で "Safety first!"'],['happy','ヘルメット、 役に たったね！']],
 mn_swap:[['happy','5まい 入れかえたね！ 新しい 単語は 和訳から はじめるよ'],['smile','新しい 5まいで 心機一転！ 英語で "a fresh start"']],
 mn_lowHp:[['worry','❤が へってきたよ。 🎒から 食べ物を 食べると 元気に なるよ'],['smile','つかれたら むりしないでね。 🎒で ひとやすみ']],
 zk_endTool:[['happy','{t}、 買えたね！ 鉱山で ほっている とちゅうに 🎒から つかってね'],['proud','{t}を 英語で 買えたね。 道具の 名前も 英語で 言えるかな？']],
 x_mnTool:[['smile','雑貨屋の 「⛏️ 鉱山」の たなが 新しく なったよ。 たきぎ・電池・地図は 休憩所で つかう 道具なの'],['think','鉱山で ❤が 足りなく なったら、 食べ物を 🎒に 入れておくと とちゅうで 食べられるよ']],
 mn_map:[['happy','地図に 8まい のってるよ。 いちばん おぼえたい 5まいを えらんでね'],['think','知らない ことばと、 知ってるけど 自信の ない ことばを まぜると いいよ'],['point','カードを タップすると 声が 聞けるよ。 気に なる 音の ことばを えらぶのも あり']],
 mn_note:[['proud','📒 鉱夫の 手帳で ボーナス 2ばい！ 読む ことは 宝さがし なんだね'],['smile','鉱夫さんの 手帳、 お話を 読む 人の 味方だね']]});
