const express = require('express')
const { getTransactions } = require('../queries/transactions')

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

transactions.get('*', (req, res)=> {
    res.send('Base path')
})

module.exports = transactions
