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

//List all users
router.get("/api/users", function(req, res, next) {
    models.collections.user.find().exec(function(err, result) {
    if(err) return res.json({ err: err }, 500);
    res.json(result);
  });
});

//Create a user
router.post('/api/users', function(req, res) {
  	models.collections.user.create(req.body, function(err, model) {
    if(err) return res.json({ err: err }, 500);
    res.json(model);
  });
});

//Get User infos
router.get('/api/users/:id', function(req, res) {
    models.collections.user.findOne({ id: req.params.id }, function(err, model) {
    if(err) return res.json({ err: err }, 500);
    res.json(model);
  });
});

//Delete a user
router.delete('/api/users/:id', function(req, res) {
  models.collections.user.destroy({ id: req.params.id }, function(err) {
    if(err) return res.json({ err: err }, 500);
    res.json({ status: 'ok' });
  });
});

//Update a user
router.put('/api/users/:id', function(req, res) {
  // Don't pass ID to update
  delete req.body.id;
  models.collections.user.update({ id: req.params.id }, req.body, function(err, model) {
    if(err) return res.json({ err: err }, 500);
    res.json(model);
  });
});


//Group-related routes

//List all groups
router.get("/api/groups", function(req, res, next) {
    models.collections.group.find().exec(function(err, result) {
    if(err) return res.json({ err: err }, 500);
    res.json(result);
  });
});

//Create a group
router.post('/api/groups', function(req, res) {
    models.collections.group.create(req.body, function(err, model) {
    if(err) return res.json({ err: err }, 500);
    res.json(model);
  });
});

//Get group infos
router.get('/api/groups/:id', function(req, res) {
    models.collections.group.findOne({ id: req.params.id }, function(err, model) {
    if(err) return res.json({ err: err }, 500);
    res.json(model);
  });
});

//Delete a user
router.delete('/api/groups/:id', function(req, res) {
  models.collections.group.destroy({ id: req.params.id }, function(err) {
    if(err) return res.json({ err: err }, 500);
    res.json({ status: 'ok' });
  });
});

//Update a user
router.put('/api/groups/:id', function(req, res) {
  // Don't pass ID to update
  delete req.body.id;
  models.collections.group.update({ id: req.params.id }, req.body, function(err, model) {
    if(err) return res.json({ err: err }, 500);
    res.json(model);
  });
});

module.exports = router;