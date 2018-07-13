'use strict';

const { app } = require('../index');
const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');

const { TEST_DATABASE_URL, JWT_SECRET } = require('../config');
const jwt = require('jsonwebtoken');

const Questions = require('../models/questions');
const seedQuestions = require('../DB/seed/questions');

const User = require('../models/user');
const seedUsers = require('../DB/seed/users');

const expect = chai.expect;
chai.use(chaiHttp);

describe('SR API - Users', function () {
  let token;
  let user;
  this.timeout(5000);
  before(function () {
    return mongoose.connect(TEST_DATABASE_URL)
      .then(() => mongoose.connection.db.dropDatabase());
  });

  beforeEach(function () {
    return Promise.all(seedUsers.map(user => User.hashPassword(user.password)))
      .then(digests => {
        seedUsers.forEach((user, i) => user.password = digests[i]);
        return Promise.all([
          User.insertMany(seedUsers)
        ]);
      })
      .then(([users]) => {
        user = users[0];
        token = jwt.sign({ user }, JWT_SECRET, { subject: user.username });
      });
  });

  afterEach(function () {
    return mongoose.connection.db.dropDatabase()
      .catch(err => console.error(err));
  });

  after(function () {
    return mongoose.disconnect();
  });

  describe('GET /api/users', function () {
    it('should return the correct number of users', function () {
      return chai.request(app).get('/api/users')
        .set('Authorization', `Bearer ${token}`)
        .then(res => {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.a('array');
          expect(res.body).to.have.length(res.body.length);
        });
    });

    it('should return a list with the correct fields', function () {
      return chai.request(app).get('/api/users')
        .set('Authorization', `Bearer ${token}`)
        .then(res => {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.a('array');
          expect(res.body).to.have.length(res.body.length);
          res.body.forEach(function (item) {
            expect(item).to.be.a('object');
            expect(item).to.have.keys('username', 'id', 'list', 'head');
          });
        });
    });

  });

  describe('GET /api/users/:id', function () {
    it('should return correct question', function () {
      return chai.request(app).get(`/api/users/${user.id}`)
        .set('Authorization', `Bearer ${token}`)
        .then(res => {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.a('object');
          expect(res.body).to.have.keys('m', 'correct', 'total', '_id', 'questionId', 'question', 'next', 'answer', 'pronounce');
        });
    });
  });

  describe('POST /api/users/answer', function () {
    it('should return correct question', function () {
      return chai.request(app).get(`/api/users/${user.id}`)
        .set('Authorization', `Bearer ${token}`)
        .then(res => {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.a('object');
          expect(res.body).to.have.keys('m', 'correct', 'total', '_id', 'questionId', 'question', 'next', 'answer', 'pronounce');
        });
    });
  });

});