const app=require("./app")
const dotenv=require("dotenv").config();
const dbConnect=require("./config/dbconnec")


dbConnect();  
const server=app.listen(process.env.PORT,()=>{
    console.log(`server is running on port:${process.env.PORT} `);
});  
// Handling Uncaught Exception(like console.log(youtube)=> error- youtube is not defined)
process.on("uncaughtException", (err) => {
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to Uncaught Exception`);
    process.exit(1);
});
    
// Unhandled Promise Rejection(if u pass wrong url for connection)
process.on("unhandledRejection", (err) => {
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to Unhandled Promise Rejection`);
  
    server.close(() => {
      process.exit(1);
    });
  });
