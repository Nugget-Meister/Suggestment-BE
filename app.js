const express = require("express")
const cors = require ("cors")
const {getAll} = require("./queries/test.js")

//Controllers
const userController =  require("./controllers/userController.js")
const transactionController = require("./controllers/transactionController.js")


const app = express()

app.use(cors())
app.use(express.json())

// Controllers

// Routes
// app.use('/', controller)
app.use('/users', userController)
app.use('/transactions', transactionController)



// Standard
app.get("/", async (req,res) => {
    res.send("Base response for Suggestment-BE. Hit an endpoint")
})

app.get('/test', async (req,res) => {
    const result = await getAll()
    if(result){
        if(result.length == 0){
            console.log("Caution - No results found for query.")
        } else {
            res.status(200).json({
                message:"OK",
                data: result,
            })
        }
    } else {
        console.log("Warning - Unable to access SQL server")
        res.status(500).json({
            message: "Server Unavailable",
            data: null
        })
    }
    res.send()
})

app.get("*", async (req, res)=> {
    res.status(404).json({
        message:"Route non-existent",
        data: null
    })
})

module.exports = app