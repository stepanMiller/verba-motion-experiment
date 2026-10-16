import path from 'node:path';import {pathToFileURL} from 'node:url';import{mkdir,writeFile}from'node:fs/promises';
if(!process.env.GSTACK_ROOT)throw Error('Set GSTACK_ROOT');const{chromium}=await import(pathToFileURL(path.join(process.env.GSTACK_ROOT,'node_modules/playwright/index.mjs')).href);
const base=process.env.VERBA_DEMO_URL||'http://127.0.0.1:4181/',out=process.env.VERBA_QA_OUTPUT||'qa-output/forest';await mkdir(out,{recursive:true});const b=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});const results=[];
try{for(const [width,motion]of [[1440,'no-preference'],[390,'no-preference'],[375,'reduce']]){
 const c=await b.newContext({viewport:{width,height:1000},reducedMotion:motion});const p=await c.newPage(),requests=[],errors=[];p.on('request',r=>requests.push(r.url()));p.on('pageerror',e=>errors.push(e.message));p.on('response',r=>{if(r.status()>=400)errors.push(r.status()+' '+r.url())});await p.goto(base);await p.bringToFront();await p.evaluate(()=>document.fonts.ready);
 const movieURLs=()=>[...new Set(requests.filter(u=>/verba-forest-.*\.mp4/.test(u)))];if(movieURLs().length)throw Error('Forest fetched before scene');await p.locator('#retreat').scrollIntoViewIfNeeded();await p.waitForTimeout(500);
 if(motion==='reduce'){if(movieURLs().length)throw Error('Reduced motion fetched film automatically');await p.screenshot({path:`${out}/poster-${width}.png`});await p.locator('#forest-toggle').click();}
 const cycles=[];for(let i=0;i<3;i++){
  if(i)await p.locator('#forest-toggle').click();await p.waitForFunction(()=>document.querySelector('#forest-video').currentTime>.2&&!document.querySelector('#forest-video').paused,{},{timeout:20000});
  await p.waitForFunction(()=>document.querySelector('#forest-video').currentTime>5.8,{},{timeout:20000});await p.screenshot({path:`${out}/turn-${width}-${i+1}.png`});
  await p.waitForFunction(()=>document.querySelector('#forest-video').ended,{},{timeout:20000});cycles.push(await p.locator('#forest-video').evaluate(v=>({time:v.currentTime,duration:v.duration,paused:v.paused,ended:v.ended,width:v.videoWidth,height:v.videoHeight,source:v.currentSrc,quality:v.getVideoPlaybackQuality().totalVideoFrames,dropped:v.getVideoPlaybackQuality().droppedVideoFrames})));
 }
 const expected=width<=600?'mobile-1080p':'desktop-1440p';if(movieURLs().length!==1||!movieURLs()[0].includes(expected))throw Error('Wrong or multiple video variants');
 const posters=[...new Set(requests.filter(u=>/verba-forest-poster.*\.webp/.test(u)))];if(posters.length!==1||posters[0].includes('-mobile')!==(width<=600))throw Error('Wrong or duplicate initial posters');
 const src=cycles[0].source;await p.setViewportSize({width:width<=600?1440:390,height:1000});await p.waitForTimeout(300);if(movieURLs().length!==1||await p.locator('#forest-video').evaluate(v=>v.currentSrc)!==src)throw Error('Resize redownloaded/reset video');
 if(errors.length)throw Error(JSON.stringify(errors));results.push({width,motion,cycles,movies:movieURLs(),initialPosters:posters,errors});await writeFile(out+'/results.json',JSON.stringify({status:'pass',results},null,2));await c.close();
}console.log('PASS: three full real-time cycles in each of three contexts; one selected movie/poster, lazy/reduced motion, stable resize');}finally{await b.close()}
