require('./config/config');
const _ = require('lodash');
var express = require('express');
var bodyParser = require('body-parser');

var {ObjectId} = require('mongodb');
var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/Users');
var {appuser} = require('./models/myuser');
var {authenticate} = require('./middleware/authenticate');


var app = express();
const port = process.env.PORT||3000
// middleware
app.use(bodyParser.json());

app.post('/myuser',(req,res) => {
  var body = _.pick(req.body,['email','password']);
  var _user = new appuser(body);
   _user.save().then(() => {
     return _user.generateAuthTokens();
   }).then((token)=>{
     res.header('x-auth',token).send(_user);
   }).catch((e)=>{
     res.status(400).send(e);
   })
});

app.post('/myuser/login',(req,res) =>{
  var body = _.pick(req.body, ['email', 'password']);
  appuser.findByCredentials(body.email,body.password).then((user) => {
     return user.generateAuthToken().then((token) => {
       res.header('x-auth',token).send(user);
     });
  }).catch((e) => {
    res.status(400).send();
  });
});

app.delete('/myuser/me/token',authenticate,(req,res) => {
   req.user.removeToken(res.token).then(()=>{
     res.status(200).send();
   },()=>{
     res.status(400).send();
   })
});

app.get('/myuser/me',authenticate,(req,res)=> {
   res.status(200).send(req.user);
});

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

app.post('/todos',authenticate,(req,res)=>{
   var todo = new Todo({
     text:req.body.text,
     author:req.user._id
   });
   todo.save().then((doc)=> {
     res.status(200).send(doc);
   },(e)=>{
     res.status(400).send();
   })
});

app.get('/todos', authenticate,(req,res) => {
  Todo.find({
    author: req.user._id
  }).then((todos) => {
    res.status(200).send({todos});
  }, (e) => {
    res.status(400).send(e);
  });
});

app.get('/todos/:tid',authenticate,(req,res) =>{
    var id = req.params.tid;
    if(!ObjectId.isValid(id)){
        return res.status(404).send();
    }
    Todo.findOne({
      _id:id,
      author:req.user._id
    }).then((todo)=> {
      if(!todo){
        return res.status(404).send(e);
      }
      res.send({todo});
    }).catch((e)=>{
       res.status(400).send();
    })
});

app.delete('/todos/:tid',authenticate,(req,res)=>{
    var id = req.params.tid;
    if(!ObjectId.isValid(id)){
        return res.status(404).send();
    }
    Todo.findOneAndRemove({
      _id:id,
      author:req.user._id
    }).then((todo)=>{
      if(!todo){
        return res.status(404).send(e);
      }
      res.send({todo})
    }).catch((e)=>{
      res.status(404).send();
    })
});

app.patch('/todos/:tid',authenticate,(req,res)=> {
  var id = req.params.tid;
  var body = _.pick(req.body,['text','completed']);
  if(!ObjectId.isValid(id)){
       return res.status(404).send();
  }
  if(_.isBoolean(body.completed) && body.completed){
       body.completedAt = new Date().getTime();
  }else{
       body.completed = false;
       body.completedAt = null;
  }
  Todo.findOneAndUpdate({_id:id,author:req.user._id},{$set: body},{new:true}).then((todo)=>{
     if(!todo){
       return res.status(404).send();
     }
     res.status(200).send({todo});
  }).catch((e) => {
    return res.status(400).send();
  })
});

app.delete('/users/:userid',(req,res)=>{
   var userId = req.params.userid;
   if(!ObjectId.isValid(userId)){
       return res.status(404).send();
   }

   User.findByIdAndRemove(userId).then((user)=>{
     if(!user){
       return res.status(404).send();
     }
     res.status(200).send({user})
   }).catch((e)=>{
     res.status(400).send();
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

app.listen(port,()=>{
  console.log(`server listen to port ${port}`);
});

module.exports = {app};
