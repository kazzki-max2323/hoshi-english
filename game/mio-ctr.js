/* 💬 カウンターで ミオに 話しかける（会話は game/mio-ctr-data.js、 「さっき なにが あったか」は game/recent.js）
   - カウンターで ミオを タップ（または 💬 話しかける）すると 会話が はじまる。 お客さんが いる ときは 「あとでね」
   - なにを 話すかは: いま 見えている 浜辺の イベント → さっきの こと（鉱山・食堂・プレゼント…） → ミオと 話した 会話の つづき
     → いまの ようす（雨・夜・体力・もちもの…）・おぼえた 好きな もの・いつもの 話。 同じ 話は しばらく 出ない
   - ♥ は 1日 4回まで（MIOC.gain）。 答えで ミオが 好きな ものを おぼえる（MIOC.rec().mem）
   - カウンターの つぶやき（mutter）と 店の 入口の あいさつ（hello）も ここで 「いま」に 反応する
   記録は SHOP.rec().mio に mem（おぼえた こと）・tseen（最近の 話）・tap{d,n}（きょうの ♥） */
(()=>{
const H=HE,esc=H.esc,pickL=a=>a[Math.random()*a.length|0];
const sf=k=>{try{BEACH.sfx[k]&&BEACH.sfx[k]()}catch(e){}};
const today=()=>{try{return CG.today()}catch(e){return new Date().toDateString()}};
const save=()=>{try{CG.save()}catch(e){}};
const MR=()=>MIOC.rec();
const stage=()=>{try{return MIOC.stage()}catch(e){return 0}};
const RC=()=>window.RECENT||null;
const TAP_HEART=4,EV_KINDS=['mine','pack','book','sell','away','meal','snack','zbuy','zsell','gift','meteor','lesson','tutor','bottle','kaiwa','bgm','mio'];
const mem=()=>{const M=MR();if(!M.mem||typeof M.mem!=='object')M.mem={};return M.mem};
const seenL=()=>{const M=MR();if(!Array.isArray(M.tseen))M.tseen=[];return M.tseen};
function markSeen(id){const L=seenL(),i=L.indexOf(id);if(i>=0)L.splice(i,1);L.unshift(id);if(L.length>40)L.length=40}
const recent=(id,n)=>{const i=seenL().indexOf(id);return i>=0&&i<n};

/* ================================================================ {…} に 入る ことば */
const cap=s=>s?s[0].toUpperCase()+s.slice(1):s;
const art=s=>!s?s:/^(a|an|the|some)\s/i.test(s)||/[^s]s$/i.test(s)?s:(/^[aeiou]/i.test(s)?'an ':'a ')+s;
const wordOf=id=>{try{const I=CG.info(id);return I?[String(I.en).split(',')[0].trim(),String(I.ja||'').split(/[、,;／/]/)[0].trim()]:['','']}catch(e){return ['','']}};
function vals(e,N){const M=mem(),V={};e=e||{};
  if(e.k==='mine'){Object.assign(V,{d:e.depth,best:e.best,ok:e.ok,q:e.q,coins:e.coins});if(e.cards&&e.cards[0]){const [w,j]=wordOf(e.cards[0]);V.w=w;V.wj=j}}
  if(e.k==='book'||e.k==='sell'){V.w=e.en;V.wj=e.ja;V.p=e.p}
  if(e.k==='meal'||e.k==='snack'){V.food=e.en;V.foodj=e.ja}
  if(e.k==='zbuy'||e.k==='gift'){V.item=e.en;V.itemj=e.ja}
  if(e.k==='gift'){V.to=MIOT_NAME[e.to]||'someone';V.toj=e.toN||'だれか'}
  if(e.k==='meteor')V.coins=e.coins;
  if(e.k==='bev'||e.cat){V.ev=e.en;V.evj=e.ja}
  if(N){if(!V.food&&N.food&&N.food[0]){V.food=N.food[0].en;V.foodj=N.food[0].ja}
    if(!V.item&&N.gifts&&N.gifts[0]){V.item=N.gifts[0].en;V.itemj=N.gifts[0].ja}
    if(!V.ev&&N.ev){V.ev=N.ev.en;V.evj=N.ev.ja}V.coinsNow=N.coins}
  Object.keys(MIOT_MEM).forEach(k=>{const x=MIOT_MEM[k][M[k]];if(x){V['m_'+k]=x[0];V['m_'+k+'j']=x[1]}});
  if(V.food)V.a_food=art(V.food);if(V.item)V.a_item=art(V.item);if(V.ev)V.Ev=cap(V.ev);if(V.to)V.To=cap(V.to);
  return V}
const fill=(s,V)=>String(s).replace(/\{(\w+)\}/g,(m,k)=>V[k]!=null&&V[k]!==''?V[k]:m);
const ok=(s,V)=>!/\{\w+\}/.test(fill(s,V));
/* every line of a talk can be filled（入らない ことばが あれば その 話は 出さない） */
function fits(t,V){const L=[];const walk=o=>o.forEach(x=>{L.push(x[0]);if(Array.isArray(x[2]))L.push(x[2][0]);else{L.push(x[2].m[0]);walk(x[2].o)}});L.push(t.m[0]);walk(t.o);return L.every(s=>ok(s,V))}

/* ================================================================ いまの ようす の きっかけ */
function stateKinds(N){const k=[],S=(()=>{try{return SHOP.rec()}catch(e){return {floor:[1]}}})(),h=new Date().getHours();
  if(N.rain)k.push('rain');
  if(N.tod==='night')k.push('night');else if(N.tod==='dusk')k.push('dusk');else if(h>=5&&h<11)k.push('morning');
  if(N.hp!=null&&N.hp<25)k.push('hpLow');
  if(N.food.length)k.push('food');
  if(N.gifts.length)k.push('gifts');
  if(N.song)k.push('song');
  if(!S.floor.length)k.push('empty');
  if(N.coins>=1500)k.push('rich');
  return k}

/* ================================================================ なにを 話す？ */
/* 会話の if には 記録の name（料理・会話・イベントの id）を id として わたす */
const asData=e=>e?Object.assign({},e,{id:e.name!=null?e.name:e.id}):{};
function cands(k,e,N,V,s){const M=mem(),d=asData(e);return MIOT.filter(t=>t.k===k&&(t.st||0)<=s&&(!t.if||t.if(d,N,M,s))&&fits(t,V))}
function choose(){const R=RC();const N=R?R.now():{food:[],gifts:[],tod:'day'},s=stage();
  if(!R)return pickAny(N,s);
  /* 1. いま 見えている 浜辺の イベント */
  const bevE=R.fresh('mioTap','bev',150000);
  if(bevE&&(N.ev&&N.ev.id===bevE.name||N.evs.some(x=>x.id===bevE.name)||Date.now()-bevE.t<60000)){const V=vals(bevE,N),c=cands('bev',bevE,N,V,s);if(c.length)return {t:c[0],e:bevE,V}}
  /* 2. さっきの こと（40分 以内、 まだ 話して いない もの） */
  const L=R.list(40*60000,EV_KINDS).filter(e=>!(R._rec.u.mioTap||[]).includes(e.id));
  for(const e of L){const V=vals(e,N),c=cands(e.k,e,N,V,s).filter(t=>!recent(t.id,3));
    if(c.length&&(Date.now()-e.t<10*60000||Math.random()<.7))return {t:Math.random()<.65?c[0]:pickL(c),e,V}}
  return pickAny(N,s)}
function pickAny(N,s){const V=vals(null,N),M=mem();
  const st=stateKinds(N).map(k=>cands(k,null,N,V,s)).flat().filter(t=>!recent(t.id,6));
  const mm=cands('mem',null,N,V,s).filter(t=>!recent(t.id,10));
  const an=cands('any',null,N,V,s).filter(t=>!recent(t.id,14));
  const G=[[st,st.length?2.2:0],[mm,mm.length?1.2:0],[an,an.length?3:0]].filter(x=>x[1]);
  if(!G.length){const all=cands('any',null,N,V,s);return {t:pickL(all),e:null,V}}
  let r=Math.random()*G.reduce((a,x)=>a+x[1],0);const g=G.find(x=>(r-=x[1])<0)||G[0];
  /* 新しい 段階の 話を 先に */
  const top=g[0].filter(t=>(t.st||0)===s&&s>0);const pool=top.length&&Math.random()<.5?top:g[0];
  return {t:pickL(pool),e:null,V}}

/* ================================================================ 会話（カウンターの 下の 箱で） */
let TK=null;
const speak=en=>{try{MIO.say(en.replace(/[「」]/g,''))}catch(e){}};
function talk(T,box,again){if(TK&&TK.alive&&TK.T===T&&T.alive&&!again)return;if(TK)TK.alive=false;
  const pk=choose();if(!pk||!pk.t)return;const {t,e,V}=pk;
  markSeen(t.id);if(e)try{RECENT.used('mioTap',e)}catch(er){}
  const K=TK={alive:true,T,t};T.talk=K;
  const m=T.mio;m.walk=150;m.pose='wave';m.until=Date.now()+3000;
  box.innerHTML=`<div class="shsv mct"><div class="shlog" id="mtlog"></div><div class="shopt" id="mtop"></div></div>`;
  const logE=box.querySelector('#mtlog'),optE=box.querySelector('#mtop');
  const live=()=>K.alive&&T.alive&&box.isConnected&&box.contains(logE);
  const add=(r,line,ex)=>{if(!live())return;const en=fill(line[0],V),ja=fill(line[1]||'',V),d=document.createElement('div');d.className='svl '+r;
    if(r==='nt')d.innerHTML=`<p>${esc(en)}</p>`;
    else{d.innerHTML=`${r==='m'?`<i class="mf">${MIO.face(ex||'smile',r==='m'&&line.p||'')}</i>`:''}<div><b>${r==='m'?'ミオ':'店長（きみ）'}</b><p class="en">${esc(en)}</p>${ja?`<p class="ja">${esc(ja)}</p>`:''}</div>`;
      if(r==='m'){d.onclick=()=>speak(en);speak(en)}}
    logE.appendChild(d);logE.scrollTop=logE.scrollHeight;try{d.scrollIntoView({block:'nearest',behavior:'smooth'})}catch(er){}};
  const setPose=ex=>{m.pose=ex==='laugh'?'cheer':ex==='oops'?'stand':ex==='sleepy'?'doze':'wave';m.until=Date.now()+2600;if(m.pose==='doze')m.until=Date.now()+1500};
  let go=null,heartOk=0;
  const node=n=>{if(!live())return;add('m',Object.assign([...n.m],{p:n.p}),n.ex);setPose(n.ex);
    setTimeout(()=>{if(!live())return;
      optE.innerHTML=`<p class="shq">店長の 返事は？</p><div class="cgtc">${H.shuffle(n.o.map((o,i)=>[o,i])).map(([o,i])=>`<button data-i="${i}">${esc(fill(o[0],V))}<small>${esc(fill(o[1],V))}</small></button>`).join('')}</div>`;
      optE.querySelectorAll('[data-i]').forEach(b=>b.onclick=()=>{const o=n.o[+b.dataset.i];sf('tap');optE.innerHTML='';add('me',o);
        const x=o[3]||(Array.isArray(o[2])&&o[2][3])||null;
        if(x&&x.mem){const [k,v]=x.mem.split('=');mem()[k]=v;save()}
        if(x&&x.go)go=x.go;
        setTimeout(()=>{if(!live())return;if(Array.isArray(o[2]))end(o[2]);else node(o[2])},650)})},700)};
  const end=r=>{add('m',r,r[2]);setPose(r[2]||'smile');
    let heart='';const M=MR(),d=today();if(!M.tap||M.tap.d!==d)M.tap={d,n:0};
    if(M.tap.n<TAP_HEART){M.tap.n++;heart=MIOC.gain(1,'talk');heartOk=1}save();
    try{RECENT.add('mio',{id:t.id,how:'tap'})}catch(er){}
    setTimeout(()=>{if(!live())return;
      if(t.ph)add('nt',[`📌 ${t.ph[0]} ＝ ${t.ph[1]}`]);
      if(heart)add('nt',[heart]);
      const gl=go==='gift'?'🎁 プレゼントを えらぶ':go==='floor'?'🏷️ 売り場へ':'';
      optE.innerHTML=`<div class="row">${gl?`<button id="mtgo">${gl}</button>`:''}<button id="mtmore" class="sub">💬 もっと 話す</button><button id="mtx" class="sub">とじる</button></div>`;
      const g=optE.querySelector('#mtgo');if(g)g.onclick=()=>{sf('step');close();T.alive=false;
        if(go==='gift')GIFT.pick({to:'mio',back:()=>SHOP.counter()});else SHOP.floor()};
      optE.querySelector('#mtmore').onclick=()=>{sf('step');K.alive=false;talk(T,box,true)};
      optE.querySelector('#mtx').onclick=()=>{sf('tap');close()};
      if(heartOk)sf('heart');
      try{if(Math.random()<.25&&window.MINA&&MINA.canAnnounce&&MINA.canAnnounce()){const [ex,tx]=MINA.line(t.ph?'mt_phrase':'mt_talk',{ph:t.ph?t.ph[0]:''});MINA.say('m',ex,tx,6000)}}catch(er){}},900)};
  const close=()=>{K.alive=false;if(T.talk===K)T.talk=null;if(box.isConnected&&box.contains(logE))box.innerHTML='';T.next=Math.max(T.next,Date.now()+6000)};
  K.close=close;
  sf('talk');node(t)}

/* カウンターで ミオを タップ・💬 を おした */
function tap(T,box){if(!T||!box)return;
  if(TK&&TK.alive&&T.talk===TK)return;
  if(T.g||(box.innerHTML&&!box.querySelector('.svx'))){T.mio.pose='wave';T.mio.until=Date.now()+1500;return T.mut&&T.mut(pickL(MIOT_BUSY))}
  talk(T,box)}

/* ================================================================ カウンターの ひとりごと（いま 起きている こと）。 なければ null */
function mutter(){const R=RC();if(!R)return null;const N=R.now();
  const say=(a,V)=>{const c=(a||[]).filter(x=>ok(x[0],V)&&ok(x[1],V));if(!c.length)return null;const x=pickL(c);return [fill(x[0],V),fill(x[1],V)]};
  const b=R.fresh('mioMut','bev',90000);
  if(b){R.used('mioMut',b);const l=say(MIOT_MUT[b.cat],vals(b,N));if(l)return l}
  const e=R.list(20*60000,EV_KINDS).find(x=>!(R._rec.u.mioMut||[]).includes(x.id));
  if(e){R.used('mioMut',e);const l=say(MIOT_MUT[e.k],vals(e,N));if(l)return l}
  if(Math.random()<.5)return null;
  const ks=stateKinds(N).filter(k=>MIOT_MUT[k]);if(Math.random()<.25)ks.push('tap');
  if(!ks.length)return null;return say(MIOT_MUT[pickL(ks)],vals(null,N))}

/* 店の 入口の あいさつ（さっきの ことに 反応）。 なければ null */
function hello(){const R=RC();if(!R)return null;const N=R.now();
  const e=R.list(15*60000,Object.keys(MIOT_HI)).find(x=>!(R._rec.u.mioHi||[]).includes(x.id));
  if(!e)return null;R.used('mioHi',e);const V=vals(e,N),c=(MIOT_HI[e.k]||[]).filter(x=>ok(x[0],V));
  if(!c.length)return null;const x=pickL(c);return [fill(x[0],V),fill(x[1],V)]}

/* ================================================================ ミナ先生の セリフ */
Object.assign(MINA_LINES,{
 mt_new:[['wow','カードショップの カウンターで、 ミオさんを タップすると 話しかけられるように なったよ！ さっき したことや、 外の ようすにも 反応して くれるんだって'],['happy','ミオさん、 店長が 鉱山から 帰ってきたり、 食堂で 食べてきたり すると 気づいて くれるの。 カウンターで タップして 話してみて']],
 mt_talk:[['smile','ミオさんとの おしゃべり、 自然な 英語が いっぱいだね'],['happy','相手の 話に 答えるのが 会話の いちばんの 練習だよ'],['proud','ミオさん、 店長と 話すのが ほんとに 楽しそう']],
 mt_phrase:[['smile','「{ph}」、 使えそうな 表現だね。 声に 出して みよう'],['think','「{ph}」… 今度 ミオさんに 使って みたら？']],
 x_shTap:[['smile','カウンターで ミオさんを タップすると、 いろんな 話が できるよ。 外で 起きてる ことにも 反応するの'],['happy','鉱山や 食堂から 帰ったら、 ミオさんに 話しかけて みて。 ちゃんと 見てて くれるよ'],['think','ミオさん、 店長の 好きな ものを おぼえてる みたい。 前に 話した こと、 覚えてるかな？']]});
if(window.MINA_SENSE&&MINA_SENSE._rules)MINA_SENSE._rules.push(
 ['x_shTap',2,()=>{try{return SHOP.rec().met?{}:null}catch(e){return null}},()=>['🧑‍💼 カウンターへ',()=>{CG.open();setTimeout(()=>{try{if(SHOP.rec().met&&!SHOP.rec().away)SHOP.counter()}catch(e){}},60)}]]);
/* the tap talk is new: Mina tells you once（もう お店を 知っている 人だけ） */
setTimeout(function first(){let S;try{S=SHOP.rec()}catch(e){return}if(S.mtTold||!S.met)return;const m=window.MINA;if(!m||!m.canAnnounce||!m.canAnnounce())return setTimeout(first,20000);
  S.mtTold=1;save();const [ex,tx]=MINA.line('mt_new',{});m.say('m',ex,tx,10000,null,['🧑‍💼 カウンターへ',()=>{CG.open();setTimeout(()=>{try{SHOP.counter()}catch(e){}},60)}])},40000);

H.on('home',()=>{if(TK)TK.alive=false});
window.MIOCT={tap,talk,mutter,hello,choose,mem,_vals:vals};
})();
