import test from "node:test";
import assert from "node:assert/strict";
import {crossedFireworkMilestones,fireworkSchedule,
 FIREWORKS_STEP,FIREWORKS_DURATION_MS} from "../src/fireworks.mjs";
import {RESULT_SCENES} from "../src/result-celebration.mjs";
test("Session starts at 0: no reward until 1000, then each 1000 points",()=>{
 assert.equal(FIREWORKS_STEP,1000);
 assert.equal(FIREWORKS_DURATION_MS,6000);
 assert.deepEqual(crossedFireworkMilestones(0,999),[]);
 assert.deepEqual(crossedFireworkMilestones(999,1000),[1000,1000]);
 assert.deepEqual(crossedFireworkMilestones(1000,1999),[]);
 assert.deepEqual(crossedFireworkMilestones(1999,2002),[2000,2000]);
 assert.deepEqual(crossedFireworkMilestones(100,5500),[1000,5000]);
 // A new game uses score zero and re-arms 1000 regardless of old record.
 assert.deepEqual(crossedFireworkMilestones(0,1005),[1000,1000]);
 assert.deepEqual(crossedFireworkMilestones(900,899),[]);
 assert.deepEqual(crossedFireworkMilestones(-1,1100),[]);
});
test("A six-second show contains bounded colored fireworks, no full-screen flashes",()=>{
 const values=Array.from({length:30},(_,i)=>(i*.071)%1);let n=0;
 const a=fireworkSchedule(()=>values[n++%values.length],false);
 assert.equal(a.length,9);
 assert.ok(a.every(b=>b.x>=12&&b.x<=88&&b.y>=12&&b.y<=65));
 assert.ok(a.every(b=>b.delay>=0&&b.delay<=4700&&b.rays>=8&&b.rays<=14));
 const low=fireworkSchedule(()=>.5,true);
 assert.equal(low.length,4);
 assert.ok(low.every(x=>x.rays===0&&x.delay===0));
});
test("Record: disco, bubbles and fireworks sequentially, final fireworks exactly 6s",()=>{
 assert.deepEqual(RESULT_SCENES.map(s=>s.id),["disco","bubbles","fireworks"]);
 assert.ok(RESULT_SCENES.every(s=>s.durationMs>0));
 assert.equal(RESULT_SCENES[2].durationMs,6000);
 assert.equal(RESULT_SCENES.reduce((a,s)=>a+s.durationMs,0),12000);
});
