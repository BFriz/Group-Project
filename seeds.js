var REPL = require('repl');
var db = require('./models');

//Start the repl and assign a prompt;
var repl = REPL.start("Blogs >");
//Setting the context of the database to be foodsdatabase
repl.context.db = db;

//Remove all documents from the collection;
db.User.collection.remove();

// creating the first user
db.User.create({
	display_name: 'M@thild@',
	email: 'aa',
	password: 'aa',
	dob: '19/12/1988',
	gender: 'female',
	mood: 'party',
}, function(err, user) {
	console.log('user creaetd');
})

// db.Blog.create({
//   title: 'Rails for Zombies',
//   body: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Iste omnis ipsum rerum dolor quo ea, magnam ad aperiam saepe, repudiandae voluptates, in dolores necessitatibus temporibus. Dicta temporibus a, odio aperiam voluptate assumenda nostrum quia quae aliquid dolorum rerum voluptates id repudiandae maxime numquam eveniet laudantium quasi, doloremque explicabo, dignissimos quibusdam.',
//   author: 'Mathilda Thompson'
// }, function(err, blog){
//   db.Comment.create({
//     author: 'Joe Bloggs',
//     text: 'Lorem ipsum dolor sit amet.'
//   }, function(err, comment){
//     blog.comments.push(comment);
//     blog.save();
//     console.log('data seeded');
//     //Take care with process.exit(), this will break the code
//     // process.exit()
//   })
// });