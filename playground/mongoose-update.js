var {ObjectId} = require('mongodb');
var {mongoose} = require('./../server/server');
var {Todo} = require('./../server/models/Todos');
var {User} = require('./../server/models/Users');

var userId = '5b3c9f200496b408514dd970';

if(!ObjectId.isValid(userId)){
  return console.log('USER ID is not valid');
}

User.findByIdAndUpdate(
   {
    _id:userId
   },
   {
     $set:{
       name:'Kumar Jitendra',
     },
     $inc:{
       age:30
     }
   },
   { returnOriginal:false }
   ).then((user) => {
  if(!user){
    return console.log('USER NOT FOUND');
  }
  console.log('User Updated ',user);
}).catch((e)=> console.log(e));
