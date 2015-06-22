// put our models here
var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/moodsdb"); // random moodsdb title, should i change?

// defining the blueprint for Post and Comment 
var PostSchema = new mongoose.Schema({
	title: {type: String, default: ''},
	author: {type: String, default: ''},
	text: {type: String, default: ''},
	comments: {type: Array, default: []}
});
var CommentSchema = new mongoose.Schema({
	content: {type: String, default: ''},
	author: {type: String, default: ''},
});



// creating a mongoose Food model to allow us to instantiate new food documents;
var Post = mongoose.model('Post', PostSchema);
var Comment = mongoose.model('Comment', CommentSchema);

// making food object available to other enviroments
module.exports.Post = Post;
module.exports.Comment = Comment;