// a middleware to check user logged in , if not , game cant be played
import jwt from "jsonwebtoken"
const SECRET = "chess"

async function middleware(req,res,next) {
    const token = req.cookies.token;
    if(!token){
        return res.status(401).json({ message: "Please login" });
    }
    try{
        const decoded = jwt.verify(token, SECRET);
        // attach decoded payload for downstream handlers
        req.user = decoded;
        next();
    }
    catch(err){
        console.log(err);
        return res.status(401).json({ message: "invalid or expired token" });
    }
}
export default middleware