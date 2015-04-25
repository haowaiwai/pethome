var express = require('express');
var apn = require('apn');
var router = express.Router();
var ObjectID=require('mongodb').ObjectID;

router.post('/reg', function(req, res, next) {
	var  mongodb = require('mongodb');
	var  server  = new mongodb.Server('localhost', 27017, {auto_reconnect:true});
	var  db = new mongodb.Db('petHome', server, {safe:true});

	if ((typeof(req.body.uid) == "undefined")||(typeof(req.body.password) == "undefined")) {
		json = {"result" : 2,"reason" : ""};
		res.send(json);
		return;
	}
	db.open(function(err, db){
		if(!err){
			db.collection('doctor',{safe:true}, function(err, collection){
				if(err){
					console.log(err);
				}
				collection.find({"uid":req.body.uid}).toArray(function(err, docs) {
					if(docs.length == 0) {
						collection.insert(req.body,{safe:true},function(err, result){
							db.close();
							json = {"result" : 0,"reason" : ""};
							res.send(json);
						});
					} else {
						db.close();
						json = {"result" : 1,"reason" : ""};
						res.send(json);
					}
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

	if ((typeof(req.body.uid) == "undefined")||(typeof(req.body.password) == "undefined")) {
		json = {"result" : 2,"reason" : ""};
		res.send(json);
		return;
	}
	db.open(function(err, db){
		if(!err){
			db.collection('doctor',{safe:true}, function(err, collection){
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

router.post('/bind', function(req, res, next) {
	var  mongodb = require('mongodb');
	var  server  = new mongodb.Server('localhost', 27017, {auto_reconnect:true});
	var  db = new mongodb.Db('petHome', server, {safe:true});
	db.open(function(err, db){
		if(!err){
			db.collection('doctor',{safe:true}, function(err, collection){
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

function notify(token,content) {
	//var token = '69c16e9040bf267b9d81b3ae53e7d1ab8e5b0a5f4e36a0fb9c96273b632a9504'; //长度为64的设备Token
	var options = { "production":true,"passphrase":"1234","cert":"cert1.pem","key":"key1.pem" };
	var apnConnection = new apn.Connection(options);
	var myDevice = new apn.Device(token);
	var note = new apn.Notification();
	 
	note.expiry = Math.floor(Date.now() / 1000) + 60;
	note.badge = 3;
	note.alert = content;
	note.payload = {'messageFrom': 'Caroline'};
	 
	apnConnection.on('connected',function() {
		console.log("Connected");
	});
	apnConnection.on('transmitted',function(notification, device) {
		console.log("Notificationtransmitted to:" + device.token.toString('hex'));
	});
	apnConnection.on('transmissionError',function(errCode, notification, device) {
		console.error("Notificationcaused error: " + errCode + " for device ", device,notification);
	});
	apnConnection.on('timeout',function () {
		console.log("ConnectionTimeout");
	});
	apnConnection.on('disconnected',function() {
		console.log("Disconnectedfrom APNS");
	});
	apnConnection.on('socketError',console.error);
	apnConnection.pushNotification(note, myDevice);
}

router.post('/notify', function(req, res, next) {
	var  mongodb = require('mongodb');
	var  server  = new mongodb.Server('localhost', 27017, {auto_reconnect:true});
	var  db = new mongodb.Db('petHome', server, {safe:true});
	db.open(function(err, db){
		if(!err){
			if (typeof(req.body.pid) == "undefined") {
			} else {
				db.collection('pet',{safe:true}, function(err, collection){
					if(err){
						console.log(err);
					}
					var objectid = req.body.pid;
					if(req.body.pid.length == 24) {
						objectid = ObjectID(objectid);
					}
					collection.findOne({_id:objectid},function(err, doc) {
						if(doc == null) return;
						db.collection('user',{safe:true}, function(err, collection){
							if(err){
								console.log(err);
							}
							collection.find({uid:doc.uid}).toArray(function(err, docs) {
								notify(docs[0].deviceToken,req.body.content);
								db.close();
							});
						});
					});
				});
			}
		}
	}); 
	json = {"result" : 0,"reason" : ""};
	res.send(json);
});

module.exports = router;

