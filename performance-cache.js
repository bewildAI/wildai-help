const CACHE="wildai-assets-812d6f311261";
const CORE=["/assets/optimized/style.66d3f2cff68a.css","/assets/optimized/app.fd4e2fd92ca1.js","/assets/optimized/wildai-logo.3e92c2f512a7.svg","/assets/optimized/favicon.ad9efa512d54.svg"];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(CORE)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('wildai-assets-')&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',event=>{
 const request=event.request,url=new URL(request.url);
 if(request.method!=='GET'||url.origin!==self.location.origin||!url.pathname.startsWith('/assets/optimized/'))return;
 event.respondWith(caches.open(CACHE).then(async cache=>{
  const cached=await cache.match(request);if(cached)return cached;
  const response=await fetch(request);
  if(response.ok&&response.type==='basic')event.waitUntil(cache.put(request,response.clone()).catch(()=>{}));
  return response;
 }).catch(()=>fetch(request)));
});