/* 🌹 かくし要素: 夜の バラの 香水（雑貨店に ときどき ならぶ レア品。 ミオと 再会した あとから）
   - ミオに あげると 「🌹 ふたりきりの 時間」の 会話が ひらく（ミオは 恋に 積極的・ノリが いい）
   - ミナ先生（恋人より 先、 ミオを えらんで いない とき）に あげると 「🙈 先生、 それは…」（ミナ先生は 奥手）
   - 書くのは 思わせぶりな セリフ・からかい・手や 髪や 頬に ふれる・だきよせる・キスまで。 その先は 場面を とばす。
     どこに ふれたかは 書かない（相手の ツッコミで わかる）。 体や 下着が 見える ネタは 書かない
   - 💌 ことばメモで 映画や ドラマで よく 聞く 大人の 英語を 解説 */
(()=>{
const seenT=(M,id)=>!!(M.n&&M.n[id]);
const ok=M=>M.lover&&!M.alt&&(M.c||0)>=2&&M.spicy;
MIO_TALKS.push(
{id:'sp_rose',mk:'mc_sp',st:5,ico:'🌹',t:'夜の バラ',if:ok,nodes:{
 s:{m:["(Mio opens the little bottle and smells it.) \"Midnight Rose\"… Do you know what Nora-san told me about this perfume? She said it makes people brave.","（ミオが 小さな びんを あけて かおりを かぐ） 「ミッドナイト・ローズ」… ノラさんが この 香水の こと なんて 言ってたか 知ってる？ 人を 大胆に するんだって。"],ex:'wink',o:[
  ["Is that why I bought it?","だから 買ったのかもね。",'a',3],["I just thought it smelled nice.","いい かおりだと 思っただけだよ。",'innocent',2]]},
 innocent:{m:["\"Just smelled nice\"? Hmm. Your ears are red, you know.","「いい かおりだと 思っただけ」？ ふーん。 耳、 赤いよ？"],ex:'wink',o:[
  ["…Maybe a little brave.","…ちょっとだけ 大胆に なりたかった。",'a',3]]},
 a:{m:["(She puts a drop on her wrist and holds it up to you.) Well? How do I smell? You have to come closer to check.","（手首に ひとしずく つけて、 さしだす） どう？ いい におい？ たしかめるには もっと 近くに 来ないと。"],ex:'smile',p:'cheeks',
  nt:[["Come closer.","「もっと 近くに 来て」。 映画の 甘い 場面の 定番。 Closer.（もっと）の ひとことでも"]],o:[
  ["(Come closer.) You smell amazing.","（近づく） すごく いい かおり。",'b',3],["(Take her hand gently.)","（そっと 手を とる）",'b',4]]},
 b:{m:["…You're staring at my lips. My eyes are up here, you know. Ha ha… Are you checking me out?","…くちびる 見てるでしょ。 目は こっちですよー。 あはは… わたしに 見とれてた？"],ex:'wink',p:'cheeks',
  nt:[["My eyes are up here.","「目は こっち」。 じろじろ 見る 相手への、 映画で おなじみの ツッコミ"],["Are you checking me out?","「いま 見とれてたでしょ？」。 check ～ out ＝ 気になる 人を（こっそり）見る"]],o:[
  ["Guilty.","バレた。",'c',3],["Can you blame me? You look stunning.","しかたないよ。 すごく きれいだもん。",'c',4],["I was looking at the… stars behind you.","うしろの… 星を 見てた。",'stars',1]]},
 stars:{m:["There are no stars behind me. That's a wall. …Nice try.","うしろに 星は ないよ。 かべです。 …いい 言いわけ。"],ex:'laugh',o:[
  ["…Guilty.","…バレた。",'c',3]]},
 c:{m:["(She leans in and whispers.) The shop closes in ten minutes. …Are you thinking what I'm thinking?","（ミオが 顔を よせて ささやく） お店、 あと 10分で 閉店。 …わたしと 同じ こと 考えてる？"],ex:'smile',p:'cheeks',
  nt:[["You look stunning.","「息を のむほど きれい」。 beautiful より 強い ほめ言葉"],["Are you thinking what I'm thinking?","「わたしと 同じ こと 考えてる？」。 なにかを たくらむ ときの 定番。 ロマンチックにも いたずらにも"]],o:[
  ["I think so.","たぶんね。",'end1',4],["Ice cream?","アイス？",'end3',1],["Is this okay? I don't want to rush you.","いいの？ あせらせたく ないんだ。",'end2',5]]},
 end1:{m:["(She kisses you, slow.) …Later. Now go flip the sign to \"Closed.\" Quickly, partner.","（ゆっくり キスを する） …つづきは あとで。 さあ 看板を 「Closed」に して。 早く、 パートナー。"],ex:'wink',p:'cheeks',end:'good'},
 end2:{m:["…You always ask. That's one of the reasons I love you. Yes. It's more than okay. (She pulls you closer.)","…あなたって いつも 聞いてくれる。 そういう ところも 好きな 理由。 うん。 ぜんぜん いいよ。 （ミオが ぐっと 引きよせる）"],ex:'smile',p:'cheeks',
  nt:[["Is this okay?","「これ、 いい？」。 ふれる 前に 気持ちを たしかめる ことば。 英語圏の 大人の 恋の 基本"]],end:'good'},
 end3:{m:["Ice cream?! …Ha ha ha! You ruined the mood! …OK, ice cream first. Then I'm thinking what I'm thinking.","アイス？！ …あははは！ ムード ぶちこわし！ …いいよ、 アイスが 先。 そのあとは わたしの 考えてる ことね。"],ex:'laugh',end:'fun'}}},

{id:'sp_closed',mk:'mc_sp',st:5,ico:'🔒',t:'閉店後の お店',if:M=>ok(M)&&seenT(M,'sp_rose'),nodes:{
 s:{m:["(After closing. Mio is counting the register.) Two hundred… two hundred and ten… Hey. I can feel you standing right behind me.","（閉店後。 ミオが レジの お金を かぞえている） 200… 210… ねえ。 うしろに 立ってるの、 わかってるよ。"],ex:'smile',o:[
  ["(Hug her from behind.)","（うしろから だきしめる）",'a',3],["Need help counting?","かぞえるの 手伝う？",'help',2]]},
 help:{m:["\"Help.\" Sure. That's what you call it. …Come here, then.","「手伝う」ね。 そういう ことに しておく。 …じゃあ、 こっち 来て。"],ex:'wink',o:[
  ["(Hug her from behind.)","（うしろから だきしめる）",'a',3]]},
 a:{m:["(She leans back against you.) …Hey! Hands where I can see them, mister! I'm still counting!","（ミオが もたれかかる） …こら！ 手は 見える ところに！ まだ かぞえてるんだから！"],ex:'oops',p:'cheeks',
  nt:[["Hands where I can see them!","「手は 見える ところに！」。 刑事ドラマの 決まり文句を、 恋人どうしの じゃれあいに 使う 言い方"],["mister","「ちょっと あなた」。 からかう ときに 男性を よぶ 言い方"]],o:[
  ["Sorry. (Put your hands up.)","ごめん。（両手を あげる）",'b',2],["I can't help it.","がまん できない。",'b',3]]},
 b:{m:["(She turns around, laughing.) You're impossible. …Not in the shop. The window faces the beach. Customers can see us!","（ミオが 笑いながら ふりむく） ほんと こまった 人。 …お店では ダメ。 窓が 浜辺に 向いてるの。 お客さんに 見られちゃう！"],ex:'laugh',p:'cheeks',
  nt:[["I can't help it.","「どうしようも ない（がまん できない）」。 can't help ～ing で 「～せずに いられない」"]],o:[
  ["Then let's close the curtains.","じゃあ カーテン しめよう。",'c',3],["Then let's go upstairs.","じゃあ 2階に 行こう。",'c',4]]},
 c:{m:["(She bites her lip, then smiles.) …Behave yourself. …At least until we get upstairs.","（くちびるを かんで、 にやっと 笑う） …おとなしく しなさい。 …せめて 2階に 行くまでは。"],ex:'wink',p:'cheeks',
  nt:[["Behave yourself!","「おとなしく しなさい！」。 子どもを しかる ことばを、 大人が 恋人に 言うと からかいに なる"]],o:[
  ["Yes, ma'am.","はい、 わかりました。",'end1',3],["Race you there!","競争だ！",'end2',3],["You forgot to finish counting.","かぞえるの、 わすれてる。",'end3',1]]},
 end1:{m:["\"Yes, ma'am.\" Good boy. …(She takes your hand and turns off the lights.)","「はい、 わかりました」。 よろしい。 …（ミオが 手を とって、 明かりを けす）"],ex:'smile',p:'cheeks',end:'good'},
 end2:{m:["Hey, no fair! You got a head start! …(Her laughter echoes up the stairs.)","ちょっと、 ずるい！ フライング！ …（ミオの 笑い声が 階段に ひびく）"],ex:'laugh',end:'good'},
 end3:{m:["…I lost count. Because of SOMEONE. It's two hundred and… whatever. I'll count tomorrow.","…わからなく なった。 だれかさんの せいで。 200… なんとか。 あした かぞえる。"],ex:'oops',end:'fun'}}},

{id:'sp_movie',mk:'mc_sp',st:5,ico:'🎬',t:'映画の 夜',if:M=>ok(M)&&seenT(M,'sp_rose'),nodes:{
 s:{m:["Movie night! Do you want to watch a movie… or \"watch a movie\"? Ha ha!","映画の 夜！ 映画、 見る？ それとも… 「映画を 見る」？ あはは！"],ex:'wink',o:[
  ["What's the difference?","なにが ちがうの？",'diff',2],["The second one.","うしろの ほうで。",'a',4],["A movie. A real one.","映画。 ふつうの。",'real',2]]},
 diff:{m:["In English, when someone says \"Do you want to come over and watch a movie?\" late at night, sometimes… nobody watches the movie. Like \"Netflix and chill.\"","英語で 夜おそく 「うちに 来て 映画 見ない？」って 言うと、 ときどき… だれも 映画を 見ないの。 「Netflix and chill」みたいに。"],ex:'laugh',
  nt:[["Netflix and chill","「家で 映画でも」の ふりを した さそい文句。 ネットで 広まった ジョーク。 本当に 映画だけ 見たい ときは 使わない ほうが いい"],["come over","「うちに 来る」。 Do you want to come over?（うちに 来ない？）"]],o:[
  ["Ah… I see.","あ… なるほど。",'a',2]]},
 real:{m:["A real one! OK! …I picked a romance movie anyway. It's research. For my English.","ふつうの ね！ いいよ！ …どっちにしても 恋愛映画を えらんだけど。 研究です。 英語の。"],ex:'smile',o:[
  ["For your English. Of course.","英語の ため。 もちろん。",'a',2]]},
 a:{m:["(Under one blanket on the sofa. Halfway through the movie, she's leaning on your shoulder.) …Hey. Where do you think that hand is going?","（ソファで 1まいの 毛布。 映画の なかばで、 ミオが 肩に もたれている） …ねえ。 その 手、 どこ 行くつもり？"],ex:'wink',p:'cheeks',
  nt:[["Where do you think that hand is going?","「その 手、 どこ 行くつもり？」。 本気で おこる ときにも、 じゃれあいにも 使う。 声の 調子で 意味が かわる"]],o:[
  ["…To the popcorn?","…ポップコーンに？",'pop',1],["Too far?","やりすぎ？",'b',4],["(Put your arm around her shoulder instead.)","（かわりに 肩に うでを まわす）",'b',3]]},
 pop:{m:["The popcorn is on the OTHER side. …Ha ha, you're the worst liar in the world.","ポップコーンは 反対がわ。 …あはは、 世界一 ウソが へた。"],ex:'laugh',o:[
  ["Too far?","やりすぎ？",'b',3]]},
 b:{m:["(She turns to face you.) …I didn't say stop. I just said I'm watching the movie. …Liar. I haven't watched any of it.","（ミオが こっちを 向く） …やめてとは 言ってない。 映画 見てるって 言っただけ。 …うそ。 ぜんぜん 見てない。"],ex:'smile',p:'cheeks',
  nt:[["I didn't say stop.","「やめてとは 言ってない」。 照れながらの OK の サイン"],["Too far?","「やりすぎ？」。 相手の 気持ちを 軽く たしかめる ひとこと"]],o:[
  ["Should I pause it?","止めようか？",'end1',4],["Let's watch the ending at least.","せめて さいごは 見よう。",'end2',2],["Tell me if you want me to stop.","いやなら 言ってね。",'end1',5]]},
 end1:{m:["Pause it. …We'll finish it tomorrow. Maybe. (She switches off the lamp.)","止めて。 …つづきは あした。 たぶん。 （ミオが ランプを けす）"],ex:'wink',p:'cheeks',end:'good'},
 end2:{m:["The ending? OK… (Five minutes later.) …They kissed. That's the ending. Our turn.","さいご？ いいよ… （5分後） …キスして おわり。 だよね。 じゃあ わたしたちの 番。"],ex:'smile',p:'cheeks',end:'good'}}},

{id:'sp_tease',mk:'mc_sp',st:5,ico:'💋',t:'からかい合戦',if:M=>ok(M)&&seenT(M,'sp_rose'),nodes:{
 s:{m:["New game! \"Make the other person blush.\" Whoever blushes first loses. Ready? …You look really good today.","新しい ゲーム！ 「相手を 赤くさせる」。 先に 赤く なったら 負け。 いい？ …きょう、 すごく かっこいいね。"],ex:'wink',o:[
  ["(Stay calm.) Thanks. You too.","（へいきな 顔で） ありがと。 ミオもね。",'a',2],["(Blush immediately.)","（すぐ 赤く なる）",'lose',1]]},
 lose:{m:["You lost in two seconds! New record! …Again, again!","2びょうで 負け！ 新記録！ …もう一回！"],ex:'laugh',o:[
  ["OK. My turn.","よし。 こっちの 番。",'a',2]]},
 a:{m:["My turn again! Ahem. …I can't stop thinking about last night.","また わたしの 番！ えへん。 …ゆうべの こと、 ずっと 考えちゃう。"],ex:'smile',p:'cheeks',o:[
  ["Me neither.","ぼくも。",'b',3],["(Say it in her ear.) I can't keep my hands off you.","（耳もとで） さわらずに いられないんだ。",'win',4]]},
 win:{m:["…! (Mio turns bright red.) That's… that's cheating! You can't whisper! Whispering is a weapon!","…！ （ミオが まっかに なる） そ、 それ ずるい！ ささやくの 反則！ ささやきは 武器！"],ex:'oops',p:'cheeks',
  nt:[["I can't keep my hands off you.","「さわらずに いられない」。 keep A off B ＝ A を B から はなしておく。 恋人どうしの 甘い 言い方"]],o:[
  ["You're blushing. You lose.","赤く なった。 ミオの 負け。",'end1',3]]},
 b:{m:["…Did you mean that? Then… (She steps closer.) Like what you see?","…本気？ じゃあ… （一歩 近づく） 気に いった？"],ex:'wink',p:'cheeks',
  nt:[["Like what you see?","「気に いった？」。 見とれている 相手を からかう 定番。 自信まんまんに 言うのが コツ"],["You're making me blush.","「照れさせないで」。 ほめられて 赤く なった ときの ことば"]],o:[
  ["Very much.","とても。",'end2',3],["You're making me blush.","照れるって。",'end3',1]]},
 end1:{m:["…Fine. I lost. The loser has to… give the winner a kiss. (Chu.) …That was the rule. I just made it.","…わかった。 負け。 負けた 人は… 勝った 人に キス。 （ちゅっ） …そういう ルール。 いま 決めた。"],ex:'smile',p:'cheeks',end:'good'},
 end2:{m:["\"Very much\"… OK, now I'm blushing. Draw! Nobody wins! …Or everybody wins. Ha ha.","「とても」… だめ、 赤く なった。 引き分け！ だれも 勝ちじゃ ない！ …それか、 みんな 勝ち。 あはは。"],ex:'laugh',p:'cheeks',end:'good'},
 end3:{m:["You blushed! I win! Winner gets… a whole day of you being my assistant. Starting now!","赤く なった！ わたしの 勝ち！ ごほうびは… あなたが 一日 わたしの 助手。 いまから！"],ex:'laugh',p:'thumb',end:'fun'}}},

{id:'sp_morning',mk:'mc_sp',st:5,ico:'👕',t:'あわてんぼうの 朝',if:M=>ok(M)&&seenT(M,'sp_closed'),nodes:{
 s:{m:["Good morning! …Wait. Wait, wait. Your shirt is inside out. And the tag is showing.","おはよう！ …まって。 まって まって。 シャツ、 うらがえし。 タグも 出てる。"],ex:'laugh',o:[
  ["…Whose fault is that?","…だれの せい だと 思う？",'a',3],["It's a new fashion.","新しい ファッション だよ。",'fashion',1]]},
 fashion:{m:["Ha ha! Then I'm fashionable too. My buttons are all wrong. Look, one, two, four…","あはは！ じゃあ わたしも おしゃれ。 ボタン ぜんぶ かけちがえてる。 ほら、 1、 2、 4…"],ex:'laugh',o:[
  ["Whose fault is THAT?","それは だれの せい？",'a',3]]},
 a:{m:["Not mine! Someone kept distracting me. …Someone with very cold hands. Ha ha.","わたしじゃ ない！ だれかさんが ずっと じゃま してたから。 …とっても 手の つめたい だれかさん。 あはは。"],ex:'wink',p:'cheeks',
  nt:[["Your shirt is inside out.","「シャツ、 うらがえしだよ」。 inside out ＝ うらがえし。 前後 さかさまは backwards"],["distract","「気を ちらす・じゃまを する」。 You're distracting me.（集中 できないでしょ）は 恋人の 定番の 文句"]],o:[
  ["Let me fix your buttons.","ボタン なおして あげる。",'b',3],["We're going to be late for opening.","開店に おくれるよ。",'late',2]]},
 late:{m:["Late! Again! …The third time this week. Nora-san is going to start asking questions.","おくれる！ また！ …今週 3回め。 ノラさんに なにか 聞かれちゃう。"],ex:'oops',o:[
  ["Let me fix your buttons first.","まず ボタン なおそう。",'b',3]]},
 b:{m:["(You fix her buttons, one by one.) …Hey. If you do it that slowly, we'll be even more late.","（ボタンを ひとつずつ なおす） …ねえ。 そんなに ゆっくり やったら、 もっと おくれちゃうよ。"],ex:'smile',p:'cheeks',o:[
  ["That's the plan.","それが ねらい。",'end1',4],["OK, OK. Done!","はい はい。 できた！",'end2',2],["Should I make them wrong again?","また かけちがえようか？",'end3',1]]},
 end1:{m:["…You're terrible. …OK, five more minutes. Then we REALLY open the shop. Promise?","…ほんと 困った 人。 …いいよ、 あと 5分。 そしたら ほんとに 開店ね。 約束？"],ex:'wink',p:'cheeks',end:'good'},
 end2:{m:["Thank you! Now flip your shirt, partner. A co-owner with an inside-out shirt is bad for business!","ありがとう！ さあ シャツを なおして、 パートナー。 うらがえしの 共同経営者は 商売に ひびく！"],ex:'laugh',p:'thumb',end:'good'},
 end3:{m:["No! …Maybe tonight. Ha ha!","だめ！ …今夜なら いいかも。 あはは！"],ex:'laugh',end:'fun'}}}
);

/* 🙈 ミナ先生（奥手）: 香水を もらった あと、 ミナ先生との 時間に 出る（なんども 見られる） */
const MINA_SHY={id:'mshy',who:'mina',ico:'🙈',t:'先生、 それは…',nodes:{
 s:{m:["(Mina-sensei smells the perfume and freezes.) M-Midnight Rose? Do you know what kind of perfume this is? Nora-san told me… never mind!","（ミナ先生が 香水の かおりを かいで かたまる） ミ、 ミッドナイト・ローズ？ これ どういう 香水か 知ってる？ ノラさんが 言ってたの… な、 なんでもない！"],ex:'wow',o:[
  ["What did Nora-san say?","ノラさん なんて？",'a',2],["It just smells nice.","いい かおり だから。",'a',2]]},
 a:{m:["Nothing! Let's… let's study! Today's lesson is… um… (You sit closer.) W-why are you sitting so close?","なんでもない！ べ、 勉強しよ！ きょうの 授業は… えっと… （となりに 近づいて すわる） な、 なんで そんなに 近いの？"],ex:'worry',o:[
  ["I want to see the textbook.","教科書が 見たくて。",'b',2],["Because I like being close to you.","先生の 近くが 好きだから。",'b',3]]},
 b:{m:["(You gently touch her hair.) …! W-wait! Not there— I mean… that's… that's not appropriate! I'm your teacher!","（そっと 髪に ふれる） …！ ちょ、 ちょっと！ そこは— じゃなくて… そ、 それは ふさわしくないよ！ わたし 先生だよ！"],ex:'wow',p:'chest',
  nt:[["That's not appropriate!","「それは ふさわしくない！」。 先生や 上司らしい かたい 言い方。 あわてて 使うと 照れかくしに なる"],["Not there!","「そこは ダメ！」。 どこかは 言わない のが 大人の 英語"]],o:[
  ["Sorry. Too fast?","ごめん。 早すぎた？",'c',4],["You're cute when you're flustered.","あわてる 先生、 かわいい。",'cute',2]]},
 cute:{m:["C-cute?! Don't say that in the classroom! …Not here! Someone might see us!","か、 かわいい？！ 教室で 言わないで！ …ここでは ダメ！ だれかに 見られちゃう！"],ex:'wow',
  nt:[["Not here!","「ここでは ダメ！」。 場所の せいに して ことわる、 照れ屋さんの 定番"]],o:[
  ["Sorry. I'll be good.","ごめん。 いい子に する。",'c',3]]},
 c:{m:["…It's not that I don't like it. I just… let's take it slow, okay? My heart is beating too fast. Listen. …No! Don't actually listen!","…いやって わけじゃ ないの。 ただ… ゆっくり いこ？ 心臓が ドキドキ しすぎて。 ほら、 聞いて。 …だめ！ ほんとに 聞かないで！"],ex:'love',p:'chest',
  nt:[["Let's take it slow.","「ゆっくり いこう」。 関係を あせらない ための やさしい ことば。 奥手な 人の 味方"]],o:[
  ["We can go as slow as you want.","先生の ペースで いいよ。",'end1',4],["Can I at least hold your hand?","手を つなぐのは いい？",'end2',4],["Your face is as red as the rose.","顔が バラみたいに 赤いよ。",'end3',1]]},
 end1:{m:["…Thank you. That's why I… (She kisses your cheek, very quickly.) …That's all for today! Class dismissed!","…ありがとう。 だから わたし… （ほっぺに いっしゅん キス） …きょうは ここまで！ 授業 おわり！"],ex:'love',end:'good'},
 end2:{m:["…Hand is okay. Hand is very okay. (She holds your hand and doesn't let go for the rest of the lesson.)","…手は いい。 手は とっても いい。 （そのあと 授業が おわるまで、 手を はなさなかった）"],ex:'love',end:'good'},
 end3:{m:["Because of YOU! …And this perfume! I'm confiscating it! …I'll keep it on my nightstand. For safety.","あなたの せい！ …それと この 香水の！ ぼっしゅう です！ …まくらもとに おいとく。 安全の ために。"],ex:'happy',end:'fun'}}};

/* 雑貨店の かくし品 */
if(typeof ZAKKA_ITEMS!=='undefined')ZAKKA_ITEMS.push({id:'g_rose',k:'gift',ico:'🌹',n:'夜の バラの 香水',w:'perfume',p:600,rare:1,
 hid:()=>{try{const M=MIOC.rec();return M.lover&&!M.alt&&(M.c||0)>=2||(LOVE.rec().st>=3&&!(window.WED&&WED.who()==='mio'))}catch(e){return false}},
 a:["\"Midnight Rose.\" A little bottle of perfume for grown-ups. They say it makes shy people… brave. Ha ha.","「ミッドナイト・ローズ」。 大人の ための 小さな 香水よ。 照れ屋さんを… 大胆に するんですって。 うふふ。"],
 worth:["For a night you'll remember? I'd say yes.","わすれられない 夜の ため？ わたしは 買いだと 思うわ。"]});
if(typeof GIFT_TAGS!=='undefined')GIFT_TAGS['z:g_rose']=['love','cute','nature'];
if(typeof GIFT_PEOPLE!=='undefined'){if(GIFT_PEOPLE.mio)GIFT_PEOPLE.mio.love.push('z:g_rose');if(GIFT_PEOPLE.mina)GIFT_PEOPLE.mina.love.push('z:g_rose')}

/* プレゼントの あと（game/gift.js から）。 ひらいたら お知らせ */
function gift(to,it){if(!it||it.key!=='z:g_rose')return;
  try{if(to==='mio'){const M=MIOC.rec();if(M.lover&&!M.alt&&(M.c||0)>=2&&!M.spicy){M.spicy=1;CG.save();setTimeout(()=>HE.toast('🌹 ミオとの 「ふたりきりの 時間」が ひらいた…',4200),1200)}}
   else if(to==='mina'){const L=LOVE.rec();if(L.st>=3&&!(window.WED&&WED.who()==='mio')&&!L.spicy){L.spicy=1;save();setTimeout(()=>HE.toast('🙈 ミナ先生との 時間に 「先生、 それは…」が ふえた',4200),1200)}}}catch(e){}}
const minaOk=()=>{try{const L=LOVE.rec();return L.spicy&&L.st>=3&&!(window.WED&&WED.who()==='mio')}catch(e){return false}};

Object.assign(MINA_LINES,{
 mc_sp:[['smile','…ふふ。 大人の 英語だね。 「Behave yourself!」とか 「Is this okay?」とか、 映画でも よく 聞く 言い方だよ'],['think','💌 ことばメモ、 見た？ 言い方ひとつで、 じゃれあいにも 本気にも なるのが 英語の おもしろい ところ'],['happy','相手の 気持ちを たしかめる 英語は、 どんな 関係でも いちばん 大事だよ']],
 x_spRose:[['think','雑貨店に 「ミッドナイト・ローズ」って 香水が 入ってたよ。 …な、 なんでもない'],['worry','ノラさんの お店の バラの 香水… あれは 大人の ための ものだからね！']]});
if(window.MINA_SENSE&&MINA_SENSE._rules)MINA_SENSE._rules.push(
 ['x_spRose',1,()=>{try{const it=ZAKKA_ITEMS.find(i=>i.id==='g_rose');return it.hid()&&!MIOC.rec().spicy&&!LOVE.rec().spicy&&ZAKKA.today&&ZAKKA.today().all.some(i=>i.id==='g_rose')?{}:null}catch(e){return null}},()=>['🏚️ 雑貨屋へ 行く',()=>ZAKKA.open()]]);

window.MIOSP={gift,minaOk,minaTalk:()=>MINA_SHY};
})();
