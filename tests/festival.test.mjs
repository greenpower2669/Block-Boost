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
test("six named families are available; small clear is not always the same rainbow",()=>{
 assert.deepEqual(Object.keys(FESTIVAL_THEMES).sort(),
   ["forest","crystal","electric","fireworks","galaxy","disco"].sort());
 assert.equal(chooseFestival(sample(1,1,80),{speedMultiplier:0,noRotationBonus:0}).theme,"forest");
 assert.equal(chooseFestival(sample(1,1,80),{speedMultiplier:0,noRotationBonus:0},"forest").theme,"crystal");
 assert.equal(chooseFestival(sample(1,1,80),bonus).theme,"electric");
 assert.equal(chooseFestival(sample(1,1,80),{speedMultiplier:0,noRotationBonus:5}).theme,"crystal");
 assert.equal(chooseFestival(sample(2,1,380),{speedMultiplier:1}).theme,"fireworks");
});
test("disco ball only emerges on real large combos, many lines or very high points",()=>{
 const disco=chooseFestival(sample(2,2,650),bonus);
 assert.equal(disco.theme,"disco");
 assert.ok(disco.level>=3);
 assert.ok(disco.particles<=58);
 assert.equal(chooseFestival(sample(2,2,650),bonus,"disco").theme,"galaxy");
 assert.equal(chooseFestival(sample(3,1,980),bonus).theme,"disco");
 assert.notEqual(chooseFestival(sample(1,1,190),bonus).theme,"disco");
});
test("Invalid/no-bonus move does not celebrate; no strobing or scoring mechanics",()=>{
 assert.equal(chooseFestival({type:"invalid",lines:4,gained:4000},bonus).theme,null);
 assert.equal(chooseFestival({type:"placed",lines:0,gained:5},{speedMultiplier:0,noRotationBonus:0}).theme,null);
 assert.equal(previewTheme(0,9,bonus),"");
 assert.equal(previewTheme(2,2,bonus),"disco");
});
test("preview identifies different visual families by real event shape",()=>{
 assert.equal(previewTheme(1,0,{speedMultiplier:0,noRotationBonus:0}),"forest");
 assert.equal(previewTheme(1,0,{speedMultiplier:0,noRotationBonus:5}),"crystal");
 assert.equal(previewTheme(1,0,{speedMultiplier:4,noRotationBonus:0}),"electric");
 assert.equal(previewTheme(2,0,{speedMultiplier:0,noRotationBonus:0}),"fireworks");
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
