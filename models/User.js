var Waterline = require('waterline');


var User = Waterline.Collection.extend({

  identity: 'user',
  connection: 'myLocalDisk',

  attributes: {
    first_name: 'string',
    last_name: 'string'
  }
});

module.exports = User;