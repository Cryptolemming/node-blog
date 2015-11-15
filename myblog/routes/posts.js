var express = require('express'),
	router = express.Router(),
	mongoose = require('mongoose'),
	bodyParser = require('body-parser'),
	methodOverride = require('method-override');

// methodOverride to allow DELETE and PUT
router.use(bodyParser.urlencoded({ extended: true }))
router.use(methodOverride(function(req, res){
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    var method = req.body._method
    delete req.body._method
    return method
  }
}));

// REST operations for posts 
router.route('/')
	// GET a post
	.get((req, res, next) => {
		mongoose.model('Post').find({}, (err, posts) => {
			if(err) {
				return console.error(err);
			} else {
				res.format({
					html: () => {
						res.render('posts/index', {
							title: 'All Posts',
							'posts': posts
						});
					},
					json: () => {
						res.json(posts);
					}
				});
			}
		});
	})
	// POST a new post
	.post((req, res) => {
		var title = req.body.title;
		var date = req.body.date;
		var body = req.body.body;

		mongoose.model('Post').create({
			title: title,
			date: date,
			body: body
		}, (err, post) => {
			if(err) {
				res.send('There was a problem creating the post.');
			} else {
				console.log('POST creating new post: ' + post);
				res.format({
					html: () => {
						res.location('posts');
						res.redirect('/posts');
					}
				});
			}
		})
	});

// GET new post
router.get('/new', (req, res) => {
	res.render('posts/new', { title: 'Add New Post'});
});

// middleware to validate post by id
router.param('id', (req, res, next, id) => {
	mongoose.model('Post').findById(id, (err, post) => {
		if(err) {
			console.log(id + ' was not found');
			res.status(404)
			var err = new Error('Not Found');
			err.status = 404;
			res.format({
				html: () => {
					next(err);
				},
				json: () => {
					res.json({message : err.status + ' ' + err});
				}
			});
		} else {
			req.id = id;
			next();
		}
	});
});

// GET individual post
router.route('/:id')
	.get((req, res) => {
		mongoose.model('Post').findById(req.id, (err, post) => {
			if(err) {
				console.log('GET Error: There was a problem retrieving the post: ' + err);
			} else {
				console.log('GET Retrieving Post with ID: ' + post._id);
				var newPostDate = post.date.toISOString();
				newPostDate = newPostDate.substring(0, newPostDate.indexOf('T'))
				res.format({
					html: () => {
						res.render('posts/show', {
							'newPostDate' : newPostDate,
							'post' : post
						});
					},
					json: () => {
						res.json(post);
					}
				});
			}
		});
	});

// Edit and delete a post
router.route('/:id/edit')
	.get((req, res) => {
		mongoose.model('Post').findById(req.id, (err, post) => {
			if(err) {
				console.log('GET Error: There was a problem retrieving the post: ' + err);
			} else {
				console.log('GET Retrieving Post with ID: ' + post._id);
			var newPostDate = post.date.toISOString();
			newPostDate = newPostDate.substring(0, newPostDate.indexOf('T'))
				res.format({
					html: () => {
						res.render('posts/edit', {
							title: 'Post' + post._id,
							'newPostDate': newPostDate,
							'post': post
						});
					},
					json: () => {
						res.json(post);
					}
				});
			}
		});
	})

	.put((req, res) => {
		var title = req.body.title;
		var date = req.body.date;
		var body = req.body.body;

		mongoose.model('Post').findById(req.id, (err, post) => {
			post.update({
				title: title,
				date: date,
				body: body
			}, (err, postID) => {
				if(err) {
					res.send('There was a problem updating the post: ' + err);
				} else {
					res.format({
						html: () => {
							res.redirect('/posts/' + post._id);
						},
						json: () => {
							res.json(post);
						}
					});
				}
			})
		});
	})

	.delete((req, res) => {
		mongoose.model('Post').findById(req.id, (err, post) => {
			if(err) {
				return console.error(err);
			} else {
				post.remove((err, post) => {
					if(err) {
						return console.error(err);
					} else {
						console.log('DELETE removing Post with ID: ' + post._id);
						res.format({
							html: () => {
								res.redirect('/posts');
							},
							json: () => {
								res.json({message: 'deleted',
									item: post
								})
							}
						});
					}
				});
			}
		});
	});

module.exports = router;