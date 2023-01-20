var jwt = require('jsonwebtoken')
const client = require('../config/connectRedis')
function auth(req, res, next) {
    if (!req.cookies.accessToken ) {
        res.redirect('/login')
        return
    }
    else{
        jwt.verify(req.cookies.accessToken, process.env.ACCESS_TOKEN_SECRET, async function (err, decoded) {
            if (err) {
         
            return res.redirect('/refresh-token')
                // res.redirect('/refresh-token')
                // return res.redirect('/login')
                // res.json("invalid token")
            }
            else {
                req.data = decoded.data
                next()
            }
        })
    }
}

module.exports = auth