// Declares the initial angular module "meanMapApp". Module grabs other controllers and services. Note the use of ngRoute.
var app = angular.module('meanMapApp', ['addCtrl', 'queryCtrl', 'geolocation', 'gservice', 'ngRoute'])

  // Configures Angular routing -- showing the relevant view and controller when needed.
  .config(function($routeProvider) {

    // Add Bathroom Control Panel
    $routeProvider.when('/add', {
      controller: 'addCtrl',
      templateUrl: 'partials/addForm.html',

      // Find Bathrooms Control Panel
    }).when('/find', {
      controller: 'queryCtrl',
      templateUrl: 'partials/queryForm.html',
      // Rate Bathroom Control Panel
    }).when('/rate', {
      controller: 'rateCtrl',
      templateUrl: 'partials/rateForm.html',
      // All else forward to the Find Bathroom Control Panel
    }).otherwise({
      redirectTo: '/add'
    })
  });
