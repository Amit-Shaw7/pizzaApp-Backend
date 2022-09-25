import { asyncError } from "../middlewares/error.js";
import OrderModel from "../models/OrderModel.js";
import UserModel from "../models/UserModel.js";

export const myProfile = (req , res, next) => {
    res.status(200).json({
        success : true,
        user : req.user, 
    });
};

// For Admin only
export const allUsers = asyncError(async (req , res , next) => {
    const Users = await UserModel.find();
    
    return res.status(200).json({
        msg : "All user fetched succesfully",
        Users
    })
})

export const getStats = asyncError(async (req , res , next) => {
    const userCount = await UserModel.countDocuments();

    const orders = await OrderModel.find({

    });

    const preparingOrders = orders.filter((item) => item.orderStatus === "Preparing");
    const shippedOrders = orders.filter((item) => item.orderStatus === "Shipped");
    const deliveredOrders = orders.filter((item) => item.orderStatus === "Delivered");

    let totalIncome = 0;

    orders.forEach(i => {
        totalIncome += i.totalAmount;
    });
    
    return res.status(200).json({
        msg : "Stats fetched succesfully",
        userCount,
        ordersCount : {
            total : orders.length,
            preparing : preparingOrders.length,
            shipped : shippedOrders.length,
            delivered : deliveredOrders.length
        },
        totalIncome,
        success : true,
    })
})