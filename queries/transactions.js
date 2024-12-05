let db = require('../db/dbConfig.js')

const getTransactions = async (id) => {
    try {
        const result = await db.any("SELECT * FROM suggestment_transactions WHERE user_id=$1", [id])
        return result
    } catch (error) {
        return error
    }
}

const getAllTransactions = async () => {
    try {
        const result = await db.any("SELECT * FROM suggestment_transactions",)
        return result
    } catch (error) {
        return error
    }
}

module.exports = {
    getTransactions, 
    getAllTransactions
}