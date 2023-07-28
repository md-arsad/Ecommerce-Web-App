const { default: mongoose, connection } = require("mongoose")
const dbConnet= async ()=>{
    try{
        const connect= await mongoose.connect(process.env.MONGODB_URL);
        console.log("Database connected successfully :");
    }
    catch(erroe){
        console.log("Database error");   
        process.exit(1) ;
    }  
}
module.exports=dbConnet;  