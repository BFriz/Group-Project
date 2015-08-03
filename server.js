// // Various npm installed: npm install --save body-parser ejs express morgan socket.io mongoose

// ***************************
// CONFIGURATION OF THE APP, SERVER, DB ETC
// *****************************

// // Requirements to run the app
var express = require('express');
var app = express();
var path = require("path");

// // create a server and attach it to our main express-app
var server = require('http').createServer(app);
// var port = process.env.PORT || 3000;

// //morgan handles the middleware and lets us know about our routes and connections
// // more info npmjs.com/package/morgan
var morgan = require('morgan');
app.use(morgan('dev'));

// // Create connection to Database from the server
var User = require('./app/models/user.js');
var mongoose = require('mongoose');

// // Body-parser config for post requests
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true})); // this is if we send form data through the request
app.use(bodyParser.json());  // this is if we send data objects through the request


// ***************************
// LOGIN
// *****************************

var passport = require('passport');
var flash = require('connect-flash');
var configDB = require('./config/database.js');
var session = require('express-session');

// // required for passport
app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

require('./config/passport')(passport); // pass passport for configuration


// ***************************
// VIEWS AND STATIC FOLDER
// *****************************
app.set('views', './views');
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));


// ***************************
// THE SERVER
// *****************************

// routes
require('./app/routes')(app, passport, server); // load our routes and pass in our app fully config

// Start the server
app.set('port', (process.env.PORT || 5000));
// server.listen(3000, function () {
//   console.log("Server running on port", port);
// });
server.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

// ***************************
// SOCKET 
// *****************************

// tell socket.io we use this server (?)
var io = require('socket.io').listen(server);

  io.sockets.on('connection', function(socket){
    
    socket.emit('connected');

    socket.on('chat', function(data) {
      socket.broadcast.emit('chat', data);
    });
    
    socket.on('action', function(data) {
      socket.broadcast.emit('action', data);
    });
  });