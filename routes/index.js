var crypto = require('crypto'),
    fs = require('fs'),
    User = require('../models/user.js'),
    Post = require('../models/post.js'),
    Mess = require('../models/mess.js'),
    _ = require('underscore'),
	settings = require("../settings.json")
    DBRef = require('mongodb').DBRef,
    ObjectId = require('mongodb').ObjectID;
/*
 * GET home page.
 */

module.exports = function(app){
  app.get("/", function(req,res){
    res.render('index', {
      user:req.session.user,
      err:req.flash('err').toString()
    });
  });
  app.post("/login", function(req,res){
    User.getByName(req.body.userName, function(err, user){
      if (err) {
        req.flash('err','登陆失败，请重试！');
        return res.redirect('/');
      }
      if(!user){
        req.flash('err','没有此用户');
        return res.redirect('/');
      }
      var md5 = crypto.createHash('md5');
      var password = md5.update(req.body.password).digest('hex');
      if(!(password==user.password)){
        req.flash('err','密码错误');
        return res.redirect('/');
      }
      req.session.user = user;
      res.redirect('/');
    });
    
  });
  app.get("/logout", function(req,res){
    req.session.user = null;
    res.redirect("/");
  });
  app.get("/reg", function(req,res){
    res.render('reg');
  });
  app.post("/reg", function(req,res){
    var result = {};
    var md5 = crypto.createHash('md5');
    req.body.password = md5.update(req.body.password).digest('hex');
    var newUser = new User(req.body);
    newUser.validate = 0;
    User.getByName(newUser.userName, function(err,user){
      if(user){
        result.err = "用户已存在";
      }else{
        result.success = "登陆成功";
        newUser.save(function(err){
          if(err) result.err = err;
        });
      }
      res.write(JSON.stringify(result));
      res.end();
    });
  });
  app.post("/leaveMess", function(req, res){
    var mess = new Mess(req.body);
    var result = {};
    Mess.getByContact(mess.contactMess, function(err,msg){
      if(err){ result.err = "留言失败，请重新提交！";}
      if(msg && msg.contentMess==mess.contentMess){
        result.err = "已经留言过了哦！";
      }else{
        mess.save(function(err,mess){
          if(err){ result.err = "留言失败，请重新提交！";}
        });
      }
      res.write(JSON.stringify(result));
      res.end();
    });
  });
  app.get("/Apost", function(req, res){
    res.render('Apost', {
      moduleName:settings.moduleName
    });
  });
  app.get("/post", function(req, res){
    res.render('post');
  });
  app.post("/post", function(req, res){
    /*
      The return result.
    */
    var result = {};
    /*
      deal with files upload
    */
    var post = {};
    post.userId = { "$ref" : "users", "$id" : ObjectId(req.session.user._id)};
    post.title = req.body.title;
    post.pubTime = _.now();
    post.clickCount = 0;
    post.content = req.body.content;
    post.uploads = [];
    post.classify = req.body.type;
    
    for (var i in req.files) {
      if(req.files[i].size == 0){
        fs.unlinkSync(req.files[i].path);
      }else{
        var filePath = req.files[i].name;
        if(filePath.indexOf(".")==-1){
          filePath+="#";
          filePath+=String(timeStamp()).toUpperCase();
        }else{
          var pathArr = filePath.split(".");
          filePath = pathArr[0]+"#"+String(timeStamp()).toUpperCase()+"."+pathArr[1];
        }
        var target_path = './public/files/' + filePath;
        fs.renameSync(req.files[i].path, target_path);
        post.uploads.push(target_path);
      }
    }
    /*
      save to DataBase
    */
    var newPost = new Post(post);
    newPost.save(function(err, post){
      if(err) result.err = err;return;
      if(!post) result.err = "提交失败，请重试！";
    });
    res.write(JSON.stringify(result));
    res.end();
  });

  /*
    To get the timeStamp format by 32
  */
  function timeStamp(){
    return Number(String(_.now()).slice(-3)).toString("32");
  }
};
