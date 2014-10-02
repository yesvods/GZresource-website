var settings = require("../settings"),
    Db = require("mongodb").Db,
    Connection = require("mongodb").Connection,
    Server = require("mongodb").Server;
module.exports = new Db(settings.dbSetting.db,new Server(settings.dbSetting.host,Connection.DEFAULT_PORT),{safe:true});
