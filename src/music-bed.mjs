/** Looping background track with a side-chain envelope, independent from FX/voices. */
export const DEFAULT_MUSIC_VOLUME=16;
const clamp=(x,a,b)=>Math.min(b,Math.max(a,x));
export function musicTarget(settings={},ducks=[],now=Date.now()){
  if(settings.music===false)return 0;
  const v=Number.isFinite(settings.musicVolume)?clamp(settings.musicVolume,0,100):DEFAULT_MUSIC_VOLUME;
  return v/100*ducks.reduce((gain,duck)=>
    duck.until>now?Math.min(gain,clamp(duck.factor,0,1)):gain,1);
}
export class MusicBed {
  constructor(getSettings,{createAudio,now=()=>Date.now()}={}){
    this.getSettings=getSettings;
    this.createAudio=createAudio||(()=>new Audio(new URL("../Blockboostmusic.mp3",import.meta.url).href));
    this.now=now;this.player=null;this.visible=true;this.starting=false;
    this.ducks=[];this.expiryTimer=null;this.fadeTimer=null;
  }
  start(){
    if(!this.visible||this.getSettings().music===false)return;
    try{
      if(!this.player){
        if(!globalThis.Audio)return;
        this.player=this.createAudio();
        this.player.loop=true;this.player.preload="auto";this.player.volume=0;
      }
      if(this.player.paused&&!this.starting){
        this.starting=true;
        Promise.resolve(this.player.play()).catch(()=>{}).finally(()=>{this.starting=false;});
      }
      this.refresh();
    }catch{this.starting=false;}
  }
  refresh(){
    if(!this.player)return;
    const now=this.now();
    this.ducks=this.ducks.filter(x=>x.until>now);
    const target=musicTarget(this.getSettings(),this.ducks,now);
    const from=Number(this.player.volume)||0;
    this.fadeTo(target,target<from?85:600);
    clearTimeout(this.expiryTimer);
    if(this.ducks.length){
      const next=Math.min(...this.ducks.map(x=>x.until));
      this.expiryTimer=setTimeout(()=>this.refresh(),Math.max(1,next-now+4));
    }
  }
  fadeTo(target,milliseconds){
    clearInterval(this.fadeTimer);this.fadeTimer=null;
    const player=this.player;if(!player)return;
    const start=this.now(),from=Number(player.volume)||0;
    if(Math.abs(from-target)<.001){player.volume=target;return;}
    this.fadeTimer=setInterval(()=>{
      if(this.player!==player){clearInterval(this.fadeTimer);this.fadeTimer=null;return;}
      const p=clamp((this.now()-start)/milliseconds,0,1);
      const smooth=p*p*(3-2*p);
      try{player.volume=clamp(from+(target-from)*smooth,0,1);}catch{}
      if(p>=1){clearInterval(this.fadeTimer);this.fadeTimer=null;}
    },25);
  }
  /** Multiple simultaneous cues never cancel a stronger existing duck. */
  duckFor(ms=450,factor=.24){
    if(this.getSettings().music===false||!this.visible)return;
    this.ducks.push({until:this.now()+Math.max(0,ms),factor});
    if(this.player)this.refresh();
  }
  sync(){if(this.getSettings().music===false)this.pause();else this.start();}
  setVisible(visible){this.visible=Boolean(visible);if(this.visible)this.start();else this.pause();}
  pause(){
    clearInterval(this.fadeTimer);this.fadeTimer=null;
    clearTimeout(this.expiryTimer);this.expiryTimer=null;this.ducks=[];
    if(this.player)try{this.player.volume=0;this.player.pause();}catch{}
  }
}
