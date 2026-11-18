/* ⛏️ 単語の 鉱山の 道具・宝箱・できごと（しくみは game/mine.js）
   - 道具は ながれぎ雑貨店の 「⛏️ 鉱山」の たなで 英語で 買う（会話は game/zakka-goods-talk.js。 ZAKKA_GOODS.tool）
     もちものに 入り、 ほっている とちゅうに 🎒 から つかう。 1回 つかうと なくなる
     ef: lamp=宝石が 出やすい / mag=宝石の ねだんが 1.5倍 / comp=宝箱と いい できごとが 出やすい（n問の あいだ）
         gold=正解で 2m ほれる（n問）/ guard=悪い できごとを 1回 ふせぐ / rope=すぐに n m 下りる / key=宝箱を かぎで あける（宝箱が 出た ときに つかう）
   - 宝箱（📦）: ほっていると たまに 出る。 かぎ か 英語の 合言葉（いまの 5まいの 単語）で あける。 まちがえても 少しは 入っている（失敗なし）
   - 悪い できごと: 8m より 深いと たまに。 深いほど 少し ふえる。 もどされる・ほれない・まっくら・つめたい 風。 見つけた 物は 取られない
     どれも 英語の 札や さけび声つき（en / ja）
   うんちくは game/unchiku-data.js の 'to:'+id */
const MINE_TOOLS={
 lamp:{lv:'es',ico:'🔦',n:'鉱山ランプ',en:'mining lamp',p:30,ef:'lamp',v:10,s:'10問 宝石が 出やすい',
  d:["This is a mining lamp. It is very bright. You can find more stones with it!","これは 鉱山ランプ。 とても 明るいの。 石が もっと 見つかるわよ！"],
  q:["How long does it last?","どれくらい もつの？","About ten questions. Then the light goes out.","10問 くらいよ。 そのあと 明かりが 消えるの。"],
  f:["Can I read in bed with it?","ベッドで 本を 読める？","Yes, but your mom will see the light!","読めるわ。 でも ママに 明かりで ばれちゃう！","Busted! Busted!"],
  e:["Turn it on in the dark. Good luck!","くらい ところで つけてね。 がんばって！"]},
 rope:{lv:'es',ico:'🪢',n:'ロープ',en:'rope',p:25,ef:'rope',v:4,s:'すぐに 4m 下りる',
  d:["This is a long rope. Tie it and go down fast!","これは 長い ロープ。 むすんで、 さっと 下りてね！"],
  q:["Is it strong?","じょうぶ？","Very strong! A big sailor used it on his ship.","とっても！ 大きな 船乗りさんが 船で 使ってたの。"],
  f:["Can I jump rope with it?","なわとび できる？","Ha ha! It's too long. You need ten friends!","あはは！ 長すぎるわ。 友だちが 10人 いるわね！","Jump! Jump!"],
  e:["Hold on tight!","しっかり つかまってね！"]},
 helmet:{lv:'jh',ico:'⛑️',n:'ヘルメット',en:'helmet',p:50,ef:'guard',v:1,s:'悪い できごとを 1回 ふせぐ',
  d:["This is a hard helmet. If rocks fall on you, it will protect your head.","これは かたい ヘルメット。 石が 落ちてきても、 頭を 守ってくれるの。"],
  q:["Does it protect me from everything?","なんでも 守ってくれる？","It stops one bad thing. After that, it's too dented to use again.","悪い ことを 1回 止めるの。 そのあとは へこんで もう 使えないわ。"],
  f:["Will it make me smarter?","かぶると 頭が よくなる？","It protects your head. Making it smarter is your job!","頭を 守るだけ。 かしこく するのは あなたの しごとよ！","Smart! Smart!"],
  e:["Safety first! Come back safe.","安全 第一！ ぶじに 帰ってきてね。"]},
 mag:{lv:'jh',ico:'🔍',n:'虫めがね',en:'magnifying glass',p:60,ef:'mag',v:10,s:'10問 宝石の ねだんが 1.5倍',
  d:["This is a magnifying glass. It helps you see how good a gem really is.","これは 虫めがね。 宝石の ほんとうの よさが 見えるの。 高く 売れるわよ。"],
  q:["Have you ever found anything with it?","これで なにか 見つけたこと ある？","Once I found Pip's lost feather under the shelf. He was so happy.","一度、 たなの 下で ピップの なくした 羽を 見つけたわ。 すごく よろこんでた。"],
  f:["Can I burn ants with it?","アリを やけちゃう？","No! Be kind to the ants. They work harder than all of us.","だめ！ アリには やさしくね。 わたしたちより よく はたらいてるのよ。","Poor ants! Poor ants!"],
  e:["Look closely. Treasure loves to hide.","よーく 見てね。 宝ものは かくれるのが 好きなの。"]},
 comp:{lv:'jh',ico:'🧭',n:'方位磁石',en:'compass',p:45,ef:'comp',v:10,s:'10問 宝箱が 見つかりやすい',
  d:["This is an old compass. People say it points to treasure, not north.","これは 古い 方位磁石。 北じゃなくて 宝ものを さすって いわれてるの。"],
  q:["Does it really point to treasure?","ほんとに 宝ものを さすの？","Well, it's never pointed north. So maybe!","そうねえ、 北を さしたことは 一度も ないの。 だから たぶん！"],
  f:["Can it find my homework?","宿題を 見つけてくれる？","If your homework were treasure, maybe. Ha ha!","宿題が 宝ものなら ね。 あはは！"],
  e:["Follow the needle. Let me know what you find!","はりに ついていってね。 なにを 見つけたか 教えてね！"]},
 key:{lv:'hs',ico:'🗝️',n:'古い かぎ',en:'old key',p:80,ef:'key',v:1,s:'宝箱を かぎで あける（中身が ごうか）',
  d:["This is an old key. They say it opens any treasure chest in the mine, and the best things are always at the bottom.","これは 古い かぎ。 鉱山の どの 宝箱も あけられるって 言われてるの。 いい ものは いつも 底に あるのよ。"],
  q:["Why does one key open every chest?","どうして 1本で ぜんぶの 宝箱が あくの？","The miner who made those chests was lazy. He used the same lock for all of them!","宝箱を 作った 鉱夫さんが めんどくさがりで、 ぜんぶ 同じ かぎあなに したのよ！"],
  f:["Does it open the door to your secret room?","あなたの ひみつの 部屋の ドアも あく？","I don't have a secret room. …Pip, stop looking at me like that.","ひみつの 部屋なんて ないわ。 …ピップ、 そんな 目で 見ないで。","Secret! Secret!"],
  x:["I found it in a box of old tools. It was wrapped in a note that said, \"For someone who keeps digging.\"","古い 道具箱の 中で 見つけたの。 「ほりつづける 人へ」って 書いた 紙に つつんであったわ。"],
  e:["Use it on a chest. I'd love to hear what was inside.","宝箱に 使ってね。 中に なにが あったか 聞かせて。"]},
 gold:{lv:'hs',ico:'⛏️',n:'金の つるはし',en:'golden pickaxe',p:120,ef:'gold',v:10,s:'10問 正解で 2m ほれる',
  d:["This is a golden pickaxe. It's sharp and light, so each swing digs twice as deep.","これは 金の つるはし。 するどくて かるいから、 ひとふりで 2倍 深く ほれるの。"],
  q:["Is it made of real gold?","ほんものの 金で できてるの？","Only the coating. Real gold would be too soft for digging, believe it or not.","表面だけよ。 信じられないかも しれないけど、 ほんものの 金だと やわらかすぎて ほれないの。"],
  f:["Can I sell it for a fortune?","売ったら 大金もち？","You'd be disappointed. But dig with it, and you might find a fortune.","がっかりするわよ。 でも これで ほれば、 大金が 見つかるかもね。","Gold! Gold!"],
  x:["A miner left it here years ago. He said he'd found what he was looking for, so he didn't need it anymore.","何年も 前に ある 鉱夫さんが ここに おいていったの。 さがしていた ものが 見つかったから、 もう いらないって。"],
  e:["Dig deep, but don't forget to come back up.","深く ほってね。 でも 上に もどるのを わすれないで。"]}};
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
 ["A helmet looks good on you, boss. …I mean, it looks safe! Very safe!","ヘルメット、 にあってますよ 店長。 …あ、 安全そうって いみです！ とっても 安全！"]];

/* ミナ先生の セリフ */
Object.assign(MINA_LINES,{
 mn_itemsNew:[['wow','鉱山が 新しく なったよ！ ほっている とちゅうに 🎒で 食べ物や 道具が つかえるの。 宝箱や、 ちょっと こまった できごとも あるから 気を つけてね'],['happy','おしらせ！ 鉱山の とちゅうで 🔀 5まいを ぜんぶ 入れかえたり、 🎒で 食べたり できるように なったよ']],
 mn_tools:[['smile','道具を もってるね。 ほっている とちゅうに 🎒から つかえるよ。 ランプは 宝石が 出やすく、 虫めがねは 宝石が 高く なるよ！'],['point','⛑️ ヘルメットが あると、 落石や コウモリも こわくないよ'],['happy','🗝️ かぎが あれば、 宝箱の 中身が ごうかに なるよ']],
 mn_noTools:[['smile','雑貨屋の 「⛏️ 鉱山」の たなで 道具が 買えるよ。 英語で 買ってみてね'],['think','深く ほりたい ときは 🪢 ロープや ⛏️ 金の つるはしが べんり。 雑貨屋で 売ってるよ']],
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
 x_mnTool:[['smile','雑貨屋に 「⛏️ 鉱山」の たなが できたよ。 ランプや ヘルメットで、 鉱山が もっと たのしく なるよ'],['think','鉱山で ❤が 足りなく なったら、 食べ物を 🎒に 入れておくと とちゅうで 食べられるよ']]});
