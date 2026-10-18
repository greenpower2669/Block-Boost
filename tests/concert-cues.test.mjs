import test from "node:test";
import assert from "node:assert/strict";
import {CONCERT_CUES,chooseJingle,jackpotBanner} from "../src/concert-cues.mjs";
import {KENNEY_AUDIO} from "../src/kenney-audio.mjs";
import {EXTRA_LINES,VoiceDirector} from "../src/voice-director.mjs";
test("Jingles are short musical motifs with 1-4 audible notes",()=>{
 for(const [name,notes] of Object.entries(CONCERT_CUES)){
  assert.ok(notes.length>=1&&notes.length<=4,name);
  const end=Math.max(...notes.map(([hz,at,len])=>{
    assert.ok(hz>=250&&hz<=1600);assert.ok(at>=0&&len>=.045&&len<=.16);
    return at+len;
  }));
  assert.ok(end<=.46,name);
 }
 assert.equal(chooseJingle("valid"),"ready");
 assert.equal(chooseJingle("validRotate"),"readyTurn");
 assert.equal(chooseJingle("festival-disco"),"disco");
});
test("All 24 selected Djipie Kenney samples really contain OggS audio",()=>{
 assert.equal(Object.keys(KENNEY_AUDIO).length,24);
 for(const [key,uri] of Object.entries(KENNEY_AUDIO)){
   assert.ok(uri.startsWith("data:audio/ogg;base64,"),key);
   const bytes=Buffer.from(uri.slice(uri.indexOf(",")+1),"base64");
   assert.equal(bytes.toString("ascii",0,4),"OggS",key);
   assert.ok(bytes.length>2000,key);
 }
});
test("Stage banner shows real earned points and combos, without invented values",()=>{
 const c=jackpotBanner({gained:1250,lines:2,combo:3,noRotationBonus:15},
   {speedMultiplier:4});
 assert.match(c.headline,/JACKPOT/);
 assert.match(c.points,/1[\u202f ]?250 POINTS/);
 assert.match(c.details,/2 LIGNES/);
 assert.match(c.details,/COMBO ×3/);
 assert.match(c.details,/VITESSE ×4/);
 assert.match(c.details,/EXTRA SANS ROTATION/);
 assert.equal(jackpotBanner({gained:-20,lines:0,combo:0},{}).points,"+0 POINTS");
});
test("Waouh Hooo Whaa are opt-in voice reactions with anti-repeat",()=>{
 assert.ok(EXTRA_LINES.wow.length>=12);
 const storage={getItem(){return null},setItem(){}};
 const voice=new VoiceDirector(storage,()=>10000,()=>0);
 const first=voice.choose({id:"moka",lines:{}},"wow");
 assert.match(first.phrase,/Waouh|Hooo|Whaa|Woo|Oh|Wou|Hé|Hop/i);
 const second=voice.choose({id:"moka",lines:{}},"wow");
 assert.notEqual(second.phrase,first.phrase);
});
