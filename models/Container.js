'use strict'

var Waterline = require('waterline');

var Container = Waterline.Collection.extend({

  identity: 'container',
  connection: 'myLocalDisk',

  attributes: {
    id: 'string',
    owner:{
    	model: 'user'
    },
    read:{
    	type: 'array'
    },
    write:{
    	type: 'array'
    },
    reboot:{
    	type: 'array'
    }
  }
});

module.exports = Container;