/* 🇯🇵 日本語と ちがう ところ（⚡特別練習の カテゴリー 7つ。 game/shikumi-drill.js が まぜて つかう）
   11/22 ユーザー「全部 混乱する。 とくに はい、いいえ」「問題が 始まる 前に ワンポイントレッスン」「わからなかったら 悩んでる ポイントを 理解して サラッと 教えて」
   1問 = {ja, s(___ の 文) か p(問い), o:[正解, まちがい], why, mis（まちがいを えらんだ ときの 「ここで つまずいたかな」）, hint（まよっている ときの ひとこと）}
   qen = 英語の 質問を 大きく 見せる（はい・いいえ）。 カテゴリーの les = ワンポイントレッスン、 hint = まよった ときの きまり文句 */
(()=>{
const pick=a=>a[Math.random()*a.length|0];

/* ================================================================ 🙆 はい・いいえ
   コツ: 質問は 見ない。 自分の 答えが 「する」なら Yes、 「しない」なら No。 Yes の 後ろは かならず 肯定、 No の 後ろは かならず 否定 */
/* en 否定の 質問, pq ふつうの 質問, ja / pja 日本語, s 答えの 主語, a 肯定の 形, n 否定の 形, y 「する」の 答え, nn 「しない」の 答え */
const YN=[
 {en:"Don't you like cats?",pq:'Do you like cats?',ja:'ねこ、 好きじゃ ないの？',pja:'ねこ、 好き？',s:'I',a:'do',n:"don't",y:'好き',nn:'好きじゃ ない'},
 {en:"Aren't you hungry?",pq:'Are you hungry?',ja:'おなか、 すいて ないの？',pja:'おなか すいてる？',s:'I',a:'am',n:"'m not",y:'すいてる',nn:'すいて ない'},
 {en:"Can't you swim?",pq:'Can you swim?',ja:'およげ ないの？',pja:'およげる？',s:'I',a:'can',n:"can't",y:'およげる',nn:'およげ ない'},
 {en:"Didn't you go to school?",pq:'Did you go to school?',ja:'学校、 行かなかったの？',pja:'学校 行った？',s:'I',a:'did',n:"didn't",y:'行った',nn:'行かなかった'},
 {en:"Isn't she your sister?",pq:'Is she your sister?',ja:'あの子、 妹さんじゃ ないの？',pja:'あの子、 妹さん？',s:'she',a:'is',n:"isn't",y:'妹だよ',nn:'妹じゃ ない'},
 {en:"Doesn't he play soccer?",pq:'Does he play soccer?',ja:'彼、 サッカー しないの？',pja:'彼、 サッカー する？',s:'he',a:'does',n:"doesn't",y:'する',nn:'しない'},
 {en:"Won't you come with us?",pq:'Will you come with us?',ja:'いっしょに 来ないの？',pja:'いっしょに 来る？',s:'I',a:'will',n:"won't",y:'行く',nn:'行かない'},
 {en:"Aren't you tired?",pq:'Are you tired?',ja:'つかれて ないの？',pja:'つかれてる？',s:'I',a:'am',n:"'m not",y:'つかれてる',nn:'つかれて ない'},
 {en:"Don't you have a pen?",pq:'Do you have a pen?',ja:'ペン、 もって ないの？',pja:'ペン もってる？',s:'I',a:'do',n:"don't",y:'もってる',nn:'もって ない'},
 {en:"Isn't it cold?",pq:'Is it cold?',ja:'寒く ないの？',pja:'寒い？',s:'it',a:'is',n:"isn't",y:'寒い',nn:'寒く ない'},
 {en:"Didn't Ken call you?",pq:'Did Ken call you?',ja:'ケンから 電話 なかったの？',pja:'ケンから 電話 あった？',s:'he',a:'did',n:"didn't",y:'あった',nn:'なかった'},
];
const cap=w=>w[0].toUpperCase()+w.slice(1);
const yes=x=>`Yes, ${x.s} ${x.a}.`,no=x=>`No, ${x.s}${x.n[0]==="'"?'':' '}${x.n}.`;
const ynMisY=x=>`日本語の 「いいえ、 ${x.y}」に つられたかな。 質問は 気にしないで。 答えが 「${x.y}」（する）なら Yes`;
const ynMisN=x=>`「うん、 ${x.nn}」の 「うん」に つられたかな。 答えが 「${x.nn}」（しない）なら No`;
const ynHint=(x,w)=>`質問は 見ないで、 答えの 中身 だけ。 「${w?x.y:x.nn}」は する？ しない？`;
const T={
 /* 否定の 質問に 答える（いちばん だいじ） */
 ynNeg:()=>{const x=pick(YN),w=Math.random()<.5,ok=w?yes(x):no(x),bad=w?no(x):yes(x);
   return {qen:x.en,ja:x.ja,p:`「${w?x.y:x.nn}」と 答えたい`,o:[ok,bad],why:w?`答えが 「${x.y}」 → Yes`:`答えが 「${x.nn}」 → No`,mis:w?ynMisY(x):ynMisN(x),hint:ynHint(x,w)}},
 /* ふつうの 質問でも 答えは 同じ（質問は 見ない を 体で） */
 ynPos:()=>{const x=pick(YN),w=Math.random()<.5,ok=w?yes(x):no(x),bad=w?no(x):yes(x);
   return {qen:x.pq,ja:x.pja,p:`「${w?x.y:x.nn}」と 答えたい`,o:[ok,bad],why:`${x.en.replace(/\?$/,'')}? と 聞かれても 答えは 同じ ${ok}`,mis:w?`「${x.y}」なら Yes。 質問が どっちでも 答えは 同じだよ`:`「${x.nn}」なら No。 質問が どっちでも 答えは 同じだよ`,hint:ynHint(x,w)}},
 /* Yes の 後ろは 肯定、 No の 後ろは 否定 */
 ynPair:()=>{const x=pick(YN),w=Math.random()<.5,ok=w?yes(x):no(x),bad=w?`No, ${x.s} ${x.a}.`:`Yes, ${x.s}${x.n[0]==="'"?'':' '}${x.n}.`;
   return {qen:x.en,ja:x.ja,p:`「${w?x.y:x.nn}」と 答えたい`,o:[ok,bad],why:'Yes の 後ろは 肯定、 No の 後ろは 否定',mis:`${bad} は 英語に ない 形。 Yes の 後ろは かならず 肯定（${yes(x)}）、 No の 後ろは かならず 否定（${no(x)}）`,hint:'Yes と 後ろの 文は いつも 同じ むき。 Yes なら 肯定、 No なら 否定'}},
 /* 英語の 答えを 聞いて 意味を とる */
 ynJa:()=>{const x=pick(YN),w=Math.random()<.5,ans=w?yes(x):no(x);
   return {qen:`${x.en} — ${ans}`,ja:x.ja,p:'この 答えの 意味は？',o:w?[x.y,x.nn]:[x.nn,x.y],why:w?`Yes → 「${x.y}」`:`No → 「${x.nn}」`,
     mis:w?`日本語なら 「はい」＝ 「${x.nn}」に なるけど、 英語の Yes は 「${x.y}」。 Yes の 後ろ（${x.s} ${x.a}）は 肯定だよ`:`日本語なら 「いいえ」＝ 「${x.y}」に なるけど、 英語の No は 「${x.nn}」。 No の 後ろ（${no(x).slice(4,-1)}）は 否定だよ`,hint:'Yes / No の すぐ 後ろの 文を 見てね。 肯定？ 否定？'}},
};

/* ================================================================ 🍎 a / the / なし */
const ART=[
 {s:'I have ___ dog.',ja:'犬を 1ぴき かっている',o:['a','the'],mis:'はじめて 話に 出る 1ぴき → a。 the は 「どの 犬か もう わかってる」とき'},
 {s:'I have a dog. ___ dog is white.',ja:'犬を かっている。 その 犬は 白い',o:['The','A'],mis:'さっき 出た 犬 → もう わかってる → The'},
 {s:'Please close ___ door.',ja:'（この 部屋の）ドアを しめて',o:['the','a'],mis:'どの ドアか 見れば わかる → the'},
 {s:'She is ___ teacher.',ja:'彼女は 先生だ',o:['a','the'],mis:'たくさん いる 先生の 1人 → a。 the だと 「（話に 出てた）その 先生」に なる'},
 {s:'Look at ___ moon.',ja:'月を 見て',o:['the','a'],mis:'月は 1つしか ない → the'},
 {s:'I want ___ apple.',ja:'りんごが 1つ ほしい',o:['an','a'],mis:'apple は 「ア」の 音で はじまる → an'},
 {s:'I play ___ piano.',ja:'ピアノを ひく',o:['the','a'],mis:'楽器を 「ひく」 ときは the'},
 {s:'I saw ___ cat in the park.',ja:'公園で ねこを 見た',o:['a','the'],mis:'はじめて 出る ねこ → a'},
 {s:'Can you open ___ window?',ja:'（そこの）まどを あけて くれる？',o:['the','a'],mis:'目の前の どの まどか わかる → the'},
 {s:'He has ___ umbrella.',ja:'彼は かさを もっている',o:['an','a'],mis:'umbrella は 「ア」の 音 → an'},
 {ja:'音楽が すき',o:['I like music.','I like a music.'],mis:'music は 数えない → a は つかない'},
 {ja:'テニスを しよう',o:["Let's play tennis.","Let's play the tennis."],mis:'スポーツには a も the も つけない'},
 {ja:'毎日 水を 飲む',o:['I drink water every day.','I drink a water every day.'],mis:'water は 数えない → a は つかない'},
 {ja:'バスで 学校へ 行く',o:['I go to school by bus.','I go to the school by a bus.'],mis:'go to school・by bus は 決まった 言いかた。 a も the も いらない'},
 {ja:'犬が すき（犬 ぜんぶ）',o:['I like dogs.','I like dog.'],mis:'「犬と いう もの ぜんぶ」は dogs（-s）。 a も the も つけない'},
];
T.art=()=>{const x=pick(ART);return {s:x.s,ja:x.ja,o:x.o.slice(),why:x.mis,mis:x.mis,hint:'はじめて 出る？ もう どれか わかってる？ 数えられる？'}};

/* ================================================================ 🔢 1つ？ 2つ いじょう？ */
const NOUN=[['dog','dogs','犬','ひき'],['cat','cats','ねこ','ひき'],['book','books','本','さつ'],['box','boxes','はこ','こ'],['child','children','子ども','人'],['apple','apples','りんご','こ'],['pen','pens','ペン','本'],['friend','friends','友だち','人'],['bus','buses','バス','台'],['man','men','男の人','人'],['watch','watches','うで時計','こ'],['dish','dishes','おさら','まい']];
const NUM=[['two','2'],['three','3'],['five','5'],['many','たくさんの',1],['some','いくつかの',1]];
T.num=()=>{const n=pick(NOUN),r=Math.random();
  if(r<.45){const k=pick(NUM),ja=k[2]?`${k[1]} ${n[2]}が いる・ある`:`${n[2]}が ${k[1]}${n[3]} いる・ある`;
    const irr=!n[1].endsWith('s');
    return {s:`I have ${k[0]} ___.`,ja,o:[n[1],n[0]],why:irr?`${n[0]} の 2つ いじょうは ${n[1]}`:`${k[0]} → 2つ いじょう → ${n[1]}`,
      mis:irr?`2つ いじょう なのは あってる！ でも ${n[0]} は -s じゃなくて ${n[1]} に かわるよ`:`日本語は 「${n[2]}」の ままで いいけど、 英語は 2つ いじょう なら -s（${n[1]}）`,hint:'いくつ ある？ 2つ いじょうなら 形が かわるよ'}}
  if(r<.7){const irr=!n[1].endsWith('s');if(irr)return T.num();
    return {s:`I have a ___.`,ja:`${n[2]}が 1${n[3]} いる・ある`,o:[n[0],n[1]],why:'a は 「1つ」 → -s なし',mis:`a が 「1つ」の しるし。 1つ なら -s は つけない（a ${n[0]}）`,hint:'a は 「1つ」 だよ'}}
  const k=pick(NUM.filter(x=>!x[2])),pl=Math.random()<.5;
  return pl?{s:`${cap(k[0])} ${n[1]} ___ in the room.`,ja:`へやに ${n[2]}が ${k[1]}${n[3]} いる・ある`,o:['are','is'],why:`${n[1]} は 2つ いじょう → are`,mis:`${n[1]} は 2つ いじょう → be も 2つ いじょうの are`,hint:'主語は 1つ？ 2つ いじょう？'}
    :{s:`A ${n[0]} ___ in the room.`,ja:`へやに ${n[2]}が 1${n[3]} いる・ある`,o:['is','are'],why:'1つ → is',mis:`a ${n[0]} は 1つ → is`,hint:'主語は 1つ？ 2つ いじょう？'}};

/* ================================================================ 👤 主語を はぶけない */
const SUB=[
 ['寒いね','It\'s cold.','Is cold.','天気・寒さの 文の 主語は it'],['雨が ふってる','It\'s raining.','Is raining.','天気の 主語は it'],['7時だよ','It\'s seven.','Is seven.','時間の 主語も it'],
 ['（わたし）行くよ','I\'ll go.','Will go.','だれが 行く？ → I'],['（わたし）ねむい','I\'m sleepy.','Am sleepy.','だれが ねむい？ → I'],['月曜日だ','It\'s Monday.','Is Monday.','曜日の 主語も it'],
 ['（彼は）とても やさしいよ','He\'s very kind.','Is very kind.','だれの こと？ → he'],['（わたし）きのう それを 見たよ','I saw it yesterday.','Saw it yesterday.','だれが 見た？ → I'],
 ['暗く なってきた','It\'s getting dark.','Is getting dark.','明るさ・天気の 主語は it'],['楽しい？（それ）','Is it fun?','Is fun?','質問でも 主語の 席は いる → is it'],
 ['駅まで 遠い？','Is it far to the station?','Is far to the station?','きょりの 主語も it'],['（あなた）おなか すいた？','Are you hungry?','Are hungry?','だれの こと？ → you'],
 ['（わたしたち）おくれちゃう！','We\'ll be late!','Will be late!','だれが？ → we'],['夏だね','It\'s summer.','Is summer.','季節の 主語も it'],
];
T.subj=()=>{const x=pick(SUB);return {ja:x[0],o:[x[1],x[2]],why:x[3],mis:`日本語は 主語を 言わなくて いいけど、 英語は 主語の 席が かならず いる。 ${x[3]}`,hint:'だれが？ 何が？ 天気・時間・寒さ なら it'}};

/* ================================================================ 🐝 3人称の s（主語が ひっかけ） */
const S3=[
 ['It','rains','rain','a lot in June.','6月は 雨が たくさん ふる',1,'it'],['The dog','barks','bark','at night.','その 犬は 夜に ほえる',1,'it'],
 ['Everyone','knows','know','his name.','みんな 彼の 名前を 知っている',1,'he と 同じ（everyone は 1人ずつ 見る ことば）'],
 ['My parents','work','works','in Tokyo.','両親は 東京で はたらいている',0,'they（2人）'],['Ken and I','play','plays','soccer.','ケンと わたしは サッカーを する',0,'we'],
 ['This bus','goes','go','to the station.','この バスは 駅へ 行く',1,'it（1台）'],['My friends','live','lives','near here.','友だちは この 近くに 住んでいる',0,'they'],
 ['The sun','rises','rise','in the east.','太陽は 東から のぼる',1,'it'],['My sister','watches','watch','TV every night.','妹は 毎晩 テレビを 見る',1,'she'],
 ['He','has','have','two cats.','彼は ねこを 2ひき かっている',1,'he（have は has に なる）'],['Tom','studies','study','English.','トムは 英語を 勉強する',1,'he'],
 ['The students','like','likes','music.','生徒たちは 音楽が すき',0,'they'],['Our school','starts','start','at eight.','学校は 8時に はじまる',1,'it'],
 ['You','look','looks','happy.','うれしそうだね',0,'you'],['My cat','sleeps','sleep','all day.','うちの ねこは 一日中 ねている',1,'it'],
];
T.s3x=()=>{const x=pick(S3);return {s:`${x[0]} ___ ${x[3]}`,ja:x[4],o:[x[1],x[2]],why:x[5]?`${x[0]} → ${x[6]} → -s`:`${x[0]} → ${x[6]} → -s なし`,
  mis:x[5]?`${x[0]} を おきかえると ${x[6]}。 1人・1つで 今の こと → -s を わすれた かな`:x[0].toLowerCase()===x[6]?`${x[0]} には -s は つかない。 -s は he・she・it の ときだけ`:`${x[0]} を おきかえると ${x[6]}。 -s は he・she・it の ときだけ`,hint:'主語を he・she・it・they の どれかに おきかえて みて'}};

/* ================================================================ ⏰ 今？ いつも？ */
const NOW=[
 ['I ___ tennis every Sunday.','毎週 日曜に テニスを する','play','am playing','every Sunday → いつもの こと'],['I ___ tennis now.','今 テニスを している','am playing','play','now → ちょうど 今 している'],
 ['Look! The baby ___.','見て！ 赤ちゃんが 泣いてる','is crying','cries','Look! → 目の前で 今'],['She usually ___ to school by bus.','彼女は ふだん バスで 学校へ 行く','goes','is going','usually → いつもの こと'],
 ['Be quiet. Ken ___.','しずかに。 ケンが 勉強してる','is studying','studies','今 まっさいちゅう'],['My father ___ in a bank.','父は 銀行で はたらいている','works','is working','「はたらいている」でも 仕事は ふだんの こと'],
 ['I ___ his name.','彼の 名前を 知っている','know','am knowing','know は もう 「知っている」 状態 → -ing に しない'],['I ___ a dog.','犬を かっている','have','am having','「かっている」は 状態 → have'],
 ['We ___ lunch now.','今 昼ごはんを 食べている','are eating','eat','now → 今 している'],['He ___ coffee every morning.','彼は 毎朝 コーヒーを 飲む','drinks','is drinking','every morning → いつもの こと'],
 ['Listen! Someone ___ the piano.','聞いて！ だれかが ピアノを ひいてる','is playing','plays','Listen! → 今 聞こえている'],['Tom ___ English well.','トムは 英語を じょうずに 話す','speaks','is speaking','ふだんの 力 → いつもの こと'],
 ['I ___ in Osaka.','大阪に 住んでいる','live','am living','「住んでいる」は ずっとの こと'],['Mina ___ a letter right now.','ミナは 今 手紙を 書いている','is writing','writes','right now → 今'],
];
T.now=()=>{const x=pick(NOW),ing=/ing$/.test(x[2]);return {s:x[0],ja:x[1],o:[x[2],x[3]],why:`${x[4]} → ${x[2]}`,
  mis:ing?`${x[4]}。 「今 している 最中」は be ＋ -ing`:`日本語の 「〜している」に つられたかな。 ${x[4]} → ${x[2]}`,hint:'今 この しゅんかん？ それとも ふだん・ずっとの こと？'}};

/* ================================================================ 🔀 ことばの 順番 */
const ORD=[
 ['わたしは 東京で 友だちと テニスを した','I played tennis with my friend in Tokyo.','I played with my friend tennis in Tokyo.','「何を」（tennis）は 動詞の すぐ 後ろ。 「だれと」「どこで」は その あと'],
 ['ケンは 毎朝 公園で 走る','Ken runs in the park every morning.','Ken every morning runs in the park.','動詞（runs）は 主語の すぐ 後ろ。 「いつ」は ふつう さいご'],
 ['わたしは きのう 図書館で 本を 読んだ','I read a book in the library yesterday.','I read in the library a book yesterday.','「何を」（a book）は 動詞の すぐ 後ろ。 場所 → 時 の じゅん'],
 ['これは わたしが 作った ケーキだ','This is the cake I made.','This is I made the cake.','「わたしが 作った」の 説明は ケーキの 後ろから'],
 ['赤い ぼうしの 女の子が 来た','The girl in the red hat came.','The in the red hat girl came.','「赤い ぼうしの」の 説明は girl の 後ろから'],
 ['わたしは 英語を 話す ことが できる','I can speak English.','I English can speak.','だれが → できる → 話す → 何を'],
 ['あなたは どこに 住んでいるの？','Where do you live?','Where you live?','Where の あとは 質問の 形（do you live）'],
 ['ぼくは 7時に 起きる','I get up at seven.','I at seven get up.','動詞は 主語の すぐ 後ろ。 時間は その あと'],
 ['わたしは とても つかれている','I am very tired.','I very tired am.','be（am）は 主語の すぐ 後ろ'],
 ['母は わたしに 本を くれた','My mother gave me a book.','My mother me a book gave.','だれが → くれた → だれに → 何を'],
 ['わたしは 海で およぐのが すき','I like swimming in the sea.','I in the sea swimming like.','だれが → すき → 何が（swimming）→ どこで'],
 ['駅の 近くの 店で 買った','I bought it at a shop near the station.','I bought it at a near the station shop.','「駅の 近くの」の 説明は shop の 後ろから'],
];
T.order=()=>{const x=pick(ORD);return {ja:x[0],o:[x[1],x[2]],why:x[3],mis:`日本語の じゅんばんに つられたかな。 ${x[3]}`,hint:'まず 「だれが → どうする」。 くわしい ことは その 後ろに ならべる'}};

/* ================================================================ 名前・くわしく（DET）・カテゴリー */
const KN={ynNeg:'はい・いいえ（ないの？）',ynPos:'はい・いいえ（ふつう）',ynPair:'Yes の 後ろは 肯定',ynJa:'Yes / No の 意味',art:'a / the / なし',num:'1つ？ 2つ いじょう？',subj:'主語を はぶけない',s3x:'3人称の s',now:'今？ いつも？',order:'ことばの 順番'};
const D_YN={t:'はい・いいえ: 質問は 見ない',b:'英語の Yes / No は <b>自分の 答えの 中身</b> だけで きまるの。 答えが 「する・そう」なら <b>Yes</b>、 「しない・ちがう」なら <b>No</b>。 日本語は 「相手の 言った ことに 合ってる？」で 「はい」を えらぶから、 否定の 質問（〜ないの？）で 逆に なるんだよ。 だから Yes を 「はい」、 No を 「いいえ」と 訳すと こんがらがる。 Yes は <b>肯定チームの ふだ</b>（I do と セット）、 No は <b>否定チームの ふだ</b>（I don\'t と セット）',
  ok:["Don't you like cats? — Yes, I do.（好き）","Don't you like cats? — No, I don't.（好きじゃない）","Do you like cats? — Yes, I do.（好き）"],ng:["Yes, I don't.","No, I do."],tip:'Yes・No を はい・いいえ と 訳さない。 I do か I don\'t を 決めれば、 Yes・No は 自動で ついてくる'};
const DET={ynNeg:D_YN,ynPos:D_YN,ynPair:D_YN,ynJa:D_YN,
 art:{t:'a / the / なし',ch:6,b:'<b>a</b> は 「たくさん ある 中の 1つ（はじめて 出る）」、 <b>the</b> は 「どれの ことか もう わかってる」。 music・water・tennis みたいに <b>数えない もの</b>には a を つけないよ。 「ア・イ・ウ・エ・オ」の 音で はじまる ことばは <b>an</b>',
  ok:['I have a dog. The dog is white.','Look at the moon.','I like music.'],ng:['I have the dog.（はじめてなのに）','I like a music.','Let\'s play the tennis.'],tip:'日本語に ない 区別だから、 「はじめて？ わかってる？」の 2つだけ 見よう'},
 num:{t:'1つ？ 2つ いじょう？',b:'日本語は 「犬」の ままで いいけど、 英語は 毎回 数を きめる。 <b>2つ いじょう なら -s</b>（dogs）。 child → children・man → men みたいに 形が かわる ことばも ある。 主語が 2つ いじょうなら be も <b>are</b>',
  ok:['I have two dogs.','I have a dog.','Three children are in the room.'],ng:['I have two dog.','I have a dogs.','Three childs is in the room.'],tip:'a ＝ 1つの しるし。 a と -s は いっしょに つかない'},
 subj:{t:'主語を はぶけない',ch:10,b:'日本語は 「行くよ」「寒いね」で 通じるけど、 英語は <b>主語の 席が かならず いる</b>。 だれか いる なら I・you・he…、 天気・時間・寒さ・きょり みたいに 「だれも いない」 ときは 意味の ない <b>it</b> で 席を うめるの',
  ok:["It's cold.","I'll go.",'Is it fun?'],ng:['Is cold.','Will go.','Is fun?'],tip:'英語の 文は 「主語 ＋ 動詞」から はじまる'},
 s3x:{t:'3人称の s: 主語を he・she・it・they に おきかえる',ch:5,b:'-s が つくのは 主語が <b>he・she・it（1人・1つ）</b>で 今の こと。 主語が 長い ときは <b>he・she・it・they の どれに なるか</b> おきかえて みて。 Ken and I は we、 my parents は they、 everyone は he と 同じ あつかい',
  ok:['Everyone knows him.','My parents work in Tokyo.','The sun rises in the east.'],ng:['Everyone know him.','My parents works in Tokyo.'],tip:'-s は 主語が 1つの ときの しるし。 名詞の -s（2つ いじょう）とは 逆'},
 now:{t:'今 している？ いつも する？',ch:3,b:'日本語の 「〜している」は 2つの 意味が ある。 <b>ちょうど 今 している 最中</b>なら <b>be ＋ -ing</b>（I am playing）。 <b>ふだん・ずっとの こと</b>なら そのまま（I play・I live・I know）。 know・have（かう）・like は 状態の ことばで -ing に しないよ',
  ok:['I play tennis every Sunday.','I am playing tennis now.','I know his name.'],ng:['I am playing tennis every Sunday.','I am knowing his name.'],tip:'now・Look!・Listen! → -ing ／ every day・usually → そのまま'},
 order:{t:'ことばの 順番: だれが → どうする → くわしく',ch:4,b:'日本語は 動詞が さいご（わたしは 東京で テニスを <b>した</b>）。 英語は <b>だれが → どうする（動詞）→ 何を</b> を 先に 言って、 「だれと・どこで・いつ」は その 後ろに ならべる。 「赤い ぼうしの 女の子」の ような 説明も <b>後ろから</b> つけるよ',
  ok:['I played tennis with my friend in Tokyo.','the girl in the red hat','This is the cake I made.'],ng:['I in Tokyo with my friend tennis played.','the in the red hat girl'],tip:'英語は 大事な ことが 先、 くわしい ことは 後ろ'},
};
/* les = ワンポイントレッスン（p: 見る ところ, ex: 🔊 例） */
const CATS=[
 {id:'yn',ico:'🙆',t:'はい・いいえ',sub:'Don\'t you〜? に どう 答える？',ks:['ynNeg','ynPos','ynPair','ynJa'],n:20,nw:1,g:'jp',hint:'質問は 見ない。 答えが 「する」なら Yes、 「しない」なら No',
  les:{p:['🚫 Yes ＝ 「はい」、 No ＝ 「いいえ」と <b>訳さない</b>。 Yes は 「後ろに <b>肯定</b>（I do）が 来るよ」、 No は 「後ろに <b>否定</b>（I don\'t）が 来るよ」の 合図','🙈 <b>質問は 見ない</b>。 先に 決めるのは <b>I do か I don\'t か</b> だけ','🙆 I do（する・そう）→ <b>Yes</b> が 自動で つく　🙅 I don\'t（しない・ちがう）→ <b>No</b> が 自動で つく','☝️ だから Yes, I don\'t. や No, I do. は ない'],
   ex:[["Don't you like cats? — Yes, I do.",'ねこ 好きじゃ ないの？ — （いや、）好きだよ'],["Don't you like cats? — No, I don't.",'— うん、 好きじゃ ない'],['Do you like cats? — No, I don\'t.','質問が かわっても 答えは 同じ']]}},
 {id:'art',ico:'🍎',t:'a / the / なし',sub:'はじめて？ もう わかってる？',ks:['art'],n:15,g:'jp',hint:'はじめて 出る → a、 どれか わかってる → the、 数えない → なし',
  les:{p:['🆕 はじめて 出る 1つ → <b>a</b>（アイウエオの 音なら an）','👉 どれの ことか わかってる・1つしか ない → <b>the</b>','💧 数えない もの（water・music）・スポーツ → <b>なし</b>'],ex:[['I have a dog. The dog is white.','犬を かってる。 その 犬は 白い'],['Look at the moon.','月を 見て'],['I like music.','音楽が すき']]}},
 {id:'num',ico:'🔢',t:'1つ？ 2つ いじょう？',sub:'dog か dogs か',ks:['num'],n:15,g:'jp',hint:'いくつ ある？ 2つ いじょうなら -s・are',
  les:{p:['☝️ 1つ → <b>a dog</b>（a が 1つの しるし）','✌️ 2つ いじょう → <b>dogs</b>（-s）。 child → children・man → men','🟰 主語が 2つ いじょうなら be も <b>are</b>'],ex:[['I have two dogs.','犬を 2ひき かってる'],['Three children are here.','子どもが 3人 いる']]}},
 {id:'subj',ico:'👤',t:'主語を はぶけない',sub:'「寒いね」も It\'s cold.',ks:['subj'],n:15,g:'jp',hint:'だれが？ 何が？ 天気・時間・寒さ なら it',
  les:{p:['👤 英語の 文は かならず <b>主語</b>から','🙋 だれか いる → I・you・he・we…','🌧 天気・時間・寒さ・きょり → 意味の ない <b>it</b> で 席を うめる'],ex:[["It's cold.",'寒いね'],["I'll go.",'行くよ'],['Is it far?','遠い？']]}},
 {id:'s3x',ico:'🐝',t:'3人称の s',sub:'主語を he・she・it に おきかえ',ks:['s3x','s3'],n:15,g:'jp',hint:'主語を he・she・it・they に おきかえて みて',
  les:{p:['🐝 主語が <b>he・she・it（1人・1つ）</b>で 今の こと → 動詞に <b>-s</b>','🔁 長い 主語は おきかえる: Ken and I → we ／ my parents → they ／ everyone → he','🙅 I・you・we・they には つかない'],ex:[['Everyone knows him.','みんな 彼を 知ってる'],['My parents work in Tokyo.','両親は 東京で はたらいてる']]}},
 {id:'now',ico:'⏰',t:'今？ いつも？',sub:'「〜している」は 2つの 意味',ks:['now'],n:15,g:'jp',hint:'今 この しゅんかん？ それとも ふだん・ずっと？',
  les:{p:['🎬 ちょうど 今 している 最中 → <b>be ＋ -ing</b>（now・Look!・Listen!）','🔁 ふだん・ずっとの こと → <b>そのまま</b>（every day・usually・仕事・住んでる）','🧊 know・have（かう）・like は -ing に しない'],ex:[['I am playing tennis now.','今 テニスを してる'],['My father works in a bank.','父は 銀行で はたらいてる'],['I know his name.','名前を 知ってる']]}},
 {id:'order',ico:'🔀',t:'ことばの 順番',sub:'だれが → どうする が 先',ks:['order'],n:15,g:'jp',hint:'まず 「だれが → どうする」。 くわしい ことは 後ろ',
  les:{p:['1️⃣ <b>だれが → どうする → 何を</b> を 先に','2️⃣ だれと・どこで・いつ は その 後ろ','3️⃣ 「赤い ぼうしの〜」の 説明も <b>後ろから</b>'],ex:[['I played tennis with my friend in Tokyo.','東京で 友だちと テニスを した'],['the girl in the red hat','赤い ぼうしの 女の子']]}},
];
window.SKJP={T,KN,DET,CATS};
})();
