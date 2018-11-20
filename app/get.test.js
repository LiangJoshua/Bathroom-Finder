// White-box test case using jest and supertest
// Tests if our route app.get will get bathrooms from MongoDB Database
const request = require('supertest');
const express = require('express');
var app = express();

describe('Test the test path with GET', function() {

  it('It should work', function() {
    request(app)
      .get('/users')
      .expect(200)
  });
});
