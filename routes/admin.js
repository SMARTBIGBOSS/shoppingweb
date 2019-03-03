let Admin = require('../models/administrators');
let bcrypt = require('bcrypt-nodejs');
let express = require('express');
let router = express.Router();
// let jwt = require('jsonwebtoken');
// let JWT_SECRET = require('../configuration/secertkey_config');

router.signUp = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    let checkEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
    let admin = new Admin();
    admin.username = req.body.username;
    admin.name = req.body.name;
    admin.register_date = Date.now();
    admin.password = bcrypt.hashSync(req.body.password);
    // console.log(req.body.password+" " +req.body.password.length)

    if(admin.username == null || admin.password == null || admin.name == null) {
        res.json({ message : 'Username and Password must be Required!' });
    } else if (!checkEmail.test(admin.username)){
        res.json({ message : 'Email address format error!' });
    }
    else if((8 > req.body.password.length) || (req.body.password.length > 16)) {
        res.json({ message : 'Password must be Between 8 Characters and 16 Characters!' });
    } else if(!(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W])[a-zA-Z\d\W?$]{8,16}/.test(req.body.password))){
        res.json({ message: 'Password must has Number, Lowercase Letter, Capital Letter and Special Character!'});
    // }
    // else if(!(/\d/.test(req.body.password))) {
    //     res.json({ errmsg: 'Password must has number!'});
    // } else if(!(/[a-z]/.test(req.body.password))) {
    //     res.json({ errmsg: 'Password must has Lowercase Letters!'});
    // } else if(!(/[A-Z]/.test(req.body.password))) {
    //     res.json({ errmsg: 'Password must has Capital Letters!'});
    // } else if(!(/\W/.test(req.body.password))) {
    //     res.json({ errmsg: 'Password must has Spacial Characters!'});
    }
    else if(admin.name.length > 30) {
        res.json({message: 'Name must be less than 30 letters'});
    } else {
        Admin.findOne({ username: req.body.username }, function (err, administrator) {
            if(administrator) {
                res.json({ message : 'Email already exists!' });
            } else {
                // let admin = new Admin();
                // admin.username = req.body.username;
                // admin.register_date = Date.now();
                // admin.password = bcrypt.hashSync(req.body.password);
                admin.save(function (err) {
                    if(err) {
                        res.json({ message: 'Administrator Sign Up Unsuccessfully!',err : err});
                        return res.status(500).send();
                    } else {
                        res.json({message: 'Administrator Sign Up Successfully!', data: admin});
                        return res.status(200).send();
                    }
                });
            }
        });
    }
};

// signToken = (administrator) => {
//     return jwt.sign({
//         iss: 'developer',
//         sub: administrator.id,
//         iat: new Date().getTime()
//     }, JWT_SECRET.JWT_ADMIN_SECRET);
// };
router.signIn = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    Admin.findOne({username: req.body.username}, function (err, administrator) {
        if(!administrator) {
            res.json({ message: 'User Not Exists!', data: null });
        } else if(administrator.active == false) {
            res.json({ message: 'User is Blocked!'})
        } else{
            if(bcrypt.compareSync(req.body.password, administrator.password)){
                // let token = signToken(administrator);
                // res.header('token',token);
                // setting the 'set-cookie' header
                res.cookie('user', administrator._id, {
                    httpOnly: true, //Flags the cookie to be accessible only by the web server.
                    // secure: true, //Marks the cookie to be used with HTTPS only.
                    signed: true //Indicates if the cookie should be signed.
                });
                res.json({ message: 'Successfully Login', data: administrator });
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

router.editWithPassword = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    let checkEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;

    if(req.body.username == null || req.body.password == null || req.body.name == null) {
        res.json({ message : 'Username and Password must be Required!' });
    } else if (!checkEmail.test(req.body.username)){
        res.json({ message : 'Email address format error!' });
    } else if((8 > req.body.password.length) || (req.body.password.length > 16)) {
        res.json({ errmsg : 'Password must be Between 8 Characters and 16 Characters!', data: null });
    } else if(!(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W])[a-zA-Z\d\W?$]{8,16}/.test(req.body.password))) {
        res.json({errmsg: 'Password must has Number, Lowercase Letter, Capital Letter and Special Character!', data: null});
    } else {
        let admin = new Admin({
            username: req.body.username,
            password: bcrypt.hashSync(req.body.password),
            name: req.body.name,
        });
        // console.log(seller);

        Admin.update({"_id": req.params.admin},
            {   username: admin.username,
                password: admin.password,
                name: admin.name
            },
            function (err, admin) {
                if (err) {
                    res.json({message: 'Seller not edited', data: null});
                } else {
                    res.json({message: 'Seller successfully edited', data: admin});
                }
            });
    }
};

router.editWithoutPassword = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    let checkEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;

    if(req.body.username == null || req.body.password == null || req.body.name == null) {
        res.json({ message : 'Username and Password must be Required!' });
    } else if (!checkEmail.test(req.body.username)){
        res.json({ message : 'Email address format error!' });
    } else {
        let admin = new Admin({
            username: req.body.username,
            name: req.body.name,
        });
        // console.log(seller);

        Admin.update({"_id": req.params.admin},
            {   username: admin.username,
                name: admin.name
            },
            function (err, admin) {
                if (err) {
                    res.json({message: 'Seller not edited', data: null});
                } else {
                    res.json({message: 'Seller successfully edited', data: admin});
                }
            });
    }
};

router.findOne = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    Admin.findById(req.params.admin, function(err, admin) {
        if (err) {
            res.json({message: 'Administrator not found', data: null});
        } else {
            res.json({data: admin});
        }
    });
};

module.exports = router;

