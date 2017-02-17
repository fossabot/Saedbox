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
      	via: 'owner'
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
    if (user.password.length < 8)
      return cb("Password should be at least 8 characters long.");

    user.password = bcrypt.hashSync(user.password, 10);
    cb();
  },
  beforeUpdate: function(user, cb) {
    if (typeof user.password === 'undefined') {
      cb();
    }
    else{
      if (user.password.length < 8)
        return cb("Password should be at least 8 characters long.");

      user.password = bcrypt.hashSync(user.password, 10);
      cb();
    }
  }
});

module.exports = User;