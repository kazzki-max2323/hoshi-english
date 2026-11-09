/* ミナ先生の「授業タイム」: ときどき ミナ先生が「いまから 10分、授業を うけると いいことが あるよ」と アナウンスする。
   その間に ミニ授業を 1つ おえると ごほうび（コイン・浜辺の イベント・新しい曲・カード）。1日 3回まで。
   - アナウンスは ホームで ミナ先生が する。のこり時間は ホームと ミナ先生の ページに 出る
   - 時間ぎれ前に はじめた 授業は、おわるのが 少し おくれても OK
   - イベント・カードは その場で 見なくても、つぎに ホームへ もどったときに もらえる（game/motivate.js の MOTI.pendShow / pendCard）
   - ラジオが しゃべっていても アナウンスする（ラジオ中は 浜辺の上にも 吹き出しが 出る） */
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
  const [ex,tx]=callLine(BD.r);MINA.announce(ex,tx,11000);SFX.hey();chip();window.LESSON&&LESSON.refresh()}
function expire(){BD.r=null;BD.until=0;BD.inL=0;save();chip();window.LESSON&&LESSON.refresh()}

/* ---------- the countdown on the home screen and on Mina's pages ---------- */
/* a pop badge over the beach, on every screen, while the window is open: tap = Mina's page (her lessons are there) */
function chip(){const old=$('bbadge');if(!active()){if(old)old.remove();return}
  const hurry=left()<2*60000,ico=BD.r.k==='coin'?'🪙':BD.r.k==='event'?((evOf(BD.r.id)||{}).ico||'🎆'):BD.r.k==='music'?'🎵':'🃏';
  let c=old;if(!c){c=document.createElement('button');c.id='bbadge';c.setAttribute('aria-label','授業タイム。ミナ先生の ページを ひらく');
    c.onclick=e=>{e.stopPropagation();SFX.talk();MINA.open()};document.body.appendChild(c)}
  const key=BD.r.k+(BD.r.id||'')+(BD.r.amt||'')+(BD.r.min||'');
  if(c.dataset.k!==key){c.dataset.k=key;
    c.innerHTML=`<span class="bbg">🎁</span><span class="bbm">${ico}</span><span class="bbt"><b>授業タイム！</b><small>授業を 1つ おえると</small></span><span class="bbr"><i>${ico}</i><small>${BD.r.k==='coin'?BD.r.amt+'まい':BD.r.k==='event'?esc((evOf(BD.r.id)||{n:'イベント'}).n):BD.r.k==='music'?'新しい 曲':RAR_N[BD.r.min]+'以上の カード'}</small></span><span class="bbc">⏰<b class="bcount">${mmss(left())}</b></span><i class="bbs s1">✦</i><i class="bbs s2">✧</i><i class="bbs s3">✦</i>`}
  /* it lives in the header, between the clock and the coins, so it never covers the radios' bubbles over the beach.
     The wider that gap, the more it shows: full / mid (🎁 授業タイム 🎵 9:46) / mini (🎁 9:46) */
  const ck=$('clock'),cn=document.querySelector('.coin');let size='mini';
  if(ck&&cn){const a=ck.getBoundingClientRect(),b=cn.getBoundingClientRect(),gap=b.left-a.right-16;size=gap>=360?'full':gap>=200?'mid':'mini';
    c.style.left=(a.right+b.left)/2+'px';c.style.top=(a.top+a.height/2)+'px'}
  c.className='bbadge '+size+(hurry?' hurry':'')}
function banner(){if(!active())return;const p=H.panel.querySelector('.minap,.lsnp');if(!p||p.querySelector('.bban'))return;
  const b=document.createElement('p');b.className='bban';b.innerHTML=`⏰ 授業タイム のこり <b class="bcount">${mmss(left())}</b><br>授業を 1つ おえると 🎁 <b>${label(BD.r)}</b>`;
  const top=p.querySelector('.qtop');top?top.after(b):p.prepend(b)}
/* the panel is redrawn often; watch it so the banner comes back, and notice a lesson begun in time */
new MutationObserver(()=>{if(!active())return;banner();if(H.panel.querySelector('.lsn')&&!BD.inL){BD.inL=BD.until;save()}}).observe(H.panel,{childList:true});
H.on('home',()=>chip());
/* a prize saved by the older version of this file */
setTimeout(()=>{const p=BD.pend;if(!p||!window.MOTI)return;BD.pend=null;save();p.k==='card'?MOTI.pendCard(p.min):MOTI.pendShow(p.id)},0);

/* ---------- the prize, at the end of a lesson (one line in the lesson's prize box) ---------- */
function claim(){const ok=active()||(BD.r&&BD.inL&&Date.now()<BD.inL+GRACE);if(!ok)return null;
  const r=BD.r;BD.r=null;BD.until=0;BD.inL=0;let html='',after=()=>{};const M=window.MOTI;
  if(r.k==='coin'){html=`⏰ 授業タイム： 🪙 <b>${r.amt}まい</b>`;M?M.coins(r.amt):after=()=>setTimeout(()=>H.addCoins(r.amt),700)}
  else if(r.k==='music'){const s=newSongs();if(s.length){const [id,,ico]=pickL(s);ST.music.push(id);
      html=`⏰ 授業タイム： ${ico} 新しい 曲 「<b>${esc(TRACKS[id].name)}</b>」<small>ショップの 🎵おんがく から いつでも ながせるよ</small>`;after=()=>setTimeout(()=>H.playTrack(id),900)}
    else{html='⏰ 授業タイム： 🪙 <b>50まい</b>';M?M.coins(50):after=()=>setTimeout(()=>H.addCoins(50),700)}}
  else if(r.k==='event'){let e=evOf(r.id);if(!e||!H.onSale(e))e=pickL(bigEvents())||evOf('dolphins');M&&M.pendShow(e.id);
    html=`⏰ 授業タイム： 浜辺で ${e.ico} <b>${esc(e.n)}</b>`}
  else{M&&M.pendCard(r.min);html=`⏰ 授業タイム： 🃏 <b>${RAR_N[r.min]}以上の カード</b>`}
  M&&M.gain(2);save();setTimeout(()=>{SFX.fanfare(2)},500);
  return {html,after}}
LESSON_AFTER.push(l=>claim(l));

/* ---------- when to call ---------- */
let homeT=0,nextAt=FIRST(),lastT=performance.now();
setInterval(()=>{const now=performance.now(),dt=now-lastT;lastT=now;if(document.hidden)return;
  document.querySelectorAll('.bcount').forEach(el=>el.textContent=mmss(left()));chip();
  if(BD.r&&!active()&&!(BD.inL&&Date.now()<BD.inL+GRACE)){expire();return}
  if(active()){if(left()<2*60000&&!BD.warned&&MINA.canAnnounce()){BD.warned=1;save();MINA.announce('worry',`⏰ 授業タイム、 あと 2分だよ！ ごほうびは ${label(BD.r)}。 わたしの 顔を タップしてね`,9000)}return}
  if(H.screen==='home')homeT+=dt;
  if(homeT<nextAt)return;if(BD.d===today()&&BD.n>=MAX_DAY)return;if(!MINA.canAnnounce()||MINA.sinceAnn()<60000)return;
  homeT=0;nextAt=GAP();start()},1000);
chip();

window.BONUS={claim,active,now:()=>active()?{label:label(BD.r),left:mmss(left())}:null,_test:{start:k=>{const r=roll();if(k==='coin')Object.assign(r,{k,amt:50});else if(k==='event')Object.assign(r,{k,id:(bigEvents()[0]||evOf('dolphins')).id});else if(k)Object.assign(r,{k,min:2});BD.n=0;start(r)},
  end:()=>{BD.until=Date.now()+1000},soon:()=>{homeT=nextAt}}};
})();
