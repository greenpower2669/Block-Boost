import test from "node:test";
import assert from "node:assert/strict";
import {BackgroundMusic,MUSIC_MIX} from "../src/background-music.mjs";
const wait=ms=>new Promise(r=>setTimeout(r,ms));
test("looped quiet music ducks for sound and returns gently",async()=>{
 const prior=globalThis.Audio;
 class FakeAudio{constructor(src){this.src=src;this.paused=true;this.volume=0;}play(){this.paused=false;return Promise.resolve();}pause(){this.paused=true;}}
 globalThis.Audio=FakeAudio;
 try{
  const music=new BackgroundMusic(()=>true);
  assert.equal(music.start(),true);
  await wait(MUSIC_MIX.fadeInMs+100);
  assert.equal(music.player.loop,true);
  assert.match(music.player.src,/Blockboostmusic.mp3/);
  assert.ok(Math.abs(music.player.volume-.10)<.01);
  music.duck(360);
  await wait(MUSIC_MIX.attackMs+90);
  assert.ok(music.player.volume<=.035);
  await wait(MUSIC_MIX.releaseMs+400);
  assert.ok(music.player.volume>=.09);
  music.pause();assert.equal(music.player.paused,true);
  music.setEnabled(true);await wait(30);assert.equal(music.player.paused,false);
  music.setEnabled(false);assert.equal(music.player.paused,true);
 }finally{globalThis.Audio=prior;}
});
test("disabled music does not allocate a player",()=>{
 const music=new BackgroundMusic(()=>false);
 assert.equal(music.start(),false);
 music.duck(300);
 assert.equal(music.player,null);
 assert.equal(music.restoreTimer,null);
});
