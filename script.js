'use strict';
// Вся длительность указана в миллисекундах. Игра полностью автономна.
const HOUR_MS = 6000;
const RESPONSE_MS = 2000;
const TOTAL_HOURS = 12;
const STORY_MS = 5000;
const CAT_RUN_MS = 2800;
const CAT_HIT_MS = 900;
// Централизованные тексты. Модель хранит ключи, а не переведённые сообщения.
const TRANSLATIONS = {
  "ru": {
    "musicOn": "Включить музыку",
    "musicOff": "Выключить музыку",
    "cleanSoil": "Убрать землю",
    "catMess": "Вот это кошачьи проделки! Земля перекрыла путь к раковине.",
    "sinkBlocked": "Сначала убери землю возле горшка!",
    "cleaningSoil": "Малыш в кроватке, мама собирает землю…",
    "soilClean": "Всё чисто! К раковине снова можно пройти.",
    "gameName": "Дожить до 7",
    "storyMorning": "Доброе утро! Ещё минутка вместе ♡",
    "storyKiss": "До вечера, любимая ♡",
    "storyWave": "Хорошего дня!",
    "storyLeave": "Папа уходит на работу…",
    "storyReturn": "Папа вернулся домой!",
    "storyHug": "Вы справились. Теперь все вместе ♡",
    "gameTitleHtml": "Дожить<br>до <em>7</em>",
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
    "start": "Начать игру",
    "startNote": "До семи вечера. Ты справишься ♡",
    "pause": "Пауза",
    "break": "Мама заслужила передышку!",
    "resume": "Продолжить",
    "mainMenu": "Меню",
    "restart": "Начать сначала",
    "confirm": "Начать уровень сначала?",
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
    "helping": "",
    "wonTitle": "19:00. Папа дома!",
    "lostTitle": "Маме нужен отдых",
    "wonDescription": "Вы справились! Малыш передан папе. У мамы осталось сердечек: {count}. Теперь — чай и тишина.",
    "lostDescription": "Все пять нервных клеток устали. Этот день был непростым. Сделаем вдох и попробуем ещё раз?",
    "wonNote": "Даже самый длинный день заканчивается.",
    "lostNote": "Подсказка: следи за пузырём над малышом.",
    "language": "Язык",
    "levels": "Уровни",
    "selectLevel": "Выбор уровня",
    "level1Name": "Новорождённый",
    "level2Name": "Малыш подрос",
    "level1Card": "Уровень 1 — Новорождённый",
    "level2Card": "Уровень 2 — Малыш подрос",
    "level1Description": "Первый день вдвоём. Кормим, моем и укладываем спать.",
    "level2Description": "Малыш стал активнее! Он ещё не сидит и не ходит, но уже тянется к игрушкам. К прежним заботам добавилась игра.",
    "locked": "Пройди первый уровень",
    "available": "Можно играть",
    "back": "В главное меню",
    "nextLevel": "Следующий уровень",
    "needPlay": "Хочу играть!",
    "successPlay": "Погремушка звенит, малыш смеётся — мама тоже!",
    "toys": "Игрушки",
    "playHint": "Поиграть с малышом",
    "wonLevel2": "Ещё один день позади! Малыш наигрался, папа дома. У мамы осталось сердечек: {count}.",
    "unlocked": "Второй уровень открыт! Новое приключение ждёт."
  },
  "en": {
    "musicOn": "Turn music on",
    "musicOff": "Turn music off",
    "cleanSoil": "Sweep up",
    "catMess": "A little cat-astrophe! Soil is blocking the way to the sink.",
    "sinkBlocked": "Sweep up the soil first!",
    "cleaningSoil": "Baby’s safe in the crib. Mom’s sweeping up…",
    "soilClean": "All tidy! The way to the sink is clear.",
    "gameName": "Survive till 7",
    "storyMorning": "Good morning! One more moment together ♡",
    "storyKiss": "See you tonight, love ♡",
    "storyWave": "Have a lovely day!",
    "storyLeave": "Dad’s off to work…",
    "storyReturn": "Dad’s home!",
    "storyHug": "You made it. Together again ♡",
    "gameTitleHtml": "Survive<br>till <em>7</em>",
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
    "start": "Start Game",
    "startNote": "Until seven tonight. You’ve got this ♡",
    "pause": "Paused",
    "break": "Mom deserves a break!",
    "resume": "Resume",
    "mainMenu": "Main Menu",
    "restart": "Restart Level",
    "confirm": "Restart this level?",
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
    "helping": "",
    "wonTitle": "19:00. Dad’s home!",
    "lostTitle": "Mom needs a break",
    "wonDescription": "You made it! Dad’s on baby duty. Mom has {count} hearts left. Time for tea and a little peace.",
    "lostDescription": "All five nerves have clocked out. What a day! Take a breath and give it another go?",
    "wonNote": "Even the longest day comes to an end.",
    "lostNote": "Tip: watch the thought bubble above baby.",
    "language": "Language",
    "levels": "Levels",
    "selectLevel": "Select Level",
    "level1Name": "Newborn",
    "level2Name": "Growing Up",
    "level1Card": "Level 1 — Newborn",
    "level2Card": "Level 2 — Growing Up",
    "level1Description": "Your first day together. Feed, clean up, and settle baby to sleep.",
    "level2Description": "Baby’s getting curious! Still too little to sit or walk, but those tiny hands love reaching for toys. Add playtime to your day!",
    "locked": "Complete Level 1 to unlock",
    "available": "Ready to play",
    "back": "Back to Main Menu",
    "nextLevel": "Next Level",
    "needPlay": "I want to play!",
    "successPlay": "One happy rattle, one giggly baby. Mom wins this round!",
    "toys": "Toys",
    "playHint": "Play with baby",
    "wonLevel2": "Another day done! Baby’s had a lovely play, Dad’s home, and Mom has {count} hearts left.",
    "unlocked": "Level 2 unlocked! A new little adventure awaits."
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

// Уровни используют одну модель и одни таймеры; различаются только содержимым.
const PLAY_NEED = {action: 'play', icon: '🪇', text: 'needPlay', success: 'successPlay'};
const LEVELS = {
  1: {id:1, name:'level1Name', card:'level1Card', description:'level1Description', needs:NEEDS, objects:['wash','feed','sleep'], babyScale:1, seated:'assets/mother-baby-seated.png', crying:'assets/mother-baby-crying.png', baby:'assets/baby.png'},
  2: {id:2, name:'level2Name', card:'level2Card', description:'level2Description', needs:[...NEEDS, PLAY_NEED], objects:['wash','feed','sleep','play'], babyScale:1, seated:'assets/mother-baby-seated.png', crying:'assets/mother-baby-crying.png', baby:'assets/baby.png'}
};
const PROGRESS_KEY = 'surviveTill7.unlockedLevel';
class LevelProgress {
  constructor(storage = null) {
    this.storage = storage; this.unlocked = 1;
    try { if (storage && storage.getItem(PROGRESS_KEY) === '2') this.unlocked = 2; } catch { /* Хранилище недоступно. */ }
  }
  canStart(id) { return Object.hasOwn(LEVELS, id) && Number(id) <= this.unlocked; }
  complete(id) {
    if (Number(id) !== 1 || this.unlocked === 2) return;
    this.unlocked = 2;
    try { if (this.storage) this.storage.setItem(PROGRESS_KEY, '2'); } catch { /* Доступно до закрытия страницы. */ }
  }
}

// Модель отделена от экрана, чтобы правила можно было проверить отдельно.
class GameModel {
  constructor(random = Math.random) { this.random = random; this.levelId = 1; this.reset(); }
  reset() {
    this.status = 'ready'; this.hearts = 5; this.hour = -1; this.elapsed = 0;
    this.pending = false; this.need = null; this.events = 0; this.feedback = 'ready'; this.mood = '';
    this.timeoutApplied = false; this.action = null; this.actionStarted = 0; this.actionEnd = Infinity;
    this.losses = []; this.lastNeedAction = null; this.needStreak = 0;
    this.seenNeeds = new Set();
    this.queuedNeed = null; this.needShownAt = 0; this.dayEnded = false;
    this.catAt = Infinity; this.catState = 'waiting'; this.catStarted = 0;
    this.catHitAt = Infinity; this.catEnd = Infinity; this.dirty = false;
    this.cleaning = false; this.cleanupStarted = 0; this.cleanupEnd = Infinity;
    this.blockedAt = -Infinity;
  }
  start(levelId = this.levelId) {
    if (!Object.hasOwn(LEVELS, levelId)) throw new RangeError('Unknown level');
    this.levelId = Number(levelId); this.reset(); this.status = 'playing'; this.newHour(0);
    if (this.levelId === 2) this.catAt = 2 * HOUR_MS; // 09:00 каждого дня.
  }
  newHour(hour) {
    this.hour = hour; this.events++;
    // После двух повторов выбираем из остальных потребностей без повторного броска.
    const pool = LEVELS[this.levelId].needs;
    const unseen = pool.filter(need => !this.seenNeeds.has(need.action));
    const eligible = this.needStreak >= 2 ? pool.filter(need => need.action !== this.lastNeedAction) : pool;
    // Оставляем случайный выбор, но резервируем последние часы для
    // ещё не встречавшихся действий. В новой партии список очищается.
    const choices = unseen.length >= TOTAL_HOURS - hour ? unseen : eligible;
    const need = choices[Math.floor(this.random() * choices.length)];
    this.seenNeeds.add(need.action);
    this.needStreak = need.action === this.lastNeedAction ? this.needStreak + 1 : 1;
    this.lastNeedAction = need.action;
    if (this.action) { this.queuedNeed = need; return; }
    this.showNeed(need);
  }
  showNeed(need) {
    this.need = need; this.queuedNeed = null;
    this.needShownAt = this.elapsed;
    this.pending = true; this.timeoutApplied = false;
    this.feedback = 'react'; this.mood = '';
  }
  win() {
    this.status = 'won'; this.pending = false; this.need = null; this.queuedNeed = null;
    this.action = null; this.actionEnd = Infinity; this.mood = 'happy';
    this.cleaning = false; this.cleanupEnd = Infinity;
  }
  fail(late) {
    if (this.status !== 'playing' || !this.pending || this.action) return;
    if (late) { if (this.timeoutApplied) return; this.timeoutApplied = true; }
    this.hearts--; this.losses.push({ index: this.hearts, at: this.elapsed }); this.mood = 'crying';
    this.feedback = late ? 'late' : 'wrong';
    if (this.hearts === 0) { this.status = 'lost'; this.action = null; this.actionEnd = Infinity; this.cleaning = false; this.cleanupEnd = Infinity; }
  }
  update(elapsed) {
    if (this.status !== 'playing') return;
    const target = Math.max(this.elapsed, elapsed);
    // Единственная шкала времени. Границы обрабатываются по порядку, без setTimeout.
    while (this.status === 'playing') {
      const hourAt = this.dayEnded ? Infinity : (this.hour + 1) * HOUR_MS;
      const timeoutAt = this.pending && !this.timeoutApplied ? this.needShownAt + RESPONSE_MS : Infinity;
      const catAt = this.levelId === 2 && this.catState === 'waiting' && !this.action ? Math.max(this.elapsed, this.catAt) : Infinity;
      const next = Math.min(hourAt, timeoutAt, this.actionEnd, catAt, this.catHitAt, this.catEnd, this.cleanupEnd);
      if (next > target) { this.elapsed = target; break; }
      this.elapsed = next;
      // На границе часа сохраняем действие; показ новой потребности ждёт его конца.
      if (next === hourAt) {
        if (this.hour + 1 === TOTAL_HOURS) {
          this.dayEnded = true; this.pending = false; this.queuedNeed = null;
          // В 19:00 игровая часть заканчивается ровно на 72-й секунде.
          // После неё UI показывает отдельную вечернюю сцену.
          this.win(); break;
        }
        this.newHour(this.hour + 1);
      } else if (next === timeoutAt) { this.fail(true); }
      else if (next === catAt) {
        this.catState = 'running'; this.catStarted = next;
        this.catHitAt = next + CAT_HIT_MS; this.catEnd = next + CAT_RUN_MS;
      } else if (next === this.catHitAt) {
        this.dirty = true; this.catHitAt = Infinity;
        if (!this.pending) this.feedback = 'catMess';
      } else if (next === this.catEnd) {
        this.catState = 'gone'; this.catEnd = Infinity;
      } else if (next === this.cleanupEnd) {
        this.cleaning = false; this.cleanupEnd = Infinity; this.dirty = false;
        if (!this.pending) { this.feedback = 'soilClean'; this.mood = ''; }
      } else {
        this.action = null; this.actionEnd = Infinity; this.mood = ''; this.feedback = 'calm';
        if (this.dayEnded) this.win();
        else if (this.queuedNeed) this.showNeed(this.queuedNeed);
      }
    }
  }
  answer(action, elapsed) {
    this.update(elapsed);
    if (this.status !== 'playing' || !this.pending || this.action || this.cleaning) return;
    if (!LEVELS[this.levelId].objects.includes(action)) return;
    if (action === 'wash' && this.dirty) { this.blockedAt = this.elapsed; this.feedback = 'sinkBlocked'; return; }
    if (action !== this.need.action) { this.fail(false); return; }
    this.pending = false; this.action = action; this.actionStarted = this.elapsed;
    this.actionEnd = this.elapsed + RESPONSE_MS; this.mood = 'happy'; this.feedback = this.need.success;
  }
  cleanup(elapsed) {
    this.update(elapsed);
    if (this.status !== 'playing' || this.levelId !== 2 || !this.dirty || this.action || this.cleaning) return;
    this.cleaning = true; this.cleanupStarted = this.elapsed; this.cleanupEnd = this.elapsed + RESPONSE_MS;
    this.feedback = 'cleaningSoil';
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
let storage = null;
try { storage = localStorage; } catch { /* Игра работает без хранилища. */ }
const progress = new LevelProgress(storage);
let menuView = 'title';
const buttons = [...document.querySelectorAll('[data-action]')];
let frame = null;
const gameClock = new GameClock();
const storyClock = new GameClock();
let story = null;
let outroCompleted = false;
let generation = 0;
let heartMarkup = '';
let familyState = '';
let lastHour = -1;
let screenStatus = 'ready';
const backgroundMusic = $('background-music');
backgroundMusic.volume = .35;
const MUSIC_KEY = 'surviveTill7.musicEnabled';
let musicEnabled = true;
try { musicEnabled = localStorage.getItem(MUSIC_KEY) !== 'false'; } catch { /* Выбор действует до закрытия страницы. */ }
let musicPlaying = false;
function updateMusicButton() {
  const button = $('music-toggle');
  button.setAttribute('aria-pressed',String(musicEnabled));
  button.setAttribute('aria-label',t(musicEnabled ? 'musicOff' : 'musicOn'));
  button.title = t(musicEnabled ? 'musicOff' : 'musicOn');
  button.querySelector('span').textContent = musicEnabled ? '🔊' : '🔇';
}
function syncMusic(retry = false) {
  const paused = story ? storyClock.paused : model.status === 'playing' && gameClock.paused;
  const playing = musicEnabled && !document.hidden && !paused;
  if (playing === musicPlaying && !(retry === true && playing && backgroundMusic.paused)) return;
  musicPlaying = playing;
  if (playing) {
    // Если автозапуск запрещён, следующее нажатие игрока повторит попытку.
    backgroundMusic.play().catch(() => {});
  } else backgroundMusic.pause();
}
function elapsedNow() { return gameClock.read(); }
function render() {
  if (model.status === 'won' && !story && !outroCompleted) beginStory('outro');
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
  const storyVisible = Boolean(story) || (outroCompleted && model.status === 'won');
  document.querySelector('.game').classList.toggle('is-story', storyVisible);
  if (storyVisible) renderStoryScene(story ? story.kind : 'outro', story ? storyClock.read() : STORY_MS);
  else {
    $('dad').hidden = true;
    document.querySelector('.story-hug-arm').hidden = true;
    document.querySelector('.story-baby-front').hidden = true;
    document.querySelector('.story-affection').hidden = true;
    document.querySelector('.story-standing-smile').style.opacity = 0;
    document.querySelector('.story-rising-legs').style.opacity = 0;
    document.querySelector('.family-standing').style.clipPath = 'none';
    renderScene();
  }
  renderCatEvent(storyVisible);
  $('thought').hidden = model.status !== 'playing' || !model.pending;
  document.querySelector('.game').classList.toggle('is-paused', story ? storyClock.paused : gameClock.paused);
  document.querySelector('.game').classList.toggle('is-stopped', !story && model.status !== 'playing');
  const morning = story?.kind === 'intro';
  $('pause').hidden = !morning && (Boolean(story) || model.status !== 'playing');
  $('pause').disabled = story ? storyClock.paused : gameClock.paused;
  $('pause-overlay').hidden = story ? !(morning && storyClock.paused && story.manualPaused) : !gameClock.paused || model.status !== 'playing';
  $('need-icon').textContent = model.pending ? model.need.icon : '♡';
  $('need-text').textContent = model.pending ? t(model.need.text) : t('helping');
  $('reaction-progress').style.width = model.pending && !model.timeoutApplied ? Math.max(0, 100 * (1 - (model.elapsed - model.needShownAt) / RESPONSE_MS)) + '%' : '0%';
  $('message').textContent = t(model.feedback);
  buttons.forEach(button => {
    const available = LEVELS[model.levelId].objects.includes(button.dataset.action);
    button.hidden = !available;
    button.disabled = Boolean(story) || !available || model.status !== 'playing' || !model.pending || gameClock.paused || model.cleaning;
    if (button.dataset.action === 'wash') button.setAttribute('aria-describedby', model.dirty ? 'clean-soil' : '');
  });
  if (model.status === 'won') progress.complete(model.levelId);
  updateLocalizedState();
  if (!story && model.status !== screenStatus && (model.status === 'won' || model.status === 'lost')) {
    screenStatus = model.status;
    const won = model.status === 'won';
    $('overlay').hidden = false; $('overlay').classList.add('ended');
    $('screen-icon').textContent = won ? '👨' : '☁';
    $('instructions').hidden = true;
    $('start').focus();
  }
  syncMusic();
}

// Визуальная постановка использует ТОЛЬКО существующее игровое время.
// Встать, подойти, выполнить уход, вернуться и сесть — за те же 2000 мс.
// Ни setTimeout, ни новых игровых состояний или изменений баланса здесь нет.
function renderScene() {
  if (model.cleaning) { renderCleanupScene(); return; }
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
  const growing = model.levelId === 2;
  document.querySelector('.growing-care-bottle').style.opacity = 0;
  family.querySelector('.family-playing').style.opacity = 0;
  document.querySelector('.play-baby').style.opacity = 0;
  if (growing && model.action === 'play') { renderPlayScene(); return; }
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
  // Мама остаётся одним и тем же изображением при смене эмоции.
  // Поверх него показываем только плачущее лицо малыша.
  seated.style.opacity = 1 - pose;
  crying.style.opacity = isCrying ? 1 - pose : 0;
  const separate = model.action === 'sleep' || model.action === 'wash';
  standing.style.opacity = separate ? 0 : pose;
  // Для мытья одна цельная поза на всём пути: перекрёстное затухание
  // двух PNG делало тело полупрозрачным в начале и конце ухода.
  const isWashing = model.action === 'wash';
  empty.style.opacity = separate && !isWashing ? pose * (1 - turn) : 0;
  washing.style.opacity = isWashing ? pose : 0;
  back.style.opacity = pose * turn;
  // Компенсация узкого портретного PNG сохраняет размер головы и малыша.
  // Обе позы опираются на одну точку у стоп.
  seated.style.scale = '1 ' + (1 + pose * 0.18);
  crying.style.scale = seated.style.scale;
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
  const inFurniture = (model.action === 'sleep' || model.action === 'wash') && age >= 600 && age < 1520;
  baby.style.left = ((inFurniture ? targetX : heldX) / room.clientWidth * 100) + '%';
  baby.style.top = ((inFurniture ? targetY : heldY) / room.clientHeight * 100) + '%';
  baby.style.width = ((inFurniture ? room.clientWidth * 0.185 : fw * 0.40) * LEVELS[model.levelId].babyScale / room.clientWidth * 100) + '%';
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

function renderCleanupScene() {
  const family = $('family'), room = document.querySelector('.room');
  const age = model.elapsed - model.cleanupStarted;
  const ease = x => { x = Math.max(0, Math.min(1, x)); return x*x*(3-2*x); };
  const travel = ease(age / 350);
  const returning = age >= 1800;
  const fadeOut = 1 - ease((age - 1600) / 200);
  const fadeIn = ease((age - 1800) / 200);
  // Мама справа от земли: её силуэт не закрывает упавший горшок слева.
  family.style.left = (28 + 12 * travel) + '%'; family.style.top = (25 + travel) + '%';
  family.querySelector('.family-visual').style.transform = 'none';
  family.querySelectorAll('.family-visual > img').forEach(img => { img.style.opacity = 0; });
  const mother = family.querySelector('.family-washing');
  mother.style.opacity = returning ? 0 : fadeOut;
  mother.style.transform = 'rotate(' + (-22 * travel) + 'deg) scale(-1.52,' + (1.52 - .22 * travel) + ')';
  if (returning) {
    family.style.left = '28%'; family.style.top = '25%';
    const seated = family.querySelector('.family-seated');
    seated.style.opacity = fadeIn; seated.style.scale = '1'; seated.style.transform = 'none';
    family.querySelector('.family-crying').style.opacity = model.mood === 'crying' ? fadeIn : 0;
  }
  family.querySelector('.care-effects').style.opacity = 0;
  document.querySelector('.play-baby').style.opacity = 0;
  document.querySelector('.growing-care-bottle').style.opacity = 0;
  document.querySelector('.table-bottle').style.opacity = 1;
  const baby = document.querySelector('.independent-baby');
  baby.style.left = '76%'; baby.style.top = '34%'; baby.style.width = '18.5%'; baby.style.opacity = returning ? 0 : fadeOut; baby.style.zIndex = 5;
  baby.dataset.depth = 'inside'; baby.querySelector('img').style.transform = 'rotate(40deg)';
  baby.style.setProperty('--care', 0);
  room.dataset.care = ''; room.style.setProperty('--scene-care', 0);
  $('thought').style.left = '60%';
}

function renderCatEvent(storyVisible) {
  const root = $('cat-event'), room = document.querySelector('.room'), clean = $('clean-soil');
  // Общий горшок для обоих уровней и сюжетных сцен; кошка — только на втором.
  const visible = model.status !== 'ready';
  const interactive = visible && model.levelId === 2 && !storyVisible;
  root.hidden = !visible;
  document.querySelector('.plant-patch').toggleAttribute('hidden', !visible);
  room.dataset.cleaning = String(interactive && model.cleaning);
  room.dataset.cleanupCrying = String(model.cleaning && model.mood === 'crying');
  document.querySelectorAll('.cleanup-tears i').forEach((tear, i) => {
    const phase = ((model.elapsed / 650) + i * .5) % 1;
    tear.style.opacity = 1 - phase;
    tear.style.transform = 'translateY(' + (phase * 12) + 'px) rotate(25deg)';
  });
  clean.hidden = !interactive || !model.dirty || model.status !== 'playing';
  clean.disabled = gameClock.paused || Boolean(model.action) || model.cleaning;
  clean.style.transform = model.elapsed - model.blockedAt < 1200 ? 'scale(' + (1 + .13 * Math.sin((model.elapsed - model.blockedAt) / 90) ** 2) + ')' : 'none';
  const age = model.elapsed - model.catStarted;
  const cat = document.querySelector('.event-cat');
  cat.hidden = !interactive || model.catState !== 'running' || model.status !== 'playing';
  // Сначала спускаемся слева от мамы, затем пересекаем пол ниже её ног.
  const path = [[0,-36,43],[CAT_HIT_MS,12.2,43],[1300,16,72],[2300,82,72],[CAT_RUN_MS,114,50]];
  const segment = path.findIndex((point,i) => i < path.length-1 && age <= path[i+1][0]);
  const index = segment < 0 ? path.length-2 : segment;
  const from = path[index], to = path[index+1];
  const step = Math.max(0,Math.min(1,(age-from[0])/(to[0]-from[0])));
  const blend = step*step*(3-2*step);
  cat.style.left = (from[1]+(to[1]-from[1])*blend)+'%';
  cat.style.top = (from[2]+(to[2]-from[2])*blend)+'%';
  cat.style.transform = 'translateY(' + (Math.sin(age / 100) * 3) + 'px) rotate(' + (Math.sin(age / 130) * 3) + 'deg)';
  const fall = model.dirty && !storyVisible ? Math.max(0, Math.min(1, (age - CAT_HIT_MS) / 600)) : 0;
  const cleanupAge = model.elapsed - model.cleanupStarted;
  const collected = model.cleaning ? Math.max(0, Math.min(1, (cleanupAge - 450) / 1150)) : 0;
  const restore = model.cleaning ? Math.max(0, Math.min(1, (cleanupAge - 1600) / 400)) : 0;
  const restoreEase = restore * restore * (3 - 2 * restore);
  root.querySelector('.event-plant').style.transform = 'rotate(' + (-fall * 78 * (1-restoreEase)) + 'deg)';
  const soil = root.querySelector('.spilled-soil');
  soil.style.opacity = model.dirty ? fall * (1 - collected) : 0;
  soil.style.transformOrigin = model.cleaning ? '95% 65%' : '20% 60%';
  soil.style.transform = 'scale(' + ((.2 + .8 * fall) * (1 - collected * .7)) + ')';
  const tools = document.querySelector('.cleaning-tools');
  tools.toggleAttribute('hidden', !interactive || !model.cleaning);
  const sweeping = cleanupAge >= 350 && cleanupAge < 1650;
  tools.style.opacity = sweeping ? Math.max(0,Math.min(1,(1650-cleanupAge)/150)) : 0;
  // Совок остаётся у земли; только щётка сгребает землю в его сторону.
  const sweep = sweeping ? (1 - Math.cos((cleanupAge - 350) / 210 * Math.PI * 2)) / 2 : 0;
  tools.querySelector('.cleanup-brush').setAttribute('transform', 'translate(' + (sweep * 38) + ',0) rotate(' + (-8 + sweep * 12) + ' 60 13)');
  tools.querySelector('.pan-soil').style.opacity = collected;
}



// Единственная шкала времени также управляет новым двухсекундным действием.
function renderPlayScene() {
  const family = $('family'), room = document.querySelector('.illustrated-room');
  const baby = document.querySelector('.play-baby');
  const age = Math.max(0, Math.min(RESPONSE_MS, model.elapsed - model.actionStarted));
  const ease = x => { x = Math.max(0, Math.min(1, x)); return x*x*(3-2*x); };
  const pose = ease(age / 180) * (1 - ease((age - 1820) / 180));
  const travel = ease((age - 180) / 320) * (1 - ease((age - 1700) / 120));
  const lower = ease((age - 500) / 180) * (1 - ease((age - 1500) / 200));
  const engage = ease((age - 350) / 150) * (1 - ease((age - 1500) / 150));
  family.style.left = (28 + travel) + '%';
  family.style.top = (25 + 9 * travel) + '%';
  family.querySelector('.family-visual').style.transform = 'none';
  family.querySelector('.family-seated').style.opacity = 1 - pose;
  family.querySelector('.family-seated').style.scale = '1 ' + (1 + pose * 0.18);
  const standing = family.querySelector('.family-standing');
  standing.style.opacity = pose * (1 - lower);
  standing.style.transform = 'translateY(' + ((1 - pose) * 18) + '%) scale(1.52, ' + (1.14 + pose * 0.38) + ')';
  ['.family-empty','.family-back','.family-washing','.family-crying'].forEach(selector => {family.querySelector(selector).style.opacity=0});
  const mother = family.querySelector('.family-playing');
  mother.style.opacity = lower;
  mother.style.scale = '1.18';
  mother.style.transform = 'rotate(' + Math.sin(age / 110) * engage * 1.5 + 'deg)';
  baby.style.left = (51 + 19 * lower) + '%';
  baby.style.top = (36 + 18 * lower) + '%';
  baby.style.width = (18.4 + 5.1 * lower) + '%';
  baby.style.opacity = lower;
  baby.style.transform = 'rotate(' + (-20 * (1-lower) + Math.sin(age/95)*engage*1.2) + 'deg)';
  room.dataset.care = 'play';
  room.style.setProperty('--scene-age', -age+'ms');
  room.style.setProperty('--scene-care', engage);
  document.querySelector('.independent-baby').style.opacity = 0;
  family.querySelector('.care-effects').style.opacity = 0;
  document.querySelector('.table-bottle').style.opacity = 1;
  $('thought').style.left = '30%';
}

function applyLevelAppearance() {
  const config = LEVELS[model.levelId];
  const room = document.querySelector('.illustrated-room');
  room.dataset.level = model.levelId;
  document.querySelector('.family-seated').setAttribute('src', config.seated);
  document.querySelector('.family-crying').setAttribute('src', config.crying);
  document.querySelector('.independent-baby > img').setAttribute('src', config.baby);
  document.querySelector('.toys-target').hidden = model.levelId !== 2;
}
function updateLevelCards() {
  const unlocked = progress.canStart(2);
  $('choose-level-2').disabled = !unlocked;
  $('choose-level-2').setAttribute('aria-label', t('level2Card') + '. ' + t(unlocked ? 'available' : 'locked'));
  $('level2-lock').textContent = t(unlocked ? 'available' : 'locked');
  $('level2-icon').textContent = unlocked ? '2' : '🔒';
}
function openLevels() {
  if (story || model.status === 'playing') return;
  stopFrame(); gameClock.pause(); menuView = 'levels';
  $('overlay').hidden = true; $('levels-overlay').hidden = false;
  updateLevelCards(); $('choose-level-1').focus();
}

function schedule() {
  if (frame !== null || (story ? storyClock.paused : model.status !== 'playing' || gameClock.paused)) return;
  const currentGeneration = generation;
  frame = requestAnimationFrame(() => {
    if (currentGeneration !== generation) return;
    frame = null; tick();
  });
}
function tick() {
  if (story) {
    if (storyClock.paused) return;
    if (storyClock.read() >= STORY_MS) {
      const kind = story.kind; story = null; storyClock.pause();
      if (kind === 'intro') { startGameplay(model.levelId); return; }
      outroCompleted = true;
    }
    render(); schedule(); return;
  }
  if (model.status !== 'playing' || gameClock.paused) return;
  model.update(elapsedNow()); render(); schedule();
}
function stopFrame() { generation++; if (frame !== null) cancelAnimationFrame(frame); frame = null; }
function beginStory(kind) {
  stopFrame(); gameClock.pause(); story = {kind}; storyClock.reset();
  if (kind === 'outro') gameClock.elapsed = TOTAL_HOURS * HOUR_MS;
  $('overlay').hidden = true; $('pause-overlay').hidden = true;
  if (document.hidden || !document.hasFocus()) storyClock.pause();
  schedule();
}
function start(levelId = model.levelId) {
  levelId = Number(levelId);
  if (!progress.canStart(levelId)) return false;
  stopFrame(); story = null; outroCompleted = false; menuView = 'title';
  model.levelId = levelId; model.reset(); model.status = 'intro';
  gameClock.reset(); gameClock.pause(); applyLevelAppearance();
  screenStatus = 'intro'; familyState = ''; lastHour = -1;
  $('levels-overlay').hidden = true; $('overlay').classList.remove('ended');
  $('confirm-restart').hidden = true; $('pause-menu').hidden = false;
  beginStory('intro'); render();
}
function pauseStory(manual = false) {
  if (!story || storyClock.paused) return;
  if (manual === true) {
    story.manualPaused = true;
    $('confirm-restart').hidden = true; $('pause-menu').hidden = false;
  }
  storyClock.pause(); stopFrame(); render();
  if (manual === true && story.kind === 'intro') $('resume').focus();
}
function resumeStory(manual = false) {
  if (!story || !storyClock.paused || document.hidden || !document.hasFocus()) return;
  if (story.manualPaused && manual !== true) return;
  story.manualPaused = false;
  storyClock.resume(); render(); schedule();
}
function storyFeedback(kind, age) {
  age *= 4000 / STORY_MS;
  return kind === 'outro' ? (age < 1700 ? 'storyReturn' : 'storyHug') :
    age < 450 ? 'storyMorning' : age < 1600 ? 'storyKiss' : age < 2700 ? 'storyWave' : 'storyLeave';
}
function renderStoryScene(kind, elapsed) {
  const age = Math.min(STORY_MS, elapsed) * 4000 / STORY_MS;
  const ease = x => {x = Math.max(0, Math.min(1, x)); return x*x*(3-2*x);};
  const family = $('family'), room = document.querySelector('.room'), dad = $('dad');
  // Смена позы выполняется затуханием ниже; стоячий силуэт не деформируется.
  const rise = 1;
  family.style.left = (28 + 12 * rise) + '%'; family.style.top = '25%';
  family.querySelector('.family-visual').style.transform = 'none';
  family.querySelectorAll('.family-visual > img').forEach(img => {img.style.opacity = 0;});
  const mother = family.querySelector('.family-standing');
  const seated = family.querySelector('.family-seated');
  seated.style.opacity = 0; seated.style.scale = '1';
  // Выпрямляем ноги у пола, поднимая верх тела без изменения размера головы.
  const legScale = .55 + .97 * rise;
  const lift = (1.52 - legScale) * .36 * family.clientHeight;
  const upperTransform = 'translateY(' + lift + 'px) scale(-1.52, 1.52)';
  mother.style.opacity = 1; mother.style.scale = '1'; mother.style.transform = upperTransform;
  mother.style.clipPath = rise < 1 ? 'inset(0 0 40% 0)' : 'none';
  const legs = family.querySelector('.story-rising-legs');
  legs.style.opacity = rise < 1 ? 1 : 0;
  legs.style.transform = 'scale(-1.52,' + legScale + ')';
  family.querySelector('.care-effects').style.opacity = 0;
  document.querySelector('.independent-baby').style.opacity = 0;
  document.querySelector('.play-baby').style.opacity = 0;
  document.querySelector('.table-bottle').style.opacity = 1;
  room.dataset.care = ''; room.style.setProperty('--scene-care', 0);
  const pose = {standing:0,kiss:0,wave:0,back:0,hug:0};
  let left = 16, bob = 0, wave = 0, affection = 0, smile = 1;
  if (kind === 'intro') {
    const kiss = ease((age - 350) / 600), goodbye = ease((age - 1500) / 400), turn = ease((age - 2600) / 300);
    pose.standing = 1 - kiss; pose.kiss = kiss * (1 - goodbye);
    pose.wave = goodbye * (1 - turn); pose.back = turn;
    left -= 4 * pose.kiss + 80 * ease((age - 2900) / 1100);
    wave = Math.sin(age / 90) * pose.wave * 1.2;
    bob = age > 2900 ? Math.sin(age / 85) * turn * 1.5 : 0;
    affection = ease((age - 850) / 150) * (1 - ease((age - 1350) / 250));
  } else {
    const enter = ease(age / 1300), hug = ease((age - 1300) / 700);
    pose.standing = 1 - hug; pose.hug = hug;
    left = -64 + 82 * enter;
    bob = Math.sin(age / 85) * (1 - enter) * 1.5;
    affection = ease((age - 1750) / 450);
  }
  dad.hidden = false; dad.style.left = left + '%';
  dad.style.transform = 'translateY(' + bob + 'px) rotate(' + wave + 'deg)';
  dad.querySelectorAll('[data-dad-pose]').forEach(img => {img.style.opacity = pose[img.dataset.dadPose];});
  const arm = document.querySelector('.story-hug-arm'); arm.hidden = kind !== 'outro';
  arm.style.left = left + '%'; arm.style.opacity = pose.hug;
  arm.style.transform = dad.style.transform;
  const babySmile = document.querySelector('.story-standing-smile');
  babySmile.style.opacity = smile; babySmile.style.transform = upperTransform;
  const babyFront = document.querySelector('.story-baby-front');
  babyFront.hidden = false; babyFront.style.left = family.style.left; babyFront.style.opacity = 1;
  babyFront.querySelector('img').style.transform = upperTransform;
  if (kind === 'outro') {
    const standingPose = age >= 850;
    const visibility = standingPose ? ease((age - 850) / 400) : 1 - ease((age - 450) / 400);
    mother.style.opacity = standingPose ? visibility : 0;
    babySmile.style.opacity = standingPose ? visibility : 0;
    babyFront.style.opacity = standingPose ? visibility : 0;
    if (!standingPose) {
      family.style.left = '28%';
      seated.style.opacity = visibility;
      seated.style.transform = 'none';
    }
  }
  // В конце утра меняем позу только в невидимой середине телепортации.
  // Обе половины используют сюжетные часы, поэтому замерзают вместе со сценой.
  if (kind === 'intro' && age >= 3280) {
    const seatedPose = age >= 3640;
    const visibility = seatedPose ? ease((age - 3640) / 360) : 1 - ease((age - 3280) / 360);
    mother.style.opacity = seatedPose ? 0 : visibility;
    babySmile.style.opacity = seatedPose ? 0 : visibility;
    babyFront.style.opacity = seatedPose ? 0 : visibility;
    legs.style.opacity = 0;
    if (seatedPose) {
      family.style.left = '28%';
      seated.style.opacity = visibility;
      seated.style.transform = 'none';
    }
  }
  const heart = document.querySelector('.story-affection'); heart.hidden = false;
  heart.style.opacity = affection; heart.style.transform = 'translateY(' + (-4 * Math.sin(age / 400)) + 'px)';
}
function startGameplay(levelId = model.levelId) {
  levelId = Number(levelId);
  if (!progress.canStart(levelId)) return false;
  menuView = 'title';
  $('levels-overlay').hidden = true;
  stopFrame(); story = null; storyClock.pause(); outroCompleted = false;
  gameClock.reset(); screenStatus = 'playing'; familyState = ''; lastHour = -1;
  model.start(levelId); applyLevelAppearance(); $('overlay').hidden = true; $('overlay').classList.remove('ended');
  $('confirm-restart').hidden = true; $('pause-menu').hidden = false;
  // Новая партия также начинает визуальные анимации с начала.
  document.querySelectorAll('.family, .family *').forEach(element => {
    element.getAnimations().forEach(animation => { animation.currentTime = 0; });
  });
  render();
  if (document.hidden || !document.hasFocus()) pause(); else schedule();
}
function pause(manual = false) {
  if (story) { pauseStory(manual === true); return; }
  if (model.status !== 'playing' || gameClock.paused) return;
  gameClock.pause(); model.update(elapsedNow()); stopFrame();
  $('confirm-restart').hidden = true; $('pause-menu').hidden = false; render();
  if (model.status === 'playing') $('resume').focus();
}
function returnToTitle() {
  if (model.status === 'playing' && !gameClock.paused) return;
  menuView = 'title'; $('levels-overlay').hidden = true;
  stopFrame(); story = null; storyClock.pause(); outroCompleted = false;
  model.levelId = 1; model.reset(); applyLevelAppearance(); gameClock.reset(); gameClock.pause();
  screenStatus = 'ready'; familyState = ''; lastHour = -1;
  $('confirm-restart').hidden = true; $('pause-menu').hidden = false;
  $('overlay').hidden = false; $('overlay').classList.remove('ended');
  render(); $('start').focus();
}
function resume() {
  if (story?.kind === 'intro') {
    if (!$('confirm-restart').hidden) return;
    resumeStory(true); $('pause').focus(); return;
  }
  if (model.status !== 'playing' || !gameClock.paused || document.hidden || !$('confirm-restart').hidden) return;
  gameClock.resume(); render(); schedule(); $('pause').focus();
}
buttons.forEach(button => button.addEventListener('click', () => {
  if (gameClock.paused || model.status !== 'playing') return;
  model.answer(button.dataset.action, elapsedNow()); render();
}));
$('clean-soil').addEventListener('click', () => {
  if (gameClock.paused || model.status !== 'playing' || story) return;
  model.cleanup(elapsedNow()); render();
});
$('start').addEventListener('click', () => start(model.status === 'ready' ? 1 : model.levelId));
$('open-levels').addEventListener('click', openLevels);
$('levels-back').addEventListener('click', returnToTitle);
$('result-menu').addEventListener('click', returnToTitle);
$('choose-level-1').addEventListener('click', () => start(1));
$('choose-level-2').addEventListener('click', () => start(2));
$('next-level').addEventListener('click', () => { if (model.status === 'won' && model.levelId === 1) start(2); });
$('pause').addEventListener('click', () => pause(true));
$('resume').addEventListener('click', resume);
$('main-menu').addEventListener('click', returnToTitle);
$('restart').addEventListener('click', () => {
  if (story ? !(story.kind === 'intro' && storyClock.paused) : !gameClock.paused || model.status !== 'playing') return;
  $('pause-menu').hidden = true; $('confirm-restart').hidden = false; $('cancel-restart').focus();
});
$('cancel-restart').addEventListener('click', () => {
  $('confirm-restart').hidden = true; $('pause-menu').hidden = false; $('restart').focus();
});
$('confirm-start').addEventListener('click', () => {
  if ((story ? story.kind === 'intro' && storyClock.paused : gameClock.paused && model.status === 'playing') && !$('confirm-restart').hidden) start();
});
document.addEventListener('visibilitychange', () => { if (document.hidden) pause(); else resumeStory(); syncMusic(); });
window.addEventListener('blur', pause);
window.addEventListener('pagehide', pause);
window.addEventListener('focus', resumeStory);
document.addEventListener('keydown', event => {
  if (event.key !== 'Escape' || (model.status !== 'playing' && story?.kind !== 'intro')) return;
  if (!(story ? storyClock.paused : gameClock.paused)) pause(true);
  else if (!$('confirm-restart').hidden) $('cancel-restart').click();
  else resume();
});

// Этот слой меняет только надписи: не читает часы и не обновляет модель игры.
function updateLocalizedState() {
  $('hearts').setAttribute('aria-label', t('hearts', {count: model.hearts}));
  $('need-text').textContent = model.pending ? t(model.need.text) : t(model.status === 'ready' ? 'world' : 'helping');
  $('message').textContent = t(model.feedback);
  const ended = model.status === 'won' || model.status === 'lost';
  $('next-level').hidden = !(model.status === 'won' && model.levelId === 1);
  $('result-menu').hidden = !ended;
  $('level-indicator').textContent = t(LEVELS[model.levelId].name);
  updateLevelCards();
  if (model.status === 'ready') {
    $('screen-title').innerHTML = t('gameTitleHtml');
    $('screen-icon').textContent = '☀';
    $('screen-description').textContent = t('intro');
    $('instructions').hidden = false;
    $('start').innerHTML = '<span data-i18n="start">' + t('start') + '</span> <span aria-hidden="true">→</span>';
    document.querySelector('.card-note').textContent = t('startNote');
  } else if (model.status === 'won' || model.status === 'lost') {
    const result = model.status;
    $('screen-title').textContent = t(result + 'Title');
    $('screen-description').textContent = t(result === 'won' && model.levelId === 2 ? 'wonLevel2' : result + 'Description', {count: model.hearts});
    $('start').textContent = t('restart');
    document.querySelector('.card-note').textContent = t(result === 'won' && model.levelId === 1 ? 'unlocked' : result + 'Note');
  }
  if (story) $('message').textContent = t(storyFeedback(story.kind, storyClock.read()));
}
function applyLanguage() {
  document.documentElement.lang = language;
  document.title = t('gameName');
  document.querySelectorAll('[data-i18n]').forEach(element => { element.textContent = t(element.dataset.i18n); });
  document.querySelectorAll('[data-i18n-aria]').forEach(element => { element.setAttribute('aria-label', t(element.dataset.i18nAria)); });
  document.querySelectorAll('[data-i18n-title]').forEach(element => { element.title = t(element.dataset.i18nTitle); });
  document.querySelectorAll('[data-language]').forEach(button => { button.setAttribute('aria-pressed', String(button.dataset.language === language)); });
  updateLocalizedState();
  updateMusicButton();
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
$('music-toggle').addEventListener('click', () => {
  musicEnabled = !musicEnabled;
  try { localStorage.setItem(MUSIC_KEY,String(musicEnabled)); } catch { /* Хранилище может быть отключено. */ }
  updateMusicButton(); syncMusic(true);
});
document.addEventListener('click', event => { if (event.isTrusted) syncMusic(true); });
document.addEventListener('keydown', event => { if (event.isTrusted && (event.key === 'Enter' || event.key === ' ')) syncMusic(true); });
applyLanguage();

applyLevelAppearance();
syncMusic();
