var express = require("express"),
	  _ = require('@sailshq/lodash'),
    app = express(),
    path = require('path'),
		Waterline = require('waterline'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
		fs = require('fs');
if (fs.existsSync('./config.json')) {
	global.config = require('./config.json');
}

var models = require('./models'),
	  connections = require('./config/connections.js');

//Loading DB adapters for waterline
var diskAdapter = require('sails-disk');

models.initialize(connections, function(err, models) {
  if(err) throw err;

  app.models = models.collections;
  app.connections = connections.connections;


  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(methodOverride());

  var routes = require("./routes/api");
	
	// allow CORS:
	app.use(function (req, res, next) {
	  res.setHeader('Access-Control-Allow-Origin', '*');
	  next();
	});

  app.use(config.webroot || "/", routes);

  app.use(function(req, res, next) {
		res.status(404);
		res.send({"data":{
			code: 404,
			error : 'Not Found',
		}});
		return;
  });

  app.listen(config.port || 9000);
});
