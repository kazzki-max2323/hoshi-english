/* ミニ授業（hs）。書き方は game/lessons/index.js と game/lesson.js を 見てね */
LESSONS.push(
 {id:'hs-kateiho-kyori', lv:'hs', cat:'zu', t:'仮定法は 現実から 一歩 はなれる', key:['仮定法','過去形','if','were'],
  steps:[
   ['m','smile','きょうは 仮定法。「もし 〜なら」の 気持ちを 絵で つかもう'],
   ['m','think','ポイントは 過去形。過去形は 「時間」だけで なく 「現実からの きょり」も あらわすの'],
   ['m','think','今の 話なのに 過去形を 使うと 「ほんとうは ちがうけど…」という 合図に なるよ','<div class="fz-pair"><div><b>If it rains,</b><small>ふるかも（ありえる）</small><i>I will stay home.</i></div><div><b>If I were a bird,</b><small>じっさいは ちがう</small><i>I could fly to you.</i></div></div>'],
   ['h','happy','現実から 一歩 うしろへ さがるんが 過去形や！ 鳥やないのに 鳥ごっこ、なんでやねん！'],
   ['m','proud','だから 助動詞も could / would / might と 過去形に そろえるの。主語が I でも were が 基本だよ'],
  ],
  quiz:[
   {q:'今 お金が ないので「お金が あれば 買うのに」：If I ___ money, I would buy it.',o:['have','had','will have'],a:1},
   {q:'ならべかえよう：「もし ぼくが きみなら、それを やるのに」',order:['If I were you,','I','would','do it'],ja:'もし ぼくが きみなら、それを やるのに'},
  ]},

 {id:'hs-jisei-itchi', lv:'hs', cat:'zu', t:'時制の一致は 時計を そろえる', key:['時制の一致','過去形','said','間接話法'],
  steps:[
   ['m','smile','He said he was tired. どうして is じゃなくて was なのかな？'],
   ['m','think','「言った」時点に 時計を あわせて、その とき つかれていた と 考えるからだよ','<div class="fz-line"><i class="pt" style="--x:25%">そのとき<small>said / was tired</small></i><i class="pt now" style="--x:75%">now<small>話している</small></i></div>'],
   ['m','think','日本語は「つかれていると 言った」でも、英語は 主節が 過去なら 中も 過去に そろえるのが ふつう'],
   ['m','wow','ただし「地球は 太陽の まわりを 回る」のような いつでも 正しい ことは 現在形の ままで OK'],
   ['m','proud','The teacher said the earth goes around the sun. これは 正しい 英語だよ'],
  ],
  quiz:[
   {q:'「彼女は 忙しいと 言った」She said she ___ busy.',o:['is','was','will be'],a:1},
   {q:'いつでも 正しい ことなら？ He said that water ___ at 100℃.',o:['boils','boiled','boiling'],a:0},
  ]},

 {id:'hs-bunshi-kobun', lv:'hs', cat:'zu', t:'分詞構文は 接続詞の 省エネ', key:['分詞構文','分詞','ing','接続詞'],
  steps:[
   ['m','smile','分詞構文は 「接続詞と 主語を けずった」 文の かたちだよ'],
   ['m','think','When I was walking along the beach, … の when と I was を けずると…','<div class="fz-col"><div class="fz-blocks"><span class="b m">When I was<small>けずる</small></span><span class="b v">walking<small>歩いて</small></span><span class="b p">along the beach,<small>浜辺を</small></span></div><div class="fz-blocks"><span class="b s">I<small>だれが</small></span><span class="b v">found<small>見つけた</small></span><span class="b o">a shell<small>何を</small></span></div></div>'],
   ['m','think','Walking along the beach, I found a shell. 主語が 同じ ときだけ けずれるの'],
   ['h','happy','接続詞も 主語も ポイ！ 省エネ英語や。浜辺で 貝 ひろうんも 省エネで いこか'],
   ['m','proud','「〜して」「〜なので」など 意味は 文脈で きまるよ。受け身なら Seen from the sky, … の ように 過去分詞'],
  ],
  quiz:[
   {q:'Feeling tired, I went to bed early. の 意味に 近いのは？',o:['つかれていたので 早く ねた','つかれる ために 早く ねた','早く ねたので つかれた'],a:0},
   {q:'「空から 見ると」___ from the sky, the island looks small.',o:['Seeing','Seen','To see'],a:1},
  ]},

 {id:'hs-kankei-fukushi', lv:'hs', cat:'zu', t:'関係副詞 where・when・why', key:['関係副詞','where','when','why','関係代名詞'],
  steps:[
   ['m','smile','関係副詞は 「場所・時・理由」の 名詞に 説明を つなぐ 接着剤だよ'],
   ['m','think','前の 名詞で えらぶの','<table class="fz-table"><tr><th>前の 名詞</th><th>関係副詞</th><th>例</th></tr><tr><td>場所</td><td>where</td><td>the town where I was born</td></tr><tr><td>時</td><td>when</td><td>the day when we met</td></tr><tr><td>理由</td><td>why</td><td>the reason why he left</td></tr></table>'],
   ['m','think','where の うしろは 主語も 目的語も そろった 完全な 文。ここが 関係代名詞との ちがい'],
   ['m','worry','the town which I visited なら visit の 目的語が ぬけて いるので which だよ'],
   ['m','proud','the way how は 使わない。the way か how の どちらか 1つ だけに してね'],
  ],
  quiz:[
   {q:'This is the house ___ my grandma lives.',o:['which','where','when'],a:1},
   {q:'This is the house ___ my grandma built.',o:['which','where','why'],a:0},
   {q:'ならべかえよう：「それが 彼が おこった 理由だ」',order:['That is','the reason','why','he got angry'],ja:'それが 彼が おこった 理由だ'},
  ]},

 {id:'hs-kyocho-itthat', lv:'hs', cat:'zu', t:'強調構文 It is 〜 that', key:['強調構文','it','that'],
  steps:[
   ['m','smile','It is 〜 that … は 「〜こそが」と スポットライトを 当てる 形だよ'],
   ['m','think','Ken broke the window. の Ken を 強調すると…','<div class="fz-blocks"><span class="b m">It was<small>ライト ON</small></span><span class="b s">Ken<small>ケンこそ</small></span><span class="b m">that<small>つなぎ</small></span><span class="b v">broke<small>わった</small></span><span class="b o">the window<small>窓を</small></span></div>'],
   ['m','think','見分け方：It was と that を 消して 文が のこれば 強調構文','<div class="fz-tip">It was <b>yesterday</b> that I met her. → I met her yesterday. ○</div>'],
   ['m','proud','形式主語の It is 〜 that と まよったら、この 消してみる テストを してね'],
  ],
  quiz:[
   {q:'強調構文は どれ？',o:['It is important that you sleep.','It was in Kobe that I met him.','It is true that he is kind.'],a:1},
   {q:'ならべかえよう：「その 窓を わったのは ケンだった」',order:['It was','Ken','that','broke the window'],ja:'その 窓を わったのは ケンだった'},
  ]},

 {id:'hs-article-a-the', lv:'hs', cat:'zu', t:'a と the の 感覚', key:['冠詞','a','the','名詞'],
  steps:[
   ['m','smile','a と the の ちがいは 「相手も どれか わかるか」だよ'],
   ['m','think','a は 「たくさんの 中の どれか 1つ」、the は 「あれね、と 指させる それ」','<div class="fz-row"><div class="fz-pic"><span>🐚🐚🐚</span><small><b>a</b> shell（どれか 1つ）</small></div><div class="fz-pic"><span>👉🐚</span><small><b>the</b> shell（その 貝）</small></div></div>'],
   ['m','think','I found a shell. The shell was pink. 2回目は もう おたがい わかるから the'],
   ['h','happy','「ある 貝」が 2回目から「例の 貝」に 出世や！ 貝も びっくりやで'],
   ['m','proud','the sun や the sea の ように 1つしか ない もの・すぐ わかる ものも the だよ'],
  ],
  quiz:[
   {q:'I bought ___ book yesterday. （はじめて 話題に 出す）',o:['a','the'],a:0},
   {q:'Please open ___ window. （部屋に 窓は 1つ）',o:['a','the'],a:1},
  ]},

 {id:'hs-kazoe-countable', lv:'hs', cat:'zu', t:'数えられる 名詞・数えられない名詞', key:['名詞','可算','不可算','冠詞','water','information'],
  steps:[
   ['m','smile','英語は 名詞を 「形が はっきり あるか」で 2つに 分けるよ'],
   ['m','think','りんごは 1こ 2こ と 区切れる。水は 切っても 水の まま','<div class="fz-row"><div class="fz-pic"><span>🍎🍎</span><small>an apple / <b>apples</b></small></div><div class="fz-pic"><span>💧</span><small><b>water</b>（a は つかない）</small></div><div class="fz-pic"><span>🥛</span><small><b>a glass of</b> water</small></div></div>'],
   ['m','think','数えたい ときは a glass of / a piece of など 「入れもの」を つけるの'],
   ['m','worry','注意！ information・advice・homework・furniture は 英語では 数えられない 名詞'],
   ['m','proud','a piece of advice や some information の ように 言えば 自然だよ'],
  ],
  quiz:[
   {q:'正しいのは どれ？',o:['an advice','some advices','some advice'],a:2},
   {q:'「水を 2はい」two ___ of water',o:['glasses','waters','glass'],a:0},
  ]},

 {id:'hs-will-goingto', lv:'hs', cat:'zu', t:'will と be going to', key:['未来','will','be going to','助動詞'],
  steps:[
   ['m','smile','どちらも 未来だけど、気持ちの 出どころが ちがうよ'],
   ['m','think','will は 「今 その場で 決めた」、be going to は 「もう 決めてある・兆しが 見える」','<div class="fz-pair"><div><b>will</b><small>今 決めた・予想</small><i>The phone is ringing. I\'ll get it.</i></div><div><b>be going to</b><small>前から 予定・兆し</small><i>I\'m going to visit Kyoto next week.</i></div></div>'],
   ['m','think','空に 黒い 雲。Look! It\'s going to rain. 目の 前に 証拠が あるから going to が 自然'],
   ['m','proud','どちらでも 言える 場面も 多いので、まずは この 2つの 感覚を おぼえてね'],
  ],
  quiz:[
   {q:'電話が 鳴った！「ぼくが 出るよ」I ___ get it.',o:['will','am going to'],a:0},
   {q:'旅行の チケットは もう 買った。I ___ go to Okinawa.',o:['will','am going to'],a:1},
  ]},

 {id:'hs-phrasal-up-out-off', lv:'hs', cat:'kotsu', t:'句動詞は up・out・off の 絵', key:['句動詞','up','out','off','熟語'],
  steps:[
   ['m','smile','句動詞は 丸暗記より 小さな ことばの 絵で おぼえると ラクだよ'],
   ['m','think','up は 上へ→いっぱいまで、out は 外へ→最後まで、off は はなれる','<div class="fz-row"><div class="fz-pic"><span>⬆️</span><small><b>up</b> 上・完了<br>eat up / clean up</small></div><div class="fz-pic"><span>📤</span><small><b>out</b> 外・最後まで<br>run out / find out</small></div><div class="fz-pic"><span>✂️</span><small><b>off</b> はなれる<br>take off / turn off</small></div></div>'],
   ['m','think','eat up は 「お皿が からっぽに なるまで 食べる」。up が 「すっかり」を 足してるの'],
   ['h','happy','電気から スイッチが はなれて turn off、飛行機が 地面から はなれて take off や！'],
   ['m','proud','知らない 句動詞も 絵から 意味を 予想できる ように なるよ'],
  ],
  quiz:[
   {q:'We ran ___ of milk. （牛乳が なくなった）',o:['up','out','off'],a:1},
   {q:'Please turn ___ the light. （電気を 消して）',o:['up','out','off'],a:2},
  ]},

 {id:'hs-gogen-word-parts', lv:'hs', cat:'kotsu', t:'語源で 単語を ふやそう', key:['語彙','語源','接頭辞','接尾辞','port'],
  steps:[
   ['m','smile','長い 単語も パーツに 分けると 意味が 見えてくるよ'],
   ['m','think','port は 「運ぶ」。前に つく パーツで 方向が 変わるの','<div class="fz-row"><div class="fz-pic"><span>📥</span><small><b>im</b>port 中へ 運ぶ＝輸入</small></div><div class="fz-pic"><span>📤</span><small><b>ex</b>port 外へ 運ぶ＝輸出</small></div><div class="fz-pic"><span>🚚</span><small><b>trans</b>port 向こうへ 運ぶ</small></div></div>'],
   ['m','think','うしろの パーツ -able は 「〜できる」','<div class="fz-split"><span>port<small>運ぶ</small></span><span>able<small>できる</small></span></div>'],
   ['m','think','pre- 前、re- もう一度、un- 〜でない も よく 出る パーツだよ'],
   ['m','proud','1つの 語根で 5〜10語 ふやせる。単語帳の 語源コラムも 活用してね'],
  ],
  quiz:[
   {q:'re-（もう一度）＋ view（見る）＝ review の 意味は？',o:['見直す','前もって 見る','見のがす'],a:0},
   {q:'pre-（前）＋ view ＝ preview の 意味は？',o:['見直し','予告・下見','感想'],a:1},
  ]},

 {id:'hs-collocation', lv:'hs', cat:'kotsu', t:'コロケーションは セットで', key:['コロケーション','熟語','make','take','heavy'],
  steps:[
   ['m','smile','コロケーションは 「いっしょに 使われやすい ことばの 組み合わせ」だよ'],
   ['m','think','日本語に つられると まちがえやすいの','<table class="fz-table"><tr><th>日本語</th><th>○</th><th>×</th></tr><tr><td>強い 雨</td><td>heavy rain</td><td>strong rain</td></tr><tr><td>写真を とる</td><td>take a photo</td><td>shoot a photo</td></tr><tr><td>まちがえる</td><td>make a mistake</td><td>do a mistake</td></tr></table>'],
   ['h','happy','雨は 重たい heavy、コーヒーは 強い strong！ 天気と コーヒー、キャラ ちゃうねん'],
   ['m','think','単語は 1語で なく heavy rain の ように 2〜3語の かたまりで 覚えるのが コツ'],
   ['m','proud','辞書の 例文や 英英辞典の コロケーション欄を 見る くせを つけよう'],
  ],
  quiz:[
   {q:'「宿題を する」___ my homework',o:['make','do','take'],a:1},
   {q:'「交通量が 多い」___ traffic',o:['heavy','strong','many'],a:0},
  ]},

 {id:'hs-oto-datsuraku', lv:'hs', cat:'oto', t:'音の 脱落と 弱形', key:['発音','リスニング','音声変化','弱形','can'],
  steps:[
   ['m','smile','聞きとれない 原因の 多くは 「音が 消える・弱くなる」ことなんだ'],
   ['m','think','t や d が 次の 子音と ぶつかると ほとんど 聞こえなく なるよ','<div class="fz-sound"><span>good</span><span>night</span><b>グッ ナイ</b></div>'],
   ['m','think','and・to・can など 機能語は 弱く 短く。and は「ン」、to は「タ」くらい','<div class="fz-pair"><div><b>I can go.</b><small>弱い can</small><i>アイ クン ゴウ</i></div><div><b>I can\'t go.</b><small>強い can\'t</small><i>アイ キャーン(ト) ゴウ</i></div></div>'],
   ['m','think','can は 弱く、can\'t は 強く 長く。t が 聞こえなくても 強さで 区別できるの'],
   ['m','proud','スクリプトを 見て 消える 音に しるしを つけ、まねして 読むと 耳が かわるよ'],
  ],
  quiz:[
   {q:'「アイ キャーン ゴウ」と 強く 長く 聞こえたら？',o:['I can go.','I can\'t go.'],a:1},
   {q:'good night で ほとんど 聞こえなく なる 音は？',o:['g','d','n'],a:1},
  ]},

 {id:'hs-hama-uncountable', lv:'hs', cat:'hama', t:'ハマ子の 数えへん 名詞の 歌', key:['名詞','不可算','advice','information','furniture','homework'],
  steps:[
   ['h','happy','まいど！ 数えられへん 名詞、ハマ子の 物語で いっぺんに 覚えよか'],
   ['h','proud','家具(furniture)の 上で 宿題(homework)、助言(advice)と 情報(information) 荷物(baggage)に つめて…'],
   ['h','happy','「ぜんぶ ひとまとめ、数えへん！」 ここで 手を パンッや！','<div class="fz-row"><div class="fz-pic"><span>🛋️</span><small><b>furniture</b></small></div><div class="fz-pic"><span>📓</span><small><b>homework</b></small></div><div class="fz-pic"><span>💡</span><small><b>advice</b></small></div><div class="fz-pic"><span>🧳</span><small><b>baggage</b></small></div></div>'],
   ['m','smile','どれも 「中身の 集まり」で、1こ ずつの 形が ないから 数えないんだね'],
   ['m','think','数えたい ときは a piece of furniture、two pieces of advice の ように 言おう'],
  ],
  quiz:[
   {q:'正しいのは どれ？',o:['many furnitures','a lot of furniture','a furniture'],a:1},
   {q:'「宿題が たくさん ある」I have a lot of ___.',o:['homework','homeworks'],a:0},
  ]},

 {id:'adv-paraphrase', lv:'adv', cat:'yarikata', t:'パラフレーズで 得点力アップ', key:['パラフレーズ','言いかえ','語彙','TOEIC','英検','読解'],
  steps:[
   ['m','smile','英検や TOEIC の 正解は、本文の ことばを 言いかえて ある ことが 多いよ'],
   ['m','think','本文と 選択肢で 同じ 意味の ちがう 表現を さがすのが コツ','<div class="fz-pair"><div><b>本文</b><small>Text</small><i>The meeting was postponed.</i></div><div><b>選択肢</b><small>Answer</small><i>The meeting was put off.</i></div></div>'],
   ['m','think','単語レベルの 言いかえ例','<table class="fz-table"><tr><th>本文</th><th>選択肢</th></tr><tr><td>buy</td><td>purchase</td></tr><tr><td>a lot of</td><td>numerous / plenty of</td></tr><tr><td>cannot attend</td><td>be unable to come</td></tr></table>'],
   ['m','worry','逆に 本文と 同じ 単語が ならんだ 選択肢は ワナの ことも あるので 注意'],
   ['m','proud','練習では 正解の 根拠と なる 言いかえペアを ノートに 集めると 語彙も ふえるよ'],
  ],
  quiz:[
   {q:'"The store is closed temporarily." の 言いかえは？',o:['The store has shut down for good.','The store is not open for now.','The store is moving.'],a:1},
   {q:'purchase に いちばん 近い 語は？',o:['sell','buy','borrow'],a:1},
  ]},

 {id:'adv-discourse-markers', lv:'adv', cat:'kotsu', t:'つなぎ言葉は 文の 道しるべ', key:['つなぎの言葉','however','therefore','ライティング','読解'],
  steps:[
   ['m','smile','つなぎの 言葉は 文章の 道しるべ。次に 何が 来るか 予測できるよ'],
   ['m','think','はたらきで 分けて 覚えよう','<table class="fz-table"><tr><th>はたらき</th><th>例</th></tr><tr><td>逆接</td><td>however / nevertheless</td></tr><tr><td>結果</td><td>therefore / as a result</td></tr><tr><td>追加</td><td>moreover / in addition</td></tr><tr><td>対比</td><td>in contrast / on the other hand</td></tr></table>'],
   ['m','worry','however は 副詞なので 2文を つなげない。It was cheap. However, it broke. が 正しい'],
   ['h','happy','however が 来たら ハンドル 急カーブや！ 筆者の 本音は その あとに 出るで'],
   ['m','proud','長文では 逆接の あとに 線を 引くと 主張が つかみやすいよ'],
  ],
  quiz:[
   {q:'The plan was costly. ___, it was approved.（逆接）',o:['Therefore','However','Moreover'],a:1},
   {q:'He trained hard. ___, he won the race.（結果）',o:['As a result','In contrast','However'],a:0},
  ]},

 {id:'adv-ipa', lv:'adv', cat:'oto', t:'発音記号を 読めるように', key:['発音記号','発音','IPA','アクセント'],
  steps:[
   ['m','smile','発音記号が 読めると、辞書だけで 正しい 音が わかるように なるよ'],
   ['m','think','カタカナに ない 音を まず おさえよう','<table class="fz-table"><tr><th>記号</th><th>例</th><th>コツ</th></tr><tr><td>/æ/</td><td>cat</td><td>エの口で ア</td></tr><tr><td>/ʌ/</td><td>cup</td><td>短く 強い ア</td></tr><tr><td>/θ/ /ð/</td><td>think / this</td><td>舌先を 歯に</td></tr><tr><td>/ə/</td><td>about の a</td><td>力の ぬけた あいまい音</td></tr></table>'],
   ['m','think','/ˈ/ の ついた 音節が アクセント。phoˈtography と ˈphotograph で 位置が ちがうの'],
   ['m','proud','新しい 単語は 発音記号を 見て 声に 出す。これだけで 聞きとりも 伸びるよ'],
  ],
  quiz:[
   {q:'/θ/ の 音を ふくむ 単語は？',o:['this','think','sink'],a:1},
   {q:'アクセントが 第2音節に あるのは？',o:['photograph','photography'],a:1},
  ]},

 {id:'adv-tadoku-seidoku', lv:'adv', cat:'yarikata', t:'多読と 精読の やり方', key:['多読','精読','読解','勉強法'],
  steps:[
   ['m','smile','読む 練習には 多読と 精読の 2つが あって、どちらも 必要だよ'],
   ['m','think','多読は 量で なれる、精読は 1文を 深く 分解する','<div class="fz-pair"><div><b>多読</b><small>スピードと 量</small><i>9割 わかる 本を 辞書なしで</i></div><div><b>精読</b><small>正確さ</small><i>短い文を 構造まで 分析</i></div></div>'],
   ['m','think','精読の 手順','<ol class="fz-steps"><li>S・V・O を さがして 印を つける</li><li>修飾が どこに かかるか 矢印で 示す</li><li>自然な 日本語に 訳して 確認</li><li>最後に 音読して 頭から 意味を とる</li></ol>'],
   ['m','proud','おすすめは 精読 1割・多読 9割。精読で 得た 型が 多読で 自然に 身につくよ'],
  ],
  quiz:[
   {q:'多読に 向いている 本は？',o:['ほぼ 辞書なしで 読める 本','1ページに 知らない 語が 30個ある 本'],a:0},
   {q:'精読で 最初に すると よいのは？',o:['全文を 速く 読む','主語と 動詞を 見つける','単語を 50個 覚える'],a:1},
  ]},

 {id:'adv-eiken-toeic', lv:'adv', cat:'yarikata', t:'英検・TOEIC の 勉強法', key:['英検','TOEIC','勉強法','試験'],
  steps:[
   ['m','smile','英検準1級〜1級、TOEIC で 点を 伸ばす 基本の 流れを 紹介するね'],
   ['m','think','まずは 過去問・公式問題集で 実力と 形式を 知るの','<ol class="fz-steps"><li>過去問を 時間を 計って 1回 とく</li><li>まちがいを 「語彙・文法・時間」に 分類</li><li>弱い ところを 単語帳と 問題集で 補強</li><li>本番と 同じ 時間で もう一度</li></ol>'],
   ['m','think','英検の ライティングは 「意見→理由2つ→結論」の 型を 決めて おくと 安定するよ'],
   ['m','think','TOEIC は 時間との 勝負。Part 5 は 1問 20秒を 目安に、迷ったら 印を つけて 先へ'],
   ['h','happy','わからん 問題に しがみついたら あかん！ 次の 問題が 「はよ 来て〜」て 待っとるで'],
   ['m','proud','リスニングは 聞いた 音声を シャドーイングまで して 1セットで おわりだよ'],
  ],
  quiz:[
   {q:'過去問を といた あと まず すべきことは？',o:['すぐ 次の 年の 過去問','まちがいの 原因を 分類','点数だけ 記録して おわり'],a:1},
   {q:'TOEIC Part 5 で 迷った ときは？',o:['わかるまで 考える','印を つけて 先へ 進む'],a:1},
  ]},

 {id:'adv-think-in-english', lv:'adv', cat:'yarikata', t:'英語で 考える 練習', key:['スピーキング','英語で考える','独り言','言いかえ'],
  steps:[
   ['m','smile','日本語→英語の 翻訳を へらすと、話すのも 読むのも 速く なるよ'],
   ['m','think','1日 5分から できる 練習','<ol class="fz-steps"><li>目に 入る ものを 英語で つぶやく</li><li>自分の 行動を 実況する（I\'m making tea.）</li><li>言えない 語は かんたんな 英語で 言いかえる</li><li>あとで 言えなかった 表現を 調べる</li></ol>'],
   ['m','think','「やかん」が 出なくても a thing for boiling water で OK。止まらない ことが 大事'],
   ['m','proud','調べた 表現は 次の 日に また 使う。これで 自分の ことばに なっていくよ'],
  ],
  quiz:[
   {q:'「冷蔵庫」が 出てこない。どう する？',o:['だまって 調べる','a box that keeps food cold と 言う'],a:1},
   {q:'ならべかえよう：「いま お茶を いれて いる ところだ」',order:['I\'m','making','tea','now'],ja:'いま お茶を いれて いる ところだ'},
  ]},

 {id:'adv-hama-affect-effect', lv:'adv', cat:'hama', t:'ハマ子の affect と effect', key:['affect','effect','語彙','品詞','つづり'],
  steps:[
   ['m','worry','affect と effect、似ていて よく まちがえるよね'],
   ['h','happy','まかしとき！ A は Action の A で 動詞、E は End の E で 結果、つまり 名詞や！','<div class="fz-pair"><div><b>affect</b><small>動詞：影響する</small><i>Stress affects sleep.</i></div><div><b>effect</b><small>名詞：効果・結果</small><i>a side effect</i></div></div>'],
   ['h','proud','「A で 動いて E で おわる」、アクション映画の エンドロールや！'],
   ['m','smile','have an effect on 〜 で 「〜に 影響を 与える」。affect と ほぼ 同じ 意味に なるね'],
   ['m','think','ただ 硬い 表現の effect change（変化を もたらす）の ような 動詞用法も あるので 上級者は 注意'],
  ],
  quiz:[
   {q:'The weather can ___ our mood.',o:['affect','effect'],a:0},
   {q:'This medicine has a strong ___.',o:['affect','effect'],a:1},
  ]},
);
