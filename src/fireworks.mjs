/** Block Boost v0.13: independent, session-local fireworks milestones.
 * Pure threshold calculation; session score begins at zero on newGame.
 * There is only ONE six-second performance per move, even across many bands.
 */
export const FIREWORKS_STEP=1000;
export const FIREWORKS_DURATION_MS=6000;
export function crossedFireworkMilestones(before,after,step=FIREWORKS_STEP){
 if(!Number.isSafeInteger(before)||!Number.isSafeInteger(after)||
    !Number.isSafeInteger(step)||step<=0||before<0||after<=before)return [];
 const first=Math.floor(before/step)+1,last=Math.floor(after/step);
 if(last<first)return [];
 // A large jackpot can cross many bands; return a compact range, not an unbounded array.
 return [first*step,last*step];
}
export function fireworkSchedule(rng=Math.random,reduced=false){
 const total=reduced?4:9;
 return Array.from({length:total},(_,i)=>({
   x:12+rng()*76,y:12+rng()*53,
   delay:reduced?0:Math.min(4700,i*510+(i%3)*110),
   color:["#fcd26a","#7ceaff","#ffa7ec","#9fe1b0","#bdabff","#ffe8ae","#ff978a"][i%7],
   rays:reduced?0:8+(i%4)*2
 }));
}
/** Accessible non-interactive particles; no blinding full-screen flash/strobe. */
export function fillFireworks(root,{rng=Math.random,reduced=false,headline="FEU D'ARTIFICE !"}={}){
 const doc=root.ownerDocument;
 root.replaceChildren();
 root.className="fireworks-layer"+(reduced?" fireworks-reduced":"");
 root.setAttribute("aria-hidden","true");
 for(const burst of fireworkSchedule(rng,reduced)){
   const node=doc.createElement("span");
   node.className="firework-burst";
   node.style.setProperty("--firework-x",burst.x+"%");
   node.style.setProperty("--firework-y",burst.y+"%");
   node.style.setProperty("--firework-delay",burst.delay+"ms");
   node.style.setProperty("--firework-color",burst.color);
   for(let n=0;n<burst.rays;n++){
     const spark=doc.createElement("i");spark.className="firework-spark";
     spark.style.setProperty("--spark-angle",(n*360/burst.rays)+"deg");
     spark.style.setProperty("--spark-distance",(46+(n%3)*26)+"px");
     node.appendChild(spark);
   }
   root.appendChild(node);
 }
 const title=doc.createElement("strong");
 title.className="fireworks-headline";
 title.textContent=headline;root.appendChild(title);
}
export class FireworksDirector{
 constructor(root,{reduceMotion=()=>false,onStart=()=>{},onStop=()=>{}}={}){
   this.root=root;
   this.reduceMotion=reduceMotion;this.onStart=onStart;this.onStop=onStop;
   this.timer=null;this.active=false;
   docAttach(root);
 }
 play({reached=1000,upto=reached}={}){
   this.stop();
   this.active=true;
   const text=upto>reached?
     "🎆 "+reached.toLocaleString("fr-FR")+" à "+upto.toLocaleString("fr-FR")+" POINTS !":
     "🎆 "+reached.toLocaleString("fr-FR")+" POINTS !";
   fillFireworks(this.root,{reduced:this.reduceMotion(),headline:text});
   this.root.classList.add("fireworks-in-game");
   this.root.hidden=false;
   this.onStart();
   this.timer=setTimeout(()=>this.stop(),FIREWORKS_DURATION_MS);
 }
 stop(){
   const was=this.active;
   clearTimeout(this.timer);this.timer=null;this.active=false;
   this.root.hidden=true;this.root.replaceChildren();
   if(was)this.onStop();
 }
}
function docAttach(stage){stage.ownerDocument.body.appendChild(stage);stage.hidden=true;}
