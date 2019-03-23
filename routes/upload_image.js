const multer = require('multer');
let multerS3 = require('multer-s3');
let aws = require('aws-sdk');
const conf = require('../configuration/secertkey_config');
let path = require('path');
let express = require('express');
let router = express.Router();
let buildFolder = require('../middleware/build_folder');
let Customer = require('../models/customers');
let Seller = require('../models/sellers');
let Product = require('../models/products');
let Image = require('../models/images');
let Logo = require('../models/logos');
let fs = require('fs');

aws.config.update({
    secretAccessKey: conf.AWS_Secret_Access_Key,
    accessKeyId: conf.AWS_Access_Key_ID,
    region: 'us-east-2'
});

const s3 = new aws.S3();

// const upload = multer({
//     storage: multerS3({
//         s3: s3,
//         bucket: 'shopping-website',
//         metadata: function (req, file, cb) {
//             cb(null, {fieldName: file.fieldname});
//         },
//         key: function (req, file, cb) {
//             cb(null, Date.now() + path.extname(file.originalname))
//         }
//     })
// });


router.productDetail = (req, res) => {
    res.setHeader('Content-Type', 'multipart/form-data');
    // let detailDir = './uploads/sellers/' + req.params.seller + '/products/' + req.params.id + '/details';
    // buildFolder.buildFolderSync(detailDir);
    // const storage = multer.diskStorage({
    //     destination: function (req, file, cb) {
    //         cb(null, detailDir);
    //     },
    //     filename: function (req,file,cb) {
    //         cb(null, Date.now() + path.extname(file.originalname));
    //     }
    // });
    let dir = 'sellers/' + req.params.seller + '/products/' + req.params.id + '/details/';
    Product.findOne({_id: req.params.id}, function (err, product) {
        if (!product) {
            return;
        } else {
            Image.findOneAndRemove({_id: product.detail_id}, function(err, image) {
                if (!image) {
                    return;
                } else {
                    for (let i = 0; i < image.key.length; i++) {
                        let key = image.key[i];
                        // deleteImage(key);
                    }
                }
            });
        }
    });

    const storage = multerS3({
        s3: s3,
        acl: 'public-read',
        bucket: conf.AwS_BUCKET,
        contentType: multerS3.AUTO_CONTENT_TYPE,
        metadata: function (req, file, cb) {
            cb(null, {fieldName: file.fieldname});
        },
        key: function (req, file, cb) {
            cb(null, dir + Date.now() + path.extname(file.originalname))
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
            return res.send(err.message);
        }else{
            let imagesPath = [];
            let imagesKey = [];
            for (let index = 0; index < req.files.length; index++) {
                imagesPath.push(req.files[index].location);
                imagesKey.push(req.files[index].key);
            }
            // console.log(imagesPath);
            let images = new Image();
            images.owner = req.params.id;
            images.key = imagesKey;
            images.path = imagesPath;
            images.register_date = Date.now();
            images.save(function (err) {
                if (err) {
                    // res.send({ message: 'Image not uploaded',file : null});
                    // console.log('Image not uploaded');
                    return res.status(500).send({ message: 'Image not uploaded',data : null});
                } else {
                    // res.send({message: 'Image Uploaded!', file: req.file});
                    // console.log('Image Uploaded');
                    // return res.status(200).send();
                    Image.findOne({owner: images.owner}, function (err, imgs) {
                        if (err) {
                            return res.status(500).send({message: 'Image not found', data: null});
                            // res.send({message: 'Image not found', file: null});
                            // console.log('Image not uploaded');
                        } else {
                            Product.updateOne({"_id": req.params.id},
                                {detail_id: imgs._id},
                                function (err) {
                                    if (err) {
                                        return res.status(500).send({message: 'Image not uploaded', data: null})
                                        // console.log('Image not uploaded');
                                        // return res.status(500).send();
                                    } else {
                                        return res.send({message: 'Images Uploaded!', data: imgs, files: req.files});
                                        // console.log('Image Uploaded');
                                        // return res.status(200).send();

                                    }
                                });
                        }
                    });
                }
            });
        }
    });
};

router.productBody = (req, res) => {
    res.setHeader('Content-Type', 'multipart/form-data');

    // let bodyDir = './uploads/sellers/' + req.params.seller + '/products/' + req.params.id + '/body';
    // buildFolder.buildFolderSync(bodyDir);
    // const storage = multer.diskStorage({
    //     destination: function (req, file, cb) {
    //         cb(null, bodyDir);
    //     },
    //     filename: function (req,file,cb) {
    //         cb(null, Date.now() + path.extname(file.originalname));
    //     }
    // });
    let dir = 'sellers/' + req.params.seller + '/products/' + req.params.id + '/body/';
    Product.findOne({_id: req.params.id}, function (err, product) {
        if (!product) {
            return;
        } else {
            Image.findOneAndRemove({_id: product.body_id}, function(err, image) {
                if (!image) {
                    return;
                } else {
                    let key = image.key[0];
                    // deleteImage(key);
                }
            });
        }
    });

    const storage = multerS3({
        s3: s3,
        acl: 'public-read',
        bucket: conf.AwS_BUCKET,
        contentType: multerS3.AUTO_CONTENT_TYPE,
        metadata: function (req, file, cb) {
            cb(null, {fieldName: file.fieldname});
        },
        key: function (req, file, cb) {
            cb(null, dir + Date.now() + path.extname(file.originalname))
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
        limits: {fileSize:5 * 1024 * 1024},
        fileFilter: fileFilter
    }).array('productBody');

    upload(req,res,(err) => {
        if (err) {
            return res.send(err.message);
        } else {
            let image = new Image();
            image.owner = req.params.id;
            image.key = req.file.key;
            image.path = req.file.location;
            image.register_date = Date.now();
            image.save(function (err) {
                if(err) {
                    // res.send({ message: 'Image not uploaded',file : null});
                    // console.log('Image not uploaded');
                    return res.status(500).send({ message: 'Image not uploaded',data : null});
                } else {
                    // res.send({message: 'Image Uploaded!', file: req.file});
                    // console.log('Image Uploaded');
                    // return res.status(200).send();
                    Image.findOne({path: req.file.path}, function (err, img) {
                        if (err) {
                            return res.status(500).send({message: 'Image not found', data: null});
                            // res.send({message: 'Image not found', file: null});
                            // console.log('Image not uploaded');
                        } else {
                            Product.updateOne({"_id": req.params.id},
                                {body_id: img._id},
                                function (err) {
                                    if (err){
                                        return res.send({message: 'Image not uploaded', data: null});
                                        // console.log('Image not uploaded');
                                        // return res.status(500).send();
                                    } else {
                                        return res.send({message: 'Image Uploaded!', data: img, file: req.file});
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
    res.setHeader('Content-Type', 'multipart/form-data');

    // let bodyDir = './uploads/sellers/' + req.params.seller + '/account/';
    // buildFolder.buildFolderSync(bodyDir);
    // const storage = multer.diskStorage({
    //     destination: function (req, file, cb) {
    //         cb(null, bodyDir);
    //     },
    //     filename: function (req,file,cb) {
    //         cb(null, Date.now() + path.extname(file.originalname));
    //     }
    // });
    let dir = 'sellers/' + req.params.seller + '/account/';
    Logo.findOneAndRemove({owner: req.params.seller}, function (err, logo) {
        if (!logo) {
            return;
        } else {
            let key = logo.path;
            // deleteImage(key);
        }
    });

    const storage = multerS3({
        s3: s3,
        acl: 'public-read',
        bucket: conf.AwS_BUCKET,
        contentType: multerS3.AUTO_CONTENT_TYPE,
        metadata: function (req, file, cb) {
            cb(null, {fieldName: file.fieldname});
        },
        key: function (req, file, cb) {
            cb(null, dir + Date.now() + path.extname(file.originalname))
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
            return res.send(err.message);
        } else {
            let logo = new Logo();
            logo.owner = req.params.seller;
            logo.key = req.file.key;
            logo.path = req.file.location;
            logo.register_date = Date.now();
            logo.save(function (err) {
                if(err) {
                    // res.json({ message: 'Logo not uploaded',file : null});
                    return res.status(500).send({ message: 'Logo not uploaded',data : null});
                } else {
                    // res.json({message: 'Image Uploaded!', file: req.file});
                    // return res.status(200).send();
                    Logo.findOne({path: logo.path}, function (err, img) {
                        if (err) {
                            return res.json({message: 'Logo not found', data: null});
                        } else {
                            Seller.updateOne({"_id": req.params.seller},
                                {logo_id: img._id},
                                function (err) {
                                    if (err){
                                        return res.json({message: 'Image not uploaded', data: null})
                                    } else {
                                        return res.json({message: 'Image Uploaded!', data: img, file: req.file});
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
    res.setHeader('Content-Type', 'multipart/form-data');

    // let bodyDir = './uploads/customers/' + req.params.customer + '/account/';
    // buildFolder.buildFolderSync(bodyDir);
    // const storage = multer.diskStorage({
    //     destination: function (req, file, cb) {
    //         cb(null, bodyDir);
    //     },
    //     filename: function (req,file,cb) {
    //         cb(null, Date.now() + path.extname(file.originalname));
    //     }
    // });
    let dir = 'customers/' + req.params.customer + '/account/';
    Logo.findOneAndRemove({owner: req.params.customer}, function (err, logo) {
        if (!logo) {
            console.log('No logo')
            return;
        } else {
            let key = logo.path;
            // deleteImage(key);
        }
    });

    const storage = multerS3({
        s3: s3,
        acl: 'public-read',
        bucket: conf.AwS_BUCKET,
        contentType: multerS3.AUTO_CONTENT_TYPE,
        metadata: function (req, file, cb) {
            cb(null, {fieldName: file.fieldname});
        },
        key: function (req, file, cb) {
            cb(null, dir + Date.now() + path.extname(file.originalname))
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
            return res.send(err.message);
        } else {
            let logo = new Logo();
            logo.owner = req.params.customer;
            logo.key = req.file.key;
            logo.path = req.file.location;
            logo.register_date = Date.now();
            logo.save(function (err) {
                if(err) {
                    // res.json({ message: 'Logo not uploaded',file : null});
                    return res.status(500).send({ message: 'Logo not uploaded',data : null});
                } else {
                    // res.json({message: 'Image Uploaded!', file: req.file});
                    // return res.status(200).send();
                    Logo.findOne({path: logo.path}, function (err, img) {
                        if (err) {
                            return res.json({message: 'Logo not found', data: null});
                        } else {
                            Customer.updateOne({"_id": req.params.customer},
                                {logo_id: img._id},
                                function (err) {
                                    if (err){
                                        return res.json({message: 'Image not uploaded', data: null})
                                    } else {
                                        return res.json({message: 'Image uploaded', data: img, file: req.file})
                                    }
                                });
                        }
                    });
                }
            });
        }
    });
};

function deleteImage (key){
    let params = {
        Bucket: conf.AwS_BUCKET,
        Key: key
    };
    s3.deleteObject(params, function (err, data) {
                if (err) {
                    console.log('failed');
                } else {
                    console.log(data);
                    return data;
                }
            });
};

router.getCustomerLogo = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    Logo.findOne({owner: req.params.customer}, function (err, logo) {
        if (!logo) {
            res.json({message: 'Get logo path failed', data: null});
        }else {
            res.json({message: 'Get logo path', data: logo.path});
        }
    })
};

router.getSellerLogo = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    Logo.findOne({owner: req.params.seller}, function (err, logo) {
        if (err) {
            res.json({message: 'Get logo path failed', data: null});
        }else {
            res.json({message: 'Get logo path', data: logo.path});
        }
    })
};

router.getProductImage = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    Image.findById(req.params.id, function (err, img) {
        if (err) {
            res.json({message: 'Get product detail image path failed', data: null});
        }else {
            res.json({message: 'Get product detail image path', data: img.path});
        }
    })
};


module.exports = router;
