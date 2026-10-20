import test from "node:test";
import assert from "node:assert/strict";
import {SIZE,emptyBoard,SHAPES,bounds,normalize,rotate,canPlace,hasLegalMove,newGame,applyMove,rotatePiece,sanitizeGame} from "../src/engine.mjs";
import {loadSave,writeSave,checkpoint,finish,sanitizeSave,SAVE_KEY} from "../src/storage.mjs";

const single={id:0,coords:[[0,0]],color:"sky",used:false};
const bigger={id:1,coords:[[0,0],[1,0]],color:"mint",used:false};
const tri={id:2,coords:[[0,0],[1,0],[0,1]],color:"rose",used:false};
function game(board=emptyBoard(),pieces=[single,bigger,tri]){
  return {...newGame(()=>0),board,pieces:structuredClone(pieces),score:0,combo:0,bestCombo:0,moves:0,gameOver:false};
}
function mockStorage(){
  const map=new Map();
  return {getItem:k=>map.has(k)?map.get(k):null,setItem:(k,v)=>map.set(k,v),clear:()=>map.clear(),get raw(){return map;}};
}
test("new game gives an 8×8 grid and three usable pieces",()=>{
  const g=newGame(()=>0);
  assert.equal(g.board.length,SIZE);
  assert.equal(g.board.every(r=>r.length===SIZE&&r.every(v=>v===null)),true);
  assert.equal(g.pieces.length,3);
  assert.equal(hasLegalMove(g.board,g.pieces),true);
});
test("rotation 90 degrees works for all forms, and four rotations restore shape",()=>{
  for(const coords of SHAPES){
    let rotated=coords;
    for(let i=0;i<4;i++) rotated=rotate(rotated);
    assert.deepEqual(normalize(rotated),normalize(coords));
  }
  assert.deepEqual(rotate([[0,0],[1,0],[2,0]]),[[0,0],[0,1],[0,2]]);
});
test("rotating a selected piece never occupies board cells or changes score",()=>{
  const g=game(),out=rotatePiece(g,1);
  assert.notDeepEqual(out.pieces[1].coords,g.pieces[1].coords);
  assert.deepEqual(out.board,g.board);assert.equal(out.score,g.score);
});
test("invalid move does not consume shape or points",()=>{
  const g=game();
  const res=applyMove(g,1,7,7);
  assert.equal(res.event.type,"invalid");assert.strictEqual(res.game,g);
  assert.equal(g.pieces[1].used,false);
});
test("single row clear disappears without gravity",()=>{
  const board=emptyBoard();for(let x=0;x<7;x++)board[2][x]="coral";
  board[0][0]="sky";
  const r=applyMove(game(board),0,7,2);
  assert.deepEqual(r.event.clearedRows,[2]);assert.deepEqual(r.event.clearedColumns,[]);
  assert.equal(r.game.board[0][0],"sky");
  assert.equal(r.game.board[2].every(v=>v===null),true);
  assert.equal(r.event.gained,85);
});
test("cross clears row and column, counting intersection once",()=>{
  const board=emptyBoard();
  for(let i=0;i<SIZE;i++)if(i!==3){board[3][i]="coral";board[i][3]="sky";}
  const r=applyMove(game(board),0,3,3);
  assert.deepEqual(r.event.clearedRows,[3]);assert.deepEqual(r.event.clearedColumns,[3]);
  assert.equal(r.event.clearedCells.length,15);
  assert.equal(r.event.gained,3205);
  assert.equal(r.event.crossMultiplier,10);
  assert.equal(r.event.crossBonus,2880);
  assert.equal(r.game.board.flat().every(v=>v===null),true);
});
test("consecutive clears increase combo, ordinary move resets combo",()=>{
  let g=game();
  g.board[0]=["mint","mint","mint","mint","mint","mint","mint",null];
  let res=applyMove(g,0,7,0);assert.equal(res.game.combo,1);
  g=res.game;g.board[1]=["mint","mint","mint","mint","mint","mint","mint",null];
  res=applyMove(g,1,7,1); // two-cell piece does not fit at column 7
  assert.equal(res.event.type,"invalid");
  res=applyMove({...g,pieces:[single,bigger,tri]},0,7,1);
  assert.equal(res.game.combo,2);
  g=res.game;
  res=applyMove({...g,pieces:[single,bigger,tri]},0,0,5);
  assert.equal(res.game.combo,0);
});
test("three consumed pieces generate a fresh batch",()=>{
  const g=game();g.pieces=[{...single,used:false},{...bigger,used:true},{...tri,used:true}];
  const r=applyMove(g,0,0,0,()=>0);
  assert.equal(r.game.pieces.length,3);assert.equal(r.game.pieces.every(p=>!p.used),true);
});
test("game ends when none of the unconsumed pieces fits",()=>{
  const board=Array.from({length:SIZE},()=>Array(SIZE).fill("rose"));
  // Isolated diagonal holes keep every row/column incomplete even after the move.
  // The two extra holes prevent the move at 7,7 from clearing row 7 or column 7.
  for(let i=0;i<SIZE;i++)board[i][i]=null;
  board[7][0]=null;board[0][7]=null;
  const g=game(board);
  const r=applyMove(g,0,7,7);
  assert.equal(r.game.gameOver,true);assert.equal(r.event.type,"gameOver");
  assert.equal(hasLegalMove(r.game.board,r.game.pieces),false);
});
test("snapshot can be restored, corrupted snapshot is rejected",()=>{
  const g=newGame(()=>0);
  assert.deepEqual(sanitizeGame(JSON.parse(JSON.stringify(g))),g);
  assert.equal(sanitizeGame({...g,board:[]}),null);
  assert.equal(sanitizeGame({...g,score:-1}),null);
});
test("record is local, monotonically increases, and survives reload",()=>{
  const storage=mockStorage();let save=loadSave(storage);
  let g=newGame(()=>0);g.score=620;
  let result=checkpoint(save,g,0,storage);save=result.save;
  assert.equal(result.persisted,true);assert.equal(loadSave(storage).bestScore,620);
  assert.equal(loadSave(storage).progress.game.score,620);
  result=finish(save,g,storage);save=result.save;
  assert.equal(loadSave(storage).gamesPlayed,1);
  g={...newGame(()=>0),score:120};
  result=finish(save,g,storage);
  assert.equal(loadSave(storage).bestScore,620);
  assert.equal(loadSave(storage).lastScore,120);
  assert.equal(loadSave(storage).gamesPlayed,2);
});
test("storage corruption or unavailable storage does not crash",()=>{
  const storage=mockStorage();storage.setItem(SAVE_KEY,"{invalid");
  assert.equal(loadSave(storage).bestScore,0);
  const bad={getItem(){throw Error("private");},setItem(){throw Error("quota");}};
  assert.equal(loadSave(bad).bestScore,0);
  assert.equal(writeSave(sanitizeSave({version:1}),bad),false);
});


test("Cross x10 only multiplies clearing, not placement, speed or EXTRA",()=>{
 const board=emptyBoard();
 for(let n=0;n<SIZE;n++)if(n!==3){board[3][n]="coral";board[n][3]="sky";}
 const reward={speedBonus:24,noRotationBonus:15,speedMultiplier:4};
 const r=applyMove(game(board),0,3,3,()=>0,reward);
 assert.equal(r.event.crossMultiplier,10);
 assert.equal(r.event.clearPoints,3200);
 assert.equal(r.event.basePoints,3205);
 assert.equal(r.event.gained,3205+24+15);
 assert.equal(r.event.crossBonus,2880);
 assert.equal(r.event.clearedCells.length,15);
});
test("Two completed rows without column remain x1, but flag double-line effect",()=>{
 const board=emptyBoard();
 for(let y=0;y<2;y++)for(let x=0;x<7;x++)board[y][x]="mint";
 const pieces=[{id:0,coords:[[0,0],[0,1]],used:false,color:"sky"},bigger,tri];
 const r=applyMove(game(board,pieces),0,7,0,()=>0);
 assert.equal(r.event.lines,2);
 assert.deepEqual(r.event.clearedRows,[0,1]);
 assert.deepEqual(r.event.clearedColumns,[]);
 assert.equal(r.event.crossMultiplier,1);
 assert.equal(r.event.crossBonus,0);
 assert.equal(r.event.gained,10+320);
});

function boardWithHoles(holes){
  const board=Array.from({length:SIZE},()=>Array(SIZE).fill("rose"));
  for(const [x,y] of holes)board[y][x]=null;
  return board;
}
const canPlaceCurrentOrientationAnywhere=(board,coords)=>
  board.some((row,y)=>row.some((_,x)=>canPlace(board,coords,x,y)));

test("REGRESSION: no false game over when the only remaining bar fits after 90-degree rotation",()=>{
  // Singleton goes at (0,0). Other holes prevent any row/column clear.
  // Afterwards the horizontal 3-cell piece fits only in vertical holes.
  const board=boardWithHoles([[0,0],[1,0],[0,4],[3,1],[3,2],[3,3]]);
  const bar={id:1,coords:[[0,0],[1,0],[2,0]],color:"mint",used:false};
  const pieces=[structuredClone(single),bar,{...tri,used:true}];
  const original=structuredClone(pieces);
  assert.equal(canPlaceCurrentOrientationAnywhere(board,bar.coords),false);
  const result=applyMove(game(board,pieces),0,0,0,()=>0);
  assert.equal(result.event.type,"placed","No false game-over event");
  assert.equal(result.event.gameOver,false);
  assert.equal(result.game.gameOver,false);
  assert.equal(result.event.lines,0,"The last move must not free accidental rows or columns");
  assert.equal(result.event.gained,5,"Scoring stays identical");
  assert.equal(result.game.pieces[0].used,true);
  assert.deepEqual(result.game.pieces[1].coords,original[1].coords,"No automatic rotation of the tray");
  assert.equal(hasLegalMove(result.game.board,result.game.pieces),true);
  assert.equal(canPlaceCurrentOrientationAnywhere(result.game.board,bar.coords),false);
  const afterUserRotation=rotatePiece(result.game,1);
  assert.ok(canPlace(afterUserRotation.board,afterUserRotation.pieces[1].coords,3,1));
  assert.equal(afterUserRotation.gameOver,false);
  assert.equal(afterUserRotation.moves,result.game.moves,"Rotating alone does not consume a turn");
  assert.equal(afterUserRotation.score,result.game.score);
  const storage=mockStorage(),saved=loadSave(storage);
  checkpoint(saved,result.game,0,storage);
  assert.equal(loadSave(storage).progress.game.gameOver,false,"Real progress survives reload");
  assert.equal(loadSave(storage).progress.game.pieces[1].used,false);
});

test("REGRESSION: all three other L orientations can rescue a playable position",()=>{
  const l=[[0,0],[1,0],[0,1]];
  for(const turns of [1,2,3]){
    let rotated=l;
    for(let i=0;i<turns;i++)rotated=rotate(rotated);
    const holes=rotated.map(([x,y])=>[3+x,3+y]);
    const board=boardWithHoles(holes);
    const piece={id:0,coords:l,color:"coral",used:false};
    assert.equal(canPlaceCurrentOrientationAnywhere(board,l),false,
      "Original orientation must NOT fit for rotation "+turns);
    assert.equal(hasLegalMove(board,[piece,null,{...single,used:true}]),true,
      "Rotation "+(turns*90)+"° must prevent game over");
    assert.deepEqual(l,[[0,0],[1,0],[0,1]],"Search never mutates the piece");
  }
});

test("REGRESSION: rare diagonal pieces are checked in both slopes and all permitted rotations",()=>{
  const positive=[[0,0],[1,1],[2,2]];
  const negative=[[2,0],[1,1],[0,2]];
  for(const shape of [positive,negative]){
    const orientation=rotate(shape);
    const board=boardWithHoles(orientation.map(([x,y])=>[2+x,2+y]));
    assert.equal(hasLegalMove(board,[{id:0,coords:shape,used:false}]),true);
    assert.equal(hasLegalMove(board,[{id:0,coords:shape,used:true}]),false);
  }
});

test("REGRESSION: genuinely impossible board still ends, used pieces do not count",()=>{
  const board=boardWithHoles([[0,0],[2,2],[4,4]]);
  const unusedBar={id:0,coords:[[0,0],[1,0],[2,0]],color:"sky",used:false};
  assert.equal(hasLegalMove(board,[unusedBar]),false);
  assert.equal(hasLegalMove(board,[{...single,used:true},unusedBar]),false);
  assert.equal(hasLegalMove(board,[null,{...single,used:true}]),false);
});
