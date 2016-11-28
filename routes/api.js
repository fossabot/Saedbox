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
app.post('/api/users', function(req, res) {
  	models.collections.user.create(req.body, function(err, model) {
    if(err) return res.json({ err: err }, 500);
    res.json(model);
  });
});

//Delete a user
app.get('/api/users/:id/delete', function(req, res) {
  models.collections.user.destroy({ id: req.params.id }, function(err) {
    if(err) return res.json({ err: err }, 500);
    res.json({ status: 'ok' });
  });
});

//Update a user
app.put('/api/users/:id/update', function(req, res) {
  // Don't pass ID to update
  delete req.body.id;
  models.collections.user.update({ id: req.params.id }, req.body, function(err, model) {
    if(err) return res.json({ err: err }, 500);
    res.json(model);
  });
});

module.exports = router;