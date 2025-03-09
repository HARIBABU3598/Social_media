//importing express for creating server
import express from "express";
//to use the env file for port
import dotenv from "dotenv";
import authroute from "../routes/authroute.js"
import connectDB from "../db/connectDB.js"
//configuring env file
dotenv.config();
//creating object for express
const app=express();

app.use(express.json());
//route to the authroute page
app.use("/api/auth",authroute);


const port=process.env.PORT;
//creating server connection
app.listen(port,()=>{
    console.log(`server is running on port ${port}`); 
    connectDB();
})