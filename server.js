
var express = require('express');
var app = express();
path = require("path");
var server = require('http').createServer(app);
var port = process.env.PORT || 3000
var bodyParser = require('body-parser');
var db = require('./models')
app.set('views', './views');
app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', function(req, res){
  res.render('index')
})
å
app.get('/blogs', function(req, res){
   db.Blog.find({}, function(err, blogs){
    res.send(blogs);
  })
})

app.post('/blogs', function(req, res){
  db.Blog.create(req.body, function(err, food){
    res.send(201, food); //success, object created
  })
})

app.delete("/blogs/:id", function (req, res){
  var blogId = req.params.id;
  db.Blog.findByIdAndRemove({
    _id: blogId
  }, function(err, food){
    res.send(204); //Success, no content
  })
});

app.listen(3000, function () {
  console.log("WORKING");
});

