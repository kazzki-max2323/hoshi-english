/* ⚡ 特別練習（SKDRILL）: 「英語のしくみ」の そばに ある 連発ドリル
   11/20 ユーザー「教わった 直後なら ゆっくり 考えれば わかる。 とっさに 出てこない」「動詞と 様子、 do、 疑問、 否定、 手伝い役を 連発で 50問くらい。 途中でも やめれる」
   - 1問 3〜5びょうの テンポ。 2択（ことばを えらぶ か 正しい 文を えらぶ）。 入力なし
   - 同じ 型を 主語・動詞を 言いかえて 3〜4問 つづけて 出す → つぎの 型へ
   - まちがえた 問題は 4問あとに そのまま、 8問あとに 同じ 型の 言いかえで もう一回
   - 正解は すぐ つぎへ。 まちがいは 正しい 文と ひとこと理由 → タップで つぎへ。 ✋ で いつでも おわれる
   入口: ミナ先生の ページの 💪特別授業 の 横（game/mina-plan.js）・英語のしくみの 時間の 一覧（unit.js opt.extra）
   セリフ kd_・x_kd は この ファイルの さいご。 きろくは localStorage 'hoshi_skdrill' */
(()=>{
const H=HE,esc=H.esc,$=id=>document.getElementById(id);
const {S:ST,sfx:SFX}=BEACH;const snd=k=>{try{SFX[k]&&SFX[k]()}catch(e){}};
const talk=en=>{try{speechSynthesis.cancel();window.SENSEI&&SENSEI.talk(en)}catch(e){}},hush=()=>{try{speechSynthesis.cancel()}catch(e){}};
const pick=a=>a[Math.random()*a.length|0];
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.random()*(i+1)|0;[a[i],a[j]]=[a[j],a[i]]}return a};
const face=(ex,tx)=>{try{return MINA.face('m',ex,MINA.poseFor?MINA.poseFor(ex,tx||''):undefined)}catch(e){return ''}};
const ML=(k,v)=>{try{return MINA.line(k,v||{})}catch(e){return ['smile','']}};
const KEY='hoshi_skdrill';
const R=(()=>{try{const s=JSON.parse(localStorage.getItem(KEY)||'null');if(s&&typeof s==='object')return s}catch(e){}return {}})();
R.miss=R.miss||{};
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(R))}catch(e){}};
const N=50;

/* ================================================================ ことばの 材料 */
/* 主語: [英語, 日本語, 人] 人 = 1(I) 2(you) 3(he・she) p(we・they) */
const SUBJ=[['I','わたし','1'],['You','あなた','2'],['He','彼','3'],['She','彼女','3'],['We','わたしたち','p'],['They','彼ら','p'],['Ken','ケン','3'],['My mother','母','3'],['Tom and Amy','トムと エイミー','p'],['My brother','兄','3']];
const is3=s=>s[2]==='3';
const beNow=s=>s[2]==='1'?'am':is3(s)?'is':'are',bePast=s=>s[2]==='1'||is3(s)?'was':'were';
const lowS=s=>s[0]==='I'?'I':s[0].replace(/^(He|She|You|We|They|My)\b/,m=>m.toLowerCase());
/* 動詞: v 原形, s 3単現, p 過去, ing, o うしろ, j = [する, しない, した, しなかった, する？, した？, するだろう, できる, している]（null は その 形では 出さない） */
const VERB=[
 {v:'play',s:'plays',p:'played',ing:'playing',o:'tennis',j:['テニスを する','テニスを しない','テニスを した','テニスを しなかった','テニスを する？','テニスを した？','テニスを するだろう','テニスが できる','テニスを している'],cat:0},
 {v:'like',s:'likes',p:'liked',ing:null,o:'dogs',j:['犬が すき','犬が すきじゃない',null,null,'犬が すき？',null,null,null,null],cat:0},
 {v:'go',s:'goes',p:'went',ing:'going',o:'to school',j:['学校へ 行く','学校へ 行かない','学校へ 行った','学校へ 行かなかった','学校へ 行く？','学校へ 行った？','学校へ 行くだろう','学校へ 行ける','学校へ 向かっている'],cat:0},
 {v:'eat',s:'eats',p:'ate',ing:'eating',o:'breakfast',j:['朝ごはんを 食べる','朝ごはんを 食べない','朝ごはんを 食べた','朝ごはんを 食べなかった','朝ごはんを 食べる？','朝ごはんを 食べた？','朝ごはんを 食べるだろう','朝ごはんを 食べられる','朝ごはんを 食べている'],cat:1},
 {v:'watch',s:'watches',p:'watched',ing:'watching',o:'TV',j:['テレビを 見る','テレビを 見ない','テレビを 見た','テレビを 見なかった','テレビを 見る？','テレビを 見た？','テレビを 見るだろう','テレビを 見られる','テレビを 見ている'],cat:0},
 {v:'study',s:'studies',p:'studied',ing:'studying',o:'English',j:['英語を 勉強する','英語を 勉強しない','英語を 勉強した','英語を 勉強しなかった','英語を 勉強する？','英語を 勉強した？','英語を 勉強するだろう','英語を 勉強できる','英語を 勉強している'],cat:0},
 {v:'have',s:'has',p:'had',ing:null,o:'a dog',j:['犬を かっている','犬を かっていない','犬を かっていた','犬を かっていなかった','犬を かっている？','犬を かっていた？',null,'犬を かえる',null],cat:0},
 {v:'cook',s:'cooks',p:'cooked',ing:'cooking',o:'dinner',j:['夕ごはんを 作る','夕ごはんを 作らない','夕ごはんを 作った','夕ごはんを 作らなかった','夕ごはんを 作る？','夕ごはんを 作った？','夕ごはんを 作るだろう','夕ごはんを 作れる','夕ごはんを 作っている'],cat:1},
 {v:'swim',s:'swims',p:'swam',ing:'swimming',o:'in the sea',j:['海で およぐ','海で およがない','海で およいだ','海で およがなかった','海で およぐ？','海で およいだ？','海で およぐだろう','海で およげる','海で およいでいる'],cat:1},
 {v:'drink',s:'drinks',p:'drank',ing:'drinking',o:'coffee',j:['コーヒーを 飲む','コーヒーを 飲まない','コーヒーを 飲んだ','コーヒーを 飲まなかった','コーヒーを 飲む？','コーヒーを 飲んだ？','コーヒーを 飲むだろう','コーヒーを 飲める','コーヒーを 飲んでいる'],cat:1},
];
/* 様子の ことば: a 英語, j = [いま, いまの 否定, 過去, 質問, will] */
const ADJ=[
 {a:'hungry',j:['おなかが すいている','おなかが すいていない','おなかが すいていた','おなかが すいている？','おなかが すくだろう']},
 {a:'tired',j:['つかれている','つかれていない','つかれていた','つかれている？','つかれるだろう']},
 {a:'busy',j:['いそがしい','いそがしくない','いそがしかった','いそがしい？','いそがしいだろう']},
 {a:'sleepy',j:['ねむい','ねむくない','ねむかった','ねむい？','ねむくなるだろう']},
 {a:'happy',j:['うれしい','うれしくない','うれしかった','うれしい？','よろこぶだろう']},
 {a:'sick',j:['具合が わるい','具合は わるくない','具合が わるかった','具合が わるい？','具合が わるく なるだろう']},
];
const jaS=(s,t)=>`${s[1]}は ${t}`;
/* 様子？ 動詞？（11/20 ユーザー「動詞と 様子が ちょっと あいまい」）: [英語, a=様子 v=動詞, 日本語, will の 日本語, ひとこと] */
const WP=[['sick','a','具合が わるい','具合が わるく なるだろう'],['sleepy','a','ねむい','ねむく なるだろう'],['sleep','v','ねむる','ねむるだろう'],['tired','a','つかれている','つかれるだろう'],
 ['angry','a','おこっている','おこるだろう'],['sad','a','かなしい','かなしく なるだろう'],['cry','v','泣く','泣くだろう'],['laugh','v','笑う','笑うだろう'],['late','a','おくれている','おくれるだろう'],
 ['win','v','勝つ','勝つだろう'],['happy','a','うれしい','よろこぶだろう'],['swim','v','およぐ','およぐだろう'],['hungry','a','おなかが すいている','おなかが すくだろう'],['eat','v','食べる','食べるだろう'],
 ['busy','a','いそがしい','いそがしく なるだろう'],['run','v','走る','走るだろう'],['kind','a','やさしい',null],['like','v','すき',null,'日本語は 「すき」でも 英語の like は 動詞'],['afraid','a','こわがっている',null],['work','v','はたらく','はたらくだろう'],['ready','a','用意が できている',null],['help','v','手伝う','手伝うだろう']];
/* 日本語訳の わな（11/22 ユーザー: like・want・know・live は 動詞、 hungry・sleepy は 様子 が まぎらわしい） */
WP.push(['want','v','ほしい',null,'日本語の 「ほしい」は 様子っぽいけど、 want は 動詞（very want ✕）'],['know','v','知っている',null,'「知っている」は 「〜ている」でも know は 動詞'],
 ['live','v','住んでいる',null,'「住んでいる」でも live は 動詞'],['need','v','必要だ',null,'「必要だ」は 様子っぽいけど need は 動詞'],['love','v','大すき',null,'「大すき」でも love は 動詞'],
 ['remember','v','覚えている',null,'「覚えている」でも remember は 動詞'],['understand','v','わかる',null,'understand は 動詞'],
 ['hungry','a','おなかが すいている','おなかが すくだろう','「すいている」は 動詞っぽいけど hungry は 様子（very hungry ⭕）'],['afraid','a','こわい',null,'「こわい」→ afraid は 様子。 I am afraid of〜'],['full','a','おなかが いっぱい',null,'full は 様子（very full ⭕）']);
const vOK=(i)=>VERB.filter(v=>v.j[i]);
/* ================================================================ 問題の 型
   1問 = {k: 型, ja, s: ___ の 文（なければ 文を えらぶ）, o: [正解, まちがい], why} */
/* [日本語, 英語, うしろ, 3単現（動詞なら）] */
const TRAP=[['犬が ほしい','want','a dog','wants'],['ねこが 好き','like','cats','likes'],['答えを 知っている','know','the answer','knows'],['東京に 住んでいる','live','in Tokyo','lives'],
 ['水が 必要だ','need','water','needs'],['その 話を 覚えている','remember','the story','remembers'],['あなたが 大すき','love','you','loves'],['犬を かっている','have','a dog','has'],
 ['おなかが すいている','hungry',''],['つかれている','tired',''],['犬が こわい','afraid','of dogs'],['ねむい','sleepy',''],['おこっている','angry',''],['おくれている','late',''],['おなかが いっぱい','full','']];
const T={
 /* 3単現の -s */
 s3:()=>{const s=pick(SUBJ),v=pick(vOK(0)),ok=is3(s)?v.s:v.v,ng=is3(s)?v.v:v.s;
   return {ja:jaS(s,v.j[0]),s:`${s[0]} ___ ${v.o}.`,o:[ok,ng],why:is3(s)?`${s[0]} は he・she の なかま → -s`:`${s[0]} には -s は つかない`}},
 /* Do / Does の 質問 */
 doQ:()=>{const s=pick(SUBJ.filter(x=>x[0]!=='I')),v=pick(vOK(4)),ok=is3(s)?'Does':'Do',ng=Math.random()<.5?(is3(s)?'Do':'Does'):(beNow(s)[0].toUpperCase()+beNow(s).slice(1));
   return {ja:jaS(s,v.j[4]),s:`___ ${lowS(s)} ${v.v} ${v.o}?`,o:[ok,ng],why:ng.match(/^(Is|Are|Am)$/)?`${v.v} は 動詞 → be じゃなくて ${ok}`:is3(s)?'he・she の 質問は Does':`${s[0]} の 質問は Do`}},
 /* does の あとは 原形 */
 doesV:()=>{const s=pick(SUBJ.filter(is3)),v=pick(vOK(4));
   return {ja:jaS(s,v.j[4]),s:`Does ${lowS(s)} ___ ${v.o}?`,o:[v.v,v.s],why:'-s は does が もっていく → 原形'}},
 /* don't / doesn't */
 doNeg:()=>{const s=pick(SUBJ),v=pick(vOK(1)),ok=is3(s)?"doesn't":"don't",ng=Math.random()<.5?(is3(s)?"don't":"doesn't"):(s[2]==='1'?"am not":is3(s)?"isn't":"aren't");
   return {ja:jaS(s,v.j[1]),s:`${s[0]} ___ ${v.v} ${v.o}.`,o:[ok,ng],why:!/^do/.test(ng)?`${v.v} は 動詞 → 否定は ${ok}`:is3(s)?"he・she は doesn't":`${s[0]} は don't`}},
 /* doesn't の あとは 原形 */
 doesntV:()=>{const s=pick(SUBJ.filter(is3)),v=pick(vOK(1));
   return {ja:jaS(s,v.j[1]),s:`${s[0]} doesn't ___ ${v.o}.`,o:[v.v,v.s],why:"-s は doesn't が もっていく → 原形"}},
 /* didn't / Did の あとは 原形 */
 didV:()=>{const q=Math.random()<.5,s=pick(q?SUBJ.filter(x=>x[0]!=='I'):SUBJ),v=pick(vOK(3));
   return q?{ja:jaS(s,v.j[5]),s:`Did ${lowS(s)} ___ ${v.o}?`,o:[v.v,v.p],why:'過去の しるしは did が もっていく → 原形'}
     :{ja:jaS(s,v.j[3]),s:`${s[0]} didn't ___ ${v.o}.`,o:[v.v,v.p],why:"過去の しるしは didn't が もっていく → 原形"}},
 /* 過去の ふつうの 文は ひとりで 過去形 */
 past:()=>{const s=pick(SUBJ),v=pick(vOK(2));
   return {ja:jaS(s,'きのう '+v.j[2]),s:`${s[0]} ___ ${v.o} yesterday.`,o:[v.p,v.v],why:'手伝い役が いない → 動詞が 自分で 過去形'}},
 /* be の 質問（do は つかわない） */
 beQ:()=>{const s=pick(SUBJ.filter(x=>x[0]!=='I')),a=pick(ADJ),b=beNow(s),ok=b[0].toUpperCase()+b.slice(1),ng=is3(s)?'Does':'Do';
   return {ja:jaS(s,a.j[3]),s:`___ ${lowS(s)} ${a.a}?`,o:[ok,ng],why:`${a.a} は 様子の ことば → be の 文。 do は つかわない`}},
 /* be の 否定 */
 beNeg:()=>{const s=pick(SUBJ),a=pick(ADJ),b=beNow(s),ok=b==='am'?'am not':b+"n't",ng=is3(s)?"doesn't":"don't";
   return {ja:jaS(s,a.j[1]),s:`${s[0]} ___ ${a.a}.`,o:[ok,ng],why:`${a.a} は 動詞じゃない → be に not`}},
 /* 過去の be の 質問 */
 beQp:()=>{const s=pick(SUBJ.filter(x=>x[0]!=='I')),a=pick(ADJ),b=bePast(s),ok=b[0].toUpperCase()+b.slice(1);
   return {ja:jaS(s,'きのう '+a.j[2].replace(/た$/,'た？')),s:`___ ${lowS(s)} ${a.a} yesterday?`,o:[ok,'Did'],why:`様子の ことば → be の 過去 ${ok}。 did は つかわない`}},
 /* 様子の ことばには be（文を えらぶ） */
 beAdj:()=>{const s=pick(SUBJ),a=pick(ADJ),b=beNow(s);
   return {ja:jaS(s,a.j[0]),o:[`${s[0]} ${b} ${a.a}.`,`${s[0]} ${a.a}.`],why:`${a.a} は 動詞じゃない → be で うめる`}},
 /* 動詞は 1つ（文を えらぶ） */
 one:()=>{const s=pick(SUBJ),v=pick(vOK(0)),b=beNow(s),vv=is3(s)?v.s:v.v;
   return {ja:jaS(s,v.j[0]),o:[`${s[0]} ${vv} ${v.o}.`,`${s[0]} ${b} ${v.v} ${v.o}.`],why:`${v.v} が 動詞 → be は いらない（動詞は 1つ）`,mis:`「${v.j[0]}」の 日本語に つられて ${b} を 入れたかな。 ${v.v} が もう 動詞 → 動詞は 1つ`}},
 /* will ＋ be ＋ 様子（文を えらぶ） */
 willBe:()=>{const s=pick(SUBJ),a=pick(ADJ),r=Math.random();
   const ng=r<.5?`${s[0]} will ${a.a}.`:`${s[0]} will ${beNow(s)} ${a.a}.`;
   return {ja:jaS(s,a.j[4]),o:[`${s[0]} will be ${a.a}.`,ng],why:r<.5?`様子の ことばには be。 will の あとは 原形 be`:`will の あとは 原形 → be`}},
 /* 様子？ 動詞？ を 見分ける */
 which:()=>{const w=pick(WP),a=w[1]==='a';
   return {ja:`${w[0]}（${w[2]}）`,p:'は 様子の ことば？ 動詞？',o:a?['様子の ことば','動詞']:['動詞','様子の ことば'],why:w[4]||(a?`very ${w[0]} と 言える → 様子。 文では be が いる`:`very ${w[0]} とは 言えない → 動詞。 be は いらない`),
   mis:a?`日本語の 「${w[2]}」に つられたかな。 very ${w[0]} と 言える → ${w[0]} は 様子の ことば（文では be が いる）`:`日本語の 「${w[2]}」に つられたかな。 very ${w[0]} とは 言えない → ${w[0]} は 動詞（be は いらない）`}},
 /* 日本語訳の わなを 文で（「ほしい」「好き」→ 動詞、 「すいている」「つかれている」→ 様子） */
 trap:()=>{const x=pick(TRAP),s=pick(x[3]?[['I','わたし','1'],['She','彼女','3'],['We','わたしたち','p']]:[['I','わたし','1'],['He','彼','3'],['They','彼ら','p']]);
   if(x[3]){const v=is3(s)?x[3]:x[1];return {ja:`${s[1]}は ${x[0]}`,o:[`${s[0]} ${v} ${x[2]}.`,`${s[0]} ${beNow(s)} ${x[1]} ${x[2]}.`],why:`${x[1]} は 動詞 → be は いらない`,
     mis:`日本語の 「${x[0].split(' ').pop()}」に つられて be を 入れたかな。 ${x[1]} は 動詞（very ${x[1]} ✕）→ be は いらない`,hint:'very を つけて 言える？ 言えなければ 動詞 → be なし'}}
   const b=beNow(s);return {ja:`${s[1]}は ${x[0]}`,o:[`${s[0]} ${b} ${x[1]}${x[2]?' '+x[2]:''}.`,`${s[0]} ${x[1]}${x[2]?' '+x[2]:''}.`],why:`${x[1]} は 様子 → be が いる`,
     mis:`${/ている$/.test(x[0])?`日本語の 「${x[0]}」は 動詞っぽいけど、 `:`「${x[0]}」の `}${x[1]} は 様子の ことば（very ${x[1]} ⭕）→ be が いる`,hint:'very を つけて 言える？ 言えたら 様子 → be が いる'}},
 /* will の あと: 様子なら be、 動詞なら そのまま（文を えらぶ） */
 willX:()=>{const s=pick(SUBJ),w=pick(WP.filter(x=>x[3])),a=w[1]==='a';
   return {ja:jaS(s,w[3]),o:a?[`${s[0]} will be ${w[0]}.`,`${s[0]} will ${w[0]}.`]:[`${s[0]} will ${w[0]}.`,`${s[0]} will be ${w[0]}.`],
     why:a?`${w[0]}（${w[2]}）は 様子 → be が いる。 「なる」は be`:`${w[0]}（${w[2]}）は 動詞 → be は いらない`}},
 /* will・can の あとは 原形 */
 modV:()=>{const s=pick(SUBJ.filter(is3)),c=Math.random()<.5,v=pick(vOK(c?7:6));
   return {ja:jaS(s,v.j[c?7:6]),s:`${s[0]} ${c?'can':'will'} ___ ${v.o}.`,o:[v.v,v.s],why:`${c?'can':'will'} の あとは 原形（-s は つかない）`}},
 /* be ＋ -ing（している） */
 ing:()=>{const s=pick(SUBJ),v=pick(vOK(8).filter(v=>v.ing)),b=beNow(s);
   return Math.random()<.5?{ja:jaS(s,'今 '+v.j[8]),s:`${s[0]} ${b} ___ ${v.o} now.`,o:[v.ing,v.v],why:'be の あとは -ing で 「している」'}
     :{ja:jaS(s,'今 '+v.j[8]),o:[`${s[0]} ${b} ${v.ing} ${v.o} now.`,`${s[0]} ${v.ing} ${v.o} now.`],why:'-ing は 様子の ことば → be が いる'}},
};
const KN={s3:'-s',doQ:'Do/Does の 質問',doesV:'does → 原形',doNeg:"don't / doesn't",doesntV:"doesn't → 原形",didV:'did → 原形',past:'過去形',beQ:'be の 質問',beNeg:'be の 否定',beQp:'was / were の 質問',beAdj:'様子には be',one:'動詞は 1つ',willBe:'will be ＋ 様子',modV:'will・can → 原形',ing:'be ＋ -ing',which:'様子？ 動詞？',trap:'日本語の わな',willX:'will の あと be？'};

/* 💡 ひとことを タップで くわしく（11/20 ユーザー「解説は シンプルで いい。 深掘り したく なったら タップで 詳細」）
   t 見出し, b 説明（なぜ そう なるか）, ok/ng ⭕❌の 例, tip ワンポイント, ch 英語のしくみの 何時間目（0から）。 カードは その場で 見られる */
const DET={
 s3:{t:'he・she の 「今」は 動詞に -s',ch:5,b:'主語が <b>わたし・あなた 以外の 1人・1つ</b>（he・she・it・Ken・my mother）で、 今の ことなら 動詞に <b>-s</b>。 I・you・we・they・2人 いじょうには つかないよ。 むかしの 英語は 主語ごとに 形が ちがって、 he の -s だけが 生き残ったの',
  ok:['She plays tennis.','They play tennis.'],ng:['She play tennis.','They plays tennis.'],tip:'Tom and Amy は 2人 → they と 同じで -s なし'},
 doQ:{t:'ふつうの 動詞の 質問は Do / Does',ch:5,b:'文の 中に <b>ふつうの 動詞</b>（play・like・go…）が あるときは、 質問を 運ぶ お手伝いさん <b>Do / Does</b> を 前に おくよ。 動詞が なくて 様子の ことば（hungry など）なら be の 文だから、 be を 前に 出すだけ',
  ok:['Do you like dogs?','Does he like dogs?','Are you hungry?'],ng:['Are you like dogs?','Do he like dogs?'],tip:'見分けかた: 文の 中に 動詞は ある？ → ある なら do、 ない なら be'},
 doesV:{t:'does が -s を もっていく',ch:5,b:'He plays の <b>-s</b> は、 質問に すると お手伝いさんの <b>does</b> が もっていくの。 -s は 文に 1つだけ だから、 動詞は <b>原形</b>に もどるよ',
  ok:['He plays tennis.','Does he play tennis?'],ng:['Does he plays tennis?'],tip:'does（do ＋ es）に もう -s が 入っている'},
 doNeg:{t:"ふつうの 動詞の 否定は don't / doesn't",ch:5,b:"not を 運ぶのも お手伝いさんの しごと。 ふつうの 動詞の 文は <b>don't / doesn't ＋ 原形</b>。 isn't / aren't は 動詞が ない be の 文（様子・名詞）の とき だけだよ",
  ok:["He doesn't like fish.","He isn't hungry."],ng:["He isn't like fish.","He doesn't hungry."],tip:'like は 動詞 → do の 文 ／ hungry は 様子 → be の 文'},
 doesntV:{t:"doesn't の あとは 原形",ch:5,b:"<b>doesn't</b> の 中に もう -s（does）が 入っているから、 動詞は <b>原形</b>。 -s は 文に 1つだけ",
  ok:["She doesn't watch TV."],ng:["She doesn't watches TV."],tip:"don't / doesn't / didn't の あとは いつも 原形"},
 didV:{t:'did が 過去の しるしを もっていく',ch:5,b:'She went の 「過去」の しるしは、 質問や 否定では お手伝いさんの <b>did</b> が もっていくの。 だから 動詞は <b>原形</b>。 did と went で 過去が 2つに なるのは ✕',
  ok:['She went to school.','Did she go to school?',"She didn't go to school."],ng:['Did she went to school?',"She didn't went."],tip:'過去の しるしも 文に 1つだけ'},
 past:{t:'手伝い役が いない ときは 動詞が 自分で 過去形',ch:1,b:'ふつうの 文（質問・否定じゃない）には お手伝いさんの did が いないから、 <b>動詞 自身が 過去形</b>に なるよ。 過去形は 「ひとりで 立てる 顔」',
  ok:['We played tennis yesterday.','She ate breakfast.'],ng:['We play tennis yesterday.'],tip:'went・ate・swam など 形が かわる 動詞は 3つの 顔で 覚えよう'},
 beQ:{t:'be の 文の 質問に do は いらない',mw:1,ch:2,b:'hungry や busy は <b>様子の ことば</b>で 動詞じゃない。 だから 文には be が 入っている（You are hungry）。 be の 文の 質問は <b>be を 前に 出すだけ</b>。 do は ふつうの 動詞の お手伝い だから 来ないよ',
  ok:['You are hungry.','Are you hungry?'],ng:['Do you hungry?','Do you are hungry?'],tip:'英語の 文は 動詞が 1つ。 be が その 1つ'},
 beNeg:{t:'be の 文の 否定は be に not',mw:1,ch:2,b:'様子の ことばの 文は be が 動詞。 否定は <b>be の うしろに not</b> を つけるだけ（am not・isn\'t・aren\'t）。 don\'t は ふつうの 動詞の 文で つかうの',
  ok:["I'm not hungry.","He isn't busy."],ng:["I don't hungry.","He doesn't busy."],tip:'be が ある 文に do は 入れない'},
 beQp:{t:'過去の be の 質問は Was / Were',mw:1,ch:0,b:'tired は 様子の ことば → be の 文。 過去の be は <b>was / were</b>。 質問は それを 前に 出すだけ。 did は ふつうの 動詞の お手伝い なので つかわないよ',
  ok:['You were tired.','Were you tired yesterday?'],ng:['Did you tired yesterday?','Did you were tired?'],tip:'I・he・she は was、 you・we・they は were'},
 beAdj:{t:'様子の ことばには be',mw:1,ch:2,b:'英語の 文には <b>動詞の 席</b>が かならず 1つ ある。 hungry や happy は 様子の ことばで 動詞じゃないから、 席が 空いている。 そこを <b>be</b> で うめるの',
  ok:['I am hungry.','She is happy.'],ng:['I hungry.','She happy.'],tip:'日本語の 「わたし、 ねむい」は そのままでは 英語に ならない'},
 one:{t:'英語の 文は 動詞が 1つ',mw:1,ch:2,b:'like・play・go などの 動詞が もう あるなら、 席は うまっている。 そこに be を 足すと 動詞が 2つに なって ✕。 be を 入れるのは <b>ほかに 動詞が ない ときだけ</b>',
  ok:['I like dogs.','He goes to school.'],ng:['I am like dogs.','He is go to school.'],tip:'am と いっしょに つかえるのは -ing（am playing）や 様子の ことば'},
 willBe:{t:'will の あとは 原形 be',mw:1,ch:0,b:'will の あとは いつも <b>原形</b>。 am・is・are の 原形は <b>be</b>。 それに tired は 様子の ことばで 動詞じゃないから、 be が ないと 動詞の 席が 空っぽ。 だから <b>will be tired</b>',
  ok:['I will be tired.','She will be busy.'],ng:['I will tired.','I will am tired.'],tip:'can be・want to be・have been も 同じ しくみ'},
 modV:{t:'will・can の あとは 原形',ch:4,b:'will・can・should などの 助動詞は <b>後ろの 動詞を 原形に する</b> セット。 -s も 過去形も つかない。 he・she でも 同じだよ',
  ok:['She can swim.','He will play tennis.'],ng:['She can swims.','He will plays tennis.'],tip:'助動詞じしんにも -s は つかない（cans ✕）'},
 trap:{t:'日本語の わな: 「ほしい」は 動詞、 「すいている」は 様子',ch:2,mw:1,b:'日本語の 形に つられないで。 <b>want（ほしい）・like（好き）・know（知っている）・live（住んでいる）・need（必要だ）</b>は 英語では 動詞 → be は いらない。 <b>hungry（すいている）・tired（つかれている）・afraid（こわい）・sleepy（ねむい）</b>は 様子の ことば → be が いる',
  ok:['I want a dog.','I know the answer.','I am hungry.','I am afraid of dogs.'],ng:['I am want a dog.','I am know the answer.','I hungry.'],tip:'very を つけて 言えたら 様子（very hungry ⭕・ very want ✕）'},
 which:{t:'様子の ことば？ 動詞？ の 見分け方',ch:2,mw:1,b:'<b>様子の ことば</b>は 「どんな 状態か」を 言う ことば（sick・tired・happy）。 動詞じゃないから 文では <b>be が いる</b>。 <b>動詞</b>は 「何を するか」（eat・cry・sleep）。 動詞が あれば be は いらないよ',
  ok:['I am sick.','I eat breakfast.','I like dogs.'],ng:['I sick.','I am eat breakfast.','I am like dogs.'],tip:'sleep（ねむる）は 動詞、 sleepy（ねむい）は 様子。 にている ペアに 注意'},
 willX:{t:'will の あと: 様子なら be、 動詞なら そのまま',ch:2,mw:1,b:'will の あとには 原形の 動詞が 1つ いる。 <b>動詞</b>（cry・sleep）なら それが 入って おしまい。 <b>様子の ことば</b>（sick・sleepy）は 動詞じゃないから、 <b>be</b> を 入れて 動詞の 席を うめるの。 日本語の 「〜に なる」の 「なる」は be が うけもつよ',
  ok:['You will be sick.','You will cry.','You will be sleepy.','You will sleep.'],ng:['You will sick.','You will be cry.'],tip:'very を つけて 言えたら 様子 → will be ＿'},
 ing:{t:'-ing は 様子の ことば → be が いる',ch:3,b:'playing・eating は もう 動詞じゃなくて <b>「している 様子」</b>の ことば（happy の 仲間）。 だから happy と 同じで <b>be が いる</b>。 be の あとの 動詞は -ing に して 「している」',
  ok:['They are playing tennis.','She is cooking now.'],ng:['They playing tennis.','She is cook now.'],tip:'happy に 入れかえて みて: They are happy. ← 同じ 形'},
};
/* 🚦 動詞チェック（game/verb-check.js）を まぜる */
[window.SKVC,window.SKJP].forEach(X=>{if(X){Object.assign(T,X.T);Object.assign(KN,X.KN);Object.assign(DET,X.DET)}});
const KS=Object.keys(T);
/* 📂 カテゴリー（11/22 ユーザー「特別練習の 中に、 全ての 練習、 動詞の チェック問題 など カテゴリー分けして」）
   all = 今までの 問題 ぜんぶ（動詞チェックも 入る）。 ほかは 型を しぼって 20問。 きろくは R.cat[id] = {n, best, t} */
const CATS=[
 {id:'all',ico:'⚡',t:'ぜんぶの 練習',sub:'今までの 問題 ぜんぶ',ks:KS,n:N},
 {id:'vc',ico:'🚦',t:'動詞チェック',sub:'主語の すぐ後ろは とくべつ？ ふつう？',ks:['vcKind','vcQ','vcNeg'],n:20,g:'v',hint:'主語の すぐ後ろの ことば、 自分で 前に 出られる？',
  les:{p:['👀 見るのは <b>主語の すぐ後ろ</b> だけ（主語が 長くても、 主語の かたまりの すぐ後ろ）','🚀 <b>とくべつな 動詞</b>（be・can・will・should・have＋過去分詞）→ 自分で 前へ・ not も すぐ後ろ','🙋 <b>ふつうの 動詞</b>（play・like・go・have＝かう）→ do / does / did の 出番・ 動詞は 原形'],
   ex:[['Ken can swim. → Can Ken swim?','とくべつ: 自分で 前へ'],['Ken swims. → Does Ken swim?','ふつう: does が 前へ']]}},
 {id:'do',ico:'🙋',t:'do の 出番',sub:'Do / does / did ・ don\'t',ks:['doQ','doesV','doNeg','doesntV','didV'],n:20,g:'v',hint:'ふつうの 動詞の 文？ → do・does・did。 do の あとは 原形',
  les:{p:['🙋 ふつうの 動詞の 質問・ not は <b>do / does / did</b> が 運ぶ','🎒 -s も 過去も do が もっていく → 動詞は <b>原形</b>','🐝 he・she は does、 過去は did'],ex:[['Does she play tennis?','テニス する？'],["I didn't go.",'行かなかった']]}},
 {id:'be',ico:'🌊',t:'be の 文',sub:'Are you〜? ・ isn\'t ・ -ing',ks:['beQ','beNeg','beQp','ing'],n:20,g:'v',hint:'様子の ことば・ -ing → be の 文。 be を 前に 出すだけ',
  les:{p:['🌊 様子の ことば（hungry）・ -ing の 文は <b>be</b> が 動詞','❓ 質問は be を 前へ、 not は be の すぐ後ろ','🙅 be の 文に do は 来ない'],ex:[['Are you hungry?','おなか すいた？'],["He isn't busy.",'彼は いそがしく ない']]}},
 {id:'yv',ico:'🔍',t:'様子？ 動詞？',sub:'be が いる？ いらない？',ks:['trap','which','one','beAdj','willX'],n:20,g:'v',hint:'very を つけて 言えたら 様子 → be が いる',
  les:{p:['🔍 <b>very</b> を つけて 言えたら 様子（very sick）→ <b>be が いる</b>','🏃 「何を する？」なら 動詞（eat・sleep）→ be は いらない','🌱 「〜に なる」の 「なる」は be（will be sick）'],ex:[['I am sick.','具合が わるい'],['I sleep.','ねむる'],['You will be sleepy.','ねむく なるよ']]}},
 {id:'form',ico:'✏️',t:'動詞の 形',sub:'-s ・ 過去形 ・ will / can の あと',ks:['s3','past','modV','willBe'],n:20,g:'v',hint:'前の ことばが 後ろの 形を きめる。 will・can の あとは 原形',
  les:{p:['🐝 he・she の 今 → <b>-s</b>','⏪ 手伝い役が いない 過去 → 動詞が <b>過去形</b>','🔗 will・can の あと → <b>原形</b>（be も）'],ex:[['She plays tennis.','テニスを する'],['We played tennis yesterday.','きのう した'],['He can swim.','およげる']]}},
].concat(window.SKJP?SKJP.CATS:[]).map(c=>Object.assign(c,{ks:c.ks.filter(k=>T[k])})).filter(c=>c.ks.length);
const catOf=id=>CATS.find(c=>c.id===id)||CATS[0];
/* 型 → カテゴリーの ヒント（ぜんぶの 練習でも つかう） */
const HINT={};CATS.forEach(c=>{if(c.id!=='all'&&c.hint)c.ks.forEach(k=>{if(!HINT[k])HINT[k]=c.hint})});
R.cat=R.cat||{};
const qkey=q=>(q.s||'')+'|'+(q.qen||'')+'|'+q.ja+'|'+(q.p||'')+'|'+q.o[0];
/* 同じ 問題は 一巡（その回の あいだ）するまで 出さない（まちがいの 出しなおしは べつ） */
function make(k,seen){let last=null;for(let n=0;n<20;n++){try{const q=T[k]();if(q&&q.o[0]!==q.o[1]){q.k=k;last=q;if(!seen||!seen.has(qkey(q))){seen&&seen.add(qkey(q));return q}}}catch(e){}}return last}
/* 型を 3〜4問ずつ。 まちがいの 多い 型を 先に 多めに */
function plan(c){const ks=c.ks,n=c.n,seen=new Set(),w=ks.slice().sort((a,b)=>(R.miss[b]||0)-(R.miss[a]||0)),top=w.filter(k=>R.miss[k]).slice(0,ks.length>4?3:1);
  const order=top.concat(shuffle(ks.filter(k=>!top.includes(k))));const L=[];
  while(L.length<n+20)order.forEach(k=>{const m=2+(Math.random()*2|0)+(top.includes(k)?1:0);for(let i=0;i<m;i++){const q=make(k,seen);if(q)L.push(q)}});
  return {L,seen}}
/* ミナ先生の おすすめ: まちがいが 多い 型の カテゴリー（なければ まだ やっていない もの） */
function rec(){let best=null,bs=0;CATS.forEach(c=>{if(c.id==='all')return;const m=c.ks.reduce((a,k)=>a+(R.miss[k]||0),0)-((R.cat[c.id]||{}).n||0)*2;if(m>bs){bs=m;best=c}});
  return best}

/* ================================================================ がめん */
let G=null;
function close(){const o=$('dpov');if(o)o.remove();G=null;hush()}
function shell(){let o=$('dpov');if(o)o.remove();try{window.DEEP&&DEEP.close()}catch(e){}
  o=document.createElement('div');o.id='dpov';document.body.appendChild(o);
  o.innerHTML=`<section class="pnl dpp mdp kdp" role="dialog" aria-label="特別練習">
    <div class="qtop"><button class="x" id="kdx" aria-label="やめる">✋</button><b>⚡ 特別練習</b><span class="qn" id="kdn"></span></div>
    <div class="kdbar"><i id="kdbar"></i></div>
    <div class="mdbox" id="kdbox"></div></section>`;
  $('kdx').onclick=()=>{snd('back');G&&G.i>0?finish(1):close()};
  o.onclick=e=>{if(e.target===o){snd('back');G&&G.i>0?finish(1):close()}};
  return $('kdbox')}
const minaBox=(ex,tx)=>`<div class="mdsay"><span class="lface">${face(ex,tx)}</span><p>${tx}</p></div>`;
/* 入口: カテゴリーを えらぶ（id を わたすと その カテゴリーの はじめへ） */
function open(id){if(typeof id==='string'&&CATS.some(c=>c.id===id))return intro(id);menu()}
function menu(){const box=shell();G=null;$('kdn').textContent='';$('kdbar').style.width='0';
  const r=rec(),vcNew=!(R.cat.vc||{}).n&&CATS.some(c=>c.id==='vc'),ynNew=!(R.cat.yn||{}).n&&CATS.some(c=>c.id==='yn');
  const [ex,tx]=!R.n?ML('kd_first0'):ynNew?ML('kd_menuJp'):vcNew?ML('kd_menuVc'):r?ML('kd_menuRec',{t:r.t}):ML('kd_menu');
  const row=c=>{const k=R.cat[c.id]||{};return `<button class="kdcat${c.id==='all'?' big':''}" data-c="${c.id}"><i>${c.ico}</i><span><b>${esc(c.t)}</b><small>${esc(c.sub)}</small></span>${c.nw&&!k.n?'<em class="kdnew">NEW</em>':r&&r.id===c.id?'<em class="kdrec">おすすめ</em>':k.best!=null?`<em class="kdbest">⭕${k.best}/${c.n}</em>`:''}</button>`};
  const grp=(g,h)=>{const L=CATS.filter(c=>c.g===g);return L.length?`<h4 class="kdgh">${h}</h4><div class="kdcats">${L.map(row).join('')}</div>`:''};
  box.innerHTML=`${minaBox(ex,tx)}<div class="kdcats">${CATS.filter(c=>c.id==='all').map(row).join('')}</div>${grp('v','🧠 動詞の しくみ')}${grp('jp','🇯🇵 日本語と ちがう ところ')}`;
  box.querySelectorAll('[data-c]').forEach(b=>b.onclick=()=>{snd('step');intro(b.dataset.c)})}
function intro(id){const c=catOf(id),box=$('kdbox')||shell();G=null;$('kdn').textContent='';
  const first=!(R.cat[c.id]||{}).n,[ex,tx]=ML(c.id==='all'?(R.n?'kd_start':'kd_first'):'kd_c_'+c.id+(first?'1':''),{n:c.n});
  box.innerHTML=`<p class="kdct">${c.ico} ${esc(c.t)}</p>${minaBox(ex,tx)}
    ${c.les?lesHtml(c.les)
     :`<div class="kdhow"><p>🇯🇵 日本語を 見て、 正しい ほうを <b>すぐ</b> タップ</p><p>⏱ 3びょう いないなら <b>はやい！</b></p><p>❌ まちがえた 形は 少し あとで また 出るよ</p><p>🤔 わからない ときは 教えて ・ ✋ で いつでも おわれる</p></div>`}
    <div class="mdnav"><button class="sub" id="kdmn">← えらびなおす</button><button id="kdgo">${c.ico} スタート（${c.n}問）</button></div>`;
  box.querySelectorAll('[data-say]').forEach(b=>b.onclick=e=>{e.stopPropagation();snd('pop');talk(b.dataset.say)});
  $('kdmn').onclick=()=>{snd('back');menu()};
  $('kdgo').onclick=()=>{snd('lesson');start(c.id)}}
/* 💡 ワンポイント レッスン（問題の 前に 毎回。 3行 ＋ 🔊 例） */
const lesHtml=l=>`<div class="kdles"><p class="kdlt">💡 ワンポイント レッスン</p>${l.p.map(x=>`<p>${x}</p>`).join('')}</div>${l.ex?`<div class="mdens">${l.ex.map(e=>`<button class="mden" data-say="${esc(e[0])}"><span>🔊 ${esc(e[0])}</span><small>${esc(e[1])}</small></button>`).join('')}</div>`:''}`;
function start(id){const c=catOf(id),p=plan(c);R.n=(R.n||0)+1;save();
  G={c,n:c.n,L:p.L,seenQ:p.seen,i:0,ok:0,fast:0,streak:0,best:0,miss:{},seen:0};ask()}
function ask(){const g=G;if(!g||!$('kdbox'))return;if(g.i>=g.n)return finish();
  const q=g.L[g.i]||make(pick(g.c.ks),g.seenQ);g.L[g.i]=q;g.t0=performance.now();g.lock=0;q.tch=0;
  $('kdn').textContent=`${g.i+1}/${g.n}`;$('kdbar').style.width=(g.i/g.n*100)+'%';
  const [a,b]=q.s?q.s.split('___'):['',''],ord=Math.random()<.5?[0,1]:[1,0];
  $('kdbox').innerHTML=`<div class="kdq">
      ${q.qen?`<p class="kdja kden2">${esc(q.qen)}<small class="kdgl">${esc(q.ja)}</small></p>`:q.sj?`<p class="kdja kden2">${sjHtml(q)}</p>`:`<p class="kdja">${esc(q.ja)}</p>`}
      ${q.s?`<p class="kden">${esc(a)}<u>　？　</u>${esc(b)}</p>`:`<p class="kden kdpick">${esc(q.p||'正しい 文は？')}</p>`}
      <div class="kdopts${q.s?'':' full'}">${ord.map(i=>`<button data-o="${i}">${esc(q.o[i])}</button>`).join('')}</div>
      <div class="kdfb" id="kdfb">${g.streak>=3?`<span class="kdst">🔥 ${g.streak} れんぞく</span>`:''}</div>
      <button class="mddunno prteachb kdteach" id="kdtb">🤔 教えて</button></div>`;
  $('kdbox').querySelectorAll('[data-o]').forEach(bt=>bt.onclick=()=>answer(+bt.dataset.o,bt));
  $('kdtb').onclick=()=>{snd('book');q.tch=1;teach(q)};
  /* 💭 まよっている（8びょう 答えない）→ ミナ先生が 見る ところを ひとこと（答えは 言わない） */
  clearTimeout(g.ht);const hn=q.hint||HINT[q.k];
  if(hn)g.ht=setTimeout(()=>{if(G!==g||g.lock||g.L[g.i]!==q||!$('kdfb'))return;q.tch=1;snd('pop');const [ex,tx]=ML('kd_think');
    $('kdfb').innerHTML=`<div class="kdthink"><span class="lface">${face(ex,tx)}</span><p><small>${esc(tx)}</small>${esc(hn)}</p></div>`},8000)}
/* 動詞チェックの 文: 主語の かたまりを わくで かこむ（とくべつ？ふつう？ では すぐ後ろの ことばに 下線） */
function sjHtml(q){const rest=q.ja.slice(q.sj.length).trim(),m=q.w&&rest.indexOf(q.w)===0;
  return `<span class="kdsj">${esc(q.sj)}</span> ${m?`<u>${esc(q.w)}</u>${esc(rest.slice(q.w.length))}`:esc(rest)}`}
const full=q=>q.s?q.s.replace('___',q.o[0]):q.o[0];
const say=q=>{const f=full(q);if(/^[A-Za-z]/.test(f))talk(f);else if(q.qen)talk(q.qen.split(' — ').pop());else if(q.k==='which')talk(q.ja.split('（')[0]);else if(q.sj)talk(q.ja)};
function answer(k,bt){const g=G;if(!g||g.lock)return;g.lock=1;clearTimeout(g.ht);const q=g.L[g.i],dt=(performance.now()-g.t0)/1000;
  const tb=$('kdtb');if(tb)tb.remove();
  $('kdbox').querySelectorAll('[data-o]').forEach(x=>{x.disabled=true;if(+x.dataset.o===0)x.classList.add('right')});
  if(k===0){g.ok++;g.streak++;g.best=Math.max(g.best,g.streak);const fast=!q.tch&&dt<=(q.ft||3);if(fast)g.fast++;snd('correct');
    const sp=g.streak>0&&g.streak%10===0?ML('kd_streak',{n:g.streak})[1]:'';
    $('kdfb').innerHTML=`<span class="kdok">⭕ ${fast?'<b>はやい！</b>':''}</span>${sp?`<span class="kdsp">${esc(sp)}</span>`:''}`;
    say(q);g.i++;setTimeout(()=>{if(G===g)ask()},sp?1500:fast?650:900);return}
  bt.classList.add('wrong');snd('wrong');g.streak=0;g.miss[q.k]=(g.miss[q.k]||0)+1;R.miss[q.k]=(R.miss[q.k]||0)+1;save();
  try{window.SENSEI&&SENSEI.gram(/^be|one|willBe|ing/.test(q.k)?'jh_be':q.k==='s3'?'jh_3s':'jh_do',0)}catch(e){}
  /* 4問あとに そのまま、 8問あとに 同じ 型の 言いかえ */
  g.L.splice(g.i+4,0,Object.assign({},q,{again:1}));const v=make(q.k);if(v)g.L.splice(g.i+9,0,v);
  /* 🧩 英語の 型（game/kata.js）: まちがえた 型の カードを さっと */
  const kt=window.KATA?KATA.of({k:q.k}):null;
  $('kdfb').innerHTML=`<div class="kdfix"><p>⭕ <b>${esc(full(q))}</b></p>${q.mis?`<p class="kdmis">🔎 ${esc(q.mis)}</p>`:''}<button class="kdwhy" id="kdwhy">💡 ${esc(q.why)}<i>くわしく ▶</i></button>${kt?KATA.chip(kt,'sm'):''}</div><div class="mdnav"><button class="sub" id="kdte">🤔 教えて</button><button id="kdnx">つぎへ ▶</button></div>`;if(kt)KATA.bind($('kdfb'));
  say(q);g.i++;$('kdnx').onclick=()=>{snd('step');hush();ask()};$('kdte').onclick=()=>{snd('book');teach(q)};
  $('kdwhy').onclick=()=>{snd('book');detail(q.k,q)}}
function finish(quit){const g=G;if(!g)return close();const n=g.i,ok=g.ok,c=g.c,N=g.n;G=null;hush();try{window.PRAC&&PRAC.closeTeach(1)}catch(e){}
  R.tot=(R.tot||0)+n;R.ok=(R.ok||0)+ok;if(!quit)R.full=(R.full||0)+1;const rate=n?ok/n:0;
  if(!quit&&c.id==='all'&&(!R.best||ok>R.best))R.best=ok;R.t=Date.now();
  const cr=R.cat[c.id]=R.cat[c.id]||{};if(n){cr.n=(cr.n||0)+1;cr.t=Date.now();if(!quit&&(cr.best==null||ok>cr.best))cr.best=ok}save();
  try{RECENT.add('skdrill',{n,ok,fast:g.fast,c:c.id==='all'?'':c.t})}catch(e){}
  const weak=Object.keys(g.miss).sort((a,b)=>g.miss[b]-g.miss[a]).slice(0,3);
  const coin=Math.round(ok/5)+(n>=N&&rate>=.9?(N>=50?5:2):0);
  const key=!n?'kd_quit0':quit?'kd_quit':rate>=.95?'kd_perfect':rate>=.8?'kd_good':'kd_more';
  const [ex,tx]=ML((c.id==='vc'||c.id==='yn')&&n&&!quit?'kd_'+c.id+(rate>=.9?'Good':'More'):key,{n,ok,f:g.fast});
  $('kdn').textContent='';$('kdbar').style.width=(n/N*100)+'%';
  $('kdbox').innerHTML=`<div class="kres mdres"><p class="kend good">${quit?'✋ ここまで！':`${c.ico} ${N}問 おわり！`}</p>
    <div class="snscore"><span>⭕ <b>${ok}</b>/${n}</span><span>⏱ はやい <b>${g.fast}</b></span><span>🔥 さいこう <b>${g.best}</b>れんぞく</span></div>
    ${coin?`<p class="kpay">🪙 <b>${coin}まい</b></p>`:''}${minaBox(ex,tx)}
    ${weak.length?`<p class="mdnote2">📘 まちがえた 型</p><div class="kdweak">${weak.map(k=>`<button data-dk="${k}">${esc(KN[k]||k)} ×${g.miss[k]} <i>💡</i></button>`).join('')}</div>`:''}
    ${whyNew()?'<button class="sub kdwhyt" id="kdwt">🤔 なんで こんなに 決まってるの？ <small>ミナ先生の おはなし</small></button>':''}
    <div class="mdnav"><button id="kdag">${c.ico} もう一回</button><button class="sub" id="kdmn">📂 ほかの 練習</button></div>
    <div class="mdnav">${window.SHIKUMI?'<button class="sub" id="kdsh">🧩 英語のしくみ</button>':''}<button class="sub" id="kdc">✖ とじる</button></div></div>`;
  if(coin)setTimeout(()=>{try{const b=$('kdbox').getBoundingClientRect();H.coinBurst(b.left+b.width/2,Math.min(b.top+60,innerHeight-60),coin)}catch(e){ST.coins+=coin}},400);
  quit?snd('pop'):snd('done');
  $('kdag').onclick=()=>{snd('lesson');shell();start(c.id)};$('kdmn').onclick=()=>{snd('step');menu()};
  const sh=$('kdsh');if(sh)sh.onclick=()=>{snd('book');close();SHIKUMI.open()};
  $('kdc').onclick=()=>{snd('back');close()};
  const wt=$('kdwt');if(wt)wt.onclick=()=>{snd('step');close();MCHAT.open('why',()=>MINA.open())};
  $('kdbox').querySelectorAll('[data-dk]').forEach(b=>b.onclick=()=>{snd('book');detail(b.dataset.dk)})}

/* 🤔 「なんで こんなに 決まってるの？」の おしゃべり（game/mina-chat-data.js の why）を まだ 聞いていない */
const whyNew=()=>{try{return !!window.MCHAT&&MCHAT.chats.some(c=>c.id==='why')&&!(MCHAT.rec().n.why>0)}catch(e){return false}};

/* 💡 くわしく: 練習の 上に 重ねる（練習は そのまま。 ← で もどる） */
function detail(k,q){const d=DET[k];if(!d)return;const sec=document.querySelector('#dpov .kdp');if(!sec)return;let o=sec.querySelector('.kddet');if(o)o.remove();
  const U=window.SHIKUMI,c=U&&d.ch!=null?U.D.CH[d.ch]:null;R.det=(R.det||0)+1;save();
  const [ex,tx]=ML('kd_det',{t:d.t});
  const en=s=>`<button class="mden" data-say="${esc(s)}"><span>🔊 ${esc(s)}</span></button>`;
  o=document.createElement('div');o.className='kddet';
  o.innerHTML=`<div class="qtop"><button class="x" id="kddx" aria-label="もどる">←</button><b>💡 くわしく</b><span></span></div>
    <h3 class="kddt">${esc(d.t)}</h3>${minaBox(ex,tx)}
    <div class="mdfig kddb"><p>${d.b}</p></div>
    ${q&&q.k==='which'?`<p class="mdnote2">さっきの 問題</p><div class="kdpair"><p class="ok">⭕ ${esc(q.ja)} → ${esc(q.o[0])}</p></div>`:''}${q&&q.k!=='which'?`<p class="mdnote2">さっきの 問題</p><div class="kdpair"><p class="ng">❌ ${esc(q.s?q.s.replace('___',q.o[1]):q.o[1])}</p><p class="ok">⭕ ${esc(full(q))}</p></div>`:''}
    <p class="mdnote2">⭕ こう 言う</p><div class="mdens">${d.ok.map(en).join('')}</div>
    <p class="mdnote2">❌ よくある まちがい</p><div class="kdng">${d.ng.map(s=>`<s>${esc(s)}</s>`).join('')}</div>
    ${d.tip?`<p class="mdmemo">💡 ${d.tip}</p>`:''}
    ${d.mw?`<div class="mdmemo kdmw">🔍 <b>動詞？ 様子？ の 見分け方</b><br>① <b>very</b> を つけて 言えたら 様子（very sick ⭕ ・ very eat ✕）→ be が いる<br>② 日本語で 「どんな 状態？」なら 様子、 「何を する？」なら 動詞<br>③ 「〜に なる」の 「なる」は <b>be</b> が うけもつ（will be sick）</div>`:''}
    ${c?`<button class="sub kdcard" id="kdcard">🧩 英語のしくみ ${d.ch+1}時間目「${esc(c.t)}」の カードを 見る ▼</button><div id="kdcards"></div>`:''}
    <div class="mdnav"><button id="kddb">← 練習に もどる</button></div>`;
  sec.appendChild(o);
  const bind=el=>el.querySelectorAll('[data-say]').forEach(b=>b.onclick=e=>{e.stopPropagation();snd('pop');talk(b.dataset.say)});bind(o);
  const back=()=>{snd('back');hush();o.remove()};$('kddx').onclick=back;$('kddb').onclick=back;
  const cb=$('kdcard');if(cb)cb.onclick=()=>{snd('book');cb.remove();const box=$('kdcards');
    box.innerHTML=c.cards.map(x=>`<div class="mdcard">${minaBox(x.x||'smile',x.say)}${x.f?`<div class="mdfig">${x.f}</div>`:''}${x.ex?`<div class="mdens">${x.ex.map(e=>`<button class="mden" data-say="${esc(e[0])}"><span>🔊 ${esc(e[0])}</span><small>${esc(e[1])}</small></button>`).join('')}</div>`:''}</div>`).join('');bind(box)}}
/* 🤔 教えて（game/practice.js の PRAC.teach を つかう: 正しい 答え → 見る ところ → なぜ → ほかの 答えは なぜ ちがう → 英語のしくみの その 時間） */
const strip=h=>String(h||'').replace(/<[^>]+>/g,'');
function teach(q){if(!window.PRAC)return detail(q.k,q);const d=DET[q.k]||{},U=window.SHIKUMI;
  const t=q.tq||{s:q.s,p:q.s?'':(q.p||'正しい 文は？'),ja:q.s?q.ja:'',o:q.o.slice(),h:q.why,e:strip(d.b)||q.why,w:{},c:d.ch};t.k=q.k;
  if(!q.tq){if(!q.s&&q.k!=='which')t.p=q.ja+(q.p?' '+q.p:'');if(q.k==='which')t.p=q.ja+' '+q.p;t.w[q.o[1]]=q.mis||(d.ng&&d.ng.length?'よくある まちがい。 ':'')+q.why;
    if(q.qen){t.p=q.qen+'（'+q.ja+'） '+q.p;t.ja=''}if(q.hint||HINT[q.k])t.h=(q.hint||HINT[q.k])+(q.why?'　→ '+q.why:'')}
  PRAC.teach(t,U&&U.D?U:null,t.c)}
/* ホームに もどった ときの ミナ先生の ひとこと（game/mina-react.js）。 まだ 聞いて なければ 「なんで？」の おしゃべりへ（☕ その 話を もっと） */
window.MINA_REACT_EXT=window.MINA_REACT_EXT||{};
MINA_REACT_EXT.skdrill={act:e=>e.n?[e.c==='動詞チェック'?'r_kd_vc':e.c==='はい・いいえ'?'r_kd_yn':whyNew()?'r_kd_why':'r_kd',{n:e.n|0,ok:e.ok|0},null]:null,desc:e=>`特別練習${e.c?'（'+e.c+'）':''}を した`};
window.SKDRILL={open,close,detail,teach,rec:()=>R,make,T,KN,DET,CATS};

/* ================================================================ ミナ先生の セリフ */
Object.assign(MINA_LINES,{
 kd_first:[['happy','特別練習へ ようこそ！ 考えなくても 口から 出るように、 {n}問 連発で いくよ。 まちがえても すぐ また 出すから 大丈夫'],['proud','わかるのと、 とっさに 出るのは べつの 力。 きょうは その 「とっさ」を きたえよう']],
 kd_start:[['smile','{n}問 連発！ ゆっくり 考えず、 ぱっと えらんでね'],['happy','きょうも 手伝い役の 練習、 いこう！ 「前の ことばで 後ろが きまる」だよ'],['think','do？ be？ 原形？ ぱっと 見て えらべるかな']],
 kd_det:[['smile','「{t}」の しくみ、 じっくり 見ていこう'],['happy','なんで？って 思えるの、 いいことだよ。 わけが わかると わすれないからね'],['think','ここが わかると、 にた 問題が ぜんぶ 解けるように なるよ']],
 x_kdMw:[['think','動詞か 様子か、 まよったら very を つけてみて。 very sick は 言える、 very eat は 言えない。 言えたら be が いるよ'],['smile','「〜に なる」の 「なる」は be の しごと。 will be sick、 覚えてる？']],
 kd_streak:[['wow','{n}問 れんぞく！ もう 体が 覚えてきたね'],['proud','{n}れんぞく！ その 調子']],
 kd_perfect:[['wow','{n}問で {ok}問 正解！ もう とっさに 出てるね。 これは 自分の ものだよ'],['love','ほとんど 1回で 正解… すごいよ。 はやいのも {f}問 あったね']],
 kd_good:[['proud','{n}問で {ok}問 正解！ まちがえた 型を あと 何回か やれば 完ぺき'],['happy','いい テンポだったよ。 まちがえた ところは 下に 出してあるね']],
 kd_more:[['smile','{n}問で {ok}問 正解。 大丈夫、 連発は くりかえすほど 速く なるの'],['love','まちがえた 型は 次も 多めに 出すね。 何回か やると すっと 出るように なるよ']],
 kd_quit:[['smile','{n}問 やったね。 ちょっとずつでも 毎日 やると とっさに 出るように なるよ'],['happy','ここまで {ok}問 正解！ また 続きを やろう']],
 kd_quit0:[['smile','また やりたく なったら いつでも 来てね']],
 x_kdTry:[['happy','💪特別授業の 横に ⚡特別練習を 作ったよ。 do や be を 連発で とっさに 出す 練習！'],['think','わかってるのに とっさに 出ない ときは、 ⚡特別練習で 連発しよう']],
 x_kdWhy:[['think','特別練習を してて、 「なんで he の ときだけ s なの？」って 思わなかった？ じつは あれ、 1000年 前の なごり なんだよ'],['smile','動詞が かならず いる わけ、 he の s の わけ… 英語の 「なんで？」の 話、 ゆっくり しない？']],
 r_kd_why:[['smile','特別練習、 {ok}問 正解！ …ねえ、 やってて 「なんで こんなに きっちり 決まってるの？」って 思わなかった？'],['think','{n}問 連発 おつかれさま。 he の s とか、 なんで あるんだろうね。 じつは わけが あるんだよ']],
 r_kd:[['proud','特別練習、 {n}問で {ok}問 正解！ とっさに 出る 力、 ついてきたね'],['happy','⚡ 特別練習 おつかれさま。 He plays… もう 耳が なれてきたでしょ？'],['smile','連発 {n}問！ 「なんか へん」って 感じられたら、 それが 身についた しるしだよ']],
 kd_first0:[['happy','特別練習へ ようこそ！ 考えなくても 口から 出るように 連発する 部屋だよ。 まずは ⚡ぜんぶ か、 🚦動詞チェックが おすすめ'],['proud','わかるのと、 とっさに 出るのは べつの 力。 やりたい 練習を えらんでね']],
 kd_menu:[['smile','きょうは どの 練習に する？ まよったら ⚡ぜんぶ でも いいよ'],['happy','練習の 部屋だよ。 にがてな ところだけ えらんで 連発も できるの'],['think','ぜんぶ やる？ それとも 1つに しぼる？ しぼると 早く 身につくよ']],
 kd_menuVc:[['happy','🚦 動詞チェックを 作ったよ！ 見るのは 「主語の すぐ後ろ」 だけ。 そこが とくべつな 動詞か ふつうの 動詞か、 ぱっと 見分ける 練習'],['love','英語って 動詞の 種類を いつも 気に しないと いけなくて つかれるよね。 だから 見る ところを 1つに しぼった 🚦 動詞チェック、 やってみて']],
 kd_menuRec:[['think','「{t}」で ちょっと まちがいが 多いみたい。 しぼって 連発すると すっと 出るように なるよ'],['smile','きょうの おすすめは 「{t}」。 もちろん ほかのでも いいよ']],
 kd_c_vc1:[['happy','日本語は 動詞の 種類を 気に しないから、 英語で つかれるのは あたりまえ。 だから 見る ところは 1つ。 <b>主語の すぐ後ろ</b> だけ！'],['think','主語が My big brother みたいに 長くても、 「2番目の ことば」じゃ なくて 主語の かたまりの すぐ後ろ を 見てね']],
 kd_c_vc:[['smile','主語の すぐ後ろ、 とくべつ？ ふつう？ {n}問 いくよ'],['happy','とくべつなら 自分で 前へ、 ふつうなら do。 1つの チェックで ぜんぶ きまるよ']],
 kd_c_do1:[['happy','do の 出番 だけを 連発！ ふつうの 動詞の 質問と not は ぜんぶ do / does / did が 運ぶよ'],['think','do が 出たら 後ろは 原形。 -s も 過去も do が もっていくの']],
 kd_c_do:[['smile','do の 出番、 {n}問！ 「ふつうの 動詞 → do」だよ'],['proud','do・does・did、 ぱっと 出るかな？']],
 kd_c_be1:[['happy','be の 文 だけ 連発するよ。 be の 文は 自分で 前に 出て、 not も すぐ後ろ。 do は 来ない'],['think','hungry や playing みたいな 様子の ことばには be。 be が いれば do は いらないよ']],
 kd_c_be:[['smile','be の 文、 {n}問！ Are you〜? ・ isn\'t ・ -ing'],['happy','be が 前に 出るだけ。 シンプルに いこう']],
 kd_c_yv1:[['think','sick は 様子、 sleep は 動詞。 にてるけど be が いるか いらないか が かわるの。 very を つけて 言えたら 様子だよ'],['happy','様子か 動詞か の 見分け だけ 連発！ ここが わかると be の まちがいが へるよ']],
 kd_c_yv:[['smile','様子？ 動詞？ {n}問。 まよったら very を つけてみてね'],['think','be が いる？ いらない？ ぱっと 決めよう']],
 kd_c_form1:[['happy','動詞の 形 だけ 連発！ he の -s、 過去形、 will・can の あとの 原形'],['think','前の ことばが 後ろの 形を きめる。 それを 体で 覚えよう']],
 kd_c_form:[['smile','動詞の 形、 {n}問 いくよ'],['proud','-s？ 原形？ 過去形？ ぱっと えらんでね']],
 kd_vcGood:[['wow','{n}問で {ok}問！ 主語の すぐ後ろ、 もう ちゃんと 見えてるね'],['love','とくべつと ふつう、 ほとんど まよわなかったね。 これで do の 出番が 自然に わかるよ']],
 kd_vcMore:[['smile','{n}問で {ok}問。 has が 2つの 顔を もってたり、 ちょっと ずるい 問題も あったよね。 何回か やると 目が なれるよ'],['love','まよったら 「この ことば、 自分で 前に 出られる？」って 聞いてみて。 出られたら とくべつ']],
 r_kd_vc:[['proud','動詞チェック、 {n}問で {ok}問 正解！ 主語の すぐ後ろを 見る くせ、 ついてきたね'],['happy','🚦 動詞チェック おつかれさま。 とくべつか ふつうか、 1つ 見るだけで 楽に なったでしょ？']],
 x_kdVc:[['happy','⚡特別練習に 🚦動詞チェックが 入ったよ。 主語の すぐ後ろ だけ 見る 練習。 疲れにくく なるよ'],['think','英語で つかれる ときは、 主語の すぐ後ろ だけ 見て。 🚦動詞チェックで 練習できるよ']],
 kd_menuJp:[['happy','「日本語と ちがう ところ」を 7つ 入れたよ。 いちばん まよう 🙆はい・いいえ から いこう！'],['love','英語が つかれるのは、 日本語で 気に しない ことを 毎回 きめるから。 1つずつ 「ここだけ 見る」で 練習しよう']],
 te_open0:[['love','聞いてくれて うれしい！ どこで まよったか、 いっしょに 見よう'],['smile','いい 質問。 ゆっくり 説明するね']],
 kd_think:[['think','まよってる？ 見る ところは ここ だけ'],['smile','ゆっくりで いいよ。 ヒント'],['think','ちょっと ひとこと']],
 kd_c_yn1:[['love','はい・いいえは、 日本人が いちばん まちがえる ところ。 でも コツは 1つだけ。 <b>質問は 見ないで、 自分の 答えが 「する」なら Yes、 「しない」なら No</b>'],['happy','日本語の 「はい」は 「あなたの 言う とおり」、 英語の Yes は 「する・そう」。 ここが ちがうだけ なんだよ']],
 kd_c_yn:[['smile','質問は 見ない、 答えの 中身 だけ。 {n}問 いくよ'],['happy','Yes の 後ろは 肯定、 No の 後ろは 否定。 ぱっと えらんでね']],
 kd_c_art1:[['think','a と the は 日本語に ない 区別だから、 まようのは ふつう。 「はじめて？ もう わかってる？」の 2つ だけ 見よう'],['smile','月や 太陽は 1つしか ないから the。 そういう 「わかってる」を 見つけてね']],
 kd_c_art:[['smile','a？ the？ なし？ {n}問 いくよ'],['happy','はじめてなら a、 わかってるなら the']],
 kd_c_num1:[['happy','日本語は 「犬」で 1ぴきでも 3びきでも いいけど、 英語は 毎回 数を きめるの。 2つ いじょうなら -s！'],['think','children や men みたいに 形が かわる ことばも ちょっと まぜたよ']],
 kd_c_num:[['smile','1つ？ 2つ いじょう？ {n}問！'],['happy','a は 1つの しるし、 -s は 2つ いじょうの しるし']],
 kd_c_subj1:[['think','「寒いね」「行くよ」… 日本語は 主語なしで 通じるよね。 英語は 主語の 席が かならず いるの。 だれも いない ときは it'],['happy','It\'s raining の it は 「それ」じゃなくて 席を うめる だけ なんだよ']],
 kd_c_subj:[['smile','主語を わすれずに、 {n}問！'],['happy','だれが？ 何が？ なければ it']],
 kd_c_s3x1:[['think','He plays の -s、 主語が 長いと まようよね。 そんな ときは he・she・it・they に おきかえて みて'],['happy','everyone は 「みんな」でも he と 同じ。 ここ、 ひっかけだよ']],
 kd_c_s3x:[['smile','3人称の s、 {n}問！ 主語を おきかえてね'],['happy','he・she・it なら -s']],
 kd_c_now1:[['think','日本語の 「〜している」は、 今 している 最中にも、 いつもの ことにも つかうよね。 英語は そこを わけるの'],['happy','「父は 銀行で はたらいている」は いつもの こと だから works。 ここが ひっかけ']],
 kd_c_now:[['smile','今？ いつも？ {n}問！'],['happy','now・Look! なら -ing、 every day なら そのまま']],
 kd_c_order1:[['think','日本語は 動詞が さいご、 英語は 2番目くらいに 来る。 「だれが → どうする」を 先に 言っちゃうのが コツ'],['happy','くわしい ことは あとから 足して いけば いいの。 英語って 「結論が 先」なんだよ']],
 kd_c_order:[['smile','ことばの 順番、 {n}問！'],['happy','だれが → どうする → くわしく']],
 kd_ynGood:[['wow','{n}問で {ok}問！ 質問に まどわされなく なったね。 これ、 大人でも まちがえるんだよ'],['love','Yes と No、 もう 迷わないね。 答えの 中身 だけ 見る くせ、 ついてるよ']],
 kd_ynMore:[['smile','{n}問で {ok}問。 日本語の 「はい」に 何回か つられちゃったね。 でも それが ふつう。 何回か やると 体が なれるよ'],['love','まよったら、 質問を 手で かくして 「自分は する？ しない？」だけ 考えてみて'],['think','Yes を 「はい」、 No を 「いいえ」と 訳すと つられちゃうの。 Yes は 「I do が 来るよ」、 No は 「I don\'t が 来るよ」の ふだ だと 思ってみて']],
 r_kd_yn:[['proud','はい・いいえの 練習、 {n}問で {ok}問 正解！ Don\'t you〜? も こわくないね'],['happy','🙆 はい・いいえ おつかれさま。 質問は 見ない、 答えの 中身 だけ、 だよ'],['smile','Yes・No の 日本語訳は 気に しない。 I do か I don\'t を 決めたら、 ふだは 自動で つくからね']],
 x_kdYn:[['love','日本語の 「はい・いいえ」と 英語の Yes・No、 じつは 決め方が ちがうの。 ⚡特別練習の 🙆はい・いいえ で ためしてみて'],['think','Don\'t you like cats? って 聞かれたら、 好きなら Yes？ No？ ⚡特別練習で 練習できるよ']],
 x_kdAgain:[['smile','⚡特別練習、 きのうより 速く なってるかも。 ためしてみる？'],['proud','この前の 特別練習、 {ok}問 正解だったね。 また 連発しよう']],
});
try{const RL=MINA_SENSE._rules,go=()=>['⚡ 特別練習',()=>open()];
  RL.push(['x_kdTry',3,()=>!R.n&&window.SHIKUMI&&SHIKUMI.doneN()>0?{}:null,go]);
  RL.push(['x_kdMw',3,()=>(R.miss.which||0)+(R.miss.willX||0)+(R.miss.willBe||0)>0?{}:null,go]);
  RL.push(['x_kdWhy',3,()=>R.tot&&whyNew()?{}:null,()=>['☕ なんで？の はなし',()=>MCHAT.open('why',()=>MINA.open())]]);
  RL.push(['x_kdVc',3,()=>R.n&&!(R.cat&&R.cat.vc&&R.cat.vc.n)?{}:null,()=>['🚦 動詞チェック',()=>open('vc')]]);
  RL.push(['x_kdYn',3,()=>R.n&&!(R.cat&&R.cat.yn&&R.cat.yn.n)?{}:null,()=>['🙆 はい・いいえ',()=>open('yn')]]);
  RL.push(['x_kdAgain',2,()=>R.n&&R.t&&Date.now()-R.t>864e5?{ok:R.best||0}:null,go]);
}catch(e){}
})();
