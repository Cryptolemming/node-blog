//mongodb
var mongoose = require('mongoose');
var User = require('./models/admin');

//auth
exports.getLogin = function (req, res) {
    console.log(req.user);
    if (req.user) {

        return res.send({
            success: true,
            user: req.user
        });

    }

    res.send({
        success: false,
        message: 'not authorized'
    });
};


exports.register = function (req, res) {
    User.register(new User({
        username: req.body.username
    }), req.body.password, function (err, user) {
        if (err) {
            console.log(err);
            return res.send(err);
        } else {
            res.send({
                success: true,
                user: user
            });
        }
    });
};

exports.login = function (req, res, next) {

    User.authenticate()(req.body.username, req.body.password, function (err, user, options) {
        if (err) return next(err);
        if (user === false) {
            res.send({
                message: options.message,
                success: false
            });
        } else {
            req.login(user, function (err) {
                res.send({
                    success: true,
                    user: user
                });
            });
        }
    });

};

exports.logout = function (req, res) {
    req.logout();
    res.redirect('/');
};