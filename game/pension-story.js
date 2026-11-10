/* 嵐の ペンション（game/pension.js）の お話。キャラも 話も この アプリの オリジナル。
   嵐の 夜、浜辺の 先の 岬に ある「ペンション ムーンシェル」に とまる。9時に 電気が 消えて、星の真珠が 消える。
   英語で 聞きこみを して、英語の メモや 札を 読みとくと てがかりが 手に 入る。だれを 犯人に するかで エンドが かわる。
   - ノード: {bg:背景, dark:1=停電, fx:[効果音], L:[セリフ…], o:[答え…] か o:s=>[…], nx:つぎ, go:s=>つぎ, read:{…}, L2:[読んだ あとの セリフ], set:'フラグ', clue:'てがかり', end:{good,t}}
   - セリフ: N('ナレーション（日本語）') / T(だれ, 英語, 日本語)
   - 答え: O(英語, 日本語, つぎ, {r:[返事の セリフ], ok:0=おもしろい まちがい, once:1=1回だけ, if:s=>出す？, set, clue, act:1=行動（日本語だけ）})
   - read: 英語の 文を 読んで 日本語で 答える。{en, ja, q:質問, a:[[答え,1=正解]…], hint, clue} */
const PENSION_STORY=(()=>{
const N=t=>['n',t,''];
const T=(w,e,j)=>[w,e,j];
const O=(e,j,nx,x={})=>Object.assign({e,j,nx},x);
const A=(j,nx,x={})=>Object.assign({e:j,j:'',nx,act:1},x);
const E=(good,t,L,fx)=>({end:{good,t},L,fx});

const chars={
 o:{n:'オデットさん',ico:'👵',p:.95,r:.86,sub:'ペンションの 主人'},
 l:{n:'レオ',ico:'👦',p:1.45,r:1.05,sub:'オデットさんの 孫'},
 i:{n:'アイビーさん',ico:'👩‍🦰',p:1.15,r:1,sub:'推理小説の 作家'},
 c:{n:'クレインさん',ico:'🧔',p:.75,r:.92,sub:'鳥を 見に 来た 客'},
 b:{n:'ブルーノさん',ico:'👨‍🍳',p:.85,r:1.05,sub:'シェフ'},
 s:{n:'スモーク',ico:'🐈‍⬛',p:1.6,r:1,sub:'黒ねこ'},
 r:{n:'？？？',ico:'🤍',p:1.25,r:.8,sub:''},
 y:{n:'あなた',ico:'⭐',p:1.1,r:1}};

/* てがかり: [絵文字, 名前, 英語の 文（つきつける ときに 言う）, 日本語, クレインさんへの つよさ 1=決め手] */
const clues={
 K:['🔑','ぬれた カギ',"Someone opened the case with the key.","だれかが カギで ケースを あけた。",0],
 Q:['❓','カギの ばしょを きいた',"At dinner, you asked where the key was!","夕食の とき、 あなたは カギの ばしょを きいた！",1],
 F:['⚡','切られた スイッチ',"Someone turned off the main switch by hand.","だれかが 手で メインスイッチを 切った。",0],
 P:['👣','砂の 足あと',"Big sandy footprints went up the stairs.","大きな 砂の 足あとが 階段へ つづいていた。",0],
 W:['🧥','白い レインコート',"Your white raincoat was wet and sandy. You were the White Lady!","あなたの 白い レインコートは ぬれて 砂だらけ。 ホワイトレディは あなただ！",1],
 B:['🐦','鳥の ノート',"Your bird notebook has penguins in it. You don't watch birds!","あなたの 鳥ノートに ペンギンが いる。 鳥なんて 見ていない！",1],
 I:['📓','小説の 第3章',"You read Ivy's Chapter 3, and you did the same thing!","あなたは アイビーさんの 第3章を 読んで、 その とおりに やった！",1],
 S:['🐈‍⬛','スモークの ようす',"","スモークが 2号室の ドアを ひっかいていた。",0]};
/* つきつけた ときの 返事 */
const rebut={
 K:[T('c',"So? Anyone could take that key.","それが？ あの カギは だれでも とれる。")],
 Q:[T('c',"I... I was only curious!","わ、 わたしは ただ 気に なっただけだ！"),T('o',"But he DID ask me. I remember!","でも たしかに きかれたわ。 おぼえてる！")],
 F:[T('c',"And? That doesn't mean it was me.","で？ わたしだとは かぎらない。")],
 P:[T('c',"Lots of people have big feet. Bruno, for example!","足の 大きい 人なんて たくさん いる。 ブルーノとか！"),T('b',"Hey!","おい！")],
 W:[T('l',"The White Lady was HIM?!","ホワイトレディって、 この人 だったの！？"),T('c',"That... that coat isn't... um...","あ、 あの コートは… その…")],
 B:[T('i',"Penguins? On this beach? Ha!","ペンギン？ この 浜辺に？ あはは！"),T('c',"They were... very lost penguins.","あれは… すごく 迷子の ペンギン だったんだ。")],
 I:[T('i',"You stole my plot! And then you stole the pearl!","わたしの 話を ぬすんで、 それから 真珠を ぬすんだのね！"),T('c',"I... I just liked your book!","わ、 わたしは 本が 気に入った だけで…")]};

const nodes={
/* ======================================================= プロローグ */
p1:{bg:'path',fx:['rain','thunderFar'],L:[N('嵐で バスが 止まってしまった。 浜辺の 先の 岬に、 あかりが ひとつ 見える。'),N('「ペンション ムーンシェル」。 今夜 とまる 宿だ。'),N('雨と 風の 中、 坂道を 見あげる…')],o:[
 O("Let's go. I can do this!","行こう。 だいじょうぶ！",'p2'),
 O("I'm scared... Maybe I should go home.","こわい… 帰ろうかな。",'p1b')]},
p1b:{bg:'path',fx:['wave'],L:[N('ふりかえると、 浜辺の 道は もう 波に のまれていた。'),N('帰るなら… 泳ぐしか ない？')],o:[
 O("OK. I'll go to the inn.","わかった。 宿へ 行こう。",'p2'),
 O("I'll swim home!","泳いで 帰る！",'eSwim',{ok:0})]},
p2:{bg:'door',fx:['knock'],L:[N('木の とびらを ノックすると、 ギィ… と ゆっくり ひらいた。'),T('o',"Oh my! You're soaking wet. Come in, come in!","まあ！ びしょぬれじゃないの。 さあ 入って 入って！"),T('o',"Welcome to Moonshell Inn. I'm Odette. I run this place.","ペンション ムーンシェルへ ようこそ。 わたしは オデット。 この 宿の 主人よ。")],o:[
 O("Good evening. I have a reservation.","こんばんは。 予約して います。",'p3',{r:[T('o',"Yes, yes. The bus driver called me. You're our last guest tonight.","ええ ええ。 バスの 運転手さんから 電話が あったわ。 今夜 さいごの お客さんね。")]}),
 O("Hello. Do you have a room for tonight?","こんにちは。 今夜 へやは ありますか？",'p3',{r:[T('o',"For you, always. We have one more room. Room 3.","ええ、 もちろん。 ひとつ あいてるわ。 3号室よ。")]}),
 O("Is this a haunted house?","ここ、 おばけやしき？",'p3',{ok:0,fx:['thunderFar'],r:[T('o',"Haunted? Ha! ...Well. Some guests say so.","おばけやしき？ ふふ！ …まあ、 そう言う お客さんも いるけど。")]})]},
p3:{bg:'lobby',L:[N('ロビーは あたたかい。 だんろの 火が パチパチ 鳴っている。'),N('おくに ガラスの ケース。 中で 白い 玉が、 ほのかに 光っていた。'),T('l',"Grandma! Is this the new guest?","おばあちゃん！ この 人が 新しい お客さん？"),T('o',"This is my grandson, Leo. Leo, take the bag to Room 3.","孫の レオよ。 レオ、 荷物を 3号室へ。"),T('l',"Okay! Hey... do you know about the White Lady?","はーい！ ねえ… ホワイトレディの こと、 知ってる？")],o:[
 O("The White Lady? Who is she?","ホワイトレディ？ だれ？",'p4',{r:[T('l',"She's a ghost! She walks in the halls on stormy nights.","ゆうれいだよ！ 嵐の 夜に ろうかを 歩くんだ。"),T('o',"Leo! Stop scaring our guest.","レオ！ お客さんを こわがらせないの。")]}),
 O("Yes! I love ghost stories.","知ってる！ こわい 話、 大好き。",'p4',{r:[T('l',"Really? Then stay up tonight. Maybe you'll see her!","ほんと？ じゃあ 今夜は おきてなよ。 会えるかもね！")]}),
 O("No, thanks. Just carry my bag.","いいから 荷物を はこんで。",'p4',{ok:0,r:[T('l',"Hmph. You'll be sorry!","ふん。 あとで こうかい するよ！"),T('s',"Meow.","ニャー。")]})]},
p4:{bg:'lobby',L:[T('o',"And that's Smoke, our cat. Dinner is at eight. Don't be late!","あれは ねこの スモーク。 夕食は 8時よ。 おくれないでね！"),N('黒ねこの スモークが、 ガラスケースを じっと 見つめていた。')],o:[
 O("What time is breakfast?","朝ごはんは 何時ですか？",'d1',{r:[T('o',"Seven o'clock. Chef Bruno makes the best pancakes.","7時よ。 シェフの ブルーノの パンケーキは 最高なの。")]}),
 O("What's in the glass case?","ガラスケースの 中は 何ですか？",'d1',{r:[T('o',"That's the Star Pearl. I'll tell you about it at dinner.","あれは 星の真珠。 夕食の ときに 話すわね。")]}),
 O("Can I eat dinner in my bed?","ベッドで 夕食を 食べても いい？",'d1',{ok:0,r:[T('o',"In your bed? Certainly not, dear.","ベッドで？ とんでもない。")]})]},

/* ======================================================= 夕食 */
d1:{bg:'dining',fx:['clock'],L:[N('8時。 食堂に みんなが あつまった。'),T('b',"Tonight's dinner: fish soup and fresh bread!","今夜の 夕食は、 魚の スープと やきたての パンだ！")],o:[
 O("It smells delicious!","いい におい！ おいしそう！",'d2',{r:[T('b',"Ha! I like you already.","はっは！ もう 気に入ったよ。")]}),
 O("Could I have some more bread, please?","パンを もう少し もらえますか？",'d2',{r:[T('b',"Of course! Eat a lot. It's going to be a long night.","もちろん！ たくさん 食べな。 長い 夜に なるぞ。")]}),
 O("I don't like fish.","魚は きらい。",'d2',{ok:0,r:[T('b',"WHAT?! ...Fine. More bread for you.","なにィ！？ …わかった。 パンを 多めに しよう。")]})]},
d2:{bg:'dining',L:[N('となりの 席には、 赤い かみの 女の人。 ノートに なにか 書いている。'),T('i',"Hello! I'm Ivy. I write mystery novels.","こんにちは！ アイビーよ。 推理小説を 書いてるの。")],o:[
 O("Nice to meet you, Ivy. What is your new book about?","はじめまして。 新しい 本は どんな 話？",'d3',{r:[T('i',"A jewel thief! In a storm, the lights go out, and the jewel disappears.","宝石どろぼうの 話よ！ 嵐の 夜、 電気が 消えて、 宝石が 消えるの。")]}),
 O("Where are you from?","どこから 来たの？",'d3',{r:[T('i',"From London. I came here to finish my book. It's about a jewel thief!","ロンドンから。 本を 書きあげに 来たの。 宝石どろぼうの 話よ！")]}),
 O("Are you a thief?","どろぼう ですか？",'d3',{ok:0,r:[T('i',"Me? Ha ha! No, I only WRITE about thieves.","わたし？ あはは！ ちがうわ、 どろぼうの 話を 書くだけ。")]})]},
d3:{bg:'dining',L:[N('むかいの 席には、 首から 双眼鏡を さげた 男の人。'),T('c',"Good evening. I'm Basil Crane. Room 2. I'm here to watch birds.","こんばんは。 バジル・クレインです。 2号室に います。 鳥を 見に 来ました。"),T('i',"Mr. Crane borrowed my notebook before dinner. He read it for a long time!","クレインさん、 夕食の 前に わたしの ノートを 借りて、 ずっと 読んでたのよ！"),T('c',"It was... very interesting.","とても… 興味深かったですよ。")],o:[
 O("What kind of birds do you like?","どんな 鳥が 好きですか？",'d4',{r:[T('c',"Oh... all kinds. Big ones. Small ones.","ええと… いろいろ。 大きいのも、 小さいのも。")]}),
 O("Nice to meet you, Mr. Crane.","はじめまして、 クレインさん。",'d4',{r:[T('c',"Yes. Nice to meet you.","ええ。 よろしく。")]}),
 O("Can I look through your binoculars?","双眼鏡、 のぞいても いい？",'d4',{r:[T('c',"NO! I mean... no. They're very old.","だめだ！ いや… だめです。 とても 古いので。"),N('クレインさんは、 双眼鏡の ケースを さっと ひざに かくした。')]})]},
d4:{bg:'dining',L:[T('o',"Now, everyone. Let me tell you about the Star Pearl.","さて みなさん。 星の真珠の 話を しましょう。"),T('o',"My husband, Captain Gray, found it in the sea fifty years ago.","夫の グレイ船長が、 50年前に 海で 見つけたの。"),T('o',"Tomorrow, a man from the museum will come to see it.","あした、 博物館の 人が 見に 来るのよ。"),T('c',"How wonderful. And where do you keep the key to the case, Mrs. Gray?","それは すばらしい。 で、 ケースの カギは どこに しまって あるんです？"),T('o',"Oh, it hangs at the front desk. Nobody steals things here!","あら、 フロントに かけて あるわ。 ここに どろぼうなんて いないもの！")],o:[
 O("Isn't that a little dangerous?","それ、 ちょっと あぶなくない？",'n1',{r:[T('o',"Dangerous? In this little inn? Ha ha.","あぶない？ こんな 小さな 宿で？ うふふ。"),N('クレインさんだけが、 わらって いなかった。')]}),
 O("The pearl is beautiful.","真珠、 きれいですね。",'n1',{r:[T('o',"Thank you, dear. It's my treasure.","ありがとう。 わたしの 宝物なの。")]}),
 O("Can I take it home?","もって 帰っても いい？",'n1',{ok:0,r:[T('o',"Ha ha! Only in your dreams.","うふふ！ 夢の 中でならね。"),T('l',"Ha! The new guest wants to be a thief!","あはは！ この人、 どろぼうに なりたいんだ！")]})]},

/* ======================================================= 9時 */
n1:{bg:'room',fx:['clock'],L:[N('夕食の あと、 3号室の ベッドに ねころんだ。 窓の 外は 嵐。'),N('時計の はりが、 9時を さした ――')],nx:'n2'},
n2:{bg:'room',dark:1,fx:['thunder','blackout'],L:[N('ドォォン！！'),N('大きな かみなり。 そして、 電気が ぜんぶ 消えた。'),N('まっくら。 雨の 音だけが ひびく…'),N('ろうかの おくで、 ガシャン！ と 何かが 鳴った。')],o:[
 O("What was that?! I'll go and check.","今の 何！？ 見に 行こう。",'n3',{fx:['crash']}),
 O("Who's there?!","だれか いるの！？",'n3',{r:[N('へんじは ない。 でも… 白い 何かが、 ろうかを すうっと 横切った 気が した。')]}),
 O("I'll stay in bed. Good night.","ベッドに いよう。 おやすみ。",'n2b',{ok:0})]},
n2b:{bg:'room',dark:1,L:[N('ふとんを かぶって、 目を とじた…'),N('ろうかで、 キュッ、 キュッ と ぬれた 足音が する。')],o:[
 O("Zzz...","ぐう…",'eSleep',{ok:0}),
 O("No. I'm worried. I'll go and look.","やっぱり 気に なる。 見に 行こう。",'n3')]},
n3:{bg:'hall',dark:1,fx:['steps'],L:[N('手さぐりで ろうかを 歩く。 ギシッ、 ギシッ…'),N('とつぜん、 パッと 電気が ついた。'),T('o',"No! NO! The Star Pearl! It's gone!","いやっ！ 星の真珠が！ ない！")],nx:'n4'},
n4:{bg:'lobby',fx:['lightsOn','sting'],L:[N('ロビーに みんなが かけつけた。 ガラスケースが あいていて、 中は からっぽ。'),T('b',"I fixed the power. But... the pearl is gone?","電気は なおしたが… 真珠が ない だと？"),T('i',"Just like my book!","わたしの 小説と おなじ！"),T('c',"Terrible. Just terrible.","ひどい。 ひどい 話だ。"),T('o',"The road is closed by the storm. Nobody can leave tonight.","嵐で 道は 通れない。 今夜は だれも 出られないわ。"),T('o',"You were in your room, and you just arrived. Will you help me find it?","あなたは 来たばかりで、 へやに いた。 さがすのを 手伝って くれる？")],o:[
 O("Of course. I'll find the pearl!","もちろん。 真珠を 見つけます！",'hub',{r:[T('o',"Thank you. Ask everyone anything. In English, of course!","ありがとう。 みんなに なんでも きいて。 もちろん 英語でね！")]}),
 O("Let's ask everyone some questions.","みんなに 話を ききましょう。",'hub',{r:[T('o',"Yes. Somebody here knows something.","ええ。 だれかが 何かを 知ってるはずよ。")]}),
 O("It was the White Lady!","ホワイトレディの しわざだ！",'hub',{ok:0,r:[T('l',"I told you! I TOLD you!","だから 言ったじゃん！"),T('o',"Ghosts don't need pearls. Please, help me.","ゆうれいに 真珠は いらないわ。 おねがい、 手伝って。")]})]},

/* ======================================================= 聞きこみ（ロビーに もどってくる） */
hub:{bg:'lobby',save:1,L:s=>[N(s.hubN++?['つぎは どこを しらべよう？','だれに 話を きこう？','だんろの 火が ゆれている。 まだ 夜は 長い。','窓の 外で、 かみなりが 光った。'][s.hubN%4]:'だれに 話を きこう？ どこを しらべよう？ （🔍で てがかりを 見られるよ）')],o:s=>[
 A('🔍 ガラスケースを しらべる','case',{seen:'case'}),
 A('👵 オデットさんに きく','odette',{seen:'odette'}),
 A('👦 レオに きく','leo',{seen:'leo'}),
 A('👩‍🦰 アイビーさんに きく','ivy',{seen:'ivy'}),
 A('🧔 クレインさんに きく','crane',{seen:'crane'}),
 A('👨‍🍳 ブルーノさんに きく','bruno',{seen:'bruno'}),
 A('⚡ 台所の ブレーカーを しらべる','fuse',{seen:'fuse'}),
 A('🧥 うら口の クローゼットを しらべる','closet',{seen:'closet',if:s=>s.f.lady}),
 A('🐈‍⬛ スモークの あとを つける','smoke',{seen:'smoke',if:s=>s.f.smokeHint}),
 A('🕯️ 屋根裏へ のぼる','attic',{seen:'attic',if:s=>s.f.attic}),
 A('📣 みんなを ロビーに あつめる','acc',{if:s=>s.clues.length>=3,cls:'go'})]},

case:{bg:'lobby',L:[N('ガラスは われていない。 カギで あけられたんだ。'),N('フロントの フックに カギが もどされている。 ぬれていて、 砂が ついている。'),N('カギには 小さな 札が ついていた。')],
 read:{en:"GLASS CASE — KEY\nPlease ask Mrs. Gray.",ja:"ガラスケース ― カギ\nグレイさんに 声を かけてください。",q:'この カギは 何の カギ？',a:[['玄関の カギ',0],['ガラスケースの カギ',1],['3号室の カギ',0]],hint:'「GLASS CASE」は 「ガラスの ケース」',clue:'K'},
 L2:[N('だれかが、 ぬれた 手で この カギを つかったんだ。 外から 来た 人…？')],nx:'hub'},

odette:{bg:'lobby',L:[T('o',"Please, ask me anything.","なんでも きいて。")],o:[
 O("Who knows where the key is?","カギの ばしょを 知ってる 人は？",'od2',{once:1}),
 O("Where were you at nine?","9時に どこに いましたか？",'odette',{once:1,r:[T('o',"In the lobby, by the fire. Then the lights went out, and I heard footsteps.","ロビーの だんろの そば。 電気が 消えて、 足音が 聞こえたの。"),T('o',"Wet footsteps. Squeak, squeak. Going up the stairs.","ぬれた 足音。 キュッ、 キュッって。 階段を あがっていったわ。")]}),
 O("Did you take it yourself?","自分で とったんじゃ ないですか？",'odette',{once:1,ok:0,r:[T('o',"Me?! It's MY pearl, dear!","わたしが！？ わたしの 真珠よ！")]}),
 O("Thank you. I'll look around.","ありがとう。 しらべてきます。",'hub')]},
od2:{bg:'lobby',L:[T('o',"Only Leo and I. But wait...","レオと わたしだけ。 でも 待って…"),T('o',"At dinner, Mr. Crane asked me, \"Where do you keep the key?\" And I told him!","夕食の とき、 クレインさんが きいたの。 それで わたし、 教えちゃった！")],
 read:{say:'o',en:"\"Where do you keep the key to the case?\"",ja:"「ケースの カギは どこに しまって あるんです？」",q:'クレインさんは 夕食の とき、 何を きいた？',a:[['真珠の ねだん',0],['カギを しまっている ばしょ',1],['あしたの 天気',0]],hint:'「key」は カギ、 「where」は どこ',clue:'Q'},nx:'odette'},

leo:{bg:'lobby',L:[T('l',"I saw her! I really saw the White Lady!","ぼく 見たんだ！ ほんとに ホワイトレディを 見た！")],o:[
 O("Where did you see her?","どこで 見たの？",'leo',{once:1,set:'lady',r:[T('l',"In the hall, by the back door. She was tall and white... and wet!","うら口の そばの ろうか。 せが 高くて、 白くて… ぬれてた！"),T('l',"Then she went up the stairs. Squeak, squeak!","それで 階段を あがってった。 キュッ、 キュッって！"),N('白くて、 ぬれていて、 うら口の そば…？ うら口には クローゼットが あったはず。')]}),
 O("Tell me more about the White Lady.","ホワイトレディの こと、 もっと 教えて。",'leo',{once:1,set:'attic',r:[T('l',"There's an old picture in the attic. A lady in a white dress is in it.","屋根裏に 古い 絵が あるんだ。 白い ドレスの 女の人が いるよ。"),T('l',"Grandma says, \"Don't go up there at night.\"","おばあちゃんは 「夜は のぼっちゃ だめ」って 言うけど。")]}),
 O("Did YOU take the pearl, Leo?","レオが とったんじゃ ないの？",'leo',{once:1,ok:0,r:[T('l',"No way! I was hiding under the table!","ちがうよ！ テーブルの 下に かくれてたもん！")]}),
 O("Thanks, Leo.","ありがとう、 レオ。",'hub')]},

ivy:{bg:'lobby',L:[T('i',"Oh, this is so exciting! Ask me anything!","ああ、 わくわくするわ！ なんでも きいて！")],o:[
 O("Where were you at nine?","9時に どこに いましたか？",'ivy',{once:1,r:[T('i',"In my room, writing. Bruno heard my typewriter, I'm sure.","へやで 書いてたわ。 ブルーノさんが タイプライターの 音を 聞いた はずよ。")]}),
 O("Can I see your notebook?","ノートを 見せて もらえますか？",'ivy2',{once:1}),
 O("You did it, didn't you?","あなたが やったんでしょ？",'ivy',{once:1,ok:0,r:[T('i',"Ha! I wish I were that clever.","あはは！ そんなに 頭が よかったら いいのに。")]}),
 O("Thank you, Ivy.","ありがとう、 アイビーさん。",'hub')]},
ivy2:{bg:'lobby',L:[T('i',"Sure. Here's Chapter 3.","いいわよ。 これが 第3章。")],
 read:{en:"Chapter 3\nAt nine, the thief turns off the lights. He opens the case with the key and hides the jewel in his bag.",ja:"第3章\n9時、 どろぼうは 電気を 消す。 カギで ケースを あけて、 宝石を かばんに かくす。",q:'小説の どろぼうは、 9時に 何を する？',a:[['窓を わる',0],['電気を 消す',1],['船で にげる',0]],hint:'「turns off the lights」は 「電気を 消す」',clue:'I'},
 L2:[T('i',"Wait... It happened just like this! And Mr. Crane read this before dinner!","待って… ほんとに この とおりに なってる！ しかも クレインさんは これを 読んでた！")],nx:'ivy'},

crane:{bg:'lobby',L:[T('c',"I was in my room. I didn't see anything.","わたしは へやに いた。 何も 見ていない。")],o:[
 O("What birds did you see today?","きょうは どんな 鳥を 見ましたか？",'cr2',{once:1}),
 O("What's in your binocular case?","双眼鏡の ケースには 何が 入ってるの？",'crane',{once:1,r:[T('c',"Binoculars, of course! What else?","もちろん 双眼鏡だ！ ほかに 何が ある？"),N('クレインさんは ケースを ぎゅっと だきしめた。')]}),
 O("Are you the White Lady?","あなたが ホワイトレディ？",'crane',{once:1,ok:0,r:[T('c',"Do I look like a lady to you?","わたしが 女の人に 見えるかね？")]}),
 O("Thank you, Mr. Crane.","ありがとう、 クレインさん。",'hub')]},
cr2:{bg:'lobby',L:[T('c',"Many! Look. I write everything in my bird notebook.","たくさんだ！ ほら、 ぜんぶ 鳥の ノートに 書いている。")],
 read:{en:"Monday: two penguins on the beach.\nTuesday: a parrot in the pine tree. Very pretty!",ja:"月曜：浜辺に ペンギンが 2わ。\n火曜：松の木に オウムが 1わ。 とても きれい！",q:'この ノートの、 おかしい ところは？',a:[['日づけが 書いてない',0],['この 浜辺に ペンギンや オウムは いない',1],['字が 小さすぎる',0]],hint:'「penguins」と 「parrot」って どんな 鳥？ この 浜辺に いる？',clue:'B'},
 L2:[N('ペンギンに、 オウム。 この 浜辺に いるのは カモメくらいだ。'),N('クレインさん、 ほんとうに 鳥を 見に 来たの…？')],nx:'crane'},

bruno:{bg:'kitchen',L:[T('b',"I was in the kitchen when the lights went out.","電気が 消えたとき、 おれは 台所に いた。")],o:[
 O("How did you fix the power?","どうやって 電気を なおしたの？",'bruno',{once:1,r:[T('b',"The main switch was down. I just pushed it up.","メインスイッチが 下がってたんだ。 上げた だけさ。"),T('b',"Strange. Thunder doesn't push switches.","へんだよな。 かみなりは スイッチを 下げたり しない。")]}),
 O("Did you see anything?","何か 見ましたか？",'bruno',{once:1,clue:'P',r:[T('b',"The back door was open. Sandy footprints went from the door to the stairs.","うら口が あいてた。 砂の 足あとが、 とびらから 階段まで つづいてた。"),T('b',"Big shoes. Not Leo's.","大きな くつだ。 レオのじゃ ない。")]}),
 O("Did you hear Ivy's typewriter?","アイビーさんの タイプライターの 音、 聞こえた？",'bruno',{once:1,r:[T('b',"Yes. Tap-tap-tap, all night. Very loud!","ああ。 カタカタ、 ひと晩じゅう。 うるさいくらいだ！")]}),
 O("Is the cat okay?","ねこは だいじょうぶ？",'bruno',{once:1,set:'smokeHint',r:[T('b',"Smoke? He's acting strange. He keeps scratching at the door of Room 2.","スモーク？ ようすが へんだ。 2号室の ドアを ずっと ひっかいてる。"),T('b',"That cat loves shiny things.","あいつは ピカピカした ものが 大好きでな。")]}),
 O("Did you put the pearl in the soup?","真珠を スープに 入れた？",'bruno',{once:1,ok:0,r:[T('b',"It's a pearl, not a fish egg!","真珠は 魚の たまごじゃ ないぞ！")]}),
 O("Thanks, Bruno.","ありがとう、 ブルーノさん。",'hub')]},

fuse:{bg:'kitchen',L:[N('台所の おくに、 ブレーカーの 箱。 はり紙が してある。')],
 read:{en:"MAIN SWITCH\nDo NOT turn off!",ja:"メインスイッチ\n切らないで！",q:'はり紙には 何と 書いてある？',a:[['ここを おして',0],['切らないで',1],['かみなりに 注意',0]],hint:'「Do not 〜」は 「〜しないで」',clue:'F'},
 L2:[N('かみなりで 消えたんじゃない。 だれかが 手で スイッチを 切ったんだ。')],nx:'hub'},

closet:{bg:'hall',fx:['creak'],L:[N('うら口の そばの クローゼット。 あけると…'),N('白い レインコートが かかっていた。 まだ ぬれている。 ポケットから 砂が こぼれた。'),N('これが ホワイトレディの 正体？ えりに 名札が ある。')],
 read:{en:"This coat belongs to:\nB. Crane — Room 2",ja:"この コートの もちぬし：\nB・クレイン ― 2号室",q:'この コートは だれの もの？',a:[['ブルーノさん',0],['クレインさん',1],['アイビーさん',0]],hint:'「B.」だけじゃ わからない。 「Room 2」に とまっているのは だれ？',clue:'W'},nx:'hub'},

smoke:{bg:'hall',fx:['meow'],L:[N('2階の ろうか。 2号室の 前で、 スモークが ドアを カリカリ ひっかいている。'),T('s',"Meow! Meow!","ニャー！ ニャー！"),T('c',"Go away, cat! Shoo!","あっちへ 行け、 ねこ！ しっし！"),N('ピカピカした ものが 大好きな スモーク。 2号室に、 何か ある…？')],clue:'S',nx:'hub'},

attic:{bg:'attic',fx:['creak'],L:[N('ギシ… ギシ… 屋根裏への 階段を のぼる。'),N('ろうそくの 光の 中に、 古い 絵。 船長の 服の 男の人と、 白い ドレスの 女の人。')],
 read:{en:"Captain Gray and Rose\n\"The sea always brings lost things home.\"",ja:"グレイ船長と ローズ\n「海は いつも、 なくした ものを 家へ 帰してくれる」",q:'絵の 下の ことばの いみは？',a:[['海は なくした ものを 家へ 帰してくれる',1],['海で ものを なくしては いけない',0],['家に 帰ったら 海へ 行こう',0]],hint:'「lost things」は 「なくした もの」、 「home」は 「家へ」'},
 L2:[N('ふっと、 ろうそくが ゆれた。 だれかに 見られている 気が して、 ふりむく。'),N('…だれも いない。 でも、 やさしい 声が した。'),T('r',"Thank you for helping her.","あの人を 助けてくれて、 ありがとう。")],set:'ghost',nx:'hub'},

/* ======================================================= 犯人は だれ？ */
acc:{bg:'lobby',fx:['sting'],L:[N('みんなが ロビーに あつまった。 だんろの 火が、 みんなの 顔を てらす。'),T('o',"Everyone is here. Now tell us. Who took the Star Pearl?","みんな そろったわ。 さあ 教えて。 星の真珠を とったのは だれ？")],o:[
 O("It was Mr. Crane!","クレインさんです！",'pr0'),
 O("It was Ivy!","アイビーさんです！",'eIvy',{ok:0}),
 O("It was Leo!","レオです！",'eLeo',{ok:0}),
 O("It was Bruno!","ブルーノさんです！",'eBruno',{ok:0}),
 O("It was the White Lady!","ホワイトレディです！",'eGhost',{ok:0}),
 O("It was you, Mrs. Gray!","オデットさん、 あなたです！",'eOdette',{ok:0}),
 A('🔍 もう少し しらべる','hub')]},
pr0:{bg:'lobby',fx:['thunderFar'],L:[T('c',"Me? Ridiculous! Where is your proof?","わたし？ ばかばかしい！ 証拠は どこだ？"),N('てがかりを つきつけよう。 （3つまで）')],nx:'prove'},
prove:{bg:'lobby',prove:1},
confess:{bg:'lobby',fx:['thunder'],L:[T('c',"...Fine. FINE! It's in my binocular case.","…わかった。 わかったよ！ 双眼鏡の ケースの 中だ。"),N('ケースを あけると ―― 白い 真珠が、 星のように かがやいた。'),T('o',"My Star Pearl! Oh, thank you, thank you!","わたしの 星の真珠！ ありがとう、 ありがとう！")],go:s=>s.f.ghost?'eTrueG':'eTrue'},
cat:{bg:'lobby',L:[T('c',"You see? No real proof. I'm going to bed.","ほらね。 たいした 証拠は ない。 わたしは もう ねる。"),N('そのとき ―― スモークが とびあがり、 双眼鏡の ケースに とびついた！'),N('ケースが 床に おちて… ころころ ころがり出たのは、 白い 真珠！'),T('s',"Meow!","ニャー！"),T('o',"Smoke! You found it!","スモーク！ 見つけたのね！")],fx:['crash'],nx:'eCat'},

/* ======================================================= エンド */
eTrue:E(1,'真相 ― 真珠は 双眼鏡の 中',[N('朝。 嵐が 去って、 海が きらきら 光っている。'),T('o',"The police took Mr. Crane. He was a famous jewel thief!","クレインさんは 警察に つれていかれたわ。 有名な 宝石どろぼう だったのよ！"),T('i',"What a night! Can I put you in my book?","なんて 夜！ あなたを 小説に 出しても いい？"),T('l',"You're a real detective!","ほんものの 名探偵だ！"),T('o',"Come back anytime. Room 3 is always yours.","いつでも また 来てね。 3号室は あなたの へやよ。")],['dawn']),
eTrueG:E(1,'ほんとうの エンド ― ホワイトレディ',[N('朝。 嵐が 去って、 海が きらきら 光っている。'),T('o',"The police took Mr. Crane. He was a famous jewel thief!","クレインさんは 警察に つれていかれたわ。 有名な 宝石どろぼう だったのよ！"),T('l',"You're a real detective!","ほんものの 名探偵だ！"),N('帰りぎわ、 ふりかえると、 2階の 窓に 白い ドレスの 人が 見えた。'),N('その人は にっこり わらって、 すうっと 消えた。'),T('r',"The sea always brings lost things home.","海は いつも、 なくした ものを 家へ 帰してくれる。")],['dawn']),
eCat:E(1,'ねこ探偵 スモーク',[N('つぎの 朝。 クレインさんは 警察に つれていかれた。'),T('o',"Smoke, you get fish for a week!","スモーク、 1週間 お魚の ごほうびよ！"),T('s',"Meow!","ニャー！"),T('l',"You and Smoke are a great team!","きみと スモーク、 いい コンビだね！")],['dawn']),
eEscape:E(0,'にげられた…',[T('c',"No proof. Good night, everyone.","証拠は なし。 では みなさん、 おやすみ。"),N('つぎの 朝。 嵐は やんでいた。'),N('2号室は からっぽ。 クレインさんは、 夜明け前に 消えていた ―― 真珠と いっしょに。'),N('もっと たしかな てがかりが あれば…')]),
eIvy:E(0,'アイビーさん 大よろこび',[T('i',"Me?! Oh, this is WONDERFUL!","わたし！？ なんて すてきなの！"),T('i',"The writer is the thief! I must put this in my book!","作家が 犯人！ 小説に つかわなきゃ！"),N('アイビーさんは 大よろこびで ノートに 書きはじめた。 真珠は… 見つからない まま。')]),
eLeo:E(0,'おばあちゃんに しかられた',[T('l',"Me?! I'm just a kid!","ぼく！？ ただの 子どもだよ！"),T('o',"How dare you! Leo would never do that!","なんて ことを！ レオは そんな 子じゃ ありません！"),N('オデットさんに たっぷり しかられた…')]),
eBruno:E(0,'スープ 10ぱいの けい',[T('b',"ME?! I've cooked here for twenty years!","おれが！？ ここで 20年 料理してるんだぞ！"),T('b',"Fine. Tomorrow, you eat my BIGGEST fish soup. Ten bowls!","よし。 あしたは 特大の 魚スープだ。 10ぱい！"),N('真珠は 見つからず、 おなかだけ いっぱいに なった。')]),
eGhost:E(0,'ゆうれいの せいに した',[T('l',"I KNEW it!","やっぱり！"),N('みんな だまりこんだ。 窓の 外で、 かみなりが 鳴る。'),T('o',"...Ghosts don't steal pearls, dear.","…ゆうれいは 真珠を ぬすまないわよ。"),N('つぎの 朝。 クレインさんは いなかった。 真珠も。')]),
eOdette:E(0,'じぶんの 真珠を？',[T('o',"Me? Why would I steal my own pearl?!","わたし？ なんで 自分の 真珠を ぬすむのよ！"),T('l',"Ha ha ha! That's so funny!","あはははは！ おもしろすぎ！"),T('s',"Meow.","ニャー。")]),
eSleep:E(0,'ぐっすり 朝まで',[N('ぐっすり ねむった。'),N('つぎの 朝…'),T('o',"Good morning. Did you sleep well? ...Someone stole my pearl last night.","おはよう。 よく ねむれた？ …ゆうべ、 真珠を ぬすまれたの。"),T('l',"You slept through EVERYTHING?!","ぜんぶ ねてたの！？")],['dawn']),
eSwim:E(0,'泳いで 帰った',[N('ざぶん！ 嵐の 海に とびこんだ。'),N('…気が つくと、 いつもの 浜辺。 たき火の 前で、 びしょぬれで ねていた。'),N('岬の ペンションで 何が 起きたのか、 だれも 知らない…')],['wave']),
};
return {chars,clues,rebut,nodes,start:'p1'};
})();
