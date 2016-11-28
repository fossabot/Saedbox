let express = require("express");
let docker = require("../libs/docker.js");
let router = express.Router();
let HelperResponse = require('../libs/Helpers/Response.js');
let resp = new HelperResponse();

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
	} else {
		res.send("That is not a correct use");
	}
});

module.exports = router;