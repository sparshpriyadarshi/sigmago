export default class GoBoardT {

    static EMPTY_CELL = '+';
    static BLACK_STONE = 'B';
    static WHITE_STONE = 'W';
    static ALLOWED_BOARD_SIZES = [9, 13, 19];
    static propClone(src, dest){
        //src, dest should be GoBoardTs
        try {
            dest.size = src.size;
            dest.board = [];
            for (let i = 0; i < src.size; i++) {
                let row = [];
                for (let j = 0; j < src.size; j++) {
                    row.push(src.board[i][j]);
                }
                dest.board.push(row);
            }

        } catch (error) {
            throw new Error('Board Object clone failed');
        }

        return dest;
    }
    constructor(size) {
        this.size = size;
        this.board = [];

        if (!GoBoardT.ALLOWED_BOARD_SIZES.includes(size)) { //this does not work why ?
            throw new Error('Invalid board size');
        }

        for (let i = 0; i < this.size; i++) {
            let row = [];
            for (let j = 0; j < this.size; j++) {
                row.push(GoBoardT.EMPTY_CELL);
            }
            this.board.push(row);
        }
    }
    placeStone(row, col, color) {
        if (row < 0 || row >= this.size || col < 0 || col >= this.size) {
            throw new Error('Invalid position');
        }
        if (this.board[row][col] !== GoBoardT.EMPTY_CELL) {
            //throw new Error('Position already occupied');
        }
        this.board[row][col] = color;
    }

    clearCell(row, col) {
        if (row < 0 || row >= this.size || col < 0 || col >= this.size) {
            throw new Error('Invalid position');
        }
        this.board[row][col] = GoBoardT.EMPTY_CELL;
    }

    printBoard() {
        for (let i = 0; i < this.size; i++) {
            console.log(this.board[i].join(' '));
        }
    }

    getBoardGrid() {
        let res = "";
        for (let i = 0; i < this.size; i++) {
            res += this.board[i].join('') + "\n";
        }
        return res;
    }

    clearBoard() {
        this.board.flatMap(row => row.fill(GoBoardT.EMPTY_CELL));
    }
}

console.log('GoBoardType dot js loaded');
// Usage example:
// const board = new GoBoard(9);
// board.placeStone(3, 3, 'B');
// board.placeStone(6, 6, 'W');
// board.placeStone(6, 7, 'B');
// board.placeStone(7, 7, 'W');
// board.placeStone(7, 6, 'B');
// console.log(">>> BOARD <<<");
// board.printBoard();

// board.clearCell(5, 6);
// console.log(">>> BOARD <<<");
// board.printBoard();
// console.log(">>> BOARD <<<");
// board.clearBoard();
// board.printBoard();


