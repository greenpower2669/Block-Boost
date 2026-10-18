/**
 * Block Boost quick-placement rewards. Pure module — all timing input is passed
 * in from the UI using a monotonic performance clock. Never time a frame render.
 *
 * Important: ×0 means NO speed reward; it never removes ordinary points,
 * any cleared lines, or the separate "no rotation" bonus.
 */
export const SPEED_TIERS=Object.freeze([
  {maxMs:2000,multiplier:4,label:"ÉCLAIR"},
  {maxMs:4000,multiplier:3,label:"FUSÉE"},
  {maxMs:7000,multiplier:2,label:"TURBO"},
  {maxMs:11000,multiplier:1,label:"RAPIDE"},
  {maxMs:Infinity,multiplier:0,label:"RÉFLEXION"}
]);
export function speedTier(elapsedMs){
  const safe=Number.isFinite(elapsedMs)&&elapsedMs>=0?elapsedMs:Infinity;
  return SPEED_TIERS.find(t=>safe<=t.maxMs);
}
export function evaluateBonus(cells,elapsedMs,rotationCount){
  const count=Number.isInteger(cells)&&cells>0&&cells<=9?cells:0;
  const turns=Number.isInteger(rotationCount)&&rotationCount>=0?rotationCount:Infinity;
  const tier=speedTier(elapsedMs);
  const base=count*5;
  const speedBonus=base*tier.multiplier;
  const noRotationBonus=turns===0?base:0;
  return {
    speedMultiplier:tier.multiplier,
    speedLabel:tier.label,
    speedBonus,
    noRotationBonus,
    rotationCount:Number.isFinite(turns)?turns:0,
    elapsedMs:Number.isFinite(elapsedMs)?Math.max(0,Math.round(elapsedMs)):null
  };
}
