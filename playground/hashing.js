const _hash = require('crypto-js');
const jwt = require('jsonwebtoken');

// jwt.sign(); // creates token encoded takes object with secret
// jwt.verify();

// var message = "i a user number 10";
// console.log("message ",message);
// console.log("hash message ",_hash.SHA256(message).toString());
//
// var data = {
//   id : 10
// };
//
// var token = {
//   data,
//   hash: _hash.SHA256(JSON.stringify(data)+'12345').toString()
// };
//
// token.data.id = 11;
// token.hash = _hash.SHA256(JSON.stringify(data)).toString()
//
// var result_hash = _hash.SHA256(JSON.stringify(token.data)+'12345').toString();
//
// if(result_hash == token.hash){
//   console.log('data not manipulated');
// }else{
//   console.log('data manipulated,not trust');
// }
