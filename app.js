import {prepare,layout,setLocale} from './assets/motion/pretext.js';
const $=s=>document.querySelector(s),all=s=>[...document.querySelectorAll(s)];
const reduced=matchMedia('(prefers-reduced-motion: reduce)'),mobile=matchMedia('(max-width:600px)');
const directions={mayr:{name:'MAYR',title:'Лёгкость начинается изнутри.',description:'Питание и привычки по методу Майера. Внимательный медицинский подход к пищеварению и вашему самочувствию.',index:'01'},mind:{name:'MIND',title:'Тише вокруг. Спокойнее внутри.',description:'Время уделить внимание сну, эмоциональному состоянию и восстановлению внутреннего ресурса. Персональный подход к вашему запросу.',index:'02'},beauty:{name:'BEAUTY',title:'Забота, которую вы чувствуете.',description:'Внимание к коже и индивидуальному уходу. Эстетическое направление как часть заботы о себе, с выбором процедур вместе со специалистом.',index:'03'},spa:{name:'SPA',title:'Снять напряжение. Почувствовать тело.',description:'Бассейн, отдых и восстановление в окружении природы. Пространство, в котором можно переключиться на собственное самочувствие.',index:'04'}};
let active='mayr',panelAnimation;
const textHandles=new Map();let textReady=false;
function relayoutText(){if(!textReady)return;for(const el of all('[data-pretext]')){const s=getComputedStyle(el),key=el.textContent.trim()+'|'+s.font;let item=textHandles.get(el);if(!item||item.key!==key){item={key,handle:prepare(el.textContent.trim(),s.font)};textHandles.set(el,item);}if(el.clientWidth){const result=layout(item.handle,el.clientWidth,parseFloat(s.lineHeight));el.style.minHeight=result.height+'px';el.dataset.pretextLines=String(result.lineCount);}}}
const tabs=all('[data-direction]');
function selectDirection(key,{focus=false,url=true}={}){if(!directions[key])return;active=key;const d=directions[key];tabs.forEach(t=>{const yes=t.dataset.direction===key;t.classList.toggle('is-active',yes);t.setAttribute('aria-selected',String(yes));t.tabIndex=yes?0:-1;if(yes&&focus)t.focus({preventScroll:true});});all('[data-image]').forEach(i=>i.classList.toggle('is-active',i.dataset.image===key));$('#directions').dataset.active=key;$('#path-panel').setAttribute('aria-labelledby','tab-'+key);$('#visual-direction').textContent=d.name;$('#visual-index').textContent=d.index+' / 04';$('#path-title').textContent=d.title;$('#path-description').textContent=d.description;$('#direction-status').textContent='Выбрано направление '+d.name;panelAnimation?.cancel();if(!reduced.matches)panelAnimation=$('#path-panel').animate([{opacity:.35,transform:'translateY(12px)'},{opacity:1,transform:'translateY(0)'}],{duration:480,easing:'cubic-bezier(.22,.68,.2,1)'});if(url){const u=new URL(location.href);u.searchParams.set('direction',key);history.replaceState(null,'',u.pathname+u.search+u.hash);}relayoutText();}
tabs.forEach((tab,i)=>{tab.addEventListener('click',()=>selectDirection(tab.dataset.direction));tab.addEventListener('keydown',e=>{let n=null;if(['ArrowRight','ArrowDown'].includes(e.key))n=(i+1)%4;if(['ArrowLeft','ArrowUp'].includes(e.key))n=(i+3)%4;if(e.key==='Home')n=0;if(e.key==='End')n=3;if(n!==null){e.preventDefault();selectDirection(tabs[n].dataset.direction,{focus:true});}});});
function restoreDirection(){const key=new URLSearchParams(location.search).get('direction');selectDirection(directions[key]?key:'mayr',{url:false});}addEventListener('popstate',restoreDirection);

// One native-scroll timeline. No wheel handler and no scrolling library.
const hero=$('.hero-story'),frame=$('.hero-frame'),header=$('.site-header'),video=$('#hero-video');
let geometry={},progress=0,target=0,ticking=false,userPaused=false,manualVideo=false,heroInView=true;
const clamp=(n,a=0,b=1)=>Math.max(a,Math.min(b,n));
function measureMotion(){$('.path-tabs').setAttribute('aria-orientation',mobile.matches?'horizontal':'vertical');geometry={top:hero.getBoundingClientRect().top+scrollY,range:Math.max(1,hero.offsetHeight-frame.offsetHeight),pathTop:$('#directions').getBoundingClientRect().top+scrollY,pathHeight:$('#directions').offsetHeight,retreatTop:$('#retreat').getBoundingClientRect().top+scrollY,retreatHeight:$('#retreat').offsetHeight};updateScroll();}
function updateScroll(){target=reduced.matches?0:clamp((scrollY-geometry.top)/geometry.range);if(!ticking){ticking=true;requestAnimationFrame(renderMotion);}}
function renderMotion(){progress=reduced.matches?0:progress+(target-progress)*.18;if(Math.abs(target-progress)<.001)progress=target;const p=progress*progress*(3-2*progress),aperture=clamp((p-.18)/.66),opacity=1-clamp(p/.2),show=clamp((p-.70)/.22);frame.style.setProperty('--hero-clip',mobile.matches?`inset(${aperture*52}% ${aperture*5}% ${aperture*4}% ${aperture*5}%)`:`inset(${aperture*12}% ${aperture*5}% ${aperture*12}% ${aperture*55}%)`);frame.style.setProperty('--camera-scale',1+p*.09);frame.style.setProperty('--camera-y',(-p*innerHeight*.045)+'px');frame.style.setProperty('--title-y',(-p*innerHeight*.22)+'px');frame.style.setProperty('--title-opacity',opacity);frame.style.setProperty('--copy-opacity',show);frame.style.setProperty('--copy-y',((1-show)*38)+'px');$('.hero-title-group').inert=opacity<.04;$('.hero-bottom').inert=opacity<.04;const path=clamp((scrollY+innerHeight-geometry.pathTop)/(geometry.pathHeight+innerHeight)),retreat=clamp((scrollY+innerHeight-geometry.retreatTop)/(geometry.retreatHeight+innerHeight));$('#directions').style.setProperty('--path-pan',reduced.matches?'0px':((path-.5)*48)+'px');$('#retreat').style.setProperty('--retreat-pan',reduced.matches?'0px':((retreat-.5)*56)+'px');const inRetreat=scrollY>geometry.retreatTop-70&&scrollY<geometry.retreatTop+geometry.retreatHeight-100;header.dataset.tone=progress<.18||inRetreat?'light':'dark';window.VERBA_MOTION={progress,target,reduced:reduced.matches,activeDirection:active,videoPlaying:!video.paused};if(Math.abs(target-progress)>.001)requestAnimationFrame(renderMotion);else ticking=false;}
addEventListener('scroll',updateScroll,{passive:true});addEventListener('resize',()=>{relayoutText();measureMotion();},{passive:true});
document.fonts.ready.then(()=>{setLocale('ru');textReady=true;relayoutText();const ro=new ResizeObserver(()=>{relayoutText();measureMotion();});all('[data-pretext]').forEach(e=>ro.observe(e));const mo=new MutationObserver(relayoutText);all('[data-pretext]').forEach(e=>mo.observe(e,{childList:true,characterData:true,subtree:true}));measureMotion();});
const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-revealed');io.unobserve(e.target);}}),{threshold:.2});all('.reveal').forEach(e=>io.observe(e));document.body.classList.add('motion-ready');
function videoUI(){const paused=video.paused;$('#video-toggle').setAttribute('aria-pressed',String(paused));$('#video-toggle').setAttribute('aria-label',paused?'Воспроизвести видео':'Остановить видео');$('#video-toggle span').textContent=paused?'Воспроизвести':'Пауза видео';$('#video-toggle svg').innerHTML=paused?'<path d="m6 4 10 6-10 6z"/>':'<path d="M6 4v12M14 4v12"/>';}
function syncVideo(){if(document.hidden||!heroInView||userPaused||(reduced.matches&&!manualVideo))video.pause();else {if(!video.getAttribute('src')){video.src=video.dataset.src;video.load();}video.play().catch(videoUI);}videoUI();}
video.addEventListener('canplay',syncVideo);video.addEventListener('play',videoUI);video.addEventListener('pause',videoUI);document.addEventListener('visibilitychange',syncVideo);$('#video-toggle').addEventListener('click',()=>{userPaused=!video.paused;manualVideo=!userPaused;syncVideo();});reduced.addEventListener('change',()=>{manualVideo=false;progress=0;syncVideo();measureMotion();});new IntersectionObserver(entries=>{heroInView=entries[0].isIntersecting;syncVideo();},{threshold:.02}).observe(hero);

// Approved upscaled forest B: responsive, lazy, one-shot, held final frame.
// Replays require an explicit click; returning to the section never resets time.
const forest=$('#forest-video'),retreat=$('#retreat'),forestToggle=$('#forest-toggle');
const forestState={visible:false,loaded:false,finished:false,userPaused:false,manual:false,blocked:false,pending:false,started:false};
function forestUI(){
 const playing=!forest.paused&&!forest.ended;
 const label=playing?'Остановить лесную сцену':forestState.finished?'Повторить лесную сцену':forestState.started?'Продолжить лесную сцену':'Воспроизвести лесную сцену';
 forestToggle.setAttribute('aria-label',label);
 forestToggle.querySelector('span').textContent=playing?'Пауза сцены':forestState.finished?'Повторить сцену':forestState.started?'Продолжить сцену':'Воспроизвести сцену';
 forestToggle.querySelector('svg').innerHTML=playing?'<path d="M6 4v12M14 4v12"/>':'<path d="m6 4 10 6-10 6z"/>';
 retreat.dataset.videoState=forestState.finished?'ended':forestState.started?(playing?'playing':'paused'):'poster';
 $('#forest-status').textContent=forestState.finished?'Сцена завершена. Последний кадр сохранён.':forestState.blocked?'Нажмите «Воспроизвести сцену», чтобы запустить видео.':playing?'Лесная сцена воспроизводится.':'Статичный кадр леса.';
}
function loadForest(){if(forestState.loaded)return;forest.src=mobile.matches?forest.dataset.srcMobile:forest.dataset.src;forest.load();forestState.loaded=true;}
function syncForest(){
 if(document.hidden||!forestState.visible||forestState.userPaused||forestState.finished||(reduced.matches&&!forestState.manual)){forest.pause();forestUI();return;}
 if(forestState.blocked||forestState.pending)return;
 loadForest();forestState.pending=true;
 forest.play().then(()=>{
  forestState.pending=false;
  if(document.hidden||!forestState.visible||forestState.userPaused||(reduced.matches&&!forestState.manual))forest.pause();
  forestUI();
 }).catch(error=>{
  forestState.pending=false;
  if(error.name!=='AbortError')forestState.blocked=true;
  forestUI();
 });
}
forest.addEventListener('playing',()=>{forestState.started=true;forestState.blocked=false;forestUI();});
forest.addEventListener('pause',forestUI);
forest.addEventListener('ended',()=>{forestState.finished=true;forestUI();});
forest.addEventListener('error',()=>{forestState.blocked=true;forestState.started=false;forestUI();});
forestToggle.addEventListener('click',()=>{
 if(!forest.paused&&!forest.ended){forestState.userPaused=true;forest.pause();forestUI();return;}
 if(forestState.finished){forestState.finished=false;forest.currentTime=0;}
 forestState.userPaused=false;forestState.manual=true;forestState.blocked=false;syncForest();
});
document.addEventListener('visibilitychange',syncForest);
reduced.addEventListener('change',()=>{forestState.manual=false;syncForest();});
new IntersectionObserver(entries=>{const entry=entries[0];forestState.visible=entry.isIntersecting&&entry.intersectionRatio>=.15;syncForest();},{threshold:[0,.15,.4]}).observe(retreat);
forestUI();

// Native dialogs, local-only plan, no personal data or outgoing API.
const picker=$('#picker-dialog'),menu=$('#menu-dialog');let opener=null,planUrl=null;
function openDialog(dialog,from){opener=from||document.activeElement;document.body.classList.add('dialog-open');dialog.showModal();}
all('dialog').forEach(d=>{d.querySelector('.dialog-close').addEventListener('click',()=>d.close());d.addEventListener('click',e=>{const r=d.getBoundingClientRect();if(e.target===d&&(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom))d.close();});d.addEventListener('close',()=>{if(!document.querySelector('dialog[open]')){document.body.classList.remove('dialog-open');opener?.focus({preventScroll:true});}});});$('.menu-toggle').addEventListener('click',e=>openDialog(menu,e.currentTarget));menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>menu.close()));
function resetPicker(goal=''){if(planUrl){URL.revokeObjectURL(planUrl);planUrl=null;}$('#download-plan').removeAttribute('href');$('#picker-form').hidden=false;$('#picker-result').hidden=true;$('#picker-title').textContent='С чего начнём?';$('#goal').value=goal;}
all('[data-picker]').forEach(button=>button.addEventListener('click',()=>{const from=menu.open?$('.menu-toggle'):button;if(menu.open)menu.close();resetPicker(button.hasAttribute('data-current-direction')?active:'');openDialog(picker,from);}));
$('#picker-form').addEventListener('submit',e=>{e.preventDefault();if(!e.currentTarget.reportValidity())return;const key=$('#goal').value,days=$('#picker-form input[name=duration]:checked').value;$('#result-title').textContent=directions[key].name+' — ваш ориентир';$('#result-duration').textContent='Время для себя: '+days+'.';const text=`VERBA · предварительный личный план\n\nНаправление: ${directions[key].name}\n${directions[key].title}\nПланируемая длительность: ${days}\n\nЭто демоверсия MILLER / VERBA. Заявка не отправлена.\nПрограмму, длительность и противопоказания необходимо обсудить с врачом.\nОфициальный сайт: https://verbamayr.ru/\n`;if(planUrl)URL.revokeObjectURL(planUrl);planUrl=URL.createObjectURL(new Blob([text],{type:'text/plain'}));$('#download-plan').href=planUrl;$('#picker-form').hidden=true;$('#picker-result').hidden=false;$('#picker-title').textContent='Первый шаг сделан.';$('#download-plan').focus();});$('#picker-again').addEventListener('click',()=>{const key=$('#goal').value;resetPicker(key);$('#goal').focus();});
restoreDirection();measureMotion();syncVideo();
