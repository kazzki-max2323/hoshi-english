/* 💬 単語帳の 「ひとやすみ おしゃべり」（2026-11-16）
   - 単語帳で 20語 めくるごとに、 浜辺の だれか（ミナ先生・ミオ・リク・ノラさん・ピップ・マルコさん）が 割り込んでくる。
     話すのは さっき めくった 20語の こと。 会った ことの ある 人だけ 来る（ミナ先生は いつでも）
   - 会話は 分かれ道つきの 「長い 会話」と 同じ 形: nodes = {key:{m:[英語,日本語],ex,o:[[おもて,うら,つぎ,点]]}}、 おわりは {m,ex,end:'good'|'ok'|'fun'}
     文の { } は その とき めくった 単語で うまる（{w} 英語・{jc} 意味・{e} 絵文字・{ex}/{exj} 例文 など）
   - 同じ 話の 形は 直近 10回 くりかえさない・同じ 人は 2回 つづけて 来ない
   - おわると コイン（11/18 から カードは くばらない。 カードは 鉱山で ほって ゲット）
   - 単語帳の 上の 🎵 で のんびり BGM（ローファイ）を オン・オフ（game.js の placeBgm('cards')）
   - 「あとで」なら 5語 めくったら また 来る。 急かさない・失敗なし
   game.js から: HE.on('cardShow') / HE.on('cardsOpen')。 ミナ先生の セリフは この ファイルの さいご */
(()=>{
const {S:ST,sfx:SFX}=BEACH;
const H=HE,esc=H.esc,$=id=>document.getElementById(id);
const pickL=a=>a[Math.random()*a.length|0];
const sf=k=>{try{SFX[k]&&SFX[k]()}catch(e){}};
const EVERY=20,LATER=5;

/* ---------- the record ---------- */
const TT=(()=>{try{const s=JSON.parse(localStorage.getItem(SAVE_KEY)||'{}').tango;if(s&&s.r)return s}catch(e){}
  return {n:0,r:[],pend:0,used:[],who:[],talks:0,by:{},ends:{},cards:0,bgm:0,song:'',last:null,told:0}})();
_saveHooks.push(()=>{const s=JSON.parse(localStorage.getItem(SAVE_KEY)||'{}');s.tango=TT;localStorage.setItem(SAVE_KEY,JSON.stringify(s))});

/* ---------- words ---------- */
const jaCore=ja=>String(ja||'').replace(/（.*?）|\(.*?\)/g,'').split(/[・、,，／/;；]/)[0].trim()||String(ja||'');
const cgInfo=(lv,en)=>{try{return window.CG?(CG.info(lv+':'+en)||CG.cardOfHead(en.toLowerCase())):null}catch(e){return null}};
function word(r){const h=r.en.toLowerCase(),I=cgInfo(r.lv,r.en);let ex=null,pos='';
  try{if(window.WI){ex=WI.exOf(h);if(I)pos=WI.pos(I)}}catch(e){}
  return {lv:r.lv,en:r.en,h,ja:r.ja,jc:jaCore(r.ja),e:r.e||'',a:I&&I.a||'learn',pos,ex,id:I&&I.k==='w'?I.id:null,learned:!!ST.learned[(r.bi==='season'?'season':r.lv)+':'+r.en]}}
/* words with spaces or odd letters can't be spelled wrong nicely */
const plain=w=>/^[a-z]{4,}$/i.test(w.en);
/* a word spelled a little wrong (for Pip and Riku) */
function misspell(en,seed){const s=en.toLowerCase(),out=new Set(),V='aeiou';
  for(let i=1;i<s.length-2;i++)if(s[i]!==s[i+1])out.add(s.slice(0,i)+s[i+1]+s[i]+s.slice(i+2));
  for(let i=1;i<s.length;i++){const c=s[i];if(V.includes(c)){const sw={a:'e',e:'a',i:'e',o:'u',u:'o'}[c];out.add(s.slice(0,i)+sw+s.slice(i+1))}}
  for(let i=1;i<s.length-1;i++)if(!V.includes(s[i])&&s[i]!==s[i-1]&&s[i]!==s[i+1]){out.add(s.slice(0,i+1)+s[i]+s.slice(i+1));break}
  for(let i=1;i<s.length;i++)if(s[i]===s[i-1]){out.add(s.slice(0,i)+s.slice(i+1));break}
  out.delete(s);return H.shuffle([...out]).slice(0,seed||2)}
/* the example with the word taken out: "I ate an ___ ." */
const reEsc=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
function blank(w){if(!w.ex)return null;const re=new RegExp('\\b'+reEsc(w.en)+'\\b','i');return re.test(w.ex[0])?w.ex[0].replace(re,'＿＿＿'):null}

/* ---------- who can come ---------- */
const met={
  mina:()=>!!window.MINA,
  mio:()=>{try{return !!window.MIO&&SHOP.rec().met}catch(e){return false}},
  riku:()=>{try{return TUTOR.rec().met}catch(e){return false}},
  nora:()=>{try{return ZAKKA.rec().met}catch(e){return false}},
  pip:()=>{try{return ZAKKA.rec().met}catch(e){return false}},
  marco:()=>{try{return !!FOOD.rec().v}catch(e){return false}}};
const WHO={mina:{n:'ミナ先生',v:{p:1.12,r:.9,f:1}},mio:{n:'ミオ'},riku:{n:'リク',ico:'👦',v:{p:1.45,r:1.02}},
  nora:{n:'ノラさん',ico:'👩‍🦳',v:{p:1.05,r:.88,f:1}},pip:{n:'ピップ',ico:'🦜',v:{p:1.9,r:1.15}},marco:{n:'マルコさん',ico:'👨‍🍳',v:{p:.85,r:.9}}};
function face(who,ex){
  if(who==='mina')try{return MINA.face('m',({oops:'worry',laugh:'happy'})[ex]||ex||'smile')}catch(e){return '👩‍🏫'}
  if(who==='mio')try{return MIO.face(({happy:'laugh',wow:'laugh',think:'smile',proud:'wink',worry:'oops'})[ex]||ex||'smile')}catch(e){return '👩'}
  return `<span class="ttemo">${WHO[who].ico}</span>`}

/* ---------- voices ---------- */
let FV=null;
function femVoice(){if(FV)return FV;if(!window.speechSynthesis)return null;const vs=speechSynthesis.getVoices().filter(v=>/^en[-_]/i.test(v.lang));
  FV=vs.find(v=>/Samantha/i.test(v.name))||vs.find(v=>/en[-_]US/i.test(v.lang)&&/Google|Natural|Female/i.test(v.name))||vs.find(v=>/en[-_]US/i.test(v.lang))||vs[0]||null;return FV}
function speak(who,en){if(!ST.sound||!en)return;const t=String(en).replace(/「[^」]*」/g,'').replace(/[“”"]/g,'').replace(/\.\.\.|…/g,', ').replace(/＿＿＿/g,'blank');
  if(who==='mio'){try{MIO.say(t)}catch(e){}return}
  if(!window.speechSynthesis)return;
  try{speechSynthesis.cancel();const v=WHO[who].v||{p:1,r:.95},u=new SpeechSynthesisUtterance(typeof sayNames==='function'?sayNames(t):t);u.lang='en-US';
    if(v.f){const fv=femVoice();if(fv)u.voice=fv}u.pitch=v.p;u.rate=v.r*(ST.slow?.8:1);u.volume=Math.min(1,(ST.vol&&ST.vol.voice!=null)?ST.vol.voice:1);speechSynthesis.speak(u)}catch(e){}}

/* ================================================================ the talks
   each one: (V) => {id, who, ico, t, nodes} or null when the words don't fit.
   V: w/jc/e (the main word), w2/jc2, w3/jc3 (others from the 20), M/M2/M3 (the word objects), ex/exj, bl (example with a blank), bad/bad2 (spelled wrong) */
/* answer buttons: the meaning (in Japanese) or the English word, right one → ok, others → ng */
const qJa=(V,ok,ng,p=2)=>[[`「${V.jc}」`,'',ok,p],[`「${V.jc2}」`,'',ng,0],[`「${V.jc3}」`,'',ng,0]];
const qEn=(V,ok,ng,p=2)=>[[V.w,'',ok,p],[V.w2,'',ng,0],[V.w3,'',ng,0]];
const T=[];
const add=(who,id,f)=>T.push({who,id,f});
const CAT={food:'たべもの',ani:'いきもの',nat:'しぜん',heart:'きもち',life:'くらし',act:'うごき',look:'ようす',word:'ことば',learn:'ことば'};

/* ===================== 👩‍🏫 ミナ先生 ===================== */
add('mina','m_quiz',V=>({ico:'📝',t:'先生の ミニクイズ',nodes:{
  s:{m:[pickL(["Twenty words! Nice work. Quick quiz, OK? What does \"{w}\" mean?","You're doing great. Let me check one. \"{w}\"… what does it mean?","Time for a tiny quiz. Ready? \"{w}\"!"]),
     pickL(["20語 おつかれさま！ ちょっと クイズ。 「{w}」って どういう 意味？","いい ちょうし。 1つ だけ 聞くね。 「{w}」の 意味は？","ちいさな クイズの 時間。 いい？ 「{w}」！"])],ex:'smile',
    o:[...qJa(V,'ok','ng'),["Hmm… it's a secret!","うーん… ひみつ！",'joke',1]]},
  ok:{m:["That's right! {e} \"{w}\" is \"{jc}\". You remembered it so fast.","正解！ {e} 「{w}」は 「{jc}」。 すぐ 出てきたね。"],ex:'happy',
    o:[["Can you say it slowly?","ゆっくり 言って？",'slow',2],["I like this word.","この 単語、 好き。",'like',2]]},
  slow:{m:["Sure. {w}… {w}. Now you say it, too.","いいよ。 {w}… {w}。 こんどは きみも 言ってみて。"],ex:'smile',
    o:[["{w}!","{w}！",'endG',2],["(whisper) {w}…","（小声で） {w}…",'whisper',1]]},
  whisper:{m:["Ha ha, a secret voice! That counts. Your mouth remembers it now.","あはは、 ひみつの 声！ それでも OK。 口が もう 覚えたよ。"],ex:'happy',end:'fun'},
  like:{m:["Me too. When you like a word, it stays with you. Let's keep it in your heart.","先生も。 好きな 単語は ずっと のこるんだよ。 心に しまっておこうね。"],ex:'love',end:'good'},
  ng:{m:["Close! \"{w}\" is \"{jc}\". {e} Picture it once, and it gets easier.","おしい！ 「{w}」は 「{jc}」。 {e} 1回 絵を 思いうかべると 覚えやすいよ。"],ex:'think',
    o:[["One more, please!","もう 1問！",'two',1],["OK, I got it now.","うん、 もう 大丈夫。",'endO',1]]},
  two:{m:["Then… which word means \"{jc2}\"?","じゃあ… 「{jc2}」は どれ？"],ex:'smile',
    o:[[V.w2,'','endG',2],[V.w,'','endO',0],[V.w3,'','endO',0]]},
  joke:{m:["A secret? Ha ha. Then here's my secret: \"{w}\" means \"{jc}\". Now we both know.","ひみつ？ ふふ。 じゃあ 先生の ひみつを 教えるね。 「{w}」は 「{jc}」。 これで ふたりの ひみつ。"],ex:'happy',end:'fun'},
  endG:{m:["Perfect! You're learning slowly but surely. That's the best way.","かんぺき！ ゆっくりでも、 ちゃんと 前に すすんでるね。 それが いちばん。"],ex:'proud',end:'good'},
  endO:{m:["Good. Mistakes are part of learning. Next time, it'll come out first.","うん。 まちがえるのも 勉強の うち。 次は きっと 先に 出てくるよ。"],ex:'smile',end:'ok'}}}));

add('mina','m_room',V=>({ico:'🏠',t:'記憶の おへや',nodes:{
  s:{m:["Let me teach you a trick. Imagine your room. Put \"{w}\" on the desk, \"{w2}\" by the window, and \"{w3}\" on the bed.","覚え方の コツを 教えるね。 自分の へやを 思いうかべて。 机に 「{w}」、 まどの そばに 「{w2}」、 ベッドに 「{w3}」を おくの。"],ex:'think',
    o:[["OK. I put them there.","うん、 おいた。",'q',2],["My room is messy…","へやが ちらかってる…",'messy',1]]},
  messy:{m:["Ha ha! Then clean a little spot for each word. Desk, window, bed. Done?","あはは！ じゃあ 単語の ぶんだけ ちょっと かたづけよう。 机・まど・ベッド。 できた？"],ex:'happy',o:[["Done!","できた！",'q',2]]},
  q:{m:["Now, what's on the desk?","じゃあ、 机の 上には なにが ある？"],ex:'smile',o:qEn(V,'ok','ng')},
  ok:{m:["Yes, \"{w}\"! \"{jc}\". And by the window?","そう、 「{w}」！ 「{jc}」だね。 じゃあ まどの そばは？"],ex:'wow',
    o:[[V.w2,'','endG',2],[V.w3,'','mix',0],["I forgot!","わすれた！",'mix',0]]},
  ng:{m:["Hmm, that one is somewhere else. The desk has \"{w}\", \"{jc}\". Look at the desk again in your mind.","うーん、 それは べつの 場所。 机には 「{w}」、 「{jc}」。 頭の 中で もう一度 机を 見てみて。"],ex:'think',
    o:[["I see it now!","見えた！",'endO',1]]},
  mix:{m:["By the window is \"{w2}\", \"{jc2}\". And \"{w3}\" is sleeping on the bed.","まどの そばは 「{w2}」、 「{jc2}」。 「{w3}」は ベッドで ねてるよ。"],ex:'happy',o:[["Ha ha, sleeping words.","あはは、 ねてる 単語。",'endF',1]]},
  endG:{m:["Wonderful! That's called a \"memory palace\". Your room can hold lots of words.","すごい！ これは 「記憶の 宮殿」って いう 方法。 きみの へやには 単語が たくさん 入るよ。"],ex:'proud',end:'good'},
  endO:{m:["Good. Tonight, when you see your desk, say \"{w}\" once.","うん。 今夜 机を 見たら、 1回 「{w}」って 言ってみてね。"],ex:'smile',end:'ok'},
  endF:{m:["Let them sleep. Tomorrow they'll wake up in your head. Good night, {w3}!","ねかせて あげよう。 あした 頭の 中で 起きるから。 おやすみ、 {w3}！"],ex:'happy',end:'fun'}}}));

add('mina','m_hard',V=>({ico:'🤔',t:'むずかしかった 単語',nodes:{
  s:{m:["Which word was the hardest in this set?","この 20語で、 いちばん むずかしかったのは どれ？"],ex:'think',
    o:[[V.w,'','a',2],[V.w2,'','b',2],["They were all easy!","ぜんぶ かんたん！",'easy',1]]},
  a:{m:["\"{w}\", I see. \"{jc}\". Let's say it together three times. {w}, {w}, {w}!","「{w}」か。 「{jc}」だね。 いっしょに 3回 言おう。 {w}、 {w}、 {w}！"],ex:'smile',
    o:[["{w}, {w}, {w}!","{w}、 {w}、 {w}！",'endG',2],["That's a lot of {w}.","{w}が いっぱい。",'endF',1]]},
  b:{m:["\"{w2}\"! That one is tricky. It means \"{jc2}\". Hard words become your friends slowly.","「{w2}」！ あれは むずかしいよね。 意味は 「{jc2}」。 むずかしい 単語ほど、 ゆっくり 友だちに なるの。"],ex:'smile',
    o:[["Slowly is OK?","ゆっくりで いいの？",'slow',2],["I'll try again later.","あとで もう一度 やる。",'endO',1]]},
  slow:{m:["Of course. There's no hurry here. The waves are slow, and so are we.","もちろん。 ここには 急ぐ ことなんて ないよ。 波も ゆっくり、 わたしたちも ゆっくり。"],ex:'love',end:'good'},
  easy:{m:["Wow! Then… what's \"{jc3}\" in English?","すごい！ じゃあ… 「{jc3}」は 英語で？"],ex:'wow',
    o:[[V.w3,'','endG',2],[V.w,'','oops',0],[V.w2,'','oops',0]]},
  oops:{m:["Ah, it's \"{w3}\"! Maybe not ALL easy. Ha ha.","あ、 「{w3}」だよ！ ぜんぶ かんたん…では なかったかな。 ふふ。"],ex:'happy',end:'fun'},
  endG:{m:["Great! Saying it out loud is the strongest way to remember.","いいね！ 声に 出すのが いちばん 強い 覚え方なんだよ。"],ex:'proud',end:'good'},
  endO:{m:["Good idea. The book will wait for you.","いい 考え。 単語帳は ちゃんと 待っててくれるよ。"],ex:'smile',end:'ok'},
  endF:{m:["Ha ha! Too much {w}! Now it can't escape from your head.","あはは！ {w}だらけ！ もう 頭から にげられないね。"],ex:'happy',end:'fun'}}}));

add('mina','m_ex',V=>V.ex&&({ico:'📖',t:'例文で 読もう',nodes:{
  s:{m:["Let's read \"{w}\" in a sentence. {ex}","「{w}」を 文の 中で 読んでみよう。 {ex}"],ex:'smile',
    o:[["What does it mean?","どういう 意味？",'mean',2],["Read it again, please.","もう一度 読んで。",'again',2]]},
  again:{m:["{ex} …Did you hear \"{w}\" in it?","{ex} …「{w}」、 聞こえた？"],ex:'smile',o:[["Yes, I heard it!","聞こえた！",'mean',2]]},
  mean:{m:["It means: \"{exj}\" Here, \"{w}\" is \"{jc}\".","意味は 「{exj}」。 ここでは 「{w}」が 「{jc}」だよ。"],ex:'happy',
    o:[["I can read it now.","もう 読める。",'endG',2],["Words in a sentence are easier.","文の 中だと 覚えやすい。",'tip',2]]},
  tip:{m:["Yes! A word alone is lonely. In a sentence, it has friends around it.","そう！ 単語は ひとりだと さみしいの。 文の 中なら まわりに 友だちが いるでしょ。"],ex:'love',end:'good'},
  endG:{m:["Then you can read one more English sentence than yesterday. That's growth!","じゃあ きのうより 1つ 多く 英文が 読めるように なったね。 それが 成長だよ！"],ex:'proud',end:'good'}}}));

add('mina','m_opp',V=>{let a=null,Mw=null;for(const M of [V.M,V.M2,V.M3]){try{const s=CG.anto(M.h);if(s.length){a=s[0];Mw=M;break}}catch(e){}}if(!a)return null;
  const I=CG.cardOfHead(a);if(!I)return null;const V2={a,aj:jaCore(I.ja),x:Mw.en,xj:Mw.jc};
  return {ico:'↔️',t:'はんたいの ことば',v:V2,nodes:{
  s:{m:["\"{x}\" means \"{xj}\". Do you know its opposite?","「{x}」は 「{xj}」。 はんたいの ことば、 知ってる？"],ex:'think',
    o:H.shuffle([[a,'','ok',2],[Mw===V.M?V.w2:V.w,'','ng',0]]).concat([["Tell me!","教えて！",'tell',1]])},
  ok:{m:["Yes! \"{a}\", \"{aj}\". Opposites come in pairs, so you get two words for one.","そう！ 「{a}」、 「{aj}」。 はんたいの ことばは ペアで 覚えると 1つで 2つ 覚えられるよ。"],ex:'wow',o:[["Two for one!","1つで 2つ！",'endG',2]]},
  ng:{m:["Not that one. The opposite is \"{a}\", \"{aj}\". {x} and {a}… a nice pair.","それじゃ ないよ。 はんたいは 「{a}」、 「{aj}」。 {x}と {a}… いい ペアでしょ。"],ex:'smile',o:[["A nice pair.","いい ペア。",'endO',1]]},
  tell:{m:["The opposite is \"{a}\", \"{aj}\". Say them together: {x}, {a}!","はんたいは 「{a}」、 「{aj}」。 いっしょに 言ってみて。 {x}、 {a}！"],ex:'smile',o:[["{x}, {a}!","{x}、 {a}！",'endG',2]]},
  endG:{m:["Great! Next time you see \"{x}\", its partner will pop up too.","いいね！ 次に 「{x}」を 見たら、 相棒も いっしょに 出てくるよ。"],ex:'proud',end:'good'},
  endO:{m:["Good. Pairs are easy to remember. Like you and me.","うん。 ペアは 覚えやすいの。 きみと 先生みたいにね。"],ex:'love',end:'ok'}}}});

/* ===================== 🎀 ミオ ===================== */
add('mio','o_fix',V=>{const b=blank(V.M);if(!b||!V.ex)return null;const wrong=b.replace('＿＿＿',V.w2);
  return {ico:'📝',t:'ミオの 英作文チェック',v:{wrong},nodes:{
  s:{m:["Boss! I mean… hi! I wrote a sentence for my class. Is it right? \"{wrong}\"","店長！ じゃなくて… こんにちは！ 授業の 英作文、 これで あってる？ 「{wrong}」"],ex:'smile',
    o:[["Use \"{w}\" instead of \"{w2}\".","「{w2}」じゃなくて 「{w}」だよ。",'ok',3],["It's perfect!","かんぺき！",'perf',0],["Hmm… something is strange.","うーん… どこか へん。",'hint',1]]},
  hint:{m:["Strange? Where? …Is it \"{w2}\"? I thought it meant \"{jc}\".","へん？ どこ？ …「{w2}」？ 「{jc}」って 意味だと 思ってた。"],ex:'oops',
    o:[["\"{jc}\" is \"{w}\".","「{jc}」は 「{w}」だよ。",'ok',2],["\"{w2}\" means \"{jc2}\".","「{w2}」は 「{jc2}」って 意味。",'ok',2]]},
  perf:{m:["Yay! I'll hand it in! …Wait. My friend is laughing at it. Why?!","やった！ 出してくる！ …あれ？ 友だちが 読んで 笑ってる。 なんで！？"],ex:'oops',
    o:[["Sorry. It should be \"{w}\".","ごめん。 「{w}」が 正しい。",'ok',1],["Because it's funny.","おもしろいから。",'endF',0]]},
  ok:{m:["Oh no, you're right! \"{ex}\" That's it! \"{exj}\"","あっ、 ほんとだ！ 「{ex}」 これだ！ 「{exj}」"],ex:'laugh',
    o:[["You can do it.","ミオなら できるよ。",'endG',2],["Write it ten times.","10回 書いてね。",'ten',1]]},
  ten:{m:["Ten times?! …OK. {w}, {w}, {w}… Boss, you're a strict teacher!","10回！？ …わかりました。 {w}、 {w}、 {w}… 店長、 きびしい 先生！"],ex:'oops',end:'fun'},
  endF:{m:["Funny?! …I'm going to fix it right now. \"{w}\", \"{w}\"! Thank you, boss. I think.","おもしろい！？ …いますぐ 直します。 「{w}」、 「{w}」！ ありがとう、 店長。 たぶん。"],ex:'oops',end:'fun'},
  endG:{m:["Thank you, boss! Now my sentence is perfect. I'll treat you to a juice later.","ありがとう、 店長！ これで かんぺき。 あとで ジュース おごりますね。"],ex:'laugh',end:'good'}}}});

add('mio','o_guest',V=>({ico:'🛍️',t:'お客さんの しつもん',nodes:{
  s:{m:["Boss, quick question! A customer asked me how to say \"{jc}\" in English. I froze!","店長、 しつもん！ お客さんに 「{jc}って 英語で なんて いうの？」って 聞かれて、 かたまっちゃった！"],ex:'oops',o:qEn(V,'ok','ng')},
  ok:{m:["\"{w}\"! Of course! I'll write it in my memo. 📝 {jc} = {w}.","「{w}」！ そうだった！ メモしとこ。 📝 {jc} ＝ {w}。"],ex:'laugh',
    o:[["Let's practice.","練習しよう。",'prac',2],["Good memo.","いい メモ。",'endG',1]]},
  prac:{m:["OK! (to an imaginary customer) \"Excuse me! This is a {w}!\" …How was that?","はい！ （見えない お客さんに） 「すみません！ これは {w}です！」 …どう でした？"],ex:'smile',
    o:[["Very natural!","とっても 自然！",'endG',2],["Too loud.","声が 大きすぎ。",'loud',1]]},
  loud:{m:["Too loud? Sorry! The seagulls flew away. Ha ha.","大きすぎ？ ごめんなさい！ カモメが にげちゃった。 あはは。"],ex:'laugh',end:'fun'},
  ng:{m:["\"{w2}\"? Hmm… I think that's \"{jc2}\". Let me check my dictionary… It's \"{w}\"!","「{w2}」？ うーん… それは 「{jc2}」じゃ なかった？ 辞書 見てみる… 「{w}」だ！"],ex:'oops',
    o:[["Oops, you're right.","あ、 そうだった。",'endO',1],["You're smart, Mio.","ミオ、 かしこい。",'smart',1]]},
  smart:{m:["Me? Smart? …I'll tell that to my mom. Ha ha!","わたしが？ かしこい？ …お母さんに 言っちゃお。 あはは！"],ex:'laugh',end:'fun'},
  endO:{m:["We both learned it today. Teamwork!","ふたりで きょう 覚えたね。 チームワーク！"],ex:'smile',end:'ok'},
  endG:{m:["Thanks, boss! Next time, I'll answer like a pro.","ありがとう、 店長！ 次は プロみたいに 答えますね。"],ex:'wink',end:'good'}}}));

add('mio','o_card',V=>V.M.id&&({ico:'🎴',t:'お店に ある カード',card:1,nodes:{
  s:{m:["Oh! \"{w}\"! We have that card at the shop. {e} It's one of my favorites.","あ！ 「{w}」！ それ、 お店に カードが あるよ。 {e} わたしの お気に入りの 1まい。"],ex:'smile',
    o:[["Why do you like it?","どうして 好きなの？",'why',2],["What does it mean again?","どういう 意味だっけ？",'mean',1]]},
  why:{m:["Because… it means \"{jc}\", and the picture is cute! Also, it's easy to say. {w}!","だって… 意味は 「{jc}」で、 絵が かわいいの！ それに 言いやすい。 {w}！"],ex:'laugh',
    o:[["{w}!","{w}！",'endG',2],["I like it too.","ぼくも 好き。",'endG',2]]},
  mean:{m:["It means \"{jc}\". Ha ha, you're like me. I forget too, and then I check the card.","「{jc}」だよ。 あはは、 わたしと いっしょ。 わたしも わすれて、 カードを 見て 思い出すの。"],ex:'laugh',
    o:[["Cards help a lot.","カードって 役に立つね。",'endO',1]]},
  endG:{m:["Yay! Let's both remember \"{w}\" today. Promise?","やった！ きょうは ふたりで 「{w}」を 覚えよう。 約束ね？"],ex:'wink',end:'good'},
  endO:{m:["Right? That's why I love card shops!","でしょ？ だから カード屋さんが 大好きなの！"],ex:'smile',end:'ok'}}}));

add('mio','o_quizme',V=>({ico:'🎓',t:'ミオに クイズ',nodes:{
  s:{m:["I'm studying English too! Can you give me a quiz? Use your words!","わたしも 英語 勉強中なの！ クイズ 出して？ きみの 単語で！"],ex:'smile',
    o:[["What's \"{w}\"?","「{w}」は？",'a1',2],["What's \"{w2}\"?","「{w2}」は？",'a2',2]]},
  a1:{m:["\"{w}\"… is it \"{jc2}\"?","「{w}」… 「{jc2}」？"],ex:'think',o:[["No, it's \"{jc}\".","ちがうよ、 「{jc}」。",'fix',2],["Ding ding! Correct!","ピンポーン！ 正解！",'lie',0]]},
  a2:{m:["\"{w2}\"! I know this one. \"{jc2}\"!","「{w2}」！ これは 知ってる。 「{jc2}」！"],ex:'laugh',o:[["Correct!","正解！",'right',2],["Hmm, not sure.","うーん、 どうかな。",'tease',1]]},
  fix:{m:["Oh no! \"{jc}\"… I'll remember it. Thank you, teacher!","うわー！ 「{jc}」… 覚えた。 ありがとう、 先生！"],ex:'oops',o:[["Teacher?","先生？",'endG',1]]},
  lie:{m:["Really?! …Wait, you're smiling. That's a lie, isn't it! What's the answer?","ほんと！？ …まって、 わらってる。 うそでしょ！ こたえは？"],ex:'oops',o:[["\"{jc}\". Sorry!","「{jc}」。 ごめん！",'endF',1]]},
  right:{m:["Yay! One point for Mio! Your turn next time.","やった！ ミオに 1ポイント！ 次は きみの ばんね。"],ex:'laugh',end:'good'},
  tease:{m:["Hey! It IS \"{jc2}\". I checked it on my phone. See?","ちょっと！ ちゃんと 「{jc2}」だよ。 スマホで 調べたもん。 ほら！"],ex:'oops',end:'fun'},
  endF:{m:["Boss is a trickster! But now I'll never forget \"{w}\".","店長、 いたずらっこ！ でも これで 「{w}」は ぜったい わすれない。"],ex:'laugh',end:'fun'},
  endG:{m:["You're my English teacher today. Ha ha. Thanks!","きょうは きみが わたしの 英語の 先生。 あはは。 ありがと！"],ex:'wink',end:'good'}}}));

add('mio','o_voice',V=>({ico:'🗣️',t:'声に 出すと',nodes:{
  s:{m:["Say \"{w}\" out loud. …Don't you think it sounds cute?","「{w}」って 声に 出してみて。 …なんか かわいく ない？"],ex:'smile',
    o:[["Cute!","かわいい！",'cute',2],["No, it's cool.","いや、 かっこいい。",'cool',2],["It's just a word.","ただの 単語だよ。",'just',1]]},
  cute:{m:["Right?! \"{w}\"… I want to name a cat \"{w}\". It means \"{jc}\", though.","でしょ！ 「{w}」… ねこに つけたい 名前。 意味は 「{jc}」だけどね。"],ex:'laugh',o:[["A cat called {w}? Ha ha.","{w}って 名前の ねこ？ あはは。",'endF',1]]},
  cool:{m:["Cool? Say it like a movie hero. \"{w}.\" …Oh, that IS cool!","かっこいい？ 映画の ヒーローみたいに 言ってみて。 「{w}」。 …ほんとだ、 かっこいい！"],ex:'wow',o:[["{w}.","{w}。",'endG',2]]},
  just:{m:["Just a word? Every word has a feeling! \"{w}\", \"{jc}\"… see? It feels warm.","ただの 単語？ どの 単語にも 気持ちが あるんだよ！ 「{w}」、 「{jc}」… ね？ あったかい 感じ。"],ex:'smile',o:[["…Maybe a little.","…ちょっとだけ わかる。",'endO',1]]},
  endF:{m:["I'll ask the owner if I can have a cat at the shop. …Probably no.","お店で ねこ 飼えないか 聞いてみよ。 …たぶん だめだけど。"],ex:'laugh',end:'fun'},
  endG:{m:["Perfect hero voice! Words feel different when you play with them.","かんぺきな ヒーロー声！ ことばって 遊ぶと ちがって 聞こえるね。"],ex:'wink',end:'good'},
  endO:{m:["See? Now \"{w}\" is a special word.","でしょ？ これで 「{w}」は とくべつな 単語。"],ex:'smile',end:'ok'}}}));

/* ===================== 👦 リク ===================== */
add('riku','r_what',V=>({ico:'❓',t:'リクの 「なあに？」',nodes:{
  s:{m:["Sensei! What's \"{w}\"? I saw it in your book!","せんせい！ 「{w}」って なあに？ せんせいの 単語帳で 見た！"],ex:'smile',o:[...qJa(V,'ok','ng'),["Guess!","あててみて！",'guess',1]]},
  guess:{m:["Umm… \"{jc2}\"? No? \"{jc3}\"? …I give up! Tell me!","うーん… 「{jc2}」？ ちがう？ 「{jc3}」？ …もう わかんない！ 教えて！"],ex:'oops',o:[[`「{jc}」だよ`,'','ok',2]]},
  ng:{m:["Really? …My friend said it's \"{jc}\". Who's right?","ほんと？ …友だちは 「{jc}」って 言ってたよ。 どっちが あってるの？"],ex:'think',
    o:[["Your friend is right.","友だちが 正しい。",'ok',1],["Let's check together.","いっしょに 調べよう。",'ok',1]]},
  ok:{m:["\"{jc}\"! {e} I'll use it! \"Today I ate {w} for lunch!\"","「{jc}」！ {e} つかってみる！ 「きょう おひるに {w}を 食べた！」"],ex:'happy',
    o:[["Ha ha, you ate it?!","あはは、 食べたの！？",'ate',1],["Nice try. Let's make a better one.","いいね。 もっと いい 文を 作ろう。",'better',2]]},
  ate:{m:["Yeah! It was crunchy. …Wait, can you eat \"{w}\"?","うん！ カリカリだった。 …あれ？ {w}って 食べられるの？"],ex:'oops',end:'fun'},
  better:{m:[V.ex?"Like this? \"{ex}\" …Whoa, that's a real sentence!":"Like this? \"I like {w}!\" …Simple, but it works!",V.ex?"こう？ 「{ex}」 …わあ、 ほんものの 英文だ！":"こう？ 「アイ ライク {w}！」 …かんたんだけど、 ちゃんと 言えた！"],ex:'wow',
    o:[["Great job, Riku.","すごいよ、 リク。",'endG',2]]},
  endG:{m:["Yay! I'll tell my mom \"{w}\" tonight. Thank you, sensei!","やったー！ 今夜 お母さんに 「{w}」って 教えてあげる。 ありがと、 せんせい！"],ex:'happy',end:'good'}}}));

add('riku','r_spell',V=>{if(!plain(V.M))return null;const [b1,b2]=misspell(V.w,2);if(!b2)return null;
  return {ico:'✏️',t:'リクの スペル',v:{b1,b2},nodes:{
  s:{m:["Sensei, look! I wrote \"{jc}\" in English! {b1}. Is it right?","せんせい、 見て！ 「{jc}」を 英語で 書いたよ！ {b1}。 あってる？"],ex:'proud',
    o:H.shuffle([["It's \"{w}\".","「{w}」だよ。",'ok',2],["Yes, perfect!","うん、 かんぺき！",'yes',0],["It's \"{b2}\".","「{b2}」だよ。",'no2',0]])},
  yes:{m:["Yay! …Huh? The book says \"{w}\". Sensei!","やったー！ …あれ？ 単語帳には 「{w}」って 書いてある。 せんせい！"],ex:'oops',o:[["Oops, sorry!","あ、 ごめん！",'endF',1]]},
  no2:{m:["\"{b2}\"? Hmm… the book says \"{w}\". Is the book wrong?","「{b2}」？ うーん… 単語帳には 「{w}」って あるよ。 単語帳が まちがい？"],ex:'think',o:[["No, the book is right.","ううん、 単語帳が 正しい。",'ok',1]]},
  ok:{m:["{w}… W-O-W, so many letters! I'll write it five times. Watch me!","{w}… 字が いっぱい！ 5回 書いてみる。 見てて！"],ex:'happy',o:[["Slowly, slowly.","ゆっくり ゆっくり。",'endG',2],["Only five?","5回だけ？",'more',1]]},
  more:{m:["Then… a hundred times! …Maybe tomorrow. My hand is tired already.","じゃあ… 100回！ …やっぱり あした。 もう 手が つかれた。"],ex:'oops',end:'fun'},
  endF:{m:["Sensei made a mistake too! Ha ha! We're the same!","せんせいも まちがえた！ あはは！ おそろいだね！"],ex:'happy',end:'fun'},
  endG:{m:["Done! Look, all five are correct! Give me a hanamaru!","できた！ 見て、 5こ ぜんぶ あってる！ はなまる ちょうだい！"],ex:'happy',end:'good'}}}});

add('riku','r_race',V=>({ico:'🏁',t:'リクと 単語勝負',nodes:{
  s:{m:["I studied words too! Let's have a battle! What's \"{jc}\" in English?","ぼくも 単語 やったんだ！ 勝負しよ！ 「{jc}」は 英語で？"],ex:'proud',o:qEn(V,'win','lose')},
  win:{m:["Aww, you're fast! OK, my turn. Ask me!","えー、 はやい！ じゃあ ぼくの ばん。 問題 出して！"],ex:'oops',
    o:[["What's \"{w2}\"?","「{w2}」は？",'rk',2],["What's \"{w3}\"?","「{w3}」は？",'rk3',2]]},
  lose:{m:["Ha ha! It's \"{w}\"! I win! …Wait, I looked at your book. Is that cheating?","あはは！ 「{w}」だよ！ ぼくの 勝ち！ …あ、 せんせいの 単語帳 見ちゃった。 ずる？"],ex:'happy',o:[["Yes, that's cheating!","それは ずる！",'endF',1],["It's OK.","いいよ。",'endO',1]]},
  rk:{m:["\"{w2}\"… I know! \"{jc3}\"!","「{w2}」… わかった！ 「{jc3}」！"],ex:'proud',o:[["Close! It's \"{jc2}\".","おしい！ 「{jc2}」だよ。",'endO',2],["Correct!","正解！",'cheat',0]]},
  rk3:{m:["\"{w3}\"… \"{jc3}\"! Am I right?","「{w3}」… 「{jc3}」！ あってる？"],ex:'proud',o:[["Wow, correct!","すごい、 正解！",'endG',2]]},
  cheat:{m:["Really? Yay! …Hmm, I feel a little strange. I think it was \"{jc2}\"…","ほんと？ やったー！ …うーん、 なんか へんな 感じ。 「{jc2}」 だった 気が する…"],ex:'think',o:[["You're right. It's \"{jc2}\".","そのとおり。 「{jc2}」だよ。",'endO',1]]},
  endF:{m:["Ha ha! Then it's a tie! Rematch next time!","あはは！ じゃあ ひきわけ！ 次 また 勝負ね！"],ex:'happy',end:'fun'},
  endO:{m:["Next time I'll win for real! I'll study at home!","次は ほんとに 勝つから！ 家で 勉強してくる！"],ex:'proud',end:'ok'},
  endG:{m:["One to one! We're both strong! High five!","1対1！ ふたりとも 強い！ ハイタッチ！"],ex:'happy',end:'good'}}}));

add('riku','r_school',V=>({ico:'🏫',t:'学校の はなし',nodes:{
  s:{m:[{food:"Sensei! We had \"{w}\" at school lunch today! {e}",ani:"Sensei! I saw a picture of \"{w}\" at school! {e}",nat:"Sensei! My teacher talked about \"{w}\" today! {e}"}[V.M.a]||"Sensei! My teacher said \"{w}\" in class today!",
     ({food:"せんせい！ きょう 給食で 「{w}」が 出たよ！ {e}",ani:"せんせい！ 学校で 「{w}」の 写真 見た！ {e}",nat:"せんせい！ きょう 先生が 「{w}」の 話 してた！ {e}"})[V.M.a]||"せんせい！ きょう 学校で 先生が 「{w}」って 言ってた！"],ex:'happy',
    o:[["Do you know what it means?","意味、 知ってる？",'guess',2],["Cool! What happened?","へえ！ それで？",'story',1]]},
  guess:{m:["Umm… \"{jc2}\"!","えーっと… 「{jc2}」！"],ex:'proud',o:[["No, it's \"{jc}\".","ちがうよ、 「{jc}」。",'fix',2],["Nice guess, but…","おしいけど…",'fix',1]]},
  story:{m:["My friend said it wrong, and everyone laughed! But I didn't know it either… shh!","友だちが まちがえて、 みんな わらったの！ でも ぼくも 知らなかった… しーっ！"],ex:'oops',o:[["It means \"{jc}\".","意味は 「{jc}」だよ。",'fix',2]]},
  fix:{m:["\"{jc}\"! Now I know more than my friend! I'll teach him tomorrow!","「{jc}」！ これで 友だちより くわしい！ あした 教えてあげよ！"],ex:'happy',
    o:[["Be kind when you teach.","やさしく 教えてね。",'endG',2],["Don't show off too much.","じまん しすぎないでね。",'endF',1]]},
  endF:{m:["Just a little! A tiny show-off. Like this… \"{w}\"! Ha ha!","ちょっとだけ！ ちっちゃく じまん。 こんな ふうに… 「{w}」！ あはは！"],ex:'happy',end:'fun'},
  endG:{m:["OK! Like you, sensei. You always teach kindly.","うん！ せんせいみたいに やさしく ね。 せんせい、 いつも やさしいもん。"],ex:'happy',end:'good'}}}));

add('riku','r_gesture',V=>({ico:'🙌',t:'ジェスチャー クイズ',nodes:{
  s:{m:["Let's play a game! Do a gesture, and I'll guess the word! Pick one!","ゲームしよ！ せんせいが ジェスチャーして、 ぼくが 単語を あてる！ どれに する？"],ex:'happy',
    o:[["{w}","{jc}",'g1',2],["{w2}","{jc2}",'g2',2]]},
  g1:{m:["(watching) Hmm… is it \"{w3}\"? No? …Oh! \"{w}\"! \"{jc}\"!","（じーっ） うーん… 「{w3}」？ ちがう？ …あっ！ 「{w}」！ 「{jc}」！"],ex:'proud',o:[["Correct!","正解！",'endG',2],["You were close the first time.","さいしょも おしかった。",'endF',1]]},
  g2:{m:["(watching) Ha ha ha! What is that dance? …\"{w2}\"? \"{jc2}\"?","（じーっ） あはははは！ なに その おどり？ …「{w2}」？ 「{jc2}」？"],ex:'happy',o:[["Yes!","そう！",'endG',2],["It wasn't a dance!","おどりじゃ ない！",'endF',1]]},
  endG:{m:["Yay! Your gestures are the best, sensei! Again next time!","やったー！ せんせいの ジェスチャー、 最高！ 次も やろうね！"],ex:'happy',end:'good'},
  endF:{m:["Ha ha ha! My stomach hurts! I'll never forget this word now!","あはははは！ おなか いたい！ もう この 単語 ぜったい わすれない！"],ex:'happy',end:'fun'}}}));

/* ===================== 👩‍🦳 ノラさん ===================== */
add('nora','n_tag',V=>({ico:'🏷️',t:'英語の 値札',nodes:{
  s:{m:["Hello, dear. I'm making new price tags in English. How do I write \"{jc}\"?","あら、 こんにちは。 英語の 値札を 作ってるの。 「{jc}」って どう 書くのかしら？"],ex:'smile',o:qEn(V,'ok','ng')},
  ok:{m:["\"{w}\". {e} Lovely. \"{w}… 30 coins.\" Does it look nice?","「{w}」ね。 {e} すてき。 「{w}… 30コイン」。 どうかしら？"],ex:'happy',
    o:[["Very nice!","とても いい！",'endG',2],["30 coins is cheap!","30コインは 安い！",'cheap',1]]},
  cheap:{m:["Cheap? Then… 3000 coins! Ha ha, just kidding. You have sharp eyes for business.","安い？ じゃあ… 3000コイン！ ふふ、 じょうだんよ。 商売の 目が あるわね。"],ex:'happy',end:'fun'},
  ng:{m:["Hmm, \"{w2}\"… Pip says no. Pip, what is it? …\"{w}\"! Pip knows best.","うーん、 「{w2}」… ピップが ちがうって。 ピップ、 なあに？ …「{w}」！ ピップは 物知りね。"],ex:'think',o:[["Smart bird!","かしこい 鳥！",'endF',1],["Oops, it's \"{w}\".","あ、 「{w}」だった。",'endO',1]]},
  endG:{m:["Thank you, dear. Come and see the tag at my shop sometime.","ありがとう。 こんど お店に 値札を 見に いらっしゃい。"],ex:'smile',end:'good'},
  endO:{m:["Thank you anyway. We all learn together at this beach.","それでも ありがとう。 この 浜辺では みんなで 学ぶのよ。"],ex:'smile',end:'ok'},
  endF:{m:["Squawk! \"{w}! {w}!\" …Oh dear, now Pip won't stop.","ピーッ！ 「{w}！ {w}！」 …あらあら、 ピップが とまらないわ。"],ex:'happy',end:'fun'}}}));

add('nora','n_book',V=>V.ex&&V.M2.ex&&({ico:'📕',t:'古い 本の 一文',nodes:{
  s:{m:["I found a line in an old book from my shop. \"{ex}\" Can you tell me what it means?","お店の 古い 本で、 こんな 一文を 見つけたの。 「{ex}」 どういう 意味か わかる？"],ex:'think',
    o:H.shuffle([["{exj}","",'ok',2],[V.M2.ex[1],'','ng',0]])},
  ok:{m:["Yes, that's it! \"{w}\" is \"{jc}\". Your English is getting better and better.","そう、 それよ！ 「{w}」が 「{jc}」なのね。 あなたの 英語、 どんどん 上手に なるわね。"],ex:'happy',
    o:[["Can I read the book?","その 本、 読める？",'read',2],["Thank you, Nora.","ありがとう、 ノラさん。",'endG',1]]},
  read:{m:["Of course. I'll put it on the shelf for you. It's old, but every page has a story.","もちろん。 たなに とっておくわね。 古いけど、 どの ページにも お話が あるのよ。"],ex:'smile',end:'good'},
  ng:{m:["Hmm, I don't think so. Look at \"{w}\". It means \"{jc}\". So… \"{exj}\"","うーん、 ちがう 気が するわ。 「{w}」を 見て。 「{jc}」でしょう？ だから… 「{exj}」"],ex:'think',o:[["Oh, I see!","なるほど！",'endO',1]]},
  endG:{m:["Reading slowly is the best way. Like drinking warm tea.","ゆっくり 読むのが いちばんよ。 あたたかい お茶を 飲むみたいにね。"],ex:'smile',end:'good'},
  endO:{m:["One word can change the whole sentence. That's what makes reading fun.","1つの 単語で 文ぜんぶが かわるの。 だから 読むのは 楽しいのよ。"],ex:'smile',end:'ok'}}}));

add('nora','n_memory',V=>({ico:'☕',t:'ノラさんの 思い出',nodes:{
  s:{m:["\"{w}\"… what a nice word. It reminds me of my young days. A sailor taught me that word.","「{w}」… いい ことばね。 わかい ころを 思い出すわ。 ある 船乗りさんが 教えてくれたの。"],ex:'smile',
    o:[["A sailor?","船乗りさん？",'sailor',2],["Do you remember the meaning?","意味、 覚えてる？",'mean',1]]},
  sailor:{m:["Yes. He came to this beach every summer. He said, \"Learn one word a day, and the sea will be your friend.\"","ええ。 毎年 夏に この 浜辺に 来てね。 「1日 1つ 単語を 覚えれば、 海が 友だちに なる」って 言ってたわ。"],ex:'smile',
    o:[["One word a day…","1日 1つ…",'one',2],["Where is he now?","いまは どこに？",'where',1]]},
  where:{m:["Somewhere far away, on a big ship. Maybe he's saying \"{w}\" right now, too.","どこか 遠くの 大きな 船の 上よ。 いまごろ 「{w}」って 言ってるかもね。"],ex:'smile',o:[["That's romantic.","すてきな 話。",'endG',2]]},
  mean:{m:["Of course. \"{jc}\". I wrote it in my notebook, next to a drawing of {e}.","もちろん。 「{jc}」。 ノートに 書いたのよ。 {e}の 絵の となりにね。"],ex:'happy',o:[["Can I see it?","見ても いい？",'endO',1]]},
  one:{m:["You do twenty! Much faster than me. But slow is fine, too.","あなたは 20も！ わたしより ずっと はやいわ。 でも ゆっくりでも いいのよ。"],ex:'happy',end:'good'},
  endG:{m:["Thank you for listening to an old lady's story. Keep going, slowly.","おばあさんの 話を 聞いてくれて ありがとう。 ゆっくり つづけてね。"],ex:'smile',end:'good'},
  endO:{m:["Next time you come to my shop, I'll show you. It's a little secret.","こんど お店に 来たら 見せてあげる。 ちょっとした ひみつよ。"],ex:'smile',end:'ok'}}}));

/* ===================== 🦜 ピップ ===================== */
add('pip','p_spell',V=>{if(!plain(V.M))return null;const [b1,b2]=misspell(V.w,2);if(!b2)return null;
  return {ico:'🦜',t:'ピップの まねっこ',v:{b1,b2},nodes:{
  s:{m:["Squawk! \"{b1}! {b1}!\" (Pip flew in from the shop. It's saying your word… a little wrong.)","ピーッ！ 「{b1}！ {b1}！」 （ピップが 雑貨屋から とんできた。 きみの 単語を… ちょっと まちがえて 言ってる）"],ex:'happy',
    o:H.shuffle([["It's \"{w}\", Pip.","「{w}」だよ、 ピップ。",'ok',2],["\"{b2}\"?","「{b2}」？",'ng',0],["Good job, Pip!","ピップ、 じょうず！",'praise',0]])},
  ok:{m:["Squawk… \"{w}\"? \"{w}!\" (Pip is bobbing its head. It looks proud.)","ピーッ… 「{w}」？ 「{w}！」 （ピップが 首を ふりふり。 とくいげ）"],ex:'happy',o:[["Yes! \"{jc}\"!","そう！ 「{jc}」！",'endG',2]]},
  ng:{m:["Squawk? \"{b2}\"? (Pip tilted its head. That's not right either.) \"{w}!\" (Nora is calling from the shop.)","ピー？ 「{b2}」？ （ピップが 首を かしげた。 それも ちがうみたい） 「{w}よ！」 （ノラさんが お店から よんでる）"],ex:'think',o:[["Ha ha, Nora knows.","あはは、 ノラさん 物知り。",'endO',1]]},
  praise:{m:["Squawk! \"{b1}! {b1}! {b1}!\" (Pip is very happy. Now it will say it wrong forever.)","ピーッ！ 「{b1}！ {b1}！ {b1}！」 （ピップ、 大よろこび。 ずっと まちがえて 言いそう）"],ex:'happy',o:[["Wait! It's \"{w}\"!","まって！ 「{w}」だよ！",'endF',1]]},
  endG:{m:["Squawk! \"{w}! Twenty words! Good kid!\" (Pip flew back to the shop.)","ピーッ！ 「{w}！ 20語！ いいこ！」 （ピップは お店へ とんで帰った）"],ex:'happy',end:'good'},
  endO:{m:["Squawk! \"{w}!\" (Pip flew back with the right word.)","ピーッ！ 「{w}！」 （ピップは 正しい ことばを もって 帰っていった）"],ex:'happy',end:'ok'},
  endF:{m:["Squawk… \"{w}\"? \"{w}!\" (Phew. Pip got it in the end.)","ピー… 「{w}」？ 「{w}！」 （ふう。 さいごは ちゃんと 言えた）"],ex:'happy',end:'fun'}}}});

add('pip','p_steal',V=>({ico:'🦜',t:'ピップの いたずら',nodes:{
  s:{m:["(Pip landed on your book and grabbed a card with its beak!) Squawk! \"{jc}! {jc}!\"","（ピップが 単語帳に とまって、 カードを くちばしで くわえた！） ピーッ！ 「{jc}！ {jc}！」"],ex:'happy',
    o:[["Give it back! That's \"{w}\"!","かえして！ それ 「{w}」！",'ok',2],["That's \"{w2}\"!","それ 「{w2}」！",'ng',0],["(Offer a cookie)","（クッキーを 出す）",'cookie',1]]},
  ok:{m:["Squawk! \"{w}!\" (Pip dropped the card. It wants you to say it again.)","ピーッ！ 「{w}！」 （ピップが カードを はなした。 もう一回 言ってほしいみたい）"],ex:'happy',o:[["{w}!","{w}！",'endG',2]]},
  ng:{m:["Squawk! Squawk! (Pip shook its head. The card says \"{w}\", \"{jc}\".)","ピーッ！ ピーッ！ （ピップが 首を ふった。 カードには 「{w}」、 「{jc}」と 書いてある）"],ex:'think',o:[["Oops. \"{w}\".","あ。 「{w}」だ。",'endO',1]]},
  cookie:{m:["(Pip dropped the card and took the cookie.) Squawk! \"Cookie! Cookie!\" …It knows THAT word well.","（ピップは カードを はなして クッキーを とった） ピーッ！ 「Cookie！ Cookie！」 …その 単語は よく 知ってる。"],ex:'happy',end:'fun'},
  endG:{m:["(Pip gave you a little bow and flew back to Nora's shop.)","（ピップは ちょこんと おじぎを して、 ノラさんの お店へ 帰っていった）"],ex:'happy',end:'good'},
  endO:{m:["(Pip flew away with a happy squawk. The card is back in your book.)","（ピップは ごきげんに ないて とんでいった。 カードは ちゃんと もどった）"],ex:'happy',end:'ok'}}}));

/* ===================== 👨‍🍳 マルコさん ===================== */
add('marco','k_food',V=>V.M.a==='food'&&({ico:'🍳',t:'マルコさんの まかない',nodes:{
  s:{m:["Ciao! \"{w}\"! {e} You're studying food words? You're speaking my language!","チャオ！ 「{w}」！ {e} 食べものの 単語を 勉強中かい？ それは ぼくの 専門だよ！"],ex:'happy',
    o:[["Do you cook with it?","それで 料理 する？",'cook',2],["I love {w}.","{w}、 大好き。",'love',2],["I've never tried it.","食べた こと ない。",'never',1]]},
  cook:{m:["Of course! In my country, we say: good food needs simple words. \"{w}\", salt, love. That's all.","もちろん！ ぼくの 国では こう 言うんだ。 いい 料理に むずかしい ことばは いらない。 「{w}」、 塩、 愛。 それだけ。"],ex:'happy',o:[["Salt and love?","塩と 愛？",'endG',2]]},
  love:{m:["Wonderful! Then next time, order it in English: \"I'd like some {w}, please.\"","すばらしい！ じゃあ 次は 英語で 注文してね。 「I'd like some {w}, please.」"],ex:'happy',o:[["I'd like some {w}, please.","{w}を ください。",'endG',2]]},
  never:{m:["Never?! Mamma mia! Come to my diner. I'll make you a little plate of \"{w}\". It means \"{jc}\", you know.","ない！？ マンマ・ミーア！ 食堂に おいで。 「{w}」の 小さな 一皿を 作るよ。 「{jc}」の ことだからね。"],ex:'wow',end:'fun'},
  endG:{m:["Perfect! Words taste better when you say them with a smile. Buon appetito!","かんぺき！ ことばは 笑顔で 言うと もっと おいしく なるんだ。 ボナペティート！"],ex:'happy',end:'good'}}}));

add('marco','k_menu',V=>({ico:'📋',t:'へんな メニュー',nodes:{
  s:{m:["I'm thinking of a new menu name. How about… \"{w} Soup\"? {e}","新しい メニューの 名前を 考えてるんだ。 「{w} スープ」… なんて どうだい？ {e}"],ex:'think',
    o:[["What does \"{w}\" mean?","「{w}」って どういう 意味？",'mean',2],["Sounds delicious!","おいしそう！",'yum',1],["Maybe not…","それは ちょっと…",'no',1]]},
  mean:{m:["Ah, good question. \"{w}\" is \"{jc}\". …Hmm, \"{jc} soup\"? Maybe that's strange.","いい しつもんだ。 「{w}」は 「{jc}」。 …うーん、 「{jc}スープ」？ へんかもな。"],ex:'think',o:[["A little strange.","ちょっと へん。",'endO',1],["I'd try it!","食べてみたい！",'yum',2]]},
  yum:{m:["Ha ha! You're brave. OK, \"{w} Soup\" is on the menu tomorrow! …Just kidding. Probably.","はっはっは！ 勇気が あるね。 よし、 あしたの メニューに 「{w} スープ」！ …じょうだんだよ。 たぶん。"],ex:'happy',end:'fun'},
  no:{m:["No? You're right. A good chef listens to customers. What about \"{w2} Pasta\"?","だめ？ そうだね。 いい シェフは お客さんの 声を 聞くんだ。 じゃあ 「{w2} パスタ」は？"],ex:'think',o:[["\"{w2}\" is \"{jc2}\"…","「{w2}」は 「{jc2}」…",'endF',1],["Just call it Pasta.","ふつうに パスタで いいよ。",'endO',1]]},
  endF:{m:["\"{jc2} pasta\"!? Ha ha! OK, OK. I'll keep my day job. Words are fun, but cooking is easier.","「{jc2}パスタ」！？ はっはっは！ わかった わかった。 ことばは 楽しいけど、 料理の ほうが かんたんだ。"],ex:'happy',end:'fun'},
  endO:{m:["Simple is best. Just like learning: one word at a time.","シンプルが いちばん。 勉強と 同じで、 1語ずつ だね。"],ex:'smile',end:'ok'}}}));

add('marco','k_order',V=>({ico:'🍽️',t:'英語で 注文',nodes:{
  s:{m:["Let's play \"restaurant\"! I'm the waiter. \"Good evening! What would you like?\"","「レストランごっこ」を しよう！ ぼくが 店員さん。 「こんばんは！ ご注文は？」"],ex:'happy',
    o:[["I'd like {w}, please.","{w}を ください。",'a',2],["What do you recommend?","おすすめは？",'rec',2]]},
  a:{m:[V.M.a==='food'?"Excellent choice! One {w}, coming right up! {e}":"\"{w}\"? Hmm, that's not on the menu… It's \"{jc}\", right? Ha ha! Nice try!",V.M.a==='food'?"いい 注文だ！ {w}、 すぐ おもちします！ {e}":"「{w}」？ うーん、 それは メニューに ないなあ… 「{jc}」でしょ？ はっはっは！ いい チャレンジ！"],ex:'happy',
    o:[["Thank you!","ありがとう！",'endG',2],["Can I have {w2}, too?","{w2}も ください。",'two',1]]},
  rec:{m:["Today's special is \"{w}\" with a side of \"{w2}\". {e} Delicious words!","きょうの おすすめは 「{w}」と 「{w2}」の セット。 {e} おいしい 単語だよ！"],ex:'happy',o:[["I'll take it!","それに する！",'endG',2],["What's \"{w2}\"?","「{w2}」って なに？",'w2',1]]},
  w2:{m:["\"{w2}\" is \"{jc2}\". It goes well with \"{w}\"! …I think.","「{w2}」は 「{jc2}」。 「{w}」と よく 合うんだ！ …たぶんね。"],ex:'think',end:'fun'},
  two:{m:["\"{w2}\" too? A big order! You must be hungry from studying.","「{w2}」も？ 大注文だ！ 勉強して おなかが すいたんだね。"],ex:'happy',end:'fun'},
  endG:{m:["Grazie! You order like a real traveler. Come to my diner anytime.","グラッツェ！ ほんものの 旅人みたいに 注文できたね。 いつでも 食堂に おいで。"],ex:'happy',end:'good'}}}));

/* ================================================================ who comes, which talk */
/* the words for this talk: the main word + 2 more with different meanings */
function vals(R){const W=H.shuffle(R.map(word));const pr=W.filter(w=>!w.learned).concat(W.filter(w=>w.learned));
  const M=pickL(pr.slice(0,Math.max(3,Math.ceil(pr.length/2))))||W[0];
  const others=W.filter(w=>w!==M&&w.jc!==M.jc&&w.en!==M.en),pick2=[];
  for(const w of others)if(!pick2.some(x=>x.jc===w.jc||x.en===w.en))pick2.push(w);
  /* not enough different words (a short season book): borrow from the same level */
  while(pick2.length<2){try{const c=pickL(CG.W.filter(x=>x.lv===M.lv));const w={lv:c.lv,en:c.en,h:c.h,ja:c.ja,jc:jaCore(c.ja),e:c.e,a:c.a,ex:null};
    if(w.jc!==M.jc&&!pick2.some(x=>x.jc===w.jc))pick2.push(w)}catch(e){break}}
  const [M2,M3]=pick2;
  return {M,M2,M3,w:M.en,jc:M.jc,e:M.e,w2:M2.en,jc2:M2.jc,w3:M3.en,jc3:M3.jc,ex:M.ex?M.ex[0]:'',exj:M.ex?M.ex[1]:''}}
const fill=(s,V)=>String(s==null?'':s).replace(/\{(\w+)\}/g,(m,k)=>V[k]!=null&&typeof V[k]!=='object'?V[k]:m);
/* the person: someone you have met, not the same as last time. food words call Marco, many animals call Pip */
function who(V,R){const ws=R.map(word),n=a=>ws.filter(w=>w.a===a).length;
  const L=Object.keys(met).filter(k=>{try{return met[k]()}catch(e){return false}}).filter(k=>k!==TT.who[0]);
  if(!L.length)return 'mina';
  const wt={mina:3,mio:3,riku:3,nora:2,pip:1.5,marco:1.5};
  if(n('food')>=3)wt.marco=6;if(n('ani')>=3)wt.pip=4;if(TT.who.slice(0,3).includes('mina'))wt.mina=1.5;
  let s=L.reduce((a,k)=>a+wt[k],0)*Math.random();for(const k of L){s-=wt[k];if(s<=0)return k}return L[0]}
function choose(){const R=TT.r.slice(-EVERY);if(R.length<3)return null;
  for(let tries=0;tries<6;tries++){const V=vals(R),p=who(V,R);
    const C=H.shuffle(T.filter(t=>t.who===p)),fresh=C.filter(t=>!TT.used.includes(t.id));
    for(const t of fresh.concat(C)){let x=null;try{x=t.f(V)}catch(e){x=null}if(x){Object.assign(V,x.v||{});return {p,t,x,V}}}}
  return null}

/* ================================================================ the screen */
const ENDN={good:['★','いい エンド'],ok:['🙂','ふつうの エンド'],fun:['😂','おもしろ エンド']};
let OV=null;
function closeOv(){if(OV){OV.remove();OV=null}try{speechSynthesis.cancel()}catch(e){}}
/* step 1: someone pops in */
function knock(){const pk=choose();if(!pk){TT.n=0;save();return}
  closeOv();try{speechSynthesis.cancel()}catch(e){}
  const {p}=pk,W=WHO[p];
  const hi={mina:["おつかれさま！ 20語 めくったね。 ちょっと おしゃべり しない？","ひとやすみ しよう。 さっきの 単語の こと、 話そ？","がんばってるね。 先生、 ちょっと 来ちゃった"],
    mio:["あ、 いたいた！ 単語帳？ ちょっと 聞いて〜","おつかれさまです！ お店 ぬけて きちゃった。 1つ 聞いても いい？","わ、 勉強中？ じゃま しないから… ちょっとだけ！"],
    riku:["せんせーい！ なにしてるの？ 単語帳？ ぼくも まぜて！","あっ、 せんせい みっけ！ ねえねえ、 聞いて！","せんせい、 ひま？ …じゃなくて、 ちょっと だけ いい？"],
    nora:["あらあら、 がんばってるわね。 ちょっと いいかしら？","こんにちは。 お茶の 時間よ。 少し 話さない？"],
    pip:["バサバサッ！ （ピップが とんできた）","ピーッ！ （ピップが 単語帳の 上に とまった）"],
    marco:["おや、 勉強中かい？ まかないの 差し入れだよ。 ちょっと 話そう","チャオ！ 単語帳かい？ ぼくにも 見せて！"]}[p];
  OV=document.createElement('div');OV.className='ttov';OV.dataset.stay=1;
  OV.innerHTML=`<div class="ttknock"><div class="ttpk">${face(p,'smile')}</div><div class="ttkb"><b>${W.n}</b><p>${esc(pickL(hi))}</p>
    <div class="ttkr"><button id="ttGo">💬 話す</button><button id="ttLater" class="ttsub">あとで</button></div></div></div>`;
  document.body.appendChild(OV);sf('talk');
  $('ttGo').onclick=()=>{sf('tap');run(pk)};
  $('ttLater').onclick=()=>{sf('back');TT.n=EVERY-LATER;TT.pend=0;save();closeOv();bar()}}
/* step 2: the talk */
function run(pk){const {p,t,x,V}=pk,W=WHO[p];
  TT.n=0;TT.pend=0;TT.used.unshift(t.id);TT.used=[...new Set(TT.used)].slice(0,10);TT.who.unshift(p);TT.who.length=Math.min(TT.who.length,4);save();
  OV.innerHTML=`<div class="ttbox"><div class="tttop"><span>${x.ico} ${esc(x.t)}</span><button id="ttX" class="ttsub" aria-label="とじる">×</button></div>
    <div class="ttlog" id="ttlog"></div><div class="ttopt" id="ttopt"></div></div>`;
  const logE=$('ttlog'),optE=$('ttopt');let pts=0,alive=true;
  $('ttX').onclick=()=>{alive=false;sf('back');closeOv();bar()};
  const live=()=>alive&&OV&&OV.contains(logE);
  const line=(r,en,ja,ex)=>{if(!live())return;const d=document.createElement('div');d.className='tkl '+({c:'tkc',me:'tkme',nt:'tknt'})[r];
    if(r==='nt')d.innerHTML=`<p>${en}</p>`;
    else{d.innerHTML=`${r==='c'?`<i class="ttf">${face(p,ex)}</i>`:''}<div><b>${r==='c'?W.n:'きみ'}</b><p class="en">${esc(en)}</p>${ja&&ja!==en?`<p class="ja">${esc(ja)}</p>`:''}</div>`;
      if(r==='c'){d.onclick=()=>speak(p,en);speak(p,en)}}
    logE.appendChild(d);logE.scrollTop=logE.scrollHeight};
  const node=n=>{if(!live())return;line('c',fill(n.m[0],V),fill(n.m[1],V),n.ex);
    /* 答えと おわりは セリフを 読みおわってから */
    const wait=(fn,ms)=>H.afterTalk?H.afterTalk(fn,300,ms,live):setTimeout(fn,ms);
    if(n.end)return wait(()=>end(n),700);
    wait(()=>{if(!live())return;
      optE.innerHTML=n.o.map((o,i)=>`<button data-i="${i}">${esc(fill(o[0],V))}${o[1]&&fill(o[1],V)!==fill(o[0],V)?`<small>${esc(fill(o[1],V))}</small>`:''}</button>`).join('');
      optE.querySelectorAll('[data-i]').forEach(b=>b.onclick=()=>{const o=n.o[+b.dataset.i];sf('tap');optE.innerHTML='';line('me',fill(o[0],V),fill(o[1],V));pts+=o[3]||0;
        const nx=x.nodes[o[2]];setTimeout(()=>{if(live()&&nx)node(nx)},600)})},650)};
  const end=n=>{if(!live())return;const E=ENDN[n.end]||ENDN.ok,ek=t.id+':'+n.end,isNew=!TT.ends[ek];TT.ends[ek]=1;
    TT.talks++;TT.by[p]=(TT.by[p]||0)+1;TT.last={who:p,w:V.w,jc:V.jc,t:Date.now(),id:t.id};
    const coins=(isNew?3:1)+(n.end==='good'?2:1);
    /* now and then a card of the word (more often when the talk is about cards) */
    const card=null;   // 11/18 ユーザー「カードは 鉱山で ほって ゲット」: おしゃべりで カードを もらう しくみは なくした
    save();try{RECENT.add('tango',{who:p,en:V.w,ja:V.jc,card:card||''})}catch(e){}
    try{const r=logE.getBoundingClientRect();H.coinBurst(r.left+r.width/2,r.top+r.height/2,coins)}catch(e){H.addCoins(coins)}
    line('nt',`${E[0]} 「${E[1]}」${isNew?' NEW!':''}　🪙${coins}`);
    line('nt',`📌 ${esc(V.w)} ＝ ${esc(V.jc)}`);
    if(card){const I=CG.info(card);const d=document.createElement('div');d.className='ttcard';
      d.innerHTML=`<p>🎴 ${W.n}から 「${esc(I.en)}」の カードを もらった！<small>カードショップの 倉庫に 入れたよ</small></p><div class="ttcf">${CG.face(card,{ja:1})}</div>`;
      logE.appendChild(d);setTimeout(()=>{logE.scrollTop=logE.scrollHeight;sf('card');try{H.say(I.lv,I.en)}catch(e){}},400);logE.scrollTop=logE.scrollHeight}
    optE.innerHTML=`<button id="ttBack">📕 単語帳に もどる</button>`;
    $('ttBack').onclick=()=>{alive=false;sf('flip');closeOv();bar()};
    sf(n.end==='good'?'done':'pop')};
  sf('talk');node(x.nodes.s)}

/* ================================================================ the word book */
/* count every card that comes up (not the same one twice in a row) */
/* 11/18 ユーザー「途中で 出てくる イベント いらない」「メーター（だれかが 来るまで）が わかりにくい」:
   単語帳で 20語ごとに だれかが 割り込む おしゃべりと その メーターは なくした（会話の データは のこしてある） */
let lastW='';
const bar=()=>{};
/* 🎵 BGM button, when the word book opens */
H.on('cardsOpen',()=>{lastW='';TT.pend=0;const seg=H.panel.querySelector('.wb .seg.only');if(!seg)return;
  const b=document.createElement('button');b.id='ttBgm';b.className='ttbgm'+(TT.bgm?' tton':'');b.setAttribute('aria-label','BGM オン・オフ');b.innerHTML=TT.bgm?'🎵 ON':'🎵 OFF';seg.appendChild(b);
  b.onclick=e=>{e.stopPropagation();TT.bgm=TT.bgm?0:1;if(TT.bgm)TT.song=nextSong();save();b.classList.toggle('tton',!!TT.bgm);b.innerHTML=TT.bgm?'🎵 ON':'🎵 OFF';sf('pop');
    if(TT.bgm&&!ST.sound)H.toast('🔇 音を オンにすると きこえるよ');else if(TT.bgm&&TRACKS[TT.song])H.toast(`🎵 ${TRACKS[TT.song].name}`,1800);
    H.musAt()};
});
/* slow lo-fi songs for the word book (a new one each time you turn it on) */
const SONGS=()=>Object.keys(typeof TRACKS!=='undefined'?TRACKS:{}).filter(k=>/^lofi_/.test(k));
function nextSong(){const L=SONGS().filter(k=>k!==TT.song);return pickL(L)||TT.song||''}
if(H.placeBgm)H.placeBgm('cards',{id:()=>TT.bgm?(TRACKS[TT.song]?TT.song:(TT.song=nextSong())):null,v:.35});
/* arrow keys and stray taps don't turn cards under the talk */

window.TANGO={rec:()=>TT,knock,talks:T,_choose:choose,_force:(id)=>{const t=T.find(x=>x.id===id);if(!t)return;const V=vals(TT.r.slice(-EVERY));const x=t.f(V);if(!x)return 'no';Object.assign(V,x.v||{});closeOv();
  OV=document.createElement('div');OV.className='ttov';OV.dataset.stay=1;document.body.appendChild(OV);run({p:t.who,t,x,V})}};

/* ================================================================ ミナ先生の セリフ */
const ML=(k,v)=>{try{return MINA.line(k,v||{})}catch(e){return ['smile','']}};
Object.assign(MINA_LINES,{
 tt_new:[['happy','単語帳、 のんびり やろうね。 上の 🎵 で ゆっくりな BGMも かけられるよ']],
 x_ttQuiet:[['smile','単語帳は もう だれも 割り込まないよ。 じぶんの ペースで めくってね'],['happy','単語帳、 しずかに 集中できるように したよ。 🎵 BGMと 波の 音だけ どうぞ']],
 x_ttBgm:[['smile','単語帳の 上の 🎵 を おすと、 ゆっくりな ローファイが ながれるよ。 波の 音と いっしょに どうぞ'],['happy','のんびり 覚えたい 日は、 単語帳で 🎵 BGMを オンに してみて']],
 x_ttLast:[['happy','{who}と 「{w}」の 話を したんだって？ 「{jc}」、 もう 覚えたね'],['smile','さっき {who}が 「{w}」の 話を してたって。 だれかと 話した 単語は わすれにくいんだよ'],
  ['think','「{w}」って 「{jc}」だったよね。 {who}との おしゃべり、 楽しかった？']],
 x_ttLastMe:[['happy','さっきの 「{w}」の おしゃべり、 楽しかったね。 また 20語 めくったら 行くね'],['love','単語帳で きみと 話すの、 先生 けっこう 好きなんだ。 「{w}」、 わすれないでね']],
 x_ttNear:[['smile','単語帳、 あと {n}語 めくると だれかが 遊びに 来るよ。 だれかな？'],['think','カードの 下の 点が いっぱいに なると、 おしゃべりの 時間。 あと {n}語だよ']],
 x_ttCards:[['proud','おしゃべりで もらった カード、 もう {n}まいだね。 カードショップの 倉庫に 入ってるよ'],['happy','単語帳の おしゃべりで もらった カードは、 鉱山の 道具にも なるんだよ']]});
const WN={mina:'先生',mio:'ミオさん',riku:'リクくん',nora:'ノラさん',pip:'ピップ',marco:'マルコさん'};
const goTango=()=>['📕 単語帳を ひらく',()=>H.books()];
if(window.MINA_SENSE&&MINA_SENSE._rules)MINA_SENSE._rules.push(
 ['x_ttBgm',1,()=>!TT.bgm?{}:null,goTango],
 ['x_ttQuiet',2,()=>TT.talks>=1&&Date.now()<Date.UTC(2026,11,2)?{}:null,goTango]);   // 割り込みの おしゃべり（x_ttLast/x_ttNear/x_ttCards）は 11/18 に なくした
/* 新しく できたことを 1回だけ */
setTimeout(function first(){if(TT.told)return;const m=window.MINA;if(!m||!m.canAnnounce||!m.canAnnounce())return setTimeout(first,20000);
  TT.told=1;save();const [ex,tx]=ML('tt_new');m.say('m',ex,tx,10000,null,goTango())},34000);
})();
