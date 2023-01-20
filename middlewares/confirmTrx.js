var tuitionModel = require('../models/tuitionInfor')
var userModel = require('../models/user')
var sendMail = require('../service/sendMail')
var connect = require('../config/connectDB')
var otpModel = require('../models/otp')

function otpGET(req, res) {
  //render screen confirm otp
  if (req.session.isSendOTP) {
    var email = req.data.email
    return res.render('confirmOTP', { user: { email } })
  }
  res.redirect('/payment')
}


async function otpPOST(req, res) {
  console.log(req.data)

  var validOTP = await otpModel.findOne({ email: req.data.email, otp: req.body.otp })
  console.log(validOTP)
  if (validOTP) {
    var status
    const session = await connect.startSession();                         
    try {
      session.startTransaction()
      var balanceInSession = await userModel.findOne({username:req.data.username}).session(session)
      var updateTuition = await tuitionModel.findOneAndUpdate({studentID:validOTP.payFor},{isPaid:true},{session})
      var updateBalance = await userModel.findOneAndUpdate({username:req.data.username},{$inc:{balance:-(updateTuition.amountPayable)}},{session})
      
      if(updateTuition.isPaid){
        throw new Error('sinh vien da thanh toan hoc phi')
      }
      if(updateBalance.balance<validOTP.amountPayable){
        throw new Error('khong du tien')
      }
      if(updateBalance.balance!=balanceInSession.balance){
        throw new Error('dang co giao dich khac')
      }

      await session.commitTransaction();
      status=true
      req.session.message={
        type:1,
        'message':'GIAO DỊCH THÀNH CÔNG'
    }
    console.log('success')
    
    }
    catch (e) {
      console.log(e.message)
      await session.abortTransaction();
      req.session.message={
        type:0,
        'message':'ĐÃ CÓ LỖI XẢY RA VUI LÒNG THỬ LẠI'
    }
      status=false
    }
    finally{
      session.endSession();
      await userModel.updateOne({ username: req.data.username }, {
        $push: {
          historyTrx: {
            typeTrx: 'THANH TOÁN HỌC PHÍ',
            studentID: validOTP.payFor,
            'status': status,
            amountPayable: updateTuition.amountPayable,
            createAt: Date.now()
          }
        }
      })
      if(status){
        const options = {
          subject: "THANH TOÁN THÀNH CÔNG",
          text: `Giao dịch thanh toán học phí cho sinh viên${validOTP.payFor} 
          với số tiền ${updateTuition.amountPayable} thành công. Cảm ơn bạn đã sử dụng dịch vụ`,
          to: req.data.email,
      };
          await sendMail(options)
          console.log('success')
      }
      res.redirect('/payment')
    }

  }
  else{
    req.session.message={
      'status':0,
      'message':'MÃ OTP KHÔNG HỢP LỆ'
  }
    res.redirect('/confirm-otp')
  }
}


module.exports = {
  otpPOST,
  otpGET
}