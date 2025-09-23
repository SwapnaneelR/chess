// a middleware to check user logged in , if not , game cant be played
import jwt from "jsonwebtoken"
const SECRET = "chess"
async function middleware(req,res,next) {
    const token = req.cookies.token
    if(!token){
        res.status(400).json({
            message : "No token my bro!"
        })
        return;
    }
    try{
        jwt.verify(token,SECRET);
        next();
    }
    catch{
        res.status(400).json({
            message : "invalid token"
        })
    }   
}
export default middleware