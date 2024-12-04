let db = require('../db/dbConfig.js')
// kc_postgres

let getUser = async (data) => {
    try {
        const result = await db.any("SELECT * FROM suggestment_users WHERE email=$1", [data.email])
        return result
    } catch (error) {
        return error
    }
}


let getAllUsers = async () => {
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
            "INSERT INTO suggestment_users (user_id, email, name, password, isVerified) VALUES (gen_random_uuid(),$2,$1,$3, false) RETURNING *", 
            [data.name, data.email, data.password]
        )
        console.log(result)
        return result
    } catch (error) {
        return error
    }
}
let updateUser = async (data, id) => {
    try {
        const result = await db.one(
            "UPDATE suggestment_users SET name=$1, email=$2, password=$3, isVerified=$4 WHERE user_id=$4 ",
            [data.name, data.email, data.password, data.isVerified, id])
            return result
    } catch (error) {
        return error
    }
}

let verifyUser = async (email) => {
    try {
        const result = await db.one(
            "UPDATE suggestment_users SET isVerified=true WHERE email=$1 RETURNING *",
            [email])
            return result
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
    deleteUser,
    verifyUser
}