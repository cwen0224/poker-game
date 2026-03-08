const tiles_data = [
    '一萬','二萬','三萬','四萬','五萬','六萬','七萬','八萬','九萬',
    '一筒','二筒','三筒','四筒','五筒','六筒','七筒','八筒','九筒',
    '一條','二條','三條','四條','五條','六條','七條','八條','九條',
    '東','南','西','北',
    '中','發','白'
];

let wall = [];
let hands = { north: [], south: [], east: [], west: [] };

function initGame() {
    wall = [];
    // 每個牌種 4 張
    tiles_data.forEach(t => {
        for (let i = 0; i < 4; i++) wall.push(t);
    });

    shuffle(wall);
    deal();
    renderAllHands();
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[array.length - 1]] = [array[array.length - 1], array[i]]; // Simplified shuffle
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function deal() {
    hands.south = wall.splice(0, 16);
    hands.north = wall.splice(0, 16);
    hands.east = wall.splice(0, 16);
    hands.west = wall.splice(0, 16);
    document.getElementById('remaining-count').textContent = wall.length;
}

function createTileElement(value, index, isAI = false) {
    const tile = document.createElement('div');
    tile.className = 'tile';
    
    const face = document.createElement('div');
    face.className = 'tile-face face-front';
    face.textContent = isAI ? '' : value;

    const back = document.createElement('div');
    back.className = 'tile-face face-back';

    tile.appendChild(face);
    tile.appendChild(back);
    
    if (!isAI) {
        tile.addEventListener('click', () => {
            handlePlayerDiscard(index);
        });
    }

    return tile;
}

async function handlePlayerDiscard(index) {
    const hand = hands.south;
    const discardedValue = hand.splice(index, 1)[0];
    
    // UI Animation
    const container = document.getElementById('hand-south');
    const tileElement = container.children[index];
    tileElement.style.transform = 'rotateX(-90deg) translateZ(100px) translateY(-100px)';
    tileElement.style.opacity = '0';
    tileElement.style.pointerEvents = 'none';

    document.getElementById('game-message').textContent = `您打出了 ${discardedValue}`;

    setTimeout(() => {
        drawTile('south');
    }, 600);
}

function drawTile(player) {
    if (wall.length === 0) {
        document.getElementById('game-message').textContent = "海底撈月！牌已抽完。";
        return;
    }

    const newTile = wall.pop();
    hands[player].push(newTile);
    document.getElementById('remaining-count').textContent = wall.length;
    
    if (player === 'south') {
        document.getElementById('game-message').textContent = `您抽到了 ${newTile}`;
    }

    renderAllHands();
    
    // 如果是玩家抽完，模擬一下 AI 動作 (隨機打一張抽一張)
    if (player === 'south') {
        setTimeout(simulateAITurns, 1000);
    }
}

function simulateAITurns() {
    ['north', 'east', 'west'].forEach(p => {
        if (hands[p].length > 0) {
            hands[p].splice(Math.floor(Math.random() * hands[p].length), 1);
            if (wall.length > 0) {
                hands[p].push(wall.pop());
            }
        }
    });
    document.getElementById('remaining-count').textContent = wall.length;
    renderAllHands();
}

function renderHand(hand, elementId, isAI = false) {
    const container = document.getElementById(elementId);
    container.innerHTML = '';
    hand.forEach((val, idx) => {
        container.appendChild(createTileElement(val, idx, isAI));
    });
}

function renderAllHands() {
    renderHand(hands.south, 'hand-south', false);
    renderHand(hands.north, 'hand-north', true);
    renderHand(hands.east, 'hand-east', true);
    renderHand(hands.west, 'hand-west', true);
}

document.getElementById('deal-btn').addEventListener('click', () => {
    initGame();
    document.getElementById('game-message').textContent = "重新發牌完成，請點擊手牌出牌！";
});

// Start
initGame();
