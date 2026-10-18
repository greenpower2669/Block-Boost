import {SIZE,canPlace} from "./engine.mjs";

/** Pure, deterministic prediction of a placement. Does not mutate game.board. */
export function evaluateSolvePreview(board,coords,x,y,combo=0,reward=null) {
  if(!Array.isArray(coords)||!coords.length||!Number.isInteger(x)||!Number.isInteger(y)
      ||!canPlace(board,coords,x,y))
    return {valid:false,rows:[],columns:[],cells:[],lines:0,blocks:0,intensity:0};
  const placed=new Set(coords.map(([dx,dy])=>(y+dy)+","+(x+dx)));
  const rows=[],columns=[],union=new Set();
  for(let r=0;r<SIZE;r++){
    if(board[r].every((v,c)=>v!==null||placed.has(r+","+c))){
      rows.push(r);for(let c=0;c<SIZE;c++)union.add(r+","+c);
    }
  }
  for(let c=0;c<SIZE;c++){
    if(board.every((row,r)=>row[c]!==null||placed.has(r+","+c))){
      columns.push(c);for(let r=0;r<SIZE;r++)union.add(r+","+c);
    }
  }
  const lines=rows.length+columns.length,blocks=union.size;
  const speed=reward?.speedMultiplier??0;
  const extra=(reward?.noRotationBonus??0)>0;
  const richness=(blocks>=15?1:0)+(blocks>=23?1:0)+(lines>=2?1:0)+
    (combo>=1?1:0)+(speed>=3?1:0)+(extra?1:0);
  // Static single-row < double/cross < cascade with combo and EXTRA.
  const intensity=lines===0?0:Math.min(5,1+Math.floor(richness*.85));
  return {valid:true,rows,columns,lines,blocks,intensity,
    cells:[...union].map(s=>s.split(",").map(Number))};
}

/** Increasing feedback level as the finger approaches a genuine clearing move.
 * Additional lines, existing combo and earned speed/extra intensify the last steps.
 */
export function enrichedGuidance(targets,x,y,combo=0,reward=null) {
  if(!Number.isFinite(x)||!Number.isFinite(y)||!Array.isArray(targets)||!targets.length)return 0;
  let nearest=null,distance=Infinity;
  for(const t of targets){
    const d=Math.hypot(t.x-x,t.y-y);
    if(d<distance){distance=d;nearest=t;}
  }
  const base=distance<.51?4:distance<=1.45?3:distance<=2.55?2:distance<=3.6?1:0;
  if(!base)return 0;
  const speed=reward?.speedMultiplier??0;
  const isExtra=(reward?.noRotationBonus??0)>0;
  const richness=(nearest.lines>=2?1:0)+(nearest.lines>=3?1:0)+
    (combo>=1?1:0)+(speed>=3?1:0)+(isExtra?1:0);
  if(base===1)return 1; // Only a discreet hint when distant.
  if(base===2)return Math.min(3,2+(richness>=3?1:0));
  if(base===3)return Math.min(5,3+(richness>=2?1:0)+(richness>=4?1:0));
  return Math.min(6,4+(richness>=1?1:0)+(richness>=3?1:0));
}
