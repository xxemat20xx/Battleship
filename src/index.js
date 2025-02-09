import './styles.css';
import ship1 from './asset/imgs/ship1.png';
import ship2 from './asset/imgs/ship2.png';
import ship3 from './asset/imgs/ship3.png';
import ship4 from './asset/imgs/ship4.png';
import ship5 from './asset/imgs/ship5.png';
import GameBoard from './gameboard';
import Ship from './ship';
import Player from './player';

const shipImages = {
  5: ship5,
  4: ship4,
  3: ship3,
  2: ship2,
  1: ship1,
};

document.querySelectorAll('.ship').forEach((ship) => {
  const length = ship.getAttribute('data-length');
  if (shipImages[length]) {
    ship.style.backgroundImage = `url(${shipImages[length]})`;
    ship.style.backgroundSize = 'cover';
  }
});



const ship = new Ship(5);
const player = new Player('Raymart');

console.log(player.board.placeShip(ship, 4, 4, "horizontal"));

// Log the updated board
player.board.printBoard(player.name);