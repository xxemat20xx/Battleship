import { Gameboard } from "./gameboard";

export class Player {
  constructor(name) {
    this.name = name;
    this.board = new Gameboard();
  }
  canPlaceShip(boardElement, startRow, startCol, size, isHorizontal = true) {
    return this.board.canPlaceShip(boardElement, startRow, startCol, size, isHorizontal);
  }
  placeShip(boardElement, startRow, startCol, length, shipId, isHorizontal = true) {
    this.board.placeShip(boardElement, startRow, startCol, length, shipId, isHorizontal);
  }
  computerPlaceShips(boardElement) {
    if (this.board instanceof Gameboard) {
      this.board.computerPlaceShips(boardElement);
    } else {
      console.error("ERROR: board is not a Gameboard instance", this.board);
    }
  }
  receiveAttack(row, col){
    return this.board.receiveAttack(row, col);
  }
}
