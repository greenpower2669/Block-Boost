import test from "node:test";
import assert from "node:assert/strict";
import {speedTier,evaluateBonus} from "../src/bonus.mjs";
import {newGame,applyMove,rotatePiece} from "../src/engine.mjs";
import {VoiceDirector} from "../src/voice-director.mjs";

test("Speed bonus has exact 4→0 boundaries (milliseconds)",()=>{
  for(const [ms,expected] of [[0,4],[2000,4],[2001,3],[4000,3],
    [4001,2],[7000,2],[7001,1],[11000,1],[11001,0],[900000,0],
    [-7,0],[Number.NaN,0]]){
    assert.equal(speedTier(ms).multiplier,expected,"duration="+ms);
  }
});
test("No-rotation EXTRA is independent of speed and lost even after four rotations",()=>{
  const x=evaluateBonus(3,500,0);
  assert.equal(x.speedMultiplier,4);assert.equal(x.speedBonus,60);assert.equal(x.noRotationBonus,15);
  const turned=evaluateBonus(3,500,4);
  assert.equal(turned.speedBonus,60);assert.equal(turned.noRotationBonus,0);
  const slow=evaluateBonus(3,20000,0);
  assert.equal(slow.speedMultiplier,0);assert.equal(slow.speedBonus,0);
  assert.equal(slow.noRotationBonus,15);
});
test("A normal placement credits base+speed+extra, and ×0 does not suppress normal points",()=>{
  const a=newGame(()=>0);
  const first=applyMove(a,0,0,0,()=>0,evaluateBonus(1,500,0));
  assert.equal(first.event.basePoints,5);
  assert.equal(first.event.speedBonus,20);
  assert.equal(first.event.noRotationBonus,5);
  assert.equal(first.event.gained,30);
  assert.equal(first.game.score,30);
  const second=applyMove(first.game,1,2,2,()=>0,evaluateBonus(1,15000,0));
  assert.equal(second.event.speedMultiplier,0);
  assert.equal(second.event.basePoints,5);
  assert.equal(second.event.noRotationBonus,5);
  assert.equal(second.event.gained,10);
});
test("Rotated placement earns speed but no EXTRA",()=>{
  const a=newGame(()=>0);
  const rotated=rotatePiece(a,1);
  const cells=rotated.pieces[1].coords.length;
  const r=applyMove(rotated,1,2,2,()=>0,evaluateBonus(cells,3000,1));
  assert.equal(r.event.speedMultiplier,3);
  assert.equal(r.event.speedBonus,cells*15);
  assert.equal(r.event.noRotationBonus,0);
});
test("Invalid placements never score bonus or consume piece",()=>{
  const a=newGame(()=>0);
  const r=applyMove(a,0,-1,-1,()=>0,evaluateBonus(1,100,0));
  assert.equal(r.event.type,"invalid");assert.equal(r.game.score,0);
  assert.equal(r.game.pieces[0].used,false);
});
test("Voice director announces speed ×2, speed ×4 and no-rotation explicitly",()=>{
  const v=new VoiceDirector({getItem(){return null},setItem(){}},()=>123456,()=>0);
  const mascot={lines:{}};
  const fast=v.choose(mascot,"speed4");
  const medium=v.choose(mascot,"speed2");
  const extra=v.choose(mascot,"noRotation");
  assert.match(fast.phrase,/quatre|Quatre|éclair|Éclair/i);
  assert.match(medium.phrase,/deux|Turbo/i);
  assert.match(extra.phrase,/rotation|direct/i);
  assert.equal(fast.mood,"celebrate");
});
