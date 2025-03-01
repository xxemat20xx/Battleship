import { Game } from "./game";
import { Ship } from "./ship";

export class DOM {
  constructor() {
    //player board and opponent board
    this.ingameBoard = document.querySelector("#ingameboard");

    this.startGameContainer = document.querySelector(".startgame-container");
    this.modalStartBtn = document.querySelector("#btn-game-start");
    this.modal = document.querySelector(".modal");
    this.main = document.querySelector("main");
    this.loadingScreen = document.querySelector(".loading-screen");
    this.ship = new Ship();
  }
  init() {
    const game = new Game();
    this.modalStartBtn.addEventListener("click", () => {
      this.startGameContainer.style.display = "none";
      this.modal.style.display = "block";
      game.initBoard();
    });
  }
  //create board for player and computer
  createBoard(gridElement, gameboard) {
    gridElement.innerHTML = "";
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.dataset.row = i;
        cell.dataset.col = j;
        gridElement.appendChild(cell);
      }
    }
  }
  updateScore(el) {
    el.innerHTML = this.ship.recordHit();
  }
  renderLoadingScreen() {
    const progressBar = document.querySelector(".progress-bar");

    let progress = 0;
    this.loadingScreen.style.display = "flex"; //loading screen show first
    const interval = setInterval(() => {
      progress += 10; // Increment progress
      progressBar.style.width = progress + "%";

      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          this.loadingScreen.style.display = "none";
        }, 500); // Delay before hiding
        this.loadingScreen.style.display = "none";
      }
    }, 500); // Adjust speed
  }
}
