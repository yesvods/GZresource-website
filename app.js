
/**
 * Module dependencies.
 */
require("./public/js/dateFormat.js");
var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var MongoStore = require('connect-mongo')(express);
var fs = require('fs');
var formidable = require("formidable");
var settings = require('./settings.json');
var flash = require('connect-flash');
var _ = require('underscore');
var app = express();
// all environments

app.set('port', process.env.PORT || 80);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(flash());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(__dirname));
app.use(express.favicon('favicon.ico'));
app.use(express.logger('dev'));
app.use("/kindeditor/nodejs/uploadImg",  uploadImg);
app.use(express.bodyParser({keepExtensions: true, uploadDir: './public/files'}));
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(express.session({
  secret:settings.cookieSecret,
  cookie:{maxAge:1000*60*60*24*30},
  url: settings.url
}));
app.use(app.router);



// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

routes(app);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

/*
  Function for uploadImg in the post Page.
*/
function uploadImg(req, res, next) {
    var form = new formidable.IncomingForm();
    form.keepExtensions = true; //keep .jpg/.png
    var folderName = new Date().format('yyyy-MM-dd');
    var dirPath = __dirname + '/public/kindeditor/attached/' + folderName + "/";

    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath);
    }
    form.uploadDir = dirPath;
    form.parse(req, function (err, fields, files) {
        var filePath = files.imgFile.path.replace(/\\/g, '/');
        var resPath = '/public/kindeditor/attached/' + folderName + '/' + filePath.substring(filePath.lastIndexOf('/') + 1);
        res.send({ "error": 0, "url": resPath });
    });
}
