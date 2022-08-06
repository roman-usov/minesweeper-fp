// Display/UI

import {
  TILE_STATUSES,
  createBoard,
  markTile,
  revealTile,
  checkWin,
  checkLose,
  positionMatch,
  markedTiles,
} from './minesweeper';

let testBoard;

if (process.env.NODE_ENV !== 'production' && window.testBoard) {
  testBoard = window.testBoard;
}

const BOARD_SIZE = testBoard?.length ?? 10;
const NUMBER_OF_MINES =
  testBoard?.flat().filter((tile) => tile.mine).length ?? 3;

/* const minePos = [
  { x: 0, y: 3 },
  { x: 1, y: 3 },
  { x: 2, y: 3 },
  { x: 3, y: 3 },
  { x: 3, y: 2 },
  { x: 3, y: 1 },
  { x: 3, y: 0 },
]; */

let board =
  testBoard ??
  createBoard(BOARD_SIZE, getMinePositions(BOARD_SIZE, NUMBER_OF_MINES));

const boardElement = document.querySelector('.board');
const minesLeftText = document.querySelector('[data-mine-count]');
const messageText = document.querySelector('.subtext');

function render() {
  boardElement.innerHTML = '';

  checkGameEnd();

  getTileElements().forEach((element) => {
    boardElement.append(element);
  });

  listMinesLeft();
}

function getTileElements() {
  return board.flatMap((row) => row.map(tileToElement));
}

function tileToElement(tile) {
  const element = document.createElement('div');
  element.dataset.status = tile.status;
  element.dataset.x = tile.x;
  element.dataset.y = tile.y;
  element.textContent = tile.adjacentMinesCount || '';
  return element;
}

boardElement.addEventListener('click', (e) => {
  if (!e.target.matches('[data-status]')) return;

  board = revealTile(board, {
    x: parseInt(e.target.dataset.x, 10),
    y: parseInt(e.target.dataset.y, 10),
  });

  render();
});

boardElement.addEventListener('contextmenu', (e) => {
  e.preventDefault();
  if (!e.target.matches('[data-status]')) return;
  board = markTile(board, {
    x: parseInt(e.target.dataset.x, 10),
    y: parseInt(e.target.dataset.y, 10),
  });

  render();
});

boardElement.style.setProperty('--size', BOARD_SIZE);

render();

function listMinesLeft() {
  minesLeftText.textContent = (NUMBER_OF_MINES - markedTiles(board)).toString();
}

function checkGameEnd() {
  const win = checkWin(board);
  const lose = checkLose(board);

  if (win || lose) {
    boardElement.addEventListener('click', stopProp, { capture: true });
    boardElement.addEventListener('contextmenu', stopProp, { capture: true });
  }

  if (win) {
    messageText.textContent = 'You Win';
  }
  if (lose) {
    messageText.textContent = 'You Lose';
    board.forEach((row) => {
      row.forEach((tile) => {
        if (tile.status === TILE_STATUSES.MARKED) {
          board = markTile(board, { x: tile.x, y: tile.y });
        }
        if (tile.mine) {
          board = revealTile(board, { x: tile.x, y: tile.y });
        }
      });
    });
  }
}

function stopProp(e) {
  e.stopImmediatePropagation();
}

function getMinePositions(boardSize, numberOfMines) {
  const positions = [];

  while (positions.length < numberOfMines) {
    const position = {
      x: randomNumber(boardSize),
      y: randomNumber(boardSize),
    };

    if (!positions.some(positionMatch.bind(null, position))) {
      positions.push(position);
    }
  }

  return positions;
}

function randomNumber(size) {
  return Math.floor(Math.random() * size);
}
