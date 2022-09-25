import express, { Router } from 'express';
import passport from 'passport';
import { logout } from '../controllers/AuthController.js';
const AuthRouter = express.Router();

// For Googlle Authentication -----------------------------------------------
AuthRouter.get("/googlelogin", passport.authenticate("google", {
    scope: ["profile"],
    successRedirect: process.env.FRONTEND_URL
}));

AuthRouter.get("/login", passport.authenticate("google") , (req , res , next) => {
    res.send("Logged In");
    successRedirect : process.env.FRONTEND_URL;
});


// For Logout ---------------------------------------------------------------
AuthRouter.get("/logout" , logout)
export default AuthRouter;


