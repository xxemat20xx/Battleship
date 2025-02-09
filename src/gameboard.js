import Ship from "./ship";

class Gameboard{
    constructor(){
        this.board = this.createGrid();
        this.ships = []; // to hold the ship on the gameboard
    };
    createGrid(){
        return Array.from({ length: 10 }, () => Array(10).fill(null));
    };
    isPlacementValid(ship, row, col, direction){
        if(direction === 'horizontal'){
            if(col + ship.length > 10)
                return false; // if ship goes beyond right bound
        }else if(direction === 'vertical'){
            if(row + ship.length > 10) 
                return false; // if beyond bottom bound
        }
        for(let i = 0; i < ship.length; i++){
            if(direction === 'horizontal' && this.board[row][col + i] !== null){
                return false; // overlapse horizontally
            }
            if(direction === 'vertical' && this.board[row + i][col] !== null){
                return false; // overlaps w/ vertically
            }
        }
        return true;
    };
    placeShip(ship, row, col, direction) {
    
        if (this.isPlacementValid(ship, row, col, direction)) {
          for (let i = 0; i < ship.length; i++) {
            if (direction === "horizontal") {
              this.board[row][col + i] = ship; // Place ship horizontally
            } else if (direction === "vertical") {
              this.board[row + i][col] = ship; // Place ship vertically
            }
          }
          this.ships.push(ship); // Add ship to the list
          console.log(`Ship of length ${length} placed at (${row}, ${col}) facing ${direction}`);
          return true;
        }
    
        console.log(`Invalid ship placement at (${row}, ${col}) facing ${direction}`);
        return false;
      }
      receiveAttack(row, col) {
        // Check if the attack hits a ship
        const target = this.board[row][col];
        
        if (target !== null) {
          // Attack hits a ship
          target.hit(row, col); // Assuming the Ship class has a hit method that marks the hit
          this.board[row][col] = 'X'; // Mark the position as a hit
    
          if (target.isSunk()) {
            console.log("Ship is sunk!");
          }
          return true; // Hit
        } else {
          // Attack misses
          this.board[row][col] = 'O'; // Mark the position as a miss
          return false; // Miss
        }
      }
      isValidAttack(row, col) {
        // Check if the coordinates are within bounds
        if (row < 0 || row >= 10 || col < 0 || col >= 10) {
          console.log("Attack is out of bounds!");
          return false;
        }
    
        // Check if the cell has already been attacked (hit or miss)
        if (this.board[row][col] === "X" || this.board[row][col] === "O") {
          console.log("Attack has already been made at this location!");
          return false;
        }
    
        // Attack is valid
        return true;
      }
      allShipsSunk() {
        // Use the isSunk() method from the Ship class to check if all ships are sunk
        return this.ships.every(ship => ship.isSunk());
      }
      printBoard() {
        console.log(this.board.map(row => row.map(cell => (cell ? (cell === "X" ? "X" : cell === "O" ? "O" : "S") : ".")).join(" ")).join("\n"));
      }
}
export default Gameboard;