let Product = require('../models/products');
let express = require('express');
let router = express.Router();

router.add = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    let product = new Product();

    if (req.params.seller == null) {
        res.json({ message: 'Seller is unvalidated'});
    } else if (req.body.name == null) {
        res.json({ message: 'Name is required'});
    } else if (req.body.name.length > 100) {
        res.json({ message: 'Name must be less than 30 characters'});
    } else if (req.body.price == null) {
        res.json({ message: 'Price is required'});
    } else if (req.body.stock == null) {
        res.json({ message: 'Stock is required'});
    } else if (req.body.class_type_id == null || req.body.class_region_id == null) {
        res.json({ message: 'Classification is required'});
    } else if (req.body.catalogue_id == null) {
        res.json({ message: 'Catalogue is required'});
    } else{
        product.name = req.body.name;
        product.seller_id = req.params.seller;
        product.price = req.body.price;
        product.stock = req.body.stock;
        product.class_type_id = req.body.class_type_id;
        product.class_region_id = req.body.class_region_id;
        product.catalogue_id = req.body.catalogue_id;
        product.isShow = req.body.isShow;
        product.last_edit = Date.now();

        product.save(function (err) {
            if(err)
                res.json({ message: 'Product not added!', data: null });
            else
                res.json({ message: 'Product successfully added!', data: product });
        });
    }
};

// router.show = (req, res) => {
//     res.setHeader('Content-Type', 'application/json');
//
//     if (req.params.seller == null) {
//         res.json({ message: 'Seller is unvalidated'});
//     } else if (req.body.name == null) {
//         res.json({ message: 'Name is required'});
//     } else if (req.body.name.length > 100) {
//         res.json({ message: 'Name must be less than 30 characters'});
//     } else if (req.body.price == null) {
//         res.json({ message: 'Price is required'});
//     } else if (req.body.stock == null) {
//         res.json({ message: 'Stock is required'});
//     } else if (req.body.class_type_id == null  || req.body.class_region_id == null) {
//         res.json({ message: 'Classification is required'});
//     } else if (req.body.catalogue_id == null) {
//         res.json({ message: 'Catalogue is required'});
//     } else{
//         Product.updateOne({_id: req.params.id},
//             {seller_id: req.params.seller,
//                 name: req.body.name,
//                 price: req.body.price,
//                 stock: req.body.stock,
//                 class_type_id: req.body.class_type_id,
//                 class_region_id: req.body.class_region_id,
//                 catalogue_id: req.body.catalogue_id,
//                 isShow: true,
//                 last_edit: Date.now()}, function (err, product) {
//                 if (err) {
//                     res.json({ message: 'Product edited failed', data: null});
//                 } else {
//                     res.json({ message: 'Product edited successfully', data: product});
//                 }
//             });
//     }
// };

// router.unpublished = (req, res) => {
//     res.setHeader('Content-Type', 'application/json');
//
//     if (req.params.seller == null) {
//         res.json({ message: 'Seller is unvalidated'});
//     } else if (req.body.name == null) {
//         res.json({ message: 'Name is required'});
//     } else if (req.body.name.length > 100) {
//         res.json({ message: 'Name must be less than 30 characters'});
//     } else if (req.body.price == null) {
//         res.json({ message: 'Price is required'});
//     } else if (req.body.stock == null) {
//         res.json({ message: 'Stock is required'});
//     } else if (req.body.class_type_id == null  || req.body.class_region_id == null) {
//         res.json({ message: 'Classification is required'});
//     } else if (req.body.catalogue_id == null) {
//         res.json({ message: 'Catalogue is required'});
//     } else{
//         Product.updateOne({_id: req.params.id},
//             {seller_id: req.params.seller,
//                 name: req.body.name,
//                 price: req.body.price,
//                 stock: req.body.stock,
//                 class_type_id: req.body.class_type_id,
//                 class_region_id: req.body.class_region_id,
//                 catalogue_id: req.body.catalogue_id,
//                 isShow: req.body.isShow,
//                 last_edit: Date.now()}, function (err, product) {
//                 if (err) {
//                     res.json({ message: 'Product edited failed', data: null});
//                 } else {
//                     res.json({ message: 'Product edited successfully', data: product});
//                 }
//             });
//     }
// };

router.edit = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    if (req.params.seller == null) {
        res.json({ message: 'Seller is unvalidated'});
    } else if (req.body.name == null) {
        res.json({ message: 'Name is required'});
    } else if (req.body.name.length > 100) {
        res.json({ message: 'Name must be less than 30 characters'});
    } else if (req.body.price == null) {
        res.json({ message: 'Price is required'});
    } else if (req.body.stock == null) {
        res.json({ message: 'Stock is required'});
    } else if (req.body.class_type_id == null || req.body.class_region_id == null) {
        res.json({ message: 'Classification is required'});
    } else if (req.body.catalogue_id == null) {
        res.json({ message: 'Catalogue is required'});
    } else{
        Product.updateOne({_id: req.params.id},
            {seller_id: req.params.seller,
                name: req.body.name,
                price: req.body.price,
                stock: req.body.stock,
                class_type_id: req.body.class_type_id,
                class_region_id: req.body.class_region_id,
                catalogue_id: req.body.catalogue_id,
                isShow: req.body.isShow,
                last_edit: Date.now()}, function (err, product) {
                if (err) {
                    res.json({ message: 'Product edited failed', data: null});
                } else {
                    res.json({ message: 'Product edited successfully', data: product});
                }
        });
    }
};

router.remove = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    Product.findOneAndRemove({_id: req.params.id}, function(err, product){
        if (err) {
            res.json({message: 'Product remove failed', data: null});
        } else {
            res.json({message: 'Product remove successfully', data: product});
        }
    });
};

router.getByRegion = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    Product.find({seller_id: req.params.seller, class_region_id: req.params.region}, function(err, product){
        if (err){
            res.json({message: 'Region not found', data: null});
        } else {
            res.json({data: product});
        }
    });
};

router.getByType = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    Product.find({seller_id: req.params.seller, class_type_id: req.params.type}, function(err, product){
        if (err){
            res.json({message: 'Type not found', data: null});
        } else {
            res.json({data: product});
        }
    });
};
router.getByCatalogue = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    Product.find({seller_id: req.params.seller, catalogue_id: req.params.catalogue}, function(err, product){
        if (err){
            res.json({message: 'Product not found', data: null});
        } else {
            res.json({data: product});
        }
    });
};

router.getOne = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    Product.findById(req.params.id, function(err, product){
        if (err){
            res.json({message: 'Product not found', data: null});
        } else {
            res.json({data: product});
        }
    });
};


module.exports = router;
