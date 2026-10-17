import test from "node:test";
import assert from "node:assert/strict";
import {DISCO_FRAME_COUNT,DISCO_SPRITE_SIZE,drawDiscoFrame,
  createDiscoSpriteSheet,drawDiscoSpriteFrame} from "../src/disco-sprites.mjs";

function fakeContext() {
  const calls=[];
  const noop=()=>{};
  const ctx={
    calls,
    clearRect:noop,save:noop,restore:noop,beginPath:noop,arc:noop,clip:noop,
    fillRect:noop,closePath:noop,fill:noop,stroke:noop,
    moveTo(x,y){calls.push(["move",x,y]);},
    lineTo:noop,
    drawImage(...args){calls.push(["blit",...args]);},
    createRadialGradient(){return {addColorStop:noop};}
  };
  return ctx;
}
test("Disco renders 20 distinct yaw-only spherical views into a sprite sheet",()=>{
 const canvases=[],documentRef={createElement(name){
   assert.equal(name,"canvas");
   const ctx=fakeContext();
   const canvas={width:0,height:0,ctx,getContext(type){
     assert.equal(type,"2d");return ctx;
   }};
   canvases.push(canvas);return canvas;
 }};
 const atlas=createDiscoSpriteSheet(documentRef);
 assert.equal(atlas.frames,DISCO_FRAME_COUNT);
 assert.equal(atlas.size,DISCO_SPRITE_SIZE);
 assert.equal(atlas.sheet.width,DISCO_FRAME_COUNT*DISCO_SPRITE_SIZE);
 assert.equal(atlas.sheet.height,DISCO_SPRITE_SIZE);
 assert.equal(atlas.sheet.ctx.calls.filter(c=>c[0]==="blit").length,20);
 const positions0=[],positions1=[];
 const ctx=fakeContext();
 drawDiscoFrame(ctx,0,168);positions0.push(...ctx.calls.slice(0,8));
 ctx.calls.length=0;
 drawDiscoFrame(ctx,Math.PI/5,168);positions1.push(...ctx.calls.slice(0,8));
 assert.notDeepEqual(positions0,positions1,"yaw must change actual mirror tile projection");
});
test("Sprite animation blits only frames on a looping 2D atlas",()=>{
 const ctx=fakeContext(),atlas={size:168,frames:20,sheet:{}};
 drawDiscoSpriteFrame(ctx,atlas,22);
 const blits=ctx.calls.filter(c=>c[0]==="blit");
 assert.equal(blits.length,1);
 assert.deepEqual(blits[0].slice(2),[2*168,0,168,168,0,0,168,168]);
});
