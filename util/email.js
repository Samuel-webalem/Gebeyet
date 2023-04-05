const nodemailer = require('nodemailer');

const sendMail =async options => {
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            email: process.env.EMAIL_USERNAME,
            password:process.env.EMAIL_PASSWORD
        }
    })
    const mailoption = {
      from: "Gebeyet.com Gebeyet@gmail.com",
      to: options.email,
      subject: options.subject,
      text: options.message,
    };

await transporter.sendMail(mailoption)
}

module.exports = sendMail;