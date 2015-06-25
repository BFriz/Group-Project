//Variables that will be updated by the functions.
var map;
var geocoder;
var locations = [];

//Initialize function for Google Maps
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

//Function for adding markers to the page based on the locations from the database.
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

// var profileContent ='<div id="content">' +
//   '<div id="siteNotice">' + 
//   '</div>' + 
//   '<h1 id="userName" class="userName">Mathilda</h1>' + 
//   '<div id="bodyContent">' +
//   '<p>Mathilda is single and feeling flirty!</p>' +
//   '</div>' +
//   '</div>';


// var infoindow = new google.maps.InfoWindow({
//   content: profileContent
// });

//Document.ready function and event listener for the map to load.
$(document).ready(function() {
  google.maps.event.addDomListener(window, 'load', initialize);
  listLocation();
  // google.maps.event.addListener(marker, 'click', function() {
    // infowindow.open(map,marker);
  // });
});







