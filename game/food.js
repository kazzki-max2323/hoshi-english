/* 🍽️ 食べ物と 体力 と しおかぜ食堂
   - 体力（❤）: 鉱山で つかう 自分の 体力。 最大 80。 鉱山の 外でも のこり、 2分で 1ずつ もどる（0 から まんたんまで 約2時間40分）
       食べ物を 食べると たくさん もどる。 鉱山の 入口で へとへとの ときは ミオの まかない（1日1回 ただ）が あるので、 ずっと 入れない ことは ない
   - 🍪 持ち帰りの 食べ物: ながれぎ雑貨店の 「食べ物」の たなで 英語で 買う（game/zakka.js・データは game/food-data.js の FOOD_SNACKS）
       もちものに 入り、 あとで 食べる か、 プレゼントに できる（game/gift.js）
   - 🍽️ しおかぜ食堂: 浜辺の 砂の 上（リクと カードショップの あいだ）。 元・船の コックの マルコさんの お店
       お品書きは 毎日 + 浜辺の 時間帯（朝ごはん・昼ごはん・おやつ・夜ごはん）で かわる。 世界の 料理 64品。 持ち帰りなし、 その場で 食べる
       英語で 注文: 席 → 注文（なにが 入ってる？・おすすめは？）→ 好み（辛さ・大きさ・焼き加減…）→ 飲み物 → うんちく → 食べる → 感想 → お会計
       料理の レベル（小・中・高）で 英語の むずかしさが かわる。 💡ヒントと、 えらんだ あとの 解説つき。 へんな 答えは マルコさんが わらって、 もう一回 えらべる（失敗なし）
       食べた 料理の うんちくは 📜 うんちく図鑑に のこる
   ミナ先生の セリフ・ミオの セリフは この ファイルの さいご */
(()=>{
const {S:ST,sfx:SFX}=BEACH;
const H=HE,esc=H.esc,$=id=>document.getElementById(id);
const pickL=a=>a[Math.random()*a.length|0];
const sf=k=>{try{SFX[k]&&SFX[k]()}catch(e){}};
const val=(x,c)=>typeof x==='function'?x(c):x;
const ML=(k,v)=>{try{return MINA.line(k,v||{})}catch(e){return ['smile','']}};
const DISH=FOOD_DISHES,SN=FOOD_SNACKS,BANDS=FOOD_BANDS,DRINK=FOOD_DRINKS;
const LVJ={es:'小',jh:'中',hs:'高'};
const MAX=80,REGEN=120000;   // 2分で ❤1

/* ---------- the record ---------- */
const FD=(()=>{try{const s=JSON.parse(localStorage.getItem(SAVE_KEY)||'{}').food;if(s&&s.bag)return s}catch(e){}
  return {hp:MAX,t:Date.now(),bag:{},eaten:{},tri:{},ph:{},v:0,meals:0,snacks:0,maka:'',ja:0}})();
_saveHooks.push(()=>{const s=JSON.parse(localStorage.getItem(SAVE_KEY)||'{}');s.food=FD;localStorage.setItem(SAVE_KEY,JSON.stringify(s))});
const today=()=>{const d=new Date();return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate()};

/* ================================================================ ❤ 体力 */
function hp(){const now=Date.now();if(FD.hp>=MAX){FD.hp=MAX;FD.t=now;return MAX}
  const g=Math.floor((now-(FD.t||now))/REGEN);if(g>0){FD.hp=Math.min(MAX,FD.hp+g);FD.t+=g*REGEN;if(FD.hp>=MAX)FD.t=now}return FD.hp}
function setHp(n){hp();FD.hp=Math.max(0,Math.min(MAX,Math.round(n)));FD.t=Date.now();save()}
function gain(n){const a=hp();setHp(a+n);return [a,hp()]}
/* 分 until the next ❤ / until full */
const nextMin=()=>{const h=hp();if(h>=MAX)return 0;return Math.max(1,Math.ceil((REGEN-(Date.now()-FD.t))/60000))};
const fullMin=()=>{const h=hp();if(h>=MAX)return 0;return Math.ceil(((MAX-h)*REGEN-(Date.now()-FD.t))/60000)};
const hpBar=(h,cls='')=>`<span class="fdhp ${cls}"><i style="width:${Math.round(h/MAX*100)}%"></i></span>`;
const hpLine=()=>{const h=hp();return `<p class="fdhpl">❤ <b>${h}</b>/${MAX} ${hpBar(h)} <small>${h>=MAX?'まんたん！':`2分で 1 もどる`}</small></p>`};

/* ================================================================ 🍪 もちものの 食べ物 */
const snack=id=>SN[id]?Object.assign({id},SN[id]):null;
const bagList=()=>Object.keys(FD.bag).filter(id=>FD.bag[id]>0&&SN[id]).map(snack);
const count=()=>bagList().reduce((a,s)=>a+FD.bag[s.id],0);
function add(id,n=1){if(!SN[id])return;FD.bag[id]=(FD.bag[id]||0)+n;save()}
function take(id){if(!FD.bag[id])return false;FD.bag[id]--;if(FD.bag[id]<=0)delete FD.bag[id];save();return true}
/* rows for the 🎒 もちもの screen (game/zakka.js bag()) */
function bagRows(row){const L=bagList();if(!L.length)return [];
  return [`<div class="fdbagh">🍪 食べもの ${hpLine()}</div>`,...L.map(s=>row(s.ico,`${esc(s.n)} <small>×${FD.bag[s.id]}</small>`,`❤+${s.hp}・あげても いいよ`,`<button data-fe="${s.id}">食べる</button>`))]}
/* for 🎁 プレゼント (game/gift.js items()) */
const giftItems=()=>bagList().map(s=>({ref:'f:'+s.id,key:'f:'+s.id,ico:s.ico,n:s.n,w:s.en,src:'f',cnt:FD.bag[s.id]}));
const giftUse=it=>take(it.key.slice(2));

/* the munch: a plate, three bites, the heart bar fills */
function munchHtml(ico){return `<div class="fdmunch"><span class="fdplate"><b class="fdfood">${ico}</b></span><span class="fdsteam"><i></i><i></i><i></i></span></div>`}
function munch(box,before,after,done){const f=box.querySelector('.fdfood'),bar=box.querySelector('.fdhp i'),num=box.querySelector('.fdnum');let k=0;
  const bite=()=>{if(!box.isConnected)return;k++;sf('eat');if(f){f.style.transform=`scale(${1-k*.22})`;f.style.opacity=String(1-k*.2)}
    const v=Math.round(before+(after-before)*k/3);if(bar)bar.style.width=Math.round(v/MAX*100)+'%';if(num)num.textContent=v;
    if(k<3)setTimeout(bite,520);else setTimeout(()=>{if(f)f.textContent='✨';sf('gulp');done&&done()},420)};
  setTimeout(bite,450)}
/* eat a snack from the bag */
function eat(id,back){const s=snack(id);back=typeof back==='function'?back:H.home;if(!s||!take(id))return back();
  const [a,b]=gain(s.hp);FD.snacks++;save();
  const [ex,tx]=ML(b>=MAX&&a<MAX?'fd_eatFull':a>=MAX?'fd_eatWas':'fd_eat',{n:s.n,h:b-a});
  H.show('food',`<section class="pnl fd fdeat">
    <div class="qtop"><button class="x" id="fdx" aria-label="もどる">←</button><b>${s.ico} ${esc(s.n)}</b><span class="qn"></span></div>
    ${munchHtml(s.ico)}
    <p class="fdgot">もぐもぐ… ❤ <b class="fdnum">${a}</b> ${hpBar(a,'big')} <small>+${b-a}</small></p>
    <div class="kmina fdmn" hidden><span class="lface">${MINA.face('m',ex)}</span><p>${tx}</p></div>
    <div class="row"><button id="fdok" data-back>ごちそうさま</button></div></section>`);
  $('fdx').onclick=$('fdok').onclick=()=>{sf('back');back()};
  munch(H.panel.querySelector('.fdeat'),a,b,()=>{const m=H.panel.querySelector('.fdmn');if(m)m.hidden=false})}
/* pick something to eat (from the mine) */
function eatPick(back){const L=bagList();if(!L.length){H.toast('🎒 食べものが ないよ <small>雑貨屋の 🥪食べ物 の たなで 買えるよ</small>');return}
  H.show('food',`<section class="pnl fd">
    <div class="qtop"><button class="x" id="fdx" aria-label="もどる">←</button><b>🍪 なにを 食べる？</b><span class="qn"></span></div>
    ${hpLine()}
    <div class="zkbag">${L.map(s=>`<div class="ritem"><span class="ri">${s.ico}</span><span class="rn"><b>${esc(s.n)} <small>×${FD.bag[s.id]}</small></b><small>❤+${s.hp}</small></span><span class="rbtn"><button data-fe="${s.id}">食べる</button></span></div>`).join('')}</div></section>`);
  $('fdx').onclick=()=>{sf('back');back()};
  H.panel.querySelectorAll('[data-fe]').forEach(b=>b.onclick=()=>eat(b.dataset.fe,back))}

/* ================================================================ 🍽️ お品書き（毎日・時間帯） */
function rnd(seed){let h=2166136261;for(const ch of seed)h=Math.imul(h^ch.charCodeAt(0),16777619);h=Math.imul(h^h>>>15,h|1);h^=h+Math.imul(h^h>>>7,h|61);return ((h^h>>>14)>>>0)/4294967296}
const GHh=()=>{try{return GH()}catch(e){return new Date().getHours()}};
const bandOf=h=>h>=5&&h<11?'am':h>=11&&h<15?'noon':h>=15&&h<18?'tea':'night';
const band=()=>bandOf(GHh());
const BAND_END={am:11,noon:15,tea:18,night:5};
const NEXT_B={am:'noon',noon:'tea',tea:'night',night:'am'};
/* real minutes until the menu changes (one beach hour = 7.5 real minutes) */
const menuMin=()=>{const h=GHh(),e=BAND_END[bandOf(h)];return Math.max(1,Math.ceil(((e-h+24)%24)*7.5))};
function menu(){const b=band(),dk=today()+':'+b;
  const pool=DISH.filter(d=>d.w.includes(b)).sort((x,y)=>rnd(dk+y.id)-rnd(dk+x.id));
  const out=[];['es','jh','hs'].forEach(lv=>{const d=pool.find(x=>x.lv===lv&&!out.includes(x));if(d)out.push(d)});
  pool.forEach(d=>{if(out.length<5&&!out.includes(d))out.push(d)});
  out.sort((x,y)=>rnd(dk+'o'+x.id)-rnd(dk+'o'+y.id));
  return {b,list:out,sp:out[0]}}
const dish=id=>DISH.find(d=>d.id===id);
const countries=()=>[...new Set(Object.keys(FD.eaten).map(id=>dish(id)).filter(Boolean).map(d=>d.c))];

/* ---------- マルコさん（元・船の コック。 大人の 男の人の 声） ---------- */
const MARCO={n:'マルコさん',ico:'👨‍🍳'};
const MALE=/Daniel|Alex\b|Fred|Aaron|Arthur|Guy\b|David|Mark\b|Rishi|Oliver|Tom\b|Gordon|Lee\b|Ralph|Albert|Bruce|Reed|Eddy|Rocko|Google UK English Male|Microsoft (Guy|David|Mark|Ryan|Christopher|Eric|Roger|Steffan|Andrew|Brian)|\bMale\b/i;
const FEM=/Samantha|Ava|Allison|Susan|Victoria|Karen|Tessa|Moira|Zira|Jenny|Aria|Female|Woman|Kathy|Princess|Nicky|Serena|Libby|Sonia|Hazel/i;
let MV=null,MVok=false;
function voice(){if(MVok)return MV;if(!window.speechSynthesis)return null;const vs=speechSynthesis.getVoices().filter(v=>/^en[-_]/i.test(v.lang));if(!vs.length)return null;
  const pref=['Daniel','Aaron','Arthur','Alex','Google UK English Male','Microsoft Guy','Microsoft Ryan','Microsoft Mark','Microsoft David','Fred','Tom','Oliver','Gordon','Rishi','Reed','Eddy'];
  MV=null;for(const n of pref){MV=vs.find(v=>v.name.includes(n));if(MV)break}
  MV=MV||vs.find(v=>MALE.test(v.name)&&!FEM.test(v.name))||null;MVok=true;return MV}
if(window.speechSynthesis&&speechSynthesis.addEventListener)speechSynthesis.addEventListener('voiceschanged',()=>{MVok=false});
let talking=0;
function say(en){try{if(!ST.sound||!window.speechSynthesis||!en)return;speechSynthesis.cancel();
  const t=(typeof sayNames==='function'?sayNames(String(en)):String(en)).replace(/[“”"]/g,'').replace(/\.\.\.|…|—/g,', ').replace(/\([^)]*\)/g,'');
  const u=new SpeechSynthesisUtterance(t);u.lang='en-US';const v=voice();if(v)u.voice=v;
  /* no male voice on this device: a lower voice so Marco doesn't sound like a girl */
  u.pitch=v?.95:.7;u.rate=(ST.slow?.74:.94);u.volume=Math.min(1,(ST.vol&&ST.vol.voice!=null)?ST.vol.voice:1);
  talking=Date.now()+Math.min(9000,800+t.length*70);u.onend=()=>{talking=0};speechSynthesis.speak(u)}catch(e){}}
const myLv=()=>{try{return MINA.level()}catch(e){return 'es'}};
const jaOn=()=>myLv()==='es'||!!FD.ja;
const partEn=()=>{const b=band();return b==='am'?'morning':b==='night'?'evening':'afternoon'};
const partJa=()=>({am:'おはよう',noon:'こんにちは',tea:'こんにちは',night:'こんばんは'})[band()];

function greet(M){const b=band(),g=[
  [`Good ${partEn()}! Welcome to Seabreeze Diner. The ${BANDS[b][2]} menu is on the board.`,`${partJa()}！ しおかぜ食堂へ ようこそ。 ${BANDS[b][1]}の お品書きは 黒板に あるよ。`],
  [`Today's special is ${M.sp.en}, from ${cEn(M.sp)}. I learned it in a port there long ago.`,`きょうの おすすめは ${M.sp.c}の ${M.sp.n}。 むかし そこの 港で おぼえたんだ。`],
  ["Sit anywhere you like. Order in English, and I'll tell you a story about the dish.","すきな 席に どうぞ。 英語で 注文してくれたら、 料理の お話を してあげよう。"],
  ["No takeout here, friend. Food tastes best fresh from the pan!","ここは 持ち帰り なしだよ。 料理は フライパンから 出たてが いちばん！"],
  ["I cooked on ships for twenty years. Every dish here comes from a different port.","20年 船で コックを していたんだ。 ここの 料理は ぜんぶ ちがう 港の 味さ。"]];
  if(FD.v>1&&Object.keys(FD.eaten).length)g.push(["Welcome back! What will it be this time?","おかえり！ こんどは なにに する？"]);
  if(hp()<25)g.push(["You look tired! Been digging in the mine? A good meal will fix that.","つかれた 顔だね！ 鉱山で ほってたのかい？ しっかり 食べれば 元気に なるさ。"],["You look tired! Been digging in the mine? A good meal will fix that.","つかれた 顔だね！ 鉱山で ほってたのかい？ しっかり 食べれば 元気に なるさ。"]);
  if(b==='am')g.push(["Breakfast is the most important meal of the day. That's what my mother always said!","朝ごはんは 一日で いちばん 大事な ごはん。 母さんの 口ぐせさ！"]);
  if(b==='night')g.push(["The lamps are on and the soup is hot. Perfect timing.","ランプも ついたし、 スープも あつあつ。 ちょうど いい ときに 来たね。"]);
  if(b==='tea')g.push(["It's snack time! Something sweet, maybe?","おやつの 時間だ！ あまい ものは どうだい？"]);
  return pickL(g)}
const C_EN={'アメリカ':'America','イギリス':'Britain','フランス':'France','中国':'China','日本':'Japan','チュニジア・中東':'North Africa','ブラジル':'Brazil','ベルギー':'Belgium','メキシコ':'Mexico','シンガポール':'Singapore','ベトナム':'Vietnam','イタリア':'Italy','インド':'India','スペイン':'Spain','韓国':'Korea','タイ':'Thailand','エジプト・中東':'Egypt','インドネシア':'Indonesia','ギリシャ':'Greece','アルゼンチン':'Argentina','アメリカ（ハワイ）':'Hawaii','ペルー':'Peru','トルコ':'Turkey','台湾':'Taiwan','オーストリア':'Austria','ポルトガル':'Portugal','ハンガリー':'Hungary','ウクライナ':'Ukraine','モロッコ':'Morocco','ナイジェリア・西アフリカ':'Nigeria','スイス':'Switzerland','カナダ':'Canada','オーストラリア':'Australia'};
const cEn=d=>C_EN[d.c]||'far away';

/* ---------- 🏠 the board ---------- */
function open(){gen++;P=null;FD.v=(FD.v||0)+1;save();const M=menu(),[en,ja]=greet(M),h=hp(),B=BANDS[M.b];
  const row=d=>{const p=d.p,short=ST.coins<p,ate=FD.eaten[d.id];
    return `<button class="fdrow ${short?'short':''} ${d===M.sp?'sp':''}" data-d="${d.id}"><span class="fdi">${d.ico}</span><span class="fdn"><b>${esc(d.n)}${ate?' <i class="fdate">✓</i>':''}</b><small>${d.fl} ${esc(d.c)}${d===M.sp?' ・ <em>★ おすすめ</em>':''}</small></span><span class="fdlv zlv zlv-${d.lv}">${LVJ[d.lv]}</span><span class="fdp">🪙${p}<small>❤+${d.hp}</small></span></button>`};
  H.show('food',`<section class="pnl fd">
    <div class="qtop"><button class="x" id="fdx" aria-label="もどる">←</button><b>🍽️ しおかぜ食堂</b><span class="qn">❤${h}</span>${window.GIFT?GIFT.btn('marco','fdgv'):''}</div>
    <div id="fdhi">${marcoLine(en,ja)}</div>
    <div class="fdboard"><p class="fdbh">${B[0]} ${B[1]}の お品書き</p>${M.list.map(row).join('')}
      <p class="fdrot">🔄 あと やく${menuMin()}分で ${BANDS[NEXT_B[M.b]][1]}の お品書きに。 あしたは べつの 料理だよ</p></div>
    ${h<MAX?hpLine():''}
    <div class="row zkrow"><button id="fdbook" class="sub">📜 うんちく図鑑 <small>${Object.keys(FD.eaten).length}</small></button>${count()?`<button id="fdbag" class="sub">🎒 もちもの</button>`:''}</div>
    <details class="mfold"><summary>📊 きろく</summary><div class="zkrec"><span>🍽️ 食べた 料理 <b>${Object.keys(FD.eaten).length}/${DISH.length}</b></span><span>🌍 行った 国の 味 <b>${countries().length}</b></span><span>💬 言えた フレーズ <b>${Object.keys(FD.ph).length}</b></span>
      <label class="kjat"><input type="checkbox" id="fdja" ${FD.ja?'checked':''}> 日本語訳を いつも 出す</label></div></details>
  </section>`);
  bindLine($('fdhi'));say(en);
  $('fdx').onclick=()=>{sf('back');speechSynthesis&&speechSynthesis.cancel();H.home()};
  $('fdbook').onclick=()=>{sf('book');book(open)};
  if($('fdbag'))$('fdbag').onclick=()=>{sf('open');window.ZAKKA?ZAKKA.bag(open):eatPick(open)};
  $('fdja').onchange=e=>{FD.ja=e.target.checked?1:0;save()};
  if(window.GIFT)GIFT.bindBtn('marco','fdgv',open);
  H.panel.querySelectorAll('[data-d]').forEach(b=>b.onclick=()=>{const d=dish(b.dataset.d);if(!d)return;
    if(ST.coins<d.p){sf('wrong');H.toast(`🪙 コインが たりないよ <small>あと ${d.p-ST.coins}まい</small>`);return}
    sf('talk');order(d,M)})}
function marcoLine(en,ja){const on=jaOn();
  return `<div class="lsay kth fdhi"><span class="lface kf">${MARCO.ico}</span><div class="lbody"><p class="ken">${esc(en)}<button class="ksay" data-say="${esc(en)}" aria-label="もう一度 きく">🔊</button></p><small class="kja ${on?'on':''}">${esc(ja)}</small>${on?'':'<button class="kjab">訳を 見る</button>'}</div></div>`}
function bindLine(root){if(!root)return;root.querySelectorAll('[data-say]').forEach(b=>b.onclick=e=>{e.stopPropagation();say(b.dataset.say)});
  root.querySelectorAll('.kjab').forEach(b=>b.onclick=()=>{sf('pop');const j=b.parentNode.querySelector('.kja');if(j)j.classList.add('on');b.remove()})}

/* ================================================================ 💬 英語で 注文（会話の 場面） */
const L=(c,a)=>a[{es:0,jh:1,hs:2}[c.d.lv]||0];
/* O(英語, 日本語, 正しい？, マルコの 返事, 返事の 日本語, つぎ, おまけ) */
const O=(e,j,ok,r,rj,nx,x={})=>Object.assign({e,j,ok,r,rj,nx},x);
const art=en=>/^(the|a|an)\s/i.test(en)||/s$/.test(en)&&!/ss$/.test(en)?en:'the '+en;   // "pancakes" / "the ramen"
const one=en=>/s$/.test(en)&&!/ss$/.test(en)?en:'one '+en;
/* toppings / sides for each dish */
const TOP={pancake:[['maple syrup','メープルシロップ'],['butter','バター'],['berries','ベリー']],congee:[['green onions','ねぎ'],['a fried bread stick','揚げパン'],['a soft egg','半熟たまご']],
 acai:[['banana','バナナ'],['granola','グラノーラ'],['honey','はちみつ']],waffle:[['whipped cream','ホイップクリーム'],['strawberries','いちご'],['chocolate sauce','チョコソース']],
 bagel:[['cream cheese','クリームチーズ'],['smoked salmon','スモークサーモン'],['butter','バター']],pho:[['extra herbs','ハーブ 多め'],['lime','ライム'],['bean sprouts','もやし']],
 frtoast:[['powdered sugar','粉ざとう'],['maple syrup','メープルシロップ'],['bananas','バナナ']],hotdog:[['mustard','マスタード'],['ketchup','ケチャップ'],['onions','たまねぎ']],
 poke:[['avocado','アボカド'],['seaweed','海そう'],['sesame seeds','ごま']],okonomi:[['bonito flakes','かつおぶし'],['green laver','青のり'],['extra mayo','マヨ 多め']],
 gelato:[['strawberry','いちご味'],['pistachio','ピスタチオ味'],['chocolate','チョコ味']],strudel:[['vanilla sauce','バニラソース'],['whipped cream','ホイップクリーム'],['ice cream','アイス']],
 crepe:[['banana and chocolate','バナナと チョコ'],['butter and sugar','バターと さとう'],['strawberries and cream','いちごと クリーム']],bingsu:[['red beans','あずき'],['mango','マンゴー'],['strawberries','いちご']],
 meatpie:[['tomato sauce','トマトソース'],['mashed peas','つぶした 豆'],['nothing','なにも なし']]};
const SIDE={burger:[['fries','ポテト'],['salad','サラダ'],['onion rings','オニオンリング']],fishchips:[['mushy peas','つぶした 豆'],['tartar sauce','タルタルソース'],['lemon','レモン']],
 greek:[['bread','パン'],['extra olives','オリーブ 多め'],['no onion','たまねぎ ぬき']],gyoza:[['rice','ごはん'],['soup','スープ'],['extra vinegar','お酢 多め']],
 feijoada:[['rice','ごはん'],['greens','青菜'],['orange slices','オレンジ']]};
const DONE={steak:[['rare','レア（中は 赤い）'],['medium','ミディアム（中は ピンク）'],['well-done','ウェルダン（よく 焼く）']]};
/* the dish's own question (spicy / size / ...) */
function prefNode(c){const d=c.d,o=d.o,lv=d.lv;
  const yes=(e,j,r,rj,x)=>O(e,j,1,r,rj,'drink',x);
  if(o==='spicy')return {h:'辛さを 聞かれているよ。 mild（ひかえめ）・medium（ふつう）・hot（から口）',
    s:L(c,["Spicy or not spicy?","How spicy would you like it? Mild, medium, or hot?","How spicy would you like it? I can make it mild, medium, or properly hot."]),j:L(c,["からいのと からくないの、 どっち？","辛さは どうする？ ひかえめ・ふつう・から口？","辛さは どうしよう？ ひかえめ・ふつう・本格的に から口も できるよ。"]),
    o:[yes(L(c,["Not spicy, please.","Mild, please.","Mild, please. I'm not great with spice."]),L(c,["からくないので おねがい。","ひかえめで おねがいします。","ひかえめで。 からいのは にがてで。"]),"No problem. Nice and gentle.","まかせて。 やさしい 味に するよ。",{x:'mild ＝ ひかえめ・おだやか',act:c=>{c.spice=0}}),
       yes(L(c,["A little spicy, please.","Medium, please.","Medium, please — just a little kick."]),L(c,["ちょっと からいので。","ふつうで おねがいします。","ふつうで。 ちょっと ピリッと くらい。"]),"Good choice. Just right.","いい えらび方だ。 ちょうど いいよ。",{x:L(c,['a little ＝ ちょっと','medium ＝ 中くらい','a kick ＝ ピリッと くる 感じ']),act:c=>{c.spice=1}}),
       yes(L(c,["Very spicy, please!","Hot, please!","Make it hot, please. I love spicy food."]),L(c,["すごく からいので！","から口で！","から口で。 からい 料理が 大好きなんです。"]),"Brave! I'll bring some water too.","勇気が あるね！ 水も もってくるよ。",{x:'hot ＝ （味が）からい。 あつい ことにも つかうよ',act:c=>{c.spice=2}}),
       O(L(c,["Hot like the sun!","As hot as a volcano, please!","Make it hotter than the sun, please."]),L(c,["お日さまくらい からく！","火山みたいに からく！","太陽より からく して ください。"]),0,"The sun? My kitchen would melt! Ha ha. Pick a normal one, OK?","太陽？ ちゅうぼうが とけちゃうよ！ はは。 ふつうのから えらんでね。",'pref',{x:'ここは mild / medium / hot から えらぼう'})]};
  if(o==='size'){const big=ST.coins>=d.p+15;return {h:'大きさを 聞かれているよ。 regular（ふつう）か large（大もり）',
    s:L(c,["Regular or large?","Would you like a regular or a large?","Would you like a regular portion, or are you hungry enough for a large?"]),j:L(c,["ふつう？ 大もり？","ふつうに する？ 大もりに する？","ふつうの 量に する？ それとも 大もりが いけそうかい？"]),
    o:[yes(L(c,["Regular, please.","A regular, please.","A regular portion is fine, thanks."]),L(c,["ふつうで。","ふつうで おねがいします。","ふつうの 量で だいじょうぶです。"]),"Regular it is.","ふつうだね。",{x:'regular ＝ ふつうの（大きさ）'}),
       ...(big?[yes(L(c,["Large, please!","A large, please. I'm really hungry.","I'll go for the large. I've been digging all day."]),L(c,["大もりで！","大もりで。 すごく おなかが すいてて。","大もりに します。 一日中 ほってたので。"]),"That's the spirit! Large, extra 15 coins.","その いきだ！ 大もりは 15まい たすよ。",{x:L(c,['large ＝ 大きい','hungry ＝ おなかが すいた','go for ～ ＝ ～に する（思いきって）']),act:c=>{c.large=1}})]:[]),
       O(L(c,["Super mega large!","The biggest plate in the world, please!","Could you serve it in a bathtub?"]),L(c,["スーパー メガ 大もり！","世界一 大きい お皿で！","おふろおけで 出して もらえますか？"]),0,"Ha ha! My plates aren't that big. Regular or large?","はは！ そんなに 大きい お皿は ないよ。 ふつうか 大もりで ね。",'pref',{x:'regular か large で こたえよう'})]}}
  if(o==='egg')return {h:'たまごの 焼き方を 聞かれているよ',
    s:L(c,["How do you like your egg?","How would you like your eggs?","How would you like your eggs done?"]),j:L(c,["たまごは どうする？","たまごは どう しますか？","たまごの 焼き方は どうしましょう？"]),
    o:[yes("Sunny-side up, please.","目玉焼き（かた面）で。","Sunny-side up. Bright like the morning!","目玉焼きだね。 朝みたいに まぶしいよ！",{x:'sunny-side up ＝ かた面焼きの 目玉焼き（黄身が お日さまみたい）'}),
       yes("Scrambled, please.","いりたまごで。","Scrambled. Soft and fluffy coming up.","いりたまご。 ふわふわで 出すよ。",{x:'scrambled ＝ かきまぜて 焼いた たまご'}),
       ...(d.lv!=='es'?[yes("Over easy, please.","両面焼きで 黄身は とろとろで。","Over easy — flipped once, still soft inside. You know your eggs!","オーバーイージー、 ひっくり返して 中は とろとろ。 たまごに くわしいね！",{x:'over easy ＝ 両面 さっと 焼いて 黄身は 半熟'})]:[]),
       O("Raw, in my hand, please.","生で 手の 上に。",0,"In your hand? That would be a very messy breakfast! Ha ha.","手の 上？ べたべたの 朝ごはんに なっちゃうよ！ はは。",'pref',{x:'焼き方を こたえよう。 sunny-side up / scrambled'})]};
  if(o==='steak')return {h:'焼き加減を 聞かれているよ。 rare（中は 赤い）・medium・well-done（よく 焼く）',
    s:"How would you like your steak?",j:"ステーキの 焼き加減は？",
    o:[...DONE.steak.map(([e,j])=>yes(`${e[0].toUpperCase()+e.slice(1)}, please.`,`${j}で。`,e==='rare'?"Rare. A true gaucho!":e==='medium'?"Medium. The most popular choice.":"Well-done. Nice and safe.",e==='rare'?'レア。 本物の ガウチョだね！':e==='medium'?'ミディアム。 いちばん 人気だよ。':'ウェルダン。 しっかり 焼くよ。',{x:`${e} ＝ ${j}`})),
       O("Alive, please!","生きたままで！",0,"Alive? Then it would run out the door! Ha ha. Rare, medium, or well-done?","生きたまま？ ドアから にげちゃうよ！ はは。 レア、 ミディアム、 ウェルダン？",'pref',{x:'rare / medium / well-done から えらぼう'})]};
  if(o==='top'||o==='side'){const T=(o==='top'?TOP:SIDE)[d.id];if(!T)return null;
    return {h:o==='top'?'のせる ものを 聞かれているよ':'つけあわせを 聞かれているよ',
    s:o==='top'?L(c,[`Do you want ${T[0][0]} or ${T[1][0]} on it?`,`What would you like on it? We have ${T.map(t=>t[0]).join(', ')}.`,`Would you like anything on top? I'd suggest ${T[0][0]}, but ${T[1][0]} or ${T[2][0]} work well too.`]):L(c,[`${T[0][0][0].toUpperCase()+T[0][0].slice(1)} or ${T[1][0]}?`,`Which would you like with it: ${T.map(t=>t[0]).join(', ')}?`,`It comes with a side. Would you prefer ${T[0][0]}, ${T[1][0]}, or ${T[2][0]}?`]),
    j:o==='top'?L(c,[`${T[0][1]}と ${T[1][1]}、 どっちを のせる？`,`なにを のせる？ ${T.map(t=>t[1]).join('・')}が あるよ。`,`上に なにか のせる？ おすすめは ${T[0][1]}。 ${T[1][1]}や ${T[2][1]}も あうよ。`]):L(c,[`${T[0][1]}？ ${T[1][1]}？`,`つけあわせは どれに する？ ${T.map(t=>t[1]).join('・')}。`,`つけあわせが つくよ。 ${T[0][1]}・${T[1][1]}・${T[2][1]}、 どれが いい？`]),
    o:[...T.map(([e,j])=>yes(L(c,[`${e[0].toUpperCase()+e.slice(1)}, please.`,`${e[0].toUpperCase()+e.slice(1)}, please.`,`I'd like ${e}, please.`]),`${j}で。`,pickL([`${e[0].toUpperCase()+e.slice(1)}. Great choice!`,`Good taste! ${e[0].toUpperCase()+e.slice(1)} it is.`]),`${j}。 いいね！`,{x:`${e} ＝ ${j}`})),
       O(L(c,["Sand, please!","Some sand from the beach, please!","A sprinkle of beach sand, please."]),L(c,["すなを ください！","浜辺の すなを のせて！","浜辺の すなを ひとふり。"]),0,"Sand? It's crunchy, but not in a good way! Ha ha.","すな？ ジャリジャリ するよ！ はは。",'pref',{x:'メニューに ある ものから えらぼう'})]}}
  if(o==='sweet')return {h:'あまさを 聞かれているよ。 100%（ふつう）・50%（半分）・no sugar（なし）',
    s:"How sweet? 100%, 50%, or no sugar?",j:"あまさは？ 100%・50%・さとう なし？",
    o:[yes("100%, please!","100%で！","Full sweet! Here comes happiness.","あまさ まんたん！ しあわせが 来るよ。",{x:'100% ＝ ふつうの あまさ'}),
       yes("50%, please.","50%で。","Half sweet. Very popular in Taiwan.","半分の あまさ。 台湾では 人気だよ。",{x:'50% ＝ half sweet（半分）'}),
       yes("No sugar, please.","さとう なしで。","No sugar. The tea tastes clear.","さとう なし。 お茶の 味が すっきり。",{x:'no sugar ＝ さとう なし'}),
       O("200%, please!","200%で！",0,"200%? Your teeth will run away! Ha ha.","200%？ 歯が にげちゃうよ！ はは。",'pref',{x:'100% / 50% / no sugar から えらぼう'})]};
  if(o==='wasabi')return {h:'わさびを 入れるか 聞かれているよ。 with（あり）・without（なし）',
    s:"With wasabi or without?",j:"わさびは 入れる？ 入れない？",
    o:[yes("With wasabi, please.","わさび ありで。","With wasabi. Very Japanese!","わさび あり。 日本っぽいね！",{x:'with ～ ＝ ～あり'}),
       yes("Without wasabi, please.","わさび ぬきで。","Without. Some people call that 'sabi-nuki' in Japan!","わさび ぬき。 日本では 「さびぬき」って いうんだよね！",{x:'without ～ ＝ ～なし'}),
       O("Only wasabi, please!","わさびだけで！",0,"Only wasabi? Your nose will explode! Ha ha.","わさびだけ？ 鼻が ばくはつ するよ！ はは。",'pref',{x:'with か without で こたえよう'})]};
  if(o==='noodle')return {h:'めんの かたさを 聞かれているよ。 firm（かため）・soft（やわらかめ）',
    s:L(c,["Hard noodles or soft noodles?","How do you like your noodles? Firm or soft?","How would you like your noodles — firm, regular, or soft?"]),j:L(c,["めんは かため？ やわらかめ？","めんは どう する？ かため？ やわらかめ？","めんは どう しよう？ かため・ふつう・やわらかめ？"]),
    o:[yes(L(c,["Hard, please.","Firm, please.","Firm, please."]),'かためで。',"Firm. The way the pros eat it!","かため。 通の 食べ方だね！",{x:'firm ＝ かための（hard とも 言うよ）'}),
       yes(L(c,["Soft, please.","Soft, please.","Regular is fine, thanks."]),L(c,['やわらかめで。','やわらかめで。','ふつうで おねがいします。']),"Got it!","わかった！",{x:L(c,['soft ＝ やわらかい','soft ＝ やわらかい','regular ＝ ふつう'])}),
       O(L(c,["Like rubber bands!","Hard like a pencil, please!","As firm as a guitar string, please."]),L(c,["わゴムみたいに！","えんぴつくらい かたく！","ギターの げんくらい かたく。"]),0,"Ha ha! Then you'd need a saw, not chopsticks!","はは！ それじゃ おはしじゃなくて のこぎりが いるよ！",'pref',{x:'firm か soft で こたえよう'})]};
  return null}

function scene(c){const d=c.d,D=one(d.en),T=art(d.en),b=c.b,dr=DRINK[b];
  const N={
  seat:{h:'人数を 聞かれているよ。 ひとりなら one / just me',
   s:L(c,["Hi! Welcome! Just you?",`Good ${partEn()}! Welcome to Seabreeze Diner. How many people?`,`Good ${partEn()}, and welcome. Do you have a reservation?`]),j:L(c,["やあ！ いらっしゃい！ ひとりかい？",`${partJa()}！ しおかぜ食堂へ ようこそ。 何名さま？`,`${partJa()}、 ようこそ。 ご予約は ありますか？`]),
   o:L(c,[[O("Yes, just me.","うん、 ひとりです。",1,"OK! Sit here, by the window.","オーケー！ まどの そばに どうぞ。",'order',{x:'just me ＝ わたし ひとりだけ'}),
           O("Yes. One, please.","はい。 ひとりです。",1,"One! This way, please.","おひとりさま！ こちらへ どうぞ。",'order',{x:'one, please ＝ ひとり おねがいします'}),
           O("No, me and my ten cats.","ううん、 わたしと ねこ 10ぴき。",0,"Ten cats? I don't see any! Ha ha. Come in, come in.","ねこ 10ぴき？ 1ぴきも 見えないよ！ はは。 さあ どうぞ。",'seat',{x:'ひとりなら Just me. / One, please. と 言おう'})],
          [O("Just one, please.","ひとりです。",1,"Right this way. You can have the table by the window.","こちらへ どうぞ。 まどぎわの 席を どうぞ。",'order',{x:'Just one ＝ ひとりだけ'}),
           O("A table for one, please.","ひとり用の 席を おねがいします。",1,"A table for one, coming up. Have a seat.","ひとり席だね。 どうぞ すわって。",'order',{x:'a table for ～ ＝ ～人用の 席。 お店で よく つかうよ'}),
           O("One hundred, please.","100人です。",0,"A hundred? I only have six tables! Ha ha. Just you, right?","100人？ テーブルは 6つしか ないよ！ はは。 ひとりだよね？",'seat',{x:'How many people? には 人数で こたえよう。 Just one, please.'})],
          [O("No, I don't. Do you have a table for one?","いいえ。 ひとり用の 席は ありますか？",1,"Of course. We always keep a seat for walk-ins.","もちろん。 予約なしの お客さんの 席は いつも あるよ。",'order',{x:'Do you have a table for ～? ＝ ～人の 席は ありますか'}),
           O("I'm afraid not. Could you fit me in?","あいにく ないんです。 入れて もらえますか？",1,"I think I can squeeze you in. Follow me.","なんとか 入れられるよ。 ついて おいで。",'order',{x:"I'm afraid not ＝ あいにく ちがいます（ていねいに 「いいえ」）／ fit ～ in ＝ ～を 入れる"}),
           O("Yes, I booked it in my dream last night.","はい、 ゆうべ 夢の 中で 予約しました。",0,"In your dream? Then tonight your dream comes true — but next time, call me! Ha ha.","夢の 中？ じゃあ 今夜 夢が かなうね。 でも つぎは 電話してね！ はは。",'seat',{x:'予約が ないなら No, I don\'t. / I\'m afraid not. と こたえよう'})]])},
  order:{h:L(c,[`ほしい ものを 聞かれているよ。 「${d.en}, please.」で 注文できるよ`,`注文を 聞かれているよ。 I'd like ～, please. で 注文しよう`,`注文を 聞かれているよ。 I'll have ～, please. や Could I have ～? で 注文しよう`]),
   s:c=>c.asked||c.rec?L(c,["So, what do you want?","So, are you ready to order?","So, have you decided?"]):L(c,["Here is the menu. What do you want?",`Here's the menu. Today's special is ${M0(c).sp.en}. Are you ready to order?`,`Here's tonight's menu. Take your time. Have you decided, or would you like a few more minutes?`]),
   j:c=>c.asked||c.rec?L(c,["で、 なにに する？","で、 注文は きまった？","で、 きまったかい？"]):L(c,["メニューだよ。 なにに する？",`メニューだよ。 きょうの おすすめは ${M0(c).sp.n}。 注文は きまった？`,`メニューです。 ごゆっくり。 おきまりですか、 それとも もう 少し あとに しましょうか？`]),
   o:c=>[O(L(c,[`${cap(d.en)}, please.`,`I'd like ${T}, please.`,`I'll have ${T}, please.`]),L(c,[`${d.n}を ください。`,`${d.n}を おねがいします。`,`${d.n}に します。`]),1,
       L(c,[`${cap(d.en)}! Good choice.`,`${cap(T)}. Good choice!`,`Excellent choice. ${cap(T)} is one of my favorites.`]),L(c,[`${d.n}！ いいね。`,`${d.n}だね。 いい えらび方！`,`すばらしい。 ${d.n}は ぼくの お気に入りなんだ。`]),c=>prefNode(c)?'pref':'drink',
       {x:L(c,['～, please. ＝ ～を ください','I\'d like ～ ＝ ～が ほしいです（want より ていねい）','I\'ll have ～ ＝ ～に します（注文の きまり文句）']),act:c=>{c.ord=1}}),
     ...(!c.asked?[O(L(c,[`${/s$/.test(d.en)&&!/ss$/.test(d.en)?'What are':'What is'} ${d.en}?`,`What's in ${T}?`,`Could you tell me what's in ${T}?`]),L(c,[`${d.n}って なに？`,`${d.n}には なにが 入ってるの？`,`${d.n}に なにが 入っているか 教えて もらえますか？`]),1,
       L(c,[`It's from ${cEn(d)}. It has ${d.in[0]}.`,`It's from ${cEn(d)}. It has ${d.in[0]}.`,`It's a dish from ${cEn(d)}, made with ${d.in[0]}.`]),`${d.c}の 料理で、 ${d.in[1]}が 入ってるよ。`,'order',{x:L(c,['What is ～? ＝ ～って なに？','What\'s in ～? ＝ ～には なにが 入ってる？','Could you tell me ～? ＝ ～を 教えて もらえますか（ていねい）']),act:c=>{c.asked=1}})]:[]),
     ...(d.lv!=='es'&&!c.rec?[O(L(c,['','What do you recommend?','What would you recommend?']),L(c,['','おすすめは なに？','おすすめは なんですか？']),1,
       c=>M0(c).sp===d?`Good eye! ${cap(T)} is today's special.`:`Today I recommend ${M0(c).sp.en}. But ${T} is great too!`,c=>M0(c).sp===d?`お目が 高い！ ${d.n}が きょうの おすすめだよ。`:`きょうの おすすめは ${M0(c).sp.n}。 でも ${d.n}も おいしいよ！`,'order',{x:'recommend ＝ すすめる。 お店で 聞くと 楽しいよ',act:c=>{c.rec=1}})]:[]),
     ...(!c.togo?[O(L(c,["Can I take it home?","Can I get it to go?","Could I get that to go?"]),L(c,["持って かえれる？","持ち帰りに できますか？","持ち帰りに して もらえますか？"]),0,
       "Sorry, no takeout here! Food tastes best fresh from the pan. Eat it here, OK?","ごめんね、 ここは 持ち帰り なしなんだ！ 料理は 出たてが いちばん。 ここで 食べてね。",'order',{x:'to go ＝ 持ち帰り。 ここは その場で 食べる お店だよ',act:c=>{c.togo=1}})]:[]),
     ...(!c.ev?[O(L(c,["Everything, please!","I'd like the menu, please. To eat.","I'll have one of everything — and the chef, to go."]),L(c,["ぜんぶ ちょうだい！","メニューを ください。 食べる ほうの。","ぜんぶ 1つずつ。 シェフも お持ち帰りで。"]),0,
       L(c,["Everything? Your tummy is too small! Ha ha. Pick one, OK?","Eat the menu? It's paper! Ha ha. Try the food instead.","Ha! I'm not on the menu, I'm afraid. One dish at a time, my friend."]),L(c,["ぜんぶ？ おなかが 小さすぎるよ！ はは。 1つ えらんでね。","メニューを 食べる？ 紙だよ！ はは。 料理に しようよ。","はは！ ぼくは メニューに ないよ。 1品ずつ ね。"]),'order',{x:'1つ えらんで 注文しよう',act:c=>{c.ev=1}})]:[])].filter(o=>o.e)},
  pref:{go:c=>prefNode(c)?null:'drink'},
  drink:{h:'飲み物を 聞かれているよ。 ～, please. で 答えよう',
   s:d.o==='drink'?L(c,["It comes with a drink. What do you want?","It comes with a drink. What would you like?","It comes with a drink. What can I get you?"]):L(c,["Something to drink?","Would you like something to drink?","Can I get you something to drink?"]),
   j:d.o==='drink'?'飲み物つきだよ。 なにに する？':L(c,["飲み物は？","なにか 飲みますか？","お飲み物は いかがですか？"]),
   o:[...dr.map(([e,j,i])=>O(L(c,[`${cap(e)}, please.`,`I'd like ${e}, please.`,`Could I have ${e}, please?`]),`${j}を ください。`,1,`${i} ${cap(e)}, coming right up.`,`${j}、 すぐ もってくるね。`,'wait',{x:`${e} ＝ ${j}`,act:c=>{c.drink=[e,j,i]}})),
     O(L(c,["Water, please.","Just water, please.","Just water is fine, thank you."]),"水で だいじょうぶです。",1,"Water. Simple and good.","水だね。 シンプルが いちばん。",'wait',{x:'Just water ＝ 水だけで',act:c=>{c.drink=['water','水','💧']}}),
     O(L(c,["Seawater, please!","Seawater, please. With a fish in it.","A glass of seawater, please — fresh from the shore."]),"海の 水を ください！",0,"Seawater? You live on a beach — that's free! Ha ha. How about a real drink?","海の 水？ 浜辺に すんでるなら ただだよ！ はは。 ちゃんと した 飲み物に しよう。",'drink',{x:'メニューの 飲み物か water で こたえよう'})]},
  wait:{h:'うんちくを 聞いて、 あいづちを うとう',
   s:L(c,[`OK! Wait a minute. Do you know? ${d.t[0][0]}`,`It'll be ready soon. While you wait, here's a fun fact. ${d.t[0][0]}`,`It won't be long. Here's a little story while you wait. ${d.t[0][0]}`]),
   j:L(c,[`オーケー！ ちょっと 待ってね。 知ってる？ ${d.t[0][1]}`,`すぐ できるよ。 待つ あいだに 楽しい 話を ひとつ。 ${d.t[0][1]}`,`すぐだよ。 待つ あいだに ちょっとした 話を。 ${d.t[0][1]}`]),enter:c=>{c.tri[0]=1},
   o:[O(L(c,["Really? Tell me more!","Really? Tell me more!","Really? I'd love to hear more."]),L(c,["ほんと？ もっと 教えて！","ほんと？ もっと 教えて！","ほんとうに？ もっと 聞きたいです。"]),1,d.t[1][0],d.t[1][1],'serve',{x:'Tell me more! ＝ もっと 教えて！',act:c=>{c.tri[1]=1}}),
     O(L(c,["Wow! I didn't know that.","Wow, I didn't know that!","That's fascinating. I had no idea."]),L(c,["へえ！ 知らなかった。","へえ、 知らなかった！","おもしろい。 ぜんぜん 知りませんでした。"]),1,"Food is full of stories!","料理は 物語で いっぱいなんだ！",'serve',{x:L(c,["I didn't know that ＝ 知らなかった","I didn't know that ＝ 知らなかった","I had no idea ＝ ぜんぜん 知らなかった"])}),
     ...(d.lv!=='es'?[O(L(c,['','Where did you learn that?','How do you know so much about it?']),L(c,['','どこで それを 知ったの？','どうして そんなに くわしいんですか？']),1,
       `I was a ship's cook for twenty years. I learned this dish in a port in ${cEn(d)}. And here's another thing: ${d.t[1][0]}`,`20年 船の コックを してたんだ。 この 料理は ${d.c}の 港で おぼえた。 それと もうひとつ。 ${d.t[1][1]}`,'serve',{x:L(c,['','Where did you learn ～? ＝ どこで ～を 知ったの？','How do you know ～? ＝ どうして ～を 知ってるの？']),act:c=>{c.tri[1]=1;c.story=1}})]:[]),
     O(L(c,["I know. I'm a genius.","I knew that. I'm a genius.","I knew that already. I'm something of a genius."]),L(c,["知ってる。 天才だから。","知ってたよ。 天才だから。","もう 知ってました。 ちょっとした 天才なので。"]),1,`Oh? Then here's one you don't know! ${d.t[1][0]}`,`へえ？ じゃあ これは 知らないだろう！ ${d.t[1][1]}`,'serve',{fx:'😂',x:'I knew that ＝ 知ってた（ちょっと いばった 言い方）',act:c=>{c.tri[1]=1}})].filter(o=>o.e)},
  serve:{h:'料理が 来たよ。 お礼を 言おう',
   s:L(c,[`Here you are. ${cap(D)}! Enjoy!`,`Here you go — ${D}. Enjoy your meal!`,`Here's your ${d.en}. Bon appétit!`]),j:L(c,[`はい、 どうぞ。 ${d.n}！ めしあがれ！`,`はい、 ${d.n}だよ。 めしあがれ！`,`${d.n}です。 ボナペティ（めしあがれ）！`]),
   o:[O(L(c,["Thank you! It looks good!","Thank you! It looks delicious!","Thank you. It looks absolutely delicious."]),L(c,["ありがとう！ おいしそう！","ありがとう！ とても おいしそう！","ありがとう。 ほんとうに おいしそう。"]),1,"Eat it while it's hot!","あついうちに どうぞ！",'eat',{x:'It looks ～ ＝ ～に 見える。 It looks delicious! ＝ おいしそう！'}),
     O(L(c,["Wow! It smells good!","Wow, it smells great!","Wow, the smell alone is making me hungry."]),L(c,["わあ！ いい におい！","わあ、 いい におい！","わあ、 においだけで おなかが すいてきた。"]),1,"That's the smell of the sea and the spice!","それが 海と スパイスの 香りさ！",'eat',{x:'It smells ～ ＝ ～な においが する'}),
     O("Itadakimasu!","いただきます！",1,"Itadakimasu! I like that word. In English, people often just say, \"This looks great!\"","いただきます！ いい ことばだね。 英語では よく 「This looks great!」って 言うんだ。",'eat',{fx:'🙏',x:'英語には 「いただきます」に ぴったりの ことばが ないよ。 This looks great! などで きもちを つたえよう'})]},
  eat:{eat:1},
  how:{h:'味の 感想を 聞かれているよ',
   s:L(c,["How is it?","How is everything?","How is everything tasting?"]),j:L(c,["どう？","おあじは どう？","おあじは いかがですか？"]),
   o:c=>[O(L(c,["It's delicious!","It's delicious!","It's wonderful. My compliments to the chef!"]),L(c,["おいしい！","とても おいしいです！","すばらしいです。 シェフに よろしく！"]),1,L(c,["Yay! I'm happy.","I'm so glad to hear that!","Why, thank you! The chef is me, so I accept!"]),L(c,["やった！ うれしいよ。","それを 聞けて うれしいよ！","おや、 ありがとう！ シェフは ぼくだから、 ありがたく！"]),'check',{x:L(c,['delicious ＝ とても おいしい','delicious ＝ とても おいしい（good より 強い）','My compliments to the chef ＝ 料理人に よろしく（ほめる ことば）'])}),
     O(L(c,["I love it! My favorite!","It's really good. Now it's my favorite!","It might be the best thing I've eaten this year."]),L(c,["大好き！ いちばん！","すごく おいしい。 いちばん 好きに なった！","ことし 食べた 中で いちばんかも。"]),1,"Then come back again and again!","じゃあ 何回でも 来ておくれ！",'check',{x:L(c,['favorite ＝ いちばん 好きな もの','favorite ＝ お気に入り','the best ～ I\'ve ever … ＝ いままで …した 中で いちばんの ～'])}),
     ...(c.spice===2?[O(L(c,["It's too spicy!","It's a little too spicy!","It's a bit too spicy for me, actually."]),L(c,["からすぎる！","ちょっと からすぎる！","じつは ちょっと からすぎます。"]),1,"Ha ha! Here, more water. And a little yogurt helps too.","はは！ ほら、 お水 もう1ぱい。 ヨーグルトも きくよ。",'check',{fx:'🥵',x:'too ～ ＝ ～すぎる'})]:[]),
     O(L(c,["I don't know. I ate it too fast!","I don't know. I ate it too fast!","Honestly, I ate it so fast I barely tasted it."]),L(c,["わかんない。 はやく 食べすぎた！","わからない。 はやく 食べすぎちゃった！","正直、 はやすぎて 味が わからなかった。"]),1,`Ha ha! It was ${D}! Next time, eat slowly.`,`はは！ ${d.n}だったんだよ！ つぎは ゆっくり 食べてね。`,'check',{fx:'😂',x:'too fast ＝ はやすぎる'})]},
  check:{h:'ほかに いるか 聞かれているよ。 おわりなら お会計を たのもう',
   s:L(c,["Anything else?","Would you like anything else?","Can I get you anything else, or are you all set?"]),j:L(c,["ほかには？","ほかに なにか いる？","ほかに なにか おもちしますか？ それとも これで だいじょうぶ？"]),
   o:[O(L(c,["No, thank you. Check, please.","No, thank you. Could I have the check, please?","I'm all set, thanks. Could I get the check, please?"]),L(c,["いらない。 お会計 おねがい。","いいえ、 けっこうです。 お会計を おねがいします。","じゅうぶんです。 お会計を おねがいできますか？"]),1,null,null,'pay',{x:L(c,['Check, please. ＝ お会計 おねがい','the check ＝ お会計・伝票','I\'m all set ＝ もう じゅうぶんです'])}),
     O(L(c,["I'm full. Thank you!","I'm full. Everything was great!","I couldn't eat another bite. Everything was perfect."]),L(c,["おなか いっぱい。 ありがとう！","おなか いっぱい。 ぜんぶ おいしかった！","もう ひとくちも 入りません。 ぜんぶ 最高でした。"]),1,null,null,'pay',{x:L(c,['I\'m full ＝ おなか いっぱい','I\'m full ＝ おなか いっぱい','I couldn\'t eat another bite ＝ もう ひとくちも 食べられない'])}),
     O(L(c,["Can I wash the dishes and not pay?","Can I wash the dishes instead of paying?","Would you accept dishwashing instead of coins?"]),L(c,["おさら あらうから ただに して？","おさらを あらうので、 お金の かわりに なりますか？","コインの かわりに おさらあらいで いいですか？"]),0,"Ha! Tempting, but coins are fine. You've worked hard enough today.","はは！ ありがたいけど、 コインで いいよ。 きょうは もう じゅうぶん はたらいただろ。",'check',{x:'おわりなら Check, please. / I\'m full. と 言おう'})]},
  pay:{h:'値段を 言われたよ。 はらう ときは Here you are.',
   s:c=>L(c,[`That's ${price(c)} coins.`,`That comes to ${price(c)} coins.`,`That comes to ${price(c)} coins altogether.`]),j:c=>`${price(c)}まいです。`,
   o:[O(L(c,["Here you are.","Here you are. Thank you for the meal!","Here you are. Thank you — it was a real treat."]),L(c,["はい、 どうぞ。","はい、 どうぞ。 ごちそうさまでした！","はい、 どうぞ。 ありがとう、 ほんとうに おいしかったです。"]),1,null,null,'bye',{x:'Here you are. ＝ はい、 どうぞ（わたす とき）'}),
     O(L(c,["Can I pay with shells?","Can I pay with shells?","Do you take seashells? I have some lovely ones."]),L(c,["貝がらで はらえる？","貝がらで はらえますか？","貝がらは つかえますか？ きれいなのが あるんです。"]),0,"Shells? They're pretty, but coins only! Ha ha.","貝がら？ きれいだけど、 コインだけだよ！ はは。",'pay',{x:'はらう ときは Here you are. と 言って わたそう'})]},
  bye:{end:1,s:L(c,["Thank you! Come again!","Thanks for coming. See you next time!","It was a pleasure. Come back soon — the menu changes every day."]),j:L(c,["ありがとう！ また 来てね！","来てくれて ありがとう。 またね！","来てくれて うれしかったよ。 また おいで。 お品書きは 毎日 かわるからね。"])}};
  return N}
const cap=s=>s?s[0].toUpperCase()+s.slice(1):s;
const M0=c=>c.M;
const price=c=>c.d.p+(c.large?15:0);

/* ---------- the talk ---------- */
let P=null,gen=0;const live=()=>P&&$('fdlog');
/* a timer that dies when the talk ends or a new one starts */
const later=(fn,ms)=>{const g=gen;setTimeout(()=>{if(g===gen)fn()},ms)};
function order(d,M){gen++;c={d,M,b:M.b,tri:{},seed:Math.random()*1e6|0};P={c,N:scene(c),at:'seat',step:0,used:[],fun:0};
  H.show('food',`<section class="pnl lsn kw fd fdtalk" data-stay>
    <div class="qtop"><button class="x" id="fdx" aria-label="注文を やめる">←</button><b>${d.ico} ${esc(d.n)} <small class="zlv zlv-${d.lv}">${LVJ[d.lv]}</small></b><span class="qn" id="fdq"></span></div>
    <div class="lslog kwlog" id="fdlog"></div>
    <div id="fdans" class="kans"></div></section>`);
  $('fdx').onclick=()=>{sf('back');try{speechSynthesis.cancel()}catch(e){}P=null;open()};
  later(turn,250)}
let c=null;
function scrollLog(){const l=$('fdlog');if(l)l.scrollTo({top:l.scrollHeight,behavior:'smooth'})}
function them(en,ja,fx,cls=''){if(!live())return;const d=document.createElement('div'),on=jaOn();d.className='lsay kth '+cls;
  d.innerHTML=`<span class="lface kf">${MARCO.ico}${fx?`<i class="kfx">${fx}</i>`:''}</span><div class="lbody"><p class="ken">${esc(en)}<button class="ksay" aria-label="もう一度 きく">🔊</button></p>${ja?`<small class="kja ${on?'on':''}">${esc(ja)}</small>${on?'':'<button class="kjab">訳を 見る</button>'}`:''}</div>`;
  $('fdlog').appendChild(d);d.querySelector('.ksay').onclick=e=>{e.stopPropagation();say(en)};
  const jb=d.querySelector('.kjab');if(jb)jb.onclick=()=>{sf('pop');jb.remove();d.querySelector('.kja').classList.add('on');scrollLog()};
  say(en);scrollLog()}
function you(en,x){if(!live())return;const d=document.createElement('div');d.className='lsay by-h kyou-b';
  d.innerHTML=`<span class="lface kf you">⭐</span><div class="lbody"><p>${esc(en)}</p>${x?`<small class="fdx">📖 ${esc(x)}</small>`:''}</div>`;$('fdlog').appendChild(d);scrollLog()}
function afterTalk(fn,gap=500,minMs=900){const t0=Date.now();
  const wait=()=>{if(!live())return;const busy=ST.sound&&window.speechSynthesis&&(speechSynthesis.speaking||speechSynthesis.pending)&&Date.now()<talking;
    if(busy||Date.now()-t0<minMs){later(wait,150);return}later(fn,gap)};later(wait,150)}
function turn(){if(!live())return;let N=P.N[P.at],g=0;
  while(N&&N.go&&g++<5){const nx=N.go(c);if(!nx)break;P.at=nx;N=P.N[P.at]}
  if(P.at==='pref'){N=prefNode(c);if(!N){P.at='drink';N=P.N.drink}}
  if(!N)return open();if(N.enter)N.enter(c);
  if(N.eat)return eatScene();if(N.end)return finish(N);
  P.step++;$('fdq').textContent=`💬 ${P.step}`;P.cur=N;
  P.opts=(val(N.o,c)||[]);them(val(N.s,c),val(N.j,c));later(()=>answers(),350)}
function answers(hintOpen){if(!live())return;const on=jaOn(),N=P.cur;
  $('fdans').innerHTML=`${hintOpen?`<p class="khint">💡 ${esc(N.h||'')}</p>`:''}
    <div class="lopts kopts fdopts">${P.opts.map((o,i)=>`<button data-o="${i}">${esc(val(o.e,c))}${on&&o.j?`<small>${esc(val(o.j,c))}</small>`:''}</button>`).join('')}</div>
    ${hintOpen||!N.h?'':'<button id="fdhint" class="sub fdhb">💡 ヒント</button>'}`;
  $('fdans').querySelectorAll('[data-o]').forEach(b=>b.onclick=()=>pick(+b.dataset.o));
  const hb=$('fdhint');if(hb)hb.onclick=()=>{sf('pop');answers(true)}}
function pick(i){if(!live())return;const o=P.opts[i];$('fdans').innerHTML='';
  const e=val(o.e,c);you(e,val(o.x,c));if(o.act)o.act(c);
  if(o.ok){FD.ph[e]=(FD.ph[e]||0)+1;if(!P.used.includes(e))P.used.push(e);save()}
  later(()=>{if(!live())return;const r=val(o.r,c),nx=val(o.nx,c);
    if(!o.ok){P.fun++;sf('tease')}else sf('step');
    const next=()=>{if(nx===P.at){P.opts=P.opts.filter(x=>x!==o);later(()=>answers(),300);return}P.at=nx;afterTalk(turn)};
    if(r){them(r,val(o.rj,c),o.fx||(o.ok?'😊':'😂'),o.ok?'k-good':'k-oops');if(nx===P.at)afterTalk(next,200,500);else next()}else next()},500)}
/* the dish comes: three bites, ❤ fills */
function eatScene(){if(!live())return;const d=c.d,before=hp();
  const box=document.createElement('div');box.className='fdmeal';
  box.innerHTML=`${munchHtml(d.ico)}${c.drink?`<span class="fddrink">${c.drink[2]}</span>`:''}<p class="fdgot">もぐもぐ… ❤ <b class="fdnum">${before}</b> ${hpBar(before,'big')}</p>`;
  $('fdlog').appendChild(box);scrollLog();
  const add=d.hp+(c.large?10:0);const [a,b]=gain(add);c.hpA=a;c.hpB=b;
  munch(box,a,b,()=>{const g=box.querySelector('.fdgot');if(g)g.insertAdjacentHTML('beforeend',` <small>+${b-a}${b>=MAX?' まんたん！':''}</small>`);P.at='how';afterTalk(turn,700,600)})}
/* the end: pay, record, the trivia book */
function finish(N){if(!live())return;const d=c.d,p=price(c);
  them(val(N.s,c),val(N.j,c),'👋','k-good');
  const first=!FD.eaten[d.id],newC=first&&!countries().includes(d.c);
  ST.coins=Math.max(0,ST.coins-p);save();H.head();sf('buy');
  FD.eaten[d.id]=(FD.eaten[d.id]||0)+1;FD.meals=(FD.meals||0)+1;
  const tr=FD.tri[d.id]||(FD.tri[d.id]=[0,0]);let newT=0;[0,1].forEach(i=>{if(c.tri[i]&&!tr[i]){tr[i]=1;newT++}});save();
  let k='fd_end',v={d:d.n,c:d.c,n:Object.keys(FD.eaten).length};
  if(FD.meals===1)k='fd_first';else if(newC)k='fd_newCountry';else if(c.hpB>=MAX&&c.hpA<MAX)k='fd_full';else if(d.lv==='hs')k='fd_hs';else if(P.fun>=2)k='fd_fun';
  const [ex,tx]=ML(k,v);
  const phs=P.used.map(e=>`<button data-ph="${esc(e)}">${esc(e)}</button>`).join('');
  const triH=[0,1].filter(i=>c.tri[i]).map(i=>`<div class="fdtri"><p>${esc(d.t[i][0])}<button class="ksay" data-say="${esc(d.t[i][0])}">🔊</button></p><small>${esc(d.t[i][1])}</small></div>`).join('');
  later(()=>{if(!live())return;$('fdq').textContent='🍽️';
    $('fdans').innerHTML=`<div class="kres">
      <p class="kend good">🍽️ ごちそうさま！${first?' <small>はじめての 料理！</small>':''}</p>
      <p class="zkres">${d.ico} <b>${esc(d.n)}</b>（${d.fl} ${esc(d.c)}） 🪙${p} ・ ❤ ${c.hpA} → <b>${c.hpB}</b></p>
      ${triH?`<details class="mfold" ${newT?'open':''}><summary>📜 うんちく ${newT?`<i class="zknew">NEW ${newT}</i>`:''}</summary><div class="fdtris">${triH}</div></details>`:''}
      ${phs?`<details class="mfold"><summary>💬 言えた フレーズ ${P.used.length}こ</summary><div class="kwords fdph">${phs}</div></details>`:''}
      <div class="kmina"><span class="lface">${MINA.face('m',ex)}</span><p>${tx}</p></div>
      <div class="row"><button id="fdbook2" class="sub">📜 うんちく図鑑</button><button id="fdback">🍽️ お品書きに もどる</button></div>
      ${minePeek()}</div>`;
    sf('done');
    $('fdans').querySelectorAll('[data-ph],[data-say]').forEach(b=>b.onclick=()=>say(b.dataset.ph||b.dataset.say));
    $('fdback').onclick=()=>{sf('back');P=null;open()};
    $('fdbook2').onclick=()=>{sf('book');P=null;book(open)};
    const mg=$('fdmine');if(mg)mg.onclick=()=>{sf('open');P=null;try{CG.open();setTimeout(()=>MINE.open(),60)}catch(e){H.home()}};
    setTimeout(()=>$('fdans').scrollIntoView({behavior:'smooth',block:'end'}),100)},1300)}
const minePeek=()=>{try{return window.MINE&&SHOP.rec().met&&hp()>=40?'<div class="row"><button id="fdmine" class="sub">⛏️ 元気に なったし、 鉱山へ</button></div>':''}catch(e){return ''}};

/* ================================================================ 📜 うんちく図鑑 */
function book(back){const ate=DISH.filter(d=>FD.eaten[d.id]),cs=countries();
  const byB=Object.keys(BANDS).map(b=>{const L=DISH.filter(d=>d.w[0]===b);return `<details class="mfold" ${b===band()?'open':''}><summary>${BANDS[b][0]} ${BANDS[b][1]} <small>${L.filter(d=>FD.eaten[d.id]).length}/${L.length}</small></summary><div class="zkbag fdbk">${L.map(d=>FD.eaten[d.id]?
    `<button class="zkfl" data-b="${d.id}"><b>${d.ico} ${esc(d.n)} <small>${d.fl}</small></b><small>${esc(d.en)} ・ ${FD.eaten[d.id]}回 ・ 📜${(FD.tri[d.id]||[]).filter(Boolean).length}/2</small></button>`:
    `<div class="zkfl no"><b>？？？ <small>${d.fl}</small></b><small>${esc(d.c)}の 料理</small></div>`).join('')}</div></details>`}).join('');
  const [ex,tx]=ML(ate.length?'fd_book':'fd_bookNone',{n:ate.length,c:cs.length});
  H.show('food',`<section class="pnl fd">
    <div class="qtop"><button class="x" id="fdx" aria-label="もどる">←</button><b>📜 うんちく図鑑</b><span class="qn">${ate.length}/${DISH.length}</span></div>
    <div class="kmina"><span class="lface">${MINA.face('m',ex)}</span><p>${tx}</p></div>
    <p class="note">🌍 味わった 国 ${cs.length} ・ タップで うんちくを 読みかえせるよ</p>
    ${byB}</section>`);
  $('fdx').onclick=()=>{sf('back');back()};
  H.panel.querySelectorAll('[data-b]').forEach(b=>b.onclick=()=>{sf('book');page(b.dataset.b,()=>book(back))})}
function page(id,back){const d=dish(id),tr=FD.tri[id]||[0,0];if(!d)return back();
  H.show('food',`<section class="pnl fd">
    <div class="qtop"><button class="x" id="fdx" aria-label="もどる">←</button><b>${d.ico} ${esc(d.n)}</b><span class="qn">${d.fl}</span></div>
    <p class="fdpg"><b>${esc(d.en)}</b> ・ ${esc(d.c)} ・ <span class="zlv zlv-${d.lv}">${LVJ[d.lv]}</span><br><small>${esc(d.in[1])}</small></p>
    <div class="fdtris">${[0,1].map(i=>tr[i]?`<div class="fdtri"><p>${esc(d.t[i][0])}<button class="ksay" data-say="${esc(d.t[i][0])}">🔊</button></p><small>${esc(d.t[i][1])}</small></div>`:`<div class="fdtri no"><p>？？？</p><small>マルコさんに 「Tell me more!」と 聞くと 教えてくれるよ</small></div>`).join('')}</div></section>`);
  $('fdx').onclick=()=>{sf('back');back()};
  H.panel.querySelectorAll('[data-say]').forEach(b=>b.onclick=()=>say(b.dataset.say))}

/* ================================================================ 🏠 the diner on the beach */
const HUT=`<svg viewBox="0 0 72 64" aria-hidden="true">
  <ellipse cx="36" cy="60.6" rx="34" ry="2.8" fill="rgba(0,0,0,.26)"/>
  <g class="fdSteam"><circle cx="54" cy="4" r="2.2" fill="#fff" opacity=".55"/><circle cx="56.4" cy="0.4" r="1.6" fill="#fff" opacity=".4"/><circle cx="52.6" cy="-2.4" r="1.2" fill="#fff" opacity=".3"/></g>
  <rect x="50.6" y="7" width="6.4" height="11" fill="#9a5b3c" stroke="#5a3322" stroke-width=".8"/><rect x="49.8" y="6" width="8" height="2" rx=".4" fill="#5a3322"/>
  <rect x="10" y="26" width="52" height="32" fill="#e8f4f1" stroke="#4a5a62" stroke-width="1.1"/>
  <path d="M10 31 H62 M10 36 H62 M10 41 H62 M10 46 H62 M10 51 H62" stroke="#c9dedb" stroke-width=".7"/>
  <rect x="5" y="57" width="62" height="3.4" rx="1" fill="#b68a5a" stroke="#6b4a2a" stroke-width=".6"/>
  <path d="M3 27.6 L36 9 L69 27.6 Z" fill="#d8643a" stroke="#6e2a16" stroke-width="1.3" stroke-linejoin="round"/>
  <path d="M10 25 L36 11 M17 25.8 L36 15.4 M62 25 L36 11 M55 25.8 L36 15.4" stroke="#b44e2a" stroke-width=".7" fill="none"/>
  <circle cx="36" cy="19.4" r="6" fill="#fff6dd" stroke="#6e2a16" stroke-width=".9"/>
  <path d="M33.4 16.2 V22.6 M32.6 16.2 V18.4 M34.2 16.2 V18.4 M32.6 18.4 Q33.4 19.4 34.2 18.4" stroke="#4a5a62" stroke-width=".55" fill="none"/>
  <path d="M38.6 16.2 Q40.2 17.6 38.8 19.4 V22.6" stroke="#4a5a62" stroke-width=".7" fill="none"/>
  <rect x="21" y="27.4" width="30" height="5.6" rx="1.4" fill="#2c5f6b" stroke="#fff6dd" stroke-width=".6"/>
  <text x="36" y="31.8" text-anchor="middle" font-size="4.3" font-weight="800" fill="#fff6dd" font-family="sans-serif" letter-spacing=".5">DINER</text>
  <rect x="13" y="36" width="27" height="14" rx="1" fill="var(--win,#3d4a6b)" stroke="#6b4a2a" stroke-width="1"/>
  <path d="M26.5 36 V50" stroke="#6b4a2a" stroke-width=".7"/>
  <g opacity=".9"><rect x="15" y="45.6" width="23" height="1.6" fill="#c49462"/><circle cx="19" cy="44.4" r="1.4" fill="#f6f0e0"/><path d="M17.8 44.2 Q19 42.6 20.2 44.2" fill="#ff8a5a"/><circle cx="31" cy="44.6" r="1.2" fill="#f6f0e0"/><path d="M30 44.4 Q31 43.2 32 44.4" fill="#ffcf4a"/></g>
  <path d="M12 32.4 L16.5 32.4 L16.5 35.8 Q14.25 38.2 12 35.8 Z" fill="#e2483d"/><path d="M16.5 32.4 L21 32.4 L21 35.8 Q18.75 38.2 16.5 35.8 Z" fill="#fff"/><path d="M21 32.4 L25.5 32.4 L25.5 35.8 Q23.25 38.2 21 35.8 Z" fill="#e2483d"/><path d="M25.5 32.4 L30 32.4 L30 35.8 Q27.75 38.2 25.5 35.8 Z" fill="#fff"/><path d="M30 32.4 L34.5 32.4 L34.5 35.8 Q32.25 38.2 30 35.8 Z" fill="#e2483d"/><path d="M34.5 32.4 L39 32.4 L39 35.8 Q36.75 38.2 34.5 35.8 Z" fill="#fff"/><path d="M39 32.4 L41 32.4 L41 35.8 Q40 37.2 39 35.8 Z" fill="#e2483d"/>
  <rect x="45" y="36" width="13" height="21" rx="1.4" fill="#2c5f6b" stroke="#1d3f47"/><rect x="47" y="38.2" width="9" height="7" rx=".8" fill="var(--win,#3d4a6b)" opacity=".85"/>
  <circle cx="55.6" cy="48" r=".9" fill="#ffd27a"/>
  <rect x="47.2" y="46.4" width="8.6" height="3.4" rx=".6" fill="#fff"/><text x="51.5" y="49" font-size="2.5" text-anchor="middle" fill="#d8643a" font-weight="bold" font-family="sans-serif">OPEN</text>
  <path d="M43 34 Q41.6 34 41.6 35.6" stroke="#4a3a2a" stroke-width=".5" fill="none"/><g class="fdLamp"><rect x="40.6" y="35.6" width="2" height="2.8" rx=".5" fill="#ffd27a" stroke="#6b4a2a" stroke-width=".4"/></g>
  <g class="fdBoard" transform="rotate(-6 6 52)"><path d="M2 58 L4.6 44 M10 58 L7.4 44" stroke="#6b4a2a" stroke-width=".8"/><rect x="1" y="43" width="10" height="10.6" rx=".8" fill="#2d3a33" stroke="#8a6a44" stroke-width=".8"/>
    <path d="M2.6 45.6 H9.4 M2.6 47.8 H8 M2.6 50 H9" stroke="#f4f1e6" stroke-width=".5" stroke-linecap="round" opacity=".85"/><circle cx="8.6" cy="51.6" r=".7" fill="#ff8a5a"/></g>
  <g class="fdBarrel"><rect x="62" y="49.4" width="7" height="8.2" rx="1.6" fill="#a8743e" stroke="#5a3a22" stroke-width=".6"/><path d="M62 52 H69 M62 55 H69" stroke="#5a3a22" stroke-width=".6"/><path d="M63.4 49.4 Q65.5 45.2 67.6 49.4" fill="#3f9a4f"/></g>
</svg>`;
const HUT_GLOW=`<svg viewBox="0 0 72 64" aria-hidden="true">
  <defs><radialGradient id="fdg"><stop offset="0" stop-color="rgba(255,200,120,.72)"/><stop offset="1" stop-color="rgba(255,200,120,0)"/></radialGradient></defs>
  <ellipse cx="34" cy="60" rx="30" ry="4.2" fill="url(#fdg)" opacity=".42"/>
  <ellipse cx="27" cy="43" rx="21" ry="13" fill="url(#fdg)" opacity=".72"/>
  <rect x="13.5" y="36.5" width="26" height="13" rx=".8" fill="#ffd690" opacity=".42"/><rect x="47" y="38.2" width="9" height="7" rx=".8" fill="#ffd690" opacity=".75"/>
  <g class="fdLamp"><circle cx="41.6" cy="37" r="5" fill="url(#fdg)"/><rect x="40.9" y="35.9" width="1.4" height="2.2" fill="#fff0c0"/></g>
  <circle cx="36" cy="19.4" r="5.2" fill="#ffd690" opacity=".18"/>
</svg>`;
function hut(){let b=$('fdHut');const w=$('window');if(!w)return;
  if(!b){b=document.createElement('button');b.id='fdHut';b.setAttribute('aria-label','しおかぜ食堂');b.innerHTML=`<span class="fdBody">${HUT}</span><span class="fdGlow">${HUT_GLOW}</span>`;w.appendChild(b);
    b.onclick=e=>{e.stopPropagation();if(H.screen!=='home')return;sf('shop');open()}}
  let d;try{d=SCENE.dbg()}catch(e){return}
  /* between Riku (.11) and the card shop (.74). game.js sandSpots() keeps radios off this box: change them together */
  const k=d.k,wd=Math.round(52*k);b.style.width=wd+'px';
  b.style.left=Math.round(d.WW*.4-wd/2)+'px';b.style.top=Math.round(d.shore-d.WT+40*k-wd*60.6/72)+'px';
  const dk=Math.max(0,Math.min(1,d.dark||0));b.style.setProperty('--dk',dk.toFixed(2));
  b.classList.toggle('off',H.screen!=='home')}
setTimeout(hut,650);addEventListener('resize',()=>setTimeout(hut,200));setInterval(hut,2500);
H.on('home',()=>{gen++;P=null;setTimeout(hut,70)});

/* ================================================================ 🍙 ミオの まかない（鉱山の 入口で へとへとの とき。1日1回） */
const MAKA=30;
const makaOk=()=>FD.maka!==today();
const MAKA_LINES=[["Boss, you look so tired! Here, I made you a rice ball. It's free — staff meal!","店長、 へとへとじゃ ないですか！ はい、 おにぎり 作りました。 まかないなので ただです！"],
 ["Wait, wait! Eat something first. I saved my lunch for you. Don't worry, I already ate!","まって まって！ まず なにか 食べて。 お昼 とっておきました。 だいじょうぶ、 わたしは もう 食べました！"],
 ["You can't dig on an empty stomach! Here's a rice ball. I put in a lot of love… and salmon!","おなか ぺこぺこじゃ ほれませんよ！ おにぎりです。 愛を たっぷり… と さけを 入れました！"]];
function maka(){if(!makaOk())return null;FD.maka=today();const [a,b]=gain(MAKA);save();return [a,b]}
/* the box at the mine's door (game/mine.js open()) */
function mineBox(){const h=hp(),L=bagList();if(h>=MAX)return '';
  const low=h<20,mio=low&&makaOk()&&window.MIO;const l=pickL(MAKA_LINES);
  return `<div class="fdmine ${low?'low':''}">${hpLine()}
    ${h<1?`<p class="note">へとへとで ほれない… ${mio?'':`あと ${nextMin()}分で 1 もどるよ`}</p>`:''}
    ${mio?`<div class="kmina fdmio"><span class="lface">${MIO.face('smile')}</span><p>${esc(l[0])}<small>${esc(l[1])}</small></p></div><button id="fdmaka" data-en="${esc(l[0])}">🍙 ミオの まかないを 食べる（❤+${MAKA}）</button>`:''}
    <div class="row">${L.length?`<button id="fdmeat" class="sub">🍪 もちものを 食べる</button>`:''}<button id="fdmdin" class="sub">🍽️ 食堂へ</button></div></div>`}
function mineBind(again){const m=$('fdmaka');if(m){try{MIO.say(m.dataset.en)}catch(e){}m.onclick=()=>{const r=maka();if(!r)return again();sf('eat');setTimeout(()=>sf('gulp'),500);H.toast(`🍙 ミオの おにぎり！ ❤ ${r[0]} → <b>${r[1]}</b>`,2600);again()}}
  const e=$('fdmeat');if(e)e.onclick=()=>{sf('open');eatPick(again)};
  const g=$('fdmdin');if(g)g.onclick=()=>{sf('shop');open()}}

/* ================================================================ 効果音 */
try{const X=SFX;
  /* もぐもぐ: やわらかい 「もっ」 */
  X.eat=()=>{noise(.05,{v:.07,f:520+Math.random()*200,q:2.2,attack:.006});tone(170+Math.random()*40,.07,'sine',.05,.01,120);noise(.04,{v:.04,f:900,q:2,delay:.12,attack:.006})};
  /* ごっくん + ほっと */
  X.gulp=()=>{tone(260,.12,'sine',.05,0,140);tone(523,.22,'sine',.03,.18);tone(659,.25,'sine',.025,.26)}}catch(e){}

/* ================================================================ ミナ先生の セリフ */
Object.assign(MINA_LINES,{
 fd_first:[['wow','はじめての 食堂、 どうだった？ 英語で 注文できたね！ 「I\'d like ～, please.」は 旅行でも ずっと つかえるよ'],['happy','{d}、 おいしそう！ マルコさんの うんちく、 わたしも 聞きたかったな']],
 fd_end:[['smile','{d}、 ごちそうさま！ これで {n}品め。 料理の 名前って 英語の まま 世界に 通じるのが 多いんだよ'],['happy','注文の 英語、 どんどん なれてきたね。 つぎは ちがう 国の 料理も ためしてみよう'],['point','「Could I have the check, please?」 は お会計の きまり文句。 おぼえておくと 外国で こまらないよ'],['smile','{c}の 料理だったね。 うんちくは 📜図鑑で いつでも 読みかえせるよ']],
 fd_newCountry:[['wow','{c}の 味は はじめて！ 食べた 国が また ふえたね'],['happy','{c}の 料理、 どんな 味だった？ 食べものから その 国が 好きに なる こと、 あるよね']],
 fd_full:[['happy','❤ まんたん！ これで 鉱山も ばっちりだね'],['smile','おなか いっぱい、 元気 いっぱい。 {d}の おかげだね']],
 fd_hs:[['proud','高の 料理を 英語で 注文できたね。 「Could you tell me ～?」みたいな ていねいな 言い方、 すてきだよ'],['wow','むずかしい うんちくも 聞けたね。 わからない ところは 訳を 見ても いいからね']],
 fd_fun:[['happy','マルコさん、 わらってたね。 へんな 注文でも ちゃんと 会話に なってるよ'],['think','まちがえても マルコさんが 教えてくれるから だいじょうぶ。 つぎは 1回で 言えるかな？']],
 fd_eat:[['smile','{n}、 おいしかった？ ❤が {h} もどったよ'],['happy','もぐもぐ。 つかれた ときは 食べるのが いちばん！']],
 fd_eatFull:[['happy','{n}で ❤ まんたん！ 鉱山へ 行く じゅんび OK だね'],['wow','まんたんに なった！ おやつの 力って すごいね']],
 fd_eatWas:[['think','あれ、 もう ❤ まんたんだったよ。 おいしかったなら いいけどね'],['smile','まんたんでも 食べたく なる 気持ち、 わかる。 でも つぎは とっておこうね']],
 fd_book:[['smile','{n}品 食べて、 {c}か国の 味を 知ったね。 うんちくは 話の ネタに なるよ'],['point','うんちくの 英語は 🔊で 聞けるよ。 「Did you know ～?」で だれかに 話してみて']],
 fd_bookNone:[['smile','まだ なにも 食べてないね。 食堂で 注文すると、 ここに うんちくが たまっていくよ'],['happy','浜辺の しおかぜ食堂に 行ってみよう。 世界の 料理が 毎日 かわるんだって']],
 fd_tired:[['worry','❤が へってるね。 時間が たつと 少しずつ もどるけど、 食べると いっきに もどるよ'],['think','つかれてる？ しおかぜ食堂で ごはんか、 もちものの 食べ物を 食べよう']],
 zk_endFood:[['smile','{t}、 いい えらび方！ パンや くだものは 鉱山の おともに ぴったりだよ'],['point','くだものの 英語は 数え方に 注意。 「a bunch of grapes」（ぶどう 1ふさ）、 「a slice of watermelon」（すいか 1切れ）って 言うんだよ'],['happy','{t}、 買えたね！ 🎒 もちものに 入ってるよ。 鉱山で つかれたら 食べてね'],['smile','{t}は 持ち帰り用。 だれかに プレゼントしても よろこばれるよ'],['point','食べものの 英語、 おぼえた？ 「Do you want one?」「Yes, please!」 かんたんだけど よく つかうよ']],
 x_fdNew:[['wow','浜辺に 食堂が できたの、 見た？ 元・船の コックさんが 世界の 料理を 出してくれるんだって'],['happy','新しい お店、 しおかぜ食堂！ 英語で 注文すると、 料理の うんちくを 教えてくれるよ']],
 x_fdTired:[['worry','❤が {n}しか ないよ。 しおかぜ食堂で ごはんに しない？'],['think','鉱山で がんばったね。 ❤ {n}… ごはんを 食べると たくさん もどるよ']],
 x_fdMenu:[['smile','いまの 時間は {b}の お品書き。 おすすめは {d}だって'],['point','食堂の お品書きは 毎日、 時間でも かわるよ。 いまは {b}。 {d}が おすすめ！'],['happy','{b}の 時間だね。 {d}、 英語で 注文してみない？']],
 x_fdTrivia:[['think','{d}の うんちく、 おぼえてる？ 「{t}」'],['smile','マルコさんの 話、 おもしろかったね。 {d}… 「{t}」']],
 x_fdSnack:[['smile','もちものに {n}が あるよ。 鉱山の おともに どうぞ'],['happy','{n}、 だれかに あげても いいね。 ミオちゃんは あまい ものが 大好きなんだって']],
 x_fdFruit:[['smile','{n}、 もちものに あるよ。 英語で なんて 言うか おぼえてる？ 「{w}」だよ'],['happy','{n}、 だれかに あげても よろこばれそう。 人に よって 好きな 食べ物が ちがうんだ']],
 x_fdShop:[['smile','雑貨屋の 🥪食べ物の たなは 毎日 かわるよ。 パンや くだもの、 おかしも あるの。 鉱山の おともに 1つ どう？'],['point','ノラさんの お店で 食べ物が 買えるよ。 持ち帰って あとで 食べたり、 プレゼントしたり できるの']]});
if(window.MINA_SENSE&&MINA_SENSE._rules)MINA_SENSE._rules.push(
 ['x_fdNew',3,()=>!FD.v?{}:null,()=>['🍽️ 食堂を のぞく',open]],
 ['x_fdTired',3,()=>{const h=hp();try{return h<30&&MINE.rec().dives>0?{n:h}:null}catch(e){return null}},()=>['🍽️ 食堂へ',open]],
 ['x_fdMenu',2,()=>{if(!FD.v)return null;const M=menu();return {b:BANDS[M.b][1],d:M.sp.n}},()=>['🍽️ お品書きを 見る',open]],
 ['x_fdTrivia',1,()=>{const a=Object.keys(FD.tri).filter(id=>dish(id)&&FD.tri[id][0]);if(!a.length)return null;const d=dish(pickL(a));return {d:d.n,t:d.t[0][1]}},()=>['📜 うんちく図鑑',()=>book(H.home)]],
 ['x_fdSnack',2,()=>{const L=bagList();return L.length?{n:pickL(L).n}:null},()=>['🎒 もちもの',()=>{window.ZAKKA?ZAKKA.bag(H.home):eatPick(H.home)}]],
 ['x_fdFruit',1,()=>{const L=bagList().filter(x=>['apple','mikan','watermelon','grapes','baguette','currypan','nikuman','yakiimo','soup','bento'].includes(x.id));if(!L.length)return null;const x=pickL(L);return {n:x.n,w:x.en}},()=>['🎒 もちもの',()=>{window.ZAKKA?ZAKKA.bag(H.home):eatPick(H.home)}]],
 ['x_fdShop',1,()=>{try{return ZAKKA.rec().met&&!FD.snacks&&!count()?{}:null}catch(e){return null}},()=>['🏚️ 雑貨屋へ',()=>{try{ZAKKA.open('food')}catch(e){}}]]);

/* ================================================================ プレゼント: 食べ物の しるしと 好み（game/gift-data.js） */
try{Object.keys(SN).forEach(id=>{GIFT_TAGS['f:'+id]=SN[id].tg});
  /* ミオは あまい ものと かわいい ものが 大好き */
  GIFT_PEOPLE.mio&&GIFT_PEOPLE.mio.love.push('f:daifuku','f:macaron','f:pudding','f:gummy');
  GIFT_PEOPLE.riku&&GIFT_PEOPLE.riku.love.push('f:popcorn');
  GIFT_PEOPLE.mina&&GIFT_PEOPLE.mina.love.push('f:castella');
  GIFT_PEOPLE.gen&&GIFT_PEOPLE.gen.love.push('f:senbei');
  GIFT_PEOPLE.pochi&&GIFT_PEOPLE.pochi.love.push('f:onigiri');
  GIFT_PEOPLE.baba&&GIFT_PEOPLE.baba.love.push('f:baum','f:yakiimo');
  GIFT_PEOPLE.riku&&GIFT_PEOPLE.riku.love.push('f:currypan');
  GIFT_PEOPLE.gen&&GIFT_PEOPLE.gen.love.push('f:bento');
  GIFT_PEOPLE.hana&&GIFT_PEOPLE.hana.love.push('f:watermelon');
  GIFT_PEOPLE.sora&&GIFT_PEOPLE.sora.love.push('f:mikan');
  GIFT_PEOPLE.taku&&GIFT_PEOPLE.taku.love.push('f:nikuman');
  GIFT_PEOPLE.mio&&GIFT_PEOPLE.mio.love.push('f:grapes')}catch(e){}
/* ミオの ひとこと（カードショップの あいさつ） */
try{MIO_HI.push(["Boss, have you tried the new diner? The chef was a ship's cook!","店長、 新しい 食堂 行きました？ コックさん、 むかし 船の コックだったんですって！"],
  ["I had pancakes at Seabreeze Diner this morning. Fluffy!","けさ しおかぜ食堂で パンケーキ 食べました。 ふわっふわ！"],
  ["If you get hungry in the mine, eat something, OK? Don't push yourself!","鉱山で おなか すいたら、 なにか 食べてくださいね。 むりは だめですよ！"])}catch(e){}

window.FOOD={hp,setHp,gain,MAX,nextMin,fullMin,hpLine,add,take,count,bagList,bagRows,eat,eatPick,giftItems,giftUse,open,book,menu,band,mineBox,mineBind,rec:()=>FD,dishes:DISH};
})();
