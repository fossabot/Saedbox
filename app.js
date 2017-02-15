var express = require("express"),
		_ = require('@sailshq/lodash'),
    app = express(),
		cors = require('cors'),
    path = require('path'),
		Waterline = require('waterline'),
		helmet = require('helmet'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    methodOverride = require('method-override'),
		fs = require('fs'),
		passport = require('passport'),
		bypass=(process.env.DOCKER_SOCKET=="test");

if (fs.existsSync('./config.json')) {
	global.config = require('./config.json');
	var whitelist = config.front;
}

var models = require('./models'),
	  connections = require('./config/connections.js');

//Loading DB adapters for waterline
var diskAdapter = require('sails-disk');

models.initialize(connections, function(err, models) {
  if(err) throw err;

  app.models = models.collections;
  app.connections = connections.connections;

  app.use(helmet()); // Add multiple securities
  app.disable('x-powered-by'); //Remove the indication that the app is powered by express
  app.use(cookieParser()); // read cookies (needed for auth)
  app.use(bodyParser.urlencoded({ extended: false })); // get information from url-encoded data
  app.use(bodyParser.json()); // get information from html forms
  app.use(methodOverride());

  // passport initialization
  app.set('trust proxy', 1) // trust first proxy
	app.use(session({ // session params
		secret: config.secret,
		name : 'sessionId',
		resave: false,
	  saveUninitialized: true
	}));
	app.use(passport.initialize());
	app.use(passport.session()); // persistent login sessions

  require('./config/passport')(passport); //passport config

  var routes = require("./routes/api");

	// allow CORS:
	if (!bypass)
		app.use(cors({
	    origin: function(origin, callback){
	    	console.log(origin);
	      var originIsWhitelisted = whitelist.indexOf(origin) !== -1;
	      callback(originIsWhitelisted ? null : 'Bad Request', originIsWhitelisted)},
	    credentials: true
	  }))

  app.use(config.webroot || "/", routes);

  app.use(function(req, res, next) {
		res.status(404);
		res.send({"data":{
			code: 404,
			error : 'Not Found',
		}});
		return;
  });

  //Bootstraping admin group and account
  var bootstrap = require('./config/bootstrap')(models,config);

  app.listen(config.port || 9000);
});
