// 浜辺の英語: offline cache
// 更新が届かない端末が出ないように：
//  - インストール時は画面の部品だけを保存する（音声40MBを一度に取りにいくと、1つ失敗しただけで更新が止まるため）。音声は聞いたときに保存
//  - いつもネットの最新版を先に取りにいき（変わっていなければ304で軽い）、つながらない・遅いときだけ保存した物を使う
const CACHE='hoshienglish-v37',AUD='hoshienglish-audio';
const CORE=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png','apple-touch-icon.png','beach/scene.js','beach/scene.css','beach/host.js','beach/host-after.js','game/levels/index.js','game/levels/es.js','game/levels/jh.js','game/levels/jh-more.js','game/levels/hs.js','game/levels/hs-more.js','game/levels/adv.js','game/levels/adv-more.js','game/extras/pop.js','game/extras/season.js','game/extras/folk.js','game/extras/it.js','game/extras/cheer.js','game/extras/talk.js','game/grammar/es.js','game/grammar/jh.js','game/grammar/hs.js','game/catalog.js','game/game.js','game/adventure.js','game/cards-data.js','game/cards.js','game/cards.css','game/adventure.css','game/game.css'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>Promise.all(CORE.map(u=>fetch(u,{cache:'reload'}).then(r=>{if(r.ok)return c.put(u,r)}).catch(()=>{})))).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE&&k!==AUD).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET'||r.headers.has('range'))return;const u=new URL(r.url);
  if(/fonts\.(googleapis|gstatic)\.com/.test(u.host)){e.respondWith(caches.match(r).then(hit=>hit||fetch(r).then(res=>{const cp=res.clone();caches.open(CACHE).then(c=>c.put(r,cp));return res})));return}
  if(u.origin!==self.location.origin)return;
  const store=/\/audio\/.*\.mp3$/.test(u.pathname)?AUD:CACHE,key=r.mode==='navigate'?'./':r;
  const net=fetch(r.url,{cache:'no-cache'}).then(res=>{if(res.ok){const cp=res.clone();caches.open(store).then(c=>c.put(key,cp))}return res});
  const old=caches.match(key);
  e.respondWith(new Promise(done=>{let over=false;const fin=v=>{if(!over&&v){over=true;done(v)}};
    net.then(fin,()=>old.then(h=>fin(h||Response.error())));
    setTimeout(()=>old.then(fin),store===AUD?8000:4000)}))});
