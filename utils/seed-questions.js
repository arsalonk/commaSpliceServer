'use strict';
require('dotenv').config();
const mongoose = require('mongoose');
const { DATABASE_URL } = require('../config');

const questions = require('../models/questions');
const seedQuestions = require('../DB/seed/questions');

mongoose.connect(DATABASE_URL)
  .then(() => {
    mongoose.connection.db.collection('questions').drop();
    console.log(DATABASE_URL);
  })
  .then(() => {
    return Promise.all([
      questions.insertMany(seedQuestions),
      questions.createIndexes()
    ]);
  })
  .then(() => mongoose.disconnect())
  .catch(err => {
    console.error(`ERROR: ${err.message}`);
    console.error(err);
  });