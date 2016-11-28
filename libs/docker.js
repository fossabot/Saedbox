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

docker.container = function(id,cb) {
	var container = docker.getContainer(id);
	container.inspect(function(err,data) {
		cb(data);
	});
};

docker.start = function(id,cb) {
	var container = docker.getContainer(id);
	container.start(function(err,data) {
		console.log(data);
		cb(data);
	});
};

docker.stop = function(id,cb) {
	var container = docker.getContainer(id);
	container.stop(function(err,data) {
		console.log(data);
		cb(data);
	});
};

module.exports = docker;