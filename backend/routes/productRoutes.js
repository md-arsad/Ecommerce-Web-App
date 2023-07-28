const express=require("express");
const {createProduct, getAllproduct, updateProduct, deleteProduct, getProductDdetails, createProductReview, getProductReviews, deleteReview}=require("../controllers/productCtrl");
const { isAuthenticatedUser,isAdmin } = require("../middlewere/auth");

const router=express.Router();

// router.post("/new",createProduct);
router.route("/product/new").post(isAuthenticatedUser,isAdmin("admin"),createProduct);
router.get("/products",getAllproduct);

router.put("/product/:id",isAuthenticatedUser,isAdmin("admin") ,updateProduct);
router.delete("/product/:id",isAuthenticatedUser,isAdmin("admin"),deleteProduct);

router.get("/product/:id",getProductDdetails)

router.put("/review",isAuthenticatedUser,createProductReview)
router.get("/review",getProductReviews);

router.delete("/review",isAuthenticatedUser,deleteReview);

module.exports=router;
