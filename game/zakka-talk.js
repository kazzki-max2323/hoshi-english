/* ながれぎ雑貨店（game/zakka.js）の 会話。店主の ノラさん（👩‍🦳）と オウムの ピップ（🦜）。
   答えで 話が 分かれる「ながい 会話」の 形。どの 答えでも 話は すすみ、エンドが いくつも ある。
   ZAKKA_TALK(Z) が 場面を かえす。Z は game/zakka.js が わたす 道具（品物・コイン・もちもの など）。
   - ノード: {s:ノラの 英語, j:日本語, o:[答え…], pip:ピップの ひとこと}  s / j / o は c（いまの 会話の ようす）を うけとる 関数でも いい
   - 行き先だけの ノード: {go:c=>'つぎの ノード'}
   - 答え: O(英語, フレーズid, ノラの 返事(英), 返事(日), つぎ, {j:日本語, ok:0=おもしろい まちがい, act:c=>{…}, if:c=>出す？, pip:ピップ, fx:絵文字})
     つぎを '@buy:price' のように 書くと、べつの 場面の その ノードへ うつる
   - エンド: E(1=★/0=おもしろ, 名前, 英語, 日本語, 絵文字, 'buy'など 売り買いの しごと) */
const ZAKKA_TALK=Z=>{
const PH=ZAKKA_PHRASES;
const O=(e,ph,r,rj,nx,x={})=>Object.assign({e,ph,r,rj,nx,j:x.j||(ph&&PH[ph]?PH[ph][1]:''),ok:x.ok===0?0:1},x);
const E=(good,t,s,j,fx,act)=>({end:1,good,t,s,j,fx,act});
const P=c=>Z.price(c);
const W=c=>c.it.w,TH=c=>c.it.title?`"${c.it.title}"`:'this '+c.it.w;
const pickBy=(c,a)=>a[c.seed%a.length];
/* 売る もの（一覧から えらんだ もの）の 言い方 */
const SW=c=>c.pk==='bot'?'some empty bottles':c.pk==='g'?(c.it.kind==='music'?`my record, "${c.it.en}"`:`my ${c.it.en}`):c.it.title?'this book':`this ${c.it.w}`;
const SY=c=>c.pk==='bot'?'a bag of empty bottles':c.pk==='g'?(c.it.kind==='music'?`your record, "${c.it.en}"`:`your ${c.it.en}`):c.it.title?`your book, "${c.it.title}"`:`your ${c.it.w}`;
const SJ=c=>c.pk==='bot'?'からの びん':c.it.n;
const list=a=>a.length<3?a.join(' and '):a.slice(0,-1).join(', ')+', and '+a[a.length-1];
const listJ=a=>a.join('・');
const TO={mina:["my teacher, Mina","ミナ先生"],gen:["Gen. He's a fisherman","つりびとの ゲンじい"],pochi:["Pochi. He's a dog","犬の ポチ"],sora:["Sora. She's my little friend","小さな 友だちの ソラ"],
 riku:["Riku. I teach him English","英語を 教えている リク"],baba:["Tome. She's Gen's wife","ゲンじいの おくさんの トメばあ"],hana:["Hana. She runs the shaved ice stand","かき氷屋の ハナさん"]};
const bigger=c=>{const S=c.it.sizes.map(s=>s[0]),i=S.indexOf(c.size);return S[Math.min(S.length-1,i+1)]};
const sizeJ=(c,en)=>(c.it.sizes.find(s=>s[0]===en)||['',en])[1];
const colJ=(c,en)=>(c.it.colors.find(s=>s[0]===en)||['',en])[1];
const how=c=>Math.max(1,Math.round(c.it.p*.75));
/* お会計の 組み立て（毎回 かわる）: はらう 前に 0〜1こ、 はらった あとに 0〜2こ。 ぜんぶで 0〜2こ。 同じ 形・同じ 聞き方は つづけて 出ない */
const tip=t=>c=>{(c.tips=c.tips||[]).push(t)};
const shuf=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.random()*(i+1)|0;[a[i],a[j]]=[a[j],a[i]]}return a};
const CK_PRE={else:['else1','else2','else3'],pts:['pts1','pts2']},CK_POST={rcpt:['rcptq','rcpt2','rcpt3'],bag:['bagq','bag2','bag3'],tag:['tag1']};
const plan=c=>{const can=[...Object.keys(CK_PRE),...Object.keys(CK_POST).filter(k=>k!=='tag'||c.it.k==='gift')];let ks=[];
  for(let t=0;t<8;t++){const r=Math.random(),n=r<.3?0:r<.75?1:2;ks=shuf(can).slice(0,n);
    if(ks.filter(k=>CK_PRE[k]).length>1){ks=ks.slice(0,1);continue}if(Z.sameShape('buy',ks))continue;break}
  if(!ks.includes('rcpt'))c.rcpt=1;   // 聞かれない ときは ノラさんが ふつうに レシートを わたす（返品が できる）
  return [...ks.filter(k=>CK_PRE[k]).map(k=>Z.pickV(k,CK_PRE[k])),Z.pickV('pay',['pay','payB','payC','payD','payE','payF']),...ks.filter(k=>CK_POST[k]).map(k=>Z.pickV(k,CK_POST[k]))]};

return {
/* ======================================================= はじめて 来た とき */
hello:{t:'はじめての ごあいさつ',start:'a',nodes:{
 a:{s:"Oh! A customer! Welcome to Driftwood Goods. I'm Nora.",j:"あら！ お客さん！ ながれぎ雑貨店へ ようこそ。 わたしは ノラよ。",o:[
  O("Nice to meet you, Nora.",'niceMeet',"Nice to meet you, too!","こちらこそ よろしくね！",'b'),
  O("Hi! What is this place?",null,"It's a little shop. Everything here came from far away.","小さな お店よ。 ここの ものは みんな 遠くから 来たの。",'b',{j:"こんにちは！ ここは 何の 場所？"}),
  O("Are you a pirate?",null,"A pirate? Ha ha! I sailed the seas, but I never stole anything.","海賊？ あはは！ 海は 旅したけど、 なにも ぬすんで ないわよ。",'b',{ok:0,j:"海賊 ですか？",fx:'🏴‍☠️'})]},
 b:{s:"And this is Pip. He likes to repeat words.",j:"そして こっちが ピップ。 ことばを まねするのが 好きなの。",pip:"Hello! Hello!",o:[
  O("Hello, Pip!",null,"He likes you!","あなたの こと 気に入ったみたい！",'c',{j:"こんにちは、 ピップ！",pip:"Pip! Pip!"}),
  O("Can he say my name?",null,"Maybe someday. Say it to him often!","いつかね。 何度も 言って あげて！",'c',{j:"ぼくの 名前も 言える？"}),
  O("Is Pip for sale?",null,"Never! Pip is my family.","とんでもない！ ピップは 家族よ。",'c',{ok:0,j:"ピップは 売りもの？",pip:"Family! Family!",fx:'😤'})]},
 c:{s:"In this shop, we talk in English. You can buy, sell, and even return things. Just talk to me!",j:"この お店では 英語で 話すの。 買うのも 売るのも、 返品も できるわ。 なんでも 話しかけてね！",o:[
  O("Sounds fun!",null,"It is! Take a look around.","でしょ！ ゆっくり 見ていって。",'eHello',{j:"たのしそう！"}),
  O("I'm a little nervous.",null,"Don't worry. Mistakes are fine here. Pip makes mistakes all the time.","だいじょうぶ。 ここでは まちがえても いいの。 ピップなんて しょっちゅう まちがえるわ。",'eHello',{j:"ちょっと きんちょう します。",pip:"Mistake! Mistake!"})]},
 eHello:E(1,'ノラさんと ピップに 会えた',"Come and talk anytime. The shelf changes your English, little by little!","いつでも 話しに 来てね。 たなの ものが あなたの 英語を 少しずつ かえていくわ！",'👋'),
}},

/* ======================================================= 品物を 買う（たなの 品物を タップ） */
buy:{t:'買いもの',start:'a',nodes:{
 a:{s:c=>Z.held()===c.it.id?`Oh, you came back! I put this ${W(c)} aside for you.`:pickBy(c,["Hi there! Can I help you?","Welcome back! Can I help you with anything?",`Good ${Z.part()}! Are you looking for something?`]),
   j:c=>Z.held()===c.it.id?`あら、 来てくれたのね！ この ${c.it.n}、 とっておいたわよ。`:pickBy(c,["いらっしゃい！ なにか おさがし？","また 来てくれたのね！ なにか お手つだい できる？",`${Z.partJ()}！ なにか さがしてるの？`]),o:[
  O(c=>`Yes. How much is this ${W(c)}?`,'howMuch',null,null,'price'),
  O(c=>`Can you tell me about this ${W(c)}?`,'tellMe',c=>c.it.a[0],c=>c.it.a[1],'about'),
  O("I'm just looking, thanks.",'justLook',"Sure! Take your time.","どうぞ！ ゆっくり 見てね。",'look',{if:c=>Z.held()!==c.it.id}),
  O("Can I eat this?",null,c=>c.it.food?"Sure, but please buy it first! Ha ha.":`Eat it?! It's a ${W(c)}, not a sandwich!`,c=>c.it.food?"いいわよ、 でも 先に 買ってね！ あはは。":`食べる？！ それは ${c.it.n}よ、 サンドイッチじゃ ないわ！`,'a2',{ok:0,j:"これ 食べられますか？",fx:'🥪'})]},
 a2:{s:"So... can I help you with anything?",j:"それで… なにか お手つだい しましょうか？",o:[
  O(c=>`How much is this ${W(c)}?`,'howMuch',null,null,'price'),
  O(c=>`Can you tell me about this ${W(c)}?`,'tellMe',c=>c.it.a[0],c=>c.it.a[1],'about'),
  O("I'm just looking, thanks.",'justLook',"Sure! Take your time.","どうぞ！ ゆっくり 見てね。",'look')]},
 about:{s:"Isn't it nice?",j:"すてきでしょ？",o:[
  O("How much is it?",'howMuch',null,null,'price'),
  O("Is it popular?",'popular',c=>c.it.k==='book'?"Yes! Kids and grown-ups both love it.":"Yes! It's one of our best sellers.",c=>c.it.k==='book'?"ええ！ 子どもにも 大人にも 大人気。":"ええ！ いちばん 売れてる ものの ひとつよ。",'price'),
  O("Is it magic?",null,c=>c.it.k==='book'?"Well... stories ARE a kind of magic.":"Magic? Only if you believe! Ha ha.",c=>c.it.k==='book'?"そうね… お話って 魔法みたいな ものよね。":"魔法？ 信じれば ね！ あはは。",'about2',{ok:0,j:"それって 魔法の 品？",fx:'✨'})]},
 about2:{s:"Anything else you'd like to know?",j:"ほかに 知りたい ことは ある？",o:[
  O("How much is it?",'howMuch',null,null,'price'),
  O("Is it popular?",'popular',"Yes! It's one of our best sellers.","ええ！ いちばん 売れてる ものの ひとつよ。",'price')]},
 look:{s:"Let me know if you need anything.",j:"なにか あったら 声を かけてね。",o:[
  O(c=>`Actually, how much is this ${W(c)}?`,'howMuch',null,null,'price'),
  O("What do you recommend?",'recommend',null,null,'@rec:a2'),
  O("Thank you. Bye!",'thanksBye',"Bye! Come again!","またね！ また 来てね！",'eLook'),
  O("Can I take a nap here?",null,"A nap? This isn't a hotel, dear! Ha ha.","おひるね？ ここは ホテルじゃ ないのよ！ あはは。",'look2',{ok:0,j:"ここで おひるね しても いい？",pip:"Hotel! Hotel!",fx:'😴'})]},
 look2:{s:"Anyway... just call me if you need help.",j:"とにかく… こまったら 呼んでね。",o:[
  O(c=>`OK. How much is this ${W(c)}?`,'howMuch',null,null,'price'),
  O("Thank you. Bye!",'thanksBye',"Bye! Come again!","またね！ また 来てね！",'eLook')]},
 price:{go:c=>c.it.lux&&!c.luxSeen?'lux':c.it.rare&&c.it.r0&&!c.rareSeen?'rare':'price0'},
 /* ✨ めずらしい 品（たまにしか ならばない）: ノラさんが とくべつに 話して くれる */
 rare:{s:c=>`Oh, you found the ${W(c)}! It just came in today. ${c.it.a[0]}`,j:c=>`あら、 ${c.it.n}を 見つけたのね！ きょう 入った ばかりなの。 ${c.it.a[1]}`,enter:c=>{c.rareSeen=1},o:[
  O("Is this the only one?",'onlyOne',c=>`Yes, only one. ${c.it.r0[0]}`,c=>`ええ、 1つだけ。 ${c.it.r0[1]}`,'rare2'),
  O("When will you have more?",'restock',"Hmm... I really don't know. Maybe next month, maybe never.","うーん… ほんとに わからないの。 来月かも しれないし、 もう ないかも。",'rare2'),
  O("Did you steal it from a dragon?",null,"A dragon?! Ha ha! No, dear. I traded with a very nice old man.","ドラゴン？！ あはは！ ちがうわよ。 とても やさしい おじいさんと 交換したの。",'rare2',{ok:0,j:"ドラゴンから ぬすんだの？",pip:"Dragon! Dragon!",fx:'🐉'})]},
 rare2:{s:"Things like this don't stay on the shelf for long. Tomorrow, it might be gone.",j:"こういう ものは たなに 長くは のこらないの。 あしたには もう ないかも。",o:[
  O("I'm lucky I came today. How much is it?",'lucky',null,null,'price0',{j:"きょう 来て よかった。 いくらですか？"}),
  O("How much is it?",'howMuch',null,null,'price0'),
  O("Then I'll come back tomorrow.",null,"Ha ha. Tomorrow, the shelf will be different, you know.","あはは。 あしたは たなが かわってるわよ。",'eThink',{ok:0,j:"じゃあ あした また 来ます。",pip:"Gone! Gone!",fx:'💨'})]},
 price0:{s:c=>`This ${W(c)} is ${P(c)} coins.`+(c.it.colors?` It comes in ${list(c.it.colors.map(x=>x[0]))}.`:''),
   j:c=>`この ${c.it.n}は ${P(c)}まいよ。`+(c.it.colors?` 色は ${listJ(c.it.colors.map(x=>x[1]))}が あるの。`:''),o:[
  O("I'll take it.",'takeIt',"Great choice!","いい えらび方ね！",'pre'),
  O("Do you have it in another color?",'otherColor',null,null,'color',{if:c=>c.it.colors&&!c.color}),
  O("Do you have a bigger one?",'whatSize',"We have a few sizes.","サイズは いくつか あるわよ。",'size',{if:c=>c.it.sizes&&!c.size}),
  O("Is that your best price?",'bestPrice',null,null,'luxBest',{if:c=>c.it.lux&&!c.disc}),
  O("Is it worth it?",'worthIt',c=>c.it.worth[0],c=>c.it.worth[1],'price0',{if:c=>c.it.lux&&!c.worth,act:c=>{c.worth=1}}),
  O("Can I pay in installments?",'installments',"Installments? Sorry, dear. This is a tiny beach shop. Full payment only.","分割？ ごめんね、 ここは 小さな 浜辺の お店なの。 一括ばらいだけよ。",'price0',{if:c=>c.it.lux&&!c.inst,act:c=>{c.inst=1}}),
  O("Can you give me a discount?",'discount',null,null,'disc',{if:c=>!c.disc&&!c.it.lux}),
  O("It's a little expensive.",'expensive',null,null,'exp',{if:c=>!c.disc&&!c.bonus&&!c.it.lux}),
  O("That's too expensive! Are you crazy?",null,"Crazy?! ...My prices are fair, you know.","どうかしてる？！ …うちの 値段は ちゃんと してるのよ。",'rude',{ok:0,j:"高すぎ！ どうかしてるの？",pip:"Rude! Rude!",fx:'😠',if:c=>!c.disc}),
  O("Hmm, I'll think about it.",'think',"Of course. Come back anytime.","もちろん。 いつでも 来てね。",'eThink')]},
 lux:{s:c=>`Ah, the ${W(c)}? That one is in the glass case. It's one of a kind. Let me get the key... There.`,j:c=>`あら、 ${c.it.n}？ それは ガラスケースの 中の 一点ものよ。 鍵を とってくるわね… はい。`,enter:c=>{c.luxSeen=1},o:[
  O("Can I take a closer look?",'closerLook',null,null,'luxLook'),
  O("How much is it?",'howMuch',null,null,'price0'),
  O("Can I lick it?",null,"Lick it?! Absolutely not! Ha ha.","なめる？！ ぜったい だめ！ あはは。",'lux2',{ok:0,j:"なめても いい？",pip:"No licking! No licking!",fx:'👅'})]},
 lux2:{s:"So... would you like to take a look? Gently, please.",j:"それで… 見てみる？ そーっとね。",o:[
  O("Yes. Can I take a closer look?",'closerLook',null,null,'luxLook'),
  O("How much is it?",'howMuch',null,null,'price0')]},
 luxLook:{s:c=>`Here. Be careful. ${c.it.lux0[0]}`,j:c=>`はい。 気を つけてね。 ${c.it.lux0[1]}`,o:[
  O("Wow. Is it real?",'genuine',c=>c.it.k==='book'||c.it.k==='map'?"Yes, it's the real thing. I would never sell a copy.":"Yes, it's genuine. It comes with a certificate.",c=>c.it.k==='book'||c.it.k==='map'?"ええ、 本物よ。 にせものは ぜったい 売らないわ。":"ええ、 本物よ。 証明書も つくわ。",'luxQ',{j:"わあ。 本物ですか？",act:c=>{c.q1=1}}),
  O("Does it come with a warranty?",'warranty',"Yes. If anything goes wrong within a year, bring it back to me.","ええ。 1年いないに なにか あったら、 もってきてね。",'luxQ',{act:c=>{c.q2=1}}),
  O("How much is it?",'howMuch',null,null,'price0'),
  O("Oops! I dropped it!",null,"WHAT?! ...Oh, you're joking. Don't do that to an old lady!","なんですって？！ …あら、 じょうだんね。 年よりを おどかさないで！",'luxQ',{ok:0,j:"あっ！ おとしちゃった！",pip:"Oh no! Oh no!",fx:'😱'})]},
 luxQ:{s:"Any other questions?",j:"ほかに 聞きたい ことは ある？",o:[
  O("Is it real?",'genuine',"Yes, it's the real thing.","ええ、 本物よ。",'luxQ',{if:c=>!c.q1,act:c=>{c.q1=1}}),
  O("Does it come with a warranty?",'warranty',"Yes, for one year.","ええ、 1年間ね。",'luxQ',{if:c=>!c.q2,act:c=>{c.q2=1}}),
  O("Is it worth it?",'worthIt',c=>c.it.worth[0],c=>c.it.worth[1],'luxQ',{if:c=>!c.worth,act:c=>{c.worth=1}}),
  O("No. How much is it?",'howMuch',null,null,'price0',{j:"いいえ。 いくらですか？"})]},
 luxBest:{s:c=>`For a piece like this... Well, I can do 5% off. That's ${P(c)} coins.`,j:c=>`この 品物だと… そうね、 5%（5分）びきなら できるわ。 ${P(c)}まいよ。`,enter:c=>{c.disc=.05},o:[
  O("Thank you. I'll take it.",'takeIt',"Thank you!","ありがとう！",'pre',{j:"ありがとう。 買います。"}),
  O("How about 10% off? I'm a regular customer.",'regular',null,null,'luxReg',{j:"1わり びきは どう？ 常連なんです。",if:()=>Z.visits()>=3}),
  O("Only 5%? Make it 90% off!",null,"Ninety percent?! Then you can run the shop, and I'll go on vacation!","9わり びき？！ じゃあ あなたが お店を やって、 わたしは 旅行に 行くわ！",'luxBest2',{ok:0,j:"5%だけ？ 9わり びきに して！",pip:"Vacation! Vacation!",fx:'🏖️'}),
  O("Let me sleep on it.",'think',"Of course. Big things need big thinking.","もちろん。 大きな 買いものは よく 考えないとね。",'eThink',{j:"ひと晩 考えさせて ください。"})]},
 luxBest2:{s:c=>`So, 5% off. ${P(c)} coins. OK?`,j:c=>`それで、 5%びき。 ${P(c)}まい。 いい？`,o:[
  O("OK. I'll take it.",'takeIt',"Thank you!","ありがとう！",'pre',{j:"はい。 買います。"}),
  O("Let me sleep on it.",'think',"Of course.","もちろん。",'eThink',{j:"ひと晩 考えさせて ください。"})]},
 luxReg:{s:c=>`A regular... You DO come here a lot. All right, 10% off. ${P(c)} coins. And that's really my final price!`,j:c=>`常連… たしかに よく 来てくれるわね。 いいわ、 1わり びき。 ${P(c)}まい。 これが ほんとに 最後の 値段よ！`,enter:c=>{c.disc=.1},o:[
  O("Deal! I'll treat myself.",'splurge',"You deserve it!","あなたなら それだけの ことは してるわ！",'pre',{j:"きまり！ 自分への ごほうびに します。"}),
  O("Let me sleep on it.",'think',"Of course.","もちろん。",'eThink',{j:"ひと晩 考えさせて ください。"})]},
 rude:{s:c=>`Anyway... it's ${P(c)} coins.`,j:c=>`とにかく… ${P(c)}まいよ。`,o:[
  O("Sorry. It's a little expensive for me.",'expensive',null,null,'exp',{j:"ごめんなさい。 ぼくには ちょっと 高いです。"}),
  O("Sorry! I'll take it.",'takeIt',"Thank you. Apology accepted.","ありがとう。 ゆるして あげる。",'pre',{j:"ごめんなさい！ 買います。"}),
  O("Fine. I'm leaving!",null,"Bye then!","じゃあね！",'eRude',{ok:0,j:"いいよ。 帰る！",pip:"Bye-bye! Rude!"})]},
 color:{s:c=>`We have ${list(c.it.colors.map(x=>x[0]))}. Which color do you like?`,j:c=>`${listJ(c.it.colors.map(x=>x[1]))}が あるわ。 どの 色が いい？`,o:c=>[
  ...c.it.colors.map(([en,ja])=>O(`I like the ${en} one.`,'likeColor',`The ${en} one? Good choice!`,`${ja}？ いい えらび方ね！`,'pre2',{j:`${ja}が いいです。`,act:c=>{c.color=en}})),
  O("Do you have it in invisible?",null,"Invisible? ...Here you are! Ha ha, just kidding.","とうめい？ …はい、 どうぞ！ あはは、 じょうだんよ。",'color',{ok:0,j:"とうめいな 色は ある？",fx:'👻',if:c=>!c.ghost,act:c=>{c.ghost=1}})]},
 size:{s:c=>`What size are you looking for? We have ${list(c.it.sizes.map(x=>x[0]))}.`,j:c=>`どの サイズを さがしてる？ ${listJ(c.it.sizes.map(x=>x[1]))}が あるわ。`,o:c=>[
  ...c.it.sizes.map(([en,ja])=>O(`A ${en}, please.`,'sizeM',null,null,'try',{j:`${ja}を ください。`,act:c=>{c.size=en}})),
  O("Extra extra extra large, please!",null,"Ha ha! Is it for a whale?","あはは！ クジラ用？",'size',{ok:0,j:"スーパー ウルトラ L で！",fx:'🐋',if:c=>!c.whale,act:c=>{c.whale=1}})]},
 try:{s:c=>`Here's a ${c.size} one. Would you like to try it on?`,j:c=>`${sizeJ(c,c.size)}サイズよ。 ためしに 着て（かぶって）みる？`,o:[
  O("Yes. Can I try it on?",'tryOn',"Sure! The mirror is over there.","どうぞ！ 鏡は あっちよ。",'fit'),
  O(c=>`No, thanks. It's for ${TO[c.it.to][0].split('.')[0]}.`,null,"Then I hope it's the right size!","じゃあ サイズが あうと いいわね！",'pre2',{j:c=>`いいえ、 ${TO[c.it.to][1]}に あげるんです。`})]},
 fit:{s:"How is it?",j:"どう？",o:[
  O("It fits perfectly.",'fits',"It looks great on you!","とっても にあってる！",'pre2'),
  O("It's a little small.",'tooSmall',c=>`Let me get you a ${bigger(c)} one. ...Here! Much better.`,c=>`${sizeJ(c,bigger(c))}サイズを もってくるわね。 …はい！ ずっと いい。`,'pre2',{if:c=>c.size!==c.it.sizes[c.it.sizes.length-1][0],act:c=>{c.size=bigger(c)}}),
  O("Help! I'm stuck!",null,"Oh dear! Hold still... There! You're free.","あらあら！ じっと して… はい！ ぬけたわ。",'fit',{ok:0,j:"たすけて！ ぬけない！",pip:"Stuck! Stuck!",fx:'😵',if:c=>!c.stuck,act:c=>{c.stuck=1}})]},
 pre2:{s:c=>`So, the ${[c.color,c.size].filter(Boolean).join(' ')} ${W(c)}. That's ${P(c)} coins.`,j:c=>`じゃあ、 ${[c.color&&colJ(c,c.color),c.size&&sizeJ(c,c.size)+'サイズ'].filter(Boolean).join('・')}の ${c.it.n}ね。 ${P(c)}まいよ。`,o:[
  O("I'll take it.",'takeIt',"Thank you!","ありがとう！",'pre'),
  O("Can you give me a discount?",'discount',null,null,'disc',{if:c=>!c.disc}),
  O("Hmm, I'll think about it.",'think',"Of course. Come back anytime.","もちろん。 いつでも 来てね。",'eThink')]},
 disc:{s:c=>`Hmm... A discount? Well, since you asked so nicely, I can give you 10% off. That's ${P(c)} coins.`,j:c=>`うーん… 値引き？ そうね、 ていねいに たのんでくれたから 1わり びきに するわ。 ${P(c)}まいよ。`,enter:c=>{c.disc=.1},o:[
  O("Great! I'll take it.",'takeIt',"Thank you!","ありがとう！",'pre',{j:"やった！ 買います。"}),
  O(c=>`How about ${how(c)} coins?`,'howAbout',null,null,'haggle',{j:c=>`${how(c)}まいで どうですか？`}),
  O("Can I have it for free?",null,"For free?! Then I'd have to close my shop! Ha ha.","ただ？！ それじゃ お店が つぶれちゃう！ あはは。",'disc2',{ok:0,j:"ただで もらえる？",pip:"Free! Free!",fx:'💸'}),
  O("Hmm, I'll think about it.",'think',"Of course. Come back anytime.","もちろん。 いつでも 来てね。",'eThink')]},
 disc2:{s:c=>`So, ${P(c)} coins. OK?`,j:c=>`それで、 ${P(c)}まい。 いい？`,o:[
  O("OK. I'll take it.",'takeIt',"Thank you!","ありがとう！",'pre',{j:"はい。 買います。"}),
  O(c=>`How about ${how(c)} coins?`,'howAbout',null,null,'haggle',{j:c=>`${how(c)}まいで どうですか？`})]},
 haggle:{s:c=>`${how(c)} coins? Hmm... You're good at this! OK, 20% off. That's ${P(c)} coins. My final offer!`,j:c=>`${how(c)}まい？ うーん… あなた、 ねぎるのが じょうずね！ いいわ、 2わり びき。 ${P(c)}まい。 これ以上は むり！`,enter:c=>{c.disc=.2},o:[
  O("It's a deal!",'deal',"Ha ha, you win!","あはは、 あなたの 勝ちね！",'pre'),
  O("How about half price?",null,"Half price?! Now you're pushing it! 20% off is my final offer.","半額？！ それは よくばりすぎ！ 2わり びきが 限界よ。",'haggle2',{ok:0,j:"半額で どう？",pip:"Final! Final!",fx:'😤'}),
  O("Hmm, I'll think about it.",'think',"Of course. Come back anytime.","もちろん。 いつでも 来てね。",'eThink')]},
 haggle2:{s:c=>`So, ${P(c)} coins. Deal?`,j:c=>`それで、 ${P(c)}まい。 きまり？`,o:[
  O("It's a deal!",'deal',"Thank you!","ありがとう！",'pre'),
  O("I'll think about it.",'think',"Sure. Come back anytime.","ええ。 いつでも 来てね。",'eThink')]},
 exp:{s:c=>`I understand. How about this? If you buy it today, I'll give you a free ${Z.bonusW()}, too.`,j:c=>`わかるわ。 じゃあ こうしましょう。 きょう 買ってくれたら、 ${Z.bonusJ()}を おまけに つけるわ。`,enter:c=>{c.bonus=1},o:[
  O("It's a deal!",'deal',"Wonderful!","すてき！",'pre'),
  O("Can you give me a discount, too?",'discount',null,null,'disc',{j:"値引きも して もらえますか？"}),
  O("I'll think about it.",'think',"Sure. Come back anytime.","ええ。 いつでも 来てね。",'eThink')]},
 pre:{go:c=>c.it.colors&&!c.color?'color':c.it.sizes&&!c.size?'size':c.it.k==='gift'?'gift':'payq'},
 /* 🎁 「プレゼント？」は 毎回は 聞かない。 聞く ときも 聞き方を かえる（同じ 聞き方は つづけて 出ない。 Z.pickV） */
 gift:{go:c=>Math.random()<.4?'payq':Z.pickV('gift',['gift1','gift2','gift3'])},
 gift1:{s:"Is it a gift?",j:"プレゼント？",enter:tip("「Is it a gift?」は お店で よく 聞かれるよ。 自分用なら 「It's for me.」で だいじょうぶ"),o:[
  O(c=>`Yes. It's a present for ${TO[c.it.to][0]}.`,'present',c=>`How nice! ${TO[c.it.to][0].split(/[,.]/)[0].replace('my teacher','your teacher')} will be happy.`,c=>`すてき！ ${TO[c.it.to][1]}、 きっと よろこぶわ。`,'wrapq',{j:c=>`はい。 ${TO[c.it.to][1]}への プレゼントです。`}),
  O("No, it's for me.",'forMe',"OK!","わかったわ！",'payq',{j:"いいえ、 自分用です。"}),
  O("Yes. It's a present for my goldfish.",null,c=>`For your goldfish?! ...I hope it likes the ${W(c)}.`,c=>`金魚に？！ …${c.it.n}、 気に入ると いいわね。`,'wrapq',{ok:0,j:"はい。 金魚への プレゼントです。",fx:'🐟'})]},
 gift2:{s:"Is this for someone special?",j:"だれか とくべつな 人に あげるの？",enter:tip("「someone special」は 「だれか とくべつな 人」。 「It's for 〜.（〜に あげます）」で こたえられるよ"),o:[
  O(c=>`Yes. It's for ${TO[c.it.to][0]}.`,null,c=>`How sweet! ${TO[c.it.to][0].split(/[,.]/)[0].replace('my teacher','your teacher')} is lucky.`,c=>`やさしいのね！ ${TO[c.it.to][1]}は しあわせ ものね。`,'wrapq',{j:c=>`はい。 ${TO[c.it.to][1]}に あげます。`}),
  O("No, it's just for me.",'forMe',"Then I hope you enjoy it!","じゃあ 自分で たのしんでね！",'payq',{j:"いいえ、 自分用です。"}),
  O("Yes. It's for my pet rock.",null,"Your pet rock? ...I'm sure it will be very happy. Very quietly.","ペットの 石？ …きっと よろこぶわ。 とっても しずかにね。",'wrapq',{ok:0,j:"はい。 ペットの 石に あげます。",fx:'🪨'})]},
 gift3:{s:"Shall I wrap it as a present?",j:"プレゼント用に つつみましょうか？",enter:tip("「Shall I 〜?」は 「〜しましょうか？」。 お店の 人が よく つかう ていねいな 言い方だよ"),o:[
  O(c=>`Yes, please. It's for ${TO[c.it.to][0]}.`,null,"Wonderful. Let's make it pretty!","すてき。 かわいく つつみましょう！",'paper',{j:c=>`はい、 おねがいします。 ${TO[c.it.to][1]}に あげるんです。`}),
  O("No, thanks. It's for me.",'forMe',"OK!","わかったわ！",'payq',{j:"いいえ、 けっこうです。 自分用です。"}),
  O("Yes! Wrap it ten times!",null,"Ten times? It would look like a mummy! Once is enough, dear.","10回？ ミイラみたいに なっちゃう！ 1回で じゅうぶんよ。",'paper',{ok:0,j:"うん！ 10回 つつんで！",fx:'🎁'})]},
 wrapq:{s:"Would you like it gift-wrapped? It's free.",j:"プレゼント用に つつむ？ 無料よ。",o:[
  O("Yes. Could you gift-wrap it?",'wrap',null,null,'paper'),
  O("No, thank you.",null,"OK!","わかったわ！",'payq',{j:"いいえ、 けっこうです。"})]},
 paper:{s:"Which paper would you like? Blue with stars, or pink with shells?",j:"どの 紙が いい？ 星の もようの 青か、 貝がらの もようの ピンク。",o:[
  O("The blue one, please.",'thisPaper',"Blue with stars. Lovely!","星の 青ね。 すてき！",'rib',{act:c=>{c.wrap='blue'}}),
  O("The pink one, please.",'thisPaper',"Pink with shells. So cute!","貝がらの ピンクね。 かわいい！",'rib',{j:"ピンクのを ください。",act:c=>{c.wrap='pink'}}),
  O("Can you wrap ME, too?",null,"Wrap you?! You're too big for my paper! Ha ha.","あなたを つつむ？！ 紙が たりないわ！ あはは。",'paper',{ok:0,j:"ぼくも つつんで くれる？",fx:'🎁',if:c=>!c.me,act:c=>{c.me=1}})]},
 rib:{s:"And would you like a ribbon?",j:"リボンも つける？",o:[
  O("Yes. Could you put a ribbon on it?",'ribbon',"There! Isn't it pretty?","はい！ きれいでしょ？",'payq',{act:c=>{c.rib=1}}),
  O("No ribbon, thanks.",null,"OK. Simple is nice, too.","わかった。 シンプルも いいわね。",'payq',{j:"リボンは いりません。"})]},
 /* 💰 お会計: 毎回 同じに ならないように、 はらい方の 聞き方を かえて、 その前後に 0〜2この やりとり（これで ぜんぶ？・ポイントカード・
    レシート・ふくろ・値札）が 入ったり 入らなかったり する。 同じ 聞き方は つづけて 出ない（Z.pickV）。 */
 payq:{go:c=>Z.coins()<P(c)?'nomoney':'ck0'},
 ck0:{go:c=>{if(!c.ck)c.ck=plan(c);return 'ck'}},
 ck:{go:c=>c.ck.length?c.ck.shift():'fin'},
 /* --- はらう（どれか 1つ） --- */
 pay:{s:c=>`That'll be ${P(c)} coins, please.`,j:c=>`${P(c)}まいに なります。`,enter:tip("「That'll be 〜, please.」は 「〜に なります」。 お店の 人の 決まった 言い方だよ"),o:[
  O("I'll pay in cash.",'payCash',"Thank you!","ありがとう！",'ck'),
  O("Can I pay by card?",'payCard',"Sorry, we only take coins here. It's a beach shop!","ごめんね、 ここは コインだけなの。 浜辺の お店だから！",'card'),
  O("Can I pay with seashells?",null,"Seashells? I wish! Coins only, please.","貝がら？ そうだったら いいけど！ コインで おねがい。",'pay2',{ok:0,j:"貝がらで はらえますか？",pip:"Shells! Shells!",fx:'🐚'})]},
 pay2:{s:c=>`So, ${P(c)} coins, please.`,j:c=>`それじゃ、 ${P(c)}まい おねがいね。`,o:[
  O("I'll pay in cash.",'payCash',"Thank you!","ありがとう！",'ck'),
  O("Can I pay by card?",'payCard',"Sorry, coins only. It's a beach shop!","ごめんね、 コインだけなの。 浜辺の お店だから！",'card')]},
 card:{s:"Is that OK?",j:"それで いい？",o:[
  O("Sure. Here you are.",null,"Thank you!","ありがとう！",'ck',{j:"もちろん。 はい、 どうぞ。"})]},
 payB:{s:c=>`That's ${P(c)} coins altogether.`,j:c=>`ぜんぶで ${P(c)}まいよ。`,enter:tip("「altogether」は 「ぜんぶで」。 「That's 〜 altogether.」は 合計を 言う ときの 決まった 言い方だよ"),o:[
  O("Here you are.",'hereYouAre',"Thank you!","ありがとう！",'ck'),
  O("Can I pay in chocolate?",null,"Chocolate? I'd eat it all before lunch! Coins, please.","チョコ？ お昼までに ぜんぶ 食べちゃうわ！ コインで おねがい。",'payB',{ok:0,j:"チョコで はらえる？",fx:'🍫',if:c=>!c.choc,act:c=>{c.choc=1}})]},
 payC:{s:c=>`That's ${P(c)} coins. Do you have exact change?`,j:c=>`${P(c)}まいよ。 ちょうど ある？`,enter:tip("「exact change」は 「ちょうどの お金」、 「change」だけだと 「おつり」。 「Here's your change.」は 「おつりです」だよ"),o:[
  O("Yes. Here's the exact amount.",'exact',"Perfect. Thank you!","ぴったりね。 ありがとう！",'ck',{j:"はい。 ちょうど あります。"}),
  O("Sorry, I don't have any small change.",'noChange',"No problem. Here's your change. Please check it.","だいじょうぶよ。 はい、 おつり。 たしかめてね。",'ck'),
  O("I have a button. Is that OK?",null,"A button? Ha ha! That goes on your shirt, dear.","ボタン？ あはは！ それは シャツに つける ものよ。",'payC',{ok:0,j:"ボタンなら あるけど いい？",fx:'🔘',if:c=>!c.btn,act:c=>{c.btn=1}})]},
 payD:{s:c=>`Your total is ${P(c)} coins.`,j:c=>`お会計は ${P(c)}まいです。`,enter:tip("「total」は 「合計」。 「Does that include tax?（税こみですか？）」は 外国の お店で 役に 立つよ"),o:[
  O("Here you go.",'hereYouGo',"Thank you!","ありがとう！",'ck'),
  O("Does that include tax?",'taxIn',"Yes, it does. Beach shop prices are simple!","ええ、 税こみよ。 浜辺の お店の 値段は シンプルなの！",'payD',{if:c=>!c.tax,act:c=>{c.tax=1}}),
  O("Can I pay with a smile?",null,"What a lovely smile! ...But I still need coins, dear.","すてきな えがお！ …でも やっぱり コインが いるのよ。",'payD',{ok:0,j:"えがおで はらえる？",fx:'😁',if:c=>!c.smile,act:c=>{c.smile=1}})]},
 payE:{s:c=>`${P(c)} coins, please.`,j:c=>`${P(c)}まい おねがいね。`,enter:tip("きょうの お会計は みじかかったね。 「〜 coins, please.」には 「Here you are.」だけで じゅうぶんだよ"),o:[
  O("Here you are.",'hereYouAre',"Thank you, dear!","ありがとう！",'ck'),
  O("Sure. Here you go.",'hereYouGo',"Thanks!","ありがとう！",'ck',{j:"はい、 どうぞ。"})]},
 payF:{s:"Cash or card?",j:"現金？ それとも カード？",enter:tip("「Cash or card?」は レジの 定番。 「Cash, please.」の ように 1語＋please で こたえられるよ"),o:[
  O("Cash, please.",'cashPls',c=>`Thank you! ${P(c)} coins, then.`,c=>`ありがとう！ じゃあ ${P(c)}まいね。`,'ck'),
  O("Card, please.",null,"Oh, sorry! I only take coins. It's a beach shop!","あら、 ごめんね！ コインだけなの。 浜辺の お店だから！",'card',{j:"カードで おねがいします。"}),
  O("Seashells, please.",null,"Seashells? Ha ha! Pip, did you teach that one?","貝がら？ あはは！ ピップ、 あなたが 教えたの？",'payF2',{ok:0,j:"貝がらで！",pip:"Shells! Shells!",fx:'🐚'})]},
 payF2:{s:c=>`Coins only, dear. ${P(c)} coins, please.`,j:c=>`コインだけよ。 ${P(c)}まい おねがいね。`,o:[
  O("Sure. Here you are.",'hereYouAre',"Thank you!","ありがとう！",'ck',{j:"はい、 どうぞ。"})]},
 /* --- はらう 前（入る ときと 入らない ときが ある） --- */
 else1:{s:"Will that be all?",j:"これで ぜんぶ？",enter:tip("「Will that be all?」は 「ごちゅうもんは 以上ですか？」。 「Yes, that's all.」で こたえよう"),o:[
  O("Yes, that's all.",'thatsAll',"OK!","はい！",'ck'),
  O("And the parrot, please!",null,"Pip? Oh no, Pip is not for sale! Ha ha.","ピップ？ だめだめ、 ピップは 売りものじゃ ないの！ あはは。",'ck',{ok:0,j:"それと、 その オウムも ください！",pip:"Not for sale! Not for sale!",fx:'🦜'})]},
 else2:{s:"Anything else today?",j:"きょうは ほかに なにか いる？",enter:tip("「Anything else?」は 「ほかには？」。 「No, that's it.（それだけです）」が 言えると スムーズだよ"),o:[
  O("No, that's it. Thanks.",'thatsIt',"All right!","わかったわ！",'ck',{j:"いいえ、 それだけです。 ありがとう。"}),
  O("Just this, please.",'justThis',"Sure!","はい！",'ck'),
  O("Yes. One free cookie, please!",null,"Free? Nice try, dear! Ha ha.","ただで？ うまいこと 言うわね！ あはは。",'ck',{ok:0,j:"うん。 ただの クッキーを 1つ！",pip:"Nice try! Nice try!",fx:'🍪'})]},
 else3:{s:"Did you find everything you were looking for?",j:"さがしてた もの、 ぜんぶ 見つかった？",enter:tip("「Did you find everything you were looking for?」は アメリカの レジで ほんとに よく 聞かれるよ"),o:[
  O("Yes, I did. Thank you.",'foundAll',"I'm glad!","よかった！",'ck'),
  O("Yes. You have a lovely shop.",'lovelyShop',"Oh, thank you, dear! You made my day.","まあ、 ありがとう！ きょう いちばん うれしい ことばよ。",'ck',{j:"はい。 すてきな お店ですね。"}),
  O("No. I'm looking for my homework.",null,"Your homework? It's not here, dear. ...Pip, did you take it?","宿題？ ここには ないわよ。 …ピップ、 あなた もってった？",'ck',{ok:0,j:"いいえ。 宿題を さがしてます。",pip:"Not me! Not me!",fx:'📝'})]},
 pts1:{s:"Do you have a points card?",j:"ポイントカードは もってる？",enter:tip("ポイントカードは 英語で points card や rewards card、 loyalty card とも 言うよ"),o:[
  O("No, I don't.",null,"No problem!","だいじょうぶよ！",'ck',{j:"いいえ、 もってません。"}),
  O("Sorry, I left it at home.",'leftHome',"That's OK. Next time!","いいのよ。 また こんどね！",'ck'),
  O("Is this it?",null,"That's a seashell, dear! Ha ha.","それは 貝がらよ！ あはは。",'ck',{ok:0,j:"これですか？（貝がらを 出す）",pip:"Shell! Shell!",fx:'🐚'})]},
 pts2:{s:"Are you a member here?",j:"うちの 会員さん だったかしら？",enter:tip("「member」は 「会員」。 「Not yet.（まだです）」は いろんな 場面で つかえる 便利な 答えだよ"),o:[
  O("Not yet.",'notYet',"Then come often, and Pip will remember your face!","じゃあ たくさん 来てね。 ピップが 顔を おぼえるわ！",'ck',{pip:"I remember! I remember!"}),
  O("Yes, I come here a lot.",null,"I know! You're one of my favorite customers.","知ってるわ！ だいすきな お客さんの ひとりよ。",'ck',{j:"はい、 よく 来てます。"}),
  O("Yes. I'm the president of the Pip Fan Club.",null,"A Pip Fan Club?! Don't tell him. His head will get too big.","ピップ ファンクラブ？！ 本人には ないしょね。 調子に のっちゃうから。",'ck',{ok:0,j:"はい。 ピップ ファンクラブの 会長です。",pip:"Fan club! Fan club!",fx:'🦜'})]},
 /* --- はらった あと（入る ときと 入らない ときが ある） --- */
 rcptq:{s:"Would you like a receipt?",j:"レシートは いる？",enter:tip("「receipt」の p は 読まないよ。 「レシート」じゃなくて 「リシート」に 近い 音なんだ"),o:[
  O("Yes. Can I have a receipt?",'receipt',"Here you are. Keep it in a safe place.","はい、 どうぞ。 なくさないでね。",'ck',{act:c=>{c.rcpt=1}}),
  O("No, thanks.",null,"OK!","わかったわ！",'ck',{j:"いいえ、 けっこうです。",act:c=>{c.rcpt=0}})]},
 rcpt2:{s:"Do you need the receipt?",j:"レシート、 いる？",enter:tip("「No, I'm fine.」は 「だいじょうぶです（いりません）」。 ことわる ときの やさしい 言い方だよ"),o:[
  O("Yes, please.",'yesPlease',"Here you are.","はい、 どうぞ。",'ck',{j:"はい、 おねがいします。",act:c=>{c.rcpt=1}}),
  O("No, I'm fine. Thanks.",'imFine',"OK! I'll throw it away for you.","わかった！ こっちで すてて おくわね。",'ck',{act:c=>{c.rcpt=0}})]},
 rcpt3:{s:"Here's your receipt. Keep it, in case you want to return it.",j:"はい、 レシート。 返品するかも しれないから、 とっておいてね。",enter:c=>{c.rcpt=1;tip("「change my mind」は 「気が かわる」。 返品の ときは レシートが いるから、 とっておこう")(c)},o:[
  O("Thank you.",null,"You're welcome!","どういたしまして！",'ck',{j:"ありがとう。"}),
  O("Can I return it if I change my mind?",'changeMind',"Yes. Just bring it back with the receipt.","ええ。 レシートと いっしょに もってきてね。",'ck'),
  O("Can I eat the receipt?",null,"Eat it?! It's paper, dear! Ha ha.","食べる？！ 紙よ！ あはは。",'ck',{ok:0,j:"レシート 食べても いい？",pip:"Paper! Paper!",fx:'🧾'})]},
 bagq:{s:"Do you need a bag?",j:"ふくろは いる？",enter:tip("「I don't need a bag.」は ふくろを ことわる 言い方。 海に やさしいね"),o:[
  O("I don't need a bag. Thanks.",'noBag',"Thank you for saving paper!","紙の せつやく、 ありがとう！",'ck'),
  O("Yes. Can I have a bag?",'bag',"Sure. Here you go.","ええ。 はい、 どうぞ。",'ck'),
  O("Can I have a really big box?",null,c=>`A big box for one little ${W(c)}? ...Well, OK!`,c=>`小さな ${c.it.n} 1つに 大きな 箱？ …まあ、 いいわ！`,'ck',{ok:0,j:"すごく 大きな 箱を もらえる？",fx:'📦',act:c=>{c.box=1}})]},
 bag2:{s:"Shall I put it in a bag?",j:"ふくろに 入れましょうか？",enter:tip("「I have my own bag.（自分の ふくろが あります）」は エコな 言い方。 外国でも よく つかうよ"),o:[
  O("Yes, please.",'yesPlease',"Here you go.","はい、 どうぞ。",'ck',{j:"はい、 おねがいします。"}),
  O("It's OK. I have my own bag.",'ownBag',"Oh, good for you! The sea says thank you.","まあ、 えらいわね！ 海も ありがとうって 言ってるわ。",'ck',{j:"だいじょうぶです。 自分の ふくろが あります。"}),
  O("No, thanks. I'll carry it.",'carryIt',"OK. Here you are.","わかった。 はい、 どうぞ。",'ck',{j:"いいえ、 けっこうです。 このまま もって いきます。"})]},
 bag3:{s:"Would you like a bag, or is it OK like this?",j:"ふくろ いる？ それとも このままで いい？",enter:tip("「like this」は 「このまま」。 「It's OK like this.（このままで いいです）」は かんたんで 便利だよ"),o:[
  O("It's OK like this. Thank you.",'likeThis',"All right. Here you are.","わかったわ。 はい、 どうぞ。",'ck'),
  O("A bag, please.",null,"Sure. Here you go.","ええ。 はい、 どうぞ。",'ck',{j:"ふくろを おねがいします。"}),
  O("Can I have a bag for my bag?",null,"A bag for your bag? ...Then you'll need a bag for that bag, too! Ha ha.","ふくろ用の ふくろ？ …じゃあ その ふくろ用の ふくろも いるわね！ あはは。",'ck',{ok:0,j:"ふくろを 入れる ふくろも もらえる？",pip:"Bag! Bag! Bag!",fx:'🛍️'})]},
 tag1:{s:"Shall I take the price tag off?",j:"値札、 はずして おく？",enter:tip("「price tag」は 「値札」。 「take 〜 off」で 「〜を はずす」。 プレゼントを 買う ときに つかえるよ"),o:[
  O("Yes. Could you take the price tag off?",'tagOff',"Of course. Nobody needs to know the price!","もちろん。 値段は ないしょね！",'ck',{j:"はい。 値札を はずして もらえますか？"}),
  O("No, it's OK.",null,"All right.","わかったわ。",'ck',{j:"いいえ、 そのままで いいです。"}),
  O("Can you make the price bigger?",null,"Bigger?! So they'll think it was expensive? Ha ha, you're funny.","大きく？！ 高そうに 見せたいの？ あはは、 おもしろい 子ね。",'ck',{ok:0,j:"値段を もっと 大きく 書いて くれる？",pip:"Show-off! Show-off!",fx:'🏷️'})]},
 fin:{go:c=>c.box?'eBox':c.it.lux?(c.disc?'eLuxDeal':'eLux'):c.disc>=.2?'eHaggle':c.disc?'eDeal':c.bonus?'eBonus':c.wrap?'eGift':'eBuy'},
 nomoney:{s:c=>`That's ${P(c)} coins... Oh dear, you only have ${Z.coins()} coins.`,j:c=>`${P(c)}まいね… あら、 ${Z.coins()}まいしか ないみたい。`,o:[
  O("Could you put it aside for me?",'putAside',null,null,'eHold'),
  O("Can you give me a discount?",'discount',"Hmm... Just for you, 20% off.","うーん… あなただけ 特別に 2わり びき。",'payq',{if:c=>!c.disc,act:c=>{c.disc=.2}}),
  O("I'll come back later.",'comeBack',null,null,'eLater'),
  O("Can I pay with a song?",null,"A song? ...La la la. Lovely! But I still need coins.","歌で？ …ラララ。 すてき！ でも やっぱり コインが いるの。",'nomoney',{ok:0,j:"歌で はらえますか？",pip:"La la la!",fx:'🎵',if:c=>!c.sang,act:c=>{c.sang=1}})]},
 eBuy:E(1,'お買いもの せいこう',c=>`Here's your ${W(c)}. Thank you, and come again!`,c=>`はい、 ${c.it.n}よ。 ありがとう、 また 来てね！`,'🛍️','buy'),
 eDeal:E(1,'ねぎって 買えた',c=>`10% off, just for you. Don't tell anyone!`,"あなただけ 1わり びきよ。 ないしょね！",'🏷️','buy'),
 eHaggle:E(1,'ねぎり 名人',c=>`20% off! You're the best haggler on this beach.`,"2わり びき！ あなた、 この 浜辺 いちばんの ねぎり 名人ね。",'🏆','buy'),
 eBonus:E(1,'おまけ つき',c=>`And here's your free ${Z.bonusW()}. Enjoy!`,c=>`それと、 おまけの ${Z.bonusJ()}。 たのしんでね！`,'🎁','buy'),
 eGift:E(1,'プレゼント用に つつんだ',c=>`All wrapped up! I hope ${c.it.to==='mina'?'Mina':TO[c.it.to][0].split('.')[0]} loves it.`,c=>`きれいに つつめたわ！ ${TO[c.it.to][1]}が 気に入って くれると いいわね。`,'🎀','buy'),
 eLux:E(1,'一生ものの 買いもの',c=>`Here's your ${W(c)}, with its certificate. Take good care of it. It has a new story now: yours.`,c=>`はい、 ${c.it.n}。 証明書も いっしょにね。 大切に してね。 これからは あなたの 物語が はじまるの。`,'💎','buy'),
 eLuxDeal:E(1,'常連さんの ねびき',c=>`For my favorite customer. Don't tell Pip how much you paid!`,"いちばんの お客さんだから とくべつよ。 いくら はらったか ピップには ないしょね！",'🗝️','buy'),
 eBox:E(0,'大きな 箱で お持ち帰り',"Can you carry it? ...You look like a moving box with legs!","持てる？ …足の はえた ひっこしの 箱みたいよ！",'📦','buy'),
 eLook:E(1,'見るだけ でも OK',"Thanks for coming. The shelf will be here tomorrow, too.","来てくれて ありがとう。 たなは あしたも ここに あるわ。",'👀'),
 eThink:E(1,'ていねいに ことわった',"Take your time. Good things wait for you.","ゆっくり 考えてね。 いい ものは 待っててくれるわ。",'🤔'),
 eHold:E(1,'とっておいて もらった',c=>`Of course. I'll keep this ${W(c)} for you. Come back when you have the coins!`,c=>`もちろん。 この ${c.it.n}は とっておくわ。 コインが たまったら 来てね！`,'🔖','hold'),
 eLater:E(1,'また あとで 来る',"See you later! Good luck with your coins.","また あとでね！ コイン、 がんばってね。",'👋'),
 eRude:E(0,'ピップに おこられた',"(Pip is still saying 'Rude!' as you walk away...)","（帰る あいだも、 ピップは 「Rude!（しつれい！）」と 言いつづけている…）",'🦜'),
}},

/* ======================================================= おすすめを きく */
rec:{t:'おすすめを きく',start:'a',nodes:{
 a:{s:"Hello! Are you looking for anything special today?",j:"いらっしゃい！ きょうは なにか とくべつな ものを さがしてる？",o:[
  O("What do you recommend?",'recommend',null,null,'who'),
  O("I'm looking for a present.",'lookFor',null,null,'friend'),
  O("Do you have anything cheaper?",'cheaper',null,null,'cheap',{j:"なにか 安い ものは ありますか？"}),
  O("Do you sell dinosaurs?",null,"Dinosaurs? Only very small ones. ...That's a lizard, dear.","恐竜？ すごく 小さいのなら。 …それは トカゲよ。",'a2',{ok:0,j:"恐竜は 売ってますか？",fx:'🦎'})]},
 a2:{s:"So, what are you looking for?",j:"それで、 なにを さがしてるの？",o:[
  O("What do you recommend?",'recommend',null,null,'who'),
  O("I'm looking for a present.",'lookFor',null,null,'friend'),
  O("Do you have anything cheaper?",'cheaper',null,null,'cheap',{j:"なにか 安い ものは ありますか？"})]},
 who:{s:"Is it for you, or for someone else?",j:"あなた用？ それとも だれかに あげるの？",o:[
  O("It's for me.",null,null,null,'mine',{j:"自分用です。"}),
  O("It's for a friend.",null,null,null,'friend',{j:"友だち用です。"})]},
 friend:{s:"How nice! Who is it for?",j:"すてき！ だれに あげるの？",o:[
  O("It's for my teacher.",'forWho',"Your teacher? Then how about something sweet or pretty?","先生？ じゃあ あまい ものか かわいい ものは どう？",'recG',{act:c=>{c.it=Z.item(c.seed%2?'g_pin':'g_cookie')}}),
  O("It's for Gen. He's a fisherman.",null,"Gen! I know him. He always wears the same old shirt.","ゲンじい！ 知ってるわ。 いつも 同じ 古い シャツを 着てるの。",'recG',{j:"ゲンじいです。 つりびとです。",act:c=>{c.it=Z.item('g_shirt')}}),
  O("It's for Pochi. He's a dog.",null,"A dog? I have just the thing!","犬？ ぴったりの ものが あるわ！",'recG',{j:"ポチです。 犬です。",act:c=>{c.it=Z.item('g_bone')}}),
  O("It's for Sora. She's six.",null,"Little Sora! She runs in the sun all day.","小さな ソラちゃん！ 1日中 日なたを 走りまわってるわね。",'recG',{j:"ソラです。 6さいです。",act:c=>{c.it=Z.item('g_hat')}}),
  O("It's for my enemy.",null,"Your enemy?! ...Then give them cookies and become friends.","てき？！ …じゃあ クッキーを あげて 友だちに なりなさい。",'recG',{ok:0,j:"ライバルへの ものです。",fx:'⚔️',act:c=>{c.it=Z.item('g_cookie')}})]},
 recG:{s:c=>`How about this ${W(c)}? ${c.it.a[0]}`,j:c=>`この ${c.it.n}は どう？ ${c.it.a[1]}`,o:[
  O("That sounds nice. How much is it?",'howMuch',null,null,'@buy:price',{j:"いいですね。 いくらですか？"}),
  O("Do you have anything else?",'anythingElse',null,null,'recG2',{act:c=>{c.it=Z.altGift(c.it.id)}}),
  O("I'll think about it.",'think',"Sure. Come back anytime.","ええ。 いつでも 来てね。",'eThink')]},
 recG2:{s:c=>`Hmm, then how about this ${W(c)}? ${c.it.a[0]}`,j:c=>`うーん、 じゃあ この ${c.it.n}は？ ${c.it.a[1]}`,o:[
  O("That's perfect. How much is it?",'howMuch',null,null,'@buy:price',{j:"ぴったり です。 いくらですか？"}),
  O("I'll think about it.",'think',"Sure. Come back anytime.","ええ。 いつでも 来てね。",'eThink')]},
 mine:{s:"What do you like? Stories? Collecting things?",j:"なにが 好き？ お話？ ものを 集めること？",o:[
  O("I like stories.",null,null,null,'recM',{j:"お話が 好きです。",if:()=>!!Z.recBook(),act:c=>{c.it=Z.recBook()}}),
  O("I like collecting things.",null,null,null,'recM',{j:"集めるのが 好きです。",if:()=>!Z.pcDone(),act:c=>{c.it=Z.item('pc')}}),
  O("I want to remember English phrases.",null,null,null,'recM',{j:"英語の フレーズを おぼえたい です。",if:()=>!Z.own('note'),act:c=>{c.it=Z.item('note')}}),
  O("I like surprises.",null,null,null,'recM',{j:"びっくりが 好きです。",act:c=>{c.it=Z.item('fortune')}}),
  O("I like sleeping.",null,"Me too! ...But I don't sell beds.","わたしも！ …でも ベッドは 売ってないの。",'mine',{ok:0,j:"ねるのが 好きです。",pip:"Sleepy! Sleepy!",fx:'😪',if:c=>!c.zz,act:c=>{c.zz=1}})]},
 recM:{s:c=>`Then this ${W(c)} is perfect for you. ${c.it.a[0]}`,j:c=>`それなら この ${c.it.n}が ぴったり。 ${c.it.a[1]}`,o:[
  O("Sounds great. How much is it?",'howMuch',null,null,'@buy:price',{j:"いいですね。 いくらですか？"}),
  O("Do you have anything else?",'anythingElse',null,null,'mine2'),
  O("I'll think about it.",'think',"Sure. Come back anytime.","ええ。 いつでも 来てね。",'eThink')]},
 mine2:{s:"Hmm, then what else do you like?",j:"うーん、 じゃあ ほかに 好きな ことは？",o:[
  O("I like stories.",null,null,null,'recM',{j:"お話が 好きです。",if:c=>!!Z.recBook()&&c.it.k!=='book',act:c=>{c.it=Z.recBook()}}),
  O("I like collecting things.",null,null,null,'recM',{j:"集めるのが 好きです。",if:c=>!Z.pcDone()&&c.it.id!=='pc',act:c=>{c.it=Z.item('pc')}}),
  O("I want to remember English phrases.",null,null,null,'recM',{j:"英語の フレーズを おぼえたい です。",if:c=>!Z.own('note')&&c.it.id!=='note',act:c=>{c.it=Z.item('note')}}),
  O("I like surprises.",null,null,null,'recM',{j:"びっくりが 好きです。",if:c=>c.it.id!=='fortune',act:c=>{c.it=Z.item('fortune')}}),
  O("Nothing. Thanks anyway!",null,"Ha ha. Come back when you find something!","あはは。 見つかったら また 来てね！",'eThink',{j:"とくに ないです。 ありがとう！"})]},
 cheap:{s:"Our fortune cookies are only 20 coins. There's an English message inside each one.",j:"おみくじ クッキーなら 20まいよ。 1つ 1つに 英語の ことばが 入ってるの。",enter:c=>{c.it=Z.item('fortune')},o:[
  O("Sounds fun! I'll take one.",'takeIt',"Here you are!","はい、 どうぞ！",'@buy:pre',{j:"たのしそう！ 1つ ください。"}),
  O("Do you have anything else?",'anythingElse',"Postcards are 40 coins. And dog chews are 40, too.","絵はがきは 40まい。 わんこの ガムも 40まいよ。",'cheap2'),
  O("Twenty coins? Too expensive!",null,"Too expensive?! It's the cheapest thing in the shop! Ha ha.","高すぎる？！ お店で いちばん 安いのよ！ あはは。",'cheap2',{ok:0,j:"20まい？ 高すぎ！",pip:"Cheap! Cheap!",fx:'🤑'})]},
 cheap2:{s:"Which one would you like?",j:"どれに する？",o:[
  O("A fortune cookie, please.",null,null,null,'@buy:price',{j:"おみくじ クッキーを ください。",act:c=>{c.it=Z.item('fortune')}}),
  O("A postcard, please.",null,null,null,'@buy:price',{j:"絵はがきを ください。",if:()=>!Z.pcDone(),act:c=>{c.it=Z.item('pc')}}),
  O("A dog chew, please.",null,null,null,'@buy:price',{j:"わんこの ガムを ください。",act:c=>{c.it=Z.item('g_bone')}}),
  O("I'll think about it.",'think',"Sure. Come back anytime.","ええ。 いつでも 来てね。",'eThink')]},
 eThink:E(1,'また こんど',"Come back anytime. Pip and I will be here.","いつでも 来てね。 ピップと 待ってるわ。",'🌙'),
}},

/* ======================================================= 売りに 来た */
sell:{t:'売りに 来た',start:'a',nodes:{
 a:{s:"Oh, hello! What can I do for you today?",j:"あら、 こんにちは！ きょうは どうしたの？",o:[
  O("I'd like to sell something.",'sell',null,null,'what',{j:"売りたい ものが あるんです。"}),
  O("I'd like to sell my homework.",null,"Your homework? Ha ha! Nobody buys homework.","宿題？ あはは！ 宿題を 買う 人は いないわ。",'a2',{ok:0,j:"宿題を 売りたいです。",pip:"Homework! Homework!",fx:'📝'})]},
 a2:{s:"So, do you have something to sell?",j:"それで、 売りたい ものは あるの？",o:[
  O("Yes. I'd like to sell something.",'sell',null,null,'what',{j:"はい。 売りたい ものが あります。"}),
  O("Never mind. Bye!",null,"Bye! Come again!","またね！",'eNo',{j:"やっぱり いいです。 さようなら！"})]},
 what:{s:"Sure. What would you like to sell?",j:"いいわよ。 なにを 売りたいの？",o:c=>[
  O("I have some empty bottles.",null,null,null,'bot',{j:"からの びんが あります。",if:()=>Z.bottles()>0}),
  ...Z.sellable().slice(0,3).map(it=>O(`I'd like to sell this ${it.title?'book':it.w}.`,'sell',null,null,'bk',{j:`この ${it.n}を 売りたいです。`,act:c=>{c.it=it}})),
  ...Z.tgs().slice(0,2).map(it=>O(`I'd like to sell this ${it.w}.`,'sell',null,null,'tg',{j:`この ${it.n}を 売りたいです。`,act:c=>{c.it=it}})),
  /* ラジオ・レコード（game/zakka-goods-talk.js の gOwn へ） */
  ...Z.ownGoods(c.seed).slice(0,2).map(it=>O(it.kind==='music'?`I'd like to sell my record, "${it.en}".`:`I'd like to sell my ${it.en}.`,'sell',null,null,'@gOwn:offer',{j:`${it.n}を 売りたいです。`,act:c=>{c.it=it}})),
  O("Actually, never mind.",null,"No problem!","いいのよ！",'eNo',{j:"やっぱり やめます。"})]},
 /* 💰 一覧（game/zakka.js sellList）から えらんで 来た とき: c.pk = bk(本・手帳) / gf(プレゼント) / tg(リクの お礼) / bot(びん) / g(ラジオ・レコード)
    はじまりは 毎回 かわる（あいさつ・「それ なあに？」・ノラさんが 先に 気づく・すぐ 値段の 話）。 同じ 形は つづけて 出ない */
 p0:{go:()=>Z.pickV('sellOpen',['p1','p2','p3','p4'])},
 p1:{s:c=>pickBy(c,["Hello! What can I do for you today?","Hi there! Did you come to shop, or to sell?","Welcome back! What brings you here today?"]),
   j:c=>pickBy(c,["こんにちは！ きょうは どうしたの？","いらっしゃい！ 買いに 来たの？ 売りに 来たの？","おかえり！ きょうは なんの 用？"]),o:[
  O(c=>`I'd like to sell ${SW(c)}.`,'sell',null,null,'pr',{j:c=>`${SJ(c)}を 売りたいです。`}),
  O("I'd like to sell Pip.",null,"Pip?! Ha ha! He's not for sale. He'd talk the new owner's ears off.","ピップ？！ あはは！ ピップは 売りものじゃ ないの。 新しい 飼い主が しゃべり つかれちゃう。",'p1b',{ok:0,j:"ピップを 売りたいです。",pip:"Not for sale! Not for sale!",fx:'🦜',if:c=>!c.pip,act:c=>{c.pip=1}})]},
 p1b:{s:"So, what would you really like to sell?",j:"それで、 ほんとうは なにを 売りたいの？",o:[
  O(c=>`I'd like to sell ${SW(c)}.`,'sell',null,null,'pr',{j:c=>`${SJ(c)}を 売りたいです。`})]},
 p2:{s:"Oh? What's that you're holding?",j:"あら？ もっているの、 なあに？",o:[
  O(c=>`I'd like to sell ${SW(c)}.`,'sell',null,null,'pr',{j:c=>`${SJ(c)}を 売りたいです。`}),
  O("It's a secret!",null,"A secret? Then I can't buy it! Ha ha. Come on, show me.","ひみつ？ それじゃ 買えないわ！ あはは。 ほら、 見せて。",'p2b',{ok:0,j:"ひみつ！",fx:'🤫',pip:"Secret! Secret!"})]},
 p2b:{s:"Well? What is it?",j:"それで？ なあに？",o:[
  O(c=>`Sorry. I'd like to sell ${SW(c)}.`,'sell',null,null,'pr',{j:c=>`ごめんなさい。 ${SJ(c)}を 売りたいです。`})]},
 p3:{s:c=>`Oh, is that ${SY(c)}? Would you like to sell it?`,j:c=>`あら、 それ ${SJ(c)}？ 売りたいの？`,o:[
  O("Yes, please.",null,null,null,'pr',{j:"はい、 おねがいします。"}),
  O("No. I just wanted to show you.",null,"Oh, how sweet! Thank you for showing me.","まあ、 うれしい！ 見せて くれて ありがとう。",'eShow',{j:"いいえ。 見せたかった だけです。"})]},
 p4:{go:()=>'pr'},
 pr:{go:c=>c.bgm?'pBgm':{bk:'bk',gf:'gf',tg:'tg',bot:'bot',g:'@gOwn:offer'}[c.pk]||'what'},
 /* お店（カードショップ）で ながしている 曲を 売る ときは ひとこと たしかめる */
 pBgm:{s:c=>`Wait. Isn't "${c.it.en}" the song you play in your card shop? Are you sure?`,j:c=>`まって。 「${c.it.n}」って、 あなたの カードショップで ながしている 曲 じゃない？ ほんとうに いいの？`,o:[
  O("Yes. I'd like to try a new song.",null,null,null,'@gOwn:offer',{j:"はい。 新しい 曲に したいんです。"}),
  O("Oh! Then I'll keep it.",'keepIt',null,null,'eKeep',{j:"あっ！ じゃあ、 もっておきます。"})]},
 eShow:E(1,'見せに 来た',"Come and show me anytime. I like hearing about your treasures.","いつでも 見せに 来てね。 あなたの 宝物の 話、 好きなの。",'😊'),
 /* 🎁 わたさなかった プレゼント */
 gf:{s:c=>`${/^[aeiou]/i.test(c.it.w)?'An':'A'} ${c.it.w}! ${pickBy(c,["It looks brand new.","It's in perfect shape.","Nobody has used it yet, right?"])} I can give you ${Z.half(c.it)} coins.`,j:c=>`${c.it.n}ね！ ${pickBy(c,["新品みたい。","きれいな ままね。","まだ だれも つかってないのね？"])} ${Z.half(c.it)}まいで 買えるわ。`,enter:c=>{c.sellP=Z.half(c.it)},o:[
  O("That sounds fair.",'fair',null,null,'eGf'),
  O("Could you pay a little more?",'more',null,null,'gfMore'),
  O("It was for someone, but I changed my mind.",null,"I see. Then I'll find it a happy new home.","そう。 じゃあ しあわせな 新しい 持ち主を さがすわね。",'gf2',{j:"だれかに あげる はずだったけど、 気が かわったんです。",if:c=>!c.cm,act:c=>{c.cm=1}}),
  O("I'll keep it, then.",'keepIt',null,null,'eKeep')]},
 gf2:{s:c=>`So, ${c.sellP} coins. How about it?`,j:c=>`それで、 ${c.sellP}まい。 どう？`,o:[
  O("That sounds fair.",'fair',null,null,'eGf'),
  O("Could you pay a little more?",'more',null,null,'gfMore'),
  O("I'll keep it, then.",'keepIt',null,null,'eKeep')]},
 gfMore:{s:c=>`Hmm... it IS a nice one. OK, ${Math.round(Z.half(c.it)*1.2)} coins.`,j:c=>`うーん… たしかに いい 品ね。 いいわ、 ${Math.round(Z.half(c.it)*1.2)}まい。`,enter:c=>{c.sellP=Math.round(Z.half(c.it)*1.2)},o:[
  O("It's a deal!",'deal',null,null,'eGf'),
  O("I'll keep it, then.",'keepIt',null,null,'eKeep')]},
 eGf:E(1,'プレゼントを 売った',c=>`Here are your ${c.sellP} coins. I'll wrap it up for someone special.`,c=>`はい、 ${c.sellP}まい。 だれか とくべつな 人の ために つつんで おくわね。`,'🎁','sellGift'),
 bot:{s:"Empty bottles! I love old bottles. I put flowers in them. How many do you have?",j:"からの びん！ 古い びんって 大好き。 花を さすの。 何本 あるの？",o:[
  O(c=>`I have ${Z.bottles()}.`,null,null,null,'botOffer',{j:c=>`${Z.bottles()}本 あります。`}),
  O("I have a million!",null,"A million?! My shop is too small! ...Really, how many?","100万本？！ お店に 入らないわ！ …ほんとは 何本？",'bot2',{ok:0,j:"100万本 あります！",fx:'🍾'})]},
 bot2:{s:"Really, how many?",j:"ほんとうは 何本？",o:[
  O(c=>`Sorry. I have ${Z.bottles()}.`,null,null,null,'botOffer',{j:c=>`ごめんなさい。 ${Z.bottles()}本です。`})]},
 botOffer:{s:c=>`I can pay 2 coins each. So that's ${Z.bottles()*2} coins.`,j:c=>`1本 2まいで 買えるわ。 ぜんぶで ${Z.bottles()*2}まいね。`,enter:c=>{c.per=2},o:[
  O("That sounds fair.",'fair',null,null,'eBot'),
  O("Could you pay a little more?",'more',null,null,'botMore'),
  O("Only two? They're magic bottles!",null,"Magic? Then they're too dangerous for my shop! Ha ha.","魔法？ それなら うちには あぶなすぎるわ！ あはは。",'botOffer2',{ok:0,j:"2まいだけ？ 魔法の びん なのに！",fx:'🪄'}),
  O("I'll keep them, then.",'keepIt',null,null,'eKeep',{j:"じゃあ、 自分で もっておきます。"})]},
 botOffer2:{s:"Two coins each. OK?",j:"1本 2まい。 いい？",o:[
  O("That sounds fair.",'fair',null,null,'eBot'),
  O("Could you pay a little more?",'more',null,null,'botMore')]},
 botMore:{s:c=>`Hmm... They ARE pretty. OK, 3 coins each. That's ${Z.bottles()*3} coins.`,j:c=>`うーん… たしかに きれいね。 いいわ、 1本 3まい。 ${Z.bottles()*3}まいよ。`,enter:c=>{c.per=3},o:[
  O("It's a deal!",'deal',null,null,'eBot')]},
 /* リク（家庭教師の バイト game/tutor.js）から もらった お礼の 品 */
 tg:{s:c=>`${c.it.a[0]} I can give you ${c.it.p} coins.`,j:c=>`${c.it.a[1]} ${c.it.p}まいで 買えるわ。`,enter:c=>{c.sellP=c.it.p},o:[
  O("That sounds fair.",'fair',null,null,'eTg'),
  O("Could you pay a little more?",'more',null,null,'tgMore'),
  O("A boy named Riku made it for me.",null,"Riku? He comes here to buy crayons! He's a sweet boy. Then I'll pay a little more.","リク？ よく クレヨンを 買いに 来る 子よ！ やさしい 子ね。 じゃあ 少し 多めに はらうわ。",'tgRiku',{j:"リクって 男の子が 作って くれたんです。",if:c=>!c.riku}),
  O("It's a treasure from the sea king!",null,"The sea king? Ha ha! Then the price is the same. Kings don't haggle.","海の 王さま？ あはは！ それでも 値段は 同じよ。 王さまは ねぎらないの。",'tg2',{ok:0,j:"海の 王さまの 宝物です！",pip:"King! King!",fx:'👑',if:c=>!c.king,act:c=>{c.king=1}}),
  O("I'll keep it, then.",'keepIt',null,null,'eKeep')]},
 tg2:{s:c=>`So, ${c.sellP} coins. How about it?`,j:c=>`それで、 ${c.sellP}まい。 どう？`,o:[
  O("That sounds fair.",'fair',null,null,'eTg'),
  O("Could you pay a little more?",'more',null,null,'tgMore'),
  O("I'll keep it, then.",'keepIt',null,null,'eKeep')]},
 tgRiku:{s:c=>`OK, ${c.sellP} coins. I'll put it in the window so he can see it.`,j:c=>`いいわ、 ${c.sellP}まい。 あの 子に 見えるように まどに かざるわね。`,enter:c=>{c.riku=1;c.sellP=c.it.p+2},o:[
  O("Thank you!",null,null,null,'eTgRiku',{j:"ありがとう！"}),
  O("I'll keep it, then.",'keepIt',null,null,'eKeep')]},
 tgMore:{s:c=>`Hmm... it IS made with love. OK, ${Math.round(c.it.p*1.2)} coins.`,j:c=>`うーん… 心を こめて 作って あるものね。 いいわ、 ${Math.round(c.it.p*1.2)}まい。`,enter:c=>{c.sellP=Math.round(c.it.p*1.2)},o:[
  O("It's a deal!",'deal',null,null,'eTg'),
  O("I'll keep it, then.",'keepIt',null,null,'eKeep')]},
 eTg:E(1,'お礼の 品を 売った',c=>`Here are your ${c.sellP} coins. Someone will love it.`,c=>`はい、 ${c.sellP}まい。 きっと だれかが 気に入るわ。`,'🎁','sellTg'),
 eTgRiku:E(1,'リクの まどかざり',c=>`Here are your ${c.sellP} coins. Riku will be so happy to see it here!`,c=>`はい、 ${c.sellP}まい。 ここに かざって あったら リク、 きっと よろこぶわ！`,'🖼️','sellTg'),
 bk:{s:c=>`Let me see... It's in good condition. I can give you ${Z.half(c.it)} coins.`,j:c=>`見せて… きれいね。 ${Z.half(c.it)}まいで 買えるわ。`,enter:c=>{c.sellP=Z.half(c.it)},o:[
  O("That sounds fair.",'fair',null,null,'eBk'),
  O("Could you pay a little more?",'more',null,null,'bkMore'),
  O(c=>`I paid ${c.it.p}! Give me ${c.it.p*2}!`,null,"Double?! Then I'd lose money! Ha ha. No, no.","2ばい？！ それじゃ 大赤字よ！ あはは。 だめ だめ。",'bk2',{ok:0,j:c=>`${c.it.p}まいで 買ったのに！ ${c.it.p*2}まい ちょうだい！`,pip:"No, no! No, no!",fx:'💰'}),
  O("I'll keep it, then.",'keepIt',null,null,'eKeep')]},
 bk2:{s:c=>`So, ${Z.half(c.it)} coins. How about it?`,j:c=>`それで、 ${Z.half(c.it)}まい。 どう？`,o:[
  O("That sounds fair.",'fair',null,null,'eBk'),
  O("Could you pay a little more?",'more',null,null,'bkMore'),
  O("I'll keep it, then.",'keepIt',null,null,'eKeep')]},
 bkMore:{s:c=>`Well... you take good care of your things. OK, ${Math.round(Z.half(c.it)*1.2)} coins.`,j:c=>`そうね… 大事に つかってたものね。 いいわ、 ${Math.round(Z.half(c.it)*1.2)}まい。`,enter:c=>{c.sellP=Math.round(Z.half(c.it)*1.2)},o:[
  O("It's a deal!",'deal',null,null,'eBk'),
  O("I'll keep it, then.",'keepIt',null,null,'eKeep')]},
 eBot:E(1,'びんを 売った',c=>`Here are your ${Z.bottles()*c.per} coins. My shop will be full of flowers!`,c=>`はい、 ${Z.bottles()*c.per}まい。 お店が 花で いっぱいに なるわ！`,'🌼','sellBottles'),
 eBk:E(1,'売れた！',c=>`Here are your ${c.sellP} coins. Thank you!`,c=>`はい、 ${c.sellP}まい。 ありがとう！`,'💰','sell'),
 eKeep:E(1,'売るのは やめた',"That's fine. Things you love should stay with you.","いいのよ。 好きな ものは 手元に おいておくのが いちばん。",'🤲'),
 eNo:E(1,'また こんど',"Bye! Come again!","またね！ また 来てね！",'👋'),
}},

/* ======================================================= 返品・交換 */
ret:{t:'返品・交換',start:'a',nodes:{
 a:{s:"Hi again! Is everything all right?",j:"また 来てくれたのね！ なにか あった？",o:[
  O("I'd like to return this.",'returnIt',null,null,'pick'),
  O("Can I exchange this?",'exchange',null,null,'pick',{act:c=>{c.ex=1}}),
  O("This book bit me!",null,"Bit you?! Books don't bite. ...Usually.","かんだ？！ 本は かまないわよ。 …ふつうは。",'a2',{ok:0,j:"この 本に かまれた！",pip:"Bite! Bite!",fx:'🦷'})]},
 a2:{s:"So, what's the matter?",j:"それで、 どうしたの？",o:[
  O("I'd like to return this.",'returnIt',null,null,'pick'),
  O("Can I exchange this?",'exchange',null,null,'pick',{act:c=>{c.ex=1}})]},
 pick:{go:c=>{const a=Z.returnable();if(a.length===1){c.it=a[0];return 'why'}return 'pick2'}},
 pick2:{s:"Which one?",j:"どれ？",o:c=>Z.returnable().slice(0,4).map(it=>O(`This ${it.title?'book, '+'"'+it.title+'"':it.w}.`,null,null,null,'why',{j:`この ${it.n}です。`,act:c=>{c.it=it}}))},
 why:{s:"Oh, I'm sorry. What's wrong with it?",j:"あら、 ごめんなさい。 どこか だめだった？",o:[
  O("I already have one.",'already',null,null,'rq'),
  O("I bought the wrong one.",'wrongOne',null,null,'rq'),
  O("It has too many words.",null,"Too many words? That's a book, dear! Ha ha.","ことばが 多すぎる？ それが 本って ものよ！ あはは。",'rq',{ok:0,j:"ことばが 多すぎます。",fx:'📚',if:c=>c.it.k==='book'})]},
 rq:{s:"I see. Do you have the receipt?",j:"そうなのね。 レシートは ある？",o:[
  O("Yes, here it is.",'hereIt',"Thank you.","ありがとう。",c=>c.ex?'exPick':'refund',{if:c=>Z.rcpt(c.it.id)}),
  O("Sorry, I lost it.",'lostIt',null,null,'noRc'),
  O("My parrot ate it.",null,"Your parrot? Pip, did you eat it?","オウムが？ ピップ、 あなた 食べた？",'rq2',{ok:0,j:"オウムが 食べちゃった。",pip:"Not me! Not me!",fx:'🦜'})]},
 rq2:{s:"Ha ha. So... do you have it?",j:"あはは。 それで… レシートは ある？",o:[
  O("Yes, here it is.",'hereIt',"Thank you.","ありがとう。",c=>c.ex?'exPick':'refund',{if:c=>Z.rcpt(c.it.id)}),
  O("Sorry, I lost it.",'lostIt',null,null,'noRc')]},
 refund:{s:c=>`Here's your money back: ${Z.paid(c.it.id)} coins.`,j:c=>`はい、 ${Z.paid(c.it.id)}まい お返しするわね。`,o:[
  O("Thank you!",null,null,null,'eRefund',{j:"ありがとう！"})]},
 noRc:{s:c=>`Hmm... Without a receipt, I can't give you all your money back. But I can buy it back for ${Z.half(c.it)} coins.`+(Z.exList(c).length?" Or you can exchange it.":''),j:c=>`うーん… レシートが ないと ぜんぶは 返せないの。 でも ${Z.half(c.it)}まいで 買いとれるわ。`+(Z.exList(c).length?' 交換でも いいわよ。':''),o:[
  O(c=>`OK. ${Z.half(c.it)} coins is fine.`,'fair',null,null,'eBuyBack',{j:c=>`はい。 ${Z.half(c.it)}まいで いいです。`}),
  O("Can I exchange it, then?",'exchange',null,null,'exPick',{if:c=>Z.exList(c).length>0,j:"じゃあ 交換できますか？"}),
  O("I'll keep it, then.",'keepIt',null,null,'eKeep')]},
 exPick:{s:c=>Z.exList(c).length?"Which one would you like instead?":"Oh... I'm afraid I have nothing to exchange it for.",j:c=>Z.exList(c).length?"かわりに どれが いい？":"あら… 交換できる ものが ないみたい。",o:c=>[
  ...Z.exList(c).slice(0,3).map(it=>O(`I'd like "${it.title}", please.`,null,null,null,cc=>Z.diff(cc)>0?'exPay':'eExch',{j:`「${it.n.replace(/^絵本/,'')}」を ください。`,act:cc=>{cc.to2=it}})),
  O("Then I'll keep it.",'keepIt',null,null,'eKeep',{j:"じゃあ、 もっておきます。"})]},
 exPay:{s:c=>`That one is ${Z.diff(c)} coins more. Is that OK?`,j:c=>`そっちは ${Z.diff(c)}まい 高いの。 いい？`,o:[
  O("Sure. Here you are.",null,null,null,'eExch',{j:"はい。 どうぞ。",if:c=>Z.coins()>=Z.diff(c)}),
  O("Then never mind.",null,null,null,'eKeep',{j:"じゃあ、 やめておきます。"})]},
 eRefund:E(1,'返品 できた',"No problem. Thanks for keeping the receipt!","だいじょうぶよ。 レシートを とっておいてくれて ありがとう！",'🧾','refund'),
 eBuyBack:E(1,'買いとって もらった',c=>`Here are ${Z.half(c.it)} coins. Next time, keep the receipt!`,c=>`はい、 ${Z.half(c.it)}まい。 こんどは レシートを とっておいてね！`,'🪙','buyback'),
 eExch:E(1,'交換 できた',c=>`Here's "${c.to2.title}". I hope you like this one!`,c=>`はい、 「${c.to2.n.replace(/^絵本/,'')}」。 こっちは 気に入ると いいな！`,'🔄','exch'),
 eKeep:E(1,'やっぱり もっておく',"Maybe you'll love it someday.","いつか 好きに なるかもね。",'🤲'),
}},

/* ======================================================= 🗺️ 月の 市場の 話（地図を 買うと 聞ける。ノラさんの 秘密） */
moon:{t:'月の 市場の ひみつ',start:'a',nodes:{
 a:{s:"So, you bought the map. Then you deserve the story. Sit down. Pip, be quiet for once.",j:"地図を 買ったのね。 じゃあ お話を 聞く しかくが あるわ。 すわって。 ピップ、 たまには しずかに してね。",pip:"Quiet! Quiet!",o:[
  O("When did you first go there?",null,"Forty years ago. I was young, lost, and very, very hungry.","40年前。 わかくて、 迷子で、 とっても とっても おなかが すいてたの。",'b',{j:"はじめて 行ったのは いつ？"}),
  O("Is the Moon Market real?",'genuine',"As real as you and me. Well... maybe a little less.","あなたや わたしと 同じくらい 本物よ。 まあ… もうちょっと あやふや かもね。",'b',{j:"月の 市場って 本当に あるの？"}),
  O("Can I go there tonight?",null,"Tonight? Ha ha! Patience. First, listen.","今夜？ あはは！ あせらないで。 まずは 聞いて。",'b',{j:"今夜 行ける？"})]},
 b:{s:"It was a night with a full moon. The sea was as still as glass. And then I saw lanterns on the beach where there had been nothing.",j:"満月の 夜だった。 海は ガラスみたいに 静かで。 そしたら、 なにも なかった 浜辺に ちょうちんが ならんでいたの。",o:[
  O("Weren't you scared?",null,"A little. But I was more curious than scared.","ちょっとね。 でも こわさより 知りたい 気持ちの ほうが 大きかった。",'c',{j:"こわく なかった？"}),
  O("What did they sell?",null,"Everything. Songs in jars, a key to yesterday, shoes that walk on water...","なんでも。 びんに 入った 歌、 きのうへの 鍵、 水の 上を 歩ける くつ…",'c2',{j:"なにを 売ってたの？"}),
  O("Were the sellers aliens?",null,"Aliens? No... but they had very long shadows and no faces at all.","宇宙人？ ちがうわ… でも、 とても 長い かげが あって、 顔が なかったの。",'c',{ok:0,j:"売り手は 宇宙人だった？",fx:'👽'})]},
 c:{s:"A seller with a long shadow said, 'Everything here costs one memory.' I had no money anyway, so I said yes.",j:"長い かげの 売り手が 言ったの。 『ここの ものは どれも 思い出 1つ』。 どうせ お金も なかったから、 いいわって 言った。",o:[
  O("What did you buy?",null,null,null,'d',{j:"なにを 買ったの？"}),
  O("Which memory did you give?",null,null,null,'d',{j:"どの 思い出を あげたの？"})]},
 c2:{s:"And everything cost one memory. Not money. One memory each. I had no money anyway.",j:"そして どれも お代は 思い出 1つ。 お金じゃ ないの。 どうせ お金も なかったし。",o:[
  O("What did you buy?",null,null,null,'d',{j:"なにを 買ったの？"}),
  O("I'd buy the shoes!",null,"Ha ha! Everyone says that. But think about what memory you'd lose.","あはは！ みんな そう言うわ。 でも、 どの 思い出を なくすか 考えてみて。",'d',{j:"ぼくなら くつを 買う！"})]},
 d:{s:"I bought a small green egg. And for it, I gave the memory of my tenth birthday.",j:"わたしは 小さな 緑の たまごを 買ったの。 その かわりに、 10さいの 誕生日の 思い出を あげた。",o:[
  O("A green egg? ...Wait. Pip?!",null,"Ha ha! You're sharp. The egg hatched the next morning.","あはは！ するどいわね。 その たまご、 つぎの 朝 かえったの。",'e',{j:"緑の たまご？ …まって。 ピップ？！"}),
  O("Do you regret it?",'',"Sometimes I wonder what that birthday was like. But no, I don't regret it.","その 誕生日が どんなだったか、 ときどき 気になるわ。 でも、 後悔は してない。",'e2',{j:"後悔してる？"}),
  O("Was the egg delicious?",null,"DELICIOUS?! ...Pip, cover your ears.","おいしかったか ですって？！ …ピップ、 耳を ふさいで。",'e',{ok:0,j:"たまご、 おいしかった？",pip:"Not food! Not food!",fx:'🍳'})]},
 e:{s:"Yes. Pip came out of that egg. He's been talking ever since. He's my best friend.",j:"そう。 ピップは あの たまごから 生まれたの。 それから ずっと しゃべりっぱなし。 わたしの 親友よ。",pip:"Best friend! Best friend!",o:[
  O("That's a wonderful story.",null,"Thank you. I've never told anyone before.","ありがとう。 だれにも 話したこと なかったの。",'f',{j:"すてきな 話だね。"}),
  O("Do you regret it?",null,"Never. One birthday for a lifetime friend? Easy choice.","ぜんぜん。 誕生日 1つで 一生の 友だち？ かんたんな えらびだわ。",'f',{j:"後悔してる？"})]},
 e2:{s:"Because the egg hatched, and out came... Pip. He's been talking ever since.",j:"だって たまごが かえって 出てきたのが… ピップ。 それから ずっと しゃべりっぱなし。",pip:"Hello! Hello!",o:[
  O("No way! Pip came from the Moon Market?",null,"Yes. That's why he never gets old.","そうよ。 だから 年を とらないの。",'f',{j:"うそ！ ピップは 月の 市場から 来たの？"})]},
 f:{s:"Now it's your turn. If you went to the Moon Market, which memory would you give?",j:"こんどは あなたの 番。 もし 月の 市場に 行ったら、 どの 思い出を あげる？",o:[
  O("Nothing. My memories are all important.",null,"That's a wise answer. Maybe the wisest.","かしこい 答えね。 いちばん かしこい かも。",'eWise',{j:"なにも。 思い出は ぜんぶ 大切だから。"}),
  O("The memory of my worst test score!",null,"Ha ha! Smart. Bad memories are cheap, though. The sellers might say no.","あはは！ かしこい。 でも いやな 思い出は 安いのよ。 ことわられる かもね。",'eTest',{j:"いちばん わるかった テストの 思い出！"}),
  O("I'd give it to buy an English brain!",null,"An English brain? You don't need the market for that. You're already building one, here.","英語の 脳？ それなら 市場は いらないわ。 あなたは もう ここで つくってるもの。",'eBrain',{j:"英語の 脳を 買うために あげる！"}),
  O("I'd trade it for another Pip!",null,"Two Pips?! The beach would never be quiet again!","ピップが 2羽？！ 浜辺が 二度と 静かに ならないわ！",'ePip',{ok:0,j:"もう 1羽 ピップが ほしい！",pip:"Two Pips! Two Pips!",fx:'🦜'})]},
 eWise:E(1,'思い出は 売らない',"Keep them all. And keep coming here. That will be a good memory, too.","ぜんぶ 大切に ね。 そして ここにも 来つづけて。 それも いい 思い出に なるわ。",'🌕'),
 eTest:E(1,'わるい 思い出を 売りたい',"Then study hard, so your next test score becomes a memory you'd never sell.","じゃあ がんばって、 つぎの テストを 売りたく ない 思い出に してね。",'📝'),
 eBrain:E(1,'英語の 脳は 自分で つくる',"Every word you learn is a little lantern. Soon your head will look like the Moon Market itself.","おぼえた ことば 1つ 1つが 小さな ちょうちん。 すぐに あなたの 頭は 月の 市場 そのものに なるわ。",'🏮'),
 ePip:E(0,'ピップが 2羽',"(Pip is very excited. Nora is holding her head.)","（ピップは 大よろこび。 ノラさんは 頭を かかえている）",'🦜'),
}},
};
};
