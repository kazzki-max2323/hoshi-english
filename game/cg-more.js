/* ことばカード の まわり: ほかの 機能との 連動・ミナ先生の セリフ
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
  if(kind==='tok')setTimeout(()=>H.toast(`🃏 ごほうびカード <b>${esc(I.en)}</b>（${esc(I.ja)}）<small>鉱山の 道具に 使えるよ</small>`,3600),1500);
  return I}
window.LESSON_AFTER=window.LESSON_AFTER||[];
LESSON_AFTER.push(()=>{const I=reward('lesson');if(!I)return null;const [,tx]=ML('cg_reward',{w:I.en});
  return {html:`<span class="lstk">🃏 ごほうびカード <b>${esc(I.en)}</b>（${esc(I.ja)}）<small>${tx}</small></span>`}});

/* ================================================================ 🏆 浜辺の カード大会 */
let T=null;
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
 cg_first:[['wow','浜辺に カードショップ「しおさい」が あるよ！ 単語帳の 単語が ぜんぶ カードに なるんだ。 店長は なんと きみ'],['happy','カードの ボタンは カードショップに おひっこし。 浜辺の 小屋を タップしてね']],
 cg_reward:[['happy','授業の ごほうび。 「{w}」の カードは 鉱山の 道具に なるよ'],['smile','カードが 1まい ふえたよ。 コンボの なかまかも？']],
 cg_tourIntro:[['smile','浜辺の カード大会へ ようこそ！ 決勝で 待ってるからね'],['proud','大会では 英語の インタビューも あるよ。 落ち着いて 答えてね'],['happy','3回 勝てば 優勝。 わたしも 本気で いくよ！']],
 cg_tourWin:[['love','優勝 おめでとう！ わたしに 勝つなんて… ほんとに すごいよ'],['wow','チャンピオン！ {n}回目の 優勝だね。 ほこらしいよ']],
 cg_tourLose:[['smile','{r}で まけちゃったね。 でも 試合の 中で おぼえた 単語は ちゃんと のこってるよ'],['think','{r}まで 来たね。 まちがえた 単語を 復習して、 また いどもう']],
 cg_minaGift:[['love','負けちゃった… でも うれしいな。 これ、 わたしからの とくべつな 文カード'],['happy','きみ、 ほんとに 強くなったね。 はい、 ごほうびの 文カード'],['proud','{n}回目の 勝利だね。 先生として ほこらしいよ']],
 cg_win:[['happy','{f}に 勝ったね！ コンボ、 うまく 使えてた'],['proud','勝利！ 正解した 単語は おぼえて きてるよ']],
 cg_lose:[['smile','{f}に 負けちゃったね。 まちがえた 単語は 結果に のってるよ'],['think','守るときは 相手の カードの 問題だよ。 はやく 答えると 🛡が 2ばい'],['smile','となりの 土地と コンボに なる 単語を 置くと、 通行料が 2ばい。 そこを ねらってみて'],['think','同じ 色の 土地を あつめると 通行料が どんどん 上がるよ']],
 x_cgOpen:[['smile','浜辺の 小屋は カードショップ「しおさい」。 きみが 店長に なって、 単語の 鉱山で カードを ほるんだ'],['happy','カードショップに 行ってみて！ アルバイトの ミオさんが 待ってるよ']],
 x_cgWeak:[['proud','苦手カードの {w}、 鉱山の 道具に すると 何回も 練習できるよ。 にげずに 使ってみて'],['think','{w} は まちがいノートの 単語。 カードで 出すと おぼえやすいよ']],
 x_cgForgot:[['think','💤 {w} の カード、 しばらく 見てないね。 鉱山で 使ってみて'],['smile','わすれかけた ころに 思い出すと、 いちばん 記憶に のこるんだ']],
 x_cgFree:[['happy','カードショップで きょうの むりょうパックが もらえるよ'],['smile','むりょうパック、 まだ あけてないよ']],
 x_cgPack:[['smile','カードショップの 仕入れ、 1パック 10まい前後 入ってるよ。 まだ もってない カードが 出やすいんだ'],['happy','仕入れの パックは ぜんぶ さいしょから 買えるよ。 小学生パックから ハイレベルまで、 すきな ところから'],['think','仕入れは ちょっと 高いけど、 1パックで 10まいくらい ふえるよ。 鉱山で ためた コインで どうぞ'],['smile','仕入れは 何回でも できるように なったよ。 コインが あれば すきなだけ どうぞ'],['think','仕入れの パックは 小・中・高の 単語。 毎日の 練習用の カードを ふやすのに ぴったり']],
 x_cgSent:[['smile','📜 文カードパックには 文カードが 2まい。 文に 出てくる 単語の カードも いっしょに 入ってるよ'],['proud','文カードの 英文、 声に 出して 読んでみて。 単語が 文の 中で どう 使われるか わかるよ']],
 x_cgGood:[['point','🎁宝カードと ハイレベルの 単語カードは、 仕入れの パックには 入って ないの。 ⛏️鉱山でしか 見つからないよ'],['smile','いい カードが ほしいなら 鉱山へ！ 深く ほるほど SR や SSR、 UR まで 出やすく なるんだって'],['think','仕入れは 練習用、 鉱山は 宝さがし。 そう おぼえておくと わかりやすいよ'],['happy','鉱山の 「星の 層」まで 行くと、 ハイレベルの 単語カードが 見つかるよ。 むずかしいけど その ぶん 宝もの']],
 sh_packFree:[['happy','カードショップの 仕入れ、 何回でも できるように なったよ！ ただし いい カードは 鉱山だけ'],['smile','仕入れが 何回でも OKに なったよ。 🎁宝カードは ⛏️鉱山で さがしてね']]});
const goShop=()=>['🃏 カードショップへ',()=>C.open()];
const goTab=t=>()=>['🃏 カードショップへ',()=>{C.open();setTimeout(()=>C.go(t),50)}];
if(window.MINA_SENSE&&MINA_SENSE._rules)MINA_SENSE._rules.push(
 ['x_cgOpen',4,()=>!R().met?{}:null,goShop],
 ['x_cgWeak',3,()=>{const a=Object.keys(R().c).filter(id=>C.BY[id]&&C.weak(id));if(!a.length)return null;return {w:C.info(pickL(a)).en.split(',')[0]}},goTab('mine')],
 ['x_cgForgot',2,()=>{const a=Object.keys(R().c).filter(id=>C.BY[id]&&C.forgot(id));if(!a.length)return null;return {w:C.info(pickL(a)).en.split(',')[0]}},goTab('mine')],
 ['x_cgFree',3,()=>R().met&&R().free!==C.today()?{}:null,goTab('pack')],
 ['x_cgPack',2,()=>R().met&&ST.coins>=150?{}:null,goTab('pack')],
 ['x_cgSent',1,()=>R().met&&ST.coins>=450?{}:null,goTab('pack')],
 ['x_cgGood',2,()=>R().met?{}:null,goTab('mine')]);
/* 11/16 仕入れは 何回でも・いい カードは 鉱山だけ: 1回だけ ミナ先生が 知らせる */
setTimeout(function pf(){const r=R();if(!r.met||r.packFree)return;const m=window.MINA;if(!m||!m.canAnnounce||!m.canAnnounce())return setTimeout(pf,20000);
  r.packFree=1;C.save();const [ex,tx]=ML('sh_packFree');m.say('m',ex,tx,9000,null,['🃏 カードショップへ',()=>C.open()])},14000);
/* the card button left the home screen: Mina points at the hut once */
setTimeout(function first(){if(R().told)return;const m=window.MINA;if(!m||!m.canAnnounce||!m.canAnnounce())return setTimeout(first,15000);
  R().told=1;C.save();const [ex,tx]=ML('cg_first');m.say('m',ex,tx,10000,null,['🃏 のぞいてみる',()=>C.open()])},9000);

window.CGM={reward,afterGame,minaWin,giftItems,giftUse};
})();
