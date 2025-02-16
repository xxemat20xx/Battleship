import { DOM } from './dom';
import { Gameboard } from './gameboard';

export class Game{
    constructor(){
        //elements
        this.playerBoard = document.querySelector("#playerboard");
        this.ships = document.querySelectorAll(".ship");
        this.startGameBtn = document.querySelector("#startGame");
        this.modal = document.querySelector(".modal");
        this.main = document.querySelector("main");
        this.startGameContainer = document.querySelector(".startgame-container");
        this.start = document.querySelector("#btn-game-start");

        //ingame board el
        this.ingameBoard = document.querySelector("#ingameboard");
        this.opponentBoard = document.querySelector("#oppenentboard");

        //variables/
        this.occupiedCell = [];
        this.gameStarted = false;
        this.draggedShip = null;
        
        // imported classes
        this.dom = new DOM();
        this.gameboard = new Gameboard();
    }
    init() {
        
        
      const dom = this.dom;
      const gameboard = this.gameboard;
        
      //hide startgame container button, container, and the next element to show.
      dom.startGame(this.start, this.startGameContainer, this.modal);
      // Create setup board
      dom.createBoard(this.playerBoard, gameboard.board);
        
      // Drag and drop logic for ships
      this.ships.forEach(ship => {
          ship.addEventListener("dragstart", () => {
              this.draggedShip = ship;
          });
      });
  
      this.ships.forEach(ship => { 
          ship.addEventListener("dragend", () => {
              this.draggedShip = null;
          });
      });
  
      this.playerBoard.addEventListener("dragover", (e) => {
          e.preventDefault();
      });
  
      this.playerBoard.addEventListener("drop", (e) => {
          e.preventDefault();
          const cell = e.target.closest('.cell');
          if (!cell) return;
          if (this.draggedShip && !this.gameStarted) {
              const row = parseInt(cell.dataset.row);
              const col = parseInt(cell.dataset.col);
              const shipSize = parseInt(this.draggedShip.dataset.length);
  
              if (gameboard.canPlaceShip(this.playerBoard, row, col, shipSize)) {
                  gameboard.placeShip(this.playerBoard, row, col, shipSize);
                  
                  // 🚀 Store ship details for game start
                  this.occupiedCell.push({ row, col, shipSize });
  
                  // Enable start button only when all ships are placed
                  if (this.occupiedCell.length === this.ships.length) {
                      this.startGameBtn.disabled = false;
                  }
  
                  // Hide the ship after placing
                  this.draggedShip.style.display = "none";
                  this.draggedShip.parentElement.remove();
                  
              }
          }
      });
  
      this.startGameBtn.addEventListener("click", () => this.startGame());
  }
  startGame() {
    if (this.occupiedCell.length !== this.ships.length) {
        alert("Place all ships before starting the game!");
        return;
    }

    // 🚀 Create the in-game board
    this.dom.createBoard(this.ingameBoard, this.gameboard.board);
    this.dom.createBoard(this.opponentBoard, this.gameboard.board)
    // ✅ Transfer placed ships to in-game board
    this.occupiedCell.forEach(({ row, col, shipSize }) => {
        this.gameboard.placeShip(this.ingameBoard, row, col, shipSize);
    });

    // Hide setup modal
    this.modal.style.display = "none";

    // Set game started
    this.gameStarted = true;

    this.main.style.display = "block";
}

}