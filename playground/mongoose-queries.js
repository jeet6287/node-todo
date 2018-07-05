var {ObjectId} = require('mongodb');
var {mongoose} = require('./../server/server');
var {Todo} = require('./../server/models/Todos');
var {User} = require('./../server/models/Users');


var todoId = '5b3c9aa0b0e12508164dbc5c';
 var userId = '5b3c9f200496b408514dd970';

// check the id is valid or not

// if(!ObjectId.isValid(todoId)){
//   return console.log('TODO ID is not valid');
// } 

if(!ObjectId.isValid(userId)){
  return console.log('USER ID is not valid');
}


// returns all data in array find the same id

// Todo.find({
//   _id:id
// }).then((todosArray) =>{
//   console.log('todosArray ',todosArray);
// });
//
// // returns one obj data from array find the same id
//
// Todo.findOne({
//   _id:id
// }).then((todo) =>{
//    console.log('single todo object ',todo);
// });

// returns all data in array find the same id

// Todo.findById(todoId).then((todo) =>{
//   if(!todo){
//     console.log('Id not found');
//   }
//    console.log('single todo object ',todo);
// }).catch((e) => {
//   console.log(e);
// });

User.findById(userId).then((user) =>{
  if(!user){
    return console.log('USER NOT FOUND');
  }
   console.log('USER found ',user);
}).catch((e)=>{
   console.log(e);
})
