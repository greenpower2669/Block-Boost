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
  chirp(freq=520,duration=.12,volume=.10) {
    if(!this.getSettings().fx)return;
    this.ensureAudio();if(!this.ctx)return;
    try{
      const osc=this.ctx.createOscillator(),gain=this.ctx.createGain(),now=this.ctx.currentTime;
      osc.type="sine";osc.frequency.setValueAtTime(freq,now);
      osc.frequency.exponentialRampToValueAtTime(Math.max(150,freq*1.4),now+duration);
      gain.gain.setValueAtTime(.0001,now);
      gain.gain.exponentialRampToValueAtTime(volume*(this.currentSpeech?.speaking?.() ? .3 : 1),now+.015);
      gain.gain.exponentialRampToValueAtTime(.0001,now+duration);
      osc.connect(gain);gain.connect(this.ctx.destination);osc.start(now);osc.stop(now+duration+.01);
    }catch{}
  }
  fx(event) {
    if(!this.getSettings().fx)return;
    if(event==="drop")this.chirp(310,.075,.07);
    if(event==="invalid")this.chirp(195,.11,.035);
    if(event==="rotate")this.chirp(450,.10,.05);
    if(event==="clear") {this.chirp(530,.17,.09);this.chirp(780,.23,.075);}
    if(event==="combo") {this.chirp(650,.22,.10);this.chirp(930,.30,.08);}
    if(event==="record") {this.chirp(620,.26,.09);this.chirp(930,.32,.09);this.chirp(1200,.37,.09);}
  }
  speak(kind,priority=1,force=false) {
    const mascot=MASCOTS[this.getMascot()]||MASCOTS.pompom;
    const options=mascot.lines[kind]||mascot.lines.clear;
    const now=Date.now();
    if(!force && now-this.lastVoice<3200)return;
    if(!force && priority<this.priority && globalThis.speechSynthesis?.speaking)return;
    const candidates=options.filter(s=>s!==this.lastPhrase);
    const phrase=(candidates.length?candidates:options)[Math.floor(Math.random()*(candidates.length||options.length))];
    this.lastPhrase=phrase;this.lastVoice=now;this.priority=priority;
    this.onCaption(phrase);
    this.onEmotion(kind);
    clearTimeout(this.captionTimeout);clearTimeout(this.emotionTimeout);
    this.captionTimeout=setTimeout(()=>this.onCaption(""),3700);
    this.emotionTimeout=setTimeout(()=>this.onEmotion("idle"),1200);
    if(!this.getSettings().voice || !("speechSynthesis" in globalThis))return;
    try{
      globalThis.speechSynthesis.cancel();
      const utterance=new SpeechSynthesisUtterance(phrase);
      utterance.lang="fr-FR";utterance.rate=1.06;utterance.pitch=mascot.voicePitch;utterance.volume=.85;
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
    try{globalThis.speechSynthesis?.cancel();}catch{}
    clearTimeout(this.captionTimeout);clearTimeout(this.emotionTimeout);
    this.priority=0;
  }
}
