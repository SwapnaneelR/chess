import React, { useState, useEffect } from "react";
import useSocket from "../hooks/useSocket.jsx";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import useAuth from "../hooks/useAuth.jsx";
import toast from "react-hot-toast";
import HomeButton from "../components/HomeButton.jsx";

const messages = {
  INIT_GAME: "init_game",
  MOVE: "move",
  GAME_OVER: "game_over",
};

const Game = () => {
  const [chess, setChess] = useState(new Chess());
  const [playerColor, setPlayerColor] = useState(null);
  const [startGame, setStartGame] = useState(false);
  const [players, setPlayers] = useState([]);
  const [result, setResult] = useState(null);
  const socket = useSocket();
  const { user } = useAuth();
  const [movesTable, setMovesTable] = useState([]);

  const onPieceDrop = ({ sourceSquare, targetSquare }) => {
    return handleMove(sourceSquare, targetSquare);
  };

  const handleMove = (sourceSquare, targetSquare) => {
    const currentTurn = chess.turn();

    if (
      playerColor &&
      ((currentTurn === "w" && playerColor !== "white") ||
        (currentTurn === "b" && playerColor !== "black"))
    ) {
      toast.error("⏳ Not your turn!");
      return false;
    }

    const gameCopy = new Chess(chess.fen());
    const move = {
      from: sourceSquare,
      to: targetSquare,
      promotion: "q", // always promote to queen
    };

    try {
      const result = gameCopy.move(move);
      if (result) {
        setMovesTable((prev) => [...prev, move]);
        setChess(gameCopy);

        if (socket && socket.readyState === WebSocket.OPEN) {
          socket.send(
            JSON.stringify({ type: messages.MOVE, payload: { move } })
          );
        }
        return true;
      }
      return false;
    } catch (error) {
      console.error("Move error:", error);
      return false;
    }
  };

  // Listen for messages from server
  useEffect(() => {
    if (!socket) return;

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);

      switch (message.type) {
        case messages.INIT_GAME:
          setChess(new Chess());
          setPlayerColor(message.color);
          setPlayers(message.players);
          break;

        case messages.MOVE: {
          const move = message.payload.move;
          setChess((prev) => {
            const gameCopy = new Chess(prev.fen());
            gameCopy.move(move);
            return gameCopy;
          });
          setMovesTable((prev) => [...prev, move]);
          break;
        }

        case messages.GAME_OVER:
          setResult(message.payload.winner);
          break;

        default:
          break;
      }
    };
  }, [socket, chess]);

  return (
    <div className="flex flex-row items-center h-screen w-full bg-gradient-to-br from-zinc-950 via-zinc-900 to-black justify-evenly p-6">
      <HomeButton />
      {/* left Side - Moves */}
      <div className="bg-zinc-900/60 border border-blue-500/50 rounded-md shadow-lg px-6 py-4 max-h-120 overflow-y-auto backdrop-blur-md">
        {movesTable.length > 0 ? (
          <ol className="space-y-2">
            {movesTable.map((move, index) => (
              <li
                key={index}
                className={`flex items-center justify-between px-3 py-1 rounded-md text-sm
                ${index % 2 === 0 ? "bg-white/10" : "bg-blue-500/10"}`}
              >
                <span className="font-medium">
                  {index % 2 === 0 ? "⚪ White " : "⚫ Black"}
                </span>
                <span className="text-gray-300">
                  {move.from} → {move.to}
                </span>
              </li>
            ))}
          </ol>
        ) : (
          <div className="text-gray-400 italic">No moves made yet.</div>
        )}
      </div>

      {/* top  - Players */}
      <div className="flex flex-row gap-6 absolute top-6 left-1/2 transform -translate-x-1/2">
        {players?.length > 0 ? (
          <div className="bg-zinc-900/60 border border-zinc-700/50 backdrop-blur-md px-6 py-4 rounded-md shadow-md flex items-center gap-6">
            {/* White Player */}
            {players[0] && (
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-white"></div>
                <span className="text-lg font-medium text-white">
                  {players[0]}
                </span>
                <span className="text-gray-400 text-sm">(White)</span>
              </div>
            )}

            {/* VS Divider */}
            <div className="text-center text-sm font-semibold tracking-widest text-gray-400">
              VS
            </div>

            {/* Black Player */}
            {players[1] && (
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-black border border-white/20"></div>
                <span className="text-lg font-medium text-white">
                  {players[1]}
                </span>
                <span className="text-gray-400 text-sm">(Black)</span>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-zinc-900/50 backdrop-blur-md px-6  mt-8 py-4 rounded-md shadow-md text-gray-400 italic">
            Waiting for another player to join...
          </div>
        )}
      </div>

      {/* Middle - Chessboard */}
      <div className="flex justify-center items-center bg-zinc-900/40 rounded-sm p-4 shadow-xl backdrop-blur-lg">
        <Chessboard
          options={{
            position: chess.fen(),
            onPieceDrop,
            boardOrientation: playerColor || "white",
            boardStyle: { border: "3px solid white", width: "500px" },
          }}
        />
      </div>

      {/* Right Side - Controls */}
      <div className="flex flex-col gap-6 items-center text-white">
        {playerColor === null ? (
          <button
            className="px-10 py-8 text-2xl font-medium cursor-pointer   border border-3 border-emerald-900 rounded-sm shadow-md transform hover:scale-105 hover: transition duration-300 ease-in-out"
            onClick={() => {
              if (!startGame) {
                socket.send(
                  JSON.stringify({
                    type: messages.INIT_GAME,
                    payload: { username: user.username },
                  })
                );
                setStartGame(true);
              }
            }}
          >
            START GAME 🚀
          </button>
        ) : result ? (
          <div className="px-8 py-4 text-xl font-bold bg-zinc-900/70 border border-blue-500 rounded-sm shadow-md backdrop-blur-md">
            {result === "draw" ? "🤝 It's a Draw!" : `🎉 ${result} wins!`}
          </div>
        ) : (
          <div className="px-8 py-4 text-lg italic bg-zinc-800/70 rounded-sm shadow-md">
            Turn: {chess.turn() === "b" ? "Black" : "White"}
          </div>
        )}

        <div className="px-8 py-4 text-lg bg-zinc-900/70 border border-zinc-600 rounded-sm shadow-md backdrop-blur-md">
          Your Color:{" "}
          <span className="font-semibold capitalize">
            {playerColor || "Not assigned yet"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Game;
