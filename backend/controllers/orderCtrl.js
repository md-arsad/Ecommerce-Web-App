const Order = require("../models/orderModel");
// const Product = require("../models/productModel");
const ErrorHander = require("../utils/errorHandelor");
const asyncHandelor = require("../middlewere/catchAsyncerror");

// Create new Order
exports.newOrder = asyncHandelor(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  const order = await Order.create({
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paidAt: Date.now(),
    user: req.user._id,
  });

  res.status(201).json({
    success: true,
    order,
  });
});


// get Single Order
exports.getSingleOrder = asyncHandelor(async (req, res, next) => {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "name email"
    );
  
    if (!order) {
      return next(new ErrorHander("Order not found with this Id", 404));
    }
  
    res.status(200).json({
      success: true,
      order,
    });
  });


  // get logged in user  Orders
exports.myOrders = asyncHandelor(async (req, res, next) => {
    const orders = await Order.find({ user: req.user._id });
    if(!orders){
        return next(new ErrorHander("Empty u did'nt order any thing ", 404));
    }
    res.status(200).json({
      success: true,
      orders,
    });
  });

// get all Orders -- Admin
exports.getAllOrders = asyncHandelor(async (req, res, next) => {
    const orders = await Order.find();
  
    let totalAmount = 0;
  
    orders.forEach((order) => {
      totalAmount += order.totalPrice;
    });
  
    res.status(200).json({
      success: true,
      totalAmount,
      orders,
    });
});


// update Order Status -- Admin
exports.updateOrder = asyncHandelor(async (req, res, next) => {
    const order = await Order.findById(req.params.id);
  
    if (!order) {
      return next(new ErrorHander("Order not found with this Id", 404));
    }
  
    if (order.orderStatus === "Delivered") {
      return next(new ErrorHander("You have already delivered this order", 400));
    }
  
    if (req.body.status === "Shipped") {
      order.orderItems.forEach(async (o) => {
        await updateStock(o.product, o.quantity);
      });
    }
    order.orderStatus = req.body.status;
  
    if (req.body.status === "Delivered") {
      order.deliveredAt = Date.now();
    }
  
    await order.save({ validateBeforeSave: false });
    res.status(200).json({
      success: true,
    });
  });

async function updateStock(id, quantity) {
    const product = await Product.findById(id);
  
    product.Stock -= quantity;
  
    await product.save({ validateBeforeSave: false });
}
  
// delete Order -- Admin
exports.deleteOrder = asyncHandelor(async (req, res, next) => {
    const order = await Order.findById(req.params.id);
    console.log("req.params.id:",req.params.id)
    console.log("order:",order);
    if (!order) {
      return next(new ErrorHander("Order not found with this Id", 404));
    }
  
    // await order.remove();
    await Order.findByIdAndDelete(req.params.id);
    res.status(200).json({
      success: true,
    });
});