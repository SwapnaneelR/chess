import mongoose from "mongoose";

const GameSchema = new mongoose.Schema({
    players: {
        white: {
            type: String,
            required: true
        },
        black: {
            type: String,
            required: true
        }
    },
    gameid : {
        type : String,
        required : true
    },
    moves: [{
        from: String,
        to: String,
        promotion: String,
        timestamp: { type: Date, default: Date.now }
    }],
    status: {
        type: String,
        enum: ['ongoing', 'completed', 'draw'],
        default: 'ongoing'
    }
});
const GameDB = new mongoose.model("Game", GameSchema);
export default GameDB;
