
export interface ISquare {
    mine: boolean;
    status: "FLAGGED" | "REVEALED" | "DEFAULT";
    number: number;
}

export default class Board {

    private grid: ISquare[][] = [];

    constructor (
        private size: number,
        private totalMines: number
    ) {
        if ((size * size) < totalMines) throw new Error("Too many mines!");
        this.generateGrid();
        this.print();
    }

    private print() {
        this.grid.forEach((row, x) => {
            let rowString = "";
            row.forEach((square, y) => {
                if (square.mine === true) {
                    rowString += "*";
                } else if (square.number > 0) {
                    rowString += square.number;
                } else {
                    rowString += " ";
                }
            });
            console.log(rowString + "\n");
        })
    }

    private generateGrid () {
        
        // Populate Array with default square.
        this.grid = Array.from({length: this.size}, () => {
            return Array.from({length: this.size}, () => {
                return {mine: false, status: "DEFAULT", number: 0};
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
                        this.grid[x][y].mine === true
                    ) {
                        count ++;
                    }
                });
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
