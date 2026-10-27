const CACHE="blockboost-logo-transparent-20261027-v1";
const FILES=["./","./index.html","./styles.css","./src/engine.mjs","./src/storage.mjs",
  "./src/feedback.mjs","./src/music-bed.mjs","./src/bonus.mjs","./src/placement-cues.mjs","./src/haptic-sonar.mjs","./src/solve-preview.mjs","./src/winning-snap.mjs","./src/festival.mjs","./src/fireworks.mjs","./src/result-celebration.mjs","./src/concert-cues.mjs","./src/victory-music.mjs","./src/private-audio.mjs","./src/disco-sprites.mjs","./src/kenney-audio.mjs","./src/phrase-bank.mjs","./src/voice-director.mjs","./src/main.mjs","./manifest.webmanifest","./assets/blockboost-logo.webp"];
self.addEventListener("install",event=>{
  event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(FILES)).then(()=>self.skipWaiting()));
});
self.addEventListener("activate",event=>{
  event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))))
    .then(()=>self.clients.claim()));
});
self.addEventListener("fetch",event=>{
  if(event.request.method!=="GET"||new URL(event.request.url).origin!==self.location.origin)return;
  // Never answer an MP3 Range request with a full cached body.
  if(new URL(event.request.url).pathname.endsWith("/Blockboostmusic.mp3"))return;
  event.respondWith(caches.match(event.request).then(cached=>cached||fetch(event.request)));
});
