/* 💡 さらっと まめちしき（11/22）: 会話の 中に Would you like〜? / Could you〜? などが 出てきたら、 ミナ先生が 小さな ふきだしで 「なんで？」を さらっと 教える。
   授業に するほど じゃない 「ていねいな 過去形」の 話（would・could・might・should・I wanted to…）。
   ─ しくみ ───────────────────────────────────────────
   ・画面に 新しく 出た 英文を 見張って（MutationObserver）、 TIPS の re に 合ったら、 読みおわってから（HE.afterTalk）小さく 出す
   ・さいしょは かならず would（ほかは 「would と 同じ しくみ」なので would を 見た あと）
   ・1つの 話は 1回だけ（ひらいたら おしまい。 3回 スルーされたら もう 出さない）。 つぎの 話まで 6分 あける
   ・授業・テスト・練習・単語帳・ホームでは 出さない（答えの じゃまを しない）
   ・ひらいて いる 間は 会話を 止める（game.js talkBusy が #mamePop.open を 見る）
   ・あとから 読みかえせる ように 🙋 しつもん（game/mina-qa.js）に 「ていねいな 過去形」を 1つ 足す
   きろくは localStorage 'hoshi_mame'（s: 読んだ 時刻、 n: スルーした 回数、 last: さいごに 出した 時刻） */
(()=>{
const H=window.HE;if(!H)return;
const SFX=(window.BEACH&&BEACH.sfx)||{};const snd=k=>{try{SFX[k]&&SFX[k]()}catch(e){}};
const esc=H.esc,$=id=>document.getElementById(id);
const KEY='hoshi_mame',R=(()=>{try{return JSON.parse(localStorage.getItem(KEY)||'{}')||{}}catch(e){return {}}})();R.s=R.s||{};R.n=R.n||{};R.last=R.last||0;
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(R))}catch(e){}};
const face=(ex,tx)=>{try{return MINA.face('m',ex,MINA.poseFor?MINA.poseFor(ex,tx||''):undefined)}catch(e){return ''}};
const ML=(k,v)=>{try{return MINA.line(k,v||{})}catch(e){return ['smile','']}};
const talk=en=>{try{speechSynthesis.cancel();window.SENSEI&&SENSEI.talk(en)}catch(e){}};

/* re = 見つける 英文、 hook = さいしょの ひとこと（たたんだ ふきだし）、 say = ひらいた ときの せつめい */
const TIPS=[
 {id:'would',re:/\b(would you|I'd like|we'd like|would like)\b/i,x:'think',
  hook:'「Would you〜?」の <b>would</b>、 じつは <b>will の 過去形</b>なんだよ。 なのに 今の 話… なんでだと 思う？',
  say:'過去の 形に すると、 気もちが <b>一歩 うしろに 下がる</b>の。 「いま・ここ」から ちょっと はなれる ぶん、 おしつけない <b>やわらかい・ていねいな</b> 言い方に なるんだ。 だから Will you〜? より Would you〜? の ほうが ていねい',
  f:[['Will you〜?','〜して くれる？'],['Would you〜?','〜して いただけますか？（一歩 下がる）']],
  ex:[['Would you like some tea?','お茶は いかがですか？'],["I'd like a coffee, please.",'コーヒーを ください（I would like）']]},
 {id:'could',after:'would',re:/\bcould (you|I|we)\b[^.!]*\?/i,x:'smile',
  hook:'「Could you〜?」の <b>could</b> も <b>can の 過去形</b>。 でも 「できた？」って 聞いてるんじゃ ないんだよ',
  say:'would と 同じ しくみ。 過去の 形で 一歩 下がって、 <b>「もし できたら…」</b>と ひかえめに たのむ 言い方なの。 Can you〜? を Could you〜? に するだけで、 ぐっと ていねいに なるよ',
  f:[['Can you〜?','〜できる？（ふつう）'],['Could you〜?','〜して いただけますか？']],
  ex:[['Could you help me?','手伝って いただけますか？'],['Could I try it on?','ためしに 着ても いいですか？']]},
 {id:'wanted',after:'would',re:/\b(I was wondering|I wanted to (ask|know|say|tell)|did you want)\b/i,x:'happy',
  hook:'「I was wondering…」「I wanted to ask…」 今の ことなのに 過去形。 これも あの 「一歩 下がる」 過去形だよ',
  say:'「〜かなと 思って いたんですが…」と 少し はなれて 言うと、 相手に <b>「ことわっても いいよ」って 余白</b>を あげられるの。 大人の ていねいな たのみ方。 お店の 人の Did you want〜?（〜に なさいますか？）も 同じ 気もち',
  ex:[['I wanted to ask you something.','ちょっと お聞きしたい ことが あって'],['I was wondering if you could help me.','手伝って いただけないかなと 思いまして']]},
 {id:'might',after:'would',re:/\bmight\b/i,x:'think',
  hook:'<b>might</b> は <b>may の 過去形</b>。 でも 「〜かも しれない」って 今の 話に 使ってるよね',
  say:'これも 一歩 下がる 過去形。 may より 少し <b>自信が ひかえめ</b>に なることが 多いの。 It may rain.（ふるかも）→ It might rain.（ひょっとしたら ふるかもね）',
  ex:[['It might rain later.','あとで ふるかも しれないね'],['You might like this one.','こっちも 気に入るかも']]},
 {id:'should',after:'would',re:/\b(you|we|I) should\b/i,x:'smile',
  hook:'<b>should</b> って、 むかしは <b>shall の 過去形</b>だったって 知ってた？',
  say:'shall は 「〜する ことに なっている」と いう 強い ことば。 過去の 形で 一歩 下がって、 <b>「〜した ほうが いいよ」</b>と いう やさしい アドバイスに なったの。 must より ずっと やわらか',
  ex:[['You should try this.','これ、 ためして みたら いいよ'],['We should go home.','そろそろ 帰ったほうが いいね']]}
];

/* 出さない ところ */
const NOSCR=new Set(['home','lesson','lessons','gram','review','sensei','mquiz','mdhint','mdafter','cards','books','settings','msearch']);
const SKIP='#dpov,#prteach,#cardTop,#cardOv,#mamePop,header,#toast,#cheerBox,.ttov,.qtop,[data-notap]';
const GAP=6*60000;let bootAt=Date.now(),wait=null,buf=[],bufT=0;
const okNow=()=>!NOSCR.has(H.screen)&&!$('dpov')&&!$('prteach')&&!$('mamePop')&&!document.hidden;
/* 音・ことばの まめちしき（t.les）は 数が 多いので 15分 あける */
const pickTip=text=>{const far=Date.now()-R.last>15*60000,t=TIPS.find(t=>!R.s[t.id]&&(R.n[t.id]||0)<3&&(!t.after||R.s[t.after])&&(!t.les||far)&&t.re.test(text));if(t)t._w=(text.match(t.re)||[''])[0].trim();return t};
/* 11/22: ミニ授業（音と発音など）も まめちしきに。 t.les = LESSONS の id（ひらくと その 授業の 説明カードを 小さく 見せる）、 hook の {w} = 見つけた 英語（game/mini-place.js） */
const lesOf=id=>{try{return (typeof LESSONS!=='undefined'?LESSONS:[]).find(l=>l.id===id)||null}catch(e){return null}};
const lesHtml=l=>l.steps.map(s=>`<div class="mmls"><p>${s[2]}</p>${s[3]?`<div class="fz">${s[3]}</div>`:''}</div>`).join('');
const hookOf=t=>String(t.hook||'').replace(/\{w\}/g,esc(t._w||''));
function scan(){bufT=0;const txt=buf.join(' \n ');buf=[];
  if(wait||Date.now()-R.last<GAP||Date.now()-bootAt<20000||!okNow())return;
  const t=pickTip(txt);if(!t)return;const scr=H.screen;wait=t;
  /* セリフを 読みおわって、 ひと呼吸 おいてから */
  H.afterTalk(()=>{wait=null;if(H.screen===scr&&okNow())pop(t)},1200,1500,()=>H.screen===scr)}
new MutationObserver(ms=>{for(const m of ms)for(const n of m.addedNodes){const el=n.nodeType===1?n:n.parentElement;if(!el||el.closest(SKIP))continue;
    const s=(n.nodeType===1?n.textContent:n.nodeValue)||'';if(s.length>2&&/[a-z]/i.test(s))buf.push(s.slice(0,600))}
  if(buf.length&&!bufT)bufT=setTimeout(scan,500)}).observe(document.body,{childList:true,subtree:true});

/* ---------- ふきだし ---------- */
let hideT=0;
function shut(){const p=$('mamePop');if(!p)return;clearTimeout(hideT);p.classList.remove('on','open');setTimeout(()=>p.remove(),300)}
function pop(t){R.last=Date.now();save();const p=document.createElement('div');p.id='mamePop';p.className='mame';
  p.innerHTML=`<button class="mmhook" aria-label="まめちしきを ひらく"><span class="mmf">${face(t.x,t.hook)}</span><span class="mmt"><em>💡 ミナ先生の まめちしき</em><span>${hookOf(t)}</span><small>タップで こたえ ▶</small></span></button>`;
  document.body.appendChild(p);void p.offsetWidth;p.classList.add('on');snd('pop');
  p.querySelector('.mmhook').onclick=e=>{e.stopPropagation();open(t)};
  /* 読まずに 流れたら スルー 1回（3回で その 話は もう 出さない。 🙋 しつもんでは いつでも 読める） */
  hideT=setTimeout(()=>{if(p.classList.contains('open'))return;R.n[t.id]=(R.n[t.id]||0)+1;save();shut()},14000)}
function open(t){const p=$('mamePop');if(!p)return;clearTimeout(hideT);snd('talk');R.s[t.id]=Date.now();save();const L=t.les?lesOf(t.les):null;
  try{RECENT.add('mame',{t:t.id,en:t.id})}catch(e){}
  p.classList.add('open');
  p.innerHTML=`<div class="mmbox">${L?`<p class="mmlt">${esc(L.t)}</p>${lesHtml(L)}`:`<div class="mmhd"><span class="mmf">${face(t.x,t.say)}</span><p>${t.say}</p></div>`}
    ${t.f?`<div class="mmtwo">${t.f.map(([a,b])=>`<div><b>${esc(a)}</b><span>${esc(b)}</span></div>`).join('')}</div>`:''}
    <div class="mmex">${(t.ex||[]).map(([en,ja])=>`<button data-say="${esc(en)}"><span>🔊 ${esc(en)}</span><small>${esc(ja)}</small></button>`).join('')}</div>
    <div class="mmnav"><button class="mmok">なるほど！</button></div></div>`;
  p.querySelectorAll('[data-say]').forEach(b=>b.onclick=e=>{e.stopPropagation();snd('pop');talk(b.dataset.say)});
  p.querySelector('.mmok').onclick=e=>{e.stopPropagation();snd('step');const [ex,tx]=ML(L?'mame_ok2':'mame_ok');
    p.innerHTML=`<div class="mmbox mmbye"><div class="mmhd"><span class="mmf">${face(ex,tx)}</span><p>${tx}</p></div></div>`;hideT=setTimeout(shut,2200)};
  p.onclick=e=>e.stopPropagation()}

/* ---------- 🙋 しつもんにも 入れて おく（あとで 読みかえせる） ---------- */
if(window.MINAQA&&window.UNIT&&UNIT.F){const {B,row,two,tbl,note}=UNIT.F;
  MINAQA.all.splice(Math.min(4,MINAQA.all.length),0,{id:'polite_past',ico:'🎩',q:'Would you like〜? の would は 過去形 なのに、 なんで 今の 話？',go:['modal',4],cards:[
   {x:'think',say:'would は <b>will の 過去形</b>。 でも Would you like〜? は 今の 話だよね。 ここが ふしぎな ところ',
    f:row([B('Would','m'),B('you','s'),B('like','v'),B('some tea?')],'o')+note('過去の 形なのに 「今 いかが？」')},
   {x:'smile',say:'英語では、 過去の 形に すると 気もちが <b>一歩 うしろに 下がる</b>の。 「いま・ここ」から はなれる ぶん、 おしつけない <b>ていねいな</b> 言い方に なるんだ',
    f:two(['Will you〜?','〜して くれる？','o'],['Would you〜?','〜して いただけますか？','g'])},
   {x:'happy',say:'同じ しくみの なかま。 could（can）・might（may）・should（shall）も、 I wanted to ask…（聞きたかったんですが）も ぜんぶ 「一歩 下がる」 過去形',
    f:tbl([['Could you〜?','もし できたら…（ていねいな おねがい）'],['It might rain.','ひょっとしたら ふるかも'],['You should〜','〜した ほうが いいよ'],['I was wondering if〜','〜かなと 思いまして']]),
    ex:[['Could you help me?','手伝って いただけますか？'],['I wanted to ask you something.','ちょっと お聞きしたい ことが あって']]}]})}

Object.assign(MINA_LINES,{
 mame_ok:[['happy','でしょ？ 知ると 英語の 見え方が かわるよね'],['love','これで あなたも ていねいな 英語の なかまいり'],['proud','つぎに 聞いたら 「あ、 一歩 下がってる」って 思い出してね'],['smile','授業じゃ ないから、 気楽に 覚えておいてね']],
 r_mame:[['happy','さっきの まめちしき、 覚えてる？ 過去の 形は 一歩 下がって ていねい、 だったね'],['love','ていねいな 過去形の 話、 先生 あれ 大好きなんだ'],['smile','お店で Would you〜? を 聞いたら、 さっきの 話を 思い出してみて'],['proud','would・could、 もう 「なんで？」って ならないね']],
 r_mameMore:[['smile','would の ほかにも 「一歩 下がる」 過去形は あるよ。 また 会話の 中で 見つけたら 教えるね'],['happy','could・might・should… ていねいな 過去形の なかま、 少しずつ 会えるよ']]
});
window.MINA_REACT_EXT=window.MINA_REACT_EXT||{};
const POLITE=['would','could','wanted','might','should'];
MINA_REACT_EXT.mame={act:e=>!POLITE.includes(e.t)?['r_mame2',{},null]:[e.t==='would'&&TIPS.some(t=>!R.s[t.id])&&Math.random()<.5?'r_mameMore':'r_mame',{},null],desc:e=>POLITE.includes(e&&e.t)?'ミナ先生の まめちしき（ていねいな 過去形）を 読んだ':'ミナ先生の まめちしき（音や ことば）を 読んだ'};
window.MAME={tips:TIPS,add:a=>{a.forEach(t=>{if(!TIPS.some(x=>x.id===t.id))TIPS.push(t)})},lesOf,lesHtml,seen:id=>!!R.s[id],test:id=>{const t=TIPS.find(x=>x.id===id);if(t)pop(t)}};
})();
