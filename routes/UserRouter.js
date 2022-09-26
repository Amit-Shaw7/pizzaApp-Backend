import express from 'express';
import { isAuthenticated } from '../controllers/AuthController.js';
import { myProfile } from '../controllers/UserController.js';
const UserRouter = express.Router();

UserRouter.route("/me")
.get(isAuthenticated , myProfile);

export default UserRouter;