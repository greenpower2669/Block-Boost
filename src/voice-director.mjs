/**
 * Voice orchestration: semantic variety, 48-item history, mood, cooldowns.
 * Pure JavaScript, independent of the game engine, works offline.
 * Android performs synthesis on its own thread; this module only selects text.
 */
export const VOICE_HISTORY_KEY="blockboost.voice-history.v2";
export const EMOTIONS={
  welcome:{mood:"calm",priority:1},
  clear:{mood:"encourage",priority:2},
  big:{mood:"surprise",priority:3},
  combo:{mood:"combo",priority:4},
  record:{mood:"celebrate",priority:5},
  over:{mood:"consolation",priority:5}
};
export const EXTRA_LINES={
  welcome:["À toi de jouer !","Regardons ce qu'on peut créer !","C'est parti pour une jolie partie !",
           "À nous les belles combinaisons !"],
  clear:["Bien joué, ça se libère !","Et hop, une belle ligne !","Ça brille !",
         "Wouah, c'est propre !","C'est un joli coup !","On avance !"],
  big:["Oh là là, regarde cette lumière !","Superbe enchaînement !",
       "Deux lignes d'un coup, quelle classe !","Ça, c'est spectaculaire !","Incroyable combinaison !"],
  combo:["Encore un combo, tu es lancé !","Quelle série !","Les points s'envolent !",
         "Ça chauffe, continue !","On ne t'arrête plus !","Quel rythme !","Encore mieux !"],
  record:["Un nouveau record, fantastique !","Bravo, tu viens de battre ton meilleur score !",
          "C'est un exploit, regarde ce record !","Waouh, c'est ton nouveau sommet !"],
  over:["Une belle partie, on réessaie ?","Bien joué ! On fera encore mieux ensemble.",
        "J'ai adoré jouer avec toi !","Ce n'est que partie remise !"]
};
const safeHistory = value=>Array.isArray(value) ?
 value.filter(v=>v&&typeof v.key==="string"&&v.key.length<=160&&
   Number.isFinite(v.time)&&v.time>=0).slice(-48) : [];
export class VoiceDirector {
  constructor(storage=globalThis.localStorage,clock=()=>Date.now(),rng=Math.random){
    this.storage=storage;this.clock=clock;this.rng=rng;
    this.history=[];
    try{this.history=safeHistory(JSON.parse(storage.getItem(VOICE_HISTORY_KEY)));}
    catch{}
  }
  choose(mascot,kind,force=false){
    const event=EMOTIONS[kind]||EMOTIONS.clear;
    const options=[...(mascot.lines[kind]||[]),...(EXTRA_LINES[kind]||EXTRA_LINES.clear)];
    if(!options.length)return null;
    const now=this.clock();
    // Avoid the last 8 sentences across all mascots, not just exact immediate repeat.
    const recent=new Set(this.history.slice(-8).map(h=>h.key));
    let choices=options.filter(phrase=>!recent.has(phrase));
    if(!choices.length){
      // Exhausted pool: least recently spoken option rather than same phrase again.
      let oldest=Infinity;
      for(const text of options){
        const recentMatch=this.history.findLast?.(h=>h.key===text) ||
          [...this.history].reverse().find(h=>h.key===text);
        const at=recentMatch?.time??-1;
        oldest=Math.min(oldest,at);
      }
      choices=options.filter(text=>{
        const match=[...this.history].reverse().find(h=>h.key===text);
        return (match?.time??-1)===oldest;
      });
    }
    const chosen=choices[Math.min(choices.length-1,Math.floor(this.rng()*choices.length))];
    this.history.push({key:chosen,time:now});
    this.history=this.history.slice(-48);
    try{this.storage?.setItem(VOICE_HISTORY_KEY,JSON.stringify(this.history));}catch{}
    return {phrase:chosen,mood:event.mood,priority:event.priority,kind,force};
  }
}
export function supportsVoiceClips(manifest) {
  return manifest && typeof manifest==="object" && manifest.version===1;
}
