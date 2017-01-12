'use strict'

var Docker = require('dockerode');
var fs     = require('fs');
var socket = process.env.DOCKER_SOCKET || '/var/run/docker.sock';
var stats  = fs.statSync(socket);

if (process.env.DOCKER_SOCKET!=="test"){

    if (!stats.isSocket()) {
      throw new Error('Are you sure the docker is running?');
    }

    var docker = new Docker({ socketPath: socket });

    docker.list = function(cb) {
      docker.listContainers({all: true}, function(err,containers){
          cb(containers);
    	});
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

    docker.stop = function(id,cb) {
    	var container = docker.getContainer(id);
    	container.stop(function(err,data) {
        if (err) {
          cb(err);
        } else {
          cb({id : container.id, statusCode : 200});
        }
    	});
    };

    docker.delete = function(id,cb) {
    	var container = docker.getContainer(id);
    	container.remove(function(err,data) {
        if (err) {
          cb(err);
        } else {
          cb({statusCode : 200});
        }
    	});
    };

    docker.new = function(name, cb) {
        var optsc = {
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
            'Image': name,
            'Volumes': {},
            'VolumesFrom': []
        };
        docker.createContainer(optsc, function(err, container) {
            if (err) {
                if (err.statusCode == 404) {
                    docker.pull(name, function(err, stream) {
                        docker.modem.followProgress(stream, onFinished);
                          function onFinished(err, output) {
                            docker.createContainer(optsc, function(err, container) {
                                cb(container);
                            })
                        };
                    })
                }
            } else {
                cb(container);
            };
        })
    };

}

module.exports = docker;
