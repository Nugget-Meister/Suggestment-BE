const express = require('express')
const jwt = require('jsonwebtoken')

const { 
    getAllUsers, 
    createUser, 
    getUser, 
    verifyUser, 
    getUserFrID,
    deleteUserFrEmail,
    updateUser
} = require('../queries/users')
const {
    hashPassword,
    validatePassword,
} = require('./encrypt.js')
const { sendVerification, sendResetVerification } = require('../modules/tokenSender.js')

const users = express.Router()

let debug = true

// users.get('/', async (req, res) => {
//     const result = await getAllUsers()
    
//     process.stdout.write("GET Request for all Users received... ")

//     if(result){
//         // console.log(res)
//         if(result.severity != undefined){
//             console.log("Error Detected: ", result.message)
//             res.status(500).json({
//                 message:"BAD",

//                 data: result
//             })
//         } else {
//             console.log("Dispensing.")
//             res.status(200).json({
//                 message:"OK",
//                 data: result
//             })
//         }
//     }
// })

// Delete user from email
users.delete("/e/:email", async (req, res) => {
    let { email } = req.params;
    console.log(`DELETE request for ${email} received`)

    const result = await deleteUserFrEmail(email)
    console.log(result)
    if (result.email) {
        res.status(200).json({
            message:"OK",
            details: `Deleted user ${result.email}`,
            data: null
        })
    } else {
        res.status(500).json({
            message:"BAD",
            details: "An error has occurred. User may not exist",
            data: result.message
        })
    }
})



users.post("/", async (req, res) => {
    const fail = (data) => {
        res.status(500).json({
            message: "BAD",
            details: "Failed to create user",
            data: data.detail
        })
    }
    const success = (data) => {
        res.status(200).json({
            message: "OK",
            details:"Created user",
            data: data.name
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
        if(createdUser.detail){
            console.log(createdUser.detail)
        } else {
            console.log(createdUser)
        }

        if(createdUser.severity != undefined){
            console.log("failed to create user")
            res.status(500).json({
                message:"BAD",
                data: createdUser
            })
        } else {
            console.log('Success')
            sendVerification(createdUser)
            res.status(200).json({
                message:"OK",
                data: {
                    email: createdUser.email
                }
            })
        }
    }
    
})


// users.post("/login", async (req, res) => {
//     let credentials = req.body
//     let user = await getUser(credentials);
//     let validated = await validatePassword(credentials.password,user[0].password)

//     // if(validated){}
//     // console.log(user, credentials)
//     res.status(200).json({
//         message:"OK",
//         details:"...",
//         data: null
//     })
// })

users.get("/verify", async (req,res) => {
    const token = req.headers.authorization.split(' ')[1]
    console.log(`Received verify request for token`, req.headers.origin, token)
    
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


try {
    jwt.verify(token, 'verifyEmail', (error, decoded) => {
    //    debug ? console.log("DEBUG: ", decoded) : null
        if(error){
            console.log(error.message);
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
} catch (error) {
    console.log("Invalid Token Detected")
    res.status(500).json({
        message: "BAD",
        details:"Bad token",
        data:null
    })
}
})

users.get('/reset', async (req, res)=> {
    // With valid user token, sent reset token
    const sessionToken = req.headers.authorization.split(' ')[1]

    try {
        jwt.verify(sessionToken, 'sessionToken', async (error, decoded) => {
            if(error){
                console.log("Invalid Token Detected")
                res.status(500).json({
                    message: "BAD",
                    details:"Bad token",
                    data:null
                })
            } else {
                sendResetVerification(decoded)
                res.status(200).json({
                    message: "OK",
                    details:"Reset email sent",
                    data: null,
                })

            }

        })
    } catch (error) {
        console.log("Invalid Token Detected")
        res.status(500).json({
            message: "BAD",
            details:"Bad token",
            data:null
        })
    }
})

users.post('/reset', async (req, res) => {
    const resetToken = req.headers.authorization.split(' ')[1]
    const newData = req.body

    console.log("Reset request with token", resetToken)

    try {
        jwt.verify(resetToken, 'resetVerification', async (error, decoded) => {
            if(error){
                console.log("Invalid Token Detected")
                console.log(error)
                res.status(500).json({
                    message: "BAD",
                    details:"Bad token",
                    data:null
                })
            } else {
                // console.log(decoded)
                let user = await getUser(decoded)
                console.log(user.user_id)
                if (!user.severity){
                    let hashed = await hashPassword(newData.password)
                    // console.log({...user, password: hashed}, user.user_id)
                    let newUser = await updateUser({...user, password: hashed}, user.user_id)

                    if(!newUser.severity){
                        console.log(newUser)
                        res.status(200).json({
                            message: "OK",
                            details:"User Updated",
                            data: null,
                        })
                    } else {
                        console.log("Error updating user")
                        console.log(newUser)
                        res.status(500).json({
                            message: "BAD",
                            details:"Internal error. User may not exist",
                            data:null
                        })
                    }
                } else {
                    console.log("Error getting user")
                    res.status(500).json({
                        message: "BAD",
                        details:"Internal error. User may not exist",
                        data:null
                    })
                }
            }
        })
    } catch (error) {
        console.log("Invalid Token Detected")
        res.status(500).json({
            message: "BAD",
            details:"Bad token",
            data:null
        })
    }
})





users.get('/:id', async (req, res) => {
    let { id } = req.params;

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

module.exports = users