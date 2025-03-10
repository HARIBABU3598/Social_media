//importing express for creating server
import express from "express"
//to use the env file for port
import dotenv from "dotenv"
import authroute from "../routes/authroute.js"
import connectDB from "../db/connectDB.js"
import cookieParser from "cookie-parser"
import userRoute from "../routes/userRoute.js"
import cloudinary from "cloudinary"
import postRoute from "../routes/postRoute.js"

//configuring env file
dotenv.config();

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET_KEY
})
//creating object for express
const app=express();

app.use(express.json());
app.use(cookieParser());
//route to the authroute page
app.use("/api/auth",authroute);
app.use("/api/users",userRoute);
app.use("/api/posts",postRoute);

const port=process.env.PORT;
//creating server connection
app.listen(port,()=>{
    console.log(`server is running on port ${port}`); 
    connectDB();
})