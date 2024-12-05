const dotenv = require('dotenv')
const nodemailer = require('nodemailer');
const {google} = require('googleapis')

dotenv.config()

const OAuth2 = google.auth.OAuth2

const createTransporter = async () => {
    const authClient = new OAuth2(
        process.env.G_CLIENT_ID,
        process.env.G_CLIENT_SECRET,
        "https://developers.google.com/oauthplayground"
    )
    
    authClient.setCredentials({
        refresh_token: process.env.G_REFRESH
    })

    const accessToken = await new Promise((res, rej)=> {
        authClient.getAccessToken((error, token) => {
            if (error){
                rej("Failed to create token")
            }
            res(token)
        })
    })
    
    const t = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            type: "OAuth2",
            user: process.env.G_EMAIL,
            clientId: process.env.G_CLIENT_ID,
            clientSecret: process.env.G_CLIENT_SECRET,
            refreshToken: process.env.G_REFRESH,
            accessToken
            // accessToken: process.env.G_ACCESS
        }
    })

    return t
}

// createTransporter()
// .then((res)=> {
//     res.sendMail({
//         subject: "Test",
//         text: "I am sending an email from nodemailer!",
//         to: "suggestment1@gmail.com",
//         from: process.env.EMAIL
//       });
      
// })




module.exports = {
    createTransporter
}