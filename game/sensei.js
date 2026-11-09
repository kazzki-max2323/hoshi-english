/* ミナ先生と 英語で 話す（先生との 会話）。
   - ミナ先生が いろんな 場面（game/sensei-scenes.js）で 英語で 話しかけてくる。答えは えらぶ / 自分で 書く / 声で 言う
   - まちがえたら 先生らしく 教える：1回目は 💡ヒント（もう一度 えらべる）、2回目は 📘解説（文法ノートの ルールと 正しい 文）→ 話は つづく
   - 自分で 書いた 英語も、よく ある まちがい（SENSEI_CHECK）を 見つけて 教える。いまの レベルの 文法が つかえたら ほめる
   - 会話の とちゅうに いまの レベルの「文法チェック」（SENSEI_DRILL）が まざる。苦手な 文法ほど 出やすい
   - 正しい 答えも 何とおりも あって、答えで 話が 分かれる（エンドが いくつも）。{food} などの ことばは 毎回 かわる
   - 🎯 苦手 とっくん：まちがえた 文法を 5問の ミニ会話で
   - 文法ごとの 記録（ST の sensei.g）は ミナ先生の 苦手 チェック（MINA.rec().g）にも 入る → ホームでも 文法ノートへ さそう
   セリフは game/mina-talk.js の sn_ / x_sn で はじまる 場面 */
(()=>{
const {S:ST,sfx:SFX}=BEACH;
const H=HE,esc=H.esc,$=id=>document.getElementById(id);
const LV=['es','jh','hs','adv'],LVN={es:'小学生',jh:'中学生',hs:'高校生',adv:'ハイレベル'};
const GLV={es:'es',jh:'jh',hs:'hs',adv:'hs'};
const PAY={es:8,jh:10,hs:12,adv:14};
const pickL=a=>a[Math.random()*a.length|0];
const shuffle=a=>H.shuffle?H.shuffle(a.slice()):a.slice().sort(()=>Math.random()-.5);
const SC=SENSEI_SCENES,ERR=SENSEI_ERR,DR=SENSEI_DRILL,SLOT=SENSEI_SLOT;
const sceneOf=id=>SC.find(s=>s.id===id);
const GS=()=>window.GRAMSEE;
const gById=id=>GS()&&GS().byId(id);
const gName=id=>{const g=gById(id);return g?g.n.t:id};
const owned=id=>(ST.gram.owned||[]).includes(id),cleared=id=>(ST.gram.cleared||[]).includes(id);
const ML=(k,v)=>MINA.line(k,v);

/* ---------- the record ---------- */
const SD=(()=>{try{const s=JSON.parse(localStorage.getItem(SAVE_KEY)||'{}').sensei;if(s&&s.done)return s}catch(e){}return {done:{},end:{},g:{},n:0,free:0,last:0,tok:0,sou:0,ja:0,best:0}})();
_saveHooks.push(()=>{const s=JSON.parse(localStorage.getItem(SAVE_KEY)||'{}');s.sensei=SD;localStorage.setItem(SAVE_KEY,JSON.stringify(s))});
/* one grammar answer: r = 2 right at once, 1 right after a hint, 0 explained */
function gramRec(id,r){if(!id||!gById(id))return;const e=SD.g[id]=SD.g[id]||{ok:0,hint:0,miss:0,t:0,last:[]};
  if(r===2)e.ok++;else if(r===1)e.hint++;else e.miss++;e.t=Date.now();e.last.push(r);if(e.last.length>8)e.last.shift();
  /* Mina's own record of weak grammar (game/mina.js): a miss makes it weak, 3 right in a row makes it fine again */
  try{const MD=MINA.rec(),g=gById(id),m=MD.g[id]=MD.g[id]||{s:0,m:0,t:0,lv:g.lv,i:g.i,title:g.n.t};m.s++;m.t=Date.now();
    if(r===0){m.m++;m.k=0;m.mt=m.t}else if(r===2)m.k=(m.k||0)+1}catch(e){}}
/* how well a grammar goes in talks: 0..1 (null: not enough) */
const gScore=id=>{const e=SD.g[id];if(!e||e.last.length<2)return null;return e.last.reduce((a,b)=>a+b,0)/(e.last.length*2)};
const weakG=()=>Object.keys(SD.g).filter(id=>gById(id)&&gScore(id)!=null&&gScore(id)<.65).sort((a,b)=>gScore(a)-gScore(b));
const goodG=()=>Object.keys(SD.g).filter(id=>gById(id)&&gScore(id)!=null&&gScore(id)>=.85&&SD.g[id].last.length>=3).sort((a,b)=>gScore(b)-gScore(a));
/* weak grammar from everywhere: talks with Mina, grammar quizzes, the radio's sentences */
function weakAll(){const a=weakG();try{Object.entries(MINA.rec().g||{}).forEach(([id,e])=>{if(e.m>0&&(e.k||0)<3&&!a.includes(id)&&gById(id))a.push(id)})}catch(e){}return a}

/* ---------- words that change every time ---------- */
const SUF={j:1,'2':2,'3':2,ed:3,pp:4,ing:5,x:6,n:3};
function fill(t,V,inl){if(t==null)return t;return String(t).replace(/\{([a-zA-Z]+)(?:_(\w+))?\}/g,(m,k,s)=>{
  let L=(inl&&inl[k])||SLOT[k];if(typeof L==='function')L=L();if(!L)return m;if(!V[k])V[k]=pickL(L);const v=V[k],i=s?SUF[s]:0;return v[i]!=null?v[i]:v[0]})}

/* ---------- voice: Mina reads her English (the device's reader) ---------- */
let enVoice=null,talkOn=false,talkId=0,talkMax=0;
function pickVoice(){if(!window.speechSynthesis)return;const vs=speechSynthesis.getVoices().filter(v=>/^en[-_]/i.test(v.lang));
  enVoice=vs.find(v=>/en[-_]US/i.test(v.lang)&&/Samantha|Google US|Natural|Female|Zira|Jenny|Aria/i.test(v.name))||vs.find(v=>/en[-_]US/i.test(v.lang))||vs[0]||null}
if(window.speechSynthesis){pickVoice();speechSynthesis.addEventListener&&speechSynthesis.addEventListener('voiceschanged',pickVoice)}
const SAYAS={Gen:'Ghen',Mina:'Meena',Hana:'Hahna',Pochi:'Poh-chee',Kanio:'Kah-nee-oh',Hamako:'Hah-mah-ko'};
const sayAs=t=>t.replace(new RegExp('\\b('+Object.keys(SAYAS).join('|')+')\\b','g'),m=>SAYAS[m]);
function talk(en){if(!ST.sound||!window.speechSynthesis||!en)return;
  try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(sayAs(String(en)).replace(/\*[^*]*\*/g,''));u.lang='en-US';if(enVoice)u.voice=enVoice;
    u.pitch=1.12;u.rate=ST.slow?.72:.9;u.volume=Math.min(1,(ST.vol&&ST.vol.voice!=null)?ST.vol.voice:1);
    const id=++talkId;talkOn=true;talkMax=Date.now()+3000+String(en).length*(ST.slow?140:100);u.onend=u.onerror=()=>{if(id===talkId)talkOn=false};speechSynthesis.speak(u)}catch(e){talkOn=false}}
function afterTalk(fn,gap=500,minMs=900){const t0=Date.now();
  const wait=()=>{if(!live())return;const busy=ST.sound&&window.speechSynthesis&&(talkOn||speechSynthesis.speaking||speechSynthesis.pending)&&Date.now()<talkMax;
    if(busy||Date.now()-t0<minMs){setTimeout(wait,150);return}setTimeout(fn,gap)};setTimeout(wait,150)}
const hush=()=>{try{speechSynthesis.cancel()}catch(e){}};

/* ---------- reading what the player wrote ---------- */
/* a typical mistake in it (from the player's level down): the mistake's key */
function check(v,lv){const i=LV.indexOf(lv),t=String(v).replace(/[’‘]/g,"'");
  for(const [k,re,from] of SENSEI_CHECK){if(LV.indexOf(from)>i)continue;if(k==='caps'&&i>0)continue;if(re.test(t))return k}return null}
/* the words as they are (no stems): to tell "She drinks" from "She drink" */
const raw=t=>String(t).toLowerCase().replace(/[’‘]/g,"'").replace(/\bcan't\b|\bcannot\b/g,'can not').replace(/\bwon't\b/g,'will not').replace(/n't\b/g,' not').replace(/'m\b/g,' am').replace(/'re\b/g,' are').replace(/'ll\b/g,' will').replace(/'ve\b/g,' have').replace(/'s\b/g,' is').replace(/[^a-z0-9 ]/g,' ').split(/\s+/).filter(Boolean);
const same=(a,b)=>raw(a).join(' ')===raw(b).join(' ');
const sim=(a,b)=>{const A=new Set(raw(a)),B=new Set(raw(b));let n=0;A.forEach(w=>{if(B.has(w))n++});return n/Math.max(1,new Set([...A,...B]).size)};
/* which answer it is closest to (the same reading as 浜辺の 会話) */
const matchOpts=(v,opts)=>window.KAIWA&&KAIWA.match?KAIWA.match(v,opts.map(o=>[o.en,o.ok?1:0,'','','',o.k||null])):[-1,0];

/* ---------- the talks: their ends, and how many ways they can go ---------- */
const endsOf=s=>Object.entries(s.nodes||{}).filter(([,n])=>n.end).map(([k,n])=>[k,!!n.good,n.t]);
const endsGot=s=>endsOf(s).filter(e=>SD.end[s.id+':'+e[0]]).length;
const endsAll=()=>SC.reduce((a,s)=>a+endsOf(s).length,0),endsN=()=>Object.keys(SD.end).filter(k=>sceneOf(k.split(':')[0])).length;
const slotsIn=t=>{const out=new Set();String(t||'').replace(/\{([a-zA-Z]+)(?:_\w+)?\}/g,(m,k)=>{if(Array.isArray(SLOT[k]))out.add(k)});return out};
let PAT=0;
/* paths through every talk × the words that change × the grammar checks that can come in, roughly */
function patterns(){if(PAT)return PAT;let n=0;
  const drillWays=id=>(DR[id]||[]).reduce((a,d)=>{const S=new Set();[d.s,...d.good,...d.bad.map(b=>b[0])].forEach(t=>slotsIn(t).forEach(k=>S.add(k)));return a+[...S].reduce((x,k)=>x*SLOT[k].length,1)*d.good.length},0);
  SC.forEach(s=>{const memo={};const ways=(k,depth)=>{if(depth>40)return 1;const N=s.nodes[k];if(!N)return 1;if(N.end)return 1;if(memo[k])return memo[k];
      let w=0;if(N.dr){const ids=typeof N.dr==='string'?[N.dr]:s.g||[];w=ids.reduce((a,id)=>a+Math.max(1,drillWays(id)),0)*ways(N.nx,depth+1)}
      else (N.o||[]).forEach(o=>{if(o.ok)w+=ways(o.nx||N.nx,depth+1)});return memo[k]=Math.max(1,w)};
    const S=new Set();Object.values(s.nodes).forEach(N=>{[N.s,N.j,...(N.o||[]).map(o=>o.en)].forEach(t=>slotsIn(t).forEach(k=>S.add(k)))});
    n+=ways(s.start||'a',0)*[...S].reduce((x,k)=>x*SLOT[k].length,1)});
  return PAT=n}
const patText=()=>{const n=patterns();return n>=1e8?Math.round(n/1e8)+'億':n>=1e4?Math.round(n/1e4).toLocaleString()+'万':n.toLocaleString()};
const myLv=()=>{try{return MINA.level()}catch(e){return 'es'}};
const jaOn=lv=>lv==='es'||!!SD.ja;

/* ---------- the list ---------- */
let listLv=null;
function listLine(){const lv=listLv,w=weakAll(),gd=goodG(),todo=SC.filter(s=>s.lv===lv&&!SD.done[s.id]);let k='sn_list',v={lvn:LVN[lv],pat:patText()};
  const r=Math.random();
  if(!SD.n)k='sn_listFirst';
  else if(w.length&&r<.35){k='sn_listWeak';v.g='「'+gName(w[0])+'」'}
  else if(gd.length&&r<.5){k='sn_listGood';v.g='「'+gName(gd[0])+'」'}
  else if(todo.length&&r<.7){k='sn_listTodo';v.t='「'+todo[0].t+'」'}
  else if(r<.85){k='sn_listPat'}
  else if(endsN()){k='sn_listEnds';v.n=endsN();v.tot=endsAll()}
  return ML(k,v)}
function list(){listLv=listLv||(LV.includes(myLv())?myLv():'es');const [ex,tx]=listLine(),S=SC.filter(s=>s.lv===listLv),w=weakAll();
  H.show('sensei',`<section class="pnl kwp snp">
    <div class="qtop"><button class="x" id="sx" aria-label="もどる">←</button><b>🗣️ ミナ先生と 英語で 話す</b><span class="qn">🏁 ${endsN()}/${endsAll()}</span></div>
    <div class="kmina"><span class="lface">${MINA.face('m',ex)}</span><p>${tx}</p></div>
    <div class="snbig">
      <button id="stok" class="${w.length?'hot':''}"><b>🎯 苦手 とっくん</b><small>${w.length?'「'+esc(gName(w[0]))+'」'+(w.length>1?' ほか '+(w.length-1)+'こ':''):'いまの レベルの 文法 5問'}</small></button>
    </div>
    <div class="seg">${LV.map(k=>`<button data-l="${k}" class="${k===listLv?'on':''}">${LVN[k]}</button>`).join('')}</div>
    <div class="lslist klist">${S.map(row).join('')}</div>
    <div class="row"><button id="sgo">🎲 おまかせ</button><button id="skarte" class="sub">📋 文法カルテ</button></div>
    <p class="snpat">会話の パターン：<b>約 ${patText()} とおり</b>（場面 ${SC.length}・エンド ${endsAll()}・文法チェック ${Object.values(DR).reduce((a,d)=>a+d.length,0)}しゅ）</p>
    <label class="kjat"><input type="checkbox" id="sja" ${SD.ja?'checked':''}> 日本語訳を いつも 出す <small>（小学生は いつも 出るよ）</small></label>
  </section>`);
  $('sx').onclick=()=>{SFX.pop();MINA.open()};
  H.panel.querySelectorAll('[data-l]').forEach(b=>b.onclick=()=>{SFX.pop();listLv=b.dataset.l;list()});
  H.panel.querySelectorAll('[data-s]').forEach(b=>b.onclick=()=>{SFX.vopen();play(b.dataset.s)});
  $('sgo').onclick=()=>{SFX.vopen();const a=S.filter(s=>!SD.done[s.id]);play(pickL(a.length?a:S).id)};
  $('stok').onclick=()=>{SFX.vopen();tokkun()};
  $('skarte').onclick=()=>{SFX.vopen();karte()};
  $('sja').onchange=e=>{SD.ja=e.target.checked?1:0;save()}}
const row=s=>{const n=SD.done[s.id]||0,g=endsGot(s),t=endsOf(s).length,star=endsOf(s).some(e=>e[1]&&SD.end[s.id+':'+e[0]]);
  const tags=(s.g||[]).map(id=>{const sc=gScore(id);return `<i class="${owned(id)?'own':''} ${sc!=null&&sc<.65?'weak':sc!=null&&sc>=.85?'good':''}">${esc(gName(id).replace(/（.*?）/g,''))}</i>`}).join('');
  return `<button class="lsrow krow snrow ${n?'clear':''}" data-s="${s.id}"><span class="ci">${s.ico||'💬'}</span><span class="lt"><b>${esc(s.t)}</b><small>${esc(s.d||'')}</small><span class="sntags">${tags}</span></span><span class="lp">${n?`${star?'★':'🏁'}${g}/${t}`:'🪙'+PAY[s.lv]*2}</span></button>`};

/* ---------- 文法カルテ: every grammar talked about, how it went ---------- */
function karte(){const ids=Object.keys(SD.g).filter(id=>gById(id)).sort((a,b)=>(gScore(a)??1)-(gScore(b)??1));
  const w=weakAll(),gd=goodG();const [ex,tx]=ML(ids.length?(w.length?'sn_karteWeak':'sn_karte'):'sn_karteNone',{g:w[0]?'「'+gName(w[0])+'」':'',good:gd[0]?'「'+gName(gd[0])+'」':'',n:ids.length});
  H.show('sensei',`<section class="pnl kwp snp">
    <div class="qtop"><button class="x" id="sx" aria-label="もどる">←</button><b>📋 文法カルテ</b><span class="qn">${ids.length}こ</span></div>
    <div class="kmina"><span class="lface">${MINA.face('m',ex)}</span><p>${tx}</p></div>
    <p class="note">ミナ先生との 会話で 出た 文法。⭕ 1回で 正解・💡 ヒントで 正解・📘 解説を きいた</p>
    <div class="snkarte">${ids.map(id=>{const e=SD.g[id],sc=gScore(id),g=gById(id);
      return `<div class="snk ${sc!=null&&sc<.65?'weak':sc!=null&&sc>=.85?'good':''}"><b>${sc!=null&&sc<.65?'🔥 ':sc!=null&&sc>=.85?'🌟 ':''}${esc(g.n.t)}</b><span>⭕${e.ok} 💡${e.hint} 📘${e.miss}</span><span class="snbar"><i style="width:${Math.round((sc??0)*100)}%"></i></span><span class="snkb"><button data-tk="${id}" class="sub">🎯 とっくん</button><button data-gn="${id}" class="sub">${owned(id)?'📚 ノート':'🔍 おためし'}</button></span></div>`}).join('')||'<p class="note">ミナ先生と 会話すると、ここに 文法ごとの 記録が たまるよ</p>'}</div>
  </section>`);
  $('sx').onclick=()=>{SFX.pop();list()};
  H.panel.querySelectorAll('[data-tk]').forEach(b=>b.onclick=()=>{SFX.vopen();tokkun([b.dataset.tk])});
  H.panel.querySelectorAll('[data-gn]').forEach(b=>b.onclick=()=>{SFX.vopen();openGram(b.dataset.gn,karte)})}
function openGram(id,back){const g=gById(id);if(!g)return;hush();owned(id)?H.gramNote(g.lv,g.i):H.gramTry(g.lv,g.i,back||list)}

/* ---------- one talk ---------- */
let P=null;
const live=()=>P&&$('slog');
function begin(s,from){
  P={s,from,at:s.start||'a',V:{},step:0,tries:0,st:{ok:0,hint:0,miss:0,free:0,freeCoins:0,g:{}},lines:[],drills:0};
  H.show('sensei',`<section class="pnl lsn kw snw">
    <div class="qtop"><button class="x" id="sx" aria-label="会話を やめる">←</button><b>${s.ico||'🗣️'} ${esc(s.t)}</b><span class="qn" id="sq"></span></div>
    <div class="lslog kwlog snlog" id="slog"></div>
    <div id="sans" class="kans"></div>
  </section>`);
  $('sx').onclick=()=>{SFX.pop();hush();const f=P&&P.from;P=null;f==='home'?H.home():list()};
  /* what Mina says first: about this talk's grammar and how it went before */
  const ids=s.g||[],w=ids.find(id=>weakAll().includes(id)),nw=ids.find(id=>!owned(id)),cl=ids.find(id=>cleared(id));
  let k='sn_intro',v={t:'「'+s.t+'」',g:ids.length?'「'+gName(ids[0])+'」':''};
  if(s.intro){note(`<span class="snjin">${s.intro}</span>`)}
  if(s.kind)k=null;
  else if(!SD.n)k='sn_introFirst';
  else if(w){k='sn_introWeak';v.g='「'+gName(w)+'」'}
  else if(SD.done[s.id]){k='sn_introAgain';v.got=endsGot(s);v.tot=endsOf(s).length}
  else if(nw&&Math.random()<.6){k='sn_introNew';v.g='「'+gName(nw)+'」'}
  else if(cl&&Math.random()<.6){k='sn_introClear';v.g='「'+gName(cl)+'」'}
  if(k){const [ex,tx]=ML(k,v);minaJa(ex,tx)}
  setTimeout(turn,k?1100:300)}
function play(id,from){const s=sceneOf(id);if(!s)return list();begin(s,from)}

/* the lines in the log */
function scrollLog(){const l=$('slog');if(l)l.scrollTo({top:l.scrollHeight,behavior:'smooth'})}
function mina(en,ja,ex='smile',cls='',btns){if(!live())return;en=String(en);en=en.charAt(0).toUpperCase()+en.slice(1);const d=document.createElement('div'),show=jaOn(P.s.lv);d.className='lsay snm '+cls;
  d.innerHTML=`<span class="lface">${MINA.face('m',ex)}</span><div class="lbody"><p class="ken">${GS()?GS().mark(en):esc(en)}<button class="ksay" aria-label="もう一度 きく">🔊</button></p>${ja?`<small class="kja ${show?'on':''}">${esc(ja)}</small>${show?'':'<button class="kjab">訳を 見る</button>'}`:''}${btns?`<span class="snbtns">${btns.map((b,i)=>`<button class="sub" data-bi="${i}">${b[0]}</button>`).join('')}</span>`:''}</div>`;
  $('slog').appendChild(d);P.lines.push(en);if(GS()){GS().record(en);GS().bind(d)}
  d.querySelector('.ksay').onclick=e=>{e.stopPropagation();talk(en)};
  const jb=d.querySelector('.kjab');if(jb)jb.onclick=()=>{SFX.pop();jb.remove();d.querySelector('.kja').classList.add('on');scrollLog()};
  if(btns)d.querySelectorAll('[data-bi]').forEach(b=>b.onclick=()=>{SFX.vopen();hush();btns[+b.dataset.bi][1]()});
  talk(en);scrollLog()}
/* Mina in Japanese (a teacher's word, not part of the talk) */
function minaJa(ex,html,cls='',btns){if(!live())return;const d=document.createElement('div');d.className='lsay snm snjp '+cls;
  d.innerHTML=`<span class="lface">${MINA.face('m',ex)}</span><div class="lbody"><p>${html}</p>${btns?`<span class="snbtns">${btns.map((b,i)=>`<button class="sub" data-bi="${i}">${b[0]}</button>`).join('')}</span>`:''}</div>`;
  $('slog').appendChild(d);if(btns)d.querySelectorAll('[data-bi]').forEach(b=>b.onclick=()=>{SFX.vopen();hush();btns[+b.dataset.bi][1]()});scrollLog();return d}
function you(en,cls='',typed){if(!live())return;const d=document.createElement('div');d.className='lsay by-h kyou-b '+cls;
  d.innerHTML=`<span class="lface kf you">⭐</span><div class="lbody"><p>${esc(en)}${typed?'<small class="kty">✍️</small>':''}</p></div>`;$('slog').appendChild(d);P.lines.push(en);scrollLog()}
function note(html){if(!live())return;const d=document.createElement('p');d.className='knote';d.innerHTML=html;$('slog').appendChild(d);scrollLog()}

/* ---------- a node, made ready: words filled, answers in one shape ---------- */
/* Mina's reply must talk about what this answer says. A reply word ({job}…) the answer does not have:
   read it from the answer's own words ("I want to be a teacher" → a teacher), else a plain "nice" */
const PLAIN=[["Nice answer!","いい 答え！"],["Great! I like that.","いいね！ すてき"],["Oh, I see!","なるほど！"],["Wonderful!","すばらしい！"]];
function fitReply(enRaw,re,rj,V,inl,ctx){if(re==null)return [null,null];const en=fill(enRaw,V,inl),own=slotsIn(enRaw),V2=Object.assign({},V),t=' '+raw(en).join(' ')+' ';
  let ok=true;new Set([...slotsIn(re),...slotsIn(rj)]).forEach(k=>{if(own.has(k))return;
    const e=SLOT[k].find(x=>[x[0],x[2]].some(w=>w&&/^[a-z ]+$/i.test(w)&&t.includes(' '+raw(w).join(' ')+' ')));if(e)V2[k]=e;else if(!(ctx&&ctx.has(k)))ok=false});
  if(!ok){const p=pickL(PLAIN);return p}return [fill(re,V2,inl),fill(rj,V2,inl)]}
const OPT=(o,V,inl,ctx)=>{const en=fill(o.en,V,inl),[re,rj]=o.ok?fitReply(o.en,o.re,o.rj,V,inl,ctx):[fill(o.re,V,inl),fill(o.rj,V,inl)];return {_r:o,en,ok:o.ok,err:o.err||null,re,rj,nx:o.nx,k:o.k,h:fill(o.h,V,inl),go:o.go}};
function ready(N){const s=P.s,inl=s.slots;
  if(N.dr)return drillNode(typeof N.dr==='string'?N.dr:drillPick(),N.nx);
  const ro=typeof N.o==='function'?N.o():N.o;
  const out={s:fill(typeof N.s==='function'?N.s():Array.isArray(N.s)?pickL(N.s):N.s,P.V,inl),j:fill(typeof N.j==='function'?N.j():N.j,P.V,inl),ask:fill(N.ask,P.V,inl),ex:N.ex,g:N.g,nx:N.nx,btns:N.btns};
  /* the words already said (in the talk so far and in Mina's line) may be in a reply; an answer's own words only in its own reply */
  out.ctx=new Set(Object.keys(P.V));out.o=(ro||[]).map(o=>OPT(o,P.V,inl,out.ctx));return out}
/* a grammar check from the drills: this talk's grammar, the weak ones first, then the level's notes the player has */
function drillPick(){const s=P.s,pool=(s.g||[]).filter(id=>DR[id]),lvl=GLV[s.lv],weak=weakAll().filter(id=>DR[id]&&(id.startsWith(lvl)||pool.includes(id)));
  const ownL=(ST.gram.owned||[]).filter(id=>DR[id]&&id.startsWith(lvl));
  const r=Math.random();if(weak.length&&r<.4)return pickL(weak);if(ownL.length&&r<.6)return pickL(ownL);
  return pickL(pool.length?pool:Object.keys(DR).filter(id=>id.startsWith(lvl)))}
function drillNode(id,nx){const d=pickL(DR[id]||DR.es_be),V={},gi=shuffle(d.good.map((g,i)=>i)).slice(0,2),bad=shuffle(d.bad).slice(0,2);
  const s=fill(d.s,V),j=fill(d.j,V),ctx=new Set(Object.keys(V));
  return {s,j,g:id,nx,drill:1,ctx,V,o:[...gi.map(i=>{const en=d.good[i],r0=d.res?d.res[i]:[d.re,d.rj],[re,rj]=fitReply(en,r0[0],r0[1],V,null,ctx);return {en:fill(en,V),ok:1,re,rj,nx,_r:{en,ok:1,re:r0[0],rj:r0[1],nx}}}),...bad.map(b=>({en:fill(b[0],V),ok:0,err:b[1]||null,h:b[2]||null}))]}}

function turn(){if(!live())return;const raw=P.s.nodes[P.at];if(!raw)return finish({end:1,good:1,t:'おしまい',s:'Good job today!',j:'きょうも よく がんばったね！'});
  if(raw.end)return finish(raw);
  const N=ready(raw);P.N=N;P.tries=0;P.gw=0;P.tried=new Set();P.step++;P.order=null;
  $('sq').textContent=`💬 ${P.step}`;
  if(N.drill){P.drills++;const [ex,tx]=ML('sn_drill',{g:'「'+gName(N.g)+'」'});note(`📘 <b>文法チェック</b>：${esc(gName(N.g))}`);
    if(Math.random()<.45)minaJa(ex,tx,'snsmall')}
  if(N.ask){minaJa(N.ex||'smile',`❓ ${N.ask}`,'snask');setTimeout(answers,350)}
  else{mina(N.s,N.j,N.ex||'smile','',N.btns);setTimeout(answers,350)}}

/* the choices and a box to write (or say) your own */
function answers(){if(!live())return;const N=P.N,order=P.order&&P.order.length===N.o.length?P.order:shuffle(N.o.map((o,i)=>i));P.order=order;
  const mic=window.SpeechRecognition||window.webkitSpeechRecognition;
  $('sans').innerHTML=`<div class="lopts kopts">${order.map(i=>`<button data-o="${i}" ${P.tried.has(i)?'disabled class="tried"':''}>${esc(N.o[i].en)}</button>`).join('')}</div>
    <div class="kfree"><input id="sin" type="text" placeholder="${N.ask?'英語で 質問を 書いてもOK':'英語で 書いてもOK（先生が チェック）'}" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" enterkeyhint="send">${mic?'<button id="smic" class="sub" aria-label="声で 言う">🎤</button>':''}<button id="ssend" aria-label="送る">▶</button></div>`;
  $('sans').querySelectorAll('[data-o]').forEach(b=>b.onclick=()=>choose(+b.dataset.o));
  const inp=$('sin'),send=()=>{const v=inp.value.trim();if(v)typed(v)};
  $('ssend').onclick=send;inp.onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();send()}};
  const mb=$('smic');if(mb)mb.onclick=()=>listen(mic,inp,mb)}
function listen(R,inp,mb){try{const r=new R();r.lang='en-US';r.interimResults=false;r.maxAlternatives=1;mb.classList.add('on');
  r.onresult=e=>{const t=e.results[0][0].transcript;inp.value=t;mb.classList.remove('on');typed(t,true)};
  r.onerror=r.onend=()=>mb.classList.remove('on');r.start()}catch(e){mb.classList.remove('on');H.toast('🎤 この 端末では 声の 入力が つかえないみたい')}}

/* the grammar this node checks: its own, or the grammar of its wrong answers */
const nodeG=N=>N.g||((N.o.find(o=>o.err&&ERR[o.err])||{}).err&&ERR[N.o.find(o=>o.err&&ERR[o.err]).err][0])||null;

/* the player wrote (or said) something */
function typed(v,spoken){if(!live())return;const N=P.N,lv=P.s.lv;
  /* the very words of an answer: that answer */
  let i=N.o.findIndex(o=>same(v,o.en)),ek=null;
  if(i<0){ek=spoken?null:check(v,lv);   // the voice reader writes good English, so only the meaning is read
    i=matchOpts(v,N.o)[0];
    /* close to a right answer by meaning, but its words are closer to a wrong answer's (a grammar slip): the wrong one */
    if(i>=0&&N.o[i].ok&&!ek&&!spoken){let bg=0,bb=0,bi=-1;N.o.forEach((o,j)=>{const x=sim(v,o.en);if(o.ok)bg=Math.max(bg,x);else if(o.err&&x>bb){bb=x;bi=j}});if(bi>=0&&bb>bg&&bb>=.6)i=bi}}
  if(ek&&ERR[ek]){const gi=i>=0&&N.o[i].ok?i:N.o.findIndex(o=>o.ok);return wrong({en:v,ok:0,err:ek,typed:1},gi)}
  if(i<0){you(v,'',true);$('sans').innerHTML='';
    setTimeout(()=>{const g=N.o.filter(o=>o.ok),h=pickL(HUH);mina(h[0],h[1],'think','k-huh');const [ex,tx]=ML('sn_huh',{ex:pickL(g.length?g:N.o).en});minaJa(ex,tx);setTimeout(answers,500)},600);return}
  let o=N.o[i];
  /* they wrote other words for the changing part (soccer for tennis…): Mina answers about their words */
  if(o.ok&&o._r&&!same(v,o.en)){const t=' '+raw(v).join(' ')+' ',VV=N.V||P.V;
    slotsIn(o._r.en).forEach(k=>{const e=SLOT[k].find(x=>[x[0],x[2]].some(w=>w&&/^[a-z ]+$/i.test(w)&&t.includes(' '+raw(w).join(' ')+' ')));if(e)VV[k]=e});
    /* the reply is read against what they wrote, not against the answer it looked like */
    const [re,rj]=fitReply(v,o._r.re,o._r.rj,VV,P.s.slots,N.ctx);o=N.o[i]=Object.assign({},o,{re,rj})}
  if(o.ok){P.st.free++;SD.free++;if(P.st.freeCoins<3){P.st.freeCoins++;setTimeout(()=>{const r=$('slog')&&$('slog').getBoundingClientRect();if(r)H.coinBurst(r.right-40,r.bottom-30,1)},400)}
    /* grammar of the level in what they wrote: praise it */
    const G=GS()?GS().find(v).filter(g=>g.lv===GLV[lv]):[];
    /* words the answer does not have (a name, a number…): a plain "nice" so Mina does not talk about what was not said */
    const has=new Set(raw(o.en)),extra=raw(v).filter(w=>!has.has(w)&&!NEUTRAL_OK.has(w));
    return right(i,v,G[0]||null,extra.length>0&&!P.N.drill)}
  wrong(Object.assign({},o,{en:v,typed:1}),N.o.findIndex(x=>x.ok),i)}
function choose(i){if(!live())return;const o=P.N.o[i];if(o.ok)right(i);else wrong(o,P.N.o.findIndex(x=>x.ok),i)}

const HUH=[["Hmm, I'm not sure what you mean.","うーん、 どういう 意味かな？"],["Sorry? Can you say it another way?","ん？ べつの 言い方で 言える？"],["Oh? Let's try again.","おや？ もう一回 いってみよう"]];
const OOPS=[["Hmm, almost!","おしい！"],["Close! One more try.","あと ちょっと！"],["Oh? Say that again?","ん？ もう一回？"],["Nice try! Let's check it.","いい チャレンジ！ たしかめよう"],["Hmm... something is a little off.","うーん… どこか ちょっと ちがうかも"]];

/* a right answer: Mina answers, the talk goes on */
const NEUTRAL_OK=new Set('a an the is am are was were be it i you he she we they my your to of in on at and or so um oh well yes no not do does did very really too please thank thanks ok okay just'.split(' '));
const NEUTRAL=[["Oh, nice!","へえ、 いいね！"],["I see! Thank you.","なるほど！ ありがとう"],["Great answer!","いい 答え！"],["Oh, really? Cool!","ほんと？ いいね！"]];
function right(i,typedText,gUsed,neutral){const N=P.N,o=N.o[i],gid=nodeG(N),first=P.tries===0;$('sans').innerHTML='';
  you(typedText||o.en,'',!!typedText);
  if(first)P.st.ok++;else P.st.hint++;
  const gr=first||!P.gw;if(gid){gramRec(gid,gr?2:1);const r=P.st.g[gid]=P.st.g[gid]||{ok:0,hint:0,miss:0};gr?r.ok++:r.hint++}
  setTimeout(()=>{if(!live())return;
    const rp=neutral?pickL(NEUTRAL):o.re?[o.re,o.rj||'']:N.drill?pickL([["Great!","いいね！"],["Perfect!","カンペキ！"]]):null;
    if(rp)mina(rp[0],rp[1],first?'happy':'proud','k-good');SFX.heart?SFX.heart():SFX.chime();
    /* a short word from the teacher now and then */
    if(gUsed&&gById(gUsed.id)){const [ex,tx]=ML('sn_free',{g:'「'+gUsed.n.t+'」'});setTimeout(()=>minaJa(ex,tx,'snsmall'),400)}
    else if(!gr&&gid){const [ex,tx]=ML('sn_okHint',{g:'「'+gName(gid)+'」'});setTimeout(()=>minaJa(ex,tx,'snsmall'),400)}
    else if(first&&N.drill&&Math.random()<.5){const [ex,tx]=ML('sn_ok',{g:'「'+gName(gid)+'」'});setTimeout(()=>minaJa(ex,tx,'snsmall'),400)}
    if(o.go){afterTalk(()=>o.go(),300);return}
    P.at=o.nx||N.nx||'end';afterTalk(turn)},600)}

/* a wrong answer: 1st time a hint (try again), 2nd time the explanation (then the talk goes on with the right answer) */
function wrong(o,gi,oi){const N=P.N;$('sans').innerHTML='';if(oi!=null&&oi>=0)P.tried.add(oi);P.tries++;
  you(o.en,'snx',!!o.typed);SFX.tease?SFX.tease():SFX.pop();
  const E=o.err&&ERR[o.err],gid=E?E[0]:null;if(E)P.gw=1;
  setTimeout(()=>{if(!live())return;
    if(P.tries===1){
      const r=o.err||!o.re?pickL(OOPS):[o.re,o.rj];mina(r[0],r[1],o.err?'think':'wow','k-oops');
      const hint=o.h||(E?E[1]:'質問を もう一度 よく 見て。 だれの こと？ いつの こと？ なにを きかれてる？');
      setTimeout(()=>{minaJa('think',`💡 <b>ヒント</b>　${hint}`,'snhint');setTimeout(answers,350)},500)}
    else explain(o,gi,E,gid)},600)}
function explain(o,gi,E,gid){const N=P.N,good=N.o[gi>=0?gi:0],g=gid&&gById(gid);P.st.miss++;
  if(gid){gramRec(gid,0);const r=P.st.g[gid]=P.st.g[gid]||{ok:0,hint:0,miss:0};r.miss++}
  const rules=g?g.n.r.slice(0,2):[];
  const d=minaJa('smile',`<b>${g?'📘 '+esc(g.n.t):'💡 ここが ポイント'}</b>
    <span class="snfix"><s>${esc(o.en)}</s><br>⭕ <b class="snen">${esc(good.en)}</b></span>
    <span class="snwhy">${E?E[2]:(o.h||'答えの 意味が 質問と ずれて いたよ')}</span>
    ${rules.length?`<span class="snrule">${rules.map(r=>'・'+esc(r)).join('<br>')}</span>`:''}`,'snexp',
    [['わかった！ つづける ▶',()=>{const b=d.querySelector('.snbtns');if(b)b.remove();go()}]]);
  const [ex,tx]=ML(g?'sn_explain':'sn_explainMean',{g:g?'「'+g.n.t+'」':''});setTimeout(()=>{if(live())minaJa(ex,tx,'snsmall')},300);
  const go=()=>{if(!live())return;you(good.en,'snfixed');setTimeout(()=>{if(!live())return;mina(good.re||'OK!',good.rj||'',"smile",'k-good');if(good.go){afterTalk(()=>good.go(),300);return}P.at=good.nx||N.nx||'end';afterTalk(turn)},500)}}

/* ---------- the end ---------- */
function finish(N){if(!live())return;const s=P.s,st=P.st,first=!SD.done[s.id]&&!s.kind;$('sans').innerHTML='';
  if(N.s)mina(fill(N.s,P.V,s.slots),fill(N.j,P.V,s.slots),N.good?'love':'wow',N.good?'k-good':'k-oops');
  const key=P.at,good=!!N.good,title=N.t||'おしまい';
  const ek=s.id+':'+key,newEnd=!s.kind&&!SD.end[ek];if(!s.kind)SD.end[ek]=1;
  const perfect=!st.miss&&!st.hint&&(st.ok>=3);
  const pay=(first?PAY[s.lv]*2:Math.max(3,PAY[s.lv]/2|0))+(perfect?5:0)+(newEnd?(good?6:3):0);
  if(!s.kind)SD.done[s.id]=(SD.done[s.id]||0)+1;SD.n++;SD.last=Date.now();if(s.kind==='tok')SD.tok++;
  if(perfect)SD.best=(SD.best||0)+1;save();
  const E=s.kind?[]:endsOf(s),got=s.kind?0:endsGot(s),tot=E.length;
  /* Mina's word on how it went */
  let k='sn_endGood',v={t:title,n:st.ok,h:st.hint,m:st.miss,f:st.free,got,tot};
  const gs=Object.entries(st.g),missG=gs.filter(([,r])=>r.miss).map(([id])=>id),hintG=gs.filter(([,r])=>r.hint&&!r.miss).map(([id])=>id),okG=gs.filter(([,r])=>r.ok&&!r.miss&&!r.hint).map(([id])=>id);
  if(SD.n===1)k='sn_endFirst';
  else if(missG.length){k='sn_endMiss';v.g='「'+gName(missG[0])+'」'}
  else if(perfect){k='sn_endPerfect';v.g=okG[0]?'「'+gName(okG[0])+'」':''}
  else if(hintG.length){k='sn_endHint';v.g='「'+gName(hintG[0])+'」'}
  else if(st.free>=2)k='sn_endFree';
  if(!s.kind&&got===tot&&tot>1)k='sn_endAll';
  else if(!s.kind&&!good&&Math.random()<.5)k='sn_endBad';
  if(s.kind==='tok')k=missG.length?'sn_tokMiss':st.hint?'sn_tokHint':'sn_tokPerfect';
  if(!v.g)v.g=missG[0]||hintG[0]||okG[0]?'「'+gName(missG[0]||hintG[0]||okG[0])+'」':'';
  const [ex,tx]=ML(k,v);
  /* grammar of this talk, the stumbled ones first, with the way to study them */
  const GL=[...missG,...hintG,...okG].slice(0,5);
  const lesFor=id=>window.GRAMLINK&&GRAMLINK.lessonsFor?GRAMLINK.lessonsFor(id)[0]:null;
  setTimeout(()=>{if(!live())return;$('sq').textContent=good?'★':'🏁';
    $('sans').innerHTML=`<div class="kres">
      ${s.kind?`<p class="kend good">🎯 とっくん おわり！</p>`:`<p class="kend ${good?'good':'fun'}">${good?'★':'😂'} エンド「${esc(title)}」${newEnd?' <small>NEW!</small>':''}</p>
      <div class="kends">${E.map(e=>SD.end[s.id+':'+e[0]]?`<span class="${e[1]?'g':''} ${e[0]===key?'now':''}">${e[1]?'★':'😂'} ${esc(e[2])}</span>`:`<span class="no">${e[1]?'★':'？'} ？？？</span>`).join('')}</div>
      <p class="kendn">🏁 見つけた エンド ${got}/${tot}${good?'':'　<b>★の エンドは べつの 答えの 先に あるよ</b>'}</p>`}
      <div class="snscore"><span>⭕ 1回で <b>${st.ok}</b></span><span>💡 ヒントで <b>${st.hint}</b></span><span>📘 解説 <b>${st.miss}</b></span><span>✍️ 自分で <b>${st.free}</b></span></div>
      <p class="kpay">🪙 <b>${pay}まい</b>${first?' <small>はじめては 2ばい！</small>':''}${perfect?' <small>ノーミス +5</small>':''}${newEnd?' <small>新しい エンド</small>':''}</p>
      <div class="kmina"><span class="lface">${MINA.face('m',ex)}</span><p>${tx}</p></div>
      ${GL.length?`<div class="kwords kgl sngl"><small>📘 この 会話の 文法（${missG.length?'📘 解説を きいた ものから 復習しよう':'よく できたね'}）</small><div>${GL.map(id=>{const r=st.g[id],L=lesFor(id);return `<span class="sng ${r.miss?'miss':r.hint?'hint':'ok'}"><b>${r.miss?'📘':r.hint?'💡':'⭕'} ${esc(gName(id))}</b><span><button data-gn="${id}" class="sub">${owned(id)?'📚 ノート':'🔍 おためし'}</button>${r.miss||r.hint?`<button data-tk="${id}" class="sub">🎯 とっくん</button>`:''}${L&&(r.miss||r.hint)?`<button data-ls="${L.id}" class="sub">📖 授業</button>`:''}</span></span>`}).join('')}</div></div>`:''}
      <div class="row"><button id="sagain" class="${good?'sub':''}">🔁 ${s.kind?'もう一回':'さいしょから'}</button><button id="smore" class="${good?'':'sub'}">🗣️ ほかの 会話</button></div>
    </div>`;
    const r=$('sans').getBoundingClientRect();H.coinBurst(r.left+r.width/2,r.top+20,pay);good?(SFX.fanfare?SFX.fanfare(1):SFX.chime()):(SFX.tease?SFX.tease():SFX.pop());
    $('sans').querySelectorAll('[data-gn]').forEach(b=>b.onclick=()=>{SFX.vopen();P=null;openGram(b.dataset.gn,list)});
    $('sans').querySelectorAll('[data-tk]').forEach(b=>b.onclick=()=>{SFX.vopen();tokkun([b.dataset.tk])});
    $('sans').querySelectorAll('[data-ls]').forEach(b=>b.onclick=()=>{SFX.vopen();hush();P=null;LESSON.open(b.dataset.ls,list)});
    const from=P.from,again=s.kind==='tok'?()=>tokkun(P.ids):()=>play(s.id,from);
    $('sagain').onclick=()=>{SFX.vopen();again()};$('smore').onclick=()=>{SFX.vopen();P=null;list()};
    setTimeout(()=>$('sans').scrollIntoView({behavior:'smooth',block:'end'}),100)},1500)}

/* ---------- 🎯 苦手 とっくん: 5 grammar checks in a row ---------- */
function tokkun(ids){const lv=LV.includes(myLv())?myLv():'es',lvl=GLV[lv];
  let pool=(ids||weakAll()).filter(id=>DR[id]);
  if(!pool.length)pool=Object.keys(DR).filter(id=>id.startsWith(lvl)&&(owned(id)||Math.random()<.5));
  if(!pool.length)pool=Object.keys(DR).filter(id=>id.startsWith(lvl));
  pool=shuffle(pool);const nodes={},n=5;for(let i=0;i<n;i++)nodes['d'+i]={dr:pool[i%pool.length],nx:i<n-1?'d'+(i+1):'e'};
  nodes.e={end:1,good:1,t:'とっくん',s:"That's all! You worked hard.",j:'おしまい！ よく がんばったね'};
  const s={id:'tokkun',kind:'tok',lv,t:'苦手 とっくん',ico:'🎯',start:'d0',nodes,g:pool.slice(0,3)};
  begin(s);P.ids=ids;const [ex,tx]=ML(ids||weakAll().length?'sn_tokStart':'sn_tokLevel',{g:'「'+pool.slice(0,2).map(gName).join('」「')+'」',lvn:LVN[lv]});minaJa(ex,tx)}


window.SENSEI={open:list,play,tokkun,karte,rec:()=>SD,scenes:SC,endsN,endsAll,endsOf,endsGot,weak:weakAll,good:goodG,gScore,patterns,patText,check,_ready:()=>P};
})();
