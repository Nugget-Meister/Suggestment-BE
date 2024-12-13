let db = require('../db/dbConfig.js')

const getTransactions = async (id) => {
    try {
        const result = await db.any("SELECT * FROM suggestment_transactions WHERE user_id=$1", [id])
        return result
    } catch (error) {
        return error
    }
}

const getTransaction = async (id) => {
    try {
        const result = await db.one("SELECT * FROM suggestment_transactions WHERE transaction_id=$1", [id])
        return result
    } catch (error) {
        return error
    }
}
const createTransaction = async (data) => {
    try {
        const result = await db.one(
            "INSERT INTO suggestment_transactions (user_id, source_user_id, details, category, amount, date) VALUES ($1, null, $2, $3, $4, $5) RETURNING *", 
            [data.user_id, data.details, data.category, data.amount, data.date]
        )
        return result
    } catch (error) {
            return error
    }
}
const updateTransaction = async (data) => {
    try {
        const result = await db.one(
            "UPDATE suggestment_transactions SET user_id=$1, source_user_id=null, details=$2, category=$3, amount=$4, date=$5 WHERE transaction_id=$6 RETURNING *", 
            [data.user_id, data.details, data.category, data.amount, data.date, data.transaction_id]
        )
        return result
    } catch (error) {
        return error
    }
}
const deleteTransaction = async (data) => {
    try {
        const result = await db.one(
            "DELETE FROM suggestment_transactions WHERE transaction_id=$1 RETURNING *", 
            [data.transaction_id]
        )
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
    getAllTransactions,
    createTransaction,
    getTransaction,
    updateTransaction,
    deleteTransaction
}