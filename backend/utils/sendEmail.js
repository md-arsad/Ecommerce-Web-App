
// //////////////////////////////////////////////////////////
const nodemailer=require("nodemailer");
const asyncHandelor=require("express-async-handler");

const sendEmail=asyncHandelor(async(data)=>{
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          // TODO: replace `user` and `pass` values from <https://forwardemail.net>
          user:process.env.SMPT_MAIL,
          pass:process.env.SMPT_PASSWORD
        }
      });
  
      const info = await transporter.sendMail({
        from: process.env.SMPT_MAIL, // sender address
        to: data.email, // list of receivers
        subject:data.subject, // Subject line
        text: data.message, // plain text body
        // html: data.html, // html body
      });
    
      console.log("Message sent: %s", info.messageId);
});
module.exports=sendEmail;