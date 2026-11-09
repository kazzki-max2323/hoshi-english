/* ミナ先生と 英語で 話す（game/sensei.js）の 中身 その1: まちがいの 種類・書いた 英語の チェック・ことばの 入れかえ・文法ドリル。
   - SENSEI_ERR:   まちがいの 種類 → [文法ノートの id, ヒント（1回目）, 解説（2回目）]
   - SENSEI_CHECK: 自分で 書いた 英語に よく ある まちがいを 見つける [まちがいの 種類, 正規表現, レベル(この レベルから 見る)]
   - SENSEI_SLOT:  会話・ドリルの {food} {v_s} などに 入る ことば（毎回 ちがう ことばが 入る）
   - SENSEI_DRILL: 文法ノートの id → ミナ先生が 会話に まぜる ひとこと 質問（いまの レベルの 文法）
   場面（ながい 会話）は game/sensei-scenes.js。文法ノートを 足したら ここにも ドリルと まちがいを 足す */
const SENSEI_ERR={
 /* 小学生 */
 caps:['es_abc','「わたし」の I は いつも 大文字だよ。 文の 1文字目も 大文字にしよう','英語の I（わたし）は 文の どこでも 大文字。 文の さいしょの 文字も 大文字で 書くよ'],
 beI:['es_be','I の あとに つづく be動詞は どれだったかな？','「わたしは 〜です」は <b>I am 〜</b>。 I の ときは かならず am（I\'m）。 is や are は つかわないよ'],
 beYou:['es_be','You の あとの be動詞は？ am・is・are の どれかな','「あなたは 〜です」は <b>You are 〜</b>。 you の ときは いつも are（You\'re）'],
 beHe:['es_heshe','He / She の あとの be動詞を 思いだしてみて','He（彼）・She（彼女）・ひとりの 人や もの には <b>is</b>。 He is 〜 / She is 〜'],
 likeS:['es_like','I の ときの like の 形、 よーく 見てみて','I like 〜 の like には s を つけないよ。 s が つくのは He / She の とき（中学で ならう）'],
 wantS:['es_want','I の ときの want の 形、 よーく 見て','I want 〜 の want には s を つけないよ。 s が つくのは He / She の とき（中学で ならう）'],
 doQ:['es_like','「〜は すき？」と きく ときは、 文の 頭に なにか つけるよ','「〜は すき？」は <b>Do you like 〜?</b>。 文の 頭に Do を おくと 質問に なるよ'],
 plural:['es_plural','2つ いじょう ある ときの ことばの おわり、 わすれてない？','2つ いじょうは ことばの おわりに <b>s</b>。 two cats、 three apples。 1つなら a cat'],
 canTo:['es_can','can の すぐ あとの うごきの ことば、 形を 見てみて','<b>can ＋ うごきの ことば（そのままの 形）</b>。 can to swim や can swims は ×。 I can swim. が ○'],
 wantTo:['es_dream','「〜に なりたい」は want の あとに 2つの ことばが 入るよ','「〜に なりたい」は <b>I want to be 〜</b>。 want と be の あいだに to が いるよ'],
 howMany:['es_howmany','How many の あとの ことば、 数が 多い ときの 形だよ','How many の あとは <b>複数の 形（s つき）</b>。 How many dogs? How many shells?'],
 pastGo:['es_past','きのうの ことだよ。 「行った」の 形は？','すぎた ことは 形が かわる。 go → <b>went</b>、 eat → <b>ate</b>、 see → <b>saw</b>。 goed とは 言わないよ'],
 place:['es_place','in・on・under、 どこに あるか 絵を 思いうかべて','<b>in</b> ＝ 〜の 中、 <b>on</b> ＝ 〜の 上（くっついて）、 <b>under</b> ＝ 〜の 下'],
 way:['es_way','右と 左、 もう一度 たしかめてみて','<b>turn right</b> ＝ 右に まがる、 <b>turn left</b> ＝ 左に まがる、 <b>go straight</b> ＝ まっすぐ'],
 timeAt:['es_time','時こくの 前に つく ことば、 なんだったかな？','時こくは <b>at</b>：at seven。 曜日は <b>on</b>：on Sunday'],
 thisThat:['es_this','近くかな？ 遠くかな？','近くの ものは <b>this</b>、 遠くの ものは <b>that</b>。 これ ＝ this、 あれ ＝ that'],
 /* 中学生 */
 be3:['jh_be','主語を よく 見て。 1人？ 2人いじょう？','be動詞は 主語で きまる：<b>I am / you・we・they are / he・she・it is</b>'],
 s3:['jh_3s','主語が He / She / It の とき、 動詞に なにか つかない？','<b>三人称単数現在の s</b>：He / She / It / 1人の 人が 主語で、 いまの ことを 言う ときは 動詞に s（es）。 He likes、 She goes、 It has'],
 s3do:['jh_3s','does を つかったら、 あとの 動詞は もとの 形に もどるよ','Does he like 〜? の ように、 <b>does / doesn\'t の あとは 動詞の 原形</b>。 s は does が もってるの'],
 doNeg:['jh_do','「〜しない」には 動詞の 前に 助っ人が いるよ','一般動詞の 否定は <b>don\'t / doesn\'t ＋ 原形</b>。 I not like は ×、 I don\'t like が ○。 He の ときは doesn\'t'],
 doQ2:['jh_do','一般動詞の 質問は 文の 頭に なにを おく？','一般動詞の 疑問文は <b>Do / Does ＋ 主語 ＋ 原形 〜?</b>。 Are you like 〜? は ×'],
 pluralX:['jh_plural','この 名詞は s を つけない とくべつな 形に なるよ','とくべつな 複数形：child → <b>children</b>、 man → <b>men</b>、 woman → <b>women</b>、 foot → <b>feet</b>、 tooth → <b>teeth</b>、 fish → fish'],
 pron:['jh_pron','「わたしの」「わたしを」…形が かわる ことば だよ','代名詞の 形：<b>I（は） / my（の） / me（を・に） / mine（の もの）</b>。 he → his → him、 she → her → her'],
 imp:['jh_imp','「〜しよう」「〜しないで」の 文の 形を 思いだして','命令文は <b>動詞の 原形から</b> はじめる。 「〜しないで」は Don\'t ＋ 原形、 「〜しよう」は Let\'s ＋ 原形'],
 prog:['jh_prog','「いま 〜している」は be動詞と ing の セットだよ','現在進行形は <b>am / is / are ＋ 〜ing</b>。 I playing も I am play も ×。 I am playing が ○'],
 wh:['jh_wh','疑問詞の あとに 疑問文の 形を つづけてみて','疑問詞の 文は <b>疑問詞 ＋ 疑問文</b>。 Where you live? → <b>Where do you live?</b>'],
 past1:['jh_past1','きのうの ことなら 動詞の 形は？','すぎた ことは 過去形。 ふつうの 動詞は <b>-ed</b> を つける：play → played、 watch → watched、 study → studied'],
 past2:['jh_past2','この 動詞は ed じゃない、 とくべつな 過去形だよ','不規則動詞は 形を 丸ごと おぼえる：go → <b>went</b>、 eat → <b>ate</b>、 see → <b>saw</b>、 buy → <b>bought</b>、 swim → <b>swam</b>'],
 didPast:['jh_past2','did が あったら、 あとの 動詞は どう なる？','<b>did / didn\'t の あとは 原形</b>。 過去の しるしは did が もってるよ。 Did you go? ○ ／ Did you went? ×'],
 pastProg:['jh_pastprog','「そのとき 〜していた」は was / were と ing だよ','過去進行形は <b>was / were ＋ 〜ing</b>。 I was play は ×、 I was playing が ○'],
 will:['jh_future','will の あとの 形、 to は いるかな？','<b>will ＋ 原形</b>：I will go.（to は いらない、 s も つかない）。 be going to ＋ 原形 も おなじ 意味'],
 goingTo:['jh_future','going to の 前に なにか 足りないよ','<b>be going to ＋ 原形</b>：I\'m going to swim.　be動詞（am / is / are）を わすれずに'],
 modal:['jh_modal','助動詞の あとの 動詞の 形、 たしかめて','助動詞（can / may / must / should）の あとは <b>原形</b>。 must to や should goes は ×。 have to だけは to が つく'],
 there:['jh_there','あとに くる ものが 1つ？ 2ついじょう？','<b>There is ＋ 1つの もの</b>、 <b>There are ＋ 2ついじょう</b>。 There are two shops. ／ There is a cafe.'],
 inf:['jh_inf','want の あとに うごきを つづける ときは？','「〜したい」は <b>want to ＋ 原形</b>。 hope to、 need to、 decide to も おなじ 形'],
 ger:['jh_ger','enjoy や finish の あとは ing が すきな 動詞だよ','<b>enjoy / finish / stop の あとは 〜ing</b>：I enjoyed swimming.　enjoy to swim は ×'],
 comp:['jh_comp','比べる ときの 形、 er と more を いっしょに つかってないかな','比較級は <b>短い ことば ＋ er</b>（bigger）か <b>more ＋ 長い ことば</b>（more beautiful）。 more bigger は ×。 than を わすれずに'],
 sup:['jh_comp','「いちばん」は the と est の セットだよ','最上級は <b>the ＋ 〜est</b>（the biggest）か <b>the most ＋ 長い ことば</b>'],
 passive:['jh_passive','「〜される」は be動詞と 過去分詞の セットだよ','受け身は <b>be動詞 ＋ 過去分詞</b>：English is spoken. This was made by Gen.　is speak は ×'],
 perf:['jh_perfect','have の あとの 動詞は 過去分詞だよ','現在完了は <b>have / has ＋ 過去分詞</b>。 go → gone、 see → seen、 eat → eaten、 be → been。 have went は ×'],
 perfTime:['jh_perfect','yesterday や ago と いっしょに 現在完了は つかえるかな？','yesterday、 last 〜、 〜 ago の ような 「すぎた 時」を はっきり 言う ときは <b>過去形</b>。 現在完了は つかえないよ'],
 perfProg:['jh_perfprog','ずっと 〜し つづけている は have been 〜ing だよ','現在完了進行形は <b>have / has been ＋ 〜ing</b>：I have been waiting for an hour.'],
 conj:['jh_conj','2つの 文を つなぐ ことば、 意味に あってる？','<b>because</b> ＝ なぜなら、 <b>if</b> ＝ もし、 <b>when</b> ＝ 〜とき、 <b>but</b> ＝ でも、 <b>so</b> ＝ だから'],
 rel:['jh_rel','人の ときと ものの ときで つかう ことばが ちがうよ','関係代名詞：<b>人 → who</b>、 <b>もの・動物 → which</b>、 どちらも <b>that</b> で OK。 the man which は ×'],
 part:['jh_part','boring と bored、 どっちが 「たいくつさせる」で どっちが 「たいくつしている」？','<b>〜ing ＝ 〜させる（もの・人の せいしつ）</b>、 <b>〜ed ＝ 〜させられた（気もち）</b>。 I am bored.（たいくつ） ／ The movie is boring.（つまらない 映画）'],
 indq:['jh_indq','文の 中に 入った 疑問文は、 ふつうの 文の じゅんばんに なるよ','間接疑問文は <b>疑問詞 ＋ 主語 ＋ 動詞</b>。 I know where is it. は ×、 <b>I know where it is.</b> が ○'],
 subj:['jh_subj','じっさいとは ちがう「もしも」の 話だよ。 形を 過去に','仮定法過去：<b>If I were 〜, I would 〜</b>。 じっさいと ちがう ことは 1つ 過去に ずらす。 I wish I were 〜 も おなじ'],
 svoo:['jh_svoo','「人に ものを あげる」の じゅんばんを 思いだして','<b>give / show / tell ＋ 人 ＋ もの</b>：Give me the shell.　to を つかうなら Give the shell to me.'],
 prep:['jh_prep','曜日・月・時こくで 前置詞が ちがうよ','<b>at</b> ＋ 時こく（at six）、 <b>on</b> ＋ 曜日・日付（on Monday）、 <b>in</b> ＋ 月・年・季節（in July）'],
 art:['jh_art','あとの ことばの 音が a・i・u・e・o で はじまる ときは？','母音（ア・イ・ウ・エ・オの 音）の 前は <b>an</b>：an apple、 an egg、 an hour。 a apple は ×'],
 /* 高校生 */
 hsTense:['hs_tense','どっちの できごとが 先？ もっと 前の ことは had で','過去の ある時より もっと 前の ことは <b>過去完了 had ＋ 過去分詞</b>：When I arrived, the bus had left.'],
 modPerf:['hs_modperf','過去の ことを 推測する ときは 助動詞 ＋ have ＋ 過去分詞','<b>must have 〜ed</b>（〜したに ちがいない）、 <b>may have 〜ed</b>（〜したかも）、 <b>should have 〜ed</b>（〜すべきだったのに）。 must have go は ×、 must have gone'],
 passive2:['hs_passive2','受け身と 進行形・完了形を あわせると？','<b>is being 〜ed</b>（〜されている 最中）、 <b>has been 〜ed</b>（〜されてしまった）、 <b>can be 〜ed</b>（〜されうる）'],
 inf2:['hs_inf2','目的を 言う ときは to ＋ 原形 だよ','目的「〜するために」は <b>to ＋ 原形</b> / <b>in order to ＋ 原形</b>。 for to や for 〜ing は ×'],
 ginf:['hs_ginf','remember to と remember 〜ing、 意味が ちがうよ','<b>remember to 〜</b> ＝ わすれずに 〜する（これから）、 <b>remember 〜ing</b> ＝ 〜したのを おぼえている（すんだ こと）。 forget・stop も おなじ'],
 partc:['hs_partc','主語が 同じ ときは 〜ing で 文を はじめられるよ','分詞構文：<b>Walking on the beach, I found a shell.</b>（浜辺を 歩いて いると）。 主語と ing の うごきが あっているか 見る'],
 rel2:['hs_rel2','先行詞（前の 名詞）が ない ときは what だよ','<b>what ＝ 〜する こと / もの</b>（先行詞なし）。 the thing which ＝ what。 This is what I wanted. ／ the thing what は ×'],
 relAdv:['hs_reladv','場所の あとで 文が 完全なら、 where を つかうよ','関係副詞：<b>場所 → where</b>、 <b>時 → when</b>、 <b>理由 → why</b>。 the town which I live は ×、 the town <b>where</b> I live（＝ in which I live）'],
 comp2:['hs_comp2','「〜すれば するほど」は the 比較級, the 比較級','<b>The more you practice, the better you get.</b>　the を 2つ、 比較級を 2つ'],
 subj2:['hs_subj2','過去の じっさいと ちがう 話は もう1つ 過去へ','仮定法過去完了：<b>If I had 〜ed, I would have 〜ed.</b>　過去の「もしも」は had と would have の セット'],
 speech:['hs_speech','言われた ことを 伝える ときは 時制と 代名詞が ずれるよ','間接話法：He said, "I am tired." → <b>He said (that) he was tired.</b>　時制を 1つ 過去へ、 I → he'],
 seq:['hs_seq','前の 動詞が 過去なら、 うしろも 過去に あわせるよ','時制の一致：<b>I thought (that) she was busy.</b>　主節が 過去なら that の 中も 過去（was / would / had 〜ed）'],
 emph:['hs_emph','強調構文は It is 〜 that … の 形だよ','<b>It was Sora that broke the window.</b>（窓を 割ったのは ソラだった）。 強めたい ところを It is と that で はさむ'],
 neg:['hs_neg','not all と all not、 意味が ちがうよ','部分否定：<b>not all</b> ＝ ぜんぶが 〜とは かぎらない、 <b>not always</b> ＝ いつも 〜とは かぎらない'],
 caus:['hs_caus','make / let / have の あとは 人 ＋ 原形 だよ','使役動詞：<b>make / let / have ＋ 人 ＋ 原形</b>（to は いらない）。 make me to cry は ×、 make me cry。 get だけは get 人 to 〜'],
 s5:['hs_5','make / keep の あとは 人 ＋ ようす（形容詞）だよ','SVOC：<b>make 人 happy</b>（人を 〜に する）、 <b>keep 物 clean</b>。 happily（副詞）は ×'],
 conj2:['hs_conj2','意味を 考えて：「〜だけど」？「〜しない かぎり」？','<b>although</b> ＝ 〜だけれど、 <b>unless</b> ＝ 〜しない かぎり、 <b>as soon as</b> ＝ 〜すると すぐ、 <b>even if</b> ＝ たとえ 〜でも、 <b>so that</b> ＝ 〜できるように'],
 quant:['hs_quant','数えられる？ 数えられない？','数えられる 名詞（books）は <b>many / few / a few</b>、 数えられない 名詞（water, time）は <b>much / little / a little</b>。 a few ＝ 少し ある、 few ＝ ほとんど ない'],
 noun:['hs_noun','もの（無生物）を 主語に すると すっきり 言えるよ','無生物主語：<b>The news made me happy.</b>（その 知らせで うれしく なった）。 This road takes you to the beach.（この道を 行けば 浜辺に 着く）'],
 ellip:['hs_ellip','同格の that は「〜という」 だよ','<b>the fact that 〜</b> ＝ 〜という 事実、 <b>the idea that 〜</b> ＝ 〜という 考え。 the fact which 〜 は ×（that の あとが 完全な 文）'],
};

/* 自分で 書いた 英語の チェック: [まちがいの 種類, 正規表現, 見はじめる レベル]。上から じゅんに 見る */
const SENSEI_CHECK=[
 ['beI',/\bI\s+(is|are)\b/i,'es'],
 ['thisThat',/\b(this|that)\s+are\b/i,'es'],
 ['wantS',/\bI\s+wants\b/i,'es'],
 ['wantTo',/\bwant to\s+(a|an)\s/i,'es'],
 ['howMany',/\bhow much\s+(dogs|cats|books|shells|apples|birds|friends|brothers|sisters|pens|balls|stars|cookies)\b/i,'es'],
 ['timeAt',/\b(get up|go to bed|wake up|start|leave|meet|eat lunch|eat dinner)\s+(on|in)\s+(one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|\d)/i,'es'],
 ['doQ',/^(you|they)\s+like\s+[^?]*\?\s*$/i,'es'],
 ['past1',/\b(I|you|he|she|we|they)\s+(play|watch|cook|clean|study|walk|listen|visit|stay|enjoy|talk|dance|want|like|help)\b[^.?!]*\b(yesterday|last (night|week|weekend|year|sunday|saturday|summer|month)|ago)\b|\b(playd|watchd|cookd|cleand|studyed|walkd|listend|visitd|stayd|enjoyd)\b/i,'jh'],
 ['pastGo',/\b(I|you|he|she|we|they)\s+(go|eat|swim|see|buy|make|write|take|catch|come|get|have|run|play|watch|visit)\b[^.?!]*\b(yesterday|last (night|week|weekend|year|sunday|saturday|summer|month)|ago)\b/i,'es'],
 ['beYou',/\byou\s+(is|am)\b/i,'es'],
 ['beHe',/\b(he|she|it)\s+(are|am)\b/i,'es'],
 ['be3',/\b(we|they)\s+(is|am)\b/i,'es'],
 ['likeS',/\bI\s+likes\b/i,'es'],
 ['wantTo',/\bwants?\s+be\b/i,'es'],
 ['canTo',/\b(can|can't|cannot)\s+to\s+\w+|\bcan\s+(swims|runs|plays|eats|goes|cooks|sings|dances|jumps|flies|reads|writes|speaks)\b/i,'es'],
 ['pastGo',/\b(goed|eated|runned|swimmed|buyed|catched|teached|thinked|comed|taked|maked|writed|drinked|sleeped|singed|haved|getted|knowed|finded|sitted|telled|sayed|gived|leaved|meeted|feeled|heared|losed|breaked|falled|flyed|wined)\b/i,'es'],
 ['plural',/\b(two|three|four|five|six|seven|eight|nine|ten|many|some|a lot of)\s+(cat|dog|book|apple|shell|bird|crab|friend|ball|pen|star|car|cookie|egg|flower|orange|banana|sister|brother|hour|day|year|game|song|boat|wave)\b(?!s)/i,'es'],
 ['howMany',/\bhow many\s+(cat|dog|book|apple|shell|bird|crab|friend|ball|pen|star|car|cookie|egg|flower|brother|sister|hour|day|year)\b(?!s)/i,'es'],
 ['caps',/(^|[.!?]\s+|\s)i(\s|'m|$)/,'es'],
 ['s3do',/\b(does|doesn't)\s+(he|she|it|\w+)?\s*(likes|plays|goes|has|wants|lives|eats|watches|knows|swims|needs|studies|reads|speaks|works)\b/i,'jh'],
 ['didPast',/\b(did|didn't)\s+(\w+\s+)?(went|ate|saw|came|got|made|took|bought|swam|found|ran|wrote|played|watched|visited|cooked|liked|wanted|enjoyed|studied|lived)\b/i,'jh'],
 ['s3',/(^|[.!?,]\s*|\band\s+|\bbut\s+|\bbecause\s+|\bso\s+)(he|she|it|my (mother|father|sister|brother|friend|dog|cat|teacher))\s+(like|play|go|have|want|live|eat|watch|study|know|speak|need|read|swim|work|cook|make|get|love|walk|take|come|run|sing|think|teach|do|drink|sleep|write|buy|wake|clean|listen|visit)\b/i,'jh'],
 ['doNeg',/\b(I|you|we|they)\s+not\b(?!\s+(only|just|yet))|\b(he|she|it)\s+don't\b/i,'jh'],
 ['doQ2',/^(are|is)\s+(you|he|she|they)\s+(like|have|know|want|play|go|eat|live|need|speak)\b/i,'jh'],
 ['pluralX',/\b(childs|mans|womans|foots|tooths|mouses|fishes)\b/i,'jh'],
 ['wh',/^(where|what|when|how|why)\s+(you|he|she|they|we)\s+(live|go|like|want|do|play|eat|study|work|have|need|think)\b|^(where|what|when|why)\s+are\s+you\s+(live|go|like|want|play|eat|study|work|have)\b|^(when|where|what)\s+(your|his|her|my)\s+\w+\s+(is|are)\s*\?/i,'jh'],
 ['imp',/^you\s+(careful|quiet)\b|\bdon't\s+(swims|runs|goes|plays|eats|is|are|be\s+to)\b/i,'jh'],
 ['passive',/\b(is|are|was|were)\s+\w+ing\s+by\s+(\w+)/i,'jh'],
 ['perfProg',/\bbeen\s+(study|play|wait|work|swim|read|watch|run|walk|live|sleep|learn)\b/i,'jh'],
 ['pron',/\b(me|him)\s+(name|house|dog|cat|friend|bag)\b|\bme\s+(am|is|like|want|go|have)\b/i,'jh'],
 ['prog',/(?<!\b(am|is|are|was|were|do|did|does)\s)\b(I|he|she|we|they|you)\s+(?!bring|sing|swing|thing|nothing|something|anything|everything|king|ring|spring|string)\w{2,}ing\b(?!\s+(is|was))|\b(is|are|am)\s+(dig|eat|run|swim|cook)\b|\bI\s+(playing|going|eating|swimming|reading|studying|watching|running|making|cooking|walking|sleeping|looking|waiting|listening|doing)\b|\b(am|is|are|'m|'re)\s+(play|eat|swim|read|study|watch|run|cook|walk|sleep|wait|listen)\b(?!s)/i,'jh'],
 ['pastProg',/\b(was|were)\s+(play|eat|swim|read|study|watch|run|cook|walk|sleep|wait|listen|sing)\b/i,'jh'],
 ['will',/\bwill\s+to\s+\w+|\bwill\s+(goes|plays|swims|likes|eats|comes|rains|is|am|are|went|played|sunny|rainy|cloudy|fine|windy)\b/i,'jh'],
 ['goingTo',/(^|[.!?]\s*)(I|you|we|they|he|she)\s+going\s+to\b/i,'jh'],
 ['modal',/\b(must|should|may|might|can|could)\s+to\s+\w+|\b(musts|cans|shoulds)\b|\b(must|should|may|might|can)\s+(goes|plays|swims|studies|eats|sleeps|reads|runs|works|drinks|has|does|went|played)\b/i,'jh'],
 ['there',/\bthere\s+is\s+(two|three|four|five|six|ten|many)\b|\bthere\s+are\s+(a|an|one)\s/i,'jh'],
 ['inf',/\b(want|wants|wanted|need|hope|decided|would like)\s+(go|eat|play|see|swim|buy|drink|watch|read|visit|make|try|learn|study|become|live|travel|ride)\b/i,'jh'],
 ['ger',/\b(enjoy|enjoyed|enjoys|finish|finished|finishes)\s+(to\s+\w+|play|swim|read|watch|cook|run|walk|sing|dance|study|eat|talk)\b/i,'jh'],
 ['comp',/\bmore\s+(better|bigger|smaller|taller|faster|older|younger|hotter|colder|easier|longer|stronger|happier|cheaper|higher|nicer|cuter|warmer|busier)\b|\b(bigger|taller|faster|older|younger|smaller|better|hotter|colder|longer)\s+(as|from|then)\b/i,'jh'],
 ['comp',/\b(big|small|tall|fast|old|young|hot|cold|long|strong|cheap|high|nice|cute|good)\s+than\b/i,'jh'],
 ['sup',/\bthe\s+most\s+\w+est\b|\bmost\s+(biggest|tallest|fastest|best)\b/i,'jh'],
 ['passive',/\b(is|are|was|were)\s+(speak|write|build|make|take|eat|sing|love|use|know|find|catch|see|give|sell|break|steal|paint|cook)\b(?!\s*ing)(?![a-z])/i,'jh'],
 ['perf',/\b(have|has|'ve)\s+(never\s+|ever\s+|already\s+|just\s+)?(went|ate|saw|came|took|wrote|did|swam|ran|spoke|broke|drank|go|eat|see|take|write|swim)\b/i,'jh'],
 ['perfTime',/(?<!\b(must|should|may|might|could|would|can't|cannot)\s)\b(have|has)\s+(\w+ed|been|seen|gone|eaten|done|taken|made|met|had)\b[^.?!]*\b(yesterday|ago|last (night|week|year|month|sunday|summer))\b/i,'jh'],
 ['art',/\ba\s+(apple|egg|orange|umbrella|hour|island|old|idea|ice|elephant|octopus|interesting|easy|eagle|english|onion|ant|answer|artist)\b/i,'jh'],
 ['prep',/\b(in|at)\s+(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b|\bon\s+(january|february|march|april|may|june|july|august|september|october|november|december|summer|winter|spring)\b|\b(in|on)\s+(\d{1,2}|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve)\s*o'clock/i,'jh'],
 ['rel',/\b(man|woman|boy|girl|person|people|teacher|friend|lady|guy)\s+which\b|\b(dog|cat|book|shell|shop|boat|thing|song|movie|cake)\s+who\b/i,'jh'],
 ['part',/\bI(\s+am|'m|\s+was|\s+felt|\s+feel)\s+(very\s+|so\s+|really\s+)?(boring|exciting|interesting|surprising|tiring)\b/i,'jh'],
 ['indq',/\b(know|tell me|wonder)\s+what\s+time\s+is\s+it\b|\b(know|tell me|wonder|remember|understand)\s+(where|what|when|who|why|how)\s+(is|are|was|were|do|does|did|can)\s+(it|he|she|they|you|the\s+\w+)\b/i,'jh'],
 ['subj',/\bif\s+(I|you|he|she|we|they|it)\s+were\b[^.?!]*\bwill\b|\bif\s+I\s+(am|was)\s+\w+[^.?!]*\bwould\b|\bI\s+wish\s+I\s+(am|can|have|will)\b/i,'jh'],
 ['conj',/\bif\b[^.?!]*,\s*so\b|\bbecause\b[^.?!]*,\s*so\b/i,'jh'],
 ['svoo',/\b(give|gave|show|showed|tell|told|send|sent|buy|bought)\s+to\s+(me|him|her|us|them)\s+(a|an|the|some|my|your)\b/i,'jh'],
 ['ginf',/\bremember\s+to\s+\w+[^.?!]*\b(yesterday|last\s+\w+|ago)\b/i,'hs'],
 ['modPerf',/\b(must|should|may|might|could|would)\s+have\s+(go|eat|see|take|forget|leave|do|went|ate|saw|took|forgot|did|came|lose|break|fall|tell|know|say|be|study|play|watch|finish|bring)\b|\b(must|should|may|might)\s+(took|went|ate|saw|forgot|studied|did|came|left|lost|played)\b/i,'hs'],
 ['subj2',/\bif\s+\w+\s+had\s+\w+[^.?!]*\b(will|can)\s+(have\s+)?\w+/i,'hs'],
 ['caus',/\b(make|makes|made|let|lets)\s+(me|you|him|her|us|them|it)\s+to\s+\w+/i,'hs'],
 ['s5',/\b(make|makes|made|keep|keeps|kept)\s+(me|you|him|her|us|them|it)\s+(happily|sadly|angrily|warmly|cleanly|safely|nervously|calmly|quietly)\b/i,'hs'],
 ['passive2',/\bbeing\s+(repair|clean|build|paint|fix|use|make|wash|check)\b|\b(it's|it is)\s+(repairing|cleaning|painting|fixing)\s*[.!]?$/i,'hs'],
 ['inf2',/^for\s+\w+ing\b/i,'hs'],
 ['speech',/\bsaid\s+(me|him|her|us|them)\b/i,'hs'],
 ['neg',/^all\s+(\w+\s+){1,2}(are|is)\s+not\b/i,'hs'],
 ['conj2',/\bunless\s+\w+\s+(doesn't|don't|isn't|aren't|won't|didn't)\b/i,'hs'],
 ['ellip',/\bthe\s+(fact|idea|news)\s+which\s+(I|you|he|she|we|they|\w+)\s+(can|is|was|will|has)\b/i,'hs'],
 ['partc',/^(walked|ran|swam|looked|sat|stood)\s+[^,]*,\s*(I|we|he|she|they)\b/i,'hs'],
 ['hsTense',/\bwhen\s+I\s+\w+ed\b[^.?!]*\b(has|have)\s+(already\s+)?\w+/i,'hs'],
 ['comp2',/^more\s+(I|you|we)\b/i,'hs'],
 ['relAdv',/\b(town|city|place|house|beach|village|room|country)\s+which\s+(I|we|you|he|she|they)\s+(live|lived|was born|grew up|stayed|met)\b(?!\s+(in|at))(?=\s*[.,!?]|\s*$)/i,'hs'],
 ['rel2',/\bthe\s+(thing|things)\s+what\b|\b(this|that|it)\s+is\s+which\s+I\b/i,'hs'],
 ['quant',/\ba few\s+(water|money|time|milk|sand|rain|homework|information|advice)\b|\bmuch\s+(books|friends|people|cars|shells|students|questions|things|times|days|fish)\b|\bmany\s+(water|money|time|information|homework|advice|sand|rain|milk)\b/i,'hs'],
 ['comp2',/\bthe\s+(more|harder|longer|faster|earlier)\b[^,.]*,\s*(more|better|faster|easier)\b/i,'hs'],
 ['inf2',/\bfor\s+to\s+\w+|\bin order\s+(\w+ing)\b/i,'hs'],
 ['seq',/\b(thought|knew|didn't know|did not know|believed|was sure|heard)\s+(that\s+)?(he|she|it|they|you|I)\s+(is|are|am|will|can)\b/i,'hs'],
];

/* 入れかわる ことば。{名前} で さいしょ、{名前_j} で 日本語、{名前_2}… で その ほかの 形。
   名詞: [英語, 日本語, 複数形]。 動詞: [原形, 日本語, 3単現, 過去形, 過去分詞, ing形, まちがいの 過去形] */
const SENSEI_SLOT={
 food:[['pizza','ピザ'],['curry','カレー'],['sushi','おすし'],['ice cream','アイス'],['ramen','ラーメン'],['spaghetti','スパゲッティ'],['shaved ice','かき氷'],['rice balls','おにぎり'],['pancakes','パンケーキ'],['fried chicken','からあげ'],['watermelon','すいか'],['takoyaki','たこやき']],
 sport:[['soccer','サッカー'],['tennis','テニス'],['baseball','野球'],['basketball','バスケ'],['volleyball','バレー'],['table tennis','卓球'],['badminton','バドミントン'],['rugby','ラグビー']],
 animal:[['cat','ねこ','cats'],['dog','犬','dogs'],['crab','カニ','crabs'],['bird','鳥','birds'],['rabbit','うさぎ','rabbits'],['turtle','カメ','turtles'],['dolphin','イルカ','dolphins'],['penguin','ペンギン','penguins'],['seagull','カモメ','seagulls']],
 thing:[['shell','かいがら','shells'],['ball','ボール','balls'],['book','本','books'],['pen','ペン','pens'],['cookie','クッキー','cookies'],['star','星','stars'],['flower','花','flowers'],['boat','ボート','boats'],['stone','石','stones']],
 num:[['two','2'],['three','3'],['four','4'],['five','5'],['six','6'],['seven','7'],['eight','8'],['ten','10']],
 color:[['red','赤'],['blue','青'],['green','緑'],['yellow','黄色'],['pink','ピンク'],['white','白'],['black','黒'],['orange','オレンジ']],
 place:[['the beach','浜辺'],['the park','公園'],['the library','図書館'],['the zoo','動物園'],['the station','駅'],['the aquarium','水族館'],['the shop','お店'],['the museum','博物館']],
 day:[['Monday','月曜日'],['Tuesday','火曜日'],['Wednesday','水曜日'],['Thursday','木曜日'],['Friday','金曜日'],['Saturday','土曜日'],['Sunday','日曜日']],
 job:[['a teacher','先生'],['a doctor','医者'],['a pilot','パイロット'],['a baker','パン屋さん'],['a singer','歌手'],['a soccer player','サッカー選手'],['a vet','じゅう医'],['an astronaut','宇宙飛行士'],['a chef','シェフ'],['a game creator','ゲームクリエイター']],
 /* [主語, 日本語, he/she, 文の 中の 形] */
 who:[['My brother','お兄さん','he','your brother'],['My sister','お姉さん','she','your sister'],['Sora','ソラ','he','Sora'],['Hana','ハナさん','she','Hana'],['Gen','ゲンじい','he','Gen'],['My friend','友だち','she','your friend'],['My dad','お父さん','he','your dad'],['My mom','お母さん','she','your mom']],
 /* 規則動詞 */
 vr:[['play tennis','テニスを する','plays tennis','played tennis','played tennis','playing tennis','playd tennis'],['watch TV','テレビを 見る','watches TV','watched TV','watched TV','watching TV','watchd TV'],['cook dinner','夕ごはんを 作る','cooks dinner','cooked dinner','cooked dinner','cooking dinner','cookd dinner'],
   ['clean my room','部屋を そうじする','cleans my room','cleaned my room','cleaned my room','cleaning my room','cleant my room'],['study English','英語を 勉強する','studies English','studied English','studied English','studying English','studyed English'],['walk on the beach','浜辺を 歩く','walks on the beach','walked on the beach','walked on the beach','walking on the beach','walkd on the beach'],
   ['listen to music','音楽を きく','listens to music','listened to music','listened to music','listening to music','listend to music'],['visit my grandma','おばあちゃんに 会いに 行く','visits my grandma','visited my grandma','visited my grandma','visiting my grandma','visitd my grandma']],
 /* 不規則動詞 */
 vi:[['go to the beach','浜辺に 行く','goes to the beach','went to the beach','gone to the beach','going to the beach','goed to the beach'],['eat curry','カレーを 食べる','eats curry','ate curry','eaten curry','eating curry','eated curry'],['swim in the sea','海で およぐ','swims in the sea','swam in the sea','swum in the sea','swimming in the sea','swimmed in the sea'],
   ['see a dolphin','イルカを 見る','sees a dolphin','saw a dolphin','seen a dolphin','seeing a dolphin','seed a dolphin'],['buy a hat','ぼうしを 買う','buys a hat','bought a hat','bought a hat','buying a hat','buyed a hat'],['make a sand castle','すなの お城を 作る','makes a sand castle','made a sand castle','made a sand castle','making a sand castle','maked a sand castle'],
   ['write a letter','手紙を 書く','writes a letter','wrote a letter','written a letter','writing a letter','writed a letter'],['read a comic','まんがを 読む','reads a comic','read a comic','read a comic','reading a comic','readed a comic'],['take pictures','写真を とる','takes pictures','took pictures','taken pictures','taking pictures','taked pictures'],['catch a fish','魚を つる','catches a fish','caught a fish','caught a fish','catching a fish','catched a fish']],
 /* いまの 時こく（会話の たびに 読む） */
 hnow:()=>{const d=new Date(),h=d.getHours()%12||12,m=d.getMinutes();return [[m?h+':'+String(m).padStart(2,'0'):h+" o'clock",h+'時'+(m?m+'分':'')]]},
 adj:[['big','大きい','bigger','biggest'],['small','小さい','smaller','smallest'],['fast','速い','faster','fastest'],['old','古い','older','oldest'],['tall','高い','taller','tallest'],['long','長い','longer','longest'],['cute','かわいい','cuter','cutest'],['hot','暑い','hotter','hottest']],
 adjL:[['beautiful','きれい'],['popular','人気'],['interesting','おもしろい'],['expensive','高い（ねだん）'],['difficult','むずかしい'],['important','大切'],['famous','有名'],['delicious','おいしい']],
 feel:[['happy','うれしい'],['sad','かなしい'],['tired','つかれた'],['hungry','おなかが すいた'],['sleepy','ねむい'],['excited','わくわく'],['nervous','きんちょう'],['surprised','びっくり']],
};

/* ミナ先生の ひとこと 質問（文法ドリル）。会話の とちゅうに 入る（場面の dr ノード）ほか、「苦手 とっくん」でも つかう。
   D(ミナの 英語, 日本語, [正しい 答え…], [[まちがい, 種類]…], 返事(英), 返事(日))。 {slot} は 毎回 ちがう ことばに なる */
const SENSEI_DRILL=(()=>{const D=(s,j,good,bad,re,rj)=>({s,j,good,bad,re,rj});return {
 es_be:[
  D("Are you a student?","あなたは 生徒ですか？",["Yes, I am.","Yes, I am a student."],[["Yes, I is.",'beI'],["Yes, you are.",0]],"Me too! I'm a student of the sea.","わたしも！ 海の 生徒なの"),
  D("How are you today?","きょうの 調子は？",["I'm {feel}.","I am {feel}."],[["I are {feel}.",'beI'],["You is {feel}.",'beYou']],"I see. Thank you for telling me.","そっか。 教えてくれて ありがとう"),
  D("Tell me about me! Am I kind?","わたしの こと 言って！ わたし やさしい？",["Yes, you are kind.","You are very kind!"],[["Yes, you is kind.",'beYou'],["Yes, I am kind.",0]],"Aww, thank you!","わあ、 ありがとう！")],
 es_this:[
  D("What is this? *holds up a {thing}*","これは なに？（{thing_j}を 見せる）",["It's a {thing}.","This is a {thing}."],[["That are a {thing}.",'thisThat'],["It's a {food}.",0]],"Right! It's a {thing}.","正解！ {thing_j}だよ"),
  D("Look at that, far away! What is that?","あっち、 遠くを 見て！ あれは なに？",["That is a boat.","It's a boat."],[["This is a boat.",'thisThat']],"Yes! That is a boat. Far, far away.","そう！ 遠くの ボートだね")],
 es_like:[
  D("I like {food}. Do you like {food}?","わたし {food_j}が すき。 あなたは？",["Yes, I do.","No, I don't.","Yes, I like {food}."],[["Yes, I likes {food}.",'likeS'],["Yes, I am.",'doQ']],"Nice! Food talk is the best.","いいね！ 食べ物の 話って 最高"),
  D("Ask me about {sport}! Ask if I like it.","{sport_j}が すきか、 わたしに きいて！",["Do you like {sport}?"],[["You like {sport}?",'doQ'],["Are you like {sport}?",'doQ']],"Yes, I do! I play it on Sundays.","うん、 すき！ 日曜日に するの")],
 es_plural:[
  D("How many {animal_2} do you see? I see {num}!","{animal_j}が 何びき 見える？ わたしは {num_j}！",["I see {num} {animal_2}.","{num} {animal_2}!"],[["I see {num} {animal}.",'plural']],"Same! We have good eyes.","おなじ！ 目が いいね"),
  D("I have {num} {thing_2}. What do you have?","わたし {thing_j}を {num_j}つ もってるよ。 あなたは？",["I have two {thing_2}.","I have one {thing}."],[["I have two {thing}.",'plural']],"Let's put them together!","あわせて ならべよう！")],
 es_can:[
  D("Can you swim?","およげる？",["Yes, I can.","No, I can't.","Yes, I can swim."],[["Yes, I can swims.",'canTo'],["Yes, I can to swim.",'canTo']],"Great! The sea is waiting for you.","いいね！ 海が まってるよ"),
  D("Tell me one thing you can do.","できる こと 1つ おしえて",["I can cook.","I can sing.","I can run fast."],[["I can to cook.",'canTo'],["I can sings.",'canTo']],"Wow, cool!","わあ、 かっこいい！")],
 es_want:[
  D("What do you want for lunch?","お昼は なにが いい？",["I want {food}.","{food}, please."],[["I wants {food}.",'wantS'],["I want to {food}.",0]],"{food}! Good choice.","{food_j}！ いいね")],
 es_howmany:[
  D("Ask me how many dogs I have.","わたしが 犬を 何びき かってるか きいて",["How many dogs do you have?"],[["How many dog do you have?",'howMany'],["How much dogs do you have?",'howMany']],"Zero! But I want one.","0ぴき！ でも ほしいな")],
 es_place:[
  D("Where is the cat? It's in the box.","ねこは どこ？ 箱の 中だよ。 — ねこは どこに いる？",["It's in the box.","In the box."],[["It's on the box.",'place'],["It's under the box.",'place']],"Yes! In the box. Cats love boxes.","そう！ 箱の 中。 ねこは 箱が 大すき"),
  D("Where is my hat? It's on the bench!","ぼうしは どこ？ ベンチの 上！ — どこに ある？",["It's on the bench."],[["It's in the bench.",'place'],["It's under the bench.",'place']],"Found it! Thanks.","あった！ ありがとう")],
 es_time:[
  D("What time do you get up?","何時に おきる？",["I get up at seven.","At six thirty."],[["I get up on seven.",'timeAt'],["I get up in seven.",'timeAt']],"Early bird!","早おきだね！"),
  D("What day do you like?","なん曜日が すき？",["I like {day}.","{day}!"],[["I like in {day}.",0]],"{day}? Me too!","{day_j}？ わたしも！")],
 es_heshe:[
  D("Tell me about Sora. Is he kind?","ソラの こと おしえて。 やさしい？",["Yes, he is kind.","He is funny!"],[["Yes, he are kind.",'beHe'],["Yes, she is kind.",0]],"Ha ha, he is! And noisy.","あはは、 そう！ うるさいけど"),
  D("Who is Hana?","ハナさんって だれ？",["She is a shop owner.","She is kind."],[["She are kind.",'beHe'],["He is kind.",0]],"Yes, she makes the best shaved ice.","そう、 かき氷が 最高なの")],
 es_past:[
  D("What did you do yesterday?","きのう なにを した？",["I went to {place}.","I ate {food}.","I played {sport}."],[["I go to {place}.",'pastGo'],["I goed to {place}.",'pastGo']],"Sounds fun!","たのしそう！"),
  D("Did you enjoy summer?","夏は たのしかった？",["Yes! I swam in the sea.","Yes, I enjoyed it."],[["Yes! I swim in the sea yesterday.",'pastGo']],"I'm glad!","よかった！")],
 es_dream:[
  D("What do you want to be?","しょうらい なにに なりたい？",["I want to be {job}.","I want to be a teacher."],[["I want be {job}.",'wantTo'],["I want to {job}.",'wantTo']],"{job}! I can see it.","{job_j}！ 想像 できるよ")],
 es_way:[
  D("Where is the station? Go straight and turn right. — Which way?","駅は どこ？ まっすぐ 行って 右。 — どっちに まがる？",["Turn right.","Go straight and turn right."],[["Turn left.",'way']],"Right! You are a good guide.","そう！ いい 案内人だね")],
 jh_be:[
  D("Are Sora and Pochi friends?","ソラと ポチは ともだち？",["Yes, they are.","Yes, they are best friends."],[["Yes, they is.",'be3'],["Yes, he is.",0]],"They are! Always together.","そう！ いつも いっしょ")],
 jh_do:[
  D("Does Gen like coffee?","ゲンじいは コーヒー すき？",["No, he doesn't.","Yes, he does."],[["No, he don't.",'doNeg'],["No, he isn't.",'doNeg']],"He drinks green tea only!","緑茶しか のまないの！"),
  D("Do you play video games?","ゲームは する？",["Yes, I do.","No, I don't."],[["Yes, I am.",'doQ2'],["No, I not.",'doNeg']],"Me too, sometimes!","わたしも ときどき！")],
 jh_3s:[
  D("What does {who_n} do on weekends?","{who_j}は 週末 なにを する？",["{who} {vr_3}.","{who} {vi_3}."],[["{who} {vr}.",'s3'],["{who} {vi}.",'s3']],"Sounds like a nice weekend.","すてきな 週末だね"),
  D("Does your friend like {sport}?","友だちは {sport_j}が すき？",["Yes, she likes {sport}.","No, she doesn't like {sport}."],[["Yes, she like {sport}.",'s3'],["No, she doesn't likes {sport}.",'s3do']],"I see!","なるほど！"),
  D("What does Mina do every morning? Guess!","ミナ先生は 毎朝 なにを する？ 当ててみて",["She walks on the beach.","She drinks coffee."],[["She walk on the beach.",'s3'],["She drink coffee.",'s3']],"Both right! Walk, then coffee.","どっちも 正解！ 散歩して コーヒー")],
 jh_plural:[
  D("How many children are there on the beach?","浜辺に 子どもは 何人？",["There are three children.","Three children."],[["There are three childs.",'pluralX']],"Yes, they're building a castle.","うん、 お城を 作ってるね")],
 jh_pron:[
  D("Is this your towel?","これ あなたの タオル？",["Yes, it's mine.","No, it's not mine."],[["Yes, it's me.",'pron'],["Yes, it's my.",'pron']],"Here you are!","はい どうぞ！")],
 jh_imp:[
  D("The waves are big today. What do you say to Sora?","きょうは 波が 大きい。 ソラに なんて 言う？",["Be careful!","Don't swim far!"],[["You careful!",'imp'],["Don't swims far!",'imp']],"Good. Safety first!","いいね。 安全 第一！")],
 jh_prog:[
  D("What are you doing now?","いま なにしてる？",["I'm talking with you!","I am studying English."],[["I talking with you!",'prog'],["I am study English.",'prog']],"Ha ha, right! And you're doing great.","あはは、 そうだね！ しかも じょうず"),
  D("Look at Pochi! What is he doing?","ポチを 見て！ なにしてる？",["He is digging.","He's running."],[["He digging.",'prog'],["He is dig.",'prog']],"Digging for treasure, maybe!","宝さがし かもね！")],
 jh_wh:[
  D("Ask me where I live.","わたしが どこに 住んでるか きいて",["Where do you live?"],[["Where you live?",'wh'],["Where are you live?",'wh']],"I live in a small house by the sea.","海の そばの 小さい 家だよ"),
  D("Ask me when my birthday is.","わたしの 誕生日を きいて",["When is your birthday?"],[["When your birthday is?",'wh']],"It's in July! Summer girl.","7月！ 夏生まれ なの")],
 jh_past1:[
  D("What did you do last night?","きのうの 夜は なにを した？",["I {vr_ed}.","I {vr_ed} at home."],[["I {vr} last night.",'past1'],["I {vr_x}.",'past1']],"Nice and relaxed.","のんびり だね")],
 jh_past2:[
  D("What did you do last weekend?","先週末は なにを した？",["I {vi_ed}.","I {vi_ed} with my family."],[["I {vi_x}.",'past2'],["I {vi} last weekend.",'past2']],"Wow, sounds great!","わあ、 いいね！"),
  D("Did you {vi} yesterday?","きのう {vi_j}？",["Yes, I did.","No, I didn't."],[["Yes, I did {vi_ed}.",'didPast'],["No, I didn't {vi_ed}.",'didPast']],"OK, I see.","そっか")],
 jh_pastprog:[
  D("I called you at eight last night. What were you doing?","きのうの 8時に 電話したの。 なにしてた？",["I was taking a bath.","I was {vr_ing}."],[["I was take a bath.",'pastProg'],["I {vr_ing}.",'pastProg']],"Ah, that's why you didn't answer!","だから 出なかったのね！")],
 jh_future:[
  D("What will you do tomorrow?","あしたは なにを する？",["I will {vi}.","I'm going to {vr}."],[["I will to {vi}.",'will'],["I going to {vr}.",'goingTo']],"Have fun!","たのしんでね！"),
  D("Will it rain tomorrow?","あした 雨 ふるかな？",["I think it will be sunny.","Maybe it will rain."],[["I think it will sunny.",'will'],["It will rains.",'will']],"Let's hope for sun!","晴れると いいね！")],
 jh_modal:[
  D("I have a test tomorrow. What should I do?","あした テストなの。 どうしたら いい？",["You should sleep early.","You should study tonight."],[["You should to sleep early.",'modal'],["You should sleeps early.",'modal']],"Good advice, thanks!","いい アドバイス、 ありがとう！"),
  D("May I sit here?","ここに すわっても いい？",["Sure, you may.","Of course!"],[["Yes, you may to sit.",'modal']],"Thank you!","ありがとう！")],
 jh_there:[
  D("What is there on the beach today?","きょうの 浜辺には なにが ある？",["There are many shells.","There is a big boat."],[["There is many shells.",'there'],["There are a big boat.",'there']],"Let's go see!","見に いこう！")],
 jh_inf:[
  D("What do you want to do this summer?","この夏は なにが したい？",["I want to {vi}.","I want to travel."],[["I want {vi}.",'inf'],["I want to {vi_ed}.",'inf']],"Nice plan!","いい 計画！"),
  D("Why do you study English?","どうして 英語を 勉強するの？",["To talk with people around the world.","Because I want to travel."],[["For talk with people.",'inf']],"Wonderful reason.","すてきな 理由")],
 jh_ger:[
  D("What do you enjoy doing?","なにを するのが すき？",["I enjoy {vr_ing}.","I enjoy {vi_ing}."],[["I enjoy to {vr}.",'ger'],["I enjoy {vr}.",'ger']],"Me too!","わたしも！")],
 jh_comp:[
  D("Which is bigger, a whale or a dolphin?","クジラと イルカ、 どっちが 大きい？",["A whale is bigger.","A whale is bigger than a dolphin."],[["A whale is more bigger.",'comp'],["A whale is big than a dolphin.",'comp']],"Right! Much bigger.","正解！ ずっと 大きい"),
  D("Which season do you like the best?","どの 季節が いちばん すき？",["I like summer the best.","Summer is the best!"],[["I like summer the most best.",'sup']],"Summer! Beach season!","夏！ 浜辺の 季節！")],
 jh_passive:[
  D("Who made this sand castle?","この すなの お城、 だれが 作ったの？",["It was made by Sora.","Sora made it."],[["It was make by Sora.",'passive'],["It is making by Sora.",'passive']],"Sora is an artist!","ソラって 芸術家！"),
  D("What language is spoken in Australia?","オーストラリアでは 何語が 話されてる？",["English is spoken there.","English!"],[["English is speak there.",'passive']],"Yes! With a cool accent.","そう！ かっこいい なまりでね")],
 jh_perfect:[
  D("Have you ever seen a dolphin?","イルカを 見た ことある？",["Yes, I have.","No, I have never seen one."],[["Yes, I have saw one.",'perf'],["No, I have never see one.",'perf']],"They're so smart!","すごく かしこいんだよ"),
  D("How long have you lived in your town?","いまの 町に どのくらい 住んでる？",["I have lived there for ten years.","Since I was born."],[["I live there for ten years.",'perf'],["I have lived there ten years ago.",'perfTime']],"That's a long time!","長いね！")],
 jh_perfprog:[
  D("You look tired. How long have you been studying?","つかれてるね。 どのくらい 勉強してる？",["I've been studying for two hours.","I have been studying since noon."],[["I've been study for two hours.",'perfProg'],["I am studying for two hours.",'perfProg']],"Take a break! Drink some water.","休けい しよう！ 水を のんで")],
 jh_conj:[
  D("Why do you like summer?","なんで 夏が すき？",["Because I can swim.","Because summer is fun."],[["So I can swim.",'conj']],"Good reason!","いい 理由！"),
  D("What do you do when it rains?","雨の 日は なにを する？",["When it rains, I read books.","I play games when it rains."],[["If it rains, so I read.",'conj']],"Cozy!","いいね、 のんびり")],
 jh_rel:[
  D("Who is Gen?","ゲンじいって だれ？",["He is a man who loves fishing.","He's an old man who lives by the sea."],[["He is a man which loves fishing.",'rel']],"Exactly!","そのとおり！"),
  D("What is a 'shell shop'?","「かいがら屋」って なに？",["It's a shop which sells shells.","A shop that sells shells."],[["It's a shop who sells shells.",'rel']],"Right. Hana's friend runs it.","そう。 ハナさんの 友だちの お店")],
 jh_part:[
  D("How was the movie?","映画 どうだった？",["It was boring.","It was exciting!"],[["I was boring.",'part']],"Ha ha, I see!","あはは、 なるほど！"),
  D("How do you feel after the test?","テストの あと、 気分は？",["I'm tired.","I'm excited!"],[["I'm tiring.",'part']],"You did your best!","がんばったね！")],
 jh_indq:[
  D("Do you know where Pochi is?","ポチが どこに いるか 知ってる？",["I don't know where he is.","I know where he is!"],[["I don't know where is he.",'indq']],"Let's look for him.","さがしに いこう"),
  D("Do you know what time it is?","いま 何時か わかる？",["I don't know what time it is.","Sorry, I don't know."],[["I don't know what time is it.",'indq']],"Let me check.","見てみるね")],
 jh_subj:[
  D("If you were a bird, where would you go?","もし 鳥だったら どこに 行く？",["If I were a bird, I would fly to Hawaii.","I would fly over the sea."],[["If I am a bird, I would fly to Hawaii.",'subj'],["If I were a bird, I will fly to Hawaii.",'subj']],"Take me with you!","わたしも つれてって！"),
  D("What do you wish?","なにか 願いごと ある？",["I wish I could fly.","I wish I were taller."],[["I wish I can fly.",'subj']],"Me too!","わたしも！")],
 jh_svoo:[
  D("It's Pochi's birthday. What will you give him?","ポチの 誕生日。 なにを あげる？",["I'll give him a bone.","I'll give him a new ball."],[["I'll give to him a bone.",'svoo']],"He'll be so happy!","すごく よろこぶよ！")],
 jh_prep:[
  D("When is the summer festival?","夏祭りは いつ？",["It's on Saturday.","It's in August."],[["It's in Saturday.",'prep'],["It's on August.",'prep']],"Let's go together!","いっしょに 行こう！")],
 jh_art:[
  D("What do you want for a snack?","おやつ なにが いい？",["An apple, please.","I want an orange."],[["A apple, please.",'art'],["I want a orange.",'art']],"Here you go!","はい どうぞ！")],
 hs_tense:[
  D("Why were you late for the bus?","なんで バスに おくれたの？",["When I got there, it had already left.","The bus had left before I arrived."],[["When I got there, it has already left.",'hsTense'],["The bus already leaves before I arrived.",'hsTense']],"Bad luck!","ついてないね！")],
 hs_modperf:[
  D("My umbrella is gone. What happened?","かさが ない。 どうしたんだろう？",["Someone must have taken it.","You may have left it at school."],[["Someone must have take it.",'modPerf'],["Someone must took it.",'modPerf']],"Hmm, you might be right.","うーん、 そうかも"),
  D("I failed the test. I didn't study.","テスト だめだった。 勉強しなかったの",["You should have studied.","You should have studied harder."],[["You should studied.",'modPerf'],["You should have study.",'modPerf']],"I know, I know...","わかってる、 わかってる…")],
 hs_passive2:[
  D("Is the cafe open?","カフェは あいてる？",["No, it's being repaired.","It is being cleaned now."],[["No, it's repairing.",'passive2'],["No, it's being repair.",'passive2']],"OK, let's come back later.","じゃあ あとで 来よう")],
 hs_inf2:[
  D("Why did you come to the beach so early?","なんで こんなに 早く 浜辺へ？",["To see the sunrise.","In order to catch fish."],[["For seeing the sunrise.",'inf2'],["For to see the sunrise.",'inf2']],"Beautiful, isn't it?","きれいでしょ？")],
 hs_ginf:[
  D("Did you lock the door?","ドア、 かぎ かけた？",["Yes, I remember locking it.","Oh no, I forgot to lock it!"],[["Yes, I remember to lock it yesterday.",'ginf']],"Ha ha, go check!","あはは、 見てきて！")],
 hs_partc:[
  D("How did you find this shell?","この かいがら どうやって 見つけたの？",["Walking on the beach, I found it.","I found it walking along the shore."],[["Walked on the beach, I found it.",'partc']],"Lucky you!","ラッキー！")],
 hs_rel2:[
  D("Is this the thing you were looking for?","これ さがしてた もの？",["Yes! This is what I wanted.","Yes, it's exactly what I needed."],[["Yes! This is the thing what I wanted.",'rel2'],["Yes! This is which I wanted.",'rel2']],"I'm glad I found it!","見つかって よかった！")],
 hs_reladv:[
  D("Where did you grow up?","どこで 育ったの？",["In a small town where everyone knows each other.","In the town where my grandma lives."],[["In a small town which everyone knows each other.",'relAdv']],"Sounds warm.","あたたかい 町だね")],
 hs_comp2:[
  D("Is English getting easier?","英語、 楽に なってきた？",["Yes. The more I practice, the easier it gets.","The more I read, the better I understand."],[["Yes. More I practice, easier it gets.",'comp2']],"That's the spirit!","その ちょうし！")],
 hs_subj2:[
  D("You missed the fireworks yesterday!","きのう 花火 見のがしたね！",["If I had known, I would have come.","I wish I had gone."],[["If I had known, I will come.",'subj2'],["If I knew, I would have come.",'subj2']],"There's another one next week!","来週も あるよ！")],
 hs_speech:[
  D("What did Gen say to you?","ゲンじいは なんて 言ってた？",["He said he was going fishing.","He told me to be careful."],[["He said he is going fishing yesterday.",'speech'],["He said me to be careful.",'speech']],"Classic Gen!","ゲンじい らしい！")],
 hs_seq:[
  D("Did you know Hana was a surfer?","ハナさんが サーファーだって 知ってた？",["No, I didn't know she was a surfer.","I thought she was a cook!"],[["No, I didn't know she is a surfer.",'seq']],"Surprise!","びっくりでしょ！")],
 hs_emph:[
  D("Who broke the window? Sora?","窓を わったの だれ？ ソラ？",["No, it was Pochi that broke it.","It was the wind that broke it."],[["No, it is Pochi who broke it yesterday.",0]],"Pochi?! Oh no!","ポチ？！ あらら！")],
 hs_neg:[
  D("Are all fish good to eat?","魚って ぜんぶ 食べられる？",["Not all fish are good to eat.","No, not all of them."],[["All fish are not good to eat.",'neg']],"Right, be careful with blowfish!","そう、 フグには 気をつけてね！")],
 hs_caus:[
  D("Your mom let you come here alone?","お母さん、 ひとりで ここに 来させてくれたの？",["Yes, she let me come alone.","She made me promise to call."],[["Yes, she let me to come alone.",'caus'],["She made me to promise.",'caus']],"Nice mom!","いい お母さん！")],
 hs_5:[
  D("How does the sea make you feel?","海を 見ると どんな 気持ちに なる？",["It makes me calm.","The sea makes me happy."],[["It makes me calmly.",'s5'],["It makes me happily.",'s5']],"Me too.","わたしも")],
 hs_conj2:[
  D("Will you go to the beach if it rains?","雨でも 浜辺に 行く？",["Even if it rains, I'll go.","Unless it rains hard, I'll go."],[["Unless it doesn't rain, I'll go.",'conj2']],"Brave!","ゆうかん！")],
 hs_quant:[
  D("Do you have many friends here?","ここに 友だち たくさん いる？",["I have a few friends.","Yes, I have many friends."],[["I have much friends.",'quant']],"You'll make more!","もっと できるよ！"),
  D("Is there any water left?","水、 まだ ある？",["There is a little water.","There's only a little left."],[["There is a few water.",'quant'],["There are many water.",'quant']],"Let's share it.","わけあおう")],
 hs_noun:[
  D("Why are you so happy today?","きょうは なんで そんなに うれしそう？",["The news made me happy.","A letter from my friend made me happy."],[["The news made me happily.",'s5']],"Good news is the best!","いい 知らせって 最高！")],
 hs_ellip:[
  D("What surprised you?","なにに おどろいた？",["The fact that Gen can surf.","The fact that dolphins sleep with one eye open."],[["The fact which Gen can surf.",'ellip']],"Ha ha, true!","あはは、 ほんと！")],
}})();
