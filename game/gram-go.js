/* 📘⚡🧩 文法の 入口を 新しい 形に そろえる（11/22）
   ユーザー「ノート、特訓、くわしくは まだ 残ってるの？」 → 会話の おわりなどに 古い 📚ノート・🎯とっくん・🔎くわしく・📖ミニ授業 の ボタンが 残っていた
   ミナ先生まわりは 📘授業（単元 game/unit.js）・⚡練習（game/practice.js）・☕おしゃべり の 3つ。 文法の ボタンは ぜんぶ ここを 通す
   - 📘 授業で 見る: その 文法の 単元の 時間（UNIT.openGram）。 単元に ない 文法は 📘授業の ページ
   - ⚡ 練習する: その 時間を 習っていれば ⚡練習（その 時間 多め 10問）。 まだなら その 文法の 5問（会話の ミニ練習）
   - 🧩 型: その 時間に 型カードが あれば（KATA.of）
   ボタンは 1〜2こ まで（btns）。 セリフは この ファイルの さいご（gg_） */
(()=>{
const H=window.HE;if(!H)return;
const esc=H.esc;
const gidOf=(lv,i)=>{try{return GRAMMAR[lv].notes[i].id}catch(e){return null}};
const at=gid=>{try{return gid&&window.UNIT&&UNIT.byGram?UNIT.byGram(gid):null}catch(e){return null}};
const hush=()=>{try{speechSynthesis.cancel()}catch(e){}};
const lessonsPage=()=>{try{if(window.MPLAN){MPLAN.lessonsPage();return true}}catch(e){console.error(e)}try{MINA.open()}catch(e){}return false};
const practicePage=()=>{try{if(window.MPLAN){MPLAN.practicePage();return true}}catch(e){console.error(e)}try{MINA.open()}catch(e){}return false};
/* 📘 その 文法の 時間へ */
function lesson(gid){hush();if(at(gid)&&UNIT.openGram(gid))return true;return lessonsPage()}
/* ⚡ 練習が その 時間で できる？（その 時間を 習いおわっている） */
function pracOk(gid){const f=at(gid);if(!f||!window.PRAC||!PRAC.items)return false;try{return PRAC.items(f[0].id).some(it=>it.ci===f[1])}catch(e){return false}}
function prac(gid){hush();const f=at(gid);
  if(f&&pracOk(gid)&&PRAC.start({u:f[0].id,ci:f[1]}))return true;
  if(gid&&window.SENSEI&&SENSEI.tokkun){SENSEI.tokkun([gid],0,'mina');return true}
  return practicePage()}
/* 🧩 その 時間の 型カード（なければ null） */
function kata(gid){const f=at(gid);try{return f&&window.KATA?KATA.of({u:f[0].id,ci:f[1]}):null}catch(e){return null}}
/* ボタン 1〜2こ。 weak = まちがえた・ヒントを 見た → 📘 ＋ ⚡ ／ できた → 🧩型（あれば）か 📘 */
function btns(gid,weak){if(!gid)return '';const B=(k,t)=>`<button class="sub ggb" data-gg="${k}:${esc(gid)}">${t}</button>`,kt=kata(gid);
  if(weak)return B('l','📘 授業で 見る')+B('p','⚡ 練習する');
  if(kt&&window.KATA)return KATA.chip(kt,'ggk');
  return B('l','📘 授業で 見る')}
/* o.before(): 画面を はなれる 前に（会話を とめる など） */
function bind(root,o){if(!root)return;o=o||{};
  root.querySelectorAll('[data-gg]').forEach(b=>b.onclick=e=>{e.stopPropagation();const s=b.dataset.gg,k=s[0],g=s.slice(2);
    try{BEACH.sfx[k==='l'?'lesson':'step']()}catch(er){}try{o.before&&o.before(k,g)}catch(er){}
    try{RECENT.add('gramGo',{g,k})}catch(er){}
    k==='l'?lesson(g):prac(g)});
  try{window.KATA&&KATA.bind(root)}catch(e){}}
/* ミナ先生の ひとこと などの ボタン（[ラベル, 関数]） */
const lessonBtn=gid=>['📘 授業で 見る',()=>lesson(gid)];
const pracBtn=gid=>['⚡ 練習する',()=>prac(gid)];
/* 古い ミニ授業の id → その 文法の 時間（GRAMLINK の 文法 → 単元）。 なければ null（ボタンを 出さない） */
function lesGid(lid){try{const M=window.GRAMLINK&&GRAMLINK.map;if(!M)return null;const g=Object.keys(M).find(g=>M[g].includes(lid)&&at(g));return g||null}catch(e){return null}}
const lesBtn=lid=>{const g=lesGid(lid);return g?lessonBtn(g):null};
/* ---------- ミナ先生の ひとこと（gg_） ---------- */
Object.assign(window.MINA_LINES=window.MINA_LINES||{},{
 x_ggNew:[['smile','英語で 話した あとの 「この 会話の 文法」、 ボタンを 📘 授業と ⚡ 練習に そろえたよ。 まよったら 📘 から 見てね'],
  ['happy','会話で まちがえた 文法は、 その場で 📘 授業の 時間へ 行けるよ。 見たら ⚡ 練習で ためしてね']],
 x_ggKarte:[['think','文法カルテの {g}、 📘 授業で 見てから ⚡ 練習すると 早いよ'],['smile','{g}、 カルテの ⚡ 練習から すぐ ためせるよ']]});
try{if(window.MINA_SENSE&&MINA_SENSE._rules)MINA_SENSE._rules.push(
  ['x_ggNew',2,F=>{try{return window.SENSEI&&SENSEI.rec().n>=1?{}:null}catch(e){return null}},()=>['🗣️ 先生と 話す',()=>SENSEI.open()]],
  ['x_ggKarte',2,F=>{try{const w=SENSEI.weak().filter(at);if(!w.length)return null;const n=GRAMSEE.byId(w[0]);return n?{g:'「'+n.n.t+'」',_id:w[0]}:null}catch(e){return null}},v=>lessonBtn(v._id)])}catch(e){}
window.GGO={lesson,prac,pracOk,kata,btns,bind,gidOf,at,lessonBtn,pracBtn,lesBtn,lesGid,lessonsPage,practicePage};
})();
