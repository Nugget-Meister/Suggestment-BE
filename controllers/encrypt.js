const bcrypt = require("bcrypt")

// const salt  = await bcrypt.genSalt()


const hashPassword = async (password) => {
    hashedPassword = await bcrypt.hash(password, 10)
    // console.log(hashedPassword)
    return hashedPassword
}

const validatePassword = async (password, stored) => {
    let isValidated = await bcrypt.compare(password,stored)

    // console.log(isValidated)
    return isValidated
}

module.exports = {
    hashPassword,
    validatePassword
}