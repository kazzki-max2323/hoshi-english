/* 🕘 お店の 開店・閉店（11/22 カードショップ 作りなおし 第2弾）。 時間は 浜辺の 時計 GH()（beach/scene.js）
   - 🃏 カードショップ 9〜21時（閉まっていても 原石の 作業台は いつでも つかえる。 お客さんが 来ないだけ）
   - 🏪 ながれぎ雑貨店 10〜22時 ／ 🍽️ しおかぜ食堂 6〜23時（ほかの 店は ちょっとだけ 遅め。 食堂は 朝ごはんが あるので 6時から）
   - 閉まっている 雑貨店・食堂の 小屋を タップすると 「CLOSED」の 札と 店の 人の ひとこと（入口だけ。 ミナ先生の 案内からは 入れる）
   - 小屋には 閉まっている あいだ 小さな 札 */
(()=>{
const H=HE,esc=H.esc,$=id=>document.getElementById(id),pickL=a=>a[Math.random()*a.length|0];
const sf=k=>{try{BEACH.sfx[k]&&BEACH.sfx[k]()}catch(e){}};
const ML=(k,v)=>{try{return MINA.line(k,v||{})}catch(e){return ['smile','']}};
const gh=()=>{try{return GH()}catch(e){return new Date().getHours()}};
const T={cg:{o:9,c:21,n:'カードショップ しおさい',hut:'cgHut'},zakka:{o:10,c:22,n:'ながれぎ雑貨店',hut:'zkHut',who:'ノラさん',ico:'🦜'},food:{o:6,c:23,n:'しおかぜ食堂',hut:'fdHut',who:'マルコさん',ico:'🍽️'}};
const isOpen=k=>{const t=T[k];if(!t)return true;const h=gh();return h>=t.o&&h<t.c};
/* 開店前の じゅんびの 時間（開店の 3時間前から） */
const isPrep=k=>{const t=T[k];if(!t)return false;const h=gh();return h>=t.o-3&&h<t.o};
const hrs=k=>`${T[k].o}時〜${T[k].c}時`;
const untilOpen=k=>{const t=T[k],h=gh();return Math.max(1,Math.ceil(((t.o-h+24)%24)*7.5))};   // 浜辺の 1時間 = 7.5分

const CLOSED={
 zakka:[["Squawk! Closed! Closed!","（オウムの ピップ）クワッ！ しまってる！ しまってる！"],["Sorry, we're closed now. See you at ten!","ごめんなさいね、 いまは 閉店。 10時に また 来てね！"],["Nora is sleeping. Come back in the morning!","ノラさんは おやすみ中。 朝に また 来てね！"]],
 food:[["We're closed for tonight. Breakfast starts at six!","今夜は もう おしまい。 朝ごはんは 6時からだよ！"],["The kitchen is sleeping. Good night, my friend!","キッチンも おやすみ中。 おやすみ、 友よ！"],["Closed! But tomorrow's soup is already in my head.","閉店！ でも あしたの スープは もう 頭の 中に あるんだ。"]]};
function closed(k){const t=T[k],L=pickL(CLOSED[k]);sf('knock');
  H.show('hours',`<section class="pnl hrsp"><div class="qtop"><button class="x" id="hrsx" aria-label="もどる">←</button><b>${t.ico} ${esc(t.n)}</b><span class="qn"></span></div>
    <div class="hrssign"><b>CLOSED</b><small>しまっています</small></div>
    <p class="hrsen">${esc(L[0])}</p><p class="hrsja">${esc(L[1])}</p>
    <p class="hrst">🕘 ${hrs(k)} ・ あと ${untilOpen(k)}分くらいで 開店</p>
    <button id="hrsok" class="big">浜辺へ もどる</button></section>`);
  $('hrsx').onclick=$('hrsok').onclick=()=>{sf('back');H.home()};
  try{H.say('es',L[0])}catch(e){}
  mina(k==='food'?'hr_foodClosed':'hr_zakkaClosed',{h:hrs(k)},.5)}
/* 雑貨店・食堂の 小屋: 閉まっている ときは 札を 見せる（それぞれの onclick より 先に） */
addEventListener('click',e=>{if(H.screen!=='home')return;for(const k of ['zakka','food']){const b=$(T[k].hut);if(b&&b.contains(e.target)&&!isOpen(k)){e.stopImmediatePropagation();e.preventDefault();closed(k);return}}},true);
/* 小屋の 札 */
function signs(){for(const k of Object.keys(T)){const b=$(T[k].hut);if(!b)continue;const c=!isOpen(k);b.classList.toggle('hrsoff',c);
  let s=b.querySelector('.hrstag');if(c&&!s){s=document.createElement('i');s.className='hrstag';s.textContent='CLOSED';b.appendChild(s)}else if(!c&&s)s.remove()}}
setInterval(signs,3000);setTimeout(signs,900);

/* ================================================================ 👦 リクの 時間（家庭教師の バイト・11/22）
   リクは 8さいの 小学生。 浜辺の 時計 GH() と 日にち ST.gday（7日で 1週。 0=月よう日）で きめる
   - 月〜金: 学校の あと 15〜19時 ／ 土・日: 10〜17時
   - いない ときは パラソルに リクが いなくて、 小さな 札。 タップすると リクの おき手紙（英語）と ミナ先生の ひとこと
   - 来た ばかりの 1時間は 「学校 おわった！」、 帰る 前の 1時間は 「もうすぐ 帰る 時間」の セリフ（tutor.js top） */
const DOW=['月','火','水','木','金','土','日'],DOWE=['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
const gday=()=>{try{return BEACH.S.gday|0}catch(e){return 0}};
const isWE=d=>((d%7)+7)%7>=5;
const RT=d=>isWE(d)?{o:10,c:17}:{o:15,c:19};
const rHere=()=>{const t=RT(gday()),h=gh();return h>=t.o&&h<t.c};
const h12=h=>h>12?h-12:h;
const rHrs=d=>{const t=RT(d);return `${t.o}時〜${t.c}時`};
/* つぎに 来る 時刻と、 あと 何分（浜辺の 1時間 = 7.5分） */
function rNext(){const d=gday(),h=gh(),t=RT(d);if(h<t.o)return {o:t.o,tmr:false,min:Math.max(1,Math.ceil((t.o-h)*7.5))};
  const t2=RT(d+1);return {o:t2.o,tmr:true,min:Math.max(1,Math.ceil((24-h+t2.o)*7.5))}}
/* いない わけ */
function rWhy(){const d=gday(),h=gh(),t=RT(d);if(h>=t.c)return 'home';if(isWE(d))return 'weMorn';return h<7?'sleep':'school'}
const NOTE={
 school:[["I'm at school now. Back at three! – Riku","いま 学校だよ。 3時に もどるね！ ――リク"],["School first, beach later! See you at three.","学校が 先、 浜辺は あとで！ 3時に ね。"],["I have a spelling test today... Wish me luck! – Riku","きょうは 書きとりの テスト… がんばれって 言って！ ――リク"],["I'm in class. I will ask my teacher, too! – Riku","いま 授業中。 学校の 先生にも 聞いてみるね！ ――リク"]],
 sleep:[["Zzz... It's too early, Sensei! – Riku","ぐーぐー… 先生、 まだ 早すぎるよ！ ――リク"],["I'm still sleeping. School first, then the beach!","まだ ねてるよ。 学校の あとで 浜辺に 行くね！"]],
 weMorn:[["It's {D}! I'm still in bed. Come at ten! – Riku","{D}だよ！ まだ ふとんの 中。 10時に 来てね！ ――リク"],["No school today! I'll come at ten. – Riku","きょうは 学校 おやすみ！ 10時に 行くね。 ――リク"],["I'm eating pancakes with Mom. See you at ten!","ママと パンケーキ 食べてる。 10時に ね！"]],
 home:[["I went home for dinner. See you tomorrow! – Riku","ばんごはんで 家に 帰ったよ。 また あした！ ――リク"],["Mom said, \"Come home before dark!\" Bye, Sensei!","ママが 「暗くなる 前に 帰りなさい！」 だって。 バイバイ、 先生！"],["Good night, Sensei! I'll bring new questions tomorrow.","おやすみ、 先生！ あした 新しい 質問 もってくるね。"],["I'm doing my homework at home. See you tomorrow!","家で 宿題 してるよ。 また あした！"]]};
const TAG={school:'AT SCHOOL',sleep:'Zzz…',weMorn:'Zzz…',home:'SEE YOU!'};
function rAway(){const w=rWhy(),d=gday(),dn=DOW[((d%7)+7)%7]+'よう日',De=DOWE[((d%7)+7)%7],n=rNext();
  const L=pickL(NOTE[w]),L2=[L[0].replace('{D}',De),L[1].replace('{D}',dn)];
  const mk={school:'hr_rikuSchool',sleep:'hr_rikuSleep',weMorn:'hr_rikuWe',home:'hr_rikuHome'}[w];
  const [ex,tx]=ML(mk,{h:`${n.tmr?'あしたの ':''}${n.o}時`,d:dn});
  sf('knock');
  H.show('tutor',`<section class="pnl hrsp tuaway"><div class="qtop"><button class="x" id="hrsx" aria-label="もどる">←</button><b>👦 リクの パラソル</b><span class="qn"></span></div>
    <div class="tunotep"><small>📝 リクの おき手紙</small><p class="hrsen">${esc(L2[0])}</p><p class="hrsja">${esc(L2[1])}</p><button class="ksay" id="hrsay" aria-label="もう一度 きく">🔊</button></div>
    <p class="hrst">🗓 きょうは ${dn} ・ リクの 時間 ${rHrs(d)}<br>${n.tmr?'あしたの ':''}${n.o}時に 来るよ（あと ${n.min}分くらい）</p>
    ${tx?`<div class="kmina"><span class="lface">${MINA.face('m',ex)}</span><p>${tx}</p></div>`:''}
    <div class="row tur"><button id="hrsnote" class="sub">📒 リクの ノート</button><button id="hrsgift" class="sub">🎁 お礼</button></div>
    <button id="hrsok" class="big">浜辺へ もどる</button></section>`);
  const say=()=>{try{H.say('es',L2[0].replace(/\s*–\s*Riku$/,''))}catch(e){}};say();
  $('hrsay').onclick=e=>{e.stopPropagation();say()};
  $('hrsx').onclick=$('hrsok').onclick=()=>{sf('back');H.home()};
  $('hrsnote').onclick=()=>{try{TUTOR.notebook(rAway)}catch(e){}};
  $('hrsgift').onclick=()=>{try{TUTOR.gifts(rAway)}catch(e){}}}
/* tutor.js の top で つかう: 来た ばかり／帰る 前の リクの ひとこと */
const ARR={wd:['せんせい！ 学校 おわって すぐ 来たよ！ ランドセル おいてきた！','"School is over!" 学校 おわった〜！ きょうも 教えて！','はぁはぁ… 走ってきたの。 "I ran all the way!"','ただいま〜！ あ、 ここは 家じゃないか。 "Hello, sensei!"'],
 we:['きょうは {d}！ 学校 おやすみだから 朝から 来たよ','"No school today!" だから いっぱい 教えてね！','{d}は ポチの さんぽの あとで 来たよ。 "Good morning, sensei!"']};
const BYE=['あ、 もうすぐ 帰る 時間だ。 {c}時に なったら 帰るって ママと やくそく してるの','"I have to go home soon." …って 言うんだよね？ あと ちょっとだけ！','空が オレンジだ〜。 もう少しで "See you tomorrow!" の 時間だね','もうすぐ {c}時… 帰る 前に あと 1つ 聞いても いい？'];
let arrKey='';
function rLine(){if(!rHere())return '';const d=gday(),t=RT(d),h=gh(),dn=DOW[((d%7)+7)%7]+'よう日';
  if(h<t.o+1){const k=d+':'+t.o;if(arrKey!==k){arrKey=k;return pickL(isWE(d)?ARR.we:ARR.wd).replace('{d}',dn)}}
  if(h>=t.c-1&&Math.random()<.7)return pickL(BYE).replace('{c}',t.c);
  return ''}
/* 浜辺の パラソル: いない ときは リクを かくして 札 */
function rSign(){const b=$('tuSpot');if(!b)return;const a=!rHere();b.classList.toggle('away',a);if(a)b.classList.remove('ask');
  let s=b.querySelector('.tuAwayTag');const txt=a?TAG[rWhy()]:'';if(a&&!s){s=document.createElement('i');s.className='tuAwayTag';b.appendChild(s)}
  if(s){if(a)s.textContent=txt;else s.remove()}}
setInterval(rSign,2500);setTimeout(rSign,1000);try{H.on('home',()=>setTimeout(rSign,80))}catch(e){}
window.RIKUH={here:rHere,away:rAway,line:rLine,hrs:rHrs,next:rNext,why:rWhy,day:()=>gday(),isWE};

function mina(k,v,p){try{if(window.MINA&&MINA.canAnnounce&&MINA.canAnnounce()&&Math.random()<p){const [ex,tx]=ML(k,v);if(tx)setTimeout(()=>MINA.say('m',ex,tx,6000),1400)}}catch(e){}}
Object.assign(MINA_LINES,{
 hr_new:[['point','お店に 開店と 閉店の 時間が できたよ。 カードショップは 9時から 21時、 雑貨店は 10時から、 食堂は 朝 6時から 夜 11時まで'],['smile','お店の 時間は 浜辺の 時計で 見てね。 閉店後も カードショップの 原石の 作業台は つかえるよ']],
 hr_zakkaClosed:[['smile','雑貨店は もう 閉まってるね。 {h}だよ。 英語で 閉店は "We\'re closed."'],['think','"Closed" は 「しまっている」。 "Open" の 反対だね']],
 hr_foodClosed:[['smile','食堂は おやすみ。 {h}だよ。 おなかが すいたら 🎒もちものの 食べ物も あるよ'],['think','"See you tomorrow!" って 言って 帰ろうか']],
 hr_cgClosed:[['smile','カードショップは 閉店中。 でも 原石の 作業台は いつでも つかえるよ'],['happy','お客さんが 来ない 夜は、 原石みがきに 集中できるね']],
 hr_rikuNew:[['point','リクくんにも 来る 時間が できたよ。 ふだんの 日は 学校の あと 3時から 7時、 土よう日と 日よう日は 10時から 5時まで。 浜辺の 時計で 見てね'],['smile','リクくんは 小学生だから、 平日は 学校の あと 3時から 7時に パラソルに いるよ。 週末は 10時から 5時']],
 hr_rikuSchool:[['smile','リクくんは いま 学校。 英語だと "He\'s at school." だね。 {h}に 来るよ'],['wink','リクくんが 来るまで、 📘授業で 予習しておく？ 教える ネタが ふえるよ'],['think','"at school" は 「学校で 勉強中」。 "in school" とも 言うよ。 リクくんは {h}に 来るね']],
 hr_rikuSleep:[['smile','まだ 朝 早いから、 リクくんは ねてるね。 "He\'s still sleeping."'],['wink','早起き だね。 リクくんは 学校の あと、 {h}に 来るよ']],
 hr_rikuWe:[['happy','きょうは {d}。 学校が お休みだから、 リクくんは {h}に 来るよ'],['smile','週末は "weekend"。 リクくんは {h}から パラソルに いるよ']],
 hr_rikuHome:[['smile','リクくんは もう 帰ったよ。 "He went home." また {h}にね'],['happy','子どもは 暗くなる 前に 帰る 時間。 おき手紙、 ちゃんと 英語で 書いてあるね'],['think','"See you tomorrow!" は 「また あした」。 リクくん、 {h}に また 来るよ']],
 hr_cgOpen:[['happy','カードショップ、 開店！ "We\'re open!" だね'],['smile','開店したよ。 お客さんは ミオに まかせて、 原石を みがこう']]});
setTimeout(function first(){try{if(!SHOP.rec().met)return}catch(e){return}const r=CG.rec();if(r.hrTold)return;const m=window.MINA;if(!m||!m.canAnnounce||!m.canAnnounce())return setTimeout(first,22000);
  r.hrTold=1;CG.save();const [ex,tx]=ML('hr_new');m.say('m',ex,tx,10000)},40000);

/* リクの 時間を いちどだけ 知らせる */
setTimeout(function firstR(){let T;try{T=TUTOR.rec()}catch(e){return}if(!T||!T.met||T.hrTold)return;const m=window.MINA;if(!m||!m.canAnnounce||!m.canAnnounce())return setTimeout(firstR,25000);
  T.hrTold=1;try{save()}catch(e){}const [ex,tx]=ML('hr_rikuNew');m.say('m',ex,tx,10000)},55000);
window.HOURS={isOpen,isPrep,hrs,untilOpen,T,closed,riku:window.RIKUH};
})();
