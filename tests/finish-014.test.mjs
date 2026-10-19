import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {emptyBoard,SHAPES,rotate,normalize,pieceBatch,DRAW_CONFIG,canPlace,
  comebackBatch,comebackChance} from "../src/engine.mjs";
import {clearingTargets} from "../src/haptic-sonar.mjs";
import {winningSnap,WIN_SNAP} from "../src/winning-snap.mjs";
const seeded=seed=>()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/4294967296);
const key=c=>JSON.stringify(normalize(c));
test("New L3, full existing square, four rare diagonal bars and rotations",()=>{
  const keys=new Set(SHAPES.map(key));
  for(const c of [[[0,0],[1,0],[0,1]],[[0,0],[1,0],[0,1],[1,1]],
      [[0,0],[1,1]],[[1,0],[0,1]],[[0,0],[1,1],[2,2]],[[2,0],[1,1],[0,2]]])
    assert.ok(keys.has(key(c)));
  let l=[[0,0],[1,0],[0,1]];
  for(let i=0;i<4;i++)l=rotate(l);
  assert.equal(key(l),key([[0,0],[1,0],[0,1]]));
});
test("Winning placement acquires and holds a tiny downward release wobble",()=>{
  const board=emptyBoard();
  for(let c=0;c<7;c++)board[0][c]="mint";
  const targets=clearingTargets(board,[[0,0]]);
  assert.deepEqual(targets,[{x:7,y:0,lines:1}]);
  let win=winningSnap(targets,7.04,.07);
  assert.deepEqual(win,{x:7,y:0,lines:1});
  win=winningSnap(targets,7.04,.54,win);
  assert.deepEqual(win,{x:7,y:0,lines:1});
  assert.ok(canPlace(board,[[0,0]],win.x,win.y));
  assert.equal(winningSnap(targets,6.1,1.4,win),null);
  assert.equal(winningSnap(targets,2,2),null);
  assert.equal(winningSnap([],7,0),null);
  assert.equal(winningSnap(targets,7.04,.59,null),null);
  assert.ok(WIN_SNAP.keepRadius<1);
});
test("Rotation cannot keep a no-longer-legal locked winning anchor",()=>{
  const board=emptyBoard();
  for(let c=0;c<7;c++)board[0][c]="mint";
  board[1][7]="rose";
  const old=clearingTargets(board,[[0,0]]);
  const rotated=clearingTargets(board,[[0,0],[0,1]]);
  assert.equal(winningSnap(rotated,7,0,old[0]),null);
});
test("Statistical diagonal rarity, single diagonal per trio and adaptive large forms",()=>{
  const early=emptyBoard(),late=emptyBoard();
  for(let y=3;y<8;y++)for(let x=0;x<8;x++)if((x+y)%2===0)late[y][x]="rose";
  const rareKeys=new Set([key([[0,0],[1,1]]),key([[1,0],[0,1]]),
    key([[0,0],[1,1],[2,2]]),key([[2,0],[1,1],[0,2]])]);
  const a=seeded(77),b=seeded(77);
  let rare=0,largeStart=0,largeLate=0;
  for(let n=0;n<800;n++){
    const first=pieceBatch(a,early),later=pieceBatch(b,late);
    const count=first.filter(p=>rareKeys.has(key(p.coords))).length;
    assert.ok(count<=1);
    rare+=count;
    largeStart+=first.filter(p=>p.coords.length>=DRAW_CONFIG.largeMinCells).length;
    largeLate+=later.filter(p=>p.coords.length>=DRAW_CONFIG.largeMinCells).length;
    for(const p of later){
      let form=p.coords,playable=false;
      for(let k=0;k<4;k++){
        playable ||= late.some((row,y)=>row.some((_,x)=>canPlace(late,form,x,y)));
        form=rotate(form);
      }
      assert.ok(playable,"All weighted pieces must be placeable with permitted rotation");
    }
  }
  assert.ok(rare>0&&rare/(800*3)<.035);
  assert.ok(largeStart>largeLate);
});
test("Highscore comeback gate keeps its old contract",()=>{
  assert.equal(comebackBatch(emptyBoard(),seeded(10),.7).pieces.length,3);
  assert.ok(comebackChance(50,4500,15)>0);
  assert.equal(comebackChance(4400,4500,15),0);
});
test("CSS rotates a registered angle rather than the physical pieces",()=>{
  const css=readFileSync(new URL("../styles.css",import.meta.url),"utf8");
  assert.ok(css.includes("@property --rainbow-phase"));
  assert.ok(css.includes("--rainbow-phase:360deg"));
  assert.ok(css.includes("conic-gradient(from calc(var(--rainbow-index"));
  assert.ok(css.includes("body.reduce-motion .board .cell.will-solve::after"));
});
