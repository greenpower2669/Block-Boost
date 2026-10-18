import test from "node:test";
import assert from "node:assert/strict";
import {chooseFestival,previewTheme,FESTIVAL_THEMES} from "../src/festival.mjs";
import {KENNEY_AUDIO} from "../src/kenney-audio.mjs";

const bonus={speedMultiplier:4,noRotationBonus:5};
function sample(lines=1,combo=1,gained=120){
 return {type:lines?"clear":"placed",lines,combo,gained,
   clearedCells:Array.from({length:lines*8},(_,i)=>[Math.floor(i/8),i%8]),
   noRotationBonus:0};
}
test("seven named families are available; small clear is not always the same rainbow",()=>{
 assert.deepEqual(Object.keys(FESTIVAL_THEMES).sort(),
   ["forest","crystal","electric","fireworks","galaxy","disco","bubbles"].sort());
 assert.equal(chooseFestival(sample(1,1,80),{speedMultiplier:0,noRotationBonus:0}).theme,"forest");
 assert.equal(chooseFestival(sample(1,1,80),{speedMultiplier:0,noRotationBonus:0},"forest").theme,"crystal");
 assert.equal(chooseFestival(sample(1,1,80),bonus).theme,"electric");
 assert.equal(chooseFestival(sample(1,1,80),{speedMultiplier:0,noRotationBonus:5}).theme,"crystal");
 assert.equal(chooseFestival(sample(2,1,380),{speedMultiplier:1}).theme,"bubbles");
});
test("large jackpots restore the disco, ordinary doubles remain bubbles",()=>{
 const quiet=chooseFestival(sample(2,1,330),{speedMultiplier:1});
 assert.equal(quiet.theme,"bubbles");
 assert.equal(quiet.bubbles,true);
 assert.equal(quiet.cross,false);
 const jackpot=chooseFestival(sample(2,3,990),bonus);
 assert.equal(jackpot.theme,"disco");
 assert.equal(jackpot.bubbles,false);
 assert.equal(jackpot.jackpot,true);
 // A repeat jackpot must NOT downgrade the ball to galaxy.
 assert.equal(chooseFestival(sample(2,3,990),bonus,"disco").theme,"disco");
 assert.equal(chooseFestival(sample(3,1,980),bonus).theme,"disco");
 assert.ok(jackpot.level>=3);
 assert.ok(jackpot.particles<=58);
});
test("cross x10 launches disco AND translucent bubbles on the same scene",()=>{
 const event={...sample(2,1,3245),crossMultiplier:10,
   clearedRows:[3],clearedColumns:[3]};
 const scene=chooseFestival(event,bonus);
 assert.equal(scene.theme,"disco");
 assert.equal(scene.cross,true);
 assert.equal(scene.bubbles,true);
 assert.equal(scene.crossMultiplier,10);
 assert.equal(scene.jackpot,true);
 assert.equal(previewTheme(2,1,bonus,{cross:true,gained:3245}),"disco");
 assert.equal(previewTheme(2,1,{speedMultiplier:1},{cross:false,gained:330}),"bubbles");
});
test("Invalid/no-bonus move does not celebrate; no strobing or scoring mechanics",()=>{
 assert.equal(chooseFestival({type:"invalid",lines:4,gained:4000},bonus).theme,null);
 assert.equal(chooseFestival({type:"placed",lines:0,gained:5},{speedMultiplier:0,noRotationBonus:0}).theme,null);
 assert.equal(previewTheme(0,9,bonus),"");
 assert.equal(previewTheme(2,2,bonus,{gained:650}),"disco");
});
test("preview identifies different visual families by real event shape",()=>{
 assert.equal(previewTheme(1,0,{speedMultiplier:0,noRotationBonus:0}),"forest");
 assert.equal(previewTheme(1,0,{speedMultiplier:0,noRotationBonus:5}),"crystal");
 assert.equal(previewTheme(1,0,{speedMultiplier:4,noRotationBonus:0}),"electric");
 assert.equal(previewTheme(2,0,{speedMultiplier:0,noRotationBonus:0}),"bubbles");
 assert.equal(previewTheme(1,3,{speedMultiplier:0,noRotationBonus:0}),"galaxy");
});
test("Djipie selected Kenney OGG sound set is real offline audio, without Sonniss",()=>{
 assert.equal(Object.keys(KENNEY_AUDIO).length,24);
 for(const [key,uri] of Object.entries(KENNEY_AUDIO)){
   assert.match(uri,/^data:audio\/ogg;base64,/);
   const data=Buffer.from(uri.split(",")[1],"base64");
   assert.equal(data.toString("utf8",0,4),"OggS",key);
   assert.ok(data.length>=2000&&data.length<=70000,key);
 }
});
