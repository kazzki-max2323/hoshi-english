/* 英文の 中に 文法ノートの 文法を 見つける しくみ（文法の めがね）。
   - GRAM_PAT: 文法ノートの id → その 文法が 出てくる 英文の 形（正規表現）。上ほど くわしい 文法（先に えらぶ）
   - 読める英文が 増える: 持っている ノートの 文法は、ラジオ・会話の 英文で 光る（タップで ルール）。
     見つけた 英文は ノートごとに 5つまで のこり、ノートの 画面に「浜辺で 見つけた この文法」として 出る（ST.gram.seen / ST.gram.rn）
   - まちがえた文から 誘う: ラジオの 文で まちがえたら、その 文の 文法を ミナ先生が 教えて、おためし・ノートへ さそう
   - 会話の 文法の 答え（game/kaiwa-story.js の G(...)）や エンドの 文法一覧も ここを つかう
   文法ノートを 足したら ここの GRAM_PAT にも 足す。セリフは game/mina-talk.js の gs_ / x_gs で はじまる 場面 */
const GRAM_PAT=[
 /* 高校生 */
 ['hs_modperf',/\b(must|should|shouldn't|could|couldn't|might|may|can't|would)\s+have\s+(been|\w+ed|known|done|gone|seen|left|taken|forgotten|eaten|fallen|lost|had|made)\b/i],
 ['hs_subj2',/\bif\s+\w+\s+had\s+(\w+ed|been|known|done|gone|seen|taken|had|made)\b|\b(would|could|might)\s+have\s+\w+ed\b|\bas if\b|\bif it (were|was) not for\b|\bit'?s (about |high )?time\b|\bwithout\s+\w+.*\bwould\b/i],
 ['hs_tense',/\bhad\s+(already\s+|never\s+|just\s+|ever\s+)?(been|\w+ed|seen|done|gone|eaten|lost|left|found|made|known|taken|forgotten|heard|met)\b|\bwill have\s+(\w+ed|been|done|gone|finished)\b/i],
 ['hs_passive2',/\b(is|are|was|were|am)\s+being\s+\w+(ed|en)\b|\b(has|have|had)\s+been\s+(\w+ed|made|seen|built|found|known|eaten|taken|given|done|written|told|sold|broken)\b|\b(will|can|must|should|may)\s+be\s+(\w+ed|made|seen|done|taken|given|found)\b|\b(is|are|was|were)\s+said\s+to\b/i],
 ['jh_perfprog',/\b(have|has|'ve)\s+been\s+\w+ing\b/i],
 ['hs_emph',/\bit\s+(is|was)\s+(\w+\s+){1,3}(that|who)\b(?!.*\?)|\bnot only\b|\b(never|rarely|seldom|little|hardly)\s+(have|has|had|did|do|does|will|was|is|could)\s+(I|you|he|she|we|they|it)\b/i],
 ['hs_neg',/\bnot\s+(all|always|every|necessarily)\b|\b(hardly|scarcely|barely|seldom|rarely)\b|\bno longer\b|\bfar from\b|\banything but\b|\bcan(not|'t) help\b|\bnever fail/i],
 ['hs_partc',/^(?!(?:Good|Morning|Evening|Nothing|Something|Anything|Everything|During|According)\b)[A-Z][a-z]+ing\b[^,.!?]*,|^Having\s+\w+/],
 ['hs_reladv',/\b(place|day|reason|time|house|town|beach|year|city|room|way)\s+(where|when|why)\b|\bthat'?s (why|how|where)\b|\bthis is (why|how|where)\b/i],
 ['hs_rel2',/,\s*which\b|\b(in|on|at|with|for|about)\s+which\b|\b(whoever|whatever|whichever|wherever|whenever)\b|^what\s+(I|you|he|she|we|they)\s+\w+\s+(is|was)\b/i],
 ['hs_comp2',/\bthe\s+\w+er,?\s+the\s+\w+er\b|\bno other\b|\b(twice|\w+ times)\s+as\s+\w+\s+as\b|\btwice as much\b|\bno (more|less) than\b|\bnot so much\b|\bmuch (more|less|better|worse)\b/i],
 ['hs_speech',/\b(said|says)\s+(that\b|(he|she|they|I|you|we)\s+('d|would|was|were|had|will|could))|\btold\s+(me|him|her|us|them)\s+(that|to)\b|\basked\s+(me|him|her|us|them)\s+(if|whether|to)\b|\bsaid (he|she|they)'d\b/i],
 ['hs_seq',/\b(thought|knew|believed|heard|hoped|was sure|found out)\s+(that\s+)?(I|you|he|she|it|we|they)\s+(was|were|would|could|had)\b/i],
 ['hs_caus',/\b(make|makes|made|let|lets|have|has|had|get|gets|got|help|helps|helped)\s+(me|you|him|her|us|them|it)\s+(?!a\b|an\b|the\b|some\b|to\b|up\b|out\b|in\b|on\b)(go|come|do|try|see|eat|play|feel|think|cry|laugh|sing|wait|know|stay|work|look|sleep|take|use|show|explain|fix|carry|clean|write|produce|move|run|say|speak|listen|stop|start)\b|\b(saw|see|sees|heard|hear|hears|watched|watch|felt|feel|feels)\s+(\w+)\s+\w+ing\b/i],
 ['hs_5',/\b(make|makes|made|keep|keeps|kept|find|finds|found|call|calls|called|leave|left)\s+(me|you|him|her|us|them|it|the \w+)\s+(happy|sad|angry|warm|cold|clean|tired|nervous|interesting|easy|hungry|sleepy|strong|safe|alone|open|crazy|famous)\b|\b(looks?|sounds?|tastes?|smells?|feels?|became|becomes?|turned|seems?)\s+(so\s+|very\s+|really\s+)?(good|great|nice|bad|delicious|happy|sad|red|cold|warm|hot|dark|strange|tired|sleepy|fun|beautiful|sweet|salty|soft|angry|sick|serious|friendly|easy|perfect|familiar)\b/i],
 ['hs_ginf',/\b(remember|remembered|forget|forgot|stop|stopped|regret|regretted)\s+(to\s+\w+|\w+ing)\b|\btried\s+\w+ing\b|\bused to\b|\blook(ing)? forward to\s+\w+ing\b/i],
 ['hs_inf2',/\b(seems?|seemed|appears?|happened?)\s+to\s+\w+|\bin order to\b|\bso as to\b|\bto have\s+\w+ed\b|\bis to\s+\w+\b/i],
 ['hs_conj2',/\b(as soon as|even if|even though|although|unless|in case|as long as|so that|now that|whether|by the time)\b/i],
 ['hs_quant',/\b(a few|few|a little(?! (sister|brother|girl|boy|one|kid))|each|either|neither|both|most of|almost all|plenty of|a number of|the number of|a great deal of)\b/i],
 ['hs_ellip',/\bthe fact that\b|\bif (necessary|possible|any)\b|,\s*(I think|I believe|I guess|you know|I mean|of course|by the way),/i],
 ['hs_noun',/^(The|This|That)\s+(\w+\s+)?(news|photo|picture|song|letter|rain|storm|trip|accident|book|medicine|wind|smell)\s+(made|makes|will make|took|takes|brought|brings|prevented|reminds|reminded|led|kept|keeps)\b/],
 /* 中学生 */
 ['jh_subj',/\bif\s+(I|you|he|she|we|they|it)\s+were\b|\bI wish\b|\bif\s+\w+\s+\w+ed\b[^.?!]*\b(would|could)\b|\b(would|could)\b[^.?!]*\bif\b/i],
 ['jh_perfect',/\b(have|has|'ve|haven't|hasn't)\s+(already\s+|never\s+|ever\s+|just\s+|not\s+)?(been|seen|done|gone|eaten|lost|found|made|had|met|heard|known|lived|finished|visited|played|been|read|come|forgotten|left|\w+ed)\b|^(have|has)\s+you\s+(ever\s+)?\w+/i],
 ['jh_passive',/\b(is|are|was|were|be|been)\s+(not\s+)?(?!tired\b|excited\b|interested\b|surprised\b|bored\b|worried\b|scared\b|married\b|used\b|supposed\b|pleased\b|closed\b|crowded\b|frustrated\b|confused\b|embarrassed\b|amazed\b)(\w+ed|made|written|seen|built|found|known|eaten|taken|given|spoken|sold|broken|loved|done|held|sung|stolen|grown)\b/i],
 ['jh_pastprog',/\b(was|were)\s+(not\s+)?\w+ing\b/i],
 ['jh_future',/\bwill\s+(not\s+)?\w+|\b\w+'ll\s+\w+|\bwon't\b|\b(am|is|are|'m|'re|'s)\s+(not\s+)?going to\s+\w+/i],
 ['jh_indq',/\b(know|tell me|wonder|remember|ask|asked|sure|idea|understand|see)\s+(what|where|when|who|why|how|if|whether)\b(?!.*\?$)/i],
 ['jh_rel',/\b(people|person|man|woman|boy|girl|friend|one|thing|book|dog|cat|shop|someone|something|fish|song|place)\s+(who|which|that)\s+(?!is\s+\w+ing)\w+/i],
 ['jh_part',/\b(a|an|the)\s+(broken|lost|fallen|written|stolen|frozen|sleeping|crying|singing|running|smiling|shining|flying|used)\s+\w+|\b(boring|bored|exciting|excited|interesting|interested|surprising|surprised|amazing|amazed|tiring|tired)\b/i],
 ['jh_comp',/\b\w+er\s+than\b|\b(more|less)\s+\w+\s+than\b|\bthe\s+(most\s+\w+|best|worst|\w+est)\b|\bas\s+\w+\s+as\b|\b(better|worse)\s+than\b/i],
 ['jh_there',/\bthere\s+(is|are|was|were|isn't|aren't|'s)\b|^(is|are)\s+there\b/i],
 ['jh_svoo',/\b(give|gave|show|showed|tell|told|teach|taught|buy|bought|send|sent|lend|lent|bring|brought|make|made)\s+(me|you|him|her|us|them)\s+(a|an|the|some|my|your|this|that|one|his|her)\b/i],
 ['jh_ger',/\b(enjoy|enjoyed|enjoys|finish|finished|stop|stopped|started|start|love|like|likes|began|keep|kept|mind|good at|about|for|of|without|by)\s+\w+ing\b|^\w+ing\s+(is|was)\b/i],
 ['jh_inf',/\b(want|wants|wanted|need|needs|needed|hope|hopes|try|tries|decided|decide|like|love|would like|plan|forgot to|have something|nothing|time|place|way|chance)\s+to\s+(?!the\b|school\b|me\b|you\b|my\b|your\b|a\b|an\b|him\b|her\b|us\b|them\b|bed\b)[a-z]+\b|\btoo\s+\w+\s+to\b|\b\w+\s+enough\s+to\b|\bit'?s\s+\w+\s+(for\s+\w+\s+)?to\s+\w+/i],
 ['es_dream',/\bwant(s)?\s+to\s+be\b/i],
 ['jh_modal',/\b(may|might|must|should|shouldn't|have to|has to|had to|don't have to|mustn't)\s+(not\s+)?\w+/i],
 ['es_can',/\b(can|can't|cannot|could)\s+(not\s+)?(I|you|we|he|she|it|they\s+)?\w+/i],
 ['jh_conj',/\b(because|if|while)\b|(?<!^)\bwhen\s+(I|you|he|she|we|they|it)\b|,\s*so\b/i],
 ['jh_prog',/\b(am|is|are|'m|'re|'s|isn't|aren't)\s+(not\s+)?(?!going to\b)(?!thing\b|nothing\b|something\b|everything\b|morning\b|evening\b|king\b|ring\b|spring\b|string\b|wing\b)\w+ing\b/i],
 ['jh_wh',/^(what|where|when|who|why|how|which|whose)\b(?=.*\?)/i],
 ['es_howmany',/\bhow many\b/i],
 ['es_way',/\b(go straight|turn (left|right)|on your (left|right)|next to|in front of)\b/i],
 ['es_time',/\bwhat time\b|\b\d{1,2}\s*o'clock\b|\b(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/i],
 ['jh_imp',/^(let's|let us|please|don't|be careful|look|wait|come|stop|go|help|listen|watch|say|try)\b/i],
 ['jh_past2',/\b(I|you|he|she|we|they|it)\s+(went|saw|ate|came|got|made|took|found|lost|had|left|bought|caught|told|said|ran|swam|gave|thought|felt|heard|knew|met|forgot|wrote|drank|slept|sang|won|broke|fell|flew|sat|stood|brought|taught|chose|began|became)\b/i],
 ['jh_past1',/\b(I|you|he|she|we|they|it)\s+(\w+ed)\b/i],
 ['es_past',/\bI\s+(went|ate|saw|had|played|enjoyed|watched|swam)\b/i],
 ['jh_3s',/\b(he|she|it)\s+(?!is\b|was\b|has\b|does\b|always\b|never\b|also\b|says\b|was\b)([a-z]+s)\b/i],
 ['jh_do',/^(do|does|did)\s+(you|he|she|they|we|I|it)\b|\b(don't|doesn't|didn't)\s+\w+/i],
 ['es_like',/\b(I|you|we|they)\s+like\b|\bdo you like\b/i],
 ['es_want',/\b(I|you|we|they)\s+want\s+(?!to\b)\w+|\bwhat do you want\b/i],
 ['es_heshe',/\b(he is|she is|he's|she's)\b/i],
 ['es_this',/\b(this|that)\s+is\b|\b(this|that)'s\b/i],
 ['es_be',/\b(I am|I'm|you are|you're)\b/i],
 ['jh_be',/\b(they|we|it)\s+(are|is|am)\b|\b(isn't|aren't)\b|\bit's\b/i],
 ['jh_pron',/\b(mine|yours|hers|ours|theirs)\b/i],
 ['es_plural',/\b(two|three|four|five|six|seven|eight|nine|ten|many|some|a lot of|lots of)\s+\w+s\b/i],
 ['jh_plural',/\b(children|people|feet|teeth|women|men|mice)\b|\b(a glass of|a cup of|a piece of|a bottle of)\b/i],
 ['jh_prep',/\b(until|during|between|among|across|along|through)\b/i],
 ['es_place',/\b(in|on|under)\s+(the|my|your|his|her)\s+\w+/i],
 ['jh_art',/\ban\s+[aeiou]\w*/i],
];

(()=>{
const {S:ST,sfx:SFX}=BEACH;
const H=HE,esc=H.esc,$=id=>document.getElementById(id);
const GLV=['es','jh','hs'];
const pickL=a=>a[Math.random()*a.length|0];
if(typeof GRAMMAR==='undefined')return;
/* note id → {lv,i,n} */
const BY={};GLV.forEach(lv=>(GRAMMAR[lv]?GRAMMAR[lv].notes:[]).forEach((n,i)=>BY[n.id]={lv,i,n}));
const owned=id=>(ST.gram.owned||[]).includes(id),cleared=id=>(ST.gram.cleared||[]).includes(id);
ST.gram.seen=ST.gram.seen||{};ST.gram.rn=ST.gram.rn||0;

/* every grammar in a sentence: [{id,lv,i,n,at,len}] (most advanced first) */
const cache=new Map();
function find(en){en=String(en||'').replace(/[’‘]/g,"'");if(cache.has(en))return cache.get(en);
  const out=[];for(const [id,re] of GRAM_PAT){if(!BY[id])continue;const m=re.exec(en);if(m&&m[0].trim())out.push({...BY[id],id,at:m.index,len:m[0].length})}
  if(cache.size>800)cache.clear();cache.set(en,out);return out}
/* the grammar to light up: one the player owns */
const lit=en=>find(en).find(g=>owned(g.id))||null;
/* the sentence as HTML, the owned grammar part marked (tap: the rule) */
function mark(en){en=String(en||'');const g=lit(en);if(!g)return esc(en);
  return `${esc(en.slice(0,g.at))}<mark class="gmk" data-gmk="${g.id}">${esc(en.slice(g.at,g.at+g.len))}</mark>${esc(en.slice(g.at+g.len))}`}
/* a sentence the player read with owned grammar: remember it under the note (5 per note), count it once */
function record(en){const g=lit(en);if(!g)return null;const S=ST.gram.seen[g.id]=ST.gram.seen[g.id]||[];
  if(!S.includes(en)){S.unshift(en);if(S.length>5)S.pop();ST.gram.rn++;save();
    if([1,10,30,50,100,200,500].includes(ST.gram.rn))milestone=ST.gram.rn}
  return g}
let milestone=0;
/* tap a marked part: the rule, and the way to the note */
function tip(id,anchor){const g=BY[id];if(!g)return;SFX.flip&&SFX.flip();
  const old=document.querySelector('.gtip');if(old){const same=old.dataset.g===id&&old.previousElementSibling===anchor;old.remove();if(same)return}
  const d=document.createElement('div');d.className='gtip';d.dataset.g=id;
  d.innerHTML=`<b>📘 ${esc(g.n.t)}</b><small>${esc(g.n.r[0])}</small><button class="sub">📚 ノートを ひらく</button>`;
  anchor.after(d);d.querySelector('button').onclick=e=>{e.stopPropagation();SFX.book();try{speechSynthesis.cancel()}catch(x){}H.gramNote(g.lv,g.i)}}
/* hook the marks inside an element */
function bind(el){el.querySelectorAll('[data-gmk]').forEach(m=>m.onclick=e=>{e.stopPropagation();tip(m.dataset.gmk,m.closest('p,.in')||m)})}
/* the radio line: a short toast (the bubble floats away fast) */
function toastRule(id){const g=BY[id];if(!g)return;SFX.flip&&SFX.flip();H.toast(`📘 <b>${esc(g.n.t)}</b><small>${esc(g.n.r[0])}</small>`,3600)}

/* ---------- a radio sentence answered wrong: Mina tells which grammar it uses, and invites ---------- */
let lastAsk=0;const asked={};
H.on('answer',(c,ok)=>{if(c.kind==='s'&&!ok){const G=find(c.en);if(!G.length)return;
  /* the grammar to talk about: not owned yet (try it) first, then owned but not cleared, then any */
  const g=G.find(x=>!owned(x.id))||G.find(x=>!cleared(x.id))||G[0];
  if(Date.now()-lastAsk<150000||(asked[g.id]&&Date.now()-asked[g.id]<900000))return;
  lastAsk=Date.now();asked[g.id]=lastAsk;
  setTimeout(()=>{if(!window.MINA||!MINA.canTalk())return;
    const k=!owned(g.id)?'gs_missTry':cleared(g.id)?'gs_missClear':'gs_missOwn';
    const [ex,tx]=MINA.line(k,{g:'「'+esc(g.n.t)+'」',en:esc(c.en),r:esc(g.n.r[0])});
    MINA.say('m',ex,tx,11000,null,owned(g.id)?['📚 ノートを ひらく',()=>H.gramNote(g.lv,g.i)]:['🔍 おためし する',()=>H.gramTry(g.lv,g.i,()=>H.home())])},2800)}
  /* a right answer with owned grammar: it counts as a sentence you could read */
  if(ok&&c.kind==='s')record(c.en)});
/* milestones of sentences read with grammar */
setInterval(()=>{if(!milestone||!window.MINA||!MINA.canTalk())return;const n=milestone;milestone=0;
  const [ex,tx]=MINA.line('gs_readN',{n});MINA.say('m',ex,tx,8000,null,['📚 文法を 見る',()=>H.gramFrom()])},4000);

/* grammar in a whole talk (the end of a conversation): owned ones and locked ones, up to 4 */
function inLines(lines){const seen=new Set(),out=[];lines.forEach(en=>find(en).forEach(g=>{if(!seen.has(g.id)){seen.add(g.id);out.push(g)}}));
  return out.sort((a,b)=>(owned(b.id)?1:0)-(owned(a.id)?1:0)).slice(0,4)}

window.GRAMSEE={find,lit,mark,record,bind,tip,toastRule,inLines,byId:id=>BY[id],owned,cleared,
  seenOf:id=>ST.gram.seen[id]||[],get read(){return ST.gram.rn}};
})();
