// Requirements to run the app
var express = require('express');
var app = express();
path = require("path");
// create a server and attach it to our main express-app
var server = require('http').createServer(app);
var port = process.env.PORT || 3000
// tell socket.io we use this server (?)
var io = require('socket.io')(server);
//morgan handles the middleware and lets us know about our routes and connections
// more info npmjs.com/package/morgan
var morgan = require('morgan');
app.use(morgan('dev'));
// Create connection to Database from the server
var db = require('./models')

// Setting the views and static folder
app.set('views', './views');
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

// Body-parser config for post requests
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true})); // this is if we send form data through the request
app.use(bodyParser.json());  // this is if we send data objects through the request






app.get('/', function(req, res){
  res.render('index')
})


// Start the server
app.listen(3000, function () {
  console.log("Server running on port", port);
});

