let express = require("express");
let docker = require("../libs/docker.js");
let router = express.Router();

let models = require('../models');

router.get("/", function(req, res, next) {
    res.send('Thanks to check documention for API use');
});

router.get("/api/services", function(req, res, next) {	
	docker.list(function(result){res.send(JSON.stringify(result));});
});

router.get("/api/service/:id", function(req, res, next) {
    res.send('get ' + req.params.id + ' informations');
});


//User-related routes

router.get("/api/users", function(req, res, next) {
    models.collections.user.find().exec(function(err, result) {
    if(err) return res.json({ err: err }, 500);
    res.json(result);
  });
});

module.exports = router;