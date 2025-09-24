export default function logoutController(req,res){
    // clear the token cookie (set empty with immediate expiry)
    res.cookie('token','', { maxAge: 0 });
    return res.status(200).json({ message: 'logged out' });
}

