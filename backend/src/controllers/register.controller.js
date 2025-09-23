import UserDB from "../db/user.model.js"; 
async function registerController(req,res){
    const {username,password} = req.body; 
    // go to DB and check if same credentials exist
    const user = await UserDB.findOne({username,password});
    if(user){
        res.status(300).json({
            message : "User credentials already Exists"
        })
        return;
    }
    // if no user exist then create user and send 200
    try{ 
        const newUser = new UserDB({username,password})
        await newUser.save() 
        res.status(200).json({
            message : "Registration Successful"
        })
    }
    catch {
        res.status(400).send("registration fail")
    }
}
export default registerController