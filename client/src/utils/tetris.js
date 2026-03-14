// Размеры игрового поля
export const COLS = 10;
export const ROWS = 20;

// Фигуры тетриса (классические)
export const PIECES = [
  // I
  [[1,1,1,1]],
  // O
  [[1,1],
   [1,1]],
  // T
  [[0,1,0],
   [1,1,1]],
  // S
  [[0,1,1],
   [1,1,0]],
  // Z
  [[1,1,0],
   [0,1,1]],
  // L
  [[1,0,0],
   [1,1,1]],
  // J
  [[0,0,1],
   [1,1,1]],
];

// Цвета для фигур (индекс + 1 соответствует фигуре)
export const COLORS = [
  '#00f0f0', // I - cyan
  '#f0f000', // O - yellow
  '#a000f0', // T - purple
  '#00f000', // S - green
  '#f00000', // Z - red
  '#f0a000', // L - orange
  '#0000f0', // J - blue
];

// Создание пустой доски
export const createEmptyBoard = () =>
  Array.from({ length: ROWS }, () => Array(COLS).fill(0));

// Проверка столкновения фигуры с доской или границами
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

// Слияние фигуры с доской (фигура закрепляется)
export const merge = (board, piece, offset, pieceIndex) => {
  const newBoard = board.map(row => [...row]);
  for (let y = 0; y < piece.length; y++) {
    for (let x = 0; x < piece[0].length; x++) {
      if (piece[y][x] !== 0) {
        const boardY = offset.y + y;
        const boardX = offset.x + x;
        if (boardY >= 0 && boardY < ROWS && boardX >= 0 && boardX < COLS) {
          newBoard[boardY][boardX] = pieceIndex + 1; // сохраняем индекс цвета
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