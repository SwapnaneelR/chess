import express from "express";
import {WebSocketServer} from "ws";
import GameManager from "./GameManager.js"
import cors from "cors"
import loginController from "./controllers/login.controller.js";
import registerController from "./controllers/register.controller.js";
import logoutController from "./controllers/logout.controller.js";
import connectDB from "./db/db.connection.js";
import cookieParser from "cookie-parser";
import middleware from "./middlewares/auth.middleware.js";
import profileController from "./controllers/profile.controller.js";
import dotenv from 'dotenv';
dotenv.config();

const FE_URL = process.env.FE_URL || "http://localhost:5173"
const app = express();
app.use(express.json())
    app.use(cors({
        origin : FE_URL,
        credentials : true
    }))
app.use(cookieParser())
// http routes
app.post("/api/login",loginController)
app.post("/api/register",registerController)
app.post('/api/logout', logoutController)
app.get("/api/me",middleware,profileController)
app.get("/api/play" , middleware , (req,res)=>{
    res.status(200).json({
        message : "User logged in ! Connect to WS"
    })
})

// http server instance
const PORT = process.env.PORT || 8080;

const httpServer = app.listen(PORT,async ()=>{
    await connectDB()
    console.log(`Listening on http://localhost:${PORT}`)
});

// websocket server 
const wss = new WebSocketServer({server: httpServer});

const gameManagerObject = new GameManager();

wss.on("connection", function connection(socket){
    gameManagerObject.addPlayer(socket);
    socket.on("disconnect", function disconnect(){  
        gameManagerObject.removePlayer(socket);
    });
})
