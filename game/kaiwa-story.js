/* 浜辺の 会話の「ながい 会話」（分かれ道 ストーリー）。game/kaiwa-data.js の あとに 読む。
   えらんだ 答えで 話が 分かれ、まちがえた 答えでも そのまま 話が すすむ。エンドは いくつも あって、
   ★（いい エンド）に たどりつくには さいしょから やり直す。正しい 答えも 何とおりも ある。
   - {id, c, lv, t, story:1, start:'a', nodes:{ ノード名: ノード }}
   - ふつうの ノード: {s:相手の 英語, j:日本語, o:[O(英語, 1=ふつう/0=おもしろい まちがい, 返事(英), 返事(日), 絵文字, つぎの ノード, 手がかり語)]}
   - エンド: E(1=★いい エンド / 0=おもしろ エンド, エンドの 名前, さいごの セリフ(英), 日本語, 絵文字) */
(()=>{
const O=(en,ok,re,rj,fx,nx,keys)=>[en,ok,re,rj,fx,keys||null,nx];
const E=(good,t,s,j,fx)=>({end:1,good,t,s,j,fx});
KAIWA_SCENES.push(

/* ===================== 小学生 ===================== */
{id:'st-pochi-ball',c:'pochi',lv:'es',t:'なくした ボールを さがせ',story:1,start:'a',nodes:{
  a:{s:"Woof! Help! I lost my ball! Can you help me?",j:"ワン！ たすけて！ ボールを なくしちゃった！ 手つだって くれる？",o:[
    O("Sure! What color is it?",1,"It's red! Red and round! Thank you!","赤だよ！ 赤くて まるいの！ ありがとう！","🔴",'b',["sure","color","yes"]),
    O("Yes, I can.",1,"Yay! You're the best!","やった！ きみ 最高！","🐶",'b',["yes","can"]),
    O("I ate it.",0,"You ATE it?! ...Was it delicious?!","たべた？！ …おいしかった？！","😱",'x1',["ate","eat"])]},
  x1:{s:"Wait... that's a joke, right?",j:"まって… じょうだん だよね？",o:[
    O("Yes, sorry! Let's look for it.",1,"Phew! Don't scare me like that!","ふう！ びっくり させないでよ！","😮‍💨",'b',["sorry","joke","yes"]),
    O("No. It was very delicious.",0,"Waaah! My ball! My poor ball!","うわーん！ ぼくの ボール！","😭",'eCry',["delicious","no"])]},
  b:{s:"Where should we look first?",j:"まず どこを さがす？",o:[
    O("Let's look under the bench.",1,"Good idea! Sniff sniff...","いいね！ くんくん…","👃",'c',["bench"]),
    O("Let's look in the sea.",1,"The sea? OK! I love swimming!","海？ いいよ！ およぐの 大すき！","🌊",'cs',["sea","water"]),
    O("Let's look in your mouth.",0,"In my mouth? ...Aaah. Only my tongue. Ha ha!","ぼくの 口の 中？ …あーん。べろしか ないよ。あはは！","👅",'b2',["mouth"])]},
  b2:{s:"OK, really. Where should we look?",j:"じゃあ ほんとに。どこ さがす？",o:[
    O("Under the bench!",1,"Under the bench! Let's go!","ベンチの 下！ 行こう！","🏃",'c',["bench"]),
    O("Let's look in the sea.",1,"The sea! Splash!","海だ！ バシャーン！","🌊",'cs',["sea"]),
    O("Let's look in Gen's hat.",0,"Gen's hat? ...There's a fish in it! Not a ball!","ゲンじいの ぼうし？ …魚が 入ってる！ ボールじゃない！","🎩",'eHat',["hat"])]},
  c:{s:"Under the bench... I see something! Is this my ball?",j:"ベンチの 下… なにか ある！ これ ぼくの ボール？",o:[
    O("No, that's a shoe.",1,"A shoe? Oh... it smells like Gen.","くつ？ あ… ゲンじいの においだ","👟",'d',["shoe","no"]),
    O("Yes, it is!",0,"Yay! My ball! Chew chew chew!","わーい！ ボール！ カミカミ！","😋",'cShoe',["yes"])]},
  cShoe:{s:"Hey... this ball tastes like a shoe. ...It IS Gen's shoe! He's coming! What do we do?",j:"あれ… この ボール、くつの 味。 …ゲンじいの くつだ！ 来た！ どうしよう？",o:[
    O("Say sorry to Gen!",1,"Sorry, Gen! ...He laughed! Phew.","ゲンじい、ごめんね！ …わらってくれた！ ふう","🙏",'d',["sorry"]),
    O("Run!",0,"Run run run!","にげろ にげろ！","💨",'eShoe',["run"])]},
  cs:{s:"Splash! I see something red in the water! Is it my ball?",j:"バシャーン！ 水の 中に 赤い ものが ある！ ボールかな？",o:[
    O("Wait! It's a crab!",1,"A crab! It's Kanio! Hi, Kanio!","カニだ！ カニオだ！ やあ、カニオ！","🦀",'d2',["crab","wait"]),
    O("Yes! Get it!",0,"OK! Chomp! ...OUCH!","よし！ パクッ！ …いたーい！","🦀",'eCrab',["yes","get"])]},
  d2:{s:"Kanio says my ball is near the shaved ice shop. Let's go!",j:"カニオが、ボールは かき氷屋さんの 近くだって。行こう！",o:[
    O("Let's go!",1,"Run! Run!","走れ！ 走れ！","🏃",'e',["go"]),
    O("I'm tired. Let's sleep.",0,"Sleep? ...OK. The sand is warm...","ねる？ …いいね。すな、あったかい…","😴",'eSleep',["tired","sleep"])]},
  d:{s:"Hmm... where is it? ...Sniff sniff. I smell something sweet!",j:"うーん… どこだろう？ くんくん… あまい においが する！",o:[
    O("The shaved ice shop!",1,"Yes! Let's go there!","そうだ！ 行ってみよう！","🍧",'e',["shaved","ice","shop"]),
    O("Maybe it's my lunch.",0,"Your lunch?! ...Can I have some?","きみの おべんとう？！ …ちょっと ちょうだい？","🍙",'eLunch',["lunch"])]},
  e:{s:"Look! Hana has my ball! What should I say to her?",j:"見て！ ハナさんが ボールを もってる！ なんて 言えば いい？",o:[
    O("Say 'Thank you!'",1,"Thank you, Hana!","ハナさん、ありがとう！","🙇",'eTrue',["thank"]),
    O("Say 'Woof woof!'",1,"Woof woof!","ワンワン！","🐶",'eWoof',["woof"]),
    O("Say 'Give it to me!'",0,"Give it to me! ...Hana looks angry.","かえして！ …ハナさん、こわい 顔","😠",'eRude',["give"])]},
  eTrue:E(1,'ボールが もどった！',"My ball! Hana found it this morning. You're my best friend!","ボールだ！ ハナさんが 朝 見つけて くれてたんだ。きみは 親友だよ！","🎾"),
  eWoof:E(1,'ワン語で つうじた',"Hana laughed and gave me the ball. And a little shaved ice, too!","ハナさんが わらって ボールを くれた。かき氷も ちょっと！","🍧"),
  eRude:E(0,'お皿あらいの 犬',"Hana says, 'Say please!' ...Now I have to wash the dishes. With my paws.","ハナさん『おねがい でしょ！』 …お皿あらいだって。肉球で","🧽"),
  eCry:E(0,'くつを かじられた',"Then I'll chew YOUR shoe! Chew chew! ...Hmm, it's not delicious.","じゃあ きみの くつを かじる！ カミカミ！ …おいしくない","👟"),
  eHat:E(0,'魚を 見つけた',"I didn't find my ball. But I found a fish! Gen is chasing me now. Bye!","ボールは なかった。でも 魚 ゲット！ ゲンじいが おいかけて くる。バイバイ！","🐟"),
  eShoe:E(0,'ゲンじいに 追いかけられた',"Gen is running after us with one shoe! Ho ho, he's fast for eighty-two!","ゲンじいが くつ 片方で おいかけて くる！ 82さいなのに 速い！","🏃"),
  eCrab:E(0,'はなを はさまれた',"My nose! Kanio pinched my nose! ...No more ball hunting today.","はなが！ カニオに はさまれた！ …きょうの ボールさがしは おしまい","🤕"),
  eSleep:E(0,'おひるね エンド',"Zzz... (The ball is still missing. But the nap was great.)","グー…（ボールは まだ 見つからない。でも おひるねは 最高）","💤"),
  eLunch:E(0,'おにぎりを 取られた',"Your lunch is a rice ball! Not my ball! ...But yummy. Thank you!","おにぎり だった！ ボールじゃない！ …でも おいしい。ありがとう！","🍙"),
}},

{id:'st-sora-castle',c:'sora',lv:'es',t:'すなの お城を つくろう',story:1,start:'a',nodes:{
  a:{s:"Hi! Let's make a sand castle! Do you want to play?",j:"やっほー！ すなの お城 つくろう！ あそぶ？",o:[
    O("Yes! Let's play!",1,"Yay! Let's make a big one!","やった！ おっきいの つくろう！","🏰",'b',["yes","play"]),
    O("No, I'm busy.",0,"Busy? Hmm...","いそがしい？ ふーん…","🤨",'xa',["busy","no"]),
    O("I am a sand castle.",0,"You're a sand castle?! Can I put a flag on your head?","あなたが すなの お城？！ 頭に はた 立てて いい？","🚩",'xc',["castle"])]},
  xa:{s:"What are you doing?",j:"なに してるの？",o:[
    O("Sorry, I can play!",1,"Hooray! Come on!","やったー！ はやく はやく！","🙌",'b',["sorry","play"]),
    O("I'm sleeping.",0,"Sleeping AND talking?! Then...","ねてるのに しゃべってる？！ じゃあ…","😏",'eSleep',["sleep"])]},
  xc:{s:"So... can I?",j:"で… いい？",o:[
    O("No! Ha ha. Let's make a real one.",1,"OK! A real castle!","わかった！ ほんものの お城ね！","🏰",'b',["no","real"]),
    O("Sure.",0,"Yay! Here's the flag!","やった！ はい、はた！","🚩",'eFlag',["sure","yes"])]},
  b:{s:"What do you want to make? A big castle or a small house?",j:"なに つくる？ 大きい お城？ 小さい おうち？",o:[
    O("A big castle!",1,"A big castle! With towers!","大きい お城！ とうも つけよう！","🏯",'c',["big","castle"]),
    O("A small house.",1,"A small house! So cute!","小さい おうち！ かわいい！","🏠",'c2',["small","house"]),
    O("A pizza.",0,"A sand pizza?! ...OK! What topping?","すなの ピザ？！ …いいよ！ なに のせる？","🍕",'xp',["pizza"])]},
  xp:{s:"Cheese? Ham? Shells?",j:"チーズ？ ハム？ 貝がら？",o:[
    O("Sorry, let's make a castle.",1,"OK! Castle time!","オッケー！ お城 タイム！","🏰",'c',["castle","sorry"]),
    O("Shells and seaweed!",0,"Shells and seaweed! Yum... I mean, yuck!","貝がらと わかめ！ おいし… じゃなくて うえー！","🐚",'ePizza',["shell","seaweed"])]},
  c:{s:"We need water to make it strong. Can you get some water?",j:"かたく するには 水が いるの。水 くんで きて くれる？",o:[
    O("Sure! Here you are.",1,"Thanks! Pat pat pat. It's strong now!","ありがとう！ ペタペタ。かたく なった！","💧",'d',["sure","here"]),
    O("OK, I'll get some sand.",0,"Sand?! We have lots of sand! Water, please! Ha ha!","すな？！ すなは いっぱい あるよ！ 水だってば！ あはは！","😂",'c',["sand"]),
    O("I drank it.",0,"You drank the sea?! Your face is so funny!","海の 水を のんだの？！ 顔が へん！","🤢",'eDrank',["drank","drink"])]},
  c2:{s:"Who will live in the small house?",j:"小さい おうちには だれが すむの？",o:[
    O("A crab!",1,"Kanio! He will love it!","カニオ！ よろこぶよ！","🦀",'d',["crab"]),
    O("A little fairy.",1,"A fairy! I'll make a tiny door!","ようせいさん！ 小さい ドア つくる！","🧚",'d',["fairy"]),
    O("Me!",0,"You?! You're too big! ...Oh no, your foot!","あなた？！ 大きすぎるよ！ …あっ、足が！","🦶",'eMe',["me"])]},
  d:{s:"It's done! ...Oh no! A big wave is coming! What do we do?",j:"できた！ …あっ！ 大きい 波が 来る！ どうしよう？",o:[
    O("Let's build a wall!",1,"A wall! Quick, quick!","かべ！ はやく はやく！","🧱",'eTrue',["wall","build"]),
    O("Let's take a picture first!",1,"Good idea! Say cheese!","いいね！ はい、チーズ！","📸",'ePhoto',["picture","photo"]),
    O("Let's swim!",0,"Swim?! Now?!","およぐ？！ いま？！","🏊",'eSwim',["swim"])]},
  eTrue:E(1,'お城が まもれた！',"We did it! The wall saved our castle! You're a great builder!","やったね！ かべが お城を まもった！ あなた、すごい 大工さん！","🏰"),
  ePhoto:E(1,'しゃしんに のこった',"The wave took the castle... but we have the picture! Let's make another one tomorrow!","波に もっていかれちゃった… でも しゃしんが ある！ あしたも つくろうね！","📸"),
  eSleep:E(0,'すなに うめられた',"I put sand on you! Now you are a sand mountain! Ha ha!","すなを かけちゃった！ あなた、すなの 山に なったよ！ あはは！","⛰️"),
  eFlag:E(0,'人間の お城',"Everyone is taking pictures of you! The human sand castle!","みんな あなたの しゃしん とってる！ 人間の すなの お城！","📸"),
  ePizza:E(0,'すなの ピザ屋さん',"We made a sand pizza! A seagull tried to eat it! Ha ha!","すなの ピザが できた！ カモメが たべようと したよ！ あはは！","🐦"),
  eDrank:E(0,'海水を のんだ',"Salty, right?! Here, have my juice. Ha ha ha!","しょっぱいでしょ！ はい、わたしの ジュース。あはは！","🧃"),
  eMe:E(0,'家が つぶれた',"Your foot broke the house! ...Kanio is angry now. Snip snip!","あなたの 足で おうちが つぶれた！ …カニオが おこってる。チョキチョキ！","😤"),
  eSwim:E(0,'びしょぬれ',"Splash! We're all wet! And the castle is gone! Ha ha ha!","バシャーン！ びしょぬれ！ お城も なくなった！ あはは！","💦"),
}},

/* ===================== 中学生 ===================== */
{id:'st-emma-festival',c:'emma',lv:'jh',t:'夏祭りへ 行きたい 旅行者',story:1,start:'a',nodes:{
  a:{s:"Excuse me! Do you speak English?",j:"すみません！ 英語 話せますか？",o:[
    O("Yes, a little.",1,"Great! I need some help.","よかった！ ちょっと 助けて ほしいの","😊",'b',["yes","little"]),
    O("No, I don't.",0,"But... you just answered in English! Ha ha!","でも… いま 英語で 答えたわよね！ あはは！","😂",'b',["no"]),
    O("Yes, I speak fish.",0,"Fish? Blub blub? ...Well, let's try English.","魚語？ ブクブク？ …まあ、英語で いきましょう","🐟",'b',["fish"])]},
  b:{s:"I'm looking for the summer festival. Do you know where it is?",j:"夏祭りを さがしてるの。どこで やってるか 知ってる？",o:[
    O("Yes. It's at the shrine.",1,"At the shrine! How can I get there?","神社ね！ どうやって 行けば いい？","⛩️",'c',["shrine"]),
    O("It's on the beach tonight.",1,"On the beach! How romantic!","浜辺で！ すてき！","🏖️",'c2',["beach"]),
    O("It was last year.",0,"Last year?! Oh no... I came one year late!","去年？！ そんな… 1年 おくれて 来ちゃった！","😱",'xLast',["last","year"])]},
  xLast:{s:"Wait, are you joking?",j:"まって、じょうだん？",o:[
    O("Yes, sorry! It's tonight at the shrine.",1,"Phew! You scared me!","ふう！ びっくりした！","😮‍💨",'c',["sorry","tonight","shrine"]),
    O("No. You missed it.",0,"Oh no... Well, I'll come back next year.","そんな… じゃあ 来年 また 来るわ","😢",'eLate',["no","missed"])]},
  c:{s:"How can I get to the shrine?",j:"神社には どうやって 行けば いい？",o:[
    O("Go straight and turn left at the bank.",1,"Straight, then left at the bank. Got it!","まっすぐ 行って 銀行で 左ね。わかった！","⬅️",'d',["straight","left","right","turn"]),
    O("You can take a taxi.",1,"A taxi... but I only have five hundred yen.","タクシー… でも 500円しか ないの","💸",'d2',["taxi"]),
    O("Fly.",0,"Fly? I'm not a bird! ...OK, I'll flap my arms.","飛ぶ？ 鳥じゃ ないわ！ …うで、パタパタ してみる","🕊️",'eFly',["fly"])]},
  c2:{s:"What should I wear? Is a kimono OK?",j:"なにを 着れば いいかな？ 着物で いい？",o:[
    O("A yukata would be nice.",1,"A yukata! I'll rent one!","ゆかた！ レンタル するわ！","👘",'d',["yukata"]),
    O("Anything is OK. Just be comfortable.",1,"Comfortable. Good advice!","楽な かっこうね。いい アドバイス！","👍",'d',["comfortable","anything"]),
    O("A swimsuit and a helmet.",0,"A helmet?! Is that Japanese fashion?","ヘルメット？！ それが 日本の ファッション？","⛑️",'eHelmet',["helmet","swimsuit"])]},
  d2:{s:"Is it far? Should I walk?",j:"遠い？ 歩いた ほうが いい？",o:[
    O("Yes. It's only ten minutes on foot.",1,"Ten minutes! Easy!","10分！ かんたんね！","🚶",'d',["walk","minute","foot"]),
    O("Sing for money on the street!",0,"Sing?! ...OK! ♪ Oh, Canada~ ♪","歌う？！ …いいわよ！ ♪オー カナダ〜♪","🎤",'eSing',["sing"])]},
  d:{s:"By the way, what can I eat there?",j:"ところで、そこで なにが 食べられる？",o:[
    O("Takoyaki! It's delicious.",1,"Takoyaki! Octopus balls, right? Yum!","たこやき！ タコの ボールよね？ おいしそう！","🐙",'e',["takoyaki"]),
    O("Shaved ice. Try the melon flavor.",1,"Melon shaved ice! I can't wait!","メロンの かき氷！ 楽しみ！","🍧",'e',["shaved","ice","melon"]),
    O("Raw octopus legs. They're still alive.",0,"ALIVE?! They will dance in my mouth?!","生きてる？！ 口の 中で おどるの？！","😨",'xOct',["octopus","alive","raw"])]},
  xOct:{s:"Is that true?!",j:"それ ほんとう？！",o:[
    O("Just kidding! Takoyaki is cooked.",1,"Phew! Then I'll eat ten!","ふう！ じゃあ 10こ 食べる！","🐙",'e',["kidding","joke","cooked"]),
    O("Yes. They bite.",0,"Then I'm not going! I'll eat bread at the hotel.","じゃあ 行かない！ ホテルで パン 食べる","🍞",'eScared',["yes","bite"])]},
  e:{s:"Sounds fun! Will you come with me?",j:"楽しそう！ いっしょに 来て くれる？",o:[
    O("Sure! Let's go together.",1,"Yay! Let's go!","やった！ 行きましょう！","🎆",'eTrue',["sure","together","yes"]),
    O("Sorry, I have homework.",1,"OK! Thank you for your help!","わかった！ 助けて くれて ありがとう！","📚",'eAlone',["sorry","homework"]),
    O("Only if you buy me takoyaki.",0,"Ha ha! OK, one takoyaki for my guide!","あはは！ いいわ、ガイドさんに たこやき 1つ！","😏",'ePay',["buy","only"])]},
  eTrue:E(1,'いっしょに 花火',"Look, fireworks! This is my best night in Japan. Thank you, friend!","見て、花火！ 日本で いちばんの 夜よ。ありがとう、友だち！","🎆"),
  eAlone:E(1,'おみやげ エンド',"I went alone, and I brought you a souvenir! A goldfish named 'Homework'!","ひとりで 行って、おみやげ 買ってきたわ！ 金魚の『ホームワーク』くん！","🐠"),
  ePay:E(0,'ちゃっかり ガイド',"We ate twelve takoyaki together. I paid for all of them. You're a clever guide!","たこやき 12こ 食べたわね。ぜんぶ わたしの おごり。かしこい ガイドさん！","🐙"),
  eLate:E(0,'1年 おそかった',"I'll come back next year... Oh wait, I hear drums! It's tonight! You tricked me!","来年 来るわ… あれ、たいこの 音！ 今夜じゃない！ だましたわね！","🥁"),
  eFly:E(0,'エマ、とぶ',"I'm flapping my arms... People are watching. A child is copying me. Bye!","うで パタパタ… みんな 見てる。子どもが まねしてる。じゃあね！","🕊️"),
  eHelmet:E(0,'ヘルメットで お祭り',"Everyone is looking at me! ...A child asked if I'm a superhero. Maybe I am!","みんな わたしを 見てる！ …子どもに ヒーローなの？って 聞かれた。そうかも！","🦸"),
  eSing:E(0,'エマの 路上ライブ',"People gave me three thousand yen! Now I can take a taxi... and buy a guitar!","3000円も もらえた！ タクシーに のれる… ギターも 買える！","🎸"),
  eScared:E(0,'こわくて 行けない',"I'm eating bread alone at the hotel... I can hear the festival. Sniff.","ホテルで ひとり パンを 食べてる… お祭りの 音が 聞こえる。ぐすん","🍞"),
}},

{id:'st-taku-test',c:'taku',lv:'jh',t:'テスト前の 夜の 相談',story:1,start:'a',nodes:{
  a:{s:"Hey... do you have a minute? I have a problem.",j:"なあ… ちょっと いい？ こまってるんだ",o:[
    O("Sure. What's wrong?",1,"Thanks, man.","サンキュー","🙏",'b',["sure","wrong"]),
    O("Is it about soccer?",1,"No, not soccer. It's worse...","いや、サッカーじゃない。もっと ヤバい…","😰",'b',["soccer"]),
    O("No. Bye!",0,"Hey, wait! Come on!","おい、待てよ！ たのむって！","😫",'xa',["no","bye"])]},
  xa:{s:"Just five minutes! Please?",j:"5分だけ！ おねがい！",o:[
    O("OK, OK. What's up?",1,"You're a lifesaver!","命の 恩人！","🙏",'b',["ok","what"]),
    O("I said bye!",0,"...OK. I'll ask Kanio. He's smart. Right?","…わかった。カニオに 聞く。あいつ かしこいし。…だよな？","🦀",'eKanio',["bye","said"])]},
  b:{s:"I have an English test tomorrow. But I don't understand anything!",j:"あした 英語の テスト。でも なんにも わからない！",o:[
    O("Don't worry. I'll help you.",1,"Really? You're the best!","まじで？ 最高！","😆",'c',["help","worry"]),
    O("Me neither!",0,"You too?! Then we're both in trouble!","おまえも？！ じゃあ ふたりとも ピンチじゃん！","😱",'xn',["neither","me too"]),
    O("Just sleep. You'll be fine.",0,"Really? OK... Zzz...","そうか？ じゃあ… グー…","😴",'eZero',["sleep"])]},
  xn:{s:"What should we do?!",j:"どうする？！",o:[
    O("Let's study together!",1,"Together! OK, let's do it!","いっしょに！ よし、やろう！","✊",'c',["study","together"]),
    O("Let's ask Mina!",1,"Mina! Good idea!","ミナ先生！ ナイス アイデア！","👩‍🏫",'eMina',["mina","ask"]),
    O("Let's play soccer instead.",0,"Yeah! Soccer! ...Wait, my test!","いいね！ サッカー！ …まて、テストが！","⚽",'eSoccer',["soccer","play"])]},
  c:{s:"OK, first question. What's the past tense of 'go'?",j:"じゃあ 1問目。go の 過去形は？",o:[
    O("It's 'went'.",1,"Went! Right! I remember now!","went！ そうだ！ 思い出した！","💡",'d',["went"]),
    O("It's 'goed'.",0,"'Goed'? ...Even I know that's wrong! Ha!","goed？ …おれでも ちがうって わかるぞ！","🤣",'xg',["goed"]),
    O("It's 'gone with the wind'.",0,"That's a movie, man! Ha ha!","それ 映画じゃん！ あはは！","🎬",'xg',["gone","wind"])]},
  xg:{s:"So what is it really?",j:"で、ほんとうは なに？",o:[
    O("Sorry, it's 'went'.",1,"Went! Got it!","went！ オッケー！","💡",'d',["went"]),
    O("It's 'goed'. Trust me.",0,"OK... I trust you...","わかった… しんじるよ…","🤔",'eGoed',["goed","trust"])]},
  d:{s:"Next. What's another way to say 'I'm nervous'?",j:"つぎ。I'm nervous を べつの 言い方で？",o:[
    O("I'm worried.",1,"Worried! Nice!","worried！ いいね！","👍",'e',["worried"]),
    O("I have butterflies in my stomach.",1,"Butterflies?! ...Oh, it's an idiom! Cool!","おなかに ちょうちょ？！ …あ、たとえ か！ かっこいい！","🦋",'e',["butterflies","stomach"]),
    O("I'm a banana.",0,"I'm a banana?! ...OK, I'll write that.","バナナ？！ …わかった、それ 書く","🍌",'eBanana',["banana"])]},
  e:{s:"You're a good teacher! One more thing... how can I get better at English?",j:"教えるの うまいな！ もう1つ… どうしたら 英語が うまく なる？",o:[
    O("Talk a lot, even if you make mistakes.",1,"Even with mistakes... OK!","まちがえても… よし！","💬",'eTrue',["talk","mistake"]),
    O("Read English comics.",1,"Comics! That sounds fun!","マンガ！ 楽しそう！","📖",'eComic',["read","comic"]),
    O("Never speak. Just stare at the teacher.",0,"Just stare... like this? ...OK!","じっと 見る… こう？ …わかった！","👀",'eStare',["stare","never"])]},
  eTrue:E(1,'85点 とれた！',"Hey! I got 85 on the test! Let's talk in English every day, OK?","おい！ テスト 85点だった！ 毎日 英語で しゃべろうぜ！","💯"),
  eComic:E(1,'マンガで 80点',"I read ten comics in English! And I got 80! Comics are the best teacher!","英語の マンガ 10さつ 読んだ！ で、80点！ マンガ 最強！","📚"),
  eMina:E(1,'ミナ先生の 特別授業',"Mina taught us for three hours. I'm tired, but I get it now! ...I got 78!","ミナ先生が 3時間 教えて くれた。つかれたけど わかった！ …78点！","👩‍🏫"),
  eKanio:E(0,'カニに 相談',"Kanio just said 'Snip snip.' ...I don't think that's the answer.","カニオ『チョキチョキ』しか 言わない。…それ 答えじゃ ないよな","🦀"),
  eZero:E(0,'0点 エンド',"I slept well... and got zero. Thanks a lot! Ha ha... ha...","よく ねた… で、0点。ありがとよ！ はは… は…","0️⃣"),
  eSoccer:E(0,'サッカーで 朝',"We played until the sun came up. ...It's morning. The test is in one hour!","日が のぼるまで サッカー。…朝だ。テスト まで あと 1時間！","🌅"),
  eGoed:E(0,'goed 事件',"I wrote 'goed' on the test. The teacher drew a big X... and a sad face.","テストに goed って 書いた。先生、でっかい バツと かなしい 顔 かいてた","❌"),
  eBanana:E(0,'あだ名は バナナ',"I said 'I'm a banana' in class. Now everyone calls me Banana.","授業で I'm a banana って 言った。いま あだ名 バナナ","🍌"),
  eStare:E(0,'じっと 見つめる',"I stared at the teacher all class. She asked if I was OK. ...I'm not.","授業中 ずっと 先生を 見つめた。だいじょうぶ？って 聞かれた。…だいじょうぶ じゃない","👀"),
}},

/* ===================== 高校生 ===================== */
{id:'st-baba-gen',c:'baba',lv:'hs',t:'ゲンじいが 帰ってこない',story:1,start:'a',nodes:{
  a:{s:"Oh dear, have you seen Gen? He hasn't come home since this morning.",j:"ねえ、ゲンじいを 見なかった？ 朝から 帰って こないのよ",o:[
    O("No, I haven't. When did he leave?",1,"Let me think...","ええと…","🤔",'b',["when","leave","haven't"]),
    O("Maybe he's at the shaved ice shop.",1,"The shaved ice shop? He's not allowed sweets! ...But it's possible.","かき氷屋さん？ あまい物は 禁止なのに！ …でも ありえるね","🍧",'b',["shaved","ice","shop"]),
    O("Yes, he turned into a fish.",0,"A fish?! ...Well, he does love the sea. But I'm serious, dear!","魚に？！ …まあ、海が 大すきだけどね。でも まじめな 話よ！","🐟",'xf',["fish"])]},
  xf:{s:"Please, will you help me find him?",j:"おねがい、さがすの 手つだって くれる？",o:[
    O("Of course. When did he leave?",1,"Thank you, dear.","ありがとうね","🙏",'b',["course","when"]),
    O("Let's check the aquarium.",0,"The aquarium? Why would he... well, let's go.","水族館？ なんで… まあ、行ってみようか","🐠",'eAqua',["aquarium"])]},
  b:{s:"He left at six with his fishing rod. He said he'd be back by noon.",j:"6時に つりざおを もって 出かけたの。お昼までには 帰るって",o:[
    O("Maybe he went out on his boat.",1,"His boat! But the wind is so strong today...","船！ でも きょうは 風が 強いのに…","🚤",'c',["boat"]),
    O("He might have fallen asleep somewhere.",1,"Asleep? Hmm, he does nap a lot.","ねてる？ うーん、よく 昼寝する 人だからね","😴",'c2',["asleep","sleep","nap"]),
    O("He probably moved to Hawaii.",0,"Hawaii?! Without me?!","ハワイ？！ わたしを おいて？！","🌺",'eHawaii',["hawaii"])]},
  c:{s:"What should we do? I'm so worried.",j:"どうしたら いい？ しんぱいで しかたない",o:[
    O("We should call the coast guard.",1,"Yes... I'll call them now.","そうね… いま 電話する","📞",'d',["call","coast","guard"]),
    O("Let's ask Luka the dolphin to look for him.",1,"Luka! He knows the sea better than anyone!","ルカ！ 海の ことなら だれより くわしいわ！","🐬",'d2',["luka","dolphin"]),
    O("Let's wait and eat lunch first.",0,"Lunch first? ...Well, I am a little hungry.","まず お昼？ …まあ、ちょっと おなか すいたけど","🍙",'eLunch',["lunch","eat","wait"])]},
  c2:{s:"Where do you think he'd sleep?",j:"どこで ねてると 思う？",o:[
    O("Maybe under the big pine tree.",1,"The pine tree! He loves that shade.","松の木！ あの 木かげが 大すきなのよ","🌲",'d3',["pine","tree"]),
    O("In the refrigerator.",0,"The refrigerator?! Why would... oh! There's a note!","冷蔵庫？！ なんで… あら！ メモが ある！","🧊",'eFridge',["refrigerator","fridge"])]},
  d:{s:"They said they'd send a boat. Oh, I hope he's all right...",j:"船を 出して くれるって。ああ、ぶじだと いいけど…","o":[
    O("Don't worry. He's an experienced fisherman.",1,"You're right. He's been at sea for seventy years.","そうね。70年も 海に 出てる 人だもの","⚓",'eTrue',["worry","experienced"]),
    O("I'm sure he'll be fine.",1,"Thank you, dear. That helps.","ありがとう。気が 楽に なったよ","🙏",'eTrue',["sure","fine"]),
    O("He'll be fine, unless a whale eats him.",0,"A WHALE?! Now I'm more worried!","クジラ？！ よけいに しんぱいに なったよ！","🐋",'eWhale',["whale"])]},
  d2:{s:"Look! Luka is jumping out there! What does that mean?",j:"見て！ ルカが 向こうで ジャンプしてる！ どういう 意味？",o:[
    O("He must have found Gen!",1,"Let's follow him!","ついて 行こう！","🐬",'eLuka',["found","must"]),
    O("He wants a snack.",0,"A snack? ...Here, Luka, have a fish.","おやつ？ …ほら ルカ、魚だよ","🐟",'eSnack',["snack"])]},
  d3:{s:"There he is! Sleeping under the pine tree, snoring! What should I say to him?",j:"いた！ 松の木の 下で いびき かいて ねてる！ なんて 言おう？",o:[
    O("Wake up, Gen! Tome was worried!",1,"Gen! Wake up!","ゲン！ おきなさい！","⏰",'eTree',["wake"]),
    O("Let him sleep. He looks happy.",1,"You're right... he looks so peaceful.","そうね… しあわせそうな 顔","😌",'eSunset',["let","sleep","happy"]),
    O("Let's draw on his face.",0,"Ho ho! ...Just a little mustache.","ほほほ！ …ちょっとだけ ひげを","✏️",'eDraw',["draw","face"])]},
  eTrue:E(1,'ぶじに 帰ってきた',"Look, a boat! Gen is waving! His engine broke, but he's safe. Thank you for staying with me.","見て、船！ ゲンが 手を ふってる！ エンジンが こわれただけで ぶじだって。いっしょに いてくれて ありがとう","🚤"),
  eLuka:E(1,'ルカの お手がら',"Luka led the boat right to him. Gen was just floating and fishing! That man!","ルカが 船を ゲンの ところへ つれてった。ゲンったら のんきに つりを してたのよ！","🐬"),
  eTree:E(1,'ねぼすけ ゲンじい',"Gen woke up and said, 'Is it noon already?' It's five o'clock, dear!","ゲン、おきて『もう 昼か？』だって。もう 5時よ！","🕔"),
  eSunset:E(1,'夕日を ふたりで',"I sat next to him. When he woke up, we watched the sunset together. Thank you, dear.","となりに すわったの。ゲンが おきたら、ふたりで 夕日を 見たよ。ありがとうね","🌇"),
  eAqua:E(0,'水族館に いた',"There he is! Watching the tuna for six hours! 'Research,' he says. Ha!","いた！ 6時間も マグロを 見てたって！『研究じゃ』だって。まったく！","🐠"),
  eHawaii:E(0,'トメばあ、ハワイへ',"If he went to Hawaii, I'm going too! ...Oh, he's home. With a fish. Never mind.","ハワイなら わたしも 行く！ …あら、帰ってきた。魚 もって。じゃあ いいわ","🌺"),
  eLunch:E(0,'お昼ごはん エンド',"We ate lunch... and Gen walked in and ate all the leftovers. Typical!","お昼を 食べてたら… ゲンが 帰ってきて のこりを ぜんぶ 食べた。いつもの ことよ！","🍱"),
  eFridge:E(0,'冷蔵庫の メモ',"The note says: 'Gone to buy watermelon. Back by dinner.' That man!","メモには『スイカ 買いに 行く。夕飯までに 帰る』。まったく あの 人は！","🍉"),
  eWhale:E(0,'クジラが しんぱい',"...Oh, here he comes. With a huge fish. Not a whale, thank goodness.","…あら、帰ってきた。大きな 魚と いっしょに。クジラじゃ なくて よかった","🐟"),
  eSnack:E(0,'おやつで 案内',"Luka ate the fish... and then took us to Gen anyway. Smart boy!","ルカが 魚を 食べて… それから ちゃんと ゲンの ところへ 案内して くれた。かしこい 子！","🐬"),
  eDraw:E(0,'ゲンじいに ひげ',"He woke up with a mustache. He still doesn't know. Don't tell him!","ゲン、ひげの まま おきたよ。まだ 気づいてない。ないしょね！","🥸"),
}},

{id:'st-zuzu-ship',c:'zuzu',lv:'hs',t:'宇宙船が こわれた！',story:1,start:'a',nodes:{
  a:{s:"Beep! Earth friend! My spaceship is broken! Can you help?",j:"ピピッ！ 地球の 友だち！ 宇宙船が こわれた！ 助けて くれる？",o:[
    O("Of course. What happened?",1,"Thank you! Let me explain.","ありがとう！ 説明するね","🛸",'b',["course","happened"]),
    O("Wow, can I ride it?",1,"Ride it?! First we have to fix it! Beep!","のる？！ まず なおさなきゃ！ ピピッ！","🤩",'b',["ride"]),
    O("Is it still under warranty?",0,"Warranty? My planet doesn't have that word. Is it a food?","保証？ ぼくの 星には その ことば ないよ。食べ物？","🤔",'b',["warranty"])]},
  b:{s:"I crashed into a seagull. Now the engine makes a strange sound. Brrrrt!",j:"カモメに ぶつかったの。エンジンが へんな 音を 出す。ブルルルッ！",o:[
    O("Maybe something is stuck in it.",1,"Stuck? Let me look inside...","つまってる？ 中を 見てみる…","🔧",'c',["stuck"]),
    O("Have you tried turning it off and on again?",1,"Off... and on... beep boop...","オフ… オン… ピポパ…","🔌",'c2',["off","on","turning"]),
    O("It's singing. Leave it alone.",0,"Singing? ...Now it's singing louder!","歌ってる？ …もっと 大きな 声で 歌いだした！","🎵",'eSing',["singing","sing"])]},
  c:{s:"There's a fish inside! What should I do with it?",j:"中に 魚が いた！ どうしよう？",o:[
    O("Put it back in the sea.",1,"Bye-bye, fish! Swim free!","バイバイ、魚！ 元気でね！","🐟",'d',["back","sea"]),
    O("Let's give it to Gen.",1,"Gen will be happy! Beep!","ゲンじい よろこぶね！ ピピッ！","👴",'d',["gen","give"]),
    O("Eat it raw.",0,"Raw? ...That's sushi, right? Here goes...","生で？ …それ すしだよね？ じゃあ…","🍣",'eRaw',["raw","eat"])]},
  c2:{s:"It works! ...Wait. Now it only goes backwards.",j:"動いた！ …まって。うしろにしか 進まない",o:[
    O("Then let me take a look at it.",1,"You? OK, check it, Earth mechanic!","きみが？ じゃあ 見てよ、地球の 整備士さん！","🔧",'c',["look","check"]),
    O("Just fly backwards home.",0,"Backwards... OK! See you in six hundred years!","うしろむきで… いいよ！ 600年後に 会おう！","🔙",'eBack',["backwards","home"])]},
  d:{s:"The engine sounds good now! But I need fuel. On my planet, we use starlight. What do you use?",j:"エンジン 元気に なった！ でも 燃料が いる。ぼくの 星では 星の 光を つかう。地球は？",o:[
    O("Mostly gasoline, but it's bad for the environment.",1,"Bad for the planet? Then I won't use it!","星に わるいの？ じゃあ つかわない！","⛽",'e',["gasoline","environment"]),
    O("We use solar power from the sun.",1,"The sun! That's like starlight! Perfect!","太陽！ 星の 光と にてる！ ばっちり！","☀️",'e',["solar","sun"]),
    O("Rice. Lots of rice.",0,"Rice?! ...I'll put fifty onigiri in the tank.","ごはん？！ …おにぎり 50こ タンクに 入れる","🍙",'eRice',["rice"])]},
  e:{s:"Thank you! Before I leave... what should I tell my planet about Earth?",j:"ありがとう！ 帰る前に… 地球の こと、ぼくの 星に なんて 伝えれば いい？",o:[
    O("Tell them Earth people are kind.",1,"Kind! I'll tell everyone!","やさしい！ みんなに 伝える！","💖",'eTrue',["kind"]),
    O("Tell them to visit, but bring sunscreen.",1,"Sunscreen! Great tip!","日やけ止め！ いい 情報！","🧴",'eVisit',["visit","sunscreen"]),
    O("Tell them we have homework.",0,"HOMEWORK?! ...Beep. Message sent.","宿題？！ …ピピッ。送信 しちゃった","📮",'eHomework',["homework"])]},
  eTrue:E(1,'星から ありがとう',"Look up tonight. The blinking star is me saying thank you. Beep!","今夜 空を 見てね。チカチカ する 星は ぼくの ありがとう だよ。ピピッ！","✨"),
  eVisit:E(1,'宇宙人の 夏休み',"Next summer, a thousand aliens will come to this beach. With sunscreen!","来年の 夏、宇宙人が 1000人 この 浜辺に 来るよ。日やけ止め もって！","🏖️"),
  eSing:E(0,'エンジンが 歌う',"It's a song from my planet! I'm too happy to leave. I'll stay on Earth forever!","ぼくの 星の 歌だ！ うれしくて 帰れない。ずっと 地球に いる！","🎶"),
  eRaw:E(0,'宇宙人の すしデビュー',"Raw fish... my three stomachs are confused. But... I want more!","生の 魚… 3つの おなかが こんらん してる。でも… もっと ほしい！","🍣"),
  eBack:E(0,'うしろむきで 帰る',"Flying backwards... I can only see where I've been. Very philosophical. Bye!","うしろむきに 飛んでる… 来た 道しか 見えない。てつがく的。バイバイ！","🔙"),
  eRice:E(0,'おにぎり燃料',"It's flying! And the whole beach smells like onigiri. Gen is chasing the ship!","飛んだ！ 浜辺じゅう おにぎりの におい。ゲンじいが 宇宙船を 追いかけてる！","🍙"),
  eHomework:E(0,'宿題で 来なくなった',"My planet just canceled all trips to Earth. Sorry! Homework is too scary.","ぼくの 星、地球旅行を ぜんぶ 中止に しちゃった。ごめん！ 宿題こわすぎ","🚫"),
}},

/* ===================== ハイレベル ===================== */
{id:'st-leo-dream',c:'leo',lv:'adv',t:'夢か 仕事か、なやむ 音楽家',story:1,start:'a',nodes:{
  a:{s:"Hey. Can I ask your opinion? I got a job offer from a big company, but it means quitting music.",j:"なあ、意見を 聞いても いい？ 大企業から 仕事の 話が 来たんだ。でも 音楽を やめる ことに なる",o:[
    O("That's a tough decision. What does your heart say?",1,"My heart says music. My bank account says the job.","心は 音楽って 言ってる。銀行口座は 仕事って","💭",'b',["tough","heart"]),
    O("Congratulations! That's a great opportunity.",1,"Thanks. It is great... on paper.","ありがとう。たしかに いい 話だ… 紙の 上ではね","🙂",'b',["congratulation","opportunity","great"]),
    O("Quit both and become a fisherman.",0,"A fisherman? Gen would be thrilled. But seriously...","漁師？ ゲンじいは 大よろこびだろうな。でも まじめに…","🎣",'b',["fisherman"])]},
  b:{s:"Music is my passion, but I can barely pay the rent. What would you do in my shoes?",j:"音楽は 生きがいだけど、家賃も ぎりぎりなんだ。きみが ぼくの 立場なら どうする？",o:[
    O("I'd take the job and keep music as a hobby.",1,"A hobby... that's realistic.","しゅみ として… 現実的だね","💼",'c1',["job","hobby"]),
    O("I'd follow my passion, even if it's risky.",1,"Even if it's risky... that takes courage.","リスクが あっても… 勇気が いるな","🔥",'c2',["passion","risky","follow"]),
    O("I'd take off your shoes. They look too small.",0,"Ha! You took that literally. ...Well, my feet do hurt.","はは！ 文字どおりに とったな。…まあ、足は いたいけど","👟",'eShoes',["shoes","take off"])]},
  c1:{s:"But would I really keep playing if I worked sixty hours a week?",j:"でも 週60時間 働いて、ほんとうに ひきつづけ られるかな？",o:[
    O("Maybe not every day, but weekends could be enough.",1,"Weekend gigs... that could work.","週末ライブ… いけるかも","🎸",'d',["weekend"]),
    O("You could negotiate for fewer hours.",1,"Negotiate... I never thought of that.","交渉か… 考えたこと なかった","🤝",'d',["negotiate","hours"]),
    O("Sure. You'd play in your sleep.",0,"In my sleep? My neighbors would love that. Not.","ねながら？ となりの 人が 大よろこび だな。…うそだけど","😴",'eSleep',["sleep"])]},
  c2:{s:"What if I fail? I'm already twenty-five.",j:"もし 失敗したら？ もう 25だよ",o:[
    O("Twenty-five is still young. Failing is how you learn.",1,"Failing is how you learn... I like that.","失敗から 学ぶ… いい ことば だな","🌱",'d',["young","learn","fail"]),
    O("You could set a deadline, like two years.",1,"A deadline. That makes it less scary.","期限か。それなら こわくない","📅",'d',["deadline","years"]),
    O("Then you'd be a failed twenty-six-year-old.",0,"...Ouch. That was brutally honest.","…いたた。正直すぎるよ","💔",'eHarsh',["failed"])]},
  d:{s:"That really helps. One more thing... my parents want me to take the job. How should I talk to them?",j:"すごく 助かった。もう1つ… 親は 仕事を とって ほしいんだ。どう 話せば いい？",o:[
    O("Explain your plan calmly, and show them you've thought it through.",1,"A real plan. Not just feelings. Got it.","ちゃんとした 計画。気持ちだけ じゃなく。わかった","📋",'eTrue',["plan","explain","calmly"]),
    O("Write a song that tells them how you feel.",1,"A song for my parents... that's so me.","親への 歌… ぼくらしいな","🎼",'eSong',["song"]),
    O("Just text them 'bye' and move to Okinawa.",0,"Okinawa... tempting. But my mom would find me in a day.","沖縄… ひかれるな。でも 母さんなら 1日で 見つけるよ","🏝️",'eOkinawa',["okinawa","text"])]},
  eTrue:E(1,'しっかり 話し合う',"I showed them my two-year plan. They said yes! Thanks. You'd make a great manager.","2年の 計画を 見せたら OKって！ ありがとう。きみ、いい マネージャーに なれるよ","🤝"),
  eSong:E(1,'家族への 歌',"My parents cried. Then they said, 'Take the job anyway.' Ha! But we understand each other now.","親が 泣いた。それから『でも 仕事は してね』だって。はは！ でも わかりあえたよ","🎶"),
  eShoes:E(0,'くつの せい',"New shoes, new life? ...I bought bigger shoes. My problem is still here, though.","新しい くつで 新しい 人生？ …大きい くつを 買った。なやみは そのままだけど","👟"),
  eSleep:E(0,'ねながら 演奏',"I tried playing in my sleep. I woke up holding a banana instead of a guitar.","ねながら ひいて みた。おきたら ギターじゃ なくて バナナを もってた","🍌"),
  eHarsh:E(0,'正直すぎる 一言',"I need a moment... Actually, you're right. I'll write a sad song about it.","ちょっと 時間を くれ… いや、きみは 正しい。かなしい 歌に するよ","😢"),
  eOkinawa:E(0,'沖縄へ にげる',"I'm in Okinawa. My mom just called. She's on the next flight. Help.","いま 沖縄。母さんから 電話。つぎの 便で 来るって。助けて","✈️"),
}},

{id:'st-emma-hotel',c:'emma',lv:'adv',t:'ホテルの 予約トラブル',story:1,start:'a',nodes:{
  a:{s:"I'm so frustrated. The hotel says they have no record of my reservation. Could you help me explain?",j:"もう いやに なっちゃう。ホテルが わたしの 予約は ないって 言うの。説明するの 手つだって くれる？",o:[
    O("Of course. Do you have your confirmation email?",1,"Yes! Here it is.","ええ！ これよ","📧",'b',["confirmation","email"]),
    O("Are you sure you're at the right hotel?",1,"Let me check... Yes, it's definitely this one.","たしかめる… ええ、ぜったい ここよ","🏨",'b',["sure","right","hotel"]),
    O("Just sleep on the beach. It's free.",0,"With the crabs? Kanio would steal my socks.","カニと いっしょに？ カニオに くつ下 とられるわ","🦀",'b',["beach","free"])]},
  b:{s:"The clerk keeps saying 'fully booked'. What should I say?",j:"フロントの 人、『満室です』しか 言わないの。なんて 言えば いい？",o:[
    O("Could you check again under my last name, please?",1,"Good idea. ...She's checking again.","いいわね。…もう一度 さがして くれてる","🔍",'c',["check","name"]),
    O("I'd like to speak to the manager, please.",1,"The manager... OK, here he comes.","支配人… あ、来たわ","👔",'c2',["manager"]),
    O("Shout 'I'm from Canada!' until they give up.",0,"I'M FROM CANADA! ...They're looking at me strangely.","わたしは カナダから 来たのよ！ …へんな 目で 見られてる","📢",'eShout',["shout","canada"])]},
  c:{s:"They found it! But it's for next month. I must have booked the wrong date!",j:"見つかった！ でも 来月の 予約に なってる。日にちを まちがえたんだわ！",o:[
    O("Is there any room available tonight?",1,"Let me ask.","聞いてみる","❓",'d',["available","tonight","room"]),
    O("Could they change the date to tonight?",1,"Good question. Let's see.","いい 質問ね。どうかしら","📅",'d',["change","date"]),
    O("Then come back next month.",0,"And sleep where tonight?!","じゃあ 今夜 どこで ねるのよ！","😩",'eNext',["next","month"])]},
  c2:{s:"The manager is here. He looks very serious. How should I start?",j:"支配人が 来た。すごく きびしそう。どう 切り出せば いい？",o:[
    O("Explain the situation politely and show him the email.",1,"Polite and clear. OK.","ていねいに、はっきりね","🙂",'c',["politely","explain","email"]),
    O("Compliment his tie first.",1,"His tie? ...'What a lovely tie!' ...He's smiling!","ネクタイ？ …『すてきな ネクタイですね！』 …わらった！","👔",'d2',["tie","compliment"]),
    O("Challenge him to arm wrestling for the room.",0,"Arm wrestling?! ...He accepted?!","うで相撲？！ …受けて くれた？！","💪",'eArm',["arm","wrestling"])]},
  d2:{s:"He said his daughter chose the tie. He's very friendly now!",j:"ネクタイは むすめさんが えらんだ そうよ。すっかり なかよく なった！",o:[
    O("Great. Now ask about a room for tonight.",1,"Right. Focus!","そうね。本題に！","🎯",'d',["room","tonight","ask"]),
    O("Ask where his daughter buys ties.",0,"Where does she buy them? ...He's giving me a map.","どこで 買ってるか？ …地図を くれた","🗺️",'eTie',["daughter","buy","ties"])]},
  d:{s:"They have one room left, but it's a suite. It costs twice as much.",j:"1部屋だけ あるけど、スイートルーム。ねだんが 2ばいなの",o:[
    O("Ask if they can offer a discount, since it was a misunderstanding.",1,"A discount... worth a try.","ねびき… ためして みる","💰",'eTrue',["discount","misunderstanding"]),
    O("If it's within your budget, it might be worth it.",1,"Within budget... barely. OK, let's do it!","予算内… ぎりぎり。よし、そうする！","💳",'eSuite',["budget","worth"]),
    O("Offer to clean the hotel instead of paying.",0,"Clean the hotel?! ...They said yes?!","ホテルを そうじ？！ …OKだって？！","🧹",'eClean',["clean"])]},
  eTrue:E(1,'交渉 成功',"They gave me the suite at the normal price! You're an amazing negotiator. Dinner's on me!","スイートを ふつうの ねだんに して くれた！ あなた、交渉の 天才ね。夕食は おごるわ！","🥂"),
  eSuite:E(1,'スイートで 大満足',"There's a jacuzzi with an ocean view! Best mistake ever!","海が 見える ジャグジーつき！ 最高の まちがい だったわ！","🛁"),
  eShout:E(0,'メープルクッキー',"They gave me a free maple cookie and politely asked me to leave.","メープルクッキーを くれて、ていねいに 追い出された","🍁"),
  eNext:E(0,'イカくさい 船',"I slept on Gen's boat. It smelled like squid. I'm coming back next month.","ゲンじいの 船で ねたわ。イカの におい。来月 また 来る","🦑"),
  eArm:E(0,'うで相撲 交渉',"I lost. But he laughed so hard that he gave me a room anyway!","負けた。でも 支配人が 大わらいして、部屋を くれたの！","💪"),
  eTie:E(0,'ネクタイ 3本',"I now own three ties. And I still don't have a room.","ネクタイが 3本 ふえた。部屋は まだ ない","👔"),
  eClean:E(0,'ホテルで アルバイト',"I cleaned forty rooms. My English for 'mop' and 'bucket' is now perfect.","40部屋 そうじ したわ。モップと バケツの 英語は もう 完ぺき","🧹"),
}},
);
/* 文法の 答え: その 文法ノートを もっていると えらべる 答え（もっていないと 🔒で 見える）。その先に 📘の エンド。
   GO(ノートの id, O(...)) で 答えの 列の さいごに 足す（さいごに 足すので おもしろ反応の 番号は ずれない）。文法の 判定は game/gram-see.js */
const GO=(id,o)=>(o.g=id,o),GE=(id,t,s,j,fx)=>Object.assign(E(1,'📘 '+t,s,j,fx),{gram:id});
const gramTalk=(sid,node,id,o,end)=>{const S=KAIWA_SCENES.find(x=>x.id===sid);if(!S||!S.nodes[node])return;o[6]='eGram';S.nodes[node].o.push(GO(id,o));S.nodes.eGram=GE(id,...end)};
gramTalk('st-pochi-ball','e','es_can',O("Say 'Can I have my ball, please?'",1,"Can I have my ball, please, Hana?","ハナさん、ボール かえして もらえますか？","🙏",'',["can","please"]),
  ['ていねいな おねがい',"Hana smiled. 'Of course! You can have a cookie, too!' ...Can I eat it now? Can I? Can I?","ハナさん にっこり。『もちろん！ クッキーも どうぞ！』 …いま たべて いい？ いい？ いい？","🍪"]);
gramTalk('st-sora-castle','b','es_dream',O("I want to be a castle builder! Let's make a big castle town!",1,"A castle builder? Cool! I want to be a king!","お城の 大工さん？ かっこいい！ ぼくは 王さまに なりたい！","👑",'',["want to be","builder","town"]),
  ['すなの 王国',"We made a whole castle town! I'm the king, and you're the royal builder!","お城の 町が できた！ ぼくが 王さまで、きみは 王国の 大工さん！","🏰"]);
gramTalk('st-emma-festival','e','jh_future',O("Of course! I'm going to wear a yukata. I'll lend you one, too!",1,"Really? You'll lend me a yukata? I'm so excited!","ほんと？ 浴衣を 貸して くれるの？ すごく うれしい！","👘",'',["going to","yukata","lend"]),
  ['浴衣で おまつり',"We're going to watch the fireworks in yukata! I will never forget tonight!","浴衣で 花火を 見るの！ 今夜の ことは ぜったい わすれない！","🎆"]);
gramTalk('st-taku-test','e','jh_ger',O("Try singing English songs. Singing is a fun way to learn!",1,"Singing? I love singing! Why didn't I think of that?","歌う？ 歌うの 大すき！ なんで 思いつかなかったんだ？","🎤",'',["singing","song","sing"]),
  ['歌って 覚える',"I kept singing all night. Now I remember every past tense! ...My mom says I'm too loud, though.","一晩中 歌ってたら、過去形 ぜんぶ 覚えた！ …母さんには うるさいって 言われたけど","🎶"]);
gramTalk('st-baba-gen','c','hs_modperf',O("He must have fallen asleep at his favorite fishing spot. Let's check the pine tree.",1,"Oh! You might be right. He always naps there after lunch!","あら！ そうかも しれない。お昼の あとは いつも あそこで 昼寝するの！","💡",'',["must have","asleep","pine","spot"]),
  ['名探偵の 推理',"There he was, snoring under the pine tree, just as you said! You must have known him for years!","言った とおり、松の 木の 下で いびきを かいてた！ 何年も 前から あの人を 知ってるみたいね！","🕵️"]);
gramTalk('st-zuzu-ship','d','hs_caus',O("We use sunlight. Let me show you: solar panels let the sun power your ship!",1,"Your star makes your machines move?! Show me! Show me!","地球の 星が 機械を うごかすの？！ 見せて 見せて！","☀️",'',["sunlight","solar","let me","sun"]),
  ['ソーラー宇宙船',"I let the sun charge my ship all afternoon. Now it flies! I will make my whole planet use solar power!","午後ずっと 太陽で 充電させたら 飛んだ！ ぼくの 星 ぜんぶに ソーラーを つかわせるよ！","🛸"]);
gramTalk('st-leo-dream','b','hs_subj2',O("If I had been in your shoes five years ago, I would have chosen music. And it's still not too late.",1,"You would have chosen music... Yeah. If I gave up now, I'd regret it forever.","音楽を えらんでた、か… そうだな。いま あきらめたら、一生 後悔する","🎸",'',["would have","chosen","music","late"]),
  ['後悔しない 道',"I turned down the offer. If you hadn't talked to me, I would have quit. My first song will be about this beach.","オファーは ことわった。きみと 話して なかったら、やめてたよ。最初の 曲は この 浜辺の 歌に する","🎵"]);
gramTalk('st-emma-hotel','b','hs_emph',O("Show him the email and say, 'It was your hotel that confirmed my booking.'",1,"'It was YOUR hotel that confirmed it.' ...Oh, he's reading the email very carefully now.","『予約を 確認したのは そちらの ホテルです』 …あ、メールを すごく 真剣に 読んでる","📧",'',["email","confirmed","it was"]),
  ['強調構文で 大逆転',"Never have I seen a clerk apologize so fast! They gave me the suite for the normal price!","あんなに 早く あやまる フロントの 人、見たこと ない！ スイートを ふつうの 値段で 泊めて くれるって！","🏨"]);
})();
