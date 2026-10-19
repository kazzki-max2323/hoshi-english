// 星降るイングリッシュ: offline cache
const CACHE='hoshienglish-v15';
const CORE=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png','apple-touch-icon.png',
 'beach/scene.js','beach/scene.css','beach/host.js','beach/host-after.js','game/levels/index.js','game/levels/es.js','game/levels/jh.js','game/levels/hs.js','game/levels/adv.js',
 'audio/es.mp3','audio/es.json','audio/jh.mp3','audio/jh.json','audio/hs.mp3','audio/hs.json','audio/adv.mp3','audio/adv.json','audio/suika.mp3','audio/suika.json','audio/pop.mp3','audio/pop.json','audio/season.mp3','audio/season.json','audio/star.mp3','audio/star.json','audio/folk.mp3','audio/folk.json','game/extras/pop.js','game/extras/season.js','game/extras/folk.js','game/catalog.js','game/game.js','game/adventure.js','game/adventure.css','game/game.css'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;if(new URL(e.request.url).origin!==self.location.origin&&!/fonts\.(googleapis|gstatic)\.com/.test(e.request.url))return;
  e.respondWith(caches.match(e.request).then(hit=>{const net=fetch(e.request).then(res=>{if(res&&(res.ok||res.type==='opaque')){const cp=res.clone();caches.open(CACHE).then(c=>c.put(e.request,cp))}return res}).catch(()=>hit);return hit||net}))});
