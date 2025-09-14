import { useEffect, useState } from "react";
const BE_URL = "ws://localhost:8080";
const useSocket = () => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const ws = new WebSocket(BE_URL);
    ws.onopen = () => {
      setSocket(ws);
    };
    ws.onerror = (error) => {
      console.log("WebSocket error:", error);
    };
    ws.onclose = () => {
      setSocket(null);
    };
    return () => {
        ws.close();
    };
  }, []);

  return socket;
};
export default useSocket;
