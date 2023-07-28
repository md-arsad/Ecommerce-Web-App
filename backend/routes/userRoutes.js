const express=require("express");
const { registerUser, loginUser,
     logOut, forgotPassword, 
     resetPassword, getUserDetails,
      updatePassword, updateProfile,
       getAllUser, 
       getSingleUser,
       updateUserRole,
       deleteUser} = require("../controllers/userCtrl");

const { isAuthenticatedUser, isAdmin } = require("../middlewere/auth");

// const 
const router=express.Router();

router.post("/register", registerUser);
router.post("/login",loginUser);
router.get("/logout",logOut);

router.post("/password/forgot",forgotPassword);
router.put("/password/reset/:token",resetPassword);

router.get("/me",isAuthenticatedUser,getUserDetails)
router.put("/password/update",isAuthenticatedUser,updatePassword)
router.put("/profile/update",isAuthenticatedUser,updateProfile)
router.get("/alluser",getAllUser)

router.get("/admin/:id",isAuthenticatedUser,isAdmin("admin"),getSingleUser)

router.put("/admin/:id",isAuthenticatedUser,isAdmin("admin"),updateUserRole);
router.delete("/admin/:id",isAuthenticatedUser,isAdmin("admin"),deleteUser);

module.exports=router; 