// GameManager.js
import messages from "./message.js";
import Game from "./Game.js";

class GameManager {
  Games;
  pendingPlayers = null;
  pendingPlayerID = null;
  
  constructor() {
    this.Games = [];
  }

  addPlayer(socket) {
    console.log("Player connected");
    this.handleMessage(socket);
  }

  removePlayer(socket) {
    // Use filter instead of map + splice for safer removal
    this.Games = this.Games.filter((game) => {
      return game.player1 !== socket && game.player2 !== socket;
    });
    
    // Also clear pending player if they disconnect
    if (this.pendingPlayers === socket) {
      this.pendingPlayers = null;
      this.pendingPlayerID = null;
    }
  }

  handleMessage(socket) {
    socket.on("message", async (data) => {
      try {
        console.log("Received message: %s", data);
        const message = JSON.parse(data);
        const payload = message.payload;
        const ID = payload.id;

        // INIT_GAME event
        // If there is a pending player, create a new game with pending player and this player(socket)
        // Else make this player(socket) as pending player
        if (message.type === messages.INIT_GAME) {
          if (this.pendingPlayers !== null) {
            try {
              // Use the async Game.create() factory method
              const newGame = await Game.create(
                this.pendingPlayers,
                this.pendingPlayerID,
                socket,
                ID
              );
              // push to the Game [] and check number of ongoing games
              this.Games.push(newGame);
              console.log(`Game created. Total games: ${this.Games.length}`);
              
              // Clear pending player after successful game creation
              this.pendingPlayers = null;
              this.pendingPlayerID = null;
            } catch (error) {
              console.error("Failed to create game:", error);
              
              // Send error message to both players
              const errorMessage = JSON.stringify({
                type: messages.ERROR,
                payload: { message: "Failed to initialize game" }
              });
              
              if (this.pendingPlayers.readyState === this.pendingPlayers.OPEN) {
                this.pendingPlayers.send(errorMessage);
              }
              if (socket.readyState === socket.OPEN) {
                socket.send(errorMessage);
              }
              
              // Reset pending player
              this.pendingPlayers = null;
              this.pendingPlayerID = null;
            }
          } else {
            this.pendingPlayers = socket;
            this.pendingPlayerID = ID;
            console.log("Player added to pending queue");
          }
        }

        // MOVE event
        // Search for the game object in which this player(socket) is playing
        // Call the makeMove function of that game object
        if (message.type === messages.MOVE) {
          const gameObject = this.Games.find(
            (game) => game.player1 === socket || game.player2 === socket
          );
          
          if (gameObject) {
            gameObject.makeMove(socket, message.payload.move);
          } else {
            console.warn("Game not found for player attempting to move");
            
            if (socket.readyState === socket.OPEN) {
              socket.send(JSON.stringify({
                type: messages.ERROR,
                payload: { message: "Game not found" }
              }));
            }
          }
        }
      } catch (error) {
        console.error("Error handling message:", error);
        
        if (socket.readyState === socket.OPEN) {
          socket.send(JSON.stringify({
            type: messages.ERROR,
            payload: { message: "Invalid message format" }
          }));
        }
      }
    });
  }
}

export default GameManager;