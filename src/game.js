// import { DOM } from './dom';
// import { Gameboard } from './gameboard';
// import { Player } from './player';
// import { Ship } from './ship';
// export class Game{
//     constructor(){
//           // imported classes
//           this.dom = new DOM();
//           this.computerboard = new Gameboard();
//           this.player = new Gameboard();
//           this.ship = new Ship();

//         //btn elements
//         this.startGameBtn = document.querySelector("#startGame");
//         this.resetGameBtn = document.querySelector("#resetGame");

//         //variables/
//         this.occupiedCell = [];
//         this.gameStarted = false;
//         this.draggedShip = null;

//         // board el
//         this.ingameBoard = this.dom.ingameBoard;
//         this.opponentBoard = this.dom.opponentBoard;
//         this.ships = this.dom.ships;
//         this.playerBoard = this.dom.playerBoardElement;

//         // scoring
//         this.playerScore = document.querySelector("#playerScore");

//     }
//     initBoard() {

//       const player = new Player("Player");
//       const dom = this.dom;

//       // Create setup board for player drag and drop ship before staring the game
//       dom.createBoard(this.playerBoard, this.player.board);

//       // Drag and drop logic for ships
//       this.ships.forEach(ship => {
//           ship.addEventListener("dragstart", () => {
//               this.draggedShip = ship;
//           });
//       });

//       this.ships.forEach(ship => {
//           ship.addEventListener("dragend", () => {
//               this.draggedShip = null;
//           });
//       });

//       this.playerBoard.addEventListener("dragover", (e) => {
//           e.preventDefault();
//       });

//       this.playerBoard.addEventListener("drop", (e) => {
//           e.preventDefault();
//           const cell = e.target.closest('.cell');
//           if (!cell) return;
//           if (this.draggedShip && !this.gameStarted) {
//               const row = parseInt(cell.dataset.row);
//               const col = parseInt(cell.dataset.col);
//               const shipSize = parseInt(this.draggedShip.dataset.length);

//               if (this.player.canPlaceShip(this.playerBoard, row, col, shipSize)) {
//                   this.player.placeShip(this.playerBoard, row, col, shipSize);

//                   // Store ship details for game start
//                   this.occupiedCell.push({ row, col, shipSize });

//                   // Enable start button only when all ships are placed
//                   if (this.occupiedCell.length === this.ships.length) {
//                       this.startGameBtn.disabled = false;
//                   }
//                   // Hide the ship after placing
//                   this.draggedShip.style.display = "none";
//                   this.draggedShip.parentElement.remove();

//               }

//           }
//       });
//       this.startGameBtn.addEventListener("click", () => this.startGame());
//   }
//   startGame() {
//     if (this.occupiedCell.length !== this.ships.length) {
//         alert("Place all ships before starting the game!");
//         return;
//     }
//     // Create the in-game board for player and computer
//     this.dom.createBoard(this.ingameBoard, this.player.board);
//     this.dom.createBoard(this.opponentBoard, this.computerboard.board);

//     this.computerboard.computerPlaceShips(this.opponentBoard);
//     this.opponentBoard.addEventListener("click",  e =>{
//         const cell = e.target.closest('.cell');
//         if(!cell || cell.classList.contains("hit") || cell.classList.contains("miss")) return;

//         const row = parseInt(cell.dataset.row);
//         const col = parseInt(cell.dataset.col);
//         this.attackComputer(row, col);
//     })

//     // Transfer PLAYER placed ships to in-game board
//     this.occupiedCell.forEach(({ row, col, shipSize }) => {
//         this.player.placeShip(this.ingameBoard, row, col, shipSize);
//     });
//     console.log("Player board", this.player.board);
//     console.log("Computer board", this.computerboard.board)
//     // Set game started
//     this.gameStarted = true;
//     this.dom.main.style.display = "block";
//     this.dom.modal.style.display = "none";
// }
// // player attack the computer board
// attackComputer(row, col){
//     this.computerboard.receiveAttack(row,col);
//     const computerCell = document.querySelector(`#oppenentboard .cell[data-row="${row}"][data-col="${col}"]`);
//     const cellState = this.computerboard.board[row][col];

//     if(this.gameStarted && cellState === "miss"){
//         computerCell.classList.add("miss");
//         computerCell.textContent = "O";

//     }else if(cellState === "hit"){
//         computerCell.classList.add("hit");
//         computerCell.textContent = "X";

//         this.dom.updateScore(this.playerScore);

//         if(this.computerboard.allShipSunk()){
//             console.log("All Ship was sunk.");
//         }
//     }
// }
// }

import { DOM } from "./dom";
import { Gameboard } from "./gameboard";
import { Ship } from "./ship";

export class Game {
  constructor() {
    this.draggedShip = null;
    this.isGameStarted = false;
    this.registeredShip = [];
    // imported classes
    this.dom = new DOM();
    this.player = new Gameboard(); //your board
    this.computer = new Gameboard(); //computer board;

    //board elements
    this.playerBoardElement = document.querySelector("#playerboard");
    this.computerBoardElement = document.querySelector("#computerboard");

    //Button elements
    this.startGameBtn = document.querySelector("#startGame");

    // drag and drop elements
    this.ships = document.querySelectorAll(".ship");
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
        }
        this.draggedShip.style.display = "none";
        this.draggedShip.parentElement.remove();
      }
    });
  }
  startGame() {
    //
    this.gameStarted = true;
    this.dom.main.style.display = "block";
    this.dom.modal.style.display = "none";

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
      const cell = e.target.closest(".cell");
      if (
        !cell ||
        cell.classList.contains("hit") ||
        cell.classList.contains("miss")
      )
        return;
      const row = parseInt(cell.dataset.row);
      const col = parseInt(cell.dataset.col);

      // attack computer function > pass the row, col
      this.attackComputer(row, col);
    });
  }
  attackComputer(row, col) {
    this.computer.receiveAttack(row, col);

    const computerCell = document.querySelector(
      `#computerboard .cell[data-row="${row}"][data-col="${col}"]`,
    );
    const cellState = this.computer.board[row][col];

    if (this.gameStarted && cellState === "miss") {
      computerCell.classList.add("miss");
      computerCell.textContent = "O";
    } else if (cellState === "hit") {
      computerCell.classList.add("hit");
      computerCell.textContent = "X";

      if (this.computer.allShipSunk()) {
        console.log("All Ship was sunk.");
        this.gameStarted = false;
        return;
      }
    }
  }
  turn() {
    if (!this.gameStarted) return;

    // Player's turn
    this.computerBoardElement.addEventListener("click", (e) => {
      const cell = e.target.closest(".cell");
      if (
        !cell ||
        cell.classList.contains("hit") ||
        cell.classList.contains("miss")
      )
        return;

      const row = parseInt(cell.dataset.row);
      const col = parseInt(cell.dataset.col);
      this.attackComputer(row, col);

      // Check if game is still ongoing
      if (this.gameStarted) {
        this.computerAttack();
      }
    });
  }

  computerAttack() {
    let row, col, cell;
    do {
      row = Math.floor(Math.random() * 10);
      col = Math.floor(Math.random() * 10);
      cell = document.querySelector(
        `#playerboard .cell[data-row="${row}"][data-col="${col}"]`,
      );
    } while (cell.classList.contains("hit") || cell.classList.contains("miss"));

    this.player.receiveAttack(row, col);

    const cellState = this.player.board[row][col];
    if (cellState === "miss") {
      cell.classList.add("miss");
      cell.textContent = "O";
    } else if (cellState === "hit") {
      cell.classList.add("hit");
      cell.textContent = "X";
    }

    if (this.player.allShipSunk()) {
      console.log("Computer wins! All player ships sunk.");
      this.gameStarted = false;
    }
  }
}
