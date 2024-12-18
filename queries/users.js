let db = require('../db/dbConfig.js')
// kc_postgres

let getUser = async (data) => {
    try {
        const result = await db.one("SELECT * FROM suggestment_users WHERE email=$1", [data.email])
        return result
    } catch (error) {
        return error
    }
}

let getUserFrID = async (id) => {
    try {
        const result = await db.one("SELECT * FROM suggestment_users WHERE user_id=$1", [id])
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
        // console.log(data,id)
        const result = await db.one(
            "UPDATE suggestment_users SET name=$1, email=$2, password=$3, isVerified=$4 WHERE user_id=$5 RETURNING *",
            [data.name, data.email, data.password, data.isverified, id])
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

let deleteUserFrEmail = async (email) => {
    try {
        const result = await db.one(
            "DELETE FROM suggestment_users WHERE email=$1 RETURNING *",
            [email]
        )
        return result
    } catch (error) {
        return error
    }
}

module.exports = {
    createUser,
    getUser,
    getAllUsers,
    updateUser,
    deleteUserFrEmail,
    verifyUser,
    getUserFrID
}