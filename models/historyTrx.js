const mongoose = require("mongoose");

const trxSchema = mongoose.Schema({
    username:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'users'
    },
    typeTrx:String,
    studentID:String,
    amountPayable:Number,
    status:Boolean,
    createAt:Date,
})

const trxModel = mongoose.model('transaction',trxSchema)
