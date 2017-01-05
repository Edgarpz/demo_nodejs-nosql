var crypto = require('crypto');
var Collection = require('../models/collection');
var Crud = require('../models/crud');
var settings = require('../settings');
var check = require('../middlewares/check');
var markdown = require('markdown').markdown;
var User;
var Post;
var db = new Collection(settings.db, function(db) {
  User = new Crud(db, function(){});
  Post = new Crud(db, function(){});
});

module.exports = function(app) {
  app.get('/', function(req, res, next) {
    Post.find("posts", {}, function(posts) {
      posts.forEach(function(post) {
        post.post = markdown.toHTML(post.post);
      });
      res.render('index', {
        title: '主页',
        user: req.session.user,
        posts: posts,
        success: req.flash('success').toString(),
        error: req.flash('error').toString()
      });
    });
  });
  
  app.get('/reg', check.checkNotLogin);
  app.get('/reg', function(req, res) {
    res.render('reg', { 
      title: '注册',
      user: req.session.user,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });
  });
  app.post('/reg', check.checkNotLogin);
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
      if(user.length != 0) {
        req.flash('error', '用户已经存在！');
        return res.redirect('/reg');
      } else {
        User.insert("users", [newUser], function() {
          req.session.user = user[0];
          req.flash('success', '注册成功！');
          return res.redirect('/');
        });
      }
    });
  });
  
  app.get('/login', check.checkNotLogin);
  app.get('/login', function(req, res) {
    res.render('login', {
      title: '登陆',
      user: req.session.user,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });
  });
  app.post('/login', check.checkNotLogin);
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
      req.session.user = user[0];
      req.flash('success', "登录成功！");
      res.redirect('/');
    });
  });
  
  app.get('/post', check.checkLogin);
  app.get('/post', function(req, res) {
    res.render('post', {
      title: '发表',
      user: req.session.user,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });
  });
  app.post('/post', check.checkLogin);
  app.post('/post', function(req, res) {
    var currentUser = req.session.user;
    console.log('currentUser: ', currentUser);
    var date = new Date();
    var time = {
      date: date,
      year: date.getFullYear(),
      month: date.getFullYear() + "-" + (date.getMonth() + 1),
      day: date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(),
      minute: date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()+ " " +
      date.getHours() + ":" + (date.getMinutes() < 10 ? '0'+date.getMinutes() : date.getMinutes())
    };
    var post = {
      name: currentUser.name,
      time: time,
      title: req.body.title,
      post: req.body.post
    };
    Post.insert("posts", [post], function() {
      req.flash('success', "发布成功！");
      res.redirect('/');
    });
  });
  app.get('/logout', check.checkLogin);
  app.get('/logout', function(req, res) {
    req.session.user = null;
    req.flash('success', "登出成功！");
    res.redirect('/');
  });
}