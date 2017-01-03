/**
 * 
 * Created by peizhao on 1/3/17.
 */
// var settings = require('../settings');
// var MongoClient = require('mongodb').MongoClient;
// var url = `mongodb://${settings.host}:${settings.port}/${settings.db}`;
//
// MongoClient.connect(url, function(err, db) {
//   if(err == null) {
//     console.log("Connected successfully to server");
//   }
// });

var settings = require('../settings');
var Db = require('mongodb').Db;
var Connection = require('mongodb').CoreConnection;
var Server = require('mongodb').Server;

module.exports = new Db(settings.db, new Server(settings.host, settings.port), {safe: true});
