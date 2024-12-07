const express = require('express')
const dotenv = require('dotenv')

const jwt = require ('jsonwebtoken')
const { getUser } = require('../queries/users')
const { validatePassword } = require('./encrypt')
const { createTransporter } = require('../testauth')

let liveURL = process.env.LIVE || process.env.LOCAL 

const login = express.Router()
 

login.post("/", async (req, res) => {
    const credentials = req.body

    console.log("Login request for", credentials.email)
    let user = await getUser(credentials);
    console.log(user)

    if(user.user_id != undefined){
        let validated = await validatePassword(credentials.password,user.password)
        if(validated){
            //I need to create jwt token and then email it
            const token = jwt.sign({
                id: user.user_id,
                email: credentials.email
            }, 'login', {expiresIn: '5m'})

            const mailConfig = {
               from: process.env.G_EMAIL,
               to: user.email,
               subject: 'Suggestment 2-Factor Auth',
               text: `This link will expire in 5 minutes. `
            }
        }

        res.status(200).json({
            message:"OK",
            details:"...",
            data: null
        })
    } else {
        res.status(404).json({
            message:"BAD",
            details: "Invalid email or password",
            data:null
        })
    }
})



login.post('/:token', async (req, res) => {
    const {token} = req.params;

    console.log(`Login Token received: ${token}`)

    jwt.verify(token, 'login', (error, decoded) => {
        if(error){
            console.log(error)
            res.status(404).json({
                message: "BAD",
                details: "Token Invalid, or expired."
            })
            
        } else {
            res.send(200).json({
                message:"OK",
                details: null,
                data: decoded
            })
        }
    })


})
module.exports = login