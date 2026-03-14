import React, { useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import useTetris from '../hooks/useTetris';
import api from '../services/api';
import { COLORS, COLS, ROWS } from '../utils/tetris';

const Game = () => {
  const canvasRef = useRef(null);
  const { user } = useAuth();
  const {
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
  } = useTetris();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const blockSize = canvas.width / COLS;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let y = 0; y < ROWS; y++) {
      for (let x = 0; x < COLS; x++) {
        const cell = board[y][x];
        if (cell !== 0) {
          ctx.fillStyle = COLORS[cell - 1] || '#ccc';
          ctx.fillRect(x * blockSize, y * blockSize, blockSize - 1, blockSize - 1);
        } else {
          ctx.fillStyle = '#111';
          ctx.fillRect(x * blockSize, y * blockSize, blockSize - 1, blockSize - 1);
        }
      }
    }

    if (piece) {
      for (let y = 0; y < piece.length; y++) {
        for (let x = 0; x < piece[0].length; x++) {
          if (piece[y][x] !== 0) {
            const boardX = (piecePos.x + x) * blockSize;
            const boardY = (piecePos.y + y) * blockSize;
            ctx.fillStyle = COLORS[pieceIndex] || '#fff';
            ctx.fillRect(boardX, boardY, blockSize - 1, blockSize - 1);
          }
        }
      }
    }
  }, [board, piece, piecePos, pieceIndex]);

  useEffect(() => {
    if (gameOver && user && score > 0) {
      const saveScore = async () => {
        try {
          await api.post('/scores', { score, lines, level });
        } catch (err) {
          console.error('Не удалось сохранить результат', err);
        }
      };
      saveScore();
    }
  }, [gameOver, user, score, lines, level]);

  return (
    <div className="page-container game-container">
      <div className="game-canvas-wrapper">
        <canvas ref={canvasRef} width={300} height={600} />
      </div>
      <div className="game-panel">
        <div>🎯 Счёт: {score}</div>
        <div>📊 Линии: {lines}</div>
        <div>📈 Уровень: {level}</div>

        <div className="difficulty-selector">
          <label>Сложность:</label>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            disabled={isPlaying}
          >
            <option value="easy">Лёгкая</option>
            <option value="medium">Средняя</option>
            <option value="hard">Сложная</option>
          </select>
        </div>

        {!isPlaying && (
          <button onClick={startGame} className="start-btn">СТАРТ</button>
        )}

        {gameOver && (
          <div className="game-over-message">
             Игра окончена!
          </div>
        )}

       
        <div className="game-controls">
          <button onClick={resetGame} className="control-btn"> Сброс</button>
          <button onClick={rotatePiece} disabled={!isPlaying} className="control-btn">↻ Поворот</button>
        </div>

      
        <div className="mobile-arrows">
          <button onClick={() => movePiece(-1, 0)} disabled={!isPlaying}>←</button>
          <button onClick={() => movePiece(1, 0)} disabled={!isPlaying}>→</button>
          <button onClick={() => movePiece(0, 1)} disabled={!isPlaying}>↓</button>
        </div>
      </div>
    </div>
  );
};

export default Game;