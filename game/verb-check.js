/* 🚦 動詞チェック（⚡特別練習の カテゴリー。 game/shikumi-drill.js が T・KN・DET に まぜて つかう）
   11/22 ユーザー「動詞だけ do とか 使うから 動詞は 特別？」→「日本語では 助動詞・動詞・その他を 意識しないから 英語では 疲れる」
   → 見る ところを 1つに しぼる: 「主語の すぐ後ろ」が
      とくべつな 動詞（be・can・will・should・have＋過去分詞）→ 自分で 前に 出る・not も すぐ後ろ
      ふつうの 動詞（play・like・go・have＝もつ…）→ do / does / did の 出番、 動詞は 原形
   主語が 2語 いじょう（My big brother・The girl in the red hat）でも 「主語の すぐ後ろ」（2番目の ことば では ない）。
   型: vcKind（とくべつ？ ふつう？）・ vcQ（質問に すると？）・ vcNeg（not を 入れると？）。 1問 = shikumi-drill と 同じ 形 ＋ sj（主語）・ w（すぐ後ろの ことば）・ tq（🤔教えて 用） */
(()=>{
const pick=a=>a[Math.random()*a.length|0];
/* 主語: [英語, 人] 1=I 2=you 3=he・she p=we・they */
const SJ=[['I','1'],['You','2'],['He','3'],['She','3'],['We','p'],['They','p'],['Ken','3'],['My big brother','3'],['The girl in the red hat','3'],['Tom and Amy','p'],['My friends','p'],['Our teacher','3'],['My little sister','3'],['The boys on the beach','p'],['Mina','3']];
const is3=s=>s[1]==='3';
const low=s=>/^(He|She|We|They|You|My|Our|The)\b/.test(s[0])?s[0][0].toLowerCase()+s[0].slice(1):s[0];
const cap=w=>w[0].toUpperCase()+w.slice(1);
const beNow=s=>s[1]==='1'?'am':is3(s)?'is':'are',bePast=s=>s[1]==='1'||is3(s)?'was':'were';
const doOf=(s,past)=>past?'did':is3(s)?'does':'do';
const nt=w=>({am:'am not',will:"won't",can:"can't"})[w]||w+"n't";
/* とくべつな 動詞 */
const SP=[
 s=>({k:'be',aux:beNow(s),r:pick(['hungry','busy','tired','happy','at home','sleepy'])}),
 s=>({k:'ing',aux:beNow(s),r:pick(['playing soccer now','cooking dinner now','swimming in the sea now','reading a book now'])}),
 s=>({k:'be',aux:bePast(s),r:pick(['tired yesterday','at home last night','busy last week','sick yesterday']),past:1}),
 s=>({k:'mod',aux:'can',r:pick(['swim','play the piano','cook curry','speak English','ride a bike'])}),
 s=>({k:'mod',aux:'will',r:pick(['come tomorrow','be late','go to the beach tomorrow','help us'])}),
 s=>({k:'mod',aux:'should',r:pick(['go home now','eat more vegetables','sleep early'])}),
 s=>{const v=pick([['finished','finish','the homework'],['been','be','to Kyoto'],['eaten','eat','lunch'],['seen','see','this movie'],['lost','lose','the key']]);return {k:'perf',aux:is3(s)?'has':'have',r:v[0]+' '+v[2],pp:v[0],base:v[1],o:v[2]}},
];
/* ふつうの 動詞: [原形, 3単現, 過去, うしろ] */
const OR=[['like','likes',null,'dogs'],['play','plays','played','tennis'],['live','lives','lived','near the sea'],['have','has','had','a dog'],['watch','watches','watched','TV'],['go','goes','went','to school'],['speak','speaks',null,'English'],['want','wants','wanted','to swim'],['eat','eats','ate','lunch'],['make','makes','made','a cake'],['see','sees','saw','a movie']];

/* 1つの 文を 作って、 質問・否定・まちがいの 形を ぜんぶ 用意する */
function gen(noI){const s=pick(SJ.filter(x=>!noI||x[0]!=='I')),S=s[0],L=low(s);
  if(Math.random()<.5){const p=pick(SP)(s),A=p.aux,past=!!p.past,D=doOf(s,past);
    const o={sp:1,s,S,w:A,k:p.k,stmt:`${S} ${A} ${p.r}.`,Q:`${cap(A)} ${L} ${p.r}?`,N:`${S} ${nt(A)} ${p.r}.`,D};
    if(p.k==='be'||p.k==='ing'){o.bQ=`${cap(D)} ${L} ${p.r}?`;o.bN=`${S} ${nt(D)} ${p.r}.`;
      o.wQ=o.wN=`${p.k==='ing'?'-ing の 文も ':''}be の 文。 be を 消して ${D} に すると 動詞の 席が 空っぽ。 ${A} を そのまま 前に 出す ／ うしろに not`}
    else if(p.k==='perf'){o.bQ=`${cap(D)} ${L} have ${p.pp} ${p.o}?`;o.bN=`${S} ${nt(D)} have ${p.pp} ${p.o}.`;
      o.wQ=o.wN=`${A} ＋ 過去分詞（〜した ところ・〜したことが ある）の ${A} は とくべつ。 ${D} は いらない`}
    else{o.bQ=`${cap(D)} ${L} ${A} ${p.r}?`;o.bN=`${S} ${nt(D)} ${A} ${p.r}.`;
      o.wQ=o.wN=`${A} が もう お手伝いを している。 ${D} を 足すと お手伝いが 2人に なって ✕`}
    o.note=p.k==='perf'?`${A} ＋ 過去分詞 → この ${A} は とくべつ`:p.k==='ing'?`${A} ＋ -ing → ${A} が とくべつ`:'';
    return o}
  const v=pick(OR),past=!!v[2]&&Math.random()<.4,D=doOf(s,past),form=past?v[2]:is3(s)?v[1]:v[0],B=past?bePast(s):beNow(s);
  const o={sp:0,s,S,w:form,k:'or',stmt:`${S} ${form} ${v[3]}.`,Q:`${cap(D)} ${L} ${v[0]} ${v[3]}?`,N:`${S} ${nt(D)} ${v[0]} ${v[3]}.`,D,base:v[0]};
  const front=v[0]!=='have'&&Math.random()<.5;
  o.bQ=front?`${cap(form)} ${L} ${v[3]}?`:`${cap(B)} ${L} ${v[0]} ${v[3]}?`;
  o.wQ=front?`ふつうの 動詞は 自分で 前に 出られない。 ${cap(D)} に まかせる`:`${v[0]} が 動詞なのに be を 足すと 動詞が 2つ。 ${cap(D)} を つかう`;
  const neg2=v[0]!=='have'&&Math.random()<.5;
  o.bN=neg2?`${S} ${form} not ${v[3]}.`:`${S} ${nt(B)} ${v[0]} ${v[3]}.`;
  o.wN=neg2?`ふつうの 動詞の うしろに not は つけられない。 ${nt(D)} ＋ 原形`:`${v[0]} が 動詞なのに be を 足すと 動詞が 2つ。 ${nt(D)} ＋ 原形`;
  o.note=v[0]==='have'?`この ${form} は 「かっている・もっている」の ふつうの 動詞（has ＋ 過去分詞 とは べつ）`:past?`${form} は ${v[0]} の 過去形 → did が 過去を もっていく`:'';
  return o}

const SPN='とくべつ（be動詞・助動詞）',ORN='ふつう（一般動詞）';
const look=o=>`主語「${o.S}」の すぐ後ろ → 「${o.w}」${o.S.includes(' ')?`（主語が ${o.S.split(' ').length}語 でも、 見るのは 主語の すぐ後ろ）`:''}`;
const expl=o=>o.sp?`「${o.w}」は とくべつな 動詞（${o.k==='be'||o.k==='ing'?'be動詞':'助動詞'}）。 自分で 前に 出て 質問（${o.Q}）、 not も すぐ後ろ（${o.N}）。 do の 出番は ないよ${o.note?'。 '+o.note:''}`
  :`「${o.w}」は ふつうの 動詞（一般動詞）。 自分では 前に 出られないので、 ${o.D} が かわりに 出る（${o.Q} ／ ${o.N}）。 ${o.D} が ${o.D==='did'?'過去の しるし':o.D==='does'?'-s':'時制'}を もっていくので、 動詞は 原形 ${o.base}${o.note?'。 '+o.note:''}`;
const tq=(o,ok,bad,why,p)=>({p,o:[ok,bad],h:look(o),e:expl(o),w:{[bad]:why},c:o.sp?10:5});
const base=o=>({ja:o.stmt,sj:o.S,ft:5,ch:o.sp?10:5});
const T={
 vcKind:()=>{const o=gen(),ok=o.sp?SPN:ORN,bad=o.sp?ORN:SPN,p=`主語の すぐ後ろの 「${o.w}」は？`;
   return Object.assign(base(o),{p,w:o.w,ft:4,o:[ok,bad],why:o.sp?`${o.w} は とくべつ → 自分で 前へ（${o.Q}）`:`${o.w} は ふつう → ${o.D} の 出番（${o.Q}）`,
     tq:tq(o,ok,bad,o.sp?`ふつうの 動詞なら ${o.D} が 出るはず。 でも ${o.Q} と 自分で 前に 出られるから とくべつ`:`とくべつなら ${cap(o.w)} ${low(o.s)}…? と 前に 出られるはず。 でも 出られないから ${o.D} の 出番`,p)})},
 vcQ:()=>{const o=gen(1),p='質問の 文に すると？';
   return Object.assign(base(o),{p,o:[o.Q,o.bQ],why:o.sp?`${o.w} は とくべつ → そのまま 前へ`:`${o.w} は ふつう → ${cap(o.D)} ＋ 原形`,tq:tq(o,o.Q,o.bQ,o.wQ,p)})},
 vcNeg:()=>{const o=gen(),p='not を 入れると？';
   return Object.assign(base(o),{p,o:[o.N,o.bN],why:o.sp?`${o.w} は とくべつ → すぐ後ろに not`:`${o.w} は ふつう → ${nt(o.D)} ＋ 原形`,tq:tq(o,o.N,o.bN,o.wN,p)})},
};
const KN={vcKind:'とくべつ？ ふつう？',vcQ:'動詞チェック: 質問',vcNeg:'動詞チェック: not'};
const D0={ch:10,b:'見るのは <b>主語の すぐ後ろ</b> だけ。 そこが <b>とくべつな 動詞＝ be動詞＋助動詞</b>（am・is・are・was・were・can・will・should・have＋過去分詞）なら、 自分で 前に 出て 質問に なり、 not も すぐ後ろに つく。 <b>ふつうの 動詞＝ 一般動詞</b>（play・like・go…）は 自分で 動けないので、 <b>do / does / did</b> が かわりに 前に 出て、 動詞は 原形に もどるよ',
  ok:['Ken can swim. → Can Ken swim?','Ken swims. → Does Ken swim?','My big brother is busy. → Is my big brother busy?'],ng:['Does Ken can swim?','Swims Ken?','Is my big brother like dogs?'],
  tip:'主語が 長くても（The girl in the red hat）、 主語の かたまりの すぐ後ろを 見る。 be動詞は 助動詞じゃ ないけど、 動き方が 同じ だから 同じ チーム'};
const DET={vcKind:Object.assign({t:'主語の すぐ後ろが とくべつ？ ふつう？'},D0),
 vcQ:Object.assign({t:'質問: とくべつなら 前へ、 ふつうなら do'},D0),
 vcNeg:Object.assign({t:'not: とくべつなら すぐ後ろ、 ふつうなら don\'t'},D0,{ok:["Ken can't swim.","Ken doesn't swim.","Tom and Amy weren't at home."],ng:["Ken doesn't can swim.",'Ken swims not.',"Ken isn't like dogs."]})};
DET.vcKind.ng=['He has a dog. → Has he a dog?（✕ この has は ふつう）','He has finished. → Does he have finished?（✕ この has は とくべつ）'];
DET.vcKind.ok=['He has a dog. → Does he have a dog?','He has finished it. → Has he finished it?','My big brother is busy. → Is my big brother busy?'];
window.SKVC={T,KN,DET,gen};
})();
