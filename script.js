'use strict';
// Вся длительность указана в миллисекундах. Игра полностью автономна.
const HOUR_MS = 6000;
const RESPONSE_MS = 2000;
const EXPLORER_WASH_MS = 2750; // Перенос 850 мс, мытьё 1000 мс, на ручки 400 мс, на пол 500 мс.
const EXPLORER_SLEEP_MS = 3500; // Укладывание и плавное возвращение малыша из кроватки.
const TABLE_CAT_AT=49000,TABLE_CAT_HIT_MS=1000,TABLE_CAT_RUN_MS=2400;
const TOTAL_HOURS = 12;
const STORY_MS = 5000;
const CAT_RUN_MS = 2800;
const CAT_HIT_MS = 900;
// Малыш лежит на верхней плоскости матраса, за передними перекладинами.
const CRIB_BABY = {x: .77, y: .29, width: .185};
const EXPLORER_BABY_SCALE = 1.25;
const EXPLORER_START = {x:.8,y:.7};
const EXPLORER_WASH_LANDING = {x:.3,y:.6};
const EXPLORER_SLEEP_LANDING = {x:.84,y:.68};
function cabinetDoorAngle(age){
  const t=Math.max(0,age);
  if(t<400){const p=t/400;return 46*p*p*(3-2*p);}
  // Мягкое покачивание после открытия, с замедлением у крайних положений.
  return 46-6*(1-Math.cos((t-400)/1000*Math.PI*2));
}
// Централизованные тексты. Модель хранит ключи, а не переведённые сообщения.
const TRANSLATIONS = {
  "ru": {
    "level3Name": "Ни секунды покоя!",
    "level3Card": "Уровень 3 — Ни секунды покоя!",
    "level3Description": "Малыш ползает, исследует шкафчик и просится на ручки. Только успевай!",
    "locked3": "Пройди второй уровень",
    "needHold": "На ручки!",
    "pinchedFinger": "Ай, больно!",
    "comfortBaby": "Успокой малыша!",
    "successHold": "У мамы на ручках всё хорошо ♡",
    "successComfort": "Обняли, покачали — слёзки высохли ♡",
    "exploring": "Маленький исследователь изучает комнату.",
    "cabinetPlay": "Ох уж эта интересная дверца…",
    "blocksPlay": "Строим башенку!",
    "blocksFell": "Башенка упала!",
    "coffeeEmpty": "Кружка пуста",
    "coffee": "Выпить кофе · +1 сердечко",
    "drinkingCoffee": "Маленький глоток для маминых нервов…",
    "coffeeRestored": "Кофе помог! +1 сердечко ♡",
    "wonLevel3": "Ни секунды покоя — но вы справились! Папа дома. Осталось сердечек: {count}.",
    "unlocked3": "Третий уровень открыт! Малыша ждут новые открытия.",
    "musicOn": "Включить музыку",
    "musicOff": "Выключить музыку",
    "cleanSoil": "Убрать землю",
    "catMess": "Вот это кошачьи проделки! Земля перекрыла путь к раковине.",
    "sinkBlocked": "Сначала убери землю возле горшка!",
    "tableBlocked": "Сначала вытри молоко со стола!",
    "catOnTable": "Кошка на столе! Сейчас убежит…",
    "wipeTable": "Вытереть стол",
    "wipingTable": "Мама вытирает пролитое молоко…",
    "tableClean": "Стол чистый! Можно кормить малыша.",
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
    "stillCrying": "Малыш всё ещё плачет. −1 сердечко. Помоги ему!",
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
    "level3Name": "Not a Moment's Peace!",
    "level3Card": "Level 3 — Not a Moment's Peace!",
    "level3Description": "Baby crawls, explores the cupboard, and asks for cuddles. Keep up, Mom!",
    "locked3": "Complete Level 2 to unlock",
    "needHold": "Pick me up!",
    "pinchedFinger": "Ouch, that hurts!",
    "comfortBaby": "Comfort the baby!",
    "successHold": "Mom's arms make everything better ♡",
    "successComfort": "A cuddle, a gentle rock… all better ♡",
    "exploring": "Your little explorer is discovering the room.",
    "cabinetPlay": "That cupboard door is very interesting…",
    "blocksPlay": "Let's build a tower!",
    "blocksFell": "My tower fell down!",
    "coffeeEmpty": "The mug is empty",
    "coffee": "Have some coffee · +1 heart",
    "drinkingCoffee": "A little sip for Mom's nerves…",
    "coffeeRestored": "Coffee to the rescue! +1 heart ♡",
    "wonLevel3": "Not a moment's peace, but you made it! Dad's home. Mom has {count} hearts left.",
    "unlocked3": "Level 3 unlocked! More little adventures await.",
    "musicOn": "Turn music on",
    "musicOff": "Turn music off",
    "cleanSoil": "Sweep up",
    "catMess": "A little cat-astrophe! Soil is blocking the way to the sink.",
    "sinkBlocked": "Sweep up the soil first!",
    "tableBlocked": "Wipe up the milk first!",
    "catOnTable": "Cat on the table! She’ll be off in a moment…",
    "wipeTable": "Wipe the table",
    "wipingTable": "Mom’s wiping up the spilled milk…",
    "tableClean": "All clean! Baby’s bottle is ready.",
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
    "stillCrying": "Baby is still crying. −1 heart. Help them out!",
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
const HOLD_NEED = {action:'hold',icon:'♡',text:'needHold',success:'successHold'};
const COMFORT_NEED = {action:'comfort',icon:'🩹',text:'pinchedFinger',success:'successComfort'};
const BLOCKS_COMFORT_NEED = {action:'comfort',icon:'🧸',text:'blocksFell',success:'successComfort'};
const LEVELS = {
  1: {id:1, name:'level1Name', card:'level1Card', description:'level1Description', needs:NEEDS, objects:['wash','feed','sleep'], babyScale:1, seated:'assets/mother-baby-seated.png', crying:'assets/mother-baby-crying.png', baby:'assets/baby.png'},
  2: {id:2, name:'level2Name', card:'level2Card', description:'level2Description', needs:[...NEEDS, PLAY_NEED], objects:['wash','feed','sleep','play'], babyScale:1, seated:'assets/mother-baby-seated.png', crying:'assets/mother-baby-crying.png', baby:'assets/baby.png'},
  3: {id:3,name:'level3Name',card:'level3Card',description:'level3Description',needs:[...NEEDS,HOLD_NEED],objects:['wash','feed','sleep','hold','comfort'],babyScale:1,seated:'assets/mother-baby-seated.png',crying:'assets/mother-baby-crying.png',baby:'assets/baby.png'}
};
const PROGRESS_KEY = 'surviveTill7.unlockedLevel';
class LevelProgress {
  constructor(storage = null) {
    this.storage = storage; this.unlocked = 1;
    try { const saved=Number(storage?.getItem(PROGRESS_KEY));if(saved===2||saved===3)this.unlocked=saved; } catch { /* Хранилище недоступно. */ }
  }
  canStart(id) { return Object.hasOwn(LEVELS, id) && Number(id) <= this.unlocked; }
  complete(id) {
    if(!this.canStart(id))return;
    const next=Number(id)+1;
    if (!LEVELS[next] || next<=this.unlocked) return;
    this.unlocked = next;
    try { if (this.storage) this.storage.setItem(PROGRESS_KEY, String(next)); } catch { /* Доступно до закрытия страницы. */ }
  }
}

// Модель отделена от экрана, чтобы правила можно было проверить отдельно.
class GameModel {
  constructor(random = Math.random) { this.random = random; this.levelId = 1; this.reset(); }
  reset() {
    this.status = 'ready'; this.hearts = 5; this.hour = -1; this.elapsed = 0;
    this.pending = false; this.need = null; this.events = 0; this.feedback = 'ready'; this.mood = '';
    this.cryPenaltyAt = Infinity;
    this.timeoutApplied = false; this.action = null; this.actionStarted = 0; this.actionEnd = Infinity;
    this.losses = []; this.lastNeedAction = null; this.needStreak = 0;
    this.seenNeeds = new Set();
    this.queuedNeed = null; this.needShownAt = 0; this.dayEnded = false;
    this.catAt = Infinity; this.catState = 'waiting'; this.catStarted = 0;
    this.catHitAt = Infinity; this.catEnd = Infinity; this.dirty = false;
    this.cleaning = false; this.cleanupStarted = 0; this.cleanupEnd = Infinity;
    this.blockedAt = -Infinity;
    this.tableCatAt=Infinity;this.tableCatState='waiting';this.tableCatStarted=0;
    this.tableHitAt=Infinity;this.tableCatEnd=Infinity;this.tableDirty=false;this.tableBlockedAt=-Infinity;this.tableCatFromFloor=false;
    this.cleanupKind='soil';this.coffeeDrinks=0;
    this.explorer = null;
  }
  start(levelId = this.levelId) {
    if (!Object.hasOwn(LEVELS, levelId)) throw new RangeError('Unknown level');
    this.levelId = Number(levelId); this.reset(); this.status = 'playing';
    if(this.levelId>=2)this.tableCatAt=TABLE_CAT_AT;
    if(this.levelId===3){this.hour=0;this.feedback='exploring';this.explorer=new ExplorerDay(this.random);this.catAt=12000+this.random()*(TABLE_CAT_AT-HOUR_MS-CAT_RUN_MS-12000);return;}
    this.newHour(0);
    if (this.levelId === 1) this.catAt = 50000; // 15:20 каждого дня.
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
    if (this.action || this.pending) { this.queuedNeed = need; return; }
    this.showNeed(need);
  }
  showNeed(need) {
    this.need = need; this.queuedNeed = null;
    this.needShownAt = this.elapsed;
    this.pending = true; this.timeoutApplied = false; this.cryPenaltyAt = Infinity;
    this.feedback = 'react'; this.mood = '';
  }
  win() {
    if(this.explorer)this.explorer.storyPosition=this.explorer.sample(this.elapsed);
    this.status = 'won'; this.pending = false; this.need = null; this.queuedNeed = null;
    this.action = null; this.actionEnd = Infinity; this.mood = 'happy';
    this.cleaning = false; this.cleanupEnd = Infinity;
  }
  endDay(target) {
    this.dayEnded=true;this.pending=false;this.need=null;this.queuedNeed=null;
    if(this.explorer){
      const e=this.explorer;e.settle(this.elapsed);e.closeDoor(this.elapsed);e.waiting=[];
      if(!['blocksPlay','blocksReturn'].includes(e.state)){e.end=Infinity;if(!this.action)e.state='sit';}
    }
    this.finishDay(target);
  }
  finishDay(target) {
    // Часы уже показывают 19:00. Эта шкала нужна только для завершения анимаций.
    while(this.status==='playing'){
      const e=this.explorer,doorEnd=e&&e.closingAngle>0&&e.closingAt+200>this.elapsed?e.closingAt+200:Infinity;
      const blocksEnd=e&&['blocksPlay','blocksReturn'].includes(e.state)?e.end:Infinity;
      const next=Math.min(this.actionEnd,this.cleanupEnd,this.catHitAt,this.catEnd,doorEnd,this.tableHitAt,this.tableCatEnd,blocksEnd);
      if(next===Infinity){this.win();return;}
      if(next>target){this.elapsed=target;return;}
      this.elapsed=next;
      if(next===blocksEnd){
        if(e.state==='blocksPlay'){e.state='blocksReturn';e.blocksReturnAt=next;e.end=next+900;}
        else{e.state='sit';e.end=Infinity;}
      }
      if(next===this.actionEnd){
        if(e){
          if(this.action==='wash')e.position={...EXPLORER_WASH_LANDING};
          if(this.action==='sleep')e.position={...EXPLORER_SLEEP_LANDING};
          e.state='sit';
        }
        this.action=null;this.actionEnd=Infinity;this.mood='';this.feedback='calm';
      }
      if(next===this.cleanupEnd)this.completeCleanup();
      this.handleTableEvent(next);
      if(next===this.catHitAt){this.dirty=true;this.catHitAt=Infinity;}
      if(next===this.catEnd){this.catState='gone';this.catEnd=Infinity;}
    }
  }
  fail(late, repeated = false) {
    if (this.status !== 'playing' || !this.pending || this.action) return;
    if (late) { if (this.timeoutApplied) return; this.timeoutApplied = true; }
    if(this.cryPenaltyAt===Infinity)this.cryPenaltyAt=this.elapsed+HOUR_MS;
    this.hearts--; this.losses.push({ index: this.hearts, at: this.elapsed }); this.mood = 'crying';
    this.feedback = repeated ? 'stillCrying' : late ? 'late' : 'wrong';
    if (this.hearts === 0) { this.status = 'lost'; this.action = null; this.actionEnd = Infinity; this.cleaning = false; this.cleanupEnd = Infinity; }
  }
  repeatCryPenalty() {
    this.cryPenaltyAt += HOUR_MS;
    this.fail(false, true);
  }
  update(elapsed) {
    if (this.levelId===3 && this.explorer) { this.explorer.update(elapsed,this); return; }
    if (this.status !== 'playing') return;
    const target = Math.max(this.elapsed, elapsed);
    if(this.dayEnded){this.finishDay(target);return;}
    // Единственная шкала времени. Границы обрабатываются по порядку, без setTimeout.
    while (this.status === 'playing') {
      const hourAt = this.dayEnded ? Infinity : (this.hour + 1) * HOUR_MS;
      const timeoutAt = this.pending && !this.timeoutApplied ? this.needShownAt + RESPONSE_MS : Infinity;
      const catAt = this.catState === 'waiting' && (this.levelId===1||!this.action) ? Math.max(this.elapsed, this.catAt) : Infinity;
      const cryAt=this.pending&&this.mood==='crying'?this.cryPenaltyAt:Infinity;
      const next = Math.min(hourAt, timeoutAt, cryAt, this.actionEnd, catAt, this.catHitAt, this.catEnd, this.cleanupEnd,this.tableEventAt(),this.tableHitAt,this.tableCatEnd);
      if (next > target) { this.elapsed = target; break; }
      this.elapsed = next;
      // На границе часа сохраняем действие; показ новой потребности ждёт его конца.
      if (next === hourAt) {
        if (this.hour + 1 === TOTAL_HOURS) {
          this.endDay(target);return;
        }
        this.newHour(this.hour + 1);
      } else if (next === timeoutAt) { this.fail(true); }
      else if(next===cryAt){this.repeatCryPenalty();}
      else if(this.handleTableEvent(next)){}
      else if (next === catAt) {
        this.catState = 'running'; this.catStarted = next;
        this.catHitAt = next + CAT_HIT_MS; this.catEnd = next + CAT_RUN_MS;
      } else if (next === this.catHitAt) {
        this.dirty = true; this.catHitAt = Infinity;
        if (!this.pending) this.feedback = 'catMess';
      } else if (next === this.catEnd) {
        this.catState = 'gone'; this.catEnd = Infinity;
      } else if (next === this.cleanupEnd) {
        this.completeCleanup();
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
    // Сам малыш не является ошибочным предметом: его можно безопасно трогать.
    if(this.levelId===3&&['hold','comfort'].includes(action)){
      if(!['hold','comfort'].includes(this.need.action))return;
      action=this.need.action;
    }
    if (action === 'wash' && this.dirty) { this.blockedAt = this.elapsed; this.feedback = 'sinkBlocked'; return; }
    if(action==='feed'&&(this.tableDirty||this.tableCatState==='running')){
      this.tableBlockedAt=this.elapsed;this.feedback=this.tableDirty?'tableBlocked':'catOnTable';return;
    }
    if (action !== this.need.action) { this.fail(false); return; }
    this.pending = false; this.cryPenaltyAt=Infinity; this.action = action; this.actionStarted = this.elapsed;
    this.actionEnd = this.elapsed + (this.levelId===3?(action==='sleep'?EXPLORER_SLEEP_MS:action==='wash'?EXPLORER_WASH_MS:RESPONSE_MS):RESPONSE_MS); this.mood = 'happy'; this.feedback = this.need.success;
    if(this.explorer){this.explorer.settle(this.elapsed);this.explorer.state='action';this.explorer.end=Infinity;}
  }
  cleanup(elapsed) {
    this.update(elapsed);
    if (this.status !== 'playing' || this.dayEnded || !this.dirty || this.action || this.cleaning) return;
    this.cleaning = true; this.cleanupStarted = this.elapsed; this.cleanupEnd = this.elapsed + RESPONSE_MS;
    this.cleanupKind='soil';
    this.feedback = 'cleaningSoil';
  }
  groundEventAt(){
    if(this.dayEnded||this.catState!=='waiting'||this.action)return Infinity;
    if(this.levelId===3&&this.tableCatState==='running')return Infinity;
    const afterTable=this.levelId===3&&this.tableCatState==='gone'?this.tableCatStarted+TABLE_CAT_RUN_MS+HOUR_MS:0;
    return Math.max(this.elapsed,this.catAt,afterTable);
  }
  tableEventAt(){
    if(this.dayEnded||this.tableCatState!=='waiting'||this.action==='feed')return Infinity;
    if(this.levelId===3&&this.catState==='running')return Infinity;
    const afterPlant=this.levelId===3&&this.catState==='gone'?this.catStarted+CAT_RUN_MS+HOUR_MS:0;
    return Math.max(this.elapsed,this.tableCatAt,afterPlant);
  }
  handleTableEvent(time){
    if(!Number.isFinite(time))return false;
    if(time===this.tableEventAt()){
      this.tableCatState='running';this.tableCatStarted=time;this.tableHitAt=time+TABLE_CAT_HIT_MS;this.tableCatEnd=time+TABLE_CAT_RUN_MS;
      this.tableCatFromFloor=this.catState==='running'&&this.dirty;
      if(this.tableCatFromFloor){this.catState='gone';this.catEnd=Infinity;}
    }else if(time===this.tableHitAt){this.tableDirty=true;this.tableHitAt=Infinity;if(!this.pending)this.feedback='tableBlocked';}
    else if(time===this.tableCatEnd){this.tableCatState='gone';this.tableCatEnd=Infinity;}
    else return false;
    return true;
  }
  wipeTable(elapsed){
    this.update(elapsed);
    if(this.status!=='playing'||this.dayEnded||!this.tableDirty||this.action||this.cleaning)return;
    this.cleaning=true;this.cleanupKind='table';this.cleanupStarted=this.elapsed;this.cleanupEnd=this.elapsed+RESPONSE_MS;this.feedback='wipingTable';
  }
  completeCleanup(){
    if(this.cleanupKind==='coffee'){this.hearts=Math.min(5,this.hearts+1);this.coffeeDrinks++;}
    else if(this.cleanupKind==='table')this.tableDirty=false;else this.dirty=false;
    this.cleaning=false;this.cleanupEnd=Infinity;
    if(!this.pending){this.feedback=this.cleanupKind==='coffee'?'coffeeRestored':this.cleanupKind==='table'?'tableClean':'soilClean';this.mood='';}
    if(this.cleanupKind==='coffee')this.feedback='coffeeRestored';
  }
  drinkCoffee(elapsed){
    this.update(elapsed);
    if(this.levelId!==3||this.status!=='playing'||this.dayEnded||this.coffeeDrinks>=2||this.hearts>=5||this.pending||this.action||this.cleaning)return;
    this.cleaning=true;this.cleanupKind='coffee';this.cleanupStarted=this.elapsed;this.cleanupEnd=this.elapsed+RESPONSE_MS;
    this.feedback='drinkingCoffee';
  }
}
// Только третий уровень: последовательный планировщик на той же шкале игровых часов.
class ExplorerDay {
  constructor(random) {
    this.random=random;this.position={...EXPLORER_START};this.from={...this.position};this.to={...this.position};
    this.state='sit';this.started=0;this.end=Infinity;this.waiting=[];this.planIndex=0;this.cabinetVisits=0;this.blocksVisits=0;this.holdAfter=0;this.blocksFellAt=-Infinity;this.blocksReturnAt=-Infinity;
    this.closingAt=-Infinity;this.closingAngle=0;this.recoilAngle=0;
    const needs=[...LEVELS[3].needs];
    for(let i=needs.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[needs[i],needs[j]]=[needs[j],needs[i]];}
    this.plan=needs.map((need,i)=>({at:6000+i*17000+random()*4000,need}));
    this.beginCrawl(0);
    this.to={x:.7,y:.72}; // Первые движения рядом с мамой, от места утренней сцены.
  }
  sample(time) {
    if(!['crawl','cabinetApproach','blocksApproach'].includes(this.state))return {...this.position};
    const t=Math.max(0,Math.min(1,(time-this.started)/(this.end-this.started)));
    const phase=this.state==='crawl'?(t<.35?t/.35*.45:t<.5?.45:.45+(t-.5)/.5*.55):t;
    const e=phase*phase*(3-2*phase);
    return {x:this.from.x+(this.to.x-this.from.x)*e,y:this.from.y+(this.to.y-this.from.y)*e};
  }
  settle(time){this.position=this.sample(time);}
  beginCrawl(time) {
    const points=[{x:.34,y:.58},{x:.44,y:.62},{x:.54,y:.59},{x:.48,y:.55}];
    const choices=points.filter(p=>Math.hypot(p.x-this.position.x,p.y-this.position.y)>.035);
    this.from={...this.position};this.to={...choices[Math.floor(this.random()*choices.length)]};
    this.state='crawl';this.started=time;this.end=time+2000+this.random()*1000;
  }
  beginCabinet(time){this.from={...this.position};this.to={x:.25,y:.55};this.state='cabinetApproach';this.started=time;this.end=time+1700;this.cabinetVisits++;}
  beginBlocks(time){this.from={...this.position};this.to={x:.70,y:.79};this.state='blocksApproach';this.started=time;this.end=time+1700;this.blocksVisits++;this.blocksFellAt=-Infinity;this.blocksReturnAt=-Infinity;}
  showWaiting(m){
    if(['blocksPlay','blocksReturn'].includes(this.state))return false;
    const index=this.waiting.findIndex(n=>n.action!=='hold'||m.elapsed>=this.holdAfter);
    if(index<0)return false;
    this.show(this.waiting.splice(index,1)[0],m);return true;
  }
  closeDoor(time){if(this.state==='cabinetPlay'){this.closingAt=time;this.closingAngle=cabinetDoorAngle(time-this.started);}}
  show(need,m){this.settle(m.elapsed);this.closeDoor(m.elapsed);this.state='need';this.end=Infinity;m.showNeed(need);m.events++;m.seenNeeds.add(need.action);if(need.action==='comfort'){m.mood='crying';m.cryPenaltyAt=m.elapsed+HOUR_MS;m.feedback='comfortBaby';}}
  next(m) {
    this.closeDoor(m.elapsed);
    if(this.showWaiting(m))return;
    this.beginCrawl(m.elapsed);m.feedback='exploring';
  }
  update(elapsed,m) {
    if(m.status!=='playing')return;
    if(m.dayEnded){m.finishDay(Math.max(m.elapsed,elapsed));return;}
    const target=Math.max(m.elapsed,elapsed),dayEnd=TOTAL_HOURS*HOUR_MS;
    while(m.status==='playing'){
      const due=this.plan[this.planIndex]?.at??Infinity;
      const timeout=m.pending&&!m.timeoutApplied?m.needShownAt+RESPONSE_MS:Infinity;
      const heldNeed=!m.pending&&!m.action&&!['cabinetRecoil','blocksPlay','blocksReturn'].includes(this.state)&&this.waiting.length?Math.max(m.elapsed,this.holdAfter):Infinity;
      const cat=m.groundEventAt();
      const cryAt=m.pending&&m.mood==='crying'?m.cryPenaltyAt:Infinity;
      const next=Math.min(dayEnd,due,heldNeed,timeout,cryAt,m.actionEnd,this.end,cat,m.catHitAt,m.catEnd,m.cleanupEnd,m.tableEventAt(),m.tableHitAt,m.tableCatEnd);
      if(next>target){m.elapsed=target;m.hour=Math.min(11,Math.floor(target/HOUR_MS));break;}
      m.elapsed=next;m.hour=Math.min(11,Math.floor(next/HOUR_MS));
      if(next===dayEnd){m.endDay(target);return;}
      if(next===due){
        this.waiting.push(this.plan[this.planIndex++].need);
        if(!m.pending&&!m.action&&this.state!=='cabinetRecoil')this.showWaiting(m);
      }else if(next===heldNeed){this.showWaiting(m);
      }else if(next===timeout)m.fail(true);
      else if(next===cryAt)m.repeatCryPenalty();
      else if(m.handleTableEvent(next)){}
      else if(next===m.actionEnd){
        if(m.action==='comfort')this.holdAfter=next+3000;
        if(m.action==='wash'){this.position={...EXPLORER_WASH_LANDING};this.loweredAt=next;}
        if(m.action==='sleep'){this.position={...EXPLORER_SLEEP_LANDING};this.loweredAt=next;}
        m.action=null;m.actionEnd=Infinity;m.mood='';m.feedback='calm';this.next(m);
      }else if(next===cat){m.catState='running';m.catStarted=next;m.catHitAt=next+CAT_HIT_MS;m.catEnd=next+CAT_RUN_MS;}
      else if(next===m.catHitAt){m.dirty=true;m.catHitAt=Infinity;if(!m.pending)m.feedback='catMess';}
      else if(next===m.catEnd){m.catState='gone';m.catEnd=Infinity;}
      else if(next===m.cleanupEnd)m.completeCleanup();
      else if(next===this.end){
        this.settle(next);
        if(this.state==='crawl'){
          if(this.blocksVisits<=this.cabinetVisits)this.beginBlocks(next);else this.beginCabinet(next);
        }else if(this.state==='blocksApproach'){
          this.state='blocksPlay';this.started=next;this.end=next+2000;m.feedback='blocksPlay';
        }else if(this.state==='blocksPlay'){
          if(this.random()<.5){this.blocksFellAt=next;this.blocksReturnAt=next+650;this.show(BLOCKS_COMFORT_NEED,m);}
          else{this.state='blocksReturn';this.blocksReturnAt=next;this.end=next+900;}
        }else if(this.state==='blocksReturn'){
          this.state='sit';this.end=Infinity;this.next(m);
        }else if(this.state==='cabinetApproach'){
          this.state='cabinetPlay';this.started=next;this.end=next+2000;m.feedback='cabinetPlay';
        }else if(this.state==='cabinetPlay'){
          if(this.random()<.7){this.recoilAngle=cabinetDoorAngle(next-this.started);this.state='cabinetRecoil';this.started=next;this.end=next+250;m.mood='crying';}
          else this.next(m);
        }else if(this.state==='cabinetRecoil')this.show(COMFORT_NEED,m);
      }
    }
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
    const loss = model.losses.slice().reverse().find(loss => loss.index === i);
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
    document.querySelector('.story-hug-back').hidden = true;
    document.querySelector('.story-baby-front').hidden = true;
    document.querySelector('.story-affection').hidden = true;
    document.querySelector('.story-standing-smile').style.opacity = 0;
    document.querySelector('.story-rising-legs').style.opacity = 0;
    document.querySelector('.family-standing').style.clipPath = 'none';
    renderScene();
  }
  renderCatEvent(storyVisible);
  renderTableEvent(storyVisible);
  renderCoffee(storyVisible);
  $('thought').hidden = model.status !== 'playing' || !model.pending;
  document.querySelector('.game').classList.toggle('is-paused', story ? storyClock.paused : gameClock.paused);
  document.querySelector('.game').classList.toggle('is-stopped', !story && model.status !== 'playing');
  $('pause').hidden = !story && model.status !== 'playing';
  $('pause').disabled = story ? storyClock.paused : gameClock.paused;
  $('pause-overlay').hidden = story ? !(storyClock.paused && story.manualPaused) : !gameClock.paused || model.status !== 'playing';
  $('need-icon').textContent = model.pending ? model.need.icon : '♡';
  $('need-text').textContent = model.pending ? t(model.need.text) : t('helping');
  if(model.pending&&model.need.action==='wash'&&!storyVisible){
    // Облако не закрывает ни раковину, ни её область нажатия.
    const thought=$('thought'),sink=document.querySelector('.sink-target'),room=document.querySelector('.room');
    const half=thought.offsetWidth/2,min=sink.offsetLeft+sink.offsetWidth+8+half,max=room.clientWidth-half-8;
    thought.style.left=Math.min(max,Math.max(min,parseFloat(getComputedStyle(thought).left)))+'px';
  }
  $('reaction-progress').style.width = model.pending && !model.timeoutApplied ? Math.max(0, 100 * (1 - (model.elapsed - model.needShownAt) / RESPONSE_MS)) + '%' : '0%';
  $('message').textContent = t(model.feedback);
  buttons.forEach(button => {
    const available = LEVELS[model.levelId].objects.includes(button.dataset.action);
    button.hidden = !available;
    button.disabled = Boolean(story) || !available || model.status !== 'playing' || !model.pending || gameClock.paused || model.cleaning;
    if (button.dataset.action === 'wash') button.setAttribute('aria-describedby', model.dirty ? 'clean-soil' : '');
    if(button.dataset.action==='feed')button.setAttribute('aria-describedby',model.tableDirty?'wipe-table':'');
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
function setCabinetAngle(cabinet,angle){
  const radians=angle*Math.PI/180;
  cabinet.style.setProperty('--door-angle',(-angle)+'deg');
  cabinet.style.setProperty('--door-scale',Math.cos(radians));
  cabinet.style.setProperty('--door-slope',Math.sin(radians)*.25);
}
function renderScene() {
  document.querySelector('.explorer-bottle-front')?.setAttribute('hidden','');
  document.querySelector('.explorer-cradle-support')?.setAttribute('hidden','');
  const returnPose=document.querySelector('.explorer-return-pose');if(returnPose)returnPose.style.opacity=0;
  const idlePose=document.querySelector('.family-idle');if(idlePose)idlePose.style.opacity=0;
  document.querySelector('.family-toddler-hug').style.opacity=0;
  document.querySelector('.family-crouching').style.opacity=0;
  document.querySelector('.family-coffee').style.opacity=0;
  if(model.levelId===3){renderExplorerScene();return;}
  $('explorer-baby').hidden=true;
  const cabinet=document.querySelector('.cabinet-scene');cabinet.hidden=false;
  setCabinetAngle(cabinet,0);cabinet.querySelector('.cabinet-interior').hidden=false;
  const blocks=document.querySelector('.explorer-blocks');if(blocks)blocks.hidden=true;
  document.querySelector('.room').dataset.blocksPlaying='false';
  const floor=document.querySelector('.blocks-underlay');if(floor)floor.hidden=true;


  $('thought').style.top='';
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
  const targetX = room.clientWidth * (model.action === 'sleep' ? CRIB_BABY.x : 0.015);
  const targetY = room.clientHeight * (model.action === 'sleep' ? CRIB_BABY.y : 0.24);
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
  baby.style.clipPath = inFurniture && model.action === 'wash' ? 'inset(0 0 44% 0)' : '';
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
  const table=model.cleanupKind==='table';
  family.style.left = (table?28-48*travel:28+12*travel)+'%'; family.style.top = (table?25+21*travel:25+travel)+'%';
  family.querySelector('.family-visual').style.transform = 'none';
  family.querySelectorAll('.family-visual > img').forEach(img => { img.style.opacity = 0; });
  const mother = family.querySelector('.family-washing');
  mother.style.opacity = returning ? 0 : fadeOut;
  mother.style.transform = 'rotate(' + ((table?40:-22) * travel) + 'deg) scale('+(table?1.52:-1.52)+',' + (1.52 - .22 * travel) + ')';
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
  baby.style.left = (CRIB_BABY.x*100)+'%'; baby.style.top = (CRIB_BABY.y*100)+'%'; baby.style.width = (CRIB_BABY.width*100)+'%'; baby.style.opacity = returning ? 0 : fadeOut; baby.style.zIndex = 5;
  baby.dataset.depth = 'inside'; baby.querySelector('img').style.transform = 'rotate(40deg)';
  baby.style.setProperty('--care', 0);
  room.dataset.care = ''; room.style.setProperty('--scene-care', 0);
  $('thought').style.left = '60%';
}

function renderReferenceBaby(pose,face,state,time,show,mix=1,direction=1){
  const baby=$('explorer-baby'),native=baby.querySelector('svg'),art=baby.querySelector('.explorer-reference-art');
  const blockArms=art.querySelector('.blocks-arms');if(blockArms)blockArms.style.display='none';
  const blockLegs=art.querySelector('.blocks-legs');if(blockLegs)blockLegs.style.display='none';
  art.style.overflow='';
  native.style.opacity=show?0:1;art.toggleAttribute('hidden',!show);
  if(!show)return;
  const frame=face==='sleep'?6:face==='cry'?4:pose==='crawl'?1:pose==='up'?3:pose==='reach'?5:pose==='carrying'?7:pose==='feed'||state==='crawl'?2:0;
  const names=['sit','crawl','look','up','cry','cabinet','sleep','carry'],current=art.querySelector('.reference-current'),previous=art.querySelector('.reference-previous');
  current.setAttribute('clip-path','url(#baby-art-'+(frame===6?'sit':frame===7?'cabinet':names[frame])+')');
  if(frame===6)current.removeAttribute('clip-path');
  const image=current.querySelector('image');
  image.setAttribute('href',frame===6?'assets/level3-baby-sleep.png':'assets/level3-baby-poses.png');
  image.setAttribute('width',frame===6?512:1536);image.setAttribute('height',frame===6?512:1024);
  const cell=frame===7?5:frame;
  image.setAttribute('x',frame===6?0:-(cell%3)*512);image.setAttribute('y',frame===6?0:-Math.floor(cell/3)*512);
  if(frame===1)image.setAttribute('mask','url(#reference-crawl-body)');else image.removeAttribute('mask');
  const stride=Math.sin(time/95);
  for(const [name,angle,cx,cy]of [['near-arm',stride*4,285,335],['far-arm',-stride*4,402,335],['knee',-stride*3,164,384]]){
    const limb=art.querySelector('.reference-'+name);limb.toggleAttribute('hidden',frame!==1);
    limb.setAttribute('transform','rotate('+angle+' '+cx+' '+cy+')');limb.style.opacity=mix;
  }
  current.style.opacity=mix;previous.style.opacity=1-mix;
  const cabinetArm=art.querySelector('.reference-cabinet-arm');cabinetArm.toggleAttribute('hidden',true);
  if(frame===5){
    // Край дверцы достигается положением малыша, без растягивания рук и кистей.
    cabinetArm.setAttribute('transform','translate(0 0)');
  }
  art.dataset.frame=names[frame];
  const shake=face==='cry'?Math.sin(time/70)*.45:0,bob=pose==='crawl'?-Math.abs(Math.sin(time/95))*.45:0;
  art.style.transform='translate('+shake+'px,'+bob+'px) scaleX('+direction+')';
}

function renderExplorerScene() {
  const e=model.explorer,baby=$('explorer-baby'),room=document.querySelector('.room'),family=$('family');
  if(!e){baby.hidden=true;return;}
  room.dataset.explorerFloor=String(!model.action);
  const ease=x=>{x=Math.max(0,Math.min(1,x));return x*x*(3-2*x);},mix=(a,b,t)=>a+(b-a)*t;
  const time=model.elapsed,age=time-e.started;
  const elapsedAction=time-model.actionStarted;
  const actionAge=model.action==='wash'?
    (elapsedAction<=850?elapsedAction:elapsedAction<=1850?850+(elapsedAction-850)*.6:elapsedAction<=2250?1450+(elapsedAction-1850)*.625:1700+(elapsedAction-2250)*.6):
    model.action==='sleep'?(elapsedAction<=2175?elapsedAction/1.5:elapsedAction<=2525?1450+(elapsedAction-2175)*150/350:elapsedAction<=2875?1600+(elapsedAction-2525)*150/350:elapsedAction<=3100?1750+(elapsedAction-2875)*100/225:1850+(elapsedAction-3100)*150/400):
    model.action?elapsedAction*RESPONSE_MS/(model.actionEnd-model.actionStarted):0;
  let p=e.sample(time),pose='sit',face=model.mood==='crying'?'cry':'happy';
  const crawlPhase=(time-e.started)/(e.end-e.started);
  if((e.state==='crawl'&&!(crawlPhase>.35&&crawlPhase<.5))||e.state==='cabinetApproach'||e.state==='blocksApproach')pose='crawl';
  if(e.state==='blocksPlay')pose='sit';
  if(e.state==='cabinetRecoil'){pose='recoil';face='cry';}
  if(e.state==='cabinetPlay')pose='reach';
  if(model.pending&&model.need.action==='hold')pose='up';
  if(model.pending&&model.need.action==='sleep'&&face!=='cry')face='sleep';
  family.querySelectorAll('.family-visual>img').forEach(img=>img.style.opacity=0);
  family.querySelector('.family-visual').style.transform='none';
  family.querySelector('.care-effects').style.opacity=0;
  document.querySelector('.independent-baby').style.opacity=0;
  document.querySelector('.play-baby').style.opacity=0;
  document.querySelector('.growing-care-bottle').style.opacity=0;
  document.querySelector('.table-bottle').style.opacity=1;
  const empty=family.querySelector('.family-empty'),wash=family.querySelector('.family-washing'),back=family.querySelector('.family-back'),crouching=family.querySelector('.family-crouching');
  let idle=family.querySelector('.family-idle');
  if(!idle){idle=empty.cloneNode(false);idle.className='family-empty family-idle';idle.src='assets/mother-idle-arms-down.png';idle.style.opacity=0;family.querySelector('.family-visual').append(idle);}
  let mx=43,my=25,mother=idle,rotation=0,mirror=-1,scaleY=1.52,momOpacity=1,babyRotation=0,depth=8,feeding=false,cradle=0,placement=0,carePose=0,returnPose=0,hugWeight=0;
  let x=(p.x-.09)*100,y=(p.y-room.clientWidth*.18*1.1/room.clientHeight*.93)*100,width=18;
  let door=e.closingAngle*(1-ease((time-e.closingAt)/200));
  if(e.state==='cabinetPlay')door=cabinetDoorAngle(age);
  if(e.state==='cabinetRecoil')door=e.recoilAngle*(1-ease(age/150));
  const cabinet=document.querySelector('.cabinet-scene');cabinet.hidden=false;
  cabinet.querySelector('.cabinet-interior').hidden=false;
  setCabinetAngle(cabinet,door);
  if(model.action){
    mother=empty;
    const a=actionAge,approach=ease(a/350),returning=ease((a-1650)/350);
    mx=mix(43,p.x*100-24,approach)*(1-returning)+43*returning;mirror=1;
    if(model.action==='feed'){
      feeding=a>=350&&a<1650;face='happy';pose='feed';
      mother=crouching;mirror=p.x>.55?-1:1;
      const beside=p.x*100+(mirror===1?-5:-41),ground=p.y*100-family.clientHeight/room.clientHeight*93.6;
      mx=mix(43,beside,approach*(1-returning));my=mix(25,ground,approach*(1-returning));
      rotation=0;scaleY=1.52;
      document.querySelector('.table-bottle').style.opacity=feeding?0:1;
    }else if(model.action==='hold'||model.action==='comfort'){
      // Сразу переходим к цельной позе объятия, без отдельного подъёма и пустых рук.
      hugWeight=ease((a-150)/300)*(1-ease((a-1650)/350));
      pose='cradled';face=model.action==='comfort'?'cry':'happy';
      rotation=Math.sin(a/180)*.8*hugWeight;
    }else{
      const station=ease((a-450)/300)*(1-returning),sleep=model.action==='sleep';
      mx=mix(mx,sleep?40:4,station);my=mix(25,sleep?24:22,station);
      const lift=ease((a-200)/250)*(1-returning);
      placement=ease((a-650)/200)*(1-ease((a-1450)/200));
      cradle=lift*(1-placement);pose=placement>.95?'settled-care':'carrying';
      x=mix(x,mx+22.5,lift);y=mix(y,my-4,lift);babyRotation=-12*lift;
      // Одна и та же фигура плавно переходит из рук на матрас/в раковину.
      x=mix(x,sleep?CRIB_BABY.x*100+5:1.5,placement);
      y=mix(y,sleep?CRIB_BABY.y*100:22.5,placement);
      babyRotation=mix(babyRotation,sleep?-90:-6,placement);
      carePose=ease((a-650)/200)*(1-ease((a-1450)/300));
      returnPose=returning;
      if(a<850){
          const pickup=ease((a-150)/300),toObject=ease((a-650)/200),transfer=ease((a-450)/200);
          hugWeight=pickup*(1-toObject);cradle=0;
          x=mix((p.x-.09)*100,sleep?CRIB_BABY.x*100+5:1.5,transfer);
          y=mix((p.y-room.clientWidth*.18*1.1/room.clientHeight*.93)*100,sleep?CRIB_BABY.y*100:22.5,transfer);
          babyRotation=(sleep?-90:-6)*transfer;placement=transfer;
          pose=a<650?'cradled':'settled-care';
      }
      if(!sleep){
        carePose=ease((a-650)/200)*(1-ease((a-1450)/550));
        if(a>=1450){
          const liftBack=ease((a-1450)/250),lower=ease((a-1700)/300),transfer=ease((a-1600)/100);
          const floorX=(EXPLORER_WASH_LANDING.x-.09)*100;
          const floorY=(EXPLORER_WASH_LANDING.y-room.clientWidth*.18*1.1/room.clientHeight*.93)*100;
          x=a<1700?1.5:floorX;
          y=a<1700?22.5:floorY;
          babyRotation=a<1700?-6:0;placement=a<1700?1:0;
          // Сначала берём малыша у чаши цельной позой, затем отходим вместе.
          const take=ease((a-1450)/100);
          hugWeight=take*(1-lower);carePose=1-take;
          cradle=0;pose=a<1700?'cradled':'lowering';returnPose=0;
        }
      }else if(a>=1450){
        const approachCrib=ease((a-1450)/150),liftBack=ease((a-1600)/150),carryBack=ease((a-1750)/100),lower=ease((a-1850)/150);
        mx=mix(mix(mix(40,48,approachCrib),45,carryBack),43,lower);
        my=mix(24,25,carryBack);
        const floorX=(EXPLORER_SLEEP_LANDING.x-.09)*100;
        const floorY=(EXPLORER_SLEEP_LANDING.y-room.clientWidth*.18*1.1/room.clientHeight*.93)*100;
        // Из положения на матрасе сразу переходим в цельную позу объятия.
        // Отдельная повёрнутая фигура малыша больше не висит перед мамиными руками.
        x=CRIB_BABY.x*100+5;y=CRIB_BABY.y*100;
        babyRotation=-90;placement=1;
        if(a>=1750){x=floorX;y=floorY;babyRotation=0;placement=0;}
        const takeIntoArms=liftBack;
        hugWeight=takeIntoArms*(1-lower);carePose=1-takeIntoArms;
        cradle=0;pose=a>=1850?'lowering':'settled-care';returnPose=0;
      }
      if(placement>.5)depth=5;
      if(!sleep&&a>=650&&a<1700)depth=8;
      face=sleep&&placement>.95?'sleep':'happy';
      room.dataset.care=sleep?'sleep':'wash';room.style.setProperty('--scene-care',sleep?placement:placement*carePose);
    }
  }
  if(model.cleaning){
    const a=time-model.cleanupStarted,t=ease(a/350);mother=wash;mirror=-1;
    mx=mix(43,40,t);my=26;rotation=-22*t;scaleY=1.52-.22*t;
    if(model.cleanupKind==='table'){mx=mix(43,-20,t);my=mix(25,46,t);mirror=1;rotation=40*t;}
    if(a>=1600){momOpacity=1-ease((a-1600)/200);if(a>=1800){mother=empty;mx=43;my=25;rotation=0;scaleY=1.52;momOpacity=ease((a-1800)/200);}}
    if(model.cleanupKind==='coffee'){
      const travel=ease(a/400)*(1-ease((a-1600)/400));
      mother=family.querySelector('.family-coffee');mx=mix(43,-2,travel);my=mix(25,42,travel);rotation=0;scaleY=1.52;momOpacity=1;
    }
  }
  family.style.left=mx+'%';family.style.top=my+'%';
  const momFeet=my/100+family.clientHeight*.96/room.clientHeight;
  const crossesMom=p.x+.1125>(mx+12)/100&&p.x-.1125<(mx+38)/100;
  if(!model.action&&crossesMom&&p.y<momFeet)depth=6;
  // У стола мама наклоняется далеко за пределы обычного силуэта стоящей позы.
  if(!model.action&&model.cleaning&&model.cleanupKind==='table')depth=6;
  mother.style.opacity=momOpacity;mother.style.scale='1';mother.style.transform='rotate('+rotation+'deg) scale('+(1.52*mirror)+','+scaleY+')';
  if(model.cleaning&&model.cleanupKind==='coffee'){
    const a=time-model.cleanupStarted,pose=ease((a-250)/200)*(1-ease((a-1550)/200));
    mother.style.opacity=pose;idle.style.opacity=1-pose;idle.style.transform='scale(-1.52,1.52)';
  }
  let resting=family.querySelector('.explorer-return-pose');
  if(!resting){resting=idle.cloneNode(false);resting.className='family-empty explorer-return-pose';family.querySelector('.family-visual').append(resting);}
  if(model.action==='wash'||model.action==='sleep'){
    // Смена PNG-поз проходит через плавное смешивание, без порогового скачка.
    const caring=model.action==='sleep'?back:wash;
    caring.style.opacity=carePose;
    caring.style.transform='scale('+(model.action==='sleep'?1.52:-1.52)+',1.52)';
    empty.style.opacity=(1-carePose)*(1-returnPose);
    resting.style.opacity=(1-carePose)*returnPose;
    resting.style.transform='scale(-1.52,1.52)';
  }
  if(model.action){
    const a=actionAge,begin=ease(a/200),care=['wash','sleep'].includes(model.action);
    if(care){empty.style.opacity*=begin;idle.style.opacity=1-begin;}
    else{const active=begin*(1-ease((a-1650)/350));mother.style.opacity*=active;idle.style.opacity=1-active;}
    idle.style.transform='scale(-1.52,1.52)';
  }
  const hug=family.querySelector('.family-toddler-hug');
  if(model.action==='feed'){
    const squat=ease((actionAge-200)/250)*(1-ease((actionAge-1650)/350));
    crouching.style.opacity=squat;idle.style.opacity=1-squat;
    idle.style.transform='scale('+(-1.52*mirror)+',1.52)';
  }
  hug.style.opacity=Number(empty.style.opacity)*hugWeight;
  hug.style.transform=empty.style.transform;hug.style.scale='1';
  empty.style.opacity=Number(empty.style.opacity)*(1-hugWeight);
  const directHug=model.action==='hold'||model.action==='comfort';
  if(directHug){
    empty.style.opacity=0;
    idle.style.opacity=1-hugWeight;
    hug.style.opacity=hugWeight;
  }
  const carePickup=(model.action==='wash'||model.action==='sleep')&&actionAge<850;
  if(carePickup){
    empty.style.opacity=0;resting.style.opacity=0;
    idle.style.opacity=1-ease((actionAge-150)/300);
    hug.style.opacity=hugWeight;
  }
  const washReturn=model.action==='wash'&&actionAge>=1450;
  if(washReturn){
    empty.style.opacity=0;resting.style.opacity=0;
    idle.style.opacity=ease((actionAge-1700)/300);hug.style.opacity=hugWeight;
    // Объятие обращено к чаше: малыш остаётся с той же стороны мамы.
    hug.style.transform='scale(-1.52,1.52)';
  }
  const sleepReturn=model.action==='sleep'&&actionAge>=1450;
  if(sleepReturn){
    empty.style.opacity=0;resting.style.opacity=0;
    idle.style.opacity=ease((actionAge-1850)/150);hug.style.opacity=hugWeight;
  }
  let support=room.querySelector('.explorer-cradle-support');
  if(!support){
    support=document.createElement('div');support.className='explorer-cradle-support';support.setAttribute('aria-hidden','true');
    const hand=empty.cloneNode(false);hand.removeAttribute('class');support.append(hand);room.append(support);
  }
  support.hidden=directHug||carePickup||washReturn||sleepReturn||cradle===0||hugWeight>0;
  support.style.left=mx+'%';support.style.top=my+'%';
  support.firstElementChild.style.transform=mother.style.transform;
  support.firstElementChild.style.opacity=ease((cradle-.65)/.35);
  if(!model.action||!['wash','sleep'].includes(model.action)){room.dataset.care='';room.style.setProperty('--scene-care',0);}
  room.style.setProperty('--scene-age',-time+'ms');
  baby.hidden=false;baby.style.opacity=1-hugWeight;baby.disabled=!model.pending||Boolean(model.action)||model.cleaning||gameClock.paused||model.status!=='playing';
  if(carePickup)baby.style.opacity=actionAge<650?1-ease((actionAge-150)/300):ease((actionAge-650)/200);
  if(washReturn)baby.style.opacity=actionAge<1700?1-ease((actionAge-1450)/100):ease((actionAge-1700)/300);
  if(sleepReturn)baby.style.opacity=actionAge<1750?1-ease((actionAge-1600)/150):ease((actionAge-1850)/150);
  baby.dataset.pose=pose;baby.dataset.face=face;
  // Увеличиваем только малыша третьего уровня, сохраняя опору на пол/матрас.
  const addedWidth=width*(EXPLORER_BABY_SCALE-1);
  x-=addedWidth/2;
  y-=addedWidth*room.clientWidth/room.clientHeight*1.1*mix(.93,.7,placement);
  width*=EXPLORER_BABY_SCALE;
  if(pose==='reach'){
    const edge=cabinet.querySelector('.cabinet-door-panel').getBoundingClientRect().right-room.getBoundingClientRect().left;
    // Малыш подаётся корпусом вслед за дверцей; рука сохраняет исходные пропорции.
    x=edge/room.clientWidth*100-width*112/512;
  }
  const needsComfort=model.pending&&['hold','comfort'].includes(model.need?.action)&&!model.action;
  baby.dataset.needsComfort=String(needsComfort);
  if(needsComfort)depth=11;
  baby.style.left=x+'%';baby.style.top=y+'%';baby.style.width=width+'%';baby.style.zIndex=depth;
  baby.style.transform='rotate('+babyRotation+'deg)';
  // В чаше нижняя часть тела скрыта водой и передним краем раковины.
  // При подъёме маска уходит вместе с размещением малыша в чаше.
  const bathMask=placement;
  baby.style.clipPath=model.action==='wash'?'inset(0 0 '+(36*bathMask)+'% 0)':'';
  const svg=baby.querySelector('svg'),direction=pose==='crawl'&&e.to.x>e.from.x?-1:1;
  svg.style.transform='scaleX('+direction+')';
  if(pose==='reach'){
    // Кисть следует за краем существующей дверцы, а корпус сидит боком.
    const edge=cabinet.querySelector('.cabinet-door-panel').getBoundingClientRect().right-room.getBoundingClientRect().left;
    const handX=(edge/room.clientWidth*100-x)/width*200;
    baby.dataset.cabinetHand=handX;
    const handY=125+Math.sin(age/150)*2,arm=baby.querySelector('.explorer-cabinet-arm');
    arm.querySelector('path').setAttribute('d','M99 131Q78 151 '+handX+' '+handY);
    arm.querySelector('ellipse').setAttribute('cx',handX);arm.querySelector('ellipse').setAttribute('cy',handY);
  }
  const firstCrawl=e.state==='crawl'&&(e.started===0||e.started===e.loweredAt)&&pose==='crawl';
  const unfold=firstCrawl?ease(age/350):1;
  const sitting=baby.querySelector('.explorer-sit'),crawling=baby.querySelector('.explorer-crawl');
  sitting.style.display=firstCrawl&&unfold<1?'block':'';
  sitting.style.opacity=firstCrawl?1-unfold:1;crawling.style.opacity=unfold;
  const gait=pose==='crawl'?Math.sin(time/95):0;
  baby.querySelector('.explorer-crawl-arm').setAttribute('transform','rotate('+(gait*12)+' 83 149)');
  baby.querySelector('.explorer-knee').setAttribute('transform','rotate('+(-gait*12)+' 151 155)');
  const loweringArms=pose==='cradled'&&model.action==='hold'?125*(1-ease((time-model.actionStarted)/300)):0;
  const reach=pose==='up'?125:pose==='cradled'?loweringArms:pose==='reach'?85:pose==='feed'?65:pose==='recoil'?55:0;
  baby.querySelector('.explorer-arm-left').setAttribute('transform','rotate('+reach+' 72 114)');
  const rightReach=pose==='up'||pose==='cradled'?-reach:pose==='reach'?0:-reach*.85;
  baby.querySelector('.explorer-arm-right').setAttribute('transform','rotate('+rightReach+' 128 114)');
  const leftArm=baby.querySelector('.explorer-arm-left'),rightArm=baby.querySelector('.explorer-arm-right');
  leftArm.querySelector('path').setAttribute('d',pose==='feed'?'M72 114Q65 126 89 104':'M72 114Q52 116 49 151L57 169');
  rightArm.querySelector('path').setAttribute('d',pose==='feed'?'M128 114Q137 126 111 104':'M128 114Q147 117 151 151L143 169');
  for(const [arm,cx] of [[leftArm,pose==='feed'?89:57],[rightArm,pose==='feed'?111:143]]){
    arm.querySelector('ellipse').setAttribute('cx',cx);arm.querySelector('ellipse').setAttribute('cy',pose==='feed'?104:174);
    if(pose==='feed')arm.setAttribute('transform','');
  }
  // Лицо разворачивается в сторону движения; зеркальный корпус сам по себе
  // оставлял симметричную голову смотрящей на игрока.
  const looking=pose==='crawl'?ease((time-e.started)/180)*unfold:e.state==='cabinetPlay'?1:0;
  const head=pose==='crawl'?'translate('+((-35-3*looking)*unfold)+' '+(47*unfold)+') rotate('+((-12-5*looking)*unfold)+' 100 59)': 'rotate('+(e.state==='crawl'?Math.sin(time/500)*8:e.state==='cabinetPlay'?-13:0)+' 100 59)';
  baby.querySelector('.explorer-head').setAttribute('transform',head+' translate(100 106) scale(.9) translate(-100 -106)');
  baby.querySelector('.explorer-face').setAttribute('transform','translate('+(-12*looking)+' 0) translate(100 65) scale('+(1-.18*looking)+' 1) translate(-100 -65)');
  baby.querySelector('.explorer-tears').style.transform='translateY('+((time%650)/650*8)+'px)';
  baby.querySelector('.explorer-bottle').hidden=!feeding;
  let frontBottle=room.querySelector('.explorer-bottle-front');
  if(!frontBottle){
    frontBottle=document.createElement('div');frontBottle.className='explorer-bottle-front';frontBottle.setAttribute('aria-hidden','true');
    const image=baby.querySelector('.explorer-bottle').cloneNode(false);image.className='';image.hidden=false;frontBottle.append(image);room.append(frontBottle);
  }
  frontBottle.hidden=!feeding;
  frontBottle.style.left=baby.style.left;frontBottle.style.top=baby.style.top;frontBottle.style.width=baby.style.width;frontBottle.style.transform=baby.style.transform;
  baby.querySelector('.explorer-bottle').style.opacity=feeding?0:1;
  baby.querySelector('.explorer-zzz').hidden=face!=='sleep'||!model.action;
  baby.querySelector('.touch-marker').hidden=!model.pending||!['hold','comfort'].includes(model.need?.action)||Boolean(model.action);
  const spriteDirection=pose==='crawl'?(e.to.x<e.from.x?-1:1):pose==='up'&&p.x>.6?-1:1;
  renderReferenceBaby(pose,face,e.state,time,true,firstCrawl?unfold:pose==='carrying'?cradle:1,spriteDirection);
  renderExplorerBlocks(e,time);
  $('thought').style.left=Math.max(22,Math.min(77,p.x*100))+'%';
  $('thought').style.top=Math.max(3,(p.y-.4)*100)+'%';
}

// Дополнительные кубики движутся по тому же игровому времени, что и малыш.
// Поэтому пауза замораживает и сборку, и падение башенки.
function renderExplorerBlocks(e,time){
  const art=$('explorer-baby').querySelector('.explorer-reference-art');
  let legs=art.querySelector('.blocks-legs');
  if(!legs){
    legs=document.createElementNS('http://www.w3.org/2000/svg','g');legs.setAttribute('class','blocks-legs');
    // Цельные детали ног и таза без прямоугольных масок; корпус перекрывает их у бёдер.
    legs.innerHTML='<defs><linearGradient id="blocks-trousers" x2="1" y2="1"><stop stop-color="#a6dcc8"/><stop offset="1" stop-color="#8bcbb7"/></linearGradient></defs><ellipse cx="274" cy="447" rx="105" ry="33" fill="url(#blocks-trousers)"/><path d="M255 413Q213 375 177 392Q144 402 151 442Q161 473 213 475L275 465Z" fill="url(#blocks-trousers)" stroke="#89c6b3" stroke-width="2"/><path d="M290 413Q337 375 371 393Q401 405 393 442Q381 474 331 475L274 465Z" fill="url(#blocks-trousers)" stroke="#89c6b3" stroke-width="2"/><ellipse cx="145" cy="442" rx="35" ry="45" transform="rotate(-18 145 442)" fill="#a4d9c7" stroke="#88c5b3" stroke-width="2"/><ellipse cx="403" cy="442" rx="36" ry="45" transform="rotate(18 403 442)" fill="#a4d9c7" stroke="#88c5b3" stroke-width="2"/>';
    art.append(legs);
  }
  const activeBlocks=['blocksPlay','blocksReturn'].includes(e.state);
  legs.style.display=activeBlocks?'':'none';
  let arms=art.querySelector('.blocks-arms');
  if(!arms){
    arms=document.createElementNS('http://www.w3.org/2000/svg','g');arms.setAttribute('class','blocks-arms');
    arms.innerHTML='<defs><linearGradient id="blocks-shirt" x2="1" y2="1"><stop stop-color="#a6dcc8"/><stop offset="1" stop-color="#8bcbb7"/></linearGradient><clipPath id="blocks-head-only"><rect width="512" height="322"/></clipPath></defs><g clip-path="url(#baby-art-sit)"><image href="assets/level3-baby-poses.png" width="1536" height="1024" clip-path="url(#blocks-head-only)"/></g><path d="M208 314Q267 339 340 315Q369 355 359 411Q347 447 272 447Q193 447 179 416Q173 363 208 314Z" fill="url(#blocks-shirt)"/><path d="M245 325L270 343L296 325" fill="none" stroke="#b8e5d4" stroke-width="5"/><g fill="#fff8e8"><circle cx="278" cy="363" r="6"/><circle cx="278" cy="391" r="6"/><circle cx="278" cy="419" r="6"/></g><path class="blocks-left-sleeve" fill="none" stroke="#9bd5c1" stroke-width="38" stroke-linecap="round" stroke-linejoin="round"/><path class="blocks-right-sleeve" fill="none" stroke="#a4dcc8" stroke-width="38" stroke-linecap="round" stroke-linejoin="round"/><ellipse class="blocks-left-hand" rx="20" ry="18" fill="#ffcea7"/><ellipse class="blocks-right-hand" rx="20" ry="18" fill="#ffcea7"/>';
    art.append(arms);
  }
  arms.hidden=!activeBlocks;arms.style.display=arms.hidden?'none':'';
  let root=document.querySelector('.explorer-blocks');
  if(!root){
    root=document.createElementNS('http://www.w3.org/2000/svg','svg');
    root.setAttribute('class','explorer-blocks');root.setAttribute('viewBox','0 0 1024 1211');root.setAttribute('aria-hidden','true');
    root.innerHTML='<defs><clipPath id="moving-mint-cube"><path d="M-9 -35.5Q-5 -37 2 -34L27 -28.5Q32.5 -27 32.5 -18L32.5 12Q32.5 17.5 28 20L6 30Q0 32 -7 29.5L-31 23Q-36.5 21.5 -36.5 15L-36.5 -17Q-36.5 -23 -29 -26.5Z"/></clipPath></defs><g class="stack-cube" opacity="0"></g><g class="lift-cube"><g clip-path="url(#moving-mint-cube)"><use href="#room-plate" transform="translate(-749 -991)"/></g></g>';
    document.querySelector('.room').append(root);
  }
  const carryingBack=e.state==='blocksReturn',playing=activeBlocks,fall=time-e.blocksFellAt,returnAge=time-e.blocksReturnAt;
  document.querySelector('.room').dataset.blocksPlaying=String(playing);
  const falling=!playing&&fall>=0&&fall<650,returning=!playing&&returnAge>=0&&returnAge<350;
  let underlay=document.querySelector('.blocks-underlay');
  if(!underlay){
    underlay=document.createElementNS('http://www.w3.org/2000/svg','svg');underlay.setAttribute('class','blocks-underlay');underlay.setAttribute('viewBox','0 0 1024 1211');underlay.setAttribute('aria-hidden','true');
    // Используется лишь поверхность, прежде скрытая самим кубиком; окружающий пол исходный.
    underlay.innerHTML='<defs><clipPath id="mint-cube-footprint"><path d="M708 967L747 954L786 967V1019L750 1030L707 1020Z"/></clipPath></defs><image href="assets/room-under-mint-cube.png" x="0" y="-325" width="1024" height="1536" clip-path="url(#mint-cube-footprint)"/>';
    document.querySelector('.room').append(underlay);
  }
  underlay.hidden=false;root.hidden=false;
  if(!playing&&!falling&&!returning){root.querySelector('.lift-cube').setAttribute('transform','translate(749 991)');root.querySelector('.lift-cube').style.opacity=1;return;}
  const smooth=x=>{x=Math.max(0,Math.min(1,x));return x*x*(3-2*x);};
  const backProgress=smooth((returnAge-150)/600),backGrip=smooth(returnAge/150)*(1-smooth((returnAge-750)/150));
  const age=carryingBack?200+1500*(1-backProgress):time-e.started;
  if(playing){
    const pickup=smooth(age/200)*(carryingBack?backGrip:1),placing=smooth((age-200)/1000),release=carryingBack?0:smooth((age-1700)/300);
    art.style.transform='none';
    art.style.overflow='visible';
    arms.setAttribute('transform','translate('+((35-5*placing)*pickup*(1-release))+' '+(15*(1-placing)*pickup*(1-release))+') rotate('+((30-24*placing)*pickup*(1-release))+' 275 435)');
    art.querySelector('.reference-current').style.opacity=0;
    art.querySelector('.reference-previous').style.opacity=0;
  }
  const second=carryingBack?1-backProgress:smooth((age-200)/1200),drop=playing?0:smooth(fall/650);
  root.querySelector('.stack-cube').style.opacity=0;
  root.querySelector('.stack-cube').setAttribute('transform','translate('+(785+70*drop)+' '+(930+45*drop)+') rotate('+(80*drop)+')');
  
  root.querySelector('.lift-cube').setAttribute('transform',playing?'translate('+(749+(786-749)*second)+' '+(991+(884-991)*second-Math.sin(second*Math.PI)*6)+')':'translate('+(786-46*drop)+' '+(888+97*drop)+') rotate('+(-95*drop)+')');
  const lifted=root.querySelector('.lift-cube');lifted.style.opacity=1;
  if(returning){
    const t=smooth(returnAge/350),afterFall=Number.isFinite(e.blocksFellAt)&&e.blocksFellAt<=e.blocksReturnAt;
    const fromX=afterFall?740:786,fromY=afterFall?985:888;
    lifted.setAttribute('transform','translate('+(fromX+(749-fromX)*t)+' '+(fromY+(991-fromY)*t)+') rotate('+((afterFall?-95:0)*(1-t))+')');
  }
  if(playing){
    // Кисти и кубик имеют общую точку движения; никаких независимых траекторий.
    const cube=root.querySelector('.lift-cube'),matrix=arms.getScreenCTM().inverse();
    for(const [side,x,shoulder,bend] of [['left',-26,207,1],['right',26,338,1]]){
      const hand=new DOMPoint(x,8).matrixTransform(cube.getScreenCTM()).matrixTransform(matrix);
      const grasp=carryingBack?backGrip:(side==='left'?smooth((age-550)/400):smooth(age/200))*(1-smooth((age-1750)/250));
      const hx=(side==='left'?230:325)*(1-grasp)+hand.x*grasp,hy=418*(1-grasp)+hand.y*grasp;
      const dx=hx-shoulder,dy=hy-338,distance=Math.hypot(dx,dy),length=78;
      // Два сегмента постоянной длины: локоть сгибается, рука не растягивается.
      const d=Math.min(distance,length*2-1),tx=shoulder+dx*d/Math.max(1,distance),ty=338+dy*d/Math.max(1,distance);
      const height=Math.sqrt(length*length-d*d/4),ex=(shoulder+tx)/2-dy/Math.max(1,distance)*height*bend,ey=(338+ty)/2+dx/Math.max(1,distance)*height*bend;
      arms.querySelector('.blocks-'+side+'-sleeve').setAttribute('d','M'+shoulder+' 338L'+ex+' '+ey+'L'+tx+' '+ty);
      const palm=arms.querySelector('.blocks-'+side+'-hand');palm.setAttribute('cx',tx);palm.setAttribute('cy',ty);
    }
  }
}

function renderCatEvent(storyVisible) {
  const root = $('cat-event'), room = document.querySelector('.room'), clean = $('clean-soil');
  // Кошка опрокидывает общий горшок на каждом уровне.
  const visible = model.status !== 'ready';
  const interactive = visible && !storyVisible;
  root.hidden = !visible;
  document.querySelector('.plant-patch').toggleAttribute('hidden', !visible);
  room.dataset.cleaning = String(interactive && model.cleaning);
  room.dataset.tableCleaning = String(interactive && model.cleaning && ['table','coffee'].includes(model.cleanupKind));
  room.dataset.cleanupCrying = String(model.cleaning && model.mood === 'crying');
  document.querySelectorAll('.cleanup-tears i').forEach((tear, i) => {
    const phase = ((model.elapsed / 650) + i * .5) % 1;
    tear.style.opacity = 1 - phase;
    tear.style.transform = 'translateY(' + (phase * 12) + 'px) rotate(25deg)';
  });
  clean.hidden = !interactive || !model.dirty || model.status !== 'playing';
  clean.disabled = gameClock.paused || model.dayEnded || Boolean(model.action) || model.cleaning;
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
  const soilCleanup=model.cleaning&&model.cleanupKind==='soil';
  const collected = soilCleanup ? Math.max(0, Math.min(1, (cleanupAge - 450) / 1150)) : 0;
  const restore = soilCleanup ? Math.max(0, Math.min(1, (cleanupAge - 1600) / 400)) : 0;
  const restoreEase = restore * restore * (3 - 2 * restore);
  root.querySelector('.event-plant').style.transform = 'rotate(' + (-fall * 78 * (1-restoreEase)) + 'deg)';
  const soil = root.querySelector('.spilled-soil');
  soil.style.opacity = model.dirty ? fall * (1 - collected) : 0;
  soil.style.transformOrigin = model.cleaning ? '95% 65%' : '20% 60%';
  soil.style.transform = 'scale(' + ((.2 + .8 * fall) * (1 - collected * .7)) + ')';
  const tools = document.querySelector('.cleaning-tools');
  tools.toggleAttribute('hidden', !interactive || !soilCleanup);
  const sweeping = cleanupAge >= 350 && cleanupAge < 1650;
  tools.style.opacity = sweeping ? Math.max(0,Math.min(1,(1650-cleanupAge)/150)) : 0;
  // Совок остаётся у земли; только щётка сгребает землю в его сторону.
  const sweep = sweeping ? (1 - Math.cos((cleanupAge - 350) / 210 * Math.PI * 2)) / 2 : 0;
  tools.querySelector('.cleanup-brush').setAttribute('transform', 'translate(' + (sweep * 38) + ',0) rotate(' + (-8 + sweep * 12) + ' 60 13)');
  tools.querySelector('.pan-soil').style.opacity = collected;
}

function scenePath(path,age){
  let index=path.findIndex((p,i)=>i<path.length-1&&age<=path[i+1][0]);if(index<0)index=path.length-2;
  const from=path[index],to=path[index+1],t=Math.max(0,Math.min(1,(age-from[0])/(to[0]-from[0]))),s=t*t*(3-2*t);
  return {x:from[1]+(to[1]-from[1])*s,y:from[2]+(to[2]-from[2])*s};
}
function renderTableEvent(storyVisible){
  const room=document.querySelector('.room'),root=$('table-cat-event'),cat=root.querySelector('.table-cat'),puddle=root.querySelector('.milk-puddle'),button=$('wipe-table'),hand=document.querySelector('.table-wipe-hand');
  const active=model.levelId>=2&&!storyVisible&&model.status==='playing',wiping=model.cleaning&&model.cleanupKind==='table';
  const age=model.elapsed-model.tableCatStarted,wipeAge=model.elapsed-model.cleanupStarted;
  root.hidden=!active;cat.hidden=!active||model.tableCatState!=='running';puddle.hidden=!active||!model.tableDirty;
  room.dataset.tableDirty=String(active&&model.tableDirty);
  const fall=model.tableDirty?Math.max(0,Math.min(1,(age-TABLE_CAT_HIT_MS)/350)):0;
  const restore=wiping?Math.max(0,Math.min(1,(wipeAge-1700)/300)):0;
  room.style.setProperty('--bottle-fall',fall*(1-restore));
  let origin={x:-24,y:85};
  if(model.tableCatFromFloor)origin=scenePath([[0,-36,43],[CAT_HIT_MS,12.2,43],[1300,16,72],[2300,82,72],[CAT_RUN_MS,114,50]],model.tableCatStarted-model.catStarted);
  const p=scenePath([[0,origin.x,origin.y],[350,14,78],[800,16,63],[1000,20,65],[1400,9,65],[2400,-28,87]],age);
  cat.style.left=p.x+'%';cat.style.top=p.y+'%';cat.style.transform='rotate('+(-15*Math.sin(Math.max(0,Math.min(1,(age-350)/450))*Math.PI))+'deg) scaleX('+(age<1000?1:-1)+')';
  const collected=wiping?Math.max(0,Math.min(1,(wipeAge-350)/1400)):0;
  puddle.style.opacity=1-collected;puddle.style.transform='scale('+(Math.max(.15,fall)*(1-collected*.8))+', '+(1-collected*.5)+')';
  button.hidden=!active||!model.tableDirty;button.disabled=gameClock.paused||model.dayEnded||Boolean(model.action)||model.cleaning;
  button.style.transform=model.elapsed-model.tableBlockedAt<1200?'scale('+(1+.12*Math.sin((model.elapsed-model.tableBlockedAt)/90)**2)+')':'none';
  hand.toggleAttribute('hidden',!active||!wiping);
  hand.style.opacity=Math.max(0,Math.min(1,(wipeAge-250)/150,(1800-wipeAge)/150));
  hand.style.left=(21+1.5*Math.sin(wipeAge/110))+'%';hand.style.transform='rotate('+(2*Math.sin(wipeAge/140))+'deg)';
}

function renderCoffee(storyVisible){
  const cup=$('coffee'),drinking=model.cleaning&&model.cleanupKind==='coffee',empty=model.coffeeDrinks>=2;
  cup.dataset.empty=String(empty);
  cup.setAttribute('data-i18n-aria',empty?'coffeeEmpty':'coffee');
  cup.setAttribute('aria-label',t(empty?'coffeeEmpty':'coffee'));
  cup.querySelector('.coffee-liquid').setAttribute('fill',empty?'#e5d5c2':'#76503b');
  cup.hidden=model.levelId!==3||(model.status==='ready'&&!storyVisible);
  cup.disabled=Boolean(storyVisible)||model.status!=='playing'||model.dayEnded||empty||gameClock.paused||model.hearts>=5||model.pending||Boolean(model.action)||model.cleaning;
  cup.querySelector('.touch-marker').hidden=cup.disabled;
  const age=model.elapsed-model.cleanupStarted,ease=x=>{x=Math.max(0,Math.min(1,x));return x*x*(3-2*x);};
  cup.querySelector('svg').style.opacity=drinking?1-ease((age-250)/200)*(1-ease((age-1550)/200)):1;
  cup.querySelector('.coffee-steam').style.opacity=empty?0:.55+.25*Math.sin(model.elapsed/500);
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
  const third=progress.canStart(3);
  $('choose-level-3').disabled=!third;
  $('choose-level-3').setAttribute('aria-label',t('level3Card')+'. '+t(third?'available':'locked3'));
  $('level3-lock').textContent=t(third?'available':'locked3');$('level3-icon').textContent=third?'3':'🔒';
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
  if (manual === true) $('resume').focus();
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
  document.querySelector('.explorer-bottle-front')?.setAttribute('hidden','');
  document.querySelector('.explorer-cradle-support')?.setAttribute('hidden','');
  $('explorer-baby').hidden=true;
  const cabinet=document.querySelector('.cabinet-scene');cabinet.hidden=false;
  setCabinetAngle(cabinet,0);cabinet.querySelector('.cabinet-interior').hidden=false;
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
    if(model.levelId<=2)left-=12*ease((age-1400)/450);
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
  // Плечо и рукав проходят за мамой, кисть лежит поверх её дальнего плеча.
  for (const selector of ['.story-hug-back','.story-hug-arm']) {
    const arm = document.querySelector(selector),kissBack=kind==='intro'&&selector==='.story-hug-back';
    arm.hidden = kind !== 'outro'&&!kissBack;
    arm.dataset.scene=kind;
    if(selector==='.story-hug-back')arm.querySelector('img').src=kissBack?'assets/dad-kiss-standing.png':'assets/dad-hug-standing.png';
    arm.style.left = left + '%'; arm.style.opacity = kissBack?pose.kiss:pose.hug;
    arm.style.transform = dad.style.transform;
  }
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
  if(model.levelId===3){
    // Подросший малыш остаётся отдельным персонажем и в семейных сценах.
    mother.style.opacity=0;seated.style.opacity=0;legs.style.opacity=0;
    babySmile.style.opacity=0;babyFront.hidden=true;
    let idle=family.querySelector('.family-idle');
    if(!idle){idle=family.querySelector('.family-empty').cloneNode(false);idle.className='family-empty family-idle';idle.src='assets/mother-idle-arms-down.png';family.querySelector('.family-visual').append(idle);}
    family.style.left=(40+3*(kind==='intro'?ease((age-3500)/500):0))+'%';
    idle.style.opacity=1;idle.style.scale='1';idle.style.transform='scale(-1.52,1.52)';
    const child=$('explorer-baby'),width=18*EXPLORER_BABY_SCALE;
    const childPosition=kind==='outro'?(model.explorer?.storyPosition||model.explorer?.position||EXPLORER_START):EXPLORER_START;
    child.hidden=false;child.disabled=true;child.dataset.pose='sit';child.dataset.face='happy';
    child.style.left=(childPosition.x*100-width/2)+'%';
    child.style.top=(childPosition.y*100-width*room.clientWidth/room.clientHeight*1.1*.93)+'%';
    child.style.opacity=1;
    child.querySelector('.explorer-sit').style.display='';child.querySelector('.explorer-sit').style.opacity=1;
    child.querySelector('.explorer-crawl').style.opacity=1;
    const dadRect=dad.getBoundingClientRect(),roomRect=room.getBoundingClientRect();
    const dadFeet=(dadRect.top-roomRect.top+dadRect.height*.96)/roomRect.height;
    child.style.width=width+'%';child.style.zIndex=kind==='outro'&&childPosition.y<dadFeet?7:9;child.style.transform='none';
    child.querySelector('svg').style.transform='none';
    child.querySelector('.explorer-head').setAttribute('transform','translate(100 106) scale(.9) translate(-100 -106)');
    child.querySelector('.explorer-face').setAttribute('transform','');
    for(const [side,cx] of [['left',57],['right',143]]){
      const arm=child.querySelector('.explorer-arm-'+side);arm.setAttribute('transform','');
      arm.querySelector('path').setAttribute('d',side==='left'?'M72 114Q52 116 49 151L57 169':'M128 114Q147 117 151 151L143 169');
      arm.querySelector('ellipse').setAttribute('cx',cx);arm.querySelector('ellipse').setAttribute('cy',174);
    }
    for(const selector of ['.explorer-bottle','.explorer-zzz','.touch-marker'])child.querySelector(selector).hidden=true;
    renderReferenceBaby('sit','happy','story',elapsed,true);
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
  if (story) {
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
$('wipe-table').addEventListener('click',()=>{
  if(gameClock.paused||model.status!=='playing'||story)return;
  model.wipeTable(elapsedNow());render();
});
$('coffee').addEventListener('click',()=>{
  if(gameClock.paused||model.status!=='playing'||story)return;
  model.drinkCoffee(elapsedNow());render();
});
$('explorer-baby').addEventListener('click',()=>{
  if(model.levelId!==3||gameClock.paused||model.status!=='playing')return;
  model.answer(model.need?.action==='comfort'?'comfort':'hold',elapsedNow());render();
});
$('start').addEventListener('click', () => start(model.status === 'ready' ? 1 : model.levelId));
$('open-levels').addEventListener('click', openLevels);
$('levels-back').addEventListener('click', returnToTitle);
$('result-menu').addEventListener('click', returnToTitle);
$('choose-level-1').addEventListener('click', () => start(1));
$('choose-level-2').addEventListener('click', () => start(2));
$('choose-level-3').addEventListener('click', () => start(3));
$('next-level').addEventListener('click', () => { if (model.status === 'won' && model.levelId < 3) start(model.levelId+1); });
$('pause').addEventListener('click', () => pause(true));
$('resume').addEventListener('click', resume);
$('main-menu').addEventListener('click', returnToTitle);
$('restart').addEventListener('click', () => {
  if (story ? !storyClock.paused : !gameClock.paused || model.status !== 'playing') return;
  $('pause-menu').hidden = true; $('confirm-restart').hidden = false; $('cancel-restart').focus();
});
$('cancel-restart').addEventListener('click', () => {
  $('confirm-restart').hidden = true; $('pause-menu').hidden = false; $('restart').focus();
});
$('confirm-start').addEventListener('click', () => {
  if ((story ? storyClock.paused : gameClock.paused && model.status === 'playing') && !$('confirm-restart').hidden) start();
});
document.addEventListener('visibilitychange', () => { if (document.hidden) pause(); else resumeStory(); syncMusic(); });
window.addEventListener('blur', pause);
window.addEventListener('pagehide', pause);
window.addEventListener('focus', resumeStory);
document.addEventListener('keydown', event => {
  if (event.key !== 'Escape' || (model.status !== 'playing' && !story)) return;
  if (!(story ? storyClock.paused : gameClock.paused)) pause(true);
  else if (!$('confirm-restart').hidden) $('cancel-restart').click();
  else resume();
});

// Этот слой меняет только надписи: не читает часы и не обновляет модель игры.
function updateLocalizedState() {
  if(model.levelId===3)$('explorer-baby').setAttribute('aria-label',t(model.need?.action==='hold'?'needHold':'comfortBaby'));
  $('hearts').setAttribute('aria-label', t('hearts', {count: model.hearts}));
  $('need-text').textContent = model.pending ? t(model.need.text) : t(model.status === 'ready' ? 'world' : 'helping');
  $('message').textContent = t(model.feedback);
  const ended = model.status === 'won' || model.status === 'lost';
  $('next-level').hidden = !(model.status === 'won' && model.levelId < 3);
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
    $('screen-description').textContent = t(result === 'won' && model.levelId >= 2 ? 'wonLevel'+model.levelId : result + 'Description', {count: model.hearts});
    $('start').textContent = t('restart');
    document.querySelector('.card-note').textContent = t(result === 'won' && model.levelId < 3 ? (model.levelId===1?'unlocked':'unlocked3') : result + 'Note');
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
