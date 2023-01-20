// const nodeFetch = require('node-fetch')
const express = require('express')
const app = express()
const { createNewAccessToken } = require('./middlewares/genToken')
const client = require('./config/connectRedis')
const jwt = require('jsonwebtoken')
require('dotenv').config()

app.use(express.urlencoded({extended:false}))
app.use(express.json())

app.post('/auth', function (req, res) {
    var refreshToken = req.body.refreshToken
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async function (err, decoded) {
        if (err) {
            console.log(err)
            return res.json({message:'invalid token'})
        }
        else {
            console.log(decoded.data)
            var isRefreshTokenInRedis = await client.sMembers('refresh_token')

            if (!isRefreshTokenInRedis.includes(refreshToken)) {
                return res.json({message:'invalid token'})
            }
            var token = createNewAccessToken(decoded.data)
            res.json({ accessToken: token })
        }
    })
})

app.listen(3001, () => { console.log('auth server port 3001') })