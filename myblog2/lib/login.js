var LocalStrategy = require('passport-local').Strategy,
	User = ('../models/admin'),
	bCrypt = require('bcrypt-nodejs'),
	passport = require('passport');

module.exports = () => {

	passport.use('login', new LocalStrategy({
		passReqToCallback: true
	},
	(req, username, password, done) => {
		User.findOne({ 'username': username }, (err, user) => {

			if(err) {
				console.log(err);
				return done(err);
			}

			if(!user) {
				return done(null, false, req.flash('message', 'User Not Found.'));
			}

			if(!isValidPassword(user, password)) {
				return done(null, false, req.flash('message', 'Invalid Password'));
			}

			return done(null, user);
			
		});
	}));

	var isValidPassword = (user, password) => {
		return bCrypt.compareSync(password, user.password);
	}
}