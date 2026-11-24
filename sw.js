const C='kama-nishar-v2';
const F=['./','./index.html','./manifest.json','./icon-192.png','./icon-512.png','./icon-maskable.png','./apple-touch-icon.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(F)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const req=e.request;
  if(req.method!=='GET'||new URL(req.url).origin!==location.origin)return;
  const put=res=>{if(res.ok){const cp=res.clone();caches.open(C).then(c=>c.put(req,cp))}return res};
  if(req.mode==='navigate'){
    // pages: network first, so every update you push to GitHub shows up right away
    e.respondWith(fetch(req).then(put).catch(()=>caches.match(req,{ignoreSearch:true}).then(r=>r||caches.match('./index.html'))));
    return;
  }
  // icons and other files: cache first, works offline
  e.respondWith(caches.match(req,{ignoreSearch:true}).then(r=>r||fetch(req).then(put)));
});
