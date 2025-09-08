import express from "express";
import {WebSocketServer} from "ws";
import GameManager from "./GameManager.js";

const app = express();

const httpServer = app.listen(8080,()=>console.log("Listening on http://localhost:8080"));

const wss = new WebSocketServer({server: httpServer});

const gameManagerObject = new GameManager();

wss.on("connection", function connection(socket){
    gameManagerObject.addPlayer(socket);
    socket.on("disconnect", function disconnect(){  
        gameManagerObject.removePlayer(socket);
    });
})
