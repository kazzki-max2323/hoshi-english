/* ながれぎ雑貨店の「ラジオ・レコード・イベント」を 買う 会話（品物は game/zakka-goods.js）。
   品物の レベルで 会話の かたちが かわる:
   - gEs 小: みじかい 文。「Can I listen?」「How much is it?」「Can you make it cheaper?」「Here you are.」
   - gJh 中: ていねいな たのみ方・まよう・安い ものを きく。「Could I listen to it first?」「Do you have anything cheaper?」「Will it still be here tomorrow?」
   - gHs 高: とても ていねいな 言い方・物語を きく・2つで まよう・ねばって ねぎる。「Would you mind if I…?」「I was wondering if you could…」「I'm torn between…」
   - gOwn: もっている ラジオ・曲を 売る（レベルに あわせて ことばが かわる）
   どの 品物でも、その 品物 だけの 質問・おもしろい まちがい・ひとこと（zakka-goods.js の q / f / e / x）が 入る。
   ZAKKA_GOODS_TALK(Z) を game/zakka.js が よんで、ZAKKA_TALK の 場面に 足す */
const ZAKKA_GOODS_TALK=Z=>{
const PH=ZAKKA_PHRASES;
const O=(e,ph,r,rj,nx,x={})=>Object.assign({e,ph,r,rj,nx,j:x.j||(ph&&PH[ph]?PH[ph][1]:''),ok:x.ok===0?0:1},x);
const E=(good,t,s,j,fx,act)=>({end:1,good,t,s,j,fx,act});
const P=c=>Z.price(c);
const pickBy=(c,a)=>a[c.seed%a.length];
const NM=it=>it.kind==='music'?`"${it.en}"`:`the ${it.en}`;            // "Star Cradle" / the whale
const NJ=it=>it.kind==='music'?`「${it.n}」`:it.n;
const L=(c,a)=>a[{es:0,jh:1,hs:2}[c.it.lv]||0];                         // the words by the item's level
/* the item's own lines */
const Q=(nx,x={})=>O(c=>c.it.q[0],null,c=>c.it.q[2],c=>c.it.q[3],nx,Object.assign({j:c=>c.it.q[1],if:c=>!c.q,act:c=>{c.q=1}},x));
const F=(nx,x={})=>O(c=>c.it.f[0],null,c=>c.it.f[2],c=>c.it.f[3],nx,Object.assign({ok:0,j:c=>c.it.f[1],pip:c=>c.it.f[4]||null,fx:'😂',if:c=>!c.fun,act:c=>{c.fun=1}},x));
const isM=c=>c.it.kind==='music',isE=c=>c.it.kind==='event',isR=c=>c.it.kind==='radio';
/* when a timed event can be seen: "only at night" */
const TW={night:'at night',sunset:'at sunset',dawn:'at dawn',morning:'in the morning',noon:'around noon',evening:'in the evening'};
const TJ={night:'夜',sunset:'夕暮れ',dawn:'夜明け',morning:'朝',noon:'昼',evening:'夕方'};
const tw=c=>c.it.t?c.it.t.map(x=>TW[x]).filter((v,i,a)=>a.indexOf(v)===i).join(' or '):'';
const tj=c=>c.it.t?c.it.t.map(x=>TJ[x]).join('・'):'';

return {
/* =============================================================== 小 */
gEs:{t:'ラジオ・レコード・イベント（小）',start:'a',nodes:{
 a:{s:c=>`${pickBy(c,["Hi!","Hello!","Look!"])} ${c.it.d[0]}`,j:c=>`${pickBy(c,["こんにちは！","いらっしゃい！","見て！"])} ${c.it.d[1]}`,o:[
  Q('b'),
  O("Can I listen?",'listen',"Sure! Here you go.","いいわよ！ どうぞ。",'b',{if:c=>isM(c)&&!c.pv,act:c=>Z.preview(c)}),
  O("When can I see it?",'whenSee',c=>`Right now! Buy it, then go to the beach.${c.it.t?` You're lucky. You can only see it ${tw(c)}.`:''}`,c=>`いますぐよ！ 買って、 浜辺に 行ってね。${c.it.t?` ラッキーね。 ${tj(c)}にしか 見られないの。`:''}`,'b',{if:c=>isE(c)&&!c.when,act:c=>{c.when=1}}),
  O("How much is it?",'howMuch',null,null,'price'),
  F('a2')]},
 a2:{s:"So... do you like it?",j:"それで… 気に入った？",o:[
  O("Yes! How much is it?",'howMuch',null,null,'price',{j:"うん！ いくら？"}),
  Q('b'),
  O("No, thank you.",'noThanks',"OK! Come again.","わかった！ また 来てね。",'eNo')]},
 b:{s:"Do you like it?",j:"気に入った？",o:[
  O("Yes, I like it!",'likeIt',"Me too!","わたしも！",'price'),
  Q('b'),
  O("Can I listen?",'listen',"Sure! Here you go.","いいわよ！ どうぞ。",'b',{if:c=>isM(c)&&!c.pv,act:c=>Z.preview(c)}),
  O("How much is it?",'howMuch',null,null,'price'),
  O("Not today. Bye!",'notToday',"OK. See you!","わかった。 またね！",'eNo')]},
 price:{go:c=>c.it.p?'price0':'free'},
 free:{s:"It's free! Do you want one?",j:"ただよ！ ほしい？",o:[
  O("Yes, please!",'yesPlease',"Here you are!","はい、 どうぞ！",'eBuy'),
  O("Really? It's free? Thank you!",null,"Yes, really! It's a present from me.","ええ、 本当よ！ わたしからの プレゼント。",'eBuy',{j:"本当？ ただなの？ ありがとう！"}),
  O("Can I have ten?",null,"Ten?! Only one, please!","10こ？！ 1つだけよ！",'free',{ok:0,j:"10こ もらえる？",pip:"One! One!",fx:'😅',if:c=>!c.ten,act:c=>{c.ten=1}})]},
 price0:{s:c=>`It's ${P(c)} coins.`,j:c=>`${P(c)}まいよ。`,o:[
  O("OK! I'll take it.",'takeIt',"Thank you!","ありがとう！",'payq',{j:"よし！ これに します。"}),
  O("Can you make it cheaper?",'cheaperPls',null,null,'cheap',{if:c=>!c.disc}),
  O("Can I pay with candy?",null,"Candy? I like candy... but no! Coins, please.","あめ？ あめは 好きだけど… だめ！ コインで おねがい。",'price0',{ok:0,j:"あめで はらえる？",pip:"Candy! Candy!",fx:'🍬',if:c=>!c.candy,act:c=>{c.candy=1}}),
  O("I'll come back later.",'comeBack',null,null,'eLater')]},
 cheap:{s:c=>`Hmm... OK! ${P(c)} coins. Just for you!`,j:c=>`うーん… いいわ！ ${P(c)}まい。 あなただけ とくべつよ！`,enter:c=>{c.disc=.1},o:[
  O("Thank you! I'll take it.",'takeIt',"You're welcome!","どういたしまして！",'payq',{j:"ありがとう！ これに します。"}),
  O("I'll come back later.",'comeBack',null,null,'eLater')]},
 payq:{go:c=>Z.coins()<P(c)?'nomoney':'pay'},
 pay:{s:c=>`${P(c)} coins, please.`,j:c=>`${P(c)}まい ください。`,o:[
  O("Here you are.",'hereYouAre',"Thank you!","ありがとう！",c=>c.disc?'eDeal':'eBuy'),
  O("Can I pay with a hug?",null,"A hug? Aww... But I need coins, too!","ハグ？ あら… でも コインも いるのよ！",'eHug',{ok:0,j:"ハグで はらえる？",fx:'🤗'})]},
 nomoney:{s:c=>`Oh no! You have ${Z.coins()} coins. You need ${P(c)-Z.coins()} more.`,j:c=>`あら！ ${Z.coins()}まいしか ないわ。 あと ${P(c)-Z.coins()}まい いるの。`,o:[
  O("Can you make it cheaper?",'cheaperPls',null,null,'cheap',{if:c=>!c.disc}),
  O("I'll come back later.",'comeBack',null,null,'eLater')]},
 eBuy:E(1,'買えた！',c=>`Here you are. ${c.it.e[0]}`,c=>`はい、 どうぞ。 ${c.it.e[1]}`,'🛍️','gbuy'),
 eDeal:E(1,'やすく して もらえた',c=>`Just for you! ${c.it.e[0]}`,c=>`あなただけよ！ ${c.it.e[1]}`,'🏷️','gbuy'),
 eLater:E(1,'また あとで',"OK! Come back soon.","わかった！ また すぐ 来てね。",'👋'),
 eNo:E(1,'見るだけ',"Thank you for looking. Bye!","見てくれて ありがとう。 バイバイ！",'👀'),
 eHug:E(0,'ハグで はらおうとした',"(Nora gives you a big hug... but no item. Pip is laughing.)","（ノラさんは ぎゅっと ハグして くれた… でも 品物は なし。 ピップが わらってる）",'🤗'),
}},

/* =============================================================== 中 */
gJh:{t:'ラジオ・レコード・イベント（中）',start:'a',nodes:{
 a:{s:c=>`${pickBy(c,["Hi there!","Welcome back!",`Good ${Z.part()}!`])} ${c.it.d[0]}`,j:c=>`${pickBy(c,["いらっしゃい！","また 来てくれたのね！",`${Z.partJ()}！`])} ${c.it.d[1]}`,o:[
  Q('b'),
  O("Could I listen to it first?",'listenFirst',"Of course. Here's a little of it.","もちろん。 ちょっと ながすわね。",'b',{if:c=>isM(c)&&!c.pv,act:c=>Z.preview(c)}),
  O("When does it start?",'whenStart',c=>`Right after you buy it. Just go back to the beach.${c.it.t?` And you're lucky. It can only be seen ${tw(c)}.`:''}`,c=>`買ったら すぐよ。 浜辺に もどってね。${c.it.t?` それに ラッキーよ。 ${tj(c)}にしか 見られないの。`:''}`,'b',{if:c=>isE(c)&&!c.when,act:c=>{c.when=1}}),
  O("How do I use it?",'howUse',"Just put it on the beach. It says something in English, and you choose the meaning.","浜辺に おくだけ。 英語で なにか 言うから、 いみを えらぶの。",'b',{if:c=>isR(c)&&!c.use,act:c=>{c.use=1}}),
  O("How much is it?",'howMuch',null,null,'price'),
  F('a2')]},
 a2:{s:"Anyway, what do you think of it?",j:"それで、 どう 思う？",o:[
  Q('b'),
  O("How much is it?",'howMuch',null,null,'price'),
  O("I'll think about it.",'think',"Sure. Take your time.","ええ。 ゆっくり 考えてね。",'eThink')]},
 b:{s:"What do you think?",j:"どう？",o:[
  O("I really like it.",'reallyLike',"I'm glad to hear that.","よかった。",'price'),
  Q('b'),
  O("Could I listen to it first?",'listenFirst',"Of course. Here's a little of it.","もちろん。 ちょっと ながすわね。",'b',{if:c=>isM(c)&&!c.pv,act:c=>Z.preview(c)}),
  O("Do you have anything cheaper?",'cheaper',null,null,'alt',{if:c=>!c.alt&&!!Z.alt(c)}),
  O("How much is it?",'howMuch',null,null,'price'),
  O("I'll think about it.",'think',"Sure. Take your time.","ええ。 ゆっくり 考えてね。",'eThink')]},
 alt:{s:c=>`Then how about ${NM(c.it)}? It's only ${c.it.p} coins. ${c.it.d[0]}`,j:c=>`じゃあ ${NJ(c.it)}は どう？ ${c.it.p}まい だけよ。 ${c.it.d[1]}`,enter:c=>{c.alt=1;c.prev=c.it;c.it=Z.alt(c.prev);c.q=0;c.fun=0;c.pv=0;c.when=0},o:[
  O("I'll take this one.",'takeIt',"Good choice!","いい えらび方ね！",'price',{j:"こっちに します。"}),
  Q('alt2'),
  O("Actually, I like the first one better.",null,"I understand. It's a little more, but it's special.","わかるわ。 ちょっと 高いけど、 とくべつだものね。",'price',{j:"やっぱり さいしょのが いいです。",act:c=>{c.it=c.prev}})]},
 alt2:{s:"So, this one or the first one?",j:"それで、 こっち？ それとも さいしょの？",o:[
  O("I'll take this one.",'takeIt',"Good choice!","いい えらび方ね！",'price',{j:"こっちに します。"}),
  O("Actually, I like the first one better.",null,"Of course.","いいわよ。",'price',{j:"やっぱり さいしょのが いいです。",act:c=>{c.it=c.prev}})]},
 price:{go:c=>c.it.p?'price0':'@gEs:free'},
 price0:{s:c=>`It's ${P(c)} coins.`,j:c=>`${P(c)}まいよ。`,o:[
  O("I'll take it.",'takeIt',"Thank you!","ありがとう！",'payq'),
  O("Could you give me a discount?",'discount',null,null,'disc',{if:c=>!c.disc}),
  O("Will it still be here tomorrow?",'tomorrow',c=>isR(c)?"Radios are always on my shelf. But today is a good day to start!":"I'm not sure. My shelf changes every day, and at different times of day, too.",c=>isR(c)?"ラジオは いつも たなに あるわ。 でも はじめるなら きょうが いい 日よ！":"わからないわ。 うちの たなは 毎日、 それに 時間帯でも 入れかわるの。",'price0',{if:c=>!c.tm,act:c=>{c.tm=1}}),
  O("Can I pay next year?",null,"Next year?! Ha ha! Come back with coins, OK?","来年？！ あはは！ コインを もって また 来てね。",'eNext',{ok:0,j:"来年 はらっても いい？",pip:"Next year! Next year!",fx:'📅'}),
  O("I'll think about it.",'think',"Sure. Take your time.","ええ。 ゆっくり 考えてね。",'eThink')]},
 disc:{s:c=>`Well... since you asked politely, I'll give you 10% off. That's ${P(c)} coins.`,j:c=>`そうね… ていねいに たのんでくれたから、 1わり びきに するわ。 ${P(c)}まいよ。`,enter:c=>{c.disc=.1},o:[
  O("Great! I'll take it.",'takeIt',"Thank you!","ありがとう！",'payq',{j:"やった！ これに します。"}),
  O("I'll think about it.",'think',"Sure. Take your time.","ええ。 ゆっくり 考えてね。",'eThink')]},
 payq:{go:c=>Z.coins()<P(c)?'nomoney':'pay'},
 pay:{s:c=>`That'll be ${P(c)} coins, please.`,j:c=>`${P(c)}まいに なります。`,o:[
  O("Here you are.",'hereYouAre',"Thank you very much!","どうも ありがとう！",c=>c.disc?'eDeal':'eBuy'),
  O("Can I pay later?",'payLater',"Sorry, dear. I need the coins now.","ごめんね。 いま コインが いるの。",'pay',{if:c=>!c.later,act:c=>{c.later=1}}),
  O("Here are some seashells.",null,"Seashells? They're pretty, but they're not money here!","貝がら？ きれいだけど、 ここでは お金じゃ ないの！",'pay',{ok:0,j:"貝がらで いい？",pip:"Shells! Shells!",fx:'🐚',if:c=>!c.shell,act:c=>{c.shell=1}})]},
 nomoney:{s:c=>`Oh dear. You're ${P(c)-Z.coins()} coins short.`,j:c=>`あら。 ${P(c)-Z.coins()}まい たりないわ。`,o:[
  O("Could you put it aside for me?",'putAside',c=>isR(c)?"You don't need to worry. Radios are always here. Come back when you have the coins!":"I'm sorry, I can't. The shelf changes, so it might be gone. Come back soon!",c=>isR(c)?"しんぱい いらないわ。 ラジオは いつも あるの。 コインが たまったら 来てね！":"ごめんね、 それは できないの。 たなが 入れかわるから、 なくなってるかも。 はやめに 来てね！",'eLater'),
  O("Could you give me a discount?",'discount',null,null,'disc',{if:c=>!c.disc}),
  O("I'll come back later.",'comeBack',null,null,'eLater')]},
 eBuy:E(1,'買えた！',c=>`Here you are. ${c.it.e[0]}`,c=>`はい、 どうぞ。 ${c.it.e[1]}`,'🛍️','gbuy'),
 eDeal:E(1,'1わり びきで 買えた',c=>`10% off, just for you. ${c.it.e[0]}`,c=>`あなただけ 1わり びきよ。 ${c.it.e[1]}`,'🏷️','gbuy'),
 eThink:E(1,'ゆっくり 考える',"Take your time. Good things are worth thinking about.","ゆっくりね。 いい ものは 考える かちが あるわ。",'🤔'),
 eLater:E(1,'コインを ためて また 来る',"See you later! Good luck with your coins.","また あとでね！ コイン、 がんばってね。",'👋'),
 eNext:E(0,'来年 はらいます',"(Nora laughs and puts it back on the shelf. Pip keeps saying \"Next year!\")","（ノラさんは わらって たなに もどした。 ピップは 「来年！」と 言いつづけている）",'📅'),
}},

/* =============================================================== 高 */
gHs:{t:'ラジオ・レコード・イベント（高）',start:'a',nodes:{
 a:{s:c=>`${pickBy(c,["Ah, you have a good eye.","That's one of my favorites.","I was hoping someone would notice that."])} ${c.it.d[0]}`,j:c=>`${pickBy(c,["あら、 お目が 高いわね。","それ、 わたしの お気に入りの ひとつなの。","だれか 気づいて くれないかなって 思ってたの。"])} ${c.it.d[1]}`,o:[
  Q('b'),
  O("Would you mind if I listened to a bit of it first?",'mindIf',"Not at all. Here's the opening.","ぜんぜん。 はじめの ところよ。",'b',{if:c=>isM(c)&&!c.pv,act:c=>Z.preview(c)}),
  O("How long does it last?",'howLong',c=>(c.it.sec?`About ${c.it.sec} seconds. Long enough to remember for a lifetime.`:"Only a moment, so don't blink.")+(c.it.t?` And it can only be seen ${tw(c)}, so now is your chance.`:''),c=>(c.it.sec?`${c.it.sec}びょう くらい。 一生 おぼえていられる くらいの 長さよ。`:'一瞬よ。 まばたき しないでね。')+(c.it.t?` それに ${tj(c)}にしか 見られないから、 いまが チャンスよ。`:''),'b',{if:c=>isE(c)&&!c.when,act:c=>{c.when=1}}),
  O("Is there a story behind it?",'story',c=>c.it.x[0],c=>c.it.x[1],'b',{if:c=>c.it.x&&!c.st,act:c=>{c.st=1}}),
  O("How much is it?",'howMuch',null,null,'price'),
  F('a2')]},
 a2:{s:"Anyway, where were we?",j:"それで、 なんの 話だったかしら？",o:[
  Q('b'),
  O("Is there a story behind it?",'story',c=>c.it.x[0],c=>c.it.x[1],'b',{if:c=>c.it.x&&!c.st,act:c=>{c.st=1}}),
  O("How much is it?",'howMuch',null,null,'price')]},
 b:{s:"So, what do you think?",j:"それで、 どう？",o:[
  O("I've been looking for something like this.",'lookingFor',"Then it was meant to be.","じゃあ 運命ね。",'price'),
  O("I'm torn between this and something else.",'torn',null,null,'torn',{if:c=>!c.alt&&!!Z.alt(c)}),
  O("How much is it?",'howMuch',null,null,'price',{if:c=>!!c.alt||!Z.alt(c)}),
  Q('b'),
  O("Is there a story behind it?",'story',c=>c.it.x[0],c=>c.it.x[1],'b',{if:c=>c.it.x&&!c.st,act:c=>{c.st=1}}),
  O("I'd rather wait until it goes on sale.",'onSale',c=>isR(c)?"I don't really have sales, I'm afraid. But radios are always on my shelf, so take your time.":"I don't really have sales. But the shelf changes with the time of day, so it might not be here when you come back.",c=>isR(c)?"うちは セールは しないの。 でも ラジオは いつも たなに あるから、 ゆっくり 考えてね。":"うちは セールは しないのよ。 でも たなは 時間帯で 入れかわるから、 つぎに 来た 時には ないかもしれないわ。",'b2',{if:c=>!c.sale,act:c=>{c.sale=1}}),
  O("Let me sleep on it.",'think',"Of course. Big decisions deserve time.","もちろん。 大きな ことは よく 考えないとね。",'eThink',{j:"ひと晩 考えさせて ください。"})]},
 b2:{s:"Is there anything else you'd like to know?",j:"ほかに 知りたい ことは ある？",o:[
  O("No. I've been looking for something like this.",'lookingFor',"Then it was meant to be.","じゃあ 運命ね。",'price',{j:"いいえ。 こういうのを ずっと さがしていたんです。"}),
  O("How much is it?",'howMuch',null,null,'price'),
  O("Let me sleep on it.",'think',"Of course.","もちろん。",'eThink',{j:"ひと晩 考えさせて ください。"})]},
 torn:{s:c=>{const a=c.other;return `Let me guess... ${NM(a)}? It's ${a.p} coins. It's cheaper, but this one is something special. It depends on what you're looking for.`},
   j:c=>{const a=c.other;return `あててみましょうか… ${NJ(a)}？ ${a.p}まいよ。 そっちは 安いけど、 こっちは とくべつなの。 なにを もとめてるか しだいね。`},enter:c=>{c.alt=1;c.other=Z.alt(c)},o:[
  O("I'll go with this one.",'goWith',"I think you won't regret it.","後悔しないと 思うわ。",'price'),
  O("I think I'll go with the cheaper one.",null,"A sensible choice.","かしこい えらび方ね。",'price',{j:"安い ほうに しようと 思います。",act:c=>{c.it=c.other;c.q=0;c.st=0}}),
  O("Could I have both for the price of one?",null,"Both for one? You'd make a fine merchant... but no.","2つで 1つの 値段？ あなた、 いい 商人に なれるわ… でも だめ。",'torn2',{ok:0,j:"2つで 1つの 値段に できる？",pip:"No deal! No deal!",fx:'😏'})]},
 torn2:{s:"So, which will it be?",j:"それで、 どっちに する？",o:[
  O("I'll go with this one.",'goWith',"I think you won't regret it.","後悔しないと 思うわ。",'price'),
  O("I think I'll go with the cheaper one.",null,"A sensible choice.","かしこい えらび方ね。",'price',{j:"安い ほうに しようと 思います。",act:c=>{c.it=c.other;c.q=0;c.st=0}})]},
 price:{go:c=>c.it.p?'price0':'@gEs:free'},
 price0:{s:c=>`It's ${P(c)} coins.`,j:c=>`${P(c)}まいよ。`,o:[
  O("I'll take it.",'takeIt',"Wonderful.","すてき。",'payq'),
  O("I was wondering if you could knock a little off the price.",'knockOff',null,null,'disc',{if:c=>!c.disc}),
  O("Is it worth it?",'worthIt',"Only you can decide that. But I only put things on my shelf that I'd buy myself.","それは あなたが 決めること。 でも わたしは 自分でも 買いたい ものしか たなに おかないの。",'price0',{if:c=>!c.worth,act:c=>{c.worth=1}}),
  O("Could I trade you my homework for it?",null,"Your homework? Tempting, but I finished school a long time ago, thank you.","宿題？ そそられるけど、 学校は とっくに 卒業したの。 ありがとう。",'eHw',{ok:0,j:"宿題と 交換できる？",pip:"Homework! Homework!",fx:'📝'}),
  O("Let me sleep on it.",'think',"Of course. Big decisions deserve time.","もちろん。 大きな ことは よく 考えないとね。",'eThink',{j:"ひと晩 考えさせて ください。"})]},
 disc:{s:c=>`Well... I suppose I could take 10% off. That would make it ${P(c)} coins.`,j:c=>`そうね… 1わり びきなら できるかしら。 ${P(c)}まいに なるわ。`,enter:c=>{c.disc=.1},o:[
  O("That's very kind of you. I'll take it.",'kindOf',"My pleasure.","どういたしまして。",'payq',{j:"ご親切に ありがとう。 これに します。"}),
  O("Could you go a little lower?",'lower',null,null,()=>Z.visits()>=3?'disc2':'discNo',{if:c=>c.disc<.15}),
  O("Let me sleep on it.",'think',"Of course.","もちろん。",'eThink',{j:"ひと晩 考えさせて ください。"})]},
 disc2:{s:c=>`You drive a hard bargain. Fine, 15% off, since you're a regular. ${P(c)} coins, and that's my limit.`,j:c=>`あなた、 ねばるわね。 いいわ、 常連さんだから 15%びき。 ${P(c)}まい。 これが 限界よ。`,enter:c=>{c.disc=.15},o:[
  O("It's a deal. Thank you!",'deal',"You're welcome.","どういたしまして。",'payq',{j:"きまり。 ありがとう！"}),
  O("Let me sleep on it.",'think',"Of course.","もちろん。",'eThink',{j:"ひと晩 考えさせて ください。"})]},
 discNo:{s:"I'm afraid that's as low as I can go. Come by more often, and maybe next time.",j:"ざんねんだけど、 それが 限界なの。 もっと 来てくれたら、 つぎは もしかしたらね。",o:[
  O("Fair enough. I'll take it.",'fairEnough',"Thank you.","ありがとう。",'payq',{j:"それなら しかたないですね。 これに します。"}),
  O("Let me sleep on it.",'think',"Of course.","もちろん。",'eThink',{j:"ひと晩 考えさせて ください。"})]},
 payq:{go:c=>Z.coins()<P(c)?'nomoney':'pay'},
 pay:{s:c=>`That comes to ${P(c)} coins.`,j:c=>`${P(c)}まいに なります。`,o:[
  O("Here you go.",'hereYouGo',"Thank you.","ありがとう。",'fin'),
  O("Here you go. Keep the change!",null,"Keep the change? You gave me the exact amount, dear! Ha ha.","おつりは とっておいて？ ちょうど だったわよ！ あはは。",'fin',{ok:0,j:"どうぞ。 おつりは とっておいて！",fx:'🪙'})]},
 fin:{go:c=>c.disc>=.15?'eBest':c.disc?'eDeal':'eBuy'},
 nomoney:{s:c=>`I'm afraid you're ${P(c)-Z.coins()} coins short.`,j:c=>`ざんねんだけど、 ${P(c)-Z.coins()}まい たりないわ。`,o:[
  O("Would it be possible to reserve it?",'reserve',c=>isR(c)?"No need. Radios never leave my shelf. It'll be waiting for you.":"I wish I could, but the shelf has a mind of its own. Come back and see if it's still here.",c=>isR(c)?"その ひつようは ないわ。 ラジオは ずっと たなに あるもの。 待ってるわよ。":"そう したいけど、 たなは 気まぐれなの。 また 来て、 まだ あるか 見てみてね。",'eLater'),
  O("I was wondering if you could knock a little off the price.",'knockOff',null,null,'disc',{if:c=>!c.disc}),
  O("Never mind. I'll save up.",'saveUp',null,null,'eSave',{j:"やっぱり いいです。 お金を ためます。"})]},
 eBuy:E(1,'買えた！',c=>`Here you are. ${c.it.e[0]}`,c=>`はい、 どうぞ。 ${c.it.e[1]}`,'🛍️','gbuy'),
 eDeal:E(1,'ていねいに ねぎれた',c=>`10% off, as promised. ${c.it.e[0]}`,c=>`やくそく どおり 1わり びきよ。 ${c.it.e[1]}`,'🏷️','gbuy'),
 eBest:E(1,'常連の 15%びき',c=>`15% off. Don't tell the other customers. ${c.it.e[0]}`,c=>`15%びきよ。 ほかの お客さんには ないしょね。 ${c.it.e[1]}`,'🏆','gbuy'),
 eThink:E(1,'ひと晩 考える',"Take your time. The best purchases are the ones you never regret.","ゆっくり 考えてね。 いちばんの 買いものは、 後悔しない 買いものよ。",'🌙'),
 eLater:E(1,'また 来る',"I'll keep my fingers crossed for you.","うまく いくように いのってるわ。",'🤞'),
 eSave:E(1,'コインを ためる',"That's the spirit. Saving up makes it even more special.","その いきよ。 ためて 買うと、 もっと とくべつに なるわ。",'💪'),
 eHw:E(0,'宿題で はらおうとした',"(Nora hands your homework back with a smile. \"Finish it first, dear.\")","（ノラさんは にっこり 宿題を かえした。 「まずは それを おわらせなさい」）",'📝'),
}},

/* =============================================================== もっている ラジオ・曲を 売る */
gOwn:{t:'ラジオ・レコードを 売る',start:'a',nodes:{
 a:{s:c=>L(c,[`Hi! How is your ${c.it.en}?`,`How do you like your ${isM(c)?'record, '+NM(c.it):c.it.en}?`,`How are you getting on with your ${isM(c)?'record, '+NM(c.it):c.it.en}?`]),
   j:c=>`${NJ(c.it)}、 どう？`,o:[
  O(c=>L(c,["I love it!","I really like it.","It's been wonderful."]),'loveIt',c=>L(c,["Yay! I'm happy.","I'm glad to hear that.","That's music to my ears."]),c=>L(c,["やった！ うれしいわ。","それは よかった。","それは うれしい ことばね。"]),'eKeep',{j:c=>L(c,["大好き！","とても 気に入ってます。","すばらしいです。"])}),
  O(c=>L(c,["I want to sell it.","I'd like to sell it back.","I'd like to sell it back, if that's all right."]),'sellBack',null,null,'offer',{j:"買いとって ほしいです。"}),
  O("It talks too much!",null,"Ha ha! Just like Pip.","あはは！ ピップと おなじね。",'a',{ok:0,j:"しゃべりすぎる！",pip:"Not me! Not me!",fx:'🦜',if:c=>isR(c)&&!c.tm,act:c=>{c.tm=1}}),
  O("Pip keeps singing it!",null,"Oh no. He sings it in the shower, too.","あら。 ピップったら おふろでも 歌うのよ。",'a',{ok:0,j:"ピップが ずっと 歌ってる！",pip:"La la la!",fx:'🦜',if:c=>isM(c)&&!c.tm,act:c=>{c.tm=1}})]},
 offer:{go:c=>c.it.p?'offer0':'free'},
 free:{s:"It was free, so I can't pay you. But I can take it back. Is that OK?",j:"ただだったから、 お金は はらえないの。 でも ひきとる ことは できるわ。 いい？",o:[
  O("OK. Here you are.",'hereYouAre',"Thank you.","ありがとう。",'eSold',{j:"うん。 はい、 どうぞ。"}),
  O("I'll keep it, then.",'keepIt',null,null,'eKeep')]},
 offer0:{s:c=>L(c,[`OK. I can pay ${Z.half(c.it)} coins.`,`I can pay ${Z.half(c.it)} coins for it. That's half the price.`,`I can offer you ${Z.half(c.it)} coins. That's half of what it costs new.`]),
   j:c=>`${Z.half(c.it)}まいで 買いとれるわ。 半分の 値段ね。`,enter:c=>{c.sellP=Z.half(c.it)},o:[
  O("OK. Here you are.",'hereYouAre',"Thank you.","ありがとう。",'eSold',{j:"うん。 はい、 どうぞ。"}),
  O("Could you pay a little more?",'more',c=>L(c,["Sorry! Half is my rule.","Sorry, half is my rule for used things.","I'm afraid half is my rule for anything secondhand."]),c=>`ごめんね、 中古は 半分って 決めてるの。`,'offer2',{if:c=>!c.more,act:c=>{c.more=1}}),
  O("I'll keep it, then.",'keepIt',null,null,'eKeep')]},
 offer2:{s:c=>`So, ${Z.half(c.it)} coins. OK?`,j:c=>`それで、 ${Z.half(c.it)}まい。 いい？`,o:[
  O("OK. Here you are.",'hereYouAre',"Thank you.","ありがとう。",'eSold',{j:"うん。 はい、 どうぞ。"}),
  O("I'll keep it, then.",'keepIt',null,null,'eKeep')]},
 eSold:E(1,'売った',c=>c.sellP?`Here are your ${c.sellP} coins. I'll find it a good new home.`:"Thank you. I'll find it a good new home.",c=>c.sellP?`はい、 ${c.sellP}まい。 いい 新しい 持ち主を さがすわね。`:'ありがとう。 いい 新しい 持ち主を さがすわね。','💰','gsell'),
 eKeep:E(1,'やっぱり もっておく',"Good. Things you love should stay with you.","よかった。 好きな ものは 手元に おいておくのが いちばん。",'🤲'),
}},
};
};
