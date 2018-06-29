const myMongoClient = require('mongodb').MongoClient;

myMongoClient.connect('mongodb://localhost:27017/TodoApp',(err,client) => {
      if(err){
        return console.log('Not connected to mongo server');
      }
      console.log('Connected to mongo server');
      var db = client.db('TodoApp');
      // DELETE MANY
      // db.collection('Todos').deleteMany({text:'something to do'}).then((result)=>{
      //   console.log(result);
      // });

      // DELETE ONE
      // db.collection('Todos').deleteOne({text:'something to do'}).then((result)=>{
      //   console.log(result);
      // });

      //FINDONE AND DELETE
     // db.collection('Users').findOneAndDelete({name:'Jitendra'}).then((result)=>{
     //     console.log(result);
     // });

      //client.close();
});
