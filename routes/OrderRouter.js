import express from 'express';
import { isAdmin, isAuthenticated } from '../controllers/AuthController.js';
import { allOrder, changeOrderStatus, createonlineorder, createorder, getAllOrder, orderDetails, paymentVerification } from '../controllers/OrderController.js';
const OrderRouter = express.Router();

// For Logged in user only -------------------------------------
OrderRouter.post("/createorder" , isAuthenticated , createorder); 
OrderRouter.post("/createonlineorder", isAuthenticated , createonlineorder); 
OrderRouter.post("/paymentverification" , isAuthenticated , paymentVerification); 

OrderRouter.get("/allorders" , isAuthenticated ,getAllOrder);
OrderRouter.get("/:id" , isAuthenticated ,orderDetails);

// For Admin only ----------------------------------------------
OrderRouter.get("/admin/allorders" , isAuthenticated , isAdmin , allOrder);
OrderRouter.get("/admin/order/:id" , isAuthenticated , isAdmin , changeOrderStatus);

export default OrderRouter