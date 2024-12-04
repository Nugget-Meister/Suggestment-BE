const express = require('express')

const { getAllUsers, createUser, getUser } = require('../queries/users')
const {
    hashPassword,
    validatePassword,
} = require('./encrypt.js')

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
    // res.status(200).json({true})
})

module.exports = users