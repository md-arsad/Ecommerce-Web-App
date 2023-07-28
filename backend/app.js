const express=require("express");
const app=express();
const errorMiddlewere=require("./middlewere/error");

const cookieParser = require("cookie-parser");

app.use(express.json());
app.use(cookieParser());

const productRouter=require("./routes/productRoutes");
const userRouter=require("./routes/userRoutes");
const orderRouter=require("./routes/orderRoutes");

app.use("/api/v1",productRouter);
app.use("/api/v1",userRouter);
app.use("/api/v1",orderRouter);

// error middle error 
app.use(errorMiddlewere);  

module.exports=app;