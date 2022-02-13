const player = (name, indicator) => {
    const toggleTurn = () => {
        indicator.classList.toggle('turn');
    }
    return {
        name,
        toggleTurn,
    }
}

const gameBoardContainer = document.querySelector('.gameboard');
const players = [
    player('X', document.querySelector('.playerX')),
    player('O', document.querySelector('.playerO')),
];

const gameBoard = ((container, players) => {
    const board = [
        '', '', '',
        '', '', '',
        '', '', '',
    ];

    // Returns de name of the winner, NotFinish or Tie.
    const gameResult = () => {
        // check for rows
        for (const i of [0, 1, 2]) {
            if (board[3 * i + 0] != '' && board[3 * i + 0] == board[3 * i + 1] && board[3 * i + 0] == board[3 * i + 2]) {
                return board[3 * i + 0];
            }
        }
        // check for columns
        for (const j of [0, 1, 2]) {
            if (board[0 + j] != '' && board[0 + j] == board[3 + j] && board[0 + j] == board[6 + j]) {
                return board[0 + j];
            }
        }
        // check diagonals
        if (board[0] != '' && board[0] == board[4] && board[0] == board[8]) {
            return board[0];
        }
        if (board[6] != '' && board[6] == board[4] && board[6] == board[2]) {
            return board[6];
        }
        if (board.some(x => x == '')) {
            return 'NotFinish';
        }
        return 'Tie';
    }

    let _currentPlayer = null;

    const _messages = document.querySelector('.messages');

    const playerIndicator = document.querySelectorAll('.players > .player');

    const indicatorHandler = (e) => {
        const symbol = e.target.dataset.symbol;
        _currentPlayer = players.find((x) => {
            return x.name == symbol;
        });
        _currentPlayer.toggleTurn();
        playerIndicator.forEach((a) => {
            a.removeEventListener('click', indicatorHandler);
        });
        _messages.textContent = '';
    };

    playerIndicator.forEach((indicator) => {
        indicator.addEventListener('click', indicatorHandler);
    });


    const draw = function () {
        let i = 0;
        for (const cell of board) {
            const sq = container.querySelector(`.cell.cell${i}`)
            sq.textContent = cell;
            i++;
        }
    }

    const _flipPlayer = function () {
        if (_currentPlayer == players[0]) {
            _currentPlayer = players[1];
        } else {
            _currentPlayer = players[0];
        }
        for (const player of players) {
            player.toggleTurn();
        }
    }
    const cells = container.querySelectorAll('.cell');

    const cellClickHandler = (e) => {
        if (!_currentPlayer) {
            return;
        }
        const cell = e.target;
        if (cell.textContent == '') {
            board[+cell.dataset.i] = _currentPlayer.name; 
            cell.textContent = _currentPlayer.name;
            const result = gameResult();
            if (result != 'NotFinish') {
                if (result == 'Tie'){
                    _messages.textContent = `Tie`;
                } else {
                    _messages.textContent = `The winner is ${result}`;
                }
                cells.forEach((cell) => {
                    cell.removeEventListener('click', cellClickHandler);
                });
                return;
            }
            _flipPlayer();
        }
    };

    cells.forEach((cell) => {
        cell.addEventListener('click', cellClickHandler);
    });

    return {
        draw,
    }
})(gameBoardContainer, players);


gameBoard.draw();


