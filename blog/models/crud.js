var Crud = function(db) {
  this.db = db;
};

Crud.prototype = {
  constructor: Crud,
  noop: function() {},
  insert: function(col, val, cb) {
    cb = cb || this.noop;
    return this.db.collection(col).insert(val, cb);
  },
  update: function(col, search, val, cb) {
    cb = cb || this.noop;
    return this.db.collection(col).update(search, {$set: val}, cb);
  },
  remove: function(col, key, cb) {
    cb = cb || this.noop;
    return this.db.collection(col).remove(key, cb);
  },
  find: function(col, keyword, cb) {
    cb = cb || this.noop;
    this.db.collection(col).find(keyword).toArray(function(err, docs) {
      cb(docs);
    });
  },
  findBy_id: function(col, id, cb) {
    this.db.collection(col).find({}, {_id: id}, function(err, docs) {
      docs.toArray(function(err, doc) {
        cb(doc);
      });
    });
  },
  findOne: function(col, keyword, cb) {
    cb = cb || this.noop;
    this.db.collection(col).findOne(keyword, function(err, docs) {
      cb(docs);
    });
  }
};

module.exports = function(db) {
  return new Crud(db);
};
