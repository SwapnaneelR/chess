// GameManager.js
import messages from "./message.js";
import Game from "./Game.js";

class GameManager {
    Games ;
    pendingPlayers = null;
    constructor() {
        this.Games = [] 
    }
    addPlayer(socket){
        console.log("Player connected");
        this.handleMessage(socket)
    }
    removePlayer(socket){
        this.Games.map((game,index) => {
            if(game.player1 === socket || game.player2 === socket){
                this.Games.splice(index,1);
            }
        })
    }
    handleMessage(socket){
        socket.on("message",(data) => {
            console.log("Received message: %s",data);
            const message = JSON.parse(data);
            // init game event
            // if there is a pending player, create a new game with pending player and this player(socket)
            //  else make this player(socket) as pending player
            if(message.type === messages.INIT_GAME){
                if(this.pendingPlayers !== null){
                    const newGame = new Game (this.pendingPlayers,socket);
                    this.Games.push(newGame);
                    this.pendingPlayers = null;
                } else {
                    this.pendingPlayers = socket;
                }
            }
            // move event 
            // search for the game object in which this player(socket) is playing
            // call the makeMove function of that game object
            if (message.type === messages.MOVE) {
                const gameObject = this.Games.find(game => game.player1 === socket || game.player2 === socket);
                if (gameObject) {
                    gameObject.makeMove(socket, message.payload.move);
                }
            }
        })
    }
}
export default GameManager;