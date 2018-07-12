var expect = require('expect');
var request = require('supertest');
var {ObjectId} = require('mongodb');
var {app} = require('./../server');
var {Todo} = require('./../models/todo');
var {User} = require('./../models/Users');
var {appuser} = require('./../models/myuser');
var {todos,populateTodos,users,populateUsers} = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST / todos',()=> {
  it('should create a new todo',(done)=>{
    var text = 'Test todo text';
     request(app)
       .post('/todos')
       .set('x-auth',users[0].tokens[0].token)
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

  it('Should not create todos with invalid body data',(done) => {
     request(app)
       .post('/todos')
       .set('x-auth',users[0].tokens[0].token)
       .send({})
       .expect(400)
       .end((err,res) => {
         if(err){
           return done(err);
         }
         Todo.find().then((todos) =>{
           expect(todos.length).toBe(2);
           done();
         }).catch((e) => done(e));
       });
  });
});

describe('GET /todos',()=>{
  it('should get all todos',(done)=>{
     request(app)
      .get('/todos')
      .set('x-auth',users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(1);
      })
      .end(done);
  });
});

describe('GET /todos/tid',() => {
  it('should return todo doc',(done)=>{
     request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .set('x-auth',users[0].tokens[0].token)
      .expect(200)
      .expect((res)=>{
        expect(res.body.todo.text).toBe(todos[0].text);
      })
      .end(done);
  });

  it('should not return todo doc created by other',(done)=>{
     request(app)
      .get(`/todos/${todos[1]._id.toHexString()}`)
      .set('x-auth',users[1].tokens[0].token)
      .expect(400)
      .end(done);
  });

  it('should return 404 if todo not found',(done)=>{
     var tId = new ObjectId().toHexString();
     request(app)
      .get(`/todos/${tId}`)
      .set('x-auth',users[0].tokens[0].token)
      .expect(400)
      .end(done);
  });
  it('should return 404 for non object ids',(done)=>{
    request(app)
     .get('/todos/123abc')
     .set('x-auth',users[0].tokens[0].token)
     .expect(404)
     .end(done);
  });
});

describe('DELETE /todos/tid',()=>{
  it('should remove a todo',(done)=>{
    //this.timeout(10000);
    var hexId = todos[0]._id.toHexString();
    request(app)
      .delete(`/todos/${hexId}`)
      .set('x-auth',users[0].tokens[0].token)
      .expect(200)
      .expect((res)=>{
        expect(res.body.todo._id).toBe(hexId);
      })
      .expect((err,res) =>{
         if(err){
           return done(err);
         }
         Todo.findById(hexId).then((todo)=>{
           expect(todo).toNotExist();
           done();
         }).catch((e)=> done(e));
      });
  });

  it('should not remove todo created by other',(done)=>{
    //this.timeout(10000);
    var hexId = todos[0]._id.toHexString();
    request(app)
      .delete(`/todos/${hexId}`)
      .set('x-auth',users[1].tokens[0].token)
      .expect(404)
      .expect((err,res) =>{
         if(err){
           return done(err);
         }
         Todo.findById(hexId).then((todo)=>{
           expect(todo).toExist();
           done();
         }).catch((e)=>{
           done(e);
         })
      })
  });

  it('should return 404 if todo not found',(done)=>{
      var id = new ObjectId().toHexString();
      request(app)
       .delete(`/todos/${id}`)
       .set('x-auth',users[1].tokens[0].token)
       .expect(404)
       .end(done);
  });

  it('should return 404 if non objects ids', (done)=>{
      request(app)
       .delete('/todos/123abc')
       .set('x-auth',users[1].tokens[0].token)
       .expect(404)
       .end(done);
  });
});

  describe('PATCH/ todos',() => {
    it('should update the todo',(done) => {
       var tid = todos[0]._id.toHexString();
       var text = "updated text from postman";
         request(app)
          .patch(`/todos/${tid}`)
          .set('x-auth',users[0].tokens[0].token)
          .send({
            completed:true,
            text
          })
          .expect(200)
          .expect((res)=>{
            expect(res.body.todo.text).toBe(text);
            expect(res.body.todo.completed).toBe(true);
            expect(res.body.todo.completedAt).toBeA('number');
          })
          .end(done);
    });

    it('should not update todo created by other',(done)=>{
      var tid = todos[0]._id.toHexString();
      var text = "updated text from postman";
        request(app)
         .patch(`/todos/${tid}`)
         .set('x-auth',users[1].tokens[0].token)
         .send({
           completed:true,
           text
         })
         .expect(404)
         .end(done);
    });

    it('should clear completedAt when todo is not complete',(done) => {
        var tid = todos[1]._id.toHexString();
        var text = "updated text from postman2";
        request(app)
          .patch(`/todos/${tid}`)
          .set('x-auth',users[1].tokens[0].token)
          .send({
            completed:false,
            text
          })
          .expect(200)
          .expect((res) => {
            expect(res.body.todo.text).toBe(text);
            expect(res.body.todo.completed).toBe(false);
          })
          .end(done);
    });
  });

  describe('POST /myusers',()=> {
    var body = {
      "email":"jitendra@gmail.com",
      "password":'123asdf'
    };

    it('should create a user ',(done) => {
       request(app)
         .post('/myuser')
         .send(body)
         .expect(200)
         .expect((res)=> {
           expect(res.headers['x-auth']).toExist();
           expect(res.body._id).toExist();
           expect(res.body.email).toBe(body.email);
         })
         .end((err) => {
           if(err) {
             return done(err)
           }
           var email = body.email;
           appuser.find({email}).then((user) => {
             expect(user).toExist();
             expect(user.password).toNotBe(body.password);
             done();
           }).catch((e)=>{
             done(e);
           })
         });
    });

    it('should return validation errors if request is invalid',(done) => {
        var email = "jitegmail.com";
        var password = '1';
        request(app)
         .post('/myuser')
         .send({email,password})
         .expect(400)
         .end(done)
    });

    it('should not create a user if email is in use',(done)=>{
       var existingMailId = users[0].email;
       request(app)
        .post('/myuser')
        .send({existingMailId})
        .expect(400)
        .end(done)
    });
  });

  describe('GET /myuser/me',()=> {
    it('should return 401 if not authenticated',(done) => {
        request(app)
         .get('/myuser/me')
         .expect(401)
         .expect((res) => {
           expect(res.body).toEqual({});
         })
         .end(done)
    });

     it('should return user if authenticated',(done) => {
        request(app)
          .get('/myuser/me')
          .set('x-auth',users[0].tokens[0].token)
          .expect(200)
          .expect((res)=> {
            expect(res.body._id).toBe(users[0]._id.toHexString())
            expect(res.body.email).toBe(users[0].email)
          })
          .end(done)
     });
  });

  describe('POST /myuser/login',()=> {
     it('should login user and return token',(done)=>{
       var email = users[1].email;
       var password = users[1].password;
       request(app)
        .post('/myuser/login')
        .send({email,password})
        .expect(200)
        .expect((res) =>{
          expect(res.headers['x-auth']).toExist();
        })
        .end((err,res)=>{
           if(err){
             return done(err);
           }
           appuser.findById(users[1]._id).then((user) => {
             expect(user.tokens[1]).toInclude({
               access:'auth',
               token:res.headers['x-auth']
             })
             done();
           }).catch((e) => done(e));
        });
     });

     it('should reject invalid login not create tokens',(done)=>{
       var email = users[1].email;
       var password = users[1].password+'123';
       request(app)
        .post('/myuser/login')
        .send({email,password})
        .expect(400)
        .expect((res) => {
          expect(res.headers['x-auth']).toNotExist();
        })
        .end((err,res) => {
           if(err){
             return done(err);
           }
           appuser.findById(users[1]._id).then((user) => {
             expect(user.tokens.length).toBe(1);
             done();
           }).catch((e) => done(e));
        });
     });
  });

  describe('DELETE /myuser/me/token',()=>{
   it('should remove auth token on logout',(done)=>{
      request(app)
      .delete('/myuser/me/token')
      .set('x-auth',users[0].tokens[0].token)
      .expect(200)
      .end((err,res)=>{
         if(err){
           return done(err)
         }
         appuser.findById(users[0]._id).then((user)=>{
           expect(user.tokens.length).toBe(0);
           done();
         }).catch((e)=> done(e));
      });
   });
  });


// describe('GET /users - todos',() => {
//
//    it('should return user doc',(done)=>{
//      request(app)
//       .get(`/users/${users[0]._id.toHexString()}`)
//       .expect(200)
//       .expect((res)=> {
//          expect(res.body.user.name).toBe(users[0].name)
//       })
//       .end(done);
//    });
//
//    it('should return 404 if todo not found',(done)=>{
//      var hexid = new ObjectId().toHexString();
//       request(app)
//         .get(`/todos/${hexid}`)
//         .expect(404)
//         .end(done);
//    });
//
//    it('should return 404 if non-object-ids',(done)=>{
//      var hexid = new ObjectId().toHexString();
//       request(app)
//         .get('/todos/123abc')
//         .expect(404)
//         .end(done);
//    });
// });

// describe('DELETE /users',()=>{
//   it('should remove the user',(done)=>{
//     var hexId = users[0]._id.toHexString();
//     request(app)
//      .delete(`/users/${hexId}`)
//      .expect(200)
//      .expect((res)=>{
//        expect(res.body.user._id).toBe(hexId)
//      })
//      .end((err,res)=>{
//         if(err){
//           return done(err);
//         }
//         User.findById({hexId}).then((user) =>{
//           expect(user).toNotExit();
//           done();
//         }).catch((e)=> done(e));
//      });
//   });
//
//   it('should return 404 if user not found and delete',(done)=>{
//     var hexId = new ObjectId().toHexString();
//     request(app)
//      .delete(`/users/${hexId}`)
//      .expect(404)
//      .end(done);
//   });
//
//   it('should return 404 if non-object ids',(done)=>{
//      request(app)
//        .delete('/users/abc123d123')
//        .expect(404)
//        .end(done);
//   });

// describe('POST /users',()=> {
//    it('should post the user in users',(done)=>{
//      var name = "Rohit sharma"
//      request(app)
//        .post('/users')
//        .send({name})
//        .expect(200)
//        .expect((res) =>{
//          expect(res.body.name).toBe(name)
//        })
//        .end((err,res)=>{
//          if(err){
//            return done(err);
//          }
//          User.find({name}).then((users)=>{
//            expect(users.length).toBe(1);
//            expect(users[0].name).toBe(name);
//            done();
//          }).catch((e)=>done());
//        })
//    })
// });
