var mongodb = require('./db');
var _ = require('underscore');
function User(user){
  _.extend(this,user);
};

module.exports = User;

User.prototype.save = function(cb){
  //要存入的用户 Object Model
  var user = this;
  mongodb.open(function(err,db){
    if(err) return cb(err);

    db.collection('users', function(err, collection){
      if(err){
        mongodb.close();
        return cb(err);
      }
      
      collection.insert(user,{
        safe: true
      }, function(err, user){
        mongodb.close();
        if(err) return cb(err);
        cb(null);
      })
    });
  });
}
User.getById = function(id,cb){
  mongodb.open(function(err,db){
    if(err) return cb(err);
    db.collection('users',function(err,collection){
      if(err){
        mongodb.close();
        return cb(err);
      }
      collection.findOne({
        _id:id
      },function(err,user){
        mongodb.close();
        if(err) return cb(err);
        cb(null,user);
      });
    });
  });
}
User.getByName = function(userName,cb){
  mongodb.open(function(err,db){
    if(err) return cb(err);
    db.collection('users',function(err,collection){
      if(err){
        mongodb.close();
        return cb(err);
      }
      collection.findOne({
        userName:userName
      },function(err,user){
        mongodb.close();
        if(err) return cb(err);
        cb(null,user);
      });
    });
  });
}