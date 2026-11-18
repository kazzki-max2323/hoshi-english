/* カウンターの お客さんの 対応（データは game/shop-serve-data.js、 店の しくみは game/shop.js）
   - お客さんが レジに 来たら 「自分で 対応」か 「ミオに まかせる」を えらぶ。 WAIT びょう えらばなければ ミオが 対応
   - やりとりの 形は 毎回 かわる: なし（すぐ 売れる）・世間話・意味を 聞かれる・英語の 受け答え・プレゼント・値段の 相談・おすすめ
   - ミオの ときは 同じ 会話を ミオが 話す（英語＋日本語、 タップで 読む）。 ミオは ときどき おっちょこちょい
   - 買う カードは 上の 帯に いつも 見える
   - カードを 売りに 来る お客さん（X.buy）: 買い取るか ことわるか。 やりとりは 思い出・値段の 相談・意味・レア？・もう 持ってる？・まちがえて 持ってきた・世間話・なし
     （データは game/shop-buyin-data.js）。 値段は 売り値の 7わりが ふつう。 コインが たりない ときは やさしく 「いまは むり」 */
(()=>{
const H=HE,esc=H.esc,C=CG,pickL=a=>a[Math.random()*a.length|0];
const sf=k=>{try{BEACH.sfx[k]&&BEACH.sfx[k]()}catch(e){}};
const night=()=>{try{return SCENE.dark()}catch(e){return 0}};
const tod=()=>{const d=night();return d>.6?'night':d>.25?'dusk':'day'};
const WAIT=6;
const KINDS=[['quick',22],['chat',14],['mean',16],['quiz',14],['gift',11],['deal',10],['rec',13]];
let lastK='',lastChat=null;
const who=g=>SV_WHO[GUESTS.indexOf(g.G)]||{en:'friend',ico:'🙂',rel:['friend','友だち']};
const short=g=>String(g.G.n).split(' ').pop();
const word=I=>!I?'':I.k==='w'?String(I.en).split(',')[0].trim():String(I.en);
const jaOf=I=>!I?'':String(I.ja||'').split(/[、,;／/]/)[0].trim();
const SV_REC_AT=k=>SV_REC.at[k]||['cards','カード'];

/* ================================================================ 売りに 来る お客さんが 持ってくる カード
   すきな なかま が 多め・自分の レベルの 1つ上 まで・まだ 持っていない カードが 出やすい（6わり）。 ときどき 宝カード（7%）・文カード（17%）・パーツカード（12%） */
const LVS=['es','jh','hs','adv'];
function offer(G,not){const my=Math.max(0,LVS.indexOf(C.myLv())),r=Math.random();
  /* 💎 ためている カード: コインが たまったら 半分の 確率で、 たまっていなくても ときどき もってくる */
  try{const w=SHOP.wantRec();if(w&&w.id!==not){const c=(BEACH.S.coins|0)>=w.p;if(Math.random()<(c?.5:.08))return w.id}}catch(e){}
  /* 💎 めずらしい 文・パーツの カード（まだ ない もの）: 5% */
  try{if(r>=.36&&r<.41){const L=SHOP.premList().filter(x=>x!==not&&!C.owns(x));if(L.length)return pickL(L)}}catch(e){}
  try{if(r<.07&&window.CARDS&&CARDS.book){const pool=CARDS.book.filter(c=>c.r>=2&&c.r<=4&&'t:'+c.e!==not),nw=pool.filter(c=>!CARDS.has(c));const c=pickL(nw.length&&Math.random()<.6?nw:pool);if(c)return 't:'+c.e}}catch(e){}
  /* 🧩 パーツの カード（11/18〜。 鉱山の お話の おまけ と ここだけ） */
  if(r>=.24&&r<.36&&typeof CG_PARTS!=='undefined'){const pool=Object.keys(CG_PARTS).map(k=>'p:'+k).filter(x=>x!==not&&!SHOP.premium(x)),nw=pool.filter(x=>!C.owns(x));const x=pickL(nw.length&&Math.random()<.7?nw:pool);if(x)return x}
  if(r<.24&&C.SENT&&C.SENT.length){const ok=LVS.slice(0,my+1),pool=C.SENT.filter(x=>ok.includes(x.lv)&&'s:'+x.i!==not&&!SHOP.premium('s:'+x.i)),nw=pool.filter(x=>!C.owns('s:'+x.i));const x=pickL(nw.length&&Math.random()<.6?nw:pool);if(x)return 's:'+x.i}
  const ok=LVS.slice(0,Math.min(4,my+2));let pool=C.W.filter(c=>ok.includes(c.lv)&&c.id!==not&&c.ja);
  const fav=pool.filter(c=>(G.a||[]).includes(c.a));if(fav.length>8&&Math.random()<.6)pool=fav;
  const nw=pool.filter(c=>!C.owns(c.id));const c=pickL(nw.length&&Math.random()<.6?nw:pool);return c?c.id:null}
const BKINDS=[['quick',18],['story',18],['chat',10],['deal',15],['mean',14],['rare',8],['have',9],['oops',7]];
let lastB='';
function planBuy(id){const kinds=BKINDS.filter(([k])=>k!=='have'||!C.owns(id));
  let k,n=0;do{let tot=kinds.reduce((a,x)=>a+x[1],0),r=Math.random()*tot;k=kinds.find(x=>(r-=x[1])<0)[0]}while(k===lastB&&++n<8);lastB=k;
  return {k,pre:!/quick|chat/.test(k)&&Math.random()<.25,buy:1}}

/* ================================================================ which kind of talk（店の decide() で 1回） */
function plan(g,floor){const kinds=KINDS.filter(([k])=>k!=='rec'||new Set(floor).size>=2);
  let k,n=0;do{let tot=kinds.reduce((a,x)=>a+x[1],0),r=Math.random()*tot;k=kinds.find(x=>(r-=x[1])<0)[0]}while(k===lastK&&++n<8);lastK=k;
  return {k,pre:!/quick|chat/.test(k)&&Math.random()<.3,end:k!=='quick'&&Math.random()<.3}}

/* ================================================================ the talk */
function serve(X){const {T,g,box}=X,BUY=!!X.buy,W=who(g),nm=short(g);
  let id=X.id,p=id?X.price(id):0,pp=BUY?Math.max(4,Math.round(p*.7)):p,hideJa=false,mode='',fast=false,miss=0,tip=0,ok=0;
  const P=g.plan||(BUY?planBuy(id):plan(g,X.floor()));g.plan=P;hideJa=P.k==='mean';
  /* 買い取りの 値段: ふつう 7わり・言い値 9わり・あいだ・ミオの 値切り 6わり・売り値 */
  const bv=()=>{if(window.SHOP&&SHOP.premium&&SHOP.premium(id))return {bp:p,hi:p,mid:p,lo:p,sp:p};const bp=Math.max(4,Math.round(p*.7)),hi=Math.max(bp+1,Math.round(p*.9));return {bp,hi,mid:Math.round((bp+hi)/2),lo:Math.max(3,Math.round(p*.6)),sp:p}};
  const alive=()=>T.alive&&T.g===g&&box.isConnected;
  const STOP={};
  const fill=s=>String(s).replace(/\{(\w+)\}/g,(m,k)=>{const I=C.info(id);const at=SV_REC_AT((g.G.a||[])[0]);
    return ({w:word(I),ja:jaOf(I),p:pp,p2:Math.max(1,Math.round(p*.85)),rel:W.rel[0],relj:W.rel[1],at:at[0],atj:at[1],n:W.en,...(BUY?bv():{})})[k]??m});
  const enOnly=s=>s.replace(/[“"「][^”"」]*[぀-ヿ一-鿿][^”"」]*[”"」]/g,'').replace(/\s+([.!?,])/g,'$1').trim();

  box.innerHTML=`<div class="shsv"><div class="shwant" id="svw"></div><div class="shlog" id="svlog"></div><div class="shopt" id="svo"></div></div>`;
  const $=s=>box.querySelector(s),logE=$('#svlog'),optE=$('#svo');
  const want=()=>{const e=$('#svw');if(!e)return;const I=C.info(id);
    if(BUY){e.innerHTML=!I?'':`${C.face(id,{mini:1,marks:false})}<div><small>${esc(nm)}が 売りたい カード${C.owns(id)?'':' <em class="svnew">NEW</em>'}</small><b class="en">${esc(word(I))}</b><small class="ja">${hideJa?'（意味は？）':esc(jaOf(I))}</small></div><span class="pr"><small>買い取り</small>🪙${pp}</span>`;return}
    e.innerHTML=!I?`<span class="q">❓</span><div><b>${esc(nm)}は カードを さがしてる</b><small>おすすめを 聞かれるかも</small></div>`
      :`${C.face(id,{mini:1,marks:false})}<div><small>${esc(nm)}が 買いたい カード</small><b class="en">${esc(word(I))}</b><small class="ja">${hideJa?'（意味は？）':esc(jaOf(I))}</small></div><span class="pr">${pp!==p?`<s>🪙${p}</s>`:''}🪙${pp}</span>`};
  want();
  /* 帯の カードを タップで くわしく 画面（「意味は？」を 聞いている あいだは 読むだけ） */
  {const e=$('#svw');if(e){e.style.cursor='pointer';e.onclick=ev=>{if(!ev.target.closest('.cgc')||!C.info(id))return;
    if(hideJa){try{C.sayCard(id)}catch(er){}H.toast('🤫 意味は 答えてから 見てね',1600);return}
    C.peek(id,{from:'guest'})}}}

  /* a line in the log: who = g（お客）/ m（ミオ）/ me（店長）/ nt（メモ） */
  const add=(r,line,ex)=>{if(!alive())throw STOP;const en=fill(line[0]),ja=line[1]?fill(line[1]):'';const d=document.createElement('div');d.className='svl '+r;
    if(r==='nt'){d.innerHTML=`<p>${esc(en)}</p>`}
    else{const ico=r==='g'?`<i>${W.ico}</i>`:r==='m'?`<i class="mf">${MIO.face(ex||'smile')}</i>`:'';
      d.innerHTML=`${ico}<div><b>${r==='g'?esc(nm):r==='m'?'ミオ':'店長（きみ）'}</b><p class="en">${esc(en)}</p>${ja?`<p class="ja">${esc(ja)}</p>`:''}</div>`;
      const say=()=>{const s=enOnly(en);if(!s)return;r==='m'?X.mio(s):X.gs(s)};d.onclick=say;if(r!=='me')say()}
    logE.appendChild(d);logE.scrollTop=logE.scrollHeight;try{d.scrollIntoView({block:'nearest',behavior:'smooth'})}catch(e){}
    if(r==='g'){g.bub='';T.mu.until=0}
    return en};
  /* つぎの セリフは 前の セリフを 読みおわってから */
  const busy=()=>{try{return !!(H.talkBusy&&H.talkBusy())}catch(e){return false}};
  const wait=ms=>new Promise(res=>{const t0=Date.now();const iv=setInterval(()=>{if(!alive()||fast||(Date.now()-t0>=ms&&!busy())){clearInterval(iv);res()}},80)});
  const pace=s=>mode==='mio'?1100+Math.min(3200,String(s).length*62):mode==='me'?650:0;
  const G=async(line)=>{const s=add('g',line);await wait(pace(s))};
  const ME=async(line,ex)=>{const s=add(mode==='mio'?'m':'me',line,ex);await wait(pace(s)*(mode==='me'?.4:1))};

  /* choose: you tap, or Mio decides. opts = [{t:html, ok?}], mioPick = index Mio takes */
  const choose=(opts,mioPick,head)=>new Promise((res,rej)=>{if(!alive())return rej(STOP);
    if(mode==='mio'){const iv=setInterval(()=>{if(!alive()){clearInterval(iv);rej(STOP)}},200);setTimeout(()=>{clearInterval(iv);alive()?res(mioPick):rej(STOP)},fast?150:700);return}
    optE.innerHTML=`${head?`<p class="shq">${head}</p>`:''}<div class="cgtc">${opts.map((o,i)=>`<button data-i="${i}">${o.t}</button>`).join('')}</div>`;
    const iv=setInterval(()=>{if(!alive()){clearInterval(iv);rej(STOP)}},300);
    optE.querySelectorAll('[data-i]').forEach(b=>b.onclick=()=>{clearInterval(iv);sf('tap');optE.innerHTML='';res(+b.dataset.i)})});
  const optT=o=>`${esc(fill(o[0]))}<small>${esc(fill(o[1]))}</small>`;

  /* a branching node: {g, o:[[en,ja,next,eff]]} */
  const node=async n=>{if(n.g)await G(n.g);if(!n.o||!n.o.length)return;
    const i=await choose(n.o.map(o=>({t:optT(o)})),Math.random()*n.o.length|0,'店長の 返事は？');const o=n.o[i];await ME(o);
    if(o[3]&&o[3].d){pp=Math.max(1,Math.round(p*.85));want()}
    if(o[2])await node(o[2])};
  /* small talk: the guest's own, or anyone's（店長 あての 会話は ミオの ときは 出さない） */
  const chat=async()=>{const own=SV_CHAT[GUESTS.indexOf(g.G)]||[];let pool=own.concat(own,SV_CHAT_ANY[tod()]||[],SV_CHAT_ANY.any).filter(c=>mode==='mio'?!c.own:!c.mio);
    if(pool.length>1)pool=pool.filter(c=>c!==lastChat);const c=pickL(pool);lastChat=c;await node(c)};

  /* ------------------------------------------------ the kinds */
  const K={};
  K.quick=async()=>{await G(pickL(SV_QUICK.g));if(mode==='me'){
      const i=await choose([{t:`🪙 売る<small>${esc(fill('{p}コインで'))}</small>`},{t:'売らない<small>また こんど</small>'}],0);
      if(i===1){add('me',["Sorry, not this one today.","ごめんなさい、 これは きょうは…"]);return 'no'}}
    await ME(pickL(SV_QUICK.me));await G(pickL(SV_QUICK.pay))};
  K.chat=async()=>{await chat();await ME(pickL(SV_QUICK.me));await G(pickL(SV_QUICK.pay))};
  K.mean=async()=>{const I=C.info(id);const right=jaOf(I);
    const pool=C.W.filter(c=>c.ja&&jaOf(c)!==right&&(I.lv==='tr'||c.lv===I.lv));const ds=[];let n=0;while(ds.length<2&&n++<60){const d=jaOf(pickL(pool));if(d&&d!==right&&!ds.includes(d))ds.push(d)}
    const opts=H.shuffle([right,...ds]);hideJa=true;want();
    await G(pickL(SV_MEAN.ask));
    const say=j=>[SV_MEAN.say[0].replace('{ja}',j),SV_MEAN.say[1].replace('{ja}',j)];
    let pick=await choose(opts.map(j=>({t:`「${esc(j)}」<small>It means “${esc(j)}.”</small>`})),Math.random()<.2?opts.findIndex(j=>j!==right):opts.indexOf(right),`「${esc(word(I))}」の 意味は？`);
    await ME(say(opts[pick]),opts[pick]===right?'smile':'oops');hideJa=false;want();
    if(opts[pick]===right){ok=1;if(mode==='me')tip=Math.max(2,Math.round(p*.2));await G(pickL(SV_MEAN.ok))}
    else{miss=1;await G(SV_MEAN.hm);if(mode==='mio'){await ME(SV_MEAN.oops,'oops')}else{add('m',SV_MEAN.fix,'wink');await wait(900)}
      await G(["Oh, I see. Thanks!","そっか。 ありがとう！"])}
    add('nt',[`📝 ${word(I)} ＝ ${right}`])};
  K.quiz=async()=>{const I=C.info(id),lv=({es:'es',jh:'jh',hs:'hs',adv:'hs'})[C.myLv()]||'es';
    const kinds=['want','deal','rumor'];if(X.rare(id))kinds.push('rare','rare');if(C.count(id)<=1)kinds.push('only','only');
    const k=pickL(kinds),x=pickL(SHOP_TALK[k][lv]);if(k==='deal'){pp=Math.max(1,Math.round(p*.85))}else if(k==='rare'||k==='only')pp=Math.round(p*1.2);want();
    await G([x[0],x[1]]);
    const ch=H.shuffle(x[2].map((s,j)=>[s,j]));const right=ch.findIndex(c=>c[1]===0);
    const mp=Math.random()<.15?ch.findIndex(c=>c[1]!==0):right;
    const i=await choose(ch.map(c=>({t:esc(fill(c[0]))})),mp,'店長の 答えは？');
    if(i===right){ok=1;await ME([x[2][0],''],'smile');if(mode==='me'){sf('correct');if(k!=='deal')tip=Math.max(2,Math.round(pp*.2))}}
    else{miss=1;if(mode==='me'){add('me',[ch[i][0],'']);sf('wrong');add('nt',[`💡 ${fill(x[2][0])}`])}else{await ME([ch[i][0],''],'oops');await ME([SV_MIO.quizOops[0]+' '+x[2][0],SV_MIO.quizOops[1]],'laugh')}}
    add('nt',[`${i===right?'⭕':'💡'} ${x[3]}`]);await G(pickL(SV_QUICK.pay))};
  K.gift=async()=>{await node(SV_GIFT)};
  K.deal=async()=>{const o=SV_DEAL.o;await G(pickL(SV_DEAL.g));
    const i=await choose(o.map(x=>({t:optT(x)})),Math.random()<.5?0:1+(Math.random()*2|0),'店長の 返事は？');await ME(o[i]);if(o[i][3]&&o[i][3].d){pp=Math.max(1,Math.round(p*.85));want()}await G(o[i][2].g)};
  K.rec=async()=>{const fl=[...new Set(X.floor())].filter(x=>C.info(x));const fav=fl.filter(x=>(g.G.a||[]).includes(C.info(x).a));
    let c=H.shuffle(fl).slice(0,3);if(fav.length&&!c.some(x=>fav.includes(x)))c[c.length-1]=pickL(fav);c=H.shuffle(c);
    await G(pickL(SV_REC.ask));
    const mp=fav.length&&Math.random()<.8?c.findIndex(x=>fav.includes(x)):Math.random()*c.length|0;
    const i=await choose(c.map(x=>({t:`<span class="svc">${C.face(x,{mini:1,marks:false})}</span>${esc(word(C.info(x)))}<small>🪙${X.price(x)}</small>`})),Math.max(0,mp),'どれを すすめる？');
    id=c[i];p=pp=X.price(id);want();await ME([SV_REC.say[0],SV_REC.say[1]]);
    const love=fav.includes(id);if(love){ok=1;const at=SV_REC_AT(C.info(id).a);const L=pickL(SV_REC.love);await G([L[0].replace('{at}',at[0]),L[1].replace('{atj}',at[1])])}else await G(pickL(SV_REC.try))};

  /* ------------------------------------------------ the kinds: カードを 売りに 来た お客さん */
  const B={},SBP=bv;
  const setP=v=>{pp=v;want()};
  const coins=()=>{try{return BEACH.S.coins|0}catch(e){return 0}};
  /* さいごに 買い取るか きめる（ミオは 買い取る。 コインが たりない ときは やさしく ことわる） */
  const decideBuy=async()=>{const can=coins()>=pp;
    if(mode==='mio'){if(!can){await ME(pickL(SB_SAY.mioPoor),'oops');await G(pickL(SB_SAY.poorOk));return 'poor'}
      await ME(pickL(SB_SAY.buy),'smile');await G(pickL(SB_SAY.thanks));return 'ok'}
    if(!can){await choose([{t:`いまは むり<small>コインが たりない（🪙${pp}）</small>`}],0,'コインが たりない みたい…');await ME(pickL(SB_SAY.poor));await G(pickL(SB_SAY.poorOk));return 'poor'}
    const i=await choose([{t:`🪙 買い取る<small>${pp}コインで</small>`},{t:'ことわる<small>また こんど</small>'}],0,'買い取る？');
    if(i===1){await ME(pickL(SB_SAY.no));await G(pickL(SB_SAY.noOk));return 'no'}
    await ME(pickL(SB_SAY.buy));await G(pickL(SB_SAY.thanks));return 'ok'};
  B.quick=async()=>{await G(pickL(SB_OFFER))};
  B.chat=async()=>{await chat();await G(pickL(SB_OFFER))};
  B.story=async()=>{await G(pickL(SB_OFFER));const own=SB_STORY[GUESTS.indexOf(g.G)]||[];await node(pickL(own.concat(own,SB_STORY_ANY)))};
  B.deal=async()=>{await G(pickL(SB_OFFER));await G(pickL(SB_DEAL.g));const b=SBP();
    if(mode==='mio'){const r=Math.random();
      if(r<.35){await ME(pickL(SB_DEAL.mioHag),'wink');setP(b.lo);await G(pickL(SB_DEAL.mioHagOk));return}
      if(r<.6){await ME(pickL(SB_DEAL.mioOops),'laugh');setP(b.sp);await wait(500);await ME(pickL(SB_DEAL.mioOops2),'oops');return}}
    const o=SB_DEAL.o,i=await choose(o.map(x=>({t:optT(x)})),Math.random()*o.length|0,'店長の 返事は？');await ME(o[i]);
    const to=o[i][3].to;
    if(to==='hi'){setP(b.hi);await G(o[i][2].g);return}
    if(to==='mid'){setP(b.mid);await G(o[i][2].g);return}
    /* {bp}: お客は のむか、 あいだを たのむ */
    if(Math.random()<.55){setP(b.bp);await G(pickL(SB_DEAL.bpYes));return}
    await G(pickL(SB_DEAL.bpMid));
    const j=await choose([{t:optT(SB_DEAL.midOk[0])},{t:`${esc(fill('Sorry, {bp} is our price.'))}<small>${esc(fill('ごめんなさい、 {bp}コインまでです。'))}</small>`}],0,'店長の 返事は？');
    if(j===0){await ME(SB_DEAL.midOk[0]);setP(b.mid);await G(["Thank you!","ありがとう！"])}
    else{await ME([fill('Sorry, {bp} is our price.'),fill('ごめんなさい、 {bp}コインまでです。')]);setP(b.bp);await G(["OK, OK. {bp} it is.","はいはい。 {bp}で いいよ。"])}};
  B.mean=async()=>{const I=C.info(id);const right=jaOf(I);
    const pool=C.W.filter(c=>c.ja&&jaOf(c)!==right&&(I.lv==='tr'||c.lv===I.lv));const ds=[];let n=0;while(ds.length<2&&n++<60){const d=jaOf(pickL(pool));if(d&&d!==right&&!ds.includes(d))ds.push(d)}
    const opts=H.shuffle([right,...ds]);hideJa=true;want();
    await G(pickL(SB_MEAN.ask));
    const say=j=>[SV_MEAN.say[0].replace('{ja}',j),SV_MEAN.say[1].replace('{ja}',j)];
    const pick=await choose(opts.map(j=>({t:`「${esc(j)}」<small>It means “${esc(j)}.”</small>`})),Math.random()<.2?opts.findIndex(j=>j!==right):opts.indexOf(right),`「${esc(word(I))}」の 意味は？`);
    await ME(say(opts[pick]),opts[pick]===right?'smile':'oops');hideJa=false;
    if(opts[pick]===right){ok=1;setP(Math.max(3,Math.round(pp*.85)));await G(pickL(SB_MEAN.ok))}
    else{miss=1;want();await G(SB_MEAN.hm);if(mode==='mio')await ME(SB_MEAN.oops,'oops');else{add('m',SB_MEAN.fix,'wink');await wait(900)}
      await G(["Oh, I see. Thanks!","そっか。 ありがとう！"])}
    add('nt',[`📝 ${word(I)} ＝ ${right}`])};
  const yesNo=async(ask,yes,no,right,gotR,gotW,note)=>{await G(pickL(SB_OFFER));await G(pickL(ask));
    const ch=H.shuffle([[yes,1],[no,0]]),ri=ch.findIndex(c=>c[1]===(right?1:0));
    const i=await choose(ch.map(c=>({t:optT(c[0])})),Math.random()<.15?1-ri:ri,'店長の 答えは？');
    await ME(ch[i][0],i===ri?'smile':'oops');
    if(i===ri){ok=1;if(mode==='me')sf('correct');await G(pickL(gotR))}
    else{miss=1;if(mode==='me')sf('wrong');await G(pickL(gotW));if(mode==='mio')await ME([SV_MIO.quizOops[0]+' '+ch[ri][0][0],SV_MIO.quizOops[1]+' '+ch[ri][0][1]],'laugh');else add('nt',[`💡 ${ch[ri][0][0]}（${ch[ri][0][1]}）`])}
    add('nt',[note])};
  B.rare=async()=>{const R=X.rare(id);await yesNo(SB_RARE.ask,SB_RARE.yes,SB_RARE.nope,R,R?SB_RARE.gotY:SB_RARE.gotN,R?SB_RARE.gotN:SB_RARE.gotY,SB_RARE.note)};
  B.have=async()=>{await yesNo(SB_HAVE.ask,SB_HAVE.yes,SB_HAVE.no,false,SB_HAVE.gotN,SB_HAVE.gotY,SB_HAVE.note)};
  B.oops=async()=>{await G(pickL(SB_OFFER));await wait(400);await G(pickL(SB_OOPS.g));await ME(pickL(SB_OOPS.me),'laugh');
    const nid=X.offer&&X.offer(g.G,id);if(nid){id=nid;p=X.price(id);pp=bv().bp;want()}await G(pickL(SB_OOPS.swap))};
  const runBuy=async()=>{
    if(P.k==='mean'){const I=C.info(id);if(!I||!/^[wt]$/.test(I.k)||!jaOf(I)){P.k='quick';hideJa=false;want()}}
    if(P.k==='have'&&C.owns(id))P.k='quick';
    if(mode==='mio')await ME(pickL(SB_MIO.hi),'laugh');
    if(P.pre)await chat();
    await B[P.k]();
    const r=await decideBuy();
    if(mode==='mio'&&r==='ok')await ME(pickL(night()>.6?SV_MIO.byeN:SV_MIO.bye),'laugh');
    optE.innerHTML='';
    X.bought(id,r==='ok',pp,{mode,talked:P.k!=='quick'||P.pre,ok,miss,k:P.k,poor:r==='poor',close:closeBtn})};

  /* ------------------------------------------------ run */
  const run=async()=>{
    if(P.k==='mean'){const I=C.info(id);if(!I||!/^[wt]$/.test(I.k)||!jaOf(I))P.k='quiz'}
    if(P.k==='rec'&&!id&&new Set(X.floor()).size<1)P.k='quick';
    if(!id&&P.k!=='rec'){P.k='rec'}
    if(mode==='mio'){const h=pickL(SV_MIO.hi);await ME(h,'laugh')}
    if(P.pre)await chat();
    const r=await K[P.k]();
    if(r==='no')return X.finish(id,false,0);
    if(P.end)await node(pickL(SV_END));
    if(mode==='mio')await ME(pickL(night()>.6?SV_MIO.byeN:SV_MIO.bye),'laugh');
    optE.innerHTML='';
    const talked=P.k!=='quick'||P.pre||P.end;
    X.finish(id,true,pp,{mode,tip,talked,ok,miss,k:P.k,close:closeBtn})};
  const closeBtn=()=>{if(!box.isConnected)return;optE.innerHTML=`<button class="sub svx" id="svx">とじる</button>`;$('#svx').onclick=()=>{sf('tap');box.innerHTML=''}};

  /* ------------------------------------------------ first: you, or Mio?（WAIT びょうで ミオ） */
  const I0=C.info(id);
  optE.innerHTML=`<p class="shq">${esc(nm)}が ${BUY?'カードを 売りに':'レジに'} 来たよ。 どうする？</p>
    <div class="row svwho"><button id="svme">🧑‍💼 自分で 対応</button><button id="svmio" class="mio">🙋‍♀️ ミオに まかせる</button></div>
    <div class="svcd"><i></i></div><p class="svcn" id="svcn">${WAIT}びょうで ミオが 対応するよ</p>`;
  sf('talk');
  const t0=Date.now(),bar=$('.svcd i');let cd;
  const go=m=>{clearInterval(cd);if(mode)return;mode=m;optE.innerHTML='';
    if(m==='mio'){logE.classList.add('mio');T.mio.pose='wave';T.mio.until=Date.now()+3000;
      optE.innerHTML=`<button class="sub svfast" id="svfast">⏩ はやく</button>`;$('#svfast').onclick=()=>{fast=true;sf('tap');try{speechSynthesis.cancel()}catch(e){}$('#svfast').remove()}}
    X.chose&&X.chose(m);
    (BUY?runBuy:run)().catch(e=>{if(e!==STOP)console.error(e)})};
  cd=setInterval(()=>{if(!alive()){clearInterval(cd);return}const s=(Date.now()-t0)/1000;if(bar)bar.style.width=Math.max(0,100-s/WAIT*100)+'%';
    const n=$('#svcn');if(n)n.textContent=`${Math.max(1,Math.ceil(WAIT-s))}びょうで ミオが 対応するよ`;if(s>=WAIT)go('mio')},100);
  $('#svme').onclick=()=>{sf('step');go('me')};$('#svmio').onclick=()=>{sf('step');go('mio')}}

window.SHSV={plan,serve,word,jaOf,WAIT,offer};
})();
