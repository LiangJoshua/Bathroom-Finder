// Creates the addCtrl Module and Controller. Note that it depends on the 'geolocation' and 'gservice' modules and controllers.
var addCtrl = angular.module('addCtrl', ['geolocation', 'gservice']);
addCtrl.controller('addCtrl', function($scope, $location, $route, $http, $rootScope, geolocation, gservice) {

  // Initializes Variables
  // ----------------------------------------------------------------------------
  $scope.formData = {};
  $scope.$route = $route;
  var coords = {};
  var lat = 0;
  var long = 0;

  // Sets initial coordinates to gservice initial coordinates (downtown SJ)
  $scope.formData.latitude = parseFloat(gservice.clickLat);
  $scope.formData.longitude = parseFloat(gservice.clickLong);


  // Functions
  // ----------------------------------------------------------------------------
  $scope.isActive = function(route) {
    return route === $location.path();
  }
  // Function that refreshes Google Maps with user's current location
  $scope.refresh = function() {
    // Set initial coordinates to the downtown SJ
    // $scope.formData.latitude = 37.3351;
    // $scope.formData.longitude = -121.8929;

    geolocation.getLocation().then(function(data) {

      // Set the latitude and longitude equal to the HTML5 coordinates
      coords = {
        lat: data.coords.latitude,
        long: data.coords.longitude
      };


      // Display coordinates in location textboxes
      $scope.formData.longitude = parseFloat(coords.long);
      $scope.formData.latitude = parseFloat(coords.lat);

      gservice.refresh($scope.formData.latitude, $scope.formData.longitude);


    });
    console.log("Test for my location in Add Bathroom");
  };


  // Get coordinates based on mouse click. When a click event is detected....
  $rootScope.$on("clicked", function() {


    // Run the gservice functions associated with identifying coordinates
    $scope.$apply(function() {
      $scope.formData.latitude = parseFloat(gservice.clickLat);
      $scope.formData.longitude = parseFloat(gservice.clickLong);

    });

     console.log("Test for browsing the map in Add Bathroom. Marker should turn blue");
  });

  // Creates a new user based on the form fields
  $scope.createUser = function() {

    // Grabs all of the text box fields
    var userData = {
      bathroomName: $scope.formData.bathroomName,
      gender: $scope.formData.gender,
      rating: $scope.formData.rating,
      avgRating: $scope.formData.rating,
      ratingCount: 1,
      location: [$scope.formData.longitude, $scope.formData.latitude]
    };

    console.log("Bathroom: " + $scope.formData.bathroomName + "is added to the database successfully");
    // Saves the user data to the db
    $http.post('/users', userData)
      .success(function(data) {

        // Once complete, clear the form (except location)
        $scope.formData.bathroomName = "";
        $scope.formData.gender = "";
        $scope.formData.rating = "";

        // Refresh the map with new data
        gservice.refresh($scope.formData.latitude, $scope.formData.longitude);
        console.log("Page has been succesfully refreshed");
      })
      .error(function(data) {
        console.log('Error: ' + data);
      });

  };
});
