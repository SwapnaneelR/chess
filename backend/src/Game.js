import message from "./message.js";
import {Chess } from 'chess.js'; 
class Game {
    player1;
    player2;
    chess;
    constructor(socket1,socket2){
        this.player1 = socket1;
        this.player2 = socket2;
        this.chess = new Chess();
        console.log("New game created"); 
        const initGameMessage = {
            type: message.INIT_GAME,
            color: 'white'
        }
        this.player1.send(JSON.stringify(initGameMessage));
        initGameMessage.color = 'black';
        this.player2.send(JSON.stringify(initGameMessage));
    }
    makeMove(socket,move){
        this.chess.move(move)
        // check if the game is over
        if (this.chess.isGameOver()) 
        {
            const result = {
                type: message.GAME_OVER,
                payload: {
                    winner: this.chess.turn() === 'w' ? 'black' : 'white'
                }
            } 
            this.player1.send(JSON.stringify(result));
            this.player2.send(JSON.stringify(result));
            return;
        }
        // sending the move made by player(socket) to the opponent
        if (socket === this.player1){
            this.player2.send(JSON.stringify({
                type: message.MOVE,
                payload: { move: move }
            }))
        }
        else {
            this.player1.send(JSON.stringify({
                type: message.MOVE,
                payload: { move: move }
            }))
        }
    }
}
export default Game;