var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var cors = require('cors')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

let mongoose = require('mongoose');

// connect to mongodb
let mongodbUri = 'mongodb://shoppingdb:shoppingdb100@ds125331.mlab.com:25331/shoppingdb';
mongoose.connect(mongodbUri,{ useNewUrlParser: true });
let db = mongoose.connection;

db.on('error', function (err) {
    console.log('Unable to Connect to [ ' + db.name + ' ]', err);
});

db.once('open', function () {
    console.log('Successfully Connected to [ ' + db.name + ' ]');
});

const admin = require('./routes/admin');
const seller = require('./routes/seller');
const customer = require('./routes/customer');
const catalogue = require('./routes/catalogue');
const cookiekey = require('./configuration/secertkey_config');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// signed cookie
app.use(cookieParser(cookiekey.COOKIE_SECRET));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors({
    credentials: true,
    origin: 'http://localhost:8080'
}))

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use("*", function (req, res, next) {
    res.header('Access-Control-Allow-Origin', 'http://localhost:8080');
    res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With, token");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("Access-Control-Expose-Headers", "token");
    if (req.method === 'OPTIONS') {
        res.send(200)
    } else {
        next()
    }
});

// admin APIs
app.post('/register/admin', admin.signUp);
app.post('/login/admin', admin.signIn);
app.post('/logout/admin', admin.signout);

// seller APIs
app.post('/register/seller', seller.signUp);
app.post('/login/seller', seller.signIn);
app.get('/active/seller', seller.active);
app.get('/catalogue/:seller', catalogue.getAll);
app.put('/catalogue/edit/:seller/:id', catalogue.edit);
app.post('/catalogue/add/:seller', catalogue.create);
app.delete('/catalogue/remove/:seller/:id', catalogue.remove);

// customer APIs
app.post('/register/customer', customer.signUp);
app.post('/login/customer', customer.signIn);
app.get('/active/customer', customer.active);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;