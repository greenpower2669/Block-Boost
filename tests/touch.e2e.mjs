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
  await page.addInitScript(()=>{Math.random=()=>0.13;});
  await page.goto("http://127.0.0.1:"+port+"/",{waitUntil:"networkidle"});
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
  await page.reload({waitUntil:"networkidle"});
  const restored=Number((await page.locator("#score").textContent()).replace(/\s/g,""));
  assert.equal(restored,scoreAfterExtra,"Speed and no-rotation points must persist after reload");
  const record=Number((await page.locator("#record").textContent()).replace(/\s/g,""));
  assert.equal(record,scoreAfterExtra);
  assert.deepEqual(errors,[],"Browser should not report uncaught errors");
  console.log("✅ Tactile à deux doigts, bonus visible, EXTRA absent après rotation et restauration locale : OK");
}finally{
  if(browser)await browser.close();
  await new Promise(resolve=>server.close(resolve));
}
