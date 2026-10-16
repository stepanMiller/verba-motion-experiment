import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {mkdir,writeFile} from 'node:fs/promises';
if(!process.env.GSTACK_ROOT)throw Error('Set GSTACK_ROOT to existing Playwright parent');
const {chromium}=await import(pathToFileURL(path.join(process.env.GSTACK_ROOT,'node_modules/playwright/index.mjs')).href);
const base=process.env.VERBA_DEMO_URL||'http://127.0.0.1:4173/';
const out=process.env.VERBA_QA_OUTPUT||'qa-output/arrows';await mkdir(out,{recursive:true});
const browser=await chromium.launch({executablePath:process.env.GSTACK_CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});
const results=[];
try{
for(const width of [1440,390,375])for(const reducedMotion of ['no-preference','reduce']){
 const context=await browser.newContext({viewport:{width,height:width===1440?1000:844},reducedMotion,hasTouch:width<600});const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`)});
 await page.goto(base);await page.evaluate(()=>document.fonts.ready);
 const semantic=await page.locator('.icon-arrow').evaluateAll(es=>es.map(e=>{const p=e.parentElement;return{hidden:e.getAttribute('aria-hidden'),focusable:e.getAttribute('focusable'),viewBox:e.getAttribute('viewBox'),name:p.getAttribute('aria-label')||p.textContent.trim(),svg:e.namespaceURI}}));
 if(semantic.length!==14||semantic.some(e=>e.hidden!=='true'||e.focusable!=='false'||e.viewBox!=='0 0 24 24'||!e.name||e.svg!=='http://www.w3.org/2000/svg'))throw Error('Invalid icon semantics');
 const focus=page.locator('.hero-message .line-link');await focus.focus();
 const ring=await focus.evaluate(e=>({visible:e.matches(':focus-visible'),style:getComputedStyle(e).outlineStyle,width:getComputedStyle(e).outlineWidth}));
 if(!ring.visible||ring.style==='none'||parseFloat(ring.width)<2)throw Error('Focus ring missing');
 await page.waitForTimeout(300);
 const motion=await focus.locator('svg').evaluate(e=>({transform:getComputedStyle(e).transform,duration:getComputedStyle(e).transitionDuration}));
 if(reducedMotion==='reduce'&&(motion.transform!=='none'||motion.duration!=='0s'))throw Error('Reduced motion still animates');
 if(reducedMotion==='no-preference'&&motion.transform!=='matrix(1, 0, 0, 1, 3, 0)')throw Error('Focus animation missing');
 const targets=await page.locator('.icon-arrow').evaluateAll(es=>es.map(e=>e.parentElement).filter(e=>e.getClientRects().length).map(e=>{const r=e.getBoundingClientRect();return{name:e.textContent.trim(),width:r.width,height:r.height}}));
 if(targets.some(r=>r.width<44||r.height<44))throw Error('Touch target below 44px');
 await page.screenshot({path:`${out}/hero-focus-${width}-${reducedMotion}.png`});
 await page.locator('#tab-mind').focus();await page.keyboard.press('ArrowRight');if(await page.locator('#tab-beauty').getAttribute('aria-selected')!=='true')throw Error('Tab keyboard navigation failed');
 if(errors.length)throw Error(JSON.stringify(errors));
 results.push({width,reducedMotion,icons:semantic.length,semantics:'pass',focus:ring,motion,targets,errors});await context.close();
}
await writeFile(out+'/results.json',JSON.stringify({status:'pass',browser:browser.version(),results},null,2));console.log('PASS: six viewport/motion combinations, 14 icons, names, focus, touch targets, keyboard navigation, no HTTP/runtime errors');
}finally{await browser.close()}
