const nodemailer = require('../../config/nodemailer');

class SiteRepository{
    getMailforOtp(email, otp){
        return {
            from: '"🍺 Edu Center 🍺 👻" <nguyenchilapk18@gnmail.com>', // sender address
            to: email, // list of receivers
            subject: "Verify password with OTP ✔", // Subject line
            text: "Use this OTP to create new password", // plain text body
            html: "<h3>Your OTP:</h3>" + 
            `<div style="display: flex;">
                <div> ༼ つ ◕_◕ ༽つ </div>
                <h1 style="font-weight: bold; color: red; margin-left: 100px;">${otp}</h1>
            </div>`, // html body
        }
    }
}

module.exports = new SiteRepository();