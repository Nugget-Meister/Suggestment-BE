const express = require('express')
const jwt = require('jsonwebtoken')

const { getAllUsers, createUser, getUser, verifyUser, getUserFrID } = require('../queries/users')
const {
    hashPassword,
    validatePassword,
} = require('./encrypt.js')
const { sendVerification } = require('../modules/tokenSender.js')

const users = express.Router()

let debug = true

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

users.get('/:id', async (req, res) => {
    let { id }= req.params;

    console.log("GET Request received for id: ", id)
    const result = await getUserFrID(id)
    if(result){
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
    const fail = (data) => {
        res.status(500).json({
            message: "BAD",
            details: "Failed to create user",
            data: data
        })
    }
    const success = (data) => {
        res.status(200).json({
            message: "OK",
            details:"Created user",
            data: data
        })
    }

    process.stdout.write('Received post request to CREATE user... ')

    if(req.body.password != req.body.repeat){
        fail(null)
    }
    let newUser = req.body

    newUser.password = await hashPassword(newUser.password)
    let createdUser = await createUser(newUser)

    if(createdUser){
        if(createdUser.severity != undefined){
            console.log("failed")
            res.status(500).json({
                message:"BAD",
                data: createdUser
            })
        } else {
            console.log('Success')
            sendVerification(createdUser)
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
    console.log(`Received verify request for token ${token}`)
    
    const fail = (data) => {
        res.status(500).json({
            message: "BAD",
            details: "Email Verification failed.",
            data: data
        })
    }
    const success = (data) => {
        res.status(200).json({
            message: "OK",
            details:"User verified",
            data: data
        })
    }

    jwt.verify(token, 'verifyEmail', (error, decoded) => {
       debug ? console.log("DEBUG: ", decoded) : null
        if(error){
            console.log(error);
            fail(null)
        } else {
            //update table so user verified
            //check if user alraedy verified
            // console.log(decoded.email)
            getUser(decoded).then((response)=> {
                // console.log("hello",response)
                if(!response.isverified){
                    verifyUser(decoded.email).then((response)=> {
                        debug ? console.log("DEBUG: ",response) : null
                        if(res.severity != undefined){
                            fail(null)
                        }else {
                            success(null)
                        }
                    })
                } else {
                    console.log("User alrady verified.")
                    res.status(201).json({
                        message:"OK",
                        details: "Already verified",
                        data: null
                    })
                }
            })
        
        }
    })
})

module.exports = users