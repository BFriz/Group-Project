var Map = Map || {};

$(document).ready(function() {

  // see View.initialize for 2 more map functions starting once we get current user

  $('#bottom_panel').on('submit', '#submitLocation', Map.changeUserLocation); 
  $('.container-fluid').on('click', '.icon-chat', Chat.show);
});


Map = {

  // show map and ensure the small icon enables to click and show the chat
  show: function() {
    event.preventDefault();
    View.render($('#map_panel_template'), StorageUser, $('#bottom_panel') );
    $('#mood_menu .icon-chat').show();
    $('#mood_menu .icon-map').hide();
  },

 //Initialize function for Google Maps
 initialize: function() {

    Map.latlng = new google.maps.LatLng(51.50722, -0.12750); // LONDON by default for the moment
    Map.currUserIcon = "../img/red_marker.png";

    var snazzyMap = [{"featureType":"landscape.man_made","elementType":"geometry","stylers":[{"color":"#f7f1df"}]},{"featureType":"landscape.natural","elementType":"geometry","stylers":[{"color":"#d0e3b4"}]},{"featureType":"landscape.natural.terrain","elementType":"geometry","stylers":[{"visibility":"off"}]},{"featureType":"poi","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"poi.business","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"poi.medical","elementType":"geometry","stylers":[{"color":"#fbd3da"}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"color":"#bde6ab"}]},{"featureType":"road","elementType":"geometry.stroke","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#ffe15f"}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#efd151"}]},{"featureType":"road.arterial","elementType":"geometry.fill","stylers":[{"color":"#ffffff"}]},{"featureType":"road.local","elementType":"geometry.fill","stylers":[{"color":"black"}]},{"featureType":"transit.station.airport","elementType":"geometry.fill","stylers":[{"color":"#cfb2db"}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#a2daf2"}]}]

    var mapOptions = {
        zoom: 12,
        center: Map.latlng,
        zoomControlOptions: {
          position: google.maps.ControlPosition.LEFT_CENTER
        },
        mapTypeControl: false,
        panControl: false,
        styles: snazzyMap
      };

    Map.map = new google.maps.Map(document.getElementById('googleMap'), mapOptions);
    Map.geocoder = new google.maps.Geocoder();

    // show position of current user
    Map.getCoords([StorageUser]);

  },

  getCoords: function(userArray){
    // iterates through all users and adds their location into the user object
    // once the count of async calls is userArray.length, we run the callback to now show all locations on the map
    var count = 0;
    _.each(userArray, function(user){
      Map.geocoder.geocode( {'address': user.location}, function(results, status) {
        count++;
        // later on need to ensure that no marker is created if the coords are invalid
        (status == google.maps.GeocoderStatus.OK) ? user.ggl_coords = results[0].geometry.location : user.ggl_coords = 'invalid';
        // as for a callback, only run this once we did iterate through the whole array
        if (count === userArray.length) {
          Map.showUsers(userArray);
        }
      });
    })
  },

// Create a marker for every user on the map and show their details on the infowindow
  showUsers: function(userArray) {

    Map.clearMarkerArray();

    console.log('adding markers');
    // Iterates through users but only create marker if the user has a valid location as per Google
    _.each(userArray, function(user){

      if (user.ggl_coords !== 'invalid') {

        var html = "<div class='mini_marker_info' data-id='" + user._id + "'>";
        html += "<img src='" + user.facebook.profile_pic_url + "' class='img-responsive img-circle'><p>" + user.shortName + " <span class='glyphicon glyphicon-star-empty'></span> ";
        html += user.mood + "</p></div>";

        // special icon for current user - and instructions to hide the previous icon
        if (user._id === StorageUser._id) {
          if (!!StorageUser.marker) { StorageUser.marker.setMap(null);};
          user.marker = new google.maps.Marker({
            position: user.ggl_coords,
            map: Map.map,
            draggable: false,
            html: html, 
            animation: google.maps.Animation.DROP,
            icon: Map.currUserIcon
          });
          StorageUser.marker = user.marker;
        } else {
          user.marker = new google.maps.Marker({
            position: user.ggl_coords,
            map: Map.map,
            html: html
          });
        // only add to the marker array if it is Not the current user, so that current user never gets removed from the map
          Map.markerArray.push(user.marker)
        }

        // show infowindow on click
        var infoWindow = new google.maps.InfoWindow();
        google.maps.event.addListener(user.marker, 'click', function() {
          infoWindow.setContent(this.html);
          infoWindow.open(Map.map, this);
        });                          
      } 
      // else if current user has put an invalid, adress, do nothing but show alert msg 
      else if ( (user.ggl_coords !== 'invalid') && (user._id === StorageUser._id)  ) {
        alert('You entered an invalid location, please try again');
      }
    });
  },

  clearMarkerArray: function(){
    console.log('marker arra', Map.markerArray);
    if (Map.markerArray.length > 0) {
      _.each(Map.markerArray, function(marker){
        console.log(marker);
        marker.setMap(null);
      });
      Map.markerArray = [];
    }
  },

  changeUserLocation: function(event) {
    event.preventDefault();
    var location = $('#location_input').val();  
    // server not return the new user, only a 201 msg, so update ourselves
    StorageUser.location = location;

    $.ajax({
      type: 'PUT',
      url: '/users/location',
      data: {location: location}, 
      dataType: 'json'
    })
    .done(function(data) {
      console.log('changed location', StorageUser.location);
      Map.getCoords([StorageUser]);
    })
  }

} // end Map object







