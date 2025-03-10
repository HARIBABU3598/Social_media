import express from "express";
import protectRoute from "../middleware/protectRoute.js"
const router=express.Router();
import {createPost,deletePost,createComment,likeUnlikePost,getAllPosts} from "../controllers/postController.js"
router.post("/create",protectRoute,createPost)
router.post("/like/:id",protectRoute,likeUnlikePost)
router.post("/comment/:id",protectRoute,createComment)
router.delete("/:id",protectRoute,deletePost)
router.get("/all",protectRoute,getAllPosts)
export default router;
