var express = require('express');
var HelperResponse = require('../libs/Helpers/Response.js');
var resp = new HelperResponse();
var router = express.Router();

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