/* 💗 ラブストーリーの つづき: デート・ランダムイベント・季節・やきもち（しくみは game/love.js）
   ノードの 形は love-data.js と おなじ: {s:[英語,訳],ex,who, o:[[英語,訳,点,つぎ,返事英語,返事訳,ひとこと]]}
   who: 'h' ＝ ハマ子、 'n' ＝ ノラさん（なしは ミナ先生）
   ends: 点が need 以上 → good、 その 半分 以上 → ok、 それより 下 → fun。 [タイトル, 英語, 訳] */
/* ================= 🌅 デート（友だち 以上 から） ================= */
const LOVE_DATES=[
{id:'d_sunset',t:'夕日の 浜辺',ico:'🌅',need:5,
 intro:'夕方の 浜辺。 空が オレンジ色に そまっていく…',
 ends:{good:['夕日の やくそく',"Let's watch the sunset together every year. That's a promise.","毎年 いっしょに 夕日を 見よう。 約束ね。"],
  ok:['オレンジ色の 写真',"I'll keep this picture forever.","この 写真、 ずっと とっておくね。"],
  fun:['はらぺこ デート',"Okay, okay. Let's go eat something!","はいはい。 なにか 食べに 行こう！"]},
 nodes:{
  a:{s:["The sky is turning orange. Isn't it beautiful?","空が オレンジ色に なってきた。 きれいじゃない？"],ex:'love',o:[
   ["Yes. I'm glad I'm watching it with you.","うん。 いっしょに 見られて うれしい。",2,'b',"Me too.","わたしも。"],
   ["Not as beautiful as you.","先生ほど きれいじゃ ないけど。",2,'b',"W-what? That's so cheesy! ...But thanks.","な、 なに？ くさい セリフ！ …でも ありがと。"],
   ["It looks like a giant orange.","でっかい オレンジ みたい。",1,'b',"Haha! Now I'm hungry.","あはは！ おなか すいてきた。"]]},
  b:{s:["Let's take a picture. Come closer.","写真 とろう。 もっと こっち 来て。"],ex:'happy',o:[
   ["Like this? Say cheese!","こう？ はい、 チーズ！",2,'c',"Perfect! We look happy.","ばっちり！ しあわせそう。"],
   ["I'm shy... Just a little closer.","はずかしい… ちょっと だけね。",1,'c',"Hehe, you're red.","ふふ、 顔 赤いよ。"],
   ["I'll take it. You stand over there.","わたしが とる。 そっちに 立って。",0,'c',"Eh? Together, I said!","えー？ いっしょに って 言ったのに！","Come closer は「もっと 近くに 来て」。 ふたりで とりたいんだね"]]},
  c:{s:["The sun is almost gone. Make a wish before it disappears.","もうすぐ 日が しずむ。 消える 前に ねがいごと して。"],ex:'smile',o:[
   ["I wish we could watch every sunset together.","すべての 夕日を いっしょに 見られますように。",2,'end',"...That's my wish too.","…わたしも おなじ ねがい。"],
   ["I wish for good weather tomorrow.","あした 晴れますように。",1,'end',"That's a nice wish.","いい ねがいだね。"],
   ["I wish for a big dinner.","ごはん いっぱい 食べられますように。",0,'end',"Hahaha!","あはは！","I wish we could ～ で「〜できたら いいな」"]]}}},
{id:'d_cape',t:'岬の さんぽ',ico:'🗼',need:5,
 intro:'浜辺の 左の 岬。 灯台まで ふたりで 歩く…',
 ends:{good:['岬の 永遠',"I'll remember today for the rest of my life.","きょうの ことは 一生 わすれない。"],
  ok:['クジラを さがして',"Next time, let's find the whale together.","こんどは いっしょに クジラ 見つけようね。"],
  fun:['つかれた 足',"Okay, let's rest. I'll carry the bag.","じゃあ 休もう。 かばん もって あげる。"]},
 nodes:{
  a:{s:["The wind is strong today. Hold on to your hat!","きょうは 風が つよいね。 ぼうし 飛ばされないで！"],ex:'wow',o:[
   ["Let's hold hands so we don't get blown away.","飛ばされないように 手を つなごう。",2,'b',"...Okay. Just for safety.","…うん。 あんぜんの ためね。"],
   ["I don't have a hat.","ぼうし ないよ。",1,'b',"Ha, you're right.","あ、 そうだった。"],
   ["Let's go home.","帰ろう。",0,'b',"Already? We just got here!","もう？ いま 来たのに！","さそわれたら、 まずは 楽しもう"]]},
  b:{s:["Look, a whale! Over there!","見て、 クジラ！ あそこ！"],ex:'wow',o:[
   ["Wow, I've never seen one this close!","わあ、 こんなに 近くで 見たの はじめて！",2,'c',"Me neither! We're so lucky.","わたしも！ ラッキーだね。"],
   ["Where? ...Oh, it's a rock.","どこ？ …あ、 岩だ。",1,'c',"No, it was really a whale! ...Oh, it's gone.","ほんとに クジラだって！ …あ、 もぐっちゃった。"],
   ["Whales are fish.","クジラは 魚だよ。",0,'c',"Actually, whales are mammals.","じつは クジラは ほにゅう類 なんだよ。","whale は mammal（ほにゅう類）。 先生の 豆知識"]]},
  c:{s:["I wish this moment could last forever.","この 時間が ずっと つづけば いいのに。"],ex:'love',o:[
   ["Then let's come back again and again.","じゃあ 何度でも 来よう。",2,'end',"Yes. Again and again.","うん。 何度でも。"],
   ["Me too. Time flies when I'm with you.","わたしも。 いっしょだと 時間が すぐ たつ。",2,'end',"Time flies... I know.","時間が 飛ぶ… わかる。"],
   ["My legs are tired.","足が つかれた。",0,'end',"Oh, come on... okay, okay.","もう… はいはい。","Time flies は「時間が すぐ たつ」。 ロマンチックな ときに つかえるよ"]]}}},
{id:'d_shop',t:'雑貨店で おかいもの',ico:'🏚️',need:5,
 intro:'浜辺の 右はしの ながれぎ雑貨店。 ふたりで 品物を 見てまわる…',
 ends:{good:['おそろいの マグ',"Every time I drink from it, I'll think of you.","これで のむ たびに、 あなたを 思い出すね。"],
  ok:['ないしょの デート',"Shh. It's our little secret.","しーっ。 ふたりの ひみつね。"],
  fun:['ノラさん だれ？',"You've been here a hundred times!","100回は 来てるでしょ！"]},
 nodes:{
  a:{s:["Nora's shop! I love coming here. What should we look at?","ノラさんの お店！ ここ 大好き。 なにを 見る？"],ex:'happy',o:[
   ["Let's find something that matches.","おそろいの ものを さがそう。",2,'b',"Matching? ...I'd like that.","おそろい？ …いいね。"],
   ["Anything you like.","先生の 好きな ものなら なんでも。",1,'b',"Then let's look at mugs!","じゃあ マグカップ 見よう！"],
   ["The cheapest thing.","いちばん 安い もの。",0,'b',"Hey! It's a date!","ちょっと！ デートだよ！","デートでは「なにを 見る？」に 気持ちを こめて"]]},
  b:{s:["Which do you like better, the blue mug or the pink one?","青い マグと ピンクの マグ、 どっちが 好き？"],ex:'think',o:[
   ["Let's get both. One for you, one for me.","両方 買おう。 ひとつずつ。",2,'c',"A pair! Yes!","ペアだね！ うん！"],
   ["I like the pink one better. It suits you.","ピンクが 好き。 先生に にあう。",2,'c',"Then I'll get the pink one.","じゃあ ピンクに する。"],
   ["They're the same.","どっちも 同じ。",0,'c',"They're not!","ちがうってば！","Which do you like better? には「I like the ～ one better.」"]]},
  c:{s:["Nora is smiling at us... She asked if we're on a date.","ノラさんが こっち 見て にこにこ してる… デート？って 聞かれちゃった。"],ex:'love',o:[
   ["Tell her yes.","そうだって 言って。",2,'end',"...Okay. Yes, we are.","…うん。 そうです。"],
   ["We're just shopping!","買いものしてる だけ！",1,'end',"Y-yes, just shopping!","そ、 そう、 買いもの だけ！"],
   ["Who's Nora?","ノラって だれ？",0,'end',"The shop owner!","お店の 人だよ！","on a date ＝「デート中」。 Yes, we are. で 答えられるよ"]]}}},
{id:'d_stars',t:'星を 見る 夜',ico:'🌌',need:5,
 intro:'夜の 浜辺。 ブランケットを しいて、 ふたりで 空を 見上げる…',
 ends:{good:['天の川を こえて',"No matter how far, we'll always find each other.","どんなに 遠くても、 きっと 会えるね。"],
  ok:['星の 授業',"Class is over. Thank you for listening.","授業 おわり。 聞いて くれて ありがとう。"],
  fun:['ねぼすけ',"...Are you asleep? Good night, sleepyhead.","…ねちゃった？ おやすみ、 ねぼすけさん。"]},
 nodes:{
  a:{s:["I brought a blanket. Let's lie down and look up.","ブランケット もってきた。 ねころんで 見上げよう。"],ex:'smile',o:[
   ["Perfect. I brought hot cocoa.","ばっちり。 ココア もってきたよ。",2,'b',"You're the best!","さいこう！"],
   ["The sand is a little cold.","砂が ちょっと つめたい。",1,'b',"Here, share the blanket.","はい、 ブランケット はんぶんこ。"],
   ["I'm sleepy.","ねむい。",0,'b',"Already?","もう？","夜の デートで「ねむい」は さびしいかも"]]},
  b:{s:["That's the Summer Triangle. Do you know the story of Vega and Altair?","あれが 夏の 大三角。 おりひめと ひこぼしの お話、 知ってる？"],ex:'wow',o:[
   ["They can only meet once a year, right?","1年に 1回しか 会えないんだよね？",2,'c',"Right. On the seventh of July.","そう。 7月7日にね。"],
   ["No. Can you tell me?","知らない。 教えて？",2,'c',"They were lovers, separated by the Milky Way.","天の川に はなされた 恋人どうしなの。"],
   ["Is it a food?","食べもの？",0,'c',"No! It's a love story!","ちがう！ 恋の お話！","Vega（おりひめ）と Altair（ひこぼし）。 七夕の お話だよ"]]},
  c:{s:["If we could only meet once a year... what would you do?","もし 1年に 1回しか 会えなかったら… どうする？"],ex:'love',o:[
   ["I would swim across the Milky Way to see you.","天の川を 泳いで 会いに 行く。",2,'end',"...You'd really do that?","…ほんとに？"],
   ["I would wait for you, no matter how long.","どれだけ かかっても 待つ。",2,'end',"...Thank you.","…ありがとう。"],
   ["I would sleep until then.","それまで 寝てる。",0,'end',"Zzz... wait, really?","すやー… って、 ほんとに？","If we could ～, I would ～。 仮定法で 気持ちを 伝えよう"]]}}}];

/* ================= 🎲 ランダムイベント（ふたりの 時間に ときどき） ================= */
const LOVE_RANDOM=[
/* 💬 ハマ子に 恋の 相談 → 先生の 気持ちと つぎに やる ことの ヒント */
{id:'r_hama',t:'ハマ子に 恋の 相談',ico:'👵',min:0,need:4,hint:1,
 intro:'ミナ先生を 待っていたら、 ハマ子おばちゃんが やってきた…',
 ends:{good:['ハマ子の おうえん',"Go get her! Hamako is cheering for you!","がんばりや！ ハマ子が おうえん しとるで！"],
  ok:['ハマ子の アドバイス',"Take it slow. Love is like cooking.","あせらんと。 恋は 料理と おんなじや。"],
  fun:['ハマ子 大わらい',"Hahaha! You're hopeless! I like you!","あはは！ あかんわ この子！ 好きやで！"]},
 nodes:{
  a:{who:'h',s:["You like Mina, don't you? It's written all over your face!","あんた、 ミナちゃんの こと 好きやろ？ 顔に 書いてあるで！"],ex:'happy',o:[
   ["Is it that obvious?","そんなに わかる？",2,'b',"Obvious? It's shining like a lighthouse!","わかる？ 灯台みたいに 光っとるわ！"],
   ["No, I don't! ...Maybe a little.","ちがうよ！ …ちょっとだけ。",1,'b',"A little? Ha!","ちょっと？ はっ！"],
   ["I like Hamako more.","ハマ子の ほうが 好き。",0,'b',"Oh my! You're a smooth talker!","あらまあ！ 口が うまいなあ！","正直に 言うと 相談に のって もらえるよ"]]},
  b:{who:'h',s:["So, what do you want to ask me?","で、 なにが 聞きたいん？"],ex:'think',o:[
   ["How can I make her happy?","どうしたら 先生を よろこばせ られる？",2,'end',"Listen to her. And study hard. She loves that.","話を 聞いたげ。 ほんで 勉強 がんばり。 それが いちばんや。"],
   ["What does she like?","先生は なにが 好き？",2,'end',"Sweet things, cute things, and books. And you, maybe!","あまい もんと かわいい もんと 本。 あと あんたも、 たぶんな！"],
   ["Can you give me candy?","アメ ちょうだい。",0,'end',"Ha! Here. But that's not love advice!","はっ！ はい。 でも それ 恋の 相談 ちゃうで！","How can I ～? で「どうしたら〜できる？」"]]}}},
{id:'r_nora',t:'ノラさんに 恋の 相談',ico:'👩‍🦳',min:1,need:4,hint:1,
 intro:'雑貨店の 前を 通ったら、 ノラさんに よびとめられた…',
 ends:{good:['ノラさんの ひみつの 話',"I fell in love on a beach too, long ago. Treasure every day.","わたしも むかし 浜辺で 恋を したの。 毎日を 大切にね。"],
  ok:['ノラさんの ひとこと',"Be honest with her. That's all.","正直で いること。 それだけよ。"],
  fun:['ノラさん にっこり',"You're funny. She must laugh a lot with you.","おもしろい 子ね。 きっと よく わらってる でしょうね。"]},
 nodes:{
  a:{who:'n',s:["Mina was here this morning. She was humming a love song.","けさ ミナさんが 来てたわ。 恋の 歌を 口ずさんでた。"],ex:'smile',o:[
   ["Really? Did she say anything about me?","ほんと？ わたしの こと なにか 言ってた？",2,'b',"Hmm, maybe. A little.","んー、 たぶんね。 ちょっと だけ。"],
   ["She always hums.","先生 いつも 歌ってるよ。",1,'b',"Not like this, dear.","こんな 感じでは ないわよ。"],
   ["I don't care.","べつに 気にならない。",0,'b',"Oh? Your ears are red.","あら？ 耳が 赤いわよ。","気になる ときは 正直に 聞いて みよう"]]},
  b:{who:'n',s:["Can I give you some advice from an old shopkeeper?","年よりの 店主から アドバイス しても いい？"],ex:'think',o:[
   ["Yes, please. I'd love some advice.","はい、 ぜひ おねがいします。",2,'end',"",""],
   ["Sure, if it's free.","いいよ、 ただなら。",1,'end',"",""],
   ["How much is it?","いくら？",0,'end',"","","advice は 数えない 名詞。 some advice で「アドバイス」"]]}}},
{id:'r_bento',t:'先生の おべんとう',ico:'🍱',min:1,need:4,
 intro:'お昼。 ミナ先生が もじもじ しながら 包みを もってきた…',
 ends:{good:['ハートの たまご焼き',"I'll make it again tomorrow. ...If you want.","あしたも 作るね。 …よかったら。"],
  ok:['おべんとうの 時間',"Thanks for eating it all.","ぜんぶ 食べて くれて ありがとう。"],
  fun:['つまみぐい',"Hey! That was my octopus sausage!","ちょっと！ それ わたしの タコさんウインナー！"]},
 nodes:{
  a:{s:["I made too much lunch, so... this is for you.","お昼 作りすぎちゃって… これ、 あなたの。"],ex:'love',o:[
   ["Wow, you made this for me? Thank you!","わあ、 わたしの ために？ ありがとう！",2,'b',"I-I said I made too much!","つ、 作りすぎた だけ だってば！"],
   ["Lucky! I was hungry.","ラッキー！ おなか すいてた。",1,'b',"Hehe, good.","ふふ、 よかった。"],
   ["Is it safe to eat?","食べても だいじょうぶ？",0,'b',"Of course it is!","あたりまえ でしょ！","まずは お礼。 Thank you! I'm so happy."]]},
  b:{s:["The egg roll is shaped like a heart... It was an accident!","たまご焼きが ハートの 形に… ぐうぜん だからね！"],ex:'love',o:[
   ["It's the cutest accident I've ever seen.","いままで 見た 中で いちばん かわいい ぐうぜん。",2,'end',"...Just eat it.","…はやく 食べて。"],
   ["It's delicious anyway.","どっちにしても おいしい。",1,'end',"Good.","よかった。"],
   ["Can I eat yours too?","先生のも 食べて いい？",0,'end',"Eh?!","えっ？！","the ～est I've ever seen で「いままで 見た 中で いちばん〜」"]]}}},
{id:'r_cook',t:'先生の 手料理',ico:'🍲',min:2,need:4,
 intro:'「うちで ごはん 食べていく？」 ミナ先生の 家で、 はじめての 手料理…',
 ends:{good:['ふたりの 晩ごはん',"Let's cook together next time.","こんどは いっしょに 作ろうね。"],
  ok:['ちょっと からい スープ',"I'll put less pepper next time.","こんどは コショウ へらすね。"],
  fun:['正直すぎる 感想',"...I'll remember that.","…おぼえて おくね。"]},
 nodes:{
  a:{s:["It's my grandmother's soup recipe. I hope you like it.","おばあちゃんの スープの レシピなの。 気に いって くれると いいな。"],ex:'smile',o:[
   ["It smells wonderful. It reminds me of home.","すごく いい におい。 家を 思い出す。",2,'b',"That's exactly what I wanted to hear.","まさに その ことばが 聞きたかった。"],
   ["Let's eat!","いただきます！",1,'b',"Go ahead!","どうぞ！"],
   ["Is it spicy?","からい？",1,'b',"Just a little.","ちょっとだけ。"]]},
  b:{s:["How is it? Be honest.","どう？ 正直に。"],ex:'think',o:[
   ["It's amazing. Could you teach me how to make it?","さいこう。 作り方 教えて くれる？",2,'end',"Of course! Let's make it together.","もちろん！ いっしょに 作ろう。"],
   ["It's a little spicy, but really good.","ちょっと からいけど、 すごく おいしい。",1,'end',"Oops, sorry!","あっ、 ごめん！"],
   ["It's okay, I guess.","まあまあ かな。",0,'end',"...Okay, I guess.","…まあまあ、 か。","正直でも、 いい ところを 先に 言うと やさしいね"]]}}},
{id:'r_dream',t:'ゆめの 話',ico:'💭',min:1,need:4,dream:1,
 intro:'ミナ先生が ほおづえを ついて、 なにか 思い出して わらっている…',
 ends:{good:['ふたりの ゆめ',"Let's make that dream come true someday.","いつか その ゆめ、 かなえようね。"],
  ok:['ゆめの つづき',"Maybe I'll dream about it again tonight.","今夜も その ゆめ、 見られるかな。"],
  fun:['ゆめの 中の カレー',"You and your curry!","カレーばっかり！"]},
 nodes:{
  a:{s:["I had a funny dream last night. You were in it.","きのう へんな ゆめを 見たの。 あなたが 出てきた。"],ex:'happy',o:[
   ["Really? What was I doing?","ほんと？ わたし なにしてた？",2,'b',"We were running a little shop by the sea.","海辺で 小さな お店を やってたの。"],
   ["Was I cool?","かっこよかった？",1,'b',"Hmm... you were cooking curry.","んー… カレー 作ってた。"],
   ["I don't dream.","わたしは ゆめ 見ない。",0,'b',"Everyone dreams!","だれでも 見るよ！","What was I doing? ＝「わたし なにしてた？」（過去進行形）"]]},
  b:{s:["If we really lived together someday, what kind of life would it be?","もし いつか ほんとに いっしょに 暮らしたら、 どんな 毎日に なるかな？"],ex:'love',o:[
   ["We would run a little school by the sea.","海辺で 小さな 学校を やってる と思う。",2,'end',"My dream... with you.","わたしの ゆめ… あなたと。",'',"school"],
   ["We would travel around the world together.","ふたりで 世界中を 旅してる と思う。",2,'end',"That sounds exciting!","わくわくするね！",'',"travel"],
   ["We would have a garden full of flowers.","花で いっぱいの 庭が ある と思う。",2,'end',"I'd love that.","すてき。",'',"garden"],
   ["We would eat curry every day.","毎日 カレー 食べてる と思う。",0,'end',"Every day?!","毎日？！","would ＋ 動詞で「（もしも）〜するだろう」。 ゆめを 語る ときの 形","curry"]]}}}];

/* ================= 🎉 季節の イベント（その 時期に 1回） ================= */
/* when: [月, 日から, 日まで] */
const LOVE_SEASON=[
{id:'s_valentine',t:'バレンタイン',ico:'🍫',min:1,when:[2,10,14],need:4,
 intro:'2月。 ミナ先生が 小さな 箱を うしろに かくしている…',
 ends:{good:['あまい バレンタイン',"Happy Valentine's Day. ...It's handmade.","ハッピー バレンタイン。 …手作りだよ。"],
  ok:['チョコの おすそわけ',"Everyone gets one! ...But yours is the biggest.","みんなに あげてるの！ …でも あなたのが いちばん 大きい。"],
  fun:['チョコの まちがい',"That's MY chocolate!","それ、 わたしの チョコ！"]},
 nodes:{
  a:{s:["Um... Do you know what day it is today?","えっと… きょう なんの 日か 知ってる？"],ex:'love',o:[
   ["It's Valentine's Day, right?","バレンタインデー でしょ？",2,'b',"R-right. So... this is for you.","そ、 そう。 だから… これ。"],
   ["Is it a holiday?","祝日？",1,'b',"Not exactly...","ちょっと ちがう…"],
   ["It's Tuesday.","火曜日。",0,'b',"...Never mind.","…もう いい。","Valentine's Day ＝ バレンタインデー"]]},
  b:{s:["It's chocolate. I made it myself.","チョコだよ。 自分で 作ったの。"],ex:'love',o:[
   ["Thank you! I'll eat it slowly so it lasts.","ありがとう！ もったいないから ゆっくり 食べる。",2,'end',"",""],
   ["Thank you. I'll give you something on White Day.","ありがとう。 ホワイトデーに おかえし するね。",2,'end',"",""],
   ["Can I have more?","もっと ある？",0,'end',"","","お礼の あとに 気持ちを ひとこと そえよう"]]}}},
{id:'s_birthday',t:'先生の 誕生日',ico:'🎂',min:0,when:[4,7,9],need:4,
 intro:'4月7日は ミナ先生の 誕生日。 ハマ子が こっそり 教えて くれた…',
 ends:{good:['いちばんの おめでとう',"This is the best birthday ever.","いままでで いちばんの 誕生日。"],
  ok:['おめでとうの ことば',"Thank you for remembering.","おぼえてて くれて ありがとう。"],
  fun:['年れいの なぞ',"That's a secret forever!","それは 永遠の ひみつ！"]},
 nodes:{
  a:{s:["Hm? Why are you smiling like that?","ん？ なんで そんな にこにこ してるの？"],ex:'think',o:[
   ["Happy birthday, Ms. Mina!","ミナ先生、 誕生日 おめでとう！",2,'b',"You knew?! Thank you!","知ってたの？！ ありがとう！"],
   ["No reason.","べつに。",0,'b',"...Okay.","…ふうん。","Happy birthday! で お祝いしよう"],
   ["Is it your birthday today?","きょう 誕生日？",1,'b',"Yes! How did you know?","そう！ なんで 知ってるの？"]]},
  b:{s:["Thank you. I'm one year older now...","ありがとう。 また 1つ 年を とっちゃった…"],ex:'happy',o:[
   ["I hope this year is your best year yet.","ことしが いちばん いい 年に なりますように。",2,'end',"",""],
   ["You don't look any older.","ぜんぜん かわらないよ。",1,'end',"",""],
   ["How old are you?","何さい？",0,'end',"","","年れいを 聞くのは ちょっと… I hope ～ で ねがいを 伝えよう"]]}}},
{id:'s_fireworks',t:'夏の 花火',ico:'🎆',min:1,when:[7,20,31],need:4,
 intro:'夏祭りの 夜。 ゆかたの ミナ先生と 浜辺で 花火を 待つ…',
 ends:{good:['花火の 下で',"I'll never forget tonight's fireworks.","今夜の 花火、 わすれない。"],
  ok:['夏の 思い出',"Summer is the best.","夏って さいこう。"],
  fun:['花火より かき氷',"You only came for the shaved ice!","かき氷 目当てでしょ！"]},
 nodes:{
  a:{s:["How do I look in this yukata?","ゆかた、 どうかな？"],ex:'love',o:[
   ["You look beautiful. It really suits you.","すごく きれい。 よく にあってる。",2,'b',"...Thank you.","…ありがとう。"],
   ["It's a nice color.","いい 色だね。",1,'b',"Thanks!","ありがと！"],
   ["Where's the shaved ice?","かき氷 どこ？",0,'b',"...Over there.","…あっち。","How do I look? には「You look ～.」で ほめよう"]]},
  b:{s:["Oh! The fireworks are starting!","あっ！ 花火が はじまった！"],ex:'wow',o:[
   ["They're beautiful, but I'd rather look at you.","きれいだけど、 先生を 見て いたいな。",2,'end',"",""],
   ["Wow! That one looks like a flower!","わあ！ 今の 花みたい！",2,'end',"",""],
   ["They're loud.","うるさい。",0,'end',"","","I'd rather ～ ＝「〜する ほうが いい」"]]}}},
{id:'s_xmas',t:'クリスマス',ico:'🎄',min:1,when:[12,20,25],need:4,
 intro:'クリスマスの 夜。 浜辺の ヤシの木に ライトが まかれている…',
 ends:{good:['聖夜の やくそく',"Merry Christmas. Let's spend every Christmas together.","メリークリスマス。 これからの クリスマスも ずっと いっしょに。"],
  ok:['メリークリスマス',"Merry Christmas! I'm glad you're here.","メリークリスマス！ 来て くれて うれしい。"],
  fun:['サンタの しょうたい',"I'm not Santa!","わたし サンタじゃ ないよ！"]},
 nodes:{
  a:{s:["Merry Christmas! Did you make a wish to Santa?","メリークリスマス！ サンタに おねがい した？"],ex:'happy',o:[
   ["I wished to spend Christmas with you. And it came true.","先生と すごせますようにって。 かなったよ。",2,'b',"...Oh. Me too.","…えっ。 わたしも。"],
   ["Merry Christmas! I wished for snow.","メリークリスマス！ 雪を おねがいした。",1,'b',"Snow on the beach? That'd be magical.","浜辺に 雪？ まほう みたい。"],
   ["Are you Santa?","先生が サンタ？",0,'b',"No!","ちがうよ！","Merry Christmas! と 返して から 話そう"]]},
  b:{s:["Look, it's starting to snow! A white Christmas on the beach!","見て、 雪！ 浜辺の ホワイトクリスマス！"],ex:'wow',o:[
   ["This is the best Christmas of my life.","人生で いちばんの クリスマス。",2,'end',"",""],
   ["It's so pretty. Are you cold?","きれい。 寒くない？",2,'end',"",""],
   ["My shoes are wet.","くつが ぬれた。",0,'end',"","","the best ～ of my life で「人生 いちばんの〜」"]]}}}];

/* ================= 😤 やきもち（ほかの 人に プレゼントを あげた あと） ================= */
const LOVE_JEALOUS={id:'j',t:'ちょっと やきもち',ico:'😤',need:4,
 intro:'ミナ先生が ほっぺを ふくらませて、 そっぽを むいている…',
 ends:{good:['やきもちの あとで',"...Fine. But I want a present next time too.","…いいよ。 でも こんどは わたしにも ちょうだい。"],
  ok:['ちょっと すねただけ',"I'm not jealous. ...Okay, a little.","やきもち じゃ ないよ。 …ちょっとだけ。"],
  fun:['ぷいっ',"Hmph!","ふんっ！"]},
 nodes:{
  a:{s:["I saw you giving a present to someone. You looked happy.","だれかに プレゼント あげてたでしょ。 楽しそう だったね。"],ex:'worry',o:[
   ["Are you jealous? ...That makes me a little happy.","やきもち？ …ちょっと うれしいかも。",2,'b',"I-I'm not jealous!","や、 やきもち じゃ ない！"],
   ["It was just a thank-you gift.","お礼の プレゼント だよ。",1,'b',"...I know.","…わかってる。"],
   ["Yes, it was fun!","うん、 楽しかった！",0,'b',"...Hmph.","…ふーん。","jealous ＝「やきもちを やく」。 気持ちに 気づいて あげよう"]]},
  b:{s:["...Am I special to you?","…わたしって、 あなたに とって とくべつ？"],ex:'love',o:[
   ["Of course. You're the most special person to me.","もちろん。 いちばん とくべつな 人だよ。",2,'end',"",""],
   ["You're my favorite teacher.","いちばん 好きな 先生だよ。",1,'end',"",""],
   ["Everyone is special.","みんな とくべつ。",0,'end',"","","the most special person で「いちばん とくべつな 人」"]]}}};

/* ================= 🎁 恋人むけの 品（雑貨店に 段階で ならぶ。 love: 何段階めから） ================= */
(()=>{if(typeof ZAKKA_ITEMS==='undefined')return;
ZAKKA_ITEMS.push(
 {id:'g_choco',k:'gift',ico:'🍫',n:'ハートの チョコ',w:'box of chocolates',p:40,food:1,to:'mina',love:1,
  a:["Heart-shaped chocolates in a little red box. For someone special, maybe?","小さな 赤い 箱に 入った ハートの チョコ。 とくべつな 人に、 かしら？"]},
 {id:'g_bouquet',k:'gift',ico:'💐',n:'浜辺の 花束',w:'bouquet',p:120,to:'mina',love:2,colors:[['pink','ピンク'],['white','白'],['blue','青']],
  a:["Flowers from the cliffs, tied with a ribbon. They smell like the sea breeze.","がけに さく 花を リボンで たばねたの。 海風の かおりが するわ。"]},
 {id:'g_pendant',k:'gift',ico:'🌙',n:'月の ペンダント',w:'moon pendant',p:1500,lux:1,to:'mina',love:2,colors:[['silver','銀'],['gold','金']],
  a:["A crescent moon pendant made of moonstone. It shines softly at night.","ムーンストーンの 三日月の ペンダント。 夜に やさしく 光るの。"],
  lux0:["They say if you give it to someone you love, you'll always find each other in the dark.","好きな 人に わたすと、 暗やみでも かならず おたがいを 見つけられるって 言われてるの。"],
  worth:["For a love that lasts? I'd say it's a bargain.","ずっと つづく 恋の ため？ 安い ものだと 思うわ。"]});
if(typeof ZAKKA_THANKS!=='undefined'&&ZAKKA_THANKS.mina)Object.assign(ZAKKA_THANKS.mina,{
 g_choco:[["Chocolates... shaped like hearts? ...Thank you. I'll eat them one by one.","ハートの… チョコ？ …ありがとう。 ひとつずつ 食べるね。"],["Are these... for me? My face is getting hot.","これ… わたしに？ 顔が あつく なってきた。"]],
 g_bouquet:[["Flowers? For me? They're beautiful... No one has ever given me flowers before.","お花？ わたしに？ きれい… お花を もらったの、 はじめて。"],["I'll put them by the window so I can see them every morning.","窓辺に かざって、 毎朝 見るね。"]],
 g_pendant:[["A moon pendant... I'll wear it every night. Then I'll always find you.","月の ペンダント… 毎晩 つけるね。 そしたら いつでも あなたを 見つけられる。"],["It's so beautiful. Will you put it on me?","すごく きれい。 つけて くれる？"]]});
if(typeof GIFT_TAGS!=='undefined')Object.assign(GIFT_TAGS,{'z:g_choco':['food','sweet','love'],'z:g_bouquet':['nature','love'],'z:g_pendant':['shiny','lux','wear','love']});
if(typeof GIFT_PEOPLE!=='undefined'&&GIFT_PEOPLE.mina)GIFT_PEOPLE.mina.love.push('z:g_choco','z:g_bouquet','z:g_pendant');
})();
