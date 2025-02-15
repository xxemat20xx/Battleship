document.addEventListener('DOMContentLoaded', () => {
    const playerBoard = document.getElementById('player-board');
    const computerBoard = document.getElementById('computer-board');
    const ships = document.querySelectorAll('.ship');
    const startGameButton = document.getElementById('start-game');
    let draggedShip = null;
    let gameStarted = false;

    // Create 10x10 grid for player and computer
    function createBoard(boardElement, isPlayer) {
        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 10; j++) {
                const cell = document.createElement('div');
                cell.classList.add('cell');
                cell.dataset.row = i;
                cell.dataset.col = j;
                if (!isPlayer) {
                    cell.addEventListener('click', () => attackComputer(cell));
                }
                boardElement.appendChild(cell);
            }
        }
    }

    createBoard(playerBoard, true);
    createBoard(computerBoard, false);

    // Drag and Drop functionality
    ships.forEach(ship => {
        ship.addEventListener('dragstart', (e) => {
            draggedShip = e.target;
            e.dataTransfer.setData('text/plain', e.target.id);
        });

        ship.addEventListener('dragend', () => {
            draggedShip = null;
        });
    });

    playerBoard.addEventListener('dragover', (e) => {
        e.preventDefault();
    });

    playerBoard.addEventListener('drop', (e) => {
        e.preventDefault();
        if (draggedShip && !gameStarted) {
            const cell = e.target;
            const row = parseInt(cell.dataset.row);
            const col = parseInt(cell.dataset.col);
            const shipSize = parseInt(draggedShip.dataset.size);

            if (canPlaceShip(playerBoard, row, col, shipSize)) {
                placeShip(playerBoard, row, col, shipSize);
                draggedShip.style.display = 'none'; // Hide the ship after placing
            }
        }
    });

    // Check if the ship can be placed
    function canPlaceShip(board, startRow, startCol, size) {
        for (let i = 0; i < size; i++) {
            const cell = board.querySelector(`.cell[data-row='${startRow}'][data-col='${startCol + i}']`);
            if (!cell || cell.classList.contains('ship-placed')) {
                return false;
            }
        }
        return true;
    }

    // Place the ship on the grid
    function placeShip(board, startRow, startCol, size) {
        for (let i = 0; i < size; i++) {
            const cell = board.querySelector(`.cell[data-row='${startRow}'][data-col='${startCol + i}']`);
            cell.classList.add('ship-placed');
        }
    }

    // Computer places ships randomly
    function placeComputerShips() {
        const shipSizes = [2, 3, 4];
        shipSizes.forEach(size => {
            let placed = false;
            while (!placed) {
                const row = Math.floor(Math.random() * 10);
                const col = Math.floor(Math.random() * (10 - size));
                if (canPlaceShip(computerBoard, row, col, size)) {
                    placeShip(computerBoard, row, col, size);
                    placed = true;
                }
            }
        });
    }

    // Player attacks computer's board
    function attackComputer(cell) {
        if (gameStarted && !cell.classList.contains('hit') && !cell.classList.contains('miss')) {
            if (cell.classList.contains('ship-placed')) {
                cell.classList.add('hit');
                alert('Hit!');
            } else {
                cell.classList.add('miss');
                alert('Miss!');
            }
            computerAttack();
        }
    }

    // Computer attacks player's board
    function computerAttack() {
        let attacked = false;
        while (!attacked) {
            const row = Math.floor(Math.random() * 10);
            const col = Math.floor(Math.random() * 10);
            const cell = playerBoard.querySelector(`.cell[data-row='${row}'][data-col='${col}']`);
            if (!cell.classList.contains('hit') && !cell.classList.contains('miss')) {
                if (cell.classList.contains('ship-placed')) {
                    cell.classList.add('hit');
                    alert('Computer hit your ship!');
                } else {
                    cell.classList.add('miss');
                    alert('Computer missed!');
                }
                attacked = true;
            }
        }
    }

    // Start Game Button
    startGameButton.addEventListener('click', () => {
        if (!gameStarted) {
            placeComputerShips();
            gameStarted = true;
            startGameButton.disabled = true;
            alert('Game Started! Attack the computer\'s board.');
        }
    });
});