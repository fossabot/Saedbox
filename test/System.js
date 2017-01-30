//Require the dev-dependencies
var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../app');
var should = chai.should(); //DO NOT REMOVE

chai.use(chaiHttp);


describe('System', () => {

  describe('/GET /api/system', () => {
    it('it should GET an correctly formated object', (done) => {
	    chai.request("http://127.0.0.1:9002")
	      .get('/api/system')
	        .end((err, res) => {
	                res.should.have.status(200);
	                var data = res.body.data;
	                data.should.be.a('object');
                  data.should.have.a('object');
                  data.should.have.property('CPU').that.is.a('number');
                  data.should.have.property('RAM').that.is.a('object')
                  data.should.have.property('DISK').that.is.a('array');
                  data.should.have.property('NET').that.is.a('object');
	            done();
	        });
	    });
	});
});
