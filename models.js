var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/moodsdb"); // random moodsdb title, should i change?

// defining the blueprint for User
var UserSchema = new mongoose.Schema({
	display_name: {type: String, required: true},
	email: {type: String, unique: true, required: true },
	password: {type: String, unique: true, required: true }, // clearly needs to be changed
	dob: {type: String, required: true, required: true},  // or "date" type?  see note on DOB vs Set age
	gender: {type: String, required: true, required: true},
	// looking_for: {type: String, default: ''}, this will be next step as it requires validation with gender
	profile_pic_url: {type: String, default: '' },
	all_pics_url: {type: Array, default: [] },
	mood: {type: Array, default: []}, // see note on validations on the mood
	location: {type: String, default: ''}, // TBD if it is String
	xxxxxxx: {type: Array, default: []}
});




// creating a mongoose Food model to allow us to instantiate new food documents;
var User = mongoose.model('User', UserSchema);

// making food object available to other enviroments
module.exports.Post = Post;
module.exports.Comment = Comment;


// NOTES - NOTES - NOTES - NOTES NOTES - NOTES

// Dates - see http://mongoosejs.com/docs/schematypes.html
// Built-in Date methods are not hooked into the mongoose change tracking logic which in English means
// that if you use a Date in your document and modify it with a method like setMonth(), mongoose will be 
// unaware of this change and doc.save() will not persist this modification. If you must modify Date types 
// using built-in methods, tell mongoose about the change with doc.markModified('pathToYourDate') before saving.

// need to Add validations on the mood: can only be within a pre-selected set 
// -> AVOID anyone fiddling with the html source and creating a new mood

// where to put the password?

