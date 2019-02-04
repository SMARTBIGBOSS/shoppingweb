let Catalogue = require('../models/catalogues');
let express = require('express');
let router = express.Router();

router.create = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    let catalogue = new Catalogue();
console.log(req.params);
    if (req.params.seller == null) {
        res.json({ message: 'Seller is unvalidated'});
    } else if (req.body.name == null) {
        res.json({ message: 'Name is required'});
    } else if (req.body.name.length > 30) {
        res.json({ message: 'Name must be less than 30 characters'});
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

    if (req.params.seller == null) {
        res.json({ message: 'Seller is unvalidated'});
    } else if (req.body.name == null) {
        res.json({ message: 'Name is required'});
    } else if (req.body.name.length > 30) {
        res.json({ message: 'Name must be less than 30 characters'});
    } else {
        Catalogue.updateOne({_id: req.params.id},
            {name: req.body.name,
            seller_id: req.params.seller,
            last_edit: Date.now()}, function (err, catalogue) {
                if (err) {
                    res.json({ message: 'Catalogue edite failed', data: null});
                } else {
                    res.json({ message: 'Catalogue edited successfully', data: catalogue});
                }
            });
    }
};

router.remove = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    Catalogue.findOneAndRemove({seller_id: req.params.seller, _id: req.params.id}, function(err){
        if (err) {
            res.json({message: 'Catalogue remove failed'});
        } else {
            res.json({message: 'Catalogue remove successfully'});
        }
    });
};

router.getAll = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    Catalogue.find({seller_id: req.params.seller}, function(err, catalogue){
        if (err){
            res.json({message: 'Catalogue not found'});
        } else {
            res.json({data: catalogue});
        }
    });
};


module.exports = router;
