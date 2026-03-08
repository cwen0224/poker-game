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

function createTileElement(value, isAI = false) {
    const tile = document.createElement('div');
    tile.className = 'tile';
    
    const face = document.createElement('div');
    face.className = 'tile-face face-front';
    face.textContent = isAI ? '' : value; // AI 牌背面朝上

    const back = document.createElement('div');
    back.className = 'tile-face face-back';

    tile.appendChild(face);
    tile.appendChild(back);
    
    if (!isAI) {
        tile.addEventListener('click', () => {
            // 從立起狀態打出去
            tile.style.transform = 'rotateX(-90deg) translateZ(100px) translateY(-100px)';
            tile.style.opacity = '0';
            setTimeout(() => tile.remove(), 500);
        });
    }

    return tile;
}

function renderHand(hand, elementId, isAI = false) {
    const container = document.getElementById(elementId);
    container.innerHTML = '';
    hand.forEach(val => {
        container.appendChild(createTileElement(val, isAI));
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
    document.getElementById('game-message').textContent = "重新發牌完成！";
});

// Start
initGame();
