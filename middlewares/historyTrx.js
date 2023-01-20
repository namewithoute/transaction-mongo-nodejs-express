var userModel = require('../models/user')
var moment = require('moment');
const redis=require('redis')
const client = require('../config/connectRedis')


const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'VND',

});

async function historyTrx(req, res) {
    var user = await userModel.findOne({ username: req.data.username })
    var { historyTrx } = user
    var format = []
    var getFromCache= await client.get('trx')
    if(!getFromCache){
        historyTrx.forEach((trx) => {
            var { typeTrx, amountPayable, status, createAt, _id, studentID } = trx
            createAt = moment(createAt).format('MMMM Do YYYY, h:mm:ss a')
            amountPayable = formatter.format(amountPayable)
            id = _id.toString()
            status = status ? 'THÀNH CÔNG' : 'THẤT BẠI'
            format.push({ typeTrx, amountPayable, status, createAt, id, studentID })
        })
        console.log('get from db')
        await client.set('trx',JSON.stringify(format))
    }
    else{
        console.log('get from cache')
        format=JSON.parse(getFromCache)
    }
  
    res.render('historyTrx', { history: format })
}


module.exports = historyTrx