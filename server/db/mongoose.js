var mongoose = require('mongoose');
var url = process.env.MONGODB_URI||'mongodb://localhost:27017/TodoApp'
mongoose.Promise = global.Promise;
mongoose.connect(url);

module.exports = {mongoose};
