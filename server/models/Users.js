var mongoose = require('./db/mongoose');

var Users = mongoose.model('Users',{
    name:{
      type:String,
      required:true,
      trim:true
    },
    age:{
      type :Number,
      required:true,
    }
});

module.exports = {Users};
