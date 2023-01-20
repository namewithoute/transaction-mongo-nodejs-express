const jwt = require('jsonwebtoken')

function createNewAccessToken(userInfor){
    var token = jwt.sign({
        data: {
            username: userInfor.username,
            fullname: userInfor.fullname,
            phone: userInfor.phone,
            email: userInfor.email,
        }
    }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '10s' })
    return token
}

function createNewRefreshToken(userInfor){
    var token = jwt.sign({
        data: {
            username: userInfor.username,
            fullname: userInfor.fullname,
            phone: userInfor.phone,
            email: userInfor.email,
        }
    }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' })
    return token
}

module.exports={createNewAccessToken,createNewRefreshToken}