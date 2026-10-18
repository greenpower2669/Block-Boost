/**
 * Ready-to-place cues are edge-triggered, not movement-triggered.
 * This prevents bell/vibration spam while the piece moves over valid cells.
 */
export class PlacementCueGate {
  constructor(cooldownMs=540) {
    this.cooldownMs=cooldownMs;
    this.previousValid=false;
    this.lastCueMs=-Infinity;
  }
  update(valid,timeMs,enabled=true,rotated=false){
    const ready=Boolean(valid);
    const entering=ready&&!this.previousValid;
    this.previousValid=ready;
    if(!enabled||!entering||!Number.isFinite(timeMs))return null;
    if(timeMs-this.lastCueMs<this.cooldownMs)return null;
    this.lastCueMs=timeMs;
    return rotated?"validRotate":"valid";
  }
  reset(){this.previousValid=false;this.lastCueMs=-Infinity;}
}
