/* 💗 ミナ先生との ラブストーリー: 中身（しくみは game/love.js）
   - LOVE_STAGES: 段階（先生と 生徒 → 気になる 人 → 友だち 以上 → 恋人 → 婚約 → 結婚）。need = つぎへの ハート、cond = 英語の 条件
   - LOVE_MOODS: 毎朝 かわる 機嫌。like = 合う 話題（ハートが 多めに 上がる）、no = 合わない 話題
   - LOVE_TOPICS: 話題
   - LOVE_TALKS[段階][話題] = 3つの やりとり。
       C(英語,訳,表情, 正解[[英語,訳,フレーズ帳の 場面]], まちがい[[英語,訳,ヒント,解説]], 返事[英語,訳])
       O(英語,訳,表情, ならべる 文,訳,場面, ヒント,解説, 返事)   … 単語を ならべて 言う
   - LOVE_EVENTS: 段階アップの 特別な 日（長い 分かれ道の 会話）。LOVE_FIGHTS: けんかと 仲直り
       ノード {s:[英語,訳],ex, o:[[英語,訳,点,つぎ,返事英語,返事訳,ひとこと(0点の とき 先生の 日本語)]]}
       点の 合計が need 以上で 成功。'end' で おわり */
const LOVE_STAGES=[
 {n:'先生と 生徒',ico:'📖',need:20,cond:{les:5,ph:8},call:'you'},
 {n:'気になる 人',ico:'💭',need:30,cond:{les:15,ph:20,w:['jh',50]}},
 {n:'友だち 以上',ico:'🌙',need:40,cond:{les:30,ph:35,w:['hs',50]}},
 {n:'恋人',ico:'💗',need:60,cond:null},
 {n:'婚約',ico:'💍',need:0,cond:null},
 {n:'結婚',ico:'💒',need:0,cond:null}];
const LOVE_CATS={hello:['👋','あいさつ'],praise:['🌸','ほめる'],invite:['☕','さそう'],ask:['❓','たずねる'],feel:['💗','気持ちを 伝える'],sorry:['🙏','あやまる'],thanks:['🎁','お礼'],talk:['💬','おしゃべり'],propose:['💍','プロポーズ']};
const LOVE_TOPICS={star:['🌟','星と 空'],book:['📚','本と ことば'],food:['🍰','食べもの'],sea:['🌊','海と さんぽ'],music:['🎵','音楽'],dream:['🌈','ゆめと 将来']};
/* [id, 名前, 表情, ポーズ, 合う話題, 合わない話題, ようす] */
const LOVE_MOODS=[
 ['genki','ごきげん','happy','peace2',['sea','music'],['book'],'鼻歌を うたってる'],
 ['nonbiri','のんびり','smile','mug',['book','food'],['sea'],'ココアを のんでる'],
 ['nemui','ちょっと ねむそう','think','mug',['star','music'],['dream'],'あくびを かみころしてる'],
 ['waku','わくわく','wow','star',['star','dream'],['food'],'目が きらきら してる'],
 ['kangae','考えごと','think','chin',['book','dream'],['music'],'空を 見て ぼんやり してる'],
 ['shonbori','ちょっと 元気ない','worry','pray',['food','music'],['star'],'ため息を ついてる']];

(()=>{
const C=(m,mj,ex,ok,ng,r)=>({m:[m,mj],ex,ok,ng,r});
const O=(m,mj,ex,w,wj,cat,h,e,r)=>({m:[m,mj],ex,w,wj,cat,h,e,r});
const LOVE_HOT="その ことばは まだ ちょっと はやいかも… 気持ちの 温度を 考えてみて";
window.LOVE_TALKS=[
/* ================= 0. 先生と 生徒（小・中1 くらい） ================= */
{
star:[
 C("Look, the stars are out. Do you like stars?","見て、 星が 出てる。 星は 好き？",'happy',
  [["Yes, I do. They're beautiful.","うん、 好き。 きれいだね。",'feel']],
  [["Yes, I am.","うん、 わたしは。","「Do you ～?」の 質問には なにで 答える？","「Do you like ～?」には「Yes, I do.」。am は「I am ～（わたしは〜です）」の ときだよ"],
   ["I love you.","あなたが 大好き。",LOVE_HOT,"聞かれたのは 星が 好きか どうか。 いきなり「I love you.」は 先生も びっくり。 気持ちの ことばは like → care about → be fond of → love の じゅんに 重く なるよ"]],
  ["Me too. I come here every night.","わたしも。 毎晩 ここに 来るの。"]),
 O("Which star is the brightest?","どの 星が いちばん 明るいかな？",'think',"That one is the brightest.","あれが いちばん 明るいよ",'talk',
  "「いちばん〜」は the 〜est","「That one（あれ）」を 主語に して「That one is the brightest.」。 the brightest で「いちばん 明るい」",
  ["You have good eyes!","目が いいね！"]),
 C("It's getting late. See you tomorrow?","おそく なってきた。 また 明日？",'smile',
  [["See you tomorrow, Ms. Mina.","また 明日、 ミナ先生。",'hello'],["Good night. Thank you for today.","おやすみなさい。 きょうは ありがとう。",'thanks']],
  [["See you yesterday.","きのう 会おうね。","tomorrow と yesterday、 どっちが「明日」？","「tomorrow」が 明日、「yesterday」は きのう。 See you tomorrow. で「また 明日」"],
   ["Good morning!","おはよう！","いまは 夜だよ","夜の わかれぎわは「Good night.」。 Good morning は 朝の あいさつ"]],
  ["Good night. Sleep well.","おやすみ。 よく 眠ってね。"])],
book:[
 C("What are you reading?","なにを 読んでるの？",'smile',
  [["I'm reading an English book.","英語の 本を 読んでるよ。",'talk']],
  [["I read yesterday.","きのう 読んだ。","いま 読んでる ものを きかれてるよ","「What are you reading?」は いま していること。「I'm reading ～.」で 答えよう"],
   ["It's a pen.","それは ペンです。","読んでる ものは なに？","pen は 読めないね。 本や まんがを 答えよう"]],
  ["Wow, that's great! Is it difficult?","すごい！ むずかしい？"]),
 O("Is it difficult?","むずかしい？",'think',"It is a little difficult.","ちょっと むずかしい",'talk',
  "a little は「少し」。 形容詞の 前に おくよ","「It is a little difficult.」 a little（少し）を difficult の 前に",
  ["Don't worry. I can help you.","だいじょうぶ。 手伝えるよ。"]),
 C("Do you want to read it together?","いっしょに 読む？",'happy',
  [["Yes, please!","はい、 おねがいします！",'thanks'],["That sounds fun.","楽しそう。",'feel']],
  [["No, thank you. Go away.","いいえ。 あっち 行って。","さそって くれた 先生に その 言い方は…","「Go away.」は「あっち 行って」。 ことわる ときも「Maybe next time.」が やさしいよ"],
   ["Yes, you do.","はい、 あなたは します。","「Do you want ～?」には 自分の ことで 答えるよ","「Do you want to ～?」には「Yes, please.」や「Yes, I do.」"]],
  ["Great. Let's start from page one.","よし。 1ページめから はじめよう。"])],
food:[
 C("I made some cookies. Do you want one?","クッキー 作ったの。 ひとつ どう？",'happy',
  [["Yes, please. Thank you!","はい、 ください。 ありがとう！",'thanks']],
  [["Yes, I want two hundred.","うん、 200こ ほしい。","食べすぎ…！","ほしい ときは「Yes, please.」が ていねい。 数は ほどほどに ね"],
   ["I'm a cookie.","わたしは クッキーです。","I'm ～ は「わたしは〜です」だよ","「I'm a cookie.」は「わたしは クッキー」。 ほしい ときは「Yes, please.」"]],
  ["Here you are.","はい、 どうぞ。"]),
 C("How is it?","どう？",'think',
  [["It's delicious!","おいしい！",'praise'],["It's really good.","とても おいしい。",'praise']],
  [["It's Tuesday.","火曜日です。","「How is it?」は 味の 感想を きいてるよ","How is it? ＝「どう？」。 味なら「It's delicious!」"]],
  ["Really? I'm so happy!","ほんと？ うれしい！"]),
 O("Do you think I'm a good cook?","わたし、 料理 じょうずかな？",'smile',"You are a good cook.","先生は 料理が じょうずですね",'praise',
  "cook は「料理する 人」。 a good cook で「料理 じょうず」","「You are a good cook.」 good cook（いい 料理人）で「料理が じょうず」",
  ["Thank you. You're sweet.","ありがとう。 やさしいね。"])],
sea:[
 C("The sea is calm today. Shall we walk a little?","海が おだやか。 少し 歩こうか？",'smile',
  [["Sure, let's go!","うん、 行こう！",'invite']],
  [["I can't swim.","泳げない。","泳ぐ じゃなくて 歩く さそいだよ","Shall we ～? ＝「〜しようか？」。 walk は 歩く。 OKなら「Sure, let's go!」"],
   ["Shall we? No.","しようか？ いいえ。","さそいへの 返事は Sure / Let's go など","Shall we ～? には「Sure.」「OK, let's go.」が きもちいい 返事"]],
  ["Look at the waves. So pretty.","波を 見て。 きれい。"]),
 C("I found a shell! Look!","貝がら 見つけた！ 見て！",'wow',
  [["Wow, it's so pretty!","わあ、 すごく きれい！",'praise']],
  [["Wow, it's so hungry!","わあ、 おなか すいてる！","hungry は「おなかが すいた」","貝がらを ほめる なら pretty / beautiful。 hungry は「おなかが すいた」"]],
  ["You can have it.","あげるね。"]),
 O("You can have it.","あげるね。",'happy',"I will keep it forever.","ずっと だいじに するね",'feel',
  "will の あとは 動詞の もとの 形","「I will keep it forever.」 will ＋ keep（もとの 形）＋ forever（ずっと）",
  ["You're funny. ...But I'm glad.","おおげさだなあ。 …でも うれしい。"])],
music:[
 C("Can you hear the radio? I love this song.","ラジオ 聞こえる？ この 曲 大好きなの。",'happy',
  [["Me too. It's a nice song.","わたしも。 いい 曲だね。",'feel']],
  [["I can't hear you. I am a radio.","聞こえない。 わたしは ラジオです。","あなたは ラジオ じゃないよね","「Me too.」で「わたしも」。 好きな 気持ちを あわせる ことば"]],
  ["This singer is my favorite.","この 歌手が いちばん 好きなの。"]),
 C("What kind of music do you like?","どんな 音楽が 好き？",'smile',
  [["I like pop music.","ポップスが 好き。",'talk'],["I like quiet songs.","しずかな 曲が 好き。",'talk']],
  [["Yes, I like.","はい、 好き。","What の 質問は Yes / No で 答えないよ","What kind of ～? ＝「どんな〜？」。「I like ～.」と 中身を 答えよう"]],
  ["Nice! Let's listen together sometime.","いいね！ こんど いっしょに 聞こう。"]),
 O("Let's listen together sometime.","こんど いっしょに 聞こう。",'smile',"Can you sing it for me?","歌って くれる？",'ask',
  "Can you ～? で おねがい","「Can you sing it for me?」 Can you ＋ 動詞 で「〜して くれる？」",
  ["Oh no, I'm shy! ...Maybe a little.","ええ、 はずかしい！ …ちょっと だけね。"])],
dream:[
 C("What do you want to be in the future?","将来 なにに なりたい？",'smile',
  [["I want to be a teacher like you.","先生みたいな 先生に なりたい。",'feel']],
  [["I want to be yesterday.","きのうに なりたい。","将来 なりたい ものを 答えよう","want to be ＋ なりたい もの。「I want to be a teacher.」"]],
  ["Really? That makes me so happy.","ほんと？ すごく うれしい。"]),
 C("When I was little, I wanted to be an astronaut.","小さい ころ、 宇宙飛行士に なりたかったの。",'wow',
  [["Wow, that's cool!","わあ、 かっこいい！",'praise']],
  [["Wow, that's cold!","わあ、 つめたい！","cool と cold、 にてるけど…","cool は「かっこいい」、 cold は「寒い・つめたい」"]],
  ["Now I teach English under the stars. It's not so different.","いまは 星の 下で 英語を 教えてる。 あんまり かわらないかも。"]),
 O("Now I'm a teacher under the stars.","いまは 星の 下の 先生。",'smile',"You are a great teacher.","先生は すてきな 先生です",'praise',
  "You are ＋ a great ＋ teacher","「You are a great teacher.」 a ＋ 形容詞 ＋ 名詞 の じゅん",
  ["...Thank you. I'll do my best.","…ありがとう。 がんばるね。"])]
},
/* ================= 1. 気になる 人（中学） ================= */
{
star:[
 C("There's a meteor shower tonight. Have you ever seen one?","今夜は 流星群なの。 見た こと ある？",'wow',
  [["No, I haven't. I'd like to see one.","ないよ。 見てみたい。",'talk'],["Yes, I have. It was amazing.","あるよ。 すごかった。",'talk']],
  [["No, I didn't see.","ううん、 見なかった。","「Have you ever ～?」には have で 答えるよ","経験を きく「Have you ever ～?」には「Yes, I have.」「No, I haven't.」"],
   ["Yes, I am seen.","はい、 わたしは 見られています。","受け身に なっちゃった","「I am seen」は「見られる」。 経験なら「I have seen one.」"]],
  ["Then let's watch it together tonight.","じゃあ 今夜、 いっしょに 見よう。"]),
 C("If you see a shooting star, what will you wish for?","流れ星を 見たら、 なにを ねがう？",'smile',
  [["I'll wish to be better at English.","英語が もっと うまく なりますように って。",'feel'],["It's a secret!","ひみつ！",'talk']],
  [["I wished yesterday.","きのう ねがった。","これからの ことを きかれてるよ（will）","「what will you wish for?」は 未来。「I'll wish ～」"]],
  ["Hehe. Mine is a secret too.","ふふ。 わたしのも ひみつ。"]),
 O("Mine is a secret too.","わたしのも ひみつ。",'love',"I am glad to be here with you.","先生と ここに いられて うれしい",'feel',
  "glad to ～ で「〜して うれしい」","「I am glad to be here with you.」 be glad to ＋ 動詞 で「〜して うれしい」",
  ["...Me too. Don't tell the other students.","…わたしも。 ほかの 生徒には ないしょね。"])],
book:[
 C("I'm reading a love story. Do you like love stories?","恋の 物語を 読んでるの。 恋の お話 好き？",'smile',
  [["Yes. I like stories with happy endings.","うん。 ハッピーエンドの 話が 好き。",'talk']],
  [["Yes, I like it very.","うん、 とても 好き。","very だけで おわらないよ","「very much」まで 言おう。 I like it very much."]],
  ["Me too. Sad endings make me cry.","わたしも。 かなしい 終わり方は 泣いちゃう。"]),
 C("This word is hard. What does 'crush' mean?","この 単語 むずかしいね。 crush って どういう 意味？",'think',
  [["It means you secretly like someone.","こっそり だれかを 好きって いう 意味。",'talk']],
  [["It means a big sandwich.","大きな サンドイッチ って 意味。","恋の お話に 出てくる ことばだよ","have a crush on ～ ＝「〜に 片思い」。 crush には「おしつぶす」の 意味も あるよ"]],
  ["Oh... I see. Thank you, teacher.","あ… なるほど。 ありがとう、 先生。"]),
 O("Thank you, teacher.","ありがとう、 先生。",'happy',"Do you have a crush on someone?","だれかに 片思い してる？",'ask',
  "have a crush on ～ で ひとかたまり","「Do you have a crush on someone?」 have a crush on ＋ 人",
  ["W-what? That's... a secret!","な、 なに？ それは… ひみつ！"])],
food:[
 C("I'm making lunch. What's your favorite food?","お昼 作ってるの。 好きな 食べものは？",'smile',
  [["I love curry and rice.","カレーライスが 大好き。",'talk']],
  [["My favorite food is happy.","好きな 食べものは しあわせ。","食べものの 名前を 答えよう","favorite food は 好きな 食べもの。 curry, sushi, ramen など"]],
  ["Then I'll make curry for you someday.","じゃあ いつか カレーを 作って あげる。"]),
 C("Oh no, I burned the toast.","あっ、 トースト こがしちゃった。",'worry',
  [["It's okay. I like it a little crispy.","だいじょうぶ。 少し カリカリが 好き。",'feel'],["Don't worry. It happens.","気に しないで。 よく あるよ。",'feel']],
  [["You're a bad cook.","料理 へたですね。","こまってる 人に その ことばは…","失敗した 人には「Don't worry.」や「It's okay.」が やさしいね"]],
  ["You're so kind. Thank you.","やさしいね。 ありがとう。"]),
 O("Lunch is ready!","お昼 できたよ！",'happy',"Would you like to eat together?","いっしょに 食べませんか",'invite',
  "Would you like to ～? は ていねいな さそい","「Would you like to eat together?」 Would you like to ＋ 動詞 で ていねいに さそう",
  ["I'd love to.","よろこんで。"])],
sea:[
 C("The sunset is beautiful, isn't it?","夕日、 きれいだね。",'smile',
  [["Yes, it is. It's like a painting.","うん。 絵みたいだね。",'praise']],
  [["No, it doesn't.","ううん、 しない。","「isn't it?」には is で 答えるよ","付加疑問「～, isn't it?」には「Yes, it is.」/「No, it isn't.」"]],
  ["I always come here when I feel lonely.","さびしい とき、 いつも ここに 来るの。"]),
 C("Do you ever feel lonely?","さびしく なる こと ある？",'worry',
  [["Sometimes. But I'm not lonely when I'm with you.","ときどき。 でも 先生と いると さびしくない。",'feel']],
  [["Yes, I feel lonely every second forever.","うん、 毎秒 ずっと さびしい。","ちょっと 大げさ かも","頻度は sometimes（ときどき）, often（よく）など。 正直に 言うと 伝わるよ"]],
  ["...You're good at saying sweet things.","…あまい ことば 言うの じょうずだね。"]),
 O("The sun is going down.","日が しずんでいく。",'smile',"Let's walk along the beach.","浜辺を 歩こう",'invite',
  "along ～ で「〜に そって」","「Let's walk along the beach.」 Let's ＋ 動詞、 along the beach で 浜辺ぞいに",
  ["Okay. Just a little longer.","うん。 もう少し だけ。"])],
music:[
 C("I'm practicing the guitar. Can you play an instrument?","ギター 練習してるの。 なにか 楽器 ひける？",'smile',
  [["I can play the piano a little.","ピアノが 少し ひける。",'talk'],["No, but I'd like to learn.","ひけないけど、 習ってみたい。",'talk']],
  [["Yes, I can play soccer.","うん、 サッカーが できる。","instrument は 楽器だよ","play the piano / the guitar。 楽器には the を つける ことが 多いよ"]],
  ["Then let's play something together.","じゃあ いっしょに なにか ひこう。"]),
 C("This song is about missing someone.","この 歌は だれかに 会いたい 気持ちの 歌なの。",'think',
  [["It's a little sad, but beautiful.","少し かなしいけど きれい。",'feel']],
  [["It's a little sad, but delicious.","少し かなしいけど おいしい。","歌に「おいしい」は…？","歌の 感想は beautiful, touching（心に しみる）など"]],
  ["Yes. When I hear it, I think of my hometown.","うん。 聞くと 故郷を 思い出すの。"]),
 O("I think of my hometown.","故郷を 思い出すの。",'worry',"I want to know more about you.","先生の ことを もっと 知りたい",'feel',
  "want to know ～ で「〜を 知りたい」","「I want to know more about you.」 more about you で「あなたの ことを もっと」",
  ["About me? ...Okay, little by little.","わたしの こと？ …うん、 少しずつね。"])],
dream:[
 C("If you could live anywhere, where would you live?","どこにでも 住めるなら、 どこに 住む？",'think',
  [["I would live by the sea.","海の そばに 住む。",'talk']],
  [["I will live by the sea yesterday.","きのう 海の そばに 住む。","「If you could ～, where would you ～?」には I would ～","仮定の 質問には「I would ～.」で 答えるよ。 yesterday は いらないね"]],
  ["Me too. Maybe this beach.","わたしも。 この 浜辺かな。"]),
 C("My dream is to open a little school by the sea.","わたしの ゆめは、 海の そばに 小さな 学校を ひらく こと。",'love',
  [["That's a wonderful dream.","すてきな ゆめだね。",'praise'],["I'm sure you can do it.","先生なら きっと できる。",'feel']],
  [["That's a wonderful nightmare.","すてきな 悪夢だね。","nightmare は こわい 夢","dream は ゆめ、 nightmare は 悪夢。 ほめるなら wonderful dream"]],
  ["Thank you. You're the first person I've told.","ありがとう。 話したのは あなたが はじめて。"]),
 O("You're the first person I've told.","話したのは あなたが はじめて。",'love',"I will help you with your dream.","先生の ゆめを 手伝うよ",'feel',
  "help 人 with ～ で「人の〜を 手伝う」","「I will help you with your dream.」 help ＋ 人 ＋ with ＋ こと",
  ["...You really mean it? That makes my heart warm.","…ほんとに？ 心が あったかく なる。"])]
},
/* ================= 2. 友だち 以上（高校） ================= */
{
star:[
 C("Have you ever thought about how far the stars are?","星が どれだけ 遠いか、 考えた こと ある？",'think',
  [["I have. It makes me feel small, but it's beautiful.","あるよ。 自分が 小さく 感じるけど、 きれい。",'feel']],
  [["I have thought it tomorrow.","明日 考えた ことが ある。","現在完了に tomorrow は 合わないよ","現在完了「have ＋ 過去分詞」は いままでの 経験。 未来の tomorrow は つかえない"]],
  ["The light we see left them long ago.","いま 見てる 光は ずっと 昔に 出た ものなの。"]),
 C("So some of them might not even be there anymore.","だから もう ない かもしれない 星も あるの。",'worry',
  [["That's a little sad. But their light still reaches us.","少し かなしい。 でも 光は まだ とどいてる。",'feel']],
  [["That's why I'm hungry.","だから おなかが すいた。","話の つながりを 考えて","That's why ～ ＝「だから〜」。 話と 関係ない 答えは つながらないね"]],
  ["You always find the bright side. I like that about you.","いつも いい ところを 見つけるね。 そういう ところ、 好き。"]),
 O("I like that about you.","そういう ところ、 好き。",'love',"I would never get tired of watching the stars with you.","先生と 星を 見るのは ずっと あきない",'feel',
  "get tired of ～ing で「〜に あきる」。 never は would の あと","「I would never get tired of watching the stars with you.」 would never ＝ けっして〜ない、 get tired of ＋ ing",
  ["...You said that so naturally. My face is hot.","…さらっと 言うね。 顔が あつい。"])],
book:[
 C("I finished the love story. The ending surprised me.","恋の 物語、 読みおわったの。 さいごに びっくり。",'wow',
  [["Really? What happened in the end?","ほんと？ さいごは どう なったの？",'ask']],
  [["Really? What happens in the end yesterday?","ほんと？ きのう さいご どう なる？","時制が まざってるよ","おわった 話の ことは 過去形。 What happened in the end?"]],
  ["They had been friends for years, and finally one of them confessed.","何年も 友だちで、 ついに 片方が 告白したの。"]),
 C("Do you think friends can become lovers?","友だちって 恋人に なれると 思う？",'think',
  [["I think so, if they truly understand each other.","思うよ。 ほんとうに わかりあえて いれば。",'feel']],
  [["I think so, if they truly understands each other.","思うよ。 もし わかりあえれば。","they の あとの 動詞の 形は？","they は 複数。 understands の s は いらない。 they understand"],
   ["I think so, unless they understand each other.","思うよ。 わかりあえない かぎりは。","unless は「〜しない かぎり」","unless ＝ if not。 意味が ぎゃくに なっちゃう"]],
  ["...I hope so too.","…わたしも そう 思いたい。"]),
 O("I hope so too.","わたしも そう 思いたい。",'love',"Whatever happens, I will be on your side.","なにが あっても 先生の 味方だよ",'feel',
  "Whatever happens（なにが あっても）で はじめよう","「Whatever happens, I will be on your side.」 be on your side ＝「あなたの 味方」",
  ["Thank you. ...I'll remember those words.","ありがとう。 …その ことば、 おぼえておくね。"])],
food:[
 C("I tried a new recipe, but I'm not sure it turned out well.","新しい レシピに ちょうせん したけど、 うまく できたか わからないの。",'worry',
  [["It smells amazing. May I try some?","すごく いい におい。 少し もらって いい？",'praise']],
  [["It smells amazingly.","すばらしく においます。","smell の あとは 形容詞","smell / look / sound ＋ 形容詞。 It smells amazing."],
   ["I'm not sure too.","わたしも わからない。","「〜も…ない」の ときは too じゃなくて？","否定の「〜も」は either。 でも ここは 相手を 安心させる ことばが いいね"]],
  ["Of course. Be honest, okay?","もちろん。 正直にね？"]),
 C("So? Be honest.","どう？ 正直に。",'think',
  [["Honestly, it's the best thing I've ever eaten.","正直、 いままで 食べた 中で いちばん。",'praise']],
  [["Honestly, it's the best thing I ever eat.","正直、 いちばん 食べる。","the best ～ I have ever ＋ 過去分詞","最上級 ＋「I've ever eaten」で「いままで 食べた 中で いちばん」"]],
  ["You're exaggerating! ...But I'll make it again for you.","大げさ！ …でも また 作って あげる。"]),
 O("I'll make it again for you.","また 作って あげる。",'happy',"Next time, let me cook for you.","こんどは わたしに 作らせて",'invite',
  "let me ～ で「わたしに〜させて」","「Next time, let me cook for you.」 let ＋ 人 ＋ 動詞の もとの 形",
  ["Really? Then I'm looking forward to it.","ほんと？ じゃあ 楽しみに してる。"])],
sea:[
 C("The tide is coming in. We should move back a little.","しおが みちてきた。 少し 下がった ほうが いいね。",'wow',
  [["You're right. Watch your step.","そうだね。 足もと 気をつけて。",'feel']],
  [["You're right. Watch your stepped.","そうだね。 足もと。","Watch your step. で ひとかたまり","「Watch your step.」＝「足もとに 気をつけて」。 step は そのまま"]],
  ["Oh! ...Thanks for holding my hand.","わっ！ …手を とってくれて ありがとう。"]),
 C("Um... you can let go of my hand now.","えっと… もう 手、 はなしても いいよ。",'love',
  [["Sorry. I didn't want to let go.","ごめん。 はなしたく なかった。",'feel'],["Oh, sorry! I was just worried about you.","あ、 ごめん！ 心配だった だけ。",'sorry']],
  [["Sorry. I didn't want to let it go of.","ごめん。 はなしたく なかった。","let go で ひとかたまり。 of の 場所は？","let go of ～ ＝「〜を はなす」。 目的語を 言わないなら let go だけ"]],
  ["...I didn't say I wanted you to.","…はなして ほしいとは 言ってないけど。"]),
 O("...I didn't say I wanted you to.","…はなして ほしいとは 言ってないけど。",'love',"Can we stay like this a little longer?","もう少し このままで いい？",'ask',
  "stay like this ＝「このままで いる」","「Can we stay like this a little longer?」 a little longer で「もう少し 長く」",
  ["...Just until the stars come out.","…星が 出るまでね。"])],
music:[
 C("There's a song I've been wanting you to hear.","ずっと あなたに 聞いて ほしかった 曲が あるの。",'smile',
  [["I'd love to hear it.","ぜひ 聞きたい。",'feel']],
  [["I'd love to hearing it.","ぜひ 聞いて いたい。","would love to の あとは 動詞の もとの 形","I'd love to ＋ 動詞の 原形。 to hearing は ×"]],
  ["It's a song about meeting someone special.","とくべつな 人に 出会う 歌なの。"]),
 C("The lyrics say, 'You changed my world.' Has anyone ever changed your world?","歌詞は「あなたが わたしの 世界を かえた」。 だれかに 世界を かえられた こと ある？",'think',
  [["Yes. Someone who taught me under the stars.","うん。 星の 下で 教えて くれた 人。",'feel']],
  [["Yes. Someone who teached me under the stars.","うん。 星の 下で 教えた 人。","teach の 過去形は？","teach - taught - taught。 不規則 動詞だよ"]],
  ["...That's not fair. You can't say that so easily.","…ずるい。 そんなに かんたんに 言っちゃ だめ。"]),
 O("You can't say that so easily.","そんなに かんたんに 言っちゃ だめ。",'love',"I mean it from the bottom of my heart.","心の そこから 本気だよ",'feel',
  "from the bottom of my heart ＝「心の そこから」","「I mean it from the bottom of my heart.」 I mean it ＝「本気で 言ってる」",
  ["...I know. That's why my heart is racing.","…わかってる。 だから どきどき してるの。"])],
dream:[
 C("Sometimes I wonder what my life would be like if I hadn't become a teacher.","先生に ならなかったら どんな 人生 だったかなって、 ときどき 思うの。",'think',
  [["I'm glad you became a teacher. Otherwise I wouldn't have met you.","先生に なって くれて よかった。 じゃないと 会えなかった。",'feel']],
  [["I'm glad you became a teacher. Otherwise I won't meet you.","先生に なって よかった。 じゃないと 会わない。","過去の「もしも」は wouldn't have ＋ 過去分詞","過去の 仮定（仮定法過去完了）は「wouldn't have met」。 会えなかった だろう"]],
  ["...You always know what to say.","…いつも ほしい ことばを くれるね。"]),
 C("What would you do if you could travel anywhere with someone?","だれかと どこへでも 旅 できたら、 なにを する？",'smile',
  [["I would go somewhere quiet and watch the sunrise together.","しずかな ところへ 行って、 いっしょに 日の出を 見る。",'feel']],
  [["I would went somewhere quiet.","しずかな ところへ 行った だろう。","would の あとは 動詞の もとの 形","would ＋ 原形。 would go が 正しいね"]],
  ["That sounds like a dream. ...With someone, huh?","ゆめ みたい。 …だれかと、 ね？"]),
 O("...With someone, huh?","…だれかと、 ね？",'love',"I wish I could see the future with you.","先生と 未来を 見られたら いいのに",'feel',
  "I wish I could ～ で「〜できたら いいのに」","「I wish I could see the future with you.」 I wish ＋ 仮定法（could）で かなわない ねがい",
  ["...Maybe you can. Who knows?","…見られる かもよ。 わからないでしょ？"])]
},
/* ================= 3. 恋人（高校〜ハイレベル） ================= */
{
star:[
 C("Do you remember the first night we watched the stars together?","はじめて ふたりで 星を 見た 夜、 おぼえてる？",'love',
  [["Of course. I've never forgotten a single moment.","もちろん。 ひとときも わすれてない。",'feel']],
  [["Of course. I never forget a single moment since then.","もちろん。 それから わすれない。","since then が あるなら 現在完了","since（〜以来）は 現在完了と いっしょ。 I've never forgotten"]],
  ["Me neither. I was so nervous back then.","わたしも。 あの ころ すごく 緊張してた。"]),
 C("If the stars disappeared one day, would you still be here?","もし ある日 星が 消えても、 ここに いてくれる？",'worry',
  [["Even if every star disappeared, I'd still be by your side.","星が ぜんぶ 消えても、 そばに いるよ。",'feel']],
  [["Even if every star disappears, I'd still be by your side.","ぜんぶ 消えるとしても そばに いる。","仮定法なら 過去形に そろえよう","Even if ＋ 過去形（disappeared）, I would ～。 形を そろえよう"],
   ["I'd still be by your side, as long as it doesn't rain.","雨が ふらなければ そばに いる。","条件つきは ちょっと…","as long as ＝「〜する かぎり」。 こういう ときは 条件なしが うれしいね"]],
  ["...Thank you. You're my brightest star.","…ありがとう。 あなたは わたしの いちばん 明るい 星。"]),
 O("You're my brightest star.","あなたは わたしの いちばん 明るい 星。",'love',"You mean the world to me.","あなたは わたしの すべて",'feel',
  "mean the world to ～ ＝「〜に とって すべて」","「You mean the world to me.」 mean the world to ＋ 人 で いちばん つよい 気持ち",
  ["...And you mean the world to me.","…わたしに とっても あなたは すべて。"])],
book:[
 C("I've started writing my own story. Can you guess what it's about?","自分の 物語を 書きはじめたの。 なんの 話か あてられる？",'smile',
  [["Is it about two people who met on a beach?","浜辺で 出会った ふたりの 話？",'ask']],
  [["Is it about two people who meets on a beach?","ふたりが 会う 話？","two people は 複数","who の あとの 動詞は 前の 名詞に あわせる。 people は 複数 → met / meet"]],
  ["How did you know? ...Don't laugh.","なんで わかったの？ …わらわないでね。"]),
 C("I'm stuck on the ending. How should their story end?","終わり方で なやんでるの。 ふたりの 話は どう 終わるべき？",'think',
  [["I think they should stay together no matter what.","なにが あっても いっしょに いるべきだと 思う。",'feel']],
  [["I think they should stayed together.","いっしょに いるべき だった と 思う。","should の あとは 原形","should ＋ 動詞の 原形。 stayed は ×"]],
  ["No matter what... I like that ending.","なにが あっても…。 その 終わり方、 好き。"]),
 O("I like that ending.","その 終わり方、 好き。",'love',"Let's write the rest of the story together.","物語の つづきは ふたりで 書こう",'invite',
  "the rest of ～ ＝「〜の のこり」","「Let's write the rest of the story together.」 the rest of the story で「物語の つづき」",
  ["...That's the most romantic thing I've ever heard.","…いままで 聞いた 中で いちばん ロマンチック。"])],
food:[
 C("I packed a lunch for you. I hope you're not tired of my cooking.","おべんとう 作ったの。 わたしの 料理、 あきて ないと いいけど。",'smile',
  [["I could never get tired of your cooking.","先生の 料理に あきるなんて ありえない。",'praise']],
  [["I could never get tired with your cooking.","料理で つかれる ことは ない。","get tired of と get tired from は 意味が ちがう","get tired of ＝「あきる」。 get tired from は「〜で つかれる」"]],
  ["Good answer. I put in your favorite.","いい 答え。 好きな もの 入れたよ。"]),
 C("Do you know why it tastes so good?","なんで こんなに おいしいか わかる？",'love',
  [["Because it's made with love?","愛が こもってる から？",'feel']],
  [["Because it's made of love?","愛で できてる から？","made of は 材料","made of（材料）より made with love（愛を こめて）が 自然な 言い方"]],
  ["...Don't say it out loud! But yes.","…声に 出さないで！ でも そう。"]),
 O("...Don't say it out loud!","…声に 出さないで！",'love',"I am the luckiest person in the world.","わたしは 世界で いちばん しあわせ者",'feel',
  "the luckiest で「いちばん 運が いい」","「I am the luckiest person in the world.」 最上級 ＋ in the world",
  ["Then I'm the second luckiest. No, tied for first.","じゃあ わたしは 2番め。 ううん、 同率 1位。"])],
sea:[
 C("The waves sound different tonight. Or maybe it's just my heart.","今夜は 波の 音が ちがって 聞こえる。 わたしの 心の せいかな。",'love',
  [["Are you nervous about something?","なにか どきどき してるの？",'ask']],
  [["Are you nervous about nothing anything?","なにも なにか？","anything と nothing を いっしょに つかわないよ","疑問文では something / anything。 nothing は「なにも〜ない」"]],
  ["A little. Being with you still makes me nervous.","ちょっとね。 あなたと いると まだ どきどき するの。"]),
 C("Promise me something. Let's come back here every year.","ひとつ 約束して。 毎年 ここに 来よう。",'smile',
  [["I promise. Every year, for the rest of our lives.","約束する。 これから ずっと、 毎年。",'feel']],
  [["I promise. Every year, for the rest of our live.","約束する。 毎年。","life の 複数形は？","life → lives。 our lives で「ふたりの 人生」"]],
  ["...Okay. It's a promise.","…うん。 約束ね。"]),
 O("It's a promise.","約束ね。",'love',"I will never let go of your hand.","この 手は ぜったい はなさない",'feel',
  "let go of ～ ＝「〜を はなす」","「I will never let go of your hand.」 never で つよい ちかい",
  ["You'd better not.","はなしたら ゆるさないから。"])],
music:[
 C("Will you dance with me? There's no one watching.","おどって くれる？ だれも 見てないよ。",'love',
  [["I'd be honored to dance with you.","よろこんで おどります。",'invite']],
  [["I'd be honored dancing with you.","おどる ことが 光栄。","be honored to ＋ 原形","I'd be honored to ～ ＝「〜できて 光栄です」。 to ＋ 原形"]],
  ["Don't step on my feet!","足 ふまないでね！"]),
 C("Ouch! ...You stepped on my foot.","いたっ！ …足 ふんだ。",'worry',
  [["I'm so sorry! Are you okay?","ほんとに ごめん！ だいじょうぶ？",'sorry']],
  [["I'm so sorry! Again?","ごめん！ もう一回？","もう一回 ふむの…？","まずは あやまって 相手を 気づかおう。 I'm so sorry! Are you okay?"]],
  ["I'm fine. Dancing badly with you is still fun.","平気。 へたでも あなたと おどるのは 楽しい。"]),
 O("Dancing with you is fun.","あなたと おどるのは 楽しい。",'love',"No one else could make me this happy.","こんなに しあわせに して くれるのは あなた だけ",'feel',
  "No one else could ～ ＝「ほかの だれも〜できない」","「No one else could make me this happy.」 make ＋ 人 ＋ 形容詞、 this happy ＝「こんなに しあわせ」",
  ["...You're going to make me cry.","…泣かせる 気？"])],
dream:[
 C("Where do you see us in ten years?","10年後、 わたしたち どう なってると 思う？",'smile',
  [["I see us living by the sea, still laughing together.","海の そばに 住んで、 まだ いっしょに 笑ってる。",'feel']],
  [["I see us live by the sea.","ふたりが 住むのを 見る。","see ＋ 人 ＋ ～ing で「〜している のが 見える」","see us living で「ふたりが 暮らしている すがた」"]],
  ["Still laughing... I like that future.","まだ 笑ってる…。 その 未来、 好き。"]),
 C("If you could say one thing to your future self, what would it be?","未来の 自分に ひとこと 言えるなら、 なんて 言う？",'think',
  [["I would say, 'Never take her for granted.'","「彼女を あたりまえと 思うな」って 言う。",'feel']],
  [["I will say it yesterday.","きのう 言う。","仮定の 質問には would","If you could ～, what would ～? には I would say ～."]],
  ["...Take me for granted? Never let that happen, okay?","…あたりまえ？ そう ならないでね？"]),
 O("Never let that happen, okay?","そう ならないでね？",'love',"Whatever the future holds, I want to face it with you.","未来に なにが あっても、 先生と 向きあいたい",'feel',
  "Whatever the future holds（未来が なにを もっていても）で はじめる","「Whatever the future holds, I want to face it with you.」 face ～ ＝「〜に 向きあう」",
  ["...Me too. Together.","…わたしも。 ふたりで。"])]
}];

/* ================= 段階アップの 特別な 日 ================= */
window.LOVE_EVENTS=[
/* 0 → 1: 放課後の 星空 */
{t:'放課後の 星空',ico:'🌠',need:7,
 intro:'授業の あと、 片づけを している ミナ先生。 まだ だれも 帰っていない 浜辺で…',
 ok:["...From today, you're not just my student. You're someone I can really talk to.","…きょうから、 あなたは ただの 生徒じゃない。 なんでも 話せる 人。",'love'],
 ng:["It's getting late. Let's talk again another day, okay?","おそく なっちゃった。 また こんど 話そうね。",'smile'],
 nodes:{
  a:{s:["Oh, you're still here? Class is over.","あれ、 まだ いたの？ 授業は おわりだよ。"],ex:'wow',o:[
   ["I wanted to help you clean up.","片づけを 手伝いたくて。",2,'b',"That's sweet. Thank you.","やさしいね。 ありがとう。"],
   ["I forgot my bag.","かばんを わすれた。",1,'b',"Ah, there it is. ...Want to stay a little?","あ、 そこね。 …少し いていく？"],
   ["Class is over? Bye!","おわり？ じゃあね！",0,'b2',"Oh... okay. Bye.","あ… うん。 ばいばい。","帰っちゃった… 先生は 話したそう だったよ"]]},
  b2:{s:["...You came back?","…もどって きたの？"],ex:'wow',o:[
   ["I'm sorry. I wanted to talk more.","ごめん。 もっと 話したくて。",1,'b',"...Me too, actually.","…じつは わたしも。"],
   ["I forgot my bag.","かばんを わすれた。",0,'b',"Haha. Of course.","あはは。 だよね。","2回めの「かばん」は ちょっと さびしいかも"]]},
  b:{s:["Can I ask you something? Why do you study so hard?","ひとつ きいて いい？ どうして そんなに がんばって 勉強するの？"],ex:'think',o:[
   ["Because your lessons are fun.","先生の 授業が 楽しいから。",2,'c',"Really? That's the best thing a teacher can hear.","ほんと？ 先生が いちばん うれしい ことば。"],
   ["Because I want to talk with people all over the world.","世界中の 人と 話したいから。",2,'c',"What a big dream. I love that.","大きな ゆめ。 すてき。"],
   ["Because I have to.","やらなきゃ いけない から。",1,'c',"Haha, honest. That's okay too.","あはは、 正直。 それも いいよ。"]]},
  c:{s:["You know... sometimes I feel lonely here, teaching by myself.","あのね… ひとりで 教えてると、 ときどき さびしく なるの。"],ex:'worry',o:[
   ["You're not alone. I'm here.","ひとりじゃ ないよ。 わたしが いる。",2,'d',"...Thank you. That means a lot.","…ありがとう。 すごく うれしい。"],
   ["Why don't you come to the beach more? Everyone likes you.","もっと 浜辺に 来たら？ みんな 先生が 好きだよ。",1,'d',"Everyone? ...I hope so.","みんな？ …そうだと いいな。"],
   ["That's your problem.","それは 先生の 問題でしょ。",0,'d',"...Yeah. You're right.","…そうだね。 そのとおり。","さびしいって 打ち明けて くれた ときは、 まず よりそう ことばを"]]},
  d:{s:["Hey, look! A shooting star!","ねえ、 見て！ 流れ星！"],ex:'wow',o:[
   ["Quick! Make a wish!","はやく！ ねがいごと！",2,'e',"Done! Did you make one too?","できた！ あなたも した？"],
   ["Where? I missed it.","どこ？ 見のがした。",1,'e',"It's okay. There will be more.","だいじょうぶ。 また 流れるよ。"],
   ["It's just a plane.","ただの 飛行機だよ。",0,'e',"Hey! Don't ruin the mood!","もう！ ふんいき こわさないで！","ロマンチックな ときは のって あげよう"]]},
  e:{s:["What did you wish for?","なにを ねがったの？"],ex:'smile',o:[
   ["That I could spend more time with you.","先生と もっと いっしょに いられますように。",2,'end',"...Oh. I... I see.","…えっ。 そ… そっか。"],
   ["To be good at English.","英語が うまく なりますように。",1,'end',"Then I'll help make it come true.","じゃあ わたしが かなえて あげる。"],
   ["Money.","お金。",0,'end',"Hahaha! So honest.","あはは！ 正直すぎ。","ねがいごとは ふたりの 話が いいかも"]]}}},
/* 1 → 2: 岬の 灯台へ はじめての おでかけ */
{t:'岬の 灯台',ico:'🗼',need:7,
 intro:'日曜日。 浜辺の 左の 岬にある 灯台で、 ミナ先生と 待ちあわせ…',
 ok:["Of course we can. ...And next time, just call me Mina. Not 'teacher.'","もちろん。 …それと、 こんどから ミナって よんで。「先生」じゃ なくて。",'love'],
 ng:["Thank you for today. ...See you in class.","きょうは ありがとう。 …また 授業でね。",'smile'],
 nodes:{
  a:{s:["You're late! ...Just kidding, I just got here too.","おそーい！ …うそ、 わたしも いま 来た ところ。"],ex:'happy',o:[
   ["Sorry to keep you waiting.","待たせて ごめん。",2,'b',"Hehe, it's fine.","ふふ、 いいよ。"],
   ["You look really nice today.","きょう すごく すてきだね。",2,'b',"W-what? ...Thank you.","な、 なに？ …ありがとう。"],
   ["You're late too!","先生も おそい！",0,'b',"I said I was kidding...","じょうだんって 言ったのに…","「Just kidding」は「じょうだんだよ」。 言いかえすより のって あげよう"]]},
  b:{s:["Did you know this lighthouse has guided ships for a hundred years?","この 灯台、 100年も 船を みちびいて きたんだって。"],ex:'smile',o:[
   ["I didn't know that. It's been watching over everyone.","知らなかった。 みんなを 見守って きたんだね。",2,'c',"Yes. I love that.","うん。 そこが 好き。"],
   ["A hundred years? That's older than you!","100年？ 先生より 年上！",1,'c',"Of course it is!","あたりまえでしょ！"],
   ["I don't care about lighthouses.","灯台に 興味ない。",0,'c',"Oh... sorry.","あ… ごめんね。","相手の 好きな ものには 興味を もとう"]]},
  c:{s:["I want to be like this lighthouse. Someone people can rely on.","わたし、 この 灯台みたいに なりたい。 みんなが たよれる 人。"],ex:'think',o:[
   ["You already are. You've helped me so much.","もう そうだよ。 すごく 助けて もらった。",2,'d',"...You really think so?","…ほんとに そう 思う？"],
   ["But who do you rely on?","でも 先生は だれに たよるの？",2,'d2',"...Me?","…わたし？"],
   ["Lighthouses can't move.","灯台は 動けないよ。",0,'d',"That's... not the point.","そういう ことじゃ なくて…","たとえ話には 気持ちで こたえよう"]]},
  d2:{s:["I don't know. I've never thought about it.","わからない。 考えた こと なかった。"],ex:'worry',o:[
   ["You can rely on me.","わたしに たよって いいよ。",2,'d',"...Then maybe I will.","…じゃあ、 たよっちゃおうかな。"],
   ["Maybe you should think about it.","考えた ほうが いいかも。",1,'d',"Yeah... maybe.","うん… そうかも。"]]},
  d:{s:["It's windy up here. Brr.","ここ 風が つよいね。 さむっ。"],ex:'worry',o:[
   ["Here, take my jacket.","はい、 上着 どうぞ。",2,'e',"...It's warm. Thank you.","…あったかい。 ありがとう。"],
   ["Should we go back?","もどる？",1,'e',"Not yet. A little longer.","まだ。 もう少し。"],
   ["I'm not cold.","わたしは 寒くない。",0,'e',"Good for you...","よかったね…","寒がってる 人には 気づかいの ひとことを"]]},
  e:{s:["Can I tell you something? I really enjoyed today.","ひとつ 言って いい？ きょう、 ほんとに 楽しかった。"],ex:'love',o:[
   ["So did I. Can we do this again?","わたしも。 また 来られる？",2,'end',"","" ],
   ["Me too. Thank you for inviting me.","わたしも。 さそって くれて ありがとう。",1,'end',"",""],
   ["It was okay.","まあまあ だった。",0,'end',"...Oh.","…そう。","「まあまあ」は さびしいよ。 楽しかったら 楽しいって 言おう"]]}}},
/* 2 → 3: 告白 */
{t:'流星群の 夜に',ico:'💫',need:8,
 intro:'流星群の 夜。 浜辺で ふたりきり。 きょうこそ 気持ちを 伝えたい…',
 ok:["...Yes. I've been waiting for you to say that. I like you too. Not as a teacher. As me.","…はい。 ずっと その ことばを 待ってた。 わたしも 好き。 先生として じゃなく、 わたしとして。",'love'],
 ng:["...Thank you. But let me think a little more. Ask me again someday, okay?","…ありがとう。 でも もう少し 考えさせて。 いつか また 聞いてね？",'worry'],
 nodes:{
  a:{s:["You said you had something to tell me. What is it?","話したい ことが あるって 言ってたよね。 なあに？"],ex:'smile',o:[
   ["I've been wanting to say this for a long time.","ずっと 言いたかった ことが あるんだ。",2,'b',"...Okay.","…うん。"],
   ["Can you guess?","あててみて？",1,'b',"Hmm? I have no idea. Tell me.","んー？ わからない。 教えて。"],
   ["Um... nothing. Never mind.","えっと… なんでもない。",0,'a2',"...Really?","…ほんとに？","ここで にげちゃ だめ！"]]},
  a2:{s:["Your face says something different.","顔に ちがうって 書いてあるよ。"],ex:'think',o:[
   ["You're right. I need to be honest.","そうだね。 正直に なるよ。",1,'b',"...I'm listening.","…聞いてるよ。"],
   ["Really, it's nothing.","ほんとに なんでもない。",0,'b',"...If you say so.","…そう言うなら。","気持ちを 伝える チャンスだよ"]]},
  b:{s:["...Okay. I'm listening.","…うん。 聞いてるよ。"],ex:'love',o:[
   ["I like you. Not as a teacher, but as a person.","好きです。 先生として じゃなく、 ひとりの 人として。",2,'c',"...!","…！"],
   ["I care about you more than anyone.","だれよりも 先生を 大切に 思ってる。",2,'c',"...More than anyone?","…だれよりも？"],
   ["I love you! Marry me!","愛してる！ 結婚して！",0,'b2',"M-marry?! Wait, wait!","け、 結婚？！ まって まって！","気持ちの 温度が 高すぎ！ 告白は like / care about くらいから"],
   ["You are a good teacher.","いい 先生です。",0,'c',"...Thank you?","…ありがとう？","それは いつも 言える ことば。 きょうは 気持ちを"]]},
  b2:{s:["That's way too fast! We're not even dating!","はやすぎ！ まだ つきあっても ないのに！"],ex:'wow',o:[
   ["Sorry. What I mean is, I really like you.","ごめん。 ほんとに 好きって こと。",1,'c',"...Oh. I see.","…そっか。"],
   ["I'm serious!","本気だよ！",0,'c',"I know, but...","わかるけど…","落ちついて、 いまの 気持ちを ちょうど いい ことばで"]]},
  c:{s:["...Since when?","…いつから？"],ex:'love',o:[
   ["Since the night we watched the shooting star.","流れ星を 見た 夜から。",2,'d',"That night... I remember.","あの 夜… おぼえてる。"],
   ["I don't know exactly. Little by little.","はっきりは わからない。 少しずつ。",2,'d',"Little by little... Me too.","少しずつ… わたしも。"],
   ["Since five minutes ago.","5分前から。",0,'d',"Five minutes?!","5分？！","じょうだんは いまは がまん"]]},
  d:{s:["But I'm your teacher. Is that okay with you?","でも わたしは あなたの 先生だよ。 それでも いいの？"],ex:'worry',o:[
   ["You taught me English, but you also taught me how to be brave.","英語だけじゃ なく、 勇気を 出す ことも 教えて くれた。",2,'e',"...You really have grown.","…ほんとに 大人に なったね。"],
   ["It doesn't matter to me.","わたしは 気に しない。",1,'e',"...I see.","…そっか。"],
   ["Then I'll quit studying.","じゃあ 勉強 やめる。",0,'e',"No! Don't do that!","だめ！ それは だめ！","勉強を やめたら 先生 かなしむよ"]]},
  e:{s:["I'll tell you my answer. But first, say it one more time. In your best English.","答えを 言うね。 でも その 前に、 もう一回 言って。 いちばんの 英語で。"],ex:'love',o:[
   ["Mina, I've fallen for you. Will you go out with me?","ミナ、 好きに なっちゃった。 つきあって ください。",2,'end',"",""],
   ["I like you very much. Please be my girlfriend.","とても 好きです。 彼女に なって ください。",2,'end',"",""],
   ["Go out with me, okay?","つきあって、 いい？",1,'end',"",""]]}}}];

/* ================= けんかと 仲直り ================= */
window.LOVE_FIGHTS=[
{t:'待ちぼうけ',why:'きのう「勉強会に 行く」って 約束してたのに 行かなかった…',need:4,
 ok:["...Okay. I forgive you. Thank you for saying all that.","…うん。 ゆるして あげる。 ちゃんと 言って くれて ありがとう。"],
 ng:["...I'm still a little upset. Let's talk tomorrow.","…まだ ちょっと もやもや する。 また 明日 話そう。"],
 nodes:{
  a:{s:["You said you'd come to the study session yesterday. I waited for an hour.","きのう 勉強会に 来るって 言ったよね。 1時間 待ってたんだよ。"],ex:'worry',o:[
   ["I'm really sorry. I should have told you.","ほんとうに ごめん。 伝える べきだった。",2,'b',"...",""],
   ["I forgot. Sorry.","わすれてた。 ごめん。",1,'b',"You forgot...","わすれてた…"],
   ["It's not a big deal.","たいした ことじゃ ないよ。",0,'b',"Not a big deal?","たいした ことじゃ ない？","まずは あやまろう。 I'm sorry. I should have ～（〜するべきだった）"]]},
  b:{s:["I wasn't angry. I was worried something happened to you.","おこって たんじゃ ないの。 なにか あったのかと 心配で。"],ex:'worry',o:[
   ["I didn't realize I made you worry. That was thoughtless of me.","心配させてるって 気づかなかった。 思いやりが なかった。",2,'c',"...",""],
   ["Thank you for worrying about me.","心配して くれて ありがとう。",1,'c',"Of course I worry.","心配するに きまってる。"],
   ["You worry too much.","心配しすぎ。",0,'c',"...Maybe.","…そうかもね。","相手の 気持ちを 受けとめる ことばを"]]},
  c:{s:["So what will you do next time?","じゃあ、 つぎは どうする？"],ex:'think',o:[
   ["Next time, I'll let you know if I can't make it.","こんどは 行けない とき、 ちゃんと 連絡する。",2,'end',"",""],
   ["I'll try.","がんばる。",1,'end',"",""],
   ["I don't know.","わからない。",0,'end',"","","これからの ことを 約束しよう。 I'll let you know."]]}}},
{t:'わらわれた',why:'授業で ミナ先生が 単語を 言いまちがえた とき、 大わらい しちゃった…',need:4,
 ok:["...Okay. Then laugh with me next time. Deal?","…わかった。 こんどは いっしょに わらってね。 約束？"],
 ng:["...I need some time. See you tomorrow.","…ちょっと 時間が ほしい。 また 明日。"],
 nodes:{
  a:{s:["You laughed when I mispronounced that word in class.","授業で 単語を 言いまちがえた とき、 わらったでしょ。"],ex:'worry',o:[
   ["I'm sorry. I didn't mean to hurt your feelings.","ごめん。 傷つける つもりは なかった。",2,'b',"...",""],
   ["But it was funny!","でも おもしろかった！",0,'b',"...","","おもしろくても、 まずは あやまろう"],
   ["Everyone laughed, not just me.","みんな わらってたよ。",0,'b',"I know...","知ってる…","人の せいに しないで"]]},
  b:{s:["Teachers make mistakes too, you know.","先生だって まちがえるんだよ。"],ex:'worry',o:[
   ["Of course. Your mistakes make you more human.","もちろん。 まちがえる 先生の ほうが すてき。",2,'c',"...Really?","…ほんと？"],
   ["I know. I make a lot of mistakes too.","うん。 わたしも いっぱい まちがえる。",2,'c',"That's true. Hehe.","たしかに。 ふふ。"],
   ["Teachers should be perfect.","先生は 完ぺきで あるべき。",0,'c',"...That's hard.","…それは きびしいな。","完ぺきな 人は いないよね"]]},
  c:{s:["Will you laugh with me next time, not at me?","こんどは わたしを わらうんじゃ なくて、 いっしょに わらって くれる？"],ex:'think',o:[
   ["I promise. I'll laugh with you, never at you.","約束する。 いっしょに わらう。 笑いものには しない。",2,'end',"",""],
   ["What's the difference?","なにが ちがうの？",1,'end',"",""],
   ["No promises.","約束は できない。",0,'end',"","","laugh with（いっしょに わらう）と laugh at（わらいものに する）の ちがいだよ"]]}}},
{t:'聞いてなかった',why:'ミナ先生が 大事な 話を してる ときに、 ほかの ことを していた…',need:4,
 ok:["...Thank you. I feel a little better. I'm glad I have you.","…ありがとう。 少し らくに なった。 あなたが いて よかった。"],
 ng:["...Never mind. Let's talk another time.","…もう いいや。 また こんど。"],
 nodes:{
  a:{s:["I was telling you something important, and you were looking at your phone.","大事な 話を してたのに、 スマホ 見てたでしょ。"],ex:'worry',o:[
   ["You're right. I'm sorry I wasn't listening.","そうだね。 聞いて なくて ごめん。",2,'b',"...",""],
   ["Sorry. Can you tell me again?","ごめん。 もう一回 話して くれる？",1,'b',"...Okay.","…うん。"],
   ["I was listening! Kind of.","聞いてたよ！ たぶん。",0,'b',"Kind of?","たぶん？","言いわけより 先に あやまろう"]]},
  b:{s:["It was about my family back home. My grandmother is sick.","故郷の 家族の 話。 おばあちゃんが 病気なの。"],ex:'worry',o:[
   ["I'm so sorry to hear that. How are you feeling?","それは つらいね。 先生は だいじょうぶ？",2,'c',"...",""],
   ["That's too bad.","それは 残念。",1,'c',"Yeah...","うん…"],
   ["Oh. Okay.","ふうん。",0,'c',"...","","I'm sorry to hear that. で 気持ちに よりそおう"]]},
  c:{s:["I'm worried. I can't concentrate on anything.","心配で、 なにも 手に つかないの。"],ex:'worry',o:[
   ["You don't have to be strong all the time. I'm here for you.","いつも つよく なくて いいよ。 わたしが いる。",2,'end',"",""],
   ["I hope she gets better soon.","はやく よく なると いいね。",1,'end',"",""],
   ["Let's study to forget about it.","勉強して わすれよう。",0,'end',"","","わすれさせる より、 そばに いる ことを 伝えよう"]]}}},
{t:'ゆめを わらった',why:'「海の そばの 学校なんて むりだよ」と 言っちゃった…',need:4,
 ok:["...Thank you. With you on my side, I think I can really do it.","…ありがとう。 あなたが 味方なら、 ほんとに できる 気が する。"],
 ng:["...I see. I'll think about it alone for a while.","…そっか。 しばらく ひとりで 考えるね。"],
 nodes:{
  a:{s:["You said my dream of a school by the sea is unrealistic.","海の そばの 学校なんて 現実的じゃ ないって 言ったよね。"],ex:'worry',o:[
   ["I'm sorry. That was a careless thing to say.","ごめん。 かるはずみな ことを 言った。",2,'b',"...",""],
   ["I was just joking.","じょうだんだよ。",1,'b',"It didn't sound like a joke.","じょうだんに 聞こえなかった。"],
   ["But it's true.","でも ほんとでしょ。",0,'b',"...","","ゆめを 否定された 人の 気持ちを 考えて"]]},
  b:{s:["Do you really think I can't do it?","ほんとに わたしには できないと 思う？"],ex:'think',o:[
   ["No. I believe in you more than anyone.","ちがう。 だれよりも 先生を 信じてる。",2,'c',"...",""],
   ["Maybe, if you work hard.","がんばれば たぶん。",1,'c',"Maybe...","たぶん…"],
   ["It'll be difficult.","むずかしいよ。",0,'c',"I know it's difficult.","むずかしいのは わかってる。","believe in ～ ＝「〜を 信じる」。 いま ほしいのは 応援の ことば"]]},
  c:{s:["...Then why did you say that?","…じゃあ、 どうして あんな こと 言ったの？"],ex:'worry',o:[
   ["I was worried you'd get hurt. But I should have supported you.","傷つかないか 心配だった。 でも 応援する べきだった。",2,'end',"",""],
   ["I don't know.","わからない。",0,'end',"","","本当の 理由と、 これからの 気持ちを 伝えよう"],
   ["Because I'm honest.","正直だから。",0,'end',"","","正直でも、 言い方って 大事だよね"]]}}}];
})();
