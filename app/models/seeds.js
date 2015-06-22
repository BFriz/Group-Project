var REPL = require('repl');
var db = require('./models');

//Start the repl and assign a prompt;
var repl = REPL.start("Blogs >");
//Setting the context of the database to be foodsdatabase
repl.context.db = db;

//Remove all documents from the collection;
db.User.collection.remove();

// var User = mongoose.model('User', UserSchema);

// creating the first user
var mathilda = db.User.create({
	display_name: 'Mathilda',
	email: 'math@ga',
	password: 'abvbva',
	dob: '19/12/1988',
	gender: 'female',
	mood: 'party',
}, function(err, user) {
	if (err) { console.log(err) }
		else { console.log('mathilda created');}
})

// James likes Mathilda
db.User.create({
	display_name: 'James',
	email: 'james@ga',
	password: 'avgfgg',
	dob: '19/12/1984',
	gender: 'male',
	mood: 'party',
}, function(err, james) {
	console.log(james.display_name, 'created');
	james.likes.push(mathilda.emitted.fulfill[0]._id);
	console.log('this is James likes ', james.likes);
// James doesnt like Lauren
	db.User.create({
		display_name: 'Lauren',
		email: 'laurens@ga',
		password: 'aghgfd',
		dob: '19/10/1988',
		gender: 'female',
		mood: 'chatty',
	}, function(err, lauren) {
		// console.log(err);
			console.log(lauren.display_name, 'created');
			james.dislikes.push(lauren._id);
			console.log('this is James dislikes ', james.dislikes);
	})
})





// 		db.User.create({
// 			display_name: 'Lauren',
// 			email: 'lauren@ga',
// 			password: 'ag',
// 			dob: '19/10/1988',
// 			gender: 'female',
// 			mood: 'chatty',




// 	}, function(err, lauren) {
// 			console.log(lauren.display_name, 'also lauren created');
// 			db.User.create({
// 				display_name: 'Jeremy',
// 				email: 'jerem@ga',
// 				password: 'ag',
// 				dob: '19/12/1980',
// 				gender: 'male',
// 				mood: 'surprise me',

// 		}, function(err, jeremy) {
// 				console.log(jeremy.display_name, 'also jeremy created');
// 				db.User.create({
// 					display_name: 'Lexie',
// 					email: 'lexie@ga',
// 					password: 'ag',
// 					dob: '19/12/1988',
// 					gender: 'female',
// 					mood: 'surprise me',
// 			}, function(err, lexie){
// 				console.log('lexie created');
// 			})
// 		})
// 	})
// });


// trying to say James likes MAthilda, ie Mathilda is inside of Jame's Likes array
// console.log(james);
// james.likes.push(mathilda);



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