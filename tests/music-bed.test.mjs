import test from "node:test";
import assert from "node:assert/strict";
import {musicTarget,DEFAULT_MUSIC_VOLUME,MusicBed,GUITAR_DUCK_FACTOR,GUITAR_DUCK_MS,GUITAR_FADE_DOWN_MS,GUITAR_FADE_UP_MS} from "../src/music-bed.mjs";
import {Feedback} from "../src/feedback.mjs";
test("music remains audible with FX disabled and obeys its own switch",()=>{
  assert.equal(musicTarget({fx:false,voice:false,music:true}),DEFAULT_MUSIC_VOLUME/100);
  assert.equal(musicTarget({fx:true,music:false,musicVolume:90}),0);
  assert.equal(musicTarget({musicVolume:150}),1);
  assert.equal(musicTarget({musicVolume:-10}),0);
});
test("the soft guitar duck is partial and lasts through the guitar cue",()=>{
  assert.equal(GUITAR_DUCK_FACTOR,.55);
  assert.equal(GUITAR_DUCK_MS,4900);
  assert.ok(GUITAR_FADE_DOWN_MS>=1000);
  assert.ok(GUITAR_FADE_UP_MS>=1500);
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

test("ordinary FX, voices, regular fanfare and fireworks never duck music",()=>{
  const feedback=new Feedback(()=>({music:true,musicVolume:16,fx:true,voice:true}),()=>"pompom",()=>{},()=>{});
  const duckCalls=[];
  feedback.music={start(){},duckFor(...args){duckCalls.push(args);},releaseGuitar(){}};
  feedback.fx("drop");feedback.fx("combo");feedback.fx("festival-disco");
  feedback.speak("welcome",1,true);
  feedback.playFireworksAudio();feedback.stopFireworksAudio();
  assert.deepEqual(duckCalls,[]);
});
test("guitar is the only ducking trigger, and stopping it releases smoothly",()=>{
  const feedback=new Feedback(()=>({music:true,musicVolume:16,fx:true,voice:false}),()=>"pompom",()=>{},()=>{});
  const calls=[];
  feedback.music={start(){},duckFor(){calls.push("duck");},releaseGuitar(){calls.push("release");}};
  // Simulate the private GitHub Actions asset availability independently
  // of the public empty audio manifest.
  const native=feedback.special;
  feedback.special=(event)=>event==="result-guitar";
  // Public manifest may be empty; this test validates the dedicated trigger
  // path without changing or exposing the 21 licensed audio assets.
  feedback.playResultGuitar();
  assert.equal(calls.filter(x=>x==="duck").length,0);
  feedback.stopResultGuitar();
  assert.equal(calls.at(-1),"release");
  feedback.special=native;
});
