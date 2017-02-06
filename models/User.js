var Waterline = require('waterline');

/** Loading Bcrypt */
var bcrypt = require('bcrypt');


var User = Waterline.Collection.extend({

  identity: 'user',
  connection: 'myLocalDisk',

  attributes: {
    name: {
    	type: 'string',
    	required: true,
    	unique: true
    },
    email: {
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
    },
    /** Function to convert record to Json */
    toJSON: function() {
      var obj = this.toObject();
      delete obj.password;
      return obj;
    }
  },
  /** Function to encrypt user password before storing the new user record */
  beforeCreate: function(user, cb) {
    user.password = bcrypt.hashSync(user.password, 10);
    cb();
  }
});

module.exports = User;