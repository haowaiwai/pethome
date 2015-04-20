var express = require('express');
var moment = require('moment');
var router = express.Router();

function push() {
	var apn = require('apn');
	var token = 'e4f56ffa4e318641fbaceec3af03b85e97d62a1bec512323e5e12dca1a4427a1';
	var options = { "production":true,"passphrase":"1234","cert":"cert2.pem","key":"key2.pem" };
	var apnConnection = new apn.Connection(options);
	var myDevice = new apn.Device(token);
	var note = new apn.Notification();
	note.expiry = Math.floor(Date.now() / 1000) + 60;
	note.badge = 3;
	note.alert = "胖妞体温有些过高";
	note.payload = {'messageFrom': 'Caroline'};
	apnConnection.on('connected',function() {
	console.log("Connected");
	})
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

function get() {
	var  mongodb = require('mongodb');
	var  server  = new mongodb.Server('localhost', 27017, {auto_reconnect:true});
	var  db = new mongodb.Db('petHome', server, {safe:true});

	db.open(function(err, db){
		if(!err){
			db.collection('push',{safe:true}, function(err, collection){
				if(err){
					console.log(err);
				}
				collection.find({ "push": 0,"send": 0 }).toArray(function(err, docs) {
					//var now = moment().format("YYYY-MM-DD HH:mm:ss");
					var now = "2015-04-20 19:00:00";
					var push = 0;
					var send =0;
					var key = null;
					for(var i=0;i<docs.length;i++) {
						if(now > docs[i].EndTime) {
							push = 1;
							if((docs[i].t[0] < docs[i].TemperatureMin)||(docs[i].t[0] > docs[i].TemperatureMax))
							{
								send = 1;
								key = docs[i].id;
								console.log("push()");
								break;
							}
							var a1 = docs[i].a[0];
							var len = docs[i].a.length; 
							var a2 = docs[i].a[len-1];
							if(a2 - a1 < docs[i].RunCount) {
								send = 1;
								key = docs[i].id;
								console.log("push()");
								break;
							}
						}
					}
					if(key != null) {
						collection.update({"id":key}, {$set:{"push":push,"send":send}}, {safe:true}, function(err, result){
							db.close();
						});
					} else {
						db.close();
					}
				});
			});
		}
	}); 
}


get();