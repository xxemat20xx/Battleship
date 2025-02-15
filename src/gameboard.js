import { Ship } from "./ship";
export class Gameboard{
    constructor(){
        this.ships = [];
        this.missedAttacks = [];
        this.board = this.createGrid();
    }
    createGrid(){
        return Array.from({length: 10}, () => Array(10).fill(null));
    }
    canPlaceShip(board, startRow, startCol, size){ 
        for(let i = 0; i < size; i++){
            const cell = board.querySelector(`.cell[data-row="${startRow}"][data-col="${startCol + i}"]`);
            if(!cell || cell.classList.contains("ship-placed")){
                return false;
            }
        }
        return true;
    }
    placeShip(board, startRow, startCol, size){
        for(let i = 0; i < size; i++){
            const cell = board.querySelector(`.cell[data-row="${startRow}"][data-col="${startCol + i}"]`);
            cell.classList.add("ship-placed");
        }
    }
    computerPlaceShips(){
        const lengths = [5, 4, 3, 2, 2];
        lengths.forEach(length => {
            let placed = false;
            while(!placed){
                const row = Math.floor(Math.random() * 10);
                const col = Math.floor(Math.random() * (10 - length));
                if(this.canPlaceShip(this.board, row, col, length)){
                    this.ships.push(new Ship(length));
                    this.placeShip(this.board, row, col, length);
                    placed = true;
                }
            }
        });
    }
    receiveAttack(row, col){
        if(this.board[row][col] === null){
            this.board[row][col] = "miss";
            this.missedAttacks.push([row, col]);
        } else if(this.board[row][col] === "miss"){
            return;
        } else {
            this.board[row][col].hit();
        }
    }
    allShipSunk(){
        return this.ships.every(ship => ship.isSunk());
    }
}