var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var fs = require('fs')
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');
var pet = require('./routes/pet');
var user = require('./routes/user');
var doctor = require('./routes/doctor');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
var logDirectory = __dirname + '/log'
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory)
var uploadDirectory = __dirname + '/public/images/user'
fs.existsSync(uploadDirectory) || fs.mkdirSync(uploadDirectory);
var logFile = logDirectory + "/pet.log";
var rotatingLogStream = require('file-stream-rotator').getStream({filename:logFile, frequency:"24h", verbose: false});
//app.use(logger('dev',{stream: accessLogStream}));
logger.token('type', function(req, res){ return JSON.stringify(req.body); })
app.use(logger(':method :url :status :type',{stream: rotatingLogStream}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(require('connect-multiparty')());

app.use('/', routes);
app.use('/users', users);
app.use('/pet', pet);
app.use('/user', user);
app.use('/doctor', doctor);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

var set;
function load() {
  var  mongodb = require('mongodb');
  var  server  = new mongodb.Server('localhost', 27017, {auto_reconnect:true});
  var  db = new mongodb.Db('petHome', server, {safe:true});

  db.open(function(err, db){
    if(!err){
      db.collection('set',{safe:true}, function(err, collection){
        if(err){
          console.log(err);
        }
        collection.findOne({},function(err, doc) {
          if(doc == null) {

          } else {
            console.log(doc);
            global.set = doc;
          }
        });
      });
    }
  }); 
}

load();

module.exports = app;
