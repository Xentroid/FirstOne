const tcells = document.querySelectorAll('.tcell');
const wohWon = document.querySelector('#whoWon');
const resetButton = document.querySelector("#resetButton");
const radioO = document.querySelector("#radioO");
const radioX = document.querySelector("#radioX");

let moves = 0;
let who = 'O';
let gameState = [
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
];
let win = false;
let start = 'O';

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
    radioO.removeAttribute("disabled");
    radioX.removeAttribute("disabled");
}

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