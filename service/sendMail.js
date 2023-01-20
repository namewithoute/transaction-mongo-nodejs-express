var nodemailer = require('nodemailer')
var path= require('path')
var { OAuth2Client } = require('google-auth-library')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })

const myOAuth2Client = new OAuth2Client(
    process.env.GOOGLE_MAILER_CLIENT_ID,
    process.env.GOOGLE_MAILER_CLIENT_SECRET
)
myOAuth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_MAILER_REFRESH_TOKEN
})


async function sendMail(mailOptions) {
    try {
        const myAccessTokenObject = await myOAuth2Client.getAccessToken()
        const myAccessToken = myAccessTokenObject?.token
        const transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: process.env.ADMIN_EMAIL_ADDRESS,
                clientId: process.env.GOOGLE_MAILER_CLIENT_ID,
                clientSecret: process.env.GOOGLE_MAILER_CLIENT_SECRET,
                refresh_token: process.env.GOOGLE_MAILER_REFRESH_TOKEN,
                accessToken: myAccessToken
            }
        })
    
        await transport.sendMail(mailOptions)
        return true
    }
    catch (e) {
        return false
    }
}
module.exports=sendMail