const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

require('dotenv').config();
const pgPassword = process.env.DB_PASS;

const db = knex({
  client: 'pg',
  connection: {
    host : 'localhost',
    user : 'postgres',
    password : pgPassword,
    database : 'smartbrain'
  }
});

// const db = knex({
//   client: 'mysql',
//   connection: {
//     host : 'localhost',
//     user : 'root',
//     password : 'password',
//     database : 'smartbrain'
//   }
// });

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res)=> { res.send(db.users) });
app.post('/signin', signin.handleSignin(db, bcrypt));
app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) });
app.get('/profile/:id', (req, res) => { profile.handleProfileGet(req, res, db)});
app.put('/image', (req, res) => { image.handleImage(req, res, db)});
app.post('/imageurl', (req, res) => { image.handleApiCall(req, res)});

app.listen(3001, ()=> {
  console.log('app is running on port 3001');
});
