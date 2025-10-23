// components/HomeLoader.jsx
import { useState, useEffect } from "react";

const Loader = () => {
  const text = "CHESS ♟️";
  const [displayedText, setDisplayedText] = useState("");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + text[index]);
        setIndex(index + 1);
      }, 200); // typing speed (ms)
      return () => clearTimeout(timeout);
    }
  }, [index, text]);

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-black">
      <h1 className="text-white text-6xl font-bold tracking-widest">
        {displayedText}
        <span className="border-r-2 border-white animate-pulse ml-1"></span>
      </h1>
    </div>
  );
};

export default Loader;
