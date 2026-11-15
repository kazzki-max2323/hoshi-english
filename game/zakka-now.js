/* 🎶 ながれぎ雑貨店の BGM: 「いま ながれている 曲」の 会話（game/zakka.js の レコードの タブの ボタンから）。
   - 雑貨屋では 毎日・浜辺の 時間帯ごとに ちがう 曲が 小さめ（40%）に ながれる。 曲は ノラさんが その 時間に あう ものを えらぶ
   - ボタンを おすと ノラさんと その 曲の ことを 英語で 話せる（曲の 説明・えらんだ わけ・曲だけの 質問・おもしろい まちがい）
   - 「Can I buy this song?」で そのまま 買える（曲の レベルの 買いもの 会話 gEs / gJh / gHs の 値段の ところへ つづく）。 もっている 曲なら 「もう もってるわね」
   ZAKKA_NOW_TALK(Z) を game/zakka.js が よんで、 ほかの 会話と いっしょに する */
Object.assign(ZAKKA_PHRASES,{
 whatSong:["What's this song?","これ、 なんて 曲ですか？","お店で ながれている 曲が 気に なった とき"],
 whyPick:["Why did you pick this song?","どうして この 曲を えらんだんですか？","えらんだ わけを きく とき"],
 buySong:["Can I buy this song?","この 曲、 買えますか？","ながれている 曲を ほしく なった とき"],
 loveSong:["I love this song.","この 曲、 大好きです。","曲が 気に入った ことを つたえる とき"],
 justListen:["I'll just listen for a while.","しばらく 聞いているだけに します。","買わずに 聞いていたい とき"],
 fitsMood:["It fits the mood.","ふんいきに ぴったりですね。","場面に あっている と ほめる とき"],
});
const ZAKKA_NOW_TALK=Z=>{
const PH=ZAKKA_PHRASES;
const O=(e,ph,r,rj,nx,x={})=>Object.assign({e,ph,r,rj,nx,j:x.j||(ph&&PH[ph]?PH[ph][1]:''),ok:x.ok===0?0:1},x);
const E=(good,t,s,j,fx,act)=>({end:1,good,t,s,j,fx,act});
const pickBy=(c,a)=>a[c.seed%a.length];
const L=(c,a)=>a[{es:0,jh:1,hs:2}[c.it.lv]||0];   // Nora's words by the song's level
const NM=c=>`"${c.it.en}"`;
/* the time of day on the beach */
const TW={dawn:'dawn',morning:'the morning',noon:'noon',evening:'the evening',sunset:'sunset',night:'the night'};
const TJ={dawn:'夜明け',morning:'朝',noon:'お昼',evening:'夕方',sunset:'夕暮れ',night:'夜'};
const fits=c=>!!(c.it.t&&c.it.t.includes(Z.phNow()));
const own=c=>Z.gOwned(c.it);
/* why this song now */
const why=c=>fits(c)?L(c,[`It's ${TW[Z.phNow()]} now. This song is good for ${TW[Z.phNow()]}.`,`Because it's ${TW[Z.phNow()]}. I think this song sounds best at this time of day.`,`It's ${TW[Z.phNow()]}, and I always feel this song belongs to this hour. Music should match the light outside.`])
  :L(c,["Pip picked it! He danced when he heard it.","To be honest, Pip picked it today. He bobbed his head, so I said yes.","I'll be honest with you: Pip chose it. He bobbed his head the moment it started, and I never argue with a dancing parrot."]);
const whyJ=c=>fits(c)?L(c,[`いまは ${TJ[Z.phNow()]}でしょ。 この 曲は ${TJ[Z.phNow()]}に ぴったりなの。`,`${TJ[Z.phNow()]}だからよ。 この 時間に いちばん きれいに 聞こえる 曲だと 思うの。`,`いまは ${TJ[Z.phNow()]}。 この 曲は この 時間の ものって 気が するの。 音楽は 外の 光に あわせなきゃ。`])
  :L(c,["ピップが えらんだの！ 聞いたら おどったのよ。","じつはね、 きょうは ピップが えらんだの。 首を ふってたから、 いいわよって。","正直に 言うわね。 ピップが えらんだの。 曲が はじまった とたんに 首を ふりだして。 おどる オウムには さからえないわ。"]);
const buyGo=c=>{c.pv=1;c.now=1;return `@${Z.gScene(c.it)}:price`};
const BUY=(x={})=>O("Can I buy this song?",'buySong',c=>own(c)?L(c,["You have it already!","You already have this record, don't you?","Didn't you buy this one already? I remember wrapping it for you."]):L(c,["Yes! Let's talk about it.","Of course. It's on sale today, too.","Certainly. I was hoping someone would ask."]),
  c=>own(c)?L(c,["もう もってるわよ！","この レコード、 もう もってるでしょ？","これ、 もう 買ってくれたわよね？ つつんだの 覚えてるわ。"]):L(c,["いいわよ！ お話ししましょ。","もちろん。 きょうは 売り物でも あるのよ。","もちろんよ。 だれか 聞いてくれないかなって 思ってたの。"]),
  c=>own(c)?'eHave':buyGo(c),Object.assign({if:c=>!c.bought},x));
const Q=nx=>O(c=>c.it.q[0],null,c=>c.it.q[2],c=>c.it.q[3],nx,{j:c=>c.it.q[1],if:c=>!c.q,act:c=>{c.q=1}});
const F=nx=>O(c=>c.it.f[0],null,c=>c.it.f[2],c=>c.it.f[3],nx,{ok:0,j:c=>c.it.f[1],pip:c=>c.it.f[4]||null,fx:'😂',if:c=>!c.fun,act:c=>{c.fun=1}});
const WHY=nx=>O("Why did you pick this song?",'whyPick',why,whyJ,nx,{if:c=>!c.why,act:c=>{c.why=1}});

return {
gNow:{t:'いま ながれている 曲',start:'a',nodes:{
 a:{s:c=>`${pickBy(c,L(c,[["Oh, the music?","Do you like the song?","Listen! Nice, right?"],["Oh, you noticed the music?","Ah, you're listening to the song?","Do you like what's playing?"],["Ah, you noticed the music. Most people don't.","I see the song caught your ear.","You have good ears. Few customers ask about the music."]]))} ${c.it.d[0]}`,
  j:c=>`${pickBy(c,L(c,[["あら、 音楽？","この 曲、 好き？","聞いて！ いいでしょ？"],["あら、 音楽に 気づいた？","あら、 曲を 聞いてるの？","いま ながれてる 曲、 気に入った？"],["あら、 音楽に 気づいたのね。 気づく 人は あまり いないのよ。","曲が 耳に とまったのね。","いい 耳ね。 曲の ことを 聞く お客さんは めずらしいの。"]]))} ${c.it.d[1]}`,o:[
  WHY('b'),
  Q('b'),
  BUY(),
  O("Can you turn it up?",null,c=>L(c,["No, no! This is a quiet shop.","Sorry, dear. This is a quiet shop. Pip gets grumpy when it's loud.","I'm afraid not. This shop is meant to be quiet. Besides, Pip complains when the music gets too loud."]),c=>L(c,["だめ だめ！ ここは しずかな お店よ。","ごめんね。 ここは しずかな お店なの。 うるさいと ピップが きげん わるく なるのよ。","ごめんなさいね。 この お店は しずかに していたいの。 それに 大きな 音だと ピップが もんくを 言うのよ。"]),'a2',{ok:0,j:"音を 大きく してくれる？",pip:"Shh! Shh!",fx:'🔉',if:c=>!c.loud,act:c=>{c.loud=1}}),
  F('a2')]},
 a2:{s:c=>L(c,["Anyway, it's a nice song.","Anyway, it's a lovely song, isn't it?","In any case, it's a lovely piece, don't you think?"]),j:c=>L(c,["とにかく、 いい 曲よ。","とにかく、 すてきな 曲でしょ？","とにかく、 すてきな 曲だと 思わない？"]),o:[
  O("Yes. I love this song.",'loveSong',c=>L(c,["Me too!","I'm so glad. Me too.","I'm delighted to hear that. So do I."]),c=>L(c,["わたしも！","うれしい。 わたしも よ。","そう 言ってもらえて うれしいわ。 わたしも よ。"]),'b',{j:"うん。 この 曲、 大好き。",if:c=>!c.love,act:c=>{c.love=1}}),
  WHY('b'),
  BUY(),
  O("I'll just listen for a while.",'justListen',null,null,'eListen')]},
 b:{s:c=>L(c,["Do you like it?","So, what do you think of it?","So, how does it strike you?"]),j:c=>L(c,["気に入った？","それで、 どう？","それで、 どんな 感じ？"]),o:[
  O("I love this song.",'loveSong',c=>L(c,["Me too!","Me too. I play it a lot.","So do I. I've worn the record a little thin, I'm afraid."]),c=>L(c,["わたしも！","わたしも。 よく かけるのよ。","わたしも よ。 じつは かけすぎて レコードが ちょっと すりへってるの。"]),'b2',{if:c=>!c.love,act:c=>{c.love=1}}),
  O("It fits the mood.",'fitsMood',c=>fits(c)?L(c,["Yes! Just right.","Thank you. I chose it for this time of day.","Thank you. I do try to match the music to the hour."]):L(c,["Pip says thank you!","Thank you! Pip will be proud.","How kind. I'll pass the compliment on to Pip. He chose it."]),c=>fits(c)?L(c,["そう！ ちょうど いいの。","ありがとう。 この 時間に あわせて えらんだの。","ありがとう。 音楽は 時間に あわせるように してるの。"]):L(c,["ピップが ありがとうって！","ありがとう！ ピップが とくいに なるわ。","やさしいのね。 ほめ言葉は ピップに つたえておくわ。 あの子が えらんだから。"]),'b2',{if:c=>!c.mood,act:c=>{c.mood=1}}),
  WHY('b'),
  Q('b'),
  BUY(),
  O("I'll just listen for a while.",'justListen',null,null,'eListen')]},
 b2:{s:c=>own(c)?L(c,["You have it, right? Play it at your card shop!","You have this record, right? It sounds nice in your card shop, too.","You own this one, don't you? I imagine it sounds lovely in your card shop as well."]):L(c,["It's on sale today.","It's for sale, you know.","It's for sale, if you're interested."]),
  j:c=>own(c)?L(c,["もってるわよね？ カードショップで かけてね！","この レコード、 もってるわよね？ あなたの カードショップでも いい 感じよ。","この 曲、 もってるわよね？ あなたの カードショップでも きっと すてきに ひびくわ。"]):L(c,["きょうは 売ってるのよ。","これ、 売り物なのよ。","よかったら、 これは 売り物よ。"]),o:[
  BUY(),
  O("Can I dance here?",null,c=>L(c,["Dance? OK! A little.","Here? Well... just don't knock over the teacups!","Here? I suppose so... as long as the teacups survive."]),c=>L(c,["おどる？ いいわよ！ すこしね。","ここで？ まあ… ティーカップだけは たおさないでね！","ここで？ まあ いいわ… ティーカップが ぶじ なら ね。"]),'eDance',{ok:0,j:"ここで おどっても いい？",fx:'💃'}),
  O("I'll just listen for a while.",'justListen',null,null,'eListen'),
  O("Thank you. Bye!",null,"Bye! Come again.","バイバイ！ また 来てね。",'eBye',{j:"ありがとう。 バイバイ！"})]},
 eListen:E(1,'ゆっくり 聞いた',c=>L(c,["OK! Stay and listen.","Take your time. The song isn't going anywhere.","Please, take your time. Music is better when nobody hurries."]),c=>L(c,["いいわよ！ ゆっくり 聞いてね。","ゆっくり していってね。 曲は にげないから。","どうぞ、 ゆっくりね。 音楽は いそがない ほうが いいもの。"]),'🎶'),
 eHave:E(1,'もう もってた',c=>L(c,["You have it! Play it a lot!","You can play it in your card shop anytime.","Then you can play it in your card shop whenever you like. We have the same taste!"]),c=>L(c,["もってるのね！ いっぱい かけてね！","あなたの カードショップで いつでも かけられるわね。","なら、 あなたの カードショップで いつでも かけられるわね。 わたしたち、 好みが にてるわ！"]),'💿'),
 eBye:E(1,'またね',"Bye! The song changes with the time. Come back later!","バイバイ！ 曲は 時間で かわるの。 また あとで 来てね！",'👋'),
 eDance:E(0,'お店で おどった',"(You dance between the shelves. Pip bobs his head. Nora laughs and claps.)","（たなの あいだで おどった。 ピップが 首を ふって、 ノラさんは わらって 手を たたいた）",'💃'),
}}};
};
