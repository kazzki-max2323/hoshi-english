/* 🏠 浜辺の 家 の データ（しくみは game/house.js）
   HOUSE_LV: 家の 大きさ（コインで 建てる・広げる）。 slots = おける 場所
   HOUSE_SLOTS: へやの 中の 場所 [x%, y%, 大きさ(へやの はばに たいして), z]
   HOUSE_ITEMS: 家具。 slot・ico・n（日本語）・en（英語）・p（コイン）・ph:[英語の 文, 日本語]
     wall / floor / rug は 色（c）で かく。 gift: 遊びに 来た 人が くれる（買えない）
   HOUSE_VISIT: 遊びに 来た ときの 会話（mio-chat.js の 形。 はじまりは a。 s は house.js が 家具を 見て つくる）
     lv:[英語,日本語] = こいびと（ミオ）・恋の とちゅう（ミナ先生）の ときの セリフ。 答えの o[5] も おなじ */

const HOUSE_LV=[
 {n:'売り地',ico:'🪧',p:0},
 {n:'小さな 小屋',ico:'🛖',p:2000,en:'a little hut',d:'ベッドと 本だなが おける 小さな 家'},
 {n:'テラスつきの 家',ico:'🏡',p:6000,en:'a house with a deck',d:'へやが 広く なって ペットと 窓べの かざりが おける'},
 {n:'2かいだての 家',ico:'🏠',p:15000,en:'a two-story house',d:'屋根うら べやで 星を 見る 道具が おける'}];

const HOUSE_SLOTS={
 pic:[23,22,.11,2,1],clock:[79,18,.075,2,1],bed:[17,62,.21,3,1],shelf:[85,52,.16,3,1],table:[52,70,.12,4,1],chair:[36,74,.1,4,1],
 lamp:[69,60,.1,3,1],plant:[7,80,.11,5,1],music:[91,81,.1,5,1],
 pet:[30,88,.09,6,2],sill:[50,33,.06,2,2],
 loft:[12,22,.1,2,3]};
const HOUSE_SLOT_N={wall:'かべがみ',floor:'ゆか',rug:'ラグ',pic:'かべの かざり',clock:'時計',bed:'ベッド・ソファ',shelf:'たな',table:'つくえの 上',chair:'いす',lamp:'あかり',plant:'植物',music:'楽器・音楽',pet:'ペット',sill:'窓べ',loft:'屋根うら'};

const HOUSE_ITEMS=[
 /* かべがみ・ゆか・ラグ */
 {id:'w_white',slot:'wall',ico:'⬜',n:'白い かべ',en:'a white wall',p:0,c:'#f4efe4',ph:["The walls are white.","かべは 白です。"]},
 {id:'w_sky',slot:'wall',ico:'🟦',n:'空色の かべがみ',en:'sky-blue wallpaper',p:300,c:'#bfe3f2',ph:["I painted my room sky blue.","へやを 空色に ぬりました。"]},
 {id:'w_pink',slot:'wall',ico:'🟪',n:'さくら色の かべがみ',en:'pink wallpaper',p:300,c:'#f6d3dc',ph:["Pink makes me feel calm.","ピンクは 気持ちが おちつく。"]},
 {id:'w_wood',slot:'wall',ico:'🟫',n:'木の 板の かべ',en:'wooden walls',p:500,c:'#c89a68',stripe:1,ph:["The wooden walls smell nice.","木の かべは いい においが する。"]},
 {id:'w_star',slot:'wall',ico:'🌌',n:'星空の かべがみ',en:'starry wallpaper',p:800,c:'#2c3466',stars:1,ph:["My room looks like the night sky.","へやが 夜空 みたい。"]},
 {id:'fl_wood',slot:'floor',ico:'🪵',n:'木の ゆか',en:'a wooden floor',p:0,c:'#a8743e',ph:["The floor is made of wood.","ゆかは 木で できている。"]},
 {id:'fl_tatami',slot:'floor',ico:'🟩',n:'たたみ',en:'tatami mats',p:500,c:'#c9c27a',tatami:1,ph:["Please take off your shoes.","くつを ぬいで ください。"]},
 {id:'fl_tile',slot:'floor',ico:'⬛',n:'白黒の タイル',en:'checkered tiles',p:600,c:'#e8e4dc',check:1,ph:["The floor is black and white.","ゆかは 白と 黒。"]},
 {id:'fl_sand',slot:'floor',ico:'🟨',n:'砂色の じゅうたん',en:'sand-colored carpet',p:300,c:'#e2c99a',ph:["The carpet is soft and warm.","じゅうたんは やわらかくて あたたかい。"]},
 {id:'rg_red',slot:'rug',ico:'🔴',n:'赤い まるい ラグ',en:'a round red rug',p:250,c:'#d0505a',ph:["The cat sleeps on the rug.","ねこは ラグの 上で ねる。"]},
 {id:'rg_blue',slot:'rug',ico:'🔵',n:'海色の ラグ',en:'a sea-blue rug',p:250,c:'#3f7fb5',ph:["This rug looks like the sea.","この ラグは 海 みたい。"]},
 {id:'rg_rainbow',slot:'rug',ico:'🌈',n:'にじ色の ラグ',en:'a rainbow rug',p:600,c:'rainbow',ph:["What a colorful rug!","なんて カラフルな ラグ！"]},
 /* 家具 */
 {id:'f_bed',slot:'bed',ico:'🛏️',n:'ベッド',en:'a bed',p:300,ph:["I go to bed at ten.","10時に ねます。"]},
 {id:'f_sofa',slot:'bed',ico:'🛋️',n:'ソファ',en:'a sofa',p:600,ph:["Have a seat on the sofa.","ソファに おかけ ください。"]},
 {id:'f_chair',slot:'chair',ico:'🪑',n:'いす',en:'a chair',p:150,ph:["Can I sit on this chair?","この いすに すわっても いい？"]},
 {id:'f_book',slot:'shelf',ico:'📚',n:'本だな',en:'a bookshelf',p:500,ph:["My bookshelf is full of English books.","本だなは 英語の 本で いっぱい。"]},
 {id:'f_teddy',slot:'shelf',ico:'🧸',n:'ぬいぐるみ',en:'a teddy bear',p:400,ph:["I've had this teddy bear since I was a baby.","赤ちゃんの ころから この クマが いる。"]},
 {id:'f_shells',slot:'shelf',ico:'🐚',n:'貝がらの コレクション',en:'a shell collection',p:700,ph:["I found these shells on the beach.","浜辺で 見つけた 貝がら。"]},
 {id:'f_trophy',slot:'shelf',ico:'🏆',n:'トロフィー',en:'a trophy',p:1500,ph:["I won first prize!","1位を とった！"]},
 {id:'f_desk',slot:'table',ico:'📖',n:'つくえと ノート',en:'a desk and a notebook',p:300,ph:["I study English at my desk.","つくえで 英語を 勉強する。"]},
 {id:'f_pc',slot:'table',ico:'💻',n:'パソコン',en:'a laptop',p:1200,ph:["I write emails in English.","英語で メールを 書く。"]},
 {id:'f_chess',slot:'table',ico:'♟️',n:'チェス',en:'a chess set',p:700,ph:["Do you want to play chess?","チェス しない？"]},
 {id:'f_tea',slot:'table',ico:'🫖',n:'ティーセット',en:'a tea set',p:500,ph:["Would you like some tea?","お茶は いかが？"]},
 {id:'f_candle',slot:'lamp',ico:'🕯️',n:'キャンドル',en:'a candle',p:200,ph:["Let's light a candle.","キャンドルに 火を つけよう。"]},
 {id:'f_lamp',slot:'lamp',ico:'🪔',n:'オイルランプ',en:'an oil lamp',p:600,ph:["The lamp makes the room warm.","ランプで へやが あたたかく なる。"]},
 {id:'f_lantern',slot:'lamp',ico:'🏮',n:'ちょうちん',en:'a paper lantern',p:500,ph:["The lantern glows red.","ちょうちんが 赤く 光る。"]},
 {id:'f_plant',slot:'plant',ico:'🪴',n:'観葉植物',en:'a potted plant',p:200,ph:["I water my plant every morning.","毎朝 植物に 水を やる。"]},
 {id:'f_sun',slot:'plant',ico:'🌻',n:'ひまわり',en:'a sunflower',p:250,ph:["The sunflower faces the window.","ひまわりが 窓の ほうを むいてる。"]},
 {id:'f_bamboo',slot:'plant',ico:'🎋',n:'ささかざり',en:'a bamboo branch',p:300,ph:["I wrote my wish on a paper strip.","たんざくに ねがいを 書いた。"]},
 {id:'f_radio',slot:'music',ico:'📻',n:'古い ラジオ',en:'an old radio',p:300,ph:["Let's listen to the radio.","ラジオを きこう。"]},
 {id:'f_guitar',slot:'music',ico:'🎸',n:'ギター',en:'a guitar',p:800,ph:["Can you play the guitar?","ギター ひける？"]},
 {id:'f_violin',slot:'music',ico:'🎻',n:'バイオリン',en:'a violin',p:1200,ph:["She plays the violin beautifully.","彼女は バイオリンを きれいに ひく。"]},
 {id:'f_piano',slot:'music',ico:'🎹',n:'ピアノ',en:'a piano',p:2500,ph:["I practice the piano every day.","毎日 ピアノを 練習する。"]},
 {id:'f_sea',slot:'pic',ico:'🖼️',n:'海の 絵',en:'a painting of the sea',p:400,ph:["Who painted this picture?","この 絵は だれが かいたの？"]},
 {id:'f_map',slot:'pic',ico:'🗺️',n:'世界地図',en:'a world map',p:500,ph:["I want to travel around the world.","世界中を 旅したい。"]},
 {id:'f_cal',slot:'pic',ico:'📅',n:'カレンダー',en:'a calendar',p:150,ph:["What's the date today?","きょうは 何日？"]},
 {id:'f_alarm',slot:'clock',ico:'⏰',n:'目ざまし時計',en:'an alarm clock',p:200,ph:["My alarm clock rings at seven.","目ざましは 7時に なる。"]},
 {id:'f_clock',slot:'clock',ico:'🕰️',n:'ふりこ時計',en:'a grandfather clock',p:900,ph:["The old clock goes tick-tock.","古い 時計が チクタク いう。"]},
 {id:'p_cat',slot:'pet',ico:'🐈',n:'ねこ',en:'a cat',p:1500,ph:["My cat loves to sleep in the sun.","うちの ねこは ひなたで ねるのが 好き。"]},
 {id:'p_dog',slot:'pet',ico:'🐕',n:'いぬ',en:'a dog',p:1500,ph:["I walk my dog on the beach.","浜辺で いぬの さんぽを する。"]},
 {id:'p_fish',slot:'pet',ico:'🐠',n:'金魚ばち',en:'a fish bowl',p:600,ph:["Don't forget to feed the fish.","魚に えさを あげるのを わすれないで。"]},
 {id:'p_turtle',slot:'pet',ico:'🐢',n:'カメ',en:'a turtle',p:800,ph:["Turtles live for a long time.","カメは 長生き。"]},
 {id:'s_flower',slot:'sill',ico:'💐',n:'花たば',en:'a bunch of flowers',p:300,ph:["These flowers smell sweet.","この 花は あまい においが する。"]},
 {id:'s_bottle',slot:'sill',ico:'🍾',n:'びんの 中の 船',en:'a ship in a bottle',p:900,ph:["How did they put the ship in the bottle?","どうやって 船を びんに 入れたの？"]},
 {id:'s_globe',slot:'sill',ico:'🌐',n:'地球儀',en:'a globe',p:700,ph:["Spin the globe and point to a country.","地球儀を まわして 国を ゆびさして。"]},
 {id:'l_scope',slot:'loft',ico:'🔭',n:'望遠鏡',en:'a telescope',p:3000,ph:["I can see Saturn's rings!","土星の わが 見える！"]},
 {id:'l_ship',slot:'loft',ico:'⛵',n:'船の もけい',en:'a model ship',p:1800,ph:["I built this model ship myself.","この 船の もけいは 自分で 作った。"]},
 {id:'l_planet',slot:'loft',ico:'🪐',n:'わくせいの もけい',en:'a model of the planets',p:2000,ph:["There are eight planets in our solar system.","太陽系には わくせいが 8つ ある。"]},
 /* 遊びに 来た 人が くれる（はじめての 日だけ） */
 {id:'g_mina',slot:'shelf',ico:'📗',n:'ミナ先生の 本',en:'Mina-sensei\'s favorite book',p:0,gift:'mina',ph:["This book changed my life.","この 本が わたしの 人生を かえた。"]},
 {id:'g_mio',slot:'plant',ico:'🌵',n:'ミオの サボテン',en:'Mio\'s cactus',p:0,gift:'mio',ph:["Cactuses don't need much water.","サボテンは 水が あまり いらない。"]}];

/* 遊びに 来た ときの 会話（はじまりは a） */
const HOUSE_VISIT={
mina:[
{id:'hv_m1',ico:'🎁',t:'はじめての おきゃくさま',first:1,nodes:{
 a:{m:["Congratulations on your new house! I brought a housewarming gift. It's my favorite book. Open it when you feel tired.","新しい 家、 おめでとう！ 新築祝いを 持ってきたの。 わたしの お気に入りの 本。 つかれた ときに ひらいてね。"],ex:'happy',nt:[["a housewarming gift","「新築祝い・ひっこし祝い」。 housewarming party は 新しい 家で ひらく パーティー"]],o:[
  ["Thank you, Sensei! Please come in.","ありがとう ございます、 先生！ どうぞ 入って。",'b',2],["Is it an English textbook?","英語の 教科書 ですか？",'c',1]]},
 c:{m:["Ha ha, no! It's a story about a girl who sails around the world. … Okay, it has a few English words in it. I'm a teacher, after all.","あはは、 ちがうよ！ 世界一周を する 女の子の お話。 … まあ、 英語も 少し 出てくるけど。 先生 だからね。"],ex:'smile',o:[["I'll read it tonight.","今夜 読みます。",'b',2]]},
 b:{m:["What a cozy room. You know, a home tells you a lot about a person. This one says, 'I'm kind and I like to learn.'","いごこちの いい へや。 家って、 その人の ことを たくさん 教えて くれるの。 この へやは 「やさしくて、 学ぶのが 好き」って 言ってる。"],lv:["What a cozy room. … It smells like you. Ah, I mean— it smells nice! The wood! It's the wood.","いごこちの いい へや。 … あなたの においが する。 あ、 ちがう… いい においって こと！ 木の！ 木の においよ。"],ex:'smile',o:[
  ["Would you like some tea?","お茶は いかがですか？",'g1',2],["Make yourself at home.","くつろいで ください。",'g2',2],["Please don't look in the closet.","クローゼットは 見ないで ください。",'f1',1]]},
 g1:{m:["I'd love some. … Mmm. Your tea is better than mine. Don't tell anyone I said that.","いただくわ。 … ん。 わたしが いれるより おいしい。 わたしが そう 言ったって、 ないしょね。"],ex:'happy',end:'good'},
 g2:{m:["'Make yourself at home.' Perfect English! That's exactly what a good host says. … Then I'll take the sofa!","「くつろいで ください」。 かんぺきな 英語！ いい ホストの ことばよ。 … じゃあ、 えんりょなく くつろぐね！"],ex:'proud',nt:[["Make yourself at home.","「自分の 家だと 思って くつろいで」。 お客さんを むかえる ときの 決まり文句"]],end:'good'},
 f1:{m:["The closet? … Now I really want to look. Ha ha, don't worry. A teacher never checks the closet. Only the homework.","クローゼット？ … そう 言われると 見たく なる。 あはは、 だいじょうぶ。 先生は クローゼットは 見ない。 見るのは 宿題 だけ。"],ex:'happy',end:'fun'}}},
{id:'hv_m2',ico:'📝',t:'家で 授業',nodes:{
 a:{m:["Today, let's have a special lesson. Here in your house! Can you tell me what's in this room, in English?","きょうは とくべつ授業。 あなたの 家で！ この へやに 何が あるか、 英語で 言える？"],ex:'smile',o:[
  ["There is a window and a door.","窓と ドアが あります。",'b',2],["There are many things.","たくさんの 物が あります。",'c',1],["Um… a room?","えっと… へや？",'d',0]]},
 c:{m:["True! But can you be more specific? Try 'There is a …' for one thing, and 'There are …' for many things.","そのとおり！ でも もう少し くわしく 言える？ 1つなら 「There is a …」、 たくさんなら 「There are …」で。"],ex:'think',o:[["There is a window and a door.","窓と ドアが あります。",'b',2]]},
 d:{m:["Ha ha, yes, it's a room! Good start. Now, what's in the room? Try 'There is a …'.","あはは、 そう、 へやだね！ いい スタート。 じゃあ へやに 何が ある？ 「There is a …」で 言ってみて。"],ex:'happy',o:[["There is a window and a door.","窓と ドアが あります。",'b',1]]},
 b:{m:["Excellent! 'There is' and 'there are' are very useful. You can describe any place. Now, what can you see from the window?","すばらしい！ There is と there are は とても べんり。 どんな 場所でも せつめい できるよ。 じゃあ、 窓から 何が 見える？"],ex:'proud',nt:[["There is / There are","「〜が ある・いる」。 1つは There is a cat. 2つ以上は There are two cats."]],o:[
  ["I can see the sea.","海が 見えます。",'g1',2],["I can see you, Sensei.","先生が 見えます。",'f1',1,null,["I can see the sea and the sky.","海と 空が 見えます。"]]]},
 g1:{m:["Perfect! 'I can see the sea.' What a lucky house. … Lesson over! Now let's just look at the sea together for a while.","かんぺき！ 「海が 見えます」。 しあわせな 家だね。 … 授業 おわり！ あとは しばらく いっしょに 海を ながめよう。"],ex:'happy',end:'good'},
 f1:{m:["Me? I'm not outside the window! … Oh. You mean… Ahem! Lesson over! I-I need some water!","わたし？ わたしは 窓の 外に いないよ！ … あ。 そういう… こほん！ 授業 おわり！ み、 水が ほしい！"],ex:'wow',end:'fun'}}},
{id:'hv_m3',ico:'🍳',t:'いっしょに 料理',nodes:{
 a:{m:["I brought some eggs and vegetables. Shall we cook lunch together? I'm… not a great cook, though.","たまごと 野菜を 持ってきたの。 いっしょに お昼 作らない？ わたし… 料理は あまり とくいじゃ ないけど。"],ex:'smile',o:[["Sure! Let's make an omelet.","いいですね！ オムレツを 作ろう。",'b',2],["How bad are you?","どれくらい にがて なんですか？",'c',1]]},
 c:{m:["Last week I burned water. … I'm kidding! I burned toast. Twice.","先週、 水を こがしたの。 … うそ！ トーストを こがした。 2回。"],ex:'happy',o:[["Then I'll cook. You can help.","じゃあ ぼくが 作ります。 手伝って ください。",'b',2]]},
 b:{m:["Okay! First, crack the eggs into a bowl. Then, beat them. … 'Beat' here means 'mix quickly'. Not 'hit'!","よし！ まず、 たまごを ボウルに わる。 それから まぜる。 … ここの 「beat」は 「すばやく まぜる」。 「たたく」じゃ ないよ！"],ex:'think',nt:[["crack / beat","料理の 英語。 crack the eggs（たまごを わる）・beat the eggs（たまごを とく）・fry（いためる）"]],o:[
  ["Now we fry them in the pan.","つぎは フライパンで 焼く。",'d',1],["Oops, I dropped an egg.","あっ、 たまごを おとした。",'e',1]]},
 e:{m:["Ha ha! 'Don't cry over spilled milk.' Or… spilled eggs. It's okay. We have more.","あはは！ 「こぼれた ミルクを なげいても しかたない」。 たまご だけどね。 だいじょうぶ、 まだ あるよ。"],ex:'happy',nt:[["Don't cry over spilled milk.","「すんだ ことを くよくよ しない」という ことわざ"]],o:[["Now we fry them.","じゃあ 焼こう。",'d',1]]},
 d:{m:["Look! It's a real omelet! It's a little… square. But it's ours. Let's eat!","見て！ ちゃんと オムレツ！ ちょっと… しかくい けど。 でも わたしたちの。 食べよう！"],ex:'wow',o:[["It's delicious!","おいしい！",'g1',2],["It tastes like… an omelet.","味は… オムレツです。",'f1',1]]},
 g1:{m:["Really? … It really is! Cooking together is magic. Maybe I can cook after all. Thank you, chef!","ほんと？ … ほんとだ！ いっしょに 作ると 魔法 みたい。 わたし、 料理 できるかも。 ありがとう、 シェフ！"],lv:["Really? … It really is! … Hey. Let's cook together again. Many, many times. Okay?","ほんと？ … ほんとだ！ … ねえ。 また いっしょに 作ろう。 何回も、 何回も。 いい？"],ex:'happy',end:'good'},
 f1:{m:["'It tastes like an omelet.' That's the most honest review I've ever heard. Ha ha ha!","「味は オムレツです」。 いちばん しょうじきな 感想だね。 あはは！"],ex:'happy',end:'fun'}}},
{id:'hv_m4',ico:'🌧️',t:'雨やどり',nodes:{
 a:{m:["Sorry! It suddenly started raining and your house was the closest. Can I stay until it stops?","ごめんね！ 急に 雨が ふってきて、 あなたの 家が いちばん 近かったの。 やむまで いても いい？"],ex:'worry',o:[["Of course. Here's a towel.","もちろん。 タオル どうぞ。",'b',2],["You're soaking wet!","びしょぬれ ですね！",'b',1]]},
 b:{m:["Thank you… The rain sounds nice on your roof. Pitter-patter. In English, we say rain goes 'pitter-patter'.","ありがとう… 屋根に あたる 雨の 音、 いいね。 ポツポツ。 英語では 雨は 「pitter-patter」って いうの。"],ex:'smile',nt:[["pitter-patter","「ポツポツ・パラパラ」。 英語の 音の ことば。 ほかに the clock goes tick-tock（チクタク）"]],o:[
  ["Let's listen to it for a while.","しばらく きいて いましょう。",'g1',2],["Do you want to play a game?","ゲーム しませんか？",'c',1]]},
 c:{m:["A game? Okay! Let's play 'I spy'. I spy with my little eye… something blue!","ゲーム？ いいよ！ 「I spy」を しよう。 わたしの 目に 見えるのは… 青い もの！"],ex:'happy',nt:[["I spy with my little eye…","英語の 子どもの あそび。 「見えるもの なーんだ」と 言って 色や 頭文字で あてっこ する"]],o:[["The sea!","海！",'g2',2],["Your umbrella?","先生の かさ？",'f1',1]]},
 g1:{m:["… You know, I like quiet times like this. Just the rain, and a friend. … The rain stopped. Hmm, too bad.","… ねえ、 こういう しずかな 時間、 好き。 雨と、 友だちと。 … やんじゃった。 ふふ、 ざんねん。"],lv:["… You know, I like quiet times like this. Just the rain, and you. … The rain stopped. … Can I stay a little longer?","… ねえ、 こういう しずかな 時間、 好き。 雨と、 あなたと。 … やんじゃった。 … もう少し いても いい？"],ex:'smile',end:'good'},
 g2:{m:["Correct! Your turn. … Wow, the rain stopped while we were playing. Time flies when you're having fun!","せいかい！ つぎは あなたの ばん。 … わあ、 あそんでる あいだに やんだね。 楽しい 時間は あっという間！"],ex:'happy',nt:[["Time flies when you're having fun.","「楽しい 時間は あっという間」。 time flies = 時間が とぶように すぎる"]],end:'ok'},
 f1:{m:["My umbrella? I don't have an umbrella! That's why I'm here! Ha ha ha!","わたしの かさ？ かさが ないから ここに いるんだよ！ あはは！"],ex:'happy',end:'fun'}}},
{id:'hv_m5',ico:'🌙',t:'夜の おしゃべり',nodes:{
 a:{m:["I saw your light on, so I came to say good night. … Your house looks so warm from outside.","明かりが ついてたから、 おやすみを 言いに 来たの。 … 外から 見ると、 あなたの 家 あったかそう。"],ex:'smile',o:[["Come in. Let's talk for a bit.","入って。 少し 話しましょう。",'b',2],["Good night, Sensei.","おやすみなさい、 先生。",'c',1]]},
 c:{m:["Good night. … Wait. Can I tell you something first? I'm proud of you. You really built a home here.","おやすみ。 … まって。 先に 1つ 言っても いい？ あなたを ほこりに 思ってる。 ほんとに ここに 自分の 家を 作ったんだね。"],ex:'proud',o:[["Thanks to you, Sensei.","先生の おかげです。",'g1',2]]},
 b:{m:["When I was a student, I wanted a little house by the sea. You made my dream come true… in a way. Ha ha.","学生の ころ、 海の そばの 小さな 家が ほしかったの。 あなたが わたしの 夢を かなえた… ある いみでね。 あはは。"],ex:'smile',nt:[["in a way","「ある いみで」。 ちょっと 言いすぎかな と 思う ときに そえる"]],o:[["You can visit anytime.","いつでも 来て ください。",'g1',2],["Then let's be neighbors!","じゃあ おとなりさんに なりましょう！",'f1',1]]},
 g1:{m:["Anytime? Careful, I might really come every day! … Good night. Sweet dreams.","いつでも？ 気をつけて、 ほんとに 毎日 来ちゃうかも！ … おやすみ。 いい 夢を。"],lv:["Anytime? … Then I'll come every night to say good night. … Sweet dreams. Dream about me, okay? Ha ha, just kidding!","いつでも？ … じゃあ 毎晩 おやすみを 言いに 来る。 … いい 夢を。 わたしの 夢、 見てね？ あはは、 じょうだん！"],ex:'happy',nt:[["Sweet dreams.","「いい 夢を」。 Good night. の あとに よく 言う"]],end:'good'},
 f1:{m:["Neighbors?! Then I can borrow sugar from you every day! … Ha ha. Good night, neighbor.","おとなりさん！？ じゃあ 毎日 おさとうを かりに 来られる！ … あはは。 おやすみ、 おとなりさん。"],ex:'happy',end:'fun'}}}],
mio:[
{id:'hv_o1',ico:'🌵',t:'ミオの 新築祝い',first:1,nodes:{
 a:{m:["Boss! Housewarming gift! It's a cactus. It's tough, it doesn't need much care, and it's a little prickly. Just like me! Ha ha!","店長！ 新築祝い！ サボテンです。 じょうぶで、 手が かからなくて、 ちょっと トゲトゲ。 わたしと そっくり！ あはは！"],ex:'laugh',p:'peace',o:[
  ["You're not prickly. Thank you!","トゲトゲ じゃ ないよ。 ありがとう！",'b',2],["Ha ha, it does look like you.","あはは、 たしかに にてる。",'c',1]]},
 c:{m:["Hey! You're supposed to say 'No, Mio, you're so sweet!' … Ha ha. Okay, show me around!","ちょっと！ そこは 「ちがうよ、 ミオは やさしいよ！」って 言う ところ！ … あはは。 じゃあ、 家の 中 案内して！"],ex:'wink',o:[["Let me show you around.","案内するね。",'b',1]]},
 b:{m:["Wow, it's so nice! So this is where you go when you leave the shop. … It's kind of strange to see where you live.","わあ、 すてき！ お店を 出たら ここに 帰るんですね。 … 店長の 住んでる ところ 見るの、 なんだか ふしぎ。"],lv:["Wow, it's so nice! So this is where you sleep… I mean, live! Where you live! … My face is hot.","わあ、 すてき！ ここで 店長が ねてるんだ… じゃなくて、 住んでる！ 住んでる ところ！ … 顔 あつい。"],ex:'smile',nt:[["show someone around","「（人を）案内する」。 Let me show you around.（案内するね）"]],o:[
  ["Where should I put the cactus?","サボテン、 どこに おこうか？",'g1',2],["Do you want something to drink?","なにか のむ？",'g2',1]]},
 g1:{m:["By the window! Cactuses love the sun. … There. Now every time you see it, you'll think of me. That's my evil plan. Ha ha!","窓の そば！ サボテンは 日の 光が 大好き。 … はい。 これで 見る たびに わたしを 思いだす。 それが わたしの わるい 作戦。 あはは！"],ex:'laugh',p:'thumb',end:'good'},
 g2:{m:["Yes, please! Something cold. … Ahh. Boss, your house is really relaxing. I might take a nap here. Just kidding!","ください！ つめたい もの。 … はあ。 店長の 家、 すごく おちつく。 ここで おひるね しちゃうかも。 うそです！"],ex:'sleepy',end:'ok'}}},
{id:'hv_o2',ico:'🎬',t:'映画の 夜',nodes:{
 a:{m:["Movie night! I brought popcorn and two movies. A scary one and a romantic comedy. You choose!","映画の 夜！ ポップコーンと 映画 2本 持ってきました。 こわいのと ラブコメ。 店長が えらんで！"],ex:'laugh',o:[["The scary one!","こわいの！",'sc',1],["The romantic comedy.","ラブコメ。",'rc',2],["Can we watch both?","両方 見られる？",'both',1]]},
 both:{m:["Both? We'll be up until two in the morning! … Okay, deal. Scary first, so the comedy can save us.","両方？ 夜中の 2時まで おきてる ことに なる！ … いいよ、 きまり。 こわいのが 先。 ラブコメで すくって もらう。"],ex:'wink',o:[["Deal.","きまり。",'sc',1]]},
 sc:{m:["Okay… lights off… … KYAA! Why did she open the door?! Never open the door! … Boss, can I hold your arm?","じゃあ… 電気 けして… … きゃっ！ なんで ドア あけるの！？ ぜったい あけちゃ だめ！ … 店長、 うで つかんでも いい？"],fr:["Okay… lights off… … KYAA! Why did she open the door?! Never open the door! … Boss, give me the cushion!","じゃあ… 電気 けして… … きゃっ！ なんで ドア あけるの！？ ぜったい あけちゃ だめ！ … 店長、 クッション ちょうだい！"],ex:'oops',o:[["It's okay. It's just a movie.","だいじょうぶ。 ただの 映画だよ。",'g1',2],["BOO!","わっ！",'f1',0]]},
 rc:{m:["Good choice! … Ha ha ha! Did you see that? He said 'I love you' to the wrong girl! … Why does he look like you?","いい えらび！ … あはは！ 見た？ ちがう 女の子に 「I love you」って 言っちゃった！ … なんで 店長に にてるの？"],ex:'laugh',nt:[["a romantic comedy","「ラブコメ」。 英語では rom-com と みじかく 言う ことも"]],o:[["I would never do that!","ぼくは ぜったい しない！",'g2',2],["He's handsome, right?","かっこいい でしょ？",'f2',1]]},
 g1:{m:["'It's just a movie.' Right. Right… … The movie ended an hour ago, but I'm still holding your arm. Ha ha. Can I stay until it's light outside?","「ただの 映画」。 そうだよね… … 映画 1時間 前に おわったのに、 まだ うで つかんでる。 あはは。 明るく なるまで いても いい？"],fr:["'It's just a movie.' Right. Right… … Boss, can you walk me home later? Just to the shop. It's on the way. … Please?","「ただの 映画」。 そうだよね… … 店長、 あとで 送って くれる？ お店まで。 とちゅう だから。 … おねがい？"],ex:'oops',end:'good'},
 g2:{m:["Never? Good. … Because if you ever said it, I'd want you to say it to the right girl.","ぜったい？ よかった。 … もし 言う ときは、 ちゃんと 正しい 子に 言って ほしいから。"],fr:["Never? Ha ha, I believe you. You'd probably say it in perfect English, too.","ぜったい？ あはは、 しんじる。 店長なら かんぺきな 英語で 言いそう。"],ex:'wink',end:'good'},
 f1:{m:["KYAAAAA! … BOSS! … I'm never watching a scary movie with you again! … Next week, same time?","きゃああああ！ … 店長！ … もう ぜったい いっしょに こわい 映画 見ない！ … 来週、 同じ 時間で いい？"],ex:'oops',end:'fun'},
 f2:{m:["Handsome? Him? … Hmm. You're more handsome. Wait, did I say that out loud? Popcorn! More popcorn!","かっこいい？ あの人が？ … うーん。 店長の ほうが かっこいい。 あれ、 声に 出てた？ ポップコーン！ ポップコーン もっと！"],ex:'oops',end:'fun'}}},
{id:'hv_o3',ico:'🧹',t:'大そうじ',nodes:{
 a:{m:["Boss, I came to help you clean! … Whoa. Okay. We have a lot of work to do. Where did all these socks come from?","店長、 そうじ 手伝いに 来ました！ … うわ。 よし。 しごとが いっぱい ですね。 この くつした、 どこから 来たの？"],ex:'oops',o:[["I was going to clean today!","きょう そうじ する つもり だったんだ！",'b',1],["Thank you. You're a lifesaver.","ありがとう。 たすかる。",'b',2]]},
 b:{m:["Okay! I'll do the floor. You do the windows. Ready… set… go! First one to finish chooses dinner!","よし！ わたしは ゆか。 店長は 窓。 よーい… どん！ 先に おわった ほうが 夜ごはんを きめる！"],ex:'laugh',p:'guts',nt:[["Ready, set, go!","「よーい、 どん！」。 Ready, steady, go! とも 言う"]],o:[["You're on!","受けて たつ！",'c',1],["Hey, the floor is easier!","ずるい、 ゆかの ほうが かんたん！",'c',1]]},
 c:{m:["Done! … Wait, you finished first? Your windows are so shiny! … Fine. You choose dinner. But I'm hungry, so choose fast!","おわり！ … まって、 店長の ほうが 先？ 窓、 ピカピカ！ … しかたない。 夜ごはんは 店長が きめて。 でも おなか すいたから はやく！"],ex:'oops',o:[["Let's order pizza.","ピザを たのもう。",'g1',2],["Let's go to Marco's.","マルコさんの お店に 行こう。",'g2',2],["I'll cook!","ぼくが 作る！",'f1',1]]},
 g1:{m:["Pizza in a clean house! Perfect! … Ha ha, we're getting crumbs on the floor we just cleaned.","きれいな 家で ピザ！ さいこう！ … あはは、 そうじ した ばかりの ゆかに パンくず おとしてる。"],ex:'laugh',end:'good'},
 g2:{m:["Marco's! Yes! … Boss, cleaning with you was fun. Can I say something weird? It felt like… our house. Ha ha. Forget it!","マルコさんの ところ！ いいね！ … 店長、 いっしょに そうじ 楽しかった。 へんな こと 言っても いい？ なんだか… 2人の 家 みたいで。 あはは。 わすれて！"],fr:["Marco's! Yes! … Boss, cleaning together was fun. We really are the best team!","マルコさんの ところ！ いいね！ … 店長、 いっしょに そうじ 楽しかった。 わたしたち、 ほんとに さいこうの チーム！"],ex:'smile',end:'good'},
 f1:{m:["You?! In the kitchen we just cleaned?! … Okay, but I'm watching you. One drop of sauce and you're cleaning again!","店長が！？ いま きれいに した キッチンで！？ … いいけど、 見はってます。 ソース 1てきでも おとしたら また そうじ！"],ex:'wink',end:'fun'}}},
{id:'hv_o4',ico:'🃏',t:'カードの 話',nodes:{
 a:{m:["Boss, I couldn't wait until tomorrow! A customer told me about a super rare card today. We have to talk about it!","店長、 あしたまで 待てなかった！ きょう お客さんから すっごく めずらしい カードの 話を 聞いたの。 話さなきゃ！"],ex:'laugh',p:'guts',o:[["Tell me everything.","ぜんぶ 聞かせて。",'b',2],["Mio, it's your day off…","ミオ、 きょうは 休みでしょ…",'c',1]]},
 c:{m:["I know, I know! But cards are my hobby AND my job. I'm the luckiest worker in the world! Ha ha.","わかってます！ でも カードは しゅみ でも あって しごと でも あるの。 世界一 ラッキーな バイト！ あはは。"],ex:'wink',o:[["Okay, tell me.","わかった、 話して。",'b',1]]},
 b:{m:["They say there's a card hidden at the very bottom of the mine. Nobody has ever seen it. It shines like the sun!","鉱山の いちばん そこに カードが ねむってる って うわさ。 だれも 見た ことが ないの。 太陽 みたいに 光るって！"],ex:'smile',nt:[["They say …","「〜と いう うわさだ」。 うわさ話の はじめに よく つかう"]],o:[
  ["Let's find it together.","いっしょに さがそう。",'g1',2],["It's probably just a story.","たぶん ただの うわさだよ。",'ok1',1],["Then I'll dig all night!","じゃあ 夜どおし ほる！",'f1',1]]},
 g1:{m:["Together! Yes! You dig, I'll cheer. … Ha ha, just kidding. I'll bring snacks too. And a radio. And—","いっしょに！ うん！ 店長が ほって、 わたしが おうえん。 … あはは、 うそ。 おやつも 持っていく。 ラジオも。 それから…"],ex:'laugh',p:'peace',end:'good'},
 ok1:{m:["Maybe… but stories are fun! That's why I love cards. Every card has a story. Like us! … That sounded cooler in my head.","かもね… でも うわさって 楽しい！ だから カードが 好き。 どの カードにも 物語が ある。 わたしたち みたいに！ … 頭の 中では もっと かっこよかった。"],ex:'oops',end:'ok'},
 f1:{m:["All night?! No, no! You'll fall asleep in the mine! … Get some rest first. That's an order from your staff!","夜どおし！？ だめ だめ！ 鉱山で ねちゃう！ … まずは 休んで。 バイトからの 命令です！"],ex:'oops',end:'fun'}}},
{id:'hv_o5',ico:'🎂',t:'ミオの おねがい',nodes:{
 a:{m:["Boss… can I ask a favor? My mom is visiting next week. Can I show her your house? I told her about it, and… she wants to see it.","店長… おねがいが あるんですけど。 来週 母が 来るんです。 店長の 家、 見せても いい？ 話したら… 見たいって。"],lv:["Boss… can I ask a favor? My mom is visiting next week. She wants to meet you. … She wants to meet my boyfriend.","店長… おねがいが あるんですけど。 来週 母が 来るんです。 店長に 会いたいって。 … わたしの かれしに 会いたいって。"],ex:'oops',o:[["Of course! I'll clean up.","もちろん！ そうじ しておく。",'b',2],["What did you tell her about me?","ぼくの こと なんて 言ったの？",'c',1]]},
 c:{m:["Nothing strange! Just… that you're kind, and you work hard, and you're good at English, and… That's enough! Stop smiling!","へんな ことは 言ってない！ ただ… やさしくて、 がんばりやで、 英語が じょうずで… もう いいでしょ！ にやにや しないで！"],ex:'oops',o:[["I'll do my best when she comes.","来た ときは がんばるよ。",'b',2]]},
 b:{m:["Thank you! She speaks English too, so practice your polite English. 'Nice to meet you. Please make yourself at home.' Say it!","ありがとう！ 母も 英語 話せるから、 ていねいな 英語 練習してね。 「はじめまして。 どうぞ くつろいで ください」。 言ってみて！"],ex:'smile',nt:[["Nice to meet you.","「はじめまして」。 返事は Nice to meet you, too."]],o:[
  ["Nice to meet you. Please make yourself at home.","はじめまして。 どうぞ くつろいで ください。",'g1',2],["Yo! What's up, Mom?","よっ！ 元気、 お母さん？",'f1',0]]},
 g1:{m:["Perfect! She'll love you. … I mean, she'll like you. A lot. Probably more than me! Ha ha.","かんぺき！ 母、 きっと 気に入る。 … ていうか すごく すきに なる。 わたしより すきに なるかも！ あはは。"],ex:'laugh',p:'thumb',end:'good'},
 f1:{m:["'Yo, Mom'?! NO! Absolutely not! … Ha ha ha! Okay, we have one week. We're practicing every day!","「よっ、 お母さん」！？ だめ！ ぜったい だめ！ … あはは！ よし、 1週間 ある。 毎日 練習です！"],ex:'laugh',end:'fun'}}}]};
