import jwt from "jsonwebtoken"


const generateToken=(userId,res)=>{
    const token=jwt.sign({userId},process.env.JWT_SECRET,{
        expiresIn:"15d"
    });
    res.cookie("jwt", token, {
        maxAge: 15 * 24 * 60 * 1000, // 15 days in milliseconds
        httpOnly: true,   // Prevents client-side JavaScript from accessing the cookie (security measure)
        sameSite: "strict", // Prevents CSRF attacks by ensuring the cookie is only sent from the same site
        secure: process.env.NODE_ENV !== "development" // Uses secure cookies (HTTPS) in production
    });

    
}
export default generateToken;