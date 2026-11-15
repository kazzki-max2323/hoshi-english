/* 📖 カードの「くわしく」: 単語ごとの 説明・例文・形の かわり方・ワンポイント。
   - 手書きの データは game/winfo-data*.js（WINFO_SRC に 1行1語: 見出し|品詞|説明|例文EN|例文JA|ワンポイント。 空欄は 空のまま）
     品詞: n 名詞 / nu 数えられない名詞 / np 複数形で使う名詞 / v 動詞 / a 形容詞 / ad 副詞 / p 前置詞 / c 接続詞 / pr 代名詞 / i あいさつ・ひとこと / ph 熟語 / x そのほか（空欄なら 自動）
   - 例文が 手書きに ない 単語は game/winfo-ex.js（アプリの 中の 英文から tools/build-word-ex.js で えらんだ もの）
   - 動詞の 活用・名詞の 複数形・形容詞の 比較は ここの 規則と 不規則の 表で 作る
   つかう ところ: cg.js の detail()（カードの 大きい 画面）。 */
(()=>{
/* ---------------------------------------------------------------- 不規則動詞（原形 過去形 過去分詞。 / は どちらも 使う） */
const IRR_SRC=`arise arose arisen|awake awoke awoken|be was/were been|bear bore born/borne|beat beat beaten|become became become|begin began begun|bend bent bent|bet bet bet|bind bound bound|bite bit bitten|bleed bled bled|blow blew blown|break broke broken|breed bred bred|bring brought brought|broadcast broadcast broadcast|build built built|burn burned/burnt burned/burnt|burst burst burst|buy bought bought|cast cast cast|catch caught caught|choose chose chosen|cling clung clung|come came come|cost cost cost|creep crept crept|cut cut cut|deal dealt dealt|dig dug dug|dive dived/dove dived|do did done|draw drew drawn|dream dreamed/dreamt dreamed/dreamt|drink drank drunk|drive drove driven|eat ate eaten|fall fell fallen|feed fed fed|feel felt felt|fight fought fought|find found found|flee fled fled|fling flung flung|fly flew flown|forbid forbade forbidden|forecast forecast forecast|foresee foresaw foreseen|foretell foretold foretold|forget forgot forgotten|forgive forgave forgiven|freeze froze frozen|get got got/gotten|give gave given|go went gone|grind ground ground|grow grew grown|hang hung hung|have had had|hear heard heard|hide hid hidden|hit hit hit|hold held held|hurt hurt hurt|keep kept kept|kneel knelt/kneeled knelt/kneeled|know knew known|lay laid laid|lead led led|lean leaned leaned|leap leaped/leapt leaped/leapt|learn learned learned|leave left left|lend lent lent|let let let|lie lay lain|light lit/lighted lit/lighted|lose lost lost|make made made|mean meant meant|meet met met|mislead misled misled|mistake mistook mistaken|misunderstand misunderstood misunderstood|overcome overcame overcome|overdo overdid overdone|overhear overheard overheard|overlook overlooked overlooked|oversee oversaw overseen|oversleep overslept overslept|overtake overtook overtaken|overthrow overthrew overthrown|pay paid paid|prove proved proved/proven|put put put|quit quit quit|read read read|rebuild rebuilt rebuilt|redo redid redone|repay repaid repaid|reset reset reset|rethink rethought rethought|retell retold retold|rewrite rewrote rewritten|rid rid rid|ride rode ridden|ring rang rung|rise rose risen|run ran run|say said said|see saw seen|seek sought sought|sell sold sold|send sent sent|set set set|sew sewed sewn/sewed|shake shook shaken|shed shed shed|shine shone/shined shone/shined|shoot shot shot|show showed shown|shrink shrank shrunk|shut shut shut|sing sang sung|sink sank sunk|sit sat sat|sleep slept slept|slide slid slid|sling slung slung|slit slit slit|sow sowed sown/sowed|speak spoke spoken|speed sped sped|spell spelled spelled|spend spent spent|spill spilled spilled|spin spun spun|spit spat spat|split split split|spoil spoiled spoiled|spread spread spread|spring sprang sprung|stand stood stood|steal stole stolen|stick stuck stuck|sting stung stung|stink stank stunk|stride strode stridden|strike struck struck|strive strove striven|swear swore sworn|sweep swept swept|swell swelled swollen/swelled|swim swam swum|swing swung swung|take took taken|teach taught taught|tear tore torn|tell told told|think thought thought|throw threw thrown|thrust thrust thrust|tread trod trodden|undergo underwent undergone|underlie underlay underlain|understand understood understood|undertake undertook undertaken|undo undid undone|uphold upheld upheld|upset upset upset|wake woke woken|wear wore worn|weave wove woven|weep wept wept|wet wet wet|win won won|wind wound wound|withdraw withdrew withdrawn|withhold withheld withheld|withstand withstood withstood|wring wrung wrung|write wrote written|outdo outdid outdone|outgrow outgrew outgrown|outrun outran outrun|outweigh outweighed outweighed|offset offset offset|input input input|output output output|upload uploaded uploaded|bid bid bid|behold beheld beheld|befall befell befallen|beset beset beset|inlay inlaid inlaid|overhang overhung overhung|override overrode overridden|overrun overran overrun|oversell oversold oversold|overspend overspent overspent|overturn overturned overturned|mislay mislaid mislaid|misspell misspelled misspelled|mistype mistyped mistyped|outsell outsold outsold|outshine outshone outshone|underwrite underwrote underwritten|undercut undercut undercut|underpay underpaid underpaid|outbid outbid outbid|sublet sublet sublet|typeset typeset typeset|frostbite frostbit frostbitten|forgo forwent forgone|troubleshoot troubleshot troubleshot|proofread proofread proofread|overeat overate overeaten|overpay overpaid overpaid|outgrow outgrew outgrown|uphold upheld upheld|overdraw overdrew overdrawn|unwind unwound unwound|spoon-feed spoon-fed spoon-fed`;
const IRR={};IRR_SRC.split('|').forEach(l=>{const [b,p,pp]=l.trim().split(' ');IRR[b]=[p,pp]});
/* -s を つける とき 形が かわる */
const S3={be:'is',have:'has',do:'does',go:'goes'};
/* 2音節以上で 最後の 子音を 重ねる 動詞（アクセントが うしろ） */
const DBL=new Set('admit begin commit compel confer control defer deter emit equip expel extol forbid forget incur infer occur omit patrol permit prefer propel rebel recur refer regret remit repel submit transfer transmit acquit abet abhor allot annul befit beget compel concur dispel excel impel instil outwit overlap overstep patrol rebut regret unwrap upset kidnap handicap offset program format'.split(' '));
/* -c → -ck */
const CK=new Set('panic picnic mimic traffic frolic'.split(' '));

/* ---------------------------------------------------------------- 名詞 */
const PLU_IRR={child:'children',man:'men',woman:'women',person:'people',foot:'feet',tooth:'teeth',goose:'geese',mouse:'mice',louse:'lice',ox:'oxen',
  fish:'fish',sheep:'sheep',deer:'deer',salmon:'salmon',trout:'trout',moose:'moose',bison:'bison',aircraft:'aircraft',spacecraft:'spacecraft',series:'series',species:'species',means:'means',
  knife:'knives',wife:'wives',life:'lives',leaf:'leaves',half:'halves',wolf:'wolves',shelf:'shelves',thief:'thieves',calf:'calves',loaf:'loaves',self:'selves',sheaf:'sheaves',scarf:'scarves',
  potato:'potatoes',tomato:'tomatoes',hero:'heroes',echo:'echoes',veto:'vetoes',torpedo:'torpedoes',mosquito:'mosquitoes',volcano:'volcanoes',
  crisis:'crises',analysis:'analyses',hypothesis:'hypotheses',thesis:'theses',basis:'bases',diagnosis:'diagnoses',synthesis:'syntheses',emphasis:'emphases',oasis:'oases',parenthesis:'parentheses',axis:'axes',
  phenomenon:'phenomena',criterion:'criteria',datum:'data',medium:'media',bacterium:'bacteria',curriculum:'curricula',memorandum:'memoranda',stratum:'strata',
  stimulus:'stimuli',nucleus:'nuclei',fungus:'fungi',cactus:'cacti',radius:'radii',alumnus:'alumni',syllabus:'syllabi',focus:'focuses',
  formula:'formulas',larva:'larvae',vertebra:'vertebrae',antenna:'antennas',appendix:'appendixes',index:'indexes',matrix:'matrices',vortex:'vortices',
  passerby:'passersby','passer-by':'passers-by','mother-in-law':'mothers-in-law','father-in-law':'fathers-in-law','son-in-law':'sons-in-law','daughter-in-law':'daughters-in-law'};
/* 数えられない名詞（複数形を 出さない） */
const UNC=new Set(`water milk juice tea coffee rice bread money homework information advice music news furniture baggage luggage weather sugar salt snow rain air hair butter cheese meat soup
 jam oil gas ice sand soap paper wood glass gold silver iron chocolate pasta flour honey cream yogurt ketchup mayonnaise pepper toast cereal spaghetti popcorn
 knowledge research evidence equipment traffic progress happiness health peace love fun work luck help trouble damage pollution scenery garbage trash rubbish mail
 software hardware feedback homework housework stuff clothing jewelry machinery merchandise vocabulary grammar english japanese math science history art
 music soccer baseball tennis basketball volleyball badminton golf swimming skiing dancing cooking shopping camping fishing reading writing singing
 sunshine lightning thunder fog heat electricity energy oxygen hydrogen carbon wealth poverty freedom justice violence courage patience wisdom honesty
 safety security education employment unemployment inflation transportation infrastructure access insurance tourism agriculture literature physics chemistry biology economics
 breakfast lunch dinner sushi blood soil glue wildlife data fashion calligraphy sleep rest anger fear joy nature tofu miso natto curry
 seaweed spinach garlic ginger corn pork beef`.trim().split(/\s+/));
/* 複数形を 出さない 本（色・数・曜日・あいさつ など） */
const NOPL_BOOK=/いろ|かず|ようび|つき・きせつ|あいさつ|しつもん|くに・|時間・日付|数・量|色・形|国・言語|きょうか|スポーツ|部活|趣味/;
const ING_C=/^(building|painting|meeting|feeling|crossing|ending|beginning|wedding|earring|ring|king|thing|string|wing|spring|ceiling|evening|morning|recording|drawing|being|saying|setting|opening|offering|finding|warning|blessing|gathering|helping|serving|stocking|sibling|darling|duckling|seedling|pudding|dumpling|herring|filling|landing|hearing|ruling|listing|rating|ranking|booking|posting|heading|clipping|calling|outing|happening|belongings|savings|surroundings)$/;
/* 名詞の 前の a / an が まちがえやすい もの */
const AN_YU=/^(uni|use|usu|uti|eu|ewe|one|once|ukulele|uranium|urine|utopia|unique|uniform|union|unit|universe|university|unicorn)/;
const AN_H=/^(hour|honest|honor|honour|heir|herb)/;

/* ---------------------------------------------------------------- 形容詞 */
const CMP_IRR={good:['better','best'],well:['better','best'],bad:['worse','worst'],ill:['worse','worst'],far:['farther','farthest'],little:['less','least'],many:['more','most'],much:['more','most'],
  shy:['shyer','shyest']};
/* 1音節でも more / most */
const CMP_MORE=new Set('real fun just tired bored scared pleased worn'.split(' '));
/* 2音節で -er / -est に する もの */
const CMP_ER=new Set('simple gentle narrow quiet shallow humble noble clever subtle'.split(' '));
/* 比べる 形に しない（〜かどうか だけの ことば） */
const NOCMP=new Set(`dead alive pregnant wooden golden plastic metal main only whole entire perfect unique ultimate total final daily weekly monthly yearly annual
 empty full right wrong correct true false same different own other first last next previous former latter single double married single
 japanese english american chinese french korean british german italian spanish digital electric electronic nuclear solar lunar medical legal
 physical chemical biological global national international local public private official social political economic cultural historical
 male female human animal vegetarian free asleep awake alone afraid aware unable able favorite ready okay ok open closed
 square round dear unknown`.trim().split(/\s+/));

/* ---------------------------------------------------------------- 手書きデータ */
let HAND=null;
function hand(){if(HAND)return HAND;HAND={};
  (window.WINFO_SRC||[]).forEach(src=>src.split('\n').forEach(l=>{l=l.trim();if(!l||l.startsWith('#'))return;const f=l.split('|').map(x=>x.trim());
    const h=f[0].toLowerCase();if(!h)return;const o=HAND[h]||{};
    if(f[1])o.pos=f[1];if(f[2])o.d=f[2];if(f[3])o.ex=[f[3],f[4]||''];if(f[5])o.tip=f[5];HAND[h]=o}));
  return HAND}
/* k==='t'（宝カード）なら @見出し を 先に */
const get=(h,k)=>{h=String(h||'').toLowerCase();const H=hand();return (k==='t'&&H['@'+h])||H[h]||null};
const exOf=(h,k)=>{const x=get(h,k);if(x&&x.ex)return x.ex;const a=window.WINFO_EX&&WINFO_EX[String(h||'').toLowerCase()];return a||null};

/* ---------------------------------------------------------------- 品詞 */
const POSN={n:'名詞',nu:'名詞',np:'名詞',v:'動詞',a:'形容詞',ad:'副詞',p:'前置詞',c:'接続詞',pr:'代名詞',i:'あいさつ',ph:'熟語',x:''};
/* テーマの 本の 中の 名詞では ない ことば */
const FUNC={each:'x',every:'x',both:'x',all:'x',some:'x',any:'x',another:'x',other:'x',others:'pr',someone:'pr',anyone:'pr',something:'pr',anything:'pr',everything:'pr',nothing:'pr',
  everyone:'pr',everybody:'pr',somebody:'pr',anybody:'pr',nobody:'pr',somewhere:'ad',anywhere:'ad',everywhere:'ad',nowhere:'ad',twice:'ad',ago:'ad',later:'ad',soon:'ad',
  since:'x',until:'x',during:'p',many:'x',much:'x',few:'x',little:'x',several:'x',enough:'x',like:'v',online:'a',upset:'a',calm:'a',proud:'a',wild:'a',sick:'a',ill:'a',warm:'a',
  common:'a',cool:'a',hot:'a',cold:'n',free:'a',busy:'a',fine:'a',kind:'a',sure:'a',ready:'a',alone:'a',together:'ad',again:'ad',already:'ad',yet:'ad',still:'ad',often:'ad',
  always:'ad',usually:'ad',sometimes:'ad',never:'ad',here:'ad',there:'ad',today:'ad',tomorrow:'ad',yesterday:'ad',tonight:'ad',now:'ad',then:'ad',very:'ad',too:'ad',also:'ad',
  including:'p',disagree:'v',drought:'n','op-ed':'n',similar:'a',sibling:'n',nowadays:'ad',afterwards:'ad',mars:'n',paralympics:'n',diabetes:'nu',
  yes:'i',no:'i',hello:'i',goodbye:'i',please:'i',sorry:'i',ok:'i',okay:'i',hi:'i',bye:'i',wow:'i',oops:'i'};
const NOUN_I=/(違い|思い|願い|争い|戦い|払い|祝い|迷い|笑い|誓い|扱い|集い|救い|占い|手伝い|気遣い|間違い|付き合い|知り合い|話し合い|見舞い|お見舞い|味わい|勢い|類い|災い|幸い|匂い|臭い|住まい|振る舞い|行い|装い|奪い合い)$/;
const SING_S=new Set('bus gas lens atlas canvas chaos news series species means physics mathematics economics politics ethics athletics statistics gymnastics thanks christmas iris virus bonus campus census circus status focus genius chorus cactus octopus walrus hippopotamus platypus asparagus hummus citrus'.split(' '));
const VERB_JA=/(する|る|う|く|す|つ|む|ぶ|ぐ|ぬ)$/;
const jaCore=ja=>String(ja||'').replace(/（.*?）|\(.*?\)/g,'').split(/[・、,／/]/)[0].trim();
/* I: cg.js の info()。 bt＝単語帳の 本の 名前 */
function pos(I){const x=get(I.h,I.k);if(x&&x.pos)return x.pos;
  if(I.k==='t')return 'n';if(I.k!=='w')return 'x';
  const bt=I.bt||'',ja=jaCore(I.ja),en=I.h;
  if(/不規則に変わる動詞/.test(bt))return 'v';
  if(/\s/.test(en)||/熟語|イディオム|句動詞|表現|あいさつ|make \/ take/.test(bt))return 'ph';
  if(/前置詞|つなぎ|つなぐ|接続詞|論説|論理の言葉/.test(bt))return 'x';
  if(/副詞/.test(bt))return /ly$/.test(en)||/(に|く|と|て)$/.test(ja)?'ad':'x';
  if(/動詞|うごき|動く|話す・伝える|生活の動作|変わる・できる|考える・感じる/.test(bt))return VERB_JA.test(ja)&&!/(こと|もの|さ)$/.test(ja)?'v':/(い|な|の)$/.test(ja)?'a':'n';
  if(/形容詞|ようす/.test(bt))return /(い|な|の|的)$/.test(ja)||/[ぁ-ん]$/.test(ja)?'a':'n';
  if(/名詞/.test(bt))return 'n';
  /* テーマの 本: 名詞が 多い。 日本語の おわりと 英語の つづりで 動詞・形容詞を 見わける（さる・かえる など かなの 名詞も あるので 気をつける） */
  if(en==='fine'&&/罰金/.test(ja))return 'n';
  if(FUNC[en])return FUNC[en];
  const kan=/[一-龥]/.test(ja);
  if(/ly$/.test(en)&&/(に|く|と)$/.test(ja))return 'ad';
  if(/する$/.test(ja))return 'v';
  if(/[^e]ed$/.test(en)&&en!=='hundred')return 'a';
  if(/(のある|がある|になる)$/.test(ja))return 'a';
  if(/(ble|ive|ous|ful|ing)$/.test(en)&&/る$/.test(ja))return 'a';
  if(kan&&/[うくすつぬむるぐぶ]$/.test(ja)&&!/[一-龥]る$/.test(ja))return 'v';
  if(I.lv!=='es'&&/[いきしちにひみりぎじびえけせてねへめれげぜでべ]る$/.test(ja))return 'v';
  if(/(y|ous|ful|al|ic|ive|ent|ant|ish|less|ble|ing|id|ar)$/.test(en)&&/(た|の|い|て)$/.test(ja)&&!/もの$/.test(ja)&&!NOUN_I.test(ja)&&!ING_C.test(en))return 'a';
  if(kan&&/(の|た|した)$/.test(ja)&&!/もの$/.test(ja))return 'a';
  if(kan&&/[一-龥ぁ-ん]い$/.test(ja)&&!NOUN_I.test(ja)&&!/[えけせてねへめれげぜでべ]い$/.test(ja))return 'a';
  if(/[^su]s$/.test(en)&&!/(is|as|ics)$/.test(en)&&!SING_S.has(en))return 'np';
  return 'n'}

/* 単語帳で 動詞と して 出てくる ことば（熟語の 1語目が 動詞か 見る） */
let VSET=null;
const PH_BOOK=/熟語|イディオム|句動詞|表現|make|動詞|うごき|動く|動作|話す|考える|変わる|会話|よく使う|英検|TOEIC|頻出/;
const VBASE='look watch call turn pick wait help laugh listen work talk walk play stay ask answer check clean cook fill hand point pass pull push put set show stand step switch try use wake warm wash wear work bring keep hold'.split(' ');
function isVerb(w){if(!VSET){VSET=new Set([...Object.keys(IRR),...VBASE]);const L=window.LEVELS||{};
    Object.keys(L).forEach(lv=>(L[lv].books||[]).forEach(b=>b.w.forEach(x=>{const h=String(x[0]).split(',')[0].trim().toLowerCase();
      if(/^[a-z]+$/.test(h)&&pos({k:'w',h,en:x[0],ja:x[1],bt:b.t})==='v')VSET.add(h)})))}
  return VSET.has(w)}
/* ---------------------------------------------------------------- 動詞の 形 */
const V='aeiou';
const cvc=w=>/[^aeiou][aeiou][^aeiouwxy]$/.test(w)&&!/^(qu)/.test(w.slice(-4,-2))&&syl(w)===1;
function syl(w){const g=w.replace(/e$/,'').match(/[aeiouy]+/g);return g?g.length:1}
const dbl=w=>w==='quit'||w==='quiz'||cvc(w)||DBL.has(w);
function s3(w){if(S3[w])return S3[w];if(/(s|x|z|ch|sh|o)$/.test(w))return w+'es';if(/[^aeiou]y$/.test(w))return w.slice(0,-1)+'ies';return w+'s'}
function ing(w){if(w==='be')return 'being';if(/ie$/.test(w))return w.slice(0,-2)+'ying';
  if(/[^aeiouy]e$/.test(w)&&!/(ee|ye|oe)$/.test(w)&&w!=='singe')return w.slice(0,-1)+'ing';
  if(/ue$/.test(w))return w.slice(0,-1)+'ing';
  if(CK.has(w))return w+'king';if(dbl(w))return w+w.slice(-1)+'ing';return w+'ing'}
function ed(w){if(/e$/.test(w))return w+'d';if(/[^aeiou]y$/.test(w))return w.slice(0,-1)+'ied';if(CK.has(w))return w+'ked';if(dbl(w))return w+w.slice(-1)+'ed';return w+'ed'}
/* 1語の 動詞の 形: {base,s,ing,past,pp,irr} */
function verb(w,ja){w=w.toLowerCase();if(!/^[a-z]+$/.test(w))return null;const r=w==='lie'&&/うそ/.test(ja||'')?null:IRR[w];
  return {base:w,s:s3(w),ing:ing(w),past:r?r[0]:ed(w),pp:r?r[1]:ed(w),irr:!!r&&!(r[0]===ed(w)&&r[1]===ed(w))}}

/* ---------------------------------------------------------------- 名詞・形容詞の 形 */
function plural(w){w=w.toLowerCase();if(PLU_IRR[w])return PLU_IRR[w];
  if(/(s|x|z|ch|sh)$/.test(w))return w+'es';if(/[^aeiou]y$/.test(w))return w.slice(0,-1)+'ies';return w+'s'}
function article(w){w=w.toLowerCase();if(AN_YU.test(w))return 'a';if(AN_H.test(w))return 'an';return /^[aeiou]/.test(w)?'an':'a'}
function compare(w){w=w.toLowerCase();if(CMP_IRR[w])return CMP_IRR[w];if(NOCMP.has(w))return null;const n=syl(w);
  if(CMP_MORE.has(w)||/(ed|ing)$/.test(w)&&n>1||/(ful|less|ous|ive|al|ic|ish|able|ible|ant|ent|ar|ern|ese)$/.test(w)&&n>1)return ['more '+w,'most '+w];
  if(n===1){if(/e$/.test(w))return [w+'r',w+'st'];if(cvc(w))return [w+w.slice(-1)+'er',w+w.slice(-1)+'est'];if(/[^aeiou]y$/.test(w))return [w.slice(0,-1)+'ier',w.slice(0,-1)+'iest'];return [w+'er',w+'est']}
  if(n===2&&/[^aeiou]y$/.test(w))return [w.slice(0,-1)+'ier',w.slice(0,-1)+'iest'];
  if(CMP_ER.has(w))return /e$/.test(w)?[w+'r',w+'st']:[w+'er',w+'est'];
  return ['more '+w,'most '+w]}

/* ---------------------------------------------------------------- 形の かわり方（表示用） */
/* forms: 「teach, taught, taught」の ように 本に 書いてある 形が あれば それを 使う */
function forms(I){const p=pos(I),en=String(I.en||''),h=I.h,out={p,rows:[],tips:[]};
  if(p==='v'){const given=/^[a-z]+, [a-z/]+, [a-z/]+$/i.test(en)?en.split(', '):null,w=given?given[0]:h;const f=verb(w,I.ja);if(!f)return out;
    if(given){f.past=given[1];f.pp=given[2];f.irr=true}
    out.rows=[[f.s,'he / she が 主語のとき'],[f.ing,'〜している（ing形）'],[f.past,'〜した（過去形）'],[f.pp,'過去分詞（have ＋ / 〜される）']];
    if(f.irr)out.tips.push(`不規則動詞。 <b>${f.base} – ${f.past} – ${f.pp}</b> と 3つ セットで 声に 出して おぼえよう`);
    else if(f.ing!==f.base+'ing'&&f.ing.slice(-4,-3)===f.ing.slice(-5,-4)&&!/e$/.test(f.base))out.tips.push(`つづりに 注意: 最後の 字を 重ねて <b>${f.ing}</b> / <b>${f.past}</b>`);
    else if(/[^aeiou]y$/.test(f.base))out.tips.push(`y で おわる 動詞は y を i に かえて <b>${f.past}</b>・<b>${f.s}</b>（ing は <b>${f.ing}</b> の まま）`);
    else if(/ie$/.test(f.base))out.tips.push(`ie で おわる 動詞の ing は <b>${f.ing}</b>（ie → y）`);
    else if(/[^aeiouy]e$/.test(f.base)&&!/(ee|ye|oe)$/.test(f.base))out.tips.push(`e で おわる 動詞は e を とって <b>${f.ing}</b>、 過去形は d だけ つけて <b>${f.past}</b>`);
    return out}
  if(p==='ph'){const m=h.match(/^([a-z]+)( .+)$/);if(!m||m[1]==='be')return out;const f=verb(m[1]);if(!f)return out;
    /* 動詞で はじまる 熟語だけ（日本語が 動詞の 形の とき） */
    if(/\//.test(h)||!(isVerb(m[1])&&VERB_JA.test(jaCore(I.ja))&&(I.k!=='w'||PH_BOOK.test(I.bt||''))))return out;if(/^(a|an|the|in|on|at|by|for|of|to|with|as|so|no|not|all|at|out|up|from|after|before|each|every|one|how|what|why|this|that|very|too|more|most|less|first|last|once|long|right|just|even|ever|never|kind|sort|thank|thanks|excuse)$/.test(m[1]))return out;
    out.rows=[[f.s+m[2],'he / she が 主語のとき'],[f.ing+m[2],'〜している（ing形）'],[f.past+m[2],'〜した（過去形）']];return out}
  if((p==='n'||p==='np'||p==='nu')&&/^[a-z-]+$/.test(h)){if(/^[A-Z]/.test(en)||NOPL_BOOK.test(I.bt||''))return out;
    if(I.k==='t'){const t=(window.CARDS_DATA||[]).find(c=>c[1]===en);if(!t||!/^(land|bird|sea|bug|myth|job|ride|wear|item|plant|place)$/.test(t[3]))return out}
    const pl=plural(h),irr=!!PLU_IRR[h];
    if(p==='np'){out.tips.push(`ふつう 複数形の <b>${h}</b> で 使う ことば（${/^(pants|jeans|shorts|glasses|scissors|pajamas|trousers|chopsticks)$/.test(h)?'1つでも '+h+'。 数えるときは a pair of '+h:'s が ついた 形が 基本'}）`);return out}
    const hp=(get(h,I.k)||{}).pos;
    if(p==='nu'||hp!=='n'&&(UNC.has(h)||/ness$/.test(h)||/ing$/.test(h)&&!ING_C.test(h))&&!irr)return Object.assign(out,{unc:1});
    if(irr||I.lv==='es'||I.lv==='jh'||I.k==='t'){out.rows=[[`${article(h)} ${h}`,'1つ'],[pl,'2つ以上']];
      if(irr)out.tips.push(pl===h?`複数でも 形が かわらない: <b>one ${h} / two ${pl}</b>`:`複数形は 形が かわる: <b>${h} → ${pl}</b>`);
      else if(/[^aeiou]y$/.test(h))out.tips.push(`y で おわる ことばの 複数形は y を i に かえて <b>${pl}</b>`);
      if(article(h)==='an')out.tips.push(`母音（ア・イ・ウ・エ・オ の 音）で はじまるので <b>an</b> ${h}`);
      else if(/^[aeiou]/.test(h))out.tips.push(`つづりは ${h[0]} でも 「ユ」の 音で はじまるので <b>a</b> ${h}（an では ない）`)}
    return out}
  if(p==='a'&&/^[a-z]+$/.test(h)&&I.lv!=='adv'){const c=compare(h);if(c){out.rows=[[c[0],'比較級（より 〜）'],[c[1],'最上級（いちばん 〜）']];
      if(CMP_IRR[h])out.tips.push(`比べる 形が 不規則: <b>${h} – ${c[0]} – ${c[1]}</b>`);
      else if(/^more /.test(c[0])&&syl(h)>=2)out.tips.push(`長い 形容詞は er を つけずに <b>more</b> / <b>most</b> を 前に おく`)}}
  return out}

/* ---------------------------------------------------------------- 声 */
function speak(en){try{if(!window.speechSynthesis||(window.BEACH&&BEACH.S&&!BEACH.S.sound))return;speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(en);u.lang='en-US';
  u.rate=window.BEACH&&BEACH.S&&BEACH.S.slow?.75:.92;speechSynthesis.speak(u)}catch(e){}}

window.WI={get,exOf,pos,POSN,forms,verb,plural,compare,article,speak,hand,IRR,UNC};
})();

/* ---------------------------------------------------------------- ミナ先生・ミオの ひとこと（📖 くわしく の 案内） */
(()=>{
const ML=(k,v)=>{try{return MINA.line(k,v||{})}catch(e){return ['smile','']}};
if(window.MINA_LINES)Object.assign(MINA_LINES,{
 sh_wiNew:[['wow','カードの 📖くわしく が 新しく なったよ！ その ことばの 説明・例文・形の かわり方・ワンポイントが 入ってるの'],
  ['happy','カードを タップして 📖くわしく を ひらいてみて。 動詞なら 過去形や ing形、 名詞なら 複数形も 見られるよ']],
 x_shWi:[['smile','カードの 📖くわしく、 のぞいてみた？ 例文の 🔊を 聞いて まねすると、 単語が 文の 中で 使えるように なるよ'],
  ['think','単語は 意味だけじゃなくて、 形の かわり方も セットで 覚えると 強いよ。 カードの 📖くわしく を 見てみよう'],
  ['happy','わからない 単語が あったら、 カードの 📖くわしく に ワンポイントが あるかも。 先生の おすすめの 見方だよ']],
 x_shWiMany:[['proud','📖くわしく、 もう {n}回も 見たんだね。 調べる くせが ついてる 人は ぐんぐん のびるよ'],
  ['happy','{n}回 くわしく を ひらいたね！ 例文を 1つ 声に 出して 読んでから 寝ると、 あしたも 覚えてるよ']]});
const goShop=()=>['🃏 カードショップへ',()=>{try{CG.open()}catch(e){}}];
if(window.MINA_SENSE&&MINA_SENSE._rules)MINA_SENSE._rules.push(
 ['x_shWi',1,()=>{try{const r=CG.rec();if(!SHOP.rec().met||(r.wiSeen||0)>=3)return null;return Object.keys(r.c||{}).length>=10?{}:null}catch(e){return null}},goShop],
 ['x_shWiMany',1,()=>{try{const n=CG.rec().wiSeen||0;return n>=20?{n}:null}catch(e){return null}},goShop]);
/* 新しく なったことを 1回だけ */
setTimeout(function first(){try{const S=SHOP.rec();if(S.wiTold||!S.met)return;const m=window.MINA;if(!m||!m.canAnnounce||!m.canAnnounce())return setTimeout(first,20000);
  S.wiTold=1;CG.save();const [ex,tx]=ML('sh_wiNew');m.say('m',ex,tx,10000,null,goShop())}catch(e){}},40000);
/* ミオの あいさつにも */
try{MIO_HI.push(["Boss, tap a card and open \"More\". There are example sentences and tips now!","店長、 カードを タップして 「📖くわしく」を ひらいてみて。 例文や ワンポイントが 入りましたよ！"],
 ["I checked the past form of \"swim\" in the card's notes. Swam! I always forget.","カードの くわしく で swim の 過去形 見ました。 swam！ いつも わすれちゃう。"],
 ["When I don't know a word, I read the example sentence out loud. It really helps!","知らない 単語は、 くわしく の 例文を 声に 出して 読むんです。 けっこう 効きますよ！"])}catch(e){}
})();
