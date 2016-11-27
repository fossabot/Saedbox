let express = require("express")

let router = express.Router()

router.get("/", function(req, res, next) {
    res.send('Salut')
})

router.get("/api/services", function(req, res, next) {
    res.send('get services informations')
})

router.get("/api/service/:id", function(req, res, next) {
    res.send('get ' + req.params.id + ' informations')
})

module.exports = router;