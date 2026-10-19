import {PRIVATE_AUDIO_FILES} from "./private-audio.mjs";
import {victoryScore,VICTORY_SECONDS} from "./victory-music.mjs";
import {CONCERT_CUES,chooseJingle} from "./concert-cues.mjs";
import {KENNEY_AUDIO} from "./kenney-audio.mjs";
import {VoiceDirector} from "./voice-director.mjs";
import {MusicBed} from "./music-bed.mjs";
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
    this.kenneySequences=new Map();
    this.lastMelodyAt=0;
    this.licensedPlayers=new Map();
    this.specialPlayers=new Map();
    this.specialTimers=[];
    this.fireworkPlaying=false;
    this.victoryMaster=null;
    this.lastVictoryAt=-Infinity;
    this.music=new MusicBed(this.getSettings);
  }
  updateMusic(){this.music.sync();}
  setMusicVisible(visible){this.music.setVisible(visible);}
  ensureAudio() {
    this.music.start(); // independent of FX and voice switches
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
  /** Soft musical notes with short attack/release. Fully original pitch motif,
   * never a full song. Keeps the user's "dring-biling" under 400ms. */
  melodicCue(kind){
    if(!this.getSettings().fx)return false;
    const notes=CONCERT_CUES[kind];if(!notes)return false;
    const now=Date.now();
    // A short global cooldown stops sound stacking on the same placement.
    if(now-this.lastMelodyAt<165 && kind!=="disco")return false;
    this.lastMelodyAt=now;
    this.ensureAudio();if(!this.ctx)return false;
    const gainScale=kind==="disco"?.027:.021;
    try{
      for(const [hz,offset,duration] of notes){
        const at=this.ctx.currentTime+offset;
        const oscillator=this.ctx.createOscillator();
        const gain=this.ctx.createGain();
        oscillator.type="sine";
        oscillator.frequency.setValueAtTime(hz,at);
        gain.gain.setValueAtTime(.0001,at);
        gain.gain.linearRampToValueAtTime(gainScale,at+.012);
        gain.gain.exponentialRampToValueAtTime(.0001,at+duration);
        oscillator.connect(gain);gain.connect(this.ctx.destination);
        oscillator.start(at);oscillator.stop(at+duration+.01);
      }
      return true;
    }catch{return false;}
  }
  /** Fades previous tune smoothly. Never stops user-selected voice separately. */
  stopVictoryMusic(){
    if(!this.victoryMaster||!this.ctx)return;
    try {
      const now=this.ctx.currentTime;
      this.victoryMaster.gain.cancelScheduledValues(now);
      this.victoryMaster.gain.setValueAtTime(this.victoryMaster.gain.value,now);
      this.victoryMaster.gain.exponentialRampToValueAtTime(.0001,now+.07);
    }catch{}
    this.victoryMaster=null;
  }
  /** Entirely original, four-second multi-part victory jingle.
   * A single master bus and soft peak limiter keep phone speakers gentle.
   */
  playVictoryMusic(){
    if(!this.getSettings().fx)return false;
    this.ensureAudio();
    if(!this.ctx)return false;
    const now=Date.now();
    if(now-this.lastVictoryAt<2300)return true; // one fanfare, no overlapping Bass Drop fallback
    this.music.duckFor(4400,.12);
    this.stopVictoryMusic();
    try {
      const ctx=this.ctx,t0=ctx.currentTime+.018;
      const master=ctx.createGain();
      master.gain.setValueAtTime(.35,t0);
      const limiter=ctx.createDynamicsCompressor();
      limiter.threshold.setValueAtTime(-19,t0);
      limiter.knee.setValueAtTime(20,t0);
      limiter.ratio.setValueAtTime(8,t0);
      limiter.attack.setValueAtTime(.008,t0);
      limiter.release.setValueAtTime(.13,t0);
      master.connect(limiter);limiter.connect(ctx.destination);
      const timbres={
        lead:["triangle",.85,.012],
        brass:["sawtooth",.42,.016],
        bass:["sine",.90,.010],
        tick:["sine",.44,.003],
        boing:["sine",.75,.010]
      };
      for(const n of victoryScore()){
        const [wave,mix,attack]=timbres[n.track];
        const at=t0+n.at,end=at+n.length;
        const oscillator=ctx.createOscillator(),envelope=ctx.createGain();
        oscillator.type=wave;
        oscillator.frequency.setValueAtTime(n.hz,at);
        if(n.slide!==1)oscillator.frequency.exponentialRampToValueAtTime(n.hz*n.slide,end);
        envelope.gain.setValueAtTime(.0001,at);
        envelope.gain.linearRampToValueAtTime(n.volume*mix,at+attack);
        envelope.gain.exponentialRampToValueAtTime(.0001,end);
        oscillator.connect(envelope);envelope.connect(master);
        oscillator.start(at);oscillator.stop(end+.012);
      }
      // Extra near-silent finish guard: exactly four seconds, no drone.
      master.gain.setValueAtTime(.35,t0+VICTORY_SECONDS-.065);
      master.gain.linearRampToValueAtTime(.0001,t0+VICTORY_SECONDS);
      this.victoryMaster=master;
      this.lastVictoryAt=now;
      return true;
    }catch{return false;}
  }
  /**
   * Only the private Djipie Android packaging workflow supplies these sounds.
   * No redistribution in public source, and only synchronised playback in-game.
   * The bundled effects are optional: public builds gracefully use Kenney CC0.
   */
  playLicensed(event) {
    if(this.getSettings().fx===false||!globalThis.Audio)return false;
    if(["streak2","streak3"].includes(event)&&this.getSettings().voice!==true)return false;
    const rel=PRIVATE_AUDIO_FILES[event];
    if(!rel)return false;
    try {
      let player=this.licensedPlayers.get(event);
      if(!player) {
        player=new Audio(new URL(rel,import.meta.url).href);
        player.preload="auto";
        this.licensedPlayers.set(event,player);
      }
      const voices=["streak2","streak3"].includes(event);
      const other=[...this.licensedPlayers.values()].filter(p=>p!==player&&!p.paused).length;
      player.volume=(voices?.27:event==="festival-disco"?.33:.25)/(1+other*.30);
      player.pause();player.currentTime=0;
      player.play()?.catch?.(()=>this.playKenney(event));
      return true;
    }catch {return false;}
  }
  /** Final-result guitar + fireworks from Djipie, mixed only for real events.
   * No raw files are placed in public source. Private CI injects asset paths.
   */
  special(event,volume=.24){
    if(this.getSettings().fx===false||!globalThis.Audio)return false;
    const path=PRIVATE_AUDIO_FILES[event];
    if(!path)return false;
    try{
      let audio=this.specialPlayers.get(event);
      if(!audio){
        audio=new Audio(new URL(path,import.meta.url).href);
        audio.preload="auto";
        this.specialPlayers.set(event,audio);
      }
      audio.volume=volume;
      audio.pause();audio.currentTime=0;
      audio.play()?.catch?.(()=>{});
      return true;
    }catch{return false;}
  }
  stopSpecial(event){
    const p=this.specialPlayers.get(event);
    if(p)try{p.pause();p.currentTime=0;}catch{}
  }
  stopResultGuitar(){this.stopSpecial("result-guitar");}
  playResultGuitar(){
    this.stopResultGuitar();
    this.music.duckFor(6500,.10);
    return this.special("result-guitar",.42)||this.playVictoryMusic();
  }
  stopFireworksAudio(){
    for(const timer of this.specialTimers)clearTimeout(timer);
    this.specialTimers=[];
    for(const name of ["fireworks-bed-amb","fireworks-bed-explosions",
      ...Array.from({length:7},(_,i)=>"fireworks-bang-"+String(i+1).padStart(2,"0"))])
      this.stopSpecial(name);
    this.fireworkPlaying=false;
  }
  playFireworksAudio(){
    this.stopFireworksAudio();
    if(this.getSettings().fx===false)return false;
    this.fireworkPlaying=true;
    this.music.duckFor(6400,.09);
    // Both ambient beds are converted and hard-trimmed to MAXIMUM six seconds
    // in Djipie's private compiler, with a short fade-out. The local timer
    // stops them independently of any faulty file duration/decoder.
    const start=this.special("fireworks-bed-amb",.105);
    const layer=this.special("fireworks-bed-explosions",.13);
    const timings=[140,760,1450,2120,2910,3770,4810];
    timings.forEach((delay,i)=>{
      const name="fireworks-bang-"+String(i+1).padStart(2,"0");
      this.specialTimers.push(setTimeout(()=>{
        if(this.fireworkPlaying&&this.getSettings().fx&&!this.special(name,.25)){
          // Public CC0-only build: soft pitched hit, never a loud synthetic explosion.
          this.chirp(330+(i%4)*95,.11,.024);
        }
      },delay));
    });
    this.specialTimers.push(setTimeout(()=>this.stopFireworksAudio(),6000));
    return start||layer;
  }
  stopAllSpecial(){
    this.stopFireworksAudio();this.stopResultGuitar();
  }
  /** 24 real small Kenney OGGs exported from Djipie CC0 — never Sonniss. */
  playKenney(event){
    if(this.getSettings().fx===false || !globalThis.Audio)return false;
    const soundMap={
      grab:["detach","detach2"],valid:["ready","ready2","ready3"],
      validRotate:["ready2","ready3"],rotate:["rotate","rotate2"],
      drop:["drop","drop2"],clear:["line","line2","line3"],lineSingle:["line","line2"],
      combo:["combo","combo2","combo3"],speed:["speed","speed2"],
      extra:["extra","extra2"],record:["combo3","disco2"],
      newBatch:["ready2","extra2"],loss:["drop2"],streak1:["forest","ready"],
      streak2:["combo2"],streak3:["combo3"],
      "festival-bubbles-create":["crystal","ready3"],
      "bubbles-pop":["line3","combo2"],
      "festival-forest":["forest"],"festival-crystal":["crystal","ready3"],
      "festival-electric":["speed2","rotate2"],
      "festival-fireworks":["combo2","combo3"],
      "festival-galaxy":["cosmic","line3"],
      "festival-disco":["disco","disco2"]
    };
    const choices=soundMap[event];if(!choices?.length)return false;
    const index=this.kenneySequences.get(event)||0;
    this.kenneySequences.set(event,index+1);
    const key=choices[index%choices.length],uri=KENNEY_AUDIO[key];
    if(!uri)return false;
    try{
      let player=this.kenneyPlayers.get(key);
      if(!player){
        player=new Audio(uri);
        player.preload="auto";
        if(player.canPlayType && player.canPlayType("audio/ogg")==="")return false;
        this.kenneyPlayers.set(key,player);
      }
      const otherPlaying=[...this.kenneyPlayers.values()]
        .filter(p=>p!==player&&!p.paused).length;
      player.volume=(key.startsWith("disco")?.23:.165)/(1+otherPlaying*.45);
      player.pause();player.currentTime=0;
      player.play()?.catch?.(()=>{});
      return true;
    }catch{return false;}
  }
  fx(event) {
    if(!this.getSettings().fx)return;
    const big=event==="festival-disco"||event==="festival-bubbles-create"||
      event==="festival-fireworks"||event==="streak2"||event==="streak3";
    const length=event==="festival-disco"?4300:big?1650:
      /line|combo|festival|bubbles|streak|record/i.test(event)?950:420;
    this.music.duckFor(length,big ? 0.12 : 0.24);
    // Original 4s fanfare takes the place of the old short Bass Drop / Kenney
    // sample when WebAudio is available; source WAV is kept as fallback only.
    if(event==="festival-disco"&&this.playVictoryMusic())return;
    const themeJingle=event==="festival-disco"?"disco":null;
    const melody=themeJingle||chooseJingle(event);
    const sample=this.playLicensed(event)||this.playKenney(event);
    if(melody) this.melodicCue(melody);
    if(sample)return;
    // The OGG decoder can be unavailable in browser tests: gentle safe fallback.
    if(event==="grab")this.chirp(360,.065,.038);
    else if(event==="invalid")this.chirp(190,.095,.028);
    else if(event==="rotate")this.chirp(520,.082,.037);
    else if(event==="record")this.melodicCue("disco");
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
    // The user controls voices; saved preference defaults to OFF on a fresh install.
    if(this.getSettings().voice!==true)return;
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
    this.music.duckFor(Math.max(2400,phrase.length*125+750),.08);
    clearTimeout(this.captionTimeout);clearTimeout(this.emotionTimeout);
    this.captionTimeout=setTimeout(()=>this.onCaption(""),3700);
    this.emotionTimeout=setTimeout(()=>this.onEmotion("idle"),1200);
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
  /** Stop speech only — disabling voices must NOT stop haptic guidance or FX. */
  stopVoice(){
    try{globalThis.speechSynthesis?.cancel();}catch{}
    try{globalThis.AndroidBridge?.stop?.();}catch{}
    for(const key of ["streak2","streak3"]){try{this.licensedPlayers.get(key)?.pause();}catch{}}
    this.nativeSpeakingUntil=0;
    this.currentSpeech=null;
    this.onCaption("");
    clearTimeout(this.captionTimeout);clearTimeout(this.emotionTimeout);
    this.priority=0;
    this.lastVoice=0;
    this.lastByKind.clear();
  }
  stop(pauseMusic=false){
    if(pauseMusic)this.music.pause();
    this.stopVictoryMusic();
    this.stopAllSpecial();
    this.stopGuidance();
    this.stopVoice();
  }
}
