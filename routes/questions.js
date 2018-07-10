'use strict';

const express = require('express');
const router = express.Router();
const passport = require('passport')

const Questions = require('../models/questions')

router.use('/', passport.authenticate('jwt', { session: false, failWithError: true }));

router.get('/', (req, res, next) => {
  Questions.find()
    .then(results => {
      res.json(results);
    })
    .catch(err => next(err));
});

module.exports = router;