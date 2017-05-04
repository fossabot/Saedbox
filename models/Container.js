'use strict'

var Waterline = require('waterline');

var Container = Waterline.Collection.extend({

  identity: 'container',
  connection: 'myLocalDisk',

  attributes: {
    container_id: {
      type: 'string',
      required: true
    },
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