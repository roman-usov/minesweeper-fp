import {
  positionMatch,
  createBoard,
  markTile,
  revealTile,
  markedTiles,
  checkWin,
  checkLose,
} from './minesweeper';

import {
  threeMinePositions,
  threeMineBoard,
  startingBoard,
  boardMarkedToHidden,
  boardHiddenToMarked,
  boardWithMine,
  startingBoardToTestRevealingTilesUntilMines,
  boardWithTilesRevealedUntilMines,
  startingBoardToTestRevealTileWithMinesAround,
  boardWithTileSurroundedByMinesRevealed,
  boardWithZeroMarkedTiles,
  boardWithThreeMarkedTiles,
  winningBoard,
  losingBoard,
} from './testHelpers';

describe('minesweeper functions tests', () => {
  describe('#positionMatch', () => {
    test('positions with the same coordinates should match', () => {
      const a = { x: 0, y: 2 };
      const b = { x: 0, y: 2 };

      expect(positionMatch(a, b)).toBe(true);
    });

    test('positions with different coordinates shouldn not match', () => {
      const a = { x: 1, y: 3 };
      const b = { x: 0, y: 2 };

      expect(positionMatch(a, b)).toBe(false);
    });
  });

  describe('#createBoard', () => {
    describe('should create a board of given size and with given mine position', () => {
      const boardSize = 10;

      test('board with 3 mines', () => {
        expect(createBoard(boardSize, threeMinePositions)).toEqual(
          threeMineBoard
        );
      });
    });
  });

  describe('#markTile', () => {
    describe("if the tile's status is neither hidden nor marked", () => {
      test('it should return the current board unchanged', () => {
        const board = markTile(startingBoard, { x: 0, y: 0 });

        expect(board).toEqual(startingBoard);
      });
    });

    describe("if the tile's status is marked", () => {
      test("it should return a new board with the tile's status as hidden", () => {
        const board = markTile(startingBoard, { x: 0, y: 1 });

        expect(board).toEqual(boardMarkedToHidden);
      });
    });

    describe("if the tile's status is hidden", () => {
      test("it should return a new board with the tile's status as marked", () => {
        const board = markTile(startingBoard, { x: 0, y: 2 });

        expect(board).toEqual(boardHiddenToMarked);
      });
    });
  });

  describe('#revealTile', () => {
    describe('if the tile status is not hidden', () => {
      test('it should return the current board unchanged', () => {
        const board = revealTile(startingBoard, { x: 0, y: 0 });

        expect(board).toEqual(startingBoard);
      });
    });

    describe('if the tile is a mine', () => {
      test('it should return a new board with the tile status change to mine', () => {
        const board = revealTile(startingBoard, { x: 0, y: 3 });

        expect(board).toEqual(boardWithMine);
      });
    });

    describe('if the tile has no adjacent mines', () => {
      test('it should return a new board with all the tiles as far as where they border on mines set to number and the tiles bordering on mines having the adjacent mine count set to the number of adjacent mines', () => {
        const board = revealTile(startingBoardToTestRevealingTilesUntilMines, {
          x: 0,
          y: 0,
        });

        expect(board).toEqual(boardWithTilesRevealedUntilMines);
      });
    });

    describe('if the tile has adjacent mines all around', () => {
      test('it should return a new board with the tile revealed and its adjacent mine count set to the number of adjacent mines', () => {
        const board = revealTile(startingBoardToTestRevealTileWithMinesAround, {
          x: 0,
          y: 0,
        });

        expect(board).toEqual(boardWithTileSurroundedByMinesRevealed);
      });
    });
  });

  describe('#markedTiles', () => {
    describe('if there is 0 marked tiles', () => {
      test('it should return 0', () => {
        expect(markedTiles(boardWithZeroMarkedTiles)).toBe(0);
      });
    });

    describe('if there are 3 marked tiles', () => {
      test('it should return 3', () => {
        expect(markedTiles(boardWithThreeMarkedTiles)).toBe(3);
      });
    });
  });

  describe('#checkWin', () => {
    describe('If for every row all safe tiles have the status of number and all mines have the status of either hidden or marked', () => {
      test('it should return true', () => {
        expect(checkWin(winningBoard)).toBe(true);
      });
    });
    describe('If any safe cell in any row has a status of other than number or any mine has a status of other than either hidden or marked', () => {
      test('it should return false', () => {
        expect(checkWin(startingBoard)).toBe(false);
      });
    });
  });

  describe('#checkLose', () => {
    describe('If any mine on the board has the status of MINE', () => {
      test('it should return true', () => {
        expect(checkLose(losingBoard)).toBe(true);
      });
    });

    describe('If no mine on the board has the status of MINE', () => {
      test('it should return false', () => {
        expect(checkLose(startingBoard)).toBe(false);
      });
    });
  });
});
