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
                        deleteImage(key);
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
                    return res.status(500).send({ message: 'Image not uploaded',file : null});
                } else {
                    // res.send({message: 'Image Uploaded!', file: req.file});
                    // console.log('Image Uploaded');
                    // return res.status(200).send();
                    Image.findOne({owner: images.owner}, function (err, imgs) {
                        if (err) {
                            return res.status(500).send();
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
                                        return res.send({message: 'Image Uploaded!', data: imgs, files: req.files});
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
                    deleteImage(key);
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
    }).single('productBody');

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
                    return res.status(500).send();
                } else {
                    // res.send({message: 'Image Uploaded!', file: req.file});
                    // console.log('Image Uploaded');
                    // return res.status(200).send();
                    Image.findOne({path: req.file.path}, function (err, img) {
                        if (err) {
                            return res.status(500).send();
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
            deleteImage(key);
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
                    return res.status(500).send({ message: 'Logo not uploaded',file : null});
                } else {
                    // res.json({message: 'Image Uploaded!', file: req.file});
                    // return res.status(200).send();
                    Logo.findOne({path: logo.path}, function (err, img) {
                        if (err) {
                            return res.json({message: 'Logo not found', file: null});
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
            return;
        } else {
            let key = logo.path;
            deleteImage(key);
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
                    return res.status(500).send();
                } else {
                    // res.json({message: 'Image Uploaded!', file: req.file});
                    // return res.status(200).send();
                    Logo.findOne({path: logo.path}, function (err, img) {
                        if (err) {
                            return res.json({message: 'Logo not found', file: null});
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
        Delete: {Objects: [{Key: key}]}
    };
    s3.deleteObjects(params, function (err, data) {
                if (err) {
                    // console.log('failed');
                } else {
                    // console.log('delete');
                    return data;
                }
            });
};

// router.loadCustomerLogo = (req, res) => {
//     res.setHeader('Content-Type', 'application/json');
//
//     Customer.findById(req.params.customer, function (err, customer) {
//         if (err) {
//             res.json({message: 'Customer not existed', data: null});
//         } else {
//             if (customer.logo_id != null) {
//                 Logo.findById(customer.logo_id, function (err, logo) {
//                     if (err) {
//                         res.json({message: 'Logo not existed', data: null});
//                     } else {
//                         let key = logo.path;
//                         let options = {
//                             Bucket: conf.AwS_BUCKET,
//                             Key: key,
//                         };
//                         var file = fs.createWriteStream('./upload/');
//                         // s3.getObject(options, function (err, data) {
//                         //     if(!err) {
//                         //         const body = Buffer.from(data.Body);
//                         //         res.write(body,'binary')
//                         //         res.end();
//                         //     }
//                         // });
//                         res.writeHead(200,{'Content-Type' : 'image/png'});
//                         s3.getObject(options) .createReadStream()
//                             .on('error', function(err){
//                                 res.status(500).json({error:"Error -> " + err});
//                             }).pipe(res);
//                     }
//                 });
//             }
//         }
//     });
// };

// readImg = function(path,res){
//     fs.readFile(path,'binary',function(err,file){
//         if(err){
//             // console.log(err);
//             // return ;
//             res.send({message: 'Read file failed'})
//         }else{
//             res.writeHead(200,{'Content-Type' : 'image/jpeg'});
//
//             res.write(file,'binary');
//             res.end();
//         }
//     });
// };


// router.loadCustomerLogo = (req, res) => {
//     res.writeHead(200,{'Content-Type' : 'image/jpeg'});
//
//     let imgId = '';
//     Customer.findById(req.params.customer, function(err, user){
//         if (err) {
//             res.json({message: 'Customer not found'});
//         } else {
//             imgId = user.logo_id;
//             // console.log(user.logo_id);
//             // console.log(imgId);
//             Logo.findById(imgId, function (err, logo) {
//                 if (!logo) {
//                     res.json({message: 'Logo not found'});
//                 } else {
//                     if(req.url != '/favicon.ico'){
//                         readImg(logo.path, res);
//                     }
//                 }
//             });
//         }
//     });
// };

// router.loadSellerLogo = (req, res) => {
//     res.writeHead(200,{'Content-Type' : 'image/jpeg'});
//
//     let imgId = '';
//     Seller.findById(req.params.seller, function(err, user){
//         if (err) {
//             res.json({message: 'Seller not found'});
//         } else {
//             imgId = user.logo_id;
//             // console.log(imgId);
//             Logo.findById(imgId, function (err, logo) {
//                 if (!logo) {
//                     res.json({message: 'Logo not found'});
//                 } else {
//                     if(req.url != '/favicon.ico'){
//                         readImg(logo.path, res);
//                     }
//                 }
//             });
//         }
//     });
// };

// router.loadProductBodyImg = (req, res) => {
//     res.writeHead(200,{'Content-Type' : 'image/jpeg'});
//
//     let imgId = '';
//     Product.findById(req.params.id, function(err, product){
//         if (err) {
//             // res.json({message: 'Product not found'});
//         } else {
//             imgId = product.body_id;
//             // console.log(imgId);
//             Image.findById(imgId, function (err, image) {
//                 if (!image) {
//                     // res.json({message: 'Logo not found'});
//                 } else {
//                     console.log(image.path);
//                     if(req.url != '/favicon.ico'){
//                         readImg(image.path[0], res);
//                     }
//                 }
//             });
//         }
//     });
// };


// router.getMainImg = (req, res) => {
//     // res.writeHead(200,{'Content-Type' : 'image/jpeg'});
//     // res.setHeader('Content-Type', 'application/json');
//
//     let imgId = '';
//     Product.findById(req.params.id, function(err, product){
//         if (err) {
//             // res.json({message: 'Product not found'});
//         } else {
//             imgId = product.detail_id;
//             // console.log(imgId);
//             Image.findById(imgId, function (err, image) {
//                 if (!image) {
//                     res.json({message: 'Image not found'});
//                 } else {
//                     // res.json({data: image.path[0]});
//                     if (image.path != null) {
//                         if(req.url != '/favicon.ico'){
//                             readImg(image.path[0], res);
//                         }
//                     }
//                 }
//             });
//         }
//     });
// };

module.exports = router;
