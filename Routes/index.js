const express = require('express')
const router = express.Router()
const auth = require('../Middlewares/auth')

router.get('/', auth, (req, res) => {
    console.log(res.locals.auth_data)
    return res.send({ message: 'Get Working!' })
})

router.post('/', (req, res) => {
    return res.send({ message: 'Post Working!' })
})

module.exports = router