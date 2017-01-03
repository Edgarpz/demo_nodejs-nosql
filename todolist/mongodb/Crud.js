var Crud = function(db) {
    this.db = db;
};
Crud.prototype  = {
    constructor : Crud,
    noop : function(){},
    insert : function(col, val, cb) {
        cb = cb || this.noop;
        return this.db.collection(col).insert(val,cb);
    },
    update : function(col, search, val, cb) {
        cb = cb || this.noop;
        return this.db.collection(col).update(search, {$set : val}, cb);
    },
    remove : function(col,key,cb) {
        cb = cb || this.noop;
        //console.log(this.db.collection(col).remove);
        return this.db.collection(col).remove(key,cb);
    },
    find : function(col,keyword,cb) {
        cb = cb || this.noop;
        this.db.collection(col).find(keyword).toArray(function(err, docs) {
            cb(docs);
        });
    },
    findBy_id : function(col,id, cb) {
        this.db.collection(col).find({},{_id : id}, function(err, docs){
            docs.toArray(function(err,doc){
                cb(doc)
            })
        })
    },
    findOne : function(col,keyword,cb) {
        cb = cb || this.noop;
        this.db.collection(col).findOne(keyword,function(err, docs) {
            cb(docs);
        })
    }
};

/*
 需要把题目的数据库实例放进来;
 var crud = new Crud(db);
 var result = crud.insert("nono" [{xx:xx}] , callback);
 var result = crud.update("nono", {hehe1 : 1} , { lala : "lala" },function(){console.log("update Done")});
 var result = crud.remove("nono", {hehe : 0} ,function() {console.log("remove Done")});
 var result = crud.find("nono", {hehe1 : 1} ,function(doc) {}
 */
module.exports =  function(db) {
    return new Crud(db);
};
