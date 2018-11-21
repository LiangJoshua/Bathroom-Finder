// Creates the gservice factory. This will be the primary means by which we interact with Google Maps
angular.module('gservice', [])
  .factory('gservice', function($rootScope, $http) {

    // Initialize Variables
    // -------------------------------------------------------------
    // Service our factory will return
    var googleMapService = {};

    // Array of locations obtained from API calls
    var locations = [];

    // Variables we'll use to help us pan to the right spot
    var lastMarker;
    var currentSelectedMarker;

    // Selected Location (initialize to downtown SJ)
    var selectedLat = 37.3351;
    var selectedLong = -121.8929;
    //var selectedLat = 0;
    //var selectedLong = 0;



    // Handling Clicks and location selection
    googleMapService.clickLat = 0;
    googleMapService.clickLong = 0;

    // Functions
    // --------------------------------------------------------------
    // Refresh the Map with new data. Takes three parameters (lat, long, and filtering results)
    googleMapService.refresh = function(latitude, longitude, filteredResults) {

      // Clears the holding array of locations
      locations = [];

      // Set the selected lat and long equal to the ones provided on the refresh() call
      selectedLat = latitude;
      selectedLong = longitude;

      // If filtered results are provided in the refresh() call...
      if (filteredResults) {

        // Then convert the filtered results into map points.
        locations = convertToMapPoints(filteredResults);

        // Then, initialize the map -- noting that a filter was used (to mark icons yellow)
        initialize(latitude, longitude, true);
      }

      // If no filter is provided in the refresh() call...
      else {

        // Perform an AJAX call to get all of the records in the db.
        $http.get('/users').success(function(response) {

          // Then convert the results into map points
          locations = convertToMapPoints(response);

          // Then initialize the map -- noting that no filter was used.
          initialize(latitude, longitude, false);
        }).error(function() {});
      }
    };

    // Private Inner Functions
    // --------------------------------------------------------------
    // Convert a JSON of users into map points
    var convertToMapPoints = function(response) {

      // Clear the locations holder
      var locations = [];

      // Loop through all of the JSON entries provided in the response
      for (var i = 0; i < response.length; i++) {
        var user = response[i];

        // Create popup windows for each record
        var navigate = "https://www.google.com/maps/search/?api=1&query=" + user.location[1] + "," + user.location[0];
        var streetView = "https://maps.googleapis.com/maps/api/streetview?size=400x400&location=" + user.location[1] + "," + user.location[0] + "&key=AIzaSyBy8SbaiHYcQ9jG5yb3sh6H4liB6EblhyU";
        var rate = "../#/rate";

        var contentString =
          '<p><b>Name</b>: ' + user.bathroomName +
          '<br><b>Gender</b>: ' + user.gender +
          '<br><b>Rating</b>: ' + user.avgRating+
          '<br>' +
          '<a class="linkless" href="' + navigate + '" target="_blank"><button type="button">Navigate</button></a>' +
          '<br>' +
          '<a href="' + streetView + '" target="_blank"><button type="button">Street View</button></a>' +
          '<br>' +
          '<a href="' + rate + '"><button type="button">Rate</button></a>' +
          '</p>';

        // Converts each of the JSON records into Google Maps Location format (Note [Lat, Lng] format).
        locations.push({
          latlon: new google.maps.LatLng(user.location[1], user.location[0]),
          message: new google.maps.InfoWindow({
            content: contentString,
            maxWidth: 320
          }),
          bathroomName: user.bathroomName,
          gender: user.gender,
          avgRating: user.avgRating,
        });
      }
      // location is now an array populated with records in Google Maps format
      return locations;
    };

    // Initializes the map
    var initialize = function(latitude, longitude, filter) {

      // Uses the selected lat, long as starting point
      var myLatLng = {

        lat: selectedLat,
        lng: selectedLong

      };

      // If map has not been created...
      if (!map) {
        var map;
        // Create a new map and place in the index.html page
        map = new google.maps.Map(document.getElementById('map'), {
          zoom: 15,
          center: myLatLng

        });
      
      }



      // If a filter was used set the icons yellow, otherwise blue
      if (filter) {
        icon = "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png";
      } else {
        icon = "http://maps.google.com/mapfiles/ms/icons/blue-dot.png";
      }

      // Loop through each location in the array and place a marker
      locations.forEach(function(n, i) {
        var marker = new google.maps.Marker({
          position: n.latlon,
          map: map,
          title: "Click to view Bathroom",
          icon: "../images/toilets.png",
        });

        // For each marker created, add a listener that checks for clicks
        google.maps.event.addListener(marker, 'click', function(e) {

          // When clicked, open the selected marker's message
          map.setZoom(17);
          map.setCenter(marker.getPosition());
          currentSelectedMarker = n;
          n.message.open(map, marker);
          //window.open("/#/rate");
        });
      });

      // Set initial location as a bouncing red marker
      var initialLocation = new google.maps.LatLng(latitude, longitude);
      var marker = new google.maps.Marker({
        position: initialLocation,
        animation: google.maps.Animation.BOUNCE,
        map: map,
        icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
      });
      lastMarker = marker;

      // Function for moving to a selected location
      map.panTo(new google.maps.LatLng(latitude, longitude));

      // Clicking on the Map moves the bouncing red marker
      google.maps.event.addListener(map, 'click', function(e) {
        var marker = new google.maps.Marker({
          position: e.latLng,
          animation: google.maps.Animation.BOUNCE,
          map: map,
          icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
        });

        // When a new spot is selected, delete the old red bouncing marker
        if (lastMarker) {
          lastMarker.setMap(null);
        }

        // Create a new red bouncing marker and move to it
        lastMarker = marker;
        map.panTo(marker.position);

        // Update Broadcasted Variable (lets the panels know to change their lat, long values)
        googleMapService.clickLat = marker.getPosition().lat();
        googleMapService.clickLong = marker.getPosition().lng();
        $rootScope.$broadcast("clicked");
      });
    };

    // Refresh the page upon window load. Use the initial latitude and longitude
    google.maps.event.addDomListener(window, 'load',
      googleMapService.refresh(selectedLat, selectedLong));

    return googleMapService;
  });
