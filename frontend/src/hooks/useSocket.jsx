import { useEffect, useState } from "react";
import axios from "axios";
import {toast} from "react-hot-toast"
const BE_HTTP = import.meta.env.VITE_BE_HTTP || "http://localhost:8080";
const BE_WS = import.meta.env.VITE_BE_WS || "ws://localhost:8080"; 
const useSocket = () => {
  const [socket, setSocket] = useState(null);

  useEffect(() => { 
    const initSocket = async () => {
      try {
        // hit /api/play to check if the user is allowed
        await axios.get(`${BE_HTTP}/api/play`, { withCredentials: true });

        // If allowed, connect WebSocket
        const ws = new WebSocket(BE_WS); 
        ws.onopen = () => setSocket(ws);
        ws.onerror = (error) => console.log("WebSocket error:", error);
        ws.onclose = () => setSocket(null);

      } catch (err) {
        toast.error(err.response.data.message)
      }
    };

    initSocket();

    return () => {
      socket?.close();
    };
  }, []);

  return socket;
};

export default useSocket;
