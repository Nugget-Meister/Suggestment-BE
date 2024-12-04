const express = require('express')
const jwt = require('jsonwebtoken')

const { getAllUsers, createUser, getUser, verifyUser } = require('../queries/users')
const {
    hashPassword,
    validatePassword,
} = require('./encrypt.js')
const { sendVerification } = require('../modules/tokenSender.js')

const users = express.Router()

users.get('/', async (req, res) => {
    const result = await getAllUsers()
    
    process.stdout.write("GET Request for all Users received... ")

    if(result){
        // console.log(res)
        if(result.severity != undefined){
            console.log("Error Detected: ", result.message)
            res.status(500).json({
                message:"BAD",

                data: result
            })
        } else {
            console.log("Dispensing.")
            res.status(200).json({
                message:"OK",
                data: result
            })
    
        }
    }
})


users.post("/", async (req, res) => {
    let newUser = req.body
    newUser.password = await hashPassword(newUser.password)

    let createdUser = await createUser(newUser)
    
    sendVerification(newUser)

    if(createdUser){
        if(createdUser.severity != undefined){
            res.status(500).json({
                message:"BAD",
                data: createdUser
            })
        } else {
            res.status(200).json({
                message:"OK",
                data: createdUser
            })
        }
    }
    
})


users.post("/login", async (req, res) => {
    let credentials = req.body
    let user = await getUser(credentials);
    let validated = await validatePassword(credentials.password,user[0].password)

    // if(validated){}
    // console.log(user, credentials)
    res.status(200).json({
        message:"OK",
        details:"...",
        data: null
    })
})

users.get("/verify/:token", async (req,res) => {
    const {token} = req.params

    const fail = () => {
        res.status(500).json({
            message: "BAD",
            details: "Email Verification failed.",
            data: null
        })
    }
    jwt.verify(token, 'verifyEmail', (error, decoded) => {
        console.log(decoded)
        if(error){
            console.log(error);
            fail()
        } else {
            //update table so user verified
            verifyUser(decoded.email).then((res)=> {console.log(res)})
            res.status(200).json({
                message: "OK",
                details:"User verified",
                data: null
            })
        }
    })
})

module.exports = users