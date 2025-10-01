import UserDB from "./db/user.model.js";
import message from "./message.js";
import { Chess } from 'chess.js'; 

class Game {
    player1;
    player2;
    chess;
    players = [];

    async findusername(id) {
        try {
            const user = await UserDB.findOne({ _id: id });
            if (!user) {
                console.warn(`User not found for id ${id}`);
                return `Unknown-${id}`;
            }
            console.log(user.username);
            return user.username;
        } catch (error) {
            console.error(`Error finding username for id ${id}:`, error);
            return `Unknown-${id}`;
        }
    }

    // Private constructor - use Game.create() instead
    constructor(socket1, socket2, username1, username2) {
        this.player1 = socket1;
        this.player2 = socket2;
        this.chess = new Chess();
        this.players = [username1, username2];
        console.log("New game created");
    }

    // Factory method to create and initialize a game
    static async create(socket1, id1, socket2, id2) {
        const tempGame = new Game(socket1, socket2, null, null);
        
        try {
            // Fetch usernames
            const [username1, username2] = await Promise.all([
                tempGame.findusername(id1), 
                tempGame.findusername(id2)
            ]);

            // Create the actual game instance with usernames
            const game = new Game(socket1, socket2, username1, username2);

            // Send INIT_GAME messages
            const initGameMessage1 = {
                type: message.INIT_GAME,
                color: 'white',
                players: game.players
            };
            const initGameMessage2 = {
                type: message.INIT_GAME,
                color: 'black',
                players: game.players
            };

            // Check if sockets are still open before sending
            if (socket1.readyState === socket1.OPEN) {
                socket1.send(JSON.stringify(initGameMessage1));
            }
            if (socket2.readyState === socket2.OPEN) {
                socket2.send(JSON.stringify(initGameMessage2));
            }

            return game;
        } catch (err) {
            console.error("Error creating game:", err);
            throw err;
        }
    }

    makeMove(socket, move) {
        try {
            this.chess.move(move);
        } catch (error) {
            console.error("Invalid move:", error);
            return;
        }

        // Check if the game is over
        if (this.chess.isGameOver()) {
            const result = {
                type: message.GAME_OVER,
                payload: {
                    winner: this.chess.turn() === 'w' ? 'black' : 'white'
                }
            };
            
            if (this.player1.readyState === this.player1.OPEN) {
                this.player1.send(JSON.stringify(result));
            }
            if (this.player2.readyState === this.player2.OPEN) {
                this.player2.send(JSON.stringify(result));
            }
            return;
        }

        // Send the move to the opponent
        const moveMessage = {
            type: message.MOVE,
            payload: { move: move }
        };

        if (socket === this.player1) {
            if (this.player2.readyState === this.player2.OPEN) {
                this.player2.send(JSON.stringify(moveMessage));
            }
        } else {
            if (this.player1.readyState === this.player1.OPEN) {
                this.player1.send(JSON.stringify(moveMessage));
            }
        }
    }
}

export default Game;