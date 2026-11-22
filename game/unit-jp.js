/* 🇯🇵 日本語と くらべる カード（11/22 ユーザー「日本語と 比べて 教えてくれると 腑に落ちやすい」）
   授業（単元）の 1時間ごとに 「日本語では こう → 英語では こう → だから」の カードを 1まい 足す（2まいめに 入る）
   - 中身: j = 日本語では、 je = 日本語の 例、 e = 英語では、 ee = 英語の 例（🔊）、 d = だから
   - 特別授業（modal / perfect / comp / shikumi）は 'unit id:時間' で、 のこりの 単元（unit-auto.js）は 文法ノートの id で
   - もう カードの 中で 日本語と くらべている 時間（shikumi の be・動詞は 1つ・過去形と 完了）には 足さない
   - 🤔教えて（practice.js）・📄まとめ 1まい にも 出る（UNIT.jpBox）
   - 見た 時間は localStorage 'hoshi_jpc'（ミナ先生の ひとこと用） */
(()=>{
if(!window.UNIT)return;
const esc=(window.HE&&HE.esc)||(s=>String(s));
const J=(j,je,e,ee,d)=>({j,je,e,ee,d});
const JP={
 /* ---- 💪 特別授業: 助動詞 ---- */
 'modal:0':J('「およ<b>げる</b>」「およぐ<b>べき</b>」と 動詞の <b>おしり</b>に くっつけて 形を かえる','およげる','can・should は 動詞の <b>前</b>に 置く。 動詞は さわらない（原形）','He can swim.','日本語は おしりで、 英語は 前で 気もちを 足す。 だから 後ろの 動詞は はだかの まま'),
 'modal:1':J('「〜しなきゃ」「〜した ほうが いい」と <b>文の さいご</b>で 強さが わかる','休んだ ほうが いいよ','must・should・may を <b>主語の すぐ後ろ</b>に 置いて、 先に 強さを 言う','You should rest.','日本語は さいごまで 聞かないと 気もちが わからない。 英語は 2語めで もう わかる'),
 'modal:2':J('「できる<b>？</b>」「でき<b>ない</b>」と おしりに つける','およげる？ ／ およげない','助動詞を <b>前に 出す</b>（Can you〜?）。 not は 助動詞の <b>すぐ後ろ</b>','Can you swim? — No, I can\'t.','日本語の 「ない・？」は さいご、 英語は 前の ほう。 do は いらない'),
 'modal:3':J('「してはいけない」と 「しなくて いい」は <b>べつの ことば</b>','来なくて いいよ','must not＝ してはいけない、 don\'t have to＝ しなくて いい。 形は にてるのに 意味は ぎゃく','You don\'t have to come.','have to＝「しなきゃ」に not → 「しなきゃ じゃ ない」＝ しなくて いい、 と 考えると まちがえない'),
 'modal:4':J('ていねいに したい ときは 「〜<b>いただけますか</b>」と ことばを <b>足す</b>','手伝って いただけますか？','could・would と <b>過去の 形</b>に して 一歩 下がる','Could you help me?','日本語は 足して ていねい、 英語は 下がって ていねい'),
 /* ---- 💪 特別授業: 完了形 ---- */
 'perfect:0':J('「なくし<b>ちゃった</b>」「なくした <b>まま</b>」と ことばを 足して 「今も」を 出す','かぎを なくしちゃった（今も ない）','今に つながる なら <b>have ＋ 過去分詞</b>と いう べつの 形に する','I have lost my key.','「〜ちゃった・〜た まま」の 感じが したら have'),
 'perfect:1':J('「〜した <b>ことが ある</b>」と おしりに 足す','京都に 行った ことが ある','have ＋ 過去分詞（＋ ever・回数）。 「こと」に あたる ことばは <b>ない</b>','I have been to Kyoto.','「ことが ある」を 英語の 中で さがさない。 have been の 形 そのものが それ'),
 'perfect:2':J('「ずっと 住んで<b>いる</b>」は 「〜している」の 形','10年 ずっと 東京に 住んでいる','「〜している」でも -ing では なく <b>have ＋ 過去分詞 ＋ for / since</b>','I have lived in Tokyo for ten years.','「している」を 見ても すぐ -ing に しない。 「ずっと・いつから」なら have'),
 'perfect:3':J('「<b>もう</b> 食べた」「<b>まだ</b> 食べてない」と 文の 前の ほうに もう・まだ','まだ 食べていない','have ＋ 過去分詞に already・just・yet。 「まだ〜ない」の yet は <b>文の さいご</b>','I haven\'t eaten yet.','「まだ」の 位置が ちがう。 yet は おしりに ぽんと 置く'),
 'perfect:4':J('「きのう 食べ<b>た</b>」も 「もう 食べ<b>た</b>」も 同じ 「た」','きのう 食べた ／ もう 食べた','きのう（過去の 1点）は 過去形、 もう（今に つながる）は 現在完了と <b>形を 分ける</b>','I ate it yesterday. / I have already eaten.','yesterday・ago が あったら 過去形。 have とは いっしょに 使えない'),
 'perfect:5':J('「着いた ときには <b>もう</b> 出て<b>いた</b>」と もう・ていた で 前後を 言う','着いた ときには 電車は もう 出ていた','<b>had ＋ 過去分詞</b>で 「その 時より 前」を 形に する','The train had left when I arrived.','日本語は ことばで、 英語は had の 形で 時間の 前後を 見せる'),
 /* ---- 💪 特別授業: 比較 ---- */
 'comp:0':J('「ケン<b>より</b> 高い」と 「より」を 足す。 「高い」は そのまま','ケンより 背が 高い','tall → <b>taller</b> と ことばの 形を かえる。 「より」は than で、 相手は <b>後ろ</b>','I am taller than Ken.','日本語は 相手が 先（ケンより）、 英語は 相手が あと（than Ken）'),
 'comp:1':J('どんな ことばも 「より・いちばん」を つける だけ','いちばん きれいな 浜辺','長い ことば（beautiful）は <b>more・most</b> を 前に。 good → better・best は とくべつ','This is the most beautiful beach.','英語は ことばの 長さで つけ方が かわる。 短い → -er、 長い → more'),
 'comp:2':J('「ケン<b>ほど</b> 高く<b>ない</b>」と ほど・ない で 言う','ケンほど 背が 高くない','<b>not as 〜 as</b> で はさむ','I am not as tall as Ken.','「〜ほど …ない」を 見たら not as 〜 as'),
 'comp:3':J('「練習 すれば する<b>ほど</b> うまく なる」と 「ほど」で つなぐ','練習 すれば するほど うまく なる','<b>The 比較級 〜, the 比較級 …</b> と 2つ ならべる','The more you practice, the better you get.','日本語の 「〜ほど」1つが、 英語では the 比較級 2つの セットに なる'),
 /* ---- 💪 特別授業: 英語の しくみ（すでに 日本語と くらべている 0・2・7 は なし） ---- */
 'shikumi:1':J('「食べる・食べた」に 「られる」などを <b>足して</b> 作る','食べた ／ 食べられた','eat・ate・eaten と <b>3つの 顔</b>を 取りかえる。 どれを 使うかは 前の ことばが 決める','I have eaten. / It was eaten.','日本語は 足して 作る、 英語は 顔を 取りかえる。 だから 3つめの 顔（過去分詞）を 覚える'),
 'shikumi:3':J('「走って<b>いる</b> 犬」「われ<b>た</b> まど」の 「〜ている・〜た」は もう 様子を 言う ことば','まどが われている','-ing（している）も 過去分詞（された）も 様子の ことば。 だから 文では <b>be と いっしょ</b>','The window is broken.','「われて いる」の 「いる」が be。 日本語でも 様子の 形に なってるね'),
 'shikumi:4':J('「行き<b>たい</b>」「行<b>ける</b>」「行く<b>こと</b>」と 後ろの ことばが 自分で 形を かえる','およぐのが 楽しい','want <b>to</b> go・can go・enjoy go<b>ing</b>と <b>前の ことばが</b> 後ろの 形を 決める','I enjoy swimming.','日本語は 後ろが 決める、 英語は 前が 決める。 前を 見る くせを つけよう'),
 'shikumi:5':J('「する<b>？</b>」「し<b>ない</b>」と おしりを かえる だけ。 だれが しても 同じ 形','彼は テニスを する？','he・she の 今は <b>-s</b>。 質問・not は <b>does が 前に 出て</b> -s を 持っていく','Does he play tennis?','日本語に ない 「-s」と 「do」。 英語は いつも 「だれ？ 今？」を 気に している'),
 'shikumi:6':J('「犬を かってる。 <b>その</b> 犬は 白い」の 「その」は 言っても 言わなくても いい','犬を かってる。 犬は 白い','1回目は <b>a</b> dog、 2回目は <b>the</b> dog と <b>かならず</b> つける','I have a dog. The dog is white.','日本語なら はぶける 「ある・その」を、 英語は 毎回 つける'),
 'shikumi:8':J('「〜する<b>こと</b>」は 1つ','およぐのが 好き','<b>to</b> swim（これから）と swim<b>ming</b>（やっている）の 2つ。 前の 動詞で 決まる','I want to swim. / I enjoy swimming.','日本語の 「こと」1つを、 英語は 気もちの 向きで 2つに 分ける'),
 'shikumi:9':J('「7時<b>に</b>」「月曜<b>に</b>」「4月<b>に</b>」と 「に」1つで 時も 場所も','7時に ・ 月曜に ・ 4月に','点は <b>at</b>、 くっつく 面は <b>on</b>、 中は <b>in</b> と 「に」を 3つに 分ける','at seven / on Monday / in April','「に」を 見たら 点？ 面？ 中？ と イメージで えらぶ'),
 'shikumi:10':J('「寒いね」「何時？」と 主語なしで いい。 質問は おしりに 「<b>か？</b>」','寒いね。 何時？','主語の 席は <b>it</b> で うめる。 質問は be・do を <b>いちばん 前</b>に','It\'s cold. What time is it?','日本語は さいごで 質問だと わかる。 英語は 1語めで 知らせる'),

 /* ---- 📘 のこりの 単元（文法ノートの id） ---- */
 es_be:J('「わたし<b>は</b> ケン」で 文に なる。 「は」が つなぐ','わたしは ケン','I と Ken を <b>am</b> で つなぐ。 つなぐ ことば（be動詞）が ないと 文に ならない','I am Ken.','日本語の 「は〜です」の 役目を am・are が している'),
 es_heshe:J('2回目からは 名前も 「彼」も はぶいて いい','こちら ケン。 サッカーが 好きなの','2回目からは <b>He・She</b> に おきかえる。 主語は はぶかない','This is Ken. He likes soccer.','日本語なら 言わない ところに、 英語は he・she を 入れる'),
 es_this:J('これ・<b>それ</b>・あれ の 3つ','これは わたしの。 あれは あなたの','<b>this</b>（近い）と <b>that</b>（遠い）の 2つ だけ','This is mine. That is yours.','「それ」は 近ければ this、 はなれていれば that'),
 es_like:J('「好き<b>？</b>」と おしりを 上げる だけ','ねこ 好き？','<b>Do</b> を 前に 置いて 「質問だよ」と 先に 知らせる','Do you like cats?','日本語は おしりで、 英語は 先頭で 質問だと わかる'),
 jh_be:J('「学生<b>です</b>」「箱に <b>いる</b>」と 「です」と 「いる」は べつの ことば','わたしは 学生です。 ねこは 箱の 中に いる','どちらも <b>am・is・are</b> 1つ。 イコールにも 「いる・ある」にも なる','I am a student. The cat is in the box.','「です」も 「いる」も be動詞 1つで 足りる'),
 jh_do:J('「する<b>？</b>」「し<b>ない</b>」と 動詞の おしりを かえる','テニス する？ ／ しない','一般動詞は 自分で 前に 出られない。 <b>do が 前に 出て</b>、 not も do が もつ','Do you play tennis? — I don\'t.','日本語の 「ない・？」の 仕事を、 英語では do が 引き受ける'),
 jh_3s:J('動詞は だれが しても 同じ 「走る」','わたしは 走る ／ 彼は 走る','he・she・it の 今の 話だけ <b>-s</b>','I run. / He runs.','日本語に ない しるし。 主語が he・she・it なら 動詞を 見なおそう'),
 jh_pron:J('「わたし」に 「<b>は・の・を</b>」を つける','わたしは・わたしの・わたしを','<b>I・my・me・mine</b> と ことば 自体が 形を かえる','I like him. He likes me.','「は・を」の 代わりに、 形と 位置で 役目を 見せる'),
 jh_imp:J('「すわっ<b>て</b>」「すわり<b>なさい</b>」と おしりで 命令','すわって ください','<b>動詞から</b> はじめる だけ。 ていねいには please','Sit down, please.','主語を はぶけない 英語でも、 命令文だけは 主語なし'),
 es_past:J('「行く → 行っ<b>た</b>」と 「た」を 足す','公園に 行った','go → <b>went</b> と ことば ごと 形を かえる','I went to the park.','「た」を 足す 日本語、 形を 取りかえる 英語'),
 jh_prog:J('「〜して<b>いる</b>」で 今も ふだんも ずっとも 言える','今 勉強している ／ 毎日 勉強している','<b>今 この しゅんかん</b>だけ be ＋ -ing。 ふだんは そのまま','I\'m studying now. / I study every day.','「している」→ すぐ -ing は まちがいの もと。 「今 この しゅんかん？」と 聞いてみて'),
 jh_past1:J('「し<b>た</b>」と 「た」を つける。 だれでも 同じ','彼女は テニスを した','動詞に <b>-ed</b>。 過去は だれでも 同じ 形（-s は つかない）','She played tennis.','過去形は 主語で かわらない。 そこは 日本語と 同じ'),
 jh_past2:J('「来る → <b>来た</b>」「する → <b>した</b>」と 形が かわる ことばも ある','映画を 見た','go → went、 see → saw と 形が がらっと かわる 動詞が ある','I saw a movie.','日本語の 「来る・する」と 同じで、 よく 使う ことばほど 形が かわる'),
 jh_pastprog:J('「〜して<b>いた</b>」','電話が 来た とき テレビを 見ていた','<b>was・were ＋ -ing</b>。 その とき 途中だった こと','I was watching TV when you called.','「ていた」の 「いた」が was・were'),
 es_want:J('「りんご<b>が</b> ほしい」と ほしい ものに 「が」','りんごが ほしい','want の <b>すぐ後ろ</b>に ほしい ものを 置く','I want an apple.','「が」も 「を」も ない。 位置が 役目を 決める'),
 es_dream:J('「先生<b>に なり</b>たい」','先生に なりたい','want to <b>be</b> 〜。 「なる」は be で いい','I want to be a teacher.','「なる」を become と さがさなくても、 be で 言える'),
 jh_future:J('「あした 行く」と 今の 形のまま 未来も 言える','あした 行く','<b>will・be going to</b> を つけて 未来だと はっきり 言う','I will go tomorrow.','日本語は 「あした」が あれば 十分。 英語は 動詞の 前で 未来を 知らせる'),
 es_plural:J('「犬が 3びき」でも 犬は 「犬」の まま','犬が 3びき いる','three dog<b>s</b> と <b>-s</b> を つける','I have three dogs.','2つ いじょうなら ことばに しるしを つけるのが 英語'),
 es_howmany:J('「何<b>びき</b>？」「何<b>さつ</b>？」と 数え方が かわる','ねこ 何びき いる？','<b>How many ＋ -s の ことば</b> 1つで 何でも 聞ける','How many cats do you have?','日本語は 数え方を えらび、 英語は -s を 忘れない'),
 jh_plural:J('「子ども<b>たち</b>」の 「たち」は つけても つけなくても いい','子どもが 公園で 遊んでいる','2人 いじょうなら <b>かならず</b> children と 形を かえる','Children are playing in the park.','日本語の 「たち」は 気まぐれ、 英語の 複数は 毎回'),
 jh_art:J('a・the に あたる ことばが <b>ない</b>','ねこを 見た。 ねこは 白かった','1回目は <b>a</b> cat、 2回目は <b>the</b> cat','I saw a cat. The cat was white.','名詞の 前で 「はじめて？ わかってる？」を いつも 決める'),
 hs_quant:J('「たくさんの 本」も 「たくさんの 水」も 「たくさん」1つ','たくさんの 本 ／ たくさんの 水','数える ものは <b>many</b>、 数えない ものは <b>much</b>','many books / much water','英語は 名詞を 数える？ 数えない？ で ことばを えらぶ'),
 es_time:J('「7時<b>に</b>」「月曜<b>に</b>」と 「に」1つ','7時に 起きる','時こくは <b>at</b>、 曜日は <b>on</b>','I get up at seven.','「に」の 中身で 前置詞を 分ける'),
 es_way:J('「まっすぐ 行っ<b>て</b>、 右に まがっ<b>て</b>」','まっすぐ 行って、 右に まがって','<b>Go・Turn</b> と 動詞から はじめる 命令文','Go straight and turn right.','道あんないは 主語なしの 命令文で だいじょうぶ'),
 jh_wh:J('「あなたは <b>何を</b> 食べる？」と 「何」は 文の まん中','あなたは 何を 食べる？','<b>What を いちばん 前</b>に。 その あとは 質問の 形','What do you eat?','聞きたい ことを 先に 言うのが 英語'),
 jh_indq:J('「彼が どこに 住んでいるか 知ってる？」と 文の 中に そのまま 入れる','彼が どこに 住んでいるか 知ってる？','where <b>he lives</b> と 質問の ならびを やめて ふつうの 順番に','Do you know where he lives?','文の 中に 入ったら 質問の ならびは やめる。 質問は 外がわ 1回だけ'),
 jh_inf:J('「勉強する <b>ため</b>に」「行く <b>こと</b>」「読む 本」と おしりで 役目を かえる','英語を 勉強する ために 図書館へ 行った','<b>to ＋ 原形</b> 1つで 「ため・こと・するための」','I went to the library to study English.','日本語の 「ため・こと」を to 1つで 言える'),
 jh_ger:J('「およぐ<b>こと</b>」「およぐ<b>のが</b>」','およぐのが 好き','swim<b>ming</b> と -ing を つけるだけで 「こと」に なる','I like swimming.','「〜すること・〜するのが」を 見たら -ing か to'),
 hs_inf2:J('「重<b>すぎて</b> 持て<b>ない</b>」と 「ない」が 文に 出る','この 箱は 重すぎて 持てない','<b>too 〜 to …</b> で 1つの 型。 not は いらない','This box is too heavy to carry.','「すぎて〜ない」の 「ない」は too が もっている'),
 hs_ginf:J('「電話した <b>のを</b> 覚えてる」「電話する <b>のを</b> 覚えておく」と 「のを」は 同じ','電話するのを 忘れないで','remember <b>calling</b>（した こと）と remember <b>to call</b>（これから）で 意味が かわる','Remember to call me.','to は これから、 -ing は もう した こと'),
 jh_passive:J('「建て<b>られた</b>」と 動詞の おしりに 「れる・られる」','この お寺は 600年前に 建てられた','<b>be ＋ 過去分詞</b>の セット','This temple was built 600 years ago.','「られる」の 代わりに be と 過去分詞。 だれが したかは by 〜で 後ろに'),
 hs_passive2:J('「作られて<b>いる</b> ところ」「もう 作られ<b>た</b>」と おしりを つなげる','橋が 今 作られている','<b>is being built・has been built</b> と be の 形で 時間を 足す','The bridge is being built.','受け身も be の 形を かえれば 進行形・完了形と 組みあわせられる'),
 hs_caus:J('「そうじ<b>させた</b>」と おしりに 「させる」','弟に へやを そうじ させた','<b>make・let・have</b> を 前に 置いて 「人 ＋ 原形」','I made my brother clean the room.','「させる」は おしりでなく、 前に make を 置く'),
 es_place:J('「つくえの <b>上に</b>」と 場所の <b>後ろ</b>に 「上・中・下」','ねこは つくえの 上に いる','<b>on</b> the desk と 場所の <b>前</b>に on・in・under','The cat is on the desk.','日本語は 後ろ、 英語は 前に つける'),
 jh_prep:J('「駅<b>で</b>」「3時<b>に</b>」と 「で・に」は 名詞の <b>後ろ</b>','駅で 会おう','<b>at</b> the station と 名詞の <b>前</b>（だから 「前置詞」）','Let\'s meet at the station.','名前の とおり 「前に 置く ことば」。 日本語と 位置が さかさま'),
 jh_there:J('「つくえの 上に 本<b>が ある</b>」と ある 物が 主語','つくえの 上に 本が ある','はじめて 話に 出る 物は <b>There is</b> で 言う','There is a book on the desk.','物を 主語に したく なったら There is。 自分の 物なら have'),
 jh_svoo:J('「母<b>に</b> 花<b>を</b> あげた」と 「に・を」で 人と 物を 分ける','母に 花を あげた','gave <b>my mother flowers</b> と 順番で 人 → 物','I gave my mother flowers.','「に・を」が ない 英語は、 順番が その 代わり'),
 hs_5:J('「は・が・を・に」で 役目が わかるから 順番は わりと 自由','先生が ケンを ほめた ／ ケンを 先生が ほめた','<b>順番が 役目を 決める</b>。 だから 文の 形（文型）が 5つに 決まっている','The teacher praised Ken.','5文型は 「は・を」の 代わりの 地図'),
 jh_part:J('「公園を 走っている 犬」と 説明は いつも 名詞の <b>前</b>','公園を 走っている 犬','1語なら 前（a running dog）、 2語 いじょうは <b>後ろ</b>（the dog running in the park）','the dog running in the park','長い 説明は 後ろへ。 「名詞 → くわしく」の 順'),
 jh_rel:J('「ギターを ひいている 男の子」と 説明が <b>前</b>','ギターを ひいている 男の子','the boy <b>who</b> plays the guitar と 名詞が 先、 説明は who の 後ろ','the boy who plays the guitar','日本語は 説明 → 名詞、 英語は 名詞 → 説明。 who は 「どんな 人かと いうと」の 合図'),
 hs_rel2:J('「わたしが ほしい <b>もの</b>」と 「もの・こと」を つける','わたしが ほしい ものは 時間だ','<b>what</b> 1つで 「〜する もの・こと」','What I want is time.','「もの・こと」を 見たら what'),
 hs_reladv:J('「わたしが 生まれた 町」と 説明を <b>前</b>に','ここは わたしが 生まれた 町','the town <b>where</b> I was born と 後ろから 説明','This is the town where I was born.','場所の 説明は where、 時の 説明は when で 後ろに つなぐ'),
 hs_partc:J('「駅に 着い<b>て</b>、 電話した」と 「て」で つなぐ','駅に 着いて、 母に 電話した','<b>-ing</b> で はじめて 文を つなぐ','Arriving at the station, I called my mother.','日本語の 「〜て、」の 感じが 分詞構文'),
 jh_conj:J('「雨<b>なら</b>」「つかれた<b>ので</b>」と 文の <b>おしり</b>に つける','雨なら 家に いる','<b>If</b> it rains と 文の <b>前</b>に if・because','If it rains, I will stay home.','「なら・ので」は 後ろ、 if・because は 前'),
 hs_conj2:J('「雨だった<b>けれど</b>」「来る<b>まで</b>」と おしりに つける','雨だったけれど 出かけた','<b>Though・until</b> を 文の 前に','Though it was raining, I went out.','つなぐ ことばは 英語では 文の 先頭'),
 jh_subj:J('「もし 鳥 <b>だったら</b>」と 「たら」を つける','もし 鳥 だったら 飛べるのに','ありえない 話は 動詞を <b>1つ 過去に ずらす</b>（were・could）','If I were a bird, I could fly.','日本語の 「だっ<b>た</b>ら」の 「た」も 過去の 形。 じつは 同じ 発想'),
 hs_subj2:J('「もっと 勉強して<b>いたら</b> 受かった<b>のに</b>」','もっと 勉強していたら 受かったのに','<b>had ＋ 過去分詞</b>と <b>would have ＋ 過去分詞</b>で 過去の 反対','If I had studied harder, I would have passed.','過去の 「もしも」は もう 1段 過去に さげる'),
 hs_speech:J('「彼は 『つかれた』<b>と</b> 言った」と かぎかっこで そのまま','彼は 「つかれた」と 言った','He said <b>he was</b> tired. 伝える 人から 見た 言い方に かえる','He said he was tired.','日本語は 「と」で そのまま、 英語は I → he・am → was に かえる'),
 hs_seq:J('「彼は つかれて<b>いる</b>と 言った」と 中は 今の まま','彼は つかれていると 言った','said の 後ろも <b>was</b> と 過去に そろえる','He said he was tired.','日本語の 感覚で is に すると ずれる。 前が 過去なら 後ろも 過去'),
 jh_perfprog:J('「2時間 <b>ずっと</b> 勉強して<b>いる</b>」','2時間 ずっと 勉強している','<b>have been ＋ -ing ＋ for</b>','I have been studying for two hours.','「ずっと ＋ している」は have been ＋ -ing'),
 hs_tense:J('「着いた ときには 映画は <b>もう</b> 始まって<b>いた</b>」','着いた ときには もう 始まっていた','<b>had ＋ 過去分詞</b>で 「その 時より 前」','The movie had started when I arrived.','日本語は 「もう〜ていた」で わかる 前後を、 英語は had の 形で 見せる'),
 hs_modperf:J('「早く 出る<b>べき だった</b>」と おしりに 「だった」','もっと 早く 出る べきだった','<b>should have ＋ 過去分詞</b>。 助動詞の 後ろに have で 過去へ','I should have left earlier.','助動詞の 後ろは 原形 だから、 過去は have ＋ 過去分詞で 言う'),
 hs_comp2:J('「3<b>ばい</b> 広い」と 「ばい」を 足す','この へやは あの へやの 3ばい 広い','<b>three times as big as</b> と as 〜 as の 前に','This room is three times as big as that one.','「〜ばい」は as 〜 as の 前に つける'),
 hs_emph:J('「花を くれたのは <b>ケンだ</b>」と 大事な ことを <b>さいご</b>に','花を くれたのは ケンだ','<b>It was Ken that</b> 〜 と 大事な ことを <b>前</b>に','It was Ken that gave me the flowers.','日本語は さいごが 大事、 英語は 前に 出して 目立たせる'),
 hs_neg:J('「みんなが 来た <b>わけでは ない</b>」と おしりで 部分否定','みんなが 来た わけでは ない','<b>not ＋ all・every・always</b> で 「ぜんぶ じゃ ない」','Not everyone came.','not all ＝ 一部は ちがう。 「ぜんぶ ない」なら no・none'),
 hs_noun:J('「雨の <b>せいで</b> 行けなかった」と <b>人</b>が 主語','雨の せいで 行けなかった','The rain kept me from going. と <b>物</b>が 主語','The rain kept me from going.','物が 主語の 文は 「〜の せいで・〜の おかげで」と 訳すと 自然'),
 hs_ellip:J('わかる ことは どんどん はぶける','（うん、）行きたい','はぶける のは 決まった 所だけ。 I want <b>to</b>. の to は のこす','I want to.','日本語ほど はぶけない。 to や do で 席を のこす')
};

/* 見た目: 🇯🇵 日本語 ｜ 🔤 英語 → 💡 だから */
const box=(p,noEe)=>`<div class="ujp"><div class="ujpc j"><b>🇯🇵 日本語</b><span>${p.j}</span>${p.je?`<em>${esc(p.je)}</em>`:''}</div>`+
  `<div class="ujpc e"><b>🔤 英語</b><span>${p.e}</span>${p.ee&&!noEe?`<em>${esc(p.ee)}</em>`:''}</div></div><p class="ujpd">💡 ${p.d}</p>`;
UNIT.jpBox=box;UNIT.JP=JP;

const KEY='hoshi_jpc',R=(()=>{try{return JSON.parse(localStorage.getItem(KEY)||'{}')||{}}catch(e){return {}}})();R.s=R.s||{};
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(R))}catch(e){}};
UNIT.jpSeen=k=>{if(R.s[k])return;R.s[k]=Date.now();save()};
UNIT.jpRec=()=>R;
const line=k=>{try{const v=MINA.line('u_jp',{});return v}catch(e){return ['think','日本語と くらべてみよう']}};

/* 単元の 時間に くっつける（2まいめ）。 自分の say は 毎回 ちがう ひとことに なるよう getter で */
const all=[];
UNIT.list.forEach(U=>{if(!U||!U.D)return;U.D.CH.forEach((c,ci)=>{const k=U.id+':'+ci,p=JP[k]||(['modal','perfect','comp','shikumi'].includes(U.id)?null:JP[c.g]);
  if(!p||c.jp)return;c.jp=p;all.push({U,ci,c,k});
  const card={x:'think',f:box(p,1),ex:[[String(p.ee||''),p.je||'']].filter(e=>e[0]),jpc:1,jk:k};
  Object.defineProperty(card,'say',{get(){const [ex,tx]=line();card.x=ex;return `<b>🇯🇵 日本語と くらべると</b>… ${tx}`},enumerable:true});
  c.cards.splice(Math.min(1,c.cards.length),0,card)})});
UNIT.jpAll=all;

/* ---------- ミナ先生の セリフ ---------- */
Object.assign(MINA_LINES,{
 u_jp:[['think','日本語と ならべると、 ちがいが すっと 見えるよ'],['smile','日本語の 感覚と どこが ちがうか、 見てみよう'],['wow','日本語の 感覚の ままだと、 ここで つまずくの'],['happy','日本語と くらべると 「だから こう なるのか」って わかるよ'],['proud','日本語の どこに あたるか わかれば、 もう まよわないね']],
 x_jpNew:[['happy','授業の カードに <b>🇯🇵 日本語と くらべる</b> 1まいを 足したよ。 「日本語では こう、 英語では こう」って ならべると 腑に落ちるの'],['smile','どの 授業にも 「日本語と くらべると」の カードが 入ったよ。 「は・を」が ない 英語の ひみつ、 見に いこう']],
 x_jpTip:[['think','日本語では {j}。 でも 英語では {e}。 「{t}」の 授業で くわしく 見られるよ'],['smile','ちょっと くらべっこ。 日本語は {j}、 英語は {e}。 ね、 ちがうでしょ'],['wow','おもしろい ちがい: 日本語は {j}。 英語は {e}']],
 te_jp:[['think','日本語と くらべると わかりやすいよ']]
});
const plain=t=>String(t||'').replace(/<[^>]+>/g,'');
try{const RL=MINA_SENSE._rules;
  RL.push(['x_jpNew',3,()=>all.length&&!Object.keys(R.s).length?{}:null,()=>['📘 日本語と くらべる 授業',()=>{const u=UNIT.get('shikumi')||all[0].U;u.open({ch:all.find(a=>a.U===u)?all.find(a=>a.U===u).ci:0})}]]);
  RL.push(['x_jpTip',2,()=>{if(!all.length)return null;const a=all[Math.random()*all.length|0];return {j:plain(a.c.jp.j),e:plain(a.c.jp.e),t:a.c.short||a.c.t,_u:a.U.id,_ci:a.ci}},v=>['📘 授業で 見る',()=>{const u=UNIT.get(v._u);if(u)u.open({ch:v._ci})}]]);
}catch(e){}
})();
