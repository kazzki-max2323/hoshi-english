/* 浜辺の 会話（game/kaiwa.js）の 中身: 会話の 相手（KAIWA_CHARS）と 場面（KAIWA_SCENES）
   - 相手: n=名前 ico=顔 p=声の高さ r=話す速さ d=ひとこと huh=分からなかったときの 返事 [英, 日]
     ok=自分で 書いた 英語が 答えに 近いけど 同じでは ないときの 返事（答えの 返事だと 中身が ずれるため）
   - 場面: {id, c:相手, lv:レベル, t:題, turns:[...], bye:[英, 日]}
   - ふつうの ターン: {s:相手の 英語, j:日本語, o:[答え…]}
     答え = [英語, 1=ふつうの 答え / 0=おもしろい まちがい, 相手の 返事(英), 返事(日), 顔に 出る 絵文字, 自分で 書いたときの 手がかり語]
     0 の 答えを えらぶと 相手が 困ったり 笑ったりして、もう一度 答えられる（おもしろ反応 図鑑に のこる）
   - こっちから 聞く ターン: {ask:'〜に 聞いてみよう', o:[[質問, 1/0, 返事(英), 返事(日), 絵文字]]}。どれを えらんでも 会話は すすむ
   - s / j / o は 関数でも いい（F = いまの 時刻など。game/kaiwa.js の facts()）
   - 手がかり語の '#n' は「なにか 数字」 */
const KAIWA_CHARS={
  gen:{n:'ゲンじい',ico:'👴',p:.7,r:.8,d:'浜辺の つりびと。耳が ちょっと 遠い',ok:[["Oh ho, I see! Good answer.","ほう、なるほど！ いい 答えじゃ"],["Is that so? Ho ho, interesting!","そうかね？ ほっほ、おもしろい！"]],huh:[["Eh? Say that again? My ears are old.","え？ もう一回 言っておくれ。耳が 遠くてのう"],["Hmm? Was that English or a seagull?","ん？ いまのは 英語かね、カモメかね？"]]},
  sora:{n:'ソラ',ico:'👧',p:1.6,r:1,d:'6さいの 女の子。なんでも 知りたい',ok:[["Wow, really? Cool!","へえ、ほんと？ すごい！"],["Hee hee, I see! OK!","ふふっ、そっか！ わかった！"]],huh:[["Huh? I don't get it! Say it again!","え？ わかんない！ もう一回！"],["Is that a magic spell?","それって まほうの じゅもん？"]]},
  pochi:{n:'ポチ',ico:'🐶',p:1.4,r:1.1,d:'しゃべる 犬。食いしんぼう',ok:[["Woof! I see! Good human!","ワン！ そっか！ いい 人間だ！"],["Wag wag! OK!","しっぽ ふりふり！ わかった！"]],huh:[["Woof? I only understand 'food' and 'ball'.","ワン？ ぼく『ごはん』と『ボール』しか わからない"],["Sniff sniff... Say it again?","くんくん… もう一回 言って？"]]},
  kanio:{n:'カニオ',ico:'🦀',p:1.3,r:1.15,d:'よこにしか 歩けない カニ。数字が すき',ok:[["Snip! Got it!","チョキ！ わかった！"],["Hmm, I see. Good answer!","ふむ、なるほど。いい 答えだ！"]],huh:[["What? My ears are on my claws. Say again!","なに？ 耳が はさみに あるんだ。もう一回！"],["Snip? I don't understand.","チョキ？ わからないな"]]},
  hana:{n:'ハナさん',ico:'🍧',p:1.2,r:1,d:'かき氷屋さん。いつも 元気',ok:[["Oh, I see! Thanks!","なるほど！ ありがとう！"],["OK, got it!","オッケー、わかった！"]],huh:[["Sorry, the ice machine is loud! One more time?","ごめん、氷の 機械が うるさくて！ もう一回？"],["Hmm? Is that a new flavor?","ん？ それ 新しい 味？"]]},
  baba:{n:'トメばあ',ico:'👵',p:1.1,r:.85,d:'ゲンじいの おくさん。おせっかい',ok:[["Oh my, I see. Thank you, dear.","あらあら、そうかい。ありがとうね"],["Is that so? How nice.","そうなのかい？ いいねえ"]],huh:[["Oh dear, speak slowly for this old lady.","あらあら、この ばあちゃんに ゆっくり 言っておくれ"],["What was that, dear?","なんだって？"]]},
  neko:{n:'ミケ',ico:'🐱',p:1.5,r:1,d:'気まぐれな ネコ。えらそう',ok:[["Hmm. Acceptable. Meow.","ふむ。ゆるそう。ニャー"],["I see. You may continue, human.","なるほど。つづけよ、人間"]],huh:[["Meow? Speak properly, human.","ニャー？ ちゃんと 話せ、人間"],["I don't understand. And I don't care. Again.","わからん。どうでも いいが。もう一度"]]},
  emma:{n:'エマ',ico:'🧳',p:1.1,r:.95,d:'カナダから 来た 旅行者。よく 道に まよう',ok:[["Oh, I see! Thank you!","なるほど！ ありがとう！"],["Got it. That helps a lot!","わかった。とても 助かるわ！"]],huh:[["Sorry, could you say that again?","ごめんなさい、もう一度 言ってくれる？"],["Hmm, I'm not sure what you mean.","うーん、どういう 意味かしら"]]},
  taku:{n:'タク',ico:'👦',p:1.2,r:1.05,d:'中学生。サッカー部',ok:[["Oh, nice! Got it.","へえ、いいじゃん！ わかった"],["Cool, cool!","いいね、いいね！"]],huh:[["Huh? Say what?","は？ なんて？"],["Dude, I didn't catch that.","ごめん、聞きとれなかった"]]},
  kame:{n:'カメ吉',ico:'🐢',p:.6,r:.7,d:'100さいの カメ。とても のんびり',ok:[["I... see... Good...","なる… ほど… よい…"],["Oh... interesting...","ほう… おもしろい…"]],huh:[["Hmm... What... did... you... say...?","ん… なんと… 言った…？"],["Zzz... Oh... Again... please...","グー… はっ… もう一度…"]]},
  iruka:{n:'ルカ',ico:'🐬',p:1.5,r:1.1,d:'イルカ。ジャンプが じまん',ok:[["Oh, I see! Splash!","なるほど！ バシャーン！"],["Cool! Got it!","いいね！ わかった！"]],huh:[["Huh? There's water in my ears! Again?","え？ 耳に 水が 入って！ もう一回？"],["Click click? That's dolphin for 'what?'","キュキュ？ イルカ語で『なに？』だよ"]]},
  zuzu:{n:'ズーズー',ico:'👽',p:1.8,r:1,d:'星から 来た子。地球の ことを 勉強中',ok:[["Beep! Data saved!","ピピッ！ データ 保存！"],["I see! Earth is interesting!","なるほど！ 地球って おもしろい！"]],huh:[["Beep? My translator says: error.","ピピッ？ ほんやく機が『エラー』だって"],["Is that Earth language? Again, please!","それ 地球語？ もう一回！"]]},
  leo:{n:'レオ',ico:'🎸',p:.95,r:1,d:'ギターを ひく お兄さん',ok:[["Nice. I like that.","いいね。それ すきだな"],["I see. Cool answer.","なるほど。いい 答えだ"]],huh:[["Sorry, I was tuning. Come again?","ごめん、調弦してた。もう一回？"],["Hmm, that's a new song to me.","うーん、それは 知らない 曲だな"]]},
  fuku:{n:'フクロウ博士',ico:'🦉',p:.8,r:.9,d:'夜の 浜辺の 物知り',ok:[["Hoo. A thoughtful answer.","ホー。よく 考えた 答えだ"],["Interesting. I see your point.","興味ぶかい。言いたい ことは わかるよ"]],huh:[["Hoo? Could you rephrase that?","ホー？ 言いかえて もらえるかな"],["Interesting... but I don't follow. Hoo.","興味ぶかい… が、分からんね。ホー"]]},
};

const KAIWA_SCENES=[
/* ===================== 小学生 ===================== */
{id:'es-gen-time',c:'gen',lv:'es',t:'いま 何時？ と 聞かれる',turns:[
  {s:"Hello there. Hmm, where is my watch...?",j:"やあ。うーん、わしの 時計は どこかのう…",o:[
    ["Hello!",1,"Oh, hello! You are a kind child.","おお、こんにちは！ やさしい 子じゃのう","😊",["hello","hi"]],
    ["Goodbye!",0,"Goodbye? But I just said hello! Ho ho ho.","さようなら？ いま あいさつ したばかりじゃよ！ ほっほっほ","😅",["goodbye","bye"]],
    ["I'm a fish.",0,"A fish?! Then I must catch you! ...Just kidding.","魚じゃと？！ では つりあげねば！ …じょうだんじゃ","🎣",["fish"]]]},
  {s:"What time is it now?",j:"いま 何時かのう？",o:F=>[
    [`It's ${F.h}:${F.mm}.`,1,`${F.h}:${F.mm}? Thank you! Time for fishing.`,`${F.h}時${F.m}分か。ありがとう！ つりの 時間じゃ`,"⏰",[String(F.h)]],
    [`It's ${F.wh}:${F.mm}.`,0,`${F.wh}?! Then I slept all day! ...Wait, my phone says ${F.h}:${F.mm}. Ho ho.`,`${F.wh}時？！ 1日 ねてしまった！ …まて、電話には ${F.h}時${F.m}分と あるぞ。ほっほ`,"😱",[String(F.wh)]],
    ["It's my birthday.",0,"Happy birthday! ...But what TIME is it?","おたんじょうび おめでとう！ …で、何時かね？","🎂",["birthday"]]]},
  {s:"Thank you. What's your name?",j:"ありがとう。きみの 名前は？",o:[
    ["My name is Yuki.",1,"What a nice name! I'm Gen.","いい 名前じゃ！ わしは ゲンじゃ","😊",["name","call"]],
    ["I'm ten o'clock.",0,"Ten o'clock? Ho ho, you're a clock!","10時？ ほっほっ、きみは 時計かね！","🕙",["clock"]],
    ["Yes, I am.",0,"Yes? Yes what? Hmm, my ears are old...","はい？ なにが はい？ うーむ、耳が 遠くてのう…","👂",["yes"]]]},
  {ask:'ゲンじいに 聞いてみよう',o:[
    ["What are you doing?",1,"I'm fishing. I want a big fish!","つりを しとる。大きな 魚が ほしいんじゃ","🎣"],
    ["How old are you?",1,"I'm eighty-two. But my heart is twenty!","82さいじゃ。でも 心は 20さい！","💪"],
    ["Are you a fish?",0,"Me? A fish? Blub blub! Ho ho ho!","わしが 魚？ ブクブク！ ほっほっほ","🐟"]]}],
  bye:["See you, little friend!","またな、ちいさな 友だち！"]},

{id:'es-sora-hello',c:'sora',lv:'es',t:'はじめまして',turns:[
  {s:"Hi! I'm Sora. What's your name?",j:"やっほー！ わたし ソラ。あなたの 名前は？",o:[
    ["My name is Yuki.",1,"Nice to meet you! Let's be friends!","よろしくね！ ともだちに なろう！","😆",["name","call"]],
    ["I'm six.",0,"Me too! I'm six too! ...But what's your NAME?","わたしも 6さい！ …で、名前は？","🤭",["6"]],
    ["Thank you.",0,"You're welcome? ...Hmm? I didn't give you anything!","どういたしまして？ …あれ？ なにも あげてないよ！","❓",["thank"]]]},
  {s:"How old are you?",j:"なんさい？",o:[
    ["I'm twelve.",1,"Twelve! You're a big kid!","12さい！ おねえさん（おにいさん）だね！","😮",["#n","old"]],
    ["I'm fine, thank you.",0,"Fine? I asked HOW OLD! Hee hee.","げんき？ なんさいって きいたの！ ふふっ","😂",["fine"]],
    ["I'm a hundred.",0,"A hundred?! Are you a turtle?!","100さい？！ カメさんなの？！","🐢",["100"]]]},
  {s:"I like ice cream! What do you like?",j:"わたし アイス すき！ あなたは なにが すき？",o:[
    ["I like soccer.",1,"Soccer! Let's play on the beach!","サッカー！ 浜辺で やろう！","⚽",["like"]],
    ["I like cats.",1,"Cats! Mike the cat lives here!","ネコ！ この浜辺に ミケって ネコが いるよ！","🐱",["cat"]],
    ["Yes, I do.",0,"Yes? Yes what? You're funny!","うん？ なにが うん？ おもしろい 人！","🤪",["yes"]],
    ["I like homework.",0,"Homework?! ...Are you a teacher?","しゅくだいが すき？！ …あなた 先生なの？","📚",["homework"]]]},
  {ask:'ソラに 聞いてみよう',o:[
    ["What do you like?",1,"I like shells! Look, a pink one!","貝がら すき！ 見て、ピンクの！","🐚"],
    ["Where do you live?",1,"I live near the beach. Over there!","浜辺の ちかく。あそこだよ！","🏠"],
    ["Do you like homework?",0,"Homework? Ugh! No, no, no!","しゅくだい？ うえー！ ないない！","🙅"]]}],
  bye:["Bye-bye! Play with me again!","バイバイ！ また あそんでね！"]},

{id:'es-pochi-food',c:'pochi',lv:'es',t:'おなか すいた？',turns:[
  {s:"Woof! Hi! Are you hungry?",j:"ワン！ やあ！ おなか すいてる？",o:[
    ["Yes, I am.",1,"Me too! I'm always hungry! Woof!","ぼくも！ いつも ぺこぺこ！ ワン！","🤤",["yes"]],
    ["No, I'm not.",1,"Not hungry? Wow... I can't imagine that!","すいてない？ へえ… ぼくには 考えられない！","😲",["no","not"]],
    ["I'm a dog.",0,"You're a dog?! Sniff sniff... no, you smell like a human!","きみも 犬？！ くんくん… いや、人間の においだ！","👃",["dog"]]]},
  {s:"Do you have a sausage?",j:"ソーセージ もってる？",o:[
    ["Sorry, I don't.",1,"Oh... OK. My tail is sad.","そっか… しっぽが しょんぼり","🥺",["sorry","not","no"]],
    ["Here you are.",1,"WOW! Thank you! You're my best friend!","わーい！ ありがとう！ きみは 親友だ！","🌭",["here","yes"]],
    ["I'm a sausage.",0,"You're a sausage?! ...Can I eat you? Just kidding! Woof!","きみが ソーセージ？！ …たべていい？ うそうそ！ ワン！","😋",["sausage"]]]},
  {s:"Let's play! Can you throw the ball?",j:"あそぼう！ ボール 投げられる？",o:[
    ["Sure! Go, Pochi!",1,"Yay! I got it! I got it!","やった！ とったよ！ とった！","🎾",["sure","yes","ok"]],
    ["Yes, I can.",1,"Throw it far! ...That's too far!","遠くへ！ …遠すぎるよ〜！","💨",["can"]],
    ["I can't swim.",0,"Swim? I said throw! ...But I can swim. Doggy paddle!","およぐ？ 投げてって 言ったんだよ！ …でも ぼくは 犬かき できるよ！","🏊",["swim"]]]},
  {ask:'ポチに 聞いてみよう',o:[
    ["What's your favorite food?",1,"Meat! Meat, meat, meat! And more meat!","肉！ 肉、肉、肉！ もっと 肉！","🍖"],
    ["Can you swim?",1,"Yes! Doggy paddle is my best!","うん！ 犬かきは とくい！","🌊"],
    ["Can you speak Japanese?",0,"Wan wan! ...That's Japanese, right?","ワンワン！ …これって 日本語だよね？","🗾"]]}],
  bye:["Woof woof! See you!","ワンワン！ またね！"]},

{id:'es-kanio-num',c:'kanio',lv:'es',t:'足は なん本？',turns:[
  {s:"Hey you! Look at me. How many legs do I have?",j:"おい きみ！ ぼくを 見て。足は なん本？",o:[
    ["Ten.",1,"Correct! Ten! Eight legs and two claws!","正解！ 10本！ 足8本と はさみ2本！","🦀",["10"]],
    ["Two.",0,"Two?! I'm not a human! Look again!","2本？！ 人間じゃ ないってば！ よく見て！","😤",["2"]],
    ["A hundred.",0,"A hundred?! I'm not a centipede! Snip snip!","100本？！ ムカデじゃ ないぞ！ チョキチョキ！","✂️",["100"]]]},
  {s:"What color am I?",j:"ぼくは なに色？",o:[
    ["You're red.",1,"Yes! Red and shiny! Thank you!","そう！ 赤くて ピカピカ！ ありがとう！","❤️",["red"]],
    ["You're blue.",0,"Blue?! Am I sick?! ...No, no, I'm red!","青？！ ぐあい わるいのかな？！ …いやいや、赤だよ！","🥶",["blue"]],
    ["You're delicious.",0,"Delicious?! Don't eat me! Run away! Sideways!","おいしそう？！ たべないで！ にげろ！ よこに！","😱",["delicious","yummy","tasty"]]]},
  {s:"I walk sideways. Can you walk sideways?",j:"ぼくは よこに 歩く。きみは よこ歩き できる？",o:[
    ["Yes, I can.",1,"Show me! ...Ha ha, you're good! Like a crab!","見せて！ …はは、うまい！ カニみたい！","🦀",["yes","can"]],
    ["No, I can't.",1,"Let's practice! Left, left, right, right!","練習しよう！ ひだり、ひだり、みぎ、みぎ！","💃",["no","not"]],
    ["I can fly.",0,"Fly?! ...Show me! ...Hmm, you just jumped!","飛べる？！ …見せて！ …うーん、ジャンプしただけだ！","🪽",["fly"]]]},
  {ask:'カニオに 聞いてみよう',o:[
    ["How old are you?",1,"I'm three. Three is big for a crab!","3さい。カニにとって 3さいは おとなさ！","3️⃣"],
    ["Where do you live?",1,"Under that rock. It's my house!","あの 岩の 下。ぼくの 家だよ！","🪨"],
    ["Can I eat you?",0,"NO! No, no, no! Snip!","だめ！ だめだめだめ！ チョキン！","✂️"]]}],
  bye:["See you! Walk sideways!","じゃあね！ よこ歩きでね！"]},

{id:'es-hana-shop',c:'hana',lv:'es',t:'かき氷を 注文',turns:[
  {s:"Hello! Welcome! Shaved ice?",j:"いらっしゃい！ かき氷 どう？",o:[
    ["Yes, please.",1,"Great! One moment!","やった！ ちょっと 待ってね！","😄",["yes","please"]],
    ["No, thank you.",0,"Really? It's so hot today... Please, just one!","ほんとに？ きょうは こんなに 暑いのに… 1つだけ どう？","🥺",["no"]],
    ["I'm ice.",0,"You're ice?! Then you are cold! Brrr!","氷なの？！ じゃあ つめたいね！ ブルル！","🧊",["ice"]]]},
  {s:"What flavor do you like? Strawberry, lemon, or melon?",j:"なに味が いい？ いちご、レモン、メロン？",o:[
    ["Strawberry, please.",1,"Strawberry! Good choice! Red and sweet.","いちご！ いいね！ 赤くて あまいよ","🍓",["strawberry"]],
    ["Lemon, please.",1,"Lemon! Sour and cool!","レモン！ すっぱくて さわやか！","🍋",["lemon"]],
    ["Melon, please.",1,"Melon! My favorite! I'll give you a little more.","メロン！ わたしも すき！ ちょっと 多めに しとくね","🍈",["melon"]],
    ["Curry, please.",0,"Curry?! Curry shaved ice?! ...Hmm, maybe next year!","カレー？！ カレーの かき氷？！ …うーん、来年かな！","🍛",["curry"]]]},
  {s:"That's two hundred yen.",j:"200円です",o:[
    ["Here you are.",1,"Thank you! Here's your shaved ice!","ありがとう！ はい、かき氷！","🍧",["here"]],
    ["Two hundred dollars?",0,"Dollars?! No, no! Yen! It's not that expensive!","ドル？！ ちがうちがう、円！ そんなに 高くないよ！","💸",["dollar"]],
    ["I don't have money.",0,"Oh no! ...OK, wash the dishes then! Just kidding!","えー！ …じゃあ お皿あらいね！ うそうそ！","🧽",["money"]]]},
  {ask:'ハナさんに 聞いてみよう',o:[
    ["What's your favorite flavor?",1,"Melon! Green is my lucky color.","メロン！ みどりは ラッキーカラーなの","🍈"],
    ["Is it cold?",1,"Very cold! Eat slowly, or your head will hurt!","すっごく つめたいよ！ ゆっくり たべないと 頭が キーンって なるよ！","🥶"],
    ["Can I have a pizza?",0,"Pizza?! This is a shaved ice shop! Ha ha!","ピザ？！ ここは かき氷屋さんだよ！ あはは！","🍕"]]}],
  bye:["Enjoy! Come again!","めしあがれ！ また 来てね！"]},

{id:'es-baba-weather',c:'baba',lv:'es',t:'きょうの 天気',turns:[
  {s:F=>F.greet+", dear!",j:F=>F.greetJ+"、いい 子だね",o:F=>[
    [F.greet+"!",1,"Oh, what a nice child!","まあ、えらい 子だねえ","😊",[F.part]],
    [F.wrong+"!",0,`${F.wrong}? It's ${F.part} now, dear! Are you still dreaming?`,`${F.wrongJ}？ いまは ${F.partJ}だよ！ まだ ゆめの 中かい？`,"😅",[F.wrongKey]],
    ["Good night!",0,"Good night? Are you going to bed now? Here, on the beach?","おやすみ？ もう ねるのかい？ ここ、浜辺で？","😴",["night"]]]},
  {s:"How's the weather today?",j:"きょうの 天気は どう？",o:[
    ["It's sunny.",1,"Sunny! Let's dry the laundry!","晴れ！ せんたくもの 干さなきゃ！","☀️",["sunny","sun"]],
    ["It's cloudy.",1,"Cloudy... Good for a walk. Not too hot!","くもりかい… さんぽに いいね。暑すぎないし！","☁️",["cloudy","cloud"]],
    ["It's rainy.",1,"Rainy? Oh no, my laundry! I must run!","雨？ たいへん、せんたくもの！ 走らなきゃ！","☔",["rain","rainy","raining"]],
    ["It's spaghetti.",0,"Spaghetti?! Spaghetti is falling from the sky?! Oh my!","スパゲッティ？！ 空から スパゲッティが ふってるのかい？！","🍝",["spaghetti"]]]},
  {s:"Are you hot or cold?",j:"暑い？ 寒い？",o:[
    ["I'm hot.",1,"Here, have some cold tea.","ほら、つめたい お茶を おあがり","🍵",["hot"]],
    ["I'm cold.",1,"Here, take my scarf. It's warm!","ほら、わたしの マフラー。あったかいよ！","🧣",["cold"]],
    ["I'm a snowman.",0,"A snowman?! Don't melt, dear!","雪だるま？！ とけないでおくれ！","⛄",["snowman"]]]},
  {ask:'トメばあに 聞いてみよう',o:[
    ["Where is Gen?",1,"Gen? He's fishing again. Every day, fishing!","ゲンじい？ また つりだよ。毎日 つり！","🎣"],
    ["Do you like the sea?",1,"I love it. I met Gen here sixty years ago.","大すきさ。60年前、ここで ゲンじいに 会ったんだよ","💕"],
    ["Are you a ghost?",0,"A ghost?! Do I look that old?! Oh, you!","おばけ？！ そんなに 年よりに 見えるかい？！ もう！","👻"]]}],
  bye:["Take care, dear!","気をつけて おかえり"]},

{id:'es-neko-can',c:'neko',lv:'es',t:'ネコの おねがい',turns:[
  {s:"Meow. You. Human. Are you busy?",j:"ニャー。おまえ。人間。いそがしいか？",o:[
    ["No, I'm not.",1,"Good. Then you are my servant today.","よろしい。きょうは わたしの 家来だ","😼",["no","not"]],
    ["Yes, I am.",0,"Busy? Too bad. Cats come first. Meow.","いそがしい？ ざんねん。ネコが 先だ。ニャー","😾",["yes","busy"]],
    ["Meow!",0,"Meow? ...Your cat language is terrible.","ニャー？ …おまえの ネコ語、へたすぎる","🙀",["meow"]]]},
  {s:"Can you open this can?",j:"この カン、あけられるか？",o:[
    ["Sure.",1,"Fish! Fish! ...Ahem. Thank you, human.","さかな！ さかな！ …コホン。ごくろう、人間","🐟",["sure","yes","ok","can"]],
    ["No, I can't.",0,"You can't?! You have hands! I only have paws!","できない？！ おまえには 手が あるだろう！ わたしは 肉球だけだぞ！","🐾",["no","not"]],
    ["I can eat it.",0,"NO! It's MY fish! Hiss!","だめ！ わたしの 魚だ！ シャー！","😾",["eat"]]]},
  {s:"Do you have a cat?",j:"おまえ、ネコを かっているか？",o:[
    ["Yes, I have a cat.",1,"Hmm. Tell your cat: Mike says hello.","ふむ。そのネコに よろしく。ミケからだ","😺",["yes"]],
    ["No, I don't.",1,"No cat? Sad life. You may visit me.","ネコが いない？ かわいそうな 人生だ。わたしに 会いに 来るといい","😸",["no","not"]],
    ["I have a dog.",0,"A DOG?! ...Is it Pochi?! Traitor!","犬？！ …ポチか？！ うらぎりもの！","🙀",["dog"]]]},
  {ask:'ミケに 聞いてみよう',o:[
    ["What's your name?",1,"Mike. Queen Mike. Remember it.","ミケ。女王ミケ。おぼえておけ","👑"],
    ["Do you like Pochi?",1,"Pochi? He's loud. ...But he's OK.","ポチ？ うるさい。…でも まあ、悪くない","😼"],
    ["Can I hold you?",0,"No. ...Maybe later. ...No.","だめ。 …あとでなら。 …やっぱり だめ","🙅"]]}],
  bye:["Meow. You may go now.","ニャー。下がってよい"]},

/* ===================== 中学生 ===================== */
{id:'jh-emma-way',c:'emma',lv:'jh',t:'駅への 道を 聞かれる',turns:[
  {s:"Excuse me. Could you help me?",j:"すみません。ちょっと 助けて もらえますか？",o:[
    ["Sure. What's wrong?",1,"Thank you! I'm lost.","ありがとう！ 道に まよっちゃって","😮‍💨",["sure","yes","ok","course"]],
    ["No, I'm busy.",0,"Oh... OK... (She looks so sad.)","そう… わかった…（すごく かなしそう）","🥲",["busy"]],
    ["I'm lost too.",0,"You too?! Then we are lost together! Ha ha!","あなたも？！ じゃあ いっしょに まいごね！ あはは！","🗺️",["lost"]]]},
  {s:"Where is the station?",j:"駅は どこですか？",o:[
    ["Go straight and turn left.",1,"Straight, then left. Got it!","まっすぐ行って 左ね。わかった！","⬅️",["straight","left","right","turn"]],
    ["It's next to the shrine.",1,"Next to the shrine... the one with the red gate?","神社の となり… 赤い 門の ところ？","⛩️",["next","shrine","near"]],
    ["It's in my pocket.",0,"In your pocket?! A very small station! Ha ha!","ポケットの 中？！ ずいぶん 小さい 駅ね！","🚉",["pocket"]],
    ["Turn right into the sea.",0,"Into the sea?! I can't swim to the station!","海に 入る？！ 駅まで およげないわ！","🌊",["sea"]]]},
  {s:"How long does it take?",j:"どのくらい かかりますか？",o:[
    ["About ten minutes.",1,"Ten minutes. Perfect! My train is at three.","10分ね。ばっちり！ 電車は 3時なの","⏱️",["minute","#n"]],
    ["About ten years.",0,"Ten years?! I'll be a grandma when I get there!","10年？！ つくころには おばあちゃんよ！","👵",["year"]],
    ["I'm fine, thank you.",0,"Good to hear! ...But how LONG does it take?","よかった！ …で、どのくらい かかるの？","😂",["fine"]]]},
  {ask:'エマに 聞いてみよう',o:[
    ["Where are you from?",1,"I'm from Canada. It's very cold in winter!","カナダから 来たの。冬は すごく 寒いのよ！","🍁"],
    ["How do you like Japan?",1,"I love it! The food is amazing. Especially onigiri!","大すき！ ごはんが 最高。とくに おにぎり！","🍙"],
    ["Are you a spy?",0,"A spy?! ...Shh! Just kidding! I'm a tourist!","スパイ？！ …シーッ！ うそうそ！ ただの 旅行者よ！","🕵️"]]}],
  bye:["Thank you so much! Have a nice day!","ほんとうに ありがとう！ よい 一日を！"]},

{id:'jh-taku-weekend',c:'taku',lv:'jh',t:'週末 なにしてた？',turns:[
  {s:"Hey! What did you do last weekend?",j:"よう！ 先週末 なにしてた？",o:[
    ["I studied English.",1,"Wow, so serious! I played soccer all day.","うわ、まじめ！ おれは 1日中 サッカー","⚽",["studied"]],
    ["I went to the beach.",1,"Me too! Did you see the giant crab? Kanio!","おれも！ でっかい カニ 見た？ カニオ！","🏖️",["went"]],
    ["I will eat lunch.",0,"Will? That's the future, man! I asked about LAST weekend!","will？ それ 未来じゃん！ 先週の 話だって！","⏪",["will"]],
    ["I'm weekend.",0,"You're weekend?! Then every day is a holiday! Lucky!","おまえが 週末？！ じゃあ 毎日 休みじゃん！ いいな！","🎉",["weekend"]]]},
  {s:"Do you play any sports?",j:"なにか スポーツ やってる？",o:[
    ["Yes, I play tennis.",1,"Tennis! Cool. Let's play sometime!","テニス！ いいね。こんど やろう！","🎾",["play","yes"]],
    ["No, I don't.",1,"No? Then join our team! We need more people!","やってない？ じゃあ チーム 入れよ！ 人 足りないんだ！","🙌",["no","not"]],
    ["Yes, I play the piano.",0,"Piano is a sport?! ...Well, your fingers do move fast!","ピアノって スポーツ？！ …まあ、指は 速く 動くよな！","🎹",["piano"]]]},
  {s:"I have a big game tomorrow. I'm nervous.",j:"あした 大事な 試合。きんちょう してる",o:[
    ["Good luck! You can do it!",1,"Thanks! I feel better now!","サンキュー！ 元気 出た！","💪",["luck","can"]],
    ["Don't worry. Just have fun.",1,"Ha ha, you're right! Just have fun!","ははっ、そうだな！ 楽しめば いいんだ！","😄",["worry","fun"]],
    ["Congratulations!",0,"Congrats? I didn't win yet! Too early, man!","おめでとう？ まだ 勝ってないって！ 早すぎ！","🏆",["congratulation"]],
    ["Me too. I'm tomorrow.",0,"You are tomorrow?! ...Are you a time machine?","おまえが あした？！ …タイムマシンか？","🤖",["tomorrow"]]]},
  {ask:'タクに 聞いてみよう',o:[
    ["What time is the game?",1,"At ten in the morning. Come and watch!","朝 10時。見に 来いよ！","⏰"],
    ["Who is your favorite player?",1,"Our captain, Ken. He never gives up!","キャプテンの ケン。ぜったい あきらめないんだ！","⚡"],
    ["Can you fly?",0,"Only when I head the ball! Boing!","ヘディングの ときだけな！ ボヨーン！","🦘"]]}],
  bye:["See you! Wish me luck!","じゃあな！ おうえん たのむ！"]},

{id:'jh-gen-fishing',c:'gen',lv:'jh',t:'あしたの 天気と つり',turns:[
  {s:"Do you think it will rain tomorrow?",j:"あした 雨が ふると 思うかい？",o:[
    ["I don't think so.",1,"Good! Then I'll go fishing early in the morning.","よし！ じゃあ 朝早く つりに 行くとしよう","🌤️",["think","not"]],
    ["Yes, I think it will rain.",1,"Hmm, then I'll stay home and fix my net.","うーむ、じゃあ 家で あみを なおすかのう","🌧️",["yes","will"]],
    ["It rained yesterday.",0,"Yesterday? I asked about tomorrow! You're forgetful, like me!","きのう？ あしたの 話じゃよ！ わしみたいに わすれんぼじゃのう！","🤔",["yesterday","rained"]]]},
  {s:"Have you ever caught a fish?",j:"魚を つったこと あるかい？",o:[
    ["Yes, I have.",1,"Really? Show me how next time! Ho ho.","ほう？ こんど うでまえを 見せておくれ！","🐟",["yes","have"]],
    ["No, I haven't.",1,"Then let's go together! I'll teach you.","では いっしょに 行こう！ 教えてあげよう","🎣",["no","not","never"]],
    ["Yes, I caught a whale.",0,"A WHALE?! With what? A big spoon?! Ho ho ho!","クジラ？！ なにで？ 大きな スプーンかね？！ ほっほっほ","🐋",["whale"]]]},
  {s:"Can you carry this bucket for me? It's heavy.",j:"この バケツ 運んでくれるかい？ 重くてのう",o:[
    ["Of course.",1,"Thank you. You're stronger than me!","ありがとう。わしより 力もちじゃ！","🪣",["course","sure","yes","ok"]],
    ["I'm sorry, I'm a cat.",0,"A cat?! Then don't eat my fish! Ho ho!","ネコじゃと？！ では わしの 魚を 食べるでないぞ！","🐱",["cat"]],
    ["It's heavy. Goodbye!",0,"Hey! Come back! ...Young people these days!","おい！ もどってこい！ …まったく 今どきの 若いもんは！","🏃",["goodbye","bye"]]]},
  {ask:'ゲンじいに 聞いてみよう',o:[
    ["What's the biggest fish you've caught?",1,"A tuna! It was as big as me!","マグロじゃ！ わしと 同じくらい 大きかった！","🐟"],
    ["How long have you lived here?",1,"For eighty years. I was born on this beach.","80年じゃ。この 浜辺で 生まれたんじゃよ","🏖️"],
    ["Is Tome scary?",0,"Shh! She might hear you! ...Yes. Very scary.","シーッ！ 聞こえるぞ！ …うむ。とても こわい","🤫"]]}],
  bye:["Thank you, my young friend.","ありがとう、わかい 友よ"]},

{id:'jh-kame-slow',c:'kame',lv:'jh',t:'100さいの カメと おしゃべり',turns:[
  {s:"Hel... lo... Nice... to... meet... you...",j:"こん… にち… は… はじめ… まして…",o:[
    ["Nice to meet you, too.",1,"Oh... you are... polite...","おお… ていねいな… 子だ…","🐢",["nice","meet"]],
    ["Hurry up!",0,"Hur... ry...? I... don't... know... that... word...","いそ… ぐ…？ その… ことばは… 知らない…","🐌",["hurry"]],
    ["Are you sleeping?",0,"Zzz... Oh! No... I'm... awake... maybe...","グー… はっ！ いや… おきてる… たぶん…","💤",["sleep"]]]},
  {s:"I'm... one... hundred... years... old... How... old... are... you?",j:"わしは… 100さい… きみは…？",o:[
    ["I'm fourteen.",1,"Four... teen... You... are... a... baby...","じゅう… よん… まだ… 赤ちゃんだ…","👶",["#n","old"]],
    ["I'm one hundred and one.",0,"One... hundred... and... one?! You... look... young! What's... your... secret?","101さい？！ わかく… 見える！ ひけつは…？","😲",["101"]],
    ["I'm tall.",0,"Tall...? I... asked... how... OLD... Zzz...","大きい…？ なんさいか… きいたんだが… グー…","😴",["tall"]]]},
  {s:"What... is... your... dream?",j:"きみの… ゆめは…？",o:[
    ["I want to be a teacher.",1,"A... teacher... Good... like... Mina...","先生… いいね… ミナ先生の… ように…","👩‍🏫",["want","be"]],
    ["I want to travel the world.",1,"The... world... I... did... that... It... took... fifty... years...","世界… わしも… した… 50年… かかった…","🌍",["travel","world"]],
    ["I want to be a turtle.",0,"A... turtle?! ...Welcome... to... the... slow... life...","カメ？！ …ようこそ… のんびり… 人生へ…","🐢",["turtle"]]]},
  {ask:'カメ吉に 聞いてみよう',o:[
    ["What's your favorite food?",1,"Sea... weed... I... eat... it... very... slowly...","わかめ… とても… ゆっくり… 食べる…","🥬"],
    ["Where have you been?",1,"Hawaii... Australia... and... the... bathroom...","ハワイ… オーストラリア… それと… トイレ…","🏝️"],
    ["Can you run fast?",0,"Ha... ha... ha... That's... a... good... joke...","は… は… は… いい… じょうだんだ…","🤣"]]}],
  bye:["Good... bye... See... you... next... year...","さよ… なら… また… 来年…"]},

{id:'jh-iruka-jump',c:'iruka',lv:'jh',t:'ジャンプ 見て！',turns:[
  {s:"Hey! Watch me! ...Splash! How was my jump?",j:"ねえ 見て！ …バシャーン！ ぼくの ジャンプ どう？",o:[
    ["That was amazing!",1,"I know! I'm the best jumper in this sea!","でしょ！ この 海で いちばんの ジャンプなんだ！","🐬",["amazing","great","cool","good","wow"]],
    ["You jumped higher than the moon!",1,"Higher than the moon?! ...You're so nice. Ha ha!","月より 高い？！ …やさしいね。あはは！","🌙",["higher","moon"]],
    ["I'm wet now.",0,"Oops! Sorry! ...Want a towel? I don't have one. I'm a dolphin!","あっ！ ごめん！ …タオル いる？ もってないや。イルカだもん！","💦",["wet"]]]},
  {s:"Who is faster, me or a boat?",j:"ぼくと ボート、どっちが 速い？",o:[
    ["You are faster.",1,"Right! I'm faster than any boat!","そのとおり！ どんな ボートより 速いよ！","💨",["you","faster"]],
    ["The boat is faster.",0,"WHAT?! Let's race! ...OK, the big ship wins. But the small boat? I win!","なんだって？！ 競争だ！ …大きい 船には 負けた。でも 小さい ボートには 勝つ！","🚤",["boat"]],
    ["You are more fast.",0,"'More fast'? You mean 'faster'! Ha ha, I'm faster at English too!","more fast？ faster でしょ！ 英語も ぼくのほうが 速いね！","📏",["more"]]]},
  {s:"Do you want to swim with me?",j:"いっしょに およぐ？",o:[
    ["I'd love to!",1,"Yay! Hold my fin!","やった！ ヒレに つかまって！","🏊",["love","yes","sure"]],
    ["I can't swim.",1,"No problem! Sit on my back. Like a boat!","だいじょうぶ！ 背中に のって。ボートみたいに！","🛟",["can't","not","no"]],
    ["I want to fly.",0,"Fly? Hmm... Jump with me! That's almost flying!","飛びたい？ うーん… いっしょに ジャンプ！ ほぼ 飛んでるよ！","🪽",["fly"]]]},
  {ask:'ルカに 聞いてみよう',o:[
    ["How fast can you swim?",1,"Fifty kilometers an hour! Faster than your bike!","時速50キロ！ きみの 自転車より 速いよ！","🚴"],
    ["Do you have any friends?",1,"Lots! Whales, fish, and Kamekichi. He's slow, but kind.","たくさん！ クジラ、魚、カメ吉。おそいけど やさしいよ","🐢"],
    ["Are you a shark?",0,"A SHARK?! No way! Sharks are scary! I'm cute!","サメ？！ ちがうよ！ サメは こわい！ ぼくは かわいい！","🦈"]]}],
  bye:["See you in the waves!","波の 中で またね！"]},

{id:'jh-zuzu-sea',c:'zuzu',lv:'jh',t:'これは なに？ 星から 来た子',turns:[
  {s:"Beep! Hello, Earth person! What is this big blue thing?",j:"ピピッ！ こんにちは、地球人！ この 大きくて 青い ものは なに？",o:[
    ["It's the sea.",1,"The sea! It's so big! Can I drink it?","海！ でっかい！ のめるの？","🌊",["sea","ocean"]],
    ["It's a big bath.",0,"A bath?! For giants?! Earth is scary!","おふろ？！ 巨人用？！ 地球 こわい！","🛁",["bath"]],
    ["It's my juice.",0,"Your juice?! You drink all of this?! Amazing stomach!","きみの ジュース？！ これ ぜんぶ のむの？！ すごい おなか！","🧃",["juice"]]]},
  {s:"Can I drink the sea?",j:"海は のめる？",o:[
    ["No, it's too salty.",1,"Salty... Beep! I learned a new word!","しょっぱい… ピピッ！ 新しい ことば おぼえた！","🧂",["no","salty","salt"]],
    ["Yes, drink it all!",0,"Glug glug... BLEH! Why did you say yes?!","ゴクゴク… ペッ！ なんで いいって 言ったの？！","🤢",["yes","drink"]],
    ["It's sweet.",0,"Sweet?! ...BLEH! You lied! Earth people are tricky!","あまい？！ …ペッ！ うそつき！ 地球人は ずるい！","😵",["sweet"]]]},
  {s:"On my planet, we eat stars. What do you eat?",j:"ぼくの 星では 星を 食べる。きみは なに 食べる？",o:[
    ["I eat rice and fish.",1,"Rice... fish... I want to try them! Do they shine?","ごはん… さかな… 食べてみたい！ 光る？","🍙",["eat"]],
    ["I eat stars, too.",0,"You too?! Then you are from my planet! Brother!","きみも？！ じゃあ 同じ 星の 出身だ！ 兄弟！","⭐",["star"]],
    ["I eat aliens.",0,"EEK! Don't eat me! I'm not tasty! Beep beep!","ひいっ！ 食べないで！ おいしくないよ！ ピピッ！","😱",["alien"]]]},
  {ask:'ズーズーに 聞いてみよう',o:[
    ["Where is your planet?",1,"Over there. Next to that bright star. Six hundred years by bike.","あそこ。あの 明るい 星の となり。自転車で 600年","🪐"],
    ["How many eyes do you have?",1,"Three. One is for reading comics.","3つ。1つは マンガ 用","👀"],
    ["Are you a teapot?",0,"A teapot?! ...What is a teapot? Is it cute?","ティーポット？！ …ティーポットって なに？ かわいい？","🫖"]]}],
  bye:["Beep! Thank you, Earth friend! Bye-bye!","ピピッ！ ありがとう 地球の 友だち！ バイバイ！"]},

/* ===================== 高校生 ===================== */
{id:'hs-emma-wallet',c:'emma',lv:'hs',t:'さいふを なくした 旅行者',turns:[
  {s:"Oh no... I think I've lost my wallet.",j:"ああ… さいふを なくしたみたい",o:[
    ["Oh no! When did you last see it?",1,"Hmm... At the shaved ice shop, I think.","うーん… かき氷屋さんで だと 思う","🤔",["when","last","see"]],
    ["Congratulations!",0,"Congratulations?! Are you happy about my bad luck?!","おめでとう？！ わたしの 不運が うれしいの？！","😤",["congratulation"]],
    ["I didn't take it!",0,"Ha ha, I didn't say you did! ...But now I'm curious.","はは、あなたが とったなんて 言ってないわ！ …でも あやしい…","🕵️",["take","didn't"]]]},
  {s:"Would you mind coming with me to the shop?",j:"お店まで いっしょに 来て もらえない？",o:[
    ["Not at all. Let's go.",1,"Thank you! You're so kind.","ありがとう！ やさしいのね","🙏",["not","all","go"]],
    ["Sure, no problem.",1,"You're a lifesaver!","命の 恩人だわ！","🛟",["sure","problem"]],
    ["Yes, I mind.",0,"Oh... so you DO mind? ...Wait, did you mean 'no'? 'Would you mind' is tricky!","あら… いやなの？ …まって、no の つもり？ Would you mind は ややこしいわね！","🌀",["mind","yes"]]]},
  {s:"Hana found it! What should I do for her?",j:"ハナさんが 見つけて くれたの！ なにを したら いいかな？",o:[
    ["You should thank her and buy a shaved ice.",1,"Great idea! Two shaved ices, please!","いい アイデア！ かき氷 2つ ください！","💐",["thank","buy"]],
    ["You should write her a thank-you card.",1,"How sweet! I'll write it in Japanese!","すてき！ 日本語で 書いてみる！","💌",["card","write"]],
    ["You should run away.",0,"Run away?! She found my wallet! That's rude!","にげる？！ 見つけて くれたのに！ 失礼よ！","🏃‍♀️",["run","away"]]]},
  {ask:'エマに 聞いてみよう',o:[
    ["Was anything missing?",1,"No, everything is here. Even my lucky coin!","ううん、ぜんぶ ある。ラッキーコインも！","🪙"],
    ["How long are you staying in Japan?",1,"For two more weeks. I want to visit Kyoto next.","あと 2週間。つぎは 京都に 行きたいの","🗾"],
    ["Can I have your wallet?",0,"NO! I just found it! Ha ha!","だめ！ やっと 見つけたのに！ あはは！","👛"]]}],
  bye:["Thank you for your help. You saved my trip!","助けて くれて ありがとう。旅が 救われたわ！"]},

{id:'hs-leo-music',c:'leo',lv:'hs',t:'好きな 音楽の 話',turns:[
  {s:"Hey. Have you ever played the guitar?",j:"やあ。ギター ひいたこと ある？",o:[
    ["Yes, a little.",1,"Nice! Want to try mine?","いいね！ ぼくのを ひいてみる？","🎸",["yes","little"]],
    ["No, never.",1,"Never? It's not too late. I'll show you a chord.","ないの？ おそくないよ。コードを 1つ 教えるよ","🎶",["no","never","not"]],
    ["Yes, I have played it tomorrow.",0,"Tomorrow?! You're a musician from the future! Cool!","あした？！ 未来から 来た ミュージシャン？！ かっこいい！","🕰️",["tomorrow"]]]},
  {s:"What kind of music do you listen to?",j:"どんな 音楽を 聞く？",o:[
    ["I usually listen to pop music.",1,"Pop! Catchy songs make the day brighter.","ポップ！ 口ずさめる 歌は 一日を 明るく するよね","🎵",["pop","usually"]],
    ["I listen to the radio on this beach.",1,"Ah, the beach radio! It whispers English, right? Smart!","浜辺の ラジオ！ 英語を つぶやくんだよね？ かしこい！","📻",["radio"]],
    ["I listen to my mother.",0,"Ha ha! That's good of you. But I meant music!","ははっ！ えらいね。でも 音楽の 話だよ！","👩",["mother","mom"]]]},
  {s:"If you could play any instrument, what would it be?",j:"もし どんな 楽器でも ひけるなら、なにが いい？",o:[
    ["I would play the piano.",1,"Piano! Then let's play together. Guitar and piano!","ピアノ！ じゃあ いっしょに やろう。ギターと ピアノで！","🎹",["piano"]],
    ["I would play the drums.",1,"Drums! Boom boom! The whole beach will dance!","ドラム！ ドンドン！ 浜辺中が おどりだすよ！","🥁",["drum"]],
    ["I will play soccer.",0,"Soccer isn't an instrument! ...Unless you kick a drum. Please don't.","サッカーは 楽器じゃないよ！ …ドラムを けるなら 別だけど。やめてね","⚽",["soccer"]]]},
  {ask:'レオに 聞いてみよう',o:[
    ["How long have you been playing the guitar?",1,"Since I was ten. Fifteen years now.","10さいから。もう 15年","⏳"],
    ["Could you play a song for me?",1,"Sure. This one is called 'Starry Beach'.","いいよ。この 曲は『星降る浜辺』って いうんだ","✨"],
    ["Can you play the guitar with your feet?",0,"With my feet?! ...Let me try. ...Ouch. No.","足で？！ …やってみる。 …いてっ。むり","🦶"]]}],
  bye:["Keep the music in your heart. See ya.","音楽を 心に。またね"]},

{id:'hs-gen-past',c:'gen',lv:'hs',t:'むかしの 浜辺の 話',turns:[
  {s:"When I was young, this beach used to be full of fish.",j:"わしが わかいころ、この 浜辺は 魚で いっぱい だったんじゃ",o:[
    ["Really? What happened?",1,"Many big boats came. Now there are fewer fish.","大きな 船が たくさん 来てのう。いまは 魚が へった","🚢",["what","happened"]],
    ["Did you use to be a fish?",0,"Me? A fish?! ...Well, I swam like one! Ho ho!","わしが 魚？！ …まあ、魚みたいに およいだがのう！","🐟",["fish"]],
    ["That's boring.",0,"Boring?! ...Ho ho, you're honest. I like that.","たいくつ？！ …ほっほ、正直じゃのう。きらいじゃないぞ","😑",["boring"]]]},
  {s:"Do you think the sea will be clean in the future?",j:"未来の 海は きれいだと 思うかい？",o:[
    ["I hope so. We should use less plastic.",1,"Yes. Young people like you give me hope.","そうじゃな。きみのような 若者が 希望じゃ","🌏",["hope","plastic","should"]],
    ["I'm not sure, but I want to help.",1,"Then let's pick up trash together this Sunday!","では 日曜に いっしょに ごみひろいを しよう！","🧹",["help","sure"]],
    ["Yes, because the fish will wash it.",0,"Fish wash the sea?! With tiny sponges? Ho ho ho!","魚が 海を あらう？！ 小さな スポンジでかね？ ほっほっほ","🧽",["wash"]]]},
  {s:"Tome and I met here sixty years ago.",j:"トメと わしは 60年前、ここで 出会ったんじゃ",o:[
    ["That's so romantic!",1,"Ho ho... Don't tell her I said that.","ほっほ… わしが 話したことは トメには ないしょじゃぞ","💕",["romantic","sweet","nice"]],
    ["How did you meet her?",1,"She threw a watermelon at me. It was love at first sight.","わしに スイカを 投げたんじゃ。ひとめぼれ じゃった","🍉",["how","meet"]],
    ["Was she a fish too?",0,"If Tome hears that, YOU will be the fish! Ho ho!","トメに 聞かれたら きみが 魚に されるぞ！","😨",["fish"]]]},
  {ask:'ゲンじいに 聞いてみよう',o:[
    ["What did you use to do for fun?",1,"We used to watch the stars and sing. No phones, just stars.","星を 見て 歌った もんじゃ。スマホは なく、星だけ","🌌"],
    ["What's your secret to a long life?",1,"Fish, walking, and laughing every day.","魚と さんぽと、毎日 わらうこと","😄"],
    ["Can I borrow your boat forever?",0,"Forever?! Then where will I sleep? Ho ho!","ずっと？！ じゃあ わしは どこで ねるんじゃ？ ほっほ","🛶"]]}],
  bye:["Thank you for listening to an old man.","年よりの 話を 聞いてくれて ありがとう"]},

{id:'hs-sora-why',c:'sora',lv:'hs',t:'なんで？ なんで？ に 答える',turns:[
  {s:"Why is the sea blue?",j:"なんで 海は 青いの？",o:[
    ["Because it reflects the sky.",1,"The sky? Then at night the sea is black! ...Oh, it is!","空？ じゃあ 夜は 海が 黒いの！ …ほんとだ！","🌌",["reflect","sky"]],
    ["Because someone painted it.",0,"Who?! A giant with a big brush?! I want to meet him!","だれが？！ 大きな 筆の 巨人？！ 会いたい！","🖌️",["paint"]],
    ["Because it's sad.",0,"Blue means sad?! Sea, don't cry! I'll sing for you!","青って かなしいの？！ 海さん、なかないで！ 歌って あげる！","😢",["sad"]]]},
  {s:"Why do stars twinkle?",j:"なんで 星は キラキラ するの？",o:[
    ["Because the air above us is moving.",1,"The air is dancing? Cool!","空気が おどってるの？ すごい！","✨",["air","moving","move"]],
    ["I don't know. Let's look it up together.",1,"Yay! Together! Mina knows everything!","やった！ いっしょに！ ミナ先生なら 知ってるよ！","📚",["know","together","look"]],
    ["Because they are winking at you.",0,"Really?! Hi, stars! *wink wink* ...They didn't wink back.","ほんと？！ やっほー 星さん！ パチパチ… かえして くれない","😉",["wink"]]]},
  {s:"When I grow up, I want to be an astronaut. Is it difficult?",j:"大きくなったら 宇宙飛行士に なりたい。むずかしい？",o:[
    ["It's difficult, but you can do it if you study hard.",1,"I'll study! Starting... tomorrow!","べんきょう する！ あしたから！","🚀",["difficult","can","study"]],
    ["Yes. Just give up.",0,"Give up?! NO! I'll show you! ...Meanie!","あきらめろ？！ やだ！ 見てなさい！ …いじわる！","😠",["give","up"]],
    ["You'll need a big umbrella.",0,"An umbrella?! For space rain?! Does it rain in space?!","かさ？！ 宇宙の 雨用？！ 宇宙にも 雨 ふるの？！","☂️",["umbrella"]]]},
  {ask:'ソラに 聞いてみよう',o:[
    ["Which planet would you like to visit?",1,"Saturn! I want to slide down the rings!","土星！ わっかで すべり台 したい！","🪐"],
    ["Who taught you about space?",1,"Zuzu! My friend from a star. ...It's a secret!","ズーズー！ 星から 来た 友だち。…ないしょだよ！","👽"],
    ["Why are you so curious?",0,"Why? Why do you ask why? Why?","なんで？ なんで なんでって きくの？ なんで？","❓"]]}],
  bye:["Thank you! You're smart, like Mina!","ありがとう！ ミナ先生みたいに かしこいね！"]},

/* ===================== ハイレベル ===================== */
{id:'adv-fuku-ai',c:'fuku',lv:'adv',t:'AIと 先生の 未来を 語る',turns:[
  {s:"Hoo. Tell me, do you think AI will replace teachers someday?",j:"ホー。いつか AIが 先生の 代わりに なると 思うかね？",o:[
    ["Partly, but human teachers will still be needed.",1,"A balanced view. Hoo. I agree, mostly.","バランスの とれた 考えだ。ホー。おおむね 同感だよ","🦉",["partly","still","human","needed"]],
    ["Yes, completely. Teachers will disappear.",1,"A bold claim! Then who will scold you for being late? Hoo hoo.","大胆だね！ では だれが 遅刻を しかるのかね？ ホッホー","😮",["completely","disappear"]],
    ["Yes, because owls are smarter than AI.",0,"Flattering, but irrelevant. Hoo... though not entirely wrong.","うれしいが、関係ないね。ホー… まちがいでも ないが","😏",["owl"]]]},
  {s:"What do you think is the most important thing a teacher does?",j:"先生が する いちばん 大事な ことは 何だと 思う？",o:[
    ["Inspiring students to keep learning.",1,"Precisely. Knowledge fades, but curiosity lasts.","まさに。知識は うすれるが、好奇心は のこる","✨",["inspire","inspiring","motivate","curious"]],
    ["Understanding how each student feels.",1,"Empathy, yes. Even an owl can't learn that from a book.","共感、だね。フクロウでも 本からは 学べない ことだ","💞",["understand","feel","feeling"]],
    ["Giving lots of homework.",0,"Hoo! Students everywhere just shivered.","ホー！ 世界中の 生徒が いま ふるえたよ","🥶",["homework"]]]},
  {s:"Is there a downside to learning everything with AI?",j:"AIで なんでも 学ぶことに 欠点は あるかね？",o:[
    ["If we rely on it too much, we may stop thinking for ourselves.",1,"Wise. A tool should sharpen the mind, not replace it.","かしこい。道具は 頭を みがく もので、代わりでは ない","🧠",["rely","thinking","think","ourselves"]],
    ["It can be wrong, so we should check other sources.",1,"Excellent. Trust, but verify. Hoo.","すばらしい。信じても、たしかめよ。ホー","🔍",["wrong","check","source"]],
    ["No downside. I'll let AI eat my breakfast too.",0,"Then you'll be very hungry and very well-informed. Hoo hoo!","じゃあ きみは 腹ぺこで 物知りに なるね。ホッホー！","🍳",["breakfast","eat"]]]},
  {ask:'博士に 聞いてみよう',o:[
    ["What do you think makes a good learner?",1,"Someone who isn't afraid of making mistakes. Like you, here.","まちがいを こわがらない者。ここでの きみのようにね","🌟"],
    ["How did you become so wise?",1,"I stayed up every night reading. Owls have an unfair advantage.","毎晩 夜ふかしして 読んだのさ。フクロウは ずるいほど 有利でね","🌙"],
    ["Are you secretly an AI?",0,"Hoo... If I were, would I tell you? ...I'm not. Probably.","ホー… もし そうなら 言うと 思うかね？ …ちがうよ。たぶん","🤖"]]}],
  bye:["Keep questioning everything. Hoo.","すべてを 問いつづけなさい。ホー"]},

{id:'adv-zuzu-explain',c:'zuzu',lv:'adv',t:'地球の ふしぎを 説明する',turns:[
  {s:"Earthling! Explain 'homework' to me. Why do you work at home after school?",j:"地球人！『宿題』を 説明して。なんで 学校の あとに 家で 勉強するの？",o:[
    ["It helps us review what we learned in class.",1,"Review... like charging a battery! Logical!","ふくしゅう… 充電みたいな ものか！ 合理的！","🔋",["review","learned","help"]],
    ["Teachers enjoy watching us suffer.",0,"Beep! Then teachers are evil overlords?! I must warn my planet!","ピピッ！ 先生は 悪の 支配者？！ 星に 知らせなきゃ！","📡",["suffer","enjoy"]],
    ["Because school isn't long enough.",0,"Then make school longer! ...Why are you making that face?","じゃあ 学校を 長く すれば いい！ …なんで そんな 顔 するの？","😖",["long","enough"]]]},
  {s:"And why do humans say 'I'm fine' even when they look tired?",j:"なんで 人間は つかれて 見えるのに『元気です』って 言うの？",o:[
    ["It's often just a polite habit, not a real answer.",1,"A polite habit... Earth language has hidden layers!","ていねいな 習慣… 地球語には かくれた 層が あるんだね！","🧅",["polite","habit"]],
    ["We don't want others to worry about us.",1,"So it's kindness! Humans are complicated, but sweet.","やさしさ なんだ！ 人間って ややこしいけど あまい","🍬",["worry","others"]],
    ["Because 'fine' means 'very tired' in English.",0,"Really?! I told your teacher 'I'm fine' this morning! She gave me a bed!","ほんとに？！ 今朝 先生に『元気』って 言ったら ベッドを くれた！","🛏️",["tired","means"]]]},
  {s:"Last question! If you could take one thing from Earth to my planet, what would you take?",j:"さいごの 質問！ 地球の ものを 1つ ぼくの 星に もっていくなら？",o:[
    ["I'd take music, because it connects people without words.",1,"Music! My planet only has beeping. We need this!","音楽！ ぼくの 星は ピピッて 音だけ。これ ほしい！","🎶",["music"]],
    ["I'd take the ocean, so you could have waves too.",1,"The whole ocean?! My spaceship will need a bigger trunk!","海 ぜんぶ？！ 宇宙船の トランク 大きくしないと！","🌊",["ocean","sea","wave"]],
    ["I'd take my homework, so I wouldn't have to do it.",0,"Clever! But my planet will mail it back. Our post office is very fast.","かしこい！ でも ぼくの 星から 送りかえされるよ。郵便が 速いんだ","📮",["homework"]]]},
  {ask:'ズーズーに 聞いてみよう',o:[
    ["What has surprised you the most about Earth?",1,"That you put fish on rice and call it sushi. Genius!","魚を ごはんに のせて すしって よぶこと。天才！","🍣"],
    ["Do you have schools on your planet?",1,"Yes, but we learn by sleeping on books. It doesn't work.","あるよ。本の 上で ねて 学ぶ。ぜんぜん 身に つかない","😴"],
    ["Could you take me to your planet?",1,"Of course! The trip takes six hundred years, so pack snacks.","もちろん！ 600年 かかるから おやつ もってきて","🛸"],
    ["Is your head a light bulb?",0,"...It is a little shiny. Thank you? Beep.","…ちょっと 光ってるけど。ありがとう？ ピピッ","💡"]]}],
  bye:["Beep! Earth is fascinating. Thank you, professor!","ピピッ！ 地球って おもしろい。ありがとう、先生！"]},

{id:'adv-hana-idea',c:'hana',lv:'adv',t:'お店の 相談に のる',turns:[
  {s:"I'm thinking of opening a second shop. What do you think?",j:"2号店を 出そうかと 思ってるの。どう 思う？",o:[
    ["It sounds exciting, but have you considered the costs?",1,"Good point. Rent near the station is expensive...","いいところを つくわね。駅の ちかくは 家賃が 高くて…","💰",["cost","considered","exciting"]],
    ["Go for it! Your shaved ice is the best.",1,"Aww, thanks! You're my best customer.","わあ、ありがとう！ あなたは 最高の お客さんよ","🥰",["go","best"]],
    ["You should open it on the moon.",0,"On the moon?! ...No air, but very cold. Perfect for ice! Hmm...","月に？！ …空気は ないけど すごく 寒い。氷には ぴったり！ うーん…","🌕",["moon"]]]},
  {s:"Where would be the best place for it?",j:"どこが いいと 思う？",o:[
    ["Somewhere near a school, since students love sweets.",1,"Students after club activities... they'd be so thirsty!","部活の あとの 学生… きっと のどが カラカラね！","🏫",["school","student"]],
    ["Near the station, so tourists can find it easily.",1,"Tourists like Emma! She'd come every day.","エマみたいな 観光客ね！ 毎日 来そう","🚉",["station","tourist"]],
    ["Inside my bedroom.",0,"Your bedroom?! Do you want shaved ice that badly?","あなたの 部屋？！ そんなに かき氷 食べたいの？","🛏️",["bedroom"]]]},
  {s:"In winter, nobody wants shaved ice. Any ideas?",j:"冬は かき氷が 売れないの。なにか アイデア ある？",o:[
    ["You could sell hot drinks or sweet potatoes in winter.",1,"Hot cocoa in winter, ice in summer! Brilliant!","冬は ココア、夏は 氷！ 天才！","☕",["hot","drink","potato","sell"]],
    ["Why not move to Australia, where it's summer then?",1,"Ha! Follow the summer around the world! I like your style.","はは！ 世界中 夏を 追いかける！ その 発想 すき！","🦘",["australia"]],
    ["How about hot shaved ice?",0,"Hot shaved ice... that's just... water. Ha ha!","あったかい かき氷… それって ただの お湯ね！ あはは！","♨️",["hot","shaved"]]]},
  {ask:'ハナさんに 聞いてみよう',o:[
    ["Why did you start this shop?",1,"My grandma had a shop here. I wanted to keep her flavor alive.","おばあちゃんが ここで お店を してたの。その 味を 残したくて","👵"],
    ["What's the hardest part of running a shop?",1,"Rainy days. No customers, just me and the seagulls.","雨の 日。お客さんが いなくて、わたしと カモメだけ","🌧️"],
    ["Can I have free shaved ice forever?",0,"Forever?! ...How about one free one today? Deal!","ずっと？！ …きょう 1ぱい サービスで どう？","🍧"]]}],
  bye:["Thanks for the advice, partner!","アドバイス ありがとう、相棒！"]},
];
