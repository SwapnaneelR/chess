import jwt from "jsonwebtoken"
import UserDB from "../db/user.model.js";

const SECRET = "chess"

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
    res.cookie("token",token)
    // send back 200
    res.status(200).json({
        message : "Login Successful"
    })
}
export default loginController