import './styles.css';
import { Game } from './game';

document.addEventListener('DOMContentLoaded', () => {
    const game = new Game();
    game.init();
});