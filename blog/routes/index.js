var crypto = require('crypto');
var Collection = require('../models/collection');
var Crud = require('../models/crud');
var settings = require('../settings');
var User;
var db = new Collection(settings.db, function(db) {
  User = new Crud(db, function(){});
});

module.exports = function(app) {
  app.get('/', function(req, res, next) {
    res.render('index', { 
      title: '主页',
      user: req.session.user,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });
  });
  
  app.get('/reg', function(req, res) {
    res.render('reg', { 
      title: '注册',
      user: req.session.user,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });
  });
  app.post('/reg', function(req, res) {
    var name = req.body.name,
        password = req.body.password,
        password_re = req.body['password-repeat'],
        email = req.body.email;
    if (password != password_re) {
      req.flash('error', '两次输入的密码不一致！');
      return res.redirect('/reg');
    }
   
    var md5 = crypto.createHash('md5'),
        password = md5.update(req.body.password).digest('hex');
    var newUser = {
      name: name,
      password: password,
      email: email
    };

    User.find("users", {name: name}, function(user) {
      console.log(user);
      if(user.length != 0) {
        req.flash('error', '用户已经存在！');
        return res.redirect('/reg');
      } else {
        User.insert("users", [newUser], function() {
          console.log("success");
          req.session.user = user;
          req.flash('success', '注册成功！');
          return res.redirect('/');
        });
      }
    });
  });
  
  app.get('/login', function(req, res) {
    res.render('login', {
      title: '登陆',
      user: req.session.user,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });
  });
  app.post('/login', function(req, res) {
    var md5 = crypto.createHash('md5'),
        password = md5.update(req.body.password).digest('hex');
    User.find("users", {name: req.body.name}, function(user) {
      if(user.length == 0){
        req.flash('error', '用户不存在！');
        return res.redirect('/login');
      }
      if(user[0].password != password) {
        req.flash('error', "密码错误！");
        return res.redirect('/login');
      }
      req.session.user = user;
      req.flash('success', "登录成功！");
      res.redirect('/');
    });
  });
  
  app.get('/post', function(req, res) {
    res.render('post', { title: '发表'});
  });
  app.post('/post', function(req, res) {
  });
  app.get('/logout', function(req, res) {
    req.session.user = null;
    req.flash('success', "登出成功！");
    res.redirect('/');
  });
}