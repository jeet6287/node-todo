var mongoose = require('mongoose');
var customValidator = require('validator');
var jwt = require('jsonwebtoken');
var _ = require('lodash');
const bcrypt = require('bcryptjs');

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
   var token = jwt.sign({_id:currentSingleUser._id.toHexString(),access},process.env.JWT_SECRET).toString();
   currentSingleUser.tokens.push({access,token});

   return currentSingleUser.save().then(()=>{
      return token;
   });
};

UserSchema.methods.removeToken = function (token) {
  var user = this;
  return user.update({
    $pull: {
      tokens: {token}
    }
  });
};

// model methods
UserSchema.statics.findByCredentials = function(email,password) {
  var User = this;
  return User.findOne({email}).then((user) =>{
    if(!user){
       return Promise.reject();
    }
    return new Promise((resolve,reject) => {
      bcrypt.compare(password,user.password,function(err,res) {
         if(res){
           resolve(user);
         }else {
           reject();
         }
     });
   });
  });
};

UserSchema.statics.findByToken = function(token){
   var User = this;  // collections of schemas
   var decoded;

   try{
     decoded = jwt.verify(token,process.env.JWT_SECRET); 
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

UserSchema.pre('save', function(next) {
  var unitUser = this;
  if(unitUser.isModified('password')) {
     bcrypt.genSalt(10,(err,salt)=>{
       bcrypt.hash(unitUser.password,salt,(err,hash)=>{
          unitUser.password = hash;
          next();
       });
     });
  }else{
    next();
  }
});

var appuser = mongoose.model('appUser',UserSchema);

module.exports = {appuser};
