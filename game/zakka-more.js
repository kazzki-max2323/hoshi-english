/* ながれぎ雑貨店の 品物を ふやす（2026-11）。 たなは 日替わり（game/zakka.js の today()）
   - ふつうの 品: 毎日 ちがう 6つが たなに ならぶ（絵はがき・おみくじ・フレーズ手帳・恋人むけの 品・とりおき中の 品は いつも ある）
   - rare:1 の 品: たまに（3日に 1回くらい）1つだけ「✨ きょうだけ」で ならぶ。 ノラさんとの 会話も とくべつ
   - プレゼントの 好み（しるし）と 大好きな 人は game/gift-data.js、 お礼の ことばは この ファイルの ZAKKA_THANKS */
ZAKKA_ITEMS.push(
 /* ---------- 📖 新しい 絵本 ---------- */
 {id:'b_turtle',k:'book',ico:'🐢',n:'絵本「とびたい カメ」',w:'picture book',title:"The Turtle Who Wanted to Fly",lv:'es',p:40,
  a:["A little turtle wants to fly like a bird. Can he do it? Read and see!","小さな カメが 鳥みたいに とびたいの。 できるかな？ 読んでみて！"],
  lines:[["A little turtle watched the birds every day.","小さな カメは 毎日 鳥を ながめていました。"],
   ["\"I want to fly, too,\" he said.","「ぼくも とびたいな」と カメは 言いました。"],
   ["He jumped from a rock. Splash! He fell into the sea.","カメは 岩から とびました。 バシャン！ 海に おちました。"],
   ["Then something wonderful happened.","すると すてきな ことが おこりました。"],
   ["In the water, he could swim fast and free.","水の 中では、 はやく 自由に およげたのです。"],
   ["\"I'm flying!\" he laughed. \"I'm flying in the sea!\"","「とんでる！」と カメは わらいました。 「海の 中を とんでるよ！」"],
   ["The birds looked down and said, \"Wow, cool!\"","鳥たちは 見おろして 「わあ、 かっこいい！」と 言いました。"]],
  words:[['fly','とぶ'],['jumped','とんだ（jump の 過去形）'],['fell','おちた（fall の 過去形）'],['wonderful','すてきな'],['free','自由に']]},
 {id:'b_castle',k:'book',ico:'🏰',n:'絵本「砂の お城の 町」',w:'picture book',title:"The Sandcastle Town",lv:'jh',p:60,
  a:["Kids build sandcastles on this beach every summer. This book is about them.","この 浜辺では 毎年 夏に 子どもたちが 砂の お城を 作るの。 これは その お話。"],
  lines:[["Every summer, the children built a sandcastle town on the beach.","毎年 夏に なると、 子どもたちは 浜辺に 砂の お城の 町を 作りました。"],
   ["There were towers, bridges, and even a tiny school.","塔や 橋、 そして 小さな 学校まで ありました。"],
   ["But every evening, the waves washed it away.","でも 毎日 夕方に なると、 波が それを あらいながして しまいました。"],
   ["\"Why do we build it if it disappears?\" asked the youngest boy.","「消えちゃうのに、 どうして 作るの？」と いちばん 小さな 男の子が ききました。"],
   ["The oldest girl thought for a moment.","いちばん 年上の 女の子は 少し 考えました。"],
   ["\"Because building it together is the fun part,\" she answered.","「いっしょに 作るのが たのしいからだよ」と 彼女は 答えました。"],
   ["The next morning, they started again, laughing louder than before.","つぎの 朝、 みんなは 前よりも 大きな 声で わらいながら、 また 作りはじめました。"]],
  words:[['even','〜まで・〜さえ'],['wash away','あらいながす'],['disappear','消える'],['the youngest','いちばん 年下の'],['louder than before','前よりも 大きな 声で']]},
 {id:'b_sound',k:'book',ico:'🐚',n:'絵本「音を 集める 女の子」',w:'storybook',title:"The Girl Who Collected Sounds",lv:'hs',p:80,
  a:["A quiet, beautiful story. Maybe a little sad, but warm.","しずかで きれいな お話。 ちょっと せつないけど、 あたたかいの。"],
  lines:[["Mio didn't collect stamps or shells. She collected sounds.","ミオは 切手も 貝がらも 集めなかった。 彼女が 集めていたのは 音だった。"],
   ["She kept them in a small recorder that she had been given on her tenth birthday.","10さいの 誕生日に もらった 小さな レコーダーに、 それらを しまっていた。"],
   ["The crackle of a campfire, the hush of falling snow, her grandmother's laugh.","たき火の パチパチいう 音、 雪が ふる しずけさ、 おばあちゃんの 笑い声。"],
   ["Years later, when her grandmother was no longer around, Mio pressed play.","何年も たって、 おばあちゃんが もう いなくなった あと、 ミオは 再生ボタンを おした。"],
   ["The laugh filled the room as if she had never left.","まるで 一度も いなくなって いないかのように、 笑い声が 部屋に ひろがった。"],
   ["Mio realized that some treasures can't be held in your hands.","手で もつ ことの できない 宝物も あるのだと、 ミオは 気づいた。"],
   ["They can only be kept in your heart, or in a little machine full of memories.","それは 心の 中か、 思い出の つまった 小さな 機械の 中にしか しまっておけないのだ。"]],
  words:[['collect','集める'],['had been given','もらっていた'],['no longer','もう〜ない'],['as if','まるで〜のように'],['realize','気づく']]},

 /* ---------- 🎁 新しい プレゼント（日替わりで ならぶ） ---------- */
 {id:'g_candy',k:'gift',ico:'🍬',n:'あめ玉の 小びん',w:'jar of candies',p:15,food:1,to:'sora',
  a:["A little jar of sea-salt candies. Sweet, with a tiny bit of salt.","海の 塩の あめ玉の 小びん。 あまくて、 ほんの ちょっと しょっぱいの。"]},
 {id:'g_ball',k:'gift',ico:'🎾',n:'テニスボール',w:'tennis ball',p:12,to:'pochi',
  a:["A bright yellow ball. It bounces very high. Dogs go crazy for it.","まっ黄色の ボール。 すごく 高く はねるの。 犬は これに むちゅうに なるわ。"]},
 {id:'g_lure',k:'gift',ico:'🎣',n:'つりの ルアー',w:'fishing lure',p:35,to:'gen',
  a:["A handmade lure that looks like a little silver fish. Fish can't say no to it.","小さな 銀色の 魚みたいな 手作りの ルアー。 魚は これに さからえないの。"]},
 {id:'g_kite',k:'gift',ico:'🪁',n:'鳥の たこ',w:'kite',p:45,to:'sora',colors:[['red','赤'],['blue','青'],['yellow','黄色']],
  a:["A kite shaped like a bird. On a windy day, it flies higher than the gulls.","鳥の 形の たこ。 風の 日には カモメより 高く とぶわ。"]},
 {id:'g_mug',k:'gift',ico:'☕',n:'波の マグカップ',w:'mug',p:30,to:'mina',colors:[['white','白'],['blue','青']],
  a:["A mug with little waves painted on it. Good for hot tea on a cold night.","小さな 波の 絵が かいてある マグカップ。 寒い 夜の あたたかい お茶に ぴったり。"]},
 {id:'g_bookmark',k:'gift',ico:'🔖',n:'おし花の しおり',w:'bookmark',p:20,to:'mina',
  a:["A bookmark with a real pressed flower inside. For someone who loves books.","本物の おし花が 入った しおり。 本が 好きな 人に。"]},
 {id:'g_candle',k:'gift',ico:'🕯️',n:'貝がらの キャンドル',w:'shell candle',p:35,to:'mina',
  a:["A candle made inside a seashell. When you light it, it smells like vanilla.","貝がらの 中で 作った キャンドル。 火を つけると バニラの かおりが するの。"]},
 {id:'g_frame',k:'gift',ico:'🖼️',n:'貝がらの フォトフレーム',w:'photo frame',p:55,to:'mina',
  a:["A photo frame covered with tiny shells. Put your favorite memory in it.","小さな 貝がらで かざった フォトフレーム。 いちばんの 思い出を 入れてね。"]},
 {id:'g_stickers',k:'gift',ico:'🦖',n:'恐竜の ステッカー',w:'sheet of stickers',p:8,to:'riku',
  a:["Stickers of dinosaurs, rockets, and sharks. Kids put them everywhere.","恐竜と ロケットと サメの ステッカー。 子どもは どこにでも はっちゃうの。"]},
 {id:'g_puzzle',k:'gift',ico:'🧩',n:'海賊船の パズル',w:'jigsaw puzzle',p:40,to:'riku',
  a:["A puzzle with a hundred pieces. When you finish it, you'll see a pirate ship.","100ピースの パズル。 できあがると 海賊船が あらわれるの。"]},
 {id:'g_harmonica',k:'gift',ico:'🎵',n:'ハーモニカ',w:'harmonica',p:70,to:'riku',
  a:["A little harmonica. Even beginners can play a happy song.","小さな ハーモニカ。 はじめてでも たのしい 曲が ふけるわ。"]},
 {id:'g_scarf',k:'gift',ico:'🧣',n:'手あみの マフラー',w:'scarf',p:50,to:'baba',colors:[['red','赤'],['green','緑'],['gray','グレー']],
  a:["A soft wool scarf. Someone in Scotland knitted it by hand.","やわらかい 毛糸の マフラー。 スコットランドの だれかが 手で あんだの。"]},
 {id:'g_tea',k:'gift',ico:'🍵',n:'がけの ハーブティー',w:'box of herbal tea',p:25,food:1,to:'baba',
  a:["Tea made from herbs that grow on the cliffs. It helps you sleep well.","がけに 生える ハーブの お茶。 よく ねむれるのよ。"]},
 {id:'g_syrup',k:'gift',ico:'🍓',n:'いちごシロップ',w:'bottle of strawberry syrup',p:30,food:1,to:'hana',
  a:["Homemade strawberry syrup. Pour it over shaved ice, and it's perfect.","手作りの いちごシロップ。 かき氷に かけたら かんぺき。"]},
 {id:'g_shades',k:'gift',ico:'🕶️',n:'サングラス',w:'pair of sunglasses',p:40,to:'gen',colors:[['black','黒'],['brown','茶色']],
  a:["Cool sunglasses for sunny days on the boat. They make anyone look like a movie star.","船の 上の 晴れた 日に ぴったりの サングラス。 だれでも 映画スターみたいに 見えるの。"]},
 {id:'g_bubbles',k:'gift',ico:'🫧',n:'シャボン玉セット',w:'bubble wand',p:10,to:'sora',
  a:["Blow gently, and rainbow bubbles fly over the sea.","そっと ふくと、 にじ色の シャボン玉が 海の 上を とんでいくの。"]},

 /* ---------- ✨ めずらしい 品（たまにしか 入らない。 rare:1） ---------- */
 {id:'r_globe',k:'gift',ico:'❄️',n:'灯台の スノードーム',w:'snow globe',p:300,to:'sora',rare:1,
  a:["A snow globe with a tiny lighthouse inside. Shake it, and it snows on the sea.","中に 小さな 灯台が ある スノードーム。 ふると 海に 雪が ふるの。"],
  r0:["It came from a toy maker in Germany. He only makes ten a year.","ドイツの おもちゃ職人から 来たの。 1年に 10こしか 作らないのよ。"]},
 {id:'r_musicbox',k:'gift',ico:'🎶',n:'木の オルゴール',w:'music box',p:500,to:'mina',rare:1,
  a:["A wooden music box from Switzerland. It plays \"Twinkle, Twinkle, Little Star.\"","スイスの 木の オルゴール。 「きらきら星」が ながれるの。"],
  r0:["The old man who made it passed his shop to his grandson. This is one of the last ones he made himself.","作った おじいさんは、 お店を まごに ゆずったの。 これは 彼が 自分で 作った さいごの ひとつ。"]},
 {id:'r_ship',k:'gift',ico:'⛵',n:'ボトルシップ',w:'ship in a bottle',p:450,to:'gen',rare:1,
  a:["A tiny sailing ship inside a bottle. An old sailor spent a whole winter making it.","びんの 中の 小さな 帆船。 年とった 船乗りが ひと冬 かけて 作ったの。"],
  r0:["Look at the sails. Each rope is thinner than a hair. I still don't know how he did it.","帆を 見て。 ロープ 1本 1本が かみの 毛より 細いの。 どうやって 作ったのか、 いまでも ふしぎ。"]},
 {id:'r_compass',k:'gift',ico:'🧭',n:'船長の コンパス',w:'compass',p:350,to:'riku',rare:1,
  a:["A real brass compass from an old ship. It always points north... well, almost always.","古い 船の 本物の 真ちゅうの コンパス。 いつも 北を さすの… まあ、 だいたいね。"],
  r0:["It traveled around the world twice before it came to me. Maybe it wants to go on another adventure.","わたしの ところに 来るまでに、 世界を 2周 したの。 また 冒険に 出たいのかも。"]},
 {id:'r_lamp',k:'gift',ico:'🏮',n:'ビーチグラスの ランプ',w:'sea glass lamp',p:600,to:'baba',rare:1,
  a:["A lamp made of sea glass. When it's on, the whole room looks like it's under the sea.","ビーチグラスで できた ランプ。 つけると 部屋 中が 海の 中みたいに なるの。"],
  r0:["I made it myself, from glass I found on this beach over ten years. I only make one when I have enough glass.","この 浜辺で 10年 かけて ひろった ガラスで、 わたしが 作ったの。 ガラスが たまった ときにしか 作れないのよ。"]},
 {id:'r_rainbow',k:'book',ico:'🌈',n:'幻の 絵本「にじの むこうの 島」',w:'storybook',title:"The Island Beyond the Rainbow",lv:'jh',p:250,rare:1,
  a:["This book was printed only once, a long time ago. It's very hard to find.","この 本は むかし 1回だけ 印刷されたの。 なかなか 見つからないのよ。"],
  r0:["I found this copy in a tiny bookstore in Lisbon. I may never see another one.","リスボンの 小さな 本屋さんで 見つけた 1さつ。 もう 二度と 出会えないかも。"],
  lines:[["Long ago, sailors said there was an island beyond the rainbow.","むかし、 船乗りたちは にじの むこうに 島が あると 言っていました。"],
   ["Nobody had ever reached it, because rainbows always move away.","だれも たどりついた ことは ありませんでした。 にじは いつも 遠ざかって いくからです。"],
   ["One day, a girl named Lila decided to try.","ある日、 リラと いう 女の子が ためしてみることに しました。"],
   ["She sailed toward the rainbow for seven days and seven nights.","彼女は 7日7晩、 にじに むかって 船を すすめました。"],
   ["On the eighth morning, the rainbow was gone, but an island was there.","8日目の 朝、 にじは 消えていましたが、 そこには 島が ありました。"],
   ["On the island, every flower was a different color of the rainbow.","島では、 どの 花も にじの ちがう 色を していました。"],
   ["Lila picked one of each and brought the rainbow home in a basket.","リラは 1つずつ つんで、 かごに 入れて にじを 家に もちかえりました。"]],
  words:[['beyond','〜の むこうに'],['reach','たどりつく'],['decide to','〜することに 決める'],['toward','〜に むかって'],['each','それぞれ・1つずつ']]},
);

/* めずらしい 品の 会話で おぼえる フレーズ */
Object.assign(ZAKKA_PHRASES,{
 onlyOne:["Is this the only one?","これ 1つだけですか？","めずらしい 品物か たしかめる とき"],
 restock:["When will you have more?","つぎは いつ 入りますか？","また 入るか きく とき"],
 lucky:["I'm lucky I came today.","きょう 来て よかった。","いい 品に 出会えた とき"],
});

/* 🎁 お礼の ことば（品物ごと）。 むかしの 1つだけの 形（ゲンじい・ポチ・ソラ）も 品物ごとの 形に そろえる */
['gen','pochi','sora'].forEach(k=>{const T=ZAKKA_THANKS[k];if(Array.isArray(T))ZAKKA_THANKS[k]={[{gen:'g_shirt',pochi:'g_bone',sora:'g_hat'}[k]]:T}});
Object.assign(ZAKKA_THANKS.mina,{
 g_mug:[["A mug with waves! I'll drink my morning tea from it every day.","波の マグカップ！ 毎朝 これで お茶を 飲むね。"],["It's so cute. Now studying at night will be even nicer.","すごく かわいい。 夜の 勉強が もっと たのしく なりそう。"]],
 g_bookmark:[["A real pressed flower... It's beautiful. I'll use it in my favorite book.","本物の おし花… きれい。 いちばん 好きな 本で つかうね。"],["Now every time I open a book, I'll think of you. Thank you.","これで 本を ひらくたびに あなたを 思い出すね。 ありがとう。"]],
 g_candle:[["It smells like vanilla! I'll light it when I read at night.","バニラの かおり！ 夜 本を 読む ときに つけるね。"],["A candle in a seashell. How romantic... I mean, how pretty!","貝がらの キャンドル。 ロマンチック… じゃなくて、 きれい！"]],
 g_frame:[["A shell frame! What photo should I put in it? ...Maybe one of us?","貝がらの フレーム！ どの 写真を 入れようかな？ …ふたりの 写真とか？"],["It's lovely. I'll put it on my desk where I can see it.","すてき。 いつも 見える 机の 上に おくね。"]],
 r_musicbox:[["A music box... \"Twinkle, Twinkle, Little Star.\" That was the first English song I ever learned.","オルゴール… 「きらきら星」。 わたしが はじめて おぼえた 英語の 歌なの。"],["I'm going to listen to this every night before I sleep. Thank you... really.","毎晩 ねる 前に これを 聞くね。 ありがとう… ほんとに。"]]});
Object.assign(ZAKKA_THANKS.gen,{
 g_lure:[["Oh ho! A silver lure! The fish won't know what hit them!","ほっほ！ 銀の ルアーか！ 魚どもは なにが おきたか わからんじゃろう！"],["This looks just like a real fish. Tomorrow, I'll catch a big one!","本物の 魚 そっくりじゃ。 あしたは 大物を つるぞ！"]],
 g_shades:[["Sunglasses! Do I look like a movie star now? Ho ho!","サングラス！ わし、 映画スターみたいかの？ ほっほ！"],["Now the sun won't bother me on the boat. Thank you, young one!","これで 船の 上でも まぶしく ないわい。 ありがとう、 わかいの！"]],
 r_ship:[["A ship in a bottle... This reminds me of my first boat. Thank you.","びんの 中の 船… わしの はじめての 船を 思い出すのう。 ありがとう。"],["My, my! I'll put this by the window, so it can see the sea.","おやおや！ 海が 見えるように、 窓辺に かざろう。"]]});
Object.assign(ZAKKA_THANKS.pochi,{
 g_ball:[["Woof! A ball! Throw it! Throw it! Again! Again!","ワン！ ボールだ！ なげて！ なげて！ もう一回！ もう一回！"],["Bounce, bounce! This is the best ball in the world!","ポーン、 ポーン！ 世界で いちばんの ボールだ！"]]});
Object.assign(ZAKKA_THANKS.sora,{
 g_candy:[["Candy! Can I eat one now? ...Just one. OK, two!","あめだ！ いま 1つ 食べても いい？ …1つだけ。 やっぱり 2つ！"],["Sweet and a little salty! It tastes like the sea!","あまくて ちょっと しょっぱい！ 海の 味が する！"]],
 g_kite:[["A bird kite! Let's fly it right now! The wind is perfect!","鳥の たこ！ いますぐ あげよう！ 風が ちょうど いいよ！"],["Look! It's flying higher than the birds!","見て！ 鳥より 高く とんでる！"]],
 g_bubbles:[["Bubbles! Look, look! A rainbow bubble!","シャボン玉！ 見て 見て！ にじ色の シャボン玉！"],["I'm going to make a hundred bubbles. Maybe a thousand!","100こ 作るんだ。 1000こかも！"]],
 r_globe:[["It's snowing on the lighthouse! Is it magic? It's magic, right?","灯台に 雪が ふってる！ まほう？ まほうだよね？"],["This is the best present ever. I'll keep it forever and ever.","いままでで いちばんの プレゼント。 ずーっと ずーっと 大事に する。"]]});
ZAKKA_THANKS.riku={
 g_stickers:[["Dinosaurs! Can I put one on my notebook? And my bag? And my forehead?","恐竜だ！ ノートに はっても いい？ かばんにも？ おでこにも？"],["T-rex is the best! Thank you, sensei!","ティラノサウルスが いちばん！ ありがとう、 せんせい！"]],
 g_puzzle:[["A pirate ship puzzle! Let's do it together, sensei!","海賊船の パズル！ いっしょに やろうよ、 せんせい！"],["A hundred pieces? Easy! ...Maybe not easy. But fun!","100ピース？ かんたん！ …かんたんじゃ ないかも。 でも たのしい！"]],
 g_harmonica:[["A harmonica! Listen! ...That was a song. Really!","ハーモニカだ！ 聞いて！ …いまの、 曲だよ。 ほんとだよ！"],["I'll practice every day and play a song for you, sensei!","毎日 練習して、 せんせいに 1曲 ふいて あげる！"]],
 r_compass:[["A real compass?! Now I can go on a real adventure!","本物の コンパス？！ これで 本物の 冒険に 行ける！"],["It's pointing at you, sensei! ...No, wait, that's north.","せんせいの ほうを さしてる！ …あ、 ちがう、 それが 北だ。"]]};
ZAKKA_THANKS.baba={
 g_scarf:[["Oh my, what a warm scarf. Thank you, dear. Winter will be easy now.","あらあら、 あったかい マフラーだねえ。 ありがとうね。 これで 冬も らくちんだよ。"],["Hand-knitted? I can tell. It's made with love.","手あみかい？ わかるよ。 心が こもってる。"]],
 g_tea:[["Herbal tea from the cliffs! Gen snores less when he drinks this. Ho ho.","がけの ハーブティー！ じいさんが これを 飲むと いびきが 少なく なるんだよ。 ほほ。"],["Thank you, dear. Come and have a cup with me sometime.","ありがとうね。 こんど いっしょに 1ぱい 飲みにおいで。"]],
 r_lamp:[["Sea glass... Oh my, it's like the bottom of the sea. I'm speechless.","ビーチグラス… まあ、 海の 底みたい。 ことばが 出ないよ。"],["I'll light it every night and wait for Gen to come home.","毎晩 これを つけて、 じいさんの 帰りを 待つよ。"]]};
ZAKKA_THANKS.hana={
 g_syrup:[["Homemade strawberry syrup?! Can I put it on the menu? \"Special Strawberry\"!","手作りの いちごシロップ？！ メニューに しても いい？ 「スペシャル いちご」！"],["Thank you! Your next shaved ice is free. Promise!","ありがとう！ つぎの かき氷は ただに するね。 約束！"]]};
