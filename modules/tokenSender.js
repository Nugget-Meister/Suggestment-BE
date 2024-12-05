const dotenv = require('dotenv')
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const { createTransporter } = require('../testauth');



dotenv.config()

let liveURL = process.env.LIVE || process.env.LOCAL 

// Config for setting up node mailer
// const t = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//         user: process.env.G_EMAIL,
//         pass: process.env.G_PW
//     }
// })

// const t = nodemailer.createTransport({
//     service: 'Gmail',
//     host: 'smtp.gmail.com',
//     port: 465,
//     secure: true,
//     auth: {
//         user: process.env.G_EMAIL,
//         pass: process.env.G_PW
//     }
// })

// createTransporter()


// Will store everything here when migrate
const sendVerification = (data) => {
// Token 
    const token = jwt.sign({
        email: data.email   
    }, 'verifyEmail', {expiresIn: '10m' } )
    
    // console.log(token)

    // Needs to be setup for each user?
    const mailConfig = {
        from: process.env.G_EMAIL,
        to: data.email,
        subject: 'Suggestment Email Verification',
        text: `Hi! Thanks for signing up for Suggestment. However in order to continue, you'll need to verify your account. Follow the link below to verify your email. This link will expire in 10 minutes. ${liveURL}/users/verify/${token}`
    }
    
    // console.log(mailConfig)
    console.log(`Verification email sent to  ${data.email}`)
    

    // Creates gmail transporter to send email
    createTransporter()
    .then((t) => {
        t.sendMail(mailConfig, (error, info) => {
            if (error) throw Error(error)
            console.log(`Email sent to ${mailConfig.to}.`)
            console.log(info, error)
        })
    })



}


module.exports = {
    sendVerification
}
