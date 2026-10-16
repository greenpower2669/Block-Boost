import {SIZE,newGame,rotatePiece,applyMove,bounds,canPlace} from "./engine.mjs";
import {loadSave,writeSave,checkpoint,finish} from "./storage.mjs";
import {Feedback,MASCOTS} from "./feedback.mjs";
import {evaluateBonus,speedTier} from "./bonus.mjs";
import {PlacementCueGate} from "./placement-cues.mjs";

const $=id=>document.getElementById(id);
const boardEl=$("board"),trayEl=$("tray"),ghostEl=$("drag-ghost"),surface=$("surface");
let save=loadSave(),runStartBest=save.progress?.runStartBest??save.bestScore;
let game=save.progress?.game||newGame();
let selected=null,drag=null,flashTimer=null,confettiTimer=null,finishing=false;
let selectedAt=null,selectedTurns=0;
const cueGate=new PlacementCueGate(540);
function selectPiece(index){
  if(selected!==index || selectedAt===null){
    selectedAt=performance.now();
    selectedTurns=0;
  }
  selected=index;
  updateBonusLive();
}
function elapsed(){
  return selectedAt===null?Infinity:Math.max(0,performance.now()-selectedAt);
}
function updateBonusLive(){
  const node=$("bonus-live");
  if(selected===null || game.gameOver || game.pieces[selected]?.used){
    node.textContent="⚡ VITESSE ×4 à ×0 · ⭐ EXTRA sans rotation";
    node.classList.remove("running");return;
  }
  const tier=speedTier(elapsed());
  node.textContent="⚡ VITESSE ×"+tier.multiplier+" · "+(selectedTurns===0?"⭐ EXTRA POSSIBLE":"↻ "+selectedTurns+" rotation"+(selectedTurns>1?"s":""));
  node.classList.add("running");
}
setInterval(()=>{if(selected!==null)updateBonusLive();},125);
const feedback=new Feedback(()=>save.settings,()=>save.mascot,
  caption=>{$("mascot-caption").textContent=caption||"À toi de jouer !";},
  emotion=>{$("mascot-face").className="mascot-face"+(emotion!=="idle"?" "+emotion:"");});

function number(n){return n.toLocaleString("fr-FR");}
function persist(){
  const r=checkpoint(save,game,runStartBest);save=r.save;
  $("storage-status").hidden=r.persisted;
}
function persistSettings(){
  $("storage-status").hidden=writeSave(save);
}
function showMascot(){
  const m=MASCOTS[save.mascot]||MASCOTS.pompom;
  $("mascot-face").textContent=m.emoji;$("mascot-name").textContent=m.name;
  $("mascot-choice").value=save.mascot;
  $("voice-setting").checked=save.settings.voice;$("fx-setting").checked=save.settings.fx;
  $("motion-setting").checked=save.settings.reducedMotion;
  $("haptics-setting").checked=save.settings.haptics!==false;
  document.body.classList.toggle("reduce-motion",save.settings.reducedMotion);
}
function cellDiv(color,x,y,extra=""){
  const div=document.createElement("div");
  div.className="cell"+(color?" filled "+color:"")+(extra?" "+extra:"");
  div.dataset.x=x;div.dataset.y=y;div.setAttribute("role","gridcell");
  div.setAttribute("aria-label","Ligne "+(y+1)+", colonne "+(x+1)+
    (color?" occupée":" libre"));return div;
}
function drawBoard(cleared=[]){
  const frag=document.createDocumentFragment();
  const clearedSet=new Set(cleared.map(([y,x])=>y+","+x));
  for(let y=0;y<SIZE;y++)for(let x=0;x<SIZE;x++)
    frag.appendChild(cellDiv(game.board[y][x],x,y,
      clearedSet.has(y+","+x)?"just-cleared":""));
  boardEl.replaceChildren(frag);
}
function buildShape(coords,color,mini,klass="mini-cell"){
  const b=bounds(coords);
  const div=document.createElement("div");
  div.className="piece";
  div.style.gridTemplateColumns="repeat("+b.width+", var(--mini))";
  div.style.setProperty("--mini",mini+"px");
  const filled=new Set(coords.map(([x,y])=>x+","+y));
  for(let y=0;y<b.height;y++)for(let x=0;x<b.width;x++){
    const sq=document.createElement("div");
    sq.className=filled.has(x+","+y)?klass+" "+color:"mini-empty";
    div.appendChild(sq);
  }
  return div;
}
function drawTray(){
  const frag=document.createDocumentFragment();
  game.pieces.forEach((piece,i)=>{
    const slot=document.createElement("div");
    slot.className="piece-slot"+(piece.used?" used":"")+(selected===i?" selected":"");
    slot.dataset.piece=i;
    slot.setAttribute("role","button");slot.setAttribute("tabindex",piece.used?"-1":"0");
    slot.setAttribute("aria-label","Pièce "+(i+1)+", "+piece.coords.length+
      " blocs"+(piece.used?", utilisée":", disponible"));
    if(!piece.used){
      const b=bounds(piece.coords);
      const mini=Math.min(22,Math.max(12,Math.floor((trayEl.clientWidth||330)/3-30)/
        Math.max(b.width,b.height)));
      slot.appendChild(buildShape(piece.coords,piece.color,mini));
    }
    frag.appendChild(slot);
  });
  trayEl.replaceChildren(frag);
  $("rotate-button").disabled=selected===null||game.gameOver||game.pieces[selected]?.used;
}
function paint(){
  $("score").textContent=number(game.score);
  $("record").textContent=number(Math.max(game.score,save.bestScore));
  showMascot();drawBoard();drawTray();updateBonusLive();
}
function metrics(coords,clientX,clientY){
  const b=bounds(coords),r=boardEl.getBoundingClientRect();
  const cell=(r.width-14-7*3)/SIZE;
  const left=clientX-b.width*cell/2,top=clientY-(b.height+.65)*cell;
  const x=Math.round((left-r.left-7)/(cell+3));
  const y=Math.round((top-r.top-7)/(cell+3));
  return {x,y,left,top,cell,b,valid:canPlace(game.board,coords,x,y)};
}
function preview(x,y,valid){
  const cells=boardEl.children;
  for(const c of cells)c.classList.remove("preview-good","preview-bad");
  if(!drag)return;
  const coords=game.pieces[drag.index].coords;
  for(const [dx,dy] of coords){
    const row=y+dy,col=x+dx;
    if(row<0||row>=SIZE||col<0||col>=SIZE)continue;
    cells[row*SIZE+col].classList.add(valid?"preview-good":"preview-bad");
  }
}
function drawGhost(){
  if(!drag)return;
  const p=game.pieces[drag.index], m=metrics(p.coords,drag.x,drag.y);
  drag.proposed=m;
  const base=buildShape(p.coords,p.color,m.cell,"ghost-cell");
  base.style.setProperty("--mini",m.cell+"px");
  for(const c of base.children){
    c.style.setProperty("--ghost-cell",m.cell+"px");
  }
  base.style.gridTemplateColumns="repeat("+m.b.width+", var(--ghost-cell))";
  const wrap=document.createElement("div");wrap.style.display="grid";
  wrap.style.setProperty("--ghost-cell",m.cell+"px");wrap.appendChild(base);
  ghostEl.replaceChildren(wrap);
  ghostEl.style.left=m.left+"px";ghostEl.style.top=m.top+"px";
  ghostEl.hidden=false;preview(m.x,m.y,m.valid);
  if(drag.moved || drag.rotatedCue) {
    const cue=cueGate.update(m.valid,performance.now(),true,Boolean(drag.rotatedCue));
    if(cue){feedback.fx(cue);feedback.haptic(cue);}
  } else cueGate.update(false,performance.now(),false);
  drag.rotatedCue=false;
}
function resetDrag(){
  drag=null;cueGate.reset();ghostEl.hidden=true;ghostEl.replaceChildren();
  for(const c of boardEl.children)c.classList.remove("preview-good","preview-bad");
}
function rotateSelected(){
  const index=drag?.index??selected;
  if(index===null||game.gameOver||game.pieces[index]?.used)return;
  game=rotatePiece(game,index);selectedTurns++;
  feedback.fx("rotate");feedback.haptic("rotate");
  persist();drawTray();updateBonusLive();
  if(drag){drag.rotatedCue=true;drawGhost();}
  else feedback.onCaption("Pièce tournée de 90° !");
}
function beginDrag(index,e){
  if(game.gameOver||game.pieces[index]?.used)return;
  selectPiece(index);
  drag={index,pointer:e.pointerId,startX:e.clientX,startY:e.clientY,
    x:e.clientX,y:e.clientY,proposed:null,moved:false,rotatedCue:false};
  cueGate.reset();
  feedback.ensureAudio();feedback.fx("grab");feedback.haptic("grab");
  drawTray();drawGhost();
  try{surface.setPointerCapture(e.pointerId);}catch{}
}
function insertAt(index,x,y){
  const oldScore=game.score;
  const bonus=evaluateBonus(game.pieces[index].coords.length,elapsed(),selectedTurns);
  const res=applyMove(game,index,x,y,Math.random,bonus);
  if(res.event.type==="invalid"){
    feedback.fx("invalid");feedback.onCaption("Essaie dans un espace libre !");
    return false;
  }
  feedback.haptic(res.event.lines>0?"clear":"drop");
  game=res.game;selected=null;selectedAt=null;selectedTurns=0;
  const isRecord=game.score>runStartBest;
  if(game.gameOver){
    const result=finish(save,game);save=result.save;$("storage-status").hidden=result.persisted;
  }else persist();
  paint();
  const event=res.event;
  flashClear(event.clearedCells,event.lines,event.combo,event.gained,bonus);
  const descriptions=["⚡ VITESSE ×"+bonus.speedMultiplier+" : +"+event.speedBonus];
  if(event.noRotationBonus)descriptions.push("⭐ EXTRA SANS ROTATION : +"+event.noRotationBonus);
  $("bonus-earned").textContent=descriptions.join(" · ");
  if(event.lines>0){
    feedback.fx(event.combo>=3||event.lines>=2?"combo":"clear");
  }else feedback.fx("drop");
  if(bonus.speedMultiplier>=3)feedback.fx("speed");
  if(event.noRotationBonus)feedback.fx("extra");
  if(event.combo>=3)feedback.speak("combo",4);
  else if(bonus.speedMultiplier>=2)feedback.speak("speed"+bonus.speedMultiplier,3);
  else if(event.lines>=2)feedback.speak("big",3);
  else if(bonus.noRotationBonus>0)feedback.speak("noRotation",2);
  else if(event.lines>0)feedback.speak("clear",2);
  else if(game.moves===1||game.moves%10===0)feedback.speak("welcome",1);
  if(game.gameOver){
    const newRecord=game.score>runStartBest;
    window.setTimeout(()=>endGame(newRecord),1850);
  }
  return game.score!==oldScore;
}
function flashClear(cleared,lines,combo,gained,bonus){
  const parts=[];
  if(combo>=2)parts.push("✨ COMBO "+combo+" !");
  else if(lines>=2)parts.push("🌟 DOUBLE !");
  parts.push("⚡ VITESSE ×"+bonus.speedMultiplier);
  if(bonus.noRotationBonus>0)parts.push("⭐ EXTRA SANS ROTATION !");
  parts.push("+"+gained+" POINTS");
  const text=parts.join("\n");
  $("combo-flash").textContent=text;
  $("combo-flash").classList.remove("active");void $("combo-flash").offsetWidth;
  $("combo-flash").classList.add("active");
  const frag=document.createDocumentFragment(),rect=boardEl.getBoundingClientRect();
  if(!save.settings.reducedMotion){
    for(let i=0;i<Math.min(35,11+lines*9);i++){
      const node=document.createElement("div"),center=cleared[Math.floor(Math.random()*cleared.length)]||[3,3];
      node.className="spark";
      node.style.setProperty("--px",rect.left+(center[1]+.5)*rect.width/8+"px");
      node.style.setProperty("--py",rect.top+(center[0]+.5)*rect.height/8+"px");
      node.style.setProperty("--sz",(3+Math.random()*7)+"px");
      node.style.setProperty("--color",["#6cfff5","#ffed87","#ff81c6","#fff","#98a0ff"][i%5]);
      node.style.setProperty("--dx",((Math.random()-.5)*155)+"px");
      node.style.setProperty("--dy",((Math.random()-.5)*155)+"px");
      frag.appendChild(node);
    }
    $("sparkles").appendChild(frag);
  }
  clearTimeout(flashTimer);clearTimeout(confettiTimer);
  flashTimer=setTimeout(()=>$("combo-flash").classList.remove("active"),1650);
  confettiTimer=setTimeout(()=>$("sparkles").replaceChildren(),1400);
}
function endGame(newRecord){
  if(finishing)return;
  finishing=true;
  feedback.fx(newRecord?"record":"clear");
  feedback.speak(newRecord?"record":"over",5,true);
  $("result-title").textContent=newRecord?"🌟 Nouveau record !":"Belle partie !";
  $("final-score").textContent=number(game.score);
  $("final-record").textContent=number(save.bestScore);
  $("result-mascot").textContent=MASCOTS[save.mascot].emoji+
    (newRecord?" Tu as battu ton record !":" On retente ensemble ?");
  if(!$("end-dialog").open)$("end-dialog").showModal();
}
function restart(confirmActive=false){
  if(confirmActive&&!game.gameOver&&game.moves>0&&!window.confirm("Recommencer cette partie ? Le record restera enregistré."))return;
  feedback.stop();finishing=false;
  if($("end-dialog").open)$("end-dialog").close();
  game=newGame();selected=null;selectedAt=null;selectedTurns=0;resetDrag();
  $("bonus-earned").textContent="";updateBonusLive();
  runStartBest=save.bestScore;persist();paint();
  feedback.onCaption("Choisis une pièce et amuse-toi !");
}
// Pointer Events: first finger DRAGS; each new secondary touch pointerdown ROTATES once.
// Subsequent movement of the secondary finger never drops the piece.
document.addEventListener("pointerdown",e=>{
  if(drag){
    if(e.pointerId!==drag.pointer && e.pointerType==="touch"){
      e.preventDefault();rotateSelected();
    }
    return;
  }
  const slot=e.target.closest?.(".piece-slot");
  if(slot && surface.contains(slot)){
    if(e.pointerType==="mouse" && e.button!==0)return;
    e.preventDefault();beginDrag(Number(slot.dataset.piece),e);return;
  }
  const cell=e.target.closest?.(".cell");
  if(cell && selected!==null && surface.contains(cell)){
    e.preventDefault();insertAt(selected,Number(cell.dataset.x),Number(cell.dataset.y));
  }
});
document.addEventListener("pointermove",e=>{
  if(!drag||e.pointerId!==drag.pointer)return;
  e.preventDefault();
  drag.x=e.clientX;drag.y=e.clientY;
  if(Math.hypot(drag.x-drag.startX,drag.y-drag.startY)>9)drag.moved=true;
  drawGhost();
},{passive:false});
document.addEventListener("pointerup",e=>{
  if(!drag||e.pointerId!==drag.pointer)return;
  e.preventDefault();
  const was=drag;const candidate=metrics(game.pieces[drag.index].coords,e.clientX,e.clientY);
  const index=drag.index;resetDrag();
  if(was.moved&&candidate.valid){
    insertAt(index,candidate.x,candidate.y);
  }else if(was.moved && candidate.y>=0&&candidate.y<SIZE && candidate.x>=0&&candidate.x<SIZE){
    feedback.fx("invalid");feedback.onCaption("Cette place est occupée, essaie ailleurs.");
  }else{
    drawTray();
    if(!was.moved)feedback.onCaption("Pièce sélectionnée : touche la grille ou tourne-la.");
  }
});
document.addEventListener("pointercancel",e=>{
  if(drag&&e.pointerId===drag.pointer){resetDrag();drawTray();}
});
document.addEventListener("keydown",e=>{
  if(e.target.closest?.("dialog"))return;
  if(e.key.toLowerCase()==="r" && (selected!==null||drag)){
    e.preventDefault();rotateSelected();
  }
  if((e.key==="Enter"||e.key===" ")&&e.target.closest?.(".piece-slot")){
    e.preventDefault();selectPiece(Number(e.target.closest(".piece-slot").dataset.piece));drawTray();
  }
});
document.addEventListener("contextmenu",e=>{
  if(drag){e.preventDefault();rotateSelected();}
});
$("rotate-button").addEventListener("click",()=>{
  if(!drag)rotateSelected(); // secondary touch pointerdown already rotated during an active drag
});
$("settings-button").addEventListener("click",()=>{feedback.ensureAudio();$("settings-dialog").showModal();});
$("mascot-choice").addEventListener("change",e=>{
  save={...save,mascot:e.target.value};persistSettings();showMascot();
  feedback.speak("welcome",1,true);
});
for(const [id,key] of [["voice-setting","voice"],["fx-setting","fx"],["motion-setting","reducedMotion"],["haptics-setting","haptics"]]){
  $(id).addEventListener("change",e=>{
    save={...save,settings:{...save.settings,[key]:e.target.checked}};
    persistSettings();showMascot();if(key==="voice"&&!e.target.checked)feedback.stop();
  });
}
$("new-game").addEventListener("click",()=>restart(true));
$("retry-button").addEventListener("click",()=>restart(false));
window.addEventListener("resize",()=>{drawTray();if(drag)drawGhost();});
window.addEventListener("pagehide",()=>{if(!game.gameOver)persist();feedback.stop();});
if(!save.progress)persist();
paint();updateBonusLive();
if(!globalThis.AndroidBridge && "serviceWorker" in navigator && location.protocol.startsWith("http")){
  window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(()=>{}));
}
