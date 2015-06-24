var REPL = require('repl');
var User = require('./user');

// var db = m/ongoose.model('User', userSchema);

//Start the repl and assign a prompt;
var repl = REPL.start("Blogs >");
//Setting the context of the database to be foodsdatabase
// repl.context.db = db;


//Remove all documents from the collection;
User.collection.remove();
User.collection.dropIndex('email_1');
User.collection.dropIndex('password_1');

// SEEDING:
// Jeremy and Lexie match; Jeremy likes Lauren
// James likes Mathilda, but no match; James doesnt like Lauren 

User.create({
	email: "MyNameIsMathilda@gmail.com",
	name: 'Mathilda',
	gender: 'female',
	profile_pic_url: "http://media.repro-mayr.de/04/73304.jpg"
	mood: 'party',
	location: 'E1 5JL'
}, function(err, mathilda) {
	if (err) { console.log(err) }
	else { console.log('mathilda created');}
	// James likes Mathilda
	User.create({
		email: 'SmellyHead@gmail.com',
		name: 'James',
		gender: 'male',
		profile_pic_url: "http://img1.wikia.nocookie.net/__cb20081205183737/desencyclopedie/images/4/4b/Geek.jpg"
		mood: 'party',
		location: 'E1 6BX'
	}, function(err, james) {
		// console.log(err);
		james.likes.push(mathilda._id);
		console.log('this is James likes ', james.likes);
	// James doesnt like Lauren
		User.create({
			email: "lookatmeiamlauren@gmail.com",
			name: 'Lauren',
			gender: 'female',
			profile_pic_url: 'http://msutoday.msu.edu/_/img/assets/2013/deborah-feltz.jpg',
			mood: 'chatty',
			location: 'SW8 1SP'
		}, function(err, lauren) {
				james.dislikes.push(lauren._id);
				console.log('James dislikes lauren, here are his dislikes ', james.dislikes);
				User.create({
					email: 'Jdawgyall@gmail.com',
					name: 'Jeremy',
					gender: 'male',
					profile_pic_url: ''
					mood: 'surprise me',

					location: 'W1D 4UR'
				}, function(err, jeremy) {
					if (!err) console.log ('jeremy created');
					User.create({
						email: 'lalalala@gmail.com',
						name: 'Lexie',
						gender: 'female',
						profile_pic_url: 'https://media.licdn.com/mpr/mpr/shrinknp_400_400/AAEAAQAAAAAAAAORAAAAJDJjOTkxM2RmLTljYTMtNGVhOS04NjVmLTVmODJiNTY5YmI0Ng.jpg',
						mood: 'surprise me',
						location: 'EC4N 5AW'
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
