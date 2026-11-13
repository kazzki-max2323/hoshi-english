/* ことばカード の まわり: 🥋 コンボ道場・🏆 浜辺の カード大会・ほかの 機能との 連動・ミナ先生の セリフ
   - コンボ道場: 対戦なしで ことばコンボを 5問（あいかた・どっちが 自然？・いみ）。 ヒント→解説、 出た 問題は 一巡するまで 出ない、 結果まとめ
   - カード大会（3級から）: 3回 勝てば 優勝。 試合の あいだに 英語の 会話。 決勝は ミナ先生
   - 連動: 授業・苦手とっくんの ごほうびカード／まちがいノートの 単語は 苦手カード（game/cg.js）／ミナ先生に 勝つと ハートが すこし（ラブストーリー）と 特別な カード／ダブった カードを 浜辺の みんなに プレゼント */
(()=>{
const {S:ST,sfx:SFX}=BEACH;
const H=HE,esc=H.esc,$=id=>document.getElementById(id);
const C=CG,pickL=C.pickL,R=()=>C.rec();
const sf=k=>{try{SFX[k]&&SFX[k]()}catch(e){}};
const ML=(k,v)=>{try{return MINA.line(k,v||{})}catch(e){return ['smile','']}};
const mface=ex=>{try{return MINA.face('m',ex)}catch(e){return '👩‍🏫'}};
const LVK=['es','jh','hs','adv'];
const lvOfCombo=c=>{const a=C.cardOfHead(c.a).lv,b=C.cardOfHead(c.b).lv;return LVK[Math.max(LVK.indexOf(a),LVK.indexOf(b))]};

/* ================================================================ 🎁 reward cards (lessons, とっくん) */
function rewardCard(){const lv=C.lvOpen(C.myLv())?C.myLv():'es',mine=new Set(Object.keys(R().c).map(id=>(C.BY[id]||{}).h));
  const cs=C.COMBO.filter(c=>mine.has(c.a)!==mine.has(c.b)).map(c=>C.cardOfHead(mine.has(c.a)?c.b:c.a)).filter(c=>c&&c.lv===lv);
  if(cs.length&&Math.random()<.6)return pickL(cs).id;
  const fresh=C.W.filter(c=>c.lv===lv&&!C.owns(c.id));return pickL(fresh.length?fresh:C.W.filter(c=>c.lv===lv)).id}
/* up to 3 a day */
function reward(kind){const r=R(),d=C.today();if(r.rw&&r.rw.d===d&&r.rw.n>=3)return null;r.rw=r.rw&&r.rw.d===d?r.rw:{d,n:0};r.rw.n++;
  const id=rewardCard();C.give(id);C.save();const I=C.info(id);
  if(kind==='tok')setTimeout(()=>H.toast(`🃏 ごほうびカード <b>${esc(I.en)}</b>（${esc(I.ja)}）<small>デッキに 入れて 使えるよ</small>`,3600),1500);
  return I}
window.LESSON_AFTER=window.LESSON_AFTER||[];
LESSON_AFTER.push(()=>{const I=reward('lesson');if(!I)return null;const [,tx]=ML('cg_reward',{w:I.en});
  return {html:`<span class="lstk">🃏 ごほうびカード <b>${esc(I.en)}</b>（${esc(I.ja)}）<small>${tx}</small></span>`}});

/* ================================================================ 🥋 コンボ道場 */
const DJ=()=>{const r=R();return r.dojo||(r.dojo={seen:[],n:0,best:0,perfect:0})};
function dojoPool(){const lvs=LVK.filter(C.lvOpen);return C.COMBO.filter(c=>lvs.includes(lvOfCombo(c)))}
function dojoQ(c){const t=pickL(C.WRONG.some(w=>w.ok.replace(/^(a|an|the) /,'')===c.p||w.ok===c.p)?['pair','which','which','mean']:['pair','pair','mean']);
  if(t==='which'){const ws=C.WRONG.filter(w=>w.ok===c.p),wr=ws.map(w=>`${w.a} ${w.b}`),ch=H.shuffle([c.p,...wr.slice(0,3)]);
    return {t:'combo',q:`<span class="qja">「${esc(c.j)}」は どっち？</span>`,ch,ans:ch.indexOf(c.p),hint:`${esc(c.b)} と よく いっしょに 使う ことばを えらぼう`,tip:`<b>${esc(c.p)}</b> ＝ ${esc(c.j)}<br><small>${esc(ws[0].why)}</small>`,say:['es',c.p],c,w:ws[0]}}
  if(t==='mean'){const ws=H.shuffle(C.COMBO.filter(x=>x.k!==c.k&&x.j!==c.j)).slice(0,3).map(x=>x.j),ch=H.shuffle([c.j,...ws]);
    return {t:'combo',q:`<span class="qen">${esc(c.p)}</span>`,ch,ans:ch.indexOf(c.j),hint:`${esc(c.a)} ＝ ${esc(C.cardOfHead(c.a).ja)}、 ${esc(c.b)} ＝ ${esc(C.cardOfHead(c.b).ja)}`,tip:`<b>${esc(c.p)}</b> ＝ ${esc(c.j)}`,say:['es',c.p],c}}
  /* the partner: one of the two words is shown */
  const k=Math.random()<.5,show=k?c.a:c.b,ans=k?c.b:c.a,lv=C.cardOfHead(ans).lv;
  const bad=H.shuffle(C.W.filter(x=>x.lv===lv&&x.h!==ans&&!C.comboOf(show,x.h)&&!/ /.test(x.h)&&C.cardOfHead(ans).a===x.a)).slice(0,3).map(x=>x.h);
  while(bad.length<3){const x=pickL(C.W);if(x.h!==ans&&!C.comboOf(show,x.h)&&!bad.includes(x.h))bad.push(x.h)}
  const ch=H.shuffle([ans,...bad]);const blank=c.p.replace(new RegExp('\\b'+ans.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'\\b','i'),'＿＿＿');
  return {t:'combo',q:`<span class="qen">${esc(blank)}</span>`,ch,ans:ch.indexOf(ans),hint:`いみは「${esc(c.j)}」`,tip:`<b>${esc(c.p)}</b> ＝ ${esc(c.j)}`,say:['es',c.p],c}}
function dojo(back){const D=DJ(),pool=dojoPool();let fresh=pool.filter(c=>!D.seen.includes(c.k));if(fresh.length<5){D.seen=[];fresh=pool}
  const set=H.shuffle(fresh).slice(0,5);let i=0;const res=[];
  const [ex,tx]=ML('cg_dojoStart');
  const step=()=>{const c=set[i],q=dojoQ(c);
    H.show('cg',`<section class="pnl cgp" data-stay>
      <div class="qtop"><button class="x" id="cgb" aria-label="もどる">←</button><b>🥋 コンボ道場</b><span class="qn">${i+1}/5</span></div>
      ${i===0?`<div class="cgnagi"><span class="cgnf cgm">${mface(ex)}</span><div class="cgnb"><b>ミナ先生</b><p>${tx}</p></div></div>`:''}
      <div id="djq"></div></section>`);
    $('cgb').onclick=()=>{sf('back');(back||C.open)()};
    C.ask($('djq'),q,r=>{D.seen.push(c.k);const nw=r.ok&&C.foundCombo(c);if(q.w&&!r.ok)C.metWrong(q.w);res.push({c,ok:r.ok,hint:r.hint,nw});C.save();
      if(nw)H.toast(`🔗 コンボ図鑑に <b>${esc(c.p)}</b>`,1800);i++;i<set.length?step():end()})};
  const end=()=>{const ok=res.filter(x=>x.ok&&!x.hint).length,hint=res.filter(x=>x.ok&&x.hint).length,perfect=ok===res.length;
    const coins=ok*3+hint+(perfect?5:0);if(coins)H.addCoins(coins);D.n++;if(perfect)D.perfect++;D.best=Math.max(D.best,ok);C.save();
    const [e2,t2]=ML(perfect?'cg_dojoPerfect':ok+hint>=3?'cg_dojoGood':'cg_dojoMiss',{n:ok});sf(perfect?'fanfare':'done');
    H.show('cg',`<section class="pnl cgp">
      <div class="qtop"><span></span><b>🥋 道場 おわり！</b><span class="qn">⭕${ok} 💡${hint}</span></div>
      <div class="cgnagi"><span class="cgnf cgm">${mface(e2)}</span><div class="cgnb"><b>ミナ先生</b><p>${t2}</p></div></div>
      <div class="cgsr">${res.map(x=>`<div class="cgrow cb"><span class="ri">${x.ok?x.hint?'💡':'⭕':'📘'}</span><span class="rn"><b>${esc(x.c.p)}</b><small>${esc(x.c.j)}${x.nw?'　NEW!':''}</small></span><button class="sub" data-say="${esc(x.c.p)}">🔊</button></div>`).join('')}</div>
      ${coins?`<p class="note">🪙 +${coins}</p>`:''}
      <div class="row"><button id="djag" class="sub">もう 5問</button><button id="djbk" data-back>もどる</button></div></section>`);
    H.panel.querySelectorAll('[data-say]').forEach(b=>b.onclick=()=>C.speak(b.dataset.say));
    $('djag').onclick=()=>{sf('step');dojo(back)};$('djbk').onclick=()=>{sf('back');(back||C.open)()}};
  step()}

/* ================================================================ 🏆 浜辺の カード大会 */
let T=null;
const TOUR_FEE=50;
function tour(back){if(T&&T.alive)return bracket();
  const r=C.rank(),pool=CGB.foes.filter(f=>!f.mina&&f.id!=='nagi'&&f.need<=r);
  const [ex,tx]=ML('cg_tourIntro');
  H.show('cg',`<section class="pnl cgp">
    <div class="qtop"><button class="x" id="cgb" aria-label="もどる">←</button><b>🏆 浜辺の カード大会</b><span class="qn">🏆${R().tw||0}</span></div>
    <div class="cgnagi"><span class="cgnf cgm">${mface(ex)}</span><div class="cgnb"><b>ミナ先生</b><p>${tx}</p></div></div>
    <p class="note">3回 勝てば 優勝！ 決勝の 相手は ミナ先生。 試合の あいだに 英語で インタビューが あるよ</p>
    <div class="row"><button id="tgo">🏆 エントリー（🪙${TOUR_FEE}）</button></div></section>`);
  $('cgb').onclick=()=>{sf('back');(back||C.open)()};
  $('tgo').onclick=()=>{if(!C.pay(TOUR_FEE))return;const ops=H.shuffle(pool).slice(0,6);const easy=ops.slice().sort((a,b)=>a.p-b.p);
    T={alive:true,back,round:0,res:[],foes:[easy[0],easy[easy.length-1]||easy[0],CGB.foe('mina')],others:ops,talk:H.shuffle(CG_TOUR_TALK.map((x,i)=>i)),good:0};interview(0,bracket)}}
const RN=['1回戦','準決勝','決勝'];
function bracket(){const t=T;H.show('cg',`<section class="pnl cgp" data-stay>
    <div class="qtop"><button class="x" id="cgb" aria-label="やめる">←</button><b>🏆 カード大会</b><span class="qn">${RN[Math.min(2,t.round)]}</span></div>
    <div class="cgbr">${t.foes.map((f,i)=>`<div class="br ${i<t.round?'won':i===t.round?'now':''}"><span>${RN[i]}</span><span class="bri">${f.ico}</span><b>${esc(f.n)}</b><em>${i<t.round?'🏆 かち':i===t.round?'つぎ！':''}</em></div>`).join('')}</div>
    <p class="note">ほかの 試合: ${t.others.filter(f=>!t.foes.includes(f)).map(f=>f.ico).join(' ')} も がんばってる</p>
    <div class="row"><button id="tplay">⚔️ ${esc(t.foes[t.round].n)}と 対戦！</button></div></section>`);
  $('cgb').onclick=()=>{C.ov(`<div class="cgbuy"><b>大会を やめる？</b><p class="note">エントリー代は もどらないよ</p><button id="qy" class="sub">やめる</button><button id="qn">つづける</button></div>`,'by');
    $('qn').onclick=()=>{sf('step');C.closeOv()};$('qy').onclick=()=>{C.closeOv();const b=T.back;T=null;(b||C.open)()}};
  $('tplay').onclick=()=>{sf('step');CGB.start(t.foes[t.round].id,{onEnd:afterMatch,pickBack:bracket})}}
function afterMatch(win){const t=T;if(!t)return C.open();
  if(!win){t.alive=false;const prize=t.round===2?100:t.round===1?40:0;if(prize)H.addCoins(prize);const [ex,tx]=ML('cg_tourLose',{r:RN[t.round]});
    return finishTour(`🌙 ${RN[t.round]}で まけ…`,ex,tx,prize?`🪙 +${prize}（${t.round===2?'準優勝':'ベスト4'}）`:'')}
  t.round++;if(t.round<3)return interview(t.round,bracket);
  /* champion */
  t.alive=false;const r=R();r.tw=(r.tw||0)+1;r.rp=(r.rp||0)+3;H.addCoins(300);
  const lv=LVK.filter(C.lvOpen).pop(),pool=C.W.filter(c=>c.lv===lv&&!C.owns(c.id)&&C.combosWith(c.h).length);const card=pickL(pool.length?pool:C.W.filter(c=>c.lv===lv)).id;C.give(card);C.save();
  sf('fanfare');try{const b=H.panel.getBoundingClientRect();[0,400,800].forEach(d=>setTimeout(()=>FX.firework(b.left+b.width*(.3+Math.random()*.4),b.top+60),d))}catch(e){}
  const [ex,tx]=ML('cg_tourWin',{n:r.tw});finishTour('🏆 優勝！',ex,tx,`🪙 +300　🎖️ +3　${C.face(card,{ja:1,cls:'tprize'})}`)}
function finishTour(title,ex,tx,prize){const b=T&&T.back;T=null;
  H.show('cg',`<section class="pnl cgp">
    <div class="qtop"><span></span><b>${title}</b><span></span></div>
    <div class="cgnagi"><span class="cgnf cgm">${mface(ex)}</span><div class="cgnb"><b>ミナ先生</b><p>${tx}</p></div></div>
    ${prize?`<div class="cgtp">${prize}</div>`:''}
    <div class="row"><button id="tbk" data-back>もどる</button></div></section>`);
  $('tbk').onclick=()=>{sf('back');(b||C.open)()}}
/* the interview between matches: one line of English */
function interview(round,next){const t=T,k=t.talk[round%t.talk.length],x=CG_TOUR_TALK[k];const ch=H.shuffle(x[3].map((s,j)=>[s,j]));
  const o=C.ov(`<div class="cgtalk"><div class="cgnagi"><span class="cgnf">🐦</span><div class="cgnb"><b>司会の カモメ</b><p class="en">${esc(x[1])}</p><p class="ja">${esc(x[2])}</p></div></div>
    <div class="cgtc">${ch.map(([s,j])=>`<button data-j="${j}">${esc(s)}</button>`).join('')}</div><div class="cgtx" hidden></div></div>`,'tk');o.dataset.stay=1;C.speak(x[1]);
  o.querySelectorAll('[data-j]').forEach(b=>b.onclick=()=>{const ok=b.dataset.j==='0';o.querySelectorAll('[data-j]').forEach(y=>{y.disabled=true;if(y.dataset.j==='0')y.classList.add('ok')});
    b.classList.add(ok?'ok':'ng');sf(ok?'correct':'wrong');if(ok){t.good++;C.speak(x[3][0])}
    const tx=o.querySelector('.cgtx');tx.hidden=false;tx.innerHTML=`<p>${ok?'⭕ 会場から はくしゅ！ 👏':'💡 '+esc(x[3][0])}<br><small>${esc(x[4])}</small></p><button class="nx">つぎへ ▶</button>`;
    tx.querySelector('.nx').onclick=()=>{sf('step');C.closeOv();next()}})}

/* ================================================================ after a game */
function afterGame(fid,win,s){const r=R();r.last={f:fid,win:win?1:0,d:C.today(),ok:s.ok,n:s.n,c:s.combos};C.save()}
/* beating Ms. Mina: a little heart (the love story; once a day) and a special card */
function minaWin(){const r=R();r.mw=(r.mw||0)+1;let msg='';
  try{if(window.LOVE&&LOVE.cardWin)msg=LOVE.cardWin()||''}catch(e){}
  const ss=C.SENT.filter(s=>!C.owns('s:'+s.i)),pick=ss.length?pickL(ss):null;
  if(pick){C.give('s:'+pick.i)}C.save();
  const [ex,tx]=ML('cg_minaGift',{n:r.mw});
  setTimeout(()=>{C.ov(`<div class="cgbuy cgnote"><div class="cgnagi"><span class="cgnf cgm">${mface(ex)}</span><div class="cgnb"><b>ミナ先生</b><p>${tx}</p></div></div>
    ${pick?`${C.face('s:'+pick.i,{ja:1,cls:'tprize'})}<p>📜 ミナ先生の 文カード<br><b>${esc(pick.en)}</b></p>`:''}${msg?`<p>${msg}</p>`:''}<button id="ntok">ありがとう！</button></div>`,'by').dataset.stay=1;
    $('ntok').onclick=()=>{sf('step');C.closeOv()}},900)}

/* ================================================================ presents: spare cards (you keep one) */
const TAGS={ani:['nature','cute'],food:['food'],nat:['nature'],heart:['cute','book'],act:['adventure','toy'],look:['art'],life:['handmade','toy'],learn:['book'],word:['book']};
if(typeof GIFT_TAGS!=='undefined')Object.keys(TAGS).forEach(k=>{GIFT_TAGS['c:'+k]=TAGS[k].concat(['book'])});
function giftItems(){return Object.keys(R().c).filter(id=>R().c[id]>=2&&C.BY[id]).slice(0,40).map(id=>{const I=C.info(id);
  return {ref:'c:'+id,key:'c:'+I.a,ico:C.art(I)[0],n:`${I.en.split(',')[0]}の カード`,w:`${I.en.split(',')[0]} card`,src:'c',cid:id}})}
function giftUse(it){C.take(it.cid);C.save()}

/* ================================================================ Ms. Mina's lines */
Object.assign(MINA_LINES,{
 cg_first:[['wow','浜辺に カードショップ「しおさい」が できたよ！ 単語帳の 単語が ぜんぶ カードに なって 対戦できるんだって'],['happy','カードの ボタンは カードショップに おひっこし。 浜辺の 小屋を タップしてね']],
 cg_reward:[['happy','授業の ごほうび。 「{w}」を デッキに 入れてみて'],['smile','カードが 1まい ふえたよ。 コンボの なかまかも？']],
 cg_dojoStart:[['smile','コンボ道場へ ようこそ。 英語として 自然な 組み合わせを 5問 いくよ'],['proud','「heavy rain」みたいな 組み合わせは まとめて おぼえると 強いよ'],['think','日本語で 考えると まちがえやすい 組み合わせも あるから 気をつけてね']],
 cg_dojoPerfect:[['love','5問 ぜんぶ 正解！ ことばの 組み合わせ、 体で わかってきたね'],['wow','かんぺき！ 対戦でも この コンボを ねらってみて']],
 cg_dojoGood:[['happy','{n}問 ヒントなしで 正解！ まちがえた ものは 声に 出して もう いちど 読んでみよう'],['smile','いい 調子。 組み合わせは 「セットで 音読」が いちばん 効くよ']],
 cg_dojoMiss:[['think','コンボは 1つずつ おぼえれば いいからね。 📘の ものを 声に 出してみて'],['smile','まちがえた 組み合わせほど、 つぎに 会うと おぼえてるものだよ']],
 cg_tourIntro:[['smile','浜辺の カード大会へ ようこそ！ 決勝で 待ってるからね'],['proud','大会では 英語の インタビューも あるよ。 落ち着いて 答えてね'],['happy','3回 勝てば 優勝。 わたしも 本気で いくよ！']],
 cg_tourWin:[['love','優勝 おめでとう！ わたしに 勝つなんて… ほんとに すごいよ'],['wow','チャンピオン！ {n}回目の 優勝だね。 ほこらしいよ']],
 cg_tourLose:[['smile','{r}で まけちゃったね。 でも 試合の 中で おぼえた 単語は ちゃんと のこってるよ'],['think','{r}まで 来たね。 まちがえた 単語を 復習して、 また いどもう']],
 cg_minaGift:[['love','負けちゃった… でも うれしいな。 これ、 わたしからの とくべつな 文カード'],['happy','きみ、 ほんとに 強くなったね。 はい、 ごほうびの 文カード'],['proud','{n}回目の 勝利だね。 先生として ほこらしいよ']],
 cg_win:[['happy','{f}に 勝ったね！ コンボ、 うまく 使えてた'],['proud','勝利！ 正解した 単語は ★が 育ってるよ']],
 cg_lose:[['smile','{f}に 負けちゃったね。 まちがえた 単語は 結果に のってるよ'],['think','つぎは ねらわれた カードの 問題に はやく 答えて 🛡を 2ばいに してみて'],['smile','相手の コンボも 意味が わかれば ダメージ半分だよ']],
 x_cgOpen:[['smile','浜辺の 小屋は カードショップ「しおさい」。 単語が カードに なって 対戦できるよ'],['happy','カードショップに 行ってみて！ 店長の ナギさんが スターターデッキを くれるよ']],
 x_cgCombo:[['think','コンボ図鑑、 {n}/{tot}。 まだ 見つけてない 組み合わせが いっぱい あるよ'],['smile','ことばコンボを {n}こ 見つけたね。 自然な 組み合わせを おぼえると 英語が グッと 自然に なるよ']],
 x_cgWeak:[['proud','苦手カードの {w}、 対戦で 正解すると 「逆転」で 2ばいだよ。 にげずに 使ってみて'],['think','{w} は まちがいノートの 単語。 カードで 出すと おぼえやすいよ']],
 x_cgForgot:[['think','💤 {w} の カード、 しばらく 見てないね。 いま 正解すると わすれかけボーナスだよ'],['smile','わすれかけた ころに 思い出すと、 いちばん 記憶に のこるんだ']],
 x_cgOne:[['smile','カードショップの 1まい売り、 きょうの 6まいが ならんでるよ'],['happy','1まい売りに コンボの なかまが 出てるかも？']],
 x_cgSnipe:[['think','ねらいうち注文は 1日 1まい。 まちがいノートの 単語を 注文するのも おすすめ'],['smile','ほしい カードを ねらいうち できるよ。 コンボの あいかたを さがしてみて']],
 x_cgFree:[['happy','カードショップで きょうの むりょうパックが もらえるよ'],['smile','むりょうパック、 まだ あけてないよ']],
 x_cgRank:[['proud','いまは {r}。 あと {n}ポイントで {nx}！ {open}が ひらくよ'],['smile','段位を 上げると 新しい ルールが ひらくよ。 つぎは {open}']],
 x_cgMina:[['smile','わたしと カード勝負、 する？ 手かげん しないけどね'],['love','いつか わたしに 勝てたら… なにか いい ことが あるかもね']],
 x_cgDojo:[['think','コンボ道場で 5問 どう？ 対戦なしで 組み合わせを 練習できるよ'],['smile','道場で 見つけた コンボも 図鑑に のるよ']],
 x_cgTour:[['proud','浜辺の カード大会に 出られるように なったよ。 決勝で 待ってる！'],['happy','カード大会、 英語の インタビューも あって 楽しいよ']],
 x_cgKira:[['love','✨ きらきら版の カードが {n}まい！ 完全に おぼえた しるしだね'],['wow','★5の カードは きらきら 光るんだ。 {w}、 きれいだね']],
 x_cgPick:[['smile','デッキは 15まいまで。 対戦では その中から 4まいが ランダムで 出るよ'],['happy','前の 対戦に 出た カードは ☕おやすみ。 いろんな 単語に 会えるね'],['think','きょうの風は {wind}。 その 種類の カードは ⚔+1 だよ']],
 x_cgRule:[['proud','はやく 正解すると 💥クリティカル！ 1.5ばいだよ'],['think','反対の 意味の カードを ねらうと ⚡反対語アタックで 2ばい。 hot なら cold を ねらって'],['smile','にた 意味の カードを 場に ならべると 🛡️なかまガード。 守りが +2 だよ'],['happy','2まいが 自然な 組み合わせなら 合体攻撃。 防御を むしして 1.5ばいだよ']],
 x_cgWrong:[['think','「{bad}」じゃなくて 「{ok}」。 まちがいコンボ ノートに のってるよ'],['smile','日本語から 考えると まちがえやすい 組み合わせ、 「{ok}」で おぼえよう']],
 x_cgLast:[['happy','さっきの カード対戦、 {n}問中 {ok}問 正解！ 声に 出して 復習すると もっと 強くなるよ'],['smile','カード対戦で おぼえた 単語、 単語帳でも 見かえしてみてね']]});
const goShop=()=>['🃏 カードショップへ',()=>C.open()];
const goTab=t=>()=>['🃏 カードショップへ',()=>{C.open();setTimeout(()=>C.go(t),50)}];
if(window.MINA_SENSE&&MINA_SENSE._rules)MINA_SENSE._rules.push(
 ['x_cgOpen',4,()=>!R().met?{}:null,goShop],
 ['x_cgCombo',2,()=>{const n=Object.keys(R().combo).length;return R().met?{n,tot:C.COMBO.length}:null},goTab('combo')],
 ['x_cgWeak',3,()=>{const a=Object.keys(R().c).filter(id=>C.BY[id]&&C.weak(id));if(!a.length)return null;return {w:C.info(pickL(a)).en.split(',')[0]}},goTab('battle')],
 ['x_cgForgot',2,()=>{const a=Object.keys(R().c).filter(id=>C.BY[id]&&C.forgot(id));if(!a.length)return null;return {w:C.info(pickL(a)).en.split(',')[0]}},goTab('battle')],
 ['x_cgOne',1,()=>R().met&&R().d!==C.today()?{}:null,goTab('one')],
 ['x_cgSnipe',1,()=>R().met&&R().snipe!==C.today()?{}:null,goTab('snipe')],
 ['x_cgFree',3,()=>R().met&&R().free!==C.today()?{}:null,goTab('pack')],
 ['x_cgRank',2,()=>{if(!R().met)return null;const r=C.rank(),nx=CG_RANKS[r+1];if(!nx)return null;return {r:CG_RANKS[r][0],n:nx[1]-(R().rp||0),nx:nx[0],open:nx[2]}},goTab('battle')],
 ['x_cgMina',1,()=>R().met&&C.rank()>=8?{}:null,goTab('battle')],
 ['x_cgPick',2,()=>R().met?{wind:C.wind()[1]+' '+C.wind()[2]}:null,goTab('deck')],
 ['x_cgRule',2,()=>R().met&&R().games?{}:null,goTab('battle')],
 ['x_cgDojo',1,()=>R().met?{}:null,goTab('dojo')],
 ['x_cgTour',2,()=>R().met&&C.ruleOn('tour')&&!R().tw?{}:null,goTab('tour')],
 ['x_cgKira',1,()=>{const a=Object.keys(R().c).filter(id=>C.BY[id]&&C.kira(id));return a.length?{n:a.length,w:C.info(pickL(a)).en.split(',')[0]}:null},goTab('book')],
 ['x_cgWrong',1,()=>{const a=C.WRONG.filter(w=>R().wrong[w.k]);if(!a.length)return null;const w=pickL(a);return {bad:w.a+' '+w.b,ok:w.ok}},goTab('combo')],
 ['x_cgLast',2,()=>{const l=R().last;return l&&l.d===C.today()&&l.n?{n:l.n,ok:l.ok}:null},goTab('battle')]);
/* the card button left the home screen: Mina points at the hut once */
setTimeout(function first(){if(R().told)return;const m=window.MINA;if(!m||!m.canAnnounce||!m.canAnnounce())return setTimeout(first,15000);
  R().told=1;C.save();const [ex,tx]=ML('cg_first');m.say('m',ex,tx,10000,null,['🃏 のぞいてみる',()=>C.open()])},9000);
H.on('home',()=>{const l=R().last;if(!l||l.said||!window.MINA)return;l.said=1;C.save();setTimeout(()=>{try{if(!MINA.canAnnounce())return;const f=CGB.foe(l.f);const [ex,tx]=ML(l.win?'cg_win':'cg_lose',{f:f?f.n:''});MINA.say('m',ex,tx,8000)}catch(e){}},1500)});

window.CGM={dojo,tour,reward,afterGame,minaWin,giftItems,giftUse};
})();
