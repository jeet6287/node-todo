var {ObjectId} = require('mongodb');
var {Todo} = require('./../../models/todo');
var {appuser} = require('./../../models/myuser');
var jwt = require('jsonwebtoken');


const userOneId = new ObjectId();
const userTwoId = new ObjectId();

const users = [{
    _id: userOneId,
    email:"jitendra@abc.com",
    password:"useronepass",
    tokens:[{
      access:'auth',
      token:jwt.sign({_id:userOneId,access:'auth'},'abc123').toString()
    }]
},{
  _id: userTwoId,
  email:"jitendra12@abc.com",
  password:"usetwopass",
  tokens:[{
    access:'auth',
    token:jwt.sign({_id:userTwoId,access:'auth'},'abc123').toString()
  }]
}]

const todos = [{
  _id: new ObjectId(),
  'text':'First test todo 1',
  author:userOneId
},{
  _id: new ObjectId(),
  'text':'Second test todo 2',
  'complete':true,
  'completedAt':1234,
  author:userOneId
}];

const populateTodos = (done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(todos);
  }).then(() => done());
};

const populateUsers = (done) => {
   appuser.remove({}).then(()=> {
     var userOne = new appuser(users[0]).save();
     var userTwo = new appuser(users[1]).save();
     return Promise.all([userOne,userTwo])
   }).then(() => done());
};

module.exports = {todos,populateTodos,users,populateUsers};
