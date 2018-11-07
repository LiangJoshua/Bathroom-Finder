// Creates the listCtrl Module and Controller. Note that it depends on 'geolocation' and 'gservice' modules.
var listCtrl = angular.module('queryCtrl', ['geolocation', 'gservice']);
listCtrl.controller('queryCtrl', function($scope, $log, $http, $rootScope, geolocation, gservice) {
