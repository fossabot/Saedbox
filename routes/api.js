var express = require('express');
var HelperResponse = require('../libs/Helpers/Response.js');
var resp = new HelperResponse();
var router = express.Router();
var docker = require("../libs/docker.js");

router.get("/", function(req, res, next) {
	resp.send(res, 'Thanks to check documention for API use');
});

router.get("/api/services", function(req, res, next) {
    docker.list(resp.send.bind(resp,res));
});

router.get("/api/service/:id", function(req, res, next) {
	var ID = req.params.id;
	docker.container(ID,resp.send.bind(resp,res));
});

router.get("/api/service/:id/:action", function(req, res, next) {
	var ID = req.params.id;
	var action = req.params.action;
	if (req.params.action == "start") {
		docker.start(ID,resp.send.bind(resp,res));
	} else if (req.params.action == "stop") {
		docker.stop(ID,resp.send.bind(resp,res));		
	} else if (req.params.action == "delete") {
		docker.delete(ID,resp.send.bind(resp,res));
	} else {
		res.send("That is not a correct use");
	}
});

router.post("/api/service", function(req, res, next) {
	var name = req.body.name;
	docker.new(name,resp.send.bind(resp,res));
});

module.exports = router;