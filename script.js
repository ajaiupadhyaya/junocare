document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const appContainer = document.getElementById('app-container');

    // Core Juno display elements (ENSURING ALL ARE PRESENT)
    const junoMoodElement = document.getElementById('juno-mood');
    const junoHungerElement = document.getElementById('juno-hunger');
    const junoEnergyElement = document.getElementById('juno-energy');
    const junoPlayfulnessElement = document.getElementById('juno-playfulness');
    const junoMoodEmojiElement = document.getElementById('juno-mood-emoji'); // THIS WAS LIKELY THE CULPRIT
    const junoSpriteElement = document.getElementById('juno-sprite');
    const junoDisplayArea = document.getElementById('juno-display-area');
    const junoThoughtBubble = document.getElementById('juno-thought-bubble');
    const junoHatSlot = document.getElementById('juno-hat-slot'); // Outfit slot

    // PawCoin elements
    const pawCoinsElement = document.getElementById('paw-coins');
    const shopPawCoinsElement = document.getElementById('shop-paw-coins');

    // Task list and Quote elements
    const taskListElement = document.getElementById('task-list');
    const quoteTextElement = document.getElementById('quote-text');
    const quoteAuthorElement = document.getElementById('quote-author');

    // Action buttons
    const feedButton = document.getElementById('feed-button');
    const playTreatCatchButton = document.getElementById('play-treat-catch-button');
    const playSkyHopButton = document.getElementById('play-sky-hop-button');
    const sleepButton = document.getElementById('sleep-button');

    // Shop modal elements
    const shopButton = document.getElementById('shop-button');
    const closeShopButton = document.getElementById('close-shop-button');
    const shopModal = document.getElementById('shop-modal');
    const shopItemsContainer = document.getElementById('shop-items-container');

    // Outfit Inventory Elements
    const outfitsButton = document.getElementById('outfits-button');
    const outfitInventoryModal = document.getElementById('outfit-inventory-modal');
    const closeOutfitsButton = document.getElementById('close-outfits-button');
    const outfitItemsContainer = document.getElementById('outfit-items-container');
    const unequipAllButton = document.getElementById('unequip-all-button');

    // Side Quest Elements
    const questListElement = document.getElementById('quest-list');

    // Treat Catch Game Elements
    const treatCatchModal = document.getElementById('treat-catch-modal');
    const closeTreatCatchButton = document.getElementById('close-treat-catch-button');
    const gameInstructionsTreatCatch = document.getElementById('game-instructions-treat-catch');
    const startTreatCatchButton = document.getElementById('start-treat-catch-button');
    const gameAreaTreatCatch = document.getElementById('game-area-treat-catch');
    const gameCatcherTreatCatch = document.getElementById('game-catcher-treat-catch');
    const gameScoreDisplayTreatCatch = document.getElementById('game-score-display-treat-catch');
    const gameTimerDisplayTreatCatch = document.getElementById('game-timer-display-treat-catch');
    const gameOverScreenTreatCatch = document.getElementById('game-over-screen-treat-catch');
    const finalScoreDisplayTreatCatch = document.getElementById('final-score-treat-catch');
    const gameRewardDisplayTreatCatch = document.getElementById('game-reward-treat-catch');
    const playAgainTreatCatchButton = document.getElementById('play-again-treat-catch-button');

    // Sky Hop Game Elements
    const skyHopModal = document.getElementById('sky-hop-modal');
    const closeSkyHopButton = document.getElementById('close-sky-hop-button');
    const gameInstructionsSkyHop = document.getElementById('game-instructions-sky-hop');
    const startSkyHopButton = document.getElementById('start-sky-hop-button');
    const gameAreaSkyHop = document.getElementById('game-area-sky-hop');
    const skyHopCanvas = document.getElementById('sky-hop-canvas');
    const skyHopCtx = skyHopCanvas.getContext('2d');
    const gameScoreDisplaySkyHop = document.getElementById('game-score-display-sky-hop');
    const gameOverScreenSkyHop = document.getElementById('game-over-screen-sky-hop');
    const finalScoreDisplaySkyHop = document.getElementById('final-score-sky-hop');
    const gameRewardDisplaySkyHop = document.getElementById('game-reward-sky-hop');
    const playAgainSkyHopButton = document.getElementById('play-again-sky-hop-button');


    // --- Game State & Configuration ---
    let juno = {
        mood: 100, hunger: 80, energy: 90, playfulness: 70,
        inventory: { outfits: [] },
        equippedOutfit: null
    };
    let pawCoins = 0;
    let lastSavedDay = new Date().toDateString();
    const initialTasks = [
        { id: 1, text: "💧 Drink Water (8 glasses)", completed: false, reward: 5 },
        { id: 2, text: "🦷 Brush Teeth (2 mins)", completed: false, reward: 5 },
        { id: 3, text: "☀️ Morning Stretch (5 mins)", completed: false, reward: 10 },
        { id: 4, text: "🍎 Eat a Healthy Snack", completed: false, reward: 7 },
        { id: 5, text: "🧘 Mindful Moment (3 mins)", completed: false, reward: 10 },
        { id: 6, text: "🧹 Quick Tidy-Up (10 mins)", completed: false, reward: 15 },
        { id: 7, text: "📖 Read a Page or Two", completed: false, reward: 8 }
    ];
    let selfCareTasks = [...initialTasks];

    const shopItems = [
        { id: 'food_basic', name: 'Basic Kibble', price: 2, description: '+15 Hunger, +5 Mood', type: 'food', effects: { hunger: 15, mood: 5 } },
        { id: 'food_premium', name: 'Tuna Delight', price: 5, description: '+30 Hunger, +15 Mood', type: 'food', effects: { hunger: 30, mood: 15 } },
        { id: 'toy_mouse', name: 'Toy Mouse', price: 10, description: '+25 Play, +5 Mood', type: 'toy', effects: { playfulness: 25, mood: 5 } },
        { id: 'party-hat-red', name: 'Red Party Hat', price: 25, description: 'A festive red party hat!', type: 'outfit', outfitSlot: 'head', icon: '🎉' },
        { id: 'bow-blue', name: 'Blue Bow', price: 20, description: 'A cute blue bow.', type: 'outfit', outfitSlot: 'head', icon: '🎀' }
    ];

    let dailyQuests = [];
    const questDefinitions = [
        { id: 'feed_3_times', description: "Feed Juno 3 times today.", target: 3, current: 0, reward: 15, eventType: 'feed', completed: false },
        { id: 'play_high_score_catch', description: "Score 50+ in Treat Catch.", target: 50, current: 0, reward: 20, eventType: 'game_score_treat_catch', completed: false }
    ];

    const STAT_DECREASE_INTERVAL = 60000;
    const THOUGHT_BUBBLE_INTERVAL = 45000;
    const MOOD_IMPACT_LOW_STAT = 5;

    let treatCatchGameLoop, treatCatchTreatInterval, treatCatchTimerInterval;
    let treatCatchTimeLeft, treatCatchCurrentScore;
    const TREAT_CATCH_GAME_DURATION = 30;
    const CATCHER_SPEED = 20; const TREAT_SPEED = 3; const TREAT_SPAWN_RATE = 1200;
    let treatCatchActiveTreats = [];

    let skyHopGameLoop;
    let skyHopPlayer, skyHopPlatforms, skyHopScore, skyHopGameOver;
    const SKY_HOP_PLAYER_SIZE = 20; const SKY_HOP_GRAVITY = 0.5; const SKY_HOP_JUMP_FORCE = -10;
    const SKY_HOP_PLATFORM_HEIGHT = 10; const SKY_HOP_PLATFORM_WIDTH = 70; const SKY_HOP_PLATFORM_GAP = 80;
    let skyHopPlayerImage;


    // --- UI Update Functions ---
    function animateStatChange(element) {
        element.dataset.animation = "pop";
        element.addEventListener('animationend', () => {
            delete element.dataset.animation;
        }, { once: true });
    }
    function flashStatChange(statElement, type) {
        const statContainer = statElement.closest('.stat');
        if (statContainer) {
            statContainer.classList.add(`stat-${type}`);
            setTimeout(() => statContainer.classList.remove(`stat-${type}`), 700);
        }
    }

    function updateJunoVisuals() {
        if (juno.mood > 80) { junoMoodEmojiElement.textContent = '😊'; junoSpriteElement.className = 'juno-sprite juno-idle juno-happy'; }
        else if (juno.mood > 60) { junoMoodEmojiElement.textContent = '🙂'; junoSpriteElement.className = 'juno-sprite juno-idle'; }
        else if (juno.mood > 40) { junoMoodEmojiElement.textContent = '😐'; junoSpriteElement.className = 'juno-sprite juno-neutral'; }
        else if (juno.mood > 20) { junoMoodEmojiElement.textContent = '😟'; junoSpriteElement.className = 'juno-sprite juno-sad'; }
        else { junoMoodEmojiElement.textContent = '😭'; junoSpriteElement.className = 'juno-sprite juno-sad'; }

        junoHatSlot.className = 'outfit-slot';
        const currentKnot = junoHatSlot.querySelector('.bow-knot');
        if (currentKnot) currentKnot.remove(); // Remove existing knot before potentially re-adding

        if (juno.equippedOutfit) {
            const outfitData = shopItems.find(item => item.id === juno.equippedOutfit && item.type === 'outfit');
            if (outfitData) {
                if (outfitData.outfitSlot === 'head') {
                    junoHatSlot.classList.add(`outfit-${juno.equippedOutfit}`);
                    if (juno.equippedOutfit === 'bow-blue') {
                         const knot = document.createElement('span');
                         knot.className = 'bow-knot';
                         junoHatSlot.appendChild(knot);
                    }
                }
            }
        }
    }

    function updateJunoStatsUI() {
        const oldStats = {
            mood: parseInt(junoMoodElement.textContent) || juno.mood, // Fallback to state if NaN
            hunger: parseInt(junoHungerElement.textContent) || juno.hunger,
            energy: parseInt(junoEnergyElement.textContent) || juno.energy,
            playfulness: parseInt(junoPlayfulnessElement.textContent) || juno.playfulness
        };

        junoMoodElement.textContent = juno.mood;
        junoHungerElement.textContent = juno.hunger;
        junoEnergyElement.textContent = juno.energy;
        junoPlayfulnessElement.textContent = juno.playfulness;

        updateJunoVisuals();

        if (juno.mood !== oldStats.mood) { animateStatChange(junoMoodElement); flashStatChange(junoMoodElement, juno.mood > oldStats.mood ? 'increased' : 'decreased'); }
        if (juno.hunger !== oldStats.hunger) { animateStatChange(junoHungerElement); flashStatChange(junoHungerElement, juno.hunger > oldStats.hunger ? 'increased' : 'decreased'); }
        if (juno.energy !== oldStats.energy) { animateStatChange(junoEnergyElement); flashStatChange(junoEnergyElement, juno.energy > oldStats.energy ? 'increased' : 'decreased'); }
        if (juno.playfulness !== oldStats.playfulness) { animateStatChange(junoPlayfulnessElement); flashStatChange(junoPlayfulnessElement, juno.playfulness > oldStats.playfulness ? 'increased' : 'decreased'); }

        appContainer.classList.remove('mood-super-happy', 'mood-happy', 'mood-neutral', 'mood-sad', 'mood-very-sad');
        if (juno.mood > 90) appContainer.classList.add('mood-super-happy');
        else if (juno.mood > 70) appContainer.classList.add('mood-happy');
        else if (juno.mood > 40) appContainer.classList.add('mood-neutral');
        else if (juno.mood > 20) appContainer.classList.add('mood-sad');
        else appContainer.classList.add('mood-very-sad');
    }

    function updatePawCoinsUI() {
        pawCoinsElement.textContent = pawCoins;
        shopPawCoinsElement.textContent = pawCoins;
        animateStatChange(pawCoinsElement);
    }
    function renderTasks() {
        taskListElement.innerHTML = '';
        selfCareTasks.forEach(task => {
            const listItem = document.createElement('li');
            listItem.dataset.taskId = task.id; if (task.completed) listItem.classList.add('completed');
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox'; checkbox.id = `task-${task.id}`;
            checkbox.checked = task.completed; checkbox.disabled = task.completed;
            const label = document.createElement('label');
            label.htmlFor = `task-${task.id}`; label.textContent = ` ${task.text} (+${task.reward}🪙)`;
            listItem.appendChild(checkbox); listItem.appendChild(label);
            checkbox.addEventListener('change', () => { if (checkbox.checked && !task.completed) completeTask(task.id); });
            taskListElement.appendChild(listItem);
        });
    }
    function renderShopItems() {
        shopItemsContainer.innerHTML = '';
        shopItems.forEach(item => {
            const itemDiv = document.createElement('div'); itemDiv.classList.add('shop-item');
            const owned = item.type === 'outfit' && juno.inventory.outfits.includes(item.id);
            itemDiv.innerHTML = `
                <div class="shop-item-details">
                    <span class="shop-item-name">${item.icon ? item.icon + ' ' : ''}${item.name}</span>
                    <small class="shop-item-desc">${item.description}</small>
                </div>
                <button class="buy-button" data-item-id="${item.id}" ${pawCoins < item.price || owned ? 'disabled' : ''}>
                    ${owned ? 'Owned' : `Buy (${item.price}🪙)`}
                </button>`;
            shopItemsContainer.appendChild(itemDiv);
        });
        shopItemsContainer.querySelectorAll('.buy-button:not([disabled])').forEach(button => {
            button.addEventListener('click', () => buyShopItem(button.dataset.itemId));
        });
    }

    function renderOutfitInventory() {
        outfitItemsContainer.innerHTML = '';
        const ownedOutfits = shopItems.filter(item => item.type === 'outfit' && juno.inventory.outfits.includes(item.id));
        if (ownedOutfits.length === 0) {
            outfitItemsContainer.innerHTML = '<p style="text-align:center; font-size:0.8em; color:#555;">No outfits yet! Visit the shop.</p>'; return;
        }
        ownedOutfits.forEach(outfit => {
            const itemDiv = document.createElement('div');
            itemDiv.classList.add('outfit-inventory-item');
            if (juno.equippedOutfit === outfit.id) itemDiv.classList.add('equipped');
            itemDiv.dataset.outfitId = outfit.id;
            itemDiv.innerHTML = `<div class="outfit-icon-preview">${outfit.icon || '?'}</div><span>${outfit.name}</span>`;
            itemDiv.addEventListener('click', () => toggleEquipOutfit(outfit.id));
            outfitItemsContainer.appendChild(itemDiv);
        });
    }

    function toggleEquipOutfit(outfitId) {
        if (juno.equippedOutfit === outfitId) juno.equippedOutfit = null; else juno.equippedOutfit = outfitId;
        updateJunoVisuals(); renderOutfitInventory(); saveGameData();
    }
    function unequipAllOutfits() {
        juno.equippedOutfit = null; updateJunoVisuals(); renderOutfitInventory(); saveGameData();
    }

    function initializeQuests() {
        dailyQuests = questDefinitions.slice(0, 2).map(q => ({...q, current:0, completed:false}));
    }
    function renderQuests() {
        questListElement.innerHTML = '';
        if (dailyQuests.length === 0) { questListElement.innerHTML = '<li>No active quests. Check back tomorrow!</li>'; return; }
        dailyQuests.forEach(quest => {
            const listItem = document.createElement('li'); listItem.classList.toggle('completed-quest', quest.completed);
            listItem.innerHTML = `${quest.description} ${!quest.completed ? `<span class="quest-progress">(${quest.current}/${quest.target})</span>` : '(Completed!)'}`;
            questListElement.appendChild(listItem);
        });
    }
    function updateQuestProgress(eventType, value = 1) {
        let questUpdated = false;
        dailyQuests.forEach(quest => {
            if (!quest.completed && quest.eventType === eventType) {
                if (eventType.includes('score')) quest.current = Math.max(quest.current, value); else quest.current += value;
                if (quest.current >= quest.target) {
                    quest.completed = true; pawCoins += quest.reward;
                    alert(`Quest Completed: "${quest.description}"! You earned ${quest.reward} PawCoins!`);
                    updatePawCoinsUI();
                }
                questUpdated = true;
            }
        });
        if (questUpdated) { renderQuests(); saveGameData(); }
    }

    function applyStatChange(stat, value) {
        juno[stat] = Math.max(0, Math.min(100, (juno[stat] || 0) + value));
    }
    function completeTask(taskId) {
        const task = selfCareTasks.find(t => t.id === taskId);
        if (task && !task.completed) {
            task.completed = true; pawCoins += task.reward; applyStatChange('mood', 5);
            updatePawCoinsUI(); updateJunoStatsUI(); renderTasks(); saveGameData();
        }
    }
    function buyShopItem(itemId) {
        const item = shopItems.find(i => i.id === itemId);
        if (item && pawCoins >= item.price) {
            if (item.type === 'outfit' && juno.inventory.outfits.includes(item.id)) { alert("You already own this outfit!"); return; }
            pawCoins -= item.price;
            if (item.type === 'outfit') {
                juno.inventory.outfits.push(item.id); alert(`You bought the ${item.name}! Check your outfits.`);
            } else if (item.effects) {
                for (const effect in item.effects) applyStatChange(effect, item.effects[effect]);
                if (item.type === 'food') updateQuestProgress('feed');
            }
            updatePawCoinsUI(); updateJunoStatsUI(); renderShopItems(); saveGameData();
        } else { alert("Not enough PawCoins or item not found!"); }
    }
    function decreaseJunoStats() {
        applyStatChange('hunger', -2); applyStatChange('energy', -1); applyStatChange('playfulness', -1);
        if (juno.hunger < 20 && juno.mood > 0) applyStatChange('mood', -MOOD_IMPACT_LOW_STAT);
        if (juno.energy < 10 && juno.mood > 0) applyStatChange('mood', -MOOD_IMPACT_LOW_STAT);
        if (juno.playfulness < 15 && juno.mood > 0) applyStatChange('mood', -MOOD_IMPACT_LOW_STAT);
        updateJunoStatsUI(); saveGameData();
    }

    function updateJunoThoughtBubble() {
        junoThoughtBubble.classList.add('hidden'); junoThoughtBubble.classList.remove('visible');
        let thoughts = [];
        if (juno.hunger < 30) thoughts.push({ icon: '🍲', priority: 1 });
        if (juno.playfulness < 35 && juno.energy > 20) thoughts.push({ icon: '🧸', priority: 2 });
        if (juno.energy < 25) thoughts.push({ icon: '💤', priority: 3 });
        if (thoughts.length > 0) {
            thoughts.sort((a, b) => a.priority - b.priority);
            junoThoughtBubble.textContent = thoughts[0].icon;
            junoThoughtBubble.classList.remove('hidden'); void junoThoughtBubble.offsetWidth;
            junoThoughtBubble.classList.add('visible');
        }
    }
    function updateTimeOfDayBackground() {
        const hour = new Date().getHours();
        junoDisplayArea.classList.remove('bg-morning', 'bg-afternoon', 'bg-evening', 'bg-night');
        if (hour >= 5 && hour < 12) junoDisplayArea.classList.add('bg-morning');
        else if (hour >= 12 && hour < 18) junoDisplayArea.classList.add('bg-afternoon');
        else if (hour >= 18 && hour < 21) junoDisplayArea.classList.add('bg-evening');
        else junoDisplayArea.classList.add('bg-night');
    }

    async function fetchQuoteOfTheDay() {
        try {
            const response = await fetch('https://type.fit/api/quotes'); const quotes = await response.json();
            const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
            quoteTextElement.textContent = `"${randomQuote.text}"`; quoteAuthorElement.textContent = `- ${randomQuote.author || 'Unknown'}`;
        } catch (error) {
            quoteTextElement.textContent = '"The best way to predict the future is to create it."'; quoteAuthorElement.textContent = '- Peter Drucker';
        }
    }

    function saveGameData() {
        const gameState = { juno: juno, pawCoins: pawCoins, selfCareTasks: selfCareTasks, lastSavedDay: lastSavedDay, dailyQuests: dailyQuests };
        localStorage.setItem('junoCareData', JSON.stringify(gameState));
    }
    function loadGameData() {
        const savedData = localStorage.getItem('junoCareData');
        if (savedData) {
            const gameState = JSON.parse(savedData);
            juno = gameState.juno || { mood: 100, hunger: 80, energy: 90, playfulness: 70, inventory: {outfits:[]}, equippedOutfit: null };
            if (!juno.inventory) juno.inventory = { outfits: [] }; if (juno.equippedOutfit === undefined) juno.equippedOutfit = null;
            pawCoins = gameState.pawCoins || 0;
            const today = new Date().toDateString();
            if (gameState.lastSavedDay === today) {
                selfCareTasks = gameState.selfCareTasks || initialTasks.map(task => ({ ...task, completed: false }));
                dailyQuests = gameState.dailyQuests || []; if (dailyQuests.length === 0) initializeQuests();
            } else { selfCareTasks = initialTasks.map(task => ({ ...task, completed: false })); initializeQuests(); }
            lastSavedDay = today;
        } else { selfCareTasks = initialTasks.map(task => ({ ...task, completed: false })); initializeQuests(); }
    }

    function showTreatCatchScreen(screen) {
        gameInstructionsTreatCatch.classList.add('hidden'); gameAreaTreatCatch.classList.add('hidden'); gameOverScreenTreatCatch.classList.add('hidden');
        if (screen === 'instructions') gameInstructionsTreatCatch.classList.remove('hidden');
        else if (screen === 'game') gameAreaTreatCatch.classList.remove('hidden');
        else if (screen === 'over') gameOverScreenTreatCatch.classList.remove('hidden');
    }
    function startTreatCatchGame() {
        showTreatCatchScreen('game'); treatCatchCurrentScore = 0; treatCatchTimeLeft = TREAT_CATCH_GAME_DURATION;
        gameScoreDisplayTreatCatch.textContent = treatCatchCurrentScore; gameTimerDisplayTreatCatch.textContent = treatCatchTimeLeft;
        gameCatcherTreatCatch.style.left = '50%'; treatCatchActiveTreats = [];
        clearExistingTreatsDOM(gameAreaTreatCatch);
        treatCatchTimerInterval = setInterval(() => {
            treatCatchTimeLeft--; gameTimerDisplayTreatCatch.textContent = treatCatchTimeLeft;
            if (treatCatchTimeLeft <= 0) { clearInterval(treatCatchTimerInterval); clearInterval(treatCatchTreatInterval); clearInterval(treatCatchGameLoop); endTreatCatchGame(); }
        }, 1000);
        treatCatchTreatInterval = setInterval(() => spawnTreatGeneric(gameAreaTreatCatch, treatCatchActiveTreats), TREAT_SPAWN_RATE);
        treatCatchGameLoop = setInterval(gameTickTreatCatch, 1000 / 60);
        document.addEventListener('keydown', handleTreatCatchCatcherMove); gameAreaTreatCatch.addEventListener('click', handleTreatCatchTouchMove);
    }
    function clearExistingTreatsDOM(area) { area.querySelectorAll('.treat').forEach(t => t.remove()); }
    function spawnTreatGeneric(area, activeList) {
        const treatElement = document.createElement('div'); treatElement.classList.add('treat');
        const treatTypes = ['treat-fish', 'treat-star', 'treat-bad']; const randomType = treatTypes[Math.floor(Math.random() * treatTypes.length)];
        treatElement.classList.add(randomType); treatElement.dataset.type = randomType;
        treatElement.style.left = Math.random() * (area.clientWidth - 20) + 'px'; treatElement.style.top = '-20px';
        area.appendChild(treatElement); activeList.push(treatElement);
    }
    function gameTickTreatCatch() {
        treatCatchActiveTreats.forEach((treat, index) => {
            let topPos = parseInt(treat.style.top || 0); topPos += TREAT_SPEED; treat.style.top = topPos + 'px';
            const catcherRect = gameCatcherTreatCatch.getBoundingClientRect(); const treatRect = treat.getBoundingClientRect();
            if (!(catcherRect.right < treatRect.left || catcherRect.left > treatRect.right || catcherRect.bottom < treatRect.top || catcherRect.top > treatRect.bottom)) {
                if (treat.dataset.type === 'treat-fish') treatCatchCurrentScore += 10; else if (treat.dataset.type === 'treat-star') treatCatchCurrentScore += 25; else if (treat.dataset.type === 'treat-bad') treatCatchCurrentScore -= 15;
                treatCatchCurrentScore = Math.max(0, treatCatchCurrentScore); gameScoreDisplayTreatCatch.textContent = treatCatchCurrentScore;
                treat.remove(); treatCatchActiveTreats.splice(index, 1); return;
            }
            if (topPos > gameAreaTreatCatch.clientHeight) { treat.remove(); treatCatchActiveTreats.splice(index, 1); }
        });
    }
    function handleTreatCatchCatcherMove(event) {
        let catcherLeft = parseInt(gameCatcherTreatCatch.style.left || '50%');
        if (typeof catcherLeft === 'string' && catcherLeft.includes('%')) catcherLeft = (gameAreaTreatCatch.clientWidth / 100) * parseInt(catcherLeft);
        if (event.key === 'ArrowLeft') catcherLeft -= CATCHER_SPEED; else if (event.key === 'ArrowRight') catcherLeft += CATCHER_SPEED;
        catcherLeft = Math.max(0, Math.min(catcherLeft, gameAreaTreatCatch.clientWidth - gameCatcherTreatCatch.offsetWidth));
        gameCatcherTreatCatch.style.left = catcherLeft + 'px';
    }
    function handleTreatCatchTouchMove(event) {
        const gameAreaRect = gameAreaTreatCatch.getBoundingClientRect(); const touchX = event.clientX - gameAreaRect.left;
        let catcherLeft = parseInt(gameCatcherTreatCatch.style.left || '50%');
        if (typeof catcherLeft === 'string' && catcherLeft.includes('%')) catcherLeft = (gameAreaTreatCatch.clientWidth / 100) * parseInt(catcherLeft);
        if (touchX < gameAreaTreatCatch.clientWidth / 2) catcherLeft -= CATCHER_SPEED; else catcherLeft += CATCHER_SPEED;
        catcherLeft = Math.max(0, Math.min(catcherLeft, gameAreaTreatCatch.clientWidth - gameCatcherTreatCatch.offsetWidth));
        gameCatcherTreatCatch.style.left = catcherLeft + 'px';
    }
    function endTreatCatchGame() {
        document.removeEventListener('keydown', handleTreatCatchCatcherMove); gameAreaTreatCatch.removeEventListener('click', handleTreatCatchTouchMove);
        showTreatCatchScreen('over'); finalScoreDisplayTreatCatch.textContent = treatCatchCurrentScore;
        const reward = Math.floor(treatCatchCurrentScore / 10); gameRewardDisplayTreatCatch.textContent = reward;
        pawCoins += reward; updateQuestProgress('game_score_treat_catch', treatCatchCurrentScore);
        applyStatChange('playfulness', Math.floor(treatCatchCurrentScore / 5)); applyStatChange('mood', Math.floor(treatCatchCurrentScore / 20)); applyStatChange('energy', -10);
        updatePawCoinsUI(); updateJunoStatsUI(); saveGameData();
    }

    function skyHopResizeCanvas() { if(gameAreaSkyHop.clientWidth > 0) skyHopCanvas.width = gameAreaSkyHop.clientWidth; if(gameAreaSkyHop.clientHeight > 0) skyHopCanvas.height = gameAreaSkyHop.clientHeight; }
    function SkyHopPlayer() {
        this.x = skyHopCanvas.width / 2 - SKY_HOP_PLAYER_SIZE / 2; this.y = skyHopCanvas.height - SKY_HOP_PLAYER_SIZE - 50;
        this.width = SKY_HOP_PLAYER_SIZE + 10; this.height = SKY_HOP_PLAYER_SIZE; this.velocityY = 0; this.onGround = false;
        this.draw = () => {
            skyHopCtx.fillStyle = '#808080';
            if (skyHopPlayerImage && skyHopPlayerImage.complete) skyHopCtx.drawImage(skyHopPlayerImage, this.x, this.y, this.width, this.height);
            else skyHopCtx.fillRect(this.x, this.y, this.width, this.height);
        };
        this.jump = () => { if (this.onGround) { this.velocityY = SKY_HOP_JUMP_FORCE; this.onGround = false; } };
        this.update = () => {
            this.velocityY += SKY_HOP_GRAVITY; this.y += this.velocityY; this.onGround = false;
            if (this.y + this.height > skyHopCanvas.height) { this.y = skyHopCanvas.height - this.height; this.velocityY = 0; this.onGround = true; skyHopGameOver = true; }
        };
    }
    function SkyHopPlatform(y, xOffset = 0) {
        this.x = xOffset + Math.random() * (skyHopCanvas.width - SKY_HOP_PLATFORM_WIDTH - xOffset); this.y = y;
        this.width = SKY_HOP_PLATFORM_WIDTH; this.height = SKY_HOP_PLATFORM_HEIGHT;
        this.draw = () => { skyHopCtx.fillStyle = '#964B00'; skyHopCtx.fillRect(this.x, this.y, this.width, this.height); };
    }
    function initializeSkyHopPlatforms() {
        skyHopPlatforms = [];
        skyHopPlatforms.push(new SkyHopPlatform(skyHopCanvas.height - 40, skyHopCanvas.width / 2 - SKY_HOP_PLATFORM_WIDTH / 2));
        for (let i = 1; i < 10; i++) skyHopPlatforms.push(new SkyHopPlatform(skyHopCanvas.height - 40 - (i * SKY_HOP_PLATFORM_GAP)));
    }
    function showSkyHopScreen(screen) {
        gameInstructionsSkyHop.classList.add('hidden'); gameAreaSkyHop.classList.add('hidden'); gameOverScreenSkyHop.classList.add('hidden');
        if (screen === 'instructions') gameInstructionsSkyHop.classList.remove('hidden');
        else if (screen === 'game') { gameAreaSkyHop.classList.remove('hidden'); skyHopResizeCanvas(); }
        else if (screen === 'over') gameOverScreenSkyHop.classList.remove('hidden');
    }
    function startSkyHopGame() {
        showSkyHopScreen('game'); skyHopScore = 0; gameScoreDisplaySkyHop.textContent = skyHopScore; skyHopGameOver = false;
        skyHopPlayer = new SkyHopPlayer(); initializeSkyHopPlatforms();
        skyHopGameLoop = requestAnimationFrame(skyHopGameTick);
        document.addEventListener('keydown', handleSkyHopJump); skyHopCanvas.addEventListener('click', handleSkyHopJump);
    }
    function skyHopGameTick() {
        if (skyHopGameOver) { endSkyHopGame(); return; }
        skyHopCtx.clearRect(0, 0, skyHopCanvas.width, skyHopCanvas.height); skyHopPlayer.update();
        skyHopPlatforms.forEach(platform => {
            platform.draw();
            if (skyHopPlayer.x < platform.x + platform.width && skyHopPlayer.x + skyHopPlayer.width > platform.x &&
                skyHopPlayer.y + skyHopPlayer.height > platform.y && skyHopPlayer.y + skyHopPlayer.height < platform.y + platform.height + Math.abs(skyHopPlayer.velocityY) &&
                skyHopPlayer.velocityY >= 0) {
                skyHopPlayer.y = platform.y - skyHopPlayer.height; skyHopPlayer.velocityY = 0; skyHopPlayer.onGround = true;
            }
            if (skyHopPlayer.y < skyHopCanvas.height / 2 && skyHopPlayer.velocityY < 0) platform.y -= skyHopPlayer.velocityY;
        });
        if (skyHopPlayer.y < skyHopCanvas.height / 2 && skyHopPlayer.velocityY < 0) {
            skyHopPlayer.y -= skyHopPlayer.velocityY; skyHopScore += Math.floor(Math.abs(skyHopPlayer.velocityY));
            gameScoreDisplaySkyHop.textContent = skyHopScore;
            if (skyHopPlatforms[skyHopPlatforms.length - 1].y > -SKY_HOP_PLATFORM_GAP) {
                skyHopPlatforms.push(new SkyHopPlatform(skyHopPlatforms[skyHopPlatforms.length - 1].y - SKY_HOP_PLATFORM_GAP));
            }
        }
        skyHopPlatforms = skyHopPlatforms.filter(p => p.y < skyHopCanvas.height); skyHopPlayer.draw();
        if (!skyHopGameOver) skyHopGameLoop = requestAnimationFrame(skyHopGameTick);
    }
    function handleSkyHopJump(event) { if (event.type === 'keydown' && event.code !== 'Space') return; if (!skyHopGameOver) skyHopPlayer.jump(); }
    function endSkyHopGame() {
        cancelAnimationFrame(skyHopGameLoop); document.removeEventListener('keydown', handleSkyHopJump); skyHopCanvas.removeEventListener('click', handleSkyHopJump);
        showSkyHopScreen('over'); finalScoreDisplaySkyHop.textContent = skyHopScore;
        const reward = Math.floor(skyHopScore / 50); gameRewardDisplaySkyHop.textContent = reward; pawCoins += reward;
        applyStatChange('playfulness', Math.floor(skyHopScore / 20)); applyStatChange('mood', Math.floor(skyHopScore / 100)); applyStatChange('energy', -15);
        updatePawCoinsUI(); updateJunoStatsUI(); saveGameData();
    }

    feedButton.addEventListener('click', () => { alert("Go to the shop to buy food for Juno!"); });
    sleepButton.addEventListener('click', () => { applyStatChange('energy', 40); applyStatChange('mood', 5); updateJunoStatsUI(); saveGameData(); });
    shopButton.addEventListener('click', () => { renderShopItems(); shopModal.classList.add('visible'); });
    closeShopButton.addEventListener('click', () => { shopModal.classList.remove('visible'); });
    shopModal.addEventListener('click', (e) => { if(e.target === shopModal) shopModal.classList.remove('visible'); });
    outfitsButton.addEventListener('click', () => { renderOutfitInventory(); outfitInventoryModal.classList.add('visible'); });
    closeOutfitsButton.addEventListener('click', () => { outfitInventoryModal.classList.remove('visible'); });
    outfitInventoryModal.addEventListener('click', (e) => { if(e.target === outfitInventoryModal) closeOutfitsButton.click(); });
    unequipAllButton.addEventListener('click', unequipAllOutfits);
    playTreatCatchButton.addEventListener('click', () => { if (juno.energy > 20) { showTreatCatchScreen('instructions'); treatCatchModal.classList.add('visible'); } else alert("Juno is too tired to play Treat Catch!"); });
    closeTreatCatchButton.addEventListener('click', () => { treatCatchModal.classList.remove('visible'); clearInterval(treatCatchGameLoop); clearInterval(treatCatchTreatInterval); clearInterval(treatCatchTimerInterval); document.removeEventListener('keydown', handleTreatCatchCatcherMove); gameAreaTreatCatch.removeEventListener('click', handleTreatCatchTouchMove); });
    treatCatchModal.addEventListener('click', (e) => { if(e.target === treatCatchModal) closeTreatCatchButton.click(); });
    startTreatCatchButton.addEventListener('click', startTreatCatchGame);
    playAgainTreatCatchButton.addEventListener('click', () => showTreatCatchScreen('instructions'));
    playSkyHopButton.addEventListener('click', () => { if (juno.energy > 25) { skyHopResizeCanvas(); showSkyHopScreen('instructions'); skyHopModal.classList.add('visible'); } else alert("Juno is too tired to play Sky Hop!"); });
    closeSkyHopButton.addEventListener('click', () => { skyHopModal.classList.remove('visible'); cancelAnimationFrame(skyHopGameLoop); document.removeEventListener('keydown', handleSkyHopJump); skyHopCanvas.removeEventListener('click', handleSkyHopJump); });
    skyHopModal.addEventListener('click', (e) => { if(e.target === skyHopModal) closeSkyHopButton.click(); });
    startSkyHopButton.addEventListener('click', startSkyHopGame);
    playAgainSkyHopButton.addEventListener('click', () => { skyHopResizeCanvas(); showSkyHopScreen('instructions'); });

    function initializeApp() {
        skyHopPlayerImage = new Image();
        skyHopPlayerImage.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><rect width="20" height="20" fill="%23808080" rx="3" ry="3"/><rect x="5" y="12" width="10" height="3" fill="white" rx="1" ry="1"/></svg>')}`;
        loadGameData(); updateJunoStatsUI(); updatePawCoinsUI(); renderTasks(); renderQuests(); fetchQuoteOfTheDay(); updateTimeOfDayBackground(); updateJunoThoughtBubble();
        setInterval(decreaseJunoStats, STAT_DECREASE_INTERVAL); setInterval(updateJunoThoughtBubble, THOUGHT_BUBBLE_INTERVAL); setInterval(updateTimeOfDayBackground, 60000 * 5);
        console.log("Juno's World - Feature Explosion Edition Initialized!");
    }
    initializeApp();
});