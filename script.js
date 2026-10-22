'use strict';
// Вся длительность указана в миллисекундах. Игра полностью автономна.
const HOUR_MS = 6000;
const RESPONSE_MS = 2000;
const TOTAL_HOURS = 12;
// Централизованные тексты. Модель хранит ключи, а не переведённые сообщения.
const TRANSLATIONS = {
  "ru": {
    "brand": "ОДИН ОЧЕНЬ ДЛИННЫЙ ДЕНЬ",
    "time": "Время",
    "nerves": "Мамины нервные клетки",
    "hearts": "{count} из 5 нервных клеток",
    "departure": "07:00 · папа ушёл",
    "arrival": "папа дома · 19:00",
    "room": "Детская комната",
    "dreams": "сладких снов",
    "world": "Наш маленький мир",
    "dad": "Я дома!",
    "caption": "маленький человек · большие заботы",
    "ready": "Всё готово к новому дню",
    "help": "Помочь малышу",
    "sink": "Раковина",
    "washHint": "Помыть малыша",
    "bottle": "Бутылочка",
    "feedHint": "Покормить",
    "crib": "Кроватка",
    "sleepHint": "Уложить спать",
    "footer": "12 часов заботы. Ты справишься ♡",
    "eyebrow": "МАЛЕНЬКОЕ ПРИКЛЮЧЕНИЕ МАМЫ",
    "intro": "Папа ушёл на работу. Мама осталась с малышом один на один. Впереди целый день маленьких катастроф и больших побед.",
    "poopHint": "Покакал",
    "hungryHint": "Проголодался",
    "sleepyHint": "Захотел спать",
    "sinkLower": "раковина",
    "bottleLower": "бутылочка",
    "cribLower": "кроватка",
    "instructions": "Реагируй быстро, береги мамины нервы и продержись до возвращения папы!",
    "start": "Начать день",
    "startNote": "До семи вечера. Ты справишься ♡",
    "pause": "Пауза",
    "break": "Мама заслужила передышку!",
    "resume": "Продолжить",
    "mainMenu": "На начальный экран",
    "restart": "Начать сначала",
    "confirm": "Начать новую игру?",
    "cancel": "Отмена",
    "yes": "Да, начать",
    "needWash": "Я покакал!",
    "needFeed": "Хочу кушать!",
    "needSleep": "Хочу спать!",
    "successWash": "Чистый малыш — счастливый малыш!",
    "successFeed": "Сытый животик. Можно выдохнуть!",
    "successSleep": "Тс-с… маленький сон, большая победа.",
    "react": "Помоги малышу — у тебя 2 секунды!",
    "late": "Время вышло. −1 сердечко. Малышу всё ещё нужна помощь!",
    "wrong": "Нужен другой предмет! −1 сердечко. Попробуй ещё.",
    "calm": "Малыш спокоен. Можно немного выдохнуть.",
    "helping": "Помогаем малышу…",
    "wonTitle": "19:00. Папа дома!",
    "lostTitle": "Маме нужен отдых",
    "wonDescription": "Вы справились! Малыш передан папе. У мамы осталось сердечек: {count}. Теперь — чай и тишина.",
    "lostDescription": "Все пять нервных клеток устали. Этот день был непростым. Сделаем вдох и попробуем ещё раз?",
    "wonNote": "Даже самый длинный день заканчивается.",
    "lostNote": "Подсказка: следи за пузырём над малышом.",
    "language": "Язык"
  },
  "en": {
    "brand": "ONE VERY LONG DAY",
    "time": "Time",
    "nerves": "Mom’s last nerves",
    "hearts": "{count} of 5 nerves left",
    "departure": "07:00 · Dad’s off to work",
    "arrival": "Dad’s home · 19:00",
    "room": "Nursery",
    "dreams": "sweet dreams",
    "world": "Our little world",
    "dad": "I’m home!",
    "caption": "tiny human · big adventures",
    "ready": "Ready for a brand-new day",
    "help": "Help the baby",
    "sink": "Sink",
    "washHint": "Clean baby up",
    "bottle": "Bottle",
    "feedHint": "Feed the baby",
    "crib": "Crib",
    "sleepHint": "Time for a nap",
    "footer": "12 hours of love. You’ve got this ♡",
    "eyebrow": "MOM’S LITTLE ADVENTURE",
    "intro": "Dad’s off to work. It’s just Mom and baby now—a whole day of tiny disasters and big little victories awaits.",
    "poopHint": "Poopy diaper!",
    "hungryHint": "I’m hungry!",
    "sleepyHint": "I’m sleepy!",
    "sinkLower": "sink",
    "bottleLower": "bottle",
    "cribLower": "crib",
    "instructions": "Think fast, save Mom’s nerves, and hang in there until Dad gets home!",
    "start": "Start the day",
    "startNote": "Until seven tonight. You’ve got this ♡",
    "pause": "Paused",
    "break": "Mom deserves a break!",
    "resume": "Resume",
    "mainMenu": "Back to title",
    "restart": "Start over",
    "confirm": "Start a new game?",
    "cancel": "Cancel",
    "yes": "Yes, let’s go",
    "needWash": "Poopy diaper!",
    "needFeed": "I’m hungry!",
    "needSleep": "I’m sleepy!",
    "successWash": "Clean baby, happy baby!",
    "successFeed": "Full tummy. And… exhale!",
    "successSleep": "Shh… one small nap, one big win.",
    "react": "Baby needs you—quick, you have 2 seconds!",
    "late": "Time’s up! −1 heart. Baby still needs your help!",
    "wrong": "Oops, try another item! −1 heart. You can still fix it.",
    "calm": "Baby’s happy. Take a little breather.",
    "helping": "Taking care of baby…",
    "wonTitle": "19:00. Dad’s home!",
    "lostTitle": "Mom needs a break",
    "wonDescription": "You made it! Dad’s on baby duty. Mom has {count} hearts left. Time for tea and a little peace.",
    "lostDescription": "All five nerves have clocked out. What a day! Take a breath and give it another go?",
    "wonNote": "Even the longest day comes to an end.",
    "lostNote": "Tip: watch the thought bubble above baby.",
    "language": "Language"
  }
};
const LANGUAGE_KEY = 'surviveTill7.language';
let language = 'ru';
try { if (localStorage.getItem(LANGUAGE_KEY) === 'en') language = 'en'; } catch { /* Хранилище может быть отключено браузером. */ }
function t(key, values = {}) {
  return TRANSLATIONS[language][key].replace(/\{(\w+)\}/g, (_, name) => values[name] ?? '');
}
const NEEDS = [
  { action: 'wash', icon: '💩', text: 'needWash', success: 'successWash' },
  { action: 'feed', icon: '🍼', text: 'needFeed', success: 'successFeed' },
  { action: 'sleep', icon: '☾', text: 'needSleep', success: 'successSleep' }
];
// Модель отделена от экрана, чтобы правила можно было проверить отдельно.
class GameModel {
  constructor(random = Math.random) { this.random = random; this.reset(); }
  reset() {
    this.status = 'ready'; this.hearts = 5; this.hour = -1; this.elapsed = 0;
    this.pending = false; this.need = null; this.events = 0; this.feedback = 'ready'; this.mood = '';
    this.timeoutApplied = false; this.action = null; this.actionStarted = 0; this.actionEnd = Infinity;
    this.losses = []; this.lastNeedAction = null; this.needStreak = 0;
  }
  start() { this.reset(); this.status = 'playing'; this.newHour(0); }
  newHour(hour) {
    this.hour = hour; this.events++;
    // После двух повторов выбираем из остальных потребностей без повторного броска.
    const choices = this.needStreak >= 2 ? NEEDS.filter(need => need.action !== this.lastNeedAction) : NEEDS;
    this.need = choices[Math.floor(this.random() * choices.length)];
    this.needStreak = this.need.action === this.lastNeedAction ? this.needStreak + 1 : 1;
    this.lastNeedAction = this.need.action;
    this.pending = true; this.timeoutApplied = false; this.action = null; this.actionEnd = Infinity;
    this.feedback = 'react'; this.mood = '';
  }
  fail(late) {
    if (this.status !== 'playing' || !this.pending) return;
    if (late) { if (this.timeoutApplied) return; this.timeoutApplied = true; }
    this.hearts--; this.losses.push({ index: this.hearts, at: this.elapsed }); this.mood = 'crying';
    this.feedback = late ? 'late' : 'wrong';
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
      else { this.action = null; this.actionEnd = Infinity; this.mood = ''; this.feedback = 'calm'; }
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
  $('hearts').setAttribute('aria-label', t('hearts', {count: model.hearts}));
  $('day-progress').style.width = Math.min(100, model.elapsed / (TOTAL_HOURS * HOUR_MS) * 100) + '%';
  const state = 'family ' + model.mood + (model.action ? ' doing-' + model.action : '');
  if (state !== familyState || lastHour !== model.hour) {
    // Снять эффекты предыдущего часа до запуска новых.
    $('family').className = state; familyState = state; lastHour = model.hour;
  }
  $('family').style.setProperty('--action-time', -(model.elapsed - model.actionStarted) + 'ms');
  renderScene();
  $('thought').hidden = !model.pending && !model.action;
  document.querySelector('.game').classList.toggle('is-paused', gameClock.paused);
  document.querySelector('.game').classList.toggle('is-stopped', model.status !== 'playing');
  $('pause').hidden = model.status !== 'playing';
  $('pause').disabled = gameClock.paused;
  $('pause-overlay').hidden = !gameClock.paused || model.status !== 'playing';
  $('need-icon').textContent = model.pending ? model.need.icon : '♡';
  $('need-text').textContent = model.pending ? t(model.need.text) : t('helping');
  $('reaction-progress').style.width = model.pending && !model.timeoutApplied ? Math.max(0, 100 * (1 - (model.elapsed - model.hour * HOUR_MS) / RESPONSE_MS)) + '%' : '0%';
  $('message').textContent = t(model.feedback);
  buttons.forEach(button => { button.disabled = model.status !== 'playing' || !model.pending || gameClock.paused; });
  $('dad').hidden = model.status !== 'won';
  updateLocalizedState();
  if (model.status !== screenStatus && (model.status === 'won' || model.status === 'lost')) {
    screenStatus = model.status;
    const won = model.status === 'won';
    $('overlay').hidden = false; $('overlay').classList.add('ended');
    $('screen-icon').textContent = won ? '👨' : '☁';
    $('instructions').hidden = true;
    $('start').focus();
  }
}

// Визуальная постановка использует ТОЛЬКО существующее игровое время.
// Встать, подойти, выполнить уход, вернуться и сесть — за те же 2000 мс.
// Ни setTimeout, ни новых игровых состояний или изменений баланса здесь нет.
function renderScene() {
  const family = $('family');
  const seated = family.querySelector('.family-seated');
  const crying = family.querySelector('.family-crying');
  const washing = family.querySelector('.family-washing');
  const standing = family.querySelector('.family-standing');
  const empty = family.querySelector('.family-empty');
  const back = family.querySelector('.family-back');
  const room = document.querySelector('.illustrated-room');
  const baby = room.querySelector('.independent-baby');
  const visual = family.querySelector('.family-visual');
  const effects = family.querySelector('.care-effects');
  const ease = value => { const x = Math.max(0, Math.min(1, value)); return x * x * (3 - 2 * x); };
  let travel = 0, pose = 0, care = 0, bob = 0, age = 0, transfer = 0, turn = 0;
  const destination = {wash: [-24, -3], sleep: [12, -1], feed: [-9, 5]};
  if (model.action) {
    age = Math.max(0, Math.min(RESPONSE_MS, model.elapsed - model.actionStarted));
    travel = age < 580 ? ease((age - 180) / 400) : age < 1520 ? 1 : 1 - ease((age - 1520) / 300);
    pose = age < 180 ? ease(age / 180) : age < 1820 ? 1 : 1 - ease((age - 1820) / 180);
    care = ease((age - 560) / 100) * (1 - ease((age - 1420) / 100));
    transfer = ease((age - 580) / 200) * (1 - ease((age - 1330) / 190));
    turn = model.action === 'sleep' ? ease((age - 380) / 220) * (1 - ease((age - 1400) / 220)) : 0;
    bob = (age >= 180 && age < 580 || age > 1520 && age < 1820) ? Math.sin(age / 55) * 1.2 * pose : Math.sin(age / 180) * 0.5 * pose;
  }
  const [dx, dy] = destination[model.action] || [0, 0];
  family.style.left = (28 + dx * travel) + '%';
  family.style.top = (25 + dy * travel) + '%';
  visual.style.transform = 'translateY(' + bob + 'px)';
  const isCrying = model.mood === 'crying';
  seated.style.opacity = isCrying ? 0 : 1 - pose;
  crying.style.opacity = isCrying ? 1 - pose : 0;
  const separate = model.action === 'sleep' || model.action === 'wash';
  standing.style.opacity = separate ? 0 : pose;
  const washPose = model.action === 'wash' ? care : 0;
  empty.style.opacity = separate ? pose * (1 - turn) * (1 - washPose) : 0;
  washing.style.opacity = pose * washPose;
  back.style.opacity = pose * turn;
  // Компенсация узкого портретного PNG сохраняет размер головы и малыша.
  // Обе позы опираются на одну точку у стоп.
  seated.style.scale = '1 ' + (1 + pose * 0.18);
  standing.style.transform = 'translateY(' + ((1 - pose) * 18) + '%) scale(1.52, ' + (1.14 + pose * 0.38) + ')';
  const mirror = model.action === 'wash' ? -1 : 1;
  empty.style.transform = 'translateY(' + ((1 - pose) * 18) + '%) rotate(' + (transfer * (model.action === 'sleep' ? 2 : -1.5) + (model.action === 'wash' ? Math.sin(age / 80) * care : 0)) + 'deg) scale(' + (1.52 * mirror) + ', ' + (1.14 + pose * 0.38) + ')';
  back.style.transform = 'translateY(' + ((1 - pose) * 18) + '%) rotate(' + (transfer * 3) + 'deg) scale(1.52, ' + (1.14 + pose * 0.38) + ')';
  washing.style.transform = empty.style.transform;
  room.dataset.care = model.action || '';
  room.style.setProperty('--scene-age', -age + 'ms');
  room.style.setProperty('--scene-care', care);
  const fw = room.clientWidth * 0.46, fh = fw * 1295 / 1214;
  const heldX = (28 + dx * travel) / 100 * room.clientWidth + fw * (mirror < 0 ? 0.08 : 0.48);
  const heldY = (25 + dy * travel) / 100 * room.clientHeight + fh * (0.4104 - 0.4232 * pose) + bob;
  const targetX = room.clientWidth * (model.action === 'sleep' ? 0.76 : 0.015);
  const targetY = room.clientHeight * (model.action === 'sleep' ? 0.34 : 0.24);
  // После подхода малыш сразу появляется внутри предмета, без пролёта по дуге.
  // Перед возвращением мамы он так же мгновенно оказывается у неё на руках.
  const inFurniture = separate && age >= 600 && age < 1520;
  baby.style.left = ((inFurniture ? targetX : heldX) / room.clientWidth * 100) + '%';
  baby.style.top = ((inFurniture ? targetY : heldY) / room.clientHeight * 100) + '%';
  baby.style.width = ((inFurniture ? room.clientWidth * 0.185 : fw * 0.40) / room.clientWidth * 100) + '%';
  baby.style.opacity = separate ? pose : 0;
  // В руках малыш перед мамой; внутри чаши/кроватки — за их передним краем.
  const behindFurniture = inFurniture;
  baby.style.zIndex = behindFurniture ? 5 : 8;
  baby.dataset.depth = behindFurniture ? 'inside' : 'held';
  baby.style.setProperty('--care', care);
  baby.style.setProperty('--action-time', -age + 'ms');
  baby.querySelector('img').style.transform = 'rotate(' + (inFurniture ? (model.action === 'sleep' ? 40 : Math.sin(age / 85) * 3) : 0) + 'deg) scaleX(' + mirror + ')';
  const bubbleSide = model.action === 'sleep' ? 25 : model.action === 'feed' ? 79 : 64;
  $('thought').style.left = (60 + (bubbleSide - 60) * pose) + '%';
  effects.style.opacity = care;
  // Та же бутылочка переходит со стола в руки, затем возвращается на место.
  document.querySelector('.table-bottle').style.opacity = model.action === 'feed' ? 1 - care : 1;
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
function returnToTitle() {
  if (model.status !== 'playing' || !gameClock.paused) return;
  stopFrame(); model.reset(); gameClock.reset(); gameClock.pause();
  screenStatus = 'ready'; familyState = ''; lastHour = -1;
  $('confirm-restart').hidden = true; $('pause-menu').hidden = false;
  $('overlay').hidden = false; $('overlay').classList.remove('ended');
  render(); $('start').focus();
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
$('main-menu').addEventListener('click', returnToTitle);
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

// Этот слой меняет только надписи: не читает часы и не обновляет модель игры.
function updateLocalizedState() {
  $('hearts').setAttribute('aria-label', t('hearts', {count: model.hearts}));
  $('need-text').textContent = model.pending ? t(model.need.text) : t(model.status === 'ready' ? 'world' : 'helping');
  $('message').textContent = t(model.feedback);
  if (model.status === 'ready') {
    $('screen-title').innerHTML = 'Survive<br>till <em>7</em>';
    $('screen-icon').textContent = '☀';
    $('screen-description').textContent = t('intro');
    $('instructions').hidden = false;
    $('start').innerHTML = '<span data-i18n="start">' + t('start') + '</span> <span aria-hidden="true">→</span>';
    document.querySelector('.card-note').textContent = t('startNote');
  } else if (model.status === 'won' || model.status === 'lost') {
    const result = model.status;
    $('screen-title').textContent = t(result + 'Title');
    $('screen-description').textContent = t(result + 'Description', {count: model.hearts});
    $('start').textContent = t('restart');
    document.querySelector('.card-note').textContent = t(result + 'Note');
  }
}
function applyLanguage() {
  document.documentElement.lang = language;
  document.querySelectorAll('[data-i18n]').forEach(element => { element.textContent = t(element.dataset.i18n); });
  document.querySelectorAll('[data-i18n-aria]').forEach(element => { element.setAttribute('aria-label', t(element.dataset.i18nAria)); });
  document.querySelectorAll('[data-i18n-title]').forEach(element => { element.title = t(element.dataset.i18nTitle); });
  document.querySelectorAll('[data-language]').forEach(button => { button.setAttribute('aria-pressed', String(button.dataset.language === language)); });
  updateLocalizedState();
}
function setLanguage(next) {
  if (!Object.hasOwn(TRANSLATIONS, next)) return;
  language = next;
  try { localStorage.setItem(LANGUAGE_KEY, language); } catch { /* Игра работает и без localStorage. */ }
  applyLanguage();
}
document.querySelectorAll('[data-language]').forEach(button => {
  button.addEventListener('click', () => setLanguage(button.dataset.language));
});
applyLanguage();
