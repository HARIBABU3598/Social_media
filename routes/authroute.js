import express from "express"
import protectRoute from "../middleware/protectRoute.js"
//export is not given default so we use {}
import {signup,login,logout,getMe} from "../controllers/authController.js"
const router=express.Router();
router.post("/signup",signup);      //post for store in database
router.post("/login",login);
router.post("/logout",logout);
router.get("/me",protectRoute,getMe);
export default router;