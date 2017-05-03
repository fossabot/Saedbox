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

require('../libs/db/passport')(passport);

var bypass=(process.env.DOCKER_SOCKET=="test");

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
	checkContainerRights(req, res, function(container) {
		container ? docker.container(req.params.id,resp.send.bind(resp,res)) : resp.sendUnauthorized(res,"You don't have the rights to access this ressource.");
	})
});

//Stop/start Service
router.get("/api/services/:id/:action", isLoggedIn, function(req, res, next) {
	checkContainerRights(req, res, function(container) {
		if(container) {
			switch(req.params.action) {
				default:
					res.send("That is not a correct use");
					break;
				case "start":
					docker.start(req.params.id ,resp.send.bind(resp,res));
					break;
				case "stop":
					docker.stop(req.params.id, resp.send.bind(resp,res));
					break;
			}
		} else {
			resp.sendUnauthorized(res,"You don't have the rights to access this ressource.");
		}
	})

});

//Delete Service
router.delete("/api/services", isLoggedIn, function (req, res, next) {
	getGroupRights(req, function(group) {
		!bypass && group.p_cont_m ? docker.delete(req, resp.send.bind(resp,res)) : resp.sendUnauthorized(res,"You don't have the rights to access this ressource.");
	})
});

//Create new Service
router.post("/api/services", isLoggedIn, function(req, res, next) {
	getGroupRights(req, function(group) {
		!bypass && group.p_cont_m ? docker.new(req,resp.send.bind(resp,res)) : resp.sendUnauthorized(res,"You don't have the rights to access this ressource.");
	})
});

//Update a Service
router.put("/api/services", isLoggedIn, function(req, res, next) {
	getGroupRights(req, function(group) {
		!bypass && group.p_cont_m ? docker.new(req,resp.send.bind(resp,res)) : resp.sendUnauthorized(res,"You don't have the rights to access this ressource.");
	})
});


// ------------- User-related routes -------------

//List all users
router.get("/api/users", isLoggedIn, function(req, res, next) {
	var result=[];
	//Get the rights of the connected user
	getGroupRights(req,function(group){
		if(!bypass && group.message)
		return resp.sendUnauthorized(res,group.message)

		if(!bypass && !group.manage_users)
		return resp.sendUnauthorized(res,"You don't have the rights to access this ressource.")

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
});

//Create a user
router.post('/api/users', isLoggedIn, function(req, res) {
	getGroupRights(req,function(group){
		if(!bypass && group.message)
		return resp.sendUnauthorized(res,group.message)

		if(!bypass && !group.manage_users)
		return resp.sendUnauthorized(res,"You don't have the rights to access this ressource.")

		models.collections.user.create(req.body, function(err, model) {
			if(err) return resp.sendError(res,err);
			resp.send(res,model);
		});
	});
});

//Get User infos
router.get('/api/users/:id', isLoggedIn, function(req, res) {
	getGroupRights(req,function(group){
		if(!bypass && group.message)
		return resp.sendUnauthorized(res,group.message)

		if(!bypass && !group.manage_users)
		return resp.sendUnauthorized(res,"You don't have the rights to access this ressource.")

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
});

//Delete a user
router.delete('/api/users/:id', isLoggedIn, function(req, res) {
	getGroupRights(req,function(group){
		if(!bypass && group.message)
		return resp.sendUnauthorized(res,group.message)

		if(!bypass && !group.manage_users)
		return resp.sendUnauthorized(res,"You don't have the rights to access this ressource.")

		if (!bypass && req.params.id==1)
		return resp.sendUnauthorized(res,"You can't delete the administrator.")

		if (!bypass && !group.account_delete)
		return resp.sendUnauthorized(res,"You can't delete this user.")

		models.collections.user.destroy({ id: req.params.id }, function(err) {
			if(err) return resp.sendError(res,err);
			resp.send(res,{ status: 'ok' });
		});
	});
});

//Update a user
router.put('/api/users/:id', isLoggedIn, function(req, res) {
	// Don't pass ID to update
	delete req.body.id;

	getGroupRights(req,function(group){
		if(!bypass && group.message)
		return resp.sendUnauthorized(res,group.message)

		if(!bypass && !group.manage_users)
		return resp.sendUnauthorized(res,"You don't have the rights to access this ressource.")

		if (!bypass && req.params.id==1 && req.user.id!=1)
		return resp.sendUnauthorized(res,"Only the administrator can update it's account.")

		models.collections.user.update({ id: req.params.id }, req.body, function(err, model) {
			if(err) return resp.sendError(res,err);
			resp.send(res,model);
		});
	});
});


// ------------- Group-related routes -------------

//List all groups
router.get("/api/groups", isLoggedIn, function(req, res, next) {
	getGroupRights(req,function(group){
		if(!bypass && group.message)
		return resp.sendUnauthorized(res,group.message)

		if(!bypass && !group.manage_groups)
		return resp.sendUnauthorized(res,"You don't have the rights to access this ressource.")

		models.collections.group.find().exec(function(err, result) {
			if(err) return resp.sendError(res,err);
			resp.send(res,result);
		});
	});
});

//Create a group
router.post('/api/groups', isLoggedIn, function(req, res) {
	getGroupRights(req,function(group){
		if(!bypass && group.message)
		return resp.sendUnauthorized(res,group.message)

		if(!bypass && !group.manage_groups)
		return resp.sendUnauthorized(res,"You don't have the rights to access this ressource.")

		models.collections.group.create(req.body, function(err, model) {
			if(err) return resp.sendError(res,err);
			resp.send(res,model);
		});
	});
});

//Get group infos
router.get('/api/groups/:id', isLoggedIn, function(req, res) {
	getGroupRights(req,function(group){
		if(!bypass && group.message)
		return resp.sendUnauthorized(res,group.message)

		if(!bypass && !group.manage_groups)
		return resp.sendUnauthorized(res,"You don't have the rights to access this ressource.")

		models.collections.group.findOne({ id: req.params.id }, function(err, model) {
			if(err) return resp.sendError(res,err);
			resp.send(res,model);
		});
	});
});

//Delete a group
router.delete('/api/groups/:id', isLoggedIn, function(req, res) {
	getGroupRights(req,function(group){
		if(!bypass && group.message)
		return resp.sendUnauthorized(res,group.message)

		if(!bypass && !group.manage_groups)
		return resp.sendUnauthorized(res,"You don't have the rights to access this ressource.")

		if (!bypass && !group.deletable)
		return resp.sendUnauthorized(res,"You can't delete this group.")

		models.collections.group.destroy({ id: req.params.id }, function(err) {
			if(err) return resp.sendError(res,err);
			resp.send(res,{ status: 'ok' });
		});
	});
});

//Update a group
router.put('/api/groups/:id', isLoggedIn, function(req, res) {
	// Don't pass ID to update
	delete req.body.id;

	getGroupRights(req,function(group){
		if(!bypass && group.message)
		return resp.sendUnauthorized(res,group.message)

		if(!bypass && !group.manage_groups)
		return resp.sendUnauthorized(res,"You don't have the rights to access this ressource.")

		if(!bypass && group.id!=1 && req.params.id==1)
		return resp.sendUnauthorized(res,"Only the administrator group can change its group.");

		models.collections.group.update({ id: req.params.id }, req.body, function(err, model) {
			if(err) return resp.sendError(res,err);
			resp.send(res,model);
		});
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
			//resp.sendUnauthorized(res,"Wrong Credentials");
			resp.sendUnauthorized(res,req.message);
		}
	})(req, res, next);
});

//Logout route
router.get('/api/logout', isLoggedIn, function(req,res){
	req.logout();
	resp.send(res,"User successfully logged-out.");
});

module.exports = router;

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
	return next();

	if (bypass)
	return next();

	// if they aren't send not connected error and exit the parent function with return
	return resp.sendUnauthorized(res,"User not connected");
}


// function to get the group rights
function getGroupRights(req,cb) {
	// if user is authenticated in the session, carry on
	if (req.isAuthenticated()){
		models.collections.group.findOne({where: { id: req.user.group }}).exec(function(err,group){
			cb(group)
		});
	}
	else{
		cb({message:"User not connected"})
	}
}

function checkContainerRights(req,res,cb) {
	var bool
  models.collections.container.findOne({where : {container_id : req.params.id}}).exec(function(err,container) {
    if(err) return resp.sendError(err)
    container ? bool = true : bool = false
		cb(bool)
  });
	models.collections.container.findOne({where : {container_id : req.params.id}, and:
		[ {owner : req.user.id},
		{read : req.user.id},
	  {write : req.user.id},
	  {reboot: req.user.id} ]}).exec(function(err,container) {
		console.log(container)
	})

}
