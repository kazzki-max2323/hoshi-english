/* 🕘 さっき なにが あったか（RECENT）: ミオ・ミナ先生など キャラが 「直前の 行動・手に 入れた 物・いま 起きている こと」に 反応する ための 共通の 記録
   ─ 使い方 ─────────────────────────────────────────────
   RECENT.add(k, d)          記録する。 k = 種類（下の 一覧）、 d = {en, ja, ico, …}。 自動で t（時刻）と id（記録の 番号）が つく。 d に id が あれば name に うつる（料理・会話・カードの id は e.name で 読む）
   RECENT.last(k, ms)        いちばん 新しい k（k は 配列でも 可。 ms 以内だけ。 なければ null）
   RECENT.list(ms, k)        ms 以内の 記録（新しい 順）。 k で しぼれる
   RECENT.count(k, ms)       ms 以内の k の 数
   RECENT.fresh(who, k, ms)  who（'mio' / 'mina' など）が まだ 反応して いない いちばん 新しい 記録。 なければ null（しるしは つけない）
   RECENT.used(who, e)       who が e に 反応した しるしを つける（同じ 記録に 2回 反応しない）
   RECENT.take(who, k, ms)   fresh ＋ used を いっしょに（反応する と きめた ときに 使う）
   RECENT.now()              いまの ようす: {tod:'day'|'dusk'|'night', hour, rain:0-3, ev, evs:[いま 見えている 浜辺の イベント], fest,
                               song(お店の BGM id), hp, hpMax, coins, food:[もちものの 食べ物], gifts:[あげられる 品], screen}
   RECENT.bev(id)            浜辺の イベントの 名前 → {id, ico, en, ja, cat}（cat: sea / sky / beach / night / weather / show / magic）
   RECENT.on(k, f)           記録されたら f(e) を よぶ（k='*' で ぜんぶ）
   ─ 種類（k） と d の 中身 ──────────────────────────────
   mine   鉱山から 帰った        {depth, best(前の 最高), ok, q, cards:[id], rare(宝カードが 出た), coins, hp(へとへと で 帰った なら 'hp')}
   pack   仕入れで パックを 開けた {en, ja, ico, n(まい数), news(新しい カードの 数), best(いちばん レアな id)}
   book   カードブックに 入れた   {id, en, ja}
   sell   カウンターで 売れた     {id, en, ja, p(コイン), by:'me'|'mio', kind(やりとりの 形), miss, tip}
   buyin  カウンターで カードを 買い取った {id, en, ja, p(はらった コイン), by:'me'|'mio', kind, miss, isNew, guest}
   away   るすばんの 報告を 見た  {sold, guests, coins}
   meal   食堂で 食べた          {id, en, ja, ico, c(国)}
   snack  もちものの 食べ物を 食べた {id, en, ja, ico}
   zbuy   雑貨店で 買った        {id, en, ja, ico, kind}
   zsell  雑貨店で 売った・返品   {ja, ret, kind('music'|'radio'|'gift'|''), en(曲・ラジオの 英語名), tn(曲名)}
   gift   プレゼントした         {to, toN(名前), en, ja, ico, tier(0-3)}
   meteor 流れ星を つかまえた     {gold, coins}
   lesson 授業を おえた          {id, en, ja, miss}
   tutor  リクの 家庭教師を おえた {n}
   bottle ボトルメールを 読んだ   {from}
   kaiwa  浜辺の 会話を おえた     {id, c(キャラ), good}
   mio    ミオと 話した           {id, end, how:'talk'|'tap'|'study'}
   bgm    お店の BGMを かえた     {id, en, ja}（id が null なら とめた）
   bev    浜辺の イベントが 見えた  {name(イベントの 名前), ico, en, ja, cat}（このファイルが 自動で 記録。 id は 記録の id で 上書きされる）
   visit  動物が 浜辺に 来た     {name, ja}（game/mina-react.js が 記録）
   ──────────────────────────────────────────────────────
   保存は localStorage の 'hoshi_recent'（さいごの 100こまで・同じ 種類は 15こまで） */
(()=>{
const KEY='hoshi_recent',MAXN=100,PERK=15;
const R=(()=>{try{const s=JSON.parse(localStorage.getItem(KEY)||'null');if(s&&Array.isArray(s.L))return s}catch(e){}return {L:[],u:{}}})();
if(!R.u||typeof R.u!=='object')R.u={};
let tm=0;const save=()=>{clearTimeout(tm);tm=setTimeout(()=>{try{localStorage.setItem(KEY,JSON.stringify(R))}catch(e){}},300)};
const L=new Map();
const ks=k=>k==null||k==='*'?null:Array.isArray(k)?k:[k];
const hit=(e,k,ms,now)=>(!k||k.includes(e.k))&&(!ms||now-e.t<=ms);

function add(k,d){const now=Date.now(),e=Object.assign({},d||{},{k,t:now,id:now.toString(36)+Math.random().toString(36).slice(2,5)});
  /* d の id（料理・会話・カードの id など）は 記録の id で 上書きされるので name に のこす */
  if(d&&d.id!=null&&e.name==null)e.name=d.id;
  R.L.unshift(e);
  let n=0;R.L=R.L.filter(x=>x.k!==k||++n<=PERK).slice(0,MAXN);
  save();[k,'*'].forEach(q=>(L.get(q)||[]).forEach(f=>{try{f(e)}catch(er){}}));return e}
function list(ms,k){const now=Date.now(),q=ks(k);return R.L.filter(e=>hit(e,q,ms,now))}
function last(k,ms){return list(ms,k)[0]||null}
const count=(k,ms)=>list(ms,k).length;
const usedBy=who=>R.u[who]||(R.u[who]=[]);
function fresh(who,k,ms){const u=usedBy(who);return list(ms,k).find(e=>!u.includes(e.id))||null}
function used(who,e){if(!e)return;const u=usedBy(who);if(!u.includes(e.id)){u.unshift(e.id);if(u.length>80)u.length=80;save()}}
function take(who,k,ms){const e=fresh(who,k,ms);used(who,e);return e}

/* ================================================================ 浜辺の イベント（beach/scene.js の 名前） → [ico, 英語, 日本語, 種類] */
const BEV={
 dolphins:['🐬','dolphins','イルカ','sea'],whale:['🐋','a whale','クジラ','sea'],turtle:['🐢','a sea turtle','ウミガメ','sea'],crab:['🦀','a crab','カニ','beach'],
 jelly:['🪼','jellyfish','クラゲ','sea'],flyfish:['🐟','flying fish','トビウオ','sea'],biolum:['✨','glowing waves','光る 波','night'],mermaid:['🧜‍♀️','a mermaid','人魚','magic'],
 ship:['🚢','a big ship','大きな 船','sea'],fishboat:['🚤','a fishing boat','漁船','sea'],fishing:['🎣','someone fishing','つりを する 人','beach'],pirate:['🏴‍☠️','a pirate ship','海賊船','magic'],
 surfer:['🏄','a surfer','サーファー','sea'],jetski:['🚤','a jet ski','水上バイク','sea'],parasail:['🪂','a parasail','パラセーリング','sky'],seaplane:['🛩️','a seaplane','水上飛行機','sky'],
 plane:['✈️','a plane','飛行機','sky'],heli:['🚁','a helicopter','ヘリコプター','sky'],rocket:['🚀','a rocket','ロケット','sky'],ufo:['🛸','a UFO','UFO','magic'],iss:['🛰️','the space station','宇宙ステーション','night'],
 kite:['🪁','a kite','凧','sky'],redballoon:['🎈','a red balloon','赤い 風船','sky'],birds:['🐦','birds','鳥の むれ','sky'],gull:['🕊️','a seagull','カモメ','sky'],mig_birds:['🐦','birds flying south','わたり鳥','sky'],
 dragonfly:['🪰','dragonflies','トンボ','sky'],rainbow:['🌈','a rainbow','虹','weather'],sunshower:['🌦️','a sun shower','天気雨','weather'],greenflash:['💚','the green flash','グリーンフラッシュ','sky'],
 meteors:['🌠','shooting stars','流れ星','night'],lanterns:['🏮','lanterns','ランタン','night'],farfire:['🔥','a faraway fire','遠くの たき火','night'],supermoon:['🌕','a super moon','スーパームーン','night'],
 dog:['🐕','a dog','犬','beach'],cat:['🐈','a cat','ねこ','beach'],jogger:['🏃','a jogger','ジョギングの 人','beach'],couple:['💑','a couple','カップル','beach'],
 beachball:['🏐','a beach ball','ビーチボール','beach'],sandcastle:['🏰','a sandcastle','砂の お城','beach'],icecart:['🍦','an ice cream cart','アイスクリームの 屋台','beach'],bottle:['🍾','a bottle','びん','beach'],
 mist:['🌫️','sea mist','海の きり','weather'],w_fog:['🌫️','fog','きり','weather'],w_lightning:['⚡','lightning','いなずま','weather'],farthunder:['⛈️','faraway thunder','遠くの かみなり','weather'],w_puddle:['💧','puddles','水たまり','weather'],
 rn_lantern:['🏮','floating lanterns','うかぶ ランタン','night'],rn_moonroad:['🌙','a moon road on the sea','月の 道','night'],rn_heart:['💗','a heart in the sky','空の ハート','magic'],rn_firefly:['✨','fireflies','ホタル','night'],
 rn_milky:['🌌','the Milky Way','天の川','night'],rn_candle:['🕯️','candles','キャンドル','night'],rn_starfall:['🌠','falling stars','星の 雨','night'],rn_aurora:['🌌','an aurora','オーロラ','night'],
 rn_bubble:['🫧','bubbles','シャボン玉','magic'],rn_wish:['⭐','a wishing star','ねがい星','night'],
 fm_mochi:['🐇','moon rabbits','月の うさぎ','magic'],fm_halo:['🌕','a moon halo','月の かさ','night'],fm_howl:['🐺','a howl','遠ぼえ','night'],fm_tsukimi:['🎑','moon viewing','お月見','night'],
 fm_kaguya:['🌙','a moon princess','かぐや姫','magic'],fm_turtle:['🐢','a moon turtle','月の カメ','magic'],fm_coral:['🪸','glowing coral','光る サンゴ','magic'],fm_owl:['🦉','an owl','フクロウ','night'],
 /* ショー */
 fireworks:['🎆','fireworks','花火','show'],fw_sea:['🎆','fireworks','花火','show'],fw_yanagi:['🎆','fireworks','花火','show'],fw_cute:['🎆','fireworks','花火','show'],fw_jp:['🎆','fireworks','花火','show'],fw_odama:['🎆','big fireworks','大玉の 花火','show'],grandfw:['🎆','big fireworks','大花火','show'],
 drones:['🛸','a drone show','ドローンショー','show'],bubbles:['🫧','bubbles','シャボン玉','beach'],balloons:['🎈','balloons','風船','sky'],balloonfest:['🎈','a balloon festival','風船まつり','sky'],
 fireflies:['✨','fireflies','ホタル','night'],aurora:['🌌','an aurora','オーロラ','night'],moonbow:['🌙','a moonbow','月の 虹','night'],mstorm:['🌠','a meteor shower','流星群','night'],
 goldrain:['💰','golden rain','黄金の 雨','magic'],dragon:['🐉','a dragon','龍','magic'],whaleshow:['🐋','whales','クジラ','sea'],dolphinshow:['🐬','dolphins','イルカ','sea'],
 yacht:['⛵','a yacht','ヨット','sea'],cruise:['🛳️','a cruise ship','客船','sea'],airshow:['✈️','an air show','航空ショー','sky'],sakura:['🌸','cherry blossoms','桜','sky'],snowday:['❄️','snow','雪','weather'],
 eclipse:['🌑','an eclipse','日食','sky'],magichour:['🌅','the magic hour','マジックアワー','sky'],constel:['✨','constellations','星座','night'],lamplighter:['🏮','the lamplighter','灯り守り','night'],
 senko:['🎇','sparklers','線香花火','show'],bonodori:['💃','a bon dance','盆おどり','show'],firedance:['🔥','a fire dance','ファイヤーダンス','show'],bigfire:['🔥','a big bonfire','大きな たき火','night'],
 odako:['🪁','a giant kite','大だこ','sky'],laser:['💡','a laser show','レーザーショー','show'],fest:['🏮','a festival','おまつり','show'],kogame:['🐢','baby turtles','子ガメ','beach'],gflash:['💚','a green flash','グリーンフラッシュ','sky']};
function bev(id){const b=BEV[id];return b?{id,ico:b[0],en:b[1],ja:b[2],cat:b[3]}:null}

/* ================================================================ いまの ようす */
const dark=()=>{try{return SCENE.dark()}catch(e){return 0}};
function now(){const d=dark(),o={tod:d>.6?'night':d>.25?'dusk':'day',hour:(typeof GH==='function'?GH():new Date().getHours()),rain:0,ev:null,evs:[],fest:null,song:null,hp:null,hpMax:null,coins:0,food:[],gifts:[],screen:''};
  try{o.rain=typeof rainKind==='function'?rainKind():0}catch(e){}
  try{const c=SCENE.curEv();o.ev=c?bev(c)||{id:c,cat:'?'}:null}catch(e){}
  try{o.evs=SCENE.showing().map(bev).filter(Boolean)}catch(e){}
  try{const f=SCENE.fest();o.fest=f&&Object.keys(f).length?f:null}catch(e){}
  try{o.song=HE.shopSongId||null}catch(e){}
  try{o.hp=FOOD.hp();o.hpMax=FOOD.MAX}catch(e){}
  try{o.coins=BEACH.S.coins|0}catch(e){}
  try{o.food=FOOD.bagList().map(s=>({id:s.id,en:s.en,ja:s.n,ico:s.ico,tg:s.tg||[]}))}catch(e){}
  try{o.gifts=GIFT.items().filter(i=>i.src==='z'||i.src==='t').map(i=>({key:i.key,en:i.w,ja:i.n,ico:i.ico,src:i.src}))}catch(e){}
  try{o.screen=HE.screen||''}catch(e){}
  return o}

/* ================================================================ 浜辺の イベントを 自動で 記録（見えはじめた とき 1回） */
let seen=new Set();
setInterval(()=>{if(document.hidden)return;const cur=new Set();
  try{const c=SCENE.curEv();if(c)cur.add(c)}catch(e){}
  try{SCENE.showing().forEach(n=>cur.add(n))}catch(e){}
  cur.forEach(n=>{if(!seen.has(n)){const b=bev(n);if(b)add('bev',Object.assign({name:n},b))}});seen=cur},3000);

/* 授業の おわり（game/lesson.js の LESSON_AFTER） */
window.LESSON_AFTER=window.LESSON_AFTER||[];
LESSON_AFTER.push((l,info)=>{try{add('lesson',{id:l.id,ja:l.t||'',lv:l.lv,miss:info&&info.miss||0})}catch(e){}return null});

window.RECENT={add,last,list,count,fresh,used,take,now,bev,BEV,on:(k,f)=>{(L.get(k)||L.set(k,[]).get(k)).push(f)},_rec:R};
})();
