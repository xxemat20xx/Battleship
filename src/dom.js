export class DOM{
    constructor(){}
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
}