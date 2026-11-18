/* 🎁 プレゼントの 会話を 毎回 かえる ための 中身（しくみは game/gift.js）
   「毎回 同じ 流れで マンネリ」（2026-11-18）への 対策。 雑貨店の お会計・リクの バイトと 同じ 考え方で、
   わたし方・反応・質問・展開を くじで えらぶ。 聞かない 回も ある。
   - GIFT_STYLE : 共通の セリフを キャラの 口ぐせに する（カメ吉は ゆっくり、 ズーズーは ピピッ… など）
   - GIFT_OPEN  : はじまり（ふつう／自分から 話しかける／目を とじて／なにか 当てて／つつみを あけて／きょう 2回目／前の 品を おぼえてる）
   - GIFT_HAND_X: わたす ことばの 追加（小・中・高）
   - GIFT_SEE   : 品の しるしを 見て ひとこと（光る・食べもの…）
   - GIFT_TOPIC : 品の しるしに 合わせた 質問（「Can you play it?」「Let's eat together?」…）
   - GIFT_MEM / GIFT_COUNT : 前に あげた 物の 話・○回目の プレゼント
   - GIFT_WHY_O / GIFT_WHERE_Q : 「なんで？」の 答えと 「どこで？」の 聞き方を ふやす
   - GIFT_RETURN: お返し（コイン・食べ物・浜辺で ひろった もの）
   - GIFT_LONG  : たまに 長い 分かれる 会話（ミナ先生・リク・ノラさん・マルコさん・ミオ・ゲンじい と だれでも 用）
   - GIFT_CLOSE_X / GIFT_BYE_X : さいごの ことばの 追加
   {w}{n}=品の 英語/日本語  {last}{lastj}=前に あげた 品  {k}=何回目 */

/* 口ぐせ（共通の セリフに だけ かける。 キャラ 自身の セリフには かけない） */
const GIFT_STYLE={
 kame:{en:s=>s.replace(/[.!?,]*\s+/g,'... ').replace(/[.!?]*$/,'...'),ja:s=>s.replace(/[。！、]\s*/g,'… ')},
 zuzu:{en:s=>'Beep! '+s,ja:s=>'ピピッ！ '+s},
 pochi:{en:s=>s+' Woof!',ja:s=>s+' ワン！'},
 iruka:{en:s=>'Click! '+s,ja:s=>'キュッ！ '+s},
 fuku:{en:s=>'Hoo. '+s,ja:s=>'ホー。 '+s},
 kanio:{en:s=>'Snip! '+s,ja:s=>'チョキ！ '+s},
 neko:{en:s=>'Hmph. '+s,ja:s=>'ふむ。 '+s}};

/* ---------- はじまり ---------- */
const GIFT_OPEN={
 /* 自分から 話しかける → 相手が こたえる → わたす ことば */
 you:{me:[["Hi! Do you have a minute?","やあ！ ちょっと いい？",'es'],["Hey, can I give you something?","ねえ、 わたしたい ものが あるんだけど。",'jh'],["Are you busy? I have something for you.","いそがしい？ わたしたい ものが あるの。",'jh'],["Excuse me, do you have a moment?","すみません、 少し お時間 いいですか？",'hs']],
  fun:[["Hands up!","手を あげろ！"],["I'm a delivery robot. Beep boop.","わたしは 配達ロボット。 ピポパ。"]],
  them:[["Sure! What's up?","いいよ！ どうしたの？"],["Of course. What is it?","もちろん。 なあに？"],["For me? Now I'm curious!","わたしに？ 気に なる！"]],
  huh:[["Ha ha, what? OK, OK. What is it?","あはは、 なに それ？ はい はい。 なあに？"],["...Huh? You're funny. What's going on?","…え？ おもしろいね。 どうしたの？"]]},
 /* 目を とじて → あけて！ */
 eyes:{me:[["Close your eyes!","目を とじて！",'es'],["Can you close your eyes for a second?","ちょっと 目を とじて くれる？",'jh'],["Don't look yet. Close your eyes, please.","まだ 見ないで。 目を とじてね。",'hs']],
  them:[["Huh? OK... They're closed. No peeking, I promise.","え？ わかった… とじたよ。 のぞかない、 やくそく。"],["My eyes? Ha ha, OK. ...Now what?","目？ あはは、 いいよ。 …それで？"],["Hmm, this is exciting. Closed!","うーん、 ドキドキする。 とじた！"]],
  open:[["Open your eyes!","目を あけて！",'es'],["OK, you can look now. Ta-da!","はい、 もう 見て いいよ。 じゃーん！",'jh'],["Open your eyes. Surprise!","目を あけて。 サプライズ！",'jh']],
  fun:[["...Good night!","…おやすみ！"],["Keep them closed for one hour.","1時間 そのままね。"]],
  huh:[["Hey! Ha ha! Can I open them now? I'm opening them!","ちょっと！ あはは！ もう あけて いい？ あけるよ！"]]},
 /* なにか 当てて */
 guess:{me:[["Guess what I have!","なにを もってるか 当てて！",'es'],["I have something for you. Can you guess what it is?","わたしたい ものが あるの。 なにか 当てられる？",'jh']],
  any:[["Hmm... Is it something to eat?","うーん… 食べもの？",'food'],["Is it something shiny?","キラキラ 光る もの？",'shiny'],["Is it something to wear?","身に つける もの？",'wear'],["Is it a toy?","おもちゃ？",'toy'],["Is it something from the sea?","海の もの？",'shell'],["Is it something cute?","かわいい もの？",'cute'],["Is it a book?","本？",'book'],["Is it something you made?","自分で 作った もの？",'handmade']],
  hit:[["Yes! You got it!","そう！ 正解！",'es'],["Bingo! Here it is.","ビンゴ！ はい、 どうぞ。",'jh'],["How did you know? Here you are.","なんで わかったの？ はい、 どうぞ。",'jh']],
  miss:[["No! Try again... Just kidding. Here!","ちがう！ もう一回… うそ、 はい どうぞ！",'es'],["Close, but no. Here it is!","おしい、 でも ちがう。 はい、 これ！",'jh'],["Not quite. Here, take a look.","ちょっと ちがうな。 はい、 見てみて。",'jh']],
  fun:[["It's a dinosaur.","恐竜だよ。"],["It's nothing. Bye!","なんでも ない。 バイバイ！"]],
  hitThem:[["Really? I got it right? Yay!","ほんと？ 当たった？ やった！"]],
  huh:[["A dinosaur?! ...Oh, it's not. Ha ha!","恐竜？！ …ちがうじゃん。 あはは！"],["Wait, wait! Don't go! Ha ha, what is it?","まって まって！ 行かないで！ あはは、 なになに？"]]},
 /* つつみ（🎀）を 見て */
 wrap:{them:[["Ooh, it's wrapped! Is this for me? Can I open it now?","わあ、 つつんで ある！ わたしに？ いま あけても いい？"],["What a pretty package! May I open it?","かわいい つつみ！ あけても いい？"]],
  me:[["Sure! Open it!","いいよ！ あけて！",'es'],["Go ahead.","どうぞ。",'jh'],["Of course. I hope you like what's inside.","もちろん。 中身が 気に いると いいな。",'hs']],
  fun:[["No. Just look at the paper.","だめ。 紙だけ 見てて。"]],
  huh:[["Just the paper?! Ha ha! I'm opening it anyway!","紙だけ？！ あはは！ やっぱり あけちゃう！"]]},
 /* きょう 2回目 */
 again:{them:[["Another one? You already gave me something today!","また？ きょう もう もらったよ！"],["Wait, again? Is today a special day?","まって、 また？ きょうって 特別な 日？"]],
  me:[["I just wanted to.","あげたかった だけ。",'es'],["You can never have too many presents!","プレゼントは 多くても こまらないでしょ！",'jh'],["Every day is special with you.","あなたと いれば 毎日 特別。",'hs']],
  fun:[["I'm trying to empty my bag.","かばんを からっぽに したいの。"]],
  huh:[["Ha ha! So I'm your trash can? ...Fine, I'll take it.","あはは！ わたしは ゴミばこ？ …まあ、 もらっとく。"]]},
 /* 前に あげた 品を おぼえてる */
 mem:{them:[["Oh, hi! You know, I still have the {last} you gave me.","あ、 こんにちは！ ねえ、 前に くれた {lastj}、 まだ 大事に してるよ。"],["Hi! The {last} from last time is still in my room.","やあ！ この前の {lastj}、 まだ 部屋に あるよ。"],["Hello again! I was just thinking about the {last} you gave me.","また 会えたね！ ちょうど もらった {lastj}の こと 考えてたの。"]]}
};

/* わたす ことばの 追加（GIFT_HAND に 足す） */
const GIFT_HAND_X=[
 ['es',"For you!","あなたに！"],['es',"Here. It's for you.","はい。 あなたに。"],['es',"A present for you!","あなたに プレゼント！"],
 ['jh',"I bought this for you.","あなたに 買ったんだ。"],['jh',"I hope you like this.","気に いって もらえると いいな。"],['jh',"Please take this.","これ、 受けとって。"],
 ['hs',"I thought this would suit you.","これ、 あなたに 合うと 思って。"],['hs',"I wanted to give you something to say thanks.","お礼に なにか わたしたくて。"],['hs',"This made me think of you, so I got it.","これを 見て あなたを 思い出したから 買ったの。"]];
/* 品に 合わせた わたす ことば（ある とき 1つ まぜる） */
const GIFT_HAND_TAG={
 food:[['jh',"I brought you something to eat.","食べる ものを もってきたよ。"],['hs',"I thought you might be hungry.","おなか すいてるかと 思って。"]],
 sweet:[['es',"Something sweet for you!","あまい ものを どうぞ！"]],
 wear:[['jh',"I think this will look good on you.","これ、 にあうと 思う。"]],
 handmade:[['jh',"Someone made this by hand. Isn't it nice?","手作り なんだって。 いいでしょ？"]],
 shiny:[['es',"Look! It shines!","見て！ 光るよ！"]],
 music:[['jh',"Listen to this! It makes a sound.","聞いて！ 音が 出るよ。"]],
 book:[['jh',"I found something for a reader like you.","本が 好きな あなたに。"]],
 rare:[['hs',"This is a rare one. I wanted you to have it.","めずらしい ものなんだ。 あなたに もって いて ほしくて。"]],
 toy:[['es',"Let's play with this!","これで あそぼう！"]]};

/* 品を 見て ひとこと（反応の あとに たまに） */
const GIFT_SEE={
 food:[["It smells so good!","いい におい！"],["I'm getting hungry just looking at it.","見てる だけで おなか すいてきた。"]],
 sweet:[["Something sweet! My favorite kind of thing.","あまい もの！ いちばん 好きな やつ。"]],
 shiny:[["Look how it shines in the sun!","お日さまで キラキラ 光ってる！"],["It sparkles like the sea.","海みたいに きらめいてる。"]],
 wear:[["Should I wear it right now?","いま つけて みようかな？"]],
 cute:[["It's so cute I can't stop looking at it.","かわいすぎて 目が はなせない。"]],
 handmade:[["You can tell someone made this with care.","ていねいに 作った のが わかる。"]],
 nature:[["It feels like a piece of the beach.","浜辺の かけら みたい。"]],
 shell:[["I can almost hear the waves in it.","波の 音が 聞こえそう。"]],
 music:[["Does it make a sound? Let me try!","音が 出るの？ やってみよう！"]],
 book:[["I love things with words in them.","ことばの ある ものって 好き。"]],
 toy:[["This looks fun!","楽しそう！"]],
 rare:[["I've never seen one like this before.","こんなの 見たこと ない。"]],
 lux:[["Wow, this looks expensive!","わあ、 高そう！"]],
 fish:[["A fish! Ha ha, nice.","魚！ あはは、 いいね。"]],
 art:[["It's like a little piece of art.","小さな 作品 みたい。"]],
 adventure:[["This makes me want to go on an adventure!","冒険に 出たく なっちゃう！"]],
 dog:[["Ha ha, this is for a dog, isn't it?","あはは、 これ 犬用 でしょ？"]]};

/* しるしに 合わせた 質問 [英, 日] と 答え [英, 日, ok, lv, 返事] */
const GIFT_TOPIC={
 food:[{q:["Do you want to eat it together?","いっしょに 食べる？"],o:[["Sure! Let's share it.","うん！ 半分こ しよう。",1,'es',["Yay! Here, you take the bigger half.","やった！ はい、 大きい ほう あげる。"]],["No, it's all for you.","ううん、 ぜんぶ あなたの。",1,'jh',["Really? Thank you! Then I'll eat it slowly.","ほんと？ ありがとう！ じゃあ ゆっくり 食べるね。"]],["I already ate three.","もう 3つ 食べた。",0,0,["Three?! Ha ha, so this one is the survivor!","3つ？！ あはは、 これは 生きのこり なんだ！"]]]},
  {q:["Have you tried it? Is it good?","食べた こと ある？ おいしい？"],o:[["Yes, it's really good!","うん、 すごく おいしいよ！",1,'es',["Then I can't wait!","じゃあ 楽しみ！"]],["I haven't tried it yet. Tell me later.","まだ。 あとで おしえて。",1,'jh',["OK! I'll give you a full report.","わかった！ くわしく 報告するね。"]],["No idea. Good luck!","しらない。 がんばって！",0,0,["Good luck?! Ha ha, now I'm scared!","がんばって？！ あはは、 こわく なってきた！"]]]}],
 sweet:[{q:["Do you like sweet things too?","あなたも あまい もの 好き？"],o:[["Yes, I love them!","うん、 大好き！",1,'es',["We're the same! Sweet friends!","いっしょだね！ あまとう なかま！"]],["A little. But I wanted you to have it.","少しね。 でも あなたに あげたくて。",1,'hs',["That's so kind of you.","やさしいなあ。"]],["Only on Tuesdays.","火曜日 だけ。",0,0,["Only Tuesdays? Ha ha, what a rule!","火曜日 だけ？ あはは、 なに その ルール！"]]]}],
 wear:[{q:["How does it look on me?","にあう？"],o:[["It looks great on you!","すごく にあってる！",1,'es',["Really? I'll wear it every day, then.","ほんと？ じゃあ 毎日 つけるね。"]],["It suits you perfectly.","ぴったり にあってるよ。",1,'hs',["Ha ha, you're good at compliments.","あはは、 ほめるの 上手だね。"]],["Hmm... maybe upside down?","うーん… さかさま かな？",0,0,["Upside down?! Ha ha! Like this?","さかさま？！ あはは！ こう？"]]]}],
 cute:[{q:["Isn't it cute? Where should I put it?","かわいいね。 どこに おこう？"],o:[["By the window!","まどの そば！",1,'es',["Good idea. It will see the sea every day.","いいね。 毎日 海が 見えるね。"]],["Somewhere you can see it every morning.","毎朝 見える ところに。",1,'jh',["Then it'll be the first thing I see. Nice!","じゃあ 朝 いちばんに 見えるね。 いい！"]],["On your head.","頭の 上。",0,0,["On my head?! Ha ha, I'll look so silly!","頭の 上？！ あはは、 へんな 人に なる！"]]]}],
 shiny:[{q:["It's so shiny! Where should I keep it?","キラキラ！ どこに しまおう？"],o:[["In the sunlight. It'll sparkle.","日の 当たる ところ。 光るよ。",1,'jh',["Yes! It'll make rainbows on the wall.","そうだね！ かべに にじが できそう。"]],["Keep it safe in a box.","箱に しまって 大事に。",1,'es',["Good idea. My treasure box!","いいね。 宝箱に 入れよう！"]],["Use it as a flashlight.","かい中電灯に して。",0,0,["Ha ha, it doesn't glow THAT much!","あはは、 そこまで 光らないよ！"]]]}],
 lux:[{q:["Wait... this must have been expensive!","まって… これ 高かった でしょ！"],o:[["Don't worry about it.","気に しないで。",1,'es',["You're too kind... Thank you, really.","やさしすぎる… 本当に ありがとう。"]],["You're worth it.","あなたには その 価値が あるよ。",1,'hs',["Oh... now I'm blushing.","わあ… てれちゃう。"]],["Yes. Please pay me back.","うん。 お金 かえしてね。",0,0,["Ha ha! A present with a bill!","あはは！ 請求書 つきの プレゼント！"]]]}],
 book:[{q:["Have you read it?","もう 読んだ？"],o:[["Not yet. Tell me if it's good.","まだ。 おもしろかったら おしえて。",1,'jh',["I will! Let's talk about it later.","うん！ あとで 話そうね。"]],["Yes, it's one of my favorites.","うん、 お気に入りの 一つ。",1,'jh',["Then I'll read it tonight!","じゃあ 今夜 読むね！"]],["I only read the last page.","さいごの ページ だけ 読んだ。",0,0,["Ha ha! Don't tell me the ending!","あはは！ 結末は 言わないでね！"]]]}],
 shell:[{q:["Did you find it on our beach?","この 浜辺で 見つけたの？"],o:[["Maybe! The sea is full of surprises.","かもね！ 海は びっくり だらけ。",1,'jh',["That's true. The sea gives us lots of presents.","ほんとね。 海は たくさん プレゼントを くれる。"]],["Yes, near the big rock.","うん、 大きな 岩の そば。",1,'es',["The big rock! I'll go look tomorrow.","大きな 岩！ あした さがしに 行こう。"]],["No, a crab gave it to me.","ううん、 カニが くれた。",0,0,["A crab?! Ha ha, a very generous crab!","カニが？！ あはは、 気前の いい カニ！"]]]}],
 handmade:[{q:["Is it handmade? Who made it?","手作り？ だれが 作ったの？"],o:[["Someone who's really good with their hands.","手先の 器用な 人。",1,'jh',["I can tell. Look at these details!","わかる。 この こまかい ところ 見て！"]],["I don't know, but it's made with love.","しらない けど、 心を こめて 作ってあるよ。",1,'hs',["Yes, you can feel it.","うん、 つたわってくる。"]],["A robot.","ロボット。",0,0,["A robot?! Ha ha, a very cute robot, then.","ロボット？！ あはは、 かわいい ロボットね。"]]]}],
 nature:[{q:["It feels like a piece of nature. Where did it come from?","自然の かけら みたい。 どこから きたの？"],o:[["From the beach, I think.","浜辺から、 だと 思う。",1,'es',["Then it's a piece of our beach!","じゃあ この 浜辺の かけら だね！"]],["Somewhere far away. It traveled a long way.","遠くの どこか。 長い 旅を してきたんだ。",1,'hs',["What a story. I'll treasure it.","すてきな 話。 大事に するね。"]],["From the moon, obviously.","月から に きまってる。",0,0,["Obviously! Ha ha! Of course!","きまってる！ あはは！ そりゃ そうだ！"]]]}],
 toy:[{q:["Can we play with it now?","いま これで あそべる？"],o:[["Sure! Let's play!","いいよ！ あそぼう！",1,'es',["Yay! You go first!","やった！ 先に どうぞ！"]],["Later. I have to study now.","あとでね。 いまは 勉強。",1,'jh',["OK... after you study, then! Promise!","わかった… 勉強の あとね！ やくそく！"]],["Only if you beat me at rock-paper-scissors.","じゃんけんで 勝ったらね。",0,0,["Rock, paper, scissors! ...Ha ha, I lost. Again!","じゃんけん ぽん！ …あはは、 負けた。 もう一回！"]]]}],
 fish:[{q:["A fish! Did you catch it?","魚！ つかまえたの？"],o:[["No, but it looks like I did, right?","ううん、 でも そう 見えるでしょ？",1,'jh',["Ha ha, you look like a great fisher!","あはは、 名人 みたい！"]],["I wish! I'm bad at fishing.","だったら いいけど！ つり 苦手なんだ。",1,'jh',["I can teach you sometime.","こんど 教えて あげる。"]],["It jumped into my bag.","かばんに とびこんで きた。",0,0,["Ha ha! A very brave fish!","あはは！ ゆうかんな 魚！"]]]}],
 music:[{q:["Can you play it? Show me!","ひける？ やって 見せて！"],o:[["Just a little. Listen!","少しだけ。 聞いて！",1,'es',["♪ Wow, that's nice! Again, again!","♪ わあ、 いいね！ もう一回！"]],["No, but I want to learn.","ううん、 でも ならいたい。",1,'jh',["Let's learn together, then.","じゃあ いっしょに おぼえよう。"]],["Only very loudly.","すごく 大きい 音で だけ。",0,0,["Ha ha! Not here, please! The fish will run away!","あはは！ ここでは やめて！ 魚が にげちゃう！"]]]}],
 adventure:[{q:["This makes me want to go exploring. Want to come?","探検に 行きたく なる。 いっしょに 来る？"],o:[["Yes! Let's go!","うん！ 行こう！",1,'es',["Great! Pack some snacks!","やった！ おやつ もってきてね！"]],["Sure. Where should we go first?","いいよ。 まず どこに 行く？",1,'jh',["Hmm... the cave on the north side!","うーん… 北の どうくつ！"]],["Only if there's a toilet.","トイレが あるなら。",0,0,["Ha ha! Very important question!","あはは！ だいじな 質問だね！"]]]}],
 rare:[{q:["This is so rare. Are you sure you want to give it to me?","すごく めずらしいよ。 本当に もらって いいの？"],o:[["Yes. I want you to have it.","うん。 もってて ほしいの。",1,'jh',["Thank you... I'll keep it forever.","ありがとう… ずっと 大事に する。"]],["Of course. You're special.","もちろん。 あなたは 特別だから。",1,'hs',["...You're making me blush.","…てれちゃうよ。"]],["Actually, can I have it back?","やっぱり かえして くれる？",0,0,["No way! Ha ha! It's mine now!","だめ！ あはは！ もう わたしの！"]]]}],
 art:[{q:["It's beautiful. Do you like art?","きれい。 絵とか 好き？"],o:[["Yes, I love beautiful things.","うん、 きれいな もの 大好き。",1,'es',["Me too. We have that in common.","わたしも。 そこ にてるね。"]],["I'm not good at drawing, but I like looking.","かくのは 苦手 だけど 見るのは 好き。",1,'hs',["That's the best way to enjoy art.","それが いちばんの 楽しみ方だよ。"]],["I painted it with my nose.","鼻で かいたの。",0,0,["Your nose?! Ha ha! What a talent!","鼻で？！ あはは！ すごい 才能！"]]]}],
 dog:[{q:["Ha ha, isn't this for a dog?","あはは、 これ 犬用 じゃない？"],o:[["Oops. Maybe you can give it to Pochi.","あ。 ポチに あげて。",1,'jh',["Good idea! Pochi will love it.","いいね！ ポチ よろこぶよ。"]],["Sorry, I picked the wrong one.","ごめん、 まちがえた。",1,'es',["It's OK! Ha ha, it's still a nice thought.","いいよ！ あはは、 気持ちは うれしい。"]],["Woof.","ワン。",0,0,["Woof?! Ha ha! Are you a dog now?","ワン？！ あはは！ 犬に なったの？"]]]}]};

/* 前に あげた 物の 話（同じ 人に 2回目 から） */
const GIFT_MEM=[
 {q:["Last time it was a {last}, and now a {n}! You always surprise me.","この前は {lastj}、 こんどは {n}！ いつも びっくり させてくれるね。"],o:[["I like surprising you.","おどろかせるのが 好きなんだ。",1,'jh',["Ha ha, it's working!","あはは、 大せいこう だよ！"]],["What should I bring next time?","つぎは なにが いい？",1,'jh',["Hmm... surprise me again!","うーん… また びっくり させて！"]],["Next time, a horse.","つぎは 馬。",0,0,["A horse?! Where would I put it?!","馬？！ どこに おくの？！"]]]},
 {q:["Do you remember the {last} you gave me? I use it all the time.","前に くれた {lastj}、 おぼえてる？ いつも つかってるよ。"],o:[["Of course I remember!","もちろん おぼえてるよ！",1,'es',["I'm glad. It's special to me.","よかった。 わたしには 特別なの。"]],["Really? I'm so happy to hear that.","ほんと？ それ 聞けて うれしい。",1,'jh',["Really! And now I have two treasures.","ほんと！ これで 宝物が 2つ。"]],["What {last}?","{lastj}って なに？",0,0,["You forgot?! Ha ha, I didn't!","わすれたの？！ あはは、 わたしは おぼえてるよ！"]]]},
 {q:["The {last} and this {n}... I'm starting a collection!","{lastj}と この {n}… コレクションが できそう！"],o:[["Let's make it bigger!","もっと ふやそう！",1,'es',["Ha ha, I'll need a bigger shelf!","あはは、 大きい たなが いるね！"]],["Then I'll keep finding things for you.","じゃあ これからも さがして くるね。",1,'hs',["I'll look forward to it.","楽しみに してる。"]],["Please sell them. I need money.","売って。 お金が いるの。",0,0,["Ha ha! No way! They're my treasures!","あはは！ だめ！ 宝物 だもん！"]]]}];

/* ○回目の プレゼント（同じ 人に） */
const GIFT_COUNT={3:["This is the third present from you! You're so kind.","これで 3つ目の プレゼント！ ほんとに やさしいね。"],5:["Five presents! I'm counting, you know. Ha ha.","5つ目！ ちゃんと 数えてるんだよ。 あはは。"],10:["Ten presents! You're my number one gift giver!","10こ目！ いちばんの プレゼント名人だね！"],20:["Twenty! My room is full of your presents!","20こ！ 部屋が あなたの プレゼントで いっぱい！"],30:["Thirty presents... I don't know how to thank you.","30こ… どう お礼したら いいか わからない。"]};
const GIFT_COUNT_O=[["I like making you happy.","よろこぶ 顔が 見たいから。",1,'jh',["You really do. Thank you.","ほんとに うれしいよ。 ありがとう。"]],["You're welcome. Many more to come!","どういたしまして。 まだまだ あるよ！",1,'es',["Ha ha! I can't wait!","あはは！ 楽しみ！"]],["Wait, I'm counting too... eleven?","まって、 わたしも 数えてる… 11？",0,0,["Ha ha! Your math is a little off!","あはは！ ちょっと 計算 ちがうよ！"]]];

/* 「なんで これ？」の 答え（4つ えらぶ） */
const GIFT_WHY_O=[
 ["Because you're my friend.","ともだち だから。",1,'es',["Aww, thank you, friend.","わあ、 ありがとう、 ともだち。"]],
 ["I thought you might like it.","気に いって くれるかなと 思って。",1,'jh',["That's so sweet of you.","やさしいね。"]],
 ["It reminded me of you.","あなたを 思い出したから。",1,'hs',["Really? That makes me happy.","ほんと？ うれしいな。"]],
 ["I wanted to say thank you.","ありがとうって 言いたくて。",1,'jh',["Thank YOU. You're always so kind.","こちらこそ。 いつも やさしいね。"]],
 ["You looked a little tired, so...","ちょっと つかれてる みたいだったから…",1,'hs',["Oh... you noticed? Thank you. I feel better already.","あ… 気づいてた？ ありがとう。 もう 元気に なったよ。"]],
 ["Because it's your birthday!","きょうは たんじょうび だから！",0,0,["It's not my birthday! But thank you, ha ha!","たんじょうびじゃ ないよ！ でも ありがとう、 あはは！"]],
 ["I didn't need it anymore.","もう いらなかったから。",0,0,["Oh... ha ha. You're very honest!","あ… あはは。 正直だね！"]],
 ["It was on sale.","安かったから。",0,0,["Ha ha! At least you're honest!","あはは！ 正直で よろしい！"]]];
/* 「どこで？」の 聞き方（キャラの ask と まぜる） */
const GIFT_WHERE_Q=[["Where is it from?","どこの もの？"],["Where did you find something like this?","こんなの どこで 見つけたの？"],["Did you buy it somewhere around here?","この へんで 買ったの？"]];

/* お返し: k='c' コイン / 'f' 食べ物（FOOD）/ 't' 浜辺の もの（リクの お礼と 同じ 品）
   m=わたす ときの セリフ。 キャラに ない ときは 「*」を つかう */
const GIFT_RETURN={
 '*':[{k:'c',n:12,m:["Wait! I have something for you, too. Here, it's not much.","まって！ わたしからも。 はい、 少しだけど。"]},{k:'t',id:'glass',m:["Oh, take this. I found it on the beach this morning.","あ、 これ どうぞ。 けさ 浜辺で ひろったの。"]},{k:'t',id:'stone',m:["Here, a little thank-you. It's a heart-shaped stone!","はい、 お礼。 ハートの 形の 石だよ！"]}],
 mina:[{k:'f',id:'castella',m:["Then this is from me. Let's both have a sweet break, OK?","じゃあ これは わたしから。 おたがい あまい 休けい、 ね？"]},{k:'c',n:15,m:["Here, a little reward from your teacher. For working hard!","はい、 先生から ごほうび。 がんばってる から！"]}],
 riku:[{k:'t',id:'acorn',m:["Wait! I have one for you too! My best acorn!","まって！ ぼくからも！ いちばんの どんぐり！"]},{k:'t',id:'marble',m:["Here! A marble! It's my second favorite. Trade!","はい！ ビー玉！ 2番目に 好きな やつ。 こうかん！"]}],
 nora:[{k:'c',n:20,m:["Wait, dear. Take this. Shop owners always give something back.","まって。 これ どうぞ。 お店の 人は お返しを するものなの。"]},{k:'f',id:'pudding',m:["Here, a pudding from my fridge. Don't tell Pip.","はい、 冷蔵庫の プリン。 ピップには ないしょよ。"]}],
 marco:[{k:'f',id:'onigiri',m:["Hold on! Take this rice ball. Made it this morning!","まちな！ この おにぎり もってけ。 けさ にぎったんだ！"]},{k:'f',id:'soup',m:["Here, some corn soup for later. A cook always pays back with food!","ほれ、 あとで のむ コーンスープ。 コックの お返しは 料理と きまってる！"]}],
 mio:[{k:'f',id:'melonpan',m:["Then this is from me! I bought two melon breads by mistake. Ha ha!","じゃあ これ わたしから！ メロンパン、 まちがえて 2つ 買っちゃって。 あはは！"]},{k:'c',n:15,m:["Boss, wait! A thank-you from today's sales. Shh!","店長、 まって！ きょうの 売り上げから お礼。 しーっ！"]}],
 gen:[{k:'f',id:'senbei',m:["Here, take some rice crackers. Good with tea!","ほれ、 せんべい もっていけ。 お茶に 合うぞ！"]}],
 baba:[{k:'f',id:'yakiimo',m:["Wait, dear. A roasted sweet potato. Still warm!","まちなさい。 焼きいも。 まだ あったかいよ！"]}],
 hana:[{k:'f',id:'watermelon',m:["Thank you! Here, a slice of watermelon from my shop!","ありがとう！ はい、 うちの お店の すいか！"]}],
 pochi:[{k:'c',n:8,m:["Woof! Dig dig dig... I found a coin! For you!","ワン！ ほりほり… コイン 見つけた！ あげる！"]}],
 kanio:[{k:'t',id:'glass',m:["Snip! Trade! One for one! This sea glass for you!","チョキ！ こうかん！ 1こ と 1こ！ この ビーチグラス あげる！"]}],
 iruka:[{k:'t',id:'glass',m:["Click click! I found this at the bottom of the sea. For you!","キュキュッ！ 海の そこで 見つけたんだ。 あげる！"]}],
 kame:[{k:'t',id:'stone',m:["Wait... young friend... take... this... stone... It is... 100 years... old...","まて… わかい 友よ… この… 石を… 100年… ものじゃ…"]}],
 zuzu:[{k:'t',id:'marble',m:["Beep! Trade! A marble from my spaceship! ...It's an Earth marble, actually.","ピピッ！ こうかん！ 宇宙船の ビー玉！ …ほんとは 地球の ビー玉。"]}],
 taku:[{k:'f',id:'chips',m:["Here, take my chips. It's fine, I have more!","ほら、 オレの ポテチ やるよ。 まだ あるから！"]}],
 sora:[{k:'t',id:'flower',m:["Wait! I made this! A pressed flower card! For you!","まって！ これ 作ったの！ おし花の カード！ あげる！"]}],
 fuku:[{k:'t',id:'words',m:["Hoo. Take this note. I wrote some beautiful English words on it.","ホー。 この メモを。 美しい 英語の ことばを 書いておいた。"]}]};
/* お返しを 受けとる ことば */
const GIFT_RETURN_O=[["Wow, thank you!","わあ、 ありがとう！",1,'es'],["You didn't have to! Thank you.","いいのに！ ありがとう。",1,'jh'],["Thank you. I'll treasure it.","ありがとう。 大切に するね。",1,'hs']];

/* さいごの ことばの 追加 */
const GIFT_CLOSE_X={good:[["See you soon!","また ね！",1,'es'],["I'm happy you're happy.","よろこんで もらえて うれしい。",1,'jh'],["Enjoy it!","楽しんでね！",1,'es'],["Thank you for making it a good day.","いい 日に してくれて ありがとう。",1,'hs']],
 meh:[["Sorry it wasn't your favorite.","好みじゃ なくて ごめんね。",1,'jh'],["I'll remember what you like.","好きな もの、 おぼえて おくね。",1,'hs']]};
const GIFT_BYE_X={good:[["Thank you again. This really made my day.","もう一度 ありがとう。 ほんとに いい 日に なった。"],["I'll take good care of it. See you!","大事に するね。 またね！"],["Come back soon, OK?","また すぐ 来てね？"]],
 ok:[["Thanks for stopping by.","寄って くれて ありがとう。"],["See you later!","また あとでね！"]]};

/* たまに 長い 会話（3だん くらい、 分かれる）。 o=[英, 日, ok, lv, つぎ]（つぎ: {m,o} なら つづく、 [英,日] なら さいごの 返事）
   when: 'good'=よろこんだ とき 'any'=いつでも */
const GIFT_LONG={
 mina:[
  {id:'mi_desk',when:'good',m:["You know, my desk is full of things from you now. Want to see?","ねえ、 わたしの 机、 あなたに もらった もので いっぱい なんだよ。 見る？"],o:[
   ["Yes, show me!","うん、 見せて！",1,'es',{m:["Here. The {n} goes right here, next to my dictionary. Every time I open it, I'll smile.","ほら。 {n}は ここ、 辞書の となり。 辞書を ひらく たびに にこっと しちゃう。"],o:[
     ["Then you'll study more!","じゃあ もっと 勉強しちゃうね！",1,'jh',["Ha ha! You're right. That's a teacher trick I didn't know.","あはは！ たしかに。 先生も しらなかった 作戦だ。"]],
     ["I'm glad it helps you.","役に 立って よかった。",1,'jh',["It does. More than you know.","立ってるよ。 あなたが 思うより ずっと。"]],
     ["Can I have the dictionary?","辞書 もらって いい？",0,0,["No! Ha ha. But I'll lend it to you anytime.","だめ！ あはは。 でも いつでも かして あげる。"]]]}],
   ["Is there room for more?","まだ おける？",1,'jh',["Always. I'll make room. ...Don't spend all your coins, though!","いつでも。 場所は 作るよ。 …でも コイン つかいすぎ ないでね！"]],
   ["No thanks, I believe you.","だいじょうぶ、 信じる。",1,'es',["Ha ha, OK. It's our secret corner.","あはは、 わかった。 ふたりの ひみつの コーナーね。"]]]},
  {id:'mi_teach',when:'any',m:["Hey, can I turn this into a little lesson? How do you say 'present' in another way?","ねえ、 ちょっと だけ 授業に して いい？ 「present」を ほかの ことばで 言うと？"],o:[
   ["Gift!","gift！",1,'es',{m:["Correct! And here's a bonus: 'present' can also mean 'now.' Like 'at present.'","正解！ おまけ： 「present」には 「いま」って 意味も あるの。 「at present」みたいに。"],o:[
     ["So a present is a gift for now?","じゃあ プレゼントは 「いま」の おくりもの？",1,'hs',["Oh, I like that. That's very poetic.","いいね、 それ。 すごく 詩的。"]],
     ["I'll remember that.","おぼえて おく。",1,'es',["Good! Now this {n} has a lesson inside, too.","よし！ これで この {n}にも 授業が 入ったね。"]],
     ["Present, past, future... time travel!","現在、 過去、 未来… タイムトラベル！",0,0,["Ha ha! That's grammar tenses! Great joke, actually.","あはは！ それ 時制 だよ！ じつは いい じょうだん。"]]]}],
   ["Souvenir?","おみやげ？",1,'jh',["Close! A souvenir is something you bring back from a trip. A gift is the word I wanted.","おしい！ souvenir は 旅行の おみやげ。 ほしかったのは gift。"]],
   ["Free stuff!","タダの もの！",0,0,["Ha ha! Not wrong, but let's say 'gift.'","あはは！ まちがい じゃないけど、 gift って 言おうね。"]]]},
  {id:'mi_why',when:'good',m:["Can I ask you something? Why do you give me presents so often?","聞いても いい？ どうして よく プレゼント くれるの？"],o:[
   ["Because you always help me.","いつも 助けて くれるから。",1,'jh',{m:["That's my job... but I'm happy you feel that way.","それが 仕事 だけど… そう 思って くれて うれしい。"],o:[
     ["It's more than a job, right?","仕事 以上 でしょ？",1,'hs',["...Yes. Teaching you is my favorite part of the day.","…うん。 あなたに 教える 時間が 一日で いちばん 好き。"]],
     ["Thank you for everything.","いつも ありがとう。",1,'es',["Thank YOU. Let's keep going together.","こちらこそ。 これからも いっしょに がんばろうね。"]]]}],
   ["I like seeing you smile.","わらう 顔が 見たいから。",1,'jh',["...Oh. Ha ha, now I can't stop smiling. That's not fair.","…わ。 あはは、 にやけが とまらない。 ずるいよ。"]],
   ["My bag was too heavy.","かばんが 重かったから。",0,0,["Ha ha! So I'm your storage room?","あはは！ わたしは 物置？"]]]}],
 riku:[
  {id:'ri_show',when:'good',m:["Sensei! Can I show this to my friends at school tomorrow?","せんせい！ あした 学校の 友だちに 見せて いい？"],o:[
   ["Of course!","もちろん！",1,'es',{m:["Yes! What should I say? 'My English teacher gave it to me'?","やった！ なんて 言えば いい？ 「My English teacher gave it to me」？"],o:[
     ["Perfect English!","完ぺきな 英語！",1,'es',["Yes! I'll say it ten times so I don't forget!","やった！ わすれない ように 10回 言う！"]],
     ["Say it in Japanese, too.","日本語でも 言ってね。",1,'jh',["OK! English AND Japanese. I'm bilingual!","わかった！ 英語と 日本語。 バイリンガルだ！"]],
     ["Say 'a wizard gave it to me.'","「まほうつかいに もらった」って 言って。",0,0,["Ha ha! They'll believe it! Sensei, you're a wizard!","あはは！ みんな 信じちゃう！ せんせい、 まほうつかい だ！"]]]}],
   ["Only if you don't lose it.","なくさない ならね。",1,'jh',["I won't! I'll keep it in my pocket with a zipper!","なくさない！ チャックの ある ポケットに 入れる！"]],
   ["No, it's top secret.","だめ、 トップシークレット。",0,0,["Top secret?! Cool! Then I'll be a spy!","トップシークレット？！ かっこいい！ じゃあ スパイに なる！"]]]},
  {id:'ri_back',when:'any',m:["Sensei, when is YOUR birthday? I want to give you something too!","せんせい、 せんせいの たんじょうびは いつ？ ぼくも なにか あげたい！"],o:[
   ["It's a secret.","ひみつ。",1,'es',{m:["Aww! Then I'll give you something every day, just in case!","ええー！ じゃあ 毎日 なにか あげる、 ねんの ため！"],o:[
     ["Then I'll be very rich!","じゃあ お金もちに なっちゃう！",0,0,["Ha ha! Only in acorns, sensei!","あはは！ どんぐり だけだよ、 せんせい！"]],
     ["Your smile is enough.","きみの えがおで じゅうぶん。",1,'hs',["Huh? ...Ha ha, that's what grown-ups always say!","え？ …あはは、 大人って いつも それ 言う！"]]]}],
   ["In winter.","冬だよ。",1,'es',["Winter! OK, I'll start saving acorns now!","冬！ よし、 いまから どんぐり ためる！"]],
   ["Every day is my birthday.","毎日が たんじょうび。",0,0,["Whoa! Then you're a hundred years old?!","すげー！ じゃあ 100さい？！"]]]}],
 nora:[
  {id:'no_story',when:'good',m:["This reminds me of something. When I was young, I sold shells on this beach. Did I tell you?","これを 見て 思い出したわ。 わかい ころ、 この 浜辺で 貝がらを 売ってたの。 話したかしら？"],o:[
   ["No! Tell me more.","ううん！ もっと 聞かせて。",1,'es',{m:["I had a little box and a sign that said 'Shells, 1 coin.' I sold three on my first day. I was so proud.","小さな 箱と 「貝がら 1コイン」の 看板。 最初の 日は 3つ 売れたの。 すごく うれしかった。"],o:[
     ["And now you have a whole shop!","いまは お店 まるごと！",1,'jh',["Yes. Step by step, dear. Just like your English.","そう。 少しずつ よ。 あなたの 英語と 同じ。"]],
     ["Who bought them?","だれが 買ったの？",1,'jh',["A young sailor. ...He has a restaurant on this beach now. Ha ha!","わかい 船乗り。 …いまは この 浜辺で 食堂を やってるわ。 あはは！"]],
     ["Only three? Ha ha!","3つ だけ？ あはは！",0,0,["Hey! Three is a lot for a little girl!","ちょっと！ 小さい 子には 3つは 大きいのよ！"]]]}],
   ["Yes, a hundred times.","うん、 100回。",0,0,["Oh! Ha ha. Then this is one hundred and one.","あら！ あはは。 じゃあ これで 101回目ね。"]],
   ["You must have been cute.","かわいかった でしょうね。",1,'hs',["Ha ha! Oh, you're sweet. Pip, did you hear that?","あはは！ うまいわね。 ピップ、 聞いた？"]]]},
  {id:'no_price',when:'any',m:["Hmm, this is good quality. If I sold this in my shop, how much should it be?","ふむ、 いい 品ね。 うちで 売るなら いくらに する？"],o:[
   ["Fifty coins!","50コイン！",1,'es',{m:["Fifty? Not bad! You'd make a good shopkeeper. Want a job?","50？ わるくない！ いい 店員に なれるわ。 はたらく？"],o:[
     ["Maybe someday!","いつかね！",1,'es',["I'll keep a spot for you behind the counter.","カウンターの うしろ、 あけて おくわね。"]],
     ["I already have a job.","もう 仕事 あるの。",1,'jh',["Oh, right! Teaching Riku. You're a busy one.","あ、 そうね！ リクの 先生。 いそがしい 人ね。"]]]}],
   ["It's priceless.","お金には かえられない。",1,'hs',["Ha ha! Good answer. Presents are always priceless.","あはは！ いい 答え。 プレゼントは いつも プライスレス。"]],
   ["One million coins.","100万コイン。",0,0,["One million! Ha ha! Nobody would buy it, dear!","100万！ あはは！ だれも 買わないわよ！"]]]}],
 marco:[
  {id:'ma_menu',when:'good',m:["You know what? This gives me an idea for a new dish. Want to help me name it?","いいか？ これで 新しい 料理を 思いついた。 名前を いっしょに つけて くれるか？"],o:[
   ["Sure! What kind of dish?","いいよ！ どんな 料理？",1,'es',{m:["Something warm, with fish and a little sweet sauce. Like the sea at sunset.","あったかくて、 魚と ちょっと あまい ソース。 夕方の 海 みたいな。"],o:[
     ["Sunset Fish!","サンセット・フィッシュ！",1,'es',["Sunset Fish! Ha ha! Simple and strong. I love it!","サンセット・フィッシュ！ はっは！ シンプルで 力強い。 気に いった！"]],
     ["The Golden Wave.","ゴールデン・ウェーブ。",1,'jh',["The Golden Wave... Fancy! It'll be on the menu tomorrow.","ゴールデン・ウェーブ… しゃれてる！ あしたから メニューに のせるぞ。"]],
     ["Fish Fish Fish.","フィッシュ・フィッシュ・フィッシュ。",0,0,["Ha ha ha! Nobody will forget that name!","はっはっは！ だれも わすれない 名前だな！"]]]}],
   ["Only if I can taste it first.","さいしょに 味見 できるなら。",1,'jh',["Deal! The first plate is yours.","きまりだ！ 一皿目は おまえさんの だ。"]],
   ["Name it after me.","わたしの 名前で。",0,0,["Ha ha! OK, 'The Customer Special'!","はっは！ よし、 『お客さま スペシャル』だ！"]]]},
  {id:'ma_sea',when:'any',m:["When I was a sailor, we gave presents in every port. Do you know what sailors liked most?","船乗りの ころ、 港 ごとに プレゼントを わたしたもんだ。 船乗りが いちばん よろこんだ もの、 わかるか？"],o:[
   ["Food?","食べもの？",1,'es',{m:["Close! Letters. Letters from home. Words can be the best present.","おしい！ 手紙だ。 家からの 手紙。 ことばは 最高の プレゼントに なる。"],o:[
     ["Then I'll write you a letter in English.","じゃあ 英語で 手紙を 書くね。",1,'hs',["Ha ha! I'll read it slowly, with my dictionary.","はっは！ 辞書を ひきながら、 ゆっくり 読むよ。"]],
     ["That's beautiful.","すてきな 話。",1,'es',["The sea makes you think about these things.","海に いると、 そんな ことを 考えるんだ。"]]]}],
   ["Treasure!","宝物！",1,'es',["Ha ha! Every sailor wants treasure. But the real answer is letters from home.","はっは！ 船乗りは みんな 宝が ほしい。 でも ほんとの 答えは 家からの 手紙さ。"]],
   ["Seasick medicine.","よいどめ。",0,0,["Ha ha ha! You're not wrong! That was very popular!","はっはっは！ まちがって ない！ 大人気 だったよ！"]]]}],
 mio:[
  {id:'mo_shelf',when:'good',m:["Boss, can I put this on the shop shelf? Not to sell! Just to look at. Customers will be jealous.","店長、 これ お店の たなに おいて いい？ 売るんじゃ なくて！ 見る だけ。 お客さん うらやましがるかも。"],o:[
   ["Sure! Show it off!","いいよ！ 見せびらかして！",1,'es',{m:["Yay! I'll write a little card: 'A present from the boss.' ...Is that too much?","やった！ 小さな カードも 書こう。 「店長からの プレゼント」。 …やりすぎ？"],o:[
     ["It's perfect.","ばっちり。",1,'es',["Ha ha! OK! I'll write it in English for practice.","あはは！ よし！ 練習に 英語で 書きます。"]],
     ["Maybe a little too much.","ちょっと やりすぎ かも。",1,'jh',["Ha ha, you're right. I'll just smile at it, then.","あはは、 ですよね。 じゃあ にこにこ ながめる だけに します。"]],
     ["Write 'Not for sale. Ever.'","「ぜったい 非売品」って 書いて。",0,0,["Ha ha! In big red letters!","あはは！ 赤い 大きな 字で！"]]]}],
   ["Keep it in your room.","部屋に おいて。",1,'jh',["OK! Then I'll see it every morning before work.","はい！ じゃあ 毎朝 しごとの 前に 見ますね。"]],
   ["Sell it for 1000 coins.","1000コインで 売って。",0,0,["Boss! Ha ha! I'd never sell it!","店長！ あはは！ ぜったい 売りません！"]]]},
  {id:'mo_eng',when:'any',m:["Boss, wait. Let me say thank you in perfect English. Ahem... 'I am deeply grateful for your kindness.' How was it?","店長、 まって。 完ぺきな 英語で お礼 言わせて。 こほん… 「I am deeply grateful for your kindness.」 どう でした？"],o:[
   ["Perfect!","完ぺき！",1,'es',{m:["Really?! I practiced that one in the stockroom. Many times. Ha ha.","ほんと？！ 倉庫で 練習 したんです。 何回も。 あはは。"],o:[
     ["You're getting really good.","すごく 上手に なってるよ。",1,'jh',["Thanks to you, boss!","店長の おかげ です！"]],
     ["Who were you saying it to?","だれに 言う 練習？",1,'jh',["...Secret! Ha ha! ...To you, obviously.","…ひみつ！ あはは！ …店長に きまってる でしょ。"]]]}],
   ["A little too formal.","ちょっと かたすぎ。",1,'hs',["Oh! Then... 'Thanks so much, boss!' Better?","あ！ じゃあ… 「Thanks so much, boss!」 これで どう？"]],
   ["I didn't understand.","わかんなかった。",0,0,["Boss! You're the English expert! Ha ha!","店長！ 英語の プロ でしょ！ あはは！"]]]}],
 gen:[
  {id:'ge_fish',when:'good',m:["Did I ever tell you about the biggest fish I ever caught?","わしが つった いちばん でかい 魚の 話、 したかの？"],o:[
   ["No. How big was it?","ううん。 どれくらい 大きかった？",1,'es',{m:["THIS big! ...No, bigger! It pulled my boat for an hour!","こーんなに！ …いや、 もっとじゃ！ 1時間 船を ひっぱったんじゃ！"],o:[
     ["Wow! Did you catch it?","すごい！ つれたの？",1,'es',["No! It got away. But I still dream about it. Ho ho!","いや！ にげられた。 でも いまでも 夢に 出るわい。 ほっほ！"]],
     ["Is that a true story?","それ ほんとの 話？",1,'jh',["Ho ho! Every fisher's story is a little bigger every year!","ほっほ！ つり人の 話は 毎年 少しずつ でかく なるもんじゃ！"]],
     ["Was it a whale?","クジラ じゃない？",0,0,["A whale?! ...Hmm. Maybe it was! Ho ho ho!","クジラ？！ …ふむ。 そうかも しれん！ ほっほっほ！"]]]}],
   ["Yes, many times.","うん、 何回も。",0,0,["Eh? Then you know it was THIS big! Ho ho!","ん？ じゃあ こーんなに でかいのは しってるな！ ほっほ！"]],
   ["Let's go fishing together!","いっしょに つりに 行こう！",1,'jh',["Ho ho! Tomorrow at five. In the morning! Don't be late.","ほっほ！ あしたの 5時じゃ。 朝の！ おくれるなよ。"]]]}],
 '*':[
  {id:'x_story',when:'good',m:["You know, this reminds me of a story. Want to hear it?","ねえ、 これを 見て 思い出した 話が あるの。 聞く？"],o:[
   ["Yes, please!","うん、 聞かせて！",1,'es',{m:["A long time ago, a friend gave me something just like this. We were both little, and we promised to be friends forever.","むかし、 友だちが これに にた ものを くれたの。 ふたりとも 小さくて、 ずっと 友だちだよって やくそく したんだ。"],o:[
     ["Are you still friends?","いまも 友だち？",1,'jh',["Yes! We write letters every year.","うん！ 毎年 手紙を 書いてるよ。"]],
     ["Then let's be friends forever, too.","じゃあ わたしたちも ずっと 友だちね。",1,'hs',["...Yes. I'd like that a lot.","…うん。 それ すごく うれしい。"]],
     ["And then a dragon came.","そこへ ドラゴンが あらわれた。",0,0,["No dragon! Ha ha! ...OK, maybe a small one.","ドラゴンは 来ない！ あはは！ …まあ、 小さいのなら。"]]]}],
   ["Maybe next time.","また こんどね。",1,'jh',["OK! I'll save it for next time, then.","わかった！ じゃあ こんどの お楽しみ。"]],
   ["Is it a scary story?","こわい 話？",0,0,["Ha ha, no! It's a happy one. ...Mostly.","あはは、 ちがう！ しあわせな 話。 …だいたい。"]]]},
  {id:'x_name',when:'any',m:["I think I'll give it a name. What should I call it?","名前を つけようかな。 なんて よぼう？"],o:[
   ["Lucky!","ラッキー！",1,'es',["Lucky! Ha ha, I like it. Hello, Lucky!","ラッキー！ あはは、 いいね。 よろしく、 ラッキー！"]],
   ["Give it your favorite word.","好きな ことばを つけて。",1,'jh',{m:["My favorite word? Hmm... 'Sunshine.' Because you brought it on a sunny day. ...Or it feels like one.","好きな ことば？ うーん… 「Sunshine」。 晴れた 日に もってきて くれたから。 …そんな 気が するの。"],o:[
     ["That's beautiful.","すてき。",1,'es',["Thank you. Sunshine it is!","ありがとう。 サンシャインに 決定！"]],
     ["What's your second favorite?","2番目に 好きな ことばは？",1,'jh',["Hmm... 'Friend.' Ha ha, too easy?","うーん… 「Friend」。 あはは、 かんたん すぎ？"]]]}],
   ["Mr. Potato.","ポテト氏。",0,0,["Mr. Potato?! Ha ha! Very formal!","ポテト氏？！ あはは！ すごく ていねい！"]]]}]}
;
