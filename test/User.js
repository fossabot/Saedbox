var models = require('../models');

//Require the dev-dependencies
var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../app'); //Used to properly load the app and waterline

chai.use(chaiHttp);
//Our parent block
describe('Users', () => {
    beforeEach((done) => { //Before each test we empty the database
        models.collections.user.destroy({}, function(err) {
		    if(err) return(err);
		    models.collections.group.destroy({}, function(err){
		    	if(err) return(err);
		    	done();
		    })
		});        
    });     

	//Testing the GET route without data
	describe('/GET /api/users', () => {
	    it('it should GET an empty array', (done) => {
	        chai.request("http://127.0.0.1:9002")
	            .get('/api/users')
	            .end((err, res) => {
	                res.should.have.status(200);
	                var data = res.body.data;
	                data.should.be.a('array');
	                data.length.should.be.eql(0);
	            done();
	        });
	    });
	});

	//Testing the GET route with data
	describe('/GET /api/users', () => {
	    it('it should GET all the users', (done) => {

	    	var group = {
        		name: "Basic",
        		p_cont_m:true,
			    o_cont_m:false,
			    manage_users:false,
			    manage_groups:false,
			    p_recp_m:true,
			    o_recp_m:false,
			    account_delete:true,
			    deletable: false
        	};
        	models.collections.group.create(group, function(err, model) {
			    if(err) return(err);

				var users=[
					{group: model.id, password: "plop", name:"plop1"},
					{group: model.id, password: "plop", name:"plop2"}
				];

		    	models.collections.user.create(users, function(err, response) {
				    if(err) return(err);


				    chai.request("http://127.0.0.1:9002")
			            .get('/api/users')
			            .end((err, res) => {
			                res.should.have.status(200);
			                var data = res.body.data;
			                data.should.be.a('array');
			                data.length.should.be.eql(2);
			            done();
			        });

				});
			});

	        
	    });
	});

	//Testing the POST route without name
	describe('/POST /api/users', () => {
      	it('it should not POST a user without name fields', (done) => {
        	var group = {
        		name: "Basic",
        		p_cont_m:true,
			    o_cont_m:false,
			    manage_users:false,
			    manage_groups:false,
			    p_recp_m:true,
			    o_recp_m:false,
			    account_delete:true,
			    deletable: false
        	};
        	models.collections.group.create(group, function(err, model) {
			    if(err) return(err);

			    var user = {
	            	group: model.id,
	            	password: "plop"
	        	};

			   	chai.request("http://127.0.0.1:9002")
	            	.post('/api/users')
	            	.set('content-type', 'application/x-www-form-urlencoded')
	            	.send(user)
					.end(function(error, response) {
		                var result=error.response.res.body.error;
		               	result.should.have.status(400);
		               	result.should.be.a('object');
		               	result.should.have.property('invalidAttributes');
		               	result.invalidAttributes.should.have.property('name');
		              	done();
		            });
			});
      	});
  	});

	//Testing the POST route without password
	describe('/POST /api/users', () => {
      	it('it should not POST a user without password fields', (done) => {
        	var group = {
        		name: "Basic",
        		p_cont_m:true,
			    o_cont_m:false,
			    manage_users:false,
			    manage_groups:false,
			    p_recp_m:true,
			    o_recp_m:false,
			    account_delete:true,
			    deletable: false
        	};
        	models.collections.group.create(group, function(err, model) {
			    if(err) return(err);

			    var user = {
	            	group: model.id,
	            	name: "plop"
	        	};

			   	chai.request("http://127.0.0.1:9002")
	            	.post('/api/users')
	            	.set('content-type', 'application/x-www-form-urlencoded')
	            	.send(user)
					.end(function(error, response) {
		                var result=error.response.res.body.error;
		               	result.should.have.status(400);
		               	result.should.be.a('object');
		               	result.should.have.property('invalidAttributes');
		               	result.invalidAttributes.should.have.property('password');
		              	done();
		            });
			});
      	});
  	});

	//Testing the POST route without all parameters
	describe('/POST /api/users', () => {
      	it('it should not POST a user without password fields', (done) => {
        	var group = {
        		name: "Basic",
        		p_cont_m:true,
			    o_cont_m:false,
			    manage_users:false,
			    manage_groups:false,
			    p_recp_m:true,
			    o_recp_m:false,
			    account_delete:true,
			    deletable: false
        	};
        	models.collections.group.create(group, function(err, model) {
			    if(err) return(err);

			    var user = {
	            	group: model.id,
	            	name: "plop",
	            	password: "plop"
	        	};

			   	chai.request("http://127.0.0.1:9002")
	            	.post('/api/users')
	            	.set('content-type', 'application/x-www-form-urlencoded')
	            	.send(user)
					.end(function(error, response) {
		                var result=response.body.data;
		               	response.should.have.status(200);
		               	result.should.be.a('object');
		               	result.should.have.property('name').eql("plop");
		              	done();
		            });
			});
      	});
  	});

});