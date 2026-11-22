/* ⛏️ 単語の 鉱山（11/22 作りなおし 第4弾: ローグライク）。 入口は game/mine.js の MINE.open（道具の 記録も mine.js）
   - 1つの 階 = ことば 5つ × 2問（形は ランダム: 和訳・英語で・聞きとり・つづり・🔤ならべかえ）。 5つ 答えると 階段で 1階 下へ → 🏕️ 休憩所
   - 持っていない ことばも 出る（たくさん 練習する 場所）。 答えた ことばは 原石には ならない（進むために 答えるだけ）
   - ことばの レベル: 地下1〜100階 小学生（中学 1わり）／101〜200階 中学と 高校／201階〜 高校と ハイレベル
   - まちがえると ❤が へる（深いほど 少し 多く）。 ❤0で たおれて 浜辺で 見つかる → その回に 拾った 物の 半分を なくす
   - ローグライク: 階ごとに 分かれ道（明るい道・暗い道・水の道・トロッコ・光る 穴・かぎの 扉）。 ことば 1つごとに できごと
     （宝石・宝箱・🪨原石＝まだ ない カード・🎁宝カード（どの 階でも）・ここだけの アイテム・さけられない わな・しかけ・運だめし・行商人）
   - 🎒 アイテムは いつでも つかえる（問題の とちゅうでも）。 ここだけの アイテム 10種（DG_ITEMS）と 雑貨屋の 道具・食べ物
   - 100階・200階…に 着くと 「区切り」が ひらく。 次から コインを はらって そこから はじめられる
   記録: C.rec().dg = {best, ck:{100:1}, runs, falls, it:{id:n}} */
(()=>{
const {S:ST,sfx:SFX}=BEACH;
const H=HE,esc=H.esc,$=id=>document.getElementById(id);
const C=CG,pickL=a=>a[Math.random()*a.length|0];
const sf=k=>{try{SFX[k]&&SFX[k]()}catch(e){}};
const ML=(k,v)=>{try{return MINA.line(k,v||{})}catch(e){return ['smile','']}};
const DG=()=>{const r=C.rec();if(!r.dg||typeof r.dg!=='object')r.dg={best:0,ck:{},runs:0,falls:0,it:{}};r.dg.ck=r.dg.ck||{};r.dg.it=r.dg.it||{};return r.dg};
const save=()=>C.save();
const HPMAX=80;
/* 11/22: 下の 階へ 進むだけで ❤が へる（深いほど 多い）。 休憩所の たき火は 少しだけ */
const stepCost=f=>Math.min(14,5+Math.floor(f/15));
const hp=()=>{try{return FOOD.hp()}catch(e){return D?D.hp0:HPMAX}};
const setHp=n=>{try{FOOD.setHp(n)}catch(e){if(D)D.hp0=n}};
const word=I=>String(I.en).split(',')[0].trim();
const ckCost=f=>f*3+(f>=300?f*2:0);   // 100階 300コイン・200階 600・300階 1500…

/* ================================================================ ここだけの アイテム */
const DG_ITEMS={
 compass:{ico:'🧭',n:'まよけの コンパス',s:'つぎの わなを 1回 よける（さけられない わなは むり）'},
 clover:{ico:'🍀',n:'四つ葉の 化石',s:'この 階の 宝が 2ばい'},
 crystal:{ico:'💠',n:'いやしの 結晶',s:'❤を ぜんぶ 回復'},
 candle:{ico:'🕯️',n:'青い ろうそく',s:'つぎの 分かれ道の 中身が 見える'},
 feather:{ico:'🪶',n:'金の 羽',s:'つぎの 3回 まちがえても ❤が へらない'},
 okey:{ico:'🗝️',n:'さびた かぎ',s:'かぎの 扉・宝箱が あけられる'},
 ladder:{ico:'🪜',n:'なわばしご',s:'いまの 階を とばして 下の 階へ（その 階の 宝は なし）'},
 firefly:{ico:'🫙',n:'ほたるの びん',s:'いまの 問題の こたえが 光る（1回）'},
 potion:{ico:'🧪',n:'元気の くすり',s:'❤ +40'},
 charm:{ico:'🧿',n:'しあわせの お守り',s:'この 階の できごとが いい ほうに かたよる'}};
const itN=id=>DG().it[id]||0;
/* 11/22: 拾った アイテムは 絵文字だけで なく タップで 名前と はたらきが わかる チップに */
const itChips=o=>Object.keys(o).filter(k=>o[k]>0&&DG_ITEMS[k]).map(k=>`<button class="dgchip" data-iti="${k}">${DG_ITEMS[k].ico}<b>${DG_ITEMS[k].n}</b>${o[k]>1?`×${o[k]}`:''}</button>`).join('');
const bindChips=()=>H.panel.querySelectorAll('[data-iti]').forEach(b=>b.onclick=e=>{e.stopPropagation();const t=DG_ITEMS[b.dataset.iti];sf('pop');H.toast(`${t.ico} <b>${esc(t.n)}</b><small>${esc(t.s)}<br>🎒 アイテムから いつでも つかえる</small>`,4200)});
const itAdd=(id,n=1)=>{DG().it[id]=itN(id)+n;save()};
const itTake=id=>{if(!itN(id))return false;DG().it[id]--;if(DG().it[id]<=0)delete DG().it[id];save();return true};

/* ================================================================ 分かれ道 */
const PATHS=[
 {k:'bright',ico:'💡',n:'明るい 道',s:'あんぜん。 宝は 少なめ',ev:.5,trap:.08,tr:.8},
 {k:'dark',ico:'🌑',n:'暗い 道',s:'わなが 多い。 宝も 多い',ev:.8,trap:.3,tr:1.6},
 {k:'water',ico:'💧',n:'水の 道',s:'いずみと 宝石が 多い',ev:.65,trap:.12,tr:1,spring:1},
 {k:'rail',ico:'🛤️',n:'古い 線路',s:'トロッコで 何階も 下りられる かも…',ev:.6,trap:.2,tr:1,rail:1},
 {k:'glow',ico:'✨',n:'光る 穴',s:'原石が とても 見つかりやすい',ev:.7,trap:.18,tr:1,ore:1},
 {k:'door',ico:'🚪',n:'かぎの 扉',s:'かぎが いる。 中は 宝の へや',ev:.9,trap:.05,tr:2.2,key:1}];
const pathOf=k=>PATHS.find(p=>p.k===k)||PATHS[0];

/* ================================================================ ことばの えらび方 */
const LVS=['es','jh','hs','adv'];
function lvAt(f){const r=Math.random();if(f<=100)return r<.9?'es':'jh';if(f<=200)return r<.5?'jh':'hs';if(f<=300)return r<.6?'hs':'adv';return r<.3?'hs':'adv'}
function words5(f){const out=[],hs=new Set();for(let t=0;t<80&&out.length<5;t++){const lv=lvAt(f),c=pickL(C.W.filter(x=>x.lv===lv));if(!c||hs.has(c.h)||!c.ja)continue;hs.add(c.h);out.push(c.id)}return out}
/* 原石に なる まだ ない ことば（その 深さの レベル） */
function oreWord(f){const lv=lvAt(f);let pool=C.W.filter(c=>c.lv===lv&&(!window.ORE||(!ORE.recd(c.id)&&!ORE.has(c.id)&&ORE.okWord(c)))&&!D.got.ore.includes(c.id));if(!pool.length)pool=C.W.filter(c=>window.ORE&&!ORE.recd(c.id)&&!ORE.has(c.id)&&ORE.okWord(c));return pool.length?pickL(pool).id:null}

/* ================================================================ 入口 */
let D=null;
function open(){const G=DG(),h=hp();
  const [ex,tx]=ML(G.runs?pickL(['dg_open','dg_open2']):'dg_new',{f:G.best});
  const cks=Object.keys(G.ck).map(Number).sort((a,b)=>a-b);
  H.show('cg',`<section class="pnl cgp shp dgp">
    <div class="qtop"><button class="x" id="dgx" aria-label="もどる">←</button><b>⛏️ 単語の 鉱山</b><span class="qn">${G.best?`最高 地下${G.best}階`:''}</span></div>
    <div class="kmina"><span class="lface">${MINA.face('m',ex)}</span><p>${tx}</p></div>
    ${window.FOOD?FOOD.mineBox():''}
    <button id="dggo" class="mngo" ${h>0?'':'disabled'}><span class="mngoi">⛏️</span><span class="mngot2">地下1階から</span><small>❤${h}</small></button>
    ${cks.map(f=>`<button class="dgck sub" data-ck="${f}" ${h>0?'':'disabled'}>🪜 地下${f}階から <b>🪙${ckCost(f)}</b></button>`).join('')}
    ${bagLine()}
    <details class="shmore"><summary>鉱山の しくみ</summary><ol class="mncs">
      <li>ことば 5つに 2問ずつ 答えると、 1階 下へ。 階段を おりるたびに ❤が へる（深いほど 多い）</li>
      <li>休憩所は 毎回 ちがう（たき火・地底の泉・モグラの行商人・古いほこら・ふしぎな井戸・ミオの無線基地）。 3つの うち 1つだけ えらべる。 たき火では まちがえた ことばが けむりに うかぶ</li>
      <li>まちがえると ❤が へる。 ❤0で たおれると、 その回に 拾った 物の 半分を なくす（帰れば ぜんぶ もちかえれる）</li>
      <li>階ごとに 分かれ道。 ことば 1つごとに 宝・🪨原石・わな・しかけ…（さけられない わなも ある）</li>
      <li>🎒 アイテムは いつでも つかえる。 ここだけの アイテムも たくさん</li>
      <li>地下1〜100階は 小学生（中学 少し）・101〜200階は 中学と 高校・その下は 高校と ハイレベル。 100階ごとに 区切りが ひらく</li></ol></details>
  </section>`);
  $('dgx').onclick=()=>{sf('back');SHOP.open()};
  if(window.FOOD)FOOD.mineBind(open);
  $('dggo').onclick=()=>{if(hp()<1)return;sf('open');start(1)};
  H.panel.querySelectorAll('[data-ck]').forEach(b=>b.onclick=()=>{const f=+b.dataset.ck,p=ckCost(f);if(hp()<1)return;if(ST.coins<p){sf('wrong');H.toast('🪙 コインが たりないよ');return}ST.coins-=p;H.head();sf('buy');start(f)})}
const bagLine=()=>{const L=Object.keys(DG_ITEMS).filter(itN);return L.length?`<p class="mntl">🎒 ${L.map(id=>`${DG_ITEMS[id].ico}<b>×${itN(id)}</b>`).join(' ')} <small>ここだけの アイテム</small></p>`:''};

function start(f){try{SHOP.leave()}catch(e){}const G=DG();G.runs++;save();
  D={floor:f,from:f,path:null,ws:[],wi:0,qi:0,last:'',got:{coins:0,gems:{},ore:[],cards:[],it:{}},b:{guard:0,luck:0,feather:0,see:0,charm:0,mag:0},q:0,ok:0,miss:0,missed:[],events:[],alive:true};
  try{RECENT.add('mine0',{})}catch(e){}
  branch()}

/* ================================================================ 分かれ道 */
function branch(){if(!D)return;const n=Math.random()<.35?3:2;let L=[...PATHS].filter(p=>p.k!=='door'||Math.random()<.35);L=L.sort(()=>Math.random()-.5).slice(0,n);
  const see=D.b.see>0;if(see)D.b.see--;
  H.show('cg',`<section class="pnl cgp shp dgp" data-stay>${hdr()}
    <p class="dgq">${pickL(['分かれ道だ。 どっちへ 行く？','道が わかれている…','どの 道に しよう？'])}</p>
    <div class="dgpaths">${L.map(p=>`<button data-p="${p.k}" class="dgpath ${p.k}"><span>${p.ico}</span><b>${p.n}</b><small>${see?esc(p.s):Math.random()<.5?esc(p.s):'？？？'}</small>${p.key&&!hasKey()?'<em>🔒 かぎが いる</em>':''}</button>`).join('')}</div>
    ${toolsRow()}</section>`);
  bindTop();
  H.panel.querySelectorAll('[data-p]').forEach(b=>b.onclick=()=>{const p=pathOf(b.dataset.p);if(p.key&&!useKey()){sf('wrong');H.toast('🔒 かぎが かかっている<small>🗝️ かぎが あれば あけられる</small>');return}sf('step');D.path=p.k;floor()})}
const hasKey=()=>itN('okey')>0||(window.MINE&&MINE.toolN('key')>0);
const useKey=()=>itTake('okey')||(window.MINE&&MINE.takeTool('key'));

/* ================================================================ 1つの 階 */
function floor(){D.ws=words5(D.floor);D.wi=0;D.qi=0;D.done=[];ask()}
function hdr(){const p=D.path?pathOf(D.path):null,h=hp();return `<div class="qtop dgtop"><button class="sub dgbag" id="dgbag" aria-label="アイテム">🎒</button><b>⛏️ 地下${D.floor}階 ${p?p.ico:''}</b><span class="qn dghp ${h<=15?'low':''}">❤${h}</span></div>
  <div class="dglane">${[0,1,2,3,4].map(i=>`<i class="${i<D.wi?'ok':i===D.wi&&D.ws.length?'now':''}"></i>`).join('')}<span>${D.got.coins?`🪙${D.got.coins}`:''} ${D.got.ore.length?`🪨${D.got.ore.length}`:''} ${D.got.cards.length?`🎁${D.got.cards.length}`:''}</span></div>`}
const toolsRow=()=>`<div class="row dgfoot"><button class="sub" id="dghome">🏠 帰る</button></div>`;
function bindTop(){const b=$('dgbag');if(b)b.onclick=()=>{sf('open');bag()};const hb=$('dghome');if(hb)hb.onclick=()=>{sf('step');finish('home')}}
const TYPES=['mean','rev','listen','spell','arr','arr'];
function ask(){if(!D)return;const id=D.ws[D.wi],I=C.info(id);if(!I)return nextWord();
  let t;for(let k=0;k<6;k++){t=pickL(TYPES);if(t!==D.last)break}
  if(t==='listen'&&!ST.sound)t='mean';if(t==='spell'&&!/^[a-z]{3,}$/.test(I.h))t='rev';if(t==='arr'&&!(window.ORE&&ORE.okWord(I)))t='mean';D.last=t;
  H.show('cg',`<section class="pnl cgp shp dgp" data-stay>${hdr()}<div class="dgscene ${D.path||''}"><span class="dgme">⛏️</span><span class="dgrock">🪨</span><span class="dgn">${D.qi?'2問目':'1問目'}</span></div><div id="dgq" class="dgqbox"></div>${toolsRow()}</section>`);
  bindTop();const box=$('dgq');D.qbox=box;
  if(t==='arr')return ORE.arrangeQ(I,box,Math.random()<.5?'arr2':'arr',ok=>answered(id,ok));
  const q=C.quiz(id,{type:t});C.ask(box,q,r=>answered(id,r.ok&&!r.hint),{tag:'⛏️'})}
function answered(id,ok){if(!D)return;D.q++;try{C.record(id,ok)}catch(e){}
  const sc=document.querySelector('.dgscene');
  if(ok){D.ok++;if(sc){sc.classList.remove('hit');void sc.offsetWidth;sc.classList.add('hit')}sf('knock')}
  else{D.miss++;if(!D.missed.includes(id))D.missed.push(id);if(D.b.feather>0){D.b.feather--;flyTxt('🪶 金の 羽で セーフ！')}else{const dmg=6+Math.floor(D.floor/40);hurt(dmg,'まちがえて')}}
  if(!D||D.fallen)return;
  setTimeout(()=>{if(!D)return;D.qi++;if(D.qi<2)return ask();D.qi=0;D.wi++;encounter(()=>{if(!D)return;D.wi>=5?stairs():ask()})},ok?500:900)}
function hurt(n,why){const h=Math.max(0,hp()-n);setHp(h);sf('wrong');flyTxt(`❤ -${n}`,'bad');const e=document.querySelector('.dghp');if(e){e.textContent='❤'+h;e.classList.toggle('low',h<=15)}
  const p=H.panel.querySelector('section');if(p){p.classList.remove('mnshake');void p.offsetWidth;p.classList.add('mnshake')}
  if(h<=0){D.fallen=1;setTimeout(collapse,900)}}
function flyTxt(t,cls=''){const st=document.querySelector('.dgscene')||H.panel;if(!st)return;const e=document.createElement('b');e.className='dgfly '+cls;e.textContent=t;st.appendChild(e);setTimeout(()=>e.remove(),1400)}
function nextWord(){D.wi++;D.wi>=5?stairs():ask()}

/* ================================================================ できごと（ことば 1つ ごと） */
function encounter(go){const p=pathOf(D.path),r=Math.random();if(r>p.ev+(D.b.charm?.1:0))return go();
  const W=[['gem',30],['chest',10*p.tr],['ore',(p.ore?30:12)],['tcard',3*p.tr],['item',5*p.tr],['trap',p.trap*100*(D.b.charm?.5:1)],['spring',p.spring?14:4],['gamble',5],['merchant',3],['echo',8],...(p.rail?[['rail',12]]:[]),...(nightDeep()?[['ghost',4]]:[])];
  const tot=W.reduce((a,w)=>a+w[1],0);let x=Math.random()*tot,k='echo';for(const [n,w] of W){if(x<w){k=n;break}x-=w}
  EV[k](go)}
const nightDeep=()=>{try{const h=GH();return h<4}catch(e){return false}};
const luck=()=>(D.b.luck?2:1);
function card(ico,title,body,btns,cls=''){const o=C.ov(`<div class="dgev ${cls}"><div class="dgei">${ico}</div><b>${title}</b><div class="dgeb">${body}</div><div class="row dgeb2">${btns.map((b,i)=>`<button data-b="${i}" class="${b[2]||''}">${b[0]}</button>`).join('')}</div></div>`,'dgov');o.dataset.stay=1;
  o.querySelectorAll('[data-b]').forEach(e=>e.onclick=()=>{sf('step');C.closeOv();btns[+e.dataset.b][1]()})}
const EV={
 gem:go=>{const fl=D.floor,gi=Math.min(MINE_GEM.length-1,Math.floor(Math.random()*(2+fl/30))),G=MINE_GEM[gi],v=Math.round((G[2]+fl*1.2)*luck()*(D.b.mag?1.5:1));
  D.got.coins+=v;D.got.gems[G[0]]=(D.got.gems[G[0]]||0)+1;sf('coin');card(G[0],`${G[1]}を 見つけた！`,`<p>🪙 ${v}コイン ぶん</p>`,[['つづける',go]])},
 chest:go=>{const key=hasKey();card('📦','宝箱だ！',`<p>${key?'🗝️ かぎで あければ 中身が ごうかに なる':'そのまま あけてみよう'}</p>`,[...(key?[['🗝️ かぎで あける',()=>{useKey();chestOpen(2,go)},'']]:[]),['あける',()=>chestOpen(1,go),key?'sub':'']])},
 ore:go=>{const id=oreWord(D.floor);if(!id)return EV.gem(go);D.got.ore.push(id);sf('pickup');const I=C.info(id);
  card('🪨','原石を 見つけた！',`<p>まだ 持っていない ことばが ねむっている 原石。 帰ったら お店の 作業台で みがこう</p><p class="dghint">ヒント: ${esc(String(I.ja).split(/[、,]/)[0])}</p>`,[['つづける',go]],'ore')},
 tcard:go=>{if(!window.CARDS||!CARDS.find1)return EV.gem(go);const g=CARDS.find1(D.floor/3+5);const id='t:'+g.c.e;D.got.cards.push(id);try{SFX.fanfare(1)}catch(e){}
  card('🎁','宝カードを 見つけた！',`<div class="dgcard">${C.face(id,{mini:1,ja:1,marks:false})}</div>${g.isNew?'<p class="mnnew">NEW!</p>':''}`,[['やった！',go]])},
 item:go=>{const id=pickL(Object.keys(DG_ITEMS));D.got.it[id]=(D.got.it[id]||0)+1;itAdd(id);sf('pickup');const t=DG_ITEMS[id];
  card(t.ico,`${t.n}を 見つけた！`,`<p>${esc(t.s)}</p><p class="note">鉱山でしか 手に 入らない アイテム。 🎒から いつでも つかえる</p>`,[['つづける',go]])},
 trap:go=>{const T=pickL(TRAPS);
  if(!T.must&&(D.b.guard>0||itN('compass')>0)){if(D.b.guard>0)D.b.guard--;else itTake('compass');sf('pickup');return card('🛡️',`${T.n}… でも よけた！`,`<p>${D.b.guard>=0?'まもりの 道具の おかげ':''}</p>`,[['ふう…',go]])}
  T.f(go)},
 spring:go=>{card('⛲','ふしぎな いずみ','<p>すきとおった 水が わいている。 のむ？</p>',[['のむ',()=>{if(Math.random()<.85){const a=hp();setHp(Math.min(HPMAX,a+20));sf('eat');card('💧','元気が 出た！',`<p>❤ ${a} → ${hp()}</p>`,[['つづける',go]])}else{hurt(5,'');if(!D.fallen)card('🤢','にがい！','<p>❤ -5 … ただの 鉱泉だった</p>',[['つづける',go]])}}],['のまない',go,'sub']])},
 gamble:go=>{card('🎩','もぐらの 手品師','<p>"Which cup?" 3つの カップの どれかに 金貨が 1まい。</p>',[0,1,2].map(i=>[['🥤','🥤','🥤'][i]+' '+(i+1),()=>{const win=Math.random()<.34*luck();if(win){const v=20+D.floor*2;D.got.coins+=v;sf('coinIn');card('🪙','あたり！',`<p>"Lucky you!" 🪙 +${v}</p>`,[['つづける',go]])}else{sf('pop');card('💨','はずれ…','<p>"Better luck next time!"（また こんど！）</p>',[['つづける',go]])}},'sub']))},
 merchant:go=>{const id=pickL(Object.keys(DG_ITEMS)),t=DG_ITEMS[id],p=30+Math.floor(D.floor/2);
  card('🐹','行商人の ハムさん',`<p>"Want to buy ${t.ico}? Only ${p} coins!"</p><p>${t.n}: ${esc(t.s)}</p><small>（もちあるいている コイン 🪙${ST.coins}）</small>`,[[`🪙${p}で 買う`,()=>{if(ST.coins<p){sf('wrong');H.toast('🪙 コインが たりないよ');return go()}ST.coins-=p;H.head();itAdd(id);sf('buy');go()}],['"No, thanks."',go,'sub']])},
 echo:go=>{const L=pickL(ECHO);card('🗣️','こだまが 聞こえる…',`<p class="en">"${esc(L[0])}"</p><p>${esc(L[1])}</p>`,[['つづける',go]]);try{H.say('es',L[0])}catch(e){}},
 rail:go=>{card('🛤️','古い トロッコ','<p>線路の 上に トロッコ。 のってみる？（どこまで 行くかは 運しだい）</p>',[['のる！',()=>{const n=1+Math.floor(Math.random()*3);if(Math.random()<.25){hurt(10,'');if(D.fallen)return;card('💥','脱線！',`<p>❤ -10 … でも ${n}階 下まで 来た</p>`,[['いたた…',()=>{D.floor+=n;go()}]])}else card('💨',`ビューン！ ${n}階 下へ`,'<p>あっというまに 下の 階へ。</p>',[['すごい！',()=>{D.floor+=n;go()}]])}],['のらない',go,'sub']])},
 ghost:go=>{card('👻','夜中の 坑道…','<p>"Is anybody there?"… 遠くで だれかの 声。 ランタンの 光が ふっと 消えた。</p><p>足もとに 古い 金貨が おちていた。</p>',[['ひろって いそぐ',()=>{D.got.coins+=40;go()}]])}};
function chestOpen(tier,go){const got=[];const v=Math.round((25+D.floor*2)*tier*luck());D.got.coins+=v;got.push(`🪙 ${v}`);
  if(Math.random()<(tier>1?.6:.25)){const id=pickL(Object.keys(DG_ITEMS));D.got.it[id]=(D.got.it[id]||0)+1;itAdd(id);got.push(`${DG_ITEMS[id].ico} ${DG_ITEMS[id].n}`)}
  if(window.FOOD&&typeof FOOD_SNACKS!=='undefined'&&Math.random()<.35){const ids=Object.keys(FOOD_SNACKS).filter(k=>FOOD_SNACKS[k].lv!=='hs');const f=pickL(ids);if(f){FOOD.add(f);got.push(`${FOOD_SNACKS[f].ico} ${FOOD_SNACKS[f].n}`)}}
  if(tier>1&&Math.random()<.3){const id=oreWord(D.floor);if(id){D.got.ore.push(id);got.push('🪨 原石')}}
  try{SFX.fanfare(tier)}catch(e){sf('coinIn')}card('🎉','宝箱の 中身',got.map(g=>`<p>${g}</p>`).join(''),[['やった！',go]])}
/* わな（must = さけられない） */
const TRAPS=[
 {n:'落石',f:go=>{hurt(8,'');if(!D.fallen)card('🪨','ゴゴゴ… 落石！','<p>"Watch out!" ❤ -8</p>',[['いたた…',go]])}},
 {n:'くずれる 床',must:1,f:go=>{hurt(12,'');if(!D.fallen)card('🕳️','床が くずれた！','<p>さけようが なかった… ❤ -12</p><p>でも 1階 下に 落ちた（ちょっと 得？）</p>',[['いたた…',()=>{D.floor++;go()}]])}},
 {n:'コウモリの むれ',f:go=>{const l=Math.floor(D.got.coins*.2);D.got.coins-=l;sf('pop');card('🦇','コウモリの むれ！',`<p>バサバサ！ 🪙${l} ぶん おとしちゃった</p>`,[['もう…',go]])}},
 {n:'ねむり ガス',must:1,f:go=>{hurt(5,'');if(!D.fallen)card('💤','あまい ガス…','<p>ふらふら… ❤ -5。 さけられない しかけだった</p>',[['しっかり！',go]])}},
 {n:'まよいの 道',must:1,f:go=>{card('🌀','道に まよった！','<p>同じ ところを ぐるぐる… この 階は ことばが 1つ ふえる</p>',[['がんばる',()=>{D.wi=Math.max(0,D.wi-1);D.ws[D.wi]=words5(D.floor)[0];go()}]])}},
 {n:'あなの わな',f:go=>{hurt(6,'');if(!D.fallen)card('⚠️','あなに 落ちた！','<p>"Ouch!" ❤ -6</p>',[['よいしょ',go]])}}];
const ECHO=[["Keep going!","がんばって！"],["You can do it!","きみなら できる！"],["Who's there?","だれか いるの？"],["Deeper, deeper…","もっと 深く…"],["Don't give up!","あきらめないで！"],["Hello… hello… hello…","ハロー… ハロー… ハロー…"],["The treasure is close.","宝は 近い。"]];

/* ================================================================ 🎒 アイテム（いつでも） */
function bag(){const own=Object.keys(DG_ITEMS).filter(itN),F=window.FOOD?FOOD.bagList():[],T=window.MINE?MINE.toolList().filter(t=>TL_S[t.id]):[];
  const o=C.ov(`<div class="dgbagov"><b>🎒 アイテム</b><p class="note">❤${hp()} / ${HPMAX}</p>
    ${own.length?`<p class="dglbl">⛏️ ここだけの アイテム</p>${own.map(id=>`<button class="dgit" data-it="${id}"><span>${DG_ITEMS[id].ico}</span><b>${DG_ITEMS[id].n} ×${itN(id)}</b><small>${esc(DG_ITEMS[id].s)}</small></button>`).join('')}`:''}
    ${T.length?`<p class="dglbl">🧰 道具</p>${T.map(t=>`<button class="dgit" data-tl="${t.id}"><span>${t.ico}</span><b>${t.n} ×${MINE.toolN(t.id)}</b><small>${TL_S[t.id]}</small></button>`).join('')}`:''}
    ${F.length?`<p class="dglbl">🥪 食べ物</p>${F.map(s=>`<button class="dgit" data-fd="${s.id}"><span>${s.ico}</span><b>${s.n} ×${FOOD.rec().bag[s.id]}</b><small>❤ +${s.hp||0}</small></button>`).join('')}`:''}
    ${!own.length&&!F.length&&!T.length?'<p>なにも ないよ。 鉱山で 見つけるか、 雑貨屋で 買おう</p>':''}
    <button id="dgbx" class="sub">とじる</button></div>`,'dgov');o.dataset.stay=1;
  o.querySelector('#dgbx').onclick=()=>{sf('back');C.closeOv()};
  o.querySelectorAll('[data-it]').forEach(b=>b.onclick=()=>useIt(b.dataset.it));
  o.querySelectorAll('[data-tl]').forEach(b=>b.onclick=()=>{const id=b.dataset.tl;if(!MINE.takeTool(id))return;C.closeOv();sf('pickup');
    if(id==='helmet')D.b.guard++;else if(id==='lamp'||id==='note')D.b.luck=1;else if(id==='mag')D.b.mag=1;else if(id==='wood')setHp(Math.min(HPMAX,hp()+15));else if(id==='batt')setHp(Math.min(HPMAX,hp()+10));else if(id==='map')D.b.see=1;else if(id==='key'){MINE.addTool('key');H.toast('🗝️ かぎは 扉や 宝箱で 自動で つかうよ');return}H.toast(`${MINE_TOOLS[id].ico} ${MINE_TOOLS[id].n}を つかった`);upd()});
  o.querySelectorAll('[data-fd]').forEach(b=>b.onclick=()=>{const id=b.dataset.fd;if(!FOOD.take(id))return;const s=FOOD_SNACKS[id];setHp(Math.min(HPMAX,hp()+(s.hp||0)));C.closeOv();sf('eat');H.toast(`${s.ico} ${s.n}を 食べた！ ❤${hp()}`);upd()})}
const TL_S={helmet:'つぎの わなを 1回 ふせぐ',lamp:'この 階の 宝 2ばい',mag:'この 階の 宝石 1.5ばい',wood:'たき火で ❤ +15',batt:'📡 ミオの 無線で 元気 ❤ +10',map:'つぎの 分かれ道の 中身が 見える',note:'この 階の 宝 2ばい',key:'かぎの 扉・宝箱を あける（自動）'};
function useIt(id){if(!D||!itN(id))return;
  if(id==='ladder'){if(!itTake(id))return;C.closeOv();sf('step');H.toast('🪜 なわばしごで 下へ！');D.floor++;return rest(true)}
  if(id==='firefly'){const box=D.qbox;const q=box&&box._q;if(!q||!box.isConnected){H.toast('🫙 問題の ときに つかおう');return}if(!itTake(id))return;C.closeOv();const bt=box.querySelectorAll('.cgqc button')[q.ans];if(bt)bt.classList.add('dgglow');sf('pickup');return}
  if(!itTake(id))return;C.closeOv();sf('pickup');
  ({compass:()=>{itAdd('compass');H.toast('🧭 コンパスは もっているだけで わなを 1回 よけるよ')},clover:()=>{D.b.luck=1},crystal:()=>setHp(HPMAX),candle:()=>{D.b.see=1},feather:()=>{D.b.feather+=3},okey:()=>{itAdd('okey');H.toast('🗝️ かぎは 扉や 宝箱で 自動で つかうよ')},potion:()=>setHp(Math.min(HPMAX,hp()+40)),charm:()=>{D.b.charm=1}}[id]||(()=>{}))();
  if(id!=='compass'&&id!=='okey')H.toast(`${DG_ITEMS[id].ico} ${DG_ITEMS[id].n}を つかった`);upd()}
function upd(){const e=document.querySelector('.dghp');if(e){const h=hp();e.textContent='❤'+h;e.classList.toggle('low',h<=15)}}

/* ================================================================ 階段 → 休憩所 */
function stairs(){if(!D)return;D.floor++;rest()}
/* 11/22 ユーザー「全部 入れて」: 休憩所は 毎回 ちがう（たき火・地底の泉・モグラの行商人・古いほこら・ふしぎな井戸・ミオの無線基地）。
   どこでも 3つの うち 1つだけ えらべる（❤・アイテム・宝箱 など）。 たき火では その回 まちがえた ことばが けむりに うかぶ（ながめるだけ・タップで カード） */
const RESTS=[
 {k:'fire',ico:'🏕️',n:'たき火',s:'ぱちぱち… あたたかい',w:30},
 {k:'spring',ico:'⛲',n:'地底の 泉',s:'すきとおった 水が わいている',w:18},
 {k:'mole',ico:'🐹',n:'モグラの 行商人',s:'"Welcome! Buy or sell?"',w:18},
 {k:'shrine',ico:'⛩️',n:'古い ほこら',s:'運だめし。 いいことも 悪いことも…',w:16},
 {k:'radio',ico:'📡',n:'ミオの 無線基地',s:'ミオの 声が よく 聞こえる',w:18},
 {k:'well',ico:'🪣',n:'ふしぎな 井戸',s:'コインを 投げて 願いごと…',w:14}];
function pickRest(){const tot=RESTS.reduce((a,r)=>a+r.w,0);let x=Math.random()*tot;for(const r of RESTS){if(x<r.w)return r;x-=r.w}return RESTS[0]}
const heal=n=>{const a=hp();setHp(Math.min(HPMAX,a+n));return `❤ ${a} → ${hp()}`};
const giveIt=id=>{id=id||pickL(Object.keys(DG_ITEMS).filter(k=>k!=='ladder'||Math.random()<.5));D.got.it[id]=(D.got.it[id]||0)+1;itAdd(id);return DG_ITEMS[id]};
/* その 休憩所の 3つの えらびかた: [ico, 名前, せつめい, する こと(done)] */
function restOpts(R,f){const cv=25+f*2;
  if(R.k==='fire')return [['❤','ゆっくり 休む','❤ +6',d=>{d(heal(6))}],['🎒','まわりを さがす','アイテムを 1つ',d=>{const t=giveIt();d(`${t.ico} ${t.n}を 見つけた！`)}],['📦','宝箱を あける','たき火の そばの 古い 箱',d=>chestOpen(1,()=>d(''))]];
  if(R.k==='spring')return [['💧','たっぷり のむ','❤ +15',d=>{d(heal(15))}],['🧪','びんに くむ','🧪 元気の くすりを 1つ',d=>{const t=giveIt('potion');d(`${t.ico} ${t.n}を 手に 入れた`)}],['💎','泉の 底を さがす','宝石が しずんでいる かも',d=>{const v=Math.round((20+f*2)*luck());D.got.coins+=v;sf('coin');d(`💎 🪙${v} ぶんの 宝石！`)}]];
  if(R.k==='mole'){const ks=Object.keys(DG_ITEMS).sort(()=>Math.random()-.5).slice(0,2),pr=k=>30+Math.floor(f/2)+(k==='crystal'||k==='ladder'?20:0);
    const own=Object.keys(DG_ITEMS).filter(itN),sell=own.length?pickL(own):null,sp=15+Math.floor(f/3);
    const buy=k=>[DG_ITEMS[k].ico,`${DG_ITEMS[k].n}を 買う`,`🪙${pr(k)} ・ ${DG_ITEMS[k].s}`,d=>{if(ST.coins<pr(k)){sf('wrong');H.toast('🪙 コインが たりないよ');return false}ST.coins-=pr(k);H.head();sf('buy');itAdd(k);d(`"Thank you!" ${DG_ITEMS[k].ico} ${DG_ITEMS[k].n}を 買った`)}];
    return [buy(ks[0]),buy(ks[1]),sell?['🪙',`${DG_ITEMS[sell].n}を 売る`,`🪙${sp} で 買いとり`,d=>{if(!itTake(sell))return false;D.got.coins+=sp;sf('coin');d(`"Nice!" 🪙${sp}で 売れた`)}]:['🍵','モグラの お茶','❤ +5（ただ）',d=>{d(heal(5))}]]}
  if(R.k==='shrine')return [['🙏','おまいりする','運だめし… いいことも 悪いことも',d=>{const r=Math.random()*luck();
      if(r<.35){hurt(8,'');if(D.fallen)return;d('💢 ばちが あたった！ ❤ -8')}else if(r<.55){const l=Math.floor(D.got.coins*.2);D.got.coins-=l;d(`💸 さいせんに とられた… 🪙-${l}`)}
      else if(r<.8){d('✨ '+heal(20))}else{const t=giveIt(pickL(['crystal','charm','clover','feather']));d(`🌟 ${t.ico} ${t.n}を さずかった！`)}}],
    ['🧿','おそなえを する','🪙20 → 🧿 しあわせの お守り',d=>{if(ST.coins<20){sf('wrong');H.toast('🪙 コインが たりないよ');return false}ST.coins-=20;H.head();const t=giveIt('charm');d(`${t.ico} ${t.n}を もらった`)}],
    ['❤','ほこらの かげで 休む','❤ +5（あんぜん）',d=>{d(heal(5))}]];
  if(R.k==='well'){const wish=(c,big)=>d=>{if(ST.coins<c){sf('wrong');H.toast('🪙 コインが たりないよ');return false}ST.coins-=c;H.head();sf('coin');const r=Math.random()*luck()+(big?.35:0);
      if(r<.3)return d('💧 ぽちゃん… なにも おきなかった');
      if(r<.6)return d('✨ '+heal(big?30:12));
      if(r<.85){const t=giveIt(big?pickL(['crystal','feather','clover','charm','ladder']):null);return d(`🌟 ${t.ico} ${t.n}が うかんできた！`)}
      const id=oreWord(f);if(id&&Math.random()<.5){D.got.ore.push(id);sf('pickup');return d('🪨 井戸の 底から 原石が！')}
      const v=c*(big?4:5);D.got.coins+=v;return d(`💰 金貨が あふれた！ 🪙${v}`)};
    return [['🪙','🪙10を 投げる','小さな 願いごと',wish(10)],['💰','🪙50を 投げる','大きな 願いごと（いいことが おきやすい）',wish(50,1)],
      ['👀','のぞきこむ','ただ。 なにか 見える かも',d=>{if(Math.random()<.35){const v=10+f;D.got.coins+=v;sf('coin');d(`🪙 ふちに 金貨が ひっかかっていた！ 🪙${v}`)}else{try{H.say('es','Hello… hello…')}catch(e){}d('🗣️ "Hello… hello…" こだまが かえってきた')}}]]}
  /* radio */
  return [['🗺️','つぎの 階の ヒント','分かれ道の 中身が 見える',d=>{D.b.see=1;d('📡 "The left path looks shiny!" つぎの 分かれ道が 見えるよ')}],['❤','ミオの 応援','❤ +8',d=>{sf('eat');d(heal(8))}],
    ['🥪','補給を たのむ','食べ物を 1つ',d=>{let got='';try{const ids=Object.keys(FOOD_SNACKS).filter(k=>FOOD_SNACKS[k].lv!=='hs');const k=pickL(ids);FOOD.add(k);got=`${FOOD_SNACKS[k].ico} ${FOOD_SNACKS[k].n}`}catch(e){}if(!got)return d(heal(8));d(`📦 ${got}が とどいた！`)}]]}
function rest(skip){if(!D)return;const G=DG(),f=D.floor;D.b.luck=0;D.b.mag=0;D.b.charm=0;
  let ck='';if(f%100===0&&!G.ck[f]){G.ck[f]=1;ck=`<p class="dgckn">🪜 地下${f}階の 区切りが ひらいた！ 次からは コインで ここから はじめられる</p>`;try{SFX.fanfare(3)}catch(e){}}
  if(f>G.best)G.best=f;save();
  const R=pickRest(),opts=restOpts(R,f),g=D.got;let picked='';
  /* 階段の わきの 原石（2わり） */
  let ore1=false;if(!skip&&Math.random()<.2){const id=oreWord(f);if(id){g.ore.push(id);ore1=true}}
  const fresh=!G.restTold;if(fresh){G.restTold=1;save()}
  function draw(){const cost=stepCost(f),lowHp=hp()<=cost*2,L=R.k==='radio'?pickL(RADIO_MIO):pickL(lowHp?REST_MIO_LOW:REST_MIO);
    const smoke=R.k==='fire'&&D.missed.length?`<div class="dgsmoke"><small>💨 けむりに うかぶ きょう まちがえた ことば（タップで カード）</small>${D.missed.slice(-8).map((id,i)=>{const I=C.info(id);return I?`<button class="dgsw" data-sw="${esc(id)}" style="--d:${i*.6}s">${esc(I.h||I.en)}<small>${esc(String(I.ja).split(/[、,]/)[0])}</small></button>`:''}).join('')}</div>`:'';
    H.show('cg',`<section class="pnl cgp shp dgp" data-stay>${hdr()}
    <div class="dgrest ${R.k}"><span>${R.ico}</span><b>地下${f}階の 休憩所 ・ ${R.n}</b><small>${esc(R.s)}</small></div>${ck}${smoke}
    ${R.k==='mole'||R.k==='shrine'?'':`<div class="kmina mnmio"><span class="lface">${MIO.face('smile')}</span><p>📡 <b>${esc(L[0])}</b><br><small>${esc(L[1])}</small></p></div>`}
    ${picked?`<p class="dgpicked">${picked}</p>`:`<p class="dglbl">ひとつだけ えらべる</p><div class="dgopts">${opts.map((o,i)=>`<button class="dgopt" data-o="${i}"><span>${o[0]}</span><b>${esc(o[1])}</b><small>${esc(o[2])}</small></button>`).join('')}</div>`}
    <p class="dgsum">ここまで: 🪙${g.coins} ${g.ore.length?`・ 🪨原石 ${g.ore.length}`:''} ${g.cards.length?`・ 🎁宝カード ${g.cards.length}`:''} </p>${Object.keys(g.it).some(k=>g.it[k]>0)?`<div class="dgchips"><small>拾った アイテム（タップで せつめい）</small>${itChips(g.it)}</div>`:''}
    ${ore1?`<p class="dgore1">🪨 階段の わきで 原石を 見つけた！</p>`:''}
    <button id="dgdown" class="mngo"><span class="mngoi">⬇️</span><span class="mngot2">地下${f}階へ すすむ</span><small>❤ -${cost}</small></button>
    <div class="row dgfoot"><button class="sub" id="dgbag2">🎒 アイテム</button><button id="dgback" class="sub">🏠 帰る（ぜんぶ もちかえる）</button></div></section>`);
    bindTop();$('dgbag2').onclick=()=>{sf('open');bag()};$('dgback').onclick=()=>{sf('step');finish('home')};
    bindChips();
    H.panel.querySelectorAll('[data-sw]').forEach(b=>b.onclick=()=>{try{C.peek(b.dataset.sw,{from:'mine'})}catch(e){}});
    H.panel.querySelectorAll('[data-o]').forEach(b=>b.onclick=()=>{if(picked||!D)return;const o=opts[+b.dataset.o];sf('step');
      const r=o[3](msg=>{if(!D||D.fallen)return;picked=`${o[0]} ${esc(o[1])}${msg?` → ${msg}`:''}`;draw()});if(r===false)return});
    $('dgdown').onclick=()=>{if(hp()<=cost){sf('wrong');H.toast(`❤が たりないよ（すすむには ❤${cost+1}いじょう）<small>🎒の 食べ物で 回復するか、 🏠 帰ろう</small>`,4200);return}
      const h=hp()-cost;setHp(h);sf('step');H.toast(`⬇️ 階段を おりた ❤ -${cost}`,1600);
      if(!G.stepTold){G.stepTold=1;save();const [,tx]=ML('dg_step',{n:cost});if(tx)setTimeout(()=>H.toast(`${MICO()} <b>ミナ先生</b><small>${esc(tx)}</small>`,5200),900)}
      branch()}}
  draw();
  const mk=fresh?'dg_rest':R.k==='well'&&!G.wellTold?(G.wellTold=1,save(),'dg_well'):R.k==='fire'&&D.missed.length&&Math.random()<.5?'dg_smoke':null;
  if(mk)setTimeout(()=>{const [,tx]=ML(mk);if(tx&&D)H.toast(`${MICO()} <b>ミナ先生</b><small>${esc(tx)}</small>`,5200)},800);
  if(f===101||f===201)setTimeout(()=>{const [,tx]=ML(f===101?'dg_jh':'dg_hs');if(tx)H.toast(`${MICO()} <b>ミナ先生</b><small>${esc(tx)}</small>`,4800)},700)}
const RADIO_MIO=[["Mio's radio base, roger! I can hear you clearly!","こちら ミオの 無線基地、 りょうかい！ よく 聞こえるよ！"],["Choose one! I can send help or tell you the way.","1つ えらんで！ 助けを 送るか、 道を 教えるよ"],["The signal is strong here. What do you need?","ここは 電波が いいね。 なにが ほしい？"]];
const REST_MIO_LOW=[["Boss, your heart is low! Please come home.","店長、 ❤が 少ないよ！ もう 帰ってきて"],["Going down takes energy. Eat something, OK?","下りるだけでも つかれるよ。 何か 食べてね"],["I'm worried… The shop needs you!","しんぱいだよ… お店には 店長が ひつようなんだから！"]];
const REST_MIO=[["Boss, are you OK? Don't push too hard!","店長、 だいじょうぶ？ むりしないでね！"],["I can hear you on the radio! The shop is fine. Mio is on it!","無線、 聞こえてます！ お店は だいじょうぶ。 ミオに おまかせ！"],["Did you find any stones? Bring them home safe!","原石、 見つかった？ ぶじに もって帰ってきてね！"],["Eat something warm. Over and out!","あったかい もの 食べてね。 以上、 通信おわり！"],["How deep are you? Wow… Be careful!","いま 何階？ わあ… 気をつけて！"]];

/* ================================================================ たおれた → 浜辺で 見つかる（半分 なくす） */
function collapse(){if(!D)return;C.closeOv();const g=D.got,lost={coins:0,ore:[],cards:[],it:{}};
  lost.coins=Math.ceil(g.coins/2);g.coins-=lost.coins;
  const half=a=>{const b=[...a].sort(()=>Math.random()-.5),n=Math.ceil(b.length/2);return [b.slice(n),b.slice(0,n)]};
  [g.ore,lost.ore]=half(g.ore);[g.cards,lost.cards]=half(g.cards);
  lost.cards.forEach(id=>{try{CARDS.take(id.slice(2))}catch(e){}});
  Object.keys(g.it).forEach(k=>{const n=Math.ceil(g.it[k]/2);lost.it[k]=n;g.it[k]-=n;for(let i=0;i<n;i++)itTake(k)});
  const G=DG();G.falls=(G.falls||0)+1;save();setHp(10);sf('wrong');
  finish('fall',lost)}

/* ================================================================ 帰る（もちかえり） */
function finish(why,lost){if(!D)return;const d=D;D=null;C.closeOv();const g=d.got,G=DG();
  if(d.floor>G.best)G.best=d.floor;
  if(g.coins)H.addCoins(g.coins);
  let oreN=0;g.ore.forEach(id=>{try{if(window.ORE&&ORE.fromMine(id))oreN++}catch(e){}});
  g.cards.forEach(id=>{try{SHOP.bookRec()[id]=1}catch(e){}});save();
  try{const M=MINE.rec();M.dives=(M.dives||0)+1;if(d.floor>(M.bestF||0))M.bestF=d.floor;save()}catch(e){}
  try{RECENT.add('mine',{depth:d.floor,best:G.best,fl:d.floor,bestF:G.best,ok:d.ok,q:d.q,cards:g.cards.concat(g.ore),rare:g.cards.length>0,coins:g.coins,hp:why==='fall'?'hp':'',chest:0,bad:0,used:[],story:0})}catch(e){}
  const fall=why==='fall',it=Object.keys(g.it).filter(k=>g.it[k]>0);
  const [ex,tx]=ML(fall?'dg_fall':oreN?'dg_backOre':'dg_back',{f:d.floor,n:oreN});
  H.show('cg',`<section class="pnl cgp shp dgp">
    <div class="qtop"><span></span><b>${fall?'🏖️ 浜辺で 目が さめた…':'🎒 もちかえった'}</b><span class="qn">地下${d.floor}階まで</span></div>
    ${fall?`<p class="dgfall">たおれている ところを ミオに 見つけてもらった。 ❤10で 気が ついた</p>
      <div class="dglost"><b>なくした 物（半分）</b><p>${lost.coins?`🪙${lost.coins} `:''}${lost.ore.length?`🪨原石 ${lost.ore.length} `:''}${lost.cards.length?`🎁宝カード ${lost.cards.length} `:''}${Object.keys(lost.it).filter(k=>lost.it[k]).map(k=>DG_ITEMS[k].ico+'×'+lost.it[k]).join(' ')}${!lost.coins&&!lost.ore.length&&!lost.cards.length&&!Object.keys(lost.it).length?'なし':''}</p></div>`:''}
    <div class="mnres"><p>🪜 地下${d.from}階 → 地下${d.floor}階 ・ ${d.q}問中 <b>${d.ok}</b>問 正解</p>
      <p>${g.coins?`🪙 +${g.coins} `:''}${oreN?`🪨 原石 ${oreN}こ `:''}${g.cards.length?`🎁 宝カード ${g.cards.length}まい `:''}</p>${it.length?`<div class="dgchips">${itChips(g.it)}</div>`:''}</div>
    ${g.cards.length?`<div class="mnhand sm">${g.cards.map(id=>`<div class="mnt" data-id="${esc(id)}">${C.face(id,{mini:1,marks:false})}</div>`).join('')}</div>`:''}
    ${oreN?'<p class="note">🪨 原石は お店の 下の 作業台で みがくと カードに なるよ</p>':''}
    <div class="kmina"><span class="lface">${MINA.face('m',ex)}</span><p>${tx}</p></div>
    <button id="dgok" class="big">🃏 お店に もどる</button></section>`);
  C.peekIn(H.panel.querySelector('.mnhand'),{from:'mine'});bindChips();
  $('dgok').onclick=()=>{sf('step');SHOP.open()};
  sf(fall?'step':'done')}

/* ================================================================ ミナ先生 */
Object.assign(MINA_LINES,{
 dg_rest:[['point','休憩所は 毎回 ちがうよ。 たき火・泉・モグラの お店・ほこら・ふしぎな 井戸・ミオの 無線… 3つの うち 1つだけ えらべるから よく 考えてね'],['wow','休憩所が いろいろ あるんだって！ ❤を とるか、 アイテムを とるか… なやむね']],
 dg_well:[['smile','ふしぎな 井戸だね。 英語では wish（願う）。 "I wish…" は 「〜だったら いいのに」の 気もちだよ'],['think','井戸に コインを 投げて 願いごと… なにが おきるかは 運しだい！']],
 dg_smoke:[['smile','けむりに うかんでいるのは きょう まちがえた ことば。 答えなくて いいから、 ちょっと ながめてみて'],['think','まちがえた ことばは 見かえすだけでも 覚えやすく なるよ。 タップで カードが 見られるよ']],
 dg_step:[['point','階段を おりると ❤が {n} へるよ。 深く なるほど たくさん へるから、 ❤が 少なく なったら 休憩所で 「帰る」 を えらぼう'],['think','下へ 行くだけでも ❤を つかうの。 食べ物を もっていくと 深くまで 行けるよ']],
 dg_new:[['wow','鉱山が 新しく なったよ！ ことば 5つに 2問ずつ 答えて どんどん 下へ。 分かれ道・宝・わな… なにが あるかは 運しだい！'],['point','まちがえると ❤が へるよ。 ❤0で たおれると 拾った 物の 半分を なくすから、 あぶなく なったら 帰ろうね']],
 dg_open:[['smile','さあ、 きょうは 何階まで 行けるかな？ 最高は 地下{f}階'],['think','あぶないと 思ったら 休憩所で 「帰る」。 帰れば ぜんぶ もちかえれるよ']],
 dg_open2:[['happy','鉱山は 答えれば 答えるほど 深く 行ける。 たくさん 練習しよう！'],['point','🎒 アイテムは 問題の とちゅうでも つかえるよ。 🫙 ほたるの びんは こたえが 光るの']],
 dg_back:[['happy','おかえり！ 地下{f}階まで 行ったんだね'],['proud','たくさん 答えたね。 鉱山の 問題は そのまま 単語の 練習だよ']],
 dg_backOre:[['wow','原石を {n}こ もちかえったね！ お店の 作業台で みがいて カードに しよう'],['happy','地下{f}階から 原石 {n}こ！ どんな ことばが ねむってるかな']],
 dg_fall:[['think','たおれちゃったね… でも ミオちゃんが 見つけてくれて よかった。 つぎは 休憩所で 早めに 帰ろう'],['smile','半分は なくしちゃったけど、 答えた ことばは ちゃんと 頭に のこってるよ']],
 dg_jh:[['point','地下101階から 下は 中学と 高校の ことば。 ここからが 本番だよ'],['wow','100階を こえたね！ ここからは 中学・高校の ことばが 出るよ']],
 dg_hs:[['wow','地下200階の 下！ 高校と ハイレベルの ことばの 世界。 すごいところまで 来たね'],['proud','200階 とっぱ！ ここまで 来られる 人は なかなか いないよ']]});

window.DUNGEON={open,items:DG_ITEMS,rec:DG,itN};
})();
