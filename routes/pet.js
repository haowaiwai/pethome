var express = require('express');
var moment = require('moment');
var router = express.Router();
var ObjectID=require('mongodb').ObjectID;

router.post('/list', function(req, res, next) {
	var  mongodb = require('mongodb');
	var  server  = new mongodb.Server('localhost', 27017, {auto_reconnect:true});
	var  db = new mongodb.Db('petHome', server, {safe:true});
	console.log(req.body);
	page = req.body.page;
	page = parseInt(page);
	db.open(function(err, db){
		if(!err){
			db.collection('pet',{safe:true}, function(err, collection){
				if(err){
					console.log(err);
				}
				collection.count({}, function(err, count){
					collection.find().skip((page-1)*10).limit(10).toArray(function(err,docs){
						json = {};
						json.total_results = count;
						json.page = page;
						json.results = docs;
						res.send(json);
						db.close();
					}); 
				});
			});
		}
	}); 
});

router.post('/info', function(req, res, next) {
	var  mongodb = require('mongodb');
	var  server  = new mongodb.Server('localhost', 27017, {auto_reconnect:true});
	var  db = new mongodb.Db('petHome', server, {safe:true});
	db.open(function(err, db){
		if(!err){
			db.collection('pet',{safe:true}, function(err, collection){
				if(err){
					console.log(err);
				}
				console.log(req.body);
				collection.update({"_id":ObjectID(req.body.id)}, {$set:req.body}, {safe:true}, function(err, result){
					db.close();
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
	var  db = new mongodb.Db('petHome', server, {safe:true});
	db.open(function(err, db){
		if(!err){
			console.log(req.body);
			db.collection('pet',{safe:true}, function(err, collection){
				if(err){
					console.log(err);
				}
				collection.update({"_id":ObjectID(req.body.id)}, {$set:req.body}, {safe:true}, function(err, result){
					db.collection('health',{safe:true}, function(err, collection){
						if(err){
							console.log(err);
						}
						req.body.t = req.body.temperatureArray[0].T;
						req.body.a = req.body.temperatureArray[0].A;
						collection.insert(req.body,{safe:true},function(err, result){
							
		 				});
		 				//console.log(global.set);
		 				/*for (var i = 0; i < global.set.data.length; i++) {
		 					var now = moment().format("YYYY-MM-DD HH:mm:ss");
		 					var start = now.substring(0,11) + global.set.data[i].StartTime;
		 					var end = now.substring(0,11) + global.set.data[i].EndTime;
		 					var upload = req.body.date;
		 					if((upload > start)&&(upload < end)) {
		 						var key = start + global.set.data[i].EndTime;
		 						var TemperatureMin = global.set.data[i].TemperatureMin;
		 						var TemperatureMax = global.set.data[i].TemperatureMax;
		 						var RunCount = global.set.data[i].RunCount;
		 						var StartTime = start;
		 						var EndTime = end;
		 						db.collection('push',{safe:true}, function(err, collection){
									if(err){
										console.log(err);
									}
									collection.find({'id':key}).toArray(function(err, docs) {
										if(docs.length == 0) {
											var json = {};
											json.id = key;
											json.t = [];
											json.a = [];
											json.t.push(req.body.temperatureArray[0].T);
											json.a.push(req.body.temperatureArray[0].A);
											json.StartTime = StartTime;
											json.EndTime = EndTime;
											json.TemperatureMin = TemperatureMin;
											json.TemperatureMax = TemperatureMax;
											json.RunCount = RunCount;
											json.push = 0;
											json.send = 0;
											collection.insert(json,{safe:true},function(err, result){
												db.close();
					 						}); 
										} else {
											collection.update({"id":key}, {$push:{'t':req.body.temperatureArray[0].T,'a':req.body.temperatureArray[0].A}}, {safe:true}, function(err, result){
												db.close();
											});
										}
									});
									
								});
		 						break;
		 					}
		 				}*/
		 				/*var now = moment().format("YYYY-MM-DD HH:mm:ss");
		 				var start = now.substring(0,11) + global.set.StartTime;
		 				var end = now.substring(0,11) + global.set.EndTime;
		 				collection.find({"$and":[{"date":{"$gt":start}},{"date":{"$lt":end}}]}).sort({'date':1}).toArray(function(err, docs) {
		 					if(docs.length >= 2 && global.set.Push == 0) {
		 						if(docs[docs.length-1].a - docs[0].a < global.set.RunCount) {
		 							console.log("bbbbbbbbbb");
		 							global.set.Push = 1;
		 						}
		 					}
		 					db.close();
		 				});*/
					});
				});
			});
		}
	}); 
	json = {"result" : 0,"reason" : ""};
	res.send(json);
});

router.post('/add', function(req, res, next) {
	var  mongodb = require('mongodb');
	var  server  = new mongodb.Server('localhost', 27017, {auto_reconnect:true});
	var  db = new mongodb.Db('petHome', server, {safe:true});
	db.open(function(err, db){
		if(!err){
			db.collection('pet',{safe:true}, function(err, collection){
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

router.post('/mode', function(req, res, next) {
	var  mongodb = require('mongodb');
	var  server  = new mongodb.Server('localhost', 27017, {auto_reconnect:true});
	var  db = new mongodb.Db('petHome', server, {safe:true});
	db.open(function(err, db){
		if(!err){
			db.collection('pet',{safe:true}, function(err, collection){
				if(err){
					console.log(err);
				}
				collection.update({"_id":ObjectID(req.body.id)}, {$set:req.body}, {safe:true}, function(err, result){
					db.close();
				});
			});
		}
	}); 
	json = {"result" : 0,"reason" : ""};
	res.send(json);
});

module.exports = router;

