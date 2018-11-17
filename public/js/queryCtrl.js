// Creates the queryCtrl Module and Controller. Note that it depends on 'geolocation' and 'gservice' modules.
var queryCtrl = angular.module('queryCtrl', ['geolocation', 'gservice']);
queryCtrl.controller('queryCtrl', function($scope, $log, $http, $rootScope, geolocation, gservice) {

  // Initializes Variables
  // ----------------------------------------------------------------------------
  $scope.formData = {};
  var queryBody = {};

  // Functions
  // ----------------------------------------------------------------------------

  // Get User's actual coordinates based on HTML5 at window load
  geolocation.getLocation().then(function(data) {
    coords = {
      lat: data.coords.latitude,
      long: data.coords.longitude
    };

    // Set the latitude and longitude equal to the HTML5 coordinates
    $scope.formData.longitude = parseFloat(coords.long);
    $scope.formData.latitude = parseFloat(coords.lat);
  });

  // Get coordinates based on mouse click. When a click event is detected....
  $rootScope.$on("clicked", function() {

    // Run the gservice functions associated with identifying coordinates
    $scope.$apply(function() {
      $scope.formData.latitude = parseFloat(gservice.clickLat);
      $scope.formData.longitude = parseFloat(gservice.clickLong);
    });
  });

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
  };


  // Take query parameters and incorporate into a JSON queryBody
  $scope.queryUsers = function() {

    // Assemble Query Body
    queryBody = {
      longitude: parseFloat($scope.formData.longitude),
      latitude: parseFloat($scope.formData.latitude),
      distance: parseFloat($scope.formData.distance),
      male: $scope.formData.male,
      female: $scope.formData.female,
      unisex: $scope.formData.unisex,
      rating: $scope.formData.rating,
      other: $scope.formData.other,
      reqVerified: $scope.formData.verified
    };

    // Post the queryBody to the /query POST route to retrieve the filtered results
    $http.post('/query', queryBody)

      // Store the filtered results in queryResults
      .success(function(queryResults) {

        // Initial Logging
        console.log("QueryBody:");
        console.log(queryBody);
        console.log("QueryResults:");
        console.log(queryResults);

        // Pass the filtered results to the Google Map Service and refresh the map
        gservice.refresh(queryBody.latitude, queryBody.longitude, queryResults);

        // Count the number of records retrieved for the panel-footer
        $scope.queryCount = queryResults.length;
      })
      .error(function(queryResults) {
        console.log('Error ' + queryResults);
      })
  };
});
