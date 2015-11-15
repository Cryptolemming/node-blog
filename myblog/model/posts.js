var mongoose = require('mongoose');
var postSchema = new mongoose.Schema({
	title: String,
	date: { type: Date, default: Date.now },
	body: String
});

mongoose.model('Post', postSchema);