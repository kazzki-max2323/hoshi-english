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
window.KOTSU={next,END,all,rec:()=>R};
})();
