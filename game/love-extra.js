/* 💗 ラブストーリー 第3弾の 中身（しくみは game/love.js）
   - LOVE_LETTERS[段階]: ボトルメールに まざる ミナ先生からの 英語の ラブレター。 re = 返事 [英語,訳,点]
   - LOVE_SECRETS: 先生の ひみつ（段階ごとに 1つ）
   - LOVE_FACES: 恋でしか 見られない 表情・ポーズ図鑑 [id,表情,ポーズ,名前,ヒント,条件]
   - LOVE_TITLES: ふたりの 称号 [名前,条件,ヒント]
   - LOVE_PROMISES: 約束 [種類,英語,訳,画面に 出す ことば]
   - ライバル・先生からの 質問は LOVE_RANDOM に 足す */
const LOVE_LETTERS=[
 [{en:"Dear my hardworking student,\nI saw you studying by the fire last night. You looked so serious! Don't forget to rest, okay?\nFrom Mina",ja:"がんばりやの 生徒さんへ\nきのうの 夜、 たき火の そばで 勉強してるの 見たよ。 すごく 真剣な 顔！ 休むのも わすれないでね？\nミナより",
   re:[["Thank you for watching over me.","見守って くれて ありがとう。",2],["I'll rest when I'm done!","おわったら 休むよ！",1],["Were you spying on me?","のぞいてたの？",0]]},
  {en:"Dear you,\nA student asked me today, 'Why do you teach?' I thought of you, and I smiled. Is that strange?\nMina",ja:"あなたへ\nきょう ある 生徒に「なんで 先生を してるの？」って 聞かれたの。 あなたの ことを 思い出して、 わらっちゃった。 へんかな？\nミナ",
   re:[["Not strange at all. It makes me happy.","ぜんぜん へんじゃ ない。 うれしい。",2],["Maybe a little strange.","ちょっと へんかも。",1],["Who asked you?","だれが 聞いたの？",0]]}],
 [{en:"Dear you,\nI can't sleep tonight. I keep thinking about what you said by the sea. Were you serious?\nMina",ja:"あなたへ\n今夜は ねむれないの。 海の そばで あなたが 言った こと、 ずっと 考えてる。 本気だった？\nミナ",
   re:[["I was serious. Every word.","本気だよ。 ぜんぶ。",2],["What did I say?","なんて 言ったっけ？",0],["Go to sleep, teacher!","はやく ねて、 先生！",1]]},
  {en:"To the one who always comes,\nThe days you don't come feel a little long. I'm not complaining. Just... telling you.\nM.",ja:"いつも 来てくれる 人へ\nあなたが 来ない 日は、 ちょっと 長く 感じるの。 もんくじゃ ないよ。 ただ… 伝えたくて。\nM.",
   re:[["I'll come every day, then.","じゃあ 毎日 来るね。",2],["I missed you too.","わたしも 会いたかった。",2],["It's just one day.","たった 1日だよ。",0]]}],
 [{en:"Dear you,\nI wrote your name in the sand today. The waves took it away, but I still remember how it looked.\nMina",ja:"あなたへ\nきょう、 砂に あなたの 名前を 書いたの。 波が さらって いったけど、 どんな 形だったか まだ おぼえてる。\nミナ",
   re:[["Next time, let's write both our names.","こんどは ふたりの 名前を 書こう。",2],["I'll write yours too.","わたしも 先生の 名前を 書くね。",2],["Did you spell it right?","つづり あってた？",0]]},
  {en:"Dear you,\nI'm a teacher, so I should be good with words. But with you, I always lose them.\nMina",ja:"あなたへ\n先生だから ことばは 得意な はず なのに。 あなたの 前だと、 いつも ことばが 出てこなくなる。\nミナ",
   re:[["You don't need words. I understand.","ことばは いらないよ。 わかってる。",2],["Me too. My heart beats too fast.","わたしも。 どきどき しすぎて。",2],["Then study harder!","じゃあ もっと 勉強して！",0]]}],
 [{en:"My dearest,\nGood morning. I made two cups of cocoa by mistake. ...It wasn't a mistake. Come over?\nYour Mina",ja:"いちばん 大切な 人へ\nおはよう。 まちがえて ココアを 2つ いれちゃった。 …まちがいじゃ ないけど。 来る？\nあなたの ミナ",
   re:[["I'm on my way!","いま 行く！",2],["Save one for me.","ひとつ とっておいて。",1],["I don't like cocoa.","ココア きらい。",0]]},
  {en:"My dearest,\nSometimes I'm scared this is all a dream. If it is, please don't wake me up.\nMina",ja:"いちばん 大切な 人へ\nときどき、 これが ぜんぶ ゆめなんじゃ ないかって こわく なるの。 もし ゆめなら、 起こさないでね。\nミナ",
   re:[["It's not a dream. I'm right here.","ゆめじゃ ないよ。 ここに いる。",2],["Then let's dream together forever.","じゃあ ずっと いっしょに ゆめを 見よう。",2],["Wake up! It's Monday!","起きて！ 月曜日だよ！",0]]}]];

const LOVE_SECRETS=[
 {st:0,n:5,t:'星が 好きな わけ',en:"I like stars because they keep shining even when no one is watching. I want to be that kind of person.",ja:"星が 好きなのは、 だれも 見て いなくても 光りつづけるから。 わたしも そんな 人に なりたいの。"},
 {st:1,t:'先生に なった わけ',en:"When I was a child, I couldn't speak English at all. A teacher on a small beach taught me under the stars. I became a teacher to be like her.",ja:"子どもの ころ、 英語が ぜんぜん 話せなかったの。 小さな 浜辺で、 ある 先生が 星の 下で 教えて くれた。 わたしは その 人みたいに なりたくて 先生に なったの。"},
 {st:2,t:'故郷の こと',en:"My hometown is a small island far to the south. My grandmother still lives there. I left to study, and I've never told anyone how much I miss it.",ja:"わたしの 故郷は、 ずっと 南の 小さな 島。 おばあちゃんが まだ 住んでるの。 勉強の ために 島を 出て、 どれだけ さびしいか、 だれにも 言った ことが なかった。"},
 {st:3,t:'ほんとうの ゆめ',en:"My real dream isn't just a school by the sea. It's a home where someone is waiting for me. ...I think I've found that someone.",ja:"わたしの ほんとうの ゆめは、 海辺の 学校 だけじゃ ないの。 だれかが 待っていて くれる 家。 …その だれかを、 見つけた 気が する。"}];

/* 条件は L＝LOVE の 記録 */
const LOVE_FACES=[
 ['f_mug','smile','mug','ふたりの ココア','ふたりの 時間を 3日',L=>L.n>=3],
 ['f_blush','love','cheeks','てれてれ','ぜんぶ 1回で 正解',L=>(L.perf||0)>=1],
 ['f_star','wow','star','流れ星に ねがいを','流れ星の 運',L=>(L.stars||0)>=1],
 ['f_heart','love','heart','ハートを ぎゅっ','「気になる 人」に なる',L=>L.st>=1],
 ['f_sulk','worry','cross','ぷいっ','はじめての けんか',L=>(L.fights||0)>=1],
 ['f_makeup','love','pray','ごめんねの あと','仲直り する',L=>L.deep>=1],
 ['f_jeal','worry','oops','やきもち','やきもちを やかせる',L=>(L.jc||0)>=1],
 ['f_letter','love','letter','ラブレター','先生の 手紙を 読む',L=>(L.lr||0)>=1],
 ['f_chest','love','chest','どきどき','「友だち 以上」に なる',L=>L.st>=2],
 ['f_date','happy','peace2','デートの ピース','デートで ★の エンド',L=>Object.keys(L.ends||{}).some(k=>/^d_.*:good$/.test(k))],
 ['f_shh','love','shh','ふたりの ひみつ','先生の ひみつを 2つ 知る',L=>Object.keys(L.sec||{}).length>=2],
 ['f_lover','love','thumb2','恋人の えがお','「恋人」に なる',L=>L.st>=3]];

const LOVE_TITLES=[
 ['はじめての 英会話',L=>L.n>=1,'ふたりの 時間を はじめる'],
 ['毎日 会いに 来る 人',L=>L.n>=10,'ふたりの 時間を 10日'],
 ['気になる ふたり',L=>L.st>=1,'「気になる 人」に なる'],
 ['ことばの 花束',L=>Object.keys(L.ph||{}).length>=30,'フレーズを 30こ'],
 ['仲直りの 名人',L=>L.deep>=3,'仲直りを 3回'],
 ['約束を まもる 人',L=>(L.pk||0)>=5,'約束を 5回 まもる'],
 ['月夜の 友だち',L=>L.st>=2,'「友だち 以上」に なる'],
 ['デートの 達人',L=>Object.keys(L.ends||{}).filter(k=>/^d_.*:good$/.test(k)).length>=4,'デートの ★エンドを 4つ'],
 ['季節を めぐる ふたり',L=>Object.keys(L.sea||{}).length>=2,'季節の イベントを 2つ'],
 ['ひみつを 知る 人',L=>Object.keys(L.sec||{}).length>=3,'先生の ひみつを 3つ'],
 ['文通の ふたり',L=>(L.lr||0)>=4,'ラブレターに 4回 返事'],
 ['星降る 恋人',L=>L.st>=3,'「恋人」に なる']];

/* [種類, 英語, 訳, 約束の 中身] */
const LOVE_PROMISES=[
 ['come',"Promise you'll come see me tomorrow?","あしたも 会いに 来るって 約束してくれる？",'あした ふたりの 時間に 来る'],
 ['lesson',"Will you do one mini lesson tomorrow? Promise?","あした ミニ授業を 1つ やる？ 約束ね？",'ミニ授業を 1つ やる'],
 ['words',"Promise me you'll learn five new words.","新しい 単語を 5つ おぼえるって 約束して。",'単語を 5つ おぼえる']];

/* 🧳 ライバル と ❓ 先生からの 質問（ランダムイベントに 足す） */
if(typeof LOVE_RANDOM!=='undefined')LOVE_RANDOM.push(
{id:'r_rival',t:'旅人 レオ',ico:'🧳',min:2,need:4,
 intro:'浜辺に 見なれない 旅人が いる。 ミナ先生の ほうを ちらちら 見ている…',
 ends:{good:['とくべつな 人',"...Someone special, huh? Say that again sometime.","…とくべつな 人、 か。 また いつか 言ってね。"],
  ok:['ちょっと ひやひや',"He was nice, but... I'd rather be here with you.","いい 人 だったけど… わたしは あなたと いたいな。"],
  fun:['レオの 勝ち？',"You told him what?! ...Hmph.","なんて 言ったの？！ …ふんっ。"]},
 nodes:{
  a:{who:'r',s:["Hey, is that Mina over there? She's amazing. Do you think she'd go to dinner with me?","ねえ、 あそこの ミナさん？ すてきな 人だね。 ぼくと 晩ごはん 行って くれると 思う？"],ex:'smile',o:[
   ["Sorry, she's with me today.","ごめん、 きょうは わたしと いっしょ なんだ。",2,'b',"Oh! I see. Lucky you.","あっ！ そうか。 うらやましいな。"],
   ["Why don't you ask her yourself?","自分で 聞いて みたら？",1,'b',"Maybe I will!","そうしようかな！"],
   ["Sure, go ahead.","どうぞ どうぞ。",0,'b',"Really? Thanks!","ほんと？ ありがとう！","ここは ゆずっちゃ だめ！ She's with me. で 伝えよう"]]},
  b:{s:["Who was that? ...What did you tell him?","いまの だれ？ …なんて 言ったの？"],ex:'think',o:[
   ["I told him you're someone special to me.","先生は わたしの とくべつな 人だって 言った。",2,'end',"",""],
   ["Just that you were busy.","いそがしいって 言った だけ。",1,'end',"",""],
   ["I said he could ask you out.","さそって いいよって 言った。",0,'end',"","","someone special to me ＝「わたしに とって とくべつな 人」"]]}}},
{id:'r_ask',t:'先生からの 質問',ico:'❓',min:2,need:4,
 intro:'ミナ先生が もじもじ しながら、 なにか 聞きたそうに している…',
 ends:{good:['わたしの いい ところ',"I'll remember every word you said today.","きょう 言って くれた こと、 ぜんぶ おぼえておく。"],
  ok:['ちょっと てれる 質問',"Okay, okay. That's enough questions for today!","はいはい。 きょうの 質問は おしまい！"],
  fun:['クッキー 目当て？',"So you only like my cookies?!","わたしの クッキーが 目当て だったの？！"]},
 nodes:{
  a:{s:["Can I ask you something? What do you like about me?","ひとつ 聞いても いい？ わたしの どこが 好き？"],ex:'love',o:[
   ["I like how you never give up on your students.","生徒を ぜったい 見すてない ところ。",2,'b',"...Really?","…ほんとに？"],
   ["I like your smile. It makes my day.","笑顔が 好き。 いい 1日に なる。",2,'b',"My smile...","わたしの 笑顔…"],
   ["Your cookies.","クッキー。",0,'b',"Cookies?!","クッキー？！","What do you like about ～? には I like how ～ / I like your ～ で 答えよう"]]},
  b:{s:["And... is there anything you don't like?","じゃあ… きらいな ところは ある？"],ex:'think',o:[
   ["Nothing. Well, maybe that you work too hard.","ないよ。 しいて 言えば がんばりすぎな ところ。",2,'end',"",""],
   ["You're a little too strict about grammar!","文法に ちょっと きびしすぎる！",1,'end',"",""],
   ["Your singing.","歌。",0,'end',"","","きらいな ところを 聞かれたら、 やさしく つつむと いいね"]]}}});
