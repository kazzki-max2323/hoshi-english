/* 💞 ミオとの 恋の つづき（こいびとの その先）。 しくみは game/mio-love.js、 会話の 画面は game/mio-chat.js
   こいびと → ✈️ 遠距離（留学・毎週の 手紙）→ 🎀 ふたりの 毎日（再会・ツアー・記念日・ケンカ・おそろい・夜）
   → 🤝 共同経営（卒業）→ 💍 婚約（プロポーズ）→ 🏠 夫婦（結婚式・ふたりの 暮らし）
   結婚できるのは ミナ先生か ミオの どちらか ひとり（🌠 決心の 夜、 game/mio-love.js の WED）
   会話の 形は game/mio-talk.js と 同じ。 足した もの:
     c: 何章めの 話か / if(M): 出す 条件 / nt:[[英語, 解説]]: 💌 ことばメモ（恋の 英語）/ おわりの ch: その 章へ すすむ / fx: おわりの ときの しかけ
   大人どうしの 親密な 場面は ハグ・キスまでと、 「朝まで いっしょに いた」の ぼかしまで */
const MIO_CH=[{n:'こいびと',ico:'💞'},{n:'遠距離',ico:'✈️'},{n:'ふたりの 毎日',ico:'🎀'},{n:'共同経営者',ico:'🤝'},{n:'婚約',ico:'💍'},{n:'夫婦',ico:'🏠'}];
const MIO_ALT={n:'いちばんの なかま',ico:'🌻'};
/* 章ごとの 「つぎは？」の ヒント */
const MIO_CH_HINT=['🌅 「ふたりの 約束」の あとに…','✉️ 毎日 1通、 ミオから 手紙が とどく','💬 ふたりの 毎日を 5つ すごすと…','💍 雑貨店の ガラスケースに…','💒 じゅんびが できたら…',''];

(()=>{
const seen=(M,id)=>!!(M.n&&M.n[id]);
const C=(M,c)=>M.lover&&!M.alt&&(M.c||0)===c;
const CG_=(M,c)=>M.lover&&!M.alt&&(M.c||0)>=c;
const W=()=>window.WED?WED.who():null;
const LIFE=['tour','anniv','quarrel','match','stay'];
MIO_TALKS.push(
/* ================================================================ 💞 こいびと → ✈️ 出発 */
{id:'depart',st:5,c:0,ico:'✈️',t:'出発の 日',if:M=>CG_(M,0)&&seen(M,'promise')&&W()!=='mina',nodes:{
 s:{m:["The ferry leaves in twenty minutes. My bag is so heavy… I packed three dictionaries. Is that too many?","フェリーが 出るまで あと 20分。 かばんが 重くて… 辞書を 3さつ 入れたんです。 多すぎ？"],ex:'oops',p:'wave',o:[
  ["Way too many. Ha ha.","多すぎ。 あはは。",'a',1],["You'll need all of them.","ぜんぶ いるよ、 きっと。",'a',2],["Did you pack my photo too?","ぼくの 写真も 入れた？",'photo',3]]},
 photo:{m:["…It's in my wallet. Right next to my student card. Don't laugh!","…おさいふの 中です。 学生証の となり。 笑わないで！"],ex:'wink',o:[
  ["I'm not laughing. I'm happy.","笑ってないよ。 うれしいんだ。",'a',3]]},
 a:{m:["Hey… I promised myself I wouldn't cry today. So I'm going to talk really fast. OK?","ねえ… きょうは 泣かないって 決めてたんです。 だから すごく 早口で 話します。 いい？"],ex:'smile',o:[
  ["You can cry. It's OK.","泣いても いいんだよ。",'b',3],["Talk as fast as you want.","好きなだけ 早口で。",'b',2]]},
 b:{m:["I'm going to miss you. I'm going to miss the shop, the beach, your bad jokes… everything. Can I… can I have a hug before I go?","さみしく なります。 お店も、 浜辺も、 店長の へんな じょうだんも… ぜんぶ。 行く前に… ハグ しても いいですか？"],ex:'smile',p:'cheeks',
  nt:[["I'm going to miss you.","「さみしく なるよ」。 これから はなれる 人に 言う。 はなれた あとは I miss you.（会いたい）"],["Can I have a hug?","「ハグ しても いい？」。 Come here.（おいで）と 手を ひろげて 言っても いいよ"]],o:[
  ["Come here.","おいで。",'hug',4],["Of course.","もちろん。",'hug',3],["Only if you promise to come back.","かえってくるって 約束 するなら。",'hug',3]]},
 hug:{m:["(Mio holds you tight for a long time.) …OK. Now I have enough energy for six months. Maybe.","（ミオが ぎゅっと 長い あいだ だきしめる） …よし。 これで 6か月 ぶんの 元気が たまりました。 たぶん。"],ex:'laugh',p:'cheeks',o:[
  ["Write to me every week.","毎週 手紙 ちょうだいね。",'end1',3],["I'll be counting the days.","1日 1日 かぞえて 待ってる。",'end2',4],["Don't forget to eat.","ごはん わすれずにね。",'end3',1]]},
 end1:{m:["Every week! With mistakes, as always. Your red pen is my teacher now. …Bye-bye, boss. No— see you soon!","毎週！ いつもどおり まちがい つきで。 店長の 赤ペンが わたしの 先生です。 …バイバイ、 店長。 ちがう、 またね！"],ex:'laugh',p:'wave',end:'good',ch:1},
 end2:{m:["\"Counting the days\"… I'll steal that sentence for my first letter. See you soon, my favorite person.","「1日 1日 かぞえて」… その 文、 さいしょの 手紙で つかいます。 またね、 わたしの いちばん 好きな 人。"],ex:'smile',p:'wave',
  nt:[["I'll be counting the days.","「指おり かぞえて 待ってる」。 会える 日を 心待ちに する ロマンチックな 言い方"]],end:'good',ch:1},
 end3:{m:["Food is the first thing you say?! …Ha ha, that's so you. I'll eat a lot of snow-country food and tell you about it!","さいごの ことばが ごはん？！ …あはは、 店長らしい。 雪国の ごはん いっぱい 食べて 報告します！"],ex:'laugh',p:'wave',end:'fun',ch:1}}},

/* ================================================================ ✈️ → 🎀 おかえり（手紙を ぜんぶ 読むと） */
{id:'return',st:5,c:1,ico:'🛬',t:'おかえり',if:M=>C(M,1)&&window.MIOL&&MIOL.lettersDone(),nodes:{
 s:{m:["(The ferry horn sounds. Someone is running down the ramp, waving both arms.) BOSS! I'M HOME!","（フェリーの 汽笛。 だれかが 両手を ふりながら かけおりてくる） 店長ー！ ただいまー！"],ex:'laugh',p:'wave',o:[
  ["Welcome home, Mio!","おかえり、 ミオ！",'a',3],["Don't run, you'll fall!","走ったら ころぶよ！",'fall',1],["(Open your arms.)","（だまって 両手を ひろげる）",'hug',4]]},
 fall:{m:["Too late! …I didn't fall! Look, I'm standing! Six months of snow taught me balance!","おそい！ …ころんで ません！ ほら 立ってる！ 6か月の 雪で バランスを おぼえました！"],ex:'oops',o:[
  ["(Open your arms.)","（両手を ひろげる）",'hug',3]]},
 a:{m:["I'm home! I'm really home! It smells like the sea! I missed this smell. And I missed you more.","ただいま！ ほんとに 帰ってきた！ 海の においだ！ この においが 恋しかった。 でも 店長の ほうが もっと。"],ex:'laugh',o:[
  ["(Open your arms.)","（両手を ひろげる）",'hug',3]]},
 hug:{m:["(Mio jumps into your arms.) …I missed you so much. Every single day. Your letters were my treasure.","（ミオが うでの 中に とびこむ） …ずっと 会いたかった。 毎日 毎日。 あなたの 手紙が 宝物でした。"],ex:'smile',p:'cheeks',
  nt:[["I missed you so much.","「すごく 会いたかった」。 会えた ときに 言う。 会えない 間は I miss you.（いま 会いたい）"],["Every single day.","「1日も かかさず」。 single で 「毎日」を 強める"]],o:[
  ["Your English got even better.","英語、 もっと 上手に なったね。",'b',2],["You're even more beautiful than I remembered.","思い出より ずっと きれいに なった。",'pretty',4],["You smell like snow.","雪の においが する。",'b',2]]},
 pretty:{m:["W-what? You can't say things like that at the port! People are watching! …Say it again later, OK?","な、 なに？ そんな こと 港で 言っちゃ だめ！ みんな 見てる！ …あとで もう一回 言って ね？"],ex:'oops',p:'cheeks',o:[
  ["I'll say it every day.","毎日 言うよ。",'b',3]]},
 b:{m:["Hey… do you remember our promise? The first tour I give is for you. But first… I'm starving. Rice balls?","ねえ… 約束、 おぼえてる？ さいしょの ツアーは あなたのため。 でも その前に… おなか ぺこぺこ。 おにぎり？"],ex:'wink',o:[
  ["Rice balls, then the tour.","おにぎり、 それから ツアー。",'end1',3],["I made some for you.","作ってきたよ。",'end2',4],["You and food… nothing changed.","ミオと 食べもの… 変わらないね。",'end3',1]]},
 end1:{m:["Perfect plan! Welcome to the rest of our story, boss. …I mean, welcome back to me.","かんぺきな 計画！ ふたりの 物語の つづきへ ようこそ、 店長。 …ちがう、 わたしの ところへ おかえり。"],ex:'laugh',p:'thumb',end:'good',ch:2},
 end2:{m:["You MADE them? …They're a little crooked. They're the best rice balls in the world. I'm going to cry again.","作ってくれたの？ …ちょっと いびつ。 世界一の おにぎりです。 また 泣いちゃう。"],ex:'smile',p:'cheeks',end:'good',ch:2},
 end3:{m:["Some things should never change! Like my appetite, and… how I feel about you.","変わらなくて いい ものも あるんです！ 食欲とか… あなたへの 気持ちとか。"],ex:'wink',end:'fun',ch:2}}},

/* ================================================================ 🎀 ふたりの 毎日 */
{id:'tour',st:5,c:2,ico:'🗺️',t:'約束の ツアー',if:M=>CG_(M,2),nodes:{
 s:{m:["Ahem! Good morning, and welcome to the Starfall Beach Tour! My name is Mio, and I'll be your guide today!","えへん！ おはようございます、 星降る浜辺ツアーへ ようこそ！ ガイドの ミオです！"],ex:'laugh',p:'wave',
  nt:[["I'll be your guide today.","ガイドの 決まり文句。 I'll be ～ で 「きょうは わたしが ～です」"]],o:[
  ["Nice to meet you, Mio.","よろしく、 ミオさん。",'a',2],["Is this tour free?","ツアー代は？",'pay',1]]},
 pay:{m:["The price is… one smile per stop! Very expensive. Please pay in advance.","お代は… 1か所 ごとに 笑顔 1つ！ とても 高いです。 前ばらいで おねがいします。"],ex:'wink',o:[
  ["(Smile.)","（にっこり）",'a',2]]},
 a:{m:["On your right is the lighthouse. Fun fact: sailors say if two people watch the light together, they'll always find their way back to each other.","右手に 見えますのは 灯台です。 豆ちしき： ふたりで いっしょに 灯りを 見ると、 かならず おたがいの ところへ 帰って これると 船乗りは 言います。"],ex:'smile',p:'there',o:[
  ["Is that true?","ほんと？",'true',2],["Then we already proved it.","じゃあ もう 証明ずみだね。",'proved',4]]},
 true:{m:["…I just made it up. But I believe it now.","…いま 作りました。 でも いまは 信じてます。"],ex:'oops',o:[
  ["Me too.","ぼくも。",'b',3]]},
 proved:{m:["…Sir, please don't make the guide blush. It's unprofessional.","…お客さま、 ガイドを 赤面させないで ください。 プロとして こまります。"],ex:'oops',p:'cheeks',o:[
  ["Sorry, guide.","すみません、 ガイドさん。",'b',2]]},
 b:{m:["And this is the most important stop. The card shop where a sleepy part-timer met a very kind boss. Any questions?","そして ここが いちばん 大事な 場所。 ねぼすけの バイトが、 とても やさしい 店長に 出会った カードショップです。 しつもんは？"],ex:'smile',o:[
  ["What happened next?","それから どうなったの？",'next',3],["You're the best guide ever.","最高の ガイドだよ。",'end2',3],["Where's the gift shop?","おみやげ屋は？",'end3',1]]},
 next:{m:["Next? …She fell in love. And she's still falling. The end. …No, not the end. The tour continues.","それから？ …彼女は 恋に おちました。 いまも おちてる 途中です。 おしまい。 …ちがう、 おしまいじゃ ない。 ツアーは つづきます。"],ex:'smile',p:'cheeks',
  nt:[["fall in love","「恋に おちる」。 still falling は 「いまも どんどん 好きに なってる」"]],o:[
  ["I'm falling too.","ぼくも おちてる。",'end1',4]]},
 end1:{m:["Then let's fall together. Slowly. …That was the end of today's tour. Please leave a five-star review!","じゃあ いっしょに おちましょう。 ゆっくり。 …本日の ツアーは 以上です。 星5つの レビュー、 おねがいします！"],ex:'laugh',p:'thumb',end:'good'},
 end2:{m:["Yes! My first customer gave me five stars! I'll put that in my résumé. \"Customer: my boyfriend. Rating: the best ever.\"","やった！ さいしょの お客さまから 星5つ！ 履歴書に 書きます。 「お客さま： かれし。 評価： 最高」"],ex:'laugh',p:'peace',end:'good'},
 end3:{m:["The gift shop is… this card shop! Buy a card, please! …You're my boss, so you can't, can you. Ha ha!","おみやげ屋は… この カードショップです！ カード 買ってください！ …店長だから 買えませんね。 あはは！"],ex:'laugh',end:'fun'}}},

{id:'anniv',st:5,c:2,ico:'🎂',t:'ふたりの 記念日',if:M=>CG_(M,2),nodes:{
 s:{m:["Boss, do you know what day it is today? …It's a test. You have ten seconds. Nine… eight…","店長、 きょうが なんの 日か 知ってます？ …テストです。 10びょう。 9… 8…"],ex:'wink',o:[
  ["Our anniversary. One year since you said \"I like you.\"","記念日。 ミオが 「好き」って 言ってから 1年。",'a',4],["Uh… cake day?","えっと… ケーキの 日？",'cake',1],["Of course I know. (I don't.)","もちろん 知ってる。（知らない）",'cake',0]]},
 cake:{m:["…Close. There IS cake. But it's our anniversary! One year since I said \"I like you\"! …You forgot?!","…おしい。 ケーキは あります。 でも 記念日です！ わたしが 「好き」って 言ってから 1年！ …わすれてた？！"],ex:'oops',o:[
  ["I'm sorry. I'll never forget again.","ごめん。 もう ぜったい わすれない。",'a',2],["I was testing you.","ミオを ためしてたんだよ。",'a',1]]},
 a:{m:["Happy anniversary! I made a cake. It's shaped like a card. The writing says… \"Happy Annivesary.\" I spelled it wrong. In icing. Forever.","記念日 おめでとう！ ケーキを 作りました。 カードの 形。 文字は… 「Happy Annivesary」。 つづり まちがえました。 クリームで。 永遠に。"],ex:'oops',p:'guts',
  nt:[["Happy anniversary!","「記念日 おめでとう」。 anniversary は r が 2つ… ではなく、 n が 2つ。 an-ni-ver-sa-ry"]],o:[
  ["It's perfect because you made it.","ミオが 作ったから かんぺきだよ。",'b',3],["Let me fix it. (Add an R with a fork.)","なおそう。（フォークで r を たす）",'b',2]]},
 b:{m:["One year… We've been through a lot. You know what my favorite memory is?","1年… いろいろ ありましたね。 わたしの いちばんの 思い出、 なんだと 思います？"],ex:'smile',o:[
  ["The night at the night market.","夜市の 夜？",'c',2],["The day you came home.","帰ってきた 日？",'c',3],["When you dropped a card in the sea?","カードを 海に 落とした 日？",'c',1]]},
 c:{m:["Wrong! It's… today. Because every day with you, the newest day becomes my favorite. …Was that too cheesy?","はずれ！ …きょうです。 あなたと いると、 いちばん 新しい 日が いちばん 好きな 日に なるから。 …くさすぎた？"],ex:'smile',p:'cheeks',
  nt:[["cheesy","「くさい・キザ」。 Was that too cheesy?（いまの キザすぎた？）は 照れかくしの 定番"]],o:[
  ["A little cheesy. I loved it.","ちょっと キザ。 でも 大好き。",'end1',4],["Here's to many more years.","これからの たくさんの 年に かんぱい。",'end2',4],["Very cheesy. Like pizza.","すごく チーズ。 ピザみたい。",'end3',1]]},
 end1:{m:["Ha ha! Then I'll be cheesy every year. Happy anniversary, my love.","あはは！ じゃあ 毎年 キザに なります。 記念日 おめでとう、 だいすきな 人。"],ex:'laugh',p:'cheeks',
  nt:[["my love","恋人への よびかけ。 名前の かわりに 文の さいごに つけるよ"]],end:'good'},
 end2:{m:["\"Here's to us.\" Cheers! …This is apple juice, but it feels like champagne.","「わたしたちに」。 かんぱい！ …りんごジュースだけど、 シャンパンみたい。"],ex:'laugh',p:'thumb',
  nt:[["Here's to ～.","「～に かんぱい」。 Here's to us.（ふたりに かんぱい）"]],end:'good'},
 end3:{m:["Pizza?! …Now I want pizza. Anniversary dinner: pizza and a misspelled cake. Perfect!","ピザ？！ …ピザ たべたく なりました。 記念日の ディナー： ピザと つづりの まちがった ケーキ。 かんぺき！"],ex:'laugh',end:'fun'}}},

{id:'quarrel',st:5,c:2,ico:'🌧️',t:'はじめての ケンカ',if:M=>CG_(M,2),nodes:{
 s:{m:["…Boss. You were three hours late yesterday. I waited at the café. I ordered four cocoas.","…店長。 きのう 3時間 おくれましたよね。 カフェで 待ってました。 ココア 4はい 飲みました。"],ex:'sleepy',o:[
  ["I'm really sorry. I lost track of time in the mine.","ほんとに ごめん。 鉱山で 時間を わすれてた。",'a',2],["Four cocoas?!","ココア 4はい？！",'cocoa',0],["You could have called me.","電話 くれれば よかったのに。",'called',0]]},
 cocoa:{m:["That's not the important part!","そこは 大事な ところじゃ ありません！"],ex:'oops',o:[
  ["Sorry. You're right.","ごめん。 そうだよね。",'a',2]]},
 called:{m:["I DID call! Eleven times! Your phone was in the mine with you, I guess. …I'm not angry. OK, I'm a little angry.","かけました！ 11回！ 電話も 鉱山の 中だったんでしょうね。 …おこってません。 うそ、 ちょっと おこってます。"],ex:'oops',o:[
  ["I'm sorry. That was my fault.","ごめん。 ぼくが わるかった。",'a',2],["Why are you so upset about it?","なんで そんなに おこるの？",'upset',0]]},
 upset:{m:["Because… I was worried! I thought something happened to you! …It's not about the cocoa. It never was.","だって… 心配だったんです！ なにか あったのかと 思った！ …ココアの 話じゃ ないんです。 さいしょから。"],ex:'sleepy',o:[
  ["I didn't think about that. I'm sorry I worried you.","そこまで 考えてなかった。 心配させて ごめん。",'a',3]]},
 a:{m:["…It's OK. I know you love the mine. But next time, please tell me if you'll be late. That's all I want.","…いいんです。 鉱山が 好きなの 知ってるから。 でも つぎは、 おくれるなら 言ってください。 それだけ。"],ex:'smile',
  nt:[["I'm sorry I worried you.","「心配させて ごめん」。 なにが わるかったかを 言うと、 あやまる 気持ちが つたわる"],["lose track of time","「時間を わすれる」。 言いわけでは なく 事情の 説明に"]],o:[
  ["I promise. From now on, I'll always let you know.","約束する。 これからは かならず 知らせる。",'b',3],["Can I make it up to you?","うめあわせ させて？",'make',4]]},
 make:{m:["\"Make it up to me\"? Hmm… OK. Then I want… a walk on the beach. Holding hands. The whole way.","「うめあわせ」？ うーん… じゃあ… 浜辺を おさんぽ。 手を つないで。 ずっと。"],ex:'wink',p:'cheeks',
  nt:[["Let me make it up to you.","「うめあわせ させて」。 ケンカの あとの 定番フレーズ"]],o:[
  ["Deal.","いいよ。",'b',3]]},
 b:{m:["(Walking on the beach, hand in hand.) …Hey. I'm sorry too. I said \"eleven times\" like you were a criminal.","（手を つないで 浜辺を 歩く） …ねえ。 わたしも ごめんなさい。 「11回」とか、 犯人みたいに 言っちゃって。"],ex:'smile',o:[
  ["Let's not go to bed angry.","おこったまま ねるのは やめよう。",'end1',4],["I like that you worry about me.","心配してくれるの、 うれしいよ。",'end2',3],["It was eleven times, though.","でも 11回は 11回だよ。",'end3',1]]},
 end1:{m:["\"Don't go to bed angry.\" My grandma said that too. …OK. I'm not angry anymore. I'm the opposite. Do you know the opposite of angry? It's this. (She hugs you.)","「おこったまま ねない」。 おばあちゃんも 言ってた。 …うん。 もう おこってない。 反対です。 おこるの 反対、 わかる？ これ。（ぎゅっと だきつく）"],ex:'laugh',p:'cheeks',
  nt:[["Never go to bed angry.","「ケンカは その日の うちに 仲直り」。 英語の 夫婦の ことわざ"]],end:'good'},
 end2:{m:["…You're impossible. I can't stay angry at you for more than one cocoa. Let's go home.","…ずるい人。 ココア 1ぱい ぶんも おこって いられない。 帰りましょ。"],ex:'smile',p:'cheeks',end:'good'},
 end3:{m:["…Ha ha ha! OK, OK, it was eleven! I'm a little scary when I'm worried! …Forgive me?","…あはは！ はい はい、 11回です！ 心配すると ちょっと こわいんです！ …ゆるして？"],ex:'laugh',end:'fun'}}},

{id:'match',st:5,c:2,ico:'🧶',t:'おそろいの もの',if:M=>CG_(M,2),nodes:{
 s:{m:["Boss! Close your eyes and hold out your hand. …No peeking!","店長！ 目を とじて 手を 出して。 …のぞいちゃ だめ！"],ex:'wink',o:[
  ["(Close your eyes.)","（目を とじる）",'a',2],["Is it a bug? It's a bug, isn't it?","虫？ 虫でしょ？",'bug',1]]},
 bug:{m:["It's not a bug! I'm a romantic person! …Close your eyes!","虫じゃ ありません！ わたしは ロマンチストです！ …目を とじて！"],ex:'oops',o:[
  ["(Close your eyes.)","（目を とじる）",'a',2]]},
 a:{m:["…OK, open! Matching bracelets! I made them from sea glass. Yours is blue like the sea, and mine is yellow like my bandana.","…はい、 あけて！ おそろいの ブレスレット！ シーグラスで 作りました。 あなたのは 海の 青、 わたしのは バンダナの 黄色。"],ex:'laugh',p:'peace',
  nt:[["matching bracelets","「おそろいの ブレスレット」。 matching ～ で 「おそろいの ～」。 We match!（おそろいだね）"]],o:[
  ["They're beautiful. Put it on me?","きれい。 つけてくれる？",'b',3],["Let's trade. You wear blue, I wear yellow.","交換しよう。 ぼくが 黄色、 ミオが 青。",'trade',4]]},
 trade:{m:["Trade? …So I always have a piece of your color, and you have mine. Boss, that's way more romantic than my idea!","交換？ …そしたら わたしは いつも あなたの 色を、 あなたは わたしの 色を もってる。 店長、 わたしの アイデアより ずっと ロマンチック！"],ex:'smile',p:'cheeks',o:[
  ["I learned from you.","ミオに 教わったんだよ。",'b',3]]},
 b:{m:["(She ties it around your wrist.) There. Now, whenever we're apart, look at it and think of me. That's the rule.","（手首に むすんでくれる） はい。 はなれてる ときは、 これを 見て わたしを 思い出すこと。 ルールです。"],ex:'smile',
  nt:[["think of me","「わたしを 思い出して」。 think of ～ ＝ ～の ことを 思う"]],o:[
  ["Then I'll think of you all day.","じゃあ 一日じゅう 思い出しちゃう。",'end1',4],["I'll never take it off.","ずっと はずさない。",'end2',3],["What if it falls in the sea?","海に 落としたら？",'end3',1]]},
 end1:{m:["Ha ha! Then you won't get any work done. …Me neither, probably.","あはは！ じゃあ 仕事に ならないですね。 …わたしも たぶん。"],ex:'laugh',p:'cheeks',end:'good'},
 end2:{m:["Not even in the bath? …OK, maybe in the bath. Sea glass is strong. Like us!","おふろでも？ …おふろは いいかも。 シーグラスは つよいんです。 わたしたちみたいに！"],ex:'laugh',p:'thumb',end:'good'},
 end3:{m:["Then the sea will give it back! That's where the glass came from. The sea is on our side!","そしたら 海が かえしてくれます！ この ガラスも 海から 来たんだから。 海は わたしたちの 味方！"],ex:'wink',end:'fun'}}},

{id:'stay',st:5,c:2,ico:'🌃',t:'帰りたくない 夜',if:M=>CG_(M,2),nodes:{
 s:{m:["The last ferry left an hour ago… Oops. I guess I missed it. Ha ha… what should I do?","さいごの フェリー、 1時間前に 出ちゃった… あらら。 のりおくれちゃった。 あはは… どうしよう？"],ex:'oops',o:[
  ["Did you miss it on purpose?","わざと のりおくれた？",'purpose',3],["I'll walk you to the inn.","宿まで 送るよ。",'inn',2],["Do you want to stay over at my place?","うちに 泊まってく？",'over',4]]},
 purpose:{m:["W-what?! Of course not! …Maybe. A little. I didn't want to say goodnight yet.","な、 なに？！ そんなわけ ない！ …ちょっとだけ。 まだ 「おやすみ」って 言いたく なかったんです。"],ex:'oops',p:'cheeks',
  nt:[["I didn't want to say goodnight yet.","「まだ おやすみを 言いたく なかった」。 帰りたくない 気持ちを やさしく 言う 表現"]],o:[
  ["Me neither. Stay the night.","ぼくも。 今夜は いっしょに いよう。",'over',4],["Then let's walk a little longer.","じゃあ もう少し 歩こう。",'walk',3]]},
 inn:{m:["The inn… yes, the inn. That's the right answer. …Can we walk the long way?","宿… そう、 宿ですね。 それが 正解です。 …遠まわりして 行ける？"],ex:'smile',o:[
  ["The longest way.","いちばん 遠まわりで。",'walk',3]]},
 walk:{m:["(You walk slowly under the stars. Halfway, she stops.) …Hey. Can I say something embarrassing? I don't want tonight to end.","（星の 下を ゆっくり 歩く。 とちゅうで ミオが 立ちどまる） …ねえ。 はずかしい こと 言っても いい？ 今夜が おわってほしくない。"],ex:'smile',p:'cheeks',
  nt:[["I don't want tonight to end.","「今夜が おわってほしくない」。 ロマンチックな 夜の 決まり文句"]],o:[
  ["Then stay with me tonight.","じゃあ 今夜は いっしょに いて。",'over',4],["Let's watch the sunrise together.","いっしょに 朝日を 見よう。",'sun',3]]},
 over:{m:["…Is that… an invitation? (She laughs softly.) OK. I'd like that. But I'm warning you, I steal blankets.","…それって… おさそい？ （小さく わらう） …うん。 そう したい。 でも 先に 言っておくけど、 わたし ふとん とる人です。"],ex:'wink',p:'cheeks',
  nt:[["stay over / stay the night","「泊まっていく」。 Do you want to stay over?（泊まってく？）は 親しい 人への ストレートで やさしい さそい方"],["Is that an invitation?","「それって おさそい？」。 照れながら 気持ちを たしかめる 返し"]],o:[
  ["I'll share all my blankets.","ふとんは ぜんぶ あげる。",'kiss',3],["Come here. (Kiss her.)","おいで。（キスを する）",'kiss',4]]},
 kiss:{m:["(She stands on her toes and kisses you.) …Good night isn't the right word anymore, is it.","（ミオが つまさき立ちで キスを する） …もう 「おやすみ」って 言葉じゃ ないですね。"],ex:'smile',p:'cheeks',o:[
  ["(The night goes on.)","（夜は つづく）",'morn',3]]},
 sun:{m:["(You sit on the sand and talk until the sky turns pink. She falls asleep on your shoulder, then wakes up.) …Did I sleep? Is it morning?","（砂の 上で 空が ピンクに なるまで 話す。 ミオは 肩で ねむって、 目を さます） …ねてた？ もう 朝？"],ex:'sleepy',o:[
  ["Good morning, sleepyhead.","おはよう、 ねぼすけさん。",'end2',4]]},
 morn:{m:["(…They were together until morning.) Good morning… You're already awake? Were you watching me sleep? That's not fair.","（…ふたりは 朝まで いっしょに いた） おはよう… もう おきてたの？ わたしの ねがお 見てた？ ずるい。"],ex:'sleepy',p:'cheeks',o:[
  ["You look cute when you sleep.","ねがお、 かわいかったよ。",'end1',4],["You stole all the blankets.","ふとん ぜんぶ とられた。",'end3',2]]},
 end1:{m:["Stop it! …Make me coffee and I'll forgive you. And… thank you for last night. I'm really happy.","やめて！ …コーヒー いれてくれたら ゆるします。 それと… ゆうべは ありがとう。 すごく しあわせ。"],ex:'smile',p:'cheeks',end:'good'},
 end2:{m:["Sleepyhead? You said the sweetest thing to a girl with sand in her hair. …Best sunrise ever.","ねぼすけ？ 髪に 砂が ついた 女の子に、 いちばん あまい ことば。 …最高の 朝日です。"],ex:'laugh',p:'cheeks',
  nt:[["sleepyhead","「ねぼすけさん」。 朝の 恋人や 家族への あまい よびかけ"]],end:'good'},
 end3:{m:["I warned you! I said I steal blankets! …I'll make you breakfast as an apology. Pancakes with too much syrup.","言ったでしょ！ ふとん とる人だって！ …おわびに 朝ごはん 作ります。 シロップ かけすぎの パンケーキ。"],ex:'laugh',end:'fun'}}},

/* ================================================================ 🎓 卒業 → 🤝 共同経営 */
{id:'grad',st:5,c:2,ico:'🎓',t:'卒業の 日',if:M=>C(M,2)&&LIFE.every(k=>seen(M,k)),nodes:{
 s:{m:["Boss! Look! My diploma! I graduated! …I almost tripped on the stage, but I didn't!","店長！ 見て！ 卒業証書！ 卒業しました！ …ステージで ころびそうに なったけど、 セーフ！"],ex:'laugh',p:'guts',o:[
  ["Congratulations, Mio! I'm so proud of you.","おめでとう、 ミオ！ ほんとに ほこらしいよ。",'a',3],["You almost tripped? Of course.","ころびかけたの？ さすが。",'a',1]]},
 a:{m:["Thank you for coming. Seeing your face in the crowd… that's when I almost tripped. Ha ha.","来てくれて ありがとう。 客席に あなたの 顔が 見えて… そこで ころびかけたんです。 あはは。"],ex:'smile',p:'cheeks',
  nt:[["I'm so proud of you.","「ほこりに 思う・よく がんばったね」。 家族や 恋人の 成功を 心から よろこぶ ことば"]],o:[
  ["What will you do now?","これから どうするの？",'b',2],["Did you get a job offer?","就職は 決まった？",'b',2]]},
 b:{m:["A hotel in the city offered me a job as a guide. It's a good job. But… I keep thinking about this beach. And this shop. And you.","町の ホテルから ガイドの しごとの さそいが きました。 いい しごと。 でも… この 浜辺と、 この お店と、 あなたの ことばっかり 考えちゃう。"],ex:'smile',o:[
  ["Take the job. Your dream matters.","さそいを うけて。 夢は 大事だよ。",'dream',2],["What do YOU want to do?","ミオは どうしたいの？",'want',3]]},
 dream:{m:["…You always think of me first. That's why I already decided. My dream is to guide people around THIS beach.","…いつも わたしの ことを 先に 考えてくれる。 だから もう 決めたんです。 わたしの 夢は、 この 浜辺を 案内する こと。"],ex:'smile',o:[
  ["Then stay.","じゃあ ここに いて。",'c',3]]},
 want:{m:["What I want… is to guide visitors here, at our beach. And sell cards. With you. Not as your part-timer. As your partner.","わたしが したいのは… ここで、 わたしたちの 浜辺で お客さんを 案内する こと。 カードも 売る。 あなたと。 バイトじゃ なくて、 パートナーとして。"],ex:'smile',p:'chest',o:[
  ["Partner… I like that.","パートナー… いいね。",'c',3]]},
 c:{m:["So… boss, I have a business proposal. Card shop plus beach tours. Fifty-fifty. Will you be my business partner?","だから… 店長、 ビジネスの 提案が あります。 カードショップ ＋ 浜辺ツアー。 半分ずつ。 わたしの 共同経営者に なって くれますか？"],ex:'laugh',p:'thumb',
  nt:[["business partner / co-owner","「共同経営者」。 fifty-fifty は 「半分ずつ」"],["proposal","「提案」。 結婚の 申しこみも proposal。 ミオは わざと この 単語を えらんだ？"]],o:[
  ["Yes. Let's run this shop together.","うん。 いっしょに この 店を やろう。",'end1',4],["Only if the tours include snacks.","ツアーに おやつが つくなら。",'end3',1],["You said \"proposal.\" My heart stopped.","「プロポーズ」って 言ったよね。 心臓 とまった。",'end2',3]]},
 end1:{m:["Partners! We need a new sign. \"Card Shop & Beach Tours — run by two people who like each other very much.\" Too long?","パートナー！ 新しい 看板が いるね。 「カードショップ＆浜辺ツアー ― おたがい だいすきな ふたりが やってます」 長すぎ？"],ex:'laugh',p:'peace',end:'good',ch:3},
 end2:{m:["Ha ha! That was a BUSINESS proposal! …The other kind is your job, OK? I'll be waiting.","あはは！ ビジネスの プロポーズです！ …もう ひとつの ほうは あなたの 番。 ね？ 待ってますから。"],ex:'wink',p:'cheeks',end:'good',ch:3},
 end3:{m:["Snacks are included! Rice balls on every tour! …Partners?","おやつ つきです！ 毎回 おにぎり！ …パートナー？"],ex:'laugh',p:'thumb',end:'fun',ch:3}}},

{id:'partner',st:5,c:3,ico:'📝',t:'ふたりの お店',if:M=>CG_(M,3),nodes:{
 s:{m:["Here's the partnership agreement. I wrote it myself! In English! Please read it carefully before you sign.","共同経営の 契約書です。 自分で 書きました！ 英語で！ サインの 前に よく 読んでください。"],ex:'smile',p:'pencil',o:[
  ["Let me read it.","読ませて。",'a',2],["I'll sign without reading.","読まずに サインする。",'nosign',1]]},
 nosign:{m:["No! Never sign without reading! That's lesson one in business English. Read it, partner!","だめ！ 読まずに サインは ぜったい だめ！ ビジネス英語の 第1課です。 読んで、 パートナー！"],ex:'oops',
  nt:[["Read it before you sign.","「サインの 前に 読む」。 契約の 英語の 基本"]],o:[
  ["OK, OK.","はい はい。",'a',2]]},
 a:{m:["\"Article one: The profits are split fifty-fifty. Article two: The boss makes the coffee. Article three: Mio chooses the music.\"","「第1条： 利益は 半分ずつ。 第2条： コーヒーは 店長が いれる。 第3条： 音楽は ミオが えらぶ」"],ex:'laugh',
  nt:[["profit / split","profit ＝ 利益、 split ＝ 分ける。 split the bill（わりかん）も よく 使う"]],o:[
  ["Article two is unfair!","第2条 ずるい！",'b',2],["Can I add an article?","1つ 足していい？",'add',3]]},
 add:{m:["An amendment? Very professional! What is it?","修正案？ プロっぽい！ なんですか？"],ex:'smile',o:[
  ["\"Article four: We close early on rainy days and drink cocoa.\"","「第4条： 雨の 日は 早く しめて ココアを 飲む」",'b',3],["\"Article four: Mio smiles every day.\"","「第4条： ミオは 毎日 笑う」",'b',3]]},
 b:{m:["Ha ha! Accepted! Then… sign here. And I sign here. …There. We're co-owners. It feels like a dream.","あはは！ 採用！ じゃあ… ここに サイン。 わたしは ここ。 …できた。 共同経営者です。 夢みたい。"],ex:'laugh',p:'thumb',o:[
  ["To our shop.","ふたりの お店に。",'end1',3],["Partner, let's get to work.","パートナー、 仕事 はじめよう。",'end2',2],["Can we celebrate with snacks?","おやつで おいわい できる？",'end3',1]]},
 end1:{m:["To our shop! The first card shop in the world with a tour guide, a pickaxe, and a lot of love.","ふたりの お店に！ ガイドと つるはしと たくさんの 愛が ある、 世界で はじめての カードショップ。"],ex:'smile',p:'cheeks',end:'good'},
 end2:{m:["Yes, partner! …I love saying that. Partner. Partner. OK, I'll stop.","はい、 パートナー！ …この 言葉 好き。 パートナー。 パートナー。 はい、 やめます。"],ex:'laugh',end:'good'},
 end3:{m:["Article five: Snacks are a business expense! Approved!","第5条： おやつは 経費！ 承認！"],ex:'laugh',p:'thumb',end:'fun'}}},

{id:'parents',st:5,c:3,ico:'📞',t:'ミオの 両親',if:M=>CG_(M,3),nodes:{
 s:{m:["Um… my mom wants to video call. With you. Right now. She practiced English for this. Is that OK?!","あの… お母さんが ビデオ通話 したいって。 あなたと。 いま。 この ために 英語を 練習したって。 いい？！"],ex:'oops',o:[
  ["Of course. I'd be happy to.","もちろん。 よろこんで。",'a',2],["Right now?! Let me fix my hair.","いま？！ かみ なおさせて。",'hair',2]]},
 hair:{m:["Your hair is fine! …Mostly. Here, let me. (She fixes your hair.) Perfect. Calling!","かみは だいじょうぶ！ …だいたい。 ほら。（かみを なおしてくれる） かんぺき。 かけます！"],ex:'laugh',o:[
  ["OK, I'm ready.","よし、 いいよ。",'a',2]]},
 a:{m:["(Mio's mother appears on the screen.) \"Hello! Nice to meet you! My daughter talks about you… every day. Every. Day.\"","（画面に ミオの お母さんが うつる） 「こんにちは！ はじめまして！ 娘が あなたの 話を… 毎日 するのよ。 毎日」"],ex:'oops',o:[
  ["It's a pleasure to meet you. Mio talks about you every day, too.","お会いできて うれしいです。 ミオさんも 毎日 お母さんの 話を しますよ。",'b',3],["Hi, Mom!","やあ、 お母さん！",'mom',1]]},
 mom:{m:["\"Mom?! Ha ha! I like him already!\" …Mom! Don't laugh so loud!","「お母さん？！ あはは！ 気に いったわ！」 …お母さん！ 大声で 笑わないで！"],ex:'oops',o:[
  ["Sorry. Nice to meet you, ma'am.","すみません。 はじめまして。",'b',2]]},
 b:{m:["\"Mio is clumsy and loud, but she has a big heart. Will you take care of her?\" …MOM! That's too fast!","「ミオは おっちょこちょいで うるさいけど、 心は 大きいの。 この子を よろしく たのめる？」 …お母さん！ 早すぎ！"],ex:'oops',p:'cheeks',
  nt:[["take care of ～","「～を 大切に する・めんどうを 見る」。 親が 恋人に 言う 決まった たのみ方"]],o:[
  ["I will. She takes care of me too.","はい。 ミオさんも ぼくを 支えて くれてます。",'end1',4],["Yes. I'll cherish her.","はい。 大切に します。",'end2',4],["Can she take care of me? I'm messy too.","ぼくも だらしないので、 ぼくの めんどうも…",'end3',1]]},
 end1:{m:["\"Oh, good answer! Mio, don't let this one go!\" …(Call ends.) …Sorry. She's like this. But she likes you. She REALLY likes you.","「まあ、 いい 答え！ ミオ、 この人を はなしちゃ だめよ！」 …（通話 おわり） …ごめんね。 こういう 人なの。 でも あなたの こと 気に いった。 すっごく。"],ex:'laugh',p:'cheeks',end:'good'},
 end2:{m:["\"Cherish… what a lovely word.\" …(Call ends.) …Hey. You said \"cherish.\" I'm going to remember that forever.","「cherish… すてきな ことば」 …（通話 おわり） …ねえ。 「cherish」って 言ったね。 一生 わすれない。"],ex:'smile',p:'cheeks',
  nt:[["cherish","「心から 大切に する」。 結婚の 誓いにも 出てくる 大事な ことば"]],end:'good'},
 end3:{m:["\"Ha ha ha! You two are perfect!\" …Mom is crying from laughing. I think that's a yes.","「あははは！ あなたたち ぴったりね！」 …お母さん、 笑いすぎて 泣いてる。 たぶん オッケーって ことです。"],ex:'laugh',end:'fun'}}},

/* ================================================================ 💍 プロポーズ（星の 指輪 ＋ 決心の 夜） */
{id:'mpropose',st:5,c:3,ico:'💍',t:'プロポーズ',if:M=>C(M,3)&&seen(M,'partner')&&seen(M,'parents')&&window.MIOL&&MIOL.ringOk()&&W()!=='mina',pre:(go,back)=>window.WED?WED.ask('mio',go,back):go(),nodes:{
 s:{m:["You wanted to meet at the lighthouse at sunset? …Is this a new tour? Am I the customer this time?","夕日の 灯台で 待ちあわせ？ …新しい ツアー？ こんどは わたしが お客さん？"],ex:'smile',o:[
  ["Something like that.","まあ そんな ところ。",'a',2],["Remember the legend you made up?","ミオが 作った 伝説、 おぼえてる？",'legend',3]]},
 legend:{m:["\"If two people watch the light together, they'll always find their way back to each other.\" …Of course I remember.","「ふたりで 灯りを 見ると、 かならず おたがいの ところへ 帰ってこれる」 …もちろん おぼえてる。"],ex:'smile',o:[
  ["I want to come back to you for the rest of my life.","これからの 人生 ずっと、 ミオの ところに 帰りたい。",'b',4]]},
 a:{m:["You're acting strange. Your hands are shaking. Are you cold? …Why are you kneeling?","なんか へん。 手が ふるえてる。 さむい？ …なんで ひざを ついてるの？"],ex:'oops',o:[
  ["Mio, I have something important to say.","ミオ、 大事な 話が あるんだ。",'b',3],["I dropped a coin.","コイン 落とした。",'coin',0]]},
 coin:{m:["…A coin? You're kneeling in the sand with a little box in your hand, and you dropped a coin?","…コイン？ 小さい 箱を もって 砂に ひざを ついてて、 コイン？"],ex:'wink',o:[
  ["…No. I have something important to say.","…ちがう。 大事な 話が あるんだ。",'b',3]]},
 b:{m:["(You open the box. The Star Ring sparkles in the sunset.) …Oh. Oh no. I'm going to cry. Say it. Please say it in English.","（箱を あける。 星の 指輪が 夕日に きらめく） …あ。 どうしよう。 泣いちゃう。 言って。 英語で 言って。"],ex:'smile',p:'cheeks',o:[
  ["Mio, will you marry me?","ミオ、 結婚して くれますか？",'yes',5],["You make every day brighter. Will you spend the rest of your life with me?","ミオが いると 毎日が 明るい。 これからの 人生を いっしょに すごして くれますか？",'yes',5],["Want to get married or something?","結婚とか… する？",'casual',1]]},
 casual:{m:["\"Or something\"?! No, no, no. Do it again. Properly! I've been dreaming about this moment since the night market!","「とか」？！ だめ だめ。 やりなおし。 ちゃんと！ 夜市の 夜から ずっと この 瞬間を 夢みてたんだから！"],ex:'oops',
  nt:[["Will you marry me?","プロポーズは まっすぐが いちばん。 ～ or something（～とか）は あいまいに 聞こえる"]],o:[
  ["Mio, will you marry me?","ミオ、 結婚して くれますか？",'yes',4],["(Get too nervous and stand up.)","（緊張して 立ちあがって しまう）",'retry',0]]},
 retry:{m:["…Ha ha. You're so nervous. It's OK. Keep the ring safe. Ask me again when you're ready. My answer won't change.","…あはは。 すごい 緊張。 だいじょうぶ。 指輪は 大事に もってて。 じゅんびが できたら また 聞いて。 答えは 変わらないから。"],ex:'smile',end:'ok'},
 yes:{m:["Yes! Yes, yes, a thousand times yes! …Put it on me. My hands are shaking too much.","はい！ はい、 はい、 何度でも はい！ …つけて。 手が ふるえて できない。"],ex:'laugh',p:'cheeks',
  nt:[["Will you marry me?","「結婚して くれますか？」。 いちばん まっすぐな プロポーズ"],["a thousand times yes","「何度でも はい」。 うれしい ときの 大げさな 返事"]],o:[
  ["(Put the ring on her finger.)","（指に 指輪を はめる）",'end1',4],["(Put the ring on and kiss her hand.)","（指輪を はめて、 手に キスを する）",'end2',5]]},
 end1:{m:["It fits! …Look, the lighthouse is turning on. Our legend came true. We found our way back to each other.","ぴったり！ …見て、 灯台が ついた。 わたしたちの 伝説、 本当に なった。 おたがいの ところに 帰ってこれた。"],ex:'smile',p:'cheeks',end:'good',ch:4},
 end2:{m:["…That's not fair. Now I can't stop crying. I love you. I love you so much. Let's be happy together, forever.","…ずるい。 涙が とまらない。 愛してる。 すごく 愛してる。 ずっと いっしょに しあわせに なろうね。"],ex:'smile',p:'cheeks',
  nt:[["I love you.","「愛してる」。 I like you より ずっと 深い。 プロポーズの あとに やっと 言える ことば"]],end:'good',ch:4}}},

/* ================================================================ 💍 婚約 → 💒 結婚 */
{id:'prep',st:5,c:4,ico:'👗',t:'結婚の じゅんび',if:M=>CG_(M,4),nodes:{
 s:{m:["Wedding planning meeting! Agenda: one, the place. Two, the guests. Three, the cake. I already know my answer for three.","結婚式の 作戦会議！ 議題： 1、 場所。 2、 お客さん。 3、 ケーキ。 3は もう 決まってます。"],ex:'laugh',p:'pencil',o:[
  ["Let me guess. Rice ball cake?","あてようか。 おにぎりケーキ？",'cake',2],["Let's start with the place.","場所から 決めよう。",'a',2]]},
 cake:{m:["…How did you know?! A three-layer rice ball cake. With a flag on top. I'm a genius.","…なんで わかったの？！ 3だんの おにぎりケーキ。 てっぺんに 旗。 天才でしょ。"],ex:'oops',o:[
  ["A genius. Now, the place.","天才。 じゃあ 場所。",'a',2]]},
 a:{m:["The place… I want our beach. Under the stars. With everyone from the beach. Is that OK?","場所は… わたしたちの 浜辺が いい。 星の 下で。 浜辺の みんなと。 いい？"],ex:'smile',o:[
  ["It has to be the beach.","浜辺しか ないよ。",'b',3],["What about the mine? Ha ha.","鉱山は？ あはは。",'mine',1]]},
 mine:{m:["A wedding in the mine?! Guests with pickaxes! …It's a little cool, actually. No. The beach!","鉱山で 結婚式？！ お客さん みんな つるはし！ …ちょっと かっこいいかも。 いや、 浜辺！"],ex:'laugh',o:[
  ["The beach.","浜辺で。",'b',2]]},
 b:{m:["Guests: Nora-san, Riku, Marco-san, Pip, all our regular customers… and Mina-sensei. She has to come. She taught us both.","お客さん： ノラさん、 リク、 マルコさん、 ピップ、 常連さん みんな… それと ミナ先生。 ぜったい 来てほしい。 ふたりの 先生だもん。"],ex:'smile',o:[
  ["I'll ask her myself.","ぼくから 先生に たのむよ。",'c',3],["She'll give a great speech.","いい スピーチ してくれるよ。",'c',2]]},
 c:{m:["One more thing… I want to write my own vows. In English. I'm practicing every night. Don't listen through the wall!","あと ひとつ… 誓いの ことばは 自分で 書きたい。 英語で。 毎晩 練習してます。 かべごしに 聞かないでね！"],ex:'wink',
  nt:[["vows","「（結婚の）誓いの ことば」。 write your own vows（自分の ことばで 誓いを 書く）は 英語圏で 人気"]],o:[
  ["I'll write mine too.","ぼくも 書くよ。",'end1',3],["I can't wait to hear them.","聞くのが 待ちきれない。",'end2',3],["Too late. I heard \"I promise to share my snacks.\"","もう おそい。 「おやつを わけると 誓います」って 聞こえた。",'end3',1]]},
 end1:{m:["Then it's a vow battle! …No, not a battle. A vow… duet. Ha ha. I can't wait.","じゃあ 誓いの 勝負！ …ちがう、 勝負じゃ ない。 誓いの… デュエット。 あはは。 楽しみ。"],ex:'laugh',p:'thumb',end:'good'},
 end2:{m:["\"I can't wait\"… Me neither. Every night I fall asleep thinking about that day.","「待ちきれない」… わたしも。 毎晩 その 日の ことを 考えながら ねむってる。"],ex:'smile',p:'cheeks',end:'good'},
 end3:{m:["You HEARD?! …It's an important promise! Snacks are serious!","聞こえてたの？！ …大事な 約束なの！ おやつは 真剣なの！"],ex:'oops',end:'fun'}}},

{id:'mwedding',st:5,c:4,ico:'💒',t:'浜辺の 結婚式',if:M=>C(M,4)&&seen(M,'prep')&&(!window.MIOL||MIOL.wedOk()),nodes:{
 s:{m:["(The stars are falling over the beach. Everyone is here. Mio walks toward you in a white dress, with a yellow flower in her hair.) …Hi. Do I look OK?","（浜辺に 星が ふる。 みんなが 来ている。 白い ドレスに 黄色い 花を さした ミオが 歩いてくる） …やあ。 へん じゃない？"],ex:'smile',p:'cheeks',o:[
  ["You look beautiful. Absolutely beautiful.","きれいだ。 ほんとうに きれい。",'a',4],["(You're speechless.)","（言葉が 出ない）",'a',3],["Is that a rice ball in your bouquet?","ブーケに おにぎり 入ってる？",'rb',1]]},
 rb:{m:["…It's for later. Emergency rations. Don't tell anyone.","…あとで 食べるの。 非常食。 ないしょ。"],ex:'wink',o:[
  ["(Laugh, then take her hand.)","（わらって、 手を とる）",'a',2]]},
 a:{m:["(Mina-sensei steps forward as the officiant.) \"I've taught many students. But today two of my favorite students teach me something: what it means to choose each other.\"","（司会の ミナ先生が 前に 出る） 「たくさんの 生徒を 教えてきました。 でも きょうは 大好きな ふたりの 生徒が、 わたしに 教えてくれます。 おたがいを えらぶ という ことを」"],ex:'smile',o:[
  ["Thank you, Mina-sensei.","ありがとう、 ミナ先生。",'b',2]]},
 b:{m:["\"Mio, your vows, please.\" …Ahem. \"I promise to make you laugh every day, to listen to your bad jokes, and to love you more tomorrow than I do today.\"","「ミオさん、 誓いの ことばを」 …えへん。 「毎日 あなたを 笑わせて、 へんな じょうだんを 聞いて、 きょうより あしたの ほうが あなたを 愛すると 誓います」"],ex:'smile',p:'chest',
  nt:[["I promise to love you more tomorrow than I do today.","「きょうより あした もっと 愛すると 誓う」。 比較級（more ～ than）を つかった 美しい 誓い"]],o:[
  ["\"I promise to be your partner in work, in life, and in love. In every language.\"","「仕事でも、 人生でも、 恋でも あなたの パートナーで いると 誓います。 どんな 言葉ででも」",'c',5],["\"I promise to make you happy.\"","「しあわせに すると 誓います」",'c',3],["\"I promise to share my snacks.\"","「おやつを わけると 誓います」",'snack',1]]},
 snack:{m:["(Everyone laughs. Mio laughs the hardest.) \"…That was MY line!\"","（みんな 大わらい。 ミオが いちばん わらってる） 「…それ わたしの セリフ！」"],ex:'laugh',o:[
  ["\"And to love you, always.\"","「そして ずっと 愛すると」",'c',3]]},
 c:{m:["\"Do you take each other as partners for life?\"","「おたがいを 一生の パートナーとして むかえますか？」"],ex:'smile',o:[
  ["I do.","誓います。",'d',4]]},
 d:{m:["I do! …\"You may kiss the bride.\" (Mio closes her eyes. You kiss her as the stars fall.)","誓います！ …「では、 誓いの キスを」 （ミオが 目を とじる。 星が ふる 中で キスを する）"],ex:'smile',p:'cheeks',
  nt:[["I do.","結婚式の 「誓います」。 Do you take ～？ への 決まった 返事"],["You may kiss the bride.","「花嫁に キスを どうぞ」。 式の 決まり文句"]],o:[
  ["Let's go home together, my wife.","いっしょに 帰ろう、 奥さん。",'end1',4],["Thank you, everyone!","みんな、 ありがとう！",'end2',3],["Now can we eat the rice ball cake?","じゃあ おにぎりケーキ 食べていい？",'end3',1]]},
 end1:{m:["\"My wife\"… Say it again. …OK, one more time. Ha ha. Let's go home, my husband.","「奥さん」… もう一回。 …あと 一回だけ。 あはは。 帰ろう、 だんなさま。"],ex:'laugh',p:'cheeks',
  nt:[["my wife / my husband","「わたしの 妻・夫」。 結婚した ばかりの ふたりが うれしくて 何度も 言う ことば"]],end:'good',ch:5},
 end2:{m:["(Everyone cheers. Riku throws flower petals. Pip shouts \"CONGRATULATIONS!\") …Best day of my life. And tomorrow will be the best too.","（みんなの 歓声。 リクが 花びらを まく。 ピップが 「オメデトウ！」） …人生で いちばんの 日。 あしたも きっと いちばん。"],ex:'laugh',p:'peace',end:'good',ch:5},
 end3:{m:["Yes! Cake time! …Mina-sensei is laughing so hard she's crying. Our wedding is perfect.","はい！ ケーキの 時間！ …ミナ先生、 笑いすぎて 泣いてる。 かんぺきな 結婚式です。"],ex:'laugh',end:'fun',ch:5}}},

/* ================================================================ 🏠 夫婦: ふたりの 暮らし */
{id:'morning',st:5,c:5,ico:'☕',t:'ふたりの 朝',if:M=>CG_(M,5),nodes:{
 s:{m:["Good morning, sleepyhead. Coffee or tea? …Trick question. I already made both.","おはよう、 ねぼすけさん。 コーヒー？ 紅茶？ …ひっかけ問題。 もう 両方 いれた。"],ex:'wink',o:[
  ["Good morning, sunshine.","おはよう、 ぼくの お日さま。",'sun',4],["Coffee, please.","コーヒー おねがい。",'a',2],["Five more minutes…","あと 5分…",'five',1]]},
 sun:{m:["\"Sunshine\"… Every morning you find a new name for me. I need a notebook for them.","「お日さま」… 毎朝 新しい よびかたを 見つけるよね。 ノートが いるかも。"],ex:'laugh',p:'cheeks',
  nt:[["Good morning, sunshine.","「おはよう、 お日さま」。 明るい 恋人や 家族への 朝の あまい あいさつ"]],o:[
  ["You deserve all of them.","ぜんぶ ミオに ぴったりだよ。",'a',3]]},
 five:{m:["Five more minutes? OK… (She lies down next to you.) …Five minutes for me too. Shh.","あと 5分？ いいよ… （となりに ねころがる） …わたしも 5分。 しーっ。"],ex:'sleepy',p:'cheeks',o:[
  ["(Fifteen minutes later…) We're late!","（15分後…） おくれる！",'a',2]]},
 a:{m:["Today's schedule: a tour at ten, cards at noon, and dinner together. Same as every day. I love \"same as every day.\"","きょうの 予定： 10時に ツアー、 お昼は カード、 夜は いっしょに ごはん。 毎日と 同じ。 「毎日と 同じ」が 大好き。"],ex:'smile',o:[
  ["Me too. Every day with you is special.","ぼくも。 ミオとの 毎日は 特別だよ。",'end1',4],["Let's do something different tonight.","今夜は ちがう こと しよう。",'end2',3],["Can I have breakfast first?","まず 朝ごはん いい？",'end3',1]]},
 end1:{m:["…You can't say that before work. Now I'll be smiling at customers all day for no reason.","…仕事の 前に そんな こと 言わないで。 一日じゅう お客さんに ニヤニヤ しちゃう。"],ex:'smile',p:'cheeks',end:'good'},
 end2:{m:["Different? Hmm… a dinner date? Just the two of us, like before we were married? …It's a date!","ちがう こと？ うーん… ディナーデート？ 結婚する前みたいに ふたりきりで？ …決まり！"],ex:'laugh',p:'thumb',
  nt:[["It's a date!","「決まり！・約束ね！」。 デートの 約束が まとまった ときの ことば"]],end:'good'},
 end3:{m:["Breakfast is ready! Pancakes. With too much syrup. As always. Some traditions never change.","できてるよ！ パンケーキ。 シロップ かけすぎ。 いつもどおり。 変わらない 伝統です。"],ex:'laugh',end:'fun'}}},

{id:'cook',st:5,c:5,ico:'🍳',t:'ふたりの 台所',if:M=>CG_(M,5),nodes:{
 s:{m:["Let's cook dinner together! I found a recipe from my study abroad country. Soup with… eleven kinds of vegetables.","いっしょに 夕ごはん 作ろう！ 留学先の レシピ 見つけたの。 野菜 11しゅるいの… スープ。"],ex:'laugh',p:'guts',o:[
  ["I'll chop the vegetables.","野菜は ぼくが 切る。",'a',2],["Eleven? Like your eleven phone calls?","11？ あの 11回の 電話みたいに？",'eleven',2]]},
 eleven:{m:["…You remember that?! That was a long time ago! …OK, it's a little funny now.","…それ おぼえてるの？！ だいぶ 前の 話！ …まあ、 いまは ちょっと おもしろいけど。"],ex:'oops',o:[
  ["It's one of my favorite memories.","大好きな 思い出の 1つ。",'a',3]]},
 a:{m:["(Chop, chop.) Hey, you're good at this! …Wait, why are the carrots shaped like stars?","（トントン） あれ、 上手！ …まって、 なんで にんじんが 星の 形？"],ex:'smile',o:[
  ["Because you're my star.","ミオが ぼくの 星だから。",'b',3],["We live on Starfall Beach.","星降る浜辺に すんでるから。",'b',2]]},
 b:{m:["(She leans on your shoulder.) …Cooking with you is my favorite thing. Even more than cards. Don't tell the cards.","（肩に よりかかる） …あなたと 料理するのが いちばん 好き。 カードより。 カードには ないしょ。"],ex:'smile',p:'cheeks',o:[
  ["The soup is boiling over!","スープ ふいてる！",'end3',1],["I love our little kitchen.","この 小さな 台所、 大好き。",'end1',3],["Let's cook together every Sunday.","毎週 日曜は いっしょに 作ろう。",'end2',3]]},
 end1:{m:["Me too. Small kitchen, big happiness. …That sounds like a proverb. I'll write it on the fridge.","わたしも。 小さな 台所、 大きな しあわせ。 …ことわざみたい。 れいぞうこに はっとこ。"],ex:'smile',end:'good'},
 end2:{m:["Sunday Kitchen! A new tradition! I'll make a sign. In English. With no spelling mistakes this time.","日曜キッチン！ 新しい 伝統！ 看板 作るね。 英語で。 こんどは つづり まちがえないで。"],ex:'laugh',p:'thumb',end:'good'},
 end3:{m:["KYAAA! Turn it off! …Phew. The soup is OK. Eleven vegetables survived. Mostly.","きゃああ！ 火 とめて！ …ふう。 スープ 無事。 野菜 11しゅるい、 生きのこった。 だいたい。"],ex:'oops',end:'fun'}}},

{id:'rainy',st:5,c:5,ico:'☔',t:'雨の 休日',if:M=>CG_(M,5),nodes:{
 s:{m:["It's raining. Article four of our agreement: \"We close early on rainy days and drink cocoa.\" Shop closed!","雨です。 契約書の 第4条： 「雨の 日は 早く しめて ココアを 飲む」。 閉店！"],ex:'laugh',o:[
  ["Article four is the best article.","第4条は 最高の 条文だね。",'a',2],["Did I write that, or did you?","それ 書いたの ぼく？ ミオ？",'a',2]]},
 a:{m:["(Under one blanket on the sofa, with two cocoas.) …Do you remember the first rainy day? The rainbow? I made a wish.","（ソファで 1まいの 毛布に くるまって、 ココア 2つ） …さいしょの 雨の 日、 おぼえてる？ にじが 出て。 ねがいごと したの。"],ex:'smile',o:[
  ["What did you wish for?","なにを ねがったの？",'b',3],["You said it was a secret.","ひみつって 言ってたよ。",'b',2]]},
 b:{m:["I wished… that someday, I could spend a rainy day like this. With you. Under one blanket. …It came true.","ねがったのは… いつか こんな 雨の 日を すごせますように。 あなたと。 1まいの 毛布で。 …かなっちゃった。"],ex:'smile',p:'cheeks',
  nt:[["It came true.","「（ねがいが）かなった」。 come true ＝ 本当に なる"]],o:[
  ["Then I'll make all your wishes come true.","じゃあ ミオの ねがい、 ぜんぶ かなえる。",'end1',4],["My wish came true too.","ぼくの ねがいも かなったよ。",'end2',4],["Wish for more cocoa next time.","つぎは ココア 追加を ねがって。",'end3',1]]},
 end1:{m:["All of them? That's a lot of wishes. …The first one is: hold me a little tighter.","ぜんぶ？ いっぱい あるよ。 …1つめは： もう少し ぎゅっと して。"],ex:'smile',p:'cheeks',end:'good'},
 end2:{m:["What was yours? …You're not telling? Then I'll guess every day for the rest of our lives.","あなたのは？ …言わないの？ じゃあ 一生 毎日 あてっこ するね。"],ex:'wink',end:'good'},
 end3:{m:["No need to wish! I'll just make more! …Wait, I can't get up. The blanket is too warm. You go.","ねがわなくても 作る！ …まって、 立てない。 毛布が あったかすぎる。 あなたが 行って。"],ex:'laugh',end:'fun'}}},

{id:'names',st:5,c:5,ico:'🍯',t:'よびかた',if:M=>CG_(M,5),nodes:{
 s:{m:["Hey, I have a serious question. We're married now. Why do I still call you \"boss\"?","ねえ、 まじめな 質問。 わたしたち 結婚したよね。 なんで まだ 「店長」って よんでるの？"],ex:'smile',o:[
  ["Good question. What do you want to call me?","いい 質問。 なんて よびたい？",'a',2],["I like \"boss.\"","「店長」 好きだよ。",'boss',2]]},
 boss:{m:["Really? …OK, \"boss\" stays at work. But at home, I want something special. Let's practice!","ほんと？ …じゃあ 仕事では 「店長」。 でも 家では 特別なのが いい。 練習しよう！"],ex:'laugh',o:[
  ["Let's practice.","練習しよう。",'a',2]]},
 a:{m:["English has so many sweet names. \"Honey,\" \"sweetheart,\" \"darling\"… Let me try. Ahem. \"Honey, I'm home!\"","英語って あまい よびかた いっぱい ある。 「honey」 「sweetheart」 「darling」… ためしてみる。 えへん。 「ハニー、 ただいま！」"],ex:'laugh',
  nt:[["honey / sweetheart / darling","夫婦や 恋人の よびかけ。 honey と sweetheart は ふだん 使い、 darling は ちょっと 大人っぽく 上品"],["Honey, I'm home!","「ハニー、 ただいま！」。 ドラマで おなじみの 帰宅の あいさつ"]],o:[
  ["Welcome home, sweetheart.","おかえり、 スイートハート。",'b',3],["That sounds like a TV show.","テレビドラマみたい。",'b',2]]},
 b:{m:["\"Sweetheart\"… That one's dangerous. My face is hot. …Can you say my name instead? Just \"Mio.\" Slowly.","「スイートハート」… それ 危険。 顔が あつい。 …かわりに 名前で よんで？ 「ミオ」って。 ゆっくり。"],ex:'smile',p:'cheeks',o:[
  ["…Mio.","…ミオ。",'end1',4],["Darling Mio.","ダーリン・ミオ。",'end2',3],["Mio-the-rice-ball-lover.","おにぎり大好き ミオ。",'end3',1]]},
 end1:{m:["…Yeah. That's the best one. My name sounds different when you say it. Like a word only you know how to say.","…うん。 それが いちばん。 あなたが 言うと、 わたしの 名前が ちがって 聞こえる。 あなただけが 言える ことばみたい。"],ex:'smile',p:'cheeks',end:'good'},
 end2:{m:["Darling Mio! Like a movie star! …OK, use that only on special days. My heart can't take it every day.","ダーリン・ミオ！ 映画スターみたい！ …特別な 日だけ にして。 毎日は 心臓が もたない。"],ex:'laugh',end:'good'},
 end3:{m:["That's accurate! But too long! …Fine. Then I'll call you \"pickaxe-boy.\"","正確！ でも 長い！ …いいよ。 じゃあ わたしは 「つるはし くん」って よぶ。"],ex:'laugh',end:'fun'}}},

{id:'future',st:5,c:5,ico:'🌟',t:'これからの ゆめ',if:M=>CG_(M,5)&&['morning','cook','rainy','names'].every(k=>seen(M,k)),nodes:{
 s:{m:["(Sitting on the roof of the shop, looking at the stars.) Hey… what do you want to do in ten years?","（お店の 屋根に すわって 星を 見ながら） ねえ… 10年後、 なに してたい？"],ex:'smile',o:[
  ["The same thing as now. With you.","いまと 同じ こと。 ミオと。",'a',3],["Travel the world together.","いっしょに 世界を 旅したい。",'travel',3]]},
 travel:{m:["The world! I can be your guide everywhere! \"On your left… a country I've never been to!\" Ha ha.","世界！ どこでも あなたの ガイドに なれる！ 「左手に 見えますのは… 行ったことの ない 国！」 あはは。"],ex:'laugh',o:[
  ["And we always come back here.","それで いつも ここに 帰ってくる。",'a',3]]},
 a:{m:["You know… I used to think my dream was to be a guide. But now I know. My dream was to find a place where I belong. And it's here. Next to you.","あのね… 夢は ガイドに なる ことだと 思ってた。 でも いまは わかる。 わたしの 夢は、 自分の いばしょを 見つける ことだった。 それは ここ。 あなたの となり。"],ex:'smile',p:'chest',
  nt:[["a place where I belong","「自分の いばしょ」。 belong ＝ 〜に ぴったり おさまる・ぞくする"]],o:[
  ["You'll always belong here.","ミオの いばしょは ずっと ここだよ。",'end1',5],["You're my home too.","ミオも ぼくの 帰る 場所だよ。",'end2',5],["Careful, don't fall off the roof.","屋根から 落ちないでね。",'end3',1]]},
 end1:{m:["…Always? Then let's keep learning English, keep selling cards, keep growing old together. That's my new dream.","…ずっと？ じゃあ 英語を 学びつづけて、 カードを 売りつづけて、 いっしょに 年を とっていこう。 それが 新しい 夢。"],ex:'smile',p:'cheeks',
  nt:[["grow old together","「いっしょに 年を かさねる」。 結婚した ふたりの いちばん 大きな 約束"]],end:'good'},
 end2:{m:["\"Home\"… That's the most beautiful English word I know now. Welcome home. Every day.","「home」… いま 知ってる 英語で いちばん きれいな ことば。 おかえり。 毎日 ずっと。"],ex:'smile',p:'cheeks',end:'good'},
 end3:{m:["I won't! I'm a professional now! …Whoa! …OK, hold my hand. Just in case. And forever.","落ちません！ もう プロだから！ …わっ！ …手 にぎってて。 念のため。 それと ずっと。"],ex:'oops',end:'fun'}}},

/* ================================================================ 🌻 えらばれなかった ミオの その後（ミナ先生と 結婚する 道） */
{id:'letgo',top:1,st:5,ico:'🌻',t:'ミオの 決心',if:M=>M.lover&&!M.alt&&W()==='mina',nodes:{
 s:{m:["Boss… I heard the news from Nora-san. You and Mina-sensei. …Congratulations. I mean it.","店長… ノラさんから 聞きました。 店長と ミナ先生の こと。 …おめでとう。 本気で そう 思ってます。"],ex:'smile',o:[
  ["Mio… I'm sorry.","ミオ… ごめん。",'a',2],["I wanted to tell you myself.","自分から 言いたかった。",'a',3]]},
 a:{m:["Don't say sorry. You didn't do anything wrong. Hearts choose what they choose. My mom always says that.","あやまらないで。 なにも わるく ないです。 心は 心の えらぶ ほうを えらぶ。 お母さんの 口ぐせ。"],ex:'smile',
  nt:[["You didn't do anything wrong.","「あなたは なにも わるくない」。 相手を 責めない やさしい ことば"]],o:[
  ["Thank you for everything, Mio.","ぜんぶ ありがとう、 ミオ。",'b',3],["Are you OK?","だいじょうぶ？",'ok',2]]},
 ok:{m:["…Not today. But I will be. I'm Mio! I always bounce back. Like a rubber ball. Boing!","…きょうは まだ。 でも だいじょうぶに なります。 ミオですから！ いつも ふっかつ します。 ゴムまりみたいに。 ぼよーん！"],ex:'laugh',
  nt:[["bounce back","「（つらい ことから）立ちなおる」。 ボールが はねかえる イメージ"]],o:[
  ["That's very you.","ミオらしいね。",'b',3]]},
 b:{m:["So… can we stay partners? Not that kind. Shop partners. English partners. You're still my favorite boss in the world.","だから… パートナーで いられますか？ そういう 意味じゃ なくて。 お店の、 英語の パートナー。 世界で いちばんの 店長なのは 変わらないから。"],ex:'smile',p:'thumb',o:[
  ["Always.","ずっと。",'end1',3],["You're my best partner.","いちばんの なかまだよ。",'end1',3]]},
 end1:{m:["Then it's settled! From today, I'm your number one partner! …Go make Mina-sensei happy, boss. That's an order from your part-timer!","じゃあ 決まり！ きょうから いちばんの なかまです！ …ミナ先生を しあわせに してくださいね、 店長。 バイトからの 命令です！"],ex:'laugh',p:'thumb',end:'good',alt:1}}},
{id:'unsaid',top:1,st:4,ico:'🌻',t:'言わない 気持ち',if:M=>!M.lover&&!M.alt&&W()==='mina',nodes:{
 s:{m:["Boss, I heard about you and Mina-sensei. Congratulations! …I was going to tell you something, but… it's OK now.","店長、 ミナ先生との こと 聞きました。 おめでとう！ …言おうと 思ってた ことが あったけど… もう いいんです。"],ex:'smile',o:[
  ["What were you going to say?","なにを 言おうと してたの？",'a',2],["Thank you, Mio.","ありがとう、 ミオ。",'b',2]]},
 a:{m:["It's a secret. Some words are better as secrets. …Like a card you keep in the glass case. You don't sell it. You just keep it.","ひみつです。 ひみつの ままが いい ことばも ある。 …ガラスケースの カードみたいに。 売らないで、 ただ 大事に しまっておくの。"],ex:'smile',p:'cheeks',o:[
  ["I understand.","わかった。",'b',3]]},
 b:{m:["From now on, I'll be your number one partner. At the shop, in English, in the mine. Deal?","これからは いちばんの なかまです。 お店でも、 英語でも、 鉱山でも。 いい？"],ex:'laugh',p:'thumb',o:[
  ["Deal.","いいよ。",'end1',3]]},
 end1:{m:["Deal! Now, back to work, boss! Customers are waiting, and so is Mina-sensei!","決まり！ さあ 仕事に もどって、 店長！ お客さんも、 ミナ先生も 待ってますよ！"],ex:'laugh',p:'wave',end:'good',alt:1}}},
{id:'altgo',top:1,st:0,ico:'🧳',t:'ミオの 旅立ち',if:M=>!!M.alt,nodes:{
 s:{m:["Boss, I have news! I'm going to study abroad for six months. In a country with snow! I'll send you postcards!","店長、 お知らせです！ 6か月 留学します。 雪の ある 国！ 絵はがき おくりますね！"],ex:'laugh',p:'guts',o:[
  ["That's amazing! Congratulations.","すごい！ おめでとう。",'a',3],["Who will run the shop?","お店は どうするの？",'shop',1]]},
 shop:{m:["You, boss! You're the boss! …And Mina-sensei said she'll help on weekends. Ha ha!","店長が！ 店長でしょ！ …ミナ先生も 週末 手伝うって 言ってましたよ。 あはは！"],ex:'wink',o:[
  ["Ha ha. Go learn a lot.","あはは。 たくさん 学んできて。",'a',2]]},
 a:{m:["When I come back, I'll be a real guide. And I'll give the first tour to you and Mina-sensei. Together!","帰ってきたら 本物の ガイドです。 さいしょの ツアーは 店長と ミナ先生に。 ふたりいっしょに！"],ex:'smile',o:[
  ["We'll be waiting.","待ってるよ。",'end1',3],["Bring back some snow.","雪の おみやげ よろしく。",'end2',2]]},
 end1:{m:["Promise! Take care of the shop… and take care of each other!","約束！ お店を よろしく… それと、 おたがいを 大切にね！"],ex:'laugh',p:'wave',end:'good'},
 end2:{m:["Snow melts! …I'll bring two snow globes. One for each of you!","雪は とけます！ …スノードーム 2つ もってきます。 ひとつずつ！"],ex:'wink',end:'fun'}}},
{id:'altback',top:1,st:0,ico:'🛬',t:'帰ってきた ミオ',if:M=>M.alt&&seen(M,'altgo')&&window.MIOL&&MIOL.dayAfter('altgo'),nodes:{
 s:{m:["I'M BACK! Boss, I missed the shop so much! And I have a big announcement!","ただいまー！ 店長、 お店が 恋しかった！ それと 大発表が あります！"],ex:'laugh',p:'wave',o:[
  ["Welcome back! What is it?","おかえり！ なに？",'a',2]]},
 a:{m:["I graduated! And I want to work here full-time. As a guide AND a card seller. Can I be your business partner?","卒業しました！ それで、 ここで ちゃんと 働きたい。 ガイドと カード屋さん。 共同経営者に なれますか？"],ex:'smile',p:'thumb',
  nt:[["business partner","「共同経営者」。 恋人では なく、 しごとの パートナー"]],o:[
  ["Of course. Welcome, partner.","もちろん。 よろしく、 パートナー。",'end1',4],["Only if you bring snacks.","おやつ つきなら。",'end2',1]]},
 end1:{m:["Partner! Yay! …And I met lots of interesting people abroad. One of them writes me letters now. …Ha ha, that's a story for another day!","パートナー！ やった！ …それと 留学先で いろんな 人に 会いました。 その中の ひとりが いま 手紙を くれるんです。 …あはは、 その 話は また こんど！"],ex:'wink',p:'peace',end:'good'},
 end2:{m:["Snacks are always included! Partners!","おやつは いつも つきます！ パートナー！"],ex:'laugh',p:'thumb',end:'fun'}}},
{id:'altwed',top:1,st:0,ico:'💐',t:'結婚 おめでとう',if:M=>M.alt&&window.LOVE&&LOVE.rec().st>=5,nodes:{
 s:{m:["Boss! Your wedding was so beautiful! I cried from the first minute. Mina-sensei looked like a princess!","店長！ 結婚式、 すっごく きれいでした！ さいしょの 1分から 泣きました。 ミナ先生、 お姫さまみたいだった！"],ex:'laugh',o:[
  ["Thank you for coming, Mio.","来てくれて ありがとう、 ミオ。",'a',3]]},
 a:{m:["Here, a wedding gift. Two matching mugs from the shop. One says \"Teacher,\" one says \"Student.\" Ha ha!","はい、 結婚の おいわい。 おそろいの マグカップ 2つ。 ひとつは 「Teacher」、 ひとつは 「Student」。 あはは！"],ex:'wink',p:'peace',
  nt:[["Congratulations on your wedding!","「結婚 おめでとう」。 Congratulations on ～ で おいわいの ことば"]],o:[
  ["We'll use them every morning.","毎朝 使うよ。",'end1',3],["Who gets which one?","どっちが どっち？",'end2',1]]},
 end1:{m:["Yay! Then every morning, you'll think of your number one partner! …Be happy, boss. Really happy.","やった！ じゃあ 毎朝 いちばんの なかまを 思い出しますね！ …しあわせに なってね、 店長。 ほんとに。"],ex:'smile',p:'thumb',end:'good'},
 end2:{m:["That's your first married-couple homework! Ha ha!","それが 夫婦の さいしょの 宿題です！ あはは！"],ex:'laugh',end:'fun'}}}
);
})();

/* ================================================================ ✉️ 留学中の 手紙（1日 1通。 赤ペンで まちがいを なおして、 返事を えらぶ）
   s: 本文 [英語,日本語]、 bad: まちがいの ある 文の 番号、 fix: [正しい 文, まちがい1, まちがい2]、 h: ヒント、 x: 解説
   rep: 返事 2つの 段（[英語, 日本語, ♥]）、 nt: 💌 ことばメモ */
const MIO_LETTERS=[
{w:'1週め',t:'雪の 国に ついた！',ico:'❄️',
 s:[["Dear Boss,","店長へ"],["I arrived safely! It is very cold here. The snow is everywhere, like sugar on a cake.","ぶじに つきました！ こっちは すごく さむい。 雪が どこにでも あって、 ケーキの 上の さとうみたい。"],["Yesterday I go to my new school for the first time.","きのう はじめて 新しい 学校に 行きます。"],["Everyone is kind, but I miss the sea. And I miss you.","みんな やさしいけど、 海が 恋しい。 それと、 あなたに 会いたい。"],["Love, Mio","愛を こめて ミオ"]],
 bad:2,fix:["Yesterday I went to my new school for the first time.","Yesterday I goes to my new school for the first time.","Yesterday I going to my new school for the first time."],
 h:'「きのう」の 話なのに、 動詞が いまの 形の 文が あるよ',x:'yesterday（きのう）の 話は 過去形。 go の 過去形は went',
 rep:[[["I'm glad you arrived safely.","ぶじに ついて よかった。",2],["Snow like sugar? Don't eat it!","さとうみたいな 雪？ 食べちゃ だめだよ！",1],["Is it colder than our freezer?","うちの 冷凍庫より さむい？",1]],
  [["I miss you too. I'm counting the days.","ぼくも 会いたい。 指おり 待ってる。",2],["The sea misses you too.","海も ミオに 会いたがってるよ。",2],["The shop is quiet without you.","ミオが いないと お店が しずか。",1]]],
 nt:["Love, Mio","手紙の さいごの 「愛を こめて」。 恋人や 家族には Love, ～。 少し ていねいなら Best wishes, ～"]},
{w:'2週め',t:'はじめての スキー',ico:'⛷️',
 s:[["Dear Boss,","店長へ"],["Thank you for your letter! I read it ten times.","手紙 ありがとう！ 10回 読みました。"],["Today I tried skiing. I fell down twelve times. It was so fun!","きょうは スキーを やってみました。 12回 ころびました。 すごく 楽しかった！"],["My teacher said I am a very interested student.","先生に 「とても 興味ぶかい 生徒だね」と 言われました。"],["Thinking of you,","あなたを 思いながら"],["Mio","ミオ"]],
 bad:3,fix:["My teacher said I am a very interesting student.","My teacher said I am a very interest student.","My teacher said I am a very interests student."],
 h:'人が 「おもしろい」のか、 人が 「興味を もっている」のか。 -ed と -ing が あやしい',x:'人や 物が 「おもしろい」は interesting。 interested は 「（自分が）興味を もっている」',
 rep:[[["Twelve times? You're so brave.","12回？ ゆうかんだね。",2],["Only twelve? I thought more.","12回だけ？ もっと 多いと 思った。",1],["Please don't break your leg!","足を おらないでね！",1]],
  [["You're the most interesting person I know.","ぼくが 知ってる 中で いちばん おもしろい 人だよ。",2],["I'm thinking of you too.","ぼくも ミオの こと 考えてる。",2],["Send me a photo of you skiing.","スキーの 写真 おくって。",1]]],
 nt:["Thinking of you,","「あなたを 思って」。 手紙の むすびの ことば。 はなれている 人への やさしい 言い方"]},
{w:'4週め',t:'ホームシック',ico:'🌙',
 s:[["Dear Boss,","店長へ"],["This week was a little hard. I was homesick.","今週は ちょっと つらかった。 ホームシックでした。"],["At night, I looked at the stars and thought, you are looking at the same stars.","夜、 星を 見て、 あなたも 同じ 星を 見てるって 思いました。"],["I am looking forward to see you.","あなたに 会うのを 楽しみに しています。"],["But don't worry. I'm OK now. Your letters make me strong.","でも 心配しないで。 もう だいじょうぶ。 あなたの 手紙が わたしを つよく してくれる。"],["Love, Mio","愛を こめて ミオ"]],
 bad:3,fix:["I am looking forward to seeing you.","I am looking forward for see you.","I am looking forward see you."],
 h:'look forward to の あとの 動詞の 形を よく 見て',x:'look forward to の to は 前置詞。 あとに くるのは 動詞の -ing 形（seeing）',
 rep:[[["We're under the same stars. I'm always with you.","同じ 星の 下に いる。 いつも いっしょだよ。",2],["Homesick is normal. You're doing great.","ホームシックは ふつうだよ。 よく がんばってる。",2],["Eat something warm.","あったかい もの 食べてね。",1]],
  [["I can't wait to see you either.","ぼくも 会うのが 待ちきれない。",2],["I'll send you some star cards.","星の カード おくるね。",1],["I'm proud of you.","ミオを ほこりに 思うよ。",2]]],
 nt:["I can't wait to see you.","「会うのが 待ちきれない」。 I'm looking forward to seeing you. より 気持ちが あふれる 言い方"]},
{w:'6週め',t:'ガイドの 練習',ico:'🏛️',
 s:[["Dear Boss,","店長へ"],["Good news! I gave my first tour in English at the museum!","いい 知らせ！ 美術館で はじめて 英語の ツアーを しました！"],["The guests laughed at my jokes. On purpose this time!","お客さんが わたしの じょうだんで 笑いました。 こんどは わざと！"],["My teacher gave me a lot of advices.","先生から たくさんの アドバイスを もらいました。"],["I wish you were here to see it.","あなたにも 見てほしかったな。"],["Love, Mio","愛を こめて ミオ"]],
 bad:3,fix:["My teacher gave me a lot of advice.","My teacher gave me a lot of advise.","My teacher gave me a lot of an advice."],
 h:'数えられない 名詞に s が ついている 文が あるよ',x:'advice（アドバイス）は 数えられない 名詞。 s は つけない。 1つなら a piece of advice',
 rep:[[["I knew you could do it!","できるって わかってたよ！",2],["Tell me the joke!","その じょうだん 教えて！",1],["You're a real guide now.","もう 本物の ガイドだね。",2]],
  [["I wish I were there too.","ぼくも そこに いたかった。",2],["Save the first tour here for me.","ここでの さいしょの ツアーは ぼくに とっておいて。",2],["Did they give you a tip?","チップ もらった？",1]]],
 nt:["I wish you were here.","「あなたが ここに いたら いいのに」。 はなれた 恋人への 定番。 絵はがきにも よく 書く。 were を 使うのが ポイント"]},
{w:'9週め',t:'雪の 中の おまつり',ico:'🏮',
 s:[["Dear Boss,","店長へ"],["There was a snow festival this weekend! Ice sculptures were everywhere.","今週末は 雪まつり！ 氷の 彫刻が いっぱい。"],["I saw an ice sculpture of two people holding hands. It reminded me of us.","手を つないだ ふたりの 氷の 彫刻を 見ました。 わたしたちを 思い出しました。"],["I bought you a small gift. It is a secret until I come back.","小さな おみやげを 買いました。 帰るまで ひみつ。"],["It was snowed all day.","一日じゅう 雪でした。"],["XOXO, Mio","XOXO ミオ"]],
 bad:4,fix:["It snowed all day.","It snowing all day.","It was snow all day."],
 h:'天気の 文が あやしいよ。 snow は それだけで 動詞に なる',x:'「雪が ふる」は snow が 動詞。 過去は It snowed.（It was snowed は まちがい）',
 rep:[[["I want to see the ice sculpture with you someday.","いつか その 彫刻、 いっしょに 見たいな。",2],["A secret gift? I'm too curious!","ひみつの おみやげ？ 気に なる！",1],["Hold hands like the sculpture when you come back.","帰ってきたら 彫刻みたいに 手を つなごう。",2]],
  [["XOXO back to you.","ぼくからも XOXO。",2],["Don't catch a cold.","かぜ ひかないでね。",1],["Every day I miss you more.","毎日 どんどん 会いたく なる。",2]]],
 nt:["XOXO","手紙の さいごの 「ハグと キス」。 X が キス、 O が ハグ。 親しい 人への あいさつ"]},
{w:'12週め',t:'半分 すぎた',ico:'⏳',
 s:[["Dear Boss,","店長へ"],["Three months have passed. Half of my study abroad is over!","3か月 たちました。 留学の 半分が おわり！"],["I have been here since three months, but it feels like three days and three years.","ここに 来て 3か月。 3日にも 3年にも 感じます。"],["My English is better now. I can dream in English!","英語が 上手に なりました。 英語で 夢を 見られる！"],["Last night, you were in my dream. You said something in English, but I forgot it.","ゆうべの 夢に あなたが 出てきました。 英語で なにか 言ってたけど、 わすれちゃった。"],["Love, Mio","愛を こめて ミオ"]],
 bad:2,fix:["I have been here for three months, but it feels like three days and three years.","I have been here from three months, but it feels like three days and three years.","I have been here at three months, but it feels like three days and three years."],
 h:'「3か月 前から」？ それとも 「3か月 間」？ 前置詞を 見て',x:'期間（3か月 間）は for。 since は 始まった 時（since May など）に 使う',
 rep:[[["Halfway there! You're doing amazing.","もう 半分！ すごいよ。",2],["Three days and three years… I understand.","3日にも 3年にも… わかる。",2],["What did I say in the dream?","夢の 中で なんて 言ったの？",1]],
  [["I'll tell you in person when you come back.","帰ってきたら 直接 言うよ。",2],["Maybe it was \"I miss you.\"","たぶん 「会いたい」かな。",2],["Probably \"Where are my snacks?\"","たぶん 「おやつ どこ？」",1]]],
 nt:["in person","「直接・会って」。 I'll tell you in person.（会って 言うね）は 気になる 言い方で 期待させる"]},
{w:'15週め',t:'ルームメイトの 恋',ico:'💌',
 s:[["Dear Boss,","店長へ"],["My roommate has a boyfriend. She talks to him on the phone every night.","ルームメイトに かれしが います。 毎晩 電話してます。"],["She asked me, \"Do you have someone special?\" I said yes, and I smiled too much.","「とくべつな 人 いる？」って 聞かれて、 「うん」って。 ニヤけすぎました。"],["She said, \"Tell me about him!\" So I talked for two hour.","「話して！」って 言われて、 2時間 話しました。"],["Sorry, I told her about your bad jokes too.","ごめん、 あなたの へんな じょうだんの 話も しちゃった。"],["Love, Mio","愛を こめて ミオ"]],
 bad:3,fix:["She said, \"Tell me about him!\" So I talked for two hours.","She said, \"Tell me about him!\" So I talked for two hour's.","She said, \"Tell me about him!\" So I talked for two houres."],
 h:'2つ以上の ものに s が ついていない 文が ある',x:'2つ以上は 複数形。 two hours',
 rep:[[["Two hours? What did you say about me?","2時間？ ぼくの こと なんて 言ったの？",1],["I tell everyone about you too.","ぼくも みんなに ミオの こと 話してる。",2],["You're my someone special too.","ミオも ぼくの 特別な 人だよ。",2]],
  [["My jokes are famous now!","ぼくの じょうだん、 世界デビューだ！",1],["Say hi to your roommate.","ルームメイトに よろしく。",1],["Next time, call me. I want to hear your voice.","こんど 電話して。 声が 聞きたい。",2]]],
 nt:["someone special","「とくべつな 人」。 恋人の ことを やわらかく 言う 表現"]},
{w:'18週め',t:'さむい 夜',ico:'🧣',
 s:[["Dear Boss,","店長へ"],["It's minus fifteen degrees today! My eyelashes froze!","きょうは マイナス15度！ まつげが こおった！"],["I'm wearing the scarf my mom knitted. It's warm, but not as warm as your hand.","お母さんが あんだ マフラーを してます。 あったかいけど、 あなたの 手ほどじゃ ない。"],["Please take care yourself. Don't stay in the mine too late.","体に 気を つけて。 鉱山に おそくまで いないで。"],["Only two more months. I can do it!","あと 2か月。 がんばれる！"],["Love, Mio","愛を こめて ミオ"]],
 bad:3,fix:["Please take care of yourself. Don't stay in the mine too late.","Please take care to yourself. Don't stay in the mine too late.","Please take care for yourself. Don't stay in the mine too late."],
 h:'「〜を 大切に する」の 形で、 小さな ことばが 1つ たりない',x:'「体に 気を つけて」は take care of yourself。 of が いる',
 rep:[[["Your eyelashes froze?! Stay warm!","まつげが こおった？！ あったかくしてね！",1],["When you come back, I'll hold your hand all day.","帰ってきたら 一日じゅう 手を にぎってる。",2],["I'll take care of myself. Promise.","体に 気を つける。 約束。",2]],
  [["Two months. We can do it together.","あと 2か月。 ふたりで がんばろう。",2],["I'll leave the mine early. For you.","鉱山は 早く 出るよ。 ミオのために。",2],["Bring the frozen eyelashes as a souvenir.","こおった まつげ、 おみやげに。",1]]],
 nt:["not as warm as your hand","「あなたの 手ほど あたたかくない」。 not as ～ as … で 「…ほど ～ない」。 あまい くらべ方"]},
{w:'21週め',t:'もうすぐ 帰る',ico:'🎫',
 s:[["Dear Boss,","店長へ"],["I bought my ticket home! The ferry arrives on Sunday morning.","帰りの きっぷを 買いました！ フェリーは 日曜の 朝に つきます。"],["I'm so exciting that I can't sleep.","わくわくしすぎて ねむれません。"],["I practiced my first tour every night. It starts at our shop and ends at the lighthouse.","さいしょの ツアーを 毎晩 練習しました。 お店から はじまって、 灯台で おわります。"],["Will you come to the port to pick me up?","港まで むかえに 来てくれる？"],["Love, Mio","愛を こめて ミオ"]],
 bad:2,fix:["I'm so excited that I can't sleep.","I'm so excite that I can't sleep.","I'm so excitement that I can't sleep."],
 h:'自分の 気持ちを 言う 文で、 -ed と -ing が あやしい',x:'自分が 「わくわくしている」は excited。 exciting は 「（物ごとが）わくわくさせる」',
 rep:[[["Of course I'll pick you up!","もちろん むかえに 行く！",2],["I'll be the first person you see.","さいしょに ミオが 見るのは ぼくだよ。",2],["Sunday? I'll be in the mine.","日曜？ 鉱山かも。",0]],
  [["I can't sleep either.","ぼくも ねむれない。",2],["The lighthouse… I like that tour already.","灯台… その ツアー もう 好き。",2],["Don't miss the ferry!","フェリーに のりおくれないでね！",1]]],
 nt:["pick ～ up","「（車などで）むかえに 行く」。 Will you pick me up?（むかえに 来てくれる？）"]},
{w:'24週め',t:'さいごの 手紙',ico:'💌',
 s:[["Dear Boss,","店長へ"],["This is my last letter from the snow country.","これが 雪の 国からの さいごの 手紙です。"],["I kept all of your letters in a box. The box is heavy now. It is my treasure.","あなたの 手紙は ぜんぶ 箱に しまってあります。 もう 重いです。 わたしの 宝物。"],["Thank you for correcting my mistakes. Thank you for waiting to me.","まちがいを なおしてくれて ありがとう。 待っててくれて ありがとう。"],["See you on Sunday. I'll run to you.","日曜に 会おうね。 走って いくから。"],["All my love, Mio","ありったけの 愛を こめて ミオ"]],
 bad:3,fix:["Thank you for correcting my mistakes. Thank you for waiting for me.","Thank you for correcting my mistakes. Thank you for waiting at me.","Thank you for correcting my mistakes. Thank you for waiting me."],
 h:'「〜を 待つ」の 前置詞が ちがう 文が あるよ',x:'「〜を 待つ」は wait for ～。 waiting for me',
 rep:[[["I kept all of yours too.","ぼくも ミオの 手紙、 ぜんぶ とってある。",2],["Your English got so much better.","英語、 すごく 上手に なったね。",2],["Don't run on the ramp!","タラップで 走らないで！",1]],
  [["I'll be waiting with open arms.","両手を ひろげて 待ってる。",2],["See you Sunday. All my love.","日曜に。 ありったけの 愛を こめて。",2],["I'll bring rice balls.","おにぎり もっていくね。",1]]],
 nt:["All my love,","手紙の むすびで いちばん 気持ちが こもった 「ありったけの 愛を こめて」"]}];

/* ================================================================ 🍂 ミナ先生の その後（ミオと 結婚する 道を えらんだとき） */
const WED_MINA_BYE={id:'mbye',who:'mina',ico:'🍂',t:'先生の 気持ち',nodes:{
 s:{m:["…I heard. You and Mio-san. Congratulations. …Wait, let me say that again with a better face. Congratulations!","…聞いたよ。 ミオさんとの こと。 おめでとう。 …まって、 もう一回 いい顔で 言わせて。 おめでとう！"],ex:'smile',o:[
  ["Sensei… I wanted to tell you myself.","先生… 自分から 言いたかったです。",'a',3],["Thank you, Sensei.","ありがとうございます、 先生。",'a',2]]},
 a:{m:["You know, a teacher's job is to watch her students grow up and fly away. I just… didn't expect it to feel like this.","先生の しごとって、 生徒が 大きく なって とんでいくのを 見とどける ことなんだ。 ただ… こんな 気持ちに なるとは 思わなかった。"],ex:'worry',o:[
  ["I'll always be your student.","ぼくは ずっと 先生の 生徒です。",'b',3],["Thank you for everything you taught me.","教えてくれた こと ぜんぶ、 ありがとう。",'b',3]]},
 b:{m:["Then promise me two things. One: keep studying English. Two: make Mio-san laugh every day. She deserves it.","じゃあ 2つ 約束して。 1つ： 英語の 勉強を つづける こと。 2つ： ミオさんを 毎日 笑わせる こと。 あの子は それに ふさわしいから。"],ex:'smile',
  nt:[["She deserves it.","「あの子は それに ふさわしい」。 deserve ＝ 〜に あたいする。 相手の しあわせを ねがう ことば"]],o:[
  ["I promise.","約束します。",'end1',3],["Can I promise three things? Three: I'll still come to your lessons.","3つめも いい？ 授業には これからも 来ます。",'end2',4]]},
 end1:{m:["Good. …Now, open your textbook. Today's lesson is \"Congratulations on your engagement.\" Repeat after me!","よし。 …じゃあ 教科書 ひらいて。 きょうの 授業は 「Congratulations on your engagement.」 くりかえして！"],ex:'happy',end:'good',fx:'minaBye'},
 end2:{m:["…Ha ha. Of course you will. You're my favorite student. That will never change. Now, go. Your partner is waiting.","…あはは。 そりゃ 来るよね。 大好きな 生徒だもん。 それは ずっと 変わらない。 さあ、 行って。 パートナーが 待ってるよ。"],ex:'happy',end:'good',fx:'minaBye'}}};
