let Docker = require('dockerode');
let fs     = require('fs');
var socket = process.env.DOCKER_SOCKET || '/var/run/docker.sock';
var stats  = fs.statSync(socket);

if (!stats.isSocket()) {
  throw new Error('Are you sure the docker is running?');
}

var docker = new Docker({ socketPath: socket });

docker.list = function(cb) {
	docker.listContainers({all: true}, function(err,containers){
			cb(containers);
	});
};

module.exports = docker;