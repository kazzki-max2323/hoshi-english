/* 💬 カウンターで ミオと 話す 「長い 会話」（分かれ道と エンドつき。 しくみは game/mio-ctr.js）
   形は 「ミオと 話す」（game/mio-talk.js）と 同じ: nodes = {key:{m:[英語,日本語],ex,p,o:[[英語,日本語,つぎ,♥]]}}、 おわりは {m,ex,end:'good'|'ok'|'fun'}
   k:'long'、 st は 関係の 段階、 if で 出る ときを しぼれる（(e,N,mem,段階)、 N は RECENT.now()） */
MIOT.push(
/* ---------- はじめまして ---------- */
{id:'L_name',k:'long',st:0,ico:'🌊',t:'「しおさい」って なに？',ph:["the sound of the waves","波の 音"],nodes:{
 s:{m:["Boss, a customer asked me, \"What does 'Shiosai' mean?\" I didn't know what to say!","店長、 お客さんに 「しおさいって どういう 意味？」って 聞かれて、 なんて 言えば いいか わからなくて！"],ex:'oops',o:[
  ["It means \"the sound of the waves.\"","「波の 音」って 意味だよ。",'a',2],["What did you say?","なんて 言ったの？",'said',1],["It means \"salty sky.\"","「しょっぱい 空」って 意味。",'joke',0]]},
 said:{m:["I said, \"It's… a Japanese word!\" And then I smiled very hard.","「えっと… 日本語です！」って。 それで 思いっきり 笑顔で ごまかしました。"],ex:'laugh',o:[
  ["Ha ha. It means \"the sound of the waves.\"","あはは。 「波の 音」って 意味だよ。",'a',2],["That's not wrong.","まちがっては ない。",'a',1]]},
 joke:{m:["\"Salty sky\"? …Wait, really? I almost believed you! Boss!","「しょっぱい 空」？ …え、 ほんと？ 信じかけた！ 店長！"],ex:'oops',o:[
  ["Sorry. It's \"the sound of the waves.\"","ごめん。 「波の 音」だよ。",'a',1]]},
 a:{m:["\"The sound of the waves\"… That's so pretty. Listen, boss. You can hear it right now.","「波の 音」… すてき。 聞いて、 店長。 いまも 聞こえる。"],ex:'smile',o:[
  ["Shh… I hear it.","しーっ… 聞こえる。",'b',3],["I only hear seagulls.","カモメしか 聞こえない。",'gull',1]]},
 gull:{m:["Ha ha! The seagulls are very loud today. Maybe we should call the shop \"Kamome\"!","あはは！ きょうは カモメが うるさいですね。 お店の 名前、 「かもめ」に しちゃう？"],ex:'laugh',o:[
  ["No, \"Shiosai\" is better.","いや、 「しおさい」が いい。",'b',2],["\"Seagull Cards\"? Not bad.","「カモメ カード」？ 悪くない。",'endF',1]]},
 b:{m:["Next time a customer asks, I'll say, \"It means the sound of the waves. Please listen!\" …Is that OK?","次に 聞かれたら 「波の 音って 意味です。 聞いてみて ください！」って 言います。 …どう ですか？"],ex:'smile',p:'thumb',o:[
  ["Perfect.","かんぺき。",'endG',3],["Maybe shorter.","もう少し みじかく。",'short',1]]},
 short:{m:["Shorter… \"Waves. Listen.\" …Hmm, now it sounds like a secret code.","みじかく… 「波。 聞け。」 …うーん、 なんか 暗号 みたい。"],ex:'oops',o:[
  ["Ha ha. The first one was better.","あはは。 さっきの ほうが いい。",'endO',2]]},
 endG:{m:["Yay! Shiosai… I like our shop even more now. Thank you, boss.","やった！ しおさい… もっと この お店が 好きに なりました。 ありがとう、 店長。"],ex:'laugh',p:'peace',end:'good'},
 endO:{m:["OK! I'll practice it ten times. To the waves. They're good listeners.","はい！ 10回 練習します。 波に むかって。 聞き上手 だから。"],ex:'wink',end:'ok'},
 endF:{m:["Then I'll make a little sign: \"Shiosai (also known as Seagull Cards).\" Ha ha!","じゃあ 小さい 看板 作ります。 「しおさい（またの 名を カモメ カード）」。 あはは！"],ex:'laugh',end:'fun'}}},
{id:'L_phone',k:'long',st:0,ico:'📞',t:'英語の 電話',ph:["Could you say that again?","もう一度 言って もらえますか？"],nodes:{
 s:{m:["Boss, help! A customer called the shop in English, and I panicked. I said \"Hello\" five times and hung up!","店長、 たすけて！ お客さんから 英語で 電話が きて、 パニックに なって… 「Hello」を 5回 言って 切っちゃった！"],ex:'oops',o:[
  ["Let's practice together.","いっしょに 練習しよう。",'a',2],["Five times?!","5回も？！",'five',1]]},
 five:{m:["Five times! \"Hello? Hello… Hello!\" Like a parrot. Pip would be proud.","5回！ 「Hello？ Hello… Hello！」 オウム みたいに。 ピップに ほめられそう。"],ex:'laugh',o:[
  ["Let's practice.","練習しよう。",'a',2]]},
 a:{m:["OK! You be the customer. I'm ready. …Ring, ring!","はい！ 店長が お客さん 役。 じゅんび OK。 …プルルル！"],ex:'smile',p:'guts',o:[
  ["\"Hi, do you have any rare cards?\"","「もしもし、 レアカード ありますか？」",'b',2],["\"Hellohowareyoudoyouhavecards?\"","「ハローハウアーユードゥーユーハブカーズ？」",'fast',1]]},
 fast:{m:["Wh-what? That was too fast! …Um… what should I say when I don't understand?","な、 なに？ はやすぎ！ …えっと… わからない ときは なんて 言えば いいの？"],ex:'oops',o:[
  ["\"Could you say that again?\"","「Could you say that again?」",'again',3],["Just say \"Yes!\"","「Yes!」って 言えば いい。",'yes',0]]},
 yes:{m:["\"Yes!\" …And then they say, \"Great, I'll buy one hundred cards!\" Boss, that's dangerous!","「Yes!」 …そしたら 「じゃあ 100まい 買います！」って 言われたら？ 店長、 それ あぶない！"],ex:'laugh',o:[
  ["OK, \"Could you say that again?\"","じゃあ 「Could you say that again?」",'again',2]]},
 again:{m:["\"Could you say that again?\" …That's so useful! Polite, and it gives me time to think.","「Could you say that again?」 …それ べんり！ ていねいだし、 考える 時間も できる。"],ex:'laugh',o:[
  ["Now, from the start.","じゃあ 最初から。",'b',2]]},
 b:{m:["\"Shiosai Card Shop, this is Mio speaking. How can I help you?\" …How was that?","「しおさい カードショップ、 ミオです。 ご用件は なんでしょう？」 …どう でした？"],ex:'smile',o:[
  ["Very professional!","すごく プロっぽい！",'endG',3],["You forgot to breathe.","息するの わすれてた。",'endF',1],["Say it a little slower.","もう少し ゆっくり。",'endO',2]]},
 endG:{m:["Yay! Next time the phone rings, I'll be ready. …Maybe I'll let it ring twice first.","やった！ 次 電話が きたら だいじょうぶ。 …とりあえず 2回 鳴らしてから 出よう。"],ex:'laugh',p:'peace',end:'good'},
 endO:{m:["\"Shiosai… Card… Shop…\" Slow and calm. Like the waves. Got it!","「しおさい… カード… ショップ…」 ゆっくり、 おちついて。 波 みたいに。 わかりました！"],ex:'smile',end:'ok'},
 endF:{m:["Ha ha! You're right. *Big breath* …OK, I'm alive. Thank you, boss.","あはは！ たしかに。 すーっ… はい、 生きてます。 ありがとう、 店長。"],ex:'laugh',end:'fun'}}},
/* ---------- 店長と バイト ---------- */
{id:'L_key',k:'long',st:1,ico:'🔑',t:'お店の かぎ',ph:["Where did you last see it?","さいごに 見たのは どこ？"],nodes:{
 s:{m:["Boss… don't be angry, OK? I can't find the key to the storeroom.","店長… おこらないで ください ね？ 倉庫の かぎが 見つからないんです。"],ex:'oops',o:[
  ["Where did you last see it?","さいごに 見たのは どこ？",'a',3],["Again?","また？",'again',0],["Let's look together.","いっしょに さがそう。",'a',2]]},
 again:{m:["\"Again\"?! That was only one time! …OK, three times. But this is the last time!","「また」？！ 1回だけ ですよ！ …まあ、 3回。 でも これで さいご！"],ex:'oops',o:[
  ["OK. Where did you last see it?","わかった。 さいごに 見たのは どこ？",'a',2]]},
 a:{m:["Let me think… This morning, I opened the storeroom. Then I counted the cards. Then I ate a rice ball…","えっと… けさ 倉庫を あけて、 カードを 数えて、 おにぎりを 食べて…"],ex:'smile',o:[
  ["Check near your rice ball.","おにぎりの 近くを 見て。",'ball',1],["Check your apron pocket.","エプロンの ポケットは？",'pocket',2],["Check your bandana.","バンダナは？",'band',2]]},
 ball:{m:["Near the rice ball… there's only a little seaweed. And… no key.","おにぎりの 近く… のりが ちょっと ある だけ。 かぎは… ない。"],ex:'oops',o:[
  ["Check your apron pocket.","エプロンの ポケットは？",'pocket',2],["Check your bandana.","バンダナは？",'band',2]]},
 pocket:{m:["My pocket… a pen, a sticky note, a shell… and a candy. No key.","ポケット… ペン、 ふせん、 貝がら… あめ。 かぎは ない。"],ex:'smile',o:[
  ["Check your bandana.","バンダナは？",'band',2],["Can I have the candy?","その あめ もらえる？",'candy',1]]},
 candy:{m:["Ha ha, sure! Here you go. …Wait, focus, boss! The key!","あはは、 どうぞ！ …いや、 集中して、 店長！ かぎ！"],ex:'laugh',o:[
  ["Check your bandana.","バンダナは？",'band',2]]},
 band:{m:["My bandana? Why would it be… *clink* …It was in my bandana. How?!","バンダナ？ なんで そんな ところに… カチャン。 …バンダナに ありました。 なんで？！"],ex:'oops',o:[
  ["Mystery solved!","なぞは とけた！",'endG',3],["You're a magician.","マジシャンだね。",'endF',1],["Let's make a key hook.","かぎを かける フック 作ろう。",'endO',2]]},
 endG:{m:["Mystery solved! Detective Boss! Thank you. I'll buy you a juice later.","なぞは とけた！ 名探偵 店長！ ありがとう。 あとで ジュース おごります。"],ex:'laugh',p:'peace',end:'good'},
 endO:{m:["A key hook! Good idea. I'll put it right next to the register. Then I can't lose it! …Probably.","かぎの フック！ いい アイデア。 レジの すぐ となりに。 これで なくさない！ …たぶん。"],ex:'smile',end:'ok'},
 endF:{m:["\"Mio the Magician!\" Ta-da! …My only trick is losing things, though.","「マジシャン ミオ」！ じゃーん！ …ただし 物を なくす 手品 だけ。"],ex:'laugh',end:'fun'}}},
{id:'L_regular',k:'long',st:1,ico:'🧑‍🎓',t:'おすすめの しかた',ph:["How about this one?","これは どうですか？"],nodes:{
 s:{m:["Boss, Ken the student always asks me, \"What do you recommend?\" But I always freeze. How do you recommend things?","店長、 学生の ケンさんが いつも 「おすすめは？」って 聞くんです。 でも かたまっちゃう。 店長は どう やって すすめてます？"],ex:'oops',o:[
  ["Ask what they like first.","まず 好きな ものを 聞く。",'ask',3],["Recommend the most expensive card.","いちばん 高い カードを すすめる。",'money',0],["Just say \"How about this one?\"","「How about this one?」って 言えば いい。",'how',2]]},
 money:{m:["Boss! That's a very… business-like answer. Ha ha. But Ken is a student. He doesn't have much money!","店長！ すごく… 商売人の 答え。 あはは。 でも ケンさんは 学生。 お金 そんなに ないですよ！"],ex:'laugh',o:[
  ["Just kidding. Ask what he likes.","じょうだん。 好きな ものを 聞いて。",'ask',2]]},
 how:{m:["\"How about this one?\" Simple! But… which one is \"this one\"?","「How about this one?」 シンプル！ でも… 「this one」って どれ？"],ex:'smile',o:[
  ["First, ask what he likes.","まず 好きな ものを 聞く。",'ask',2]]},
 ask:{m:["Ask first… \"What kind of cards do you like?\" Is that right?","まず 聞く… 「What kind of cards do you like?」 これで いい？"],ex:'smile',p:'thumb',o:[
  ["Perfect.","かんぺき。",'b',2],["Add \"Are you studying for a test?\"","「テスト勉強 中？」も 聞いてみて。",'test',3]]},
 test:{m:["Oh, that's smart! Then I can find cards for his test. Like a real English shop!","あ、 それ かしこい！ そしたら テストに 出る カードを えらべる。 本物の 英語の お店 みたい！"],ex:'laugh',o:[
  ["Let's try it. I'm Ken.","やってみよう。 ぼくが ケン。",'b',2]]},
 b:{m:["OK, role-play! \"Hi, Ken! What kind of cards do you like?\"","よし、 ロールプレイ！ 「こんにちは、 ケンさん！ どんな カードが 好き？」"],ex:'smile',p:'wave',o:[
  ["\"Animal words, I think.\"","「動物の 単語 かな」",'c',2],["\"I like… you.\"","「…きみが 好き」",'like',0]]},
 like:{m:["Wh-what?! Ken would never say that! …Boss, stay in character!","え、 え？！ ケンさんは そんな こと 言いません！ …店長、 役に 集中！"],ex:'oops',o:[
  ["Sorry. \"Animal words.\"","ごめん。 「動物の 単語」",'c',1]]},
 c:{m:["\"Animal words? Then how about this one? 'Giraffe'! It's tall, cute, and hard to spell!\"","「動物？ じゃあ これは どう？ 『giraffe』！ 背が 高くて、 かわいくて、 つづりが むずかしい！」"],ex:'laugh',o:[
  ["\"I'll take it!\"","「それ ください！」",'endG',3],["\"It's too hard to spell.\"","「つづりが むずかしすぎる」",'endO',2],["\"Do you have 'Mio'?\"","「『ミオ』の カードは ある？」",'endF',1]]},
 endG:{m:["Yes! Sold! Thank you, boss. Now I'm not scared of \"What do you recommend?\" anymore.","やった！ 売れた！ ありがとう、 店長。 もう 「おすすめは？」 こわくない。"],ex:'laugh',p:'peace',end:'good'},
 endO:{m:["\"That's why it's good practice!\" …See? I'm learning to sell. Ha ha.","「だから いい 練習に なりますよ！」 …ね？ 売り方 わかってきた。 あはは。"],ex:'wink',end:'ok'},
 endF:{m:["\"M-Mio\"? No, there's no Mio card! …But if there were, it would be very rare.","「ミ、 ミオ」？ ミオの カードは ありません！ …でも もし あったら、 すごく レア ですよ。"],ex:'oops',end:'fun'}}},
/* ---------- なかよし ---------- */
{id:'L_stars',k:'long',st:2,ico:'✨',t:'星座の 話',if:(e,N)=>N.tod==='night',ph:["the Big Dipper","北斗七星"],nodes:{
 s:{m:["Boss, the window is full of stars tonight. Do you know any constellations in English?","店長、 今夜は 窓が 星で いっぱい。 星座の 名前、 英語で 知ってます？"],ex:'smile',o:[
  ["The Big Dipper!","北斗七星（Big Dipper）！",'dip',3],["Orion.","オリオン。",'ori',2],["The Rice Ball.","おにぎり座。",'ball',0]]},
 ball:{m:["\"The Rice Ball\"? Ha ha! That's not real! …Although that star group does look a little like one.","「おにぎり座」？ あはは！ そんなの ない！ …でも あの 星たち、 ちょっと おにぎりに 見える。"],ex:'laugh',o:[
  ["See? It's real now.","ね？ いま できた。",'make',2]]},
 dip:{m:["The Big Dipper! \"Dipper\" means a big spoon, right? A spoon in the sky… for scooping the Milky Way!","北斗七星！ 「dipper」は 大きな ひしゃく ですよね？ 空の ひしゃく… 天の川を すくう ため！"],ex:'laugh',o:[
  ["That's a nice story.","すてきな お話だね。",'make',2]]},
 ori:{m:["Orion! The hunter with the belt of three stars. I always find him first. He's easy!","オリオン！ 3つ星の ベルトの 狩人。 いつも いちばんに 見つけます。 わかりやすい！"],ex:'smile',o:[
  ["Like you. You're easy to find in a crowd.","ミオみたい。 人ごみでも すぐ 見つかる。",'yellow',2]]},
 yellow:{m:["Because of my yellow bandana? Ha ha, it's my belt of three stars!","黄色い バンダナの せい？ あはは、 わたしの 3つ星 ベルトです！"],ex:'laugh',o:[
  ["Let's make our own constellation.","ふたりで 星座を 作ろう。",'make',3]]},
 make:{m:["Let's make our own! Look at those five stars… What should we call them?","じぶんたちの 星座、 作りましょう！ あの 5つの 星… なんて 名前に する？"],ex:'smile',p:'wave',o:[
  ["The Card Shop.","カードショップ座。",'endG',3],["The Sleepy Mio.","ねむい ミオ座。",'endF',1],["The Wave.","波座。",'endO',2]]},
 endG:{m:["\"The Card Shop\"! Then every night, our shop is in the sky too. I love that.","「カードショップ座」！ じゃあ 毎晩 空にも わたしたちの お店が ある。 それ 好き。"],ex:'laugh',p:'peace',end:'good'},
 endO:{m:["\"The Wave\"… for \"Shiosai.\" Simple and beautiful. Good name, boss.","「波座」… しおさいの 波。 シンプルで きれい。 いい 名前、 店長。"],ex:'smile',end:'ok'},
 endF:{m:["\"The Sleepy Mio\"?! …OK, fine. It's true. *yawn* …See?","「ねむい ミオ座」？！ …まあ、 いいです。 ほんとだし。 ふぁ… ほらね？"],ex:'sleepy',end:'fun'}}},
{id:'L_fest',k:'long',st:2,ico:'🏮',t:'夏まつりの 予定',ph:["Are you free on Saturday?","土曜日 あいてる？"],nodes:{
 s:{m:["Boss, there's a beach festival this weekend! My college friends are coming. Are you free on Saturday?","店長、 今週末 浜辺で おまつりが あるんです！ 大学の 友だちも 来ます。 土曜日 あいてます？"],ex:'laugh',p:'wave',o:[
  ["I'm free.","あいてるよ。",'a',3],["Who will watch the shop?","お店は どうするの？",'shop',1],["I'm busy digging.","ほるのに いそがしい。",'dig',0]]},
 dig:{m:["Digging?! On festival day? Boss, the mine will still be there on Sunday!","ほる？！ おまつりの 日に？ 店長、 鉱山は 日曜日も ありますよ！"],ex:'oops',o:[
  ["OK, OK. I'll come.","わかった わかった。 行く。",'a',2]]},
 shop:{m:["We'll close early! Even the seagulls go to the festival. Probably.","早めに しめましょう！ カモメも おまつりに 行きますよ。 たぶん。"],ex:'wink',o:[
  ["Then I'm free.","じゃあ あいてる。",'a',2]]},
 a:{m:["Yay! There will be food stalls, a bon dance, and fireworks at the end. What do you want to do first?","やった！ 屋台、 盆おどり、 さいごに 花火も。 最初は なにが したい？"],ex:'laugh',o:[
  ["Eat everything.","ぜんぶ 食べる。",'food',2],["The bon dance!","盆おどり！",'dance',2],["Win a goldfish.","金魚すくい。",'fish',2]]},
 food:{m:["Same! Takoyaki, shaved ice, cotton candy… Oh no, I'm hungry already.","同じ！ たこやき、 かき氷、 わたあめ… うわ、 もう おなか すいた。"],ex:'laugh',o:[
  ["Let's share.","はんぶんこ しよう。",'b',3],["I won't share.","はんぶんこ しない。",'noshare',0]]},
 noshare:{m:["What?! Then I'll buy two of everything! …My wallet will cry.","えー！ じゃあ ぜんぶ 2つずつ 買う！ …おさいふが 泣く。"],ex:'oops',o:[
  ["Just kidding. Let's share.","じょうだん。 はんぶんこ しよう。",'b',2]]},
 dance:{m:["The bon dance! I'm bad at it. I always go left when everyone goes right.","盆おどり！ 苦手なんです。 みんなが 右に 行くと わたしは 左。"],ex:'oops',o:[
  ["Just follow me.","ぼくに ついてきて。",'b',3],["Then you'll stand out!","目立って いいね！",'b',1]]},
 fish:{m:["A goldfish! I tried last year. The paper broke in two seconds. The fish laughed at me. I'm sure.","金魚！ 去年 やったけど、 2秒で ポイが やぶれた。 金魚に 笑われた。 ぜったい。"],ex:'laugh',o:[
  ["I'll catch one for you.","とって あげる。",'b',3],["Fish can't laugh.","魚は 笑わないよ。",'b',1]]},
 b:{m:["Then it's a plan! Saturday, six o'clock, in front of the shop. Don't be late, boss!","じゃあ 決まり！ 土曜日 6時、 お店の 前。 おくれないで、 店長！"],ex:'smile',p:'thumb',o:[
  ["I'll be there.","かならず 行く。",'endG',3],["You'll be late, not me.","おくれるのは ミオ でしょ。",'endF',1],["Should I wear a yukata?","ゆかた 着ようかな？",'endO',2]]},
 endG:{m:["Promise! I'll write it in my notebook. \"Saturday: festival with the boss!\" With three hearts. …I mean, stars!","約束！ ノートに 書いときます。 「土曜日: 店長と おまつり！」 ハート 3つ… じゃなくて 星 3つ！"],ex:'laugh',p:'peace',end:'good'},
 endO:{m:["A yukata! Then I'll wear one too. Mine is yellow, of course.","ゆかた！ じゃあ わたしも。 わたしのは もちろん 黄色。"],ex:'wink',end:'ok'},
 endF:{m:["Hey! …You're right, though. I'll set three alarms. Four, to be safe.","ちょっと！ …まあ そうですけど。 目ざまし 3つ… 念のため 4つ。"],ex:'oops',end:'fun'}}},
/* ---------- たよれる なかま ---------- */
{id:'L_worry',k:'long',st:3,ico:'🌧️',t:'ミオの なやみ',ph:["You've got this.","きみなら できる。"],nodes:{
 s:{m:["Boss… can I tell you something? I have an interview next month. For a study-abroad program. And I'm so scared.","店長… 聞いて くれます？ 来月 面接が あるんです。 留学プログラムの。 すごく こわくて。"],ex:'oops',o:[
  ["That's great news!","すごい ニュースだね！",'a',2],["What are you scared of?","なにが こわいの？",'b',3],["Don't go.","行かないで。",'dont',1]]},
 dont:{m:["…Boss. That's a little sweet. But I have to try. Even if it's scary.","…店長。 それ ちょっと うれしい。 でも ちょうせん しなきゃ。 こわくても。"],ex:'wink',o:[
  ["You're right. What are you scared of?","そうだね。 なにが こわいの？",'b',2]]},
 a:{m:["Is it? I haven't even passed yet. What if I fail?","そう ですか？ まだ 合格して ないのに。 落ちたら どうしよう？"],ex:'oops',o:[
  ["What are you scared of?","なにが こわいの？",'b',2]]},
 b:{m:["The English interview. What if I freeze? What if I say \"Hello\" five times again?","英語の 面接。 かたまったら どうしよう？ また 「Hello」を 5回 言ったら？"],ex:'oops',o:[
  ["Let's practice here.","ここで 練習しよう。",'c',3],["Everyone gets nervous.","だれだって きんちょう する。",'nerv',2]]},
 nerv:{m:["Even you, boss?","店長も？"],ex:'smile',o:[
  ["Of course. Let's practice.","もちろん。 練習しよう。",'c',3]]},
 c:{m:["OK… You're the interviewer. Ask me something.","じゃあ… 店長が 面接官。 なにか 聞いて ください。"],ex:'smile',o:[
  ["\"Why do you want to study abroad?\"","「なぜ 留学したいのですか？」",'why',3],["\"What is your favorite card?\"","「好きな カードは？」",'card',1]]},
 card:{m:["Ha ha! They won't ask that! …\"Sunny,\" by the way. OK, a real question, please!","あはは！ それは 聞かれない！ …ちなみに 「sunny」。 ほんとの しつもん、 おねがい！"],ex:'laugh',o:[
  ["\"Why do you want to study abroad?\"","「なぜ 留学したいのですか？」",'why',2]]},
 why:{m:["\"Because I want to be a tour guide. I want to show people from other countries how beautiful my hometown is.\" …Was that OK?","「ツアーガイドに なりたいからです。 外国の 人たちに、 わたしの ふるさとが どんなに きれいか 見せたいんです」 …どう でした？"],ex:'smile',p:'guts',o:[
  ["That was wonderful. You've got this.","すばらしかった。 きみなら できる。",'endG',3],["Add something about the card shop.","カードショップの ことも 入れて。",'endO',2],["You only said \"Hello\" once!","「Hello」が 1回 だけだった！",'endF',1]]},
 endG:{m:["\"You've got this\"… I'll remember those words on interview day. Thank you, boss. Really.","「きみなら できる」… 面接の 日、 この ことば 思いだします。 ありがとう、 店長。 ほんとに。"],ex:'wink',p:'peace',end:'good'},
 endO:{m:["\"I work at a card shop on the beach. I talk with customers in English every day.\" …That's a strong point, right? Thanks!","「浜辺の カードショップで 働いて、 毎日 お客さんと 英語で 話してます」 …強みに なりますね！ ありがとう！"],ex:'smile',end:'ok'},
 endF:{m:["Ha ha! Progress! From five \"Hellos\" to one. I'm getting better!","あはは！ 進歩！ 「Hello」 5回から 1回へ。 上達してる！"],ex:'laugh',end:'fun'}}},
{id:'L_umbrella',k:'long',st:3,ico:'☂️',t:'雨の 帰り道',if:(e,N)=>N.rain>0,ph:["Do you want to share my umbrella?","かさに 入る？"],nodes:{
 s:{m:["It's still raining… Boss, I forgot my umbrella today. The yellow one with ducks. It's at home, sleeping.","まだ 雨… 店長、 きょう かさ わすれちゃった。 アヒルがらの 黄色いの。 家で ねてます。"],ex:'oops',o:[
  ["Do you want to share my umbrella?","かさ、 いっしょに 入る？",'a',3],["Run fast!","走れば だいじょうぶ！",'run',0],["Wait until it stops.","やむまで 待とう。",'wait',2]]},
 run:{m:["Run?! In this rain? I'll be a wet seagull by the time I get home!","走る？！ この 雨で？ 家に つくころには ずぶぬれの カモメ ですよ！"],ex:'oops',o:[
  ["Just kidding. Share my umbrella.","じょうだん。 かさに 入って。",'a',2]]},
 wait:{m:["Wait together? OK! Then let's talk until the rain stops.","いっしょに 待つ？ いいですよ！ じゃあ 雨が やむまで おしゃべり。"],ex:'smile',o:[
  ["It might not stop.","やまないかも。",'a',1],["What should we talk about?","なに 話す？",'talk',2]]},
 talk:{m:["Hmm… What's your favorite rainy day memory?","うーん… 雨の 日の いちばんの 思い出は？"],ex:'smile',o:[
  ["Today, maybe.","きょう かも。",'a',3],["Splashing in puddles as a kid.","子どものころ 水たまりで あそんだ こと。",'a',2]]},
 a:{m:["…OK. Let's walk together. Your umbrella is a little small, though. Is my shoulder OK?","…じゃあ、 いっしょに 帰りましょう。 店長の かさ、 ちょっと 小さい けど。 肩、 ぬれてない？"],ex:'wink',o:[
  ["I'll hold it closer to you.","ミオの ほうに よせるよ。",'b',3],["Your shoulder is wet!","肩 ぬれてる！",'b',2]]},
 b:{m:["Boss, now YOUR shoulder is wet! …Ha ha. We're both a little wet. But it's warm. Strange, right?","店長、 こんどは 店長の 肩が ぬれてる！ …あはは。 ふたりとも ちょっと ぬれてる。 でも あったかい。 ふしぎ。"],ex:'laugh',o:[
  ["It's not strange.","ふしぎじゃ ないよ。",'endG',3],["Let's buy a bigger umbrella.","もっと 大きい かさ 買おう。",'endO',2],["Achoo!","はっくしょん！",'endF',1]]},
 endG:{m:["…Yeah. It's not strange at all. Thank you for walking me home, boss.","…うん。 ぜんぜん ふしぎじゃ ない。 送って くれて ありがとう、 店長。"],ex:'wink',p:'peace',end:'good'},
 endO:{m:["A bigger umbrella? …Or we could just walk closer. Ha ha, just kidding!","大きい かさ？ …それか もっと くっついて 歩けば。 あはは、 じょうだん です！"],ex:'laugh',end:'ok'},
 endF:{m:["Bless you! Oh no, don't catch a cold! I'll bring you ginger tea tomorrow!","おだいじに！ かぜ ひかないで！ あした しょうが湯 もってきます！"],ex:'oops',end:'fun'}}},
/* ---------- 気になる ふたり ---------- */
{id:'L_check',k:'long',st:4,ico:'📝',t:'英文チェック',ph:["I'm happy when I'm with you.","あなたと いると しあわせ。"],nodes:{
 s:{m:["Boss, can you check my English? I wrote a short essay for class. The topic is \"What makes me happy.\"","店長、 英語 チェック して くれます？ 授業の 作文。 テーマは 「わたしを しあわせに する もの」。"],ex:'smile',o:[
  ["Sure. Let me see.","いいよ。 見せて。",'a',2],["Is it about food?","食べ物の 話？",'food',1]]},
 food:{m:["Half of it is about food! …The other half is a secret. Just read it!","半分は 食べ物！ …もう半分は ひみつ。 いいから 読んで！"],ex:'laugh',o:[
  ["OK, OK.","はいはい。",'a',2]]},
 a:{m:["Here. \"I am happy when I eat cake. I am happy when I sell a card. And I am happy when I am with…\" …Um, the last part is messy.","はい。 「わたしは ケーキを 食べる とき しあわせ。 カードが 売れる とき しあわせ。 そして … と いる とき しあわせ」 …えっと、 さいごの ところ ぐちゃぐちゃで。"],ex:'oops',o:[
  ["Who is it? I can't read it.","だれ？ 読めない。",'who',2],["\"I'm happy\" sounds more natural.","「I'm happy」の ほうが 自然だよ。",'gram',3]]},
 gram:{m:["\"I'm happy\"… Right! Short forms sound more natural. Thank you, Teacher. …I mean, boss.","「I'm happy」… そっか！ みじかい 形の ほうが 自然。 ありがとう、 先生。 …じゃなくて 店長。"],ex:'smile',o:[
  ["And the last part?","で、 さいごの ところは？",'who',2]]},
 who:{m:["The last part? It says… \"…with the people at the shop.\" Yes! The people! All of them!","さいごの ところ？ …「お店の 人たちと」。 そう！ 人たち！ みんな！"],ex:'oops',o:[
  ["\"The people\"? Only one person works here with you.","「人たち」？ ミオと 働いてるの、 1人だけだよ。",'one',3],["That's a nice ending.","いい しめくくりだね。",'nice',1]]},
 nice:{m:["Th-thank you. …I'll fix the grammar and hand it in. …Before I get too embarrassed.","あ、 ありがとう。 …文法 なおして 出します。 …はずかしく なる 前に。"],ex:'wink',o:[
  ["You're red.","顔 赤いよ。",'endF',1],["Good luck with it.","がんばってね。",'endO',2]]},
 one:{m:["…I know. …OK, I'll change it. \"I'm happy when I'm with you.\" …There. I said it. In English. That counts.","…知ってます。 …じゃあ なおします。 「I'm happy when I'm with you」。 …はい。 言いました。 英語で。 ちゃんと 言った。"],ex:'wink',p:'peace',o:[
  ["Me too, Mio.","ぼくも だよ、 ミオ。",'endG',3],["That's perfect grammar.","文法も かんぺき。",'endO',2]]},
 endG:{m:["…Really? …Ha ha, my face is so hot. I think this is the best essay I've ever written.","…ほんと？ …あはは、 顔が あつい。 これ、 いままでで いちばんの 作文 かも。"],ex:'laugh',p:'peace',end:'good'},
 endO:{m:["Perfect grammar… That's the most romantic thing a boss can say. Ha ha!","文法 かんぺき… 店長が 言える いちばん ロマンチックな ことば ですね。 あはは！"],ex:'wink',end:'ok'},
 endF:{m:["I'm not red! It's the… sunset. Yes. A very strong sunset. Inside the shop.","赤く ない！ これは… 夕日。 そう。 すごく 強い 夕日。 お店の 中に。"],ex:'oops',end:'fun'}}},
/* ---------- こいびと ---------- */
{id:'L_trip',k:'long',st:5,ico:'🧳',t:'ふたりの 旅行',ph:["Let's go somewhere together.","いっしょに どこか 行こう。"],nodes:{
 s:{m:["Hey… when the shop has a long holiday, let's go somewhere together. Just the two of us. Where do you want to go?","ねえ… お店が 長い お休みの とき、 どこか いっしょに 行こう。 ふたりで。 どこに 行きたい？"],ex:'wink',p:'peace',o:[
  ["Somewhere with mountains.","山の ある ところ。",'mt',2],["Anywhere, if you're there.","ミオが いれば どこでも。",'any',3],["To another beach!","べつの 浜辺！",'beach',1]]},
 beach:{m:["Another beach?! We see a beach every day! …But a beach with you on vacation is different, I guess.","また 浜辺？！ 毎日 見てるのに！ …でも お休みの 日に いっしょに 見る 浜辺は ちがう かも。"],ex:'laugh',o:[
  ["Right?","でしょ？",'plan',2]]},
 mt:{m:["Mountains! Fresh air, hot springs, and lots of stars. And no sand in my shoes!","山！ すずしい 空気、 温泉、 星が いっぱい。 くつに 砂も 入らない！"],ex:'laugh',o:[
  ["Let's plan it.","計画 立てよう。",'plan',2]]},
 any:{m:["…That's not fair. You always say things like that so easily. …OK. Then I'll choose. Somewhere with a guidebook in English!","…ずるい。 いつも そういう こと さらっと 言う。 …じゃあ わたしが 決めます。 英語の ガイドブックが ある ところ！"],ex:'wink',o:[
  ["Of course. You'll be my guide.","もちろん。 ミオが ガイドね。",'plan',3]]},
 plan:{m:["I'll be the tour guide! \"Welcome, my only customer! Today's plan: walk, eat, and laugh.\" How's that?","わたしが ツアーガイド！ 「ようこそ、 ただ ひとりの お客さま！ きょうの 予定: 歩いて、 食べて、 笑う」 どう？"],ex:'laugh',p:'thumb',o:[
  ["Best tour ever.","最高の ツアー。",'endG',3],["Add a nap.","お昼ねも 入れて。",'endF',1],["How much is the tour?","ツアー 代は いくら？",'price',1]]},
 price:{m:["The price? Hmm… one smile per day. Very reasonable!","お値段？ うーん… 1日 笑顔 1つ。 とっても お手ごろ！"],ex:'wink',o:[
  ["I'll pay double.","2倍 はらう。",'endG',3],["That's cheap.","安いね。",'endO',2]]},
 endG:{m:["Then it's a promise. I'll start studying the guidebook tonight. …Our first trip. I can't wait.","じゃあ 約束。 今夜から ガイドブック 勉強します。 …はじめての ふたり旅。 待ちきれない。"],ex:'laugh',p:'peace',end:'good'},
 endO:{m:["\"Reasonable,\" boss. Not \"cheap\"! I'm a professional guide. Ha ha!","「お手ごろ」 ですよ、 店長。 「安い」 じゃ なくて！ プロの ガイド なので。 あはは！"],ex:'wink',end:'ok'},
 endF:{m:["A nap! In the middle of the tour? …Actually, that sounds perfect. Nap time added!","お昼ね！ ツアーの とちゅうで？ …じつは 最高かも。 お昼ね タイム 追加！"],ex:'sleepy',end:'fun'}}}
);
