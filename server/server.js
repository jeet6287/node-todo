var express = require('express');
var bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/Todos');

//var {Users} = require('./models/Users');
var app = express();
// middleware
app.use(bodyParser.json());

app.post('/todos',(req,res)=>{
   var todo = new Todo({
     "text":req.body.text
   });
   todo.save().then((doc)=>{
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
})

app.listen(3000,()=>{
  console.log('server listen to port 3000');
});

module.exports = {app};
