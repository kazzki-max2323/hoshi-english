/* ことばカード（単語カードゲーム）の データ。しくみは game/cg.js（カード・ショップ）と game/cg-battle.js（対戦）と game/cg-more.js（大会・道場・診断・連動）
   - 単語帳の 全部の 単語が カードに なる（小〜ハイレベル）。宝箱の カード（game/cards-data.js）は 「宝カード」として 使える
   - ここの リストは 「|」区切りの 文字で 書き、 読みこむときに 単語帳に ある 単語だけ のこす（ない 単語は 自動で はずれる）
   - 既存の カードゲームの まねでは なく、 このアプリ だけの ルール・名前・見た目 */
/* ことばコンボ: 英語として 自然な 組み合わせ [ことば1|ことば2|フレーズ|意味] */
const CG_COMBO_SRC=`
heavy|rain|heavy rain|大雨
heavy|snow|heavy snow|大雪
heavy|traffic|heavy traffic|ひどい 渋滞
strong|wind|strong wind|強い 風
strong|coffee|strong coffee|こい コーヒー
strong|tea|strong tea|こい お茶
hot|water|hot water|お湯
cold|water|cold water|冷たい 水
hot|tea|hot tea|あつい お茶
fresh|air|fresh air|新鮮な 空気
fresh|fruit|fresh fruit|新鮮な くだもの
fresh|fish|fresh fish|新鮮な 魚
deep|breath|deep breath|深呼吸
deep|sea|deep sea|深海
blue|sky|blue sky|青空
clear|sky|clear sky|晴れた 空
dark|night|dark night|暗い 夜
full|moon|full moon|満月
bright|star|bright star|明るい 星
bright|future|bright future|明るい 未来
best|friend|best friend|親友
good|friend|good friend|よい 友だち
old|friend|old friend|昔からの 友だち
close|friend|close friend|親しい 友だち
big|family|big family|大家族
happy|birthday|happy birthday|誕生日 おめでとう
new|year|new year|新年
good|morning|good morning|おはよう
good|night|good night|おやすみ
good|idea|good idea|いい 考え
great|idea|great idea|すごい 考え
bad|dream|bad dream|こわい 夢
sweet|dream|sweet dream|楽しい 夢
long|time|long time|長い 時間
free|time|free time|ひまな 時間
last|year|last year|去年
next|week|next week|来週
every|day|every day|毎日
high|price|high price|高い 値段
low|price|low price|安い 値段
high|school|high school|高校
little|brother|little brother|弟
little|sister|little sister|妹
fast|food|fast food|ファストフード
ice|cream|ice cream|アイスクリーム
green|tea|green tea|緑茶
orange|juice|orange juice|オレンジジュース
apple|pie|apple pie|アップルパイ
rice|ball|rice ball|おにぎり
hot|dog|hot dog|ホットドッグ
birthday|cake|birthday cake|誕生日ケーキ
post|office|post office|郵便局
fire|station|fire station|消防署
police|station|police station|警察署
train|station|train station|駅
swimming|pool|swimming pool|プール
school|bus|school bus|スクールバス
summer|vacation|summer vacation|夏休み
rainy|season|rainy season|梅雨
sea|turtle|sea turtle|ウミガメ
polar|bear|polar bear|ホッキョクグマ
make|mistake|make a mistake|まちがえる
make|decision|make a decision|決める
make|friends|make friends|友だちを つくる
make|money|make money|お金を かせぐ
make|noise|make noise|音を たてる
make|effort|make an effort|努力する
make|progress|make progress|進歩する
make|plan|make a plan|計画を たてる
make|wish|make a wish|願いごとを する
make|speech|make a speech|スピーチを する
make|bed|make the bed|ベッドを ととのえる
make|sense|make sense|意味が 通じる
make|difference|make a difference|ちがいを 生む
make|choice|make a choice|えらぶ
do|homework|do homework|宿題を する
do|best|do my best|ベストを つくす
do|dishes|do the dishes|皿を 洗う
do|exercise|do exercise|運動する
take|photo|take a photo|写真を とる
take|picture|take a picture|写真を とる
take|bath|take a bath|お風呂に 入る
take|shower|take a shower|シャワーを あびる
take|medicine|take medicine|薬を 飲む
take|test|take a test|テストを 受ける
take|break|take a break|ひと休みする
take|walk|take a walk|散歩する
take|bus|take a bus|バスに 乗る
take|train|take a train|電車に 乗る
take|care|take care|気をつける
take|time|take time|時間が かかる
take|risk|take a risk|危険を おかす
take|action|take action|行動する
take|notes|take notes|メモを とる
take|place|take place|行われる
take|part|take part|参加する
take|advantage|take advantage|利用する
have|breakfast|have breakfast|朝ごはんを 食べる
have|lunch|have lunch|昼ごはんを 食べる
have|dinner|have dinner|夕ごはんを 食べる
have|fun|have fun|楽しむ
have|dream|have a dream|夢を 見る
have|cold|have a cold|かぜを ひいている
have|fever|have a fever|熱が ある
have|headache|have a headache|頭が いたい
have|idea|have an idea|考えが ある
have|party|have a party|パーティーを ひらく
have|time|have time|時間が ある
catch|cold|catch a cold|かぜを ひく
catch|ball|catch a ball|ボールを とる
catch|fish|catch a fish|魚を つる
catch|bus|catch the bus|バスに 間に合う
catch|train|catch the train|電車に 間に合う
miss|bus|miss the bus|バスに 乗りおくれる
miss|train|miss the train|電車に 乗りおくれる
tell|story|tell a story|お話を する
tell|lie|tell a lie|うそを つく
tell|truth|tell the truth|本当の ことを 言う
tell|joke|tell a joke|じょうだんを 言う
keep|secret|keep a secret|ひみつを 守る
keep|promise|keep a promise|約束を 守る
keep|diary|keep a diary|日記を つける
break|promise|break a promise|約束を 破る
break|record|break a record|記録を 破る
break|rule|break a rule|ルールを 破る
save|money|save money|お金を ためる
save|time|save time|時間を 節約する
save|energy|save energy|エネルギーを 節約する
save|life|save a life|命を 救う
spend|money|spend money|お金を 使う
spend|time|spend time|時間を すごす
waste|time|waste time|時間を むだにする
waste|money|waste money|お金を むだにする
pay|attention|pay attention|注意を はらう
pay|money|pay money|お金を はらう
ask|question|ask a question|質問する
answer|question|answer a question|質問に 答える
solve|problem|solve a problem|問題を 解く
cause|problem|cause a problem|問題を 起こす
face|problem|face a problem|問題に 向き合う
play|soccer|play soccer|サッカーを する
play|tennis|play tennis|テニスを する
play|baseball|play baseball|野球を する
play|piano|play the piano|ピアノを ひく
play|guitar|play the guitar|ギターを ひく
play|game|play a game|ゲームを する
play|role|play a role|役割を はたす
ride|bike|ride a bike|自転車に 乗る
ride|horse|ride a horse|馬に 乗る
drive|car|drive a car|車を 運転する
read|book|read a book|本を 読む
write|letter|write a letter|手紙を 書く
send|letter|send a letter|手紙を 送る
send|message|send a message|メッセージを 送る
watch|TV|watch TV|テレビを 見る
watch|movie|watch a movie|映画を 見る
listen|music|listen to music|音楽を 聞く
sing|song|sing a song|歌を 歌う
brush|teeth|brush my teeth|歯を みがく
wash|hands|wash my hands|手を 洗う
wash|face|wash my face|顔を 洗う
open|door|open the door|ドアを あける
close|door|close the door|ドアを しめる
open|window|open the window|窓を あける
turn|light|turn on the light|電気を つける
clean|room|clean the room|部屋を そうじする
cook|dinner|cook dinner|夕ごはんを つくる
eat|breakfast|eat breakfast|朝ごはんを 食べる
drink|water|drink water|水を 飲む
drink|milk|drink milk|牛乳を 飲む
drink|coffee|drink coffee|コーヒーを 飲む
go|shopping|go shopping|買いものに 行く
go|fishing|go fishing|つりに 行く
go|camping|go camping|キャンプに 行く
go|swimming|go swimming|泳ぎに 行く
go|home|go home|家に 帰る
go|school|go to school|学校へ 行く
go|bed|go to bed|ねる
get|up|get up|起きる
get|lost|get lost|道に まよう
get|married|get married|結婚する
get|angry|get angry|おこる
get|tired|get tired|つかれる
win|game|win a game|試合に 勝つ
win|prize|win a prize|賞を とる
lose|game|lose a game|試合に 負ける
lose|weight|lose weight|やせる
gain|weight|gain weight|太る
change|mind|change my mind|気が かわる
follow|rule|follow the rule|ルールに したがう
follow|advice|follow advice|助言に したがう
give|advice|give advice|助言する
give|speech|give a speech|スピーチを する
give|hand|give a hand|手を かす
raise|hand|raise my hand|手を あげる
shake|hands|shake hands|あく手する
hold|hands|hold hands|手を つなぐ
reach|goal|reach a goal|目標に とどく
set|goal|set a goal|目標を きめる
achieve|goal|achieve a goal|目標を 達成する
meet|deadline|meet a deadline|しめきりに 間に合う
attend|meeting|attend a meeting|会議に 出る
hold|meeting|hold a meeting|会議を ひらく
run|business|run a business|商売を いとなむ
earn|money|earn money|お金を かせぐ
raise|money|raise money|お金を 集める
borrow|money|borrow money|お金を 借りる
lend|money|lend money|お金を 貸す
protect|environment|protect the environment|環境を 守る
reduce|waste|reduce waste|ごみを へらす
reduce|cost|reduce costs|費用を へらす
gain|experience|gain experience|経験を つむ
share|idea|share an idea|考えを 分かちあう
express|opinion|express an opinion|意見を 言う
make|request|make a request|おねがいする
make|phone call|make a phone call|電話を かける
make|appointment|make an appointment|予約する
make|reservation|make a reservation|予約する
make|contribution|make a contribution|貢献する
make|impression|make an impression|印象を 与える
make|assumption|make an assumption|思いこむ
make|comparison|make a comparison|くらべる
make|complaint|make a complaint|苦情を 言う
reach|conclusion|reach a conclusion|結論に 達する
draw|conclusion|draw a conclusion|結論を 出す
conduct|research|conduct research|研究を 行う
conduct|survey|conduct a survey|調査を 行う
carry out|experiment|carry out an experiment|実験を 行う
play|important role|play an important role|重要な 役割を はたす
pose|threat|pose a threat|おびやかす
raise|awareness|raise awareness|意識を 高める
gain|access|gain access|入る 手段を 得る
meet|demand|meet the demand|需要に こたえる
meet|needs|meet the needs|必要に こたえる
bear|responsibility|bear responsibility|責任を 負う
take|responsibility|take responsibility|責任を とる
take|measures|take measures|対策を とる
take|initiative|take the initiative|主導権を とる
make|commitment|make a commitment|約束する
close|deal|close a deal|取引を まとめる
strike|balance|strike a balance|バランスを とる
heavy|smoker|heavy smoker|ヘビースモーカー
heavy|burden|heavy burden|重い 負担
strong|opinion|strong opinion|強い 意見
strong|influence|strong influence|強い 影響
deep|sleep|deep sleep|深い ねむり
deep|impression|deep impression|深い 印象
bitter|experience|bitter experience|にがい 経験
common|sense|common sense|常識
public|opinion|public opinion|世論
natural|disaster|natural disaster|自然災害
global|warming|global warming|地球温暖化
climate|change|climate change|気候変動
renewable|energy|renewable energy|再生可能エネルギー
solar|energy|solar energy|太陽エネルギー
human|rights|human rights|人権
social|media|social media|ソーシャルメディア
mental|health|mental health|心の 健康
physical|exercise|physical exercise|体の 運動
balanced|diet|balanced diet|バランスの よい 食事
side|effect|side effect|副作用
first|aid|first aid|応急手当
blood|pressure|blood pressure|血圧
high|temperature|high temperature|高い 気温
low|temperature|low temperature|低い 気温
current|situation|current situation|現状
economic|growth|economic growth|経済成長
rapid|growth|rapid growth|急な 成長
sharp|increase|sharp increase|急な 増加
sharp|decline|sharp decline|急な 減少
steady|increase|steady increase|着実な 増加
significant|difference|significant difference|大きな ちがい
major|problem|major problem|大きな 問題
serious|problem|serious problem|深刻な 問題
serious|illness|serious illness|重い 病気
minor|injury|minor injury|軽い けが
key|factor|key factor|重要な 要因
main|reason|main reason|主な 理由
good|reason|good reason|ちゃんとした 理由
final|decision|final decision|最終的な 決定
tough|decision|tough decision|むずかしい 決断
hard|work|hard work|大変な 仕事
part-time|job|part-time job|アルバイト
full-time|job|full-time job|正社員の 仕事
job|interview|job interview|就職面接
annual|meeting|annual meeting|年次総会
business|trip|business trip|出張
customer|service|customer service|顧客サービス
sales|figures|sales figures|売上の 数字
market|share|market share|市場占有率
interest|rate|interest rate|金利
credit|card|credit card|クレジットカード
bank|account|bank account|銀行口座
press|conference|press conference|記者会見
breaking|news|breaking news|ニュース速報
vivid|memory|vivid memory|あざやかな 記憶
fond|memory|fond memory|なつかしい 思い出
broad|range|broad range|はばひろい 範囲
wide|range|wide range|はばひろい 範囲
narrow|escape|narrow escape|あやうく のがれること
close|call|close call|あぶない ところ
utmost|importance|utmost importance|この上なく 重要
vested|interest|vested interest|既得権
mutual|understanding|mutual understanding|相互理解
golden|opportunity|golden opportunity|絶好の 機会
equal|opportunity|equal opportunity|機会均等
take|precaution|take precautions|用心する
deliver|speech|deliver a speech|演説する
cast|doubt|cast doubt|疑いを 投げかける
shed|light|shed light|光を 当てる（明らかにする）
pay|tribute|pay tribute|敬意を 表す
come|true|come true|かなう
fall|asleep|fall asleep|ねむりこむ
fall|love|fall in love|恋に 落ちる
launch|product|launch a product|製品を 発売する
launch|campaign|launch a campaign|キャンペーンを 始める
file|complaint|file a complaint|苦情を 申し立てる
file|lawsuit|file a lawsuit|訴訟を 起こす
submit|proposal|submit a proposal|提案書を 出す
submit|application|submit an application|申しこみ書を 出す
submit|report|submit a report|報告書を 出す
conduct|investigation|conduct an investigation|調査を 行う
conduct|interview|conduct an interview|面接を 行う
negotiate|contract|negotiate a contract|契約を 交渉する
sign|contract|sign a contract|契約に サインする
renew|contract|renew a contract|契約を 更新する
terminate|contract|terminate a contract|契約を 打ち切る
issue|statement|issue a statement|声明を 出す
issue|warning|issue a warning|警告を 出す
impose|tax|impose a tax|税を 課す
impose|sanctions|impose sanctions|制裁を 科す
implement|policy|implement a policy|政策を 実行する
adopt|policy|adopt a policy|政策を 採用する
allocate|budget|allocate a budget|予算を 割り当てる
exceed|budget|exceed the budget|予算を こえる
cut|costs|cut costs|費用を 削る
boost|sales|boost sales|売上を 伸ばす
boost|economy|boost the economy|経済を 活性化する
stimulate|economy|stimulate the economy|経済を 刺激する
alleviate|pain|alleviate pain|痛みを 和らげる
alleviate|poverty|alleviate poverty|貧困を 和らげる
mitigate|risk|mitigate the risk|リスクを 軽減する
mitigate|impact|mitigate the impact|影響を 和らげる
pose|risk|pose a risk|危険を もたらす
assess|risk|assess the risk|リスクを 評価する
undermine|confidence|undermine confidence|信頼を 損なう
gain|confidence|gain confidence|自信を つける
restore|confidence|restore confidence|信頼を 取りもどす
reach|consensus|reach a consensus|合意に 達する
reach|agreement|reach an agreement|合意に 達する
break|agreement|break an agreement|合意を 破る
draw|attention|draw attention|注目を 集める
attract|attention|attract attention|注目を 集める
make|fortune|make a fortune|ひと財産 きずく
make|profit|make a profit|利益を 出す
generate|revenue|generate revenue|収益を 生む
generate|income|generate income|収入を 生む
earn|living|earn a living|生計を 立てる
pursue|career|pursue a career|キャリアを 追い求める
pursue|goal|pursue a goal|目標を 追い求める
fulfill|dream|fulfill a dream|夢を かなえる
fulfill|requirement|fulfill a requirement|条件を 満たす
meet|requirement|meet the requirement|条件を 満たす
meet|expectations|meet expectations|期待に こたえる
exceed|expectations|exceed expectations|期待を 上回る
raise|concern|raise a concern|懸念を 示す
address|issue|address an issue|問題に 取り組む
address|problem|address a problem|問題に 取り組む
tackle|problem|tackle a problem|問題に 取り組む
resolve|conflict|resolve a conflict|対立を 解決する
resolve|dispute|resolve a dispute|争いを 解決する
settle|dispute|settle a dispute|争いを 解決する
avoid|conflict|avoid conflict|対立を さける
commit|crime|commit a crime|罪を おかす
commit|suicide|commit suicide|自殺する
pass|law|pass a law|法律を 通す
violate|law|violate the law|法律に 違反する
obey|law|obey the law|法律を 守る
enforce|law|enforce the law|法律を 施行する
abolish|law|abolish a law|法律を 廃止する
abuse|power|abuse power|権力を 乱用する
seize|power|seize power|権力を にぎる
seize|opportunity|seize an opportunity|機会を つかむ
miss|opportunity|miss an opportunity|機会を のがす
grasp|opportunity|grasp an opportunity|機会を つかむ
acquire|skill|acquire a skill|技能を 身につける
acquire|knowledge|acquire knowledge|知識を 得る
broaden|horizons|broaden my horizons|視野を 広げる
widen|gap|widen the gap|格差を 広げる
narrow|gap|narrow the gap|格差を ちぢめる
bridge|gap|bridge the gap|へだたりを うめる
fill|gap|fill the gap|すきまを うめる
heavy|losses|heavy losses|大きな 損失
severe|damage|severe damage|ひどい 被害
severe|weather|severe weather|荒れた 天気
fierce|competition|fierce competition|はげしい 競争
intense|competition|intense competition|はげしい 競争
keen|interest|keen interest|強い 関心
vast|majority|vast majority|大多数
overwhelming|majority|overwhelming majority|圧倒的 多数
crucial|role|crucial role|重要な 役割
vital|role|vital role|重要な 役割
key|role|key role|重要な 役割
widespread|support|widespread support|幅広い 支持
public|support|public support|国民の 支持
financial|support|financial support|経済的な 支援
financial|crisis|financial crisis|金融危機
economic|crisis|economic crisis|経済危機
economic|recession|economic recession|景気後退
rapid|expansion|rapid expansion|急速な 拡大
gradual|decline|gradual decline|ゆるやかな 減少
dramatic|increase|dramatic increase|劇的な 増加
dramatic|change|dramatic change|劇的な 変化
substantial|amount|substantial amount|かなりの 量
considerable|amount|considerable amount|かなりの 量
abundant|resources|abundant resources|豊富な 資源
natural|resources|natural resources|天然資源
limited|resources|limited resources|かぎられた 資源
scarce|resources|scarce resources|とぼしい 資源
renewable|resources|renewable resources|再生可能な 資源
greenhouse|gas|greenhouse gas|温室効果ガス
carbon|emissions|carbon emissions|炭素の 排出
fossil|fuel|fossil fuel|化石燃料
nuclear|power|nuclear power|原子力
nuclear|weapon|nuclear weapon|核兵器
endangered|species|endangered species|絶滅危惧種
immune|system|immune system|免疫系
chronic|disease|chronic disease|慢性の 病気
infectious|disease|infectious disease|感染症
artificial|intelligence|artificial intelligence|人工知能
machine|learning|machine learning|機械学習
data|analysis|data analysis|データ分析
supply|chain|supply chain|供給網
target|market|target market|ターゲット市場
market|research|market research|市場調査
customer|satisfaction|customer satisfaction|顧客満足
job|satisfaction|job satisfaction|仕事の 満足感
annual|report|annual report|年次報告書
quarterly|report|quarterly report|四半期報告書
trade|deficit|trade deficit|貿易赤字
budget|deficit|budget deficit|財政赤字
minimum|wage|minimum wage|最低賃金
labor|force|labor force|労働力
civil|rights|civil rights|市民権
freedom|speech|freedom of speech|言論の 自由
peace|treaty|peace treaty|平和条約
foreign|policy|foreign policy|外交政策
public|policy|public policy|公共政策
social|welfare|social welfare|社会福祉
social|security|social security|社会保障
national|security|national security|国家安全保障
global|economy|global economy|世界経済
cultural|diversity|cultural diversity|文化の 多様性
critical|thinking|critical thinking|批判的思考
common|ground|common ground|共通点
vicious|circle|vicious circle|悪循環
golden|rule|golden rule|大切な きまり
rule|thumb|rule of thumb|経験則
bear|mind|bear in mind|心に とめる
come|conclusion|come to a conclusion|結論に 達する
jump|conclusions|jump to conclusions|早合点する
take|granted|take for granted|当然と 思う
`;
/* まちがいコンボ: 日本語から 考えると 言いそうだけど、 英語では ふつう 言わない 組み合わせ [ことば1|ことば2|正しい 言い方|せつめい] */
const CG_WRONG_SRC=`
strong|rain|heavy rain|雨の 強さは heavy（重い）で 言うよ
big|rain|heavy rain|大雨は heavy rain。big rain とは 言わないよ
heavy|wind|strong wind|風は strong（強い）で 言うよ
heavy|coffee|strong coffee|こい コーヒーは strong coffee
thick|coffee|strong coffee|こい コーヒーは thick ではなく strong
do|mistake|make a mistake|まちがいは make a mistake。do は つかわないよ
do|decision|make a decision|決めるは make a decision
make|homework|do homework|宿題は do homework
make|exercise|do exercise|運動は do exercise
make|photo|take a photo|写真は take a photo
make|shower|take a shower|シャワーは take a shower
make|bath|take a bath|お風呂は take a bath
drink|medicine|take medicine|薬を「飲む」は take medicine
see|dream|have a dream|夢を「見る」は have a dream
look|movie|watch a movie|映画を 見るは watch a movie
see|TV|watch TV|テレビを 見るは watch TV
say|lie|tell a lie|うそを つくは tell a lie
speak|lie|tell a lie|うそを つくは tell a lie
say|joke|tell a joke|じょうだんは tell a joke
expensive|price|high price|値段は high / low で 言うよ
cheap|price|low price|安い 値段は low price
tall|price|high price|値段は high で 言うよ
high|tree|tall tree|高い 木は tall tree（細長く 高い ものは tall）
tall|mountain|high mountain|山は high mountain が ふつうだよ
open|light|turn on the light|電気を つけるは turn on
close|light|turn off the light|電気を 消すは turn off
take|breakfast|have breakfast|朝ごはんは have breakfast が ふつう
eat|medicine|take medicine|薬は take medicine
catch|photo|take a photo|写真は take a photo
play|swimming|go swimming|水泳は go swimming
play|camping|go camping|キャンプは go camping
do|soccer|play soccer|球技は play soccer
do|piano|play the piano|楽器は play the piano
win|team|beat a team|相手に 勝つは beat。win は 試合（game）に 勝つ
lose|bus|miss the bus|乗りおくれるは miss the bus
borrow|toilet|use the toilet|トイレを 借りるは use the toilet
fat|book|thick book|分厚い 本は thick book
small|voice|quiet voice|小さな 声は quiet voice や soft voice
thin|coffee|weak coffee|うすい コーヒーは weak coffee
thin|tea|weak tea|うすい お茶は weak tea
weak|rain|light rain|小雨は light rain
`;
/* 反対語（反対語カウンター） */
const CG_ANTO_SRC=`
hot|cold
big|small
long|short
tall|short
high|low
fast|slow
happy|sad
new|old
young|old
good|bad
open|close
up|down
in|out
left|right
day|night
morning|evening
summer|winter
black|white
rich|poor
strong|weak
heavy|light
hard|soft
easy|difficult
early|late
light|dark
clean|dirty
full|empty
wet|dry
near|far
push|pull
win|lose
buy|sell
give|take
come|go
start|finish
begin|end
laugh|cry
love|hate
remember|forget
arrive|leave
true|false
right|wrong
safe|dangerous
quiet|noisy
cheap|expensive
thick|thin
deep|shallow
wide|narrow
sweet|bitter
increase|decrease
accept|refuse
agree|disagree
appear|disappear
success|failure
victory|defeat
friend|enemy
question|answer
import|export
include|exclude
positive|negative
ancient|modern
public|private
maximum|minimum
majority|minority
borrow|lend
teach|learn
alive|dead
asleep|awake
inside|outside
above|below
before|after
always|never
everything|nothing
war|peace
north|south
east|west
boy|girl
father|mother
brother|sister
king|queen
husband|wife
question|answer
lend|borrow
float|sink
rise|fall
gain|loss
profit|loss
attack|defend
optimistic|pessimistic
generous|stingy
temporary|permanent
expand|shrink
abundant|scarce
artificial|natural
active|passive
simple|complex
rural|urban
domestic|foreign
cause|effect
input|output
superior|inferior
praise|criticize
encourage|discourage
include|omit
strengthen|weaken
ally|enemy
hope|despair
honest|dishonest
possible|impossible
legal|illegal
visible|invisible
fair|unfair
known|unknown
like|dislike
polite|rude
brave|cowardly
calm|nervous
careful|careless
useful|useless
harmful|harmless
`;
/* なかま（にた 意味。なかまガード） */
const CG_SYN_SRC=`
big|large|huge|giant
small|little|tiny
happy|glad|delighted|cheerful
sad|unhappy|sorrowful
begin|start|commence
finish|end|complete
fast|quick|rapid|swift
smart|clever|intelligent|wise
pretty|beautiful|lovely|cute
angry|mad|furious
scared|afraid|frightened
tired|exhausted|sleepy
hard|difficult|tough
easy|simple
talk|speak|say|tell
look|see|watch|observe
help|assist|support|aid
buy|purchase
get|obtain|acquire|gain
show|display|exhibit|reveal
choose|select|pick
answer|reply|respond
idea|thought|concept|notion
job|work|occupation|profession
trip|travel|journey|tour
quiet|silent|calm
strange|odd|weird|unusual
important|essential|vital|crucial|significant
increase|rise|grow|expand
decrease|reduce|decline|diminish
problem|trouble|issue|difficulty
correct|right|accurate|exact
famous|well-known|popular
rich|wealthy|affluent
poor|needy
gift|present
road|street|path|way
shop|store
dad|father
mom|mother
kid|child
place|location|site|spot
goal|aim|purpose|objective|target
rule|regulation|law
danger|risk|threat|hazard
chance|opportunity
result|outcome|consequence|effect
reason|cause
ability|skill|talent
enough|sufficient|adequate
often|frequently
maybe|perhaps|possibly
almost|nearly
mistake|error|fault
earth|world|globe
end|finish|conclude
make|create|produce
think|believe|consider
need|require
keep|maintain|retain
stop|halt|cease
try|attempt
ask|inquire
hide|conceal
fix|repair|mend
cheap|inexpensive
brave|courageous|bold
kind|gentle|generous
honest|sincere|frank
improve|enhance|better
destroy|ruin|demolish
allow|permit|let
forbid|ban|prohibit
`;
/* 語源パーツ: [パーツ|もとの 単語|できる 単語]。in は im-/il-/ir- にも なる */
const CG_DERIV_SRC=`
un|usual|unusual
un|able|unable
un|fair|unfair
un|like|unlike
un|employment|unemployment
un|known|unknown
un|happy|unhappy
un|kind|unkind
un|lucky|unlucky
un|safe|unsafe
un|necessary|unnecessary
re|use|reuse
re|view|review
re|build|rebuild
re|new|renew
re|produce|reproduce
re|place|replace
re|turn|return
re|call|recall
re|form|reform
re|location|relocation
re|convene|reconvene
re|write|rewrite
re|start|restart
dis|agree|disagree
dis|appear|disappear
dis|like|dislike
dis|cover|discover
dis|ability|disability
dis|information|disinformation
dis|place|displace
dis|close|disclose
dis|honest|dishonest
dis|courage|discourage
in|possible|impossible
in|patient|impatient
in|correct|incorrect
in|regular|irregular
in|legal|illegal
in|visible|invisible
in|equality|inequality
in|adequate|inadequate
in|credible|incredible
in|convenience|inconvenience
in|vertebrate|invertebrate
in|partial|impartial
in|polite|impolite
in|perfect|imperfect
mis|take|mistake
mis|understand|misunderstand
mis|lead|mislead
mis|information|misinformation
mis|conduct|misconduct
over|work|overwork
over|come|overcome
over|estimate|overestimate
over|time|overtime
over|see|oversee
over|throw|overthrow
over|pass|overpass
over|sleep|oversleep
under|line|underline
under|estimate|underestimate
under|graduate|undergraduate
under|ground|underground
under|water|underwater
pre|mature|premature
pre|view|preview
pre|history|prehistory
non|sense|nonsense
non|verbal|nonverbal
ful|care|careful
ful|use|useful
ful|wonder|wonderful
ful|cheer|cheerful
ful|peace|peaceful
ful|power|powerful
ful|meaning|meaningful
ful|harm|harmful
ful|respect|respectful
ful|success|successful
ful|delight|delightful
ful|help|helpful
ful|color|colorful
ful|beauty|beautiful
less|use|useless
less|care|careless
less|home|homeless
less|help|helpless
less|harm|harmless
less|count|countless
less|end|endless
less|flaw|flawless
less|hope|hopeless
less|meaning|meaningless
ness|sad|sadness
ness|kind|kindness
ness|ill|illness
ness|aware|awareness
ness|happy|happiness
ness|dark|darkness
ness|kind|kindness
ly|slow|slowly
ly|quick|quickly
ly|quiet|quietly
ly|clear|clearly
ly|real|really
ly|sudden|suddenly
ly|usual|usually
ly|careful|carefully
ly|friend|friendly
ly|complete|completely
ly|exact|exactly
ly|certain|certainly
ly|recent|recently
ly|near|nearly
ly|wide|widely
ly|natural|naturally
ly|gradual|gradually
ly|main|mainly
ly|brief|briefly
ly|obvious|obviously
ly|easy|easily
ly|happy|happily
able|comfort|comfortable
able|reason|reasonable
able|renew|renewable
able|sustain|sustainable
able|afford|affordable
able|port|portable
able|consider|considerable
able|respect|respectable
able|prefer|preferable
able|perish|perishable
able|enforce|enforceable
able|commend|commendable
able|value|valuable
er|teach|teacher
er|farm|farmer
er|sing|singer
er|play|player
er|lead|leader
er|work|worker
er|design|designer
er|report|reporter
er|employ|employer
er|research|researcher
er|publish|publisher
er|found|founder
er|foreign|foreigner
er|contain|container
er|paint|painter
er|write|writer
er|run|runner
er|dance|dancer
ment|govern|government
ment|announce|announcement
ment|employ|employment
ment|invest|investment
ment|treat|treatment
ment|punish|punishment
ment|improve|improvement
ment|achieve|achievement
ment|agree|agreement
ment|require|requirement
ment|amuse|amusement
ment|retire|retirement
ment|ship|shipment
ment|replace|replacement
ment|attach|attachment
ment|recruit|recruitment
ment|enroll|enrollment
ment|measure|measurement
ment|assign|assignment
ment|develop|development
ment|move|movement
ion|collect|collection
ion|invent|invention
ion|elect|election
ion|discuss|discussion
ion|express|expression
ion|product|production
ion|attract|attraction
ion|restrict|restriction
ion|exhibit|exhibition
ion|digest|digestion
ion|oppress|oppression
ion|act|action
ion|protect|protection
ion|direct|direction
y|rain|rainy
y|cloud|cloudy
y|wind|windy
y|sleep|sleepy
y|salt|salty
y|health|healthy
y|guilt|guilty
y|sun|sunny
y|snow|snowy
y|luck|lucky
ous|danger|dangerous
ous|fame|famous
al|tradition|traditional
al|emotion|emotional
al|profession|professional
al|logic|logical
al|region|regional
al|occasion|occasional
al|nation|national
al|music|musical
ive|attract|attractive
ive|impress|impressive
ive|excess|excessive
ive|distinct|distinctive
ive|assert|assertive
ive|act|active
ive|create|creative
`;
/* 文カード: ならべかえて 大技 [レベル|英文|意味] */
const CG_SENT_SRC=`
es|I like dogs.|わたしは 犬が 好き。
es|The sky is blue.|空は 青い。
es|Let's play soccer.|サッカーを しよう。
es|I am happy today.|きょうは うれしい。
es|This is my cat.|これは わたしの ねこです。
es|I can swim fast.|わたしは はやく 泳げる。
es|Do you like apples?|りんごは 好き？
es|She has a red hat.|かのじょは 赤い ぼうしを もっている。
es|We go to school.|わたしたちは 学校へ 行く。
es|Look at the stars!|星を 見て！
es|I want some water.|水が ほしい。
es|It is sunny today.|きょうは 晴れ。
jh|I have been to Kyoto twice.|京都には 2回 行ったことが ある。
jh|It started to rain heavily.|雨が 強く ふりはじめた。
jh|She made a big decision.|かのじょは 大きな 決断を した。
jh|Please take care of yourself.|おだいじに。
jh|I am looking forward to the trip.|旅行を 楽しみに している。
jh|He is good at playing the guitar.|かれは ギターを ひくのが 得意だ。
jh|We need to save energy.|エネルギーを 節約する 必要が ある。
jh|This book is easier than that one.|この 本は あの 本より やさしい。
jh|I caught a bad cold yesterday.|きのう ひどい かぜを ひいた。
jh|Let's take a short break.|少し ひと休みしよう。
jh|The man who lives next door is kind.|となりに 住む 男の人は やさしい。
jh|I don't know what to say.|なんと 言えば いいか わからない。
hs|We should protect the environment.|わたしたちは 環境を 守るべきだ。
hs|The meeting was put off until Friday.|会議は 金曜日まで 延期された。
hs|If I were you, I would apologize.|もし わたしが きみなら、 あやまるだろう。
hs|She is said to be a great scientist.|かのじょは 偉大な 科学者だと 言われている。
hs|It is important to keep your promise.|約束を 守ることは 大切だ。
hs|Climate change is a serious problem.|気候変動は 深刻な 問題だ。
adv|The policy had a significant impact on the economy.|その 政策は 経済に 大きな 影響を 与えた。
adv|We need to strike a balance between work and life.|仕事と 生活の バランスを とる 必要が ある。
adv|His argument does not hold water.|かれの 主張は つじつまが 合わない。
adv|The company decided to reduce costs.|その 会社は 費用を へらすことに した。
adv|Few people were aware of the risk.|その 危険に 気づいていた 人は ほとんど いなかった。
adv|The results shed light on the problem.|その 結果は 問題を 明らかにした。
`;
/* カードの 絵: 日本語の 意味に ふくまれる ことば → 絵文字（長い ことばから さがす。 2つ 見つかれば 2つの 絵の 組み合わせ） */
const CG_ART_SRC=`
悪化:📉 増加:📈 減少:📉 増大:📈 上昇:📈 低下:📉 拡大:🔍 縮小:🤏 改善:🔧 修理:🔧 回復:🌱 成長:🌱 発達:🌱 進化:🦖 進歩:🚀 発展:🏗️ 開発:🛠️ 発明:💡 発見:🔎 研究:🔬 実験:🧪 調査:🔍 分析:📊 統計:📊 データ:📊 数学:➗ 計算:🧮 科学:🔬 化学:⚗️ 物理:🧲 生物:🧬 遺伝:🧬 細胞:🦠 病気:🤒 病院:🏥 医者:🩺 医療:🩺 医学:🩺 薬:💊 治療:💉 手術:🏥 けが:🩹 健康:💪 運動:🏃 呼吸:🌬️ 心臓:❤️ 脳:🧠 記憶:🧠 思い出:📸 記録:📝 写真:📷 映画:🎬 音楽:🎵 歌:🎤 楽器:🎻 絵:🎨 芸術:🎨 美術:🖼️ 文学:📚 小説:📕 詩:📜 物語:📖 本:📘 辞書:📙 新聞:📰 報道:📰 ニュース:📰 雑誌:📰 放送:📡 番組:📺 広告:📣 宣伝:📣 情報:💡 通信:📡 電話:📞 手紙:✉️ メール:📧 郵便:📮 インターネット:🌐 コンピュータ:💻 機械:⚙️ 技術:🛠️ 道具:🔨 装置:⚙️ 電気:⚡ 電力:⚡ エネルギー:🔋 燃料:⛽ 石油:🛢️ 太陽:☀️ 月:🌙 星:⭐ 宇宙:🪐 惑星:🪐 地球:🌍 世界:🌏 国際:🌐 外国:🗺️ 国:🏳️ 政府:🏛️ 政治:🏛️ 選挙:🗳️ 投票:🗳️ 議会:🏛️ 法律:⚖️ 法:⚖️ 裁判:⚖️ 規則:📏 ルール:📏 犯罪:🚨 警察:👮 罪:⛓️ 罰:⛓️ 刑:⛓️ 戦争:⚔️ 戦い:⚔️ 争い:⚔️ 軍:🪖 武器:🗡️ 攻撃:💥 防御:🛡️ 守る:🛡️ 保護:🛡️ 安全:🦺 危険:⚠️ 危機:🚨 災害:🌪️ 地震:🌋 火事:🔥 火:🔥 燃:🔥 爆発:💥 平和:🕊️ 自由:🕊️ 権利:✊ 人権:✊ 平等:⚖️ 差別:🚫 禁止:🚫 許可:✅ 許:✅ 認め:👍 賛成:👍 反対:👎 拒否:🙅 断:🙅 同意:🤝 協力:🤝 協定:🤝 契約:📝 取引:🤝 交渉:🤝 会議:🗣️ 議論:💬 討論:💬 話:💬 言葉:💬 言語:🔤 文字:🔤 単語:🔤 文法:📐 意味:❓ 質問:❓ 問題:❓ 疑:🤨 答:💡 説明:🧑‍🏫 教:🧑‍🏫 学校:🏫 学生:🧑‍🎓 学ぶ:📚 学:🎓 勉強:✏️ 試験:📝 テスト:📝 成績:💯 知識:📚 知恵:🦉 考え:💭 思考:💭 考:💭 思:💭 想像:🌈 夢:💤 希望:🌟 目標:🎯 目的:🎯 計画:🗓️ 予定:🗓️ 予測:🔮 予想:🔮 将来:🔭 未来:🚀 過去:⏳ 歴史:🏺 古代:🏛️ 伝統:🎎 文化:🎎 宗教:⛩️ 神:⛩️ 祭:🎐 儀式:🕯️ 結婚:💒 家族:👨‍👩‍👧 子ども:🧒 子供:🧒 赤ちゃん:👶 親:👪 友:🧑‍🤝‍🧑 仲間:🧑‍🤝‍🧑 恋:💘 愛:💖 好き:💕 嫌:😖 怒:😠 悲し:😢 泣:😭 笑:😄 喜:😆 楽し:😆 幸せ:😊 幸:🍀 不安:😟 心配:😟 恐:😱 怖:😱 驚:😲 恥:😳 誇り:🦁 自信:😎 勇気:🦁 緊張:😬 落ち着:😌 穏やか:😌 静か:🤫 退屈:🥱 疲:😩 眠:😴 寝:🛌 起き:⏰ 時計:⏰ 時間:⏳ 時:🕰️ 日付:📅 期間:📅 年:📅 季節:🍂 春:🌸 夏:🌻 秋:🍁 冬:⛄ 雨:🌧️ 雪:❄️ 風:🌬️ 嵐:⛈️ 雲:☁️ 天気:🌤️ 気候:🌡️ 温度:🌡️ 気温:🌡️ 暑:🥵 寒:🥶 熱:🔥 冷:🧊 氷:🧊 水:💧 海:🌊 川:🏞️ 湖:🏞️ 山:⛰️ 森:🌲 木:🌳 花:🌼 草:🌿 植物:🪴 種:🌰 農業:🚜 農:🌾 畑:🌾 米:🍚 作物:🌾 食料:🍱 食べ物:🍱 食事:🍽️ 料理:🍳 食:🍴 飲:🥤 味:😋 甘:🍬 苦:☕ 野菜:🥦 果物:🍎 肉:🍖 魚:🐟 動物:🐾 鳥:🐦 犬:🐕 猫:🐈 虫:🐛 環境:🌍 自然:🍃 汚染:🏭 ごみ:🗑️ 廃棄:🗑️ 資源:♻️ リサイクル:♻️ 工場:🏭 産業:🏭 製造:🏭 生産:🏭 製品:📦 商品:🛍️ 品:📦 荷物:📦 配達:🚚 輸送:🚚 物流:🚚 輸出:🚢 輸入:🚢 貿易:🚢 船:🚢 飛行機:✈️ 空港:🛫 旅:🧳 観光:🗺️ 旅行:🧳 ホテル:🏨 予約:📅 道:🛣️ 交通:🚦 車:🚗 電車:🚃 駅:🚉 橋:🌉 建物:🏢 建設:🏗️ 建:🏗️ 家:🏠 部屋:🚪 住:🏡 町:🏘️ 都市:🏙️ 村:🛖 地域:🗾 地方:🗾 土地:🗺️ 地図:🗺️ 場所:📍 位置:📍 方向:🧭 距離:📏 長さ:📏 大きさ:📐 形:🔷 色:🎨 光:💡 明る:💡 暗:🌑 影:👤 音:🔊 声:🗣️ 見:👀 聞:👂 触:✋ 手:✋ 足:🦶 頭:🧠 顔:🙂 目:👁️ 体:🧍 身体:🧍 人口:👥 社会:👥 人々:👥 人間:🧑 人:🧑 者:🧑 員:🧑‍💼 社員:🧑‍💼 会社:🏢 企業:🏢 経営:📈 経済:💹 市場:📈 株:📈 投資:💹 金融:🏦 銀行:🏦 お金:💰 金:💰 費用:💸 費:💸 価格:🏷️ 値段:🏷️ 値:🏷️ 支払:💳 払:💳 給料:💴 給:💴 税:🧾 料金:🧾 料:🧾 収入:💴 収:💴 利益:💰 損:📉 借:🤲 貸:🤲 売:🏪 買:🛒 店:🏪 客:🙋 顧客:🙋 サービス:🛎️ 仕事:💼 職:💼 働:🛠️ 労働:🛠️ 雇:🤝 採用:🤝 退職:👋 引退:👋 辞:👋 管理:🗂️ 組織:🏢 リーダー:👑 指導:🧭 導:🧭 責任:🎒 義務:📌 役割:🎭 役:🎭 能力:💪 力:💪 強:💪 弱:🥀 速:⚡ 遅:🐢 早:⚡ 急:💨 速度:⚡ 重:🏋️ 軽:🪶 高:⬆️ 低:⬇️ 上:⬆️ 下:⬇️ 前:⬅️ 後:➡️ 内:📥 外:📤 入:📥 出:📤 開:🔓 閉:🔒 始:🏁 終:🏁 完了:✅ 完全:💯 成功:🏆 勝:🏆 失敗:💥 負:🏳️ 失:🕳️ 消:💨 現れ:✨ 変化:🔄 変:🔄 変え:🔄 交換:🔁 換:🔁 戻:↩️ 返:↩️ 繰り返:🔁 続:➰ 止:✋ 待:⏳ 急ぐ:💨 走:🏃 歩:🚶 泳:🏊 飛:🕊️ 跳:🦘 登:🧗 落:⬇️ 投:🤾 打:🏏 押:👉 引:🧲 運:🚚 持:🤲 取:✊ 置:📍 送:📨 受:📩 届:📬 与え:🎁 贈:🎁 もらう:🎁 得:🎁 集:🧺 選:☝️ 決:✅ 確認:✅ 確:✔️ 正:⭕ 誤:❌ 違:❌ 間違:❌ 正確:🎯 正し:⭕ 真実:💎 本当:💎 うそ:🤥 偽:🎭 秘密:🤫 隠:🫣 示:👉 表:📋 現:✨ 描:🖌️ 書:✍️ 読:📖 記:📝 作:🛠️ 造:🛠️ 創:✨ 壊:💥 破:💥 切:✂️ 結:🔗 関係:🔗 関:🔗 連:🔗 つな:🔗 接:🔗 分:➗ 割:➗ 加:➕ 合:➕ 増:📈 減:📉 多:🧺 少:🤏 量:⚖️ 数:🔢 比:⚖️ 同:🟰 似:👯 異:🔀 差:↔️ 違い:↔️ 例:📌 特別:🌟 特:🌟 普通:⚪ 一般:⚪ 珍し:🦄 主:👑 中心:🎯 重要:❗ 必要:❗ 必:❗ 要:❗ 注意:⚠️ 注:⚠️ 警告:⚠️ 助:🆘 救:🛟 支援:🤝 支:🤝 援:🤝 協:🤝 世話:🤲 親切:🤗 優し:🤗 厳し:😤 礼:🙇 謝:🙇 感謝:🙏 頼:🙏 願:🙏 祈:🙏 信:🙏 尊敬:🙇 尊:🙇 評価:⭐ 評:⭐ 判断:⚖️ 判:⚖️ 選択:☝️ 決定:✅ 意見:🗨️ 主張:📢 提案:💡 提:💡 案:💡 求:🙋 要求:🙋 申:🙋 応:↩️ 反応:↩️ 影響:🌊 効果:✨ 効:✨ 結果:🏁 原因:🔍 理由:❓ 条件:📋 状態:🌡️ 状況:🌡️ 様子:👀 性格:🧩 性:🧩 個人:🧍 自分:🪞 自:🪞 他人:👥 相手:🤺 相互:🔁 共:🤝 独:🧍 孤独:🧍 一人:🧍 全:💯 完:💯 部分:🧩 部:🧩 一部:🧩 組:🧩 型:🔷 種類:🗃️ 類:🗃️ 分類:🗃️ 基:🧱 基本:🧱 基礎:🧱 根:🌱 元:🌱 源:⛲ 起源:🌱 生:🌱 命:💓 死:🪦 殺:🗡️ 生活:🏠 暮らし:🏠 日常:☕ 習慣:🔁 癖:🔁 趣味:🎲 遊:🎲 ゲーム:🎮 スポーツ:⚽ 試合:🏟️ 競:🏁 練習:🏋️ 訓練:🏋️ 努力:💦 頑張:💪 挑戦:🧗 冒険:🗺️ 旅立:🧳 出発:🛫 到着:🛬 着:🛬 参加:🙋 参:🙋 集会:👥 会:👥 式:🎊 祝:🎉 誕生:🎂 贈り物:🎁 服:👕 着る:👕 靴:👟 帽子:🧢 鏡:🪞 鍵:🔑 箱:📦 袋:🛍️ 紙:📄 布:🧵 糸:🧵 石:🪨 鉄:⛓️ 金属:🔩 木材:🪵 材料:🧱 素材:🧱 物質:⚗️ 液体:💧 気体:💨 空気:🌬️ ガス:💨 酸素:🫧 原子:⚛️ 分子:⚛️ 電子:⚛️ 磁:🧲 重力:🍎 波:🌊 振動:〰️ 音楽:🎶 リズム:🥁 踊:💃 劇:🎭 演:🎭 舞台:🎭 俳優:🎭 作家:✍️ 著者:✍️ 画家:🎨 写:📷 撮:📷 映:🎞️ 画:🖼️ 像:🗿 彫:🗿 美:🌹 醜:👹 きれい:✨ 汚:🦨 清潔:🧼 掃除:🧹 洗:🧼 片付:🧹 整理:🗂️ 準備:🎒 用意:🎒 計:📐 設計:📐 図:📐 線:📏 点:📍 面:⬜ 角:📐 円:⭕ 丸:⭕ 四角:⬛ 横:↔️ 縦:↕️ 広:↔️ 狭:🤏 深:🌊 浅:🏖️ 厚:📚 薄:📄 細:🤏 太:🍩 長:📏 短:✂️ 古:🏺 新:✨ 若:🌱 老:👴 年配:👴 大人:🧑 子:🧒 女:👩 男:👨 父:👨 母:👩 兄:👦 姉:👧 弟:👦 妹:👧 祖:👴 夫:🤵 妻:👰 王:👑 王様:👑 英雄:🦸 敵:👿 悪:😈 善:😇 正義:⚖️ 公平:⚖️ 公正:⚖️ 不正:🚫 不:🚫 非:🚫 無:🚫 有:✅ 可能:🟢 能:🟢 難:🧗 易:🍃 簡単:🍃 複雑:🌀 混乱:🌀 乱:🌀 整:📐 順:🔢 次:⏭️ 最初:1️⃣ 最後:🏁 最:🥇 第:🥇 一:1️⃣ 二:2️⃣ 三:3️⃣ 百:💯 千:🔢 万:🔢 億:🔢 倍:✖️ 半:🌗 毎:🔁 常:♾️ 永遠:♾️ 突然:⚡ 偶然:🎲 たぶん:🤔 確か:✔️ 絶対:💯 決して:🙅 全く:💯 非常:‼️ とても:‼️ かなり:‼️ 少し:🤏 ほとんど:🤏 まだ:⏳ すでに:✅ もう:✅ いつも:🔁 時々:🔀 しばしば:🔁 めったに:🦄 再:🔁 また:🔁 さらに:➕ しかし:↩️ だから:➡️ ので:➡️ ため:🎯 もし:🤔 ～:〰️
感じる:💗 ついていく:👣 育つ:🌱 起こる:❗ 望む:🌠 保つ:🤲 たずねる:❓ こわす:💥 おおう:🫥 渡る:🌉 紹介:🤝 気づく:💡 推測:🤔 理解:💡 くつろぐ:🛋️ びん:🍾 経験:🧗 伝言:📝 プラスチック:🧴 スピーチ:🎤 象徴:🕊️ ボランティア:🙋 市民:👥 群衆:👥 活動:🏃 行事:🎎 卒業:🎓 事務所:🏢 報告:📋 ポスター:🪧 岩:🪨 砂:🏖️ 油:🛢️ 葉:🍃 痛:🤕 涙:😢 休:🛌 傷:🩹 できる:🙆 明らか:💡 わくわく:🤩 すばらしい:🌟 実は:🤫 ついに:🏁 ただ:☝️ ときどき:🔀 ふだん:☕ 世紀:🏛️ 瞬間:⚡ パーセント:💯 すぐに:💨 以来:⏮️ まで:⏭️ について:💬 あとで:⏭️ 沿って:🛤️ まわり:🔄 なぜなら:➡️ 間に:↔️ 通って:🚇 方へ:➡️ なしで:🚫 よりも:⚖️ けれども:↩️ たくさん:🧺 つもり:🎯 しなければ:❗ したい:🌠 さがす:🔍 たとえば:📌 おたがい:🔁 となり:👫 もちろん:👌 おかげ:🙏 ような:👯 娘:👧 ふたご:👯 ペット:🐕 居間:🛋️ かべ:🧱 床:🟫 階段:🪜 庭:🏡 門:⛩️ 近所:🏘️ デザート:🍮 小麦粉:🌾 バター:🧈 こしょう:🧂 ゆでる:🥚 焼く:🔥 におい:👃 空腹:🍽️ 授業:🧑‍🏫 クラスメート:🧑‍🤝‍🧑 ノート:📓 休暇:🏖️ 黒板:🧑‍🏫 チーム:👥 コーチ:📣 キャプテン:🧢 トーナメント:🏆 マラソン:🏃 背番号:🔢 ファン:📣 まんが:📚 カメラ:📷 コンサート:🎤 つり:🎣 ハイキング:🥾 園芸:🌷 パズル:🧩 港:⚓ 塔:🗼 タワー:🗼 城:🏰 レストラン:🍽️ デパート:🏬 モール:🛍️ 通り:🛣️ ツアー:🚌 パスポート:🛂 座席:💺 バス停:🚏 乗りかえ:🔁 おみやげ:🎁 丘:⛰️ 谷:🏞️ 砂漠:🏜️ ジャングル:🌴 岸:🏖️ 池:🦆 滝:🏞️ どうくつ:🕳️ 土:🟫 ながめ:🌅 大陸:🌎 日かげ:⛱️ あらし:⛈️ 雷:⚡ いなずま:⚡ 霧:🌫️ 乾:🏜️ 暖か:🔆 予報:📡 クジラ:🐋 イルカ:🐬 ワシ:🦅 カンガルー:🦘 枝:🌿 咲く:🌸 巣:🪺 えさ:🍞 狩り:🏹 しっぽ:🐾 つばさ:🪽 羽:🪶 せき:😷 腹痛:🤢 歯:🦷 看護師:🧑‍⚕️ 皮ふ:🖐️ 骨:🦴 血:🩸 肺:🫁 のど:🗣️ うれしい:😊 さびしい:🥺 動揺:😥 勇敢:🦁 やさしい:🤗 弁護士:🧑‍⚖️ パイロット:🧑‍✈️ 大工:🪚 デザイナー:✏️ 英語:🔤 フランス:🇫🇷 スペイン:🇪🇸 ドイツ:🇩🇪 ロシア:🇷🇺 アジア:🌏 ヨーロッパ:🌍 アフリカ:🌍 アメリカ:🌎 イタリア:🇮🇹 秒:⏱️ 真夜中:🌌 今夜:🌃 週:📅 いつか:🔮 あさって:📅 昼:☀️ 今日:📅 昔:🏺 ダース:🥚 いくつか:🔢 測る:📏 ガラス:🥛 コップ:🥛 綿:☁️ 絹:🧣 銀:🥈 やわらか:☁️ 羊毛:🐑 言う:🗣️ 叫ぶ:📢 ささやく:🤫 約束:🤙 言い争う:😤 文句:😤 あいさつ:👋 冗談:😜 知って:💡 覚え:🧠 忘れ:💭 気にかけ:💞 好む:💕 感心:👏 乗る:🚌 訪れ:🚪 滞在:🏨 行進:🥁 すべる:🛝 転が:⚽ スキップ:💃 はう:🐛 ひざまず:🧎 みがく:✨ 身につけ:👕 脱ぐ:👕 そうじ:🧹 つける:💡 使う:🔧 捨てる:🗑️ 直す:🔧 アイロン:👔 成しとげ:🏆 なんとか:💦 とける:🫠 こおる:🧊 かわいい:🥰 みにくい:👹 うるさい:📢 忙し:🏃 単純:🔹 奇妙:🌀 ふつう:⚪ 巨大:🐘 せまい:🤏 うすい:📄 いっぱい:🈵 空の:🫙 貧しい:🥺 安い:🏷️ ゆるい:👖 優れ:🥇 ひどい:😖 快適:🛋️ 便利:🧰 すばやい:⚡ かしこい:🦉 りこう:🦉 賢明:🦉 ゆっくり:🐢 すばやく:⚡ はっきり:🔆 いっしょ:👫 ひとり:🧍 代わり:🔁 とにかく:👉 ちょうど:🎯 ほぼ:🤏 きわめて:‼️ わずか:🤏 もはや:🚫 そば:👫 中へ:📥 越え:🦘 除いて:➖ 限り:📏 向こう:🏝️ かどうか:🤔 ほか:➕ それぞれ:👥
`;

/* 属性: [キー, 絵, 名前, 色] */
const CG_ATTR=[['ani','🐾','いきもの','#3fa76a'],['food','🍙','たべもの','#e0803a'],['nat','🌿','しぜん','#2f9bb8'],['heart','💗','きもち','#d9578f'],
 ['act','🏃','うごき','#d95c3a'],['look','🎨','ようす','#8a63d2'],['life','🏠','くらし','#c49a2c'],['learn','📚','まなび','#3d6fc4'],['word','💬','ことば','#5a8c8c']];
/* 単語帳の 本の 名前 → 属性（上から 順に さがす。「動詞」「形容詞」「名詞」だけの 本は 日本語の 形で きめる） */
const CG_ATTR_RULE=[['ani',/どうぶつ|いきもの|動物|植物|生物/],['food',/たべもの|くだもの|やさい|のみもの|食事|料理|食・農|農業・食|食料/],
 ['nat',/てんき|しぜん|自然|天気|気候|宇宙|地球|環境|海・浜辺|地形|災害|物理|化学|エネルギー|つき・きせつ/],
 ['heart',/きもち|心|気持ち|性格|感情|心理|考える・感じる|考え/],
 ['word',/あいさつ|かず|ようび|しつもん|時・数量|前置詞|表現|熟語|イディオム|会話|数・量|日付|つなぐ|つなぎ|さす言葉|論説|論理|副詞・つなぎ|くに・ぎょうじ|国・言語/],
 ['life',/かぞく|ひと|からだ|がっこう|いえ|まち|のりもの|スポーツ|あそび|しごと|ふく|家族|学校|部活|趣味|町|交通|旅|体・健康|仕事|家の中|服|道具|音楽|行事|健康|人と人|ホテル|オフィス|出張|日常|色・形|いろ・かたち/],
 ['act',/動詞|うごき|動く|話す・伝える|生活の動作|変わる|句動詞|変化|make/],
 ['look',/形容詞|ようす|副詞/],
 ['learn',/./]];
/* レベル: コスト（ことだまの 力）・パワー・色・パックの 値段 */
const CG_LV={es:{k:'小',n:'小学生',c:1,p:2,col:'#4cbf78',pack:60,one:30,sh:1,tr:10},jh:{k:'中',n:'中学生',c:2,p:4,col:'#3f86e0',pack:100,one:50,sh:2,tr:20},
 hs:{k:'高',n:'高校生',c:3,p:6,col:'#9a62e0',pack:150,one:80,sh:3,tr:35},adv:{k:'H',n:'ハイレベル',c:4,p:9,col:'#e0a91a',pack:220,one:120,sh:5,tr:60}};
/* 語源パーツの 意味 */
const CG_PARTS={un:['un-','〜でない'],re:['re-','もう一度・もとへ'],dis:['dis-','反対・はなれる'],in:['in- / im-','〜でない'],mis:['mis-','まちがって'],over:['over-','こえて・しすぎ'],
 under:['under-','下に・たりない'],pre:['pre-','前に'],non:['non-','〜でない'],ful:['-ful','〜で いっぱい'],less:['-less','〜が ない'],ness:['-ness','〜な こと（名詞に）'],
 ly:['-ly','〜に（ようすを 言う）'],able:['-able','〜できる'],er:['-er','〜する 人・もの'],ment:['-ment','〜する こと（名詞に）'],ion:['-ion','〜する こと（名詞に）'],
 y:['-y','〜っぽい・〜の 多い'],ous:['-ous','〜の 多い'],al:['-al','〜の・〜に 関する'],ive:['-ive','〜な せいしつの']};
/* 段位: [名前, ひつような ポイント, ひらく もの] */
const CG_RANKS=[['10級',0,'基本の ルールと ことばコンボ・小の パック'],['9級',2,'📖 相手の 単語を 読む・中の パック'],['8級',5,'⚡ 反対語カウンター・テーマパック'],
 ['7級',9,'🛡️ なかまガード'],['6級',14,'🔄 変身（動詞の 活用）・高の パック'],['5級',20,'🧩 語源パーツ・パーツパック'],['4級',27,'📜 文カードと 連鎖・ハイレベルの パック'],
 ['3級',35,'🏆 浜辺の カード大会'],['2級',44,'✨ きらきら 宝パック'],['1級',54,'👑 ミナ先生に 本気で いどめる'],['初段',66,'🎖️ 初段の しるし'],['二段',80,'🎖️ 二段の しるし'],['三段',96,'🎖️ 三段の しるし'],['名人',120,'🌟 ことばカード名人']];
/* ルールが ひらく 段位（CG_RANKS の 番号） */
const CG_RULE_AT={read:1,counter:2,guard:3,morph:4,parts:5,sent:6,tour:7};

/* 対戦相手（浜辺の みんな）: lv=つかう レベル, at=得意な 属性, p=正解率, hp=ほし, need=ひらく 段位, pt=勝つと もらえる 段位ポイント, sp=得意技
   hi/win(あなたが 勝った)/lose(あなたが 負けた)/sp(技の ひとこと) は [英語, 日本語] */
const CG_FOES=[
 {id:'nagi',n:'ナギ',ico:'🧑‍🦱',d:'カード屋の 店長。 練習相手',lv:['es'],at:[],p:.55,hp:24,need:0,pt:0,coin:15,
  sp:{n:'てかげん',d:'さいしょの 2ターンは 半分の 力',k:'easy'},hi:["Let's practice! Take your time.","練習しよう！ ゆっくりで いいよ。"],win:["Nice! You're getting it!","いいね！ わかってきたね！"],lose:["Good try! Let's go again.","いい ちょうせん！ もう 1回 やろう。"],spl:["I'll go easy on you!","手かげん するよ！"]},
 {id:'sora',n:'ソラ',ico:'👧',d:'6さい。 どうぶつ デッキ',lv:['es'],at:['ani','food'],p:.6,hp:28,need:0,pt:1,coin:30,
  sp:{n:'なかよしハグ',d:'ほしが 6 もどる',k:'heal',v:6},hi:["Let's play! I love animal cards!","あそぼ！ どうぶつの カード、 大好き！"],win:["Aww... You're so strong!","うー… つよーい！"],lose:["Yay! I won! Let's play again!","やったー！ かった！ また あそぼ！"],spl:["Big hug! I feel better!","ぎゅー！ げんき でた！"]},
 {id:'pochi',n:'ポチ',ico:'🐶',d:'食いしんぼう。 たべもの デッキ',lv:['es'],at:['food'],p:.62,hp:30,need:0,pt:1,coin:30,
  sp:{n:'おかわり',d:'カードを 2まい 引いて もう いちど 出す',k:'again'},hi:["Woof! Food cards are the best cards!","ワン！ たべものの カードが 最強だワン！"],win:["Woof... I'm hungry now.","ワン… おなか すいた。"],lose:["Woof woof! I win! Treat time!","ワンワン！ かった！ おやつの 時間！"],spl:["Seconds, please!","おかわり！"]},
 {id:'kanio',n:'カニオ',ico:'🦀',d:'数が 好き。 ことば デッキ',lv:['es','jh'],at:['word','look'],p:.66,hp:32,need:1,pt:2,coin:40,
  sp:{n:'よこばさみ',d:'3の ダメージを 2回',k:'pinch',v:3},hi:["Snip snip! Count your cards carefully!","チョキチョキ！ カードは よく 数えてね！"],win:["Snip... You counted better than me.","チョキ… きみの ほうが 数えるの うまいね。"],lose:["Snip! One, two, I win!","チョキ！ いち、 に、 ぼくの かち！"],spl:["Side pinch! Snip, snip!","よこばさみ！ チョキチョキ！"]},
 {id:'hana',n:'ハナさん',ico:'🍧',d:'かき氷屋さん。 あまい デッキ',lv:['es','jh'],at:['food','heart'],p:.68,hp:32,need:1,pt:2,coin:40,
  sp:{n:'かき氷ブリザード',d:'つぎの ターン、 あなたの ことだまが 2 へる',k:'freeze',v:2},hi:["Hello! Let's have a sweet game!","こんにちは！ あまーい 勝負に しましょ！"],win:["Wow, you melted my ice!","わあ、 わたしの 氷が とけちゃった！"],lose:["Ha ha! Sweet victory!","あはは！ あまい 勝利！"],spl:["Shaved ice blizzard!","かき氷ブリザード！"]},
 {id:'taku',n:'タク',ico:'⚽',d:'中学生。 うごき デッキ',lv:['jh'],at:['act','life'],p:.72,hp:36,need:2,pt:2,coin:50,
  sp:{n:'ハットトリック',d:'つぎの コンボが 3ばい',k:'combo3'},hi:["Ready? I'm not going to lose!","じゅんび いい？ 負けないからな！"],win:["Man... Good game! Let's play again.","くそー… いい 試合だった！ またやろう。"],lose:["Goal! I win this one!","ゴール！ この 試合は おれの かち！"],spl:["Hat trick! Three in a row!","ハットトリック！ 3れんぞく！"]},
 {id:'emma',n:'エマ',ico:'🧳',d:'カナダからの 旅行者。 くらし デッキ',lv:['jh'],at:['life','word'],p:.74,hp:36,need:2,pt:2,coin:50,
  sp:{n:'より道',d:'あなたは つぎの ターン カードを 引けない',k:'nodraw'},hi:["Hi! I learned this game on my trip. Let's play!","ハイ！ 旅で この ゲームを おぼえたの。 やろう！"],win:["Oh no, I'm lost again! Well played!","あら、 また まいごに なっちゃった！ おみごと！"],lose:["I won! Even travelers can win sometimes!","かった！ 旅人だって たまには かつのよ！"],spl:["Let's take a little detour!","ちょっと より道 しましょ！"]},
 {id:'gen',n:'ゲンじい',ico:'👴',d:'つりびと。 しぜん デッキ',lv:['jh','hs'],at:['nat','ani'],p:.75,hp:38,need:3,pt:3,coin:60,
  sp:{n:'大物つり',d:'あなたの 手札から 1まい つりあげて 使う',k:'steal'},hi:["Eh? A card game? Oh ho, I'm good at waiting.","え？ カード？ ほっほ、 待つのは とくいじゃよ。"],win:["Oh ho... The big one got away.","ほっほ… 大物に にげられたわい。"],lose:["Oh ho! A big catch today!","ほっほ！ きょうは 大漁じゃ！"],spl:["Here comes the big one!","大物が かかったぞ！"]},
 {id:'leo',n:'レオ',ico:'🎸',d:'ギターの お兄さん。 きもち デッキ',lv:['jh','hs'],at:['heart','look'],p:.78,hp:40,need:3,pt:3,coin:60,
  sp:{n:'アンコール',d:'さっきの ターンの ダメージを もう 半分',k:'encore'},hi:["Let's make some music with words.","ことばで 音楽を つくろうぜ。"],win:["Nice rhythm. You won.","いい リズムだ。 きみの かち。"],lose:["Thanks for listening. That's my song.","聞いて くれて ありがとう。 これが おれの 歌さ。"],spl:["Encore! One more time!","アンコール！ もう いちど！"]},
 {id:'zuzu',n:'ズーズー',ico:'👽',d:'星から 来た子。 しぜん・まなび デッキ',lv:['hs'],at:['nat','learn'],p:.8,hp:42,need:4,pt:3,coin:70,
  sp:{n:'ワープ',d:'つぎの カードは 読めない・ふせげない',k:'warp'},hi:["Beep! Earth words are very interesting. Let's battle!","ピピッ！ 地球の ことばは おもしろい。 勝負だ！"],win:["Beep... Data says you are strong.","ピピ… データに よると きみは つよい。"],lose:["Beep boop! Victory data saved!","ピピポ！ 勝利データを 保存！"],spl:["Warp! You can't see this one!","ワープ！ これは 見えないよ！"]},
 {id:'kame',n:'カメ吉',ico:'🐢',d:'100さいの カメ。 まなび デッキ',lv:['hs'],at:['learn','word'],p:.82,hp:44,need:5,pt:4,coin:80,
  sp:{n:'百年の 知恵',d:'ほしが 10 もどる',k:'heal',v:10},hi:["Slowly... and surely... Let's play.","ゆっくり… 確実に… 勝負じゃ。"],win:["You are... quick... and wise.","きみは… はやくて… かしこい。"],lose:["Slow and steady... wins the race.","ゆっくりでも… 着実が 勝つ。"],spl:["One hundred years... of wisdom.","百年の… 知恵じゃ。"]},
 {id:'nora',n:'ノラさん',ico:'👩‍🦳',d:'雑貨店の 店主。 くらし・ようす デッキ',lv:['hs','adv'],at:['life','look'],p:.84,hp:46,need:6,pt:4,coin:90,
  sp:{n:'ピップの ものまね',d:'あなたの さいごの コンボと 同じ ダメージ',k:'mimic'},hi:["Oh, a card battle? Pip and I won't go easy.","カード勝負？ ピップと わたしは 手かげん しないわよ。"],win:["My, my. You've become quite the player.","まあまあ。 すっかり 一人前ね。"],lose:["Pip says, 'Try again! Try again!'","ピップが 「もう いっかい！ もう いっかい！」 ですって。"],spl:["Pip, copy that combo!","ピップ、 その コンボを まねして！"]},
 {id:'fuku',n:'フクロウ博士',ico:'🦉',d:'夜の 物知り。 ハイレベル デッキ',lv:['adv'],at:['learn','act'],p:.88,hp:48,need:7,pt:5,coin:110,
  sp:{n:'夜の 講義',d:'つぎの あなたの 問題は 5択で ヒントなし',k:'hard'},hi:["Hoo. Let us see how deep your vocabulary goes.","ホウ。 きみの 語彙の 深さを 見せてもらおう。"],win:["Hoo... A splendid performance.","ホウ… みごとな 戦いだった。"],lose:["Hoo. Knowledge is a lifelong journey.","ホウ。 学びは 一生の 旅じゃよ。"],spl:["Time for a night lecture.","夜の 講義の 時間じゃ。"]},
 {id:'mina',n:'ミナ先生',ico:'👩‍🏫',d:'さいきょう。 ぜんぶの レベルと コンボ',lv:['jh','hs','adv'],at:[],p:.93,hp:55,need:8,pt:6,coin:150,mina:1,
  sp:{n:'とくべつ授業',d:'コンボを 2回 つづけて 出す',k:'lesson'},hi:["A card battle with me? Okay, I won't hold back today!","わたしと カード勝負？ いいよ、 きょうは 手かげん しないからね！"],win:["Wow... You beat me. I'm really proud of you.","すごい… 負けちゃった。 ほんとに ほこらしいよ。"],lose:["I won this time! But your combos were great.","こんかいは わたしの かち！ でも コンボ、 すごかったよ。"],spl:["Special lesson! Watch closely!","とくべつ授業！ よく 見ててね！"]}];

/* カード屋の ナギと 英語で 買いもの: レベルごとの やりとり。 [ナギ, [正しい, まちがい, まちがい], 説明] */
const CG_BUY_TALK={
 es:[[["Hi! What can I get for you?","いらっしゃい！ なにに する？"],["A pack, please.","I am a pack.","Pack is you."],'「〜, please.」で 「〜を ください」'],
  [["Hello! Do you want a pack?","こんにちは！ パック いる？"],["Yes, please!","Yes, I am.","No, thank."],'「Yes, please.」は 「はい、 おねがいします」'],
  [["That's the price. Here's your pack!","この 値段だよ。 はい、 パック！"],["Thank you!","You're welcome!","Sorry!"],'もらったら 「Thank you!」'],
  [["Which pack do you like?","どの パックが いい？"],["This one, please.","This is one.","One this."],'「This one, please.」で 「これを ください」']],
 jh:[[["Hi there! What would you like?","いらっしゃい！ なにが いい？"],["Can I have a pack, please?","Can you have a pack?","I can a pack, please."],'「Can I have 〜?」は 「〜を もらえますか」'],
  [["How many would you like?","いくつ ほしい？"],["Just one, please.","I'm one, please.","Many one."],'「How many 〜?」には 数で 答えるよ'],
  [["That's the price. Is that okay?","この 値段だけど いい？"],["Sure. Here you are.","Sure. Here are you.","Sure. You are here."],'お金を わたすときは 「Here you are.」'],
  [["Are you looking for anything special?","なにか さがしてる？"],["I'm looking for strong cards.","I'm looking strong cards.","I look at for strong cards."],'「look for 〜」で 「〜を さがす」']],
 hs:[[["Good to see you! What can I do for you today?","いらっしゃい！ きょうは なにを？"],["I'd like to buy a pack, please.","I'd like buying a pack.","I like to bought a pack."],'「I\'d like to 〜」は ていねいな 「〜したいです」'],
  [["Would you like me to wrap it?","つつみましょうか？"],["No, thank you. I'll open it now.","No, thank you. I open it yesterday.","No, thanks you."],'「I\'ll 〜」で 「いまから 〜する」'],
  [["Any particular theme in mind?","なにか テーマは 決まってる？"],["I was wondering if you have a combo-friendly pack.","I wonder you have combo pack?","I was wonder if have a pack."],'「I was wondering if 〜」は とても ていねいな たずね方'],
  [["Here you go. Good luck with your deck!","どうぞ。 デッキづくり がんばって！"],["Thanks! I'll let you know how it goes.","Thanks! I'll let you know how does it go.","Thanks! I let know you."],'「how it goes」（間接疑問）の 語順に 注意']]};
/* ねらいうち注文・1まい売りの ひとこと */
const CG_NAGI={
 hi:[["Welcome to Shiosai Cards!","カードショップ しおさいへ ようこそ！"],["Every word is a card here. Which one will you meet today?","ここでは どの 単語も カードに なるんだ。 きょうは どれに 会える？"],["Check today's single cards! They change every day.","きょうの 1まい売りを 見てね！ 毎日 かわるよ。"],["Want to know a secret? Natural word pairs make the strongest combos.","ひみつを 教えようか？ 英語として 自然な ペアが いちばん 強い コンボに なるんだ。"],["If you answer the quiz right, your card gets full power.","問題に 正解すると カードは フルパワーだよ。"]],
 first:[["Oh, a new face! Here, take this starter deck. It's on me!","おや、 はじめての お客さん！ はい、 スターターデッキ。 プレゼントだよ！"],"ナギが 小学生の 単語カード 20まいの デッキを くれた！"],
 snipe:["Which word should I order for you? I can get any card, once a day.","どの 単語を 取りよせようか？ 1日 1まい、 どの カードでも 取りよせるよ。"],
 dup:["Got doubles? Turn them into shards, or fuse them to make a card stronger.","ダブった カードは かけらに したり、 合成して ★を 上げたり できるよ。"]};

/* 浜辺の カード大会: 試合の あいだの 英語の 会話（相手 or 司会の カモメ） [だれ, 英語, 日本語, [正しい, まちがい, まちがい], 説明] */
const CG_TOUR_TALK=[
 ['📣',"Welcome to the Beach Card Cup! Are you ready?","浜辺の カード大会へ ようこそ！ じゅんびは いい？",["Yes, I'm ready!","Yes, I'm readying.","Yes, ready am I."],'「I\'m ready.」で 「じゅんび できてる」'],
 ['📣',"Round one is over. How do you feel?","1回戦 しゅうりょう！ いまの 気分は？",["I feel great!","I feel greatly.","I am feel great."],'feel の あとは ようすの ことば（great）'],
 ['📣',"What was your favorite combo?","いちばん よかった コンボは？",["Heavy rain was my favorite.","Heavy rain is favorite of me.","My favorite heavy rain."],'「〜 was my favorite.」'],
 ['📣',"The semifinal is next. Any words for your fans?","つぎは じゅんけっしょう！ ファンに ひとこと！",["Thank you for cheering for me!","Thank you for cheer me!","Thanks you cheering!"],'「Thank you for 〜ing」'],
 ['📣',"You made it to the final! Your opponent is Ms. Mina!","決勝進出！ 相手は ミナ先生！",["I'll do my best!","I'll do my better!","I do best will!"],'「do my best」は 「ベストを つくす」'],
 ['📣',"What did you learn today?","きょうは なにを 学んだ？",["I learned a lot of new combos.","I learned many new combo yesterday.","I learn a lot new combo."],'「a lot of 〜」＋ 複数形'],
 ['📣',"Take a deep breath. Are you nervous?","深呼吸して。 きんちょうしてる？",["A little, but I'm excited.","A little, but I'm exciting.","Little, I excited."],'自分の 気持ちは excited（わくわく している）。 exciting は 「わくわく させる」'],
 ['📣',"Your opponent says hello. Say something back!","相手が あいさつ してるよ。 なにか 返して！",["Nice to meet you. Let's have a good game!","Nice to meet you. Let's good game!","Meet you nice!"],'「Let\'s have a good game!」で 「いい 試合に しよう」']];
