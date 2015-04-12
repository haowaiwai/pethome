var express = require('express');
var router = express.Router();
var fs = require('fs');

router.post('/reg', function(req, res, next) {
	var  mongodb = require('mongodb');
	var  server  = new mongodb.Server('localhost', 27017, {auto_reconnect:true});
	var  db = new mongodb.Db('petHome', server, {safe:true});

	db.open(function(err, db){
		if(!err){
			db.collection('user',{safe:true}, function(err, collection){
				if(err){
					console.log(err);
				}
				collection.insert(req.body,{safe:true},function(err, result){
					db.close();
				});
			});
		}
	}); 
	json = {"result" : 0,"reason" : ""};
	res.send(json);
});

router.post('/login', function(req, res, next) {
	var  mongodb = require('mongodb');
	var  server  = new mongodb.Server('localhost', 27017, {auto_reconnect:true});
	var  db = new mongodb.Db('petHome', server, {safe:true});

	db.open(function(err, db){
		if(!err){
			db.collection('user',{safe:true}, function(err, collection){
				if(err){
					console.log(err);
				}
				collection.find(req.body).toArray(function(err, docs) {
					if(docs.length == 0) {
						json = {"result" : 1,"reason" : ""};
						res.send(json);
					} else {
						json = {"result" : 0,"reason" : ""};
						res.send(json);
					}
					db.close();
				});
			});
		}
	}); 
});

router.post('/pet', function(req, res, next) {
	var  mongodb = require('mongodb');
	var  server  = new mongodb.Server('localhost', 27017, {auto_reconnect:true});
	var  db = new mongodb.Db('petHome', server, {safe:true});
	db.open(function(err, db){
		if(!err){
			db.collection('pet',{safe:true}, function(err, collection){
				if(err){
					console.log(err);
				}
				collection.count({}, function(err, count){
					collection.find({"uid":req.body.uid}).toArray(function(err,docs){
						res.send(docs);
						db.close();
					}); 
				});
			});
		}
	}); 
});

router.post('/bind', function(req, res, next) {
	var  mongodb = require('mongodb');
	var  server  = new mongodb.Server('localhost', 27017, {auto_reconnect:true});
	var  db = new mongodb.Db('petHome', server, {safe:true});
	db.open(function(err, db){
		if(!err){
			db.collection('user',{safe:true}, function(err, collection){
				if(err){
					console.log(err);
				}
				collection.update({"uid":req.body.uid}, {$set:req.body}, {safe:true}, function(err, result){
					db.close();
				});
			});
		}
	}); 
	json = {"result" : 0,"reason" : ""};
	res.send(json);
});

router.post('/upload/:id', function(req, res, next) {
	var upfile = req;
	console.log(req.params.id);
	upfile = upfile.files.file;
	var files = [];
	if (upfile instanceof  Array) {
		files = upfile;
	} else {
		files.push(upfile);
	}
	for (var i = 0; i < files.length; i++) {
		var file = files[i];
		var path = file.path;
		var name = file.name;
		var target_path = "./public/images/user/" + name;
		fs.rename(path, target_path, function (err) {
			if (err) throw err;
		});
	}
	json = {"result" : 0,"reason" : ""};
	res.send(json);
});

module.exports = router;

