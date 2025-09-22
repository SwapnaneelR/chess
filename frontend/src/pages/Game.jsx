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
  const [playerColor, setPlayerColor] = useState(null);
  const socket = useSocket();

  const onPieceDrop = ({ piece, sourceSquare, targetSquare }) => {
    console.log("=== MOVE ATTEMPT (options onPieceDrop) ===", {
      piece,
      sourceSquare,
      targetSquare,
    });
    return handleMove(sourceSquare, targetSquare, piece);
  };

  const handleMove = (sourceSquare, targetSquare, piece = null) => {
    // Check if it's the player's turn
    console.log(piece);
    const currentTurn = chess.turn();
    console.log("Current turn:", currentTurn === "w" ? "white" : "black");

    if (
      playerColor &&
      ((currentTurn === "w" && playerColor !== "white") ||
        (currentTurn === "b" && playerColor !== "black"))
    ) {
      console.log("Not your turn!");
      return false;
    }

    const gameCopy = new Chess(chess.fen());
    const move = {
      from: sourceSquare,
      to: targetSquare,
      promotion: "q", // promote to queen always
    };

    try {
      const result = gameCopy.move(move);
      console.log("Move result:", result);

      if (result) {
        console.log("✅ Valid move, updating state");
        setChess(gameCopy);

        // Send move to server
        if (socket && socket.readyState === WebSocket.OPEN) {
          const message = {
            type: messages.MOVE,
            payload: { move },
          };
          console.log("Sending to server:", message);
          socket.send(JSON.stringify(message));
        } else {
          console.log("Socket not ready");
        }

        return true;
      } else {
        console.log("Invalid move");
        return false;
      }
    } catch (error) {
      console.log("Move error:", error);
      return false;
    }
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
          // Apply opponent move
          setChess((prev) => {
            const gameCopy = new Chess(prev.fen());
            gameCopy.move(move);
            return gameCopy;
          });
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
    <div className="flex flex-row items-center h-screen bg-black/50 justify-evenly gap-4">
      <div className="max-w-100 ">
        <Chessboard
          options={{
            position: chess.fen(),
            onPieceDrop,
            boardOrientation: playerColor || "white",
            boardStyle: {
              borderRadius: "12px",
              boxShadow: "0 4px 15px rgba(0,0,0,0.5)",
              width: "500px",
            },
          }}
        />
      </div>
      <div className="flex flex-col gap-4 items-center justify-center">
        {playerColor === null ? (
          <button
            className="px-10 py-5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-sm shadow-lg cursor-pointer transition-transform transform hover:scale-105"
            onClick={() =>
              socket.send(JSON.stringify({ type: messages.INIT_GAME }))
            }
          >
            Start Game
          </button>
        ) : (
          <div className="px-10 py-5 bg-zinc-700 hover:bg-zinc-800 text-white rounded-sm shadow-lg   transition-transform transform hover:scale-105">
             {chess.turn() == 'b' ? 'black' : 'white'}'s Turn
          </div>
        )}
        <div className="px-10 py-5 bg-zinc-700 hover:bg-zinc-800 text-white rounded-sm shadow-lg   transition-transform transform hover:scale-105">Your color : {playerColor ? playerColor : "Not assigned yet"}</div>
      </div>
    </div>
  );
};

export default Game;
