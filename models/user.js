'use strict'; 

const mongoose = require ('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({

  username: {type: String, required:true},
  password: {type: String, required: true},
  list: [
    {
      questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required:true},
      m: { type: Number, required: true, default : 1},
      next: { type: Number, required:true},
      question: String,
      answer: String
    }
  ],
  head: {type: Number, default: 0}

});

userSchema.set('toObject', {
  transform: function (doc,ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    delete ret.password;
  }
});

userSchema.methods.validatePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

userSchema.statics.hashPassword = function (password) {
  return bcrypt.hash(password, 10);
};

module.exports = mongoose.model('User', userSchema);