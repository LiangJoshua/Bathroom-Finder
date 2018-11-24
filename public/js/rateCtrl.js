// Creates the rateCtrl Module and Controller. Note that it depends on 'geolocation' and 'gservice' modules.
var rateCtrl = angular.module('rateCtrl', ['geolocation', 'gservice']);
rateCtrl.controller('rateCtrl', function($scope, $location, $log, $http, $rootScope, geolocation, gservice, $route, $routeParams) {

  // Initializes Variables
  // ----------------------------------------------------------------------------
  $scope.$route = $route;
  $scope.formData = {};
  var lat = 0;
  var long = 0;

$scope.formData.bathroomName = $location.search().bathroomName;

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
  $scope.updateUsers = function() {
    // Get ratingCount from database + 1
    // rating equals

    // Grabs all of the text box fields
    var userData = {
      bathroomName: $scope.formData.bathroomName,
      rating: $scope.formData.rating,
    };

    // Saves the user data to the db
    $http.put('/users/:id', userData)
      .success(function(data) {

        // Once complete, clear the form (except location)
        $scope.formData.bathroomName = "";
        $scope.formData.rating = "";

        // Once complete, thank the user with alert notification
        alert('Thank you for Rating!')


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
      })
      .error(function(data) {
        console.log('Error: ' + data);
      });

  };

});
