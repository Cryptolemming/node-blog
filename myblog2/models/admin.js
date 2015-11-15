var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	passportLocalMongoose = require('passport-local-mongoose');

var Admin = new Schema({
	uuid: {
		type: String,
		required: false
	},
	username: {
		type: String,
		required: true
	}
});

// plugging into Passport-Local-Mongoose provides username and password to schema by default
Admin.plugin(passportLocalMongoose);

module.exports = mongoose.model('admin', Admin);