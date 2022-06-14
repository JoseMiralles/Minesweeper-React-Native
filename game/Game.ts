import Board from "./Board";

export type gameState = "WON" | "LOST" | "STARTED";

export default class Game {

    public board: Board;

    constructor (
        public size: number,
        totalMines: number
    ) {
        this.board = new Board(size, totalMines);
    }

    public gameStatus(): gameState {
        if (this.board.mineTriggered) return "LOST";
        if (this.board.completed) return "WON";
        return "STARTED";
    }
}
