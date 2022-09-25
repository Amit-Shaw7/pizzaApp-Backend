import express from 'express';
import { isAdmin, isAuthenticated } from '../controllers/AuthController.js';
import { allUsers, getStats, myProfile } from '../controllers/UserController.js';
const UserRouter = express.Router();

UserRouter.route("/me")
.get(isAuthenticated , myProfile);

// Admin authoriztion is required
UserRouter.get("/admin/users" , isAuthenticated , isAdmin , allUsers);
UserRouter.get("/admin/stats" , isAuthenticated , isAdmin , getStats);




export default UserRouter;