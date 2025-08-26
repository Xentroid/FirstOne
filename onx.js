const tcells = document.querySelectorAll('.tcell');
const wohWon = document.querySelector('#whoWon');
const resetButton = document.querySelector("#resetButton");
const radioO = document.querySelector("#radioO");
const radioX = document.querySelector("#radioX");
const radioPlayer = document.querySelector("#radioPlayer");
const radioComputer = document.querySelector("#radioComputer");
const moveScores = document.querySelector("#moveScores");
const startButton = document.querySelector("#startButton");
const grid = document.querySelector("#grid");

let moves = 0;
let who = 'O';
let gameState = [
    ['', '', ''],
    ['', '', ''],
    ['', '', ''],
    [0]
];
let win = false;
let start = 'O';
let start2 = 'P';
let scores = {
    oScore: 0,
    xScore: 0
}

function applyBest(best) {
    console.log(best);
    let newx = 0;
    let newy = 0;
    for (let x = 0; x < 3; x++) {
        for (let y = 0; y < 3; y++) {
            if (gameState[x][y] !== best[x][y]) {
                newx = x;
                newy = y;
                x = 5;
                y = 5;
            }
        }
    }
    gameState[newx][newy] = who;
    const tid = `#c${newx}${newy}`;
    const tcel = document.querySelector(tid);
    tcel.innerHTML = who;
    moves++;
    if (moves >= 5) {
        win = checkWinStatus();
        if (win) {
            wohWon.innerHTML = `${who} won that game`;
            resetButton.style.display = "block";
        } else if (moves === 9) {
            wohWon.innerHTML = 'Nobody won that one';
            resetButton.style.display = "block";
        }
    }
    nextPlayer();
}


function minimax(position, depth, alpha, beta, maximizingPlayer, firstlevel) {
    let positionScore = staticScore(position)
    if (depth === 0 || Math.abs(positionScore) >= 10) {
        return positionScore;
    }
    if (maximizingPlayer) {
        let maxEval = -1000;
        const possibleMoves = getPossibleMoves(position);
        for (const move of possibleMoves) {
            const eval = minimax(move, depth - 1, alpha, beta, false, false);
            maxEval = Math.max(maxEval, eval);
            alpha = Math.max(alpha, eval);
            if (firstlevel) {
                move[3] = eval;
            }
            //            if (beta <= alpha) break;
        }
        if (firstlevel) {
            let best = [];
            let bestScore = -1000;
            for (const move of possibleMoves) {
                if (move[3] !== 1000) {
                    if (move[3] > bestScore) {
                        best = structuredClone(move);
                        bestScore = move[3];
                    }
                }
            }
            applyBest(best);
        }
        return maxEval;
    } else {
        let minEval = 1000;
        const possibleMoves = getPossibleMoves(position);
        for (const move of possibleMoves) {
            const eval = minimax(move, depth - 1, alpha, beta, true, false);
            minEval = Math.min(minEval, eval);
            beta = Math.min(beta, eval);
            if (firstlevel) {
                move[3] = eval;
            }
            //            if (beta <= alpha) break;
        }
        if (firstlevel) {
            let best = [];
            let bestScore = 1000;
            for (const move of possibleMoves) {
                if (move[3] !== 1000) {
                    if (move[3] < bestScore) {
                        best = structuredClone(move);
                        bestScore = move[3];
                    }
                }
            }
            applyBest(best);
        }
        return minEval;
    }
}

function getPossibleMoves(startState) {
    let oCount = 0;
    let xCount = 0;
    let moveCount = 0;
    let who = '';
    let returnStates = [];
    let newScores = {
        oScore: 0,
        xScore: 0
    }
    for (let x = 0; x < 3; x++) {
        for (let y = 0; y < 3; y++) {
            if (startState[x][y] === 'O') {
                oCount++;
                moveCount++;
            } else if (startState[x][y] === 'X') {
                xCount++;
                moveCount++;
            }
        }
    }
    if (oCount > xCount) {
        who = 'X';
    } else if (xCount > oCount) {
        who = 'O';
    } else {
        who = start;
    }

    for (let x = 0; x < 3; x++) {
        for (let y = 0; y < 3; y++) {
            if (startState[x][y] === '') {
                let newState = structuredClone(startState);
                newState[3] = 1000;
                newState[x][y] = who;
                returnStates.push(newState);
            }
        }
    }
    return returnStates;
}

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
    scores.oScore = 0;
    scores.xScore = 0;
    moveScores.innerHTML = `The current score is O=0, X=0`;
    radioO.classList.remove('divdisable');
    radioX.classList.remove('divdisable');
    radioPlayer.classList.remove('divdisable');
    radioComputer.classList.remove('divdisable');
    startButton.classList.remove('divdisable');
    grid.classList.add('divdisable');
}

// Checks to see if a win has occurred
function checkWinStatus() {
    let wincell = '';
    let lwin = false;
    for (let x = 0; x < 3; x++) {
        if ((gameState[x][0] !== '') &&
            ((gameState[x][0] === gameState[x][1]) && (gameState[x][0] === gameState[x][2]))) {
            lwin = true;
            wincell = `#c${x}0`;
            document.querySelector(wincell).classList.add('wincell');
            wincell = `#c${x}1`;
            document.querySelector(wincell).classList.add('wincell');
            wincell = `#c${x}2`;
            document.querySelector(wincell).classList.add('wincell');
            break;
        }
    }

    if (!lwin) {
        for (let y = 0; y < 3; y++) {
            if ((gameState[0][y] !== '') &&
                ((gameState[0][y] === gameState[1][y]) && (gameState[0][y] === gameState[2][y]))) {
                lwin = true;
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

    if (!lwin && gameState[0][0] !== '' &&
        (gameState[0][0] === gameState[1][1]) && (gameState[0][0] === gameState[2][2])) {
        lwin = true;
        document.querySelector('#c00').classList.add('wincell');
        document.querySelector('#c11').classList.add('wincell');
        document.querySelector('#c22').classList.add('wincell');
    }

    if (!lwin && gameState[0][2] !== '' &&
        (gameState[0][2] === gameState[1][1]) && (gameState[0][2] === gameState[2][0])) {
        lwin = true;
        document.querySelector('#c02').classList.add('wincell');
        document.querySelector('#c11').classList.add('wincell');
        document.querySelector('#c20').classList.add('wincell');
    }
    return lwin;
}

// Uses the count of Os or Xs on a paticuar row, column or diagonal to increase the score
function rowScore(oCount, xCount, lscores) {
    if (oCount === 3) {
        lscores.oScore += 10;
    } else if ((oCount === 2) && (xCount === 0)) {
        lscores.oScore += 1;
    }
    if (xCount == 3) {
        lscores.xScore += 10;
    } else if ((xCount === 2) && (oCount === 0)) {
        lscores.xScore += 1;
    }
}

function staticScore(moveArray) {
    let lscores = {
        oScore: 0,
        xScore: 0
    };
    positionScore(moveArray, lscores);
    if (lscores.oScore >= 10) {
        return 10
    } else if (lscores.xScore >= 10) {
        return -10
    }
    return lscores.oScore - lscores.xScore;
}

// Takes a state of play and calculates how strong a position it is for each player
function positionScore(moveArray, lscores) {
    let oCount = 0;
    let xCount = 0;
    lscores.xScore = 0;
    lscores.oScore = 0;

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
        rowScore(oCount, xCount, lscores);
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
        rowScore(oCount, xCount, lscores);
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
    rowScore(oCount, xCount, lscores);

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
    rowScore(oCount, xCount, lscores);
}

function nextPlayer() {
    if (who === 'O') {
        who = 'X';
    } else {
        who = 'O';
    }
}

// Adds an eventlistener for each cell, which does the business for each cell
tcells.forEach(tcell => {
    tcell.addEventListener('click', function (event) {
        const cellClicked = event.target.id;
        const x = parseInt(cellClicked.substr(1, 1));
        const y = parseInt(cellClicked.substr(2, 1));
        if (moves === 0) {
            who = start;
        }
        if ((!win) && (gameState[x][y] === '')) {
            moves++;
            gameState[x][y] = who;
            tcell.innerHTML = who;
            if (moves >= 5) {
                win = checkWinStatus();
                if (win) {
                    wohWon.innerHTML = `${who} won that game`;
                    resetButton.style.display = "block";
                } else if (moves === 9) {
                    wohWon.innerHTML = 'Nobody won that one';
                    resetButton.style.display = "block";
                }
            }
            nextPlayer();
            if (who === 'O') {
                minimax(gameState, Math.min(5, 9 - moves), -10000, 10000, true, true);
            } else {
                minimax(gameState, Math.min(5, 9 - moves), -10000, 10000, false, true);
            }
        }
        if (moves >= 3) {
            positionScore(gameState, scores);
            moveScores.innerHTML = `The current score is O=${scores.oScore}, X=${scores.xScore}`;
        }

    })
})

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
}

resetButton.addEventListener('click', function () {
    reset();
})

radioO.addEventListener('click', function () {
    start = 'O';
    radioX.classList.remove('first');
    radioO.classList.add('first');
});

radioX.addEventListener('click', function () {
    start = 'X';
    radioO.classList.remove('first');
    radioX.classList.add('first');
});

radioPlayer.addEventListener('click', function () {
    start2 = 'P';
    radioComputer.classList.remove('first');
    radioPlayer.classList.add('first');
});

radioComputer.addEventListener('click', function () {
    start2 = 'C';
    radioPlayer.classList.remove('first');
    radioComputer.classList.add('first');
});

startButton.addEventListener('click', function () {
    radioO.classList.add('divdisable');
    radioX.classList.add('divdisable');
    radioPlayer.classList.add('divdisable');
    radioComputer.classList.add('divdisable');
    grid.classList.remove('divdisable');
    startButton.classList.add('divdisable');
    if (start2 == 'C') {
        let position = getRandomInt(0, 2);
        if (position === 2) {
            gameState[1][1] = start;
            const tcel = document.querySelector("#c11");
            tcel.innerHTML = start;
        } else {
            let x = 0;
            let y = 0;
            let orientation = getRandomInt(0, 3);
            if (position === 0) {
                if (orientation === 0) {
                    // Default
                } else if (orientation === 1) {
                    x = 2;
                } else if (orientation === 2) {
                    y = 2;
                } else {
                    x = 2;
                    y = 2;
                }
                gameState[x][y] = start;
                const tid = `#c${x}${y}`;
                const tcel = document.querySelector(tid);
                tcel.innerHTML = start;
            } else {
                if (orientation === 0) {
                    x = 1;
                } else if (orientation === 1) {
                    y = 1;
                } else if (orientation === 2) {
                    y = 1;
                    x = 2;
                } else {
                    y = 2;
                    x = 1;
                }
                gameState[x][y] = start;
                const tid = `#c${x}${y}`;
                const tcel = document.querySelector(tid);
                tcel.innerHTML = start;
            }
        }
        moves = 1;
        who = start;
        nextPlayer();
    }
});