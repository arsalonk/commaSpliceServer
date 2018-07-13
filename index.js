'use strict';

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');

const { PORT, CLIENT_ORIGIN, DATABASE_URL } = require('./config');
const { dbConnect } = require('./db-mongoose');

const passport = require('passport');
const localStrategy = require('./passport/local');
const jwtStrategy = require('./passport/jwt');

const usersRouter = require('./routes/users');
const authRouter = require('./routes/auth');
const questionsRouter = require('./routes/questions');


const app = express();
app.use(express.json()); //parse req body

app.use(
  morgan(process.env.NODE_ENV === 'production' ? 'common' : 'dev', {
    skip: (req, res) => process.env.NODE_ENV === 'test'
  })
);

app.use(
  cors({
    origin: CLIENT_ORIGIN
  })
);



passport.use(localStrategy);
passport.use(jwtStrategy);



app.use('/api/users', usersRouter);
app.use('/auth', authRouter);
app.use('/api/questions', questionsRouter);




function runServer(port = PORT) {
  const server = app
    .listen(port, () => {
      console.info(`App listening on port ${server.address().port}`);
    })
    .on('error', err => {
      console.error('Express failed to start');
      console.error(err);
    });
}

if (require.main === module) {
  dbConnect();
  runServer();
}

// if (require.main === module) {
//   mongoose.connect(DATABASE_URL)
//     .then(instance => {
//       const conn = instance.connections[0];
//       console.info(`Connected to: mongodb://${conn.host}:${conn.port}/${conn.name}`);
//     })
//     .catch(err => {
//       console.error(`ERROR: ${err.message}`);
//       console.error('\n === Did you remember to start `mongod`? === \n');
//       console.error(err);
//     });

//   app.listen(PORT, function () {
//     console.info(`Server listening on ${this.address().port}`);
//   }).on('error', err => {
//     console.error(err);
//   });
// }

module.exports = { app };
