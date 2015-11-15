var express = require('express');
var router = express.Router();

router.get('/', (req, res) => {
	res.send('Projects Page');
});

module.exports = router;