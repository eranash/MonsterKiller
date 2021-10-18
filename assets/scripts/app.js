const ATTACK_VALUE = 10;
const STRONG_ATTACK_VALUE = 17;
const MONSTER_ATTACK_VALUE = 14;
const HEAL_VALUE = 20;

const MODE_ATTACK = "ATTACK";
const MODE_STRONG_ATTACK = "STRONG_ATTACK";
const LOG_EVENT_PLAYER_ATTACK = "PLAYER_ATTACK";
const LOG_EVENT_PLAYER_STRONG_ATTACK = "PLAYER_STRONG_ATTACK";
const LOG_EVENT_MONSTER_ATTACK = "MONSTER_ATTACK";
const LOG_EVENT_PLAYER_HEAL = "PLAYER_HEAL";
const LOG_EVENT_GAME_OVER = "GAME_OVER";

let battleLog = [];
let lastLoggedEntry;

function getMaxLifeValues() {
  let parsedValue = +prompt("max life:");
  if (isNaN(parsedValue) || parsedValue <= 0) {
    throw { message: "invalid user input NaN" };
  }
  return parsedValue;
}

let chosenMaxLife;

try {
  chosenMaxLife = getMaxLifeValues();
} catch (error) {
  console.log(error);
  chosenMaxLife = 100;
} 

let cuurMonsterHealth = chosenMaxLife;
let cuurPlayerHealth = chosenMaxLife;
let hasBonudLife = true;

adjustHealthBars(chosenMaxLife);
let logEntry;

function writeToLog(event, value, monsterHealt, playerHealt) {
  if (event === LOG_EVENT_PLAYER_ATTACK) {
    logEntry = {
      event: event,
      value: value,
      target: "MONSTER",
      finalMonsterHealth: monsterHealt,
      finalPlayerHealth: playerHealt,
    };
  } else if (event === LOG_EVENT_PLAYER_STRONG_ATTACK) {
    logEntry = {
      event: event,
      value: value,
      target: "MONSTER",
      finalMonsterHealth: monsterHealt,
      finalPlayerHealth: playerHealt,
    };
  } else if (event === LOG_EVENT_MONSTER_ATTACK) {
    logEntry = {
      event: event,
      value: value,
      target: "PLAYER",
      finalMonsterHealth: monsterHealt,
      finalPlayerHealth: playerHealt,
    };
  } else if (event === LOG_EVENT_PLAYER_HEAL) {
    logEntry = {
      event: event,
      value: value,
      target: "PLAYER",
      finalMonsterHealth: monsterHealt,
      finalPlayerHealth: playerHealt,
    };
  } else if (event === LOG_EVENT_GAME_OVER) {
    logEntry = {
      event: event,
      value: value,
      finalMonsterHealth: monsterHealt,
      finalPlayerHealth: playerHealt,
    };
  }
  battleLog.push(logEntry);
}

function reset() {
  cuurMonsterHealth = chosenMaxLife;
  cuurPlayerHealth = chosenMaxLife;
  resetGame(chosenMaxLife);
}

function attackMonster(mode) {
  let maxDamage;
  let logEvent;
  if (mode === MODE_ATTACK) {
    maxDamage = ATTACK_VALUE;
    logEvent = LOG_EVENT_PLAYER_ATTACK;
  } else if (mode === MODE_STRONG_ATTACK) {
    maxDamage = STRONG_ATTACK_VALUE;
    logEvent = LOG_EVENT_PLAYER_STRONG_ATTACK;
  }
  const damage = dealMonsterDamage(maxDamage);
  cuurMonsterHealth -= damage;
  writeToLog(logEvent, damage, cuurMonsterHealth, cuurPlayerHealth);
  endRound();
}

function endRound() {
  const initialPlayerHealth = cuurPlayerHealth;
  const playerDamage = dealPlayerDamage(MONSTER_ATTACK_VALUE);
  cuurPlayerHealth -= playerDamage;
  writeToLog(
    LOG_EVENT_MONSTER_ATTACK,
    playerDamage,
    cuurMonsterHealth,
    cuurPlayerHealth
  );

  if (cuurPlayerHealth <= 0 && hasBonudLife) {
    hasBonudLife = false;
    removeBonusLife();
    cuurPlayerHealth = initialPlayerHealth;
    alert("bonus life");
    setPlayerHealth(initialPlayerHealth);
  }

  if (cuurMonsterHealth <= 0 && cuurPlayerHealth > 0) {
    alert("won");
    writeToLog(
      LOG_EVENT_GAME_OVER,
      "player won",
      cuurMonsterHealth,
      cuurPlayerHealth
    );
  } else if (cuurPlayerHealth <= 0 && cuurMonsterHealth > 0) {
    alert("lose");
    writeToLog(
      LOG_EVENT_GAME_OVER,
      "monster won",
      cuurMonsterHealth,
      cuurPlayerHealth
    );
  } else if (cuurPlayerHealth <= 0 && cuurMonsterHealth <= 0) {
    alert("draw");
    writeToLog(
      LOG_EVENT_GAME_OVER,
      "draw",
      cuurMonsterHealth,
      cuurPlayerHealth
    );
  }
  if (cuurPlayerHealth <= 0 || cuurMonsterHealth <= 0) {
    reset();
  }
}

function attackHandler() {
  attackMonster(MODE_ATTACK);
}

function strongAttackHandler() {
  attackMonster(MODE_STRONG_ATTACK);
}

function healPlayerHandler() {
  let healValue;
  if (cuurPlayerHealth >= chosenMaxLife - HEAL_VALUE) {
    alert("cant");
    healValue = chosenMaxLife - cuurPlayerHealth;
  } else {
    healValue = HEAL_VALUE;
  }
  increasePlayerHealth(healValue);
  cuurPlayerHealth += healValue;
  writeToLog(
    LOG_EVENT_PLAYER_HEAL,
    healValue,
    cuurMonsterHealth,
    cuurPlayerHealth
  );
  endRound();
}

function printLogHandler() {
  let i = 0;
  for (const log of battleLog) {
    if ((!lastLoggedEntry && lastLoggedEntry !== 0) || lastLoggedEntry < i) {
      console.log(`#${i}`);
      for (const key in logEntry) {
        console.log(key);
        console.log(logEntry[key]);
      }
      lastLoggedEntry = i;
      break;
    }
    i++;
  }
}

attackBtn.addEventListener("click", attackHandler);
strongAttackBtn.addEventListener("click", strongAttackHandler);
healBtn.addEventListener("click", healPlayerHandler);
logBtn.addEventListener("click", printLogHandler);
