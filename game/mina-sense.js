/* ミナ先生の「いまの ようす」を 読む しくみ（状況判断エンジン）
   セーブデータ ぜんぶ（単語帳・ラジオの 答え・苦手・文法ノート・ミニ授業・ふくしゅう・スタンプ・なかよし度・カード・ショップ・宝の地図・コイン・日にち）を 読んで、
   いま 言える ことを さがす。ルール 1つ = 1つの 場面（キー）。場面に あう セリフは game/mina-talk.js の MINA_TALK に ある
   - 1つの ルール: [キー, 重み, F=>うめる値 または null, 値=>[ボタンの 文字, タップで うごく 関数] または null]
   - うめる値の { } は セリフの {w} {book} など。「_」で はじまる 値は セリフでは つかわない（移動先の ため）
   - 同じ 場面は 直近 8回 くりかえさない。セリフの くりかえしは game/mina.js の line() が ふせぐ（直近 12こ）
   ミナ先生（game/mina.js）が ホーム・ページ・あいさつで MINA_SENSE.pick() を よぶ */
(()=>{
const {S:ST,sfx:SFX}=BEACH;
const H=HE;
const LVN={es:'小学生',jh:'中学生',hs:'高校生',adv:'ハイレベル'};
const pickL=a=>a[Math.random()*a.length|0];
const dkey=d=>d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate();
const has=(o,k)=>o&&Object.prototype.hasOwnProperty.call(o,k);
const back=()=>MINA.open();
const goBook=(lv,bi,left)=>['📕 単語帳を ひらく',()=>H.book(lv,bi,left)];
const goShelf=lv=>['📕 単語帳を 見る',()=>H.books(lv)];
const goShop=tab=>['🛍️ ショップを 見る',()=>H.shop(tab)];
const goLesson=id=>['📖 授業を ひらく',()=>LESSON.open(id,back)];
const goSay=(lv,en)=>['🔊 きいてみる',()=>H.say(lv,en)];
const goCards=s=>['🃏 カード図鑑を 見る',()=>CARDS.open(s)];
const goKaiwa=()=>['💬 会話を ひらく',()=>KAIWA.open()];
const goTalk=id=>['💬 話しに 行く',()=>KAIWA.play(id)];
const LVI=lv=>['es','jh','hs','adv'].indexOf(lv);
const goGram=(lv,i)=>['📚 文法ノートを 見る',()=>{const n=GRAMMAR[lv].notes[i];(ST.gram.owned||[]).includes(n.id)?H.gramNote(lv,i):H.gramShop(lv)}];

/* ---------- what is true now (read again every 10 s at most) ---------- */
let FC=null,FT=-1e9;
function facts(){if(FC&&performance.now()-FT<10000)return FC;FT=performance.now();
  const now=new Date(),h=now.getHours(),MD=MINA.rec(),F={now,h,m:now.getMonth()+1,dow:now.getDay(),coins:ST.coins|0,lv:MINA.level()};
  /* the beach has its own clock (faster than real time): what the sky looks like now */
  F.gh=((ST.gameMin||0)/60)%24;F.sky=F.gh>=4.5&&F.gh<6.5?'dawn':F.gh>=6.5&&F.gh<17?'day':F.gh>=17&&F.gh<19.5?'sunset':'night';
  F.part=h>=5&&h<10?'morning':h>=10&&h<16?'noon':h>=16&&h<19?'evening':h>=19&&h<23?'night':'late';
  /* word books */
  F.bk=[];F.word={};
  H.LV_ORDER.forEach(lv=>LEVELS[lv].books.forEach((b,bi)=>{const n=b.w.filter(w=>ST.learned[lv+':'+w[0]]).length;
    F.bk.push({lv,bi,t:b.t,n,tot:b.w.length,pos:ST.bookPos[lv+':'+bi]||0,w:b.w});
    b.w.forEach(w=>{const k=w[0].toLowerCase();if(!F.word[k])F.word[k]={lv,bi,t:b.t,en:w[0],ja:w[1]}})}));
  F.learned=H.LV_ORDER.reduce((a,lv)=>(a[lv]=F.bk.filter(b=>b.lv===lv).reduce((x,b)=>x+b.n,0),a),{});
  F.lvTot=H.LV_ORDER.reduce((a,lv)=>(a[lv]=F.bk.filter(b=>b.lv===lv).reduce((x,b)=>x+b.tot,0),a),{});
  F.learnedAll=Object.values(F.learned).reduce((a,b)=>a+b,0);
  F.sn=typeof seasonNow==='function'?seasonNow():null;
  /* answers */
  F.weak=MINA.weakWords();
  F.rec=Object.entries(MD.w||{}).map(([k,e])=>({lv:k.split('|')[0],en:k.split('|').slice(1).join('|'),...e}));
  F.answered=F.rec.reduce((a,e)=>a+e.s,0);
  F.today=(MD.d||{})[dkey(now)]||{a:0,o:0,l:0};
  F.best=MD.best||0;
  F.acc={};Object.entries(MD.r||{}).forEach(([lv,R])=>{if(R.length>=10)F.acc[lv]=Math.round(R.reduce((a,b)=>a+b,0)/R.length*100)});
  /* days in a row (the record keeps 30 days) */
  const days=MD.d||{};let st=0;const d=new Date(now);if(!has(days,dkey(d)))d.setDate(d.getDate()-1);
  while(has(days,dkey(d))&&st<60){st++;d.setDate(d.getDate()-1)}
  F.streak=st;F.days30=Object.keys(days).length;
  /* lessons */
  F.les=MD.les||{};F.lesAll=typeof LESSONS!=='undefined'?LESSONS:[];
  F.lesN=F.lesAll.filter(l=>F.les[l.id]).length;
  F.moti=window.MOTI?MOTI.rec():null;
  /* grammar */
  F.gram=[];if((typeof GRAMMAR!=='undefined'))['es','jh','hs'].forEach(lv=>GRAMMAR[lv]&&GRAMMAR[lv].notes.forEach((n,i)=>F.gram.push({lv,i,n,own:(ST.gram.owned||[]).includes(n.id),clr:(ST.gram.cleared||[]).includes(n.id)})));
  /* cards */
  F.cards=window.CARDS&&CARDS.book?CARDS.book.filter(c=>CARDS.has(c)):[];
  F.cardsTot=window.CARDS&&CARDS.book?CARDS.book.length:0;
  /* adventure */
  F.adv=window.ADV&&ADV.rec?ADV.rec():null;
  return FC=F}

/* ---------- small helpers ---------- */
const lvOf=F=>H.LV_ORDER.includes(F.lv)?F.lv:'es';
const nextLv=lv=>H.LV_ORDER[H.LV_ORDER.indexOf(lv)+1];
const bookAt=F=>F.bk.filter(b=>b.lv===lvOf(F));
const curBook=F=>{const a=F.bk.filter(b=>(b.pos>0||b.n>0)&&b.n<b.tot);return a.length?a.sort((x,y)=>(y.n+y.pos)-(x.n+x.pos))[0]:null};
const leftWords=b=>b.w.filter(w=>!ST.learned[b.lv+':'+w[0]]);
const lrnWords=b=>b.w.filter(w=>ST.learned[b.lv+':'+w[0]]);
const trackName=id=>typeof TRACKS!=='undefined'&&TRACKS[id]?TRACKS[id].name:id;
const music=()=>CATALOG.music.filter(([id])=>typeof TRACKS!=='undefined'&&TRACKS[id]);
const lesOf=id=>(typeof LESSONS!=='undefined'?LESSONS:[]).find(l=>l.id===id);
const CATN={zu:'図解',kotsu:'覚え方の コツ',yarikata:'勉強の やり方',oto:'音と 発音',hama:'ハマ子の 語呂',kagaku:'学び方の 科学'};
const DOW=['日','月','火','水','木','金','土'],DOW_EN=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const MON_EN=['January','February','March','April','May','June','July','August','September','October','November','December'];
const TIME_SONG={morning:['piano','lofi5','hawaii','piano_hi'],noon:['uke','reggae','steel','samba','lofi3'],evening:['hawaii_s','guitar_y','waltz','guitar'],night:['nocturne','jazz_mid','lofi4','harp','musicbox_w'],late:['musicbox','gymno','lofi4','nocturne']};
const serOf=c=>(CARDS.series.find(s=>s[0]===c.s)||[c.s,'🃏',''])
const rarN=c=>(CARDS.rar[c.r]||{n:''}).n;

/* ---------- the rules: one scene each ---------- */
const R=[
/* ===== 単語帳 ===== */
['x_bookNear',3,F=>{const a=F.bk.filter(b=>b.n>=b.tot*.6&&b.n<b.tot&&b.tot-b.n<=6);if(!a.length)return null;const b=pickL(a);return {book:b.t,left:b.tot-b.n,lvn:LVN[b.lv],_b:b}},v=>goBook(v._b.lv,v._b.bi,true)],
['x_bookDone',2,F=>{const a=F.bk.filter(b=>b.n===b.tot);if(!a.length)return null;const b=pickL(a);return {book:b.t,n:b.tot,lvn:LVN[b.lv],_b:b}},v=>goShelf(v._b.lv)],
['x_bookDoneMany',1,F=>{const n=F.bk.filter(b=>b.n===b.tot).length;return n>=3?{n}:null},()=>goShelf('es')],
['x_bookNext',2,F=>{const a=F.bk.filter(b=>b.n===b.tot);if(!a.length)return null;const b=pickL(a),nx=F.bk.find(x=>x.lv===b.lv&&x.bi>b.bi&&x.n<x.tot);
  return nx?{book:b.t,next:nx.t,_b:nx}:null},v=>goBook(v._b.lv,v._b.bi,true)],
['x_bookMid',3,F=>{const b=curBook(F);return b?{book:b.t,n:b.n,tot:b.tot,left:b.tot-b.n,_b:b}:null},v=>goBook(v._b.lv,v._b.bi,true)],
['x_unknownWord',4,F=>{const b=curBook(F)||pickL(bookAt(F));if(!b)return null;const w=pickL(leftWords(b));return w?{w:w[0],ja:w[1],book:b.t,_b:b}:null},v=>goBook(v._b.lv,v._b.bi,true)],
['x_unknownPair',3,F=>{const b=curBook(F)||pickL(bookAt(F));if(!b)return null;const l=leftWords(b);if(l.length<2)return null;const [a,c]=H.shuffle(l);
  return {w:a[0],ja:a[1],w2:c[0],ja2:c[1],book:b.t,_b:b}},v=>goBook(v._b.lv,v._b.bi,true)],
['x_relatedLearned',4,F=>{const a=F.bk.filter(b=>b.n>0&&b.n<b.tot);if(!a.length)return null;const b=pickL(a),k=pickL(lrnWords(b)),u=pickL(leftWords(b));
  return k&&u?{w:k[0],ja:k[1],w2:u[0],ja2:u[1],book:b.t,_b:b}:null},v=>goBook(v._b.lv,v._b.bi,true)],
['x_relatedWeak',4,F=>{const ww=F.weak.filter(w=>F.word[w.en.toLowerCase()]);if(!ww.length)return null;const w=pickL(ww.slice(0,6)),info=F.word[w.en.toLowerCase()],b=F.bk.find(x=>x.lv===info.lv&&x.bi===info.bi);
  const o=pickL(b.w.filter(x=>x[0]!==w.en));return o?{w:w.en,ja:w.ja||info.ja,w2:o[0],ja2:o[1],book:b.t,_b:b}:null},v=>goBook(v._b.lv,v._b.bi,false)],
['x_levelCount',2,F=>{const lv=lvOf(F),n=F.learned[lv];return n>0?{n,tot:F.lvTot[lv],lvn:LVN[lv],pct:Math.round(n/F.lvTot[lv]*100),_lv:lv}:null},v=>goShelf(v._lv)],
['x_learnedAll',1,F=>{const n=F.learnedAll;if(n<10)return null;const ms=[1000,700,500,300,200,100,50,30,10].find(x=>n>=x);return {n,ms}},()=>goShelf('es')],
['x_noLearned',3,F=>F.learnedAll===0?{}:null,()=>goShelf('es')],
['x_lvBooksHalf',2,F=>{const lv=H.LV_ORDER.find(l=>F.lvTot[l]&&F.learned[l]>=F.lvTot[l]*.5&&nextLv(l)&&F.learned[nextLv(l)]<20);return lv?{lvn:LVN[lv],next:LVN[nextLv(lv)],pct:Math.round(F.learned[lv]/F.lvTot[lv]*100),_lv:nextLv(lv)}:null},v=>goShelf(v._lv)],
['x_freshBook',2,F=>{const a=bookAt(F).filter(b=>b.n===0&&b.pos===0);if(!a.length)return null;const b=pickL(a),w=pickL(b.w);return {book:b.t,w:w[0],ja:w[1],tot:b.tot,_b:b}},v=>goBook(v._b.lv,v._b.bi,false)],
['x_seasonBook',2,F=>{if(!F.sn)return null;const s=F.sn[1],n=s.w.filter(w=>ST.learned['season:'+w[0]]).length;return {season:s.name,ico:s.ico,n,tot:s.w.length,_lv:lvOf(F)}},v=>['📕 季節の 単語帳を ひらく',()=>H.book(v._lv,'season',true)]],
['x_seasonWord',2,F=>{if(!F.sn)return null;const s=F.sn[1],w=pickL(s.w);return {season:s.name,w:w[0],ja:w[1],_lv:lvOf(F)}},v=>['📕 季節の 単語帳を ひらく',()=>H.book(v._lv,'season',false)]],

/* ===== 思い出す 練習（おぼえた ことばを ときどき たずねる） ===== */
['x_wordDay',3,F=>{const a=bookAt(F).filter(b=>b.n<b.tot);if(!a.length)return null;const b=pickL(a),w=pickL(leftWords(b));return {w:w[0],ja:w[1],ico:w[2]||'✨',book:b.t,_b:b}},v=>goBook(v._b.lv,v._b.bi,true)],
['x_recall',4,F=>{const a=F.bk.filter(b=>b.n>0);if(!a.length)return null;const b=pickL(a),w=pickL(lrnWords(b));return {w:w[0],ja:w[1],book:b.t,_lv:b.lv}},v=>goSay(v._lv,v.w)],
['x_spell',2,F=>{const a=F.bk.filter(b=>b.n>0);if(!a.length)return null;const b=pickL(a),w=pickL(lrnWords(b).filter(w=>/^[a-z]{3,}$/i.test(w[0])));return w?{w:w[0],ja:w[1],first:w[0][0],len:w[0].length,_lv:b.lv}:null},v=>goSay(v._lv,v.w)],
['x_weakQuiz',3,F=>{const w=pickL(F.weak.slice(0,6));return w&&w.ja?{w:w.en,ja:w.ja,_lv:w.lv}:null},v=>goSay(v._lv,v.w)],
['x_gramQuiz',3,F=>{const a=F.gram.filter(g=>g.own&&g.n.q&&g.n.q.length);if(!a.length)return null;const g=pickL(a),q=pickL(g.n.q);return {g:g.n.t,q:q[0],o:q[1].join(' / '),a:q[1][q[2]],ja:q[3]||'',_g:g}},v=>goGram(v._g.lv,v._g.i)],
['x_lesQuiz',3,F=>{const a=F.lesAll.filter(l=>F.les[l.id]&&l.quiz&&l.quiz.some(q=>q.o));if(!a.length)return null;const l=pickL(a),q=pickL(l.quiz.filter(q=>q.o));return {t:l.t,q:q.q,a:q.o[q.a],_id:l.id}},v=>goLesson(v._id)],
['x_firstDays',3,F=>F.days30<=2&&F.answered<20?{}:null,null],

/* ===== ラジオの 答え ===== */
['x_slowWord',3,F=>{const a=F.rec.filter(e=>e.slow&&e.k>0&&e.kind!=='s');if(!a.length)return null;const e=pickL(a);return {w:e.en,ja:e.j,_lv:e.lv}},v=>goSay(v._lv,v.w)],
['x_graduated',3,F=>{const a=F.rec.filter(e=>(e.m+(e.n||0))>0&&e.k>=2&&e.kind!=='s');if(!a.length)return null;const e=pickL(a);return {w:e.en,ja:e.j,_lv:e.lv}},v=>goSay(v._lv,v.w)],
['x_skipWord',3,F=>{const a=F.weak.filter(w=>w.n>=2);if(!a.length)return null;const w=a[0];return {w:w.en,ja:w.ja,n:w.n,_lv:w.lv}},v=>goSay(v._lv,v.w)],
['x_weakCount',2,F=>F.weak.length>=4?{n:F.weak.length}:null,()=>['🔁 苦手な ことばを 見る',()=>{MINA.open();setTimeout(()=>{const w=H.panel.querySelector('.mweak');if(w)w.scrollIntoView({behavior:'smooth',block:'center'})},200)}]],
['x_weakNone',1,F=>F.answered>=30&&!F.weak.length?{n:F.answered}:null,null],
['x_accHigh',2,F=>{const a=Object.entries(F.acc).filter(([,v])=>v>=80);if(!a.length)return null;const [lv,acc]=pickL(a);return {lvn:LVN[lv]||(LEVELS[lv]&&LEVELS[lv].name)||lv,acc}},null],
['x_accMid',2,F=>{const a=Object.entries(F.acc).filter(([,v])=>v>=45&&v<70);if(!a.length)return null;const [lv,acc]=pickL(a);return {lvn:LVN[lv]||(LEVELS[lv]&&LEVELS[lv].name)||lv,acc,_lv:lv}},v=>H.LV_ORDER.includes(v._lv)?goShelf(v._lv):null],
['x_todayMany',2,F=>F.today.a>=15?{n:F.today.a,ok:F.today.o}:null,null],
['x_todayLearned',2,F=>F.today.l>=3?{n:F.today.l}:null,null],
['x_todayZero',2,F=>F.today.a===0&&ST.radios.some(r=>r.on)&&F.answered>0?{}:null,null],
['x_best',1,F=>F.best>=5?{n:F.best}:null,null],
['x_answered',1,F=>F.answered>=50?{n:F.answered}:null,null],
['x_sentence',2,F=>{const a=F.rec.filter(e=>e.kind==='s');if(a.length<5)return null;const s=a.reduce((x,e)=>x+e.s,0),m=a.reduce((x,e)=>x+e.m,0);return {n:a.length,acc:Math.round((s-m)/s*100)}},()=>['📚 文法を 見る',()=>H.gramList(lvOf(facts())==='adv'?'hs':lvOf(facts()))]],

/* ===== ラジオ（ショップ） ===== */
['x_radioOwn',2,F=>{const a=ST.radios.filter(r=>LEVELS[r.lv]);if(!a.length)return null;const r=pickL(a);return {radio:LEVELS[r.lv].name,on:r.on?'オン':'オフ'}},null],
['x_radioNone',4,F=>ST.radios.length?null:{},()=>goShop('radio')],
['x_radioOff',2,F=>{const a=ST.radios.filter(r=>!r.on&&LEVELS[r.lv]);return a.length?{radio:LEVELS[pickL(a).lv].name}:null},null],
['x_radioBuy',3,F=>{const k=[...H.LV_ORDER,'star'].find(k=>LEVELS[k]&&!ST.radios.some(r=>r.lv===k));if(!k)return null;const p=LEVELS[k].price;return p&&F.coins>=p?{radio:LEVELS[k].name,price:p}:null},()=>goShop('radio')],
['x_radioSave',2,F=>{const k=H.LV_ORDER.find(k=>!ST.radios.some(r=>r.lv===k));if(!k)return null;const p=LEVELS[k].price;return F.coins<p?{radio:LEVELS[k].name,price:p,left:p-F.coins}:null},()=>goShop('radio')],
['x_radioAll',1,F=>[...H.LV_ORDER,'star'].every(k=>!LEVELS[k]||ST.radios.some(r=>r.lv===k))?{n:ST.radios.length}:null,null],
['x_starOwn',2,F=>ST.radios.some(r=>r.lv==='star')&&F.sky==='night'?{}:null,null],
['x_starBuy',2,F=>LEVELS.star&&!ST.radios.some(r=>r.lv==='star')&&F.coins>=LEVELS.star.price?{price:LEVELS.star.price}:null,()=>goShop('radio')],

/* ===== 音楽（ショップ） ===== */
['x_songOwn',2,F=>{const a=ST.music.filter(id=>typeof TRACKS!=='undefined'&&TRACKS[id]);if(!a.length)return null;const id=pickL(a);return {song:trackName(id),_id:id}},v=>['🎵 ながす',()=>{H.playTrack(v._id);H.home()}]],
['x_songPlaying',3,F=>{const id=H.playing;return id?{song:trackName(id)}:null},null],
['x_songNone',2,F=>{if(ST.music.length)return null;const c=music().sort((a,b)=>a[1]-b[1])[0];return c&&F.coins>=c[1]?{song:trackName(c[0]),price:c[1],d:c[3]}:null},()=>goShop('music')],
['x_songNext',2,F=>{const a=music().filter(([id,p,,,rare])=>!rare&&!ST.music.includes(id)&&p<=F.coins);if(!a.length)return null;const c=pickL(a);return {song:trackName(c[0]),price:c[1],d:c[3]}},()=>goShop('music')],
['x_songMany',1,F=>ST.music.length>=5?{n:ST.music.length,tot:music().length}:null,()=>goShop('music')],
['x_songTimeOwn',2,F=>{const id=pickL(TIME_SONG[F.part].filter(id=>ST.music.includes(id)&&typeof TRACKS!=='undefined'&&TRACKS[id]));return id?{song:trackName(id),_id:id}:null},v=>['🎵 ながす',()=>{H.playTrack(v._id);H.home()}]],
['x_songTimeShop',1,F=>{const id=pickL(TIME_SONG[F.part].filter(id=>!ST.music.includes(id)&&typeof TRACKS!=='undefined'&&TRACKS[id]));return id?{song:trackName(id)}:null},()=>goShop('music')],
['x_songRare',1,F=>ST.music.includes('orch')?{song:trackName('orch')}:null,v=>['🎵 ながす',()=>{H.playTrack('orch');H.home()}]],

['x_eventShop',1,F=>{const a=CATALOG.event.filter(e=>!e.rare&&H.onSale(e)&&e.p<=F.coins);if(!a.length)return null;const e=pickL(a);return {ico:e.ico,ev:e.n,price:e.p,d:e.d}},()=>goShop('event')],

/* ===== 文法ノート ===== */
['x_gramUnread',3,F=>{const a=F.gram.filter(g=>g.own&&!g.clr);if(!a.length)return null;const g=pickL(a);return {g:g.n.t,_g:g}},v=>goGram(v._g.lv,v._g.i)],
['x_gramCount',1,F=>{const n=F.gram.filter(g=>g.clr).length;return n?{n,tot:F.gram.length}:null},()=>['📚 文法を 見る',()=>H.gramList()]],
['x_gramBuy',2,F=>{const lv=lvOf(F)==='adv'?'hs':lvOf(F),g=F.gram.find(g=>g.lv===lv&&!g.own);return g&&F.coins>=GRAMMAR[lv].price?{g:g.n.t,price:GRAMMAR[lv].price,lvn:LVN[lv],_g:g}:null},v=>['🛍️ 文法ノートを 見る',()=>H.gramShop(v._g.lv)]],
['x_gramNone',3,F=>F.gram.some(g=>g.own)?null:{},()=>['🛍️ 文法ノートを 見る',()=>H.gramShop('es')]],
['x_gramRule',3,F=>{const a=F.gram.filter(g=>g.own&&g.n.r&&g.n.r.length);if(!a.length)return null;const g=pickL(a);return {g:g.n.t,r:pickL(g.n.r),_g:g}},v=>goGram(v._g.lv,v._g.i)],
['x_gramEx',3,F=>{const a=F.gram.filter(g=>g.own&&g.n.ex&&g.n.ex.length);if(!a.length)return null;const g=pickL(a),e=pickL(g.n.ex);return {g:g.n.t,en:e[0],ja:e[1],_g:g}},v=>['🔊 きいてみる',()=>H.say('gram',v.en)]],
['x_gramPeek',2,F=>{const a=F.gram.filter(g=>!g.own&&g.lv===(lvOf(F)==='adv'?'hs':lvOf(F))&&g.n.ex&&g.n.ex.length);if(!a.length)return null;const g=pickL(a),e=g.n.ex[0];return {g:g.n.t,en:e[0],ja:e[1],_g:g}},v=>goGram(v._g.lv,v._g.i)],

/* ===== 文法テスト と 授業の つながり（game/gram-link.js） ===== */
['x_gramLes',4,F=>{if(!window.GRAMLINK)return null;const G=MINA.rec().g||{};const a=Object.entries(G).filter(([,e])=>e.m>0&&(e.k||0)<3).map(([id,e])=>({id,e,L:GRAMLINK.lessonsFor(id).filter(l=>!F.les[l.id])})).filter(x=>x.L.length);
  if(!a.length)return null;const x=pickL(a);return {g:x.e.title,t:x.L[0].t,_id:x.L[0].id}},v=>goLesson(v._id)],
['x_lesGram',3,F=>{if(!window.GRAMLINK)return null;const a=F.lesAll.filter(l=>F.les[l.id]).map(l=>({l,g:GRAMLINK.notesFor(l.id).find(g=>(ST.gram.owned||[]).includes(g.n.id)&&!(ST.gram.cleared||[]).includes(g.n.id))})).filter(x=>x.g);
  if(!a.length)return null;const x=pickL(a);return {t:x.l.t,g:x.g.n.t,_g:x.g}},v=>['✏️ 文法テストで ためす',()=>GRAMLINK.tryTest(v._g)]],
['x_lesGramShop',2,F=>{if(!window.GRAMLINK)return null;const a=F.lesAll.filter(l=>F.les[l.id]).map(l=>({l,g:GRAMLINK.notesFor(l.id).find(g=>!(ST.gram.owned||[]).includes(g.n.id))})).filter(x=>x.g&&F.coins>=GRAMMAR[x.g.lv].price);
  if(!a.length)return null;const x=pickL(a);return {t:x.l.t,g:x.g.n.t,price:GRAMMAR[x.g.lv].price,_g:x.g}},v=>['🛍️ 文法ノートを 見る',()=>H.gramShop(v._g.lv)]],
['x_gramLesBoth',2,F=>{if(!window.GRAMLINK)return null;const a=F.gram.filter(g=>g.clr).map(g=>({g,l:GRAMLINK.lessonsFor(g.n.id).find(l=>F.les[l.id])})).filter(x=>x.l);
  if(!a.length)return null;const x=pickL(a);return {g:x.g.n.t,t:x.l.t,n:a.length,_g:x.g}},v=>goGram(v._g.lv,v._g.i)],
['x_gramLesPeek',2,F=>{if(!window.GRAMLINK)return null;const a=F.gram.filter(g=>g.own&&!g.clr&&!(MINA.rec().g||{})[g.n.id]).map(g=>({g,l:GRAMLINK.lessonsFor(g.n.id).find(l=>!F.les[l.id])})).filter(x=>x.l);
  if(!a.length)return null;const x=pickL(a);return {g:x.g.n.t,t:x.l.t,_id:x.l.id}},v=>goLesson(v._id)],

/* ===== ミニ授業 ===== */
['x_lesCount',1,F=>F.lesN?{n:F.lesN,tot:F.lesAll.length}:null,()=>['📖 授業を 見る',()=>LESSON.list()]],
['x_lesLevel',2,F=>{const lv=lvOf(F),a=F.lesAll.filter(l=>l.lv===lv),n=a.filter(l=>F.les[l.id]).length;if(!a.length||n===a.length)return null;const nx=pickL(a.filter(l=>!F.les[l.id]));
  return {n,tot:a.length,lvn:LVN[lv],t:nx.t,_id:nx.id}},v=>goLesson(v._id)],
['x_lesCat',2,F=>{const cats=Object.keys(CATN).filter(c=>F.lesAll.some(l=>l.cat===c&&!F.les[l.id]));if(!cats.length)return null;const c=pickL(cats),l=pickL(F.lesAll.filter(x=>x.cat===c&&!F.les[x.id]));
  return {cat:CATN[c],t:l.t,_id:l.id}},v=>goLesson(v._id)],
['x_lesNone',4,F=>F.lesN?null:(()=>{const l=F.lesAll.find(x=>x.lv===lvOf(F))||F.lesAll[0];return l?{t:l.t,_id:l.id}:null})(),v=>goLesson(v._id)],
['x_lesRecent',2,F=>{const ct=F.moti&&F.moti.qz&&F.moti.qz.ct||{};const a=Object.entries(ct).filter(([id])=>lesOf(id)).sort((x,y)=>y[1]-x[1]);if(!a.length)return null;const l=lesOf(a[0][0]);return {t:l.t,_id:l.id}},v=>goLesson(v._id)],
['x_lesKey',2,F=>{const a=F.lesAll.filter(l=>!F.les[l.id]&&l.key&&l.key.length&&l.lv===lvOf(F));if(!a.length)return null;const l=pickL(a);return {t:l.t,key:pickL(l.key),_id:l.id}},v=>goLesson(v._id)],
['x_lesLvDone',2,F=>{const lv=H.LV_ORDER.find(lv=>{const a=F.lesAll.filter(l=>l.lv===lv);return a.length&&a.every(l=>F.les[l.id])});if(!lv)return null;const nx=F.lesAll.find(l=>!F.les[l.id]);return nx?{lvn:LVN[lv],t:nx.t,_id:nx.id}:null},v=>goLesson(v._id)],
['x_lesNew',3,F=>{if(typeof LESSON_NEW==='undefined')return null;const a=LESSON_NEW.map(lesOf).filter(l=>l&&!F.les[l.id]);if(!a.length)return null;const l=pickL(a);return {t:l.t,n:a.length,_id:l.id}},v=>goLesson(v._id)],
['x_tipDone',2,F=>{const a=F.lesAll.filter(l=>l.tip&&F.les[l.id]);if(!a.length)return null;const l=pickL(a);return {t:l.t,tip:l.tip,_id:l.id}},v=>goLesson(v._id)],
['x_tipNew',2,F=>{const lv=lvOf(F);let a=F.lesAll.filter(l=>l.tip&&!F.les[l.id]&&l.lv===lv);if(!a.length)a=F.lesAll.filter(l=>l.tip&&!F.les[l.id]);if(!a.length)return null;const l=pickL(a);return {t:l.t,tip:l.tip,_id:l.id}},v=>goLesson(v._id)],
['x_tipSleep',2,F=>{if(F.part!=='night'&&F.part!=='late')return null;const l=lesOf('es-sleep');return l?{t:l.t,_id:l.id}:null},v=>goLesson(v._id)],
['x_tipMorning',2,F=>{if(F.part!=='morning')return null;const l=lesOf('adv-if-then');return l?{t:l.t,_id:l.id}:null},v=>goLesson(v._id)],
['x_tipMiss',2,F=>{if(!window.REVIEW||!REVIEW.missN||!REVIEW.missN())return null;const l=lesOf(pickL(['jh-mistake-note','adv-guess-first','jh-test-effect']));return l?{t:l.t,n:REVIEW.missN(),_id:l.id}:null},v=>goLesson(v._id)],
['x_tipWeekend',2,F=>{if(F.dow!==0&&F.dow!==6)return null;const a=['adv-speech','hs-opinion-prep','adv-subtitles','jh-directions','adv-retelling'].map(lesOf).filter(Boolean);if(!a.length)return null;const l=pickL(a);return {t:l.t,_id:l.id}},v=>goLesson(v._id)],
['x_oops',3,F=>{if(typeof LESSON_OOPS==='undefined')return null;const a=LESSON_OOPS.filter(o=>lesOf(o[2]));if(!a.length)return null;const o=pickL(a),l=lesOf(o[2]);return {bad:o[0],good:o[1],t:l.t,_id:l.id}},v=>goLesson(v._id)],
['x_rvToday',3,F=>{const n=window.REVIEW?REVIEW.todayN():0;return n>0?{n}:null},()=>['📚 ふくしゅうを はじめる',()=>REVIEW.drill('today',H.home)]],
['x_rvMiss',3,F=>{const n=window.REVIEW?REVIEW.missN():0;return n>0?{n}:null},()=>['📒 まちがいノートを ひらく',()=>REVIEW.drill('miss',back)]],
['x_rvStar',1,F=>{if(!window.REVIEW)return null;const a=Object.keys(F.les).filter(id=>lesOf(id)&&REVIEW.stars(id)>=3);if(!a.length)return null;const id=pickL(a);return {t:lesOf(id).t,n:REVIEW.stars(id)}},()=>['📚 ふくしゅう リストを 見る',()=>REVIEW.list()]],
['x_rvDue',2,F=>{if(!window.REVIEW||!REVIEW.dueIds)return null;const a=REVIEW.dueIds();if(!a.length)return null;const id=pickL(a);return {t:lesOf(id).t,_id:id}},v=>goLesson(v._id)],

/* ===== スタンプ・なかよし度・ハマ子 ===== */
['x_stamp',2,F=>{if(!F.moti)return null;const n=F.moti.st.n||0,nx=[5,10,20,30,40,50,60,80,100].find(x=>x>n)||n+20;
  return {n,left:nx-n,prize:nx%20===0?'浜辺の 大きな ショー':nx%10===0?'宝箱くじ':'コイン'}},()=>['📖 授業を 見る',()=>LESSON.list()]],
['x_nk',2,F=>{if(!F.moti||!MOTI.nkName||!MOTI.nkNeed())return null;const lv=F.moti.nk.lv;return {lv,name:MOTI.nkName(),need:MOTI.nkNeed()}},null],
['x_nkHigh',2,F=>F.moti&&F.moti.nk.lv>=5?{lv:F.moti.nk.lv,name:MOTI.nkName()}:null,null],
['x_hamaCh',2,F=>F.moti&&F.moti.hc&&F.moti.hc.d===dkey(F.now)&&!F.moti.hc.done&&lesOf(F.moti.hc.id)?{t:lesOf(F.moti.hc.id).t,_id:F.moti.hc.id}:null,v=>goLesson(v._id)],

/* ===== カード ===== */
['x_cardOwn',3,F=>{if(!F.cards.length)return null;const c=pickL(F.cards);return {en:c.en,ja:c.ja,ico:c.e,rar:rarN(c),ser:serOf(c)[2],_s:c.s}},v=>goCards(v._s)],
['x_cardRare',2,F=>{const a=F.cards.filter(c=>c.r>=3);if(!a.length)return null;const top=Math.max(...a.map(c=>c.r)),c=pickL(a.filter(x=>x.r===top));return {en:c.en,ja:c.ja,ico:c.e,rar:rarN(c),_s:c.s}},v=>goCards(v._s)],
['x_cardCount',1,F=>F.cards.length?{n:F.cards.length,tot:F.cardsTot,pct:Math.round(F.cards.length/F.cardsTot*100)}:null,()=>goCards()],
['x_cardSeries',2,F=>{if(!F.cards.length)return null;const a=CARDS.series.map(s=>{const all=CARDS.book.filter(c=>c.s===s[0]);return {s,n:all.filter(c=>CARDS.has(c)).length,tot:all.length}}).filter(x=>x.n>0&&x.n<x.tot);
  if(!a.length)return null;const x=a.sort((p,q)=>q.n/q.tot-p.n/p.tot)[0];return {ser:x.s[2],ico:x.s[1],n:x.n,tot:x.tot,left:x.tot-x.n,_s:x.s[0]}},v=>goCards(v._s)],
['x_cardFree',3,F=>window.CARDS&&CARDS.freeOk()?{}:null,()=>goCards()],
['x_cardWord',4,F=>{const a=F.cards.filter(c=>{const w=F.word[c.en.toLowerCase()];return w&&!ST.learned[w.lv+':'+w.en]});if(!a.length)return null;const c=pickL(a),w=F.word[c.en.toLowerCase()];
  return {en:c.en,ja:c.ja,ico:c.e,book:w.t,lvn:LVN[w.lv],_w:w}},v=>goBook(v._w.lv,v._w.bi,false)],
['x_cardLearned',2,F=>{const a=F.cards.filter(c=>{const w=F.word[c.en.toLowerCase()];return w&&ST.learned[w.lv+':'+w.en]});if(!a.length)return null;const c=pickL(a);return {en:c.en,ja:c.ja,ico:c.e,_s:c.s}},v=>goCards(v._s)],
['x_cardNone',3,F=>F.cards.length?null:{},()=>goCards()],
['x_cardDup',1,F=>{const a=F.cards.filter(c=>CARDS.n(c)>=3);if(!a.length)return null;const c=pickL(a);return {en:c.en,ico:c.e,n:CARDS.n(c)}},()=>goCards()],
['x_cardShards',1,F=>{const s=window.CARDS&&CARDS.shards?CARDS.shards():0;return s>=15?{n:s}:null},()=>goCards()],
['x_lesCards',2,F=>{if(!window.CARDS||!CARDS.lesCount)return null;const [n,t]=CARDS.lesCount();return n?{n,tot:t}:null},()=>['🃏 授業カードを 見る',()=>CARDS.openLes()]],
['x_cardTeach',2,F=>{const a=F.cards.filter(c=>/^[a-z ]+$/i.test(c.en));if(!a.length)return null;const c=pickL(a);return {en:c.en,ja:c.ja,ico:c.e,first:c.en[0].toUpperCase(),len:c.en.replace(/ /g,'').length,_s:c.s}},v=>goCards(v._s)],

/* ===== コイン ===== */
['x_coinRich',2,F=>F.coins>=500?{c:F.coins}:null,()=>goShop('music')],
['x_coinPoor',2,F=>F.coins<30?{c:F.coins}:null,null],
['x_coinMid',1,F=>F.coins>=30&&F.coins<500?{c:F.coins}:null,null],
['x_coinCard',2,F=>F.coins>=80&&F.coins<720?{c:F.coins}:null,()=>goCards()],
['x_coinTen',2,F=>F.coins>=720?{c:F.coins}:null,()=>goCards()],

/* ===== 宝の地図 ===== */
['x_advNone',2,F=>F.adv&&!F.adv.done.length&&!F.adv.laps?{}:null,()=>['🗺️ 宝の地図を ひらく',()=>ADV.open()]],
['x_advMap',2,F=>{if(!F.adv||!F.adv.done.length)return null;const m=ADV.maps[F.adv.map];return m?{map:m.name,n:F.adv.done.length}:null},()=>['🗺️ 宝の地図を ひらく',()=>ADV.open()]],
['x_advTitle',1,F=>F.adv&&F.adv.titles.length?{title:pickL(F.adv.titles)}:null,null],
['x_advItem',1,F=>{if(!F.adv||!ADV.items)return null;const a=Object.entries(F.adv.items).filter(([,n])=>n>0);if(!a.length)return null;const [k,n]=pickL(a);return {item:ADV.items[k].name,ico:ADV.items[k].ico,n}},()=>['🗺️ 宝の地図を ひらく',()=>ADV.open()]],

/* ===== 浜辺の 会話（game/kaiwa.js） ===== */
['x_kwNone',4,F=>window.KAIWA&&!KAIWA.rec().n?{}:null,()=>goKaiwa()],
['x_kwChar',2,F=>{if(!window.KAIWA)return null;const i=LVI(lvOf(F)),a=KAIWA.scenes.filter(s=>LVI(s.lv)<=i+1&&!KAIWA.rec().heart[s.c]);if(!a.length)return null;const s=pickL(a),c=KAIWA.chars[s.c];return {c:c.n,ico:c.ico,t:s.t,_id:s.id}},v=>goTalk(v._id)],
['x_kwLv',3,F=>{if(!window.KAIWA||!KAIWA.rec().n)return null;const a=KAIWA.scenes.filter(s=>s.lv===lvOf(F)&&!KAIWA.rec().done[s.id]);if(!a.length)return null;const s=pickL(a);return {t:s.t,c:KAIWA.chars[s.c].n,lvn:LVN[s.lv],_id:s.id}},v=>goTalk(v._id)],
['x_kwNext',2,F=>{if(!window.KAIWA)return null;const lv=lvOf(F),a=KAIWA.scenes.filter(s=>s.lv===lv),nx=H.LV_ORDER[H.LV_ORDER.indexOf(lv)+1];if(!a.length||!nx||!a.every(s=>KAIWA.rec().done[s.id]))return null;const b=KAIWA.scenes.find(s=>s.lv===nx&&!KAIWA.rec().done[s.id]);return b?{lvn:LVN[lv],_id:b.id}:null},v=>goTalk(v._id)],
['x_kwFun',2,F=>{if(!window.KAIWA||!KAIWA.funN())return null;const k=Object.keys(KAIWA.rec().fun),s=KAIWA.scenes.find(x=>x.id===k[k.length-1].split(':')[0]);return {n:KAIWA.funN(),tot:KAIWA.funTotal(),c:s?KAIWA.chars[s.c].n:'みんな'}},()=>goKaiwa()],
['x_kwFriend',2,F=>{if(!window.KAIWA)return null;const h=KAIWA.rec().heart,top=Object.keys(h).sort((a,b)=>h[b]-h[a])[0];if(!top||h[top]<2)return null;const s=pickL(KAIWA.scenes.filter(x=>x.c===top));return {c:KAIWA.chars[top].n,n:h[top],_id:s.id}},v=>goTalk(v._id)],
['x_kwFree',2,F=>window.KAIWA&&KAIWA.rec().n>=2&&KAIWA.rec().free<3?{}:null,()=>goKaiwa()],
['x_kwAsk',1,F=>window.KAIWA&&KAIWA.rec().n>=1?{_id:'es-gen-time'}:null,v=>goTalk(v._id)],
['x_kwBack',3,F=>{if(!window.KAIWA)return null;const R=KAIWA.rec();if(!R.n||!R.last)return null;const d=Math.floor((Date.now()-R.last)/864e5);if(d<3)return null;const h=R.heart,top=Object.keys(h).sort((a,b)=>h[b]-h[a])[0];return {d,c:top?KAIWA.chars[top].n:'ソラ'}},()=>goKaiwa()],
['x_kwTime',1,F=>window.KAIWA&&LVI(lvOf(F))<=1?{h:F.h,_id:'es-gen-time'}:null,v=>goTalk(v._id)],

/* ===== 日にち・時間 ===== */
['x_streak',3,F=>F.streak>=2?{n:F.streak}:null,null],
['x_days30',1,F=>F.days30>=5?{n:F.days30}:null,null],
['x_dow',2,F=>({dow:DOW[F.dow],en:DOW_EN[F.dow]}),null],
[F=>'x_dow'+F.dow,2,F=>({dow:DOW[F.dow],en:DOW_EN[F.dow]}),null],
['x_month',2,F=>({m:F.m,en:MON_EN[F.m-1]}),null],
[F=>'x_m'+F.m,3,F=>({m:F.m,en:MON_EN[F.m-1]}),null],
[F=>'x_part_'+F.part,3,F=>({}),null],
[F=>'x_beach_'+F.sky,2,F=>({}),null],
['x_lvNow',2,F=>({lvn:LVN[lvOf(F)],_lv:lvOf(F)}),v=>goShelf(v._lv)],
];
/* a rule's key may depend on now (day of the week, month, time of day) */
const keyOf=(r,F)=>typeof r[0]==='function'?r[0](F):r[0];

/* ---------- choosing ---------- */
const recent=[];
/* every scene that fits now: [key, values, null, go] like ミナ先生's advice */
function all(){const F=facts(),out=[];
  R.forEach(r=>{const k=keyOf(r,F);if(!MINA_LINES[k]||!MINA_LINES[k].length)return;let v=null;try{v=r[2](F)}catch(e){console.error(k,e)}
    if(!v)return;let go=null;try{go=r[3]?r[3](v):null}catch(e){}out.push([k,v,null,go,r[1]])});return out}
/* one scene, weighted, not one of the last 8 */
function pick(){const a=all(),c=a.filter(o=>!recent.includes(o[0])),L=c.length?c:a;if(!L.length)return null;
  let t=L.reduce((s,o)=>s+o[4],0)*Math.random(),o=L[0];for(const x of L){t-=x[4];if(t<=0){o=x;break}}
  recent.push(o[0]);if(recent.length>8)recent.shift();return o}
/* how many different lines she has for scenes (for the curious) */
const size=()=>Object.keys(MINA_LINES).filter(k=>k.startsWith('x_')).reduce((a,k)=>a+MINA_LINES[k].length,0);

window.MINA_SENSE={facts,all,pick,size,_rules:R,_reset:()=>{FC=null}};
})();
