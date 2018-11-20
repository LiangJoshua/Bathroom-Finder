// White-box test case using jest and supertest
// Tests if the our route app.put will update bathrooms to MongoDB Database
const request = require('supertest');
const express = require('express');
var app = express();

describe('Test the test path with PUT', function() {

  it('It should work', function() {
    request(app)
      .put('/users:id')
      .expect(200)
  });
});
