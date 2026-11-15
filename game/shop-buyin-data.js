/* カウンターに カードを 売りに 来る お客さん（しくみは game/shop-serve.js の buy、 店の 動きは game/shop.js）
   会話の 形は game/shop-serve-data.js と 同じ: {g:[お客の 英語, 日本語], o:[[店長（または ミオ）の 英語, 日本語, つぎ], ...]}
   {w} = カードの 単語、 {ja} = 意味、 {p} = いまの 買い取り 値段、 {hi} = お客の 言い値、 {bp} = ふつうの 買い取り 値段、 {mid} = あいだ、 {lo} = ミオの 値切り、 {sp} = お店の 売り値
   値段: ふつうは 売り値の 7わり（{bp}）。 言い値は 9わり、 ミオが うっかり 売り値で 買っても 損は しない（もうけが ないだけ） */

/* カードを 出す ときの ひとこと */
const SB_OFFER=[
 ["Hi! Would you buy this card?","こんにちは！ この カード、 買い取って もらえる？"],
 ["I have a card I don't need. Can I sell it here?","いらない カードが あるんだけど、 ここで 売れる？"],
 ["Do you buy cards? I have this one.","カードの 買い取り してる？ これ なんだけど。"],
 ["I got two of the same card. Want one?","同じ カードが 2まい あってね。 1まい いる？"],
 ["Could you take a look at this card?","この カード、 ちょっと 見てくれる？"]];

/* 店長（ミオ）の さいごの 返事 */
const SB_SAY={
 buy:[["Sure! We'll buy it for {p} coins.","はい！ {p}コインで 買い取ります。"],["Thank you! Here are {p} coins.","ありがとうございます！ {p}コインです。"],["It's a deal. {p} coins for you.","決まりですね。 {p}コイン どうぞ。"]],
 thanks:[["Thanks! Take good care of it.","ありがとう！ 大事に してね。"],["Great! I'm glad it found a new home.","よかった！ 新しい おうちが 見つかって うれしい。"],["Yay! Now I can buy a snack.","やった！ これで おやつが 買える。"]],
 no:[["Sorry, not this time.","ごめんなさい、 今回は えんりょ します。"],["We have enough of these. Sorry!","その カードは もう じゅうぶん あるんです。 ごめんなさい！"]],
 noOk:[["That's OK. I'll keep it, then.","いいよ。 じゃあ 自分で とっておく。"],["No problem. Maybe next time!","だいじょうぶ。 また こんど！"]],
 poor:[["Sorry, I don't have enough coins right now.","ごめんなさい、 いま コインが たりなくて。"],["I'd love to, but my wallet is empty today.","買いたいけど、 きょうは おさいふが からっぽで。"]],
 poorOk:[["No worries! I'll come back another day.","気に しないで！ また 別の 日に 来るね。"],["That's fine. Good luck with the shop!","いいよ。 お店、 がんばってね！"]],
 mioPoor:[["Boss's wallet is… a little light today. Sorry!","店長の おさいふ… きょうは ちょっと かるくて。 ごめんなさい！"],["Oh no, we don't have enough coins. Please come again!","うわ、 コインが たりない。 また 来てください！"]]};

/* ミオが まかされた ときの はじめの ひとこと */
const SB_MIO={hi:[["Welcome! Oh, you want to sell a card? Let me see!","いらっしゃいませ！ カードを 売りに？ 見せてください！"],["Hi, {n}! A card for us? How exciting!","{n}さん、 こんにちは！ カードを 持ってきてくれたんですか？ わくわく！"],["Hello! I'm in charge today. Let's see that card!","こんにちは！ きょうは わたしが 担当です。 カード、 見せて ください！"]],
 done:[["Boss, I bought a card! Look, look!","店長、 カードを 買い取りました！ 見て 見て！"],["A new card for our shop! Did I do OK?","お店に 新しい カード！ ちゃんと できました？"],["I checked it very carefully. Not a scratch!","すみずみまで 見ました。 キズ ひとつ なし！"]]};

/* 値段の 相談 */
const SB_DEAL={
 g:[["Hmm… could you make it {hi} coins?","うーん… {hi}コインに ならない？"],["This one is in perfect shape. How about {hi} coins?","これ、 ピカピカだよ。 {hi}コインで どう？"],["My friend said it's worth {hi} coins.","友だちが {hi}コインの 価値が あるって。"]],
 o:[["OK. {hi} coins it is.","いいですよ。 {hi}コインで。",{g:["Really? Thank you so much!","ほんと？ ありがとう！"]},{to:'hi'}],
  ["How about {bp} coins?","{bp}コインで どうですか？",null,{to:'bp'}],
  ["Let's meet in the middle. {mid} coins?","あいだを とって {mid}コインは？",{g:["Meet in the middle… OK, deal!","あいだを とって… うん、 それで いい！"]},{to:'mid'}]],
 bpYes:[["Hmm… OK, {bp} is fine.","うーん… いいよ、 {bp}で。"],["Fair enough. Deal!","まあ そうだね。 それで いいよ！"]],
 bpMid:[["{bp}? How about {mid}? Please!","{bp}？ {mid}で どう？ おねがい！"],["A little more? {mid} coins?","もう ちょっと… {mid}コインは？"]],
 midOk:[["OK, {mid} coins.","わかりました、 {mid}コインで。"]],
 /* ミオの 値切り（うまく いく） */
 mioHag:[["Hmm, it has a tiny bend here… How about {lo} coins?","うーん、 ここ ちょっと まがってますね… {lo}コインで どうです？"],["Our card box is a little full… {lo} coins, please?","うちの カード箱、 ちょっと いっぱいで… {lo}コインで おねがい？"]],
 mioHagOk:[["Ha ha, you're good, Mio! OK, {lo}.","はは、 ミオちゃん やるねえ！ いいよ、 {lo}で。"],["Fine, fine. You win!","わかった、 わかった。 ミオちゃんの 勝ち！"]],
 /* ミオの おっちょこちょい（売り値で 買って しまう） */
 mioOops:[["Sure! {sp} coins!","いいですよ！ {sp}コイン！"]],
 mioOops2:[["…Wait. {sp} is the price we SELL it for. Oops! Well, we didn't lose anything!","…まって。 {sp}って うちの 売り値だ。 あちゃー！ まあ、 損は してないですよね！"]]};

/* 意味を 聞かれる（拾った・もらった カードの 意味が わからない） */
const SB_MEAN={
 ask:[["I found this card on the beach. What does \"{w}\" mean?","浜辺で この カードを 拾ったの。 「{w}」って どういう 意味？"],
  ["My uncle gave me this card, but I can't read it. What does it mean?","おじさんに もらったけど 読めないの。 どういう 意味？"],
  ["Before I sell it… what does \"{w}\" mean?","売る 前に… 「{w}」って どういう 意味？"]],
 ok:[["Oh, I see! Thanks for the lesson. I'll make it cheaper: {p} coins.","そうなんだ！ 教えてくれた お礼に 少し 安く するね。 {p}コイン。"],["Now I know! You're like a teacher. {p} coins is enough.","わかった！ 先生 みたい。 {p}コインで いいよ。"]],
 hm:["Hmm? Is that right?","ん？ そうなの？"],
 fix:["Boss, I think it means “{ja}.”","店長、 たぶん 「{ja}」ですよ。"],
 oops:["Oops! I mean “{ja}.”","あっ、 ちがった！ 「{ja}」です。"]};

/* レア？ と 聞かれる */
const SB_RARE={
 ask:[["Is this card rare? My friend says it is.","この カード、 レア？ 友だちは そうだって。"],["Be honest. Is this one rare?","正直に 言って。 これ、 レア？"]],
 yes:["Yes! It's a rare card.","はい！ レアな カードですよ。"],
 nope:["No, it's a common card.","いいえ、 よく ある カードです。"],
 gotY:[["Really?! Wow, I'm so lucky!","ほんと？！ わあ、 ラッキー！"],["I knew it! I could feel it.","やっぱり！ そんな 気が してた。"]],
 gotN:[["Oh well. I like it anyway!","そっか。 でも 好きだよ！"],["Ha ha, my friend was joking, then.","はは、 友だちに からかわれたんだ。"]],
 note:"📝 rare ＝ めずらしい（レア）、 common ＝ よく ある"};

/* もう 持ってる？ と 聞かれる（店長が まだ 持っていない カードの とき） */
const SB_HAVE={
 ask:[["Do you already have this card?","この カード、 もう 持ってる？"],["Is this one new for your shop?","これ、 お店に とって 新しい？"]],
 no:["No, we don't have it yet. It's new for us!","いいえ、 まだ 持ってないです。 うちには 新しい！"],
 yes:["Yes, we already have it.","はい、 もう 持ってます。"],
 gotN:[["Great! Then it's perfect for you.","よかった！ じゃあ ぴったりだね。"]],
 gotY:[["Hmm, are you sure? Check again!","うーん、 ほんとに？ もう一回 見て！"]],
 note:"📝 Do you have 〜? ＝ 〜を 持ってる？ ／ not yet ＝ まだ"};

/* まちがえて 持ってきた（ちがう カードに かえる） */
const SB_OOPS={
 g:[["Oh no, wait! This is my favorite one. I can't sell it!","あっ、 まって！ これ、 いちばん 大事な やつ。 売れない！"],
  ["Huh? This isn't the card I meant to bring!","あれ？ 持ってくる つもりの カードじゃ ない！"],
  ["Oops, this one is my little sister's. She'd be so mad!","おっと、 これは 妹のだ。 おこられちゃう！"]],
 me:[["No problem. Take your time.","だいじょうぶ。 ゆっくり どうぞ。"],["Ha ha, that happens!","はは、 よく ありますよ！"]],
 swap:[["Here's the right one: \"{w}.\"","こっちが ほんとの カード: 「{w}」。"],["Found it! This is the one: \"{w}.\"","あった！ これ これ: 「{w}」。"]]};

/* カードの 思い出・どこで 見つけたか（お客さん ひとりずつ、 SV_WHO と 同じ じゅんばん） */
const SB_STORY=[
 /* りょうしの ゲンさん */
 [{g:["This card got caught in my fishing net. Can you believe it?","この カード、 あみに ひっかかってたんだ。 信じられるかい？"],o:[
   ["In your net? That's amazing!","あみに？ すごい！",{g:["Ha ha! A fish of paper. Lucky catch!","はっはっ！ 紙の 魚だな。 ラッキーな 大漁だ！"]}],
   ["Is it wet?","ぬれてません？",{g:["I dried it in the sun all morning. It's fine now.","朝の あいだ ずっと 天日干し したよ。 もう だいじょうぶ。"]}]]},
  {g:["My grandson has two of these. He told me to sell one.","孫が これを 2まい 持っててね。 1まい 売ってきてって。"],o:[
   ["What a smart grandson!","かしこい お孫さんですね！",{g:["He wants to buy a new card with the coins. Smart, eh?","その コインで 新しい カードを 買うんだって。 かしこいだろ？"]}],
   ["Say hi to him for me.","よろしく 伝えてください。",{g:["I will! He'll be happy.","伝えるよ！ よろこぶぞ。"]}]]}],
 /* 旅行中の アンナ */
 [{g:["I bought this card in another town, but I have too many now.","ほかの 町で 買ったんだけど、 もう 多すぎて。"],o:[
   ["Your bag must be heavy!","かばん、 重そう！",{g:["So heavy! Cards and souvenirs everywhere.","すっごく！ カードと おみやげで いっぱい。"]}],
   ["Which town?","どこの 町ですか？",{g:["A little town in the mountains. It snowed there!","山の 小さな 町。 雪が ふってたの！"]}]]},
  {g:["I'm going home next week. I can't take every card with me.","来週 国に 帰るの。 カード ぜんぶは 持って いけなくて。"],o:[
   ["We'll take good care of it.","大事に しますね。",{g:["Thank you. Now a piece of me stays at this beach.","ありがとう。 これで わたしの かけらが この 浜辺に のこるね。"]}],
   ["Come back to visit!","また 遊びに 来てね！",{g:["Of course! I'll buy it back then. Ha ha!","もちろん！ そのとき 買いもどすね。 あはは！"]}]]}],
 /* 学生の ケン */
 [{g:["I need coins for a new pencil case. So I'm selling this.","新しい 筆箱が ほしくて。 だから これを 売るんだ。"],o:[
   ["Good plan!","いい 考えだね！",{g:["Right? I'll study harder with a new pencil case!","でしょ？ 新しい 筆箱で もっと 勉強する！"]}],
   ["Are you sure?","ほんとに いいの？",{g:["Yes. I already know this word by heart!","うん。 この 単語は もう 覚えたから！"]}]]},
  {g:["I traded with my friend and got two of the same card. Oops.","友だちと 交換したら 同じ カードが 2まいに なっちゃった。"],o:[
   ["That happens!","よく あるよね！",{g:["Next time I'll check my cards first.","次は 先に 自分の カードを 見てから 交換する。"]}],
   ["Double luck!","ダブルの ラッキーだね！",{g:["Ha ha! Double luck, half sold.","はは！ ダブルの ラッキー、 半分 売る。"]}]]}],
 /* あみものの ハルさん */
 [{g:["I found this card in my knitting basket. I wonder how it got there.","あみものの かごに この カードが 入ってたの。 どうして かしら。"],o:[
   ["Maybe your cat?","ねこちゃんかも？",{g:["Oh, you're right! Mimi loves to hide things.","あら、 そうかも！ ミミは かくすのが 好きなの。"]}],
   ["A little mystery!","小さな なぞですね！",{g:["Yes. The beach is full of little mysteries.","そうね。 浜辺は 小さな なぞで いっぱい。"]}]]},
  {g:["My granddaughter gave me this, but my eyes are too old for small letters.","孫が くれたんだけど、 小さい 字は もう 見えなくてね。"],o:[
   ["I can read it for you.","かわりに 読みましょうか。",{g:["Oh, how kind. Your English is lovely.","まあ、 やさしい。 あなたの 英語、 すてきね。"]}],
   ["We'll find it a good home.","いい 持ち主を さがしますね。",{g:["Thank you, dear.","ありがとうね。"]}]]}],
 /* サーファーの ジョー */
 [{g:["This card washed up on the beach with the morning waves.","けさの 波で この カードが 打ち上げられてたんだ。"],o:[
   ["A gift from the sea!","海からの おくりもの！",{g:["Exactly! The sea gives, the sea takes.","そのとおり！ 海は あたえ、 海は うばう。"]}],
   ["Were the waves good?","波は よかった？",{g:["Perfect! I rode five big ones.","最高！ 大きいのを 5本 乗ったよ。"]}]]},
  {g:["I need coins for new wax for my board.","ボードの ワックスを 買う コインが いるんだ。"],o:[
   ["Wax for the board?","ボードの ワックス？",{g:["Yeah, so my feet don't slip. Safety first!","そう、 足が すべらない ように。 安全 第一！"]}],
   ["Ride a big wave for us!","大きな 波に 乗ってね！",{g:["I will! Watch from the window.","まかせて！ 窓から 見てて。"]}]]}],
 /* 画家の ルナ */
 [{g:["I painted a picture of this card's word. Now I don't need the card.","この カードの 単語を 絵に したの。 だから カードは もう いいの。"],o:[
   ["Can I see the picture?","その 絵、 見てみたい！",{g:["Next time! It's still drying.","今度ね！ まだ かわいてないの。"]}],
   ["What a nice way to remember words!","単語の すてきな 覚え方！",{g:["Right? A word becomes a picture in my head.","でしょ？ 単語が 頭の 中で 絵に なるの。"]}]]},
  {g:["The colors on this card are pretty, but I have two.","この カード、 色が きれい。 でも 2まい あるの。"],o:[
   ["Which color do you like?","何色が 好き？",{g:["Sea green. Like the water in the morning.","海の みどり。 朝の 水の 色。"]}],
   ["Then let's share the pretty colors.","じゃあ きれいな 色を おすそわけ。",{g:["I like that! Share the colors.","いいね！ 色の おすそわけ。"]}]]}],
 /* カード集めの タク */
 [{g:["I'm a collector. I sell my doubles to buy new ones.","コレクターだからね。 ダブったのを 売って 新しいのを 買うんだ。"],o:[
   ["How many cards do you have?","何まい 持ってるの？",{g:["Three hundred and twelve. But who's counting?","312まい。 まあ、 数えて ないけどね。"]}],
   ["A real collector!","本物の コレクター！",{g:["Ha ha, thanks. You'll be one too, boss!","はは、 ありがと。 店長も すぐ なれるよ！"]}]]},
  {g:["Psst… I heard you're looking for new cards. Look at this one.","ねえねえ… 新しい カードを さがしてるって 聞いたよ。 これ 見て。"],o:[
   ["Where did you hear that?","どこで 聞いたの？",{g:["Collectors have their own news. Ha ha.","コレクターには コレクターの うわさが あるのさ。 はは。"]}],
   ["Show me!","見せて！",{g:["Ta-da! Nice, right?","じゃーん！ いいでしょ？"]}]]}],
 /* パン屋の メイ */
 [{g:["A customer forgot this card at my bakery a month ago. Nobody came back for it.","ひと月前に お客さんが うちの パン屋に わすれていったの。 だれも とりに 来なくて。"],o:[
   ["That's too bad.","ざんねんですね。",{g:["I know. But now it can make someone else happy.","ね。 でも これで ほかの 人を しあわせに できるわ。"]}],
   ["It smells like bread!","パンの においが する！",{g:["Ha ha! It sat next to the croissants.","あはは！ クロワッサンの となりに あったから。"]}]]},
  {g:["I'm saving coins for a new oven.","新しい オーブンの ために コインを ためてるの。"],o:[
   ["New bread is coming?","新しい パンが 出るんですか？",{g:["Maybe! A bigger oven means bigger loaves.","かもね！ 大きい オーブンなら 大きい パンが 焼ける。"]}],
   ["I'll buy your bread, too!","パンも 買いに 行きます！",{g:["Deal! The first loaf is for you.","決まり！ 最初の パンは あなたに。"]}]]}]];

/* だれでも 話す 思い出 */
const SB_STORY_ANY=[
 {g:["I found it between the rocks at low tide.","引き潮の とき、 岩の あいだで 見つけたの。"],o:[
   ["What else did you find?","ほかに なにが あった？",{g:["A tiny crab. It said hello… I think.","小さな カニ。 あいさつ してくれた… 気がする。"]}],
   ["Lucky you!","ラッキー！",{g:["Yes! Low tide is treasure time.","でしょ！ 引き潮は お宝の 時間。"]}]]},
 {g:["This card was in a bottle on the beach!","この カード、 浜辺の びんの 中に 入ってたんだ！"],o:[
   ["A message in a bottle?","ボトルメール？",{g:["Just the card. Maybe the sea wants you to have it.","カードだけ。 海が きみに わたしたかったのかも。"]}],
   ["How romantic!","ロマンチック！",{g:["Right? I almost kept it. Almost.","でしょ？ とっておこうか 迷ったよ。 ちょっとだけ。"]}]]},
 {g:["I used this card to study for a long time. Now I know the word.","この カードで 長い あいだ 勉強したの。 もう 単語は 覚えた。"],o:[
   ["Good job!","よく がんばったね！",{g:["Thanks! Now it's someone else's turn to learn it.","ありがとう！ 次は ほかの 人が 覚える 番。"]}],
   ["Can you use it in a sentence?","文で 使える？",{g:["Hmm… let me think. Yes! I'll tell you next time.","うーん… まって。 言える！ 次に 来たとき 教えるね。"]}]]},
 {g:["I cleaned my room and found this under the bed.","部屋を そうじ したら ベッドの 下から 出てきたの。"],o:[
   ["Under the bed? Ha ha!","ベッドの 下？ あはは！",{g:["And three socks. But you don't buy socks, right?","くつしたも 3つ。 でも くつしたは 買い取らないよね？"]}],
   ["Your room must be shiny now.","部屋が ピカピカに なったね。",{g:["Shiny and empty! Like my wallet.","ピカピカで からっぽ！ わたしの おさいふ みたいに。"]}]]}];

/* カウンターの つぶやき（売りに 来た お客さん） */
Object.assign(SHOP_MUTTER,{
 g_sellIn:[["I brought a card!","カード 持ってきた！"],["Do they buy cards here?","ここ、 カード 買い取って くれるかな？"],["I hope it's worth something…","いい 値段に なると いいな…"],["Let's see what they say.","なんて 言うかな。"]],
 sellInMio:[["A card for us?!","うちに カード？！"],["Ooh, a seller!","おっ、 売りに 来た 人！"]]});

/* ミナ先生の セリフ（カードの 買い取り） */
Object.assign(MINA_LINES,{
 sh_buyNew:[['wow','お知らせ！ カードショップの カウンターに、 カードを 売りに 来る お客さんも 来るように なったよ。 英語で やりとり して 買い取ると、 カードが ふえるんだ'],['happy','カードを 売りに 来る お客さんが 来るように なったんだって！ まだ 持っていない カードを 持ってくる ことも 多いよ']],
 x_shBuy:[['smile','カードショップには カードを 売りに 来る お客さんも いるよ。 "Would you buy this card?" って 聞かれたら 買い取りの 合図'],['think','買い取った カードは 売り場に ならべると、 少し もうかるよ。 でも お気に入りは ブックに とっておいてもね'],['happy','"Let\'s meet in the middle."（あいだを とろう）は 値段の 相談で 使える 便利な ことばだよ']],
 sh_buyIn:[['happy','「{w}」の カードを 買い取ったね！ 「{ja}」、 ちゃんと 覚えておこうね'],['proud','買い取りの 英語、 じょうずだったよ。 "We\'ll buy it for 〜 coins." って お店で そのまま 使えるね']],
 sh_buyInNew:[['wow','「{w}」は はじめての カードだね！ 「{ja}」。 鉱山で 練習すると すぐ 覚えられるよ'],['love','新しい カードが なかまいり！ 「{w}」、 声に 出して 読んでみよう']],
 sh_buyMio:[['smile','ミオさん、 カードの 買い取りも できるんだね。 "How about 〜 coins?"（〜コインで どう？）って 値段の 相談、 聞いてた？'],['happy','ミオさんの 値段の 相談、 おもしろかったね。 英語で ねぎるのも 会話の 練習だよ']]});
