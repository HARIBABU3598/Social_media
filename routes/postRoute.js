import express from "express";
import protectRoute from "../middleware/protectRoute.js"
const router=express.Router();
import {createPost} from "../controllers/postController.js"
router.post("/create",protectRoute,createPost);
// router.post("/like/:id",protectRoute,likeUnlikePost)
// router.post("/comment/:id",protectRoute,createComment)
// router.delete("/",protectRoute,deletePost)

export default router;
