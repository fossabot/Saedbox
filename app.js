var express = require("express"),
	 _ = require('@sailshq/lodash'),
    app = express(),
    Waterline = require('waterline'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override');


var path = require('path'),
	Waterline = require('waterline'),
	models = require('./models'),
	connections = require('./config/connections.js'),
	routes = require("./routes/api");

//Loading DB adapters for waterline
var diskAdapter = require('sails-disk');

app.use('/', routes);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride());

app.use(function(req, res, next) {
  var err = new Error('Page introuvable');
  err.status = 404;
  next(err);
});

models.initialize(connections, function(err, models) {
  if(err) throw err;

  app.models = models.collections;
  app.connections = connections.connections;

app.listen(9002);
});