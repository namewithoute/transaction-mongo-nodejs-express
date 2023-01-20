var userModel = require('../models/user')
var { validationResult } = require('express-validator')
var jwt = require('jsonwebtoken')
const {createNewAccessToken,createNewRefreshToken} = require('./genToken')
const client = require('../config/connectRedis')
function loginGET(req, res) {

    res.render('login')

}

async function loginPOST(req, res) {
    //handle error form validator
    const err = validationResult(req)
    if (!err.isEmpty()) {
        console.log(err)
        req.session.message = 'TÀI KHOẢN KHÔNG HỢP LỆ VUI LÒNG KIỂM TRA LẠI'
        return res.redirect('/login')
    }

    console.log(req.body)
    var userInfor = await userModel.findOne({ username: req.body.username, password: req.body.password })
    if (userInfor) {
        var accessToken= createNewAccessToken(userInfor)
        var refreshToken=createNewRefreshToken(userInfor)
        console.log(refreshToken)
        await client.sAdd('refresh_token',refreshToken)

        res.cookie('user', refreshToken,{domain:"localhost",path:'/refresh-token',secure:true})
        res.cookie('accessToken', accessToken)

        res.redirect('/payment')
        // res.json({ 'token': sign })
        return
    }
    req.session.message = 'SAI TÀI KHOẢN HOẶC MẬT KHẨU'
    res.status(401).redirect('/login')
}


module.exports = {
    loginGET,
    loginPOST
}