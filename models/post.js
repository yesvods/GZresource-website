var mongodb = require('./db');
var _ = require('underscore');
function Post(post){
  _.extend(this,post);
}

module.exports = Post;

Post.prototype.save = function(cb){
  //要存入的用户 Object Model
  var post = this;
  mongodb.open(function(err,db){
    if(err) return cb(err);

    db.collection('posts', function(err, collection){
      if(err){
        mongodb.close();
        return cb(err);
      }
      
      collection.insert(post,{
        safe: true
      }, function(err){
        mongodb.close();
        if(err) return cb(err);
        cb(null);
      });
    });
  });
};
Post.getById = function(id,cb){
  mongodb.open(function(err,db){
    if(err) return cb(err);
    db.collection('posts',function(err,collection){
      if(err){
        mongodb.close();
        return cb(err);
      }
      collection.findOne({
        _id:id
      },function(err,post){
        mongodb.close();
        if(err) return cb(err);
        cb(null,post);
      });
    });
  });
};