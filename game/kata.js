/* 🧩 英語の 型（11/22 ユーザー「日本人からすると、 英語の 決まった 型を 理解するのが 難しい」→「つくって」）
   日本人が つまずく 英語の 決まった 型を 1まいずつの 小さな カードに。 見たら すぐ 思い出せる ように。
   1まい = 型の 図・ 例文🔊・ 🇯🇵 日本語との ちがい・ ミナ先生の ひとこと（＋ 🙋 くわしく・ ⚡ ためす）
   ─ 置き場所（入口は ふやさない）─────────────────────────
   ・ふだんは 「その 型で つまずいた とき」に さっと 出る:
       ⚡特別練習で まちがえた とき（🧩 チップ）・ 🤔 教えて の 中・ 🙋 しつもんの 答えの さいご・ 💡 まめちしきの 中
   ・あつまった カードを 見る ところは ☕ おしゃべりの ページの 小さな 1行 だけ（KATA.list）
   ・出会った 型は あつまっていく（数は 見せない。 まだの 型は うすく）
   きろくは localStorage 'hoshi_kata'（s: 出会った 時刻） */
(()=>{
if(!window.UNIT||!UNIT.F)return;
const H=window.HE||{},esc=H.esc||(s=>String(s)),$=id=>document.getElementById(id);
const SFX=(window.BEACH&&BEACH.sfx)||{};const snd=k=>{try{SFX[k]&&SFX[k]()}catch(e){}};
const talk=en=>{try{speechSynthesis.cancel();window.SENSEI&&SENSEI.talk(en)}catch(e){}},hush=()=>{try{speechSynthesis.cancel()}catch(e){}};
const face=(ex,tx)=>{try{return MINA.face('m',ex,MINA.poseFor?MINA.poseFor(ex,tx||''):undefined)}catch(e){return ''}};
const ML=(k,v)=>{try{return MINA.line(k,v||{})}catch(e){return ['smile','']}};
const {B,row,note,two,tbl}=UNIT.F;
const KEY='hoshi_kata',R=(()=>{try{return JSON.parse(localStorage.getItem(KEY)||'{}')||{}}catch(e){return {}}})();R.s=R.s||{};
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(R))}catch(e){}};
const P=t=>B(t,'o'); /* 「＋」など */

/* g = まとまり、 t = 型の 名前、 f = 型の 図、 jp = 日本語との ちがい、 ex = 例文、 say = ミナ先生の ひとこと（[顔, ことば]）
   qa = 🙋 しつもんの id（くわしく）、 dr = ⚡特別練習の カテゴリー（ためす） */
const G=[['set','🔗 前と 後ろの セット'],['verb','🚀 動詞の きまり'],['ans','💬 答え方・ 言い方'],['jp','🇯🇵 日本語と ちがう ところ']];
const K=[
 {id:'pair_gen',g:'set',ico:'🔗',t:'can・will・do・to の あとは 原形',qa:'been_be',dr:'form',
  f:row([B('can・will・do・to','m'),P('＋'),B('原形','v')])+row([B('He','s'),B('can','m'),B('swim.','v')],'o')+row([B('He','s'),B('can','m'),B('swims.','x')],'x'),
  jp:'日本語は 「およげる・およぎたい」と 後ろが 自由に 形を かえる。 英語は <b>前の ことばが 後ろの 形を 決める</b>。 前を 見たら 後ろは もう 決まり',
  ex:[['He can swim.','彼は およげる'],['I want to go home.','家に 帰りたい'],['Does she like dogs?','彼女は 犬が 好き？']],
  say:['smile','can・will・do・to を 見たら、 後ろは <b>はだかの 動詞</b>。 -s も -ed も つかないよ']},
 {id:'pair_pp',g:'set',ico:'⏳',t:'have の あとは 過去分詞',qa:'been_be',
  f:row([B('have / has','m'),P('＋'),B('過去分詞','v')])+row([B('I','s'),B('have','m'),B('been','v'),P('here.')],'o')+row([B('I','s'),B('have','m'),B('be','x'),P('here.')],'x'),
  jp:'日本語の 「〜した ことが ある・ ずっと 〜している」は 1つの ことば。 英語は <b>have と 過去分詞の 2つで 1セット</b>',
  ex:[['I have been to Kyoto.','京都に 行った ことが ある'],['She has lost her key.','かぎを なくして 今も ない'],['Have you ever seen it?','見た ことある？']],
  say:['proud','have be は ない。 <b>have been</b> で ひとかたまり、 って 口で 覚えちゃおう']},
 {id:'pair_ing',g:'set',ico:'🏃',t:'be の あとの -ing ＝ 今 している',qa:'be_yousu',dr:'be',
  f:row([B('be','m'),P('＋'),B('-ing','v')])+row([B('She','s'),B('is','m'),B('cooking.','v')],'o')+row([B('She','s'),B('cooking.','x')],'x'),
  jp:'「料理して <b>いる</b>」の 「いる」が be。 日本語は 「いる」が なくても 通じるけど、 英語は <b>be が ないと 文に ならない</b>',
  ex:[['She is cooking now.','彼女は 今 料理している'],['They are playing tennis.','テニスを している'],["I'm coming!",'今 行くよ！']],
  say:['happy','-ing は 「している 様子」の ことば。 様子の ことばには いつも be が いっしょ']},
 {id:'pair_pass',g:'set',ico:'📦',t:'be の あとの 過去分詞 ＝ 〜される',
  f:row([B('be','m'),P('＋'),B('過去分詞','v')])+row([B('This','s'),B('was','m'),B('made','v'),P('in Japan.')],'o')+row([B('This','s'),B('made','x'),P('in Japan.')],'x'),
  jp:'日本語は 「作ら<b>れた</b>」と 動詞の おしりが かわる。 英語は <b>be と 過去分詞の セット</b>で 「〜される」',
  ex:[['This was made in Japan.','これは 日本で 作られた'],['English is spoken here.','ここでは 英語が 話されている'],['The window was broken.','まどが われていた']],
  say:['think','be＋-ing と be＋過去分詞は きょうだい。 後ろの 顔で 「している」か 「される」か が 決まるよ']},
 {id:'do_help',g:'verb',ico:'🙋',t:'ふつうの 動詞（一般動詞）は do に 手伝って もらう',qa:'do_what',dr:'do',
  f:row([B('Play','x'),B('you','s'),P('tennis?')],'x')+row([B('Do','m'),B('you','s'),B('play','v'),P('tennis?')],'o')+row([B('I','s'),B("don't",'m'),B('play','v'),P('tennis.')],'o'),
  jp:'日本語は 「する？・ しない」と 動詞の おしりを かえるだけ。 英語の ふつうの 動詞＝ 一般動詞（play・like・go）は <b>前に 出られないし not も つけられない</b>。 だから do が 代わりに 前に 出て、 not も もつ',
  ex:[['Do you play tennis?','テニス する？'],['Does he like cats?','彼は ねこが 好き？'],["I didn't go.",'行かなかった']],
  say:['smile','-s も 過去も <b>do が 持っていく</b>から、 後ろの 動詞は いつも 原形に もどるよ']},
 {id:'special_v',g:'verb',ico:'🚀',t:'とくべつな 動詞（be動詞・助動詞）は 自分で 前へ',qa:'ask_order',dr:'vc',
  f:tbl([['be動詞（be）','Are you〜? ・ I\'m not'],['助動詞（can・will・should）','Can you〜? ・ I can\'t'],['have（完了）','Have you〜? ・ I haven\'t']])+note('主語の すぐ後ろが とくべつ → 自分で 前へ・ not も すぐ後ろ'),
  jp:'日本語には 「前に 出る 動詞」が ない。 英語は <b>主語の すぐ後ろの ことば</b>で、 質問と not の 作り方が 2つに 分かれる',
  ex:[['Are you hungry?','おなか すいた？'],['Can you swim?','およげる？'],['Have you ever been to Okinawa?','沖縄に 行った ことある？']],
  say:['think','見るのは 主語の すぐ後ろ だけ。 とくべつ（be動詞・助動詞）なら 自分で 前へ、 ふつう（一般動詞）なら <b>do の 出番</b>。 be動詞は 助動詞じゃ ないけど、 動き方が 同じ だから 同じ チーム']},
 {id:'be_yousu',g:'verb',ico:'🫧',t:'様子の ことばには be',qa:'be_yousu',dr:'yv',
  f:row([B('I','s'),B('happy.','x')],'x')+row([B('I','s'),B('am','v'),P('happy.')],'o')+row([B('I','s'),B('will','m'),B('be','v'),P('tired.')],'o'),
  jp:'日本語は 「わたし しあわせ」「つかれるだろう」で 文に なる。 英語の 文には <b>動詞の 席が かならず 1つ</b>。 様子の ことば（happy・tired）は すわれないので be が すわる',
  ex:[['I am happy.','わたしは しあわせ'],['She is tired.','彼女は つかれている'],['It will be sunny.','晴れるだろう']],
  say:['proud','<b>very を つけて 言えたら</b> 様子の ことば。 そしたら be が いるよ']},
 {id:'s3',g:'verb',ico:'🐝',t:'he・she・it の 「今」は -s',qa:'s3',dr:'s3x',
  f:row([B('She','s'),B('plays','v'),P('the piano.')],'o')+row([B('She','s'),B('play','x'),P('the piano.')],'x'),
  jp:'日本語の 動詞は だれが しても 同じ 形。 英語は <b>he・she・it（自分と 相手 いがいの 1人・1つ）の 今の 話だけ -s</b>',
  ex:[['She plays the piano.','彼女は ピアノを ひく'],['My dog likes apples.','うちの 犬は りんごが 好き'],['Ken goes to school by bus.','ケンは バスで 学校へ 行く']],
  say:['love','1000年 前の なごりの 化石 なんだ。 なくても 通じるけど 耳が ひっかかるから、 ていねいに つけよう']},
 {id:'have_aru',g:'verb',ico:'🎒',t:'「〇〇が ある」＝ だれが have',qa:'have_aru',
  f:two(['日本語','授業が ある<br>（物が 主語）','r'],['英語','We have class.<br>（だれが 持ってる）','g'])+row([B('We','s'),B("don't",'m'),B('have','v'),P('class on Sunday.')],'o'),
  jp:'日本語は 「授業が ある」と <b>物を 主語</b>に する。 英語は <b>「だれが 持っているか」</b>で 言う。 時間が ある・ 兄弟が いる・ 質問が ある… みんな have',
  ex:[['We have class on Monday.','月曜は 授業が ある'],['I have a brother.','兄弟が いる'],['Do you have time?','時間 ある？']],
  say:['smile','have は ふつうの 動詞。 だから 「ない」は <b>don\'t have</b>、 「ある？」は <b>Do you have〜?</b>']},
 {id:'yes_set',g:'ans',ico:'🙆',t:'Yes ＋ I do ／ No ＋ I don\'t は セット',qa:'yes_no',dr:'yn',
  f:row([B('Yes,','m'),B('I','s'),B('do.','v')],'o')+row([B('No,','m'),B('I','s'),B("don't.",'v')],'o')+row([B('Yes,','m'),B('I','s'),B("don't.",'x')],'x'),
  jp:'日本語の 「はい・ いいえ」は 相手に 合ってるか どうか。 英語の Yes・No は <b>後ろの 文が 肯定か 否定かの ふだ</b>。 「はい・ いいえ」と 訳さない',
  ex:[["Don't you like cats? — Yes, I do.",'（ううん、）好きだよ'],["Aren't you hungry? — No, I'm not.",'（うん、）すいて ない']],
  say:['love','先に <b>I do か I don\'t か</b> を 決めれば、 Yes・No は 自動で 前に くっつくよ']},
 {id:'polite',g:'ans',ico:'🎩',t:'過去の 形で 一歩 下がる ＝ ていねい',qa:'polite_past',
  f:two(['Will you〜?','〜して くれる？','o'],['Would you〜?','〜して いただけますか？','g'])+tbl([['can → could','Could you help me?'],['will → would',"Would you like some tea?"]]),
  jp:'日本語は 「〜いただけますか」と <b>ことばを 足して</b> ていねいに する。 英語は <b>過去の 形に して 一歩 下がる</b>',
  ex:[['Would you like some tea?','お茶は いかがですか？'],['Could you help me?','手伝って いただけますか？'],['I wanted to ask you something.','ちょっと お聞きしたい ことが あって']],
  say:['happy','過去形 なのに 今の 話。 「一歩 下がって おしつけない」って 覚えてね']},
 {id:'art',g:'jp',ico:'🍎',t:'a / the / なし',qa:'a_the',dr:'art',
  f:tbl([['a','はじめて 出る・ どれでも 1つ'],['the','どれか わかってる・ 1つしか ない'],['なし','数えない（water・music）・ スポーツ']]),
  jp:'日本語には a・the に あたる ことばが ない。 英語は 名詞の 前で <b>「どれの 話か」を いつも 決める</b>',
  ex:[['I have a dog. The dog is white.','犬を かってる。 その 犬は 白い'],['Look at the moon.','月を 見て'],['I like music.','音楽が 好き']],
  say:['smile','はじめては a、 2回目からは the。 まずは これだけで だいじょうぶ']},
 {id:'num',g:'jp',ico:'🔢',t:'1つか 2つ いじょうか を いつも 言う',dr:'num',
  f:two(['1つ','a dog ・ a book','o'],['2つ いじょう','two dogs ・ books','g']),
  jp:'日本語の 「犬が いる」は 1ぴきでも 3びきでも 同じ。 英語は <b>かならず 数を 決めて</b>、 2つ いじょうなら -s',
  ex:[['I have two cats.','ねこを 2ひき かっている'],['There are many books.','本が たくさん ある'],['I like dogs.','犬が 好き（犬 ぜんぶ）']],
  say:['think','「犬が 好き」は I like dogs.。 犬 ぜんぶの 話は -s で 言うんだよ']},
 {id:'subj',g:'jp',ico:'👤',t:'主語を はぶけない',dr:'subj',
  f:row([B('Is','x'),B('cold.','x')],'x')+row([B('It','s'),B('is','v'),P('cold.')],'o')+note('天気・ 時間・ 寒さは 意味の ない it で 席を うめる'),
  jp:'日本語は 「寒いね」「行くよ」と 主語なしで いい。 英語は <b>かならず 主語</b>から',
  ex:[["It's cold.",'寒いね'],["I'll go.",'行くよ'],['What time is it?','何時？']],
  say:['smile','主語が 見つからない ときは <b>it</b> に まかせよう。 it は 席うめの 名人']},
 {id:'now',g:'jp',ico:'⏰',t:'今？ いつも？',dr:'now',
  f:two(['今 この しゅんかん','I am studying now.','o'],['ふだん・ いつも','I study every day.','g']),
  jp:'日本語の 「勉強している」は <b>今 している</b>にも <b>ふだん している</b>にも なる。 英語は 形を 分ける',
  ex:[["I'm studying now.",'今 勉強している'],['I study English every day.','毎日 英語を 勉強している'],['I live in Tokyo.','東京に 住んでいる']],
  say:['think','「〜している」を 見たら、 <b>今 この しゅんかん？</b>って 聞いてみて。 ちがったら -ing じゃ ないよ']},
 {id:'order',g:'jp',ico:'🔀',t:'だれが → どうする が 先',dr:'order',
  f:row([B('I','s'),B('play','v'),P('tennis'),P('in the park'),P('on Sunday.')])+note('だれが → どうする → 何を → どこで → いつ'),
  jp:'日本語は 「日曜に 公園で テニスを <b>する</b>」と 動詞が さいご。 英語は <b>「だれが・ どうする」を 先に</b> 言って、 くわしい ことは 後ろへ',
  ex:[['I play tennis in the park on Sunday.','日曜に 公園で テニスを する'],['She reads books every night.','彼女は 毎晩 本を 読む']],
  say:['happy','まず 「だれが → どうする」。 これだけ 先に 言えたら、 あとは 足していけば いいの']}
];
const BY={};K.forEach(k=>BY[k.id]=k);

/* ---------- どこから どの 型？ ---------- */
/* ⚡特別練習の 型（game/shikumi-drill.js・ verb-check.js・ drill-jp.js の k） */
const DR={s3:'s3',s3x:'s3',doQ:'do_help',doesV:'do_help',doNeg:'do_help',doesntV:'do_help',didV:'do_help',past:'do_help',
  beQ:'special_v',beNeg:'special_v',beQp:'special_v',beAdj:'be_yousu',one:'be_yousu',which:'be_yousu',willX:'be_yousu',willBe:'be_yousu',
  modV:'pair_gen',ing:'pair_ing',art:'art',num:'num',subj:'subj',now:'now',order:'order'};
/* 単元の 時間（unit id:ci） */
const UC={'modal:0':'pair_gen','modal:2':'special_v','modal:4':'polite','perfect:0':'pair_pp','perfect:1':'pair_pp','perfect:2':'pair_pp',
  'shikumi:0':'be_yousu','shikumi:1':'pair_pp','shikumi:2':'be_yousu','shikumi:3':'pair_ing','shikumi:4':'pair_gen','shikumi:5':'do_help','shikumi:6':'art','shikumi:7':'pair_pp','shikumi:10':'special_v'};
/* 🙋 しつもん → 型 */
const QA={will_be:'be_yousu',past_perf:'pair_pp'};K.forEach(k=>{if(k.qa&&!QA[k.qa])QA[k.qa]=k.id});QA.been_be='pair_pp';
/* 💡 まめちしき → 型 */
const MM={would:'polite',could:'polite',wanted:'polite',might:'polite',should:'polite',have:'have_aru'};
function of(o){o=o||{};if(o.k){if(DR[o.k])return DR[o.k];if(/^vc/.test(o.k))return 'special_v';if(/^yn/.test(o.k))return 'yes_set'}
  if(o.qa&&QA[o.qa])return QA[o.qa];if(o.mame&&MM[o.mame])return MM[o.mame];
  if(o.u&&o.ci!=null&&UC[o.u+':'+o.ci])return UC[o.u+':'+o.ci];return null}

/* ---------- 小さな チップ（つまずいた ところに さっと 出す） ---------- */
const met=id=>!!R.s[id];
function chip(id,cls){const k=BY[id];if(!k)return '';const nw=!met(id);
  return `<button class="ktchip${nw?' new':''} ${cls||''}" data-kata="${id}"><i>🧩</i><span><small>${nw?'この 型の カード':'型カード'}</small>${esc(k.t)}</span><b>▶</b></button>`}
function bind(root){if(!root)return;root.querySelectorAll('[data-kata]').forEach(b=>{if(b._kt)return;b._kt=1;b.addEventListener('click',e=>{e.stopPropagation();snd('book');show(b.dataset.kata)})})}

/* ---------- 1まいの カード（どの 画面の 上にも 重なる） ---------- */
function shut(){const p=$('kataPop');if(!p)return;hush();p.classList.remove('on');setTimeout(()=>p.remove(),200);const f=p._done;if(f)setTimeout(f,0)}
function show(id,o){const k=BY[id];if(!k)return;o=o||{};const first=!met(id);R.s[id]=R.s[id]||Date.now();R.n=(R.n||0)+1;save();
  try{RECENT.add('kata',{t:k.t})}catch(e){}
  let p=$('kataPop');if(p)p.remove();p=document.createElement('div');p.id='kataPop';p._done=o.done||null;
  const [ex,tx]=first?ML('kata_new'):k.say;
  const qa=k.qa&&window.MINAQA&&MINAQA.all.findIndex(x=>x.id===k.qa),dr=k.dr&&window.SKDRILL&&!o.noDrill&&!$('kdbox');
  p.innerHTML=`<section class="ktcard" role="dialog" aria-label="英語の 型">
    <div class="kthd"><em>🧩 英語の 型</em>${first?'<span class="ktnew">🐚 あつめた！</span>':''}<button class="ktx" aria-label="とじる">✕</button></div>
    <h3><i>${k.ico}</i>${esc(k.t)}</h3>
    <div class="mdfig ktfig">${k.f}</div>
    <div class="ktjp"><b>🇯🇵 日本語と ちがう ところ</b><p>${k.jp}</p></div>
    <div class="ktex">${k.ex.map(([en,ja])=>`<button data-say="${esc(en)}"><span>🔊 ${esc(en)}</span><small>${esc(ja)}</small></button>`).join('')}</div>
    <div class="ktmina"><span class="ktf">${face(ex,tx)}</span><p>${first?tx+'<br>':''}${k.say[1]}</p></div>
    <div class="ktnav">${qa>=0?'<button class="sub" id="ktqa">🙋 なんで？ くわしく</button>':''}${dr?'<button class="sub" id="ktdr">⚡ ためす</button>':''}<button id="ktok">わかった</button></div></section>`;
  document.body.appendChild(p);void p.offsetWidth;p.classList.add('on');snd('pop');
  p.onclick=e=>{e.stopPropagation();if(e.target===p){snd('back');shut()}};
  p.querySelector('.ktx').onclick=()=>{snd('back');shut()};
  p.querySelector('#ktok').onclick=()=>{snd('step');shut()};
  p.querySelectorAll('[data-say]').forEach(b=>b.onclick=e=>{e.stopPropagation();snd('pop');talk(b.dataset.say)});
  const q=$('ktqa');if(q)q.onclick=()=>{snd('talk');p._done=null;shut();
    /* 🤔 教えての 中（問題の 上）なら その 重ねで、 それ いがいは 🙋 の 画面で */
    if($('prteach')&&window.PRAC&&PRAC.qaOne)PRAC.qaOne(MINAQA.all[qa]);else MINAQA.ask(qa,o.back||null)};
  const d=$('ktdr');if(d)d.onclick=()=>{snd('lesson');p._done=null;shut();try{const ov=$('dpov');if(ov)ov.remove()}catch(e){}SKDRILL.open(k.dr)}}

/* ---------- あつめた 型（☕ おしゃべりの ページの 小さな 1行 から） ---------- */
function list(back){let o=$('dpov');if(o)o.remove();o=document.createElement('div');o.id='dpov';document.body.appendChild(o);
  const any=K.some(k=>met(k.id)),[ex,tx]=ML(any?'kata_list':'kata_list0');
  o.innerHTML=`<section class="pnl dpp mdp ktlistp" role="dialog" aria-label="英語の 型"><div class="qtop"><button class="x" id="ktlx" aria-label="もどる">${back?'←':'✕'}</button><b>🧩 英語の 型</b><span></span></div>
    <div class="mdbox" id="mdbox"><div class="mdsay"><span class="lface">${face(ex,tx)}</span><p>${tx}</p></div>
    ${G.map(([g,n])=>`<p class="mdnote2">${n}</p><div class="ktgrid">${K.filter(k=>k.g===g).map(k=>`<button data-kata="${k.id}" class="${met(k.id)?'ktgot':'ktyet'}"><i>${k.ico}</i><span>${esc(k.t)}</span></button>`).join('')}</div>`).join('')}
    <p class="ktfoot">🐚 問題で つまずいた ときや、 まめちしきで 出会うと あつまるよ</p></div></section>`;
  const cl=()=>{snd('back');hush();o.remove();if(back)back()};
  $('ktlx').onclick=cl;o.onclick=e=>{if(e.target===o)cl()};
  const box=$('mdbox');box.querySelectorAll('[data-kata]').forEach(b=>b.onclick=()=>{snd('book');show(b.dataset.kata,{back:()=>list(back),done:()=>{const nb=$('dpov')&&$('dpov').querySelector(`[data-kata="${b.dataset.kata}"]`);if(nb){nb.classList.remove('ktyet');nb.classList.add('ktgot')}}})})}

window.KATA={all:K,by:BY,of,chip,bind,show,list,met,rec:()=>R};

/* ---------- セリフ ---------- */
Object.assign(MINA_LINES,{
 kata_new:[['happy','新しい 型カード、 しまって おくね。 つまずいた ところは のびる ところ だよ'],['love','この 型、 あつめた カードに 入れたよ。 見たら すぐ 思い出せる ように'],['smile','型を 1まい あつめたよ。 わかれば 英語は ぐっと 楽に なるの']],
 kata_list:[['smile','あつめた 英語の 型だよ。 1まい 見るだけで 思い出せる ように して あるの'],['happy','日本語と ちがう ところは、 型で 覚えると 楽ちん。 気に なる ものから どうぞ'],['love','うすい カードも 見て いいよ。 見たら あつめた ことに なるからね']],
 kata_list0:[['smile','英語には 決まった 型が あるの。 日本語と ちがう から、 むずかしいのは あたりまえ。 1まいずつ 見ていこう'],['happy','問題で つまずいた ときに、 この 型カードが さっと 出てくるよ。 先に 見ても いいからね']],
 r_kata:[['smile','さっきの 型カード、 「{t}」。 英語の 文で 見つけたら 思い出してね'],['love','「{t}」の 型、 もう 1回 見たく なったら ☕ おしゃべりの ページに あるよ'],['proud','型が わかると、 英語の 文が 読みやすく なるでしょ。 「{t}」、 いい 型だよ']],
 x_kata:[['think','英語って 決まった 型が 多いでしょ。 日本人が つまずく 型を カードに したの。 ☕ おしゃべりの ページの 🧩 から 見られるよ'],['smile','わからない 問題が あったら、 その 型の カードが さっと 出るように したよ']]
});
window.MINA_REACT_EXT=window.MINA_REACT_EXT||{};
MINA_REACT_EXT.kata={act:e=>e.ti?['r_kata',{t:e.ti},null]:null,desc:e=>`英語の 型カード 「${e.ti||''}」を 見た`};
/* ホームの ひとこと: 特別練習や 単元で まちがえたのに まだ 型カードを 1まいも 見ていない とき */
try{if(window.MINA_SENSE&&MINA_SENSE._rules)MINA_SENSE._rules.push(['x_kata',2,()=>{if(K.some(k=>met(k.id)))return null;let m=0;try{const r=SKDRILL.rec();m=Object.values(r.miss||{}).reduce((a,b)=>a+b,0)}catch(e){}return m>=3?{}:null},()=>['🧩 英語の 型を 見る',()=>list()]])}catch(e){}
})();
