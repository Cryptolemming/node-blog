var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Post = mongoose.model('posts');

var isAuthenticated = (req, res, next) => {
	if (req.isAuthenticated())
		return next();
	res.redirect('/posts');
}

module.exports = (passport) => {

	/* posts new */
	router

		// Login
		.get('/login', (req, res) => {
			res.render('posts/login');
		})

		.post('/login', passport.authenticate('login', {
			successRedirect: '/',
			failureRedirect: '/posts/login',
			failureFlash: true
		}))

		// Registration
		.get('/signup', (req, res) => {
			res.render('posts/signup');
		})

		.post('/signup', passport.authenticate('signup', {
			successRedirect: '/login',
			failureRedirect: '/signup',
			failureFlash: true
		}))

		// GET new posts route and form
		.get('/new', isAuthenticated, (req, res) => {
			res.render('posts/new', { title: 'Add a new Post' });
		})
		// POST new post data
		.post('/new', isAuthenticated, (req, res) => {
			new Post({
				title: req.body.title,
				date: req.body.date,
				body: req.body.body
			})
			// Save post to db 
			.save((err, post) => {
				res.redirect('/posts');
			});
		});

	/* posts displays*/
	// posts index
	router.get('/', (req, res) => {
		Post.find((err, posts) => {
			res.render(
				'posts/index', 
				{
					title: 'Get All the Posts!',
					posts: posts 
				}
			);
		});
	});

	// single post
	router.get('/:title', (req, res) => {
		var query = {"title": req.params.title};
		Post.findOne(query, (err, post) => {
			res.render(
				'posts/post',
				{
					title: post.title,
					date: post.date,
					body: post.body
				}
			);
		});
	});

	/* posts edit */
	router
		// GET the post
		.get('/edit/:title', isAuthenticated, (req, res) => {
			var query = {'title': req.params.title};
			Post.findOne(query, (err, post) => {
				res.render(
					'posts/edit',
					{
						title: post.title,
						date: post.date,
						body: post.body
					}
				);
			});
		})
		// PUT to update the post
		.put('/edit/:title', isAuthenticated, (req, res) => {
			var query = {'title': req.params.title};
			var update = {
				title: req.body.title,
				body: req.body.body
			};
			var options = {new: true};
			Post.findOneAndUpdate(query, update, options, (err, post) => {
				res.render(
					'posts/post',
					{
						title: post.title,
						date: post.date,
						body: post.body
					}
				);
			});
		})
		// DELETE to delete a post
		.delete('/edit/:title', isAuthenticated, (req, res) => {
			var query = {'title': req.params.title};
			Post.findOneAndRemove(query, (err, posts) => {
				res.redirect('/');
			})
		});

	return router;

}

