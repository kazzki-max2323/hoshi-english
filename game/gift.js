/* 🎁 プレゼント: もちものの 品を だれかに あげる（中身は game/gift-data.js）
   - あげられる 品: 雑貨屋の プレゼント（ZAKKA.rec().gift）と リクからの お礼（TUTOR.rec().gifts）
   - あげられる 相手: ミナ先生・リク（バイトで 会ったら）・ノラさん（お店で 会ったら）・浜辺の 会話で 会った みんな
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
_saveHooks.push(()=>{const s=JSON.parse(localStorage.getItem(SAVE_KEY)||'{}');s.gift=GF;localStorage.setItem(SAVE_KEY,JSON.stringify(s))});

/* ---------- what you have ---------- */
const ZR=()=>{try{return ZAKKA.rec()}catch(e){return null}};
const TR=()=>{try{return TUTOR.rec()}catch(e){return null}};
const zItem=id=>{try{return ZAKKA.items.find(i=>i.id===id)}catch(e){return null}};
/* every present you could give: {ref, key, ico, n, w, src, wrap} (ref: 'z3' = the 4th zakka present, 't:bm' = Riku's bookmark) */
function items(){const out=[],Z=ZR(),T=TR();
  if(Z)Z.gift.forEach((g,i)=>{const it=zItem(g.id);if(it)out.push({ref:'z'+i,key:'z:'+g.id,ico:it.ico,n:it.n,w:it.w,src:'z',wrap:g.w?g:null,lux:!!it.lux})});
  if(T&&typeof TUTOR_GIFTS!=='undefined')TUTOR_GIFTS.forEach(g=>{const c=T.gifts[g[0]]||0;if(c>0)out.push({ref:'t:'+g[0],key:'t:'+g[0],ico:g[1],n:g[2],w:g[3],src:'t',cnt:c})});
  return out}
const byRef=ref=>items().find(x=>x.ref===ref);
const has=()=>items().length>0;
/* take it out of the bag */
function useUp(it){if(it.src==='z'){const Z=ZR(),i=+it.ref.slice(1);if(Z&&Z.gift[i])Z.gift.splice(i,1)}else{try{TUTOR.take(it.key.slice(2))}catch(e){}}save()}

/* ---------- who you can give to ---------- */
function people(){const out=['mina'];const T=TR(),Z=ZR();
  if(T&&T.met)out.push('riku');if(Z&&Z.met)out.push('nora');
  try{const K=KAIWA.rec();Object.keys(PP).forEach(k=>{if(KAIWA.chars[k]&&K.heart[k]>0)out.push(k)})}catch(e){}
  return out}
const pName=to=>PP[to].n;
const pFace=(to,ex)=>to==='mina'?MINA.face('m',ex||'smile'):`<span class="gfi">${(to!=='riku'&&to!=='nora'&&window.KAIWA&&KAIWA.chars[to]||PP[to]).ico}</span>`;

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
  try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(String(en).replace(/\([^)]*\)/g,'').replace(/Nora/g,'Norah').replace(/\.\.\.\s*/g,' '));u.lang='en-US';if(enVoice)u.voice=enVoice;
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
    ${minaBox(to?'gf_pickTo':'gf_pick',to?{c:pName(to)}:{})}
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
    ${P.length<4?'<p class="note">浜辺の 会話で 会った 人にも あげられるよ</p>':''}
  </section>`);
  $('gfx').onclick=()=>{sf('back');(prev||back)()};
  H.panel.querySelectorAll('[data-to]').forEach(b=>b.onclick=()=>{sf('step');play(it,b.dataset.to,back)})}

/* ================================================================ 3. the talk */
let C=null;
const live=()=>C&&$('gflog');
function scrollLog(){const l=$('gflog');if(l)l.scrollTo({top:l.scrollHeight,behavior:'smooth'})}
const fill=(s)=>String(s).replace(/\{w\}/g,C.it.w).replace(/\{n\}/g,C.it.n);
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
  C={it,to,p,t,back:back||H.home,fun:0,typed:0,step:0,hint:false,ex:'smile',opts:[]};
  H.show('gift',`<section class="pnl lsn kw zk gf" data-stay>
    <div class="qtop"><button class="x" id="gfx" aria-label="やめる">←</button><b>🎁 ${esc(p.n)}に ${it.ico}</b><span class="qn" id="gfq"></span></div>
    <div class="lslog kwlog" id="gflog"></div>
    <div id="gfans" class="kans"></div>
  </section>`);
  $('gfx').onclick=()=>{sf('back');hush();const b=C.back;C=null;b()};
  setTimeout(()=>{them(p.hi,'❓');afterTalk(()=>ask(handOpts()),300,700)},300)}

/* the choices: [english, japanese, ok, level, what happens] */
function handOpts(){const o=['es','jh','hs'].map(lv=>{const h=pickL(GIFT_HAND.filter(x=>x[0]===lv));return {e:h[1],j:h[2],ok:1,lv,go:react}});
  const f=pickL(GIFT_HAND_FUN);o.splice(Math.random()*4|0,0,{e:f[0],j:f[1],ok:0,go:()=>{them(pickL(GIFT_HAND_HUH),'😅','k-oops');afterTalk(react,300,600)}});return o}
function ask(opts,hint){if(!live())return;C.opts=opts;C.step++;$('gfq').textContent='💬 '+C.step;const on=jaOn(),mic=window.SpeechRecognition||window.webkitSpeechRecognition;
  $('gfans').innerHTML=`${hint?`<p class="khint">💡 たとえば：<b>${esc(hint)}</b></p>`:''}
    <div class="lopts kopts zkopts">${opts.map((o,i)=>`<button data-o="${i}">${o.lv?`<i class="zlv zlv-${o.lv}">${LVM[o.lv]}</i> `:''}${esc(o.e)}${on&&o.j?`<small>${esc(o.j)}</small>`:''}</button>`).join('')}</div>
    <div class="kfree"><input id="gfin" type="text" placeholder="英語を 書いてもOK" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" enterkeyhint="send">${mic?'<button id="gfmic" class="sub" aria-label="声で 言う">🎤</button>':''}<button id="gfsend" aria-label="送る">▶</button></div>`;
  $('gfans').querySelectorAll('[data-o]').forEach(b=>b.onclick=()=>choose(+b.dataset.o));
  const inp=$('gfin'),send=()=>{const v=inp.value.trim();if(v)typed(v)};
  $('gfsend').onclick=send;inp.onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();send()}};
  const mb=$('gfmic');if(mb)mb.onclick=()=>{try{const r=new mic();r.lang='en-US';r.interimResults=false;mb.classList.add('on');
    r.onresult=e=>{const t=e.results[0][0].transcript;inp.value=t;mb.classList.remove('on');typed(t)};r.onerror=r.onend=()=>mb.classList.remove('on');r.start()}catch(e){mb.classList.remove('on');H.toast('🎤 この 端末では 声の 入力が つかえないみたい')}}}
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
  if(it.wrap)afterTalk(()=>{them(["And the wrapping is beautiful, too!","つつみ紙も すてき！"],'🎀','k-good');after()},300,700);else after()}
function after(){afterTalk(()=>{const {t}=C;t>=2?askWhere():t===1?askWhy():askMeh()},500,900)}

/* the second question */
const src=()=>C.it.src;
function askWhere(){const {p,to}=C;them(p.ask,'❓');
  const o=[];
  if(src()==='z')o.push(to==='nora'?{e:"I bought it at your shop!",j:"あなたの お店で 買ったんだよ！",ok:1,lv:'es',go:()=>said(["I know! Ha ha. You're my best customer.","知ってるわよ！ あはは。 いちばんの お客さんね。"])}
    :{e:"I bought it at Nora's shop by the beach.",j:"浜辺の ノラさんの お店で 買ったよ。",ok:1,lv:'jh',go:()=>said(["Nora's shop! I should go there sometime.","ノラさんの お店！ こんど 行って みよう。"])});
  else o.push(to==='riku'?{e:"You gave it to me, remember?",j:"きみが くれたんだよ、 おぼえてる？",ok:1,lv:'jh',go:()=>said(["Oh yeah! Ha ha! Now it's a present again!","そうだった！ あはは！ また プレゼントに なった！"])}
    :{e:"Riku gave it to me. I teach him English.",j:"リクが くれたの。 英語を 教えてるんだ。",ok:1,lv:'hs',go:()=>said(["You teach English? That's amazing!","英語を 教えてるの？ すごい！"])});
  o.push({e:"It's a secret.",j:"ひみつ。",ok:1,lv:'es',go:()=>said(["A secret? Ha ha, OK. I like secrets.","ひみつ？ あはは、 わかった。 ひみつって すてき。"])});
  o.push({e:"I made it myself!",j:"自分で 作ったんだ！",ok:0,go:()=>said(src()==='z'?["Really? ...There's a price tag on it. Ha ha!","ほんと？ …値札が ついてるよ。 あはは！"]:["Really? ...It looks like a kid made it! Ha ha!","ほんと？ …子どもが 作ったみたい！ あはは！"],'😂','k-oops')});
  o.push({e:"It fell from the moon.",j:"月から おちてきたの。",ok:0,go:()=>said(C.p.fun,'😂','k-oops')});
  ask(shuffle(o))}
function askWhy(){const {p}=C;them(p.why,'❓');
  ask(shuffle([{e:"Because you're my friend.",j:"ともだち だから。",ok:1,lv:'es',go:()=>said(["Aww, thank you, friend.","わあ、 ありがとう、 ともだち。"])},
    {e:"I thought you might like it.",j:"気に いって くれるかなと 思って。",ok:1,lv:'jh',go:()=>said(["That's so sweet of you.","やさしいね。"])},
    {e:"Because it's your birthday!",j:"きょうは たんじょうび だから！",ok:0,go:()=>said(["It's not my birthday! But thank you, ha ha!","たんじょうびじゃ ないよ！ でも ありがとう、 あはは！"],'😂','k-oops')},
    {e:"I didn't need it anymore.",j:"もう いらなかったから。",ok:0,go:()=>said(["Oh... ha ha. You're very honest!","あ… あはは。 正直だね！"],'😅','k-oops')}]))}
function askMeh(){
  ask(shuffle([{e:"You don't like it, do you?",j:"気に いらなかった よね？",ok:1,lv:'jh',go:()=>{them(["To be honest, it's not really my thing. But I'm happy you thought of me.","正直に いうと、 ちょっと ちがうかな。 でも 思い出して くれて うれしい。"],'🙂');afterTalk(hint,300,700)}},
    {e:"What kind of things do you like?",j:"どんな ものが 好き？",ok:1,lv:'jh',go:hint},
    {e:"What do you like?",j:"なにが 好き？",ok:1,lv:'es',go:hint},
    {e:"Then give it back!",j:"じゃあ かえして！",ok:0,go:()=>said(["Ha ha! No, no, I'll keep it. A present is a present!","あはは！ だめ だめ、 もらっとく。 プレゼントは プレゼント！"],'😂','k-oops')}]))}
function hint(){const {p,to}=C;C.hint=true;const nw=!GF.hint[to];GF.hint[to]=p.hint[2];save();
  them(p.hint,'💡','k-good');if(nw)setTimeout(()=>H.toast(`📔 ${esc(p.n)}の 好きな もの：<b>${esc(TAGN[p.hint[2]])}</b><small>好きな物ノートに のこしたよ</small>`,3400),900);
  afterTalk(closing,500,900)}
function said(line,fx,cls){them(line,fx||'😊',cls||'k-good');afterTalk(closing,500,900)}

/* the last word */
function closing(){const {t,p}=C;
  if(t>=2)ask(shuffle([{e:"You're welcome.",j:"どういたしまして。",ok:1,lv:'es',go:end},{e:"I'm glad you like it.",j:"気に いって もらえて よかった。",ok:1,lv:'jh',go:end},{e:"It's my pleasure.",j:"よろこんで。（どういたしまして）",ok:1,lv:'hs',go:end},
    {e:"That'll be 100 coins, please.",j:"100コインに なります。",ok:0,go:()=>{them(p.fun,'😂','k-oops');afterTalk(end,300,700)}}]));
  else ask(shuffle([{e:"No problem.",j:"いいって ことよ。",ok:1,lv:'es',go:end},{e:"Next time, I'll find something you'll love.",j:"つぎは もっと 好きな ものを 見つけるね。",ok:1,lv:'jh',go:end},t===0?{e:"Thanks for being honest.",j:"正直に 言って くれて ありがとう。",ok:1,lv:'hs',go:end}:{e:"I'm glad I could make you smile.",j:"わらって もらえて よかった。",ok:1,lv:'hs',go:end},
    {e:"Can I have it back?",j:"やっぱり かえして もらえる？",ok:0,go:()=>{them(p.fun,'😂','k-oops');afterTalk(end,300,700)}}]))}
function shuffle(a){for(let i=a.length-1;i>0;i--){const j=Math.random()*(i+1)|0;[a[i],a[j]]=[a[j],a[i]]}return a}

/* ================================================================ 4. the end */
function end(){if(!live())return;const {p,t,it,to}=C;
  them(t>=2?p.bye[0]:p.bye[1],t>=2?'💕':'👋',t>=2?'k-good':'');
  useUp(it);
  const key=C.fun>=2?'fun':TIER[t][0],ek=to+':'+key,newEnd=!GF.end[ek];GF.end[ek]=1;
  const firstSeen=seen(to,it.key)==null;(GF.seen[to]=GF.seen[to]||{})[it.key]=t;
  GF.n++;GF.gave[to]=(GF.gave[to]||0)+1;if(C.fun)GF.fun+=C.fun;
  /* なかよし */
  let heart='';
  if(to==='mina'){const pts=it.lux?30:[1,3,6,10][t];try{MOTI.gain(pts)}catch(e){}heart=`❤️ ミナ先生と なかよし +${pts}`}
  else if(window.KAIWA&&KAIWA.chars[to]){const K=KAIWA.rec(),add=t>=2?2:1;K.heart[to]=(K.heart[to]||0)+add;heart=`${KAIWA.chars[to].ico} ${esc(p.n)}と なかよし ${'♥'.repeat(add)}`}
  else heart=`${PP[to].ico} ${esc(p.n)}、 ${t>=2?'とても よろこんでた':'よろこんでた'}`;
  const coins=newEnd?(t>=2?5:3):0;
  save();
  const title=key==='fun'?'わらいの プレゼント':TIER[t][1],good=key!=='fun'&&t>=2;
  /* what Mina says */
  let k=to==='mina'?['gf_minaMeh','gf_minaOk','gf_minaLike','gf_minaLove'][t]:key==='fun'?'gf_endFun':['gf_endMeh','gf_endOk','gf_endLike','gf_endLove'][t];
  if(C.hint&&to!=='mina')k='gf_endHint';if(GF.n===1)k='gf_endFirst';if(C.typed>=2)k='gf_endTyped';
  const v={c:p.n,n:it.n,w:it.w,like:TAGN[GF.hint[to]]||''};
  const ends=['love','like','ok','meh','fun'],got=ends.filter(e=>GF.end[to+':'+e]).length;
  setTimeout(()=>{if(!live())return;$('gfq').textContent=good?'★':'🏁';
    $('gfans').innerHTML=`<div class="kres">
      <p class="kend ${good?'good':'fun'}">${good?'★':key==='fun'?'😂':'🎁'} 「${esc(title)}」${newEnd?' <small>NEW!</small>':''}</p>
      <p class="zkheart">${heart}</p>
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
 x_gfMina:[['love','ねえ… わたしにも なにか くれるの？ …なんてね。 えへへ'],['smile','プレゼントを わたす 英語、 3つ 言える？ 「This is for you.」「I got this for you.」「I saw this and thought of you.」']]
});
if(window.MINA_SENSE&&MINA_SENSE._rules)MINA_SENSE._rules.push(
 ['x_gfHave',4,()=>{const L=items();if(!L.length)return null;const it=pickL(L);return {n:it.n,_r:it.ref}},v=>['🎁 あげる',()=>who(v._r,H.home)]],
 ['x_gfHint',2,()=>{const P=people().filter(to=>GF.hint[to]&&to!=='mina');if(!P.length||!has())return null;const to=pickL(P);return {c:pName(to),like:TAGN[GF.hint[to]],_to:to}},v=>['🎁 あげる',()=>pick({to:v._to})]],
 ['x_gfRiku',2,()=>{const L=items().filter(x=>x.src==='t');if(!L.length||GF.n>2)return null;return {n:pickL(L).n}},()=>['🎁 あげる',()=>pick()]],
 ['x_gfMina',1,()=>has()&&!GF.gave.mina?{}:null,()=>['🎁 あげる',()=>pick({to:'mina'})]]);

window.GIFT={pick,who,play,note,items,has,people,tier,rec:()=>GF};
})();
