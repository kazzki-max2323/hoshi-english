/* 💓 恋人に なる 前の ドキドキ（アイテム なしで 最初から 出る）
   - ミオ: 「なかよし」〜「気になる ふたり」で ミオと 話す の リストに ふえる。 わざと しかけて、 自分で 照れる 小悪魔（でも つめが あまい）
   - ミナ先生: 「気になる 人」から、 ミナ先生との 時間の 「💓 ドキドキ」に ふえる。 無自覚に やらかして、 あとで 気づいて 大あわて
   - ハプニングは 手が ふれる・受けとめる・顔が 近い くらいまで。 ミナ先生かミオの どちらかを えらんだ あとは、 えらばなかった 人の ドキドキは 出ない
   会話の 形は game/mio-talk.js と 同じ（画面は game/mio-chat.js）。 nt = 💌 ことばメモ */
(()=>{
const W=()=>{try{return WED.who()}catch(e){return null}};
const mioOk=M=>!M.alt&&W()!=='mina';
const D=(id,st,ico,t,nodes)=>({id,st,ico,t,mk:'mc_doki',if:mioOk,nodes});
MIO_TALKS.push(
/* ---------- 🌼 なかよし ---------- */
D('dk_card',2,'🃏','同じ カード',{
 s:{m:["Ah, the last \"starlight\" card! I'll take it for the display—","あ、 さいごの 「starlight」の カード！ 売り場に 出そうっと—"],ex:'smile',o:[
  ["(Reach for the same card.)","（同じ カードに 手を のばす）",'a',2]]},
 a:{m:["(Your fingers touch. Mio pulls her hand back.) Oh! S-sorry! …No, you go ahead!","（指が ふれる。 ミオが ぱっと 手を ひっこめる） あっ！ ご、 ごめんなさい！ …ど、 どうぞ どうぞ！"],ex:'oops',p:'cheeks',
  nt:[["You go ahead.","「どうぞ（お先に）」。 ゆずる ときの 定番"]],o:[
  ["No, you take it.","いや、 ミオが どうぞ。",'b',2],["Your hand is warm.","手、 あったかいね。",'warm',3]]},
 warm:{m:["W-warm?! It's because… I was holding a cup of tea! That's all! Science!","あ、 あったかい？！ それは… お茶を もってたから！ それだけ！ 科学です！"],ex:'oops',p:'cheeks',o:[
  ["Science. Sure.","科学ね。 はいはい。",'b',2]]},
 b:{m:["…Hey, boss. Want to put it on the shelf together? Like, both of us holding it? …Just kidding! Ha ha!","…ねえ 店長。 いっしょに たなに おく？ ふたりで もって。 …なんてね！ あはは！"],ex:'wink',o:[
  ["Sure, let's do it.","いいよ、 そうしよう。",'end1',3],["You're turning red.","赤く なってる。",'end2',2],["I'll do it myself.","ひとりで やるよ。",'end3',1]]},
 end1:{m:["…Eh? You said yes? I was joking! …OK. One, two… (Your hands touch again. She doesn't pull away this time.)","…え？ いいの？ じょうだん だったのに！ …じゃあ。 いち、 にの… （また 手が ふれる。 こんどは ひっこめなかった）"],ex:'smile',p:'cheeks',end:'good'},
 end2:{m:["I'm NOT! It's the sunset! The sunset is red! …It's noon. I know.","なってない！ 夕日の せい！ 夕日が 赤いの！ …いま お昼。 知ってる。"],ex:'oops',end:'good'},
 end3:{m:["Boo. You're no fun, boss. …I'll try again tomorrow. With a different card.","ぶー。 つまんない 店長。 …あした また やる。 べつの カードで。"],ex:'wink',end:'fun'}}),
D('dk_straw',2,'🥤','ひとくち いる？',{
 s:{m:["Mmm, this mango juice is so good. Boss, want a sip?","んー、 この マンゴージュース おいしい。 店長、 ひとくち いる？"],ex:'smile',o:[
  ["Sure, thanks.","ありがとう、 もらう。",'a',2],["Isn't that your straw?","それ ミオの ストローじゃ？",'b',3]]},
 a:{m:["Here you go! …(One second later.) …Wait. Wait, wait. That was my straw. That's… that's an indirect kiss!","はい どうぞ！ …（1びょう後） …まって。 まって まって。 それ わたしの ストロー。 それって… 間接キス！"],ex:'oops',p:'cheeks',
  nt:[["indirect kiss","「間接キス」。 英語圏では あまり 言わない 考え方。 でも 説明すれば ちゃんと 通じるよ"]],o:[
  ["Oh. I didn't think about it.","あ。 考えてなかった。",'end2',2],["Delicious.","おいしかった。",'end1',3]]},
 b:{m:["…Huh? Oh! It IS my straw! I… I didn't plan that! Really! …Maybe 10% planned.","…え？ あっ！ ほんとだ！ わ、 わざとじゃ ないよ！ ほんとに！ …10%くらい わざと かも。"],ex:'oops',p:'cheeks',o:[
  ["10%?","10%？",'end1',3],["Then I'll get my own.","じゃあ 自分の 買う。",'end3',1]]},
 end1:{m:["D-don't say it like that! …Here, you can have the rest. I can't drink it now. My face is too hot.","そ、 そんな 言い方 しないで！ …はい、 のこり あげる。 もう 飲めない。 顔が あつすぎて。"],ex:'oops',p:'cheeks',end:'good'},
 end2:{m:["You didn't think about it?! I'm the only one thinking about it?! …Forget I said anything!","考えてなかった？！ わたしだけ 気にしてる？！ …いまの わすれて！"],ex:'oops',end:'good'},
 end3:{m:["…OK. (She sips quietly.) …Boss is so dense. (mumble)","…うん。 （しずかに 飲む） …店長の にぶちん。 （ぼそっ）"],ex:'sleepy',
  nt:[["dense","「にぶい」。 恋に 気づかない 人に You're so dense!（にぶすぎ！）"]],end:'fun'}}),
D('dk_selfie',2,'📸','いっしょに 写真',{
 s:{m:["Boss! The sunset is perfect! Let's take a selfie for the shop's page! Come here!","店長！ 夕日が かんぺき！ お店の ページ用に 自撮り しよう！ こっち 来て！"],ex:'laugh',p:'peace',o:[
  ["OK. (Stand next to her.)","いいよ。（となりに 立つ）",'a',2]]},
 a:{m:["Hmm, you're not in the picture. Closer! Closer! …OK, maybe not THAT close.","うーん、 入ってない。 もっと よって！ もっと！ …あ、 そこまで じゃなくて いい。"],ex:'oops',p:'cheeks',
  nt:[["Closer!","「もっと よって！」。 写真を とる ときの 定番"],["not THAT close","「そこまでじゃ ない」。 THAT を 強く 言うと 「そんなに」"]],o:[
  ["You said closer.","もっとって 言った。",'b',3],["(Step back.) Sorry.","（はなれて） ごめん。",'b',1]]},
 b:{m:["(Click.) …Let me see. …Ha ha, my face is so red. I can't post this one. I'll… keep it. For myself.","（カシャ） …見せて。 …あはは、 顔 まっか。 これは のせられない。 わたしが… もってる。 自分用に。"],ex:'smile',p:'cheeks',o:[
  ["Send it to me too.","ぼくにも おくって。",'end1',3],["Let's take another one.","もう1まい とろう。",'end2',2],["Use it as a wanted poster.","手配書に つかおう。",'end3',1]]},
 end1:{m:["…You want it? OK. But don't show anyone! It's… our secret photo.","…ほしいの？ いいよ。 でも だれにも 見せないで！ ふたりの… ひみつの 写真。"],ex:'smile',p:'cheeks',end:'good'},
 end2:{m:["Another one? …Then this time, you hold the camera. And I'll stand… right here. (She leans on your shoulder.)","もう1まい？ …じゃあ こんどは 店長が カメラ。 わたしは… ここ。 （肩に よりかかる）"],ex:'wink',p:'cheeks',end:'good'},
 end3:{m:["WANTED: A part-timer with a red face! Reward: one rice ball! Ha ha!","指名手配： 顔の 赤い バイト！ 懸賞金： おにぎり 1こ！ あはは！"],ex:'laugh',end:'fun'}}),
D('dk_bento',2,'🍙','作りすぎた お弁当',{
 s:{m:["Boss. Here. (She holds out a lunch box without looking at you.) I made too much. That's all. Don't think about it.","店長。 はい。 （目を そらして お弁当を さしだす） 作りすぎたの。 それだけ。 深い 意味は ないから。"],ex:'smile',o:[
  ["Thank you! Can I open it?","ありがとう！ あけていい？",'a',2],["You made too much… in a separate box?","作りすぎた… のに 箱が べつ？",'box',3]]},
 box:{m:["…The box was lonely! It wanted a job! …Just eat it!","…箱が さみしそう だったの！ 仕事が ほしそう だったの！ …いいから 食べて！"],ex:'oops',p:'cheeks',
  nt:[["That's all.","「それだけ」。 照れかくしで 話を おわらせる ときに"]],o:[
  ["(Open it.)","（あける）",'a',2]]},
 a:{m:["(Inside: rice balls shaped like hearts.) …That's… they're STARS. Star-shaped. They just… melted a little in the bag.","（中には ハートの 形の おにぎり） …それは… 星。 星の 形。 かばんの 中で ちょっと… つぶれただけ。"],ex:'oops',p:'cheeks',o:[
  ["They look like hearts to me.","ハートに 見えるけど。",'end2',3],["Delicious. Thank you, Mio.","おいしい。 ありがとう、 ミオ。",'end1',3],["Stars with two bumps?","でこぼこ 2つの 星？",'end3',1]]},
 end1:{m:["…Really? …Then I might make too much again tomorrow. By accident. OK?","…ほんと？ …じゃあ あしたも まちがえて 作りすぎちゃう かも。 いい？"],ex:'smile',p:'cheeks',end:'good'},
 end2:{m:["They're STARS! …OK, they're hearts. Happy?! Eat them before I die of embarrassment!","星だってば！ …ハートです。 これで いい？！ はずかしくて しぬ 前に 食べて！"],ex:'oops',p:'cheeks',end:'good'},
 end3:{m:["They're special stars! A new kind! …Astronomers haven't found them yet!","とくべつな 星なの！ 新しい しゅるい！ …天文学者も まだ 見つけて ないの！"],ex:'laugh',end:'fun'}}),
D('dk_thunder',2,'⚡','かみなりの 日',{
 s:{m:["Wow, it's really raining. The customers all went home. It's just us… (BOOM!) KYAAA!","すごい 雨。 お客さん みんな 帰っちゃった。 ふたりきり… （ゴロゴロ！） きゃああ！"],ex:'oops',o:[
  ["(She grabs your arm.)","（ミオが うでに しがみつく）",'a',2]]},
 a:{m:["…! (She's holding your arm with both hands.) …I-I'm not scared! The floor moved! It was an earthquake!","…！ （両手で うでを つかんでいる） …こ、 こわくないよ！ ゆかが ゆれたの！ 地震 だったの！"],ex:'oops',p:'cheeks',o:[
  ["It's OK. I'm here.","だいじょうぶ。 ここに いるよ。",'b',3],["You can hold on if you want.","つかまってて いいよ。",'b',3],["That was thunder.","いまのは かみなり。",'b',1]]},
 b:{m:["(BOOM!) …OK, I'm a little scared. Just a little. …Can I stay like this until it stops?","（ゴロゴロ！） …うん、 ちょっと こわい。 ちょっとだけ。 …やむまで このまま いても いい？"],ex:'smile',p:'cheeks',
  nt:[["Can I stay like this?","「このまま いても いい？」。 くっついた ままで いたい ときの ことば"]],o:[
  ["Of course.","もちろん。",'end1',3],["As long as you want.","好きなだけ。",'end1',4],["I'll make cocoa first.","先に ココア いれるね。",'end3',1]]},
 end1:{m:["(The storm passes slowly. She doesn't let go until the very end.) …Don't tell anyone about this. Promise?","（あらしが ゆっくり すぎていく。 さいごまで はなさなかった） …この こと、 だれにも ないしょね。 約束？"],ex:'smile',p:'cheeks',
  nt:[["Don't tell anyone about this.","「この こと ないしょね」。 はずかしい ところを 見られた ときの 定番"]],end:'good'},
 end3:{m:["Don't leave me! …Then I'm coming too! (She follows you to the kitchen, holding your sleeve.)","おいてかないで！ …わたしも 行く！ （そでを つかんで 台所まで ついてくる）"],ex:'oops',end:'fun'}}),
/* ---------- 🤝 たよれる なかま ---------- */
D('dk_trip',3,'🪜','はしごの 上',{
 s:{m:["I'll get the box from the top shelf! I'm good at ladders! …Whoa, whoa, WHOA—","いちばん 上の たなの 箱、 とるね！ はしご 得意なの！ …わっ、 わわっ、 わああ—"],ex:'oops',o:[
  ["(Catch her.)","（うけとめる）",'a',3]]},
 a:{m:["(She falls right into your arms. Your faces are very close.) ……","（ミオが うでの 中に おちてくる。 顔が すごく 近い） ……"],ex:'oops',p:'cheeks',o:[
  ["Are you OK?","だいじょうぶ？",'b',3],["…","……",'b',2]]},
 b:{m:["…Y-yeah. Thanks. …Um. You can let go now. …Or not. I mean— yes, let go! Let go!","…う、 うん。 ありがと。 …えっと。 もう はなして いいよ。 …はなさなくても。 じゃなくて— はなして！ はなして！"],ex:'oops',p:'cheeks',
  nt:[["You can let go now.","「もう はなして いいよ」。 let go ＝ 手を はなす"]],o:[
  ["(Gently put her down.)","（そっと おろす）",'end1',3],["Which one?","どっち？",'end2',3],["You're heavier than you look.","見た目より 重い。",'end3',0]]},
 end1:{m:["…Thanks for catching me. You're… stronger than you look. (She hurries away, holding the box over her face.)","…うけとめて くれて ありがと。 店長って… 見た目より 力 あるんだね。 （箱で 顔を かくして 走っていく）"],ex:'smile',p:'cheeks',end:'good'},
 end2:{m:["Don't ask me that! I don't know! My brain fell off the ladder too!","聞かないで！ わかんない！ 頭も いっしょに はしごから おちたの！"],ex:'oops',end:'good'},
 end3:{m:["…BOSS! That's the worst thing to say! …I'm keeping the box. And my dignity.","…店長！ いちばん 言っちゃ だめな やつ！ …箱は もらってく。 わたしの プライドも。"],ex:'oops',end:'fun'}}),
D('dk_whisper',3,'🤫','ないしょ話',{
 s:{m:["Psst, boss. (She leans close to your ear.) That customer in the hat? He's been here two hours. He's reading every card.","ねえ 店長。 （耳もとに 顔を よせる） あの 帽子の お客さん。 もう 2時間。 カード ぜんぶ 読んでる。"],ex:'wink',
  nt:[["Psst.","「ねえ（こっそり）」。 小声で 相手を よぶ 音"]],o:[
  ["(Whisper back.) Maybe he likes reading.","（ささやき返す） 読むのが 好きなんだよ。",'a',2],["That tickles.","くすぐったい。",'tick',3]]},
 tick:{m:["Tickles? …Oh! Sorry, was I too close? …Was I?","くすぐったい？ …あっ！ ごめん、 近すぎた？ …近かった？"],ex:'oops',p:'cheeks',o:[
  ["A little. I didn't mind.","ちょっとね。 いやじゃ なかった。",'a',3]]},
 a:{m:["(She stays close.) …Shh. Listen. I have one more secret. …Your hair smells like the sea. …That's all! Back to work!","（近い ままで） …しーっ。 聞いて。 もう1つ ひみつ。 …店長の 髪、 海の においが する。 …それだけ！ 仕事 もどろ！"],ex:'wink',p:'cheeks',o:[
  ["…That's not a secret about the customer.","…それ、 お客さんの ひみつ じゃ ないよね。",'end1',3],["Yours smells like flowers.","ミオは 花の におい。",'end2',4],["It's because I fell in the sea yesterday.","きのう 海に おちたから。",'end3',1]]},
 end1:{m:["Customers, bosses, same thing! Ha ha… (She runs to the register.)","お客さんも 店長も 同じ！ あはは… （レジに にげていく）"],ex:'laugh',end:'good'},
 end2:{m:["…! That's— you can't whisper back like that! That's against the rules! …Whose rules? Mine!","…！ それ— そんなふうに ささやき返すの 反則！ …だれの ルール？ わたしの！"],ex:'oops',p:'cheeks',end:'good'},
 end3:{m:["You FELL in?! …That explains the seaweed. It's on your shoulder. Hold still.","おちたの？！ …だから 肩に ワカメが。 じっと してて。"],ex:'laugh',end:'fun'}}),
D('dk_nap',3,'😴','カウンターの うたた寝',{
 s:{m:["(Mio is asleep at the counter, her head on her arms.) …Zzz… one more card… zzz…","（ミオが カウンターで うでを まくらに ねている） …すー… もう1まい… すー…"],ex:'sleepy',o:[
  ["(Put your jacket on her shoulders.)","（肩に 上着を かける）",'a',3],["(Watch her for a while.)","（しばらく ながめる）",'a',2]]},
 a:{m:["(She opens one eye.) …How long were you watching me? …Don't answer. I don't want to know.","（片目を あける） …いつから 見てたの？ …答えないで。 知りたく ない。"],ex:'sleepy',p:'cheeks',
  nt:[["How long were you watching me?","「いつから 見てたの？」。 ねがおを 見られた ときの 定番の セリフ"]],o:[
  ["Just a minute.","ほんの 1分。",'b',2],["Long enough. You were smiling.","じゅうぶん。 わらってたよ。",'b',3]]},
 b:{m:["(She notices the jacket.) …This is yours. It's warm. …Can I keep wearing it a little longer?","（上着に 気づく） …これ、 店長の。 あったかい。 …もう少し 着てて いい？"],ex:'smile',p:'cheeks',o:[
  ["As long as you want.","好きなだけ。",'end1',3],["Did you dream about something?","なにか 夢 見た？",'end2',3],["You drooled on the counter.","カウンターに よだれ。",'end3',0]]},
 end1:{m:["…Thanks. It smells like you. …I said that out loud, didn't I. Forget it.","…ありがと。 店長の においが する。 …いま 声に 出てた よね。 わすれて。"],ex:'oops',p:'cheeks',end:'good'},
 end2:{m:["A dream? …It's a secret. But you were in it. That's all I'll say.","夢？ …ひみつ。 でも 店長が 出てきた。 それだけ 言っとく。"],ex:'wink',p:'cheeks',end:'good'},
 end3:{m:["I did NOT! …(wipes counter) I did not. You saw nothing.","して ない！ …（カウンターを ふく） して ない。 なにも 見てない。"],ex:'oops',end:'fun'}}),
D('dk_name',3,'📛','名前で よぶ',{
 s:{m:["Boss, the delivery came— (She stops.) …Hey. Can I try something? Can I call you by your name? Just once.","店長、 配達 きた— （とまる） …ねえ。 ためして いい？ 名前で よんで いい？ 1回だけ。"],ex:'smile',o:[
  ["Sure.","いいよ。",'a',2],["Why suddenly?","なんで 急に？",'why',2]]},
 why:{m:["No reason! Practice! For English! Names are… important vocabulary!","理由は ない！ 練習！ 英語の！ 名前は… 大事な 単語なの！"],ex:'oops',o:[
  ["OK. Go ahead.","いいよ。 どうぞ。",'a',2]]},
 a:{m:["Ahem. …(She says your name very softly.) …………. OK, never mind! \"Boss\" is better! \"Boss\" is safe!","えへん。 …（とても 小さな 声で 名前を よぶ） …………。 はい、 なし！ 「店長」の ほうが いい！ 「店長」は 安全！"],ex:'oops',p:'cheeks',o:[
  ["Say it again.","もう一回 言って。",'end1',4],["Can I call you Mio-chan?","「ミオちゃん」って よんでいい？",'end2',2],["Safe from what?","なにから 安全？",'end3',2]]},
 end1:{m:["No! …Maybe. Someday. When I'm ready. …You're smiling too much, boss.","だめ！ …いつか。 心の 準備が できたら。 …店長、 にやけすぎ。"],ex:'wink',p:'cheeks',end:'good'},
 end2:{m:["\"Mio-chan\"?! That's… that's even more dangerous! Abort! Abort!","「ミオちゃん」？！ それ… もっと 危険！ 中止！ 中止！"],ex:'oops',
  nt:[["Abort!","「中止！」。 ロケットや 作戦を とめる ときの ことばを ふざけて 使う"]],end:'good'},
 end3:{m:["From… from my heart exploding! There, I said it! Go sign for the delivery!","…心臓が 爆発するのから！ 言っちゃった！ 配達の サイン してきて！"],ex:'oops',p:'cheeks',end:'fun'}}),
D('dk_jeal',3,'😤','常連さん',{
 s:{m:["(A regular customer is talking to Mio.) \"Mio-san, you're always so cheerful. Want to get coffee after work?\"","（常連さんが ミオに 話しかけている） 「ミオさん、 いつも 元気だね。 仕事の あと コーヒー どう？」"],ex:'smile',o:[
  ["(Walk over.) Mio, can you help me in the back?","（近づいて） ミオ、 ちょっと 奥 手伝って。",'a',3],["(Pretend not to care.)","（気に しない ふり）",'b',1]]},
 a:{m:["(In the back room.) …What did you need help with? …There's nothing here. Boss… were you jealous? Ha ha!","（奥の 部屋で） …なに 手伝うの？ …なにも ないけど。 店長… やきもち？ あはは！"],ex:'wink',
  nt:[["Were you jealous?","「やきもち やいた？」。 jealous ＝ やきもち・うらやましい"]],o:[
  ["…Maybe a little.","…ちょっとだけ。",'end1',4],["No. I really needed help.","ちがう。 ほんとに 手が ほしかった。",'end2',2]]},
 b:{m:["(Later.) …Boss. You were looking over here the whole time. And you dropped three cards. Were you… jealous?","（あとで） …店長。 ずっと こっち 見てたでしょ。 カード 3まい 落としてたし。 もしかして… やきもち？"],ex:'wink',o:[
  ["…Maybe a little.","…ちょっとだけ。",'end1',4],["Of course not.","まさか。",'end2',1]]},
 end1:{m:["…Ha ha. I told him no, you know. I said, \"I have plans.\" …My plan is closing the shop with you. Same as always.","…あはは。 ことわったよ。 「予定が あるので」って。 …わたしの 予定は 店長と 閉店作業。 いつもどおり。"],ex:'smile',p:'cheeks',
  nt:[["I have plans.","「予定が あるので」。 さそいを やんわり ことわる 定番"]],end:'good'},
 end2:{m:["Hmm~? OK, OK. …(She smiles to herself all afternoon.)","ふーん？ はいはい。 …（その日の 午後、 ミオは ずっと ひとりで にやにや していた）"],ex:'wink',end:'fun'}}),
D('dk_match',3,'👕','たまたま おそろい',{
 s:{m:["Good morning, boss! …Huh. You're wearing a blue striped shirt. …I'm wearing a blue striped shirt.","おはよう、 店長！ …あれ。 青い しましまの シャツ。 …わたしも 青い しましまの シャツ。"],ex:'oops',o:[
  ["What a coincidence.","ぐうぜんだね。",'a',2],["Did you copy me?","まねした？",'a',2]]},
 a:{m:["(A customer comes in.) \"Oh, matching outfits? How cute! Are you two a couple?\" …N-no! It's a uniform! A new uniform!","（お客さんが 入ってくる） 「あら、 おそろい？ かわいい！ おふたり、 カップル？」 …ち、 ちがいます！ 制服です！ 新しい 制服！"],ex:'oops',p:'cheeks',
  nt:[["Are you two a couple?","「おふたり、 カップル？」。 couple ＝ 恋人どうし"],["matching outfits","「おそろいの 服」"]],o:[
  ["Yes, it's our uniform.","そう、 制服です。",'end1',2],["…Not yet.","…まだ ちがいます。",'end2',4],["We're twins.","ふたごです。",'end3',1]]},
 end1:{m:["(After the customer leaves.) …\"Our uniform.\" …Then we have to wear it every Monday. Rules are rules!","（お客さんが 帰ったあと） …「制服」ね。 …じゃあ 毎週 月曜は これ 着なきゃ。 決まりだから！"],ex:'wink',end:'good'},
 end2:{m:["\"Not YET\"?! …What does \"yet\" mean, boss? Boss! Come back here and explain your grammar!","「まだ」？！ …「yet」って どういう 意味、 店長？ 店長！ もどってきて 文法 説明して！"],ex:'oops',p:'cheeks',
  nt:[["not yet","「まだ（〜ない）」。 これから そうなる かも、 という ふくみが ある"]],end:'good'},
 end3:{m:["Twins?! We don't look ANYTHING alike! …The customer believed it. Unbelievable.","ふたご？！ ぜんぜん にてない！ …お客さん 信じた。 信じられない。"],ex:'laugh',end:'fun'}}),
/* ---------- 💓 気になる ふたり ---------- */
D('dk_umbrella',4,'☂️','ひとつの 傘',{
 s:{m:["Oh no, it's raining and I forgot my umbrella… (She looks at your umbrella. Then at you. Then at your umbrella.)","あー、 雨。 傘 わすれた… （店長の 傘を 見る。 店長を 見る。 また 傘を 見る）"],ex:'wink',o:[
  ["Want to share?","入る？",'a',3],["I'll lend it to you.","かして あげる。",'lend',2]]},
 lend:{m:["Then YOU'LL get wet! No way. …We'll share. That's the only logical answer.","それじゃ 店長が ぬれちゃう！ だめ。 …いっしょに 入ろ。 それしか 論理的な 答えは ない。"],ex:'smile',o:[
  ["Logical. Sure.","論理的ね。",'a',2]]},
 a:{m:["(Walking under one umbrella.) …Your shoulder is getting wet. You're holding it all on my side. …Come closer.","（ひとつの 傘で 歩く） …肩、 ぬれてる。 傘、 ぜんぶ こっちがわに してるでしょ。 …もっと こっち 来て。"],ex:'smile',p:'cheeks',
  nt:[["You're getting wet. Come closer.","「ぬれてるよ。 もっと こっち」。 相合傘の 定番"],["share an umbrella","「傘に いっしょに 入る」。 英語には 「相合傘」に あたる 決まった ことばは ない"]],o:[
  ["(Move closer.)","（近づく）",'b',3],["I'm fine.","だいじょうぶ。",'b',2]]},
 b:{m:["(Your arms touch with every step.) …This walk is too short. Let's take the long way. …Because of the rain! The rain is heavier on the short way!","（歩くたびに うでが ふれる） …この 道、 短すぎる。 遠まわりしよ。 …雨の せい！ 近道の ほうが 雨が つよいの！"],ex:'wink',p:'cheeks',o:[
  ["That's not how rain works.","雨って そういう もの じゃ ないよ。",'end2',2],["Let's take the longest way.","いちばん 遠まわりで。",'end1',4]]},
 end1:{m:["…OK. (She hums quietly the whole way. The rain doesn't stop. Neither of you minds.)","…うん。 （ずっと 小さく 鼻歌。 雨は やまない。 ふたりとも 気に しなかった）"],ex:'smile',p:'cheeks',end:'good'},
 end2:{m:["It is today! Today's rain is special! …Just walk slowly, OK?","きょうの 雨は そうなの！ とくべつな 雨！ …ゆっくり 歩いて、 ね？"],ex:'oops',end:'fun'}}),
D('dk_shadow',4,'🌇','夕焼けの 帰り道',{
 s:{m:["Look, boss! Our shadows are so long. Yours is a giant!","見て 店長！ 影が 長い。 店長の 影、 巨人みたい！"],ex:'laugh',o:[
  ["Yours is a giant too.","ミオのも 巨人だよ。",'a',2]]},
 a:{m:["(Her shadow's hand moves next to your shadow's hand. On the ground, they look like they're holding hands.) …Look. Our shadows are… you know.","（ミオの 影の 手が、 店長の 影の 手の となりに。 地面の 上では 手を つないでいる ように 見える） …見て。 影が… その…"],ex:'smile',p:'cheeks',o:[
  ["Holding hands.","手を つないでる。",'b',3],["Let's make the shadows do it for real.","影じゃ なくて ほんとに しよう。",'real',4]]},
 real:{m:["…! (She looks at your hand. Then at the ground.) …N-not yet. Shadows first. Shadows are… practice.","…！ （店長の 手を 見て、 地面を 見る） …ま、 まだ。 影が 先。 影は… 練習。"],ex:'oops',p:'cheeks',o:[
  ["OK. Practice.","わかった。 練習ね。",'end1',3]]},
 b:{m:["…Ha ha. The shadows are braver than us. …Hey, boss. Do you think… someday…? …Never mind! Race you to the shop!","…あはは。 影の ほうが 勇気 あるね。 …ねえ 店長。 いつか…？ …なんでもない！ お店まで 競争！"],ex:'laugh',p:'cheeks',o:[
  ["Someday what?","いつか なに？",'end2',3],["(Run after her.)","（追いかける）",'end1',2],["I'll walk.","歩いて 行く。",'end3',1]]},
 end1:{m:["(She runs ahead, then turns around in the sunset light.) …You're slow! I'll wait! I'm always waiting!","（先に 走って、 夕日の 中で ふりむく） …おそい！ 待ってて あげる！ いつも 待ってるんだから！"],ex:'laugh',p:'wave',end:'good'},
 end2:{m:["Someday… you'll know! When the shadows teach you! …That made no sense. Bye!","いつか… わかるよ！ 影が 教えて くれる！ …意味 わかんないね。 ばいばい！"],ex:'oops',p:'cheeks',end:'good'},
 end3:{m:["Boo! …Then I'll walk too. Slowly. Next to you. That's better anyway.","ぶー！ …じゃあ わたしも 歩く。 ゆっくり。 となりで。 そっちの ほうが いいし。"],ex:'smile',end:'fun'}}),
D('dk_practice',4,'💬','告白の 練習',{
 s:{m:["Boss, can you help me practice? My English class has a speaking test. The topic is… \"confessing your feelings.\" It's random! Totally random!","店長、 練習 つきあって？ 英語の 授業で スピーキングテストが あって。 テーマが… 「気持ちを 伝える」。 たまたま！ ぜんぶ たまたま！"],ex:'oops',o:[
  ["Sure. Go ahead.","いいよ。 どうぞ。",'a',2],["That's an interesting test.","おもしろい テストだね。",'a',2]]},
 a:{m:["OK. Ahem. (She looks into your eyes.) \"I really like spending time with you. When you smile, my day gets better.\" …How was my pronunciation?","じゃあ。 えへん。 （目を 見て） 「あなたと すごす 時間が 大好きです。 あなたが 笑うと、 わたしの 一日が よく なるの」 …発音、 どうだった？"],ex:'smile',p:'cheeks',
  nt:[["I really like spending time with you.","「あなたと いる 時間が 好き」。 告白の 前の、 やさしい 気持ちの 伝え方"]],o:[
  ["Perfect. I felt it.","かんぺき。 ちゃんと 伝わった。",'b',3],["Now let me try. \"I like spending time with you too.\"","じゃあ ぼくも。 「ぼくも きみと いる 時間が 好き」",'b',4]]},
 b:{m:["…… That's… We were just practicing! …Right? …Right?","…… それって… 練習 だよね！ …だよね？ …ね？"],ex:'oops',p:'cheeks',
  nt:[["We were just practicing, right?","「練習 だよね？」。 本気か どうか たしかめたい 照れかくし。 right? を くりかえすと ゆれる 気持ちが 出る"]],o:[
  ["…Right. Practice.","…うん。 練習。",'end1',3],["What if it wasn't?","練習じゃ なかったら？",'end2',4],["Grade: A plus.","評価： A＋。",'end3',1]]},
 end1:{m:["…Right. …Thanks for helping. I'll get a good grade. …I hope the real one goes this well.","…だよね。 …手伝って くれて ありがと。 いい 点 とれそう。 …本番も こう うまく いくと いいな。"],ex:'smile',p:'cheeks',end:'good'},
 end2:{m:["W-wasn't?! …Then… then I need more time to prepare! Ask me again later! Much later! (She runs into the storage room.)","じゃ、 じゃなかったら？！ …それなら… 準備の 時間が いる！ あとで もう一回！ ずっと あとで！ （倉庫に にげこむ）"],ex:'oops',p:'cheeks',end:'good'},
 end3:{m:["A plus?! Yay! …Wait, are you grading my English or my… never mind!","A＋？！ やった！ …まって、 英語の 評価？ それとも わたしの… なんでもない！"],ex:'laugh',end:'fun'}}),
D('dk_fortune',4,'🔮','恋愛運',{
 s:{m:["Boss, I got a fortune cookie from Nora-san's shop! Let's open them together!","店長、 ノラさんの お店で おみくじクッキー もらったの！ いっしょに あけよ！"],ex:'laugh',o:[
  ["OK. One, two, three!","いいよ。 いち、 にの、 さん！",'a',2]]},
 a:{m:["Mine says… \"The one you're looking for is closer than you think.\" …Ha ha. Closer than I think. …What does yours say?","わたしのは… 「さがしている 人は、 思っているより 近くに いる」 …あはは。 思ってるより 近く。 …店長のは？"],ex:'smile',p:'cheeks',
  nt:[["closer than you think","「思っているより 近く」。 おみくじや 映画の 予告で よく 見る 言い回し"]],o:[
  ["\"Someone near you is thinking about you right now.\"","「すぐ そばの だれかが、 いま あなたを 思っている」",'b',3],["\"Eat more vegetables.\"","「野菜を もっと 食べよう」",'veg',1]]},
 veg:{m:["Ha ha ha! Yours is so useful! …Mine is useless. Or… maybe not useless. (She glances at you.)","あははは！ 店長の 役に 立つ！ …わたしの、 役に 立たない。 …それとも 立つかも。 （ちらっと 見る）"],ex:'laugh',o:[
  ["…","……",'b',2]]},
 b:{m:["(You both look at each other. Then look away at the same time.) …Fortune cookies are so random, right?! So random!","（ふたり、 目が あう。 同時に そらす） …おみくじクッキーって ほんと 適当 だよね？！ 適当！"],ex:'oops',p:'cheeks',o:[
  ["Totally random.","ほんと 適当。",'end1',2],["Maybe they're right sometimes.","たまには 当たる かも。",'end2',4]]},
 end1:{m:["Yes! Random! …I'm keeping mine, though. In my wallet. For… recycling.","うん！ 適当！ …でも わたしのは とっておく。 おさいふに。 …リサイクル 用に。"],ex:'wink',end:'good'},
 end2:{m:["…Sometimes. …Yeah. Sometimes they're right. (She doesn't look up for a long time.)","…たまには。 …うん。 たまには 当たるよね。 （しばらく 顔を あげなかった）"],ex:'smile',p:'cheeks',end:'good'}})
);

/* ================================================================ 💓 ミナ先生の ドキドキ（ミナ先生との 時間の ボタンから） */
const M_=(id,st,ico,t,nodes)=>({id,who:'mina',st,ico,t,nodes});
const DOKI_MINA=[
M_('dm_ribbon',1,'🎀','ネクタイ',{
 s:{m:["Wait. Your collar is crooked. Hold still. (She reaches up and fixes it.) There. A good student should look neat.","まって。 えりが まがってる。 じっと してて。 （手を のばして なおす） はい。 いい 生徒は きちんと しないとね。"],ex:'smile',o:[
  ["Thank you, Sensei.","ありがとうございます、 先生。",'a',2],["(Look down at her.)","（先生を 見おろす）",'a',3]]},
 a:{m:["(She notices how close your faces are.) …… (She freezes, still holding your collar.) …I— um— that's— the lesson! Today's lesson is \"neat\"! N-E-A-T!","（顔の 近さに 気づく） …… （えりを もった まま かたまる） …わ、 わたし— その— じゅ、 授業！ きょうの 単語は 「neat」！ N-E-A-T！"],ex:'wow',
  nt:[["Hold still.","「じっと してて」。 髪や 服を なおして あげる ときの ことば"],["neat","「きちんと した」"]],o:[
  ["You can let go of my collar now.","もう えり、 はなして いいですよ。",'end1',3],["Your face is red, Sensei.","先生、 顔が 赤いです。",'end2',2],["N-E-A-T.","N-E-A-T。",'end3',1]]},
 end1:{m:["…! (She lets go so fast she almost falls.) I-I knew that! I was checking the… fabric! Good fabric!","…！ （いきおい よく はなして ころびそうに なる） し、 知ってた！ 生地を… たしかめてたの！ いい 生地！"],ex:'wow',end:'good'},
 end2:{m:["It's NOT! It's… the classroom is hot! Open the window! …The window is already open. …Class dismissed!","赤くない！ 教室が… あついの！ 窓 あけて！ …もう あいてる。 …きょうは おしまい！"],ex:'worry',end:'good'},
 end3:{m:["…Good. Very good. …(She quietly fans her face with the textbook.)","…よろしい。 とても よろしい。 …（教科書で そっと 顔を あおぐ）"],ex:'smile',end:'fun'}}),
M_('dm_fever',1,'🌡️','おでこで 熱',{
 s:{m:["You look tired today. Are you sick? Come here. (She puts her forehead against yours.) …Hmm.","きょう つかれた顔 してる。 熱 ある？ こっち 来て。 （おでこを くっつける） …んー。"],ex:'think',o:[
  ["(Stay still.)","（じっと する）",'a',3],["S-Sensei?!","せ、 先生？！",'a',2]]},
 a:{m:["You're burning up! …Wait. Your face got hot just now. Is that… because of me? …………!!! (She jumps back.)","あつい！ …まって。 いま 急に あつく なった。 それって… わたしの せい？ …………！！！ （とびのく）"],ex:'wow',
  nt:[["You're burning up!","「熱が すごい！」。 burn up ＝ 熱が 高い（もえるように あつい）"]],o:[
  ["It's because of you.","先生の せいです。",'end1',4],["I'm fine. Really.","だいじょうぶです。",'end2',2],["Do it again to check.","もう一回 はかって。",'end3',2]]},
 end1:{m:["……… W-we use a thermometer from now on! A thermometer! That's the rule! …(She hides behind the textbook.)","……… こ、 これからは 体温計！ 体温計を つかいます！ 決まり！ …（教科書の うしろに かくれる）"],ex:'worry',end:'good'},
 end2:{m:["G-good. Then… then I'm the one with the fever. Probably. …I'll go drink some water.","よ、 よかった。 じゃあ… 熱が あるのは わたしの ほう かも。 …お水 飲んでくる。"],ex:'worry',end:'good'},
 end3:{m:["N-no! Once is enough! A teacher only checks once! …(But she keeps glancing at your forehead for the rest of the lesson.)","だ、 だめ！ 1回で じゅうぶん！ 先生は 1回しか はからないの！ …（でも 授業中 ずっと おでこを ちらちら 見ていた）"],ex:'worry',end:'fun'}}),
M_('dm_shelf',1,'📚','本だなの 前',{
 s:{m:["Can you reach that dictionary on the top shelf? I'm not tall enough.","いちばん 上の 辞書、 とれる？ 先生じゃ とどかなくて。"],ex:'smile',o:[
  ["(Reach over her for the book.)","（先生の うしろから 手を のばす）",'a',3]]},
 a:{m:["(She turns around. You're right in front of her, your arm above her head.) …! …Th-thank you. …Um. You're… kind of close.","（ふりむくと、 すぐ 目の前。 頭の 上に 店長の うで） …！ …あ、 ありがと。 …えっと。 その… ちょっと 近い、 かな。"],ex:'wow',
  nt:[["You're kind of close.","「ちょっと 近い かな」。 kind of で やわらかく。 照れた ときの 定番"],["Personal space!","「近いってば！」。 自分の まわりの 空間を まもる ときの ことば"]],o:[
  ["Sorry. (Step back.)","すみません。（はなれる）",'end2',2],["Is that bad?","だめ ですか？",'end1',4],["Here's the dictionary.","辞書です。",'end3',1]]},
 end1:{m:["It's not… bad. It's just— my heart— the dictionary! Give me the dictionary! I need to look up \"calm\"!","だめじゃ… ないけど。 ただ— 心臓が— 辞書！ 辞書 ちょうだい！ 「calm」を 引かなきゃ！"],ex:'worry',end:'good'},
 end2:{m:["…Thank you. (She hugs the dictionary tightly.) …You're a very… polite student.","…ありがと。 （辞書を ぎゅっと だきしめる） …とても… 礼儀正しい 生徒ね。"],ex:'smile',end:'good'},
 end3:{m:["…Right. The dictionary. That's what we were doing. Ha ha… ha.","…そうね。 辞書。 そのために 来たんだった。 あは… は。"],ex:'think',end:'fun'}}),
M_('dm_guess',1,'🙈','だーれだ',{
 s:{m:["(Someone covers your eyes from behind.) Guess who!","（うしろから 目かくし） だーれだ！"],ex:'happy',o:[
  ["Mina-sensei.","ミナ先生。",'a',2],["Mio?","ミオ？",'mio',3],["Hamako?","ハマ子？",'a',1]]},
 mio:{m:["…Mio-san? (She lets go.) …Why did you think it was Mio-san? …Hmm. Hmmm.","…ミオさん？ （手を はなす） …なんで ミオさんだと 思ったの？ …ふーん。 ふーーん。"],ex:'think',o:[
  ["Just a joke!","じょうだんです！",'a',2]]},
 a:{m:["Correct! …Wait. Why did I do that? Teachers don't do \"guess who\"! …I saw you and my hands just… moved!","正解！ …まって。 なんで わたし こんな こと したの？ 先生は 「だーれだ」 しないよ！ …見かけたら 手が 勝手に…！"],ex:'wow',
  nt:[["Guess who!","「だーれだ！」。 うしろから 目を かくして 言う あそび"]],o:[
  ["I liked it.","うれしかったです。",'end1',3],["Your hands were cold.","手、 つめたかった です。",'end2',2],["Do it again tomorrow.","あしたも やって ください。",'end3',2]]},
 end1:{m:["…You did? …No! Forget it! It never happened! This is a no-\"guess who\" zone!","…ほんと？ …だめ！ わすれて！ なかった ことに！ ここは 「だーれだ」 禁止区域です！"],ex:'worry',end:'good'},
 end2:{m:["Because I was nervous! …I mean, because it's winter! …It's summer. …I'm going home!","緊張して たから！ …じゃなくて、 冬 だから！ …いま 夏。 …帰る！"],ex:'worry',end:'good'},
 end3:{m:["T-tomorrow?! …We'll see. Maybe. If my hands move by themselves again.","あ、 あした？！ …どうかな。 たぶん。 また 手が 勝手に うごいたら。"],ex:'love',end:'fun'}}),
M_('dm_door',1,'🚪','ドアで 鉢合わせ',{
 s:{m:["(You open the classroom door just as Mina-sensei is coming out. You almost crash.) Oh!","（教室の ドアを あけた しゅんかん、 出てきた ミナ先生と ぶつかりそうに なる） あっ！"],ex:'wow',o:[
  ["(Freeze.)","（かたまる）",'a',2],["(Catch her shoulders.)","（肩を ささえる）",'a',3]]},
 a:{m:["…… (Neither of you moves for three seconds.) …After you. No— you first. No— …why are we both still standing here?","…… （3びょう、 どちらも うごかない） …どうぞ。 じゃなくて— 先に どうぞ。 いや— …なんで ふたりとも まだ ここに 立ってるの？"],ex:'think',
  nt:[["After you.","「お先に どうぞ」。 ドアの 前の ていねいな ゆずり方"]],o:[
  ["Because I don't want to move.","うごきたく ないから。",'end1',4],["After you, Sensei.","お先に どうぞ、 先生。",'end2',2],["Let's go at the same time.","同時に 行きましょう。",'end3',1]]},
 end1:{m:["……! (She ducks under your arm and runs down the hallway.) DON'T RUN IN THE HALL! …I'm running! I know!","……！ （うでの 下を くぐって、 ろうかを 走っていく） ろうかは 走らない！ …わたし 走ってる！ わかってる！"],ex:'worry',end:'good'},
 end2:{m:["Th-thank you. Such good manners. …(She walks away very stiffly, like a robot.)","あ、 ありがと。 礼儀正しいね。 …（ロボットみたいに かたく 歩いていく）"],ex:'smile',end:'good'},
 end3:{m:["(You both try to go through at once and get stuck.) …This is a very small door. …Ha ha ha!","（同時に 出ようとして はさまる） …この ドア、 せまいね。 …あははは！"],ex:'happy',end:'fun'}}),
M_('dm_praise',2,'🌸','ほめられて',{
 s:{m:["Your essay was wonderful. Especially this line: \"My teacher's smile is the reason I like English.\" …Um. Who is this teacher?","作文、 すばらしかった。 とくに この 文。 「先生の 笑顔が、 ぼくが 英語を 好きな 理由です」 …えっと。 この 先生って だれ？"],ex:'think',o:[
  ["You, Sensei.","先生です。",'a',4],["A different teacher.","べつの 先生です。",'diff',1]]},
 diff:{m:["A different… (Her face falls.) …I see. That's nice. …Which teacher? I'm just curious. Not jealous. Just curious.","べつの… （しゅんと する） …そう。 よかったね。 …どの 先生？ 気に なる だけ。 やきもち じゃ ないよ。 気に なる だけ。"],ex:'worry',o:[
  ["Just kidding. It's you.","じょうだんです。 先生です。",'a',3]]},
 a:{m:["…Me? …Stop it, you're making me blush. A teacher shouldn't… I'll give you an A. Not because of that line! Because of the grammar!","…わたし？ …やめて、 照れちゃう。 先生が そんな… A を あげます。 その 文の せいじゃ ないよ！ 文法が いいから！"],ex:'love',
  nt:[["Stop it, you're making me blush.","「やめて、 照れちゃう」。 ほめられた ときの 照れかくし"]],o:[
  ["Only the grammar?","文法 だけ ですか？",'end1',3],["Thank you, Sensei.","ありがとうございます。",'end2',2],["Can I get an A plus?","A＋ は だめ ですか？",'end3',1]]},
 end1:{m:["…And maybe 2% because of the line. …3%. …Don't make me say a number!","…あと 2%くらいは その 文の せい。 …3%。 …数字 言わせないで！"],ex:'worry',end:'good'},
 end2:{m:["…(She reads the essay again when she thinks you're not looking. Then again.)","…（店長が 見てない と 思って、 作文を もう一回 読む。 そして もう一回）"],ex:'love',end:'good'},
 end3:{m:["No! An A is already… too much favoritism! …Fine. A. With a tiny plus. Very tiny.","だめ！ A でも もう… ひいき しすぎ！ …いいよ。 A。 小さい ＋ つき。 すごく 小さい。"],ex:'happy',end:'fun'}}),
M_('dm_nap',2,'😴','先生の うたた寝',{
 s:{m:["(Mina-sensei has fallen asleep at her desk, on a pile of tests. A pen is still in her hand.) …mm… good job… everyone…","（ミナ先生が テストの 山の 上で ねむっている。 ペンを にぎった まま） …んー… よく できました… みんな…"],ex:'think',o:[
  ["(Put a blanket on her shoulders.)","（肩に ブランケットを かける）",'a',3],["(Take the pen out of her hand.)","（ペンを そっと とる）",'a',2]]},
 a:{m:["(Her eyes open slowly. She sees you.) …Mm… Is it morning? …Wait. WAIT. Was I sleeping? Did you see my face? Did I talk?","（ゆっくり 目が あく。 店長と 目が あう） …ん… 朝？ …まって。 まって。 ねてた？ 顔 見た？ ねごと 言ってた？"],ex:'wow',o:[
  ["You said \"good job, everyone.\"","「よく できました、 みんな」って。",'b',2],["You said my name.","ぼくの 名前を 言ってました。",'name',4],["You were snoring a little.","ちょっと いびき。",'end3',0]]},
 name:{m:["I did NOT! …Did I? …What else did I say? No— don't tell me! I'll never sleep again!","言ってない！ …言った？ …ほかに なに 言った？ だめ— 言わないで！ もう 一生 ねない！"],ex:'worry',o:[
  ["Just my name.","名前だけ です。",'b',3]]},
 b:{m:["(She finds the blanket on her shoulders.) …You did this? …Thank you. …A teacher shouldn't let a student see her like this.","（肩の ブランケットに 気づく） …これ、 あなたが？ …ありがと。 …先生が 生徒に こんな ところ 見せちゃ だめ なのに。"],ex:'love',o:[
  ["I'm glad I saw it.","見られて よかったです。",'end1',4],["You work too hard, Sensei.","先生、 がんばりすぎです。",'end2',3]]},
 end1:{m:["……… (She pulls the blanket over her head.) …Go home. The lesson is over. …Thank you. …Go home!","……… （ブランケットを 頭まで かぶる） …帰って。 授業は おわり。 …ありがと。 …帰って！"],ex:'worry',end:'good'},
 end2:{m:["…You're right. …Then will you stay a little longer? Just until I finish grading. It's… less lonely.","…そうね。 …じゃあ もう少し いて くれる？ 採点が おわるまで。 その… さみしく ないから。"],ex:'love',end:'good'},
 end3:{m:["I don't snore! Teachers don't snore! …(She writes \"I don't snore\" on the blackboard ten times.)","いびき なんて かかない！ 先生は かかない！ …（黒板に 「I don't snore」を 10回 書く）"],ex:'worry',end:'fun'}}),
M_('dm_jeal',2,'😶','ミオさんの こと',{
 s:{m:["I saw you at the card shop today. You and Mio-san were laughing a lot. …You two are close, huh.","きょう カードショップで 見かけたよ。 ミオさんと ずいぶん 笑ってたね。 …なかよし なんだね。"],ex:'think',o:[
  ["Are you jealous, Sensei?","先生、 やきもち ですか？",'a',3],["She's my coworker.","バイトの なかま ですから。",'b',2]]},
 a:{m:["J-jealous?! Me? Of course not! I'm a teacher! Teachers don't get jealous! …Why would I be jealous? There's no reason! None!","や、 やきもち？！ わたしが？ まさか！ 先生だよ！ 先生は やかないの！ …なんで わたしが やくの？ 理由が ない！ ぜんぜん！"],ex:'worry',
  nt:[["I'm not jealous!","「やきもち なんか やいてない！」。 強く 言うほど ばれる 定番の セリフ"]],o:[
  ["You said \"none\" very loudly.","「ぜんぜん」が 大きな 声 でした。",'end1',3],["I'm happiest when I'm with you.","先生と いる ときが いちばん 楽しいです。",'end2',4]]},
 b:{m:["Coworker. Right. …Good. I mean, good that you have a coworker! Teamwork is important! …I'm going to stop talking now.","バイトの なかま。 そう。 …よかった。 じゃなくて、 なかまが いて よかった！ チームワークは 大事！ …もう しゃべるの やめるね。"],ex:'think',o:[
  ["Are you jealous?","やきもち ですか？",'a',3]]},
 end1:{m:["……I'm going to give you extra homework. For no reason. Not jealousy. No reason.","……宿題 ふやします。 理由は ない。 やきもち じゃ ない。 理由は ない。"],ex:'worry',end:'good'},
 end2:{m:["……! …… …Okay. …(She smiles at the blackboard for a very long time.)","……！ …… …そっか。 …（黒板に むかって、 長い あいだ にこにこ していた）"],ex:'love',end:'good'}}),
M_('dm_name',2,'📛','名前で よばれて',{
 s:{m:["(Mina-sensei is calling the roll.) …Next. (She says your first name, without the family name.) …Oh! S-sorry! I meant the family name! I always— I mean, I never—","（ミナ先生が 出席を とっている） …つぎ。 （名字じゃ なく、 下の 名前を よぶ） …あっ！ ご、 ごめん！ 名字の つもりで！ いつも— じゃなくて、 いつもは—"],ex:'wow',o:[
  ["Here.","はい。",'a',2],["You can call me that.","それで いいですよ。",'a',3]]},
 a:{m:["(She covers her face with the attendance book.) …I practice saying it at home. Not on purpose! It just… comes out. Like a habit. Forget I said that.","（出席簿で 顔を かくす） …家で 練習してるの。 わざと じゃ ないよ！ 勝手に… 出ちゃうの。 くせ みたいに。 いまの わすれて。"],ex:'worry',
  nt:[["Forget I said that.","「いまの わすれて」。 言いすぎた ときの 照れかくし"]],o:[
  ["Can you say it again?","もう一回 よんで くれますか？",'end1',4],["I'll call you Mina, then.","じゃあ ぼくも 「ミナ」って よびます。",'end2',3],["Next name, please.","つぎの 人 どうぞ。",'end3',1]]},
 end1:{m:["……(Very quietly, she says it again.) …There. That's the last time. Today. …Maybe.","……（とても 小さな 声で、 もう一度） …はい。 これで おしまい。 きょうは。 …たぶん。"],ex:'love',end:'good'},
 end2:{m:["M-Mina?! Without \"sensei\"?! That's ten years too early! …Five. Five years. …Maybe one.","ミ、 ミナ？！ 「先生」 なしで？！ 10年 早い！ …5年。 5年 早い。 …1年 かも。"],ex:'wow',
  nt:[["That's ten years too early!","「10年 早い！」。 日本語の 言い方を そのまま 英語に した 感じ。 英語では You're not ready for that! などが 近い"]],end:'good'},
 end3:{m:["Y-yes. Next! …(She calls the next three names wrong.)","そ、 そうね。 つぎ！ …（つぎの 3人の 名前を まちがえた）"],ex:'think',end:'fun'}}),
M_('dm_walk',2,'🌇','帰り道',{
 s:{m:["Oh, you're going this way too? …Then let's walk together. As teacher and student. For safety.","あ、 こっちの 道？ …じゃあ いっしょに 帰ろ。 先生と 生徒として。 安全の ために。"],ex:'smile',o:[
  ["For safety.","安全の ために。",'a',2]]},
 a:{m:["(Walking side by side. Your hands almost touch. She moves hers away. Then back.) …The sunset is pretty. Isn't it. Very… pretty.","（ならんで 歩く。 手が ふれそうに なる。 先生が 手を はなす。 また もどす） …夕日、 きれいね。 そうでしょ。 とても… きれい。"],ex:'think',o:[
  ["(Let your hands touch.)","（手を ふれさせる）",'b',3],["Yes. Very pretty.","はい。 きれいです。",'b',2]]},
 b:{m:["…! (Her pinky touches yours. She doesn't move it.) …This is… for safety. The road is dark. A teacher must… protect her student.","…！ （小指が ふれる。 先生は うごかさない） …これは… 安全の ため。 道が 暗いから。 先生は 生徒を… まもらないと。"],ex:'love',
  nt:[["pinky","「小指」。 pinky promise ＝ ゆびきり"]],o:[
  ["Thank you for protecting me.","まもって くれて ありがとうございます。",'end1',4],["It's not dark yet.","まだ 暗く ないですよ。",'end2',2],["(Hold her hand.)","（手を にぎる）",'end1',4]]},
 end1:{m:["…You're welcome. …(Neither of you says anything else until her house. Your pinkies stay together the whole way.)","…どういたしまして。 …（先生の 家まで、 ふたりとも なにも 言わなかった。 小指は ずっと ふれた まま だった）"],ex:'love',end:'good'},
 end2:{m:["It's— it WILL be dark! Soon! In an hour! …Better safe than sorry!","く、 暗く なるの！ もうすぐ！ 1時間後に！ …備えあれば うれいなし！"],ex:'worry',
  nt:[["Better safe than sorry.","「備えあれば うれいなし」。 あとで こまるより 安全に、 という ことわざ"]],end:'fun'}})];

/* ミナ先生の ドキドキ: 気になる 人（st1）から。 ミオを えらんだ あとは 出ない */
const LVst=()=>{try{return LOVE.rec().st||0}catch(e){return 0}};
const minaList=()=>W()==='mio'?[]:DOKI_MINA.filter(t=>t.st<=LVst());
const MR=()=>MIOC.rec();
const isNew=t=>!(MR().n||{})[t.id];
const newN=()=>minaList().filter(isNew).length;
const endsOf=t=>Object.keys(t.nodes).filter(k=>t.nodes[k].end);
function minaOpen(back){const H=HE,esc=H.esc,L=minaList(),M=MR();try{speechSynthesis.cancel()}catch(e){}
  let [ex,tx]=['love','…な、 なに？ べつに なにも ないよ？'];try{[ex,tx]=MINA.line('dk_list',{})}catch(e){}
  H.show('love',`<section class="pnl lvp">
    <div class="qtop"><button class="x" id="dkx" aria-label="もどる">←</button><b>💓 ドキドキ</b><span class="qn">${L.length}</span></div>
    <div class="mtalk"><span class="mbig lvbig">${MINA.face('m',ex)}</span><p class="mline">${tx}</p></div>
    <div class="mcls">${L.map(t=>{const e=endsOf(t),n=e.filter(k=>M.ends[t.id+':'+k]).length;
      return `<button data-k="${t.id}"><span>${t.ico}</span><b>${esc(t.t)}</b><i>${n>=e.length?'★':`${n}/${e.length}`}</i>${isNew(t)?'<u>NEW</u>':''}</button>`}).join('')}</div>
    ${DOKI_MINA.some(t=>t.st>LVst())?'<p class="note">ふたりの 段階が 上がると ふえるよ</p>':''}
  </section>`);
  document.getElementById('dkx').onclick=()=>{try{BEACH.sfx.back()}catch(e){}back()};
  H.panel.querySelectorAll('[data-k]').forEach(b=>b.onclick=()=>{try{BEACH.sfx.step()}catch(e){}MIOC.play(DOKI_MINA.find(t=>t.id===b.dataset.k),()=>minaOpen(back))})}

Object.assign(MINA_LINES,{
 mc_doki:[['smile','ふふ、 ミオさん 照れてたね。 「It\'s not like ～!」みたいな 照れかくし、 英語にも いっぱい あるよ'],['think','💌 ことばメモ、 見てみて。 ドキドキした ときの 英語って、 映画でも よく 聞くよ'],['happy','いまの やりとり、 ぜんぶ 英語で できたね。 気持ちが 動くと ことばも おぼえやすいんだ']],
 dk_list:[['worry','…な、 なに？ この リストは… 先生の しっぱい集じゃ ないからね！'],['love','…あの ときの こと、 おぼえてる？ わ、 わすれて いいからね'],['think','ドキドキの… 記録？ だれが こんな もの つけてるの…']],
 x_dokiMina:[['worry','…きょうの 授業、 ちょっと 近すぎたかな… な、 なんでもない！'],['love','…この前の こと、 だれにも 言ってないよね？']]});
if(window.MINA_SENSE&&MINA_SENSE._rules)MINA_SENSE._rules.push(
 ['x_dokiMina',2,()=>newN()?{}:null,()=>['💗 ミナ先生との 時間へ',()=>LOVE.open(HE.home)]]);

window.DOKI={minaOpen,minaList,newN};
})();
