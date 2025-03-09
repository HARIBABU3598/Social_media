import express from "express"
//export is not given default so we use {}
import {signup,login,logout} from "../controllers/authController.js"
const router=express.Router();
router.post("/signup",signup);      //post for store in database
router.post("/login",login);
router.post("/logout",logout);
export default router; 