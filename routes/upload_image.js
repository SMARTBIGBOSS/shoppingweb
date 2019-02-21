const multer = require('multer');
let path = require('path');
let express = require('express');
let router = express.Router();
let buildFolder = require('../middleware/build_folder');
let Customer = require('../models/customers');
let Seller = require('../models/sellers');
let Product = require('../models/products');
let Image = require('../models/images')
let fs = require('fs');

router.productDetail = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    let detailDir = './uploads/sellers/' + req.params.user + '/products/' + req.params.id + '/details';
    buildFolder.buildFolderSync(detailDir);
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, detailDir);
        },
        filename: function (req,file,cb) {
            cb(null, Date.now() + path.extname(file.originalname));
        }
    });
    const fileFilter = (req, file, cb) => {
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
            cb(null, true)
        } else {
            cb(new Error('File not support'), false)
        }
    };

    const upload = multer({
        storage: storage,
        limits: {fileSize:1024 * 1024 * 5},
        fileFilter: fileFilter
    }).array('productDetails');

    upload(req,res,(err) => {
        if(err){
            res.send(err.message);
        }else{
            console.log(req);
            res.json({message: 'Upload successfully', data: req.files});
        }
    });
};

router.productBody = (req, res) => {
    // res.setHeader('Content-Type', 'application/json');

    let bodyDir = './uploads/sellers/' + req.params.user + '/products/' + req.params.id + '/body';
    buildFolder.buildFolderSync(bodyDir);
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, bodyDir);
        },
        filename: function (req,file,cb) {
            cb(null, Date.now() + path.extname(file.originalname));
        }
    });
    const fileFilter = (req, file, cb) => {
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
            cb(null, true);
        } else {
            cb(new Error('File not support'), false);
        }
    };
    const upload = multer({
        storage: storage,
        limits: {fileSize:1024 * 1024},
        fileFilter: fileFilter
    }).single('productBody');

    upload(req,res,(err) => {
        if (err) {
            res.send(err.message);
        } else {
            let image = new Image();
            image.owner = req.params.user;
            image.path = req.file.path;
            image.register_date = Date.now();
            image.save(function (err) {
                if(err) {
                    // res.send({ message: 'Image not uploaded',file : null});
                    console.log('Image not uploaded');
                    return res.status(500).send();
                } else {
                    // res.send({message: 'Image Uploaded!', file: req.file});
                    console.log('Image Uploaded');
                    // return res.status(200).send();
                    Image.findOne({path: req.file.path}, function (err, img) {
                        if (err) {
                            return res.status(500).send();
                            // res.send({message: 'Image not found', file: null});
                            console.log('Image not uploaded');
                        } else {
                            Product.update({"_id": req.params.id},
                                {body_id: img._id},
                                function (err) {
                                    if (err){
                                        // res.send({message: 'Image not uploaded', data: null})
                                        console.log('Image not uploaded');
                                        return res.status(500).send();

                                    } else {
                                        // res.send({message: 'Image Uploaded!', data: img});
                                        console.log('Image Uploaded');
                                        return res.status(200).send();

                                    }
                                });
                        }
                    });
                }
            });
        }
    });
};

router.sellerLogo = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    let bodyDir = './uploads/sellers/' + req.params.user + '/account/';
    buildFolder.buildFolderSync(bodyDir);
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, bodyDir);
        },
        filename: function (req,file,cb) {
            cb(null, Date.now() + path.extname(file.originalname));
        }
    });
    const fileFilter = (req, file, cb) => {
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
            cb(null, true);
        } else {
            cb(new Error('File not support'), false);
        }
    };
    const upload = multer({
        storage: storage,
        limits: {fileSize:1024 * 1024},
        fileFilter: fileFilter
    }).single('logo');

    upload(req,res,(err) => {
        if (err) {
            res.send(err.message);
        } else {
            let logo = new Image();
            logo.owner = req.params.user;
            logo.path = req.file.path;
            logo.register_date = Date.now();
            logo.save(function (err) {
                if(err) {
                    res.json({ message: 'Logo not uploaded',file : null});
                    return res.status(500).send();
                } else {
                    res.json({message: 'Image Uploaded!', file: req.file});
                    // return res.status(200).send();
                    Image.findOne({path: req.file.path}, function (err, img) {
                        if (err) {
                            res.json({message: 'Logo not found', file: null});
                        } else {
                            Seller.update({"_id": req.params.user},
                                {logo_id: img._id},
                                function (err) {
                                    if (err){
                                        res.json({message: 'Image not uploaded', data: null})
                                    } else {
                                        res.json({message: 'Image Uploaded!', data: img});
                                    }
                                });
                        }
                    });
                }
            });
        }
    });
};

router.customerLogo = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    let bodyDir = './uploads/customers/' + req.params.user + '/account/';
    buildFolder.buildFolderSync(bodyDir);
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, bodyDir);
        },
        filename: function (req,file,cb) {
            cb(null, Date.now() + path.extname(file.originalname));
        }
    });
    const fileFilter = (req, file, cb) => {
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
            cb(null, true);
        } else {
            cb(new Error('File not support'), false);
        }
    };
    const upload = multer({
        storage: storage,
        limits: {fileSize:1024 * 1024},
        fileFilter: fileFilter
    }).single('logo');

    upload(req,res,(err) => {
        if (err) {
            res.send(err.message);
        } else {
            let logo = new Image();
            logo.owner = req.params.user;
            logo.path = req.file.path;
            logo.register_date = Date.now();
            logo.save(function (err) {
                if(err) {
                    res.json({ message: 'Logo not uploaded',file : null});
                    return res.status(500).send();
                } else {
                    res.json({message: 'Image Uploaded!', file: req.file});
                    // return res.status(200).send();
                    Image.findOne({path: req.file.path}, function (err, img) {
                        if (err) {
                            res.json({message: 'Logo not found', file: null});
                        } else {
                            Customer.update({"_id": req.params.user},
                                {logo_id: img._id},
                                function (err) {
                                    if (err){
                                        res.json({message: 'Image not uploaded', data: null})
                                    } else {
                                        res.json({message: 'Image Uploaded!', data: img});
                                    }
                                });
                        }
                    });
                }
            });
        }
    });
};

readImg = function(path,res){
    fs.readFile(path,'binary',function(err,file){
        if(err){
            console.log(err);
            return ;
        }else{
            res.write(file,'binary');
            res.end();
        }
    });
};

router.loadCustomerLogo = (req, res) => {
    res.writeHead(200,{'Content-Type' : 'image/jpeg'});

    let imgId = '';
    Customer.findById(req.params.user, function(err, user){
        if (err) {
            res.json({message: 'Customer not found'});
        } else {
            imgId = user.logo_id;
            console.log(user.logo_id);
            console.log(imgId);
            Image.findById(imgId, function (err, logo) {
                if (err) {
                    res.json({message: 'Logo not found'});
                } else {
                    if(req.url != '/favicon.ico'){
                        readImg(logo.path, res);
                    }
                }
            });
        }
    });
};

router.loadSellerLogo = (req, res) => {
    res.writeHead(200,{'Content-Type' : 'image/jpeg'});

    let imgId = '';
    Seller.findById(req.params.user, function(err, user){
        if (err) {
            res.json({message: 'Seller not found'});
        } else {
            imgId = user.logo_id;
            console.log(user.logo_id);
            console.log(imgId);
            Image.findById(imgId, function (err, logo) {
                if (err) {
                    res.json({message: 'Logo not found'});
                } else {
                    if(req.url != '/favicon.ico'){
                        readImg(logo.path, res);
                    }
                }
            });
        }
    });
};

module.exports = router;
