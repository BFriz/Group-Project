//Initialize function for Google Maps
var map;
var geocoder;
var locations = [];

function initialize() {
  var latlng = new google.maps.LatLng(51.50722, -0.12750);
  var mapOptions = {
    zoom: 12,
    center: latlng
  }
  map = new google.maps.Map(document.getElementById('googleMap'), mapOptions);
  var marker = new google.maps.Marker({
    position: latlng,
    map: map,
  });
}

//Function for obtaining the locations 
function listLocation() {
    $.get('/map', function(response) {
      console.log(response);
        $.each(response, function(index, user) {
          locations.push(user.location);
        });
    }).done(function(){
      addMarkers();
    });
}


//Document.ready function and event listener for the map to load.
$(document).ready(function() {
  google.maps.event.addDomListener(window, 'load', initialize);
  listLocation();
});

function addMarkers() {
  geocoder = new google.maps.Geocoder();
    for (i = 0; i < locations.length; i++) {
      var address = locations[i];
      geocoder.geocode( {'address': address}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          var marker = new google.maps.Marker({
          position: results[0].geometry.location,
          map: map,
          });
        }  
      });
    }
}
