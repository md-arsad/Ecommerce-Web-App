const ErrorHander = require("../utils/errorHandelor");
const asyncHandelor = require("./catchAsyncerror");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

exports.isAuthenticatedUser = asyncHandelor(async (req, resp, next) => {
  const { token } = req.cookies;
    // console.log(token)
  if (!token) {
    return next(new ErrorHander("Please Login to access this resource", 401)); 
  }
  const decodedData = jwt.verify(token, process.env.JWT_SECRET);
  req.user = await User.findById(decodedData.id);
//   console.log("decoded",decodedData)
  next();
});

exports.isAdmin = (...roles) => {
  return (req, resp, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHander(
          `Role: ${req.user.role} is not allowed to access this resouce `,
          403
        )
      );
    }
    next();
  };
};