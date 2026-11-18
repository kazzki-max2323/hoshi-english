/* カードショップの 店長・単語の 鉱山・看板娘ミオの データ。 しくみは game/shop.js（店）と game/mine.js（鉱山）、 ミオの 絵は game/mio.js */

/* ミオの あいさつ（店の 入口で）。 [英語, 日本語] */
const MIO_HI=[
 ["Welcome back, boss! The shop is all yours.","おかえりなさい、 店長！ お店は ばっちりです！"],
 ["Hi, boss! I cleaned the shelves. Shiny, right?","店長、 こんにちは！ たなを みがきました。 ピカピカでしょ？"],
 ["Boss! A customer asked about you today.","店長！ きょう 店長のこと 聞いてきた お客さんが いましたよ。"],
 ["Good to see you! Shall we open the shop?","会えて うれしいです！ お店、 あけましょうか？"],
 ["Answer questions, and boxes come in. Our delivery truck runs on right answers!","店長が 問題に 正解すると 荷物が とどくんです。 うちの トラックは 正解で 走ります！"],
 ["Treasure cards never come by truck, boss. Only the mine has them!","店長、 宝カードは トラックでは 来ないんです。 鉱山だけ！"],
 ["Shall we stock up? Pick five cards, and we'll do them all at once.","仕入れ、 しましょうか？ カードを 5まい えらんで まとめて できますよ。"],
 ["No daily limit on deliveries now. Study a lot, and the shelves fill up!","仕入れの 1日の 上限は なくなりました。 たくさん 勉強すれば たなが いっぱいに！"],
 ["I'm studying English between customers. Wish me luck!","お客さんの あいだに 英語の 勉強してます。 おうえん してください！"],
 ["Today's lucky word is \"sunny\"! Because I'm always sunny!","きょうの ラッキーワードは 「sunny」！ わたし いつも 晴れやかなので！"],
 ["The mine is calling you, boss! I'll take care of the shop.","店長、 鉱山が よんでますよ！ お店は まかせてください。"],
 ["Oops, I almost dropped the cards again… Just kidding! Maybe.","おっと、 また カード 落としそうに… じょうだんです！ たぶん。"]];
const MIO_NIGHT=[["Good evening, boss! The lights look so pretty tonight.","こんばんは、 店長！ 今夜は 灯りが きれいですね。"],["It's getting late… *yawn*… Oh! I'm awake, I'm awake!","夜も おそいですね… ふぁ… はっ！ 起きてます、 起きてます！"]];
const MIO_FIRST=[
 ["Nice to meet you, boss! I'm Mio. I'm a college student, and I'm working here part-time!","はじめまして、 店長！ ミオです。 大学生で、 ここで アルバイトします！"],
 ["From today, this card shop is yours. You're the new boss!","きょうから この カードショップは あなたの お店。 新しい 店長です！"],
 ["Stand at the counter, put cards on the shelf, and dig for new cards in the mine. When you're away, I'll watch the shop!","カウンターに 立って、 売り場に カードを ならべて、 鉱山で 新しい カードを ほる。 るすの あいだは わたしが お店を 見てます！"]];
/* 留守番の メモ（英語の 練習ちゅうの ミオが のこす） */
const MIO_MEMO=[
 ["A man bought two cards and said, \"Have a nice day!\" I said it back!","おじさんが カードを 2まい 買って 「Have a nice day!」って。 わたしも 言いかえしました！"],
 ["I swept the floor three times. It's very clean now.","ゆかを 3回 はきました。 とっても きれいです。"],
 ["A lady asked, \"Do you have any cute cards?\" I showed her the animal ones.","おねえさんに 「かわいい カード ある？」って 聞かれて、 動物の カードを 見せました。"],
 ["I fell asleep for a minute… only one minute! I promise!","ちょっとだけ ねちゃいました… 1分だけです！ ほんとに！"],
 ["I learned a new word today: \"customer.\" Like the people who come here!","きょうの 新しい 単語: 「customer」。 ここに 来る 人たちの ことです！"],
 ["A seagull came in. I said, \"Sorry, no birds allowed!\"","カモメが 入ってきました。 「ごめんね、 鳥は だめなの！」って 言いました。"],
 ["Someone said our shop smells like the sea. I think that's a good thing!","「この 店、 海の においがする」って。 いい 意味ですよね！"],
 ["It was a quiet day. I practiced \"How can I help you?\" twenty times.","しずかな 日でした。 「How can I help you?」を 20回 練習しました。"],
 ["A boy asked me, \"Are you the boss?\" I said, \"No, but I'm the smile!\"","男の子に 「店長さん？」って 聞かれて、 「ちがうけど、 笑顔担当です！」って。"],
 ["I tried to say \"thirteen\" and \"thirty\" correctly. It's harder than it looks!","「thirteen」と 「thirty」を 言い分ける 練習。 けっこう むずかしい！"],
 ["Please don't worry. I didn't break anything today! Well, almost nothing.","心配 しないでください。 きょうは なにも こわしてません！ ほとんど。"],
 ["I put a little shell next to the register. Do you like it?","レジの 横に 小さい 貝がらを かざりました。 どうですか？"]];
const MIO_MEMO_QUIET=[["Nobody came while you were away. I studied English the whole time!","るすの あいだ、 お客さんは 来ませんでした。 ずっと 英語の 勉強してました！"],["The shelf was empty, so nobody bought anything. Let's put some cards out!","売り場が からっぽで、 だれも 買えませんでした。 カードを ならべましょう！"]];

/* お客さん: 名前・ドット絵の 見た目（GUEST_LOOK の 番号）・好きな なかま */
const GUEST_LOOK=[
 {style:'cap',acc:'#3a5a8a',hair:'#bbb',beard:'#ddd',skin:'#f0c8a0',shirt:'#e8e0d0',coat:'#5a7a5a',low:'#4a4a5a',pants:1,shoe:'#3a2a1a'},
 {style:'hat',hair:'#e8c070',acc:'#ff6a6a',shades:1,skin:'#ffe0c8',shirt:'#7ad3c4',low:'#f6f0e0',shoe:'#ff8a7a'},
 {style:'short',hair:'#3a3030',skin:'#f6d0b0',shirt:'#f4c84a',low:'#3a4a6a',pants:1,shoe:'#eee',bag:'#a06a3a'},
 {style:'bun',hair:'#9a9a9a',glass:1,skin:'#f6d6c0',shirt:'#c79ad6',low:'#6a4a7a',shoe:'#4a3a3a'},
 {style:'short',hair:'#c8a050',skin:'#ffe0c8',shirt:'#ff8a8a',low:'#5a5a7a',pants:1,shoe:'#333'},
 {style:'long',hair:'#4a2a1a',skin:'#f0c8a0',shirt:'#8ac0ff',low:'#3a3a4a',shoe:'#a06a3a'},
 {style:'cap',acc:'#e85a4a',hair:'#3a3030',skin:'#d8a880',shirt:'#fff',low:'#3a5a8a',pants:1,shoe:'#e85a4a'},
 {style:'long',hair:'#e8d080',skin:'#ffe8d8',shirt:'#9ad89a',low:'#f0e0c0',shoe:'#c08a5a'}];
/* v = 声: s 'f' 女の人・'m' 男の人、 p 高さ、 r 速さ（game/shop.js の gspeak） */
const GUESTS=[
 {n:'りょうしの ゲンさん',l:0,v:{s:'m',p:.85,r:.9},a:['nat','food','ani']},{n:'旅行中の アンナ',l:1,v:{s:'f',p:1.1,r:1},a:['look','heart','nat']},{n:'学生の ケン',l:2,v:{s:'m',p:1.1,r:1.02},a:['learn','word','act']},
 {n:'あみものの ハルさん',l:3,v:{s:'f',p:.95,r:.88},a:['life','heart','food']},{n:'サーファーの ジョー',l:4,v:{s:'m',p:.95,r:1},a:['act','nat','look']},{n:'画家の ルナ',l:5,v:{s:'f',p:1.05,r:.95},a:['look','heart','ani']},
 {n:'カード集めの タク',l:6,v:{s:'m',p:1.05,r:1.05},a:['tr','learn','word']},{n:'パン屋の メイ',l:7,v:{s:'f',p:1.15,r:1},a:['food','life','heart']}];

/* カウンターの 英語の 会話（5回に 1回くらい）。 種類: want（ほしい カード）・deal（ねぎる）・rare（レアに おどろく）・rumor（うわさ）・only（1まいだけ）
   [お客の 英語, 日本語, [正しい, まちがい, まちがい], 説明]。 {w} = カードの 単語、 {p} = 値段 */
const SHOP_TALK={
 want:{es:[["Hi! Do you have the card \"{w}\"?","こんにちは！ 「{w}」の カード ある？",["Yes, we do. Here it is!","Yes, we are. Here it is!","Yes, I do it."],'「Do you have 〜?」には 「Yes, we do.」（お店なので we）'],
          ["I want \"{w}\"! How much is it?","「{w}」が ほしい！ いくら？",["It's {p} coins.","It's {p} coin is.","I'm {p} coins."],'値段は 「It\'s 〜.」']],
       jh:[["Excuse me. I'm looking for \"{w}\". Do you have one?","すみません。 「{w}」を さがしてるんですが、 ありますか？",["Sure. It's right here on the shelf.","Sure. It's right here at shelf on.","Sure. There it on the shelf."],'「on the shelf」で 「たなの 上に」'],
          ["Could you show me \"{w}\"?","「{w}」を 見せてもらえますか？",["Of course. Here you are.","Of course. Here are you.","Of course. You are here."],'物を わたすときは 「Here you are.」']],
       hs:[["I've been searching everywhere for \"{w}\". Any chance you have it?","「{w}」を あちこち さがしてたんです。 もしかして ありますか？",["You're in luck. We have one left.","You're in lucky. We have one leaving.","You're luck. One left we have."],'「You\'re in luck.」で 「ついてますね」'],
          ["Would you mind if I took a closer look at \"{w}\"?","「{w}」を 近くで 見ても いいですか？",["Not at all. Go ahead.","Yes, at all. Go ahead.","Not at all. Go head."],'「Would you mind 〜?」に 「いいですよ」は 「Not at all.」']]},
 deal:{es:[["Can I have it for {p} coins?","{p}コインに して くれない？",["OK! Just this once.","OK! Only once this.","OK! Once just."],'「just this once」＝ 「今回 だけ」'],
          ["It's a little expensive…","ちょっと 高いなあ…",["OK, I'll make it {p} coins.","OK, I make it {p} coin.","OK, I'm {p} coins."],'「I\'ll make it 〜.」で 「〜に します」']],
       jh:[["Is there any discount today?","きょうは 割引 ある？",["Yes! I can give you a small discount.","Yes! I can give you small discount it.","Yes! You give me discount."],'「give you a discount」で 「割引する」'],
          ["Would you take {p} coins for it?","{p}コインで どう？",["That sounds fair. Deal!","That sounds fairly. Deal!","That sound fair. Dealing!"],'「That sounds fair.」＝ 「いいですね（公平ですね）」']],
       hs:[["If I buy it today, could you knock a little off the price?","きょう 買うなら、 少し まけて もらえる？",["I can do {p} coins, but that's my best offer.","I can do {p} coins, but that's my better offer.","I do can {p} coins, best offer my."],'「knock off」＝ 値引きする。 「my best offer」＝ 精いっぱいの 値段'],
          ["I'm on a tight budget. Is there any room for negotiation?","予算が きびしくて。 交渉の よちは ある？",["A little. How about {p} coins?","A little. What about {p} coin it?","Few. How {p} coins about?"],'「How about 〜?」で 提案']]},
 rare:{es:[["Wow! Is this a rare card?","わあ！ これ レアカード？",["Yes, it is! It's very special.","Yes, it does! It's very special.","Yes, I am! Very special."],'「Is this 〜?」には 「Yes, it is.」'],
          ["So shiny! I love it!","ピカピカ！ これ 大すき！",["Thank you! I found it in the mine.","Thank you! I find it in the mine yesterday.","Thank you! I founded it in mine."],'find の 過去形は found']],
       jh:[["No way! Where did you get this card?","うそ！ この カード どこで 手に 入れたの？",["I found it deep in the mine.","I found it deeply in the mine.","I find it deep the mine in."],'「deep in 〜」＝ 「〜の 奥ふかくで」'],
          ["I've never seen a card like this before!","こんな カード、 見たこと ない！",["It's one of a kind.","It's one of kind a.","It's a one kind of."],'「one of a kind」＝ 「ほかに ない もの」']],
       hs:[["This must have been incredibly hard to find.","これ、 見つけるの すごく 大変だったでしょう。",["It took a while, but it was worth it.","It took a while, but it was worthy it.","It was taken a while, but worth."],'「worth it」＝ 「その かちが あった」'],
          ["I can't believe you're actually selling this.","これを 本当に 売ってるなんて 信じられない。",["Only for someone who'll treasure it.","Only for someone who treasure it will.","Only someone for treasure."],'「treasure」は 動詞で 「大切に する」']]},
 rumor:{es:[["Did you hear? There is a big shell in the mine!","知ってる？ 鉱山に 大きな 貝が あるんだって！",["Really? I want to see it!","Really? I want see it!","Really? I wanting to see."],'「want to 〜」＝ 「〜したい」'],
          ["Someone saw a white whale today!","きょう 白い クジラを 見た 人が いるよ！",["Wow! That's amazing!","Wow! That's amazed!","Wow! It amazing!"],'おどろく ことは amazing（人を おどろかせる）']],
       jh:[["People say the deeper you dig, the rarer the cards get.","深く ほるほど レアな カードが 出るって うわさだよ。",["Then I should dig deeper!","Then I should digging deeper!","Then I should to dig deeper!"],'should の あとは 動詞の 原形'],
          ["I heard Ms. Mina comes here sometimes. Is that true?","ミナ先生が ときどき 来るって 聞いたけど、 本当？",["Maybe! She loves words.","Maybe! She love words.","Maybe! She is love words."],'She の あとは loves（三人称単数の s）']],
       hs:[["Rumor has it there's a hidden lake at the bottom of the mine.","鉱山の 底に かくれた 湖が あるって うわさ。",["If that's true, I'd love to find it.","If that's true, I love to found it.","If true is that, I'd loving find."],'「I\'d love to 〜」＝ 「ぜひ 〜したい」'],
          ["They say this shop used to be a real beach house.","この 店、 むかしは 本物の 海の家 だったらしいよ。",["That explains the sea breeze!","That explains for the sea breeze!","That's explain the sea breeze!"],'explain は 「explain 〜」（for は いらない）']]},
 only:{es:[["Is this the only one?","これ、 1まい だけ？",["Yes. It's the only one on the beach!","Yes. It's only one the beach!","Yes. Only it's one."],'「the only one」＝ 「ただ 1つの もの」'],
          ["Just one? Then I'll take it!","1まい だけ？ じゃあ 買う！",["Thank you! Take good care of it.","Thank you! Take good care it.","Thank you! Good care take."],'「take care of 〜」＝ 「〜を 大切に する」']],
       jh:[["You won't find this card anywhere else, will you?","この カード、 ほかでは 見つからないよね？",["No, you won't. It's the only one.","No, you will. It's the only one.","No, you don't won't."],'「〜, will you?」（付加疑問）には 内容に あわせて No, you won\'t.'],
          ["If I don't buy it now, someone else will.","いま 買わないと だれかが 買っちゃうな。",["That's right. It's popular.","That's right. It's popularly.","That right. Popular it is."],'「It\'s popular.」＝ 「人気が ある」']],
       hs:[["A one-of-a-kind card… I'd regret it if I didn't buy it.","世界に 1まいの カード… 買わなかったら 後悔しそう。",["Then it's meant to be yours.","Then it's meant being yours.","Then it means to be you."],'「be meant to be 〜」＝ 「〜に なる 運命」'],
          ["How did you manage to get the only copy?","どうやって 1まいしかない ものを 手に 入れたの？",["I happened to dig it up in the mine.","I happened digging it up in the mine.","I happen to dig up it in mine."],'「happen to 〜」＝ 「たまたま 〜する」']]}};
/* お客の ひとこと（ボタンで 売るとき） */
const GUEST_SAY={
 enter:["Hello!","Hi there!","Good morning!","Wow, cards!","Nice shop!"],
 buy:["I'll take this one!","This one, please.","Perfect!","I love this card!"],
 leave:["Maybe next time.","Thank you, bye!","I'll come back later.","Just looking!"],
 none:["No cards today?","The shelf is empty…"]};

/* 鉱山: 層（深さ m）・ 問題の 形・ 見つかる カードの レベル */
const MINE_LAYERS=[
 {at:0, n:'砂の 層',  col:['#c8a070','#b08858','#8a6a44'],types:['mean','rev'],lv:['es']},
 {at:10,n:'土の 層',  col:['#9a6a44','#7e5636','#5e3e26'],types:['mean','rev','listen','scramble'],lv:['es','jh']},
 {at:25,n:'岩の 層',  col:['#7a7a86','#62626e','#4a4a56'],types:['rev','listen','scramble','fill','sent'],lv:['jh','hs']},
 {at:45,n:'水晶の 層',col:['#5a6aa8','#46548a','#343e6c'],types:['rev','scramble','fill','sent','listen'],lv:['hs','adv']},
 {at:70,n:'星の 層',  col:['#3a2a6a','#2a1e52','#1c1438'],types:['scramble','fill','sent','listen','rev'],lv:['adv']}];
/* 鉱山の イベント（たまに） */
const MINE_EVENT=[
 {ico:'💧',n:'地下水',t:'つめたい 水が わいていた。 ひとやすみ！ ❤+6',hp:6},
 {ico:'🍙',n:'ミオの おにぎり',t:'ポケットに ミオの おにぎりが 入ってた！ 「Good luck, boss!」 ❤+10',hp:10},
 {ico:'🦇',n:'コウモリ',t:'コウモリが とんでいった！ びっくりして 1m 落ちた',deep:1},
 {ico:'🕯️',n:'古い ランプ',t:'だれかの ランプが 落ちていた。 まわりが よく 見える。 しばらく 宝石が 出やすい',luck:6},
 {ico:'🗺️',n:'古い 地図',t:'「この 下に なにかが ある」と 書いてある… 3m 進んだ！',deep:3},
 {ico:'🐚',n:'化石の 貝',t:'大むかしの 貝の 化石。 コインに なりそう！',coin:30},
 {ico:'⛺',n:'休けい所',t:'小さな 休けい所。 ひとやすみして ❤が 10 もどった',hp:10}];
/* お宝（宝石）: コインに なる */
const MINE_GEM=[['🪨','きれいな 石',8],['🔶','こはく',15],['💎','ダイヤ',40],['🔮','水晶',25],['🌠','流れ星の 石',30],['🪙','古い 金貨',20]];

/* ミナ先生の セリフ */
Object.assign(MINA_LINES,{
 sh_first:[['wow','カードショップ「しおさい」、 きみが 店長に なったんだって！ アルバイトの ミオさんも いるよ'],['happy','浜辺の カードショップ、 新しい 店長さんは きみ！ 鉱山で カードを ほってきてね']],
 x_shMine:[['smile','単語の 鉱山、 きょうは 行った？ 5まいの カードを 左から じゅんばんに。 和訳から スペルまで 少しずつ むずかしく なるよ'],['proud','鉱山は 同じ 5まいを 形を かえて 何回も 練習するの。 しぜんに おぼえちゃうよ']],
 x_shDeep:[['wow','最高 {d}m まで ほったんだね！ 深いと 問題も むずかしく なるけど、 きみなら だいじょうぶ'],['happy','{d}m！ もっと 深い 層には レアな カードが ねむってるかも']],
 x_shShelf:[['think','売り場が からっぽだよ。 カードを ならべると、 るすの あいだに ミオさんが 売ってくれるよ'],['smile','売り場に カードを ならべて みて。 ダブった カードが おすすめ']],
 x_shCounter:[['smile','カウンターに 立つと、 お客さんが 来るよ。 ときどき 英語で 話しかけられるから 答えてみてね'],['happy','お客さんとの 英語の 会話、 お店ならではの 表現が 多いよ。 「Here you are.」とか']],
 x_shReport:[['happy','ミオさんが るすの あいだに {n}まい 売ってくれたって！ たよれるね'],['smile','ミオさんの 英語の メモ、 読んだ？ がんばって 書いてるよ']],
 x_shMio:[['smile','ミオさんは 大学生で、 英語を 勉強中なんだって。 いっしょに がんばる なかまだね'],['proud','ミオさん、 リクくんより 英語が 上手なんだよ。 でも ときどき おっちょこちょいなの']],
 sh_mineEnd:[['happy','おかえり！ {n}問 ほって、 {d}m まで 行ったんだね'],['smile','おかえり！ 見つけた カードは 「くわしく」で 例文も 見てね。 たくさん 出るから、 1まいずつ 声に 出すのが コツだよ'],['proud','鉱山 おつかれさま！ まちがえた 単語は、 その 周の さいごに もう一回 出るよ。 だから 苦手ほど たくさん 練習できるんだ']],
 sh_sold:[['happy','カードが 売れたね！ 店長さん、 いい 調子'],['smile','お客さん、 よろこんでたね']],
 sh_talkGood:[['proud','お客さんとの 英語、 ばっちり！ お店の 英語が 身に ついてきたね'],['happy','いまの 受け答え、 自然だったよ']],
 sh_talkMiss:[['smile','お店の 英語は 決まった 言いまわしが 多いよ。 声に 出して おぼえよう'],['think','まちがえた 文は 💡の 説明を もう いちど 見てね']]});
