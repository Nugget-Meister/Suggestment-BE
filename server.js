const app = require(".app")

require("dotenv").config()

const environment = {
    PORT: process.env.PORT
}


app.listen(environment.port, ()=> {
    console.log(`Server open on port ${environment.port}`)
})