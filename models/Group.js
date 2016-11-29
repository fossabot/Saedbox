let Waterline = require('waterline');

var Group = Waterline.Collection.extend({

  identity: 'group',
  connection: 'myLocalDisk',

  attributes: {
    name: 'string'
  }
});

module.exports = Group;