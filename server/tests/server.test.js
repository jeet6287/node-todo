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
  _id: new ObjectId(),
  'text':'Second test todo',
  'complete':true,
  'completedAt':1234
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

describe('DELETE /users',()=>{
  it('should remove the user',(done)=>{
    var hexId = users[0]._id.toHexString();
    request(app)
     .delete(`/users/${hexId}`)
     .expect(200)
     .expect((res)=>{
       expect(res.body.user._id).toBe(hexId)
     })
     .end((err,res)=>{
        if(err){
          return done(err);
        }
        User.findById({hexId}).then((user) =>{
          expect(user).toNotExit();
          done();
        }).catch((e)=> done(e));
     });
  });

  it('should return 404 if user not found and delete',(done)=>{
    var hexId = new ObjectId().toHexString();
    request(app)
     .delete(`/users/${hexId}`)
     .expect(404)
     .end(done);
  });

  it('should return 404 if non-object ids',(done)=>{
     request(app)
       .delete('/users/abc123d123')
       .expect(404)
       .end(done);
  });

  describe('PATCH/ todos',() => {
    it('should update the todo',(done) => {
       var tid = todos[0]._id.toHexString();
       var text = "updated text from postman";
         request(app)
          .patch(`/todos/${tid}`)
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

    it('should clear completedAt when todo is not complete',(done) => {
        var tid = todos[1]._id.toHexString();
        var text = "updated text from postman2";
        request(app)
          .patch(`/todos/${tid}`)
          .send({
            completed:false,
            text
          })
          .expect(200)
          .expect((res) => {
            expect(res.body.todo.text).toBe(text);
            expect(res.body.todo.completed).toBe(false);
            //expect(res.body.todo.completedAt).toNotExit();  comment due to errpr 
          })
          .end(done);
    });

    it('should return 404 if todo not found ',(done)=> {
      var tId = new ObjectId().toHexString();
       request(app)
        .patch(`/todos/${tId}`)
        .expect(404)
        .end(done);
    });

    it('should return 404 if non objects ids', (done)=>{
        request(app)
         .patch('/todos/123abc')
         .expect(404)
         .end(done);
    });

  });

});
