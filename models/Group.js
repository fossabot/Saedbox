var Waterline = require('waterline');

var Group = Waterline.Collection.extend({

  identity: 'group',
  connection: 'myLocalDisk',

  attributes: {
    name: {
    	type: 'string',
    	required: true,
    	unique: true
    },
    p_cont_m:{ // Personnal container management
    	type: 'boolean',
    	required: true
    },
    o_cont_m:{ // Others container management
    	type: 'boolean',
    	required: true
    },
    manage_users: { // Ability to manage users
    	type: 'boolean',
    	required: true
    },
    manage_groups: { // Ability to manage groups
    	type: 'boolean',
    	required: true
    },
    p_recp_m:{ // Personnal recipes management
    	type: 'boolean',
    	required: true
    },
    o_recp_m:{ // Others recipes management
    	type: 'boolean',
    	required: true
    },
    account_delete: { //Can users of this group delete their accounts ?
    	type: 'boolean',
    	required: true
    },
    deletable : { // Is this group deletable ?
    	type: 'boolean',
    	required: true
    }
  }
});

module.exports = Group;