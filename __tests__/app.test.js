require('dotenv').config();

const { execSync } = require('child_process');

const fakeRequest = require('supertest');
const app = require('../lib/app');
const client = require('../lib/client');

describe('app routes', () => {
  describe('routes', () => {
    let token;
  
    beforeAll(async () => {
      execSync('npm run setup-db');
  
      await client.connect();
      const signInData = await fakeRequest(app)
        .post('/auth/signup')
        .send({
          email: 'jon@user.com',
          password: '1234'
        });
      
      token = signInData.body.token; // eslint-disable-line
    }, 10000);
  
    afterAll(done => {
      return client.end(done);
    });

   
    test('posts an item for todo list', async() => {

      const expectation = [
        {
          id: 5,
          chore: 'get a new bike',
          completed: false,
          owner_id: expect.any(Number),
        },
      ];

      const data = await fakeRequest(app)
        .post('/api/todo')
        .send({
         
          chore: 'get a new bike',
        
          
    
        })
        .expect('Content-Type', /json/)
        .set('Authorization', token)
        .expect(200);

      expect(data.body).toEqual(expectation);
    });

    test('gets a todo', async() => {

      const expectation = [
        { id: expect.any(Number),
          chore: 'get a new bike',
          completed: false,
          owner_id: expect.any(Number),
        }];
      

      const data = await fakeRequest(app)
        .get('/api/todo')
        .expect('Content-Type', /json/)
        .set('Authorization', token)
        .expect(200);
      console.log(data.body);
      expect(data.body).toEqual(expectation);
    });   

    test('puts a new todo', async() => {

      const expectation = 
        {
          id: expect.any(Number),
          chore: 'get a new bike',
          completed: true,
          owner_id: expect.any(Number)
        }
      ;
      const data = await fakeRequest(app)
        .put('/api/todo/5')
        .set('Authorization', token)
        .send({
          completed: true,
        })
        .expect('Content-Type', /json/)
        .expect(200);
     

      expect(data.body).toEqual(expectation);
    }); 

  });
});
