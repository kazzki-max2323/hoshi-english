/* 嵐の ペンション: 浜辺の 左の 岬に ある 小さな 宿（ペンション ムーンシェル）の サウンドノベル。
   - 浜辺の 岬の 上の 小さな 家（#window の 中の 絵）を タップすると ひらく。夜は 窓に あかり、ときどき ふっと 消える
   - 文字送りの ノベル画面: 背景の 絵・雨の 音・かみなり・停電。セリフは 英語（🔊・訳は タップで）、ナレーションは 日本語
   - 英語で 聞きこみ（えらぶ 答えで 返事が かわる）、英語の メモや 札を 読みとくと 🔍てがかり が 手に 入る
   - さいごに 犯人を えらび、英語で てがかりを つきつける。だれを えらぶか・何を 見せるかで エンドが かわる（★3・😂8）
   - まちがえても 話は すすむ。聞きこみの とちゅうから やりなおせる
   お話は game/pension-story.js。ミナ先生の セリフは この ファイルの さいごに ある */
(()=>{
const {S:ST,sfx:SFX}=BEACH;
const H=HE,esc=H.esc,$=id=>document.getElementById(id);
const PS=PENSION_STORY,CH=PS.chars,CL=PS.clues,ND=PS.nodes;
const pickL=a=>a[Math.random()*a.length|0];
const val=(x,s)=>typeof x==='function'?x(s):x;
const ENDS=Object.keys(ND).filter(k=>ND[k].end);

/* ---------- the record ---------- */
const PD=(()=>{try{const s=JSON.parse(localStorage.getItem(SAVE_KEY)||'{}').pension;if(s&&s.end)return s}catch(e){}
  return {end:{},sv:null,plays:0,ja:0,met:0,told:0,miss:0,read:0}})();
_saveHooks.push(()=>{const s=JSON.parse(localStorage.getItem(SAVE_KEY)||'{}');s.pension=PD;localStorage.setItem(SAVE_KEY,JSON.stringify(s))});
const myLv=()=>{try{return MINA.level()}catch(e){return 'es'}};
const jaOn=()=>myLv()==='es'||!!PD.ja;
const endsN=()=>ENDS.filter(k=>PD.end[k]).length;
const goodN=()=>ENDS.filter(k=>PD.end[k]&&ND[k].end.good).length;

/* ---------- voice ---------- */
let enVoice=null;
function pickVoice(){if(!window.speechSynthesis)return;const vs=speechSynthesis.getVoices().filter(v=>/^en[-_]/i.test(v.lang));
  enVoice=vs.find(v=>/en[-_]US/i.test(v.lang)&&/Samantha|Google|Natural/i.test(v.name))||vs.find(v=>/en[-_]US/i.test(v.lang))||vs[0]||null}
if(window.speechSynthesis){pickVoice();speechSynthesis.addEventListener&&speechSynthesis.addEventListener('voiceschanged',pickVoice)}
function talk(en,c){if(!ST.sound||!window.speechSynthesis||!en)return;
  try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(String(en).replace(/Odette/g,'Oh-det').replace(/—/g,',').replace(/\.\.\.\s*/g,' '));u.lang='en-US';if(enVoice)u.voice=enVoice;
    u.pitch=c?c.p:1;u.rate=(ST.slow?.72:.92)*(c?c.r:1);u.volume=Math.min(1,(ST.vol&&ST.vol.voice!=null)?ST.vol.voice:1);speechSynthesis.speak(u)}catch(e){}}
const hush=()=>{try{speechSynthesis.cancel()}catch(e){}};

/* ---------- sounds of the storm (beach/scene.js の tone / noise) ---------- */
const sn=(f,...a)=>{try{f(...a)}catch(e){}};
const FX={
 rain:()=>{},
 wave:()=>{sn(noise,1.6,{v:.07,type:'lowpass',f:500,f2:1600,attack:.4})},
 thunderFar:()=>{flash(.35);setTimeout(()=>sn(noise,2.2,{v:.06,type:'lowpass',f:160,f2:60,attack:.25}),500)},
 thunder:()=>{flash(1);sn(noise,.35,{v:.12,f:1400,q:.6});sn(noise,2.8,{v:.16,type:'lowpass',f:260,f2:50,attack:.02})},
 blackout:()=>{setTimeout(()=>sn(tone,140,.5,'sawtooth',.025,0,40),250)},
 lightsOn:()=>{sn(tone,50,.35,'sawtooth',.02,0,120);sn(noise,.05,{v:.04,f:3000,q:2,delay:.3})},
 knock:()=>{SFX.knock&&SFX.knock();setTimeout(()=>sn(tone,170,.9,'sawtooth',.012,.15,250),500)},
 creak:()=>{sn(tone,150,.7,'sawtooth',.012,0,230);sn(tone,190,.5,'sawtooth',.008,.6,150)},
 steps:()=>{for(let i=0;i<4;i++){sn(tone,95,.08,'sine',.07,i*.42,70);sn(noise,.05,{v:.03,f:600,q:2,delay:i*.42})}},
 crash:()=>{for(let i=0;i<6;i++)sn(noise,.12+Math.random()*.2,{v:.06,f:3000+Math.random()*3000,q:2,delay:i*.04+Math.random()*.05});sn(tone,90,.2,'sine',.08,0,50)},
 clock:()=>{for(let i=0;i<3;i++){sn(tone,1600,.03,'sine',.03,i*.5);sn(noise,.015,{v:.03,f:4000,q:5,delay:i*.5})}sn(tone,523,1.2,'triangle',.03,1.5);sn(tone,392,1.4,'triangle',.03,2.2)},
 sting:()=>{[[220,0],[262,.18],[311,.36],[294,.7]].forEach(([f,d])=>sn(tone,f,.9,'triangle',.035,d));sn(tone,110,1.6,'sine',.04,0)},
 meow:()=>{sn(tone,620,.35,'sine',.035,0,880);sn(tone,880,.25,'sine',.025,.3,560)},
 dawn:()=>{[392,494,587,784].forEach((f,i)=>sn(tone,f,.9,'sine',.03,i*.18))},
 clue:()=>{sn(tone,330,.5,'triangle',.04,0);sn(tone,440,.5,'triangle',.04,.12);sn(tone,659,.9,'sine',.035,.24);sn(noise,.3,{v:.02,f:5000,q:1,delay:.24})}};
function flash(a){const f=document.querySelector('.pnFlash');if(!f)return;f.style.setProperty('--fa',a);f.classList.remove('on');void f.offsetWidth;f.classList.add('on')}
/* the rain keeps falling while the novel is open */
let rainT=null;
function rainOn(){if(rainT)return;rainT=setInterval(()=>{if(H.screen!=='pension'){clearInterval(rainT);rainT=null;return}
  const st=document.querySelector('.pnStage');if(!st||st.classList.contains('dawn'))return;const out=st.classList.contains('out');
  sn(noise,1.4,{v:out?.022:.011,type:'lowpass',f:out?2000:900,attack:.4});if(Math.random()<.03)FX.thunderFar()},1000)}

/* ---------- Mina ---------- */
const mline=(k,v)=>MINA.line(k,v||{});
const minaBox=(k,v)=>{const [ex,tx]=mline(k,v);return `<div class="kmina"><span class="lface">${MINA.face('m',ex)}</span><p>${tx}</p></div>`};

/* ================================================================ the little inn on the headland */
const INN=`<svg viewBox="0 0 40 30" aria-hidden="true">
  <path d="M4 16 L20 5 L36 16 Z" fill="#141322"/><rect x="7" y="15" width="26" height="14" fill="#1a1828"/>
  <rect x="27" y="3" width="3" height="7" fill="#141322"/>
  <rect class="pnW1" x="10" y="18" width="4" height="4" fill="#2a2838"/><rect class="pnW2" x="26" y="18" width="4" height="4" fill="#2a2838"/>
  <rect class="pnW3" x="18" y="10" width="4" height="3.5" fill="#2a2838"/><rect x="18" y="21" width="4" height="8" fill="#0e0d18"/>
</svg>`;
function inn(){let b=$('pnInn');const w=$('window');if(!w)return;
  if(!b){b=document.createElement('button');b.id='pnInn';b.setAttribute('aria-label','岬の ペンション');b.innerHTML=INN;w.appendChild(b);
    b.onclick=e=>{e.stopPropagation();if(H.screen!=='home')return;FX.creak();open()}}
  let d;try{d=SCENE.dbg()}catch(e){return}
  /* 岬の 上に のせる。岬は 画面の 左はしから W*.37 まで。浜辺の 窓（#window）の 中に 見える ところを えらぶ（PCの 広い 画面でも 見切れないように） */
  const k=d.k,hl=d.W*.37,px=Math.max(d.WL+14*k,Math.min(d.WL+d.WW*.12,hl*.8)),q=Math.min(1,px/hl),hy=d.hz-(62*(1-q)*(1-q*.35)+8)*k*(q>.92?Math.max(0,(1-q)/.08):1),wd=Math.round(24*k);
  b.style.width=wd+'px';b.style.left=Math.round(px-d.WL-wd/2)+'px';b.style.top=Math.round(hy-d.WT-wd*30/40+3*k)+'px';
  const dk=Math.max(0,Math.min(1,d.dark||0));b.style.setProperty('--dk',dk.toFixed(2));
  b.classList.toggle('off',H.screen!=='home')}
setTimeout(inn,600);addEventListener('resize',()=>setTimeout(inn,200));setInterval(inn,2500);
H.on('home',()=>setTimeout(inn,50));

/* ================================================================ the pictures behind the words */
const SKY='<defs><linearGradient id="pnSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0b0d1e"/><stop offset="1" stop-color="#1d2240"/></linearGradient><radialGradient id="pnGlow"><stop offset="0" stop-color="rgba(255,190,110,.75)"/><stop offset="1" stop-color="rgba(255,190,110,0)"/></radialGradient></defs>';
const WIN=(x,y,w,h)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#141a33"/><g class="pnWinRain"><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="url(#pnRainP)"/></g><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="none" stroke="#3a2a1c" stroke-width="3"/><line x1="${x+w/2}" y1="${y}" x2="${x+w/2}" y2="${y+h}" stroke="#3a2a1c" stroke-width="2"/>`;
const RAINP='<pattern id="pnRainP" width="8" height="16" patternUnits="userSpaceOnUse"><line x1="6" y1="0" x2="2" y2="10" stroke="rgba(170,200,255,.35)" stroke-width=".8"/></pattern>';
const BG={
 path:`${SKY}<rect width="320" height="180" fill="url(#pnSky)"/><path d="M0 120 Q60 112 120 118 T320 116 V180 H0Z" fill="#0d1a2c"/>
  <path d="M150 180 L190 70 Q215 52 250 60 L320 64 V180Z" fill="#0a0b14"/><g transform="translate(222 34)"><path d="M0 18 L18 6 L36 18Z" fill="#06060c"/><rect x="3" y="17" width="30" height="16" fill="#08080f"/><rect x="7" y="21" width="5" height="5" fill="#ffcf7a" class="pnLit"/><rect x="24" y="21" width="5" height="5" fill="#ffcf7a"/><rect x="15" y="10" width="5" height="4" fill="#ffcf7a" class="pnLit2"/></g>
  <circle cx="240" cy="57" r="30" fill="url(#pnGlow)" opacity=".5"/><path d="M160 180 Q190 140 200 110 Q210 90 225 80" fill="none" stroke="#1c1c28" stroke-width="5"/>
  <path d="M0 140 Q40 132 80 140 T160 138" fill="none" stroke="rgba(150,180,220,.25)" stroke-width="2"/>`,
 door:`${SKY}<rect width="320" height="180" fill="#120f14"/><rect x="40" y="0" width="240" height="180" fill="#2a1f1a"/><g fill="#231a15">${[0,1,2,3,4,5].map(i=>`<rect x="40" y="${i*30}" width="240" height="2"/>`).join('')}</g>
  <rect x="115" y="40" width="90" height="140" rx="3" fill="#4a3324"/><rect x="122" y="48" width="76" height="60" rx="2" fill="#3d2a1e"/><rect x="122" y="114" width="76" height="60" rx="2" fill="#3d2a1e"/><circle cx="190" cy="118" r="3" fill="#d8b878"/>
  <rect x="155" y="40" width="4" height="140" fill="#ffcf7a" class="pnCrack" opacity=".0"/><circle cx="235" cy="60" r="26" fill="url(#pnGlow)"/><rect x="230" y="52" width="10" height="16" rx="2" fill="#ffe0a0"/><rect x="232" y="46" width="6" height="6" fill="#2a1f1a"/>
  <text x="160" y="30" font-size="11" text-anchor="middle" fill="#d8b878" font-family="Georgia,serif" letter-spacing="2">MOONSHELL INN</text>`,
 lobby:`${SKY}<rect width="320" height="180" fill="#2c1a17"/><rect y="0" width="320" height="18" fill="#21130f"/><rect y="140" width="320" height="40" fill="#3b2418"/><g stroke="#2c1a10">${[0,1,2,3,4,5,6,7].map(i=>`<line x1="${i*44}" y1="140" x2="${i*44-20}" y2="180"/>`).join('')}</g>
  <rect x="14" y="70" width="80" height="72" fill="#4a3a32"/><rect x="26" y="92" width="56" height="50" fill="#120806"/><rect x="8" y="64" width="92" height="9" fill="#5a4638"/>
  <g class="pnFire"><ellipse cx="54" cy="134" rx="20" ry="9" fill="#ff8a3d"/><path d="M40 136 Q46 112 54 104 Q60 116 68 136Z" fill="#ffb347"/><path d="M48 136 Q52 120 56 114 Q60 124 62 136Z" fill="#ffe08a"/></g>
  <circle cx="54" cy="120" r="44" fill="url(#pnGlow)" opacity=".55"/>
  ${WIN(130,36,60,64)}<rect x="126" y="100" width="68" height="5" fill="#4a3324"/>
  <rect x="236" y="104" width="44" height="36" fill="#3a2a20"/><rect x="230" y="98" width="56" height="7" fill="#4a3324"/><rect x="240" y="62" width="36" height="36" fill="rgba(180,220,255,.12)" stroke="#a89060" stroke-width="1.5" class="pnCase"/>
  <g class="pnPearl"><circle cx="258" cy="84" r="12" fill="url(#pnGlow)" opacity=".6"/><circle cx="258" cy="85" r="5" fill="#f4f2ff"/><circle cx="256" cy="83" r="1.6" fill="#fff"/></g>
  <circle cx="300" cy="44" r="10" fill="#d8c8a0" stroke="#5a4330" stroke-width="2"/><line x1="300" y1="44" x2="300" y2="37" stroke="#3a2a1a" stroke-width="1.2"/><line x1="300" y1="44" x2="305" y2="44" stroke="#3a2a1a" stroke-width="1.2"/><rect x="298" y="54" width="4" height="34" fill="#4a3324"/>`,
 dining:`${SKY}<rect width="320" height="180" fill="#2a1d1a"/>${WIN(40,24,54,56)}${WIN(226,24,54,56)}<rect y="140" width="320" height="40" fill="#3b2418"/>
  <rect x="30" y="112" width="260" height="10" rx="2" fill="#e8dcc8"/><rect x="30" y="122" width="260" height="22" fill="#d8ccb6"/>${[80,160,240].map(x=>`<rect x="${x-2}" y="94" width="4" height="18" fill="#f4ecd8"/><path d="M${x} 86 Q${x+3} 91 ${x} 94 Q${x-3} 91 ${x} 86Z" fill="#ffd27a" class="pnCandle"/><circle cx="${x}" cy="92" r="16" fill="url(#pnGlow)" opacity=".5"/>`).join('')}
  ${[110,200].map(x=>`<ellipse cx="${x}" cy="114" rx="14" ry="4" fill="#fff"/><ellipse cx="${x}" cy="113" rx="9" ry="2.4" fill="#e8a060"/>`).join('')}`,
 room:`${SKY}<rect width="320" height="180" fill="#232036"/>${WIN(190,30,80,70)}<rect y="146" width="320" height="34" fill="#2e2440"/>
  <rect x="20" y="110" width="140" height="40" rx="4" fill="#5a4a7a"/><rect x="20" y="96" width="34" height="22" rx="6" fill="#e8e0f4"/><rect x="14" y="80" width="10" height="70" fill="#4a3324"/><rect x="60" y="104" width="100" height="18" rx="4" fill="#7a68a8"/>
  <rect x="200" y="120" width="14" height="30" fill="#4a3324"/><path d="M196 104 L218 104 L212 120 L202 120Z" fill="#e8d8b0"/><circle cx="207" cy="112" r="20" fill="url(#pnGlow)" opacity=".5" class="pnLamp"/>`,
 hall:`${SKY}<rect width="320" height="180" fill="#1e1a22"/><path d="M0 0 L120 60 L200 60 L320 0Z" fill="#17141a"/><path d="M0 180 L120 120 L200 120 L320 180Z" fill="#2c2018"/><rect x="120" y="60" width="80" height="60" fill="#0c0a10"/>
  ${[[20,40,30,110],[60,56,22,82],[268,40,30,110],[236,56,22,82]].map(([x,y,w,h])=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#3a2a1e" transform="skewY(${x<160?12:-12})" transform-origin="${x} ${y}"/>`).join('')}
  <text x="66" y="66" font-size="7" fill="#d8b878" font-family="Georgia,serif" transform="skewY(12)">2</text><text x="248" y="66" font-size="7" fill="#d8b878" font-family="Georgia,serif" transform="skewY(-12)">3</text>
  <circle cx="160" cy="50" r="18" fill="url(#pnGlow)" opacity=".35"/><rect x="157" y="40" width="6" height="8" fill="#ffe0a0" opacity=".7"/>`,
 kitchen:`${SKY}<rect width="320" height="180" fill="#2a2620"/><rect y="0" width="320" height="10" fill="#1f1c18"/><g fill="#38322a">${[0,1,2,3,4,5,6,7,8,9].map(i=>`<rect x="${i*34}" y="10" width="33" height="20"/>`).join('')}</g>
  <rect x="16" y="104" width="150" height="46" fill="#5a5048"/><rect x="16" y="98" width="150" height="8" fill="#7a6e60"/><circle cx="50" cy="96" r="12" fill="#3a3632"/><rect x="38" y="78" width="26" height="18" rx="3" fill="#8a8a92"/><circle cx="110" cy="96" r="12" fill="#3a3632"/>
  <g fill="#a8a8b0">${[30,56,82,108].map(x=>`<rect x="${x}" y="40" width="3" height="18"/><ellipse cx="${x+1.5}" cy="62" rx="7" ry="4"/>`).join('')}</g>
  <rect x="226" y="50" width="54" height="64" rx="3" fill="#6a6a72" stroke="#3a3a42" stroke-width="2"/><rect x="236" y="58" width="34" height="14" fill="#f4ecd0"/><text x="253" y="68" font-size="6" text-anchor="middle" fill="#a02020" font-family="Georgia,serif">MAIN</text>
  <rect x="246" y="80" width="14" height="26" rx="2" fill="#2a2a30"/><rect x="249" y="83" width="8" height="10" fill="#e04040"/><rect y="150" width="320" height="30" fill="#4a4038"/>`,
 attic:`<defs><radialGradient id="pnGlow"><stop offset="0" stop-color="rgba(255,190,110,.8)"/><stop offset="1" stop-color="rgba(255,190,110,0)"/></radialGradient></defs><rect width="320" height="180" fill="#120e10"/>
  <path d="M0 0 L160 0 L0 120Z" fill="#1e1612"/><path d="M320 0 L160 0 L320 120Z" fill="#1e1612"/>${[40,80,120].map(y=>`<line x1="0" y1="${y}" x2="${y*1.33}" y2="0" stroke="#2c201a" stroke-width="5"/><line x1="320" y1="${y}" x2="${320-y*1.33}" y2="0" stroke="#2c201a" stroke-width="5"/>`).join('')}
  <rect x="112" y="40" width="96" height="80" fill="#7a5a2a"/><rect x="118" y="46" width="84" height="68" fill="#2a2a3a"/><circle cx="144" cy="70" r="9" fill="#c8a888"/><rect x="134" y="80" width="20" height="30" fill="#1a2a5a"/><circle cx="176" cy="70" r="9" fill="#d8b8a0"/><path d="M164 112 L170 80 L182 80 L188 112Z" fill="#f4f4fa" class="pnDress"/>
  <rect x="236" y="130" width="8" height="18" fill="#f4ecd8"/><path d="M240 120 Q244 126 240 130 Q236 126 240 120Z" fill="#ffd27a" class="pnCandle"/><circle cx="240" cy="128" r="40" fill="url(#pnGlow)" opacity=".55" class="pnCandleGlow"/><rect y="148" width="320" height="32" fill="#1c1410"/>`,
 morning:`<defs><linearGradient id="pnDawn" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7ab0e8"/><stop offset=".6" stop-color="#ffd8a8"/><stop offset="1" stop-color="#ffb070"/></linearGradient></defs><rect width="320" height="180" fill="url(#pnDawn)"/>
  <circle cx="90" cy="112" r="22" fill="#fff4c8"/><rect y="112" width="320" height="68" fill="#3a78b0"/><g stroke="rgba(255,240,200,.7)" stroke-width="2">${[0,1,2,3,4].map(i=>`<line x1="${70-i*4}" y1="${120+i*10}" x2="${110+i*4}" y2="${120+i*10}"/>`).join('')}</g>
  <path d="M170 180 L200 90 Q225 74 255 80 L320 84 V180Z" fill="#4a5a48"/><g transform="translate(228 52)"><path d="M0 18 L18 6 L36 18Z" fill="#8a4a3a"/><rect x="3" y="17" width="30" height="16" fill="#f0e6d4"/><rect x="7" y="21" width="5" height="5" fill="#6a8ab0"/><rect x="24" y="21" width="5" height="5" fill="#6a8ab0"/></g>`};
const OUT={path:1,door:1};

/* ================================================================ the screen */
let S=null,G=null;   // S: the story state  G: what is on the screen now
const live=()=>G&&$('pnBox');
function frame(){
  H.show('pension',`<section class="pnl pn" data-stay>
    <div class="qtop"><button class="x" id="pnx" aria-label="もどる">←</button><b>🌩️ 嵐の ペンション</b><button id="pnc" class="sub pnclue" aria-label="てがかり">🔍 <span id="pncn">${S.clues.length}</span></button></div>
    <div class="pnStage" id="pnStage"><svg class="pnBg" viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice"><defs>${RAINP}</defs><g id="pnBgG"></g></svg><div class="pnRain"></div><div class="pnDark"></div><div class="pnChar" id="pnChar"></div><div class="pnFlash"></div></div>
    <div class="pnBox" id="pnBox"><b class="pnName" id="pnName"></b><p class="pnTxt" id="pnTxt"></p><div class="pnJaW" id="pnJaW"></div><i class="pnNext" id="pnNext">▼</i></div>
    <div id="pnOpts" class="pnOpts"></div>
  </section>`);
  G={bg:null,typing:null,wait:null};
  $('pnx').onclick=()=>{SFX.back();hush();G=null;title()};
  $('pnc').onclick=e=>{e.stopPropagation();SFX.book();notes()};
  const adv=()=>{if(!G)return;if(G.typing){G.typing();return}if(G.wait){const f=G.wait;G.wait=null;$('pnNext').classList.remove('on');f()}};
  $('pnBox').onclick=e=>{if(e.target.closest('button'))return;adv()};$('pnStage').onclick=adv;
  rainOn()}
function setBg(name,dark){const st=$('pnStage');if(!st)return;
  if(G.bg!==name){G.bg=name;$('pnBgG').innerHTML=BG[name]||BG.lobby;st.classList.add('fade');setTimeout(()=>st.classList.remove('fade'),400)}
  st.classList.toggle('out',!!OUT[name]);st.classList.toggle('dark',!!dark);st.classList.toggle('dawn',name==='morning');st.classList.toggle('gone',!!S.f.gone)}
function who(w){const c=$('pnChar');if(!c)return;if(!w||w==='n'||w==='y'){c.classList.remove('on');return}
  const ch=CH[w];if(c.dataset.w!==w){c.dataset.w=w;c.innerHTML=`<span>${ch.ico}</span>`;c.classList.remove('on');void c.offsetWidth}c.classList.add('on')}

/* one line in the box: type it out, then wait for a tap */
function line(L,done){if(!live())return;const [w,en,ja]=L,nar=w==='n',ch=CH[w]||{},on=jaOn();
  const box=$('pnBox');box.className='pnBox'+(nar?' nar':'')+(w==='y'?' you':'');
  $('pnName').innerHTML=nar?'':`${ch.ico} ${esc(ch.n)}`;who(w);
  $('pnJaW').innerHTML=!nar&&ja?`<small class="pnJa ${on?'on':''}">${esc(ja)}</small><span class="pnBtns"><button class="pnSay" aria-label="もう一度 きく">🔊</button>${on?'':'<button class="pnJab">訳</button>'}</span>`:'';
  const sb=box.querySelector('.pnSay');if(sb)sb.onclick=e=>{e.stopPropagation();talk(en,ch)};
  const jb=box.querySelector('.pnJab');if(jb)jb.onclick=e=>{e.stopPropagation();SFX.pop();box.querySelector('.pnJa').classList.add('on');jb.remove()};
  if(!nar)talk(en,ch);
  const t=$('pnTxt'),txt=String(en);t.classList.toggle('en',!nar);t.textContent='';let i=0;
  const fin=()=>{clearInterval(iv);t.textContent=txt;G.typing=null;G.wait=done;$('pnNext').classList.add('on')};
  const iv=setInterval(()=>{if(!live()){clearInterval(iv);return}i+=1;t.textContent=txt.slice(0,i);if(i>=txt.length)fin()},nar?42:30);
  G.typing=fin;$('pnNext').classList.remove('on')}
function lines(arr,done){let i=0;const nx=()=>{if(!live())return;if(i>=arr.length)return done();line(arr[i++],nx)};nx()}

/* ================================================================ going through the story */
function newState(){return {at:PS.start,f:{},clues:[],asked:{},seen:{},hubN:0,shown:[],pts:0,miss:0}}
function go(id){if(!live())return;let n=ND[id],guard=0;
  while(n&&n.go&&!n.L&&guard++<6){id=n.go(S);n=ND[id]}
  if(!n)return title();S.at=id;
  if(n.save){PD.sv=JSON.parse(JSON.stringify(S));save()}
  if(id==='n4')S.f.gone=1;if(n.set)S.f[n.set]=1;if(n.clue)getClue(n.clue);
  const fx=n.fx||[];setBg(fx.includes('dawn')?'morning':n.bg||G.bg||'lobby',n.dark);fx.forEach(k=>FX[k]&&FX[k]());
  $('pnOpts').innerHTML='';
  const after=()=>{if(!live())return;
    if(n.end)return ending(id,n);
    if(n.go)return go(n.go(S));
    if(n.read)return read(n.read,()=>lines(n.L2||[],()=>go(n.nx)));
    if(n.prove)return prove();
    if(n.o)return choose(val(n.o,S));
    if(n.nx){setTimeout(()=>go(n.nx),200)}};
  lines(val(n.L,S)||[],after)}
function getClue(k){if(!k||S.clues.includes(k))return;S.clues.push(k);const c=CL[k];FX.clue();
  const cn=$('pncn');if(cn){cn.textContent=S.clues.length;const b=$('pnc');b.classList.remove('pop');void b.offsetWidth;b.classList.add('pop')}
  H.toast(`🔍 てがかり <b>${c[0]} ${esc(c[1])}</b> <small>${esc(c[3])}</small>`,3400)}

/* the answers */
function choose(opts){if(!live())return;const on=jaOn(),nid=S.at;
  const O=opts.filter((o,i)=>(!o.if||o.if(S))&&!(o.once&&S.asked[nid+':'+i])).map(o=>({o,i:opts.indexOf(o)}));
  $('pnNext').classList.remove('on');
  $('pnOpts').innerHTML=O.map(({o,i})=>o.act?`<button class="pnAct ${o.cls||''} ${o.seen&&S.seen[o.seen]?'seen':''}" data-o="${i}">${esc(o.e)}${o.seen&&S.seen[o.seen]?' <small>✓</small>':''}</button>`
    :`<button class="pnEn" data-o="${i}">${esc(o.e)}${on&&o.j?`<small>${esc(o.j)}</small>`:''}</button>`).join('');
  $('pnOpts').querySelectorAll('[data-o]').forEach(b=>b.onclick=()=>pick(opts[+b.dataset.o],nid+':'+b.dataset.o));
  setTimeout(()=>{const o=$('pnOpts');if(o&&o.lastElementChild)o.lastElementChild.scrollIntoView({block:'nearest',behavior:'smooth'})},80)}
function pick(o,key){if(!live())return;$('pnOpts').innerHTML='';
  if(o.once)S.asked[key]=1;if(o.seen)S.seen[o.seen]=1;if(o.set)S.f[o.set]=1;
  if(o.act){SFX.step();return go(o.nx)}
  SFX.tap&&SFX.tap();
  const rest=()=>{if(o.clue)getClue(o.clue);(o.fx||[]).forEach(k=>FX[k]&&FX[k]());
    if(o.ok===0)setTimeout(()=>{try{SFX.tease()}catch(e){}},300);
    lines(o.r||[],()=>go(o.nx))};
  line(['y',o.e,o.j],rest)}

/* 📜 read the English and answer */
function read(R,done){if(!live())return;PD.read++;save();let miss=0;
  $('pnNext').classList.remove('on');
  const box=$('pnBox');box.className='pnBox nar';$('pnName').innerHTML='';$('pnTxt').textContent='📜 英語を 読んでみよう';$('pnJaW').innerHTML='';who(R.say||null);
  $('pnOpts').innerHTML=`<div class="pnDoc"><p class="pnDocEn">${esc(R.en)}</p><p class="pnDocJa" hidden>${esc(R.ja)}</p><button class="pnSay sub" id="pnds">🔊</button></div>
    <p class="pnQ">❓ ${esc(R.q)}</p><div class="pnAns">${R.a.map((a,i)=>`<button data-a="${i}">${esc(a[0])}</button>`).join('')}</div><div id="pnHint"></div>`;
  const voice=R.say?CH[R.say]:{p:1,r:.95};
  $('pnds').onclick=()=>talk(R.en.replace(/\n/g,'. '),voice);setTimeout(()=>talk(R.en.replace(/\n/g,'. '),voice),300);
  $('pnOpts').querySelectorAll('[data-a]').forEach(b=>b.onclick=()=>{if(b.disabled)return;const ok=R.a[+b.dataset.a][1];
    if(!ok){SFX.wrong();b.disabled=true;b.classList.add('no');miss++;S.miss++;PD.miss++;save();
      $('pnHint').innerHTML=`<p class="pnHint">💡 ${esc(R.hint)}${miss>1?'<br><small>のこりの どれかだよ。 あせらなくて だいじょうぶ</small>':''}</p>`;return}
    SFX.correct();b.classList.add('ok');$('pnOpts').querySelectorAll('[data-a]').forEach(x=>x.disabled=true);
    $('pnOpts').querySelector('.pnDocJa').hidden=false;
    if(R.clue)getClue(R.clue);
    $('pnHint').innerHTML=`<p class="pnOk">⭕ ${miss?'わかったね！':'よく 読めたね！'}</p><div class="row"><button id="pnGo">つぎへ ▶</button></div>`;
    $('pnGo').onclick=()=>{SFX.step();$('pnOpts').innerHTML='';done()};
    setTimeout(()=>{const g=$('pnGo');if(g)g.scrollIntoView({block:'nearest',behavior:'smooth'})},80)});
  setTimeout(()=>{const o=$('pnOpts');if(o)o.scrollIntoView({block:'nearest',behavior:'smooth'})},80)}

/* ⚖️ show the clues to Mr. Crane */
function prove(){if(!live())return;
  const left=S.clues.filter(k=>CL[k][2]&&!S.shown.includes(k));
  if(S.shown.length>=3||!left.length)return judge();
  $('pnName').innerHTML='';$('pnTxt').textContent=`🔍 どの てがかりを 見せる？（${S.shown.length+1}つめ／3つまで）`;$('pnJaW').innerHTML='';$('pnBox').className='pnBox nar';who('c');
  const on=jaOn();
  $('pnOpts').innerHTML=left.map(k=>`<button class="pnEn pnPr" data-k="${k}"><i>${CL[k][0]} ${esc(CL[k][1])}</i>${esc(CL[k][2])}${on?`<small>${esc(CL[k][3])}</small>`:''}</button>`).join('')+(S.shown.length?`<button class="pnAct" id="pnEnough">…それだけ</button>`:'');
  $('pnOpts').querySelectorAll('[data-k]').forEach(b=>b.onclick=()=>{const k=b.dataset.k;$('pnOpts').innerHTML='';S.shown.push(k);if(CL[k][4])S.pts++;SFX.tap&&SFX.tap();
    line(['y',CL[k][2],CL[k][3]],()=>{if(CL[k][4])FX.sting();lines(PS.rebut[k]||[],prove)})});
  const en=$('pnEnough');if(en)en.onclick=()=>{$('pnOpts').innerHTML='';judge()}}
function judge(){go(S.pts>=3?'confess':S.clues.includes('S')?'cat':'eEscape')}

/* 🏁 an end */
function ending(id,n){const good=!!n.end.good,first=!PD.end[id];PD.end[id]=(PD.end[id]||0)+1;save();
  const coins=first?(good?30:10):0;
  let k=good?(id==='eTrueG'?'pn_endGhost':id==='eCat'?'pn_endCat':'pn_endTrue'):id==='eEscape'?'pn_endEscape':id==='eSleep'||id==='eSwim'?'pn_endEarly':'pn_endFun';
  const v={t:n.end.t,n:endsN(),tot:ENDS.length};
  if(good&&id!=='eTrueG'&&!PD.end.eTrueG&&Math.random()<.5)k='pn_endHint';
  const canHub=!!PD.sv&&!['eSwim','eSleep'].includes(id);
  $('pnName').innerHTML='';$('pnTxt').textContent='';$('pnJaW').innerHTML='';who(null);$('pnBox').className='pnBox nar endb';
  $('pnTxt').innerHTML=`<span class="pnEnd ${good?'good':'fun'}">${good?'★':'😂'} エンド「${esc(n.end.t)}」${first?' <small>NEW!</small>':''}</span>`;
  $('pnOpts').innerHTML=`<div class="kres">
    ${coins?`<p class="kpay pnpay">🪙 <b>${coins}まい</b> <small>はじめての エンド</small></p>`:''}
    <div class="kends">${ENDS.map(e=>PD.end[e]?`<span class="${ND[e].end.good?'g':''} ${e===id?'now':''}">${ND[e].end.good?'★':'😂'} ${esc(ND[e].end.t)}</span>`:`<span class="no">${ND[e].end.good?'★':'？'} ？？？</span>`).join('')}</div>
    <p class="kendn">🏁 エンド ${endsN()}/${ENDS.length}</p>
    ${minaBox(k,v)}
    <div class="row">${canHub?'<button id="pnHub" class="sub">🔍 聞きこみから</button>':''}<button id="pnNew" class="sub">🔁 はじめから</button><button id="pnOut">🏖️ 浜辺へ</button></div></div>`;
  good?SFX.done():(SFX.tease?SFX.tease():SFX.pop());
  if(coins)setTimeout(()=>{const r=document.querySelector('.pnpay');if(r){const b=r.getBoundingClientRect();H.coinBurst(b.left+b.width/2,b.top,coins)}},500);
  const h=$('pnHub');if(h)h.onclick=()=>{SFX.step();resume()};
  $('pnNew').onclick=()=>{SFX.step();begin()};
  $('pnOut').onclick=()=>{SFX.back();hush();G=null;H.home()};
  setTimeout(()=>{const o=$('pnOpts');if(o)o.scrollIntoView({block:'nearest',behavior:'smooth'})},120)}

/* 🔍 the clue notebook */
function notes(){const p=$('pnStage');if(!p||$('pnNote'))return;const d=document.createElement('div');d.id='pnNote';d.className='pnNote';
  const all=Object.keys(CL);
  d.innerHTML=`<div class="pnNoteIn"><div class="qtop"><b>🔍 てがかり ${S.clues.length}/${all.length}</b><button class="x" id="pnNx" aria-label="とじる">✕</button></div>
    ${S.clues.length?S.clues.map(k=>`<div class="pnCl"><span>${CL[k][0]}</span><div><b>${esc(CL[k][1])}</b><small>${esc(CL[k][3])}</small>${CL[k][2]?`<button class="pnClEn" data-k="${k}">🔊 ${esc(CL[k][2])}</button>`:''}</div></div>`).join(''):'<p class="note">まだ てがかりは ない。 みんなに 英語で きいたり、 英語の メモを 読んだり してみよう</p>'}
    ${S.clues.length&&S.clues.length<3&&S.at==='hub'?'<p class="note">てがかりが 3つ そろうと、 みんなを あつめられるよ</p>':''}</div>`;
  $('pnBox').parentNode.appendChild(d);
  d.querySelectorAll('[data-k]').forEach(b=>b.onclick=()=>talk(CL[b.dataset.k][2],CH.y));
  const close=()=>{SFX.back();d.remove()};$('pnNx').onclick=close;d.onclick=e=>{if(e.target===d)close()}}

/* ================================================================ the title */
function title(){hush();const sv=PD.sv;
  H.show('pension',`<section class="pnl pn">
    <div class="qtop"><button class="x" id="pnx" aria-label="もどる">←</button><b>🌩️ 嵐の ペンション</b><span class="qn"></span></div>
    <div class="pnStage out pnTitle" id="pnStage"><svg class="pnBg" viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice"><defs>${RAINP}</defs><g>${BG.path}</g></svg><div class="pnRain"></div><div class="pnFlash"></div>
      <div class="pnLogo"><small>A STORMY NIGHT AT</small><b>Moonshell Inn</b><span>消えた 星の真珠</span></div></div>
    ${minaBox(PD.plays?(sv?'pn_titleResume':'pn_titleAgain'):'pn_title',{n:endsN(),tot:ENDS.length})}
    <div class="row pnMenu">${sv?`<button id="pnRes">🔍 聞きこみの つづき <small>てがかり ${sv.clues.length}</small></button>`:''}<button id="pnStart" class="${sv?'sub':''}">▶ はじめから</button></div>
    <details class="mfold"><summary>🏁 エンド ${endsN()}/${ENDS.length}</summary><div class="kends">${ENDS.map(e=>PD.end[e]?`<span class="${ND[e].end.good?'g':''}">${ND[e].end.good?'★':'😂'} ${esc(ND[e].end.t)}</span>`:`<span class="no">${ND[e].end.good?'★':'？'} ？？？</span>`).join('')}</div>
      <label class="kjat"><input type="checkbox" id="pnja" ${PD.ja?'checked':''}> 日本語訳を いつも 出す</label></details>
  </section>`);
  rainOn();setTimeout(()=>FX.thunderFar(),700);
  $('pnx').onclick=()=>{SFX.back();hush();H.home()};
  $('pnStart').onclick=()=>{SFX.step();begin()};
  const r=$('pnRes');if(r)r.onclick=()=>{SFX.step();resume()};
  $('pnja').onchange=e=>{PD.ja=e.target.checked?1:0;save()}}
function begin(){PD.plays++;PD.sv=null;save();S=newState();frame();go(PS.start)}
function resume(){if(!PD.sv)return begin();S=JSON.parse(JSON.stringify(PD.sv));S.shown=[];S.pts=0;frame();go('hub')}
function open(){if(!PD.met){PD.met=1;save()}title()}

/* ================================================================ Mina */
Object.assign(MINA_LINES,{
 pn_first:[['think','ねえ、 浜辺の 左の 岬に 小さな 家が あるの、 知ってる？ 夜に なると 窓が 光るんだ。 ちょっと あやしい…'],['wow','岬の 上の 古い ペンション、 気に なってたんだ。 タップしてみて。 英語の ミステリーが まってるかも']],
 pn_title:[['think','嵐の 夜の ペンションで 事件が 起きるんだって。 英語で 聞きこみして、 犯人を 見つけてね'],['smile','英語の メモや 札を 読むと てがかりが 手に 入るよ。 まちがえても だいじょうぶ、 ヒントが 出るから']],
 pn_titleResume:[['smile','聞きこみの とちゅう だったね。 🔍の てがかりを 見なおしてから 行こう'],['think','てがかりが 3つ そろったら、 みんなを あつめて 犯人を 当てよう']],
 pn_titleAgain:[['happy','エンドは {n}/{tot} 見つけたね。 ちがう 答えを えらぶと、 ちがう 結末に なるよ'],['think','まだ 見ていない エンドが あるよ。 だれを 犯人に するかで かわるんだ']],
 pn_endTrue:[['wow','名探偵！ 英語の メモを ちゃんと 読めたから、 うそを 見やぶれたんだね'],['proud','「belong to」「turn off」「Where do you keep 〜?」… 事件を とく 英語、 ばっちりだったね']],
 pn_endGhost:[['wow','ホワイトレディ… ほんとうに いたのかな。 「The sea always brings lost things home.」 すてきな ことばだね'],['love','いちばん 深い エンドまで 行けたね！ 屋根裏の 絵の 英語、 よく 読めました']],
 pn_endCat:[['happy','スモーク、 大かつやく！ でも 証拠が 3つ そろうと、 ちがう エンドに なるよ'],['think','ねこに 助けられたね。 クレインさんの うそを 3つ 見つけたら、 もっと かっこいい 結末に なるかも']],
 pn_endHint:[['think','屋根裏の 絵って、 見に 行った？ レオに ホワイトレディの ことを もっと きいてみて'],['smile','このお話、 まだ ひみつの エンドが あるみたい。 レオの 話に ヒントが あるよ']],
 pn_endEscape:[['think','にげられちゃった… 「Anyone could do that」って 言われない、 クレインさん だけの 証拠が いるんだ'],['smile','カギ・足あと・スイッチは だれでも できる。 クレインさん だけに つながる てがかりを さがそう']],
 pn_endFun:[['happy','あはは、 みんな びっくりしてたね。 へんな 答えでも 話が すすむのが ノベルの たのしい ところ'],['think','エンド「{t}」！ こんどは 聞きこみで 見つけた てがかりを よく 見てみよう']],
 pn_endEarly:[['happy','エンド「{t}」！ 事件の 前に おわっちゃったね。 もう一度 行って みよう'],['smile','こわい 夜でも、 英語で 話しかけたら 何か わかるよ。 もう一回 やってみて']],
 x_pnNone:[['think','浜辺の 左の 岬、 夜に 小さな 窓が 光ってるの 見た？ あやしい ペンションなんだって'],['wow','岬の ペンションで、 英語の ミステリーが できるんだって。 タップしてみて']],
 x_pnResume:[['think','ペンションの 事件、 まだ とけてないよね。 てがかりは {n}こ。 つづきを しよう'],['smile','星の真珠の ゆくえ、 気に なる… 聞きこみの つづきから できるよ']],
 x_pnEnds:[['happy','ペンションの エンド、 {n}/{tot} 見つけたね。 ちがう 人を 犯人に すると…？'],['think','ペンションの お話、 えらぶ 答えで 結末が かわるよ。 いま {n}/{tot}']],
});
const goInn=()=>['🌩️ ペンションへ',open];
if(window.MINA_SENSE&&MINA_SENSE._rules)MINA_SENSE._rules.push(
 ['x_pnNone',3,()=>!PD.met?{}:null,goInn],
 ['x_pnResume',3,()=>PD.sv&&!ENDS.some(e=>PD.end[e]&&ND[e].end.good)?{n:PD.sv.clues.length}:null,()=>['🔍 つづきへ',()=>{title()}]],
 ['x_pnEnds',1,()=>endsN()&&endsN()<ENDS.length?{n:endsN(),tot:ENDS.length}:null,goInn]);
/* the first time: Mina points at the inn once (after the shop has been shown) */
setTimeout(function first(){if(PD.met||PD.told)return;const m=window.MINA,z=window.ZAKKA&&ZAKKA.rec();
  if(!m||!m.canAnnounce||!m.canAnnounce()||(z&&!z.met&&!z.told))return setTimeout(first,30000);
  PD.told=1;save();const [ex,tx]=mline('pn_first');m.say('m',ex,tx,9000,null,['🌩️ のぞいてみる',open])},150000);

window.PENSION={open,title,rec:()=>PD,story:PS,endsN,_inn:inn,_go:id=>{if(!S){S=newState();frame()}go(id)},_state:()=>S};
})();
