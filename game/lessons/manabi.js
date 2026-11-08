/* ミニ授業（学び方）。英語が 身につく やり方・覚え方の コツを あつめた 授業。
   学習の研究（思い出す練習・間隔反復・まぜて練習・ねむり・ちょうどいい難しさ・4つの柱 など）と、
   よく 使われる 勉強法（ディクテーション・スラッシュリーディング・4/3/2 など）を、自分の ことばと 図で まとめた。
   書き方は game/lessons/index.js と game/lesson.js を 見てね */
LESSONS.push(
/* ---------- 小学生 ---------- */
 {id:'es-recall-cover', lv:'es', cat:'kagaku', t:'かくして おもいだす れんしゅう', key:['勉強法','復習','単語','思い出す'],
  steps:[
   ['m','smile','ことばを おぼえる いちばんの コツを おしえるね。それは 「おもいだす」 ことだよ'],
   ['m','think','なんども 見るより、えいごを かくして 「なんだっけ？」と おもいだす ほうが あたまに のこるんだ', '<div class="fz-pair"><div><b>見るだけ</b><small>👀 dog… dog… dog…</small><i>わかった きが する</i></div><div><b>かくして おもいだす</b><small>🙈 いぬ は…？ → dog!</small><i>ほんとうに おぼえる</i></div></div>'],
   ['m','happy','カードの うらに えいご、おもてに え。えを 見て えいごを いって から、うらがえして たしかめよう', '<div class="fz-row"><div class="fz-pic"><span>🐶</span><small>おもて：え</small></div><div class="fz-pic"><span>🔄</span><small>いってから めくる</small></div><div class="fz-pic"><span style="font-size:1.3rem">dog</span><small>うら：えいご</small></div></div>'],
   ['h','happy','でてこんでも ええねん！ うんうん かんがえた ぶん、あたまに しみこむんや'],
   ['m','smile','この アプリの 単語帳も、さきに こたえを かんがえてから めくってね'],
  ],
  quiz:[
   {q:'よく おぼえられるのは どっち？',o:['えいごを かくして おもいだす','えいごを なんども 見るだけ'],a:0},
   {q:'おもいだせなかった ときは？',o:['こたえを 見て、あとで もういちど','もう やめる'],a:0},
  ]},

 {id:'es-sleep', lv:'es', cat:'kagaku', t:'ねる まえに ちょっと ふくしゅう', key:['勉強法','復習','睡眠','習慣'],
  steps:[
   ['m','smile','ねて いる あいだに、あたまは きょう おぼえた ことを せいりして しまって いるんだって'],
   ['m','think','だから ねる まえに 3つだけ ふくしゅう → ぐっすり ねる → あさ もういちど', '<div class="fz-row"><div class="fz-pic"><span>📖</span><small>ねる まえ<br>3つ ふくしゅう</small></div><div class="fz-pic"><span>😴🌙</span><small>ねている あいだに<br>あたまが せいり</small></div><div class="fz-pic"><span>☀️🗣️</span><small>あさ<br>いって みる</small></div></div>'],
   ['m','worry','よふかしで ねむりが みじかいと、せっかく おぼえた ことが のこりにくく なるよ'],
   ['h','proud','よう ねる子は よう おぼえる！ おばちゃんも ひるねは かかさへんで'],
  ],
  quiz:[
   {q:'ねて いる あいだ、あたまは なにを している？',o:['おぼえた ことを せいりして いる','なにも していない'],a:0},
   {q:'ことばを おぼえるのに いいのは？',o:['ねる まえに ちょっと ふくしゅうして、よく ねる','よふかしして いっぱい やる'],a:0},
  ]},

 {id:'es-gesture', lv:'es', cat:'kagaku', t:'からだを うごかして おぼえる', key:['勉強法','動詞','ジェスチャー','単語'],
  steps:[
   ['m','smile','うごきの ことばは、からだを うごかしながら いうと おぼえやすいよ'],
   ['m','happy','jump で ジャンプ、swim で およぐ まね、clap で てを たたく！', '<div class="fz-row"><div class="fz-pic"><span>🦘</span><small><b>jump</b><br>とぶ</small></div><div class="fz-pic"><span>🏊</span><small><b>swim</b><br>およぐ</small></div><div class="fz-pic"><span>👏</span><small><b>clap</b><br>てを たたく</small></div><div class="fz-pic"><span>💃</span><small><b>dance</b><br>おどる</small></div></div>'],
   ['m','think','みみ（こえ）、め（え）、からだ（うごき）を いっしょに つかうと、おもいだす ための 「ひも」が ふえるんだ'],
   ['h','happy','おばちゃんも「dance」いうたら おどってまうわ〜。ほら いっしょに！'],
  ],
  quiz:[
   {q:'swim を おぼえる ときに いいのは？',o:['およぐ まねを しながら いう','だまって 見る'],a:0},
   {q:'clap は どれ？',o:['てを たたく','とぶ','ねる'],a:0},
   {q:'ならべかえて 文に しよう',order:['I','can','jump'],ja:'わたしは とべる'},
  ]},

 {id:'es-katakana-trap', lv:'es', cat:'kotsu', t:'カタカナ えいごの わな', key:['和製英語','カタカナ','単語'],
  steps:[
   ['m','smile','にほんで つかう カタカナの ことばには、えいごでは つうじない ものも あるよ'],
   ['m','think','たとえば こんな ものが あるよ', '<table class="fz-table"><tr><th>にほんご</th><th>えいご</th></tr><tr><td>ホッチキス</td><td><b>stapler</b></td></tr><tr><td>ノート（かく もの）</td><td><b>notebook</b></td></tr><tr><td>シャープペン</td><td><b>mechanical pencil</b></td></tr><tr><td>コンセント</td><td><b>outlet</b></td></tr><tr><td>ゆうめいじんの サイン</td><td><b>autograph</b></td></tr></table>'],
   ['h','wow','「ホッチキス」は ひとの なまえ から きたんやて！ えいごでは stapler や'],
   ['m','smile','カタカナに なっている ことばは、「えいごでも おなじ？」と しらべる くせを つけよう'],
  ],
  quiz:[
   {q:'ホッチキスは えいごで？',o:['stapler','hotchkiss'],a:0},
   {q:'ノート（かく もの）は？',o:['notebook','note'],a:0},
  ]},

 {id:'es-rhythm', lv:'es', cat:'oto', t:'えいごは タン・タタの リズム', key:['発音','アクセント','リズム'],
  steps:[
   ['m','smile','にほんごの 「バ・ナ・ナ」は ぜんぶ おなじ つよさ。でも えいごは つよい ところが 1つ あるよ'],
   ['m','think','おおきい もじを つよく ながく、ちいさい もじを かるく いって みよう', '<div class="fz-col"><div class="fz-beat"><span>ba</span><span class="S">NA</span><span>na</span><small>バ<b>ナァ</b>ナ</small></div><div class="fz-beat"><span>to</span><span class="S">MA</span><span>to</span><small>ト<b>メイ</b>ト</small></div><div class="fz-beat"><span class="S">AP</span><span>ple</span><small><b>ア</b>ップォ</small></div></div>'],
   ['m','happy','てを たたきながら いうと わかりやすいよ。つよい ところで パン！'],
   ['h','happy','バナナは ナで パン！ や。おどりの リズムと いっしょやね'],
  ],
  quiz:[
   {q:'banana の つよい ところは？',o:['ba','na（まんなか）','さいごの na'],a:1},
   {q:'apple の つよい ところは？',o:['ap（さいしょ）','ple（さいご）'],a:0},
  ]},

 {id:'es-question-up', lv:'es', cat:'oto', t:'しつもんの こえの あげさげ', key:['発音','イントネーション','疑問文'],
  steps:[
   ['m','smile','「はい・いいえ」で こたえる しつもんは、さいごを あげて いうよ'],
   ['m','think','Do you like cats? ↗　What do you like? ↘', '<svg viewBox="0 0 320 110" role="img" aria-label="Yes/Noの しつもんは さいごが あがり、What の しつもんは さいごが さがる"><text x="10" y="24" font-size="14" fill="#2a2340">Do you like cats?</text><path d="M20 44 H120 Q140 44 150 22" fill="none" stroke="#3f6ad8" stroke-width="3"/><path d="M144 22 L152 18 L152 28 Z" fill="#3f6ad8"/><text x="175" y="40" font-size="12" fill="#3f6ad8">あげる ↗</text><text x="10" y="76" font-size="14" fill="#2a2340">What do you like?</text><path d="M20 84 Q30 82 110 84 Q130 86 150 104" fill="none" stroke="#d8433f" stroke-width="3"/><path d="M144 104 L154 107 L150 97 Z" fill="#d8433f"/><text x="175" y="100" font-size="12" fill="#d8433f">さげる ↘</text></svg>'],
   ['m','happy','what・where・who などで はじまる しつもんは、ふつう さいごを さげるよ'],
   ['h','happy','こえの のぼりざか・くだりざか や！'],
  ],
  quiz:[
   {q:'Do you like dogs? の さいごは？',o:['あげる ↗','さげる ↘'],a:0},
   {q:'Where do you live? の さいごは？',o:['あげる ↗','さげる ↘'],a:1},
  ]},

/* ---------- 中学生 ---------- */
 {id:'jh-study-map', lv:'jh', cat:'kagaku', t:'英語が のびる 7つの コツ まとめ', key:['勉強法','復習','習慣','まとめ'],
  steps:[
   ['m','smile','世界中の 研究や 先生たちの 工夫から、効きめが 大きい コツを 7つに まとめたよ'],
   ['m','think','この 地図を ときどき 見返してね', '<ol class="fz-steps"><li><b>思い出す</b>：見返すより、かくして 思い出す</li><li><b>間を あける</b>：忘れかけた ころに 復習</li><li><b>まぜる</b>：ちがう 種類を まぜて 練習</li><li><b>かたまり</b>：単語より フレーズで 覚える</li><li><b>声と 耳</b>：音読・シャドーイングで 音と セットに</li><li><b>たくさん ふれる</b>：ちょうどいい 難しさを 大量に</li><li><b>使う</b>：話す・書く で 言えない ところに 気づく</li></ol>'],
   ['m','proud','どれも この ミニ授業に くわしい 回が あるよ。気に なる ものから 開いてね'],
   ['h','happy','ぜんぶ いっぺんに やらんでも ええ。1こずつ 足していったら ええねん！'],
  ],
  quiz:[
   {q:'記憶に のこりやすいのは？',o:['かくして 思い出す','ノートを ながめる'],a:0},
   {q:'復習の タイミングで いいのは？',o:['忘れかけた ころ','覚えた 直後に 10回'],a:0},
   {q:'単語の 覚え方で 使える 力に なるのは？',o:['フレーズの かたまりで','1語ずつ つづりだけ'],a:0},
  ]},

 {id:'jh-test-effect', lv:'jh', cat:'kagaku', t:'テストは 覚える ための 道具', key:['勉強法','復習','思い出す','テスト効果'],
  steps:[
   ['m','smile','テストは 「力を はかる もの」と 思うよね。でも じつは 「覚える ための 練習」に なるんだ'],
   ['m','think','教科書を 何回も 読みなおすより、自分で 小テストを した ほうが 1週間後に 多く のこる ことが 研究で 分かっているよ', '<svg viewBox="0 0 320 130" role="img" aria-label="1週間後の 記憶の イメージ。読みなおしは 少なく、思い出す練習は 多く のこる"><line x1="40" y1="105" x2="300" y2="105" stroke="#2a2340" stroke-width="2"/><rect x="70" y="70" width="70" height="35" rx="4" fill="#7a7f99"/><rect x="190" y="25" width="70" height="80" rx="4" fill="#2e9e4f"/><text x="105" y="122" font-size="11" text-anchor="middle" fill="#2a2340">読みなおし</text><text x="225" y="122" font-size="11" text-anchor="middle" fill="#2a2340">思い出す練習</text><text x="10" y="16" font-size="11" fill="#5b5577">1週間後に のこる 量（イメージ）</text></svg>'],
   ['m','think','読みなおすと 「わかった 気」に なる。でも 思い出す ときは 脳が 道を さがすから、その 道が 太く なるんだ'],
   ['m','proud','やり方は かんたん。ページを とじて、覚えた ことを 紙に 書き出す。そのあと 答え合わせ', '<ol class="fz-steps"><li>読む・聞く</li><li>とじて 書き出す（声に 出しても OK）</li><li>答え合わせ。ぬけた ところに 印</li><li>印の ところだけ 次の日に もう一度</li></ol>'],
   ['h','proud','まちごうても 損 ちゃう！ まちがえて 直した ところは、むしろ よう 覚えとるもんや'],
  ],
  quiz:[
   {q:'1週間後に 多く のこるのは？',o:['小テストで 思い出す','教科書を 3回 読む'],a:0},
   {q:'書き出した あとに するのは？',o:['答え合わせして ぬけに 印','そのまま 寝る'],a:0},
   {q:'ならべかえて 文に しよう',order:['Practice','makes','perfect'],ja:'練習が 完ぺきを つくる（習うより 慣れろ）'},
  ]},

 {id:'jh-interleave', lv:'jh', cat:'kagaku', t:'まぜて 練習すると 強く なる', key:['勉強法','文法','まぜる','インターリーブ'],
  steps:[
   ['m','smile','過去形だけ 20問、次に 進行形だけ 20問…。これ、じつは 「できた 気」に なりやすいんだ'],
   ['m','think','種類を まぜて 練習すると、毎回 「どれを 使う？」と 考えるから 本番に 強く なるよ', '<div class="fz-col"><div><small>かためて 練習</small><div class="fz-blocks"><span class="b s">過去</span><span class="b s">過去</span><span class="b s">過去</span><span class="b v">進行</span><span class="b v">進行</span><span class="b v">進行</span><span class="b o">完了</span><span class="b o">完了</span><span class="b o">完了</span></div></div><div><small>まぜて 練習 ← おすすめ</small><div class="fz-blocks"><span class="b s">過去</span><span class="b o">完了</span><span class="b v">進行</span><span class="b v">進行</span><span class="b s">過去</span><span class="b o">完了</span><span class="b s">過去</span><span class="b o">完了</span><span class="b v">進行</span></div></div></div>'],
   ['m','worry','まぜると 最初は 正答率が 下がるよ。でも それは 脳が がんばって いる しるし'],
   ['m','proud','新しい ことを 習った あとは、前に 習った ことと まぜて 復習しようね'],
  ],
  quiz:[
   {q:'本番に 強く なる 練習は？',o:['種類を まぜて 練習','1種類ずつ かためて'],a:0},
   {q:'まぜて 練習すると 最初は？',o:['正答率が 下がる ことが ある','かならず 全部 できる'],a:0},
  ]},

 {id:'jh-keyword', lv:'jh', cat:'kotsu', t:'キーワード法で 単語に 絵を つける', key:['単語','覚え方','語呂','イメージ'],
  steps:[
   ['m','smile','どうしても 覚えられない 単語には 「キーワード法」が 効くよ'],
   ['m','think','手順は 3つ。音が にた 日本語 → その 日本語と 意味を 1つの 場面に → 場面を 思いうかべて 言う', '<ol class="fz-steps"><li>音を 聞く：<b>lazy</b>（レイジー）</li><li>にた 日本語：「れいじ（0時）」</li><li>場面：お昼の 0時まで ずっと 寝てる なまけもの 😴</li></ol>'],
   ['m','happy','もう1つ。<b>cliff</b>（がけ）は 「クリ・フ…栗が 降ってくる がけ」 🌰⛰️', '<div class="fz-row"><div class="fz-pic"><span>😴🕛</span><small><b>lazy</b><br>なまけた</small></div><div class="fz-pic"><span>🌰⛰️</span><small><b>cliff</b><br>がけ</small></div></div>'],
   ['m','worry','でも 発音は かならず 本物を 聞いてね。キーワードは 意味を 思い出す ための 「ひっかけ」だよ'],
   ['h','proud','場面は へんてこな ほど ええ！ 笑える 絵は 忘れへんで'],
  ],
  quiz:[
   {q:'キーワード法の 1つめは？',o:['音が にた 日本語を さがす','つづりを 100回 書く'],a:0},
   {q:'場面は どんなのが 覚えやすい？',o:['へんてこで 目に うかぶ もの','ふつうで 地味な もの'],a:0},
   {q:'lazy の 意味は？',o:['なまけた','いそがしい','かしこい'],a:0},
  ]},

 {id:'jh-chunk', lv:'jh', cat:'kotsu', t:'単語より 「かたまり」で 覚える', key:['フレーズ','チャンク','会話','単語'],
  steps:[
   ['m','smile','ネイティブも 1語ずつ 組み立てて 話して いるわけじゃ ないんだ。よく使う 「かたまり」を そのまま 使っているよ'],
   ['m','think','かたまり + 1語 で 文が できあがる', '<div class="fz-col"><div class="fz-blocks"><span class="b s">Can I</span><span class="b o">have some water?</span></div><div class="fz-blocks"><span class="b s">How about</span><span class="b o">going to the beach?</span></div><div class="fz-blocks"><span class="b s">I\'m looking for</span><span class="b o">my key.</span></div><div class="fz-blocks"><span class="b s">Do you want to</span><span class="b o">play?</span></div></div>'],
   ['m','happy','青い ところを まるごと 覚えれば、緑の ところを かえるだけで いくらでも 言えるよ'],
   ['m','proud','気に入った かたまりは ノートに 集めて、声に 出して 口に なじませよう'],
  ],
  quiz:[
   {q:'「〜は どう？」の かたまりは？',o:['How about','What is','Can I'],a:0},
   {q:'ならべかえて 文に しよう',order:['I\'m looking for','my','bag'],ja:'わたしは かばんを さがしている'},
   {q:'ならべかえて 文に しよう',order:['Can I','have','some water'],ja:'お水を もらえますか'},
  ]},

 {id:'jh-dictation', lv:'jh', cat:'yarikata', t:'ディクテーションの やり方', key:['リスニング','勉強法','書き取り','ディクテーション'],
  steps:[
   ['m','smile','聞いた 英語を そのまま 書き取る 練習を ディクテーションと 言うよ'],
   ['m','think','「なんとなく 分かった」の 中に ある 聞きのがしが、書くと はっきり 見えるんだ'],
   ['m','think','やり方', '<ol class="fz-steps"><li>短い 英文（1〜2文）を 聞く</li><li>1文ずつ 止めて 書き取る（3回まで）</li><li>答え合わせして、ちがう ところに 赤</li><li>赤の ところが なぜ 聞こえなかったか 考える（つながり？ 弱い音？ 知らない語？）</li><li>最後に 音声と いっしょに 読む</li></ol>'],
   ['m','happy','よく 聞きのがすのは a・the・to・and などの 小さな 語。弱く 短く なるからだよ', '<div class="fz-sound"><span>a cup</span><span>of</span><span>tea</span><b>ア カッパ ティー</b></div>'],
   ['h','proud','書けへん ところが 宝の地図や！ そこが 伸びしろやで'],
  ],
  quiz:[
   {q:'聞きのがしやすいのは？',o:['a・the・to などの 小さな 語','長い 名詞'],a:0},
   {q:'答え合わせの あとに することは？',o:['なぜ 聞こえなかったか 考える','すぐ 次の 問題へ'],a:0},
  ]},

 {id:'jh-minimal-pair', lv:'jh', cat:'oto', t:'にた 音を 聞き分ける', key:['発音','リスニング','母音','ミニマルペア'],
  steps:[
   ['m','smile','1つの 音だけ ちがう 単語の ペアを 「ミニマルペア」と 言うよ。聞き分けの 練習に ぴったり'],
   ['m','think','日本語に ない ちがいが ポイント', '<div class="fz-col"><div class="fz-pair"><div><b>ship</b><small>短く ゆるい イ</small><i>船</i></div><div><b>sheep</b><small>口を 横に 引いて イー</small><i>ひつじ</i></div></div><div class="fz-pair"><div><b>hat</b><small>エと アの あいだ</small><i>ぼうし</i></div><div><b>hot</b><small>口を 大きく アー</small><i>あつい</i></div></div><div class="fz-pair"><div><b>light</b><small>舌先を 上に つける</small><i>光</i></div><div><b>right</b><small>舌は どこにも つけない</small><i>右</i></div></div></div>'],
   ['m','happy','聞き分けられる 音は 言い分けられる。言い分けられる 音は 聞き分けられる。両方 いっしょに 練習しよう'],
   ['h','happy','「シップ」と 「シープ」、まちごうたら 船に ひつじが 乗ってまうで！'],
  ],
  quiz:[
   {q:'「ひつじ」は どっち？',o:['ship','sheep'],a:1},
   {q:'light で 舌先は？',o:['上の 歯ぐきに つける','どこにも つけない'],a:0},
  ]},

 {id:'jh-word-family', lv:'jh', cat:'kotsu', t:'おしりで 分かる 品詞の 家族', key:['品詞','接尾辞','語彙','単語'],
  steps:[
   ['m','smile','単語の おしり（接尾辞）を 見ると、名詞か 形容詞か 分かる ことが 多いよ'],
   ['m','think','よく 出る おしり', '<table class="fz-table"><tr><th>おしり</th><th>品詞</th><th>例</th></tr><tr><td>-tion / -ment / -ness</td><td>名詞</td><td>action, movement, kindness</td></tr><tr><td>-ful / -ous / -ive</td><td>形容詞</td><td>useful, famous, active</td></tr><tr><td>-ly</td><td>副詞</td><td>quickly, slowly</td></tr><tr><td>-ize / -en</td><td>動詞</td><td>realize, widen</td></tr></table>'],
   ['m','happy','1つ 覚えたら 家族も まとめて！ act → action → active → actively', '<div class="fz-split"><span>act<small>動詞</small></span><span>action<small>名詞</small></span><span>active<small>形容詞</small></span><span>actively<small>副詞</small></span></div>'],
   ['m','proud','長文で 知らない 単語が 出ても、おしりで 文の 中の 役わりが 予想できるよ'],
  ],
  quiz:[
   {q:'kindness の 品詞は？',o:['名詞','形容詞','副詞'],a:0},
   {q:'famous の 品詞は？',o:['形容詞','動詞','名詞'],a:0},
   {q:'She runs ___.',o:['quick','quickly','quickness'],a:1},
  ]},

/* ---------- 高校生 ---------- */
 {id:'hs-leitner', lv:'hs', cat:'kagaku', t:'忘却曲線と 単語カードの 箱', key:['勉強法','復習','単語','間隔反復','忘却曲線'],
  steps:[
   ['m','smile','覚えた ことは 時間と ともに 急に 忘れて、そのあと ゆっくりに なる。この 形を 忘却曲線と 言うよ'],
   ['m','think','でも 復習の たびに カーブが ゆるやかに なるんだ', '<svg viewBox="0 0 320 140" role="img" aria-label="復習の たびに 忘れる カーブが ゆるやかに なる 図"><line x1="30" y1="15" x2="30" y2="115" stroke="#2a2340" stroke-width="2"/><line x1="30" y1="115" x2="310" y2="115" stroke="#2a2340" stroke-width="2"/><text x="6" y="22" font-size="10" fill="#5b5577">記憶</text><text x="270" y="132" font-size="10" fill="#5b5577">時間 →</text><path d="M30 20 Q45 85 85 95" fill="none" stroke="#d8433f" stroke-width="3"/><line x1="85" y1="95" x2="85" y2="20" stroke="#2e9e4f" stroke-width="2" stroke-dasharray="4 3"/><path d="M85 20 Q110 60 160 70" fill="none" stroke="#e67e22" stroke-width="3"/><line x1="160" y1="70" x2="160" y2="20" stroke="#2e9e4f" stroke-width="2" stroke-dasharray="4 3"/><path d="M160 20 Q200 38 300 45" fill="none" stroke="#3f6ad8" stroke-width="3"/><text x="85" y="14" font-size="10" text-anchor="middle" fill="#2e9e4f">復習</text><text x="160" y="14" font-size="10" text-anchor="middle" fill="#2e9e4f">復習</text></svg>'],
   ['m','think','これを 仕組みに したのが 「カードの 箱」。正解したら 右の 箱へ、まちがえたら 1番の 箱へ もどす', '<table class="fz-table"><tr><th>箱</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th></tr><tr><th>見る</th><td>毎日</td><td>2日<br>ごと</td><td>4日<br>ごと</td><td>1週<br>ごと</td><td>2週<br>ごと</td></tr></table><div class="fz-tip">⭕ 正解 → 1つ 右の 箱へ　❌ まちがい → 箱1へ</div>'],
   ['m','happy','苦手な カードほど よく 出て、覚えた カードは たまに しか 出ない。時間の むだが なくなるよ'],
   ['h','happy','アプリの 単語カードでも 紙でも おんなじや。箱は お菓子の 空き箱で ええで！'],
  ],
  quiz:[
   {q:'まちがえた カードは どこへ？',o:['箱1へ もどす','1つ 右の 箱へ','すてる'],a:0},
   {q:'復習を くり返すと 忘却曲線は？',o:['ゆるやかに なる','急に なる','変わらない'],a:0},
  ]},

 {id:'hs-slash-reading', lv:'hs', cat:'yarikata', t:'スラッシュリーディングで 前から 読む', key:['長文','読解','速読','スラッシュ'],
  steps:[
   ['m','smile','英文を 後ろから 訳すと、読むのも 聞くのも おそく なるよ。英語は 英語の 順番で 理解しよう'],
   ['m','think','意味の かたまりごとに / を 入れて、前から 順に 意味を とる', '<div class="fz-tip">I went to the library <b>/</b> to borrow a book <b>/</b> about the stars <b>/</b> last Sunday.</div><div class="fz-split"><span>図書館に 行った</span><span>本を 借りるために</span><span>星についての</span><span>この前の 日曜</span></div>'],
   ['m','think','/ を 入れる 目安', '<ul class="fz-steps"><li>前置詞（to, about, in…）の 前</li><li>接続詞（because, when, and…）の 前</li><li>長い 主語の 後ろ・関係詞（who, which…）の 前</li><li>不定詞 to の 前</li></ul>'],
   ['m','proud','なれたら / を 書かずに 頭の 中で 区切る。最後は 音声を 聞きながら 同じ 順で 分かる ように なろう'],
  ],
  quiz:[
   {q:'スラッシュを 入れる 目安と して よいのは？',o:['前置詞や 接続詞の 前','単語 1つごと'],a:0},
   {q:'スラッシュリーディングの ねらいは？',o:['英語の 順番の まま 理解する','後ろから きれいに 訳す'],a:0},
   {q:'ならべかえて 文に しよう',order:['I stayed home','because','it was raining'],ja:'雨が ふっていたので 家に いた'},
  ]},

 {id:'hs-skim-scan', lv:'hs', cat:'yarikata', t:'スキミングと スキャニング', key:['長文','読解','速読','試験'],
  steps:[
   ['m','smile','長文は 全部を 同じ 速さで 読まなくて いいんだ。目的で 読み方を 変えよう'],
   ['m','think','2つの 読み方', '<div class="fz-pair"><div><b>スキミング</b><small>ざっと 全体を つかむ</small><i>各段落の 最初の 1文・見出し・くり返し 出る 語</i></div><div><b>スキャニング</b><small>ほしい 情報だけ さがす</small><i>数字・名前・日付・設問の キーワード</i></div></div>'],
   ['m','think','試験なら こう 組み合わせる', '<ol class="fz-steps"><li>設問を 先に 読む（何を さがす？）</li><li>スキミングで 段落ごとの 話題を つかむ</li><li>スキャニングで 答えの ある 場所へ</li><li>そこだけ じっくり 精読</li></ol>'],
   ['m','proud','英語の 段落は 最初の 文に 言いたい ことを 書く ことが 多いよ。だから スキミングが 効くんだ'],
  ],
  quiz:[
   {q:'「イベントの 日付」を さがすのは？',o:['スキャニング','スキミング'],a:0},
   {q:'段落の 要点が 多く 書かれる 場所は？',o:['最初の 文','まん中の 語'],a:0},
  ]},

 {id:'hs-stress-timed', lv:'hs', cat:'oto', t:'英語は 強い音が 同じ 間隔で 来る', key:['発音','リズム','強勢','リスニング'],
  steps:[
   ['m','smile','日本語は 1音ずつ 同じ 長さ。英語は 「強い 音」が ほぼ 同じ 間隔で 来る 言葉だよ'],
   ['m','think','下の 3つは、強い 音（大きい 字）が 3つ だから、ほぼ 同じ 時間で 言えるんだ', '<div class="fz-col"><div class="fz-beat sm"><span class="S">CATS</span><span class="S">CHASE</span><span class="S">MICE</span></div><div class="fz-beat sm"><span>the</span><span class="S">CATS</span><span>will</span><span class="S">CHASE</span><span>the</span><span class="S">MICE</span></div><div class="fz-beat sm"><span>the</span><span class="S">CATS</span><span>are</span><span class="S">CHAS</span><span>-ing the</span><span class="S">MICE</span></div><small>てびょうしは どれも 3回 👏👏👏</small></div>'],
   ['m','think','だから 強い 音の あいだの the・will・are・-ing は、つぶれて 速く 弱く なる。これが 聞き取れない 理由の 1つ'],
   ['m','happy','手拍子 3回に 合わせて 3つの 文を 言って みよう。英語らしい リズムが 体に 入るよ'],
   ['h','happy','強いとこは 太鼓、弱いとこは 小走りや！'],
  ],
  quiz:[
   {q:'英語の リズムで ほぼ 同じ 間隔に なるのは？',o:['強い 音','すべての 音節'],a:0},
   {q:'弱く 速く なりやすいのは？',o:['the・will などの 機能語','cats などの 内容語'],a:0},
  ]},

 {id:'hs-core-prep', lv:'hs', cat:'zu', t:'前置詞は 1枚の 絵で 覚える', key:['前置詞','on','at','in','over','through','イメージ'],
  steps:[
   ['m','smile','前置詞は 訳語を 何個も 覚えるより、中心の 絵（コアイメージ）を 1つ もつと ぐっと 楽に なるよ'],
   ['m','think','5つの 絵', '<div class="fz-row"><div class="fz-pic"><svg viewBox="0 0 60 50"><line x1="5" y1="35" x2="55" y2="35" stroke="#2a2340" stroke-width="3"/><circle cx="30" cy="27" r="8" fill="#d8433f"/></svg><small><b>on</b><br>くっついて いる</small></div><div class="fz-pic"><svg viewBox="0 0 60 50"><line x1="5" y1="30" x2="55" y2="30" stroke="#c9c3e0" stroke-width="2"/><circle cx="30" cy="30" r="5" fill="#d8433f"/><circle cx="30" cy="30" r="11" fill="none" stroke="#d8433f" stroke-width="1.5"/></svg><small><b>at</b><br>1つの 点</small></div><div class="fz-pic"><svg viewBox="0 0 60 50"><rect x="12" y="10" width="36" height="32" fill="none" stroke="#2a2340" stroke-width="3"/><circle cx="30" cy="28" r="7" fill="#d8433f"/></svg><small><b>in</b><br>わくの 中</small></div><div class="fz-pic"><svg viewBox="0 0 60 50"><rect x="20" y="30" width="20" height="14" fill="#7a7f99"/><path d="M6 40 Q30 -2 54 40" fill="none" stroke="#d8433f" stroke-width="3"/></svg><small><b>over</b><br>上を おおう 弧</small></div><div class="fz-pic"><svg viewBox="0 0 60 50"><rect x="18" y="12" width="24" height="26" fill="#c9c3e0"/><line x1="4" y1="25" x2="52" y2="25" stroke="#d8433f" stroke-width="3"/><path d="M50 20 L58 25 L50 30 Z" fill="#d8433f"/></svg><small><b>through</b><br>中を 通りぬけ</small></div></div>'],
   ['m','think','on は 「上」じゃ なく 「くっつく」。だから かべの 絵も、天井に とまった ハエも on だよ', '<table class="fz-table"><tr><td>a picture <b>on</b> the wall</td><td>かべに くっつく</td></tr><tr><td>a fly <b>on</b> the ceiling</td><td>天井に くっつく</td></tr><tr><td>jump <b>over</b> the fence</td><td>上を こえる 弧</td></tr><tr><td>walk <b>through</b> the forest</td><td>森の 中を ぬける</td></tr></table>'],
   ['m','proud','知らない 使い方に 出会ったら、「どの 絵が 広がった？」と 考えると 意味が 見えてくるよ'],
  ],
  quiz:[
   {q:'天井に とまる ハエ：a fly ___ the ceiling',o:['on','in','at'],a:0},
   {q:'トンネルを 通りぬける：go ___ the tunnel',o:['over','through','on'],a:1},
   {q:'ならべかえて 文に しよう',order:['The cat','jumped','over','the wall'],ja:'ねこは 塀を とびこえた'},
  ]},

 {id:'hs-dictionary', lv:'hs', cat:'yarikata', t:'辞書は 意味より 例文と 語法を 見る', key:['辞書','語法','勉強法','単語'],
  steps:[
   ['m','smile','辞書で 1つめの 意味だけ 見て 閉じて いない？ じつは その 下に 宝が あるよ'],
   ['m','think','1つの 見出しに のっている もの', '<table class="fz-table"><tr><th>部分</th><th>例：suggest</th><th>何が 分かる？</th></tr><tr><td>発音・強勢</td><td>/səgdʒést/</td><td>どこを 強く 言う？</td></tr><tr><td>品詞</td><td>動詞</td><td>文の 中の 役わり</td></tr><tr><td>語法</td><td>suggest <b>doing</b> / suggest <b>that</b> 〜</td><td>後ろに 何が 来る？</td></tr><tr><td>例文</td><td>I suggest taking a break.</td><td>使い方の お手本</td></tr><tr><td>C / U</td><td>（名詞なら）</td><td>数えられる？</td></tr></table>'],
   ['m','worry','suggest は 「suggest me to 〜」とは 言わないよ。こういう ミスは 語法を 見れば ふせげるんだ'],
   ['m','proud','例文を 1つ 写して 声に 出す。これで 辞書を 引いた 時間が 何倍も 生きるよ'],
  ],
  quiz:[
   {q:'後ろに 何が 来るかは 辞書の どこで 分かる？',o:['語法','見出しの 色'],a:0},
   {q:'正しいのは どれ？',o:['I suggest taking a break.','I suggest you to take a break.'],a:0},
  ]},

/* ---------- ハイレベル ---------- */
 {id:'adv-input-level', lv:'adv', cat:'kagaku', t:'ちょうどいい 難しさを 大量に', key:['多読','リスニング','インプット','勉強法'],
  steps:[
   ['m','smile','ことばは 「分かる インプット」を たくさん 浴びて 伸びる、と 多くの 研究者が 考えて いるよ'],
   ['m','think','ポイントは 難しさ。知らない 語が 多すぎると 推測も できず、少なすぎると 学びが 少ない', '<svg viewBox="0 0 320 90" role="img" aria-label="知っている語の 割合で 見た 難しさの 帯。95〜98%が ちょうどいい"><rect x="10" y="30" width="120" height="26" fill="#d8433f" opacity=".75"/><rect x="130" y="30" width="110" height="26" fill="#2e9e4f"/><rect x="240" y="30" width="70" height="26" fill="#3f6ad8" opacity=".6"/><text x="70" y="22" font-size="11" text-anchor="middle" fill="#d8433f">むずかしすぎ</text><text x="185" y="22" font-size="11" text-anchor="middle" fill="#2e9e4f">ちょうどいい</text><text x="275" y="22" font-size="11" text-anchor="middle" fill="#3f6ad8">やさしい</text><text x="10" y="74" font-size="10" fill="#2a2340">知っている 語：〜90%</text><text x="140" y="74" font-size="10" fill="#2a2340">95〜98%</text><text x="248" y="74" font-size="10" fill="#2a2340">ほぼ 100%</text></svg>'],
   ['m','think','すらすら 楽しむ 多読なら 98% 以上。辞書を 使う 精読なら もう少し 難しくても OK。目的で えらぼう'],
   ['m','think','かんたんな チェック：1ページに 知らない 語が 5つ 以上 なら、多読には 難しすぎ', '<div class="fz-tip">1ページ（約250語）で 知らない 語 0〜4こ → 多読に ちょうどいい</div>'],
   ['m','proud','少し やさしめを 毎日 大量に。これが いちばん 確実に 伸びる 道だよ'],
  ],
  quiz:[
   {q:'すらすら 読む 多読に 向くのは？',o:['知らない 語が ほとんど ない 本','知らない 語が 1行に 3つの 本'],a:0},
   {q:'インプットで 大事なのは？',o:['分かる 量を たくさん','分からない ものを 少しだけ'],a:0},
  ]},

 {id:'adv-four-strands', lv:'adv', cat:'kagaku', t:'4つの 柱を バランスよく', key:['勉強法','バランス','スピーキング','流ちょうさ'],
  steps:[
   ['m','smile','言語教育の 研究で 有名な 考え方に、学習を 4つの 柱に 分けて 同じ くらいずつ やる、と いうのが あるよ'],
   ['m','think','4つの 柱', '<svg viewBox="0 0 320 130" role="img" aria-label="学習の 4つの 柱を 円の 4分の1ずつで 表した 図"><path d="M70 65 L70 15 A50 50 0 0 1 120 65 Z" fill="#3f6ad8"/><path d="M70 65 L120 65 A50 50 0 0 1 70 115 Z" fill="#2e9e4f"/><path d="M70 65 L70 115 A50 50 0 0 1 20 65 Z" fill="#e67e22"/><path d="M70 65 L20 65 A50 50 0 0 1 70 15 Z" fill="#8e44ad"/><circle cx="140" cy="22" r="6" fill="#3f6ad8"/><text x="152" y="26" font-size="11" fill="#2a2340">分かる インプット（読む・聞く）</text><circle cx="140" cy="50" r="6" fill="#2e9e4f"/><text x="152" y="54" font-size="11" fill="#2a2340">意味の ある アウトプット</text><circle cx="140" cy="78" r="6" fill="#e67e22"/><text x="152" y="82" font-size="11" fill="#2a2340">ことばの 勉強（文法・単語）</text><circle cx="140" cy="106" r="6" fill="#8e44ad"/><text x="152" y="110" font-size="11" fill="#2a2340">流ちょうさの 練習</text></svg>'],
   ['m','think','日本の 勉強は オレンジ（文法・単語）に かたよりがち。紫の 「知っている ことを 速く 使う 練習」が 足りない 人が 多いよ'],
   ['m','proud','1週間の 予定を この 4色で ぬって みて。かたよりが 見えたら、足りない 色を 足そう'],
  ],
  quiz:[
   {q:'4つの 柱の 理想の 割合は？',o:['だいたい 同じ くらいずつ','文法が 9割'],a:0},
   {q:'「流ちょうさの 練習」に 近いのは？',o:['知っている ことを 速く 使う','新しい 文法を 覚える'],a:0},
  ]},

 {id:'adv-432', lv:'adv', cat:'yarikata', t:'4/3/2 で 話す 速さを 上げる', key:['スピーキング','流ちょうさ','勉強法','練習'],
  steps:[
   ['m','smile','同じ 話を 時間を 縮めながら 3回 話す 練習だよ。1人でも できる'],
   ['m','think','4分 → 3分 → 2分。中身は 同じまま、時間だけ 短く', '<svg viewBox="0 0 320 100" role="img" aria-label="同じ話を 4分、3分、2分と 短くして 3回 話す"><rect x="20" y="10" width="280" height="22" rx="6" fill="#3f6ad8"/><rect x="20" y="40" width="210" height="22" rx="6" fill="#e67e22"/><rect x="20" y="70" width="140" height="22" rx="6" fill="#d8433f"/><text x="30" y="26" font-size="12" fill="#fff">1回目 4分</text><text x="30" y="56" font-size="12" fill="#fff">2回目 3分</text><text x="30" y="86" font-size="12" fill="#fff">3回目 2分</text><text x="236" y="56" font-size="10" fill="#2a2340">同じ 話</text><text x="166" y="86" font-size="10" fill="#2a2340">同じ 話・速く</text></svg>'],
   ['m','think','くり返す うちに 言い方が 決まって、つかえずに 言える ように なる。3回目は 自然と 速く なめらかに なるよ'],
   ['m','think','1人で やる なら', '<ol class="fz-steps"><li>話題を 決める（週末の こと・好きな 映画）</li><li>スマホで タイマーと 録音</li><li>4分 → 3分 → 2分</li><li>録音を 聞いて 言えなかった 語を メモ</li></ol>'],
   ['h','proud','3回目の 自分は 1回目より ずっと しゃべれとるで。録音は 宝物や！'],
  ],
  quiz:[
   {q:'4/3/2 で 変えるのは？',o:['時間だけ','話の 中身'],a:0},
   {q:'この 練習で 主に 伸びるのは？',o:['流ちょうさ','つづり'],a:0},
  ]},

 {id:'adv-notice-gap', lv:'adv', cat:'yarikata', t:'言えなかったを 宝に する サイクル', key:['スピーキング','ライティング','アウトプット','勉強法'],
  steps:[
   ['m','smile','話したり 書いたり すると、「あれ、これ 英語で 何て 言う？」と 気づく。この 気づきが 伸びる チャンスなんだ'],
   ['m','think','4つの サイクルを 回そう', '<svg viewBox="0 0 320 150" role="img" aria-label="話す・書く、気づく、調べる、また使う の 4つを 回す サイクル"><circle cx="160" cy="75" r="50" fill="none" stroke="#c9c3e0" stroke-width="10"/><path d="M200 45 L212 52 L198 58 Z" fill="#7a7f99"/><path d="M190 113 L178 120 L180 106 Z" fill="#7a7f99"/><path d="M120 105 L108 98 L122 92 Z" fill="#7a7f99"/><path d="M130 37 L142 30 L140 44 Z" fill="#7a7f99"/><rect x="115" y="5" width="90" height="24" rx="12" fill="#3f6ad8"/><text x="160" y="22" font-size="12" text-anchor="middle" fill="#fff">① 話す・書く</text><rect x="225" y="63" width="80" height="24" rx="12" fill="#d8433f"/><text x="265" y="80" font-size="12" text-anchor="middle" fill="#fff">② 気づく</text><rect x="115" y="121" width="90" height="24" rx="12" fill="#2e9e4f"/><text x="160" y="138" font-size="12" text-anchor="middle" fill="#fff">③ 調べる</text><rect x="15" y="63" width="80" height="24" rx="12" fill="#8e44ad"/><text x="55" y="80" font-size="12" text-anchor="middle" fill="#fff">④ また使う</text></svg>'],
   ['m','think','「言えなかった ノート」を 作って、日本語 → 調べた 英語 → 自分の 例文 の 3つを 書くよ', '<table class="fz-table"><tr><th>言いたかった</th><th>英語</th><th>自分の 例文</th></tr><tr><td>徹夜した</td><td>stay up all night</td><td>I stayed up all night for the test.</td></tr><tr><td>〜に 向いている</td><td>be good for 〜</td><td>This park is good for walking.</td></tr></table>'],
   ['m','proud','いちばん 大事なのは ④。次の 日の 会話や 日記で わざと 使うと、自分の ことばに なるよ'],
  ],
  quiz:[
   {q:'サイクルの 最後は？',o:['また 使う','ノートを 閉じる'],a:0},
   {q:'ならべかえて 文に しよう',order:['I','stayed up','all night'],ja:'わたしは 徹夜した'},
  ]},

 {id:'adv-if-then', lv:'adv', cat:'kagaku', t:'続ける しくみは 「もし〜したら」', key:['習慣','勉強法','継続','モチベーション'],
  steps:[
   ['m','smile','やる気に たよると 続かない。続く 人は 「いつ・どこで・何を」を 先に 決めて いるよ'],
   ['m','think','いつもの 行動に くっつける 「もし〜したら、〜する」 プラン', '<div class="fz-col"><div class="fz-tip">もし 歯みがきを したら → 単語を 5つ 思い出す</div><div class="fz-tip">もし 電車に 乗ったら → ラジオを 1本 聞く</div><div class="fz-tip">もし お風呂に 入ったら → 今日 あった ことを 英語で 3文</div></div>'],
   ['m','think','続ける ための 小ワザ', '<ul class="fz-steps"><li>最初は 笑える くらい 小さく（2分で OK）</li><li>カレンダーに 印を つけて 連続を 見える 化</li><li>できない 日は 「1つだけ」でも やったら 合格</li><li>2日 続けて 休まない</li></ul>'],
   ['h','happy','ハマ子流は 「もし おせんべい 食べたら、英単語 1こ」や！ よう 続くで〜'],
  ],
  quiz:[
   {q:'続けやすい プランは？',o:['歯みがきの あとに 単語5つ','やる気が 出たら 3時間'],a:0},
   {q:'できない 日の 考え方として よいのは？',o:['1つ だけでも やれば 合格','0か 100か'],a:0},
  ]},

 {id:'adv-elaboration', lv:'adv', cat:'kagaku', t:'「なぜ？」で 深く 覚える', key:['勉強法','語源','語彙','理解'],
  steps:[
   ['m','smile','覚える ときに 「なぜ そう なる？」と 自分に 聞くと、すでに 知っている ことと つながって 忘れにくく なるよ'],
   ['m','think','たとえば breakfast は なぜ 朝食？', '<div class="fz-split"><span>break<small>やぶる</small></span><span>fast<small>断食</small></span></div><div class="fz-tip">夜の 間の 「何も 食べない」を やぶる 食事 → 朝食</div>'],
   ['m','think','文法でも 同じ。「なぜ 現在完了に yesterday は 使えない？」→ 今と つながる 形に 過去の 1点は 合わないから', '<ol class="fz-steps"><li>覚えた ことに 「なぜ？」と 聞く</li><li>自分の ことばで 説明して みる（人に 教える つもりで）</li><li>説明できない ところ ＝ まだ 分かって いない ところ</li></ol>'],
   ['m','proud','人に 教える つもりで 説明する 練習は、ミナが いちばん おすすめする 方法の 1つだよ'],
  ],
  quiz:[
   {q:'breakfast の break の 意味は？',o:['やぶる','休けい','こわれる 前'],a:0},
   {q:'説明できない ところは？',o:['まだ 分かって いない ところ','覚えなくて いい ところ'],a:0},
  ]},

 {id:'adv-guess-first', lv:'adv', cat:'kagaku', t:'答えを 見る 前に まず 予想', key:['勉強法','まちがい','思い出す','単語'],
  steps:[
   ['m','smile','知らない 問題でも、答えを 見る 前に 「たぶん これ」と 予想して みよう'],
   ['m','think','予想 → 答え合わせ の 順だと、答えだけ 見るより 記憶に のこりやすい ことが 分かって いるよ', '<div class="fz-pair"><div><b>すぐ 答えを 見る</b><small>へえ、そうなんだ</small><i>すぐ 流れて いく</i></div><div><b>予想 → 答え</b><small>えっ、ちがった！</small><i>おどろきと いっしょに のこる</i></div></div>'],
   ['m','think','とくに 「自信が あったのに まちがえた」 ものは、直した あと よく 覚えて いる ことが 多いんだ'],
   ['h','proud','せやから まちがいは はずかしい ことちゃう。まちがえた 数だけ 強なるんや！'],
   ['m','proud','この アプリの 問題も、まず 自分の 答えを 決めてから えらんでね'],
  ],
  quiz:[
   {q:'答えを 見る 前に するのは？',o:['予想する','何も しない'],a:0},
   {q:'まちがいに ついて 正しいのは？',o:['直せば よく 覚える きっかけに なる','記憶を こわす だけ'],a:0},
  ]},
);

/* ---------- 学び方 その2（音・ことばの 地図・使いわけ・続け方） ---------- */
LESSONS.push(
/* 小学生 */
 {id:'es-magic-e', lv:'es', cat:'oto', t:'まほうの e', key:['フォニックス','発音','つづり','e'],
  steps:[
   ['m','smile','ことばの おしりに ある e は、じぶんは だまって いるのに、まえの 音を かえる まほうつかいだよ'],
   ['m','think','e が つくと、まえの もじが 「なまえ」の 音に かわる', '<div class="fz-col"><div class="fz-pair"><div><b>cap</b><small>キャップ</small><i>ぼうし</i></div><div><b>cape</b><small>ケイプ</small><i>マント</i></div></div><div class="fz-pair"><div><b>kit</b><small>キット</small><i>どうぐ セット</i></div><div><b>kite</b><small>カイト</small><i>たこ</i></div></div><div class="fz-pair"><div><b>hop</b><small>ホップ</small><i>はねる</i></div><div><b>hope</b><small>ホウプ</small><i>のぞむ</i></div></div></div>'],
   ['h','happy','e は しゃべらへん けど、となりの となりを 「エイ・アイ・オウ」に へんしん させるんや！'],
   ['m','smile','name、like、home、cute… みんな まほうの e の なかまだよ'],
  ],
  quiz:[
   {q:'kite（たこ）の i の 音は？',o:['アイ','イ'],a:0},
   {q:'さいごの e は どう よむ？',o:['よまない（だまっている）','エと よむ'],a:0},
  ]},

 {id:'es-sh-ch-th', lv:'es', cat:'oto', t:'2もじで 1つの 音', key:['フォニックス','発音','sh','ch','th'],
  steps:[
   ['m','smile','2つの もじが くっついて、べつの 1つの 音に なる ことが あるよ'],
   ['m','think','よく 出る 4つの ペア', '<table class="fz-table"><tr><th>もじ</th><th>音</th><th>れい</th></tr><tr><td><b>sh</b></td><td>シュ（しずかに！の 音）</td><td>ship, fish</td></tr><tr><td><b>ch</b></td><td>チ</td><td>chair, lunch</td></tr><tr><td><b>th</b></td><td>したを はで かるく はさむ</td><td>three, this</td></tr><tr><td><b>ph</b></td><td>フ（f と おなじ）</td><td>phone, photo</td></tr></table>'],
   ['h','happy','sh は ひとさしゆびを くちに あてて 「シーッ」の 音や！'],
   ['m','smile','2もじで 1つの 音と わかると、はじめての ことばも よめるように なるよ'],
  ],
  quiz:[
   {q:'fish の sh の 音は？',o:['シュ','ス・フ'],a:0},
   {q:'phone の ph の 音は？',o:['フ','プ・ハ'],a:0},
  ]},

 {id:'es-f-v', lv:'es', cat:'oto', t:'f と v は くちびるを かるく かむ', key:['発音','f','v','くちびる'],
  steps:[
   ['m','smile','にほんごの 「フ」は くちびるを まるく するね。えいごの f は ちがうよ'],
   ['m','think','うえの まえばを したの くちびるに かるく のせて、いきを だす', '<div class="fz-row"><div class="fz-pic"><span>😬</span><small>まえばを したの くちびるに のせる</small></div><div class="fz-pic"><span>💨</span><small><b>f</b>：いきだけ<br>fan・five</small></div><div class="fz-pic"><span>🐝</span><small><b>v</b>：こえも だす<br>van・very</small></div></div>'],
   ['m','happy','v は のどが ブルブル ふるえるよ。のどに てを あてて たしかめて みよう'],
   ['h','happy','v は はちの 「ヴーン」や！ ビーと ちゃうで'],
  ],
  quiz:[
   {q:'f を いう ときの くちは？',o:['まえばを したの くちびるに のせる','くちびるを まるく する'],a:0},
   {q:'のどが ふるえるのは どっち？',o:['v','f'],a:0},
  ]},

 {id:'es-word-web', lv:'es', cat:'kotsu', t:'ことばの くもの す', key:['単語','覚え方','マインドマップ','なかま'],
  steps:[
   ['m','smile','ことばは なかまで あつめると、1つ おもいだすと ほかも つられて でて くるよ'],
   ['m','think','まんなかに テーマを かいて、なかまの ことばを まわりに', '<svg viewBox="0 0 320 170" role="img" aria-label="まんなかに beach、まわりに sea sand shell wave crab star の くものす"><g stroke="#c9c3e0" stroke-width="3"><line x1="160" y1="85" x2="60" y2="30"/><line x1="160" y1="85" x2="260" y2="30"/><line x1="160" y1="85" x2="40" y2="100"/><line x1="160" y1="85" x2="280" y2="100"/><line x1="160" y1="85" x2="95" y2="150"/><line x1="160" y1="85" x2="225" y2="150"/></g><circle cx="160" cy="85" r="30" fill="#e67e22"/><text x="160" y="90" font-size="14" font-weight="700" text-anchor="middle" fill="#fff">beach</text><g font-size="12" font-weight="700" text-anchor="middle" fill="#fff"><rect x="28" y="18" width="64" height="24" rx="12" fill="#3f6ad8"/><text x="60" y="35">🌊 sea</text><rect x="224" y="18" width="72" height="24" rx="12" fill="#d8b04a"/><text x="260" y="35">🏖️ sand</text><rect x="2" y="88" width="76" height="24" rx="12" fill="#8e44ad"/><text x="40" y="105">🐚 shell</text><rect x="240" y="88" width="78" height="24" rx="12" fill="#00897b"/><text x="279" y="105">🌊 wave</text><rect x="57" y="138" width="76" height="24" rx="12" fill="#d8433f"/><text x="95" y="155">🦀 crab</text><rect x="189" y="138" width="72" height="24" rx="12" fill="#2a2340"/><text x="225" y="155">⭐ star</text></g></svg>'],
   ['m','happy','いえ・がっこう・どうぶつえん… テーマを かえて じぶんの くもの すを つくって みよう'],
   ['h','proud','ハマ子の くもの すは まんなかが 「おやつ」や！ candy, cookie, cake…'],
  ],
  quiz:[
   {q:'beach の なかまで ないのは？',o:['shell','crab','desk'],a:2},
   {q:'くもの すの まんなかに かくのは？',o:['テーマ','いちばん ながい ことば'],a:0},
  ]},

 {id:'es-opposites', lv:'es', cat:'kotsu', t:'はんたいことばは ペアで', key:['単語','反対語','形容詞','覚え方'],
  steps:[
   ['m','smile','はんたいの いみの ことばは、2つ いっしょに おぼえると おとく だよ'],
   ['m','think','ペアで いって みよう', '<div class="fz-col"><div class="fz-pair"><div><b>big</b><small>🐘 おおきい</small></div><div><b>small</b><small>🐭 ちいさい</small></div></div><div class="fz-pair"><div><b>hot</b><small>🔥 あつい</small></div><div><b>cold</b><small>🧊 つめたい</small></div></div><div class="fz-pair"><div><b>fast</b><small>🐆 はやい</small></div><div><b>slow</b><small>🐢 おそい</small></div></div><div class="fz-pair"><div><b>happy</b><small>😊 うれしい</small></div><div><b>sad</b><small>😢 かなしい</small></div></div></div>'],
   ['m','happy','おおきい こえで big、ちいさい こえで small。こえの おおきさも かえると たのしいよ'],
   ['h','happy','hot で あおいで、cold で ブルブル！ からだも つこて おぼえよ'],
  ],
  quiz:[
   {q:'hot の はんたいは？',o:['cold','big','sad'],a:0},
   {q:'slow の はんたいは？',o:['fast','small','happy'],a:0},
  ]},

 {id:'es-compound', lv:'es', cat:'kotsu', t:'くっつき ことば', key:['単語','複合語','覚え方'],
  steps:[
   ['m','smile','2つの ことばが くっついて、あたらしい ことばに なる ことが あるよ'],
   ['m','think','たしざんみたいに よめるね', '<table class="fz-table"><tr><td>sun ☀️</td><td>＋</td><td>flower 🌼</td><td>＝</td><td><b>sunflower</b> ひまわり</td></tr><tr><td>rain 🌧️</td><td>＋</td><td>bow 🎀</td><td>＝</td><td><b>rainbow</b> にじ</td></tr><tr><td>star ⭐</td><td>＋</td><td>fish 🐟</td><td>＝</td><td><b>starfish</b> ひとで</td></tr><tr><td>bed 🛏️</td><td>＋</td><td>room 🚪</td><td>＝</td><td><b>bedroom</b> しんしつ</td></tr></table>'],
   ['m','happy','しらない ながい ことばも、わけて みたら しってる ことばの くっつきかも しれないよ'],
   ['h','wow','ひとでは 「ほしの さかな」なんや！ はまべに いっぱい おるで'],
  ],
  quiz:[
   {q:'rainbow は なにと なにの くっつき？',o:['rain と bow','ran と bow'],a:0},
   {q:'starfish は？',o:['ひとで','ながれぼし'],a:0},
  ]},

 {id:'es-sing', lv:'es', cat:'yarikata', t:'うたで おぼえる', key:['歌','勉強法','リズム','発音'],
  steps:[
   ['m','smile','メロディに のせると、ことばは ふしぎなくらい あたまに のこるよ'],
   ['m','think','うたの つかいかた', '<ol class="fz-steps"><li>まずは きくだけ。なんかいも</li><li>しってる ことばを さがす（いくつ あった？）</li><li>いっしょに くちずさむ</li><li>うたの なかの ことばの いみを しらべる</li></ol>'],
   ['m','happy','からだの うた（あたま・かた・ひざ・つまさき）なら、さわりながら うたうと もっと おぼえるよ', '<div class="fz-row"><div class="fz-pic"><span>🙆</span><small><b>head</b></small></div><div class="fz-pic"><span>🤷</span><small><b>shoulders</b></small></div><div class="fz-pic"><span>🦵</span><small><b>knees</b></small></div><div class="fz-pic"><span>🦶</span><small><b>toes</b></small></div></div>'],
   ['h','proud','おばちゃんの 十八番は ABCの うたや！ おふろで まいにち うたっとるで'],
  ],
  quiz:[
   {q:'うたで さいしょに することは？',o:['なんかいも きく','いみを ぜんぶ しらべる'],a:0},
   {q:'knees は どこ？',o:['ひざ','かた','つまさき'],a:0},
  ]},

/* 中学生 */
 {id:'jh-schwa', lv:'jh', cat:'oto', t:'いちばん 多い 音 「あいまいな ア」', key:['発音','母音','弱形','アクセント'],
  steps:[
   ['m','smile','英語で いちばん よく 出る 母音は、口の 力を ぬいた 弱い 「ァ」なんだ'],
   ['m','think','強く 読まない ところの 母音は、つづりが a でも o でも この 音に なりやすいよ', '<div class="fz-col"><div class="fz-beat"><span>ə</span><span class="S">BOUT</span><small><b>a</b>bout：アバウトより 「ァバウト」</small></div><div class="fz-beat"><span>bə</span><span class="S">NA</span><span>nə</span><small>b<b>a</b>nan<b>a</b>：両はしの a が 弱い ァ</small></div><div class="fz-beat"><span>tə</span><span class="S">DAY</span><small><b>to</b>day：トゥデイより 「タデイ」</small></div></div>'],
   ['m','think','口を ぽかんと 少し あけて、のどの おくで 短く 「ァ」。力を 入れないのが コツ'],
   ['m','proud','強い ところは はっきり、弱い ところは この 音で 軽く。これだけで ぐっと 英語らしく なるよ'],
  ],
  quiz:[
   {q:'英語で いちばん よく 出る 母音は？',o:['力を ぬいた 弱い ァ','はっきりした イー'],a:0},
   {q:'about の 最初の a は？',o:['弱い ァ','強い エイ'],a:0},
  ]},

 {id:'jh-no-extra-vowel', lv:'jh', cat:'oto', t:'子音の 後ろに 母音を つけない', key:['発音','カタカナ','子音','音節'],
  steps:[
   ['m','smile','日本語は 「ク」「ト」の ように 子音の 後ろに いつも 母音が つくね。英語は 子音だけで 終わったり 続いたり するよ'],
   ['m','think','カタカナで 言うと 音の 数が ふえて しまう', '<table class="fz-table"><tr><th>単語</th><th>カタカナ</th><th>英語の 音の かたまり</th></tr><tr><td>dog</td><td>ド・ッ・グ（3）</td><td><b>dog</b>（1）</td></tr><tr><td>milk</td><td>ミ・ル・ク（3）</td><td><b>milk</b>（1）</td></tr><tr><td>strike</td><td>ス・ト・ラ・イ・ク（5）</td><td><b>strike</b>（1）</td></tr></table>'],
   ['m','think','練習：最後の 子音は 息だけ。「ドッグ」の 「グ」を 「g」の 口の 形だけに して 止める'],
   ['h','proud','ストライク言うたら 5つ 手拍子 いるけど、英語は パン！ 1回や'],
  ],
  quiz:[
   {q:'milk は 英語で いくつの 音の かたまり？',o:['1つ','3つ'],a:0},
   {q:'dog の 最後の g は？',o:['母音を つけず 口の 形だけ','はっきり グと 言う'],a:0},
  ]},

 {id:'jh-memory-palace', lv:'jh', cat:'kagaku', t:'記憶の 宮殿（場所に 置いて 覚える）', key:['覚え方','単語','記憶術','イメージ'],
  steps:[
   ['m','smile','古代ギリシャの ころから 使われて いる 覚え方だよ。よく 知っている 場所に 覚えたい ものを 「置いて」いくんだ'],
   ['m','think','自分の 家を 歩く ルートに 単語を 置く', '<svg viewBox="0 0 320 130" role="img" aria-label="家の 玄関、ろうか、台所、部屋の 順に 単語を 置く"><rect x="10" y="30" width="300" height="90" rx="8" fill="#fff" stroke="#2a2340" stroke-width="2"/><path d="M10 30 L160 4 L310 30" fill="none" stroke="#2a2340" stroke-width="2"/><g stroke="#c9c3e0" stroke-width="2"><line x1="85" y1="30" x2="85" y2="120"/><line x1="160" y1="30" x2="160" y2="120"/><line x1="235" y1="30" x2="235" y2="120"/></g><path d="M30 105 H280" stroke="#e67e22" stroke-width="2" stroke-dasharray="5 4"/><path d="M278 100 L290 105 L278 110 Z" fill="#e67e22"/><g font-size="11" text-anchor="middle" fill="#5b5577"><text x="47" y="46">① 玄関</text><text x="122" y="46">② ろうか</text><text x="197" y="46">③ 台所</text><text x="272" y="46">④ 部屋</text></g><g font-size="12" font-weight="700" text-anchor="middle" fill="#d8433f"><text x="47" y="80">🦒 giraffe</text><text x="122" y="80">⚓ anchor</text><text x="197" y="80">🌋 volcano</text><text x="272" y="80">👑 crown</text></g></svg>'],
   ['m','think','玄関を 開けたら キリンが 首を つっこんで いる、ろうかに 大きな いかり… 大げさな 場面に するのが コツ'],
   ['m','proud','思い出す ときは 頭の 中で 玄関から 歩くだけ。順番ごと 覚えられるから、スピーチの 流れにも 使えるよ'],
   ['h','happy','おばちゃんは 台所に 置いたら 食べてまうから、冷蔵庫は 使わへんねん！'],
  ],
  quiz:[
   {q:'記憶の 宮殿で 使うのは？',o:['よく 知っている 場所','知らない 町の 地図'],a:0},
   {q:'置く 場面は どう する？',o:['大げさで へんてこに','ふつうに 小さく'],a:0},
  ]},

 {id:'jh-look-see-watch', lv:'jh', cat:'zu', t:'look・see・watch の 目の 使い方', key:['look','see','watch','使い分け','動詞'],
  steps:[
   ['m','smile','どれも 「見る」だけど、目の 使い方が ちがうよ'],
   ['m','think','3つの 絵', '<div class="fz-row"><div class="fz-pic"><span>👀✨</span><small><b>see</b><br>自然に 目に 入る</small></div><div class="fz-pic"><span>👉👀</span><small><b>look (at)</b><br>自分から 目を 向ける</small></div><div class="fz-pic"><span>👀🎬</span><small><b>watch</b><br>動く ものを じっと 見つづける</small></div></div>'],
   ['m','think','だから こう なる', '<table class="fz-table"><tr><td>I <b>saw</b> a shooting star.</td><td>流れ星が 目に 入った</td></tr><tr><td><b>Look at</b> this shell!</td><td>この 貝を 見て！</td></tr><tr><td>I <b>watch</b> TV every night.</td><td>テレビを 見つづける</td></tr></table>'],
   ['m','proud','listen（聞こうと する）と hear（聞こえる）も 同じ 関係だよ。look ↔ listen、see ↔ hear'],
  ],
  quiz:[
   {q:'サッカーの 試合を 見る：___ a soccer game',o:['watch','see','look'],a:0},
   {q:'ほら、見て！：___ at the sky!',o:['Look','Watch','See'],a:0},
   {q:'ならべかえて 文に しよう',order:['I','saw','a shooting star'],ja:'流れ星が 見えた'},
  ]},

 {id:'jh-come-go', lv:'jh', cat:'zu', t:'come と go は 「相手の ところ」が 中心', key:['come','go','bring','take','使い分け'],
  steps:[
   ['m','smile','お母さんに 「ごはんよー」と 呼ばれて 「今 行く！」は 英語で I\'m going? じつは I\'m coming! なんだ'],
   ['m','think','come は 話の 中心（相手の いる 場所）に 近づく。go は そこから はなれる', '<svg viewBox="0 0 320 110" role="img" aria-label="相手に 近づくのが come、はなれるのが go"><circle cx="160" cy="55" r="26" fill="#ffe7a8" stroke="#e67e22" stroke-width="2"/><text x="160" y="60" font-size="12" text-anchor="middle" fill="#2a2340">相手</text><text x="30" y="60" font-size="22">🧍</text><line x1="62" y1="45" x2="128" y2="45" stroke="#2e9e4f" stroke-width="3"/><path d="M126 39 L136 45 L126 51 Z" fill="#2e9e4f"/><text x="95" y="36" font-size="12" text-anchor="middle" fill="#2e9e4f">come</text><line x1="190" y1="55" x2="290" y2="55" stroke="#d8433f" stroke-width="3"/><path d="M288 49 L298 55 L288 61 Z" fill="#d8433f"/><text x="240" y="46" font-size="12" text-anchor="middle" fill="#d8433f">go</text></svg>'],
   ['m','think','bring（持って くる）と take（持って いく）も 同じ 考え方', '<table class="fz-table"><tr><td>Can you <b>come</b> to my party?</td><td>わたしの パーティーに 来られる？</td></tr><tr><td>I\'ll <b>bring</b> some cake.</td><td>（あなたの ところへ）ケーキ 持って いくね</td></tr><tr><td><b>Take</b> an umbrella.</td><td>かさを 持って いきなさい</td></tr></table>'],
   ['h','wow','日本語の 「行く」が come に なるんか！ 相手の 目線に 立つんやね'],
  ],
  quiz:[
   {q:'呼ばれて 「今 行く！」',o:["I'm coming!","I'm going!"],a:0},
   {q:'（相手の 家へ）ジュースを 持って いくよ：I\'ll ___ some juice.',o:['bring','take'],a:0},
  ]},

 {id:'jh-mirror-order', lv:'jh', cat:'zu', t:'日本語と 英語は 鏡の 順番', key:['語順','英作文','場所','時'],
  steps:[
   ['m','smile','日本語の 文を 英語に する とき、多くの 場合 順番が 鏡うつしに なるよ'],
   ['m','think','番号を 見比べて みて', '<div class="fz-col"><small>日本語</small><div class="fz-blocks"><span class="b s">私は<small>①</small></span><span class="b t">昨日<small>⑤</small></span><span class="b p">公園で<small>④</small></span><span class="b o">サッカーを<small>③</small></span><span class="b v">した<small>②</small></span></div><small>英語</small><div class="fz-blocks"><span class="b s">I<small>①</small></span><span class="b v">played<small>②</small></span><span class="b o">soccer<small>③</small></span><span class="b p">in the park<small>④</small></span><span class="b t">yesterday<small>⑤</small></span></div></div>'],
   ['m','think','英語は 「だれが → する → 何を → どこで → いつ」。場所は 時より 先 が 基本だよ'],
   ['m','proud','英作文で 迷ったら、主語の すぐ 後ろに 動詞を 置いて、あとは 近い ものから 順に つなげよう'],
  ],
  quiz:[
   {q:'英語の 基本の 順番で、場所と 時は？',o:['場所 → 時','時 → 場所'],a:0},
   {q:'ならべかえて 文に しよう',order:['I','played','soccer','in the park','yesterday'],ja:'私は 昨日 公園で サッカーを した'},
  ]},

 {id:'jh-read-look-up', lv:'jh', cat:'yarikata', t:'リード・アンド・ルックアップ', key:['音読','スピーキング','暗唱','勉強法'],
  steps:[
   ['m','smile','音読を 「話す 力」に かえる 練習だよ。やり方は とても かんたん'],
   ['m','think','3つの 動き', '<div class="fz-row"><div class="fz-pic"><span>📖👀</span><small>① 1文を だまって 読む</small></div><div class="fz-pic"><span>🙂⬆️</span><small>② 顔を 上げる（文を 見ない）</small></div><div class="fz-pic"><span>🗣️</span><small>③ 相手に 話す ように 言う</small></div></div>'],
   ['m','think','文を 見ないで 言うには、意味ごと 頭に 入れる 必要が ある。これが 話す ときと 同じ 頭の 使い方なんだ'],
   ['m','proud','長い 文は スラッシュで 区切って、かたまりごとに 顔を 上げても OK だよ'],
   ['h','happy','鏡に 向かって やったら、自分が 先生みたいで 気分 ええで〜'],
  ],
  quiz:[
   {q:'言う ときに することは？',o:['顔を 上げて 文を 見ない','文を 見ながら 読む'],a:0},
   {q:'この 練習の ねらいは？',o:['音読を 話す 力に かえる','読む 速さを 上げる だけ'],a:0},
  ]},

 {id:'jh-diary-3', lv:'jh', cat:'yarikata', t:'3行 英語日記', key:['ライティング','日記','習慣','勉強法'],
  steps:[
   ['m','smile','毎日 3行だけ、英語で 日記を 書いて みよう。続けると 「書ける こと」が どんどん ふえるよ'],
   ['m','think','型を 決めれば まよわない', '<div class="fz-col"><div class="fz-tip">① Today I ___.（今日 した こと）</div><div class="fz-tip">② It was ___.（どうだった？）</div><div class="fz-tip">③ Tomorrow I will ___.（明日 する こと）</div></div>'],
   ['m','happy','たとえば：Today I went to the beach. It was windy. Tomorrow I will study math.'],
   ['m','think','書けない 語は かんたんな 言葉に 言いかえて、あとで 調べる。調べた 語は 次の 日記で また 使おう'],
  ],
  quiz:[
   {q:'②の 文で 書くのは？',o:['どうだったか','明日の 予定'],a:0},
   {q:'ならべかえて 文に しよう',order:['Tomorrow','I will','study','math'],ja:'明日は 数学を 勉強する'},
  ]},

/* 高校生 */
 {id:'hs-four-a', lv:'hs', cat:'oto', t:'英語の 「ア」は 4種類', key:['発音','母音','発音記号','口の形'],
  steps:[
   ['m','smile','日本語の 「ア」は 1つ。でも 英語には 「ア」に 聞こえる 音が 少なくとも 4つ あるよ'],
   ['m','think','口の 開き方で 分ける', '<table class="fz-table"><tr><th>記号</th><th>口の 形</th><th>例</th></tr><tr><td><b>æ</b></td><td>口を 横に 引いて 「エ」の 口で 「ア」</td><td>cat, apple</td></tr><tr><td><b>ʌ</b></td><td>あまり 開けず 短く 強く 「ア」</td><td>cup, love</td></tr><tr><td><b>ɑ</b></td><td>口を たてに 大きく 「アー」</td><td>hot, father</td></tr><tr><td><b>ə</b></td><td>力を ぬいて 弱く 「ァ」</td><td>about, banana</td></tr></table>'],
   ['m','think','口の 開き方を 図に すると', '<svg viewBox="0 0 320 120" role="img" aria-label="口の 開き方の 比較。ə が 小さく、æ が 横長、ʌ が 中くらい、ɑ が たてに 大きい"><g fill="#d8433f" opacity=".85"><ellipse cx="45" cy="55" rx="16" ry="8"/><ellipse cx="120" cy="55" rx="30" ry="13"/><ellipse cx="200" cy="55" rx="18" ry="15"/><ellipse cx="275" cy="55" rx="22" ry="28"/></g><g font-size="14" font-weight="700" text-anchor="middle" fill="#2a2340"><text x="45" y="105">ə</text><text x="120" y="105">æ</text><text x="200" y="105">ʌ</text><text x="275" y="105">ɑ</text></g><g font-size="9" text-anchor="middle" fill="#5b5577"><text x="45" y="117">ゆるく小さく</text><text x="120" y="117">横に 広く</text><text x="200" y="117">中くらい・短く</text><text x="275" y="117">たてに 大きく</text></g></svg>'],
   ['m','proud','cap（ぼうし）と cup（カップ）、hat と hot は この ちがいで 聞き分けて いるよ'],
  ],
  quiz:[
   {q:'cup の 母音は？',o:['ʌ（短く 強く）','æ（横に 引く）'],a:0},
   {q:'口を たてに いちばん 大きく 開けるのは？',o:['ɑ（hot）','ə（about）'],a:0},
  ]},

 {id:'hs-flap-t', lv:'hs', cat:'oto', t:'t の 変身（ウォーター が ワラ に）', key:['発音','リスニング','アメリカ英語','t'],
  steps:[
   ['m','smile','アメリカ英語では、t が 母音に はさまれると 日本語の 「ラ行」に 近い 軽い 音に なるよ'],
   ['m','think','舌先で 上の 歯ぐきを 1回 はじくだけ', '<table class="fz-table"><tr><th>単語</th><th>聞こえ方</th></tr><tr><td>water</td><td>ワーラー</td></tr><tr><td>better</td><td>ベラー</td></tr><tr><td>get up</td><td>ゲラップ</td></tr><tr><td>a lot of</td><td>アララヴ</td></tr></table>'],
   ['m','think','n の 後ろの t は 消える ことも あるよ。twenty → トゥエニー、internet → イナネッ'],
   ['m','proud','自分で 言う ときは はっきり t でも 通じる。でも 聞き取りでは この 変身を 知って いると ぐんと 楽に なるよ'],
   ['h','happy','「ワラ ください」で 水が 出てくるんやから、おもろいなあ！'],
  ],
  quiz:[
   {q:'get up は どう 聞こえる？',o:['ゲラップ','ゲット・アップ'],a:0},
   {q:'t が ラ行に 近く なるのは？',o:['母音に はさまれた とき','文の 最初'],a:0},
  ]},

 {id:'hs-say-tell', lv:'hs', cat:'zu', t:'say・tell・speak・talk の 地図', key:['say','tell','speak','talk','使い分け','動詞'],
  steps:[
   ['m','smile','どれも 「言う・話す」。でも 何に 目を 向けて いるかが ちがうよ'],
   ['m','think','2つの 軸で 分けると すっきり', '<svg viewBox="0 0 320 160" role="img" aria-label="say tell speak talk を 2つの 軸で 分けた 図"><line x1="160" y1="10" x2="160" y2="150" stroke="#c9c3e0" stroke-width="2"/><line x1="10" y1="80" x2="310" y2="80" stroke="#c9c3e0" stroke-width="2"/><g font-size="10" fill="#5b5577" text-anchor="middle"><text x="85" y="20">ことば・内容に 注目</text><text x="235" y="20">話す 行為に 注目</text><text x="20" y="76" text-anchor="start">一方的</text><text x="20" y="96" text-anchor="start">相手と</text></g><g font-weight="700" font-size="17" text-anchor="middle"><text x="85" y="58" fill="#3f6ad8">say</text><text x="85" y="128" fill="#2e9e4f">tell</text><text x="235" y="58" fill="#e67e22">speak</text><text x="235" y="128" fill="#d8433f">talk</text></g><g font-size="9" text-anchor="middle" fill="#2a2340"><text x="85" y="72">say "Hello."</text><text x="85" y="142">tell me the story</text><text x="235" y="72">speak English</text><text x="235" y="142">talk with friends</text></g></svg>'],
   ['m','think','tell は 「相手に 伝える」から、すぐ 後ろに 人が 来る。say は 人を 置かず、say to 人 に なるよ', '<table class="fz-table"><tr><td>He <b>told</b> me the news.</td><td>⭕</td></tr><tr><td>He <b>said</b> me the news.</td><td>❌</td></tr><tr><td>He <b>said</b> to me, "Hi."</td><td>⭕</td></tr></table>'],
   ['m','proud','speak は 言語や 声を 出す こと、talk は 会話の やりとり。speak English / talk about music だね'],
  ],
  quiz:[
   {q:'She ___ me a funny story.',o:['told','said','spoke'],a:0},
   {q:'Can you ___ Chinese?',o:['speak','tell','say'],a:0},
   {q:'Let\'s ___ about the trip.',o:['talk','tell','say'],a:0},
  ]},

 {id:'hs-adj-order', lv:'hs', cat:'zu', t:'形容詞が ならぶ 順番', key:['形容詞','語順','名詞'],
  steps:[
   ['m','smile','形容詞を いくつも 並べる とき、ネイティブが 自然に 感じる 順番が あるよ'],
   ['m','think','おおよその 順番（名詞に 近いほど その ものの 「性質そのもの」）', '<div class="fz-blocks"><span class="b c">意見<small>nice</small></span><span class="b s">大きさ<small>big</small></span><span class="b t">古さ<small>old</small></span><span class="b m">形<small>round</small></span><span class="b v">色<small>red</small></span><span class="b p">出身<small>Italian</small></span><span class="b o">材料<small>wooden</small></span><span class="b s">名詞<small>box</small></span></div>'],
   ['m','think','例：a lovely little old red boat（すてきな 小さい 古い 赤い ボート）'],
   ['m','proud','気持ち（意見）は いちばん 外、変わらない 性質ほど 名詞の 近く。そう 覚えると 楽だよ'],
   ['h','happy','「い・お・ふ・か・い・し・ざい」！ 意見・大きさ・古さ…ハマ子の 呪文や'],
  ],
  quiz:[
   {q:'自然なのは どれ？',o:['a big red ball','a red big ball'],a:0},
   {q:'名詞に いちばん 近く 置くのは？',o:['材料（wooden など）','意見（nice など）'],a:0},
   {q:'ならべかえて 文に しよう',order:['a','beautiful','old','house'],ja:'美しい 古い 家'},
  ]},

 {id:'hs-sentence-mining', lv:'hs', cat:'yarikata', t:'好きな 作品から 文を 集める', key:['単語','例文','勉強法','フレーズ'],
  steps:[
   ['m','smile','好きな 歌・映画・本から 「いいな」と 思った 文を 集めて、自分だけの 単語帳に する 方法だよ'],
   ['m','think','えらぶ 文の コツは 「知らない ところが 1つだけ」', '<ol class="fz-steps"><li>文を 写す（場面も メモ）</li><li>知らない 語・表現に 印</li><li>カード：表に 文（印の 所を 空らんに）、裏に 答え</li><li>声に 出して 復習</li></ol>'],
   ['m','think','カードの 例', '<div class="fz-pair"><div><b>表</b><i>I can\'t ___ to see you again!</i><small>（また 会えるのが 待ちきれない）</small></div><div><b>裏</b><i>wait</i><small>can\'t wait to 〜：〜が 楽しみで たまらない</small></div></div>'],
   ['m','proud','好きな 場面と いっしょに 覚えた 文は、気持ちごと 思い出せる。だから 忘れにくいんだ'],
  ],
  quiz:[
   {q:'集める 文で いいのは？',o:['知らない ところが 1つだけの 文','知らない 語だらけの 文'],a:0},
   {q:'can\'t wait to 〜 の 意味は？',o:['〜が 楽しみで たまらない','〜を 待てない ほど 退屈'],a:0},
  ]},

 {id:'hs-pomodoro', lv:'hs', cat:'kagaku', t:'25分 集中 + 5分 休けい', key:['集中','勉強法','時間','習慣'],
  steps:[
   ['m','smile','長い 時間 だらだら やるより、短く 区切って 集中した ほうが 結果は 出やすいよ'],
   ['m','think','25分 やって 5分 休む。4回 やったら 長めに 休む', '<svg viewBox="0 0 320 60" role="img" aria-label="25分の 集中と 5分の 休けいを くり返し、4回目の あとに 長い 休けい"><g fill="#d8433f"><rect x="5" y="15" width="55" height="26" rx="5"/><rect x="77" y="15" width="55" height="26" rx="5"/><rect x="149" y="15" width="55" height="26" rx="5"/><rect x="221" y="15" width="55" height="26" rx="5"/></g><g fill="#2e9e4f"><rect x="62" y="15" width="13" height="26" rx="3"/><rect x="134" y="15" width="13" height="26" rx="3"/><rect x="206" y="15" width="13" height="26" rx="3"/><rect x="278" y="15" width="37" height="26" rx="5"/></g><g font-size="10" fill="#fff" text-anchor="middle"><text x="32" y="32">25分</text><text x="104" y="32">25分</text><text x="176" y="32">25分</text><text x="248" y="32">25分</text><text x="296" y="32">長休</text></g><text x="5" y="56" font-size="9" fill="#5b5577">赤＝集中　緑＝休けい（5分）</text></svg>'],
   ['m','think','集中中は スマホを 別の 部屋へ。やる ことは 始める 前に 1つだけ 決める（例：長文 1つ）'],
   ['m','proud','休けいでは 画面を 見ないで、体を 動かしたり 水を 飲んだり しよう。頭が すっきり するよ'],
  ],
  quiz:[
   {q:'休けい中に おすすめなのは？',o:['体を 動かす・水を 飲む','動画を 見つづける'],a:0},
   {q:'始める 前に 決めるのは？',o:['やる ことを 1つ','休む 回数を 0回に'],a:0},
  ]},

/* ハイレベル */
 {id:'adv-tense-grid', lv:'adv', cat:'zu', t:'12の 時制を 1枚の 表で', key:['時制','進行形','完了形','文法'],
  steps:[
   ['m','smile','英語の 時制は 「いつ（過去・現在・未来）」×「どう 見るか（4つ）」の かけ算で 12通りに なるよ'],
   ['m','think','横に 見ると 「いつ」、たてに 見ると 「見え方」', '<table class="fz-table"><tr><th></th><th>過去</th><th>現在</th><th>未来</th></tr><tr><th>ふつう<small>点・習慣</small></th><td>played</td><td>play(s)</td><td>will play</td></tr><tr><th>進行<small>最中</small></th><td>was playing</td><td>am playing</td><td>will be playing</td></tr><tr><th>完了<small>それまでに</small></th><td>had played</td><td>have played</td><td>will have played</td></tr><tr><th>完了進行<small>ずっと 続けて</small></th><td>had been playing</td><td>have been playing</td><td>will have been playing</td></tr></table>'],
   ['m','think','形の 作り方は 決まって いる。進行なら be + ing、完了なら have + 過去分詞。それを 組み合わせる だけ'],
   ['m','proud','知らない 時制に 出会ったら、表の どこに 入るか 考えよう。意味が 自然に 決まるよ'],
  ],
  quiz:[
   {q:'had been playing は？',o:['過去・完了進行','未来・進行','現在・完了'],a:0},
   {q:'By next year, I ___ here for ten years.',o:['will have lived','will live','have lived'],a:0},
  ]},

 {id:'adv-word-iceberg', lv:'adv', cat:'kagaku', t:'単語を 「知っている」の 氷山', key:['語彙','単語','コロケーション','語法'],
  steps:[
   ['m','smile','単語を 「知っている」って、意味が 分かる だけじゃ ないんだ。水の 下に もっと 大きな 部分が あるよ'],
   ['m','think','単語の 氷山', '<svg viewBox="0 0 320 170" role="img" aria-label="単語の 知識の 氷山。水の 上は 意味、水の 下に 発音 つづり 品詞 セットの語 使う場面 語法"><rect x="0" y="50" width="320" height="120" fill="#3f6ad8" opacity=".18"/><line x1="0" y1="50" x2="320" y2="50" stroke="#3f6ad8" stroke-width="2"/><path d="M135 50 L160 12 L185 50 Z" fill="#fff" stroke="#2a2340" stroke-width="2"/><path d="M110 50 L210 50 L285 164 L35 164 Z" fill="#fff" stroke="#2a2340" stroke-width="2" opacity=".92"/><text x="160" y="44" font-size="11" font-weight="700" text-anchor="middle" fill="#d8433f">意味</text><text x="300" y="44" font-size="9" text-anchor="end" fill="#3f6ad8">水面</text><g font-size="11" text-anchor="middle" fill="#2a2340"><text x="160" y="72">発音・つづり</text><text x="125" y="96">品詞・語形</text><text x="200" y="96">セットの 語</text><text x="115" y="122">語法（後ろの 形）</text><text x="215" y="122">使う 場面</text><text x="160" y="152">ていねいさ・ニュアンス</text></g></svg>'],
   ['m','think','たとえば make a decision（× do a decision）、heavy rain（× strong rain）。こういう 「セット」は 意味だけ 覚えても 出てこない'],
   ['m','proud','新しい 単語は 「発音・セットの 語・例文」まで 見て、1つ 深く 知る。使える 単語は こうして ふえていくよ'],
  ],
  quiz:[
   {q:'「大雨」の 自然な 言い方は？',o:['heavy rain','strong rain'],a:0},
   {q:'make a decision の 説明として 正しいのは？',o:['決まった 語の セット','文法の 例外'],a:0},
  ]},

 {id:'adv-subtitles', lv:'adv', cat:'yarikata', t:'字幕は 3段階で 外す', key:['リスニング','映画','字幕','勉強法'],
  steps:[
   ['m','smile','映画や ドラマは 最高の 教材。でも ただ 見るだけだと 日本語字幕を 読んで 終わりに なりがち'],
   ['m','think','同じ 場面（5分くらい）を 3回 見る', '<ol class="fz-steps"><li><b>日本語字幕</b>：話の 中身を つかむ</li><li><b>英語字幕</b>：音と 文字を 結びつける。知らない 表現を メモ</li><li><b>字幕なし</b>：耳だけで 分かるか たしかめる</li><li>おまけ：気に入った セリフを まねして 言う</li></ol>'],
   ['m','think','作品は もう 内容を 知っている もの、会話が 日常的な もの（家族・学校もの）が 向いているよ'],
   ['m','proud','長く 見るより 短い 場面を くり返す。1本 全部 より 5分を 3回の ほうが 力に なるんだ'],
  ],
  quiz:[
   {q:'2回目に 使うのは？',o:['英語字幕','字幕なし'],a:0},
   {q:'練習に 向くのは？',o:['短い 場面を くり返す','新作を 毎日 1本 流し見'],a:0},
  ]},

 {id:'adv-retelling', lv:'adv', cat:'yarikata', t:'リテリングで 自分の 英語に する', key:['スピーキング','読解','要約','勉強法'],
  steps:[
   ['m','smile','読んだり 聞いたり した 話を、何も 見ずに 自分の 英語で 話し直す 練習だよ'],
   ['m','think','やり方', '<ol class="fz-steps"><li>短い 文章を 読む（100〜200語）</li><li>キーワードを 3〜5つ だけ メモ</li><li>文章を 閉じて、メモを 見ながら 1分で 話す</li><li>もう一度 読んで、言えなかった 表現を たしかめる</li><li>もう一度 話す</li></ol>'],
   ['m','think','文章の 言葉を そのまま 使っても、言いかえても OK。大事なのは 中身を 自分で 組み立てる こと'],
   ['m','proud','読解力（中身を つかむ）と 話す 力（組み立てる）を 同時に きたえられる、おとくな 練習だよ'],
  ],
  quiz:[
   {q:'メモする キーワードの 数は？',o:['3〜5つ','全部の 文'],a:0},
   {q:'リテリングで 大事なのは？',o:['中身を 自分で 組み立てる','文章を 一字一句 暗記'],a:0},
  ]},

 {id:'adv-can-do', lv:'adv', cat:'kagaku', t:'目標は 「できること」で 決める', key:['目標','モチベーション','勉強法','英検'],
  steps:[
   ['m','smile','「英語が うまく なりたい」は ゴールが 見えない。「何が できる ように なりたいか」で 決めると 道が 見えるよ'],
   ['m','think','ぼんやり → はっきり', '<div class="fz-col"><div class="fz-pair"><div><b>ぼんやり</b><i>英語を ペラペラに</i></div><div><b>はっきり</b><i>旅行で 道を 聞いて 答えを 聞き取れる</i></div></div><div class="fz-pair"><div><b>ぼんやり</b><i>単語を 増やす</i></div><div><b>はっきり</b><i>3か月で 英検の 単語帳 1冊を 2周</i></div></div></div>'],
   ['m','think','大きな 目標は 小さな 「できた」に 分ける', '<svg viewBox="0 0 320 100" role="img" aria-label="大きな目標までの 階段。小さな できたを 積み上げる"><g fill="#3f6ad8"><rect x="20" y="75" width="60" height="18" rx="3"/><rect x="85" y="57" width="60" height="36" rx="3" opacity=".85"/><rect x="150" y="39" width="60" height="54" rx="3" opacity=".7"/><rect x="215" y="21" width="60" height="72" rx="3" opacity=".55"/></g><text x="290" y="20" font-size="20">🏁</text><g font-size="10" fill="#fff" text-anchor="middle"><text x="50" y="88">自己紹介</text><text x="115" y="80">買い物</text><text x="180" y="70">道案内</text><text x="245" y="60">旅行で 会話</text></g></svg>'],
   ['m','proud','1つ 登ったら 自分を ほめよう。「できた」の 記録が 次の やる気を 作るんだ'],
  ],
  quiz:[
   {q:'はっきりした 目標は どれ？',o:['レストランで 英語で 注文できる','英語が うまく なる'],a:0},
   {q:'大きな 目標は どう する？',o:['小さな 「できた」に 分ける','そのまま 一気に めざす'],a:0},
  ]},

 {id:'adv-plateau', lv:'adv', cat:'kagaku', t:'のびは 坂道 じゃなく 階段', key:['モチベーション','継続','勉強法','スランプ'],
  steps:[
   ['m','smile','がんばって いるのに のびない…と 感じる 時期は、だれにでも あるよ'],
   ['m','think','語学の のびは 坂道より 階段に 近い。平らな ところでも 中では 力が たまって いるんだ', '<svg viewBox="0 0 320 130" role="img" aria-label="思っている のびは まっすぐな 坂、本当の のびは 平らな 時期の ある 階段"><line x1="20" y1="115" x2="310" y2="115" stroke="#2a2340" stroke-width="2"/><line x1="20" y1="115" x2="20" y2="10" stroke="#2a2340" stroke-width="2"/><line x1="20" y1="110" x2="300" y2="20" stroke="#7a7f99" stroke-width="2" stroke-dasharray="5 4"/><path d="M20 110 H90 Q100 110 105 85 H170 Q180 85 185 55 H245 Q255 55 260 25 H300" fill="none" stroke="#d8433f" stroke-width="3"/><line x1="32" y1="18" x2="52" y2="18" stroke="#d8433f" stroke-width="3"/><text x="56" y="22" font-size="10" fill="#d8433f">本当の のび</text><line x1="32" y1="34" x2="52" y2="34" stroke="#7a7f99" stroke-width="2" stroke-dasharray="5 4"/><text x="56" y="38" font-size="10" fill="#7a7f99">思っている のび</text><text x="137" y="100" font-size="9" text-anchor="middle" fill="#5b5577">力が たまる 時期</text></svg>'],
   ['m','think','平らな 時期に できる こと', '<ul class="fz-steps"><li>やり方を 少し 変える（読む → 聞く など）</li><li>前の 教材を 解いて 「楽に なった」を 確かめる</li><li>録音や 日記を 見返して、昔の 自分と 比べる</li></ul>'],
   ['h','proud','階段の おどり場は 休けい所や。足を 止めんかったら、次の 段は かならず 来るで！'],
  ],
  quiz:[
   {q:'のびない 時期の 考え方は？',o:['力が たまっている 時期','才能が ない しるし'],a:0},
   {q:'その 時期に いいのは？',o:['前の 教材で 成長を 確かめる','すぐ やめる'],a:0},
  ]},
);

/* ---------- 学び方 その3（音の きまり・使いわけの 図・数と 時こく・続ける 道具） ---------- */
LESSONS.push(
/* 小学生 */
 {id:'es-clock', lv:'es', cat:'kotsu', t:'とけいの いいかた', key:['時刻','数字','half','quarter'],
  steps:[
   ['m','smile','じこくは すうじを ならべるだけで いえるよ。3:15 は three fifteen'],
   ['m','think','とけいを 4つに わけた 「quarter（4ぶんの1）」と 「half（はんぶん）」も つかうよ', '<svg viewBox="0 0 320 130" role="img" aria-label="とけいの 図。15分が quarter past、30分が half past、45分が quarter to"><circle cx="70" cy="65" r="55" fill="#fff" stroke="#2a2340" stroke-width="3"/><path d="M70 65 L70 10 A55 55 0 0 1 125 65 Z" fill="#3f6ad8" opacity=".25"/><path d="M70 65 L70 120 A55 55 0 0 1 15 65 Z" fill="#d8433f" opacity=".2"/><line x1="70" y1="65" x2="70" y2="22" stroke="#2a2340" stroke-width="3"/><circle cx="70" cy="65" r="4" fill="#2a2340"/><g font-size="11" text-anchor="middle" fill="#2a2340"><text x="70" y="24">12</text><text x="114" y="69">3</text><text x="70" y="114">6</text><text x="26" y="69">9</text></g><g font-size="12"><text x="140" y="30" fill="#3f6ad8">:15 a quarter past</text><text x="140" y="68" fill="#2a2340">:30 half past</text><text x="140" y="106" fill="#d8433f">:45 a quarter to</text></g></svg>'],
   ['m','think','past は 「〜を すぎて」、to は 「〜まで あと」。3:45 は 4じまで あと 15ふん だから a quarter to four'],
   ['h','happy','おやつは 3じ！ three o\'clock や。o\'clock は ちょうどの ときだけ やで'],
  ],
  quiz:[
   {q:'3:30 は？',o:['half past three','half to three'],a:0},
   {q:'4:45 は？',o:['a quarter to five','a quarter past four'],a:0},
   {q:'ちょうど 7じ は？',o:["seven o'clock",'seven half'],a:0},
  ]},

 {id:'es-animal-sounds', lv:'es', cat:'kotsu', t:'えいごの どうぶつの なきごえ', key:['単語','擬音語','どうぶつ'],
  steps:[
   ['m','smile','どうぶつの なきごえは、くにが かわると きこえかたも かわるんだよ'],
   ['m','think','えいごでは こう いうよ', '<table class="fz-table"><tr><th>どうぶつ</th><th>にほんご</th><th>えいご</th></tr><tr><td>🐶 dog</td><td>ワンワン</td><td><b>woof</b> / bow-wow</td></tr><tr><td>🐱 cat</td><td>ニャー</td><td><b>meow</b></td></tr><tr><td>🐮 cow</td><td>モー</td><td><b>moo</b></td></tr><tr><td>🐷 pig</td><td>ブーブー</td><td><b>oink</b></td></tr><tr><td>🐔 rooster</td><td>コケコッコー</td><td><b>cock-a-doodle-doo</b></td></tr><tr><td>🐸 frog</td><td>ケロケロ</td><td><b>ribbit</b></td></tr></table>'],
   ['h','wow','ぶたが 「オインク」やて！ おばちゃん びっくりや'],
   ['m','happy','The dog says woof. の ように 「〜は ○○と なく」と いって みよう'],
  ],
  quiz:[
   {q:'えいごで ねこは？',o:['meow','moo','oink'],a:0},
   {q:'えいごで ぶたは？',o:['oink','woof','ribbit'],a:0},
   {q:'ならべかえて 文に しよう',order:['The cow','says','moo'],ja:'うしは モーと なく'},
  ]},

 {id:'es-sound-words', lv:'es', cat:'kotsu', t:'おとの ことば（ザブーン・ブーン）', key:['単語','擬音語','動詞'],
  steps:[
   ['m','smile','えいごにも おとを あらわす ことばが あるよ。しかも そのまま うごきの ことばに なる ものが おおいんだ'],
   ['m','think','おとと いみを いっしょに', '<div class="fz-row"><div class="fz-pic"><span>🌊</span><small><b>splash</b><br>バシャッ</small></div><div class="fz-pic"><span>🐝</span><small><b>buzz</b><br>ブーン</small></div><div class="fz-pic"><span>💥</span><small><b>boom</b><br>ドーン</small></div><div class="fz-pic"><span>🚪</span><small><b>knock knock</b><br>トントン</small></div><div class="fz-pic"><span>🤧</span><small><b>achoo</b><br>ハクション</small></div><div class="fz-pic"><span>🍪</span><small><b>crunch</b><br>ザクッ</small></div></div>'],
   ['m','happy','The kids splash in the sea.（こどもたちが うみで バシャバシャ する）。おとが そのまま うごきに なったね'],
   ['h','happy','ハクションは achoo！ いわれたら Bless you! って かえすんやで'],
  ],
  quiz:[
   {q:'はちの ブーンは？',o:['buzz','boom','splash'],a:0},
   {q:'くしゃみの あとに いう ことばは？',o:['Bless you!','Thank you!'],a:0},
  ]},

/* 中学生 */
 {id:'jh-ed-sound', lv:'jh', cat:'oto', t:'-ed の 読み方は 3つ', key:['発音','過去形','ed','規則動詞'],
  steps:[
   ['m','smile','過去形の -ed は いつも 「エド」じゃ ないよ。前の 音で 3つに 分かれるんだ'],
   ['m','think','分け方', '<table class="fz-table"><tr><th>前の 音</th><th>-ed の 音</th><th>例</th></tr><tr><td>t・d</td><td><b>イド</b></td><td>wanted, needed</td></tr><tr><td>のどが ふるえない 音（k・p・s・sh・ch・f）</td><td><b>ト</b></td><td>walked, stopped, washed</td></tr><tr><td>のどが ふるえる 音（母音・g・b・l・n など）</td><td><b>ド</b></td><td>played, opened, called</td></tr></table>'],
   ['m','think','のどに 手を あてて 前の 音を 出して みて。ふるえなければ ト、ふるえれば ド'],
   ['h','proud','walked は 「ウォークト」、「ウォーキッド」ちゃうで！ イドは t と d の あとだけや'],
  ],
  quiz:[
   {q:'wanted の -ed は？',o:['イド','ト','ド'],a:0},
   {q:'walked の -ed は？',o:['ト','イド','ド'],a:0},
   {q:'played の -ed は？',o:['ド','ト','イド'],a:0},
  ]},

 {id:'jh-s-sound', lv:'jh', cat:'oto', t:'s の 読み方も 3つ', key:['発音','複数形','三単現','s'],
  steps:[
   ['m','smile','複数形や 三単現の s も、-ed と 同じ 考え方で 3つの 音に 分かれるよ'],
   ['m','think','分け方', '<table class="fz-table"><tr><th>前の 音</th><th>s の 音</th><th>例</th></tr><tr><td>s・z・sh・ch・ge</td><td><b>イズ</b>（es）</td><td>buses, watches, oranges</td></tr><tr><td>のどが ふるえない 音</td><td><b>ス</b></td><td>cats, books, cups</td></tr><tr><td>のどが ふるえる 音</td><td><b>ズ</b></td><td>dogs, pens, plays</td></tr></table>'],
   ['m','happy','dogs は 「ドッグス」より 「ドッグズ」。にごるだけで ぐっと 英語らしく なるよ'],
   ['m','proud','-ed と s は 同じ ルール。「前の 音が ふるえるか」を 覚えれば 両方 使えるね'],
  ],
  quiz:[
   {q:'dogs の s は？',o:['ズ','ス','イズ'],a:0},
   {q:'watches の es は？',o:['イズ','ス','ズ'],a:0},
   {q:'cats の s は？',o:['ス','ズ','イズ'],a:0},
  ]},

 {id:'jh-contraction', lv:'jh', cat:'kotsu', t:'ちぢめた 形 I\'m・don\'t・won\'t', key:['短縮形','会話','否定文','will'],
  steps:[
   ['m','smile','会話では 2つの 語を くっつけて 短く する ことが 多いよ。アポストロフィ（\'）が 消えた 文字の 目印'],
   ['m','think','よく 使う ちぢめた 形', '<table class="fz-table"><tr><th>もとの 形</th><th>ちぢめた 形</th></tr><tr><td>I am</td><td><b>I\'m</b></td></tr><tr><td>I will</td><td><b>I\'ll</b></td></tr><tr><td>do not</td><td><b>don\'t</b></td></tr><tr><td>cannot</td><td><b>can\'t</b></td></tr><tr><td>will not</td><td><b>won\'t</b>（とくべつ！）</td></tr><tr><td>it is</td><td><b>it\'s</b></td></tr></table>'],
   ['m','worry','it\'s（それは〜だ）と its（その）は べつの 語。its には \' が つかないよ'],
   ['h','happy','won\'t は 「ウォント」、want と まちがえんように 口を まるく や！'],
  ],
  quiz:[
   {q:'will not を ちぢめると？',o:["won't","willn't","wan't"],a:0},
   {q:'「その 色」は？',o:['its color',"it's color"],a:0},
  ]},

 {id:'jh-few-little', lv:'jh', cat:'zu', t:'few と little を 4マスで', key:['few','little','数えられる名詞','数量'],
  steps:[
   ['m','smile','few も little も 「少し」。でも 数えられるか と、気持ちが 前向きか で 4つに 分かれるよ'],
   ['m','think','4マスで 整理', '<table class="fz-table"><tr><th></th><th>数えられる（books）</th><th>数えられない（water）</th></tr><tr><th>少し ある 😊</th><td><b>a few</b> books</td><td><b>a little</b> water</td></tr><tr><th>ほとんど ない 😟</th><td><b>few</b> books</td><td><b>little</b> water</td></tr></table>'],
   ['m','think','a が つくと 「少し ある」、a が ないと 「ほとんど ない」。コップの 絵で 考えよう', '<div class="fz-row"><div class="fz-pic"><span>🥛</span><small><b>a little</b> water<br>少し ある</small></div><div class="fz-pic"><span>🫗</span><small><b>little</b> water<br>ほとんど ない</small></div></div>'],
   ['m','proud','たくさん は many（数えられる）と much（数えられない）。同じ 分け方だよ'],
  ],
  quiz:[
   {q:'友だちが 少し いる（うれしい）：I have ___ friends.',o:['a few','a little','little'],a:0},
   {q:'時間が ほとんど ない：We have ___ time.',o:['little','a few','few'],a:0},
  ]},

 {id:'jh-some-any', lv:'jh', cat:'zu', t:'some と any の 使いわけ', key:['some','any','疑問文','否定文'],
  steps:[
   ['m','smile','some は 「いくつか ある」と 思って いる とき、any は 「あるか ないか 分からない・ない」 とき に 使うよ'],
   ['m','think','基本の 形', '<table class="fz-table"><tr><td>ふつうの 文</td><td>I have <b>some</b> apples.</td></tr><tr><td>疑問文</td><td>Do you have <b>any</b> apples?</td></tr><tr><td>否定文</td><td>I don\'t have <b>any</b> apples.</td></tr></table>'],
   ['m','think','でも すすめる・たのむ ときは 疑問文でも some。「ある」と 思って いるからだよ', '<div class="fz-tip">Would you like <b>some</b> tea?　（お茶 いかが？）</div>'],
   ['m','proud','ふつうの 文の any は 「どれでも」。You can take any book.（どの 本でも いいよ）'],
  ],
  quiz:[
   {q:'Do you have ___ pets?',o:['any','some'],a:0},
   {q:'すすめる とき：Would you like ___ cake?',o:['some','any'],a:0},
   {q:'ならべかえて 文に しよう',order:["I don't",'have','any','money'],ja:'お金を まったく 持っていない'},
  ]},

 {id:'jh-by-until', lv:'jh', cat:'zu', t:'by は 期限、until は ずっと', key:['by','until','前置詞','時'],
  steps:[
   ['m','smile','どちらも 「〜まで」と 訳すけど、絵に すると ぜんぜん ちがうよ'],
   ['m','think','by は 「その 時までに 1回 すませる」。until は 「その 時まで ずっと 続ける」', '<div class="fz-col"><div class="fz-line"><i class="pt now" style="--x:20%">now</i><i class="pt" style="--x:50%">ここで 出す<small>OK</small></i><i class="pt" style="--x:80%">5時<small>しめきり</small></i><i class="span" style="--a:20%;--b:80%">by five：どこかで 1回</i></div><div class="fz-line"><i class="pt now" style="--x:20%">now</i><i class="pt" style="--x:80%">5時<small>おわり</small></i><i class="span" style="--a:20%;--b:80%">until five：ずっと</i></div></div>'],
   ['m','think','Finish your homework by five.（5時までに 宿題を 終えて） / I\'ll wait until five.（5時まで 待つ）'],
   ['h','proud','by は しめきり、until は がまん大会や！'],
  ],
  quiz:[
   {q:'レポートは 金曜までに 出して：Hand it in ___ Friday.',o:['by','until'],a:0},
   {q:'雨が やむまで ここに いる：I\'ll stay here ___ the rain stops.',o:['until','by'],a:0},
  ]},

 {id:'jh-polite-stairs', lv:'jh', cat:'zu', t:'たのみ方の ていねい階段', key:['依頼','Could you','ていねい','会話'],
  steps:[
   ['m','smile','英語にも ていねいさの 段階が あるよ。言葉を 足すほど やわらかく なるんだ'],
   ['m','think','下ほど ていねい', '<div class="fz-col"><div class="fz-blocks"><span class="b m">Open the window.<small>命令</small></span></div><div class="fz-blocks"><span class="b s">Please open the window.<small>お願い（まだ 少し 強め）</small></span></div><div class="fz-blocks"><span class="b o">Can you open the window?<small>友だちに</small></span></div><div class="fz-blocks"><span class="b t">Could you open the window?<small>目上の 人・店で</small></span></div><div class="fz-blocks"><span class="b c">Would you mind opening the window?<small>とても ていねい</small></span></div></div>'],
   ['m','worry','Would you mind 〜ing? は 「〜するのは いやですか？」の 意味。OK なら No, not at all. と 答えるよ'],
   ['m','proud','迷ったら Could you 〜? を 使えば だいたい 安心だよ'],
  ],
  quiz:[
   {q:'店員さんに たのむ ときに ちょうど いいのは？',o:['Could you help me?','Help me.'],a:0},
   {q:'Would you mind closing the door? に OK と 答えるには？',o:['No, not at all.','Yes, I mind.'],a:0},
  ]},

 {id:'jh-big-numbers', lv:'jh', cat:'kotsu', t:'大きな 数は 3けたで 区切る', key:['数字','thousand','million','数'],
  steps:[
   ['m','smile','日本語は 4けたごとに 万・億と 名前が かわる。英語は 3けたごと（カンマごと）に かわるよ'],
   ['m','think','カンマが 名前の 目印', '<div class="fz-split"><span>1<small>billion</small></span><span>,000<small>million</small></span><span>,000<small>thousand</small></span><span>,000<small>（1〜999）</small></span></div><small style="text-align:center">カンマを 左へ 1つ こえる たびに thousand → million → billion</small>'],
   ['m','think','だから 1万は 「10 thousand」、100万は 「1 million」、1億は 「100 million」', '<table class="fz-table"><tr><th>日本語</th><th>英語</th></tr><tr><td>1万（10,000）</td><td>ten thousand</td></tr><tr><td>10万（100,000）</td><td>a hundred thousand</td></tr><tr><td>100万（1,000,000）</td><td>a million</td></tr><tr><td>1億（100,000,000）</td><td>a hundred million</td></tr></table>'],
   ['h','proud','宝くじ 1億円は a hundred million yen！ 当たったら 英語で 自慢したるわ'],
  ],
  quiz:[
   {q:'1万は 英語で？',o:['ten thousand','one man','a million'],a:0},
   {q:'100万は？',o:['a million','a hundred thousand','a billion'],a:0},
  ]},

 {id:'jh-proverbs', lv:'jh', cat:'kotsu', t:'英語の ことわざを 絵で 覚える', key:['ことわざ','表現','文化'],
  steps:[
   ['m','smile','ことわざは 短くて リズムが いいから、文の 形ごと 覚えるのに ぴったりだよ'],
   ['m','think','日本語の ことわざと くらべて みよう', '<table class="fz-table"><tr><th>英語</th><th>近い 日本語</th></tr><tr><td>🏛️ Rome wasn\'t built in a day.</td><td>ローマは 1日に して ならず</td></tr><tr><td>👀 Seeing is believing.</td><td>百聞は 一見に しかず</td></tr><tr><td>🧠🧠 Two heads are better than one.</td><td>三人 寄れば 文殊の 知恵</td></tr><tr><td>⏰ Time is money.</td><td>時は 金なり</td></tr><tr><td>☁️ Every cloud has a silver lining.</td><td>どんな 雲にも 銀の ふち（悪い ことにも よい 面）</td></tr></table>'],
   ['m','think','日本語は 「三人」、英語は 「2つの 頭」。数の ちがいも おもしろいね'],
   ['h','happy','おばちゃんの お気に入りは Every cloud has a silver lining や。雨の 日も ええ ことある！'],
  ],
  quiz:[
   {q:'百聞は 一見に しかず は？',o:['Seeing is believing.','Time is money.'],a:0},
   {q:'Two heads are better than one. の 意味は？',o:['みんなで 考えると よい 知恵が 出る','頭が 2つ ある 動物'],a:0},
  ]},

 {id:'jh-mistake-note', lv:'jh', cat:'yarikata', t:'まちがいノートの 作り方', key:['勉強法','復習','まちがい','ノート'],
  steps:[
   ['m','smile','まちがえた 問題は 「自分専用の 弱点リスト」。ノートに 集めると 宝物に なるよ'],
   ['m','think','3つの らんに 分けて 書く', '<table class="fz-table"><tr><th>まちがい</th><th>正しい</th><th>なぜ？</th></tr><tr><td>He go to school.</td><td>He <b>goes</b> to school.</td><td>三単現の s</td></tr><tr><td>I have seen him yesterday.</td><td>I <b>saw</b> him yesterday.</td><td>yesterday は 過去形</td></tr></table>'],
   ['m','think','いちばん 大事なのは 「なぜ？」の らん。理由が 書ければ 同じ ミスを くり返さないよ'],
   ['m','proud','週に 1回、答えを かくして ときなおす。3回 続けて できたら ✔ を つけて 卒業！'],
  ],
  quiz:[
   {q:'まちがいノートで いちばん 大事な らんは？',o:['なぜ？','日付'],a:0},
   {q:'ノートから 卒業させる めやすは？',o:['かくして 何回か 続けて できたら','1回 書いたら'],a:0},
  ]},

/* 高校生 */
 {id:'hs-stress-shift', lv:'hs', cat:'oto', t:'名詞は 前、動詞は 後ろを 強く', key:['発音','アクセント','名詞','動詞'],
  steps:[
   ['m','smile','つづりが 同じでも、名詞か 動詞かで 強く 読む 場所が かわる 単語が あるよ'],
   ['m','think','名詞は 前、動詞は 後ろ', '<div class="fz-col"><div class="fz-pair"><div><b>REcord</b><small>名詞：記録</small></div><div><b>reCORD</b><small>動詞：記録する</small></div></div><div class="fz-pair"><div><b>PREsent</b><small>名詞：プレゼント</small></div><div><b>preSENT</b><small>動詞：贈る・発表する</small></div></div><div class="fz-pair"><div><b>INcrease</b><small>名詞：増加</small></div><div><b>inCREASE</b><small>動詞：増える</small></div></div><div class="fz-pair"><div><b>OBject</b><small>名詞：物</small></div><div><b>obJECT</b><small>動詞：反対する</small></div></div></div>'],
   ['m','think','すべての 単語では ないけど、2音節の この タイプは 「名詞は 前、動詞は 後ろ」で 当たる ことが 多いよ'],
   ['m','proud','リスニングでも、強い 場所で 名詞か 動詞か 分かる。文の 形を つかむ ヒントに なるんだ'],
  ],
  quiz:[
   {q:'動詞の record（記録する）の 強い 場所は？',o:['後ろ（reCORD）','前（REcord）'],a:0},
   {q:'名詞の present（プレゼント）は？',o:['PREsent','preSENT'],a:0},
  ]},

 {id:'hs-did-you', lv:'hs', cat:'oto', t:'Did you は 「ディジュ」、going to は 「ガナ」', key:['リスニング','発音','会話','音の変化'],
  steps:[
   ['m','smile','会話の 英語では、よく 使う 組み合わせが くっついて 別の 音に 聞こえるよ'],
   ['m','think','d・t と you が くっつくと 「ジュ」「チュ」に なる', '<div class="fz-col"><div class="fz-sound"><span>Did</span><span>you</span><b>ディジュ</b></div><div class="fz-sound"><span>Would</span><span>you</span><b>ウッジュ</b></div><div class="fz-sound"><span>meet</span><span>you</span><b>ミーチュ</b></div></div>'],
   ['m','think','会話で とても 多い 「ちぢめ読み」', '<table class="fz-table"><tr><th>書くと</th><th>話すと</th></tr><tr><td>going to</td><td><b>gonna</b>（ガナ）</td></tr><tr><td>want to</td><td><b>wanna</b>（ワナ）</td></tr><tr><td>have got to</td><td><b>gotta</b>（ガラ）</td></tr></table>'],
   ['m','worry','gonna や wanna は 話し言葉。作文や 試験の 答えでは もとの 形で 書こうね'],
   ['h','happy','「ナイストゥミーチュ」！ 最初から 1つの 言葉や 思て 覚えたら ええ'],
  ],
  quiz:[
   {q:'「ワナ」と 聞こえたら もとの 形は？',o:['want to','wanna be'],a:0},
   {q:'作文で 書くのは？',o:["I'm going to study.","I'm gonna study."],a:0},
  ]},

 {id:'hs-make-let-have', lv:'hs', cat:'zu', t:'make・have・let の 「させる」メーター', key:['使役動詞','make','let','have','文法'],
  steps:[
   ['m','smile','「〜させる」の 3つは、相手の 気持ちを どれくらい 無視するかで ちがうよ'],
   ['m','think','強さメーター', '<svg viewBox="0 0 320 110" role="img" aria-label="させるの 強さ。make が いちばん 強く、have が 中くらい、let が いちばん 弱い"><defs><linearGradient id="mlh" x1="0" x2="1"><stop offset="0" stop-color="#2e9e4f"/><stop offset=".5" stop-color="#e67e22"/><stop offset="1" stop-color="#d8433f"/></linearGradient></defs><rect x="20" y="40" width="280" height="16" rx="8" fill="url(#mlh)"/><g font-size="15" font-weight="700" text-anchor="middle"><text x="45" y="30" fill="#2e9e4f">let</text><text x="160" y="30" fill="#e67e22">have</text><text x="275" y="30" fill="#d8433f">make</text></g><g font-size="10" text-anchor="middle" fill="#2a2340"><text x="45" y="74">したい ことを</text><text x="45" y="88">許す</text><text x="160" y="74">当然の 仕事として</text><text x="160" y="88">してもらう</text><text x="275" y="74">いやでも</text><text x="275" y="88">むりやり させる</text></g><text x="160" y="106" font-size="9" text-anchor="middle" fill="#5b5577">弱い ← させる 力 → 強い</text></svg>'],
   ['m','think','形は どれも 「動詞 + 人 + 動詞の 原形」', '<table class="fz-table"><tr><td>My mom <b>let</b> me play games.</td><td>ゲームを させて くれた</td></tr><tr><td>I <b>had</b> the shop fix my bike.</td><td>店に 自転車を 直して もらった</td></tr><tr><td>The coach <b>made</b> us run.</td><td>コーチに 走らされた</td></tr></table>'],
   ['m','worry','to は つけないよ。× made us to run。get なら to が つく：get him to help'],
  ],
  quiz:[
   {q:'「やりたい ことを させて くれた」は？',o:['let','make','have'],a:0},
   {q:'正しいのは？',o:['He made me wait.','He made me to wait.'],a:0},
   {q:'ならべかえて 文に しよう',order:['My dad','let','me','drive'],ja:'父は わたしに 運転させて くれた'},
  ]},

 {id:'hs-for-during', lv:'hs', cat:'zu', t:'for は 長さ、during は 出来事', key:['for','during','前置詞','期間'],
  steps:[
   ['m','smile','どちらも 「〜の 間」。後ろに 来る ものが ちがうよ'],
   ['m','think','for の 後ろは 数字の 長さ、during の 後ろは 出来事や 期間の 名前', '<div class="fz-pair"><div><b>for</b><small>どれだけの 長さ？</small><i>for three days<br>for two hours</i></div><div><b>during</b><small>いつの 間？</small><i>during the summer<br>during the movie</i></div></div>'],
   ['m','think','during は 「その 期間の どこかで」も OK。I fell asleep during the movie.（映画の とちゅうで 寝た）'],
   ['m','proud','迷ったら 後ろを 見る。数字なら for、名前なら during だよ'],
  ],
  quiz:[
   {q:'I stayed in Okinawa ___ a week.',o:['for','during'],a:0},
   {q:'Don\'t talk ___ the test.',o:['during','for'],a:0},
  ]},

 {id:'hs-voice-check', lv:'hs', cat:'yarikata', t:'音声入力と 録音で 発音チェック', key:['発音','スピーキング','録音','勉強法'],
  steps:[
   ['m','smile','自分の 発音が 通じるか、スマホで かんたんに たしかめられるよ'],
   ['m','think','① 音声入力（英語に 設定）で 話して、ちゃんと 文字に なるか 見る', '<div class="fz-pair"><div><b>言ったつもり</b><i>I like rice.</i></div><div><b>文字に なったのが</b><i>I like lice.（シラミ😱）</i></div></div>'],
   ['m','think','② お手本と 自分の 録音を 聞き比べる', '<ol class="fz-steps"><li>お手本を 1文 聞く</li><li>自分も 録音する</li><li>交互に 聞いて、ちがう ところを 1つだけ 見つける</li><li>そこだけ 直して もう一度 録音</li></ol>'],
   ['m','proud','一度に 全部 直そうと しない のが コツ。1回 1か所で、少しずつ 近づこう'],
   ['h','happy','おばちゃん 録音 聞いたら 自分の 声に びっくりや。でも 慣れたら 楽しいで！'],
  ],
  quiz:[
   {q:'聞き比べで 見つけるのは？',o:['ちがう ところを 1つ','全部の ちがい'],a:0},
   {q:'音声入力で わかる ことは？',o:['発音が 通じるか','単語の 意味'],a:0},
  ]},

/* ハイレベル */
 {id:'adv-reading-log', lv:'adv', cat:'yarikata', t:'読んだ 語数を 記録する', key:['多読','記録','モチベーション','読解'],
  steps:[
   ['m','smile','多読は 「何冊」より 「何語」で 記録すると、成長が 見えやすいよ'],
   ['m','think','記録の 例', '<table class="fz-table"><tr><th>日付</th><th>本</th><th>語数</th><th>合計</th><th>感想</th></tr><tr><td>11/1</td><td>短い 物語</td><td>2,000</td><td>2,000</td><td>😊</td></tr><tr><td>11/5</td><td>やさしい 伝記</td><td>5,000</td><td>7,000</td><td>😐</td></tr></table>'],
   ['m','think','語数の 目安：1ページの 語数 × ページ数 で だいたいで OK。マイルストーンを 決めて 目指そう', '<svg viewBox="0 0 320 70" role="img" aria-label="1万語、10万語、30万語、100万語の マイルストーン"><line x1="20" y1="35" x2="300" y2="35" stroke="#c9c3e0" stroke-width="6" stroke-linecap="round"/><g fill="#e67e22"><circle cx="40" cy="35" r="8"/><circle cx="120" cy="35" r="8"/><circle cx="200" cy="35" r="8"/><circle cx="285" cy="35" r="10"/></g><g font-size="11" text-anchor="middle" fill="#2a2340" font-weight="700"><text x="40" y="62">1万語</text><text x="120" y="62">10万語</text><text x="200" y="62">30万語</text><text x="285" y="62">100万語</text></g><text x="285" y="20" font-size="14" text-anchor="middle">🏆</text></svg>'],
   ['m','proud','つまらない 本は 途中で やめて OK。楽しく 続く ことが 語数を いちばん のばすよ'],
  ],
  quiz:[
   {q:'多読の 記録で おすすめなのは？',o:['語数','読んだ 時間だけ'],a:0},
   {q:'つまらない 本は？',o:['途中で やめて 次へ','最後まで がまん'],a:0},
  ]},

 {id:'adv-my-phrases', lv:'adv', cat:'yarikata', t:'自分が 言いたい ことを 先に 英語に', key:['スピーキング','自己紹介','フレーズ','勉強法'],
  steps:[
   ['m','smile','会話で 言いたく なる ことの 多くは 「自分の こと」。それを 先に 英語に して おくと、話す ときに 困らないよ'],
   ['m','think','自分専用 フレーズ集を 作る テーマ', '<div class="fz-row"><div class="fz-pic"><span>🙋</span><small>自己紹介<br>名前・住んでいる 所</small></div><div class="fz-pic"><span>🎸</span><small>好きな こと<br>しゅみ・理由</small></div><div class="fz-pic"><span>📅</span><small>毎日<br>ふだんの 1日</small></div><div class="fz-pic"><span>🎯</span><small>夢<br>やりたい こと</small></div></div>'],
   ['m','think','例：I live near the sea, so I often walk on the beach at night. I love looking at the stars.'],
   ['m','proud','各テーマ 3〜5文。声に 出して すらすら 言えるまで 練習しよう。会話の 「持ちネタ」が できるよ'],
   ['h','proud','おばちゃんの 持ちネタは 「I love sweets!」や。どこ行っても これで 盛り上がるで'],
  ],
  quiz:[
   {q:'先に 英語に しておくと いいのは？',o:['自分の こと（しゅみ・毎日 など）','ニュースの 専門用語'],a:0},
   {q:'ならべかえて 文に しよう',order:['I','love','looking at','the stars'],ja:'星を 見るのが 大好き'},
  ]},
);

/* ---------- 学び方 その4（つまずきやすい 文法・会話の コツ・音・ことば） ---------- */
LESSONS.push(
/* 小学生 */
 {id:'es-i-spy', lv:'es', cat:'yarikata', t:'I spy あそびで ことばさがし', key:['あそび','色','単語','勉強法'],
  tip:'「I spy… something blue」と いって まわりの ものを あてっこすると、いろと ものの なまえが いっぺんに おぼえられるよ',
  steps:[
   ['m','smile','I spy は 「みーつけた」あそび。おうちでも はまべでも できるよ'],
   ['m','think','ひとりが こっそり 1つ えらんで、ヒントを いう。みんなで あてるよ', '<div class="fz-col"><div class="fz-tip">I spy with my little eye… something <b>blue</b>!<small>（ちいさな めで みつけたよ… なにか あおい もの）</small></div><div class="fz-row"><div class="fz-pic"><span>🌊</span><small>The sea? ⭕</small></div><div class="fz-pic"><span>🍎</span><small>An apple? ❌</small></div></div></div>'],
   ['m','happy','なれたら いろの かわりに 「はじまりの おと」で ヒント。something beginning with <b>S</b>（S で はじまる もの）→ sand, shell, star！'],
   ['h','happy','おばちゃんが みつけたんは… something yellow！ こたえは バナナや〜'],
  ],
  quiz:[
   {q:'something red の こたえに なるのは？',o:['🍎 apple','🌊 sea'],a:0},
   {q:'S で はじまる ものは？',o:['star','moon','fish'],a:0},
  ]},

 {id:'es-weather', lv:'es', cat:'kotsu', t:'おてんきの いいかた', key:['天気','It is','単語'],
  tip:'おてんきは It\'s sunny. の ように It\'s を つけて いうよ。この It は 「おてんき」の ことなんだ',
  steps:[
   ['m','smile','おてんきは It\'s 〜. で いえるよ。It は 「そら・おてんき」の ことだよ'],
   ['m','think','5つの おてんき', '<div class="fz-row"><div class="fz-pic"><span>☀️</span><small>It\'s <b>sunny</b>.</small></div><div class="fz-pic"><span>☁️</span><small>It\'s <b>cloudy</b>.</small></div><div class="fz-pic"><span>🌧️</span><small>It\'s <b>rainy</b>.</small></div><div class="fz-pic"><span>🌬️</span><small>It\'s <b>windy</b>.</small></div><div class="fz-pic"><span>❄️</span><small>It\'s <b>snowy</b>.</small></div></div>'],
   ['m','happy','sun → sunny、rain → rainy。おなまえに y を つけると 「〜の おてんき」に なるね'],
   ['m','smile','おてんきを きく ときは How\'s the weather?（おてんきは どう？）'],
  ],
  quiz:[
   {q:'あめの ひは？',o:["It's rainy.","It's sunny."],a:0},
   {q:'かぜが つよい ひは？',o:["It's windy.","It's snowy."],a:0},
  ]},

 {id:'es-aizuchi', lv:'es', cat:'kotsu', t:'あいづちで かいわが はずむ', key:['会話','あいづち','Really'],
  tip:'あいてが はなしたら Really? や Me too! と ひとこと かえすだけで、かいわが ぐっと たのしく なるよ',
  steps:[
   ['m','smile','あいての はなしに ひとこと かえすと、「ちゃんと きいてるよ」が つたわるよ'],
   ['m','think','つかいやすい あいづち', '<table class="fz-table"><tr><td><b>Really?</b></td><td>ほんとう？</td></tr><tr><td><b>Wow!</b></td><td>すごい！</td></tr><tr><td><b>Me too!</b></td><td>わたしも！</td></tr><tr><td><b>That\'s nice.</b></td><td>いいね</td></tr><tr><td><b>I see.</b></td><td>なるほど</td></tr></table>'],
   ['m','happy','I like cats. と いわれたら、Me too! ねこ すきじゃ なかったら Really? I like dogs. でも いいよ'],
   ['h','proud','おばちゃんの あいづちは 「Wow!」 いっぽんや。なんでも これで もりあがるで！'],
  ],
  quiz:[
   {q:'「わたしも！」は？',o:['Me too!','I see.'],a:0},
   {q:'おどろいた ときの あいづちは？',o:['Really?','Me too.'],a:0},
  ]},

/* 中学生 */
 {id:'jh-bored-boring', lv:'jh', cat:'zu', t:'bored と boring の 矢印', key:['分詞','感情','形容詞','ed','ing'],
  tip:'-ing は 「気持ちに させる もの」、-ed は 「気持ちに なった 人」。The movie was boring. I was bored. だよ',
  steps:[
   ['m','smile','I\'m boring. と 言うと 「わたしは 退屈な 人間です」に なっちゃう！ まちがえやすい ポイントだよ'],
   ['m','think','気持ちの 矢印で 考えよう', '<svg viewBox="0 0 320 100" role="img" aria-label="映画 boring から 人 bored へ 気持ちの 矢印"><rect x="10" y="25" width="110" height="50" rx="10" fill="#e67e22"/><text x="65" y="47" font-size="13" text-anchor="middle" fill="#fff">🎬 映画</text><text x="65" y="65" font-size="12" font-weight="700" text-anchor="middle" fill="#fff">boring</text><rect x="200" y="25" width="110" height="50" rx="10" fill="#3f6ad8"/><text x="255" y="47" font-size="13" text-anchor="middle" fill="#fff">🙍 わたし</text><text x="255" y="65" font-size="12" font-weight="700" text-anchor="middle" fill="#fff">bored</text><line x1="125" y1="50" x2="190" y2="50" stroke="#2a2340" stroke-width="3"/><path d="M188 44 L198 50 L188 56 Z" fill="#2a2340"/><text x="160" y="40" font-size="9" text-anchor="middle" fill="#5b5577">気持ちを</text><text x="160" y="68" font-size="9" text-anchor="middle" fill="#5b5577">あたえる</text><text x="65" y="92" font-size="10" text-anchor="middle" fill="#e67e22">-ing：させる 側</text><text x="255" y="92" font-size="10" text-anchor="middle" fill="#3f6ad8">-ed：感じる 側</text></svg>'],
   ['m','think','同じ ペアが たくさん あるよ', '<table class="fz-table"><tr><th>させる 側 -ing</th><th>感じる 側 -ed</th></tr><tr><td>interesting</td><td>interested（興味が ある）</td></tr><tr><td>exciting</td><td>excited（わくわく）</td></tr><tr><td>surprising</td><td>surprised（おどろいた）</td></tr><tr><td>tiring</td><td>tired（つかれた）</td></tr></table>'],
   ['h','happy','おばちゃんは いつも exciting な 人やで。そやから みんな excited や！'],
  ],
  quiz:[
   {q:'（わたしは）わくわく している：I\'m ___.',o:['excited','exciting'],a:0},
   {q:'その 本は おもしろい：The book is ___.',o:['interesting','interested'],a:0},
  ]},

 {id:'jh-negative-q', lv:'jh', cat:'zu', t:'「〜じゃないの？」への 答え方', key:['否定疑問文','Yes','No','会話'],
  tip:'Don\'t you like it? と 聞かれても、好きなら Yes、好きじゃ ないなら No。英語は 答えの 中身で 決めるよ',
  steps:[
   ['m','smile','日本人が とても よく まちがえる ところ。「ねこ 好きじゃ ないの？」に どう 答える？'],
   ['m','think','英語の Yes・No は 質問の 形じゃなく、答えの 中身で 決まる', '<table class="fz-table"><tr><th colspan="2">Don\'t you like cats?</th></tr><tr><td>好き 😺</td><td><b>Yes</b>, I do.（日本語なら 「いいえ、好きです」）</td></tr><tr><td>好きじゃ ない 🙅</td><td><b>No</b>, I don\'t.（日本語なら 「はい、好きじゃ ないです」）</td></tr></table>'],
   ['m','think','コツ：後ろの 文と そろえる。Yes の 後ろは 肯定（I do）、No の 後ろは 否定（I don\'t）', '<div class="fz-pair"><div><b>Yes</b><i>, I do.</i><small>＋ と ＋</small></div><div><b>No</b><i>, I don\'t.</i><small>− と −</small></div></div>'],
   ['m','proud','まよったら Yes・No を 言わずに I like them! と 中身だけ 言っても 通じるよ'],
  ],
  quiz:[
   {q:'Aren\'t you hungry?（おなかが すいて いる 場合）',o:["Yes, I am.","No, I am."],a:0},
   {q:'Don\'t you play soccer?（して いない 場合）',o:["No, I don't.","Yes, I don't."],a:0},
  ]},

 {id:'jh-indirect-q', lv:'jh', cat:'zu', t:'文の 中の 疑問文は ふつうの 順番', key:['間接疑問文','語順','疑問詞'],
  tip:'Do you know where he lives? の ように、文の 中に 入った 疑問文は 「主語 → 動詞」の ふつうの 順番に もどるよ',
  steps:[
   ['m','smile','「彼が どこに 住んで いるか 知ってる？」。疑問文を 文の 中に 入れる 形だよ'],
   ['m','think','中に 入ると、疑問文の 形が ほどけて ふつうの 順番に なる', '<div class="fz-col"><div class="fz-blocks"><span class="b c">Where</span><span class="b m">does</span><span class="b s">he</span><span class="b v">live?</span></div><div class="fz-tip">↓ 文の 中に 入れると does が 消えて 順番が ふつうに</div><div class="fz-blocks"><span class="b m">Do you know</span><span class="b c">where</span><span class="b s">he</span><span class="b v">lives?</span></div></div>'],
   ['m','think','be動詞でも 同じ：What is this? → I don\'t know what this is.'],
   ['m','proud','Could you tell me where the station is?（駅は どこか 教えて いただけますか）は 道を 聞く ときに 大活躍だよ'],
  ],
  quiz:[
   {q:'正しいのは？',o:['Do you know where he lives?','Do you know where does he live?'],a:0},
   {q:'ならべかえて 文に しよう',order:['I know','what','this','is'],ja:'これが 何か 知っている'},
  ]},

 {id:'jh-tag-q', lv:'jh', cat:'zu', t:'「〜だよね？」の 付加疑問', key:['付加疑問文','会話','否定'],
  tip:'It\'s hot, isn\'t it? の ように 文の 最後に 反対の 形を 足すと 「〜だよね？」に なるよ',
  steps:[
   ['m','smile','文の 最後に ちょこっと 足して 「〜だよね？」と 相手に 同意を 求める 形だよ'],
   ['m','think','前が ＋ なら 後ろは −、前が − なら 後ろは ＋', '<div class="fz-col"><div class="fz-blocks"><span class="b o">It\'s hot,<small>＋</small></span><span class="b v">isn\'t it?<small>−</small></span></div><div class="fz-blocks"><span class="b o">You like cats,<small>＋</small></span><span class="b v">don\'t you?<small>−</small></span></div><div class="fz-blocks"><span class="b v">She can\'t swim,<small>−</small></span><span class="b o">can she?<small>＋</small></span></div></div>'],
   ['m','think','後ろの 動詞は 前の 文に 合わせる。be動詞なら be、一般動詞なら do・does・did、can なら can'],
   ['h','happy','ええ 天気やね〜、It\'s nice, isn\'t it? 浜辺の あいさつの 決まり文句や'],
  ],
  quiz:[
   {q:'You are a student, ___?',o:["aren't you","don't you","are you"],a:0},
   {q:'He played tennis, ___?',o:["didn't he","doesn't he","wasn't he"],a:0},
  ]},

 {id:'jh-if-present', lv:'jh', cat:'zu', t:'「もし 明日 雨なら」は 現在形', key:['条件','時','will','if','when'],
  tip:'If it rains tomorrow の ように、if や when の 中では 未来の ことでも 現在形を 使うよ',
  steps:[
   ['m','smile','「もし 明日 雨が ふったら、家に いる」。明日の ことだから will rain…と 思うよね？'],
   ['m','think','if・when の かたまりの 中は 現在形。will は もう一方の 文に つける', '<div class="fz-col"><div class="fz-blocks"><span class="b c">If</span><span class="b s">it</span><span class="b v">rains<small>現在形</small></span><span class="b t">tomorrow,</span></div><div class="fz-blocks"><span class="b s">I</span><span class="b v">will stay<small>will は こっち</small></span><span class="b p">home.</span></div></div>'],
   ['m','think','when も 同じ：I\'ll call you when I get home.（家に 着いたら 電話するね）'],
   ['m','proud','「もし〜なら・〜したら」の 部分は 条件、つまり 「その時の 今」と 考えると 覚えやすいよ'],
  ],
  quiz:[
   {q:'If it ___ sunny tomorrow, we will go to the beach.',o:['is','will be'],a:0},
   {q:'I\'ll tell him when he ___ back.',o:['comes','will come'],a:0},
  ]},

 {id:'jh-teen-ty', lv:'jh', cat:'oto', t:'fifteen と fifty を 聞き分ける', key:['発音','数字','リスニング','アクセント'],
  tip:'fifteen は 後ろの teen を 強く 長く、fifty は 前の fif を 強く。強い 場所で 聞き分けよう',
  steps:[
   ['m','smile','買い物や 電話番号で 大事な 数字。15 と 50、聞きまちがえると 大変！'],
   ['m','think','強い 場所が ちがう', '<div class="fz-col"><div class="fz-beat"><span>fif</span><span class="S">TEEN</span><small>15：後ろを 強く 長く 「フィフ<b>ティーーン</b>」</small></div><div class="fz-beat"><span class="S">FIF</span><span>ty</span><small>50：前を 強く、後ろは 短く 「<b>フィ</b>フティ」</small></div></div>'],
   ['m','think','-ty は アメリカ英語だと 「ディ」や 「リ」に 近く なる ことも。forty → フォーリィ'],
   ['m','proud','自信が なかったら Fifteen? One five? と 聞き返そう。それも 立派な 英語力だよ'],
  ],
  quiz:[
   {q:'後ろを 強く 長く 言うのは？',o:['fifteen','fifty'],a:0},
   {q:'「フォーリィ」と 聞こえたら？',o:['40','14'],a:0},
  ]},

 {id:'jh-long-short', lv:'jh', cat:'oto', t:'長い 音と ゆるい 音', key:['発音','母音','リスニング'],
  tip:'leave の イー は 口を 横に 引いて 長く、live の イ は 力を ぬいて 短く。長さだけで なく 口の 形も ちがうよ',
  steps:[
   ['m','smile','英語には 「長くて はった 音」と 「短くて ゆるい 音」の ペアが あるよ'],
   ['m','think','ペアで 言って みよう', '<div class="fz-col"><div class="fz-pair"><div><b>live</b><small>ゆるく 短い イ</small><i>住む</i></div><div><b>leave</b><small>横に 引いて イー</small><i>出発する</i></div></div><div class="fz-pair"><div><b>it</b><small>ゆるい イ</small><i>それ</i></div><div><b>eat</b><small>はった イー</small><i>食べる</i></div></div><div class="fz-pair"><div><b>full</b><small>ゆるい ウ</small><i>いっぱいの</i></div><div><b>fool</b><small>口を すぼめて ウー</small><i>おろか者</i></div></div></div>'],
   ['m','think','ゆるい 音は 日本語の 「イ」と 「エ」の 間くらい。口の 力を ぬくのが コツ'],
   ['h','happy','「I\'m full.（おなか いっぱい）」と 「I\'m a fool.」は えらい ちがいや！'],
  ],
  quiz:[
   {q:'「出発する」は？',o:['leave','live'],a:0},
   {q:'口の 力を ぬく ゆるい 音は？',o:['it の イ','eat の イー'],a:0},
  ]},

 {id:'jh-a-piece-of', lv:'jh', cat:'kotsu', t:'a cup of・a piece of で 数える', key:['数えられない名詞','単位','数え方'],
  tip:'water や bread は 数えられないから、a glass of water、a slice of bread の ように 入れ物や 形で 数えるよ',
  steps:[
   ['m','smile','water や paper は 1つ、2つと 数えられない。だから 「入れ物」や 「形」を 使って 数えるよ'],
   ['m','think','入れ物・形 ＋ of', '<div class="fz-row"><div class="fz-pic"><span>☕</span><small>a <b>cup</b> of tea</small></div><div class="fz-pic"><span>🥛</span><small>a <b>glass</b> of milk</small></div><div class="fz-pic"><span>🍞</span><small>a <b>slice</b> of bread</small></div><div class="fz-pic"><span>📄</span><small>a <b>sheet</b> of paper</small></div><div class="fz-pic"><span>🍚</span><small>a <b>bowl</b> of rice</small></div><div class="fz-pic"><span>🧃</span><small>a <b>bottle</b> of juice</small></div></div>'],
   ['m','think','2つ 以上は 入れ物の ほうに s：two cups of tea（× two cup of teas）'],
   ['m','proud','形が いろいろ ある ものは a piece of が 便利。a piece of cake, a piece of advice（助言 1つ）'],
  ],
  quiz:[
   {q:'紅茶 2はい：two ___ of tea',o:['cups','cup'],a:0},
   {q:'パン 1まい：a ___ of bread',o:['slice','glass','bowl'],a:0},
  ]},

 {id:'jh-ordinal', lv:'jh', cat:'kotsu', t:'1番目・2番目と 日付の 言い方', key:['序数','日付','数字','first'],
  tip:'日付は 序数で 読むよ。5月5日は May fifth。1st・2nd・3rd の 3つだけ 形が とくべつ',
  steps:[
   ['m','smile','「〜番目」を 表す 数を 序数と 言うよ。日付を 言う ときにも 使うんだ'],
   ['m','think','とくべつなのは 1・2・3 だけ。あとは だいたい th', '<table class="fz-table"><tr><td>1st</td><td><b>first</b></td><td>4th</td><td>fourth</td></tr><tr><td>2nd</td><td><b>second</b></td><td>5th</td><td>fif<b>th</b>（ve → f）</td></tr><tr><td>3rd</td><td><b>third</b></td><td>12th</td><td>twelf<b>th</b></td></tr><tr><td>21st</td><td>twenty-<b>first</b></td><td>20th</td><td>twentie<b>th</b></td></tr></table>'],
   ['m','think','日付：May 5 と 書いて May fifth と 読む。誕生日は My birthday is May fifth.'],
   ['h','happy','おばちゃんの 誕生日は August eighth！ プレゼント 待っとるで〜'],
  ],
  quiz:[
   {q:'3番目は？',o:['third','threeth'],a:0},
   {q:'22nd の 読み方は？',o:['twenty-second','twenty-two'],a:0},
  ]},

 {id:'jh-ask-again', lv:'jh', cat:'kotsu', t:'聞き返すのは はずかしく ない', key:['会話','聞き返し','Pardon'],
  tip:'聞き取れなかったら Sorry? や Could you say that again? と 聞き返そう。分かった ふりより ずっと 通じるよ',
  steps:[
   ['m','smile','聞き取れなくても だいじょうぶ。聞き返す 言葉を 持っていれば 会話は 続くよ'],
   ['m','think','場面ごとの 聞き返し', '<table class="fz-table"><tr><th>こまった こと</th><th>言い方</th></tr><tr><td>聞こえなかった</td><td><b>Sorry?</b> / <b>Pardon?</b>（↗）</td></tr><tr><td>もう一度</td><td><b>Could you say that again?</b></td></tr><tr><td>速すぎる</td><td><b>Could you speak more slowly?</b></td></tr><tr><td>単語の 意味</td><td><b>What does 〜 mean?</b></td></tr><tr><td>つづり</td><td><b>How do you spell it?</b></td></tr></table>'],
   ['m','worry','What? だけだと 少し きつく 聞こえる ことが あるよ。Sorry? の ほうが やわらかい'],
   ['m','proud','分かった ふりを するより、聞き返す 人の ほうが ずっと 英語が 伸びるよ'],
  ],
  quiz:[
   {q:'ゆっくり 話して ほしい ときは？',o:['Could you speak more slowly?','Speak!'],a:0},
   {q:'単語の 意味を 聞くには？',o:['What does it mean?','How do you spell it?'],a:0},
  ]},

 {id:'jh-keep-talking', lv:'jh', cat:'kotsu', t:'会話が 続く 「1＋1＋？」', key:['会話','質問','スピーキング'],
  tip:'質問に 答えたら ひとこと 足して、最後に What about you? と 聞き返す。これで 会話が 続くよ',
  steps:[
   ['m','smile','Yes. だけで 終わると 会話が 止まっちゃう。続ける ための 型が あるよ'],
   ['m','think','答え ＋ ひとこと ＋ 質問', '<div class="fz-col"><div class="fz-tip">Do you like music?</div><div class="fz-blocks"><span class="b s">Yes, I do.<small>① 答え</small></span><span class="b o">I play the guitar.<small>② ひとこと</small></span><span class="b v">What about you?<small>③ 聞き返す</small></span></div></div>'],
   ['m','think','③は What about you? / How about you? / Do you 〜 too? など。相手に ボールを 返す イメージ'],
   ['h','proud','会話は キャッチボールや。もらったら 投げ返す！ おばちゃんは 投げすぎ言われるけどな'],
  ],
  quiz:[
   {q:'会話を 続ける 質問は？',o:['What about you?','Goodbye.'],a:0},
   {q:'ならべかえて 文に しよう',order:['I','play','the guitar'],ja:'わたしは ギターを ひく'},
  ]},

/* 高校生 */
 {id:'hs-rise-raise', lv:'hs', cat:'zu', t:'rise と raise、lie と lay', key:['自動詞','他動詞','動詞','語法'],
  tip:'rise は 自分で 上がる、raise は 何かを 上げる。後ろに 「何を」が 来るのは raise の ほうだよ',
  steps:[
   ['m','smile','意味が 似ていて つづりも 似た ペア。ちがいは 「自分で 動く」か 「何かを 動かす」か'],
   ['m','think','矢印が 自分に 向くか、外に 向くか', '<div class="fz-col"><div class="fz-pair"><div><b>rise</b><small>自分で 上がる（目的語 なし）</small><i>The sun rises. ☀️⬆️</i></div><div><b>raise</b><small>〜を 上げる（目的語 あり）</small><i>Raise your hand. ✋⬆️</i></div></div><div class="fz-pair"><div><b>lie</b><small>自分が 横になる</small><i>lie on the bed 🛏️</i></div><div><b>lay</b><small>〜を 置く・横たえる</small><i>lay a book on the desk 📕</i></div></div></div>'],
   ['m','worry','ややこしいのは 過去形。lie の 過去形が lay なんだ', '<table class="fz-table"><tr><td>lie（横になる）</td><td>lie – <b>lay</b> – lain</td></tr><tr><td>lay（置く）</td><td>lay – laid – laid</td></tr><tr><td>rise（上がる）</td><td>rise – rose – risen</td></tr><tr><td>raise（上げる）</td><td>raise – raised – raised</td></tr></table>'],
   ['m','proud','後ろに 「何を」が あるか 見る。あれば raise・lay、なければ rise・lie'],
  ],
  quiz:[
   {q:'Prices ___ every year.（物価が 上がる）',o:['rise','raise'],a:0},
   {q:'She ___ the baby on the bed.（赤ちゃんを 寝かせた）',o:['laid','lay'],a:0},
  ]},

 {id:'hs-between-among', lv:'hs', cat:'zu', t:'between と among、across と along', key:['前置詞','between','among','across','along'],
  tip:'between は 2つ（はっきり 分かれた もの）の 間、among は むれの 中。across は 横切って、along は 沿って',
  steps:[
   ['m','smile','場所の 前置詞を もう2組。どれも 絵に すると 一発で 分かるよ'],
   ['m','think','between と among', '<div class="fz-row"><div class="fz-pic"><svg viewBox="0 0 60 50"><rect x="6" y="15" width="12" height="22" fill="#7a7f99"/><rect x="42" y="15" width="12" height="22" fill="#7a7f99"/><circle cx="30" cy="26" r="7" fill="#d8433f"/></svg><small><b>between</b><br>2つの 間</small></div><div class="fz-pic"><svg viewBox="0 0 60 50"><g fill="#7a7f99"><circle cx="12" cy="12" r="5"/><circle cx="30" cy="8" r="5"/><circle cx="48" cy="14" r="5"/><circle cx="10" cy="36" r="5"/><circle cx="50" cy="38" r="5"/><circle cx="30" cy="44" r="5"/></g><circle cx="30" cy="26" r="7" fill="#d8433f"/></svg><small><b>among</b><br>むれの 中</small></div></div>'],
   ['m','think','across と along', '<div class="fz-row"><div class="fz-pic"><svg viewBox="0 0 60 50"><rect x="0" y="16" width="60" height="18" fill="#3f6ad8" opacity=".35"/><line x1="30" y1="4" x2="30" y2="42" stroke="#d8433f" stroke-width="3"/><path d="M25 40 L30 48 L35 40 Z" fill="#d8433f"/></svg><small><b>across</b> the river<br>横切って 向こうへ</small></div><div class="fz-pic"><svg viewBox="0 0 60 50"><rect x="0" y="20" width="60" height="16" fill="#3f6ad8" opacity=".35"/><line x1="4" y1="12" x2="50" y2="12" stroke="#d8433f" stroke-width="3"/><path d="M48 7 L57 12 L48 17 Z" fill="#d8433f"/></svg><small><b>along</b> the river<br>川に 沿って</small></div></div>'],
   ['m','proud','walk along the beach（浜辺に 沿って 歩く）、swim across the bay（湾を 泳いで 渡る）。浜辺でも 使えるね'],
  ],
  quiz:[
   {q:'友だち 2人の 間に 座る：sit ___ my two friends',o:['between','among'],a:0},
   {q:'道を 横切る：walk ___ the street',o:['across','along'],a:0},
  ]},

 {id:'hs-n-ng', lv:'hs', cat:'oto', t:'n と ng の 「ん」の ちがい', key:['発音','子音','ng','鼻音'],
  tip:'n は 舌先を 上の 歯ぐきに つけて 「ん」、ng は 舌の 奥を 上げて 「ん」。sing の g は 「グ」と 言わないよ',
  steps:[
   ['m','smile','日本語の 「ん」は 1つ。でも 英語には 舌の 位置が ちがう 「ん」が あるよ'],
   ['m','think','舌が どこに つくか', '<div class="fz-col"><div class="fz-pair"><div><b>n</b><small>舌先を 上の 歯ぐきに</small><i>sin / thin / ran</i></div><div><b>ng</b><small>舌の 奥を 上あごの 奥に</small><i>sing / thing / rang</i></div></div></div>'],
   ['m','think','sing は 「シング」じゃなくて 「スィン（グは 言わない）」。舌の 奥で 止めるだけ'],
   ['m','proud','練習：「なんか」の 「ん」は 舌の 奥、「なんだ」の 「ん」は 舌先。日本語の 中にも 2つ かくれているよ'],
  ],
  quiz:[
   {q:'sing の ng で 舌は？',o:['奥を 上げる','先を 歯ぐきに'],a:0},
   {q:'sing の 最後に 「グ」を はっきり 言う？',o:['言わない','はっきり 言う'],a:0},
  ]},

 {id:'hs-body-idioms', lv:'hs', cat:'kotsu', t:'体の 言葉で できた 言い回し', key:['イディオム','表現','体'],
  tip:'Break a leg! は 「足を 折れ」じゃなくて 「がんばって！」。体の 言葉の 言い回しは 絵で 覚えると 楽しいよ',
  steps:[
   ['m','smile','英語には 体の 言葉を 使った おもしろい 言い回しが たくさん あるよ'],
   ['m','think','文字どおりと 本当の 意味', '<table class="fz-table"><tr><th>言い回し</th><th>本当の 意味</th></tr><tr><td>🦵 Break a leg!</td><td>がんばって！（本番の 前に）</td></tr><tr><td>👀 keep an eye on 〜</td><td>〜を 見張る・気に かける</td></tr><tr><td>💪 cost an arm and a leg</td><td>とても 高い</td></tr><tr><td>👂 I\'m all ears.</td><td>しっかり 聞いてるよ</td></tr><tr><td>✋ give 人 a hand</td><td>手を 貸す・手伝う</td></tr><tr><td>❤️ learn 〜 by heart</td><td>暗記する</td></tr></table>'],
   ['m','think','文字どおりの 絵を 思いうかべて、そこから 本当の 意味へ つなげると 忘れにくいよ'],
   ['h','happy','この バッグ、cost an arm and a leg やったわ！ 手も 足も 持ってかれたで〜'],
  ],
  quiz:[
   {q:'Can you give me a hand? の 意味は？',o:['手伝って くれる？','手を 見せて'],a:0},
   {q:'learn it by heart は？',o:['暗記する','心で 感じる'],a:0},
  ]},

 {id:'hs-easy-news', lv:'hs', cat:'yarikata', t:'やさしい 英語ニュースの 使い方', key:['リスニング','読解','ニュース','勉強法'],
  tip:'学習者向けの やさしい 英語ニュースは 見出しで 中身を 予想 → 聞く → 読む の 順で 使うと 力が つくよ',
  steps:[
   ['m','smile','学習者向けに やさしい 英語で 書かれた ニュースが ネット上に たくさん あるよ。音声つきの ものも 多い'],
   ['m','think','1本 10分の 使い方', '<ol class="fz-steps"><li>見出しを 読んで 中身を 予想（日本語で OK）</li><li>音声だけ 聞く（分かった ことを メモ）</li><li>本文を 読む（知らない 語は 3つまで 調べる）</li><li>もう一度 聞く（さっきより 分かる？）</li><li>1文で まとめる：This news is about 〜.</li></ol>'],
   ['m','think','日本の ニュースを えらぶと 背景を 知っているから 分かりやすいよ'],
   ['m','proud','毎日 1本で 1年 365本。世界の ことも 英語も いっしょに 身に つくね'],
  ],
  quiz:[
   {q:'最初に するのは？',o:['見出しで 中身を 予想','全部の 単語を 調べる'],a:0},
   {q:'最後に まとめる 文は？',o:['This news is about 〜.','I don\'t know.'],a:0},
  ]},

/* ハイレベル */
 {id:'adv-clil', lv:'adv', cat:'yarikata', t:'英語で 算数・理科を 学ぶ', key:['CLIL','算数','理科','語彙'],
  tip:'知っている 算数や 理科を 英語で 学ぶと、中身が 分かるぶん 英語に 集中できるよ。3 plus 4 equals 7 から 始めよう',
  steps:[
   ['m','smile','英語を 「勉強する」だけじゃなく、英語 「で」 何かを 学ぶ。これも 世界で 使われて いる 方法だよ'],
   ['m','think','算数の 言い方', '<table class="fz-table"><tr><td>3 ＋ 4 ＝ 7</td><td>Three <b>plus</b> four <b>equals</b> seven.</td></tr><tr><td>9 − 2 ＝ 7</td><td>Nine <b>minus</b> two equals seven.</td></tr><tr><td>3 × 5 ＝ 15</td><td>Three <b>times</b> five equals fifteen.</td></tr><tr><td>8 ÷ 2 ＝ 4</td><td>Eight <b>divided by</b> two equals four.</td></tr></table>'],
   ['m','think','理科なら：Water boils at 100 degrees.（水は 100度で ふっとうする） / The moon goes around the earth.'],
   ['m','proud','好きな 教科の 英語動画や 図鑑を 見て みよう。知っている 内容だから、知らない 英語も 推測しやすいよ'],
  ],
  quiz:[
   {q:'3 × 5 の 「×」は？',o:['times','plus','minus'],a:0},
   {q:'8 ÷ 2 の 「÷」は？',o:['divided by','times'],a:0},
  ]},
);

/* 新しく ふえた 授業（ミナ先生が 「ふえたよ」と 教える） */
const LESSON_NEW=['es-i-spy','es-weather','es-aizuchi','jh-bored-boring','jh-negative-q','jh-indirect-q','jh-tag-q','jh-if-present','jh-teen-ty','jh-long-short','jh-a-piece-of','jh-ordinal','jh-ask-again','jh-keep-talking','hs-rise-raise','hs-between-among','hs-n-ng','hs-body-idioms','hs-easy-news','adv-clil'];

/* 学び方の 授業の 「ひとくち コツ」。ミナ先生が ふだんの おしゃべりで 思い出させて くれる（game/mina-sense.js の x_tip〜） */
(()=>{const TIPS={
 'es-recall-cover':'ことばは なんども 見るより、かくして おもいだす ほうが ずっと のこるよ',
 'es-sleep':'ねる まえに 3つだけ ふくしゅうして ぐっすり ねると、あさには あたまが せいり してくれて いるよ',
 'es-gesture':'うごきの ことばは からだを うごかしながら いうと おぼえやすいよ。jump なら ジャンプ！',
 'es-katakana-trap':'ホッチキスは stapler。カタカナの ことばは 「えいごでも おなじ？」って しらべる くせを つけよう',
 'es-rhythm':'banana は まんなかの NA を つよく。えいごは つよい ところが 1つ あるんだ',
 'es-question-up':'Yes・No で こたえる しつもんは さいごを あげて、What の しつもんは さげるよ',
 'jh-study-map':'英語が のびる コツは 思い出す・間を あける・まぜる・かたまり・声・たくさん ふれる・使う の 7つ',
 'jh-test-effect':'教科書を 3回 読むより、とじて 書き出す 小テストを 1回 した ほうが 1週間後に のこるよ',
 'jh-interleave':'過去形だけ・進行形だけ より、まぜて 練習した ほうが 本番に 強く なるよ',
 'jh-keyword':'覚えにくい 単語は 音の にた 日本語で へんてこな 場面を 作ると 忘れにくいよ',
 'jh-chunk':'How about 〜? や I\'m looking for 〜 の ような かたまりを 覚えると、1語 かえるだけで いろいろ 言えるよ',
 'jh-dictation':'聞いた 英語を 書き取ると、「なんとなく 分かった」の 中の 聞きのがしが はっきり 見えるよ',
 'jh-minimal-pair':'ship と sheep の ように 1つの 音だけ ちがう ペアで 練習すると 耳が よく なるよ',
 'jh-word-family':'-tion・-ness は 名詞、-ful・-ous は 形容詞。単語の おしりで 品詞が 分かるよ',
 'hs-leitner':'正解した カードは 右の 箱へ、まちがえたら 箱1へ。苦手な カードほど よく 出る しくみだよ',
 'hs-slash-reading':'英文は 意味の かたまりごとに / を 入れて、前から 順に 意味を とると 速く 読めるよ',
 'hs-skim-scan':'長文は 設問を 先に 読んで、ざっと つかむ → ほしい 情報を さがす の 2段階で 読もう',
 'hs-stress-timed':'英語は 強い 音が ほぼ 同じ 間隔で 来る。the や will は その 間で 弱く 速く なるよ',
 'hs-core-prep':'on は 「上」じゃ なくて 「くっつく」。かべの 絵も 天井の ハエも on だよ',
 'hs-dictionary':'辞書は 1つめの 意味だけで 閉じないで、語法と 例文まで 見ると 使える 単語に なるよ',
 'adv-input-level':'多読は 知らない 語が 1ページに 4こ くらいまでの 本が ちょうどいいよ',
 'adv-four-strands':'インプット・アウトプット・ことばの 勉強・流ちょうさの 練習、この 4つを だいたい 同じ くらいずつ やろう',
 'adv-432':'同じ 話を 4分 → 3分 → 2分で 3回 話すと、つかえずに 話せる ように なるよ',
 'adv-notice-gap':'話して いて 言えなかった ことは メモして 調べて、次の 日に わざと 使おう',
 'adv-if-then':'「歯みがきの あとに 単語5つ」の ように、いつもの 行動に くっつけると 続くよ',
 'adv-elaboration':'覚える ときに 「なぜ？」と 自分に 聞くと、知っている ことと つながって 忘れにくいよ',
 'adv-guess-first':'答えを 見る 前に 自分の 予想を 決めて おくと、まちがえても よく 覚えられるよ',
 'es-magic-e':'おしりの e は だまって いるけど、cap を cape（ケイプ）に かえる まほうつかいだよ',
 'es-sh-ch-th':'sh は 「シーッ」の おと、ph は f と おなじ おと。2もじで 1つの おとに なるよ',
 'es-f-v':'f と v は うえの まえばを したの くちびるに かるく のせて いうよ',
 'es-word-web':'まんなかに テーマを かいて なかまの ことばを まわりに かくと、つられて おもいだせるよ',
 'es-opposites':'big と small、hot と cold。はんたいことばは ペアで おぼえると おとくだよ',
 'es-compound':'sunflower は sun と flower の くっつき ことば。ながい ことばは わけて みよう',
 'es-sing':'うたは まず なんども きいて、しってる ことばを さがす ところから はじめよう',
 'jh-schwa':'英語で いちばん 多い 母音は 力を ぬいた 弱い 「ァ」。about の a が それだよ',
 'jh-no-extra-vowel':'dog は 「ド・ッ・グ」じゃなくて 1つの 音。最後の 子音に 母音を つけないのが コツ',
 'jh-memory-palace':'自分の 家の 部屋に 単語を 1つずつ 置いて いくと、順番ごと 覚えられるよ',
 'jh-look-see-watch':'see は 目に 入る、look は 目を 向ける、watch は 動く ものを 見つづける',
 'jh-come-go':'呼ばれて 「今 行く！」は I\'m coming!。come は 相手の ところへ 近づく ことだよ',
 'jh-mirror-order':'英語の 順番は 「だれが → する → 何を → どこで → いつ」。場所は 時より 先だよ',
 'jh-read-look-up':'1文 読んだら 顔を 上げて、文を 見ずに 言う。これで 音読が 話す 力に なるよ',
 'jh-diary-3':'日記は Today I 〜. It was 〜. Tomorrow I will 〜. の 3行で じゅうぶんだよ',
 'hs-four-a':'cat・cup・hot・about、英語の 「ア」は 口の 開き方で 少なくとも 4つ あるよ',
 'hs-flap-t':'water が 「ワーラー」に 聞こえるのは、母音に はさまれた t が ラ行に 近く なるからだよ',
 'hs-say-tell':'tell は すぐ 後ろに 人が 来る。He told me 〜 は OK、He said me 〜 は ×',
 'hs-adj-order':'形容詞は 意見 → 大きさ → 古さ → 形 → 色 → 出身 → 材料 の 順。a nice big red ball',
 'hs-sentence-mining':'好きな 作品から 「知らない ところが 1つだけ」の 文を 集めて カードに しよう',
 'hs-pomodoro':'25分 集中して 5分 休む。スマホは 別の 部屋に 置いて おこう',
 'adv-tense-grid':'英語の 時制は 「いつ 3つ」×「見え方 4つ」で 12通り。表の どこかで 考えよう',
 'adv-word-iceberg':'単語を 知るって 意味だけ じゃない。発音・セットの 語・語法まで 見ると 使えるよ',
 'adv-subtitles':'映画は 同じ 5分を 日本語字幕 → 英語字幕 → 字幕なし の 3回で 見よう',
 'adv-retelling':'読んだ 話を キーワード 3〜5こ だけ 見て 1分で 話し直すと、自分の 英語に なるよ',
 'adv-can-do':'目標は 「ペラペラ」より 「道を 聞かれて 答えられる」の ように できる ことで 決めよう',
 'adv-plateau':'のびない 時期は 力が たまって いる 時期。英語の のびは 坂道じゃ なくて 階段だよ',
 'es-clock':'3:30 は half past three。past は 「すぎて」、to は 「〜まで あと」だよ',
 'es-animal-sounds':'えいごの ぶたは oink、かえるは ribbit。なきごえも くにで かわるんだ',
 'es-sound-words':'splash や buzz は おとの ことばで、そのまま うごきの ことばにも なるよ',
 'jh-ed-sound':'-ed は t・d の あとは 「イド」、のどが ふるえない 音の あとは 「ト」、それ以外は 「ド」',
 'jh-s-sound':'cats は 「ス」、dogs は 「ズ」、buses は 「イズ」。s も 前の 音で 3つに 分かれるよ',
 'jh-contraction':'will not を ちぢめると won\'t。willn\'t じゃ ないから 気を つけてね',
 'jh-few-little':'a few は 「少し ある」、few は 「ほとんど ない」。a が あるか ないかで 気持ちが かわるよ',
 'jh-some-any':'すすめる ときは 疑問文でも some。Would you like some tea? だよ',
 'jh-by-until':'by は しめきり（その時までに 1回）、until は その時まで ずっと',
 'jh-polite-stairs':'たのむ ときに 迷ったら Could you 〜? を 使えば だいたい 安心だよ',
 'jh-big-numbers':'英語は 3けたごとに 名前が かわる。1万は ten thousand、100万は a million',
 'jh-proverbs':'Seeing is believing. は 百聞は 一見に しかず。ことわざは 文の 形ごと 覚えられるよ',
 'jh-mistake-note':'まちがいノートは 「まちがい・正しい・なぜ？」の 3らん。いちばん 大事なのは なぜ？',
 'hs-stress-shift':'REcord は 名詞、reCORD は 動詞。名詞は 前、動詞は 後ろを 強く 読む ことが 多いよ',
 'hs-did-you':'Did you は 「ディジュ」、going to は 「ガナ」に 聞こえる。書く ときは もとの 形でね',
 'hs-make-let-have':'let は 許す、have は してもらう、make は むりやり させる。どれも 後ろは 人 ＋ 動詞の 原形',
 'hs-for-during':'for の 後ろは 数字の 長さ、during の 後ろは 出来事の 名前。for three days / during the summer',
 'hs-voice-check':'スマホの 音声入力で 英語を 話して、ちゃんと 文字に なれば 発音は 通じて いるよ',
 'adv-reading-log':'多読は 冊数より 語数で 記録すると、成長が 目に 見えるよ',
 'adv-my-phrases':'自己紹介・しゅみ・毎日の ことを 先に 英語に して おくと、会話で 困らないよ',
};
LESSONS.forEach(l=>{if(!l.tip&&TIPS[l.id])l.tip=TIPS[l.id]})})();
