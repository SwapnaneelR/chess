export default function logoutController(req,res){
    // clear the token cookie (use same attributes so browser removes it)
    const isProd = process.env.NODE_ENV === 'production';
    res.cookie('token', '', {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? 'None' : 'Lax',
        path: '/',
        maxAge: 0
    });
    return res.status(200).json({ message: 'logged out' });
}

