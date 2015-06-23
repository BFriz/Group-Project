var REPL = require('repl');
var db = require('./user');

//Start the repl and assign a prompt;
var repl = REPL.start("Blogs >");
//Setting the context of the database to be foodsdatabase
repl.context.db = db;

//Remove all documents from the collection;
db.User.collection.remove();
db.User.collection.dropIndex('email_1');
db.User.collection.dropIndex('password_1');

// SEEDING:
// Jerem and Lexie match; Jerem likes Lauren
// James likes Mathilda, but no match; James doesnt like Lauren 

db.User.create({
	display_name: 'Mathilda',
	dob: '19/12/1988',
	gender: 'female',
	mood: 'party',
}, function(err, mathilda) {
	if (err) { console.log(err) }
	else { console.log('mathilda creaetd');}
	// James likes Mathilda
	db.User.create({
		display_name: 'James',
		dob: '19/12/1984',
		gender: 'male',
		mood: 'party',
	}, function(err, james) {
		// console.log(err);
		james.likes.push(mathilda._id);
		console.log('this is James likes ', james.likes);
	// James doesnt like Lauren
		db.User.create({
			display_name: 'Lauren',
			dob: '19/10/1988',
			gender: 'female',
			mood: 'chatty',
		}, function(err, lauren) {
				james.dislikes.push(lauren._id);
				console.log('James dislikes lauren, here are his dislikes ', james.dislikes);
				db.User.create({
					display_name: 'Jeremy',
					dob: '19/10/1980',
					gender: 'male',
					mood: 'surprise me',
				}, function(err, jeremy) {
					if (!err) console.log ('jeremy created');
					db.User.create({
						display_name: 'Lexie',
						dob: '19/07/1988',
						gender: 'female',
						mood: 'surprise me',
					}, function(err, lexie) {
						// Jerem and Lexie match; Jerem likes Lauren
						jeremy.likes.push(lexie._id);
						jeremy.matches.push(lexie._id);
						lexie.matches.push(jeremy._id);
						jeremy.likes.push(lauren._id);
						console.log(jeremy.likes);
						console.log(lexie.matches);
						//Take care with process.exit(), this will break the code
	//     // process.exit()
					})
			})
		})
	})
})
