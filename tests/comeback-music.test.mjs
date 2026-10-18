import test from "node:test";
import assert from "node:assert/strict";
import {SIZE,SHAPES,PALETTE,emptyBoard,newGame,applyMove,
  comebackChance,comebackBatch,batchProspect} from "../src/engine.mjs";
import {victoryScore,VICTORY_SECONDS} from "../src/victory-music.mjs";

function rng(seed=12345){
 let x=seed>>>0;
 return ()=>{x=(Math.imul(x,1664525)+1013904223)>>>0;return x/4294967296;};
}
test("No comeback handicap without a substantial real previous record",()=>{
 assert.equal(comebackChance(0,0,100),0);
 assert.equal(comebackChance(0,500,100),0);
 assert.equal(comebackChance(0,2000,0),0);
 assert.equal(comebackChance(1800,2000,13),0);
 assert.equal(comebackChance(1220,2000,13),0); // gap 780 < 800 threshold.
});
test("Chance increases only when player is well behind prior high score",()=>{
 const x=comebackChance(200,2000,12);
 assert.ok(x>=.38&&x<=.73);
 assert.ok(comebackChance(0,2000,12)>x);
 assert.equal(comebackChance(1300,2000,12),0);
 assert.equal(comebackChance(1500,2000,12),0);
 assert.equal(comebackChance(500,2000,1),0);
});
test("Lucky trio evaluates legal two-move opportunities, never invents score",()=>{
 const board=emptyBoard();
 for(let i=0;i<SIZE;i++)if(i!==3){board[3][i]="rose";board[i][3]="sky";}
 const a=comebackBatch(board,rng(9847),0);
 const b=comebackBatch(board,rng(9847),1);
 assert.ok(b.pieces.length===3&&a.pieces.length===3);
 assert.ok(batchProspect(board,b.pieces)>=batchProspect(board,a.pieces));
 for(const piece of b.pieces){
   assert.ok(piece.coords.length>=1&&piece.coords.length<=9);
   assert.ok(PALETTE.includes(piece.color));
   assert.equal(piece.used,false);
 }
 assert.deepEqual(board[3][3],null);
});
test("New trio uses previous high score context only; legal moves and cross points unchanged",()=>{
 const base=newGame(rng(42)),board=emptyBoard();
 for(let x=0;x<7;x++)board[3][x]="rose";
 const g={...base,board,score:100,combo:0,moves:5,
   pieces:[{id:0,coords:[[0,0]],color:"sky",used:false},
    {id:1,coords:[[0,0]],color:"mint",used:true},
    {id:2,coords:[[0,0]],color:"coral",used:true}]};
 const out=applyMove(g,0,7,3,rng(477),null,{targetScore:8000});
 assert.equal(out.event.newBatch,true);
 assert.equal(out.game.pieces.length,3);
 assert.equal(typeof out.event.assistedBatch,"boolean");
 assert.equal(out.event.gained,85);
 assert.equal(out.game.score,185);
 const old=applyMove(g,0,7,3,rng(477));
 assert.equal(old.event.assistedBatch,false);
 assert.equal(old.event.gained,85);
});
test("Victory tune is an ORIGINAL layered 4-second circus-disco composition",()=>{
 const score=victoryScore();
 assert.equal(VICTORY_SECONDS,4);
 assert.ok(score.length>=65);
 assert.ok(["lead","bass","brass","tick","boing"].every(
   track=>score.some(n=>n.track===track)));
 const last=Math.max(...score.map(n=>n.at+n.length));
 assert.ok(last>=3.9&&last<=VICTORY_SECONDS);
 for(const n of score){
   assert.ok(Number.isFinite(n.hz)&&n.hz>=120&&n.hz<=1600);
   assert.ok(n.at>=0&&n.at+n.length<=4.0001);
   assert.ok(n.volume<=.1);
 }
 assert.ok(new Set(score.map(n=>n.hz)).size>=14);
 assert.deepEqual(score,victoryScore()); // no rng and reproducible
});
