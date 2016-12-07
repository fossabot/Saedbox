var fs     = require('fs');
var os     = require('os');
var exec = require('child_process').exec;
var system = [];

function freemem(cb) {
  exec("awk '/MemAvailable/ { print $2 }' /proc/meminfo", function(error, stdout, stderr) {
  stdout = Number(stdout)*1000;
  var data = { 'total' : os.totalmem(),
           'used' : os.totalmem()-stdout,
           'available' : stdout,
           'percentage_used' : Math.round(((os.totalmem()-stdout)/os.totalmem())*100),
           'percentage_available' : Math.round(100-(((os.totalmem()-stdout)/os.totalmem())*100)) };
  cb(data);
  })
};



system.get = function(cb) {
  var data = {
    "CPU" : os.loadavg(),
    "RAM" : "",
    "DISK" : "to complete",
    "NET" : "to complete"
  };
  freemem(function(res){data.RAM=res; cb(data)});
}


module.exports = system;
