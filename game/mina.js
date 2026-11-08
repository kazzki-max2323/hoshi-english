/* ミナ先生（家庭教師のお姉さん）と、ときどき来る ハマ子おばちゃん。
   - ゲームの中の答えを こっそり記録して、まちがえた単語・苦手な単語帳・文法を 見つける
   - ホームの枠の すみに ミナ先生の顔（表情が かわる）。タップで いつでも 話せる
   - アプリを ひらいた時と 数分に1回、ひとこと。たまに ハマ子おばちゃんが 来て 掛け合い
   - ラジオに ときどき 苦手な単語を まぜる（復習）
   セリフは game/mina-lines.js（MINA_LINES / HAMA_TALKS）。声は なし */
(()=>{
const {S:ST,sfx:SFX}=BEACH;
const H=HE,esc=H.esc,$=id=>document.getElementById(id);
const pickL=a=>a[Math.random()*a.length|0];
const today=()=>{const d=new Date();return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate()};

/* ---------- the record ---------- */
const MD=(()=>{try{const s=JSON.parse(localStorage.getItem(SAVE_KEY)||'{}').mina;if(s&&s.w)return s}catch(e){}
  return {w:{},g:{},d:{},r:{},best:0,last:0,hama:{d:'',n:0},said:{}}})();
MD.r=MD.r||{};MD.said=MD.said||{};MD.hama=MD.hama||{d:'',n:0};
_saveHooks.push(()=>{const s=JSON.parse(localStorage.getItem(SAVE_KEY)||'{}');s.mina=MD;localStorage.setItem(SAVE_KEY,JSON.stringify(s))});
const day=()=>{const k=today();return MD.d[k]=MD.d[k]||{a:0,o:0,l:0}};
let streak=0;
/* keep the record small: forget the oldest words beyond 1500, and days older than 30 */
function prune(){const ks=Object.keys(MD.w);if(ks.length>1500)ks.sort((a,b)=>MD.w[a].t-MD.w[b].t).slice(0,ks.length-1500).forEach(k=>delete MD.w[k]);
  const ds=Object.keys(MD.d);if(ds.length>30)ds.slice(0,ds.length-30).forEach(k=>delete MD.d[k])}

H.on('answer',(c,ok,ms)=>{const k=c.lv+'|'+c.en,e=MD.w[k]=MD.w[k]||{s:0,m:0,k:0,t:0,j:c.ja,kind:c.kind};
  e.s++;e.t=Date.now();e.j=c.ja;e.kind=c.kind;if(ok){e.k++;if(ms>9000)e.slow=(e.slow||0)+1}else{e.m++;e.k=0}
  const D=day();D.a++;if(ok)D.o++;const R=MD.r[c.lv]=MD.r[c.lv]||[];R.push(ok?1:0);if(R.length>40)R.shift();
  streak=ok?streak+1:0;if(streak>MD.best)MD.best=streak;prune();save();
  if(ok&&[5,10,20,30].includes(streak))queue('streak',{n:streak},'happy');
  if(!ok&&e.m===3)queue('weakWord',{w:c.en,ja:c.ja,n:e.m},'think')});
H.on('gram',(lv,i,n,ok)=>{const e=MD.g[n.id]=MD.g[n.id]||{s:0,m:0,t:0,lv,i,title:n.t};e.s++;e.t=Date.now();if(!ok){e.m++;gramMissNow={g:n.t}}save()});
let gramMissNow=null;
H.on('learned',()=>{const D=day();D.l++;save();if([10,20,50,100].includes(D.l))queue('learned',{n:D.l},'proud')});

/* ---------- what is weak ---------- */
/* a word is weak when it was missed and has not been answered right twice in a row since */
const weakWords=(lv,kind='w')=>Object.entries(MD.w).filter(([k,e])=>e.m>0&&e.k<2&&(!kind||e.kind===kind)&&(!lv||k.startsWith(lv+'|')))
  .sort((a,b)=>(b[1].m-b[1].k)-(a[1].m-a[1].k)||b[1].t-a[1].t).map(([k,e])=>({lv:k.split('|')[0],en:k.split('|').slice(1).join('|'),ja:e.j,m:e.m,s:e.s}));
let bookOf=null;
function weakBook(){if(!bookOf){bookOf={};H.LV_ORDER.forEach(lv=>LEVELS[lv].books.forEach(b=>b.w.forEach(w=>bookOf[lv+'|'+w[0]]=[lv,b.t])))}
  const cnt={};weakWords().forEach(w=>{const b=bookOf[w.lv+'|'+w.en];if(b){const k=b.join('|');cnt[k]=(cnt[k]||0)+1}});
  const top=Object.entries(cnt).sort((a,b)=>b[1]-a[1])[0];return top&&top[1]>=3?{lv:top[0].split('|')[0],book:top[0].split('|')[1],n:top[1]}:null}
function weakGram(){const g=Object.values(MD.g).filter(e=>e.m>0&&Date.now()-e.t<7*864e5).sort((a,b)=>b.m-a.m)[0];return g||null}
/* sentences going badly at a level: point to the first grammar note there not cleared yet */
function gramForSentences(){for(const lv of ['es','jh','hs']){const ws=Object.entries(MD.w).filter(([k,e])=>k.startsWith(lv+'|')&&e.kind==='s');
    const s=ws.reduce((a,[,e])=>a+e.s,0),m=ws.reduce((a,[,e])=>a+e.m,0);if(s>=8&&m/s>.4&&window.GRAMMAR&&GRAMMAR[lv]){
      const i=GRAMMAR[lv].notes.findIndex(n=>!(ST.gram.cleared||[]).includes(n.id));if(i>=0)return {lv,i,title:GRAMMAR[lv].notes[i].t}}}return null}
const LVN={es:'小学生',jh:'中学生',hs:'高校生',adv:'ハイレベル'};
function stepUp(){for(const lv of ['es','jh','hs']){const R=MD.r[lv]||[];if(R.length>=30){const acc=Math.round(R.reduce((a,b)=>a+b,0)/R.length*100);
    const nx=H.LV_ORDER[H.LV_ORDER.indexOf(lv)+1];if(acc>=85&&nx&&!(MD.r[nx]&&MD.r[nx].length>=10))return {lv:LVN[lv],next:LVN[nx],acc,nlv:nx}}}return null}
function recentAcc(){const all=Object.values(MD.r).flat();if(all.length<15)return null;const r=all.slice(-20);return Math.round(r.reduce((a,b)=>a+b,0)/r.length*100)}

/* the player's level now: the highest level answered right 60% or more (at least 10 answers), else the radios they own */
function level(){let best=null,low=null;for(const lv of H.LV_ORDER){const R=MD.r[lv]||[];if(R.length<10)continue;const a=R.reduce((x,y)=>x+y,0)/R.length;
    if(!low)low=lv;if(a>=.6)best=lv}
  if(best||low)return best||low;const own=H.LV_ORDER.filter(lv=>ST.radios.some(r=>r.lv===lv));return own[own.length-1]||'es'}
/* words to match lessons against: weak grammar notes and weak words */
function weakKeys(){const k=[];const g=weakGram();if(g)k.push(g.title);const s=gramForSentences();if(s)k.push(s.title);weakWords().slice(0,5).forEach(w=>k.push(w.en));return k}

/* ---------- lines ---------- */
const fill=(t,v={})=>t.replace(/\{(\w+)\}/g,(m,k)=>v[k]!=null?esc(String(v[k])):m);
MINA_LINES.lesson=MINA_LINES.lesson||[['smile','ミニ授業 {t} が おすすめだよ。 わたしの 顔を タップしてね'],['happy','きょうは {t} を いっしょに やってみない？'],['think','{t} を 知ると、 もっと 分かるように なるよ'],['proud','{t}、 2分で できるよ。 コインも もらえるからね']];
const line=(key,v)=>{const L=MINA_LINES[key]||MINA_LINES.tap;const l=pickL(L);return [l[0],fill(l[1],v)]};
/* the most useful thing to say now, or a plain line */
function advice(){const ww=weakWords(),opts=[];
  if(ww.length)opts.push(['weakWord',{w:ww[0].en,ja:ww[0].ja,n:ww[0].m}]);
  const wb=weakBook();if(wb)opts.push(['weakBook',{book:'「'+wb.book+'」'}]);
  const wg=weakGram()||gramForSentences();if(wg)opts.push(['grammar',{g:'「'+(wg.title)+'」'},wg]);
  const su=stepUp();if(su&&MD.said.step!==today())opts.push(['stepUp',su]);
  const ra=recentAcc();if(ra!=null&&ra<55)opts.push(['slowDown',{}]);
  if(ww.length>=3)opts.push(['review',{n:Math.min(ww.length,10)}]);
  if(window.LESSON){const l=LESSON.suggest(1)[0];if(l)opts.push(['lesson',{t:'「'+l.t+'」'}])}
  return opts}

/* ---------- face ---------- */
function face(who,ex){const m=who==='m';
  const eyes={smile:'<circle cx="27" cy="35" r="1.9"/><circle cx="37" cy="35" r="1.9"/>',
    happy:'<path d="M24.5 35.5q2.5-3 5 0M34.5 35.5q2.5-3 5 0" stroke="#2a2340" stroke-width="1.7" fill="none" stroke-linecap="round"/>',
    wow:'<circle cx="27" cy="35" r="2.6"/><circle cx="37" cy="35" r="2.6"/><circle cx="27.8" cy="34.2" r=".8" fill="#fff"/><circle cx="37.8" cy="34.2" r=".8" fill="#fff"/>',
    think:'<circle cx="28" cy="34.5" r="1.8"/><circle cx="38" cy="34.5" r="1.8"/><path d="M24 30.5l5-1M35 29.5l5 1" stroke="#2a2340" stroke-width="1.2"/>',
    proud:'<path d="M24.5 34.5q2.5 2.5 5 0M34.5 34.5q2.5 2.5 5 0" stroke="#2a2340" stroke-width="1.7" fill="none" stroke-linecap="round"/>',
    worry:'<circle cx="27" cy="35.5" r="1.8"/><circle cx="37" cy="35.5" r="1.8"/><path d="M24 31l5 1.4M40 31l-5 1.4" stroke="#2a2340" stroke-width="1.2"/>'}[ex]||'';
  const mouth={smile:'<path d="M28 41q4 3 8 0" stroke="#d0606a" stroke-width="1.7" fill="none" stroke-linecap="round"/>',
    happy:'<path d="M27.5 40q4.5 6 9 0z" fill="#c2304f"/>',wow:'<ellipse cx="32" cy="42" rx="2.4" ry="3" fill="#c2304f"/>',
    think:'<path d="M29 42h5" stroke="#d0606a" stroke-width="1.7" stroke-linecap="round"/>',proud:'<path d="M28 41q5 3 9-1" stroke="#d0606a" stroke-width="1.8" fill="none" stroke-linecap="round"/>',
    worry:'<path d="M28.5 42.5q3.5-2.5 7 0" stroke="#d0606a" stroke-width="1.7" fill="none" stroke-linecap="round"/>'}[ex]||'';
  const extra=ex==='proud'?'<path d="M48 18l1.5 3 3 1.5-3 1.5-1.5 3-1.5-3-3-1.5 3-1.5z" fill="#ffd23f"/>':ex==='worry'?'<path d="M45 27q2 4 0 6q-2-2 0-6z" fill="#8fd3ff"/>':ex==='wow'?'<path d="M50 14v6M53 17h-6" stroke="#ffd23f" stroke-width="1.6"/>':'';
  const hair=m?'<path d="M14 40c0-16 8-26 18-26s18 10 18 26c0 6-3 14-4 18H18c-1-4-4-12-4-18z" fill="#4a2c22"/>':'<g fill="#6b4a8a"><circle cx="20" cy="24" r="7"/><circle cx="28" cy="18" r="7"/><circle cx="37" cy="18" r="7"/><circle cx="45" cy="24" r="7"/><circle cx="17" cy="33" r="6"/><circle cx="47" cy="33" r="6"/></g>';
  const bangs=m?'<path d="M19 32c2-9 8-13 13-13s11 4 13 13c-6-6-20-6-26 0z" fill="#4a2c22"/>':'';
  const glasses=m?'':'<circle cx="27" cy="35" r="4.6" fill="none" stroke="#ff4f8b" stroke-width="1.5"/><circle cx="37" cy="35" r="4.6" fill="none" stroke="#ff4f8b" stroke-width="1.5"/><path d="M31.6 35h.8" stroke="#ff4f8b" stroke-width="1.5"/>';
  const body=m?'<path d="M20 60c2-7 7-10 12-10s10 3 12 10z" fill="#7ad3c4"/>':'<path d="M18 60c2-7 7-10 14-10s12 3 14 10z" fill="#e8b04a"/><g fill="#5a3a12"><circle cx="24" cy="56" r="1.5"/><circle cx="31" cy="54" r="1.3"/><circle cx="38" cy="57" r="1.5"/></g>';
  return `<svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="31" fill="${m?'#1f2a5c':'#3a1f2a'}"/>${hair}<circle cx="32" cy="35" r="13" fill="${m?'#ffd9c0':'#ffd2b0'}"/>${bangs}<g class="eyes" fill="#2a2340">${eyes}</g>${glasses}${mouth}<circle cx="24" cy="39.5" r="2.2" fill="#ffb3b3" opacity=".55"/><circle cx="40" cy="39.5" r="2.2" fill="#ffb3b3" opacity=".55"/>${body}${extra}</svg>`}
let minaEx='smile';
function setFace(ex){minaEx=ex||'smile';const f=$('minaFace');if(f)f.innerHTML=face('m',minaEx)}

/* ---------- speaking in the home row ---------- */
let speakUntil=0,talkOn=false,hideT=0;
const busy=()=>talkOn||performance.now()<speakUntil;
function sayRow(who,ex,text,ms=6500){const b=$('minaSay'),rq=$('rq');if(!b)return false;
  b.hidden=false;if(rq)rq.hidden=true;b.className='msay '+(who==='m'?'by-m':'by-h');
  b.innerHTML=`<b>${who==='m'?'ミナ先生':'ハマ子'}</b>${text}`;b.classList.remove('mnew');void b.offsetWidth;b.classList.add('mnew');
  if(who==='m')setFace(ex);else{const h=$('hamaFace');if(h)h.innerHTML=face('h',ex)}
  SFX.pop();speakUntil=performance.now()+ms;clearTimeout(hideT);hideT=setTimeout(()=>{if(talkOn)return;b.hidden=true;if(rq)rq.hidden=false;setFace('smile');H.rest(2500)},ms);return true}
/* lines waiting for a good moment (praise after a streak, etc.) */
const Q=[];function queue(key,v,ex){Q.push([key,v,ex]);if(Q.length>3)Q.shift()}
const canTalk=()=>H.screen==='home'&&!document.hidden&&!busy()&&!H.stage.talking&&!H.stage.cheer&&$('minaSay');

/* ---------- Hamako comes by ---------- */
function hamaPick(){const ww=weakWords(),ra=recentAcc(),ph=(()=>{try{return BEACH.scene.dbg().dark>.6?'night':'day'}catch(e){return 'day'}})(),h=new Date().getHours();
  const by=w=>HAMA_TALKS.filter(t=>t.when===w);let pool=by('any');
  const r=Math.random();if(r<.3)pool=by('candy');else if(r<.5&&ww.length)pool=by('weak');else if(r<.65&&ra!=null&&ra>=75)pool=by('good');
  else if(r<.75&&ph==='night')pool=by('night');else if(r<.75&&h>=5&&h<11)pool=by('morning');
  if(!pool.length)pool=by('any');return pickL(pool)}
function hamaVisit(){const t=hamaPick();if(!t)return;const ww=weakWords()[0]||{},ra=recentAcc(),c=3+(Math.random()*6|0);
  const v={w:ww.en,ja:ww.ja,n:streak||day().o,acc:ra||80,c};
  const hf=$('hamaFace');if(!hf)return;hf.innerHTML=face('h','happy');hf.hidden=false;hf.classList.add('in');talkOn=true;
  MD.hama={d:today(),n:(MD.hama.d===today()?MD.hama.n:0)+1};save();
  let i=0;const next=()=>{if(H.screen!=='home'||!$('minaSay')){end();return}
    if(i>=t.lines.length){end();return}const [who,ex,tx]=t.lines[i++];sayRow(who,ex,fill(tx,v),9000);
    if(tx.includes('{c}')){const r=hf.getBoundingClientRect();setTimeout(()=>H.coinBurst(r.left+r.width/2,r.top+r.height/2,c),500)}
    setTimeout(next,Math.max(2600,tx.length*95))};
  const end=()=>{talkOn=false;hf.classList.remove('in');setTimeout(()=>{hf.hidden=true},400);const b=$('minaSay'),rq=$('rq');speakUntil=0;
    if(b){b.hidden=true;if(rq)rq.hidden=false}setFace('smile');H.rest(3000)};
  setTimeout(next,600)}

/* ---------- when to talk ---------- */
let opened=false,talkAt=0,talkGap=(3+Math.random()*2)*60000,hamaAt=0,hamaGap=(12+Math.random()*10)*60000,lastT=performance.now();
function hello(){const gap=MD.last?Math.floor((Date.now()-MD.last)/864e5):0;MD.last=Date.now();save();
  const h=new Date().getHours(),opts=advice();
  if(gap>=3)return line('openBack',{days:gap});
  if(opts.length&&Math.random()<.5){const o=pickL(opts);if(o[0]==='stepUp')MD.said.step=today();return line(o[0],o[1])}
  return line(h>=5&&h<11?pickL(['morning','open']):h>=19||h<4?pickL(['night','open']):'open')}
setInterval(()=>{const now=performance.now(),dt=now-lastT;lastT=now;if(document.hidden)return;
  if(H.screen==='home'){talkAt+=dt;hamaAt+=dt}
  if(!canTalk())return;
  if(!opened){opened=true;const [ex,tx]=hello();sayRow('m',ex,tx,8000);return}
  if(gramMissNow){const g=gramMissNow;gramMissNow=null;const [ex,tx]=line('gramMiss',{g:'「'+g.g+'」'});sayRow('m',ex,tx);return}
  if(Q.length){const [k,v,ex]=Q.shift();const [e2,tx]=line(k,v);sayRow('m',ex||e2,tx);return}
  const hamaOk=MD.hama.d!==today()||MD.hama.n<2;
  if(hamaAt>=hamaGap&&hamaOk){hamaAt=0;hamaGap=(15+Math.random()*15)*60000;hamaVisit();return}
  if(talkAt>=talkGap){talkAt=0;talkGap=(3+Math.random()*2)*60000;const opts=advice();let l;
    if(opts.length&&Math.random()<.45){const o=pickL(opts);if(o[0]==='stepUp')MD.said.step=today();l=line(o[0],o[1])}
    else l=line(Math.random()<.15?pickL(['cards','coins']):'idle');sayRow('m',l[0],l[1])}},1500);

/* ---------- Mina's page: tap her face ---------- */
function panelOpen(){const ww=weakWords(null,null).slice(0,12),D=day(),opts=advice(),ra=recentAcc(),wg=weakGram()||gramForSentences(),su=stepUp();
  const first=opts.length?opts[0]:null,[ex,tx]=first?line(first[0],first[1]):line('tap');
  const accToday=D.a?Math.round(D.o/D.a*100):null;
  H.show('mina',`<section class="pnl minap">
    <div class="qtop"><button class="x" id="mx" aria-label="もどる">←</button><b>👩‍🏫 ミナ先生</b><span></span></div>
    <div class="mtalk"><span class="mbig">${face('m',ex)}</span><p class="mline">${tx}</p></div>
    <div class="mstats"><div><b>${D.a}</b><small>きょう 答えた</small></div><div><b>${accToday==null?'-':accToday+'%'}</b><small>きょうの 正解率</small></div><div><b>${D.l}</b><small>きょう おぼえた</small></div><div><b>${MD.best}</b><small>さいこう れんぞく</small></div></div>
    ${su?`<p class="msug">⬆️ ${esc(su.lv)}の 正解率 ${su.acc}%。<b>${esc(su.next)}</b>に ちょうせん してみよう</p>`:''}
    ${wg?`<button id="mgram" class="msug btn">📚 文法ノート「${esc(wg.title)}」を 見る</button>`:''}
    ${window.LESSON?`<div class="mhead"><b>📖 ミナの ミニ授業</b><small>いまの 力：${LVN[level()]}くらい ・ ✅ ${LESSON.count().join('/')}</small></div>
    <div class="lslist">${LESSON.suggest(3).map(LESSON.row).join('')}</div>
    <button id="mall" class="sub">📖 ぜんぶの 授業を 見る</button>`:''}
    <div class="mhead"><b>🔁 苦手な ことば</b><small>${ww.length?'ラジオで ときどき 出すね。2回 つづけて 正解で 卒業':'まだ ないよ'}</small></div>
    <div class="mweak">${ww.map(w=>`<button data-say="${esc(w.en)}" data-lv="${w.lv}"><span class="en">${esc(w.en)}</span><span class="ja">${esc(w.ja||'')}</span><span class="mm">✗${w.m}</span></button>`).join('')||'<p class="note">ラジオで あそぶと、まちがえた ことばが ここに たまるよ</p>'}</div>
  </section>`);
  setTimeout(()=>{const b=H.panel.querySelector('.mbig');if(b)b.classList.add('mnew')},10);
  $('mx').onclick=()=>{SFX.pop();const [e2,t2]=line('bye');H.home();setTimeout(()=>sayRow('m',e2,t2,4000),150)};
  H.panel.querySelectorAll('[data-say]').forEach(b=>b.onclick=()=>H.say(b.dataset.lv,b.dataset.say));
  if(window.LESSON){LESSON.bindRows(panelOpen);$('mall').onclick=()=>{SFX.vopen();LESSON.list()}}
  const gb=$('mgram');if(gb)gb.onclick=()=>{SFX.vopen();const owned=(ST.gram.owned||[]).includes(GRAMMAR[wg.lv].notes[wg.i].id);owned?H.gramNote(wg.lv,wg.i):H.gramShop(wg.lv)}}
/* the face lives in the home row; tap = talk */
H.on('home',()=>{setFace(minaEx);const f=$('minaFace');if(f)f.onclick=()=>{SFX.vopen();panelOpen()};
  if(talkOn){const hf=$('hamaFace');if(hf){hf.hidden=false;hf.innerHTML=face('h','smile')}}});
setFace('smile');const f0=$('minaFace');if(f0)f0.onclick=()=>{SFX.vopen();panelOpen()};

/* ---------- review words for the radio ---------- */
function reviewPick(lv){if(Math.random()>.25)return null;const ww=weakWords(lv,'w');return ww.length?pickL(ww.slice(0,8)).en:null}

window.MINA={busy,say:sayRow,canTalk,reviewPick,open:panelOpen,face,weakWords,hamaVisit,level,weakKeys,rec:()=>MD,pick:pickL,
  _test:{say:()=>{talkAt=talkGap},hama:()=>{hamaAt=hamaGap;MD.hama={d:'',n:0}},hello:()=>{opened=false}}};
})();
