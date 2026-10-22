'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const source = fs.readFileSync(path.join(__dirname, '..', 'script.js'), 'utf8');
const context = vm.createContext({});
vm.runInContext(source.split('const $ =')[0] + '\nglobalThis.Model = GameModel; globalThis.Clock = GameClock;', context);
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
  for (let hour = 0; hour < 12; hour++) {
    model.update(hour * 6000);
    const action = model.need.action;
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
  model.start();
  assert.equal(model.needStreak, 1);
  assert.equal(model.events, 1);
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
console.log('PASS: 1002 партии, запрет трёх повторов, 12 событий, 72 секунды, перезапуск, штрафы и пауза.');
