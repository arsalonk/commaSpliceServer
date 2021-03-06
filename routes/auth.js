'use strict';

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');


const passport = require('passport');
const localStrategy = require('../passport/local');
const jwtStrategy = require('../passport/jwt');

const { JWT_SECRET, JWT_EXPIRY } = require('../config');

const User = require('../models/user')
const Questions = require('../models/questions')


const options = { session: false, failWithError: true };

const localAuth = passport.authenticate('local', options);

function createAuthToken (user) {
  return jwt.sign({ user }, JWT_SECRET, {
    subject: user.username,
    expiresIn: JWT_EXPIRY
  });
}

router.post('/login', localAuth, (req, res) => {
  const authToken = createAuthToken(req.user);
  res.json({ authToken });
});

router.post('/register', (req, res) => {
  let {username, password } = req.body;

  return User.find({username})
    .count()
    .then(count => {
      if (count > 0) {
        // There is an existing user with the same username
        return Promise.reject({
          code: 422,
          reason: 'ValidationError',
          message: 'Username already taken',
          location: 'username'
        });
      }

      // If there is no existing user, hash the password
      return Promise.all([User.hashPassword(password), Questions.find()])
    })
    .then(([hash, questions]) => {
      let qMap = questions.map((q,i) => {
        let next;
        if(i >= questions.length-1){
          next = 0
        } else {
          next = i + 1
        }
        return {
          questionId: q._id,
          question: q.question,
          next,
          answer: q.answer,
          pronounce: q.pronounce
        }
      })
      return User.create({
        username,
        password: hash,
        list: qMap,
        
      });
    })
    .then(user => {
      return res.status(201).json(user);
    })
    .catch(err => {
      // Forward validation errors on to the client, otherwise give a 500
      // error because something unexpected has happened
      if (err.reason === 'ValidationError') {
        return res.status(err.code).json(err);
      }
      res.status(500).json({code: 500, message: 'Internal server error'});
    });
})

const jwtAuth = passport.authenticate('jwt', { session: false, failWithError: true });

router.post('/refresh', jwtAuth, (req, res) => {
  const authToken = createAuthToken(req.user);
  res.json({ authToken });
});

module.exports = router;