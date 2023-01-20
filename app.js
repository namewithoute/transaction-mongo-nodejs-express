const { urlencoded } = require('express')
var express= require('express')
var dotenv=require('dotenv')
// var mongoose=require('mongoose')
var session = require('express-session')
dotenv.config()
var app = express()
var cookieParser = require('cookie-parser')
var {routeIndex}=require('./routes')
// mongoose.connect('mongodb://localhost:27017/soa_midterm')
require('./config/connectDB')
app.set('view engine','ejs')
app.use(express.static(__dirname+'/public'))
app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(cookieParser())
app.use(session({
    secret: process.env.SECRET_KEY_SESSION,
    resave: true,
    saveUninitialized: true,
}))





app.use((req,res,next)=>{
    if(req.session.message){
    res.locals.message=req.session.message
    delete req.session.message
    }
    next()
})


routeIndex(app)



app.listen(process.env.PORT||3000,()=>{
    console.log(`listen at port ${process.env.PORT||3000}`)
})