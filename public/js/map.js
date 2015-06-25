//Variables that will be updated by the functions.
var map;
var marker;
var geocoder;
var locations = [];
var all_users;
//var locations = {};


//Initialize function for Google Maps
function initialize() {
  var latlng = new google.maps.LatLng(51.50722, -0.12750);
  var mapOptions = {
    zoom: 12,
    center: latlng
  }
  map = new google.maps.Map(document.getElementById('googleMap'), mapOptions);
  marker = new google.maps.Marker({
    position: latlng,
    map: map,
  });
}

//Function for obtaining the locations 
function listLocation() {
    $.get('/map', function(response) {
      $.each(response, function(index, user) {
        locations.push(user.location);
        all_users = response;
      });
      return all_users;
    })
    .done(function(all_users){
      addMarkers(all_users, function(coords) {
        var usersAndCoordinates = _.zip(all_users, coords);

        for (var i = 0; i < usersAndCoordinates.length; i++) {
          var name = usersAndCoordinates[i][0].facebook.name;
          var mood = usersAndCoordinates[i][0].mood;
          var pic = usersAndCoordinates[i][0].facebook.profile_pic_url;
          var id = usersAndCoordinates[i][0]._id;

          var marker = new google.maps.Marker({
            position: usersAndCoordinates[i][1],
            map: map,
            html: '<div class="mini_marker_info" data-pic="' + pic + '" data-id="' + id + '"><p>' + name + '</p> <p>' + mood + '</p></div>' 
          });

          var infoWindow = new google.maps.InfoWindow( { content: "Loading content..." } );

          google.maps.event.addListener( marker, 'click', function() {
            infoWindow.setContent(this.html);
            infoWindow.open(map, this);
          });
        };
      });
    });
}

//Function for adding markers to the page based on the locations from the database.
function addMarkers(all_users, callback) {
  var coords = [];
  var users = all_users;
  geocoder = new google.maps.Geocoder();

  for (var i = 0; i < users.length; i++) {
     // var windowContent = '<h1>'+ locations(i)(1)) +'</h1>';
      // address will then be locations(i)(0)
      // name will then be locations(i)(1)
    var address = users[i].location;
    var windowContent = '<h1>' + users[i].facebook.name + '</h1>';

    geocoder.geocode( {'address': address}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        coords.push(results[0].geometry.location);

        if(coords.length === users.length) {
          callback(coords);
        }
      }
    });
  }
}

function showInsideProfiles() {
  event.preventDefault();
  console.log('show me in the profile');
}

//Document.ready function and event listener for the map to load.
$(document).ready(function() {
  google.maps.event.addDomListener(window, 'load', initialize);
  listLocation();

  $('#middle_panel').on('click', '.mini_marker_info', showInsideProfiles);  
});








