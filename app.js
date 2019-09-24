var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');
var session = require('express-session');
var Store = require('./libs/sessionStore')(session);
var AuthMiddleware = require("./middleware/checkAuth");
var config = require('./config');

var indexRouter = require('./routes/index');
var merchantRouter = require('./routes/merchant');

var app = express();
app.set('env',config.get('env'));
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js')); // redirect bootstrap JS
app.use('/js', express.static(__dirname + '/node_modules/jquery/dist')); // redirect JS jQuery
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css')); // redirect CSS bootstrap

// view engine setup
app.engine('ejs', require('ejs-locals'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use(session({
  secret: 'keyboard cat',
  store: Store,
  saveUninitialized:false,
  resave: false
}));

Store.sync();


app.use(require('./middleware/loadUser'));
app.use('/', indexRouter);
app.use('/merchant',AuthMiddleware, merchantRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.env = req.app.get('env');
  res.locals.error = req.app.get('env') === 'development' ? err : '';

  // render the error page
  res.status(err.status || 404);
  res.render('error');
});

module.exports = app;
