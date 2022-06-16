
type squareStatus = "REVEALED" | "DEFAULT";

export interface ISquare {
    mine: boolean;
    status: squareStatus;
    number: number;
    pos: [number, number];
    flagged: boolean;
}

export default class Board {

    public mineTriggered = false;
    public completed = false;
    public grid: ISquare[][] = [];
    public flattenedGrid: ISquare[];
    
    private totalSquaresRevealed = 0;
    private goalSquaresRevealed;

    constructor (
        private size: number,
        private totalMines: number
    ) {
        if ((size * size) < totalMines) throw new Error("Too many mines!");
        this.goalSquaresRevealed = (size * size) - totalMines;
        this.generateGrid();
        this.flattenedGrid = this.grid.flat()
    }

    /**
     * Adds a flag to the given square.
     * @param row 
     * @param col 
     */
    toggleFlagSquare(row: number, col: number) {
        if (this.isValidPosition(row, col)) {
            const square = this.grid[row][col];
            square.flagged = !square.flagged;
        }
    }

    /**
     * Digs the given square.
     * 
     * @param x row
     * @param y column
     */
    public digSquare (
        x: number,
        y: number,
    ): void {

        if (this.isValidPosition(x,y) === true){

            const square = this.grid[x][y];
            square.status = "REVEALED";

            if (square.mine) {
                this.mineTriggered = true;
                return;
            }

            this.totalSquaresRevealed ++;

            /**
             * Check if this is a "zero" square.
             * If it is, reveal the island of "zeroes" connected to
             * this square.
             */
            if (square.number === 0) {

                const que: ISquare[] = [square];
                const XYtransforms = [
                    {x:0, y:-1},
                    {x:0, y:1},
                    {x:-1, y:0},
                    {x:1, y:0},
                ];
                const diagonalTransforms = [
                    {x: -1, y: -1},
                    {x: -1, y: 1},
                    {x: 1, y: -1},
                    {x: 1, y: 1},
                ];

                while (que.length > 0) {

                    const current = que.pop();

                    if (current) {

                        const x = current.pos[0];
                        const y = current.pos[1];
                        // console.log(`${current?.pos[0]},${current?.pos[1]}:\t${current?.status}`);
                        
                        XYtransforms.forEach(pos => {

                            if (
                                this.isValidPosition(x + pos.x, y + pos.y) &&
                                this.grid[x + pos.x][y + pos.y].mine === false
                            ) {
                                /**
                                 * Add neighboring zeroes to the queue.
                                 */
                                if (
                                    this.grid[x + pos.x][y + pos.y].status !== "REVEALED" &&
                                    this.grid[x + pos.x][y + pos.y].number === 0
                                ) {
                                    que.unshift(this.grid[x + pos.x][y + pos.y]);
                                    this.grid[x + pos.x][y + pos.y].status = "REVEALED";
                                    this.totalSquaresRevealed ++;
                                }
    
                                /**
                                 * Reveal diogonally nighboring non-seroes (edges).
                                 */
                                if (
                                    this.grid[x + pos.x][y + pos.y].status !== "REVEALED" &&
                                    this.grid[x + pos.x][y + pos.y].number !== 0
                                ) {
                                    this.grid[x + pos.x][y + pos.y].status = "REVEALED";
                                    this.totalSquaresRevealed ++;
                                }
                            }
                        });

                        /**
                         * reveal diagonal edges.
                         */
                        diagonalTransforms.forEach(pos => {
                            if (
                                this.isValidPosition(x + pos.x, y + pos.y) &&
                                this.grid[x + pos.x][y + pos.y].mine === false &&
                                this.grid[x + pos.x][y + pos.y].status !== "REVEALED" &&
                                this.grid[x + pos.x][y + pos.y].number !== 0
                            ) {
                                this.grid[x + pos.x][y + pos.y].status = "REVEALED";
                                this.totalSquaresRevealed ++;
                            }
                        });
                    }
                }
            }

            if (this.totalSquaresRevealed === this.goalSquaresRevealed) this.completed = true;
            // console.table({GOAL: this.goalSquaresRevealed, CURRENT: this.totalSquaresRevealed});
        }
    }

    public print(): string {
        let res = "";
        this.grid.forEach((row, x) => {
            row.forEach((square, y) => {
                if (square.mine === true) {
                    res += "*";
                } else if (square.status === "REVEALED") {
                    res += square.number;
                } else {
                    // res += "/";
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
                return {mine: false, status: "DEFAULT", number: 0, pos: [r - 1, c - 1], flagged: false};
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
