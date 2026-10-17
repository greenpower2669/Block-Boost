import test from "node:test";
import assert from "node:assert/strict";
import {emptyBoard,newGame,rotate} from "../src/engine.mjs";
import {clearingTargets,proximityStrength,rewardHaptic} from "../src/haptic-sonar.mjs";
import {sanitizeSave} from "../src/storage.mjs";

test("No haptic sonar if no legal placement clears any line",()=>{
  const board=emptyBoard();
  assert.deepEqual(clearingTargets(board,[[0,0]]),[]);
  assert.equal(proximityStrength([],3,4),0);
});
test("Only actually legal completed lines qualify as guidance targets",()=>{
  const board=emptyBoard();
  for(let x=0;x<7;x++)board[3][x]="mint";
  const targets=clearingTargets(board,[[0,0]]);
  assert.deepEqual(targets,[{x:7,y:3,lines:1}]);
  assert.equal(proximityStrength(targets,7,3),4);
  assert.equal(proximityStrength(targets,6,3),3);
  assert.equal(proximityStrength(targets,5,3),2);
  assert.equal(proximityStrength(targets,4,3),1);
  assert.equal(proximityStrength(targets,3,3),0);
});
test("A second row/column clear increases lines but never invents blocked locations",()=>{
  const board=emptyBoard();
  for(let c=1;c<8;c++)board[2][c]="rose";
  for(let r=0;r<8;r++)if(r!==2)board[r][0]="sky";
  const targets=clearingTargets(board,[[0,0]]);
  assert.deepEqual(targets,[{x:0,y:2,lines:2}]);
});
test("Rotation recalculates winning anchors; no guidance on an impossible orientation",()=>{
  const board=emptyBoard();
  for(let x=2;x<8;x++)board[4][x]="sky";
  const horizontal=[[0,0],[1,0]];
  const before=clearingTargets(board,horizontal);
  assert.ok(before.some(t=>t.x===0&&t.y===4));
  const vertical=rotate(horizontal);
  const after=clearingTargets(board,vertical);
  assert.ok(!after.some(t=>t.x===0&&t.y===4));
});
test("No points/bonuses on invalid move; rewards distinguish combos lines speed and extra",()=>{
  assert.equal(rewardHaptic({type:"invalid"},{speedMultiplier:4}),null);
  assert.equal(rewardHaptic({type:"placed",lines:0,noRotationBonus:0},{speedMultiplier:0}),"drop");
  assert.equal(rewardHaptic({type:"placed",lines:0,noRotationBonus:5},{speedMultiplier:0}),"extra");
  assert.equal(rewardHaptic({type:"placed",lines:0,noRotationBonus:0},{speedMultiplier:2}),"speed");
  assert.equal(rewardHaptic({type:"placed",lines:0,noRotationBonus:0},{speedMultiplier:4}),"speedHigh");
  assert.equal(rewardHaptic({type:"placed",lines:0,noRotationBonus:5},{speedMultiplier:4}),"speedExtra");
  assert.equal(rewardHaptic({type:"clear",lines:1,combo:1,noRotationBonus:0},{speedMultiplier:0}),"line");
  assert.equal(rewardHaptic({type:"clear",lines:1,combo:1,noRotationBonus:5},{speedMultiplier:0}),"lineBonus");
  assert.equal(rewardHaptic({type:"clear",lines:1,combo:2,noRotationBonus:0},{speedMultiplier:0}),"combo");
  assert.equal(rewardHaptic({type:"clear",lines:2,combo:3,noRotationBonus:15},{speedMultiplier:3}),"comboDouble");
  assert.equal(rewardHaptic({type:"clear",lines:3,combo:3,noRotationBonus:15},{speedMultiplier:3}),"comboCascade");
});
test("Haptic guidance setting migrates and defaults to true without resetting scores",()=>{
 const d=sanitizeSave({version:1,bestScore:1234,lastScore:100,gamesPlayed:3,bestCombo:2,
   settings:{voice:true,fx:false,reducedMotion:false,haptics:true}});
 assert.equal(d.settings.hapticGuidance,true);
 assert.equal(d.bestScore,1234);
 const off=sanitizeSave({version:1,bestScore:500,settings:{hapticGuidance:false}});
 assert.equal(off.settings.hapticGuidance,false);
});
