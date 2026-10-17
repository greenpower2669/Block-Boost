// Block Boost — déterministic, DOM-free game rules.
export const SIZE = 8;
export const PALETTE = ["coral", "sun", "mint", "sky", "purple", "rose"];
export const SHAPES = [
  [[0,0]], [[0,0],[1,0]], [[0,0],[1,0],[2,0]],
  [[0,0],[1,0],[2,0],[3,0]], [[0,0],[1,0],[2,0],[3,0],[4,0]],
  [[0,0],[0,1],[0,2]], [[0,0],[0,1],[0,2],[0,3]],
  [[0,0],[1,0],[0,1],[1,1]],
  [[0,0],[1,0],[2,0],[0,1],[1,1],[2,1]],
  [[0,0],[1,0],[2,0],[0,1],[1,1],[2,1],[0,2],[1,2],[2,2]],
  [[0,0],[1,0],[2,0],[1,1]],
  [[0,0],[0,1],[1,1],[2,1]],
  [[0,0],[1,0],[1,1],[2,1]],
  [[1,0],[2,0],[0,1],[1,1]],
  [[0,0],[0,1],[0,2],[1,2]],
  [[0,0],[1,0],[0,1],[0,2]],
  [[0,0],[1,0],[2,0],[2,1],[2,2]],
  [[0,0],[1,0],[0,1],[1,1],[2,1]],
  [[0,0],[1,0],[2,0],[0,1],[2,1]]
];
export const emptyBoard = () => Array.from({length: SIZE}, () => Array(SIZE).fill(null));
export function bounds(coords) {
  return { width: Math.max(...coords.map(c => c[0])) + 1,
           height: Math.max(...coords.map(c => c[1])) + 1 };
}
export function normalize(coords) {
  const minX = Math.min(...coords.map(p => p[0]));
  const minY = Math.min(...coords.map(p => p[1]));
  return coords.map(([x,y]) => [x-minX,y-minY]).sort((a,b)=>a[1]-b[1]||a[0]-b[0]);
}
export function rotate(coords) {
  const {height} = bounds(coords);
  return normalize(coords.map(([x,y]) => [height-1-y, x]));
}
export function canPlace(board, coords, x, y) {
  return coords.every(([dx,dy]) => {
    const row=y+dy, col=x+dx;
    return row>=0 && row<SIZE && col>=0 && col<SIZE && board[row][col]===null;
  });
}
export function hasLegalMove(board,pieces) {
  return pieces.some(piece => piece !== null && !piece.used &&
    Array.from({length:SIZE},(_,y)=>y).some(y =>
      Array.from({length:SIZE},(_,x)=>x).some(x => canPlace(board,piece.coords,x,y))
    )
  );
}
export function pieceBatch(rng=Math.random) {
  return Array.from({length:3}, (_,i) => ({
    id: i, coords: SHAPES[Math.floor(rng()*SHAPES.length)].map(([x,y])=>[x,y]),
    color: PALETTE[Math.floor(rng()*PALETTE.length)], used:false
  }));
}
export function newGame(rng=Math.random) {
  return {board:emptyBoard(),pieces:pieceBatch(rng),score:0,combo:0,bestCombo:0,
    moves:0,gameOver:false,version:1};
}
// A successful clearing move increases the combo. Any non-clearing placement resets it.
// Score: 5 per occupied cell plus 80 * lines^2 * comboStreak. A cross intersection is counted once.
export function applyMove(game, pieceIndex, x, y, rng=Math.random, reward=null) {
  if (game.gameOver) return {game,event:{type:"invalid",reason:"finished"}};
  const piece=game.pieces[pieceIndex];
  if (!piece || piece.used || !canPlace(game.board,piece.coords,x,y))
    return {game,event:{type:"invalid",reason:"position"}};
  const board=game.board.map(row=>row.slice());
  for (const [dx,dy] of piece.coords) board[y+dy][x+dx]=piece.color;
  const clearedRows=[], clearedColumns=[];
  for(let row=0;row<SIZE;row++) if(board[row].every(Boolean)) clearedRows.push(row);
  for(let col=0;col<SIZE;col++) if(board.every(row=>row[col]!==null)) clearedColumns.push(col);
  const cellsToClear=new Set();
  for(const row of clearedRows) for(let col=0;col<SIZE;col++) cellsToClear.add(row+","+col);
  for(const col of clearedColumns) for(let row=0;row<SIZE;row++) cellsToClear.add(row+","+col);
  for (const cell of cellsToClear) {
    const [r,c]=cell.split(",").map(Number); board[r][c]=null;
  }
  const lines=clearedRows.length+clearedColumns.length;
  const combo=lines>0 ? game.combo+1 : 0;
  // CROSSING x10 applies ONLY to row/column clearing points, not placement,
  // speed or no-rotation rewards. Shared intersection counted once as before.
  const crossMultiplier=clearedRows.length>0&&clearedColumns.length>0?10:1;
  const clearPoints=lines>0?80*lines*lines*combo*crossMultiplier:0;
  const crossBonus=clearPoints-(lines>0?80*lines*lines*combo:0);
  const basePoints=piece.coords.length*5+clearPoints;
  // Rewards are additive. A speed ×0 never multiplies ordinary points by zero.
  const speedBonus=Number.isSafeInteger(reward?.speedBonus)&&reward.speedBonus>=0&&reward.speedBonus<10000?reward.speedBonus:0;
  const noRotationBonus=Number.isSafeInteger(reward?.noRotationBonus)&&reward.noRotationBonus>=0&&reward.noRotationBonus<10000?reward.noRotationBonus:0;
  const gained=basePoints+speedBonus+noRotationBonus;
  let pieces=game.pieces.map((p,i)=>i===pieceIndex ? {...p,used:true} : p);
  const newBatch=pieces.every(p=>p.used);
  if(newBatch) pieces=pieceBatch(rng);
  const gameOver=!hasLegalMove(board,pieces);
  const next={...game,board,pieces,score:game.score+gained,combo,
    bestCombo:Math.max(game.bestCombo,combo),moves:game.moves+1,gameOver};
  return {game:next,event:{type:gameOver?"gameOver":lines>0?"clear":"placed",gained,
    basePoints,speedBonus,noRotationBonus,crossMultiplier,crossBonus,clearPoints,newBatch,
    speedMultiplier:reward?.speedMultiplier??0,
    lines,combo,clearedRows,clearedColumns,clearedCells:[...cellsToClear].map(s=>s.split(",").map(Number)),
    score:next.score,gameOver}};
}
export function rotatePiece(game,index) {
  const piece=game.pieces[index];
  if(!piece||piece.used||game.gameOver) return game;
  return {...game,pieces:game.pieces.map((p,i)=>i===index?{...p,coords:rotate(p.coords)}:p)};
}
const validCoords = coords => Array.isArray(coords) && coords.length>0 && coords.length<=9 &&
  coords.every(p=>Array.isArray(p)&&p.length===2&&p.every(n=>Number.isInteger(n)&&n>=0&&n<SIZE)) &&
  new Set(coords.map(([x,y])=>x+","+y)).size===coords.length;
export function sanitizeGame(obj) {
  if(!obj || obj.version!==1 || !Array.isArray(obj.board) || obj.board.length!==SIZE ||
     !obj.board.every(row=>Array.isArray(row)&&row.length===SIZE&&
       row.every(c=>c===null||PALETTE.includes(c))) ||
     !Array.isArray(obj.pieces)||obj.pieces.length!==3 ||
     !obj.pieces.every(p=>p&&typeof p.used==="boolean"&&
       PALETTE.includes(p.color)&&validCoords(p.coords)) ||
     !["score","combo","bestCombo","moves"].every(k=>Number.isSafeInteger(obj[k])&&obj[k]>=0) ||
     typeof obj.gameOver!=="boolean") return null;
  return {version:1,board:obj.board.map(r=>r.slice()),
    pieces:obj.pieces.map((p,i)=>({id:i,coords:p.coords.map(c=>c.slice()),color:p.color,used:p.used})),
    score:obj.score,combo:obj.combo,bestCombo:obj.bestCombo,moves:obj.moves,gameOver:obj.gameOver};
}
