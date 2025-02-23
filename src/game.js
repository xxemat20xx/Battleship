import { DOM } from "./dom";
import { Gameboard } from "./gameboard";

export class Game {
  constructor() {
    this.draggedShip = null;
    this.isGameStarted = false;
    this.turn = true;
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

    // other elements
    this.hitStatMsg = document.querySelector("#hit-or-miss-msg");
    this.turnMsg = document.querySelector("#turnMessage");
    this.playerScore = document.querySelector("#playerScore");
    this.computerScore = document.querySelector("#opponentScore");
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
          // Add loading features
          this.dom.modal.querySelector("h2").textContent = "All ship was placed."
          this.dom.modal.querySelector(".modal-content").innerHTML = `<h2>Aight, let's sail!</h2>`
        }
        this.draggedShip.style.display = "none";
        this.draggedShip.parentElement.remove();
      }
    });
  }
  startGame() {
    this.isGameStarted = true;
    if(!this.turn || !this.isGameStarted) return;
    
    //
    this.gameStarted = true;
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
    this.computer.receiveAttack(row, col);
    const computerCell = document.querySelector(
      `#computerboard .cell[data-row="${row}"][data-col="${col}"]`
      );
    const cellState = this.computer.board[row][col];
    if(this.isGameStarted && cellState === "miss"){
      computerCell.classList.add("miss");
      computerCell.textContent = "O";
      this.turnMsg.textContent = "Computer's Turn";
      
      // add computer attack function if attack is missed
      setTimeout(() => {
        this.computerAttack();
      }, 2000);
    }else if(cellState === "hit"){
      computerCell.classList.add("hit");
      computerCell.textContent = "X";

      if(this.computer.allShipSunk()){
        console.log("All ship sunked, you've won.")
      }
    }
 
  }
  computerAttack(){
   
    let row, col, playerCell;
    do{
      row = Math.floor(Math.random() * 10);
    col = Math.floor(Math.random() * 10);
    playerCell = document.querySelector(
      `#ingameboard .cell[data-row="${row}"][data-col="${col}"]`
    );
    } while(playerCell.classList.contains("hit") || playerCell.classList.contains("miss"));
    this.player.receiveAttack(row, col)
    
    const cellState = this.player.board[row][col];
    if(cellState === "miss"){
      playerCell.classList.add("miss");
      playerCell.textContent = "O"
      this.turnMsg.textContent = "Player's Turn";
    }else if(cellState === "hit"){
      playerCell.classList.add("hit");
      playerCell.textContent = "X";
      this.dom.updateScore(this.computerScore);
      setTimeout(() => {
        this.computerAttack();
      }, 2000);
    }
  }

}
