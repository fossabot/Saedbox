var fs     = require('fs');
var system = [];
var si = require('systeminformation');
var Promise  = require('bluebird');

var System = function() {

  this.systemInfo = {
    'CPU' : {},
    'RAM' : {},
    'DISK' : {},
    'NET' : {}
  };

  this.memInfo = {
    'total' : '',
    'used' : '',
    'available' : '',
    'percentage_used' : '',
    'percentage_available' : ''
  };

  this.loadInfo = {
    'avgload': ''
  };

  this.networkInfo = {
    'rx' : '',
    'tx' : '',
    'rxsec' : '',
    'txsec' : ''
  };
  this.updateAll();
};

System.prototype.updateAll = function() {
  this.updateMemInfo();
  this.updateLoad();
  this.updateDisk();
  this.updateNetwork();
};

System.prototype.getAll = function() {
  this.updateAll();
  return this.systemInfo;
}


System.prototype.updateMemInfo = function() {
  si.mem(this.setMemData.bind(this));
};

System.prototype.setMemData = function(memData) {
  this.memInfo.total = memData.total;
  this.memInfo.used = memData.used;
  this.memInfo.available = memData.available;
  this.memInfo.percentage_used = Math.round(( (memData.total - memData.available) / memData.total) * 100);
  this.memInfo.percentage_available = Math.round( (memData.available / memData.total) * 100);

  this.systemInfo.RAM = this.memInfo;
};

System.prototype.updateLoad = function() {
  si.currentLoad()
    .then(this.setLoad.bind(this));
};

System.prototype.setLoad = function(loadData) {
  this.loadInfo.avgload = loadData.avgload;

  this.systemInfo.CPU = this.loadInfo;
};

System.prototype.updateNetwork = function() {
  si.networkStats(this.setNetwork.bind(this));
};

System.prototype.setNetwork = function(networkData) {
  this.networkInfo.rx = networkData.rx;
  this.networkInfo.tx = networkData.tx;
  this.networkInfo.rxsec = networkData.rx_sec;
  this.networkInfo.txsec = networkData.tx_sec;

  this.systemInfo.NET = this.networkInfo;
};

System.prototype.updateDisk = function() {
  si.fsSize(this.setDisk.bind(this));
};

System.prototype.setDisk = function(diskData) {
  this.systemInfo.DISK = diskData;
}

module.exports = System;
