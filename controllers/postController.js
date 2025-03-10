import User from "../models/user_model.js";
import cloudinary from "cloudinary";
import Post from "../models/post_Model.js"
import Notification from "../models/notification_model.js"
export const createPost=async(req,res)=>{
    try {
        const {text}=req.body;
        let {img}=req.body;
        const userId=req.user._id.toString();
        const user =await User.findOne({_id:userId})
        if(!user){
            return res.status(400).json({error:"User not found"})
        }

        if(!text && !img){
            return res.status(400).json({error:"post must have text or image"})
        }
        if(img){
            const uploadedResponse=await cloudinary.uploader.upload(img);
            img=uploadedResponse.secure_url;
        }
        const newPost= new Post({

            user:userId,
            text,
            img
        })
        await newPost.save();
        res.status(201).json(newPost);
    } catch (error) {
        console.log(`error in create post controller: ${error}`);
        res.status(500).json({error:"internal server error"})
        
    }
}

export const deletePost=async(req,res)=>{
    try {
        const {id}=req.params;
        const post=await Post.findOne({_id:id});
        if(!post){
            return res.status(400).json({error:"Post not found"})
        }
        //if the post of id and requested id mismatches we sholud not delete the post
        if(post.user.toString()!==req.user._id.toString()){
            res.status(401).json({error:"you are not authorized to delete this post"})
        }
        if(post.img){
            const imgId=post.img.split("/").pop().split(".")[0];
            await cloudinary.destroy(imgId);
        }
        await Post.findByIdAndDelete(id);
        res.status(200).json({message:"Post deleted successfully"});

    } catch (error) {
        console.log(`error in delete post controller: ${error}`);
        res.status(500).json({error:"internal server error"})
    }
}

export const createComment=async(req,res)=>{
    try {
        const{text}=req.body;
        const postId=req.params.id;
        const userId=req.user._id;      //current user id
        if(!text){
            return res.status(400).json({error:"comment text is required"})
        }
        const post=await Post.findOne({_id:postId})
        if(!post){
            return res.status(404).json({error:"Post not found"})
        }
        const comment={
            user:userId,
            text
        }
        post.comments.push(comment);
        await post.save();
        res.status(200).json(post);

    } catch (error) {
        console.log(`error in creating comment controller: ${error}`);
        res.status(500).json({error:"internal server error"})
    }
}
export const likeUnlikePost=async(req,res)=>{
    try {
        const userId=req.user._id;
        const{id:postId}=req.params;
        const post=await Post.findOne({_id:postId});
        if(!post){
            return res.status(400).json({error:"Post not found"})
        }
        //this will be true if user liked the post
        const userLikedPost=post.likes.includes(userId);
        if(userLikedPost){
            //unlike post
            await Post.updateOne({_id:postId},{$pull:{likes:userId}})
            res.status(200).json({message:"post unliked successfully"})
        }
        else{
            //like post
            post.likes.push(userId);
            await post.save();

            const notification=new Notification({
                from:userId,//login person
                to:post.user,//owner of post
                type:"like"
            })
            await notification.save();
            res.status(200).json({message:"Post liked successfully"})
        }


    } catch (error) {
        console.log(`error in like and unlike controller: ${error}`);
        res.status(500).json({error:"internal server error"})
    }
}

export const getAllPosts=async(req,res)=>{
    try {
        const posts=await Post.find().sort({createdAt:-1})
        if(posts.length==0){
            return res.status(200).json([])
        }
        res.status(200).json(posts)
    } catch (error) {
        console.log(`error in getting all the post controller: ${error}`);
        res.status(500).json({error:"internal server error"})
    }
}