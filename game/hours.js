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

function mina(k,v,p){try{if(window.MINA&&MINA.canAnnounce&&MINA.canAnnounce()&&Math.random()<p){const [ex,tx]=ML(k,v);if(tx)setTimeout(()=>MINA.say('m',ex,tx,6000),1400)}}catch(e){}}
Object.assign(MINA_LINES,{
 hr_new:[['point','お店に 開店と 閉店の 時間が できたよ。 カードショップは 9時から 21時、 雑貨店は 10時から、 食堂は 朝 6時から 夜 11時まで'],['smile','お店の 時間は 浜辺の 時計で 見てね。 閉店後も カードショップの 原石の 作業台は つかえるよ']],
 hr_zakkaClosed:[['smile','雑貨店は もう 閉まってるね。 {h}だよ。 英語で 閉店は "We\'re closed."'],['think','"Closed" は 「しまっている」。 "Open" の 反対だね']],
 hr_foodClosed:[['smile','食堂は おやすみ。 {h}だよ。 おなかが すいたら 🎒もちものの 食べ物も あるよ'],['think','"See you tomorrow!" って 言って 帰ろうか']],
 hr_cgClosed:[['smile','カードショップは 閉店中。 でも 原石の 作業台は いつでも つかえるよ'],['happy','お客さんが 来ない 夜は、 原石みがきに 集中できるね']],
 hr_cgOpen:[['happy','カードショップ、 開店！ "We\'re open!" だね'],['smile','開店したよ。 お客さんは ミオに まかせて、 原石を みがこう']]});
setTimeout(function first(){try{if(!SHOP.rec().met)return}catch(e){return}const r=CG.rec();if(r.hrTold)return;const m=window.MINA;if(!m||!m.canAnnounce||!m.canAnnounce())return setTimeout(first,22000);
  r.hrTold=1;CG.save();const [ex,tx]=ML('hr_new');m.say('m',ex,tx,10000)},40000);

window.HOURS={isOpen,isPrep,hrs,untilOpen,T,closed};
})();
