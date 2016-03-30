var Q = require('q');
var db = require('./lib/db');
var gb = require('./lib/guestbook');

db.ensure().then(gb.start.bind(gb)).done(function() {
  console.log("All done");
},function() {
  console.log("Err",arguments);
})
