import {CHARACTER_LINES,SHARED_LINES} from "./phrase-bank.mjs";
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
  over:{mood:"consolation",priority:5},
  speed2:{mood:"surprise",priority:3},
  speed3:{mood:"combo",priority:3},
  speed4:{mood:"celebrate",priority:4},
  noRotation:{mood:"encourage",priority:2},
  wow:{mood:"surprise",priority:4}
};
export const EXTRA_LINES={
  wow:["Waouh !","Hooo !","Whaa !","Wouhou !","Oh là là !",
    "Wooow !","Hé hé, incroyable !","Hooo, magnifique !",
    "Waouh, quel combo !","Whaaa, ça brille !","Ohhh, bien joué !",
    "Wouaaah !","Hop là, quelle fête !","Whaaa, tu as vu ça ?",
    "Waouh, quel spectacle !","Hooo, superbe !"],
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
  speed2:["Turbo ! Bonus vitesse fois deux !","Super réflexe ! Multiplicateur deux !","Vitesse fois deux, ça rapporte !"],
  speed3:["Fusée ! Vitesse fois trois !","Triple bonus de rapidité !","Incroyable, ça va vite !"],
  speed4:["Éclair ! Vitesse fois quatre !","Quatre fois le bonus ! Fantastique !","Quelle rapidité ! Bonus quatre !","Waouh ! Super éclair !"],
  noRotation:["Extra ! Sans aucune rotation !","Bien joué ! Bonus sans rotation !","Bravo, placement direct récompensé !"],
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
    const key=mascot.id||"pompom";
    const options=[...(CHARACTER_LINES[key]?.[kind]||[]),
      ...(SHARED_LINES[kind]||[]),
      ...(mascot.lines[kind]||[]),
      ...(EXTRA_LINES[kind]||EXTRA_LINES.clear)]
      .filter((phrase,index,array)=>array.indexOf(phrase)===index);
    // The spoken announcement must name the earned speed tier.
    const speedWords={speed2:/deux|double|turbo|fois deux/i,
      speed3:/trois|triple|fusée/i,speed4:/quatre|éclair|fois quatre/i,
      noRotation:/rotation|direct/i};
    const matching=speedWords[kind]?options.filter(p=>speedWords[kind].test(p)):options;
    const pool=matching.length?matching:options;
    if(!pool.length)return null;
    const now=this.clock();
    // Remember 48 actual previously chosen phrases, even after app restart.
    const recent=new Set(this.history.map(h=>h.key));
    let choices=pool.filter(phrase=>!recent.has(phrase));
    if(!choices.length){
      // Exhausted pool: least recently spoken option rather than same phrase again.
      let oldest=Infinity;
      for(const text of pool){
        const recentMatch=this.history.findLast?.(h=>h.key===text) ||
          [...this.history].reverse().find(h=>h.key===text);
        const at=recentMatch?.time??-1;
        oldest=Math.min(oldest,at);
      }
      choices=pool.filter(text=>{
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
