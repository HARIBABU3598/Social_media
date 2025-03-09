import mongoose from "mongoose";
const userSchema=mongoose.Schema({
    userName:{
        type:String,
        required:true,
        unique:true                     //No two users can have the same userName
    },
    fullName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true     
    },
    password:{
        type:String,
        required:true,
        minLength:6
    },
    followers:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            default:[]
        }
    ],
    following:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",                             //BELOW DEFINITON
            default:[]
        }
    ],
    profileImage:{
        type:String,                                //stores the Url of image
        default:""
    },
    coverImage:{
        type:String,
        default:""
    },
    bio:{
        type:String,
        default:""
    },
    link:{
        type:String,
        default:""
    }
},{timestamps:true})                            //fields store when the user was created and last modified.

const User=mongoose.model("User",userSchema);   

export default User;