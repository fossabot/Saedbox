let express = require('express');
let HelperResponse = require('../libs/Helpers/Response.js');
let resp = new HelperResponse();
let router = express.Router();

router.get("/", function(req, res, next) {
    resp.send(res, 'Salut');
})

router.get("/api/services", function(req, res, next) {
    resp.send(res, 'get services informations')
})

router.get("/api/service/:id", function(req, res, next) {
    resp.send(res, 'get ' + req.params.id + ' informations')
})

module.exports = router;