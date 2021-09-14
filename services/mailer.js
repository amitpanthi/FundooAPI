const nodemailer= require("nodemailer")
const logger = require("../logger/logger")
const DEFAULT_LOG_STRING = `${new Date().toLocaleString()}: `

let mailerFunctions = {
    async sendMail(res, rep) {
        console.log("STARTED MAIL PROCESS")
        let transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_ID, 
                pass: process.env.EMAIL_PASSWORD, 
            },
            });

        let emailData = {
            from: `"Fundoo Guy" <${process.env.EMAIL_ID}@gmail.com>`, // sender address
            to: "apanthi08@gmail.com", 
            subject: "Password Reset Mail", 
            text: "Reset Password?", 
            html: "<b>Reset?</b> <a>Click Here</a>",
        };
        
        await transporter.sendMail(emailData, (error, info) => {
            if(error){
                logger.error(DEFAULT_LOG_STRING + "Couldn't send mail")
                console.error(error)
            }else{
                logger.info(DEFAULT_LOG_STRING + "Mail sent successfully")
                console.log(`Email Sent : ${info.response}`)
            }
        })
        }
}

module.exports = mailerFunctions