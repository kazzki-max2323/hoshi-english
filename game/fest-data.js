/* 🏮 浜辺の お祭り（寄付）の データ（しくみは game/fest.js）
   FEST_LIST: コインを 出すと その日（1日）だけ ひらかれる お祭り
     p: 寄付の コイン / night・day: 浜辺で 見られる ショー（beach/scene.js の SHOW 名・夜と 昼）/ talks: だれと すごすか → FEST_TALKS の id
     stalls: 屋台あり（FEST_STALLS）/ wish: ねがいごとを 書ける（FEST_WISHES）
   FEST_TALKS: 会話（mio-chat.js の 形。 who:'mina' は ミナ先生、 ほかは ミオの 顔。 f:'👦' などは ほかの 人）
     lv:[英語,日本語] = 恋の とちゅう・こいびとの ときの セリフ（ミナ先生 / ミオ）。 答えの o[5] は そうでない ときの 答え */

const FEST_LIST=[
 {id:'fw',ico:'🎆',n:'花火大会',en:'a fireworks show',p:1500,d:'夜空に 大きな 花火。 だれかと いっしょに 見よう',night:['grandfw','fw_yanagi','fw_odama','fw_cute'],day:['balloonfest'],talks:['ft_fw_mina','ft_fw_mio']},
 {id:'matsuri',ico:'🏮',n:'夏祭り',en:'a summer festival',p:2000,d:'屋台が ならぶ お祭り。 金魚すくい・わたあめ・射的・ヨーヨー',night:['fest','bonodori'],day:['fest','balloons'],talks:['ft_mt_mina','ft_mt_mio'],stalls:1},
 {id:'toro',ico:'🕯️',n:'灯ろう流し',en:'a lantern festival',p:1200,d:'ねがいを 英語で 書いて、 海に 灯ろうを うかべる',night:['torofest','lanterns'],day:['fest'],talks:['ft_toro'],wish:1},
 {id:'kite',ico:'🪁',n:'たこあげ大会',en:'a kite festival',p:800,d:'空いっぱいの たこ。 リクくんと たこあげ',night:['lightparade'],day:['kitefest','odako'],talks:['ft_kite']},
 {id:'sand',ico:'🏰',n:'砂の お城コンテスト',en:'a sandcastle contest',p:1000,d:'ミオと チームで 砂の お城を 作る',night:['candlepath'],day:['fest'],ev:'sandcastle',talks:['ft_sand']},
 {id:'live',ico:'🎶',n:'浜辺の コンサート',en:'a beach concert',p:1500,d:'ノラさんと ピップの ステージ。 英語の 歌',night:['laser','lightparade'],day:['bubbles','fest'],talks:['ft_live']}];

/* 寄付の 合計で もらえる 称号 */
const FEST_TITLES=[[0,'🌱','はじめての 寄付'],[3000,'🎐','浜辺の サポーター'],[10000,'🏮','お祭り名人'],[30000,'🎆','浜辺の 名誉町民']];

const FEST_TALKS=[
{id:'ft_fw_mina',who:'mina',ico:'🎆',t:'ミナ先生と 花火',nodes:{
 s:{m:["You came! The fireworks start at eight. I found a good spot. Come sit here, on the sand.","来てくれた！ 花火は 8時から。 いい 場所 見つけたの。 ここ、 砂の 上に すわって。"],ex:'happy',o:[
  ["Thank you, Sensei. What a perfect spot.","ありがとう、 先生。 さいこうの 場所 ですね。",'a',2],["I brought some drinks.","飲み物 持ってきました。",'a',2],["Is it okay if I sit next to you?","となりに すわっても いいですか？",'b',1,null,["Is this spot okay?","ここで いいですか？"]]]},
 b:{m:["Of course! … Why are you asking so politely? You're making me nervous. Ha ha.","もちろん！ … なんで そんなに ていねいに 聞くの？ こっちまで きんちょう しちゃう。 あはは。"],ex:'wow',o:[["Sorry. Ha ha.","すみません。 あはは。",'a',1]]},
 a:{m:["There it goes! Look — a huge one! In Japanese we shout 'Tamaya!' In English, people just say 'Wow!' or 'Ooh!' Ha ha.","あがった！ 見て、 大きい！ 日本では 「たまや〜！」って さけぶよね。 英語では 「Wow!」とか 「Ooh!」だけ。 あはは。"],ex:'wow',nt:[["fireworks","「花火」。 ふつう 複数形。 a fireworks show / watch the fireworks"]],o:[
  ["Ooh! Beautiful!","おおー！ きれい！",'c',1],["Tamaya!","たまや〜！",'c',1],["Which one do you like best?","どれが いちばん 好きですか？",'d',2]]},
 d:{m:["The ones that fall slowly, like a willow tree. They look like golden rain. … They disappear, but you remember them.","ゆっくり おちてくる やつ。 やなぎの 木 みたいな。 金色の 雨 みたい。 … 消えちゃうけど、 心に のこるの。"],ex:'smile',o:[["Like a good lesson.","いい 授業 みたいに。",'g1',2],["Like today.","きょう みたいに。",'g2',2]]},
 c:{m:["… You know, fireworks only last a few seconds. That's why we look so carefully. We don't want to miss them.","… ねえ、 花火って 数秒しか ないでしょ。 だから みんな じっと 見るの。 見のがしたく ないから。"],ex:'smile',o:[["Then let's not miss a single one.","じゃあ 1つも 見のがさないように しよう。",'g2',2],["I'm hungry. Is there a food stand?","おなか すいた。 屋台 ありますか？",'f1',1]]},
 g1:{m:["A good lesson? … Ha ha, that's the nicest thing a student has ever said to me. I'll remember that one.","いい 授業？ … あはは、 生徒に 言われた ことばで いちばん うれしい。 それも 心に のこしておくね。"],ex:'happy',end:'good'},
 g2:{m:["… Yes. Let's watch every single one. Together. … The last one is coming. Ready? … Three, two, one—","… うん。 1つも のこさず 見よう。 いっしょに。 … さいごの 1発が 来る。 いい？ … 3、 2、 1…"],lv:["… Yes. Together. … Hey. Can I lean on your shoulder? Just until the last one. … Thank you.","… うん。 いっしょに。 … ねえ。 かたに もたれても いい？ さいごの 1発まで。 … ありがとう。"],ex:'smile',end:'good'},
 f1:{m:["Now?! In the middle of the fireworks?! … Ha ha ha! Okay, okay. Yakisoba after the finale. My treat.","いま！？ 花火の まっさいちゅうに！？ … あはは！ はいはい。 フィナーレの あとで やきそば。 先生の おごり。"],ex:'happy',end:'fun'}}},
{id:'ft_fw_mio',ico:'🎆',t:'ミオと 花火',nodes:{
 s:{m:["Boss! Over here! I've been saving this spot since five o'clock! … My legs fell asleep. Ha ha.","店長！ こっち！ 5時から 場所とり してたんです！ … 足が しびれた。 あはは。"],ex:'laugh',p:'wave',o:[
  ["Since five?! Thank you!","5時から！？ ありがとう！",'a',2],["You're amazing, Mio.","ミオ、 すごいね。",'a',2],["Your legs fell asleep? Ha ha.","足が ねちゃった？ あはは。",'z',1]]},
 z:{m:["'My leg fell asleep' means it's tingly. Not that it's snoring! … Help me up. Ouch, ouch, ouch!","「My leg fell asleep」は しびれたって こと。 足が いびき かいてるん じゃ ないよ！ … おこして。 いたた、 いたた！"],ex:'oops',nt:[["My leg fell asleep.","「足が しびれた」。 英語では 足が 「ねむった」と 言う"]],o:[["Here, take my hand.","はい、 手を かして。",'a',2]]},
 a:{m:["It's starting! … Wow! Boss, that one was heart-shaped! Did you see?!","はじまった！ … わあ！ 店長、 いまの ハートの 形！ 見た！？"],ex:'laugh',o:[
  ["I saw it! So cute!","見た！ かわいい！",'b',1],["I was looking at you.","ミオを 見てた。",'c',2,null,["I missed it! Next one!","見のがした！ つぎ！"]],["Was it a heart? It looked like a potato.","ハート？ じゃがいもに 見えた。",'f1',0]]},
 c:{m:["At me?! Boss! The fireworks are up there! … Ugh, now I can't look at you. Or the fireworks. My face is too hot!","わたしを！？ 店長！ 花火は あっち！ … もう、 店長も 花火も 見られない。 顔が あつすぎる！"],fr:["Then look up! Here comes another one! Three… two… one…!","じゃあ 上 見て！ また 来るよ！ 3… 2… 1…！"],ex:'oops',o:[["Ha ha. Okay, I'm looking up.","あはは。 わかった、 上 見る。",'b',1]]},
 b:{m:["Boss… I'm really glad I came to this beach. If I didn't, I wouldn't be watching fireworks with you right now.","店長… この 浜辺に 来て ほんとに よかった。 来なかったら、 いま 店長と 花火 見てないもん。"],ex:'smile',o:[["I'm glad too.","ぼくも よかった。",'g1',2],["Let's watch them again next year.","来年も また 見よう。",'g2',2]]},
 g1:{m:["… Shh. The finale. Make a wish when the biggest one opens. … Did you? I did. I won't tell you what it was. Ha ha.","… しっ。 フィナーレ。 いちばん 大きいのが ひらいたら ねがいごと して。 … した？ わたしは した。 なにかは ないしょ。 あはは。"],ex:'smile',end:'good'},
 g2:{m:["Next year! Promise? And the year after that, and after that… Okay, I'll stop. Ha ha. But I mean it.","来年！ 約束？ その次の 年も、 その次も… はい、 やめます。 あはは。 でも 本気だよ。"],ex:'laugh',p:'peace',nt:[["I mean it.","「本気だよ」。 じょうだんじゃ ない と つたえる"]],end:'good'},
 f1:{m:["A potato?! Boss, you have no romance! … Ha ha ha! Now every firework looks like a potato to me. Thanks a lot!","じゃがいも！？ 店長、 ロマンが ない！ … あはは！ もう ぜんぶの 花火が じゃがいもに 見える。 どうも ありがとう！"],ex:'laugh',end:'fun'}}},
{id:'ft_mt_mina',who:'mina',ico:'🏮',t:'ミナ先生と 夏祭り',nodes:{
 s:{m:["Ta-da! I wore a yukata today. It's been years! … Is it strange?","じゃーん！ きょうは ゆかた。 何年ぶり かな！ … へん じゃない？"],ex:'happy',o:[
  ["It looks great on you!","すごく にあってます！",'a',2],["You look like a different person.","べつの 人 みたい です。",'b',1],["Is it hard to walk in?","歩きにくく ないですか？",'c',1]]},
 b:{m:["A different person? Is that good or bad? … I'll take it as a compliment. Thank you!","べつの 人？ それって いい いみ？ わるい いみ？ … ほめことばと して うけとっておくね。 ありがとう！"],ex:'think',nt:[["I'll take it as a compliment.","「ほめことばと して うけとるね」。 ほめられたか びみょうな ときの 返し"]],o:[["It's a compliment!","ほめてます！",'a',1]]},
 c:{m:["Very hard! I can only take tiny steps. Like a penguin. … Don't laugh!","すごく！ 小さい 歩はばでしか 歩けないの。 ペンギン みたいに。 … わらわないで！"],ex:'wow',o:[["I'll walk slowly with you.","ゆっくり いっしょに 歩きます。",'a',2]]},
 a:{m:["Let's go around the stalls! Ooh, they have candy apples. And takoyaki. And shaved ice… I want everything.","屋台を まわろう！ わあ、 りんごあめ。 たこやき。 かき氷も… ぜんぶ ほしい。"],ex:'happy',nt:[["a food stand / a stall","「屋台」。 お祭りの 屋台は food stand や stall"]],o:[
  ["Let's share everything, then.","じゃあ ぜんぶ わけっこ しましょう。",'d',2],["Shaved ice! What flavor?","かき氷！ 何味？",'e',1]]},
 e:{m:["Blue Hawaii, of course! … Look, my tongue is blue! Ha ha. Is yours blue too? Show me!","もちろん ブルーハワイ！ … 見て、 舌が まっさお！ あはは。 あなたも 青い？ 見せて！"],ex:'happy',o:[["Look! Bleh!","見て！ べー！",'g2',1]]},
 d:{m:["Sharing is the best way to eat at festivals. … You know, I used to come to festivals with my friends every summer. I'm happy to have a festival friend again.","わけっこが お祭りの いちばんの 食べ方。 … ねえ、 むかしは 毎年 友だちと お祭りに 来てたの。 また お祭り友だちが できて うれしい。"],lv:["Sharing is the best way to eat at festivals. … You know, I always wanted to come to a festival like this. With someone special. … And now I have.","わけっこが お祭りの いちばんの 食べ方。 … ねえ、 ずっと こういう お祭りに 来たかったの。 大事な 人と。 … いま、 かなった。"],ex:'smile',o:[["Let's come every summer.","毎年 夏に 来ましょう。",'g1',2]]},
 g1:{m:["Every summer. That's a promise. … Here, half a candy apple. The half with more candy. Because you're my favorite student.","毎年 夏に。 約束ね。 … はい、 りんごあめ 半分。 あめが 多い ほう。 いちばん すきな 生徒 だから。"],lv:["Every summer. That's a promise. … Here, half a candy apple. The sweeter half. For you.","毎年 夏に。 約束ね。 … はい、 りんごあめ 半分。 あまい ほう。 あなたに。"],ex:'happy',end:'good'},
 g2:{m:["Ha ha ha! We both have blue tongues! We look like aliens! … This is the best festival ever.","あはは！ ふたりとも 舌が 青い！ 宇宙人 みたい！ … 今までで いちばんの お祭り。"],ex:'happy',end:'fun'}}},
{id:'ft_mt_mio',ico:'🏮',t:'ミオと 夏祭り',nodes:{
 s:{m:["Boss! Let's have a contest! Whoever wins more prizes at the stalls is the winner. The loser buys takoyaki!","店長！ しょうぶ しましょう！ 屋台で 景品を たくさん とった ほうが かち。 まけた ほうが たこやき おごり！"],ex:'laugh',p:'guts',o:[["You're on!","受けて たつ！",'a',1],["I'll buy takoyaki anyway.","どっちにしても たこやき おごるよ。",'b',2]]},
 b:{m:["Really?! … No, no, a contest is a contest! I want to win fair and square!","ほんと！？ … ううん、 しょうぶは しょうぶ！ 正々堂々と かちたいの！"],ex:'wink',nt:[["fair and square","「正々堂々と」。 ずるを しないで"]],o:[["Okay, let's go!","よし、 行こう！",'a',1]]},
 a:{m:["First, goldfish scooping! … Ah! My paper broke! Boss, how are you so good at this?!","まずは 金魚すくい！ … あっ！ 紙が やぶれた！ 店長、 なんで そんなに うまいの！？"],ex:'oops',o:[
  ["Move slowly. Like this.","ゆっくり 動かすんだよ。 こう。",'c',2],["I'm a goldfish master.","金魚すくいの 名人 だから。",'c',1]]},
 c:{m:["Like this…? I got one! I got one! Look, boss! … I'll name him 'Takoyaki'. Ha ha!","こう…？ とれた！ とれた！ 見て、 店長！ … 名前は 「たこやき」に する。 あはは！"],ex:'laugh',p:'peace',o:[["Great job! You win.","やったね！ ミオの かち。",'g1',2],["That's one. I have five.","1ぴきね。 ぼくは 5ひき。",'f1',1]]},
 g1:{m:["Wait, really? I win? … Then I'll buy the takoyaki! Winner's treat! That's my rule. Ha ha. Say 'ah'!","ほんと？ わたしの かち？ … じゃあ わたしが たこやき おごる！ かった ほうが おごるの。 わたしの ルール。 あはは。 はい、 あーん！"],fr:["Wait, really? I win? … Then I'll buy the takoyaki! Winner's treat! That's my rule. Ha ha.","ほんと？ わたしの かち？ … じゃあ わたしが たこやき おごる！ かった ほうが おごるの。 わたしの ルール。 あはは。"],ex:'laugh',end:'good'},
 f1:{m:["Five?! … Okay, I lose. Takoyaki is on me. But next year, I'm practicing every day. Watch out!","5ひき！？ … まけた。 たこやきは わたしの おごり。 でも 来年は 毎日 練習する。 見てなさい！"],ex:'oops',end:'fun'}}},
{id:'ft_toro',who:'mina',ico:'🕯️',t:'灯ろうの ねがい',nodes:{
 s:{m:["Did you write your wish on the lantern? In English? … Can I read it? Only if you want.","灯ろうに ねがいごと 書いた？ 英語で？ … 読んでも いい？ いやなら いいよ。"],ex:'smile',o:[["Sure. Here.","いいですよ。 はい。",'a',2],["It's a secret.","ひみつです。",'b',1]]},
 b:{m:["A secret wish. That's okay. Wishes are stronger when you keep them in your heart. … Then I'll keep mine secret too.","ひみつの ねがい。 いいよ。 心に しまっておくと、 ねがいは 強く なるの。 … じゃあ わたしも ひみつ。"],ex:'smile',o:[["Let's float them together.","いっしょに 流しましょう。",'c',1]]},
 a:{m:["'{wish}' … That's a beautiful wish. And your grammar is perfect! Even at a festival, I'm still a teacher. Ha ha.","「{wish}」… すてきな ねがい。 それに 文法も かんぺき！ お祭りでも わたしは 先生 だね。 あはは。"],ex:'happy',nt:[["I hope … / I wish …","I hope は 「〜だと いいな」（かないそう）。 I wish I could は 「〜できたら いいのに」（むずかしそう）"]],o:[["What did you write, Sensei?","先生は なんて 書いたんですか？",'d',2]]},
 d:{m:["Mine? 'I hope all my students find their own way.' … Ha ha, it's a little too much like a teacher, right?","わたし？ 「生徒 みんなが 自分の 道を 見つけられますように」。 … あはは、 ちょっと 先生っぽ すぎるよね？"],lv:["Mine? 'I hope I can stay by your side.' … Don't look at me like that! Float your lantern! Quick!","わたし？ 「あなたの そばに いられますように」。 … そんな 顔で 見ないで！ ほら、 灯ろう 流して！ はやく！"],ex:'smile',o:[["It's a wonderful wish.","すてきな ねがいです。",'c',2]]},
 c:{m:["Look. All the lanterns are floating out to sea. Hundreds of wishes, all together. … I think the sea will take good care of them.","見て。 灯ろうが ぜんぶ 海へ 流れていく。 何百もの ねがいが いっしょに。 … 海が 大事に して くれると 思う。"],ex:'smile',o:[["I think so too.","ぼくも そう 思います。",'g1',2],["Will the fish read them?","魚が 読むかな？",'f1',1]]},
 g1:{m:["… Thank you for spending tonight with me. This is a night I'll remember for a long, long time.","… 今夜、 いっしょに いて くれて ありがとう。 ずっと ずっと おぼえておく 夜に なったよ。"],ex:'smile',end:'good'},
 f1:{m:["The fish?! Ha ha ha! Then the fish will learn English! 'I hope…' says the fish. Blub blub.","魚が！？ あはは！ じゃあ 魚も 英語を おぼえるね。 「I hope…」って 言う 魚。 ぶくぶく。"],ex:'happy',end:'fun'}}},
{id:'ft_kite',ico:'🪁',t:'リクと たこあげ',nodes:{
 s:{f:'👦',m:["Teacher! Look at my kite! It's a dragon! I made it myself! … Well, my mom helped. A little. A lot.","先生！ ぼくの たこ 見て！ ドラゴン！ 自分で 作ったんだ！ … まあ、 ママも 手伝った。 ちょっと。 いっぱい。"],o:[["Wow, it's so cool!","わあ、 かっこいい！",'a',2],["Can it fly?","とぶの？",'b',1]]},
 b:{f:'👦',m:["Of course it can fly! It's a DRAGON! … I think. Let's try!","とぶに きまってるよ！ ドラゴン だもん！ … たぶん。 やってみよう！"],o:[["Okay! Run!","よし！ はしって！",'a',1]]},
 a:{f:'👦',m:["Hold the string! I'll run! … It's going up! Up, up, up! … Teacher, how do you say 'higher' in English? I want to shout it!","糸 もってて！ ぼく はしる！ … あがった！ 上へ 上へ！ … 先生、 「もっと 高く」って 英語で なんて いうの？ さけびたい！"],o:[
  ["'Higher!' Fly higher!","「Higher!」 Fly higher!（もっと 高く とべ！）",'c',2],["'Up!' Go up!","「Up!」 Go up!",'c',1],["'Big!'","「Big!」",'d',0]]},
 d:{f:'👦',m:["'Big'? … Hmm, the kite is big, but I want it to go UP. Is it 'big up'? … Ha ha, that's funny!","「Big」？ … うーん、 たこは 大きいけど、 上に 行って ほしいの。 「ビッグ アップ」？ … あはは、 へんなの！"],o:[["Sorry. It's 'higher'.","ごめん。 「higher」だよ。",'c',1]]},
 c:{f:'👦',m:["HIGHER! FLY HIGHER, DRAGON! … Teacher! It's the highest kite on the beach! We're number one!","HIGHER! FLY HIGHER, DRAGON! … 先生！ 浜辺で いちばん 高い たこ！ ぼくたち 1ばん！"],nt:[["higher / the highest","high（高い）→ higher（もっと 高い）→ the highest（いちばん 高い）。 くらべる ときの 形"]],o:[["We're number one!","ぼくたち 1ばん！",'g1',2],["Careful! The wind is strong!","気をつけて！ 風が 強いよ！",'g2',1]]},
 g1:{f:'👦',m:["Yay! … Teacher, thank you for coming. Kites are more fun with two people. One holds the string, and one cheers!","やったー！ … 先生、 来てくれて ありがとう。 たこあげは 2人の ほうが 楽しいね。 1人が 糸を もって、 1人が おうえん！"],end:'good'},
 g2:{f:'👦',m:["Whoa, whoa! … Phew. You saved my dragon! You're a kite hero, teacher! … What's 'hero' in Japanese? Oh, it's the same!","わわっ！ … ふう。 ドラゴン たすかった！ 先生は たこの ヒーローだ！ … 「hero」って 日本語で なに？ あ、 同じか！"],end:'ok'}}},
{id:'ft_sand',ico:'🏰',t:'ミオと 砂の お城',nodes:{
 s:{m:["Team Boss and Mio, ready! We have one hour to build the best sandcastle. What should we make?","チーム 店長と ミオ、 じゅんび オッケー！ 1時間で いちばんの 砂の お城を 作るの。 なにを 作る？"],ex:'laugh',p:'guts',o:[
  ["A castle with four towers!","塔が 4つの お城！",'a',2],["Our card shop, made of sand!","砂で ぼくたちの カードショップ！",'b',2],["A giant sand turtle.","大きな 砂の カメ。",'c',1]]},
 a:{m:["Four towers! Okay, you make the towers, I'll dig the moat around it. … What's a moat? It's the water around a castle!","塔 4つ！ よし、 店長は 塔、 わたしは まわりの ほりを ほる。 … moat って なにかって？ お城の まわりの 水の みぞ！"],ex:'smile',nt:[["a moat","「（お城の）ほり」。 castle・tower（塔）・bridge（橋）も いっしょに"]],o:[["Let's add a bridge, too.","橋も つけよう。",'d',2]]},
 b:{m:["Our shop?! That's genius! I'll make tiny cards with shells. And a tiny me at the counter! … And a tiny you sleeping in the back. Ha ha!","わたしたちの お店！？ 天才！ 貝がらで 小さい カード 作る。 カウンターに 小さい わたしも！ … おくで ねてる 小さい 店長も。 あはは！"],ex:'laugh',o:[["Hey! I don't sleep at work!","ちょっと！ しごと中に ねてないよ！",'d',1]]},
 c:{m:["A turtle? Cute! … Wait, it looks like a rice ball. Boss, what is this? Ha ha ha!","カメ？ かわいい！ … まって、 おにぎりに 見える。 店長、 これ なに？ あはは！"],ex:'laugh',o:[["It's a turtle! … Maybe.","カメだよ！ … たぶん。",'d',1]]},
 d:{f:'👩‍🦳',m:["Time's up! The judges are coming! … Oh my. What a lovely piece of work. Tell me about it, you two.","しゅうりょう！ しんさいんが 来るよ！ … まあ。 すてきな 作品ね。 2人で せつめい して くれる？"],o:[
  ["We worked on it together as a team.","チームで いっしょに 作りました。",'g1',2],["Mio did most of the work.","ほとんど ミオが 作りました。",'g2',2],["It's called 'Rice Ball Castle'.","名前は 「おにぎり城」です。",'f1',1]]},
 g1:{f:'👩‍🦳',m:["Teamwork! I can see it in every corner. First prize goes to… Team Boss and Mio!","チームワーク！ すみずみまで わかるわ。 1位は… チーム 店長と ミオ！"],nt:[["first prize","「1位・優勝」。 win first prize（1位を とる）"]],end:'good'},
 g2:{m:["Boss! That's not true! You built the towers! … We're a team, so we share the prize. Half and half. Okay?","店長！ そんなこと ない！ 塔を 作ったのは 店長！ … チーム だから 賞は はんぶんこ。 いい？"],ex:'smile',end:'good'},
 f1:{f:'👩‍🦳',m:["'Rice Ball Castle'! Ha ha ha! Special prize for the funniest name! Pip loves it too. Don't you, Pip?","「おにぎり城」！ あはは！ いちばん おもしろい 名前で とくべつ賞！ ピップも 気に入ったって。 ね、 ピップ？"],end:'fun'}}},
{id:'ft_live',ico:'🎶',t:'浜辺の コンサート',nodes:{
 s:{m:["Boss, the concert is starting! Nora-san is singing! And Pip is the backup singer! Ha ha!","店長、 コンサート はじまる！ ノラさんが 歌うの！ ピップは コーラス！ あはは！"],ex:'laugh',p:'wave',o:[["Let's get closer!","近くに 行こう！",'a',1],["Pip can sing?","ピップ、 歌えるの？",'b',1]]},
 b:{m:["He only knows one word: 'Hello!' But he says it in rhythm. It's actually pretty good!","ことばは 1つだけ。 「Hello!」。 でも リズムに のって 言うの。 けっこう うまいよ！"],ex:'wink',o:[["Ha ha, I can't wait.","あはは、 楽しみ。",'a',1]]},
 a:{f:'👩‍🦳',m:["♪ 'Twinkle, twinkle, little star, how I wonder what you are…' ♪ Everyone, sing with me!","♪ きらきら ひかる 小さな 星よ、 あなたは いったい なんなのかしら… ♪ みんなも いっしょに！"],nt:[["Twinkle, twinkle, little star","「きらきら星」の 英語の 歌詞。 how I wonder what you are = あなたは なにかしら と ふしぎに 思う"]],o:[
  ["♪ Up above the world so high… ♪","♪ 世界の 上 たかく… ♪",'c',2],["(Clap along)","（手拍子する）",'c',1],["(Sing very loudly)","（とても 大きな 声で 歌う）",'d',1]]},
 d:{m:["Boss! Ha ha ha! Everyone is looking at you! … Okay, I'll sing loudly too! ♪ LIKE A DIAMOND IN THE SKY! ♪","店長！ あはは！ みんな こっち 見てる！ … よし、 わたしも 大きな 声で！ ♪ LIKE A DIAMOND IN THE SKY! ♪"],ex:'laugh',o:[["♪ Twinkle, twinkle! ♪","♪ きらきら！ ♪",'f1',1]]},
 c:{f:'🦜',m:["HELLO! HELLO! HELLO!","ハロー！ ハロー！ ハロー！"],o:[["Ha ha! Perfect timing, Pip!","あはは！ タイミング ばっちり、 ピップ！",'e',1]]},
 e:{m:["… Boss, music is like magic. I didn't know all the words when I was little, but I sang anyway. That's how I started loving English.","… 店長、 音楽って 魔法 みたい。 小さい ころ 歌詞が ぜんぶ わからなくても 歌ってた。 それで 英語が 好きに なったの。"],ex:'smile',o:[["Me too. Let's sing more together.","ぼくも。 もっと いっしょに 歌おう。",'g1',2],["Next time, let's sing on stage.","つぎは ステージで 歌おう。",'g2',1]]},
 g1:{m:["Yes! … ♪ Twinkle, twinkle, little star… ♪ Ha ha, our voices sound nice together, don't they?","うん！ … ♪ きらきら ひかる… ♪ あはは、 2人の 声、 合ってる よね？"],ex:'smile',end:'good'},
 g2:{m:["On stage?! Me?! … Okay. But only if you play the guitar. Deal?","ステージで！？ わたしが！？ … いいよ。 でも 店長が ギター ひく なら。 きまり？"],ex:'oops',end:'ok'},
 f1:{f:'👩‍🦳',m:["Ha ha! The loudest fans tonight! Let's give them a big hand, everyone!","あはは！ 今夜 いちばん 元気な ファンね！ みんな、 2人に 大きな はくしゅを！"],nt:[["Give them a big hand.","「大きな はくしゅを」。 hand は 「はくしゅ」の いみにも なる"]],end:'fun'}}}];

/* 🏮 夏祭りの 屋台（1つの お祭りで 1回ずつ）。 q:[英語,日本語] o:[英語,日本語,正解] ok/ng: 屋台の 人の 返事 / sv: おみやげ */
const FEST_STALLS=[
 {id:'st_kingyo',ico:'🐟',n:'金魚すくい',who:'🧑',q:["Want to try goldfish scooping? One try is one coin! What do you say?","金魚すくい やる？ 1回 1まいだよ！ なんて 言う？"],
  o:[["One try, please.","1回 おねがいします。",1],["One goldfish, please.","金魚 1ぴき ください。",0],["I'm a goldfish.","わたしは 金魚です。",0]],ok:["Here's your scooper! Gently… gently… You got one!","はい、 ポイ！ そーっと… そーっと… とれた！"],ng:["Ha ha, you have to catch it yourself! Here's your scooper.","あはは、 自分で すくうんだよ！ はい、 ポイ。"],sv:{ico:'🐠',n:'金魚',en:'a goldfish',fish:1}},
 {id:'st_wata',ico:'🍭',n:'わたあめ',who:'👵',q:["Cotton candy! Pink or white? Which one would you like?","わたあめ！ ピンクと 白、 どっちが いい？"],
  o:[["I'd like the pink one, please.","ピンクを ください。",1],["Yes, please.","はい、 おねがいします。",0],["I like cotton.","わたしは 綿が 好きです。",0]],ok:["Pink it is! Look, it's as big as your head!","ピンクね！ ほら、 頭くらい 大きいよ！"],ng:["'Yes'? Ha ha, I asked which one! … I'll give you pink. Everyone loves pink.","「はい」？ あはは、 どっちか 聞いたのよ！ … ピンクに しとくね。 みんな ピンクが 好き。"],sv:{ico:'🍭',n:'わたあめ',en:'cotton candy'}},
 {id:'st_shateki',ico:'🎯',n:'射的',who:'👴',q:["Step right up! Aim carefully… Which prize are you aiming for?","さあ さあ！ よく ねらって… どの 景品を ねらう？"],
  o:[["I'm aiming for the bear.","クマを ねらってます。",1],["I'm a bear.","わたしは クマです。",0],["Aim, please.","ねらって ください。",0]],ok:["The bear? Good eye! … Bang! You got it!","クマ？ いい 目だ！ … パン！ あたり！"],ng:["Ha ha! I'll give you the bear for making me laugh!","ははは！ 笑わせて くれたから クマを あげよう！"],sv:{ico:'🧸',n:'クマの ぬいぐるみ',en:'a teddy bear'}},
 {id:'st_yoyo',ico:'🎈',n:'ヨーヨーつり',who:'👧',q:["Water balloon fishing! Do you know how to do it?","ヨーヨーつり！ やり方 わかる？"],
  o:[["Could you show me how?","やり方を 見せて くれる？",1],["I know it.","それ 知ってる。",0],["How old are you?","何さい？",0]],ok:["Sure! Hook the rubber band, then lift slowly. … Like that! You did it!","いいよ！ ゴムに ひっかけて、 ゆっくり もちあげる。 … そう！ できた！"],ng:["Ha ha, okay! Just hook it and lift! … You got one anyway!","あはは、 いいよ！ ひっかけて もちあげるだけ！ … とれたね！"],sv:{ico:'🎈',n:'水ヨーヨー',en:'a water balloon yo-yo'}}];

/* 🕯️ 灯ろうに 書く ねがい（えらぶ） */
const FEST_WISHES=[
 ["I hope my English gets better.","英語が もっと うまく なりますように。"],
 ["I hope everyone on this beach stays healthy.","浜辺の みんなが 元気で いられますように。"],
 ["I wish I could fly like a bird.","鳥の ように とべたら いいのに。"],
 ["I hope I can travel around the world someday.","いつか 世界を 旅 できますように。"],
 ["I hope my friends are happy.","友だちが しあわせ でありますように。"],
 ["I wish every day were a festival.","毎日が お祭り だったら いいのに。"]];
