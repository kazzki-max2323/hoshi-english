/* 📦 旧ミニ授業の 中身を、 ほかの 形に 置きなおす（11/22 2回目）
   ユーザー「授業の 選択が 多いと あれも これも に なる。 授業に するまでも ない 内容は ほかの 表現に」
   ① 文法の 図・コツ・ハマ子の 語呂 → 📘単元の その 時間に カードを 1〜2まい 足す（GRAMLINK の 文法 → UNIT.byGram の 時間。 同じ 図が もう あれば 足さない）
   ② 単語の コツ・使い分け（get・take・look/see/watch・曜日 など）→ 単語カードの 📖くわしく に 「📘 ミナ先生の コツ」（とじた たたみ）
   ③ 音と 発音 → 会話に その 音の ことばが 出たら 💡まめちしき（game/mame.js の しくみ。 1つ 1回・6分 あける）
   ミニ授業 そのものは 🔍さがす から 読める。 えらぶ 所には 出さない */
(()=>{
const H=window.HE;if(!H||typeof LESSONS==='undefined')return;
const esc=H.esc,lesOf=id=>LESSONS.find(l=>l.id===id)||null;
const pickL=a=>a[Math.random()*a.length|0];
const FACES=['smile','happy','think','wow','proud','love','worry'];

/* ---------- ① 単元に カードを 足す ---------- */
const HEAD={zu:'🖼️ 図で もう一回',kotsu:'💡 覚え方の コツ',hama:'🍬 ハマ子さんの 語呂',oto:'👄 音の コツ',yarikata:'📝 練習の コツ'};
const ORD={zu:0,kotsu:1,oto:2,hama:3,yarikata:4};
function lesCard(l){const st=l.steps,fi=st.findIndex(s=>s[3]),s=fi>=0?st[fi]:null;
  const txt=s?s[2]:st.slice(0,3).map(x=>x[2]).join('<br>');
  const x=FACES.includes((s||st[0])[1])?(s||st[0])[1]:'smile';
  return {x,say:`<b>${HEAD[l.cat]||'💡'}</b>　<small>${esc(l.t)}</small><br>${txt}`,f:s?`<div class="fz mdlfz">${s[3]}</div>`:'',_les:l.id}}
function toUnits(){if(!window.UNIT||!UNIT.byGram||!window.GRAMLINK||!GRAMLINK.map)return;const M=GRAMLINK.map,at=new Map();
  /* 1つの ミニ授業は 1つの 時間だけ（いちばん 先に 習う 単元の、 いちばん 前の 時間） */
  const UO=window.MPLAN&&MPLAN.units?MPLAN.units():UNIT.list,rank=f=>{const i=UO.indexOf(f[0]);return (i<0?99:i)*100+f[1]};
  LESSONS.forEach(l=>{if(!(l.cat in ORD))return;const fs=Object.keys(M).filter(g=>M[g].includes(l.id)).map(g=>UNIT.byGram(g)).filter(Boolean).sort((a,b)=>rank(a)-rank(b));
    const f=fs[0];if(!f)return;const c=f[0].D.CH[f[1]];if(!c)return;if(!at.has(c))at.set(c,[]);at.get(c).push(l)});
  at.forEach((ls,c)=>{const has=(c.cards||[]).map(k=>String(k.f||'')+String(k.say||'')).join(' ');
    /* 図の 授業を 1つ ＋ コツ・語呂を 1つ まで。 同じ 図・同じ 話が もう ある ものは 足さない */
    const ok=ls.filter(l=>!l.steps.some(s=>s[3]&&has.includes(s[3].slice(0,120)))&&!has.includes(l.t)).sort((a,b)=>ORD[a.cat]-ORD[b.cat]);
    const pick=[ok.find(l=>l.cat==='zu'),ok.find(l=>l.cat!=='zu')].filter(Boolean);
    c.cards=(c.cards||[]).concat(pick.map(lesCard))})}
/* MPLAN（単元の じゅんばん）が 読みこまれてから */
setTimeout(()=>{try{toUnits()}catch(e){console.error(e)}},0);

/* ---------- ② 単語カードの 📖くわしく に 「ミナ先生の コツ」 ---------- */
const WORD_LES={
 'jh-get-image':['get','got'],'jh-take-image':['take','took'],'jh-make-do':['make','do','homework'],
 'jh-look-see-watch':['look','see','watch','look at'],'jh-come-go':['come','go','coming'],
 'es-greetings':['hello','hi','good morning','good afternoon','good evening','good night','goodbye','see you'],
 'es-colors-feelings':['red','yellow','green','blue','happy','sad','angry','sleepy','color','colour'],
 'es-katakana-trap':['stapler','notebook','mechanical pencil','outlet','autograph'],
 'jh-us-uk':['elevator','lift','apartment','flat','cookie','biscuit','fall','autumn','soccer','subway','underground','color','favorite'],
 'hs-very-alt':['very','exhausted','starving','huge','tiny','freezing','excellent','amazing','terrible','awful'],
 'hs-collocation':['heavy rain','take a photo','make a mistake','collocation'],
 'adv-discourse-markers':['however','therefore','moreover','nevertheless','as a result','in addition','in contrast','on the other hand'],
 'hs-phrasal-up-out-off':['eat up','clean up','run out','find out','take off','turn off','give up'],
 'es-sound-words':['splash','buzz','boom','knock','achoo','crunch'],
 'es-animal-sounds':['woof','meow','moo','oink','ribbit','rooster','frog','pig','cow'],
 'es-compound':['sunflower','rainbow','starfish','bedroom'],
 'es-opposites':['big','small','hot','cold','fast','slow'],
 'jh-ordinal':['first','second','third','fourth','fifth','twelfth','twentieth','twenty-first'],
 'hs-body-idioms':['break a leg','keep an eye on','cost an arm and a leg','give a hand','learn by heart'],
 'jh-contraction':["won't","don't","can't","isn't","aren't","i'm","you're","it's","didn't","doesn't","let's"],
 'jh-big-numbers':['hundred','thousand','million','billion'],
 'hs-for-during':['during'],
 'es-weather':['sunny','rainy','cloudy','snowy','windy','weather'],
 'es-aizuchi':['really','me too','i see'],
 'hs-rise-raise':['rise','raise','lie','lay'],
 'hs-between-among':['between','among','across','along'],
 'jh-ask-again':['pardon','sorry?'],
 'adv-hama-affect-effect':['affect','effect'],
 'jh-proverbs':['proverb'],
 'hs-email':['email','e-mail','dear','sincerely'],
};
const BY_WORD={};Object.entries(WORD_LES).forEach(([id,ws])=>{if(!lesOf(id))return;ws.forEach(w=>{(BY_WORD[w]=BY_WORD[w]||[]).push(id)})});
function wordBox(I){const h=String(I&&(I.h||I.en)||'').toLowerCase().trim();const ids=BY_WORD[h];if(!ids)return '';const l=lesOf(ids[0]);if(!l)return '';
  let ml='';try{if(window.MINA&&MINA.line)ml=MINA.line('wi_les',{w:I.en||h,t:l.t})[1]||''}catch(e){}
  return `<details class="wiles"><summary>📘 ミナ先生の コツ <small>${esc(l.t)}</small></summary>${ml?`<p class="wirm">${MICO()} ${esc(ml)}</p>`:''}
    ${l.steps.map(s=>`<div class="wils"><p>${s[2]}</p>${s[3]?`<div class="fz">${s[3]}</div>`:''}</div>`).join('')}</details>`}
(window.WI_MORE=window.WI_MORE||[]).push(wordBox);

/* ---------- ③ 音と 発音・会話の コツ → 💡まめちしき ---------- */
const SND=[
 ['es-magic-e',/\b(make|take|cake|name|time|like|home|cute|bike|five|nine|ride|game)\b/i,'smile','<b>{w}</b> の さいごの e、 読まないのに なんで ついてると 思う？'],
 ['es-phonics-abc',/\b(cat|bag|map|bed|pen|dog|cup|sit)\b/i,'think','<b>{w}</b>。 A は 「エイ」なのに、 なかで 読むと 「エイ」じゃ ないよね'],
 ['es-sh-ch-th',/\b(she|shop|fish|phone|photo|chair|lunch|watch)\b/i,'smile','<b>{w}</b> の 中に、 2もじで 1つの 音を つくる ペアが いるよ'],
 ['es-f-v',/\b(five|very|have|love|favorite|first|food)\b/i,'happy','<b>{w}</b> の f・v、 日本語の 「フ」「ブ」とは 口が ちがうんだ'],
 ['jh-th-l-r',/\b(think|thank|three|this|that|right|really|light)\b/i,'think','<b>{w}</b>。 th・l・r は 口の 形さえ わかれば こわくないよ'],
 ['es-linking',/\b(an apple|pick it up|check it out|get up|come on|look at|an egg|stand up)\b/i,'wow','「{w}」、 聞くと 1つの ことばみたいに つながって 聞こえない？'],
 ['jh-linking',/\b(not at all|turn it off|take it easy|a lot of|kind of|first of all)\b/i,'smile','「{w}」。 音が つながると 聞きとりにくい。 でも ルールが あるの','es-linking'],
 ['hs-oto-datsuraku',/\b(good night|next time|last night|hot dog|want to|bad day)\b/i,'think','「{w}」、 音が 1つ 消えて 聞こえるの、 気づいた？'],
 ['es-rhythm',/\b(banana|computer|tomato|potato|chocolate|vacation|umbrella)\b/i,'happy','<b>{w}</b>、 どこを 強く 言うか わかる？'],
 ['es-question-up',/\b(Are you|Do you|Is it|Can you|Is this)\b[^.!?]{0,40}\?/i,'smile','「{w}」。 こういう しつもんは さいご、 あがる？ さがる？'],
 ['jh-feeling-tone',/\b(Really|Oh|Wow|Sure|Okay)\b[?!]/,'wow','「{w}」。 同じ ことばでも 上げ下げで 気持ちが かわるんだよ','es-question-up'],
 ['jh-minimal-pair',/\b(ship|sheep|live|leave|hit|heat|sit|seat|full|fool)\b/i,'think','<b>{w}</b>。 1つの 音だけ ちがう 「にた ことば」が あるの'],
 ['jh-long-short',/\b(sheep|leave|heat|seat|pool|food|green|team)\b/i,'smile','<b>{w}</b> の 長い 音、 ただ のばす だけじゃ ないんだよ','jh-minimal-pair'],
 ['hs-stress-timed',/(\b[A-Za-z']+\b[ ,]+){10,}/,'think','長い 英文だね。 英語は 強い 音が 同じ 間隔で 来る リズムなの'],
 ['jh-schwa',/\b(about|sofa|banana|today|again|second)\b/i,'think','<b>{w}</b> の 中に、 英語で いちばん 多い 音が かくれてるよ'],
 ['jh-no-extra-vowel',/\b(dog|bed|desk|milk|book|stop|cup)\b/i,'smile','<b>{w}</b>、 「ド・ッ・グ」みたいに さいごに 母音を つけてない？'],
 ['hs-four-a',/\b(cat|cup|hot|father|apple|bus)\b/i,'wow','<b>{w}</b> の 「ア」。 英語の 「ア」は 4つ あるって 知ってた？','jh-schwa'],
 ['hs-flap-t',/\b(water|better|little|city|party|matter|get it|a lot of|pretty)\b/i,'wow','<b>{w}</b>、 「ウォーター」より 「ワーラー」に 聞こえない？'],
 ['hs-stress-shift',/\b(record|present|object|increase|export|import|permit|desert)\b/i,'think','<b>{w}</b>。 名詞と 動詞で 強く 言う 所が かわる ことばなの'],
 ['hs-did-you',/\b(did you|going to|want to|got to|have to)\b/i,'smile','「{w}」、 会話だと 短く くずれて 聞こえるよ'],
 ['jh-teen-ty',/\b(thirteen|thirty|fourteen|forty|fifteen|fifty|sixteen|sixty)\b/i,'think','<b>{w}</b>。 -teen と -ty、 聞き分けられる？'],
 ['hs-n-ng',/\b(sing|thing|king|long|song|thin|sun|run)\b/i,'smile','<b>{w}</b> の 「ん」、 日本語と ちがって 2つ あるの'],
 ['jh-diphthong',/\b(go|no|so|home|coat|boat|road|know|old)\b/i,'happy','<b>{w}</b>。 「ゴー」じゃ なくて 「ゴウ」なんだよ'],
 ['hs-dark-l',/\b(people|apple|little|feel|milk|school|well|tell|ball)\b/i,'think','<b>{w}</b> の さいごの l、 「ル」より 「ウ」に 近いの'],
 ['jh-katakana-stress',/\b(hotel|event|career|guitar|idea|percent|chocolate|vanilla)\b/i,'wow','<b>{w}</b>、 カタカナと 強い 所が ちがうんだ'],
 ['hs-contrast-stress',/\bI didn'?t say\b|\bnot (me|you|him|her|this|that)\b/i,'think','「{w}」。 どの ことばを 強く 言うかで 意味が かわるよ'],
 ['adv-ipa',/\b[a-z]{12,}\b/i,'smile','<b>{w}</b>、 長い ことばの 読み方、 発音記号が 読めると 自分で わかるよ'],
 /* 会話の コツ（ことばより 話し方の 話） */
 ['jh-tag-q',/,\s*(isn't|aren't|don't|doesn't|didn't|wasn't|won't|can't) (it|you|he|she|they|we)\?/i,'smile','「{w}」。 さいごに ちょこんと つく 「〜だよね？」の しっぽ'],
 ['jh-ask-again',/\b(Pardon\??|Sorry\?|say that again|What did you say)\b/i,'happy','「{w}」。 聞き返すのは はずかしく ないんだよ'],
 ['jh-keep-talking',/\b(How about you\?|And you\?|What about you\?)\b/i,'smile','「{w}」。 会話が 続く ひみつの 1つ'],
 ['es-aizuchi',/\b(Me too!|Really\?|That's great|Nice!|I see\.)/i,'happy','「{w}」。 ひとこと かえすだけで 会話が はずむよ'],
];
if(window.MAME&&MAME.add)MAME.add(SND.filter(x=>lesOf(x[0])).map(([id,re,x,hook,after])=>({id:'l:'+id,les:id,re,x,hook,after:after?'l:'+after:undefined})));

/* ---------- ミナ先生の セリフ ---------- */
Object.assign(MINA_LINES,{
 wi_les:[['smile','{w} には、 前に 話した コツが あるよ'],['happy','{w}、 「{t}」の 話が ぴったりなの'],['think','{w} を 見たら この コツを 思い出してね'],['proud','{w} の コツ、 これで もう だいじょうぶ']],
 mame_ok2:[['happy','でしょ？ 知ってると 耳が かわるよ'],['proud','つぎに 聞いたら 「あ、 これだ」って 思い出してね'],['love','ちょっとずつ 英語の 音に なれていこうね'],['smile','声に 出して 1回 まねして みてね']],
 r_mame2:[['happy','さっきの まめちしき、 覚えてる？ 声に 出して みた？'],['smile','音の まめちしきは、 聞くたびに 思い出すと 耳が よく なるよ'],['love','会話の 中で 見つけたら、 また 教えるね']],
});
window.MINIPLACE={WORD_LES,SND,wordBox,lesCard};
})();
