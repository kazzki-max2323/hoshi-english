/* 🎁 プレゼント: もちものの 品を だれかに あげる（中身は game/gift-data.js）
   - あげられる 品: 雑貨屋の プレゼント（ZAKKA.rec().gift）と リクからの お礼（TUTOR.rec().gifts）と ダブった 単語カード（game/cg-more.js）
   - あげられる 相手: ミナ先生・リク（バイトで 会ったら）・ノラさん（お店で 会ったら）・ミオ（カードショップで 会ったら）・マルコさん（食堂に 行ったら）。 浜辺の 会話は 11/20 に なくした
   - 会話: わたす ことば（小・中・高）→ 反応（4だん）→ 相手の 質問 → さいごの ひとこと → エンド。 へんな 答えでも 話は すすむ
   - 苦手だった ときに 「なにが 好き？」と 聞くと 好きな ものを 教えてくれる → 🎁 好きな物ノート に のこる
   - ミナ先生は なかよし度、 浜辺の みんなは ♥ が 上がる。 新しい エンドで コイン
   ミナ先生の セリフは この ファイルの さいご */
(()=>{
const {S:ST,sfx:SFX}=BEACH;
const H=HE,esc=H.esc,$=id=>document.getElementById(id);
const PP=GIFT_PEOPLE,TAGS=GIFT_TAGS,TAGN=GIFT_TAGN;
const pickL=a=>a[Math.random()*a.length|0];
const sf=k=>{try{SFX[k]&&SFX[k]()}catch(e){}};
const LVM={es:'小',jh:'中',hs:'高'};
const TIER=[['meh','ちょっと 苦手みたい','😅'],['ok','ふつうに うれしい','🙂'],['like','よろこんで くれた','😊'],['love','大よろこび！','😍']];

/* ---------- the record ---------- */
const GF=(()=>{try{const s=JSON.parse(localStorage.getItem(SAVE_KEY)||'{}').gift;if(s&&s.seen)return s}catch(e){}
  return {n:0,gave:{},seen:{},hint:{},end:{},fun:0}})();
/* 毎回 かわる 会話の ための きろく（2026-11-18）: last=前に あげた 品 day=あげた 日 fk=前の 展開 long=見た 長い 会話 ret=お返し from=お返しで もらった 品の 相手 ev=できごとの 回数 */
['last','day','fk','long','retDay','from','ev'].forEach(k=>{if(!GF[k])GF[k]={}});if(!GF.ret)GF.ret=0;
_saveHooks.push(()=>{const s=JSON.parse(localStorage.getItem(SAVE_KEY)||'{}');s.gift=GF;localStorage.setItem(SAVE_KEY,JSON.stringify(s))});

/* ---------- what you have ---------- */
const ZR=()=>{try{return ZAKKA.rec()}catch(e){return null}};
const TR=()=>{try{return TUTOR.rec()}catch(e){return null}};
const zItem=id=>{try{return ZAKKA.items.find(i=>i.id===id)}catch(e){return null}};
/* every present you could give: {ref, key, ico, n, w, src, wrap} (ref: 'z3' = the 4th zakka present, 't:bm' = Riku's bookmark) */
function items(){const out=[],Z=ZR(),T=TR();
  if(Z)Z.gift.forEach((g,i)=>{const it=zItem(g.id);if(it)out.push({ref:'z'+i,key:'z:'+g.id,ico:it.ico,n:it.n,w:it.w,src:'z',wrap:g.w?g:null,lux:!!it.lux})});
  if(T&&typeof TUTOR_GIFTS!=='undefined')TUTOR_GIFTS.forEach(g=>{const c=T.gifts[g[0]]||0;if(c>0)out.push({ref:'t:'+g[0],key:'t:'+g[0],ico:g[1],n:g[2],w:g[3],src:'t',cnt:c})});
  try{if(window.CGM)out.push(...CGM.giftItems())}catch(e){}   // spare word cards (game/cg-more.js)
  try{if(window.FOOD)out.push(...FOOD.giftItems())}catch(e){}   // 🍪 snacks to take home (game/food.js)
  return out}
const byRef=ref=>items().find(x=>x.ref===ref);
const has=()=>items().length>0;
/* take it out of the bag */
function useUp(it){if(it.src==='c'){try{CGM.giftUse(it)}catch(e){}return}if(it.src==='f'){try{FOOD.giftUse(it)}catch(e){}return}if(it.src==='z'){const Z=ZR(),i=+it.ref.slice(1);if(Z&&Z.gift[i])Z.gift.splice(i,1)}else{try{TUTOR.take(it.key.slice(2))}catch(e){}}save()}

/* ---------- who you can give to ---------- */
function people(){const out=['mina'];const T=TR(),Z=ZR();
  if(T&&T.met)out.push('riku');if(Z&&Z.met)out.push('nora');
  try{if(window.MIOC&&SHOP.rec().met)out.push('mio')}catch(e){}
  try{if(window.FOOD&&FOOD.rec().v)out.push('marco')}catch(e){}
  return out}
const pName=to=>PP[to].n;
const pFace=(to,ex)=>to==='mina'?MINA.face('m',ex||'smile'):to==='mio'&&window.MIO?MIO.face(({worry:'oops',happy:'laugh',love:'wink'})[ex]||'smile'):`<span class="gfi">${(to!=='riku'&&to!=='nora'&&window.KAIWA&&KAIWA.chars[to]||PP[to]).ico}</span>`;

/* how much they like it: 3 大よろこび 2 よろこぶ 1 ふつう 0 苦手 */
function tier(to,key){const p=PP[to];if(p.love.includes(key))return 3;
  const tg=TAGS[key]||[];if(tg.some(t=>p.no.includes(t)))return 0;
  const s=tg.filter(t=>p.like.includes(t)).length;return s>=2?3:s>=1?2:1}
const seen=(to,key)=>GF.seen[to]&&GF.seen[to][key];
const tierIco=t=>TIER[t][2];

/* ---------- voice (the device's reader, like the shop) ---------- */
let enVoice=null;
function pickVoice(){if(!window.speechSynthesis)return;const vs=speechSynthesis.getVoices().filter(v=>/^en[-_]/i.test(v.lang));
  enVoice=vs.find(v=>/en[-_]US/i.test(v.lang)&&/Samantha|Google|Natural/i.test(v.name))||vs.find(v=>/en[-_]US/i.test(v.lang))||vs[0]||null}
if(window.speechSynthesis){pickVoice();speechSynthesis.addEventListener&&speechSynthesis.addEventListener('voiceschanged',pickVoice)}
let talkOn=false,talkId=0,talkMax=0;
function speak(en,v){if(!ST.sound||!window.speechSynthesis)return;
  try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(sayNames(String(en).replace(/\([^)]*\)/g,'')).replace(/\.\.\.\s*/g,' '));u.lang='en-US';const pv=v&&v.pick?v.pick():null;if(pv)u.voice=pv;else if(enVoice)u.voice=enVoice;
    u.pitch=v?v.p:1;u.rate=(ST.slow?.72:.92)*(v?v.r:1);u.volume=Math.min(1,(ST.vol&&ST.vol.voice!=null)?ST.vol.voice:1);
    const id=++talkId;talkOn=true;talkMax=Date.now()+3000+String(en).length*(ST.slow?140:100)/(v?v.r:1);u.onend=u.onerror=()=>{if(id===talkId)talkOn=false};speechSynthesis.speak(u)}catch(e){talkOn=false}}
const hush=()=>{try{speechSynthesis.cancel()}catch(e){}};
const jaOn=()=>{try{return MINA.level()==='es'||!!(ZR()||{}).ja}catch(e){return true}};

/* ---------- Mina ---------- */
const minaBox=(k,v)=>{const [ex,tx]=MINA.line(k,v||{});return `<div class="kmina"><span class="lface">${MINA.face('m',ex,MINA.poseFor?MINA.poseFor(ex,tx):undefined)}</span><p>${tx}</p></div>`};

/* ================================================================ 1. what to give */
function pick(o){o=o||{};hush();const back=o.back||H.home,to=o.to,L=items();
  if(!L.length){H.toast('🎒 あげられる 品が まだ ないよ <small>雑貨屋の プレゼントや リクからの お礼を あげられるよ</small>',3800);return back()}
  H.show('gift',`<section class="pnl zk gf">
    <div class="qtop"><button class="x" id="gfx" aria-label="もどる">←</button><b>🎁 ${to?esc(pName(to))+'に ':''}なにを あげる？</b><span class="qn"></span></div>
    ${minaBox(to==='marco'&&Math.random()<.6?'gf_pickMarco':to?'gf_pickTo':'gf_pick',to?{c:pName(to)}:{})}
    <div class="gfitems">${L.map(it=>{const k=to&&seen(to,it.key)!=null?tierIco(seen(to,it.key)):'';
      return `<button data-r="${it.ref}"><span class="ri">${it.ico}</span><b>${esc(it.n)}${it.wrap?' 🎀':''}</b>${it.cnt>1?`<small>×${it.cnt}</small>`:''}${k?`<i class="gfk">${k}</i>`:''}</button>`}).join('')}</div>
    ${GF.n||Object.keys(GF.hint).length?'<div class="row"><button id="gfnote" class="sub">📔 好きな物ノート</button></div>':''}
  </section>`);
  $('gfx').onclick=()=>{sf('back');back()};
  const nb=$('gfnote');if(nb)nb.onclick=()=>{sf('book');note(()=>pick(o))};
  H.panel.querySelectorAll('[data-r]').forEach(b=>b.onclick=()=>{sf('tap');const it=byRef(b.dataset.r);if(!it)return pick(o);to?play(it,to,back):who(it,back,()=>pick(o))})}

/* ================================================================ 2. who gets it */
function who(it,back,prev){hush();if(typeof it==='string')it=byRef(it);if(!it)return back();const P=people();
  H.show('gift',`<section class="pnl zk gf">
    <div class="qtop"><button class="x" id="gfx" aria-label="もどる">←</button><b>${it.ico} ${esc(it.n)}を だれに？</b><span class="qn"></span></div>
    ${minaBox('gf_who',{n:it.n})}
    <div class="gfwho">${P.map(to=>{const s=seen(to,it.key);return `<button data-to="${to}"><span class="gff">${pFace(to,'smile')}</span><b>${esc(pName(to))}</b>${s!=null?`<i class="gfk">${tierIco(s)}</i>`:''}</button>`}).join('')}</div>
  </section>`);
  $('gfx').onclick=()=>{sf('back');(prev||back)()};
  H.panel.querySelectorAll('[data-to]').forEach(b=>b.onclick=()=>{sf('step');play(it,b.dataset.to,back)})}

/* ================================================================ 3. the talk */
let C=null;
const live=()=>C&&$('gflog');
function scrollLog(){const l=$('gflog');if(l)l.scrollTo({top:l.scrollHeight,behavior:'smooth'})}
const fill=(s)=>String(s).replace(/\{w\}/g,C.it.w).replace(/\{n\}/g,C.it.n).replace(/\{last\}/g,(C.last||{}).w||'present').replace(/\{lastj\}/g,(C.last||{}).n||'プレゼント').replace(/\{k\}/g,C.k||'');
/* 共通の セリフを その キャラの 口ぐせに（game/gift-vary.js GIFT_STYLE） */
const sty=line=>{const s=GIFT_STYLE[C.to];return s?[s.en(line[0]),s.ja(line[1]||'')]:line};
const today=()=>new Date().toDateString();
/* 重みつき くじ: [[値, 重み], …] */
const wpick=a=>{a=a.filter(x=>x[1]>0);let r=Math.random()*a.reduce((t,x)=>t+x[1],0);for(const x of a){r-=x[1];if(r<0)return x[0]}return a.length?a[a.length-1][0]:null};
/* [英, 日, ok, lv, つぎ] → えらぶ ボタン。 つぎ が [英,日] なら さいごの 返事、 {m,o} なら 会話が つづく */
function opt(o,styled){return {e:fill(o[0]),j:fill(o[1]),ok:o[2]?1:0,lv:o[3]||'',go:()=>{const nx=o[4],S=x=>styled?sty(x):x;
  if(Array.isArray(nx))said(S(nx),o[2]?'😊':'😂',o[2]?'k-good':'k-oops');
  else{them(S(nx.m),'💬');afterTalk(()=>ask(nx.o.map(x=>opt(x,styled))),300,700)}}}}
function them(line,fx,cls=''){if(!live())return;const en=fill(line[0]),ja=fill(line[1]||''),on=jaOn(),d=document.createElement('div');
  d.className='lsay kth '+cls;
  d.innerHTML=`<span class="lface kf">${pFace(C.to,C.ex)}${fx?`<i class="kfx">${fx}</i>`:''}</span><div class="lbody"><p class="ken">${esc(en)}<button class="ksay" aria-label="もう一度 きく">🔊</button></p>${ja?`<small class="kja ${on?'on':''}">${esc(ja)}</small>${on?'':'<button class="kjab">訳を 見る</button>'}`:''}</div>`;
  $('gflog').appendChild(d);
  d.querySelector('.ksay').onclick=e=>{e.stopPropagation();speak(en,PP[C.to].v)};
  const jb=d.querySelector('.kjab');if(jb)jb.onclick=()=>{sf('tap');jb.remove();d.querySelector('.kja').classList.add('on');scrollLog()};
  speak(en,PP[C.to].v);scrollLog()}
function you(en,typed){if(!live())return;const d=document.createElement('div');d.className='lsay by-h kyou-b';
  d.innerHTML=`<span class="lface kf you">⭐</span><div class="lbody"><p>${esc(en)}${typed?'<small class="kty">✍️</small>':''}</p></div>`;$('gflog').appendChild(d);scrollLog()}
function afterTalk(fn,gap=600,minMs=1000){const t0=Date.now();
  const wait=()=>{if(!live())return;const busy=ST.sound&&window.speechSynthesis&&(talkOn||speechSynthesis.speaking||speechSynthesis.pending)&&Date.now()<talkMax;
    if(busy||Date.now()-t0<minMs){setTimeout(wait,150);return}setTimeout(fn,gap)};setTimeout(wait,150)}
const EX=['worry','smile','happy','love'];

function play(it,to,back){hush();if(typeof it==='string')it=byRef(it);if(!it||!PP[to])return (back||H.home)();
  const p=PP[to],t=tier(to,it.key);
  const last=GF.last[to]&&GF.last[to].k!==it.key?GF.last[to]:null;
  C={it,to,p,t,back:back||H.home,fun:0,typed:0,step:0,hint:false,ex:'smile',opts:[],last,k:(GF.gave[to]||0)+1,ev:[],ret:null,longId:''};
  /* 11/20 ユーザー「英文が 多くて つかれる」: ふだんは さらっと（わたして → 1〜2行の 反応で おわり）。 4回に 1回くらい いつもの 長い 会話。 はじめての 1回と ○回目の 記念日は 長い ほう */
  C.short=GF.n>0&&!GIFT_COUNT[C.k]&&Math.random()<.75;
  H.show('gift',`<section class="pnl lsn kw zk gf" data-stay>
    <div class="qtop"><button class="x" id="gfx" aria-label="やめる">←</button><b>🎁 ${esc(p.n)}に ${it.ico}</b><span class="qn" id="gfq"></span></div>
    <div class="lslog kwlog" id="gflog"></div>
    <div id="gfans" class="kans"></div>
  </section>`);
  $('gfx').onclick=()=>{sf('back');hush();const b=C.back;C=null;b()};
  setTimeout(()=>opener(),300)}

/* ---------- はじまり（毎回 かわる） ---------- */
function opener(){const {p,it,to}=C,O=GIFT_OPEN;
  if(C.short){const lv=(()=>{try{const l=MINA.level();return l==='adv'?'hs':l}catch(e){return 'es'}})(),a=GIFT_HAND.filter(x=>x[0]===lv),h=pickL(a.length?a:GIFT_HAND);
    $('gfq').textContent='🎁';you(h[1]);sf('step');return setTimeout(()=>{if(live())react()},650)}
  const k=GF.n===0?'hi':wpick([['hi',3],['you',2],['eyes',1.5],['guess',1.5],['wrap',it.wrap?4:0],['again',GF.day[to]===today()?4:0],['mem',C.last&&C.last.t>=2?2:0]]);
  if(k!=='hi')C.ev.push('o_'+k);
  const lvOpts=(a,fun,go,fgo)=>{const o=a.map(x=>({e:x[0],j:x[1],ok:1,lv:x[2],go}));if(fun){const f=pickL(fun);o.splice(Math.random()*(o.length+1)|0,0,{e:f[0],j:f[1],ok:0,go:fgo})}return o};
  const huh=(a,fn)=>()=>{them(sty(pickL(a)),'😅','k-oops');afterTalk(fn,300,600)};
  if(k==='hi'){them(p.hi,'❓');afterTalk(()=>ask(handOpts()),300,700)}
  else if(k==='you'){const nx=()=>afterTalk(()=>ask(handOpts()),300,700);
    ask(lvOpts(shuffle(O.you.me.slice()).slice(0,3),O.you.fun,()=>{them(sty(pickL(O.you.them)),'😊');nx()},huh(O.you.huh,()=>ask(handOpts()))))}
  else if(k==='eyes')ask(lvOpts(O.eyes.me,null,()=>{them(sty(pickL(O.eyes.them)),'🙈');
      afterTalk(()=>ask(lvOpts(O.eyes.open,O.eyes.fun,react,huh(O.eyes.huh,react))),300,700)}));
  else if(k==='guess')ask(lvOpts(O.guess.me,O.guess.fun,()=>{const tg=TAGS[it.key]||[],hits=O.guess.any.filter(g=>tg.includes(g[2]));
      const g=hits.length&&Math.random()<.45?pickL(hits):pickL(O.guess.any),hit=tg.includes(g[2]);C.ev.push(hit?'g_hit':'g_miss');
      them(sty(g),'🤔');afterTalk(()=>ask(lvOpts(hit?O.guess.hit:O.guess.miss,null,hit?()=>{them(sty(pickL(O.guess.hitThem)),'😆','k-good');afterTalk(react,300,600)}:react)),300,700)},
    huh(O.guess.huh,()=>ask(handOpts()))));
  else if(k==='wrap'){them(sty(pickL(O.wrap.them)),'🎀');afterTalk(()=>ask(lvOpts(O.wrap.me,O.wrap.fun,react,huh(O.wrap.huh,react))),300,700)}
  else if(k==='again'){them(sty(pickL(O.again.them)),'😳');afterTalk(()=>ask(lvOpts(shuffle(O.again.me.slice()),O.again.fun,react,huh(O.again.huh,react))),300,700)}
  else {them(sty(pickL(O.mem.them)),'😊');afterTalk(()=>ask(handOpts()),300,700)}}

/* the choices: [english, japanese, ok, level, what happens] */
function handOpts(){const tg=TAGS[C.it.key]||[],tl=[].concat(...tg.map(t=>GIFT_HAND_TAG[t]||[]));
  const o=['es','jh','hs'].map(lv=>{const a=GIFT_HAND.concat(GIFT_HAND_X).filter(x=>x[0]===lv),b=tl.filter(x=>x[0]===lv);
    const h=b.length&&Math.random()<.4?pickL(b):pickL(a);return {e:h[1],j:h[2],ok:1,lv,go:react}});
  const f=pickL(GIFT_HAND_FUN);o.splice(Math.random()*4|0,0,{e:f[0],j:f[1],ok:0,go:()=>{them(sty(pickL(GIFT_HAND_HUH)),'😅','k-oops');afterTalk(react,300,600)}});return o}
function ask(opts,hint){if(!live())return;C.opts=opts;C.step++;$('gfq').textContent='💬 '+C.step;const on=jaOn();
  $('gfans').innerHTML=`${hint?`<p class="khint">💡 たとえば：<b>${esc(hint)}</b></p>`:''}
    <div class="lopts kopts zkopts">${opts.map((o,i)=>`<button data-o="${i}">${o.lv?`<i class="zlv zlv-${o.lv}">${LVM[o.lv]}</i> `:''}${esc(o.e)}${on&&o.j?`<small>${esc(o.j)}</small>`:''}</button>`).join('')}</div>`;
  $('gfans').querySelectorAll('[data-o]').forEach(b=>b.onclick=()=>choose(+b.dataset.o));}
function typed(v){if(!live())return;let i=-1;try{[i]=KAIWA.match(v,C.opts.map(o=>[o.e,o.ok,0,0,0,null]))}catch(e){}
  if(i<0){you(v,true);$('gfans').innerHTML='';
    setTimeout(()=>{them(["Sorry? Could you say that again?","ごめん、 もう一回 言って くれる？"],'❓','k-huh');const g=C.opts.filter(o=>o.ok);setTimeout(()=>ask(C.opts,pickL(g.length?g:C.opts).e),500)},600);return}
  C.typed++;choose(i,v)}
function choose(i,typedText){if(!live())return;const o=C.opts[i];$('gfans').innerHTML='';you(typedText||o.e,!!typedText);
  if(!o.ok){C.fun++;sf('tease')}else sf('step');
  setTimeout(()=>{if(live())o.go(o)},550)}

/* their face and words when they see it */
function react(){const {p,t,it,to}=C;C.ex=EX[t];let line=pickL(p.r[t]),fx=TIER[t][2];
  /* the present the shop made for them, Riku's own present, Nora's own goods */
  const ZT=typeof ZAKKA_THANKS!=='undefined'&&ZAKKA_THANKS[to];
  if(ZT&&it.src==='z'){const id=it.key.slice(2),a=Array.isArray(ZT)?(zItem(id)&&zItem(id).to===to?ZT:null):ZT[id];if(a&&a.length){line=pickL(a);fx='😍'}}
  if(to==='riku'&&it.src==='t'){line=p.own;fx='😆'}
  if(to==='nora'&&it.src==='z'){them(p.shop,'😆');afterTalk(()=>{them(line,fx,t>=2?'k-good':'');after()},300,700);return}
  t>=2?sf('pickup'):t===1?sf('step'):sf('tease');
  them(line,fx,t>=2?'k-good':t===0?'k-oops':'');
  const tg=(TAGS[it.key]||[]).filter(x=>GIFT_SEE[x]);
  if(it.wrap&&t>=1&&!C.ev.includes('o_wrap'))afterTalk(()=>{them(sty(["And the wrapping is beautiful, too!","つつみ紙も すてき！"]),'🎀','k-good');after()},300,700);
  else if(t>=2&&tg.length&&Math.random()<.35)afterTalk(()=>{them(sty(pickL(GIFT_SEE[pickL(tg)])),'✨','k-good');after()},300,700);
  else after()}
/* ---------- そのあとの 展開（毎回 かわる。 前回と 同じ 展開は 出にくい） ---------- */
/* さらっと の おわり: 苦手な ときは ときどき 好きな ものを 教えてくれる・たまに お返し */
function shortEnd(){const {t,to,p}=C;C.ev.push('f_quick');
  if(t===0&&Math.random()<.5){C.hint=true;const nw=!GF.hint[to];GF.hint[to]=p.hint[2];save();them(p.hint,'💡','k-good');
    if(nw)setTimeout(()=>H.toast(`📔 ${esc(p.n)}の 好きな もの：<b>${esc(TAGN[p.hint[2]])}</b><small>好きな物ノートに のこしたよ</small>`,3400),900);return afterTalk(end,500,900)}
  const R=GIFT_RETURN[to]||GIFT_RETURN['*'],ch=GF.retDay[to]===today()?0:t>=2?.15:0;
  if(R&&Math.random()<ch){const r=pickL(R);C.ev.push('ret');them(GIFT_RETURN[to]?r.m:sty(r.m),'🎁','k-good');giveBack(r);return afterTalk(end,500,900)}
  end()}
function after(){if(C.short)return afterTalk(shortEnd,400,700);afterTalk(()=>{const {t,to,it}=C,fk=GF.fk[to];
  const tg=(TAGS[it.key]||[]).filter(x=>GIFT_TOPIC[x]),L=longs(),cnt=GIFT_COUNT[C.k];
  const w=t===0?[['meh',6],['topic',tg.includes('dog')?2:0],['none',1]]
    :[['where',t>=2?3:1],['why',t===1?3:1.5],['topic',tg.length?3:0],['mem',C.last?2:0],['count',cnt?12:0],['long',L.length?(L.some(x=>!GF.long[x.id])?2:.8):0],['none',1.5],['quick',1]];
  const k=wpick(w.map(x=>[x[0],x[0]===fk?x[1]*.3:x[1]]));C.fk=k;C.ev.push('f_'+k);
  ({meh:askMeh,where:askWhere,why:askWhy,none:closing,quick:end,
    topic:()=>{const tp=pickL(GIFT_TOPIC[C.t===0?'dog':pickL(tg)]);them(sty(tp.q),'❓');afterTalk(()=>ask(shuffle(tp.o.map(o=>opt(o,true)))),300,700)},
    mem:()=>{const m=pickL(GIFT_MEM);them(sty(m.q),'💭');afterTalk(()=>ask(shuffle(m.o.map(o=>opt(o,true)))),300,700)},
    count:()=>{them(sty(cnt),'🎉','k-good');afterTalk(()=>ask(shuffle(GIFT_COUNT_O.map(o=>opt(o,true)))),300,700)},
    long:()=>{const un=L.filter(x=>!GF.long[x.id]),l=pickL(un.length?un:L),own=!!GIFT_LONG[to]&&GIFT_LONG[to].includes(l);
      C.longId=l.id;them(own?l.m:sty(l.m),'💬');afterTalk(()=>ask(l.o.map(o=>opt(o,!own))),300,700)}})[k]()},500,900)}
const longs=()=>{const {t,to}=C,ok=l=>l.when!=='good'||t>=2;return (GIFT_LONG[to]||[]).filter(ok).concat(to==='mina'||to==='mio'?[]:(GIFT_LONG['*']||[]).filter(ok))};

/* the second question */
const src=()=>C.it.src;
function askWhere(){const {p,to}=C;them(Math.random()<.4?sty(pickL(GIFT_WHERE_Q)):p.ask,'❓');
  const o=[];
  if(src()==='z'||src()==='f')o.push(to==='nora'?{e:"I bought it at your shop!",j:"あなたの お店で 買ったんだよ！",ok:1,lv:'es',go:()=>said(["I know! Ha ha. You're my best customer.","知ってるわよ！ あはは。 いちばんの お客さんね。"])}
    :{e:"I bought it at Nora's shop by the beach.",j:"浜辺の ノラさんの お店で 買ったよ。",ok:1,lv:'jh',go:()=>said(["Nora's shop! I should go there sometime.","ノラさんの お店！ こんど 行って みよう。"])});
  else if(GF.from[C.it.key]&&GF.from[C.it.key]!=='riku')o.push(GF.from[C.it.key]===to?{e:"You gave it to me, remember?",j:"あなたが くれたんだよ、 おぼえてる？",ok:1,lv:'jh',go:()=>said(sty(["Oh! Ha ha! It came back to me!","あ！ あはは！ もどってきた！"]),'😆')}
    :{e:"A friend on the beach gave it to me.",j:"浜辺の 友だちが くれたの。",ok:1,lv:'jh',go:()=>said(sty(["A present from a present! How nice.","プレゼントの プレゼント！ すてき。"]))});
  else o.push(to==='riku'?{e:"You gave it to me, remember?",j:"きみが くれたんだよ、 おぼえてる？",ok:1,lv:'jh',go:()=>said(["Oh yeah! Ha ha! Now it's a present again!","そうだった！ あはは！ また プレゼントに なった！"])}
    :{e:"Riku gave it to me. I teach him English.",j:"リクが くれたの。 英語を 教えてるんだ。",ok:1,lv:'hs',go:()=>said(["You teach English? That's amazing!","英語を 教えてるの？ すごい！"])});
  o.push({e:"It's a secret.",j:"ひみつ。",ok:1,lv:'es',go:()=>said(["A secret? Ha ha, OK. I like secrets.","ひみつ？ あはは、 わかった。 ひみつって すてき。"])});
  o.push({e:"I made it myself!",j:"自分で 作ったんだ！",ok:0,go:()=>said(src()==='z'||src()==='f'?["Really? ...There's a price tag on it. Ha ha!","ほんと？ …値札が ついてるよ。 あはは！"]:["Really? ...It looks like a kid made it! Ha ha!","ほんと？ …子どもが 作ったみたい！ あはは！"],'😂','k-oops')});
  o.push({e:"It fell from the moon.",j:"月から おちてきたの。",ok:0,go:()=>said(C.p.fun,'😂','k-oops')});
  ask(shuffle(o))}
function askWhy(){const {p}=C;them(p.why,'❓');
  const W=GIFT_WHY_O,g=shuffle(W.filter(x=>x[2])).slice(0,3),f=pickL(W.filter(x=>!x[2]));
  ask(shuffle(g.concat([f]).map(o=>opt(o,true))))}
function askMeh(){
  ask(shuffle([{e:"You don't like it, do you?",j:"気に いらなかった よね？",ok:1,lv:'jh',go:()=>{them(["To be honest, it's not really my thing. But I'm happy you thought of me.","正直に いうと、 ちょっと ちがうかな。 でも 思い出して くれて うれしい。"],'🙂');afterTalk(hint,300,700)}},
    {e:"What kind of things do you like?",j:"どんな ものが 好き？",ok:1,lv:'jh',go:hint},
    {e:"What do you like?",j:"なにが 好き？",ok:1,lv:'es',go:hint},
    {e:"Then give it back!",j:"じゃあ かえして！",ok:0,go:()=>said(["Ha ha! No, no, I'll keep it. A present is a present!","あはは！ だめ だめ、 もらっとく。 プレゼントは プレゼント！"],'😂','k-oops')}]))}
function hint(){const {p,to}=C;C.hint=true;const nw=!GF.hint[to];GF.hint[to]=p.hint[2];save();
  them(p.hint,'💡','k-good');if(nw)setTimeout(()=>H.toast(`📔 ${esc(p.n)}の 好きな もの：<b>${esc(TAGN[p.hint[2]])}</b><small>好きな物ノートに のこしたよ</small>`,3400),900);
  afterTalk(closing,500,900)}
function said(line,fx,cls){them(line,fx||'😊',cls||'k-good');afterTalk(maybeRet,500,900)}

/* ---------- お返し（たまに。 同じ 人からは 1日 1回まで） ---------- */
function maybeRet(){const {t,to}=C,R=GIFT_RETURN[to]||GIFT_RETURN['*'];
  const ch=GF.n<1||GF.retDay[to]===today()?0:t>=2?.22:t===1?.08:0;
  if(!R||Math.random()>=ch)return closing();
  const r=pickL(R),own=!!GIFT_RETURN[to];C.ev.push('ret');
  them(own?r.m:sty(r.m),'🎁','k-good');
  afterTalk(()=>ask(shuffle(GIFT_RETURN_O.map(x=>({e:x[0],j:x[1],ok:1,lv:x[3],go:()=>{giveBack(r);afterTalk(closing,400,800)}})))),300,700)}
function giveBack(r){const {to}=C;GF.retDay[to]=today();GF.ret++;let ico='🪙',n='';
  if(r.k==='c'){try{H.addCoins(r.n)}catch(e){}n=`${r.n}コイン`}
  else if(r.k==='f'){try{FOOD.add(r.id);const s=FOOD_SNACKS[r.id];ico=s.ico;n=s.n}catch(e){}}
  else {try{const T=TUTOR.rec();T.gifts[r.id]=(T.gifts[r.id]||0)+1;const g=TUTOR_GIFTS.find(x=>x[0]===r.id);ico=g[1];n=g[2];GF.from['t:'+r.id]=to}catch(e){}}
  C.ret={ico,n};save();sf('coin');
  H.toast(`🎁 ${esc(pName(to))}から お返し： ${ico} <b>${esc(n)}</b><small>${r.k==='c'?'コインが ふえたよ':'🎒 もちものに 入れたよ'}</small>`,3200)}

/* the last word */
function closing(){const {t,p}=C;
  if(Math.random()<.18){C.ev.push('c_skip');return end()}
  const X=t>=2?GIFT_CLOSE_X.good:GIFT_CLOSE_X.meh;
  if(Math.random()<.5){const x=pickL(X),o=closeOpts(t,p);const i=o.findIndex(y=>y.ok&&y.lv===x[3]);if(i>=0)o[i]={e:x[0],j:x[1],ok:1,lv:x[3],go:end};return ask(shuffle(o))}
  ask(shuffle(closeOpts(t,p)))}
function closeOpts(t,p){
  if(t>=2)return ([{e:"You're welcome.",j:"どういたしまして。",ok:1,lv:'es',go:end},{e:"I'm glad you like it.",j:"気に いって もらえて よかった。",ok:1,lv:'jh',go:end},{e:"It's my pleasure.",j:"よろこんで。（どういたしまして）",ok:1,lv:'hs',go:end},
    {e:"That'll be 100 coins, please.",j:"100コインに なります。",ok:0,go:()=>{them(p.fun,'😂','k-oops');afterTalk(end,300,700)}}]);
  return ([{e:"No problem.",j:"いいって ことよ。",ok:1,lv:'es',go:end},{e:"Next time, I'll find something you'll love.",j:"つぎは もっと 好きな ものを 見つけるね。",ok:1,lv:'jh',go:end},t===0?{e:"Thanks for being honest.",j:"正直に 言って くれて ありがとう。",ok:1,lv:'hs',go:end}:{e:"I'm glad I could make you smile.",j:"わらって もらえて よかった。",ok:1,lv:'hs',go:end},
    {e:"Can I have it back?",j:"やっぱり かえして もらえる？",ok:0,go:()=>{them(p.fun,'😂','k-oops');afterTalk(end,300,700)}}])}
function shuffle(a){for(let i=a.length-1;i>0;i--){const j=Math.random()*(i+1)|0;[a[i],a[j]]=[a[j],a[i]]}return a}

/* ================================================================ 4. the end */
function end(){if(!live())return;const {p,t,it,to}=C;
  const BX=t>=2?GIFT_BYE_X.good:GIFT_BYE_X.ok;
  if(!C.short)them(Math.random()<.35?sty(pickL(BX)):t>=2?p.bye[0]:p.bye[1],t>=2?'💕':'👋',t>=2?'k-good':'');
  GF.last[to]={k:it.key,n:it.n,w:it.w,t};GF.day[to]=today();if(C.fk)GF.fk[to]=C.fk;if(C.longId)GF.long[C.longId]=1;
  C.ev.forEach(e=>GF.ev[e]=(GF.ev[e]||0)+1);
  useUp(it);
  const key=C.fun>=2?'fun':TIER[t][0],ek=to+':'+key,newEnd=!GF.end[ek];GF.end[ek]=1;
  const firstSeen=seen(to,it.key)==null;(GF.seen[to]=GF.seen[to]||{})[it.key]=t;
  GF.n++;GF.gave[to]=(GF.gave[to]||0)+1;if(C.fun)GF.fun+=C.fun;
  try{RECENT.add('gift',{to,toN:(PP[to]||{}).n||'',en:it.w||'',ja:it.n||'',ico:it.ico||'',tier:t})}catch(e){}
  /* なかよし */
  let heart='';
  if(to==='mina'){const pts=it.lux?30:[1,3,6,10][t];try{MOTI.gain(pts)}catch(e){}heart=`❤️ ミナ先生と なかよし +${pts}`;try{const lh=window.LOVE?LOVE.gift(t,it):'';if(lh)heart+=`　${lh}`}catch(e){}}
  else if(to==='mio'&&window.MIOC){heart=MIOC.gain([1,1,2,3][t],'gift')}
  else if(window.KAIWA&&KAIWA.chars[to]){const K=KAIWA.rec(),add=t>=2?2:1;K.heart[to]=(K.heart[to]||0)+add;heart=`${KAIWA.chars[to].ico} ${esc(p.n)}と なかよし ${'♥'.repeat(add)}`}
  else heart=`${PP[to].ico} ${esc(p.n)}、 ${t>=2?'とても よろこんでた':'よろこんでた'}`;
  try{window.MIOSP&&MIOSP.gift(to,it)}catch(e){}
  const coins=newEnd?(t>=2?5:3):0;
  save();
  const title=key==='fun'?'わらいの プレゼント':TIER[t][1],good=key!=='fun'&&t>=2;
  /* what Mina says */
  let k=to==='mina'?['gf_minaMeh','gf_minaOk','gf_minaLike','gf_minaLove'][t]:key==='fun'?'gf_endFun':['gf_endMeh','gf_endOk','gf_endLike','gf_endLove'][t];
  if(C.hint&&to!=='mina')k='gf_endHint';
  /* きょうの 展開に 合わせた ひとこと（7わり） */
  const EVK=[['ret','gf_endRet'],['f_long','gf_endLong'],['f_count','gf_endCount'],['o_eyes','gf_endEyes'],['g_hit','gf_endGuess'],['g_miss','gf_endGuess'],['o_again','gf_endAgain'],['o_mem','gf_endMem'],['f_mem','gf_endMem'],['f_topic','gf_endTopic'],['o_wrap','gf_endWrap'],['o_you','gf_endYou'],['f_quick','gf_endQuick'],['f_none','gf_endQuick'],['c_skip','gf_endQuick']].find(x=>C.ev.includes(x[0]));
  if(EVK&&!C.hint&&Math.random()<.7)k=EVK[1];
  if(GF.n===1)k='gf_endFirst';if(C.typed>=2)k='gf_endTyped';
  const v={c:p.n,n:it.n,w:it.w,like:TAGN[GF.hint[to]]||'',k:C.k,r:C.ret?C.ret.n:'',last:C.last?C.last.n:''};
  const ends=['love','like','ok','meh','fun'],got=ends.filter(e=>GF.end[to+':'+e]).length;
  setTimeout(()=>{if(!live())return;$('gfq').textContent=good?'★':'🏁';
    $('gfans').innerHTML=`<div class="kres">
      <p class="kend ${good?'good':'fun'}">${good?'★':key==='fun'?'😂':'🎁'} 「${esc(title)}」${newEnd?' <small>NEW!</small>':''}</p>
      <p class="zkheart">${heart}</p>
      ${C.ret?`<p class="zkheart">🎁 お返し： ${C.ret.ico} ${esc(C.ret.n)}</p>`:''}
      ${coins?`<p class="kpay">🪙 <b>${coins}まい</b> <small>新しい 反応</small></p>`:''}
      <details class="mfold"><summary>${PP[to].ico} ${esc(p.n)}の 反応 <small>${got}/${ends.length}</small></summary><div class="kends" style="padding:0 10px 10px">${ends.map(e=>{const T=e==='fun'?['fun','わらいの プレゼント','😂']:TIER.find(x=>x[0]===e);return GF.end[to+':'+e]?`<span class="${e==='love'||e==='like'?'g':''} ${e===key?'now':''}">${T[2]} ${esc(T[1])}</span>`:'<span class="no">？ ？？？</span>'}).join('')}</div></details>
      ${minaBox(k,v)}
      <div class="row">${has()?'<button id="gfmore" class="sub">🎁 ほかの 品も あげる</button>':''}<button id="gfok" data-back>もどる</button></div>
    </div>`;
    if(coins){const r=$('gfans').getBoundingClientRect();H.coinBurst(r.left+r.width/2,r.top+20,coins)}
    good?sf('done'):sf('pop');
    const b=C.back;
    $('gfok').onclick=()=>{sf('back');hush();C=null;b()};
    const m=$('gfmore');if(m)m.onclick=()=>{sf('step');hush();C=null;pick({back:b})};
    setTimeout(()=>$('gfans').scrollIntoView({behavior:'smooth',block:'end'}),100)},1500)}

/* ================================================================ 📔 好きな物ノート */
function note(back){hush();const P=people();
  const rows=P.map(to=>{const p=PP[to],S=GF.seen[to]||{},ks=Object.keys(S);
    const love=ks.filter(k=>S[k]>=2),meh=ks.filter(k=>S[k]===0);const ico=k=>{const tg=k.split(':');if(tg[0]==='z'){const it=zItem(tg[1]);return it?it.ico:'🎁'}const g=(typeof TUTOR_GIFTS!=='undefined'?TUTOR_GIFTS:[]).find(x=>x[0]===tg[1]);return g?g[1]:'🎁'};
    return `<div class="ritem zkbi gfnr"><span class="ri gff">${pFace(to,'smile')}</span><span class="rn"><b>${esc(p.n)}</b><small>${GF.hint[to]?`💡 ${esc(TAGN[GF.hint[to]])}が 好き　`:''}${love.length?`😊 ${love.map(ico).join('')}　`:''}${meh.length?`😅 ${meh.map(ico).join('')}`:''}${!ks.length&&!GF.hint[to]?'まだ わからない':''}</small></span></div>`}).join('');
  H.show('gift',`<section class="pnl zk gf">
    <div class="qtop"><button class="x" id="gfx" aria-label="もどる">←</button><b>📔 好きな物ノート</b><span class="qn">🎁 ${GF.n}</span></div>
    ${minaBox('gf_note',{})}
    <div class="zkbag">${rows}</div>
    <p class="note">苦手だった ときに 「What do you like?」と 聞くと、 好きな ものを 教えて くれるよ</p>
  </section>`);
  $('gfx').onclick=()=>{sf('back');back()}}

/* ================================================================ ミナ先生の セリフ */
Object.assign(MINA_LINES,{
 gf_pick:[['smile','だれかに プレゼント？ すてき。 わたす ときは 「This is for you.」 だよ'],['happy','どれに する？ 相手の 好きな ものを 思い出して えらんでみて'],['think','リクくんの お礼も、 だれかに あげられるよ。 よろこぶ 人が いるかも']],
 gf_pickTo:[['smile','{c}に プレゼント？ なにが 好きか 考えて えらんでみよう'],['happy','{c}、 よろこんで くれると いいね。 😍が ついてる 品は 前に 大よろこび だったよ']],
 gf_who:[['smile','{n}、 だれに あげる？ 人に よって 好きな ものが ちがうんだ'],['think','前に あげた ことが ある 人には 顔マークが つくよ。 😍は 大よろこび、 😅は ちょっと 苦手'],['happy','ポチは 食べもの、 ミケは 魚が 好きみたい… かも？']],
 gf_endLove:[['wow','{c}、 大よろこび だったね！ 好きな ものを 知ってるって、 なかよしの しるしだよ'],['happy','「{n}」、 ぴったりの プレゼント だったね。 相手の 顔を 見るのも 英語の 勉強だよ']],
 gf_endLike:[['smile','{c}、 よろこんでたね。 「I\'m glad you like it.」は お礼を 言われた ときに つかえるよ'],['happy','いい プレゼント だったね。 「Where did you get it?」って 聞かれたら どこで 買ったか 言えると いいよ']],
 gf_endOk:[['smile','ふつうに うれしかった みたい。 「Why did you choose this?」には 「I thought you might like it.」が 言いやすいよ'],['think','{c}の 好きな もの、 ほかに なにが あるかな。 いろいろ ためして みよう']],
 gf_endMeh:[['think','ちょっと 苦手 だったね。 でも 「What do you like?」って 聞けば 教えて くれるよ'],['smile','苦手でも、 「It\'s the thought that counts.」＝「気持ちが だいじ」。 英語でも よく 言うんだ']],
 gf_endHint:[['proud','{c}は 「{like}」が 好きなんだね。 聞けた から わかったんだよ。 えらい！'],['happy','「What do you like?」で 好きな ものが わかったね。 つぎは {like}を あげてみよう']],
 gf_endFun:[['happy','{c}、 わらってたね。 へんな 答えでも 会話は つづくよ'],['think','あはは、 じょうだんの プレゼントに なっちゃった。 つぎは ちゃんと 「This is for you.」で わたしてみて']],
 gf_endFirst:[['love','はじめての プレゼント！ 「This is for you.」 ちゃんと 言えたね。 好きな物ノートに 反応が のこるよ'],['happy','プレゼントって、 英語で 話す いい きっかけに なるでしょ？ ほかの 人にも あげてみて']],
 gf_endTyped:[['wow','自分で 英語を 書いて わたしたの？ それが いちばん 力が つくよ'],['proud','えらぶ だけじゃ なくて 自分の ことばで 言えたね！']],
 gf_minaLove:[['love','…えへへ。 ほんとに うれしかった。 ありがとう。 「I saw this and thought of you.」って 言われると、 だれでも うれしいんだよ'],['love','わたしの 好きな もの、 おぼえてて くれたの？ もう… 先生、 きょうは ずっと にこにこ しちゃう']],
 gf_minaLike:[['happy','ありがとう！ 机に かざって おくね。 「I\'m glad you like it.」も ちゃんと 言えてたよ'],['smile','プレゼント、 うれしかった。 お礼を 言われたら 「You\'re welcome.」 だね']],
 gf_minaOk:[['smile','ありがとう！ 気持ちが うれしいよ。 「Thank you for thinking of me.」って 言う ことも あるんだ'],['happy','あなたが えらんで くれた ことが うれしいな']],
 gf_minaMeh:[['worry','あはは… ありがとう！ 犬の ものは ポチに あげると よろこぶかもね'],['smile','気持ちは ちゃんと 受けとったよ。 こんどは あまい ものが いいな… なんてね']],
 gf_note:[['smile','みんなの 好きな もの、 少しずつ わかってきたね'],['think','苦手だった 人には 「What do you like?」と 聞いてみよう。 教えて くれるよ']],
 x_gfHave:[['smile','{n}、 だれかに あげてみない？ 「This is for you.」で わたせるよ'],['happy','もちものに {n}が あるよ。 プレゼントすると 英語の 会話が はじまるんだ']],
 x_gfHint:[['think','{c}は {like}が 好き なんだって。 なにか あげてみたら？'],['smile','好きな物ノートに よると、 {c}は {like}が 好きみたい']],
 x_gfRiku:[['smile','リクくんの お礼、 売る だけじゃ なくて だれかに あげても いいんだよ'],['happy','リクくんに もらった {n}、 よろこぶ 人が いるかも。 だれに あげる？']],
 x_gfBtn:[['smile','わたしや リクくん、 ノラさん、 マルコさんの 画面の 右上に 🎁あげる が あるよ。 会いに 行った ついでに わたせるんだ'],['happy','もちものを 開かなくても、 相手の 画面の 🎁から すぐ プレゼント できるよ']],
 x_gfMarco:[['think','食堂の マルコさん、 むかしは 船の コック さん だったんだって。 海の ものや 食べものが 好きそう…'],['smile','マルコさんに なにか あげてみたら？ 食堂の 右上の 🎁から わたせるよ。 「This is for you.」 だよ']],
 gf_pickMarco:[['smile','マルコさんは 料理の プロ。 食べものを あげるなら 「I hope you like it.」って そえて みて'],['think','元・船の コックさん だから、 海や 旅に かんけいの ある ものが いいかも？']],
 gf_endRet:[['wow','{c}から お返しを もらったね！ 「You didn\'t have to!」＝「いいのに！」は お返しを もらった ときの 決まり文句だよ'],['happy','プレゼントが プレゼントを つれてきたね。 「{r}」、 もちものに 入ってるよ'],['smile','お返しを もらったら 「Thank you. I\'ll treasure it.」 大切に するね、 って 言えると すてき']],
 gf_endLong:[['happy','{c}と たくさん 話せたね。 プレゼントは 長い おしゃべりの きっかけに なるんだ'],['proud','きょうは 会話が 長く つづいたね。 答えに あわせて 話が かわるから、 また ちがう 答えも ためしてみて'],['love','あんな 話が 聞けるなんて。 {c}の こと、 また ひとつ くわしく なったね']],
 gf_endCount:[['wow','{c}に {k}回目の プレゼント！ 「This is the third present.」みたいに、 何番目かは third・fifth で 言うんだよ'],['happy','{k}回も あげてるんだね。 {c}、 ちゃんと 数えてたよ']],
 gf_endEyes:[['happy','「Close your eyes!」「Open your eyes!」 サプライズの 英語、 ばっちりだね'],['smile','目を とじてもらう わたし方、 ドキドキするでしょ？ 「No peeking!」＝「のぞかないでね！」も 言えるよ']],
 gf_endGuess:[['happy','「Guess what I have!」 当てっこ すると 会話が もりあがるね'],['think','「Is it something to eat?」みたいに、 Is it ～? で 当てる 質問が できるよ。 こんど 自分でも 聞いてみて']],
 gf_endAgain:[['smile','きょう 2回目の プレゼント だったね。 「Another one?」＝「また？」って おどろいてたね'],['happy','毎日 だって あげて いいんだよ。 「Every day is special.」なんて 言えたら かっこいいね']],
 gf_endMem:[['love','{c}、 前に もらった {last}の こと おぼえてたね。 大事に してくれてるんだ'],['smile','「I still have the ～ you gave me.」＝「前に くれた ～、 まだ もってるよ」。 お礼の 気持ちが つたわる 言い方だよ']],
 gf_endTopic:[['happy','品物の 話で もりあがったね。 「How does it look on me?」「Can you play it?」… 品に よって 質問が かわるんだ'],['think','プレゼントの あとに 「Have you tried it?」「Let\'s share it.」 そんな 会話が できると 自然だよ']],
 gf_endWrap:[['happy','つつんで あげると 「Can I open it now?」って 聞かれるね。 答えは 「Sure! Open it!」 だよ'],['smile','ラッピングも プレゼントの うち。 「Go ahead.」＝「どうぞ」も 言えたね']],
 gf_endYou:[['smile','自分から 「Do you have a minute?」って 話しかけたね。 話の はじめ方、 じょうずだよ'],['happy','「Can I give you something?」で 話を はじめるのも いいね']],
 gf_endQuick:[['smile','きょうは さらっと わたせたね。 短くても 気持ちは ちゃんと つたわるよ'],['smile','プレゼントは ふだん さらっと わたせるよ。 4回に 1回くらいは ゆっくり おしゃべりに なるから、 お楽しみに'],['happy','あっさり 受けとって もらえたね。 毎回 ちがう 会話に なるから、 また あげてみて']],
 x_gfRet:[['happy','この前 {c}から お返し もらったんでしょ？ プレゼントって まわっていくんだね'],['smile','お返しの 品、 もちものに 入ってるよ。 だれかに また あげても いいんだ']],
 x_gfVary:[['think','プレゼントの 会話、 毎回 ちがうでしょ？ 目を とじて もらったり、 当てっこ したり。 いろんな 英語が 出てくるよ'],['smile','同じ 人に 何回も あげると、 前の 品の 話を してくれる ことも あるよ']],
 x_gfMina:[['love','ねえ… わたしにも なにか くれるの？ …なんてね。 えへへ'],['smile','プレゼントを わたす 英語、 3つ 言える？ 「This is for you.」「I got this for you.」「I saw this and thought of you.」']]
});
if(window.MINA_SENSE&&MINA_SENSE._rules)MINA_SENSE._rules.push(
 ['x_gfRet',2,()=>{const to=Object.keys(GF.retDay).find(k=>GF.retDay[k]===today()&&PP[k]);return to?{c:pName(to)}:null},()=>['🎒 もちもの',()=>{try{ZAKKA.bag(H.home)}catch(e){pick()}}]],
 ['x_gfVary',2,()=>has()&&GF.n>=2&&GF.n<15?{}:null,()=>['🎁 あげる',()=>pick()]],
 ['x_gfHave',4,()=>{const L=items();if(!L.length)return null;const it=pickL(L);return {n:it.n,_r:it.ref}},v=>['🎁 あげる',()=>who(v._r,H.home)]],
 ['x_gfHint',2,()=>{const P=people().filter(to=>GF.hint[to]&&to!=='mina');if(!P.length||!has())return null;const to=pickL(P);return {c:pName(to),like:TAGN[GF.hint[to]],_to:to}},v=>['🎁 あげる',()=>pick({to:v._to})]],
 ['x_gfRiku',2,()=>{const L=items().filter(x=>x.src==='t');if(!L.length||GF.n>2)return null;return {n:pickL(L).n}},()=>['🎁 あげる',()=>pick()]],
 ['x_gfMina',1,()=>has()&&!GF.gave.mina?{}:null,()=>['🎁 あげる',()=>pick({to:'mina'})]],
 ['x_gfBtn',2,()=>has()&&GF.n<6?{}:null,()=>['🎁 あげる',()=>pick()]],
 ['x_gfMarco',2,()=>has()&&people().includes('marco')&&!GF.gave.marco?{}:null,()=>['🎁 あげる',()=>pick({to:'marco'})]]);

/* ---------- 🎁 キャラの 画面に つける 小さな ボタン（ミナ先生・リク・ノラさん・マルコさん） ---------- */
const btn=(to,id)=>PP[to]?`<button class="gfqt" id="${id}" aria-label="${esc(pName(to))}に プレゼント">🎁<small>あげる</small></button>`:'';
function bindBtn(to,id,back){const b=$(id);if(!b)return;b.onclick=e=>{e.stopPropagation();
  if(!has()){sf('tap');H.toast(`🎒 ${esc(pName(to))}に あげられる 品が まだ ないよ <small>雑貨屋の プレゼントや 食べ物、 リクからの お礼を あげられるよ</small>`,3800);return}
  sf('open');pick({to,back})}}
window.GIFT={pick,who,play,note,items,has,people,tier,btn,bindBtn,rec:()=>GF};
})();
