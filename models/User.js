var Waterline = require('waterline');


var User = Waterline.Collection.extend({

  identity: 'user',
  connection: 'myLocalDisk',

  attributes: {
    name: {
    	type: 'string',
    	required: true,
    	unique: true
    },
    password: {
    	type: 'string',
    	required: true
    },
    group:{
    	model: 'group',
    	required: true
    },
    containers:{
    	collection: 'container',
      	via: 'user'
    }
  }
});

module.exports = User;