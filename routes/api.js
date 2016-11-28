let express = require("express");
let docker = require("../libs/docker.js");
let router = express.Router();

router.get("/", function(req, res, next) {
    res.send('Thanks to check documention for API use');
});

router.get("/api/services", function(req, res, next) {
  	res.send('There is '+ JSON.stringify(docker.listContainers));
  	console.log(docker.list)
});

router.get("/api/service/:id", function(req, res, next) {
    res.send('get ' + req.params.id + ' informations');
});

module.exports = router;