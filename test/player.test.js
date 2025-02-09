import Player from "../src/player";
import GameBoard from "../src/gameboard";

describe("Player", () => {
    let player;
    let opponentBoard;

    beforeEach(() => {
        player = new Player("TestPlayer");
        opponentBoard = {
            receiveAttack: jest.fn().mockReturnValue("hit")
        };
    });

    test("should create a player with a name and a game board", () => {
        expect(player.name).toBe("TestPlayer");
        expect(player.board).toBeInstanceOf(GameBoard);
    });

    test("attack should call opponentBoard.receiveAttack with correct row and col", () => {
        const result = player.attack(opponentBoard, 1, 2);
        expect(opponentBoard.receiveAttack).toHaveBeenCalledWith(1, 2);
        expect(result).toBe("hit");
    });

    test("attack should log the attack message", () => {
        console.log = jest.fn();
        player.attack(opponentBoard, 3, 4);
        expect(console.log).toHaveBeenCalledWith("TestPlayer attacks (3, 4)!");
    });
});