/* 文法テスト（文法ノートの れんしゅう）と ミナの ミニ授業を つなぐ。
   教わる（授業）→ ためす（文法テスト）→ まちがえたら 教わる、の 輪っか。
   - 文法テストで まちがえたら、おわりの 画面で ミナ先生が その文法の 授業を すすめる（game/game.js の gramQuiz から よぶ）
   - 授業の さいごに 「この文法を テストで ためす」ボタン（game/lesson.js の finish から よぶ）
   - ホームの ミナ先生も 両方向に さそう（game/mina.js の gramMiss・game/mina-sense.js の x_gramLes など）
   GRAM_LES: 文法ノートの id → 授業の id（えらぶ じゅん）。授業や 文法ノートを 足したら ここも 足す。
   セリフは game/mina-talk.js（gramLes・lesGram・gramMissLes・x_gramLes など） */
const GRAM_LES={
 /* 小学生 */
 es_abc:['es-phonics-abc','es-hama-bd'],
 es_be:['es-be-am-are'],
 es_like:['es-like','es-question'],
 es_plural:['es-plural-s'],
 es_can:['es-can'],
 es_want:['es-word-order'],
 es_howmany:['es-hama-count','es-teen'],
 es_place:['es-in-on-under'],
 es_time:['es-clock','es-days-months','es-hama-week'],
 es_heshe:['es-be-am-are'],
 es_past:['jh-tense-line','jh-hama-irregular'],
 es_way:['jh-directions'],
 /* 中学生 */
 jh_be:['es-be-am-are'],
 jh_do:['es-question','jh-negative-q','jh-so-do-i'],
 jh_3s:['jh-3sg-s','jh-s-sound'],
 jh_plural:['es-plural-s','jh-s-sound','jh-a-piece-of','jh-uncountable-common'],
 jh_prog:['jh-progressive'],
 jh_wh:['es-question','jh-indirect-q'],
 jh_past1:['jh-tense-line','jh-ed-sound'],
 jh_past2:['jh-hama-irregular','jh-tense-line'],
 jh_pastprog:['jh-progressive','adv-tense-grid'],
 jh_future:['hs-will-goingto','jh-tense-line','jh-if-present'],
 jh_modal:['jh-modal-strength','jh-have-to-must','es-can','jh-polite-stairs'],
 jh_there:['jh-there-is'],
 jh_inf:['jh-to-ing','jh-too-enough','jh-it-to'],
 jh_ger:['jh-to-ing','jh-go-ing'],
 jh_comp:['jh-comparison','jh-hama-better-best'],
 jh_passive:['jh-passive'],
 jh_perfect:['jh-present-perfect','jh-hama-for-since'],
 jh_perfprog:['jh-present-perfect','adv-tense-grid'],
 jh_conj:['jh-if-present'],
 jh_rel:['jh-relative'],
 jh_part:['jh-bored-boring'],
 jh_indq:['jh-indirect-q'],
 jh_subj:['hs-kateiho-kyori','hs-i-wish'],
 jh_svoo:['jh-word-order'],
 jh_prep:['jh-prep-time','jh-by-until','jh-by-with','hs-core-prep','jh-adj-prep','jh-no-prep-verbs'],
 jh_art:['es-a-an','hs-article-a-the'],
 /* 高校生 */
 hs_5:['jh-word-order','es-word-order'],
 hs_tense:['adv-tense-grid','jh-present-perfect'],
 hs_modperf:['jh-modal-strength'],
 hs_passive2:['jh-passive'],
 hs_inf2:['jh-to-ing','jh-too-enough'],
 hs_ginf:['jh-to-ing','hs-used-to'],
 hs_partc:['hs-bunshi-kobun'],
 hs_rel2:['jh-relative'],
 hs_reladv:['hs-kankei-fukushi'],
 hs_comp2:['jh-comparison'],
 hs_subj2:['hs-kateiho-kyori','hs-i-wish'],
 hs_speech:['hs-jisei-itchi','hs-say-tell'],
 hs_emph:['hs-kyocho-itthat'],
 hs_neg:['jh-negative-q'],
 hs_conj2:['jh-if-present'],
 hs_seq:['hs-jisei-itchi'],
 hs_noun:['hs-nonliving-subject','hs-noun-style'],
 hs_caus:['hs-make-let-have','hs-perception'],
 hs_quant:['jh-few-little','jh-some-any','hs-kazoe-countable','hs-hama-uncountable','jh-uncountable-common'],
};

(()=>{
const {S:ST,sfx:SFX}=BEACH;
const H=HE,esc=H.esc;
const GLV=['es','jh','hs'];
const has=()=>typeof GRAMMAR!=='undefined'&&typeof LESSONS!=='undefined';
const lesById=id=>LESSONS.find(l=>l.id===id);
const lesDone=id=>!!((MINA.rec().les||{})[id]);
const owned=id=>(ST.gram.owned||[]).includes(id),cleared=id=>(ST.gram.cleared||[]).includes(id);
/* every grammar note: {lv,i,n} */
const notes=()=>has()?GLV.flatMap(lv=>(GRAMMAR[lv]?GRAMMAR[lv].notes:[]).map((n,i)=>({lv,i,n}))):[];
const noteById=id=>notes().find(g=>g.n.id===id);

/* lessons for a grammar note (ones not cleared yet come first) */
function lessonsFor(noteId){if(!has())return [];const a=(GRAM_LES[noteId]||[]).map(lesById).filter(Boolean);
  return a.filter(l=>!lesDone(l.id)).concat(a.filter(l=>lesDone(l.id)))}
/* grammar notes for a lesson: the note of the same level first, then the others */
function notesFor(lesId){const l=has()&&lesById(lesId);if(!l)return [];
  const a=notes().filter(g=>(GRAM_LES[g.n.id]||[]).includes(lesId)),lv=l.lv==='adv'?'hs':l.lv;
  return a.filter(g=>g.lv===lv).concat(a.filter(g=>g.lv!==lv))}

/* tap: the test if the note is yours, the shop if not */
function tryTest(g){if(owned(g.n.id)){SFX.deal();H.gramQuiz(g.lv,g.i)}
  else{SFX.vopen();H.gramShop(g.lv);H.toast(`📚 「${g.n.t}」の ノートを かうと テストで ためせるよ`)}}

const say=(ex,tx)=>`<div class="lsay by-m glink"><span class="lface">${MINA.face('m',ex)}</span><div class="lbody"><p>${tx}</p></div></div>`;

/* end of a grammar test: with misses ミナ先生 points to the lesson (all right: only if the lesson is not cleared yet). back = where the lesson's ← goes */
function afterTest(lv,i,miss,back){const n=GRAMMAR[lv].notes[i],L=lessonsFor(n.id).slice(0,2);if(!L.length||(!miss&&lesDone(L[0].id)))return null;
  const [ex,tx]=MINA.line(miss?'gramLes':'gramLesOk',{g:'「'+esc(n.t)+'」',t:'「'+esc(L[0].t)+'」'});
  return {html:say(ex,tx)+`<div class="glinks">${L.map(LESSON.row).join('')}</div>`,
    bind:()=>LESSON.bindRows(back)}}

/* end of a lesson: try its grammar in the test */
function afterLesson(l){const G=notesFor(l.id);if(!G.length)return null;const g=G.find(x=>!cleared(x.n.id))||G[0],own=owned(g.n.id);
  const [ex,tx]=MINA.line(cleared(g.n.id)?'lesGramAgain':own?'lesGram':'lesGramShop',{g:'「'+esc(g.n.t)+'」',t:'「'+esc(l.t)+'」'});
  return {html:say(ex,tx)+`<div class="row"><button id="lgram">${own?'✏️ この文法を テストで ためす':'🛍️ この文法の ノートを 見る'}</button></div>`,
    bind:()=>{const b=document.getElementById('lgram');if(b)b.onclick=()=>tryTest(g)}}}

window.GRAMLINK={lessonsFor,notesFor,noteById,afterTest,afterLesson,tryTest,map:GRAM_LES};
})();
