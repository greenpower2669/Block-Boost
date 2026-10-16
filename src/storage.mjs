import {sanitizeGame} from "./engine.mjs";
export const SAVE_KEY="block-boost.local.v1";
const MASCOTS=["pompom","plume","lilo","nox","moka","biscotte"];
const defaults = () => ({version:1,bestScore:0,lastScore:0,gamesPlayed:0,
  bestCombo:0,history:[],mascot:"pompom",settings:{voice:true,fx:true,reducedMotion:false,haptics:true,hapticGuidance:true},
  progress:null});
const saneNumber = v => Number.isSafeInteger(v)&&v>=0&&v<=1000000000?v:0;
export function sanitizeSave(data) {
  const d=defaults();
  if(!data||data.version!==1||typeof data!=="object") return d;
  for(const key of ["bestScore","lastScore","gamesPlayed","bestCombo"])
    d[key]=saneNumber(data[key]);
  if(MASCOTS.includes(data.mascot)) d.mascot=data.mascot;
  if(data.settings&&typeof data.settings==="object")
    for(const k of Object.keys(d.settings)) if(typeof data.settings[k]==="boolean")
      d.settings[k]=data.settings[k];
  if(Array.isArray(data.history)) d.history=data.history.slice(-20)
    .filter(o=>o&&Number.isSafeInteger(o.score)&&o.score>=0&&o.score<=1000000000)
    .map(o=>({score:o.score,at:typeof o.at==="string"?o.at:""}));
  if(data.progress?.game) {
    const g=sanitizeGame(data.progress.game);
    if(g&&!g.gameOver) d.progress={game:g,
      runStartBest:saneNumber(data.progress.runStartBest)};
  }
  d.bestScore=Math.max(d.bestScore,d.lastScore,...d.history.map(h=>h.score));
  return d;
}
export function loadSave(storage=globalThis.localStorage) {
  try {return sanitizeSave(JSON.parse(storage.getItem(SAVE_KEY)));}
  catch{return defaults();}
}
export function writeSave(save,storage=globalThis.localStorage) {
  try {storage.setItem(SAVE_KEY,JSON.stringify(sanitizeSave(save)));return true;}
  catch{return false;}
}
export function checkpoint(save,game,startBest,storage=globalThis.localStorage) {
  const next={...save,bestScore:Math.max(save.bestScore,game.score),
    bestCombo:Math.max(save.bestCombo,game.bestCombo),
    progress:game.gameOver?null:{game,runStartBest:startBest}};
  return {save:next,persisted:writeSave(next,storage)};
}
export function finish(save,game,storage=globalThis.localStorage) {
  const next={...save,lastScore:game.score,bestScore:Math.max(save.bestScore,game.score),
    bestCombo:Math.max(save.bestCombo,game.bestCombo),gamesPlayed:save.gamesPlayed+1,
    history:[...save.history,{score:game.score,at:new Date().toISOString()}].slice(-20),
    progress:null};
  return {save:next,persisted:writeSave(next,storage)};
}
