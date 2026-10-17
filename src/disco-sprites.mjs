/**
 * Compact single-axis disco ball sprite renderer.
 *
 * A set of 20 spherical yaw frames is pre-rendered onto a 2D canvas atlas
 * once per session. Each tile is projected onto a sphere with orthographic
 * x/y and front-facing z; the visible ball has ONE rotational axis (vertical).
 * No rotateY/rotateZ CSS trick, no 3D framework, and no media download.
 */
export const DISCO_FRAME_COUNT=20;
export const DISCO_SPRITE_SIZE=168;
const TAU=Math.PI*2;
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));

function corner(latitude,longitude,phase,center,radius) {
  const yaw=longitude+phase;
  const c=Math.cos(latitude);
  return {
    x:center+radius*c*Math.sin(yaw),
    y:center-radius*Math.sin(latitude),
    z:c*Math.cos(yaw)
  };
}

/** Paint a complete 2D view of a rotating mirrored sphere at phase radians. */
export function drawDiscoFrame(ctx,phase,size=DISCO_SPRITE_SIZE){
  if(!ctx||!Number.isFinite(phase)||size<32)throw Error("Disco frame needs canvas, phase and size");
  const mid=size*.5,radius=size*.462;
  ctx.clearRect(0,0,size,size);
  ctx.save();
  ctx.beginPath();ctx.arc(mid,mid,radius,0,TAU);ctx.clip();
  const shade=ctx.createRadialGradient(mid-radius*.31,mid-radius*.38,radius*.06,
    mid+radius*.05,mid+radius*.02,radius*1.17);
  shade.addColorStop(0,"#f7fdff");
  shade.addColorStop(.32,"#c2dbf6");
  shade.addColorStop(.7,"#657ca6");
  shade.addColorStop(1,"#1b254f");
  ctx.fillStyle=shade;ctx.fillRect(0,0,size,size);

  // Tile boundaries are fixed on a rotating sphere. Only the front half is drawn.
  const latSteps=13,lonSteps=28,halfStep=Math.PI/latSteps;
  for(let lat=0;lat<latSteps;lat++){
    const a=-Math.PI/2+(lat+.05)*Math.PI/latSteps;
    const b=-Math.PI/2+(lat+.95)*Math.PI/latSteps;
    for(let lon=0;lon<lonSteps;lon++){
      const angle=(lon+.5)*TAU/lonSteps;
      const middle=corner((a+b)/2,angle,phase,mid,radius);
      if(middle.z<=.015)continue;
      const left=(lon+.065)*TAU/lonSteps,right=(lon+.935)*TAU/lonSteps;
      const p=[corner(a,left,phase,mid,radius),corner(a,right,phase,mid,radius),
        corner(b,right,phase,mid,radius),corner(b,left,phase,mid,radius)];
      const sparkle=(lat*29+lon*53)%13;
      const facing=clamp(middle.z,0,1);
      const gleam=Math.pow(clamp(.47*middle.x/size+.48*facing,0,1),3)*.55;
      const brightness=Math.round(35+facing*31+gleam*46+(sparkle%5)*2);
      const hue=190+((lat*11+lon*7)%10)*7;
      ctx.fillStyle="hsl("+hue+", "+(18+(sparkle%4)*8)+"%, "+
        clamp(brightness,29,90)+"%)";
      ctx.beginPath();ctx.moveTo(p[0].x,p[0].y);
      for(let n=1;n<4;n++)ctx.lineTo(p[n].x,p[n].y);
      ctx.closePath();ctx.fill();
      ctx.lineWidth=Math.max(.6,size/200);
      ctx.strokeStyle="rgba(17,36,75,.58)";ctx.stroke();
      // Narrow white reflection strips follow the tile/sphere yaw, not CSS rotation.
      if(sparkle===1&&facing>.55){
        ctx.strokeStyle="rgba(255,255,255,.58)";
        ctx.lineWidth=Math.max(.4,size/340);
        ctx.beginPath();ctx.moveTo(p[0].x+1,p[0].y+1);
        ctx.lineTo(p[1].x-1,p[1].y+1);ctx.stroke();
      }
    }
  }
  const glass=ctx.createRadialGradient(mid-radius*.4,mid-radius*.52,0,
    mid-radius*.18,mid-radius*.26,radius*1.1);
  glass.addColorStop(0,"rgba(255,255,255,.44)");
  glass.addColorStop(.37,"rgba(243,252,255,.10)");
  glass.addColorStop(1,"rgba(8,12,49,.42)");
  ctx.fillStyle=glass;ctx.fillRect(0,0,size,size);
  ctx.restore();

  ctx.save();
  ctx.strokeStyle="rgba(245,250,255,.84)";
  ctx.lineWidth=Math.max(1,size/120);
  ctx.beginPath();ctx.arc(mid,mid,radius,0,TAU);ctx.stroke();
  ctx.restore();
}

/** Pre-generate a real frame-strip atlas, 20 × 168 pixels (no external image). */
export function createDiscoSpriteSheet(documentRef=globalThis.document,
    size=DISCO_SPRITE_SIZE,frames=DISCO_FRAME_COUNT){
  if(!documentRef?.createElement)throw Error("Document canvas unavailable");
  const sheet=documentRef.createElement("canvas");
  sheet.width=size*frames;sheet.height=size;
  const context=sheet.getContext("2d");
  if(!context)throw Error("Canvas 2D unavailable");
  const temp=documentRef.createElement("canvas");
  temp.width=size;temp.height=size;
  const frameCtx=temp.getContext("2d");
  if(!frameCtx)throw Error("Sprite renderer unavailable");
  for(let n=0;n<frames;n++){
    drawDiscoFrame(frameCtx,n*TAU/frames,size);
    context.drawImage(temp,n*size,0);
  }
  return {sheet,size,frames};
}

/** Lightweight atlas blit: image changes, the ball itself never rotates in CSS. */
export function drawDiscoSpriteFrame(ctx,atlas,index) {
  if(!ctx||!atlas||!Number.isFinite(index))return;
  const i=((Math.floor(index)%atlas.frames)+atlas.frames)%atlas.frames;
  ctx.clearRect(0,0,atlas.size,atlas.size);
  ctx.drawImage(atlas.sheet,i*atlas.size,0,atlas.size,0,0,atlas.size,atlas.size);
}
