/**
 *
 * Created by peizhao on 1/4/17.
 */

var mongodb = require('mongodb');
var MONGOURL = "mongodb://localhost:27017/";

var open = function(name, callback) {
  var MongoClient = require('mongodb').MongoClient;
  var url = MONGOURL + name;
  MongoClient.connect(url, function(err, db) {
    console.log("connect db");
    callback&&callback(db);
  });
};

var Collection = function(name, callback) {
  open(name, function(_db) {
    this.db = _db;
    console.log("new db is done");
    callback&&callback(_db);
  }.bind(this));
};

Collection.prototype = {
  constructor: Collection,
  create: function(name, callback) {
    this.db.createCollection(name, {safe: true}, function(err, collection) {
      if(err) {
        console.log(err);
      }else {
        callback&&callback(collection);
      }
    });
  },
  remove: function(name, callback) {
    this.db.dropCollection(name, {safe: true}, function(err, result) {
      if(err) {
        console.log(err);
        return;
      }else {
        callback&&callback(result);
      }
    });
  },
  getDb: function() {
    return this.db;
  }
};

module.exports = Collection;
