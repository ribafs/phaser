var Match3 = Match3 || {};

Match3.Board = function(state, rows, cols, blockVariations) {

    this.state = state;
    this.rows = rows;
    this.cols = cols;
    this.blockVariations = blockVariations;

    //main grid
    this.grid = [];
    for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
        this.grid.push([]);

        for (let colIndex = 0; colIndex < cols; colIndex++) {
            this.grid[rowIndex].push(0);
        }
    }

    //reserve grid on the top, for when new blocks are needed
    this.reserveGrid = [];

    this.RESERVE_ROW = rows;

    for (let rowIndex = 0; rowIndex < this.RESERVE_ROW; rowIndex++) {
        this.reserveGrid.push([]);

        for (let colIndex = 0; colIndex < this.cols; colIndex++) {
            this.reserveGrid[rowIndex].push(0);
        }
    }

    //populate grids
    this.populateGrid();
    this.populateReserveGrid();
};

Match3.Board.prototype.populateGrid = function() {
    for (let rowIndex = 0; rowIndex < this.rows; rowIndex++) {
        for (let colIndex = 0; colIndex < this.cols; colIndex++) {
            variation = Math.floor(Math.random() * this.blockVariations) + 1
            this.grid[rowIndex][colIndex] = variation;
        }
    }

    //if there are any chains,re-populate
    var chains = this.findAllChains();
    if (chains.length > 0) {
        this.populateGrid();
    }
};

Match3.Board.prototype.populateReserveGrid = function() {

    var variation;
    for (let rowIndex = 0; rowIndex < this.RESERVE_ROW; rowIndex++) {
        for (let colIndex = 0; colIndex < this.cols; colIndex++) {
            variation = Math.floor(Math.random() * this.blockVariations) + 1
            this.reserveGrid[rowIndex][colIndex] = variation;
        }
    }
};

Match3.Board.prototype.consoleLog = function() {
    var prettyString = '';

    for (let rowIndex = 0; rowIndex < this.RESERVE_ROW; rowIndex++) {
        prettyString += '\n';
        for (let colIndex = 0; colIndex < this.cols; colIndex++) {
            prettyString += ' ' + this.reserveGrid[rowIndex][colIndex];
        }
    }

    prettyString += '\n';

    for (let colIndex = 0; colIndex < this.cols; colIndex++) {
        prettyString += ' -';
    }



    for (let rowIndex = 0; rowIndex < this.rows; rowIndex++) {
        prettyString += '\n';
        for (let colIndex = 0; colIndex < this.cols; colIndex++) {
            prettyString += ' ' + this.grid[rowIndex][colIndex];
        }
    }
    console.table(prettyString)
}

//Swapping Blocks
//İki bloğu takas etme

//Match3.GameState.board.swap({row:0,col:0},{row:0,col:1})
Match3.Board.prototype.swap = function(source, target) {
    var temp = this.grid[target.row][target.col]
    this.grid[target.row][target.col] = this.grid[source.row][source.col]
    this.grid[source.row][source.col] = temp;

    var tempPos = { row: source.row, col: source.col };
    source.row = target.row
    source.col = target.col

    target.row = tempPos.row;
    target.col = tempPos.col;
}


//Check if two blocks are adjacent
Match3.Board.prototype.checkAdjacent = function(source, target) {
    var diffRow = Math.abs(source.row - target.row);
    var diffCol = Math.abs(source.col - target.col);

    var isAdjacent = (diffRow === 1 && diffCol === 0) || (diffRow === 0 && diffCol === 1)
    return isAdjacent;
};

//check whether a single block is chained or not
Match3.Board.prototype.isChained = function(block) {
    var isChained = false;
    var variation = this.grid[block.row][block.col];
    var row = block.row;
    var col = block.col;

    //left
    if (variation === this.grid[row][col - 1] && variation === this.grid[row][col - 2]) {
        isChained = true;
    }

    //right
    if (variation === this.grid[row][col + 1] && variation === this.grid[row][col + 2]) {
        isChained = true;
    }


    //up
    if (this.grid[row - 2]) {
        if (variation === this.grid[row - 1][col] && variation === this.grid[row - 2][col]) {
            isChained = true;
        }
    }

    //down
    if (this.grid[row + 2]) {
        if (variation === this.grid[row + 1][col] && variation === this.grid[row + 2][col]) {
            isChained = true;
        }
    }

    //center - horizontal
    if (variation === this.grid[row][col - 1] && variation === this.grid[row][col + 1]) {
        isChained = true;
    }

    //center - vertical
    if (this.grid[row + 1] && this.grid[row - 1]) {
        if (variation === this.grid[row - 1][col] && variation === this.grid[row + 1][col]) {
            isChained = true;
        }
    }

    return isChained;
}

//tüm 3'lü zincirleri bulma
Match3.Board.prototype.findAllChains = function() {
    var chained = [];
    for (let rowIndex = 0; rowIndex < this.rows; rowIndex++) {
        for (let colIndex = 0; colIndex < this.cols; colIndex++) {
            if (this.isChained({ row: rowIndex, col: colIndex })) {
                chained.push({ row: rowIndex, col: colIndex })
            }
        }
    }
    return chained;
}

//clear all the chains
Match3.Board.prototype.clearChains = function() {
    //get all blocks that need to be cleared
    var chainedBlocks = this.findAllChains()

    chainedBlocks.forEach((block) => {
        this.grid[block.row][block.col] = 0


        //kill the block object
        var a = this.state.getBlockFromColRow(block).kill()
    })
}


// drop a block in the main grid from a position to another.the source is set to zero

//Ana tablo üzerinde boş alanları yukarıdan aşağıya indirip doldurma
Match3.Board.prototype.dropBlock = function(sourceRow, targetRow, col) {
    this.grid[targetRow][col] = this.grid[sourceRow][col];
    this.grid[sourceRow][col] = 0;

    this.state.dropBlock(sourceRow, targetRow, col)
}


// drop a block in the reserve grid from a position to another.the source is set to zero

//Ana tablo üzerinde boş alanları yedek tablo üzerinden yukarıdan aşağıya indirip doldurma

Match3.Board.prototype.dropReserveBlock = function(sourceRow, targetRow, col) {
    this.grid[targetRow][col] = this.reserveGrid[sourceRow][col];
    this.reserveGrid[sourceRow][col] = 0;

    this.state.dropReserveBlock(sourceRow, targetRow, col)
}


//move down blocks to fill in empty slots


Match3.Board.prototype.updateGrid = function() {
    var foundBlock

    //go through all the row,from the bottom up
    for (let rowIndex = this.rows - 1; rowIndex >= 0; rowIndex--) {
        for (let colIndex = 0; colIndex < this.cols; colIndex++) {
            //if the block if zero, then get climb up to get a non-zero one
            if (this.grid[rowIndex][colIndex] === 0) {
                foundBlock = false;

                for (let k = rowIndex - 1; k >= 0; k--) {
                    if (this.grid[k][colIndex] > 0) {
                        this.dropBlock(k, rowIndex, colIndex);
                        foundBlock = true;
                        break;
                    }
                }
                //climb up in the main grid
                if (!foundBlock) {
                    //climb up in the reserve grid
                    for (let k = this.RESERVE_ROW - 1; k >= 0; k--) {
                        if (this.reserveGrid[k][colIndex] > 0) {
                            this.dropReserveBlock(k, rowIndex, colIndex);
                            break;
                        }
                    }
                }
            }
        }
    }

    //repopulate the reserve
    this.populateReserveGrid()
};