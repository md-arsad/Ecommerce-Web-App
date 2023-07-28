
const User = require("../models/userModel");
const ErrorHander = require("../utils/errorHandelor");
const asyncHandelor = require("../middlewere/catchAsyncerror");
const sendToken = require("../utils/jwToken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const { send } = require("process");
// const cloudinary = require("cloudinary");

// Register a User
exports.registerUser = asyncHandelor(async (req, resp, next) => {
//   const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
//     folder: "avatars",
//     width: 150,
//     crop: "scale",
//   });

  const { name, email, password } = req.body;

  const user = await User.create({
    name,
    email,
    password,
    // avatar: {
    //   public_id: myCloud.public_id,
    //   url: myCloud.secure_url,
    // },
  });
//   const token = user.getJWTToken();
//   resp.status(201).json({
//     success: true,
//     user,
//     token,
//   });
  sendToken(user, 201, resp);
});

// Login User
exports.loginUser = asyncHandelor(async (req, resp, next) => {
    const { email, password } = req.body;

    // checking if user has given password and email both
    if (!email || !password) {
        return next(new ErrorHander("Please Enter Email & Password", 400));
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
        return next(new ErrorHander("Invalid email or password", 401));
    }

    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
        return next(new ErrorHander("Invalid email or password", 401));
    }
  sendToken(user, 200, resp);
});

// Logout User
exports.logOut = asyncHandelor(async (req, resp, next) => {
  resp.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  resp.status(200).json({
    success: true,
    message: "Logged Out",
  });
});

// Forgot Password
exports.forgotPassword = asyncHandelor(async (req, resp, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorHander("User not found", 404));
  }

  // Get ResetPassword Token
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  const resetPasswordUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/user/password/reset/${resetToken}`;

  const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then, please ignore it.`;
// console.log(message);
  try {
    // console.log("try")
    
    await sendEmail({
      email: user.email,
      subject: `Ecommerce Password Recovery`,
      message,
    });

    resp.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new ErrorHander(error.message, 500));
  }
});

// Reset Password
exports.resetPassword = asyncHandelor(async (req, resp, next) => {
  // creating token hash
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  console.log("req.params.token",req.params.token)
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new ErrorHander(
        "Reset Password Token is invalid or has been expired",
        400
      )
    );
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHander("Password does not password", 400));
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  sendToken(user, 200, resp);
});

// Get User Detail
exports.getUserDetails = asyncHandelor(async (req, resp, next) => {
  const user = await User.findById(req.user.id);

  resp.status(200).json({
    success: true,
    user,
  });
});

// update User password
exports.updatePassword = asyncHandelor(async (req, resp, next) => {
  const user = await User.findById(req.user.id).select("+password");

  const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

  if (!isPasswordMatched) {
    return next(new ErrorHander("Old password is incorrect", 400));
  }

  if (req.body.newPassword !== req.body.confirmPassword) {
    return next(new ErrorHander("password does not match", 400));
  }

  user.password = req.body.newPassword;

  await user.save();

  sendToken(user, 200, resp);
});

// update User Profile
exports.updateProfile = asyncHandelor(async (req, resp, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
  };

  // if (req.body.avatar !== "") {
  //   const user = await User.findById(req.user.id);

  //   const imageId = user.avatar.public_id;

  //   await cloudinary.v2.uploader.destroy(imageId);

  //   const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
  //     folder: "avatars",
  //     width: 150,
  //     crop: "scale",
  //   });

  //   newUserData.avatar = {
  //     public_id: myCloud.public_id,
  //     url: myCloud.secure_url,
  //   };
  // }

  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  resp.status(200).json({
    success: true,
  });
});

// Get all users(admin)
exports.getAllUser = asyncHandelor(async (req, resp, next) => {
  const users = await User.find();
  if(!users){
    return next(new ErrorHander("there is no user", 400));
  }
  resp.status(200).json({
    success: true,
    users,
  });
});

// Get single user (admin)
exports.getSingleUser = asyncHandelor(async (req, resp, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorHander(`User does not exist with Id: ${req.params.id}`)
    );
  }

  resp.status(200).json({
    success: true,
    user,
  });
});

// update User Role -- Admin
exports.updateUserRole = asyncHandelor(async (req, resp, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };

  await User.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  resp.status(200).json({
    success: true,
  });
});

// Delete User --Admin
exports.deleteUser = asyncHandelor(async (req, resp, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorHander(`User does not exist with Id: ${req.params.id}`, 400)
    );
  }

  // const imageId = user.avatar.public_id;

  // await cloudinary.v2.uploader.destroy(imageId);

  // await user.remove();
  const deletedUser = await User.findByIdAndDelete(req.params.id);

  resp.status(200).json({
    success: true,
    message: "User Deleted Successfully",
    deletedUser
  });
});