const express = require('express')
const dotenv = require('dotenv')

const jwt = require ('jsonwebtoken')
const { getUser } = require('../queries/users')
const { validatePassword } = require('./encrypt')
const { createTransporter } = require('../testauth')
const { sendLoginVerification } = require('../modules/tokenSender')

let liveURL = process.env.LIVE || process.env.LOCAL 

let devMode = process.env.ISDEV == 'true'

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
            
            try {
                sendLoginVerification(user)
                .then(res => {
                    console.log('Atttempt:', res)
                })

                res.status(200).json({
                    message:"OK",
                    details:"...",
                    data: null
                })
            } catch (error) {
                console.log("An error occurred sending the email.")
            }
        } else {
            res.status(404).json({
                message:"BAD",
                details: "Invalid email or password",
                data:null
            })
        }
    } else {
        res.status(404).json({
            message:"BAD",
            details: "Invalid email or password",
            data:null
        })
    }
})



login.get('/', async (req, res) => {
    let token = '';
    if(req.headers.authorization){
        token = req.headers.authorization.split(' ')[1]
    }

    console.log(`Login Token received: ${token}`)

    jwt.verify(token, 'loginVerification', (error, decoded) => {
        if(error){
            console.log(error)
            res.status(404).json({
                message: "BAD",
                details: "Token Invalid, or expired."
            })
        } else {
            const sessionToken = jwt.sign({
                id: decoded.user_id,
                email: decoded.email
            }, 'sessionToken', {expiresIn: devMode ? '900m': '120m' })

            res.status(200).json({
                message: "OK",
                details: "",
                data: sessionToken
            })
        }
    })
})

login.get("/sync", async (req,res) => {
    let sessionToken = ''
    // console.log(req)
    if(req.headers.authorization){
        sessionToken = req.headers.authorization.split(' ')[1]
    }
    
    console.log('Session Token Verification: ', sessionToken)
    
    jwt.verify(sessionToken, 'sessionToken', async (error, decoded)=> {
        console.log(decoded)
        if(error){
            console.log(error.message)
            res.status(401).json({
                message:"BAD",
                details:"Session Expired. Relog",
                data: null
            })
        }
        else {
            let user = await getUser(decoded)
            // console.log(user)
            if(!user.severity){
                res.status(200).json({
                    message: "OK",
                    details: "Validated token",
                    data: {
                        user_id: user.user_id, 
                        email: user.email,
                        name: user.name
                    }
                })
            }
        }
    })  
 })   
module.exports = login