import { Game } from "./game";
import { Gameboard } from "./gameboard";
import { Ship } from "./ship";
export class DOM{
    constructor(){
        // elements
        this.ships = document.querySelectorAll(".ship");
        this.playerBoardElement = document.querySelector("#playerboard");

         //player board and opponent board
         this.ingameBoard = document.querySelector("#ingameboard");
         this.opponentBoard = document.querySelector("#oppenentboard");

         this.startGameContainer = document.querySelector(".startgame-container");
         this.mainPageStart = document.querySelector("#btn-game-start");
         this.modal = document.querySelector(".modal");
         this.main = document.querySelector("main");
         this.ship = new Ship;
    }
    init(){
        const game = new Game();
        this.mainPageStart.addEventListener("click", () => {
            this.startGameContainer.style.display = "none";
            this.modal.style.display = "block";
            game.initBoard();
        });

    }
    //create board for player and computer
    createBoard(gridElement, gameboard){
        gridElement.innerHTML = "";
        for(let i = 0; i < 10; i++){
            for(let j = 0; j < 10; j++){
                const cell = document.createElement("div");
                cell.classList.add("cell");
                cell.dataset.row = i;
                cell.dataset.col = j;
                gridElement.appendChild(cell);
            }
        }
    }
    updateScore(el){
        el.innerHTML = this.ship.recordHit();
    }
}