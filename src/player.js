import GameBoard from "./gameboard";
class Player{
    constructor(name){
        this.name = name;
        this.board = new GameBoard();
    }
    attack(opponentBoard, row, col){
        console.log(`${this.name} attacks (${row}, ${col})!`);
        return opponentBoard.receiveAttack(row, col);
    }
    placeShip(ship, row, col, direction){
        this.board.placeShip(ship, row, col, direction)
    }
}
export default Player;