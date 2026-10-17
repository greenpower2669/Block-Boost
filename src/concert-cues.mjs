/**
 * Short, bright, consonant jingles: NO music beds, copyrighted melodies,
 * full-length recordings or AI audio training. Notes last 60-140ms apiece.
 */
export const CONCERT_CUES=Object.freeze({
  ready:[[784,0,.080],[988,.092,.090]],
  readyTurn:[[740,0,.078],[932,.085,.085],[1175,.175,.083]],
  pick:[[392,0,.055]],
  land:[[523,0,.064],[659,.075,.085]],
  line:[[659,0,.095],[831,.105,.093],[1047,.215,.125]],
  double:[[698,0,.085],[880,.095,.095],[1175,.200,.110],[1397,.325,.125]],
  combo:[[659,0,.075],[831,.080,.088],[988,.170,.095],[1319,.270,.130]],
  extra:[[784,0,.065],[1047,.08,.075],[1319,.17,.10]],
  speed:[[988,0,.06],[1175,.072,.080],[1568,.162,.092]],
  disco:[[784,0,.085],[988,.09,.088],[1175,.19,.09],[1568,.30,.14]]
});
/** Music is emitted only on real bonus/FX events, never per pixel. */
export function chooseJingle(event,lines=0,combo=0){
 if(event==="valid")return "ready";
 if(event==="validRotate")return "readyTurn";
 if(event==="grab")return "pick";
 if(event==="drop")return "land";
 if(event==="extra")return "extra";
 if(event==="speed")return "speed";
 if(event==="festival-disco")return "disco";
 if(event==="combo")return combo>=3?"combo":"double";
 if(event==="clear")return lines>=2?"double":"line";
 return null;
}
/** Plan the visible score independently of the disco's background layer. */
export function jackpotBanner(event,bonus={}){
 const gained=Math.max(0,Math.floor(Number(event?.gained)||0));
 const lines=Math.max(0,Number(event?.lines)||0);
 const combo=Math.max(0,Number(event?.combo)||0);
 const speed=Math.max(0,Number(bonus.speedMultiplier)||0);
 const extra=Math.max(0,Number(event?.noRotationBonus)||0);
 const headline=lines>=3?"MEGA JACKPOT !":combo>=2?"COMBO JACKPOT !":"BONUS DISCO !";
 const details=[
   lines>=1?lines+" "+(lines===1?"LIGNE":"LIGNES"):"",
   combo>=2?"COMBO ×"+combo:"",
   speed>1?"VITESSE ×"+speed:"",
   extra?"EXTRA SANS ROTATION":""
 ].filter(Boolean);
 return {headline,points:"+"+gained.toLocaleString("fr-FR")+" POINTS",
    details:details.join("  ✦  "),interjection:combo>=3?"WHAA !":"WAOUH !"};
}
