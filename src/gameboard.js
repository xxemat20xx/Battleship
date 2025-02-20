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
    placeShip(board, startRow, startCol, size, shipId){
        const ship = new Ship(size, shipId)
        for(let i = 0; i < size; i++){
            this.board[startRow][startCol + i] = ship;
            const cell = board.querySelector(`.cell[data-row="${startRow}"][data-col="${startCol + i}"]`);
            cell.classList.add("ship-placed");
        }
    }
    computerPlaceShips(boardElement){
        const lengths = [5, 4, 3, 2, 1];
        lengths.forEach(length => {
            let placed = false;
            while(!placed){
                const row = Math.floor(Math.random() * 10);
                const col = Math.floor(Math.random() * (10 - length));

                if(this.canPlaceShip(boardElement, row, col, length)){
                    this.ships.push(new Ship(length));
             
                    this.placeShip(boardElement, row, col, length);

                    for(let i = 0; i < length; i++){
                        const cell = boardElement.querySelector(`.cell[data-row="${row}"][data-col="${col + i}"]`);
                        cell.classList.add("ship-placed", "computer-ship");
                    }
                    placed = true;
                }
            }
        });
    }
    receiveAttack(row, col){
        const target = this.board[row][col];
       
        if(target === null){
            this.board[row][col] = "miss";
            this.missedAttacks.push([row, col]);
        } else if(target instanceof Ship){
            this.board[row][col] = "hit";
            // this.board[row][col].recordHit();
        } 
    }
    allShipSunk(){
        return this.ships.every(ship => ship.isSunk());
    }
}