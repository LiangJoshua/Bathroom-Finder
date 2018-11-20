const request = require('supertest');
const express = require('express');
var app = express();
var users = [{
  bathroomName: 2,
  gender: "Male",
  rating: 18,
  avgRating: "aflsd",
  ratingCount: 5,
  location: [-121.88840310870665, 37.35725874484297],
  __v: 0,
  updatedAt: "2018-11-18T01:48:23.585Z",
  createdAt: "2018-11-18T00:43:00.666Z"
}];
app.get('/users', function(req, res) {
  res.json(users);
});
describe('Test the test path with GET', function() {

  it('It should work', function() {
    return request(app)
      .get('/users')
      .expect(200)
  });
});
