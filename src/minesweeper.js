import { times, range } from 'lodash/fp';

// Logic

export const TILE_STATUSES = {
  HIDDEN: 'hidden',
  MINE: 'mine',
  NUMBER: 'number',
  MARKED: 'marked',
};

export function createBoard(boardSize, minePositions) {
  return times(
    (x) =>
      times(
        (y) => ({
          x,
          y,
          status: TILE_STATUSES.HIDDEN,
          mine: minePositions.some(positionMatch.bind(null, { x, y })),
        }),
        boardSize
      ),
    boardSize
  );
}

function replaceTile(board, position, newTile) {
  return board.map((row, x) =>
    row.map((tile, y) => {
      if (positionMatch(position, { x, y })) {
        return newTile;
      }
      return { ...tile };
    })
  );
}

export function markTile(board, { x, y }) {
  const tile = board[x][y];

  if (
    tile.status !== TILE_STATUSES.HIDDEN &&
    tile.status !== TILE_STATUSES.MARKED
  ) {
    return board;
  }

  if (tile.status === TILE_STATUSES.MARKED) {
    return replaceTile(
      board,
      { x, y },
      { ...tile, status: TILE_STATUSES.HIDDEN }
    );
  }

  return replaceTile(
    board,
    { x, y },
    { ...tile, status: TILE_STATUSES.MARKED }
  );
}

export function revealTile(board, { x, y }) {
  const tile = board[x][y];

  if (tile.status !== TILE_STATUSES.HIDDEN) {
    return board;
  }

  if (tile.mine) {
    return replaceTile(
      board,
      { x, y },
      { ...tile, status: TILE_STATUSES.MINE }
    );
  }

  const adjacentTiles = nearbyTiles(board, tile);
  const mines = adjacentTiles.filter((t) => t.mine);

  const newBoard = replaceTile(
    board,
    { x, y },
    { ...tile, status: TILE_STATUSES.NUMBER, adjacentMinesCount: mines.length }
  );

  if (mines.length === 0) {
    return adjacentTiles.reduce((brd, tl) => revealTile(brd, tl), newBoard);
  }

  return newBoard;
}

export function markedTiles(board) {
  return board.reduce(
    (count, row) =>
      count + row.filter((tile) => tile.status === TILE_STATUSES.MARKED).length,
    0
  );
}

export function checkWin(board) {
  return board.every((row) =>
    row.every(
      (tile) =>
        tile.status === TILE_STATUSES.NUMBER ||
        (tile.mine &&
          (tile.status === TILE_STATUSES.HIDDEN ||
            tile.status === TILE_STATUSES.MARKED))
    )
  );
}

export function checkLose(board) {
  return board.some((row) =>
    row.some((tile) => tile.status === TILE_STATUSES.MINE)
  );
}

export function positionMatch(a, b) {
  return a.x === b.x && a.y === b.y;
}

function nearbyTiles(board, { x, y }) {
  const offsets = range(-1, 2);

  return offsets
    .flatMap((xOffset) =>
      offsets.map((yOffset) => board[x + xOffset]?.[y + yOffset])
    )
    .filter((tile) => tile != null);
}
