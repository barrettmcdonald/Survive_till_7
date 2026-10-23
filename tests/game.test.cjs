'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const source = fs.readFileSync(path.join(__dirname, '..', 'script.js'), 'utf8');
const context = vm.createContext({});
vm.runInContext(source.split('const $ =')[0] + '\nglobalThis.Model = GameModel; globalThis.Clock = GameClock; globalThis.Progress = LevelProgress; globalThis.levels = LEVELS; globalThis.progressKey = PROGRESS_KEY;', context);
const {Model, Clock} = context;
// Проверяем серии при крайних постоянных значениях и 1000 воспроизводимых seed.
for (let seed = -2; seed < 1000; seed++) {
  let state = seed + 3;
  const random = seed === -2 ? () => 0 : seed === -1 ? () => 0.999999 : () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 4294967296;
  };
  const model = new Model(random);
  model.start();
  let previous = null, streak = 0;
  const levelActions = new Set();
  for (let hour = 0; hour < 12; hour++) {
    model.update(hour * 6000);
    const action = model.need.action;
    levelActions.add(action);
    streak = action === previous ? streak + 1 : 1;
    assert.ok(streak <= 2, 'Третья одинаковая потребность, seed=' + seed);
    previous = action;
    model.answer(action, hour * 6000 + 1);
    assert.equal(model.actionEnd, hour * 6000 + 2001);
  }
  model.update(72000);
  assert.equal(model.status, 'won');
  assert.equal(model.events, 12);
  assert.equal(model.hearts, 5);
  assert.deepEqual([...levelActions].sort(), ['feed','sleep','wash']);
  model.start();
  assert.equal(model.needStreak, 1);
  assert.equal(model.events, 1);
  assert.equal(model.seenNeeds.size, 1);
}
const model = new Model(() => 0);
model.start();
model.answer('feed', 100);
model.update(2000);
assert.equal(model.hearts, 3); // Неправильный предмет и опоздание штрафуют отдельно.
assert.equal(model.pending, true);
model.update(5000);
assert.equal(model.hearts, 3);
model.answer('wash', 5500);
model.update(6000);
assert.equal(model.action, null); // Новый час прерывает действие.
assert.equal(model.pending, true);
model.start();
model.update(26000);
assert.equal(model.status, 'lost');
assert.equal(model.hearts, 0);
let now = 0;
const clock = new Clock(() => now);
now = 900;
clock.pause();
now += 60000;
assert.equal(clock.read(), 900);
clock.resume();
now += 1100;
assert.equal(clock.read(), 2000);
// Второй уровень — та же модель, четыре потребности и тот же баланс.
const seen = new Set();
for (let seed = 0; seed < 1002; seed++) {
  let value = seed + 1;
  const m = new Model(() => { value = (Math.imul(value,1664525)+1013904223) >>> 0; return value/4294967296; });
  m.start(2);
  const levelActions = new Set();
  let previous = null, streak = 0;
  for (let hour = 0; hour < 12; hour++) {
    m.update(hour*6000); seen.add(m.need.action); levelActions.add(m.need.action);
    streak = m.need.action === previous ? streak+1 : 1;
    assert.ok(streak <= 2); previous = m.need.action;
    m.answer(m.need.action,hour*6000+1);
    assert.equal(m.actionEnd,hour*6000+2001);
  }
  m.update(71999); assert.equal(m.status,'playing');
  m.update(72000); assert.equal(m.status,'won'); assert.equal(m.events,12); assert.equal(m.hearts,5);
  assert.deepEqual([...levelActions].sort(),['feed','play','sleep','wash']);
  m.start(); assert.equal(m.levelId,2); assert.equal(m.elapsed,0); assert.equal(m.hearts,5); assert.equal(m.needStreak,1);
}
assert.deepEqual([...seen].sort(),['feed','play','sleep','wash']);
// Даже крайний постоянный random не может пропустить действие на уровне.
for(const level of [1,2]) for(const value of [0,.999999]) {
  const m = new Model(()=>value); m.start(level);
  const actions=new Set();let last=null,streak=0;
  for(let hour=0;hour<12;hour++) {
    m.update(hour*6000);const action=m.need.action;actions.add(action);
    streak=action===last?streak+1:1;last=action;assert.ok(streak<=2);
    m.answer(action,hour*6000+1);
  }
  assert.equal(actions.size,context.levels[level].needs.length);
  m.start(level);assert.equal(m.seenNeeds.size,1);
}
assert.equal(context.levels[1].needs.length,3);
assert.equal(context.levels[2].needs.length,4);
const playing = new Model(() => 0.99999); playing.start(2);
assert.equal(playing.need.action,'play');
playing.answer('wash',100); playing.answer('feed',200); playing.update(2000);
assert.equal(playing.hearts,2); assert.equal(playing.pending,true);
playing.answer('play',2100); playing.answer('wash',2200); assert.equal(playing.hearts,2);
playing.update(4099); assert.equal(playing.action,'play');
playing.update(4100); assert.equal(playing.action,null);
playing.start(2); playing.answer('play',5500); playing.update(6000);
assert.equal(playing.action,null); assert.equal(playing.pending,true);
const newborn = new Model(() => 0); newborn.start(1); newborn.answer('play',100);
assert.equal(newborn.hearts,5); assert.equal(newborn.pending,true);
for (let hour=0;hour<12;hour++) { newborn.update(hour*6000); assert.notEqual(newborn.need.action,'play'); newborn.answer(newborn.need.action,hour*6000+1); }
const values = new Map(), storage = {getItem:key=>values.get(key)||null,setItem:(key,value)=>values.set(key,value)};
const progress = new context.Progress(storage);
assert.equal(progress.canStart(1),true); assert.equal(progress.canStart(2),false);
progress.complete(2); assert.equal(progress.canStart(2),false);
progress.complete(1); assert.equal(progress.canStart(2),true);
assert.equal(new context.Progress(storage).canStart(2),true);
assert.equal(progress.canStart(3),false);
values.set(context.progressKey,'broken'); assert.equal(new context.Progress(storage).canStart(2),false);
const denied = new context.Progress({getItem(){throw Error('denied')},setItem(){throw Error('denied')}});
denied.complete(1); assert.equal(denied.canStart(2),true);
console.log('PASS: 2004 партии на двух уровнях, 4 потребности, запрет повторов, таймеры, штрафы, пауза, перезапуск и постоянная разблокировка.');
