import UserDB from "./db/user.model.js";
import message from "./message.js";
import {Chess } from 'chess.js'; 

class Game {
    player1;
    player2;
    chess;
    players = ["player1","player2"];
    async findusername(id){
        const user = await UserDB.findOne({_id : id});
        if (!user) {
            console.warn(`User not found for id ${id}`);
            return `Unknown-${id}`;
        }
        console.log(user.username);
        return user.username;
    }
    constructor(socket1, id1, socket2, id2) {
    this.player1 = socket1;
    this.player2 = socket2;
    this.chess = new Chess();
    this.players = [];

    console.log("New game created");

    // Fetch usernames properly
    Promise.all([this.findusername(id1), this.findusername(id2)])
        .then(([username1, username2]) => {
            this.players.push(username1, username2);

            // Send INIT_GAME messages
            const initGameMessage1 = {
                type: message.INIT_GAME,
                color: 'white',
                players: this.players
            };
            const initGameMessage2 = {
                type: message.INIT_GAME,
                color: 'black',
                players: this.players
            };

            this.player1.send(JSON.stringify(initGameMessage1));
            this.player2.send(JSON.stringify(initGameMessage2));
        })
        .catch(err => console.error("Error fetching usernames:", err));
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