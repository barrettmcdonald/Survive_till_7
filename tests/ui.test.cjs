'use strict';
const assert = require('node:assert/strict');
const path = require('node:path');
const os = require('node:os');
const {pathToFileURL} = require('node:url');
let pw;
try { pw = require('playwright'); } catch {
  pw = require(path.join(os.homedir(), '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'));
}
module.exports = (async () => {
  const browser = await pw.chromium.launch({headless:true, executablePath:process.env.SURVIVE_BROWSER_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe'});
  try {
    const context = await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
    const page = await context.newPage(), errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.goto(pathToFileURL(path.join(__dirname,'..','index.html')).href);
    await page.clock.install(); await page.clock.pauseAt(new Date());
    const state = () => page.evaluate(() => ({level:model.levelId,status:model.status,hearts:model.hearts,time:model.elapsed,events:model.events,paused:gameClock.paused,unlocked:progress.unlocked,action:model.action}));
    const win = () => page.evaluate(() => {for(let h=0;h<12;h++){model.update(h*6000);model.answer(model.need.action,h*6000+1)}model.update(72000);render()});
    assert.equal(await page.locator('html').getAttribute('lang'),'ru');
    await page.locator('#open-levels').click();
    assert.equal(await page.locator('#choose-level-2').isDisabled(),true);
    assert.equal(await page.evaluate(()=>start(2)),false);
    await page.locator('[data-language="en"]').click();
    assert.equal(await page.locator('#level2-lock').textContent(),'Complete Level 1 to unlock');
    await page.locator('#levels-back').click(); await page.locator('#start').click();
    assert.equal((await state()).level,1); assert.equal(await page.locator('.toys-target').isVisible(),false);
    await win(); assert.equal((await state()).unlocked,2);
    assert.equal(await page.locator('#clock').textContent(),'19:00');
    assert.equal(await page.locator('#next-level').isVisible(),true);
    await page.locator('#next-level').click();
    assert.equal((await state()).level,2); assert.equal((await state()).time,0); assert.equal((await state()).hearts,5);
    assert.equal(await page.locator('.toys-target').isVisible(),true);
    await page.evaluate(()=>{model.need=PLAY_NEED;render()});
    await page.locator('[data-action="wash"]').click(); assert.equal((await state()).hearts,4);
    await page.locator('[data-action="play"]').click(); await page.clock.runFor(700);
    assert.equal((await state()).action,'play');
    const baby = await page.locator('.play-baby').boundingBox(); assert.ok(baby.width>baby.height);
    assert.equal(await page.locator('.family-playing').evaluate(e=>Number(e.style.opacity)),1);
    await page.locator('#pause').click();
    assert.equal(await page.locator('#pause-menu > button').count(),3);
    const frozen = await page.evaluate(()=>JSON.stringify({model,clock:gameClock.read(),baby:document.querySelector('.play-baby').style.cssText,mom:document.querySelector('.family-playing').style.cssText}));
    await page.clock.runFor(60000); await page.locator('[data-language="ru"]').click();
    assert.equal(await page.evaluate(()=>JSON.stringify({model,clock:gameClock.read(),baby:document.querySelector('.play-baby').style.cssText,mom:document.querySelector('.family-playing').style.cssText})),frozen);
    await page.locator('#resume').click(); await page.clock.runFor(1350);
    assert.equal((await state()).action,null); assert.equal((await state()).hearts,4);
    await page.locator('#pause').click(); await page.locator('#restart').click();
    await page.locator('#cancel-restart').click(); assert.equal((await state()).paused,true);
    await page.locator('#restart').click(); await page.locator('#confirm-start').click();
    assert.equal((await state()).level,2); assert.equal((await state()).time,0); assert.equal((await state()).hearts,5);
    await page.locator('#pause').click(); await page.locator('#main-menu').click();
    assert.equal((await state()).status,'ready'); assert.equal((await state()).events,0); assert.equal((await state()).unlocked,2);
    await page.clock.runFor(10000); assert.equal((await state()).time,0);
    await page.locator('#start').click(); assert.equal((await state()).level,1);
    await page.locator('#pause').click(); await page.locator('#main-menu').click();
    await page.locator('#open-levels').click(); assert.equal(await page.locator('#choose-level-2').isDisabled(),false);
    await page.locator('#choose-level-2').click(); assert.equal((await state()).level,2);
    // Общие позы должны совпадать между уровнями, включая размер и поворот.
    for (const level of [1,2]) for (const action of (level===1?['wash','feed','sleep']:['wash','feed','sleep','play'])) {
      await page.evaluate(({level,action})=>{start(level);model.need=LEVELS[level].needs.find(n=>n.action===action);render()},{level,action});
      assert.equal(await page.locator('#thought').isVisible(),true);
      await page.evaluate(action=>{model.answer(action,0);render()},action);
      assert.equal(await page.locator('#thought').isVisible(),false,'Пузырь должен исчезать сразу после правильного выбора');
      await page.evaluate(()=>{model.update(1000);render();setLanguage('en')});
      assert.equal(await page.locator('#thought').isVisible(),false);
      await page.evaluate(()=>{model.update(2000);render()});
      assert.equal(await page.locator('#thought').isVisible(),false);
      await page.evaluate(()=>{model.update(6000);render()});
      assert.equal(await page.locator('#thought').isVisible(),true,'Новая потребность возвращает пузырь');
    }
    const solidWash = await page.evaluate(() => {
      const frames=[];
      for(const level of [1,2]) {
        start(level);model.need=NEEDS.find(n=>n.action==='wash');model.answer('wash',0);
        for(const age of [180,550,560,610,660,1000,1420,1470,1520,1800]) {
          model.update(age);render();frames.push({
            washing:Number(document.querySelector('.family-washing').style.opacity),
            empty:Number(document.querySelector('.family-empty').style.opacity),
            baby:Number(document.querySelector('.independent-baby').style.opacity)});
        }
        model.update(2000);render();
        if(model.action!==null)return false;
      }
      return frames.every(f=>f.washing===1&&f.empty===0&&f.baby===1);
    });
    assert.equal(solidWash,true,'Мытьё не должно просвечивать при смене фазы ухода');
    const stableEmotion = await page.evaluate(() => {
      const snapshot=selector=>{const e=document.querySelector(selector),r=e.getBoundingClientRect(),c=getComputedStyle(e);return JSON.stringify({x:r.x,y:r.y,width:r.width,height:r.height,transform:c.transform,scale:c.scale,origin:c.transformOrigin})};
      for(const level of [1,2]) for(const phase of [0,750,1500,2250]) {
        start(level);render();
        document.querySelectorAll('.family-seated,.family-crying').forEach(e=>e.getAnimations().forEach(a=>{a.pause();a.currentTime=phase}));
        const calm=snapshot('.family-seated');
        model.mood='crying';render();
        if(getComputedStyle(document.querySelector('.family-seated')).opacity!=='1')return false;
        if(!getComputedStyle(document.querySelector('.family-crying')).clipPath.startsWith('ellipse('))return false;
        if(snapshot('.family-crying')!==calm)return false;
        model.mood='';render();
        if(snapshot('.family-seated')!==calm)return false;
      }
      return true;
    });
    assert.equal(stableEmotion,true,'При смене эмоции не должны меняться масштаб, положение или фаза покачивания');
    const matchingBaby = await page.evaluate(() => {
      const selectors=['.family-seated','.family-crying','.family-standing','.independent-baby','.independent-baby > img','.care-bottle'];
      const capture=()=>selectors.map(selector=>{const e=document.querySelector(selector),s=getComputedStyle(e);return [e.getAttribute('src'),s.width,s.height,s.opacity,s.transform,s.scale]});
      const pairs=[];
      for(const action of [null,'cry','wash','feed','sleep']) for(const age of [0,300,1000,1900]) {
        const states=[1,2].map(level=>{start(level);if(action==='cry'){model.need=NEEDS.find(n=>n.action==='feed');model.answer('wash',0)}else if(action){model.need=NEEDS.find(n=>n.action===action);model.answer(action,0)}model.update(age);render();return capture()});
        pairs.push(JSON.stringify(states[0])===JSON.stringify(states[1]));
      }
      return pairs.every(Boolean);
    });
    assert.equal(matchingBaby,true,'Внешность и размер малыша должны совпадать на обоих уровнях');
    assert.equal(await page.locator('.play-baby').getAttribute('src'),'assets/newborn-playing.png');
    for(const action of ['wash','feed','sleep']) {
      await page.evaluate(action=>{start(2);model.need=NEEDS.find(n=>n.action===action);model.answer(action,0);model.update(1000);render()},action);
      assert.equal(await page.locator('.independent-baby').getAttribute('data-depth'),action==='feed'?'held':'inside');
      if(action==='feed') assert.equal(await page.locator('.family-standing').evaluate(e=>Number(e.style.opacity)),1);
    }
    await page.evaluate(()=>{start(2);model.need=PLAY_NEED;for(let i=0;i<5;i++)model.answer('wash',i);render()});
    assert.equal((await state()).status,'lost');
    assert.equal(await page.locator('#result-menu').isVisible(),true);
    await page.locator('#start').click(); assert.equal((await state()).level,2);
    await win(); assert.equal((await state()).status,'won');
    assert.equal(await page.locator('#next-level').isVisible(),false);
    await page.locator('#start').click(); assert.equal((await state()).level,2);
    await page.evaluate(()=>{setLanguage('en');start(2);model.need=PLAY_NEED;model.answer('play',5500);model.update(6000);render()});
    assert.equal((await state()).action,null); assert.equal((await state()).events,2);
    await page.reload(); assert.equal(await page.locator('html').getAttribute('lang'),'en');
    await page.locator('#open-levels').click(); assert.equal(await page.locator('#choose-level-2').isDisabled(),false);
    await page.locator('#choose-level-2').click();
    // Headless Chrome не меняет видимость при создании второй вкладки.
    // Проверяем тот же браузерный visibilitychange с состоянием hidden.
    await page.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,value:true});document.dispatchEvent(new Event('visibilitychange'))});
    assert.equal((await state()).paused,true);
    await page.evaluate(()=>{delete document.hidden;document.dispatchEvent(new Event('visibilitychange'))});
    assert.equal((await state()).paused,true);
    await page.locator('#resume').click(); assert.equal((await state()).paused,false);
    for(const [width,height] of [[280,568],[320,568],[390,844],[480,800]]) {
      await page.setViewportSize({width,height});
      for(const lang of ['ru','en']) {
        await page.evaluate(lang=>{pause();returnToTitle();setLanguage(lang)},lang);
        await page.locator('#open-levels').click();
        assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth),width);
        assert.equal(await page.locator('#levels-title').textContent(),lang==='ru'?'Выбор уровня':'Select Level');
        await page.locator('#choose-level-2').click();
        await page.evaluate(()=>{model.need=PLAY_NEED;model.answer('play',0);model.update(1000);render()});
        assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth),width);
        await page.waitForFunction(()=>[...document.images].every(i=>i.complete&&i.naturalWidth>0));
      }
    }
    assert.deepEqual(errors,[]);
    console.log('PASS UI: блокировка/сохранение, оба уровня, победа/поражение, меню, перезапуск уровня 2, игрушки, таймер 2 с, пауза/фон, RU/EN и 4 мобильных размера.');
  } finally { await browser.close(); }
})();
if(require.main===module) module.exports.catch(error=>{console.error(error);process.exitCode=1});
