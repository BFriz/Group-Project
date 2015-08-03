var Map = Map || {};


//Document.ready function and event listener for the map to load.
$(document).ready(function() {
  // see View.initialize for 2 more map functions starting once we get current user

  $('#bottom_panel').on('click', '.mini_marker_info', Map.showInsideProfiles);  
  $('.container-fluid').on('click', '.icon-chat', Chat.show);
});


//var locations = {};

Map = {

  // show map and switch small icon to go back to chat
  show: function() {
    event.preventDefault();
    View.render($('#map_panel_template'), StorageUser, $('#bottom_panel') );
    Map.initialize();
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

    // now show all users on map
    Map.listLocations();

  },

//Function for obtaining the locations 
  listLocations: function() {
    // push loc of all users into an array
    Map.usersLocations = [];
    $.each(AllUsers, function(index, user) {
      Map.usersLocations.push(user.location);
    });

    // callback function to run on Map.addMarkers, see definition below for explanations
    // NOTE underscore _.after() function seems like an easier choice
    Map.addMarkers(AllUsers, function(coords){
      console.log('adding markers');
      // add markers will push all users' coords in an array which we 'zip' with all users
      var usersAndCoordinates = _.zip(AllUsers, coords);
      console.log(usersAndCoordinates);

      for (var i = 0; i < usersAndCoordinates.length; i++) {

        var name = usersAndCoordinates[i][0].facebook.name;
        var mood = usersAndCoordinates[i][0].mood;
        var pic = usersAndCoordinates[i][0].facebook.profile_pic_url;
        var id = usersAndCoordinates[i][0]._id;
        var position = usersAndCoordinates[i][1];
       
        // Click on a marker will show the user info on the infowindow
        var html = "<div class='mini_marker_info' data-id='" +id + "'>";
        html += "<img src='" +pic+ "' class='img-responsive img-circle'><p>" +name+ " <span class='glyphicon glyphicon-star-empty'></span> ";
        html += mood + "</p></div>";

        var marker = new google.maps.Marker({
          position: position,
          map: Map.map,
          draggable: true,
          html: html
        });
        // special icon for current user
        if (id === StorageUser._id) {
          Map.currUsermarker = marker;
          marker.setIcon(Map.currUserIcon)
        }

        // infowindow on click
        var infoWindow = new google.maps.InfoWindow();
        google.maps.event.addListener(marker, 'click', function() {
          infoWindow.setContent(this.html);
          infoWindow.open(Map.map, this);
        });
      };
    });

  },

//Function for adding markers to the page based on the locations from the database.
// as there is an external call to gglmap to retrieve the coords of the marker,
// we trigger a callback function when the 'google work' is done
// NOTE underscore _.after() function seems like an easier choice
  addMarkers: function(users, callback) {
    var coords = [];
    var count = 0;
    Map.geocoder = new google.maps.Geocoder();

    for (var i = 0; i < users.length; i++) {
       // var windowContent = '<h1>'+ locations(i)(1)) +'</h1>';
        // address will then be locations(i)(0)
        // name will then be locations(i)(1)
      var address = users[i].location;
      var windowContent = '<p>' + users[i].facebook.name + '</p>';

      Map.geocoder.geocode( {'address': address}, function(results, status) {
        count++;
        if (status == google.maps.GeocoderStatus.OK) {
          coords.push(results[0].geometry.location);
        }
        if (count === users.length) {
          console.log('callback');
          callback(coords);
        }
      });
    }
  }

} // end Map object







