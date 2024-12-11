const express = require('express')
const { getTransactions,createTransaction, getTransaction,updateTransaction,deleteTransaction } = require('../queries/transactions')
const jwt = require('jsonwebtoken')
const transactions = express.Router()

transactions.get('/user/:id', async (req,res) => {
    let { id } = req.params
    const result = await getTransactions(id)
    process.stdout.write(`Transactions Request for: ${id} `)
    
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

transactions.get('/:id', (req, res)=> {
    const { id } = req.params;
    let sessionToken = req.headers.authorization.split(' ')[1]
    console.log("Transaction request for: ", id)
    console.log(sessionToken)

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
                // Do things here
                let result = await getTransaction(id)
                if(!result.severity){
                    res.status(200).json({
                        message:"OK",
                        details:"transaction",
                        data: result,
                    })
                } else {
                    res.status(404).json({
                        message:"BAD",
                        details:"unable to find transaction",
                        data: null,
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

transactions.post('/', (req, res)=> {
    const sessionToken = req.headers.authorization.split(' ')[1]
    const data = req.body

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
                // Do things here
                let result = await createTransaction(data)
                if(!result.severity){
                    res.status(200).json({
                        message:"OK",
                        details:"transaction created successfully",
                        data: result,
                    })
                } else {
                    res.status(404).json({
                        message:"BAD",
                        details:"unable to create transaction",
                        data: null,
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

transactions.put('/:id', (req, res)=> {
    const { id } = req.params;
    const sessionToken = req.headers.authorization.split(' ')[1]

    const data = req.body
    
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
                // Do things here
                let result = await updateTransaction(data)
                if(!result.severity){
                    res.status(200).json({
                        message:"OK",
                        details:"transaction updated",
                        data: result,
                    })
                } else {
                    res.status(404).json({
                        message:"BAD",
                        details:"unable to find transaction",
                        data: null,
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

transactions.delete('/:id', (req, res)=> {
    const { id } = req.params;
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
                // Do things here
                const result = await deleteTransaction(id)
                if(!result.severity){
                    res.status(200).json({
                        message:"OK",
                        details:"transaction",
                        data: result,
                    })
                } else {
                    res.status(404).json({
                        message:"BAD",
                        details:"unable to find transaction",
                        data: null,
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



transactions.get('*', (req, res)=> {
    res.send('Base path')
})

module.exports = transactions
