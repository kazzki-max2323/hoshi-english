/* 📡 鉱山の トランシーバー: 休憩所（game/mine-rest.js）から 地上の ミオと 無線で 話す
   - かならず 無線の 英語で はじまって おわる（Do you read me? / Loud and clear. / Over. / Copy that. / Over and out.）。 おぼえた 無線の ことばは 📡メモに
   - まんなかで ミオが きょう ほった ことばを さりげなく 使う（お客さんの 話・メモの 例文・ミニクイズ）
   - ミオとの 仲（MIOC.stage・恋の 章 MIOL.chap）が すすむほど どきどき・あまい セリフに。 えらばれなかった とき（alt）は なかよしの 店員さんの まま
   - 深い 階・夜（m が 大きい）は しっとりめの セリフと 声（MIO.say の soft）
   - 帰ったとき ミオが ほった ことばに ひとこと（MINE_MIO_SEE。 game/mine.js の finish）
   ミオは 20さいの 大人。 表現は 親しみ・ときめき・ぼかし まで */
(()=>{
const {sfx:SFX}=BEACH;
const H=HE,esc=H.esc,$=id=>document.getElementById(id);
const C=CG,pickL=a=>a[Math.random()*a.length|0];
const sf=k=>{try{SFX[k]&&SFX[k]()}catch(e){}};
const ML=(k,v)=>{try{return MINA.line(k,v||{})}catch(e){return ['smile','']}};
const head1=I=>I.en.split(',')[0].trim();
const REC=()=>{const r=C.rec();const m=r.mn||(r.mn={});return m.wk||(m.wk={n:0,d:'',memo:{}})};
const today=()=>{try{return C.today()}catch(e){return ''}};
const fresh=()=>REC().d!==today();

/* ================================================================ 仲の 段階: 0 店員さん / 1 なかよし / 2 どきどき / 3 こいびと / 4 いっしょに 生きる 人 */
function tier(){try{const M=MIOC.rec();if(M.alt)return 0;if(window.WED&&WED.who&&WED.who()==='mina')return 0;
  const st=MIOC.stage();if(st>=5){const c=window.MIOL?MIOL.chap():0;return c>=3?4:3}return st>=4?2:st>=2?1:0}catch(e){return 0}}

/* 📡 無線の ことば（メモに たまる） */
const RADIO={
 'Do you read me?':'「聞こえますか？」 read は 読む じゃなくて 「（無線を）受けとる」',
 'Loud and clear.':'「よく 聞こえます」。 大きく はっきり ＝ 感度 良好',
 'Over.':'「どうぞ（そっちの 番）」。 話しおわった しるし',
 'Copy that.':'「了解」。 Roger. とも 言う',
 'Roger.':'「了解」。 むかしの 無線で R（received）を Roger と 読んだから',
 'Say again?':'「もう一回 言って」。 無線では Repeat より こちらを 使う',
 'Stand by.':'「ちょっと まって」',
 'Over and out.':'「通信 おわり」。 本当は Out. だけでも いい',
 'Mio out.':'「ミオ、 通信 おわり」。 自分の 名前＋out で しめる'};

/* はじまり（n=ふつう / s=しっとり）。 r: こちらの 返事 */
const OPEN={
 n:[["Boss, this is Mio. Do you read me? Over.","店長、 ミオです。 聞こえますか？ どうぞ。"],
    ["Mio to Boss, Mio to Boss! Do you read me? Over.","ミオから 店長へ、 ミオから 店長へ！ 聞こえますか？ どうぞ。"],
    ["Testing, testing… Boss? Do you read me? Over.","テスト、 テスト… 店長？ 聞こえますか？ どうぞ。"]],
 s:[["…Boss? It's Mio. Do you read me? Over.","…店長？ ミオです。 聞こえますか？ どうぞ。"],
    ["Mio here. It's really quiet tonight… Do you read me? Over.","ミオです。 今夜は すごく しずかで… 聞こえますか？ どうぞ。"]]};
const OPEN_R=[["Loud and clear, Mio. Over.","よく 聞こえるよ、 ミオ。 どうぞ。"],["I read you. Over.","聞こえてるよ。 どうぞ。"],["Copy that. I'm at the rest stop. Over.","了解。 休憩所に いるよ。 どうぞ。"]];
const OPEN_A=[
 [["Yay, it works! Okay, listen. Over.","やった、 つながった！ じゃあ 聞いてください。 どうぞ。"]],
 [["Good, I can hear the fire crackling. Over.","よかった、 たき火の パチパチって 音が 聞こえます。 どうぞ。"]],
 [["Your voice is a little sleepy. Over.","声が ちょっと ねむそう。 どうぞ。"],1],
 [["Ah… your voice. That's a relief. Over.","あ… 店長の 声。 ほっと しました。 どうぞ。"],2]];

/* ================================================================ まんなか①: きょう ほった ことばを さりげなく */
function wordBit(ids){const I=C.info(pickL(ids));if(!I)return null;const w=head1(I),k=Math.random();
  const ex=window.MINE_STORY?MINE_STORY.lineOf(I):null;
  if(k<.4&&ids.length>=2){const other=ids.map(id=>C.info(id)).filter(x=>x&&x.id!==I.id),wr=pickL(other);
    if(wr){const ch=H.shuffle([[I.ja,1],[wr.ja,0]]);return {w:I,m:[`Pop quiz from the shop! What does "${w}" mean? Over.`,`お店から ぬきうち クイズ！ 「${w}」って どういう いみ？ どうぞ。`],
      r:ch.map(([ja,ok])=>[`It means "${ja}." Over.`,`「${ja}」だよ。 どうぞ。`,ok?[`Correct! You really dug that one up, huh. Over.`,`正解！ さすが ほりだした だけ ありますね。 どうぞ。`,1]:[`Hmm, close! "${w}" is "${I.ja}." Now we both remember it. Over.`,`おしい！ 「${w}」は 「${I.ja}」です。 これで ふたりとも おぼえました。 どうぞ。`]])}}}
  if(k<.75&&ex)return {w:I,m:[`I'm practicing a sentence from my notes. "${ex[0]}" …Did I say it right? Over.`,`メモの 文を 練習中です。 「${ex[0]}」（${ex[1]}）… 言えてました？ どうぞ。`],
    r:[["Perfect. Over.","完ぺき。 どうぞ。",[`Yay! "${w}"… I'll use it at the counter tomorrow. Over.`,`やった！ 「${w}」… あした カウンターで 使ってみます。 どうぞ。`]],
       ["Say again? Over.","もう一回 言って？ どうぞ。",[`Okay, slowly… "${ex[0]}" Over.`,`じゃあ ゆっくり… 「${ex[0]}」 どうぞ。`,0,ex[0]]]]};
  return {w:I,m:[`A customer said "${w}" today, and I knew it! It's "${I.ja}," right? Over.`,`きょう お客さんが 「${w}」って 言ってて、 わかったんです！ 「${I.ja}」、 ですよね？ どうぞ。`],
    r:[["Right! I dug it up today, too. Over.","そう！ ぼくも きょう ほりだしたよ。 どうぞ。",[`Really? We're thinking about the same word. …That's kind of nice. Over.`,`ほんとに？ 同じ ことばの こと 考えてたんですね。 …なんか いいな。 どうぞ。`]],
       ["Nice job, Mio. Over.","やるね、 ミオ。 どうぞ。",[`Hehe. I'm studying hard so I can keep up with you. Over.`,`えへへ。 店長に おいていかれない ように 勉強してるんです。 どうぞ。`]]]}}

/* ================================================================ まんなか②: 仲の 段階ごとの ひとこと（s:1 は しっとり向け。 nt は 💌恋の 英語メモ） */
const TALK=[
 /* 0 店員さん */
 [{m:["The shop is fine. I sold two cards and dropped one coin under the shelf. Over.","お店は だいじょうぶです。 カードが 2まい 売れて、 コインが 1まい たなの 下に 落ちました。 どうぞ。"],
   r:[["Did you get it back? Over.","とれた？ どうぞ。",["Not yet. Pip is guarding it. Over.","まだです。 ピップが 見はってます。 どうぞ。"]],["Ha ha, typical Mio. Over.","あはは、 ミオらしい。 どうぞ。",["Hey! …Okay, that's fair. Over.","ちょっと！ …まあ、 そうですけど。 どうぞ。"]]]},
  {m:["Don't push yourself too hard down there, okay? Over.","下で むりしすぎないで くださいね。 どうぞ。"],
   r:[["I won't. Thanks, Mio. Over.","しないよ。 ありがとう、 ミオ。 どうぞ。",["Good. Your job is to come back. Over.","よし。 店長の しごとは 帰ってくる ことですから。 どうぞ。"]],["Just one more floor! Over.","あと 一階だけ！ どうぞ。",["You always say that. Over.","いつも そう 言うんですよね。 どうぞ。"]]]},
  {m:["Question! What do miners eat for lunch? Over.","しつもん！ 鉱夫さんって お昼に なに 食べるんでしょう？ どうぞ。"],
   r:[["Rice balls, of course. Over.","おにぎりに きまってる。 どうぞ。",["I knew it! I'll make you some next time. Over.","やっぱり！ こんど 作ってあげます。 どうぞ。"]],["Rocks? Over.","岩？ どうぞ。",["Boss! Please eat real food. Over.","店長！ ちゃんと した ごはんを 食べてください。 どうぞ。"]]]},
  {s:1,m:["It's getting dark outside. The sea looks silver tonight. Over.","外は 暗く なってきました。 今夜は 海が 銀色です。 どうぞ。"],
   r:[["Sounds pretty. Over.","きれいだね。 どうぞ。",["It is. You should see it when you come up. Over.","きれいですよ。 上に 来たら 見てください。 どうぞ。"]],["I wish I could see it. Over.","見たいな。 どうぞ。",["Then come back before the moon goes down. Over.","じゃあ 月が しずむ 前に 帰ってきて。 どうぞ。"]]]}],
 /* 1 なかよし */
 [{m:["The shop is a little too quiet without you. …Just a little. Over.","店長が いないと お店が ちょっと しずかすぎて。 …ちょっとだけ ですよ。 どうぞ。"],
   r:[["Do you miss me? Over.","さみしい？ どうぞ。",["W-who said that? I said quiet! Over.","だ、 だれが そんな こと！ しずかって 言ったんです！ どうぞ。"]],["I'll be back soon. Over.","すぐ 帰るよ。 どうぞ。",["…Okay. I'll keep the light on. Over.","…はい。 明かり、 つけて おきますね。 どうぞ。"]]]},
  {m:["Your voice sounds different on the radio. Kind of… cool. Over.","無線だと 店長の 声、 なんか ちがって 聞こえます。 ちょっと… かっこいい。 どうぞ。"],
   r:[["Really? Over.","ほんと？ どうぞ。",["Forget I said that. Over.","いまの 聞かなかった ことに してください。 どうぞ。"]],["Yours sounds cute. Over.","ミオの 声は かわいいよ。 どうぞ。",["…Stand by. I need a second. Over.","…ちょっと まって ください。 どうぞ。"]]]},
  {m:["I made too much tea. Two cups. Who's going to drink the other one? Over.","お茶 入れすぎちゃいました。 2はい。 もう 1ぱい、 だれが 飲むんでしょう？ どうぞ。"],
   r:[["Save it for me. Over.","とって おいて。 どうぞ。",["It'll be cold by then. …I'll make a new one. Over.","さめちゃいますよ。 …新しいの、 入れますね。 どうぞ。"]],["Drink both! Over.","2はい 飲んじゃえ！ どうぞ。",["Then I won't sleep tonight. Over.","今夜 ねむれなく なっちゃいます。 どうぞ。"]]]},
  {s:1,m:["Hey, Boss… can I stay on the radio a little longer? Over.","ねえ 店長… もう少し 無線、 つないでて いいですか？ どうぞ。"],
   r:[["Sure. Over.","いいよ。 どうぞ。",["Thanks. I just like hearing the fire on your side. Over.","ありがとう。 そっちの たき火の 音、 聞いてるのが 好きなんです。 どうぞ。"]],["Can't sleep? Over.","ねむれない？ どうぞ。",["Not yet. Talk to me for a bit. Over.","まだ。 少し 話してて ください。 どうぞ。"]]]}],
 /* 2 どきどき */
 [{m:["I keep checking the radio. Is that weird? Over.","さっきから 何回も 無線を 見ちゃうんです。 へん ですか？ どうぞ。"],
   r:[["Not weird. I was waiting too. Over.","へんじゃない。 ぼくも まってた。 どうぞ。",["…You can't just say that on the radio. Over.","…無線で そういう こと 言うの、 ずるいです。 どうぞ。"]],["A little weird. Over.","ちょっと へん。 どうぞ。",["Mean! …But you answered fast. Over.","いじわる！ …でも 返事、 はやかったですね。 どうぞ。"]]]},
  {m:["When you come back, can we walk on the beach? Just the two of us? Over.","帰ってきたら、 浜辺を 歩きませんか？ ふたりだけで。 どうぞ。"],
   r:[["It's a date. Over.","デートだね。 どうぞ。",["D-date?! …Okay. It's a date. Over.","デ、 デート！？ …はい。 デートです。 どうぞ。"]],["Sure, after I eat. Over.","いいよ、 食べた あとでね。 どうぞ。",["Ha ha. I'll bring snacks. Over.","あはは。 おやつ、 持っていきますね。 どうぞ。"]]]},
  {s:1,m:["It's late… I should sleep, but I want to hear your voice a little more. Over.","おそいですね… ねなきゃ なのに、 もう少し 声が 聞きたいです。 どうぞ。"],
   r:[["Me too. Over.","ぼくも。 どうぞ。",["…Then five more minutes. Promise. Over.","…じゃあ あと 5分。 約束ですよ。 どうぞ。"]],["Go to sleep, Mio. Over.","もう ねなよ、 ミオ。 どうぞ。",["Okay… say good night first. Over.","はーい… じゃあ 先に おやすみって 言って。 どうぞ。"]]]},
  {m:["Boss, be careful. If something happens to you, I… I'd be in big trouble at the shop! Over.","店長、 気を つけて。 店長に なにか あったら わたし… お店が 大変 ですから！ どうぞ。"],
   r:[["Just the shop? Over.","お店だけ？ どうぞ。",["…Not just the shop. Over.","…お店だけじゃ ないです。 どうぞ。"]],["Copy that. I'll be careful. Over.","了解。 気を つけるよ。 どうぞ。",["Roger. …Good. Over.","了解です。 …よし。 どうぞ。"]]]}],
 /* 3 こいびと */
 [{m:["I miss you. Is that okay to say on the radio? Over.","会いたいです。 無線で 言って いいのかな。 どうぞ。"],nt:[["I miss you.","「会いたい」。 はなれている 人に。 I missed you.（会いたかった）は 会えた ときに"]],
   r:[["I miss you too. Over.","ぼくも 会いたい。 どうぞ。",["Then dig fast and come home. Over.","じゃあ はやく ほって 帰ってきて。 どうぞ。"]],["Everyone can hear you! Over.","みんなに 聞こえるよ！ どうぞ。",["Let them hear. …No, wait, don't. Over.","聞かせちゃえ。 …やっぱり だめ。 どうぞ。"]]]},
  {s:1,m:["I'm wearing your jacket. It smells like the sea. …Don't laugh. Over.","店長の 上着、 着てます。 海の においが する。 …わらわないでね。 どうぞ。"],nt:[["Don't laugh.","「わらわないで」。 てれながら 本音を 言う ときの 前おき"]],
   r:[["It looks good on you, I bet. Over.","きっと にあってる。 どうぞ。",["You can't even see me! …But thanks. Over.","見えてないくせに！ …でも ありがとう。 どうぞ。"]],["Keep it warm for me. Over.","あたためて おいて。 どうぞ。",["Copy that. I'll keep it warm. Over.","了解。 あたためて おきます。 どうぞ。"]]]},
  {m:["I counted. You said my name eleven times today. I like it when you say it. Over.","数えてたんです。 きょう 名前を 11回 よばれました。 よばれるの、 好きです。 どうぞ。"],
   r:[["Mio. Over.","ミオ。 どうぞ。",["Twelve. …Hehe. Over.","12回め。 …えへへ。 どうぞ。"]],["You counted?! Over.","数えてたの！？ どうぞ。",["Of course. I'm your girlfriend. Over.","当然です。 彼女ですから。 どうぞ。"]]]},
  {s:1,m:["Look up, Boss. …Oh, right, you can't see the sky down there. Then I'll tell you. There are so many stars. Over.","上を 見て、 店長。 …あ、 下からは 空が 見えないか。 じゃあ 教えますね。 星が いっぱいです。 どうぞ。"],nt:[["I'll tell you.","「教えて あげる」。 見えない 相手に 景色を 話す ときに"]],
   r:[["Tell me more. Over.","もっと 教えて。 どうぞ。",["The big one is right above the shop. I'm saving it for you. Over.","大きいのが お店の 真上に あります。 とって おきますね。 どうぞ。"]],["You're my star. Over.","ミオが ぼくの 星だよ。 どうぞ。",["…That was so cheesy. I love it. Over.","…くさい！ でも 好き。 どうぞ。"]]]}],
 /* 4 いっしょに 生きる 人 */
 [{m:["Dinner's ready when you are. I made your favorite. Over.","ごはん、 いつでも 食べられますよ。 好きな もの 作りました。 どうぞ。"],nt:[["I made your favorite.","「あなたの 好きな もの 作ったよ」。 favorite だけで 「大好物」"]],
   r:[["I'm coming home now. Over.","いまから 帰る。 どうぞ。",["Copy that. I'll warm it up. Over.","了解。 あたため なおしますね。 どうぞ。"]],["One more floor first! Over.","先に もう 一階！ どうぞ。",["Then I'll wait. I'm good at waiting for you. Over.","じゃあ まってます。 あなたを まつの、 とくい なんです。 どうぞ。"]]]},
  {s:1,m:["The house is quiet. I left the porch light on for you. Over.","家が しずかです。 玄関の 明かり、 つけて おきました。 どうぞ。"],nt:[["I left the light on for you.","「明かりを つけて まってるよ」。 帰りを まつ 人の やさしい ひとこと"]],
   r:[["I'll follow the light. Over.","その 明かりを 目じるしに 帰るよ。 どうぞ。",["Good. Come home to me. Over.","うん。 わたしの ところに 帰ってきて。 どうぞ。"]],["Go to bed, I'll be late. Over.","先に ねてて、 おそく なるから。 どうぞ。",["No way. I'll wait up. Over.","いやです。 起きて まってます。 どうぞ。"]]]},
  {m:["Hey… I still get nervous when I call you. Even now. Funny, right? Over.","ねえ… いまでも あなたに 無線する とき、 どきどき するんです。 おかしいでしょ？ どうぞ。"],
   r:[["Me too. Over.","ぼくも。 どうぞ。",["Then we're even. Over.","じゃあ おあいこ ですね。 どうぞ。"]],["That's cute. Over.","かわいい。 どうぞ。",["Stop it, I'm blushing at the counter. Over.","やめて、 カウンターで 顔が 赤く なっちゃう。 どうぞ。"]]]},
  {m:["The shop did great today. Our shop. I like saying that. Over.","きょうは お店、 大成功でした。 わたしたちの お店。 そう 言うの、 好きなんです。 どうぞ。"],
   r:[["Our shop. Over.","ぼくたちの お店。 どうぞ。",["Our shop. Hehe. Over.","わたしたちの お店。 えへへ。 どうぞ。"]],["Thanks to you, Mio. Over.","ミオの おかげだよ。 どうぞ。",["Thanks to us. Over.","ふたりの おかげです。 どうぞ。"]]]}]];

/* おわり（段階ごと。 s=しっとり） */
const CLOSE=[
 {n:[["Okay, I'll get back to the shop. Mio out!","じゃあ お店に もどります。 ミオ、 通信 おわり！"]],s:[["Get some rest down there. Mio out.","下で ゆっくり 休んでくださいね。 ミオ、 通信 おわり。"]]},
 {n:[["Okay. Come back safe. Mio out!","じゃあ。 ぶじに 帰ってきてね。 ミオ、 通信 おわり！"]],s:[["…Good night, Boss. Mio out.","…おやすみなさい、 店長。 ミオ、 通信 おわり。"]]},
 {n:[["I'll be waiting. …Mio out!","まってますから。 …ミオ、 通信 おわり！"]],s:[["Don't make me wait too long. Mio out.","あんまり またせないでね。 ミオ、 通信 おわり。"]]},
 {n:[["See you soon. I mean it. Mio out.","また すぐね。 本気ですよ。 ミオ、 通信 おわり。"]],s:[["Dream of me, okay? …Mio out.","わたしの 夢、 見てね？ …ミオ、 通信 おわり。"]]},
 {n:[["Come home to me. Mio out.","わたしの ところへ 帰ってきて。 ミオ、 通信 おわり。"]],s:[["I love you. Over and out.","大好きです。 通信 おわり。"]]}];
const CLOSE_R=[["Copy that. Over and out.","了解。 通信 おわり。"],["Roger. Over and out.","了解。 通信 おわり。"]];

/* ================================================================ 会話の 画面（休憩所の 上に 出す） */
function say(en,soft){try{MIO.say(en,{soft})}catch(e){}}
function open(ctx){const t=tier(),soft=ctx.m>.6,R=REC();R.n++;const first=R.d!==today();R.d=today();C.save();
  const seqs=[];
  const op=pickL(soft?OPEN.s:OPEN.n),oa=pickL(OPEN_A.filter(x=>!x[1]||x[1]<=t+1&&(x[1]!==1||soft)));
  seqs.push({m:op,r:OPEN_R.map(r=>[r[0],r[1],oa[0]])});
  const wb=ctx.trip&&ctx.trip.length?wordBit(ctx.trip):null;if(wb)seqs.push(wb);
  const sp=TALK[t].filter(x=>x.s),pool=soft&&sp.length&&Math.random()<.6?sp:TALK[t].filter(x=>soft||!x.s),x=pickL(pool.length?pool:TALK[t]);seqs.push(x);
  const cl=pickL(soft?CLOSE[t].s:CLOSE[t].n);
  let i=0,log=[],ntAll=[];const used=new Set(['Do you read me?','Over.']);
  const face=()=>{try{return MIO.face(soft?'smile':pickL(['smile','laugh','wink']))}catch(e){return '🧑‍🎓'}};
  const memoAdd=en=>Object.keys(RADIO).forEach(k=>{if(en.includes(k.replace(/[.?]$/,'')))used.add(k)});
  const row=(who,en,ja)=>`<div class="wkr ${who}"><span class="wkw">${who==='m'?'📡 ミオ':'🎙️ あなた'}</span><p class="en">${esc(en)}${who==='m'?` <button class="ksay" data-say="${esc(en)}">🔊</button>`:''}</p><p class="ja">${esc(ja)}</p></div>`;
  const o=C.ov(`<div class="wk ${soft?'soft':''}"><p class="wkh">📡 トランシーバー <small>地上の ミオ</small><span class="wkface">${face()}</span></p><div class="wklog" id="wklog"></div><div class="wkch" id="wkch"></div></div>`,'by wkov');
  o.dataset.stay=1;
  const lg=$('wklog'),ch=$('wkch');
  const bindSay=()=>lg.querySelectorAll('[data-say]').forEach(b=>b.onclick=()=>say(b.dataset.say,soft));
  const push=(who,en,ja)=>{lg.insertAdjacentHTML('beforeend',row(who,en,ja));bindSay();lg.scrollTop=lg.scrollHeight;memoAdd(en);if(who==='m'){say(en,soft);sf('beep'in SFX?'tap':'tap')}};
  const step=()=>{const s=seqs[i];if(!s)return closing();push('m',s.m[0],s.m[1]);if(s.nt)ntAll.push(...s.nt);
    H.afterTalk(()=>{ch.innerHTML=s.r.map((r,k)=>`<button data-k="${k}">${esc(r[0])}<small>${esc(r[1])}</small></button>`).join('');
      ch.querySelectorAll('[data-k]').forEach(b=>b.onclick=()=>{const r=s.r[+b.dataset.k];ch.innerHTML='';sf('tap');push('y',r[0],r[1]);
        const a=r[2];H.afterTalk(()=>{if(a){push('m',a[0],a[1]);if(a[2]){try{SFX.correct&&SFX.correct()}catch(e){}}}
          H.afterTalk(()=>{i++;step()},500,900)},400,500)})},300,600)};
  const closing=()=>{push('m',cl[0],cl[1]);H.afterTalk(()=>{ch.innerHTML=CLOSE_R.map((r,k)=>`<button data-k="${k}">${esc(r[0])}<small>${esc(r[1])}</small></button>`).join('');
    ch.querySelectorAll('[data-k]').forEach(b=>b.onclick=()=>{const r=CLOSE_R[+b.dataset.k];push('y',r[0],r[1]);end()})},300,600)};
  const end=()=>{const nw=[...used].filter(k=>RADIO[k]&&!R.memo[k]);[...used].forEach(k=>{if(RADIO[k])R.memo[k]=1});C.save();
    let heart='';if(first&&window.MIOC){try{heart=MIOC.gain(1,'radio')}catch(e){}}
    try{RECENT.add('mio',{kind:'radio',t})}catch(e){}
    let lv='';if(ntAll.length&&window.MIOL&&t>=3){try{lv=MIOL.noteHTML({nt:ntAll})}catch(e){}}
    const [ex,tx]=ML(t>=3?'mn_wkLove':soft?'mn_wkNight':'mn_wk');
    ch.innerHTML=`${nw.length?`<div class="wkmemo"><b>📡 無線の ことば NEW</b>${nw.map(k=>`<p><b>${esc(k)}</b> ${esc(RADIO[k])}</p>`).join('')}</div>`:''}${lv}
      ${heart?`<p class="zkheart">${heart}</p>`:''}
      <div class="kmina"><span class="lface">${MINA.face('m',ex)}</span><p>${tx}</p></div>
      <div class="row"><button class="sub" id="wkmm">📡 無線の ことば ${Object.keys(R.memo).length}/${Object.keys(RADIO).length}</button><button class="big" id="wkx">🔥 たき火に もどる</button></div>`;
    sf('step');
    $('wkx').onclick=()=>{sf('back');C.closeOv()};
    $('wkmm').onclick=()=>{sf('open');memo()};
    lg.scrollTop=lg.scrollHeight};
  step()}
function memo(){const R=REC();const o=C.ov(`<div class="mnlo"><p class="mnlon">📡 無線の ことば <small>${Object.keys(R.memo).length}/${Object.keys(RADIO).length}</small></p>
  <div class="mnlol">${Object.keys(RADIO).map(k=>R.memo[k]?`<button class="mnlor" data-say="${esc(k)}"><span class="gi">🔊</span><span><b>${esc(k)}</b><small>${esc(RADIO[k])}</small></span></button>`:`<div class="mnlor"><span class="gi">📡</span><span><b>？？？</b><small>ミオと 無線で 話すと おぼえるよ</small></span></div>`).join('')}</div>
  <button class="mnlob" data-x>🔥 たき火に もどる</button></div>`,'mnlov');
  o.querySelector('[data-x]').onclick=()=>{sf('back');C.closeOv()};
  o.querySelectorAll('[data-say]').forEach(b=>b.onclick=()=>say(b.dataset.say))}

/* ================================================================ 🏠 帰った とき: ミオが ほった ことばを 見て ひとこと */
const SEE={
 es:[`"{w}"! I know this one! 「{ja}」ですよね。 小学校で ならいました！`,`"{w}"、 知ってます！ {ja}。 これ、 お店でも よく 聞きますよ`,`あっ "{w}"！ なつかしい〜。 {ja}、 ですよね`,`"{w}"は かんたん！ …って 言いたいけど、 つづり、 ちょっと あやしいかも`],
 jh:[`"{w}"、 中学の 教科書で 見ました！ {ja}、 ですよね`,`"{w}"… {ja}！ テストに 出たやつです`,`"{w}"、 この 前 お客さんが 使ってました。 {ja}の いみですよね`,`"{w}"、 知ってます。 例文、 いっしょに 読んでみたいな`],
 hs:[`"{w}"… 大学の 授業で 出たかも。 {ja}、 ですよね？`,`"{w}"！ むずかしいの ほってきましたね。 {ja}…なるほど`,`"{w}"、 わたしも 勉強中です。 {ja}って いみなんだ`,`"{w}"… かっこいい ことば。 {ja}、 おぼえておきます`],
 adv:[`"{w}"！？ む、 むずかしい… {ja}…なるほど！ 店長、 すごい`,`"{w}"… 辞書で しらべないと わからなかったです。 {ja}だって！`,`"{w}"、 はじめて 見ました。 {ja}… 大人の 英語って かんじ`],
 t:[`この カード、 とっても めずらしい！ ガラスケースに かざりたいくらい`]};
const SEE_HI=[n=>`おかえりなさい、 店長！ ${n}まいも ほってきたんですね。 見せて 見せて！`,n=>`おかえりなさい！ わあ、 ${n}まい！ どれどれ…`,n=>`おつかれさまです！ ほった カード、 ちょっと 見せてください`];
function seeLine(I,seed){const L=SEE[I.k==='t'?'t':I.lv]||SEE.es,i=Math.abs(seed|0)%L.length;
  return L[i].replace(/\{w\}/g,head1(I)).replace(/\{ja\}/g,I.ja)}
/* ほった カードは 📖ブックに 入れた（game/mine.js toBook） */
const SEE_BK=[n=>`ほった カードは カードブックに 入れておきました！ その ことばを 勉強したら、 お店に 入荷しますよ`,n=>`カードブックの ポケットに しまっておきましたよ。 勉強すると その カードが 仕入れで とどきます！`,n=>`ブックが ${n}まい ふえましたね。 店長が 勉強した ぶんだけ、 お店の たなに ならびます`];
window.MINE_MIO_SEE={line:seeLine,hi:n=>pickL(SEE_HI)(n),bk:n=>pickL(SEE_BK)(n)};

/* ミナ先生の セリフ */
Object.assign(MINA_LINES,{
 mn_wk:[['smile','無線の 英語、 かっこいいでしょ？ Over は 「どうぞ」、 Copy that は 「了解」だよ'],['happy','ミオちゃん、 うれしそうだったね。 さっき ほった ことばも 使ってたよ。 気づいた？'],['point','無線では 話しおわりに Over って 言うの。 相手が 話す 番の あいずなんだ']],
 mn_wkNight:[['smile','夜の 無線って、 なんだか しっとり するね。 声だけで つながってる かんじ'],['love','…ふふ。 ミオちゃんの 声、 やさしかったね。 たき火の 音と よく あってた']],
 mn_wkLove:[['wink','あらあら、 あまい 無線だったね。 💌 恋の 英語メモにも 入ったよ'],['love','好きな 人との 英語って、 いちばん おぼえるんだよね。 …わたしは なにも 聞いてないからね'],['smile','I miss you. や Come home. みたいな みじかい 英語ほど 気持ちが こもるの']]});
window.MINE_WALKIE={open,memo,fresh,tier,RADIO};
})();
