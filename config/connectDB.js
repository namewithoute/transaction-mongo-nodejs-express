var mongoose = require('mongoose')
mongoose.connect('mongodb+srv://midterm:tranquocnam123@cluster0.8fkjx.mongodb.net/soa_midterm?retryWrites=true&w=majority', {
})

const conn = mongoose.connection;

conn.on('error', () => console.error.bind(console, 'connection error'));

conn.once('open', () => console.info('Connection to Database is successful'));

module.exports = conn;