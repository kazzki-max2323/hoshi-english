/* 📘 単元「比較」の 中身（しくみは game/unit.js）
   いまの 文法ノート 比較・比較の応用 と ミニ授業「比較 er・est と more・most」「good better best」を 1つに まとめた */
(()=>{
const {B,row,arrow,note,two,tbl}=UNIT.F;
const CH=[
 {ico:'📈',t:'-er と -est で くらべる',short:'er と est',g:'jh_comp',
  cards:[
   {x:'happy',say:'2つを くらべて 「もっと 〜」は、 形容詞に <b>-er</b> を つけて <b>than</b>（〜より）',
    f:row([B('Tom','s'),B('is','v'),B('tall')])+arrow+row([B('Tom','s'),B('is','v'),B('taller','m'),B('than Ken')],'o'),
    ex:[['Tom is taller than Ken.','トムは ケンより 背が 高い']]},
   {x:'proud',say:'3つ いじょうで 「いちばん」は <b>the ＋ -est</b>。 どの 中でかは、 場所・グループなら <b>in</b>、 数・なかまなら <b>of</b>',
    f:row([B('Tom','s'),B('is','v'),B('the tallest','m'),B('in his class')],'o')+two(['in ＋ 場所・グループ','in my class<br>in Japan','o'],['of ＋ 数・なかま','of the three<br>of all','g']),
    ex:[['Tom is the tallest in his class.','トムは クラスで いちばん 背が 高い'],['She is the youngest of the three.','彼女は 3人の 中で いちばん 若い']]},
   {x:'think',say:'つづりに 気を つける ことばが あるよ。 big は g を 重ねる、 easy は y を i に、 large は r だけ',
    f:tbl([['big','bigger・biggest'],['hot','hotter・hottest'],['easy','easier・easiest'],['large','larger・largest']])},
  ],
  q:[
   {s:'Tom is ___ than Ken.',ja:'トムは ケンより 背が 高い',o:['taller','tall','tallest'],h:'than が ある',e:'than ＝ 〜より → 比較級 taller'},
   {s:'This is the ___ river in Japan.',ja:'これは 日本で いちばん 長い 川',o:['longest','longer','long'],h:'the と in Japan',e:'いちばん → the ＋ 最上級 longest'},
   {s:'She is the youngest ___ the three.',ja:'彼女は 3人の 中で いちばん 若い',o:['of','in','than'],h:'the three は 数',e:'数・なかまには of、 場所・グループには in'},
   {s:'This box is ___ than that one.',ja:'この 箱は あれより 大きい',o:['bigger','biger','more big'],h:'big の つづり',e:'big は g を 重ねて bigger'},
   {s:'Today is ___ than yesterday.',ja:'今日は きのうより 暑い',o:['hotter','hoter','more hot'],h:'hot も 重ねる なかま',e:'hot → hotter（t を 重ねる）'},
   {s:'This test was ___ than the last one.',ja:'この テストは 前のより かんたんだった',o:['easier','easyer','more easy'],h:'y で おわる ことば',e:'easy → easier（y を i に かえて -er）'},
  ]},
 {ico:'🔠',t:'more・most と とくべつな 形',short:'more と most',g:'jh_comp',
  cards:[
   {x:'smile',say:'長い ことば（beautiful・difficult・interesting など）は -er に しないで <b>more</b>・<b>the most</b> を 前に つけるよ',
    f:row([B('more','m'),B('beautiful','o')],'o')+row([B('beautifuler','x')],'x'),
    ex:[['This book is more interesting than that one.','この本は あの本より おもしろい']]},
   {x:'think',say:'目安は 長い ことばと、 -ful・-ous・-ly で おわる ことば',
    f:tbl([['popular','more popular'],['famous','more famous'],['useful','more useful'],['carefully','more carefully']])},
   {x:'proud',say:'形が まるごと かわる ものは 覚えちゃおう。 よく 出るのは この 4つ',
    f:tbl([['good / well','better – best'],['bad','worse – worst'],['many / much','more – most'],['little','less – least']]),
    ex:[['This is the best movie I have ever seen.','今まで 見た 中で いちばん いい 映画']]},
   {x:'happy',say:'「〜の ほうが 好き」は <b>like A better than B</b>、 「いちばん 好き」は <b>like 〜 the best</b>',
    f:row([B('I','s'),B('like','v'),B('summer'),B('better','m'),B('than winter')],'o')+row([B('Which','o'),B('do you like','v'),B('better','m'),B(', A or B?')],'o'),
    ex:[['I like summer better than winter.','冬より 夏の ほうが 好き'],['Which do you like better, cats or dogs?','ねこと 犬、 どっちが 好き？']]},
  ],
  q:[
   {s:'This question is ___ difficult than that one.',ja:'この 問題は あれより むずかしい',o:['more','most','much'],h:'difficult は 長い ことば',e:'長い 形容詞は more ＋ もとの 形。 difficulter とは 言わない'},
   {s:'She is the ___ popular singer in Japan.',ja:'彼女は 日本で いちばん 人気の 歌手',o:['most','more','best'],h:'the と いちばん',e:'長い ことばの 最上級は the most'},
   {s:'I like summer ___ than winter.',ja:'冬より 夏の ほうが 好き',o:['better','more good','gooder'],h:'like 〜 の 「〜の ほうが」',e:'like A better than B ＝ B より A の ほうが 好き'},
   {s:'This is the ___ movie I have ever seen.',ja:'今まで 見た 中で いちばん いい 映画',o:['best','better','goodest'],h:'good の いちばん',e:'good – better – best。 goodest は ない'},
   {s:'My cold is ___ today than yesterday.',ja:'かぜが きのうより ひどい',o:['worse','badder','more bad'],h:'bad の 比較級',e:'bad – worse – worst'},
   {p:'「りんごと バナナ、 どっちが 好き？」',o:['Which do you like better, apples or bananas?','Which do you like good, apples or bananas?','What do you like more good, apples or bananas?'],h:'2つから えらぶ',e:'Which do you like better, A or B? が きほんの 形'},
  ]},
 {ico:'🟰',t:'as 〜 as で 「同じくらい」',short:'as 〜 as',g:'jh_comp',
  cards:[
   {x:'smile',say:'「同じくらい 〜」は <b>as ＋ もとの 形 ＋ as</b>。 -er は つけないよ',
    f:row([B('Ken','s'),B('is','v'),B('as tall as','m'),B('Tom')],'o')+row([B('Ken','s'),B('is','v'),B('as taller as','x'),B('Tom')],'x'),
    ex:[['Ken is as tall as Tom.','ケンは トムと 同じくらい 背が 高い']]},
   {x:'think',say:'<b>not as 〜 as</b> は 「〜ほど …ない」。 同じじゃ なくて、 <b>下</b>の ほうに なるの',
    f:two(['as tall as','同じくらい 高い','g'],['not as tall as','〜ほど 高くない<br>（ケンの ほうが 低い）','o']),
    ex:[['Ken is not as tall as Tom.','ケンは トムほど 背が 高くない']]},
   {x:'proud',say:'as 〜 as の 前に <b>twice</b> で 2倍、 <b>three times</b> で 3倍。 <b>as 〜 as possible</b> は 「できるだけ」',
    f:tbl([['2倍','twice as big as'],['3倍','three times as big as'],['半分','half as big as'],['できるだけ','as fast as possible']]),
    ex:[['My room is twice as big as yours.','わたしの 部屋は あなたのの 2倍 広い'],['Come as soon as possible.','できるだけ 早く 来て']]},
  ],
  q:[
   {s:'Ken is as ___ as Tom.',ja:'ケンは トムと 同じくらい 背が 高い',o:['tall','taller','tallest'],h:'as と as の 間',e:'as 〜 as の 間は もとの 形'},
   {p:'「この 本は あの 本ほど おもしろくない」',o:['This book is not as interesting as that one.','This book is not as more interesting as that one.','This book is not interesting than that one.'],h:'not as 〜 as',e:'not as 〜 as ＝ 〜ほど …ない。 間は もとの 形'},
   {s:'Run as fast as ___.',ja:'できるだけ 速く 走って',o:['possible','can','able'],h:'「できるだけ」の 決まった 形',e:'as 〜 as possible ＝ できるだけ 〜。 as fast as you can でも OK'},
   {s:'My room is ___ as big as yours.',ja:'わたしの 部屋は あなたのの 2倍 広い',o:['twice','two','second'],h:'2倍 は 1語',e:'2倍 ＝ twice as 〜 as。 3倍からは three times'},
   {p:'Tom is not as old as Ken. 正しいのは？',o:['Ken is older than Tom.','Tom is older than Ken.','Tom and Ken are the same age.'],h:'not as 〜 as は 「〜ほど …ない」',e:'トムは ケンほど 年上じゃない → ケンの ほうが 年上'},
  ]},
 {ico:'🚀',t:'比較の 応用',short:'比較の 応用',g:'hs_comp2',lv:'hs',
  cards:[
   {x:'smile',say:'比較級を 「ずっと」と 強めるのは <b>much・far・even</b>。 very は 使えないよ',
    f:row([B('much','o'),B('cheaper','m')],'o')+row([B('very','x'),B('cheaper','m')],'x'),
    ex:[['This bag is much cheaper than that one.','この バッグは あれより ずっと 安い']]},
   {x:'happy',say:'「だんだん 〜」は <b>比較級 and 比較級</b>。 「〜すれば するほど …」は <b>The 比較級 〜, the 比較級 …</b>',
    f:row([B('It is getting'),B('colder and colder','m')],'o')+row([B('The more','m'),B('you practice,'),B('the better','m'),B('you get.')],'o'),
    ex:[['It is getting colder and colder.','だんだん 寒く なってきた'],['The more you practice, the better you get.','練習すれば するほど 上手に なる']]},
   {x:'think',say:'最上級を つかわずに 「いちばん」を 言う 言いかえも あるよ。 any other・no other の あとは 1つの 形',
    f:tbl([['いちばん 高い','the highest in Japan'],['ほかの どれよりも','higher than any other mountain'],['…ほど 〜な ものは ない','No other mountain is as high as …']]),
    ex:[['No other mountain in Japan is as high as Mt. Fuji.','日本で 富士山ほど 高い 山は ない']]},
   {x:'proud',say:'than の かわりに <b>to</b> を つかう 形も。 <b>prefer A to B</b>（B より A が 好き）が よく 出るよ',
    f:two(['prefer A to B','B より A が 好き','g'],['superior to','〜より すぐれている','o']),
    ex:[['I prefer tea to coffee.','コーヒーより 紅茶が 好き']]},
  ],
  q:[
   {s:'This bag is ___ cheaper than that one.',ja:'この バッグは あれより ずっと 安い',o:['much','very','more'],h:'比較級を 強める ことば',e:'比較級を 強めるのは much・far・even。 very は ×'},
   {p:'「だんだん 寒く なってきた」',o:['It is getting colder and colder.','It is getting cold and cold.','It is getting more cold and cold.'],h:'比較級 and 比較級',e:'だんだん 〜 ＝ 比較級 and 比較級'},
   {s:'The more you practice, ___ you will get.',ja:'練習すれば するほど 上手に なる',o:['the better','better','the best'],h:'The 比較級 〜, the 比較級 …',e:'The more 〜, the better … ＝ 〜すれば するほど …'},
   {s:'Mt. Fuji is higher than any other ___ in Japan.',ja:'富士山は 日本の ほかの どの 山よりも 高い',o:['mountain','mountains','the mountain'],h:'any other の あとは 1つの 形',e:'than any other ＋ 1つの 形の 名詞'},
   {s:'I prefer tea ___ coffee.',ja:'コーヒーより 紅茶が 好き',o:['to','than','from'],h:'prefer は than を 使わない',e:'prefer A to B ＝ B より A が 好き'},
   {p:'「富士山は 日本で いちばん 高い 山」と 同じ 意味は？',o:['No other mountain in Japan is as high as Mt. Fuji.','No other mountain in Japan is higher as Mt. Fuji.','Mt. Fuji is as high as any mountains in Japan.'],h:'No other 〜 as 〜 as',e:'No other ＋ 1つの 形 ＋ is as 〜 as … ＝ …ほど 〜な ものは ない ＝ いちばん'},
  ]},
];
const MIX=[
 {s:'This is the most ___ book in the library.',ja:'これは 図書館で いちばん おもしろい 本',o:['interesting','interestinger','more interesting'],h:'the most の あとは もとの 形',e:'the most ＋ もとの 形',c:1},
 {s:'He can swim ___ than me.',ja:'彼は わたしより 速く 泳げる',o:['faster','fast','fastest'],h:'than が ある',e:'than ＝ 比較級。 fast → faster',c:0},
 {s:'This one is ___ than that one.',ja:'これは あれより いい',o:['better','gooder','more good'],h:'good の 比較級',e:'good – better – best',c:1},
 {s:'Ann is the tallest ___ her family.',ja:'アンは 家族の 中で いちばん 背が 高い',o:['in','of','than'],h:'家族 は グループ',e:'グループ・場所には in',c:0},
 {s:'My bag is not as ___ as yours.',ja:'わたしの バッグは あなたのほど 重くない',o:['heavy','heavier','heaviest'],h:'as と as の 間',e:'as 〜 as の 間は もとの 形 heavy',c:2},
 {s:'Your English is getting ___.',ja:'あなたの 英語、 どんどん よく なってるね',o:['better and better','good and good','best and best'],h:'だんだん 〜',e:'比較級 and 比較級。 good → better',c:3},
];
const SUM=[
 {pt:'2つは <b>-er than</b>、 3つ いじょうで いちばんは <b>the -est</b>',f:row([B('taller','m'),B('than Ken')],'o')+row([B('the tallest','m'),B('in / of 〜')],'o'),memo:'in ＋ 場所・グループ、 of ＋ 数・なかま'},
 {pt:'長い ことばは <b>more / the most</b>',f:tbl([['good / well','better – best'],['bad','worse – worst'],['many / much','more – most']]),memo:'like A better than B ／ like 〜 the best'},
 {pt:'<b>as 〜 as</b> ＝ 同じくらい、 <b>not as 〜 as</b> ＝ 〜ほど …ない',f:tbl([['2倍','twice as 〜 as'],['できるだけ','as 〜 as possible']]),memo:'as と as の 間は もとの 形'},
 {pt:'応用の 形',f:tbl([['ずっと 〜','much / far / even ＋ 比較級'],['だんだん','比較級 and 比較級'],['〜ほど …','The 比較級, the 比較級'],['いちばん の 言いかえ','No other 〜 as … as']]),memo:'prefer A to B（than では ない）'},
];
SUM.forEach((x,i)=>{if(CH[i])CH[i].sum=x});
UNIT.make({id:'comp',ico:'⚖️',title:'比較',gid:'jh_comp',CH,MIX});
})();
