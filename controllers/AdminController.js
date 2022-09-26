import { asyncError } from "../middlewares/error.js";
import OrderModel from "../models/OrderModel.js";
import UserModel from "../models/UserModel.js";

// For Admin only
export const allUsers = asyncError(async (req, res, next) => {
    const Users = await UserModel.find();

    return res.status(200).json({
        msg: "All user fetched succesfully",
        Users
    })
});

export const getStats = asyncError(async (req, res, next) => {
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
        msg: "Stats fetched succesfully",
        userCount,
        ordersCount: {
            total: orders.length,
            preparing: preparingOrders.length,
            shipped: shippedOrders.length,
            delivered: deliveredOrders.length
        },
        totalIncome,
        success: true,
    })
});

// -------------- Needs Admin Authorization -----------------
// Get all user orders 
export const allOrder = asyncError(async (req, res, next) => {
    const allOrders = await OrderModel.find();

    return res.status(200).json({
        success: true,
        allOrders
    })
});
// Change Order Status
export const changeOrderStatus = asyncError(async (req, res, next) => {
    const order = await OrderModel.findById(req.params.id);
    if (!order) return next(new ErrorHandler("Not Found", 404));

    if (order.orderStatus === "Delivered") return next(new ErrorHandler("Item already delivered", 400));
    else if (order.orderStatus == "Preparing") order.orderStatus = "Shipped";
    else if (order.orderStatus == "Shipped") {
        order.orderStatus = "Delivered";
        order.deliveredAt = new Date(Date.now());
    };

    await order.save();

    return res.status(200).json({
        success: true,
        msg: "Status updted succesfully"
    })
});