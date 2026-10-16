import {pathToFileURL} from 'node:url';
import path from 'node:path';
if(!process.env.GSTACK_ROOT)throw Error('Set GSTACK_ROOT to the parent of existing node_modules/playwright');
const {chromium}=await import(pathToFileURL(path.join(process.env.GSTACK_ROOT,'node_modules/playwright/index.mjs')).href);
import {writeFile,mkdir} from 'node:fs/promises';
const browser=await chromium.launch({headless:true,executablePath:process.env.GSTACK_CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});
const base=process.env.VERBA_DEMO_URL||'http://127.0.0.1:4173/';
const out=process.env.VERBA_QA_OUTPUT||'qa-output/media-quality';await mkdir(out,{recursive:true});let results=[];
for(const [width,height,dpr] of [[1440,1000,1],[390,844,1],[390,844,3],[375,812,2]]){
 const context=await browser.newContext({viewport:{width,height},deviceScaleFactor:dpr});const page=await context.newPage();let errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)errors.push(r.url()+': '+r.status())});
 await page.goto(base);await page.waitForFunction(()=>document.querySelector('#hero-video').currentTime>0);await page.screenshot({path:`${out}/hero-${width}-${dpr}.png`});
 for(const name of ['mayr','mind','beauty','spa']){await page.locator('#tab-'+name).click();await page.locator('.path-visual').scrollIntoViewIfNeeded();await page.waitForTimeout(1200);await page.screenshot({path:`${out}/${name}-${width}-${dpr}.png`});}
 const imgs=await page.locator('[data-image]').evaluateAll(es=>es.map(e=>({name:e.dataset.image,src:e.currentSrc,complete:e.complete,width:e.naturalWidth,sizes:e.sizes})));
 if(errors.length||imgs.some(i=>!i.complete||!i.width))throw Error(JSON.stringify({errors,imgs}));
 if(dpr>1&&imgs.some(i=>i.src.includes('-640.')))throw Error('High-DPR image received undersized variant');
 results.push({width,height,dpr,errors,images:imgs});await context.close();
}
const context=await browser.newContext({reducedMotion:'reduce',viewport:{width:390,height:844}});const page=await context.newPage();let movies=[];page.on('request',r=>{if(r.url().includes('.mp4'))movies.push(r.url())});await page.goto(base);await page.waitForTimeout(700);await page.locator('#retreat').scrollIntoViewIfNeeded();await page.waitForTimeout(700);results.push({reducedMotion:true,automaticMovieRequests:[...movies]});if(movies.length)throw Error('Reduced motion fetched video');await page.locator('#home').scrollIntoViewIfNeeded();await page.locator('#video-toggle').click();await page.waitForFunction(()=>document.querySelector('#hero-video').currentTime>0);results.push({manualHero:true});await page.locator('#retreat').scrollIntoViewIfNeeded();await page.locator('#forest-toggle').click();await page.waitForFunction(()=>document.querySelector('#forest-video').currentTime>0);results.push({manualForest:true});await browser.close();await writeFile(out+'/results.json',JSON.stringify(results,null,2));console.log(JSON.stringify(results));
