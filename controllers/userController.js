import User from "../models/user_model.js";
import Notification from "../models/notification_model.js"
import bcrypt from "bcrypt";
import cloudinary from "cloudinary"
export const getProfile = async (req, res) => {
    try {
        const { userName } = req.params; // Use the correct field name
        const user = await User.findOne({ userName }).select("-password"); // Exclude password from response 

        if (!user) {
            return res.status(404).json({ error: "User not found" }); // Use 404 for "Not Found"
        }

        res.status(200).json(user);
    } catch (error) {
        console.error(`Error in get user profile controller: ${error.message}`);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const followUnFollowUser=async(req,res)=>{
    try {
        const {id}=req.params;
        const userToModify=await User.findOne({_id:id});
        const currentUser=await User.findOne({_id:req.user._id})
        if(id===req.user._id){
            return res.status(400).json({error:"you can't follow/unfollow yourself"});
        }
        if(!userToModify||!currentUser){
            return res.status(400).json({error:"user not found"});
        }

        const isFollowing=currentUser.following.includes(id);
        if(isFollowing){
            //unfollow
            //pull your id from their follower list
            await User.findByIdAndUpdate({_id:id},{$pull:{followers:req.user._id }})
            //pull their id from your following list
            await User.findByIdAndUpdate({_id:req.user._id},{$pull:{following:id}})
            res.status(200).json({message:"unfollowed successfully"})
        }
        else{
            //follow
            //updating person's follower details
            await User.findByIdAndUpdate({_id:id},{$push:{followers:req.user._id }})
            //update your following details
            await User.findByIdAndUpdate({_id:req.user._id},{$push:{following:id}})


            //send notification
            const newNotification=new Notification({
                type:"follow",
                from:req.user._id,
                to:userToModify._id
            })
            await newNotification.save();
            res.status(200).json({message:"followed successfully"})
        }
    } catch (error) {
        console.error(`Error in follow and unfollow controller: ${error.message}`);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const getSuggestedUsers=async(req,res)=>{
    try {
        const userId=req.user._id;//current authenticated id
        const userFollowedByMe=await User.findOne({_id:userId}).select("-password")

        const users=await User.aggregate([
            {
                $match:{
                    _id:{$ne:userId}
                }//collect id without current user
            },{
                $sample:{
                    size:10
                }//collect 10 sample id
            }
        ])

        const filteredUser=users.filter((user)=>!userFollowedByMe.following.includes(user._id))//should not show already followed person

        const suggestedUsers=filteredUser.slice(0,4)
        suggestedUsers.forEach((user)=>(user.password=null))
        res.status(200).json(suggestedUsers)
    } catch (error) {
        console.error(`Error in getSuggestedUsers controller: ${error.message}`);
        res.status(500).json({ error: "Internal Server Error" });
    }
}


export const updateUser=async(req,res)=>{
    try {
        const userId=req.user._id;
        const {userName,fullName,email,currentPassword,newPassword,bio,link}=req.body;
        let {profileImg,coverImg}=req.body;
        let user=await User.findById({_id:userId})
        if(!user){
            return res.status(400).json({error:"user not found"})
        }
        if((!newPassword && currentPassword)||(!currentPassword&&newPassword)){
            return res.status(400).json({error:"please provide both the password"})
        }
        if(currentPassword && newPassword){
            const isMatch=await bcrypt.compare(currentPassword,user.password)
            if(!isMatch){
                return res.status(400).json({error:"current password is incorrect"})
            }
            if(newPassword.length<6){
                return res.status(400).json({error:"password must have atleast 6 char"})
            }
            const salt=await bcrypt.genSalt(10);
            user.password=await bcrypt.hash(newPassword,salt);
        }

        // if(profileImg){
        //     //https://res.cloudinary.com/dcp7yipbt/image/upload/v1726817523/cld-sample-5.jpg
        //     if(user.profileImg){
        //         await cloudinary.uploader.destroy(user.profileImg.split("/").pop().split(".")[0]);
        //     }
        //     const uploadedResponse=await cloudinary.uploader.upload(profileImg)
        //     profileImg=uploadedResponse.secure_url;
        // }
        // if(coverImg){
        //     if(user.coverImg){
        //         await cloudinary.uploader.destroy(user.coverImg.split("/").pop().split(".")[0]);
        //     }
        //     const uploadedResponse=await cloudinary.uploader.upload(coverImg)
        //     coverImg=uploadedResponse.secure_url;
        // }

        user.fullName=fullName||user.fullName;
        user.email=email||user.email;
        user.userName=userName||user.userName;
        user.bio=bio||user.bio;
        user.link=link||user.link;
        user.profileImg=profileImg||user.profileImg;
        user.coverImg=coverImg||user.coverImg;

        user=await user.save();
        //does not affect mongodb data
        user.password=null;
        return res.status(200).json(user);
    } catch (error) {
        console.error(`Error in updateUser controller: ${error.message}`);
        res.status(500).json({ error: "Internal Server Error" });
    }
}