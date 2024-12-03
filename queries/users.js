let db = require('../db/dbConfig.js')
// kc_postgres

let getUser = async() => {
    try {
        const result = await db.any("SELECT * FROM suggestment_users")
        return result
    } catch (error) {
        return error
    }
}


let getAllUsers = async() => {
    try {
        const result = await db.any("SELECT * FROM suggestment_users")
        return result
    } catch (error) {
        return error
    }
}
let createUser = async (data) => {
    try {
        const result = await db.one(
            "INSERT INTO suggestment_users (email, username, password, isVerified) VALUES ($1,$2,$3, false)", 
            [data.name, data.email, data.password]
        )
    } catch (error) {
        return error
    }
}
let updateUser = async (data, id) => {
    try {
        const result = await db.one(
            "UPDATE suggestment_users SET name=$1, email=$2, password=$3, isVerified=$4 WHERE user_id=$4 ",
            [data.name, data.email, data.password, data.isVerified, id])
    } catch (error) {
        return error
    }
}
let deleteUser = async () => {}

module.exports = {
    createUser,
    getUser,
    getAllUsers,
    updateUser,
    deleteUser
}