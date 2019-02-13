let Seller = require('../models/sellers');
let bcrypt = require('bcrypt-nodejs');
let express = require('express');
let router = express.Router();
let jwt = require('jsonwebtoken');
let SECRET = require('../configuration/secertkey_config');
let mailer = require('../middleware/mailer');
let crypto = require('crypto');
let build_folder = require('../middleware/build_folder');

encryptCode = (username) => {
    let hmac = crypto.createHash('sha256', SECRET.ACTIVE_CODE);
    hmac.update(username);
    let code = hmac.digest('hex');
    return code;
};

router.signUp = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    let checkEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
    let code = encryptCode(req.body.username);
    let seller = new Seller();
    seller.username = req.body.username;
    seller.password = bcrypt.hashSync(req.body.password);
    seller.name = req.body.name;
    seller.description = req.body.description;
    seller.register_date = Date.now();
    seller.active_code = code;
    // console.log(req.body.password+" " +req.body.password.length)

    if(seller.username == null || seller.password == null || seller.name == null) {
        res.json({ errmsg : 'Username, Password and Name must be Required!' });
    }
    else if (!checkEmail.test(seller.username)){
        res.json({ errmsg : 'Email address format error!' });
    }
    else if((8 > req.body.password.length) || (req.body.password.length > 16)) {
        res.json({ errmsg : 'Password must be Between 8 Characters and 16 Characters!' });
    } else if(!(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W])[a-zA-Z\d\W?$]{8,16}/.test(req.body.password))){
        res.json({ errmsg: 'Password must has Number, Lowercase Letter, Capital Letter and Special Character!'});
        // }
        // else if(!(/\d/.test(req.body.password))) {
        //     res.json({ errmsg: 'Password must has number!'});
        // } else if(!(/[a-z]/.test(req.body.password))) {
        //     res.json({ errmsg: 'Password must has Lowercase Letters!'});
        // } else if(!(/[A-Z]/.test(req.body.password))) {
        //     res.json({ errmsg: 'Password must has Capital Letters!'});
        // } else if(!(/\W/.test(req.body.password))) {
        //     res.json({ errmsg: 'Password must has Spacial Characters!'});
    } else if(req.body.description.length > 200){
        res.json({ errmsg : 'Description must be less than 200 letters' });
    } else if(seller.name.length > 30){
        res.json({ errmsg : 'Name must be less than 30 letters' });
    }else{
        Seller.findOne({ username: req.body.username }, function (err, result) {
            if(result) {
                res.json({ errmsg : 'Email already exists!' });
            } else {
                Seller.findOne({ name: req.body.name }, function (err, user) {
                    if (user) {
                        res.json({ errmsg : 'Name already exists!' });
                    } else {
                        seller.save(function (err) {
                            if(err) {
                                res.json({ errmsg: 'Seller Sign Up Unsuccessfully!',err : err});
                                return res.status(500).send();
                            } else {
                                mailer.send(seller.username, 'seller', seller.active_code);
                                res.json({message: 'Seller Sign Up Successfully!', data: seller});
                                return res.status(200).send();
                            }
                        });
                    }
                });
            }
        });
    }
};

router.active = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    Seller.findOne({active_code: req.query.code}, function (err, seller) {
        if (!seller) {
            res.json({ message: 'Activation failed'});
        } else if ((Date.now() - seller.register_date) > (1000*60*30)){
            Seller.deleteOne({username: seller.username});
            res.json({ message: 'Link expired! Please sign up again'});
        } else {
            Seller.updateOne({ username: seller.username}, {active: true}, function(err, newSeller){
                if (err){
                    res.json({ message: err});
                } else {
                    res.json({ message: 'Successful activation', data: newSeller});
                }
            });
        }
    });
};

signToken = (seller) => {
    return jwt.sign({
        iss: 'developer',
        sub: seller.id,
        iat: new Date().getTime()
    }, SECRET.JWT_SELLER_SECRET);
};
router.signIn = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    Seller.findOne({username: req.body.username}, function (err, seller) {
        if(!seller) {
            res.json({ message: 'User Not Exists!', data: null});
        } else if(seller.active == false) {
            res.json({ message: 'User inactive!'})
        } else{
            if(bcrypt.compareSync(req.body.password, seller.password)){
                let token = signToken(seller);
                res.header('token',token);
                // setting the 'set-cookie' header
                res.cookie('user', seller._id, {
                    // httpOnly: true, //Flags the cookie to be accessible only by the web server.
                    // // secure: true, //Marks the cookie to be used with HTTPS only.
                    // signed: true //Indicates if the cookie should be signed.
                });
                res.json({ message: 'Successfully Login', data: seller });
                console.log(req.cookies)
            }
            else
                res.json({ message: 'Username or Password Incorrect!', data: null });
        }
    });
};

router.signout = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    if (req.headers.cookie != null) {
        res.removeHeader('cookie');
        res.clearCookie('user')
        res.json({ data: req.headers.cookie });
    } else{
        //     console.log(req.headers);
        res.json({ message: 'Please sign in first' });
    }
    // console.log(req.headers);
};


module.exports = router;

