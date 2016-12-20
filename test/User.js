let models = require('../models');

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app');
let should = chai.should();

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

	//Testing the GET route
	describe('/GET /api/users', () => {
	    it('it should GET all the users', (done) => {
	        chai.request("http://127.0.0.1:9002")
	            .get('/api/users')
	            .end((err, res) => {
	                res.should.have.status(200);
	                let data = res.body.data;
	                data.should.be.a('array');
	                data.length.should.be.eql(0);
	            done();
	        });
	    });
	});

	//Testing the POST route
	describe('/POST /api/users', () => {
      	it('it should not POST a user without name field', (done) => {
        	let group = {
        		name: "Basic"
        	};
        	models.collections.group.create(group, function(err, model) {
			    if(err) return(err);

			    let user = {
	            	group: model.id,
	            	password: "plop"
	        	};
			   	chai.request("http://127.0.0.1:9002")
	            	.post('/api/users')
	            	.send(user)
	            	.end((err, res) => {
	            		let result=res.body;
	                	res.should.have.status(400);
	                	result.should.be.a('object');
	                	result.should.have.property('error');
	                	result.error.should.have.property('name');
	                	result.error.name.should.have.property('kind').eql('required');
	              	done();
	           	}); 
			});
      	});
  	});

});