/** Original 4.0-second playful victory tune for the mirror ball.
 * Bright dance/circus feel: syncopated marimba hook, alternating brass chords,
 * bass, off-beat sparkle ticks and two funny sliding notes.
 * All music is SYNTHESIZED within the game; no new copyrighted track or WAV.
 */
export const VICTORY_SECONDS=4;
const beat=60/126;
const pitch={
 C3:130.81,G3:196,A3:220,B3:246.94,C4:261.63,D4:293.66,E4:329.63,
 F4:349.23,G4:392,A4:440,B4:493.88,C5:523.25,D5:587.33,
 E5:659.26,F5:698.46,G5:783.99,A5:880,B5:987.77,
 C6:1046.50,D6:1174.66,E6:1318.51,G6:1567.98
};
function note(track,n,at,len,volume,slide=1){
 return {track,hz:pitch[n],at:+at.toFixed(4),length:len,volume,slide};
}
export function victoryScore(){
 const score=[];
 // A cheeky, bright hook with off-beat accents and a victorious fanfare.
 const melody=["C5","E5","G5","C6","B5","G5","A5","E6",
 "D6","B5","G5","E5","G5","C6","D6","E6"];
 melody.forEach((n,i)=>score.push(note("lead",n,i*beat/2,.20,i%4===3?.078:.061)));
 // Eight playful oom-pah pulses, with alternating major-chord inversions.
 const chords=[["C4","E4","G4"],["G3","B3","D4"],["F4","A4","C5"],
 ["G3","B3","D4"],["C4","E4","G4"],["F4","A4","C5"],
 ["G3","B3","D4"],["C4","E4","G4"]];
 for(let i=0;i<8;i++){
   const at=i*beat;
   score.push(note("bass",i%4===2?"F4":i%4===1?"G3":"C3",at,.31,.069));
   // Clipped, comic brass chord stab on the syncopated "and" of the beat.
   for(const n of chords[i])score.push(note("brass",n,at+beat*.5,.20,.018));
 }
 // Ting-ta-ting above the dancing rhythm, very quiet not harsh.
 for(let i=0;i<16;i++)score.push(note("tick",i%4===3?"G6":"C6",i*beat/2,.047,.010));
 // Two springy cartoon "boings" between fanfare phrases.
 score.push(note("boing","G5",1.72,.20,.034,.57));
 score.push(note("boing","C6",3.42,.21,.036,.64));
 // Tiny tonic flourish finishes precisely before the 4s boundary.
 score.push(note("lead","C6",3.83,.15,.065));
 return score.sort((a,b)=>a.at-b.at);
}
