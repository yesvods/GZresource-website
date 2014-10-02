var mongodb = require('./db');
var _ = require('underscore');
function Mess(mess){
  _.extend(this,mess);
}

module.exports = Mess;

Mess.prototype.save = function(cb){
  //要存入的留言
  var mess = this;
  mongodb.open(function(err,db){
    if(err) return cb(err);
    db.collection("message",function(err,collection){
      if(err){
        mongodb.close();
        return cb(err);
      }
      collection.insert(mess,function(err,mess){
        mongodb.close();
        if(err) return cb(err);
        cb(null,mess);
      });
    });
  });
};
Mess.getByContact = function(contact, cb){
  mongodb.open(function(err,db){
    if(err) return cb(err);
    db.collection("message",function(err,collection){
      if(err){
        mongodb.close();
        return cb(err);
      }
      collection.findOne({contactMess:contact},function(err,messages){
        mongodb.close();
        if(err) return cb(err);
        cb(null,messages);
      });
    });
  });
};
Mess.getAll = function(cb){
  mongodb.open(function(err,db){
    if(err) return cb(err);
    db.collection("message",function(err,collection){
      if(err){
        mongodb.close();
        return cb(err);
      }
      collection.find({},function(err,messages){
        mongodb.close();
        if(err) return cb(err);
        cb(null,messages);
      });
    });
  });
};