// Logout -> to logout a user

import { createError } from "../middlewares/error.js";
import ErrorHandler from "../utils/ErrorHandler.js";

export const logout = (req, res, next) => {
    req.session.destroy((err) => {
        if (err) { return next(err) }

        res.clearCookie("connect.sid",{
            secure : process.env.NODE_ENV === "development" ? false : true,
            httpOnly : process.env.NODE_ENV === "development" ? false : true,
            sameSite : "none",
        });
        res.status(200).json({
            msg: "logged out succesfully"
        })
    })
}

// IsAuthenticated -  checks whether user is logged in or not
export const isAuthenticated = (req, res, next) => {
    const token = req.cookies["connect.sid"];
    if (!token) return next(new ErrorHandler("Please Login", 401));
    else next();
}

// IsAdmin - checks whether the user is admin or not
export const isAdmin = (req, res, next) => {
    // console.log(req.user);
    if(!req.user){
        return next(new ErrorHandler("Please Login with admin credentials" , 401));  
    }
    if (req.user.role !== "admin") return next(new ErrorHandler("Admin credentials required", 401));

    next();
} 

