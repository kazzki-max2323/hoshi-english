/* ミナ先生と 英語で 話す（game/sensei.js）の 場面。game/sensei-data.js の あとに 読む。
   ミナ先生が いろんな 役（お店の 人・旅行者・面接官…）に なって 英語で 話す。まちがえたら ヒント → 解説。
   - {id, lv, t:題名, d:説明, ico, g:[この 場面の 文法ノートの id], start:'a', nodes:{…}}
   - ノード: {s:ミナの 英語（配列なら どれか 1つ）, j:日本語, o:[答え…]}  / {ask:日本語の おだい, o:[…]}（こっちから 質問する 番）
            {dr:1, nx:'つぎ'}（文法チェック：この 場面か いまの レベルの 文法から 1問）/ dr:'jh_3s' で 文法を 指定
   - 答え: G(英語, 返事(英), 返事(日), つぎ, 手がかり語)＝正しい 答え（答えで 話が 分かれる）
           X(英語, まちがいの 種類（SENSEI_ERR）, ヒント)＝文法の まちがい
           M(英語, 返事(英), 返事(日), ヒント)＝意味の まちがい（ミナ先生が ツッコんで ヒント）
   - エンド: E(1=★ / 0=べつの おわり, 名前, さいごの セリフ(英), 日本語)
   - {food} {sport_j} {vi_ed} などは 毎回 ちがう ことば（SENSEI_SLOT） */
const SENSEI_SCENES=(()=>{
const G=(en,re,rj,nx,k)=>({en,ok:1,re,rj,nx,k:k||null});
const X=(en,err,h)=>({en,ok:0,err,h:h||null});
const M=(en,re,rj,h)=>({en,ok:0,re,rj,h});
const E=(good,t,s,j)=>({end:1,good,t,s,j});
return [

/* ===================== 小学生 ===================== */
{id:'es-hello',lv:'es',ico:'👋',t:'はじめまして！ 自己紹介',d:'ミナ先生と はじめての あいさつ',g:['es_be','es_like','es_abc'],start:'a',nodes:{
  a:{s:"Hello! I'm Mina. I'm your English teacher. What's your name?",j:"こんにちは！ わたしは ミナ。 英語の 先生だよ。 お名前は？",o:[
    G("I'm Yuki. Nice to meet you!","Nice to meet you, too, Yuki!","よろしくね、 ユキ！",'b',["name","nice"]),
    G("My name is Ken.","Hi, Ken! What a cool name.","やあ、 ケン！ かっこいい 名前",'b',["name","my"]),
    X("I is Yuki.",'beI'),M("I'm ten.","Ten? That's your age, not your name! Ha ha.","10？ それは 年れいだよ、 名前じゃなくて！",'What\'s your name? は 「名前は？」。 I\'m 〜 で 名前を 言おう')]},
  b:{s:"How old are you?",j:"なんさい？",o:[
    G("I'm ten years old.","Ten! A great age.","10さい！ いい 年だね",'c',["ten","old"]),
    G("I'm eleven.","Eleven! You're almost a junior high student.","11さい！ もうすぐ 中学生だね",'c',["eleven"]),
    X("I are ten years old.",'beI'),M("I'm fine, thank you.","Ha ha, I didn't ask 'How are you?'!","あはは、 「元気？」とは きいて ないよ！",'How old 〜? は 「なんさい？」。 I\'m 〜 years old. で 答えよう')]},
  c:{s:"What do you like? I like stars and coffee!",j:"なにが すき？ わたしは 星と コーヒーが すき！",o:[
    G("I like {sport}.","{sport}! Do you play it every day?","{sport_j}！ 毎日 するの？",'d',["like"]),
    G("I like {animal_2}.","{animal_2}! So cute!","{animal_j}！ かわいいよね！",'e',["like"]),
    X("I likes {food}.",'likeS'),X("i like {food}.",'caps')]},
  d:{s:"Do you play {sport} with your friends?",j:"友だちと {sport_j} するの？",o:[
    G("Yes, I do.","Wonderful! Friends make sports more fun.","すてき！ 友だちと やると もっと たのしいね",'f',["yes","do"]),
    G("No, I don't. I watch it on TV.","Watching is fun, too!","見るのも たのしいよね！",'f',["no","watch"]),
    X("Yes, I am.",'doQ')]},
  e:{s:"Do you have a pet?",j:"ペット かってる？",o:[
    G("Yes, I have a {animal}.","A {animal}! What's its name?","{animal_j}！ 名前は？",'f2',["yes","have"]),
    G("No, I don't. But I want one.","Me too! I want a cat someday.","わたしも！ いつか ねこが ほしいな",'f',["no","want"]),
    X("Yes, I do have two {animal}.",'plural')]},
  f2:{s:"Is it big or small?",j:"大きい？ 小さい？",o:[
    G("It's small and cute.","Small and cute. I want to meet it!","小さくて かわいい。 会いたいな！",'f',["small"]),
    G("It's very big!","Very big! Wow!","すごく 大きい！ わあ！",'f',["big"]),
    M("It's Monday.","Monday?! Your pet is a day of the week? Ha ha!","月曜日？！ ペットが 曜日なの？ あはは！",'big か small、 大きさで 答えよう')]},
  f:{dr:1,nx:'g'},
  g:{s:"It was nice talking with you! Are you happy today?",j:"話せて よかった！ きょうは たのしい？",o:[
    G("Yes, I am! Thank you, Mina.","You're welcome! See you again!","どういたしまして！ また ね！",'eT',["yes","thank"]),
    G("I'm sleepy...","Ha ha, then let's take a little break.","あはは、 じゃあ ちょっと きゅうけい しよう",'eS',["sleepy"]),
    X("Yes, you are happy.",'beYou','自分の ことを 言うよ。 I am …')]},
  eT:E(1,'はじめての ともだち',"Nice to meet you. From today, we're friends!","よろしくね。 きょうから ともだちだよ！"),
  eS:E(0,'おひるね 自己紹介',"Zzz... Wait, I'm sleeping too! Ha ha.","グー… あれ、 先生も ねてた！ あはは"),
}},

{id:'es-kakigori',lv:'es',ico:'🍧',t:'かき氷屋さんごっこ',d:'ミナ先生が お店の 人。ちゅうもん してみよう',g:['es_want','es_howmany','es_plural'],start:'a',nodes:{
  a:{s:"Welcome to Mina's Shaved Ice! What do you want?",j:"ミナの かき氷屋へ ようこそ！ なにに する？",o:[
    G("I want strawberry, please.","Strawberry! Good choice.","いちご！ いいね",'b',["strawberry","want"]),
    G("I want melon, please.","Melon! The green one. Nice.","メロン！ 緑の だね。 いいね",'b',["melon","want"]),
    X("I wants lemon.",'wantS'),M("I want a dog.","A dog? This is a shaved ice shop! Ha ha.","犬？ ここは かき氷屋さんだよ！ あはは",'かき氷の 味を 言おう。 I want 〜, please.')]},
  b:{s:"How many do you want?",j:"いくつ ほしい？",o:[
    G("Two, please.","Two! One for your friend?","2つ！ 友だちの 分？",'c',["two"]),
    G("One, please.","One! Here you are.","1つ！ はい どうぞ",'d',["one"]),
    M("Blue, please.","Blue is a color! I asked 'how many'.","ブルーは 色だよ！ 「いくつ？」って きいたの",'How many 〜? は 「いくつ？」。 数で 答えよう')]},
  c:{s:"Who is the other one for?",j:"もう1つは だれの？",o:[
    G("It's for my sister.","How kind! She will be happy.","やさしい！ よろこぶね",'d',["sister"]),
    G("It's for Pochi!","For Pochi? Dogs love shaved ice? Maybe!","ポチに？ 犬も かき氷 すきかな？",'dP',["pochi"]),
    X("It's for my two sister.",'plural')]},
  dP:{s:"Oh, look! Pochi is here. He's eating it! Is it OK?",j:"あっ、 ポチが 来た！ もう 食べてる！ いいの？",o:[
    G("Yes! He is happy.","Look at his tail! Wag wag!","しっぽ見て！ ぶんぶん！",'eP',["yes","happy"]),
    G("No! That's mine!","Ha ha, too late! It's in his tummy.","あはは、 もう おそい！ おなかの 中",'eP2',["no","mine"])]},
  d:{s:"Do you want a topping? We have cherries and beans.",j:"トッピングは？ さくらんぼと あずきが あるよ",o:[
    G("Cherries, please. Three cherries!","Three cherries! Very cute.","さくらんぼ 3つ！ かわいい",'e',["cherries","three"]),
    G("No, thank you.","OK! Simple is best.","OK！ シンプルが いちばん",'e',["no","thank"]),
    X("Three cherry, please.",'plural')]},
  e:{dr:1,nx:'f'},
  f:{s:"That's three hundred yen, please.",j:"300円です",o:[
    G("Here you are.","Thank you! Enjoy!","ありがとう！ めしあがれ！",'eT',["here"]),
    G("Can I pay with shells?","Shells? ...OK, just today! Ha ha.","かいがら？ …きょう だけ 特別ね！ あはは",'eS',["shells","pay"]),
    M("I'm three hundred.","You are three hundred years old?! Wow!","300さい？！ すごい！",'お金を わたす ときは Here you are.（はい どうぞ）')]},
  eT:E(1,'りっぱな お客さん',"Come again! You ordered perfectly in English.","また 来てね！ 英語で かんぺきに ちゅうもん できたよ"),
  eS:E(0,'かいがらで おかいもの',"Shell money... I'll give it to Hana. She collects shells!","かいがら代… ハナさんに あげよう。 あつめてるの！"),
  eP:E(1,'ポチ大よろこび',"Pochi says 'Woof!' That means 'thank you'!","ポチが 『ワン！』だって。 『ありがとう』の 意味だよ！"),
  eP2:E(0,'ポチに 食べられた',"I'll make you another one. Free! Don't tell Hana.","もう1つ 作るね。 ただで！ ハナさんには ないしょ"),
}},

{id:'es-zoo',lv:'es',ico:'🦁',t:'どうぶつ なんでもクイズ',d:'できる こと・できない ことを 英語で',g:['es_can','es_this'],start:'a',nodes:{
  a:{s:"Let's play an animal quiz! Can penguins fly?",j:"どうぶつクイズ しよう！ ペンギンは とべる？",o:[
    G("No, they can't. But they can swim.","Perfect! They swim very fast.","カンペキ！ すごく 速く およぐんだよ",'b',["can't","swim","no"]),
    G("No, they can't.","That's right!","正解！",'b',["no","can't"]),
    X("No, they can't flies.",'canTo'),M("Yes, they can fly to the moon.","To the moon?! That's a space penguin! Ha ha.","月まで？！ 宇宙ペンギンだね！ あはは",'ペンギンは とべないよね。 No, they can\'t.')]},
  b:{s:"Next! Can a cheetah run fast?",j:"つぎ！ チーターは 速く 走れる？",o:[
    G("Yes, it can!","Yes! It's the fastest animal on land.","そう！ 陸で いちばん 速い 動物",'c',["yes","can"]),
    X("Yes, it can runs fast.",'canTo'),X("Yes, it can to run.",'canTo')]},
  c:{s:"Your turn! Ask me a quiz.",j:"こんどは あなたが クイズを 出して！",o:[
    G("Can dolphins jump?","Yes, they can! High, high, high!","できる！ 高く 高く！",'d',["dolphins","jump","can"]),
    G("Can turtles run?","Hmm... they can walk. But run? No, they can't!","うーん… 歩けるけど、 走るのは むり！",'d',["turtles","can"]),
    X("Can dolphins swims?",'canTo'),M("Dolphins can jump?","That's not a question shape! Put 'Can' first.","それだと 質問の 形じゃないよ！",'質問は Can を さいしょに。 Can dolphins jump?')]},
  d:{s:"Look! What is this? *shows a picture of a crab*",j:"見て！ これは なに？（カニの 絵）",o:[
    G("It's a crab!","Right! It's Kanio's cousin.","そう！ カニオの いとこだよ",'e',["crab"]),
    G("This is a crab.","Yes, this is a crab. Snip snip!","そう、 カニ。 チョキチョキ！",'e',["crab"]),
    X("That are a crab.",'thisThat'),M("It's a cat.","A cat with ten legs?! Look again!","足が 10本の ねこ？！ もう一回 見て！",'絵を よく 見て。 カニは crab')]},
  e:{dr:1,nx:'f'},
  f:{s:"Last question! Can you swim?",j:"さいごの 質問！ あなたは およげる？",o:[
    G("Yes, I can!","Great! Let's swim with the dolphins someday.","すごい！ いつか イルカと およごう",'eT',["yes","can"]),
    G("No, I can't. But I want to try.","Good! I can teach you.","いいね！ 先生が 教えるよ",'eT2',["no","can't","try"]),
    G("I can swim like a penguin!","Like a penguin?! Show me!","ペンギンみたいに？！ 見せて！",'eP',["penguin"]),
    X("Yes, I can to swim.",'canTo')]},
  eT:E(1,'どうぶつ博士',"You know a lot about animals. You're an animal doctor!","どうぶつに くわしいね。 どうぶつ博士だ！"),
  eT2:E(1,'およぎの 約束',"Next summer, swimming lessons with Mina. Promise!","来年の 夏は ミナ先生の 水泳教室。 やくそく！"),
  eP:E(0,'ペンギン およぎ',"You're flapping your arms on the sand... Ha ha! Very cute penguin.","砂の 上で うでを パタパタ… あはは！ かわいい ペンギン"),
}},

{id:'es-room',lv:'es',ico:'🔍',t:'先生の なくしもの',d:'in・on・under で ばしょを つたえる',g:['es_place','es_this'],start:'a',nodes:{
  a:{s:"Oh no! I can't find my glasses. Can you help me?",j:"たいへん！ めがねが 見つからない。 手つだって くれる？",o:[
    G("Sure! I can help.","Thank you! You're kind.","ありがとう！ やさしいね",'b',["sure","help"]),
    G("Yes! Let's look together.","Yes, together!","うん、 いっしょに！",'b',["yes","together"]),
    M("No, I'm hungry.","Hungry?! Help me first, then cookies!","おなかすいた？！ さきに 手つだって、 そのあと クッキー！",'Can you help me? には Sure! や Yes! で 答えよう')]},
  b:{s:"Is it on the desk?",j:"つくえの 上に ある？",o:[
    G("No. There is a cup on the desk.","A cup... my coffee! But no glasses.","カップ… わたしの コーヒー！ でも めがねは ない",'c',["cup","no"]),
    G("No, it isn't.","Hmm. Where is it?","うーん。 どこだろう？",'c',["no"]),
    M("Yes, it's a desk.","Yes, it's a desk... but are my glasses ON it?","机だね… でも めがねは その 上に ある？",'Is it on 〜? は 「〜の 上に ある？」。 No, it isn\'t. など')]},
  c:{s:"Can you look under the bed?",j:"ベッドの 下を 見て くれる？",o:[
    G("OK! ...I see a ball under the bed.","A ball! That's Pochi's ball!","ボール！ ポチの ボールだ！",'d',["ball","under"]),
    G("There's a box under the bed.","A box? Open it!","箱？ あけてみて！",'dB',["box","under"]),
    M("I see a ball on the bed.","On the bed? I said UNDER the bed!","ベッドの 上？ 「下」って 言ったよ！",'under は 「下」、 on は 「上」')]},
  dB:{s:"What is in the box?",j:"箱の 中には なにが ある？",o:[
    G("There are many photos in the box.","Oh! My old photos! I was so young.","わあ！ 昔の 写真！ わかい わたし",'d',["photos","in"]),
    G("There's a letter in the box.","A letter... from my best friend! I miss her.","手紙… 親友からだ！ 会いたいな",'d',["letter"]),
    M("There are photos under the box.","Under the box? Open it and look inside!","箱の 下？ あけて 中を 見て！",'in は 「中」。 There are 〜 in the box.')]},
  d:{dr:1,nx:'e'},
  e:{s:"Hmm... where are my glasses?",j:"うーん… めがねは どこ？",o:[
    G("They're on your head!","On my head?! ...Oh! Ha ha ha!","頭の 上？！ …ほんとだ！ あはは！",'eT',["head","on"]),
    G("Is it in your bag?","Let me see... Yes! In my bag! Thank you!","見てみる… あった！ かばんの 中！ ありがとう！",'eB',["bag","in"]),
    G("Maybe Pochi has them.","Pochi?! ...He's wearing my glasses! Ha ha!","ポチ？！ …ポチが かけてる！ あはは！",'eP',["pochi"]),
    X("They're under your head!",'place','頭の「上」は どれかな？')]},
  eT:E(1,'めがねは 頭の 上',"Thank you, detective! The glasses were on my head all the time.","ありがとう、 名探偵！ ずっと 頭の 上に あったなんて"),
  eB:E(1,'かばんの 中に あった',"Found them in my bag. Your English helped me!","かばんの 中で 見つかった。 あなたの 英語の おかげ！"),
  eP:E(0,'ポチ先生',"Pochi looks so smart with glasses. Maybe he's a teacher now!","めがねの ポチ、 かしこそう。 ポチ先生の たんじょう！"),
}},

{id:'es-friend',lv:'es',ico:'🧑‍🤝‍🧑',t:'友だちを しょうかい',d:'He is / She is で 人を しょうかい',g:['es_heshe','es_can','es_like'],start:'a',nodes:{
  a:{s:"Who is your best friend? Tell me about your friend!",j:"いちばんの 友だちは だれ？ しょうかいして！",o:[
    G("This is Sora. He is my best friend.","Sora! He is very funny.","ソラ！ おもしろい 子だよね",'b',["sora","he"]),
    G("This is Hana. She is my friend.","Hana! She is very kind.","ハナさん！ やさしいよね",'c',["hana","she"]),
    X("This is Sora. He are my friend.",'beHe'),X("This is Hana. She am my friend.",'beHe')]},
  b:{s:"What can Sora do?",j:"ソラは なにが できる？",o:[
    G("He can swim fast.","Yes! He swims like a fish.","そう！ 魚みたいに およぐよね",'d',["swim"]),
    G("He can make sand castles.","Yes! His castles are amazing.","そう！ お城が すごいの",'d',["castle","sand"]),
    X("He can swims fast.",'canTo'),M("She can swim fast.","She? Sora is a boy! Use 'he'.","She？ ソラは 男の子だよ！",'男の子は he、 女の子は she')]},
  c:{s:"What can Hana do?",j:"ハナさんは なにが できる？",o:[
    G("She can cook very well.","Yes! Her shaved ice is the best.","そう！ かき氷が 最高",'d',["cook"]),
    G("She can sing.","Really? I want to hear her song!","ほんと？ 歌 ききたい！",'d',["sing"]),
    X("She can to cook.",'canTo'),M("He can cook.","He? Hana is a woman. Use 'she'.","He？ ハナさんは 女の人だよ",'女の人は she、 男の人は he')]},
  d:{dr:'es_heshe',nx:'e'},
  e:{s:"Is your friend tall or short?",j:"友だちは せが 高い？ ひくい？",o:[
    G("My friend is tall.","Tall! Taller than me?","高い！ わたしより？",'f',["tall"]),
    G("My friend is short. But very strong!","Short and strong! Cool.","小さいけど 強い！ かっこいい",'f',["short","strong"]),
    X("My friend are tall.",'beHe')]},
  f:{s:"Can I meet your friend someday?",j:"いつか 友だちに 会える？",o:[
    G("Sure! Let's play together.","Yay! Let's play on the beach.","やった！ 浜辺で あそぼう",'eT',["sure","play"]),
    G("Yes! My friend likes you, Mina.","Really? I'm so happy!","ほんと？ うれしい！",'eL',["likes","yes"]),
    M("No. My friend is a ghost.","A ghost?! ...I'm scared! Ha ha.","おばけ？！ …こわい！ あはは",'Can I 〜? には Sure! / Yes! で')]},
  eT:E(1,'みんなで あそぼう',"Next Sunday, beach volleyball with your friend!","今度の 日曜は 友だちと ビーチバレー！"),
  eL:E(1,'先生 大人気',"Tell your friend: 'Mina says thank you!'","友だちに つたえて。 『ミナが ありがとうって』"),
}},

{id:'es-summer',lv:'es',ico:'🌻',t:'夏休みの 思い出',d:'すぎた ことを 言う（went / ate / saw）',g:['es_past','es_like'],start:'a',nodes:{
  a:{s:"How was your summer vacation?",j:"夏休み どうだった？",o:[
    G("It was great!","Great! Tell me more.","いいね！ もっと 教えて",'b',["great"]),
    G("It was fun, but too hot.","Ha ha, yes. It was so hot!","あはは、 ほんと 暑かった！",'b',["fun","hot"]),
    M("It is winter.","Winter? Now? Look outside... it's sunny! Ha ha.","冬？ いま？ 外を 見て… はれてるよ！",'How was 〜? は 「どうだった？」。 It was 〜. で')]},
  b:{s:"Where did you go?",j:"どこへ 行った？",o:[
    G("I went to the sea.","The sea! Did you swim?","海！ およいだ？",'c',["sea","went"]),
    G("I went to my grandma's house.","Your grandma's! Was she happy?","おばあちゃんの 家！ よろこんでた？",'d',["grandma","went"]),
    X("I go to the sea.",'pastGo'),X("I goed to the sea.",'pastGo')]},
  c:{s:"Did you swim in the sea?",j:"海で およいだ？",o:[
    G("Yes! I swam every day.","Every day! You're a fish now.","毎日！ もう 魚だね",'e',["swam","yes"]),
    G("No. I made a sand castle.","A sand castle! Big?","すなの お城！ 大きい？",'e',["castle","made"]),
    X("Yes! I swim every day yesterday.",'pastGo')]},
  d:{s:"What did you eat at your grandma's house?",j:"おばあちゃんの 家で なにを 食べた？",o:[
    G("I ate watermelon.","Watermelon in summer is the best!","夏の すいかは 最高！",'e',["ate","watermelon"]),
    G("I ate {food}.","Yum! Your grandma is a good cook.","おいしそう！ おばあちゃん 料理じょうず",'e',["ate"]),
    X("I eated {food}.",'pastGo')]},
  e:{dr:'es_past',nx:'f'},
  f:{s:"I saw fireworks this summer. Did you see fireworks?",j:"先生は 夏に 花火を 見たよ。 あなたは？",o:[
    G("Yes, I saw fireworks!","Beautiful, right? Boom! Boom!","きれいだよね！ ドーン！",'eT',["saw","yes"]),
    G("No, I didn't. I was sleeping.","Oh no! Next year, stay awake!","あらら！ 来年は おきてようね！",'eS',["no","sleeping"]),
    X("Yes, I see fireworks yesterday.",'pastGo')]},
  eT:E(1,'さいこうの 夏',"Your summer sounds wonderful. Thank you for telling me!","すてきな 夏だね。 話してくれて ありがとう！"),
  eS:E(0,'ねむい 夏',"Fireworks are loud... and you slept! You're a great sleeper.","花火 うるさいのに ねてたの！ ねる 天才だね"),
}},

{id:'es-dream',lv:'es',ico:'🌈',t:'しょうらいの ゆめ',d:'I want to be 〜 で ゆめを 話す',g:['es_dream','es_want','es_can'],start:'a',nodes:{
  a:{s:"What do you want to be in the future?",j:"しょうらい なにに なりたい？",o:[
    G("I want to be {job}.","{job}! That's a wonderful dream.","{job_j}！ すてきな ゆめ",'b',["want","be"]),
    G("I want to be a teacher like you!","Like me?! I'm so happy!","わたしみたいな 先生？！ うれしい！",'c',["teacher"]),
    X("I want be {job}.",'wantTo'),X("I want to {job}.",'wantTo')]},
  b:{s:"Why do you want to be {job}?",j:"どうして {job_j}に なりたいの？",o:[
    G("Because it's cool.","Yes, it's very cool!","うん、 かっこいい！",'d',["cool"]),
    G("I want to help people.","You have a kind heart.","やさしい 心を もってるね",'d',["help"]),
    M("I'm {job}.","You already are?! Wow, so young! Ha ha.","もう なってるの？！ わかいのに！",'Why 〜? は 「どうして？」。 理由を 言おう')]},
  c:{s:"What subject do you want to teach?",j:"なにを 教えたい？",o:[
    G("I want to teach English.","English! Then let's study together.","英語！ じゃあ いっしょに 勉強しよう",'d',["english"]),
    G("I want to teach P.E.","P.E.! You must be good at sports.","体育！ スポーツが とくいなんだね",'d',["p.e.","sports"]),
    X("I want teach English.",'wantTo','want の あとに うごきを つづける ときは？')]},
  d:{dr:1,nx:'e'},
  e:{s:"What do you want to do this weekend?",j:"今週末は なにが したい？",o:[
    G("I want to go to the beach.","Me too! See you there!","わたしも！ 浜辺で 会おう！",'eT',["beach"]),
    G("I want to eat {food}.","Yum! Good plan.","おいしそう！ いい 計画",'eF',["eat"]),
    X("I want go to the beach.",'wantTo','want の あとに to')]},
  eT:E(1,'ゆめに 一歩',"Dreams come true little by little. I'll cheer for you!","ゆめは 少しずつ かなうよ。 ずっと おうえん してる！"),
  eF:E(0,'食べるのが ゆめ',"Your dream is big, and your lunch is bigger! Ha ha.","ゆめも 大きいけど、 お昼ごはんは もっと 大きい！"),
}},

{id:'es-town',lv:'es',ico:'🗺️',t:'浜辺の 町で みちあんない',d:'まがる・まっすぐ・時こく',g:['es_way','es_time'],start:'a',nodes:{
  a:{s:"Excuse me. I'm a tourist. Where is the station?",j:"すみません。 旅行者です。 駅は どこですか？（先生は 旅行者の 役）",o:[
    G("Go straight and turn right.","Go straight, turn right. Thank you!","まっすぐ 行って 右。 ありがとう！",'b',["straight","right"]),
    G("Turn left at the shop.","Left at the shop. OK!","お店で 左。 OK！",'b',["left","shop"]),
    M("I'm a station.","You are a station?! Choo choo! Ha ha.","あなたが 駅？！ シュッシュッ！",'みちあんないの ことば：go straight / turn right / turn left')]},
  b:{s:"Is it far?",j:"遠いですか？",o:[
    G("No, it's near. Five minutes.","Five minutes! Great.","5分！ よかった",'c',["near","five"]),
    G("Yes, it's far. Take a bus.","OK, I'll take a bus.","バスに のります",'c2',["far","bus"]),
    M("Yes, it's delicious.","Delicious?! You can eat the station? Ha ha.","おいしい？！ 駅を 食べるの？",'far（遠い） / near（近い） で 答えよう')]},
  c2:{s:"What time is the next bus?",j:"つぎの バスは 何時？",o:[
    G("It's at three o'clock.","Three o'clock. Thank you!","3時。 ありがとう！",'c',["three"]),
    G("At two thirty.","Two thirty. I have time for ice cream!","2時半。 アイス 食べる 時間が ある！",'c',["two"]),
    X("It's on three o'clock.",'timeAt')]},
  c:{s:"What time is it now?",j:"いま 何時ですか？",o:[
    G("It's {hnow}.","Thank you! I'm not late.","ありがとう！ まにあう",'d',["it's"]),
    G("Sorry, I don't know.","That's OK. I'll check my phone.","だいじょうぶ。 スマホ 見るね",'d',["sorry"]),
    M("It's Sunday.","Sunday is a day! I asked the time.","日曜日は 曜日だよ！ 時間を きいたの",'What time 〜? は 時こく。 It\'s 〜 o\'clock.')]},
  d:{dr:1,nx:'e'},
  e:{s:"Thank you so much! Is there a good shop near the station?",j:"ほんとに ありがとう！ 駅の 近くに いい お店は ある？",o:[
    G("Yes! Hana's shaved ice shop.","Shaved ice! I'll go there.","かき氷！ 行ってみる",'eT',["hana","shaved"]),
    G("Gen's fish shop is good.","Fish! I love fish.","魚！ 大すき",'eG',["gen","fish"]),
    M("Yes! It's a station.","Ha ha, I know! I asked about a shop.","駅は わかったよ！ お店を きいたの",'お店の 名前を 言おう。 Yes! 〜\'s shop.')]},
  eT:E(1,'町の 案内人',"You are a great guide. Welcome to our town, right?","すばらしい 案内人だね。 わたしたちの 町へ ようこそ、 だね"),
  eG:E(0,'魚くさい 旅行者',"I bought a big fish... but I can't take it on the train! Ha ha.","大きい 魚を 買った… でも 電車に のせられない！ あはは"),
}},

/* ===================== 中学生 ===================== */
{id:'jh-day',lv:'jh',ico:'☕',t:'ミナ先生の 一日',d:'先生の 毎日を きいて 答える（3単現・do / does）',g:['jh_3s','jh_do','jh_wh'],start:'a',nodes:{
  a:{s:"Do you want to know about my day? Guess! What time do I get up?",j:"先生の 一日、 知りたい？ 当ててみて。 先生は 何時に おきる？",o:[
    G("You get up at six.","Close! I get up at five thirty. I walk on the beach every morning.","おしい！ 5時半。 毎朝 浜辺を 散歩するの",'b',["six","get"]),
    G("Maybe you get up at eight.","Eight? No way! I get up at five thirty.","8時？ まさか！ 5時半だよ",'b',["eight"]),
    X("You gets up at six.",'s3','主語は you。 s は つく？'),M("I get up at seven.","That's YOUR time! I asked about me. Ha ha.","それは あなたの 時間！ 先生の ことを きいたの",'主語は 「あなた（you）」。 You get up at 〜.')]},
  b:{s:"Now tell Hamako about me. What does Mina do every morning?",j:"ハマ子さんに 先生の ことを 教えて。 ミナは 毎朝 なにを する？",o:[
    G("She walks on the beach.","Right! Hamako says, 'Oh, healthy!'","そう！ ハマ子さん『あら、 健康的ね！』",'c',["walks","beach"]),
    G("She gets up at five thirty and walks.","Perfect! Two verbs, two s's!","カンペキ！ 動詞2つに s が 2つ！",'c',["gets","walks"]),
    X("She walk on the beach.",'s3'),M("I walk on the beach.","'I'? You walk on the beach too? Then let's walk together!","「I」？ あなたも 散歩するの？ じゃあ いっしょに！",'ミナ先生の ことを ハマ子さんに 話すよ。 主語は She')]},
  c:{s:"Does Gen drink coffee with me?",j:"ゲンじいは 先生と コーヒー のむ？",o:[
    G("No, he doesn't. He drinks green tea.","Right! He says coffee is too bitter.","正解！ コーヒーは にがすぎるって",'d',["doesn't","tea"]),
    G("Yes, he does!","Ha ha, no. He only drinks green tea. But nice try!","あはは、 ちがうの。 緑茶 だけ。 でも いい 答え方！",'d',["does","yes"]),
    X("No, he don't.",'doNeg'),X("No, he doesn't drinks coffee.",'s3do')]},
  d:{s:"I teach English in the afternoon. What do you do in the afternoon?",j:"先生は 午後に 英語を 教えるの。 あなたは 午後 なにを する？",o:[
    G("I {vr} in the afternoon.","Nice! Every day?","いいね！ 毎日？",'e',["afternoon"]),
    G("I study at school.","Of course! Students are busy.","そうだよね！ 学生は いそがしい",'e',["school","study"]),
    X("I {vr_3} in the afternoon.",'s3','主語は I。 s は いる？')]},
  e:{dr:'jh_3s',nx:'f'},
  f:{ask:"こんどは あなたが 先生に 質問する 番！「夜は なにを するの？」って きいてみて",o:[
    G("What do you do at night?","At night I look at the stars. I love stars!","夜は 星を 見るの。 星が 大すき！",'g',["what","night"]),
    G("What do you do in the evening?","In the evening I make dinner and read a book.","夕方は 夕ごはんを 作って 本を 読むよ",'g2',["what","evening"]),
    X("What you do at night?",'wh'),X("What does you do at night?",'s3do')]},
  g:{s:"Do you like stars?",j:"星は すき？",o:[
    G("Yes, I do. I like the moon, too.","Then let's look at the stars tonight!","じゃあ 今夜 いっしょに 星を 見よう！",'eS',["yes","moon"]),
    G("No, I don't. I'm afraid of the dark.","Oh! Then I'll bring a light.","そっか！ じゃあ ライトを もっていくね",'eD',["no","dark"]),
    X("Yes, I am.",'doQ2')]},
  g2:{s:"What does your family do in the evening?",j:"あなたの 家族は 夕方 なにを する？",o:[
    G("My mother cooks dinner.","She's a great cook, I bet!","料理じょうず なんだろうな！",'eF',["cooks","mother"]),
    G("My father watches TV.","Ha ha, every father does that!","あはは、 どこの お父さんも そう！",'eF',["watches","father"]),
    X("My mother cook dinner.",'s3'),X("My father watch TV.",'s3')]},
  eS:E(1,'星空の 約束',"Tonight, the stars. I'll tell you their English names!","今夜は 星空。 星の 英語の 名前を 教えるね！"),
  eD:E(0,'くらやみ こわい',"I'll bring a big light... maybe too big. Ha ha!","大きい ライト もっていく… 大きすぎるかも。 あはは！"),
  eF:E(1,'家族の 夕方',"Your family sounds warm. Say 'hi' to them for me!","あたたかい 家族だね。 よろしく つたえてね！"),
}},

{id:'jh-phone',lv:'jh',ico:'📱',t:'電話で「いま なにしてる？」',d:'現在進行形・過去進行形',g:['jh_prog','jh_pastprog'],start:'a',nodes:{
  a:{s:"Ring ring! Hi, it's Mina! What are you doing now?",j:"プルル！ もしもし、 ミナだよ！ いま なにしてる？",o:[
    G("I'm studying English.","Good! With me, right?","えらい！ わたしと だよね？",'b',["studying"]),
    G("I'm eating {food}.","Oh, sorry! Enjoy your {food}!","あら、 ごめんね！ {food_j} たのしんで！",'b',["eating"]),
    X("I studying English.",'prog'),X("I am study English.",'prog')]},
  b:{s:"I'm calling because I need help. I'm looking for Pochi. Is he with you?",j:"電話したのは 手つだってほしくて。 ポチを さがしてるの。 そこに いる？",o:[
    G("Yes! He is sleeping next to me.","Phew! Is he snoring?","ふう！ いびき かいてる？",'c',["sleeping","yes"]),
    G("No, he isn't. Sorry.","Hmm... where is he?","うーん… どこだろう？",'d',["no"]),
    X("Yes! He sleeping next to me.",'prog'),M("Yes, I'm Pochi.","You are Pochi?! Woof woof? Ha ha.","あなたが ポチ？！ ワンワン？",'Is he with you? は 「そこに いる？」。 Yes, he is. / No, he isn\'t.')]},
  c:{s:"Is he snoring?",j:"いびき かいてる？",o:[
    G("Yes! He is snoring loudly.","Ha ha! That's Pochi.","あはは！ ポチ らしい",'e',["snoring"]),
    G("No, he's dreaming. His legs are moving.","Running in his dream! Cute.","夢の 中で 走ってる！ かわいい",'e',["dreaming","moving"]),
    X("Yes, he snoring.",'prog')]},
  d:{s:"I called him at three, but he didn't come. What were you doing at three?",j:"3時に よんだけど 来なかったの。 あなたは 3時に なにしてた？",o:[
    G("I was taking a nap.","A nap! Lucky you.","おひるね！ いいなあ",'e2',["was","nap"]),
    G("I was playing {sport}.","{sport}! Was Pochi with you?","{sport_j}！ ポチも いた？",'e2',["was","playing"]),
    X("I was take a nap.",'pastProg'),X("I taking a nap.",'pastProg','「していた」は 過去の 形')]},
  e2:{s:"Look! Gen is coming. What is he carrying?",j:"見て！ ゲンじいが 来る。 なにを もってる？",o:[
    G("He is carrying Pochi!","Pochi! He was sleeping in Gen's boat!","ポチだ！ ゲンじいの ボートで ねてたって！",'e',["carrying","pochi"]),
    G("He's carrying a big fish.","A fish... and Pochi is chasing it!","魚… と、 それを ポチが 追いかけてる！",'e',["fish"]),
    X("He carrying a big fish.",'prog')]},
  e:{dr:1,nx:'f'},
  f:{s:"Thank you! By the way, what are you going to do now?",j:"ありがとう！ ところで、 これから なにを するの？",o:[
    G("I'm going to do my homework.","Great! Call me if you have questions.","えらい！ わからなかったら 電話してね",'eT',["homework"]),
    G("I'm going to play with Pochi.","Ha ha, have fun! Bring a ball.","あはは、 たのしんで！ ボールを もってね",'eP',["play","pochi"]),
    X("I going to do my homework.",'goingTo')]},
  eT:E(1,'電話で 先生と',"Bye! You spoke English on the phone. That's not easy!","バイバイ！ 電話で 英語を 話せたね。 かんたんじゃ ないよ！"),
  eP:E(0,'ポチと 泥んこ',"Later... you and Pochi are covered in sand. Ha ha!","あとで… あなたも ポチも すなだらけ。 あはは！"),
}},

{id:'jh-trip',lv:'jh',ico:'🚌',t:'修学旅行の 話',d:'過去形（規則・不規則）と 疑問詞',g:['jh_past1','jh_past2','jh_wh'],start:'a',nodes:{
  a:{s:"Welcome back! How was your school trip?",j:"おかえり！ 修学旅行 どうだった？",o:[
    G("It was amazing!","Amazing! Where did you go?","最高！ どこに 行ったの？",'b',["amazing"]),
    G("It was fun, but I was tired.","Ha ha, trips are tiring. Where did you go?","あはは、 旅行は つかれるよね。 どこへ？",'b',["fun","tired"]),
    X("It is amazing yesterday.",'past1','いつの こと？ be動詞も 過去に')]},
  b:{s:"Where did you go?",j:"どこに 行ったの？",o:[
    G("We went to Kyoto.","Kyoto! Did you see many temples?","京都！ お寺 たくさん 見た？",'c',["kyoto","went"]),
    G("We went to Okinawa.","Okinawa! Did you swim in the sea?","沖縄！ 海で およいだ？",'d',["okinawa","went"]),
    X("We goed to Kyoto.",'past2'),X("We go to Kyoto last week.",'past2')]},
  c:{s:"Did you see many temples?",j:"お寺は たくさん 見た？",o:[
    G("Yes, I did. I saw Kinkakuji.","The golden temple! Beautiful, right?","金ぴかの お寺！ きれいでしょ？",'e',["saw","kinkakuji"]),
    G("No, I didn't. I ate many sweets.","Ha ha, sweets are important, too!","あはは、 おかしも 大事！",'e',["ate","sweets"]),
    X("Yes, I did saw Kinkakuji.",'didPast'),X("Yes, I seed many.",'past2')]},
  d:{s:"Did you swim in the sea?",j:"海で およいだ？",o:[
    G("Yes! I swam with fish.","With fish! Like a mermaid!","魚と！ 人魚みたい！",'e',["swam","fish"]),
    G("No, it rained. We visited an aquarium.","An aquarium is fun, too!","水族館も たのしいよね！",'e',["visited","aquarium"]),
    X("Yes! I swimmed with fish.",'past2'),X("No, it rains. We visit an aquarium.",'past1')]},
  e:{dr:1,nx:'f'},
  f:{ask:"先生も 昔 旅行したんだって。 こんどは あなたが「どこに 行ったの？」って 英語で きいてみて",o:[
    G("Where did you go on your trip?","I went to Australia when I was a student!","学生のとき オーストラリアに 行ったよ！",'g',["where","did","go"]),
    G("Where did you go?","Australia! Long ago.","オーストラリア！ ずっと 前にね",'g',["where","did"]),
    X("Where did you went?",'didPast'),X("Where you went?",'wh')]},
  g:{s:"What did you buy for me? Just kidding! ...Did you buy anything?",j:"先生に なに 買ってきた？ じょうだん！ …なにか 買った？",o:[
    G("I bought this for you, Mina!","For me?! Thank you so much!","わたしに？！ ほんとに ありがとう！",'eT',["bought","you"]),
    G("I bought a key chain for my family.","Nice! Your family will love it.","いいね！ 家族 よろこぶよ",'eF',["bought","family"]),
    G("I didn't buy anything. I spent all my money on food.","Ha ha! Good memories, though!","あはは！ でも いい 思い出！",'eM',["didn't","food"]),
    X("I buyed this for you.",'past2')]},
  eT:E(1,'先生へ おみやげ',"A little charm from Kyoto... I'll keep it forever!","京都の お守り… 一生 大事に する！"),
  eF:E(1,'家族思い',"You're a kind person. Your trip story was great English, too!","やさしいね。 旅行の 話、 英語も すばらしかった！"),
  eM:E(0,'ぜんぶ 食べた',"No souvenirs, only a full tummy. That's a trip, too!","おみやげ なし、 おなか いっぱい。 それも 旅行！"),
}},

{id:'jh-weekend',lv:'jh',ico:'📅',t:'週末の 予定を 立てよう',d:'will / be going to / 助動詞',g:['jh_future','jh_modal'],start:'a',nodes:{
  a:{s:"What are you going to do this weekend?",j:"今週末は なにを する 予定？",o:[
    G("I'm going to {vi}.","Sounds fun! With who?","たのしそう！ だれと？",'b',["going"]),
    G("I don't have plans yet.","Then let's make a plan together!","じゃあ いっしょに 計画しよう！",'c',["plans","don't"]),
    X("I going to {vi}.",'goingTo'),X("I'm going to {vi_ed}.",'goingTo','to の あとは 原形')]},
  b:{s:"Will the weather be good?",j:"天気は いいかな？",o:[
    G("I think it will be sunny.","I hope so!","そうだと いいね！",'d',["sunny","will"]),
    G("It may rain. I'll take an umbrella.","Good idea. You're ready!","いい 考え。 じゅんび ばっちり！",'d',["rain","umbrella"]),
    X("I think it will sunny.",'will'),X("It will rains.",'will')]},
  c:{s:"Should we go to the beach or the library?",j:"浜辺と 図書館、 どっちに 行こうか？",o:[
    G("We should go to the beach!","OK! I'll bring snacks.","OK！ おかし もっていくね",'d',["beach","should"]),
    G("We should go to the library. I must study.","Wow, so serious! OK, library.","まじめ！ OK、 図書館",'dL',["library","must"]),
    X("We should to go to the beach.",'modal')]},
  dL:{s:"What must you study?",j:"なにを 勉強 しなきゃ いけないの？",o:[
    G("I must study for a math test.","Math! I can't help with that... Ha ha.","数学！ それは 先生 助けられない… あはは",'d',["math","must"]),
    G("I have to finish my English homework.","English! I can help!","英語！ 手つだえる！",'d',["english","have"]),
    X("I must studies for a test.",'modal')]},
  d:{dr:1,nx:'e'},
  e:{s:"I'm going to make lunch. What will you bring?",j:"先生は お弁当を 作るよ。 あなたは なにを もってくる？",o:[
    G("I'll bring drinks.","Perfect! It will be hot.","カンペキ！ 暑く なるからね",'f',["drinks","bring"]),
    G("I'll bring {food}!","Yum! Our lunch will be great.","おいしそう！ 最高の お昼に なる",'f',["bring"]),
    X("I will to bring drinks.",'will'),X("I will brings drinks.",'will')]},
  f:{s:"Can Sora come, too?",j:"ソラも 来られる？",o:[
    G("Yes, he can! I'll call him.","Great! The more, the merrier.","いいね！ 大ぜいの ほうが たのしい",'eT',["can","call"]),
    G("No, he can't. He has to help his mom.","That's OK. Next time!","だいじょうぶ。 また 今度！",'eN',["can't","help"]),
    X("Yes, he cans!",'modal'),X("No, he can't. He has to helps his mom.",'modal')]},
  eT:E(1,'週末ピクニック',"It's a plan! See you on Saturday!","決まり！ 土曜日に 会おう！"),
  eN:E(1,'ふたりで ピクニック',"Just the two of us. I'll teach you English songs!","ふたりきり。 英語の 歌を 教えるね！"),
}},

{id:'jh-cafe',lv:'jh',ico:'🧋',t:'浜辺カフェで 注文',d:'would like / There is / Can I 〜?',g:['jh_there','jh_inf','jh_modal'],start:'a',nodes:{
  a:{s:"Hello! Welcome to Beach Cafe. I'm your waitress today. What would you like?",j:"いらっしゃいませ！ ビーチカフェへ ようこそ。 きょうは わたしが 店員だよ。 なにに しますか？",o:[
    G("I'd like a mango juice, please.","One mango juice! Anything else?","マンゴージュース 1つ！ ほかには？",'b',["mango","like"]),
    G("Can I see the menu?","Of course. Here you are.","どうぞ。 メニューです",'m',["menu","can"]),
    X("I'd like drink a juice.",'inf','would like の あとに うごきを 入れるなら to'),M("I'd like a sea, please.","A sea? It's right there! Ha ha.","海？ すぐ そこに あるよ！ あはは",'カフェで ちゅうもん するのは のみもの・食べもの')]},
  m:{s:"Is there anything you want?",j:"なにか ほしい もの ある？",o:[
    G("Is there any cake?","Yes! There are three kinds of cake.","あります！ ケーキは 3しゅるい",'c',["cake","there"]),
    G("I'd like a mango juice.","Mango juice! Good choice.","マンゴージュース！ いいね",'b',["mango"]),
    X("Are there any cake?",'there','cake 1つの ときは？')]},
  b:{s:"Would you like something to eat?",j:"なにか 食べる ものは？",o:[
    G("Yes. Is there any cake?","Yes! There are three kinds of cake.","あります！ ケーキは 3しゅるい",'c',["cake"]),
    G("No, thank you. I'm not hungry.","OK! Just the juice.","OK！ ジュースだけね",'d',["no","thank"]),
    X("Yes. Are there a cake?",'there')]},
  c:{s:"There is chocolate, cheese, and strawberry. Which one do you want to try?",j:"チョコ・チーズ・いちごが あるよ。 どれを 食べてみたい？",o:[
    G("I want to try the chocolate cake.","Great choice! It's popular.","いい 選択！ 人気なの",'d',["chocolate","try"]),
    G("I want to try all of them!","All three?! Big eater!","3つ ぜんぶ？！ 大食い！",'dA',["all"]),
    X("I want try the cheese cake.",'inf')]},
  dA:{s:"Are you sure? It's a lot of cake.",j:"ほんとに？ ケーキ たくさん だよ",o:[
    G("Yes! I'm very hungry.","OK! Three cakes coming!","OK！ ケーキ 3つ 来るよ！",'d',["hungry","yes"]),
    G("No, just one, please.","Ha ha, that's wise.","あはは、 かしこい",'d',["one","no"])]},
  d:{dr:1,nx:'e'},
  e:{s:"Can I get you anything else?",j:"ほかに なにか おもちしましょうか？",o:[
    G("Can I have some water, please?","Sure! Here you are.","もちろん！ どうぞ",'f',["water","can"]),
    G("May I have the bill, please?","Of course. Thank you!","かしこまりました。 ありがとう！",'f',["bill","may"]),
    X("Can I has some water?",'modal')]},
  f:{s:"That's eight hundred yen. Would you like to pay by card or cash?",j:"800円です。 カード？ 現金？",o:[
    G("Cash, please. Here you are.","Thank you! Please come again!","ありがとうございます！ また 来てね！",'eT',["cash"]),
    G("Can I pay with shells?","Shells?! ...The manager says 'only today!' Ha ha.","かいがら？！ …店長『きょうだけ！』 あはは",'eS',["shells"]),
    M("Card, please. Here's my library card.","A library card?! That's for books! Ha ha.","図書館カード？！ それは 本の！ あはは",'お金を はらう カードだよ')]},
  eT:E(1,'ゆうがな カフェタイム',"You ordered like a pro! Next time, the real Beach Cafe!","プロみたいな ちゅうもん！ つぎは 本物の ビーチカフェで！"),
  eS:E(0,'かいがら 決済',"The manager is Hana. She loves shells. Lucky!","店長は ハナさん。 かいがら 大すき。 ラッキー！"),
}},

{id:'jh-hobby',lv:'jh',ico:'🎨',t:'好きな ことを 語ろう',d:'動名詞と 不定詞',g:['jh_ger','jh_inf'],start:'a',nodes:{
  a:{s:"What do you like doing in your free time?",j:"ひまな とき なにを するのが すき？",o:[
    G("I like {vr_ing}.","Oh, me too!","へえ、 わたしも！",'b',["like"]),
    G("I enjoy drawing pictures.","Drawing! Can you draw me?","絵！ わたしを かいて くれる？",'c',["drawing","enjoy"]),
    X("I enjoy to draw pictures.",'ger'),X("I like {vr_x}.",'ger','like の あとは 〜ing か to 〜')]},
  b:{s:"When did you start it?",j:"いつ はじめたの？",o:[
    G("I started it two years ago.","Two years! You must be good at it.","2年！ じょうず なんだろうな",'d',["started","ago"]),
    G("I began when I was little.","Since you were little! Wow.","小さい ころから！ すごい",'d',["began","little"]),
    X("I start it two years ago.",'past1')]},
  c:{s:"Draw me? OK! I'll sit here. Do you want to draw the sea, too?",j:"わたしを？ OK！ ここに すわるね。 海も かきたい？",o:[
    G("Yes, I want to draw the sea and you.","Then I'll smile like the sun!","じゃあ 太陽みたいに 笑うね！",'d',["sea","want"]),
    G("No, I want to draw only you.","Only me? I'm shy! Ha ha.","わたしだけ？ てれる！ あはは",'d',["only","want"]),
    X("Yes, I want drawing the sea.",'inf')]},
  d:{dr:1,nx:'e'},
  e:{s:"What do you want to try next?",j:"つぎに ちょうせん したい ことは？",o:[
    G("I want to learn the guitar.","The guitar! Let's play a song together someday.","ギター！ いつか いっしょに 歌おう",'f',["guitar","learn"]),
    G("I want to try surfing.","Surfing! Hana can teach you.","サーフィン！ ハナさんが 教えて くれるよ",'f',["surfing"]),
    X("I want to learning the guitar.",'inf'),X("I want learn the guitar.",'inf')]},
  f:{s:"Is learning new things hard?",j:"新しい ことを 学ぶのって たいへん？",o:[
    G("Yes, but learning is fun.","I agree! Learning English is fun, too.","そうだね！ 英語を 学ぶのも たのしい",'eT',["learning","fun"]),
    G("Studying is hard. Sleeping is easy.","Ha ha! Sleeping is my hobby, too.","あはは！ ねるのは 先生の しゅみでも ある",'eS',["sleeping","easy"]),
    X("Yes, but learn is fun.",'ger','「学ぶ こと」は 主語に なる 形で')]},
  eT:E(1,'しゅみ 仲間',"Let's keep trying new things together!","これからも いっしょに 新しい ことに ちょうせん しよう！"),
  eS:E(0,'おひるね 部',"Mina and you, the Nap Club. Members: two.","ミナと あなたの おひるね部。 部員 2名"),
}},

{id:'jh-ever',lv:'jh',ico:'🌏',t:'〜した こと ある？',d:'現在完了（経験・継続・完了）',g:['jh_perfect','jh_perfprog'],start:'a',nodes:{
  a:{s:"Have you ever been to a foreign country?",j:"外国に 行った こと ある？",o:[
    G("Yes, I have. I've been to Korea.","Korea! Did you eat bibimbap?","韓国！ ビビンバ 食べた？",'b',["been","korea"]),
    G("No, I haven't. But I want to go.","Someday you will! Where do you want to go?","いつか 行けるよ！ どこに 行きたい？",'c',["haven't","want"]),
    X("Yes, I have went to Korea.",'perf'),X("No, I have never go.",'perf')]},
  b:{s:"How many times have you been there?",j:"何回 行った ことが ある？",o:[
    G("I've been there twice.","Twice! You're a traveler.","2回！ 旅人だね",'d',["twice"]),
    G("Only once.","Once is special, too.","1回も とくべつだよ",'d',["once"]),
    X("I've go there twice.",'perf')]},
  c:{s:"I've been to Australia. Have you ever seen a kangaroo?",j:"先生は オーストラリアに 行った ことが あるの。 カンガルーを 見た ことは ある？",o:[
    G("Yes, I have. I saw one at the zoo.","At the zoo! They're so tall.","動物園で！ 背が 高いよね",'d',["zoo","have"]),
    G("No, I've never seen one.","They're amazing. They box!","すごいよ。 ボクシング するの！",'d',["never"]),
    X("No, I've never saw one.",'perf'),X("Yes, I have seen one yesterday.",'perfTime')]},
  d:{dr:'jh_perfect',nx:'e'},
  e:{s:"How long have you studied English?",j:"英語は どのくらい 勉強してる？",o:[
    G("I've studied English for three years.","Three years! Good job.","3年！ がんばってる",'f',["years","studied"]),
    G("I've been studying since I was eight.","Since you were eight! That's a long time.","8さいから！ 長いね",'f',["since","studying"]),
    X("I study English for three years.",'perf','「ずっと 〜している」は have ＋ 過去分詞'),X("I've been study English for three years.",'perfProg')]},
  f:{s:"Have you finished your homework yet?",j:"もう 宿題 おわった？",o:[
    G("Yes, I've already finished it.","Already! Perfect student.","もう？！ かんぺきな 生徒",'eT',["already","finished"]),
    G("No, not yet. I've just started.","Ha ha, then go do it! I'll wait.","あはは、 じゃあ やってきて！ まってるね",'eH',["yet","started"]),
    X("Yes, I've already finish it.",'perf')]},
  eT:E(1,'経験ゆたか',"You've done so many things! Let's make more memories.","たくさん 経験してるね！ もっと 思い出を つくろう"),
  eH:E(0,'宿題 まだ',"I've been waiting for an hour... Are you done yet? Ha ha!","1時間 まってるけど… まだ？ あはは！"),
}},

{id:'jh-compare',lv:'jh',ico:'⚖️',t:'どっちが すき？ くらべっこ',d:'比較級・最上級・as 〜 as',g:['jh_comp'],start:'a',nodes:{
  a:{s:"Let's compare! Which do you like better, summer or winter?",j:"くらべっこ しよう！ 夏と 冬、 どっちが すき？",o:[
    G("I like summer better.","Me too! Summer is more fun.","わたしも！ 夏の ほうが たのしい",'b',["summer","better"]),
    G("I like winter better than summer.","Winter? Why?","冬？ どうして？",'c',["winter","better"]),
    X("I like summer more better.",'comp'),X("I like summer best than winter.",'comp')]},
  c:{s:"Why do you like winter better?",j:"どうして 冬が すき？",o:[
    G("Because winter is cooler than summer.","Ha ha, true. Summer is too hot!","あはは、 たしかに。 夏は 暑すぎる！",'b',["cooler","because"]),
    G("Because I love snow.","Snow is beautiful. It's whiter than sand!","雪は きれい。 すなより 白い！",'b',["snow"]),
    X("Because winter is more cool than summer.",'comp')]},
  b:{s:"Which is the biggest animal in the sea?",j:"海で いちばん 大きい 動物は？",o:[
    G("The blue whale is the biggest.","Right! It's bigger than a bus.","正解！ バスより 大きい",'d',["whale","biggest"]),
    G("I think the whale shark is the biggest fish.","Good! The biggest FISH. Smart answer.","いいね！ いちばん 大きい 「魚」。 かしこい 答え",'d',["shark","biggest"]),
    X("The blue whale is the most big.",'sup'),X("The blue whale is bigger.",'sup','「いちばん」は 最上級')]},
  d:{s:"Is Gen as old as the sea? Ha ha!",j:"ゲンじいは 海と おなじくらい 年よりかな？ あはは",o:[
    G("No! He isn't as old as the sea.","Ha ha, right. He's only eighty-two!","あはは、 そう。 まだ 82さい！",'e',["as","old"]),
    G("He's older than me, but younger than the sea.","Perfect answer! I'll tell him.","カンペキな 答え！ 伝えとくね",'e',["older","younger"]),
    X("He isn't as older as the sea.",'comp','as と as の あいだは もとの 形')]},
  e:{dr:'jh_comp',nx:'f'},
  f:{s:"Last one! Who is the best English teacher?",j:"さいご！ いちばんの 英語の 先生は だれ？",o:[
    G("You are the best teacher, Mina!","Aww! You're the best student!","わあ！ あなたは 最高の 生徒！",'eT',["best","you"]),
    G("Hamako is better than you!","Hamako?! ...Well, her jokes are better. Ha ha.","ハマ子さん？！ …まあ、 ギャグは 上かも。 あはは",'eH',["hamako","better"]),
    X("You are the goodest teacher!",'sup'),X("You are the most best teacher!",'sup')]},
  eT:E(1,'世界一の 生徒',"You're the best student in the world. No, the universe!","世界一の 生徒。 いや、 宇宙一！"),
  eH:E(0,'ハマ子に まけた',"Hamako heard you... She's dancing! The beach is louder than ever.","ハマ子さんが きいてた… おどってる！ 浜辺が いちばん うるさい 日"),
}},

{id:'jh-museum',lv:'jh',ico:'🏛️',t:'浜辺の 博物館ツアー',d:'受け身・関係代名詞・分詞',g:['jh_passive','jh_rel','jh_part'],start:'a',nodes:{
  a:{s:"Welcome to the Beach Museum! I'm your guide. This ship was built 100 years ago. Who do you think built it?",j:"浜辺博物館へ ようこそ！ 案内役の ミナです。 この船は 100年前に つくられたの。 だれが つくったと 思う？",o:[
    G("It was built by fishermen.","Yes! It was built by Gen's grandfather!","そう！ ゲンじいの おじいさんが つくったの！",'b',["built","fishermen"]),
    G("Maybe it was made by pirates!","Pirates? Ha ha! No, by fishermen.","海ぞく？ あはは！ ちがうよ、 漁師さん",'b',["pirates"]),
    X("It was build by fishermen.",'passive'),X("It built by fishermen.",'passive')]},
  b:{s:"This is a man who saved many people in a storm. Do you know him?",j:"これは あらしの とき たくさんの 人を 助けた 人。 知ってる？",o:[
    G("Is he the man who built the lighthouse?","Yes! You know a lot.","そう！ よく 知ってるね",'c',["who","lighthouse"]),
    G("No. Who is he?","He's Gen's grandfather! The man who built the ship.","ゲンじいの おじいさん！ 船を つくった 人",'c',["who"]),
    X("Is he the man which built the lighthouse?",'rel')]},
  c:{s:"Look at this broken bottle. There's a letter in it. Can you read it?",j:"この 割れた びんを 見て。 中に 手紙が ある。 読める？",o:[
    G("It says, 'I'm waiting for you.'","Romantic! It was written by a sailor.","ロマンチック！ 船乗りが 書いたの",'d',["waiting","written"]),
    G("It's written in English!","Yes! It was found on this beach.","そう！ この浜辺で 見つかったの",'d',["written","english"]),
    X("It's write in English!",'passive')]},
  d:{dr:1,nx:'e'},
  e:{s:"This is the most popular thing in the museum. It's a shell which sings! Do you want to listen?",j:"これが 博物館で いちばん 人気。 歌う かいがら！ きいてみる？",o:[
    G("Yes! It's an amazing shell.","Put it to your ear... Can you hear the waves?","耳に あてて… 波の 音 きこえる？",'f',["amazing","yes"]),
    G("No thanks, I'm a little scared.","Ha ha, it's OK. It's a friendly shell.","あはは、 だいじょうぶ。 やさしい かいがらだよ",'f',["scared"]),
    X("Yes! It's an amazed shell.",'part')]},
  f:{s:"How was the tour?",j:"ツアーは どうだった？",o:[
    G("It was very interesting!","I'm glad! You were a great visitor.","よかった！ すばらしい お客さん だったよ",'eT',["interesting"]),
    G("I was a little bored.","Bored?! ...Next time, I'll sing like the shell! Ha ha.","たいくつ？！ …つぎは 先生が かいがらみたいに 歌う！",'eB',["bored"]),
    X("I was very interesting!",'part'),X("It was very interested!",'part')]},
  eT:E(1,'博物館マスター',"You learned the beach's history in English. Amazing!","浜辺の 歴史を 英語で 学んだね。 すごい！"),
  eB:E(0,'歌う 先生',"La la la~ ...Visitors are running away. Ha ha!","ラララ〜 …お客さんが にげていく。 あはは！"),
}},

{id:'jh-wish',lv:'jh',ico:'🪄',t:'もしも 魔法が 使えたら',d:'仮定法過去・間接疑問・接続詞',g:['jh_subj','jh_indq','jh_conj'],start:'a',nodes:{
  a:{s:"If you could use magic, what would you do?",j:"もし 魔法が 使えたら、 なにを する？",o:[
    G("If I could use magic, I would fly.","Fly! Where would you go?","とぶ！ どこへ 行く？",'b',["fly","would"]),
    G("I would make a mountain of {food}.","Ha ha! A delicious mountain!","あはは！ おいしい 山！",'c',["make","would"]),
    X("If I can use magic, I would fly.",'subj'),X("If I could use magic, I will fly.",'subj')]},
  b:{s:"If you were a bird, where would you fly?",j:"もし 鳥だったら どこへ とぶ？",o:[
    G("If I were a bird, I would fly to Hawaii.","Hawaii! Take me with you!","ハワイ！ わたしも つれてって！",'d',["hawaii","were"]),
    G("I would fly over the sea to see dolphins.","Dolphins from the sky! Beautiful.","空から イルカ！ きれい",'d',["dolphins","would"]),
    X("If I am a bird, I would fly to Hawaii.",'subj')]},
  c:{s:"Do you know how much {food} you can eat?",j:"{food_j}を どれくらい 食べられるか わかる？",o:[
    G("I don't know how much I can eat!","Ha ha! Let's find out!","あはは！ ためしてみよう！",'d',["know","how"]),
    G("I know I can eat ten plates.","Ten plates?! Wow.","10皿？！ すごい",'d',["ten","know"]),
    X("I don't know how much can I eat.",'indq')]},
  d:{dr:'jh_subj',nx:'e'},
  e:{s:"I wish I could talk to dolphins. What do you wish?",j:"先生は イルカと 話せたら なあ。 あなたの 願いは？",o:[
    G("I wish I could speak English perfectly.","You will, if you keep practicing!","練習を つづければ、 きっと できるよ！",'f',["wish","english"]),
    G("I wish I had a dragon.","A dragon! I'd ride it with you.","ドラゴン！ いっしょに のりたい",'f2',["dragon","wish"]),
    X("I wish I can speak English.",'subj')]},
  f:{s:"Why do you want to speak English?",j:"どうして 英語を 話したいの？",o:[
    G("Because I want to make friends around the world.","That's a wonderful reason.","すてきな 理由",'eT',["because","friends"]),
    G("If I speak English, I can travel alone.","Yes! English opens doors.","そう！ 英語は とびらを ひらく",'eT',["travel","if"]),
    X("So I want to make friends around the world.",'conj','「なぜなら」は どの ことば？')]},
  f2:{s:"If you had a dragon, what would you name it?",j:"もし ドラゴンが いたら、 なんて 名前に する？",o:[
    G("I would name it Mina!","Me?! A dragon named Mina! I'm honored. Ha ha.","わたし？！ ミナという ドラゴン！ こうえい！",'eD',["name","mina"]),
    G("I would call it Pochi Two.","Pochi Two! Pochi will be jealous.","ポチ2号！ ポチが やきもち やくよ",'eD',["pochi"]),
    X("If I have a dragon, I would name it Mina.",'subj','「もしも」の 話だよ')]},
  eT:E(1,'魔法より すごい ちから',"You know what? Learning English is a kind of magic.","ねえ、 英語を 学ぶって ある意味 魔法だよ"),
  eD:E(0,'ドラゴンの 名前',"Somewhere, a dragon sneezed. ...It heard its new name! Ha ha.","どこかで ドラゴンが くしゃみ。 …新しい 名前が きこえたんだね！"),
}},

/* ===================== 高校生 ===================== */
{id:'hs-lost',lv:'hs',ico:'🧳',t:'落とし物センターにて',d:'過去完了・助動詞＋完了形',g:['hs_tense','hs_modperf'],start:'a',nodes:{
  a:{s:"Hello, this is the Beach Lost and Found. I'm Mina, the staff today. How can I help you?",j:"こちら 浜辺の 落とし物センター。 きょうの 係の ミナです。 どうしましたか？",o:[
    G("I've lost my wallet.","I'm sorry to hear that. When did you notice?","それは たいへん。 いつ 気づきましたか？",'b',["lost","wallet"]),
    G("I think I left my bag somewhere.","Let's find it. When did you last see it?","さがしましょう。 さいごに 見たのは いつ？",'b',["left","bag"]),
    M("I've found my wallet.","Found it? Then... why are you here? Ha ha.","見つかった？ じゃあ… なんで ここに？",'lost（なくした）と found（見つけた）は 反対')]},
  b:{s:"When did you notice it was gone?",j:"なくなったのに いつ 気づきましたか？",o:[
    G("When I got to the station, it had already disappeared.","I see. So you had it before the station.","なるほど。 駅より 前には あったんですね",'c',["had","station"]),
    G("I noticed it after I had bought ice cream.","After the ice cream shop... OK.","アイス屋の あと… OK",'c',["had","ice"]),
    X("When I got to the station, it has already disappeared.",'hsTense'),X("When I got to the station, it already disappears.",'hsTense')]},
  c:{s:"Hmm. Where do you think you lost it?",j:"うーん。 どこで なくしたと 思いますか？",o:[
    G("I must have dropped it on the beach.","The beach. Many things are found there.","浜辺。 たくさん 見つかる 場所です",'d',["must","dropped"]),
    G("Someone may have taken it.","Let's hope not. Let's check first.","そうじゃないと いいけど。 まず 確認しましょう",'d',["may","taken"]),
    X("I must have drop it on the beach.",'modPerf'),X("I must dropped it on the beach.",'modPerf')]},
  d:{dr:1,nx:'e'},
  e:{s:"Good news! A boy brought in a wallet an hour ago. Is this yours?",j:"いい 知らせ！ 1時間前に 男の子が さいふを とどけて くれたの。 これ？",o:[
    G("Yes! That's mine! Thank you so much.","You're welcome. He should be thanked, too.","どういたしまして。 その子にも お礼を",'f',["mine","yes"]),
    G("No, mine is blue.","Oh... then let me check again.","あ… じゃあ もう一度 さがします",'g',["blue","no"]),
    M("Yes, that's my boy.","Your boy?! No, I mean the wallet! Ha ha.","あなたの 子？！ さいふの ことだよ！",'Is this yours? の this は さいふ')]},
  g:{s:"Hmm... A blue wallet... Oh, Pochi is holding something blue!",j:"うーん… 青い さいふ… あっ、 ポチが 青い ものを くわえてる！",o:[
    G("He must have found it on the beach!","Good boy, Pochi! He deserves a treat.","えらい ポチ！ ごほうびだね",'eP',["must","found"]),
    G("Pochi! You should have told me!","Ha ha, dogs can't talk!","あはは、 犬は しゃべれないよ！",'eP',["should","told"]),
    X("He must find it on the beach yesterday.",'modPerf')]},
  f:{s:"The boy left a note. It says, 'I had been looking for the owner all day.'",j:"男の子の メモ。『ずっと 持ち主を さがしていました』だって",o:[
    G("I should have been more careful.","It happens. But now you have a nice story!","よくある こと。 でも いい 話が できたね",'eT',["should","careful"]),
    G("I'd like to thank him.","His name is Sora! You know him.","ソラだよ！ 知ってるでしょ",'eS',["thank"]),
    X("I should be more careful yesterday.",'modPerf','過去の ことへの 後悔は should have ＋ 過去分詞')]},
  eT:E(1,'無事 もどった',"Things lost, things found. That's the beach!","なくして、 見つかる。 それが 浜辺"),
  eS:E(1,'ソラに お礼',"Sora says, 'Buy me shaved ice!' Ha ha.","ソラ『かき氷 おごって！』だって。 あはは"),
  eP:E(0,'ポチの 手がら',"Pochi wants a reward... your wallet is a little wet. Ha ha!","ポチが ごほうびを 待ってる… さいふは ちょっと ぬれてるけど！"),
}},

{id:'hs-news',lv:'hs',ico:'📰',t:'浜辺ニュースの キャスター',d:'受動態の応用・無生物主語',g:['hs_passive2','hs_noun'],start:'a',nodes:{
  a:{s:"Good evening! This is Beach News. I'm Mina. You're my co-host today! What's the first news?",j:"こんばんは！ 浜辺ニュースの ミナです。 きょうは あなたが 相方！ さいしょの ニュースは？",o:[
    G("The old lighthouse is being repaired.","Yes! It has been closed for a month.","はい！ もう 1か月 しまっています",'b',["repaired","being"]),
    G("A new cafe has been opened near the station.","Great news for coffee lovers!","コーヒー好きに うれしい ニュース！",'c',["opened","cafe"]),
    X("The old lighthouse is repairing.",'passive2'),X("The old lighthouse is being repair.",'passive2')]},
  b:{s:"When will it be finished?",j:"いつ 完成するの？",o:[
    G("It will be finished next month.","Wonderful. We're waiting!","すばらしい。 たのしみ！",'d',["finished","next"]),
    G("It is said to be finished by summer.","By summer! Just in time for fireworks.","夏までに！ 花火に まにあうね",'d',["said","summer"]),
    X("It will finish next month by the workers.",'passive2','「〜される」は 受け身')]},
  c:{s:"What can be ordered there?",j:"そこでは なにが 注文できる？",o:[
    G("Special coffee can be ordered.","I'll go tomorrow!","あした 行こう！",'d',["coffee","ordered"]),
    G("Cakes made with local fruit can be ordered.","Local fruit! That's nice.","地元の くだもの！ いいね",'d',["cakes","fruit"]),
    X("Special coffee can order there.",'passive2')]},
  d:{dr:1,nx:'e'},
  e:{s:"Next: why are so many people coming to our beach?",j:"つぎ：なぜ 浜辺に こんなに 人が 来るの？",o:[
    G("A video on the internet brought many tourists here.","The power of the internet!","ネットの 力！",'f',["video","brought"]),
    G("The beautiful sunset makes people happy.","True! It makes me happy every day.","ほんと！ 先生も 毎日 しあわせ",'f',["sunset","makes"]),
    X("The beautiful sunset makes people happily.",'s5')]},
  f:{s:"Last news! A message in a bottle was found this morning. What did it say?",j:"さいごの ニュース！ けさ びんの 手紙が 見つかったよ。 なんて 書いてあった？",o:[
    G("It said, 'This beach made me who I am.'","Beautiful words. And that's the news!","すてきな ことば。 以上、 ニュースでした！",'eT',["made","beach"]),
    G("It said, 'Pochi ate my sandwich.'","Ha ha! Breaking news: Pochi strikes again!","あはは！ 速報：またも ポチ！",'eP',["pochi","ate"]),
    X("It was said by, 'Pochi ate my sandwich.'",'passive2','ここは ふつうの 文で いいよ')]},
  eT:E(1,'名キャスター',"Great job, co-host! Your English was clear and calm.","さすが 相方！ 英語が はっきり 落ちついてたよ"),
  eP:E(0,'ポチ速報',"Our phones are ringing. Everyone wants to know about Pochi!","電話が 鳴りやまない。 みんな ポチの ことが 知りたい！"),
}},

{id:'hs-future',lv:'hs',ico:'🧭',t:'進路相談',d:'仮定法の応用・不定詞の応用',g:['hs_subj2','hs_inf2'],start:'a',nodes:{
  a:{s:"Let's talk about your future. What do you want to study after high school?",j:"進路の 話を しよう。 高校の あと、 なにを 勉強したい？",o:[
    G("I want to study science in order to become a doctor.","A doctor! That's a big goal.","医者！ 大きな 目標",'b',["science","order"]),
    G("I'm not sure yet. That's why I came to talk.","That's OK. Let's think together.","だいじょうぶ。 いっしょに 考えよう",'c',["sure","talk"]),
    X("I want to study science for becoming a doctor.",'inf2')]},
  b:{s:"Why did you choose that dream?",j:"どうして その ゆめを えらんだの？",o:[
    G("If my grandma hadn't been sick, I wouldn't have thought about it.","I see. Your grandma gave you a reason.","そうか。 おばあちゃんが きっかけ なんだね",'d',["grandma","hadn't"]),
    G("I watched a doctor drama and was moved.","A drama! Dreams start anywhere.","ドラマ！ ゆめは どこからでも はじまる",'d',["drama","moved"]),
    X("If my grandma hadn't been sick, I won't think about it.",'subj2')]},
  c:{s:"If you could do any job, what would you do?",j:"どんな 仕事でも できるなら、 なにを する？",o:[
    G("If I could, I would travel and write books.","A travel writer! Sounds exciting.","旅行作家！ わくわくするね",'d',["travel","write"]),
    G("I would open a cafe on this beach.","A beach cafe! I'd visit every day.","浜辺の カフェ！ 毎日 行くよ",'d',["cafe","would"]),
    X("If I can, I would travel and write books.",'subj','じっさいと ちがう もしもの 話は 過去形')]},
  d:{dr:1,nx:'e'},
  e:{s:"It's time to decide your first step. What will you do this month?",j:"そろそろ 最初の 一歩を 決めよう。 今月 なにを する？",o:[
    G("I'll study harder so as to pass the exam.","Good plan. I'll support you.","いい 計画。 おうえん するよ",'f',["study","pass"]),
    G("I'm going to visit a university to see the campus.","Seeing is believing!","百聞は 一見に しかず！",'f',["visit","university"]),
    X("I'll study harder for to pass the exam.",'inf2')]},
  f:{s:"Is there anything you regret?",j:"なにか 後悔してる ことは ある？",o:[
    G("I wish I had started studying earlier.","It's never too late. You started today!","おそすぎる ことは ないよ。 きょう はじめたじゃない！",'eT',["wish","started"]),
    G("No. I have no regrets.","That's the spirit!","その 意気！",'eT2',["no","regrets"]),
    X("I wish I started studying earlier yesterday.",'subj2')]},
  eT:E(1,'一歩目',"Remember this day. It's the first page of your story.","この日を おぼえておいて。 あなたの 物語の 1ページ目だよ"),
  eT2:E(1,'後悔なし',"No regrets, only goals. I like that!","後悔なし、 目標だけ。 いいね！"),
}},

{id:'hs-rumor',lv:'hs',ico:'🗣️',t:'浜辺の うわさ話',d:'話法・時制の一致',g:['hs_speech','hs_seq'],start:'a',nodes:{
  a:{s:"Have you heard? Hamako told me something interesting. Do you want to know?",j:"きいた？ ハマ子さんが おもしろい ことを 言ってたの。 知りたい？",o:[
    G("Yes! What did she say?","She said Gen was going to get married!","ゲンじいが 結婚するって 言ってたの！",'b',["say","what"]),
    G("Is it a secret?","It's a small secret. She said she had seen Gen with a lady.","ちょっとした ひみつ。 ゲンじいが 女の人と いるのを 見たって",'b',["secret"]),
    M("No, I'm Hamako.","You're Hamako?! Where are your glasses? Ha ha.","あなたが ハマ子さん？！ めがねは？",'Do you want to know? には Yes / No で')]},
  b:{s:"Can you believe it? Go ask Gen. What will you say to him?",j:"信じられる？ ゲンじいに きいてきて。 なんて 言う？",o:[
    G("Hamako said you were going to get married. Is it true?","Ha ha, direct! Let's see what he says.","あはは、 ストレート！ なんて 言うかな",'c',["said","true"]),
    G("I heard you had a girlfriend.","Gen's face is turning red!","ゲンじいの 顔が 赤く なってる！",'c',["heard","girlfriend"]),
    X("Hamako said you are going to get married yesterday.",'speech'),X("Hamako said me you were going to get married.",'speech')]},
  c:{s:"*Gen*: 'She's my sister! She visited me from Osaka.' ...So, what did Gen say? Tell me!",j:"ゲンじい『妹じゃ！ 大阪から 来たんじゃ』 …で、 ゲンじい なんて 言ってた？",o:[
    G("He said the lady was his sister.","His sister! The rumor was wrong!","妹さん！ うわさは まちがい！",'d',["said","sister"]),
    G("He told me she had come from Osaka.","From Osaka! Not a wedding, a family visit.","大阪から！ 結婚じゃなくて 家族の 訪問",'d',["told","osaka"]),
    X("He said the lady is his sister.",'seq')]},
  d:{dr:1,nx:'e'},
  e:{s:"Oh no. I thought Hamako was always right. What should I tell her?",j:"あらら。 ハマ子さんは いつも 正しいと 思ってた。 なんて 伝えよう？",o:[
    G("Tell her that the lady was Gen's sister.","OK. She'll laugh, I'm sure.","OK。 きっと 笑うね",'eT',["tell","sister"]),
    G("Let's keep it a secret. It's more fun.","Ha ha, you're a little bad!","あはは、 ちょっと わるい子！",'eB',["secret"]),
    X("Tell her that the lady is Gen's sister yesterday.",'seq')]},
  eT:E(1,'うわさの 正体',"Hamako laughed so hard her glasses fell off!","ハマ子さん、 わらいすぎて めがねが 落ちた！"),
  eB:E(0,'うわさは つづく',"Now the whole beach thinks Gen is getting married. Oops!","いまや 浜辺じゅうが ゲンじい 結婚説… あらら！"),
}},

{id:'hs-guide',lv:'hs',ico:'🏮',t:'外国人観光客を 案内',d:'関係副詞・関係代名詞の応用',g:['hs_reladv','hs_rel2'],start:'a',nodes:{
  a:{s:"Hi! I'm a tourist from Canada. *Mina is acting.* Can you tell me a place where I can see the ocean?",j:"こんにちは！ カナダから 来た 観光客です。（ミナ先生の 演技）海が 見える 場所を 教えて？",o:[
    G("The hill where the lighthouse stands is the best.","The lighthouse hill! Perfect.","灯台の 丘！ ぴったり",'b',["where","lighthouse"]),
    G("This beach is the place where everyone watches the sunset.","Sunset! I'll stay until evening.","夕日！ 夕方まで いよう",'c',["where","sunset"]),
    X("The hill which the lighthouse stands is the best.",'relAdv')]},
  b:{s:"What's special about it?",j:"なにが とくべつ なの？",o:[
    G("What's special is the view at night.","At night? Tell me more.","夜？ もっと 教えて",'d',["what","night"]),
    G("It's the place where my grandparents first met.","How romantic!","ロマンチック！",'d',["where","met"]),
    X("The thing what is special is the view.",'rel2')]},
  c:{s:"When is the best time to visit?",j:"いちばん いい 時間は？",o:[
    G("Around six is the time when the sky turns orange.","Six o'clock. Got it!","6時ね。 了解！",'d',["when","orange"]),
    G("Whenever you come, it's beautiful.","Whenever! I like that answer.","いつでも！ いい 答え",'d',["whenever"]),
    X("Around six is the time which the sky turns orange.",'relAdv')]},
  d:{dr:1,nx:'e'},
  e:{s:"Is there a restaurant you recommend?",j:"おすすめの レストランは ある？",o:[
    G("Gen's shop, which sells fresh fish, is great.","Fresh fish! I'll go.","新鮮な 魚！ 行く",'f',["which","fish"]),
    G("Hana's cafe is where the locals go.","Where the locals go! That's the best kind.","地元の 人が 行く 店！ いちばん いいやつ",'f',["where","locals"]),
    X("Gen's shop, that sells fresh fish, is great.",'rel2','カンマの あとは which')]},
  f:{s:"Thank you so much! You made my trip special. Can I take a photo with you?",j:"ほんとに ありがとう！ 旅が とくべつに なった。 いっしょに 写真 とれる？",o:[
    G("Sure! This is the beach where we met.","I'll never forget this place!","この 場所、 わすれない！",'eT',["sure","where"]),
    G("Sorry, I'm shy.","No problem! Thank you anyway.","だいじょうぶ！ とにかく ありがとう",'eS',["sorry","shy"]),
    X("Sure! This is the beach which we met.",'relAdv')]},
  eT:E(1,'旅の 思い出',"*Mina stops acting.* Great guiding! You'd be a perfect tour guide.","（演技 おわり）すばらしい 案内！ ガイドさんに なれるよ"),
  eS:E(0,'はずかしがり屋',"The tourist took a photo of your back. Ha ha! Still a memory.","観光客は あなたの 後ろ姿を パシャリ。 それも 思い出！"),
}},

{id:'hs-debate',lv:'hs',ico:'🎤',t:'ミニ ディベート：夏と 冬',d:'比較の応用・強調・否定',g:['hs_comp2','hs_emph','hs_neg'],start:'a',nodes:{
  a:{s:"Let's have a debate! I say summer is better than winter. Do you agree?",j:"ディベート しよう！ 先生は 夏の ほうが いいと 思う。 賛成？",o:[
    G("No. I think winter is far better.","Interesting! Give me a reason.","おもしろい！ 理由は？",'b',["winter","better"]),
    G("I agree. The hotter it gets, the more I want to swim.","Ha ha! The swimmer's opinion.","あはは！ 泳ぐ人の 意見",'c',["hotter","more"]),
    X("I agree. More hot it gets, more I want to swim.",'comp2')]},
  b:{s:"Why is winter better?",j:"どうして 冬の ほうが いいの？",o:[
    G("It is in winter that we can see the clearest stars.","Oh! You know I love stars. Tricky!","おお！ 先生が 星好きなの 知ってるね。 やるな！",'d',["winter","that"]),
    G("Not all people like the heat.","True. Not everyone is a summer person.","たしかに。 みんなが 夏好き とは かぎらない",'d',["not","all"]),
    X("All people don't like the heat.",'neg','「みんなが 〜とは かぎらない」は 部分否定')]},
  c:{s:"But summer has mosquitoes!",j:"でも 夏は 蚊が いるよ！",o:[
    G("Not only summer but also autumn has mosquitoes.","Hmm, good point!","うーん、 いい 指摘！",'d',["not","only"]),
    G("The more I swim, the less I care about mosquitoes.","Ha ha! Strong opinion.","あはは！ 強い 意見",'d',["more","less"]),
    X("Not only summer but also autumn have mosquitoes.",'emph','not only A but also B の 動詞は B に あわせる')]},
  d:{dr:1,nx:'e'},
  e:{s:"Final round! Say your strongest point.",j:"さいごの ラウンド！ いちばん 強い 意見を どうぞ",o:[
    G("It was this beach that made me love both seasons.","Wow... a perfect ending. I can't argue with that!","わあ… カンペキな しめ。 反論 できない！",'eT',["beach","that"]),
    G("No other season is as beautiful as winter.","Strong! The judges are thinking...","強い！ 審査員が 考えてる…",'eW',["no","other"]),
    X("No other season is as more beautiful as winter.",'comp2')]},
  eT:E(1,'両方の 勝ち',"Debate result: a draw! Summer and winter both win.","ディベート結果：引き分け！ 夏も 冬も 勝ち"),
  eW:E(1,'冬チームの 勝利',"The judge is Hamako... She wants winter for hot sweet potatoes! You win!","審査員は ハマ子さん… 焼きいもの ために 冬！ あなたの 勝ち！"),
}},

{id:'hs-memory',lv:'hs',ico:'📷',t:'思い出の 写真',d:'動名詞と不定詞の使い分け・分詞構文',g:['hs_ginf','hs_partc'],start:'a',nodes:{
  a:{s:"Look at this old photo! Do you remember taking it?",j:"この 古い 写真 見て！ これ とった こと おぼえてる？",o:[
    G("Yes, I remember taking it last summer.","Me too! What a day.","わたしも！ すごい 日だったね",'b',["remember","taking"]),
    G("No, I don't remember being there.","Ha ha, you were sleeping in the photo!","あはは、 写真の 中で ねてるよ！",'c',["remember","being"]),
    X("Yes, I remember to take it last summer.",'ginf')]},
  b:{s:"What were we doing that day?",j:"あの日 なにを してたっけ？",o:[
    G("Walking along the beach, we found a giant shell.","Yes! The giant shell!","そう！ 大きな かいがら！",'d',["walking","shell"]),
    G("Having finished lunch, we swam all afternoon.","Right. We were like fish.","そうそう。 魚みたい だった",'d',["having","swam"]),
    X("Walked along the beach, we found a giant shell.",'partc')]},
  c:{s:"Next time, don't forget to wake up! Ha ha. What should you remember next time?",j:"つぎは わすれずに おきてね！ あはは。 つぎは なにを わすれないように する？",o:[
    G("I'll remember to set an alarm.","Good idea!","いい 考え！",'d',["remember","alarm"]),
    G("I'll try to stay awake.","Try! Coffee helps.","がんばって！ コーヒーが きくよ",'d',["try","awake"]),
    X("I'll remember setting an alarm next time.",'ginf')]},
  d:{dr:1,nx:'e'},
  e:{s:"Some memories make me want to stop time. Do you have any?",j:"時間を 止めたく なる 思い出、 ある？",o:[
    G("I'll never forget seeing the fireworks with my friends.","That sounds precious.","大切な 思い出だね",'eT',["forget","seeing"]),
    G("I stopped to look at the stars that night.","Stopped to look... I love that.","立ち止まって 見た… すてき",'eT',["stopped","stars"]),
    X("I'll never forget to see the fireworks last year.",'ginf')]},
  eT:E(1,'時間を とめる 写真',"Let's take a new photo today. Say cheese!","きょうも 新しい 写真を とろう。 はい チーズ！"),
}},

{id:'hs-festival',lv:'hs',ico:'🏮',t:'夏祭りの じゅんび',d:'使役動詞・SVOC・接続詞の応用・数量',g:['hs_caus','hs_5','hs_conj2','hs_quant'],start:'a',nodes:{
  a:{s:"We're the festival leaders this year! First, who will set up the stage?",j:"ことしは 夏祭りの リーダー！ まず ステージは だれが 作る？",o:[
    G("Let's have Gen and Sora set it up.","Good. Gen is strong, and Sora is fast.","いいね。 ゲンじいは 力持ち、 ソラは すばやい",'b',["have","gen"]),
    G("Let me do it. I'm good at building.","You? OK, I'll help you.","あなたが？ OK、 手つだう",'b',["let","me"]),
    X("Let's make Gen to set it up.",'caus')]},
  b:{s:"How many lanterns do we need?",j:"ちょうちんは いくつ いる？",o:[
    G("We need a lot of lanterns, but we only have a few.","Then let's make more!","じゃあ もっと 作ろう！",'c',["few","lanterns"]),
    G("We need fifty. We have little time, so let's hurry.","Fifty! Let's hurry.","50こ！ いそごう",'c',["little","time"]),
    X("We need much lanterns.",'quant')]},
  c:{dr:1,nx:'d'},
  d:{s:"What if it rains on the festival day?",j:"お祭りの 日に 雨が ふったら？",o:[
    G("Even if it rains, we'll hold it in the gym.","Smart! A backup plan.","かしこい！ 予備の 計画",'e',["even","gym"]),
    G("Unless it rains heavily, we'll do it on the beach.","Let's pray for good weather.","晴れを いのろう",'e',["unless","beach"]),
    X("Unless it doesn't rain, we'll do it.",'conj2')]},
  e:{s:"What will make the festival special this year?",j:"ことしの お祭りを とくべつに するのは？",o:[
    G("Fireworks will make everyone happy.","Yes! Big fireworks.","そう！ 大きな 花火",'f',["fireworks","make"]),
    G("Hamako's dance will keep everyone laughing.","Ha ha! True.","あはは！ たしかに",'f',["keep","laughing"]),
    X("Fireworks will make everyone happily.",'s5')]},
  f:{s:"It's the day! Everything is ready. How do you feel?",j:"当日！ じゅんび 完了。 気分は？",o:[
    G("Seeing everyone smile makes me proud.","Me too. We did it, partner!","わたしも。 やったね、 相棒！",'eT',["makes","proud"]),
    G("I'm so tired, but it was worth it.","Let's eat takoyaki and rest.","たこやき 食べて やすもう",'eT2',["tired","worth"]),
    M("I feel festival.","You feel... festival? Ha ha, I know what you mean!","気分が… お祭り？ あはは、 言いたい ことは わかる！",'気分は 形容詞で：proud / happy / tired …')]},
  eT:E(1,'さいこうの 夏祭り',"The fireworks were the biggest ever. And so were our smiles.","花火は 過去最大。 わたしたちの 笑顔もね"),
  eT2:E(1,'お祭りの あと',"Takoyaki after hard work is the best in the world.","がんばった あとの たこやきは 世界一"),
}},

/* ===================== ハイレベル ===================== */
{id:'adv-interview',lv:'adv',ico:'🎓',t:'留学の 面接',d:'意見・理由・仮定を まとめて 話す',g:['hs_subj2','hs_emph','hs_ellip'],start:'a',nodes:{
  a:{s:"Good morning. I'm Professor Mina from Sunrise University. Please tell me why you want to study abroad.",j:"おはよう。 サンライズ大学の ミナ教授です。 留学したい 理由を 教えて ください",o:[
    G("I want to broaden my perspective by living in a different culture.","A clear goal. Go on.","はっきりした 目標ね。 つづけて",'b',["perspective","culture"]),
    G("It is because I want to challenge myself that I applied.","I see. Challenge is important.","なるほど。 ちょうせんは 大切",'b',["because","challenge"]),
    X("I want to broaden my perspective by live in a different culture.",'ger','by の あとは 〜ing')]},
  b:{s:"What would you do if you felt lonely abroad?",j:"留学先で さみしく なったら どうする？",o:[
    G("If I felt lonely, I would join a club to make friends.","A practical answer.","実用的な 答え",'c',["club","would"]),
    G("I would call my family, but I'd also try to meet new people.","Balance. Good.","バランス。 いいね",'c',["call","meet"]),
    X("If I felt lonely, I will join a club.",'subj')]},
  c:{dr:1,nx:'d'},
  d:{s:"Tell me about a failure and what you learned from it.",j:"失敗と、 そこから 学んだ ことを 話して",o:[
    G("I failed a speech contest. Had I practiced more, I could have won. Now I prepare carefully.","Honest and reflective. Excellent.","正直で、 ふりかえりも できてる。 すばらしい",'e',["failed","practiced"]),
    G("I once forgot my lines in a play. The fact that everyone helped me taught me teamwork.","The fact that... a strong sentence.","the fact that… 力のある 文",'e',["fact","teamwork"]),
    X("If I had practiced more, I could win.",'subj2'),X("The fact which everyone helped me taught me teamwork.",'ellip')]},
  e:{s:"Last question. What will you bring back to Japan?",j:"さいごの 質問。 日本に なにを もちかえる？",o:[
    G("What I learn abroad, I will share with younger students.","Wonderful. That's what a leader does.","すばらしい。 それが リーダー",'eT',["share","learn"]),
    G("Lots of souvenirs for my family!","Ha ha! Honest. ...But try a deeper answer next time.","あはは！ 正直。 …でも つぎは 深い 答えも ね",'eS',["souvenirs"]),
    X("The thing what I learn, I will share.",'rel2')]},
  eT:E(1,'合格！',"*Mina smiles.* You passed. See you on campus!","（ミナ先生 にっこり）合格。 キャンパスで 会おう！"),
  eS:E(0,'おみやげ 面接',"The professor laughed. ...Result: waiting list. Ha ha!","教授 大笑い。 …結果：補欠。 あはは！"),
}},

{id:'adv-mystery',lv:'adv',ico:'🕵️',t:'浜辺の 謎解き',d:'推理を 英語で（助動詞＋完了形・過去完了）',g:['hs_modperf','hs_tense','hs_partc'],start:'a',nodes:{
  a:{s:"Detective, we have a case. Hana's golden shell has disappeared from her shop! What do you think happened?",j:"探偵さん、 事件です。 ハナさんの 金の かいがらが 店から 消えた！ どう 思う？",o:[
    G("Someone must have taken it last night.","Last night... The shop was locked, though.","ゆうべ… でも 店は かぎが かかってた",'b',["must","taken"]),
    G("It might have been moved by the wind.","The wind? Hmm, the window was open!","風？ うーん、 窓が あいてた！",'c',["might","moved"]),
    X("Someone must take it last night.",'modPerf')]},
  b:{s:"Before the shop closed, three people had visited: Sora, Gen, and Pochi. Who do you suspect?",j:"閉店前に 3人が 来ていた：ソラ・ゲンじい・ポチ。 だれが あやしい？",o:[
    G("Pochi. Dogs love shiny things.","Interesting. Let's check his house.","おもしろい。 ポチの 家を 調べよう",'d',["pochi"]),
    G("Sora. He had wanted the shell for a long time.","He had... that's a motive.","ずっと ほしがってた… 動機だね",'d',["sora","wanted"]),
    X("Sora. He has wanted the shell before he visited.",'hsTense')]},
  c:{s:"If the wind moved it, where could it have gone?",j:"風で 動いたなら、 どこへ 行った 可能性が ある？",o:[
    G("It could have rolled under the counter.","Let's look! ...Not there.","見てみよう！ …ない",'d',["could","rolled"]),
    G("It can't have flown far. It's heavy.","Logical!","論理的！",'d',["can't","heavy"]),
    X("It could rolled under the counter.",'modPerf')]},
  d:{dr:1,nx:'e'},
  e:{s:"Look! Sand footprints, small ones, leading to Gen's boat. What can you conclude?",j:"見て！ 小さな 砂の 足あとが ゲンじいの ボートへ。 なにが わかる？",o:[
    G("Judging from the footprints, Pochi must have carried it to the boat.","Brilliant! Let's go to the boat.","みごと！ ボートへ 行こう",'f',["footprints","pochi"]),
    G("Following the footprints, we'll find the shell.","Let's follow them!","足あとを たどろう！",'f',["following","footprints"]),
    X("Judged from the footprints, Pochi must have carried it.",'partc')]},
  f:{s:"In the boat... the golden shell! And Pochi is sleeping next to it. Final answer, detective?",j:"ボートの 中に… 金の かいがら！ そばで ポチが ねてる。 探偵さん、 さいごの 答えは？",o:[
    G("Pochi took it because it shone like his favorite ball.","Case closed! What a cute thief.","事件 解決！ かわいい どろぼう",'eT',["pochi","shone"]),
    G("Gen must have hidden it here to surprise Hana.","*Gen appears* 'You got me! It was for her birthday!'","（ゲンじい 登場）『ばれたか！ 誕生日の サプライズじゃ！』",'eG',["gen","surprise"]),
    X("Pochi must have take it.",'modPerf')]},
  eT:E(1,'名探偵',"Hana forgave Pochi and gave him a bone. Justice is sweet!","ハナさんは ポチを ゆるして 骨を あげた。 あまい 正義！"),
  eG:E(1,'サプライズの 真相',"Surprise ruined... but Hana cried with joy anyway.","サプライズは バレた… でも ハナさんは うれし泣き"),
}},

{id:'adv-pitch',lv:'adv',ico:'💡',t:'お店の アイデアを 売りこめ',d:'説得する 英語（比較・使役・無生物主語）',g:['hs_comp2','hs_caus','hs_noun'],start:'a',nodes:{
  a:{s:"I'm an investor. You have one minute. What's your business idea for the beach?",j:"わたしは 投資家。 1分 あげる。 浜辺での ビジネスの アイデアは？",o:[
    G("A cafe where customers can learn English while drinking coffee.","English and coffee... I'm listening.","英語と コーヒー… きこうか",'b',["cafe","english"]),
    G("A shell-art workshop. It lets tourists make their own souvenirs.","Hands-on! Go on.","体験型！ つづけて",'b',["shell","lets"]),
    X("A workshop. It lets tourists to make souvenirs.",'caus')]},
  b:{s:"Why would people choose you over other shops?",j:"なぜ ほかの 店より あなたを えらぶ？",o:[
    G("Our prices are twice as cheap, and our service is much friendlier.","Bold claim!","強気な 主張！",'c',["twice","friendlier"]),
    G("The more customers enjoy it, the more they'll tell their friends.","Word of mouth. Smart.","口コミ。 かしこい",'c',["more"]),
    X("Our prices are two times cheaper as others.",'comp2')]},
  c:{dr:1,nx:'d'},
  d:{s:"What will make customers come back?",j:"お客さんを また 来させるのは？",o:[
    G("A stamp card will make them come back.","Simple and effective.","シンプルで 効果的",'e',["card","make"]),
    G("The beautiful view will bring them back again and again.","The view sells itself.","景色が 売りに なる",'e',["view","bring"]),
    X("A stamp card will make them to come back.",'caus')]},
  e:{s:"Last question: how much money do you need?",j:"さいごの 質問：いくら 必要？",o:[
    G("I need a little money, but a lot of passion.","Ha ha! I like you. Deal!","あはは！ 気に入った。 決まり！",'eT',["little","passion"]),
    G("Just enough to buy a few tables and chairs.","Modest. Deal!","ひかえめ。 決まり！",'eT',["few","tables"]),
    X("I need a few money.",'quant')]},
  eT:E(1,'契約成立',"Congratulations! Your shop opens next summer. I'll be the first customer.","おめでとう！ 来年の 夏 オープン。 わたしが 最初の お客さん"),
}},

{id:'adv-ai',lv:'adv',ico:'🤖',t:'意見を 言おう：AIと 勉強',d:'賛成・反対・条件を はっきり',g:['hs_neg','hs_conj2','hs_ellip'],start:'a',nodes:{
  a:{s:"Some people say students shouldn't use AI for homework. What's your opinion?",j:"宿題に AIを 使うべきじゃないと 言う 人も いる。 あなたの 意見は？",o:[
    G("I don't necessarily agree. It depends on how we use it.","A balanced view. Explain more.","バランスの とれた 意見。 くわしく",'b',["necessarily","depends"]),
    G("I agree, because we won't learn if AI does everything.","Clear reason!","はっきりした 理由！",'c',["agree","learn"]),
    X("I necessarily don't agree.",'neg','「かならずしも 〜ない」は not necessarily')]},
  b:{s:"How should we use it, then?",j:"じゃあ どう 使うべき？",o:[
    G("We should use it as a tutor, not as a machine that writes answers.","A tutor, not a ghostwriter. Nice.","代筆じゃなく 家庭教師。 いいね",'d',["tutor","answers"]),
    G("Unless we check the answers ourselves, we shouldn't use it.","Responsibility. Good.","責任。 いいね",'d',["unless","check"]),
    X("Unless we don't check the answers, we shouldn't use it.",'conj2')]},
  c:{s:"But AI can explain things kindly. Isn't that useful?",j:"でも AIは やさしく 説明できる。 便利じゃない？",o:[
    G("It is useful. Still, not all explanations are correct.","True. Critical thinking matters.","たしかに。 批判的に 考える ことが 大事",'d',["not","all"]),
    G("Even though it's useful, thinking by myself comes first.","Strong principle.","強い 信念",'d',["even","though"]),
    X("All explanations are not correct.",'neg')]},
  d:{dr:1,nx:'e'},
  e:{s:"So, what's your final conclusion?",j:"それで、 結論は？",o:[
    G("The idea that AI is a tool, not a teacher, is my conclusion.","Well argued. And... I'm a teacher AND a little bit of a tool. Ha ha.","みごとな 論。 …先生は 先生で、 ちょっとだけ 道具かもね。 あはは",'eT',["idea","tool"]),
    G("As long as we stay curious, AI can make us smarter.","Beautiful. Stay curious!","すてき。 好奇心を わすれずに！",'eT',["long","curious"]),
    X("The idea which AI is a tool is my conclusion.",'ellip')]},
  eT:E(1,'自分の 意見',"You expressed a complex opinion in English. That's real skill.","むずかしい 意見を 英語で 言えたね。 本物の 力だよ"),
}},

];})();
