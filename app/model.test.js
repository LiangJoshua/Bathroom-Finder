// White-box test case using jest and supertest
// Tests if the User Schema Model of bathrooms are created with correct inputs via string or Number etc.
const mongoose = require('mongoose');
const Model = require('./model');

describe('Test if bathroom is created with correct attributes', () => {
  it('It should return an error if a string is passed as a number for rating, avgRating, ratingCount, or location', (done) => {
    const model = new Model({
      bathroomName: 2,
      gender: "Male",
      rating: 18,
      avgRating: 3.5,
      ratingCount: 5,
      location: [-121.88840310870665, 37.35725874484297],
      __v: 0,
      updatedAt: "2018-11-18T01:48:23.585Z",
      createdAt: "2018-11-18T00:43:00.666Z"
    });
    model.validate(response => {
      console.log(response);
      done();
    });

  })
})
