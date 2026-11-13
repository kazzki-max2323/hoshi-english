/* ボトルメール: 浜辺に ながれつく びん（beach/scene.js の bottle イベント）を タップすると、中の 英語の 手紙が 読める。
   - 手紙は 英語だけ 先に 見せて、日本語は 「日本語を 見る」で ひらく（画面は シンプルに）
   - 🔊 で 読みあげ。とじると ミナ先生が 手紙の ことばを ひとつ 教えてくれる
   - 読んだ 手紙は おぼえておき、まだ 読んでいない 手紙から 先に 届く */
(()=>{
const {S:ST,sfx:SFX}=BEACH;
const H=HE,esc=H.esc,$=id=>document.getElementById(id);

/* [英語, 日本語, 差出人, 教える ことば, その いみ] */
const LETTERS=[
 ['Hello! I am a little girl from Canada. Do you like the sea?','こんにちは！ カナダの 女の子です。 海は 好き？','🇨🇦 カナダの 女の子','sea','海'],
 ['If you find this bottle, please make a wish.','この びんを 見つけたら、 願いごとを してね。','🌠 星の 好きな だれか','wish','願いごと'],
 ['I miss my old friends. I hope they are happy.','むかしの 友だちに 会いたいな。 みんな 元気だと いいな。','🏝️ 南の 島の 人','miss','〜が いなくて さびしい'],
 ['Today is my birthday. I am ten years old!','きょうは ぼくの 誕生日。 10さいに なったよ！','🎂 10さいの 男の子','birthday','誕生日'],
 ['The stars are beautiful tonight. Are you looking at them too?','今夜は 星が きれい。 あなたも 見てる？','🔭 灯台守','tonight','今夜'],
 ['My cat is sleeping next to me. She is very warm.','ねこが となりで ねてる。 とっても あったかい。','🐱 ねこと くらす 人','next to','〜の となりに'],
 ['I am learning Japanese. Arigato is my favorite word!','日本語を 勉強中です。 「ありがとう」が いちばん 好きな ことば！','🇺🇸 アメリカの 学生','favorite','いちばん 好きな'],
 ['Don\'t give up. Small steps are still steps.','あきらめないで。 小さな 一歩も ちゃんと 一歩だよ。','🐢 ゆっくり 歩く カメより','give up','あきらめる'],
 ['This bottle traveled for three years. Thank you for finding it.','この びんは 3年 旅を してきた。 見つけてくれて ありがとう。','⛵ 船乗り','travel','旅する'],
 ['I can\'t swim, but I love the ocean.','泳げないけど、 海が 大好き。','🌊 海辺の おばあさん','ocean','海・大洋'],
 ['Please write back! My address is inside.','お返事 ください！ 住所は 中に 入ってます。','✉️ 文通 したい 子','write back','返事を 書く'],
 ['It is raining here. I am drinking hot chocolate.','こっちは 雨。 ホットココアを 飲んでるよ。','☔ イギリスの 人','raining','雨が ふっている'],
 ['Be kind to yourself today.','きょうは 自分に やさしくね。','💛 だれかより','kind','やさしい'],
 ['I saw a whale this morning. It was bigger than our boat!','けさ クジラを 見たよ。 ぼくたちの 船より 大きかった！','🐋 漁師の 子','bigger than','〜より 大きい'],
 ['Do you have a dream? Mine is to fly.','夢は ある？ わたしの 夢は 空を 飛ぶこと。','🕊️ パイロットに なりたい 子','dream','夢'],
 ['Every sunset is different. That is why I watch it every day.','夕日は 毎日 ちがう。 だから 毎日 見るんだ。','🌅 夕日の 写真家','different','ちがう'],
 ['I lost my red umbrella on this beach. Have you seen it?','この 浜辺で 赤い かさを なくしたの。 見なかった？','☂️ わすれんぼう','lost','なくした（lose の 過去形）'],
 ['Mistakes help us learn. Keep going!','まちがいは 学ぶ 助けに なる。 その ちょうし！','📚 先生より','mistake','まちがい'],
 ['My grandfather taught me how to fish.','おじいちゃんが 魚の つり方を 教えてくれた。','🎣 つり好きの 子','taught','教えた（teach の 過去形）'],
 ['I wonder who will read this letter.','この 手紙を だれが 読むのかな。','❓ ふしぎに 思う 人','wonder','〜かなと 思う'],
 ['Have a nice day, my friend across the sea.','いい 1日を、 海の 向こうの 友だち。','🌏 地球の どこか','across','〜の 向こうに'],
 ['We are moving to a new town tomorrow. I am a little nervous.','あした 新しい 町に ひっこすんだ。 ちょっと ドキドキ。','📦 ひっこす 子','nervous','きんちょうして'],
 ['The moon was so bright that I could read a book outside.','月が とても 明るくて、 外で 本が 読めたよ。','🌕 月夜の 読書家','so 〜 that','とても〜なので'],
 ['If I were a bird, I would fly to you.','もし 鳥だったら、 あなたの ところへ 飛んでいくのに。','🐦 遠くの だれか','If I were','もし わたしが〜なら'],
 ['I have been writing letters like this for ten years.','こんな 手紙を 10年 書きつづけているよ。','🖋️ 手紙 好きの おじいさん','have been 〜ing','ずっと〜している'],
 ['You don\'t have to be perfect. Just be you.','かんぺきじゃ なくて いい。 あなたらしく いてね。','🌼 花屋さん','perfect','かんぺきな'],
 ['The shell I found yesterday sounds like the sea.','きのう 見つけた 貝がら、 海の 音が するよ。','🐚 貝がら 集めの 子','sounds like','〜のように 聞こえる'],
 ['Thank you for reading. Smile when you finish this letter!','読んでくれて ありがとう。 読みおわったら ニコッと してね！','😊 にこにこ さん','smile','ほほえむ'],
 ['I am a penguin. Just kidding! I am a scientist in Antarctica.','ぼくは ペンギンです。 なーんて、 南極の 科学者です！','🐧 南極の 科学者','Just kidding','なんてね・じょうだんだよ'],
 ['Learning a language is like opening a new window.','ことばを 学ぶのは 新しい まどを ひらくような もの。','🪟 旅する 作家','language','ことば・言語'],
 ['Someday I want to visit Japan and see the cherry blossoms.','いつか 日本に 行って 桜を 見たい。','🌸 フランスの 学生','someday','いつか'],
 ['My little brother drew a map. I think it shows a treasure!','弟が 地図を かいたの。 たからの 場所 かも！','🗺️ 宝さがしの 姉','treasure','たから'],
 ['When you feel tired, listen to the waves.','つかれたら、 波の 音を 聞いてみて。','🌙 夜の 浜辺の だれか','tired','つかれた'],
 ['I was born on an island where it never snows.','ぼくは 雪が ふらない 島で 生まれたんだ。','🌴 南の 島の 男の子','was born','生まれた'],
 ['Whoever finds this, you are braver than you think.','これを 見つけた あなたへ。 あなたは 思っているより 勇気が あるよ。','🦁 名前のない だれか','brave','勇気のある'],
];

/* which letters were read: keep it in the save */
const BD=(()=>{try{const s=JSON.parse(localStorage.getItem(SAVE_KEY)||'{}').bottle;if(s&&Array.isArray(s.r))return s}catch(e){}return {r:[],n:0}})();
_saveHooks.push(()=>{const s=JSON.parse(localStorage.getItem(SAVE_KEY)||'{}');s.bottle=BD;localStorage.setItem(SAVE_KEY,JSON.stringify(s))});
function pickLetter(){const left=LETTERS.map((l,i)=>i).filter(i=>!BD.r.includes(i)),pool=left.length?left:LETTERS.map((l,i)=>i);return pool[Math.random()*pool.length|0]}

const M=()=>window.MINA;
/* Mina says a line from MINA_LINES[key] on the home row (or a toast when another screen is open) */
function mina(key,v,ms=7000){const m=M();if(!m)return;const [ex,tx]=m.line(key,v);if(H.screen==='home'&&!m.busy())m.say('m',ex,tx,ms);else if(key!=='bottleArrive')H.toast(`<b>ミナ先生</b> ${tx}`,4200)}

/* the bottle washed up (called by the scene) */
window.bottleArrive=()=>{setTimeout(()=>{const m=M();if(m&&m.canAnnounce&&m.canAnnounce())mina(BD.n?'bottleArrive':'bottleFirst',{},8000)},1800)};

/* the bottle was tapped (called by the scene) */
window.bottleOpen=()=>{/* 💌 ミナ先生からの ラブレターが まざる ことも（game/love.js） */
  try{if(window.LOVE&&LOVE.letterDue()){LOVE.letter();return}}catch(e){}
  const i=pickLetter(),L=LETTERS[i];let p=$('bmPop');if(p)p.remove();
  if(!BD.r.includes(i))BD.r.push(i);BD.n=(BD.n||0)+1;save();try{SFX.book()}catch(e){}
  p=document.createElement('div');p.id='bmPop';
  p.innerHTML=`<div class="bmPaper"><small class="bmFrom">${esc(L[2])} より</small>
    <p class="bmEn">${esc(L[0])}</p>
    <p class="bmJa" hidden>${esc(L[1])}</p>
    <div class="bmBtns"><button id="bmSay" class="sub">🔊 きく</button><button id="bmJaB" class="sub">日本語を 見る</button></div>
    <button id="bmClose">とじる</button></div>`;
  document.body.appendChild(p);requestAnimationFrame(()=>p.classList.add('on'));
  p.addEventListener('pointerdown',e=>e.stopPropagation());
  $('bmSay').onclick=e=>{e.stopPropagation();H.say('es',L[0])};
  $('bmJaB').onclick=e=>{e.stopPropagation();try{SFX.pop()}catch(x){}p.querySelector('.bmJa').hidden=false;e.target.remove()};
  const close=()=>{try{speechSynthesis.cancel()}catch(x){}try{SFX.pop()}catch(x){}p.classList.remove('on');setTimeout(()=>p.remove(),300);
    const n=BD.r.length;setTimeout(()=>{if(n===LETTERS.length&&!BD.all){BD.all=1;save();mina('bottleAll',{n})}else if(n>1&&n%5===0)mina('bottleCount',{n});else mina('bottleRead',{w:L[3],ja:L[4]})},500)};
  $('bmClose').onclick=e=>{e.stopPropagation();close()};
  p.addEventListener('click',e=>{if(e.target===p){e.stopPropagation();close()}});   // the dark around the letter closes it too
  p.onclick=e=>{if(e.target===p)close()}};

window.BOTTLE={letters:LETTERS,rec:()=>BD,open:()=>window.bottleOpen()};
})();
