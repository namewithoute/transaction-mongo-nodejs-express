var mongoose =require('mongoose')

tuitionSchema=mongoose.Schema({
    studentID:String,
    studentName:String,
    amountPayable:Number,
    isPaid:Boolean,
})

tuitionModel =mongoose.model('tuitions',tuitionSchema)
module.exports=tuitionModel