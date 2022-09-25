import { asyncError, createError } from "../middlewares/error.js";
import OrderModel from "../models/OrderModel.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import { instance } from "../server.js";
import crypto from "crypto";
import PaymentModel from "../models/PaymentModel.js";

// Placing Order --------------
export const createorder = asyncError(async (req, res, next) => {
    const {
        shippingInfo,
        orderItems,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingCharges,
        totalAmount,
        // user
    } = req.body;

    const user = req.user._id;

    const orderOptions = {
        shippingInfo,
        orderItems,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingCharges,
        totalAmount,
        user
    };
    await OrderModel.create(orderOptions);
    return res.status(200).json({
        success: true,
        msg: "Order placed succesfully via COD"
    })

});
export const createonlineorder = asyncError(async (req, res, next) => {
    const {
        shippingInfo,
        orderItems,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingCharges,
        totalAmount,
        // user
    } = req.body;

    const user = req.user._id;

    const orderOptions = {
        shippingInfo,
        orderItems,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingCharges,
        totalAmount,
        user
    };

    var options = {
        amount: Number(totalAmount) * 100,  // amount in the smallest currency unit
        currency: "INR",
    };

    const order = await instance.orders.create(options);


    return res.status(200).json({
        success: true,
        msg: "Order placed succesfully via COD",
        order,
        orderOptions
    })

});


export const paymentVerification = asyncError(async (req, res, next) => {
    const {
        razorpay_payment_id,
        razorpay_order_id,
        razorpay_signature,
        orderOptions
    } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignatue = crypto.createHmac("sha256", process.env.RAZORPAY_API_SECRET).update(body).digest("hex");


    const isAuthenticatedSign = expectedSignatue === razorpay_signature;
    // const isAuthenticatedSign =  true;
    if (isAuthenticatedSign) {
        const payment = await PaymentModel.create({
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        });

        await OrderModel.create({
            ...orderOptions,
            paidAt: new Date(Date.now()),
            paymentInfo: payment._id,
        });

        res.status(200).json({
            success: true,
            msg: "Order Placed Successfully. Payment ID : " + payment._id
        })
    } else {
        return next(new ErrorHandler("Payment failed", 400))
    }
})



// ---------------- Needs User Authorization ----------------

// Get all orders of logged in user ---------------
export const getAllOrder = asyncError(async (req, res, next) => {
    const allOrders = await OrderModel.find({
        userId: req.user._id
    });

    return res.status(200).json({
        success: true,
        allOrders
    })
});

// Get logged in order details
export const orderDetails = asyncError(async (req, res, next) => {
    const order = await OrderModel.findById(req.params.id);
    if (!order) return next(new ErrorHandler("Not Found", 404));

    return res.status(200).json({
        msg: "Order fetched succesully",
        order
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

