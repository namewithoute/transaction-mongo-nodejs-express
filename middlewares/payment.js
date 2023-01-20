var tuitionModel = require('../models/tuitionInfor')
var otpModel=require('../models/otp')
var userModel = require('../models/user')
var jwt = require('jsonwebtoken')
var sendMail = require('../service/sendMail')


async function GETTuitionInfor(req, res) {
    console.log(req.body.studentID)
    var tuition = await tuitionModel.findOne({ studentID: req.body.studentID })
    console.log(tuition)
    if(tuition){
        if(tuition.isPaid==false){
        var {studentName,amountPayable}=tuition
            return res.json({type:1,studentName,amountPayable})
        }
        else{
            return res.json({type:2,message:'SINH VIÊN ĐÃ THANH TOÁN HỌC PHÍ'})
        }
    }
    return res.json({type:0,message:'MÃ SỐ SINH VIÊN KHÔNG HỢP LỆ'})
}

async function paymentGET(req, res) {
        var userInfo = await userModel.findOne({ username: req.data.username })
        var {fullName,phone,email,balance}=userInfo
        res.render('payment',{user:{fullName,phone,email,balance}})
    }




async function paymentPOST(req, res) {

    //infor student
    var tuitionInfor=await tuitionModel.findOne({studentID:req.body.studentID})
    var userInfo = await userModel.findOne({username:req.data.username})
    console.log(req.body)

    if (tuitionInfor.isPaid) {
        res.json({message:'Sinh viên đã thanh toán học phí'})
        return
    }

    if(tuitionInfor.amountPayable>userInfo.balance){
        return res.json({message:'Số dư không đủ'})
    }

    //check infor
    var otp = Math.floor(((Math.random()*(0.9-0.1)+0.1) * 1000000))
    var getOTP = await otpModel.findOne({otp:otp})
    //send mail
    while (getOTP) {
        otp = Math.floor(((Math.random()*(0.9-0.1)+0.1) * 1000000))
        getOTP = await otpModel.findOne({otp:otp})
    }
    new otpModel({
        email:req.data.email,
        otp:otp,
        payFor:req.body.studentID
    }).save()
    console.log(otp)
    setTimeout(async ()=>{
        await otpModel.deleteOne({otp:otp})
        console.log('delete success')
    },1*60*1000)
    const options = {
        subject: "XÁC NHẬN THANH TOÁN",
        text: `Mã xác nhận của bạn là : ${otp}.

Mã xác nhận này có hiệu lực 1 phút . 
Vui lòng không chia sẻ mã này với bất kì ai khác`,
        to: req.data.email,
    };
    req.session.isSendOTP=true
    res.redirect('/confirm-otp')
    var isSendMail = await sendMail(options)
    console.log(isSendMail)
}

module.exports = {
    paymentGET,
    GETTuitionInfor,
    paymentPOST
}