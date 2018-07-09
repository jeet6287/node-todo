var mongoose = require('mongoose');
var customValidator = require('validator');
var jwt = require('jsonwebtoken');
var _ = require('lodash');

var Schema = mongoose.Schema;
var UserSchema = new Schema({
    email:{
      type:String,
      required:true,
      unique:true,
      validate:{
        validator:(value)=>{
          return customValidator.isEmail(value);
        },
        message: '{value} is not a valid email id!'
      }
    },
    password:{
      type:String,
      required:true,
      minlength:6
    },
    tokens:[{
      access:{
        type:String,
        required:true
      },
      token:{
        type:String,
        required:true
      }
    }]
});

// instance methods

UserSchema.methods.toJSON = function() {
  var user = this;
  var userObject = user.toObject();
  return _.pick(userObject,['_id','email']);
};

UserSchema.methods.generateAuthTokens = function() {
   var currentSingleUser = this;
   var access = "auth"
   var token = jwt.sign({_id:currentSingleUser._id.toHexString(),access},'abc123').toString();
   currentSingleUser.tokens.push({access,token});

   return currentSingleUser.save().then(()=>{
      return token;
   });
};

// model methods

UserSchema.statics.findByToken = function(token){
   var User = this;  // collections of schemas
   var decoded;

   try{
     decoded = jwt.verify(token,'abc123');
   }catch(e){
      return new Promise((resolve,reject)=>{
        reject();
      })
   }

   return User.findOne({
     '_id':decoded._id,
     'tokens.token':token,
     'tokens.access':'auth'
   });
};

var appuser = mongoose.model('appUser',UserSchema);

module.exports = {appuser};
