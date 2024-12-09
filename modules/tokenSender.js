const dotenv = require('dotenv')
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const { createTransporter } = require('../testauth');

dotenv.config()


let devMode = process.env.ISDEV || false

console.log(devMode == 'true')
let backURL = devMode == 'true' ? process.env.LOCAL : process.env.LIVE 
let frontURL = devMode == 'true' ? process.env.F_LOCAL : process.env.F_LIVE 

devMode == 'true' ? console.log("Dev mode is active. Targeting", frontURL) : console.log("Dev mode is inactive, Targeting", frontURL)

// Will store everything here when migrate
const sendVerification = (data) => {
// Token 
    const token = jwt.sign({
        email: data.email   
    }, 'verifyEmail', {expiresIn: devMode ? '120m': '10m' } )
    // console.log(token)

    const mailConfig = {
        from: process.env.G_EMAIL,
        to: data.email,
        subject: 'Suggestment Email Verification',
        // text: `Hi! Thanks for signing up for Suggestment. However in order to continue, you'll need to verify your account. Follow the link below to verify your email. This link will expire in 10 minutes. ${liveURL}/users/verify/${token}`
        html:`<p>Hi! Thanks for signing up for Suggestment. However in order to continue, you'll need to verify your account. Follow the link below to verify your email. This link will expire in ${devMode ? '120': '10'} minutes. <a href="${frontURL}/verify/${token}/">Confirm Registration</a></p>`
    }

    
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

const sendLoginVerification = async (data) => {
    const token = jwt.sign({
        id: data.user_id,
        email: data.email
    }, 'loginVerification', {expiresIn: devMode ? '120m': '5m' })

    const mailConfig = {
       from: process.env.G_EMAIL,
       to: data.email,
       subject: 'Suggestment 2-Factor Auth',
       html: `<p>Hi, someone has attempted to sign into your account. Verify your sign in <a href="${frontURL}/signin/${token}/">here</a>. This link will expire in  ${devMode ? '120': '5'} minutes.<p>`
    }
    
    // Create Transport then send email
    createTransporter()
    .then((t) => {
        t.sendMail(mailConfig, (error, info) => {
            if (error) throw Error(error)
            console.log(`Email sent to ${mailConfig.to}.`)
            console.log(info, error)
        })
    })
}


const sendResetVerification = async (data) => {
    const token = jwt.sign({
        id: data.user_id,
        email: data.email
    }, 'resetVerification', {expiresIn: devMode ? '120m': '5m' })

    const mailConfig = {
        from: process.env.G_EMAIL,
        to: data.email,
        subject: 'Suggestment Password Reset',
        html: `<p>Hi, someone has attempted to reset your password. You can change your password <a href="${frontURL}/reset/${token}/">here</a>. This link will expire in ${devMode ? '120': '5'} minutes.<p>`
     }
     
    createTransporter()
    .then((t) => {
        t.sendMail(mailConfig, (error, info) => {
             if (error) {
                console.log(error)
             }else {
                console.log(`Email sent to ${mailConfig.to}.`)
             }
         })
     })
}




module.exports = {
    sendVerification,
    sendLoginVerification,
    sendResetVerification
}
