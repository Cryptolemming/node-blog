var express = require('express');
var router = express.Router();

router.get('/', (req, res) => {
	res.send('Music Page');
});

module.exports = router;