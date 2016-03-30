var express = require('express');
var app = express();
var db = require('./db');
var config = require('./config');
var bodyParser = require('body-parser');
var os = require('os');

var gb = function() { }

gb.prototype.start = function() {
  app.set('view engine', 'jade');
  app.use(bodyParser.urlencoded({extended: true})); 
  
  app.post('/new', function(req, res) {
    db.addEntry(req.body).done(function() {
      res.redirect('/');
    });

  });

  app.get('/', function (req, res) {
    db.getEntries().done(function(result) {
       res.render('index',{rows: result.rows, hostname: os.hostname()});
    },function() {
      res.send('Error',JSON.encode(arguments));
    });
  });

  app.get('/status', function (req, res) {
    res.send('OK!');
  });

  app.listen(config.serverPort, function () {
    console.log('Example app listening on port '+config.serverPort);
  });

}

module.exports = new gb();
