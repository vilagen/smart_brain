const jwt = require('jsonwebtoken');
const redis = require("redis");
const redisClient = redis.createClient(process.env.REDIS_URI);

// const handleRegister = (req, res, db, bcrypt) => {
//   const { email, name, password } = req.body;
//   if (!email || !name || !password) {
//     return res.status(400).json('incorrect form submission');
//   }
//   const hash = bcrypt.hashSync(password);
//     db.transaction(trx => {
//       trx.insert({
//         hash: hash,
//         email: email
//       })
//       .into('login')
//       .returning('email')
//       .then(loginEmail => {
//         return trx('users')
//           .returning('*')
//           .insert({
//             email: loginEmail[0],
//             name: name,
//             joined: new Date()
//           })
//           .then(user => {
//             res.json(user[0]);
//             // createSessions(user[0]);
//           })
//       })
//       .then(trx.commit)
//       .catch(trx.rollback)
//     })
//     .catch(err => res.status(400).json('unable to register, but is hitting router. ' + err))
// }

const handleRegister = (req, res, db, bcrypt) => {
  const { email, name, password } = req.body;
  if (!email || !name || !password) {
    return res.status(400).json('incorrect form submission');
  }
  const hash = bcrypt.hashSync(password);
    db.transaction(trx => {
      trx.insert({
        hash: hash,
        email: email
      })
      .into('login')
      .returning('email')
      .then(loginEmail => {
        return trx('users')
          .returning('*')
          .insert({
            email: loginEmail[0],
            name: name,
            joined: new Date()
          })
          .then(user => {
            createSessions(res, user[0])
          })
      })
      .then(trx.commit)
      .catch(trx.rollback)
    })
    .catch(err => res.status(400).json('unable to register, but is hitting router. ' + err))
}

const signToken = (email) => {
  const jwtPayload = { email };
  return jwt.sign( jwtPayload, 'JWT_SECRET', { expiresIn: '2 days' } );
};

const setToken = (key, value) => {
  return Promise.resolve(redisClient.set(key, value))
};

const createSessions = (res, user) => {
    // JWT token, return user data
    const { email, id } = user;
    const token = signToken(email);
    return setToken(token, id)
      .then(() =>  { 
        return {success: 'true', userId: id, token}
      })
      .then(session => res.json(session));
      // .then( (token, id) => {console.log(token, id) })
      // .catch(console.log);
  };

   const registerAuth = (req, res, db, bcrypt) => {
    handleRegister(req, res, db, bcrypt)
    .then(data => {
      createSessions(data[0])
   })
   .then(session => res.json(session))
   .catch(err => res.status(400).json(err));
  }


module.exports = {
  handleRegister: handleRegister,
  redisClient: redisClient,
};


