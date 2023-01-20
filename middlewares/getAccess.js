const fetch = require('node-fetch')
const { createNewAccessToken } = require('./genToken')
const client=require('../config/connectRedis')
const jwt =require('jsonwebtoken')
async function getAccessToken(req,res){
    var result = await fetch('http://localhost:3001/auth',{
        method:'POST',
        headers:{
            'Content-type':'application/json'
        },
        body:JSON.stringify({refreshToken:req.cookies.user})
    })
    var token = await result.json()
    if(!token.accessToken){
        return res.redirect('/login')
    }
    console.log(token.accessToken)    
    res.cookie('accessToken',token.accessToken)
    req.session.message ={
        type:0,
        message:'PHIÊN LÀM VIỆC ĐÃ HẾT HẠN VUI LÒNG THỬ LẠI'
    }
    res.redirect('/payment')
    // if(req.cookies.user){
    //     jwt.verify(req.cookies.user, process.env.REFRESH_TOKEN_SECRET, async function (err, decoded) {
    //         if (err) {
    //             console.log(err)
    //             return res.redirect('/login')
    //             // res.json("invalid token")
    //         }
    //         else {
    //             console.log(decoded)
    //             var isRefreshTokenInRedis = await client.sMembers('refresh_token')

    //             if(!isRefreshTokenInRedis.includes(req.cookies.user)){
    //                 return res.redirect('/login')
    //             }
    //             var token = createNewAccessToken(decoded.data)
    //             res.cookie('accessToken',token)
    //             res.redirect('/payment')
    //             // req.data = decoded.data
    //             // next()
    //         }
    //     })
    // }
    console.log(token)
}
module.exports =getAccessToken