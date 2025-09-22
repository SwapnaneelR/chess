import express from "express";
import {WebSocketServer} from "ws";
import GameManager from "./GameManager.js"
import cors from "cors"
const app = express();
app.use(express.json())
app.use(cors())
app.post("/api/login",function(req,res){
    const {username,password} = req.body;
    console.log(username)
    console.log(password)
    res.status(200).send("success")
})

const httpServer = app.listen(8080,()=>console.log("Listening on http://localhost:8080"));

const wss = new WebSocketServer({server: httpServer});

const gameManagerObject = new GameManager();

wss.on("connection", function connection(socket){
    gameManagerObject.addPlayer(socket);
    socket.on("disconnect", function disconnect(){  
        gameManagerObject.removePlayer(socket);
    });
})
