/* 💬 ミオと 話す: 分岐する 長い 会話（英語）・なかよし度（♥）・関係の 段階・プレゼント（game/gift.js）
   - ミオは 20さいの 大学生（大人）。 英語を 勉強中で、 いつも 笑顔で 元気、 少し おっちょこちょい
   - ♥ は 会話・プレゼント・お店の 英語で 上がる。 ほうって おいても 下がらない
   - 段階: はじめまして → 店長と バイト → なかよし → なかま → ？？？ → ？？？（着くまで かくす）
   会話の 形: nodes = {key:{m:[英語,日本語],ex:表情,p:ポーズ,o:[[英語,日本語,つぎ,♥]]}}、 おわりは {m,ex,end:'good'|'ok'|'fun'} */
const MIO_STG=[{n:'はじめまして',ico:'🌱',need:0},{n:'店長と バイト',ico:'🏷️',need:6},{n:'なかよし',ico:'🌼',need:18},{n:'たよれる なかま',ico:'🤝',need:36},
  {n:'気になる ふたり',ico:'💓',need:60},{n:'こいびと',ico:'💞',need:999}];
const MIO_TALKS=[
/* ---------- はじめまして ---------- */
{id:'hello',st:0,ico:'👋',t:'ミオって どんな 人？',nodes:{
 s:{m:["Boss, can I ask you something? Do you want to know about me? Ha ha, I'll tell you anyway!","店長、 ちょっと いいですか？ わたしの こと 知りたいですか？ あはは、 どっちにしても 話しちゃいます！"],ex:'laugh',p:'wave',o:[
  ["Sure, tell me about yourself.","うん、 自己紹介して。",'a',1],["How old are you?","何さい？",'age',1],["I'm a little busy…","ちょっと いそがしくて…",'busy',0]]},
 age:{m:["I'm twenty! I'm in my second year of college. I'm officially an adult now, but my mom still calls me every day.","20さいです！ 大学2年生。 もう りっぱな 大人なのに、 母は 毎日 電話してきます。"],ex:'wink',o:[
  ["That's sweet of her.","やさしい お母さんだね。",'a',2],["Every day? Wow.","毎日？ すごいね。",'a',1]]},
 busy:{m:["Oh! Sorry, sorry! …Just one minute? Please? I practiced this introduction ten times!","あっ！ すみません！ …1分だけ？ おねがい！ この 自己紹介、 10回 練習したんです！"],ex:'oops',o:[
  ["OK, one minute.","わかった、 1分ね。",'a',1],["Ten times? Then I have to listen!","10回も？ じゃあ 聞かなきゃ！",'a',2]]},
 a:{m:["I study at a college in the city. My major is tourism. Someday I want to guide people from other countries around this beach!","町の 大学で 観光を 勉強してます。 いつか 外国の 人に この 浜辺を 案内したいんです！"],ex:'smile',p:'thumb',o:[
  ["That's a great dream.","すてきな 夢だね。",'b',2],["So that's why you study English.","だから 英語を 勉強してるんだ。",'b',2],["Can you guide me now?","いま 案内して くれる？",'guide',1]]},
 guide:{m:["Now? OK! Ahem… \"On your left, you can see… a card shop! It's very… cardy!\" …I need more practice.","いま？ いいですよ！ えへん… 「左手に 見えますのは… カードショップ！ とても… カードっぽい！」 …もっと 練習が いりますね。"],ex:'oops',o:[
  ["Ha ha! That was fun.","あはは！ おもしろかった。",'b',2],["\"Cardy\" isn't a word…","「cardy」って 単語は ないよ…",'b',1]]},
 b:{m:["But my English is still… how do you say… \"so-so.\" That's why I work here. Customers from everywhere come, so I can practice!","でも 英語は まだ… なんて いうんだっけ… 「まあまあ」。 だから ここで バイトしてるんです。 いろんな お客さんが 来るから 練習に なる！"],ex:'smile',o:[
  ["Let's practice together.","いっしょに 練習しよう。",'end1',3],["Your English sounds good to me.","じゅうぶん 上手だと 思うよ。",'end2',2],["Is that why you talk to seagulls?","だから カモメにも 話しかけてるの？",'end3',1]]},
 end1:{m:["Really? Yay! Then from today, you're my boss AND my English partner! Let's do our best!","ほんとに？ やった！ じゃあ きょうから 店長で、 英語の パートナーです！ がんばりましょう！"],ex:'laugh',p:'guts',end:'good'},
 end2:{m:["Th-thank you! You're too kind, boss. I'll work extra hard today!","あ、 ありがとうございます！ 店長、 やさしすぎます。 きょうは いつもより がんばります！"],ex:'wink',p:'peace',end:'ok'},
 end3:{m:["You saw that?! …They're good listeners! They never correct my grammar!","見てたんですか？！ …カモメは 聞き上手なんです！ 文法を なおして こないし！"],ex:'oops',end:'fun'}}},
{id:'card',st:0,ico:'🃏',t:'すきな カード',nodes:{
 s:{m:["Boss, which card do you like best? Mine is \"sunny.\" It makes me happy just by looking at it.","店長は どの カードが いちばん 好きですか？ わたしは 「sunny」。 見てるだけで 元気が 出るんです。"],ex:'smile',o:[
  ["I like \"ocean.\"","ぼくは 「ocean」かな。",'a',1],["I like the cards I found in the mine.","鉱山で 見つけた カードが 好き。",'mine',2],["I like coins more than cards.","カードより コインが 好き。",'coin',0]]},
 coin:{m:["Boss! You can't say that in a card shop! …But I understand a little. Ha ha.","店長！ カードショップで それ 言っちゃ だめです！ …でも ちょっと わかります。 あはは。"],ex:'laugh',o:[
  ["Just kidding.","じょうだんだよ。",'a',1],["Coins buy snacks.","コインで おやつが 買える。",'a',1]]},
 mine:{m:["Oh, I get it! When you work hard for something, you love it more. Like… homework you finally finish!","わかります！ がんばって 手に 入れた ものって、 もっと 好きに なりますよね。 やっと おわった 宿題 みたいに！"],ex:'smile',o:[
  ["Exactly.","そう それ。",'a',2],["Homework isn't that lovely…","宿題は そんなに かわいくないよ…",'a',1]]},
 a:{m:["Did you know? When I learn a new word, I write it on a sticky note and put it on the mirror. My mirror is yellow now.","知ってます？ わたし、 新しい 単語を おぼえたら ふせんに 書いて 鏡に はるんです。 いま 鏡が まっ黄色。"],ex:'wink',o:[
  ["That's a smart idea.","それ かしこいね。",'b',2],["Can you still see your face?","まだ 顔 見える？",'b',1]]},
 b:{m:["Hey, boss… if you were a card, what word would you be? I think you'd be… \"kind.\" Or maybe \"sleepy.\"","ねえ 店長… もし カードに なるなら、 どの 単語ですか？ 店長は… 「kind」かな。 それとも 「sleepy」？"],ex:'smile',o:[
  ["\"Kind\" sounds nice.","「kind」が いいな。",'end1',3],["Then you'd be \"sunny.\"","じゃあ ミオは 「sunny」だね。",'end2',3],["Definitely \"hungry.\"","ぜったい 「hungry」。",'end3',1]]},
 end1:{m:["OK! Then the \"kind\" card is my favorite too now. Shh, don't tell the \"sunny\" card!","じゃあ 「kind」の カードも お気に入りに します。 しーっ、 「sunny」には ないしょですよ！"],ex:'wink',p:'peace',end:'good'},
 end2:{m:["M-me? \"Sunny\"? …Ha ha, that's the best thing anyone has said to me this week!","わ、 わたしが 「sunny」？ …あはは、 今週 いちばん うれしい ことばです！"],ex:'laugh',p:'cheeks',end:'good'},
 end3:{m:["Ha ha! Then I'll be \"rice ball.\" We're a perfect combo!","あはは！ じゃあ わたしは 「rice ball」。 ぴったりの コンボですね！"],ex:'laugh',end:'fun'}}},
/* ---------- 店長と バイト ---------- */
{id:'study',st:1,ico:'📚',t:'英語の 勉強法',nodes:{
 s:{m:["Boss, I have a question. How do you remember so many words? I forget them the next day… like my umbrella.","店長、 しつもんです。 どうやって そんなに 単語を おぼえてるんですか？ わたし、 つぎの 日には わすれちゃう… かさ みたいに。"],ex:'oops',o:[
  ["I use them again and again.","何回も 使うんだ。",'rep',3],["I say them out loud.","声に 出して 言うよ。",'loud',2],["I don't. I just guess.","おぼえてない。 カンだよ。",'guess',0]]},
 guess:{m:["Guessing?! …Wait, is that why you're so calm during quizzes? I want that power!","カン？！ …だから クイズの とき おちついてるんですね？ その ちから ほしい！"],ex:'laugh',o:[
  ["Just kidding. I use them a lot.","じょうだん。 たくさん 使ってるよ。",'rep',2]]},
 loud:{m:["Out loud? Like this? \"APPLE! BANANA!\" …Oops, a customer is looking at me.","声に 出す？ こう？ 「APPLE！ BANANA！」 …あっ、 お客さんが 見てる。"],ex:'oops',o:[
  ["Maybe a little quieter.","もう少し 小さい声で。",'rep',2],["Perfect! Louder!","かんぺき！ もっと 大きく！",'rep',1]]},
 rep:{m:["Again and again… That's like the mine, right? You dig with the same word many times. I see! That's why you're good!","何回も… 鉱山と 同じですね！ 同じ 単語で 何回も ほる。 なるほど！ だから 店長は 強いんだ！"],ex:'smile',p:'point',o:[
  ["You can try it too.","ミオも やってみたら？",'a',2],["It's hard work, though.","でも 大変だよ。",'a',1]]},
 a:{m:["Then can you quiz me? Here's my word: \"customer.\" What does it mean? …Wait, I'm the one being quizzed!","じゃあ クイズ 出してください！ わたしの 単語は 「customer」… あれ、 わたしが 出題してる！"],ex:'oops',o:[
  ["Ha ha. OK. What's \"receipt\" in Japanese?","あはは。 じゃあ 「receipt」は 日本語で？",'q',2],["You're funny, Mio.","ミオって おもしろいね。",'b',2]]},
 q:{m:["\"Receipt\"… Ree-SEE-pt? The \"p\" is silent, right? It's レシート! I got it!","「receipt」… リ・シー・ト？ 「p」は 読まないんですよね？ レシート！ 正解！"],ex:'laugh',p:'guts',o:[
  ["Correct! Great job.","正解！ すごいね。",'end1',3],["Correct. You're better than me.","正解。 ぼくより 上手かも。",'end2',2]]},
 b:{m:["Funny is good! My teacher says if you laugh, you remember. So I'm always laughing… and still forgetting.","おもしろいは いいこと！ 先生が 「笑うと おぼえる」って。 だから いつも 笑ってるのに… わすれます。"],ex:'laugh',o:[
  ["We'll fix that together.","いっしょに なんとか しよう。",'end1',3],["Maybe laugh less?","笑うの へらしてみる？",'end3',0]]},
 end1:{m:["Yes! From today, let's be study buddies! I'll make flashcards for both of us… if I don't lose them.","はい！ きょうから 勉強なかまです！ ふたり分の 単語カード 作ります… なくさなければ。"],ex:'laugh',p:'guts',end:'good'},
 end2:{m:["No way! But… thank you. I'm going to remember \"receipt\" forever now.","そんな！ でも… ありがとうございます。 「receipt」は 一生 わすれません。"],ex:'wink',p:'peace',end:'ok'},
 end3:{m:["Never! A smiling shop is a happy shop! That's my rule, boss.","むりです！ 笑顔の お店は しあわせな お店！ わたしの ルールです、 店長。"],ex:'laugh',end:'fun'}}},
{id:'oops',st:1,ico:'🌊',t:'ミオの しっぱい',nodes:{
 s:{m:["Boss… I have to confess something. Yesterday, I… dropped a card into the sea.","店長… 白状しなきゃ いけない ことが あります。 きのう… カードを 1まい 海に 落としました。"],ex:'oops',o:[
  ["Oh no! Which card?","えっ！ どの カード？",'which',1],["It's OK. Don't worry.","だいじょうぶ。 気に しないで。",'ok',3],["You owe me ten coins.","10コイン 弁償ね。",'pay',0]]},
 pay:{m:["T-ten coins?! …OK. I'll pay. Here. …Wait, these are chocolate coins. Sorry, those are my lunch.","じゅ、 10コイン？！ …はい。 払います。 どうぞ。 …あ、 それ チョコの コインでした。 お昼ごはんです。"],ex:'oops',o:[
  ["Ha ha, I was joking.","あはは、 じょうだんだよ。",'ok',2],["Chocolate is fine.","チョコでも いいよ。",'which',1]]},
 which:{m:["It was \"wave\"… The wave took \"wave.\" Isn't that kind of poetic?","「wave」です… 波が 「wave」を さらって いきました。 ちょっと 詩的じゃないですか？"],ex:'smile',o:[
  ["That's actually beautiful.","たしかに きれいだね。",'ok',2],["Don't make it sound nice!","いい話っぽく しないで！",'ok',1]]},
 ok:{m:["Thank you, boss… Actually, I make a lot of mistakes. Last week I said \"I'm hungry\" when I wanted to say \"I'm angry.\"","ありがとう、 店長… じつは わたし、 しっぱいが 多いんです。 先週は 「I'm angry」って 言いたいのに 「I'm hungry」って。"],ex:'oops',o:[
  ["Mistakes help you learn.","まちがいから 学ぶんだよ。",'a',3],["Were you angry or hungry?","おこってたの？ おなか すいてたの？",'b',1]]},
 b:{m:["Both, probably! When I'm hungry, I get a little angry. So it was correct in the end!","たぶん 両方！ おなかが すくと ちょっと おこりっぽく なるので。 結局 正しかった！"],ex:'laugh',o:[
  ["That's called \"hangry.\"","それ 「hangry」って いうんだよ。",'hangry',2]]},
 hangry:{m:["\"Hangry\"! Hungry plus angry! English is so fun! I'm writing it on a sticky note right now!","「hangry」！ hungry と angry が 合体！ 英語 たのしい！ いますぐ ふせんに 書きます！"],ex:'laugh',p:'pencil',o:[
  ["You learned a new word today.","きょうも 新しい 単語、 ひとつ ふえたね。",'end1',3]]},
 a:{m:["Mistakes help you learn… That's true. In the mine, when you get it wrong, you remember it better next time, right?","まちがいから 学ぶ… たしかに。 鉱山でも、 まちがえた 単語は つぎ よく おぼえてますもんね。"],ex:'smile',o:[
  ["Right. So keep making mistakes.","そう。 だから どんどん まちがえて。",'end1',3],["But please don't drop more cards.","でも カードは もう 落とさないでね。",'end2',2]]},
 end1:{m:["OK! I'll make lots of mistakes… but only the good kind! Thank you, boss. I feel much better.","はい！ いっぱい まちがえます… いい まちがい だけ！ ありがとう、 店長。 元気 出ました。"],ex:'laugh',p:'guts',end:'good'},
 end2:{m:["Yes, boss! I'll hold them with both hands from now on. Like a baby bird!","はい、 店長！ これからは 両手で もちます。 ひなどり みたいに！"],ex:'wink',p:'thumb',end:'ok'}}},
/* ---------- なかよし ---------- */
{id:'college',st:2,ico:'🎒',t:'大学の 話',nodes:{
 s:{m:["Boss, guess what! Today in class, I gave a presentation in English. In front of thirty people!","店長、 聞いてください！ きょう 授業で 英語の 発表を したんです。 30人の 前で！"],ex:'laugh',p:'guts',o:[
  ["How did it go?","どうだった？",'how',1],["Wow! You must have been nervous.","すごい！ きんちょうしたでしょ。",'nerv',2],["Did you drop your notes?","メモ 落とした？",'drop',1]]},
 drop:{m:["How did you know?! They flew everywhere. But I picked them up and said, \"Excuse me, my notes wanted to dance.\" Everyone laughed!","なんで わかったんですか？！ ばらばらに なりました。 でも 拾いながら 「すみません、 メモが おどりたかったみたいで」って。 みんな 笑ってくれました！"],ex:'laugh',o:[
  ["That's a great save!","ナイス フォロー！",'how',3],["Classic Mio.","ミオらしいね。",'how',2]]},
 nerv:{m:["So nervous! My hands were shaking like jelly. But I remembered what you said: practice again and again.","すごく！ 手が ゼリーみたいに ふるえて。 でも 店長の ことばを 思い出しました。 何回も 練習する。"],ex:'smile',o:[
  ["I'm glad it helped.","役に 立って よかった。",'how',2]]},
 how:{m:["My topic was \"Our Beach.\" I talked about the stars, the radios, and… this shop. I said the boss is very kind.","テーマは 「わたしたちの 浜辺」。 星の こと、 ラジオの こと、 それから… この お店の こと。 店長は とても やさしい って 言いました。"],ex:'wink',o:[
  ["You talked about me?","ぼくの こと 話したの？",'me',2],["What did your teacher say?","先生は なんて？",'teach',1]]},
 teach:{m:["She said, \"Your English has improved a lot.\" I almost cried. Then I actually cried. Then I laughed. It was a busy day.","「英語が すごく 上達したね」って。 なきそうに なって、 ほんとに ないて、 それから 笑いました。 いそがしい 日でした。"],ex:'laugh',o:[
  ["I'm proud of you.","ほこらしいよ。",'end1',3],["That's a lot of feelings.","気持ちが いそがしいね。",'end3',1]]},
 me:{m:["Of course! You're a big part of my English story. …Is that a strange thing to say?","もちろん！ 店長は わたしの 英語の 物語の 大事な 一部です。 …へんな 言い方 ですか？"],ex:'smile',p:'chest',o:[
  ["Not strange at all. Thank you.","ぜんぜん。 ありがとう。",'end1',3],["You're part of mine, too.","ミオも ぼくの 物語の 一部だよ。",'end2',4]]},
 end1:{m:["Thank you, boss. Next time, I want to give a presentation about the mine. Can I borrow your pickaxe for a prop?","ありがとう、 店長。 つぎは 鉱山の 発表を したいです。 小道具に つるはし 借りても いいですか？"],ex:'laugh',p:'peace',end:'good'},
 end2:{m:["…! Ha ha… my face is warm. It must be the sun. Yes. The sun.","…！ あはは… 顔が あつい。 きっと 太陽の せいです。 そう、 太陽。"],ex:'oops',p:'cheeks',end:'good'},
 end3:{m:["Very busy! My feelings need a part-time job too. Ha ha!","すごく！ わたしの 気持ちも バイトが ひつようです。 あはは！"],ex:'laugh',end:'fun'}}},
{id:'dream',st:2,ico:'✈️',t:'ミオの 夢',nodes:{
 s:{m:["Boss, do you have a dream? I have a big one. I want to go abroad and work as a tour guide someday.","店長、 夢って ありますか？ わたしは 大きいのが あります。 いつか 海外で ツアーガイドとして はたらきたいんです。"],ex:'smile',o:[
  ["Where do you want to go?","どこに 行きたい？",'where',2],["My dream is to dig to the bottom of the mine.","ぼくの 夢は 鉱山の 底まで ほること。",'mine',1],["You can do it.","ミオなら できるよ。",'can',3]]},
 mine:{m:["The bottom of the mine! That's a great dream too. What do you think is down there? A dragon? A hot spring?","鉱山の 底！ それも すてきな 夢！ なにが あると 思います？ ドラゴン？ 温泉？"],ex:'laugh',o:[
  ["A hot spring would be nice.","温泉が いいな。",'where',1],["Maybe your lost card \"wave.\"","ミオが 落とした 「wave」かも。",'where',2]]},
 can:{m:["You think so? Most people say, \"Your English isn't good enough yet.\" But you just… believe me. Thank you.","そう 思いますか？ たいてい 「まだ 英語が たりないよ」って 言われるのに。 店長は… 信じてくれる。 ありがとう。"],ex:'smile',p:'chest',o:[
  ["Where do you want to go first?","さいしょは どこに 行きたい？",'where',2]]},
 where:{m:["First, an island with clear water and white sand… Wait, that's here! Ha ha. Then maybe somewhere with snow. I've never touched snow.","まずは 水が すんでて 白い 砂の 島… あれ、 ここだ！ あはは。 それから 雪の ある ところ。 雪に さわった ことが ないんです。"],ex:'laugh',o:[
  ["Snow is cold but beautiful.","雪は つめたいけど きれいだよ。",'a',2],["Never? Not even once?","いちども？",'a',1]]},
 a:{m:["When I become a guide, I'll come back and show tourists this shop. \"This is where I learned to talk to the world!\"","ガイドに なったら、 ここに もどってきて 観光客に この お店を 案内します。 「ここで わたしは 世界と 話す ことを おぼえました！」って。"],ex:'smile',p:'there',o:[
  ["I'll be waiting here.","ここで 待ってるよ。",'end1',4],["Will you give me a discount tour?","ガイドの 割引 してくれる？",'end3',1],["Don't forget your umbrella.","かさ わすれないでね。",'end2',2]]},
 end1:{m:["…You'll wait? Then I have to make my dream come true. Pinky promise, boss!","…待っててくれるんですか？ じゃあ 夢を かなえなきゃ。 ゆびきりですよ、 店長！"],ex:'laugh',p:'guts',end:'good'},
 end2:{m:["Ha ha! You remember my umbrella story! OK, I'll write \"UMBRELLA\" on my hand.","あはは！ かさの 話、 おぼえてたんですね！ 手に 「UMBRELLA」って 書いておきます。"],ex:'wink',end:'ok'},
 end3:{m:["A discount? For the boss… it's free! But you have to carry my bags. Deal?","割引？ 店長は… むりょう！ でも 荷物もち してくださいね。 決まり？"],ex:'laugh',p:'thumb',end:'fun'}}},
/* ---------- なかま ---------- */
{id:'rain',st:3,ico:'☔',t:'雨の 日の お店',nodes:{
 s:{m:["It's raining so hard today. No customers… Just you and me, boss. And the sound of the rain.","きょうは すごい 雨ですね。 お客さん ゼロ… 店長と わたしと、 雨の 音だけ。"],ex:'smile',o:[
  ["I like rainy days like this.","こういう 雨の 日、 好きだな。",'like',2],["Let's clean the shelves.","たなの そうじ しよっか。",'clean',1],["Do you want some cocoa?","ココア 飲む？",'cocoa',3]]},
 clean:{m:["Good idea! …Hey, look. I found a card behind the shelf. It's… \"together.\" Funny timing, right?","いいですね！ …あ、 見て。 たなの うしろに カードが。 「together」… なんだか タイミングいいですね。"],ex:'smile',o:[
  ["Maybe it's a sign.","なにかの しるし かもね。",'cocoa',2]]},
 like:{m:["Me too. Rain makes everything slow. My heart feels quiet… In a good way.","わたしも。 雨って ぜんぶ ゆっくりに なりますよね。 心が しずかに なる… いい 意味で。"],ex:'smile',o:[
  ["Do you want some cocoa?","ココア 飲む？",'cocoa',2]]},
 cocoa:{m:["Cocoa! Yes, please! …Ahh, warm. Boss, can I tell you something I've never told anyone?","ココア！ ください！ …はあ、 あったかい。 店長、 だれにも 言った ことない 話、 してもいい？"],ex:'laugh',o:[
  ["Of course. I'm listening.","もちろん。 聞いてるよ。",'a',3],["Is it about the umbrella again?","また かさの 話？",'a',1]]},
 a:{m:["When I started here, I was scared. Scared of speaking English, scared of making mistakes. But here, nobody laughs at my mistakes… They laugh with me.","ここで はたらき 始めたころ、 こわかったんです。 英語を 話すのも、 まちがえるのも。 でも ここでは だれも わたしを 笑わない… いっしょに 笑ってくれる。"],ex:'smile',p:'chest',o:[
  ["You're brave, Mio.","ミオは 勇気が あるよ。",'b',3],["That's because of your smile.","それは ミオの 笑顔の おかげだよ。",'b',4]]},
 b:{m:["…Thank you. You always say the right thing. Hey, the rain stopped. Look, a rainbow over the sea!","…ありがとう。 店長は いつも ほしい ことばを くれますね。 あ、 雨 やんだ。 見て、 海の 上に にじ！"],ex:'laugh',p:'look',o:[
  ["It's beautiful.","きれいだね。",'end1',3],["Make a wish!","ねがいごと しよう！",'end2',2],["Let's sell rainbow cards.","にじの カード 売ろう。",'end3',1]]},
 end1:{m:["Yes… Let's remember this. The rain, the cocoa, and the rainbow. Our secret rainy day.","はい… おぼえておきましょう。 雨と、 ココアと、 にじ。 ふたりの ひみつの 雨の 日。"],ex:'smile',p:'cheeks',end:'good'},
 end2:{m:["A wish… OK! …Done. It's a secret. But it might be about someone in this shop. Ha ha!","ねがいごと… はい！ …しました。 ひみつです。 でも この お店の だれかの こと かも。 あはは！"],ex:'wink',end:'good'},
 end3:{m:["Boss! You're always thinking about business! …That's why the shop is doing well. Ha ha.","店長！ いつも 商売の ことばっかり！ …だから お店が うまく いってるんですね。 あはは。"],ex:'laugh',end:'fun'}}},
{id:'night',st:3,ico:'🌙',t:'閉店後の 浜辺',nodes:{
 s:{m:["The shop is closed. Boss, want to walk on the beach a little? The stars are amazing tonight.","閉店です。 店長、 ちょっと 浜辺を 歩きませんか？ 今夜は 星が すごいんです。"],ex:'smile',p:'there',o:[
  ["Sure, let's go.","いいよ、 行こう。",'a',2],["Only if you don't fall in the sea.","海に 落ちないなら ね。",'a',1]]},
 a:{m:["Look! That's Orion. In English class, we learned constellation names. \"Constellation\" is such a long word, isn't it?","見て！ あれが オリオン座。 英語の 授業で 星座の 名前を ならったんです。 「constellation」って 長い 単語ですよね。"],ex:'laugh',p:'look',o:[
  ["Can you spell it?","つづり 言える？",'spell',1],["The stars are as bright as you.","星は ミオみたいに 明るいね。",'bright',3],["Let's make a new constellation.","新しい 星座 つくろう。",'make',2]]},
 spell:{m:["C-O-N-S-T… E-L… L-A-T-I-O-N! Did I do it? Did I? …I did! Mine training works!","C-O-N-S-T… E-L… L-A-T-I-O-N！ できた？ できました？ …できた！ 鉱山の 特訓の 成果！"],ex:'laugh',p:'guts',o:[
  ["Perfect!","かんぺき！",'b',2]]},
 make:{m:["A new one? OK… those three stars are… \"The Pickaxe!\" And next to it… \"The Rice Ball!\" It's our shop constellation!","新しいの？ じゃあ… あの 3つは 「つるはし座」！ その となりは 「おにぎり座」！ お店の 星座です！"],ex:'laugh',o:[
  ["I love it.","いいね。",'b',2]]},
 bright:{m:["Eh?! W-what? …You can't say that so suddenly, boss. My heart almost jumped into the sea.","えっ？！ な、 なに？ …そんな 急に 言わないでください、 店長。 心臓が 海に とびこむ ところでした。"],ex:'oops',p:'cheeks',o:[
  ["Sorry. But I mean it.","ごめん。 でも 本当だよ。",'b',3],["Ha ha, sorry.","あはは、 ごめん。",'b',1]]},
 b:{m:["…Hey, boss. Thank you for tonight. Walking with you feels… easy. Like I don't have to try hard.","…ねえ 店長。 今夜は ありがとう。 店長と 歩くと… らくなんです。 がんばらなくて いいって いうか。"],ex:'smile',o:[
  ["Let's walk again sometime.","また 歩こう。",'end1',3],["I feel the same.","ぼくも 同じ 気持ち。",'end2',4],["Watch out, a crab!","あ、 カニ！",'end3',0]]},
 end1:{m:["Yes! It's a promise. The stars are our witnesses.","はい！ 約束です。 星が 証人ですよ。"],ex:'laugh',p:'thumb',end:'good'},
 end2:{m:["…The same? …Ha ha. OK. Then… good night, boss. See you tomorrow. I'll… I'll be looking forward to it.","…同じ？ …あはは。 そっか。 じゃあ… おやすみなさい、 店長。 また あした。 …楽しみに してます。"],ex:'smile',p:'cheeks',end:'good'},
 end3:{m:["KYAAA! …Oh, it's tiny. Hello, little crab. …Boss, you're laughing too much!","きゃあ！ …あ、 ちっちゃい。 こんばんは、 カニさん。 …店長、 笑いすぎです！"],ex:'oops',end:'fun'}}},
/* ---------- ？？？（気になる ふたり） ---------- */
{id:'heart',st:4,ico:'💓',t:'ミオの 気持ち',nodes:{
 s:{m:["Boss… can I talk to you for a minute? It's not about the shop. It's… about me. And maybe… you.","店長… 少し いいですか？ お店の 話じゃ ないんです。 わたしの… それから たぶん… 店長の 話。"],ex:'smile',o:[
  ["Of course. What is it?","もちろん。 どうしたの？",'a',2],["Did you drop another card?","また カード 落とした？",'drop',0]]},
 drop:{m:["N-no! Not this time! …This is serious, boss. Please listen.","ち、 ちがいます！ 今回は！ …まじめな 話なんです、 店長。 聞いてください。"],ex:'oops',o:[
  ["Sorry. I'm listening.","ごめん。 聞いてるよ。",'a',2]]},
 a:{m:["I practiced this in English, so I'll say it in English. …I like you. Not as my boss. As a person. I really like you.","英語で 練習したから 英語で 言います。 …あなたが 好きです。 店長と してじゃ なくて、 ひとりの 人と して。 本当に 好き。"],ex:'smile',p:'chest',o:[
  ["I like you too, Mio.","ぼくも ミオが 好きだよ。",'yes',5],["Can I think about it a little?","少し 考えても いい？",'wait',1],["Let's stay friends for now.","いまは なかまの ままで いよう。",'friend',1]]},
 wait:{m:["Of course! Take your time. I'll be here… sweeping the floor and pretending I'm calm. Ha ha.","もちろん！ ゆっくりで いいです。 ここに いますから… ゆかを はきながら、 へいきな ふりを してます。 あはは。"],ex:'smile',end:'ok'},
 friend:{m:["…OK. Thank you for being honest. You're still my favorite boss. That won't change!","…わかりました。 正直に 言ってくれて ありがとう。 それでも いちばんの 店長です。 それは かわりません！"],ex:'smile',p:'thumb',end:'ok'},
 yes:{m:["…Really? You're not joking? …Yay! YAY! Oh no, I'm crying and laughing at the same time again!","…ほんと？ じょうだんじゃ ない？ …やった！ やったあ！ どうしよう、 また ないてるのに 笑ってる！"],ex:'laugh',p:'guts',o:[
  ["That's very you.","ミオらしいね。",'end1',3],["Let's go on a date sometime.","こんど デート しよう。",'end1',3]]},
 end1:{m:["From today, you're my boss… and someone special. Let's keep learning English together, and… everything else, too.","きょうから 店長は… わたしの とくべつな 人です。 英語も、 ほかの ことも、 いっしょに 学んでいきましょうね。"],ex:'smile',p:'cheeks',end:'good',lover:1}}},
/* ---------- ？？？（こいびと） ---------- */
{id:'date',st:5,ico:'🏮',t:'夜市で デート',nodes:{
 s:{m:["Our first date at the night market! I'm so excited. I even wore my favorite bandana. Do you notice anything?","はじめての デートは 夜市！ わくわくします。 お気に入りの バンダナで きました。 なにか 気づきます？"],ex:'laugh',p:'peace',o:[
  ["It looks great on you.","すごく にあってるよ。",'a',3],["Is it… new?","…新しい？",'a',2],["You wear it every day.","毎日 つけてるよね。",'every',0]]},
 every:{m:["It's a DIFFERENT yellow! This one is \"sunflower yellow\"! …Ha ha, OK, it's almost the same.","ちがう 黄色なんです！ これは 「ひまわり色」！ …あはは、 ほとんど 同じですね。"],ex:'oops',o:[
  ["Sunflower yellow suits you.","ひまわり色、 にあってる。",'a',2]]},
 a:{m:["Look, a shooting game! If I win, I'll get you that big stuffed seal. Watch me!","見て、 射的！ 勝ったら あの 大きな アザラシの ぬいぐるみ とって あげます。 見ててください！"],ex:'laugh',p:'guts',o:[
  ["Good luck!","がんばって！",'b',2],["Let me try too.","ぼくも やる。",'b',2]]},
 b:{m:["…I missed all of them. But the shop owner gave me a tiny seal anyway. He said, \"For your smile.\" Here, this is for you.","…ぜんぶ はずれました。 でも おじさんが ちっちゃい アザラシ くれました。 「笑顔に」って。 はい、 これ どうぞ。"],ex:'wink',o:[
  ["I'll treasure it.","大切に するよ。",'c',3],["It's cute. Like you.","かわいい。 ミオ みたいに。",'c',3]]},
 c:{m:["Hey… thank you for always listening to my English, even when it's messy. Your words make me brave.","ねえ… めちゃくちゃな 英語でも いつも 聞いてくれて ありがとう。 あなたの ことばが わたしを 勇気づけるんです。"],ex:'smile',p:'chest',o:[
  ["Your English makes me happy.","ミオの 英語を 聞くと しあわせに なる。",'end1',3],["Let's come again next year.","来年も 来よう。",'end2',3]]},
 end1:{m:["…Ha ha. Then I'll keep talking forever. You can't stop me now!","…あはは。 じゃあ ずっと 話しつづけます。 もう とめられませんよ！"],ex:'laugh',p:'cheeks',end:'good'},
 end2:{m:["Next year… and the year after that. Let's make a lot of \"next years,\" OK?","来年も… その つぎの 年も。 「来年」を いっぱい つくりましょうね。"],ex:'smile',p:'thumb',end:'good'}}},
{id:'promise',st:5,ico:'🌅',t:'ふたりの 約束',nodes:{
 s:{m:["Good morning! I came early to watch the sunrise. …And I wanted to see you before work. Is that OK?","おはようございます！ 朝日を 見に 早く 来ちゃいました。 …それと、 仕事の 前に 会いたくて。 いいですか？"],ex:'smile',o:[
  ["Of course. Good morning, Mio.","もちろん。 おはよう、 ミオ。",'a',2],["You came before me? That's a first.","ぼくより 早い？ はじめてだね。",'a',1]]},
 a:{m:["I got good news. My college chose me for a study abroad program! Six months… in a country with snow.","いい 知らせが あるんです。 大学の 留学プログラムに えらばれました！ 6か月… 雪の ある 国に。"],ex:'laugh',p:'guts',o:[
  ["Congratulations! I'm so happy for you.","おめでとう！ すごく うれしい。",'b',3],["Six months… I'll miss you.","6か月… さみしく なるね。",'miss',3]]},
 miss:{m:["Me too… But I'll write to you in English every week. My letters will be full of mistakes. Please correct them with red pen!","わたしも… でも 毎週 英語で 手紙を 書きます。 まちがいだらけの 手紙。 赤ペンで なおしてくださいね！"],ex:'smile',o:[
  ["I'll write back every time.","毎回 返事を 書くよ。",'b',3]]},
 b:{m:["When I come back, I'll be a better guide. And the first tour I give… will be for you. Our beach, our shop, our mine.","帰ってきたら、 もっと いい ガイドに なってます。 さいしょの ツアーは… あなたのため。 わたしたちの 浜辺、 お店、 鉱山。"],ex:'smile',p:'there',o:[
  ["I'll be waiting right here.","ここで 待ってるよ。",'end1',4],["Bring me some snow.","雪、 おみやげに してね。",'end2',2]]},
 end1:{m:["Promise? …Promise. Look, the sun is coming up. This is my favorite morning ever.","約束？ …約束。 見て、 朝日が のぼってきた。 いままでで いちばん 好きな 朝です。"],ex:'laugh',p:'thumb2',end:'good'},
 end2:{m:["Snow will melt, silly! …But OK, I'll bring a snow globe. Then it'll never melt, just like this feeling.","雪は とけちゃいますよ！ …でも わかった、 スノードームを もってきます。 そしたら とけない。 この 気持ちと 同じ。"],ex:'wink',p:'cheeks',end:'good'}}}];

/* プレゼントの 相手（game/gift.js の GIFT_PEOPLE に たす） */
GIFT_PEOPLE.mio={n:'ミオ',ico:'🙋‍♀️',v:{p:1.3,r:1.05},love:['z:g_cookie','z:g_bubbles','z:g_candy'],like:['sweet','food','cute','shell','music','nature'],no:['lux','book'],
 hi:["Boss? Why are you hiding your hands? …Is that for me?!","店長？ なんで 手を かくしてるんですか？ …それ、 わたしに？！"],
 r:{3:[["For me?! A {w}! I love it! Thank you, boss! I'm going to put it next to the register!","わたしに？！ {n}！ 大好き！ ありがとう、 店長！ レジの 横に かざります！"],["No way! This is exactly what I wanted! How did you know?!","うそ！ ちょうど ほしかった ものです！ なんで わかったんですか？！"]],
  2:[["A {w}! It's so nice! Thank you!","{n}！ すてき！ ありがとうございます！"],["Thank you, boss! I'll take good care of it.","ありがとう、 店長！ 大切に します。"]],
  1:[["Oh, a {w}. Thank you! It's… interesting!","あ、 {n}。 ありがとう！ その… おもしろいですね！"],["Thank you! I'll find a good place for it… somewhere.","ありがとう！ どこかに… いい 場所を 見つけます。"]],
  0:[["Ah… a {w}. That's very fancy… Maybe too fancy for a student like me. Ha ha.","あ… {n}。 すごく りっぱ… わたしみたいな 学生には もったいないかも。 あはは。"],["Hmm, a {w}… I'm sorry, boss, I'm not good with these. But thank you for thinking of me!","うーん、 {n}… ごめんなさい、 ちょっと 苦手で。 でも 思いついてくれて うれしい！"]]},
 ask:["Where did you find it? I want to go there too!","どこで 見つけたんですか？ わたしも 行きたい！"],why:["Why did you choose this for me?","なんで これを えらんでくれたんですか？"],
 hint:["I love sweet things and cute things! And anything that makes a sound, like bubbles or music!","あまい ものと かわいい ものが 大好き！ あと シャボン玉とか 音楽とか、 楽しい 音の する もの！",'sweet'],
 bye:[["Thank you, boss! I'm going to smile all day. Well, I always do, but today it's extra!","ありがとう、 店長！ きょうは 一日じゅう 笑顔です。 いつもですけど、 きょうは 特別！"],["Thanks, boss! Let's do our best at work today!","ありがとう、 店長！ きょうも お仕事 がんばりましょう！"]],
 fun:["Ha ha ha! Boss, you're so funny! I can't breathe!","あはははは！ 店長、 おもしろすぎます！ 息が できない！"]};
