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
