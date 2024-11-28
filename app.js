const express = require("express")
const cors = require ("cors")

const app = express()

app.use(cors())
app.use(express.json())

// Controllers

// Routes
// app.use('/', controller)

// Standard
app.get("/", (req,res) => {
    res.send("Base response for Suggestment-BE. Hit an endpoint")
})

app.get("*",(req, res)=> {
    res.status(404).json({
        message:"Route non-existent",
        data: null
    })
})