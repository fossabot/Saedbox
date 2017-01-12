'use strict'

var Waterline = require('waterline');

var Container = Waterline.Collection.extend({

  identity: 'container',
  connection: 'myLocalDisk',

  attributes: {
    id: 'string',
    user:{
    	model: 'user'
    }
  }
});

module.exports = Container;