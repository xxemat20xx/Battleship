import { Gameboard } from "./gameboard";
export class Player{
    constructor(name){
        this.name = name;
        this.board = new Gameboard();
    }
}