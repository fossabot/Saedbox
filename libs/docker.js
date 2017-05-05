'use strict'

var Docker = require('dockerode');
var fs     = require('fs');
var socket = process.env.DOCKER_SOCKET || '/var/run/docker.sock';
var stats  = fs.statSync(socket);
let models = require('../models');
let HelperResponse = require('../libs/Helpers/Response.js');
let resp = new HelperResponse();

if (process.env.DOCKER_SOCKET!=="test"){
  if (!stats.isSocket()) {
    throw new Error('Are you sure the docker is running?');
  }
  var docker = new Docker({ socketPath: socket });

  docker.list = function(cb) {
    models.collections.container.find().exec(function(err,entries) {
      var my_containers = []
      for (var entry of entries) {
        my_containers.push(entry.container_id)
    }
      docker.listContainers({all: true}, function(err,containers){
        var result = [];
        for (var container of containers) {
          if(my_containers.includes(container.Id)) result.push(container);
        }
      cb(result)
    });
  })
  };

  docker.container = function(id,cb) {
    var container = docker.getContainer(id);
    container.inspect(function(err,data) {
      cb(data);
    });
  };

  docker.start = function(id,cb) {
    var container = docker.getContainer(id);
    container.start(function(err,data) {
      if (err) {
        cb(err);
      } else {
        cb({id : container.id, statusCode : 200});
      }
    });
  };

  docker.stop = function(id, cb) {
    var container = docker.getContainer(id);
    container.stop(function(err,data) {
      if (err) {
        cb(err);
      } else {
        cb({id : container.id, statusCode : 200});
      }
    });
  };

  docker.delete = function(req, cb) {
      delete_container(req.body.id, cb);
  }

  docker.new = function(req, cb) {
    var optsc = {
      'name': 'prout',
      'Hostname': '',
      'User': '',
      'AttachStdin': true,
      'AttachStdout': true,
      'AttachStderr': true,
      'Tty': true,
      'OpenStdin': true,
      'StdinOnce': false,
      'Env': null,
      'Cmd': [],
      'Dns': [],
      'Image': req.body.name,
      'Volumes': {},
      'VolumesFrom': []
    };
    create_container(optsc, req.user.id, cb)
  };

  docker.update = function(req, cb) {
    var container = docker.getContainer(req.body.id);
    container.inspect(container)
    .then(function(container) {
      create_container(container.Config, req.user.id, function(res, err){
        if(err) cb(err)
        cb(res)
      })
    })
    .then(function(container) {
      delete_container(req.body.id, function(res, err){
        if(err) cb(err)
      })
    })
    .catch(function(err) {
      console.log(err)
    })
  };
}

module.exports = docker;

function delete_container(id, cb) {
    var container = docker.getContainer(id);
    container.remove(function(err,data) {
      if (err) {
        cb(err);
      } else {
        models.collections.container.destroy({ container_id: container.id }, function(err) {
          if(err) return err;
          cb({statusCode : 200});
        });
      }
    });
  };

 function create_container(optsc, id, cb) {
   docker.createContainer(optsc, function(err, container) {
     if (err) {
       if (err.statusCode == 404) {
         docker.pull(optsc.image, function(err, stream) {
           docker.modem.followProgress(stream, onFinished);
           function onFinished(err, output) {
             docker.createContainer(optsc, function(err, container) {
               models.collections.container.create({owner: id, container_id: container.id}, function(err, model) {
                 if(err) return err;
                 cb(container);
               });
             })
           }
         })
       }
     } else {
       models.collections.container.create({owner: id, container_id: container.id}, function(err, model) {
         if(err) return err;
         cb(container);
       });
     }
   })
 }
