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
/* a radio line that went by unanswered: n = times unanswered. Weak like a miss, but not counted in the right/wrong record */
H.on('skip',c=>{const k=c.lv+'|'+c.en,e=MD.w[k]=MD.w[k]||{s:0,m:0,k:0,t:0,j:c.ja,kind:c.kind};
  e.n=(e.n||0)+1;e.k=0;e.t=Date.now();e.j=c.ja;e.kind=c.kind;prune();save()});
/* grammar: mt = last miss, rv = last time the note was opened, k = right in a row since the last miss */
H.on('gram',(lv,i,n,ok)=>{const e=MD.g[n.id]=MD.g[n.id]||{s:0,m:0,t:0,lv,i,title:n.t};e.s++;e.t=Date.now();
  if(ok)e.k=(e.k||0)+1;else{e.m++;e.k=0;e.mt=e.t;gramMissNow={g:n.t,id:n.id}}save()});
H.on('gramView',(lv,i,n)=>{const e=MD.g[n.id];if(e&&e.m>0)e.rv=Date.now();MD.gv=MD.gv||{};MD.gv[n.id]=Date.now();save()});
let gramMissNow=null;
H.on('learned',()=>{const D=day();D.l++;save();if([10,20,50,100].includes(D.l))queue('learned',{n:D.l},'proud')});

/* ---------- what is weak ---------- */
/* a word is weak when it was missed or left unanswered, and has not been answered right twice in a row since */
const miss=e=>e.m+(e.n||0);
const weakWords=(lv,kind='w')=>Object.entries(MD.w).filter(([k,e])=>miss(e)>0&&e.k<2&&(!kind||e.kind===kind)&&(!lv||k.startsWith(lv+'|')))
  .sort((a,b)=>(miss(b[1])-b[1].k)-(miss(a[1])-a[1].k)||b[1].t-a[1].t).map(([k,e])=>({lv:k.split('|')[0],en:k.split('|').slice(1).join('|'),ja:e.j,m:e.m,n:e.n||0,s:e.s}));
let bookOf=null;
function weakBook(){if(!bookOf){bookOf={};H.LV_ORDER.forEach(lv=>LEVELS[lv].books.forEach(b=>b.w.forEach(w=>bookOf[lv+'|'+w[0]]=[lv,b.t])))}
  const cnt={};weakWords().forEach(w=>{const b=bookOf[w.lv+'|'+w.en];if(b){const k=b.join('|');cnt[k]=(cnt[k]||0)+1}});
  const top=Object.entries(cnt).sort((a,b)=>b[1]-a[1])[0];return top&&top[1]>=3?{lv:top[0].split('|')[0],book:top[0].split('|')[1],n:top[1]}:null}
/* a grammar note stops being weak once it is reviewed after the last miss: the note opened again, or 3 right in a row (a whole quiz).
   old records (no mt) count as reviewed if the note's quiz was cleared */
const gramFixed=(e,id)=>e.mt?((e.rv||0)>e.mt||(e.k||0)>=3):(e.rv||(e.k||0)>=3||(ST.gram.cleared||[]).includes(id));
function weakGram(){const g=Object.entries(MD.g).filter(([id,e])=>e.m>0&&Date.now()-e.t<7*864e5&&!gramFixed(e,id)).map(([,e])=>e).sort((a,b)=>b.m-a.m||b.t-a.t)[0];return g||null}
/* sentences going badly at a level: point to the first grammar note there not cleared yet (and not opened in the last 3 days) */
function gramForSentences(){for(const lv of ['es','jh','hs']){const ws=Object.entries(MD.w).filter(([k,e])=>k.startsWith(lv+'|')&&e.kind==='s');
    const s=ws.reduce((a,[,e])=>a+e.s,0),m=ws.reduce((a,[,e])=>a+e.m,0);if(s>=8&&m/s>.4&&(typeof GRAMMAR!=='undefined')&&GRAMMAR[lv]){
      const i=GRAMMAR[lv].notes.findIndex(n=>!(ST.gram.cleared||[]).includes(n.id)&&!(MD.gv&&Date.now()-(MD.gv[n.id]||0)<3*864e5));if(i>=0)return {lv,i,title:GRAMMAR[lv].notes[i].t}}}return null}
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
/* she does not say a line again until 12 others have come (when the list is long enough) */
const saidRecent=[];
const line=(key,v)=>{const L=MINA_LINES[key]||MINA_LINES.tap,c=L.filter(l=>!saidRecent.includes(l[1])),l=pickL(c.length?c:L);
  saidRecent.push(l[1]);if(saidRecent.length>12)saidRecent.shift();return [l[0],fill(l[1],v)]};
/* the most useful thing to say now, or a plain line */
function advice(){const ww=weakWords(),opts=[];
  const wm=ww.find(w=>w.m>0);if(wm)opts.push(['weakWord',{w:wm.en,ja:wm.ja,n:wm.m},wm]);   // her lines say "missed n times", so only for real misses
  const wb=weakBook();if(wb)opts.push(['weakBook',{book:'「'+wb.book+'」'},wb]);
  const wg=weakGram()||gramForSentences();if(wg)opts.push(['grammar',{g:'「'+(wg.title)+'」'},wg]);
  const su=stepUp();if(su&&MD.said.step!==today())opts.push(['stepUp',su,su]);
  const ra=recentAcc();if(ra!=null&&ra<55)opts.push(['slowDown',{}]);
  if(ww.length>=3)opts.push(['review',{n:Math.min(ww.length,10)}]);
  if(window.LESSON){const l=LESSON.suggest(1)[0];if(l)opts.push(['lesson',{t:'「'+l.t+'」'},l])}
  return opts}

/* a line for what she sees now (game/mina-sense.js): [key, values, null, go] or null */
const sense=()=>window.MINA_SENSE?MINA_SENSE.pick():null;
/* tapping what she says takes you there: the lesson, the grammar note, the word book… (null = nothing to open) */
function goTo(o){if(!o)return null;const [k,,x]=o;if(o[3])return o[3];
  if(k==='lesson'&&x&&window.LESSON)return ['📖 授業を ひらく',()=>LESSON.open(x.id,panelOpen)];
  if(k==='grammar'&&x&&(typeof GRAMMAR!=='undefined')&&GRAMMAR[x.lv])return ['📚 文法ノートを 見る',()=>H.gramNote(x.lv,x.i)];
  if((k==='weakBook'||k==='stepUp')&&x&&H.books)return ['📕 単語帳を ひらく',()=>H.books(k==='stepUp'?x.nlv:x.lv)];
  if(k==='weakWord'&&x)return ['🔊 きいてみる',()=>H.say(x.lv,x.en)];
  if(k==='review')return ['🔁 苦手な ことばを 見る',()=>{const sc=()=>{const w=H.panel.querySelector('.mweak');if(w){const f=w.closest('details');if(f)f.open=true}if(w)w.scrollIntoView({behavior:'smooth',block:'center'})};if(H.screen==='mina')sc();else{panelOpen();setTimeout(sc,200)}}];
  return null}

/* ---------- face ---------- */
/* ミナ先生: ハーフアップのおだんご・きらきら目（2026-11 デザイン C6-1）。表情 ex と、あとから足すポーズ pose */
const MK='#2a2340',MH='#6b3a2a',MH2='#8e5640',MSK='#ffe0cc';
function minaEyes(ex){const L=26,R=38,Y=37.4,s=1.08;
  const lash=(x,d)=>`<path d="M${x+d*3.3*s} ${Y-2.2*s}l${d*1.5} -.9M${x+d*3.5*s} ${Y-.6*s}l${d*1.5} -.1" stroke="${MK}" stroke-width="1" stroke-linecap="round"/>`;
  const one=(x,d,big,dx=0,dy=0)=>{const rx=(big?3.4:3)*s,ry=(big?4.3:3.8)*s;
    return `<ellipse cx="${x}" cy="${Y}" rx="${rx}" ry="${ry}" fill="${MK}"/><ellipse cx="${x+dx*.5}" cy="${Y+.9+dy*.5}" rx="${rx*.74}" ry="${ry*.62}" fill="#3f8fe6"/><ellipse cx="${x+dx*.5}" cy="${Y+2+dy*.5}" rx="${rx*.5}" ry="${ry*.3}" fill="#9fe0ff" opacity=".55"/>`+
    `<path d="M${x+1.2+dx} ${Y-3.3+dy}l.6 1.3 1.3.4-1.3.4-.6 1.3-.6-1.3-1.3-.4 1.3-.4z" fill="#fff"/><circle cx="${x-1.3+dx}" cy="${Y+2+dy}" r=".65" fill="#fff"/>`+
    `<path d="M${x-rx-.7} ${Y-ry*.5}q${rx+.7} ${-ry*.85} ${2*rx+1.4} 0" stroke="${MK}" stroke-width="1.5" fill="none" stroke-linecap="round"/>`+lash(x,d)};
  const arc=(x,d,up)=>`<path d="M${x-3.4} ${Y+(up?1:-.6)}q3.4 ${up?-4.6:3.9} 6.8 0" stroke="${MK}" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M${x+d*3.4} ${Y+(up?1:-.6)}l${d*1.6} ${up?.2:-1.2}" stroke="${MK}" stroke-width="1.1" stroke-linecap="round"/>`;
  const heart=x=>`<path d="M${x} ${Y+3.8}l-3.6-3.5a2.2 2.2 0 0 1 3.6-2.5 2.2 2.2 0 0 1 3.6 2.5z" fill="#e8436b"/><circle cx="${x-1.5}" cy="${Y-.9}" r=".7" fill="#fff"/>`;
  const brow=w=>w?`<path d="M${L-3.5} ${Y-6.8}l5 1.6M${R+3.5} ${Y-6.8}l-5 1.6" stroke="${MK}" stroke-width="1.3" stroke-linecap="round"/>`:`<path d="M${R-3} ${Y-7.2}q3-1.8 5.5-.2" stroke="${MK}" stroke-width="1.3" fill="none" stroke-linecap="round"/>`;
  if(ex==='happy')return arc(L,-1,1)+arc(R,1,1);
  if(ex==='proud')return arc(L,-1,0)+arc(R,1,0);
  if(ex==='love')return heart(L)+heart(R);
  if(ex==='wow')return one(L,-1,1)+one(R,1,1);
  if(ex==='think')return one(L,-1,0,.9,-1.1)+one(R,1,0,.9,-1.1)+brow(0);
  if(ex==='worry'||ex==='sad')return one(L,-1,0)+one(R,1,0)+brow(1);
  return one(L,-1,0)+one(R,1,0)}
function minaFace(ex,pose){const Y=45.2,red='#d0606a',dark='#b4294a',open=`<path d="M28.3 ${Y-1.2}q3.7 6 7.4 0z" fill="${dark}"/><path d="M30 ${Y+1.4}q2-1.4 4 0q-2 1.6-4 0z" fill="#ff8fa3"/>`;
  const mouth={happy:open,love:open,wow:`<ellipse cx="32" cy="${Y+.4}" rx="1.9" ry="2.4" fill="${dark}"/>`,
    think:`<path d="M30 ${Y}q1.5-1 3 0t3 0" stroke="${red}" stroke-width="1.5" fill="none" stroke-linecap="round"/>`,
    proud:`<path d="M28.6 ${Y-.6}q1.7 2 3.4 0q1.7 2 3.4 0" stroke="${red}" stroke-width="1.5" fill="none" stroke-linecap="round"/>`,
    worry:`<path d="M29.5 ${Y+.8}q2.5-2 5 0" stroke="${red}" stroke-width="1.6" fill="none" stroke-linecap="round"/>`}[ex]||`<path d="M29.3 ${Y-.5}q2.7 2.4 5.4 0" stroke="${red}" stroke-width="1.6" fill="none" stroke-linecap="round"/>`;
  const glow=ex==='love'||ex==='happy',op=glow?.9:.6;
  const cheek=`<ellipse cx="22.5" cy="42.5" rx="2.8" ry="1.7" fill="#ff9fb0" opacity="${op}"/><ellipse cx="41.5" cy="42.5" rx="2.8" ry="1.7" fill="#ff9fb0" opacity="${op}"/>`+(glow?'<path d="M20.5 42.5l1-1.4M23 42.6l1-1.4M40 42.6l1-1.4M42.5 42.5l1-1.4" stroke="#fff" stroke-width=".6" opacity=".7"/>':'');
  const extra={proud:'<path d="M51 13l1.5 3 3 1.5-3 1.5-1.5 3-1.5-3-3-1.5 3-1.5z" fill="#ffd23f"/><circle cx="56" cy="24" r="1" fill="#ffd23f"/>',
    worry:'<path d="M49 26q2.2 4.4 0 6.4q-2.2-2 0-6.4z" fill="#8fd3ff"/>',
    wow:'<path d="M52 10v7M55.5 13.5h-7" stroke="#ffd23f" stroke-width="1.6" stroke-linecap="round"/><path d="M9 16v4M11 18h-4" stroke="#ffd23f" stroke-width="1.2" stroke-linecap="round"/>',
    love:'<path d="M52 21l-3.6-3.5a2.2 2.2 0 0 1 3.6-2.4 2.2 2.2 0 0 1 3.6 2.4z" fill="#ff6b8b"/><path d="M11 15l-2-2a1.2 1.2 0 0 1 2-1.3 1.2 1.2 0 0 1 2 1.3z" fill="#ff6b8b"/>',
    think:'<circle cx="50" cy="20" r="1.4" fill="#fff" opacity=".7"/><circle cx="53.5" cy="15" r="2.2" fill="#fff" opacity=".7"/>'}[ex]||'';
  return `<svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="31" fill="#1f2a5c"/><g transform="translate(32 31) scale(.86) translate(-32 -31)">`+
   `<path d="M11 44c-1-18 8-28 21-28s22 10 21 28c0 6 2 9 1 13-2 3-6 4-8 2 2-3 0-6-1-9l-2-12H21l-2 12c-1 3-3 6-1 9-2 2-6 1-8-2-1-4 1-7 1-13z" fill="${MH}"/>`+
   `<circle cx="32" cy="16" r="6.3" fill="${MH}"/><path d="M28.5 12.5q3-2 6.5-.3" stroke="${MH2}" stroke-width="1" fill="none" stroke-linecap="round"/>`+
   `<path d="M18 76V62c0-7.4 6.4-11.6 14-11.6s14 4.2 14 11.6v14z" fill="#fff"/><path d="M26.5 51.5q5.5 6 11 0l-2 4q-3.5 2-7 0z" fill="#7ad3c4"/><circle cx="32" cy="56" r="1.6" fill="#7ad3c4"/>`+
   `<ellipse cx="17" cy="38.5" rx="2.4" ry="3" fill="${MSK}"/><ellipse cx="47" cy="38.5" rx="2.4" ry="3" fill="${MSK}"/><ellipse cx="32" cy="37" rx="15" ry="14" fill="${MSK}"/>`+
   `<path d="M17 38c0-11 6-17 15-17s15 6 15 17c-1.5-4-4-7-6-8 0 3-1.5 5-3 6 .5-2 0-4-1-5.5-3 3-7 4.5-12 4.5 1-1.2 1.5-2.5 1.6-3.8-4 2-6.6 3.8-9.6 6.8z" fill="${MH}"/>`+
   `<path d="M21.6 27.4q2.6-3.2 6.4-4.6M36.4 22.8q2.4.6 4.2 2" stroke="#fff" stroke-width="1.7" fill="none" stroke-linecap="round" opacity=".38"/>`+
   `<g class="eyes" style="transform-origin:32px 37.4px">${minaEyes(ex)}</g>${cheek}${mouth}${extra}${minaPose(ex,pose)}</g></svg>`}
/* ---------- ミナ先生の ポーズ（手・うで）。表情とは べつに 重ねる ----------
   face('m',ex,pose): pose = ポーズの キー / '' = ポーズなし / 省略 = 表情に あわせて ランダム。
   セリフが あるときは poseFor(ex,セリフ) で セリフに あう ポーズを えらぶ（コイン→コインを持つ、授業→本 など） */
const PSK='#ffe0cc',PSH='#f3c2aa';
const PHD={
 open:`<path d="M-3.1 .6V-4.6a3.1 3.1 0 0 1 6.2 0V.6z" fill="${PSK}"/><ellipse cx="-3.4" cy="-1.6" rx="1.2" ry="2.1" transform="rotate(-28 -3.4 -1.6)" fill="${PSK}"/><path d="M-1 -7.4v1.8M1 -7.4v1.8" stroke="${PSH}" stroke-width=".55" stroke-linecap="round"/>`,
 fist:`<rect x="-3.2" y="-5.4" width="6.4" height="6" rx="2.8" fill="${PSK}"/><path d="M-1.1-5.2v1.4M1.1-5.2v1.4" stroke="${PSH}" stroke-width=".55" stroke-linecap="round"/>`,
 thumb:`<rect x="-1.15" y="-9.6" width="2.3" height="5.4" rx="1.15" fill="${PSK}"/><rect x="-3.2" y="-5.4" width="6.4" height="6" rx="2.8" fill="${PSK}"/><path d="M-3.1-3.2h2.4M-3.1-1.2h2.4" stroke="${PSH}" stroke-width=".55" stroke-linecap="round"/>`,
 peace:`<rect x="-2.5" y="-10" width="2.1" height="6" rx="1.05" fill="${PSK}" transform="rotate(-10 -1.5 -4.5)"/><rect x=".4" y="-10" width="2.1" height="6" rx="1.05" fill="${PSK}" transform="rotate(10 1.5 -4.5)"/><rect x="-3.2" y="-5.2" width="6.4" height="5.8" rx="2.8" fill="${PSK}"/><path d="M-.6-3.4q1.4 1 2.6 0" stroke="${PSH}" stroke-width=".55" fill="none" stroke-linecap="round"/>`,
 point:`<rect x="-2.6" y="-10.4" width="2.2" height="6.4" rx="1.1" fill="${PSK}"/><rect x="-3.2" y="-5.4" width="6.4" height="6" rx="2.8" fill="${PSK}"/><path d="M.2-5v1.3M1.8-4.8v1.2" stroke="${PSH}" stroke-width=".55" stroke-linecap="round"/>`};
const hnd=(k,x,y,r=0,s=1,flip)=>`<g transform="translate(${x} ${y}) rotate(${r}) scale(${flip?-s:s} ${s})">${PHD[k]}</g>`;
/* そで: かた → ひじ → 手首。手首に ミントの そで口 */
const slv=(...pts)=>{const d='M'+pts.map(p=>p.join(' ')).join('L'),w=pts[pts.length-1];
  return `<path d="${d}" stroke="#d6dfec" stroke-width="7.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" stroke="#fff" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/><circle cx="${w[0]}" cy="${w[1]}" r="2.8" fill="#7ad3c4"/>`};
const RS=[43.5,56.5],LS=[20.5,56.5];
const twinkle=(x,y)=>`<path d="M${x} ${y}l.8 1.6 1.6.8-1.6.8-.8 1.6-.8-1.6-1.6-.8 1.6-.8z" fill="#ffd23f"/>`;
const holdTwo=thing=>slv(LS,[13,62],[23,62])+slv(RS,[51,62],[41,62])+thing+hnd('fist',24.2,61.5,-70,1)+hnd('fist',39.8,60.5,70,1,1);
const POSE={
 wave:slv(RS,[55,58],[53.5,47])+hnd('open',53.5,46.2,10,1.1)+'<path d="M58 34q1.6 2.4 0 4.8M60.5 33q2.2 3.4 0 6.8" stroke="#fff" stroke-width=".9" fill="none" stroke-linecap="round" opacity=".75"/>',
 peace:slv(RS,[54.5,59],[51,49.5])+hnd('peace',51,48.7,6,1.1),
 thumb:slv(RS,[52.5,62],[46,58])+hnd('thumb',45.6,57.2,-8,1.1),
 point:slv(RS,[54.5,59],[51,49.5])+hnd('point',51,48.7,4,1.1)+twinkle(55,35),
 cheeks:slv(LS,[10.5,58],[17,51])+slv(RS,[53.5,58],[47,51])+hnd('open',17.4,50.4,18,1)+hnd('open',46.6,50.4,-18,1,1),
 chin:slv(RS,[52,63],[42,58.5])+hnd('point',41.6,58,-34,1),
 guts:slv(LS,[11,61],[17,55.5])+slv(RS,[53,61],[47,55.5])+hnd('fist',17,54.8,-8,1.1)+hnd('fist',47,54.8,8,1.1,1),
 book:holdTwo('<g transform="rotate(-5 32 58)"><rect x="23.5" y="51.5" width="17" height="13.5" rx="1.4" fill="#3a4f9a"/><rect x="24.6" y="52.4" width="14.8" height="11.7" rx=".8" fill="none" stroke="#ffd23f" stroke-width=".6"/><path d="M32 51.5v13.5" stroke="#2a3a78" stroke-width="1"/><path d="M36.3 55.6l.7 1.4 1.5.2-1.1 1 .3 1.5-1.4-.7-1.4.7.3-1.5-1.1-1 1.5-.2z" fill="#ffd23f"/><text x="27.9" y="60.2" font-size="4.2" font-family="Georgia" font-weight="700" fill="#fff" text-anchor="middle">A</text></g>'),
 stick:'<path d="M48 55L58.5 31" stroke="#a8743e" stroke-width="1.3" stroke-linecap="round"/><path d="M58.8 26.5l1.1 2.3 2.5.3-1.8 1.7.5 2.5-2.3-1.2-2.3 1.2.5-2.5-1.8-1.7 2.5-.3z" fill="#ffd23f" stroke="#fff3c4" stroke-width=".4"/>'+slv(RS,[54,61],[48,58])+hnd('fist',48,57.2,-25,1.05),
 oops:slv(RS,[56,51],[49,40])+hnd('open',48.6,39.2,-22,1.1),
 clap:slv(LS,[13,62],[28.5,56])+slv(RS,[51,62],[35.5,56])+hnd('open',29.6,55,35,1)+hnd('open',34.4,55,-35,1,1)+'<path d="M24.5 49l-1.6-1.6M32 46.5v-2.2M39.5 49l1.6-1.6" stroke="#ffd23f" stroke-width=".9" stroke-linecap="round"/>',
 pray:slv(LS,[14,63],[29,58])+slv(RS,[50,63],[35,58])+hnd('open',31,56.6,14,1)+hnd('open',33,56.6,-14,1,1),
 listen:slv(RS,[56,52],[51.5,42])+hnd('open',51,41,-62,1.05,1)+'<path d="M58 35q2 3 0 6M60.5 33.5q2.8 4.5 0 9" stroke="#bfe9ff" stroke-width=".9" fill="none" stroke-linecap="round"/>',
 look:slv(RS,[57,42],[50,27])+hnd('open',48.5,26,-95,1,1),
 shh:slv(RS,[53,62],[36.5,53])+hnd('point',35.4,51.6,-12,1),
 heart:holdTwo('<path d="M32 66.5l-7.2-7a4.4 4.4 0 0 1 7.2-5 4.4 4.4 0 0 1 7.2 5z" fill="#ff6b8b" stroke="#ffc2cf" stroke-width=".7"/><circle cx="28.6" cy="57.4" r="1" fill="#fff" opacity=".8"/>'),
 coin:slv(RS,[54.5,59],[51,49.5])+'<circle cx="51.4" cy="42.6" r="4.6" fill="#ffd23f" stroke="#e8a817" stroke-width=".8"/><circle cx="51.4" cy="42.6" r="3.2" fill="none" stroke="#fff3c4" stroke-width=".5"/><path d="M51.4 40.4l.6 1.3 1.4.2-1 1 .2 1.4-1.2-.7-1.2.7.2-1.4-1-1 1.4-.2z" fill="#fff3c4"/>'+hnd('fist',51,48.7,4,1.1)+twinkle(57,34),
 pencil:'<g transform="rotate(28 50 46)"><rect x="48.6" y="34" width="3" height="15" fill="#ffd23f"/><rect x="48.6" y="34" width="3" height="2.4" fill="#ff8fa3"/><path d="M48.6 49h3l-1.5 3.4z" fill="#f6dcb4"/><path d="M49.5 51.3h1.2l-.6 1.1z" fill="#2a2340"/></g>'+slv(RS,[54,61],[47.5,57.5])+hnd('fist',47.4,56.6,-20,1.05),
 letter:holdTwo('<g transform="rotate(-4 32 58)"><rect x="23" y="52" width="18" height="12" rx="1" fill="#fff6e0" stroke="#e8d6b8" stroke-width=".6"/><path d="M23 52.4l9 6 9-6" stroke="#e8c88a" stroke-width=".8" fill="none"/><path d="M32 60.6l-1.8-1.7a1 1 0 0 1 1.8-1.2 1 1 0 0 1 1.8 1.2z" fill="#ff6b8b"/></g>'),
 cross:slv(LS,[14,62],[38,52])+slv(RS,[50,62],[26,52])+hnd('fist',38.6,51.4,40,1)+hnd('fist',25.4,51.4,-40,1,1),
 /* 3の グッ と おなじ「胸の 前に 手」の なかま */
 thumb2:slv(LS,[11.5,62],[18,58])+slv(RS,[52.5,62],[46,58])+hnd('thumb',18.4,57.2,8,1.1,1)+hnd('thumb',45.6,57.2,-8,1.1)+twinkle(9,40),
 chest:slv(RS,[52.5,62],[39,59])+hnd('open',37.6,58,-62,1.05),
 there:slv(RS,[52.5,62],[46.5,58])+hnd('point',47.6,56.8,62,1.05)+'<path d="M55 46.5h4.5m-1.8-1.8 1.8 1.8-1.8 1.8" stroke="#ffd23f" stroke-width="1" fill="none" stroke-linecap="round" stroke-linejoin="round"/>',
 hi:slv(RS,[52.5,62],[47,57.5])+hnd('open',47,56.7,10,1.05)+'<path d="M52.5 47q1.2 1.8 0 3.6M54.6 46q1.7 2.8 0 5.6" stroke="#fff" stroke-width=".8" fill="none" stroke-linecap="round" opacity=".75"/>',
 peace2:slv(RS,[52.5,62],[46.5,58])+hnd('peace',46.4,57.2,-6,1.05),
 mug:slv(LS,[13,63],[25.5,63.5])+slv(RS,[51,63],[38.5,63.5])+'<g transform="translate(0 3)"><rect x="26.5" y="52" width="11" height="10.5" rx="2" fill="#ff8fa3"/><path d="M37.5 54.5h1.6a2.4 2.4 0 0 1 0 4.8h-1.6" stroke="#ff8fa3" stroke-width="1.4" fill="none"/><path d="M26.5 54.4h11" stroke="#fff" stroke-width=".8" opacity=".6"/><path d="M30 50q-1-1.6 0-3.2q1-1.6 0-3.2M34 50q-1-1.6 0-3.2q1-1.6 0-3.2" stroke="#fff" stroke-width=".8" fill="none" stroke-linecap="round" opacity=".6"/></g>'+hnd('fist',26.6,62.5,-70,.95)+hnd('fist',37.4,62.5,70,.95,1),
 star:slv(RS,[54,61],[49,57])+'<path d="M48.6 42.4l1.6 3.3 3.6.5-2.6 2.5.6 3.6-3.2-1.7-3.2 1.7.6-3.6-2.6-2.5 3.6-.5z" fill="#ffd23f" stroke="#fff3c4" stroke-width=".6" stroke-linejoin="round"/>'+hnd('fist',48.8,56.2,-4,1.1)+'<circle cx="54.5" cy="43" r=".8" fill="#fff"/><circle cx="43.5" cy="45" r=".6" fill="#fff"/>',
 card:slv(RS,[52.5,62],[46,58])+'<g transform="rotate(8 46 50)"><rect x="40.5" y="44" width="12" height="8.6" rx="1" fill="#fff" stroke="#d6dfec" stroke-width=".6"/><text x="46.5" y="50.2" font-size="3.8" font-family="Georgia" font-weight="700" fill="#3a4f9a" text-anchor="middle">ABC</text></g>'+hnd('fist',45.6,57.2,-8,1.1),
 mic:slv(RS,[52.5,62],[46,58.6])+'<path d="M45.6 57l-1-5.6" stroke="#555a78" stroke-width="1.6" stroke-linecap="round"/><circle cx="44.4" cy="50.4" r="2.6" fill="#c8cee0"/><path d="M42.4 49.6h4M42.7 51.2h3.4" stroke="#8a90a8" stroke-width=".5"/>'+hnd('fist',45.6,57.8,-8,1.05)+'<path d="M40 47l-1.4-1M39.4 50h-1.8" stroke="#ffd23f" stroke-width=".8" stroke-linecap="round"/>',
};
/* 表情ごとの「よく する ポーズ」（'' は ポーズなし） */
const POSE_EX={smile:['','','','book','point','stick','wave','pencil','hi','card','star','there'],happy:['','peace','peace2','guts','clap','wave','hi','thumb','thumb2'],
  wow:['','cheeks','clap','star'],think:['','chin','chin','look','pencil','card'],proud:['','thumb','thumb2','chest','peace2','guts'],
  worry:['','oops','pray','cross'],love:['','cheeks','heart','heart','mug']};
/* セリフの ことばで えらぶ（上から 順に 見る） */
const POSE_TX=[[/コイン|🪙|まい ゲット|ごほうび/,['coin']],[/手紙|ボトル|📮|💌|メール/,['letter']],[/ないしょ|ひみつ|こっそり|しーっ/,['shh']],
  [/まちが|おしい|ミス|うっかり/,['oops']],[/ちがう|ブッブー|ざんねん/,['cross']],[/せいかい|正解|ぜんもん|ばっちり|やったね|できたね|クリア/,['clap','thumb','thumb2','peace2']],[/いいね|グッ|ナイス|その ちょうし|そのちょうし/,['thumb','thumb2']],[/まかせて|だいじょうぶ|大丈夫/,['chest']],
  [/がんば|ファイト|いっしょに/,['guts']],[/おねがい|お願い|たのむ|ゆるして/,['pray']],[/発音|声に 出|声に出|言ってみ|いってみ/,['mic']],[/聞いて|きいて|聞こえ|ラジオ|🎧|📻|🔊/,['listen']],[/ココア|あったか|ひとやすみ|ひと休み|おつかれ|のんびり/,['mug']],[/星|スター|✨|⭐/,['star']],[/単語|カード/,['card']],[/あっち|こっち|行こう|行って みて|行ってみて|右はし|左/,['there']],
  [/書いて|かいて|書き|書く|ノート|メモ/,['pencil']],[/授業|📖|文法|ふくしゅう|勉強/,['book','stick']],[/こんにちは|こんばんは|おはよう|おかえり|やあ|ひさしぶり|また ね|またね|おやすみ/,['wave','hi']],
  [/どこ|さがし|探|見つけ|宝/,['look']],[/ポイント|コツ|だいじ|大事|おぼえて|ヒント/,['point']],[/だいすき|大好き|うれしい|❤️/,['heart','cheeks']],[/すごい|えらい|さすが/,['clap','thumb','thumb2']]];
const pickP=a=>a[Math.random()*a.length|0];
function poseFor(ex,text){const t=String(text||'').replace(/<[^>]+>/g,'');
  if(t&&Math.random()<.85)for(const [re,ps] of POSE_TX)if(re.test(t))return pickP(ps);
  return pickP(POSE_EX[ex]||POSE_EX.smile)}
function minaPose(ex,pose){if(pose===undefined)pose=poseFor(ex);return POSE[pose]||''}
function face(who,ex,pose){return who==='m'?minaFace(ex,pose):hamaFace(ex)}
/* ハマ子の顔（ミナ先生は minaFace） */
function hamaFace(ex){const m=false;
  const eyes={smile:'<circle cx="27" cy="35" r="1.9"/><circle cx="37" cy="35" r="1.9"/>',
    happy:'<path d="M24.5 35.5q2.5-3 5 0M34.5 35.5q2.5-3 5 0" stroke="#2a2340" stroke-width="1.7" fill="none" stroke-linecap="round"/>',
    wow:'<circle cx="27" cy="35" r="2.6"/><circle cx="37" cy="35" r="2.6"/><circle cx="27.8" cy="34.2" r=".8" fill="#fff"/><circle cx="37.8" cy="34.2" r=".8" fill="#fff"/>',
    think:'<circle cx="28" cy="34.5" r="1.8"/><circle cx="38" cy="34.5" r="1.8"/><path d="M24 30.5l5-1M35 29.5l5 1" stroke="#2a2340" stroke-width="1.2"/>',
    proud:'<path d="M24.5 34.5q2.5 2.5 5 0M34.5 34.5q2.5 2.5 5 0" stroke="#2a2340" stroke-width="1.7" fill="none" stroke-linecap="round"/>',
    worry:'<circle cx="27" cy="35.5" r="1.8"/><circle cx="37" cy="35.5" r="1.8"/><path d="M24 31l5 1.4M40 31l-5 1.4" stroke="#2a2340" stroke-width="1.2"/>',
    love:'<path d="M27 37.6l-2.6-2.5a1.5 1.5 0 0 1 2.6-1.6 1.5 1.5 0 0 1 2.6 1.6zM37 37.6l-2.6-2.5a1.5 1.5 0 0 1 2.6-1.6 1.5 1.5 0 0 1 2.6 1.6z" fill="#e8436b"/>'}[ex]||'';
  const mouth={smile:'<path d="M28 41q4 3 8 0" stroke="#d0606a" stroke-width="1.7" fill="none" stroke-linecap="round"/>',
    happy:'<path d="M27.5 40q4.5 6 9 0z" fill="#c2304f"/>',wow:'<ellipse cx="32" cy="42" rx="2.4" ry="3" fill="#c2304f"/>',
    think:'<path d="M29 42h5" stroke="#d0606a" stroke-width="1.7" stroke-linecap="round"/>',proud:'<path d="M28 41q5 3 9-1" stroke="#d0606a" stroke-width="1.8" fill="none" stroke-linecap="round"/>',
    worry:'<path d="M28.5 42.5q3.5-2.5 7 0" stroke="#d0606a" stroke-width="1.7" fill="none" stroke-linecap="round"/>',
    love:'<path d="M27.5 40q4.5 6 9 0z" fill="#c2304f"/>'}[ex]||'';
  const extra=ex==='proud'?'<path d="M48 18l1.5 3 3 1.5-3 1.5-1.5 3-1.5-3-3-1.5 3-1.5z" fill="#ffd23f"/>':ex==='worry'?'<path d="M45 27q2 4 0 6q-2-2 0-6z" fill="#8fd3ff"/>':ex==='wow'?'<path d="M50 14v6M53 17h-6" stroke="#ffd23f" stroke-width="1.6"/>':ex==='love'?'<path d="M50 22l-3.4-3.3a2 2 0 0 1 3.4-2.1 2 2 0 0 1 3.4 2.1z" fill="#ff6b8b"/>':'';
  const hair=m?'<path d="M14 40c0-16 8-26 18-26s18 10 18 26c0 6-3 14-4 18H18c-1-4-4-12-4-18z" fill="#4a2c22"/>':'<g fill="#6b4a8a"><circle cx="20" cy="24" r="7"/><circle cx="28" cy="18" r="7"/><circle cx="37" cy="18" r="7"/><circle cx="45" cy="24" r="7"/><circle cx="17" cy="33" r="6"/><circle cx="47" cy="33" r="6"/></g>';
  const bangs=m?'<path d="M19 32c2-9 8-13 13-13s11 4 13 13c-6-6-20-6-26 0z" fill="#4a2c22"/>':'';
  const glasses=m?'':'<circle cx="27" cy="35" r="4.6" fill="none" stroke="#ff4f8b" stroke-width="1.5"/><circle cx="37" cy="35" r="4.6" fill="none" stroke="#ff4f8b" stroke-width="1.5"/><path d="M31.6 35h.8" stroke="#ff4f8b" stroke-width="1.5"/>';
  const body=m?'<path d="M20 60c2-7 7-10 12-10s10 3 12 10z" fill="#7ad3c4"/>':'<path d="M18 60c2-7 7-10 14-10s12 3 14 10z" fill="#e8b04a"/><g fill="#5a3a12"><circle cx="24" cy="56" r="1.5"/><circle cx="31" cy="54" r="1.3"/><circle cx="38" cy="57" r="1.5"/></g>';
  return `<svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="31" fill="${m?'#1f2a5c':'#3a1f2a'}"/>${hair}<circle cx="32" cy="35" r="13" fill="${m?'#ffd9c0':'#ffd2b0'}"/>${bangs}<g class="eyes" fill="#2a2340">${eyes}</g>${glasses}${mouth}<circle cx="24" cy="39.5" r="2.2" fill="#ffb3b3" opacity="${ex==='love'?.95:.55}"/><circle cx="40" cy="39.5" r="2.2" fill="#ffb3b3" opacity="${ex==='love'?.95:.55}"/>${body}${extra}</svg>`}
let minaEx='smile';
let minaPoseNow='';
function setFace(ex,text){minaEx=ex||'smile';minaPoseNow=text===undefined?'':poseFor(minaEx,text);const f=$('minaFace');if(f)f.innerHTML=face('m',minaEx,minaPoseNow)}

/* ---------- speaking in the home row ---------- */
let speakUntil=0,talkOn=false,hideT=0;
const busy=()=>talkOn||performance.now()<speakUntil;
function sayRow(who,ex,text,ms=6500,pop,go){const b=$('minaSay'),rq=$('rq');if(!b)return false;if(pop)popSay(who,ex,text,ms,pop);
  b.hidden=false;if(rq)rq.hidden=true;b.className='msay '+(who==='m'?'by-m':'by-h')+(go?' go':'');
  b.innerHTML=`<b>${who==='m'?'ミナ先生':'ハマ子'}</b>${text}${go?`<small class="mgo">${go[0]} ▶</small>`:''}`;
  /* tap her words = go where she talks about (the word book, the lesson, the shop…) */
  b.onclick=go?e=>{e.stopPropagation();SFX.step();b.hidden=true;if(rq)rq.hidden=false;go[1]()}:null;b.classList.remove('mnew');void b.offsetWidth;b.classList.add('mnew');
  if(who==='m')setFace(ex,text);else{const h=$('hamaFace');if(h)h.innerHTML=face('h',ex)}
  SFX.pop();speakUntil=performance.now()+ms;clearTimeout(hideT);hideT=setTimeout(()=>{if(talkOn)return;b.hidden=true;if(rq)rq.hidden=false;setFace('smile');H.rest(2500)},ms);return true}
/* lines waiting for a good moment (praise after a streak, etc.) */
const Q=[];function queue(key,v,ex){Q.push([key,v,ex]);if(Q.length>3)Q.shift()}
/* announcements (授業タイム, quizzes, Hamako's challenge) also float over the beach while a radio is on,
   so they are seen even while the radio's bubbles are up. Tap = open Mina's page (or what the caller asks) */
let popT=0;
function popSay(who,ex,text,ms,tap){if(!ST.radios||!ST.radios.some(r=>r.on))return;const W=$('window');if(!W)return;
  let p=$('minaPop');if(!p){p=document.createElement('button');p.id='minaPop';W.appendChild(p)}
  p.className='mpop '+(who==='m'?'by-m':'by-h');p.innerHTML=`<span class="mpf">${who==='m'?face('m',ex,poseFor(ex,text)):face(who,ex)}</span><span class="mpt"><b>${who==='m'?'ミナ先生':'ハマ子'}</b>${text}</span>`;
  p.classList.remove('on');void p.offsetWidth;p.classList.add('on');
  p.onclick=e=>{e.stopPropagation();SFX.talk();p.classList.remove('on');typeof tap==='function'?tap():panelOpen()};
  clearTimeout(popT);popT=setTimeout(()=>p.classList.remove('on'),ms)}
/* say something that matters now, on the home screen, even while a radio is talking (the radio waits a little) */
const canAnnounce=()=>H.screen==='home'&&!document.hidden&&!busy()&&!H.stage.cheer&&$('minaSay');
let annAt=-1e9;
function announce(ex,text,ms=10000,tap){if(!$('minaSay'))return false;annAt=performance.now();H.rest(Math.min(ms,8000));return sayRow('m',ex,text,ms,tap||true)}
const canTalk=()=>H.screen==='home'&&!document.hidden&&!busy()&&!H.stage.talking&&!H.stage.cheer&&$('minaSay');

/* ---------- Hamako comes by ---------- */
function hamaPick(){const ww=weakWords(),ra=recentAcc(),ph=(()=>{try{return BEACH.scene.dbg().dark>.6?'night':'day'}catch(e){return 'day'}})(),h=new Date().getHours();
  const by=w=>HAMA_TALKS.filter(t=>t.when===w);let pool=by('any');
  const r=Math.random();if(r<.3)pool=by('candy');else if(r<.5&&ww.length)pool=by('weak');else if(r<.65&&ra!=null&&ra>=75)pool=by('good');
  else if(r<.75&&ph==='night')pool=by('night');else if(r<.75&&h>=5&&h<11)pool=by('morning');
  if(!pool.length)pool=by('any');return pickL(pool)}
function hamaVisit(t0){const t=t0||hamaPick();if(!t)return;const ww=weakWords()[0]||{},ra=recentAcc(),c=3+(Math.random()*6|0);
  const v={w:ww.en,ja:ww.ja,n:streak||day().o,acc:ra||80,c};
  const hf=$('hamaFace');if(!hf)return;hf.innerHTML=face('h','happy');hf.hidden=false;hf.classList.add('in');talkOn=true;
  MD.hama={d:today(),n:(MD.hama.d===today()?MD.hama.n:0)+1};save();
  let i=0;const next=()=>{if(H.screen!=='home'||!$('minaSay')){end();return}
    if(i>=t.lines.length){end();return}const [who,ex,tx]=t.lines[i++];sayRow(who,ex,fill(tx,v),9000,t.pop);
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
  /* ミニ授業が いちばん: きょう まだなら、 半分くらいは きょうの 授業に さそう */
  if(window.LESSON&&!LESSON.doneToday()&&Math.random()<.5){const l=LESSON.today();if(l){const sk=LESSON.streak();
    return [...line(sk?'lesHelloStreak':'lesHello',{t:'「'+l.t+'」',n:sk,n1:sk+1}),['📖 授業を ひらく',()=>LESSON.open(l.id,H.home)]]}}
  /* 💗 ふたりの 時間が はじまっていたら、 朝と 夜の あいさつは 段階で かわる（game/love.js） */
  if(window.LOVE&&Math.random()<.5){const g=LOVE.greet(h);if(g)return g}
  const r=Math.random();
  if(opts.length&&r<.35){const o=pickL(opts);if(o[0]==='stepUp')MD.said.step=today();return [...line(o[0],o[1]),goTo(o)]}
  const sn=r<.75&&sense();if(sn)return [...line(sn[0],sn[1]),goTo(sn)];
  return line(h>=5&&h<11?pickL(['morning','open']):h>=19||h<4?pickL(['night','open']):'open')}
setInterval(()=>{const now=performance.now(),dt=now-lastT;lastT=now;if(document.hidden)return;
  if(H.screen==='home'){talkAt+=dt;hamaAt+=dt}
  if(!canTalk())return;
  if(!opened){opened=true;const [ex,tx,go]=hello();sayRow('m',ex,tx,go?10000:8000,null,go);return}
  if(gramMissNow){const g=gramMissNow;gramMissNow=null;const L=window.GRAMLINK?GRAMLINK.lessonsFor(g.id):[];
    /* a lesson about it? she points there (game/gram-link.js) */
    if(L.length){const [ex,tx]=line('gramMissLes',{g:'「'+g.g+'」',t:'「'+L[0].t+'」'});sayRow('m',ex,tx,9000,null,['📖 授業を ひらく',()=>LESSON.open(L[0].id,panelOpen)]);return}
    const [ex,tx]=line('gramMiss',{g:'「'+g.g+'」'});sayRow('m',ex,tx);return}
  if(Q.length){const [k,v,ex]=Q.shift();const [e2,tx]=line(k,v);sayRow('m',ex||e2,tx);return}
  const hamaOk=MD.hama.d!==today()||MD.hama.n<2;
  if(hamaAt>=hamaGap&&hamaOk){hamaAt=0;hamaGap=(15+Math.random()*15)*60000;hamaVisit();return}
  if(talkAt>=talkGap){talkAt=0;talkGap=(3+Math.random()*2)*60000;const opts=advice(),r=Math.random();let l,go=null,sn;
    if(opts.length&&r<.3){const o=pickL(opts);if(o[0]==='stepUp')MD.said.step=today();l=line(o[0],o[1]);go=goTo(o)}
    else if(r<.85&&(sn=sense())){l=line(sn[0],sn[1]);go=goTo(sn)}
    else l=line(Math.random()<.15?pickL(['cards','coins']):'idle');sayRow('m',l[0],l[1],go?9000:6500,null,go)}},1500);

/* ---------- Mina's page: tap her face ---------- */
/* what she says at the top of her page: her face, the line, and where tapping it goes */
function talkBox(o){const [ex,tx]=o?line(o[0],o[1]):line('tap'),go=goTo(o);
  return {go,html:`<span class="mbig">${face('m',ex,poseFor(ex,tx))}</span>${go?`<button class="mline go" id="mgo">${tx}<small>${go[0]} ▶</small></button>`:`<p class="mline">${tx}</p>`}`}}
function bindTalk(o,t){if(!t.go)return;$('mgo').onclick=()=>{SFX.step();if(o[0]==='stepUp')MD.said.step=today();t.go[1]()};H.panel.querySelector('.mbig').onclick=()=>$('mgo').click()}
/* 授業メニューの 🎯 苦手 とっくん と 🔎 とことん授業（中身は 先生と 話す 画面と 同じ。ここからも すぐ 行ける） */
function menuTiles(){let h='';
  if(window.SENSEI){const w=SENSEI.weak().length;h+=`<button id="mtok" class="mvc mt-tok${w?' hot':''}"><span>🎯 苦手 とっくん</span><b>${w?`🔥 苦手 ${w}こ`:'5問 ちょうせん'}</b></button>`}
  if(window.DEEP){const R=DEEP.rec(),n=Object.keys(R).filter(id=>R[id].best>=3).length;h+=`<button id="mdeep" class="mvc mt-deep"><span>🔎 とことん授業</span><b>${n?`★3 ${n}こ`:'なんで？を 深く'}</b></button>`}
  return h}
function panelOpen(){const ww=weakWords(null,null).slice(0,12),D=day(),opts=advice(),ra=recentAcc(),wg=weakGram()||gramForSentences(),su=stepUp();
  /* half the time the most useful advice, else something about what she sees now */
  const first=opts.length&&Math.random()<.5?opts[0]:(sense()||opts[0]||null),T0=talkBox(first);
  const accToday=D.a?Math.round(D.o/D.a*100):null;
  H.show('mina',`<section class="pnl minap">
    <div class="qtop"><button class="x" id="mx" aria-label="もどる">←</button><b>👩‍🏫 ミナ先生</b><span></span></div>
    <div class="mtalk" id="mtalk">${T0.html}</div>
    ${window.MINA_SENSE?'<button id="mmore" class="sub mmore">💬 ほかの 話も きく</button>':''}
    ${window.LESSON?`${LESSON.card('mina')}
    <div class="mtiles"><button id="mall" class="mvc mt-all"><span>📖 ぜんぶの 授業</span><b>${LESSON.count().join('/')}</b></button>${typeof GRAMMAR!=='undefined'?`<button id="mgl" class="mvc mt-gram"><span>📚 文法ノート</span><b>${(ST.gram.cleared||[]).length}/${['es','jh','hs'].reduce((a,k)=>a+(GRAMMAR[k]?GRAMMAR[k].notes.length:0),0)}</b></button>`:''}${menuTiles()}</div>`:''}
    <button id="msensei" class="msensei">🗣️ ミナ先生と 英語で 話す</button>
    ${window.LOVE?LOVE.btn():''}
    ${window.KAIWA?`<button id="mkaiwa" class="sub">💬 浜辺の 会話</button>`:''}
    <details class="mfold mrec"><summary>📊 きろく・ごほうび<small>${D.a?`きょう ${D.a}問`:''}</small></summary><div class="mfbody">
    <div class="mstats"><div><b>${D.a}</b><small>きょう 答えた</small></div><div><b>${accToday==null?'-':accToday+'%'}</b><small>正解率</small></div><div><b>${D.l}</b><small>おぼえた</small></div><div><b>${MD.best}</b><small>れんぞく</small></div></div>
    ${su?`<p class="msug">⬆️ ${esc(su.lv)}の 正解率 ${su.acc}%。<b>${esc(su.next)}</b>に ちょうせん してみよう</p>`:''}
    ${wg?`<button id="mgram" class="msug btn">📚 文法ノート「${esc(wg.title)}」を 見る</button>`:''}
    ${window.LESSON?`<p class="note">いまの 力：${LVN[level()]}くらい</p>`:''}
    </div></details>
    <details class="mfold mwkf"><summary>🔁 苦手な ことば<small>${ww.length?ww.length+'こ':'なし'}</small></summary><div class="mfbody">
    <p class="note">${ww.length?'まちがえた（✗）・こたえなかった（💤）ことば。ラジオで ときどき 出すね。2回 つづけて 正解で 卒業':''}</p>
    <div class="mweak">${ww.map(w=>`<button data-say="${esc(w.en)}" data-lv="${w.lv}"><span class="en">${esc(w.en)}</span><span class="ja">${esc(w.ja||'')}</span><span class="mm">${w.m?'✗'+w.m:''}${w.m&&w.n?' ':''}${w.n?'💤'+w.n:''}</span></button>`).join('')||'<p class="note">ラジオで あそぶと、まちがえた ことばや こたえなかった ことばが ここに たまるよ</p>'}</div>
    </div></details>
  </section>`);
  setTimeout(()=>{const b=H.panel.querySelector('.mbig');if(b)b.classList.add('mnew')},10);
  bindTalk(first,T0);
  const mm=$('mmore');if(mm)mm.onclick=()=>{SFX.pop();const o=sense()||(opts.length?pickL(opts):null),t=talkBox(o);$('mtalk').innerHTML=t.html;bindTalk(o,t);
    const b=H.panel.querySelector('.mbig');if(b){b.classList.remove('mnew');void b.offsetWidth;b.classList.add('mnew')}}
  $('mx').onclick=()=>{SFX.pop();const [e2,t2]=line('bye');H.home();setTimeout(()=>sayRow('m',e2,t2,4000),150)};
  H.panel.querySelectorAll('[data-say]').forEach(b=>b.onclick=()=>H.say(b.dataset.lv,b.dataset.say));
  H.panel.querySelectorAll('.mfold').forEach(f=>f.ontoggle=()=>{if(f.open)SFX.pop()});
  if(window.LESSON){LESSON.bindCard(panelOpen);$('mall').onclick=()=>{SFX.lesson();LESSON.list()}}
  const gl=$('mgl');if(gl)gl.onclick=()=>{SFX.book();const lv=level();H.gramFrom(lv==='adv'?'hs':lv,panelOpen)};
  const mt=$('mtok');if(mt)mt.onclick=()=>{SFX.step();SENSEI.tokkun(null,0,'mina')};
  const md=$('mdeep');if(md)md.onclick=()=>{SFX.step();DEEP.pick()};
  if(window.LOVE)LOVE.bind(panelOpen);
  const ms=$('msensei');if(ms)ms.onclick=()=>{SFX.talk();window.SENSEI?SENSEI.open():null};
  const mk=$('mkaiwa');if(mk)mk.onclick=()=>{SFX.talk();KAIWA.open()};
  const gb=$('mgram');if(gb)gb.onclick=()=>{SFX.book();H.gramNote(wg.lv,wg.i)}}
/* the face lives in the home row; tap = talk */
H.on('home',()=>{const f1=$('minaFace');if(f1)f1.innerHTML=face('m',minaEx,minaPoseNow);const f=$('minaFace');if(f)f.onclick=()=>{SFX.talk();panelOpen()};
  if(talkOn){const hf=$('hamaFace');if(hf){hf.hidden=false;hf.innerHTML=face('h','smile')}}});
setFace('smile');const f0=$('minaFace');if(f0)f0.onclick=()=>{SFX.talk();panelOpen()};

/* ---------- review words for the radio ---------- */
function reviewPick(lv){if(Math.random()>.15)return null;const ww=weakWords(lv,null);return ww.length?pickL(ww.slice(0,8)).en:null}

window.MINA={poseFor,busy,say:sayRow,canTalk,canAnnounce,announce,sinceAnn:()=>performance.now()-annAt,reviewPick,open:panelOpen,face,weakWords,hamaVisit,level,weakKeys,rec:()=>MD,pick:pickL,line,
  _test:{say:()=>{talkAt=talkGap},hama:()=>{hamaAt=hamaGap;MD.hama={d:'',n:0}},hello:()=>{opened=false}}};
})();
