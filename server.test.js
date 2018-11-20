// White-Box test case using jest
// Tests if the server successfully launches and shows the port Number

// Dependencies
// -----------------------------------------------------
var express = require('express');
var mongoose = require('mongoose');

var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var app = express();

// Express Configuration
// -----------------------------------------------------
// Sets the connection to MongoDB

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/MeanMapApp');
// Logging and Parsing
app.use(express.static(__dirname + '/public')); // sets the static files location to public
app.use('/bower_components', express.static(__dirname + '/bower_components')); // Use BowerComponents
app.use(morgan('dev')); // log with Morgan
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.urlencoded({
  extended: true
}));
// parse application/x-www-form-urlencoded
app.use(bodyParser.text()); // allows bodyParser to look at raw text
app.use(bodyParser.json({
  type: 'application/vnd.api+json'
})); // parse application/vnd.api+json as json
app.use(methodOverride());

// Routes
// ------------------------------------------------------
require('./app/routes.js')(app);

// Listen
// -------------------------------------------------------
var port = process.env.PORT || 3000;

// Jest testcase used here
describe('Test if the port is running', function() {

  it('It should be running on port 3000', function() {
    app.listen(port);
    console.log('App listening on port ' + port);
  });
});
