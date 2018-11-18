// Dependencies
var mongoose = require('mongoose');
var User = require('./model.js');


// Opens App Routes
module.exports = function(app) {

  // GET Routes
  // --------------------------------------------------------
  // Retrieve records for all users in the db
  app.get('/users', function(req, res) {

    // Uses Mongoose schema to run the search (empty conditions)
    var query = User.find({});
    query.exec(function(err, users) {
      if (err)
        res.send(err);

      // If no errors are found, it responds with a JSON of all users
      res.json(users);
    });
  });
  // GET Routes
  // --------------------------------------------------------
  // Retrieve records for users in the db based off id
  app.get('/users/:id', function(req, res) {


    User.findById(req.params.id, function(err, bathroom) {
      if (err)
        res.send(err);
      res.json(bathroom);
    });
  });

  //   // Uses Mongoose schema to run the search (empty conditions)
  //   var query = User.findById(req.params.id);
  //   query.exec(function(err, users) {
  //     if (err)
  //       res.send(err);
  //
  //     // If no errors are found, it responds with a JSON of all users
  //     res.json(users);
  //   });
  // });

  app.put('/users/:id', function(req, res) {


    User.findOne(req.body.bathroomName, function(err, bathroom) {

      if (err)
        res.send(err);

      bathroom.rating = bathroom.rating + req.body.rating; // update the rating info
      bathroom.ratingCount = bathroom.ratingCount + 1;
      bathroom.avgRating = (bathroom.rating / bathroom.ratingCount);

      // save
      bathroom.save(function(err) {
        if (err)
          res.send(err);

        res.json({
          message: 'User updated!'
        });
      });

    });
  });

  // POST Routes
  // --------------------------------------------------------
  // Provides method for saving new users in the db
  app.post('/users', function(req, res) {

    // Creates a new User based on the Mongoose schema and the post bo.dy
    var newuser = new User(req.body);

    // New User is saved in the db.
    newuser.save(function(err) {
      if (err)
        res.send(err);

      // If no errors are found, it responds with a JSON of the new user
      res.json(req.body);
    });
  });

  // Retrieves JSON records for all users who meet a certain set of query conditions
  app.post('/query/', function(req, res) {

    // Grab all of the query parameters from the body.
    var lat = req.body.latitude;
    var long = req.body.longitude;
    var distance = req.body.distance;
    var male = req.body.male;
    var female = req.body.female;
    var unisex = req.body.unisex;
    var rating = req.body.rating;
    var avgRating = req.body.avgRating;
    var other = req.body.other;
    var reqVerified = req.body.reqVerified;

    // Opens a generic Mongoose Query. Depending on the post body we will...
    var query = User.find({});

    // ...include filter by Max Distance (converting miles to meters)
    if (distance) {

      // Using MongoDB's geospatial querying features. (Note how coordinates are set [long, lat]
      query = query.where('location').near({
        center: {
          type: 'Point',
          coordinates: [long, lat]
        },

        // Converting meters to miles. Specifying spherical geometry (for globe)
        maxDistance: distance * 1609.34,
        spherical: true
      });

    }

    // ...include filter by Gender (all options)
    if (male || female || unisex) {
      query.or([{
        'gender': male
      }, {
        'gender': female
      }, {
        'gender': unisex
      }]);
    }
    // ...include filter by Rating
    if (avgRating) {
      query = query.where('avgRating').gte(avgRating);
    }

    // ...include filter by Rating (all options)
    // if (one || two || three || four || five) {
    //   query.or([{
    //     'rating': one
    //   }, {
    //     'rating': two
    //   }, {
    //     'rating': three
    //   }, {
    //     'rating': four
    //   }, {
    //     'rating': five
    //   }]);
    // }

    // ...include filter for HTML5 Verified Locations
    if (reqVerified) {
      query = query.where('htmlverified').equals("Yep (Thanks for giving us real data!)");
    }

    // Execute Query and Return the Query Results
    query.exec(function(err, users) {
      if (err)
        res.send(err);

      // If no errors, respond with a JSON of all users that meet the criteria
      res.json(users);
    });
  });
};
