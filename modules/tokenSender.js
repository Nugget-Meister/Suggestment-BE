const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

let liveURL = process.env.LIVE;
let localURL = process.env.LOCAL;


// Config for setting up node mailer
const t = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        'user': process.env.G_EMAIL,
        'pass': process.env.PW
    }
})


// Will store everything here when migrate
const sendVerification = (data) => {
// Token 
    const token = jwt.sign({
        email: data.email   
    }, 'verifyEmail', {expiresIn: '10m' } )
    

    console.log(token)

    // // Needs to be setup for each user?
    // const mailConfig = {
    //     from: process.env.G_EMAIL,
    //     to: '',
    //     subject: 'Suggestment Email Verification',
    //     text: `Hi! Thanks for signing up for Suggestment. However in order to continue, you'll need to verify your account. Follow the link below to verify your email. This link will expire in 10 minutes. ${liveURL ? liveURL: localURL}/verify/${token}`
    // }
    
    // t.sentMail(mailConfig, (error, info) => {
    //     if (error) throw Error(error)
    //     console.log(`Email sent to ${mailConfig.to}.`)
    //     console.log(info)
    // })

}


module.exports = {
    sendVerification
}
