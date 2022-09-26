import express from "express";
import { allOrder, allUsers, changeOrderStatus, getStats } from "../controllers/AdminController.js";
import { isAdmin, isAuthenticated } from "../controllers/AuthController.js";
const AdminRouter = express.Router();

//For Admin Only (Users) 
AdminRouter.get("/users" , isAuthenticated , isAdmin , allUsers);
AdminRouter.get("/stats" , isAuthenticated , isAdmin , getStats);

// For Admin only (Orders) ----------------------------------------------
AdminRouter.get("/allorders" , isAuthenticated , isAdmin , allOrder);
AdminRouter.get("/order/:id" , isAuthenticated , isAdmin , changeOrderStatus);

export default AdminRouter;