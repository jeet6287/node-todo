var env = process.env.NODE_ENV || 'development';
if(env === 'test' || env === 'development'){
  var configJson = require('./config.json');
  var envConfig = configJson[env];
  Object.keys(envConfig).forEach((key)=>{
     process.env[key] = envConfig[key];
  });
}else{

}


// if (env === 'development') {
//   process.env.PORT = 3000;
//   process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp';
// } else if (env === 'test') {
//   process.env.PORT = 3000;
//   process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest';
// }
