var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Post = mongoose.model('posts');

/* GET home page. */
router.get('/', (req, res, next) => {
  Post.find((err, posts) => {
  	res.render('index', {posts: posts});
  }).limit(10);
});

module.exports = router;

