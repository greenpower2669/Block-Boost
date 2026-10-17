/**
 * Block Boost Festival Director — theme variety without changing game rules.
 * Lightweight DOM/CSS spectacles. Every scene is bounded and non-interactive.
 * Voices remain disabled as requested; FX use Kenney CC0 assets.
 */
export const FESTIVAL_THEMES=Object.freeze({
 forest:{name:"Lucioles nocturnes",symbol:"✦",color:"#69e6a3",sound:"forest"},
 crystal:{name:"Aurore de cristal",symbol:"✧",color:"#a8a6ff",sound:"crystal"},
 electric:{name:"Néons électriques",symbol:"ϟ",color:"#54edff",sound:"speed"},
 fireworks:{name:"Feu d'artifice de points",symbol:"✶",color:"#ffd487",sound:"combo"},
 galaxy:{name:"Galaxie en fête",symbol:"✺",color:"#de8aff",sound:"cosmic"},
 disco:{name:"BOULE À FACETTES !",symbol:"✦",color:"#ffdc79",sound:"disco"}
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
  let theme;
  if(jackpot)theme=previous==="disco"?"galaxy":"disco";
  else if(combo>=3)theme="galaxy";
  else if(lines>=2)theme=previous==="fireworks"?"electric":"fireworks";
  else if(speed>=3)theme=previous==="electric"?"crystal":"electric";
  else if(extra)theme=previous==="crystal"?"forest":"crystal";
  else theme=previous==="forest"?"crystal":"forest";
  const boosts=(lines>=2?1:0)+(clearingCells>=15?1:0)+
    (combo>=2?1:0)+(speed>=3?1:0)+(extra?1:0)+(gained>=500?1:0);
  const level=Math.min(5,Math.max(1,1+Math.floor(boosts*.85)));
  return {
    theme,level,score:gained,lines,combo,
    jackpot:theme==="disco"||theme==="galaxy",
    durationMs:theme==="disco"?3000:theme==="galaxy"?2700:1900+level*110,
    particles:Math.min(58,10+6*level+(theme==="disco"?16:0))
  };
}

/** Preview hints the visual language without launching a particle show yet. */
export function previewTheme(lines,combo,bonus={}) {
  if(lines<=0)return "";
  if(lines>=2 && (combo>=2||bonus.speedMultiplier>=3))return "disco";
  if(combo>=3)return "galaxy";
  if(lines>=2)return "fireworks";
  if((bonus.speedMultiplier||0)>=3)return "electric";
  if((bonus.noRotationBonus||0)>0)return "crystal";
  return "forest";
}

export class FestivalDirector {
  constructor(stage,{fx=()=>{},reduceMotion=()=>false,rng=Math.random}={}) {
    this.stage=stage;
    this.fx=fx;
    this.reduceMotion=reduceMotion;
    this.rng=rng;
    this.timeout=null;
    this.lastTheme="";
    this.current=null;
  }
  stop(){
    clearTimeout(this.timeout);
    this.timeout=null;
    this.current=null;
    this.stage.replaceChildren();
    this.stage.className="festival-stage";
    this.stage.removeAttribute("data-theme");
  }
  preview(theme) {
    this.stage.parentElement?.setAttribute("data-preview-theme",theme||"");
  }
  play(event,bonus={}) {
    const scene=chooseFestival(event,bonus,this.lastTheme);
    this.stop();
    if(!scene.theme)return scene;
    this.lastTheme=scene.theme;
    this.current=scene;
    this.stage.className="festival-stage festival-"+scene.theme;
    this.stage.dataset.theme=scene.theme;
    const small=this.reduceMotion()||
      globalThis.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    const fragment=document.createDocumentFragment();
    if(scene.theme==="disco") {
      const ball=document.createElement("div");
      ball.className="festival-disco-ball";
      ball.setAttribute("aria-hidden","true");
      // Mosaic/checkerboard facets are CSS-only: no background images.
      const facets=document.createElement("div");
      facets.className="festival-facets";
      ball.appendChild(facets);
      fragment.appendChild(ball);
      if(!small)for(let i=0;i<9;i++){
        const ray=document.createElement("i");
        ray.className="festival-ray";
        ray.style.setProperty("--ray-angle",(i*40)+"deg");
        ray.style.setProperty("--ray-delay",((i%3)*.07)+"s");
        fragment.appendChild(ray);
      }
    }
    const maxParticles=small?Math.min(scene.particles,5):scene.particles;
    for(let i=0;i<maxParticles;i++){
      const mote=document.createElement("span");
      mote.className="festival-mote";
      mote.style.setProperty("--particle-angle",(i*137.5+this.rng()*12)+"deg");
      mote.style.setProperty("--particle-distance",(44+this.rng()*110)+"px");
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
    this.stage.style.setProperty("--festival-size",(70+scene.level*15)+"px");
    this.fx(FESTIVAL_THEMES[scene.theme].sound);
    this.timeout=setTimeout(()=>this.stop(),small?850:scene.durationMs);
    return scene;
  }
}
