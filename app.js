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
logger = require('morgan')
bypass=(process.env.DOCKER_SOCKET=="test");

//checking config file exist
if (fs.existsSync('./config/config.json')) {
	global.config = require('./config/config.json');
}
var version = require('./package.json').version

var models = require('./models'),
connections = require('./libs/db/connections.js');

//Loading DB adapters for waterline
var diskAdapter = require('sails-disk');

models.initialize(connections, function(err, models) {
	if(err) throw err;
	if(app.get('env') == 'development') {
		app.use(logger('dev'));
	}
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

	require('./libs/db/passport')(passport); //passport config

	var routes = require("./routes/api");

	// allow CORS:
	if (!bypass)
	app.use(cors({
		origin: true,
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
	var bootstrap = require('./libs/db/bootstrap')(models,config);

	app.listen(config.port || 9000);
	console.info("Saedbox version : "+version)
	console.warn("\n/!\\Saedbox is currently not suitable for production use\n"+
	             "/!\\We can not guarantee the security of your data")
	console.info("\nApp Started on port : "+ config.port || 9000)
});
