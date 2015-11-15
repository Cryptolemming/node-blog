var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var Post = new Schema({
	title: String,
	date: { type: Date, default: Date.now },
	body: String
});

module.exports = mongoose.model('posts', Post);
