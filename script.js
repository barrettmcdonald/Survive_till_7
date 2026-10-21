'use strict';
// Вся длительность указана в миллисекундах. Игра полностью автономна.
const HOUR_MS = 6000;
const RESPONSE_MS = 2000;
const TOTAL_HOURS = 12;
const NEEDS = [
  { action: 'wash', icon: '💩', text: 'Я покакал!', success: 'Чистый малыш — счастливый малыш!' },
  { action: 'feed', icon: '🍼', text: 'Хочу кушать!', success: 'Сытый животик. Можно выдохнуть!' },
  { action: 'sleep', icon: '☾', text: 'Хочу спать!', success: 'Тс-с… маленький сон, большая победа.' }
];
// Модель отделена от экрана, чтобы правила можно было проверить отдельно.
class GameModel {
  constructor(random = Math.random) { this.random = random; this.reset(); }
  reset() {
    this.status = 'ready'; this.hearts = 5; this.hour = -1; this.elapsed = 0;
    this.pending = false; this.need = null; this.events = 0; this.feedback = ''; this.mood = '';
    this.timeoutApplied = false; this.action = null; this.actionStarted = 0; this.actionEnd = Infinity;
    this.losses = [];
  }
  start() { this.reset(); this.status = 'playing'; this.newHour(0); }
  newHour(hour) {
    this.hour = hour; this.events++; this.need = NEEDS[Math.floor(this.random() * NEEDS.length)];
    this.pending = true; this.timeoutApplied = false; this.action = null; this.actionEnd = Infinity;
    this.feedback = 'Помоги малышу — у тебя 2 секунды!'; this.mood = '';
  }
  fail(late) {
    if (this.status !== 'playing' || !this.pending) return;
    if (late) { if (this.timeoutApplied) return; this.timeoutApplied = true; }
    this.hearts--; this.losses.push({ index: this.hearts, at: this.elapsed }); this.mood = 'crying';
    this.feedback = late ? 'Время вышло. −1 сердечко. Малышу всё ещё нужна помощь!' : 'Нужен другой предмет! −1 сердечко. Попробуй ещё.';
    if (this.hearts === 0) { this.status = 'lost'; this.action = null; this.actionEnd = Infinity; }
  }
  update(elapsed) {
    if (this.status !== 'playing') return;
    const target = Math.max(this.elapsed, elapsed);
    // Единственная шкала времени. Границы обрабатываются по порядку, без setTimeout.
    while (this.status === 'playing') {
      const hourAt = (this.hour + 1) * HOUR_MS;
      const timeoutAt = this.pending && !this.timeoutApplied ? this.hour * HOUR_MS + RESPONSE_MS : Infinity;
      const next = Math.min(hourAt, timeoutAt, this.actionEnd);
      if (next > target) { this.elapsed = target; break; }
      this.elapsed = next;
      // При совпадении границ новый час всегда важнее старого действия.
      if (next === hourAt) {
        if (this.hour + 1 === TOTAL_HOURS) {
          this.status = 'won'; this.pending = false; this.need = null; this.action = null;
          this.actionEnd = Infinity; this.mood = 'happy'; break;
        }
        this.newHour(this.hour + 1);
      } else if (next === timeoutAt) { this.fail(true); }
      else { this.action = null; this.actionEnd = Infinity; this.mood = ''; this.feedback = 'Малыш спокоен. Можно немного выдохнуть.'; }
    }
  }
  answer(action, elapsed) {
    this.update(elapsed);
    if (this.status !== 'playing' || !this.pending || this.action) return;
    if (action !== this.need.action) { this.fail(false); return; }
    this.pending = false; this.action = action; this.actionStarted = this.elapsed;
    this.actionEnd = this.elapsed + RESPONSE_MS; this.mood = 'happy'; this.feedback = this.need.success;
  }
}
// Пауза замораживает именно игровое время; продолжительность паузы не накапливается.
class GameClock {
  constructor(now = () => performance.now()) { this.now = now; this.reset(); }
  reset() { this.elapsed = 0; this.anchor = this.now(); this.paused = false; }
  read() { return this.elapsed + (this.paused ? 0 : Math.max(0, this.now() - this.anchor)); }
  pause() { if (!this.paused) { this.elapsed = this.read(); this.paused = true; } }
  resume() { if (this.paused) { this.anchor = this.now(); this.paused = false; } }
}
const $ = id => document.getElementById(id);
const model = new GameModel();
const buttons = [...document.querySelectorAll('[data-action]')];
let frame = null;
const gameClock = new GameClock();
let generation = 0;
let heartMarkup = '';
let familyState = '';
let lastHour = -1;
let screenStatus = 'ready';
function elapsedNow() { return gameClock.read(); }
function render() {
  const minutes = model.status === 'won' ? 19 * 60 : 7 * 60 + Math.min(720, Math.floor(model.elapsed / HOUR_MS * 60));
  $('clock').textContent = String(Math.floor(minutes / 60)).padStart(2, '0') + ':' + String(minutes % 60).padStart(2, '0');
  const markup = Array.from({length: 5}, (_, i) => '<span class="' + (i < model.hearts ? '' : 'lost') + '">♥</span>').join(' ');
  if (markup !== heartMarkup) { $('hearts').innerHTML = markup; heartMarkup = markup; }
  [...$('hearts').children].forEach((heart, i) => {
    const loss = model.losses.find(loss => loss.index === i);
    heart.classList.toggle('heart-hit', Boolean(loss && model.elapsed - loss.at < 650));
    heart.style.animationDelay = loss ? -(model.elapsed - loss.at) + 'ms' : '0ms';
  });
  $('hearts').setAttribute('aria-label', model.hearts + ' из 5 нервных клеток');
  $('day-progress').style.width = Math.min(100, model.elapsed / (TOTAL_HOURS * HOUR_MS) * 100) + '%';
  const state = 'family ' + model.mood + (model.action ? ' doing-' + model.action : '');
  if (state !== familyState || lastHour !== model.hour) {
    // Снять эффекты предыдущего часа до запуска новых.
    $('family').className = state; familyState = state; lastHour = model.hour;
  }
  $('family').style.setProperty('--action-time', -(model.elapsed - model.actionStarted) + 'ms');
  $('thought').hidden = !model.pending && !model.action;
  document.querySelector('.game').classList.toggle('is-paused', gameClock.paused);
  document.querySelector('.game').classList.toggle('is-stopped', model.status !== 'playing');
  $('pause').hidden = model.status !== 'playing';
  $('pause').disabled = gameClock.paused;
  $('pause-overlay').hidden = !gameClock.paused || model.status !== 'playing';
  $('need-icon').textContent = model.pending ? model.need.icon : '♡';
  $('need-text').textContent = model.pending ? model.need.text : 'Помогаем малышу…';
  $('reaction-progress').style.width = model.pending && !model.timeoutApplied ? Math.max(0, 100 * (1 - (model.elapsed - model.hour * HOUR_MS) / RESPONSE_MS)) + '%' : '0%';
  $('message').textContent = model.feedback;
  buttons.forEach(button => { button.disabled = model.status !== 'playing' || !model.pending || gameClock.paused; });
  $('dad').hidden = model.status !== 'won';
  if (model.status !== screenStatus && (model.status === 'won' || model.status === 'lost')) {
    screenStatus = model.status;
    const won = model.status === 'won';
    $('overlay').hidden = false; $('overlay').classList.add('ended');
    $('screen-icon').textContent = won ? '👨' : '☁';
    $('screen-title').textContent = won ? '19:00. Папа дома!' : 'Маме нужен отдых';
    $('screen-description').textContent = won ? 'Вы справились! Малыш передан папе. У мамы осталось сердечек: ' + model.hearts + '. Теперь — чай и тишина.' : 'Все пять нервных клеток устали. Этот день был непростым. Сделаем вдох и попробуем ещё раз?';
    $('instructions').hidden = true; $('start').textContent = 'Начать сначала';
    document.querySelector('.card-note').textContent = won ? 'Даже самый длинный день заканчивается.' : 'Подсказка: следи за пузырём над малышом.';
    $('start').focus();
  }
}
function schedule() {
  if (frame !== null || model.status !== 'playing' || gameClock.paused) return;
  const currentGeneration = generation;
  frame = requestAnimationFrame(() => {
    if (currentGeneration !== generation) return;
    frame = null; tick();
  });
}
function tick() {
  if (model.status !== 'playing' || gameClock.paused) return;
  model.update(elapsedNow()); render(); schedule();
}
function stopFrame() { generation++; if (frame !== null) cancelAnimationFrame(frame); frame = null; }
function start() {
  stopFrame(); gameClock.reset(); screenStatus = 'playing'; familyState = ''; lastHour = -1;
  model.start(); $('overlay').hidden = true; $('overlay').classList.remove('ended');
  $('confirm-restart').hidden = true; $('pause-menu').hidden = false;
  // Новая партия также начинает визуальные анимации с начала.
  document.querySelectorAll('.family, .family *').forEach(element => {
    element.getAnimations().forEach(animation => { animation.currentTime = 0; });
  });
  render();
  if (document.hidden || !document.hasFocus()) pause(); else schedule();
}
function pause() {
  if (model.status !== 'playing' || gameClock.paused) return;
  gameClock.pause(); model.update(elapsedNow()); stopFrame();
  $('confirm-restart').hidden = true; $('pause-menu').hidden = false; render();
  if (model.status === 'playing') $('resume').focus();
}
function resume() {
  if (model.status !== 'playing' || !gameClock.paused || document.hidden || !$('confirm-restart').hidden) return;
  gameClock.resume(); render(); schedule(); $('pause').focus();
}
buttons.forEach(button => button.addEventListener('click', () => {
  if (gameClock.paused || model.status !== 'playing') return;
  model.answer(button.dataset.action, elapsedNow()); render();
}));
$('start').addEventListener('click', start);
$('pause').addEventListener('click', pause);
$('resume').addEventListener('click', resume);
$('restart').addEventListener('click', () => {
  if (!gameClock.paused || model.status !== 'playing') return;
  $('pause-menu').hidden = true; $('confirm-restart').hidden = false; $('cancel-restart').focus();
});
$('cancel-restart').addEventListener('click', () => {
  $('confirm-restart').hidden = true; $('pause-menu').hidden = false; $('restart').focus();
});
$('confirm-start').addEventListener('click', () => {
  if (gameClock.paused && !$('confirm-restart').hidden) start();
});
document.addEventListener('visibilitychange', () => { if (document.hidden) pause(); });
window.addEventListener('blur', pause);
window.addEventListener('pagehide', pause);
document.addEventListener('keydown', event => {
  if (event.key !== 'Escape' || model.status !== 'playing') return;
  if (!gameClock.paused) pause();
  else if (!$('confirm-restart').hidden) $('cancel-restart').click();
  else resume();
});
