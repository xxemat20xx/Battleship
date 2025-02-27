  import { Ship } from "./ship";

  export class Gameboard {
    constructor() {
      this.ships = [];
      this.missedAttacks = [];
      this.board = this.createGrid();
    }
    createGrid() {
      return Array.from({ length: 10 }, () => Array(10).fill(null));
    }
    canPlaceShip(boardElement, startRow, startCol, size, isHorizontal = true) {
      for (let i = 0; i < size; i++) {
        const row = isHorizontal ? startRow : startRow + i;
        const col = isHorizontal ? startCol + i : startCol;
        const cell = boardElement.querySelector(
          `.cell[data-row="${row}"][data-col="${col}"]`,
        );
        if (!cell || cell.classList.contains("ship-placed")) {
          return false;
        }
      }
      return true;
    }
    placeShip(
      boardElement,
      startRow,
      startCol,
      length,
      shipId,
      isHorizontal = true,
    ) {
      const ship = new Ship(length, shipId); // Create ship instance once
      for (let i = 0; i < length; i++) {
        const row = isHorizontal ? startRow : startRow + i;
        const col = isHorizontal ? startCol + i : startCol;
        const cell = boardElement.querySelector(
          `.cell[data-row="${row}"][data-col="${col}"]`,
        );
        if (cell) {
          cell.classList.add("ship-placed");
          cell.setAttribute("data-ship-id", shipId);
          this.ships.push(ship)
          // Store the Ship instance to array
          this.board[row][col] = ship;
        }
      }
    }
    computerPlaceShips(boardElement) {
      const lengths = [5, 4, 3, 2, 1];
      let shipId = 1;
      lengths.forEach((length) => {
        let placed = false;
        while (!placed) {
          const row = Math.floor(Math.random() * 10);
          const col = Math.floor(Math.random() * (10 - length));

          if (this.canPlaceShip(boardElement, row, col, length)) {
            const newShip = new Ship(length, `ship-${shipId}`);
            this.ships.push(newShip);
            this.placeShip(boardElement, row, col, length, newShip.id);

            for (let i = 0; i < length; i++) {
              const cell = boardElement.querySelector(
                `.cell[data-row="${row}"][data-col="${col + i}"]`,
              );
              cell.classList.add("ship-placed", "computer-ship");
              cell.setAttribute("data-ship-id", newShip.id);
            }
            placed = true;
            shipId++;
          }
        }
      });
    }
    receiveAttack(row, col) {
      const target = this.board[row][col];

      if (target === null) {
        this.board[row][col] = "miss";
        this.missedAttacks.push([row, col]);
      } else if (target instanceof Ship) {
        this.board[row][col] = "hit";
        target.recordHit();
        if (target.isSunk()) {
          this.ships = this.ships.filter((ship) => ship.id !== target.id);
        }
      }
    }
    allShipSunk() {
     
      return this.ships.every(ship => ship.isSunk());
     
    }
  }
