let chai= require('chai');
let chaiHttp = require('chai-http');
let things = require('chai-things');
let mongoose = require('mongoose');
let bcrypt = require('bcrypt-nodejs');
let _ = require('lodash');

let expect = chai.expect;
chai.use( things);
chai.use(chaiHttp);

let mongodbUri = 'mongodb://shoppingdb:shoppingdb100@ds125331.mlab.com:25331/shoppingdb';

mongoose.connect(mongodbUri,{useNewUrlParser:true},function(err){
    if(err)
        console.log('Connection Error:' + err);
    else
        console.log('Connection to database success!');
});
let db = mongoose.connection;
let server = null ; // CHANGED
let datastore = null ; // CHANGED
let password = bcrypt.hashSync(567);

describe('Customer Test', function (){
    before(function (done) {
        delete require.cache[require.resolve('../bin/www')];
        delete require.cache[require.resolve('../models/customers')];
        datastore = require('../models/customers');
        server = require('../bin/www');
        // token = jwt.sign({_id: datastore._id}, 'sellerJwtKey');
        try{
            let customer1 = new datastore(
                {   'name': 'testc1','username': 'c1@test.com','password': password,
                    'register_date': Date.now(), 'active': true, 'active_code': null, 'logo_id': null
                });
            let customer2 = new datastore(
                {
                    'name': 'testc2','username': 'c2@test.com','password': password,
                    'register_date': Date.now(), 'active': false, 'active_code': null, 'logo_id': null
                });
            customer1.save();
            customer2.save();
            console.log('Customer insert success.');
            done();
        }catch (e) {
            console.log(e);
        }
    });
    after(function(done){
        try{
            db.collection('customer').deleteMany({'name': { $in: ['testc1','testc2'] }});
            console.log('Customers delete success.');
            done();
        }catch (e) {
            console.log(e);
        }
    });

    describe('POST /login/customer', () => {
        it('should return a message and a valid customer', function (done) {
            let customer = {'username': 'c1@test.com', 'password': '567'};
            chai.request(server).post('/login/customer').send(customer).end(function (err, res) {
                expect(res.body).to.be.a('object');
                expect(res.body).to.have.property('message').equal('Successfully Login');
                expect(res.body.data).to.have.property('name','testc1');
                done();
            });
        });
        it('should return a Not Exist and null data', function (done) {
            let customer = {'username': 'c0@test.com', 'password': '567'};
            chai.request(server).post('/login/customer').send(customer).end(function (err, res) {
                expect(res.body).to.be.a('object');
                expect(res.body).to.have.property('message').equal('User Not Exists!');
                expect(res.body.data).to.equal(null);
                done();
            });
        });
        it('should return an inactive message and null data', function (done) {
            let customer = {'username': 'c2@test.com', 'password': '567'};
            chai.request(server).post('/login/customer').send(customer).end(function (err, res) {
                expect(res.body).to.be.a('object');
                expect(res.body).to.have.property('message').equal('User inactive!');
                expect(res.body.data).to.equal(null);
                done();
            });
        });
        it('should return an match failed message and null data', function (done) {
            let customer = {'username': 'c1@test.com', 'password': '5'};
            chai.request(server).post('/login/customer').send(customer).end(function (err, res) {
                expect(res.body).to.be.a('object');
                expect(res.body).to.have.property('message').equal('Username or Password Incorrect!');
                expect(res.body.data).to.equal(null);
                done();
            });
        });
    });
});
