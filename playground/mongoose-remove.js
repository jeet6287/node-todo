var {ObjectId} = require('mongodb');
var {mongoose} = require('./../server/server');
var {Todo} = require('./../server/models/Todos');
var {User} = require('./../server/models/Users');


var userId = '5b3ddb8bddce2e05b530853c';

if(!ObjectId.isValid(userId)){
  return console.log('USER ID is not valid');
}

// remove
// findOneAndRemove
// findByIdAndRemove

User.findByIdAndRemove(userId).then((user) =>{
  if(!user){
    return console.log('USER NOT FOUND');
  }
   console.log('USER found ',user);
}).catch((e)=>{
   console.log(e);
})
