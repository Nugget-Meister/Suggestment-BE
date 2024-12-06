const express = require('express')
const jwt = require ('jsonwebtoken')
const { getUser } = require('../queries/users')

const login = express.Router()


module.exports = login