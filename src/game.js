import { DOM } from "./dom";
import { Gameboard } from "./gameboard";
import { Player } from "./player";
export class Game {
  constructor() {
    this.draggedShip = null;
    this.isGameStarted = false;
    this.turn = true;
    this.registeredShip = [];
    this.isHorizontal = true;
    // imported classes
    this.dom = new DOM();
    this.player = new Player("Player"); //your board
    this.computer = new Player("Computer"); //computer board;

    //board elements
    this.playerBoardElement = document.querySelector("#playerboard");
    this.computerBoardElement = document.querySelector("#computerboard");

    //Button elements
    this.startGameBtn = document.querySelector("#startGame");

    // drag and drop elements
    this.ships = document.querySelectorAll(".ship");

    // other elements
    this.hitStatMsg = document.querySelector("#hit-or-miss-msg");
    this.turnMsg = document.querySelector("#turnMessage");
    this.playerScore = document.querySelector("#playerScore");
    this.computerScore = document.querySelector("#opponentScore");
    this.draggableShips = document.querySelectorAll(".ships-content");
  }
  initBoard() {
    //start game
    this.startGameBtn.addEventListener("click", () => this.startGame());

    //create initial setup for player drop ship to start the game
    this.dom.createBoard(this.playerBoardElement, this.player.board);
    this.ships.forEach((ship, index) => {
      ship.dataset.shipId = `ship-${index}`;
      ship.addEventListener("dragstart", () => {
        this.draggedShip = ship;
      });
    });
    this.ships.forEach((ship) => {
      ship.addEventListener("dragend", () => {
        this.draggedShip = null;
      });
    });
    this.playerBoardElement.addEventListener("dragover", (e) => {
      e.preventDefault();
    });
    this.playerBoardElement.addEventListener("drop", (e) => {
      e.preventDefault();
      const cell = e.target.closest(".cell");
      if (!cell) return;
      if (cell.classList.contains("ship-placed")) {
        alert("Cell occupied, place to another cell.");
        return;
      }
      if (this.draggedShip && !this.isGameStarted) {
        const row = parseInt(cell.dataset.row, 10);
        const col = parseInt(cell.dataset.col, 10);
        const length = parseInt(this.draggedShip.dataset.length, 10);
        const shipId = this.draggedShip.dataset.shipId;

        const isWithinBounds = row + length <= 10 && col + length <= 10;
        if (
          isWithinBounds &&
          this.player.canPlaceShip(this.playerBoardElement, row, col, length)
        ) {
          this.player.placeShip(
            this.playerBoardElement,
            row,
            col,
            length,
            shipId,
          );
        } else {
          alert("Ship placement is out of bounds!");
          return;
        }
        // Store ship details for game start
        this.registeredShip.push({ row, col, length, shipId });

        // Enable start button only when all ships are placed
        if (this.registeredShip.length === this.ships.length) {
          this.startGameBtn.disabled = false;
       
          document.querySelector(".draggable-ship-container").remove();
          document.querySelector(".modal h2").innerHTML = "Alrighty, let set sail!"
        }

        this.draggedShip.style.display = "none";
        this.draggedShip.parentElement.remove();
      }
    });
  }
  startGame() {
    this.isGameStarted = true;
    // this.dom.renderLoadingScreen(); //loading screen
    console.log(this.player)
    console.log(this.computer)
    this.dom.main.style.display = "block";
    this.dom.modal.style.display = "none";
    this.turnMsg.textContent = "Player's Turn";

    //create board for player
    this.dom.createBoard(this.dom.ingameBoard, this.player.board);

    // transfer the registered place ship of the player to the gameboard
    this.registeredShip.forEach(({ row, col, length, shipId }) => {
      this.player.placeShip(this.dom.ingameBoard, row, col, length, shipId);
    });

    //create board for computer
    this.dom.createBoard(this.computerBoardElement, this.computer.board);
    // random place of computer ships --import the function from gameboard.js
    this.computer.computerPlaceShips(this.computerBoardElement);

    //click attack handler on computer board
    this.computerBoardElement.addEventListener("click", (e) => {
      if (!this.turn) return;
      const cell = e.target.closest(".cell");
      if (
        !cell ||
        cell.classList.contains("hit") ||
        cell.classList.contains("miss")
      )
        return;
      const row = parseInt(cell.dataset.row);
      const col = parseInt(cell.dataset.col);

      this.playerAttack(row, col);
    });
  }
  playerAttack(row, col) {
    if (!this.turn || !this.isGameStarted) return; // Prevent attack if it's not player's turn or game is not started

    this.computer.receiveAttack(row, col);
    const computerCell = document.querySelector(
      `#computerboard .cell[data-row="${row}"][data-col="${col}"]`,
    );
    const cellState = this.computer.board.board[row][col];
    
    if (cellState === "miss") {
      computerCell.classList.add("miss");
      computerCell.textContent = "O";
      this.turnMsg.textContent = "Computer's Turn";
      this.turn = false; // Player's turn is disabled

      // Computer attacks after a delay
      setTimeout(() => {
        this.computerAttack();
      }, 2000);
    } else if (cellState === "hit") {
      computerCell.classList.add("hit");
      computerCell.textContent = "X";
      this.turnMsg.textContent = "Player's Turn";
      this.turn = true; // Player gets another turn
      this.dom.updateScore(this.playerScore);

      if (this.computer.board.allShipSunk()) {
        console.log("All ships sunk, you've won!");
        this.turnMsg.textContent = "You've won!"
        this.isGameStarted = false;
      }
    }
  }

  computerAttack() {
    let row, col, playerCell;
    do {
        row = Math.floor(Math.random() * 10);
        col = Math.floor(Math.random() * 10);
        playerCell = document.querySelector(
            `#ingameboard .cell[data-row="${row}"][data-col="${col}"]`
        );
    } while (
        playerCell.classList.contains("hit") ||
        playerCell.classList.contains("miss")
    );

    this.player.receiveAttack(row, col);
    const cellState = this.player.board.board[row][col];

    if (cellState === "miss") {
        playerCell.classList.add("miss");
        playerCell.textContent = "O";
        this.turnMsg.textContent = "Player's Turn";
        this.turn = true; // Restore player's turn after the computer attack
    } else if (cellState === "hit") {
        playerCell.classList.add("hit");
        playerCell.textContent = "X";
        this.dom.updateScore(this.computerScore);

        if (this.player.board.allShipSunk()) {
            console.log("All ships sunk, computer won!");
            console.log(this.player.ships)
            this.turnMsg.textContent = "Computer won!";
            this.isGameStarted = false;
        } else {
            setTimeout(() => {
                this.computerAttack();
            }, 2000);
        }
    }
}
}
