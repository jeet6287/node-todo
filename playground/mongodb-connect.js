const myMongoClient = require('mongodb').MongoClient;

myMongoClient.connect('mongodb://localhost:27017/TodoApp',(err,client) => {
      if(err){
        return console.log('Not connected to mongo server');
      }
      console.log('Connected to mongo server');
      var db = client.db('TodoApp');
      db.collection('Users').insertOne({
        name:'Jitendra',
        age:30,
        location:'delhi'
      },(err,result)=>{
         if(err){
           return console.log('unable to insert into a users');
         }
         console.log(JSON.stringify(result,undefined,2));
      })
      // var db = client.db('TodoApp');
      // db.collection('Todos').insertOne({
      //   text:'something to do',
      //   completed:false
      // },(err,result) =>{
      //   if(err){
      //     return console.log('Not insert to todos collections');
      //   }
      //   console.log(JSON.stringify(result));
      // });
      client.close();
});
