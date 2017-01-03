var express = require('express');
var Col = require("../mongodb/Col.js");
var Crud = require("../mongodb/Crud.js");
var ObjectID = require('mongodb').ObjectID;
var router = express.Router();

//初始化crud
var crud;
//新建DB并获取;
var db =new Col("todo",function(db){
    //数据库连接完毕...
    //创建一个RESTFUL对象;
    crud = new Crud( db, function(){} );
});
/*
var data = {
    title : "t0do",
    lists : [
    ]
};
*/

//这个可以理解为app.get("/",function(req, res, next){});
/* GET 获取所有的列表. */
router.get('/', function(req, res) {
    crud.find("todos",{},function(docs) {
        console.log( docs );
        res.render('index', {title : "todos", lists : docs});
    });
});

/* GET 用户选择是否删除指定ID. */
router.get('/del/:id', function(req, res) {
    res.render("delete",{id : req.params.id});
});

//用户确认删除指定id的todo
router.get("/del/ok/:id", function(req, res) {
    var id = new ObjectID(req.params.id);
    crud.remove("todos",{_id : id}, function() {
        res.redirect("../../");
    });
});

//获取编辑的todo信息界面
router.get('/modify/:id', function(req, res, next) {
    var id = new ObjectID( req.params.id );
    crud.findOne("todos",{ _id : id}, function(doc) {
        doc.id = doc._id;
        res.render("modify",doc);
    });
});

//更新用户信息并重定向到主界面
router.post('/modify', function(req, res, next) {
    var body = req.body;
    console.log(body);
    crud.update("todos",{_id : new ObjectID(body.id)}, {_id:new ObjectID(body.id),title:body.title,content:body.content},function() {
        console.log("done");
    });
    res.redirect("../");
});

/* GET add listing. */
router.get('/add', function(req, res) {
    res.render("add",{});
});

//默认的post值为新建, 从add界面调过来的;
router.post("/add",function(req, res) {
    crud.insert("todos",[ {title : req.body.title, content : req.body.content }], function() {
        console.log("success");
    });
    res.redirect("./");
});

module.exports = router;
