//Initialize function for Google Maps
var map;

function initialize() {
  geocoder = new google.maps.Geocoder();
  var latlng = new google.maps.LatLng(51.50722, -0.12750);
  var mapOptions = {
    zoom: 12,
    center: latlng
  }
  map = new google.maps.Map(document.getElementById('googleMap'), mapOptions);
  var marker = new google.maps.Marker({
    position: latlng,
    map: map,
    title: 'Hello World!'
  });
}
var locations = [];

function listLocation() {
    $.get('/map', function(response) {
      console.log(response);
        $.each(response, function(index, user) {
          locations.push(user.location);
            console.log(user.location);
            // function mapMarker() {
            //   geocoder = new google.maps.Geocoder();
            //   var dblatlng = new google.maps.LatLng()
            // }
            // here write code to add a pin for user.location
        })
    })
}


//Document.ready function and event listener for the map to load.
$(document).ready(function() {
  google.maps.event.addDomListener(window, 'load', initialize);
  listLocation();
});

