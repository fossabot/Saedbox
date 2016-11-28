let express = require("express")
let app = express()
var path = require('path');

var routes = require("./routes/api")

app.use('/', routes);

app.use(function(req, res, next) {
  var err = new Error('Page introuvable');
  err.status = 404;
  next(err);
});

app.listen(9002)
