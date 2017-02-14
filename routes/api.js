'use strict'

let express = require("express");
let async = require("async");
let passport = require("passport");

let docker = require("../libs/docker.js");
let router = express.Router();

let HelperResponse = require('../libs/Helpers/Response.js');
let resp = new HelperResponse();

let HelperSystem = require('../libs/Helpers/System.js');
let systemInfo = new HelperSystem();

let models = require('../models');

require('../config/passport')(passport);

//Get API base
router.get("/", function(req, res, next) {
	resp.send(res, 'Check documentation for API usage');
});

//Get current user info
router.get("/me", isLoggedIn, function(req, res, next) {
  var model=req.user;

  //Getting group value
  models.collections.group.findOne({where: { id: model.group }}).exec(function(err,group){

    model.group=group;

    //Getting containers infos
    var containers=[];
    async.forEach(model.containers,
      function(container, callback2){
        models.collections.container.findOne({where:{id:container}}).exec(function(err,rescontainer){
          if(err) return resp.sendError(res,err);

          containers.push(rescontainer);
          callback2();
        });
      },
      function(err){
        model.containers=containers;
        resp.send(res,model);
      }
    );
  });
});


// ------------- Services (Docker) routes -------------

//Get services
router.get("/api/services", isLoggedIn, function(req, res, next) {
    docker.list(resp.send.bind(resp,res));
});

//Get Service ID's info
router.get("/api/services/:id", isLoggedIn, function(req, res, next) {
	var ID = req.params.id;
	docker.container(ID,resp.send.bind(resp,res));
});

//Stop/start Service
router.get("/api/services/:id/:action", isLoggedIn, function(req, res, next) {
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
router.delete("/api/services", isLoggedIn, function (req, res, next) {
	var ID = req.body.id;
		docker.delete(ID,resp.send.bind(resp,res));
});

//Create new Service
router.post("/api/services", isLoggedIn, function(req, res, next) {
	var name = req.body.name;
	docker.new(name,resp.send.bind(resp,res));
});


// ------------- User-related routes -------------

//List all users
router.get("/api/users", isLoggedIn, function(req, res, next) {
  var result=[];

  models.collections.user.find().exec(function(err, resultusers) {
  if(err) return resp.sendError(res,err);

    async.forEach(resultusers,
      function(item, callback){
        //Getting group value
        models.collections.group.findOne({where:{id:item.group}}).exec(function(err,resgroup){
          if(err) return resp.sendError(res,err);

          item.group=resgroup;

          //Getting containers infos
          var containers=[];
          async.forEach(item.containers,
            function(container, callback2){
              models.collections.container.findOne({where:{id:container}}).exec(function(err,rescontainer){
                if(err) return resp.sendError(res,err);

                containers.push(rescontainer);
                callback2();
              });
            },
            function(err){
              item.containers=containers;
              result.push(item);
              callback();
            }
          );
        });

      },
      function(err){
        resp.send(res,result);
      }
    );
  });
});

//Create a user
router.post('/api/users', isLoggedIn, function(req, res) {
  models.collections.user.create(req.body, function(err, model) {
    if(err) return resp.sendError(res,err);
    resp.send(res,model);
  });
});

//Get User infos
router.get('/api/users/:id', isLoggedIn, function(req, res) {
  models.collections.user.findOne({ id: req.params.id }, function(err, model) {
    if(err) return resp.sendError(res,err);

    //Getting group value
    models.collections.group.findOne({where: { id: model.group }}).exec(function(err,group){

      model.group=group;

      //Getting containers infos
      var containers=[];
      async.forEach(model.containers,
        function(container, callback2){
          models.collections.container.findOne({where:{id:container}}).exec(function(err,rescontainer){
            if(err) return resp.sendError(res,err);

            containers.push(rescontainer);
            callback2();
          });
        },
        function(err){
          model.containers=containers;
          resp.send(res,model);
        }
      );
    });
  });
});

//Delete a user -- TODO : test if user has id 1 or if current_user has rights to do so
router.delete('/api/users/:id', isLoggedIn, function(req, res) {
  models.collections.user.destroy({ id: req.params.id }, function(err) {
    if(err) return resp.sendError(res,err);
    resp.send(res,{ status: 'ok' });
  });
});

//Update a user
router.put('/api/users/:id', isLoggedIn, function(req, res) {
  // Don't pass ID to update
  delete req.body.id;
  models.collections.user.update({ id: req.params.id }, req.body, function(err, model) {
    if(err) return resp.sendError(res,err);
    resp.send(res,model);
  });
});


// ------------- Group-related routes -------------

//List all groups
router.get("/api/groups", isLoggedIn, function(req, res, next) {
  models.collections.group.find().exec(function(err, result) {
    if(err) return resp.sendError(res,err);
    resp.send(res,result);
  });
});

//Create a group
router.post('/api/groups', isLoggedIn, function(req, res) {
    models.collections.group.create(req.body, function(err, model) {
    if(err) return resp.sendError(res,err);
    resp.send(res,model);
  });
});

//Get group infos
router.get('/api/groups/:id', isLoggedIn, function(req, res) {
  models.collections.group.findOne({ id: req.params.id }, function(err, model) {
    if(err) return resp.sendError(res,err);
    resp.send(res,model);
  });
});

//Delete a group
router.delete('/api/groups/:id', isLoggedIn, function(req, res) {
  models.collections.group.destroy({ id: req.params.id }, function(err) {
    if(err) return resp.sendError(res,err);
    resp.send(res,{ status: 'ok' });
  });
});

//Update a group
router.put('/api/groups/:id', isLoggedIn, function(req, res) {
  // Don't pass ID to update
  delete req.body.id;
  models.collections.group.update({ id: req.params.id }, req.body, function(err, model) {
    if(err) return resp.sendError(res,err);
    resp.send(res,model);
  });
});

// ------------- System-related routes -------------

router.get('/api/system', isLoggedIn,function(req, res) {
  resp.send(res, systemInfo.getAll());
});

// ------------- Authentication-related routes -------------

//Login route
router.post('/api/login', function(req,res,next){
  passport.authenticate('local', function (err, user, response) {
    if (err)
      return next(err);

    if (user) {
      resp.send(res,"User successfully logged-in");
    }
    else {
      //resp.sendError(res,"Wrong Credentials");
      resp.sendError(res,req.message);
    }
  })(req, res, next);
});

//Logout route
router.get('/api/logout', isLoggedIn, function(req,res){
  resp.send(res,req.logout());
});

module.exports = router;

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
      return next();

    if (process.env.DOCKER_SOCKET=="test")
      return next();

    // if they aren't send not connected error and exit the parent function with return
    return resp.sendError(res,"User not connected");
}


// function to get the group rights
function getGroupRights(req) {
  // if user is authenticated in the session, carry on
  if (req.isAuthenticated()){
    models.collections.group.findOne({where: { id: req.user.group }}).exec(function(err,group){
      return group
    });
  }
    
  return {message:"User not connected"};
}