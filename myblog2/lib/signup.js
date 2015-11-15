var LocalStrategy = require('passport-local').Strategy,
	User = ('../models/admin'),
	bCrypt = require('bcrypt-nodejs');

module.exports = (passport) => {

	passport.use('signup', new LocalStrategy({
		passReqToCallback: true
	},
	(req, username, password, done) => {
		findOrCreateUser = () => {
			User.findOne({ 'username': username },
				(err, user) => {
					// find the user
					if(err) {
						console.log('Error in Singup: ' + err);
						return done(err);
					}
					// user already exists
					if(user) {
						console.log('User already exists');
						return done(null, false, req.flash('message', 'User already exists'));
					} else {
						var newUser = new User();
						newUser.username = username;
						newUser.password = createHash(password);
					}

					if(!isValidPassword(user, password)) {
						return done(null, false, req.flash('message', 'Invalid Password'));
					}

					return done(null, user);
				}

			);
		};

		process.nextTick(findOrCreateUser);
	})
	);

	var createHash = (password) => {
		return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
	}
}