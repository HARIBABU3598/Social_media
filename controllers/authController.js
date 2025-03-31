import User from "../models/user_model.js"
import bcrypt from "bcrypt";
import generateToken from "../backend/utils/generateToken.js";
export const signup=async(req,res)=>{
    try {
        const{userName,fullName,email,password}=req.body;

        const emailRegex=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;//for email validation check if correct or not

 
        if(!emailRegex.test(email)){
            return res.send(400).json({error : "invalid email format"});
        }
        const existingEmail=await User.findOne({email});                       //stores true if existing and entered is same
        const existingUserName=await User.findOne({userName});                 //stores true if existing and entered is same
        if(existingEmail || existingUserName){
            return res.status(400).json({error:"already existing user or email"});
        }


        if(password.length<6){
            return res.status(400).json({error:"password must have atleast 6 char length"})
        }
        //hashing the password for security
        const salt=await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(password,salt);

        const newUser=new User({
            userName,
            fullName,
            email,
            password:hashedPassword
        })

        if(newUser){
            generateToken(newUser._id,res)
            await newUser.save();                                           //store data in database
            res.status(200).json({message : "User Created Successfully"});               
        }
        else{
            res.status(400).json({error : "invalid User Data"});
        }

    } catch (error) {
        console.log(`error in signup controller ${error}`); 
    }
}
export const login=async(req,res)=>{
    try{
    const {userName,password}=req.body;
    const user=await User.findOne({userName});
    const isPasswordCorrect=await bcrypt.compare(password,user?.password || "");
    if(!user || !isPasswordCorrect){
        return res.status(400).json({error:"invalid username or password"})
    }
    generateToken(user._id,res);

    res.status(200).json({
       message: "user login successful"
    });}
    catch(error){
        console.log(`error generated :${error}`);
    }
}
export const logout=(req,res)=>{
    try{
        res.cookie("jwt","",{maxAge:0});//make token null
        res.status(200).json({message:"logout successfully"});
    }catch(error){
        console.log("Error in logout");
    }
}

export const getMe=async(req,res)=>{
    try{
        const user = await User.findOne({_id:req.user._id}).select("-password");
        res.status(200).json(user);
    }catch(error){
        console.log(`error in getME ${error}`);
        res.status(500).json({error:"internal server error"}); 
    }
}