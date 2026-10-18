/**
 * Block Boost Festival Director — theme variety without changing game rules.
 * Lightweight DOM/CSS spectacles. Every scene is bounded and non-interactive.
 * Voices remain disabled as requested; FX use Kenney CC0 assets.
 */
import {createDiscoSpriteSheet,drawDiscoSpriteFrame} from "./disco-sprites.mjs";
import {jackpotBanner} from "./concert-cues.mjs";

export const FESTIVAL_THEMES=Object.freeze({
 forest:{name:"Lucioles nocturnes",symbol:"✦",color:"#69e6a3",sound:"forest"},
 crystal:{name:"Aurore de cristal",symbol:"✧",color:"#a8a6ff",sound:"crystal"},
 electric:{name:"Néons électriques",symbol:"ϟ",color:"#54edff",sound:"speed"},
 fireworks:{name:"Feu d'artifice de points",symbol:"✶",color:"#ffd487",sound:"combo"},
 galaxy:{name:"Galaxie en fête",symbol:"✺",color:"#de8aff",sound:"cosmic"},
 disco:{name:"BOULE À FACETTES !",symbol:"✦",color:"#ffdc79",sound:"disco"},
 bubbles:{name:"BAL DES BULLES !",symbol:"◌",color:"#a3f4ff",sound:"bubbles-create"}
});

/** Pure intent score. Only earned points/clears can call for a jackpot. */
export function chooseFestival(event,bonus={},previous="") {
  const lines=Math.max(0,event?.lines||0);
  const combo=Math.max(0,event?.combo||0);
  const gained=Math.max(0,event?.gained||0);
  const speed=Math.max(0,bonus?.speedMultiplier||0);
  const extra=(event?.noRotationBonus||0)>0||(bonus?.noRotationBonus||0)>0;
  const clearingCells=Array.isArray(event?.clearedCells)?event.clearedCells.length:lines*8;
  if(event?.type==="invalid"||(!lines&&!gained))
    return {theme:null,level:0,durationMs:0,particles:0};
  if(!lines && !extra && speed<2)
    return {theme:null,level:0,durationMs:0,particles:0};
  // Points, lines and combo are deliberate thresholds; never start a discoball
  // merely because a new session first exceeded its personal best.
  const jackpot=(lines>=2&&(combo>=2||gained>=500))||
    lines>=3||combo>=4||gained>=850;
  // Disjoint rewards: ordinary two-line clears = bubbles; big jackpots = disco.
  // A real same-move row+column cross always celebrates BOTH at once.
  const cross=lines>=2&&event?.crossMultiplier===10&&
    (event?.clearedRows?.length||0)>0&&(event?.clearedColumns?.length||0)>0;
  const bubbleReward=lines>=2;
  let theme;
  if(cross||jackpot)theme="disco"; // No "galaxy" suppression on repeat jackpots!
  else if(bubbleReward)theme="bubbles";
  else if(combo>=3)theme="galaxy";
  else if(speed>=3)theme=previous==="electric"?"crystal":"electric";
  else if(extra)theme=previous==="crystal"?"forest":"crystal";
  else theme=previous==="forest"?"crystal":"forest";
  const boosts=(lines>=2?1:0)+(clearingCells>=15?1:0)+
    (combo>=2?1:0)+(speed>=3?1:0)+(extra?1:0)+(gained>=500?1:0);
  const level=Math.min(5,Math.max(1,1+Math.floor(boosts*.85)));
  return {
    theme,level,score:gained,lines,combo,
    bubbles:theme==="bubbles"||cross,cross,crossMultiplier:event?.crossMultiplier||1,
    jackpot:theme==="disco"||theme==="galaxy"||theme==="bubbles",
    durationMs:theme==="disco"?4200:theme==="bubbles"?3300:theme==="galaxy"?2700:1900+level*110,
    particles:Math.min(58,10+6*level+(theme==="disco"?16:0))
  };
}

/** Preview hints the visual language without launching a particle show yet. */
export function previewTheme(lines,combo,bonus={},options={}) {
  if(lines<=0)return "";
  // Preview the SAME reward selection using the predicted earned points.
  const cross=Boolean(options.cross)&&lines>=2;
  const jackpot=(lines>=2&&(combo>=2||(options.gained||0)>=500))||
    lines>=3||combo>=4||(options.gained||0)>=850;
  if(cross||jackpot)return "disco";
  if(lines>=2)return "bubbles";
  if(combo>=3)return "galaxy";
  if((bonus.speedMultiplier||0)>=3)return "electric";
  if((bonus.noRotationBonus||0)>0)return "crystal";
  return "forest";
}

export class FestivalDirector {
  constructor(stage,{fx=()=>{},reduceMotion=()=>false,rng=Math.random}={}) {
    this.stage=stage;
    this.previewBoard=stage.closest(".board-wrap");
    // Put the entire particle/light layer directly under <body>, outside
    // board-wrap's rectangular box and any layout or clipping ancestors.
    // Position:fixed + overflow:visible in CSS make the beams bleed off-screen.
    document.body.appendChild(stage);
    this.fx=fx;
    this.reduceMotion=reduceMotion;
    this.rng=rng;
    this.timeout=null;
    this.popSoundTimeout=null;
    this.bubbleCreateTimeout=null;
    this.frameRequest=null;
    this.spriteSheet=null;
    this.lastTheme="";
    this.current=null;
  }
  stop(){
    clearTimeout(this.timeout);
    clearTimeout(this.popSoundTimeout);
    clearTimeout(this.bubbleCreateTimeout);
    if(this.frameRequest!==null)cancelAnimationFrame(this.frameRequest);
    this.frameRequest=null;
    this.timeout=null;
    this.current=null;
    this.stage.replaceChildren();
    this.stage.className="festival-stage";
    this.stage.removeAttribute("data-theme");
  }
  preview(theme) {
    this.previewBoard?.setAttribute("data-preview-theme",theme||"");
  }
  animateDisco(canvas,small){
    const ctx=canvas.getContext("2d");
    if(!ctx)return;
    try {
      // These are real, cached pre-rendered frames, not a CSS 3D transform.
      if(!this.spriteSheet)this.spriteSheet=createDiscoSpriteSheet(document);
    }catch(error){
      canvas.dataset.spriteError="unsupported";
      return;
    }
    const frames=this.spriteSheet.frames;
    let lastIndex=-1;
    const draw=index=>{
      if(index===lastIndex)return;
      drawDiscoSpriteFrame(ctx,this.spriteSheet,index);
      canvas.dataset.spriteFrame=String(index);
      lastIndex=index;
    };
    draw(0);
    if(small)return; // Reduced-motion: show still frame and soft static bloom.
    const started=performance.now();
    const tick=now=>{
      if(!this.current||!canvas.isConnected)return;
      // ~13 FPS, one axis (yaw), 20-frame loop. No CSS rotateX/rotateY/rotateZ.
      draw(Math.floor((now-started)/76)%frames);
      this.frameRequest=requestAnimationFrame(tick);
    };
    this.frameRequest=requestAnimationFrame(tick);
  }
  play(event,bonus={}) {
    const scene=chooseFestival(event,bonus,this.lastTheme);
    this.stop();
    if(!scene.theme)return scene;
    this.lastTheme=scene.theme;
    this.current=scene;
    this.stage.className="festival-stage festival-"+scene.theme+
      (scene.cross?" festival-cross":"");
    this.stage.dataset.theme=scene.theme;
    const small=this.reduceMotion()||
      globalThis.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    const fragment=document.createDocumentFragment();
    let ball=null;
    if(scene.theme==="disco") {
      ball=document.createElement("canvas");
      ball.className="festival-disco-ball";
      ball.width=168;ball.height=168;
      ball.setAttribute("aria-hidden","true");
      ball.dataset.rotationAxis="vertical-yaw-sprites";
      fragment.appendChild(ball);
      if(!small)for(let i=0;i<12;i++){
        const ray=document.createElement("i");
        ray.className="festival-ray";
        ray.style.setProperty("--ray-angle",(i*30)+"deg");
        ray.style.setProperty("--ray-delay",((i%4)*.07)+"s");
        fragment.appendChild(ray);
      }
    }
    if(scene.bubbles){
      // The spot heads stand at FLOOR LEVEL and shine upwards; the translucent
      // bubbles rise, expand and burst via bounded CSS animations.
      if(!small)for(let i=0;i<5;i++){
        const spot=document.createElement("i");
        spot.className="bubble-floor-spot";
        spot.style.setProperty("--floor-x",(8+i*21)+"%");
        spot.style.setProperty("--floor-angle",(-25+i*12)+"deg");
        spot.style.setProperty("--floor-delay",(i*.12)+"s");
        fragment.appendChild(spot);
      }
      const total=small?4:Math.min(32,12+scene.level*3);
      for(let i=0;i<total;i++){
        const bubble=document.createElement("i");
        bubble.className="festival-bubble";
        bubble.style.setProperty("--bubble-x",(8+this.rng()*84)+"%");
        bubble.style.setProperty("--bubble-size",(15+this.rng()*32)+"px");
        bubble.style.setProperty("--bubble-delay",(.08+(i%9)*.14)+"s");
        bubble.style.setProperty("--bubble-drift",((this.rng()-.5)*72)+"px");
        bubble.style.setProperty("--bubble-duration",(1.18+this.rng()*.85)+"s");
        fragment.appendChild(bubble);
      }
    }
    // Concert spotlights are independent of mirrored disco rays, and always
    // remain behind the legible score banner. Six gentle moving beams.
    if(["disco","galaxy","fireworks","electric"].includes(scene.theme)){
      const count=small?0:scene.theme==="disco"?6:3;
      for(let i=0;i<count;i++){
        const spot=document.createElement("i");
        spot.className="concert-spot";
        spot.style.setProperty("--spot-x",(i%2===0?"7%":"93%"));
        spot.style.setProperty("--spot-origin",i%2===0?"left":"right");
        spot.style.setProperty("--spot-angle",(i%2===0?24:-24)+(i-2.5)*9+"deg");
        spot.style.setProperty("--spot-delay",(i*.14)+"s");
        spot.style.setProperty("--spot-color",
          ["#ffb8eeaa","#91efffc2","#ffe9a8b8","#bdadffaf"][i%4]);
        fragment.appendChild(spot);
      }
    }
    if(scene.jackpot){
      const banner=jackpotBanner(event,bonus);
      const foreground=document.createElement("div");
      foreground.className="festival-bonus-front";
      foreground.setAttribute("aria-hidden","true"); // Existing #combo-flash announces points.
      const heading=document.createElement("strong");
      heading.className="festival-bonus-title";
      heading.textContent=scene.cross?"CROISEMENT ×10 !":
        scene.bubbles?"PLUIE DE BULLES !":banner.headline;
      const points=document.createElement("span");
      points.className="festival-bonus-points";
      points.textContent=banner.points;
      const details=document.createElement("span");
      details.className="festival-bonus-details";
      details.textContent=banner.details;
      foreground.append(heading,points,details);
      fragment.appendChild(foreground);
    }
    const maxParticles=small?Math.min(scene.particles,5):scene.particles;
    for(let i=0;i<maxParticles;i++){
      const mote=document.createElement("span");
      mote.className="festival-mote";
      mote.style.setProperty("--particle-angle",(i*137.5+this.rng()*12)+"deg");
      mote.style.setProperty("--particle-distance",(60+this.rng()*220)+"px");
      mote.style.setProperty("--particle-delay",((i%8)*.07)+"s");
      mote.style.setProperty("--particle-scale",(.6+this.rng()*1.4).toFixed(2));
      fragment.appendChild(mote);
    }
    const label=document.createElement("span");
    label.className="festival-label";
    label.textContent=FESTIVAL_THEMES[scene.theme].symbol+" "+
      FESTIVAL_THEMES[scene.theme].name+
      (scene.theme==="disco"?" · +"+scene.score:"");
    label.setAttribute("aria-hidden","true");
    fragment.appendChild(label);
    this.stage.appendChild(fragment);
    this.stage.style.setProperty("--festival-level",String(scene.level));
    this.stage.style.setProperty("--festival-size",(88+scene.level*21)+"px");
    if(ball)this.animateDisco(ball,Boolean(small));
    // The combined cross does NOT start two loud samples at the same instant.
    // Bass Drop 3 launches the disco; magic rises softly afterwards, then pops.
    this.fx(FESTIVAL_THEMES[scene.theme].sound);
    if(scene.cross){
      this.bubbleCreateTimeout=setTimeout(()=>{
        if(this.current===scene)this.fx("bubbles-create");
      },460);
    }
    if(scene.bubbles&&!small){
      this.popSoundTimeout=setTimeout(()=>{
        if(this.current===scene)this.fx("bubbles-pop");
      },scene.cross?1540:1100);
    }
    this.timeout=setTimeout(()=>this.stop(),small?850:scene.durationMs);
    return scene;
  }
}
