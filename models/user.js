var mongoose = require('mongoose')
const connect = require('../config/connectDB')
const { Schema } = require('mongoose')
var userSchema = new Schema({
    username: String,
    password: String,
    fullName: String,
    phone: String,
    email: String,
    balance: Number,
    historyTrx:[{
        type:Schema.Types.ObjectId,
        ref:'transaction'
    }]
})

var userModel = mongoose.model('users', userSchema)

const trxSchema = mongoose.Schema({
    username: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    typeTrx: String,
    studentID: String,
    amountPayable: Number,
    status: Boolean,
    createAt: Date,
})

const trxModel = mongoose.model('transaction', trxSchema)



async function createUser(username, password, fullname, phone, email, balance) {
    console.log(await userModel.create({
        username,
        password,
        fullname,
        phone,
        email,
        balance
    }))
}

async function getListTrx() {
    console.log(await trxModel.find().populate({
        path: 'username',
        select:'username -_id'
    }))
}
getListTrx()
// createUser('trnnam123','nam123','tran quoc nam', '0123456712','email@gmail.com',50000000)
async function createTrx(username, typeTrx, studentID, amountPayable, status, createAt) {
    console.log(await trxModel.create({
        username,
        typeTrx,
        studentID,
        amountPayable,
        status,
        createAt
    }))
}


// createTrx('63bbf6e92ce2fd864df72baf','Thanh toán học phí','519H012312',100000,true,Date.now())
// module.exports=userModel




