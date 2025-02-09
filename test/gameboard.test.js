import GameBoard from '../src/gameboard';
import Ship from '../src/ship';

jest.mock('../src/ship'); // Mock the Ship class

describe('Gameboard', () => {
  let gameboard;
  let mockShip;

  beforeEach(() => {
    gameboard = new GameBoard();
    mockShip = new Ship();
  });

  test('should create a 10x10 grid', () => {
    const grid = gameboard.createGrid();
    expect(grid.length).toBe(10);
    expect(grid[0].length).toBe(10);
  });

  test('should validate horizontal ship placement correctly', () => {
    mockShip.length = 3;
    expect(gameboard.isPlacementValid(mockShip, 0, 0, 'horizontal')).toBe(true);
    expect(gameboard.isPlacementValid(mockShip, 0, 8, 'horizontal')).toBe(false);
  });

  test('should validate vertical ship placement correctly', () => {
    mockShip.length = 3;
    expect(gameboard.isPlacementValid(mockShip, 0, 0, 'vertical')).toBe(true);
    expect(gameboard.isPlacementValid(mockShip, 8, 0, 'vertical')).toBe(false);
  });

  test('should place ship on the board', () => {
    mockShip.length = 3;
    const result = gameboard.placeShip(mockShip, 0, 0, 'horizontal');
    expect(result).toBe(true);
    expect(gameboard.board[0][0]).toBe(mockShip);
  });

  test('should not place ship if placement is invalid', () => {
    mockShip.length = 3;
    const result = gameboard.placeShip(mockShip, 0, 8, 'horizontal');
    expect(result).toBe(false);
  });

  test('should register a hit when attack is made on a ship', () => {
    mockShip.length = 3;
    gameboard.placeShip(mockShip, 0, 0, 'horizontal');
    const result = gameboard.receiveAttack(0, 0);
    expect(result).toBe(true);
    expect(gameboard.board[0][0]).toBe('X');
  });

  test('should register a miss when attack is made on an empty space', () => {
    const result = gameboard.receiveAttack(0, 0);
    expect(result).toBe(false);
    expect(gameboard.board[0][0]).toBe('O');
  });

  test('should validate attack coordinates', () => {
    expect(gameboard.isValidAttack(10, 10)).toBe(false); // Out of bounds
    expect(gameboard.isValidAttack(0, 0)).toBe(true);  // Valid attack
  });

  test('should return true if all ships are sunk', () => {
    mockShip.isSunk.mockReturnValue(true); // Mock isSunk method
    gameboard.ships = [mockShip];
    expect(gameboard.allShipsSunk()).toBe(true);
  });

  test('should return false if not all ships are sunk', () => {
    mockShip.isSunk.mockReturnValue(false); // Mock isSunk method
    gameboard.ships = [mockShip];
    expect(gameboard.allShipsSunk()).toBe(false);
  });
});
