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

module.exports = router;