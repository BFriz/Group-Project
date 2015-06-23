//Initialize function for Google Maps
function initialize() {
  var mapOptions = {
    zoom: 12,
    center: new.google.maps.LatLng(51.507351, -0.127758)
  };
  var map = new google.maps.Map(document.getElementById('googleMap'),
    mapOptions);
}

function loadScript() {
  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp' +
      '&signed_in=true&callback=initialize';
  document.body.appendChild(script);
}

window.onload = loadScript;
}