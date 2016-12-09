var fs     = require('fs');
var system = [];
var si = require('systeminformation');

function mem(cb) {
  si.mem(function(data) {
  var data1 = { 'total' : data.total,
           'used' : data.used,
           'available' : data.available,
           'percentage_used' : Math.round(((data.total-data.available)/data.total)*100),
           'percentage_available' : Math.round((data.available/data.total)*100) };
  cb(data1);
  })};

function load(cb) {
  si.currentLoad(function(data){
    cb(data.avgload);
  })};

function network(cb) {
  si.networkStats(function(data) {
    var data1 = { "rx" : data.rx,
                  "tx" : data.tx,
                  "rxsec" : data.rx_sec,
                  "txsec" : data.tx_sec };
    cb(data1);
  })};

  function fsdisk(cb) {
    si.fsSize( function(data) {
      cb(data);
    })};

system.get = function(cb) {
  var data = {
    "CPU" : "",
    "RAM" : "",
    "DISK" : "",
    "NET" : ""
  };
  //mem(function(res){data.RAM=res; cb(data)});
  //load(function(res){data.CPU=res; cb(data)});
  //network(function(res){data.NET=res; cb(data)});
  fsdisk(function(res){data.DISK=res; cb(data)});
}


module.exports = system;
