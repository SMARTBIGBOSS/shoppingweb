const multer = require('multer');
let path = require('path');
let express = require('express');
let router = express.Router();
let buildFolder = require('../middleware/build_folder')

router.productDetail = (req, res) => {
    let uploadDir = './uploads/sellers/' + req.params.user + '/products/' + req.params.id + '/details';
    buildFolder.buildFolderSync(uploadDir);
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, uploadDir);
        },
        filename: function (req,file,cb) {
            cb(null, Date.now() + path.extname(file.originalname));
        }
    });
    const fileFilter = (req, file, cb) => {
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
            cb(null, false)
        } else {
            cb(new Error('File not support'), true)
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
            res.json({message: 'Upload successfully', data: req.files})
        }
    });
};

router.productBody = (req, res) => {
    let uploadDir = './uploads/sellers/' + req.params.user + '/products/' + req.params.id + '/body';
    buildFolder.buildFolderSync(uploadDir);
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, uploadDir);
        },
        filename: function (req,file,cb) {
            cb(null, Date.now() + path.extname(file.originalname));
        }
    });
    const fileFilter = (req, file, cb) => {
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
            cb(null, false)
        } else {
            cb(new Error('File not support'), true)
        }
    };

    const upload = multer({
        storage: storage,
        limits: {fileSize:1024 * 1024 * 5},
        fileFilter: fileFilter
    }).single('productBody');

    upload(req,res,(err) => {
        if(err){
            res.send(err.message);
        }else{
            res.json({message: 'Upload successfully', data: req.file})
        }
    });
}

module.exports = router;
