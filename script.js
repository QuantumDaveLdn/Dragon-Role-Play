// ---=== Game Variables ===---
let xp = 0;
let health = 100;
let gold = 50;
let currentWeapon = 0; // Index in the weapons array
let fighting; // Index of the monster being fought
let monsterHealth;
let inventory = ["stick"]; // Player starts with a stick

// ---=== DOM Elements ===---
const button1 = document.querySelector('#button1');
const button2 = document.querySelector("#button2");
const button3 = document.querySelector("#button3");
const text = document.querySelector("#text");
const xpText = document.querySelector("#xpText");
const healthText = document.querySelector("#healthText");
const goldText = document.querySelector("#goldText");
const monsterStats = document.querySelector("#monsterStats");
const monsterName = document.querySelector("#monsterName");
const monsterHealthText = document.querySelector("#monsterHealth");
const locationImage = document.querySelector("#locationImage"); // Get the image element

// ---=== Game Data ===---

// Weapons available in the game
const weapons = [
  { name: 'stick', power: 5 },
  { name: 'dagger', power: 30 },
  { name: 'claw hammer', power: 50 },
  { name: 'sword', power: 100 }
];

// Monsters the player can fight
const monsters = [
  {
    name: "Slime", 
    level: 2,
    health: 15,
    image: "https://placehold.co/500x200/448844/ffffff?text=Slime+Ambush!" // Placeholder Slime image
  },
  {
    name: "Fanged Beast", 
    level: 8,
    health: 60,
    image: "https://placehold.co/500x200/884444/ffffff?text=Fanged+Beast+Attack!" // Placeholder Beast image
  },
  {
    name: "Dragon", 
    level: 20,
    health: 300,
    image: "https://placehold.co/500x200/aa2222/ffffff?text=DRAGON+FIRE!" // Placeholder Dragon image
  }
];

// Locations in the game
const locations = [
  {
    name: "town square",
    "button text": ["<i class='fas fa-store'></i> Go to store", "<i class='fas fa-dungeon'></i> Go to cave", "<i class='fas fa-dragon'></i> Fight dragon"],
    "button functions": [goStore, goCave, fightDragon],
    text: "You stand in the dusty town square. The air hangs heavy. Where will your path lead?",
    image: "https://placehold.co/500x200/8b4513/ffffff?text=Town+Square" // Placeholder Town image
  },
  {
    name: "store",
    "button text": ["<i class='fas fa-heart-circle-plus'></i> Buy Health (10 Gold)", "<i class='fas fa-gavel'></i> Buy Weapon (30 Gold)", "<i class='fas fa-arrow-left'></i> To Town Square"], // Default texts
    "button functions": [buyHealth, buyWeapon, goTown], // Default functions
    text: "You enter the dimly lit store. The shopkeeper eyes you warily.",
    image: "https://placehold.co/500x200/664422/ffffff?text=General+Store" // Placeholder Store image
  },
  {
    name: "cave",
    "button text": ["<i class='fas fa-spider'></i> Fight Slime", "<i class='fas fa-paw'></i> Fight Fanged Beast", "<i class='fas fa-arrow-left'></i> To Town Square"],
    "button functions": [fightSlime, fightBeast, goTown],
    text: "You cautiously enter the damp cave. Strange noises echo from the darkness.",
    image: "https://placehold.co/500x200/444455/cccccc?text=Dark+Cave+Entrance" // Placeholder Cave image
  },
  {
    name: "fight",
    "button text": ["<i class='fas fa-khanda'></i> Attack", "<i class='fas fa-shield-alt'></i> Dodge", "<i class='fas fa-running'></i> Run"],
    "button functions": [attack, dodge, goTown],
    text: "A fearsome monster blocks your path! Prepare for battle!"
    // Image will be set dynamically in goFight()
  },
  {
    name: "kill monster",
    "button text": ["<i class='fas fa-arrow-left'></i> To Town Square", "<i class='fas fa-arrow-left'></i> To Town Square", "<i class='fas fa-question'></i> ????"], // Changed last button for Easter Egg hint
    "button functions": [goTown, goTown, easterEgg], // Keep Easter Egg function
    text: 'The monster lets out a final shriek and collapses! You gain experience and find some gold.',
    image: "https://placehold.co/500x200/556B2F/ffffff?text=Victory!" // Placeholder Victory image
  },
  {
    name: "lose",
    "button text": ["<i class='fas fa-redo'></i> REPLAY?", "<i class='fas fa-redo'></i> REPLAY?", "<i class='fas fa-redo'></i> REPLAY?"],
    "button functions": [restart, restart, restart],
    text: "Darkness claims you... Your journey ends here. <i class='fas fa-skull-crossbones'></i>",
    image: "https://placehold.co/500x200/111111/ff0000?text=YOU+DIED" // Placeholder Lose image
  },
  {
    name: "win",
    "button text": ["<i class='fas fa-redo'></i> REPLAY?", "<i class='fas fa-redo'></i> REPLAY?", "<i class='fas fa-redo'></i> REPLAY?"],
    "button functions": [restart, restart, restart],
    text: "The Dragon falls! The town is saved! YOU ARE VICTORIOUS! <i class='fas fa-crown'></i>",
    image: "https://placehold.co/500x200/ffd700/000000?text=YOU+WIN!" // Placeholder Win image
  },
  {
    name: "easter egg",
    "button text": ["Pick 2", "Pick 8", "<i class='fas fa-arrow-left'></i> To Town Square"],
    "button functions": [pickTwo, pickEight, goTown],
    text: "You stumble upon a hidden game of chance! Pick a number (2 or 8). Ten numbers between 0 and 10 will be drawn. Match one, and you win gold!",
    image: "https://placehold.co/500x200/4b0082/ffffff?text=Secret+Game!" // Placeholder Easter Egg image
  }
];

// ---=== Initial Setup ===---
goTown(); // Start in the town square

// ---=== Core Functions ===---

/**
 * Finds the index of the best weapon the player owns from the weapons array.
 * @returns {number} The index of the best owned weapon in the weapons array.
 */
function getBestOwnedWeaponIndex() {
    for (let i = weapons.length - 1; i >= 0; i--) {
        if (inventory.includes(weapons[i].name)) {
            return i;
        }
    }
    return 0; // Should always find at least the stick
}

/**
 * Updates the game display based on the current location.
 * @param {object} location - The location object from the locations array.
 */
function update(location) {
  // Hide monster stats by default
  monsterStats.style.display = "none";

  // Update buttons text and functionality
  button1.innerHTML = location["button text"][0];
  button2.innerHTML = location["button text"][1];
  button3.innerHTML = location["button text"][2];
  button1.onclick = location["button functions"][0];
  button2.onclick = location["button functions"][1];
  button3.onclick = location["button functions"][2];

  // Special handling for the store's second button (Buy/Sell Weapon)
  if (location.name === "store") {
    if (currentWeapon >= weapons.length - 1) { // If player has the best weapon
       if (inventory.length > 1) { // And has more than just the stick
           button2.innerHTML = "<i class='fas fa-dollar-sign'></i> Sell Weapon (15 Gold)";
           button2.onclick = sellWeapon;
       } else { // Has best weapon but ONLY that weapon (or stick)
           button2.innerHTML = "<i class='fas fa-times-circle'></i> Max Weapon";
           button2.onclick = null; // Disable button or give feedback
           
           // text.innerHTML += "<br>You already wield the mightiest weapon!";
       }
    } else { // Player doesn't have the best weapon yet
        button2.innerHTML = "<i class='fas fa-gavel'></i> Buy Weapon (30 Gold)";
        button2.onclick = buyWeapon;
    }
  }


  
  text.innerHTML = location.text; 
 
  if (location.image) {
    locationImage.src = location.image;
    locationImage.alt = location.name; 
  }
}

// --- Navigation Functions ---
function goTown() {
  update(locations[0]);
}

function goStore() {
  currentWeapon = getBestOwnedWeaponIndex(); // Ensure weapon index is correct on entering store
  update(locations[1]);
   // Add inventory display when entering store
  text.innerHTML += "<br><br>Inventory: " + inventory.join(', ');
}

function goCave() {
  update(locations[2]);
}

// --- Action Functions ---
function buyHealth() {
  if (gold >= 10) {
    gold -= 10;
    health += 10;
    goldText.innerText = gold;   
    healthText.innerText = health; 
    text.innerHTML = "You feel reinvigorated! <i class='fas fa-plus-circle'></i> (+10 Health)";
    text.innerHTML += "<br><br>Inventory: " + inventory.join(', '); // Keep inventory display
  } else {
    text.innerHTML = "The shopkeeper scoffs, 'Not enough gold, adventurer!'";
    text.innerHTML += "<br><br>Inventory: " + inventory.join(', '); // Keep inventory display
  }
}

function buyWeapon() {
    // Check if player already has the next weapon or better
    if (currentWeapon < weapons.length - 1) { // Can buy if not max weapon
        let nextWeaponIndex = currentWeapon + 1; // Intended weapon to buy
         // Ensure we don't try to buy beyond the array
        if (nextWeaponIndex >= weapons.length) {
             text.innerHTML = "You already have the best weapon!";
             update(locations[1]); // Refresh store view
             text.innerHTML += "<br><br>Inventory: " + inventory.join(', ');
             return;
        }

        let nextWeapon = weapons[nextWeaponIndex];

        if (gold >= 30) {
            gold -= 30;
            goldText.innerText = gold; 
            inventory.push(nextWeapon.name); 
            currentWeapon = nextWeaponIndex; // Update current weapon index to the one just bought
            text.innerHTML = `You acquired a ${nextWeapon.name}! <i class='fas fa-tools'></i>`;
            update(locations[1]); // Refresh store view to update button state
            text.innerHTML += "<br><br>Inventory: " + inventory.join(', '); // Show inventory
        } else {
            text.innerHTML = "The shopkeeper shakes his head, 'Come back when you have more coin.'";
            text.innerHTML += "<br><br>Inventory: " + inventory.join(', '); // Show inventory
        }
    } else {
        text.innerHTML = "You already wield the mightiest weapon available here!";
        update(locations[1]);
        text.innerHTML += "<br><br>Inventory: " + inventory.join(', ');
    }
}


function sellWeapon() {
  if (inventory.length > 1) { // Can only sell if more than one weapon
    gold += 15;
    goldText.innerText = gold;
    // Sell the WEAKEST weapon that isn't the 'stick'
    let weaponToSell = null;
    let sellIndexInInventory = -1;
    let weakestWeaponIndexInWeapons = Infinity; // Start with a high index

    // Iterate through the player's inventory
    for (let i = 0; i < inventory.length; i++) {
        if (inventory[i] !== 'stick') {
             // Find the weapon object corresponding to this inventory item
             let weaponIndexInWeapons = weapons.findIndex(w => w.name === inventory[i]);

             // Check if this weapon is weaker than the current weakest found
             if (weaponIndexInWeapons !== -1 && weaponIndexInWeapons < weakestWeaponIndexInWeapons) {
                  weakestWeaponIndexInWeapons = weaponIndexInWeapons;
                  weaponToSell = inventory[i];
                  sellIndexInInventory = i;
             }
        }
    }

     if (weaponToSell && sellIndexInInventory > -1) {
        inventory.splice(sellIndexInInventory, 1); // Remove the weakest weapon from inventory
        currentWeapon = getBestOwnedWeaponIndex(); // Recalculate best owned weapon index
        text.innerHTML = `You sold the ${weaponToSell} for 15 gold.`;
        update(locations[1]); // Refresh store view to update button state
        text.innerHTML += "<br><br>Inventory: " + inventory.join(', '); // Show updated inventory
    } else {
         text.innerHTML = "Couldn't find a weapon to sell (besides your trusty stick!).";
         update(locations[1]); 
         text.innerHTML += "<br><br>Inventory: " + inventory.join(', ');
    }

  } else {
    text.innerHTML = "Don't sell your only means of defense!";
    update(locations[1]); 
    text.innerHTML += "<br><br>Inventory: " + inventory.join(', ');
  }
}

// --- Combat Functions ---
function fightSlime() {
  fighting = 0; // Index of slime in monsters array
  goFight();
}

function fightBeast() {
  fighting = 1; // Index of fanged beast
  goFight();
}

function fightDragon() {
  fighting = 2; // Index of dragon
  goFight();
}

/**
 * Transitions the game state to the fight scene.
 */
function goFight() {
  currentWeapon = getBestOwnedWeaponIndex(); // Ensure using best weapon before fight
  update(locations[3]); // Update to the 'fight' location layout
  monsterHealth = monsters[fighting].health; // Get monster's health
  locationImage.src = monsters[fighting].image;
  locationImage.alt = `Fighting ${monsters[fighting].name}`;

  monsterStats.style.display = "flex"; // Show monster stats (use flex for alignment)
  monsterName.innerText = monsters[fighting].name; // Display monster name
  monsterHealthText.innerText = monsterHealth; // Display monster health
}

/**
 * Handles the player's attack action.
 */
function attack() {
  // Ensure we are using the best weapon
  currentWeapon = getBestOwnedWeaponIndex();
  const weaponPower = weapons[currentWeapon].power;
  const weaponName = weapons[currentWeapon].name;

  // Player attacks monster
  text.innerHTML = `You strike the ${monsters[fighting].name} with your ${weaponName}. `;
  let playerDamage = weaponPower + Math.floor(Math.random() * xp) + 1;
  let monsterHit = isMonsterHit(); // Check if player hits

  if (monsterHit) {
    monsterHealth -= playerDamage;
     text.innerHTML += `<br><i class='fas fa-burst'></i> You hit for ${playerDamage} damage!`;
  } else {
    text.innerHTML += "<br><i class='fas fa-times'></i> You miss!";
  }
  monsterHealthText.innerText = monsterHealth < 0 ? 0 : monsterHealth; // Update monster health display

  // Monster attacks player (if still alive)
  if (monsterHealth > 0) {
      let monsterDamage = getMonsterAttackValue(monsters[fighting].level);
      health -= monsterDamage;
      healthText.innerText = health < 0 ? 0 : health; // Update player health display
      text.innerHTML += `<br>The ${monsters[fighting].name} retaliates for ${monsterDamage} damage! <i class='fas fa-fire'></i>`;
  } else {
      // Monster defeated, check win/defeat conditions later
  }

  // Check for win/lose conditions AFTER both attacks
  if (health <= 0) {
    lose();
  } else if (monsterHealth <= 0) {
    // Make sure lose condition isn't also met
    if (health > 0) {
        if (fighting === 2) { // If it was the dragon
          winGame();
        } else {
          defeatMonster(); // Defeated a non-dragon monster
        }
    } else {
        lose(); // Player died on the same turn monster was defeated
    }
  } else {
      // Fight continues, check for weapon break
      // Weapon breaks if not stick (currentWeapon > 0), have more than one weapon, and random chance hits
      if (currentWeapon > 0 && inventory.length > 1 && Math.random() <= 0.1) {
         const brokenWeaponName = weapons[currentWeapon].name;
         text.innerHTML += `<br>Oh no! Your ${brokenWeaponName} breaks! <i class='fas fa-heart-crack'></i>`;

         // Find and remove the broken weapon from inventory
         const brokenWeaponInventoryIndex = inventory.indexOf(brokenWeaponName);
         if (brokenWeaponInventoryIndex > -1) {
             inventory.splice(brokenWeaponInventoryIndex, 1);
         }

         // Update currentWeapon to the best remaining weapon
         currentWeapon = getBestOwnedWeaponIndex();
         text.innerHTML += `<br>You switch to your ${weapons[currentWeapon].name}.`;
      }
  }
}


/**
 * Calculates the monster's attack damage based on its level and player XP.
 * @param {number} level - The monster's level.
 * @returns {number} - The calculated attack damage (non-negative).
 */
function getMonsterAttackValue(level) {
  // Attack is 5 times the monster's level minus a random value based on player XP
  const hit = (level * 5) - (Math.floor(Math.random() * xp));
  // Ensure attack damage is not negative
  return hit > 0 ? hit : 0;
}

/**
 * Determines if the player's attack hits the monster.
 * @returns {boolean} - True if the attack hits, false otherwise.
 */
function isMonsterHit() {
  // 80% base hit chance OR guaranteed hit if player health is low
  return Math.random() > 0.2 || health < 20;
}

/**
 * Handles the player's dodge action.
 */
function dodge() {
  text.innerHTML = `You deftly dodge the attack from the ${monsters[fighting].name}. <i class='fas fa-wind'></i>`;
  
}

/**
 * Updates game state after defeating a non-dragon monster.
 */
function defeatMonster() {
  let earnedGold = Math.floor(monsters[fighting].level * 6.7);
  let earnedXp = monsters[fighting].level;
  gold += earnedGold;
  xp += earnedXp;
  goldText.innerText = gold; // Update display
  xpText.innerText = xp;   // Update display
  update(locations[4]); // Go to the 'kill monster' screen
  text.innerHTML += `<br>You gained ${earnedXp} XP and ${earnedGold} Gold!`;
}

/**
 * Updates game state when the player loses.
 */
function lose() {
  update(locations[5]); // Go to the 'lose' screen
  healthText.innerText = 0; // Ensure health shows 0
}

/**
 * Updates game state when the player wins the game (defeats dragon).
 */
function winGame() {
  update(locations[6]); // Go to the 'win' screen
}

/**
 * Resets the game to its initial state for replay.
 */
function restart() {
  xp = 0;
  health = 100;
  gold = 50;
  currentWeapon = 0;
  inventory = ["stick"];
  // Update displays
  goldText.innerText = gold;
  healthText.innerText = health;
  xpText.innerText = xp;
  // Go back to town
  goTown();
}

// --- Easter Egg Functions ---
function easterEgg() {
  update(locations[7]);
}

function pickTwo() {
  pick(2);
}

function pickEight() {
  pick(8);
}

/**
 * Handles the logic for the Easter Egg number guessing game.
 * @param {number} guess - The number chosen by the player (2 or 8).
 */
function pick(guess) {
  const numbers = [];
  // Generate 10 random numbers between 0 and 10
  while (numbers.length < 10) {
    numbers.push(Math.floor(Math.random() * 11));
  }
  // Display the results
  text.innerHTML = "You picked " + guess + ". The drawn numbers are:<br>";
  text.innerHTML += numbers.join(', ') + "<br><br>"; // Display numbers clearly

  if (numbers.includes(guess)) {
    text.innerHTML += "Right! You win 20 gold! <i class='fas fa-sack-dollar'></i>";
    gold += 20;
    goldText.innerText = gold;
  } else {
    text.innerHTML += "Wrong! You lose 10 health! <i class='fas fa-heart-crack'></i>";
    health -= 10;
    healthText.innerText = health < 0 ? 0 : health; // Prevent negative health display
    if (health <= 0) {
        text.innerHTML += "<br>The bad luck was fatal!"; // Add specific message
        // Delay the lose screen slightly so the player sees the outcome
        setTimeout(lose, 1500);
    }
  }
}
// ---=== End of Game Logic ===---
