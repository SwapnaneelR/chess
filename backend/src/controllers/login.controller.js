import jwt from "jsonwebtoken"
import dotenv from 'dotenv';
dotenv.config();
import UserDB from "../db/user.model.js";

const SECRET = process.env.JWT_SECRET || "chess"

async function loginController(req,res){
    const {username,password} = req.body;
    // check if user exist in DB    
    const user = await UserDB.findOne({username,password});
    // if not send 400 
    if(!user){
        res.status(400).json({
            message : "please register !" 
        })
        return;
    }
    // create a jwt token using name and password
    const token = jwt.sign({username,password},SECRET,{expiresIn : "1h"})
    // store the jwt in cookies 
    // set httpOnly cookie so browser stores it and sends on refresh
    res.cookie("token", token, {
        httpOnly: true,
        maxAge: 60 * 60 * 1000, // 1 hour in ms to match token expiry
        sameSite: 'lax'
    })
    // send back 200
    res.status(200).json({
        message : "Login Successful",
        user : user
    })
}
export default loginController