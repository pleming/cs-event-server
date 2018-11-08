var fs = require('fs');
var path = require('path');
var express = require('express');
var createError = require('http-errors');
var cookieParser = require('cookie-parser');
var bodyParser = require("body-parser");
var logger = require('morgan');
var cors = require("cors");

var util = require('./modules/util');
var mysql = require('./modules/mysql');

var app = express();

var serviceConfig = JSON.parse(fs.readFileSync(path.join("./", "config.json"), "utf8"));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cors());

app.use(mysql.initialize(serviceConfig));

var apiList = [];
util.findFiles("./api", ".js", [], apiList, false);

for (var i = 0; i < apiList.length; i++) {
    var routePath = path.join("/", apiList[i]).replace(/\.js$/gim, "");
    var apiPath = "./" + apiList[i];
    app.use(routePath, require(apiPath));
    console.log("[api] %s(%s)", routePath, apiPath);
}

app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
