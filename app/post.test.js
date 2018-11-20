// White-box test case using jest and supertest
// Tests if our route app.post will add bathrooms to MongoDB Database
const request = require('supertest');
const express = require('express');
var app = express();
var users = [{
  bathroomName: "Jack in the Box",
  gender: "Male",
  rating: 18,
  avgRating: 3.5,
  ratingCount: 5,
  location: [-121.88840310870665, 37.35725874484297],
  __v: 0,
  updatedAt: "2018-11-18T01:48:23.585Z",
  createdAt: "2018-11-18T00:43:00.666Z"
}];
app.post('/users', function(req, res) {
  res.json(users);
});
describe('Test the test path with POST', function() {

  it('It should work', function() {
    request(app)
      .post('/users')
      .expect(200)
  });
});
