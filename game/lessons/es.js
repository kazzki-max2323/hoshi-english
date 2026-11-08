/* ミニ授業（es）。書き方は game/lessons/index.js と game/lesson.js を 見てね */
LESSONS.push(
 {id:'es-phonics-abc', lv:'es', cat:'oto', t:'もじの なまえと 音は ちがう', key:['フォニックス','発音','アルファベット'],
  steps:[
   ['m','smile','A は 「エイ」と よぶけど、ことばの なかでは 「ア」の 音に なる ことが おおいよ'],
   ['m','think','もじには 「なまえ」と 「音」が あるんだ', '<table class="fz-table"><tr><th>もじ</th><th>なまえ</th><th>音</th><th>れい</th></tr><tr><td>a</td><td>エイ</td><td>ア</td><td>apple</td></tr><tr><td>b</td><td>ビー</td><td>ブッ</td><td>bag</td></tr><tr><td>c</td><td>シー</td><td>クッ</td><td>cat</td></tr><tr><td>d</td><td>ディー</td><td>ドゥッ</td><td>dog</td></tr></table>'],
   ['m','happy','c・a・t の 音を つなげると 「クッ・ア・トゥッ」→ cat！', '<div class="fz-split"><span>c<small>クッ</small></span><span>a<small>ア</small></span><span>t<small>トゥッ</small></span></div>'],
   ['h','happy','なまえは よそいき、音は ふだんぎ や！ りょうほう おぼえとき〜'],
   ['m','smile','音を つなげれば、しらない ことばも よめるように なるよ'],
  ],
  quiz:[
   {q:'bag の さいしょの 音は どれ？',o:['ブッ','ビー','バイ'],a:0},
   {q:'a の 「なまえ」は どれ？',o:['エイ','ア','アイ'],a:0},
   {q:'c・a・t を つなげて よむと？',o:['キャット（cat）','シー・エイ・ティー'],a:0},
  ]},

 {id:'es-a-an', lv:'es', cat:'zu', t:'a と an の つかいわけ', key:['冠詞','a','an'],
  steps:[
   ['m','smile','ひとつの ものには a を つけるよ。a cat、a dog'],
   ['m','think','でも 「ア・イ・ウ・エ・オ」に にた 音で はじまる ときは an に なるよ', '<div class="fz-pair"><div><b>a</b><small>ふつうの 音の まえ</small><i>a dog</i></div><div><b>an</b><small>アイウエオの 音の まえ</small><i>an apple</i></div></div>'],
   ['m','happy','an apple は つなげて 「アナップル」。いいやすいね', '<div class="fz-sound"><span>an</span><span>apple</span><b>アナップル</b></div>'],
   ['h','happy','「ア・アップル」やと くちが つまるやろ？ せやから n で つなぐんや！'],
   ['m','smile','たまご egg も an egg、ぞう elephant も an elephant だよ'],
  ],
  quiz:[
   {q:'オレンジ 1こ：___ orange',o:['a','an'],a:1},
   {q:'バナナ 1ぽん：___ banana',o:['a','an'],a:0},
   {q:'ならべかえて 文に しよう',order:['I','have','an','egg'],ja:'わたしは たまごを 1こ もっている'},
  ]},

 {id:'es-plural-s', lv:'es', cat:'zu', t:'2つ いじょうは s を つける', key:['複数形','名詞','s'],
  steps:[
   ['m','smile','えいごは 「いくつ あるか」を とても 気に するよ'],
   ['m','think','1つなら a cat、2つ いじょうなら cats。おしりに s が つくよ', '<div class="fz-row"><div class="fz-pic"><span>🐱</span><small>a <b>cat</b></small></div><div class="fz-pic"><span>🐱🐱</span><small>two <b>cats</b></small></div><div class="fz-pic"><span>🐱🐱🐱</span><small>three <b>cats</b></small></div></div>'],
   ['m','wow','にほんごは 「ねこが 3びき」でも 「ねこ」の まま。えいごは ことばが かわるんだ'],
   ['m','smile','box → boxes の ように es に なる ことも あるよ。まずは s から なれよう'],
  ],
  quiz:[
   {q:'りんごが 3こ：three ___',o:['apple','apples'],a:1},
   {q:'いぬが 1ぴき：a ___',o:['dog','dogs'],a:0},
   {q:'ならべかえて 文に しよう',order:['I','have','two','pens'],ja:'わたしは ペンを 2ほん もっている'},
  ]},

 {id:'es-word-order', lv:'es', cat:'zu', t:'えいごの じゅんばん ブロック', key:['語順','文型','主語','動詞'],
  steps:[
   ['m','smile','えいごと にほんごは、ことばの ならぶ じゅんばんが ちがうよ'],
   ['m','think','にほんごは 「する」が さいご。えいごは 「する」が 2ばんめ！', '<div class="fz-col"><div class="fz-blocks"><span class="b s">わたしは<small>だれが</small></span><span class="b o">テニスを<small>なにを</small></span><span class="b v">する<small>する</small></span></div><div class="fz-blocks"><span class="b s">I<small>だれが</small></span><span class="b v">play<small>する</small></span><span class="b o">tennis<small>なにを</small></span></div></div>'],
   ['m','happy','まず 「だれが」、つぎに 「どうする」。これが えいごの 大きな きまりだよ'],
   ['h','happy','えいごは せっかちや！ 「なにするか」を はよ いいたいんやな〜'],
   ['m','smile','I like cats. も 「わたし・すき・ねこ」の じゅんだね', '<div class="fz-blocks"><span class="b s">I<small>だれが</small></span><span class="b v">like<small>すき</small></span><span class="b o">cats<small>なにを</small></span></div>'],
  ],
  quiz:[
   {q:'ならべかえて 文に しよう',order:['I','play','soccer'],ja:'わたしは サッカーを する'},
   {q:'ならべかえて 文に しよう',order:['I','like','dogs'],ja:'わたしは いぬが すき'},
   {q:'えいごで 「だれが」の すぐ あとに くるのは？',o:['どうする（play など）','なにを（tennis など）'],a:0},
  ]},

 {id:'es-be-am-are', lv:'es', cat:'zu', t:'I am と You are', key:['be動詞','am','are','is'],
  steps:[
   ['m','smile','am や are は 「＝（イコール）」の きもちの ことばだよ'],
   ['m','think','I am happy. は 「わたし ＝ うれしい」と いう いみ', '<div class="fz-blocks"><span class="b s">I<small>わたし</small></span><span class="b v">am<small>＝</small></span><span class="b c">happy<small>うれしい</small></span></div>'],
   ['m','think','わたしは am、あなたは are。だれの ことかで かわるよ', '<table class="fz-table"><tr><th>だれ</th><th>＝の ことば</th></tr><tr><td>I（わたし）</td><td>am</td></tr><tr><td>you（あなた）</td><td>are</td></tr><tr><td>he / she（かれ・かのじょ）</td><td>is</td></tr></table>'],
   ['m','smile','I am は I\'m と ちぢめても いいよ。I\'m Ken. 「ぼくは ケンです」'],
  ],
  quiz:[
   {q:'I ___ happy.',o:['am','are','is'],a:0},
   {q:'You ___ kind.',o:['am','are'],a:1},
   {q:'ならべかえて 文に しよう',order:['I','am','ten','years old'],ja:'わたしは 10さい です'},
  ]},

 {id:'es-question', lv:'es', cat:'zu', t:'しつもんの 文の つくりかた', key:['疑問文','Are you','Do you'],
  steps:[
   ['m','smile','しつもんの 文は、ことばの じゅんばんを かえるだけ！'],
   ['m','think','You are happy. の are を まえに だすと Are you happy? に なるよ', '<div class="fz-col"><div class="fz-blocks"><span class="b s">You<small>あなたは</small></span><span class="b v">are<small>＝</small></span><span class="b c">happy.<small>うれしい</small></span></div><div class="fz-blocks"><span class="b v">Are<small>＝？</small></span><span class="b s">you<small>あなたは</small></span><span class="b c">happy?<small>うれしい</small></span></div></div>'],
   ['m','happy','さいごに 「？」を つけて、こえを あげて よもう ↗'],
   ['m','think','like の 文は まえに Do を つけて Do you like cats? だよ', '<div class="fz-pair"><div><b>are の 文</b><small>are を まえへ</small><i>Are you happy?</i></div><div><b>like などの 文</b><small>Do を まえに つける</small><i>Do you like cats?</i></div></div>'],
   ['m','smile','こたえは Yes, I am. や Yes, I do. の ように いうよ'],
  ],
  quiz:[
   {q:'ならべかえて しつもんに しよう',order:['Are','you','hungry'],ja:'あなたは おなかが すいていますか'},
   {q:'___ you like apples?',o:['Do','Are'],a:0},
   {q:'Are you happy? の こたえは？',o:['Yes, I am.','Yes, I do.'],a:0},
  ]},

 {id:'es-can', lv:'es', cat:'zu', t:'can は 「できる」パワー', key:['助動詞','can'],
  steps:[
   ['m','smile','can は 「できるよ！」の パワーを たす ことばだよ'],
   ['m','think','する ことばの まえに can を いれると 「〜できる」に なるよ', '<div class="fz-row"><div class="fz-pic"><span>🏊</span><small>I <b>can</b> swim.</small></div><div class="fz-pic"><span>🚲</span><small>I <b>can</b> ride a bike.</small></div><div class="fz-pic"><span>🎹</span><small>I <b>can</b> play the piano.</small></div></div>'],
   ['m','think','できない ときは can\'t。I can\'t swim. 「およげない」'],
   ['m','smile','Can you swim? と きけば 「およげる？」の しつもんに なるよ'],
  ],
  quiz:[
   {q:'わたしは とべる：I ___ jump.',o:['can','am'],a:0},
   {q:'ならべかえて 文に しよう',order:['I','can','swim'],ja:'わたしは およげる'},
   {q:'「わたしは およげない」は どれ？',o:['I can\'t swim.','I can swim.'],a:0},
  ]},

 {id:'es-in-on-under', lv:'es', cat:'zu', t:'in・on・under で ばしょ', key:['前置詞','in','on','under'],
  steps:[
   ['m','smile','きょうは 「どこに あるか」を いう ことばだよ'],
   ['m','think','in は なか、on は うえ（くっついて）、under は した', '<div class="fz-row"><div class="fz-pic"><span>📦🐱</span><small><b>in</b> the box<br>なか</small></div><div class="fz-pic"><span>🐱<br>📦</span><small><b>on</b> the box<br>うえ</small></div><div class="fz-pic"><span>📦<br>🐱</span><small><b>under</b> the box<br>した</small></div></div>'],
   ['h','happy','なかは in、うえは on、したに もぐって アンダー や！'],
   ['m','smile','The cat is on the box. で 「ねこは はこの うえに いる」だね'],
  ],
  quiz:[
   {q:'ボールは テーブルの した：The ball is ___ the table.',o:['in','on','under'],a:2},
   {q:'ねこは はこの なか：The cat is ___ the box.',o:['in','on','under'],a:0},
   {q:'ならべかえて 文に しよう',order:['The pen','is','on','the desk'],ja:'ペンは つくえの うえに ある'},
  ]},

 {id:'es-like', lv:'es', cat:'kotsu', t:'すき・きらいの いいかた', key:['like','love','否定文'],
  steps:[
   ['m','smile','すきな ものは I like 〜. で いえるよ'],
   ['m','think','すきじゃない ときは I don\'t like 〜. と いうよ', '<div class="fz-pair"><div><b>I like</b><small>すき</small><i>I like cats.</i></div><div><b>I don\'t like</b><small>すきじゃない</small><i>I don\'t like snakes.</i></div></div>'],
   ['m','happy','すごく すきなら I love 〜. も つかえるよ', '<div class="fz-row"><div class="fz-pic"><span>😍</span><small><b>love</b><br>だいすき</small></div><div class="fz-pic"><span>😊</span><small><b>like</b><br>すき</small></div><div class="fz-pic"><span>😣</span><small><b>don\'t like</b><br>すきじゃない</small></div></div>'],
   ['m','think','「いぬが すき」と いう ときは I like dogs. と s を つけるのが ふつうだよ'],
   ['m','smile','じぶんの すきな ものを 3つ、えいごで いって みよう'],
  ],
  quiz:[
   {q:'ねこが すき：I ___ cats.',o:['like','am'],a:0},
   {q:'ならべかえて 文に しよう',order:['I','don\'t','like','carrots'],ja:'わたしは にんじんが すきじゃない'},
   {q:'「だいすき」に いちばん ちかいのは？',o:['love','like','don\'t like'],a:0},
  ]},

 {id:'es-days-months', lv:'es', cat:'kotsu', t:'曜日と 月の おぼえかた', key:['曜日','月','Sunday','Monday'],
  steps:[
   ['m','smile','曜日の えいごは、ぜんぶ おしりが day だよ'],
   ['m','think','Sunday は Sun（たいよう）の 日、Monday は Moon（つき）から できたよ', '<div class="fz-row"><div class="fz-pic"><span>☀️</span><small><b>Sun</b>day<br>にちようび</small></div><div class="fz-pic"><span>🌙</span><small><b>Mon</b>day<br>げつようび</small></div></div>'],
   ['h','happy','サンデーは おひさま、マンデーは おつきさん！ にちようび げつようび そのまんまや'],
   ['m','think','月の なまえは 1月 January、2月 February…と じゅんばんに おぼえよう', '<div class="fz-tip">曜日と 月は さいしょの もじが いつも 大もじ！ <b>M</b>onday、<b>J</b>anuary</div>'],
   ['m','smile','まいにち 「Today is 〜day.」と いうと しぜんに おぼえるよ'],
  ],
  quiz:[
   {q:'げつようびは どれ？',o:['Monday','Sunday','Friday'],a:0},
   {q:'曜日の なまえは みんな なにで おわる？',o:['day','month'],a:0},
   {q:'1月は どれ？',o:['January','June','July'],a:0},
  ]},

 {id:'es-teen', lv:'es', cat:'kotsu', t:'13〜19 は teen の なかま', key:['数','teen','thirteen'],
  steps:[
   ['m','smile','13から 19までは、おしりが teen（ティーン）だよ'],
   ['m','think','six（6）に teen を つけて sixteen（16）。くっつけるだけ！', '<div class="fz-split"><span>six<small>6</small></span><span>teen<small>＋10</small></span></div>'],
   ['m','worry','でも 13 と 15 は かたちが かわるから 気を つけてね', '<table class="fz-table"><tr><th>かず</th><th>もと</th><th>teen</th></tr><tr><td>13</td><td>three</td><td><b>thir</b>teen</td></tr><tr><td>15</td><td>five</td><td><b>fif</b>teen</td></tr><tr><td>16</td><td>six</td><td>sixteen</td></tr></table>'],
   ['m','think','13 thirteen と 30 thirty は にてるよ。teen は 「ティーン」と のばして つよく', '<div class="fz-pair"><div><b>thirteen</b><small>13</small><i>サー<b>ティーン</b></i></div><div><b>thirty</b><small>30</small><i><b>サー</b>ティ</i></div></div>'],
   ['m','smile','じぶんや ともだちの としを えいごで いって みよう'],
  ],
  quiz:[
   {q:'16は どれ？',o:['sixteen','sixty','six'],a:0},
   {q:'fifteen は いくつ？',o:['15','50','5'],a:0},
   {q:'13は どれ？',o:['thirteen','threeteen','thirty'],a:0},
  ]},

 {id:'es-colors-feelings', lv:'es', cat:'kotsu', t:'いろと きもちの ことば', key:['色','気持ち','形容詞','happy'],
  steps:[
   ['m','smile','いろや きもちは、えと いっしょに おぼえると わすれにくいよ'],
   ['m','think','いろは 「もの」と セットで おぼえよう', '<div class="fz-row"><div class="fz-pic"><span>🍎</span><small><b>red</b><br>あか</small></div><div class="fz-pic"><span>🍌</span><small><b>yellow</b><br>きいろ</small></div><div class="fz-pic"><span>🌳</span><small><b>green</b><br>みどり</small></div><div class="fz-pic"><span>🌊</span><small><b>blue</b><br>あお</small></div></div>'],
   ['m','think','きもちは かおの えで おぼえよう', '<div class="fz-row"><div class="fz-pic"><span>😊</span><small><b>happy</b><br>うれしい</small></div><div class="fz-pic"><span>😢</span><small><b>sad</b><br>かなしい</small></div><div class="fz-pic"><span>😠</span><small><b>angry</b><br>おこってる</small></div><div class="fz-pic"><span>😪</span><small><b>sleepy</b><br>ねむい</small></div></div>'],
   ['m','happy','I am happy. で 「わたしは うれしい」。いまの きもちを いって みよう'],
  ],
  quiz:[
   {q:'🍌 バナナの いろは？',o:['yellow','red','blue'],a:0},
   {q:'かなしい きもちは？',o:['sad','happy','angry'],a:0},
   {q:'ならべかえて 文に しよう',order:['I','am','sleepy'],ja:'わたしは ねむい'},
  ]},

 {id:'es-greetings', lv:'es', cat:'zu', t:'あいさつの つかいわけ', key:['あいさつ','Good morning','Hello'],
  steps:[
   ['m','smile','あいさつは じかんで かわるよ', '<div class="fz-line"><i class="pt" style="--x:15%">Good morning<small>あさ</small></i><i class="pt" style="--x:50%">Good afternoon<small>ひる</small></i><i class="pt" style="--x:85%">Good evening<small>ゆうがた・よる</small></i></div>'],
   ['m','think','Hello は いつでも つかえる べんりな あいさつ。Hi は ともだちに つかうよ'],
   ['m','worry','Good night は 「こんばんは」じゃなくて 「おやすみ」。わかれる ときに いうよ'],
   ['m','smile','わかれる ときは Goodbye. や See you! も つかえるよ'],
  ],
  quiz:[
   {q:'あさ 学校で 先生に あったら？',o:['Good morning.','Good night.'],a:0},
   {q:'ねる まえに いうのは？',o:['Good night.','Good evening.','Hello.'],a:0},
   {q:'わかれる ときの あいさつは？',o:['See you!','Good morning.'],a:0},
  ]},

 {id:'es-linking', lv:'es', cat:'oto', t:'えいごの 音は つながる', key:['発音','リンキング','音のつながり'],
  steps:[
   ['m','smile','えいごは ことばと ことばが くっついて きこえる ことが あるよ'],
   ['m','wow','an apple は 「アン アップル」じゃなくて 「アナップル」', '<div class="fz-sound"><span>an</span><span>apple</span><b>アナップル</b></div>'],
   ['m','think','come on は 「カモン」、look at は 「ルッカット」みたいに きこえるよ', '<div class="fz-row"><div class="fz-sound"><span>come</span><span>on</span><b>カモン</b></div><div class="fz-sound"><span>look</span><span>at</span><b>ルッカット</b></div></div>'],
   ['m','happy','まえの ことばの おわりと、つぎの ことばの はじめが つながるんだ'],
   ['m','smile','はじめは ゆっくり。なれたら つなげて いって みよう'],
  ],
  quiz:[
   {q:'an apple は どう きこえる？',o:['アナップル','アン・ア・アップル'],a:0},
   {q:'come on は どう きこえる？',o:['カモン','コメ・オン'],a:0},
  ]},

 {id:'es-5min', lv:'es', cat:'yarikata', t:'まいにち 5ふんの コツ', key:['勉強法','習慣','復習'],
  steps:[
   ['m','smile','えいごは たまに いっぱい やるより、まいにち すこしが つよいよ'],
   ['m','think','5ふんで いいから、きまった じかんに やろう', '<ol class="fz-steps"><li>やる じかんを きめる（あさごはんの あと など）</li><li>1ぷん：きのうの ことばを ふくしゅう</li><li>3ぷん：あたらしい ことばを 3つ</li><li>1ぷん：こえに だして いう</li></ol>'],
   ['m','happy','カレンダーに ◯を つけると、つづけるのが たのしく なるよ', '<div class="fz-tip"><b>1日 5ふん</b> × 30日 ＝ <b>150ぷん</b>！</div>'],
   ['m','smile','できない 日が あっても だいじょうぶ。つぎの 日に また やろう'],
  ],
  quiz:[
   {q:'1日 5ふんを 30日 つづけると？',o:['150ぷん','35ふん'],a:0},
   {q:'5ふんの さいしょに やるのは？',o:['きのうの ことばの ふくしゅう','テスト'],a:0},
  ]},

 {id:'es-speak-aloud', lv:'es', cat:'yarikata', t:'こえに だして れんしゅう', key:['音読','勉強法','発音'],
  steps:[
   ['m','smile','えいごは 目で よむ だけより、こえに だすと おぼえやすいよ'],
   ['m','think','目・くち・みみを ぜんぶ つかうから、あたまに のこるんだ', '<div class="fz-row"><div class="fz-pic"><span>👀</span><small><b>みる</b></small></div><div class="fz-pic"><span>👄</span><small><b>いう</b></small></div><div class="fz-pic"><span>👂</span><small><b>きく</b></small></div></div>'],
   ['m','think','やりかたは かんたん', '<ol class="fz-steps"><li>おてほんを きく</li><li>まねして いう</li><li>3かい くりかえす</li><li>なにも みないで いって みる</li></ol>'],
   ['m','smile','ちいさな こえでも だいじょうぶ。くちを うごかす ことが だいじだよ'],
  ],
  quiz:[
   {q:'おぼえやすいのは どっち？',o:['こえに だして よむ','目で みる だけ'],a:0},
   {q:'おてほんを きいた つぎに やるのは？',o:['まねして いう','ねる'],a:0},
  ]},

 {id:'es-picture-words', lv:'es', cat:'yarikata', t:'たんごは えと いっしょに', key:['単語','覚え方','勉強法'],
  steps:[
   ['m','smile','たんごは 「えいご＝にほんご」より 「えいご＝え」で おぼえよう'],
   ['m','think','apple と きいたら 「りんご」より さきに 🍎 を おもいうかべてね', '<div class="fz-pair"><div><b>apple ＝ りんご</b><small>ことばだけ</small><i>わすれやすい</i></div><div><b>apple ＝ 🍎</b><small>えで</small><i>すぐ でてくる</i></div></div>'],
   ['m','happy','カードの おもてに えいご、うらに えを かくと たのしいよ', '<div class="fz-row"><div class="fz-pic"><span>🐶</span><small><b>dog</b></small></div><div class="fz-pic"><span>🚗</span><small><b>car</b></small></div><div class="fz-pic"><span>⭐</span><small><b>star</b></small></div></div>'],
   ['m','smile','へやの ものに えいごの なふだを はるのも おすすめだよ'],
  ],
  quiz:[
   {q:'⭐ は えいごで？',o:['star','sun','moon'],a:0},
   {q:'たんごを おぼえる よい ほうほうは？',o:['えと いっしょに おぼえる','もじを みる だけ'],a:0},
  ]},

 {id:'es-hama-week', lv:'es', cat:'hama', t:'ハマ子の 曜日の うた', key:['曜日','Wednesday','覚え歌'],
  steps:[
   ['h','happy','まいど！ きょうは おばちゃんが 曜日の うたを つくったで！'],
   ['h','happy','サン・マン・チュー・ウェン、サーズ・フライ・サタ！ ぜんぶ おしりに デーや', '<div class="fz-tip">Sunday・Monday・Tuesday・<b>Wednesday</b>・Thursday・Friday・Saturday</div>'],
   ['m','think','Wednesday は 「ウェンズデイ」と よむよ。さいしょの d は 音が しないんだ'],
   ['h','wow','ウェドネスデー ちゃうで！ d は かくれんぼ しとるんや'],
   ['m','smile','リズムに のって 3かい いって みよう'],
  ],
  quiz:[
   {q:'Sunday の つぎの 日は？',o:['Monday','Saturday','Friday'],a:0},
   {q:'すいようびは どれ？',o:['Wednesday','Thursday','Tuesday'],a:0},
   {q:'Friday は なにようび？',o:['きんようび','もくようび','どようび'],a:0},
  ]},

 {id:'es-hama-bd', lv:'es', cat:'hama', t:'b と d は ベッドで おぼえる', key:['アルファベット','b','d','覚え歌'],
  steps:[
   ['h','happy','b と d、どっちが どっちか まよう子 おるやろ？'],
   ['h','proud','bed って かいてみ！ りょうはしの ぼうが ベッドの いたや', '<div class="fz-row"><div class="fz-pic"><span>🛏️</span><small><b>b</b>e<b>d</b><br>ぼう…ぼう</small></div></div>'],
   ['m','think','b は ぼうが ひだり、d は ぼうが みぎ だね', '<div class="fz-pair"><div><b>b</b><small>ぼうが ひだり</small><i>bag</i></div><div><b>d</b><small>ぼうが みぎ</small><i>dog</i></div></div>'],
   ['h','happy','うたで いくで〜 「ぼうが さき なら ブッの b、まるが さき なら ドゥッの d」'],
   ['m','smile','まよったら bed の えを おもいだしてね'],
  ],
  quiz:[
   {q:'ぼうが ひだりに あるのは どっち？',o:['b','d'],a:0},
   {q:'dog の さいしょの もじは？',o:['d','b'],a:0},
  ]},

 {id:'es-hama-count', lv:'es', cat:'hama', t:'ハマ子の かぞえうた 1〜5', key:['数','one','three','覚え歌'],
  steps:[
   ['h','happy','かぞえうた いくで〜！ 1から 5まで おばちゃんと いっしょに！'],
   ['h','happy','いぬが ワン（1）！ ツー（2）っと はしって、スリー（3）っと ころぶ', '<table class="fz-table"><tr><th>かず</th><th>えいご</th><th>え</th></tr><tr><td>1</td><td>one</td><td>🐶</td></tr><tr><td>2</td><td>two</td><td>🏃</td></tr><tr><td>3</td><td>three</td><td>🤸</td></tr><tr><td>4</td><td>four</td><td>😮‍💨</td></tr><tr><td>5</td><td>five</td><td>✋</td></tr></table>'],
   ['h','happy','フォー（4）っと ためいき、ファイブ（5）で ハイタッチや！ ✋'],
   ['m','think','three の th は、したを かるく はで はさんで いうよ'],
   ['m','smile','ゆびを おりながら いうと、もっと おぼえやすいよ'],
  ],
  quiz:[
   {q:'4は どれ？',o:['four','five','three'],a:0},
   {q:'two は いくつ？',o:['2','3','10'],a:0},
   {q:'ハイタッチの ゆびの かずは？',o:['five','four'],a:0},
  ]},
);
