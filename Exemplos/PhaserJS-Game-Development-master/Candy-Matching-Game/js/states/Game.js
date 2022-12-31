var Match3 = Match3 || {};

Match3.GameState = {
    init: function() {

        this.NUM_ROWS = 8;
        this.NUM_COLS = 8;
        this.NUM_VARIATIONS = 6;
        this.BLOCK_SIZE = 35;
        this.ANIMATION_TIME = 200;
    },
    create: function() {

        //game background
        this.background = this.add.sprite(0, 0, 'background');

        this.blocks = this.add.group();

        //board model
        this.board = new Match3.Board(this, this.NUM_ROWS, this.NUM_COLS, this.NUM_VARIATIONS);
        this.board.consoleLog();


        //draw board
        this.drawBoard();

    },
    createBlock: function(x, y, data) {
        var block = this.blocks.getFirstExists(false);

        if (!block) {
            block = new Match3.Block(this, x, y, data);
            this.blocks.add(block);
        } else {
            block.reset(x, y, data);
        }

        return block;
    },
    //Tahta ve blokları oluşturma
    drawBoard: function() {
        var block, square, x, y, data;

        //semi-transparent black squares
        var squareBitmap = this.add.bitmapData(this.BLOCK_SIZE + 4, this.BLOCK_SIZE + 4)
        squareBitmap.ctx.fillStyle = "#000";
        squareBitmap.ctx.fillRect(0, 0, this.BLOCK_SIZE + 4, this.BLOCK_SIZE + 4);

        for (let rowIndex = 0; rowIndex < this.NUM_ROWS; rowIndex++) {
            for (let colIndex = 0; colIndex < this.NUM_COLS; colIndex++) {
                x = 36 + colIndex * (this.BLOCK_SIZE + 6);
                y = 150 + rowIndex * (this.BLOCK_SIZE + 6);
                square = this.add.sprite(x, y, squareBitmap);
                square.anchor.setTo(0.5)
                square.alpha = 0.2;

                this.createBlock(x, y, { asset: 'block' + this.board.grid[rowIndex][colIndex], row: rowIndex, col: colIndex })
            }
        }
        this.game.world.bringToTop(this.blocks); //z-index
    },
    getBlockFromColRow: function(position) {
        var foundBlock;

        this.blocks.forEachAlive((block) => {
            if (block.row === position.row && block.col === position.col) {
                foundBlock = block;

            }
        })
        return foundBlock
    },
    dropBlock: function(sourceRow, targetRow, col) {
        var block = this.getBlockFromColRow({ row: sourceRow, col: col });
        var targetY = 150 + targetRow * (this.BLOCK_SIZE + 6);

        block.row = targetRow

        var blockMovement = this.game.add.tween(block);
        blockMovement.to({ y: targetY }, this.ANIMATION_TIME)
        blockMovement.start();
    },
    dropReserveBlock: function(sourceRow, targetRow, col) {
        var x = 36 + col * (this.BLOCK_SIZE + 6);
        var y = -(this.BLOCK_SIZE + 6) * this.board.RESERVE_ROW + sourceRow * (this.BLOCK_SIZE + 6);

        var block = this.createBlock(x, y, { asset: 'block' + this.board.grid[targetRow][col], row: targetRow, col: col })
        var targetY = 150 + targetRow * (this.BLOCK_SIZE + 6);

        var blockMovement = this.game.add.tween(block);
        blockMovement.to({ y: targetY }, this.ANIMATION_TIME);
        blockMovement.start();
    },
    swapBlocks: function(block1, block2) {

        //when swapping scale block1 back to 1
        block1.scale.setTo(1);

        var block1Movement = this.game.add.tween(block1);
        block1Movement.to({ x: block2.x, y: block2.y }, this.ANIMATION_TIME);
        block1Movement.onComplete.add(() => {
            this.board.swap(block1, block2);

            if (!this.isReversingSwap) {
                var chains = this.board.findAllChains();
                if (chains.length > 0) {
                    this.updateBoard();

                } else {
                    this.isReversingSwap = true;
                    this.swapBlocks(block1, block2)
                }
            } else {
                this.isReversingSwap = false;
                this.clearSelection()
            }
        })
        block1Movement.start()

        var block2Movement = this.game.add.tween(block2);
        block2Movement.to({ x: block1.x, y: block1.y }, this.ANIMATION_TIME);
        block2Movement.start()
    },
    pickBlock: function(block) {
        //only swap if the UI is not blocked
        console.log(this.isBoardBlocked)
        if (this.isBoardBlocked) {
            return
        }

        // if there is nothing selected
        if (!this.selectedBlock) {
            block.scale.setTo(1.5);
            this.selectedBlock = block;
        } else {
            //second block you are selecting is target block
            this.targetBlock = block;

            //only adjacent blocks can swap
            if (this.board.checkAdjacent(this.selectedBlock, this.targetBlock)) {
                this.isBoardBlocked = true;

                this.swapBlocks(this.selectedBlock, this.targetBlock)
            } else {
                this.clearSelection()
            }
        }
    },
    clearSelection: function() {
        this.isBoardBlocked = false;
        this.selectedBlock = null;
        this.blocks.setAll('scale.x', 1);
        this.blocks.setAll('scale.y', 1);
    },
    updateBoard: function() {
        this.board.clearChains();
        this.board.updateGrid();

        //after the dropping has ended
        this.game.time.events.add(this.ANIMATION_TIME, () => {
            //see if there new chains
            var chains = this.board.findAllChains()
            if (chains.length > 0) {
                this.updateBoard()
            } else {
                this.clearSelection();
            }
        }, this)
    }

}