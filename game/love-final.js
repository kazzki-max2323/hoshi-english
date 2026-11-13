/* 💍 ラブストーリー 第4弾の 中身: 指輪・両親に あいさつ・プロポーズ・結婚式・ふたりの 暮らし・もしもエンド・家族（しくみは game/love.js）
   - 恋人 → 婚約: ハート ＋ 英語の 条件 → 両親に あいさつ（ていねいな 英語）→ 指輪を 買う → プロポーズ（1回 10%、 失敗ごとに 少し 上がる、 3日 あけて 再挑戦）
   - 婚約 → 結婚: ハート ＋ 結婚式（ハイレベルな 誓いと スピーチを えらぶ）
   - 結婚後: 毎日の 会話は「ふたりの 暮らし」（ゆめの 話で えらんだ 暮らしが 出てくる）
   - ほぼ ぜんぶ コンプリートすると… 👶 */
/* 段階の 条件（恋人 → 婚約 は ハイレベル） */
LOVE_STAGES[3].cond={les:50,ph:50,w:['adv',30]};
LOVE_STAGES[4].need=30;

/* ================= 👪 両親に あいさつ（恋人 で 条件を みたすと） ================= */
LOVE_EVENTS[3]={t:'両親に あいさつ',ico:'👪',need:8,par:1,
 intro:'ミナ先生の 両親が 南の 島から 会いに 来た。 ていねいな 英語で あいさつ しよう…',
 ok:["Thank you... My father never says things like that. He really likes you.","ありがとう… お父さんが あんな こと 言うの、 はじめて。 あなたの こと 気に いったみたい。",'love'],
 ng:["My parents were a little surprised. Let's visit them again when we're ready.","両親、 ちょっと びっくり してたね。 じゅんびが できたら また 会いに 行こう。",'worry'],
 nodes:{
  a:{who:'🧔',s:["So, you're the one Mina keeps talking about.","きみが ミナが いつも 話している 人か。"],ex:'think',o:[
   ["It's a pleasure to meet you, sir. Thank you for having me.","お会いできて 光栄です。 お招き いただき ありがとうございます。",2,'b',"Hm. Good manners.","ふむ。 礼儀正しいな。"],
   ["Hi! Nice to meet you!","やあ！ よろしく！",1,'b',"...Hello.","…こんにちは。"],
   ["Yeah, that's me.","うん、 それ ぼく。",0,'b',"...I see.","…そうか。","目上の 人には It's a pleasure to meet you. など ていねいな 言い方を"]]},
  b:{who:'👩',s:["Mina says you study English very hard. Why is that?","ミナが、 あなたは 英語を とても がんばってるって。 どうして？"],ex:'smile',o:[
   ["I'd like to be able to talk with people all over the world, including your family.","世界中の 人と、 ご家族とも 話せるように なりたいのです。",2,'c',"Oh, how lovely.","まあ、 すてき。"],
   ["Because Mina is my teacher.","ミナが 先生だから。",1,'c',"I see.","なるほどね。"],
   ["I have to pass a test.","テストが あるから。",0,'c',"Oh... a test.","あら… テスト。","I'd like to ～ は want to より ていねい"]]},
  c:{who:'🧔',s:["Life isn't always easy. How do you plan to support each other?","人生は いつも かんたんでは ない。 どうやって 支えあう つもりかね？"],ex:'think',o:[
   ["We'll support each other, both in our work and in our hearts.","仕事でも 心でも、 おたがいを 支えあいます。",2,'d',"...A good answer.","…いい 答えだ。"],
   ["I'll do my best.","がんばります。",1,'d',"Hm.","ふむ。"],
   ["Mina can pay for everything.","ミナが ぜんぶ 払うよ。",0,'d',"Excuse me?","なんだって？","both A and B（AでもBでも）で 気持ちを ていねいに"]]},
  d:{who:'👩',s:["Would you mind telling us what you love about our daughter?","娘の どこを 好きに なったか、 教えて いただける？"],ex:'love',o:[
   ["I admire how kind and patient she is. She makes me want to be a better person.","やさしくて 辛抱強い ところを 尊敬しています。 もっと いい 人間に なりたいと 思わせて くれます。",2,'e',"Oh, my...","まあ…"],
   ["She's very pretty.","とても かわいいから。",1,'e',"She is, isn't she?","そうでしょう？"],
   ["Her cooking.","料理。",0,'e',"Her cooking...?","料理…？","admire ＝「尊敬する」。 人がらを ほめると 伝わるよ"]]},
  e:{who:'🧔',s:["...Mina, you've chosen well. Please take good care of her.","…ミナ、 いい 人を えらんだな。 娘を よろしく たのむ。"],ex:'love',o:[
   ["I promise I will cherish her for the rest of my life.","一生 大切に すると 約束します。",2,'end',"",""],
   ["Sure thing!","まかせて！",1,'end',"",""],
   ["She can take care of herself.","自分で できるでしょ。",0,'end',"","","cherish ＝「大切に する」。 ちかいの ことば"]]}}};

/* ================= 💍 プロポーズ（両親の あいさつの あと、 指輪を もって） ================= */
const LOVE_PROPOSE={t:'プロポーズ',ico:'💍',need:5,
 intro:'夕日の 浜辺。 ポケットの 中の 指輪の 箱を にぎりしめる…',
 ok:["...Yes. Yes, of course! I've been waiting for this day for so long.","…はい。 もちろん！ ずっと ずっと、 この 日を 待ってた。",'love'],
 ng:["...I'm so happy. Really. But please, give me a little more time. Will you ask me again someday?","…すごく うれしい。 ほんとだよ。 でも、 もう少しだけ 時間を ちょうだい。 いつか また 聞いて くれる？",'worry'],
 ng2:["Hehe... you were so nervous. Keep the ring safe, okay? I'll be waiting.","ふふ… すごく 緊張 してたね。 指輪は 大事に もってて。 待ってるから。",'happy'],
 nodes:{
  a:{s:["You've been quiet all evening. Is something wrong?","今夜は ずっと しずかだね。 どうかした？"],ex:'think',o:[
   ["Nothing's wrong. Everything is right, because you're here.","なにも。 きみが いるから、 ぜんぶ うまく いってる。",2,'b',"...What's gotten into you?","…どうしたの、 急に？"],
   ["I'm just a little nervous.","ちょっと 緊張してる だけ。",1,'b',"Nervous? Why?","緊張？ なんで？"],
   ["I'm hungry.","おなか すいた。",0,'b',"Again?","また？","大事な 日は 気持ちを ことばに"]]},
  b:{s:["...What's that box in your hand?","…その 手の 箱、 なあに？"],ex:'wow',o:[
   ["Mina, ever since I met you, my life has been full of light.","ミナ、 きみに 出会ってから、 毎日が 光で いっぱいだった。",2,'c',"...","…"],
   ["It's a present for you.","きみへの プレゼント。",1,'c',"For me?","わたしに？"],
   ["Oh, this? It's nothing.","これ？ なんでもない。",0,'c',"It doesn't look like nothing...","なんでもなく 見えないけど…","ever since ～ ＝「〜して からずっと」"]]},
  c:{s:["...Yes?","…うん？"],ex:'love',o:[
   ["Will you marry me and spend the rest of your life with me?","結婚して、 これからの 人生を いっしょに すごして くれますか？",2,'end',"",""],
   ["Mina, will you marry me?","ミナ、 結婚して くれますか？",2,'end',"",""],
   ["Let's get married, okay?","結婚しよっか？",1,'end',"",""],
   ["Marry me, or I'll cry.","結婚して くれないと 泣く。",0,'end',"","","Will you marry me? が いちばん まっすぐな プロポーズ"]]}}};

/* ================= 💒 結婚式（婚約で ハートが いっぱいに なると） ================= */
LOVE_EVENTS[4]={t:'浜辺の 結婚式',ico:'💒',need:8,
 intro:'星降る 浜辺の 結婚式。 ハマ子、 ノラさん、 リク、 浜辺の みんなが 集まった…',
 ok:["I'm the happiest person in the whole world. ...Let's go home together, my love.","世界で いちばん しあわせ。 …いっしょに 帰ろう、 あなた。",'love'],
 ng:["You were so nervous! It's okay. Let's practice our vows and try again tomorrow.","すごく 緊張してたね！ だいじょうぶ。 誓いの ことばを 練習して、 あした もう一度。",'happy'],
 nodes:{
  a:{who:'⛪',s:["Please share your vows.","誓いの ことばを どうぞ。"],ex:'smile',o:[
   ["Standing before everyone we love, I promise to cherish you in joy and in sorrow.","愛する みんなの 前で、 よろこびの ときも かなしみの ときも、 きみを 大切に すると 誓います。",2,'b',"",""],
   ["I promise to love you.","きみを 愛すると 約束します。",1,'b',"",""],
   ["I promise to do the dishes sometimes.","たまに 皿洗いを します。",0,'b',"(The guests laugh.)","（みんな 大わらい）","in joy and in sorrow ＝「よろこびの ときも かなしみの ときも」"]]},
  b:{who:'⛪',s:["...And?","…そして？"],ex:'smile',o:[
   ["I will listen to you, learn with you, and grow old beside you.","きみの 話を 聞き、 きみと 学び、 きみの そばで 年を とって いきます。",2,'c',"",""],
   ["I will make you happy.","しあわせに します。",1,'c',"",""],
   ["That's all.","以上です。",0,'c',"","","listen / learn / grow old を ならべると、 美しい 誓いに なるよ"]]},
  c:{s:["I promise to be your teacher, your student, and your partner, every day of my life.","わたしは、 あなたの 先生で、 生徒で、 パートナーで あると、 一生 毎日 誓います。"],ex:'love',o:[
   ["I do.","誓います。",2,'d',"",""],
   ["Okay.","わかった。",1,'d',"",""],
   ["Wait, what?","え、 なに？",0,'d',"","","結婚式の 返事は I do.（誓います）"]]},
  d:{who:'🎉',s:["Now, a few words to the guests!","では、 みなさんに ひとこと！"],ex:'happy',o:[
   ["Thank you all for coming. Mina taught me English, but more importantly, she taught me what it means to love.","来て くれて ありがとう。 ミナは 英語を 教えて くれた。 でも もっと 大事なのは、 愛する 意味を 教えて くれた ことです。",2,'e',"(Everyone claps.)","（大きな はくしゅ）"],
   ["Thank you for coming. Please enjoy the party.","来て くれて ありがとう。 パーティーを 楽しんで。",1,'e',"(Everyone claps.)","（はくしゅ）"],
   ["Let's eat!","食べよう！",0,'e',"(Riku cheers.)","（リクだけ 大よろこび）","more importantly ＝「もっと 大事なのは」。 スピーチの 決まり文句"]]},
  e:{who:'h',s:["Kanpai! To the happiest couple on the beach!","かんぱーい！ 浜辺で いちばん しあわせな ふたりに！"],ex:'happy',o:[
   ["Cheers! Thank you for always watching over us.","乾杯！ いつも 見守って くれて ありがとう。",2,'end',"",""],
   ["Cheers!","乾杯！",1,'end',"",""],
   ["Is there cake?","ケーキ ある？",0,'end',"","","watch over ＝「見守る」"]]}}};

/* ================= 🏠 ふたりの 暮らし（結婚後の 毎日の 会話）= LOVE_TALKS[4] ================= */
/* ゆめの 話で えらんだ 暮らし（LV.dream） */
const LOVE_DREAMLIFE={
 school:["Our little school by the sea got three new students today!","海辺の 小さな 学校に、 きょう 新しい 生徒が 3人 来たよ！"],
 travel:["I found a cheap flight to Iceland. Shall we see the northern lights?","アイスランドへの 安い 飛行機を 見つけたの。 オーロラ 見に 行く？"],
 garden:["The roses in our garden bloomed this morning!","けさ、 庭の バラが さいたよ！"],
 curry:["I made curry again. That's the fifth time this week!","また カレー 作っちゃった。 今週 5回め！"],
 none:["I was thinking... what kind of home do we want in ten years?","考えてたんだけど… 10年後、 どんな 家に したい？"]};
const dreamLife=()=>LOVE_DREAMLIFE[(window.LOVE&&LOVE.rec().dream)||'none']||LOVE_DREAMLIFE.none;
(()=>{const C=(m,mj,ex,ok,ng,r)=>({m:[m,mj],ex,ok,ng,r}),O=(m,mj,ex,w,wj,cat,h,e,r)=>({m:[m,mj],ex,w,wj,cat,h,e,r});
LOVE_TALKS[4]={
star:[
 C("Good evening, honey. Want to watch the stars from the balcony?","おかえり。 ベランダで 星 見る？",'love',[["Sure. Let me make some tea first.","うん。 先に お茶を いれるね。",'invite']],
  [["Sure. Let me to make some tea.","うん。 お茶を いれさせて。","let me の あとは to なしの 原形","let me ＋ 動詞の 原形。 to は いらないよ"]],["You always know what I need.","いつも ほしい ものが わかるのね。"]),
 C("Do you remember the star you wished on, a long time ago?","ずっと 前、 ねがいを かけた 星、 おぼえてる？",'smile',[["Of course. My wish came true.","もちろん。 ねがいは かなったよ。",'feel']],
  [["Of course. My wish comes true yesterday.","もちろん。 きのう かなう。","yesterday なら 過去形","came true（かなった）"]],["...Mine did too.","…わたしのも。"]),
 O("Mine did too.","わたしのも。",'love',"Every night with you feels like a shooting star.","きみと いる 夜は 毎晩 流れ星みたい",'feel',"feel like ～ ＝「〜みたいに 感じる」","「Every night with you feels like a shooting star.」 every night は 単数あつかい → feels",["Then let's make a wish every night.","じゃあ 毎晩 ねがいごと しよう。"])],
book:[
 C("I finally finished writing my story. Will you be the first to read it?","やっと 物語を 書きおえたの。 さいしょに 読んで くれる？",'love',[["I'd be honored to be your first reader.","さいしょの 読者に なれるなんて 光栄だよ。",'feel']],
  [["I'd be honored being your first reader.","さいしょの 読者で 光栄。","be honored to ＋ 原形","I'd be honored to be ～"]],["It's about us, you know.","わたしたちの 話 なんだよ。"]),
 C("How should I end it?","どう 終わらせたら いいと 思う？",'think',[["Don't end it. Our story is still going.","終わらせないで。 ぼくたちの 話は まだ つづいてる。",'feel']],
  [["Don't end it. Our story still goes.","終わらせないで。 話は まだ 行く。","「いまも つづいている」は 進行形","is still going（まだ つづいている）"]],["...You're right. 'To be continued.'","…そうだね。「つづく」に しよう。"]),
 O("To be continued.","つづく。",'happy',"Let's keep writing it together every day.","毎日 いっしょに 書きつづけよう",'invite',"keep ～ing ＝「〜しつづける」","「Let's keep writing it together every day.」",["Every day, forever.","毎日、 ずっと。"])],
food:[
 C("What should we have for dinner tonight?","今夜の ごはん、 なにに する？",'smile',[["How about cooking together? Your soup and my salad.","いっしょに 作ろうよ。 きみの スープと ぼくの サラダ。",'invite']],
  [["How about cook together?","いっしょに 作るは？","How about の あとは ～ing","How about ＋ 動詞ing で さそう"]],["Deal! You chop the onions.","きまり！ タマネギは あなたが 切ってね。"]),
 C("Your eyes are watering. Are you crying?","目が うるうる してる。 泣いてるの？",'wow',[["It's the onions! ...And maybe I'm a little too happy.","タマネギの せい！ …あと、 しあわせすぎる せいかも。",'feel']],
  [["It's the onion's!","タマネギのの！","複数形と 所有格の ちがい","onions（タマネギたち）。 's は「〜の」"]],["Silly. Here, a tissue.","もう。 はい、 ティッシュ。"]),
 O("Dinner's ready!","ごはん できたよ！",'happy',"Everything tastes better when we make it together.","いっしょに 作ると なんでも おいしい",'praise',"taste ＋ 形容詞の 比較級","「Everything tastes better when we make it together.」 everything は 単数 → tastes",["I agree. Let's eat!","ほんとね。 いただきます！"])],
sea:[
 C("Let's walk on the beach like we used to.","むかしみたいに 浜辺を 歩こう。",'love',[["I'd love to. It's where everything began.","よろこんで。 ぜんぶ ここから はじまったね。",'feel']],
  [["I'd love to. It's where everything begins yesterday.","よろこんで。 きのう はじまる 場所。","はじまったのは むかし → 過去形","began（はじまった）"]],["Our beach.","わたしたちの 浜辺。"]),
 C("Do you think we'll still walk here when we're old?","おばあちゃん、 おじいちゃんに なっても ここを 歩いてると 思う？",'smile',[["Definitely. Slowly, hand in hand.","ぜったい。 ゆっくり、 手を つないで。",'feel']],
  [["Definitely. Slow, hand in hand.","ぜったい。 おそい、 手を つないで。","動きを くわしく するのは 副詞","slowly（ゆっくり）。 slow は 形容詞"]],["I can't wait.","楽しみ。"]),
 O("I can't wait.","楽しみ。",'love',"I fall in love with you all over again every day.","毎日 きみに 恋を しなおしてる",'feel',"all over again ＝「もう一度 さいしょから」","「I fall in love with you all over again every day.」",["...Me too. Every single day.","…わたしも。 毎日 毎日。"])],
music:[
 C("Our wedding song came on the radio!","ラジオで 結婚式の 曲が かかってる！",'wow',[["Shall we dance, Mrs. Mina?","おどりませんか、 ミナさん？",'invite']],
  [["Shall we dancing?","おどってる？","Shall we の あとは 原形","Shall we dance?"]],["With pleasure.","よろこんで。"]),
 C("You don't step on my feet anymore.","もう 足を ふまなく なったね。",'happy',[["I've had a lot of practice with you.","きみと いっぱい 練習したからね。",'talk']],
  [["I had a lot of practice since then.","それから たくさん 練習した。","since が あれば 現在完了","I've had（ずっと してきた）"]],["Hehe. My best student.","ふふ。 わたしの いちばんの 生徒。"]),
 O("My best student.","わたしの いちばんの 生徒。",'love',"You will always be my favorite teacher.","きみは ずっと ぼくの いちばんの 先生",'feel',"will always be ＝「ずっと〜だ」","「You will always be my favorite teacher.」",["And you'll always be my favorite person.","あなたは ずっと わたしの いちばんの 人。"])],
dream:[
 C(()=>dreamLife()[0],()=>dreamLife()[1],'happy',[["That's wonderful! Our dream is coming true.","すてき！ ふたりの ゆめが かなって いくね。",'feel']],
  [["That's wonderful! Our dream is come true.","すてき！ ゆめが かなう。","「かなって いく」は 進行形","is coming true"]],["Because we built it together.","ふたりで つくって きたからね。"]),
 C("What should our next dream be?","つぎの ゆめは なにに しよう？",'think',[["Let's decide together, one dream at a time.","ひとつずつ、 いっしょに 決めよう。",'invite']],
  [["Let's decide together, one dreams at a time.","ひとつずつ ゆめたちを。","one の あとは 単数","one dream at a time（ひとつずつ）"]],["One dream at a time. I like that.","ひとつずつ。 いいね。"]),
 O("I like that.","いいね。",'love',"As long as I'm with you, every dream feels possible.","きみと いれば、 どんな ゆめも かなう 気が する",'feel',"As long as ～ ＝「〜する かぎり」","「As long as I'm with you, every dream feels possible.」",["...I feel the same way.","…わたしも おなじ 気持ち。"])]};
})();

/* ================= 👶 かくし要素: 家族（結婚後、 ほぼ ぜんぶ コンプリートすると） ================= */
const LOVE_BABY={id:'baby',t:'だいじな 話',ico:'🍼',need:4,
 intro:'ある 朝。 ミナが 少し ふるえる 手で、 あなたの 手を にぎった…',
 ends:{good:['あたらしい 家族',"Our family is going to be three. ...I'm so happy I could cry.","わたしたちの 家族、 3人に なるんだね。 …うれしくて 泣きそう。"],
  ok:['びっくりの 朝',"Take a deep breath, papa. Hehe.","深呼吸して。 ふふ。"],
  fun:['気が 早い',"It's a little early to buy a school bag!","ランドセルは まだ 早いよ！"]},
 nodes:{
  a:{s:["I have something important to tell you. ...We're going to have a baby.","大事な 話が あるの。 …赤ちゃんが できたの。"],ex:'love',o:[
   ["Really?! That's the best news of my life!","ほんとに？！ 人生で いちばんの ニュースだ！",2,'b',"Hehe. I knew you'd say that.","ふふ。 そう 言うと 思った。"],
   ["W-wait... really?","ま、 まって… ほんと？",1,'b',"Really.","ほんと。"],
   ["Let's buy a school bag today!","きょう ランドセル 買いに 行こう！",0,'b',"Already?!","もう？！","the best news of my life ＝「人生 いちばんの ニュース」"]]},
  b:{s:["Will you help me? I'm a little scared.","いっしょに がんばって くれる？ ちょっと こわいの。"],ex:'worry',o:[
   ["Of course. We'll do this together, every step of the way.","もちろん。 ひとつ ひとつ、 ずっと いっしょだよ。",2,'end',"",""],
   ["Don't worry. I'll be with you.","だいじょうぶ。 そばに いるよ。",2,'end',"",""],
   ["I'll read a book about babies.","赤ちゃんの 本を 読む。",1,'end',"",""]]}}};
const LOVE_BIRTH={id:'birth',t:'はじめまして',ico:'👶',need:2,
 intro:'星降る 夜。 小さな 泣き声が 浜辺の 家に ひびいた…',
 ends:{good:['ようこそ、 星の 子',"Welcome to the world, little star. We love you so much.","ようこそ、 小さな 星。 だいすきだよ。"],
  ok:['はじめまして',"Hello, little one. I'm your mama.","はじめまして。 ママだよ。"],
  fun:['はじめまして',"Hello, little one. I'm your mama.","はじめまして。 ママだよ。"]},
 nodes:{
  a:{s:["Look... our baby. Say hello.","見て… わたしたちの 赤ちゃん。 あいさつ して。"],ex:'love',o:[
   ["Hello, little star. Welcome to our family.","こんにちは、 小さな 星。 家族へ ようこそ。",2,'end',"",""],
   ["Hi there. I'm your papa.","やあ。 パパだよ。",2,'end',"",""],
   ["Can you speak English yet?","もう 英語 話せる？",1,'end',"",""]]}}};
/* 家族が ふえた あとの ふたりの 時間の おわりに ときどき */
const LOVE_FAMILY=[["The baby smiled at me today! I think the first word will be 'star'.","きょう 赤ちゃんが わらったの！ さいしょの ことばは「star」かも。"],
 ["Shh... the baby just fell asleep. Let's whisper.","しーっ… いま ねたところ。 小さな 声で 話そう。"],
 ["I sing the same lullaby my grandmother sang to me.","おばあちゃんが 歌って くれた 子もり歌を 歌ってるの。"],
 ["Someday, let's teach our child English under the stars, together.","いつか、 星の 下で、 ふたりで この子に 英語を 教えようね。"]];

/* ================= 🌙 もしもエンド（べつの 世界の ふたり。 アルバムで 読める） ================= */
const LOVE_IF=[
 {id:'if_friend',t:'親友エンド',hint:'特別な 日に 2回 しっぱい する',c:L=>(L.ev||0)>=2||(L.fights||0)>=5,
  en:"In another world, we stayed best friends. We still meet on the beach every Sunday, and we still laugh at the same jokes. Sometimes she looks at me as if she wants to say something. Maybe someday.",
  ja:"べつの 世界では、 わたしたちは 親友の まま。 いまも 毎週 日曜に 浜辺で 会って、 おなじ じょうだんで わらう。 ときどき、 彼女は なにか 言いたそうに こっちを 見る。 いつか、 きっと。"},
 {id:'if_far',t:'遠距離エンド',hint:'プロポーズに 2回 しっぱい する',c:L=>(L.pf||0)>=2,
  en:"In another world, Mina went back to her island to open her school. We write letters every week, in English, of course. Each letter ends the same way: 'Look at the stars tonight. I'm looking too.'",
  ja:"べつの 世界では、 ミナは 学校を ひらく ために 島へ 帰った。 毎週 手紙を 書く。 もちろん 英語で。 どの 手紙も さいごは おなじ。「今夜、 星を 見て。 わたしも 見てるから。」"},
 {id:'if_teacher',t:'ずっと 先生と 生徒',hint:'ふたりの 時間 20日、 でも まだ 気になる 人まで',c:L=>L.n>=20&&L.st<=1,
  en:"In another world, she remained my teacher and I remained her student. Years later, I became a teacher too. On my first day, I stood under the stars and said, 'Let's start from page one.'",
  ja:"べつの 世界では、 彼女は ずっと 先生で、 わたしは ずっと 生徒だった。 何年も たって、 わたしも 先生に なった。 さいしょの 日、 星の 下で こう 言った。「1ページめから はじめよう。」"},
 {id:'if_rival',t:'旅人と 先生',hint:'旅人 レオに ゆずって しまう',c:L=>!!(L.ends||{})['r_rival:fun'],
  en:"In another world, Mina had dinner with the traveler, Leo. She told him all about her students. 'There's one who never gives up,' she said. Leo smiled. 'Then why are you here with me?'",
  ja:"べつの 世界では、 ミナは 旅人の レオと 晩ごはんを 食べた。 生徒の 話ばかり した。「ぜったい あきらめない 子が いるの」。 レオは わらった。「じゃあ、 なんで ぼくと ここに いるの？」"},
 {id:'if_true',t:'ほんとうの エンド',hint:'ミナ先生と 結婚する',c:L=>L.st>=5,
  en:"In this world, we got married on the beach where we first met. The stars fell like rain that night. And every night since, we've talked in English, about stars, books, food, the sea, music, and our dreams.",
  ja:"この 世界では、 わたしたちは はじめて 出会った 浜辺で 結婚した。 その 夜は 星が 雨みたいに ふった。 そして それから 毎晩、 英語で 話している。 星の こと、 本の こと、 食べもの、 海、 音楽、 そして ふたりの ゆめの こと。"}];

/* ================= 💍 指輪（恋人から、 雑貨店の ガラスケース。 プレゼントには しない。 プロポーズに つかう） ================= */
(()=>{if(typeof ZAKKA_ITEMS==='undefined')return;
ZAKKA_ITEMS.push({id:'g_ring',k:'ring',ico:'💍',n:'星の 指輪',w:'ring',p:5000,lux:1,love:3.5,sizes:[['small','S'],['medium','M'],['large','L']],
  a:["A silver ring with a tiny star-shaped diamond. It's not just a present... is it?","小さな 星の 形の ダイヤが ついた 銀の 指輪。 ただの プレゼント… じゃないわよね？"],
  lux0:["The star was cut by a jeweler who only makes one ring a year. Whoever wears it, they say, is never lost.","1年に 1つしか 作らない 職人が 星の 形に カットしたの。 これを つけた 人は ぜったい 道に まよわないって。"],
  worth:["For the person you want to spend your life with? Then it's priceless.","一生を いっしょに すごしたい 人の ため？ なら、 値段なんて つけられないわ。"]});
if(typeof GIFT_TAGS!=='undefined')GIFT_TAGS['z:g_ring']=['shiny','lux','love'];
})();

/* 表情図鑑と 称号も ふえる */
LOVE_FACES.push(['f_ring','wow','chest','指輪を 見つめて','プロポーズに 成功する',L=>L.st>=4],['f_wed','happy','heart','花嫁の えがお','結婚する',L=>L.st>=5]);
LOVE_TITLES.push(['ごあいさつ 上手',L=>!!L.par,'両親に あいさつ する'],['くじけない 心',L=>(L.pf||0)>=1,'プロポーズに しっぱい しても あきらめない'],['婚約した ふたり',L=>L.st>=4,'プロポーズに 成功する'],['星降る 浜辺の 夫婦',L=>L.st>=5,'結婚する'],['3人 家族',L=>!!L.kid,'？？？']);
