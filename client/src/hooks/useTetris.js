import { useState, useEffect, useCallback, useRef } from 'react';
import {
  COLS, ROWS, PIECES,
  createEmptyBoard, collide, merge, clearLines
} from '../utils/tetris';

const DIFFICULTY_SPEEDS = {
  easy: 600,
  medium: 400,
  hard: 200,
};

const useTetris = () => {
  const [board, setBoard] = useState(createEmptyBoard());
  const [piece, setPiece] = useState(null);
  const [piecePos, setPiecePos] = useState({ x: 3, y: 0 });
  const [pieceIndex, setPieceIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [lines, setLines] = useState(0);
  const [level, setLevel] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [difficulty, setDifficulty] = useState('medium');

  const requestRef = useRef();
  const lastTimeRef = useRef(0);
  const speedRef = useRef(DIFFICULTY_SPEEDS.medium);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  useEffect(() => {
    if (!isPlaying || gameOver) return;
    const baseSpeed = DIFFICULTY_SPEEDS[difficulty];
    speedRef.current = Math.max(80, baseSpeed - (level - 1) * 40);
  }, [difficulty, level, isPlaying, gameOver]);

  const spawnNewPiece = useCallback(() => {
    if (!isMounted.current) return false;
    const idx = Math.floor(Math.random() * PIECES.length);
    const newPiece = PIECES[idx];
    const spawnPos = { x: Math.floor((COLS - newPiece[0].length) / 2), y: 0 };

    if (collide(board, newPiece, spawnPos)) {
      setGameOver(true);
      setIsPlaying(false);
      return false;
    }

    setPiece(newPiece);
    setPiecePos(spawnPos);
    setPieceIndex(idx);
    return true;
  }, [board]);

  const lockPiece = useCallback(() => {
    if (!piece || !isMounted.current) return;

    const newBoard = merge(board, piece, piecePos, pieceIndex);
    const { board: clearedBoard, lines: linesCleared } = clearLines(newBoard);
    setBoard(clearedBoard);

    const newLines = lines + linesCleared;
    setLines(newLines);
    let points = 0;
    if (linesCleared === 1) points = 100;
    else if (linesCleared === 2) points = 300;
    else if (linesCleared === 3) points = 500;
    else if (linesCleared === 4) points = 800;
    setScore(prev => prev + points);

    const newLevel = Math.floor(newLines / 10) + 1;
    if (newLevel > level) setLevel(newLevel);

    spawnNewPiece();
  }, [board, piece, piecePos, pieceIndex, lines, level, spawnNewPiece]);

  const movePiece = useCallback((dx, dy) => {
    if (!piece || gameOver || !isMounted.current || !isPlaying) return false;

    const newPos = { x: piecePos.x + dx, y: piecePos.y + dy };
    if (!collide(board, piece, newPos)) {
      setPiecePos(newPos);
      return true;
    }

    if (dy === 1) lockPiece();
    return false;
  }, [board, piece, piecePos, gameOver, isPlaying, lockPiece]);

  const rotatePiece = useCallback(() => {
    if (!piece || gameOver || !isMounted.current || !isPlaying) return;

    const rotated = piece[0].map((_, idx) => piece.map(row => row[idx]).reverse());
    if (!collide(board, rotated, piecePos)) setPiece(rotated);
  }, [board, piece, piecePos, gameOver, isPlaying]);

  const hardDrop = useCallback(() => {
    if (!piece || gameOver || !isPlaying || !isMounted.current) return;

    let newY = piecePos.y;
    while (!collide(board, piece, { x: piecePos.x, y: newY + 1 })) {
      newY++;
    }
    if (newY !== piecePos.y) {
      setPiecePos(prev => ({ ...prev, y: newY }));
      setTimeout(() => {
        if (isMounted.current) lockPiece();
      }, 0);
    } else {
      lockPiece();
    }
  }, [board, piece, piecePos, gameOver, isPlaying, lockPiece]);

  const resetGame = useCallback(() => {
    if (!isMounted.current) return;
    setBoard(createEmptyBoard());
    setPiece(null);
    setScore(0);
    setLines(0);
    setLevel(1);
    setGameOver(false);
    setIsPlaying(false);
  }, []);

  const startGame = useCallback(() => {
    if (!isMounted.current) return;
    resetGame();
    setTimeout(() => {
      if (isMounted.current) {
        setIsPlaying(true);
        spawnNewPiece();
      }
    }, 0);
  }, [resetGame, spawnNewPiece]);

  useEffect(() => {
    if (!isPlaying || gameOver) return;

    const gameLoop = (time) => {
      if (!isMounted.current) {
        cancelAnimationFrame(requestRef.current);
        return;
      }
      if (lastTimeRef.current === 0) {
        lastTimeRef.current = time;
        requestRef.current = requestAnimationFrame(gameLoop);
        return;
      }
      const delta = time - lastTimeRef.current;
      if (delta > speedRef.current) {
        movePiece(0, 1);
        lastTimeRef.current = time;
      }
      requestRef.current = requestAnimationFrame(gameLoop);
    };

    requestRef.current = requestAnimationFrame(gameLoop);
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
        requestRef.current = null;
      }
    };
  }, [isPlaying, gameOver, movePiece]);

  useEffect(() => {
    const handleKey = (e) => {
      if (!isPlaying || gameOver) return;
      e.preventDefault();
      switch (e.key) {
        case 'ArrowLeft': movePiece(-1, 0); break;
        case 'ArrowRight': movePiece(1, 0); break;
        case 'ArrowDown': movePiece(0, 1); break;
        case 'ArrowUp': rotatePiece(); break;
        case ' ': hardDrop(); break;
        default: break;
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isPlaying, gameOver, movePiece, rotatePiece, hardDrop]);

  return {
    board,
    piece,
    piecePos,
    pieceIndex,
    score,
    lines,
    level,
    gameOver,
    isPlaying,
    startGame,
    resetGame,
    difficulty,
    setDifficulty,
    movePiece,
    rotatePiece,
    hardDrop,
  };
};

export default useTetris;