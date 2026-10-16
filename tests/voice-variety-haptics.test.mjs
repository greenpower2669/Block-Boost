import test from "node:test";
import assert from "node:assert/strict";
import {PlacementCueGate} from "../src/placement-cues.mjs";
import {CHARACTER_LINES,SHARED_LINES,CHARACTER_COUNT,SHARED_COUNT} from "../src/phrase-bank.mjs";
import {VoiceDirector} from "../src/voice-director.mjs";

test("Large bank covers six mascots and all expressive events",()=>{
 assert.equal(Object.keys(CHARACTER_LINES).length,6);
 assert.equal(CHARACTER_COUNT,288);
 assert.equal(SHARED_COUNT,100);
 for(const [name,events] of Object.entries(CHARACTER_LINES)){
   assert.deepEqual(Object.keys(events).sort(),
     ["welcome","clear","big","combo","record","over","speed4","noRotation"].sort(),name);
   for(const [kind,lines] of Object.entries(events)){
     assert.equal(lines.length,6,name+"/"+kind);
     assert.equal(new Set(lines).size,lines.length,name+"/"+kind+" duplicates");
   }
 }
});
test("48-history avoids repeat across mascots and after reload",()=>{
 const map=new Map(),storage={getItem:k=>map.get(k)??null,setItem:(k,v)=>map.set(k,v)};
 let clock=10000;const director=new VoiceDirector(storage,()=>clock++,()=>0);
 const mascot={id:"lilo",lines:{}};
 const first=director.choose(mascot,"clear").phrase;
 const second=director.choose(mascot,"clear").phrase;
 assert.notEqual(first,second);
 const afterRestart=new VoiceDirector(storage,()=>clock++,()=>0);
 const third=afterRestart.choose(mascot,"clear").phrase;
 assert.notEqual(third,first);
 assert.notEqual(third,second);
});
test("All speed announcements speak the earned tier",()=>{
 for(const [event,regex] of Object.entries({speed2:/deux|double|turbo/i,speed3:/trois|triple|fusée/i,speed4:/quatre|éclair/i})){
   for(const id of Object.keys(CHARACTER_LINES)){
     const v=new VoiceDirector({getItem(){return null},setItem(){}},()=>1234,()=>0.2);
     const speech=v.choose({id,lines:{}},event);
     assert.match(speech.phrase,regex,id+"/"+event);
   }
 }
});
test("Valid target produces one dling only on invalid→valid transition",()=>{
 const gate=new PlacementCueGate(540);
 assert.equal(gate.update(false,100),null);
 assert.equal(gate.update(true,200),"valid");
 assert.equal(gate.update(true,210),null);
 assert.equal(gate.update(true,730),null,"moving on valid tiles must remain silent");
 assert.equal(gate.update(false,740),null);
 assert.equal(gate.update(true,750),"valid");
});
test("Haptic/sound readiness respects cooldown and rotation transitions",()=>{
 const gate=new PlacementCueGate(540);
 assert.equal(gate.update(true,100,false),null,"no cue on tray pickup");
 assert.equal(gate.update(false,110),null);
 assert.equal(gate.update(true,300,true,true),"validRotate");
 assert.equal(gate.update(false,500),null);
 assert.equal(gate.update(true,600),null,"suppressed by cooldown");
 assert.equal(gate.update(false,850),null);
 assert.equal(gate.update(true,880),"valid");
 gate.reset();
 assert.equal(gate.update(true,881),"valid","new piece starts with clean gate");
});
