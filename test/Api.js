//Require the dev-dependencies
var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../app');
var should = chai.should(); //DO NOT REMOVE
var address = "localhost"+":"+require('../config.json').port+require('../config.json').webroot;
console.log(address);

chai.use(chaiHttp);


describe('API', () => {

  describe('/GET /api/fail', () => {
    it('it should GET an formated 404 error', (done) => {
	    chai.request(address)
	      .get('/api/fail')
	        .end((err, res) => {
	                res.should.have.status(404);
	                var data = res.body.data;
	                data.should.be.a('object');
                  data.should.have.a('object');
                  data.should.have.property('code').that.is.a('number');
                  data.should.have.property('error').that.is.a('string')
	            done();
	        });
	    });
	});
});
