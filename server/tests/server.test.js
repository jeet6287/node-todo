var expect = require('expect');
var request = require('supertest');

var {ObjectId} = require('mongodb');

var {app} = require('./../server');
var {Todo} = require('./../models/Todos');

var {User} = require('./../models/Users');

const todos = [{
  _id: new ObjectId(),
  'text':'First test todo'
},{
  'text':'Second test todo'
}];

const users = [{
  _id: new ObjectId(),
  'name':'Jitendra kumar'
},{
  'text':'shamsher singh'
}];

beforeEach((done) => {
  Todo.remove({}).then(()=>{
    return Todo.insertMany(todos);
  }).then(()=> done());
});


describe('POST /users',()=> {
   it('should post the user in users',(done)=>{
     var name = "Rohit sharma"
     request(app)
       .post('/users')
       .send({name})
       .expect(200)
       .expect((res) =>{
         expect(res.body.name).toBe(name)
       })
       .end((err,res)=>{
         if(err){
           return done(err);
         }
         User.find({name}).then((users)=>{
           expect(users.length).toBe(1);
           expect(users[0].name).toBe(name);
           done();
         }).catch((e)=>done());
       })
   })
});

describe('POST / todos',()=> {
  it('should post the data to todos',(done)=>{
    var text = 'Test todo text';
     request(app)
       .post('/todos')
       .send({text})
       .expect(200)
       .expect((res)=>{
         expect(res.body.text).toBe(text)
       })
       .end((err,res) => {
          if(err){
            return done(err);
          }

          Todo.find({text}).then((todos) => {
            expect(todos.length).toBe(1);
            expect(todos[0].text).toBe(text);
            done();
          }).catch((e) => done(e));
       });
  });

  // it('Should not create todos invalid body data',(done) => {
  //    request(app)
  //      .post('/todos')
  //      .send({})
  //      .expect(400)
  //      .end((err,res) => {
  //        if(err){
  //          return done(err);
  //        }
  //
  //        Todo.find().then((todos) =>{
  //          expect(todos.length).toBe(2);
  //          done();
  //        }).catch((e) => done(e));
  //      })
  // });
});

describe('GET /users - todos',() => {

   it('should return user doc',(done)=>{
     request(app)
      .get(`/users/${users[0]._id.toHexString()}`)
      .expect(200)
      .expect((res)=> {
         expect(res.body.user.name).toBe(users[0].name) 
      })
      .end(done);
   });

   it('should return 404 if todo not found',(done)=>{
     var hexid = new ObjectId().toHexString();
      request(app)
        .get(`/todos/${hexid}`)
        .expect(404)
        .end(done);
   });

   it('should return 404 if non-object-ids',(done)=>{
     var hexid = new ObjectId().toHexString();
      request(app)
        .get('/todos/123abc')
        .expect(404)
        .end(done);
   });

});
