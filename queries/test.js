const db = require('../db/dbConfig.js')

const getAll = async () => {
    try{
        const result = await db.any("SELECT * FROM test")
        return result
    }catch(error){
        console.log(error)
        return error
    }
}


module.exports = {
    getAll
}