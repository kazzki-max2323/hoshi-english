/* ミナ先生の「授業タイム」: ときどき ミナ先生が「いまから 10分、授業を うけると いいことが あるよ」と アナウンスする。
   その間に ミニ授業を 1つ おえると ごほうび（コイン・浜辺の イベント・新しい曲・カード）。1日 3回まで。
   - アナウンスは ホームで ミナ先生が する。のこり時間は ホームと ミナ先生の ページに 出る
   - 時間ぎれ前に はじめた 授業は、おわるのが 少し おくれても OK
   - イベント・カードは その場で 見なくても、つぎに ホームへ もどったときに もらえる */
(()=>{
const {S:ST,sfx:SFX,scene:SC}=BEACH;
const H=HE,esc=H.esc,$=id=>document.getElementById(id);
const WIN=10*60000,GRACE=5*60000,MAX_DAY=3;
const FIRST=()=>(3+Math.random()*3)*60000,GAP=()=>(20+Math.random()*20)*60000;   // home time before the first call, and between calls
const today=()=>{const d=new Date();return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate()};
const pickL=a=>a[Math.random()*a.length|0];

/* ---------- the record: today's count, the open window, a prize not yet shown ---------- */
const BD=(()=>{try{const s=JSON.parse(localStorage.getItem(SAVE_KEY)||'{}').bonus;if(s&&s.d!=null)return s}catch(e){}return {d:'',n:0,until:0,r:null,inL:0,pend:null}})();
_saveHooks.push(()=>{const s=JSON.parse(localStorage.getItem(SAVE_KEY)||'{}');s.bonus=BD;localStorage.setItem(SAVE_KEY,JSON.stringify(s))});
const left=()=>Math.max(0,BD.until-Date.now()),active=()=>!!BD.r&&left()>0;
const mmss=ms=>{const s=Math.ceil(ms/1000);return (s/60|0)+':'+String(s%60).padStart(2,'0')};

/* ---------- what the prize is ---------- */
const bigEvents=()=>CATALOG.event.filter(e=>!e.rare&&e.p>=40&&H.onSale(e));
const newSongs=()=>CATALOG.music.filter(([id,,,,rare])=>!rare&&typeof TRACKS!=='undefined'&&TRACKS[id]&&!ST.music.includes(id));
function roll(){const pool=[['coin',3],['card',2.5]];if(bigEvents().length)pool.push(['event',2.5]);if(newSongs().length)pool.push(['music',2]);
  let x=Math.random()*pool.reduce((a,b)=>a+b[1],0),k='coin';for(const [n,w] of pool){x-=w;if(x<0){k=n;break}}
  if(k==='coin')return {k,amt:pickL([30,40,50,50,60,80])};
  if(k==='event'){const e=pickL(bigEvents());return {k,id:e.id}}
  if(k==='music')return {k};
  return {k:'card',min:Math.random()<.2?3:2}}
const evOf=id=>CATALOG.event.find(e=>e.id===id);
const RAR_N={2:'レア',3:'スーパーレア'};
/* a short label for the chip and the banner */
function label(r){if(r.k==='coin')return `🪙${r.amt}まい`;if(r.k==='event'){const e=evOf(r.id);return e?`${e.ico} ${e.n}`:'🎆 イベント'}
  if(r.k==='music')return '🎵 新しい 曲';return `🃏 ${RAR_N[r.min]}以上の カード`}

/* ---------- Mina's lines ---------- */
const CALL={
  coin:[['wow','📣 いまから 10分 「授業タイム」！ ミニ授業を 1つ うけると 🪙<b>{amt}まい</b> プレゼント！ わたしの 顔を タップしてね'],
        ['happy','📣 授業タイム はじまり！ 10分 いないに 授業を 1つ おえたら 🪙<b>{amt}まい</b> あげちゃう']],
  event:[['happy','📣 授業タイム！ 10分 いないに 授業を うけたら、浜辺で {ico} <b>{n}</b> を 見せてあげる'],
         ['wow','📣 いま 授業を うけると いいこと あるよ。 浜辺に {ico} <b>{n}</b> を よんであげる！']],
  music:[['proud','📣 授業タイム！ 10分 いないに 授業を 1つ おえたら、🎵 まだ もっていない <b>曲</b>を 1つ プレゼント。 いっしょに きこう'],
         ['happy','📣 いまから 10分、授業を うけると 🎵 <b>新しい 曲</b>が ながれるよ']],
  card:[['wow','📣 授業タイム！ いま 授業を うけると 🃏 <b>{rar}以上の カード</b>が 1まい もらえるよ'],
        ['happy','📣 10分 いないに 授業を 1つ！ ごほうびは 宝箱くじ… 🃏 <b>{rar}以上</b> かくてい！']]};
const fill=(t,v)=>t.replace(/\{(\w+)\}/g,(m,k)=>v[k]!=null?v[k]:m);
function callLine(r){const e=r.k==='event'?evOf(r.id):null,[ex,t]=pickL(CALL[r.k]);return [ex,fill(t,{amt:r.amt,ico:e&&e.ico,n:e&&esc(e.n),rar:RAR_N[r.min]})]}

/* ---------- open a window ---------- */
function start(r){if(BD.d!==today()){BD.d=today();BD.n=0}BD.n++;BD.r=r||roll();BD.until=Date.now()+WIN;BD.inL=0;BD.warned=0;save();
  const [ex,tx]=callLine(BD.r);MINA.say('m',ex,tx,11000);SFX.chime();chip()}
function expire(){BD.r=null;BD.until=0;BD.inL=0;save();chip()}

/* ---------- the countdown on the home screen and on Mina's pages ---------- */
function chip(){const old=$('bchip');if(!active()){if(old)old.remove();return}
  if(H.screen!=='home')return;const row=H.panel.querySelector('.mrow');if(!row)return;
  const c=old||document.createElement('button');c.id='bchip';c.className='bchip';
  c.innerHTML=`<span>⏰ 授業タイム <b class="bcount">${mmss(left())}</b></span><span>🎁 ${label(BD.r)}</span>`;
  c.onclick=()=>{SFX.vopen();MINA.open()};if(!old)row.after(c)}
function banner(){if(!active())return;const p=H.panel.querySelector('.minap,.lsnp');if(!p||p.querySelector('.bban'))return;
  const b=document.createElement('p');b.className='bban';b.innerHTML=`⏰ 授業タイム のこり <b class="bcount">${mmss(left())}</b><br>授業を 1つ おえると 🎁 <b>${label(BD.r)}</b>`;
  const top=p.querySelector('.qtop');top?top.after(b):p.prepend(b)}
/* the panel is redrawn often; watch it so the banner comes back, and notice a lesson begun in time */
new MutationObserver(()=>{if(!active())return;banner();if(H.panel.querySelector('.lsn')&&!BD.inL){BD.inL=BD.until;save()}}).observe(H.panel,{childList:true});
H.on('home',()=>{chip();givePend()});

/* ---------- the prize, at the end of a lesson ---------- */
function claim(){const ok=active()||(BD.r&&BD.inL&&Date.now()<BD.inL+GRACE);if(!ok)return null;
  const r=BD.r;BD.r=null;BD.until=0;BD.inL=0;let html='',after=()=>{};
  if(r.k==='coin'){html=`🪙 <b>${r.amt}まい</b> どうぞ！`;
    after=()=>{const b=H.panel.querySelector('.bwin');const rc=(b||H.panel).getBoundingClientRect();setTimeout(()=>H.coinBurst(rc.left+rc.width/2,rc.top+rc.height/2,r.amt),700)}}
  else if(r.k==='music'){const s=newSongs();if(s.length){const [id,,ico]=pickL(s);ST.music.push(id);
      html=`${ico} 新しい 曲 「<b>${esc(TRACKS[id].name)}</b>」 を プレゼント！<small>ショップの 🎵おんがく から いつでも ながせるよ</small>`;after=()=>setTimeout(()=>H.playTrack(id),900)}
    else{html='🪙 <b>50まい</b> どうぞ！';after=()=>setTimeout(()=>H.addCoins(50),700)}}
  else if(r.k==='event'){let e=evOf(r.id);if(!e||!H.onSale(e))e=pickL(bigEvents())||evOf('dolphins');BD.pend={k:'event',id:e.id};
    html=`${e.ico} 浜辺で <b>${esc(e.n)}</b> を 見せてあげる！<button id="bgo" class="bgo">🏖️ 見にいく</button>`;after=()=>{$('bgo').onclick=()=>{SFX.chime();H.home()}}}
  else{BD.pend={k:'card',min:r.min};html=`🃏 <b>${RAR_N[r.min]}以上の カード</b>が 1まい！<button id="bgo" class="bgo">🎁 宝箱を あける</button>`;
    after=()=>{$('bgo').onclick=()=>givePend()}}
  save();setTimeout(()=>{SFX.fanfare(2)},500);
  return {html:`<div class="bwin"><b class="bt">🎁 授業タイムの ごほうび</b><p>${html}</p></div>`,after}}

/* the event plays on the beach when the player comes home; the card chest opens where they are */
function givePend(){const p=BD.pend;if(!p)return;
  if(p.k==='card'){if(!window.CARDS||!CARDS.gift)return;BD.pend=null;save();CARDS.gift(1,p.min);return}
  if(p.k==='event'&&H.screen==='home'){BD.pend=null;save();const e=evOf(p.id);if(!e)return;H.radioWake&&H.radioWake();
    setTimeout(()=>{H.toast(`${e.ico} <b>${esc(e.n)}</b><small>ミナ先生からの ごほうび</small>`,2600);try{e.k==='show'?SC.show(e.id,e.sec):SC.play(e.id)}catch(x){}
      if(MINA.canTalk())MINA.say('m','happy',`${e.ico} ${esc(e.n)}、 授業 がんばった ごほうびだよ。 いっしょに 見よう`,7000)},700)}}

/* ---------- when to call ---------- */
let homeT=0,nextAt=FIRST(),lastT=performance.now();
setInterval(()=>{const now=performance.now(),dt=now-lastT;lastT=now;if(document.hidden)return;
  document.querySelectorAll('.bcount').forEach(el=>el.textContent=mmss(left()));
  if(BD.r&&!active()&&!(BD.inL&&Date.now()<BD.inL+GRACE)){expire();return}
  if(active()){if(left()<2*60000&&!BD.warned&&MINA.canTalk()){BD.warned=1;save();MINA.say('m','worry',`⏰ 授業タイム、 あと 2分だよ！ ごほうびは ${label(BD.r)}。 わたしの 顔を タップしてね`,9000)}return}
  if(H.screen==='home')homeT+=dt;
  if(homeT<nextAt)return;if(BD.d===today()&&BD.n>=MAX_DAY)return;if(!MINA.canTalk())return;
  homeT=0;nextAt=GAP();start()},1000);
chip();

window.BONUS={claim,active,_test:{start:k=>{const r=roll();if(k==='coin')Object.assign(r,{k,amt:50});else if(k==='event')Object.assign(r,{k,id:(bigEvents()[0]||evOf('dolphins')).id});else if(k)Object.assign(r,{k,min:2});BD.n=0;start(r)},
  end:()=>{BD.until=Date.now()+1000},soon:()=>{homeT=nextAt}}};
})();
