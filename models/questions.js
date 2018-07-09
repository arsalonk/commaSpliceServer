'use strict'; 

const mongoose = require ('mongoose');

const questionsSchema = mongoose.Schema({

  word: {type: String, required:true},
  english: {type: String, required: true},
  m: {type: Number, required: true}

});

questionsSchema.set('toObject', {
  transform: function (doc,ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  }
});



module.exports = mongoose.model('Questions', questionsSchema);