let Product = require('../models/products');
let Seller = require('../models/sellers');
let Classification = require('../models/classifications');
let Catalogues = require('../models/catalogues');
let Image = require('../models/images');
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
    }else if (req.body.shipping_price == null) {
        res.json({ message: 'Shipping price is required'});
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
        product.shipping_price = req.body.shipping_price;
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
    } else if (req.body.shipping_price == null) {
        res.json({ message: 'Shipping price is required'});
    }else if (req.body.stock == null) {
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
                shipping_price: req.body.shipping_price,
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
            if (product.body_id || product.detail_id) {
                Image.deleteMany({owner: req.params.id}, function (err, image) {
                    if (err) {
                        res.json({message: 'Product images remove failed', data: null});
                    } else {
                        res.json({message: 'Product and Images remove successfully', product: product, images: image});
                    }
                });
            } else {
                res.json({message: 'Product remove successfully', data: product});
            }

        }
    });
};

function escapeRegex(str){
    return str.replace(/[-[\]{}()*+?.,\\^$|#\s]/g,"\\$&");
};

router.getBySearch = (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    //console.log(req.query.name);
    let opts = [
        {path: 'seller_id', model: Seller, select: {name: 1}},
        {path: 'class_type_id', model: Classification, select: {subtitle: 1}},
        {path: 'class_region_id', model: Classification, select: {subtitle: 1}},
        {path: 'catalogue_id', model: Catalogues, select: {name: 1}},
        {path: 'body_id', model: Image, select: {path: 1}},
        {path: 'detail_id', model: Image, select: {path: 1}},
    ];

    if(req.query.name){
        const regex = new RegExp(escapeRegex(req.query.name), 'gi');
        Product.find({name: regex, isShow: true}).populate(opts).exec(function (err, products) {
            if(!products)
                res.send('Not found!');
            else
                res.send(JSON.stringify(products,null,5));
        });
    }else{
        Product.find({isShow: true}).populate(opts).exec(function (err, products) {
            if(!products)
                res.send('No product');
            else
                res.send(JSON.stringify(products,null,5));
        });
    }
};

router.getByRegion = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    let opts = [
        {path: 'seller_id', model: Seller, select: {name: 1}},
        {path: 'class_type_id', model: Classification, select: {subtitle: 1}},
        {path: 'class_region_id', model: Classification, select: {subtitle: 1}},
        {path: 'catalogue_id', model: Catalogues, select: {name: 1}},
        {path: 'body_id', model: Image, select: {path: 1}},
        {path: 'detail_id', model: Image, select: {path: 1}},
    ];

    Product.find({class_region_id: req.params.region, isShow: true}).populate(opts).exec(function(err, product){
        if (err){
            res.json({message: 'Region not found', data: null});
        } else {
            res.json({data: product});
        }
    });
};

router.getByType = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    let opts = [
        {path: 'seller_id', model: Seller, select: {name: 1}}
    ];

    Product.find({seller_id: req.params.seller, class_type_id: req.params.type}).populate(opts).exec(function(err, product){
        if (err){
            res.json({message: 'Type not found', data: null});
        } else {
            res.json({data: product});
        }
    });
};

router.getByCatalogue = (req, res) => {

    let opts = [
        {path: 'body_id', model: Image, select: {path: 1}},
        {path: 'detail_id', model: Image, select: {path: 1}},
        {path: 'seller_id', model: Seller, select: {name: 1}},
        {path: 'class_type_id', model: Classification, select: {subtitle: 1}},
        {path: 'class_region_id', model: Classification, select: {subtitle: 1}},
        {path: 'catalogue_id', model: Catalogues, select: {name: 1}}
    ];

    Product.find({seller_id: req.params.seller, catalogue_id: req.params.catalogue}).populate(opts).exec(function(err, product){
        if (err){
            res.json({message: 'Product not found', data: null});
        } else {
            res.json({data: product});
        }
    });
};

router.getByCatalogueAndRegion = (req, res) => {

    let opts = [
        {path: 'body_id', model: Image, select: {path: 1}},
        {path: 'detail_id', model: Image, select: {path: 1}},
        {path: 'seller_id', model: Seller, select: {name: 1}},
        {path: 'class_type_id', model: Classification, select: {subtitle: 1}},
        {path: 'class_region_id', model: Classification, select: {subtitle: 1}},
        {path: 'catalogue_id', model: Catalogues, select: {name: 1}}
    ];
    if (req.params.region != 'null'){
        Product.find({class_region_id: req.params.region ,class_type_id: req.params.catalogue, isShow: true}).populate(opts).exec(function(err, product){
            if (err){
                res.json({message: 'Product not found', data: null});
            } else {
                res.json({data: product});
            }
        });
    } else{
        Product.find({class_type_id: req.params.catalogue}).populate(opts).exec(function(err, product){
            if (!product){
                res.json({message: 'Product not found', data: null});
            } else {
                res.json({message: 'Found products', data: product});
            }
        });
    }
};

router.getOne = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    let opts = [
        {path: 'seller_id', model: Seller, select: {name: 1}},
        {path: 'class_type_id', model: Classification, select: {subtitle: 1}},
        {path: 'class_region_id', model: Classification, select: {subtitle: 1}},
        {path: 'catalogue_id', model: Catalogues, select: {name: 1}},
        {path: 'body_id', model: Image, select: {path: 1}},
        {path: 'detail_id', model: Image, select: {path: 1}},
    ];

    Product.findById(req.params.id).populate(opts).exec( function(err, product){
        if (err){
            res.json({message: 'Product not found', data: null});
        } else {
            res.json({data: product});
        }
    });
};

router.getAllProducts = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    let opts = [
        {path: 'seller_id', model: Seller, select: {name: 1}},
        {path: 'class_type_id', model: Classification, select: {subtitle: 1}},
        {path: 'class_region_id', model: Classification, select: {subtitle: 1}},
        {path: 'catalogue_id', model: Catalogues, select: {name: 1}},
        {path: 'body_id', model: Image, select: {path: 1}},
        {path: 'detail_id', model: Image, select: {path: 1}},
    ];

    Product.find({isShow: true}).populate(opts).exec(function(err, product){
        if (err){
            res.send(err);
        } else {
            res.json({data: product});
        }
    });
};


module.exports = router;
