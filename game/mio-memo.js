/* 📝 ミオの 留守番メモ（game/shop.js の 報告で つかう）
   メモは 組み合わせ: ①売れた ようす（売れた カードの 単語・人数が 入る）＋ ②ミオの ひとこと（なかよしの 段階で かわる）
   ＋ ③ときどき 「きょうの フレーズ」（きみの レベルに あわせる）＋ ④しめの サイン（段階で かわる）。 さいきん 出た 文は しばらく 出ない
   {w} 売れた カードの 単語 / {w2} もう1まい / {n} 売れた まい数 / {g} お客の 人数 */
const MEMO_SOLD=[
 ["A girl bought the \"{w}\" card. She said, \"I love this word!\" Me too!","女の子が 「{w}」の カードを 買いました。 「この 単語 大好き！」って。 わたしも！"],
 ["The \"{w}\" card is gone! A grandpa said it reminded him of his youth.","「{w}」の カード、 売れました！ おじいさんが 若いころを 思い出すって。"],
 ["Someone bought \"{w}\". I said, \"Thank you! Please come again!\" Perfect English? I think so!","「{w}」が 売れました。 「Thank you! Please come again!」って 言えました。 完ぺき？ たぶん！"],
 ["{n} cards sold! The first one was \"{w}\". I did a little dance behind the counter.","{n}まい 売れました！ さいしょは 「{w}」。 カウンターの うしろで ちょっと おどりました。"],
 ["A tourist asked me what \"{w}\" means. I explained it in English! My heart was beating so fast.","観光客の 人に 「{w}」の 意味を 聞かれて、 英語で 説明しました！ ドキドキ しました。"],
 ["\"{w}\" and \"{w2}\" went to the same customer. He said they make a good team.","「{w}」と 「{w2}」を 同じ お客さんが 買いました。 いい コンビだって。"],
 ["A little boy bought \"{w}\" with his own coins. He counted them very carefully. So cute!","男の子が 自分の コインで 「{w}」を 買いました。 すごく ていねいに 数えてて、 かわいかった！"],
 ["I sold \"{w}\"! Then I said \"{w}\" ten times so I won't forget it.","「{w}」が 売れました！ わすれないように 「{w}」って 10回 言いました。"],
 ["A college student bought \"{w}\". She is studying for a test. I said, \"Good luck!\"","大学生の 人が 「{w}」を 買いました。 テスト勉強中 だって。 「Good luck!」って 言いました。"],
 ["{g} customers came, and {n} cards sold. Not bad, right? (I learned \"not bad\" is a compliment!)","お客さん {g}人、 売れたのは {n}まい。 not bad でしょ？（not bad は ほめことば って ならいました！）"],
 ["A lady said, \"I've been looking for '{w}' everywhere!\" She was so happy. Me too!","おねえさんが 「『{w}』を ずっと さがしてたの！」って。 すごく よろこんでました。 わたしも！"],
 ["\"{w}\" found a new home today. Bye-bye, \"{w}\"! Be happy!","きょう 「{w}」が 新しい 家に 行きました。 ばいばい、 「{w}」！ しあわせにね！"],
 ["Someone bought \"{w}\" and asked me to use it in a sentence. I did it! He clapped!","「{w}」を 買った 人に 例文を 言ってって たのまれて… 言えました！ はくしゅ されました！"],
 ["A fisherman bought \"{w}\". He said, \"Good word, good luck!\" I don't know why, but I agree.","漁師さんが 「{w}」を 買いました。 「いい 単語は 運を よぶ！」って。 よく わからないけど 賛成。"],
 ["Sales report: {n} cards! The most popular was \"{w}\". I think it's because of my display skills.","売り上げ報告： {n}まい！ いちばん 人気は 「{w}」。 わたしの かざり方の おかげ だと 思います。"],
 ["I almost gave \"{w}\" for free because I was nervous. Don't worry, I remembered the price!","きんちょうして 「{w}」を ただで わたしそうに なりました。 だいじょうぶ、 ねだんは 思い出しました！"],
 ["Two friends wanted \"{w}\". They did rock-paper-scissors. Very exciting!","友だち ふたりが 「{w}」を ほしがって、 じゃんけんで きめてました。 もりあがった！"],
 ["\"{w}\" sold quickly. Maybe we should put more cards like it on the shelf, boss!","「{w}」は すぐ 売れました。 にた カード もっと ならべても いいかも、 店長！"],
 ["A man from Australia bought \"{w}\" and said, \"Cheers!\" I said \"Cheers!\" too. Is that right?","オーストラリアの 人が 「{w}」を 買って 「Cheers!」って。 わたしも 「Cheers!」。 合ってる？"],
 ["I wrapped \"{w}\" with a ribbon. The customer said it was too pretty to open. Ha ha!","「{w}」に リボンを つけたら、 「きれいで あけられない」って。 あはは！"],
 ["{n} cards sold while you were away. I feel like a real shop clerk now!","るすの あいだに {n}まい 売れました。 ほんとの 店員に なった 気分！"],
 ["A woman bought \"{w}\" for her daughter. She said her daughter is learning English too. We're friends now!","「{w}」を むすめさんに 買って いった 人が。 むすめさんも 英語を 勉強中 だって。 もう なかま！"],
 ["\"{w}\" is sold out! …Wait, it was the only one. So it was always going to be sold out. Ha ha.","「{w}」 売り切れ！ …あ、 1まい しか なかった。 そりゃ 売り切れますね。 あはは。"],
 ["I said, \"That'll be {p} coins, please.\" The customer said, \"Your English is great!\" I'm floating!","「That'll be {p} coins, please.」って 言ったら 「英語 じょうずだね！」って。 ういてます！"],
 ["A quiet boy bought \"{w}\". He whispered, \"Thank you.\" I whispered back, \"You're welcome.\"","しずかな 男の子が 「{w}」を 買いました。 小さい 声で 「Thank you.」 わたしも 小声で 「You're welcome.」"]];
const MEMO_LOOK=[
 ["{g} customers came. They looked around but didn't buy. Maybe next time!","お客さんは {g}人。 見て まわったけど 買わなかった。 つぎは きっと！"],
 ["People came, but the shelf was a little empty. Boss, can we put more cards out?","お客さんは 来たけど、 たなが ちょっと さみしかったかも。 店長、 カード もっと ならべません？"],
 ["{g} people came in to get out of the sun. The shop is a nice shady place!","{g}人が 日よけに 入ってきました。 うちの お店は いい 日かげです！"],
 ["A customer said, \"Just looking, thanks.\" I learned that phrase today!","お客さんが 「Just looking, thanks.」って。 きょう おぼえた フレーズです！"],
 ["Someone asked for a card we don't have. Maybe you can find it in the mine?","ない カードを さがしてる 人が いました。 鉱山で 見つかるかも？"],
 ["No sales, but a kid taught me a new game. I lost three times. Ha ha.","売り上げは ゼロ。 でも 子どもに 新しい あそびを 教えてもらって、 3回 負けました。 あはは。"],
 ["Customers came, but they only wanted to talk. I practiced English a lot, so that's a win!","お客さんは 来たけど おしゃべり だけ。 英語の 練習に なったから 勝ちです！"],
 ["{g} customers, zero sales. But many smiles! Smiles are free, right?","お客さん {g}人、 売り上げ ゼロ。 でも 笑顔は いっぱい！ 笑顔は むりょう ですよね？"]];
const MEMO_NONE=[
 ["Nobody came while you were away. I studied English the whole time!","るすの あいだ、 お客さんは 来ませんでした。 ずっと 英語の 勉強してました！"],
 ["It was very quiet. I talked to the seagulls. They're good listeners.","とっても しずか。 カモメと お話しました。 聞き上手なんです。"],
 ["No customers. I cleaned every shelf. They're shining like stars now!","お客さんは ゼロ。 たなを ぜんぶ ふきました。 星みたいに ぴかぴか！"],
 ["Zero customers… so I practiced my \"Welcome!\" voice. Three different versions!","お客さん ゼロ… だから 「Welcome!」の 声を 練習。 3パターン！"],
 ["Nobody came. I wrote twenty new words in my notebook. Productive!","だれも 来なかったので、 ノートに 新しい 単語を 20こ 書きました。 有意義！"],
 ["The beach was empty today. Even the crabs were taking a day off.","きょうの 浜辺は がらがら。 カニさんも お休みでした。"]];
/* ①' 閉店中だけ だった とき（11/24: 21〜9時は お店も おやすみ。 ミオは 2階） */
const MEMO_CLOSED=[
 ["The shop was closed, so I was upstairs. Did you see the stars from the mine? …Oh, you can't. Ha ha.","閉店中 だったので、 2階に いました。 鉱山から 星、 見えました？ …あ、 見えないか。 あはは。"],
 ["We were closed while you were away. I read an English book in bed. I fell asleep on page three.","るすの あいだは 閉店中。 ベッドで 英語の 本を 読みました。 3ページめで ねちゃいました。"],
 ["Closed means closed! I locked the door and checked it twice. Good night, boss.","閉店は 閉店！ ドアの かぎ、 2回 たしかめました。 おやすみなさい、 店長。"],
 ["No customers tonight. The shop was sleeping, and so was I. Zzz…","今夜は お客さん なし。 お店も ねてたし、 わたしも ねてました。 ぐう…"],
 ["It was after closing time, so I wrote in my diary. In English! Well, half English.","閉店後 だったので、 日記を 書きました。 英語で！ …半分 だけ。"],
 ["The sign said \"CLOSED,\" so nobody came. I listened to the waves from my window.","「CLOSED」の 札だったので、 だれも 来ませんでした。 窓から 波の 音を 聞いてました。"]];
/* ①'' とちゅうで 閉店に なった とき（{n} は つかわない。 2行目に そえる） */
const MEMO_PART=[
 ["After closing time, I went upstairs and counted the coins. Twice!","閉店の あとは 2階で コインを 数えました。 2回も！"],
 ["At nine, I flipped the sign to \"CLOSED.\" Flip! It felt so professional.","9時に 札を 「CLOSED」に くるっ。 プロっぽかった！"],
 ["When the shop closed, I said \"Good night\" to the shelves. Is that weird?","お店を しめる とき、 たなに 「Good night」って 言いました。 へん ですか？"]];
/* ② ミオの ひとこと: どの 段階でも */
const MEMO_ANY=[
 ["I swept the floor three times. It's very clean now.","ゆかを 3回 はきました。 とっても きれいです。"],
 ["I fell asleep for a minute… only one minute! I promise!","ちょっとだけ ねちゃいました… 1分だけです！ ほんとに！"],
 ["I learned a new word today: \"customer.\" Like the people who come here!","きょうの 新しい 単語： 「customer」。 ここに 来る 人たちの ことです！"],
 ["A seagull came in. I said, \"Sorry, no birds allowed!\"","カモメが 入ってきました。 「ごめんね、 鳥は だめなの！」って 言いました。"],
 ["Someone said our shop smells like the sea. I think that's a good thing!","「この 店、 海の においが する」って。 いい 意味ですよね！"],
 ["I tried to say \"thirteen\" and \"thirty\" correctly. It's harder than it looks!","「thirteen」と 「thirty」を 言い分ける 練習。 けっこう むずかしい！"],
 ["Please don't worry. I didn't break anything today! Well, almost nothing.","心配 しないでください。 きょうは なにも こわしてません！ ほとんど。"],
 ["I put a little shell next to the register. Do you like it?","レジの 横に 小さい 貝がらを かざりました。 どうですか？"],
 ["I dropped the price tags. All of them. I put them back… I think correctly.","値札を ぜんぶ おとしました。 もどしました… たぶん 正しく。"],
 ["The radio played an English song. I sang along. Badly. Very badly.","ラジオで 英語の 歌が。 いっしょに 歌いました。 へたに。 すごく へたに。"],
 ["I had a rice ball for lunch. It was shaped like a star. I made it myself!","お昼は おにぎり。 星の 形に したんです。 自分で！"],
 ["My professor emailed me in English. I understood ninety percent! The other ten percent is a mystery.","教授から 英語の メール。 90％ わかりました！ のこり 10％は なぞ。"],
 ["I practiced \"How can I help you?\" twenty times. Now I say it in my sleep.","「How can I help you?」を 20回 練習。 ねごとでも 言えます。"],
 ["The sunset was so pretty today. I took a photo for you. …Oh, my phone is out of battery.","きょうの 夕日、 きれいでした。 写真 とったんです。 …あ、 電池 切れてた。"],
 ["I tried a new hairstyle. Then the wind came. Now it's an old hairstyle.","新しい かみがたに したら 風が ふいて、 もとに もどりました。"],
 ["A cat sat on the counter for an hour. I think she's our new manager.","ネコが 1時間 カウンターに すわってました。 新しい 店長かも。"],
 ["I read an English comic during the break. I laughed out loud. Customers looked at me.","休けいに 英語の まんがを 読んで 声に 出して 笑っちゃいました。 お客さんに 見られた。"],
 ["I found a card under the shelf! It's a bit dusty, but it's alive.","たなの 下に カードを 発見！ ちょっと ほこりっぽいけど 生きてます。"],
 ["I'm trying to think in English today. Right now I'm thinking: \"I'm hungry.\"","きょうは 英語で 考える 練習中。 いま 考えてるのは 「I'm hungry.」"],
 ["The wind blew the door open three times. Hello, wind. You're not a customer.","風で ドアが 3回 あきました。 こんにちは、 風さん。 お客さんじゃ ないよね。"],
 ["I wrote \"Welcome!\" on the board in five colors. It looks like a rainbow!","黒板に 「Welcome!」を 5色で 書きました。 にじみたい！"],
 ["A boat passed by and someone waved. I waved back with both hands!","ボートが 通って 手を ふってくれたので、 両手で ふりかえしました！"]];
/* ② ミオの ひとこと: 段階ごと（0 はじめまして … 5 ？？？） */
const MEMO_STG=[
 [["I'm still learning where everything is. The cards are in… the card place! Ha ha.","まだ どこに なにが あるか おぼえ中。 カードは… カードの 場所！ あはは。"],
  ["Thank you for hiring me, boss. I'll do my best every day!","やとってくれて ありがとうございます、 店長。 毎日 がんばります！"],
  ["I was nervous being alone, but it was OK! I'm getting used to it.","ひとりで きんちょう したけど、 だいじょうぶでした！ なれてきました。"]],
 [["I'm getting better at the register. Only one mistake today!","レジに なれてきました。 きょうの まちがいは 1回だけ！"],
  ["Boss, your shop is fun. I'm glad I work here.","店長の お店、 たのしいです。 ここで はたらけて よかった。"],
  ["I memorized all the card prices. Test me when you come back!","カードの ねだん、 ぜんぶ おぼえました。 もどったら テストしてください！"]],
 [["I saved you a cookie. It's in the drawer. Don't tell anyone. Ha ha.","クッキー 1まい とっておきました。 引き出しの 中。 ないしょですよ。 あはは。"],
  ["I told my friends about you. They said you sound nice. They're right!","友だちに 店長の 話を したら、 いい 人そう だって。 そのとおり！"],
  ["When you're in the mine, the shop feels a little quiet. Come back soon, OK?","店長が 鉱山に いると、 お店が ちょっと しずか。 はやく もどってきてね。"]],
 [["I trust you with the shop, and you trust me. That makes me really happy.","店長は わたしを 信じて お店を まかせてくれる。 それが すごく うれしい。"],
  ["Partner check: shop is clean, shelves are full, Mio is smiling. All OK!","相棒チェック： お店 きれい、 たな いっぱい、 ミオ 笑顔。 オールOK！"],
  ["I made a small sign: \"Boss is digging. Mio is here!\" Customers love it.","小さい かんばんを 作りました： 「店長は 採掘中。 ミオが います！」 好評です。"]],
 [["…I kept looking at the door, waiting for you. Is that weird? Ha ha.","…ずっと ドアを 見て 待ってました。 へんですか？ あはは。"],
  ["The shop is fine. But I'm… a little lonely when you're gone. Just a little!","お店は だいじょうぶ。 でも 店長が いないと… ちょっと さみしい。 ちょっとだけ！"],
  ["I wrote your name in my notebook by mistake. Many times. By mistake!","ノートに まちがえて 店長の 名前を 書いちゃいました。 何回も。 まちがえて！"]],
 [["I missed you! The mine is far away… even if it's just under our feet.","会いたかった！ 鉱山は 遠い… 足の 下 なのに。"],
  ["I made two cups of cocoa. One is for you. It's still warm, so hurry!","ココアを 2つ いれました。 1つは 店長の。 まだ あったかいから いそいで！"],
  ["Customers asked why I was smiling so much. I said, \"Someone special is coming back soon.\"","なんで そんなに にこにこ してるのって 聞かれて、 「とくべつな 人が もうすぐ 帰ってくるの」って。"]]];
/* ③ きょうの フレーズ（レベルで） [英語, 意味, 例] */
const MEMO_PHRASE={
 es:[["Here you are.","はい、 どうぞ","Here you are. Your card!"],["See you!","またね","See you tomorrow!"],["Excuse me.","すみません","Excuse me, how much is it?"],["Good job!","よくできました","Good job, boss!"],["Me too!","わたしも！","I like cake. Me too!"],["Let's go!","行こう！","Let's go to the beach!"],["I'm full.","おなか いっぱい","I ate three rice balls. I'm full."],["Just a moment.","少々 お待ちを","Just a moment, please."],["Watch out!","あぶない！","Watch out! A crab!"],["Of course!","もちろん！","Can I help? Of course!"],["I'm sorry.","ごめんなさい","I'm sorry. I'm late."],["Take care.","気をつけてね","Take care on your way home."]],
 jh:[["sold out","売り切れ","The 'sun' card is sold out."],["on sale","セール中","These cards are on sale!"],["take a break","休けいする","Let's take a break."],["by the way","ところで","By the way, did you eat lunch?"],["for example","たとえば","I like animals, for example, cats."],["look forward to","〜を 楽しみに する","I'm looking forward to the festival."],["be good at","〜が とくい","I'm good at smiling."],["get along with","〜と なかよく やる","I get along with the boss."],["at first","さいしょは","At first, I was nervous."],["right away","すぐに","I'll do it right away!"],["in a hurry","いそいで","He left in a hurry."],["make a mistake","まちがえる","It's OK to make a mistake."]],
 hs:[["first come, first served","早い者勝ち","Rare cards: first come, first served!"],["give it a try","ためしに やってみる","I'll give it a try!"],["out of stock","在庫切れ","Sorry, it's out of stock."],["keep in mind","おぼえて おく","Keep in mind that we close at six."],["make sense","意味が 通る・なっとく","Oh, that makes sense!"],["on second thought","やっぱり（考えなおして）","On second thought, I'll take two."],["it depends","場合に よる","Is it difficult? It depends."],["no wonder","どうりで","No wonder you're tired!"],["take it easy","むりしないで","Take it easy today."],["as soon as possible","できるだけ 早く","I'll restock as soon as possible."]],
 adv:[["a piece of cake","かんたん","This quiz is a piece of cake."],["break the ice","場を なごませる","I told a joke to break the ice."],["hit the books","しっかり 勉強する","I have to hit the books tonight."],["under the weather","体調が いまいち","I'm a little under the weather."],["the ball is in your court","次は あなたの 番","I said sorry. The ball is in your court."],["once in a blue moon","ごく まれに","Rare cards come once in a blue moon."],["cut corners","手を ぬく","Don't cut corners when you clean!"],["call it a day","きょうは おしまい","Let's call it a day."]]};
/* ④ サイン（段階で） */
const MEMO_SIGN=[["– Mio","ミオ"],["– Mio (part-timer)","バイトの ミオ"],["– Mio ☆","ミオ☆"],["– Your partner, Mio","相棒の ミオ"],["– Mio ♡ (Is this OK?)","ミオ♡（これで いい？）"],["– Love, Mio","愛を こめて ミオ"]];

(()=>{
const pickL=a=>a[Math.random()*a.length|0];
const key=(t,a)=>t+(a[0]||'').slice(0,24);
function fresh(L,t,S){const ok=L.filter(a=>!S.mm.includes(key(t,a)));const x=pickL(ok.length?ok:L);S.mm.push(key(t,x));if(S.mm.length>40)S.mm.splice(0,S.mm.length-40);return x}
/* r = {guests, sold:[[id,price]]}, word = id => 英単語 */
function make(r,word){const S=SHOP.rec();S.mm=S.mm||[];
  let st=0;try{st=MIOC.stage()}catch(e){}
  const ws=r.sold.map(([id])=>word(id)).filter(Boolean);
  const v={w:ws[0]||'card',w2:ws[1]||ws[0]||'card',n:r.sold.length,g:r.guests,p:r.sold[0]?r.sold[0][1]:10};
  const fill=s=>String(s).replace(/\{(\w+)\}/g,(m,k)=>v[k]!=null?v[k]:m);
  if(r.allClosed){const a=fresh(MEMO_CLOSED,'c',S),b=fresh(MEMO_STG[st],'b',S);return {lines:[a,b],ph:null,sign:MEMO_SIGN[st]}}
  let A=r.sold.length?MEMO_SOLD.filter(a=>(ws.length>1||!a[0].includes('{w2}'))&&(r.sold.length>1||!a[0].includes('{n}'))):r.guests?MEMO_LOOK:MEMO_NONE;
  const a=fresh(A,'a',S);
  const pool=MEMO_ANY.concat(MEMO_STG[st],MEMO_STG[st],st>0?MEMO_STG[st-1]:[]);
  const b=r.closed&&Math.random()<.7?fresh(MEMO_PART,'q',S):fresh(pool,'b',S);
  let lv='es';try{lv=MINA.level()}catch(e){}
  const ph=Math.random()<.6?fresh(MEMO_PHRASE[lv]||MEMO_PHRASE.es,'p',S):null;
  return {lines:[[fill(a[0]),fill(a[1])],b],ph,sign:MEMO_SIGN[st]}}
const count=()=>MEMO_CLOSED.length+MEMO_PART.length+MEMO_SOLD.length+MEMO_LOOK.length+MEMO_NONE.length+MEMO_ANY.length+MEMO_STG.flat().length+Object.values(MEMO_PHRASE).flat().length;
window.MIOMEMO={make,count};
})();
/* ミナ先生の セリフ（メモの フレーズ） */
Object.assign(MINA_LINES,{
 x_mioMemo:[['smile','ミオさんの メモの 「きょうの フレーズ」、 「{p}」だったね。 ＝{j}。 つかってみて'],['happy','「{p}」…ミオさん、 いい フレーズを えらぶね。 意味は 「{j}」だよ']]});
if(window.MINA_SENSE&&MINA_SENSE._rules)MINA_SENSE._rules.push(
 ['x_mioMemo',2,()=>{try{const m=SHOP.rec().memo;return m&&m.ph?{p:m.ph[0],j:m.ph[1]}:null}catch(e){return null}},()=>['🃏 お店へ',()=>CG.open()]]);
