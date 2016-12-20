let express = require("express");
let docker = require("../libs/docker.js");
let system = require("../libs/system.js");
let router = express.Router();

let HelperResponse = require('../libs/Helpers/Response.js');
let resp = new HelperResponse();

let models = require('../models');

//Get API base
router.get("/", function(req, res, next) {
	resp.send(res, 'Thanks to check documention for API use');
});

//Get services
router.get("/api/services", function(req, res, next) {
    docker.list(resp.send.bind(resp,res));
});

//Get Service ID's info
router.get("/api/services/:id", function(req, res, next) {
	var ID = req.params.id;
	docker.container(ID,resp.send.bind(resp,res));
});

//Stop/start Service
router.get("/api/services/:id/:action", function(req, res, next) {
	var ID = req.params.id;
	var action = req.params.action;
	if (req.params.action == "start") {
		docker.start(ID,resp.send.bind(resp,res));
	} else if (req.params.action == "stop") {
		docker.stop(ID,resp.send.bind(resp,res));
	}  else {
		res.send("That is not a correct use");
	}
});

//Delete Service
router.delete("/api/services", function (req, res, next) {
	var ID = req.body.id;
		docker.delete(ID,resp.send.bind(resp,res));
});

//Create new Service
router.post("/api/services", function(req, res, next) {
	var name = req.body.name;
	docker.new(name,resp.send.bind(resp,res));
});


//User-related routes

//List all users
router.get("/api/users", function(req, res, next) {
    models.collections.user.find().populate('group','containers').exec(function(err, result) {
    if(err) resp.sendError(res,err);
    resp.send(res,result);
  });
});

//Create a user
router.post('/api/users', function(req, res) {
    models.collections.user.create(req.body, function(err, model) {
    if(err) resp.sendError(res,err);
    resp.send(res,model);
  });
});

//Get User infos
router.get('/api/users/:id', function(req, res) {
    models.collections.user.populate('group').populate('container').findOne({ id: req.params.id }, function(err, model) {
    if(err) resp.sendError(res,err);
    resp.send(res,model);
  });
});

//Delete a user
router.delete('/api/users/:id', function(req, res) {
  models.collections.user.destroy({ id: req.params.id }, function(err) {
    if(err) resp.sendError(res,err);
    resp.send(res,{ status: 'ok' });
  });
});

//Update a user
router.put('/api/users/:id', function(req, res) {
  // Don't pass ID to update
  delete req.body.id;
  models.collections.user.update({ id: req.params.id }, req.body, function(err, model) {
    if(err) resp.sendError(res,err);
    resp.send(res,model);
  });
});


//Group-related routes

//List all groups
router.get("/api/groups", function(req, res, next) {
    models.collections.group.find().exec(function(err, result) {
    if(err) resp.sendError(res,err);
    resp.send(res,result);
  });
});

//Create a group
router.post('/api/groups', function(req, res) {
    models.collections.group.create(req.body, function(err, model) {
    if(err) resp.sendError(res,err);
    resp.send(res,model);
  });
});

//Get group infos
router.get('/api/groups/:id', function(req, res) {
    models.collections.group.findOne({ id: req.params.id }, function(err, model) {
    if(err) resp.sendError(res,err);
    resp.send(res,model);
  });
});

//Delete a user
router.delete('/api/groups/:id', function(req, res) {
  models.collections.group.destroy({ id: req.params.id }, function(err) {
    if(err) resp.sendError(res,err);
    resp.send(res,{ status: 'ok' });
  });
});

//Update a user
router.put('/api/groups/:id', function(req, res) {
  // Don't pass ID to update
  delete req.body.id;
  models.collections.group.update({ id: req.params.id }, req.body, function(err, model) {
    if(err) resp.sendError(res,err);
    resp.send(res,model);
  });
});

router.get('/api/system', function(req, res) {
	system.get(resp.send.bind(resp,res));
})

module.exports = router;
