const mongoose = require('mongoose');
require('./config/connectDB')
const { Schema } = mongoose;

const userSchema = Schema({
    username:String,
    password:String,
    fullName:String,
    phone:String,
    email:String,
    balance:Number,
  
});

const trxSchema = Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'users'
    },
    typeTrx:String,
    studentID:String,
    amountPayable:Number,
    status:Boolean,
    createAt:Date,
});

const userModel = mongoose.model('users', userSchema);
const trxModel = mongoose.model('trxs', trxSchema);

async function createUser(username,password,fullname,phone,email,balance){
    console.log(await userModel.create({
        username,
        password,
        fullname,
        phone,
        email,
        balance
    }))
}
async function createTransaction(username,typeTrx,studentID,amountPayable,status,createAt){
    console.log(await trxModel.create({
        user:username,
        typeTrx:typeTrx,
        studentID:studentID,
        amountPayable:amountPayable,
        status:status,
        createAt:createAt
    }))
}
// createUser('trnnam123','nam123','tran quoc nam', '0123456712','email@gmail.com',50000000)
// createTransaction('63ba8c03a6fb7ee13b43cff6','Thanh toán học phí','519h123', 10000000,true,Date.now())


// const author = new Person({
//     _id: new mongoose.Types.ObjectId(),
//     name: 'Ian Fleming',
//     age: 50
//   });
  
//   author.save(function (err) {
//     if (err) return handleError(err);
  
//     const story1 = new Story({
//       title: 'Casino Royale',
//       author: author._id    // assign the _id from the person
//     });
  
//     story1.save(function (err) {
//       if (err) return handleError(err);
//       // that's it!
//     });
//   });
async function getList(){
    var data = await trxModel.find().populate('user')
    console.log(data)
}
getList()
//   Story.
//   find().
//   populate('author').
//   exec(function (err, story) {
//     if (err) return handleError(err);
//     console.log('The author is %s', story.author.name);
//     // prints "The author is Ian Fleming"
//   });
