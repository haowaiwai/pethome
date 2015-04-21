var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	console.log(global.set);
	res.render('index', global.set);
});

router.get('/list', function(req, res, next) {
	console.log(global.set);
	res.render('list', global.set);
});

router.get('/map', function(req, res, next) {
	console.log(global.set);
	res.render('map', global.set);
});

module.exports = router;
