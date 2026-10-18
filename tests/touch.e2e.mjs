import assert from "node:assert/strict";
import http from "node:http";
import fs from "node:fs/promises";
import path from "node:path";
import {fileURLToPath} from "node:url";
import {chromium} from "playwright-core";
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const typeFor=name=>name.endsWith(".mjs")?"text/javascript":name.endsWith(".js")?"text/javascript":
  name.endsWith(".css")?"text/css":name.endsWith(".svg")?"image/svg+xml":
  name.endsWith(".webmanifest")?"application/manifest+json":"text/html";
const server=http.createServer(async (req,res)=>{
  const pathname=decodeURIComponent(new URL(req.url,"http://127.0.0.1").pathname);
  const filename=path.resolve(root,"."+pathname,(pathname.endsWith("/")?"index.html":""));
  if(!(filename===root||filename.startsWith(root+path.sep))){res.writeHead(403);res.end();return;}
  try{const data=await fs.readFile(filename);res.writeHead(200,{"Content-Type":typeFor(filename),"Cache-Control":"no-store"});res.end(data);}
  catch{res.writeHead(404);res.end("Not found");}
});
let browser;
try{
  await new Promise(resolve=>server.listen(0,"127.0.0.1",resolve));
  const port=server.address().port;
  browser=await chromium.launch({channel:"chrome",headless:true,args:["--no-sandbox"]});
  const context=await browser.newContext({viewport:{width:393,height:851},isMobile:true,hasTouch:true,
    deviceScaleFactor:1});
  const page=await context.newPage(),errors=[];
  page.on("pageerror",err=>errors.push(err.message));
  await page.addInitScript(()=>{
    Math.random=()=>0.13;
    window.__hapticCalls=[];
    window.__voiceCalls=[];
    window.__voiceStops=0;
    window.AndroidBridge={
      speak(...args){window.__voiceCalls.push(args);},stop(){window.__voiceStops++;},haptic(kind){window.__hapticCalls.push(["tap",kind]);},
      reward(kind){window.__hapticCalls.push(["reward",kind]);},
      guidance(level){window.__hapticCalls.push(["guide",level]);},
      stopHaptics(){window.__hapticCalls.push(["stop"]); }
    };
  });
  await page.goto("http://127.0.0.1:"+port+"/",{waitUntil:"networkidle"});
  await page.locator("#settings-button").click();
  assert.equal(await page.locator("#voice-setting").isDisabled(),false);
  assert.equal(await page.locator("#voice-setting").isChecked(),false);
  await page.locator("#voice-setting").check();
  await page.locator("#mascot-choice").selectOption("plume");
  const said=await page.evaluate(()=>window.__voiceCalls.length);
  assert.ok(said>0,"Activating voices must speak");
  await page.locator("#voice-setting").uncheck();
  assert.ok(await page.evaluate(()=>window.__voiceStops)>0,"Disabling voices must stop speech");
  await page.locator("#mascot-choice").selectOption("nox");
  assert.equal(await page.evaluate(()=>window.__voiceCalls.length),said);
  assert.equal(await page.locator("#haptics-setting").isChecked(),true);
  await page.locator("#settings-dialog button[value='close']").click();
  const safeArea=await page.evaluate(()=>{
    const shell=document.querySelector(".app-shell");
    return {android:document.body.classList.contains("android-host"),
      bottom:parseFloat(getComputedStyle(shell).paddingBottom),
      scrollable:document.documentElement.scrollHeight>=innerHeight};
  });
  assert.equal(safeArea.android,true,"AndroidBridge should enable native-safe spacing");
  assert.ok(safeArea.bottom>=78,"The footer must reserve Samsung nav bar space");
  assert.equal(safeArea.scrollable,true);
  const board=await page.locator("#board").boundingBox();
  const slot=await page.locator(".piece-slot").first().boundingBox();
  const getColumns=()=>page.locator(".piece-slot").first().locator(".piece")
    .evaluate(el=>el.style.gridTemplateColumns);
  assert.match(await getColumns(),/repeat\(3/);
  const t1={x:slot.x+slot.width/2,y:slot.y+slot.height/2,id:1};
  const tMove={x:board.x+board.width*.50,y:board.y+board.height*.55,id:1};
  const t2={x:board.x+board.width*.25,y:board.y+board.height*.75,id:2};
  const cdp=await context.newCDPSession(page);
  await cdp.send("Input.dispatchTouchEvent",{type:"touchStart",touchPoints:[t1]});
  await cdp.send("Input.dispatchTouchEvent",{type:"touchMove",touchPoints:[tMove]});
  await cdp.send("Input.dispatchTouchEvent",{type:"touchStart",touchPoints:[tMove,t2]});
  assert.match(await getColumns(),/repeat\(1/, "Second touch must rotate the 3-block line");
  await cdp.send("Input.dispatchTouchEvent",{type:"touchEnd",touchPoints:[tMove]});
  await cdp.send("Input.dispatchTouchEvent",{type:"touchEnd",touchPoints:[]});
  await page.waitForTimeout(150);
  const score=Number((await page.locator("#score").textContent()).replace(/\s/g,""));
  assert.ok(score>15,"A quick rotated piece must score its ordinary points plus the visible speed bonus");
  assert.match(await page.locator("#bonus-earned").textContent(),/VITESSE ×[0-4]/);
  assert.ok((await page.locator("#bonus-live").textContent()).includes("EXTRA"));
  assert.ok(!(await page.locator("#bonus-earned").textContent()).includes("EXTRA SANS ROTATION"),
    "A rotated piece must not receive the no-rotation EXTRA");
  // A second piece is placed WITHOUT rotation, through the accessible tap flow.
  await page.locator(".piece-slot").nth(1).click();
  await page.locator(".cell").first().click();
  const extraText=await page.locator("#bonus-earned").textContent();
  assert.match(extraText,/EXTRA SANS ROTATION/, "Unrotated placement must display EXTRA");
  assert.match(extraText,/VITESSE ×[0-4]/);
  const scoreAfterExtra=Number((await page.locator("#score").textContent()).replace(/\s/g,""));
  assert.ok(scoreAfterExtra>score,"EXTRA and normal points must increase score");
  const hapticCalls=await page.evaluate(()=>window.__hapticCalls);
  assert.ok(hapticCalls.filter(c=>c[0]==="reward").length>=2,
    "Each valid placement, including EXTRA, must emit a distinct haptic reward");
  assert.ok(hapticCalls.some(c=>["extra","speedExtra","lineBonus","comboBonus"].includes(c[1])),
    "A no-rotation bonus must trigger a tactile celebration");
  await page.reload({waitUntil:"networkidle"});
  const restored=Number((await page.locator("#score").textContent()).replace(/\s/g,""));
  assert.equal(restored,scoreAfterExtra,"Speed and no-rotation points must persist after reload");
  const record=Number((await page.locator("#record").textContent()).replace(/\s/g,""));
  assert.equal(record,scoreAfterExtra);
  // Synthetic almost-complete line: the renderer must highlight exactly the
  // eight blocks that a real legal move will clear, never an imaginary line.
  // Seed on next navigation AFTER pagehide auto-save has run.
  await page.addInitScript(()=>{
    const key="block-boost.local.v1",saved=JSON.parse(localStorage.getItem(key));
    const board=Array.from({length:8},()=>Array(8).fill(null));
    for(let x=0;x<7;x++)board[0][x]="mint";
    saved.progress={runStartBest:0,game:{
      board,version:1,score:0,combo:1,bestCombo:1,moves:5,gameOver:false,
      pieces:[
        {id:0,coords:[[0,0]],color:"rose",used:false},
        {id:1,coords:[[0,0]],color:"sky",used:false},
        {id:2,coords:[[0,0]],color:"rose",used:false}
      ]
    }};
    localStorage.setItem(key,JSON.stringify(saved));
  });
  await page.reload({waitUntil:"networkidle"});
  assert.equal(await page.locator(".cell.will-solve").count(),0);
  const b2=await page.locator("#board").boundingBox();
  const s2=await page.locator(".piece-slot").first().boundingBox();
  const cellSize=(b2.width-14-7*3)/8;
  const origin={id:3,x:s2.x+s2.width/2,y:s2.y+s2.height/2};
  const target={id:3,x:b2.x+7+7*(cellSize+3)+cellSize*.5,
    y:b2.y+7+1.65*cellSize};
  const dragCDP=await context.newCDPSession(page);
  await dragCDP.send("Input.dispatchTouchEvent",{type:"touchStart",touchPoints:[origin]});
  await dragCDP.send("Input.dispatchTouchEvent",{type:"touchMove",touchPoints:[target]});
  const inspection=await page.evaluate(()=>({
    selected:document.querySelector(".piece-slot.selected")?.dataset.piece,
    previewGood:document.querySelectorAll(".preview-good").length,
    previewBad:document.querySelectorAll(".preview-bad").length,
    status:document.querySelector("#solve-signal")?.textContent,
    filled:document.querySelectorAll(".cell.filled").length,
    bonus:document.querySelector("#bonus-live")?.textContent
  }));
  console.log("Rainbow touch inspection",JSON.stringify({inspection,b2,s2,target,origin}));
  assert.equal(await page.locator(".cell.will-solve").count(),8,
    "All eight truly completed cells should glow in rainbow before placement");
  assert.match(await page.locator("#solve-signal").textContent(),/1 LIGNE.*8 BLOCS/);
  await dragCDP.send("Input.dispatchTouchEvent",{type:"touchEnd",touchPoints:[]});
  assert.equal(await page.locator(".cell.will-solve").count(),0,
    "Anticipation is cleared immediately on release");
  assert.equal(await page.locator(".cell.just-solved").count(),8,
    "Actual cleared cells are highlighted after the successful move");
  // BIG DOUBLE-LINE COMBO now awards the BUBBLE concert (not old disco).
  await page.addInitScript(()=>{
    const key="block-boost.local.v1", saved=JSON.parse(localStorage.getItem(key));
    const board=Array.from({length:8},()=>Array(8).fill(null));
    for(let y=0;y<2;y++)for(let x=0;x<7;x++)board[y][x]="sun";
    saved.progress={runStartBest:0,game:{
      board,version:1,score:0,combo:2,bestCombo:2,moves:6,gameOver:false,
      pieces:[
        {id:0,coords:[[0,0],[0,1]],color:"rose",used:false},
        {id:1,coords:[[0,0]],color:"sky",used:false},
        {id:2,coords:[[0,0]],color:"mint",used:false}
      ]
    }};
    localStorage.setItem(key,JSON.stringify(saved));
  });
  await page.reload({waitUntil:"networkidle"});
  const b3=await page.locator("#board").boundingBox();
  const slot3=await page.locator(".piece-slot").first().boundingBox();
  const step=(b3.width-14-7*3)/8;
  const from={id:5,x:slot3.x+slot3.width/2,y:slot3.y+slot3.height/2};
  const to={id:5,x:b3.x+7+7*(step+3)+step*.5,y:b3.y+7+2.65*step};
  const discoCDP=await context.newCDPSession(page);
  await discoCDP.send("Input.dispatchTouchEvent",{type:"touchStart",touchPoints:[from]});
  await discoCDP.send("Input.dispatchTouchEvent",{type:"touchMove",touchPoints:[to]});
  assert.equal(await page.locator(".cell.will-solve").count(),16);
  await discoCDP.send("Input.dispatchTouchEvent",{type:"touchEnd",touchPoints:[]});
  // A real 2-line COMBO 3 is a BIG jackpot again: the disco must be visible.
  assert.equal(await page.locator("#festival-stage").getAttribute("data-theme"),"disco");
  assert.equal(await page.locator("#festival-stage .festival-disco-ball").count(),1);
  assert.equal(await page.locator("#festival-stage .bubble-floor-spot").count(),0);
  assert.equal(await page.locator("#festival-stage .festival-bubble").count(),0);
  assert.equal(await page.locator("#festival-stage .concert-spot").count(),6);
  const front=page.locator("#festival-stage .festival-bonus-front");
  assert.equal(await front.count(),1);
  assert.match(await front.textContent(),/POINTS/);
  const fullscreen=await page.locator("#festival-stage").evaluate(el=>({
    parent:el.parentElement.tagName,
    position:getComputedStyle(el).position,
    overflow:getComputedStyle(el).overflow,
    radius:getComputedStyle(el).borderRadius
  }));
  assert.equal(fullscreen.parent,"BODY");
  assert.equal(fullscreen.position,"fixed");
  assert.equal(fullscreen.overflow,"visible");
  assert.equal(fullscreen.radius,"0px");
  const voices=await page.evaluate(()=>window.__voiceCalls||[]);
  assert.equal(voices.length,0,"Voices remain off by default");
  assert.ok((await page.locator("#score").textContent()).trim()!=="150");
  // A legal simultaneous ROW + COLUMN awards x10 and renders BOTH effects.
  // The real game engine (not a mocked festival call) produces this scene.
  await page.addInitScript(()=>{
    const key="block-boost.local.v1",saved=JSON.parse(localStorage.getItem(key));
    const board=Array.from({length:8},()=>Array(8).fill(null));
    for(let k=0;k<8;k++)if(k!==3){board[3][k]="sun";board[k][3]="mint";}
    saved.progress={runStartBest:0,game:{
      board,version:1,score:150,combo:0,bestCombo:0,moves:4,gameOver:false,
      pieces:[
        {id:0,coords:[[0,0]],color:"rose",used:false},
        {id:1,coords:[[0,0]],color:"sky",used:false},
        {id:2,coords:[[0,0]],color:"mint",used:false}
      ]
    }};
    localStorage.setItem(key,JSON.stringify(saved));
  });
  await page.reload({waitUntil:"networkidle"});
  await page.locator(".piece-slot").first().click();
  await page.locator(".cell").nth(3*8+3).click();
  // Cross ×10 passes the 1000/2000/3000 score thresholds. The NEW
  // priority is the six-second firework concert; x10 scoring stays intact.
  assert.equal(await page.locator("#festival-stage").getAttribute("data-theme"),null);
  assert.equal(await page.locator("#game-fireworks").isVisible(),true);
  assert.equal(await page.locator("#game-fireworks .firework-burst").count(),9);
  assert.match(await page.locator("#game-fireworks .fireworks-headline").textContent(),/1\\s*000 à 3\\s*000 POINTS/);
  assert.match(await page.locator("#festival-stage .festival-bonus-front").textContent(),/CROISEMENT ×10/);
  assert.match(await page.locator("#bonus-earned").textContent(),/CROISEMENT LIGNE \+ COLONNE ×10/);
  const crossScore=Number((await page.locator("#score").textContent()).replace(/\s/g,""));
  assert.ok(crossScore>=3355,"The actual cross must score at least 3205 + prior 150");
  // NEW RECORD result: real game-over through a legal final move, no manual
  // festival invocation. Three scenes MUST run sequentially, with replay live.
  await page.addInitScript(()=>{
    const key="block-boost.local.v1",saved=JSON.parse(localStorage.getItem(key));
    const board=Array.from({length:8},()=>Array(8).fill("rose"));
    for(let i=0;i<8;i++)board[i][i]=null;
    board[7][0]=null;board[0][7]=null;
    saved.bestScore=500;
    saved.progress={runStartBest:500,game:{
      board,version:1,score:850,combo:0,bestCombo:0,moves:5,gameOver:false,
      pieces:[
        {id:0,coords:[[0,0]],color:"rose",used:false},
        {id:1,coords:[[0,0],[1,0]],color:"sky",used:false},
        {id:2,coords:[[0,0],[0,1]],color:"mint",used:false}
      ]
    }};
    localStorage.setItem(key,JSON.stringify(saved));
  });
  await page.reload({waitUntil:"networkidle"});
  await page.locator(".piece-slot").first().click();
  await page.locator(".cell").last().click();
  await page.locator("#end-dialog").waitFor({state:"visible",timeout:5000});
  assert.match(await page.locator("#result-title").textContent(),/Nouveau record/);
  assert.equal(await page.locator("#result-effects").getAttribute("data-scene"),"disco");
  await page.waitForTimeout(3450);
  assert.equal(await page.locator("#result-effects").getAttribute("data-scene"),"bubbles");
  await page.waitForTimeout(2850);
  assert.equal(await page.locator("#result-effects").getAttribute("data-scene"),"fireworks");
  assert.ok(await page.locator("#result-effects .firework-burst").count()>0);
  await page.locator("#retry-button").click();
  assert.equal(await page.locator("#end-dialog").isVisible(),false);
  assert.equal(await page.locator("#result-effects").getAttribute("data-scene"),"");
  assert.equal(await page.locator("#game-fireworks").isVisible(),false);
  assert.deepEqual(errors,[],"Browser should not report uncaught errors");
  console.log("✅ Tactile à deux doigts, bonus visible, EXTRA absent après rotation et restauration locale : OK");
}finally{
  if(browser)await browser.close();
  await new Promise(resolve=>server.close(resolve));
}
