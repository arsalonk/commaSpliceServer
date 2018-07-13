'use strict';

const { app } = require('../index');
const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');

const { TEST_DATABASE_URL, JWT_SECRET } = require('../config');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const seedUsers = require('../DB/seed/users');

const expect = chai.expect;
chai.use(chaiHttp);

describe('SR API - Users', function () {
  let token;
  const username = 'example';
  const password = 'password';
  const _id = '333333333333333333333333';
  const username2 = 'example2';

  this.timeout(5000);
  before(function () {
    return mongoose.connect(TEST_DATABASE_URL)
      .then(() => mongoose.connection.db.dropDatabase());
  });

  beforeEach(function () {
    return User.hashPassword(password)
      .then(digest => User.create({
        _id,
        username,
        password: digest
      }));
  });

  afterEach(function () {
    return mongoose.connection.db.dropDatabase()
      .catch(err => console.error(err));
  });

  after(function () {
    return mongoose.disconnect();
  });

  describe('POST /auth/login', function () {
    it('Should return a valid auth token', function () {
      return chai.request(app)
        .post('/auth/login')
        .send({ username, password })
        .then(res => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          expect(res.body.authToken).to.be.a('string');

          const payload = jwt.verify(res.body.authToken, JWT_SECRET);

          expect(payload.user).to.not.have.property('password');
          expect(payload.user).to.deep.equal({ id: _id, username, head: 0, list: [] });
        });
    });
  });

  describe('POST /auth/register', function() {
    it('should return create a new user', function() {
      const testUser = { username: username2, password };
      let res;
      return chai
        .request(app)
        .post('/auth/register')
        .send(testUser)
        .then(_res => {
          res = _res;
          expect(res).to.have.status(201);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.keys('id', 'username', 'list', 'head');

          expect(res.body.id).to.exist;
          expect(res.body.username).to.equal(testUser.username);

          return User.findOne({ username: username2 });
        })
        .then(user => {
          expect(user).to.exist;
          expect(user.id).to.equal(res.body.id);
          return user.validatePassword(password);
        })
        .then(isValid => {
          expect(isValid).to.be.true;
        });
    })
  })

  describe('POST /auth/refresh', function () {

    it('should return a valid auth token with a newer expiry date', function () {
      const user = { username };
      const token = jwt.sign({ user }, JWT_SECRET, { subject: username, expiresIn: '1m' });
      const decoded = jwt.decode(token);

      return chai.request(app)
        .post('/auth/refresh')
        .set('Authorization', `Bearer ${token}`)
        .then(res => {
          expect(res).to.have.status(200);
          expect(res.body).to.been.a('object');
          const authToken = res.body.authToken;
          expect(authToken).to.be.a('string');

          const payload = jwt.verify(authToken, JWT_SECRET);
          expect(payload.user).to.deep.equal({ username });
          expect(payload.exp).to.be.greaterThan(decoded.exp);
        });
    });
  });

});
