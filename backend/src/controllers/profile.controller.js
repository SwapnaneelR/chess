import jwt from "jsonwebtoken"
const SECRET = process.env.JWT_SECRET || "chess"
async function profileController(req,res) {
    const token = req.cookies.token
    if(!token){
        res.status(400).json({
            message : "not logged in"
        })
    }
    try{
        const user = jwt.verify(token,SECRET); 
        return res.status(200).json({ user });
    }
    catch(err){
        console.log(err)
        return res.status(401).json({ message: 'invalid or expired token' })
    }
}
export default profileController