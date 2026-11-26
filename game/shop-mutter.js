/* カウンターの つぶやき（ミオと お客さん）。 店内の ドット絵の 上に 小さな ふきだしで 出る。 しくみは game/shop.js の mut()
   [英語, 日本語]。 英語は 短く（ふきだしに 2行まで）。 ふきだしを タップすると 英語を 読む */
const SHOP_MUTTER={
/* ミオ: お客さんが いない あいだ（時間帯で 変わる） */
 day:[
  ["What a sunny day!","いい 天気〜！"],
  ["The sea is so blue today.","きょうの 海、 すごく 青い。"],
  ["I can hear the waves…","波の 音が 聞こえる…"],
  ["A boat! Hello, boat!","船だ！ やっほー、 船さん！"],
  ["Perfect beach weather.","浜辺 びより だなあ。"],
  ["I want some ice cream…","アイス 食べたいな…"],
  ["The seagulls are noisy today.","きょうは カモメが にぎやか。"],
  ["Sunscreen? Check!","日やけどめ？ よし！"]],
 dusk:[
  ["The sky is turning orange.","空が オレンジに なってきた。"],
  ["Sunset is my favorite time.","夕日の 時間が いちばん すき。"],
  ["Time to turn on the lights!","そろそろ 灯りを つけよう！"],
  ["The sea looks like gold.","海が 金色に 見える。"],
  ["What should I eat for dinner?","晩ごはん、 なに 食べようかな？"]],
 night:[
  ["The stars are out!","星が 出てきた！"],
  ["It's so quiet tonight.","今夜は しずかだなあ。"],
  ["*yawn*… I'm not sleepy!","ふぁ…… ねむくないです！"],
  ["I saw a shooting star!","流れ星 見えた！"],
  ["Night shift. I can do it!","夜の 店番。 がんばれ、 わたし！"],
  ["The lamps look so warm.","ランプの 灯り、 あったかい。"]],
/* ミオ: いつでも */
 any:[
  ["Customer… cus-to-mer.","カスタマー… お・きゃ・く・さ・ま。"],
  ["\"How can I help you?\" Good!","「How can I help you?」 よし！"],
  ["Thirteen, thirty… Thirteen!","サーティーン、 サーティ… サーティーン！"],
  ["Oops! …No, nothing fell.","おっと！ …ううん、 なにも 落ちてない。"],
  ["Where did I put the tape?","テープ、 どこに おいたっけ？"],
  ["This shelf is a little dusty.","この たな、 ちょっと ほこりっぽい。"],
  ["I love the smell of new cards.","新しい カードの におい、 すき。"],
  ["Word of the day: \"breeze.\"","きょうの 単語: 「breeze（そよ風）」。"],
  ["I have a test next week…","来週 テストなんだよね…"],
  ["\"Welcome!\" Hmm, more smile!","「Welcome!」 うーん、 もっと 笑顔で！"],
  ["Is it \"a\" or \"an\" umbrella? An!","a umbrella？ an umbrella？ an だ！"],
  ["My English notebook is full!","英語の ノート、 いっぱいに なった！"],
  ["I hope the boss is proud of me.","店長、 よろこんでくれてるかな。"],
  ["Let's do our best today!","きょうも がんばろう！"],
  ["I should count the coins… later.","コイン 数えなきゃ… あとで。"],
  ["Hmm, hmm, hmm♪","ふん ふん ふーん♪"],
  ["\"Fragile.\" That means \"be careful\"!","「fragile」は 「こわれもの」！"],
  ["I almost tripped… again.","また つまずきそうに なった…"]],
 sweep:[
  ["Sweep, sweep, sweep!","はいて、 はいて、 はいて！"],
  ["So much sand on the floor!","ゆかが 砂だらけ！"],
  ["A clean shop is a happy shop.","きれいな 店は ハッピーな 店。"],
  ["Oh, a shell! Cute.","あ、 貝がら！ かわいい。"]],
 doze:[
  ["Zzz… one more card…","ぐう… あと 1まい…"],
  ["Zzz… thank you, come again…","すや… また きてね…"],
  ["Mmm… the sea is singing…","むにゃ… 海が うたってる…"]],
/* ミオ: 売り場の ようす */
 empty:[
  ["The shelf is empty, boss!","店長、 売り場が からっぽです！"],
  ["No cards to sell… Let's put some out!","売る カードが ない… ならべましょう！"],
  ["Customers can't buy air!","空気は 売れませんよ〜！"]],
 few:[
  ["Only a few cards left.","カード、 のこり 少しです。"],
  ["Shall we add more cards?","カード、 たしましょうか？"]],
/* ミオ: お客さんへ */
 hello:[
  ["Welcome!","いらっしゃいませ！"],
  ["Hello! Take your time.","こんにちは！ ゆっくり 見てくださいね。"],
  ["Welcome to Shiosai!","しおさいへ ようこそ！"],
  ["Hi there! Nice day, isn't it?","こんにちは！ いい 日ですね。"]],
 helloNight:[
  ["Good evening! Welcome!","こんばんは！ いらっしゃいませ！"],
  ["Welcome! Thanks for coming so late.","いらっしゃいませ！ おそくに ありがとうございます。"]],
 thanks:[
  ["Thank you so much!","ありがとうございました！"],
  ["Please come again!","また きてくださいね！"],
  ["Yay! We sold one, boss!","やった！ 売れましたよ、 店長！"],
  ["Have a nice day!","よい 一日を！"],
  ["Enjoy your card!","カード、 楽しんでくださいね！"]],
 thanksNight:[
  ["Good night! Be careful!","おやすみなさい！ 気をつけて！"],
  ["Thank you! Sweet dreams!","ありがとうございました！ いい ゆめを！"]],
 bye:[
  ["See you next time!","また こんど！"],
  ["Maybe next time…","また こんどかな…"],
  ["We'll have new cards soon!","すぐ 新しい カード 入りますよ！"]],
 sorry:[
  ["Sorry! We'll get more cards.","すみません！ カード、 入れておきます。"],
  ["Oh no… Boss, the shelf!","あちゃー… 店長、 売り場！"]],

/* お客さん: どの 人でも */
 g_enter:[
  ["Hello!","こんにちは！"],
  ["Wow, so many cards!","わあ、 カードが いっぱい！"],
  ["Nice shop!","すてきな お店！"],
  ["Is it open? Great!","あいてる？ よかった！"],
  ["It's cool in here.","中は すずしいね。"]],
 g_enterNight:[
  ["Still open? Lucky!","まだ あいてる？ ラッキー！"],
  ["Good evening!","こんばんは！"]],
 g_shelf:[
  ["Hmm… which one?","うーん… どれに しよう？"],
  ["So many words!","単語が いっぱい！"],
  ["Oh, I know this word!","あ、 この 単語 知ってる！"],
  ["What does this one mean?","これ、 どういう 意味かな？"],
  ["The colors are pretty.","色が きれい。"],
  ["Let me see…","どれどれ…"]],
 g_table:[
  ["This one looks good.","これ、 よさそう。"],
  ["Should I buy it?","買おうかな？"],
  ["Hmm, it's a little expensive.","うーん、 ちょっと 高いかな。"],
  ["I like this one!","これ、 すき！"]],
 g_buy:[
  ["I'll take this one!","これに しよう！"],
  ["Found it!","見つけた！"],
  ["This is the one!","これだ！"]],
 g_happy:[
  ["Thank you!","ありがとう！"],
  ["Yay! My new card!","やった！ 新しい カード！"],
  ["I'll come back again!","また 来るね！"],
  ["This made my day!","いい 一日に なった！"]],
 g_leave:[
  ["Maybe next time.","また こんど。"],
  ["Just looking. Thanks!","見てた だけ。 ありがとう！"],
  ["I'll think about it.","ちょっと 考えるね。"]],
 g_none:[
  ["Huh? No cards?","あれ？ カードが ない？"],
  ["The shelf is empty…","売り場が からっぽ…"]],

/* 🖼️ かざりだな（ガラスケース）: お客さんが のぞいて ひとこと → ミオが こたえる。 {w}=カードの 名前 */
 g_case:[
  ["Wow! What's in the glass case?","わあ！ ガラスケースの 中、 なに？"],
  ["That card is shining!","あの カード、 光ってる！"],
  ["Is that one for sale?","あれは 売りもの？"],
  ["I've never seen that card before.","あんな カード、 はじめて 見た。"],
  ["So rare… I'm jealous!","めずらしい… うらやましい！"],
  ["Can I take a picture?","写真 とっても いい？"],
  ["Where did you find these?","これ、 どこで 見つけたの？"]],
 caseMio:[
  ["Sorry, those are not for sale!","ごめんなさい、 それは 売りものじゃ ないんです！"],
  ["Our boss found them in the mine!","店長が 鉱山で 見つけたんですよ！"],
  ["Those are our treasures.","あれは うちの お宝なんです。"],
  ["Pretty, right? Just looking is free!","きれいでしょ？ 見るのは タダです！"],
  ["Take your time. They don't bite!","ゆっくり どうぞ。 かみつきませんよ！"]],
 caseIdle:[
  ["Let me polish the glass… shine!","ガラスを みがこう… ピカピカ！"],
  ["Our showcase looks great today.","きょうも かざりだなが きれい。"],
  ["Good morning, treasure cards!","おはよう、 お宝カードたち！"],
  ["No fingerprints on the glass. Perfect!","ガラスに 指のあと なし。 かんぺき！"]],
 caseEmpty:[
  ["The glass case is empty… so lonely.","ガラスケースが からっぽ… さみしい。"],
  ["Let's show off our best cards, boss!","いちばんの カードを かざりましょうよ、 店長！"]],

/* お客さん: その 人らしい ひとこと（GUESTS と 同じ じゅんばん） */
 who:[
  /* りょうしの ゲンさん */
  [["I caught a big fish today!","きょう 大きい 魚が つれたぞ！"],["The sea is calm today.","きょうは 海が おだやかだ。"],["Any cards about fish?","魚の カードは あるかい？"],["The wind smells like rain.","風が 雨の においだな。"]],
  /* 旅行中の アンナ */
  [["What a lovely little shop!","なんて すてきな 小さい お店！"],["This is a nice souvenir.","いい おみやげに なるわ。"],["I love this beach town!","この 浜辺の 町、 大すき！"],["My train leaves at five.","電車は 5時なの。"]],
  /* 学生の ケン */
  [["These cards help me study!","この カード、 勉強に 役立つ！"],["I have a quiz tomorrow.","あした 小テストなんだ。"],["I know this word! Maybe…","この 単語 知ってる！ たぶん…"],["Homework first… or cards?","宿題が 先… それとも カード？"]],
  /* あみものの ハルさん */
  [["My, what cute cards.","まあ、 かわいい カード。"],["For my grandson, I think.","孫に どうかしらね。"],["Slowly, slowly…","ゆっくり、 ゆっくり…"],["I'm knitting a scarf.","マフラーを あんでるのよ。"]],
  /* サーファーの ジョー */
  [["The waves are huge today!","きょうの 波、 でかいぜ！"],["Cool cards, dude!","いかした カードだな！"],["After this, surfing!","このあと、 サーフィン！"],["I need an \"action\" card.","「アクション」の カードが ほしい。"]],
  /* 画家の ルナ */
  [["The light here is beautiful.","ここの 光、 きれい。"],["I want to paint this shop.","この お店を 絵に かきたい。"],["What a nice blue.","いい 青色ね。"],["Colors make me happy.","色を 見ると 元気が 出る。"]],
  /* カード集めの タク */
  [["Is there anything rare?","なにか レアなの ある？"],["I need one more for my set!","セットまで あと 1まい！"],["I collect every card!","ぜんぶ 集めてるんだ！"],["Got it… got it… need it!","持ってる… 持ってる… ほしい！"]],
  /* パン屋の メイ */
  [["I just baked some bread!","パン、 焼きたてだよ！"],["Any cards about food?","食べ物の カード ある？"],["It smells like the sea here.","ここ、 海の においが する。"],["Break time! Just ten minutes.","休けい！ 10分だけね。"]],
  /* 郵便屋さんの ポール */
  [["Mail for you! Just kidding.","郵便です！ …なんてね。"],["I walk all over this town.","この 町じゅう 歩いてるよ。"],["One more street, then lunch!","あと 1本 回ったら お昼！"],["Do you have a card that says \"letter\"?","「letter」の カード ある？"]],
  /* 看護師の サラ */
  [["I just finished my night shift.","夜勤が 終わった ところ。"],["Drink some water, OK?","お水 ちゃんと 飲んでね。"],["Cards help me relax.","カードを 見ると ほっと する。"],["I'm off today. Finally!","きょうは お休み。 やっと！"]],
  /* 大工の ダイさん */
  [["This shelf is well made.","この たな、 いい つくりだな。"],["I built a house by the beach.","浜辺に 家を 建てたんだ。"],["Measure twice, cut once!","2回 はかって、 1回で 切る！"],["Got any cards about tools?","道具の カード あるかい？"]],
  /* 花屋の リリー */
  [["I brought some flowers for Mio!","ミオさんに お花 もってきたの！"],["Sunflowers are my favorite.","ひまわりが いちばん 好き。"],["The shop looks so pretty today.","きょうの お店、 すごく かわいい。"],["Any cards about plants?","植物の カード ある？"]],
  /* 写真家の トム */
  [["The light is perfect right now.","いま、 光が ちょうど いい。"],["Can I take a picture of the shop?","お店の 写真、 とっても いい？"],["Click! Oh, sorry. Habit.","カシャッ！ あ、 ごめん。 くせで。"],["I'm looking for animal cards.","動物の カードを さがしてるんだ。"]],
  /* 大学生の ユキ */
  [["I have an English test next week.","来週 英語の テストなの。"],["This song in my headphones is so good.","ヘッドホンの この 曲、 すごく いい。"],["I study here sometimes. It's quiet.","ときどき ここで 勉強するの。 しずかだから。"],["One word a day. That's my rule.","1日 1単語。 それが わたしの ルール。"]]]};

/* ミナ先生の セリフ */
Object.assign(MINA_LINES,{
 sh_mutNew:[['wow','カードショップの カウンター、 ミオさんと お客さんが 英語で つぶやくように なったよ！ ふきだしを タップすると 読んでくれるの'],['happy','お店の カウンターで、 ミオさんや お客さんの ひとりごとが 英語で 聞けるよ。 みじかい 英語は まねしやすいの']],
 x_shMutter:[['smile','カウンターの ふきだし、 読んでる？ 「Take your time.」は 「ゆっくり どうぞ」。 お店で よく 使う 英語だよ'],['proud','お客さんの ひとりごと、 時間帯で 変わるんだって。 夜は 「Good evening!」 だね'],['happy','ミオさんの つぶやき、 英語の 練習も まざってるよ。 いっしょに 声に 出して みよう'],['think','ふきだしの 英語、 わからない 単語は あった？ 日本語を 見る 前に、 意味を 考えて みてね']]});
