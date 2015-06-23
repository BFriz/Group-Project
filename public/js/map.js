//Initialize function for Google Maps
var moodMap
function initialize() {
  map = new google.maps.Map(document.getElementById('googleMap'), {
    zoom: 12,
    center: {lat: 51.507351, lng: -0.127758}
  });
}
//Event listener for the map to load
google.maps.event.addDomListener(window, 'load', initialize);

function initialize() {
  var mapOptions = {
    zoom: 12,
    center: new.google.maps.LatLng(51.507351, -0.127758)
  };
  var 
}