let Customer = require('../models/customers');
let bcrypt = require('bcrypt-nodejs');
let express = require('express');
let router = express.Router();
let jwt = require('jsonwebtoken');
let JWT_SECRET = require('../configuration/secertkey_config');
let mailer = require('../middleware/mailer')

router.signUp = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    let checkEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
    let customer = new Customer();
    customer.username = req.body.username;
    customer.password = bcrypt.hashSync(req.body.password);
    customer.name = req.body.name;
    customer.register_date = Date.now();
    // console.log(req.body.password+" " +req.body.password.length)

    if(customer.username == null || customer.password == null || customer.name == null) {
        res.json({ message : 'Username, Password and Name must be Required!', data: null });
    }
    else if (!checkEmail.test(customer.username)){
        res.json({ message : 'Email address format error!', data: null });
    }
    else if((8 > req.body.password.length) || (req.body.password.length > 16)) {
        res.json({ message : 'Password must be Between 8 Characters and 16 Characters!', data: null });
    } else if(!(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W])[a-zA-Z\d\W?$]{8,16}/.test(req.body.password))){
        res.json({ message: 'Password must has Number, Lowercase Letter, Capital Letter and Special Character!', data: null});
        // }
        // else if(!(/\d/.test(req.body.password))) {
        //     res.json({ errmsg: 'Password must has number!'});
        // } else if(!(/[a-z]/.test(req.body.password))) {
        //     res.json({ errmsg: 'Password must has Lowercase Letters!'});
        // } else if(!(/[A-Z]/.test(req.body.password))) {
        //     res.json({ errmsg: 'Password must has Capital Letters!'});
        // } else if(!(/\W/.test(req.body.password))) {
        //     res.json({ errmsg: 'Password must has Spacial Characters!'});
    } else if(customer.name.length > 30){
        res.json({ message : 'Name must be less than 30 letters', data: null });
    }else{
        Customer.findOne({ username: req.body.username }, function (err, user) {
            if(user) {
                res.json({ message : 'Email already exists!', data: null });
            } else {
                Customer.findOne({ name: req.body.name }, function (err, result) {
                    if (result) {
                        res.json({ message : 'Name already exists!', data: null });
                    } else {
                        customer.save(function (err) {
                            if(err) {
                                res.json({ message: 'Customer Sign Up Unsuccessfully!',err : err, data: null});
                                return res.status(500).send();
                            } else {
                                mailer.send(customer.username, 'https://www.google.com');
                                res.json({message: 'Customer Sign Up Successfully!', data: customer});
                                return res.status(200).send();
                            }
                        });
                    }
                });
            }
        });
    }
};

signToken = (customer) => {
    return jwt.sign({
        iss: 'developer',
        sub: customer.id,
        iat: new Date().getTime()
    }, JWT_SECRET.JWT_CUSTOMER_SECRET);
};
router.signIn = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    Customer.findOne({username: req.body.username}, function (err, customer) {
        if(!customer) {
            res.json({ message: 'User Not Exists!', data: null });
        } else if(customer.active == false) {
            res.json({ message: 'User inactive!', data: null })
        } else{
            if(bcrypt.compareSync(req.body.password, customer.password)){
                let token = signToken(customer);
                res.header('token',token);
                // setting the 'set-cookie' header
                res.cookie('user', customer._id, {
                    // httpOnly: true, //Flags the cookie to be accessible only by the web server.
                    // // secure: true, //Marks the cookie to be used with HTTPS only.
                    // signed: true //Indicates if the cookie should be signed.
                });
                res.json({ message: 'Successfully Login', data: customer });
                console.log(req.cookies)
            }
            else
                res.json({ message: 'Username or Password Incorrect!', data: null });
        }
    });
};


module.exports = router;

