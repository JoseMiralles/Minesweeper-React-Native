
type squareStatus = "FLAGGED" | "REVEALED" | "DEFAULT";

interface ISquare {
    mine: boolean;
    status: squareStatus;
    number: number;
    pos: [number, number];
}

export default class Board {

    public mineTriggered = false;
    public completed = false;
    public grid: ISquare[][] = [];
    
    private openedSquares = 0;
    private goalSquares;

    constructor (
        private size: number,
        private totalMines: number
    ) {
        if ((size * size) < totalMines) throw new Error("Too many mines!");
        this.goalSquares = (size * size) - totalMines;
        this.generateGrid();
    }

    /**
     * Assigns the given status to the given square.
     * 
     * @param x row
     * @param y column
     * @param newStatus the status to assign the square
     * @returns TRUE if the game should continue.
     */
    public modifySquare (
        x: number,
        y: number,
        newStatus: squareStatus
    ): boolean {

        debugger;

        if (this.isValidPosition(x,y) === true){

            const square = this.grid[x][y];
            if (square.status === "REVEALED") return true; // Do not modify if it's already revealed.
            square.status = newStatus;

            if (square.status === "REVEALED" && square.mine === true) {
                this.mineTriggered = true;
                return false;
            } else if (square.status === "REVEALED") {
                // TODO move this to it's own method, and add graph traversal to islands.
                this.openedSquares ++;
                if (this.openedSquares >= this.goalSquares) {
                    this.completed = true;
                    return false;
                }
            }
        }

        return true;
    }

    public print(): string {
        let res = "";
        this.grid.forEach((row, x) => {
            row.forEach((square, y) => {
                if (square.mine === true) {
                    res += "*";
                } else {
                    res += square.number;
                }
                res += " "
            });
            res += "\n";
        });
        return res;
    }

    private generateGrid () {

        let r = 0;
        
        // Populate Array with default square.
        this.grid = Array.from({length: this.size}, () => {
            r ++;
            let c = 0;
            return Array.from({length: this.size}, () => {
                c ++;
                return {mine: false, status: "DEFAULT", number: 0, pos: [r - 1, c - 1]};
            });
        });

        // Add mines randomly.
        let minesLeft = this.totalMines;
        while (minesLeft > 0) {
            const row = Math.floor(Math.random() * this.grid.length);
            const col = Math.floor(Math.random() * this.grid[0].length);
            if (this.grid[row][col].mine === false) {
                this.grid[row][col].mine = true;
                minesLeft --;
            }
        }

        const offsets: {x: number; y: number}[] = [
            { x: -1, y: -1 },
            { x: -1, y: 0 },
            { x: -1, y: 1 },
            { x: 0, y: -1 },
            { x: 0, y: 1 },
            { x: 1, y: -1 },
            { x: 1, y: 0 },
            { x: 1, y: 1 },
        ];

        // Assign correct numbers based on surrounding mines.
        this.grid.forEach((row, x) => {
            row.forEach((square, y) => {

                let count = 0;

                offsets.forEach(offset => {
                    if (
                        this.isValidPosition(x + offset.x, y + offset.y) &&
                        this.grid[(x + offset.x)][(y + offset.y)].mine === true
                    ) {
                        count ++;
                    }
                });

                square.number = count;
            })
        })
    };

    /**
     * Checks if the given postion is within the board bounds.
     */
    private isValidPosition (row: number, col: number): boolean {
        if (!this.grid) throw new Error("Can't check position, grid is undefined!");
        if (row < 0 || row > this.grid?.length - 1) return false;
        if (col < 0 || col > this.grid[0].length - 1) return false;
        return true;
    }
}
