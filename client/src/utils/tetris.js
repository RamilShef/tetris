export const COLS = 10;
export const ROWS = 20;


export const PIECES = [

  [[1,1,1,1]],

  [[1,1],
   [1,1]],

  [[0,1,0],
   [1,1,1]],
 
  [[0,1,1],
   [1,1,0]],
 
  [[1,1,0],
   [0,1,1]],

  [[1,0,0],
   [1,1,1]],
 
  [[0,0,1],
   [1,1,1]],
];


export const COLORS = [
  '#00f0f0', 
  '#f0f000', 
  '#a000f0',
  '#00f000', 
  '#f00000', 
  '#f0a000', 
  '#0000f0',
];

export const createEmptyBoard = () =>
  Array.from({ length: ROWS }, () => Array(COLS).fill(0));

export const collide = (board, piece, offset) => {
  for (let y = 0; y < piece.length; y++) {
    for (let x = 0; x < piece[0].length; x++) {
      if (piece[y][x] !== 0) {
        const boardX = offset.x + x;
        const boardY = offset.y + y;
        if (boardY >= ROWS || boardX < 0 || boardX >= COLS || (boardY >= 0 && board[boardY][boardX] !== 0)) {
          return true;
        }
      }
    }
  }
  return false;
};


export const merge = (board, piece, offset, pieceIndex) => {
  const newBoard = board.map(row => [...row]);
  for (let y = 0; y < piece.length; y++) {
    for (let x = 0; x < piece[0].length; x++) {
      if (piece[y][x] !== 0) {
        const boardY = offset.y + y;
        const boardX = offset.x + x;
        if (boardY >= 0 && boardY < ROWS && boardX >= 0 && boardX < COLS) {
          newBoard[boardY][boardX] = pieceIndex + 1;
        }
      }
    }
  }
  return newBoard;
};

export const clearLines = (board) => {
  let linesCleared = 0;
  const newBoard = board.filter(row => {
    const isFull = row.every(cell => cell !== 0);
    if (isFull) linesCleared++;
    return !isFull;
  });
  const emptyRows = Array.from({ length: linesCleared }, () => Array(COLS).fill(0));
  return {
    board: [...emptyRows, ...newBoard],
    lines: linesCleared,
  };
};