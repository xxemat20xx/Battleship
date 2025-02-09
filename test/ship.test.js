import Ship from '../src/ship.js';

describe('Ship', () => {
    test('should initialize with correct length and 0 hits', () => {
        const ship = new Ship(3);
        expect(ship.length).toBe(3);
        expect(ship.hits).toBe(0);
    });

    test('hit() should increment the hits count', () => {
        const ship = new Ship(4);
        ship.hit();
        expect(ship.hits).toBe(1);
        ship.hit();
        expect(ship.hits).toBe(2);
    });

    test('isSunk() should return false when hits are less than length', () => {
        const ship = new Ship(3);
        ship.hit();
        expect(ship.isSunk()).toBe(false);
        ship.hit();
        expect(ship.isSunk()).toBe(false);
    });

    test('isSunk() should return true when hits equal ship length', () => {
        const ship = new Ship(3);
        ship.hit();
        ship.hit();
        ship.hit();
        expect(ship.isSunk()).toBe(true);
    });

    test('isSunk() should return true when hits exceed ship length', () => {
        const ship = new Ship(2);
        ship.hit();
        ship.hit();
        ship.hit();
        expect(ship.isSunk()).toBe(true);
    });
});