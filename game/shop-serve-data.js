/* カウンターの お客さんの 対応（しくみは game/shop-serve.js）。 自分で 対応する ときも、 ミオに まかせる ときも 同じ 会話を つかう。
   会話の 形: {g:[お客の 英語, 日本語], o:[[店長（または ミオ）の 英語, 日本語, つぎの 会話], ...]}
   つぎの 会話が {g:[…]} だけなら お客の ひとことで おわり。 own:1 は 店長に 話しかける 会話（ミオの ときは 出さない）、 mio:1 は ミオの ときだけ。
   {w} = カードの 単語、 {ja} = 意味、 {p} = 値段、 {p2} = 割引の 値段、 {rel}/{relj} = プレゼントの 相手 */

/* お客さんの 英語の 名前（ミオが よぶ）・ 顔の アイコン・ プレゼントの 相手（GUESTS と 同じ じゅんばん） */
const SV_WHO=[
 {en:'Gen',ico:'🎣',rel:['grandson','孫']},
 {en:'Anna',ico:'🧳',rel:['friend back home','国の 友だち']},
 {en:'Ken',ico:'🎒',rel:['little sister','妹']},
 {en:'Haru',ico:'🧶',rel:['grandson','孫']},
 {en:'Joe',ico:'🏄',rel:['surfing buddy','サーフィン仲間']},
 {en:'Luna',ico:'🎨',rel:['art teacher','絵の 先生']},
 {en:'Taku',ico:'🃏',rel:['best friend','親友']},
 {en:'Mei',ico:'🥐',rel:['daughter','娘']}];

/* 世間話: お客さん ひとりずつ（GUESTS と 同じ じゅんばん） */
const SV_CHAT=[
 /* りょうしの ゲンさん */
 [{g:["I caught a huge fish this morning!","けさ でっかい 魚を つったよ！"],o:[
   ["Wow! How big was it?","わあ！ どのくらい 大きかったんですか？",{g:["This big! Well… maybe a little smaller.","これくらい！ …いや、 もう少し 小さかったかな。"]}],
   ["What kind of fish?","どんな 魚ですか？",{g:["A big red snapper. I'll grill it tonight.","大きな タイだよ。 今夜 焼いて 食べるんだ。"]}],
   ["Lucky you!","いいですね！",{g:["Ha ha! The sea was kind to me today.","はっはっ！ きょうは 海が やさしかったよ。"]}]]},
  {g:["The wind is strong today. Good thing I came back early.","きょうは 風が 強い。 早めに もどって よかったよ。"],o:[
   ["Please be careful out there.","海では 気をつけてくださいね。",{g:["Thank you. Fifty years at sea, and I'm still careful.","ありがとう。 海に 出て 50年、 いまでも 気をつけてるよ。"]}],
   ["Is the sea rough?","海は あれてますか？",{g:["A little. The waves are taller than me!","少しね。 波が わしより 高いんだ！"]}]]},
  {g:["My grandson loves these cards. He's six.","孫が この カードが 大すきでね。 6さいなんだ。"],o:[
   ["Is this card for him?","この カードは お孫さんに ですか？",{g:["Yes! He's learning English words now.","そう！ いま 英語の 単語を おぼえてるんだ。"]}],
   ["Please bring him next time!","今度 つれてきてください！",{g:["I will. He'll be so happy.","そうするよ。 きっと よろこぶ。"]}]]}],
 /* 旅行中の アンナ */
 [{g:["This beach is beautiful! It's my first time in Japan.","この 浜辺、 きれい！ 日本は はじめてなの。"],o:[
   ["Welcome! Where are you from?","ようこそ！ どこから 来たんですか？",{g:["I'm from Canada. It's very cold there now!","カナダから。 いま むこうは すごく 寒いの！"]}],
   ["How long are you staying?","どのくらい いるんですか？",{g:["Two weeks. I want to see everything!","2週間。 ぜんぶ 見たいの！"]}]]},
  {g:["Can you recommend a good place to eat?","おいしい お店、 おすすめ ある？"],o:[
   ["Try the Shiokaze Diner. Marco's food is great.","しおかぜ食堂が いいですよ。 マルコさんの 料理は 最高です。",{g:["Thanks! I'll go there for lunch.","ありがとう！ お昼に 行ってみる。"]}],
   ["Mei's bakery has great bread.","メイさんの パン屋さんの パンが おいしいですよ。",{g:["A bakery? I love bread!","パン屋さん？ パン 大すき！"]}]]},
  {g:["I collect one card from every town I visit.","行った 町ごとに カードを 1まい 集めてるの。"],o:[
   ["What a nice idea!","すてきな アイデアですね！",{g:["Thanks! This one will remind me of this beach.","ありがとう！ これを 見たら この 浜辺を 思い出すわ。"]}],
   ["How many do you have?","何まい 持ってるんですか？",{g:["Twelve! This will be number thirteen.","12まい！ これで 13まい目。"]}]]}],
 /* 学生の ケン */
 [{g:["I have an English test tomorrow…","あした 英語の テストなんだ…"],o:[
   ["Good luck! You can do it.","がんばって！ きみなら できるよ。",{g:["Thanks! I'll study with this card tonight.","ありがとう！ 今夜 この カードで 勉強する。"]}],
   ["What's the test about?","なんの テスト？",{g:["Irregular verbs. \"Go, went, gone\"… so hard!","不規則動詞。 「go, went, gone」… むずかしい！"],o:[
     ["Try saying them out loud.","声に 出して 言ってみて。",{g:["Go, went, gone. Go, went, gone… OK, I've got it!","go, went, gone。 go, went, gone… よし、 おぼえた！"]}],
     ["You'll be fine.","だいじょうぶだよ。",{g:["I hope so!","だと いいな！"]}]]}]]},
  {g:["I came here right after school.","学校の 帰りに そのまま 来たんだ。"],o:[
   ["Did you have a good day?","いい 一日だった？",{g:["Yes! We played soccer in P.E.","うん！ 体育で サッカー したんだ。"]}],
   ["Don't forget your homework!","宿題 わすれないでね！",{g:["Oh no… I forgot about it!","あっ… わすれてた！"]}]]},
  {g:["My friend has more cards than me.","友だちの ほうが ぼくより カード 持ってるんだ。"],o:[
   ["It's not about how many.","数じゃ ないよ。",{g:["You're right. I know every word on my cards!","そうだね。 ぼく、 自分の カードの 単語は ぜんぶ 知ってる！"]}],
   ["You'll catch up soon.","すぐ 追いつくよ。",{g:["I hope so! I'm saving my allowance.","だと いいな！ おこづかい ためてるんだ。"]}]]}],
 /* あみものの ハルさん */
 [{g:["I'm knitting a scarf for my husband.","夫に マフラーを あんでるの。"],o:[
   ["That's so sweet!","すてきですね！",{g:["He doesn't know yet. It's a secret!","まだ 知らないのよ。 ひみつよ！"]}],
   ["What color is it?","何色ですか？",{g:["Sea blue, like this beach.","海の 青。 この 浜辺みたいな。"]}]]},
  {own:1,g:["I baked some cookies for you and Mio.","あなたと ミオちゃんに クッキーを 焼いてきたの。"],o:[
   ["Thank you so much!","本当に ありがとうございます！",{g:["You're welcome. I baked too many again.","どういたしまして。 また 焼きすぎちゃって。"]}],
   ["Did you make them yourself?","手作りですか？",{g:["Yes. It's my grandmother's recipe.","そうよ。 祖母の レシピなの。"]}]]},
  {g:["I walk on the beach every morning.","毎朝 浜辺を 散歩してるの。"],o:[
   ["That sounds nice.","いいですね。",{g:["The morning sea is the best medicine.","朝の 海が いちばんの くすりよ。"]}],
   ["Do you find any shells?","貝がら、 見つかりますか？",{g:["Sometimes. I found a pink one yesterday.","ときどきね。 きのうは ピンクのを 見つけたわ。"]}]]}],
 /* サーファーの ジョー */
 [{g:["The waves were awesome today, dude!","きょうの 波、 最高だったぜ！"],o:[
   ["Did you ride a big one?","大きいのに 乗れた？",{g:["Yeah! I rode it all the way to the beach!","おう！ 浜まで ずっと 乗ったぜ！"]}],
   ["I want to try surfing too.","サーフィン、 やってみたいな。",{g:["Really? I'll teach you sometime!","マジ？ 今度 教えるよ！"]}]]},
  {g:["I'm so hungry after surfing.","サーフィンの あとは 腹ぺこだよ。"],o:[
   ["The diner is open now.","食堂、 いま あいてるよ。",{g:["Nice! Marco's food, here I come!","よし！ マルコさんの 料理、 いま 行くぜ！"]}],
   ["Want a snack?","おやつ いる？",{g:["No thanks. I'm saving room for dinner!","いや、 だいじょうぶ。 夕飯の ために おなか あけとく！"]}]]},
  {own:1,g:["Do you surf, boss?","店長は サーフィン するの？"],o:[
   ["No, but I like to watch.","ううん、 でも 見るのは すき。",{g:["Watching is fun too. The sea looks different every day.","見るのも 楽しいよな。 海は 毎日 ちがう 顔だし。"]}],
   ["Not yet!","まだ！",{g:["\"Not yet\"? I like that answer!","「まだ」？ いい 答えだね！"]}]]}],
 /* 画家の ルナ */
 [{g:["I'm painting the sunset this week.","今週は 夕日を 描いてるの。"],o:[
   ["I'd love to see it!","見てみたい！",{g:["When it's done, I'll show you first.","できたら いちばんに 見せるね。"]}],
   ["What colors do you use?","何色を 使うの？",{g:["Orange, pink, and a little purple.","オレンジ、 ピンク、 それに 少しの むらさき。"]}]]},
  {g:["The pictures on your cards are cute.","ここの カードの 絵、 かわいいね。"],o:[
   ["Thank you! Which ones do you like?","ありがとう！ どれが すき？",{g:["The animal ones. They look so happy.","動物の カード。 みんな うれしそう。"]}],
   ["You should draw a card too!","ルナさんも カードを 描いてよ！",{g:["Me? Maybe… That sounds fun!","わたしが？ そうね… 楽しそう！"]}]]},
  {g:["I lost my favorite brush in the sand.","お気に入りの 筆を 砂浜で なくしちゃった。"],o:[
   ["Oh no! Shall I help you look?","ええっ！ いっしょに さがそうか？",{g:["That's kind. But I think the sea took it.","やさしいね。 でも 海が もっていったみたい。"]}],
   ["Maybe the zakka shop has one.","雑貨店に あるかも。",{g:["Good idea! I'll ask Nora.","いい 考え！ ノラさんに 聞いてみる。"]}]]}],
 /* カード集めの タク */
 [{g:["I have three hundred cards at home!","家に カードが 300まい あるんだ！"],o:[
   ["Wow, that's a lot!","わあ、 たくさん！",{g:["And I know what every word means!","しかも 単語の 意味は ぜんぶ わかるよ！"]}],
   ["Which one is your favorite?","いちばん すきな カードは？",{g:["A treasure card I got last summer. It shines!","去年の 夏に 手に 入れた 宝カード。 光るんだ！"]}]]},
  {g:["Have you been to the mine lately?","最近 鉱山に 行った？"],o:[
   ["Yes, I went this morning.","うん、 けさ 行ったよ。",{g:["Lucky! Did you find anything rare?","いいなあ！ なにか レアなの 出た？"],o:[
     ["Just one. It's a secret!","1まいだけ。 ひみつ！",{g:["No fair! Tell me next time!","ずるい！ 今度 教えてよ！"]}],
     ["Not this time.","今回は なし。",{g:["Next time for sure!","つぎこそ きっと！"]}]]}],
   ["Not today.","きょうは まだ。",{g:["Go! I heard rare cards are deep down.","行きなよ！ レアは 深い ところに あるって。"]}]]},
  {g:["Can we trade cards someday?","いつか カード 交換してくれる？"],o:[
   ["Sure! Bring your doubles.","いいよ！ ダブりを もってきて。",{g:["Deal! I have lots of doubles.","決まり！ ダブり いっぱい あるんだ。"]}],
   ["Maybe. Show me what you have first.","どうかな。 まず なにを 持ってるか 見せて。",{g:["Ha ha, you sound like a real shop owner!","はは、 さすが お店の 人だね！"]}]]}],
 /* パン屋の メイ */
 [{g:["I just took fresh bread out of the oven!","焼きたての パンが できたところ！"],o:[
   ["It smells so good!","いい においだね！",{g:["Here, have one. It's still warm.","はい、 1つ どうぞ。 まだ あったかいよ。"]}],
   ["What kind of bread?","どんな パン？",{g:["Melon bread! It's my best seller.","メロンパン！ いちばん 人気なの。"]}]]},
  {g:["I get up at four every morning.","毎朝 4時に 起きるの。"],o:[
   ["Four? That's so early!","4時？ すごく 早い！",{g:["Bread doesn't wait! But I love it.","パンは 待ってくれないの！ でも すきなの。"]}],
   ["You must be tired.","つかれるでしょう。",{g:["A little. That's why I take a nap after lunch.","少しね。 だから お昼の あと ひるねするの。"]}]]},
  {g:["I want to give my new bread an English name.","新しい パンに 英語の 名前を つけたいの。"],o:[
   ["How about \"Sunny Bun\"?","「サニーバン」は どう？",{g:["Sunny Bun… I love it! Thank you!","サニーバン… いい！ ありがとう！"]}],
   ["How about \"Beach Bread\"?","「ビーチブレッド」は？",{g:["Beach Bread! Simple and cute.","ビーチブレッド！ シンプルで かわいい。"]}]]}]];

/* 世間話: だれでも（時間帯 day/dusk/night と any） */
const SV_CHAT_ANY={
 day:[{g:["Nice weather today, isn't it?","きょうは いい 天気ですね。"],o:[
   ["Yes, it's perfect beach weather.","ええ、 浜辺 びよりです。",{g:["I might take a walk after this.","このあと 散歩しようかな。"]}],
   ["It's a little hot, though.","ちょっと 暑いですけどね。",{g:["True. Don't forget to drink water!","たしかに。 水を 飲むのを わすれずに！"]}]]}],
 dusk:[{g:["The sunset looks beautiful from here.","ここから 見る 夕日、 きれい。"],o:[
   ["It's my favorite view.","いちばん すきな ながめです。",{g:["I can see why.","わかるなあ。"]}],
   ["It's even better from the cape.","岬から 見ると もっと きれいですよ。",{g:["The cape? I'll go tomorrow.","岬？ あした 行ってみる。"]}]]}],
 night:[{g:["You're open late tonight!","今夜は おそくまで あいてるんだね！"],o:[
   ["We love night customers.","夜の お客さんも 大歓迎です。",{g:["Ha ha. And the stars are out, too.","はは。 星も 出てるしね。"]}],
   ["Just for a little longer.","もう 少しだけです。",{g:["Then I'm lucky I came now.","じゃあ いま 来て ラッキーだった。"]}]]}],
 any:[{g:["How's business today?","きょうの 売れゆきは どう？"],o:[
   ["Pretty good, thanks!","なかなか いいですよ！",{g:["Glad to hear it!","よかった！"]}],
   ["A little slow today.","きょうは ちょっと ひまです。",{g:["Then I'll buy one more next time!","じゃあ 今度は もう1まい 買うね！"]}]]},
  {own:1,g:["Is Mio working today?","きょうは ミオちゃん いる？"],o:[
   ["Yes, she's right over there.","うん、 そこに いるよ。",{g:["Hi, Mio! Don't drop anything today!","ミオちゃん、 やっほー！ きょうは 落とさないでね！"]}],
   ["She's studying English now.","いま 英語の 勉強中。",{g:["She works so hard.","がんばりやさんだね。"]}]]},
  {mio:1,g:["Oh, where's the boss today?","あれ、 きょう 店長は？"],o:[
   ["The boss is busy, so I'm helping today!","店長は いそがしいので、 きょうは わたしが 担当です！",{g:["Well, you're doing great, Mio!","ミオちゃん、 よく やってるよ！"]}]]},
  {mio:1,g:["How's your English study going, Mio?","ミオちゃん、 英語の 勉強は どう？"],o:[
   ["Little by little! I learned \"customer\" today.","少しずつです！ きょうは 「customer」を おぼえました。",{g:["Ha ha, that's the perfect word for your job!","はは、 仕事に ぴったりの 単語だね！"]}],
   ["I'm practicing with you right now!","いま あなたと 練習中です！",{g:["Then I'll speak slowly for you.","じゃあ ゆっくり 話すね。"]}]]},
  {mio:1,g:["Mio, you dropped something.","ミオちゃん、 なにか 落としたよ。"],o:[
   ["Oh no! My pen… thank you!","わっ！ わたしの ペン… ありがとうございます！",{g:["Ha ha, you're always so busy.","はは、 いつも いそがしそうだね。"]}]]}]};

/* 意味を 聞かれる（店長が 日本語の 意味を えらぶ） */
const SV_MEAN={
 ask:[["What does \"{w}\" mean?","「{w}」って どういう 意味？"],
  ["I like this card, but I don't know the word \"{w}\".","この カード すきだけど、 「{w}」って 単語を 知らないんだ。"],
  ["Could you tell me what \"{w}\" means in Japanese?","「{w}」が 日本語で なにか 教えてもらえる？"]],
 say:['It means “{ja}.”','「{ja}」という 意味です。'],
 ok:[["Oh, I see! Now I like it even more.","なるほど！ ますます すきに なった。"],["Thanks! I'll remember that.","ありがとう！ おぼえておくね。"],["\"{w}\" means {ja}… Got it!","「{w}」は {ja}… わかった！"]],
 hm:["Hmm… are you sure?","うーん… ほんとに？"],
 fix:["Boss, I think it means “{ja}.”","店長、 「{ja}」だと 思います。"],
 oops:["Wait, no! Sorry, it means “{ja}.”","あっ、 ちがった！ ごめんなさい、 「{ja}」です。"]};

/* プレゼント用 */
const SV_GIFT={g:["It's a present for my {rel}.","{relj}への プレゼントなんだ。"],o:[
  ["Shall I wrap it for you?","おつつみ しましょうか？",{g:["Yes, please! Something cute.","はい、 おねがい！ かわいい 感じで。"],o:[
    ["How about this shell paper?","この 貝がらの 紙は どうですか？",{g:["Perfect! It'll make them smile.","ぴったり！ きっと よろこぶ。"]}],
    ["Blue ribbon or pink ribbon?","青い リボンと ピンクの リボン、 どちらに しますか？",{g:["Blue, like the sea!","青！ 海みたいに。"]}]]}],
  ["Would you like a message card?","メッセージカードは いかがですか？",{g:["Good idea! What should I write?","いいね！ なんて 書こう？"],o:[
    ["How about \"Thank you for everything\"?","「Thank you for everything（いつも ありがとう）」は？",{g:["That's nice. I'll write that.","いいね。 それに する。"]}],
    ["Just \"For you!\" is cute too.","「For you!（あなたに）」だけでも かわいいですよ。",{g:["Short and sweet. I like it!","短くて すてき。 それ いい！"]}]]}],
  ["They're lucky to have you!","その 人、 しあわせですね！",{g:["Ha ha, thanks. I hope they like it.","はは、 ありがとう。 気に入って くれると いいな。"]}]]};

/* 値段の 相談（{p2} は 15% 引き）。 d:1 で 割引、 st:1 で おまけの シール */
const SV_DEAL={g:[["Could you make it a little cheaper?","もう少し 安く ならない？"],["Is there a discount for regulars?","常連さん 割引って ある？"],["I only have {p2} coins… is that OK?","{p2}コインしか ないんだけど… いい？"]],o:[
  ["OK, just this once. {p2} coins.","じゃあ 今回だけ。 {p2}コインで。",{g:["Thank you! I'll come again!","ありがとう！ また 来るね！"]},{d:1}],
  ["Sorry, the price is fixed.","ごめんなさい、 値段は 決まってるんです。",{g:["Fair enough. I'll pay the full price.","そうだよね。 じゃあ 定価で 払うよ。"]}],
  ["How about a free sticker instead?","かわりに シールを おまけ しましょうか？",{g:["A sticker? Deal!","シール？ それで いいよ！"]},{st:1}]]};

/* おすすめを 聞かれる（店長が 売り場から えらぶ。 お客の すきな なかま だと 大よろこび） */
const SV_REC={
 ask:[["I want a card, but I can't decide. Any recommendations?","カードが ほしいけど 決められなくて。 おすすめ ある？"],
  ["I'm looking for something about {at}. What do you have?","{atj}の カードを さがしてるの。 なにが ある？"],
  ["Which card is your favorite on the shelf?","売り場で いちばん おすすめの カードは どれ？"]],
 say:['How about this one? “{w}.”','これは どうですか？ 「{w}」。'],
 love:[["\"{w}\"! That's exactly what I wanted!","「{w}」！ まさに ほしかったの！"],["Oh, I love {at}! Great choice!","{atj}、 大すき！ さすが！"]],
 try:[["\"{w}\"? Hmm… OK, I'll give it a try!","「{w}」？ うーん… ためしに 買ってみる！"],["Interesting! I've never thought about that one.","おもしろい！ それは 考えたこと なかった。"]],
 at:{ani:['animals','いきもの'],food:['food','たべもの'],nat:['nature','しぜん'],heart:['feelings','きもち'],act:['actions','うごき'],look:['how things look','ようす'],life:['everyday life','くらし'],learn:['school','まなび'],word:['words','ことば'],tr:['treasure','お宝'],part:['word parts','ことばの パーツ'],sent:['sentences','英文']}};

/* お会計の あとの ひとこと（ときどき） */
const SV_END=[
 {g:["Do you have a bag?","ふくろ ある？"],o:[
  ["Here you go.","はい、 どうぞ。",{g:["Thanks!","ありがとう！"]}],
  ["It's just one card. Is your pocket OK?","1まいだけなので、 ポケットでも いいですか？",{g:["Sure! Fewer bags are better for the sea.","もちろん！ ふくろが へると 海にも いいしね。"]}]]},
 {g:["Can I pay with these coins? They're a little sandy.","この コインで いい？ ちょっと 砂だらけだけど。"],o:[
  ["No problem! Sand is part of the beach.","だいじょうぶ！ 砂も 浜辺の 一部です。",{g:["Ha ha! You're funny.","はは！ おもしろいね。"]}],
  ["Sure. I'll wipe them off.","いいですよ。 ふいておきます。",{g:["Thanks. Sorry about that.","ありがとう。 ごめんね。"]}]]},
 {g:["Thank you! See you next week.","ありがとう！ また 来週ね。"],o:[
  ["See you! Have a nice weekend.","またね！ いい 週末を。",{g:["You too!","そっちもね！"]}],
  ["Come again anytime!","いつでも また どうぞ！",{g:["I will!","うん、 来る！"]}]]},
 {g:["Can I put it in my card book right away?","すぐ カードブックに 入れても いい？"],o:[
  ["Of course! Take your time.","どうぞ！ ゆっくり。",{g:["It fits perfectly. Yay!","ぴったり 入った。 やった！"]}]]}];

/* やりとり なしの とき（すぐ 売れる） */
const SV_QUICK={g:[["This one, please.","これ ください。"],["I'll take this!","これに する！"],["Just this card, please.","この カードだけ おねがい。"]],
 me:[["Thank you! That's {p} coins.","ありがとうございます！ {p}コインです。"],["{p} coins, please.","{p}コイン いただきます。"],["Thank you!","ありがとうございます！"]],
 pay:[["Here you go.","はい、 どうぞ。"],["Here you are.","はい。"],["Thanks!","ありがとう！"]]};

/* ミオが まかされた とき（はじめと おわり、 店長への ひとこと） */
const SV_MIO={
 hi:[["Welcome to Shiosai! I'll help you today.","しおさいへ ようこそ！ きょうは わたしが 担当します。"],["Hi, {n}! Good to see you again!","{n}さん、 こんにちは！ また 来てくれて うれしいです！"],["Hello! Are you ready to pay?","いらっしゃいませ！ お会計ですか？"]],
 bye:[["Thank you! Come again!","ありがとうございました！ また どうぞ！"],["Have a nice day!","いい 一日を！"],["Bye-bye! Take care!","さようなら！ お気をつけて！"]],
 byeN:[["Thank you! Have a good night!","ありがとうございました！ おやすみなさい！"],["Good night! Watch your step in the dark!","おやすみなさい！ 暗いので 足もとに 気をつけて！"]],
 done:[["How was that, boss? I didn't drop anything!","店長、 どうでした？ なにも 落とさなかったですよ！"],["Sold! Leave it to me, boss!","売れました！ まかせてください、 店長！"],["Phew… I was a little nervous.","ふう… ちょっと きんちょう しました。"],["I said it right, didn't I? I hope so!","ちゃんと 言えてましたよね？ たぶん！"],["Customers are fun! I learned a new phrase.","お客さんって 楽しい！ 新しい 言いまわし おぼえました。"]],
 quizOops:["Oops! I mean…","あっ、 ちがった！ ええと…"]};

/* ミナ先生の セリフ（お客さんの 対応） */
Object.assign(MINA_LINES,{
 sh_serveNew:[['wow','カードショップの カウンターが かわったよ！ お客さんが レジに 来たら、 自分で 対応するか ミオさんに まかせるか えらべるの。 世間話も できるよ'],['happy','お客さんと 世間話が できるように なったんだって！ ミオさんに まかせると、 ミオさんの 英語の 会話も 読めるよ']],
 x_shServe:[['smile','カウンターでは、 えらばずに 少し 待つと ミオさんが 対応してくれるよ。 ミオさんの 会話を ながめるのも 英語の 勉強に なるね'],['proud','お客さんの 「What does 〜 mean?」に 日本語の 意味で 答えるの、 単語の ふくしゅうに ぴったりだよ'],['happy','お客さんの すきな なかまの カードを おすすめすると、 とっても よろこんで くれるよ']],
 sh_selfGood:[['proud','お客さんとの 世間話、 いい 感じ！ 「How was 〜?」みたいな 聞きかえしが できると 会話が つづくよ'],['happy','いまの やりとり、 本物の 店長さんみたいだったよ']],
 sh_meanOk:[['proud','「It means 〜.」で 意味を 教えられたね！ 単語の 意味を 人に 説明できると、 しっかり おぼえられるよ'],['happy','お客さんに 単語の 意味を 教えて あげたね。 先生みたい！']],
 sh_meanMiss:[['smile','意味を まちがえても だいじょうぶ。 ミオさんが 助けてくれたね。 その 単語、 鉱山で 練習してみよう'],['think','まちがえた 単語は 倉庫で カードを タップすると 意味が 見られるよ']],
 sh_mioDone:[['smile','ミオさんの お店の 英語、 聞いてた？ 「That\'s 〜 coins.」「Here you are.」は そのまま つかえるよ'],['happy','ミオさん、 お客さんの 対応が 上手に なってきたね']]});
