const express=require("express");
const { isAuthenticatedUser,isAdmin } = require("../middlewere/auth");
const { newOrder, getSingleOrder, myOrders, getAllOrders, deleteOrder, updateOrder } = require("../controllers/orderCtrl");

const router=express.Router();

router.post("/new",isAuthenticatedUser,newOrder);

router.get("/myorder",isAuthenticatedUser,myOrders);

router.get("/all",isAuthenticatedUser,isAdmin("admin"),getAllOrders);
router.get("/:id",isAuthenticatedUser,getSingleOrder);


router.put("/admin/:id",isAuthenticatedUser,isAdmin("admin"),updateOrder);

router.delete("/admin/:id",isAuthenticatedUser,isAdmin("admin"),deleteOrder);


module.exports=router;