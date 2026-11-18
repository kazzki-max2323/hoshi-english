/* ミナ先生が「さっき したこと」「いま 起きている こと」「もっている 物」に 反応する しくみ
   - きろくは 共通の RECENT（game/recent.js）。 ミナ先生は 'mina' の しるしで 読む（ミオとは べつ）
   - ホームに もどった とき: まだ 反応していない できごとに ひとこと（いくつも あれば「いろいろ やってきたね」→ さいごの こと）
     わたしが すすめた ことを すぐ やったら「やってくれたんだ！」が 先に つく
   - ホームに いる とき: 浜辺の イベント・動物・流れ星・空の 色・ラジオに その場で 反応（帯は 出さないので セリフで）
   - ミナ先生の ページを ひらいた とき: 最初の ひとことが さっきの ことへの 反応に なる
   - ひさしぶりに ひらいた とき: 「この前は 〜したよね」
   - もっている 食べ物・プレゼント・体力・リク・食堂・鉱山 などの 場面を MINA_SENSE に 足す
   セリフは game/mina-react-data.js（MINA_REACT_LINES） */
(()=>{
const {S:ST}=BEACH;
const H=HE,$=id=>document.getElementById(id);
const R=()=>window.RECENT;
const pickL=a=>a[Math.random()*a.length|0];
const has=k=>MINA_LINES[k]&&MINA_LINES[k].length;
const MIN=60000;
const ACT=['lesson','review','tokkun','sensei','deep','kaiwa','tutor','meal','snack','zbuy','zsell','bottle','map','treasure','gift','mine','pack','book','meteor','mio','sell','buyin'];
const LES=id=>(typeof LESSONS!=='undefined'?LESSONS:[]).find(l=>l.id===id);
const back=()=>MINA.open();
const kwName=c=>{try{return KAIWA.chars[c].n}catch(e){return c||''}};
const kwTitle=id=>{try{return KAIWA.scenes.find(s=>s.id===id).t}catch(e){return ''}};
const cardEn=id=>{try{const I=CG.info(id);return String(I.en||'').split(',')[0].trim()}catch(e){return ''}};
const zItem=id=>{try{return ZAKKA.items.find(i=>i.id===id)}catch(e){return null}};
const gq=g=>g?'「'+g+'」':'きょうの 文法';

/* はじめて クリアした 授業（game/lesson.js の LESSON_AFTER が 教えてくれる） */
const firstLes={};window.LESSON_AFTER=window.LESSON_AFTER||[];LESSON_AFTER.push((l,info)=>{if(info&&info.first)firstLes[l.id]=1;return null});
/* ---------- できごと → [セリフの キー, うめる値, タップで 行く 先] ---------- */
function react(e){const v={};let k=null,go=null;
  switch(e.k){
  case 'lesson':{const l=LES(e.id)||{},n=(l.quiz||[]).length||5,miss=e.miss|0;Object.assign(v,{t:e.ja||l.t||'',n,ok:Math.max(0,n-miss)});
    const many=R().count('lesson',60*MIN),same=R().list(30*864e5,'lesson').filter(x=>x.id===e.id).length;
    k=many>=3?'r_les_many':same>=2&&Math.random()<.4?'r_les_again':firstLes[e.id]&&Math.random()<.5?'r_les_first':miss?'r_les_miss':'r_les_perfect';if(k==='r_les_many')v.n=many;
    if(miss&&window.LESSON)go=['🔁 もう一度',()=>LESSON.open(e.id,back)];break}
  case 'review':Object.assign(v,{n:e.n,ok:e.ok});k=e.all?'r_rv_all':'r_rv_miss';break;
  case 'tokkun':v.g=gq(e.g);k=e.perfect?'r_tok_perfect':e.miss?'r_tok_miss':e.hint?'r_tok_hint':'r_tok_perfect';
    if(e.miss&&window.SENSEI)go=['🎯 もう一回',()=>SENSEI.tokkun(null,0,'mina')];break;
  case 'sensei':Object.assign(v,{t:e.ja||'',end:e.end||'',g:gq(e.g)});k=!e.good?'r_sn_fun':e.miss&&Math.random()<.5?'r_sn_miss':'r_sn_good';break;
  case 'deep':v.g=gq(e.g);k=e.stars>=3?'r_dp_3':e.stars===2?'r_dp_2':'r_dp_1';
    if(e.stars<3&&window.DEEP)go=['✏️ もう一回 たしかめる',()=>DEEP.open(e.id,{chk:1})];break;
  case 'kaiwa':Object.assign(v,{c:kwName(e.c),t:kwTitle(e.id)});k=e.good?'r_kw_good':'r_kw_fun';break;
  case 'tutor':{const D={quiz:'r_tu_quiz',ken:'r_tu_ken',hw:'r_tu_hw',short:'r_tu_short',pochi:'r_tu_pochi'};Object.assign(v,{t:e.t||'英語',tot:e.tot||0});
    k=D[e.day]&&Math.random()<.6?D[e.day]:e.tot&&e.ok===e.tot&&Math.random()<.5?'r_tu_perfect':e.fun&&Math.random()<.3?'r_tu_fun':'r_tu';break}
  case 'meal':{Object.assign(v,{n:e.ja,en:e.en,c:e.c||''});let n=0;try{n=FOOD.rec().eaten[e.id]|0}catch(er){}k=n<=1&&Math.random()<.6?'r_dn_first':'r_dn';break}
  case 'snack':Object.assign(v,{n:e.ja,en:e.en||e.ja});k='r_eat';break;
  case 'zbuy':{Object.assign(v,{n:e.ja,ico:e.ico||''});const it=zItem(e.id),kd=e.kind||'';
    k=it&&(it.lux||it.p>=1000)?'r_zk_lux':kd==='food'?'r_zk_food':kd==='music'?(e.now?'r_zk_musicNow':'r_zk_music'):kd==='radio'?'r_zk_radio':kd==='event'?'r_zk_event':kd==='gift'?'r_zk_gift':'r_zk_buy';break}
  case 'zsell':v.n=e.kind==='music'&&e.tn?e.tn:e.ja;k=e.ret?'r_zk_refund':e.kind==='music'?'r_zk_sellRec':'r_zk_sell';break;
  case 'bottle':{v.from=e.from||'だれか';let L=null;try{L=BOTTLE.letters.find(l=>l[2]===e.from)}catch(er){}if(L){v.w=L[3];v.ja=L[4]}
    k=pickL(L?['r_bt','r_bt','r_bt_w']:['r_bt']);break}
  case 'map':v.name=e.ja;k='r_map';if(window.ADV)go=['🗺️ 宝探しに 行く',()=>ADV.open()];break;
  case 'treasure':v.name=e.ja;k='r_tre';break;
  case 'gift':Object.assign(v,{who:e.toN||'',n:e.ja});k=e.to==='mina'?'r_gf_mina':e.tier>=2?'r_gf_good':'r_gf_meh';break;
  case 'mine':{Object.assign(v,{depth:e.depth|0,q:e.q|0,ok:e.ok|0});const cs=(e.cards||[]).map(cardEn).filter(Boolean);
    k=e.hp==='hp'&&Math.random()<.6?'r_mn_tired':e.depth>=20&&e.depth>(e.best|0)?'r_mn_deep':e.rare?'r_mn_rare':cs.length&&Math.random()<.5?'r_mn_card':'r_mn';if(cs.length)v.card=pickL(cs);
    if(k==='r_mn_card'&&!v.card)k='r_mn';
    if((e.fl|0)>=3&&(e.fl|0)>(e.bestF|0)&&Math.random()<.7){k='r_mn_floor';v.f=e.fl|0}else if(e.story&&k==='r_mn'&&Math.random()<.4)k='r_mn_story';
    /* 📦 宝箱・悪い できごと・🎒 つかった 物・🔀 入れかえ（game/mine.js） */
    if(k==='r_mn'||k==='r_mn_card'){const x=Math.random();if(e.chest&&x<.5)k='r_mn_chest';else if(e.bad&&x<.75)k='r_mn_bad';else if(e.used&&e.used.length&&x<.9){k='r_mn_item';v.ico=e.used.join('')}else if(e.swap&&x<.95)k='r_mn_swap'}
    break}
  case 'pack':Object.assign(v,{p:e.p||'カード',ico:e.ico||'📦',w:e.en||'',n:e.n||1});k='r_pk';break;
  case 'book':Object.assign(v,{en:e.en,ja:e.ja});k=e.en?'r_book':null;break;
  case 'sell':Object.assign(v,{en:e.en,p:e.p|0});k=e.by==='mio'?'r_sell_mio':'r_sell';break;
  case 'buyin':Object.assign(v,{en:e.en,ja:e.ja||'',p:e.p|0});k=e.by==='mio'?'r_buyin_mio':e.isNew&&Math.random()<.6?'r_buyin_new':'r_buyin';break;
  case 'mio':k=e.how==='study'?'r_mio_study':e.kind==='radio'?'r_mio_radio':'r_mio';break;
  case 'meteor':v.c=e.coins|0;k=e.gold?'r_met_gold':'r_met';break;
  case 'bev':{const id=e.name||'';if(e.cat==='show'&&/^f|fw|senko/.test(id))k='r_show_fw';else if(has('r_ev_'+id))k='r_ev_'+id;
    else{v.msg=(window.MINA_EV_MSG&&MINA_EV_MSG[id])||((e.ico||'')+' '+(e.ja||''));k=e.cat==='show'?'r_show_any':'r_ev_any'}break}
  case 'visit':{const id=e.name||'';if(has('r_vis_'+id))k='r_vis_'+id;else{v.msg=(window.MINA_EV_MSG&&MINA_EV_MSG[id])||'';k=v.msg?'r_vis_any':null}break}
  case 'sky':k='r_sky_'+e.to;break;
  case 'radio':k=e.on?'r_radio_on':'r_radio_off';break}
  return k&&has(k)?[k,v,go]:null}

/* ---------- できごとを みじかく（「この前は 〜よね」「〜・〜… いそがしいね」） ---------- */
function desc(e){try{switch(e.k){
  case 'lesson':return `授業「${e.ja||(LES(e.id)||{}).t||''}」を やった`;case 'review':return 'ふくしゅうを した';case 'tokkun':return '苦手 とっくんを した';
  case 'sensei':return 'わたしと 英語で 話した';case 'deep':return 'とことん授業を した';case 'kaiwa':return `${kwName(e.c)}と 話した`;
  case 'tutor':return 'リクくんに 英語を 教えた';case 'meal':return `食堂で ${e.ja}を 食べた`;case 'snack':return `${e.ja}を 食べた`;
  case 'zbuy':return `雑貨屋で ${e.ja}を 買った`;case 'zsell':return '雑貨屋で 売り買い した';case 'bottle':return 'ボトルメールを 読んだ';
  case 'map':return '宝の地図を 見つけた';case 'treasure':return '宝箱を あけた';case 'gift':return `${e.toN||'だれか'}に プレゼントした`;
  case 'mine':return `鉱山で ${e.depth|0}m まで ほった`;case 'pack':return '勉強で とどいた カードを 見た';
  case 'book':return 'カードブックに カードを 入れた';case 'sell':return 'お店で カードを 売った';case 'buyin':return 'お店で カードを 買い取った';case 'mio':return 'ミオちゃんと 話した';case 'meteor':return '流れ星を つかまえた'}}catch(er){}return ''}
const descList=a=>a.map(desc).filter(Boolean);

/* ---------- わたしが すすめた こと（タップされた ボタン）→ その すぐあとの できごと ---------- */
const SUG=[[/授業を ひらく|授業を 見る|もう一度|つぎの 授業/,['lesson']],[/とっくん|5問/,['tokkun']],[/とことん|たしかめ|くわしく/,['deep']],[/先生と 話す|もう一度 話す|🗣️/,['sensei']],
  [/💬/,['kaiwa']],[/ふくしゅう|まちがいノート/,['review','lesson']],[/宝探し/,['treasure','map']],[/雑貨屋/,['zbuy','zsell']],[/カードショップ|お店/,['pack','mine','book','sell','buyin']],[/食堂/,['meal']],[/食べる/,['snack']]];
function sugFor(e){const s=MINA.rec().sug;if(!s||e.t<s.t||e.t-s.t>40*MIN)return false;const m=SUG.find(([re])=>re.test(s.g));return !!m&&m[1].includes(e.k)}
function noteSug(go){if(!go)return;MINA.rec().sug={t:Date.now(),g:String(go[0]||'')}}

/* ---------- ホームで 話す ---------- */
const onHome=()=>H.screen==='home'&&!document.hidden;
function speak(k,v,go,ms){const [ex,tx]=MINA.line(k,v);return MINA.say('m',ex,tx,ms||(go?9000:7000),null,go||null)}
/* 2つ つづけて（1つめの あと 少し 待って） */
function speak2(a,b){speak(...a);setTimeout(()=>{if(onHome()&&!(H.stage||{}).cheer)speak(...b)},6500)}
/* まだ 反応していない、 さっきの できごと（新しい 順） */
const pending=ms=>{const r=R();if(!r)return [];const u=(r._rec.u.mina||[]);return r.list(ms,ACT).filter(e=>!u.includes(e.id))};
const useAll=a=>a.forEach(e=>R().used('mina',e));
/* ホームに もどって きた */
let homeT=0;
function onReturn(tries=0){clearTimeout(homeT);if(!R()||!onHome())return;
  const a=pending(20*MIN);if(!a.length)return;
  if(MINA.busy()||(H.stage||{}).cheer){if(tries<8)homeT=setTimeout(()=>onReturn(tries+1),1500);return}
  const e=a[0],r=react(e);useAll(a);if(!r)return;
  /* その ことで ゆっくり 話せる おしゃべりが あれば ボタンに（game/mina-chat.js） */
  let go=r[2];if(!go&&window.MCHAT){const id=MCHAT.forEvent(e);if(id)go=['☕ その 話を もっと',()=>MCHAT.open(id,H.home)]}
  const first=[r[0],r[1],go];
  if(sugFor(e)&&has('r_sug')){MINA.rec().sug=null;return speak2(['r_sug',{}],first)}
  const names=descList(a.slice(0,3));
  if(a.length>=3&&names.length>=2&&has('r_busy'))return speak2(['r_busy',{list:names.join('・')}],first);
  speak(...first)}
H.on('home',()=>{clearTimeout(homeT);homeT=setTimeout(()=>onReturn(0),1600)});

/* ---------- ホームに いる 間の「いま」 ---------- */
let liveAt=-1e9;
const LIVE_P={bev:.6,visit:.5,sky:.6,radio:.35,meteor:1};
function onLive(e,tries=0){if(!onHome())return;const p=LIVE_P[e.k]||.5;
  if(tries===0&&Math.random()>p)return;
  if(!MINA.canTalk()){if(tries<6)setTimeout(()=>onLive(e,tries+1),2000);return}
  if(e.k!=='meteor'&&performance.now()-liveAt<100000)return;
  const r=react(e);if(!r)return;liveAt=performance.now();if(e.id&&e.k!=='bev'&&e.k!=='visit')R().used('mina',e);
  if(e.k==='meteor')R().used('mina',e);
  speak(r[0],r[1],r[2],7500)}
function hook(){const r=R();if(!r)return setTimeout(hook,500);
  r.on('bev',e=>setTimeout(()=>onLive(e),2500));
  r.on('meteor',e=>setTimeout(()=>{if(onHome())onLive(e)},2600))}
hook();
/* 動物が 来た（beach/scene.js が diaryNote('an', 名前) を よぶ）。 共通の きろくにも 'visit' で のこす */
{const dn=window.diaryNote;window.diaryNote=function(t,n){try{dn&&dn.apply(this,arguments)}catch(e){}
  if(t==='an'&&n){try{const e=R()&&R().add('visit',{name:n,ja:(window.MINA_EV_MSG&&MINA_EV_MSG[n])||''});if(e)setTimeout(()=>onLive(e),2500)}catch(e){}}}}
/* 空の 色（浜辺の 時計）・ラジオの オンオフ */
const skyOf=()=>{const g=((ST.gameMin||0)/60)%24;return g>=4.5&&g<6.5?'dawn':g>=6.5&&g<17?'day':g>=17&&g<19.5?'sunset':'night'};
let sky0=null,radio0=null;
setInterval(()=>{if(document.hidden)return;const s=skyOf();if(sky0&&s!==sky0)onLive({k:'sky',from:sky0,to:s});sky0=s;
  const on=(ST.radios||[]).filter(r=>r.on).length;if(radio0!=null&&on!==radio0&&onHome())onLive({k:'radio',on:on>radio0});radio0=on},4000);

/* ---------- ミナ先生の ページの 最初の ひとこと ---------- */
function page(){if(!R())return null;
  const a=pending(30*MIN);if(a.length){const e=a[0],r=react(e);useAll(a);if(r)return [r[0],r[1],null,r[2]]}
  const ev=R().last(['bev','visit'],90000);if(ev&&Math.random()<.5){const r=react(ev);if(r)return [r[0],r[1],null,r[2]]}
  return null}
/* ---------- ひさしぶりに ひらいた とき ---------- */
function hello(){if(!R())return null;const e=R().list(3*864e5,ACT)[0];if(!e||Date.now()-e.t<15*MIN||Math.random()>.55)return null;
  const what=desc(e);if(!what||!has('r_back'))return null;return MINA.line('r_back',{what})}

/* ---------- もちもの・体力・ほかの 場所の 場面を MINA_SENSE に 足す ---------- */
function rules(){if(!window.MINA_SENSE)return setTimeout(rules,500);
  const N=()=>{try{return RECENT.now()}catch(e){return {food:[],gifts:[]}}};
  const hpR=()=>{try{return FOOD.hp()/FOOD.MAX}catch(e){return null}};
  const goDiner=()=>['🍽️ 食堂へ',()=>FOOD.open()];
  const add=[
  ['x_bagFood',3,F=>{const f=N().food;if(!f||!f.length)return null;const x=pickL(f);return {n:x.ja,en:x.en,ico:x.ico}},null],
  ['x_bagFoodHp',5,F=>{const f=N().food,h=hpR();if(!f||!f.length||h==null||h>.35)return null;const x=pickL(f);return {n:x.ja,en:x.en,ico:x.ico,_id:x.id}},v=>['🥪 食べる',()=>FOOD.eat(v._id,H.home)]],
  ['x_hpLow',4,F=>{const h=hpR();return h!=null&&h<=.35&&!(N().food||[]).length?{}:null},goDiner],
  ['x_hpFull',1,F=>hpR()>=1?{}:null,null],
  ['x_giftHave',3,F=>{const g=(N().gifts||[]).filter(x=>x.src==='z');if(!g.length)return null;const x=pickL(g);return {n:x.ja,ico:x.ico}},()=>['🎁 だれかに あげる',()=>GIFT.pick()]],
  ['x_dinerFav',2,F=>{try{const E=FOOD.rec().eaten||{},id=Object.keys(E).sort((a,b)=>E[b]-E[a])[0],d=id&&FOOD.dishes.find(x=>x.id===id);return d&&E[id]>=2?{n:d.n,en:d.en,c:E[id]}:null}catch(e){return null}},goDiner],
  ['x_dinerNone',2,F=>{try{return (FOOD.rec().meals|0)===0?{}:null}catch(e){return null}},goDiner],
  ['x_tutorN',2,F=>{try{const n=TUTOR.rec().n|0;return n?{n}:null}catch(e){return null}},()=>['👦 リクくんの ところへ',()=>TUTOR.open()]],
  ['x_tutorNone',2,F=>{try{return (TUTOR.rec().n|0)===0?{}:null}catch(e){return null}},()=>['👦 リクくんの ところへ',()=>TUTOR.open()]],
  ['x_mineBest',2,F=>{try{const b=MINE.rec().best|0;return b?{d:b}:null}catch(e){return null}},()=>['🃏 カードショップへ',()=>CG.open()]],
  ['x_bottleN',1,F=>{try{const n=BOTTLE.rec().r.length;return n?{n,tot:BOTTLE.letters.length}:null}catch(e){return null}},null],
  ['x_cbookN',1,F=>{try{const [n,t]=CBOOK.stat();return n?{n,tot:t}:null}catch(e){return null}},()=>['🃏 カードショップへ',()=>CG.open()]],
  ['x_mioHi',2,F=>window.MIO?{}:null,()=>['🃏 カードショップへ',()=>CG.open()]],
  ['x_rain',3,F=>(N().rain|0)>0?{}:null,null],
  ['x_lastDid',4,F=>{const e=R()&&R().list(3*3600e3,ACT)[0];if(!e||Date.now()-e.t<5*MIN)return null;const what=desc(e);return what?{what}:null},null],
  ];
  add.forEach(r=>MINA_SENSE._rules.push(r))}
rules();

window.MINA_REACT={react,desc,page,hello,noteSug,_ret:()=>onReturn(0),_live:onLive};
})();
