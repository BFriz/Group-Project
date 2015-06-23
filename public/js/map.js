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
}

$(document).ready(function() {
  google.maps.event.addDomListener(window, 'load', initialize);
});
