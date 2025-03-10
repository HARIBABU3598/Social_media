import jwt from "jsonwebtoken";
import User from "../models/user_model.js";

const protectRoute=async(req,res,next)=>{
    try{
        const token=req.cookies.jwt;
        if(!token){
            return res.status(400).json({error:"Unauthorized:no token provided"});
        }
        const decoded=jwt.verify(token,process.env.JWT_SECRET);//check whether our cookie is found from browser
        if(!decoded){
            return res.status(400).json({error:"Unauhtorized :Invalid token"});
        }
        const user=await User.findOne({_id:decoded.userId}).select("-password");
        if(!user){
            return res.status(400).json({error:"user not found"});
        }
        req.user=user;
        next();
    }catch(error){
        console.log(`error in protectRoute middleware: ${error}`);
        
        res.status(400).json({message:"internal error"});
    }
}

export default protectRoute;