/** Fractional cell coordinates. Only prevalidated clearingTargets are eligible. */
export const WIN_SNAP=Object.freeze({acquireRadius:.46,keepRadius:.70,upwardBias:.09});
export function winningSnap(targets,x,y,previous=null,config=WIN_SNAP){
  if(!Number.isFinite(x)||!Number.isFinite(y)||!Array.isArray(targets))return null;
  const adjustedY=y-config.upwardBias;
  const distance=t=>Math.hypot(x-t.x,adjustedY-t.y);
  // A previously visible winner survives a tiny downward pointerup wobble.
  const held=previous&&targets.find(t=>t.x===previous.x&&t.y===previous.y);
  if(held&&distance(held)<=config.keepRadius)return {...held};
  const near=targets.filter(t=>distance(t)<=config.acquireRadius);
  near.sort((a,b)=>distance(a)-distance(b)||b.lines-a.lines||a.y-b.y||a.x-b.x);
  return near.length?{...near[0]}:null;
}
