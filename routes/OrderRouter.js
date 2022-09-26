import express from 'express';
import { isAdmin, isAuthenticated } from '../controllers/AuthController.js';
import { createonlineorder, createorder, getAllOrder, orderDetails, paymentVerification } from '../controllers/OrderController.js';
const OrderRouter = express.Router();

// For Logged in user only -------------------------------------
OrderRouter.post("/createorder" , isAuthenticated , createorder); 
OrderRouter.post("/createonlineorder", isAuthenticated , createonlineorder); 
OrderRouter.post("/paymentverification" , isAuthenticated , paymentVerification); 

OrderRouter.get("/allorders" , isAuthenticated ,getAllOrder);
OrderRouter.get("/:id" , isAuthenticated ,orderDetails);

export default OrderRouter