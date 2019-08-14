const express = require('express')
const router = express.Router()
const Users = require('../Model/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const config = require('../Config/config')

const createUserToken = (userId) => {
    return jwt.sign({ id: userId }, config.jwt, config.expiration)
}

router.get('/', async (req, res) => {
    try {
        const users = await Users.find({})
        return res.send(users)
    } catch (error) {
        return res.status(500).send({ error: 'There was an error'})
    }
})

router.post('/', (req, res) => {
    return res.status(500).send({ message: 'Users Post Working!' })
})

router.post('/create', async (req, res) => {
    const { email, password } = req.body
    if(!email || !password) return res.status(400).send({ error: 'Insulficient Data' })

    try {
        if(await Users.findOne({ email })) return res.status(400).send({ error: 'User already exists!' })

        const user = await Users.create(req.body)
        user.password = undefined

        return res.status(201).send({ user, token: createUserToken(user.id) })
    } catch (error) {
        return res.status(500).send({ error: 'Error to find User!' })
    }
})

router.post('/auth', async (req, res) => {
    const { email, password } = req.body

    if(!email || !password) return res.status(400).send({ error: 'Insuficient Data!' })

    try {
        const user = await Users.findOne({ email }).select('+password')
        if(!user) return res.statsu(400).send({ error: 'User not found!' })

        const pass_ok = await bcrypt.compare(password, user.password)

        if(!pass_ok) return res.status(401).send({ error: 'Authentication error' })

        user.password = undefined
        return res.send({ user, token: createUserToken(user.id) })
    } catch (error) {
        return res.status(500).send({ error: 'There was an error!' })
    }
})

module.exports = router