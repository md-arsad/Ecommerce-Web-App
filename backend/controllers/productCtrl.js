// const asyncHandelor=require("express-async-handler");
const Product=require("../models/productModel");
const ErrorHandler = require("../utils/errorHandelor");
const asyncHandelor=require("../middlewere/catchAsyncerror");
const ApiFeatures = require("../utils/apifeatures");

exports.createProduct=asyncHandelor(async(req,resp)=>{
    req.body.user=req.user.id;
    const product=await Product.create(req.body);
    resp.status(201).json({
        success:true,
        product, 
    });
})

// Get all product
exports.getAllproduct=asyncHandelor(async(req,resp,next)=>{
    // console.log("req:",req.query);
    const resultPerPage=8;
    const productsCount=await Product.countDocuments();
    const apiFeature= new ApiFeatures(Product.find(),req.query)
    .search()
    .filter()
    .pagination(resultPerPage);

    const products=await apiFeature.query;
    const filteredProductsCount=products.length; // number of product after filteration 
  
    // apiFeature;
    // products=await apiFeature.query;
    // console.log("count feature",filteredProductsCount)
    
    resp.status(200).json({
            success:true,
            products,
            productsCount,
            resultPerPage,
            filteredProductsCount
        }
    )
    
})
// get product detail
exports.getProductDdetails=asyncHandelor(async(req,resp,next)=>{
    const product=await Product.findById(req.params.id);
    if(!product){
        return next(new ErrorHandler("product not found ",404));
    }
    // await product.remove();
    resp.status(200).json({
        success:true,
        product
    });
})
exports.updateProduct=asyncHandelor(async(req,resp,next)=>{
    let product=await Product.findById(req.params.id);
    if(!product){
        return next(new ErrorHandler("product not found ",404));
    }
    product=await Product.findByIdAndUpdate(req.params.id,req.body,{
        new:true
    });
    resp.status(200).json({
        success:true,
        product
    })
});

exports.deleteProduct=asyncHandelor(async(req,resp,next)=>{
    const product=await Product.findById(req.params.id);
    if(!product){
        return next(new ErrorHandler("product not found ",404));
    }
    // await product.remove();
    const delproduct=await Product.findByIdAndDelete(req.params.id)
    resp.status(200).json({
        success:true,
        message:"product deleted successfully",
        delproduct
    });
});

// Create New Review or Update the review
exports.createProductReview = asyncHandelor(async (req, resp, next) => {
    const { rating, comment, productId } = req.body;
  
    const review = {
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment,
    };
  
    const product = await Product.findById(productId);
  
    const isReviewed = product.reviews.find(
      (rev) => rev.user.toString() === req.user._id.toString()
    );
  
    if (isReviewed) {
      product.reviews.forEach((rev) => {
        if (rev.user.toString() === req.user._id.toString())
          (rev.rating = rating), (rev.comment = comment);
      });
    } else {
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
    }
  
    let avg = 0;
  
    product.reviews.forEach((rev) => {
      avg += rev.rating;
    });
  
    product.ratings = avg / product.reviews.length;
  
    await product.save({ validateBeforeSave: false });
  
    resp.status(200).json({
      success: true,
    });
  });
  
  // Get All Reviews of a product
exports.getProductReviews = asyncHandelor(async (req, resp, next) => {
    const product = await Product.findById(req.query.id);
    console.log("req query:",req.query)
    console.log(product);
    if (!product) {
      return next(new ErrorHandler("Product not found", 404));
    }
  
    resp.status(200).json({
      success: true,
      reviews: product.reviews,
    });
});

// delete reviews 
exports.deleteReview = asyncHandelor(async (req, resp, next) => {
    const product = await Product.findById(req.query.productId);
  
    if (!product) {
      return next(new ErrorHandler("Product not found", 404));
    }
  
    const reviews = product.reviews.filter(
      (rev) => rev._id.toString() !== req.query.id.toString()
    );
  
    let avg = 0;
  
    reviews.forEach((rev) => {
      avg += rev.rating;
    });
  
    let ratings = 0;
  
    if (reviews.length === 0) {
      ratings = 0;
    } else {
      ratings = avg / reviews.length;
    }
  
    const numOfReviews = reviews.length;
  
    await Product.findByIdAndUpdate(
      req.query.productId,
      {
        reviews,
        ratings,
        numOfReviews,
      },
      {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      }
    );
  
    resp.status(200).json({
      success: true,
    });
  });
// module.exports={createProduct,updateProduct};