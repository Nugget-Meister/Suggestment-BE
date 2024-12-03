const express = require('express')

const { getAllUsers } = require('../queries/users')

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

})

module.exports = users