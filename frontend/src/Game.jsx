import React, { useEffect, useState } from 'react';
import Ninja from './Ninja';
import Pawn from './Pawn';
import Pipes from './Pipes';
import Score from './Score';
import Leaderboard from './Leaderboard';
import { backend } from 'declarations/backend';
import backgroundImage from '../background.jpg';
import '../index.css';

class SeededRNG {
  state0;
  state1;

  constructor(seed) {
    const view = new DataView(seed.buffer);
    this.state0 = view.getUint32(0, true);
    this.state1 = view.getUint32(4, true);
  }

  next() {
    let s1 = this.state0;
    const s0 = this.state1;
    this.state0 = s0;
    s1 ^= s1 << 23;
    s1 ^= s1 >> 17;
    s1 ^= s0;
    s1 ^= s0 >> 26;
    this.state1 = s1;
    return (s0 + s1) / 4294967296; // This already returns a number between 0 and 1
  }
}

const Game = () => {
  const gravity = 1;
  const jumpHeight = -10;
  const ninjaStartY = 200;
  const pipeStartX = 400;
  const gapHeight = 200;

  const [rng, setRng] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);

  const initialBoard = [
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
  ];

  const [board, setBoard] = useState(initialBoard);
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [Row, setRow] = useState(7);
  const [Col, setCol] = useState(3);
  const [validMoves, setValidMoves] = useState([]);

  const calculateValidMoves = (piece, row, col) => {
    const moves = [];

    // Handle Knight (N) movement
    if (piece === 'Knight') {
      moves.push([row + 2, col + 1]);
      moves.push([row + 2, col - 1]);
      moves.push([row - 2, col + 1]);
      moves.push([row - 2, col - 1]);
      moves.push([row + 1, col + 2]);
      moves.push([row + 1, col - 2]);
      moves.push([row - 1, col + 2]);
      moves.push([row - 1, col - 2]);
    }

    // Handle King (K) movement
    if (piece === 'King') {
      moves.push([row + 1, col]);
      moves.push([row - 1, col]);
      moves.push([row, col + 1]);
      moves.push([row, col - 1]);
      moves.push([row + 1, col + 1]);
      moves.push([row + 1, col - 1]);
      moves.push([row - 1, col + 1]);
      moves.push([row - 1, col - 1]);
    }

    // Handle Queen (Q) movement
    if (piece === 'Queen') {
      // Queen moves like both a Rook and Bishop
      // Rook-like moves (horizontal and vertical)
      for (let i = 1; i < 8; i++) {
        moves.push([row + i, col]); // down
        moves.push([row - i, col]); // up
        moves.push([row, col + i]); // right
        moves.push([row, col - i]); // left
      }
      // Bishop-like moves (diagonal)
      for (let i = 1; i < 8; i++) {
        moves.push([row + i, col + i]); // down-right
        moves.push([row + i, col - i]); // down-left
        moves.push([row - i, col + i]); // up-right
        moves.push([row - i, col - i]); // up-left
      }
    }

    // Handle Bishop (B) movement
    if (piece === 'Bishop') {
      // Bishop moves diagonally
      for (let i = 1; i < 8; i++) {
        moves.push([row + i, col + i]); // down-right
        moves.push([row + i, col - i]); // down-left
        moves.push([row - i, col + i]); // up-right
        moves.push([row - i, col - i]); // up-left
      }
    }

    // Handle Rook (R) movement
    if (piece === 'Rook') {
      // Rook moves horizontally and vertically
      for (let i = 1; i < 8; i++) {
        moves.push([row + i, col]); // down
        moves.push([row - i, col]); // up
        moves.push([row, col + i]); // right
        moves.push([row, col - i]); // left
      }
    }

    // Handle Pawn (P) movement
    if (piece === 'Pawn') {
      // Normal one-square forward move
      moves.push([row + 1, col]);  // Move down
      if (row === 1) {  // Pawn's initial position can move two squares forward
        moves.push([row + 2, col]);  // Move down 2
      }
      // Diagonal capture moves (capture opponent's pieces)
      moves.push([row + 1, col + 1]);  // Capture down-right
      moves.push([row + 1, col - 1]);  // Capture down-left
    }

    // Filter out moves that go out of bounds (row or col must be between 0 and 7)
    console.log("move", moves);
    return moves.filter(([r, c]) => r >= 0 && r < 8 && c >= 0 && c < 8);
  };


  useEffect(() => {
    setValidBoard();
  }, [validMoves])

  const setValidBoard = () => {
    const newBoard = board.map(row => [...row]);
    console.log('before board', newBoard)
    console.log('validMoves', validMoves)
    let validBoard = newBoard.map((row, rowIndex) => {
      console.log('row', row);
      return row?.map((cell, colIndex) => {
        console.log('cell', cell);
        console.log('row and col', rowIndex, colIndex);

        const isValidMove = validMoves.find(move => move[0] === rowIndex && move[1] === colIndex);
        console.log('check', isValidMove, 'on', cell);  // Will log the matching coordinates or undefined


        if (isValidMove && cell == 'Enemy') {
          console.log('tobekill')
          return "Kill";
        } else if (isValidMove) {
          console.log('gotovalid')
          return "Valid"
        }else if (cell == 'Kill'){
          console.log('tobeEnemy')
          return "Enemy";
        }else if (cell == 'King' || cell == "Enemy") {
          console.log('gototheSame')
          return cell;
        } else {
          console.log('gototheNull')
          return null;
        }
      });
    });
    console.log('validBoard', validBoard)
    console.log('newBoard', newBoard)
    setBoard(validBoard);
  }

  // เมื่อคลิกตัวหมาก
  const handlePieceClick = (piece, row, col) => {
    console.log(piece, row, col)
    if (selectedPiece && selectedPiece.row === row && selectedPiece.col === col) {
      console.log("undo")
      setSelectedPiece(null);
      setValidMoves([]);
    } else {
      setSelectedPiece({ piece, row, col });
      let validMove = calculateValidMoves(piece, row, col)
      console.log("preMove", validMove)
      setValidMoves(validMove);
    }
  };



  // ย้ายตัวหมากไปยังตำแหน่งใหม่
  const movePiece = (toRow, toCol) => {
    console.log("to be moveto", toRow, toCol);
    if (selectedPiece) {
      console.log('moveTo', toRow, toCol)
      let newBoard = board.map(row => [...row]);
      newBoard[selectedPiece.row][selectedPiece.col] = null;
      console.log("new move",newBoard[toRow][toCol]);
      if(newBoard[toRow][toCol] == 'Kill'){
        console.log('kill ninja')
        newBoard = placeRandomEnemy(newBoard)
      }
      newBoard[toRow][toCol] = selectedPiece.piece;
      setRow(toRow);
      setCol(toCol);
      setBoard(newBoard);
      setSelectedPiece(null);
      setValidMoves([]);
    }
  };

  useEffect(() => {
    initialGame()
  }, [])

  const initialGame = () => {
    const newBoard = board.map(row => [...row]);
    newBoard[Row][Col] = "King";
    const finishBoard = placeRandomEnemy(newBoard)
    console.log('finishBoard', finishBoard)
    setBoard(finishBoard);
  }

  const placeRandomEnemy = (newBoard) => {

    const randomRow = Math.floor(Math.random() * board.length); // Random row
    console.log('random row pass')
    const randomCol = Math.floor(Math.random() * board[0].length); // Random column
    console.log('random col pass')
    
    while (newBoard[randomRow][randomCol] !== null) { // If cell is not empty, retry
      randomRow = Math.floor(Math.random() * board.length);
      randomCol = Math.floor(Math.random() * board[0].length);
    }
    console.log('set pass')

    console.log('random enemy on:' ,[randomRow, randomCol]);

    newBoard[randomRow][randomCol] = "Enemy"; // Place the enemy
    return newBoard
  };

  const [gameState, setGameState] = useState('playing');
  const [score, setScore] = useState(0);

  const Cell = (row, rowIndex) => {
    return row.map((piece, colIndex) => {
      // console.log("piece no", [rowIndex, colIndex], piece);
      switch (piece) {
        case 'King':
          return <td key={rowIndex + "_" + colIndex}  >
            <Ninja onClickHandle={() => handlePieceClick(piece, rowIndex, colIndex)} />
          </td>
        case 'Valid':
          console.log('go case V')
          return <td key={rowIndex + "_" + colIndex} className={`validCell`} onClick={() => movePiece(rowIndex, colIndex)}>
          </td>
        case 'Enemy': return <td key={rowIndex + "_" + colIndex}>
          <Pawn />
        </td>
        case 'Kill': return <td key={rowIndex + "_" + colIndex} className='toBeKill' onClick={() => movePiece(rowIndex, colIndex)}>
          <Pawn />
        </td>
        default:
          return <td key={rowIndex + "_" + colIndex}>
          </td>
      }
    })

  }


  return (
    <div style={{ position: 'relative', minHeight: '100dvh', height: '100%', width: '100%' }}>
      {gameState === 'playing' && (
        <>
          <div>
            <h1>Moodeng</h1>
            <table>
              {board.map((row, rowIndex) => (
                <tr key={rowIndex} className={`row${rowIndex + 1}`}>
                  {
                    Cell(row, rowIndex)
                  }
                </tr>
              ))}
            </table>


          </div>

          <div style={{ position: 'absolute', top: 0, right: '50px' }}>
            <Score score={score} color={'white'} />
          </div>
        </>
      )}

      {gameState !== 'playing' && (
        <div style={{ position: 'absolute', top: 0, right: '150px' }}>
          <Score score={score} color={'black'} />
        </div>
      )}
    </div>
  );
}


export default Game;
