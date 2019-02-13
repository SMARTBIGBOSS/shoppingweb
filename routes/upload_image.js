const multer = require('multer');
let path = require('path');
let express = require('express');
let router = express.Router();
let buildFolder = require('../middleware/build_folder');

router.productDetail = (req, res) => {
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
    let bodyDir = './uploads/sellers/' + req.params.user + '/products/' + req.params.id + '/body';
    buildFolder.buildFolderSync(bodyDir);
    const storage = multer.diskStorage({
        destination: function (req, file, logo) {
            logo(null, bodyDir);
        },
        filename: function (req,file,logo) {
            logo(null, Date.now() + path.extname(file.originalname));
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
            // res.render('uploadImage',{
            //     msg: err
            // });
        } else {
            console.log(req.file);
            res.json({message: 'Image Uploaded!', file: req.file});
        }
    });
};

module.exports = router;
