/* ミナ先生の ひとこと 質問（文法ドリル）の 追加ぶん。sensei-data.js の SENSEI_DRILL に 足す。
   どの 文法も 5問 いじょう あるので、「苦手 とっくん」（5問）で おなじ 問題が かさならない。
   形は sensei-data.js と おなじ：D(ミナの 英語, 日本語, [正しい 答え…], [[まちがい, 種類, (ヒント)]…], 返事(英), 返事(日))。
   返事を [[英,日]…] に すると 正しい 答えごとの 返事。 返事に 入れる {slot} は ミナの 文か 答えに ある ものだけ */
(()=>{const D=(s,j,good,bad,re,rj)=>Array.isArray(re)?{s,j,good,bad,res:re}:{s,j,good,bad,re,rj};
const ADD={
 es_be:[
  D("Are you hungry?","おなか すいてる？",["Yes, I am.","No, I'm not.","Yes, I am hungry."],[["Yes, I are.",'beI'],["Yes, I is hungry.",'beI']],[["Me too! Let's eat.","わたしも！ 食べよう"],["OK! Then let's walk first.","そっか！ じゃあ 先に 散歩しよう"],["Me too! Let's eat.","わたしも！ 食べよう"]]),
  D("I'm Mina. And you? Tell me about you.","わたしは ミナ。 あなたは？ 自分の こと 教えて",["I am a student.","I'm your student!"],[["I is a student.",'beI'],["I are a student.",'beI']],"Nice to meet you!","よろしくね！"),
  D("You are my student. Am I right?","あなたは わたしの 生徒。 合ってる？",["Yes, you are right.","Yes, I am your student."],[["Yes, you is right.",'beYou'],["Yes, I is your student.",'beI']],"Yay! Let's study together.","やった！ いっしょに 勉強しよう")],
 es_this:[
  D("*shows a {animal}* What is this?","（{animal_j}を 見せて）これは なに？",["It's a {animal}.","This is a {animal}."],[["This are a {animal}.",'thisThat'],["That are a {animal}.",'thisThat']],"Right! A cute {animal}.","正解！ かわいい {animal_j}"),
  D("Look up! What is that in the sky?","上を 見て！ 空の あれは なに？",["That is a star.","It's a star."],[["This is a star.",'thisThat'],["That are a star.",'thisThat']],"Yes! That is the first star tonight.","そう！ 今夜 さいしょの 星"),
  D("Something is far out on the sea. Ask me what it is.","海の 遠くに なにか ある。 なにか わたしに きいて",["What is that?","What's that?"],[["What is this?",'thisThat'],["What are that?",'thisThat']],"It's a big ship!","大きな 船だよ！")],
 es_like:[
  D("Do you like {animal_2}?","{animal_j}は すき？",["Yes, I do.","No, I don't.","Yes, I like {animal_2}."],[["Yes, I likes {animal_2}.",'likeS'],["Yes, I am.",'doQ']],[["Me too! They're so cute.","わたしも！ かわいいよね"],["I see. Everyone is different!","そっか。 人それぞれ だね"],["Me too! They're so cute.","わたしも！ かわいいよね"]]),
  D("What sport do you like?","どんな スポーツが すき？",["I like {sport}.","I like {sport} very much."],[["I likes {sport}.",'likeS'],["You like {sport}.",0]],"{sport}! Let's play together.","{sport_j}！ いっしょに やろう"),
  D("Ask me about {food}! Do I like it?","{food_j}が すきか、 わたしに きいて！",["Do you like {food}?"],[["You like {food}?",'doQ'],["Are you like {food}?",'doQ']],"Yes! I love {food}.","うん！ {food_j}、 大すき"),
  D("I like the sea. What do you like?","わたしは 海が すき。 あなたは？",["I like the mountains.","I like {food}."],[["I likes the mountains.",'likeS']],"Nice! Tell me more later.","いいね！ あとで もっと 聞かせて")],
 es_plural:[
  D("Look! How many {thing_2} are on the sand?","見て！ すなの 上に {thing_j}は いくつ？",["{num} {thing_2}.","I see {num} {thing_2}."],[["{num} {thing}.",'plural'],["I see {num} {thing}.",'plural']],"Let's pick them up!","ひろおう！"),
  D("How many brothers and sisters do you have?","きょうだいは 何人？",["I have two sisters.","I have one brother.","I have no brothers or sisters."],[["I have two sister.",'plural'],["I have three brother.",'plural']],"I see! Thank you.","そうなんだ！ ありがとう"),
  D("I see {num} {animal_2} over there! Say it with me.","あっちに {animal_j}が {num_j}ひき！ いっしょに 言って",["{num} {animal_2}!"],[["{num} {animal}!",'plural']],"Good! So many {animal_2}!","いいね！ {animal_j}が いっぱい")],
 es_can:[
  D("Can you cook?","料理 できる？",["Yes, I can.","No, I can't.","Yes, I can cook."],[["Yes, I can cooks.",'canTo'],["Yes, I can to cook.",'canTo']],[["Wow! Cook for me someday.","すごい！ いつか 作ってね"],["Me neither! Let's learn together.","わたしも！ いっしょに 習おう"],["Wow! Cook for me someday.","すごい！ いつか 作ってね"]]),
  D("Can you play {sport}?","{sport_j}、 できる？",["Yes, I can.","No, I can't.","Yes, I can play {sport}."],[["Yes, I can plays {sport}.",'canTo'],["Yes, I can to play {sport}.",'canTo']],[["Let's play on the beach!","浜辺で やろう！"],["It's OK. I can show you.","だいじょうぶ。 教えるよ"],["Let's play on the beach!","浜辺で やろう！"]]),
  D("Pochi can run fast. What can you do fast?","ポチは 速く 走れる。 あなたは なにが 速く できる？",["I can swim fast.","I can eat fast!"],[["I can swims fast.",'canTo'],["I can to swim fast.",'canTo']],"Ha ha, nice!","あはは、 いいね！"),
  D("Can a penguin fly?","ペンギンは 空を とべる？",["No, it can't.","No, it can't fly."],[["No, it can't flies.",'canTo'],["Yes, it can fly.",0,'ペンギンの つばさは 空を とぶ ため じゃ ないよ。 海で つかうの']],"Right! But it can swim very fast.","正解！ でも すごく 速く およげるの"),
  D("Ask me if I can swim.","わたしが およげるか きいて",["Can you swim?"],[["Can you swims?",'canTo'],["Can you to swim?",'canTo']],"Yes, I can! I swim every morning.","うん、 およげる！ 毎朝 およいでるよ"),
  D("Can you speak English?","英語、 話せる？",["Yes, I can.","Yes, a little.","Yes, I can speak English."],[["Yes, I can speaks English.",'canTo'],["Yes, I can to speak English.",'canTo']],[["Yes, you can! You're speaking now.","うん、 話せてる！ いま 話してるもん"],["A little is a great start!","少しでも すばらしい スタート！"],["Yes, you can! You're speaking now.","うん、 話せてる！ いま 話してるもん"]])],
 es_want:[
  D("It's hot! What do you want?","暑い！ なにが ほしい？",["I want shaved ice.","I want some water."],[["I wants shaved ice.",'wantS']],"Me too! Let's go to Hana's shop.","わたしも！ ハナさんの お店に 行こう"),
  D("Do you want {food}?","{food_j}、 ほしい？",["Yes, please.","No, thank you.","Yes, I want {food}."],[["Yes, I wants {food}.",'wantS']],[["Here you are!","はい、 どうぞ！"],["OK! Maybe later.","わかった！ また あとでね"],["Here you are!","はい、 どうぞ！"]]),
  D("What color do you want?","なに色が ほしい？",["I want {color}.","{color}, please."],[["I wants {color}.",'wantS']],"{color}! Nice choice.","{color_j}！ いい えらび"),
  D("What do you want for your birthday?","誕生日に なにが ほしい？",["I want a new bike.","I want a {thing}."],[["I wants a new bike.",'wantS']],"Good idea!","いいね！"),
  D("Ask me what I want.","わたしが なにを ほしいか きいて",["What do you want?"],[["What you want?",'doQ'],["What do you wants?",'wantS']],"I want a big ice cream!","大きい アイスが ほしい！")],
 es_howmany:[
  D("Ask me how many {thing_2} I have.","わたしが {thing_j}を いくつ もってるか きいて",["How many {thing_2} do you have?"],[["How many {thing} do you have?",'howMany'],["How much {thing_2} do you have?",'howMany']],"I have three!","3つ もってるよ！"),
  D("Ask me how many brothers I have.","わたしの 兄弟が 何人か きいて",["How many brothers do you have?"],[["How many brother do you have?",'howMany'],["How much brothers do you have?",'howMany']],"One! He lives in Tokyo.","1人！ 東京に 住んでるの"),
  D("Ask Hana how many cups she needs.","カップが いくつ いるか ハナさんに きいて",["How many cups do you need?"],[["How many cup do you need?",'howMany'],["How much cups do you need?",'howMany']],"Hana: Five cups, please!","ハナ：5つ おねがい！"),
  D("How many {animal_2} can you see?","{animal_j}は 何びき 見える？",["I can see {num} {animal_2}.","{num} {animal_2}."],[["I can see {num} {animal}.",'plural']],"Wow, so many!","わあ、 たくさん！"),
  D("How many days are there in a week?","1週間は 何日？",["There are seven days.","Seven days."],[["Seven day.",'plural']],"Right! Monday to Sunday.","正解！ 月曜から 日曜まで")],
 es_place:[
  D("Where is Pochi? He is under the table.","ポチは どこ？ テーブルの 下に いるよ。 — どこに いる？",["He is under the table.","Under the table."],[["He is on the table.",'place'],["He is in the table.",'place']],"Yes! He likes the shade.","そう！ 日かげが すきなの"),
  D("Where is the ball? It's in the bag.","ボールは どこ？ かばんの 中。 — どこに ある？",["It's in the bag.","In the bag."],[["It's on the bag.",'place'],["It's under the bag.",'place']],"Got it, thanks!","あった、 ありがとう！"),
  D("Where is the bird? It's on the roof!","鳥は どこ？ 屋根の 上！ — どこに いる？",["It's on the roof.","On the roof."],[["It's in the roof.",'place'],["It's under the roof.",'place']],"Look, it's singing!","見て、 歌ってる！"),
  D("Where is the crab? It's under the rock.","カニは どこ？ 岩の 下。 — どこに いる？",["It's under the rock.","Under the rock."],[["It's on the rock.",'place'],["It's in the rock.",'place']],"Shh! Don't scare it.","しーっ！ おどろかせないでね")],
 es_time:[
  D("What time do you go to bed?","何時に ねる？",["I go to bed at nine.","At ten."],[["I go to bed on nine.",'timeAt'],["I go to bed in nine.",'timeAt']],"Good! Sleep is important.","いいね！ ねるのは 大事"),
  D("When do you have {sport} practice?","{sport_j}の 練習は いつ？",["On {day}.","I have it on {day}."],[["In {day}.",'timeAt'],["At {day}.",'timeAt']],"OK! Good luck.","そっか！ がんばってね"),
  D("What time is lunch?","お昼ごはんは 何時？",["At twelve.","Lunch is at twelve."],[["On twelve.",'timeAt'],["In twelve.",'timeAt']],"Twelve! I'm hungry already.","12時！ もう おなか すいた")],
 es_heshe:[
  D("Is Gen a fisherman?","ゲンじいは りょうしさん？",["Yes, he is.","Yes, he is a fisherman."],[["Yes, he are.",'beHe'],["Yes, she is.",0]],"Right! He catches big fish.","そう！ 大きい 魚を つるの"),
  D("This is my friend, Hana. Is she nice?","友だちの ハナさん。 やさしい？",["Yes, she is nice.","Yes, she is."],[["Yes, she are nice.",'beHe'],["Yes, he is nice.",0]],"She is! She gives me extra ice.","そう！ 氷を おまけ してくれるの"),
  D("Look at Pochi. Is he happy?","ポチを 見て。 うれしそう？",["Yes, he is happy.","Yes, he is."],[["Yes, he am happy.",'beHe'],["Yes, he are happy.",'beHe']],"His tail says yes!","しっぽが そう 言ってるね！")],
 es_past:[
  D("What did you eat for breakfast?","朝ごはんは なにを 食べた？",["I ate bread.","I ate rice."],[["I eat bread this morning.",'pastGo'],["I eated bread.",'pastGo']],"Yum!","おいしそう！"),
  D("Where did you go on Sunday?","日曜日は どこに 行った？",["I went to {place}.","I went to the sea."],[["I go to {place} last Sunday.",'pastGo'],["I goed to {place}.",'pastGo']],"Nice! Was it fun?","いいね！ たのしかった？"),
  D("What did you see at the aquarium?","水族館で なにを 見た？",["I saw a dolphin.","I saw many fish."],[["I see a dolphin yesterday.",'pastGo'],["I seed a dolphin.",'pastGo']],"Dolphins are so smart!","イルカって かしこいよね！")],
 es_dream:[
  D("Sora wants to be a pilot. How about you?","ソラは パイロットに なりたいって。 あなたは？",["I want to be {job}.","I want to be a doctor."],[["I want be {job}.",'wantTo'],["I want to {job}.",'wantTo']],"Great dream!","すてきな ゆめ！"),
  D("Do you want to be a teacher?","先生に なりたい？",["Yes, I want to be a teacher.","No, I want to be {job}."],[["Yes, I want be a teacher.",'wantTo'],["Yes, I want to a teacher.",'wantTo']],[["Then we'll be friends at work!","じゃあ 仕事でも なかまだね！"],["Cool! You can do it.","かっこいい！ きっと なれるよ"]]),
  D("I wanted to be a singer when I was small. What do you want to be?","わたし 小さいころ 歌手に なりたかったの。 あなたは？",["I want to be a singer, too!","I want to be {job}."],[["I want to a singer, too!",'wantTo'],["I want be {job}.",'wantTo']],"Your dream is wonderful!","すてきな ゆめだね！"),
  D("Ask me what I want to be.","わたしが なにに なりたいか きいて",["What do you want to be?"],[["What do you want be?",'wantTo'],["What you want to be?",'doQ']],"I'm already a teacher! But maybe a writer, too.","もう 先生だよ！ でも 作家も いいな")],
 es_way:[
  D("The shop is on your left. Which way do you turn?","お店は 左がわ。 どっちに まがる？",["Turn left.","I turn left."],[["Turn right.",'way']],"Yes! Turn left.","そう！ 左に まがる"),
  D("Don't turn! What do you do?","まがらないで！ どうする？",["Go straight.","I go straight."],[["Turn right.",'way'],["Turn left.",'way']],"Good! Straight to the beach.","いいね！ まっすぐ 浜辺へ"),
  D("Tell Sora the way: go straight, then turn left.","ソラに 道を 教えて：まっすぐ 行って 左",["Go straight and turn left."],[["Go straight and turn right.",'way'],["Turn left and go straight.",'way']],"Perfect guide!","カンペキな 案内！"),
  D("The library? Turn right at the corner. Which way?","図書館？ かどを 右。 — どっち？",["Turn right at the corner.","Turn right."],[["Turn left at the corner.",'way']],"That's it!","それで OK！")],
 jh_be:[
  D("Are you and Sora in the same class?","あなたと ソラは 同じ クラス？",["Yes, we are.","No, we aren't."],[["Yes, we is.",'be3'],["Yes, we am.",'be3']],[["How fun!","たのしそう！"],["Oh, I see.","そうなんだ"]]),
  D("Is the sea cold today?","きょうの 海、 つめたい？",["Yes, it is.","No, it isn't."],[["Yes, it are.",'be3'],["Yes, it am.",'be3']],[["Brr! Let's wait.","ぶるっ！ まって おこう"],["Great! Let's swim.","やった！ およごう"]]),
  D("Where are your shoes?","くつは どこ？",["They are by the door.","They're under my bed."],[["They is by the door.",'be3'],["They am by the door.",'be3']],"OK, put them on!","じゃあ はいてね！"),
  D("Is Pochi with you?","ポチは いっしょ？",["Yes, he is.","No, he isn't."],[["Yes, he are.",'be3'],["Yes, he am.",'be3']],[["Hi, Pochi!","やあ、 ポチ！"],["Where is he? Maybe at home.","どこだろう？ 家かな"]])],
 jh_do:[
  D("Do you eat breakfast every day?","毎日 朝ごはん 食べる？",["Yes, I do.","No, I don't."],[["Yes, I am.",'doQ2'],["No, I not eat.",'doNeg']],[["Great! Breakfast is power.","えらい！ 朝ごはんは パワー"],["Try a banana! It's easy.","バナナ だけでも ためして！"]]),
  D("Does Pochi like baths?","ポチは おふろが すき？",["No, he doesn't.","Yes, he does."],[["No, he don't.",'doNeg'],["No, he isn't like.",'doNeg']],[["Right! He runs away.","そう！ にげちゃうの"],["Really? He always runs away!","ほんと？ いつも にげるのに！"]]),
  D("Ask me if I play the piano.","わたしが ピアノを ひくか きいて",["Do you play the piano?"],[["Are you play the piano?",'doQ2'],["You play the piano?",'doQ2']],"Yes, I do! A little.","うん、 ひくよ！ 少しだけ"),
  D("Tell me one food you don't eat.","食べない もの 1つ 教えて",["I don't eat natto.","I don't eat green peppers."],[["I not eat natto.",'doNeg'],["I am not eat natto.",'doNeg']],"Ha ha, that's OK.","あはは、 だいじょうぶ")],
 jh_3s:[
  D("What does Hana do?","ハナさんの お仕事は？",["She sells shaved ice.","She runs a shop."],[["She sell shaved ice.",'s3'],["She run a shop.",'s3']],"Yes! The best in town.","そう！ 町で いちばん"),
  D("Does Gen go fishing every day?","ゲンじいは 毎日 つりに 行く？",["Yes, he does.","Yes, he goes every morning."],[["Yes, he do.",'s3do'],["Yes, he go every morning.",'s3']],"He loves the sea.","海が 大すきなの"),
  D("Where does Sora live?","ソラは どこに 住んでる？",["He lives near the beach.","He lives by the sea."],[["He live near the beach.",'s3'],["He does lives near the beach.",'s3do']],"Right. Next to the shell shop.","そう。 かいがら屋の となり")],
 jh_plural:[
  D("Three men are on the boat. Say it in English.","ボートに 男の人が 3人。 英語で 言って",["There are three men.","Three men."],[["There are three mans.",'pluralX'],["There are three man.",'pluralX']],"Yes, three fishermen.","そう、 りょうしさんが 3人"),
  D("Look at the fish in the net! How many?","あみの 中の 魚、 何びき？",["There are ten fish.","Ten fish."],[["There are ten fishs.",'pluralX']],"A good catch!","大漁だね！"),
  D("What do you brush every morning?","毎朝 なにを みがく？",["I brush my teeth.","My teeth."],[["I brush my tooths.",'pluralX'],["I brush my toothes.",'pluralX']],"Good habit!","いい 習慣！"),
  D("Who is at the beach? Two women and a child.","浜辺には だれが いる？ 女の人 2人と 子ども 1人",["Two women and a child.","There are two women and a child."],[["Two womans and a child.",'pluralX'],["Two woman and a child.",'pluralX']],"Yes, a happy family!","そう、 なかよし 家族！")],
 jh_pron:[
  D("Do you know Hana?","ハナさんを 知ってる？",["Yes, I know her.","Yes, I like her."],[["Yes, I know she.",'pron'],["Yes, I know hers.",'pron']],"She is my good friend.","わたしの なかよし なの"),
  D("Whose hat is this? Is it Sora's?","この ぼうし だれの？ ソラの？",["Yes, it's his.","Yes, it's his hat."],[["Yes, it's him.",'pron'],["Yes, it's he hat.",'pron']],"I'll give it back to him.","返して おくね"),
  D("Who is your best friend? Tell me the name.","いちばんの 友だちは？ 名前を 教えて",["Her name is Yui.","His name is Ken."],[["She name is Yui.",'pron'],["He name is Ken.",'pron']],"Nice name!","すてきな 名前！"),
  D("Is this my pen?","これ わたしの ペン？",["Yes, it's yours.","Yes, it's your pen."],[["Yes, it's you.",'pron'],["Yes, it's your.",'pron']],"Oh, thank you!","あ、 ありがとう！")],
 jh_imp:[
  D("Sora is running near the pool. What do you say?","ソラが プールの そばで 走ってる。 なんて 言う？",["Don't run!","Walk, please."],[["Not run!",'imp'],["Don't running!",'imp']],"Good. It's slippery!","いいね。 すべるからね"),
  D("It's a nice day. Invite me to swim!","いい 天気。 わたしを およぎに さそって！",["Let's swim!","Let's go swimming!"],[["Let's swims!",'imp'],["Let's to swim!",'imp']],"Yes, let's!","うん、 行こう！"),
  D("Pochi is barking. Tell him to be quiet.","ポチが ほえてる。 しずかにって 言って",["Be quiet, Pochi!","Pochi, be quiet!"],[["You quiet, Pochi!",'imp'],["Are quiet, Pochi!",'imp']],"Good boy... he stopped!","いい子… とまった！"),
  D("I'm tired. Tell me to sit down.","つかれた。 すわってって 言って",["Please sit down.","Sit down, please."],[["Please sits down.",'imp'],["Please sitting down.",'imp']],"Thank you, I will.","ありがとう、 そうする")],
 jh_prog:[
  D("What is Gen doing now?","ゲンじいは いま なにしてる？",["He is fishing.","He's fishing on the rocks."],[["He fishing.",'prog'],["He is fish.",'prog']],"As always!","いつも どおり！"),
  D("Listen! Who is singing?","きいて！ だれが 歌ってる？",["Hana is singing.","The birds are singing."],[["Hana singing.",'prog'],["Hana is sing.",'prog']],"What a nice song.","すてきな 歌"),
  D("Are you eating now?","いま 食べてる？",["Yes, I am.","No, I'm not."],[["Yes, I do.",'prog'],["Yes, I eating.",'prog']],[["Enjoy!","めしあがれ！"],["OK, let's keep talking.","じゃあ 話を つづけよう"]])],
 jh_wh:[
  D("Ask me what I like.","わたしが なにが すきか きいて",["What do you like?"],[["What you like?",'wh'],["What you do like?",'wh']],"I like the sea and books!","海と 本が すき！"),
  D("Ask me why I'm happy.","わたしが なんで うれしいか きいて",["Why are you happy?"],[["Why you are happy?",'wh'],["Why do you happy?",'wh']],"Because you're here!","あなたが いるから！"),
  D("Ask Sora how he comes to school.","ソラに 学校へ どうやって 来るか きいて",["How do you come to school?"],[["How you come to school?",'wh'],["How are you come to school?",'wh']],"Sora: By bike!","ソラ：自転車！"),
  D("Ask me what time I get up.","わたしが 何時に おきるか きいて",["What time do you get up?"],[["What time you get up?",'wh']],"At five! I walk on the beach.","5時！ 浜辺を 歩くの")],
 jh_past1:[
  D("Did you study yesterday?","きのう 勉強した？",["Yes, I studied English.","Yes, I studied math."],[["Yes, I studyed English.",'past1'],["Yes, I study English yesterday.",'past1']],"Good job!","えらい！"),
  D("What did you watch last night?","きのうの 夜、 なにを 見た？",["I watched a movie.","I watched TV."],[["I watch a movie last night.",'past1'],["I watchd a movie.",'past1']],"Was it good?","おもしろかった？"),
  D("Who did you play with last Sunday?","先週の 日曜日、 だれと 遊んだ？",["I played with my friends.","I played with Sora."],[["I play with my friends last Sunday.",'past1'],["I playd with Sora.",'past1']],"Sounds fun!","たのしそう！"),
  D("What did you do after school yesterday?","きのうの 放課後は なにを した？",["I {vr_ed}.","I {vr_ed} after school."],[["I {vr_x}.",'past1'],["I {vr} after school yesterday.",'past1']],"Nice!","いいね！")],
 jh_past2:[
  D("What did you buy at the shop?","お店で なにを 買った？",["I bought a hat.","I bought some juice."],[["I buyed a hat.",'past2'],["I buy a hat yesterday.",'past2']],"Show me later!","あとで 見せて！"),
  D("Did you see the fireworks?","花火 見た？",["Yes, I saw them.","No, I didn't."],[["Yes, I seed them.",'past2'],["Yes, I did saw them.",'didPast']],[["Weren't they beautiful?","きれい だったよね？"],["Next time, let's go together!","つぎは いっしょに 行こう！"]]),
  D("What did you write in your diary?","日記に なにを 書いた？",["I wrote about the beach.","I wrote about my day."],[["I writed about the beach.",'past2'],["I write about the beach yesterday.",'past2']],"Lovely!","すてき！")],
 jh_pastprog:[
  D("What were you doing when it started to rain?","雨が ふりだした とき、 なにしてた？",["I was walking home.","I was {vi_ing}."],[["I was walk home.",'pastProg'],["I walking home.",'pastProg']],"Did you get wet?","ぬれちゃった？"),
  D("What was Sora doing at nine last night?","ゆうべ 9時、 ソラは なにしてた？",["He was sleeping.","He was playing games."],[["He was sleep.",'pastProg'],["He were sleeping.",'pastProg']],"Ha ha, maybe!","あはは、 そうかも！"),
  D("Were you sleeping when I called?","電話した とき、 ねてた？",["Yes, I was.","No, I was studying."],[["Yes, I were.",'pastProg'],["No, I was study.",'pastProg']],[["Sorry for waking you!","おこしちゃって ごめんね！"],["Wow, hard worker!","がんばりやさん！"]]),
  D("What were Pochi and Sora doing on the beach?","ポチと ソラは 浜辺で なにしてた？",["They were running.","They were playing with a ball."],[["They was running.",'pastProg'],["They were run.",'pastProg']],"They never stop!","ずっと 元気！")],
 jh_future:[
  D("What are you going to do this weekend?","今週末は なにを する 予定？",["I'm going to {vr}.","I'm going to {vi}."],[["I'm going to {vr_3}.",'goingTo'],["I going to {vi}.",'goingTo']],"Have a good weekend!","いい 週末を！"),
  D("Will you come to the festival?","お祭りに 来る？",["Yes, I will.","Of course I will!"],[["Yes, I will to come.",'will'],["Yes, I will comes.",'will']],"Yay! See you there.","やった！ 会場でね"),
  D("It's cold. What will you wear?","寒いね。 なにを 着る？",["I will wear a coat.","I'll wear a sweater."],[["I will wearing a coat.",'will'],["I will to wear a coat.",'will']],"Good idea!","いい 考え！")],
 jh_modal:[
  D("I can't open this jar. Can you help me?","この びん、 あかない。 手伝って くれる？",["Sure, I can help you.","Of course!"],[["Sure, I can helps you.",'modal'],["Sure, I can to help you.",'modal']],"Thank you!","ありがとう！"),
  D("What must we do before we swim?","およぐ 前に なにを しなくちゃ いけない？",["We must warm up.","We must stretch first."],[["We must to warm up.",'modal'],["We must warming up.",'modal']],"Yes! Safety first.","そう！ 安全 第一"),
  D("I have a cold. What should I do?","かぜ ひいちゃった。 どうしたら いい？",["You should rest.","You should go to bed early."],[["You should resting.",'modal'],["You should to rest.",'modal']],"OK, I'll rest. Thanks!","うん、 休むね。 ありがとう！"),
  D("Do I have to finish this today?","これ きょう中に おわらせなきゃ だめ？",["No, you don't have to.","Yes, you have to."],[["No, you don't must.",'modal'],["Yes, you have finish it.",'modal']],[["Phew!","ほっ！"],["OK, I'll do my best.","わかった、 がんばる"]])],
 jh_there:[
  D("Is there a shop near here?","近くに お店 ある？",["Yes, there is.","Yes, there is a shop by the station."],[["Yes, there are.",'there'],["Yes, there are a shop by the station.",'there']],"Let's go!","行ってみよう！"),
  D("How many people are there in your family?","家族は 何人？",["There are four people in my family.","There are five."],[["There is four people in my family.",'there']],"Nice family!","すてきな 家族！"),
  D("What is there in your bag?","かばんに なにが 入ってる？",["There is a book.","There are some pens."],[["There are a book.",'there'],["There is some pens.",'there']],"Ready for study!","勉強の 準備 ばっちり！"),
  D("Are there any fish in this pond?","この 池に 魚は いる？",["Yes, there are.","Yes, there are many fish."],[["Yes, there is many fish.",'there']],"Let's look closer!","よく 見て みよう！")],
 jh_inf:[
  D("Why did you come to the beach?","なんで 浜辺に 来たの？",["To see the sea.","I came to swim."],[["For see the sea.",'inf'],["I came to swimming.",'inf']],"Good reason!","いい 理由！"),
  D("What do you need to buy?","なにを 買わなきゃ いけない？",["I need to buy a notebook.","I need to buy some milk."],[["I need buy a notebook.",'inf'],["I need to bought a notebook.",'inf']],"Let's go to the shop together.","いっしょに お店に 行こう"),
  D("What do you hope to do in the future?","しょうらい なにを したい？",["I hope to travel abroad.","I hope to be a teacher."],[["I hope travel abroad.",'inf'],["I hope to traveling abroad.",'inf']],"I'm sure you will!","きっと できるよ！")],
 jh_ger:[
  D("Did you enjoy the festival?","お祭り、 たのしかった？",["Yes, I enjoyed dancing.","Yes, I enjoyed eating takoyaki."],[["Yes, I enjoyed to dance.",'ger'],["Yes, I enjoyed dance.",'ger']],"I'm glad!","よかった！"),
  D("When did you finish your homework?","宿題は いつ おわった？",["I finished doing it at eight.","I finished it at eight."],[["I finished to do it at eight.",'ger']],"Good job!","えらい！"),
  D("What do you like doing on rainy days?","雨の 日は なにを するのが すき？",["I like reading books.","I like watching movies."],[["I like read books.",'ger'],["I like watch movies.",'ger']],"Cozy!","いいね、 のんびり"),
  D("What is your hobby?","しゅみは なに？",["My hobby is {vr_ing}.","My hobby is {vi_ing}."],[["My hobby is {vr}.",'ger']],"Nice hobby!","すてきな しゅみ！"),
  D("Is swimming fun?","およぐのって たのしい？",["Yes, swimming is fun!","Swimming is my favorite."],[["Yes, swim is fun!",'ger']],"I agree!","わたしも そう 思う！")],
 jh_comp:[
  D("Which is longer, the Shinano River or the Tone River?","信濃川と 利根川、 どっちが 長い？",["The Shinano River is longer.","The Shinano River."],[["The Shinano River is more long.",'comp'],["The Shinano River is long than the Tone.",'comp']],"Right! It's the longest in Japan.","正解！ 日本で いちばん 長いの"),
  D("Who is the tallest in your family?","家族で いちばん 背が 高いのは？",["My father is the tallest.","My brother is the tallest."],[["My father is the most tall.",'sup'],["My father is the most tallest.",'sup']],"Wow!","へえ！"),
  D("Is math more difficult than English?","数学は 英語より むずかしい？",["Yes, math is more difficult.","No, English is more difficult."],[["Yes, math is difficulter.",'comp'],["Yes, math is more difficulter.",'comp']],"Both are fun if you try!","どっちも やれば たのしいよ！"),
  D("Which is faster, a car or a bike?","車と 自転車、 どっちが 速い？",["A car is faster.","A car is faster than a bike."],[["A car is more fast.",'comp'],["A car is fast than a bike.",'comp']],"Yes. But bikes are fun!","そう。 でも 自転車も たのしい！")],
 jh_passive:[
  D("Where was this shell found?","この かいがら、 どこで 見つかったの？",["It was found on the beach.","It was found by Pochi!"],[["It was find on the beach.",'passive'],["It found on the beach.",'passive']],"What a nice shell!","すてきな かいがら！"),
  D("Was this cake made by Hana?","この ケーキ、 ハナさんが 作ったの？",["Yes, it was made by Hana.","Yes, it was."],[["Yes, it was make by Hana.",'passive'],["Yes, it made by Hana.",'passive']],"She's so good at baking!","お菓子 作り じょうず！"),
  D("When was this temple built?","この お寺は いつ 建てられた？",["It was built long ago.","It was built 500 years ago."],[["It was build long ago.",'passive'],["It built long ago.",'passive']],"So old!","とっても 古い！"),
  D("Is this song loved by many people?","この 歌は たくさんの 人に 愛されてる？",["Yes, it is loved by everyone.","Yes, it's very popular."],[["Yes, it is love by everyone.",'passive'],["Yes, it loves by everyone.",'passive']],"I love it, too!","わたしも 大すき！")],
 jh_perfect:[
  D("Have you finished your homework?","宿題、 もう おわった？",["Yes, I have already finished it.","No, I haven't finished it yet."],[["Yes, I have already finish it.",'perf'],["Yes, I have finished it yesterday.",'perfTime']],[["Great! Let's play.","やった！ 遊ぼう"],["OK. Do it first!","じゃあ 先に やろう！"]]),
  D("Have you ever been to Okinawa?","沖縄に 行った ことある？",["Yes, I have been there once.","No, I have never been there."],[["Yes, I have went there.",'perf'],["No, I have never go there.",'perf']],"The sea there is so blue!","あそこの 海は とても 青いよ！"),
  D("Have you eaten lunch yet?","お昼、 もう 食べた？",["Yes, I have just eaten.","No, not yet."],[["Yes, I have just ate.",'perf'],["Yes, I have eaten an hour ago.",'perfTime']],[["Good!","よかった！"],["Let's eat together!","いっしょに 食べよう！"]])],
 jh_perfprog:[
  D("How long have you been learning English?","英語は どのくらい 習ってる？",["I've been learning it for three years.","I have been learning English since I was ten."],[["I've been learn it for three years.",'perfProg'],["I am learning it for three years.",'perfProg']],"Keep going!","その ちょうし！"),
  D("It's raining a lot! How long has it been raining?","雨 すごいね！ どのくらい ふってる？",["It has been raining since morning.","It's been raining for hours."],[["It is raining since morning.",'perfProg'],["It has been rain since morning.",'perfProg']],"Let's stay inside.","中に いよう"),
  D("Pochi looks tired. What has he been doing?","ポチ、 つかれてるね。 なにを してたの？",["He has been running all day.","He's been playing on the beach."],[["He has been run all day.",'perfProg'],["He have been running all day.",'perfProg']],"Time for a nap!","お昼ねの 時間だね！"),
  D("How long have you been waiting?","どのくらい まってた？",["I've been waiting for ten minutes.","I have been waiting since two."],[["I've been wait for ten minutes.",'perfProg'],["I wait for ten minutes.",'perfProg']],"Sorry I'm late!","おそくなって ごめん！")],
 jh_conj:[
  D("Will you go out if it's sunny tomorrow?","あした 晴れたら 出かける？",["If it's sunny, I'll go to the beach.","Yes, I'll go out if it's sunny."],[["Because it's sunny, I'll go to the beach.",'conj']],"Let's hope!","晴れると いいね！"),
  D("I like fish, but Pochi doesn't. How about your family?","わたしは 魚 すき、 でも ポチは ちがう。 あなたの 家族は？",["I like fish, but my sister doesn't.","We all like fish."],[["I like fish, because my sister doesn't.",'conj']],"Everyone is different!","人それぞれ だね！"),
  D("It was raining yesterday. What did you do?","きのう 雨 だったね。 どうした？",["It was raining, so I stayed home.","I stayed home because it was raining."],[["It was raining, because I stayed home.",'conj']],"Good choice.","いい 判断")],
 jh_rel:[
  D("What is your favorite book?","いちばん すきな 本は？",["It's a book which my friend gave me.","A book that makes me laugh."],[["It's a book who my friend gave me.",'rel']],"Sounds nice!","すてきだね！"),
  D("Do you know the woman over there?","あそこの 女の人、 知ってる？",["She is the woman who runs the ice shop.","Yes, she's the woman who makes shaved ice."],[["She is the woman which runs the ice shop.",'rel']],"Yes, that's Hana!","そう、 ハナさん！"),
  D("What is a kite?","「カイト（たこ）」って なに？",["It's a toy which flies in the sky.","A toy that flies in the wind."],[["It's a toy who flies in the sky.",'rel']],"Right! Let's fly one.","正解！ あげて みよう")],
 jh_part:[
  D("How was the soccer game?","サッカーの 試合 どうだった？",["It was exciting!","It was so exciting."],[["It was excited!",'part']],"I wish I saw it!","見たかったなあ！"),
  D("How do you feel about the trip?","旅行、 どんな 気持ち？",["I'm excited!","I'm so excited about it."],[["I'm exciting!",'part']],"Me too!","わたしも！"),
  D("Was the story interesting?","その 話、 おもしろかった？",["Yes, it was interesting.","Yes, I was interested in it."],[["Yes, I was interesting.",'part']],"I'm glad you liked it.","気に入って よかった"),
  D("The movie was long. How did you feel?","映画、 長かったね。 どうだった？",["I was bored.","I was a little bored."],[["I was boring.",'part']],"Ha ha, me too!","あはは、 わたしも！")],
 jh_indq:[
  D("Do you know who that boy is?","あの 男の子、 だれか 知ってる？",["I don't know who he is.","I know who he is. He's Sora's friend."],[["I don't know who is he.",'indq']],[["Let's say hello.","あいさつ しよう"],["Oh, nice!","へえ、 そうなんだ！"]]),
  D("Ask me if I know where the station is.","駅が どこか 知ってるか、 わたしに きいて",["Do you know where the station is?"],[["Do you know where is the station?",'indq']],"Yes! It's over there.","うん！ あっちだよ"),
  D("Do you know when the festival starts?","お祭りが いつ はじまるか 知ってる？",["I don't know when it starts.","I know when it starts. At six!"],[["I don't know when does it start.",'indq']],[["Let's check the poster.","ポスターを 見よう"],["Thanks!","ありがとう！"]])],
 jh_subj:[
  D("If you had a lot of money, what would you buy?","お金が たくさん あったら、 なにを 買う？",["If I had a lot of money, I would buy a boat.","I would buy a house by the sea."],[["If I have a lot of money, I would buy a boat.",'subj'],["If I had a lot of money, I will buy a boat.",'subj']],"Take me for a ride!","のせてね！"),
  D("If you were me, what would you do?","もし あなたが わたしなら、 どうする？",["If I were you, I would take a rest.","I would go to the beach."],[["If I am you, I would take a rest.",'subj'],["If I were you, I will take a rest.",'subj']],"Good idea!","いい 考え！"),
  D("What do you wish you could do?","できたら いいなと 思う ことは？",["I wish I could speak French.","I wish I could swim like a dolphin."],[["I wish I can speak French.",'subj']],"Me too!","わたしも！")],
 jh_svoo:[
  D("Can you show me your notebook?","ノート 見せて くれる？",["Sure, I'll show you my notebook.","Sure, here you are."],[["Sure, I'll show to you my notebook.",'svoo']],"Thanks! So neat!","ありがとう！ きれい！"),
  D("Who taught you English?","英語は だれに 教わったの？",["You taught me English!","My teacher taught me."],[["You taught English me!",'svoo']],"Aww, thank you!","わあ、 うれしい！"),
  D("What will you give your mom on Mother's Day?","母の日に お母さんに なにを あげる？",["I'll give her flowers.","I'll give my mom a card."],[["I'll give to her flowers.",'svoo'],["I'll give flowers her.",'svoo']],"She'll love it!","よろこぶよ！"),
  D("Can you send me the photo?","写真、 送って くれる？",["Sure, I'll send you the photo.","OK, I'll send it to you."],[["Sure, I'll send to you the photo.",'svoo']],"Thank you!","ありがとう！")],
 jh_prep:[
  D("When is your birthday?","誕生日は いつ？",["It's in May.","It's on May 5th."],[["It's on May.",'prep'],["It's at May.",'prep']],"Let's celebrate!","お祝い しよう！"),
  D("What time does school start?","学校は 何時に はじまる？",["It starts at eight thirty.","At eight."],[["It starts in eight thirty.",'prep'],["It starts on eight thirty.",'prep']],"Early!","早いね！"),
  D("When do you go swimming?","いつ およぎに 行く？",["In summer.","I go swimming in summer."],[["On summer.",'prep'],["At summer.",'prep']],"Best season!","いちばんの 季節！"),
  D("When is the test?","テストは いつ？",["It's on Friday.","On Friday morning."],[["It's in Friday.",'prep'],["It's at Friday.",'prep']],"Good luck!","がんばって！")],
 jh_art:[
  D("What animal do you want to see?","どんな 動物が 見たい？",["I want to see an elephant.","An owl!"],[["I want to see a elephant.",'art'],["A owl!",'art']],"Let's go to the zoo!","動物園に 行こう！"),
  D("How long did you wait?","どのくらい まった？",["About an hour.","I waited an hour."],[["About a hour.",'art']],"Sorry!","ごめんね！"),
  D("What's in your lunch box?","お弁当には なにが 入ってる？",["An egg and a rice ball.","There is an egg."],[["A egg and a rice ball.",'art']],"Yum!","おいしそう！"),
  D("What do you want to be? An artist?","なにに なりたい？ 画家？",["Yes, an artist!","I want to be an engineer."],[["Yes, a artist!",'art'],["I want to be a engineer.",'art']],"Sounds great!","すてき！"),
  D("It's raining! What do you need?","雨だ！ なにが いる？",["I need an umbrella.","An umbrella!"],[["I need a umbrella.",'art']],"Here, take mine!","わたしの つかって！")],
 hs_tense:[
  D("Had you eaten before you came?","来る 前に 食べて きた？",["Yes, I had eaten before I came.","No, I hadn't eaten yet."],[["Yes, I have eaten before I came.",'hsTense']],[["Good. Then let's start.","よし、 じゃあ はじめよう"],["Let's grab something first.","先に なにか 食べよう"]]),
  D("Why were you so tired yesterday?","きのう なんで あんなに つかれてたの？",["Because I had worked all day.","I had run ten kilometers."],[["Because I have worked all day.",'hsTense']],"You need a rest!","休まなきゃ！"),
  D("Was it your first time to see the sea?","海を 見たのは はじめて だった？",["Yes, I had never seen the sea before.","No, I had seen it many times."],[["Yes, I have never seen the sea before then.",'hsTense']],"What a moment!","すてきな しゅんかん！"),
  D("Did you find your key?","かぎ 見つかった？",["Yes. I found the key I had lost.","Yes, I found the key that I had lost."],[["Yes. I found the key I have lost.",'hsTense']],"Phew!","よかった！")],
 hs_modperf:[
  D("Sora isn't here yet. Where is he?","ソラが まだ 来ない。 どこだろう？",["He may have missed the bus.","He might have overslept."],[["He may have miss the bus.",'modPerf'],["He may missed the bus.",'modPerf']],"Let's call him.","電話 してみよう"),
  D("The road is wet. What happened?","道が ぬれてる。 なにが あった？",["It must have rained last night.","It must have rained."],[["It must rained last night.",'modPerf'],["It must have rain last night.",'modPerf']],"Good detective!","名たんてい！"),
  D("I didn't bring a jacket and now I'm cold.","上着を もってこなかったら 寒くて…",["You should have brought one.","You should have brought a jacket."],[["You should brought one.",'modPerf'],["You should have bring one.",'modPerf']],"I know. Next time!","だよね。 つぎは 気をつける！")],
 hs_passive2:[
  D("Where is your bike?","自転車は？",["It's being fixed now.","It has been stolen!"],[["It's fixing now.",'passive2'],["It has stolen!",'passive2']],[["Hope it's done soon.","早く なおると いいね"],["Oh no! Let's call the police.","たいへん！ 警察に 電話しよう"]]),
  D("Has the new bridge been finished?","新しい 橋は もう 完成した？",["Yes, it has been finished.","No, it's still being built."],[["Yes, it has finished.",'passive2'],["No, it's still building.",'passive2']],[["Let's walk on it!","わたって みよう！"],["Can't wait!","たのしみ！"]]),
  D("Can this shell be eaten?","この 貝、 食べられる？",["Yes, it can be eaten.","No, it can't be eaten."],[["Yes, it can eaten.",'passive2'],["Yes, it can be eat.",'passive2']],[["Let's ask Gen how to cook it.","ゲンじいに 料理の しかた きこう"],["OK, let's put it back.","じゃあ 海に もどそう"]]),
  D("Why is the beach so clean today?","きょうの 浜辺、 なんで こんなに きれい？",["It has been cleaned by volunteers.","It was cleaned this morning."],[["It has cleaned by volunteers.",'passive2']],"Thank you, volunteers!","ボランティアさん、 ありがとう！")],
 hs_inf2:[
  D("Why do you get up so early?","なんで そんなに 早おき？",["To walk on the beach.","In order to study before school."],[["For walking on the beach.",'inf2'],["For to walk on the beach.",'inf2']],"Good habit!","いい 習慣！"),
  D("Why are you saving money?","なんで お金を ためてるの？",["To buy a new guitar.","I'm saving money to travel."],[["For buy a new guitar.",'inf2'],["In order buying a new guitar.",'inf2']],"Good luck!","がんばって！"),
  D("Why did you go to the library?","なんで 図書館に 行ったの？",["To borrow some books.","I went there to study."],[["For borrowing some books.",'inf2'],["For to borrow some books.",'inf2']],"Nice!","いいね！"),
  D("Why do you talk slowly to Pochi?","なんで ポチには ゆっくり 話すの？",["In order to make him calm.","To help him understand."],[["For to make him calm.",'inf2']],"Ha ha, he understands a lot!","あはは、 けっこう わかってるよ！")],
 hs_ginf:[
  D("Did you remember to call your mom?","わすれずに お母さんに 電話した？",["Yes, I remembered to call her.","Oops, I forgot to call her!"],[["Yes, I remembered calling her later.",'ginf']],[["Good!","えらい！"],["Call her now!","いま して！"]]),
  D("Do you remember meeting me for the first time?","はじめて 会った ときの こと おぼえてる？",["Yes, I remember meeting you on the beach.","Of course I remember meeting you."],[["Yes, I remember to meet you on the beach.",'ginf']],"I remember, too!","わたしも おぼえてる！"),
  D("Why did you stop on the way?","なんで とちゅうで 止まったの？",["I stopped to look at the sunset.","I stopped to buy a drink."],[["I stopped looking at the sunset.",'ginf','「〜するために 止まった」なら stop to 〜。 stop 〜ing は「〜するのを やめる」']],"It was beautiful, right?","きれい だったでしょ？"),
  D("Have you stopped eating snacks at night?","夜の おやつ、 やめた？",["Yes, I stopped eating them.","Not yet. I'll try to stop."],[["Yes, I stopped to eat them.",'ginf']],[["Great job!","すごい！"],["Little by little!","少しずつね！"]])],
 hs_partc:[
  D("How did you hurt your leg?","足、 どうして けがしたの？",["Running on the rocks, I fell down.","I fell down running on the rocks."],[["Ran on the rocks, I fell down.",'partc']],"Be careful!","気をつけてね！"),
  D("What did you do after you finished your homework?","宿題が おわって なにを した？",["Having finished my homework, I went out.","Having finished it, I played games."],[["Finished my homework, I went out.",'partc']],"Smart order!","いい じゅんばん！"),
  D("How did you find out about the festival?","お祭りの こと、 どうやって 知ったの？",["Walking past the station, I saw a poster.","I saw a poster walking past the station."],[["Walked past the station, I saw a poster.",'partc']],"Nice find!","よく 見つけたね！"),
  D("What were you doing on the beach yesterday?","きのう 浜辺で なにしてた？",["I sat there, listening to the waves.","I walked along, looking for shells."],[["I sat there, listened to the waves.",'partc']],"So peaceful.","おだやか だね")],
 hs_rel2:[
  D("What do you want for dinner?","夕ごはん なにが いい？",["What I want is curry.","Curry is what I want."],[["The thing what I want is curry.",'rel2'],["Which I want is curry.",'rel2']],"Curry it is!","じゃあ カレー！"),
  D("Did you understand the lesson?","授業、 わかった？",["Yes, I understood what you said.","I didn't understand what you meant."],[["Yes, I understood which you said.",'rel2'],["Yes, I understood the thing what you said.",'rel2']],[["Great!","よかった！"],["Let me explain again.","もう一回 せつめい するね"]]),
  D("What did Gen tell you?","ゲンじいは なにを 言ってた？",["I can't tell you what he said. It's a secret!","What he said was funny."],[["I can't tell you which he said.",'rel2']],"Ha ha, OK!","あはは、 わかった！"),
  D("What is important in life?","人生で 大事な ことは？",["What matters is being kind.","What is important is to enjoy every day."],[["The thing what matters is being kind.",'rel2']],"Beautiful answer.","すてきな 答え")],
 hs_reladv:[
  D("Do you remember the day when we met?","わたしたちが 会った 日、 おぼえてる？",["Yes, I remember the day when we met.","It was the day when it rained."],[["Yes, I remember the day which we met.",'relAdv']],"Me too!","わたしも！"),
  D("Where is your favorite place?","お気に入りの 場所は？",["The beach where I found a big shell.","The park where I play with my friends."],[["The park which I play with my friends.",'relAdv']],"Sounds special.","とくべつな 場所 だね"),
  D("Tell me about your hometown.","ふるさとの こと 教えて",["It's a town where you can see Mt. Fuji.","It's a quiet town where I was born."],[["It's a town which you can see Mt. Fuji.",'relAdv']],"I'd love to visit!","行って みたい！"),
  D("When is the best time to come to the beach?","浜辺に 来るのに いちばん いい 時間は？",["Early morning, when it's quiet.","The time when the sun sets."],[["The time which the sun sets.",'relAdv']],"I agree!","わたしも そう 思う！")],
 hs_comp2:[
  D("Is it better to start early?","早く はじめた ほうが いい？",["Yes. The sooner, the better.","The earlier you start, the better."],[["Yes. Sooner, better.",'comp2'],["The earlier you start, better.",'comp2']],"Right!","そのとおり！"),
  D("Does practice help your swimming?","練習すると 水泳は うまく なる？",["The more I swim, the faster I get.","Yes, the more I practice, the better I swim."],[["More I swim, faster I get.",'comp2']],"Keep swimming!","およぎ つづけて！"),
  D("Is the sea cold in the morning?","朝の 海は つめたい？",["Yes. The earlier it is, the colder the water is.","The higher the sun gets, the warmer it gets."],[["The earlier it is, colder the water is.",'comp2']],"So let's swim at noon!","じゃあ お昼に およごう！"),
  D("Do you like reading?","読書は すき？",["Yes. The more I read, the more I enjoy it.","The more books I read, the more I learn."],[["Yes. More I read, more I enjoy it.",'comp2']],"Great!","すばらしい！")],
 hs_subj2:[
  D("You missed the bus this morning, right?","けさ バスに のりおくれたんでしょ？",["Yes. If I had got up earlier, I would have caught it.","I wish I had left earlier."],[["Yes. If I got up earlier, I would have caught it.",'subj2'],["I wish I left earlier.",'subj2']],"Next time!","つぎは だいじょうぶ！"),
  D("Did you see the shooting star last night?","ゆうべ ながれ星 見た？",["No. If I had looked up, I would have seen it.","I wish I had seen it."],[["No. If I had looked up, I will see it.",'subj2'],["I wish I saw it.",'subj2']],"It'll come again!","また 来るよ！"),
  D("What would you have done if it had rained yesterday?","きのう 雨だったら どうしてた？",["I would have stayed home.","If it had rained, I would have read a book."],[["I would stay home yesterday.",'subj2'],["If it rained, I would have read a book.",'subj2']],"Cozy plan!","のんびり プランだね！"),
  D("You forgot your umbrella and got wet!","かさを わすれて ぬれちゃったね！",["If I had brought it, I wouldn't have got wet.","I wish I had brought my umbrella."],[["If I brought it, I wouldn't have got wet.",'subj2']],"Here, use this towel.","ほら、 この タオル つかって")],
 hs_speech:[
  D("What did Hana say?","ハナさんは なんて 言ってた？",["She said she was busy.","She said that she was tired."],[["She said she is busy yesterday.",'speech'],["She said me she was busy.",'speech']],"Let's help her.","手伝って あげよう"),
  D("What did Sora ask you?","ソラに なにを きかれたの？",["He asked me where I lived.","He asked me if I liked fish."],[["He asked me where do I live.",'speech']],"Ha ha, he's curious!","あはは、 知りたがり！"),
  D("What did your mom tell you?","お母さんに なんて 言われた？",["She told me to come home early.","She told me not to swim alone."],[["She told me come home early.",'speech'],["She said me to come home early.",'speech']],"Good advice!","いい アドバイス！"),
  D("What did Gen say about the weather?","ゲンじいは 天気の こと なんて？",["He said it would rain.","He said that a storm was coming."],[["He said it will rain yesterday.",'speech']],"Let's take an umbrella.","かさを もって いこう")],
 hs_seq:[
  D("Did you think the test would be easy?","テスト、 かんたんだと 思ってた？",["Yes, I thought it would be easy.","No, I thought it would be hard."],[["Yes, I thought it will be easy.",'seq']],[["Was it?","じっさいは？"],["You did well!","よく がんばった！"]]),
  D("Did you know Pochi could swim?","ポチが およげるって 知ってた？",["No, I didn't know he could swim.","Yes, I knew he could swim."],[["No, I didn't know he can swim.",'seq']],"He's a good swimmer!","じょうず なのよ！"),
  D("I heard you were sick. Are you OK now?","かぜだって きいたよ。 もう だいじょうぶ？",["Yes. I thought I had a cold, but I'm fine.","I'm OK now. I was sure I would get better."],[["Yes. I thought I have a cold, but I'm fine.",'seq']],"I'm glad!","よかった！"),
  D("Why did you bring a jacket?","なんで 上着を もってきたの？",["I thought it would be cold.","I heard it was going to be windy."],[["I thought it is cold.",'seq'],["I thought it will be cold.",'seq']],"Smart!","かしこい！")],
 hs_emph:[
  D("Was it Hana who made this ice?","この 氷を 作ったの、 ハナさん？",["Yes, it was Hana who made it.","No, it was Gen that made it."],[["Yes, it was Hana which made it.",'emph'],["Yes, Hana was that made it.",'emph']],[["Thank you, Hana!","ハナさん ありがとう！"],["Gen? Really!?","ゲンじい？ ほんと!?"]]),
  D("What made you start English?","英語を はじめた きっかけは？",["It was a song that made me start.","It was you that made me start!"],[["It was a song made me start it that.",'emph']],"Wonderful!","すてき！"),
  D("When did you first see the sea?","はじめて 海を 見たのは いつ？",["It was when I was five that I first saw the sea.","It was last summer that I first saw it."],[["Last summer was that I first saw it.",'emph']],"What a memory!","すてきな 思い出！"),
  D("Who found the treasure map? Pochi?","宝の 地図を 見つけたのは？ ポチ？",["Yes, it was Pochi that found it.","No, it was me who found it!"],[["Yes, Pochi it was found it.",'emph']],[["Good boy, Pochi!","えらいね ポチ！"],["Wow, you did!","わあ、 あなたが！"]])],
 hs_neg:[
  D("Is Sora always late?","ソラって いつも おくれる？",["Not always. Sometimes he's early.","He isn't always late."],[["He is always not late.",'neg']],"Ha ha, true!","あはは、 たしかに！"),
  D("Are rich people always happy?","お金持ちは いつも しあわせ？",["Not always.","Rich people aren't always happy."],[["Rich people are always not happy.",'neg']],"Deep answer.","深い 答え"),
  D("Did everyone come to the party?","パーティーに みんな 来た？",["Not everyone came.","Not all of them came."],[["All of them didn't come.",'neg']],"Next time, then!","じゃあ また 今度！"),
  D("Is the sea calm every day?","海は 毎日 おだやか？",["Not every day.","The sea is not always calm."],[["The sea is always not calm.",'neg']],"Right. Check before you swim!","そう。 およぐ 前に 見てね！")],
 hs_caus:[
  D("Did Gen let you use his boat?","ゲンじいは ボートを つかわせて くれた？",["Yes, he let me use it.","No, he didn't let me use it."],[["Yes, he let me to use it.",'caus'],["Yes, he let me using it.",'caus']],[["Lucky!","ラッキー！"],["Maybe next time.","また つぎかな"]]),
  D("What makes you laugh?","なにが あなたを わらわせる？",["Pochi makes me laugh.","Funny movies make me laugh."],[["Pochi makes me to laugh.",'caus'],["Pochi makes me laughing.",'caus']],"Me too!","わたしも！"),
  D("Your hair looks nice! Where did you have it cut?","髪 いいね！ どこで 切って もらったの？",["I had it cut at the shop by the station.","I had my hair cut near my house."],[["I had it to cut at the shop by the station.",'caus']],"It looks great!","にあってる！"),
  D("Did your teacher make you write a lot?","先生に たくさん 書かされた？",["Yes, she made me write three pages.","Yes, she made us write an essay."],[["Yes, she made me to write three pages.",'caus']],"Good practice!","いい 練習！")],
 hs_5:[
  D("How do you keep your room?","部屋は どう してる？",["I keep it clean.","I always keep my room tidy."],[["I keep it cleanly.",'s5']],"Nice!","えらい！"),
  D("What do you call this dog?","この 犬、 なんて よんでる？",["We call him Pochi.","I call him Pochi."],[["We call Pochi him.",'s5']],"Hi, Pochi!","やあ、 ポチ！"),
  D("Did the news make you sad?","その ニュースで かなしく なった？",["Yes, it made me sad.","No, it made me happy."],[["Yes, it made me sadly.",'s5']],[["I'm here for you.","そばに いるよ"],["Good!","よかった！"]]),
  D("How does the music make you feel?","この 音楽、 どんな 気持ちに なる？",["It makes me sleepy.","It makes me relaxed."],[["It makes me sleepily.",'s5']],"Then let's take a nap!","じゃあ お昼ね しよう！")],
 hs_conj2:[
  D("Will you call me when you get home?","家に ついたら 電話 くれる？",["Yes, I'll call you as soon as I get home.","As soon as I get home, I'll call."],[["Yes, I'll call you unless I get home.",'conj2']],"Thanks!","ありがとう！"),
  D("Did you go out yesterday? It was raining.","きのう 出かけた？ 雨 だったけど",["Although it was raining, I went out.","Yes, although it rained."],[["Unless it was raining, I went out.",'conj2']],"You're tough!","タフだね！"),
  D("Can I swim here now?","いま ここで およいで いい？",["Not unless a lifeguard is here.","You can't swim unless the flag is green."],[["Not although a lifeguard is here.",'conj2']],"Good rule.","いい ルール"),
  D("Why are you speaking so loudly?","なんで そんなに 大きい 声？",["So that everyone can hear me.","I'm speaking loudly so that Gen can hear."],[["Although everyone can hear me.",'conj2']],"Ha ha, Gen is far away!","あはは、 ゲンじい 遠いもんね！")],
 hs_quant:[
  D("Do you have much homework today?","きょう 宿題 多い？",["No, I have only a little.","Yes, I have a lot of homework."],[["No, I have only a few.",'quant'],["Yes, I have many homeworks.",'quant']],[["Lucky you!","いいなー！"],["Do your best!","がんばって！"]]),
  D("Are there many people on the beach?","浜辺に 人 多い？",["Only a few people.","There are many people."],[["Only a little people.",'quant'],["There is much people.",'quant']],"Let's go!","行こう！"),
  D("How much time do we have?","時間は どのくらい ある？",["We have a little time.","We don't have much time."],[["We have a few time.",'quant'],["We don't have many time.",'quant']],"Let's hurry!","いそごう！")],
 hs_noun:[
  D("How do I get to the beach?","浜辺へは どう 行けば いい？",["This road will take you to the beach.","This bus takes you there."],[["This road will take to you the beach.",'noun']],"Thank you!","ありがとう！"),
  D("Why didn't you come to school yesterday?","きのう なんで 学校 休んだの？",["A bad cold kept me at home.","The heavy rain kept me home."],[["A bad cold kept me to stay at home.",'noun']],"Get well soon!","おだいじに！"),
  D("Why do you look so happy?","なんで そんなに しあわせ そう？",["Your smile makes me happy.","This beautiful view makes me happy."],[["Your smile makes me happily.",'s5']],"Aww!","わあ！"),
  D("What brought you here today?","きょうは なにが あなたを ここに つれてきた？",["The sound of the waves brought me here.","My love of the sea brought me here."],[["I brought here by the waves.",'noun']],"How poetic!","詩人 みたい！")],
 hs_ellip:[
  D("What made you happy today?","きょう うれしかった ことは？",["The news that Sora won the race.","The fact that I finished my homework!"],[["The news which Sora won the race.",'ellip']],"Great!","よかったね！"),
  D("Do you have an idea for the weekend?","週末の アイデア ある？",["I have an idea that we have a beach party.","How about the idea that we clean the beach together?"],[["I have an idea which we have a beach party.",'ellip']],"Love it!","いいね！"),
  D("Did you hear the rumor?","うわさ、 きいた？",["The rumor that a whale was seen here?","Yes, the rumor that Gen caught a huge fish."],[["The rumor which a whale was seen here?",'ellip']],"Yes! Can you believe it?","そう！ しんじられる？"),
  D("What surprised you about Japan?","日本の なにに おどろいた？",["The fact that trains are always on time.","The fact that vending machines are everywhere."],[["The fact which trains are always on time.",'ellip']],"Ha ha, true!","あはは、 ほんと！")],
};
Object.entries(ADD).forEach(([id,a])=>{(SENSEI_DRILL[id]=SENSEI_DRILL[id]||[]).push(...a)})})();
