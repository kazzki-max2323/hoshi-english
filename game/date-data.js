/* 💑 ミオとの デート の 会話（しくみは game/date.js）
   会話の 形は game/mio-chat.js と おなじ: nodes の s から はじまる。 m:[英語,日本語] ex:顔 p:ポーズ o:[[英語,日本語,つぎ,点]] end:'good'|'ok'|'fun' nt:[[英語,解説]]
   f:'👨‍🍳' = ミオ いがいの 人（マルコさん・ノラさん など）
   fr:[英語,日本語] = まだ こいびとじゃない とき（または ミオが「いちばんの なかま」の とき）の セリフ。 答えの 6番目 o[5] も おなじ
   ミオは 20さいの 大学生（大人）。 ときめきは 手を つなぐ・ほっぺ・ぼかし まで */

/* ================================================================ 🍽️ しおかぜ食堂で ふたりで ごはん */
const DATE_DINNER=[
{id:'dn_two',ico:'🥘',t:'ふたりで パエリア',nodes:{
 s:{f:'👨‍🍳',m:["Ah, boss! And Mio! A table for two? Right this way. Tonight's special is seafood paella.","おや、 店長！ それに ミオちゃん！ 2名さまですか？ こちらへ どうぞ。 今夜の おすすめは シーフードパエリアです。"],o:[
  ["A table for two, please.","2人です、 おねがいします。",'m1',1],["Do you have a table by the window?","窓ぎわの 席は ありますか？",'win',2],["Can we sit at the counter?","カウンターでも いいですか？",'ctr',1]]},
 win:{f:'👨‍🍳',m:["Of course! The best seat for the best couple. You can see the sunset from here.","もちろん！ いちばんの カップルに いちばんの 席を。 ここから 夕日が 見えますよ。"],fr:["Of course! The best seat for my best customers. You can see the sunset from here.","もちろん！ いちばんの お客さんに いちばんの 席を。 ここから 夕日が 見えますよ。"],
  nt:[["a table for two","「2人の 席」。 お店で 「A table for two, please.」と 言えば 2人で 来たと つたわる"]],o:[["Thank you, Marco.","ありがとう、 マルコさん。",'m1',1]]},
 ctr:{m:["The counter? Good idea! We can watch Marco cook. It's like a show!","カウンター？ いいですね！ マルコさんが 料理する ところが 見られる。 ショーみたい！"],ex:'laugh',o:[["Right. Let's order.","だね。 注文しよう。",'m1',1]]},
 m1:{m:["Hmm… everything looks so good. What are you going to have, boss?","うーん… どれも おいしそう。 店長は なに たのみます？"],o:[
  ["I'll have the paella. Want to share?","パエリアに する。 わけっこ する？",'share',2],["What do you recommend, Marco?","マルコさん、 おすすめは？",'rec',1],["I'll have whatever you're having.","きみと 同じので。",'same',1]]},
 share:{m:["Share? Yes, please! Then I'll get a salad, and we can share that too.","わけっこ？ ぜひ！ じゃあ わたしは サラダに して、 それも わけましょう。"],ex:'laugh',p:'peace',nt:[["Want to share?","「わけっこ する？」。 Do you want to share? の みじかい 言い方。 友だち どうしでも よく つかう"]],o:[["Perfect. Excuse me, we're ready to order.","かんぺき。 すみません、 注文 おねがいします。",'eat',1]]},
 rec:{f:'👨‍🍳',m:["The paella, without a doubt. It's big enough for two hungry people.","まちがいなく パエリアです。 おなかぺこぺこの 2人に ちょうどいい 大きさですよ。"],o:[["Then we'll have that, please.","じゃあ それを ください。",'eat',1]]},
 same:{m:["Copycat! Okay then — two bowls of clam chowder, please!","まねっこ！ じゃあ… クラムチャウダー 2つ ください！"],ex:'wink',o:[["Sounds good.","いいね。",'eat',1]]},
 eat:{m:["Mmm! This is so good. Boss, try this. Say 'ah'!","んー！ これ おいしい。 店長、 これ 食べてみて。 はい、 あーん！"],fr:["Mmm! This is so good. Boss, you have to try this!","んー！ これ おいしい。 店長、 これ ぜったい 食べてみて！"],ex:'laugh',o:[
  ["Ah… It's delicious!","あーん… おいしい！",'g1',2,null,["Wow, you're right. It's delicious!","ほんとだ、 おいしい！"]],["I can eat by myself!","自分で 食べられるよ！",'f1',0],["You have sauce on your cheek.","ほっぺに ソース ついてるよ。",'o1',1]]},
 g1:{m:["Ha ha, your face! … Thank you for tonight, boss. Eating together makes everything taste better.","あはは、 その顔！ … 今夜は ありがとう、 店長。 いっしょに 食べると なんでも もっと おいしいですね。"],ex:'laugh',p:'peace',end:'good'},
 f1:{m:["Aww, boo. Fine, then I'll eat it! … Mmm. Mine now!","えー、 ぶー。 じゃあ わたしが 食べちゃう！ … ん〜。 もう わたしの！"],ex:'wink',end:'fun'},
 o1:{m:["What?! Where? Here? … How long was it there?! Don't laugh!","えっ！？ どこ？ ここ？ … いつから ついてたの！？ わらわないで！"],ex:'oops',end:'ok'}}},

{id:'dn_rain',ico:'🌧️',t:'雨の 日の シチュー',nodes:{
 s:{m:["Whew! We made it! It started raining so suddenly. My hair is all wet!","ふう！ まにあった！ 急に ふってきましたね。 髪の毛 びしょびしょ！"],ex:'oops',o:[
  ["Here, use my handkerchief.","はい、 ぼくの ハンカチ つかって。",'hk',2],["Ha ha, you look like a wet cat.","あはは、 ぬれた ねこ みたい。",'cat',1],["Let's get something warm.","あったかい もの 食べよう。",'menu',1]]},
 hk:{m:["Thank you… You always carry a handkerchief? That's so gentlemanly.","ありがとう… いつも ハンカチ 持ってるんですか？ 紳士ですね。"],ex:'smile',nt:[["Here, use my …","「はい、 ぼくの 〜 つかって」。 Here は 物を わたす ときの 「はい、 どうぞ」"]],o:[["Only for you.","きみの ためだけ だよ。",'menu',2,null,["Only on rainy days.","雨の 日 だけね。"]],["My mom told me to.","母に 言われてて。",'menu',1]]},
 cat:{m:["Meow! … Hey! A wet cat is still cute, right? Right?","にゃー！ … ちょっと！ ぬれた ねこでも かわいいですよね？ ね？"],ex:'wink',o:[["Yes, very cute.","うん、 すごく かわいい。",'menu',2],["Hmm… maybe.","うーん… たぶん。",'menu',0]]},
 menu:{f:'👨‍🍳',m:["Terrible weather! Let me warm you two up. How about my beef stew? It's been cooking since this morning.","ひどい 天気ですね！ 2人を あたためましょう。 ビーフシチューは どうです？ 朝から ずっと 煮込んでるんですよ。"],o:[
  ["Two beef stews, please.","ビーフシチュー 2つ ください。",'tea',1],["Could we get some hot tea first?","先に あたたかい お茶を もらえますか？",'tea',2]]},
 tea:{m:["Ahh… warm. You know, I don't mind the rain anymore. It's kind of cozy, like this.","はあ… あったかい。 ねえ、 もう 雨でも いいかも。 こうしてると なんだか ほっこり します。"],ex:'smile',nt:[["cozy","「ほっこり・いごこちが いい」。 あたたかくて 安心する 感じ。 a cozy room, a cozy café"]],o:[
  ["Me too. Let's stay until it stops.","ぼくも。 やむまで ここに いよう。",'g1',2],["Should I buy an umbrella for you?","かさ 買ってこようか？",'ok1',1],["I hope it rains every day, then.","じゃあ 毎日 雨だと いいな。",'fun1',1]]},
 g1:{m:["Yes, let's. … Actually, I hope it rains a little longer. Ha ha.","うん、 そうしましょう。 … ほんとは もう少し ふってて ほしいかも。 あはは。"],ex:'laugh',end:'good'},
 ok1:{m:["That's sweet, but then we'd have to leave. … Let's just finish our stew slowly.","やさしいけど、 そしたら 帰らなきゃ いけなくなる。 … シチュー、 ゆっくり 食べましょ。"],ex:'smile',end:'ok'},
 fun1:{m:["Every day?! Then the shop will have no customers! … But I'd come to work anyway.","毎日！？ お店に お客さん 来なくなっちゃう！ … でも わたしは 出勤しますけど。"],ex:'laugh',end:'fun'}}},

{id:'dn_spicy',ico:'🌶️',t:'げきからチャレンジ',nodes:{
 s:{f:'👨‍🍳',m:["Welcome back! Today I have a special challenge: my super-spicy curry. If you finish it, dessert is free!","いらっしゃい！ きょうは とくべつ チャレンジ。 げきからカレーです。 完食したら デザートが ただ！"],o:[
  ["Let's do it, Mio!","やろう、 ミオ！",'go',1],["How spicy is it?","どれくらい からいの？",'how',1],["No thanks. Mild, please.","えんりょします。 あまくちで。",'mild',1]]},
 how:{f:'👨‍🍳',m:["On a scale of one to ten? Eleven. My own mother cried.","1から10で いうと？ 11です。 わたしの 母は 泣きました。"],nt:[["On a scale of one to ten","「1から10で いうと」。 どれくらいかを 数字で 言う ときの 決まり文句"]],o:[["Okay… we'll try it.","わかった… ためしてみる。",'go',1],["Mild, please.","あまくちで おねがいします。",'mild',1]]},
 mild:{m:["Boo! Boss, where's your fighting spirit? … Fine, I'll take the challenge alone!","ぶー！ 店長、 根性は どこ？ … いいです、 わたし ひとりで ちょうせん します！"],ex:'wink',p:'guts',o:[["Good luck!","がんばって！",'hot',1]]},
 go:{m:["Yes! Team boss and Mio! … Okay, first bite. Here we go… One, two, three!","よし！ 店長と ミオの チーム！ … じゃあ ひとくちめ。 いきますよ… せーの！"],ex:'laugh',p:'guts',o:[["…!","…！",'hot',1]]},
 hot:{m:["Hot! Hot, hot, hot! My mouth is on fire! Water! I need water!","からい！ からい からい！ 口が 火事！ 水！ 水 ください！"],ex:'oops',o:[
  ["Here, drink my milk. Milk is better than water.","ぼくの ミルク のんで。 水より ミルクが きくよ。",'g1',2],["You're so red! Ha ha!","まっか！ あはは！",'fun1',1],["Hang in there! You can do it!","がんばれ！ きみなら できる！",'ok1',1]]},
 g1:{m:["Milk… ahh, that's better. How did you know that? … You saved my life. My hero!","ミルク… はあ、 らくに なった。 なんで 知ってたの？ … 命の 恩人。 わたしの ヒーロー！"],ex:'laugh',p:'thumb',nt:[["You saved my life.","「命の 恩人」。 ちょっと 助けて もらった ときにも 大げさに 言って 感謝する"]],end:'good'},
 fun1:{m:["Don't laugh! You're red too! … We look like two tomatoes. Ha ha!","わらわないで！ 店長だって まっか！ … トマトが 2つ ならんでる みたい。 あはは！"],ex:'laugh',end:'fun'},
 ok1:{m:["I… did it! I finished it! Marco, where's my free dessert?!","や… やった！ 完食！ マルコさん、 ただの デザートは？！"],ex:'laugh',p:'peace',end:'ok'}}},

{id:'dn_anniv',ico:'🎂',t:'ないしょの ケーキ',if:r=>r,nodes:{
 s:{m:["Boss, why did you bring me here tonight? You look a little nervous.","店長、 なんで 今夜 ここに？ ちょっと そわそわ してますね。"],ex:'smile',o:[
  ["Close your eyes for a second.","ちょっと 目を とじて。",'eyes',2],["Nervous? Me? No way.","そわそわ？ ぼくが？ まさか。",'no',1]]},
 no:{m:["Hmm, suspicious… Your eyes keep looking at the kitchen.","ふーん、 あやしい… さっきから ずっと キッチンの ほう 見てる。"],ex:'wink',o:[["Okay, close your eyes.","わかった、 目を とじて。",'eyes',1]]},
 eyes:{f:'👨‍🍳',m:["♪ Happy anniversary to you… ♪ Here you go — a strawberry cake, made with love!","♪ ハッピー アニバーサリー… ♪ どうぞ。 愛を こめた いちごの ケーキです！"],nt:[["Happy anniversary!","「記念日 おめでとう」。 つきあった 日・結婚した 日などに。 our first anniversary（はじめての 記念日）"]],o:[["Surprise!","サプライズ！",'cake',1]]},
 cake:{m:["Wh… What? You remembered? I thought I was the only one who counted the days…","え… うそ。 おぼえてたの？ 日にち かぞえてるの、 わたしだけだと 思ってた…"],ex:'oops',o:[
  ["Of course I remembered.","もちろん おぼえてるよ。",'g1',2],["Marco helped me a lot.","マルコさんに すごく 手伝って もらった。",'ok1',1],["I wrote it on my hand.","手に 書いておいた。",'fun1',1]]},
 g1:{m:["…I'm not crying. It's the candles. They're too bright. … Thank you. I love it. I love… you know.","…泣いてません。 ろうそくが まぶしい だけ。 … ありがとう。 すごく うれしい。 だいすき… わかるでしょ。"],ex:'laugh',p:'peace',end:'good'},
 ok1:{m:["Ha ha, Marco, thank you! But the idea was yours, right? That's what matters.","あはは、 マルコさん ありがとう！ でも 考えたのは 店長でしょ？ それが いちばん うれしい。"],ex:'smile',end:'ok'},
 fun1:{m:["On your hand?! Let me see… It says 'cake' and 'milk'. Is this a shopping list?!","手に！？ 見せて… 「ケーキ」と 「ぎゅうにゅう」って 書いてある。 買い物メモ！？"],ex:'laugh',end:'fun'}}},

{id:'dn_lang',ico:'🌍',t:'世界の 料理 しりとり',nodes:{
 s:{m:["I have an idea! Let's play a game. We order food from different countries, and we have to say 'thank you' in that language!","いい こと 考えた！ ゲーム しましょう。 ちがう 国の 料理を たのんで、 その 国の ことばで 「ありがとう」を 言うんです！"],ex:'laugh',p:'thumb',o:[["Sounds fun! You first.","おもしろそう！ ミオから。",'it',1],["What if I don't know the word?","ことばを 知らなかったら？",'rule',1]]},
 rule:{m:["Then you have to do my homework for a week! Just kidding. Then you say it in English.","そしたら 1週間 わたしの 宿題 やって もらいます！ うそうそ。 英語で 言えば オッケー。"],ex:'wink',o:[["Okay, deal.","わかった、 それで。",'it',1]]},
 it:{f:'👨‍🍳',m:["Here's your pizza margherita, straight from Naples!","ナポリから ちょくそう、 ピッツァ マルゲリータです！"],o:[["Grazie!","グラッツェ！",'fr',2],["Merci!","メルシー！",'wrong',0],["Thank you!","サンキュー！",'fr',1]]},
 wrong:{m:["Merci is French! Pizza is Italian, so it's 'grazie'. Ha ha, one point for me!","メルシーは フランス語！ ピザは イタリアだから 「グラッツェ」。 あはは、 わたしに 1点！"],ex:'laugh',o:[["Next time I'll win.","つぎは かつ。",'fr',1]]},
 fr:{f:'👨‍🍳',m:["And for dessert, a French crêpe with chocolate.","デザートに、 フランスの チョコレートクレープです。"],o:[["Merci beaucoup!","メルシー ボクー！",'g1',2],["Gracias!","グラシアス！",'fun1',0],["Thanks a lot!","ありがとう！",'ok1',1]]},
 g1:{m:["Merci beaucoup?! Wow, boss, you sound like a real Parisian! … Next time, let's really go to Paris together. Promise?","メルシー ボクー！？ 店長、 本物の パリの 人 みたい！ … いつか ほんとに いっしょに パリに 行きましょ。 約束？"],fr:["Merci beaucoup?! Wow, boss, you sound like a real Parisian! I have to study harder!","メルシー ボクー！？ 店長、 本物の パリの 人 みたい！ わたしも もっと 勉強しなきゃ！"],ex:'laugh',p:'peace',nt:[["Promise?","「約束ね？」。 Do you promise? を みじかく。 返事は I promise.（約束する）"]],end:'good'},
 fun1:{m:["Gracias is Spanish! Ha ha, now you're traveling around the whole world.","グラシアスは スペイン語！ あはは、 世界一周 しちゃってる。"],ex:'laugh',end:'fun'},
 ok1:{m:["English is okay too! The most important thing is to say it with a smile. Like this — thank you, Marco!","英語でも オッケー！ いちばん 大事なのは 笑顔で 言う こと。 こんなふうに… ありがとう、 マルコさん！"],ex:'smile',end:'ok'}}}
];

/* ================================================================ 🎁 雑貨屋で おそろいの 品（ノラさんの お店。 1つ ずつ 1回だけ 買える） */
const DATE_PAIRS=[
 {id:'pr_mug',ico:'☕',n:'おそろいの マグカップ',en:'matching mugs',p:400,nodes:{
  s:{f:'👩‍🦳',m:["Matching mugs? How lovely. One has a sun and the other has a moon. Which one is yours?","おそろいの マグ？ すてきね。 ひとつは 太陽、 もうひとつは 月の 絵よ。 どっちが あなたの？"],o:[["I'll take the moon.","ぼくは 月に する。",'a',1],["Mio, you choose first.","ミオが 先に えらんで。",'b',2]]},
  a:{m:["Then I'm the sun! The sun and the moon… we take turns watching the sky. Ha ha, that sounds like a song.","じゃあ わたしは 太陽！ 太陽と 月… かわりばんこに 空を 見てる。 あはは、 歌みたい。"],ex:'laugh',end:'good'},
  b:{m:["Really? Then… the sun! Because you're always so bright, boss. Wait, then you should be the sun. Ugh, I'm confused!","いいの？ じゃあ… 太陽！ 店長は いつも あかるいから。 あれ、 じゃあ 店長が 太陽？ もう、 わかんなくなった！"],ex:'oops',nt:[["You choose first.","「先に えらんで」。 ゆずる ときは After you.（おさきに どうぞ）も つかえる"]],end:'good'}}},
 {id:'pr_key',ico:'🔑',n:'おそろいの キーホルダー',en:'matching key chains',p:500,nodes:{
  s:{m:["Look, boss! Shell key chains. If you put the two halves together, they make one whole shell!","見て 店長！ 貝がらの キーホルダー。 2つを くっつけると、 1つの 貝に なるんです！"],ex:'laugh',o:[["That's cute. Let's get them.","かわいいね。 買おう。",'a',2],["Isn't that a bit childish?","ちょっと 子どもっぽくない？",'b',0]]},
  a:{f:'👩‍🦳',m:["Good choice. They say if you lose one, the other one will help you find it. … That's just my story, though.","いい ものを えらんだわね。 かたほうを なくしても、 もうかたほうが 見つけて くれるって 言われてるの。 …わたしが 作った 話 だけどね。"],nt:[["They say …","「〜と 言われている」。 うわさ・言い伝えを 話す ときの 言い方"]],end:'good'},
  b:{m:["Childish?! … Okay, maybe. But I'm getting them anyway! Here, half for you. No returns!","子どもっぽい！？ … まあ、 そうかも。 でも 買います！ はい、 半分は 店長の。 返品 なし！"],ex:'wink',end:'fun'}}},
 {id:'pr_shell',ico:'🐚',n:'貝がらの ブレスレット',en:'shell bracelets',p:800,nodes:{
  s:{f:'👩‍🦳',m:["These bracelets are made from shells from this very beach. Pip helped me pick them. Didn't you, Pip?","この ブレスレットは この浜辺の 貝がらで 作ったの。 ピップが えらぶのを 手伝って くれたのよ。 ね、 ピップ？"],o:[["Let's try them on.","つけて みよう。",'a',1],["Can you put it on me, Mio?","ミオ、 つけて くれる？",'b',2]]},
  a:{m:["Oh, they fit perfectly! When I look at it at work, I'll think of the beach… and you.","わあ、 ぴったり！ お店で これを 見たら、 浜辺を 思いだす… それと 店長も。"],fr:["Oh, they fit perfectly! When I look at it at work, I'll think of the beach. And our team!","わあ、 ぴったり！ お店で これを 見たら、 浜辺を 思いだす。 それと わたしたちの チーム！"],ex:'smile',end:'good'},
  b:{m:["Okay, give me your wrist. Hold still… There! Now you do mine. … Your hands are warm.","はい、 手首 かして。 うごかないで… できた！ つぎは わたしの。 … 店長の 手、 あったかい。"],fr:["Okay, give me your wrist. Hold still… There! Now you do mine. Ha ha, you're bad at this!","はい、 手首 かして。 うごかないで… できた！ つぎは わたしの。 あはは、 へたっぴ！"],ex:'oops',nt:[["Hold still.","「じっと して・うごかないで」。 写真を とる ときや 何かを つけて あげる ときに"]],end:'good'}}},
 {id:'pr_tee',ico:'👕',n:'おそろいの Tシャツ',en:'matching T-shirts',p:900,nodes:{
  s:{m:["Boss, look at these T-shirts! One says 'I'm with the boss' and the other says 'I'm the boss'. Ha ha ha!","店長、 この Tシャツ 見て！ ひとつは 「店長と いっしょ」、 もうひとつは 「わたしが 店長」。 あはは！"],ex:'laugh',o:[["Let's wear them to work tomorrow!","あした お店で 着よう！",'a',2],["Which one will you wear?","どっちを 着るの？",'b',1]]},
  a:{m:["To work?! The customers will laugh! … Okay, let's do it. Our shop, our uniform!","お店で！？ お客さんに わらわれちゃう！ … よし、 やりましょう。 わたしたちの お店の ユニフォーム！"],ex:'laugh',p:'thumb',end:'good'},
  b:{m:["'I'm the boss', of course! Just for one day, let me be the boss. You can sweep the floor!","「わたしが 店長」に きまってます！ 1日だけ 店長 させて。 店長は ゆかそうじ ね！"],ex:'wink',end:'fun'}}},
 {id:'pr_star',ico:'⭐',n:'星の ストラップ',en:'star phone straps',p:600,nodes:{
  s:{f:'👩‍🦳',m:["These star straps glow in the dark. Two stars that shine at night… Perfect for two people who stay up late, hmm?","この 星の ストラップは くらやみで 光るの。 夜に かがやく 2つの 星… よふかしの 2人に ぴったりね？"],o:[["We do stay up late…","たしかに よふかし してる…",'a',1],["Mio, do you like stars?","ミオ、 星 好き？",'b',2]]},
  a:{m:["Because you keep sending me messages at midnight! … I don't mind, though.","店長が 夜中に メッセージ くれるから でしょ！ … べつに いやじゃ ないけど。"],ex:'wink',end:'fun'},
  b:{m:["I love them! When I was little, I wanted to be an astronaut. Now… I just want to look at them with someone special.","だいすき！ 小さい ころ うちゅうひこうしに なりたかったの。 いまは… 大事な 人と いっしょに 見られれば いいかな。"],fr:["I love them! When I was little, I wanted to be an astronaut. Now I'm happy just looking at them.","だいすき！ 小さい ころ うちゅうひこうしに なりたかったの。 いまは 見てる だけで しあわせ。"],ex:'smile',nt:[["someone special","「とくべつな 人・大事な 人」。 恋人を それとなく 言う ときにも"]],end:'good'}}},
 {id:'pr_diary',ico:'📓',n:'交換日記の ノート',en:'a shared diary',p:700,nodes:{
  s:{m:["A diary for two! We take turns writing in it. In English, of course!","2人で 書く 日記！ かわりばんこに 書くんです。 もちろん 英語で！"],ex:'laugh',p:'peace',o:[["Great idea. I'll write first.","いいね。 ぼくが 先に 書く。",'a',2],["Will you correct my mistakes?","まちがいを なおして くれる？",'b',1]]},
  a:{m:["Okay! What will you write? … No, don't tell me! I want to read it tomorrow. I'll be waiting!","はい！ なにを 書くの？ … あ、 言わないで！ あした 読みたい。 楽しみに してます！"],ex:'smile',nt:[["take turns","「かわりばんこに する」。 Let's take turns.（じゅんばんこ ね）"]],end:'good'},
  b:{m:["Only with a red pen! And I'll draw a little heart next to the good sentences. Ha ha.","赤ペンで だけね！ いい 文には 小さい ハートも 書いて あげます。 あはは。"],fr:["Only with a red pen! And I'll draw a little star next to the good sentences. Ha ha.","赤ペンで だけね！ いい 文には 小さい 星も 書いて あげます。 あはは。"],ex:'wink',end:'good'}}},
 {id:'pr_scarf',ico:'🧣',n:'おそろいの マフラー',en:'matching scarves',p:1200,nodes:{
  s:{f:'👩‍🦳',m:["Hand-knitted scarves. One red, one blue. It gets cold by the sea at night, you know.","手あみの マフラーよ。 赤と 青。 海の 夜は ひえるからね。"],o:[["Which color do you want, Mio?","ミオは どっちの 色が いい？",'a',1],["This one is really long.","これ すごく 長いね。",'b',2]]},
  a:{m:["Red! … And you're blue. Red and blue together make purple. That's our color now!","赤！ … 店長は 青。 赤と 青を まぜると むらさき。 それが 2人の 色ですね！"],ex:'laugh',end:'good'},
  b:{m:["So long… it's long enough for two people. … W-wait, I didn't mean we should share it! Or… did I?","長い… 2人で まける くらい。 … ち、 ちがう、 いっしょに まこうって 意味じゃ… それとも… そういう 意味かも？"],fr:["So long! It's long enough for three people. Let's wrap Pip in it too! Ha ha!","長い！ 3人で まける くらい。 ピップも まいちゃおう！ あはは！"],ex:'oops',nt:[["long enough for …","「〜に じゅうぶんな 長さ」。 形容詞 + enough for で 「〜に じゅうぶん」"]],end:'good'}}},
 {id:'pr_watch',ico:'⌚',n:'ペアの うで時計',en:'pair watches',p:2500,nodes:{
  s:{f:'👩‍🦳',m:["Ah, my special watches. These two were made by the same old clockmaker. They keep exactly the same time.","あら、 とっておきの 時計ね。 この 2つは 同じ 時計職人が 作ったの。 まったく 同じ 時を きざむのよ。"],o:[["We'll take them.","これに します。",'a',2],["They're expensive…","高い…",'b',1]]},
  a:{m:["Boss… these are too nice! … Thank you. From now on, every time I check the time, I'll know you're living the same second as me.","店長… こんな いい物！ … ありがとう。 これから 時計を 見る たびに、 店長と 同じ 1秒を すごしてるって 思える。"],fr:["Boss… these are too nice! … Thank you. Now we'll never be late for opening time. Ha ha.","店長… こんな いい物！ … ありがとう。 これで 開店時間に おくれない ですね。 あはは。"],ex:'smile',p:'peace',nt:[["keep time","「時を きざむ」。 This watch keeps good time.（この 時計は 正確だ）"]],end:'good'},
  b:{m:["Ha ha, you said that out loud! … But you're buying them anyway? You're the best, boss.","あはは、 声に 出てる！ … でも 買って くれるの？ 店長、 さいこう。"],ex:'laugh',end:'fun'}}}
];

/* ================================================================ 🚃 遠出（その日の 大きい デート。 お金を はらうと 何回でも 行ける。 エンドで 思い出が ふえる）
   st: 行ける ミオとの 段階（3=たよれる なかま、 5=こいびと）/ night: 夜の 浜辺の ときに さそうと 気分が でる（ことばだけ） */
const DATE_TRIPS=[
{id:'tr_aqua',ico:'🐠',t:'水族館',en:'the aquarium',p:1200,st:3,d:'大きな 水そう・クラゲの へや・イルカショー',nodes:{
 s:{m:["We're here! The aquarium! Boss, look at that huge tank. It's like we're at the bottom of the sea!","着いた！ 水族館！ 店長、 あの 大きな 水そう 見て。 海の そこに いる みたい！"],ex:'laugh',p:'wave',o:[
  ["Wow, there's a whale shark!","わあ、 ジンベエザメが いる！",'shark',1],["Let's go to the jellyfish room first.","先に クラゲの へやに 行こう。",'jelly',2],["Where's the gift shop?","おみやげ屋さんは どこ？",'gift',0]]},
 shark:{m:["It's so big… but it only eats tiny plankton. It's a gentle giant. Kind of like you, boss.","すごく 大きい… でも 小さな プランクトンしか 食べないの。 やさしい 巨人。 ちょっと 店長に にてる。"],ex:'smile',nt:[["a gentle giant","「やさしい 巨人」。 体は 大きいけど おだやかな 人や 動物の こと"]],o:[["Are you calling me big?","ぼくが 大きいって こと？",'jelly',0],["Gentle? Thank you.","やさしい？ ありがとう。",'jelly',2]]},
 gift:{m:["Already?! We just got here! … Okay, okay. But first, the jellyfish. They're my favorite!","もう！？ 来た ばっかり！ … はいはい。 でも 先に クラゲ。 いちばん 好きなの！"],ex:'oops',o:[["Okay, jellyfish first.","わかった、 クラゲが 先ね。",'jelly',1]]},
 jelly:{m:["It's so dark in here… The jellyfish are glowing. Blue, pink, purple… It's like a dream.","ここ くらいね… クラゲが 光ってる。 青・ピンク・むらさき… 夢みたい。"],ex:'smile',o:[
  ["It's beautiful.","きれいだね。",'dark',1],["You're beautiful too.","きみも きれいだよ。",'dark',2,null,["They look like little lamps.","小さな ランプ みたい。"]],["Jellyfish have no brain, you know.","クラゲって 脳が ないんだって。",'brain',1]]},
 brain:{m:["No brain?! But they look so smart… Maybe they don't need one. They just float and look pretty. Lucky!","脳が ない！？ かしこそうなのに… いらないのかも。 ただ ういて きれいで いれば いい。 いいなあ！"],ex:'laugh',o:[["Let's go see the dolphin show.","イルカショー 見に 行こう。",'show',1]]},
 dark:{m:["…Boss. It's dark, so… can I hold your hand? I don't want to get lost.","…店長。 くらいから… 手、 つないでも いい？ はぐれたら いやだから。"],fr:["Boss, it's so dark! Don't get lost, okay? I'm not going to look for you! Ha ha.","店長、 くらい！ はぐれないでね？ さがしに 行きませんから！ あはは。"],ex:'oops',nt:[["Can I hold your hand?","「手を つないでも いい？」。 hold hands（手を つなぐ）"]],o:[
  ["Sure.","いいよ。",'show',2,null,["I'll stay close.","そばに いるよ。"]],["You won't get lost. It's one room.","へや 1つ だから はぐれないよ。",'show',0]]},
 show:{m:["The dolphin show is starting! Let's sit in the front row! … Wait, it says 'splash zone'. What does that mean?","イルカショー はじまる！ いちばん 前に すわろう！ … まって、 「スプラッシュゾーン」って 書いてある。 どういう いみ？"],ex:'laugh',o:[
  ["It means we'll get wet!","ぬれるって こと！",'wet',1],["Let's sit in the back.","うしろに すわろう。",'back',1],["I'll protect you with my jacket.","ぼくの 上着で まもるよ。",'jacket',2]]},
 wet:{m:["Wet?! Too late — here comes the dolphin! … SPLASH! … Ha ha ha! We're soaked! Best day ever!","ぬれる！？ もう おそい、 イルカが 来た！ … ザバーン！ … あはは！ びしょびしょ！ さいこうの 日！"],ex:'laugh',p:'peace',end:'fun'},
 back:{m:["Good idea. From here we can see everything. … Look, the dolphins are jumping together. Like they're dancing.","いい 考え。 ここなら ぜんぶ 見える。 … ほら、 イルカが いっしょに ジャンプ してる。 おどってる みたい。"],ex:'smile',end:'ok'},
 jacket:{m:["You'll get wet instead of me! … Boss, you're soaked. Ha ha. Thank you. … Here, let me dry your hair.","店長が かわりに ぬれちゃう！ … 店長、 びしょびしょ。 あはは。 ありがとう。 … ほら、 髪 ふいて あげる。"],fr:["You'll get wet instead of me! … Boss, you're soaked. Ha ha. Thank you. Here, take my towel!","店長が かわりに ぬれちゃう！ … 店長、 びしょびしょ。 あはは。 ありがとう。 はい、 わたしの タオル！"],ex:'laugh',end:'good'}}},

{id:'tr_market',ico:'🐟',t:'港町の 朝市',en:'the morning market',p:800,st:3,d:'朝はやくの 魚市場・やたい・ねぎって 買い物',nodes:{
 s:{m:["Good morning, boss! I'm so sleepy… but the market is only open until nine. Smell that? Grilled squid!","おはよう、 店長！ ねむい… でも 市場は 9時まで なんです。 におう？ イカ焼き！"],ex:'sleepy',o:[
  ["Let's eat breakfast here.","ここで 朝ごはん 食べよう。",'food',1],["You can sleep on my shoulder on the train home.","帰りの 電車で ぼくの かたで ねていいよ。",'food',2,null,["Let's get coffee first.","先に コーヒー 買おう。"]],["Look, a giant tuna!","見て、 大きな マグロ！",'tuna',1]]},
 tuna:{f:'🧔',m:["Fresh from the sea this morning! Want to try some tuna? It's on the house!","けさ とれたての マグロだよ！ 食べてみる？ サービスだ！"],nt:[["It's on the house.","「お店の おごりです・サービスです」。 ただで くれる とき"]],o:[["Thank you! Mio, try it.","ありがとう！ ミオも 食べて。",'food',1]]},
 food:{m:["Mmm! Okay, I'm awake now. … Boss, I want to buy some fish for Marco. Can you help me bargain? My English isn't good enough.","んー！ よし、 目が さめた。 … 店長、 マルコさんに お魚 買いたいの。 ねぎるの 手伝って？ わたしの 英語じゃ まだ…"],ex:'smile',o:[
  ["Sure. Leave it to me.","いいよ。 まかせて。",'deal',1],["Your English is great. You do it!","ミオの 英語 じょうずだよ。 やって みて！",'mio',2]]},
 mio:{m:["Really? Okay… Excuse me! How much are these sardines? … Four dollars? Could you make it three?","ほんと？ よし… すみません！ この イワシ いくら ですか？ … 4ドル？ 3ドルに なりませんか？"],ex:'guts',p:'guts',nt:[["Could you make it …?","「〜に して もらえませんか？」。 ねぎる ときの ていねいな 言い方"]],o:[["Nice!","いいね！",'won',1]]},
 won:{f:'🧔',m:["Ha ha, what a smart girl! Okay, three dollars. And here's an extra one for your smile!","ははは、 しっかり してるね！ よし、 3ドル。 その 笑顔に 1ぴき おまけだ！"],o:[["You did it, Mio!","やったね、 ミオ！",'g1',2],["I should have done it.","ぼくが やれば よかった。",'f1',0]]},
 deal:{m:["Okay, boss. Show me how a pro does it!","はい、 店長。 プロの ねぎり、 見せて ください！"],ex:'wink',o:[
  ["How much for all of these?","ぜんぶで いくら？",'pro',2],["Can I have it for free?","ただで くれない？",'free',0]]},
 pro:{f:'🧔',m:["All of them? You're buying a lot! Okay, ten dollars for everything. Good deal, right?","ぜんぶ？ たくさん 買うね！ よし、 ぜんぶで 10ドル。 おとくだろ？"],nt:[["How much for …?","「〜で いくら？」。 How much is this? より 気軽な 言い方"]],o:[["Deal!","買った！",'g2',1]]},
 free:{f:'🧔',m:["Free?! Ha ha ha! You're funny. Okay, I'll give you a free smile. That's all!","ただ！？ ははは！ おもしろい ね。 よし、 ただで 笑顔を あげよう。 それだけ！"],o:[["Fair enough.","そりゃ そうだ。",'f2',1]]},
 g1:{m:["I did it! In English! … Thank you for believing in me, boss. That made me braver.","できた！ 英語で！ … 信じて くれて ありがとう、 店長。 ちょっと 勇気が 出ました。"],ex:'laugh',p:'peace',end:'good'},
 g2:{m:["Wow, so many fish! Marco will be so happy. … Boss, you're a real shopping pro. Let's come again!","わあ、 お魚 いっぱい！ マルコさん、 きっと よろこぶ。 … 店長、 本物の 買い物の プロ。 また 来ましょう！"],ex:'laugh',end:'ok'},
 f1:{m:["Hey! I did a good job! … Ha ha, it's okay. Next time, you bargain and I'll get the extra fish with my smile.","ちょっと！ わたし がんばったのに！ … あはは、 いいよ。 つぎは 店長が ねぎって、 わたしが 笑顔で おまけを もらう。"],ex:'wink',end:'fun'},
 f2:{m:["A free smile! Ha ha ha! Boss, I can't breathe! That's the best thing I've heard all week.","ただで 笑顔！ あはは！ 店長、 息が できない！ 今週 いちばん おもしろかった。"],ex:'laugh',end:'fun'}}},

{id:'tr_light',ico:'🗼',t:'灯台と 夕日',en:'the lighthouse',p:1000,st:3,d:'岬の 灯台に のぼって 夕日を 見る',nodes:{
 s:{m:["Hah… hah… How many steps does this lighthouse have?! My legs are dying!","はあ… はあ… この 灯台、 階段 何段 あるの！？ 足が もう だめ！"],ex:'oops',o:[
  ["Almost there! Take my hand.","もう少し！ 手を かして。",'top',2,null,["Almost there! You can do it!","もう少し！ がんばれ！"]],["Want me to carry you?","おんぶ しようか？",'carry',1],["Let's take a break.","ひと休み しよう。",'rest',1]]},
 carry:{m:["Carry me?! No way, that's too embarrassing! … Ha ha, okay, now I have energy. Let's race to the top!","おんぶ！？ むり、 はずかしすぎる！ … あはは、 元気 出た。 てっぺんまで きょうそう！"],ex:'laugh',p:'guts',o:[["Hey, wait!","ちょっと、 まって！",'top',1]]},
 rest:{m:["Thank you… Look, through this little window you can see our beach. The shop looks so tiny!","ありがとう… 見て、 この 小さい 窓から 浜辺が 見える。 お店、 すごく 小さい！"],ex:'smile',o:[["Let's keep going.","さあ、 行こう。",'top',1]]},
 top:{m:["We made it! Wow… The whole sea is orange. The sun is melting into the water.","着いた！ わあ… 海が ぜんぶ オレンジ。 太陽が 海に とけていく。"],ex:'smile',p:'wave',nt:[["We made it!","「やった・たどりついた」。 目的地に 着いた とき・まにあった ときに"]],o:[
  ["This is the best view in the world.","世界で いちばんの けしき だね。",'sun',1],["Let's take a picture together.","いっしょに 写真 とろう。",'pic',2],["I'm a little scared of heights…","ちょっと 高い ところが こわい…",'scared',1]]},
 scared:{m:["Really? Then don't look down. Look at me instead. … See? Not scary, right?","ほんと？ じゃあ 下を 見ないで。 わたしを 見てて。 … ね？ こわく ないでしょ？"],ex:'wink',o:[["…Yeah. Not scary.","…うん。 こわく ない。",'sun',2]]},
 pic:{m:["Okay! Closer, closer… Say cheese! … Ha ha, look, the sun is right between our heads!","はい！ もっと よって、 もっと… はい チーズ！ … あはは、 見て、 太陽が 2人の 頭の あいだに！"],ex:'laugh',p:'peace',o:[["I'll keep this picture forever.","この 写真、 ずっと 大事に する。",'sun',2]]},
 sun:{m:["…The sun is gone. Boss, can I tell you something? When I first came to this beach, I was a little lonely. But now… I'm not.","…しずんじゃった。 店長、 ひとつ 言っても いい？ この 浜辺に 来た とき、 ちょっと さみしかったの。 でも いまは… ちがう。"],ex:'smile',o:[
  ["Me neither. Because you're here.","ぼくも。 ミオが いるから。",'g1',2],["The lighthouse is turning on.","灯台の 明かりが ついたよ。",'ok1',1],["Are you hungry? Let's eat.","おなか すいた？ なにか 食べよう。",'f1',1]]},
 g1:{m:["…You can't say that while looking at me like that. My face is hotter than the sunset. … Thank you. Really.","…そんな 顔で 言うの、 ずるい。 夕日より 顔が あつい。 … ありがとう。 ほんとに。"],fr:["…You're going to make me cry. Ha ha. We're a good team, right? The best team on this beach.","…泣かせる 気 ですか。 あはは。 わたしたち、 いい チーム ですよね？ 浜辺で いちばんの。"],ex:'oops',end:'good'},
 ok1:{m:["Oh, look! The light is spinning. It's telling the ships, 'You're safe. Come home.' … I like that.","あ、 見て！ 光が まわってる。 船に 「だいじょうぶ、 帰っておいで」って 言ってる みたい。 … そういうの、 好き。"],ex:'smile',end:'ok'},
 f1:{m:["Ha ha ha! You ruined the mood! … But yes, I'm starving. Race you down the stairs!","あはは！ ムードが だいなし！ … でも うん、 おなか ぺこぺこ。 階段、 下まで きょうそう！"],ex:'laugh',end:'fun'}}},

{id:'tr_park',ico:'🎡',t:'遊園地',en:'the amusement park',p:1800,st:3,d:'ジェットコースター・おばけやしき・かんらんしゃ',nodes:{
 s:{m:["Boss! Roller coaster first! It's the fastest one in the country! Are you ready?","店長！ まずは ジェットコースター！ 国で いちばん はやいの！ じゅんび いい？"],ex:'laugh',p:'guts',o:[
  ["Let's go!","行こう！",'coaster',1],["How about the haunted house first?","先に おばけやしきは？",'ghost',1],["Can we start with the teacups?","コーヒーカップから に しない？",'cups',1]]},
 cups:{m:["Teacups? Okay! … Wait, why are you spinning it so fast?! Boss! I'm getting dizzy! Ha ha ha!","コーヒーカップ？ いいよ！ … まって、 なんで そんなに まわすの！？ 店長！ 目が まわる！ あはは！"],ex:'laugh',o:[["Sorry! Now the roller coaster.","ごめん！ じゃあ ジェットコースター。",'coaster',1]]},
 coaster:{m:["AAAAH! … Ha ha ha! That was amazing! Let's go again! … Boss? Are you okay? You look a little green.","きゃああ！ … あはは！ さいこう！ もう 1回！ … 店長？ だいじょうぶ？ 顔が ちょっと 青いよ。"],ex:'laugh',nt:[["You look a little green.","「顔色が わるい」。 英語では 気分が わるい 顔を green（みどり）と 言う"]],o:[["I'm fine… Let's go to the haunted house.","だいじょうぶ… おばけやしきに 行こう。",'ghost',1],["One more time!","もう 1回！",'ghost',2]]},
 ghost:{m:["The haunted house… I-I'm not scared. Not at all. You go first, boss. I'll be right behind you.","おばけやしき… こ、 こわく ないもん。 ぜんぜん。 店長、 先に 行って。 すぐ うしろに いるから。"],ex:'oops',o:[
  ["Hold on to my arm.","ぼくの うでに つかまって。",'ghost2',2],["Boo!","わっ！",'boo',0],["We can skip it if you want.","いやなら やめても いいよ。",'wheel',1]]},
 boo:{m:["KYAAA! … Boss! That's not funny! … Okay, it was a little funny. But you'll pay for this!","きゃああ！ … 店長！ おもしろくない！ … まあ、 ちょっと おもしろかった。 でも しかえし するから！"],ex:'oops',o:[["Sorry, sorry!","ごめん ごめん！",'wheel',1]]},
 ghost2:{m:["Okay… I'm holding on. Don't let go, okay? … EEK! Something touched my foot! Run!","うん… つかまってる。 はなさないでね？ … ひゃっ！ なにか 足に さわった！ にげて！"],ex:'oops',nt:[["Don't let go.","「はなさないで」。 let go は 「手を はなす」"]],o:[["Run!","にげろ！",'wheel',1]]},
 wheel:{m:["Whew… Last one: the Ferris wheel. … It's so quiet up here. You can see the whole park. All the lights are coming on.","ふう… さいごは かんらんしゃ。 … 上は しずかですね。 遊園地 ぜんぶ 見える。 明かりが ついていく。"],ex:'smile',o:[
  ["Today was really fun. Thank you, Mio.","きょうは ほんとに 楽しかった。 ありがとう、 ミオ。",'g1',2],["When we get to the top, can I tell you something?","てっぺんに 着いたら、 言いたい ことが あるんだ。",'top',2,null,["Look, you can see the sea from here!","見て、 ここから 海が 見える！"]],["My legs are shaking from the coaster…","まだ コースターで 足が ふるえてる…",'f1',1]]},
 top:{m:["…We're at the top. … What did you want to say? … Wait. Say it slowly. I want to remember this.","…てっぺん だよ。 … なにを 言いたかったの？ … まって。 ゆっくり 言って。 おぼえて いたいから。"],fr:["Wow, the sea is sparkling! I can even see our beach. Look, there's the shop!","わあ、 海が キラキラ！ 浜辺も 見える。 ほら、 お店 あそこ！"],ex:'smile',o:[["I'm really glad I met you.","ミオに 会えて ほんとに よかった。",'g2',2,null,["Let's come back here again.","また ここに 来よう。"]]]},
 g1:{m:["Me too. Today was the best. Let's come back again — and next time, you're riding the roller coaster three times!","わたしも。 きょうは さいこうでした。 また 来ようね。 つぎは ジェットコースター 3回 だからね！"],ex:'laugh',p:'peace',end:'ok'},
 g2:{m:["…Me too. I'm really, really glad. … Ha ha, the Ferris wheel is going down. I wish it could stay at the top forever.","…わたしも。 ほんとに、 ほんとに よかった。 … あはは、 かんらんしゃ 下がって いっちゃう。 ずっと てっぺんに いられたら いいのに。"],fr:["Yes! Promise? Next time, let's bring Riku too. He'd love the teacups!","うん！ 約束？ つぎは リクくんも つれて きましょう。 コーヒーカップ、 よろこびそう！"],ex:'smile',end:'good'},
 f1:{m:["Ha ha ha! Still?! Okay, okay, when we get down, I'll buy you a churro. Brave boss!","あはは！ まだ！？ はいはい、 下に 着いたら チュロス 買って あげる。 えらい えらい、 店長！"],ex:'laugh',end:'fun'}}},

{id:'tr_hill',ico:'🌌',t:'星空の 丘',en:'the stargazing hill',p:1500,st:5,d:'夜の 丘で 星を 見る・ふたりの 話',nodes:{
 s:{m:["It's so dark up here… and so many stars! I've never seen the Milky Way with my own eyes before.","ここ、 まっくら… それに 星が いっぱい！ 天の川を 自分の 目で 見たの、 はじめて。"],ex:'smile',nt:[["the Milky Way","「天の川」。 milky（ミルクの ような）＋ way（道）"]],o:[
  ["I brought a blanket. Let's lie down.","ブランケット 持ってきた。 ねころがろう。",'lie',2],["I brought hot cocoa.","あったかい ココア 持ってきた。",'cocoa',1],["Can you find the Big Dipper?","北斗七星 わかる？",'dip',1]]},
 cocoa:{m:["Cocoa?! Boss, you think of everything! … Mmm. Sweet and warm. Just like— never mind!","ココア！？ 店長、 なんでも 考えてる！ … ん〜。 あまくて あったかい。 まるで… なんでもない！"],ex:'oops',o:[["Just like what?","まるで なに？",'lie',2],["Let's lie down and look up.","ねころんで 見よう。",'lie',1]]},
 dip:{m:["The Big Dipper… That one, like a big spoon! And if you follow it… that's the North Star. Sailors used it to find their way home.","北斗七星… あれ、 大きな スプーン みたいな！ たどっていくと… あれが 北極星。 船乗りは あれで 家への 道を 見つけたの。"],ex:'smile',nt:[["find one's way home","「家への 道を 見つける」。 way は 「道・方法」"]],o:[["You know a lot about stars.","星に くわしいね。",'lie',1]]},
 lie:{m:["…It feels like we're floating in space. Just the two of us. … Boss, can I ask you something serious?","…宇宙に ういてる みたい。 2人だけで。 … 店長、 まじめな こと 聞いても いい？"],ex:'smile',o:[["Of course. Anything.","もちろん。 なんでも。",'ask',2],["Is it a hard question?","むずかしい 質問？",'ask',1]]},
 ask:{m:["When you look at the stars, what do you wish for?","星を 見る とき、 なにを ねがうの？"],ex:'smile',o:[
  ["That we can keep looking at stars together.","ずっと いっしょに 星を 見られますように。",'g1',2],["To speak English perfectly.","英語が かんぺきに 話せますように。",'ok1',1],["A mountain of coins.","コインの 山。",'f1',0]]},
 g1:{m:["…That's my wish too. Exactly the same. … Shooting star! Did you see it? Then it'll come true. Twice, because we both wished.","…それ、 わたしの ねがいと 同じ。 まったく 同じ。 … 流れ星！ 見た？ じゃあ かなうね。 2人で ねがったから 2ばい。"],ex:'laugh',p:'peace',nt:[["come true","「（ゆめ・ねがいが）かなう」。 My dream came true!（ゆめが かなった！）"]],end:'good'},
 ok1:{m:["Ha ha, so serious! Then I'll be your teacher forever. … Mina-sensei might get jealous, though.","あはは、 まじめ！ じゃあ ずっと わたしが 先生 してあげる。 … ミナ先生に やきもち やかれる かもだけど。"],ex:'wink',end:'ok'},
 f1:{m:["Coins?! Under all these stars?! … Ha ha ha! Okay, then I wish for a mountain of cards. We can open a bigger shop!","コイン！？ この 星空の 下で！？ … あはは！ じゃあ わたしは カードの 山。 もっと 大きい お店が ひらけるね！"],ex:'laugh',end:'fun'}}},

{id:'tr_onsen',ico:'♨️',t:'温泉街',en:'the hot spring town',p:2500,st:5,d:'ゆかたで 温泉街を おさんぽ・足湯・射的',nodes:{
 s:{m:["Ta-da! How do I look in a yukata? The lady at the inn helped me put it on.","じゃーん！ ゆかた、 どうですか？ 旅館の おかみさんが 着せて くれたの。"],ex:'laugh',p:'peace',o:[
  ["You look beautiful.","すごく きれいだよ。",'walk',2],["It really suits you.","すごく にあってる。",'walk',2],["Is it inside out?","うらがえし じゃない？",'out',0]]},
 out:{m:["What?! … No, it's not! Boss! Ha ha, you scared me. Say something nice, quick!","えっ！？ … ちがうよ！ 店長！ あはは、 びっくり した。 はやく ほめて！"],ex:'oops',o:[["You look great.","すごく いいよ。",'walk',1]]},
 walk:{m:["Hehe… thank you. Let's walk around! Look, a foot bath on the street. Let's put our feet in.","えへへ… ありがとう。 おさんぽ しましょ！ 見て、 道に 足湯が ある。 足を つけよう。"],ex:'smile',nt:[["It suits you.","「にあってる」。 That color suits you.（その 色 にあうね）"]],o:[["Ahh… this feels amazing.","はあ… きもちいい。",'foot',1],["It's too hot!","あつすぎる！",'hot',1]]},
 hot:{m:["Ha ha, you jumped! Put your feet in slowly. Little by little… There. Better?","あはは、 とびあがった！ ゆっくり 入れて。 少しずつ… ほら。 どう？"],ex:'laugh',nt:[["little by little","「少しずつ」。 Little by little, my English is getting better."]],o:[["Much better.","ずっと いい。",'foot',1]]},
 foot:{m:["Boss… thank you for bringing me here. Working at the shop is fun, but sometimes I forget to rest.","店長… ここに つれてきて くれて ありがとう。 お店は 楽しいけど、 ときどき 休むのを わすれちゃう。"],ex:'smile',o:[["You work too hard.","ミオは がんばりすぎ。",'game',2],["Let's go play the shooting game!","射的 しに 行こう！",'game',1]]},
 game:{f:'👴',m:["Step right up! Three shots for one coin! Knock down the prize and it's yours!","さあ さあ！ 1回 3発！ 景品を たおしたら あげるよ！"],nt:[["Step right up!","「さあ さあ、 よって らっしゃい」。 お祭りの 呼びこみ"]],o:[
  ["Mio, which prize do you want?","ミオ、 どの 景品が ほしい？",'shoot',2],["I'll win the biggest one!","いちばん 大きいのを とる！",'big',1]]},
 shoot:{m:["That little cat! … You got it! First try! Boss, you're amazing! I'll keep it forever!","あの 小さい ねこ！ … やった！ 1発で！ 店長、 すごい！ ずっと 大事に する！"],ex:'laugh',p:'peace',o:[["It's for you.","ミオに あげる。",'g1',2]]},
 big:{m:["The giant bear? … Miss. Miss. … Miss! Ha ha ha! It didn't even move!","大きい クマ？ … はずれ。 はずれ。 … はずれ！ あはは！ ぴくりとも しない！"],ex:'laugh',o:[["Next time…","つぎこそ…",'f1',1]]},
 g1:{m:["…Today was like a dream. The foot bath, the yukata, this little cat… I'll name it 'Boss'. Ha ha. … Let's come back. Promise me.","…きょうは 夢 みたいだった。 足湯、 ゆかた、 この ねこ… 名前は 「店長」に する。 あはは。 … また 来ようね。 約束して。"],ex:'smile',end:'good'},
 f1:{m:["Ha ha, it's okay. Here — I won this tiny candy for you. A consolation prize from me!","あはは、 いいって。 はい、 わたしが とった 小さい あめ。 わたしからの 残念賞！"],ex:'wink',nt:[["a consolation prize","「残念賞」。 consolation は 「なぐさめ」"]],end:'fun'}}}
];
