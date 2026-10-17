import {KENNEY_AUDIO} from "./kenney-audio.mjs";
import {VoiceDirector} from "./voice-director.mjs";
// Audio and mascot direction: independent of the rules engine. No remote services.
export const MASCOTS={
  pompom:{name:"Pompom",species:"Panda roux",emoji:"🦊",voicePitch:0.90,lines:{
    welcome:["Doucement, mais sûrement !","On joue ensemble ?"],
    clear:["Ooh, bien joué !","Ça fait de la place !"],
    big:["Oh, le beau coup !","C'est magnifique !"],
    combo:["Tu enchaînes, bravo !","Quel joli combo !"],
    record:["Nouveau record ! Je suis fier de toi !"],
    over:["Belle partie ! On retente ensemble ?"]}},
  plume:{name:"Plume",species:"Lapereau",emoji:"🐰",voicePitch:1.30,lines:{
    welcome:["Hop ! C'est parti !"],clear:["Hop, une ligne !","Génial !"],
    big:["Deux d'un coup !","Ça décolle !"],combo:["On ne t'arrête plus !"],
    record:["Wouhou, nouveau record !"],over:["Encore une partie ?"]}},
  lilo:{name:"Lilo",species:"Loutre",emoji:"🦦",voicePitch:1.13,lines:{
    welcome:["Coucou, on joue ?"],clear:["Bravo, joli plongeon !"],
    big:["Splash ! Quel beau coup !"],combo:["Tu m'éclabousses de points !"],
    record:["Ton record vient de plonger vers les étoiles !"],
    over:["C'était chouette, on recommence ?"]}},
  nox:{name:"Nox",species:"Chouette",emoji:"🦉",voicePitch:0.87,lines:{
    welcome:["Observons la grille."],clear:["Bien observé."],
    big:["Quelle belle combinaison !"],combo:["Une série remarquable !"],
    record:["Nouveau sommet atteint. Bravo !"],
    over:["Une belle réflexion. Encore une ?"]}},
  moka:{name:"Moka",species:"Chaton",emoji:"🐱",voicePitch:1.18,lines:{
    welcome:["Miaou, je suis prêt !"],clear:["Miaougnifique !"],
    big:["Je ronronne de bonheur !"],combo:["Quel combo, miaou !"],
    record:["Miaou, un nouveau record !"],over:["Viens, on rejoue ?"]}},
  biscotte:{name:"Biscotte",species:"Renardeau",emoji:"🦊",voicePitch:1.08,lines:{
    welcome:["Prêt à être rusé ?"],clear:["Bien joué, malin !"],
    big:["Rusé comme un renard !"],combo:["Tu assures, petit génie !"],
    record:["Un record, quelle ruse !"],over:["Bien tenté ! À la prochaine ?"]}}
};
export class Feedback {
  constructor(getSettings,getMascot,onCaption,onEmotion) {
    this.getSettings=getSettings;this.getMascot=getMascot;
    this.onCaption=onCaption;this.onEmotion=onEmotion;
    this.ctx=null;this.lastVoice=0;this.lastPhrase="";this.priority=0;
    this.currentSpeech=null;this.captionTimeout=null;this.emotionTimeout=null;
    this.director=new VoiceDirector();this.nativeSpeakingUntil=0;
    this.lastByKind=new Map();
    this.kenneyPlayers=new Map();
  }
  ensureAudio() {
    if(!this.getSettings().fx) return;
    try{
      const Context=globalThis.AudioContext||globalThis.webkitAudioContext;
      if(!Context) return;
      if(!this.ctx)this.ctx=new Context();
      if(this.ctx.state==="suspended")this.ctx.resume().catch(()=>{});
    }catch{}
  }
  chirp(freq=520,duration=.12,volume=.10,delay=0) {
    if(!this.getSettings().fx)return;
    this.ensureAudio();if(!this.ctx)return;
    try{
      const osc=this.ctx.createOscillator(),gain=this.ctx.createGain(),now=this.ctx.currentTime+delay;
      osc.type="sine";osc.frequency.setValueAtTime(freq,now);
      osc.frequency.exponentialRampToValueAtTime(Math.max(150,freq*1.4),now+duration);
      gain.gain.setValueAtTime(.0001,now);
      gain.gain.exponentialRampToValueAtTime(volume*((this.currentSpeech?.speaking || Date.now() < (this.nativeSpeakingUntil||0)) ? .3 : 1),now+.015);
      gain.gain.exponentialRampToValueAtTime(.0001,now+duration);
      osc.connect(gain);gain.connect(this.ctx.destination);osc.start(now);osc.stop(now+duration+.01);
    }catch{}
  }
  /** Djipie/RESSOURCES_PARTAGEES/AUDIO: 12 CC0 Kenney OGGs embedded OFFLINE.
   * Only sounds from that verified small archive; Sonniss is never included. */
  playKenney(event) {
    if(this.getSettings().fx===false || !globalThis.Audio)return false;
    const soundMap={
      grab:"detach",valid:"ready",validRotate:"ready",rotate:"rotate",
      drop:"drop",clear:"line",combo:"combo",speed:"speed",extra:"extra",
      "festival-forest":"forest","festival-crystal":"crystal",
      "festival-electric":"speed","festival-fireworks":"combo",
      "festival-galaxy":"cosmic","festival-disco":"disco"
    };
    const key=soundMap[event],uri=KENNEY_AUDIO[key];
    if(!uri)return false;
    try {
      let player=this.kenneyPlayers.get(key);
      if(!player) {
        player=new Audio(uri);
        player.preload="auto";
        if(player.canPlayType && player.canPlayType("audio/ogg")==="")return false;
        this.kenneyPlayers.set(key,player);
      }
      // Normalize overlapping FX: line + speed + EXTRA + festival can coincide.
      const simultaneous=[...this.kenneyPlayers.values()]
        .filter(p=>p!==player&&!p.paused).length;
      player.volume=(key==="disco"?.26:key==="combo"?.22:.18)/
        (1+simultaneous*.36);
      player.pause();
      player.currentTime=0;
      const promise=player.play();
      promise?.catch?.(()=>{});
      return true;
    }catch{return false;}
  }
  fx(event) {
    if(!this.getSettings().fx)return;
    if(this.playKenney(event)) {
      // Tiny second chime retains the requested "dring-biling" signature.
      if(event==="valid"||event==="validRotate")this.chirp(925,.105,.028,.11);
      return;
    }
    if(event==="grab")this.chirp(285,.07,.055); // Detaching a block from tray
    if(event==="valid") {
      this.chirp(690,.085,.053);
      this.chirp(940,.13,.050,.09); // The little "dring-biling" when placement is ready
    }
    if(event==="validRotate") {
      this.chirp(740,.085,.053);
      this.chirp(1060,.16,.050,.095);
    }
    if(event==="drop")this.chirp(310,.075,.07);
    if(event==="invalid")this.chirp(195,.11,.035);
    if(event==="rotate")this.chirp(450,.10,.05);
    if(event==="clear") {this.chirp(530,.17,.09);this.chirp(780,.23,.075);}
    if(event==="combo") {this.chirp(650,.22,.10);this.chirp(930,.30,.08);}
    if(event==="speed") {this.chirp(730,.14,.095);this.chirp(1020,.21,.07);}
    if(event==="extra") this.chirp(880,.18,.06);
    if(event==="record") {this.chirp(620,.26,.09);this.chirp(930,.32,.09);this.chirp(1200,.37,.09);}
  }
  haptic(kind) {
    if(this.getSettings().haptics===false)return;
    if(globalThis.AndroidBridge?.haptic){
      try{globalThis.AndroidBridge.haptic(kind);return;}catch{}
    }
    const pattern={grab:12,valid:16,validRotate:[15,35,17],
      rotate:[12,30,12],drop:22,clear:[20,35,28],combo:[25,35,25]}[kind];
    if(pattern!==undefined)try{globalThis.navigator?.vibrate?.(pattern);}catch{}
  }
  guideHaptic(level) {
    const desired=this.getSettings().haptics===false?0:Math.max(0,Math.min(6,level|0));
    const now=Date.now();
    if(desired===this.guidanceLevel && now-(this.guidanceLast||0)<220)return;
    this.guidanceLevel=desired;this.guidanceLast=now;
    if(globalThis.AndroidBridge?.guidance) {
      try{globalThis.AndroidBridge.guidance(desired);return;}catch{}
    }
    // Browser fallback: capped pulses, never a repeating waveform.
    try {
      if(!globalThis.navigator?.vibrate)return;
      if(desired===0)globalThis.navigator.vibrate(0);
      else globalThis.navigator.vibrate([0,35+desired*22]);
    }catch{}
  }
  stopGuidance() {
    this.guidanceLevel=0;this.guidanceLast=Date.now();
    try{globalThis.AndroidBridge?.stopHaptics?.();}catch{}
    try{globalThis.navigator?.vibrate?.(0);}catch{}
  }
  rewardHaptic(kind) {
    if(this.getSettings().haptics===false){this.stopGuidance();return;}
    this.stopGuidance();
    if(!kind)return;
    if(globalThis.AndroidBridge?.reward) {
      try{globalThis.AndroidBridge.reward(kind);return;}catch{}
    }
    // Short, finite Web/PWA fallback sequences; no infinite vibration.
    const map={
      drop:[35],extra:[55,70,90],speed:[50,60,80],
      speedHigh:[65,55,115],speedExtra:[45,45,65,45,95],
      line:[70,55,100],lineBonus:[75,45,125],
      combo:[65,50,80,50,105],comboBonus:[70,40,90,40,130],
      lineDouble:[65,55,125],lineCascade:[65,45,95,45,135],
      comboDouble:[65,50,85,50,120],comboCascade:[70,40,85,40,110,40,140]
    };
    try{globalThis.navigator?.vibrate?.(map[kind]||0);}catch{}
  }
  speak(kind,priority=1,force=false) {
    // Voice pause requested by Fab and his son; visual feedback + FX remain active.
    return;
    const mascot={...(MASCOTS[this.getMascot()]||MASCOTS.pompom),id:this.getMascot()};
    const now=Date.now();
    const currentlySpeaking=Boolean(this.currentSpeech?.speaking) ||
      now<(this.nativeSpeakingUntil||0);
    if(!currentlySpeaking)this.priority=0;
    if(!force&&currentlySpeaking&&priority<this.priority)return;
    // Silence is intentional: the score/banner/FX still respond to every move.
    // A mascot speaks at most once every 7s, and no one event dominates the speech.
    if(!force && now-this.lastVoice<7000)return;
    if(!force && now-(this.lastByKind.get(kind)||0)<17000)return;
    const speech=this.director.choose(mascot,kind,force);
    if(!speech)return;
    const {phrase,mood}=speech;
    const effectivePriority=Math.max(priority,speech.priority);
    this.lastPhrase=phrase;this.lastVoice=now;this.priority=effectivePriority;
    this.lastByKind.set(kind,now);
    this.onCaption(phrase);
    this.onEmotion(kind==="clear"?"happy":kind);
    clearTimeout(this.captionTimeout);clearTimeout(this.emotionTimeout);
    this.captionTimeout=setTimeout(()=>this.onCaption(""),3700);
    this.emotionTimeout=setTimeout(()=>this.onEmotion("idle"),1200);
    if(!this.getSettings().voice)return;
    if(globalThis.AndroidBridge?.speak){
      try{
        // Native Android TextToSpeech is offline-capable and uses the installed French voice.
        globalThis.AndroidBridge.speak(phrase, mascot.voicePitch, mood, effectivePriority, "");
        this.nativeSpeakingUntil=Date.now()+Math.max(1900,phrase.length*100);
        return;
      }catch{ /* Fall back to the browser voice if available. */ }
    }
    if(!("speechSynthesis" in globalThis))return;
    try{
      globalThis.speechSynthesis.cancel();
      const utterance=new SpeechSynthesisUtterance(phrase);
      utterance.lang="fr-FR";
      utterance.rate=({calm:.95,encourage:1.04,surprise:1.10,combo:1.12,celebrate:1.13,consolation:.92}[mood]||1);
      utterance.pitch=Math.min(1.55,mascot.voicePitch*({calm:.96,encourage:1.05,surprise:1.13,combo:1.17,celebrate:1.21,consolation:.94}[mood]||1));
      utterance.volume=.85;
      const voices=globalThis.speechSynthesis.getVoices();
      const french=voices.find(v=>v.lang?.toLowerCase().startsWith("fr")&&v.localService)||
                   voices.find(v=>v.lang?.toLowerCase().startsWith("fr"));
      if(french)utterance.voice=french;
      this.currentSpeech=globalThis.speechSynthesis;
      utterance.onend=()=>{this.priority=0;this.currentSpeech=null;};
      utterance.onerror=()=>{this.priority=0;this.currentSpeech=null;};
      globalThis.speechSynthesis.speak(utterance);
    }catch{this.priority=0;}
  }
  stop(){
    this.stopGuidance();
    try{globalThis.speechSynthesis?.cancel();}catch{}
    try{globalThis.AndroidBridge?.stop?.();}catch{}
    this.nativeSpeakingUntil=0;
    clearTimeout(this.captionTimeout);clearTimeout(this.emotionTimeout);
    this.priority=0;
  }
}
