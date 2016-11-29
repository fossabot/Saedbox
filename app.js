var express = require("express"),
	 _ = require('@sailshq/lodash'),
    app = express(),
    Waterline = require('waterline'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override');


var path = require('path'),
	Waterline = require('waterline'),
	models = require('./models'),
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
  
  app.use('/', routes);

  app.use(function(req, res, next) {
    var err = new Error('Page introuvable');
    err.status = 404;
    next(err);
  });

  app.listen(9002);
});