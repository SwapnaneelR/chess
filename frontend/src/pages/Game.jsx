import React, { useState, useEffect } from "react";
import useSocket from "../hooks/useSocket.jsx";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";

const messages = {
  INIT_GAME: "init_game",
  MOVE: "move",
  GAME_OVER: "game_over",
};

const Game = () => {
  const [chess, setChess] = useState(new Chess());
  const [playerColor, setPlayerColor] = useState();
  const socket = useSocket();

  // handle piece drop
  const onDrop = (sourceSquare, targetSquare) => {
    const gameCopy = new Chess(chess.fen());
    const piece = gameCopy.get(sourceSquare);
 
    if (!piece || piece.color !== playerColor[0]) {
      return false;
    }

    const move = {
      from: sourceSquare,
      to: targetSquare,
      promotion: "q",
    };
    console.log("Attempting move:", move);
     
  };

  // listen for messages from server
  useEffect(() => {
    if (!socket) return;

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);

      switch (message.type) {
        case messages.INIT_GAME:
          console.log("Game initialized", message.color);
          setChess(new Chess());
          setPlayerColor(message.color); 
          break;

        case messages.MOVE: {
          console.log("Move received", message.payload);
          const move = message.payload.move;
          const gameCopy = new Chess(chess.fen());
          gameCopy.move(move);
          setChess(gameCopy);
          break;
        }

        case messages.GAME_OVER:
          console.log("Game over", message.payload);
          break;

        default:
          break;
      }
    };
  }, [socket, chess]);

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="max-w-100 pt-20">
        <Chessboard
          position={chess.fen()}
          onPieceDrop={onDrop}
          boardWidth={500}
          orientation={playerColor} // ✅ board flips if black
          customBoardStyle={{
            borderRadius: "12px",
            boxShadow: "0 4px 15px rgba(0,0,0,0.5)",
          }}
        />
      </div>
      <button
        className="px-10 py-5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-sm shadow-lg cursor-pointer transition-transform transform hover:scale-105"
        onClick={() =>
          socket.send(JSON.stringify({ type: messages.INIT_GAME }))
        }
      >
        Start Game
      </button>
      <div>
        Color : {playerColor ? playerColor : "Not assigned yet"}
      </div>
    </div>
  );
};

export default Game;
