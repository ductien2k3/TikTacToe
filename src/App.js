import React, { useState } from 'react';
import './App.css';

const EMPTY = '';
const PLAYER_X = 'X';
const AI = 'O';

const App = () => {
  const [board, setBoard] = useState(Array(9).fill(EMPTY));
  const [isXNext, setIsXNext] = useState(true);
  const [gameStatus, setGameStatus] = useState('');

  const handleClick = (index) => {
    if (board[index] !== EMPTY || gameStatus) return;

    const newBoard = [...board];
    newBoard[index] = isXNext ? PLAYER_X : AI; // Người chơi luôn là X
    setBoard(newBoard);
    setIsXNext(!isXNext);

    const winner = calculateWinner(newBoard);
    if (winner) {
      setGameStatus(`Winner: ${winner}`);
    } else if (isBoardFull(newBoard)) {
      setGameStatus('Draw!');
    } else {
      setTimeout(() => {
        makeAIMove(newBoard);
      }, 500);
    }
  };

  const makeAIMove = (currentBoard) => {
    const bestMove = minimax(currentBoard, AI);
    currentBoard[bestMove.index] = AI; // AI chơi O
    setBoard(currentBoard);
    setIsXNext(true);

    const winner = calculateWinner(currentBoard);
    if (winner) {
      setGameStatus(`Winner: ${winner}`);
    } else if (isBoardFull(currentBoard)) {
      setGameStatus('Draw!');
    }
  };

  const minimax = (board, player) => {
    const winner = calculateWinner(board);
    if (winner === PLAYER_X) return { score: -1 };
    if (winner === AI) return { score: 1 };
    if (isBoardFull(board)) return { score: 0 };

    const moves = [];
    for (let i = 0; i < board.length; i++) {
      if (board[i] === EMPTY) {
        const newBoard = [...board];
        newBoard[i] = player;
        const result = minimax(newBoard, player === PLAYER_X ? AI : PLAYER_X);
        moves.push({ index: i, score: result.score });
      }
    }

    let bestMove;
    if (player === AI) {
      let bestScore = -Infinity;
      for (const move of moves) {
        if (move.score > bestScore) {
          bestScore = move.score;
          bestMove = move;
        }
      }
    } else {
      let bestScore = Infinity;
      for (const move of moves) {
        if (move.score < bestScore) {
          bestScore = move.score;
          bestMove = move;
        }
      }
    }

    return bestMove;
  };

  const isBoardFull = (board) => {
    return board.every((square) => square !== EMPTY);
  };

  const calculateWinner = (squares) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  };

  const resetGame = () => {
    setBoard(Array(9).fill(EMPTY));
    setIsXNext(true);
    setGameStatus('');
  };

  return (
    <div className="game">
      <div className="status">
        {gameStatus || `Next player: ${isXNext ? PLAYER_X : AI}`}
      </div>
      <div className="info">
        <p>You are <span style={{ color: 'red' }}>X</span> and AI is <span style={{ color: 'blue' }}>O</span></p>
      </div>
      <div className="board">
        {board.map((value, index) => (
          <button
            key={index}
            className="square"
            onClick={() => handleClick(index)}
            style={{ color: value === PLAYER_X ? 'red' : value === AI ? 'blue' : 'black' }}>
            {value}
          </button>
        ))}
      </div>
      <button className="reset" onClick={resetGame}>Reset</button>
    </div>
  );
};

export default App;
