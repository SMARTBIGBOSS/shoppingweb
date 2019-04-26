let Catalogue = require('../models/catalogues');
let express = require('express');
let router = express.Router();

router.create = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    let catalogue = new Catalogue();
// console.log(req.params);
    if (req.params.seller == null) {
        res.json({ message: 'Seller is unvalidated',data: null });
    } else if (req.body.name == null) {
        res.json({ message: 'Name is required',data: null });
    } else if (req.body.name.length > 30) {
        res.json({ message: 'Name must be less than 30 characters',data: null });
    } else {
        catalogue.name = req.body.name;
        catalogue.seller_id = req.params.seller;
        catalogue.last_edit = Date.now();

        catalogue.save(function (err) {
            if(err)
                res.json({ message: 'Catalogue not added!', data: null });
            else
                res.json({ message: 'Catalogue successfully added!', data: catalogue });
        });
    }
};

router.edit = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    let catalogue = new Catalogue();
    catalogue.name = req.body.name;
    catalogue.seller_id = req.params.seller;
    catalogue.last_edit = Date.now();

    if (req.params.seller == null) {
        res.json({ message: 'Seller is unvalidated'});
    } else if (req.body.name == null || req.body.name == "") {
        res.json({ message: 'Name is required'});
    } else if (req.body.name.length > 30) {
        res.json({ message: 'Name must be less than 30 characters'});
    } else {
        Catalogue.updateOne({_id: req.params.id},
            {name: req.body.name,
            seller_id: req.params.seller,
            last_edit: Date.now()}, function (err, catalogue) {
                if (err) {
                    res.json({ message: 'Catalogue edited failed', data: null});
                } else {
                    res.json({ message: 'Catalogue edited successfully', data: catalogue});
                }
        });
    }
};

router.remove = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    Catalogue.findOneAndRemove({_id: req.params.id}, function(err, catalogue){
        if (err) {
            res.json({message: 'Catalogue remove failed', data: null});
        } else {
            res.json({message: 'Catalogue remove successfully', data: catalogue});
        }
    });
};

router.getAll = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    Catalogue.find({seller_id: req.params.seller}, function(err, catalogue){
        if (!catalogue){
            res.json({message: 'Catalogue not found', data: null});
        } else {
            res.json({data: catalogue});
        }
    });
};

// router.getOne = (req, res) => {
//     res.setHeader('Content-Type', 'application/json');
//
//     Catalogue.findById(req.params.id, function(err, catalogue){
//         if (err){
//             res.json({message: 'Catalogue not found', data: null});
//         } else {
//             res.json({data: catalogue});
//         }
//     });
// };

module.exports = router;
