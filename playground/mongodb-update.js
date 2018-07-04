const myMongoClient = require('mongodb').MongoClient;

myMongoClient.connect('mongodb://localhost:27017/TodoApp',(err,client) => {
      if(err){
        return console.log('Not connected to mongo server');
      }
      console.log('Connected to mongo server');
      var db = client.db('TodoApp');
      // FIND AND UPDATE WITH MONGO UPDATE OPERATORS
      db.collection('Users').findOneAndUpdate({
        name:'abhi'
      },
      {
        $set:{
          name:'Abhimanyu',
        }
      },
      { returnOriginal:false }
    ).then((result) => {
      console.log(result);
    });
    //client.close();
});
