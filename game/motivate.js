/* ミナ先生の 授業を うけたくなる しくみ（授業タイムは game/bonus.js）
   1. 授業スタンプカード: 授業を 1つ おえると スタンプ 1こ（同じ授業は 1日 1こ）。5こで コイン、10こで 宝箱くじ、20こごとに 浜辺の 大きな ショー
   2. ミナ先生と なかよし度: 授業・思い出しクイズ・挑戦状で 上がる。レベルが 上がると ごほうび、新しい 表情（ハートの目）や セリフ、
      ハマ子さんとの おしゃべりが ふえる。Lv10 で ミナ先生が 夜空に 花火を あげてくれる
   3. 思い出しクイズ: 前に クリアした 授業から 1問（1日・3日・7日・14日・30日 あけて 出す）。ホームで ミナ先生が 声を かける
   4. ハマ子の 挑戦状: 1日 1回 ハマ子さんが「この授業 ぜんもん 正解なら コイン 2ばい＋レアカード」
   5. 授業カード: 授業を クリアすると その授業の カードが かならず もらえる（ミナ先生の 授業カード図鑑。宝箱の 図鑑とは べつ。授業が ふえると カードも ふえる）
   アナウンスは ラジオが しゃべっていても 出る（ラジオ中は 浜辺の上にも 吹き出し）。
   ごほうびの カードや ショーは、その場で 見なくても つぎに ホームへ もどると もらえる */
(()=>{
const {S:ST,sfx:SFX,scene:SC}=BEACH;
const H=HE,esc=H.esc,$=id=>document.getElementById(id);
const today=()=>{const d=new Date();return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate()};
const dayN=t=>{const d=new Date(t);return Math.floor((Date.UTC(d.getFullYear(),d.getMonth(),d.getDate()))/864e5)};
const pickL=a=>a[Math.random()*a.length|0];
const LVN={es:'小学生',jh:'中学生',hs:'高校生',adv:'ハイレベル'},RAR_N={1:'ノーマル',2:'レア',3:'スーパーレア'};
const lesOf=id=>LESSONS.find(l=>l.id===id),cleared=()=>MINA.rec().les||{};

/* ---------- the record ---------- */
const MV=(()=>{let s=null;try{s=JSON.parse(localStorage.getItem(SAVE_KEY)||'{}').moti}catch(e){}s=s||{};
  return Object.assign({st:{n:0,d:'',got:{}},nk:{p:0,lv:1,said:0},qz:{d:'',n:0,now:null,rv:{},ct:{}},hc:{d:'',id:'',done:0},pc:[],ps:[]},s)})();
_saveHooks.push(()=>{const s=JSON.parse(localStorage.getItem(SAVE_KEY)||'{}');s.moti=MV;localStorage.setItem(SAVE_KEY,JSON.stringify(s))});

/* ---------- prizes that wait: card chests and beach shows ---------- */
let chain=false,showAt=0;
function pendCard(min=2){MV.pc.push(min);save()}
function pendShow(id,night){MV.ps.push({id,night:night?1:0});save()}
function openCards(){if(!MV.pc.length||!window.CARDS||$('cardOv'))return;chain=true;const m=MV.pc.shift();save();CARDS.gift(1,m)}
const isNight=()=>{try{return SC.dbg().dark>.6}catch(e){return false}};
const evOf=id=>CATALOG.event.find(e=>e.id===id);
const bigEvents=()=>CATALOG.event.filter(e=>!e.rare&&e.p>=40&&H.onSale(e));
const newSongs=()=>CATALOG.music.filter(([id,,,,rare])=>!rare&&typeof TRACKS!=='undefined'&&TRACKS[id]&&!ST.music.includes(id));
function playShow(){if(H.screen!=='home'||performance.now()<showAt||H.stage.cheer)return;const i=MV.ps.findIndex(p=>!p.night||isNight());if(i<0)return;
  const p=MV.ps.splice(i,1)[0];save();let e=evOf(p.id);if(!e)return;if(!p.night&&!H.onSale(e))e=pickL(bigEvents())||evOf('dolphins');
  showAt=performance.now()+(e.sec||30)*1000+15000;H.radioWake&&H.radioWake();
  setTimeout(()=>{H.toast(`${e.ico} <b>${esc(e.n)}</b><small>ミナ先生からの ごほうび</small>`,2800);try{e.k==='show'?SC.show(e.id,e.sec):SC.play(e.id)}catch(x){}
    if(p.night&&MINA.canAnnounce())MINA.announce('love','🎇 いつも 授業 ありがとう。 これは わたしからの 花火だよ',9000)},700)}

/* ---------- what a prize does: text for the prize box, and the effect. In a lesson, coins fly together at the end ---------- */
let inLesson=null;   // {coins} while the lesson's prize box is being made
function coins(n){if(inLesson)inLesson.coins+=n;else{H.addCoins(n);SFX.coin()}}
function give([k,n]){
  if(k==='coin'){coins(n);return `🪙${n}まい`}
  if(k==='card'){pendCard(n);return `🃏 ${RAR_N[n]}以上の カード`}
  if(k==='song'){const s=newSongs();if(!s.length){coins(60);return '🪙60まい'}const [id,,ico]=pickL(s);ST.music.push(id);save();
    setTimeout(()=>H.playTrack(id),inLesson?1200:300);return `${ico} 新しい 曲「${esc(TRACKS[id].name)}」`}
  if(k==='show'){const e=pickL(bigEvents())||evOf('dolphins');pendShow(e.id);return `${e.ico} 浜辺で ${esc(e.n)}`}
  if(k==='fw'){pendShow('grandfw',1);return '🎇 夜空に ミナ先生の 超特大スターマイン（夜に なったら）'}
  return ''}

/* ---------- 2. なかよし度 ---------- */
const NK=[0,20,50,90,140,200,270,350,440,540];
const NK_NAME=['はじめまして','顔見知り','なかよし','いい感じ','おともだち','親友','名コンビ','大親友','かけがえのない人','ずっと いっしょ'];
const NK_GIFT={2:[['coin',30]],3:[['coin',30]],4:[['song']],5:[['card',2]],6:[['coin',80]],7:[['show']],8:[['card',3]],9:[['song'],['coin',100]],10:[['fw']]};
const NK_NEW={3:'ハートの 目を 見せてくれるように なった',5:'ハマ子さんとの おしゃべりが ふえた',7:'ミナ先生の ひみつの 話が きける',10:'ずっと いっしょ！'};
const NK_UP={2:'名前、 ちゃんと おぼえたよ。 これからも よろしくね',3:'なんだか うれしいな。 いっしょに 勉強するの、 たのしい',4:'あなたが 来ると、 浜辺が ぱっと 明るくなるね',
  5:'もう おともだち だね。 ハマ子さんにも 自慢しちゃった',6:'あなたは わたしの 自慢の 生徒だよ',7:'わたしたち、 名コンビ だと 思う！',
  8:'ねえ、 ここまで 来てくれて ほんとに ありがとう',9:'あなたが 英語で 話す日が たのしみ',10:'ずっと いっしょに 勉強しようね。 今夜は 花火を あげるよ'};
/* lines she says only when you are close */
const NK_LINES=[[3,'love','あなたの がんばり、 ちゃんと 見てるよ'],[3,'happy','きょうも 来てくれて ありがとう'],[4,'love','ミニ授業、 また いっしょに やろうね'],
  [5,'smile','ハマ子さん、 あなたの こと よく 話してるよ'],[6,'love','先生に なって よかったって、 あなたを 見てると 思うんだ'],
  [7,'think','ひみつだけど… わたしも むかしは 英語が にがて だったの'],[7,'happy','わたしが 英語を 好きに なったのは、 洋楽の 歌詞が きっかけ なんだ'],
  [8,'love','あなたと いると、 時間が すぐ たっちゃう'],[9,'proud','あなたなら どこまでも いけるよ'],[10,'love','これからも ずっと、 となりで 応援してるね']];
const NK_HAMA=[[5,{when:'any',lines:[['h','wow','ミナちゃん、 この子と えらい なかよう なったなあ'],['m','love','えへへ… わかります？'],['h','proud','顔に 書いてあるわ！ ええこっちゃ']]}],
  [5,{when:'any',lines:[['h','happy','あんた、 ミナちゃんの 授業 ちゃんと うけとるらしいな'],['m','proud','はい、 毎日 がんばってるんですよ'],['h','happy','えらい！ アメちゃん {c}こ あげよ']]}],
  [7,{when:'any',lines:[['h','think','ミナちゃん、 むかしは 英語 にがて やったんやで'],['m','worry','ハマ子さん！ それ ひみつ ですって…'],['h','happy','ええやんか、 この子なら ひみつ 守ってくれるわ']]}],
  [9,{when:'any',lines:[['h','proud','あんたら 見とると、 うちも 英語 やりたなるわ'],['m','happy','ハマ子さんも いっしょに 授業 うけます？'],['h','wow','ほな… ハロー！ …つぎ なんて言うん？'],['m','love','ふふっ、 ゆっくり いきましょう']]}]];
const NK_HAMA_IN=new Set();
function nkUnlock(){const lv=MV.nk.lv;
  NK_LINES.forEach(x=>{if(x[0]<=lv&&!x.in){x.in=1;(MINA_LINES.idle=MINA_LINES.idle||[]).push([x[1],x[2]],[x[1],x[2]])}});
  NK_HAMA.forEach((x,i)=>{if(x[0]<=lv&&!NK_HAMA_IN.has(i)){NK_HAMA_IN.add(i);HAMA_TALKS.push(x[1])}})}
const nkNeed=()=>MV.nk.lv>=NK.length?0:NK[MV.nk.lv]-MV.nk.p;
/* add points; returns the level-ups as lines for the prize box */
function nkAdd(p){MV.nk.p+=p;const ups=[];while(MV.nk.lv<NK.length&&MV.nk.p>=NK[MV.nk.lv]){MV.nk.lv++;const lv=MV.nk.lv;
    const gifts=(NK_GIFT[lv]||[]).map(give).filter(Boolean);ups.push({lv,gifts,news:NK_NEW[lv]||''})}
  save();if(ups.length)nkUnlock();return ups}
const nkBar=()=>{const lv=MV.nk.lv;if(lv>=NK.length)return 100;const a=NK[lv-1],b=NK[lv];return Math.round((MV.nk.p-a)/(b-a)*100)};
function nkHtml(gain,ups){return `<span class="nkline">❤️ なかよし <b>+${gain}</b>　Lv${MV.nk.lv}「${NK_NAME[MV.nk.lv-1]}」</span><i class="nkbar"><i style="width:${nkBar()}%"></i></i>`
  +ups.map(u=>`<span class="nkup">💗 <b>Lv${u.lv}「${NK_NAME[u.lv-1]}」</b>に なった！<small>${u.gifts.join('・')}${u.news?`${u.gifts.length?'・':''}${u.news}`:''}</small></span>`).join('')}
/* outside a lesson (the quiz), a level-up is told by Mina */
function nkOut(p){const ups=nkAdd(p);if(!ups.length)return;const u=ups[ups.length-1];SFX.fanfare(3);
  H.toast(`💗 なかよし <b>Lv${u.lv}「${NK_NAME[u.lv-1]}」</b><small>${ups.flatMap(x=>x.gifts).join('・')}</small>`,4200);
  setTimeout(()=>{if(MINA.canAnnounce())MINA.announce('love',NK_UP[u.lv]||'',8000)},1500)}

/* ---------- 1. stamps ---------- */
const ST_GIFT=n=>{const k=(n-1)%10+1,g=[];if(k===5)g.push(['coin',50]);if(k===10)g.push(['card',2]);if(n%20===0)g.push(['show']);return g};
function stampRow(l){const t=today();if(MV.st.d!==t){MV.st.d=t;MV.st.got={}}if(MV.st.got[l.id])return null;
  MV.st.got[l.id]=1;const n=++MV.st.n,k=(n-1)%10+1,gifts=ST_GIFT(n).map(give).filter(Boolean);save();
  return `<span>📮 授業スタンプ <b>${k}/10</b>${gifts.length?`　🎉 ${gifts.join('・')}`:''}</span>${sheet(n,true)}`}
/* the sheet of ten: the newest stamp pops in */
function sheet(n,fresh){const k=n?(n-1)%10+1:0,full=n&&k===10&&fresh;
  return `<span class="stsheet">${Array.from({length:10},(_,i)=>{const on=i<k||(!fresh&&k===10),nw=fresh&&i===k-1;
    return `<i class="${on?'on':''} ${nw?'new':''} ${i===4||i===9?'gift':''}">${on?'⭐':i===4?'🪙':i===9?'🃏':''}</i>`}).join('')}</span>${full?'<small class="stfull">カード いっぱい！ つぎの カードへ</small>':''}`}

/* ---------- 5. lesson cards ---------- */
function cardRow(l){if(!window.CARDS||!CARDS.lessonGet)return null;const c=CARDS.lessonGet(l.id);if(!c)return null;const [a,b]=CARDS.lesCount();
  return `<span class="lcrow"><span class="lcard">${CARDS.face(c,{show:1})}</span><span>📖 授業カード <b>「${esc(l.t)}」</b> ゲット！<small>ミナ先生の 授業カード ${a}/${b}（ミナ先生の ページから 見られるよ）</small></span></span>`}
/* lessons cleared before cards came: their cards arrive now */
setTimeout(()=>{if(!window.CARDS||!CARDS.lessonGet)return;const got=Object.keys(cleared()).filter(id=>lesOf(id)&&CARDS.lessonGet(id,true));
  if(got.length)H.toast(`📖 これまでの 授業カード <b>${got.length}まい</b> が とどいたよ<small>ミナ先生の ページの 📖 授業カード から 見られるよ</small>`,4200)},2500);

/* ---------- 4. Hamako's challenge ---------- */
const hcOn=()=>MV.hc.d===today()&&!MV.hc.done&&!!lesOf(MV.hc.id);
function hcRow(l,info){if(!hcOn()||MV.hc.id!==l.id)return null;
  if(info.miss){return `<span>🍬 ハマ子「おしい！ あと ${info.miss}もんや。 きょうの うちに もう一回 いけるで！」</span>`}
  MV.hc.done=1;save();const extra=LESSON.PAY[l.lv]*(info.first?1:2);coins(extra);pendCard(2);inLesson.gain+=5;
  return `<span>🍬 ハマ子の 挑戦状 クリア！ コイン 2ばいで 🪙<b>${extra}</b>まい ＋ 🃏 レア以上の カード</span>`}
function hcStart(){const D=cleared(),pool=LESSON.suggest(4).filter(l=>!MV.qz.now||l.id!==MV.qz.now.id),l=pool.find(x=>!D[x.id])||pool[0];if(!l)return false;
  MV.hc={d:today(),id:l.id,done:0};save();
  MINA.hamaVisit({pop:()=>LESSON.open(l.id),lines:[['h','wow','ちょっと あんた！ ハマ子からの 挑戦状や！'],
    ['h','proud',`ミナちゃんの 授業 「${esc(l.t)}」、 ぜんもん 正解 できたら コイン 2ばいと レア以上の カード あげるで！`],
    ['m','smile','ハマ子さんったら… でも やってみよう！ 下の 🍬 から はじめられるよ'],['h','happy','きょう いちにち 有効やで〜 ほな まってるわ！']]});chips();return true}

/* ---------- 3. recall quiz ---------- */
const GAPS=[1,3,7,14,30];
function quizPick(){const D=cleared(),now=dayN(Date.now());let best=null,bs=-1;
  Object.keys(D).forEach(id=>{const l=lesOf(id);if(!l||!l.quiz.some(q=>!q.order))return;const r=MV.qz.rv[id]||{n:0,t:MV.qz.ct[id]||0};
    const over=now-dayN(r.t)-GAPS[Math.min(r.n,GAPS.length-1)];if(over>=0&&over+Math.random()>bs){bs=over+Math.random();best=l}});return best}
function quizStart(){const l=quizPick();if(!l)return false;const qs=l.quiz.map((q,i)=>[q,i]).filter(([q])=>!q.order);
  MV.qz.now={id:l.id,qi:pickL(qs)[1]};MV.qz.n++;save();
  MINA.announce('think',`❓ 思い出しクイズ！ 前に やった 「<b>${esc(l.t)}</b>」、 おぼえてる？ 下の ❓ を タップして 1問 こたえてね`,10000,quizOpen);chips();return true}
function quizOpen(){const z=MV.qz.now;if(!z)return;const l=lesOf(z.id),q=l&&l.quiz[z.qi];if(!q){MV.qz.now=null;save();chips();return}
  const order=q.o.map((o,i)=>i).sort(()=>Math.random()-.5);
  H.show('mquiz',`<section class="pnl lsn">
    <div class="qtop"><button class="x" id="zx" aria-label="もどる">←</button><b>❓ 思い出しクイズ</b><span class="qn">${esc(l.t)}</span></div>
    <div class="lsay by-m"><span class="lface">${MINA.face('m','smile')}</span><div class="lbody"><p>${esc(q.q)}</p></div></div>
    <div class="lopts">${order.map(i=>`<button data-o="${i}">${esc(q.o[i])}</button>`).join('')}</div>
    <div id="zfb"></div></section>`);
  $('zx').onclick=()=>{SFX.pop();H.home()};
  H.panel.querySelectorAll('[data-o]').forEach(b=>b.onclick=()=>{const ok=+b.dataset.o===q.a;H.panel.querySelectorAll('[data-o]').forEach(x=>x.disabled=true);
    H.panel.querySelector(`[data-o="${q.a}"]`).classList.add('right');if(!ok)b.classList.add('wrong');
    const r=MV.qz.rv[l.id]||{n:0};MV.qz.rv[l.id]={n:ok?r.n+1:0,t:Date.now()};MV.qz.now=null;save();SFX[ok?'coin':'tie']();(window.LESSON_ANS||[]).forEach(f=>{try{f(l,z.qi,ok,'quiz')}catch(e){console.error(e)}});
    const nx=ok?GAPS[Math.min(r.n+1,GAPS.length-1)]:1;
    $('zfb').innerHTML=`<div class="lsay by-m"><span class="lface">${MINA.face('m',ok?'love':'worry')}</span><div class="lbody"><p>${ok?`せいかい！ ちゃんと おぼえてたね。 🪙<b>15</b>まい ＆ ❤️ なかよし +3<br><small>つぎは ${nx}日後に また 出すね</small>`:`おしい！ こたえは <b>${esc(q.o[q.a])}</b>。 あした もう一度 出すね`}</p></div></div>
      <div class="row">${ok?'':`<button id="zles" class="sub">📖 授業を みなおす</button>`}<button id="zok">ホームへ</button></div>`;
    if(ok){const rc=b.getBoundingClientRect();H.coinBurst(rc.left+rc.width/2,rc.top+rc.height/2,15);setTimeout(()=>nkOut(3),1200)}
    $('zok').onclick=()=>{SFX.pop();H.home()};const zl=$('zles');if(zl)zl.onclick=()=>{SFX.vopen();LESSON.open(l.id,H.home)}})}

/* ---------- the lesson's prize box: card, challenge, stamp, なかよし, then buttons for what waits ---------- */
LESSON_AFTER.unshift(()=>{inLesson={coins:0,gain:0};return null});   // before 授業タイム (game/bonus.js), so its coins and points join in
LESSON_AFTER.push((l,info)=>{if(info.first&&!MV.qz.ct[l.id]){MV.qz.ct[l.id]=Date.now();save()}const c=cardRow(l);return c?{html:c}:null},
  (l,info)=>{const h=hcRow(l,info);return h?{html:h}:null},
  (l)=>{const h=stampRow(l);return h?{html:h}:null},
  (l,info)=>{const g=(info.first?10:5)+(info.miss?0:3)+inLesson.gain;inLesson.gain=0;const ups=nkAdd(g);
    if(ups.length){const u=ups[ups.length-1];setTimeout(()=>{SFX.fanfare(3);const f=H.panel.querySelector('.lsay.big .lface');if(f)f.innerHTML=MINA.face('m','love');
      const p=H.panel.querySelector('.lsay.big .lbody p');if(p)p.insertAdjacentHTML('beforeend',`<br>💗 ${NK_UP[u.lv]||''}`)},1400)}
    return {html:nkHtml(g,ups)}},
  ()=>{const L=inLesson;inLesson=null;const pc=MV.pc.length,ps=MV.ps.filter(p=>!p.night).length;
    const after=()=>{if(L.coins){const b=H.panel.querySelector('.bwin');const r=(b||H.panel).getBoundingClientRect();setTimeout(()=>H.coinBurst(r.left+r.width/2,r.top+30,L.coins),800)}
      const mc=$('mcard');if(mc)mc.onclick=()=>{SFX.vopen();mc.remove();openCards()};const ms=$('mshow');if(ms)ms.onclick=()=>{SFX.chime();H.home()};chips()};
    if(!pc&&!ps)return L.coins?{html:'',after}:null;
    return {html:`<span class="brbtn">${pc?`<button id="mcard" class="bgo">🎁 宝箱を あける${pc>1?` ×${pc}`:''}</button>`:''}${ps?`<button id="mshow" class="bgo">🏖️ 浜辺へ 見にいく</button>`:''}</span>`,after}});

/* ---------- home: chips for what is waiting; Mina's page: the whole picture ---------- */
function chips(){const old=$('mchips');if(H.screen!=='home'){return}const row=H.panel.querySelector('.mrow');if(!row)return;
  const z=MV.qz.now&&lesOf(MV.qz.now.id),hc=hcOn()&&lesOf(MV.hc.id),pc=MV.pc.length;
  const ex=(window.MOTI_CHIPS||[]).map(f=>{try{return f()}catch(e){return null}}).filter(Boolean);   // more chips from other files (game/review.js)
  const html=(z?`<button class="bchip qz" data-m="qz"><span>❓ 思い出しクイズ</span><span>${esc(z.t)}</span></button>`:'')
    +(hc?`<button class="bchip hc" data-m="hc"><span>🍬 ハマ子の 挑戦状</span><span>${esc(hc.t)}</span></button>`:'')
    +(pc?`<button class="bchip cd" data-m="cd"><span>🎁 ごほうびの 宝箱</span><span>×${pc}</span></button>`:'')
    +ex.map((x,i)=>`<button class="bchip ${x.cls||''}" data-m="x${i}"><span>${x.a}</span><span>${x.b}</span></button>`).join('');
  if(!html){if(old)old.remove();return}
  const c=old||document.createElement('div');c.id='mchips';c.innerHTML=html;if(!old){const bc=$('bchip');(bc||row).after(c)}
  c.querySelectorAll('[data-m]').forEach(b=>b.onclick=()=>{SFX.vopen();const m=b.dataset.m;if(m[0]==='x')ex[+m.slice(1)].go();else if(m==='qz')quizOpen();else if(m==='hc')LESSON.open(MV.hc.id,H.home);else openCards()})}
function minaBox(){const p=H.panel.querySelector('.minap');if(!p||p.querySelector('.mvbox'))return;const n=MV.st.n,k=n?(n-1)%10+1:0,[a,b]=window.CARDS&&CARDS.lesCount?CARDS.lesCount():[0,0];
  const z=MV.qz.now&&lesOf(MV.qz.now.id),hc=hcOn()&&lesOf(MV.hc.id),need=nkNeed();
  const d=document.createElement('div');d.className='mvbox';
  d.innerHTML=`<div class="nk"><span>❤️ なかよし <b>Lv${MV.nk.lv}</b>「${NK_NAME[MV.nk.lv-1]}」</span><small>${need>0?`つぎの レベルまで ${need}`:'さいこうの なかよし！'}</small><i class="nkbar"><i style="width:${nkBar()}%"></i></i></div>
    <div class="stp"><span>📮 授業スタンプ <b>${k}/10</b>　<small>5こ 🪙50・10こ 🃏宝箱くじ・20こごと 🏖️ショー</small></span>${sheet(n,false)}</div>
    <button class="mvc" data-v="cards"><span>📖 授業カード</span><b>${a}/${b}</b></button>
    ${z?`<button class="mvc qz" data-v="qz"><span>❓ 思い出しクイズ</span><b>${esc(z.t)}</b></button>`:''}
    ${hc?`<button class="mvc hc" data-v="hc"><span>🍬 ハマ子の 挑戦状</span><b>${esc(hc.t)}</b></button>`:''}`;
  const t=p.querySelector('.mstats')||p.querySelector('.mtalk');t?t.after(d):p.appendChild(d);
  d.querySelectorAll('[data-v]').forEach(b=>b.onclick=()=>{SFX.vopen();const v=b.dataset.v;if(v==='cards')CARDS.open('lesson');else if(v==='qz')quizOpen();else LESSON.open(MV.hc.id)})}
new MutationObserver(()=>minaBox()).observe(H.panel,{childList:true});
H.on('home',()=>{chips();if(MV.pc.length&&!$('cardOv'))setTimeout(()=>{if(H.screen==='home')openCards()},1200)});

/* ---------- when to speak up ---------- */
let homeT=0,quizAt=(2+Math.random()*2)*60000,hcAt=(6+Math.random()*4)*60000,lastT=performance.now();
setInterval(()=>{const now=performance.now(),dt=now-lastT;lastT=now;if(document.hidden)return;
  if(chain&&!$('cardOv')){if(MV.pc.length)openCards();else{chain=false;chips()}}
  if(MV.qz.d!==today()){MV.qz.d=today();MV.qz.n=0;MV.qz.now=null;save();chips()}
  if(H.screen!=='home')return;homeT+=dt;
  if(MV.ps.length)playShow();
  if(!MINA.canAnnounce()||MINA.sinceAnn()<60000||(window.BONUS&&BONUS.active()&&MINA.sinceAnn()<120000))return;
  if(homeT>=quizAt&&!MV.qz.now&&MV.qz.n<3){quizAt=homeT+(12+Math.random()*8)*60000;if(quizStart())return}
  if(homeT>=hcAt&&MV.hc.d!==today()){hcAt=homeT+5*60000;if(hcStart())return}},1000);
nkUnlock();chips();

window.MOTI={nkName:()=>NK_NAME[MV.nk.lv-1],nkNeed,nkMax:NK.length,pendCard,pendShow,coins,gain:n=>{if(inLesson)inLesson.gain+=n;else nkOut(n)},rec:()=>MV,openCards,chips,
  _test:{quiz:()=>{MV.qz.n=0;MV.qz.now=null;return quizStart()},hama:()=>{MV.hc.d='';MINA.rec().hama={d:'',n:0};return hcStart()},nk:p=>nkOut(p),stamps:n=>{MV.st.n=n;save()}}};
})();
