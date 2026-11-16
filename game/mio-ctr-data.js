/* 💬 カウンターで ミオに 話しかける ときの 会話（しくみは game/mio-ctr.js、 「さっき なにが あったか」は game/recent.js の RECENT）
   1つの 会話: {id, k:きっかけ, st:段階(これ以上で 出る), if:(e,N,mem)=>出せるか, m:[英語,日本語], ex:表情, p:ポーズ, o:[答え…], ph:[学べる 表現, 日本語]}
     答え = [あなたの 英語, 日本語, ミオの 返事, おまけ]
       ミオの 返事 = [英語, 日本語, 表情] で おわり ／ {m:[英語,日本語], ex, o:[答え…]} で つづく
       おまけ = {mem:'taste=sweet'}（ミオが おぼえる）・{go:'gift'|'floor'}（会話の あと その 画面へ）
   k（きっかけ）: RECENT の 種類（mine / pack / book / sell / away / meal / snack / zbuy / zsell / gift / meteor / lesson / tutor / bottle / kaiwa / bgm / mio / bev）
                  いまの ようす（rain / night / dusk / morning / hpLow / food / gifts / song / empty / rich）・おぼえた こと（mem）・いつでも（any）
   {…} に 入る もの: d 深さ・best 前の 最高・ok/q 正解数・n 数・w/wj 単語・p コイン・food/foodj 食べ物・a_food（a/an つき）・item/itemj/a_item 品物・
                     to/toj あげた 相手・ev/Ev/evj 浜辺の イベント・song 曲・coins・m_taste/m_season/m_pet/m_place/m_off（おぼえた こと）
   表情 ex: smile / laugh / wink / oops / sleepy */

/* プレゼントの 相手の 英語の 名前 */
const MIOT_NAME={mina:'Ms. Mina',riku:'Riku',nora:'Nora',gen:'Gen',sora:'Sora',pochi:'Pochi',kanio:'Kanio',hana:'Hana',baba:'Grandma Tome',neko:'the cat',emma:'Emma',
  taku:'Taku',kame:'Kamekichi',iruka:'Luka',zuzu:'Zuzu',leo:'Leo',fuku:'Dr. Owl',marco:'Marco',mio:'me'};
/* ミオが おぼえる こと → [英語, 日本語] */
const MIOT_MEM={
 taste:{sweet:['sweet things','あまい もの'],spicy:['spicy food','からい もの'],salty:['salty snacks','しょっぱい もの']},
 season:{spring:['spring','春'],summer:['summer','夏'],fall:['fall','秋'],winter:['winter','冬']},
 pet:{dog:['dogs','犬'],cat:['cats','ねこ'],both:['dogs and cats','犬も ねこも']},
 place:{paris:['Paris','パリ'],hawaii:['Hawaii','ハワイ'],space:['space','宇宙'],london:['London','ロンドン']},
 off:{sleep:['sleep all day','一日中 ねる'],read:['read books','本を 読む'],walk:['walk on the beach','浜辺を 歩く'],cook:['cook something','料理を する']},
 owl:{night:['a night owl','夜型'],morning:['an early bird','朝型']}};

const MIOT=[
/* =============================================================== ⛏️ 鉱山から 帰ってきた */
{id:'mn_rec',k:'mine',if:e=>e.best>0&&e.depth>e.best,m:["Boss, welcome back! You went down {d} meters? That's a new record!","おかえりなさい、 店長！ {d}メートル？ 新記録ですよ！"],ex:'laugh',p:'guts',o:[
 ["I did my best!","がんばったよ！",["You really did! Let's celebrate with… a cup of tea. Ha ha.","ほんとに！ お祝いに… お茶で かんぱい。 あはは。",'laugh']],
 ["It was scary down there.","下は こわかったよ。",{m:["Scary? What did you see? A ghost? A giant worm?","こわい？ なにを 見たんですか？ おばけ？ 大きな ミミズ？"],ex:'oops',o:[
  ["Just a lot of hard words.","むずかしい 単語が いっぱい。",["Ha ha! Hard words are scarier than ghosts. I agree!","あはは！ むずかしい 単語は おばけより こわい。 わかります！",'laugh']],
  ["A very angry bat.","すごく おこった コウモリ。",["A bat?! Next time, take me with you. I'll protect you… from far away.","コウモリ？！ 次は つれてって。 守りますよ… 遠くから。",'laugh']]]}],
 ["Next time, I'll go deeper.","次は もっと 深く 行く。",["\"Deeper and deeper!\" That's the spirit, boss!","「もっと 深く！」 その 意気です、 店長！",'smile']]],ph:["That's the spirit!","その 意気だ！"]},
{id:'mn_rare',k:'mine',if:e=>e.rare,m:["Boss! You found a treasure card in the mine?! Can I see it? Can I touch it? …Just with my eyes!","店長！ 鉱山で 宝カード 見つけたんですか？！ 見ても いい？ さわっても…？ …目で だけ！"],ex:'laugh',p:'wave',o:[
 ["Sure, take a look.","いいよ、 見て。",["Wow… it's sparkling. I'm going to remember this moment forever.","わあ… キラキラ。 この しゅんかん、 一生 わすれません。",'laugh']],
 ["Should we sell it?","売っちゃう？",{m:["Sell it? Hmm… It's your treasure, boss. But a collector might pay a lot!","売る？ うーん… 店長の 宝物ですよ。 でも コレクターなら 高く 買うかも！"],ex:'smile',o:[
  ["Let's keep it.","とっておこう。",["Good! Some things are worth more than coins.","よかった！ コインより 大事な ものも ありますよね。",'smile']],
  ["Let's put it on the shelf.","売り場に 出そう。",["OK! I'll write a big sign: \"SUPER RARE!\"","はい！ 大きな 札を 書きます。 「超レア！」",'wink']]]}],
 ["It was pure luck.","ただの 運だよ。",["Luck comes to people who work hard. My grandma always says that!","運は がんばる 人に 来るんです。 おばあちゃんの 口ぐせ！",'smile']]],ph:["It was pure luck.","ただの 運だった。"]},
{id:'mn_tired',k:'mine',if:e=>e.hp==='hp',m:["Boss, you look so tired. Did you use up all your energy in the mine?","店長、 すごく つかれた 顔。 鉱山で 体力 ぜんぶ 使っちゃいました？"],ex:'oops',o:[
 ["I'm exhausted.","へとへと。",["Sit down, sit down! \"Exhausted\" is a great word, by the way. It means \"very, very tired\"!","すわって すわって！ ちなみに 「exhausted」って いい 単語。 「へとへと」って 意味！",'smile']],
 ["I'm starving.","おなか ぺこぺこ。",["Marco's diner is right over there! Go eat something. The shop can wait.","マルコさんの 食堂が すぐ そこですよ！ なにか 食べて。 お店は 待ってくれます。",'smile']],
 ["I'm fine!","へいき！",["You can't fool me, boss. Your eyes are saying, \"I want a nap.\"","だまされませんよ、 店長。 目が 「お昼ね したい」って 言ってます。",'wink']]],ph:["I'm exhausted.","へとへとだ。"]},
{id:'mn_short',k:'mine',if:e=>e.depth<=3,m:["Back already, boss? Only {d} meters? Did you forget your lunch?","もう 帰ってきたんですか？ {d}メートル？ お弁当 わすれた？"],ex:'wink',o:[
 ["Just a short break.","ちょっと 休けい。",["A short break is important. Even moles take breaks. Probably.","休けいは 大事。 モグラも 休けい しますよ。 たぶん。",'laugh']],
 ["I missed the shop.","お店が 恋しくて。",["Aww! The shop missed you too. And… maybe I did, a little.","わあ！ お店も 店長が 恋しかったですよ。 それと… わたしも ちょっとだけ。",'wink']]]},
{id:'mn_many',k:'mine',if:e=>e.cards&&e.cards.length>=4&&!e.rare,m:["Boss, {n} cards from one trip?! The mine is so generous these days!","店長、 1回で {n}まいも？！ 最近の 鉱山、 太っぱら ですね！"],ex:'laugh',p:'guts',o:[
 ["I studied hard down there.","下で がんばって 勉強したからね。",["I can tell! More words, more cards. That's a fair trade.","わかります！ 単語が ふえると カードも ふえる。 いい 取引 ですね。",'smile']],
 ["Let's put some on the shelf.","何まいか 売り場に 出そう。",["Yes! But keep your favorites in the card book, OK? Ha ha.","はい！ でも お気に入りは カードブックに 入れて おいて くださいね。 あはは。",'laugh']]],ph:["generous","太っぱら・気前が いい"]},

{id:'mn_cards',k:'mine',if:e=>e.cards&&e.cards.length&&!e.rare,m:["You found a new card in the mine! Let's see… oh, \"{w}\"! I love that word.","鉱山で 新しい カード 見つけたんですね！ どれどれ… あ、 「{w}」！ その 単語 好き。"],ex:'laugh',o:[
 ["Do you know what it means?","意味 わかる？",["Of course! …It means \"{wj},\" right? I peeked at the back. Ha ha.","もちろん！ …「{wj}」 ですよね？ うらを 見ちゃった。 あはは。",'laugh']],
 ["I'll put it on the shelf.","売り場に 出そうかな。",["Good idea! A fresh card from the mine. Customers will love that story.","いいですね！ 鉱山から とれたての カード。 お客さん、 その 話 好きですよ。",'smile']]]},

{id:'mn_ok',k:'mine',if:e=>e.q>0,m:["How was the mine, boss? I heard you got {ok} out of {q} right!","鉱山、 どうでした？ {q}問中 {ok}問 正解 だったって！"],ex:'smile',o:[
 ["It was fun!","楽しかった！",["I'm glad! Learning words while you dig… it's a treasure hunt for your brain.","よかった！ 単語を おぼえながら ほる… 頭の 宝さがし ですね。",'laugh']],
 ["Some words were tricky.","むずかしい 単語も あった。",{m:["Which ones? Maybe we can practice them together!","どれですか？ いっしょに 練習 できるかも！"],ex:'smile',o:[
  ["I'll try again tomorrow.","あした また やる。",["That's the way! A little every day. Like watering a plant.","それです！ 毎日 少しずつ。 植物に 水を やる みたいに。",'smile']],
  ["I forgot them already…","もう わすれた…",["Ha ha! That happens to me too. Then we just dig them up again!","あはは！ わたしも よく あります。 そしたら また ほりだせば いいんです！",'laugh']]]}]],ph:["a little every day","毎日 少しずつ"]},
/* =============================================================== 🎁 仕入れ・📖 カードブック */
{id:'pk_open',k:'pack',m:["Boss, you opened a new pack! What did we get? I'm so excited!","店長、 新しい パック あけたんですね！ なにが 出ました？ わくわく！"],ex:'laugh',p:'wave',o:[
 ["Lots of new cards!","新しい カードが いっぱい！",["Yay! I'll make a \"New arrivals\" corner. Customers love new things!","やった！ 「新入荷」 コーナー 作ります。 お客さんは 新しい ものが 大好き！",'laugh']],
 ["Nothing rare this time.","今回は レアなし。",["That's OK! Every card is somebody's favorite word. That's my motto.","だいじょうぶ！ どの カードも だれかの お気に入りの 単語。 わたしの モットーです。",'smile']],
 ["Guess what was inside!","なにが 入ってたか 当てて！",{m:["Hmm… \"banana\"? \"dinosaur\"? \"happiness\"?","うーん… 「バナナ」？ 「恐竜」？ 「しあわせ」？"],ex:'smile',o:[
  ["Close!","おしい！",["Close? Which one?! Now I really want to know!","おしい？ どれが？！ もう 気に なって しかたない！",'oops']],
  ["Happiness. Every card is happiness.","しあわせ。 どの カードも しあわせ。",["Boss… that was so cool. I'm writing that down.","店長… いまの かっこよすぎ。 メモします。",'laugh']]]}]],ph:["New arrivals","新入荷"]},
{id:'pk_many',k:'pack',if:()=>{try{return CG.buyToday()>=3}catch(e){return false}},m:["Another pack, boss? That's three today! There's no limit now, but… our wallet has one!","また パック？ きょう 3つめ！ せいげんは なくなったけど… おさいふには ありますよ！"],ex:'wink',o:[
 ["I want more!","もっと ほしい！",["Ha ha! OK, but the really good cards aren't in packs. For those, you have to dig!","あはは！ いいですよ。 でも ほんとに いい カードは パックには ない。 それは ほらないと！",'laugh',{go:'mine'}]],
 ["Opening packs is the best.","パックを あけるのって 最高。",["Right? It's like opening a present every time.","ですよね？ 毎回 プレゼントを あける みたい。",'smile']]],ph:["Tomorrow is another day.","あしたは あしたの 風が ふく。"]},
{id:'pk_noTreasure',k:'pack',m:["Boss, did you notice? Packs only have everyday cards now. Treasure cards hide in the mine!","店長、 気づきました？ パックに 入ってるのは ふだんの カードだけ。 宝カードは 鉱山に かくれてるんです！"],ex:'smile',p:'wave',o:[
 ["Then I'll go digging.","じゃあ ほりに 行く。",["That's the spirit! The deeper you dig, the shinier the cards. That's the rumor.","その 意気！ 深く ほるほど キラキラの カード。 そういう うわさです。",'laugh',{go:'mine'}]],
 ["Packs are for practice.","パックは 練習用だね。",["Exactly! Packs for practice, the mine for treasure. Easy to remember!","そのとおり！ パックは 練習、 鉱山は 宝さがし。 おぼえやすい！",'smile']]],ph:["hide","かくれる"]},
{id:'bk_put',k:'book',m:["I saw you put \"{w}\" in the card book. Is it a special card?","「{w}」を カードブックに 入れてましたね。 特別な カード？"],ex:'smile',o:[
 ["It's my favorite.","お気に入りなんだ。",["Then it deserves a safe home. Favorites go in the book!","じゃあ 安全な おうちが ひつようですね。 お気に入りは ブックへ！",'smile']],
 ["I want to fill every page.","ぜんぶの ページを うめたい。",["Every page? That's a big goal! I'll cheer for you. Fight, boss!","ぜんぶ？ 大きな 目標！ おうえん します。 ファイト、 店長！",'laugh']]]},

/* =============================================================== 🪙 カウンター・るすばん */
{id:'sl_tip',k:'sell',if:e=>e.tip>0,m:["We got a tip! The customer really liked your answer. Shall we save it for… snacks? Ha ha.","チップ もらっちゃった！ お客さん、 店長の 答えが 気に入ったんですね。 これで… おやつ？ あはは。"],ex:'wink',o:[
 ["Snacks it is!","おやつに しよう！",["Yay! Chocolate or rice crackers? …Both? Both!","やった！ チョコか おせんべい？ …両方？ 両方！",'laugh']],
 ["Let's save it.","ためておこう。",["A wise boss! Little by little, the coins grow.","かしこい 店長！ ちりも つもれば 山と なる。",'smile']]],ph:["Little by little.","少しずつ。"]},
{id:'sl_me',k:'sell',if:e=>e.by==='me'&&!e.miss,m:["Nice work, boss! You sold \"{w}\" for {p} coins. Your English with customers is getting so smooth!","おみごと、 店長！ 「{w}」が {p}コインで 売れました。 お客さんとの 英語、 どんどん なめらかに なってる！"],ex:'laugh',p:'thumb',o:[
 ["Thanks! I was nervous.","ありがとう！ きんちょう した。",["Really? You looked so cool. Like a real shopkeeper!","ほんとに？ かっこよかったですよ。 本物の 店主 みたい！",'wink']],
 ["Your turn next time.","次は ミオの 番。",["OK! Watch me. I'll say \"Thank you\" with my best smile.","はい！ 見てて ください。 最高の 笑顔で 「Thank you」って 言います。",'laugh']]],ph:["You looked so cool.","かっこよかったよ。"]},
{id:'sl_miss',k:'sell',if:e=>e.by==='me'&&e.miss,m:["Don't worry about that little mistake, boss. The customer still smiled!","さっきの 小さな まちがい、 気に しないで。 お客さん、 笑ってましたよ！"],ex:'smile',o:[
 ["I'll study more.","もっと 勉強する。",["Me too! Mistakes are just steps on the stairs. Up, up, up!","わたしも！ まちがいは 階段の 一段 です。 上へ、 上へ！",'smile']],
 ["Do you make mistakes too?","ミオも まちがえる？",["All the time! Once I said \"Thank you, come again\" to a seagull.","しょっちゅう！ カモメに 「ありがとう、 また 来てね」って 言った ことも。",'laugh']]],ph:["Don't worry about it.","気に しないで。"]},
{id:'sl_mio',k:'sell',if:e=>e.by==='mio',m:["Did you see me? I sold \"{w}\" all by myself! Do I get a gold star?","見てました？ 「{w}」、 ひとりで 売れましたよ！ 金の 星、 もらえます？"],ex:'laugh',p:'peace',o:[
 ["You get two gold stars.","金の 星 2つ。",["Two?! I'm putting them on my forehead. Ha ha.","2つも？！ おでこに はっちゃいます。 あはは。",'laugh']],
 ["You were great.","すごかったよ。",["Thank you! I practiced \"Have a nice day\" fifty times last night.","ありがとう！ きのうの 夜 「Have a nice day」を 50回 練習 したんです。",'wink']],
 ["You forgot to smile.","笑顔を わすれてたよ。",["What? No way! …Was I too serious? I'll smile twice as much next time!","え？ うそ！ …まじめ すぎました？ 次は 2倍 笑います！",'oops']]]},
{id:'bi_new',k:'buyin',if:e=>e.isNew,m:["Boss, \"{w}\" is a brand-new card for us! I'll make a little sign: \"NEW!\"","店長、 「{w}」って うちに はじめての カードですよ！ 「NEW!」の 札、 作っちゃおう。"],ex:'laugh',p:'peace',o:[
 ["Let's put it on the shelf.","売り場に ならべよう。",["Good idea! A new card makes the shelf shine. Or… keep it in your book first?","いいですね！ 新しい カードで 売り場が かがやく。 それとも… 先に ブックに とっておく？",'wink']],
 ["I'll learn the word first.","先に 単語を 覚える。",["\"{w}\" means \"{wj}.\" See? I learned it too. We're a study team!","「{w}」は 「{wj}」。 ほら、 わたしも 覚えた。 勉強チームですね！",'smile']]],ph:["brand-new","まっさらの・新品の"]},
{id:'bi_me',k:'buyin',if:e=>e.by==='me',m:["You bought \"{w}\" for {p} coins. If we sell it on the shelf, we'll make a little profit!","「{w}」を {p}コインで 買い取りましたね。 売り場で 売れば、 ちょっと もうかりますよ！"],ex:'smile',p:'thumb',o:[
 ["A little profit is enough.","ちょっとで いいよ。",["Little by little! That's the way of a good shop.","少しずつ！ それが いい お店の やりかたです。",'smile']],
 ["Maybe I'll keep it.","とっておこうかな。",["That's OK too! A shopkeeper can have favorites. Shh, it's a secret.","それも あり！ 店長にも お気に入りが あって いいんです。 しーっ、 ひみつ。",'wink']]],ph:["make a profit","もうける"]},
{id:'bi_mio',k:'buyin',if:e=>e.by==='mio',m:["Did you see me bargain? \"How about…?\" I felt like a real merchant!","わたしの 値段の 相談、 見てました？ 「How about…?」って。 本物の 商人 みたいでしょ！"],ex:'laugh',o:[
 ["You were tough!","手ごわかったよ！",["Ha ha! But I always smile. Tough and kind, that's my style.","あはは！ でも いつも 笑顔。 手ごわくて やさしい、 それが わたし。",'laugh']],
 ["Did you pay too much?","高く 買いすぎて ない？",["W-what? No! …Maybe a little. But we didn't lose any coins! Probably.","え、 えっ？ ないです！ …ちょっとだけ かも。 でも 損は してない！ たぶん。",'oops']]],ph:["How about ~?","〜は どう？"]},
{id:'bi_deal',k:'buyin',if:e=>e.kind==='deal'&&e.by==='me',m:["Your price talk was so smooth, boss. \"Let's meet in the middle\" — I'm going to use that!","店長の 値段の 相談、 なめらか だったなあ。 「あいだを とろう」って、 わたしも 使おう！"],ex:'smile',o:[
 ["Ms. Mina taught me.","ミナ先生に 教わったんだ。",["Ms. Mina? No wonder! Her English is perfect.","ミナ先生？ どうりで！ 先生の 英語は 完ぺき だもん。",'smile']],
 ["Try it at the bakery.","パン屋さんで ためしてみて。",["At Mei's bakery? She'll say, \"Nice try, Mio!\" Ha ha.","メイさんの パン屋で？ 「いい ちょうせん、 ミオちゃん！」って 言われそう。 あはは。",'laugh']]],ph:["meet in the middle","あいだを とる（ゆずりあう）"]},
{id:'aw_memo',k:'away',if:e=>e.sold>0,m:["Did you read my memo, boss? Was my English OK?","わたしの メモ、 読みました？ 英語、 だいじょうぶ でした？"],ex:'smile',o:[
 ["It was perfect.","かんぺきだった。",["Yay! I checked the dictionary three times. Worth it!","やった！ 辞書で 3回 たしかめたんです。 かいが あった！",'laugh']],
 ["There was one small mistake.","小さい まちがいが 1つ あった。",{m:["Oh no! Where? …No, wait. Don't tell me. I'll find it myself!","えっ！ どこ？ …いや、 待って。 言わないで。 自分で 見つけます！"],ex:'oops',o:[
  ["Good luck!","がんばって！",["Challenge accepted! …This might take a week.","挑戦、 受けて 立ちます！ …1週間 かかるかも。",'laugh']],
  ["I'll give you a hint later.","あとで ヒント あげる。",["No hints! …OK, maybe one tiny hint. Later.","ヒントは なし！ …いや、 ちっちゃい ヒント ひとつ だけ。 あとで。",'wink']]]}],
 ["I liked Today's phrase.","Today's phrase が よかった。",["Really? I choose them very carefully. Every phrase is a little gift for you.","ほんとに？ すごく 考えて えらんでるんです。 どの フレーズも 店長への 小さな プレゼント。",'wink']]],ph:["Challenge accepted!","受けて 立つ！"]},
{id:'aw_none',k:'away',if:e=>!e.sold,m:["Sorry, boss. Nobody bought anything while you were away… I think the seagulls scared them.","ごめんなさい、 店長。 るすの あいだ なにも 売れなくて… カモメが おどかした んだと 思います。"],ex:'oops',o:[
 ["It's not your fault.","ミオの せいじゃ ないよ。",["Thank you… You're too kind. I'll shout \"Welcome!\" louder next time.","ありがとう… やさしすぎます。 次は もっと 大きな 声で 「いらっしゃいませ！」って 言います。",'smile']],
 ["Let's put out more cards.","カードを もっと ならべよう。",["Yes! A full shelf is a happy shelf. Let's do it!","はい！ いっぱいの たなは ハッピーな たな。 やりましょう！",'laugh',{go:'floor'}]]],ph:["It's not your fault.","きみの せいじゃ ないよ。"]},

/* =============================================================== 🍽️ 食べた */
{id:'ml_smell',k:'meal',m:["Mm? You smell like {food}! Did you eat at Marco's diner?","ん？ {foodj}の においが する！ マルコさんの 食堂で 食べました？"],ex:'wink',o:[
 ["Yes, it was delicious.","うん、 おいしかった。",{m:["I knew it! What was it like? Tell me in English!","やっぱり！ どんな 味？ 英語で 教えて！"],ex:'laugh',o:[
  ["It was sweet and soft.","あまくて やわらかかった。",["\"Sweet and soft\"… Now I'm hungry. Thanks a lot, boss. Ha ha.","「あまくて やわらかい」… おなか すいてきた。 どうも ありがとう、 店長。 あはは。",'laugh']],
  ["It was a little spicy.","ちょっと からかった。",["Spicy! I love spicy food. My face turns red, but I keep eating.","からい！ からい 料理 大好き。 顔が 赤く なるけど 食べつづけます。",'laugh']],
  ["It was too good for words.","ことばに できない おいしさ。",["Ha ha, that's the best review ever!","あはは、 それ 最高の 感想！",'laugh']]]}],
 ["How did you know?","なんで わかったの？",["I have a super nose. …And there's a little sauce on your cheek.","わたし、 鼻が いいんです。 …それと、 ほっぺに ソースが ついてます。",'wink']]],ph:["too good for words","ことばに できない ほど"]},
{id:'ml_reg',k:'meal',if:()=>RECENT.count('meal',7*864e5)>=3,m:["Marco told me you're a regular now. \"A regular customer\"! That's a cool phrase, right?","マルコさんが 「店長は もう 常連さん だ」って。 「a regular customer」！ かっこいい 言い方 ですよね？"],ex:'smile',o:[
 ["His food is the best.","マルコさんの 料理は 最高。",["I know! I want to try every dish from every country. Someday!","ですよね！ ぜんぶの 国の 料理、 ためして みたい。 いつか！",'laugh']],
 ["Come with me next time.","次は いっしょに 行こう。",["Really? Then I'll order the same thing as you. Copying is the best way to learn!","いいんですか？ じゃあ 店長と 同じ もの たのみます。 まねするのが いちばんの 勉強！",'wink']]],ph:["a regular (customer)","常連さん"]},
{id:'sn_eat',k:'snack',m:["I saw you eating {a_food}! Was it good?","{foodj}、 食べてましたね！ おいしかった？"],ex:'smile',o:[
 ["Very good.","すごく おいしかった。",["Next time, buy two. One for you, and one for… someone who works hard here. Ha ha.","次は 2つ 買って。 1つは 店長、 もう1つは… ここで がんばってる だれかに。 あはは。",'wink']],
 ["I was so hungry.","すごく おなか すいてた。",["Digging and selling makes everyone hungry. Words are heavy!","ほったり 売ったり すると おなか すきますよね。 単語って 重いから！",'laugh']]]},

/* =============================================================== 🛍️ ノラさんの 店 */
{id:'zb_buy',k:'zbuy',if:e=>!!e.en,m:["Did you go shopping at Nora's? What did you buy?","ノラさんの お店で 買い物 しました？ なに 買ったんですか？"],ex:'smile',o:[
 ["I bought {a_item}.","{itemj}を 買った。",{m:["Ooh, {a_item}! Nora always has interesting things.","おお、 {itemj}！ ノラさんの お店って いつも おもしろい 物が ありますよね。"],ex:'laugh',o:[
  ["It's a present for someone.","だれかへの プレゼント。",["A present? For who? …No, no, don't tell me! It's a secret, right?","プレゼント？ だれに？ …いや、 言わないで！ ひみつ ですよね？",'wink']],
  ["It's for me.","自分用。",["Treat yourself! You work hard, boss. You deserve it.","自分への ごほうび！ いつも がんばってる から、 店長には その 価値が あります。",'smile']]]}],
 ["It's a secret.","ひみつ。",["A secret?! Now I'm curious. I'll find out… someday.","ひみつ？！ 気に なる。 いつか… 見つけだします。",'wink']]],ph:["Treat yourself!","自分に ごほうびを！"]},
{id:'zb_now',k:'zbuy',if:e=>e.kind==='music'&&!!e.now,m:["Boss, I heard Nora plays music in her shop now. Did you buy the song that was playing?","店長、 ノラさんの お店でも 音楽が ながれてるんですって？ ながれてた 曲、 買ったんですか？"],ex:'smile',o:[
 ["Yes. I loved it, so I bought it.","うん。 気に入ったから 買った。",["Then let's play it here, too! A song you fall in love with in a shop is special.","じゃあ ここでも かけましょ！ お店で ひとめぼれ した 曲って、 とくべつ ですよね。",'wink']],
 ["Nora picked it for the time of day.","ノラさんが 時間に あわせて えらんでた。",["Music for the time of day… I'll try that at our counter, too. Morning songs, night songs!","時間に あわせた 音楽… うちの カウンターでも やってみます。 朝の 曲、 夜の 曲！",'smile']]],ph:["fall in love with","〜に ひとめぼれ する"]},
{id:'zb_any',k:'zbuy',if:e=>!e.en,m:["You went to Nora's shop, right? Did Pip the parrot say anything funny?","ノラさんの お店、 行きました？ オウムの ピップ、 なにか おもしろい こと 言ってました？"],ex:'laugh',o:[
 ["He said \"Hello\" ten times.","「Hello」を 10回 言ってた。",["Ha ha! He only knows five words, but he uses them with confidence!","あはは！ 5つしか 単語 知らない のに、 自信 まんまん なんですよね！",'laugh']],
 ["He was sleeping.","ねてた。",["Even parrots need naps. Just like me after lunch. Ha ha.","オウムも お昼ね するんですね。 お昼の あとの わたしと 同じ。 あはは。",'wink']]],ph:["with confidence","自信を もって"]},
{id:'zs_rec',k:'zsell',if:e=>e.kind==='music'&&!!e.en,m:["Wait… did you sell the record \"{rec}\" at Nora's? I liked that one! …Just kidding. Let's find a new favorite song.","えっ… ノラさんの お店で レコード 「{recj}」 売っちゃったんですか？ あれ 好きだったのに！ …なんて ね。 新しい お気に入り、 さがしましょ。"],ex:'oops',o:[
 ["Sorry! I needed coins.","ごめん！ コインが 必要で。",["It's OK, boss. Songs come and go… like customers! Ha ha.","いいんですよ、 店長。 曲も お客さんも、 来ては 行くもの！ あはは。",'laugh']],
 ["What song do you want next?","つぎは どの 曲が いい？",["Something with a happy beat! Then I can dance behind the counter. Just a little.","ノリの いい 曲！ そしたら カウンターの うしろで おどれる。 ちょっとだけ。",'wink']]],ph:["come and go","来ては 去る"]},
{id:'zs_sell',k:'zsell',if:e=>e.kind!=='music',m:["I heard you sold something at Nora's. Cleaning out your bag?","ノラさんの お店で なにか 売ったって？ かばんの 整理？"],ex:'smile',o:[
 ["I needed coins.","コインが 必要で。",["Coins for… more packs? Ha ha, a true card shop boss!","コインで… パック？ あはは、 さすが カードショップの 店長！",'laugh']],
 ["My bag was too full.","かばんが いっぱいで。",["I know that feeling. My bag is full of… sticky notes. Hundreds of them.","わかります。 わたしの かばんは… ふせんで いっぱい。 何百まいも。",'oops']]]},

/* =============================================================== 🎁 プレゼント */
{id:'gf_mio',k:'gift',if:e=>e.to==='mio',m:["I'm still smiling about the {item}, boss. Thank you again.","{itemj}の こと 思いだして、 まだ にやけちゃう。 ほんとに ありがとう、 店長。"],ex:'laugh',p:'peace',o:[
 ["I'm glad you like it.","気に入って くれて よかった。",["I love it! I told my mom about it on the phone. She said, \"Who is this boss?!\"","大好きです！ 電話で 母に 話したら、 「その 店長って 誰？！」って。",'laugh']],
 ["Where is it now?","いま どこに ある？",["On my desk at home. I say \"Good morning\" to it every day.","家の つくえの 上。 毎朝 「おはよう」って 言ってます。",'wink']]]},
{id:'gf_mina',k:'gift',st:0,if:(e,N,M,s)=>e.to==='mina'&&s<3,m:["You gave a present to Ms. Mina? That's sweet. She's a great teacher, right?","ミナ先生に プレゼント したんですか？ やさしい。 いい 先生 ですよね？"],ex:'smile',o:[
 ["She's the best.","最高の 先生だよ。",["I want to take her class too! Maybe she can teach me grammar.","わたしも 授業 受けたい！ 文法を 教えて もらおうかな。",'smile']],
 ["She was happy.","よろこんでた。",["Of course! A present always makes people happy. Even me. Hint, hint.","もちろん！ プレゼントは だれでも うれしい。 わたしも。 …チラッ。",'wink']]],ph:["Hint, hint.","（それとなく）ほしいなあ。"]},
{id:'gf_minaJ',k:'gift',st:3,if:e=>e.to==='mina',m:["Boss… you gave Ms. Mina a present, right? …I'm not jealous. I'm just… asking. Ha ha.","店長… ミナ先生に プレゼント あげましたよね？ …やきもち じゃ ないです。 ただ… 聞いてる だけ。 あはは。"],ex:'oops',o:[
 ["Are you jealous?","やきもち？",["W-what? No! …Maybe a tiny bit. Forget I said that!","な、 なにを！ ちがいます！ …ほんの ちょっと だけ。 いまの なし！",'oops']],
 ["You're special too, Mio.","ミオも 特別だよ。",["…Really? OK. I'll believe that. Thank you, boss.","…ほんとに？ じゃあ、 信じます。 ありがとう、 店長。",'wink']]],ph:["Forget I said that!","いまの なし！"]},
{id:'gf_riku',k:'gift',if:e=>e.to==='riku',m:["You gave Riku a present? You're so kind to him. He talks about you all the time!","リクくんに プレゼント？ やさしいなあ。 リクくん、 いつも 店長の 話 してますよ！"],ex:'smile',o:[
 ["Really? What does he say?","ほんと？ なんて？",["\"My teacher is cool, but a little strange!\" Ha ha, his words, not mine.","「先生は かっこいいけど ちょっと へん！」 あはは、 リクくんの ことばですよ。",'laugh']],
 ["He works hard.","がんばってるからね。",["Kids grow so fast, right? Soon his English will be better than mine!","子どもって すぐ 成長しますよね。 そのうち わたしより 英語 上手に なるかも！",'smile']]]},
{id:'gf_other',k:'gift',if:e=>e.to!=='mio'&&e.to!=='mina'&&e.to!=='riku',m:["I heard you gave {a_item} to {to}. You're so thoughtful, boss.","{toj}に {itemj}を あげたって？ 店長って ほんと 気が きく。"],ex:'smile',o:[
 ["{To} looked happy.","{toj}、 うれしそうだった。",["Of course! Getting a present from you would make anyone happy.","もちろん！ 店長からの プレゼントなら だれでも うれしい ですよ。",'wink']],
 ["I hope they liked it.","気に入って くれると いいな。",["Don't worry. It's the thought that counts!","だいじょうぶ。 大事なのは 気持ち ですから！",'smile']]],ph:["It's the thought that counts.","大事なのは 気持ち。"]},

/* =============================================================== 🌠 流れ星・授業・リク・ボトル・会話・BGM */
{id:'mt_catch',k:'meteor',if:e=>!e.gold,m:["Boss! Did you just catch a shooting star? Did you make a wish?","店長！ いま 流れ星 つかまえました？ ねがいごと しました？"],ex:'laugh',p:'wave',o:[
 ["I wished for more coins.","コインが ふえますように。",["Ha ha! Very honest. The star heard you. Look, you got {coins} coins!","あはは！ 正直！ 星に 聞こえたんですね。 ほら、 {coins}まい！",'laugh']],
 ["It's a secret.","ひみつ。",["Right! If you say your wish out loud, it won't come true.","ですよね！ ねがいごとは 言うと かなわないって 言いますもんね。",'wink']],
 ["I wished for you to pass your test.","ミオの テストが うまく いきますように。",["For me?! Boss… OK, now I have to study super hard. For the star!","わたしの ために？！ 店長… これは 本気で 勉強 しなきゃ。 星の ために！",'laugh']]],ph:["make a wish","ねがいごとを する"]},
{id:'mt_gold',k:'meteor',if:e=>e.gold,m:["A golden shooting star?! I've never seen one! Boss, you're the luckiest person on this beach!","金色の 流れ星？！ はじめて 見た！ 店長、 この 浜辺で いちばん ラッキーな 人ですよ！"],ex:'laugh',p:'guts',o:[
 ["Let's share the luck.","運を わけよう。",["Really? Then… I'll touch your sleeve. Luck transfer! Ha ha.","いいんですか？ じゃあ… そでを ちょんっ。 運の おすそわけ！ あはは。",'laugh']],
 ["It was fast!","はやかった！",["You have amazing reflexes. Are you secretly a ninja?","反射神経 すごい。 じつは 忍者？",'wink']]],ph:["the luckiest person","いちばん ラッキーな 人"]},
{id:'ls_end',k:'lesson',m:["Did you have a lesson with Ms. Mina? What did you learn today?","ミナ先生の 授業 でした？ きょうは なにを 習ったんですか？"],ex:'smile',o:[
 ["Grammar!","文法！",{m:["Grammar… my weak point. Can you teach me one thing? Just one!","文法… わたしの 苦手。 1つだけ 教えて くれます？ 1つ だけ！"],ex:'oops',o:[
  ["\"Practice makes perfect.\"","「練習が 完璧を つくる」。",["That's not grammar! …But it's true. OK, I'll practice!","それ 文法じゃ ない！ …でも ほんとですね。 練習します！",'laugh']],
  ["Come with me next time.","今度 いっしょに 行こう。",["Can I? Yay! I'll bring my notebook. And snacks for Ms. Mina.","いいんですか？ やった！ ノート もっていきます。 ミナ先生に おやつも。",'laugh']]]}],
 ["It was a little hard.","ちょっと むずかしかった。",["Hard lessons are the ones you remember. That's what my professor says.","むずかしい 授業ほど おぼえてる もの。 大学の 教授の ことばです。",'smile']]],ph:["Practice makes perfect.","練習が 完璧を つくる。"]},
{id:'tu_end',k:'tutor',m:["You were teaching Riku again, right? How is he doing?","また リクくんに 教えてたんですよね？ どうですか、 リクくん？"],ex:'smile',o:[
 ["He's getting better!","上手に なってる！",["That's because he has a good teacher! …I mean you, boss.","いい 先生が いる からですね！ …店長の ことですよ。",'wink']],
 ["He made me laugh.","笑わせて くれた。",["Kids say the funniest things in English. Like me, sometimes. Ha ha.","子どもの 英語って おもしろいですよね。 わたしも ときどき。 あはは。",'laugh']],
 ["He was a little tired today.","きょうは ちょっと つかれてた。",["Maybe he played too much. Next time, bring him a cookie. That always works.","遊びすぎ かな。 次は クッキーを もっていって。 それで 元気に なります。",'smile']]]},
{id:'bt_read',k:'bottle',m:["Did you find a bottle letter on the beach? Who was it from?","浜辺で ボトルメール 見つけました？ だれから？"],ex:'laugh',o:[
 ["From someone far away.","遠くの だれかから。",["A letter from far away… so romantic. The sea is like a big mailbox!","遠くからの 手紙… ロマンチック。 海は 大きな ポスト みたい！",'laugh']],
 ["I couldn't read some words.","読めない 単語が あった。",["Show me later! Let's read it together. Two heads are better than one.","あとで 見せて！ いっしょに 読みましょう。 ふたりで 考えれば だいじょうぶ。",'wink']]],ph:["Two heads are better than one.","ふたりで 考えた ほうが いい。"]},
{id:'kw_end',k:'kaiwa',m:["I saw you talking with someone on the beach. In English! You looked like a local.","浜辺で だれかと 話してましたね。 英語で！ 地元の 人 みたいでした。"],ex:'smile',o:[
 ["It was fun.","楽しかった。",["That's the best part of English. You can talk to anyone!","それが 英語の いちばん いい ところ。 だれとでも 話せる！",'laugh']],
 ["I made a mistake, but it was OK.","まちがえたけど だいじょうぶ だった。",["That's the most important lesson! A mistake doesn't stop a conversation.","それが いちばん 大事！ まちがえても 会話は 止まらない。",'smile']]],ph:["You look like a local.","地元の 人 みたい。"]},
{id:'bg_on',k:'bgm',if:e=>!!e.id,m:["This song is great, boss! Did you choose it for me? …Just kidding. But thank you!","この曲 いいですね、 店長！ わたしの ために えらんだ？ …じょうだんです。 でも ありがとう！"],ex:'laugh',p:'peace',o:[
 ["It's my favorite.","お気に入りなんだ。",["Then it's my favorite now too. We have the same taste!","じゃあ わたしの お気に入りにも なりました。 好みが 同じ ですね！",'wink']],
 ["Shall we dance?","おどる？",["Dance?! Here? …OK, just a little. One, two, three… oops, I hit the shelf.","おどる？！ ここで？ …じゃあ ちょっとだけ。 ワン、 ツー、 スリー… あっ、 たなに ぶつかった。",'oops']]],ph:["Shall we dance?","おどりませんか？"]},

/* =============================================================== 💬 さっきの 話の つづき（ミオと 話す の 会話） */
{id:'fu_hello',k:'mio',if:e=>e.id==='hello',m:["Boss, about my self-introduction earlier… Did I talk too fast? I always talk fast when I'm nervous.","さっきの 自己紹介… 早口 すぎました？ きんちょう すると 早口に なるんです。"],ex:'oops',o:[
 ["It was just right.","ちょうど よかった。",["Phew! Then I'll use the same speed with customers.","よかった！ じゃあ お客さんにも その スピードで。",'smile']],
 ["A little fast.","ちょっと 早かった。",["OK… S-l-o-w-l-y. Like this? …Ha ha, that's too slow!","わかりました… ゆ・っ・く・り。 こう？ …あはは、 おそすぎ！",'laugh']]],ph:["Could you speak more slowly?","もう少し ゆっくり 話して もらえますか？"]},
{id:'fu_card',k:'mio',if:e=>e.id==='card',m:["After our talk, I put the \"sunny\" card next to the register. It makes the counter brighter, right?","さっきの 話の あと、 「sunny」の カードを レジの となりに おいたんです。 カウンターが 明るく なったでしょ？"],ex:'laugh',p:'thumb',o:[
 ["It looks nice there.","いい 感じ。",["Right? Maybe I'll add a \"kind\" card too. A sunny and kind counter!","ですよね？ 「kind」の カードも おこうかな。 晴れやかで やさしい カウンター！",'smile']],
 ["Don't sell it by mistake.","まちがえて 売らないでね。",["Oh no, that's exactly the kind of thing I would do! I'll put a sticker on it.","うわ、 わたし やりそう！ シール はっておきます。",'oops']]]},
{id:'fu_study',k:'mio',if:e=>e.id==='study',m:["I tried your study tip! I said ten words out loud this morning. My neighbor's dog barked back.","さっきの 勉強法、 やってみました！ けさ 単語を 10こ 声に 出したら、 となりの 犬が ほえかえして きました。"],ex:'laugh',o:[
 ["The dog is studying too.","犬も 勉強中だね。",["Ha ha! \"Woof\" might be his first English word.","あはは！ 「ワン」が はじめての 英単語 かも。",'laugh']],
 ["Did you remember them?","おぼえられた？",["Seven out of ten! That's a new record for me!","10こ中 7こ！ わたしの 新記録！",'smile']]]},
{id:'fu_oops',k:'mio',if:e=>e.id==='oops',m:["About the card I dropped in the sea… I walked along the beach this morning. No card. But I found a pretty shell!","海に 落とした カードの こと… けさ 浜辺を 歩いたんです。 カードは なかった けど、 きれいな 貝がらが ありました！"],ex:'smile',o:[
 ["Maybe the sea traded with you.","海が 交換して くれたのかも。",["A trade with the sea! I like that idea. Fair deal!","海との 交換！ その 考え 好き。 公平な 取り引き！",'laugh']],
 ["Be careful near the water.","水の 近くは 気を つけて。",["I will. Thank you for worrying about me, boss.","はい。 心配して くれて ありがとう、 店長。",'wink']]],ph:["fair deal","公平な 取り引き"]},
{id:'fu_college',k:'mio',if:e=>e.id==='college',m:["Boss, my friends asked about the presentation. I told them, \"My boss helped me!\" Is that OK?","店長、 友だちに 発表の こと 聞かれて 「店長が 助けて くれた！」って 言っちゃいました。 いいですか？"],ex:'wink',o:[
 ["Of course.","もちろん。",["Now they all want to meet you. Be ready for a lot of college students!","みんな 店長に 会いたがってます。 大学生が いっぱい 来るかも！",'laugh']],
 ["You did it by yourself.","ミオが 自分で がんばったんだよ。",["…Thank you. You always say the right thing.","…ありがとう。 店長って いつも ほしい ことばを くれる。",'smile']]]},
{id:'fu_dream',k:'mio',if:e=>e.id==='dream',m:["I've been thinking about my dream since we talked. Maybe I'll start by guiding customers around this beach!","さっきの 夢の 話から ずっと 考えてて。 まずは お客さんに この 浜辺を 案内する ところから はじめようかな！"],ex:'laugh',p:'guts',o:[
 ["Great first step.","いい 第一歩だね。",["Every big dream starts with a small step. I read that somewhere!","大きな 夢も 小さな 一歩から。 どこかで 読みました！",'smile']],
 ["Guide me first.","まず ぼくを 案内して。",["OK! \"Welcome to the card shop! On your left… is me!\" Ha ha.","はい！ 「カードショップへ ようこそ！ 左手に 見えますのは… わたし！」 あはは。",'laugh']]],ph:["first step","第一歩"]},
{id:'fu_rain',k:'mio',if:e=>e.id==='rain',m:["That rainy day talk… It was nice. Now I kind of hope it rains again.","あの 雨の 日の 話… よかったな。 また 雨が ふれば いいのにって 思っちゃう。"],ex:'smile',o:[
 ["Me too.","同じく。",["Then let's make a deal. Next rainy day, cocoa is on me.","じゃあ 約束。 次の 雨の 日は、 ココアは わたしの おごり。",'wink']],
 ["Sunny days are nice too.","晴れの 日も いいよ。",["You're right. Any day is nice… when you're here. …Oops, I said that.","そうですね。 どんな 日も いい日… 店長が いれば。 …あっ、 言っちゃった。",'oops']]],ph:["It's on me.","わたしの おごり。"]},
{id:'fu_night',k:'mio',if:e=>e.id==='night',m:["I still remember the stars from our walk. I tried to find them again last night, but I fell asleep.","いっしょに 見た 星、 まだ おぼえてます。 きのうの 夜も さがそうと したけど、 ねちゃいました。"],ex:'sleepy',o:[
 ["Let's look together again.","また いっしょに 見よう。",["Really? Then I'll stay awake this time. I promise. …Probably.","ほんと？ じゃあ 今度は 起きてます。 約束。 …たぶん。",'wink']],
 ["Sleep is important.","ねむるのは 大事。",["You sound like my mom! …But you're right.","母みたいな こと 言う！ …でも そうですね。",'laugh']]]},
{id:'fu_heart',k:'mio',st:4,if:e=>e.id==='heart',m:["Um… about what I said before… Please don't think about it too much. Or… do. I don't know!","えっと… さっき 言った こと… あんまり 気に しないで ください。 …やっぱり 気に して。 わかんない！"],ex:'oops',o:[
 ["I'm thinking about it.","ちゃんと 考えてる。",["…OK. Then I'll wait. Patiently. While dusting the same shelf ten times.","…はい。 じゃあ 待ってます。 じっと。 同じ たなを 10回 ふきながら。",'wink']],
 ["I'm glad you told me.","話して くれて うれしい。",["Me too. My heart is still beating fast, though. Ha ha.","わたしも。 まだ ドキドキ してますけど。 あはは。",'laugh']]]},
{id:'fu_date',k:'mio',st:5,if:e=>e.id==='date'||e.id==='promise',m:["I wrote about our day in my English diary. The title is \"The Best Day.\" Too simple?","ふたりの 日の こと、 英語の 日記に 書いたんです。 タイトルは 「The Best Day」。 シンプル すぎ？"],ex:'wink',p:'peace',o:[
 ["It's perfect.","かんぺき。",["Then I'll keep writing \"The Best Day, Part 2,\" \"Part 3\"… forever.","じゃあ 「The Best Day その2」「その3」… ずっと 書きつづけます。",'laugh']],
 ["Can I read it?","読んで いい？",["No way! …Maybe someday. When I fix all the grammar.","ぜったい だめ！ …いつか ね。 文法を ぜんぶ なおしたら。",'oops']]]},

/* =============================================================== 🌊 浜辺の イベント（いま 見えている もの） */
{id:'bv_dolphin',k:'bev',if:e=>e.id==='dolphins'||e.id==='dolphinshow',m:["Boss, look outside! Dolphins! They're jumping!","店長、 外 見て！ イルカ！ はねてる！"],ex:'laugh',p:'wave',o:[
 ["They look so happy.","楽しそう。",["They're playing tag! I want to join. …I can't swim fast, though.","おにごっこ してる！ まざりたい。 …泳ぐの おそいけど。",'laugh']],
 ["Let's count them!","数えよう！",["One, two, three… they keep moving! Dolphins are bad at standing in line.","1、 2、 3… うごいちゃう！ イルカは 一列に ならぶのが 苦手 ですね。",'laugh']],
 ["What's a group of dolphins called?","イルカの むれって 英語で なんて いう？",["A \"pod\"! I learned it last week. Am I smart or what?","「pod」！ 先週 おぼえたんです。 かしこいでしょ？",'wink']]],ph:["a pod of dolphins","イルカの むれ"]},
{id:'bv_whale',k:'bev',if:e=>e.id==='whale'||e.id==='whaleshow',m:["Is that… a whale?! Boss, the sea is showing off today!","あれって… クジラ？！ 店長、 きょうの 海は 見せびらかして ますね！"],ex:'laugh',o:[
 ["It's huge!","でかい！",["Huge! Enormous! Gigantic! I'm using all my big words.","でかい！ エノーマス！ ジャイガンティック！ 大きい 単語 ぜんぶ 使っちゃう。",'laugh']],
 ["Make a wish!","ねがいごと！",["That's for shooting stars! …But OK. I wish the whale a nice day.","それは 流れ星 です！ …でも いいか。 クジラさんが いい 日を すごせますように。",'smile']]],ph:["show off","見せびらかす"]},
{id:'bv_rainbow',k:'bev',if:e=>e.id==='rainbow'||e.id==='moonbow',m:["A rainbow! Boss, quick, how many colors can you name in English?","虹！ 店長、 はやく、 英語で 何色 言えます？"],ex:'laugh',p:'wave',o:[
 ["Red, orange, yellow, green, blue…","赤、 オレンジ、 黄、 緑、 青…",["…indigo, and violet! Seven! We did it together!","…藍色、 むらさき！ 7色！ ふたりで 言えた！",'laugh']],
 ["Just one: beautiful.","1つだけ。 きれい。",["\"Beautiful\" isn't a color! …But today, maybe it is.","「きれい」は 色じゃ ない！ …でも きょうは そうかも。",'wink']]],ph:["indigo / violet","藍色 ／ すみれ色"]},
{id:'bv_meteor',k:'bev',if:e=>/meteors|mstorm|starfall|rn_wish/.test(e.id),m:["Shooting stars! So many! Quick, boss, three wishes!","流れ星！ いっぱい！ はやく、 店長、 ねがいごと 3回！"],ex:'laugh',p:'guts',o:[
 ["Done!","できた！",["Already?! You're too fast. I only got to \"I wish…\"","もう？！ はやすぎ。 わたし まだ 「I wish…」まで。",'oops']],
 ["What did you wish for?","なにを ねがったの？",["It's a secret! …OK, one of them was \"No more spelling mistakes.\"","ひみつ！ …まあ 1つは 「スペルミスが なくなりますように」。",'wink']]],ph:["I wish…","〜だったら いいのに"]},

{id:'bv_fw',k:'bev',if:e=>e.cat==='show',m:["{Ev}! Boss, let's take a five-minute break and watch!","{evj}！ 店長、 5分だけ 休けい して 見ましょう！"],ex:'laugh',p:'guts',o:[
 ["Good idea!","いいね！",["Yay! …Wait, who will watch the shop? …The seagulls!","やった！ …あれ、 お店は 誰が？ …カモメさん！",'laugh']],
 ["We can see it from here.","ここから 見えるよ。",["You're right! The best seats in town. And they're free!","ほんとだ！ 町で いちばんの 特等席。 しかも タダ！",'laugh']]],ph:["the best seats in town","町いちばんの 特等席"]},
{id:'bv_magic',k:'bev',if:e=>e.cat==='magic',m:["Boss… is that {ev}?! I'm not dreaming, right? Pinch me!","店長… あれ {evj}？！ 夢じゃ ないですよね？ つねって！"],ex:'oops',o:[
 ["You're not dreaming.","夢じゃ ないよ。",["Then this beach is magic! I knew it. That's why I work here.","じゃあ この 浜辺は 魔法 なんだ！ やっぱり。 だから ここで 働いてるんです。",'laugh']],
 ["Maybe you are.","夢 かもね。",["Hey, don't scare me! …Ouch. OK, I pinched myself. I'm awake!","ちょっと、 こわがらせないで！ …いたっ。 自分で つねりました。 起きてます！",'oops']]],ph:["Pinch me!","（夢じゃないか）つねって！"]},
{id:'bv_sea',k:'bev',if:e=>e.cat==='sea',m:["Look, boss! There's {ev} out on the sea! I love working by the ocean.","見て、 店長！ 海に {evj}！ 海の そばで 働けるって しあわせ。"],ex:'smile',p:'wave',o:[
 ["It's a peaceful view.","おだやかな ながめ だね。",["\"A peaceful view.\" I'm going to use that in my next memo.","「おだやかな ながめ」。 次の メモで 使おう。",'smile']],
 ["Let's take a short break and watch.","ちょっと 休けいして 見よう。",["A tiny break. Just one minute. …OK, maybe three.","ちょっとだけ 休けい。 1分だけ。 …やっぱり 3分。",'wink']]],ph:["a peaceful view","おだやかな ながめ"]},
{id:'bv_sky',k:'bev',if:e=>e.cat==='sky',m:["Boss, look up! There's {ev} in the sky!","店長、 上 見て！ 空に {evj}！"],ex:'laugh',p:'wave',o:[
 ["Where?","どこ？",["Over there! Next to the cloud that looks like a rice ball.","あそこ！ おにぎりみたいな 雲の となり。",'laugh']],
 ["I see it!","見えた！",["Isn't it great? The sky here is never boring.","いいですよね？ ここの 空って ぜったい あきない。",'smile']]],ph:["Look up!","上を 見て！"]},
{id:'bv_beach',k:'bev',if:e=>e.cat==='beach',m:["Look, {ev} on the beach! Every day is a little different here.","見て、 浜辺に {evj}！ ここは 毎日 ちょっとずつ ちがう。"],ex:'smile',o:[
 ["That's why I like this beach.","だから この 浜辺が 好き。",["Me too! …Hey, we agree! High five!","わたしも！ …あ、 意見 あいましたね！ ハイタッチ！",'laugh']],
 ["Let's say hello.","あいさつ しよう。",["Hello! …They can't hear us from here. Ha ha.","ハロー！ …ここからじゃ 聞こえないか。 あはは。",'laugh']]],ph:["High five!","ハイタッチ！"]},
{id:'bv_night',k:'bev',if:e=>e.cat==='night',m:["Boss, look outside. {Ev}… so beautiful. Nights at the beach are special.","店長、 外 見て。 {evj}… きれい。 浜辺の 夜って 特別。"],ex:'smile',o:[
 ["It's magical.","魔法 みたい。",["Yes… \"magical\" is the perfect word. Let's be quiet for a moment.","うん… 「magical」が ぴったり。 ちょっとだけ しずかに 見ましょう。",'smile']],
 ["Shouldn't you go home? It's late.","そろそろ 帰らなくて いいの？ おそいよ。",["Thanks for worrying. Five more minutes! This view is my reward.","心配 ありがとう。 あと 5分！ この けしきが ごほうび なんです。",'wink']]],ph:["It's magical.","魔法 みたい。"]},
{id:'bv_weather',k:'bev',if:e=>e.cat==='weather',m:["Oh, {ev}… The weather is changing. Did you bring an umbrella, boss?","あ、 {evj}… 天気が かわってきた。 かさ もってます、 店長？"],ex:'oops',o:[
 ["No…","ない…",["I have two! You can borrow one. It's yellow, with ducks on it.","わたし 2本 もってます！ 1本 かします。 黄色で、 アヒル がら。",'laugh']],
 ["I like this kind of weather.","こういう 天気も 好き。",["Me too. The shop feels cozy when the weather is moody.","わたしも。 お天気が ぐずついてると お店が ほっこり 感じます。",'smile']]],ph:["You can borrow mine.","わたしのを かして あげる。"]},
/* =============================================================== ☔🌙 いまの ようす */
{id:'st_rain',k:'rain',m:["It's raining, boss. Rainy days are slow… but I like the sound.","雨ですね、 店長。 雨の 日は ひま… でも この 音は 好き。"],ex:'smile',o:[
 ["Let's study English, then.","じゃあ 英語の 勉強 しよう。",{m:["OK! Rain words: \"drizzle,\" \"shower,\" \"downpour.\" Which one is today?","はい！ 雨の 単語: 「drizzle（霧雨）」、 「shower（にわか雨）」、 「downpour（どしゃぶり）」。 きょうは どれ？"],ex:'smile',o:[
  ["A drizzle.","霧雨。",["I think so too! Soft and quiet. Like a cat walking.","わたしも そう 思う！ やわらかくて しずか。 ねこが 歩く みたい。",'smile']],
  ["A downpour!","どしゃぶり！",["Then nobody will come today. More time to talk! Ha ha.","じゃあ きょうは だれも 来ない。 話す 時間が ふえますね！ あはは。",'laugh']]]}],
 ["It's a little gloomy.","ちょっと ゆううつ。",["Then I'll be the sunshine! \"Sunny Mio,\" at your service!","じゃあ わたしが お日さまに なります！ 「晴れやか ミオ」、 参上！",'laugh']]],ph:["It's raining cats and dogs.","どしゃぶりだ。"]},
{id:'st_night',k:'night',m:["It's late, boss. Do you usually stay up this late?","もう おそいですよ、 店長。 いつも こんなに 夜ふかし？"],ex:'sleepy',o:[
 ["I'm a night owl.","夜型なんだ。",["A night owl! Me too. Owls and cards, the perfect night shop.","夜型！ わたしも。 フクロウと カード、 最高の 夜の お店。",'laugh',{mem:'owl=night'}]],
 ["Not usually.","ふだんは しない。",["Then don't push yourself. Sleep is important for remembering words!","じゃあ むり しないで。 単語を おぼえるには ねむりが 大事！",'smile',{mem:'owl=morning'}]]],ph:["night owl","夜型の 人"]},
{id:'st_morning',k:'morning',m:["Good morning, boss! Are you a morning person? I need three alarms to wake up.","おはようございます、 店長！ 朝 強いほう？ わたしは 目ざまし 3つ ないと 起きられない。"],ex:'sleepy',o:[
 ["I'm an early bird.","朝型だよ。",["Wow! \"The early bird catches the worm.\" …I don't want a worm, though.","すごい！ 「早起きの 鳥は 虫を つかまえる」。 …虫は いらないけど。",'laugh',{mem:'owl=morning'}]],
 ["Three alarms? Same here.","3つ？ 同じだ。",["Ha ha! Team Sleepy! Let's make T-shirts.","あはは！ ねぼすけ チーム！ おそろいの Tシャツ 作りましょう。",'laugh',{mem:'owl=night'}]]],ph:["The early bird catches the worm.","早起きは 三文の 徳。"]},
{id:'st_dusk',k:'dusk',m:["The sun is going down. This is my favorite time! What's your favorite time of day?","日が しずんで きた。 いちばん 好きな 時間！ 店長は 一日の 中で いつが 好き？"],ex:'smile',o:[
 ["Morning.","朝。",["Fresh air, quiet beach… nice choice. I'm usually still asleep, though.","すずしい 空気、 しずかな 浜辺… いいですね。 わたしは まだ ねてますけど。",'wink']],
 ["Sunset, like you.","ミオと 同じ 夕方。",["Same! Let's watch it together. …Just for a minute, then back to work!","いっしょ！ いっしょに 見ましょう。 …1分だけ。 そしたら 仕事！",'laugh']],
 ["Midnight.","真夜中。",["Midnight! So cool and mysterious. I'm always asleep by then.","真夜中！ かっこよくて ミステリアス。 わたしは もう ねてる 時間。",'oops']]],ph:["What's your favorite time of day?","一日の 中で いつが 好き？"]},
{id:'st_hp',k:'hpLow',m:["Boss, are you OK? You look a little pale. Did you eat?","店長、 だいじょうぶ？ ちょっと 顔色 わるい。 ごはん 食べました？"],ex:'oops',o:[
 ["Not yet.","まだ。",["Then go eat something! Marco's diner is right next door. That's an order… from your part-timer.","じゃあ なにか 食べて！ マルコさんの 食堂は すぐ そこ。 これは… バイトからの 命令です。",'oops']],
 ["I'm OK.","だいじょうぶ。",["Hmm… OK. But if you fall asleep at the counter, I'll draw on your face.","うーん… わかりました。 でも カウンターで ねたら、 顔に らくがき しますよ。",'wink']]],ph:["You look pale.","顔色が わるいよ。"]},
{id:'st_food',k:'food',m:["Boss, what's in your bag? Is that {a_food}? It smells so good.","店長、 かばんの 中 なに？ {foodj}？ いい におい。"],ex:'wink',o:[
 ["Do you want some?","食べる？",{m:["Really?! …No, no. It's yours. …But if you insist…","ほんと？！ …いえいえ、 店長のです。 …でも、 どうしても って いうなら…"],ex:'wink',o:[
  ["Here, take it.","はい、 どうぞ。",["Yay! Thank you, boss! Let me get a plate!","やった！ ありがとう、 店長！ お皿 もってきます！",'laugh',{go:'gift'}]],
  ["Ha ha, maybe later.","あはは、 またあとで。",["\"Maybe later\"… the saddest words in English. Ha ha!","「またあとで」… 英語で いちばん 悲しい ことば。 あはは！",'laugh']]]}],
 ["It's my snack for later.","あとで 食べる おやつ。",["Don't forget to eat it! Food is energy, and energy is digging power!","わすれず 食べて ください！ ごはんは エネルギー、 エネルギーは ほる 力！",'smile']]],ph:["if you insist","どうしても って いうなら"]},
{id:'st_gifts',k:'gifts',st:1,m:["Boss, I see {a_item} in your bag. Is it for someone special?","店長、 かばんに {itemj}が 見えてますよ。 だれか 特別な 人へ？"],ex:'smile',o:[
 ["It's for you.","ミオに。",["For me?! Wait, really? …My heart is beating so fast!","わたしに？！ ほんとに？ …ドキドキ してきた！",'laugh',{go:'gift'}]],
 ["It's for someone else.","ほかの 人に。",["Oh… I see! I'm sure they'll love it. …Ha ha, I'm fine. Totally fine.","あ… そうなんだ！ きっと よろこびますよ。 …あはは、 へいきです。 ぜんぜん。",'oops']],
 ["It's a secret.","ひみつ。",["Secrets, secrets… This shop is full of mysteries today!","ひみつ、 ひみつ… きょうの お店は なぞだらけ！",'wink']]]},
{id:'st_song',k:'song',m:["This song makes me want to dance while I sweep. Sweep, step, sweep, step!","この曲、 そうじ しながら おどりたく なる。 はいて、 ステップ、 はいて、 ステップ！"],ex:'laugh',o:[
 ["Nice moves!","いい うごき！",["Thank you! I call it \"the broom dance.\" Very popular. With me.","ありがとう！ 「ほうきダンス」って いうんです。 大人気。 わたしの 中で。",'laugh']],
 ["Careful with the shelf!","たなに 気を つけて！",["Don't worry, I— oops! …Nothing fell. Nothing at all.","だいじょうぶ、 わたし— おっと！ …なにも 落ちてません。 ぜんぜん。",'oops']]]},
{id:'st_empty',k:'empty',m:["Boss, the shelf is empty. Customers can't buy air!","店長、 売り場が からっぽ ですよ。 空気は 売れません！"],ex:'oops',o:[
 ["I'll put some cards out.","カード ならべる。",["Thank you! Let's make the shelf colorful!","ありがとう！ 売り場を カラフルに しましょう！",'laugh',{go:'floor'}]],
 ["Let's just chat today.","きょうは おしゃべり しよう。",["A chatting day? I like it. …But tomorrow, cards!","おしゃべりの 日？ いいですね。 …でも あしたは カード！",'wink']]]},
{id:'st_rich',k:'rich',m:["Boss, you have so many coins! Are you secretly rich?","店長、 コイン すごい！ じつは お金持ち？"],ex:'laugh',o:[
 ["I'm saving up.","ためてるんだ。",{m:["Saving up for what? Something big?","なにの ために？ 大きい もの？"],ex:'smile',o:[
  ["A big pile of packs.","パックを どっさり。",["No limit on packs now, right? Can I help open them? Please?","パックは せいげん なし ですもんね？ あけるの 手伝っても いい？ おねがい！",'laugh']],
  ["It's a secret.","ひみつ。",["A secret again?! Boss, you're a mystery.","また ひみつ？！ 店長って なぞの 人。",'wink']]]}],
 ["Want a raise?","時給 上げようか？",["A raise?! …Boss, don't joke about that. My heart can't take it!","時給 アップ？！ …店長、 その じょうだんは だめ。 心臓が もちません！",'oops']]],ph:["save up","お金を ためる"]},

/* =============================================================== 🧠 ミオが おぼえる（好きな もの） */
{id:'mm_taste',k:'any',if:(e,N,M)=>!M.taste,m:["Quick question, boss! Sweet, spicy, or salty? What's your favorite taste?","店長、 しつもん！ あまい、 からい、 しょっぱい？ どの 味が 好き？"],ex:'smile',o:[
 ["Sweet!","あまい もの！",["Me too! Sweet things make every day better.","わたしも！ あまい ものは 毎日を よく してくれる。",'laugh',{mem:'taste=sweet'}]],
 ["Spicy!","からい もの！",["Brave! I like spicy food too, but my face turns red like a tomato.","勇者！ わたしも 好きだけど、 顔が トマトみたいに 赤く なるんです。",'laugh',{mem:'taste=spicy'}]],
 ["Salty!","しょっぱい もの！",["Chips and rice crackers! Good choice. Crunch, crunch!","ポテチと おせんべい！ いいですね。 ポリポリ！",'smile',{mem:'taste=salty'}]]],ph:["What's your favorite taste?","どの 味が 好き？"]},
{id:'mm_season',k:'any',if:(e,N,M)=>!M.season,m:["What's your favorite season? I'm a summer person. Obviously. I work at a beach!","好きな 季節は？ わたしは 夏派。 そりゃそう。 浜辺で 働いてるし！"],ex:'laugh',o:[
 ["Spring.","春。",["Flowers and new beginnings! Spring is full of hope.","花と 新しい はじまり！ 春は 希望で いっぱい。",'smile',{mem:'season=spring'}]],
 ["Summer, like you.","ミオと 同じ 夏。",["Summer team! Ice cream and fireworks forever!","夏チーム！ アイスと 花火よ 永遠に！",'laugh',{mem:'season=summer'}]],
 ["Fall.","秋。",["Fall… cool wind, good food, and good books. Very stylish, boss.","秋… すずしい 風、 おいしい ごはん、 本。 おしゃれ ですね、 店長。",'wink',{mem:'season=fall'}]],
 ["Winter.","冬。",["Winter? At a beach shop? Ha ha! But warm cocoa in the cold is the best.","冬？ 浜辺の お店で？ あはは！ でも 寒い 日の ココアは 最高。",'laugh',{mem:'season=winter'}]]],ph:["I'm a summer person.","わたしは 夏派。"]},
{id:'mm_pet',k:'any',if:(e,N,M)=>!M.pet,m:["Boss, are you a dog person or a cat person?","店長は 犬派？ ねこ派？"],ex:'smile',o:[
 ["A dog person.","犬派。",["Dogs are so honest. When they're happy, their whole body says \"Happy!\"","犬って 正直ですよね。 うれしいと 体ぜんぶで 「うれしい！」って 言う。",'laugh',{mem:'pet=dog'}]],
 ["A cat person.","ねこ派。",["Cats! Cool and a little mysterious. Like you, boss. Ha ha.","ねこ！ クールで ちょっと ミステリアス。 店長 みたい。 あはは。",'wink',{mem:'pet=cat'}]],
 ["I love both.","どっちも 好き。",["Both? That's cheating! …Ha ha, I love both too.","どっちも？ ずるい！ …あはは、 わたしも 両方 好き。",'laugh',{mem:'pet=both'}]]],ph:["a dog person / a cat person","犬派 ／ ねこ派"]},
{id:'mm_place',k:'any',st:1,if:(e,N,M)=>!M.place,m:["If you could go anywhere in the world, where would you go?","世界の どこにでも 行けるなら、 どこに 行きたい？"],ex:'smile',o:[
 ["Paris.","パリ。",["Paris! Croissants, art, and the Eiffel Tower. Très bien!","パリ！ クロワッサン、 絵、 エッフェル塔。 トレビアン！",'laugh',{mem:'place=paris'}]],
 ["Hawaii.","ハワイ。",["Another beach? Ha ha! You really love the sea, boss.","また 浜辺？ あはは！ ほんとに 海が 好き なんですね。",'laugh',{mem:'place=hawaii'}]],
 ["London.","ロンドン。",["London! Big Ben, red buses, and lots of English. Perfect for practice!","ロンドン！ ビッグベン、 赤い バス、 英語 いっぱい。 練習に ぴったり！",'smile',{mem:'place=london'}]],
 ["Space!","宇宙！",["Space?! That's not in the world! …Well, it's above it. OK, I'll allow it.","宇宙？！ それ 世界じゃ ない！ …まあ 上に あるか。 ゆるします。",'oops',{mem:'place=space'}]]],ph:["If you could go anywhere…","どこにでも 行けるなら…"]},
{id:'mm_off',k:'any',st:1,if:(e,N,M)=>!M.off,m:["Boss, what do you do on your day off? I can't imagine you not working!","店長、 お休みの 日は なに してるんですか？ 働いてない 店長、 想像 できない！"],ex:'smile',o:[
 ["I sleep all day.","一日中 ねてる。",["All day?! …That sounds amazing, actually.","一日中？！ …じつは すごく いいかも。",'sleepy',{mem:'off=sleep'}]],
 ["I read books.","本を 読む。",["Nice! Tell me your favorite book sometime. In English, if possible!","いいですね！ 今度 お気に入りの 本、 教えて。 できれば 英語で！",'smile',{mem:'off=read'}]],
 ["I walk on the beach.","浜辺を 歩く。",["The same beach as work? Ha ha! You really love this place.","仕事と 同じ 浜辺？ あはは！ ほんとに ここが 好き なんですね。",'laugh',{mem:'off=walk'}]],
 ["I cook.","料理する。",["You cook?! Next time, bring me something. For… research.","料理 するんですか？！ 今度 なにか もってきて。 …研究の ために。",'wink',{mem:'off=cook'}]]],ph:["on your day off","お休みの 日に"]},
/* おぼえた ことを 話す */
{id:'mc_sweet',k:'mem',if:(e,N,M)=>M.taste==='sweet',m:["You said you like sweet things, right? I found a new cake shop in town. …Just saying!","あまい もの 好き って 言ってましたよね？ 町に 新しい ケーキ屋さん 見つけたんです。 …いちおう 報告！"],ex:'wink',o:[
 ["Let's go together sometime.","今度 いっしょに 行こう。",["Really? It's a promise! …I mean, a business meeting. Ha ha.","ほんとに？ 約束 ですよ！ …えっと、 仕事の 打ち合わせ として。 あはは。",'laugh']],
 ["What kind of cake?","どんな ケーキ？",["Strawberry shortcake! Fluffy, sweet, and pink. Like a cloud you can eat.","いちごの ショートケーキ！ ふわふわ、 あまくて、 ピンク。 食べられる 雲 みたい。",'laugh']]],ph:["Just saying!","いちおう 言って おくね！"]},
{id:'mc_spicy',k:'mem',if:(e,N,M)=>M.taste==='spicy',m:["You like spicy food, right? Marco says he can make his curry \"volcano hot.\" Are you brave enough?","からい もの 好き でしたよね？ マルコさんが 「火山みたいに からい カレー」 作れるって。 挑戦 します？"],ex:'laugh',o:[
 ["Bring it on!","かかってこい！",["Ha ha! I'll bring the milk. You'll need it.","あはは！ 牛乳 もっていきます。 ひつように なるから。",'laugh']],
 ["Maybe medium hot.","中辛 くらいで。",["Smart choice. \"Volcano\" is only for heroes. And Marco.","かしこい。 「火山」は 勇者 だけ。 あと マルコさん。",'wink']]],ph:["Bring it on!","かかってこい！"]},
{id:'mc_salty',k:'mem',if:(e,N,M)=>M.taste==='salty',m:["You said you like salty snacks, so I brought rice crackers today. Want one? Crunch, crunch!","しょっぱいの 好き って 言ってたから、 きょう おせんべい もってきました。 1まい どう？ ポリポリ！"],ex:'laugh',o:[
 ["Thank you!","ありがとう！",["You're welcome! Snack break with the boss. Best part-time job ever.","どういたしまして！ 店長と おやつ休けい。 最高の バイト。",'laugh']],
 ["You remembered!","おぼえてて くれたんだ！",["Of course! I write everything down. In English!","もちろん！ ぜんぶ メモしてます。 英語で！",'wink']]]},
{id:'mc_season',k:'mem',if:(e,N,M)=>!!M.season,m:["You said {m_season} is your favorite season. What do you like most about it?","好きな 季節は {m_seasonj} でしたよね。 どんな ところが 好き？"],ex:'smile',o:[
 ["The food.","食べ物。",["Ha ha, same answer as me! Every season tastes different.","あはは、 わたしと 同じ 答え！ 季節ごとに 味が ちがう。",'laugh']],
 ["The air.","空気。",["I know what you mean. Each season has its own smell, right?","わかります。 季節ごとに においが ありますよね。",'smile']],
 ["The memories.","思い出。",["…That's a beautiful answer. Let's make more memories here, boss.","…すてきな 答え。 ここでも 思い出、 たくさん 作りましょう、 店長。",'wink']]]},
{id:'mc_dog',k:'mem',if:(e,N,M)=>M.pet==='dog'||M.pet==='both',m:["You're a dog person, right? Pochi was running on the beach this morning. So cute!","犬派 でしたよね？ けさ ポチが 浜辺を 走ってました。 かわいすぎ！"],ex:'laugh',o:[
 ["Did you pet him?","なでた？",["I tried! He ran away with my sandal. Ha ha.","なでようと したら、 わたしの サンダル くわえて にげました。 あはは。",'laugh']],
 ["I want to see him!","会いたい！",["He comes at around seven every morning. Early bird dog!","毎朝 7時ごろ 来ますよ。 早起きの 犬！",'smile']]]},
{id:'mc_cat',k:'mem',if:(e,N,M)=>M.pet==='cat'||M.pet==='both',m:["You're a cat person, right? A cat sat in front of the shop today. I think it was waiting for you.","ねこ派 でしたよね？ きょう お店の 前に ねこが すわってたんです。 店長を 待ってたん だと 思う。"],ex:'wink',o:[
 ["Maybe it wants a card.","カードが ほしいのかも。",["A cat customer! \"One 'fish' card, please.\" Ha ha!","ねこの お客さん！ 「fish の カード 1まい ください」。 あはは！",'laugh']],
 ["Where is it now?","いま どこ？",["It went to sleep in the sun. Cats have the best life.","日なたで ねちゃいました。 ねこって 最高の 人生。",'sleepy']]]},
{id:'mc_place',k:'mem',if:(e,N,M)=>!!M.place,m:["You said you want to go to {m_place}, right? I looked at a guidebook at the library. It looks amazing!","{m_placej}に 行きたいって 言ってましたよね？ 図書館で ガイドブック 見たんです。 すごそう！"],ex:'laugh',o:[
 ["Let's go together someday.","いつか いっしょに 行こう。",["Really? Then I'll be your guide! I'll study the map every night.","ほんと？ じゃあ わたしが ガイド します！ 毎晩 地図を 勉強します。",'laugh']],
 ["What did the book say?","本に なんて 書いてあった？",["It said, \"Bring good shoes.\" …That's all I remember. I was looking at the pictures.","「歩きやすい くつで」って。 …それしか おぼえてない。 写真ばかり 見てて。",'oops']]]},
{id:'mc_off',k:'mem',if:(e,N,M)=>!!M.off,m:["On your last day off, did you {m_off} again?","この前の お休みも、 また {m_offj}？"],ex:'smile',o:[
 ["Of course.","もちろん。",["Ha ha! You're very consistent, boss. I respect that.","あはは！ 店長って ぶれない。 尊敬します。",'laugh']],
 ["I tried something new.","新しい ことを した。",["Something new? Tell me next time! I want details.","新しい こと？ 今度 教えて！ くわしく！",'wink']]],ph:["consistent","ぶれない・一貫した"]},
{id:'mc_owl',k:'mem',if:(e,N,M)=>!!M.owl,m:["You told me you're {m_owl}. So… are you a coffee person or a tea person?","店長は {m_owlj} でしたよね。 じゃあ… コーヒー派？ 紅茶派？"],ex:'smile',o:[
 ["Coffee.","コーヒー。",["Coffee! Then I'll learn how to make good coffee. Barista Mio!","コーヒー！ じゃあ おいしい いれ方 おぼえます。 バリスタ ミオ！",'laugh']],
 ["Tea.","紅茶。",["Tea! Very elegant. \"Would you like some tea?\" …How was my accent?","紅茶！ 上品。 「お茶は いかが？」 …発音 どうでした？",'wink']]],ph:["Would you like some tea?","お茶は いかがですか？"]},

/* =============================================================== 💭 いつでも */
{id:'an_cheap',k:'any',m:["Boss, quiz time! What's the opposite of \"expensive\"?","店長、 クイズ！ 「expensive（高い）」の 反対は？"],ex:'smile',p:'thumb',o:[
 ["Cheap.","cheap（安い）。",["Correct! Our cards aren't \"cheap,\" though. They're \"reasonable.\" Ha ha.","正解！ でも うちの カードは 「安い」 じゃ なくて 「お手ごろ」。 あはは。",'laugh']],
 ["Expansive.","expansive。",["Close, but no! \"Expansive\" means \"wide.\" The answer is \"cheap\"!","おしい、 けど ちがう！ 「expansive」は 「広い」。 答えは 「cheap」！",'oops']]],ph:["reasonable","お手ごろな"]},
{id:'an_twist',k:'any',m:["Do you know any tongue twisters? Listen: \"She sells seashells by the seashore.\" …She sells sea-sells… ugh!","早口ことば 知ってます？ 聞いて: 「She sells seashells by the seashore.」 …シー セルズ シー セルズ… うう！"],ex:'oops',o:[
 ["Try again, slowly.","ゆっくり もう一回。",["She… sells… seashells… by the seashore! I did it!","シー… セルズ… シーシェルズ… バイ ザ シーショア！ 言えた！",'laugh']],
 ["Here's one: \"Red lorry, yellow lorry.\"","これは？ 「Red lorry, yellow lorry」。",["Red lolly, yellow lorry, led lorry… Boss, that's evil!","レッド ロリー、 イエロー ローリー、 レッド ローリ… 店長、 それ いじわる！",'laugh']]],ph:["She sells seashells by the seashore.","彼女は 海辺で 貝がらを 売る（早口ことば）"]},
{id:'an_listen',k:'any',m:["I have a listening test next week. Can you say a sentence? I'll try to catch it!","来週 リスニングの テストなんです。 なにか 文を 言って くれます？ 聞きとって みる！"],ex:'smile',o:[
 ["\"The cat is on the table.\"","「ねこは テーブルの 上」。",["\"The cat is on the… cable\"? …No! Table! I got it!","「ねこは ケーブルの…」？ …ちがう！ テーブル！ わかった！",'laugh']],
 ["\"Mio works very hard.\"","「ミオは よく がんばってる」。",["\"Mio works very hard.\" …Boss! That's not a test sentence. That's a compliment! Thank you.","「ミオは よく がんばってる」。 …店長！ それ テストの 文じゃ なくて ほめ言葉！ ありがとう。",'wink']]],ph:["compliment","ほめ言葉"]},
{id:'an_ears',k:'any',m:["Boss, what does \"I'm all ears\" mean? A customer said it to me. Do I have big ears?","店長、 「I'm all ears」って どういう 意味？ お客さんに 言われたんです。 わたし 耳 大きい？"],ex:'oops',o:[
 ["It means \"I'm listening.\"","「ちゃんと 聞いてるよ」って 意味。",["Oh! Phew. I checked my ears in the mirror three times.","あ！ よかった。 鏡で 耳を 3回 チェック しちゃった。",'laugh']],
 ["Yes, they're huge.","うん、 すごく 大きい。",["Boss! …Wait, are they? No, you're teasing me!","店長！ …え、 ほんとに？ ちがう、 からかってる！",'oops']]],ph:["I'm all ears.","ちゃんと 聞いてるよ。"]},
{id:'an_power',k:'any',m:["If you could have any superpower, what would it be? I'd choose remembering every word I see!","超能力が もらえるなら なにに する？ わたしは 見た 単語を ぜんぶ おぼえる 力！"],ex:'smile',o:[
 ["Flying.","空を 飛ぶ。",["Flying! Then you could fly to the mine and back in one minute.","飛べたら 鉱山まで 1分で 行って 帰れますね。",'laugh']],
 ["Time travel.","タイムトラベル。",["Time travel? Go back and tell me not to drop that card in the sea!","タイムトラベル？ 過去に 行って、 カードを 海に 落とすなって 言って きて！",'oops']],
 ["The same as you!","ミオと 同じ！",["Then we'd be a super team! No word could escape us!","じゃあ 最強 チーム！ どんな 単語も にがさない！",'laugh']]],ph:["If you could…, what would you…?","もし 〜できたら 何を する？"]},
{id:'an_bandana',k:'any',m:["Do you know why I wear a yellow bandana? Because yellow is the color of happiness! …Also, it hides my messy hair.","わたしが 黄色い バンダナ してる 理由、 知ってます？ 黄色は しあわせの 色！ …あと、 ねぐせが かくれる。"],ex:'wink',o:[
 ["It suits you.","にあってる。",["R-really? Then I'll wear it forever. Ha ha!","ほ、 ほんと？ じゃあ ずっと つけます。 あはは！",'laugh']],
 ["Show me the messy hair.","ねぐせ 見せて。",["Never! It's top secret. The bandana stays!","ぜったい だめ！ 極秘です。 バンダナは とりません！",'oops']]],ph:["It suits you.","にあってるね。"]},
{id:'an_itadaki',k:'any',m:["Boss, how do you say \"itadakimasu\" in English? I always get stuck.","店長、 「いただきます」って 英語で なんて 言うの？ いつも こまっちゃう。"],ex:'smile',o:[
 ["\"Let's eat!\"","「Let's eat!」",["Simple! I like it. \"Let's eat!\" …Now I'm hungry again.","シンプル！ いいですね。 「Let's eat!」 …また おなか すいた。",'laugh']],
 ["There's no perfect word.","ぴったりの ことばは ない。",["Really? Then Japanese has a special word. Cool!","ほんとに？ じゃあ 日本語には 特別な ことばが あるんですね。 かっこいい！",'smile']]],ph:["Let's eat!","いただきます（に 近い 言い方）"]},
{id:'an_diary',k:'any',m:["I write a diary in English every night. Yesterday's diary was only one line: \"I was sleepy.\"","毎晩 英語で 日記を 書いてるんです。 きのうの 日記は 1行だけ: 「ねむかった」。"],ex:'sleepy',o:[
 ["That's still a diary!","それも りっぱな 日記！",["Right? Short and true. Tonight I'll write two lines!","ですよね？ みじかくて 正直。 今夜は 2行 書きます！",'laugh']],
 ["Write about the shop!","お店の こと 書いて！",["Good idea! \"Today, the boss was cool.\" …Oops, did I say that out loud?","いい アイデア！ 「きょう、 店長が かっこよかった」。 …あっ、 声に 出てた？",'oops']]],ph:["keep a diary","日記を つける"]},
{id:'an_guide',k:'any',st:1,m:["Boss, do you think I can be a tour guide someday? Be honest.","店長、 わたし いつか ツアーガイドに なれると 思います？ 正直に。"],ex:'smile',o:[
 ["Definitely.","ぜったい なれる。",["Thank you! I'll practice on you. \"Welcome to the beach! On your right…\"","ありがとう！ 店長で 練習します。 「浜辺へ ようこそ！ 右手に 見えますのは…」",'laugh']],
 ["You need more practice.","もっと 練習が いるね。",["You're right. Honest advice is the best advice. I'll work harder!","そうですね。 正直な アドバイスが いちばん。 もっと がんばります！",'smile']]],ph:["Be honest.","正直に 言って。"]},
{id:'an_watch',k:'any',m:["Do you know the difference between \"look,\" \"see,\" and \"watch\"? I always mix them up.","「look」「see」「watch」の ちがい、 わかります？ いつも ごちゃごちゃに なるんです。"],ex:'oops',o:[
 ["\"Watch\" is for things that move, like TV.","「watch」は テレビみたいに 動く ものを 見る。",["Ah! So I \"watch\" the waves and \"look at\" the cards. Got it!","なるほど！ 波は 「watch」、 カードは 「look at」。 わかった！",'laugh']],
 ["I mix them up too.","ごちゃまぜに なる。",["Phew, I'm not alone! Let's ask Ms. Mina together.","よかった、 わたしだけ じゃない！ いっしょに ミナ先生に 聞きましょう。",'smile']]],ph:["watch the waves","波を ながめる"]},
{id:'an_count',k:'any',m:["Boss, I tried to count all the cards in the storeroom last night. …I fell asleep at number 89.","店長、 きのう 倉庫の カードを ぜんぶ 数えようと したんです。 …89まいめで ねちゃった。"],ex:'sleepy',o:[
 ["Counting is like counting sheep.","数えるのって 羊を 数える みたい。",["Ha ha! \"One card, two cards…\" Zzz. It works too well!","あはは！ 「カード 1まい、 2まい…」 ぐう。 ききめ ありすぎ！",'laugh']],
 ["Let's count together next time.","今度 いっしょに 数えよう。",["Yes! You count the odd numbers, and I'll count the even ones.","はい！ 店長は 奇数、 わたしは 偶数 担当。",'smile']]],ph:["odd / even numbers","奇数 ／ 偶数"]},
{id:'an_person',k:'any',m:["Can I ask a strange question? If our shop were a person, what kind of person would it be?","へんな しつもん していい？ もし この お店が 人だったら、 どんな 人？"],ex:'smile',o:[
 ["A cheerful one, like you.","ミオ みたいな 明るい 人。",["Me?! Then the shop is a little clumsy too. Ha ha.","わたし？！ じゃあ お店も ちょっと おっちょこちょい だ。 あはは。",'laugh']],
 ["A quiet old man who loves the sea.","海が 好きな しずかな おじいさん。",["Ooh, I can see him! He drinks tea and tells stories about the old days.","わかる！ お茶を のみながら 昔の 話を する おじいさん。",'smile']]],ph:["If our shop were a person…","もし この 店が 人だったら…"]},
{id:'an_frizzy',k:'any',m:["The sea air makes my hair so frizzy. \"Frizzy\" — that's my new word today.","海の 空気で かみが ぼわっと しちゃう。 「frizzy」… きょうの 新しい 単語です。"],ex:'oops',o:[
 ["Mine too.","こっちも。",["Frizzy team! Ha ha. The sea is beautiful, but it's tough on hair.","ぼわぼわ チーム！ あはは。 海は きれいだけど、 かみには きびしい。",'laugh']],
 ["Nice word!","いい 単語！",["Right? You learn the best words from real life.","ですよね？ いちばん いい 単語は 毎日の 生活から。",'smile']]],ph:["frizzy hair","ぼわっと した かみ"]},
{id:'an_secret',k:'any',st:1,m:["Boss, can you keep a secret? …I talk to the cards when nobody is here. \"Good morning, apple! You look red today!\"","店長、 ひみつ 守れます？ …だれも いない とき、 カードに 話しかけてるんです。 「おはよう、 apple！ きょうも 赤いね！」"],ex:'wink',o:[
 ["What do they say back?","カードは なんて？",["Nothing… But I think \"sunny\" smiles a little.","なにも… でも 「sunny」は ちょっと 笑ってる 気が する。",'laugh']],
 ["I do that too.","同じこと してる。",["Really?! We're the same! The cards must think we're strange.","ほんと？！ 同じ！ カードたち、 へんな 人たちって 思ってますね。",'laugh']]],ph:["Can you keep a secret?","ひみつ 守れる？"]},
{id:'an_cake',k:'any',m:["I'm learning idioms. \"Piece of cake\" means \"easy.\" So… is this job a piece of cake? …Some days!","慣用句を 勉強中です。 「piece of cake」は 「かんたん」。 じゃあ… この 仕事は piece of cake？ …日に よる！"],ex:'laugh',o:[
 ["It is when you're here.","ミオが いれば かんたん。",["Boss… you're good at making people happy. That's not a piece of cake!","店長… 人を よろこばせるの 上手。 それは かんたんじゃ ないですよ！",'wink']],
 ["Not when the shelf is empty.","売り場が からっぽの 日は ちがう。",["Ha ha, true! An empty shelf is a piece of… nothing.","あはは、 たしかに！ からっぽの たなは… ピース・オブ・なにもなし。",'laugh']]],ph:["It's a piece of cake.","かんたんだよ。"]},
{id:'an_bored',k:'any',m:["Quiz! When you have nothing to do, do you say \"I'm boring\" or \"I'm bored\"?","クイズ！ ひまな とき、 「I'm boring」？ それとも 「I'm bored」？"],ex:'smile',p:'thumb',o:[
 ["\"I'm bored.\"","「I'm bored」。",["Correct! \"I'm boring\" means \"I'm not interesting.\" I said it once to my professor… Oops.","正解！ 「I'm boring」は 「わたしは つまらない 人間です」。 教授に 言っちゃった ことが… あちゃー。",'laugh']],
 ["\"I'm boring.\"","「I'm boring」。",["Nope! That means you're not interesting. And you are interesting, boss! The answer is \"I'm bored.\"","ブー！ それは 「つまらない 人」って 意味。 店長は おもしろい 人ですよ！ 答えは 「I'm bored」。",'oops']]],ph:["I'm bored. ／ It's boring.","たいくつ。 ／ それ つまらない。"]},
{id:'an_kid',k:'any',st:2,m:["Boss, what were you like as a kid? I bet you were serious and smart.","店長って 子どもの ころ どんな 子 でした？ まじめで かしこい 子 だった でしょ。"],ex:'smile',o:[
 ["I was very noisy.","すごく うるさかった。",["Really?! I can't imagine that! …Actually, maybe I can. Ha ha.","ほんと？！ 想像 できない！ …いや、 できるかも。 あはは。",'laugh']],
 ["I was shy.","はずかしがりや だった。",["Shy? And now you're the boss of a shop! You've come a long way.","はずかしがりや？ それが いまでは お店の 店長！ 成長 しましたね。",'smile']],
 ["What about you?","ミオは？",["I was a little explorer. I got lost at the beach three times in one summer.","小さな 探検家。 ひと夏で 3回 浜辺で 迷子に なりました。",'laugh']]],ph:["You've come a long way.","ずいぶん 成長したね。"]},
{id:'an_future',k:'any',st:3,m:["Sometimes I wonder… what will I be doing in ten years? Will I still be here?","ときどき 思うんです… 10年後、 わたし なに してるかな？ まだ ここに いるかな？"],ex:'smile',o:[
 ["I hope so.","いて ほしいな。",["…Thank you. Then I'll come back here, wherever I go.","…ありがとう。 じゃあ どこへ 行っても、 ここに 帰って きます。",'wink']],
 ["You'll be a great guide.","すごい ガイドに なってるよ。",["I hope so! And my first tour will start at this card shop.","そうだと いいな！ 最初の ツアーは この カードショップから スタート。",'laugh']]],ph:["in ten years","10年後に"]},
{id:'an_shy',k:'any',st:4,m:["Boss… um… nothing. I just wanted to talk to you. Is that weird?","店長… えっと… なんでも ない。 ただ 話したかった だけ。 へん ですか？"],ex:'oops',o:[
 ["Not weird at all.","ぜんぜん へんじゃ ない。",["…Good. Then I'll talk to you about nothing more often.","…よかった。 じゃあ これからも なんでもない 話、 しに 来ます。",'wink']],
 ["I wanted to talk too.","話したかった。",["R-really? …Ha ha, my face is hot. It must be the weather.","ほ、 ほんと？ …あはは、 顔が あつい。 きっと 天気の せい。",'laugh']]],ph:["Is that weird?","へん かな？"]},
{id:'an_lover',k:'any',st:5,m:["Hey… when it's just us at the counter, it feels like our own little world.","ねえ… カウンターに ふたりきりの とき、 ふたりだけの 小さな 世界 みたい。"],ex:'wink',p:'peace',o:[
 ["I like our little world.","この 小さな 世界、 好きだよ。",["Me too. …Oh! A customer might come. Back to work face! Ha ha.","わたしも。 …あっ！ お客さんが 来るかも。 仕事の 顔に もどして！ あはは。",'laugh']],
 ["Until a customer comes.","お客さんが 来るまでね。",["Then let's hope they come a little late today.","じゃあ きょうは お客さん、 ちょっと おそめに 来ますように。",'wink']]],ph:["our own little world","ふたりだけの 小さな 世界"]}
];

/* いま 起きている ことへの ひとりごと（カウンターの ふきだし）。 [英語, 日本語] */
const MIOT_MUT={
 sea:[["Look! {Ev}!","見て！ {evj}！"],["Is that {ev}? Wow!","あれ {evj}？ すごい！"]],
 sky:[["{Ev} in the sky!","空に {evj}！"],["Look up! {Ev}!","上 見て！ {evj}！"]],
 beach:[["Oh, {ev} on the beach!","浜辺に {evj}！"],["Hello, {ev}!","{evj}だ！ こんにちは！"]],
 night:[["{Ev}… so pretty.","{evj}… きれい。"],["Wow, {ev}…","わあ、 {evj}…"]],
 show:[["{Ev}! Best seats in town!","{evj}！ 特等席！"],["Boss, {ev}!","店長、 {evj}！"]],
 magic:[["Wait… {ev}?! Am I dreaming?","まって… {evj}？！ 夢？"],["Is that really {ev}?!","あれ ほんとに {evj}？！"]],
 weather:[["Oh, {ev}…","あ、 {evj}…"],["{Ev}… Where's my umbrella?","{evj}… かさ どこ？"]],
 mine:[["{d} meters today! Amazing, boss.","きょうは {d}メートル！ 店長 すごい。"],["Welcome back from the mine!","鉱山から おかえりなさい！"]],
 pack:[["New cards! I can smell them!","新しい カード！ においで わかる！"],["What was in the pack?","パック、 なにが 出たのかな？"]],
 sell:[["We sold \"{w}\"! Yay!","「{w}」 売れた！ やった！"]],
 buyin:[["A new card, \"{w}\"! Welcome!","新しい カード 「{w}」！ ようこそ！"],["Where shall we put \"{w}\"?","「{w}」、 どこに おこうかな？"]],
 meal:[["How was the {food}?","{foodj}、 おいしかった？"],["You smell like Marco's diner!","マルコさんの 食堂の におい！"]],
 snack:[["How was the {food}?","{foodj}、 おいしかった？"]],
 zbuy:[["What did you buy at Nora's?","ノラさんの 店で なに 買ったのかな？"]],
 gift:[["{To} must be happy now.","{toj}、 よろこんでる だろうな。"]],
 meteor:[["Did you catch a shooting star?!","流れ星 つかまえた？！"]],
 lesson:[["A lesson with Ms. Mina… I'm jealous!","ミナ先生の 授業… いいなあ！"]],
 tutor:[["How was Riku today?","きょうの リクくん、 どうだった？"]],
 bottle:[["A bottle letter? Romantic!","ボトルメール？ ロマンチック！"]],
 kaiwa:[["You were talking in English out there!","外で 英語で 話してた！"]],
 rain:[["Pitter-patter… rain.","ぽつぽつ… 雨だ。"],["Rainy days are cozy.","雨の 日って ほっこり。"],["It's raining cats and dogs!","どしゃぶり！"]],
 song:[["La-la-la♪ I love this song.","ラララ♪ この曲 好き。"],["This song makes me want to dance.","この曲、 おどりたく なる。"]],
 hpLow:[["Boss, you look tired. Take a break?","店長、 つかれてる？ 休けい する？"]],
 food:[["Something smells good… {a_food}?","いい におい… {foodj}？"]],
 tap:[["Boss, tap me if you want to talk!","店長、 話したい ときは タップしてね！"],["I'm free right now. Let's chat!","いま ひま です。 おしゃべり しましょ！"]]};

/* 店の 入口の あいさつ（さっきの ことに 反応）。 [英語, 日本語] */
const MIOT_HI={
 mine:[["Welcome back from the mine, boss! {d} meters? Wow!","鉱山から おかえりなさい！ {d}メートル？ すごい！"]],
 meal:[["Welcome back! Did you eat {food} at Marco's? I'm jealous!","おかえりなさい！ マルコさんの 店で {foodj}？ いいなあ！"]],
 snack:[["Hi, boss! How was the {food}?","店長！ {foodj}、 おいしかった？"]],
 zbuy:[["Hi, boss! You went shopping at Nora's, right?","店長！ ノラさんの お店で 買い物 しました？"]],
 gift:[["Hi, boss! I heard you gave {to} a present. So kind!","店長！ {toj}に プレゼント したって？ やさしい！"]],
 lesson:[["Hi, boss! Back from Ms. Mina's lesson? You look smarter already!","店長！ ミナ先生の 授業 帰り？ もう かしこい 顔！"]],
 tutor:[["Welcome back, Teacher! …I mean, boss. Ha ha. How was Riku?","おかえりなさい、 先生！ …じゃなくて 店長。 あはは。 リクくん どうでした？"]],
 meteor:[["Boss! Did you catch a shooting star? Lucky!","店長！ 流れ星 つかまえたって？ ラッキー！"]],
 kaiwa:[["Hi, boss! I saw you chatting on the beach. In English!","店長！ 浜辺で おしゃべり してましたね。 英語で！"]],
 bev:[["Boss, did you see {ev} outside?","店長、 外の {evj}、 見ました？"]]};

/* カウンターの 「💬 話しかける」の ひとこと（ミオが いそがしい とき） */
const MIOT_BUSY=[["Just a moment, boss! A customer is here.","ちょっと 待って、 店長！ お客さんが いるから。"],["After this customer, OK?","この お客さんの あとで ね？"]];
