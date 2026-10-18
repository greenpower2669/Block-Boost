import test from "node:test";
import assert from "node:assert/strict";
import {VoiceDirector,EMOTIONS,VOICE_HISTORY_KEY} from "../src/voice-director.mjs";

function memoryStore(){
 const map=new Map();
 return {getItem:key=>map.get(key)||null,setItem:(k,v)=>map.set(k,v),map};
}
const mascot={lines:{
 welcome:["Bienvenue !"],clear:["Bravo !"],big:["Magnifique !"],
 combo:["On enchaîne !"],record:["Nouveau record !"],over:["À la prochaine !"]
}};
test("emotional profiles distinguish regular clears, combos, wins and consolation",()=>{
 assert.equal(EMOTIONS.clear.mood,"encourage");
 assert.equal(EMOTIONS.combo.mood,"combo");
 assert.equal(EMOTIONS.record.mood,"celebrate");
 assert.equal(EMOTIONS.over.mood,"consolation");
 assert.ok(EMOTIONS.record.priority > EMOTIONS.clear.priority);
});
test("persistent voice director does not repeat a phrase immediately",()=>{
 const st=memoryStore();let now=0;
 const v=new VoiceDirector(st,()=>++now,()=>0);
 const first=v.choose(mascot,"clear");
 const second=v.choose(mascot,"clear");
 assert.notEqual(first.phrase,second.phrase);
 assert.ok(st.map.has(VOICE_HISTORY_KEY));
 const restored=new VoiceDirector(st,()=>++now,()=>0);
 const third=restored.choose(mascot,"clear");
 assert.notEqual(second.phrase,third.phrase);
});
test("history is bounded to 48 spoken sentences and survives corruption",()=>{
 const st=memoryStore(),v=new VoiceDirector(st,()=>Date.now(),()=>0.52);
 for(let i=0;i<120;i++)v.choose(mascot,"combo");
 assert.equal(v.history.length,48);
 st.setItem(VOICE_HISTORY_KEY,"{broken");
 const safe=new VoiceDirector(st);
 assert.equal(safe.history.length,0);
});
test("voice director emits semantics and supports resource-constrained storage",()=>{
 const st={getItem(){throw Error("no storage");},setItem(){throw Error("quota");}};
 const result=new VoiceDirector(st,()=>Date.now(),()=>0.1).choose(mascot,"record",true);
 assert.equal(result.mood,"celebrate");
 assert.equal(result.priority,5);
 assert.equal(typeof result.phrase,"string");
});
