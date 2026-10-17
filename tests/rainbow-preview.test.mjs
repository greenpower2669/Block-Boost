import test from "node:test";
import assert from "node:assert/strict";
import {emptyBoard} from "../src/engine.mjs";
import {evaluateSolvePreview,enrichedGuidance} from "../src/solve-preview.mjs";
import {clearingTargets,rewardHaptic} from "../src/haptic-sonar.mjs";
import {Feedback} from "../src/feedback.mjs";

const reward={speedMultiplier:4,noRotationBonus:5};
test("No celebratory colors when move is illegal or completes no line",()=>{
 const b=emptyBoard();
 const noClear=evaluateSolvePreview(b,[[0,0]],3,3,0,reward);
 assert.equal(noClear.valid,true);assert.equal(noClear.intensity,0);
 assert.deepEqual(noClear.cells,[]);
 b[2][3]="sky";
 const blocked=evaluateSolvePreview(b,[[0,0]],3,2,10,reward);
 assert.equal(blocked.valid,false);assert.deepEqual(blocked.cells,[]);
});
test("Prediction glows precisely the eight cells in a completed row",()=>{
 const b=emptyBoard();
 for(let c=0;c<7;c++)b[3][c]="mint";
 const e=evaluateSolvePreview(b,[[0,0]],7,3,0,{speedMultiplier:0,noRotationBonus:0});
 assert.equal(e.lines,1);assert.equal(e.blocks,8);
 assert.deepEqual(e.rows,[3]);assert.deepEqual(e.columns,[]);
 assert.deepEqual(e.cells.slice().sort((a,b)=>a[1]-b[1]),
  Array.from({length:8},(_,c)=>[3,c]));
});
test("Cross has fifteen unique lit blocks not double-counted intersection",()=>{
 const b=emptyBoard();
 for(let c=1;c<8;c++)b[3][c]="mint";
 for(let r=0;r<8;r++)if(r!==3)b[r][0]="rose";
 const e=evaluateSolvePreview(b,[[0,0]],0,3,2,reward);
 assert.equal(e.lines,2);assert.equal(e.blocks,15);
 assert.deepEqual(e.rows,[3]);assert.deepEqual(e.columns,[0]);
 assert.equal(e.cells.length,new Set(e.cells.map(a=>a.join(","))).size);
});
test("More cleared blocks + combo + speed/extra make the spectacle stronger",()=>{
 const a=emptyBoard();for(let c=0;c<7;c++)a[3][c]="rose";
 const one=evaluateSolvePreview(a,[[0,0]],7,3,0,{speedMultiplier:0,noRotationBonus:0});
 const b=emptyBoard();for(let c=1;c<8;c++)b[3][c]="mint";
 for(let r=0;r<8;r++)if(r!==3)b[r][0]="rose";
 const multi=evaluateSolvePreview(b,[[0,0]],0,3,2,reward);
 assert.ok(multi.intensity>one.intensity);
 assert.ok(multi.intensity<=5);
});
test("Guide rises with proximity and reaches strongest level with multiple lines/bonus",()=>{
 const board=emptyBoard();
 for(let c=1;c<8;c++)board[3][c]="mint";
 for(let r=0;r<8;r++)if(r!==3)board[r][0]="rose";
 const targets=clearingTargets(board,[[0,0]]);
 const levels=[4,3,2,1,0].map(dx=>enrichedGuidance(targets,dx,3,2,reward));
 assert.equal(levels[0],0);
 for(let i=1;i<levels.length;i++)assert.ok(levels[i]>=levels[i-1],levels.join(","));
 assert.equal(levels.at(-1),6);
 assert.equal(enrichedGuidance([],0,0,2,reward),0);
});
test("One, two and three completed lines produce graduated tactile rewards",()=>{
 assert.equal(rewardHaptic({type:"clear",lines:1,combo:1,noRotationBonus:5},reward),"lineBonus");
 assert.equal(rewardHaptic({type:"clear",lines:2,combo:1,noRotationBonus:5},reward),"lineDouble");
 assert.equal(rewardHaptic({type:"clear",lines:3,combo:1,noRotationBonus:5},reward),"lineCascade");
 assert.equal(rewardHaptic({type:"clear",lines:1,combo:2,noRotationBonus:5},reward),"comboBonus");
 assert.equal(rewardHaptic({type:"clear",lines:2,combo:2,noRotationBonus:5},reward),"comboDouble");
 assert.equal(rewardHaptic({type:"clear",lines:3,combo:2,noRotationBonus:5},reward),"comboCascade");
});
test("Voices default to OFF but FX and haptics remain available",()=>{
 let captions=0;
 const feedback=new Feedback(()=>({fx:true,haptics:true,voice:false}),()=>"pompom",()=>captions++,()=>{});
 feedback.speak("record",5,true);
 assert.equal(captions,0);
 assert.equal(feedback.lastPhrase,"");
 assert.equal(typeof feedback.fx,"function");
 assert.equal(typeof feedback.rewardHaptic,"function");
});
