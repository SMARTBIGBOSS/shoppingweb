let chai= require('chai');
let chaiHttp = require('chai-http');
let things = require('chai-things');
let mongoose = require('mongoose');
let _ = require('lodash');

let expect = chai.expect;
chai.use( things);
chai.use(chaiHttp);

let db = mongoose.connection;
let server = null ; // CHANGED
let datastore = null ; // CHANGED

describe('Classification Test', function (){
    before(function (done) {
        delete require.cache[require.resolve('../bin/www')];
        delete require.cache[require.resolve('../models/customers')];
        datastore = require('../models/classification');
        server = require('../bin/www');
        // token = jwt.sign({_id: datastore._id}, 'sellerJwtKey');
        try{
            let clas1 = new datastore(
                {   'admin_id': '1','type': 'Category','title': 'clas1',
                    'subtitle': 'cate1', 'active': true, 'last_edit': Date.now()
                });
            let clas2 = new datastore(
                {
                    'admin_id': '2','type': 'Region','title': 'clas2',
                    'subtitle': 'regi1', 'active': true, 'last_edit': Date.now()
                });
            clas1.save();
            clas2.save();
            console.log('Classifications insert success.');
            done();
        }catch (e) {
            console.log(e);
        }
    });
    after(function(done){
        try{
            db.collection('classification').deleteMany({'admin_id': { $in: ['1','2'] }});
            console.log('Classifications delete success.');
            done();
        }catch (e) {
            console.log(e);
        }
    });

    describe('GET /admin/classification/type_active/:type', () => {
        it('should return a category classification', function (done) {
            chai.request(server).get('/admin/classification/type_active/Category').end(function (err, res) {
                expect(res.body).to.be.a('object');
                // expect(res.body).to.have.property('message').equal('Successfully Login');
                expect(res.body.data[4]).to.have.property('subtitle','cate1');
                done();
            });
        });
    });

    describe('GET /admin/classification/title_active/:title', () => {
        it('should return a category classification', function (done) {
            chai.request(server).get('/admin/classification/title_active/clas2').end(function (err, res) {
                expect(res.body).to.be.a('object');
                expect(res.body.data.length).to.equal(1);
                expect(res.body.data[0]).to.have.property('title','clas2');
                done();
            });
        });
    });
});
