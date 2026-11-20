/* 浜辺の 会話から ひっこした 「いい 会話」（2026-11-20 ユーザー「浜辺の 会話は なし。 いい 会話は ミオか リクか だれかの 会話に 当てはめて 残す」）
   - ミオの カウンターの 長い 会話（game/mio-ctr-long.js と 同じ 形）へ 4本:
       夏祭りへ 行きたい 旅行者 → L_tourist ・ テスト前の 夜の 相談 → L_test ・ ホテルの 予約トラブル → L_hotel ・ 夢か 仕事か、なやむ 音楽家 → L_leo
   - リクの ☕ ひとやすみの 長い おしゃべり（game/tutor-talk.js の TUTOR_CHATS と 同じ 形）へ 2本:
       なくした ボールを さがせ → ball ・ すなの お城を つくろう → castle
   mio-ctr-long.js・tutor-talk.js の あとに 読む */
MIOT.push(
/* ---------- 🗺️ 夏祭りへ 行きたい 旅行者（もと: エマ） ---------- */
{id:'L_tourist',k:'long',st:0,ico:'🗺️',t:'お祭りへ 行きたい 旅行者',ph:["Go straight and turn left.","まっすぐ 行って 左に まがって。"],nodes:{
 s:{m:["Boss! A tourist came in and asked, \"Where is the summer festival?\" I said \"Wait a moment!\" and ran here. Help!","店長！ 旅行者の 人が 来て 「夏祭りは どこ？」って。 「ちょっと 待って！」って 言って 走ってきちゃった。 たすけて！"],ex:'oops',o:[
  ["It's at the shrine tonight.","今夜、 神社で やってるよ。",'a',2],["It's on the beach tonight.","今夜、 浜辺で やってるよ。",'a',2],["It was last year.","去年 だったよ。",'late',0]]},
 late:{m:["Last year?! …Boss, the drums are already playing outside. It's tonight!","去年？！ …店長、 外で もう たいこが 鳴ってますよ。 今夜です！"],ex:'laugh',o:[
  ["Ha ha, just kidding. It's at the shrine.","あはは、 じょうだん。 神社だよ。",'a',1]]},
 a:{m:["OK! And she asked, \"How can I get there?\" What should I say?","はい！ それで 「どうやって 行けば いい？」って。 なんて 言えば いい？"],ex:'smile',o:[
  ["Go straight and turn left at the bank.","まっすぐ 行って、 銀行で 左。",'b',3],["It's only ten minutes on foot.","歩いて 10分だけだよ。",'b',2],["Tell her to fly.","飛んで いけって。",'fly',0]]},
 fly:{m:["\"Please fly\"? She's not a seagull, boss! Ha ha!","「飛んで ください」？ カモメじゃ ないんですよ、 店長！ あはは！"],ex:'laugh',o:[
  ["OK, \"Go straight and turn left.\"","じゃあ 「まっすぐ 行って 左」。",'b',2]]},
 b:{m:["\"Go straight and turn left.\" Got it! …Oh, and she wants to know what to eat there.","「まっすぐ 行って 左」。 おぼえた！ …あ、 それと 「なにを 食べれば いい？」って。"],ex:'smile',o:[
  ["Takoyaki! It's delicious.","たこやき！ おいしいよ。",'c',2],["Shaved ice. Try the melon flavor.","かき氷。 メロン味が おすすめ。",'c',2],["Raw octopus. It's still dancing.","生の タコ。 まだ おどってる。",'oct',0]]},
 oct:{m:["Dancing?! If I say that, she will run back to her hotel! …Something normal, please.","おどってる？！ そんなこと 言ったら ホテルに にげ帰っちゃう！ …ふつうの もので おねがいします。"],ex:'oops',o:[
  ["Takoyaki. It's cooked, don't worry.","たこやき。 ちゃんと 焼いてあるよ。",'c',1]]},
 c:{m:["I'll tell her! …Boss, she asked one more thing. \"Will you come with me?\" She means… us.","伝えてきます！ …店長、 もう ひとつ。 「いっしょに 来て くれる？」って。 …わたしたちの ことです。"],ex:'wink',o:[
  ["Sure! Let's go together.","いいよ！ みんなで 行こう。",'endG',3],["You go. I'll watch the shop.","ミオが 行って。 店番 しておく。",'endO',2],["Only if she buys us takoyaki.","たこやきを おごって くれるなら。",'endF',1]]},
 endG:{m:["Yay! Fireworks with a new friend! I'll put up the \"Closed for the festival\" sign!","やった！ 新しい 友だちと 花火！ 「お祭りの ため お休み」の 札、 出してきます！"],ex:'laugh',p:'peace',end:'good'},
 endO:{m:["OK! I'll bring you a souvenir. …Maybe a goldfish. I'll name it \"Boss.\"","はい！ おみやげ 買ってきますね。 …金魚 かな。 名前は 「店長」に します。"],ex:'wink',end:'ok'},
 endF:{m:["Boss! …She said yes. She's buying twelve takoyaki. You're a very clever guide!","店長！ …OKだって。 たこやき 12こ おごって くれるそうです。 ちゃっかり ガイドさん！"],ex:'laugh',end:'fun'}}},

/* ---------- 📚 テスト前の 夜の 相談（もと: タク） ---------- */
{id:'L_test',k:'long',st:1,ico:'📚',t:'テスト前の 夜',ph:["Even if you make mistakes, keep talking.","まちがえても、 話しつづけて。"],nodes:{
 s:{m:["Boss… I have an English test at college tomorrow. And right now my head is empty. Completely empty.","店長… あした 大学で 英語の テストなんです。 で、 いま 頭が からっぽ。 ほんとに からっぽ。"],ex:'oops',o:[
  ["Don't worry. I'll help you.","だいじょうぶ。 手つだうよ。",'a',3],["Me neither!","ぼくも わからない！",'both',0],["Just sleep. You'll be fine.","もう ねなよ。 なんとか なる。",'sleep',0]]},
 both:{m:["You too?! Then we're both in trouble! …Wait, you're the boss. You know English!","店長も？！ じゃあ ふたりとも ピンチ！ …まって、 店長は 英語 できるでしょ！"],ex:'laugh',o:[
  ["Ha ha. OK, let's study together.","あはは。 じゃあ いっしょに 勉強しよう。",'a',2]]},
 sleep:{m:["Sleep… that's tempting. …No! If I sleep now, I'll dream about the test. Help me first!","ねる… ひかれる。 …だめ！ いま ねたら テストの 夢を 見る。 先に 助けて！"],ex:'sleepy',o:[
  ["OK, OK. First question.","わかった わかった。 1問目。",'a',1]]},
 a:{m:["OK, quiz me! …No, wait, I'll ask you. What's the past tense of \"go\"?","じゃあ 問題 出して！ …いや、 わたしが 聞く。 go の 過去形は？"],ex:'smile',o:[
  ["It's \"went.\"","went だよ。",'b',3],["It's \"goed.\"","goed。",'goed',0],["\"Gone with the wind.\"","「風と ともに 去りぬ」。",'goed',0]]},
 goed:{m:["Boss! Even I know that's wrong! …Ha ha, OK, now I remember. \"Went\"!","店長！ わたしでも ちがうって わかる！ …あはは、 でも 思い出した。 went！"],ex:'laugh',o:[
  ["See? Your head isn't empty.","ほら。 からっぽじゃ ないよ。",'b',2]]},
 b:{m:["Next! Another way to say \"I'm nervous\"?","つぎ！ I'm nervous の べつの 言い方は？"],ex:'smile',o:[
  ["I'm worried.","I'm worried.",'c',2],["I have butterflies in my stomach.","おなかに ちょうちょが いる。",'butter',3],["I'm a banana.","わたしは バナナです。",'banana',0]]},
 butter:{m:["Butterflies in my stomach? …Oh! That's how I feel right now! What a cute way to say it.","おなかに ちょうちょ？ …あ！ いまの わたし、 まさに それ！ かわいい 言い方。"],ex:'laugh',o:[
  ["It's an idiom. Use it tomorrow.","たとえだよ。 あした つかってみて。",'c',2]]},
 banana:{m:["\"I'm a banana\"… if I write that, my teacher will draw a big X. And a sad face.","「わたしは バナナです」… それ 書いたら 先生が でっかい バツと かなしい 顔 かきますよ。"],ex:'oops',o:[
  ["Sorry. \"I'm worried.\"","ごめん。 I'm worried。",'c',1]]},
 c:{m:["You're a good teacher, boss. Last question… how can I get better at English? Not just for tomorrow.","店長、 教えるの じょうず。 さいごの 質問… どうしたら 英語が うまく なる？ あした だけじゃ なくて。"],ex:'smile',o:[
  ["Talk a lot, even if you make mistakes.","まちがえても、 たくさん 話すこと。",'endG',3],["Read English comics.","英語の マンガを 読む。",'endO',2],["Just stare at the teacher.","先生を じっと 見つめる。",'endF',0]]},
 endG:{m:["Even if I make mistakes… OK! Then let's talk in English at the counter every day. I got this!","まちがえても… よし！ じゃあ カウンターで 毎日 英語で 話しましょう。 いける！"],ex:'laugh',p:'guts',end:'good'},
 endO:{m:["Comics! There are English comics on the shelf at Nora's shop. I'll buy one after the test. A reward!","マンガ！ ノラさんの お店に 英語の マンガ ありましたよね。 テストが おわったら 買おう。 ごほうび！"],ex:'wink',end:'ok'},
 endF:{m:["Like this? …(stares) …Boss, you're laughing. I'm going to do this to my teacher tomorrow. For science.","こう？ …（じーっ） …店長、 わらってる。 あした 先生に やってみます。 実験です。"],ex:'laugh',end:'fun'}}},

/* ---------- 🏨 ホテルの 予約トラブル（もと: エマ） ---------- */
{id:'L_hotel',k:'long',st:2,ico:'🏨',t:'ホテルの 予約トラブル',ph:["Could you check again under my name?","わたしの 名前で もう一度 さがして もらえますか？"],nodes:{
 s:{m:["Boss, my friend called me from a hotel abroad. They say they have no record of her reservation! She wants to know what to say. In English.","店長、 海外の ホテルに いる 友だちから 電話。 予約が ないって 言われたって！ なんて 言えば いいか 知りたいって。 英語で。"],ex:'oops',o:[
  ["Does she have the confirmation email?","予約の 確認メール ある？",'a',3],["Is she at the right hotel?","ホテル、 あってる？",'a',2],["Tell her to sleep on the beach.","浜辺で ねればって。",'beach',0]]},
 beach:{m:["The beach? With the crabs? She'll come back with no socks! …Something useful, boss.","浜辺？ カニと いっしょに？ くつ下 とられて 帰ってきますよ！ …役に立つ ほうで、 店長。"],ex:'laugh',o:[
  ["OK. Does she have the email?","わかった。 メールは ある？",'a',2]]},
 a:{m:["She has the email! But the clerk only says, \"Fully booked.\" What should she say?","メールは あるって！ でも フロントの 人、 「満室です」しか 言わないの。 なんて 言えば いい？"],ex:'smile',o:[
  ["\"Could you check again under my last name?\"","「名字で もう一度 さがして もらえますか？」",'b',3],["\"I'd like to speak to the manager.\"","「支配人と 話したいです」",'b',2],["Shout \"I'm from Japan!\"","「日本から 来たのよ！」って さけぶ。",'shout',0]]},
 shout:{m:["\"I'M FROM JAPAN!\" …Boss, she would get a free cookie and be asked to leave. Politely.","「日本から 来たのよ！」 …店長、 それ クッキー もらって ていねいに 追い出される やつです。"],ex:'laugh',o:[
  ["Ha ha. \"Could you check again, please?\"","あはは。 「もう一度 さがして ください」",'b',1]]},
 b:{m:["They found it! …But it's for next month. She booked the wrong date! Now what?","見つかった！ …でも 来月の 予約に なってた。 日にちを まちがえたんだって！ どうしよう？"],ex:'oops',o:[
  ["\"Is there any room available tonight?\"","「今夜 あいている 部屋は ありますか？」",'c',3],["\"Could you change the date to tonight?\"","「日にちを 今夜に かえられますか？」",'c',3],["\"Then I'll come back next month.\"","「じゃあ 来月 また 来ます」",'next',0]]},
 next:{m:["And sleep where tonight? On a fishing boat that smells like squid? …Try again, boss.","じゃあ 今夜は どこで ねるの？ イカくさい 船？ …もう一回、 店長。"],ex:'oops',o:[
  ["\"Is there any room available tonight?\"","「今夜 あいている 部屋は ありますか？」",'c',2]]},
 c:{m:["They have one room. A suite. Twice the price! Her voice on the phone is shaking.","1部屋 あるって。 スイートルーム。 ねだんは 2ばい！ 電話の 声が ふるえてます。"],ex:'oops',o:[
  ["Ask for a discount. It was a misunderstanding.","ねびきを たのんで。 行きちがい だったんだから。",'endG',3],["If it's within her budget, it might be worth it.","予算内なら、 いいかもね。",'endO',2],["Offer to clean the hotel instead.","かわりに ホテルを そうじするって。",'endF',0]]},
 endG:{m:["She did it! The suite for the normal price! …Boss, you're an amazing negotiator. Remind me never to haggle with you.","やった！ スイートを ふつうの ねだんで！ …店長、 交渉の 天才。 店長とは ぜったい 値切りあい しないように しよう。"],ex:'laugh',p:'peace',end:'good'},
 endO:{m:["She took it! She just sent a photo… a bath with an ocean view. \"Best mistake ever,\" she says.","とまるって！ いま 写真が 来た… 海が 見える おふろ。 「最高の まちがい」だって。"],ex:'smile',end:'ok'},
 endF:{m:["…They said yes?! She's cleaning forty rooms. She says her English for \"mop\" and \"bucket\" is now perfect.","…OKだって？！ 40部屋 そうじ してるって。 「モップと バケツの 英語は もう 完ぺき」だそうです。"],ex:'laugh',end:'fun'}}},

/* ---------- 🎸 夢か 仕事か、なやむ 音楽家（もと: レオ） ---------- */
{id:'L_leo',k:'long',st:3,ico:'🎸',t:'夢か 仕事か',ph:["What does your heart say?","心は なんて 言ってる？"],nodes:{
 s:{m:["Boss, you know Leo? The guitar guy who buys music cards? He got a job offer from a big company. But it means quitting music. He asked me what I think…","店長、 レオさん 知ってます？ 音楽の カードを 買っていく ギターの 人。 大きい 会社から 仕事の 話が 来たんだって。 でも 音楽を やめる ことに なる。 わたしに どう 思う？って…"],ex:'smile',o:[
  ["That's tough. What does his heart say?","むずかしいね。 心は なんて 言ってるの？",'a',3],["Congratulations to him!","おめでとうって 伝えて！",'a',2],["He should become a fisherman.","漁師に なれば いい。",'fish',0]]},
 fish:{m:["A fisherman? …Ha ha, he'd bring fish to the shop every day. But seriously, boss.","漁師？ …あはは、 毎日 お店に 魚 持ってきそう。 でも まじめに、 店長。"],ex:'laugh',o:[
  ["Sorry. What does his heart say?","ごめん。 心は なんて？",'a',2]]},
 a:{m:["\"My heart says music. My bank account says the job.\" That's what he said. What would you do in his shoes?","「心は 音楽。 銀行口座は 仕事」だって。 店長が レオさんの 立場なら どうする？"],ex:'oops',o:[
  ["I'd take the job and keep music as a hobby.","仕事を とって、 音楽は しゅみで つづける。",'job',3],["I'd follow my passion, even if it's risky.","リスクが あっても 好きな ことを する。",'dream',3],["I'd take off his shoes. They look too small.","くつを ぬがせる。 小さそうだから。",'shoe',0]]},
 shoe:{m:["\"In his shoes\" means \"in his place,\" boss! …But actually, his shoes ARE too small. I'll tell him.","「in his shoes」は 「その 人の 立場なら」ですよ、 店長！ …でも ほんとに くつ 小さいかも。 言っておきます。"],ex:'laugh',o:[
  ["Ha ha. Then… follow the dream.","あはは。 じゃあ… 夢を 追う。",'dream',1],["Then… take the job.","じゃあ… 仕事を とる。",'job',1]]},
 job:{m:["A hobby… that's realistic. But will he really keep playing if he works sixty hours a week?","しゅみ… 現実的。 でも 週60時間 働いて、 ほんとに ひきつづけ られるかな？"],ex:'smile',o:[
  ["Weekend gigs could be enough.","週末の ライブで いいと 思う。",'c',2],["He could ask for fewer hours.","働く 時間を へらして もらえば いい。",'c',3]]},
 dream:{m:["Even if it's risky… He's twenty-five. He says, \"What if I fail?\"","リスクが あっても… レオさん 25さい なんです。 「失敗したら どうしよう」って。"],ex:'smile',o:[
  ["Failing is how you learn.","失敗から 学ぶんだよ。",'c',3],["He could set a deadline, like two years.","2年とか、 期限を きめれば いい。",'c',3],["Then he'd be a failed 26-year-old.","じゃあ 失敗した 26さいに なる。",'harsh',0]]},
 harsh:{m:["Boss! …That's brutally honest. I won't tell him that one. Maybe… a softer one?","店長！ …正直すぎます。 それは 伝えません。 もう少し… やさしいのを？"],ex:'oops',o:[
  ["Failing is how you learn.","失敗から 学ぶんだよ。",'c',2]]},
 c:{m:["I'll tell him. …One more thing. His parents want him to take the job. How should he talk to them?","伝えますね。 …もう ひとつ。 ご両親は 仕事を とって ほしいんだって。 どう 話せば いい？"],ex:'smile',o:[
  ["Explain his plan calmly.","計画を おちついて 説明する。",'endG',3],["Write a song for them.","親への 歌を 作る。",'endO',2],["Just move to Okinawa.","沖縄に にげる。",'endF',0]]},
 endG:{m:["A real plan, not just feelings. …I'll tell him tomorrow. Boss, you'd make a great manager. Oh wait, you already are one.","気持ちだけ じゃなく、 ちゃんとした 計画。 …あした 伝えます。 店長、 いい マネージャーに なれますね。 あ、 もう 店長だった。"],ex:'laugh',p:'thumb',end:'good'},
 endO:{m:["A song for his parents… that's so Leo. If he writes it, I'll play it as the shop's BGM. With his permission.","親への 歌… レオさんらしい。 できたら お店の BGMで ながします。 ちゃんと きょかを もらって。"],ex:'smile',end:'ok'},
 endF:{m:["Okinawa… tempting. But he says his mom would find him in one day. Ha ha!","沖縄… ひかれる。 でも 「母さんなら 1日で 見つける」って 言ってましたよ。 あはは！"],ex:'laugh',end:'fun'}}}
);

/* ---------- リクの ☕ ひとやすみ（分かれ道）: [あなた, リクの 返事, つぎ（null で おわり）] ---------- */
TUTOR_CHATS.push(
 {id:'ball',t:'🎾 ポチの ボールさがし',n:{
  s:{r:'せんせい たいへん！ ポチの ボールが なくなっちゃった！ いっしょに さがして！ Help!',o:[
   ['Sure! What color is it?','赤！ 赤くて まるいの！ Red and round！','a'],
   ['Yes, I can.','やった！ せんせい 最高！','a'],
   ['ポチが 食べた かも','えー！ …ポチ、 口 あけて。 …べろしか ないよ！ あはは','a']]},
  a:{r:'まず どこ さがす？ ベンチの 下？ 海？',o:[
   ["Let's look under the bench.",'ベンチの 下… あった！ …あれ、 これ くつだ。 だれの？','b'],
   ["Let's look in the sea.",'海！ …バシャーン！ …赤いの ある！ …カニだった！ はさまれた〜','b'],
   ['かき氷やさんの ほう','くんくん… あまい におい！ ポチも そっちに 走っていった！','b']]},
  b:{r:'あ！ かき氷やさんが ボール もってる！ なんて 言えば いい？',o:[
   ["Can I have my ball, please?",'キャン アイ ハブ… マイ ボール プリーズ！ …わらって かえして くれた！ かき氷も ちょっと もらった！',null],
   ['Thank you!','サンキュー！ …朝 ひろって くれてたんだって！',null],
   ['Give it to me!','ギブ イット トゥ ミー！ …「おねがい でしょ！」って おこられた〜。 Please を わすれた！',null]]}}},
 {id:'castle',t:'🏰 すなの お城',n:{
  s:{r:'ねえ せんせい、 すなの お城 つくろう！ 大きい お城？ 小さい おうち？',o:[
   ['A big castle!','A big castle！ とうも つけよう！','a'],
   ['A small house.','A small house！ かわいい！ だれが すむ？ カニ？','a'],
   ['ピザ','すなの ピザ？！ …トッピングは 貝がらと わかめ！ …やっぱり お城に しよ','a']]},
  a:{r:'かたく するには 水が いるの。 せんせい、 水 くんできて！',o:[
   ['Here you are.','ヒア ユー アー！ ありがとう！ ペタペタ… かたく なった！','b'],
   ['すなを もってくる','すなは いっぱい あるよ〜！ 水だってば！ あはは','b'],
   ['のんじゃった','海の 水 のんだの？！ しょっぱいでしょ〜！ はい、 ぼくの ジュース','b']]},
  b:{r:'できた！ …あっ！ 大きい 波が 来る！ どうしよう！？',o:[
   ["Let's build a wall!",'かべ！ はやく はやく！ …まもれた！ せんせい、 すごい 大工さん！',null],
   ["Let's take a picture!",'はい、 チーズ！ …波に もっていかれた。 でも しゃしんが ある！ また つくろうね',null],
   ["Let's swim!",'いま？！ …バシャーン！ びしょぬれ！ お城も なくなった〜！ あはは！',null]]}}}
);
