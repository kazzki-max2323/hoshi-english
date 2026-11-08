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
