import User from "../models/user_model.js"
import bcrypt from "bcrypt";
export const signup=async(req,res)=>{
    try {
        const{userName,fullName,email,password}=req.body;

        const emailRegex=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;//for email validation check if correct or not


        if(!emailRegex.test(email)){
            return res.send(400).json({error : "invalid email format"});
        }
        const existingEmail=await User.findOne({email})                         //stores true if existing and entered is same
        const existingUserName=await User.findOne({userName})                   //stores true if existing and entered is same
        if(existingEmail ||existingUserName){
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
            await newUser.save();
            res.status(200).json({message : "User Created Successfully"});                //store data in database
        }
        else{
            res.status(400).json({error : "invalid User Data"});
        }

    } catch (error) {
        console.log(`error in signup controller ${error}`); 
    }
}
export const login=(req,res)=>{
    res.send("signup controller");
}
export const logout=(req,res)=>{
    res.send("signup controller");
}