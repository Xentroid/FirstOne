const tcells = document.querySelectorAll('.tcell');
const wohWon = document.querySelector('#whoWon');
const resetButton = document.querySelector("#resetButton");
const radioO = document.querySelector("#radioO");
const radioX = document.querySelector("#radioX");
const moveScores = document.querySelector("#moveScores");

let moves = 0;
let who = 'O';
let gameState = [
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
];
let win = false;
let start = 'O';
let oScore = 0;
let xScore = 0;


// Function to reset everything after a game concludes
function reset() {
    let cell = '';
    win = false;
    moves = 0;
    who = start;
    wohWon.innerHTML = '';
    for (let x = 0; x < 3; x++) {
        for (let y = 0; y < 3; y++) {
            gameState[x][y] = '';
            cell = `#c${x}${y}`;
            document.querySelector(cell).classList.remove('wincell');
        }
    }
    tcells.forEach(tcell => {
        tcell.innerHTML = '';
    })
    resetButton.style.display = "none";
    oScore = 0;
    xScore = 0;
    moveScores.innerHTML = `The current score is O=0, X=0`;
    radioO.removeAttribute("disabled");
    radioX.removeAttribute("disabled");
}

// Checks to see if a win has occurred
function checkWinStatus() {
    let wincell = '';
    for (let x = 0; x < 3; x++) {
        if ((gameState[x][0] !== '') &&
            ((gameState[x][0] === gameState[x][1]) && (gameState[x][0] === gameState[x][2]))) {
            win = true;
            wincell = `#c${x}0`;
            document.querySelector(wincell).classList.add('wincell');
            wincell = `#c${x}1`;
            document.querySelector(wincell).classList.add('wincell');
            wincell = `#c${x}2`;
            document.querySelector(wincell).classList.add('wincell');
            break;
        }
    }

    if (!win) {
        for (let y = 0; y < 3; y++) {
            if ((gameState[0][y] !== '') &&
                ((gameState[0][y] === gameState[1][y]) && (gameState[0][y] === gameState[2][y]))) {
                win = true;
                wincell = `#c0${y}`;
                document.querySelector(wincell).classList.add('wincell');
                wincell = `#c1${y}`;
                document.querySelector(wincell).classList.add('wincell');
                wincell = `#c2${y}`;
                document.querySelector(wincell).classList.add('wincell');
                break;
            }
        }
    }

    if (!win && gameState[0][0] !== '' &&
        (gameState[0][0] === gameState[1][1]) && (gameState[0][0] === gameState[2][2])) {
        win = true;
        document.querySelector('#c00').classList.add('wincell');
        document.querySelector('#c11').classList.add('wincell');
        document.querySelector('#c22').classList.add('wincell');
    }

    if (!win && gameState[0][2] !== '' &&
        (gameState[0][2] === gameState[1][1]) && (gameState[0][2] === gameState[2][0])) {
        win = true;
        document.querySelector('#c02').classList.add('wincell');
        document.querySelector('#c11').classList.add('wincell');
        document.querySelector('#c20').classList.add('wincell');
    }

    if (win) {
        wohWon.innerHTML = `${who} won that game`;
        resetButton.style.display = "block";
    } else if (moves === 9) {
        wohWon.innerHTML = 'Nobody won that one';
        resetButton.style.display = "block";
    }
}

// Uses the count of Os or Xs on a paticuar row, column or diagonal to increase the score
function rowScore(oCount, xCount) {
    if (oCount === 3) {
        oScore += 10;
    } else if ((oCount === 2) && (xCount === 0)) {
        oScore += 1;
    }
    if (xCount == 3) {
        xScore += 10;
    } else if ((xCount === 2) && (oCount === 0)) {
        xScore += 1;
    }
}

// Takes a state of play and calculates how strong a position it is for each player
function positionScore(moveArray) {
    let oCount = 0;
    let xCount = 0;
    xScore = 0;
    oScore = 0;

    for (let x = 0; x < 3; x++) {
        oCount = 0;
        xCount = 0;
        for (let y = 0; y < 3; y++) {
            if (moveArray[x][y] === 'O') {
                oCount++;
            } else if (moveArray[x][y] === 'X') {
                xCount++;
            }
        }
        rowScore(oCount, xCount);
    }

    for (let y = 0; y < 3; y++) {
        oCount = 0;
        xCount = 0;
        for (let x = 0; x < 3; x++) {
            if (moveArray[x][y] === 'O') {
                oCount++;
            } else if (moveArray[x][y] === 'X') {
                xCount++;
            }
        }
        rowScore(oCount, xCount);
    }

    oCount = 0;
    xCount = 0;
    if (moveArray[0][0] === 'O') {
        oCount++;
    }
    if (moveArray[1][1] === 'O') {
        oCount++;
    }
    if (moveArray[2][2] === 'O') {
        oCount++;
    }
    if (moveArray[0][0] === 'X') {
        xCount++;
    }
    if (moveArray[1][1] === 'X') {
        xCount++;
    }
    if (moveArray[2][2] === 'X') {
        xCount++;
    }
    rowScore(oCount, xCount);

    oCount = 0;
    xCount = 0;
    if (moveArray[2][0] === 'O') {
        oCount++;
    }
    if (moveArray[1][1] === 'O') {
        oCount++;
    }
    if (moveArray[0][2] === 'O') {
        oCount++;
    }
    if (moveArray[2][0] === 'X') {
        xCount++;
    }
    if (moveArray[1][1] === 'X') {
        xCount++;
    }
    if (moveArray[0][2] === 'X') {
        xCount++;
    }
    rowScore(oCount, xCount);

    moveScores.innerHTML = `The current score is O=${oScore}, X=${xScore}`;
}


// Adds an eventlistener for each cell, which does the business for each cell
tcells.forEach(tcell => {
    tcell.addEventListener('click', function (event) {
        const cellClicked = event.target.id;
        const x = parseInt(cellClicked.substr(1, 1));
        const y = parseInt(cellClicked.substr(2, 1));
        if (moves === 0) {
            radioO.setAttribute("disabled", true);
            radioX.setAttribute("disabled", true);
            who = start;
        }
        if ((!win) && (gameState[x][y] === '')) {
            moves++;
            gameState[x][y] = who;
            tcell.innerHTML = who;
            if (moves >= 5) {
                checkWinStatus();
            }
            if (moves >= 3) {
                positionScore(gameState);
            }
            if (who === 'O') {
                who = 'X';
            } else {
                who = 'O';
            }
        }
    })
})

resetButton.addEventListener('click', function () {
    reset();
})

radioO.onclick = function () {
    start = 'O';
}

radioX.onclick = function () {
    start = 'X';
}