import test from "node:test";
import assert from "node:assert/strict";
import {musicTarget,DEFAULT_MUSIC_VOLUME,MusicBed} from "../src/music-bed.mjs";
test("music remains audible with FX disabled and obeys its own switch",()=>{
  assert.equal(musicTarget({fx:false,voice:false,music:true}),DEFAULT_MUSIC_VOLUME/100);
  assert.equal(musicTarget({fx:true,music:false,musicVolume:90}),0);
  assert.equal(musicTarget({musicVolume:150}),1);
  assert.equal(musicTarget({musicVolume:-10}),0);
});
test("strongest overlapping duck wins until its own expiry",()=>{
  const ducks=[{until:7000,factor:.20},{until:1400,factor:.08},{until:800,factor:.01}];
  assert.ok(Math.abs(musicTarget({musicVolume:20},ducks,1000)-.016)<1e-10);
  assert.ok(Math.abs(musicTarget({musicVolume:20},ducks,2000)-.04)<1e-10);
  assert.ok(Math.abs(musicTarget({musicVolume:20},ducks,8000)-.20)<1e-10);
});
test("music loops, mutes and pauses in background",async()=>{
  const saved=globalThis.Audio;const stats={plays:0};
  globalThis.Audio=class FakeAudio {
    constructor(){this.volume=0;this.paused=true;}
    play(){stats.plays++;this.paused=false;return Promise.resolve();}
    pause(){this.paused=true;}
  };
  try{
    const settings={music:true,musicVolume:16,fx:false};
    const music=new MusicBed(()=>settings);
    music.start();assert.equal(music.player.loop,true);assert.equal(stats.plays,1);
    await Promise.resolve();await Promise.resolve();
    music.duckFor(800,.12);assert.equal(music.ducks.length,1);
    music.setVisible(false);assert.equal(music.player.paused,true);
    assert.equal(music.ducks.length,0);
    music.setVisible(true);assert.equal(stats.plays,2);
    settings.music=false;music.sync();assert.equal(music.player.paused,true);
    music.pause();
  }finally{if(saved===undefined)delete globalThis.Audio;else globalThis.Audio=saved;}
});
