const table = document.querySelector('#snake').querySelectorAll('tbody')[0];
const h1 = document.querySelector('h1');
let num = 100;
const btn = document.querySelector("#dice");
const ladders = {
    4: 56,
    14: 55,
    22: 58,
    41: 79,
    54: 88,
    12: 50
};

const snake_bite = {
    96: 42,
    94: 71,
    75: 32,
    48: 16,
    37: 3,
    28: 10
};

let compPos = 1;
let youPos = 1;

const diceresult = () => {
    const options = [1, 2, 3, 4, 5, 6];
    const randIdx = Math.floor(Math.random() * 6);
    return options[randIdx];
}

const checkResult = () => {
    if (compPos === 100) {
        h1.innerText = "Computer Won!";
        btn.innerText = "Computer Won!";
        btn.disabled = true;
    } else if (youPos === 100) {
        h1.innerText = "You won!";
        btn.innerText = "You won!";
        btn.disabled = true;
    }
}

function getCellFromPosition(position) {
    const coords = givePos(position);
    return board.rows[coords.row].cells[coords.col];
}

function resetGame() {
    h1.innerText = "Snakes and Ladders";
    btn.disabled = false;
    btn.style.backgroundColor = "green";
    btn.innerText = "Your turn! Roll the dice!";
    const youCell = getCellFromPosition(youPos);
    const compCell = getCellFromPosition(compPos);
    youCell.removeChild(player1);
    compCell.removeChild(player2);
    const startingCell = board.rows[9].cells[0];
    startingCell.appendChild(player1);
    startingCell.appendChild(player2);
    youPos = 1;
    compPos = 1;
}



const givePos = (num) => {
    let row = 9 - Math.floor((num - 1) / 10);
    let col = (num - 1) % 10;
    if (row % 2 === 0) {
        col = 9 - col;
    }
    return { row: row, col: col };
}

for (let i = 0; i < 10; i++) {
    const row = document.createElement('tr');
    table.appendChild(row);
    if (i % 2 === 0) {
        for (let j = 0; j < 10; j++) {
            const cell = document.createElement('td');
            cell.innerText = num;
            num--;
            row.appendChild(cell);
        }
    } else {
        for (let j = 0; j < 10; j++) {
            const cell = document.createElement('td');
            cell.innerText = num;
            num--;
            row.insertBefore(cell, row.firstChild);
        }
    }
}

const player1 = document.querySelector('#player1');
const player2 = document.querySelector('#player2');
const board = document.querySelector('#snake');

board.rows[9].cells[0].appendChild(player1);
board.rows[9].cells[0].appendChild(player2);
btn.style.backgroundColor = "green";

const diceImage = document.querySelector("#dice-container img");
const drawElements = (elements, colors, elementType) => {
    let index = 0;

    for (const [start, end] of Object.entries(elements)) {
        const startCoords = givePos(parseInt(start));
        const endCoords = givePos(end);

        const startCell = board.rows[startCoords.row].cells[startCoords.col];
        const endCell = board.rows[endCoords.row].cells[endCoords.col];

        startCell.style.backgroundColor = colors[index];
        endCell.style.backgroundColor = colors[index];

        const elementImage = document.createElement('img');
        elementImage.src = `${elementType}.png`;
        elementImage.classList.add(`${elementType}-img`);
        startCell.appendChild(elementImage);

        const elementImageEnd = elementImage.cloneNode(true);
        endCell.appendChild(elementImageEnd);

        index++;
    }
}

const ladderColors = ['rgba(255, 0, 0, 0.5)', 'rgba(0, 0, 255, 0.5)', 'rgba(0, 255, 0, 0.5)', 'rgba(255, 255, 0, 0.5)', 'rgba(128, 0, 128, 0.5)', 'rgba(255, 165, 0, 0.5)'];
const snakeColors = ['rgba(139, 69, 19, 0.5)', 'rgba(178, 34, 34, 0.5)', 'rgba(34, 139, 34, 0.5)', 'rgba(0, 0, 139, 0.5)', 'rgba(255, 140, 0, 0.5)', 'rgba(75, 0, 130, 0.5)'];

drawElements(ladders, ladderColors, 'ladder');
drawElements(snake_bite, snakeColors, 'snake');

const messageBox = document.querySelector('#message-box');

function clearMessage() {
    messageBox.style.display = 'none';
}

const movePlayer = async (startPos, endPos, player) => {
    while (startPos < endPos) {
        let currentCell = getCellFromPosition(startPos);
        currentCell.removeChild(player);

        startPos++;
        let nextCell = getCellFromPosition(startPos);
        nextCell.appendChild(player);

        await new Promise(resolve => setTimeout(resolve, 350)); 
    }
}

const playGame = async (pos, player) => {
    let diceResult = diceresult();
    diceImage.src = `dice${diceResult}.png`;
    let message = '';

    let newPos = pos + diceResult;
    if (newPos <= 100) {
        await movePlayer(pos, newPos, player);
        pos = newPos;
        if (pos in ladders) {
            message = `Yay! You climbed from ${pos} to ${ladders[pos]}!`;
            getCellFromPosition(pos).removeChild(player);
            pos = ladders[pos];
            getCellFromPosition(pos).appendChild(player);
        } else if (pos in snake_bite) {
            message = `Oops! You got bitten by a snake from ${pos} to ${snake_bite[pos]}!`;
            getCellFromPosition(pos).removeChild(player);
            pos = snake_bite[pos];
            getCellFromPosition(pos).appendChild(player);
        }
    }
    return { pos, message };
}

async function yourChance() {
    let result = await playGame(youPos, player1);
    youPos = result.pos;
    if (result.message) {
        messageBox.innerText = result.message;
        messageBox.style.display = 'block';
        await new Promise(resolve => setTimeout(resolve, 2000));
        clearMessage();
    }
    btn.disabled = true;
    btn.style.backgroundColor = "grey";
    btn.innerText = "Computer's turn! Please wait...";
    checkResult();
    if (youPos < 100) {
       setTimeout(compChance, 1000); 
    }
}

async function compChance() {
    let result = await playGame(compPos, player2);
    compPos = result.pos;
    if (result.message) {
        await new Promise(resolve => setTimeout(resolve, 500));
        clearMessage();
    }
    checkResult();
    if (compPos < 100) {
        btn.disabled = false;
        btn.style.backgroundColor = "green";
        btn.innerText = "Your turn! Roll the dice!";
    }
}

btn.addEventListener("click", () => {
    yourChance();
});

const resetButton = document.getElementById('reset');
resetButton.addEventListener('click', resetGame);
