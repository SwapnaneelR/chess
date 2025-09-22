import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen bg-cover bg-center relative overflow-auto"
      style={{ backgroundImage: "url('landing.jpg')" }}
    >
      <div className="absolute inset-0 bg-black/50" />

      <div className="relative z-10 flex pt-38 justify-center min-h-screen px-4">
        <div className="flex flex-col items-center text-center max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-bold text-white/80 drop-shadow-lg">
            Chess Multiplayer Game
          </h1>

          <p className="mt-4 text-lg md:text-xl text-white/50 leading-relaxed">
            Play real-time chess with random opponents across the globe. Sharpen
            your strategy and become the champion!
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => navigate("/game")}
              className="px-10 py-5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-sm shadow-lg cursor-pointer transition-transform transform hover:scale-105"
            >
              Join Game
            </button>

            <button
              onClick={() => navigate("/login")}
              className="px-10 py-5 bg-zinc-700 hover:bg-zinc-800 text-white rounded-sm shadow-lg cursor-pointer transition-transform transform hover:scale-105"
            >
              {" "}
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
