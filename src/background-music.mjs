/** Block Boost ambience: continuous MP3, short gain ducking, no EQ. */
export const MUSIC_MIX=Object.freeze({background:0.10,ducked:0.025,attackMs:130,releaseMs:850,fadeInMs:650});
const clamp=x=>Math.max(0,Math.min(1,x));
export class BackgroundMusic{
  constructor(isEnabled=()=>true){
    this.isEnabled=isEnabled;
    this.player=null;this.pending=false;this.target=0;this.duckUntil=0;
    this.fadeTimer=null;this.restoreTimer=null;
  }
  start(){
    if(!this.isEnabled()||!globalThis.Audio||globalThis.document?.hidden)return false;
    try{
      if(!this.player){
        this.player=new Audio(new URL("../assets/music/Blockboostmusic.mp3",import.meta.url).href);
        this.player.loop=true;this.player.preload="auto";this.player.volume=0;
      }
      if(!this.player.paused||this.pending)return true;
      this.pending=true;
      Promise.resolve(this.player.play()).then(()=>{
        this.pending=false;
        if(this.isEnabled()&&!this.player.paused)
          this.fadeTo(Date.now()<this.duckUntil?MUSIC_MIX.ducked:MUSIC_MIX.background,MUSIC_MIX.fadeInMs);
      }).catch(()=>{this.pending=false;});
      return true;
    }catch{this.pending=false;return false;}
  }
  fadeTo(target,ms){
    this.target=clamp(target);
    if(!this.player)return;
    if(this.fadeTimer!==null)clearInterval(this.fadeTimer);
    this.fadeTimer=null;
    const start=this.player.volume||0;
    if(ms<=0){this.player.volume=this.target;return;}
    const t0=Date.now();
    this.fadeTimer=setInterval(()=>{
      const t=clamp((Date.now()-t0)/ms);
      this.player.volume=clamp(start+(this.target-start)*(t*(2-t)));
      if(t>=1){clearInterval(this.fadeTimer);this.fadeTimer=null;}
    },35);
  }
  duck(ms=700){
    if(!this.isEnabled())return;
    this.duckUntil=Math.max(this.duckUntil,Date.now()+Math.max(250,ms));
    if(this.player&&this.target!==MUSIC_MIX.ducked)
      this.fadeTo(MUSIC_MIX.ducked,MUSIC_MIX.attackMs);
    this.scheduleRestore();
  }
  scheduleRestore(){
    if(this.restoreTimer!==null)clearTimeout(this.restoreTimer);
    this.restoreTimer=setTimeout(()=>{
      this.restoreTimer=null;
      if(Date.now()<this.duckUntil){this.scheduleRestore();return;}
      if(this.isEnabled()&&this.player&&!this.player.paused)
        this.fadeTo(MUSIC_MIX.background,MUSIC_MIX.releaseMs);
    },Math.max(0,this.duckUntil-Date.now())+20);
  }
  pause(){
    if(this.fadeTimer!==null)clearInterval(this.fadeTimer);
    if(this.restoreTimer!==null)clearTimeout(this.restoreTimer);
    this.fadeTimer=null;this.restoreTimer=null;this.pending=false;
    try{this.player?.pause();}catch{}
  }
  setEnabled(enabled){
    if(!enabled){this.pause();this.duckUntil=0;}
    else this.start();
  }
}
