/* 💡 ミナ先生の ひとこと コツ（11/22）
   ユーザーの 希望: 「授業の 選択が 多いと あれも これも に なる。 授業に するまでも ない 内容は ほかの 形に」
   → きょうの授業の あとの 🎁おまけ（勉強の やり方・学び方の 科学の ミニ授業）は やめて、
     授業の おわりの ミナ先生の ふきだしに コツを 1つ さらっと 足す。
   ・END = 授業の あとに ぴったりの ひとこと（手で 書いた もの。 「こえに だして れんしゅう」など ミニ授業の 中身を ひとことに した もの）
   ・LESSONS の 勉強の やり方（yarikata）・学び方の 科学（kagaku）の tip も つかう
   ・同じ ものは 一巡するまで 出さない。 きろくは localStorage 'hoshi_kotsu'（s: 言った id） */
(()=>{
const KEY='hoshi_kotsu';
const R=(()=>{try{const r=JSON.parse(localStorage.getItem(KEY)||'{}');if(r&&typeof r==='object')return r}catch(e){}return {}})();R.s=R.s||{};
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(R))}catch(e){}};
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const pickL=a=>a[Math.random()*a.length|0];

/* 授業の あとに ぴったりの ひとこと（[id, 文]） */
const END=[
 ['voice','きょうの 例文、 1回だけ 声に 出して 読んでみてね。 目・口・耳を ぜんぶ 使うと 頭に のこるよ'],
 ['voice2','小さな 声でも いいから、 例文を まねして 3回 言ってみて。 口を うごかす ことが 大事なの'],
 ['lookup','例文を 1つ えらんで、 読んだら 顔を 上げて 見ないで 言ってみて。 これで 話す 力に かわるよ'],
 ['cover','いま 習った ところ、 ねる前に かくして 思い出してみて。 見なおすより ずっと のこるよ'],
 ['sleep','ねる前に きょうの 授業を 1つだけ 思い出してから ねてね。 ねてる間に 頭が せいり してくれるの'],
 ['explain','きょうの ところ、 だれかに 説明する つもりで ひとりごと してみて。 説明できたら 本物だよ'],
 ['why','「なんで こう なるの？」って 1回 自分に 聞いてみて。 理由と いっしょだと 忘れにくいの'],
 ['tomorrow','あした ここを ちょっとだけ 思い出してね。 忘れかけた ころに 思い出すのが いちばん 効くの'],
 ['mine','きょうの 文を 1つ、 自分の ことに かえて 言ってみて。 I を 自分、 ことばを 好きな ものに'],
 ['chunk','例文は 1語ずつより かたまりで 覚えると、 1語 かえるだけで いろいろ 言えるよ'],
 ['write','例文を 1つ、 言いながら ノートに 書いてみて。 手と 口と 耳で 3回 覚えられるよ'],
 ['short','毎日 5分でも つづけると 強いよ。 きょうも 来てくれて うれしい'],
 ['habit','「歯みがきの あとに 例文 1つ」みたいに、 いつもの ことに くっつけると つづくよ'],
 ['guess','問題は 答えを 見る 前に 「たぶん これ」って 決めてから 見てね。 まちがえても よく 覚えられるの'],
 ['miss','まちがえた ところは 伸びしろ。 「なんで まちがえた？」を 1行 メモすると 同じ ミスが へるよ'],
];
/* LESSONS の 勉強の やり方・学び方の 科学の tip（ミニ授業の 中身を ひとことに） */
const fromLessons=()=>{try{return (typeof LESSONS!=='undefined'?LESSONS:[]).filter(l=>l.tip&&(l.cat==='yarikata'||l.cat==='kagaku')).map(l=>['l:'+l.id,l.tip])}catch(e){return []}};
const all=()=>END.concat(fromLessons());
/* つぎの ひとこと（一巡したら また さいしょから）。 miss = まちがいが あった ときは まちがいの コツを 先に */
function next(o){o=o||{};const A=all();if(!A.length)return '';
  if(o.miss&&!R.s.miss){R.s.miss=1;save();return esc(END.find(x=>x[0]==='miss')[1])}
  let L=A.filter(x=>!R.s[x[0]]);if(!L.length){R.s={};L=A}
  /* 半分は 手で 書いた 授業の あとの ひとことから（声に 出す・思い出す など、 いま すぐ できる もの） */
  const E=L.filter(x=>!x[0].startsWith('l:')),x=E.length&&Math.random()<.55?pickL(E):pickL(L);
  R.s[x[0]]=1;save();return esc(x[1])}

/* ---------- ☕ コツの お話（11/22 3回目）: 前の ミニ授業の 「勉強の やり方」「学び方の 科学」と、 単元にも カードにも 入らなかった 英語の おもしろ話を、
   ミナ先生が 1つ えらんで おしゃべりで 話す（問題は なし）。 ☕ おしゃべり ページの 1行から ---------- */
const TALK_CATS=['yarikata','kagaku'];
/* 浜辺に 合わない もの（試験の 点数の 話など）は 入れない */
const TALK_SKIP=['adv-eiken-toeic','adv-paraphrase','adv-clil','jh-directions'];
const TALK_MORE=['jh-keyword','jh-chunk','es-word-web','jh-word-family','hs-gogen-word-parts','jh-proverbs','hs-gesture-culture','jh-mirror-order','hs-adj-order','jh-no-skip-subject','jh-read-numbers','jh-keep-talking','es-hama-bd'];
const LVI={es:0,jh:1,hs:2,adv:3};
function talks(){if(typeof LESSONS==='undefined')return [];return LESSONS.filter(l=>(TALK_CATS.includes(l.cat)||TALK_MORE.includes(l.id))&&!TALK_SKIP.includes(l.id))}
R.t=R.t||{};
function talkPick(){const A=talks();if(!A.length)return null;let lv=1;try{lv=LVI[MINA.level()]??1}catch(e){}
  let L=A.filter(l=>!R.t[l.id]);if(!L.length){R.t={};L=A}
  /* いまの レベルの まわり（±1）から */
  const near=L.filter(l=>Math.abs((LVI[l.lv]??1)-lv)<=1);return pickL(near.length?near:L)}
function talk(back){const H=window.HE,l=talkPick();if(!H||!l)return;back=back||(()=>MINA.open());R.t[l.id]=Date.now();save();
  const $=id=>document.getElementById(id),ML=(k,v)=>{try{return MINA.line(k,v||{})}catch(e){return ['smile','']}};
  const [ex0,tx0]=ML(TALK_CATS.includes(l.cat)?'kt_start':'kt_startFun',{t:l.t});
  const st=[['m',ex0,tx0]].concat(l.steps);let k=0;
  const say=s=>`<div class="lsay by-${s[0]==='h'?'h':'m'}"><span class="lface">${MINA.face(s[0]==='h'?'h':'m',s[1])}</span><div class="lbody"><p>${s[2]}</p>${s[3]?`<div class="fz">${s[3]}</div>`:''}</div></div>`;
  H.show('mina',`<section class="pnl minap mpsub ktalk">
    <div class="qtop"><button class="x" id="ktbk" aria-label="もどる">←</button><b>☕ ${esc(l.t)}</b><span></span></div>
    <div class="ktlog" id="ktlog"></div><div class="row"><button id="ktnx">つぎ ▶</button></div></section>`);
  const nx=$('ktnx'),log=$('ktlog'),snd=n=>{try{BEACH.sfx[n]()}catch(e){}};
  const step=()=>{if(k<st.length){log.insertAdjacentHTML('beforeend',say(st[k++]));log.lastElementChild.scrollIntoView({block:'nearest',behavior:'smooth'});
      if(k>=st.length)nx.textContent='なるほど！';return}
    const [ex,tx]=ML('kt_end',{t:l.t});log.insertAdjacentHTML('beforeend',say(['m',ex,tx]));nx.textContent='☕ もどる';nx.onclick=()=>{snd('pop');back()};};
  nx.onclick=()=>{snd('step');step()};$('ktbk').onclick=()=>{snd('pop');back()};
  step();step()}

/* ---------- 🍬 ハマ子さんの 語呂: ホームに 来た ときに 歌って いく（HAMA_TALKS に 足す） ---------- */
try{if(typeof HAMA_TALKS!=='undefined'&&typeof LESSONS!=='undefined'){const strip=t=>String(t).replace(/<[^>]+>/g,'');
  LESSONS.filter(l=>l.cat==='hama').forEach(l=>HAMA_TALKS.push({when:'any',goro:l.id,lines:l.steps.slice(0,4).map(s=>[s[0]==='h'?'h':'m',s[1],strip(s[2])])}))}}catch(e){console.error(e)}

Object.assign(MINA_LINES,{
 kt_start:[['smile','きょうは 「{t}」の 話を するね。 のんびり 聞いて'],['happy','勉強の コツの 話。 「{t}」だよ'],['think','ミナが 好きな コツを 1つ。 「{t}」'],['love','お茶でも 飲みながら。 「{t}」の 話']],
 kt_startFun:[['wow','英語の おもしろ話を 1つ。 「{t}」'],['happy','ちょっと 寄り道。 「{t}」の 話、 聞いて？'],['smile','授業では やらない 話を するね。 「{t}」']],
 x_ktTalk:[['smile','ひまなら、 勉強の コツの 話でも する？'],['happy','ミナの 好きな 英語の おもしろ話、 聞いてく？'],['think','ちょっと ひと休みして コツの 話は どう？']],
 kt_end:[['happy','おしまい。 1つだけ ためして みてね'],['love','聞いてくれて ありがとう。 また 話そうね'],['proud','これで 「{t}」、 もう 知ってる 人だね'],['smile','ぜんぶ やらなくて いいよ。 気に入った ところだけ つかってね']],
});
window.KOTSU={next,END,all,rec:()=>R,talk,talks};
})();
