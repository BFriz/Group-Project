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
      // also return user name from database
      console.log(response);
      $.each(response, function(index, user) {
        locations.push(user.location);
        all_users = response;
        //locations.push([user.location, user.name]);
        // you~ll need to push an array with two elements
        // then you want to re'write addmarker to get each postcode

      });
      return all_users;
    })
    .done(function(all_users){
      addMarkers(all_users, function(coords) {
        var usersAndCoordinates = _.zip(all_users, coords);

        for (var i = 0; i < usersAndCoordinates.length; i++) {
          var marker = new google.maps.Marker({
            //icon: usersAndCoordinates[i][0].facebook.profile_pic_url,
            position: usersAndCoordinates[i][1],
            map: map,
            html: '<h1>' + usersAndCoordinates[i][0].facebook.name + '</h1>' 
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
      console.log('window contente', windowContent);

      console.log(users[i]); // WORKS

    geocoder.geocode( {'address': address}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        console.log(users);  // UNDEFINED
        console.log(windowContent);

        coords.push(results[0].geometry.location);

        if(coords.length === users.length) {
          callback(coords);
        }
      }
    });
  }
}










          // var marker = new google.maps.Marker({
          //   // icon: users[i].facebook.profile_pic_url,
          //   position: results[0].geometry.location,
          //   map: map,
          //   html: windowContent  // ALWAYS CHRIS HAINES
          // });



          // infoWindow = new google.maps.InfoWindow( { content: "Loading content..." } );

          // google.maps.event.addListener( marker, 'click', function() {
          //   infoWindow.setContent(this.html);
          //   console.log('marker is', marker);
          //   infoWindow.open(map, this);
          // });

// var profileContent ='<div id="content">' +
//   '<div id="siteNotice">' + 
//   '</div>' + 
//   '<h1 id="userName" class="userName">Mathilda</h1>' + 
//   '<div id="bodyContent">' +
//   '<p>Current Mood: </p>' +
//   '</div>' +
//   '</div>';


// var infoindow = new google.maps.InfoWindow({
//   content: profileContent
// });

//Document.ready function and event listener for the map to load.
$(document).ready(function() {
  google.maps.event.addDomListener(window, 'load', initialize);
  listLocation();


  
});








