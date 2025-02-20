import { DOM } from './dom';
import { Gameboard } from './gameboard';
import { Player } from './player';
import { Ship } from './ship';
export class Game{
    constructor(){
        //elements
        this.startGameBtn = document.querySelector("#startGame");
 

        //variables/
        this.occupiedCell = [];
        this.gameStarted = false;
        this.draggedShip = null;
        
        // imported classes
        this.dom = new DOM();
        this.computerboard = new Gameboard();
        this.player = new Gameboard();
        this.ship = new Ship();
        // board el
        this.ingameBoard = this.dom.ingameBoard;
        this.opponentBoard = this.dom.opponentBoard;
        this.ships = this.dom.ships;
        this.playerBoard = this.dom.playerBoardElement;

        // scoring
        this.playerScore = document.querySelector("#playerScore");

    }
    initBoard() {
        
      const player = new Player("Player");
      const dom = this.dom;
      
      
      // Create setup board
      dom.createBoard(this.playerBoard, this.player.board); // gameboard.board
        
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
  
              if (this.player.canPlaceShip(this.playerBoard, row, col, shipSize)) {
                  this.player.placeShip(this.playerBoard, row, col, shipSize);
                  
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
    this.dom.createBoard(this.ingameBoard, this.player.board);
    this.dom.createBoard(this.opponentBoard, this.computerboard.board);

    this.computerboard.computerPlaceShips(this.opponentBoard);
    this.opponentBoard.addEventListener("click",  e =>{
        const cell = e.target.closest('.cell');
        if(!cell || cell.classList.contains("hit") || cell.classList.contains("miss")) return;

        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.col);
        this.attackComputer(row, col);
    })

    // Transfer PLAYER placed ships to in-game board 
    this.occupiedCell.forEach(({ row, col, shipSize }) => {
        this.player.placeShip(this.ingameBoard, row, col, shipSize);
    });

    // Set game started
    this.gameStarted = true;
    this.dom.main.style.display = "block";
    this.dom.modal.style.display = "none";
}
// player attack the computer board
attackComputer(row, col){
    this.computerboard.receiveAttack(row,col);
    const computerCell = document.querySelector(`#oppenentboard .cell[data-row="${row}"][data-col="${col}"]`);
    const cellState = this.computerboard.board[row][col];
        console.log(this.computerboard.board)

    if(this.gameStarted && cellState === "miss"){
        computerCell.classList.add("miss");
        computerCell.textContent = "O";
       
    }else if(cellState === "hit"){
        computerCell.classList.add("hit");
        computerCell.textContent = "X";
        this.dom.updateScore(this.playerScore);
    }
}


}