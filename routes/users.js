'use strict';

const express = require('express');
const router = express.Router();
const passport = require('passport')

router.use('/', passport.authenticate('jwt', { session: false, failWithError: true }));

const User = require('../models/user')

router.get('/', (req, res, next) => {
  User.find()
    .sort('name')
    .then(results => {
      res.json(results);
    })
    .catch(err => next(err));
});

router.get('/:id', (req, res, next) => {
  const { id } = req.params;
  User.findOne({ _id: id })
    .then(results => {
      res.json(results.list[results.head]);
    })
    .catch(err => next(err));
});

router.put('/:id', (req, res, next) => {
  const { id } = req.params;
  const { head } = req.body;
  const updateUser = { head };
  User.findOneAndUpdate({ _id: id }, updateUser, { new: true })
    .then(result => {
      if (result) {
        res.json(result);
      } else {
        next();
      }
    })
    .catch(err => {
      next(err);
    });
});

router.post('/answer', (req, res, next) => {
  const userId = req.user.id;
  const { answer } = req.body;
  User.findById(userId)
    .then(user => {
      const head = user.head;
      const question = user.list[head];
      if (answer === question.answer) {
        question.m *= 2;
      } else {
        question.m = 1;
      }

      let count = question.m;
      let currentQ = question;
      if (count > user.list.length-1) {
        count = user.list.length-1;
      }
      while (count) {
        currentQ = user.list[currentQ.next];
        count--;
      }

      user.head = question.next;
      question.next = currentQ.next;
      currentQ.next = head;
      return user.save();
    })
    .then(user => res.json(user))
    .catch(err => next(err));
})

module.exports = router;