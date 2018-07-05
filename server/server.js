var express = require('express');
var bodyParser = require('body-parser');

var {ObjectId} = require('mongodb');
var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/Todos');
var {User} = require('./models/Users');

var app = express();
// middleware
app.use(bodyParser.json());

app.post('/todos',(req,res)=>{
   var todo = new Todo({
     "text":req.body.text
   });
   todo.save().then((doc)=> {
     res.send(doc);
   },(e)=>{
     res.send(e);
   })
});

app.get('/todos',(req,res)=>{
   Todo.find().then((todos) => {
     res.send({todos});
   },(e) => {
     res.status(400).send(e);
   })
});

app.post('/users',(req,res) =>{
   var user = new User({
     "name":req.body.name
   });
   user.save().then((doc)=>{
     res.send(doc);
   },(e)=>{
     res.send(e);
   })
});

app.get('/users',(req,res) => {
   User.find().then((users)=>{
     res.send({users});
   },(e)=>{
     res.status(400).send(e);
   })
})

app.get('/users/:userid',(req,res)=> {
   var userId = req.params.userid;
   if(!ObjectId.isValid(userId)){
     return res.status(404).send();
   }
  User.findById(userId).then((user)=>{
     if(!user){
         return res.status(404).send();
     }
     res.status(200).send({user}) 
  }).catch((e)=>{
    res.status(400).send();
  })
});

app.listen(3000,()=>{
  console.log('server listen to port 3000');
});

module.exports = {app};
