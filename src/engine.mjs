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
  [[0,0],[1,0],[2,0],[0,1],[2,1]],
  [[0,0],[1,0],[0,1]], // compact L of three, NOT the existing full 2x2
  [[0,0],[1,1]], [[1,0],[0,1]],
  [[0,0],[1,1],[2,2]], [[2,0],[1,1],[0,2]]
];
export const DRAW_CONFIG=Object.freeze({diagonalChance:.015,largeAtStart:2.6,
  largeWhenCrowded:.30,largeMinCells:5});
const FIRST_DIAGONAL=SHAPES.length-4;
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
// All new pieces are legal on the current board in at least one orientation.
// Change draw probabilities here, not in the comeback/high-score assistance.
function shapeFits(board,coords){
  let shape=coords;
  for(let orientation=0;orientation<4;orientation++){
    const {width,height}=bounds(shape);
    for(let y=0;y<=SIZE-height;y++)for(let x=0;x<=SIZE-width;x++)
      if(canPlace(board,shape,x,y))return true;
    shape=rotate(shape);
  }
  return false;
}
function weightedIndex(indices,density,rng,config){
  const weights=indices.map(i=>{
    const cells=SHAPES[i].length;
    if(cells>=config.largeMinCells)return config.largeWhenCrowded+
      (config.largeAtStart-config.largeWhenCrowded)*(1-density)**2;
    return cells===1?.65+1.2*density:1;
  });
  const total=weights.reduce((n,w)=>n+w,0);
  let offset=Math.min(.999999999,Math.max(0,rng()))*total;
  for(let i=0;i<indices.length;i++)if((offset-=weights[i])<0)return indices[i];
  return indices[indices.length-1];
}
export function pieceBatch(rng=Math.random,board=emptyBoard(),config=DRAW_CONFIG){
  const density=board.flat().filter(c=>c!==null).length/(SIZE*SIZE);
  const legal=SHAPES.map((shape,i)=>({shape,i}))
    .filter(({shape})=>density===0||shapeFits(board,shape));
  const ordinary=legal.filter(({i})=>i<FIRST_DIAGONAL).map(({i})=>i);
  const diagonals=legal.filter(({i})=>i>=FIRST_DIAGONAL).map(({i})=>i);
  const fallback=ordinary.length?ordinary:[0];
  let usedDiagonal=false;
  return Array.from({length:3},(_,i)=>{
    const chanceSample=rng();
    const rare=!usedDiagonal&&diagonals.length>0&&chanceSample>0&&
      chanceSample<config.diagonalChance; // deterministic RNG(0) keeps legacy singleton tests
    if(rare)usedDiagonal=true;
    const candidates=rare?diagonals:fallback;
    const index=weightedIndex(candidates,density,rng,config);
    return {id:i,coords:SHAPES[index].map(([x,y])=>[x,y]),
      color:PALETTE[Math.floor(Math.min(.999999999,Math.max(0,rng()))*PALETTE.length)],
      used:false};
  });
}
/**
 * The player gets a discreet LUCK boost, never an artificial score reward,
 * only when a previous high score is genuinely far away. This never changes
 * existing cells, places a block or guarantees a clear/high score.
 */
export function comebackChance(score=0,record=0,moves=0){
  if(!Number.isSafeInteger(score)||!Number.isSafeInteger(record)||
    score<0||record<800||moves<3)return 0;
  const gap=record-score;
  if(gap<=Math.max(450,record*.40))return 0;
  const gapRatio=Math.max(0,Math.min(1,gap/record));
  return Math.min(.73,.38+gapRatio*.35); // 38–73% of new trios.
}
function nextPlacement(board,coords,x,y){
  if(!canPlace(board,coords,x,y))return null;
  const next=board.map(row=>row.slice());
  for(const [dx,dy] of coords)next[y+dy][x+dx]="mint";
  const rows=[],cols=[];
  for(let r=0;r<SIZE;r++)if(next[r].every(Boolean))rows.push(r);
  for(let c=0;c<SIZE;c++)if(next.every(row=>row[c]!==null))cols.push(c);
  for(const row of rows)next[row].fill(null);
  for(const col of cols)for(const row of next)row[col]=null;
  const n=rows.length+cols.length;
  const clear=n?80*n*n*(rows.length&&cols.length?10:1):0;
  // Encourage a USEFUL follow-up line without optimizing every occupied cell.
  let setup=0;
  for(const row of next){
    const filled=row.filter(Boolean).length;
    if(filled>=4)setup+=(filled-3)*(filled-3);
  }
  for(let c=0;c<SIZE;c++){
    const filled=next.reduce((k,row)=>k+(row[c]!==null?1:0),0);
    if(filled>=4)setup+=(filled-3)*(filled-3);
  }
  return {next,rank:clear+setup*5+coords.length};
}
function bestPositions(board,coords,cap=4){
  const result=[],seen=new Set();
  let orientation=normalize(coords);
  for(let turn=0;turn<4;turn++){
    const signature=JSON.stringify(orientation);
    if(!seen.has(signature)){
      seen.add(signature);
      const b=bounds(orientation);
      for(let y=0;y<=SIZE-b.height;y++)for(let x=0;x<=SIZE-b.width;x++){
        const move=nextPlacement(board,orientation,x,y);
        if(move)result.push(move);
      }
    }
    orientation=rotate(orientation);
  }
  result.sort((a,b)=>b.rank-a.rank);
  return result.slice(0,cap);
}
/** Evaluate a pair of moves (not just a lucky one-off piece). */
export function batchProspect(board,pieces){
  if(!pieces?.length)return -1;
  let best=-1;
  for(let i=0;i<pieces.length;i++){
    const first=bestPositions(board,pieces[i].coords,4);
    for(const step of first){
      let followUp=0;
      for(let j=0;j<pieces.length;j++){
        if(i===j)continue;
        const second=bestPositions(step.next,pieces[j].coords,1)[0];
        if(second)followUp=Math.max(followUp,second.rank);
      }
      best=Math.max(best,step.rank+followUp*.83);
    }
  }
  return best;
}
/** Offer one of six independently generated 3-piece trios with higher
 * two-move clearing potential.  The original random offer stays possible.
 */
export function comebackBatch(board,rng=Math.random,chance=0){
  const ordinary=pieceBatch(rng,board);
  if(chance<=0||rng()>=chance)return {pieces:ordinary,assisted:false};
  const original= batchProspect(board,ordinary);
  let winner=ordinary,highest=original;
  for(let i=0;i<5;i++){
    const candidate=pieceBatch(rng,board);
    const score=batchProspect(board,candidate);
    if(score>highest){highest=score;winner=candidate;}
  }
  return {pieces:winner,assisted:highest>original};
}
export function newGame(rng=Math.random) {
  const board=emptyBoard();
  return {board,pieces:pieceBatch(rng,board),score:0,combo:0,bestCombo:0,
    moves:0,gameOver:false,version:1};
}
// A successful clearing move increases the combo. Any non-clearing placement resets it.
// Score: 5 per occupied cell plus 80 * lines^2 * comboStreak. A cross intersection is counted once.
export function applyMove(game, pieceIndex, x, y, rng=Math.random, reward=null, context=null) {
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
  let assistedBatch=false;
  if(newBatch){
    const chance=comebackChance(game.score+gained,context?.targetScore,game.moves+1);
    const nextBatch=comebackBatch(board,rng,chance);
    pieces=nextBatch.pieces;
    assistedBatch=nextBatch.assisted;
  }
  const gameOver=!hasLegalMove(board,pieces);
  const next={...game,board,pieces,score:game.score+gained,combo,
    bestCombo:Math.max(game.bestCombo,combo),moves:game.moves+1,gameOver};
  return {game:next,event:{type:gameOver?"gameOver":lines>0?"clear":"placed",gained,
    basePoints,speedBonus,noRotationBonus,crossMultiplier,crossBonus,clearPoints,newBatch,assistedBatch,
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
