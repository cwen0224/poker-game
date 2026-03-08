const tiles_data = [
    '🀇','🀈','🀉','🀊','🀋','🀌','🀍','🀎','🀏', // 萬
    '🀙','🀚','🀛','🀜','🀝','🀞','🀟','🀠','🀡', // 筒
    '🀐','🀑','🀒','🀓','🀔','🀕','🀖','🀗','🀘', // 條
    '🀀','🀁','🀂','🀃', // 東南西北
    '🀄','🀅','🀆' // 中發白
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
