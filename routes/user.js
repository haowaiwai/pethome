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

router.post('/article', function(req, res, next) {
	var  mongodb = require('mongodb');
	var  server  = new mongodb.Server('localhost', 27017, {auto_reconnect:true});
	var  db = new mongodb.Db('petHome', server, {safe:true});
	db.open(function(err, db){
		if(!err){
			db.collection('article',{safe:true}, function(err, collection){
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

function insertAttachment(id,attachments) {
	var  mongodb = require('mongodb');
	var  server  = new mongodb.Server('localhost', 27017, {auto_reconnect:true});
	var  db = new mongodb.Db('petHome', server, {safe:true});
	db.open(function(err, db){
		if(!err){
			db.collection('article',{safe:true}, function(err, collection){
				if(err){
					console.log(err);
				}
				for (var i = 0; i < attachments.length-1; i++) {
					collection.update({"uid":id}, {$push:{'attachments':attachments[i]}}, {safe:true}, function(err, result){
						
					});
				}
				collection.update({"uid":id}, {$push:{'attachments':attachments[attachments.length-1]}}, {safe:true}, function(err, result){
					db.close();
				});
				/*collection.update({"uid":id}, {$push:{'attachments':attachments}}, {safe:true}, function(err, result){
					db.close();
				});*/
			});
		}
	});
}

router.post('/upload/:id', function(req, res, next) {
	var upfile = req;
	console.log(req.params.id);
	console.log(upfile.files);
	upfile = upfile.files.file;
	var files = [];
	if (upfile instanceof Array) {
		files = upfile;
	} else {
		files.push(upfile);
	}
	var attachments = [];
	for (var i = 0; i < files.length; i++) {
		var file = files[i];
		var path = file.path;
		var name = file.name;
		var target_path = "./public/images/user/" + name;
		fs.rename(path, target_path, function (err) {
			if (err) throw err;
		});
		attachments.push('http://60.206.36.139/images/user/'+name);
	}
	insertAttachment(req.params.id,attachments)
	json = {"result" : 0,"reason" : ""};
	res.send(json);
});

router.post('/list', function(req, res, next) {
	var  mongodb = require('mongodb');
	var  server  = new mongodb.Server('localhost', 27017, {auto_reconnect:true});
	var  db = new mongodb.Db('petHome', server, {safe:true});
	page = req.body.page;
	page = parseInt(page);
	db.open(function(err, db){
		if(!err){
			db.collection('article',{safe:true}, function(err, collection){
				if(err){
					console.log(err);
				}
				collection.count({}, function(err, count){
					if (typeof(req.body.uid) == "undefined") {
						collection.find().skip((page-1)*1).limit(1).toArray(function(err,docs){
							res.send(docs);
							db.close();
						});
					} else {
						collection.find({"id":req.body.uid}).skip((page-1)*1).limit(1).toArray(function(err,docs){
							res.send(docs);
							db.close();
						}); 
					}
				});
			});
		}
	}); 
});

router.post('/set', function(req, res, next) {
	var  mongodb = require('mongodb');
	var  server  = new mongodb.Server('localhost', 27017, {auto_reconnect:true});
	var  db = new mongodb.Db('petHome', server, {safe:true});
	db.open(function(err, db){
		if(!err){
			db.collection('set',{safe:true}, function(err, collection){
				if(err){
					console.log(err);
				}
				collection.update({"id":1}, {$set:req.body}, {safe:true}, function(err, result){
					global.set = req.body;
					db.close();
				});
			});
		}
	}); 
	json = {"result" : 0,"reason" : ""};
	res.send(json);
});
module.exports = router;

