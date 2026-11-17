/* 🌙 深夜の ホラーイベント（しくみは game/horror.js）
   - 浜辺の 時計で 深夜 0:00〜3:59 だけ。 2:00〜2:29 は 丑三つ時（the witching hour）
   - HR_TALKS: カードショップの カウンターで 起きる 長い 会話（形は game/mio-talk.js と 同じ。 画面は game/mio-chat.js）
       cat: kowai=しっかり こわい / doki=ドキドキ / unk=うんちく / fun=おもしろ
       sg = 会話の 前に 店内で 起きる できごと（HR_SIGNS）。 st = ミオとの 段階（MIO_STG の 番号）。 dk = ドキドキ（えらばなかった 人の 分は 出ない）
       ushi = 丑三つ時 だけ / cdl = 🕯️ ろうそくを ともした ときだけ
       ノードの f = 話す 人の 顔（絵文字。 ミオ 以外の とき）。 nt = 💌 ことばメモ
       答えの 5番目に 'charm' が あると 🧿 お守りを もっている ときだけ 出る（えらぶと 1つ つかう）
   - HR_MINA: ミナ先生の 夜の 話（🌙 深夜の きろく から）
   - HR_MINE: 深夜の 鉱山の できごと。 bad = こわい 結果（🧿 お守りで ふせげる）
   - HR_UNK: 夜と おばけの 英語うんちく（ほんとうの 話だけ。 俗説は 「〜と 言われている」） */

/* ================================================================ 🃏 カウンターで 起きる できごと */
const HR_SIGNS={
 flicker:{ico:'💡',st:'💡 電気が チカチカ… <b>flicker</b> ＝ ちらつく',m:["W-what's wrong with the lights?","で、 電気… どうしたの？"]},
 window:{ico:'🪟',st:'🪟 窓の 外に… 白い 顔？ <b>pale</b> ＝ 青白い',m:["Did you see that? In the window!","いま 見た？ 窓に！"]},
 ghostin:{ico:'🎩',st:'🎩 ドアが あいた。 足音の しない お客さん… <b>footsteps</b> ＝ 足音',g:["Good evening…","こんばんは…"]},
 phone:{ico:'☎️',st:'☎️ こんな 時間に お店の 電話が… <b>ring</b> ＝ 鳴る',m:["Who calls at this hour?","こんな 時間に だれ？"]},
 doll:{ico:'🎎',st:'🎎 たなの 上に 見おぼえの ない 人形… <b>doll</b> ＝ 人形',m:["Was that doll there before?","あの 人形、 さっきから あった？"]},
 cardfall:{ico:'🃏',st:'🃏 だれも さわってないのに カードが 落ちた… <b>by themselves</b> ＝ ひとりでに',m:["The cards fell by themselves!","カードが ひとりでに 落ちた！"]},
 bell:{ico:'🕑',st:'🕑 どこかで 時計が ボーン… ボーン… <b>the witching hour</b> ＝ 丑三つ時',m:["Two o'clock… the witching hour.","2時… 丑三つ時だ。"]},
 yawn:{ico:'🥱',st:'🥱 ミオが ねむそう… <b>yawn</b> ＝ あくび',m:["(yawn) Midnight work is hard…","（あくび） 深夜の 仕事って たいへん…"]},
 sheet:{ico:'👻',st:'👻 おばけが 出た！ …？ <b>Boo!</b> ＝ ばあ！',g:["Boooo!","ばあ〜！"]},
 blackout:{ico:'⚫',st:'⚫ 停電！ まっくら… <b>blackout</b> ＝ 停電',m:["Boss?! I can't see anything!","店長？！ なにも 見えない！"]},
 steps:{ico:'👣',st:'👣 屋根の 上から 足音… <b>creak</b> ＝ ギシッと 鳴る',m:["Footsteps… on the roof?","屋根の 上に… 足音？"]},
 doze:{ico:'😴',st:'😴 ミオが うたた寝… うなされてる？ <b>nightmare</b> ＝ こわい 夢',m:["…No… don't go in there…","…だめ… そこは…"]},
 knock:{ico:'✋',st:'✋ 窓を コツ… コツ… <b>tap</b> ＝ 軽く たたく',m:["Something is tapping on the window…","なにかが 窓を たたいてる…"]},
 candle:{ico:'🕯️',st:'🕯️ ろうそくを ともした。 炎が ゆれる… <b>flame</b> ＝ 炎',m:["A candle? How spooky…","ろうそく？ ふんいき ある…"]},
 /* 会話の ない できごと */
 cat:{ico:'🐈‍⬛',st:'🐈‍⬛ ドアの 外に 光る 目… ただの ネコ。 <b>Phew!</b> ＝ ふう！',m:["Oh, it's just a cat. Phew!","なんだ、 ネコか。 ふう！"]},
 whisper:{ico:'🌬️',st:'🌬️ 耳もとで ささやき声… 「…hello…」 <b>whisper</b> ＝ ささやく',m:["Did you just whisper something?","いま なにか ささやいた？"]},
 record:{ico:'🎶',st:'🎶 レコードの 針が ひとりでに… <b>creepy</b> ＝ ぞっとする',m:["Who touched the record player?","レコード、 だれが さわったの？"]}};
const HR_AMBIENT=['cat','whisper','record'];

const HR_CAT={kowai:['😱','しっかり こわい'],doki:['💓','ドキドキ'],unk:['📜','うんちく'],fun:['😂','おもしろ']};

/* ================================================================ 🃏 カウンターの 長い 会話 */
const HR_TALKS=[
/* ---------------------------------------------------------------- 😱 しっかり こわい */
{id:'hr_story',cat:'kowai',sg:'flicker',st:0,ico:'🕯️',t:'ミオの 怪談',ph:['🃏','A card that wasn\'t there before','さっきまで なかった カード'],nodes:{
 s:{m:["Boss… it's past midnight. Do you want to hear a ghost story? A true one. It happened in this shop.","店長… もう 夜中の 12時 すぎ。 こわい 話、 聞きたい？ ほんとうの 話。 この お店で あったの。"],ex:'wink',o:[
  ["Sure. I'm not scared.","いいよ。 こわくないし。",'a',2],["…Is it really true?","…ほんとうの 話？",'true',2],["No thanks. I'm going home.","えんりょする。 帰る。",'home',1]]},
 true:{m:["The old owner told me. The man who ran this shop thirty years ago. He never lied about anything.","前の 店長さんが 教えてくれたの。 30年前に この お店を やってた 人。 うそは ぜったい つかない 人。"],ex:'smile',o:[
  ["OK. Tell me.","わかった。 話して。",'a',2]]},
 home:{m:["Home? But the road to your house goes past the old pier… where SHE stands. …Ha ha, just kidding! Stay, please?","帰る？ でも 帰り道は 古い 桟橋の 前を 通るよね… 「あの人」が 立ってる ところ。 …あはは、 じょうだん！ いて、 おねがい？"],ex:'wink',o:[
  ["…Fine. Tell me.","…わかったよ。 話して。",'a',2]]},
 a:{m:["Every night at 2 a.m., a girl came into the shop. She always bought the same card: \"mirror.\" Never anything else.","毎晩 2時に、 女の子が お店に 来たの。 いつも 同じ カードを 買った。 「mirror（かがみ）」。 ほかの 物は ぜったい 買わない。"],ex:'smile',
  nt:[["every night at 2 a.m.","「毎晩 2時に」。 時刻は at ＋ 時刻"],["She always bought ～","always は ふつう 動詞の 前。 「いつも 〜を 買った」"]],o:[
  ["Why the same card?","なんで 同じ カード？",'b',2],["Maybe she was collecting them.","集めてたのかも。",'b',2]]},
 b:{m:["One night the owner asked her. She said, \"I'm looking for my face. I can't find it in any of them.\"","ある 夜、 店長さんが 聞いたの。 女の子は 言った。 「わたしの 顔を さがしてるの。 どの カードにも 見つからない」"],ex:'oops',
  nt:[["I'm looking for ～","「〜を さがしている」。 look for ＝ さがす"]],o:[
  ["…What does that mean?","…どういう いみ？",'c',2],["Stop. That's creepy.","やめて。 ぞっとする。",'creepy',3]]},
 creepy:{m:["Creepy, right? I got goosebumps the first time I heard it. Look—I still have them.","ぞっとするでしょ？ はじめて 聞いた とき とりはだが 立ったの。 ほら、 いまも。"],ex:'oops',
  nt:[["creepy","「ぞっとする・気味が わるい」。 scary より、 じわっと こわい 感じ"],["goosebumps","「とりはだ」。 goose（ガチョウ）の 皮ふに にているから"]],o:[
  ["What happened next?","それで どうなったの？",'c',2]]},
 c:{m:["The owner looked at her face. And… there was nothing there. No eyes, no mouth. Just smooth skin, like an egg. Then the lights went out.","店長さんが 女の子の 顔を 見たの。 そしたら… なにも なかった。 目も 口も。 たまごみたいに つるつる。 そして 電気が 消えた。"],ex:'oops',o:[
  ["(Hold your breath.)","（息を のむ）",'d',2],["Like a noppera-bo!","のっぺらぼう みたい！",'nop',3]]},
 nop:{m:["Yes! In English it's a \"faceless ghost.\" Lafcadio Hearn wrote about one in his book Kwaidan. The story is called \"Mujina.\"","そう！ 英語だと 「faceless ghost」。 ラフカディオ・ハーンが 『怪談』の 中に 書いてるよ。 「むじな」って いう 話。"],ex:'smile',
  nt:[["faceless","「顔の ない」。 -less は 「〜が ない」（endless ＝ おわりの ない）"],["Kwaidan","小泉八雲（ラフカディオ・ハーン）が 1904年に 英語で 出した 本。 日本の こわい 話を 世界に しょうかいした"]],o:[
  ["And then?","それで？",'d',2]]},
 d:{m:["When the lights came back, she was gone. But on the counter there was one card. \"Mirror.\" And in the picture on the card… there was a face. HER face.","電気が ついたら、 女の子は いなかった。 でも カウンターに カードが 1まい。 「mirror」。 そして その 絵の 中に… 顔が あったの。 あの 子の 顔が。"],ex:'oops',o:[
  ["Is that card still here?","その カード、 まだ ここに あるの？",'still',3],["I don't believe it.","信じない。",'end2',1],["(Look at the counter.)","（カウンターを 見る）",'end1',2]]},
 still:{m:["…It's in the back room. In a box. Nobody opens it. …Boss, why are you looking at the back room like that?","…奥の 部屋。 箱の 中。 だれも あけないの。 …店長、 なんで そんな 目で 奥を 見てるの？"],ex:'oops',o:[
  ["Let's open it.","あけてみよう。",'end3',2],["Let's never open it.","ぜったい あけないでおこう。",'end1',2]]},
 end1:{m:["(You look at the counter. There's a card on it. You didn't put it there.) …Boss. Was that card there before? …Boss?!","（カウンターを 見る。 カードが 1まい ある。 置いた おぼえは ない） …店長。 その カード、 さっきから あった？ …店長？！"],ex:'oops',
  nt:[["Was that there before?","「それ、 さっきから あった？」。 こわい 話の 定番の ひとこと"]],end:'good'},
 end2:{m:["You don't? OK. Then you can close the shop alone tonight. I'm going home. …Kidding! Don't leave me here alone!","信じない？ じゃあ 今夜は 店長 ひとりで 戸じまり してね。 わたし 帰る。 …うそ！ ひとりに しないで！"],ex:'laugh',end:'fun'},
 end3:{m:["(You open the box. One card: \"mirror.\" In the picture, you can see your own face. And behind you… Mio, smiling.) …Boss? Why are you looking at me? I'm over HERE, by the door.","（箱を あける。 カードが 1まい。 「mirror」。 絵の 中に 自分の 顔。 そして うしろに… ほほえむ ミオ） …店長？ なんで こっち 見るの？ わたし、 ドアの ところに いるよ。"],ex:'oops',end:'ok'}}},

{id:'hr_mirror',cat:'kowai',sg:'window',st:0,ico:'🪞',t:'窓に うつる 人',ph:['🪟','Three people in the glass','ガラスに うつる 3人'],nodes:{
 s:{m:["Boss, the window is so black tonight. It's like a mirror. I can see both of us in it.","店長、 今夜は 窓が まっくら。 かがみ みたい。 ふたりとも うつってる。"],ex:'smile',o:[
  ["(Look at the window.)","（窓を 見る）",'a',2]]},
 a:{m:["See? There's you, and there's me… and… …Boss. How many people are in the window?","ほら。 店長が いて、 わたしが いて… それと… …店長。 窓に 何人 うつってる？"],ex:'oops',
  nt:[["How many people ～?","「何人 〜？」。 people は 数えられる ことば"]],o:[
  ["Two. You and me.","ふたり。 ミオと ぼく。",'two',2],["…Three.","…3人。",'three',3]]},
 two:{m:["Two? …Look again. Behind me. By the shelf.","ふたり？ …もう一回 よく 見て。 わたしの うしろ。 たなの ところ。"],ex:'oops',o:[
  ["…Three.","…3人。",'three',2]]},
 three:{m:["Don't turn around. Don't turn around. If we can see it in the glass, it can see us in the glass.","ふりむかないで。 ぜったい ふりむかないで。 ガラスに うつってるって ことは、 むこうも ガラスで こっちを 見てる。"],ex:'oops',
  nt:[["Don't turn around.","「ふりむかないで」。 turn around ＝ ふりかえる"]],o:[
  ["(Turn around anyway.)","（それでも ふりむく）",'turn',2],["(Keep watching the window.)","（窓を 見つづける）",'look',3],["(Grab Mio's sleeve.)","（ミオの そでを つかむ）",'sleeve',2]]},
 sleeve:{m:["(Mio grabs your sleeve too.) …OK. On three, we both turn around. One… two…","（ミオも 店長の そでを つかむ） …いい？ 3で いっしょに ふりむくよ。 いち… にの…"],ex:'oops',
  nt:[["On three.","「3で（いっしょに）」。 タイミングを あわせる ときの 言い方"]],o:[
  ["Three!","さん！",'turn',2]]},
 turn:{m:["(Nothing. Just the shelf of cards. When you look back at the window… only two of you.) …It's gone. Did you see its face?","（なにも ない。 カードの たなだけ。 窓を 見なおすと… うつっているのは ふたりだけ） …消えた。 顔、 見た？"],ex:'oops',o:[
  ["No. Did you?","ううん。 ミオは？",'end1',2],["It was smiling.","わらってた。",'end3',2]]},
 look:{m:["(In the glass, the third person slowly raises a hand… and writes on the window, from the inside: G-O-O-D N-I-G-H-T.)","（ガラスの 中で、 3人目が ゆっくり 手を あげる… そして 内がわから 窓に 書く。 G-O-O-D N-I-G-H-T）"],ex:'oops',o:[
  ["Good night…?","おやすみ…？",'end1',3],["(Wave back.)","（手を ふりかえす）",'wave',3]]},
 wave:{m:["You WAVED BACK?! Boss! You never wave back at a ghost! That's rule number one!","手を ふりかえした？！ 店長！ おばけに 手を ふりかえしちゃ だめ！ ルール その1だよ！"],ex:'oops',
  nt:[["rule number one","「ルール その1」。 いちばん 大事な きまり"]],end:'fun'},
 end1:{m:["In the morning there was writing on the window. From the OUTSIDE. \"Good night.\" …Well, at least our ghost is polite.","朝に なったら、 窓に 字が 書いてあったの。 外がわから。 「おやすみ」。 …まあ すくなくとも、 礼儀正しい おばけだね。"],ex:'smile',
  nt:[["at least","「すくなくとも」。 わるい 中の いい ところを 言う とき"],["polite","「礼儀正しい」"]],end:'good'},
 end3:{m:["Smiling?! …Boss, don't say things like that at two in the morning! Now I can't go to the back room alone!","わらってた？！ …店長、 夜中の 2時に そういうこと 言わないで！ もう ひとりで 奥に 行けないじゃん！"],ex:'oops',end:'ok'}}},

{id:'hr_guest',cat:'kowai',sg:'ghostin',st:0,ushi:1,ico:'🎩',t:'2時の お客さん',ph:['🎩','A gentleman with no shadow','かげの ない しんし'],nodes:{
 s:{f:'🎩',m:["Good evening. Pardon me for calling so late. Might I see your cards, miss?","こんばんは。 夜分に 失礼。 カードを 見せて いただけますかな、 おじょうさん？"],
  nt:[["Might I ～?","「〜しても よろしいですか」。 May I より さらに 古風で ていねい"],["Pardon me.","「失礼」。 Excuse me の 少し 古い 言い方"]],o:[
  ["Of course. Please come in.","もちろんです。 どうぞ。",'a',2],["We're… open, I guess?","…あいてます、 たぶん。",'a',2]]},
 a:{m:["(whispering) Boss… his feet. Look at his feet. They're not touching the floor.","（ひそひそ） 店長… 足。 あの 人の 足、 見て。 ゆかに ついてない。"],ex:'oops',o:[
  ["(Pretend you didn't notice.)","（気づかない ふり）",'b',3],["Excuse me, sir… are you…?","あの… あなたは もしかして…？",'ask',2]]},
 ask:{f:'🎩',m:["Am I…? Ah. Yes, I suppose I am. Please don't be frightened. I only want to buy one card.","わたしが…？ ああ。 ええ、 そうなのでしょうな。 どうか こわがらないで。 カードを 1まい 買いたい だけです。"],
  nt:[["I suppose I am.","「そうなのでしょうね」。 suppose ＝ たぶん そうだと 思う"],["frightened","「おびえた」。 scared より かための ことば"]],o:[
  ["What card would you like?","どんな カードを？",'b',2]]},
 b:{f:'🎩',m:["My daughter loved the sea. I promised to bring her a card with a star on it for her birthday. That was in 1962. I never made it home.","むすめは 海が 大好きでしてな。 誕生日に 星の カードを もって帰ると 約束したのです。 1962年の ことです。 わたしは 家に たどりつけなかった。"],
  nt:[["I never made it home.","「家に たどりつけなかった」。 make it ＝ まにあう・たどりつく"]],o:[
  ["…I'm so sorry.","…それは… おきのどくに。",'c',3],["What happened?","なにが あったんですか？",'storm',2]]},
 storm:{f:'🎩',m:["A storm. The boat. The sea. …It doesn't matter now. What matters is the promise.","あらし。 船。 海。 …いまと なっては どうでも いい ことです。 大事なのは 約束の ほうでしてな。"],
  nt:[["What matters is ～","「大事なのは 〜だ」"]],o:[
  ["Then let's keep it.","じゃあ 約束を まもりましょう。",'c',3]]},
 c:{m:["Boss… we have one \"starlight\" card left. The very last one. …Should we give it to him?","店長… 「starlight」の カード、 1まい のこってる。 さいごの 1まい。 …あげる？"],ex:'smile',o:[
  ["Yes. Let's give it to him.","うん。 あげよう。",'d',4],["Sell it to him.","売ろう。",'sell',1]]},
 sell:{f:'🎩',m:["Of course. Here… will this do? It's the only coin I have. (He sets an old coin on the counter. It's dated 1962. It's ice-cold.)","もちろん。 これで… 足りますかな。 もっている 硬貨は これだけで。 （古い 硬貨を カウンターに 置く。 1962年。 氷みたいに つめたい）"],
  nt:[["Will this do?","「これで 足りますか・これで いいですか」"]],o:[
  ["…Keep it. The card is a gift.","…いりません。 プレゼントです。",'d',3],["Thank you, sir.","ありがとうございます。",'end2',1]]},
 d:{f:'🎩',m:["(He takes the card very gently.) Thank you. She'll be so happy. …You two, take care of each other. Some promises can't wait.","（とても そっと カードを うけとる） ありがとう。 あの子が どんなに よろこぶか。 …おふたりも、 おたがいを 大切に。 待ってくれない 約束も ありますからな。"],
  nt:[["take care of each other","「おたがいを 大切に する」"],["Some promises can't wait.","「待てない 約束も ある」。 Some ～ ＝ 「〜な ものも ある」"]],o:[
  ["Good night, sir.","おやすみなさい。",'end1',3],["Will you come back?","また 来ますか？",'end3',2]]},
 end1:{m:["(He's gone. Only the smell of the sea is left.) …Boss. I'm not scared. I'm… crying a little. That's all.","（もう いない。 海の においだけが のこった） …店長。 こわくないよ。 ちょっと… 泣いてる だけ。 それだけ。"],ex:'smile',end:'good'},
 end2:{m:["(He bows, and fades like fog.) …Boss. The coin is still cold. And it's wet. Like it came from the bottom of the sea.","（おじぎを して、 霧みたいに 消えた） …店長。 硬貨、 まだ つめたい。 それに ぬれてる。 海の 底から 来たみたいに。"],ex:'oops',end:'ok'},
 end3:{f:'🎩',m:["Perhaps. On a calm night, when the moon is full. …(He fades.) Mio: If he comes back, let's have tea ready. Two cups. No—three.","いつか。 海の おだやかな、 満月の 夜にでも。 …（消える） ミオ：「また 来たら、 お茶を 用意しとこう。 2つ。 ううん、 3つ」"],end:'good'}}},

{id:'hr_phone',cat:'kowai',sg:'phone',st:0,ico:'☎️',t:'深夜の 電話',ph:['☎️','A call from nobody','だれでもない 人からの 電話'],nodes:{
 s:{m:["(RING… RING…) The shop phone? At this hour? …Boss, you answer it.","（リリリ… リリリ…） お店の 電話？ こんな 時間に？ …店長、 出て。"],ex:'oops',o:[
  ["Hello? Shiosai card shop.","もしもし、 カードショップ しおさいです。",'a',2],["You answer it!","ミオが 出てよ！",'mio',1]]},
 mio:{m:["No way! …Fine. Let's put it on speaker. (Click.)","むり！ …わかった。 スピーカーに するね。 （カチッ）"],ex:'oops',
  nt:[["put it on speaker","「スピーカーに する」。 みんなで 聞く ために"]],o:[
  ["Hello…?","もしもし…？",'a',2]]},
 a:{f:'📞',m:["…I'm at the beach now.","…いま、 浜辺に いるの。"],
  nt:[["I'm at ～ now.","「いま 〜に いるの」。 この 手の 話の 決まり文句"]],o:[
  ["Who is this?","どちらさま？",'b',2],["Wrong number?","まちがい電話では？",'b',2]]},
 b:{f:'📞',m:["(Click. They hung up. …RING… RING…) …I'm in front of the shop now.","（ガチャ。 切れた。 …リリリ… リリリ…） …いま、 お店の 前に いるの。"],
  nt:[["hang up","「電話を 切る」。 They hung up. ＝ 切られた"]],o:[
  ["(Look at the door.)","（ドアを 見る）",'c',2],["(Unplug the phone.)","（電話線を ぬく）",'unplug',2]]},
 unplug:{m:["Good idea! …(RING… RING…) …Boss. You unplugged it. Why is it still ringing?","ナイス！ …（リリリ… リリリ…） …店長。 線、 ぬいたよね。 なんで まだ 鳴ってるの？"],ex:'oops',o:[
  ["(Answer it.)","（出る）",'c',2]]},
 c:{f:'📞',m:["…I'm right behind you.","…いま、 あなたの うしろに いるの。"],
  nt:[["right behind you","「すぐ うしろに」。 right は 「ちょうど・すぐ」"]],o:[
  ["(Turn around slowly.)","（ゆっくり ふりむく）",'d',3],["(Run!)","（にげる！）",'run',1]]},
 run:{m:["WAIT FOR ME!!! (You both run straight into the card shelf. Cards everywhere.)","まってえええ！！！ （ふたりで カードの たなに 正面から つっこむ。 カードが 散らばる）"],ex:'oops',end:'fun'},
 d:{f:'🦜',m:["BEHIND YOU! BEHIND YOU! SQUAWK!","うしろだよ！ うしろだよ！ ギャーッ！"],o:[
  ["PIP?!","ピップ？！",'pip',2]]},
 pip:{m:["Pip! Nora's parrot! How did you get in here?! …And you were pressing the phone buttons with your beak, weren't you?","ピップ！ ノラさんの オウム！ どこから 入ったの？！ …それに、 くちばしで 電話の ボタン おしてたでしょ！"],ex:'laugh',o:[
  ["Mystery solved.","なぞは とけた。",'end1',2],["Who taught you that line?","その セリフ、 だれに ならったの？",'end2',3]]},
 end1:{m:["Mystery solved! …I'm telling Nora. And I'm buying a lock for that window.","なぞは とけた！ …ノラさんに 言いつけよう。 それと 窓に かぎ 買う。"],ex:'laugh',
  nt:[["Mystery solved!","「なぞは とけた！」"]],end:'fun'},
 end2:{f:'🦜',m:["The lady on the pier! The lady on the pier! …I'm at the beach now. (Pip just tilts his head.) Mio: …Pip. Who is the lady on the pier?","さんばしの 女の人！ さんばしの 女の人！ …いま、 浜辺に いるの。 （ピップは 首を かしげるだけ） ミオ：「…ピップ。 さんばしの 女の人って だれ？」"],end:'good'}}},

{id:'hr_doll',cat:'kowai',sg:'doll',st:0,ico:'🎎',t:'売り物じゃない 人形',ph:['🎎','A doll that keeps coming back','もどってくる 人形'],nodes:{
 s:{m:["Boss, did you put that doll on the shelf? The one in the red kimono?","店長、 あの 人形、 たなに 置いた？ 赤い 着物の。"],ex:'oops',o:[
  ["No. Did you?","ううん。 ミオは？",'a',2],["It's cute.","かわいいね。",'cute',1]]},
 cute:{m:["Cute? …It wasn't there this morning. And an hour ago, it was facing the wall.","かわいい？ …けさは なかったよ。 それに 1時間 前は かべの ほうを 向いてた。"],ex:'oops',o:[
  ["…That's not cute anymore.","…もう かわいくない。",'a',2]]},
 a:{m:["I moved it to the back room an hour ago. Now it's on the top shelf again. Facing us.","1時間 前に 奥の 部屋に うつしたの。 なのに また いちばん 上の たなに いる。 こっちを 向いて。"],ex:'oops',
  nt:[["facing ～","「〜の ほうを 向いて」"]],o:[
  ["Let's put it in a box.","箱に しまおう。",'box',2],["Maybe a customer wants it.","お客さんが ほしがるかも。",'sell',1],["Let's talk to it.","話しかけて みよう。",'talk',3]]},
 sell:{m:["A customer? At 2 a.m.? …You know what, let's put a price tag on it. If someone buys it, it's their problem! …Oh no. It's frowning.","お客さん？ 夜中の 2時に？ …いいよ、 値札 つけちゃおう。 だれかが 買ったら その人の 問題！ …え、 まって。 まゆが よってる。"],ex:'oops',
  nt:[["It's their problem.","「それは その人の 問題」"],["frown","「顔を しかめる」"]],o:[
  ["Sorry, Miss Doll.","ごめんなさい、 お人形さん。",'talk',2]]},
 box:{m:["(You put it in a box and tape it shut.) …There. Done. (Knock. Knock. Knock. From inside the box.)","（箱に 入れて テープで とめる） …よし。 おしまい。 （コン。 コン。 コン。 箱の 中から）"],ex:'oops',o:[
  ["(Open the box.)","（箱を あける）",'talk',2],["(Add more tape.)","（もっと テープを まく）",'end2',1]]},
 talk:{m:["TALK to it? …OK. Um. Excuse me, Miss Doll. Are you… lost? (The doll's head tilts. Just a little.)","話しかける？ …わかった。 えっと。 すみません、 お人形さん。 …まいごですか？ （人形の 首が かたむく。 ほんの 少し）"],ex:'oops',
  nt:[["Are you lost?","「まいごですか？」。 道に まよった 人にも"]],o:[
  ["Where is your home?","おうちは どこ？",'home',3]]},
 home:{f:'🎎',m:["…The shrine… on the cape…","…みさきの… ほこら…"],
  nt:[["shrine","「神社・ほこら」"],["cape","「岬」。 浜辺の 左はしの 岬にも ペンションが あるね"]],o:[
  ["We'll take you back tomorrow.","あした つれて帰って あげるね。",'end1',4],["Tonight. Let's go now.","今夜。 いますぐ 行こう。",'end3',2]]},
 end1:{m:["The next morning, we took her to the little shrine on the cape. When we set her down, every wind chime rang at once. …I think she said thank you.","つぎの 朝、 岬の 小さな ほこらに つれて行ったの。 そっと 置いたら、 風鈴が いっせいに 鳴った。 …ありがとうって 言ったんだと 思う。"],ex:'smile',
  nt:[["wind chime","「風鈴」"],["at once","「いっせいに・同時に」"]],end:'good'},
 end2:{m:["(Tape. More tape. ALL the tape.) …Boss, we're out of tape. And the knocking stopped. …Is that good or bad?","（テープ。 もっと テープ。 ありったけの テープ） …店長、 テープ なくなった。 それに ノックが やんだ。 …いいこと？ わるいこと？"],ex:'oops',
  nt:[["We're out of ～.","「〜が きれた・なくなった」"]],end:'fun'},
 end3:{m:["Now?! To the CAPE?! …Fine. But you carry the doll. And I'm holding your sleeve. Don't you dare let go.","いま？！ 岬まで？！ …いいよ。 でも 人形は 店長が もって。 わたしは 店長の そでを もつ。 ぜったい はなさないでよ。"],ex:'smile',
  nt:[["Don't you dare ～.","「ぜったい 〜しないでよ」。 強い 「だめ」"]],end:'good'}}},

/* ---------------------------------------------------------------- 📜 うんちく */
{id:'hr_ouija',cat:'unk',sg:'cardfall',st:0,ico:'🔤',t:'ウィジャボード',ph:['🔤','B-E-H-I-N-D','う・し・ろ'],nodes:{
 s:{m:["Boss, a customer sold us this old board today. Letters, numbers, YES and NO… what is it?","店長、 きょう お客さんが この 古い 板を 売りに 来たの。 アルファベットと 数字と YESと NO… これ なに？"],ex:'smile',o:[
  ["It's a Ouija board.","ウィジャボードだよ。",'a',3],["A game board?","ボードゲーム？",'a',1]]},
 a:{m:["A Ouija board! Like kokkuri-san! You put your fingers on this little heart-shaped piece and ask the spirits questions.","ウィジャボード！ こっくりさん みたいな やつ！ この ハートの 形の 小さな 板に 指を のせて、 霊に しつもんするの。"],ex:'wink',
  nt:[["Ouija board","「ウィジャボード」。 アメリカで 1890年ごろに 売り出された、 こっくりさんに にた 遊び"],["planchette","指を のせる 小さな 板。 フランス語で 「小さな 板」"]],o:[
  ["Let's try it.","やってみよう。",'b',2],["Let's not.","やめとこう。",'not',1]]},
 not:{m:["Aw, come on. Just one question! For English practice! I'm sure the spirits speak English.","えー、 いいじゃん。 1問だけ！ 英語の 練習！ 霊も 英語 話せるって。"],ex:'wink',o:[
  ["…One question.","…1問だけね。",'b',2]]},
 b:{m:["OK, fingers on. …Spirit, are you there? (The piece slides slowly… to YES.)","じゃあ 指を のせて。 …霊さん、 いますか？ （板が ゆっくり すべって… YESへ）"],ex:'oops',o:[
  ["You moved it.","ミオが 動かしたでしょ。",'moved',2],["Ask it something.","なにか 聞いて。",'c',2]]},
 moved:{m:["I did NOT! My fingers are barely touching it! …YOU moved it!","動かしてない！ 指、 ほとんど ふれてないもん！ …店長でしょ！"],ex:'oops',
  nt:[["barely","「ほとんど 〜ない・かろうじて」"]],o:[
  ["Ask it something.","なにか 聞いて。",'c',2]]},
 c:{m:["Um… Spirit, what is your name? (It moves: P… I… P…)","えっと… 霊さん、 お名前は？ （板が うごく。 P… I… P…）"],ex:'oops',o:[
  ["Pip?","ピップ？",'pip',2],["Keep going.","つづけて。",'d',3]]},
 pip:{m:["Pip? The PARROT? Pip isn't a spirit. Pip is very much alive. And very loud.","ピップ？ あの オウムの？ ピップは 霊じゃ ないよ。 ピンピン してる。 しかも うるさい。"],ex:'laugh',o:[
  ["Pip, is that you?","ピップ、 きみなの？",'endp',1],["Ask another question.","べつの こと 聞こう。",'d',2]]},
 endp:{m:["(The piece moves: Y-E-S. S-Q-U-A-W-K.) …I'm telling Nora.","（板が うごく。 Y-E-S。 S-Q-U-A-W-K（ギャー）） …ノラさんに 言いつけよう。"],ex:'laugh',end:'fun'},
 d:{m:["Spirit… is anyone else here with us tonight? (YES. Then: B… E… H… I… N… D.)","霊さん… 今夜、 わたしたちの ほかに だれか いますか？ （YES。 それから B… E… H… I… N… D）"],ex:'oops',o:[
  ["(Look behind you.)","（うしろを 見る）",'end3',2],["(Close the session properly.)","（ちゃんと おわりに する）",'close',3]]},
 close:{m:["(You both slide the piece to GOOD BYE.) Thank you, spirit. Good-bye! …You always have to say good-bye properly. That's the most important rule.","（ふたりで 板を GOOD BYE へ） ありがとう、 霊さん。 さようなら！ …ちゃんと さよならを 言わなきゃ だめなの。 いちばん 大事な おやくそく。"],ex:'smile',
  nt:[["say good-bye properly","「ちゃんと さよならを 言う」。 ウィジャボードの おやくそくと されている"],["good-bye","もとは God be with ye（神が あなたと ともに）が ちぢんだ ことば"]],end:'good'},
 end3:{m:["(A card falls from the shelf behind you. It lands face-up: \"behind.\") …Boss. We're closing early tonight.","（うしろの たなから カードが 1まい 落ちる。 表に なった ことばは 「behind（うしろ）」） …店長。 今夜は もう 店じまい。"],ex:'oops',end:'ok'}}},

{id:'hr_witch',cat:'unk',sg:'bell',st:0,ico:'🕑',t:'丑三つ時',ph:['☕','Three cups on the counter','カウンターに カップが 3つ'],nodes:{
 s:{m:["(Somewhere, a clock strikes two. Dong… dong…) Boss, it's 2 a.m. In Japan they call this ushimitsu-doki.","（どこかで 時計が 2つ 鳴る。 ボーン… ボーン…） 店長、 2時だよ。 日本では 「丑三つ時」って 言うんだよね。"],ex:'smile',
  nt:[["strike two","「（時計が） 2時を 打つ」"]],o:[
  ["What does it mean?","どういう いみ？",'a',2],["The hour of ghosts.","おばけの 時間。",'a',3]]},
 a:{m:["Long ago, the night was named after animals. Ushi is the ox. The hour of the ox, about 1 to 3 a.m., was split into four parts. Mitsu, the third part, is about 2:00 to 2:30.","むかしは 時間に 動物の 名前が ついてたの。 丑は ウシ。 丑の 刻（夜中の 1時〜3時 くらい）を 4つに わけて、 その 3つ目が 「丑三つ」。 だいたい 2時〜2時半。"],ex:'wink',
  nt:[["the hour of the ox","「丑の 刻」"],["split into four parts","「4つに わける」"]],o:[
  ["Is there an English word for it?","英語でも 言い方 ある？",'b',3],["Why are ghosts busy then?","なんで その 時間に おばけが 出るの？",'why',2]]},
 why:{m:["People said it's when the door between our world and theirs opens. Everyone is asleep. It's the quietest time of the night.","この世と あの世の とびらが ひらく 時間って 言われてたの。 みんな ねてて、 夜で いちばん しずかな 時間。"],ex:'smile',o:[
  ["Is there an English word?","英語でも ある？",'b',2]]},
 b:{m:["Yes! \"The witching hour.\" Shakespeare used it in Hamlet: \"'Tis now the very witching time of night, when churchyards yawn.\"","あるよ！ 「the witching hour（魔女の 時間）」。 シェイクスピアの 『ハムレット』にも 出てくる。 「いまこそ 魔の 夜ふけ、 墓場が あくびを する ころ」"],ex:'laugh',
  nt:[["the witching hour","「魔女の 時間」＝ 真夜中。 いまは 「赤ちゃんが よく 泣く 夕方」の いみでも 使う"],["'Tis","It is の 古い 形"],["churchyard","教会の 墓地。 yawn（あくびを する）は ここでは 墓が 「口を あける」"]],o:[
  ["Shakespeare is scary.","シェイクスピア、 こわい。",'c',2],["Churchyards yawn?","墓場が あくび？",'c',3]]},
 c:{m:["Graves opening their mouths… like yawning. Creepy, but kind of beautiful, right? …(yawn) Oh. Speaking of yawning…","墓が 口を あける… あくび みたいに。 こわいけど ちょっと きれいじゃない？ …（ふわぁ） あ。 あくびと 言えば…"],ex:'sleepy',
  nt:[["Speaking of ～","「〜と 言えば」。 話を つなげる ときの 便利な ことば"]],o:[
  ["You're sleepy.","ねむいんだね。",'end1',2],["That's what the ghosts want.","それが おばけの ねらいだよ。",'end2',2],["Want some coffee?","コーヒー いる？",'end3',3]]},
 end1:{m:["Me? No. The ghosts are sleepy. I'm just… resting my eyes…","わたし？ ちがうよ。 ねむいのは おばけ。 わたしは… 目を… やすめてる だけ…"],ex:'sleepy',
  nt:[["I'm just resting my eyes.","「目を やすめてる だけ」。 ねむい 人の 定番の 言いわけ"]],end:'good'},
 end2:{m:["Don't say that! Now I'm wide awake. Thanks a lot, boss.","そういうこと 言わないで！ 目が ぱっちり さめちゃった。 どうも ありがとね、 店長。"],ex:'oops',
  nt:[["wide awake","「ぱっちり 目が さめて」"],["Thanks a lot.","ここでは 皮肉。 「どうも ありがとね（むっ）」"]],end:'fun'},
 end3:{m:["Yes, please. Two sugars. …Wait. Why are there THREE cups on the counter? Did you…? No? …I'll drink fast.","うん、 おねがい。 さとう 2つ。 …まって。 なんで カウンターに カップが 3つ あるの？ 店長が…？ ちがう？ …はやく 飲もう。"],ex:'oops',end:'good'}}},

{id:'hr_grave',cat:'unk',sg:'yawn',st:0,ico:'🌙',t:'深夜勤務の 英語',ph:['🦉','Two night owls','夜ふかしの ふたり'],nodes:{
 s:{m:["(yawn) Working at midnight is hard. My friend says I'm on the \"graveyard shift.\" That sounds so scary!","（ふわぁ） 夜中の 仕事って たいへん。 友だちが、 わたしは 「graveyard shift（墓場シフト）」だって。 こわい 名前！"],ex:'sleepy',o:[
  ["It just means the night shift.","夜の 仕事って いみだよ。",'a',3],["Are we working in a graveyard?","ここ、 墓場なの？",'a',1]]},
 a:{m:["Right. It's the shift from about midnight to 8 a.m. But why \"graveyard\"?","そう。 だいたい 夜中の 0時から 朝8時までの 仕事。 でも なんで 「墓場」なの？"],ex:'smile',o:[
  ["Because it's as quiet as a graveyard.","墓場みたいに しずかだから。",'b',3],["Because of zombies.","ゾンビの せい。",'zomb',1]]},
 zomb:{m:["Zombie customers? \"One card, please… and brains… also brains.\" Ha ha! No!","ゾンビの お客さん？ 「カード 1まい… あと 脳みそ… 脳みそも」 あはは！ ないない！"],ex:'laugh',o:[
  ["Then why?","じゃあ なんで？",'b',2]]},
 b:{m:["Most dictionaries say it's because the night is quiet and lonely, like a graveyard. There's a famous story about bells on coffins, too… but that one is a myth.","たいていの 辞書は、 夜が 墓場みたいに しずかで さみしいから って 書いてる。 ひつぎに 鈴を つけた っていう 有名な 話も あるけど… それは 作り話なんだって。"],ex:'smile',
  nt:[["graveyard shift","「深夜勤務」。 だいたい 0時〜8時の 仕事"],["myth","「作り話・俗説」。 「生きうめを 見はる ため ひつぎに 鈴を つけた」は ほんとうでは ないと 言われている"]],o:[
  ["What other night words do you know?","ほかに 夜の ことば 知ってる？",'c',3],["So we're night owls.","つまり ふたりとも 夜ふかしだね。",'owl',3]]},
 owl:{m:["Night owls! People who like staying up late. People who wake up early are \"early birds.\" …I'm a night owl at work and a sleepyhead at home.","night owl！ 夜ふかしが 好きな 人。 早起きの 人は 「early bird」。 …わたしは 仕事では フクロウで、 家では ねぼすけ。"],ex:'laugh',
  nt:[["night owl","「夜型の 人」。 owl ＝ フクロウ"],["early bird","「早起きの 人」。 The early bird catches the worm.（早起きは 三文の 徳）"],["sleepyhead","「ねぼすけ」"]],o:[
  ["Me too.","ぼくも。",'end1',2]]},
 c:{m:["\"Burn the midnight oil\"—to study or work late at night. Long ago people used oil lamps, so staying up meant burning oil.","「burn the midnight oil（真夜中の 油を もやす）」。 夜おそくまで 勉強や 仕事を する こと。 むかしは 油の ランプだった からね。"],ex:'wink',
  nt:[["burn the midnight oil","「夜おそくまで がんばる」"]],o:[
  ["Like you, studying English.","英語を 勉強してる ミオ みたいに。",'end1',3],["Like me, right now.","いまの ぼく みたいに。",'end2',2]]},
 end1:{m:["Ha ha, yes! Let's be night owls together. …But not every night. I need my beauty sleep.","あはは、 そうだね！ いっしょに フクロウに なろう。 …でも 毎晩は むり。 美容の ための ねむりが ひつようなの。"],ex:'laugh',
  nt:[["beauty sleep","「美容の ための ねむり」。 夜 しっかり ねる こと"]],end:'good'},
 end2:{m:["Right now you're burning the midnight… cocoa. That's cocoa. You're just drinking cocoa.","いまの 店長が もやしてるのは 真夜中の… ココア。 それ ココアだよね。 ココア 飲んでる だけ。"],ex:'laugh',end:'fun'}}},

{id:'hr_hundred',cat:'unk',sg:'candle',st:0,cdl:1,ico:'🕯️',t:'百物語',ph:['🕯️','A third breath in the dark','やみの 中の 3人目の 息'],nodes:{
 s:{m:["A candle? Oh! Do you know hyaku-monogatari? A hundred ghost stories and a hundred candles.","ろうそく？ あ！ 「百物語」って 知ってる？ 100の こわい 話と、 100本の ろうそく。"],ex:'smile',o:[
  ["Tell me.","教えて。",'a',2]]},
 a:{m:["In the Edo period, people gathered at night and lit a hundred candles. After each scary story, they blew one out. When the last one went out… a real ghost would appear.","江戸時代、 夜に みんなで 集まって ろうそくを 100本 ともしたの。 こわい 話を 1つ するごとに 1本 ふき消す。 さいごの 1本が 消えると… ほんものの おばけが 出るって。"],ex:'oops',
  nt:[["blow out","「（火を） ふき消す」。 過去形は blew out"],["the Edo period","「江戸時代」。 period ＝ 時代"]],o:[
  ["Did anyone ever finish?","さいごまで やった 人は いるの？",'b',3],["Let's try it.","やってみよう。",'try',1]]},
 try:{m:["A hundred stories? We'd be here until next week! And we only have one candle anyway.","100話？ 来週まで おわらないよ！ それに ろうそく 1本しか ないし。"],ex:'laugh',o:[
  ["Did anyone ever finish?","さいごまで やった 人は？",'b',2]]},
 b:{m:["People say most groups stopped at ninety-nine. Just to be safe. …Smart people.","たいてい 99話で やめたって 言われてるの。 念のため。 …かしこい。"],ex:'wink',
  nt:[["just to be safe","「念のため」"]],o:[
  ["Is there something like that in English?","英語にも にたもの ある？",'c',3]]},
 c:{m:["Ghost stories around a campfire! Kids do it at summer camp, with a flashlight under their chin. They're called \"campfire stories.\"","キャンプファイヤーで する こわい 話！ サマーキャンプで 子どもたちが、 あごの 下から 懐中電灯で 顔を てらして 話すの。 「campfire story」って いうよ。"],ex:'laugh',
  nt:[["campfire story","キャンプファイヤーを かこんで する こわい 話"],["under your chin","「あごの 下に」。 下から 光を あてると 顔が こわく 見える"]],o:[
  ["Like this? (Hold the candle under your chin.)","こう？ （ろうそくを あごの 下に）",'end1',2],["Let's blow it out together.","いっしょに ふき消そう。",'blow',3]]},
 blow:{m:["Together? OK. One, two… (whoosh). …(In the dark, a third breath blows from somewhere behind you.) …Boss. That wasn't you, was it?","いっしょに？ うん。 いち、 にの… （ふっ） …（まっくらな 中、 うしろの どこかから 3人目の 息が ふうっと） …店長。 いまの、 店長じゃ ないよね？"],ex:'oops',end:'good'},
 end1:{m:["KYAA! Your face! Don't do that! You look like the ghost of a very tired shop owner!","きゃあ！ 顔！ やめて！ すっごく つかれた 店長の おばけ みたい！"],ex:'laugh',end:'fun'}}},

/* ---------------------------------------------------------------- 😂 おもしろ */
{id:'hr_boo',cat:'fun',sg:'sheet',st:0,ico:'👻',t:'おばけ ミオ',ph:['👻','A ghost in sneakers','スニーカーの おばけ'],nodes:{
 s:{f:'👻',m:["Boooo! I am the ghost of the card shop! Give me… your rarest card!","ばあ〜〜！ わたしは カードショップの おばけ！ いちばん レアな カードを… よこせえ〜！"],o:[
  ["Mio, I can see your shoes.","ミオ、 くつ 見えてる。",'a',3],["AAAH! A ghost!","うわあ！ おばけ！",'scared',2],["Here. (Hand over a common card.)","はい。 （ふつうの カードを わたす）",'card',2]]},
 a:{f:'👻',m:["…What shoes? Ghosts don't wear shoes. These are… ghost shoes. Boo.","…くつ？ おばけは くつ はかないよ。 これは… おばけの くつ。 ばあ。"],o:[
  ["Your apron is showing too.","エプロンも 見えてる。",'b',2]]},
 scared:{f:'👻',m:["Ha ha ha! Got you! It's me! …Wait, were you really scared? Or were you pretending?","あはは！ ひっかかった！ わたし！ …え、 ほんとに こわかった？ それとも ふり？"],
  nt:[["Got you!","「ひっかかった！」。 Gotcha! とも 書く"]],o:[
  ["I was really scared.","ほんとに こわかった。",'b',2],["I was pretending.","ふり だよ。",'b',2]]},
 card:{f:'👻',m:["A COMMON card?! The ghost is insulted! Boo-hoo!","ふつうの カード？！ おばけは きずついた！ えーん！"],
  nt:[["boo-hoo","「えーん」。 泣き声。 Boo! は おどかす 声"]],o:[
  ["Is the ghost crying?","おばけ、 泣いてる？",'b',2]]},
 b:{m:["(She pulls off the sheet.) Ta-da! Did you know? \"Boo!\" is what English speakers say to scare someone. And a person who's scared of everything is a \"scaredy-cat.\"","（シーツを ばさっと とる） じゃーん！ 知ってた？ 英語で 人を おどかす ときは 「Boo!」。 それに なんでも こわがる 人は 「scaredy-cat（こわがりネコ）」。"],ex:'laugh',
  nt:[["Boo!","「ばあ！」。 人を おどかす ときの 声"],["scaredy-cat","「こわがり」。 子どもが よく 使う"]],o:[
  ["You're the scaredy-cat.","こわがりは ミオでしょ。",'c',3],["Now it's my turn.","じゃあ つぎは ぼくの ばん。",'turn',2]]},
 c:{m:["Me?! I'm a brave ghost! …OK. I made the costume because I was too scared to go to the back room alone. Happy now?","わたし？！ 勇かんな おばけだよ！ …うん。 ひとりで 奥に 行くのが こわくて、 おばけに なったの。 これで まんぞく？"],ex:'oops',o:[
  ["Very happy.","とっても。",'end1',2],["Next time, I'll come with you.","つぎは いっしょに 行くよ。",'end1',3]]},
 turn:{m:["Your turn? OK, I'll close my eyes. …Ready? …Boss? …(silence) …BOSS?! Where did you go?!","店長の ばん？ いいよ、 目を とじるね。 …いい？ …店長？ …（しーん） …店長？！ どこ 行ったの？！"],ex:'oops',o:[
  ["BOO!","ばあ！",'end2',2]]},
 end1:{m:["…Yes. Please. Ghosts work better in pairs. (She folds the sheet into a tiny square and hides it under the counter.)","…うん。 おねがい。 おばけは ふたり組の ほうが いいの。 （シーツを 小さく たたんで カウンターの 下に かくす）"],ex:'smile',end:'good'},
 end2:{m:["KYAAAA!!! …You scared the living daylights out of me!","きゃあああ！！！ …心臓 止まるかと 思った！"],ex:'oops',
  nt:[["scare the living daylights out of ～","「〜を ものすごく こわがらせる」"]],end:'fun'}}},

{id:'hr_dream',cat:'fun',sg:'doze',st:1,ico:'😴',t:'ミオの こわい 夢',ph:['📚','A dictionary that chases you','追いかけてくる 辞書'],nodes:{
 s:{m:["(She's dozing at the counter. Suddenly—) …No… don't go in there… NO! (She wakes up with a jump.)","（カウンターで うとうと していた ミオが とつぜん—） …だめ… そこに 入っちゃ… だめ！ （びくっと 起きる）"],ex:'oops',o:[
  ["Mio! Are you OK?","ミオ！ だいじょうぶ？",'a',3],["Bad dream?","こわい 夢？",'a',3]]},
 a:{m:["…Boss? Oh… it was a dream. I had a nightmare. I was alone in a huge library, and all the books were whispering in English I couldn't understand.","…店長？ あ… 夢か。 こわい 夢 見たの。 大きな 図書館に ひとりで いて、 本が ぜんぶ わからない 英語で ささやいてるの。"],ex:'oops',
  nt:[["I had a nightmare.","「こわい 夢を 見た」。 have a dream と 同じ 形"]],o:[
  ["That sounds scary.","こわそう。",'b',2],["That's my nightmare too.","それ、 ぼくにも こわい 夢だ。",'b',3]]},
 b:{m:["And then a giant dictionary chased me! It kept shouting irregular verbs! \"GO! WENT! GONE!\"","それで 大きな 辞書が 追いかけてきたの！ 不規則動詞を さけびながら！ 「GO！ WENT！ GONE！」"],ex:'laugh',
  nt:[["irregular verbs","「不規則動詞」。 go - went - gone のように 形が かわる 動詞"]],o:[
  ["Ha ha! A student's nightmare.","あはは！ 学生の 悪夢だ。",'c',2],["Did it catch you?","つかまったの？",'c',2]]},
 c:{m:["Almost! …It's silly now. But my heart is still pounding.","あぶなかった！ …いま 思えば ばかみたい。 でも まだ 心臓が ドキドキ してる。"],ex:'smile',
  nt:[["My heart is pounding.","「心臓が ドキドキ している」"]],o:[
  ["It was just a dream.","ただの 夢だよ。",'end1',2],["Want some warm milk?","あったかい ミルク いる？",'end2',3],["Run, Mio! Ran! Run!","にげて ミオ！ ラン！ ラン！",'end3',1]]},
 end1:{m:["…Just a dream. Yeah. Thanks, boss. Funny—when you say it, I actually believe it.","…ただの 夢。 うん。 ありがと、 店長。 ふしぎ。 店長が 言うと ほんとに そう 思える。"],ex:'smile',
  nt:[["It was just a dream.","「ただの 夢だよ」。 こわい 夢を 見た 人への 定番の ことば"]],end:'good'},
 end2:{m:["Warm milk… yes, please. My grandma always made it for me after a bad dream. …You're kind of like my grandma. In a good way!","あったかい ミルク… うん、 ほしい。 こわい 夢の あと、 おばあちゃんが いつも 作ってくれたの。 …店長って ちょっと おばあちゃん みたい。 いい いみで！"],ex:'laugh',end:'good'},
 end3:{m:["Run, ran, run! You know your irregular verbs! The dictionary would be proud. …Now I'll dream about YOU chasing me.","ラン・ラン・ラン！ 不規則動詞、 完ぺき！ 辞書も よろこぶよ。 …こんどは 店長に 追いかけられる 夢 見そう。"],ex:'laugh',end:'fun'}}},

/* ---------------------------------------------------------------- 💓 ドキドキ（えらばなかった 人の 分は 出ない） */
{id:'hr_blackout',cat:'doki',dk:1,sg:'blackout',st:2,ico:'💡',t:'停電',ph:['💡','Two hands in the dark','やみの 中の ふたつの 手'],nodes:{
 s:{m:["(Click. Every light in the shop goes out.) …B-boss? Are you there? I can't see anything!","（カチッ。 お店の 電気が ぜんぶ 消える） …て、 店長？ いる？ なにも 見えない！"],ex:'oops',o:[
  ["I'm here. Don't move.","ここに いるよ。 うごかないで。",'a',3],["Boo.","ばあ。",'boo',1]]},
 boo:{m:["KYAAA! …That's not funny! Where are you?!","きゃああ！ …おもしろく ない！ どこ？！"],ex:'oops',o:[
  ["Sorry. I'm right here.","ごめん。 すぐ ここ。",'a',2]]},
 a:{m:["Where's \"here\"? …(Her hand bumps into yours in the dark.) Oh! Is this… your hand?","「ここ」って どこ？ …（くらやみで ミオの 手が 店長の 手に ぶつかる） あ！ これ… 手？"],ex:'oops',p:'cheeks',o:[
  ["Yes. Hold on.","うん。 つかまって。",'b',3],["No.","ちがう。",'no',1]]},
 no:{m:["N-NO?! Then whose hand is it?! …Wait, it's warm. It IS your hand! Don't joke like that!","ち、 ちがう？！ じゃあ だれの 手？！ …まって、 あったかい。 店長の 手じゃん！ そういう じょうだん やめて！"],ex:'oops',o:[
  ["Sorry. Hold on.","ごめん。 つかまって。",'b',2]]},
 b:{m:["(She holds your hand tightly.) …OK. I'm holding on. Where's the flashlight? …Actually, let's just wait. My legs aren't working.","（ぎゅっと 手を にぎる） …うん。 つかまってる。 懐中電灯 どこ？ …やっぱり 待とう。 足が うごかない。"],ex:'oops',p:'cheeks',
  nt:[["hold on","「つかまる・はなさない」。 Hold on! だけだと 「ちょっと 待って」"]],o:[
  ["Take your time.","ゆっくりで いいよ。",'c',3],["The flashlight is in the drawer.","懐中電灯は ひきだしだよ。",'c',2]]},
 c:{m:["(In the dark, the only sounds are the sea… and a heartbeat.) …Boss, your heart is beating so fast. …Or is that mine?","（くらやみの 中、 聞こえるのは 波の 音と… 心臓の 音） …店長、 心臓 すごく はやい。 …それとも わたしの？"],ex:'smile',p:'cheeks',o:[
  ["It's mine.","ぼくのだよ。",'end1',4],["It's yours.","ミオのだよ。",'end2',2],["It's the ghost's.","おばけの。",'end3',1]]},
 end1:{m:["(The lights come back on. You're still holding hands. She lets go very, very slowly.) …The power's back. …Too bad. I mean—good! GOOD!","（電気が つく。 まだ 手を つないだまま。 ミオが ゆっくり ゆっくり 手を はなす） …電気、 もどったね。 …ざんねん。 じゃなくて— よかった！ よかった！"],ex:'oops',p:'cheeks',
  nt:[["The power's back.","「電気が もどった」。 power ＝ 電気（電力）"]],end:'good'},
 end2:{m:["Mine?! It's… the dark! The dark makes hearts beat faster! It's science! …(She doesn't let go until the lights come back.)","わたしの？！ それは… くらい から！ くらいと 心臓が はやく なるの！ 科学だよ！ …（電気が つくまで 手を はなさなかった）"],ex:'oops',p:'cheeks',end:'good'},
 end3:{m:["Ghosts don't HAVE hearts! …Do they? Now I'm scared AND confused.","おばけに 心臓 ないでしょ！ …あるの？ こわいし わけ わかんないし。"],ex:'oops',end:'fun'}}},

{id:'hr_test',cat:'doki',dk:1,sg:'steps',st:3,ico:'🏮',t:'夜の 肝試し',ph:['🏳️','The lady on the pier (a towel)','さんばしの 女の人（タオル）'],nodes:{
 s:{m:["Did you hear footsteps on the roof? …Never mind. Hey, boss, let's do a test of courage tonight! To the end of the old pier and back. The loser buys ice cream.","屋根の 足音、 聞こえた？ …まあ いいや。 ねえ 店長、 今夜 肝試し しよう！ 古い 桟橋の 先まで 行って もどる。 負けたほうが アイス おごり。"],ex:'wink',
  nt:[["test of courage","「肝試し」。 英語圏では あまり ない 遊びなので、 説明する ときの 言い方"]],o:[
  ["You're on.","その 勝負、 のった。",'a',3],["You're scared, aren't you?","ほんとは こわいんでしょ？",'scared',2]]},
 scared:{m:["Me? Scared? Of a dark pier with a ghost lady? Ha ha! …Maybe. That's why YOU are coming.","わたし？ こわい？ 女の おばけが 出る まっくらな 桟橋が？ あはは！ …ちょっとね。 だから 店長も 来るの。"],ex:'oops',o:[
  ["OK. Let's go.","わかった。 行こう。",'a',2]]},
 a:{m:["(Outside, the beach is pitch-black. The waves sound louder at night.) …It's so dark. I can't even see my own feet.","（外は まっくら。 夜の 波は 音が 大きい） …くらすぎ。 自分の 足も 見えない。"],ex:'oops',
  nt:[["You're on.","「その 勝負 のった」"],["pitch-black","「まっくら」"]],o:[
  ["Stay close to me.","そばに いて。",'b',3],["Race you to the pier!","桟橋まで 競争！",'race',1]]},
 race:{m:["Don't you dare run! …Boss! WAIT! (She catches up and grabs your sleeve.)","はしったら ゆるさない！ …店長！ まって！ （追いついて そでを つかむ）"],ex:'oops',o:[
  ["Sorry, sorry.","ごめん ごめん。",'b',2]]},
 b:{m:["(She holds your sleeve.) This doesn't count. Holding a sleeve is not holding hands. It's… navigation.","（そでを つかんだまま） これは ノーカンだからね。 そでを もつのは 手を つなぐのとは ちがう。 これは… 道案内。"],ex:'smile',p:'cheeks',
  nt:[["It doesn't count.","「それは 数に 入らない（ノーカン）」"]],o:[
  ["Of course. Navigation.","もちろん。 道案内ね。",'c',2],["You can hold my hand.","手、 にぎって いいよ。",'hand',4]]},
 hand:{m:["…! (A long pause. Then her fingers slip from your sleeve into your hand.) …Only for navigation.","…！ （ながい 間。 それから 指が そでから 手の 中へ すべりこむ） …道案内の ため だけ。"],ex:'smile',p:'cheeks',o:[
  ["Only for navigation.","道案内の ため だけ。",'c',3]]},
 c:{m:["(At the end of the pier, something white flutters in the wind.) …Boss. There. At the end. A woman in white…","（桟橋の 先で、 白い なにかが 風に ゆれている） …店長。 あそこ。 先っぽ。 白い 服の 女の人…"],ex:'oops',o:[
  ["(Walk closer.)","（近づく）",'d',3],["(Run back with Mio.)","（ミオと にげる）",'end3',2]]},
 d:{m:["(It's… a white towel on the railing. Someone forgot it.) …A TOWEL. I almost died because of a TOWEL.","（それは… 手すりに かかった 白い タオル。 だれかの わすれもの） …タオル。 タオルで 死ぬかと 思った。"],ex:'laugh',o:[
  ["You were brave.","ミオ、 勇かんだったよ。",'end1',3],["You owe me ice cream.","アイス おごりね。",'end2',2]]},
 end1:{m:["I was, wasn't I? …Because you were next to me. (She doesn't let go all the way back.)","でしょ？ …店長が となりに いたから。 （帰り道、 ずっと はなさなかった）"],ex:'smile',p:'cheeks',end:'good'},
 end2:{m:["WHAT? I didn't lose! The towel cheated! …Fine. One ice cream. And we share it.","なんで？ 負けてない！ タオルが ずるい！ …いいよ。 アイス 1こ。 はんぶんこ ね。"],ex:'laugh',
  nt:[["You owe me ～.","「〜 おごりね・〜 かしが ある」"]],end:'fun'},
 end3:{m:["(You both run back to the shop, laughing.) We… both… ran! So it's a tie! Nobody buys ice cream! …Or we both buy one for each other.","（ふたりで わらいながら お店まで にげかえる） ふたりとも… にげた！ だから 引き分け！ アイスは なし！ …それか、 おたがいに 1こずつ。"],ex:'laugh',
  nt:[["It's a tie.","「引き分け」"]],end:'good'}}},

{id:'hr_cling',cat:'doki',dk:1,sg:'knock',st:4,ico:'🫣',t:'こわがりな 店長',ph:['🦋','Just a big moth','ただの 大きな ガ'],nodes:{
 s:{m:["(Tap… tap… tap. Something is tapping on the window.) …Boss? You're hiding behind me.","（コツ… コツ… コツ。 なにかが 窓を たたいている） …店長？ わたしの うしろに かくれてるよね。"],ex:'wink',o:[
  ["I'm not hiding. I'm guarding your back.","かくれてない。 背中を まもってる。",'a',2],["…Yes. Yes, I am.","…うん。 かくれてる。",'a',3]]},
 a:{m:["Ha ha! The great boss is a scaredy-cat! …It's OK. I'll protect you. Come here. (She stands in front of you with her arms spread like a shield.)","あはは！ えらい 店長が こわがり！ …だいじょうぶ。 わたしが まもって あげる。 こっち。 （両手を ひろげて 店長の 前に 立つ。 たて みたいに）"],ex:'laugh',
  nt:[["I'll protect you.","「わたしが まもって あげる」"]],o:[
  ["My hero.","たのもしい。",'b',3],["What if it's a real ghost?","ほんものの おばけ だったら？",'b',2]]},
 b:{m:["(Tap, tap. A big moth is bumping against the glass, drawn to the light.) …It's a moth. Just a big moth. …See? Nothing to be scared of.","（コツ、 コツ。 明かりに よってきた 大きな ガが ガラスに ぶつかっている） …ガだ。 ただの 大きな ガ。 …ほらね？ こわい ものなんて ない。"],ex:'smile',
  nt:[["moth","「ガ」。 butterfly は チョウ"],["Nothing to be scared of.","「こわがる ことなんて ない」"]],o:[
  ["You can let go of my arm now.","もう うで、 はなして いいよ。",'c',3]]},
 c:{m:["…Let go? Oh. I've been holding your arm this whole time. …That was to protect you. Obviously.","…はなす？ あ。 ずっと 店長の うで もってた。 …それは 店長を まもる ため。 とうぜんでしょ。"],ex:'oops',p:'cheeks',o:[
  ["Obviously.","とうぜんだね。",'end1',3],["Thank you for protecting me.","まもって くれて ありがとう。",'end2',4],["Your hands are shaking.","手、 ふるえてるよ。",'end3',2]]},
 end1:{m:["…Obviously. (She takes your arm again.) …The moth might come back. Just in case.","…とうぜん。 （また うでを とる） …ガが もどって くるかも しれないし。 念のため。"],ex:'smile',p:'cheeks',
  nt:[["just in case","「念のため」"]],end:'good'},
 end2:{m:["…Anytime. You protect me in the daytime, and I'll protect you at night. Deal?","…いつでも。 昼は 店長が わたしを まもって、 夜は わたしが 店長を まもる。 それで いい？"],ex:'smile',p:'cheeks',
  nt:[["Deal?","「それで きまり？」。 Deal. で 「きまり」"]],end:'good'},
 end3:{m:["They're NOT! It's… cold! It's a cold night! …OK, I was scared too. A little. Don't tell anyone.","ふるえて ない！ さむいの！ 夜は さむいの！ …うん、 わたしも こわかった。 ちょっとね。 ないしょだよ。"],ex:'oops',end:'fun'}}}
];

/* ================================================================ 👩‍🏫 ミナ先生の 夜の 話（🌙 深夜の きろく から） */
const HR_MINA=[
{id:'hm_paw',who:'mina',cat:'unk',st:0,ico:'🐒',t:'先生の こわい 話',nodes:{
 s:{m:["Still awake? …Then here's a little night lesson. Do you know \"The Monkey's Paw\"? It's a famous English horror story from 1902.","まだ 起きてるの？ …じゃあ 夜の ミニ授業。 「猿の 手（The Monkey's Paw）」って 知ってる？ 1902年の、 有名な イギリスの こわい 話。"],ex:'think',o:[
  ["No. Tell me.","知りません。 教えて ください。",'a',2],["Is it scary?","こわい ですか？",'a',2]]},
 a:{m:["An old couple gets a dried monkey's paw. It can grant three wishes. The husband wishes for two hundred pounds.","年を とった 夫婦が、 ひからびた 猿の 手を 手に 入れるの。 願いを 3つ かなえて くれる。 夫は 200ポンドが ほしいと 願う。"],ex:'smile',
  nt:[["grant a wish","「願いを かなえる」"],["pound","イギリスの お金の 単位（ポンド）"]],o:[
  ["That sounds lucky.","ラッキー ですね。",'b',2],["There's always a catch.","うらが ありそう。",'b',3]]},
 b:{m:["The next day, their son dies in an accident at work. The company pays them… exactly two hundred pounds.","つぎの 日、 むすこが 仕事中の 事故で なくなるの。 会社が おわびに はらったのは… ちょうど 200ポンド。"],ex:'worry',
  nt:[["There's a catch.","「うらが ある・落とし穴が ある」"]],o:[
  ["…That's terrible.","…ひどい。",'c',2],["What was the second wish?","2つ目の 願いは？",'c',3]]},
 c:{m:["The mother wishes for her son to come back. That night… there's a knock at the door.","母親は むすこが 帰って くるように 願う。 その 夜… ドアを たたく 音が するの。"],ex:'think',o:[
  ["…Did they open it?","…あけたんですか？",'d',3],["Don't stop there, Sensei!","そこで 止めないで！",'d',2]]},
 d:{m:["She runs to the door. But the father grabs the paw and makes the third wish. The knocking stops. When she opens the door… there's nobody there.","母親は ドアへ 走る。 でも 父親が 猿の 手を つかんで 3つ目の 願いを 言うの。 ノックが やむ。 ドアを あけると… だれも いない。"],ex:'worry',
  nt:[["The knocking stops.","「ノックの 音が やむ」"]],o:[
  ["What did he wish for?","なにを 願ったんですか？",'end1',3],["Be careful what you wish for.","願いごとには 気を つけろ、 ですね。",'end2',4]]},
 end1:{m:["The story never says. That's what makes it so scary. Your imagination fills in the rest.","物語には 書いてないの。 だから こわいんだよ。 のこりは 想像が うめて くれる。"],ex:'think',
  nt:[["fill in the rest","「のこりを うめる」"]],end:'good'},
 end2:{m:["Exactly! That's the famous lesson: \"Be careful what you wish for.\" …Now, good night. And no strange wishes tonight, OK?","その とおり！ 有名な 教訓だね。 「願いごとには 気を つけて」。 …じゃあ おやすみ。 今夜は へんな 願いごと しないでね？"],ex:'happy',
  nt:[["Be careful what you wish for.","「願いごとには 気を つけて」。 この 物語で よく 知られる ようになった ことわざ"]],end:'good'}}},
{id:'hm_scared',who:'mina',cat:'doki',dk:1,st:1,ico:'😱',t:'先生も こわい？',nodes:{
 s:{m:["(Late at night, in the empty classroom, Mina-sensei is grading papers.) Oh! You surprised me. …I'm not scared of the dark. Teachers aren't scared of anything.","（夜の 教室で、 ミナ先生が ひとりで 丸つけを している） あ！ びっくりした。 …くらいのは こわくないよ。 先生は なにも こわくないの。"],ex:'smile',o:[
  ["Of course not.","もちろん ですね。",'a',2],["Then why are all the lights on?","じゃあ なんで 電気 ぜんぶ ついてるんですか？",'a',3]]},
 a:{m:["That's… for the papers. Good light is important for grading. …Did you hear that? (Something creaks in the hallway.)","それは… 丸つけの ため。 明るさは 大事なの。 …いまの 聞こえた？ （ろうかで なにかが ギシッと 鳴る）"],ex:'worry',
  nt:[["creak","「ギシッと 鳴る」"]],o:[
  ["It's just the building.","建物の 音 ですよ。",'b',2],["Footsteps…?","足音…？",'b',3]]},
 b:{m:["(BANG! The window rattles in the wind. Mina-sensei grabs your arm with both hands.) …………","（バン！ 風で 窓が ガタガタ 鳴る。 ミナ先生が 両手で 店長の うでを つかむ） …………"],ex:'worry',p:'cross',o:[
  ["Sensei?","先生？",'c',3],["It was the wind.","風 ですよ。",'c',2]]},
 c:{m:["…I was checking your arm. For… posture. Your posture is good. Very good.","…うでを チェック してたの。 し、 姿勢の。 姿勢が いいね。 とっても いい。"],ex:'love',
  nt:[["posture","「姿勢」"]],o:[
  ["You can hold on if you want.","つかまってて いいですよ。",'end1',4],["You were scared, Sensei.","先生、 こわかったんですね。",'end2',2],["Let's go home together.","いっしょに 帰りましょう。",'end3',3]]},
 end1:{m:["…Just until the wind stops. That's all. (The wind doesn't stop for a long time. She doesn't seem to mind.)","…風が やむまで だけ。 それだけ。 （風は なかなか やまなかった。 先生は 気に してない みたいだった）"],ex:'love',end:'good'},
 end2:{m:["I was NOT. I was… surprised. \"Surprised\" and \"scared\" are different words. Write that down. It'll be on the test.","こわくない。 …おどろいた だけ。 surprised と scared は ちがう ことばです。 メモして。 テストに 出ます。"],ex:'worry',
  nt:[["surprised / scared","surprised ＝ おどろいた、 scared ＝ こわい。 たしかに ちがう ことば"]],end:'fun'},
 end3:{m:["…Together? Well, it IS late. And a teacher must make sure her student gets home safely. …That's the only reason.","…いっしょに？ まあ… もう おそいしね。 先生は 生徒が ぶじに 帰るのを 見とどけないと。 …それだけの 理由だよ。"],ex:'love',
  nt:[["make sure ～","「かならず 〜するように する・たしかめる」"]],end:'good'}}}
];

/* ================================================================ ⛏️ 深夜の 鉱山の できごと
   o = [英, 日, 結果]。 結果: {r:[英,日] 返事, coin, deep, luck, back, hp, tool, bad:1（🧿で ふせげる）} */
const HR_MINE=[
 {id:'m_miner',ico:'👷',n:'ゆうれい鉱夫',f:'👷',m:["Have you seen my lamp, kid? I dropped it down here… sixty years ago.","ぼうず、 わしの ランプを 見なかったか？ ここで 落としたんだ… 60年 前にな。"],o:[
   ["Here. You can borrow my light.","どうぞ。 ぼくの 明かりを かします。",{r:["Kind kid. Dig left of the blue rock. Good things sleep there.","やさしい 子だ。 青い 岩の 左を ほれ。 いい 物が ねむっとる。"],luck:8,coin:15}],
   ["Sorry, I haven't.","ごめんなさい、 見てません。",{r:["Then keep digging. Maybe you'll find it for me.","じゃあ ほりつづけな。 わしの かわりに 見つけてくれ。"],coin:6}],
   ["Are you a ghost?","ゆうれい ですか？",{r:["A ghost? Ha! I'm just on a very, very long night shift.","ゆうれい？ はっ！ ちょいと ながーい 夜勤 なだけさ。"],coin:10}]],
  nt:[["borrow / lend","borrow ＝ かりる、 lend ＝ かす。 You can borrow ～ ＝ 「〜を かりて いいよ」"]]},
 {id:'m_song',ico:'🎶',n:'地の底の 歌声',f:'🎶',m:["(From deep below, someone is singing.) \"Oh my darling, oh my darling, oh my darling, Clementine…\"","（ずっと 下の ほうから、 だれかが 歌っている） 「おお いとしの、 おお いとしの、 いとしの クレメンタイン…」"],o:[
   ["(Sing along.)","（いっしょに 歌う）",{r:["(The voice stops… then laughs softly, and the rocks around you sparkle.)","（歌声が 止まって… くすっと わらう。 まわりの 岩が きらきら 光る）"],luck:8}],
   ["(Follow the voice.)","（声の ほうへ 行く）",{r:["(The singing moves deeper and deeper… you followed it 2m down. Then it stops right behind you.)","（歌声は どんどん 深く… 2m 下りた。 そして、 すぐ うしろで 止まった）"],deep:2}],
   ["(Cover your ears.)","（耳を ふさぐ）",{r:["(When you uncover your ears, there's a small gem where the voice was.)","（耳から 手を はなすと、 声が した ところに 小さな 宝石が）"],coin:12}]],
  nt:[["Clementine","「いとしの クレメンタイン」。 1849年ごろの ゴールドラッシュの 歌。 鉱夫（forty-niner）の むすめの 歌で、 じつは かなしい 歌詞"],["sing along","「いっしょに 歌う」"]]},
 {id:'m_wisp',ico:'🔵',n:'青い 火',f:'🔵',m:["(A small blue flame floats in the dark tunnel. It bobs, as if it wants you to follow.)","（くらい 坑道に、 小さな 青い 火が うかんでいる。 ついておいで、 と いうように ゆれる）"],o:[
   ["(Follow it.)","（ついていく）",{r:["(It leads you down a hidden slope… then vanishes. You're 3m deeper. And you're not sure how to get back.)","（かくれた 坂を 下りて… 火は 消えた。 3m 深く 来た。 帰り道は よく わからない）"],deep:3}],
   ["(Don't follow it.)","（ついていかない）",{r:["Smart. In old stories, these lights lead travelers into swamps. (The flame fades, leaving coins.)","かしこい。 むかし話では、 この 火は 旅人を ぬまに つれていく。 （火は 消えて、 コインが のこった）"],coin:12}]],
  nt:[["will-o'-the-wisp","「鬼火・きつね火」。 夜の 湿地に 見える なぞの 光。 「たいまつを もった ウィル」と いう いみ"],["vanish","「すっと 消える」"]]},
 {id:'m_knock',ico:'🔨',n:'コンコンの 音',f:'🔨',m:["(Knock, knock, knock. Someone is tapping on the rock wall… from the other side.)","（コン、 コン、 コン。 岩の かべを、 だれかが たたいている… むこうがわから）"],o:[
   ["(Leave some food for them.)","（食べ物を 少し おいていく）",{r:["(The knocking turns happy and fast. The wall crumbles a little, showing shiny stones.)","（ノックが うれしそうに はやく なる。 かべが 少し くずれて、 光る 石が 見えた）"],luck:10,coin:8}],
   ["(Knock back.)","（たたきかえす）",{r:["(Knock, knock… they knock back. Then a pebble with a smiley face rolls to your feet.)","（コン、 コン… たたきかえしてきた。 それから にこにこ顔の 小石が 足もとに ころがってきた）"],coin:10}],
   ["(Ignore it.)","（むしする）",{r:["(The knocking stops. Then… rocks fall from the ceiling! You climb back 2m.)","（ノックが やむ。 そして… 天井から 石が！ 2m もどった）"],back:2,bad:1}]],
  nt:[["knockers","イギリスの コーンウォールの 鉱夫が 信じた 鉱山の 小人。 コンコン たたいて 落盤を 知らせると 言われ、 鉱夫は お弁当（パスティ）の はしっこを のこして あげた"]]},
 {id:'m_door',ico:'🚪',n:'古い 木の とびら',f:'🚪',m:["(Deep in the mine, there's an old wooden door. Someone knocks from the other side.) \"Knock, knock.\"","（鉱山の おくに 古い 木の とびら。 むこうから ノック） 「コン、 コン（Knock, knock）」"],o:[
   ["Who's there?","どなた？（Who's there?）",{r:["\"Boo.\" — \"Boo who?\" — \"Don't cry, it's only a joke!\" (Laughter fades behind the door. A coin slides under it.)","「ブー」—「ブー だれ？（Boo who?）」—「泣かないで、 ただの じょうだんだよ！」 （とびらの むこうで わらい声が 消えていく。 下から コインが すべってきた）"],coin:15}],
   ["(Open the door.)","（とびらを あける）",{r:["(Nothing. Only a cold wind… and the smell of the sea, deep under the ground.)","（なにも ない。 つめたい 風… そして 地の底なのに 海の におい）"],coin:5}]],
  nt:[["Knock, knock. — Who's there?","英語の 定番の 言葉あそび（ノックノック・ジョーク）"],["Boo who?","boo-hoo（えーん）と 同じ 音。 だから 「泣かないで」"]]},
 {id:'m_echo',ico:'🗣️',n:'へんな こだま',f:'🗣️',m:["You call into the dark: \"Hello?\" …The echo answers: \"Hello. Who are you?\"","やみに むかって 「Hello?」 …こだまが 答える。 「Hello. あなたは だれ？」"],o:[
   ["I'm a miner.","鉱夫です。",{r:["\"…So was I.\" (Silence. Then a soft light shows a sparkling vein in the wall.)","「…わたしも そうだった」 （しーん。 やわらかい 光が、 かべの きらきらの すじを てらす）"],luck:6,coin:10}],
   ["Who are YOU?","あなたこそ だれ？",{r:["\"…Me? I'm YOU.\" (You hurry back up 2m without looking back.)","「…わたし？ わたしは あなた」 （ふりかえらずに 2m かけあがった）"],back:2,bad:1}],
   ["(Say nothing.)","（だまる）",{r:["(The echo waits… then sighs, bored. A pebble drops: it's a little gem.)","（こだまは 待って… たいくつそうに ため息。 小石が 落ちてきた。 小さな 宝石だ）"],coin:12}]],
  nt:[["echo","「こだま」。 ギリシャ神話の 森の 精 エコーが 名前の もと"],["So was I.","「わたしも そうだった」。 前の 文が was の とき"]]},
 {id:'m_skel',ico:'💀',n:'がいこつの 札',f:'💀',m:["(A skeleton sits against the wall, holding an old key and a sign: \"DIG HERE.\")","（かべに よりかかる がいこつ。 古い かぎと 札を もっている。 「ここを ほれ（DIG HERE）」）"],o:[
   ["(Take the key.)","（かぎを もらう）",{r:["(The fingers open by themselves. You got an old key!)","（指が ひとりでに ひらいた。 古い かぎを もらった！）"],tool:'key'}],
   ["(Dig where it says.)","（札の ところを ほる）",{r:["(Clink! A pouch of old coins!)","（カチン！ 古い 硬貨の ふくろ！）"],coin:30}],
   ["Thank you, sir.","ありがとう ございます。",{r:["(The skull seems to smile. You feel lucky.)","（がいこつが ほほえんだ 気がした。 ついてる 気が する）"],luck:10}]],
  nt:[["skeleton key","「合いかぎ（マスターキー）」。 中みを けずって 骨だけ みたいに した かぎだから"],["a skeleton in the closet","「人に 言えない ひみつ」"]]},
 {id:'m_mio',ico:'🌙',n:'ミオの 声',f:'🌙',m:["(From deeper in the dark, a familiar voice.) \"Boss… come down here… I found something…\" …But Mio is at the shop.","（やみの おくから、 聞きなれた 声） 「店長… こっちに 来て… いい ものが あるの…」 …でも ミオは お店に いるはず。"],o:[
   ["Mio? Is that you?","ミオ？ ミオなの？",{r:["\"…Yes… come closer… closer…\" (Something cold touches your neck. You scramble back up 3m.)","「…うん… もっと 近くに… もっと…」 （つめたい なにかが 首に ふれた。 あわてて 3m かけあがった）"],back:3,bad:1}],
   ["You're not Mio.","きみは ミオじゃ ない。",{r:["(The voice giggles… and fades. Where it was, coins glitter.)","（声は くすくす わらって… 消えた。 その あとに コインが 光っている）"],coin:15,luck:4}],
   ["(Go back up quietly.)","（だまって 上に もどる）",{r:["(Smart choice. Back at the shop later, Mio says, \"I never left the counter. Why?\")","（かしこい えらびかた。 あとで ミオが 言った。 「わたし ずっと カウンターに いたよ。 なんで？」）"],back:1,coin:8}]],
  nt:[["Is that you?","「きみなの？」。 声だけ 聞こえる ときに"],["giggle","「くすくす わらう」"]]},
 {id:'m_eyes',ico:'👀',n:'やみの 中の 目',f:'👀',m:["(Two glowing eyes in the darkness. Watching you.)","（やみの 中に 光る 目が ふたつ。 こっちを 見ている）"],o:[
   ["Who's there?","だれ？",{r:["\"Meow.\" (A black cat! It trots ahead and shows you a shortcut.)","「ニャー」 （黒ネコ！ とことこ 先を 歩いて、 近道を 教えてくれた）"],deep:2}],
   ["(Throw a pebble.)","（小石を なげる）",{r:["(Bats! Hundreds of bats burst out of the dark! You fall down hard.)","（コウモリ！ 何百匹も とびだしてきた！ しりもちを ついた）"],hp:5,bad:1}],
   ["(Stay still.)","（じっと する）",{r:["(The eyes blink slowly… and leave. On the ground: a shiny stone.)","（目は ゆっくり まばたきして… いなくなった。 地面に 光る 石）"],coin:12}]],
  nt:[["Who's there?","「だれ？」。 ドアの むこうや やみに むかって"],["bat","「コウモリ」。 野球の バットと 同じ つづり"]]},
 {id:'m_radio',ico:'📻',n:'古い ラジオ',f:'📻',m:["(An old radio in the rocks crackles to life.) \"This is Radio Shiosai. It's 2 a.m. Tonight's weather: foggy, with a chance of ghosts.\"","（岩の あいだの 古い ラジオが ザザッと 鳴りだす） 「こちら ラジオ しおさい。 時刻は 午前2時。 今夜の 天気は 霧、 ところにより おばけ」"],o:[
   ["(Change the channel.)","（チャンネルを かえる）",{r:["\"…and the lucky word tonight is 'dig.' Good night, miners.\" (Static. A coin falls out of the battery box.)","「…今夜の ラッキーワードは 『dig（ほる）』。 おやすみ、 鉱夫の みなさん」 （ザー。 電池の 箱から コインが 落ちた）"],coin:15}],
   ["(Turn it off.)","（スイッチを 切る）",{r:["(Click. …It turns itself back on. \"Rude.\")","（カチッ。 …ひとりでに また ついた。 「しつれいね」）"],coin:5}]],
  nt:[["a chance of ～","「〜の 可能性」。 天気予報の a chance of rain（ところにより 雨）"],["crackle","「パチパチ・ザザッと 鳴る」"]]},
 {id:'m_letter',ico:'📜',n:'古い 手紙',f:'📜',m:["(In a rusty tin, an old letter.) \"To whoever finds this: the storm is coming. If I don't make it home, tell my daughter I bought her the star card. — 1962\"","（さびた 缶の 中に 古い 手紙） 「これを 見つけた 方へ。 あらしが 来ます。 もし 家に 帰れなかったら、 むすめに 星の カードを 買ったと つたえて ください。 ― 1962」"],o:[
   ["(Keep the letter safe.)","（手紙を 大切に しまう）",{r:["(You fold it carefully. For a moment, you smell the sea.)","（そっと たたむ。 一しゅん、 海の においが した）"],coin:20}],
   ["(Put it back.)","（もとに もどす）",{r:["(You close the tin. Somewhere, very far away, someone says, \"Thank you.\")","（缶を とじる。 どこか とても 遠くで、 だれかが 「ありがとう」と 言った）"],luck:8}]],
  nt:[["To whoever finds this","「これを 見つけた 人へ」。 びんの 手紙や タイムカプセルの 書き出し"],["make it home","「家に たどりつく」"]]}
];

/* ================================================================ 📜 夜と おばけの 英語うんちく（🌙 深夜の きろくで 読める。 ひとつ 読むごとに たまる） */
const HR_UNK=[
 ['ghost の h','\"ghost\" was spelled \"gost\" in Old English. The silent h may have come from Flemish printers who worked for William Caxton, England\'s first printer.','ghost は むかし gost と 書いた。 読まない h は、 イギリス 最初の 印刷屋 キャクストンの もとで はたらいた フランドルの 職人の 書きかたから 来たと 言われている。'],
 ['spooky','\"Spooky\" comes from \"spook,\" a Dutch word for a ghost.','spooky（ぶきみな）は、 オランダ語で おばけを いう spook から。'],
 ['nightmare','The \"mare\" in \"nightmare\" isn\'t a horse. It was an evil spirit that people believed sat on sleepers\' chests.','nightmare の mare は 馬（メスの 馬も mare）じゃ なくて、 ねている 人の 胸に のって くるしめる 悪霊の こと。'],
 ['Halloween','\"Halloween\" is short for \"All Hallows\' Eve,\" the night before All Saints\' Day on November 1.','Halloween は All Hallows\' Eve（すべての 聖人の 日の 前夜）が ちぢまった ことば。'],
 ['jack-o\'-lantern','The first jack-o\'-lanterns in Ireland were carved from turnips, not pumpkins.','アイルランドの さいしょの ジャック・オー・ランタンは、 カボチャ じゃなくて カブで 作っていた。'],
 ['poltergeist','\"Poltergeist\" is German for \"noisy ghost.\" It\'s the ghost that throws things and bangs doors.','poltergeist は ドイツ語で 「さわがしい 霊」。 物を なげたり ドアを バタンと させる おばけ。'],
 ['ghostwriter','A \"ghostwriter\" writes a book for someone else, but their name never appears. They\'re invisible, like a ghost.','ghostwriter（ゴーストライター）は 人の かわりに 本を 書く 人。 名前が 出ない、 おばけみたいに 見えない 人。'],
 ['ghosting','\"To ghost someone\" means to suddenly stop answering their messages, and disappear like a ghost.','ghost を 動詞で 使うと 「とつぜん 連絡を たって 消える」。 He ghosted me.（返事が こなくなった）'],
 ['goosebumps','In English you get \"goosebumps,\" like goose skin. In Japanese it\'s chicken skin: とりはだ.','英語の とりはだは goosebumps（ガチョウの ぶつぶつ）。 日本語は ニワトリ、 英語は ガチョウ。'],
 ['haunted','A house with a ghost is \"haunted.\" \"Haunt\" first meant simply \"to visit a place often.\"','おばけが 出る 家は haunted house。 haunt は もともと 「よく 行く 場所」の いみだった。'],
 ['skeleton key','A \"skeleton key\" opens many locks. Most of the key was cut away, leaving only its \"bones.\"','skeleton key（合いかぎ）は、 かぎの 中みを けずって 「骨」だけに した から この 名前。'],
 ['coffin nail','Old slang called cigarettes \"coffin nails\"—every one brings you closer to the coffin.','むかしの スラングで タバコは coffin nail（ひつぎの くぎ）。 1本 すうごとに ひつぎに 近づく から。'],
 ['dead of night','\"In the dead of night\" means in the quietest, darkest part of the night.','in the dead of night は 「真夜中に」。 夜が いちばん しずかで くらい ころ。'],
 ['the witching hour','Shakespeare wrote in Hamlet: \"\'Tis now the very witching time of night.\"','シェイクスピアの 『ハムレット』に 「いまこそ 魔の 夜ふけ」という セリフが ある。']];
