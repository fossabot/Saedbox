module.exports = function (models, config) {

	var admin_group= {
        		name: "Administrators",
        		p_cont_m:true,
				    o_cont_m:true,
				    manage_users:true,
				    manage_groups:true,
				    p_recp_m:true,
				    o_recp_m:true,
				    account_delete:false,
				    deletable: false
        	};

	models.collections.group.findOrCreate({where:{id:"1"}}, admin_group, function(err, group) {
  	if(err) return console.log(err);

  	var admin = {
      	group: group.id,
      	name: config.admin_name,
      	email: config.admin_email,
      	password: config.admin_password
  	};
  	models.collections.user.findOrCreate({where:{id:"1"}}, admin, function(err, user) {
  		if(err) return console.log(err);

  		console.log("Admin created or already exists ! Email : " + user.email)
  	});
  });
}
