/* 💪 ミナ先生の 特別授業「助動詞」の 中身（しくみは game/modal.js）
   - 章ごとに カード（1まい = 1つの ポイント）→ たしかめ 3問。 さいごに まとめテスト 8問
   - カード: say（ミナ先生の ことば）・f（図。 下の F の 道具で 作る）・ex（英文と 日本語。 🔊で 聞ける）・x（表情）
   - 問題: s（___ の ある 文）か p（場面・質問）・ja・o（さいしょが 正解。 出すときに まぜる）・h（ヒント）・e（解説）
   セリフ（md_ ・ x_md で はじまる 場面）は この ファイルの さいごで MINA_LINES に 足す */
(()=>{
/* 図の 道具: ブロック（主語=s・助動詞=m・動詞=v・ほか=o・まちがい=x）、⭕❌の ならび、強さの メーター */
const B=(t,c)=>`<span class="mdb ${c||'o'}">${t}</span>`;
const row=(a,mark)=>`<div class="mdrow${mark==='x'?' bad':''}">${mark?`<i>${mark==='x'?'❌':'⭕'}</i>`:''}${a.join('')}</div>`;
const arrow='<div class="mdarr">⬇</div>';
const note=t=>`<p class="mdnote">${t}</p>`;
const meter=a=>`<div class="mdmeter">${a.map(([w,ja,p,c])=>`<div><b class="mdb m">${w}</b><span class="mdbar"><i class="${c||''}" style="width:${p}%"></i></span><small>${ja}</small></div>`).join('')}</div>`;
const two=(a,b)=>`<div class="mdtwo"><div class="${a[2]||''}"><b>${a[0]}</b><span>${a[1]}</span></div><div class="${b[2]||''}"><b>${b[0]}</b><span>${b[1]}</span></div></div>`;

const CH=[
 {ico:'🧩',t:'助動詞の あとは 「はだかの 動詞」',short:'あとは 原形',
  cards:[
   {x:'happy',say:'助動詞は、 動詞の 前に はる <b>「気もちの シール」</b>だよ。 シールを はると、 文に 気もちが 足されるの',
    f:row([B('I','s'),B('play','v'),B('tennis')])+arrow+row([B('I','s'),B('can','m'),B('play','v'),B('tennis')])+note('can の シールで 「できる」が 足された！'),
    ex:[['I play tennis.','テニスを する'],['I can play tennis.','テニスが できる']]},
   {x:'proud',say:'いちばん 大事な ルールは これ 1つだけ。 助動詞の あとは 動詞の <b>もとの 形（原形）</b>。 何も つけない <b>はだかの 動詞</b>だよ',
    f:row([B('can','m'),B('play','v')],'o')+row([B('can','m'),B('plays','x')],'x')+row([B('can','m'),B('to play','x')],'x')+row([B('can','m'),B('playing','x')],'x')+note('s も to も -ing も つけない')},
   {x:'think',say:'he や she でも 同じ。 助動詞が 入ると、 動詞の s は 消えるよ。 助動詞が s を <b>食べちゃう</b> イメージ',
    f:row([B('She','s'),B('plays','v'),B('the piano')])+arrow+row([B('She','s'),B('can','m'),B('play','v'),B('the piano')],'o')+row([B('She','s'),B('can','m'),B('plays','x')],'x')+row([B('She','s'),B('cans','x'),B('play','v')],'x'),
    ex:[['She can play the piano.','彼女は ピアノが ひける']]},
   {x:'smile',say:'とっくんで まよった 問題も、 これで とけるよ。 should の あとも はだかの 動詞！',
    f:row([B('You','s'),B('should','m'),B('rest','v')],'o')+row([B('You','s'),B('should','m'),B('resting','x')],'x')+row([B('You','s'),B('should','m'),B('to rest','x')],'x'),
    ex:[['You should rest.','休んだ ほうが いいよ'],['You should go to bed early.','早く ねた ほうが いいよ']]},
   {x:'think',say:'1つだけ 注意。 <b>have to</b> は さいしょから to が 入った セット。 have が ふつうの 動詞なので、 he や she なら <b>has to</b> に なるよ',
    f:row([B('I','s'),B('have to','m'),B('go','v')],'o')+row([B('He','s'),B('has to','m'),B('go','v')],'o')+note('to の あとも はだかの 動詞'),
    ex:[['I have to go.','行かなきゃ'],['He has to go.','彼は 行かなければ ならない']]},
  ],
  q:[
   {s:'You should ___.',ja:'休んだ ほうが いいよ',o:['rest','resting','to rest'],h:'should の あとは 何も つけない 動詞',e:'should は 助動詞。 あとは はだかの rest。 -ing も to も つかないよ'},
   {s:'She can ___ the piano.',ja:'彼女は ピアノが ひける',o:['play','plays','playing'],h:'She でも、 can の あとに s は つけない',e:'助動詞の あとは いつも 原形。 she でも plays には ならないよ'},
   {s:'He must ___ home by six.',ja:'彼は 6時までに 帰らなければ ならない',o:['go','goes','to go'],h:'must の あとは はだかの 動詞',e:'must ＋ 原形 go。 must to go とは 言わないよ'},
   {s:'Tom ___ to clean his room.',ja:'トムは 部屋を そうじ しなければ ならない',o:['has','have','must'],h:'うしろに to が ある。 主語は Tom',e:'to が あるので have to の セット。 Tom なので has to。 must to とは 言わないよ'},
   {s:'It will ___ tomorrow.',ja:'明日は 雨が ふるだろう',o:['rain','rains','raining'],h:'will も 助動詞の なかま',e:'will の あとも 原形。 It will rain.'},
   {s:'I can ___ fast.',ja:'わたしは 速く 走れる',o:['run','ran','to run'],h:'過去の 形も つけない',e:'助動詞の あとは もとの 形の run だけ'},
  ]},
 {ico:'📊',t:'気もちの 強さが ちがう',short:'気もちの 強さ',
  cards:[
   {x:'smile',say:'助動詞は、 気もちの <b>強さ</b>が ちがうの。 強い じゅんに ならべると こう',
    f:meter([['must','ぜったい しなきゃ',100,'r'],['have to','しなきゃ（決まり・事情）',88,'r'],['should','した ほうが いいよ',60,'o'],['may','しても いいよ',35,'g']])},
   {x:'love',say:'友だちに やさしく すすめる ときは <b>should</b>。 「〜した ほうが いいよ」の アドバイスだよ',
    f:two(['should','「休んだ ほうが いいよ」<br>やさしい アドバイス','g'],['must','「休みなさい！」<br>強い 命令','r']),
    ex:[['You should rest.','休んだ ほうが いいよ'],['You should see a doctor.','お医者さんに みてもらった ほうが いいよ']]},
   {x:'think',say:'must と have to は、 どっちも 「しなければ ならない」。 ちがいは <b>理由が どこから 来るか</b>',
    f:two(['must','自分の 気もち<br>「勉強しなきゃ！」と 自分で 決めた','r'],['have to','まわりの 決まり・事情<br>「学校の 決まりで 着なきゃ」','o'])+note('テストでは ほぼ 同じ 意味で 大丈夫'),
    ex:[['I must study!','勉強しなきゃ！'],['I have to wear a uniform.','制服を 着なければ ならない']]},
   {x:'happy',say:'「〜しても いいよ」と ゆるす ときは <b>may</b>。 先生や 親が 言う 感じで、 can より ていねい',
    ex:[['You may go home.','帰っても いいですよ'],['You can go home.','帰って いいよ（ふつう）']]},
  ],
  q:[
   {p:'かぜを ひいた 友だちに アドバイス。「休んだ ほうが いいよ」',o:['You should rest.','You must rest.','You may rest.'],h:'アドバイス・すすめる ときの 助動詞は？',e:'「〜した ほうが いい」は should。 must だと 「休みなさい！」と 命令みたいに 強いよ'},
   {p:'学校の 決まりで 「制服を 着なければ ならない」',o:['I have to wear a uniform.','I may wear a uniform.','I should wearing a uniform.'],h:'まわりの 決まりで しなければ ならない',e:'決まり・事情なら have to が ぴったり。 may は 「着ても いい」に なっちゃう'},
   {p:'先生が 「もう 帰っても いいですよ」',o:['You may go home.','You must go home.','You should going home.'],h:'ゆるす（許可）の 助動詞',e:'「〜しても いい」は may（ふつうは can も）。 must だと 「帰りなさい！」'},
   {p:'いちばん 強い 気もちは どれ？',o:['must','should','may'],h:'「ぜったい」に いちばん 近いのは？',e:'強い じゅんに must ＞ should ＞ may。 must は 「ぜったい しなきゃ」'},
   {p:'「明日は テストだ。 勉強しなきゃ！」（自分で 決めた）',o:['I must study.','I may study.','I can studies.'],h:'自分の 強い 気もち',e:'自分で 「ぜったい やる」と 思う ときは must。 can studies は s が ダメ'},
  ]},
 {ico:'🔁',t:'「しない」と 「〜する？」の 作り方',short:'否定と 疑問',
  cards:[
   {x:'smile',say:'「〜しない」は、 助動詞の すぐ うしろに <b>not</b>。 do や does は いらないよ',
    f:row([B('He','s'),B('can','m'),B('not','m'),B('swim','v')],'o')+row([B('He','s'),B("doesn't",'x'),B('can','m'),B('swim','v')],'x')+
     `<div class="mdtbl"><span>can not</span><b>can't</b><span>must not</span><b>mustn't</b><span>should not</span><b>shouldn't</b><span>will not</span><b>won't</b></div>`,
    ex:[["He can't swim.",'彼は 泳げない'],["You shouldn't eat too much.",'食べすぎない ほうが いいよ']]},
   {x:'happy',say:'質問の 文は、 助動詞を <b>前に 出す</b>だけ。 こっちも Do は いらない',
    f:row([B('You','s'),B('can','m'),B('swim','v')])+arrow+row([B('Can','m'),B('you','s'),B('swim','v'),B('?')],'o')+row([B('Do','x'),B('you','s'),B('can','m'),B('swim','v')],'x'),
    ex:[['Can you swim?','泳げる？'],['Should I go?','行った ほうが いい？'],['Will you help me?','手伝って くれる？']]},
   {x:'think',say:'<b>have to だけ</b>は べつ。 have が ふつうの 動詞だから、 ふつうの 動詞と 同じく <b>do / does</b> を つかうよ',
    f:row([B('I','s'),B("don't",'o'),B('have to','m'),B('go','v')],'o')+row([B('Do','o'),B('I','s'),B('have to','m'),B('go','v'),B('?')],'o')+row([B('Does','o'),B('he','s'),B('have to','m'),B('go','v'),B('?')],'o'),
    ex:[["I don't have to go.",'行かなくて いい'],['Do I have to go?','行かなきゃ ダメ？']]},
  ],
  q:[
   {s:'He ___ swim.',ja:'彼は 泳げない',o:["can't","doesn't can","don't can"],h:'助動詞の 文に do / does は いらない',e:"can の うしろに not で can't。 doesn't can とは 言わないよ"},
   {p:'「あなたは ギターが ひけますか？」',o:['Can you play the guitar?','Do you can play the guitar?','Can you plays the guitar?'],h:'質問は 助動詞を 前に 出すだけ',e:'Can を 文の 頭に 出すだけ。 Do は いらないし、 plays の s も いらない'},
   {s:'___ I open the window?',ja:'窓を あけても いいですか？',o:['May','Do','Am'],h:'「〜しても いい？」と ゆるしを もらう',e:'May I 〜? で 「〜しても いいですか？」。 ていねいな きき方だよ'},
   {s:'You ___ have to come.',ja:'来なくても いいよ',o:["don't","mustn't","aren't"],h:'have to の 「しない」は ふつうの 動詞と 同じ',e:"have は 動詞だから don't have to。 mustn't だと 「来ては いけない」に なっちゃう"},
   {s:'___ she have to work today?',ja:'彼女は 今日 働かなければ ならないの？',o:['Does','Do','Must'],h:'have to の 質問。 主語は she',e:'have to の 質問は Do / Does を 前に。 she なので Does'},
   {s:'I ___ go out tonight.',ja:'今夜は 出かけない つもり',o:["won't","willn't","don't will"],h:'will not の 短い 形は とくべつ',e:"will not → won't（ウォウント）。 willn't とは 言わないよ"},
  ]},
 {ico:'🚦',t:'must not と don\'t have to',short:'禁止と 「しなくて いい」',
  cards:[
   {x:'wow',say:'ここが いちばん まちがえやすい ところ！ 形は にてるのに、 意味は <b>ぜんぜん ちがう</b>よ',
    f:two(["🚫 must not",'〜しては いけない<br>（ぜったい ダメ）','r'],["😌 don't have to",'〜しなくても いい<br>（しても いい）','g'])},
   {x:'think',say:'<b>must not</b> は 赤信号。 ぜったい しちゃ ダメ、 の 禁止だよ',
    ex:[['You must not swim here.','ここで 泳いでは いけない'],["You mustn't run in the hall.",'ろうかを 走っては いけない']]},
   {x:'love',say:"<b>don't have to</b> は 「しなくて いいよ、 安心して」。 しても いいし、 しなくても いい",
    ex:[["You don't have to hurry.",'急がなくて いいよ'],["It's Sunday. I don't have to get up early.",'日曜日。 早く 起きなくて いい']]},
   {x:'proud',say:'覚え方は これ！',
    f:`<div class="mdtip">must ＝「ぜったい」<br>ぜったい ＋ しない ＝ <b>ぜったい しちゃ ダメ 🚫</b><br><br>have to ＝「しなきゃ」<br>「しなきゃ」を 消す ＝ <b>しなくて いい 😌</b></div>`},
  ],
  q:[
   {s:"You ___ swim here. It's dangerous.",ja:'ここで 泳いでは いけない。 あぶない',o:['must not',"don't have to",'should'],h:'あぶない → ぜったい ダメ',e:"禁止は must not。 don't have to だと 「泳がなくて いい」に なっちゃう"},
   {s:"It's Sunday. I ___ get up early.",ja:'日曜日だ。 早く 起きなくて いい',o:["don't have to",'must not','must'],h:'起きなくても 大丈夫、 という 気もち',e:"「しなくて いい」は don't have to。 must not だと 「早起き 禁止！」"},
   {p:'「急がなくて いいよ」',o:["You don't have to hurry.",'You must not hurry.',"You don't must hurry."],h:'急いでも 急がなくても OK',e:"don't have to ＝ しなくて いい。 don't must という 形は ないよ"},
   {p:'図書館の 決まり：「ここで 食べては いけません」',o:['You must not eat here.',"You don't have to eat here.",'You may eat here.'],h:'決まりで ダメ ＝ 禁止',e:"禁止は must not。 don't have to は 「食べなくて いい」"},
   {p:'You must not open this box. の 意味は？',o:['この 箱を あけては いけない','この 箱を あけなくて いい','この 箱を あけた ほうが いい'],h:'must not ＝ 赤信号',e:'must not は 禁止。 「あけては いけない」'},
   {p:"You don't have to bring lunch. の 意味は？",o:['お弁当を 持ってこなくて いい','お弁当を 持ってきては いけない','お弁当を 持ってこなければ ならない'],h:"don't have to ＝ 「しなきゃ」が 消える",e:'「持ってこなくて いい」。 持ってきても 大丈夫だよ'},
  ]},
 {ico:'🌈',t:'may の 2つの 意味・can / could・will / would',short:'may・could・would',
  cards:[
   {x:'smile',say:'may には 意味が <b>2つ</b> あるよ。 見分け方は かんたん',
    f:two(['① 〜しても いい','May I come in?<br>入っても いいですか','g'],['② 〜かもしれない','It may rain.<br>雨が ふるかもしれない','o'])+note('May I 〜? や You may 〜 は ①。 天気や 予想なら ②'),
    ex:[['May I come in?','入っても いいですか？'],['It may rain.','雨が ふるかもしれない']]},
   {x:'happy',say:'can は 「できる」と 「しても いい」。 <b>could</b> は can の 過去で 「できた」。 それと、 ていねいな おねがいにも つかうよ',
    ex:[['I could swim when I was five.','5さいの とき 泳げた'],['Could you help me?','手伝って いただけますか？']]},
   {x:'smile',say:'<b>will</b> は 「〜する つもり・〜するだろう」。 Will you 〜? は 「〜して くれる？」。 <b>would</b> は もっと ていねい',
    ex:[['I will call you.','電話するね'],['Would you open the door?','ドアを あけて いただけますか？'],["I'd like some tea.",'お茶が ほしいです（I would like）']]},
   {x:'proud',say:'おねがいの ていねいさの はしご。 下に 行くほど ていねいだよ',
    f:meter([['Can you 〜?','友だちに',30,'g'],['Will you 〜?','友だちに',45,'g'],['Could you 〜?','先生・お店で',80,'o'],['Would you 〜?','先生・お店で',85,'o']])+note('会話の さいごに please を つけると もっと ていねい')},
  ],
  q:[
   {p:'It may rain this afternoon. の may は？',o:['〜かもしれない','〜しても いい','〜しなければ ならない'],h:'天気の 話 → 予想',e:'天気や 予想の may は 「かもしれない」。 午後 雨が ふるかもしれない'},
   {p:'May I use your pen? の may は？',o:['〜しても いい','〜かもしれない','〜できる'],h:'May I 〜? は ゆるしを もらう 形',e:'May I 〜? ＝ 〜しても いいですか？（許可）'},
   {s:'I ___ swim when I was five.',ja:'5さいの とき 泳げた',o:['could','can','will'],h:'when I was five → 過去の こと',e:'can の 過去は could。 「できた」'},
   {p:'先生に ていねいに 「手伝って いただけますか？」',o:['Could you help me?','Could you helping me?','Do you could help me?'],h:'ていねいな おねがいは Could you 〜?',e:'Could you ＋ 原形。 helping や Do は いらない'},
   {s:'I ___ call you tonight.',ja:'今夜 電話するね',o:['will','may','must'],h:'これから する つもり',e:"「〜する つもり」は will。 I'll call you. とも 言うよ"},
  ]},
];
/* まとめテストだけに 出る 問題（まぜて 出す） */
const MIX=[
 {s:'Ken ___ speak English very well.',ja:'ケンは 英語を とても 上手に 話せる',o:['can','cans','is can'],h:'助動詞は 主語で 形が かわらない',e:'can は he でも can の まま。 cans は ないよ',c:0},
 {s:'We ___ be quiet in the library.',ja:'図書館では 静かに しなければ ならない',o:['must','may','will'],h:'決まり → しなければ',e:'must ＋ be quiet。 must の あとの be も 原形だよ',c:1},
 {s:'You should ___ careful.',ja:'気を つけた ほうが いい',o:['be','are','to be'],h:'are や is の もとの 形は？',e:'are / is の 原形は be。 should be careful',c:0},
 {p:'友だちに 「ドアを あけて くれる？」',o:['Will you open the door?','Must you open the door?','Do you will open the door?'],h:'「〜して くれる？」の おねがい',e:'Will you 〜? ＝ 〜して くれる？。 Can you 〜? でも OK',c:4},
 {s:'She ___ to get up at six every day.',ja:'彼女は 毎日 6時に 起きなければ ならない',o:['has','must','have'],h:'to が ある・主語は she',e:'she なので has to。 must なら to は いらないよ',c:0},
 {p:'「この 本、 読んだ ほうが いいよ」',o:['You should read this book.','You should reads this book.','You should to read this book.'],h:'should の あとは はだかの 動詞',e:'should ＋ 原形 read。 s も to も つけないよ',c:0},
 {s:"You ___ tell anyone. It's a secret.",ja:'だれにも 言っては いけない。 ひみつだよ',o:['must not',"don't have to",'may'],h:'ひみつ → ぜったい ダメ',e:'禁止は must not。 ひみつは 言っちゃ ダメ！',c:3},
 {s:'___ I have to finish it today?',ja:'今日 おわらせなきゃ ダメ？',o:['Do','Must','Am'],h:'have to の 質問',e:'have to の 質問は Do を 前に。 Do I have to 〜?',c:2},
];
CH.forEach((c,i)=>c.q.forEach(q=>q.c=i));
window.MODAL_DATA={CH,MIX,title:'助動詞',gid:'jh_modal'};

/* ---------- ミナ先生の セリフ（[表情, ことば]） ---------- */
Object.assign(MINA_LINES,{
 md_hello:[
  ['happy','助動詞の 特別授業へ ようこそ！ 1つずつ ゆっくり いくから、 ぜったい わかるように なるよ'],
  ['love','助動詞、 苦手なんだね。 だいじょうぶ。 わたしと いっしょに 1から やろう'],
  ['proud','この 授業が おわる ころには、 should も must も こわくなく なってるはず'],
 ],
 md_again:[
  ['smile','おかえり！ つづきから やろうか'],
  ['happy','また 来てくれた！ 助動詞、 だんだん なかよく なってきたね'],
  ['think','今日は どの 章に する？ 気に なる ところから で いいよ'],
  ['love','くりかえすほど 頭に のこるからね。 いっしょに がんばろう'],
 ],
 md_allDone:[
  ['proud','5つの 章、 ぜんぶ おわったね！ さいごに まとめテストで たしかめよう'],
  ['wow','ここまで 来たら もう 助動詞マスター 目前！ まとめテスト いってみよう'],
 ],
 md_master:[
  ['proud','まとめテスト ★3！ もう 助動詞は あなたの 味方だよ'],
  ['love','★3 とったのに また 来てくれるの、 うれしいな。 ふくしゅうは 大事だもんね'],
 ],
 md_qStart:[
  ['smile','じゃあ、 たしかめ 3問！ わからなかったら ヒントを 出すからね'],
  ['happy','ここまでの ことで 3問 いってみよう'],
  ['think','カードの ことを 思いだしながら、 ゆっくりで いいよ'],
 ],
 md_ok:[
  ['happy','正解！'],['wow','そう、 それ！'],['proud','ばっちり！'],['love','いいね、 わかってる！'],['smile','うん、 正解だよ'],
 ],
 md_okHint:[
  ['smile','ヒントで わかったね。 それで いいんだよ'],['happy','正解！ 2回目で 気づけたの、 えらい'],['love','そう！ ちゃんと 考えられたね'],
 ],
 md_hint:[
  ['think','おしい！ ヒントを 見て、 もう一回'],['smile','あわてなくて いいよ。 ヒントを どうぞ'],['love','まちがえても だいじょうぶ。 ここで 覚えれば いいの'],
 ],
 md_explain:[
  ['think','ここは まちがえやすい ところ。 いっしょに 見よう'],['smile','だいじょうぶ、 いま わかれば OK。 こう なるよ'],['love','まちがえた ところが いちばん のびる ところ。 見てね'],
 ],
 md_chDone:[
  ['proud','「{t}」 おわり！ よく がんばったね'],['happy','この 章は ばっちり。 つぎも いける？'],['love','1つ わかると、 つぎが ぐっと らくに なるよ'],
 ],
 md_chMiss:[
  ['smile','「{t}」 おわり！ 解説を 見た 問題は、 あとで もう一回 やろうね'],['think','まちがえた ところは、 カードを もう一回 見ると すっきり するよ'],
 ],
 md_testStart:[
  ['proud','まとめテスト {n}問！ 5つの 章から まぜて 出すよ'],['happy','さあ、 ここまでの 力を ためそう。 {n}問 いくよ'],
 ],
 md_perfect:[
  ['wow','ノーミス！！ 助動詞、 ほんとに わかったね'],['proud','ぜんぶ 1回で 正解… すごいよ、 ほんとに'],['love','ねえ、 もう 苦手って 言えないね'],
 ],
 md_good:[
  ['happy','{n}/{N} 正解！ ほとんど わかってる。 まちがえた 章を 1回 見なおせば ★3 だよ'],['proud','よく できました！ あと 少しで 完ぺき'],
 ],
 md_miss:[
  ['smile','{n}/{N} 正解。 だいじょうぶ、 まちがえた 章を もう一回 見よう。 苦手 とっくんにも 入れておいたよ'],['love','今日 まちがえた ところは、 明日 できるように なる ところ。 いっしょに もう一回 やろう'],
 ],
 /* ほかの 画面から さそう ひとこと */
 md_fromDeep:[['smile','助動詞は 特別授業も あるよ。 1から カードで ゆっくり 説明するね']],
 x_mdNew:[
  ['happy','助動詞の 特別授業を 作ったよ。 カードで 1つずつ、 ゆっくり 説明するね'],
  ['love','should や must で まよったら、 助動詞の 特別授業に おいで。 1から いっしょに やろう'],
  ['proud','「助動詞の あとは はだかの 動詞」。 これが わかれば 半分 クリアだよ。 特別授業で 見てみて'],
 ],
 x_mdNext:[
  ['smile','助動詞の 特別授業、 つぎは 「{t}」だよ'],
  ['happy','特別授業の つづき、 「{t}」から やろうか'],
 ],
 x_mdTest:[
  ['proud','助動詞の 5つの 章、 ぜんぶ おわったね。 まとめテストで ★3 を ねらおう'],
 ],
 x_mdWeak:[
  ['love','助動詞で まちがえた ところ、 特別授業で もう一回 見ておこうか'],
  ['think','{t} の ところ、 まだ ちょっと あやしいかも。 特別授業で ふくしゅう しよう'],
 ],
});
})();
