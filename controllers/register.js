const jwt = require('jsonwebtoken');
const redis = require("redis");
const redisClient = redis.createClient(process.env.REDIS_URI);

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
            res.json(user[0]);
            createSessions(user[0]);
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

// const createSessions = (user) => {
//   // JWT token, return user data
//   const { email, id } = user;
//   const token = signToken(email);
//   return setToken(token, id)
//     .then(() =>  { 
//       return {success: 'true', userId: id, token} 
//     })
//     .catch(console.log);
// };

const createSessions = (user) => {
    // JWT token, return user data
    const { email, id } = user;
    const token = signToken(email);
    return setToken(token, id)
      .then(() =>  { 
        return {success: 'true', userId: id, token}
      })
      .catch(console.log);
  };

const getAuthTokenId = (req, res) => {
  const { authorization } = req.headers;
  return redisClient.get(authorization, (err, reply) => {
    console.log(reply)
    if (err || !reply ) {
      return res.status(400).json('Unauthorized');
    }
    return res.json({id: reply})
  });
};

const registerAuthentication = (db, bcrypt) => (req, res) => {
  const { authorization } = req.headers;
  return authorization ? getAuthTokenId(req, res) : 
    handleRegister(res, req, db, bcrypt)
      .then(data => {
         return data.id && data.email ? createSessions(data) :
         Promise.reject(data)
      })
      .then(session => res.json(session))
      .catch(err => res.status(400).json(err));
};

module.exports = {
  handleRegister: handleRegister,
  registerAuthentication: registerAuthentication,
  redisClient: redisClient,
};


