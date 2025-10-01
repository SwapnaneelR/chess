import mongoose from "mongoose";

const GameSchema = new mongoose.Schema({
    players : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User",
            required : true
        }
    ],
    gameid : {
        type : String,
        required : true
    }
});
const GameDB = new mongoose.model("Game", GameSchema);
export default GameDB;
