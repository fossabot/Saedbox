var Waterline = require('waterline');

var orm = new Waterline();

var fs = require('fs');
var path = require('path');

fs
  .readdirSync(__dirname)
  .filter(function(file){
  	return (file.indexOf(".") !==0) && (file !== "index.js");
  })
  .forEach(function(file){
  	var model = require(path.join(__dirname,file));
  	orm.loadCollection(model);
  });

module.exports = orm;