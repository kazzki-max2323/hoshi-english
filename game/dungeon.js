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
 compass:{ico:'🧭',n:'まよけの コンパス',s:'つぎの わなを 1回 よける（さけられない わなは むり）',r:1},
 clover:{ico:'🍀',n:'四つ葉の 化石',s:'つぎの できごと 3回が かならず いいこと（宝石・宝箱・原石…）',r:2},
 crystal:{ico:'💠',n:'いやしの 結晶',s:'❤を ぜんぶ 回復',r:3},
 candle:{ico:'🕯️',n:'青い ろうそく',s:'つぎの 分かれ道の 中身が ぜんぶ 見える',r:1},
 feather:{ico:'🪶',n:'金の 羽',s:'つぎの 3回 まちがえても ❤が へらない・🔥れんさも 切れない',r:2},
 okey:{ico:'🗝️',n:'さびた かぎ',s:'かぎの 扉・宝箱が あけられる（かぎで あけた 宝箱は ミミックに ならない）',r:1},
 ladder:{ico:'🪜',n:'なわばしご',s:'いまの 階を とばして 下の 階へ（その 階の 宝は なし）',r:3},
 firefly:{ico:'🫙',n:'ほたるの びん',s:'いまの 問題の まちがいを 2つ 消す（えらぶ 問題で）',r:1},
 potion:{ico:'🧪',n:'元気の くすり',s:'❤ +40',r:1},
 charm:{ico:'🧿',n:'しあわせの お守り',s:'この 階は できごとが 多く、 わなが 半分に',r:2},
 /* 11/23 ユーザー「鉱山の アイテムが いまいち」: 使いどころを 考える アイテムを 追加 */
 bomb:{ico:'💣',n:'ばくだん',s:'分かれ道で つかう。 かべを ふきとばして わなの ない 「かくし部屋」へ',r:2},
 orb:{ico:'🔮',n:'みらいの 水晶',s:'この 階で なにが おきるか 先に 見える（ことばの 列に 絵が 出る）',r:2},
 mirror:{ico:'🪞',n:'ふたごの かがみ',s:'つぎの できごとが 2回 おきる。 いいことも 悪いことも…！',r:2},
 dice:{ico:'🎲',n:'やりなおしの サイコロ',s:'もっているだけで OK。 わなが 出たら 1回 ふりなおせる',r:2},
 beads:{ico:'📿',n:'ことだまの じゅず',s:'この 階は 正解するたびに ❤ +3',r:1},
 gpick:{ico:'⛏️',n:'金の つるはし',s:'この 階は 🔥れんさの ごほうびが 2ばい',r:2},
 /* 11/23 ユーザー「たまに レアアイテムが 出てほしい。 特別な ものとか」: ✨とくべつな 品（r:4）。 めったに 出ない・とても 強い・雑貨店で 高く 売れる */
 crown:{ico:'👑',n:'ドワーフの 王冠',s:'この 回は 帰るまで 宝石が ぜんぶ 2ばい',r:4,v:2400},
 dscale:{ico:'🐉',n:'竜の うろこ',s:'もっているだけで OK。 ❤0で たおれても 1回だけ ❤40で 立ちあがる',r:4,v:2000},
 hglass:{ico:'⏳',n:'時の 砂時計',s:'つぎの 5回 まちがえても ❤が へらない・🔥れんさも 切れない',r:4,v:1800},
 star:{ico:'🌟',n:'星の かけら',s:'つぎの できごとで かならず 🎁宝カードが 見つかる',r:4,v:3000},
 tear:{ico:'🧜',n:'人魚の なみだ',s:'❤ ぜんぶ 回復 ＋ この 階は 正解ごとに ❤ +3',r:4,v:1600},
 tome:{ico:'📕',n:'ことばの 古文書',s:'ひらくと 🪨原石が 3つ 出てくる',r:4,v:2200}};
const RW={1:10,2:5,3:2,4:0};
/* ✨ とくべつな 品を 見つけた */
function special(go,why){const id=pickL(SPECIAL),t=DG_ITEMS[id];D.got.it[id]=(D.got.it[id]||0)+1;itAdd(id);try{SFX.fanfare(3)}catch(e){sf('pickup')}
  const G=DG();G.sp=(G.sp||0)+1;save();tell('special');
  const L=pickL(MIO_SP);try{MIO.say(L[0])}catch(e){}
  card(t.ico,`✨ とくべつな 品！ ${t.n}`,`${why?`<p>${why}</p>`:''}<p>${esc(t.s)}</p><p class="dghint">めったに 見つからない 品。 雑貨店で 売ると 🪙${sellP(id).toLocaleString()}</p><p class="dgmio">📡 ミオ「<b>${esc(L[0])}</b>」<br><small>${esc(L[1])}</small></p>`,[['すごい！',go]],'sp')}
const MIO_SP=[["What?! That's a legend! I've only read about it in books!","えっ？！ それ 伝説の 品だよ！ 本でしか 見たこと ない！"],["Wow… it's shining. Please bring it home safe!","わあ… 光ってる。 ぜったい ぶじに もって帰ってきてね！"],["Boss, you're so lucky! Let me see it later!","店長、 運が いい！ あとで 見せてね！"]];
const SPECIAL=Object.keys(DG_ITEMS).filter(k=>DG_ITEMS[k].r===4);
const isSp=id=>(DG_ITEMS[id]||{}).r===4;
/* 雑貨店で 売る ねだん（ノラさんの 買いとり）: よく出る 25・ときどき 60・めずらしい 150・とくべつ v */
const sellP=id=>{const t=DG_ITEMS[id];return t?(t.v||({1:25,2:60,3:150}[t.r||1])):0};
/* 11/23: アイテムは めずらしさで 出やすさが ちがう（r 1=よく出る 2=ときどき 3=めずらしい） */
const itemPick=(skip=[])=>{const ks=Object.keys(DG_ITEMS).filter(k=>!skip.includes(k)),tot=ks.reduce((a,k)=>a+RW[DG_ITEMS[k].r||1],0);let x=Math.random()*tot;for(const k of ks){const w=RW[DG_ITEMS[k].r||1];if(x<w)return k;x-=w}return ks[0]};
const itN=id=>DG().it[id]||0;
/* 11/22: 拾った アイテムは 絵文字だけで なく タップで 名前と はたらきが わかる チップに */
const itChips=o=>Object.keys(o).filter(k=>o[k]>0&&DG_ITEMS[k]).map(k=>`<button class="dgchip ${isSp(k)?'sp':''}" data-iti="${k}">${DG_ITEMS[k].ico}<b>${DG_ITEMS[k].n}</b>${o[k]>1?`×${o[k]}`:''}</button>`).join('');
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
 {k:'door',ico:'🚪',n:'かぎの 扉',s:'かぎが いる。 中は 宝の へや',ev:.9,trap:.05,tr:2.2,key:1},
 {k:'secret',ico:'💥',n:'かくし部屋',s:'ばくだんで あけた 穴。 わなが なく 宝だらけ',ev:1,trap:0,tr:2.5,ore:1,hid:1},
 {k:'vault',ico:'🗺️',n:'宝の 地図の へや',s:'地図の かけら 3まいが しめす へや。 宝箱と 宝石だらけ',ev:1,trap:0,tr:3.5,hid:1}];
const pathOf=k=>PATHS.find(p=>p.k===k)||PATHS[0];

/* ================================================================ ことばの えらび方 */
const LVS=['es','jh','hs','adv'];
function lvAt(f){const r=Math.random();if(f<=100)return r<.9?'es':'jh';if(f<=200)return r<.5?'jh':'hs';if(f<=300)return r<.6?'hs':'adv';return r<.3?'hs':'adv'}
function words5(f){const out=[],hs=new Set(),used=new Set(D?[...D.seenW,...(D.ws||[])]:[]);for(let t=0;t<80&&out.length<5;t++){const lv=lvAt(f),c=pickL(C.W.filter(x=>x.lv===lv));if(!c||hs.has(c.h)||!c.ja||(t<60&&used.has(c.id)))continue;hs.add(c.h);out.push(c.id)}return out}
/* 原石に なる まだ ない ことば（その 深さの レベル） */
/* 11/23: 📖ブックに 記録ずみの ことばも 原石に なる（4わり）。 お店で 少し みがく（3問）だけで 売れる カードに。 mix=true で まぜる */
function polWord(f){if(!window.ORE)return null;const lv=lvAt(f),ok=c=>ORE.recd(c.id)&&!ORE.has(c.id)&&ORE.okWord(c)&&!D.got.ore.includes(c.id);
  let pool=C.W.filter(c=>c.lv===lv&&ok(c));if(!pool.length)pool=C.W.filter(ok);return pool.length?pickL(pool).id:null}
const isPol=id=>!!(window.ORE&&ORE.recd(id));
function oreWord(f,mix){if(mix&&Math.random()<.4){const p=polWord(f);if(p)return p}const n=newWord(f);return n||(mix?polWord(f):null)}
function newWord(f){const lv=lvAt(f);let pool=C.W.filter(c=>c.lv===lv&&(!window.ORE||(!ORE.recd(c.id)&&!ORE.has(c.id)&&ORE.okWord(c)))&&!D.got.ore.includes(c.id));if(!pool.length)pool=C.W.filter(c=>window.ORE&&!ORE.recd(c.id)&&!ORE.has(c.id)&&ORE.okWord(c));return pool.length?pickL(pool).id:null}

/* ================================================================ 入口 */
let D=null;
function open(){const G=DG(),h=hp();
  G.told=G.told||{};const upd=G.runs&&!G.told.upd2,up3=!upd&&G.runs&&!G.told.upd3,up4=!upd&&!up3&&G.runs&&!G.told.upd4;if(upd||up3||up4){G.told.upd2=1;G.told.upd3=1;G.told.upd4=1;save()}
  const [ex,tx]=ML(upd?'dg_upd2':up3?'dg_upd3':up4?'dg_upd4':G.runs?pickL(['dg_open','dg_open2','dg_open3']):'dg_new',{f:G.best,c:G.bestC||0});
  const cks=Object.keys(G.ck).map(Number).sort((a,b)=>a-b);
  H.show('cg',`<section class="pnl cgp shp dgp">
    <div class="qtop"><button class="x" id="dgx" aria-label="もどる">←</button><b>⛏️ 単語の 鉱山</b><span class="qn">${G.mp?`🗺️${G.mp}/3 `:''}${G.best?`最高 地下${G.best}階`:''}${G.bestC?` ・ 🔥${G.bestC}`:''}</span></div>
    <div class="kmina"><span class="lface">${MINA.face('m',ex)}</span><p>${tx}</p></div>
    ${(()=>{const k=G.emma||0;return `<div class="dgsprog"><b>📖 エマの 冒険</b><span>${STORY.map((S,i)=>`<i class="${i<k?'ok':''}">${i<k?S.ico:'・'}</i>`).join('')}</span><small>${k>=STORY.length?'🏅 星の 探検家（クリア）':`つぎ: ${esc(STORY[k].t)} ・ 地下${STORY[k].at}階より 下`}</small></div>`})()}
    ${window.FOOD?FOOD.mineBox():''}
    <button id="dggo" class="mngo" ${h>0?'':'disabled'}><span class="mngoi">⛏️</span><span class="mngot2">地下1階から</span><small>❤${h}</small></button>
    ${cks.map(f=>`<button class="dgck sub" data-ck="${f}" ${h>0?'':'disabled'}>🪜 地下${f}階から <b>🪙${ckCost(f)}</b></button>`).join('')}
    ${bagLine()}
    <details class="shmore"><summary>鉱山の しくみ</summary><ol class="mncs">
      <li>ことば 5つに 2問ずつ 答えると、 1階 下へ。 階段を おりるたびに ❤が へる（深いほど 多い）</li>
      <li>休憩所は 毎回 ちがう（たき火・地底の泉・モグラの行商人・古いほこら・ふしぎな井戸・ミオの無線基地）。 3つの うち 1つだけ えらべる。 たき火では まちがえた ことばが けむりに うかぶ</li>
      <li>まちがえると ❤が へる。 ❤0で たおれると、 その回に 拾った 物の 半分を なくす（帰れば ぜんぶ もちかえれる）</li>
      <li>階ごとに 分かれ道。 ことば 1つごとに 宝・🪨原石・わな・しかけ…（さけられない わなも ある）</li>
      <li>🔥 つづけて 正解すると 「れんさ」。 5れんさごとに ごほうび（コイン・アイテム・原石）。 まちがえると 0に もどる</li>
      <li>✨ ごくまれに 「とくべつな 品」（👑🐉⏳🌟🧜📕）。 とても 強い。 雑貨店で 高く 売れる</li>
      <li>👑 10階ごとに 「階の ぬし」。 きょう まちがえた ことばが 弱点（正解で 2ダメージ）</li>
      <li>深く なると 景色が かわる（土 → 岩 → 水晶 → 地底湖 → 溶岩 → 遺跡 → 星の 底）</li>
      <li>🗿 番人・✨ 光る 鉱脈・🪧 英語の かんばん・🧵 色の 糸・🦷 ミミック… しかけの 多くは 英語が わかれば 得を する</li>
      <li>🎒 アイテムは いつでも つかえる。 ここだけの アイテムは ${Object.keys(DG_ITEMS).length}種（めずらしい ものも）</li>
      <li>地下1〜100階は 小学生（中学 少し）・101〜200階は 中学と 高校・その下は 高校と ハイレベル。 100階ごとに 区切りが ひらく</li></ol></details>
  </section>`);
  $('dgx').onclick=()=>{sf('back');SHOP.open()};
  if(window.FOOD)FOOD.mineBind(open);
  bindBag();
  $('dggo').onclick=()=>{if(hp()<1)return;sf('open');start(1)};
  H.panel.querySelectorAll('[data-ck]').forEach(b=>b.onclick=()=>{const f=+b.dataset.ck,p=ckCost(f);if(hp()<1)return;if(ST.coins<p){sf('wrong');H.toast('🪙 コインが たりないよ');return}ST.coins-=p;H.head();sf('buy');start(f)})}
/* 11/23: 入口の 🎒 も タップで 名前と はたらき（鉱山の 中と 同じ DG_ITEMS） */
const bagLine=()=>{const L=Object.keys(DG_ITEMS).filter(itN);return L.length?`<p class="mntl">🎒 ${L.map(id=>`<button class="mnit" data-ite="${id}" aria-label="${esc(DG_ITEMS[id].n)}">${DG_ITEMS[id].ico}<b>×${itN(id)}</b></button>`).join('')} <small class="mnith">ここだけの アイテム・タップで せつめい</small></p>`:''};
const bindBag=()=>H.panel.querySelectorAll('[data-ite]').forEach(b=>b.onclick=e=>{e.stopPropagation();const t=DG_ITEMS[b.dataset.ite];sf('pop');H.toast(`${t.ico} <b>${esc(t.n)}</b> ×${itN(b.dataset.ite)}<small>${esc(t.s)}<br>${window.MICO?MICO()+' ':''}鉱山の 中で 🎒から いつでも つかえるよ</small>`,4200)});

function start(f){try{SHOP.leave()}catch(e){}const G=DG();G.runs++;save();
  D={floor:f,from:f,path:null,ws:[],wi:0,qi:0,last:'',got:{coins:0,gems:{},ore:[],cards:[],it:{}},b:{guard:0,luck:0,feather:0,see:0,charm:0,mag:0,clover:0,twin:0,beads:0,gpick:0,orb:0},pre:null,st:'',zi:null,pet:null,vault:0,bossAt:0,brk:0,seenW:[],combo:0,cmax:0,q:0,ok:0,miss:0,missed:[],events:[],alive:true};
  try{RECENT.add('mine0',{})}catch(e){}
  branch()}

/* ================================================================ 分かれ道 */
function branch(){if(!D)return;const n=Math.random()<.35?3:2;let L=[...PATHS].filter(p=>!p.hid&&(p.k!=='door'||Math.random()<.35));L=L.sort(()=>Math.random()-.5).slice(0,n);
  if(D.vault){D.vault=0;L.unshift(pathOf('vault'));tell('vault')}
  const see=D.b.see>0;if(see)D.b.see--;
  const zi=window.DGART?DGART.zoneI(D.floor):0,Z=window.DGART?DGART.ZONES[zi]:null,newZ=Z&&D.zi!=null&&zi!==D.zi;if(Z)D.zi=zi;
  H.show('cg',`<section class="pnl cgp shp dgp" data-stay>${hdr()}
    <div class="dgscene dgart dgbr ${D.path||''}">${Z?`<span class="dgzn">${Z.ico} ${Z.n}</span>`:''}</div>
    ${Z?`<p class="dgzone ${newZ?'new':''}">${Z.ico} ${Z.n}${newZ?' に 入った！':''}</p>`:''}
    ${storyReady()&&!D.storyRun?'<p class="dgstory">📖 この 階の どこかで エマが まっている…</p>':''}
    <p class="dgq">${pickL(['分かれ道だ。 どっちへ 行く？','道が わかれている…','どの 道に しよう？'])}</p>
    <div class="dgpaths">${L.map(p=>`<button data-p="${p.k}" class="dgpath ${p.k}"><span>${p.ico}</span><b>${p.n}</b><small>${see?esc(p.s):Math.random()<.5?esc(p.s):'？？？'}</small>${p.key&&!hasKey()?'<em>🔒 かぎが いる</em>':''}</button>`).join('')}</div>
    ${itN('bomb')?`<button id="dgbomb" class="sub dgbomb">💣 ばくだんで かべを こわす <small>×${itN('bomb')}</small></button>`:''}
    ${toolsRow()}</section>`);
  bindTop();D.st='branch';try{DGART.mount(H.panel.querySelector('.dgbr'),{f:D.floor,path:'',stage:1,pet:D.pet})}catch(e){}
  if(newZ){try{SFX.fanfare(1)}catch(e){}tell('z'+zi)}
  const bb=$('dgbomb');if(bb)bb.onclick=()=>blast();
  H.panel.querySelectorAll('[data-p]').forEach(b=>b.onclick=()=>{const p=pathOf(b.dataset.p);if(p.key&&!useKey()){sf('wrong');H.toast('🔒 かぎが かかっている<small>🗝️ かぎが あれば あけられる</small>');return}sf('step');D.path=p.k;floor()})}
function blast(){if(!itTake('bomb'))return;sf('wrong');const p=H.panel.querySelector('section');if(p){p.classList.remove('mnshake');void p.offsetWidth;p.classList.add('mnshake')}
  tell('bomb');card('💥','ドカーン！',`<p>かべの 向こうに かくし部屋が あった！</p><p class="dgmio">📡 ミオ「<b>Whoa! What was that sound?!</b>」<br><small>いまの 音 なに？！</small></p>`,[['入る！',()=>{D.path='secret';floor()}]],'boom');try{MIO.say('Whoa! What was that sound?!')}catch(e){}}
const hasKey=()=>itN('okey')>0||(window.MINE&&MINE.toolN('key')>0);
const useKey=()=>itTake('okey')||(window.MINE&&MINE.takeTool('key'));

/* ================================================================ 1つの 階 */
function floor(){D.ws=words5(D.floor);D.wi=0;D.qi=0;D.done=[];D.st='floor';D.pre=null;D.hl=1+(Math.random()*4|0);if(D.b.orb){D.b.orb=0;preRoll(0)}ask()}
/* 🔮 みらいの 水晶: のこりの できごとを 先に 決めて 見せる */
function preRoll(from){D.pre=D.pre||[];for(let i=from;i<D.ws.length;i++)D.pre[i]=roll()}
function hdr(){const p=D.path?pathOf(D.path):null,h=hp();return `<div class="qtop dgtop"><span></span><b>⛏️ 地下${D.floor}階 ${p?p.ico:''}</b><span class="qn dghp ${h<=15?'low':''}">❤${h}</span></div>
  <div class="dglane">${[...Array(Math.max(5,D.ws.length)).keys()].map(i=>D.pre&&i>=D.wi?`<i class="pv ${i===D.wi?'now':''}" title="${D.pre[i]?esc(EVN[D.pre[i]][1]):'なにも ない'}">${D.pre[i]?EVN[D.pre[i]][0]:'・'}</i>`:`<i class="${i<D.wi?'ok':i===D.wi&&D.ws.length?'now':''} ${i===D.hl&&i>=D.wi?'hl':''}">${i===D.hl&&i>=D.wi?'❗':''}</i>`).join('')}${D.combo>=2?`<em class="dgcb ${D.combo>=10?'hot':''}">🔥${D.combo}</em>`:''}<span>${D.got.coins?`🪙${D.got.coins}`:''} ${D.got.ore.length?`🪨${D.got.ore.length}`:''} ${D.got.cards.length?`🎁${D.got.cards.length}`:''}</span></div>`}
/* 11/23 ユーザー「持ち物を もっと 下に」: 🎒は 左上（← と まぎらわしい）から 下の 「帰る」の 列へ。 となりに 🎵 BGM */
const footRow=(home='🏠 帰る',hid='dghome')=>`<div class="row dgfoot"><button class="sub dgbagb" id="dgbag">🎒 アイテム</button><button class="sub dgmusb ${mSong()?'on':''}" id="dgmus" aria-label="BGM">${mSong()?'🎵':'🔇'}</button><button class="sub dghomeb" id="${hid}">${home}</button></div>`;
const toolsRow=()=>footRow();
function bindTop(){const b=$('dgbag');if(b)b.onclick=()=>{sf('open');bag()};const m=$('dgmus');if(m)m.onclick=()=>{sf('open');music()};const hb=$('dghome');if(hb)hb.onclick=()=>{sf('step');finish('home')}}

/* ================================================================ 🎵 鉱山の BGM（11/23 ユーザー「BGMの ON・OFF、 曲を 変えたい」）
   曲は 鉱山ラジオの 3曲（ただ）＋ 雑貨店で 買った レコード。 記録 DG().bgm = 曲id ／ 'off'。 まだ えらんでいない ときは お店の BGM と 同じ（なければ オフ）
   ながすのは game.js の placeBgm（画面 'cg' の うち .dgp の ときだけ。 inShop() は .dgp を のぞく） */
const MINE_FREE=['lofi_lamp','lofi_tape','lofi_rain'];
const okTr=id=>typeof TRACKS!=='undefined'&&!!TRACKS[id];
const mSongs=()=>[...new Set([...MINE_FREE,...(ST.music||[])])].filter(okTr);
const trName=id=>{const n=(TRACKS[id]||{}).name||id,m=n.match(/「(.+)」/);return m?m[1]:n};
function mSong(){const b=DG().bgm;if(b==='off')return null;if(b&&okTr(b)&&mSongs().includes(b))return b;const s=H.shopSongId;return s&&okTr(s)?s:null}
try{H.placeBgm('cg',{id:()=>H.panel.querySelector('.dgp')?mSong():null,v:.45})}catch(e){}
const MIO_MUS={on:[["Mio's mine radio! Enjoy the music, boss.","ミオの 鉱山ラジオ！ 音楽で 元気だしてね、 店長。"],["Good song! Dig to the beat!","いい曲！ リズムに のって ほろう！"],["Music makes the dark tunnel less scary, right?","音楽が あると 暗い 坑道も こわくないでしょ？"]],
 off:[["Quiet mode. Listen to the drip, drip of water…","しずかモード。 ぽた、ぽた… 水の 音が 聞こえるね。"],["OK, radio off. Focus on the words!","りょうかい、 ラジオ オフ。 ことばに 集中！"]]};
function music(){const L=mSongs(),cur=mSong(),own=new Set(ST.music||[]);
  const o=C.ov(`<div class="dgbagov dgmusov"><b>🎵 鉱山の BGM</b>
    ${!ST.sound?'<p class="note">🔇 いまは 音が オフ。 右上の 🔈で 音を オンにすると 聞こえるよ</p>':''}
    <button class="dgit dgmo ${cur?'':'on'}" data-mu="off"><span>🔇</span><b>オフ</b><small>しずかに ほる</small></button>
    <p class="dglbl">📻 ミオの 鉱山ラジオ（いつでも ながせる）</p>
    ${L.filter(id=>MINE_FREE.includes(id)).map(row).join('')}
    ${L.some(id=>!MINE_FREE.includes(id))?`<p class="dglbl">💿 もっている レコード</p>${L.filter(id=>!MINE_FREE.includes(id)).map(row).join('')}`:'<p class="note">💿 雑貨店で レコードを 買うと ここでも ながせるよ</p>'}
    <button id="dgbx" class="sub">とじる</button></div>`,'dgov');o.dataset.stay=1;
  function row(id){return `<button class="dgit dgmo ${cur===id?'on':''}" data-mu="${esc(id)}"><span>${cur===id?'🎶':'🎵'}</span><b>${esc(trName(id))}</b><small>${cur===id?'いま ながれているよ':MINE_FREE.includes(id)&&!own.has(id)?'鉱山ラジオ':'レコード'}</small></button>`}
  o.querySelector('#dgbx').onclick=()=>{sf('back');C.closeOv()};
  o.querySelectorAll('[data-mu]').forEach(b=>b.onclick=()=>{const id=b.dataset.mu;DG().bgm=id;save();sf('pop');C.closeOv();
    try{H.musAt()}catch(e){}
    const mb=$('dgmus');if(mb){const on=!!mSong();mb.textContent=on?'🎵':'🔇';mb.classList.toggle('on',on)}
    const ln=pickL(MIO_MUS[id==='off'?'off':'on']);H.toast(`${id==='off'?'🔇 BGM オフ':'🎵 '+esc(trName(id))}<small>📡 ミオ「${esc(ln[1])}」</small>`,3000);
    try{MIO.say(ln[0])}catch(e){}
    const G=DG();if(!G.musTold&&id!=='off'){G.musTold=1;save();const [,tx]=ML('dg_music');if(tx)setTimeout(()=>H.toast(`${MICO()} <b>ミナ先生</b><small>${esc(tx)}</small>`,5200),1600)}})}
const TYPES=['mean','rev','listen','spell','arr','arr'];
function ask(){if(!D)return;const id=D.ws[D.wi],I=C.info(id);if(!I)return nextWord();
  let t;for(let k=0;k<6;k++){t=pickL(TYPES);if(t!==D.last)break}
  if(t==='listen'&&!ST.sound)t='mean';if(t==='spell'&&!/^[a-z]{3,}$/.test(I.h))t='rev';if(t==='arr'&&!(window.ORE&&ORE.okWord(I)))t='mean';D.last=t;
  H.show('cg',`<section class="pnl cgp shp dgp" data-stay>${hdr()}<div class="dgscene dgart ${D.path||''}">${window.DGART?`<span class="dgzn">${DGART.zone(D.floor).ico} ${DGART.zone(D.floor).n}</span>`:'<span class="dgme">⛏️</span><span class="dgrock">🪨</span>'}${D.pet?'<span class="dgpetn">🐈</span>':''}<span class="dgn">${D.qi?'2問目':'1問目'}</span></div><div id="dgq" class="dgqbox"></div>${toolsRow()}</section>`);
  bindTop();const box=$('dgq');D.qbox=box;
  try{DGART.mount(H.panel.querySelector('.dgscene'),{f:D.floor,path:D.path,pet:D.pet,crack:D.qi?1:0,fresh:D.qi===0&&D.wi>0&&D.brk})}catch(e){}D.brk=0;
  if(t==='arr')return ORE.arrangeQ(I,box,Math.random()<.5?'arr2':'arr',ok=>answered(id,ok));
  const q=C.quiz(id,{type:t});C.ask(box,q,r=>answered(id,r.ok&&!r.hint),{tag:'⛏️'})}
function answered(id,ok){if(!D)return;D.q++;if(D.qi)qLog(id);try{C.record(id,ok)}catch(e){}if(!D.seenW.includes(id))D.seenW.push(id);
  const sc=document.querySelector('.dgscene');
  if(ok){D.ok++;if(sc){sc.classList.remove('hit');void sc.offsetWidth;sc.classList.add('hit')}sf('knock');try{DGART.hit();DGART.crack(D.qi?3:1);if(D.qi)setTimeout(()=>{try{DGART.breakRock()}catch(e){}},260)}catch(e){}
    if(D.b.beads){const a=hp();if(a<HPMAX){setHp(Math.min(HPMAX,a+3));upd();setTimeout(()=>flyTxt('📿 ❤ +3'),380)}}
    D.combo++;if(D.combo>D.cmax)D.cmax=D.combo;if(D.combo%5===0)comboGift()}
  else{D.miss++;try{DGART.miss()}catch(e){}if(!D.missed.includes(id))D.missed.push(id);if(D.b.feather>0){D.b.feather--;flyTxt('🪶 金の 羽で セーフ！')}else{if(D.combo>=5)setTimeout(()=>flyTxt(`🔥${D.combo}れんさ おわり`,'bad'),420);D.combo=0;const dmg=6+Math.floor(D.floor/40);hurt(dmg,'まちがえて')}}
  if(!D||D.fallen)return;
  setTimeout(()=>{if(!D)return;D.qi++;if(D.qi<2)return ask();D.qi=0;D.wi++;D.brk=1;encounter(()=>{if(!D)return;D.wi>=D.ws.length?stairs():ask()})},ok?500:900)}
function hurt(n,why){if(D)D.badT=Date.now();const h=Math.max(0,hp()-n);setHp(h);sf('wrong');flyTxt(`❤ -${n}`,'bad');const e=document.querySelector('.dghp');if(e){e.textContent='❤'+h;e.classList.toggle('low',h<=15)}
  const p=H.panel.querySelector('section');if(p){p.classList.remove('mnshake');void p.offsetWidth;p.classList.add('mnshake')}
  if(h<=0&&itTake('dscale')){setHp(40);upd();sf('fanfare');try{SFX.fanfare(2)}catch(e){}setTimeout(()=>H.toast('🐉 竜の うろこが 光った！<small>❤40で 立ちあがった（うろこは くだけた）</small>',3600),300);return}
  if(h<=0){D.fallen=1;setTimeout(collapse,900)}}
function flyTxt(t,cls=''){const st=document.querySelector('.dgscene')||H.panel;if(!st)return;const e=document.createElement('b');e.className='dgfly '+cls;e.textContent=t;st.appendChild(e);setTimeout(()=>e.remove(),1400)}
function nextWord(){D.wi++;D.wi>=D.ws.length?stairs():ask()}

/* ================================================================ 🔥 れんさ（11/23）: つづけて 正解すると 5回ごとに ごほうび。 まちがえると 0に（🪶 金の 羽なら 切れない） */
function comboGift(){const n=D.combo,t=n/5,x=D.b.gpick?2:1;let msg='';
  if(t===1||t%4===1){const v=(12+D.floor)*x;D.got.coins+=v;msg=`🪙+${v}`;sf('coin')}
  else if(t%4===2){const ids=[];for(let i=0;i<x;i++){const k=itemPick(['ladder','crystal']);D.got.it[k]=(D.got.it[k]||0)+1;itAdd(k);ids.push(DG_ITEMS[k].ico)}msg=ids.join('');sf('pickup')}
  else if(t%4===3){let c=0;for(let i=0;i<x;i++){const id=oreWord(D.floor,true);if(id){D.got.ore.push(id);c++}}msg=c?`🪨×${c}`:'';if(!c){const v=(12+D.floor)*x;D.got.coins+=v;msg=`🪙+${v}`}sf('pickup')}
  else{const k=itemPick(['potion','candle','firefly','okey','compass','beads']);D.got.it[k]=(D.got.it[k]||0)+x;itAdd(k,x);msg=DG_ITEMS[k].ico+(x>1?'×2':'');try{SFX.fanfare(1)}catch(e){sf('pickup')}}
  setTimeout(()=>flyTxt(`🔥${n}れんさ！ ${msg}`),300);
  if(n===5)tell('combo');
  if(n>=10&&n%10===0){const L=pickL(MIO_COMBO);setTimeout(()=>H.toast(`🔥 ${n}れんさ！<small>📡 ミオ「${esc(L[1])}」</small>`,2600),700);try{MIO.say(L[0])}catch(e){}}}
const MIO_COMBO=[["Wow, combo ten! You're on fire, boss!","わあ、 10れんさ！ 店長、 ノリノリだね！"],["Amazing! Keep going, keep going!","すごい！ その ちょうし、 その ちょうし！"],["I can hear your pickaxe from here! Clang, clang!","ここまで つるはしの 音が 聞こえるよ！ カン、 カン！"],["No mistakes? Are you a word machine?","まちがい なし？ ことばの ロボット なの？"]];

/* はじめて 見た しかけ・アイテムは ミナ先生が ひとこと（1回だけ） */
function tell(k){const G=DG();G.told=G.told||{};if(G.told[k])return;G.told[k]=1;save();const [,tx]=ML('dg_'+k);if(tx)setTimeout(()=>H.toast(`${MICO()} <b>ミナ先生</b><small>${esc(tx)}</small>`,5600),900)}
/* しかけの 中の 1問（この 回に 答えた ことばの ふくしゅう）。 cb(ok) */
/* 11/23 ユーザー「同じ 単語が 何度も 出てくる」: しかけの 問題は 「さいきん 出した 8つ」を さけ、 1回の 鉱山で 同じ ことばは 2回まで。
   ふくしゅう（この 回に 答えた ことば）が つきたら 新しい ことばを まぜる */
const qLog=id=>{D.qlog=D.qlog||[];D.qlog.push(id);if(D.qlog.length>8)D.qlog.shift()};
function revW(){D.rc=D.rc||{};const rec=new Set(D.qlog||[]),ok=id=>!rec.has(id)&&(D.rc[id]||0)<2&&C.info(id);
  let pool=[...new Set([...D.seenW,...D.ws])].filter(ok);
  if(pool.length<2)pool=pool.concat(words5(D.floor).filter(ok));
  if(!pool.length)pool=words5(D.floor);
  const m=Math.min(...pool.map(id=>D.rc[id]||0));pool=pool.filter(id=>(D.rc[id]||0)===m);
  const id=pickL(pool);D.rc[id]=(D.rc[id]||0)+1;qLog(id);return id}
function quickQ(box,cb,id){if(id)qLog(id);else id=revW();const I=C.info(id);if(!I){cb(true);return}
  const t=pickL(['mean','rev','rev',...(ST.sound?['listen']:[])]);const q=C.quiz(id,{type:t});
  C.ask(box,q,r=>{const ok=r.ok&&!r.hint;try{C.record(id,ok)}catch(e){}cb(ok)},{tag:'⛏️',fast:1})}
/* しかけ用の 画面（上に 絵と 説明・下に 問題や ボタン） */
/* 11/23 ユーザー「鉱山 ショボい・イベントも 楽しくない」: できごとは 「舞台」で。 上に その 階の ドット絵（鉱夫と 景色）、 右に 主役が 登場する。
   悪い できごとは 赤く ゆれる（hurt の 直後 / cls に bad）。 本文と ボタンは 少し おくれて 出る */
const isBad=cls=>/\bbad\b/.test(cls)||(D&&Date.now()-(D.badT||0)<1600);
function stageIn(o,cls){const st=o.querySelector('.dgstage');if(!st||!D)return;try{DGART.mount(st,{f:D.floor,path:D.path,stage:1,pet:D.pet})}catch(e){}
  if(isBad(cls)){o.querySelector('.dgev').classList.add('bad');st.classList.add('bad')}}
const stageH=(ico,anim='')=>`<div class="dgstage"><span class="dgact ${anim}">${ico}</span></div>`;
function gov(ico,title,body,cls=''){const o=C.ov(`<div class="dgev dgg dgst ${cls}">${stageH(ico,/boss/.test(cls)?'':'dga-pop')}<b class="dgtt">${title}</b><div class="dgeb">${body}</div><div class="dggq"></div><div class="row dgeb2"></div></div>`,'dgov');o.dataset.stay=1;stageIn(o,cls);return {o,q:o.querySelector('.dggq'),b:o.querySelector('.dgeb2'),body:o.querySelector('.dgeb'),act:o.querySelector('.dgact')}}
/* 🎭 かけあい: せりふを 1つずつ（▶で つぎ）。 who: emma / mio / me / nar / 任意の [ico,名前] */
const WHO={emma:['🧑‍🦰','エマ'],mio:['📡','ミオ'],me:['🙋','じぶん'],nar:['','']};
function talkSeq(g,lines,end){let i=0;const box=document.createElement('div');box.className='dgtalk';g.body.appendChild(box);
  const step=()=>{if(i>=lines.length){g.b.innerHTML='';return end()}const [w,en,ja]=lines[i++],W=Array.isArray(w)?w:WHO[w]||WHO.nar;
    box.insertAdjacentHTML('beforeend',`<div class="dgln ${w==='nar'?'nar':''} ${w==='me'?'me':''}">${W[0]?`<span class="dgwho">${W[0]} ${esc(W[1])}</span>`:''}${en?`<p class="en">${esc(en)}</p>`:''}${ja?`<p class="ja">${esc(ja)}</p>`:''}</div>`);
    const ls=box.querySelectorAll('.dgln');if(ls.length>3)ls[0].remove();
    if(en){if(w==='mio'){try{MIO.say(en)}catch(e){}}else if(w!=='me'){try{H.say('es',en)}catch(e){}}}
    sf(w==='nar'?'tick':'pop');btnsIn(g.b,[[i<lines.length?'▶ つぎ':'▶',step]])};
  step()}
const btnsIn=(el,btns)=>{el.innerHTML=btns.map((b,i)=>`<button data-b="${i}" class="${b[2]||''}">${b[0]}</button>`).join('');el.querySelectorAll('[data-b]').forEach(e=>e.onclick=()=>{sf('step');btns[+e.dataset.b][1]()})};

/* ================================================================ できごと（ことば 1つ ごと） */
/* 11/23 ユーザー「仕掛けも いまいち」: 番人・鉱脈・かんばん・色の糸・魔法陣・地下水・まいごの 探検家・ミミック を 追加 */
const EVN={gem:['💎','宝石'],chest:['📦','宝箱'],ore:['🪨','原石'],tcard:['🎁','宝カード'],item:['🎒','アイテム'],trap:['⚠️','わな'],spring:['⛲','いずみ'],gamble:['🎩','手品師'],merchant:['🐹','行商人'],echo:['🗣️','こだま'],rail:['🛤️','トロッコ'],ghost:['👻','？？？'],
 golem:['🗿','ことばの 番人'],vein:['✨','光る 鉱脈'],sign:['🪧','英語の かんばん'],thread:['🧵','色の 糸'],warp:['🌀','魔法陣'],flood:['🌊','地下水'],lost:['🧑‍🦰','まいごの 探検家'],
 mapp:['🗺️','地図の かけら'],cat:['🐈','坑道ねこ'],rush:['⏱️','落盤'],fossil:['🦴','ことばの 化石'],rune:['🔤','古代文字'],story:['📖','エマの 冒険']};
const GOOD=[['gem',30],['chest',16],['ore',22],['item',10],['vein',12],['tcard',3]];
const wpick=W=>{const tot=W.reduce((a,w)=>a+w[1],0);let x=Math.random()*tot;for(const [n,w] of W){if(x<w)return n;x-=w}return W[0][0]};
function roll(){const p=pathOf(D.path);if(D.b.star){D.b.star=0;return 'tcard'}if(D.b.clover>0){D.b.clover--;return wpick(GOOD)}
  if(Math.random()>p.ev+(D.b.charm?.15:0))return null;
  const W=[['gem',26],['chest',9*p.tr],['ore',(p.ore?40:18)],['tcard',3*p.tr],['item',6*p.tr],['trap',p.trap*100*(D.b.charm?.5:1)],['spring',p.spring?14:3],['gamble',4],['merchant',3],['echo',6],
    ['golem',p.hid?3:6],['vein',p.ore?10:6],['sign',p.hid?0:6],['thread',5],['warp',p.hid?0:3],['flood',p.hid?0:(p.spring?8:3)],['lost',3],['mapp',D.vault?0:4],['cat',D.pet?0:2],['rush',p.hid?0:5],['fossil',5],['rune',4],...(p.rail?[['rail',12]]:[]),...(nightDeep()?[['ghost',4]]:[])].filter(w=>w[1]>0);
  return wpick(W)}
/* 11/23 起伏: 1つの 階に 「見どころ」が 1つ（列の ❗）。 ほかの ことばの あとは 小さな 見つけ物が ときどき。
   できごとの 前に 鉱夫の 頭に 「！」が 出て 音が なる（ドキッと する 間） */
const BIG=[['chest',14],['golem',8],['vein',10],['sign',8],['thread',7],['lost',6],['cat',4],['rush',7],['fossil',7],['rune',6],['mapp',6],['merchant',5],['gamble',5],['warp',4],['flood',4],['spring',4],['trap',8]];
const SMALL=['gem','gem','gem','ore','ore','item','echo'];
function bigRoll(){const p=pathOf(D.path);if(storyReady()&&!D.storyRun)return 'story';
  const W=BIG.filter(([k])=>!(k==='cat'&&D.pet)&&!(k==='mapp'&&D.vault)&&!(p.hid&&/trap|sign|warp|flood|rush/.test(k))).map(([k,w])=>[k,k==='trap'?w*p.trap*4:k==='chest'?w*p.tr:k==='vein'&&p.ore?w*2:k==='spring'&&p.spring?w*3:w]);
  if(p.rail)W.push(['rail',12]);if(nightDeep())W.push(['ghost',5]);return wpick(W)}
function encounter(go){const i=D.wi-1;let k;
  if(D.pre&&i>=0&&D.pre[i]!==undefined){k=D.pre[i];D.pre[i]=undefined}
  else if(i===D.hl)k=D.b.star||D.b.clover>0?roll():bigRoll();
  else k=D.b.star||D.b.clover>0?roll():Math.random()<pathOf(D.path).ev*.45+(D.b.charm?.15:0)?pickL(SMALL):null;
  if(!k)return go();if(k==='story')D.storyRun=1;
  const run=()=>{if(!D||D.fallen)return;if(D.b.twin&&k!=='story'){D.b.twin=0;return EV[k](()=>{if(!D||D.fallen)return;flyTxt('🪞 もう 1回！');EV[k](go)})}EV[k](go)};
  if(SMALL.includes(k)&&k!=='echo')return run();
  bang(k,run)}
/* 「！」の 間 */
function bang(k,then){const sc=document.querySelector('.dgscene');const bad=/trap|flood|rush|ghost/.test(k),big=/story|golem|lost|cat|mapp/.test(k);
  try{SFX[bad?'rumble':big?'chance':'tease']()}catch(e){sf('pop')}
  if(sc){const e=document.createElement('b');e.className='dgbang '+(bad?'bad':'');e.textContent=bad?'！？':k==='story'?'…！':'！';sc.appendChild(e);if(bad){sc.classList.remove('quake');void sc.offsetWidth;sc.classList.add('quake')}}
  setTimeout(then,bad?750:600)}
/* 小さな 見つけ物: 画面の 上に うかぶだけで すすむ */
function pop(t,go){flyTxt(t);try{DGART.burst(12,['#ffe080','#fff','#9fe0ff'])}catch(e){}setTimeout(go,650)}
const nightDeep=()=>{try{const h=GH();return h<4}catch(e){return false}};
const luck=()=>(D.b.luck?2:1);
function card(ico,title,body,btns,cls=''){const o=C.ov(`<div class="dgev dgst ${cls}">${stageH(ico,/shake/.test(cls)?'dga-shake':/boom|sp|boss/.test(cls)?'dga-big':'dga-pop')}<b class="dgtt">${title}</b><div class="dgeb">${body}</div><div class="row dgeb2">${btns.map((b,i)=>`<button data-b="${i}" class="${b[2]||''}">${b[0]}</button>`).join('')}</div></div>`,'dgov');o.dataset.stay=1;stageIn(o,cls);
  if(/sp|boom/.test(cls))setTimeout(()=>{try{DGART.burst(26,['#ffe080','#fff','#ff9ae0','#9fe0ff'],150,30)}catch(e){}},200);
  o.querySelectorAll('[data-b]').forEach(e=>e.onclick=()=>{sf('step');C.closeOv();btns[+e.dataset.b][1]()})}
const EV={
 /* 11/23: 小さな 見つけ物は 画面を とめない（岩から とびだして 数字が うかぶだけ） */
 gem:go=>{const fl=D.floor,gi=Math.min(MINE_GEM.length-1,Math.floor(Math.random()*(2+fl/30))),G=MINE_GEM[gi],v=Math.round((G[2]+fl*1.2)*luck()*(D.b.mag?1.5:1)*(D.b.crown?2:1));
  D.got.coins+=v;D.got.gems[G[0]]=(D.got.gems[G[0]]||0)+1;sf('coin');pop(`${G[0]} ${G[1]} 🪙+${v}`,go)},
 chest:go=>{const key=hasKey(),mim=Math.random()<.22;if(mim)setTimeout(()=>{try{SFX.creak()}catch(e){}},500);card('📦',mim?'宝箱だ！ …ガタッ？':'宝箱だ！',`<p>${key?'🗝️ かぎで あければ 中身が ごうかに なる（ミミックでも 平気）':'そのまま あけてみよう'}</p>${DG().told&&DG().told.mimic?'<p class="dghint">…ときどき にせものが いるらしい</p>':''}`,[...(key?[['🗝️ かぎで あける',()=>{useKey();chestOpen(2,go)},'']]:[]),['あける',()=>mim?mimic(go):chestOpen(1,go),key?'sub':'']],mim?'shake':'')},
 ore:go=>{const id=oreWord(D.floor,true);if(!id)return EV.gem(go);D.got.ore.push(id);sf('pickup');const I=C.info(id);
  if(isPol(id)){const G=DG();if(!G.polTold){G.polTold=1;save();const [,tx]=ML('dg_pol');if(tx)setTimeout(()=>H.toast(`${MICO()} <b>ミナ先生</b><small>${esc(tx)}</small>`,5600),700)}
    return card('🪨','📖 ブックの ことばの 原石！',`<p class="en">${esc(word(I))}</p><p>もう 記録してある ことば。 お店で 少し みがけば（3問）、 すぐ 売れる カードに なるよ</p>`,[['つづける',go]],'ore')}
  card('🪨','原石を 見つけた！',`<p>まだ 持っていない ことばが ねむっている 原石。 帰ったら お店の 作業台で みがこう</p><p class="dghint">ヒント: ${esc(String(I.ja).split(/[、,]/)[0])}</p>`,[['つづける',go]],'ore')},
 tcard:go=>{if(!window.CARDS||!CARDS.find1)return EV.gem(go);const g=CARDS.find1(D.floor/3+5);const id='t:'+g.c.e;D.got.cards.push(id);try{SFX.fanfare(1)}catch(e){}
  card('🎁','宝カードを 見つけた！',`<div class="dgcard">${C.face(id,{mini:1,ja:1,marks:false})}</div>${g.isNew?'<p class="mnnew">NEW!</p>':''}`,[['やった！',go]])},
 item:go=>{if(Math.random()<.05)return special(go);const id=itemPick();D.got.it[id]=(D.got.it[id]||0)+1;itAdd(id);sf('pickup');const t=DG_ITEMS[id];
  if(DG().itSeen&&DG().itSeen[id]){return pop(`${t.ico} ${t.n}を 拾った`,go)}DG().itSeen=Object.assign(DG().itSeen||{},{[id]:1});save();
  card(t.ico,`${t.n}を 見つけた！`,`<p>${esc(t.s)}</p><p class="note">鉱山でしか 手に 入らない アイテム。 🎒から いつでも つかえる</p>`,[['つづける',go]])},
 trap:go=>{const T=pickL(TRAPS);
  if(!T.must&&(D.b.guard>0||itN('compass')>0)){if(D.b.guard>0)D.b.guard--;else itTake('compass');sf('pickup');return card('🛡️',`${T.n}… でも よけた！`,`<p>${D.b.guard>=0?'まもりの 道具の おかげ':''}</p>`,[['ふう…',go]])}
  if(itN('dice'))return card('⚠️',`${T.n}だ！`,`<p>🎲 やりなおしの サイコロで ふりなおす？</p><p class="dghint">べつの できごとに かわる（いいことか どうかは 運しだい）</p>`,[['🎲 ふりなおす',()=>{itTake('dice');sf('pickup');let k='trap';for(let t=0;t<8&&k==='trap';t++)k=roll()||'gem';flyTxt('🎲 コロコロ…');EV[k](go)}],['そのまま',()=>T.f(go),'sub']]);
  T.f(go)},
 spring:go=>{card('⛲','ふしぎな いずみ','<p>すきとおった 水が わいている。 のむ？</p>',[['のむ',()=>{if(Math.random()<.85){const a=hp();setHp(Math.min(HPMAX,a+20));sf('eat');card('💧','元気が 出た！',`<p>❤ ${a} → ${hp()}</p>`,[['つづける',go]])}else{hurt(5,'');if(!D.fallen)card('🤢','にがい！','<p>❤ -5 … ただの 鉱泉だった</p>',[['つづける',go]])}}],['のまない',go,'sub']])},
 gamble:go=>{card('🎩','もぐらの 手品師','<p>"Which cup?" 3つの カップの どれかに 金貨が 1まい。</p>',[0,1,2].map(i=>[['🥤','🥤','🥤'][i]+' '+(i+1),()=>{const win=Math.random()<.34*luck();if(win){const v=20+D.floor*2;D.got.coins+=v;sf('coinIn');card('🪙','あたり！',`<p>"Lucky you!" 🪙 +${v}</p>`,[['つづける',go]])}else{sf('pop');card('💨','はずれ…','<p>"Better luck next time!"（また こんど！）</p>',[['つづける',go]])}},'sub']))},
 merchant:go=>{const id=itemPick(),t=DG_ITEMS[id],p=30+Math.floor(D.floor/2)+((t.r||1)-1)*10;
  card('🐹','行商人の ハムさん',`<p>"Want to buy ${t.ico}? Only ${p} coins!"</p><p>${t.n}: ${esc(t.s)}</p><small>（もちあるいている コイン 🪙${ST.coins}）</small>`,[[`🪙${p}で 買う`,()=>{if(ST.coins<p){sf('wrong');H.toast('🪙 コインが たりないよ');return go()}ST.coins-=p;H.head();itAdd(id);sf('buy');go()}],['"No, thanks."',go,'sub']])},
 echo:go=>{const L=pickL(ECHO),ch=H.shuffle([L,...H.shuffle(ECHO.filter(x=>x!==L)).slice(0,2)]);try{H.say('es',L[0])}catch(e){}
  card('🗣️','こだまが 聞こえる…',`<p class="en">"${esc(L[0])}"</p><p class="dghint">なんて 言ってる？（あたると 🪙）</p>`,ch.map(c=>[esc(c[1]),()=>{if(c===L){const v=6+Math.floor(D.floor/2);D.got.coins+=v;sf('coin');card('🗣️','そのとおり！',`<p class="en">"${esc(L[0])}"</p><p>${esc(L[1])}</p><p>🪙 +${v}</p>`,[['つづける',go]])}else{sf('pop');card('🗣️','おしい！',`<p class="en">"${esc(L[0])}"</p><p>＝ ${esc(L[1])}</p>`,[['つづける',go]])}},'sub']))},
 rail:go=>{card('🛤️','古い トロッコ','<p>線路の 上に トロッコ。 のってみる？（どこまで 行くかは 運しだい）</p>',[['のる！',()=>{const n=1+Math.floor(Math.random()*3);if(Math.random()<.25){hurt(10,'');if(D.fallen)return;card('💥','脱線！',`<p>❤ -10 … でも ${n}階 下まで 来た</p>`,[['いたた…',()=>{D.floor+=n;go()}]])}else card('💨',`ビューン！ ${n}階 下へ`,'<p>あっというまに 下の 階へ。</p>',[['すごい！',()=>{D.floor+=n;go()}]])}],['のらない',go,'sub']])},
 ghost:go=>{card('👻','夜中の 坑道…','<p>"Is anybody there?"… 遠くで だれかの 声。 ランタンの 光が ふっと 消えた。</p><p>足もとに 古い 金貨が おちていた。</p>',[['ひろって いそぐ',()=>{D.got.coins+=40;go()}]])},
 /* 🗿 ことばの 番人: この 回に 答えた ことばから 3問。 たたかう・こっそり・回り道（ことば 1つ ふえる） */
 golem:go=>{tell('golem');const g=gov('🗿','ことばの 番人が 道を ふさいでいる！','<p class="en">"Answer my three questions, and I will let you pass."</p><p class="dghint">「3つの 問いに 答えれば 通してやろう」</p>');
  btnsIn(g.b,[['⚔️ ちょうせん（3問）',()=>fight()],['🤫 こっそり 通る',()=>{C.closeOv();if(Math.random()<.5){sf('pickup');card('🤫','うまく ぬけた！','<p>番人は 気づかなかった…</p>',[['ふう',go]])}else{hurt(7,'');if(!D.fallen)card('🗿','見つかった！','<p class="en">"Where are you going?"</p><p>どこへ 行く？ ❤ -7</p>',[['にげる…',go]])}},'sub'],['↩️ 回り道（ことば +1）',()=>{C.closeOv();D.ws.push(...words5(D.floor).slice(0,1));D.extra=(D.extra||0)+1;H.toast('↩️ 回り道… この 階は ことばが 1つ ふえた',2400);go()},'sub']]);
  function fight(){let n=0,ok=0;g.b.innerHTML='';const hpb=()=>`<p class="dgghp">🗿 ${'🟫'.repeat(3-ok)}${'⬜'.repeat(ok)} <small>${n}/3</small></p>`;g.body.innerHTML=hpb();
    const next=()=>{if(n>=3)return end();quickQ(g.q,r=>{n++;if(r){ok++;sf('knock')}g.body.innerHTML=hpb();setTimeout(next,250)})};
    const end=()=>{C.closeOv();if(ok===3){const t=giveIt(itemPick(['potion','candle','firefly','okey','compass'])),v=Math.round((30+D.floor*2)*luck());D.got.coins+=v;try{SFX.fanfare(2)}catch(e){}card('🗿','番人に みとめられた！',`<p class="en">"Well done. You may pass."</p><p>みごとだ。 通るが よい。</p><p>🪙 +${v} ・ ${t.ico} ${t.n}</p>`,[['やった！',go]])}
      else if(ok===2){const v=Math.round((15+D.floor)*luck());D.got.coins+=v;sf('coin');card('🗿','なんとか 通してくれた',`<p class="en">"Not bad."</p><p>わるくない。 🪙 +${v}</p>`,[['つづける',go]])}
      else{hurt(6,'');if(!D.fallen)card('🗿','おしかえされた！',`<p class="en">"Study more, little miner."</p><p>もっと 勉強せよ、 小さな 鉱夫よ。 ❤ -6</p><p class="dghint">答えた ことばは 🏕️ たき火の けむりで 見かえせるよ</p>`,[['くやしい…',go]])}};
    next()}},
 /* ✨ 光る 鉱脈: 1問 ごとに 宝石が ふえるが くずれる 確率も 上がる（押すか 引くか） */
 vein:go=>{tell('vein');let pot=0,n=0;const g=gov('✨','光る 鉱脈だ！','');const mul=luck()*(D.b.mag?1.5:1)*(D.b.crown?2:1);
  const draw=()=>{const risk=Math.min(70,n*12);g.body.innerHTML=`<p>ほるたびに 1問。 宝石が ふえるけど、 くずれる かも…</p><p class="dgpot">💎 ${pot?`🪙${pot} ぶん`:'まだ 0'}</p><p class="dghint">くずれる 確率 ${risk}%${n?' ・ まちがえると 半分だけ もって にげる':''}</p>`;
    g.q.innerHTML='';btnsIn(g.b,[[`⛏️ ${n?'もっと':''}ほる（1問）`,swing],...(n?[[`💰 ここで やめる（🪙${pot}）`,()=>{C.closeOv();D.got.coins+=pot;sf('coinIn');card('💎','たっぷり ほれた！',`<p>🪙 ${pot} ぶんの 宝石</p>`,[['つづける',go]])},'sub']]:[['やめておく',()=>{C.closeOv();go()},'sub']])])};
  const swing=()=>{g.b.innerHTML='';quickQ(g.q,ok=>{n++;
    if(!ok){const k=Math.floor(pot/2);C.closeOv();D.got.coins+=k;card('💥','ガラガラ… くずれた！',`<p>${k?`🪙${k} だけ もって にげた`:'なにも とれなかった…'}</p>`,[['あぶなかった',go]]);return}
    const add=Math.round((10+D.floor*.8+n*6)*mul);pot+=add;sf('coin');
    if(Math.random()<Math.min(.7,(n-1)*.12)){C.closeOv();hurt(5,'');if(D.fallen)return;const k=Math.floor(pot/2);D.got.coins+=k;card('💥','くずれた！',`<p>❤ -5。 🪙${k}（半分）だけ ひろえた</p><p class="dgmio">📡 ミオ「<b>Are you OK?! Get out of there!</b>」<br><small>だいじょうぶ？！ にげて！</small></p>`,[['いたた…',go]]);return}
    draw()})};
  draw()},
 /* 🪧 英語の かんばん: 読めれば 宝の 道、 読みちがえると わな */
 sign:go=>{tell('sign');const S=pickL(SIGNS);try{H.say('es',S[0])}catch(e){}
  card('🪧','英語の かんばんが ある',`<p class="en dgsign">${esc(S[0])}</p><p class="dghint">左と 右、 どっちへ 行く？</p>`,[['⬅️ 左の 道',()=>pick('L')],['➡️ 右の 道',()=>pick('R')]]);
  function pick(w){const tr=`<p class="dghint">「${esc(S[0])}」＝ ${esc(S[1])}</p>`;
    if(w===S[2]){sf('correct');card('🪧','かんばんの とおり！',`<p>読めたね！ 宝が あった</p>${tr}`,[['あける',()=>chestOpen(1,go)]])}
    else{const T=pickL(TRAPS.filter(t=>!t.must&&!t.q));card('🪧','あれ… 道を まちがえた？',tr,[['すすむ…',()=>T.f(go),'sub']])}}},
 /* 🧵 色の 糸: 英語の 指示で 正しい 色を 切る（色の 名前は 出さない） */
 thread:go=>{tell('thread');const cs=H.shuffle([...COLORS]).slice(0,3),ai=Math.random()*3|0,a=cs[ai],o=cs.filter((c,i)=>i!==ai);
  const T=pickL([`Cut the ${a[0]} thread.`,`Only the ${a[0]} thread is safe.`,`Don't cut the ${o[0][0]} or the ${o[1][0]} thread.`,`The ${o[0][0]} and ${o[1][0]} threads are traps!`]);
  const o2=C.ov(`<div class="dgev"><div class="dgei">🧵</div><b>糸で しばられた 宝箱</b><div class="dgeb"><p>メモが はさまっている。</p><p class="en dgsign">"${esc(T)}"</p><p class="dghint">どの 色の 糸を 切る？</p></div><div class="dgthr">${cs.map((c,i)=>`<button data-t="${i}" style="--c:${c[2]}" aria-label="糸 ${i+1}"><i></i>✂️</button>`).join('')}</div></div>`,'dgov');o2.dataset.stay=1;
  o2.querySelectorAll('[data-t]').forEach(b=>b.onclick=()=>{const i=+b.dataset.t;C.closeOv();const jp=`<p class="dghint">"${esc(T)}"<br>${cs.map(c=>`${c[0]}＝${c[1]}`).join('・')}</p>`;
    if(i===ai){sf('correct');card('✂️','パチン！ ほどけた',`<p>正しい 糸だった！</p>${jp}`,[['あける',()=>chestOpen(1,go)]])}else{hurt(5,'');if(!D.fallen)card('💥','ボン！ わなの 糸だった',`<p>❤ -5</p>${jp}`,[['いたた…',go]])}})},
 /* 🌀 ふしぎな 魔法陣: 何階 動くかは 運しだい（上にも 下にも） */
 warp:go=>{tell('warp');card('🌀','ふしぎな 魔法陣','<p>床に 光る もようが ある。 のってみる？</p><p class="dghint">下へ 何階も 行けるかも… でも 上に もどされる ことも</p>',[['のる！',()=>{const n=pickL([-2,-1,1,2,2,3,3,4,5]);const to=Math.max(1,D.floor+n),d=to-D.floor;D.floor=to;sf(d>0?'coinIn':'wrong');
    card('🌀',d>0?`ぐるぐる… ${d}階 下へ！`:d<0?`あれれ… ${-d}階 上に もどされた`:'なにも おきなかった',`<p>いまは 地下${D.floor}階</p>`,[['つづける',go]])}],['のらない',go,'sub']])},
 /* 🌊 地下水: さけられない。 ❤を へらして 走るか、 回り道で ことばを 1つ ふやすか */
 flood:go=>{tell('flood');card('🌊','地下水が あふれてきた！','<p>道が 水びたし… どうする？</p>',[['🏃 走って ぬける（❤ -6）',()=>{hurt(6,'');if(!D.fallen)go()}],['🧗 回り道（ことば +1）',()=>{D.ws.push(...words5(D.floor).slice(0,1));H.toast('🧗 回り道… この 階は ことばが 1つ ふえた',2400);go()},'sub']])},
 /* 🧑‍🦰 まいごの 探検家 エマ: 英語の おねがいを 聞いて 持ち物を わたすと お礼 */
 /* 🗺️ 宝の 地図の かけら: 3まい（帰っても のこる）で 「宝の 地図の へや」が つぎの 分かれ道に 出る */
 mapp:go=>{const G=DG();G.mp=(G.mp||0)+1;save();sf('pickup');tell('mapp');
  if(G.mp>=3){G.mp=0;save();D.vault=1;try{SFX.fanfare(2)}catch(e){}return card('🗺️','地図が そろった！','<p>3まいの かけらを ならべると… <b>宝の へや</b>の 場所が わかった！</p><p class="dghint">つぎの 分かれ道に 🗺️ が 出るよ</p>',[['いそごう！',go]])}
  card('🗺️','宝の 地図の かけら',`<p>古い 地図の 切れはし。 <b>${G.mp} / 3</b></p><p class="dghint">3まい そろうと 宝の へやへ 行ける（帰っても のこる）</p>`,[['しまう',go]])},
 /* 🐈 坑道ねこ: 食べ物を あげると ついてくる。 階段の たびに なにか くわえてくる */
 cat:go=>{tell('cat');let F=[];try{F=FOOD.bagList()}catch(e){}try{H.say('es','Meow?')}catch(e){}
  card('🐈','坑道ねこが こっちを 見ている','<p class="en">"Meow?"</p><p>おなかが すいている みたい…</p>',[...(F.length?[[`${F[0].ico} ${esc(F[0].n)}を あげる`,()=>{FOOD.take(F[0].id);D.pet='cat';try{DGART.setPet('cat')}catch(e){}sf('eat');
      card('🐈','ねこが ついてきた！','<p>この 回は いっしょに 下りてくれる。 階段の たびに なにか 見つけてくるよ</p><p class="dgmio">📡 ミオ「<b>A cat? So cute! What\'s its name?</b>」<br><small>ねこ？ かわいい！ 名前は？</small></p>',[['よろしくね',go]]);try{MIO.say("A cat? So cute! What's its name?")}catch(e){}}]]:[]),
    ['なでる',()=>{const v=5+Math.floor(D.floor/4);D.got.coins+=v;sf('coin');card('🐈','ゴロゴロ…',`<p>ねこは 🪙${v}を おいて どこかへ 行った</p>${F.length?'':'<p class="dghint">食べ物が あったら ついてきたかも</p>'}`,[['またね',go]])},'sub']])},
 /* ⏱️ 落盤カウントダウン: 3問を 時間内に。 ぜんぶ 正解で 大きな 宝石 */
 rush:go=>{tell('rush');const lim=27000,t0=Date.now();let n=0,ok=0,over=false;sf('wrong');
  const g=gov('⏱️','落盤だ！ 天井が くずれてくる！','<p>3問 答えて 宝石を ほりだして にげろ！</p><div class="dgtime"><i></i></div><p class="dgrc">0 / 3</p>','rush');const bar=g.o.querySelector('.dgtime i');
  const tk=setInterval(()=>{if(over)return clearInterval(tk);const r=1-(Date.now()-t0)/lim;if(bar)bar.style.width=Math.max(0,r*100)+'%';if(r<=0){end()}},100);
  const end=()=>{if(over)return;over=true;clearInterval(tk);C.closeOv();
    if(ok===3){const v=Math.round((30+D.floor*2.5)*luck()*(D.b.mag?1.5:1));D.got.coins+=v;try{SFX.fanfare(2)}catch(e){}card('💎','まにあった！',`<p>3問 ぜんぶ 正解！ 🪙 ${v} ぶんの 宝石</p>`,[['ふう！',go]])}
    else{const v=Math.round((8+D.floor)*ok);D.got.coins+=v;hurt(5,'');if(!D.fallen)card('💥','ゴゴゴ… ぎりぎり にげた',`<p>${ok}問 正解${v?` ・ 🪙${v}`:''} ・ ❤ -5</p>`,[['あぶなかった',go]])}};
  const next=()=>{if(over)return;if(n>=3)return end();quickQ(g.q,r=>{if(over)return;n++;if(r)ok++;else return end();const e=g.o.querySelector('.dgrc');if(e)e.textContent=`${ok} / 3`;setTimeout(next,150)})};
  next()},
 /* 🦴 ことばの 化石: この 回の ことばの 文字が ばらばらに。 ならべかえて ほりだす */
 fossil:go=>{const id=revW(),I=C.info(id);if(!I||!window.ORE||!ORE.okWord(I))return EV.rune(go);tell('fossil');
  const g=gov('🦴','ことばの 化石が うまっている','<p>文字が ばらばらに なっている。 ならべて ほりだそう</p>');
  ORE.arrangeQ(I,g.q,'arr',ok=>{try{C.record(id,ok)}catch(e){}C.closeOv();if(ok){const v=Math.round((20+D.floor*1.5)*luck());D.got.coins+=v;let it='';if(Math.random()<.35){const t=giveIt();it=` ・ ${t.ico} ${t.n}`}sf('coinIn');card('🦴','きれいに ほりだせた！',`<p class="en">${esc(word(I))}</p><p>${esc(String(I.ja).split(/[、,]/)[0])}</p><p>🪙 +${v}${it}</p>`,[['つづける',go]])}
    else card('🦴','くだけちゃった…',`<p class="en">${esc(word(I))}</p><p>${esc(String(I.ja).split(/[、,]/)[0])}</p>`,[['ざんねん',go]])},{quiet:1})},
 /* 🔤 古代文字の かべ: 正しい つづりの 石を おすと かくし金庫が ひらく */
 rune:go=>{tell('rune');const id=revW(),I=C.info(id);if(!I)return go();const q=C.quiz(id,{type:/^[a-z]{3,}$/.test(I.h)?'spell':'rev'});
  const g=gov('🔤','古代文字の かべ','<p>石が 4つ。 正しい つづりの 石を おせ…</p>','rune');
  C.ask(g.q,q,r=>{const ok=r.ok&&!r.hint;try{C.record(id,ok)}catch(e){}C.closeOv();if(ok){sf('correct');card('🔤','ゴゴゴ… かべが ひらいた！','<p>かくし金庫だ！</p>',[['あける',()=>chestOpen(2,go)]])}else{hurt(4,'');if(!D.fallen)card('🏹','ヒュッ！ 矢が とんできた','<p>❤ -4</p>',[['いたた…',go]])}},{tag:'🔤',fast:1})},
 story:go=>storyEv(go),
 lost:go=>{tell('lost');const N=pickL(LOST_ASK),have=N.has();try{H.say('es',N.en)}catch(e){}
  card('🧑‍🦰','まいごの 探検家 エマ',`<p class="en">"${esc(N.en)}"</p><p class="dghint">${esc(N.ja)}</p>`,[...(have?[[`${have.ico} ${esc(have.n)}を わたす`,()=>{have.give();const v=Math.round((40+D.floor*2)*luck()),t=giveIt(itemPick(['potion','candle','firefly']));D.got.coins+=v;D.b.see=1;try{SFX.fanfare(2)}catch(e){}
      card('🧑‍🦰','"Thank you so much!"',`<p>ほんとうに ありがとう！</p><p class="en">"Take this. And the next path… I know where the gold is!"</p><p class="dghint">これ あげる。 つぎの 分かれ道… 金の ありかを 知ってるの！</p><p>🪙 +${v} ・ ${t.ico} ${t.n} ・ 🕯️ つぎの 分かれ道が 見える</p>`,[['よかった！',go]]);try{H.say('es','Thank you so much!')}catch(e){}}]]:[]),
    [have?'"Sorry…"（わたさない）':'"Sorry, I don\'t have one."',()=>{card('🧑‍🦰','"That\'s OK. Good luck!"','<p>だいじょうぶ。 がんばってね！</p><p class="dghint">（おねがいの 物を もっていれば お礼が もらえたかも）</p>',[['つづける',go]])},'sub']])}};
const SIGNS=[["Gold is on the left.","金は 左に ある。",'L'],["Danger! Do not go right.","きけん！ 右へ 行くな。",'L'],["The right tunnel is safe.","右の トンネルは あんぜん。",'R'],["Bats live in the left cave.","左の ほら穴には コウモリが すんでいる。",'R'],["Turn right for the treasure room.","宝の へやは 右へ。",'R'],["Keep left. The right path is broken.","左を 行け。 右の 道は こわれている。",'L'],["No entry on the left.","左は 立ち入り禁止。",'R'],["Water ahead on the right. Go left.","右は この先 水。 左へ 行け。",'L'],["The way to the gems: right.","宝石への 道: 右。",'R'],["Don't turn left. Rocks may fall.","左に 曲がるな。 石が 落ちるかも しれない。",'R'],["Left: snakes. Right: diamonds.","左: へび。 右: ダイヤモンド。",'R'],["The old miners hid their coins on the left.","昔の 鉱夫たちは 左に コインを かくした。",'L'],["Closed for repairs. Use the right path.","修理中。 右の 道を 使って ください。",'R'],["Beware of the right tunnel at night.","夜は 右の トンネルに 気をつけろ。",'L']];
const COLORS=[['red','赤','#e84a4a'],['blue','青','#3f6fe0'],['green','緑','#3fb860'],['yellow','黄色','#f0d040'],['white','白','#f6f6f6'],['black','黒','#1c1c1c'],['pink','ピンク','#f590c8'],['purple','むらさき','#9a5ae0'],['orange','オレンジ','#f08a20'],['brown','茶色','#8a5a2a']];
/* エマの おねがい（has() = わたせる 物 {ico,n,give} か null） */
const LOST_ASK=[
 {en:"I'm so hungry… Do you have any food?",ja:"おなかが ぺこぺこ… 何か 食べ物 ある？",has:()=>{try{const L=FOOD.bagList();if(!L.length)return null;const s=L[0];return {ico:s.ico,n:s.n,give:()=>FOOD.take(s.id)}}catch(e){return null}}},
 {en:"My lamp went out. Do you have a candle?",ja:"ランプが 消えちゃった。 ろうそく ある？",has:()=>itN('candle')?{ico:'🕯️',n:'青い ろうそく',give:()=>itTake('candle')}:null},
 {en:"I hurt my leg… Do you have any medicine?",ja:"足を けがしちゃった… くすり ある？",has:()=>itN('potion')?{ico:'🧪',n:'元気の くすり',give:()=>itTake('potion')}:itN('crystal')?{ico:'💠',n:'いやしの 結晶',give:()=>itTake('crystal')}:null},
 {en:"I'm lost. Do you have a compass?",ja:"道に まよったの。 コンパス もってる？",has:()=>itN('compass')?{ico:'🧭',n:'まよけの コンパス',give:()=>itTake('compass')}:null}];

/* ================================================================ 📖 エマの 冒険（11/23）: 深さごとの 7つの 章。 1回の もぐりで 1章まで。
   記録 DG().emma = 進んだ 章の 数（0〜7）。 章は 「見どころ」の できごとと して 出る（その 深さまで 来たら） */
const STORY=[
 {at:4,ico:'🧑‍🦰',t:'第1話 まいごの 探検家',lines:[['nar','','坑道の おくで、 ランプの 光が ゆれている…'],['emma',"Hi! I'm Emma. I'm an explorer!",'こんにちは！ わたし エマ。 探検家なの！'],['emma',"My grandpa went to the bottom of this mine. He was looking for the Star Stone.",'おじいちゃんは この 鉱山の いちばん 下へ 行ったの。 「星の 石」を さがして。'],['emma',"I found a page from his notebook. Can you read this word?",'おじいちゃんの ノートの 1ページを 見つけたの。 この ことば、 読める？']],
  task:'q',ok:"You can read it! You're so smart!",okj:'読めた！ すごい！',ng:"Hmm… Let's learn it together!",ngj:'うーん… いっしょに 覚えよう！',
  after:[['mio',"Boss, who is that? A new friend?",'店長、 その子 だれ？ 新しい 友だち？'],['emma',"Let's meet again deeper down. Bye!",'もっと 下で また 会おうね。 バイバイ！']],give:{mp:1}},
 {at:33,ico:'⛏️',t:'第2話 おじいちゃんの つるはし',lines:[['emma',"Look! It's my grandpa's pickaxe!",'見て！ おじいちゃんの つるはしだ！'],['emma',"But it's stuck in the rock. Can you help me pull it?",'でも 岩に ささって ぬけないの。 いっしょに ひっぱって くれる？'],['nar','','2問 答えて、 「せーの」で ひっぱろう！']],
  task:'q2',ok:"We did it! Grandpa's pickaxe… Please use it.",okj:'やった！ おじいちゃんの つるはし… あなたが つかって。',ng:"It moved a little! Thank you. Take this anyway.",ngj:'ちょっと 動いた！ ありがとう。 これ、 もらって。',
  after:[['mio',"A golden pickaxe? Wow, it shines on my radio screen!",'金の つるはし？ 無線の 画面でも 光ってるよ！']],give:{it:'gpick'}},
 {at:63,ico:'💎',t:'第3話 うたう 水晶',lines:[['nar','','キーン… 水晶が ふるえて 音を 出している'],['emma',"Listen! The crystals are singing a word.",'聞いて！ 水晶が ことばを 歌ってる。'],['emma',"Grandpa wrote: 'Sing back, and the door opens.'",'おじいちゃんの メモ: 「歌いかえせば 扉が ひらく」']],
  task:'listen',ok:"The door is open! You have good ears.",okj:'扉が ひらいた！ いい 耳だね。',ng:"The crystals stopped… but look, one fell down!",ngj:'水晶が しずかに なった… でも 見て、 1つ 落ちてきた！',
  after:[['emma',"This crystal shows the future, Grandpa said.",'この 水晶は 未来が 見えるって、 おじいちゃんが 言ってた。']],give:{it:'orb'}},
 {at:103,ico:'🛶',t:'第4話 地底湖の ボート',lines:[['nar','','まっくらな 湖。 古い ボートが 1そう'],['emma',"I… I can't swim. I'm scared of the water.",'わたし… およげないの。 水が こわい。']],
  task:'choice',ch:[["Don't worry. I'm here.",'だいじょうぶ。 ぼくが いるよ。',"Thank you… OK, I'll try!",'ありがとう… うん、 がんばる！'],["Let's swim!",'およごうよ！',"Ha ha! No way! …But you made me laugh.",'あはは！ むり！ …でも 笑っちゃった。'],["I'm scared, too.",'ぼくも こわい。',"Really? Then let's be scared together.",'ほんと？ じゃあ いっしょに こわがろう。']],
  after:[['nar','','ギイ… ギイ… ボートを こいで 向こう岸へ'],['emma',"We made it! I found this on the shore.",'着いた！ 岸で これを 見つけたよ。'],['mio',"I was holding my breath the whole time!",'ずっと 息を とめて 聞いてたよ！']],give:{it:'crystal'}},
 {at:153,ico:'📓',t:'第5話 やけた ノート',lines:[['nar','','あつい 風。 溶岩の そばに 黒こげの ノート'],['emma',"It's Grandpa's notebook! But the words are burned…",'おじいちゃんの ノートだ！ でも 字が こげてる…'],['emma',"Can you put the letters back?",'文字を ならべなおせる？']],
  task:'arr',ok:"You fixed it! Now I can read it.",okj:'なおった！ これで 読める。',ng:"Almost! I think I can guess the rest.",ngj:'おしい！ あとは なんとか 読めそう。',
  after:[['emma',"'The Star Stone is below the old ruins.' …Let's go!",'「星の 石は 古い 遺跡の 下」… 行こう！']],give:{it:'tome'}},
 {at:203,ico:'🏛️',t:'第6話 遺跡の なぞなぞ',lines:[['nar','','大きな 石の 扉。 古い 英語が ほられている'],['emma',"There's a riddle! 'I have keys, but I can't open any doors. What am I?'",'なぞなぞだ！ 「わたしには 鍵（キー）が ある。 でも 扉は あけられない。 わたしは なに？」']],
  task:'riddle',ch:[['A piano.','ピアノ',1],['A door.','ドア',0],['A map.','地図',0]],ok:"A piano! Pianos have keys! The door is opening!",okj:'ピアノ！ ピアノには キー（鍵盤）が ある！ 扉が ひらく！',ng:"Hmm, no… Oh wait, a piano! Pianos have keys!",ngj:'うーん、 ちがう… あっ、 ピアノだ！ ピアノには キーが ある！',
  after:[['emma',"There's a crown inside. Grandpa left it for us.",'中に 王冠が ある。 おじいちゃんが のこして くれたんだ。']],give:{it:'crown'}},
 {at:303,ico:'🌟',t:'最終話 星の 石',lines:[['nar','','地下に 星空が ひろがっている。 その まん中で、 小さな 石が 光っていた'],['emma',"The Star Stone… We found it!",'星の 石… 見つけた！'],['emma',"There's a letter from Grandpa. 'To whoever finds this: words are the real treasure.'",'おじいちゃんの 手紙が ある。 「これを 見つけた 人へ: ことばこそ 本当の 宝物」'],['emma',"Thank you for coming all the way with me. You're my best partner!",'ここまで いっしょに 来てくれて ありがとう。 あなたは 最高の 相棒だよ！'],['mio',"Boss… I'm crying. Come home safe, OK?",'店長… ミオ、 泣いてる。 ぶじに 帰ってきてね？']],
  task:'none',after:[],give:{it:'star',it2:'dscale',end:1}}];
const storyReady=()=>{const k=DG().emma||0;return k<STORY.length&&D&&D.floor>=STORY[k].at};
function storyEv(go){const k=DG().emma||0,S=STORY[k];if(!S)return go();
  const g=gov(S.ico,`📖 エマの 冒険 ${esc(S.t)}`,'','story');
  const fin=ok=>{const after=[...(ok===true&&S.ok?[['emma',S.ok,S.okj]]:ok===false&&S.ng?[['emma',S.ng,S.ngj]]:[]),...S.after];g.q.innerHTML='';
    talkSeq(g,after,()=>{const G=DG();G.emma=k+1;save();const got=[];const v=Math.round((40+D.floor*2)*(ok===true?1.5:1));D.got.coins+=v;got.push(`🪙 ${v}`);
      if(S.give.mp){G.mp=(G.mp||0)+1;save();if(G.mp>=3){G.mp=0;save();D.vault=1;got.push('🗺️ 地図が そろった！ つぎの 分かれ道に 宝の へや')}else got.push(`🗺️ 地図の かけら ${G.mp}/3`)}
      ['it','it2'].forEach(f=>{const id=S.give[f];if(id){D.got.it[id]=(D.got.it[id]||0)+1;itAdd(id);got.push(`${DG_ITEMS[id].ico} ${DG_ITEMS[id].n}${isSp(id)?'（とくべつな 品！）':''}`)}});
      try{SFX.fanfare(S.give.end?3:2)}catch(e){}C.closeOv();
      card(S.give.end?'🌟':'📖',S.give.end?'エマの 冒険 おしまい':`${esc(S.t)} クリア`,got.map(x=>`<p class="dgloot">${x}</p>`).join('')+(S.give.end?'<p>🏅 称号「星の 探検家」</p>':`<p class="dghint">つぎの 章は 地下${STORY[k+1].at}階より 下で</p>`),[['つづける',go]],S.give.end?'sp':'boom');
      tell(S.give.end?'emmaEnd':k===0?'emma0':'emmaN')})};
  talkSeq(g,S.lines,()=>{
    if(S.task==='q')return quickQ(g.q,ok=>fin(ok));
    if(S.task==='q2'){let ok=0;return quickQ(g.q,a=>{ok+=a?1:0;setTimeout(()=>quickQ(g.q,b=>{ok+=b?1:0;fin(ok===2)}),250)})}
    if(S.task==='listen'){const id=revW(),I=C.info(id);if(!I)return fin(true);const q=C.quiz(id,{type:ST.sound?'listen':'rev'});return C.ask(g.q,q,r=>{const ok=r.ok&&!r.hint;try{C.record(id,ok)}catch(e){}fin(ok)},{tag:'💎',fast:1})}
    if(S.task==='arr'){const id=revW(),I=C.info(id);if(!I||!window.ORE||!ORE.okWord(I))return quickQ(g.q,ok=>fin(ok));return ORE.arrangeQ(I,g.q,'arr',ok=>{try{C.record(id,ok)}catch(e){}fin(ok)},{quiet:1})}
    if(S.task==='choice')return btnsIn(g.b,S.ch.map(c=>[`"${esc(c[0])}"<small>${esc(c[1])}</small>`,()=>{g.b.innerHTML='';const box=g.body.querySelector('.dgtalk');box.insertAdjacentHTML('beforeend',`<div class="dgln me"><span class="dgwho">🙋 じぶん</span><p class="en">${esc(c[0])}</p></div>`);S.ok=c[2];S.okj=c[3];fin(true)},'sub']));
    if(S.task==='riddle')return btnsIn(g.b,S.ch.map(c=>[`"${esc(c[0])}"<small>${esc(c[1])}</small>`,()=>{g.b.innerHTML='';sf(c[2]?'correct':'wrong');fin(!!c[2])},'sub']));
    fin(null)})}
/* 🦷 ミミック: かぎを つかわずに あけた 宝箱が たまに にせもの。 合言葉（1問）で おとなしく なる */
function mimic(go){tell('mimic');try{SFX.boom()}catch(e){sf('wrong')}if(D)D.badT=Date.now();const g=gov('🦷','ミミックだ！ 宝箱が かみついてきた！','<p class="en">"Say the magic word!"</p><p class="dghint">合言葉を 言え！（正解すると おとなしく なって 宝を はきだす）</p>');
  quickQ(g.q,ok=>{C.closeOv();if(ok){sf('correct');card('🦷','ミミックが おとなしく なった','<p class="en">"OK, OK… take it!"</p><p>わかった わかった… もってけ！</p>',[['もらう',()=>chestOpen(2,go)]])}
    else{hurt(8,'');if(!D.fallen)card('🦷','ガブッ！','<p>❤ -8。 ミミックは にげていった…</p><p class="dghint">🗝️ かぎで あけた 宝箱は ミミックに ならないよ</p>',[['いたた…',go]])}})}
function chestOpen(tier,go){const got=[];const v=Math.round((25+D.floor*2)*tier*luck());D.got.coins+=v;got.push(`🪙 ${v}`);
  if(Math.random()<(tier>1?.6:.25)){const id=itemPick();D.got.it[id]=(D.got.it[id]||0)+1;itAdd(id);got.push(`${DG_ITEMS[id].ico} ${DG_ITEMS[id].n}`)}
  if(window.FOOD&&typeof FOOD_SNACKS!=='undefined'&&Math.random()<.35){const ids=Object.keys(FOOD_SNACKS).filter(k=>FOOD_SNACKS[k].lv!=='hs');const f=pickL(ids);if(f){FOOD.add(f);got.push(`${FOOD_SNACKS[f].ico} ${FOOD_SNACKS[f].n}`)}}
  if(tier>1&&Math.random()<.4){const id=oreWord(D.floor,true);if(id){D.got.ore.push(id);got.push('🪨 原石')}}
  if(tier>1&&Math.random()<.04){const sid=pickL(SPECIAL);D.got.it[sid]=(D.got.it[sid]||0)+1;itAdd(sid);got.push(`✨ ${DG_ITEMS[sid].ico} ${DG_ITEMS[sid].n}（とくべつな 品！）`);tell('special')}
  try{SFX.fanfare(tier)}catch(e){sf('coinIn')}card(tier>1?'🎆':'🎉',tier>1?'ごうかな 宝箱の 中身！':'宝箱の 中身',got.map(g=>`<p class="dgloot">${g}</p>`).join(''),[['やった！',go]],tier>1?'boom':'')}
/* わな（must = さけられない） */
const TRAPS=[
 {n:'落石',f:go=>{hurt(8,'');if(!D.fallen)card('🪨','ゴゴゴ… 落石！','<p>"Watch out!" ❤ -8</p>',[['いたた…',go]])}},
 {n:'くずれる 床',must:1,f:go=>{hurt(12,'');if(!D.fallen)card('🕳️','床が くずれた！','<p>さけようが なかった… ❤ -12</p><p>でも 1階 下に 落ちた（ちょっと 得？）</p>',[['いたた…',()=>{D.floor++;go()}]])}},
 {n:'コウモリの むれ',f:go=>{const l=Math.floor(D.got.coins*.2);D.got.coins-=l;sf('pop');card('🦇','コウモリの むれ！',`<p>バサバサ！ 🪙${l} ぶん おとしちゃった</p>`,[['もう…',go]])}},
 {n:'ねむり ガス',must:1,f:go=>{hurt(5,'');if(!D.fallen)card('💤','あまい ガス…','<p>ふらふら… ❤ -5。 さけられない しかけだった</p>',[['しっかり！',go]])}},
 {n:'まよいの 道',must:1,f:go=>{card('🌀','道に まよった！','<p>同じ ところを ぐるぐる… この 階は ことばが 1つ ふえる</p>',[['がんばる',()=>{D.wi=Math.max(0,D.wi-1);D.ws[D.wi]=words5(D.floor)[0];go()}]])}},
 {n:'あなの わな',f:go=>{hurt(6,'');if(!D.fallen)card('⚠️','あなに 落ちた！','<p>"Ouch!" ❤ -6</p>',[['よいしょ',go]])}},
 {n:'へび',q:1,f:go=>{const g=gov('🐍','へびが 道に いる！','<p>大きな 声で 英語を 言えば にげていく かも… 1問 答えて！</p>');quickQ(g.q,ok=>{C.closeOv();if(ok){sf('correct');card('🐍','"Shoo!" にげていった','<p>こわかった…</p>',[['ふう',go]])}else{hurt(6,'');if(!D.fallen)card('🐍','かまれた！','<p>❤ -6</p>',[['いたた…',go]])}})}},
 {n:'あつい 蒸気',must:1,f:go=>{const c=D.combo;D.combo=0;sf('wrong');card('♨️','シューッ！ あつい 蒸気','<p>びっくりして 手が とまった…</p><p>'+(c>=2?`🔥${c}れんさが 0に もどった`:'けがは なかった')+'</p>',[['あちち',go]])}}];
const ECHO=[["Keep going!","がんばって！"],["You can do it!","きみなら できる！"],["Who's there?","だれか いるの？"],["Deeper, deeper…","もっと 深く…"],["Don't give up!","あきらめないで！"],["The treasure is close.","宝は 近い。"],["Watch your step.","足もとに 気をつけて。"],["Turn back!","引きかえせ！"],["I'm hungry…","おなかが すいた…"],["It's so dark here.","ここは とても 暗い。"],["Is it raining outside?","外は 雨？"],["Take a break.","ひと休み しよう。"],["I lost my key.","かぎを なくした。"],["See you later!","またね！"]];

/* ================================================================ 🎒 アイテム（いつでも） */
function bag(){const own=Object.keys(DG_ITEMS).filter(itN),F=window.FOOD?FOOD.bagList():[],T=window.MINE?MINE.toolList().filter(t=>TL_S[t.id]):[];
  const o=C.ov(`<div class="dgbagov"><b>🎒 アイテム</b><p class="note">❤${hp()} / ${HPMAX}</p>
    ${own.length?`<p class="dglbl">⛏️ ここだけの アイテム</p>${own.map(id=>`<button class="dgit ${isSp(id)?'sp':''}" data-it="${id}"><span>${DG_ITEMS[id].ico}</span><b>${DG_ITEMS[id].n} ×${itN(id)}</b><small>${esc(DG_ITEMS[id].s)}</small></button>`).join('')}`:''}
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
  if(id==='firefly'){const box=D.qbox;const q=box&&box._q;if(!q||!box.isConnected||box.querySelector('.cgqc button:disabled')){H.toast('🫙 えらぶ 問題の ときに つかおう');return}if(!itTake(id))return;C.closeOv();
    H.shuffle([...box.querySelectorAll('.cgqc button')].filter(b=>+b.dataset.i!==q.ans)).slice(0,2).forEach(b=>{b.disabled=true;b.classList.add('dgfade')});sf('pickup');H.toast('🫙 ほたるが まちがいを 2つ 消した',1800);return}
  if(id==='bomb'){if(D.st!=='branch'){H.toast('💣 分かれ道で つかおう<small>かべを こわして わなの ない かくし部屋へ</small>',3000);return}C.closeOv();return blast()}
  if(id==='dscale'){H.toast('🐉 もっているだけで OK<small>❤0に なったら 1回だけ 立ちあがれる</small>',3000);return}
  if(id==='tome'){if(!itTake(id))return;C.closeOv();let c=0;for(let i=0;i<3;i++){const w=oreWord(D.floor,true);if(w){D.got.ore.push(w);c++}}try{SFX.fanfare(1)}catch(e){}H.toast(`📕 古文書を ひらいた！<small>🪨 原石が ${c}こ 出てきた</small>`,3000);return}
  if(id==='dice'){H.toast('🎲 もっているだけで OK<small>わなが 出たら ふりなおすか きいてくるよ</small>',3000);return}
  if(id==='orb'){if(!itTake(id))return;C.closeOv();sf('pickup');if(D.st==='floor'){preRoll(D.wi);H.toast('🔮 この 階の できごとが 見えた！<small>ことばの 列の 絵を 見てね</small>',2600);const ln=document.querySelector('.dglane');if(ln){const t=document.createElement('div');t.innerHTML=hdr();const nl=t.querySelector('.dglane');if(nl)ln.replaceWith(nl)}}else{D.b.orb=1;H.toast('🔮 つぎの 階で 見えるよ',2200)}tell('orb');return}
  if(!itTake(id))return;C.closeOv();sf('pickup');
  ({compass:()=>{itAdd('compass');H.toast('🧭 コンパスは もっているだけで わなを 1回 よけるよ')},clover:()=>{D.b.clover+=3},mirror:()=>{D.b.twin=1;tell('mirror')},crown:()=>{D.b.crown=1},hglass:()=>{D.b.feather+=5},star:()=>{D.b.star=1},tear:()=>{setHp(HPMAX);D.b.beads=1},beads:()=>{D.b.beads=1},gpick:()=>{D.b.gpick=1},crystal:()=>setHp(HPMAX),candle:()=>{D.b.see=1},feather:()=>{D.b.feather+=3},okey:()=>{itAdd('okey');H.toast('🗝️ かぎは 扉や 宝箱で 自動で つかうよ')},potion:()=>setHp(Math.min(HPMAX,hp()+40)),charm:()=>{D.b.charm=1}}[id]||(()=>{}))();
  if(id!=='compass'&&id!=='okey')H.toast(`${DG_ITEMS[id].ico} ${DG_ITEMS[id].n}を つかった`);upd()}
function upd(){const e=document.querySelector('.dghp');if(e){const h=hp();e.textContent='❤'+h;e.classList.toggle('low',h<=15)}}

/* ================================================================ 階段 → 休憩所 */
function stairs(){if(!D)return;D.pre=null;if(D.floor%10===0&&D.bossAt!==D.floor){D.bossAt=D.floor;return boss(()=>{if(!D||D.fallen)return;D.floor++;rest()})}D.floor++;rest()}
/* ================================================================ 👑 階の ぬし（10階ごと・11/23） 
   1問 正解で 1ダメージ。 弱点＝この 回に まちがえた ことば（正解すると 2ダメージ）。 まちがえると ❤が へる。 いつでも にげられる（ごほうび なし） */
const BOSSES=[['🐛','大ミミズ','Big Worm'],['🦀','岩ガニ','Rock Crab'],['🦂','水晶サソリ','Crystal Scorpion'],['🐙','地底ダコ','Lake Octopus'],['🦎','溶岩トカゲ','Lava Lizard'],['🗿','古代の 守護神','Ancient Guardian'],['🐋','星くじら','Star Whale']];
const BOSS_TALK={hi:[["You shall not pass!","ここは 通さん！"],["Who dares to dig here?","ここを ほるのは だれだ？"],["Show me your words!","おまえの ことばを 見せてみろ！"]],
 hurt:[["Ouch! Not bad!","いたっ！ やるな！"],["Grr… lucky shot!","ぐぬぬ… まぐれだ！"],["What?! You know that word?","なに？！ その ことばを 知っているのか？"]],
 laugh:[["Ha! Wrong!","はっ！ まちがいだ！"],["Is that all you've got?","それで おしまいか？"]],
 lose:[["I… I lost… You are strong.","ま… まけた… おまえは 強い。"],["Take my treasure. You earned it.","宝を もっていけ。 おまえの ものだ。"]]};
function boss(go){const zi=window.DGART?DGART.zoneI(D.floor):Math.min(6,D.floor/50|0),B=BOSSES[zi],max=Math.min(8,4+Math.floor(D.floor/50));let bh=max,n=0;
  /* 見せ場: 画面が くらく なって WARNING → 地ひびき → ぬしが 落ちてくる */
  const w=document.createElement('div');w.className='dgwarn';w.innerHTML=`<div class="dgwb"><b>⚠ WARNING ⚠</b><small>地下${D.floor}階の ぬし が あらわれた</small></div>`;document.body.appendChild(w);
  try{SFX.thunder()}catch(e){}setTimeout(()=>{try{SFX.rumble()}catch(e){}},500);
  setTimeout(()=>{w.remove();fight()},1700);
  function fight(){if(!D)return;tell('boss');
  const g=gov(`<span class="dgboss enter">${B[0]}</span>`,`👑 ぬし 「${B[1]}」<small class="dgben">${B[2]}</small>`,'','boss');const ico=g.o.querySelector('.dgboss');try{SFX.boom(1)}catch(e){}
  const say=L=>{try{H.say('es',L[0])}catch(e){}return `<p class="en">"${esc(L[0])}"</p><p class="dghint">${esc(L[1])}</p>`};
  const bar=()=>`<div class="dgbbar"><i style="width:${bh/max*100}%"></i><span>${bh} / ${max}</span></div>`;
  let talk=say(pickL(BOSS_TALK.hi));
  const draw=()=>{g.body.innerHTML=bar()+talk+(D.missed.length?'<p class="dghint">💥 弱点: きょう まちがえた ことば（正解で 2ダメージ）</p>':'');g.q.innerHTML='';
    btnsIn(g.b,[['⚔️ こうげき（1問）',atk],['🏃 にげる',()=>{C.closeOv();card('🏃','にげきった…','<p>ぬしは 追ってこなかった。 宝は なし</p>',[['つぎへ',go]])},'sub']])};
  const atk=()=>{g.b.innerHTML='';n++;const weak=D.missed.length&&n%2===0?pickL(D.missed):null;if(weak)g.body.insertAdjacentHTML('beforeend','<p class="dgweak">💥 弱点の ことば！</p>');
    quickQ(g.q,ok=>{if(!D)return;const st=g.o.querySelector('.dgstage');if(ok){const dm=weak?2:1;bh=Math.max(0,bh-dm);try{SFX[dm>1?'shatter':'clap']()}catch(e){sf('knock')}if(ico){ico.classList.remove('hit','enter','atk');void ico.offsetWidth;ico.classList.add('hit')}try{DGART.burst(dm>1?24:12,['#ffe080','#fff','#ff7a40'],150,30)}catch(e){}
        if(bh<=0)return win();talk=say(pickL(BOSS_TALK.hurt))+(dm>1?'<p class="dgweak">💥 2ダメージ！</p>':'')}
      else{const d=6+Math.floor(D.floor/25);if(ico){ico.classList.remove('hit','enter','atk');void ico.offsetWidth;ico.classList.add('atk')}if(st){st.classList.remove('bad');void st.offsetWidth;st.classList.add('bad')}try{SFX.boom()}catch(e){}hurt(d,'');if(D.fallen){C.closeOv();return}talk=say(pickL(BOSS_TALK.laugh))+`<p class="dghint">❤ -${d}</p>`}
      setTimeout(draw,300)},weak)};
  const win=()=>{if(ico){ico.classList.remove('hit','enter','atk');void ico.offsetWidth;ico.classList.add('die')}try{SFX.shatter();SFX.boom(1)}catch(e){}try{DGART.burst(40,['#ffe080','#fff','#ff7a40','#ff4a4a'],150,30)}catch(e){}g.b.innerHTML='';setTimeout(win2,1100)};
  const win2=()=>{C.closeOv();const v=Math.round((60+D.floor*3)*luck()),got=[`🪙 ${v}`];D.got.coins+=v;
    const t=giveIt(itemPick(['potion','candle','firefly','okey','compass','beads']));got.push(`${t.ico} ${t.n}`);
    for(let i=0;i<2;i++){const id=oreWord(D.floor,true);if(id){D.got.ore.push(id);got.push('🪨 原石')}}
    if(window.CARDS&&CARDS.find1&&Math.random()<.3){const c=CARDS.find1(D.floor/3+8);D.got.cards.push('t:'+c.c.e);got.push('🎁 宝カード！')}
    if(Math.random()<.15){const sid=pickL(SPECIAL);D.got.it[sid]=(D.got.it[sid]||0)+1;itAdd(sid);got.push(`✨ ${DG_ITEMS[sid].ico} ${DG_ITEMS[sid].n}（とくべつな 品！）`);tell('special')}
    const G=DG();G.boss=(G.boss||0)+1;save();try{SFX.fanfare(3)}catch(e){}
    card(B[0],`「${B[1]}」に 勝った！`,say(pickL(BOSS_TALK.lose))+got.map(x=>`<p>${x}</p>`).join('')+`<p class="dgmio">📡 ミオ「<b>You beat the boss?! You're my hero!</b>」<br><small>ぬしに 勝ったの？！ さすが 店長！</small></p>`,[['やった！',go]],'boss');
    try{MIO.say("You beat the boss?! You're my hero!")}catch(e){}
    if(G.boss===1)setTimeout(()=>{const [,tx]=ML('dg_bossWin');if(tx)H.toast(`${MICO()} <b>ミナ先生</b><small>${esc(tx)}</small>`,5200)},1400)};
  draw()}}
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
const giveIt=id=>{id=id||itemPick();D.got.it[id]=(D.got.it[id]||0)+1;itAdd(id);return DG_ITEMS[id]};
/* その 休憩所の 3つの えらびかた: [ico, 名前, せつめい, する こと(done)] */
function restOpts(R,f){const cv=25+f*2;
  if(R.k==='fire')return [['❤','ゆっくり 休む','❤ +6',d=>{d(heal(6))}],['🎒','まわりを さがす','アイテムを 1つ',d=>{const t=giveIt();d(`${t.ico} ${t.n}を 見つけた！`)}],['📦','宝箱を あける','たき火の そばの 古い 箱',d=>chestOpen(1,()=>d(''))]];
  if(R.k==='spring')return [['💧','たっぷり のむ','❤ +15',d=>{d(heal(15))}],['🧪','びんに くむ','🧪 元気の くすりを 1つ',d=>{const t=giveIt('potion');d(`${t.ico} ${t.n}を 手に 入れた`)}],['💎','泉の 底を さがす','宝石が しずんでいる かも',d=>{const v=Math.round((20+f*2)*luck());D.got.coins+=v;sf('coin');d(`💎 🪙${v} ぶんの 宝石！`)}]];
  if(R.k==='mole'){const k1=itemPick(),ks=[k1,itemPick([k1])],pr=k=>30+Math.floor(f/2)+((DG_ITEMS[k].r||1)-1)*10;
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
      const id=oreWord(f,true);if(id&&Math.random()<.5){D.got.ore.push(id);sf('pickup');return d('🪨 井戸の 底から 原石が！')}
      const v=c*(big?4:5);D.got.coins+=v;return d(`💰 金貨が あふれた！ 🪙${v}`)};
    return [['🪙','🪙10を 投げる','小さな 願いごと',wish(10)],['💰','🪙50を 投げる','大きな 願いごと（いいことが おきやすい）',wish(50,1)],
      ['👀','のぞきこむ','ただ。 なにか 見える かも',d=>{if(Math.random()<.35){const v=10+f;D.got.coins+=v;sf('coin');d(`🪙 ふちに 金貨が ひっかかっていた！ 🪙${v}`)}else{try{H.say('es','Hello… hello…')}catch(e){}d('🗣️ "Hello… hello…" こだまが かえってきた')}}]]}
  /* radio */
  return [['🗺️','つぎの 階の ヒント','分かれ道の 中身が 見える',d=>{D.b.see=1;d('📡 "The left path looks shiny!" つぎの 分かれ道が 見えるよ')}],['❤','ミオの 応援','❤ +8',d=>{sf('eat');d(heal(8))}],
    ['🥪','補給を たのむ','食べ物を 1つ',d=>{let got='';try{const ids=Object.keys(FOOD_SNACKS).filter(k=>FOOD_SNACKS[k].lv!=='hs');const k=pickL(ids);FOOD.add(k);got=`${FOOD_SNACKS[k].ico} ${FOOD_SNACKS[k].n}`}catch(e){}if(!got)return d(heal(8));d(`📦 ${got}が とどいた！`)}]]}
function rest(skip){if(!D)return;const G=DG(),f=D.floor;D.b.luck=0;D.b.mag=0;D.b.charm=0;D.b.beads=0;D.b.gpick=0;D.st='rest';D.pre=null;
  let ck='';if(f%100===0&&!G.ck[f]){G.ck[f]=1;ck=`<p class="dgckn">🪜 地下${f}階の 区切りが ひらいた！ 次からは コインで ここから はじめられる</p>`;try{SFX.fanfare(3)}catch(e){}}
  if(f>G.best)G.best=f;save();
  const R=pickRest(),opts=restOpts(R,f),g=D.got;let picked='';
  /* 階段の わきの 原石（11/23: 2わり → 3わり半） */
  let ore1=false;if(!skip&&Math.random()<.35){const id=oreWord(f,true);if(id){g.ore.push(id);ore1=true}}
  /* 🐈 ねこの おみやげ */
  let petL='';if(D.pet){const r=Math.random();if(r<.45){const v=10+Math.floor(f/2);g.coins+=v;petL=`🐈 ねこが 🪙${v}を くわえてきた`}else if(r<.65){const id=oreWord(f,true);if(id){g.ore.push(id);petL='🐈 ねこが 🪨原石を ころがしてきた'}}else if(r<.8){const t=giveIt();petL=`🐈 ねこが ${t.ico} ${t.n}を 見つけてきた`}else petL=pickL(['🐈 ねこは あくびを した','🐈 ねこは 足もとで まるくなった','🐈 "Meow!" ねこは 元気そう'])}
  const fresh=!G.restTold;if(fresh){G.restTold=1;save()}
  function draw(){const cost=stepCost(f),lowHp=hp()<=cost*2,L=R.k==='radio'?pickL(RADIO_MIO):pickL(lowHp?REST_MIO_LOW:REST_MIO);
    const smoke=R.k==='fire'&&D.missed.length?`<div class="dgsmoke"><small>💨 けむりに うかぶ きょう まちがえた ことば（タップで カード）</small>${D.missed.slice(-8).map((id,i)=>{const I=C.info(id);return I?`<button class="dgsw" data-sw="${esc(id)}" style="--d:${i*.6}s">${esc(I.h||I.en)}<small>${esc(String(I.ja).split(/[、,]/)[0])}</small></button>`:''}).join('')}</div>`:'';
    H.show('cg',`<section class="pnl cgp shp dgp" data-stay>${hdr()}
    <div class="dgscene dgart dgbr dgrst"><span class="dgzn">🏕️ 休憩所</span><span class="dgract">${R.ico}</span></div>
    <div class="dgrest ${R.k}"><b>地下${f}階の 休憩所 ・ ${R.n}</b><small>${esc(R.s)}</small></div>${ck}${smoke}
    ${R.k==='mole'||R.k==='shrine'?'':`<div class="kmina mnmio"><span class="lface">${MIO.face('smile')}</span><p>📡 <b>${esc(L[0])}</b><br><small>${esc(L[1])}</small></p></div>`}
    ${picked?`<p class="dgpicked">${picked}</p>`:`<p class="dglbl">ひとつだけ えらべる</p><div class="dgopts">${opts.map((o,i)=>`<button class="dgopt" data-o="${i}"><span>${o[0]}</span><b>${esc(o[1])}</b><small>${esc(o[2])}</small></button>`).join('')}</div>`}
    <p class="dgsum">ここまで: 🪙${g.coins} ${g.ore.length?`・ 🪨原石 ${g.ore.length}`:''} ${g.cards.length?`・ 🎁宝カード ${g.cards.length}`:''} </p>${Object.keys(g.it).some(k=>g.it[k]>0)?`<div class="dgchips"><small>拾った アイテム（タップで せつめい）</small>${itChips(g.it)}</div>`:''}
    ${ore1?`<p class="dgore1">🪨 階段の わきで 原石を 見つけた！</p>`:''}${petL?`<p class="dgore1">${petL}</p>`:''}
    <button id="dgdown" class="mngo"><span class="mngoi">⬇️</span><span class="mngot2">地下${f}階へ すすむ</span><small>❤ -${cost}</small></button>
    ${footRow('🏠 帰る（ぜんぶ もちかえる）','dgback')}</section>`);
    bindTop();$('dgback').onclick=()=>{sf('step');finish('home')};try{DGART.mount(H.panel.querySelector('.dgrst'),{f,path:'',stage:1,pet:D.pet})}catch(e){}
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
  if(d.floor>G.best)G.best=d.floor;const newC=d.cmax>=5&&d.cmax>(G.bestC||0);if(d.cmax>(G.bestC||0))G.bestC=d.cmax;
  if(g.coins)H.addCoins(g.coins);
  let oreN=0,polN=0;g.ore.forEach(id=>{try{const p=isPol(id);if(window.ORE&&ORE.fromMine(id)){oreN++;if(p)polN++}}catch(e){}});
  g.cards.forEach(id=>{try{SHOP.bookRec()[id]=1}catch(e){}});save();
  try{const M=MINE.rec();M.dives=(M.dives||0)+1;if(d.floor>(M.bestF||0))M.bestF=d.floor;save()}catch(e){}
  try{RECENT.add('mine',{depth:d.floor,best:G.best,fl:d.floor,bestF:G.best,ok:d.ok,q:d.q,cards:g.cards.concat(g.ore),rare:g.cards.length>0,coins:g.coins,hp:why==='fall'?'hp':'',chest:0,bad:0,used:[],story:0})}catch(e){}
  const fall=why==='fall',it=Object.keys(g.it).filter(k=>g.it[k]>0);
  const [ex,tx]=ML(fall?'dg_fall':newC&&Math.random()<.6?'dg_backCombo':oreN?'dg_backOre':'dg_back',{f:d.floor,n:oreN,c:d.cmax});
  H.show('cg',`<section class="pnl cgp shp dgp">
    <div class="qtop"><span></span><b>${fall?'🏖️ 浜辺で 目が さめた…':'🎒 もちかえった'}</b><span class="qn">地下${d.floor}階まで</span></div>
    ${fall?`<p class="dgfall">たおれている ところを ミオに 見つけてもらった。 ❤10で 気が ついた</p>
      <div class="dglost"><b>なくした 物（半分）</b><p>${lost.coins?`🪙${lost.coins} `:''}${lost.ore.length?`🪨原石 ${lost.ore.length} `:''}${lost.cards.length?`🎁宝カード ${lost.cards.length} `:''}${Object.keys(lost.it).filter(k=>lost.it[k]).map(k=>DG_ITEMS[k].ico+'×'+lost.it[k]).join(' ')}${!lost.coins&&!lost.ore.length&&!lost.cards.length&&!Object.keys(lost.it).length?'なし':''}</p></div>`:''}
    <div class="mnres"><p>🪜 地下${d.from}階 → 地下${d.floor}階 ・ ${d.q}問中 <b>${d.ok}</b>問 正解</p>${d.cmax>=3?`<p>🔥 さいこう ${d.cmax}れんさ${newC?' <b class="mnnew">NEW!</b>':''}</p>`:''}
      <p>${g.coins?`🪙 +${g.coins} `:''}${oreN?`🪨 原石 ${oreN}こ `:''}${g.cards.length?`🎁 宝カード ${g.cards.length}まい `:''}</p>${it.length?`<div class="dgchips">${itChips(g.it)}</div>`:''}</div>
    ${g.cards.length?`<div class="mnhand sm">${g.cards.map(id=>`<div class="mnt" data-id="${esc(id)}">${C.face(id,{mini:1,marks:false})}</div>`).join('')}</div>`:''}
    ${oreN?`<p class="note">🪨 原石は お店の 下の 作業台で みがくと カードに なるよ${polN?`<br>📖 そのうち ${polN}こは ブックの ことば（3問 みがくだけで 売れる）`:''}</p>`:''}
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
 dg_music:[['smile','鉱山でも 音楽が ながせるように なったよ。 🎵 ボタンで オン・オフ、 曲も えらべるの'],['happy','好きな 曲を かけながら ほると、 ことばも 楽しく 覚えられるね']],
 dg_pol:[['point','これは 📖ブックに もう 記録してある ことばの 原石。 お店で 3問 みがくだけで 売れる カードに なるよ'],['smile','覚えた ことばも 鉱山で 見つかるの。 少し みがいて ふくしゅう しながら 売りものに しよう']],
 dg_upd2:[['wow','鉱山に 新しい しかけと アイテムが ふえたよ！ 🗿 番人・✨ 光る 鉱脈・🪧 英語の かんばん… 英語が わかるほど 得を するの'],['point','つづけて 正解すると 🔥れんさ。 5回ごとに ごほうびが あるよ。 あわてず ていねいに 答えてね']],
 dg_open3:[['smile','さいこうの 🔥れんさは {c}。 きょうは こえられるかな？'],['think','💣 ばくだんは 分かれ道で、 🔮 水晶は 階の はじめに つかうと いちばん 役に 立つよ']],
 dg_backCombo:[['wow','{c}れんさ！ 新記録だね。 つづけて 正解できるのは ちゃんと 覚えてる しょうこだよ'],['proud','🔥{c}れんさ、 すごい！ まちがえずに 答えられる ことばが ふえてきたね']],
 dg_combo:[['wow','5れんさ！ つづけて 正解すると 5回ごとに ごほうびが あるよ。 まちがえると 0から だから、 ゆっくり 考えてね'],['happy','🔥れんさが はじまったね！ ⛏️ 金の つるはしを つかうと ごほうびが 2ばいに なるよ']],
 dg_golem:[['point','ことばの 番人は、 この 回に 答えた ことばから 3問 出すの。 つまり ふくしゅう！ 3問 ぜんぶ 正解だと いい ものが もらえるよ'],['think','番人に 自信が なければ 回り道も あり。 ことばが 1つ ふえるけど、 それも 練習に なるね']],
 dg_vein:[['wow','光る 鉱脈！ 1問 答えるたびに 宝石が ふえるけど、 ほりすぎると くずれるの。 どこで やめるかが 勝負だよ'],['think','鉱脈は 「もう 1回」 が いちばん むずかしいね。 欲ばりすぎに 注意！']],
 dg_sign:[['smile','英語の かんばんだね。 left は 左、 right は 右。 Don\'t（〜するな）が あるかも よく 見てね'],['point','かんばんの 英語を 読めたら 宝の 道へ 行けるよ。 Danger（きけん）・safe（あんぜん）が ヒント！']],
 dg_thread:[['point','色の 名前は 英語でしか 書いてないよ。 Don\'t cut… なら 「切っては いけない」 色だから 気をつけて'],['smile','red・blue・green… 色の ことばは 小学生で 習うけど、 いざ 読むと まようよね']],
 dg_mimic:[['wow','ミミック！ 宝箱の ふりを した モンスターだよ。 🗝️ かぎで あけた 宝箱は ミミックに ならないの'],['think','"Say the magic word!" は 「合言葉を 言え！」。 正解すると 宝を はきだすよ']],
 dg_warp:[['think','魔法陣は 下へ 行けることが 多いけど、 上に もどされることも… 運だめしだね'],['smile','warp（ワープ）は 英語でも warp。 ゲームの ことばは 英語が もとの ものが 多いの']],
 dg_flood:[['point','地下水は さけられないの。 ❤を へらして 走るか、 回り道で ことばを 1つ ふやすか… ❤が 少ない ときは 回り道が おすすめ'],['think','回り道を えらぶと 問題が ふえるけど、 そのぶん 練習に なるよ']],
 dg_lost:[['smile','まいごの 探検家 エマさん。 Do you have 〜? は 「〜 もってる？」。 もっていれば わたして あげよう'],['point','エマさんの おねがいは 食べ物・ろうそく・くすり・コンパス。 少し もっていくと いいことが あるかも']],
 dg_orb:[['wow','水晶で この 階の できごとが 見えたね。 ⚠️ わなが 見えたら 🧭 コンパスや 🎲 サイコロを 用意しておこう'],['point','先が 見えると 作戦が たてられるね。 🔮 は 階の はじめに つかうと いちばん お得']],
 dg_mirror:[['think','ふたごの かがみ… つぎの できごとが 2回 おきるの。 宝箱なら 2つ、 わななら 2回！ どきどきだね'],['smile','かがみは 🔮 水晶と いっしょに つかうと 安心。 いいことの 前に つかえるよ']],
 dg_bomb:[['wow','ドカーン！ かくし部屋は わなが なくて 宝だらけ。 ばくだんは 分かれ道で つかえるよ'],['happy','かくし部屋は 原石も 見つかりやすいの。 いい ばくだんの つかい方だね']],
 dg_upd3:[['wow','鉱山が 深さで 景色が かわるように なったよ！ 10階ごとに 「階の ぬし」も いるの。 弱点は きょう まちがえた ことば！'],['point','🗺️ 地図の かけら・🐈 坑道ねこ・⏱️ 落盤… 鉱山の しかけが また ふえたよ']],
 dg_boss:[['point','階の ぬし！ 1問 正解で 1ダメージ。 きょう まちがえた ことばが 弱点で、 正解すると 2ダメージだよ'],['wow','ぬしは 10階ごとに いるの。 あぶなく なったら にげても いいからね']],
 dg_bossWin:[['proud','はじめての ぬし たいじ！ まちがえた ことばを ちゃんと 答えられたね。 それが いちばんの 力だよ'],['happy','ぬしに 勝ったね！ 弱点の ことば、 もう 覚えちゃったでしょ？']],
 dg_mapp:[['smile','地図の かけら！ 3まい そろうと 宝の へやに 行けるよ。 帰っても なくならないから 安心してね'],['point','map は 地図。 treasure map で 宝の 地図だよ']],
 dg_vault:[['wow','宝の 地図の へやが ひらいたよ！ わなが なくて 宝箱だらけ。 いちばん 上の 道を えらんでね'],['happy','地図が そろったね！ 宝の へやは つぎの 分かれ道に あるよ']],
 dg_cat:[['smile','坑道ねこ！ 食べ物を あげると ついてきてくれるよ。 cat の 鳴き声は 英語で "meow"（ミャウ）'],['happy','ねこが いると 階段の たびに おみやげを もってきてくれるの。 食べ物を もっていくと いいね']],
 dg_rush:[['wow','落盤！ 時間内に 3問 答えると 大きな 宝石が とれるよ。 あわてず、 でも はやく！'],['point','落盤の ときは 1問 まちがえると そこで にげるの。 よく 見て 答えてね']],
 dg_fossil:[['smile','ことばの 化石！ さっき 答えた ことばの 文字が ばらばらに なってるよ。 ならべかえは いちばん 覚えられる 練習だね'],['point','化石の ことばは この 回に 出た ものばかり。 ふくしゅうの チャンス！']],
 dg_rune:[['think','古代文字の かべ… 正しい つづりを えらぶと かくし金庫が ひらくよ。 1文字ずつ よく 見てね'],['point','つづりの 問題は 声に 出して 読むと まちがいに 気づきやすいよ']],
 dg_z1:[['wow','岩の 坑道に 入ったね。 たいまつの 光が ゆれてる… ここから 少し むずかしく なるよ'],['smile','地下31階！ かたい 岩の 層だね']],
 dg_z2:[['wow','水晶の 洞くつ！ キラキラ してる… crystal は 「クリスタル」、 水晶の ことだよ'],['happy','地下61階の 水晶の 洞くつ。 きれいだね']],
 dg_z3:[['wow','地底湖に 出たよ。 lake は 湖。 地下100階の 下に こんな 湖が あるなんて'],['think','地底湖の あたりから 中学・高校の ことばが ふえるよ']],
 dg_z4:[['wow','溶岩の 道！ あつそう… lava は 溶岩、 volcano は 火山だよ'],['point','地下151階。 ここまで 来る 人は なかなか いないよ']],
 dg_z5:[['wow','古代の 遺跡… ancient は 「古代の」。 だれが つくったんだろうね'],['proud','地下201階の 遺跡！ 高校と ハイレベルの ことばの 世界だよ']],
 dg_z6:[['wow','星の 底… 地下に 星空が ある！ ここが 鉱山の いちばん 深い ところ かも'],['proud','地下301階。 ほんとうに すごいところまで 来たね']],
 dg_special:[['wow','✨ とくべつな 品！ 鉱山でも めったに 見つからないの。 つかうと とても 強いけど、 雑貨店の ノラさんに 高く 売る ことも できるよ'],['happy','とくべつな 品だね！ つかうか、 売るか… なやむね。 雑貨店の 💰売る に ⛏️ 鉱山の タブが あるよ']],
 dg_upd4:[['wow','鉱山が もっと 楽しく なったよ！ できごとは 舞台に キャラが 登場して、 探検家の エマちゃんの 冒険も はじまったの。 📖の 7つの 章、 ぜんぶ 見られるかな？'],['point','1つの 階に 1つ ❗ 見どころが あるよ。 小さな 宝石は とまらずに 拾えるから、 テンポよく ほれるね']],
 dg_emma0:[['smile','エマちゃんと 会ったんだね。 おじいちゃんの 「星の 石」を さがしてるの。 深く もぐるたびに お話が すすむよ'],['happy','エマちゃんの 英語は かんたんで ていねい。 聞きとれたら いっしょに 冒険しよう']],
 dg_emmaN:[['happy','エマちゃんの 冒険、 つぎの 章へ！ 入口の 📖で どこまで 来たか 見られるよ'],['smile','エマちゃん、 だんだん 元気に なってきたね。 英語の 会話も 聞きとれてる？']],
 dg_emmaEnd:[['wow','エマちゃんの 冒険、 さいごまで 見たんだね！ 「ことばこそ 本当の 宝物」… すてきな ことばだね'],['proud','地下300階の 先まで… ほんとうに よく がんばったね。 星の 探検家さん！']],
 dg_hs:[['wow','地下200階の 下！ 高校と ハイレベルの ことばの 世界。 すごいところまで 来たね'],['proud','200階 とっぱ！ ここまで 来られる 人は なかなか いないよ']]});

window.DUNGEON={open,items:DG_ITEMS,rec:DG,itN,itTake,sellP,isSp,_ev:(k,go)=>D&&EV[k](go||(()=>{})),_go:f=>start(f),_rev:()=>D&&revW(),_boss:()=>D&&boss(()=>{})};
})();
