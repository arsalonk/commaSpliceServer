'use strict'; 

const mongoose = require ('mongoose');

const questionsSchema = mongoose.Schema({

  question: {type: String, required:true},
  pronounce: {type: String, required:true},
  answer: {type: String, required: true}
  
});

questionsSchema.set('toObject', {
  transform: function (doc,ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  }
});



module.exports = mongoose.model('Questions', questionsSchema);