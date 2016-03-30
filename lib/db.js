var config = require('./config');
var Q = require('q');

var db = function() {
  var pg = require('pg');
    conString: "postgres://esya@localhost/postgres"

  var conString = "postgres://" + config.user + ":" + config.password + "@" + config.host + "/" + config.db;
  this.client = new pg.Client(conString);
}

db.prototype.ensure = function() {
  var d = Q.defer();
  var self = this;
  self.client.connect(function(err) {
    if(err) {
      d.reject(err);
    }
    self.client.query('CREATE TABLE "public"."guestbook" ("id" serial,"name" text,"content" text,PRIMARY KEY ("id"));', function(err, result) {
      d.resolve();
    });
  });
  return d.promise;
}

db.prototype.getEntries = function() {
  var d = Q.defer();
  this.client.query('SELECT * FROM "public"."guestbook" ORDER BY id DESC', function(err, result) {
    if(err)
      d.reject(err);
    else
      d.resolve(result);
  });
  return d.promise;
}

db.prototype.addEntry = function(obj) {
  var values = [obj.name,obj.content];
  var d = Q.defer();
  this.client.query('INSERT INTO guestbook(name,content) VALUES($1,$2)',values, function(err, result) {
    if(err)
      d.reject(err);
    else
      d.resolve(result);
  });
  return d.promise;
}

module.exports = new db();
