var mongoose = require('mongoose')

var otpSchema = mongoose.Schema({
    email:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'users'
    },
    otp:Number,
    payFor:String,
})

var otpModel = mongoose.model('otps',otpSchema)
module.exports=otpModel