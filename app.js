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
mongoose.connect(mongodbUri,{ useNewUrlParser: true, useCreateIndex: true });
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
const product = require('./routes/product');
const uploadImage = require('./routes/upload_image');
const address = require('./routes/address');
const classification = require('./routes/classification');
const cookiekey = require('./configuration/secertkey_config');
const auth = require('./middleware/auth');

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
app.get('/admin/:admin', admin.findOne);
app.put('/admin/:admin/editwithpass', auth.authAdmin, admin.editWithPassword);
app.put('/admin/:admin/editwithoutpass', auth.authAdmin, admin.editWithoutPassword);
app.get('/admin/:admin/classification/type/:type', auth.authAdmin, classification.getClassificationByType);
app.get('/admin/classification/type_active/:type', classification.getActiveClassificationByType);
app.get('/admin/:admin/classification/title/:title', auth.authAdmin, classification.getClassificationByTitle);
app.get('/admin/classification/title_active/:title', classification.getActiveClassificationByTitle);
app.post('/admin/:admin/classification', auth.authAdmin, classification.add);
app.put('/admin/:admin/classification/:id', auth.authAdmin, classification.edit);
app.delete('/admin/:admin/classification/:id', auth.authAdmin, classification.remove);

// seller APIs
app.post('/register/seller', seller.signUp);
app.post('/login/seller', seller.signIn);
app.get('/active/seller', seller.active);
app.get('/seller/:seller', auth.authSeller, seller.getOne);//auth.authSeller,
app.get('/:seller/catalogues', auth.authSeller, catalogue.getAll);
app.get('/:seller/catalogue/:id', auth.authSeller, catalogue.getOne);//auth.authSeller,
app.put('/:seller/catalogue/edit/:id', auth.authSeller, catalogue.edit);
app.post('/:seller/catalogue/add', auth.authSeller, catalogue.create);
app.delete('/catalogue/remove/:id', catalogue.remove);
app.post('/:seller/product/add', auth.authSeller, product.add);
// app.put('/product/save/:seller/:id', product.show);
app.put('/:seller/product/edit/:id', auth.authSeller, product.edit);
app.delete('/product/delete/:id', product.remove);
// app.get('/:seller/product/type/:type', auth.authSeller, product.getByType);
//app.get('/:seller/product/region/:region', product.getByRegion);
app.get('/:seller/product/:catalogue', auth.authSeller, product.getByCatalogue);
app.get('/product/:id', product.getOne);
// app.get('/products/:id', product.getProduct);
app.post('/:seller/product/:id/productDetail', auth.authSeller, uploadImage.productDetail);
app.post('/:seller/product/:id/productBody', auth.authSeller, uploadImage.productBody);
app.post('/seller/:seller/uploadLogo', auth.authSeller, uploadImage.sellerLogo);
app.put('/seller/:seller/edit', auth.authSeller, seller.editAccount);
app.put('/seller/:seller/editwithoutpass', auth.authSeller, seller.editAccountWithoutPass);
//app.get('/seller/:seller/logo', auth.authSeller, uploadImage.loadSellerLogo);
//app.get('/seller/:seller/product/:id/body', auth.authSeller, uploadImage.loadProductBodyImg);
//app.get('/seller/product/:id/mainImg', uploadImage.getMainImg);


// customer APIs
app.post('/register/customer', customer.signUp);
app.post('/login/customer', customer.signIn);
app.get('/active/customer', customer.active);
app.get('/customer/:customer', auth.authCustomer, customer.getOne);
app.post('/customer/:customer/uploadLogo', auth.authCustomer, uploadImage.customerLogo);
app.put('/customer/:customer/edit', auth.authCustomer, customer.editAccount);
app.put('/customer/:customer/editwithoutpass', auth.authCustomer, customer.editAccountWithoutPass);
//app.get('/customer/:customer/logo', auth.authCustomer, uploadImage.loadCustomerLogo);
app.post('/customer/:customer/address/add', address.add);
app.put('/customer/:customer/address/:id/edit', address.edit);
app.delete('/customer/address/:id', address.remove);
app.get('/customer/:customer/addresses', address.getByCustomer);
app.get('/customer/address/:id', address.getOne);


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
