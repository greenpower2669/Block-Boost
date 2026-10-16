import {SIZE,canPlace} from "./engine.mjs";

/**
 * Haptic sonar exclusively targets placements which IMMEDIATELY complete >=1
 * row or column. If an existing combo is active, those targets will extend it.
 * Never guide toward a placement which is impossible in the current orientation.
 *
 * Search happens once per grab/rotation (<=64 candidate anchors), not per frame.
 */
export function clearingTargets(board,coords) {
  if(!Array.isArray(coords)||!coords.length)return [];
  const targets=[];
  for(let y=0;y<SIZE;y++)for(let x=0;x<SIZE;x++) {
    if(!canPlace(board,coords,x,y))continue;
    const put=new Set(coords.map(([dx,dy])=>(x+dx)+","+(y+dy)));
    let lines=0;
    for(let r=0;r<SIZE;r++) {
      if(board[r].every((v,c)=>v!==null||put.has(c+","+r)))lines++;
    }
    for(let c=0;c<SIZE;c++) {
      if(board.every((row,r)=>row[c]!==null||put.has(c+","+r)))lines++;
    }
    if(lines>0)targets.push({x,y,lines});
  }
  return targets;
}

/** 0=none, 1=distant, 2=approaching, 3=close, 4=exact clearing position */
export function proximityStrength(targets,x,y) {
  if(!Number.isFinite(x)||!Number.isFinite(y)||!Array.isArray(targets)||!targets.length)return 0;
  // Nearest of all legitimate placements; shape+orientation are fixed.
  const distance=Math.min(...targets.map(t=>Math.hypot(x-t.x,y-t.y)));
  if(distance<.51)return 4;
  if(distance<=1.45)return 3;
  if(distance<=2.55)return 2;
  if(distance<=3.6)return 1;
  return 0;
}

/** Distinguish a line clear, combo, and speed/no-rotation celebration. */
export function rewardHaptic(event,bonus) {
  if(!event||event.type==="invalid")return null;
  const streak=event.lines>0&&event.combo>=2;
  const speed=Number.isFinite(bonus?.speedMultiplier)?bonus.speedMultiplier:0;
  const extra=Number.isFinite(event.noRotationBonus)&&event.noRotationBonus>0;
  const clearing=event.lines>0;
  if(streak)return speed>=2||extra?"comboBonus":"combo";
  if(clearing)return speed>=2||extra?"lineBonus":"line";
  if(speed>=3&&extra)return "speedExtra";
  if(speed>=3)return "speedHigh";
  if(speed===2)return extra?"speedExtra":"speed";
  if(extra)return "extra";
  return "drop";
}
