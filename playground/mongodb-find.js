const myMongoClient = require('mongodb').MongoClient;

myMongoClient.connect('mongodb://localhost:27017/TodoApp',(err,client) => {
      if(err){
        return console.log('Not connected to mongo server');
      }
      console.log('Connected to mongo server');
      var db = client.db('TodoApp');

      db.collection('Todos').find({'text':'something to do'}).toArray().then((docs)=>{
        console.log('Docs ',JSON.stringify(docs,undefined,2));
      },(err)=>{
        console.log('unable to find the data');
      });

      // db.collection('Users').find().toArray().then((docs)=>{
      //   console.log('User Docs ',JSON.stringify(docs,undefined,2));
      // },(err)=>{
      //   console.log('unable to find the user data');
      // });

      //client.close();
});
