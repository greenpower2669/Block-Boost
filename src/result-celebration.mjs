/** Three sequential, bounded visual scenes inside the RESULT dialog top-layer.
 * 1. mirror ball (3.2s), 2. bubbles and floor lights (2.8s), 3. fireworks (6s).
 * The dialog text and replay button remain accessible/visible the entire time.
 */
import {createDiscoSpriteSheet,drawDiscoSpriteFrame} from "./disco-sprites.mjs";
import {fillFireworks} from "./fireworks.mjs";
export const RESULT_SCENES=Object.freeze([
  {id:"disco",durationMs:3200},
  {id:"bubbles",durationMs:2800},
  {id:"fireworks",durationMs:6000}
]);
export class ResultCelebration{
 constructor(root,{reduceMotion=()=>false,onScene=()=>{}}={}){
  this.root=root;this.reduceMotion=reduceMotion;this.onScene=onScene;
  this.timer=null;this.frame=null;this.token=0;this.spriteSheet=null;
  this.active=false;this.index=-1;
 }
 stop(){
  this.token++;this.active=false;this.index=-1;
  clearTimeout(this.timer);this.timer=null;
  if(this.frame!==null)cancelAnimationFrame(this.frame);this.frame=null;
  this.root.replaceChildren();this.root.dataset.scene="";
 }
 play(){
  this.stop();this.active=true;this.advance(0,this.token);
 }
 advance(index,token){
  if(!this.active||this.token!==token)return;
  this.index=index;
  const scene=RESULT_SCENES[index];
  if(!scene){this.active=false;this.root.dataset.scene="done";return;}
  this.root.replaceChildren();
  this.root.className="result-effects result-effects-"+scene.id;
  this.root.dataset.scene=scene.id;
  this.onScene(scene.id);
  const small=this.reduceMotion()||globalThis.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
  if(scene.id==="disco"){
    const canvas=document.createElement("canvas");
    canvas.width=168;canvas.height=168;canvas.className="result-mirror-ball";
    canvas.setAttribute("aria-hidden","true");this.root.appendChild(canvas);
    if(!small)for(let i=0;i<7;i++){
      const ray=document.createElement("i");ray.className="result-mirror-ray";
      ray.style.setProperty("--angle",i*360/7+"deg");this.root.appendChild(ray);
    }
    try{
      if(!this.spriteSheet)this.spriteSheet=createDiscoSpriteSheet(document);
      const ctx=canvas.getContext("2d"),sheet=this.spriteSheet;
      if(ctx){let prev=-1;const start=performance.now();
        const draw=now=>{
          if(!this.active||this.token!==token||this.index!==index||!canvas.isConnected)return;
          const n=small?0:Math.floor((now-start)/76)%sheet.frames;
          if(n!==prev){drawDiscoSpriteFrame(ctx,sheet,n);prev=n;}
          if(!small)this.frame=requestAnimationFrame(draw);
        };
        draw(start);
      }
    }catch {canvas.dataset.error="sprite-fallback";}
  }else if(scene.id==="bubbles"){
    if(!small)for(let i=0;i<5;i++){
      const spot=document.createElement("i");spot.className="result-floor-spot";
      spot.style.setProperty("--x",(8+i*21)+"%");
      spot.style.setProperty("--angle",(-24+i*12)+"deg");this.root.appendChild(spot);
    }
    for(let i=0;i<(small?4:28);i++){
      const bubble=document.createElement("i");bubble.className="result-floating-bubble";
      bubble.style.setProperty("--x",(6+((i*41)%90))+"%");
      bubble.style.setProperty("--size",(16+i%7*5)+"px");
      bubble.style.setProperty("--delay",small?"0ms":((i%8)*145)+"ms");
      this.root.appendChild(bubble);
    }
  }else if(scene.id==="fireworks"){
    fillFireworks(this.root,{reduced:small,headline:"🏆 RECORD EXPLOSIF !"});
    this.root.classList.add("result-effects","result-effects-fireworks");
  }
  const badge=document.createElement("strong");badge.className="result-effect-label";
  badge.textContent=scene.id==="disco"?"🪩 BOULE À FACETTES":
    scene.id==="bubbles"?"🫧 PLUIE DE BULLES":"🎆 FEU D'ARTIFICE";
  this.root.appendChild(badge);
  this.timer=setTimeout(()=>{
    if(this.frame!==null){cancelAnimationFrame(this.frame);this.frame=null;}
    this.advance(index+1,token);
  },scene.durationMs);
 }
}
