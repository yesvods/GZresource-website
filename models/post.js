var mongodb = require('mongodb').Db;
var settings = require('../settings');
var _ = require('underscore');
function Post(post){
  _.extend(this,post);
}

module.exports = Post;

Post.prototype.save = function(cb){
  //要存入的用户 Object Model
  var post = this;
  mongodb.connect(settings.url, function (err, db) {
    if(err) return cb(err);

    db.collection('posts', function(err, collection){
      if(err){
        db.close();
        return cb(err);
      }

      collection.insert(post,{
        safe: true
      }, function(err){
        db.close();
        if(err) return cb(err);
        cb(null);
      });
    });
  });
};
Post.getById = function(id,cb){
  mongodb.connect(settings.url, function (err, db) {
    if(err) return cb(err);
    db.collection('posts',function(err,collection){
      if(err){
        db.close();
        return cb(err);
      }
      collection.findOne({
        _id:id
      },function(err,post){
        db.close();
        if(err) return cb(err);
        cb(null,post);
      });
    });
  });
};
