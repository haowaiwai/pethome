var express = require('express');
var router = express.Router();

router.post('/list', function(req, res, next) {
	var  mongodb = require('mongodb');
	var  server  = new mongodb.Server('localhost', 27017, {auto_reconnect:true});
	var  db = new mongodb.Db('pet', server, {safe:true});
	page = req.body.page;
	page = parseInt(page);
	db.open(function(err, db){
		if(!err){
			db.collection('a',{safe:true}, function(err, collection){
				if(err){
					console.log(err);
				}
				collection.count({}, function(err, count){
					collection.find().skip((page-1)*1).limit(1).toArray(function(err,docs){
						json = {};
						json.total_results = count;
						json.page = page;
						json.results = docs;
						res.send(json);
					}); 
				});
			});
		}
	}); 
});

router.post('/info', function(req, res, next) {
	var  mongodb = require('mongodb');
	var  server  = new mongodb.Server('localhost', 27017, {auto_reconnect:true});
	var  db = new mongodb.Db('pet', server, {safe:true});
	page = req.body.page;
	page = parseInt(page);
	db.open(function(err, db){
		if(!err){
			db.collection('a',{safe:true}, function(err, collection){
				if(err){
					console.log(err);
				}
				console.log(req.body[0]);
				console.log(req.body[1]);
				collection.update(req.body[0], {$set:req.body[1]}, {safe:true}, function(err, result){
					console.log(result);
				});
			});
		}
	}); 
	json = {"result" : 0,"reason" : ""};
	res.send(json);
});

router.post('/health', function(req, res, next) {
	var  mongodb = require('mongodb');
	var  server  = new mongodb.Server('localhost', 27017, {auto_reconnect:true});
	var  db = new mongodb.Db('pet', server, {safe:true});
	page = req.body.page;
	page = parseInt(page);
	db.open(function(err, db){
		if(!err){
			db.collection('a',{safe:true}, function(err, collection){
				if(err){
					console.log(err);
				}
				console.log(req.body[0]);
				console.log(req.body[1]);
				collection.update(req.body[0], {$set:req.body[1]}, {safe:true}, function(err, result){
					console.log(result);
				});
			});
		}
	}); 
	json = {"result" : 0,"reason" : ""};
	res.send(json);
});

module.exports = router;

