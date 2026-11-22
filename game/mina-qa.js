/* 🙋 ミナ先生に しつもん（11/21 ミナ先生まわり 作りなおし 4回目）
   よく ある 「なんで？」を えらぶと、 ミナ先生が カード 2〜3まいで 答える。 さいごに 「📘 この 授業で くわしく」（その 時間へ）
   入口: ☕ おしゃべりの ページ（game/mina-plan.js）・ 🤔 教えて の 中（game/practice.js）
   ユーザーが チャットで 聞いた こと（be と 様子の ことば・do・will be tired・3単現の -s が なぜ あるか）から 作った。
   図は 単元の 道具（UNIT.F）。 きろくは localStorage 'hoshi_qa'（聞いた 質問） */
(()=>{
if(!window.UNIT)return;
const {sfx:SFX}=BEACH;const H=HE,esc=H.esc,$=id=>document.getElementById(id);
const snd=k=>{try{SFX[k]&&SFX[k]()}catch(e){}};
const talk=en=>{try{speechSynthesis.cancel();window.SENSEI&&SENSEI.talk(en)}catch(e){}},hush=()=>{try{speechSynthesis.cancel()}catch(e){}};
const face=(ex,tx)=>{try{return MINA.face('m',ex,MINA.poseFor?MINA.poseFor(ex,tx||''):undefined)}catch(e){return ''}};
const ML=(k,v)=>{try{return MINA.line(k,v||{})}catch(e){return ['smile','']}};
const {B,row,note,two,tbl}=UNIT.F;
const KEY='hoshi_qa',R=(()=>{try{return JSON.parse(localStorage.getItem(KEY)||'{}')||{}}catch(e){return {}}})();R.h=R.h||{};
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(R))}catch(e){}};

/* go = [単元の id, 時間]（くわしく 見る 先） */
const QA=[
 {id:'be_yousu',ico:'🫧',q:'be と 様子の ことば（happy・tired）って どう ちがうの？',go:['shikumi',3],cards:[
  {x:'smile',say:'happy や tired は <b>様子の ことば</b>。 「どんな 感じ？」を 言う ことばで、 動詞じゃ ないの。 だから ひとりでは 文の 動詞の 席に すわれないんだ',
   f:row([B('I','s'),B('happy','x')],'x')+note('動詞の 席が からっぽ')},
  {x:'happy',say:'そこで <b>be</b>（am / is / are）が 動詞の 席に すわって、 「＝」で つなぐの。 I am happy. は 「わたし ＝ しあわせ」',
   f:row([B('I','s'),B('am','v'),B('happy','o')],'o')+note('be は 「＝」の つなぎ役'),ex:[['I am happy.','わたしは しあわせ'],['She is tired.','彼女は つかれている']]},
  {x:'proud',say:'見分け方は かんたん。 <b>very を つけられたら 様子の ことば</b>。 very happy・very tired は 言えるけど、 very play は 言えないよね',
   f:two(['very ○','happy・tired・busy<br>→ be が いる','g'],['very ×','play・eat・swim<br>→ そのまま 動詞','r'])}]},
 {id:'yes_no',ico:'🙆',q:'Yes・No って 「はい・いいえ」 じゃ ないの？',drill:'yn',cards:[
  {x:'think',say:'じつは そこが 落とし穴。 日本語の 「はい・いいえ」は <b>相手の 言った ことに 合ってるか</b>で 決めるよね。 でも 英語の Yes・No は <b>後ろに 来る 文が 肯定か 否定か</b>の 合図なの',
   f:two(['日本語','ねこ 好きじゃ ないの？ — はい、 好きじゃ ない','r'],['英語','Don\'t you like cats? — No, I don\'t.','g'])+note('日本語の 「はい」が 英語では No に なる')},
  {x:'smile',say:'だから Yes・No の 日本語訳は <b>気に しない ほうが いい</b>の。 Yes は I do の <b>肯定チームの ふだ</b>、 No は I don\'t の <b>否定チームの ふだ</b>。 いつも セットで くっついてるよ',
   f:row([B('Yes,','m'),B('I','s'),B('do.','v')],'o')+row([B('No,','m'),B('I','s'),B('don\'t.','v')],'o')+note('Yes, I don\'t. や No, I do. は ない')},
  {x:'proud',say:'答える ときは Yes・No から 考えなくて だいじょうぶ。 先に <b>I do か I don\'t か</b> を 決めれば、 Yes・No は 自動で ついてくる。 質問が Do you〜? でも Don\'t you〜? でも 答えは 同じだよ',
   f:tbl([['好き','Yes, I do.'],['好きじゃ ない','No, I don\'t.']]),
   ex:[["Don't you like cats? — Yes, I do.",'（ううん、）好きだよ'],["Do you like cats? — Yes, I do.",'好きだよ（答えは 同じ）']]},
  {x:'happy',say:'ひとつ だけ おまけ。 相手の かんちがいを 強く 打ち消す ときは <b>No, no, I DO like cats!</b>（ちがう ちがう、 ほんとに 好きなの！）って 言う ことも ある。 この No は 「その 思いこみ ちがうよ」の No で、 ふつうの 答え方とは べつ。 まずは 「ふだと 文は セット」で OK',
   ex:[["No, no, I DO like cats!",'ちがう ちがう、 ほんとに 好きなんだって！']]}]},
 {id:'do_what',ico:'🐝',q:'do って なに？ なんで 疑問文に do が いるの？',go:['shikumi',5],cards:[
  {x:'think',say:'be の 文は be を 前に 出せば 質問に なるよね（Are you 〜?）。 でも play や like は 前に 出せないの。 Play you tennis? とは 言わない',
   f:row([B('Are','m'),B('you','s'),B('happy?')],'o')+row([B('Play','x'),B('you','s'),B('tennis?')],'x')},
  {x:'smile',say:'そこで 出てくるのが <b>do</b>。 do は 「質問・否定の ための 旗」 みたいな 手伝い役。 旗を 前に 立てて、 動詞は もとの 形の まま',
   f:row([B('Do','m'),B('you','s'),B('play','v'),B('tennis?')],'o')+row([B('I','s'),B('don\'t','m'),B('play','v'),B('tennis.')],'o'),ex:[['Do you play tennis?','テニス する？'],["I don't play tennis.",'テニスは しない']]},
  {x:'proud',say:'しかも 旗は <b>時と 人の しるし</b>を 持っていくの。 does（he の s）・did（過去）が 旗に うつるから、 動詞は いつも 原形に もどるんだよ',
   f:tbl([['he の 質問','Does he play?（plays じゃない）'],['過去の 質問','Did you play?（played じゃない）']])}]},
 {id:'will_be',ico:'🔮',q:'will be tired の be って なに？ will tired じゃ だめ？',go:['shikumi',0],cards:[
  {x:'think',say:'tired は 様子の ことば。 さっきと 同じで、 文の 動詞の 席には すわれないの。 will は 手伝い役だから、 席には まだ 動詞が いる',
   f:row([B('I','s'),B('will','m'),B('tired','x')],'x')+note('will の あとに 動詞が ない')},
  {x:'happy',say:'そこで be が 入るの。 will の あとは 形を かえない 原形だから、 am でも is でも なく <b>be</b>。 I will be tired. ＝ 「つかれるだろう」',
   f:row([B('I','s'),B('will','m'),B('be','v'),B('tired.')],'o'),ex:[['I will be tired.','つかれるだろう'],['It will be sunny.','晴れるだろう']]},
  {x:'proud',say:'can・must・should も 同じ。 様子を 言う ときは <b>助動詞 ＋ be ＋ 様子</b>。 You should be careful.（気を つけてね）',
   f:row([B('You','s'),B('should','m'),B('be','v'),B('careful.')],'o')}]},
 {id:'s3',ico:'🐝',q:'3単現の -s って なんで あるの？',go:['shikumi',5],cards:[
  {x:'smile',say:'じつは <b>1000年くらい 前の 英語の なごり</b>。 むかしの 英語は 日本語より たくさん、 人ごとに 動詞の 形が かわっていたの',
   f:tbl([['むかし I','lufie（love）'],['むかし you','lufast'],['むかし he','lufath'],['むかし we','lufiath']])},
  {x:'think',say:'時代と ともに ほとんど 消えて、 he・she・it の ときの しるしだけが 生き残ったの。 400年 前は he loveth（th）と he loves（s）が まざってて、 s が 勝ったんだ',
   f:row([B('he loveth','x'),B('→'),B('he loves','v')])},
  {x:'love',say:'だから 意味の ための s じゃ なくて、 ことばの 化石 みたいな もの。 なくても 意味は 通じるけど、 ないと ネイティブは 「あれ？」って 耳が ひっかかるの。 ていねいに つけよう',
   ex:[['She plays the piano.','彼女は ピアノを ひく'],['My dog likes apples.','うちの 犬は りんごが 好き']]}]},
 {id:'been_be',ico:'🔤',q:'been と be、 原形と 過去分詞で まよう',go:['shikumi',1],cards:[
  {x:'happy',say:'動詞には 3つの 顔が あるよ。 <b>原形・過去形・過去分詞</b>。 be なら be・was/were・been',
   f:tbl([['原形','be ・ eat ・ go'],['過去形','was/were ・ ate ・ went'],['過去分詞','been ・ eaten ・ gone']])},
  {x:'think',say:'どの 顔に なるかは <b>前の ことば</b>で きまるの。 will・can・to の あとは 原形。 have・be の あとは 過去分詞',
   f:row([B('will','m'),B('be','v')],'o')+row([B('to','m'),B('be','v')],'o')+row([B('have','m'),B('been','v')],'o')},
  {x:'proud',say:'だから <b>have been は セット</b>で 覚えちゃおう。 have be は ない。 I have been here.（ずっと ここに いる）',ex:[['I have been here for an hour.','1時間 ずっと ここに いる']]}]},
 {id:'past_perf',ico:'⏰',q:'過去形と 現在完了は どう ちがうの？',go:['shikumi',7],cards:[
  {x:'smile',say:'過去形は <b>むかしの 一点だけ</b>を 言うの。 今の ことは 何も 言わない',f:row([B('I','s'),B('lost','v'),B('my key.')])+note('なくした（今は 見つかったかも）')},
  {x:'think',say:'現在完了は <b>むかし から 今に つながる 矢印</b>。 なくして、 今も ない',f:row([B('I','s'),B('have lost','v'),B('my key.')])+note('なくして 今も ない')},
  {x:'proud',say:'だから yesterday・ago・When？ みたいな 「むかしの 一点」の ことばは 現在完了とは いっしょに 使えないよ',
   f:two(['I saw him yesterday.','○ 過去の 一点','g'],['I have seen him yesterday.','× 一点と 矢印は まぜない','r'])}]},
 {id:'a_the',ico:'🍎',q:'a と the、 数えない 名詞が わからない',go:['shikumi',6],cards:[
  {x:'smile',say:'a は 「どれでも いい 1つ」、 the は 「あれね！と わかる もの」。 はじめて 言う ときは a、 2回目からは the',ex:[['I have a dog. The dog is white.','犬を かってる。 その 犬は 白い']]},
  {x:'think',say:'water・homework・music みたいに <b>形が きまっていない もの</b>は 数えない。 a も s も つかないよ',f:two(['数える','a book・two books','g'],['数えない','water・homework（a も s も なし）','r'])},
  {x:'proud',say:'数えたい ときは 入れものを 数えるの。 a glass of water（コップ 1ぱいの 水）',ex:[['a glass of water','コップ 1ぱいの 水']]}]},
 {id:'to_ing',ico:'🎯',q:'to と -ing、 どっちを 使うの？',go:['shikumi',8],cards:[
  {x:'smile',say:'to は <b>これから 向かう</b> 感じ、 -ing は <b>もう している・やってきた</b> 感じ',f:two(['want to / hope to','これから したい','g'],['enjoy -ing / finish -ing','している・してきた','r'])},
  {x:'think',say:'だから want・hope・decide（これから）は to、 enjoy・finish・stop（している ことを）は -ing',ex:[['I want to see you.','あなたに 会いたい'],['I enjoyed talking with you.','話せて たのしかった']]},
  {x:'proud',say:'remember は 両方 OK で 意味が かわるよ。 remember to lock（わすれずに しめる＝これから）、 remember locking（しめたのを 覚えてる＝前に）'}]},
 {id:'in_on_at',ico:'📍',q:'in / on / at の 使いわけ',go:['shikumi',9],cards:[
  {x:'smile',say:'イメージは 3つ。 <b>in は 中に すっぽり</b>、 <b>on は 上に くっつく</b>、 <b>at は 地図の 点</b>',f:tbl([['in','in the box・in July（長い 時間の 中）'],['on','on the wall・on Sunday（その 日に くっつく）'],['at','at the station・at six（点）']])},
  {x:'proud',say:'時間も 同じ イメージ。 月・年は 長いから in、 日・曜日は on、 時こくは 点だから at',ex:[['I get up at six.','6時に 起きる'],['See you on Sunday!','日曜日に ね']]}]},
 {id:'ask_order',ico:'❓',q:'質問の 語順は なんで ひっくりかえるの？',go:['shikumi',10],cards:[
  {x:'think',say:'英語は 「だれが・する」の 順番が いのち。 質問の ときは その 頭に <b>旗（be や do）を 前に 出す</b>ことで 「いまから 聞くよ」と 合図するの',
   f:row([B('You','s'),B('are','v'),B('happy.')])+row([B('Are','m'),B('you','s'),B('happy?')],'o')},
  {x:'smile',say:'でも 文の 中に 入った 質問は、 もう 合図が いらないので <b>ふつうの 順番</b>に もどるよ',
   f:row([B('Where','m'),B('does','m'),B('he','s'),B('live?')],'o')+row([B('I know','s'),B('where','m'),B('he','s'),B('lives.','v')],'o'),ex:[["I don't know where he lives.",'彼が どこに 住んでいるか 知らない']]}]}
];

/* ---------- 画面（授業と 同じ 重ね #dpov） ---------- */
function close(){const o=$('dpov');if(o)o.remove();hush()}
function shell(title,back){let o=$('dpov');if(o)o.remove();o=document.createElement('div');o.id='dpov';document.body.appendChild(o);
  o.innerHTML=`<section class="pnl dpp mdp qap" role="dialog" aria-label="しつもん"><div class="qtop"><button class="x" id="qax" aria-label="もどる">${back?'←':'✕'}</button><b>${title}</b><span></span></div><div class="mdbox" id="mdbox"></div></section>`;
  $('qax').onclick=()=>{snd('back');back?back():close()};o.onclick=e=>{if(e.target===o){snd('back');close()}};return $('mdbox')}
const minaBox=(ex,tx)=>`<div class="mdsay"><span class="lface">${face(ex,tx)}</span><p>${tx}</p></div>`;
const enBtn=(en,ja)=>`<button class="mden" data-say="${esc(en)}"><span>🔊 ${esc(en)}</span>${ja?`<small>${esc(ja)}</small>`:''}</button>`;
function list(back){const box=shell('🙋 ミナ先生に しつもん',back||null),[ex,tx]=ML('qa_list');
  box.innerHTML=minaBox(ex,tx)+`<div class="qalist">${QA.map((x,i)=>`<button data-q="${i}" class="${R.h[x.id]?'seen':''}"><i>${x.ico}</i><span>${esc(x.q)}</span>${R.h[x.id]?'<small>✔</small>':''}</button>`).join('')}</div>`;
  box.querySelectorAll('[data-q]').forEach(b=>b.onclick=()=>{snd('talk');ask(+b.dataset.q,back)})}
function ask(i,back){const x=QA[i];if(!x)return;R.h[x.id]=Date.now();save();try{RECENT.add('qa',{t:x.q})}catch(e){}
  const box=shell('🙋 '+esc(x.q),()=>list(back)),u=x.go&&UNIT.get(x.go[0]),c=u&&u.D.CH[x.go[1]];
  box.innerHTML=`<div class="mdcard qaq"><p class="qaqt">🙋 ${esc(x.q)}</p></div>`+x.cards.map(k=>`<div class="mdcard">${minaBox(k.x||'smile',k.say)}${k.f?`<div class="mdfig">${k.f}</div>`:''}${k.ex?`<div class="mdens">${k.ex.map(e=>enBtn(e[0],e[1])).join('')}</div>`:''}</div>`).join('')+
    `${minaBox(...ML(x.drill==='yn'?'qa_endYn':'qa_end'))}<div class="mdnav">${c?`<button id="qago">📘 授業で くわしく：${esc(c.short)}</button>`:''}${x.drill&&window.SKDRILL?`<button id="qadr">⚡ 特別練習で ためす</button>`:''}</div><div class="mdnav"><button class="sub" id="qaother">🙋 ほかの 質問</button></div>`;
  box.querySelectorAll('[data-say]').forEach(b=>b.onclick=e=>{e.stopPropagation();snd('pop');talk(b.dataset.say)});box.scrollTop=0;
  $('qaother').onclick=()=>{snd('pop');list(back)};
  const g=$('qago');if(g)g.onclick=()=>{snd('lesson');close();u.open({ch:x.go[1]})};
  const d=$('qadr');if(d)d.onclick=()=>{snd('lesson');close();SKDRILL.open(x.drill)}}
window.MINAQA={list,ask,all:QA};

Object.assign(MINA_LINES,{
 qa_list:[['smile','どれでも 聞いてね。 「なんで？」って 思えるのは、 英語を ちゃんと 見てる しょうこ だよ'],['happy','よく 聞かれる 「なんで？」を あつめたよ。 気に なる ものから どうぞ'],['love','聞いてくれるの、 先生 いちばん うれしいんだ']],
 qa_end:[['smile','すっきり した？ もっと 知りたかったら 下の 授業へ どうぞ'],['happy','これで 「なんで？」が 1つ 解けたね'],['love','いい 質問だったよ。 また いつでも 聞いてね']],
 qa_endYn:[['love','Yes・No は ふだ。 I do か I don\'t を 決めたら、 ふだは 勝手に くっついてくるよ'],['proud','もう 「はい・いいえ」に 訳さなくて いいからね。 下の ⚡特別練習で ためしてみて']],
 r_qaYn:[['happy','さっきの Yes・No の 話、 すっきり した？ 訳さない ほうが 楽でしょ'],['love','Yes は 肯定チーム、 No は 否定チームの ふだ。 先生 この 考え方、 大好きなんだ'],['smile','Don\'t you〜? って 聞かれても、 もう 自分が する？ しない？ だけ 考えれば いいね']],
 r_qa:[['love','さっきの 質問、 いい 「なんで？」だったね'],['smile','聞いてくれた こと、 覚えておくね']]
});
window.MINA_REACT_EXT=window.MINA_REACT_EXT||{};
MINA_REACT_EXT.qa={act:e=>[/^Yes・No/.test(e.t||'')?'r_qaYn':'r_qa',{t:e.t||''},null],desc:e=>`ミナ先生に 「${e.t||''}」と 質問した`};
})();
